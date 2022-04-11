declare const version: string;
interface Opts {
  skipContainers: boolean;
  arrayStrictComparison: boolean;
}
declare const defaults: Opts;
interface Callback {
  (leftSideVal: any, rightSideVal: any, path: string): void;
}
interface ErrorCallback {
  (errStr: string): void;
}
/**
 * Like t.same assert on array of objects, where element order doesn't matter.
 */
declare function deepContains(
  tree1: any,
  tree2: any,
  cb: Callback,
  errCb: ErrorCallback,
  originalOpts?: Partial<Opts>
): void;

export { deepContains, defaults, version };
