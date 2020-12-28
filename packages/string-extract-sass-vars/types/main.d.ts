import { version } from "../package.json";
interface UnknownValueObj {
    [key: string]: any;
}
interface Opts {
    throwIfEmpty?: boolean;
    cb?: null | ((varValue: string) => any);
}
declare const defaults: Opts;
declare function extractVars(str: string, originalOpts?: Opts): UnknownValueObj;
export { extractVars, defaults, version };
