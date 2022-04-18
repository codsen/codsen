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
  mode: 1 | 2;
}
declare const defaults: Opts;
declare function noNewKeys(
  input: JsonValue,
  reference: JsonValue,
  opts?: Partial<Opts>
): any;

export { defaults, noNewKeys, version };
