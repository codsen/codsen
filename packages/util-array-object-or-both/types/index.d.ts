declare const version: string;
interface Opts {
  msg?: string;
  optsVarName?: string;
}
declare const defaults: Opts;
declare function arrObjOrBoth(
  str: string,
  originalOpts?: Opts
): "array" | "object" | "any";

export { arrObjOrBoth, defaults, version };
