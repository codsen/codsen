import { version } from "../package.json";
interface UnknownValueObj {
    [key: string]: any;
}
interface Opts {
    matchKeysStrictly?: boolean;
    hungryForWhitespace?: boolean;
}
declare const defaults: Opts;
declare function deleteObj(originalInput: any, objToDelete: UnknownValueObj, originalOpts?: Opts): any;
export { deleteObj, defaults, version };
