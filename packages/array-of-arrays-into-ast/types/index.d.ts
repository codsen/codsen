declare const version: string;
interface PlainObj {
  [key: string]: any;
}
interface Opts {
  dedupe: boolean;
}
declare const defaults: Opts;
/**
 * Turns an array of arrays of data into a nested tree of plain objects
 */
declare function generateAst(inputArr: any[], opts?: Partial<Opts>): PlainObj;

export { Opts, PlainObj, defaults, generateAst, version };
