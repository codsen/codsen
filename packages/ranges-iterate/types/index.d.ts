declare type Range = [from: number, to: number] | [from: number, to: number, whatToInsert: string | null | undefined];
declare type Ranges = Range[] | null;

declare const version: string;
interface Obj {
    i: number;
    val: any;
}
declare type Callback = (obj: Obj) => void;
declare function rIterate(str: string, originalRanges: Ranges, cb: Callback, offset?: number): void;

export { rIterate, version };
