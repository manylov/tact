import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    TupleBuilder,
    DictionaryValue
} from 'ton-core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Update = {
    $$type: 'Update';
    a: bigint;
    b: boolean;
    c: Cell;
    d: Cell;
    e: Cell;
    f: string;
}

export function storeUpdate(src: Update) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2217298645, 32);
        b_0.storeInt(src.a, 257);
        b_0.storeBit(src.b);
        b_0.storeRef(src.c);
        b_0.storeRef(src.d);
        b_0.storeRef(src.e);
        let b_1 = new Builder();
        b_1.storeStringRefTail(src.f);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadUpdate(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2217298645) { throw Error('Invalid prefix'); }
    let _a = sc_0.loadIntBig(257);
    let _b = sc_0.loadBit();
    let _c = sc_0.loadRef();
    let _d = sc_0.loadRef();
    let _e = sc_0.loadRef();
    let sc_1 = sc_0.loadRef().beginParse();
    let _f = sc_1.loadStringRefTail();
    return { $$type: 'Update' as const, a: _a, b: _b, c: _c, d: _d, e: _e, f: _f };
}

function loadTupleUpdate(source: TupleReader) {
    let _a = source.readBigNumber();
    let _b = source.readBoolean();
    let _c = source.readCell();
    let _d = source.readCell();
    let _e = source.readCell();
    let _f = source.readString();
    return { $$type: 'Update' as const, a: _a, b: _b, c: _c, d: _d, e: _e, f: _f };
}

function storeTupleUpdate(source: Update) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.a);
    builder.writeBoolean(source.b);
    builder.writeCell(source.c);
    builder.writeSlice(source.d);
    builder.writeBuilder(source.e);
    builder.writeString(source.f);
    return builder.build();
}

function dictValueParserUpdate(): DictionaryValue<Update> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeUpdate(src)).endCell());
        },
        parse: (src) => {
            return loadUpdate(src.loadRef().beginParse());
        }
    }
}

 type SerializationTester_init_args = {
    $$type: 'SerializationTester_init_args';
    a: bigint;
    b: boolean;
    c: Cell;
    d: Cell;
    e: Cell;
    f: string;
}

function initSerializationTester_init_args(src: SerializationTester_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.a, 257);
        b_0.storeBit(src.b);
        b_0.storeRef(src.c);
        b_0.storeRef(src.d);
        let b_1 = new Builder();
        b_1.storeRef(src.e);
        b_1.storeStringRefTail(src.f);
        b_0.storeRef(b_1.endCell());
    };
}

