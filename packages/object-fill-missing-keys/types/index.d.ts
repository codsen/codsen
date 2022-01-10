declare const version: string;
interface Obj {
  [key: string]: any;
}
interface Opts {
  placeholder: boolean;
  doNotFillThesePathsIfTheyContainPlaceholders: string[];
  useNullAsExplicitFalse: boolean;
}
declare function fillMissing(
  originalIncompleteWrapper: Obj,
  originalSchemaWrapper: Obj,
  originalOptsWrapper?: Opts
): Obj;

export { fillMissing, version };
