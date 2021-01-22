declare const version: string;
interface Obj {
    [key: string]: any;
}
interface Opts {
    flattenArraysContainingStringsToBeEmpty: boolean;
}
declare function flattenAllArrays(originalIncommingObj: Obj, originalOpts?: Partial<Opts>): Obj;

export { flattenAllArrays, version };