async function SerializationTester_init(a: bigint, b: boolean, c: Cell, d: Cell, e: Cell, f: string) {
    const __code = Cell.fromBase64('te6ccgECGwEAA9MAART/APSkE/S88sgLAQIBYgIDAX7QAdDTAwFxsMABkX+RcOIB+kABINdJgQELuvLgiCDXCwoggwm6IYEE/7qx8uCIgwm68uCJVFBTA28E+GEC+GIEAgFYCAkDlO1E0NQB+GPSAAGOJYEBAdcA0gDU1AHQAdQB0MgB1AHQEs8WAdQw0BAmECUQJBAjbBaOkfgo1wsKgwm68uCJ2zwG0VUE4lUV2zwwGQUGAWZwIddJwh+VMCDXCx/eApJbf+AhwAAh10nBIbCSW3/gAYIQhClK1bqOh9s8bBZsZn/gMHAHAGzI+EMBzH8BygBVUFBWgQEBzwATygDMyFjPFskBzMjIA8nQE88WyVjMyFADzxbJWMzJAczJ7VQAVtMfAYIQhClK1bry4IGBAQHXANIA1NQB0MgC1AHQE88WAtQB0NQw0BYVFBMCASAKCwIBIBMUApO2n32omhqAPwx6QAAxxLAgIDrgGkAamoA6ADqAOhkAOoA6AlniwDqGGgIEwgSiBIIEbYLR0j8FGuFhUGE3XlwRO2eA2iqgnFtnkBkMAgEgDQ4ABGxRApOxJjtRNDUAfhj0gABjiWBAQHXANIA1NQB0AHUAdDIAdQB0BLPFgHUMNAQJhAlECQQI2wWjpH4KNcLCoMJuvLgids8BtFVBOLbPIBkPAgEgEBEABhVfBQKTrlz2omhqAPwx6QAAxxLAgIDrgGkAamoA6ADqAOhkAOoA6AlniwDqGGgIEwgSiBIIEbYLR0j8FGuFhUGE3XlwRO2eA2iqgnFtnkAZEgC5rejBOC52Hq6WVz2PQnYc6yVCjbNBOE7rGpaVsj5ZkWnXlv74sRzBOBAq4A3AM7HKZywdVyOS2WHBOA3qTvfKost446np7wKs4ZNBOE7Lpy1Zp2W5nQdLNsozdFJAAAgQJV8FAgEgFRYCk7SDnaiaGoA/DHpAADHEsCAgOuAaQBqagDoAOoA6GQA6gDoCWeLAOoYaAgTCBKIEggRtgtHSPwUa4WFQYTdeXBE7Z4DaKqCcW2eQGRoCk7EXu1E0NQB+GPSAAGOJYEBAdcA0gDU1AHQAdQB0MgB1AHQEs8WAdQw0BAmECUQJBAjbBaOkfgo1wsKgwm68uCJ2zwG0VUE4ts8gGRcCk7Ef+1E0NQB+GPSAAGOJYEBAdcA0gDU1AHQAdQB0MgB1AHQEs8WAdQw0BAmECUQJBAjbBaOkfgo1wsKgwm68uCJ2zwG0VUE4ts8gGRgACBA1XwUACBBFXwUARoEBAdcA0gDU1AHQAdQB0MgB1AHQEs8WAdQw0BAmECUQJBAjAARfBQ==');
    const __system = Cell.fromBase64('te6cckECHQEAA90AAQHAAQEFoBg3AgEU/wD0pBP0vPLICwMCAWIXBAIBWA0FAgEgCAYCk7SDnaiaGoA/DHpAADHEsCAgOuAaQBqagDoAOoA6GQA6gDoCWeLAOoYaAgTCBKIEggRtgtHSPwUa4WFQYTdeXBE7Z4DaKqCcW2eQHAcABF8FAgEgCwkCk7Ef+1E0NQB+GPSAAGOJYEBAdcA0gDU1AHQAdQB0MgB1AHQEs8WAdQw0BAmECUQJBAjbBaOkfgo1wsKgwm68uCJ2zwG0VUE4ts8gHAoACBBFXwUCk7EXu1E0NQB+GPSAAGOJYEBAdcA0gDU1AHQAdQB0MgB1AHQEs8WAdQw0BAmECUQJBAjbBaOkfgo1wsKgwm68uCJ2zwG0VUE4ts8gHAwACBA1XwUCASAVDgIBIBMPAgEgERAAua3owTgudh6ullc9j0J2HOslQo2zQThO6xqWlbI+WZFp15b++LEcwTgQKuANwDOxymcsHVcjktlhwTgN6k73yqLLeOOp6e8CrOGTQThOy6ctWadluZ0HSzbKM3RSQAKTrlz2omhqAPwx6QAAxxLAgIDrgGkAamoA6ADqAOhkAOoA6AlniwDqGGgIEwgSiBIIEbYLR0j8FGuFhUGE3XlwRO2eA2iqgnFtnkAcEgAIECVfBQKTsSY7UTQ1AH4Y9IAAY4lgQEB1wDSANTUAdAB1AHQyAHUAdASzxYB1DDQECYQJRAkECNsFo6R+CjXCwqDCbry4InbPAbRVQTi2zyAcFAAGFV8FApO2n32omhqAPwx6QAAxxLAgIDrgGkAamoA6ADqAOhkAOoA6AlniwDqGGgIEwgSiBIIEbYLR0j8FGuFhUGE3XlwRO2eA2iqgnFtnkBwWAARsUQF+0AHQ0wMBcbDAAZF/kXDiAfpAASDXSYEBC7ry4Igg1wsKIIMJuiGBBP+6sfLgiIMJuvLgiVRQUwNvBPhhAvhiGAOU7UTQ1AH4Y9IAAY4lgQEB1wDSANTUAdAB1AHQyAHUAdASzxYB1DDQECYQJRAkECNsFo6R+CjXCwqDCbry4InbPAbRVQTiVRXbPDAcGhkAbMj4QwHMfwHKAFVQUFaBAQHPABPKAMzIWM8WyQHMyMgDydATzxbJWMzIUAPPFslYzMkBzMntVAFmcCHXScIflTAg1wsf3gKSW3/gIcAAIddJwSGwklt/4AGCEIQpStW6jofbPGwWbGZ/4DBwGwBW0x8BghCEKUrVuvLggYEBAdcA0gDU1AHQyALUAdATzxYC1AHQ1DDQFhUUEwBGgQEB1wDSANTUAdAB1AHQyAHUAdASzxYB1DDQECYQJRAkECNUSEOe');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initSerializationTester_init_args({ $$type: 'SerializationTester_init_args', a, b, c, d, e, f })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const SerializationTester_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
}

export class SerializationTester implements Contract {
    
    static async init(a: bigint, b: boolean, c: Cell, d: Cell, e: Cell, f: string) {
        return await SerializationTester_init(a, b, c, d, e, f);
    }
    
    static async fromInit(a: bigint, b: boolean, c: Cell, d: Cell, e: Cell, f: string) {
        const init = await SerializationTester_init(a, b, c, d, e, f);
        const address = contractAddress(0, init);
        return new SerializationTester(address, init);
    }
    
    static fromAddress(address: Address) {
        return new SerializationTester(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        errors: SerializationTester_errors
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: null | Update) {
        
        let body: Cell | null = null;
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Update') {
            body = beginCell().store(storeUpdate(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetA(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('getA', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getGetB(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('getB', builder.build())).stack;
        let result = source.readBoolean();
        return result;
    }
    
    async getGetC(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('getC', builder.build())).stack;
        let result = source.readCell();
        return result;
    }
    
    async getGetD(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('getD', builder.build())).stack;
        let result = source.readCell();
        return result;
    }
    
    async getGetE(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('getE', builder.build())).stack;
        let result = source.readCell();
        return result;
    }
    
    async getGetF(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('getF', builder.build())).stack;
        let result = source.readString();
        return result;
    }
    
}