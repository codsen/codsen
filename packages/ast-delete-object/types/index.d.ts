declare const version: string;
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = {
  [Key in string]?: JsonValue;
};
type JsonArray = JsonValue[];
interface Opts {
  matchKeysStrictly: boolean;
  hungryForWhitespace: boolean;
}
declare const defaults: Opts;
/**
 * Delete all plain objects in AST if they contain a certain key/value pair
 */
declare function deleteObj<T extends JsonValue>(
  input: T,
  objToDelete: JsonObject,
  opts?: Partial<Opts>
): T;

export { JsonArray, JsonObject, JsonValue, Opts, defaults, deleteObj, version };
