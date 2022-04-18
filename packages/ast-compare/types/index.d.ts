declare const version: string;
declare type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonArray;
declare type JsonObject = {
  [Key in string]?: JsonValue;
};
declare type JsonArray = JsonValue[];
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
  opts?: Partial<Opts>
): boolean | string;

export { compare, defaults, version };
