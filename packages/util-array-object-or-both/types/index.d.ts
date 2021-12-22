interface Opts {
    msg?: string;
    optsVarName?: string;
}
declare function arrObjOrBoth(str: string, originalOpts?: Opts): "array" | "object" | "any";

export { arrObjOrBoth };
