declare const version: string;
interface UnknownValueObj {
    [key: string]: any;
}
interface Opts {
    wildcard: string;
    dedupePlease: boolean;
}
/**
 * Groups array of strings by omitting number characters
 */
declare function groupStr(originalArr: any[], originalOpts?: Partial<Opts>): UnknownValueObj;

export { groupStr, version };
