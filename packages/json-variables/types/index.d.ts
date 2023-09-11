import { Obj } from "codsen-utils";

declare const version: string;
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
  allowUnresolved: boolean | string;
}
declare const defaults: Opts;
/**
 * Resolves custom-marked, cross-referenced paths in parsed JSON
 */
declare function jVar(input: Obj, opts?: Partial<Opts>): Obj;

export { type Opts, defaults, jVar, version };
