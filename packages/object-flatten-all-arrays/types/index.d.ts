declare const version: string;
interface Obj {
  [key: string]: any;
}
interface Opts {
  flattenArraysContainingStringsToBeEmpty: boolean;
}
declare const defaults: Opts;
declare function flattenAllArrays(input: Obj, opts?: Partial<Opts>): Obj;

export { defaults, flattenAllArrays, version };
