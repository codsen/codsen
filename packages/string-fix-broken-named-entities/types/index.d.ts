declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;

interface cbObj {
    rangeFrom: number;
    rangeTo: number;
    rangeValEncoded: string | null;
    rangeValDecoded: string | null;
    ruleName: string;
    entityName: string | null;
}
interface Opts {
    decode: boolean;
    cb: (obj: cbObj) => void;
    entityCatcherCb: null | ((from: number, to: number) => void);
    progressFn: null | ((percDone: number) => void);
}
declare function fixEnt(str: string, originalOpts?: Partial<Opts>): Ranges;

export { fixEnt, version };
