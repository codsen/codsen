import { version } from "../package.json";
interface Obj {
    [key: string]: any;
}
interface Opts {
    heads: string;
    tails: string;
    headsNoWrap: string;
    tailsNoWrap: string;
    lookForDataContainers: boolean;
    dataContainerIdentifierTails: string;
    wrapHeadsWith: string | string[];
    wrapTailsWith: string | string[];
    dontWrapVars: string[];
    preventDoubleWrapping: boolean;
    wrapGlobalFlipSwitch: boolean;
    noSingleMarkers: boolean;
    resolveToBoolIfAnyValuesContainBool: boolean;
    resolveToFalseIfAnyValuesContainBool: boolean;
    throwWhenNonStringInsertedInString: boolean;
    allowUnresolved: boolean;
}
declare const defaults: Opts;
declare function jVar(input: Obj, originalOpts?: Opts): Obj;
export { jVar, defaults, version };
