declare const version: string;
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = {
  [Key in string]?: JsonValue;
};
type JsonArray = JsonValue[];
interface Opts {
  mode: 1 | 2;
}
declare const defaults: Opts;
declare function noNewKeys(
  input: JsonValue,
  reference: JsonValue,
  opts?: Partial<Opts>
): string[];

export { JsonArray, JsonObject, JsonValue, Opts, defaults, noNewKeys, version };
