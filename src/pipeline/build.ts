import { beginCell, Cell, Dictionary } from 'ton-core';
import { fromBoc } from 'tvm-disassembler/dist/disassembler';
import { writeTypescript } from '../bindings/writeTypescript';
import { featureEnable } from '../config/features';
import { ConfigProject } from "../config/parseConfig";
import { CompilerContext } from "../context";
import { funcCompile } from '../func/funcCompile';
import { writeReport } from '../generator/writeReport';
import { getRawAST } from '../grammar/store';
import files from '../imports/stdlib';
import { consoleLogger, TactLogger } from '../logger';
import { PackageFileFormat } from '../packaging/fileFormat';
import { packageCode } from '../packaging/packageCode';
import { createABITypeRefFromTypeRef } from '../types/resolveABITypeRef';
import { getContracts, getType } from '../types/resolveDescriptors';
import { errorToString } from '../utils/errorToString';
import { createVirtualFileSystem } from '../vfs/createVirtualFileSystem';
import { VirtualFileSystem } from '../vfs/VirtualFileSystem';
import { compile } from './compile';
import { precompile } from "./precompile";
const version = require('../../package.json').version;

export async function build(args: {
    config: ConfigProject,
    project: VirtualFileSystem,
    stdlib: string | VirtualFileSystem,
    logger?: TactLogger | null | undefined
}) {

    const { config, project } = args;
    const stdlib = (typeof args.stdlib === 'string') ? createVirtualFileSystem(args.stdlib, files) : args.stdlib;
    const logger: TactLogger = args.logger || consoleLogger;

    // Configure context
    let ctx: CompilerContext = new CompilerContext({ shared: {} });
    let cfg: string = JSON.stringify({
        entrypoint: config.path,
        options: (config.options || {})
    });
    if (config.options) {
        if (config.options.debug) {
            logger.error('   > 👀 Enabling debug');
            ctx = featureEnable(ctx, 'debug');
        }
        if (config.options.masterchain) {
            logger.error('   > 👀 Enabling masterchain');
            ctx = featureEnable(ctx, 'masterchain');
        }
        if (config.options.experimental && config.options.experimental.inline) {
            logger.error('   > 👀 Enabling inline');
            ctx = featureEnable(ctx, 'inline');
        }
    }

    // Precompile
    try {
        ctx = precompile(ctx, project, stdlib, config.path);
    } catch (e) {
        logger.error('Tact compilation failed');
        logger.error(errorToString(e));
        return false;
    }

    // Compile contracts
    let ok = true;
    let built: {
        [key: string]: {
            codeBoc: Buffer,
            codeFunc: string,
            codeFift: string,
            codeFiftDecompiled: string,
            abi: string
        }
    } = {};
    for (let contract of getContracts(ctx)) {
        let pathAbi = project.resolve(config.output, config.name + '_' + contract + ".abi");

        let pathCodeFc = project.resolve(config.output, config.name + '_' + contract + ".code.fc");
        let pathCodeBoc = project.resolve(config.output, config.name + '_' + contract + ".code.boc");
        let pathCodeFif = project.resolve(config.output, config.name + '_' + contract + ".code.fif");
        let pathCodeFifDec = project.resolve(config.output, config.name + '_' + contract + ".code.rev.fif");

        // Compiling contract to func
        logger.log('   > ' + contract + ': tact compiler');
        let abi: string;
        let codeFunc: string;
        try {
            let res = await compile(ctx, contract);
            project.writeFile(pathCodeFc, res.output.output);
            project.writeFile(pathAbi, res.output.abi);
            abi = res.output.abi;
            codeFunc = res.output.output;
        } catch (e) {
            logger.error('Tact compilation failed');
            logger.error(errorToString(e));
            ok = false;
            continue;
        }

        // Compiling contract to TVM
        logger.log('   > ' + contract + ': func compiler');
        let codeBoc: Buffer;
        let codeFift: string;
        try {
            let stdlibPath = stdlib.resolve('stdlib.fc');
            let stdlibCode = stdlib.readFile(stdlibPath).toString();
            let stdlibExPath = stdlib.resolve('stdlib_ex.fc');
            let stdlibExCode = stdlib.readFile(stdlibExPath).toString();
            let c = await funcCompile({
                sources: [{
                    path: stdlibPath,
                    content: stdlibCode
                }, {
                    path: stdlibExPath,
                    content: stdlibExCode,
                }, {
                    path: pathCodeFc,
                    content: codeFunc
                }],
                logger
            });
            if (!c.ok) {
                logger.error(c.log);
                ok = false;
                continue;
            }
            project.writeFile(pathCodeFif, c.fift);
            project.writeFile(pathCodeBoc, c.output);
            codeFift = c.fift;
            codeBoc = c.output;
        } catch (e) {
            logger.error('FunC compiler crashed');
            logger.error(errorToString(e));
            ok = false;
            continue;
        }

        // Fift decompiler for generated code debug
        logger.log('   > ' + contract + ': fift decompiler');
        let codeFiftDecompiled: string;
        try {
            codeFiftDecompiled = fromBoc(codeBoc);
            project.writeFile(pathCodeFifDec, codeFiftDecompiled);
        } catch (e) {
            logger.error('Fift decompiler crashed');
            logger.error(errorToString(e));
            ok = false;
            continue;
        }

        // Add to built map
        built[contract] = {
            codeFunc,
            codeBoc,
            codeFift,
            codeFiftDecompiled,
            abi
        };
    }
    if (!ok) {
        logger.log('💥 Compilation failed. Skipping packaging');
        return false;
    }

    // Package
    logger.log('   > Packaging');
    let contracts = getContracts(ctx);
    let packages: PackageFileFormat[] = [];
    for (let contract of contracts) {
        logger.log('   > ' + contract);
        let artifacts = built[contract];
        if (!artifacts) {
            logger.error('   > ' + contract + ': no artifacts found');
            return false;
        }

        // System cell
        const depends = Dictionary.empty(Dictionary.Keys.Uint(16), Dictionary.Values.Cell());
        const ct = getType(ctx, contract);
        depends.set(ct.uid, Cell.fromBoc(built[ct.name].codeBoc)[0]); // Mine
        for (let c of ct.dependsOn) {
            let cd = built[c.name];
            if (!cd) {
                logger.error('   > ' + cd + ': no artifacts found');
                return false;
            }
            depends.set(c.uid, Cell.fromBoc(cd.codeBoc)[0]);
        }
        const systemCell = beginCell().storeDict(depends).endCell();

        // Collect sources
        let sources: { [key: string]: string } = {};
        let rawAst = getRawAST(ctx);
        for (let source of [...rawAst.funcSources, ...rawAst.sources]) {
            if (source.path.startsWith(project.root) && !source.path.startsWith(stdlib.root)) {
                sources[source.path.slice(project.root.length)] = Buffer.from(source.code).toString('base64');
            }
        }

        // Package
        let pkg: PackageFileFormat = {
            name: contract,
            abi: artifacts.abi,
            code: artifacts.codeBoc.toString('base64'),
            init: {
                kind: 'direct',
                args: getType(ctx, contract).init!.args.map((v) => ({ name: v.name, type: createABITypeRefFromTypeRef(v.type) })),
                prefix: {
                    bits: 1,
                    value: 0,
                },
                deployment: {
                    kind: 'system-cell',
                    system: systemCell.toBoc().toString('base64')
                },
            },
            sources,
            compiler: {
                name: 'tact',
                version,
                parameters: cfg
            }
        };
        let pkgData = packageCode(pkg);
        let pathPkg = project.resolve(config.output, config.name + '_' + contract + ".pkg");
        project.writeFile(pathPkg, pkgData);
        packages.push(pkg);
    }

    // Bindings
    logger.log('   > Bindings');
    for (let pkg of packages) {
        logger.log('   > ' + pkg.name);
        if (pkg.init.deployment.kind !== 'system-cell') {
            logger.error('   > ' + pkg.name + ': unsupported deployment kind ' + pkg.init.deployment.kind);
            return false;
        }
        try {
            let bindingsServer = writeTypescript(JSON.parse(pkg.abi), {
                code: pkg.code,
                prefix: pkg.init.prefix,
                system: pkg.init.deployment.system,
                args: pkg.init.args
            });
            project.writeFile(project.resolve(config.output, config.name + '_' + pkg.name + ".ts"), bindingsServer);
        } catch (e) {
            logger.error('Bindings compiler crashed');
            logger.error(errorToString(e));
            return false;
        }
    }

    // Reports
    logger.log('   > Reports');
    for (let pkg of packages) {
        logger.log('   > ' + pkg.name);
        try {
            let report = writeReport(ctx, pkg);
            let pathBindings = project.resolve(config.output, config.name + '_' + pkg.name + ".md");
            project.writeFile(pathBindings, report);
        } catch (e) {
            logger.error('Report generation crashed');
            logger.error(errorToString(e));
            return false;
        }
    }

    return true;
}