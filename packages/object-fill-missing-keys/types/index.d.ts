declare const version: string;
interface Obj {
  [key: string]: any;
}
interface Opts {
  placeholder: boolean;
  doNotFillThesePathsIfTheyContainPlaceholders: string[];
  useNullAsExplicitFalse: boolean;
}
declare const defaults: Opts;
declare function fillMissing(
  incomplete: Obj,
  schema: Obj,
  opts?: Partial<Opts>
): Obj;

export { Obj, Opts, defaults, fillMissing, version };
