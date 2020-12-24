import { version } from "../package.json";
interface Opts {
    skipContainers?: boolean;
    arrayStrictComparison?: boolean;
}
declare const defaults: Opts;
interface Callback {
    (leftSideVal: any, rightSideVal: any, path: string): void;
}
interface ErrorCallback {
    (errStr: string): void;
}
declare function deepContains(tree1: any, tree2: any, cb: Callback, errCb: ErrorCallback, originalOpts?: Opts): void;
export { deepContains, defaults, version };
