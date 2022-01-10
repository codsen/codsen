declare const version: string;
interface UnknownValueObj {
  [key: string]: any;
}
interface Opts {
  dedupe: boolean;
}
declare const defaults: Opts;
/**
 * Turns an array of arrays of data into a nested tree of plain objects
 */
declare function generateAst(
  input: any[],
  originalOpts?: Partial<Opts>
): UnknownValueObj;

export { defaults, generateAst, version };
