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

export { defaults, deleteObj, version };
