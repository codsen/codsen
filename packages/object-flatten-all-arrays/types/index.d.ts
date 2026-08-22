declare const version: string;
interface Obj {
  [key: string]: any;
}
interface Opts {
  flattenArraysContainingStringsToBeEmpty: boolean;
  /** Reuse an exclusively owned input tree instead of cloning it. The input may be mutated. */
  reuseInput?: boolean;
}
declare const defaults: Opts;
declare function flattenAllArrays(input: Obj, opts?: Partial<Opts>): Obj;

export { defaults, flattenAllArrays, version };
export type { Obj, Opts };
