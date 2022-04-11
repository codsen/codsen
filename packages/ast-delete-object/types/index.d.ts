declare const version: string;
interface UnknownValueObj {
  [key: string]: any;
}
interface Opts {
  matchKeysStrictly: boolean;
  hungryForWhitespace: boolean;
}
declare const defaults: Opts;
/**
 * Delete all plain objects in AST if they contain a certain key/value pair
 */
declare function deleteObj(
  originalInput: any,
  objToDelete: UnknownValueObj,
  originalOpts?: Partial<Opts>
): any;

export { defaults, deleteObj, version };
