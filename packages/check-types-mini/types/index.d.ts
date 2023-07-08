declare const version: string;
interface Obj {
  [key: string]: any;
}
interface Opts {
  ignoreKeys: string | string[];
  ignorePaths: string | string[];
  acceptArrays: boolean;
  acceptArraysIgnore: string | string[];
  enforceStrictKeyset: boolean;
  schema: Obj;
  msg: string;
  optsVarName: string;
}
declare const defaults: Opts;
/**
 * Validate options object
 */
declare function checkTypesMini(
  obj: Obj,
  ref: Obj | null,
  opts?: Partial<Opts>,
): void;

export { checkTypesMini, defaults, version };
