export { Range, Ranges } from "ranges-apply";

declare const version: string;
interface MappingObj {
  [key: string]: any;
}
interface Opts {
  wildcard: string;
  dedupePlease: boolean;
}
declare const defaults: Opts;
/**
 * Groups array of strings by omitting number characters
 */
declare function groupStr(arr: string[], opts?: Partial<Opts>): MappingObj;

export { defaults, groupStr, version };
