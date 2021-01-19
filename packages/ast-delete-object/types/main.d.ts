declare const version: string;
interface UnknownValueObj {
    [key: string]: any;
}
interface Opts {
    matchKeysStrictly?: boolean;
    hungryForWhitespace?: boolean;
}
declare const defaults: Opts;
declare function deleteObj(originalInput: any, objToDelete: UnknownValueObj, originalOpts?: Opts): any;

export { defaults, deleteObj, version };
