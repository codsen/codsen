declare const version: string;
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = {
  [Key in string]?: JsonValue;
};
type JsonArray = JsonValue[];
interface UnknownValueObj {
  [key: string]: any;
}
/**
 * Compare anything: AST, objects, arrays and strings
 */
declare function looseCompare(
  bigObj: JsonValue,
  smallObj: JsonValue,
): boolean | undefined;

export { looseCompare, version };
export type { JsonArray, JsonObject, JsonValue, UnknownValueObj };
