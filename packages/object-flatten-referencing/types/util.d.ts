interface Obj {
    [key: string]: any;
}
interface Opts {
    wrapHeadsWith: string;
    wrapTailsWith: string;
    dontWrapKeys: string[];
    dontWrapPaths: string[];
    xhtml: boolean;
    preventDoubleWrapping: boolean;
    preventWrappingIfContains: string[];
    objectKeyAndValueJoinChar: string;
    wrapGlobalFlipSwitch: boolean;
    ignore: string[];
    whatToDoWhenReferenceIsMissing: 0 | 1 | 2;
    mergeArraysWithLineBreaks: boolean;
    mergeWithoutTrailingBrIfLineContainsBr: boolean;
    enforceStrictKeyset: boolean;
}
declare function flattenObject(objOrig: Obj, opts: Opts): any[];
declare function flattenArr(arrOrig: any[], opts: Opts, wrap: boolean, joinArraysUsingBrs: boolean): string;
declare function arrayiffyString(something: string | any): any;
export { flattenObject, flattenArr, arrayiffyString, Obj, Opts };
