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
declare const defaults: Opts;
declare function flattenObject(obj: Obj, opts?: Partial<Opts>): any[];
declare function flattenArr(
  arr: any[],
  opts?: Partial<Opts>,
  wrap?: boolean,
  joinArraysUsingBrs?: boolean
): string;
declare function arrayiffyString(something: string | any): any;

declare const version: string;
declare function flattenReferencing(
  input: any,
  reference: any,
  opts?: Partial<Opts>
): any;

export {
  Opts,
  arrayiffyString,
  defaults,
  flattenArr,
  flattenObject,
  flattenReferencing,
  version,
};
