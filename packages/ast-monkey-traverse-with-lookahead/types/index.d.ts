declare const version: string;
interface Obj {
  [key: string]: any;
}
type NextToken = [
  key: "string",
  value: any,
  innerObj: {
    depth: number;
    path: string;
    parent: any;
    parentType: string;
  },
];
interface InnerObj {
  depth: number;
  path: string;
  topmostKey?: string;
  parent?: any;
  parentType?: string;
  next?: NextToken[];
}
type Callback = (
  key: string | Obj,
  val: any,
  innerObj: InnerObj,
  stop: {
    now: boolean;
  },
) => any;
declare function traverse(tree1: any, cb1: Callback, lookahead?: number): void;

export {
  type Callback,
  type InnerObj,
  type NextToken,
  type Obj,
  traverse,
  version,
};
