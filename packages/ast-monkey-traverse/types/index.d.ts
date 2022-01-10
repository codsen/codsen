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
declare type Callback = (
  key: string,
  val: any,
  innerObj: InnerObj,
  stop: Stop
) => any;
/**
 * Utility library to traverse AST
 */
declare function traverse(tree1: any, cb1: Callback): any;

export { traverse, version };
