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
declare function noNewKeys(
  inputOuter: JsonValue,
  referenceOuter: JsonValue,
  originalOptsOuter?: Opts
): any;

export { noNewKeys, version };
