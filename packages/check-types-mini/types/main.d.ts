interface Obj {
    [key: string]: any;
}
interface Opts {
    ignoreKeys?: string[];
    ignorePaths?: string[];
    acceptArrays?: boolean;
    acceptArraysIgnore?: string | string[];
    enforceStrictKeyset?: boolean;
    schema?: Obj;
    msg?: string;
    optsVarName?: string;
}
declare function checkTypesMini(obj: Obj, ref: Obj | null, originalOptions?: Opts): void;
export { checkTypesMini };
