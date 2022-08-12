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
interface UnknownValueObj {
  [key: string]: any;
}
/**
 * Compare anything: AST, objects, arrays and strings
 */
declare function looseCompare(
  bigObj: JsonValue,
  smallObj: JsonValue
): boolean | undefined;

export {
  JsonArray,
  JsonObject,
  JsonValue,
  UnknownValueObj,
  looseCompare,
  version,
};
