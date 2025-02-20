import { parse } from "./grammar";
import { ASTRef, __DANGER_resetNodeId } from "./ast";
import { loadCases } from "../utils/loadCases";

expect.addSnapshotSerializer({
    test: (src) => src instanceof ASTRef,
    print: (src) => `${(src as ASTRef).contents}`
});

describe('grammar', () => {

    beforeEach(() => {
        __DANGER_resetNodeId();
    });

    for (let r of loadCases(__dirname + "/test/")) {
        it('should parse ' + r.name, () => {
            expect(parse(r.code, '<unknown>')).toMatchSnapshot();
        });
    }

    for (let r of loadCases(__dirname + "/test-failed/")) {
        it('should fail ' + r.name, () => {
            expect(() => parse(r.code, '<unknown>')).toThrowErrorMatchingSnapshot();
        });
    }
});