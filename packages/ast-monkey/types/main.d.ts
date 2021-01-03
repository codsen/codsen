import { traverse } from "ast-monkey-traverse";
import { JsonValue } from "type-fest";
import { version } from "../package.json";
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
declare function find(input: JsonValue, originalOpts: FindOpts): Finding[];
interface GetOpts {
    index: number;
    only?: undefined | null | "any" | "array" | "object";
}
declare function get(input: JsonValue, originalOpts: GetOpts): GetOpts;
interface SetOpts {
    key: null | string;
    val: any;
    index: number;
    only?: undefined | null | "any" | "array" | "object";
}
declare function set(input: JsonValue, originalOpts: SetOpts): JsonValue;
interface DropOpts {
    index: number;
    only?: undefined | null | "any" | "array" | "object";
}
declare function drop(input: JsonValue, originalOpts: DropOpts): JsonValue;
interface DelOpts {
    key: null | string;
    val: any;
    only?: undefined | null | "any" | "array" | "object";
}
declare function del(input: JsonValue, originalOpts: DelOpts): JsonValue;
declare function arrayFirstOnly(input: JsonValue): JsonValue;
export { find, get, set, drop, del, arrayFirstOnly, traverse, version };
