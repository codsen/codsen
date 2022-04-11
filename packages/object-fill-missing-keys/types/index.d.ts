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
  originalIncompleteWrapper: Obj,
  originalSchemaWrapper: Obj,
  originalOptsWrapper?: Partial<Opts>
): Obj;

export { defaults, fillMissing, version };
