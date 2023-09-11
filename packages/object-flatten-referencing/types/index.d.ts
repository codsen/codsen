export { arrayiffy } from "arrayiffy-if-string";
import { JSONObject, JSONValue } from "codsen-utils";

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
declare function flattenObject(obj: JSONObject, opts?: Partial<Opts>): any[];
declare function flattenArr(
  arr: any[],
  opts?: Partial<Opts>,
  wrap?: boolean,
  joinArraysUsingBrs?: boolean,
): string;

declare const version: string;
declare function flattenReferencing(
  input: JSONValue,
  reference: JSONValue,
  opts?: Partial<Opts>,
): any;

export {
  type Opts,
  defaults,
  flattenArr,
  flattenObject,
  flattenReferencing,
  version,
};
