export { Range, Ranges } from "ranges-apply";

declare const version: string;
interface UnknownValueObj {
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
declare function groupStr(
  originalArr: string[],
  originalOpts?: Partial<Opts>
): UnknownValueObj;

export { defaults, groupStr, version };
