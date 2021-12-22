declare const version: string;
interface UnknownValueObj {
    [key: string]: any;
}
interface Opts {
    throwIfEmpty?: boolean;
    cb?: null | ((varValue: string) => any);
}
declare const defaults: Opts;
declare function extractVars(str: string, originalOpts?: Partial<Opts>): UnknownValueObj;

export { defaults, extractVars, version };
