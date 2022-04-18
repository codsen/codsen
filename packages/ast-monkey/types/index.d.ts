export { traverse } from "ast-monkey-traverse";

declare const version: string;
declare type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonObject
  | JsonArray;
declare type JsonObject = {
  [Key in string]?: JsonValue;
};
declare type JsonArray = JsonValue[];
interface Finding {
  index: number;
  key: string;
  val: any;
  path: number[];
}
interface FindOpts {
  key: null | string;
  val: any;
  only?: undefined | null | "any" | "array" | "object";
}
declare function find(input: JsonValue, opts: FindOpts): Finding[];
interface GetOpts {
  index: number;
  only?: undefined | null | "any" | "array" | "object";
}
declare function get(input: JsonValue, opts: GetOpts): JsonValue;
interface SetOpts {
  key: null | string;
  val: any;
  index: number;
}
declare function set(input: JsonValue, opts: SetOpts): JsonValue;
interface DropOpts {
  index: number;
}
declare function drop(input: JsonValue, opts: DropOpts): JsonValue;
interface DelOpts {
  key: null | string;
  val: any;
  only?: undefined | null | "any" | "array" | "object";
}
declare function del(input: JsonValue, opts: DelOpts): JsonValue;
declare function arrayFirstOnly(input: JsonValue): JsonValue;

export { arrayFirstOnly, del, drop, find, get, set, version };
