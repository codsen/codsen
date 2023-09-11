declare const version: string;
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = {
  [Key in string]?: JsonValue;
};
type JsonArray = JsonValue[];
interface AnyObject {
  [key: string]: any;
}
interface Opts {
  hungryForWhitespace: boolean;
  matchStrictly: boolean;
  verboseWhenMismatches: boolean;
  useWildcards: boolean;
}
declare const defaults: Opts;
/**
 * Compare anything: AST, objects, arrays, strings and nested thereof
 */
declare function compare(
  b: JsonValue,
  s: JsonValue,
  opts?: Partial<Opts>,
): boolean | string;

export {
  type AnyObject,
  type JsonArray,
  type JsonObject,
  type JsonValue,
  type Opts,
  compare,
  defaults,
  version,
};
