interface UnknownValueObj {
    [key: string]: any;
}
interface Opts {
    ignoreKeys?: string[];
    ignorePaths?: string[];
    acceptArrays?: boolean;
    acceptArraysIgnore?: string | string[];
    enforceStrictKeyset?: boolean;
    schema?: UnknownValueObj;
    msg?: string;
    optsVarName?: string;
}
declare function checkTypesMini(obj: UnknownValueObj, ref: UnknownValueObj, originalOptions?: Opts): void;
export { checkTypesMini };
