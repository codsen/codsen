declare const version: string;
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
  allowUnresolved: boolean | string;
}
declare const defaults: Opts;
/**
 * Resolves custom-marked, cross-referenced paths in parsed JSON
 */
declare function jVar(input: Obj, originalOpts?: Partial<Opts>): Obj;

export { defaults, jVar, version };
