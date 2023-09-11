declare const version: string;
interface Stop {
  now: boolean;
}
interface InnerObj {
  depth: number;
  path: string;
  topmostKey: string;
  parent: any;
  parentType: string;
  parentKey: string | null;
}
type Callback = (key: string, val: any, innerObj: InnerObj, stop: Stop) => any;
/**
 * Utility library to traverse AST
 */
declare function traverse<T>(tree1: T, cb1: Callback): T;

export { type Callback, type InnerObj, type Stop, traverse, version };
