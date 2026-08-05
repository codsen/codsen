declare const version: string;
interface Opts {
  msg: string;
  optsVarName: string;
}
declare const defaults: Opts;
type ArrayObjectOrBoth = "array" | "object" | "any";
declare function arrObjOrBoth(
  str: string,
  opts?: Partial<Opts>,
): ArrayObjectOrBoth;

export { arrObjOrBoth, defaults, version };
export type { ArrayObjectOrBoth, Opts };
