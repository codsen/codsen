declare const version: string;
interface Stop {
  now: boolean;
}
type TreePrimitive = string | number | boolean | null | undefined;
type TreeValue = TreePrimitive | TreeArray | TreeObject;
interface TreeArray extends Array<TreeValue> {}
interface TreeObject {
  [key: string]: TreeValue;
}
type ReadonlyTreeValue = TreePrimitive | ReadonlyTreeArray | ReadonlyTreeObject;
interface ReadonlyTreeArray extends ReadonlyArray<ReadonlyTreeValue> {}
interface ReadonlyTreeObject {
  readonly [key: string]: ReadonlyTreeValue;
}
type ReadonlyTreeContainer = ReadonlyTreeArray | ReadonlyTreeObject;
interface InnerObj {
  depth: number;
  path: string;
  pathSegments: readonly string[];
  topmostKey?: string;
  parent: ReadonlyTreeContainer;
  parentType: "array" | "object";
  parentKey: string | null;
}
type Callback = (
  key: string | Exclude<TreeValue, undefined>,
  val: TreeValue | undefined,
  innerObj: InnerObj,
  stop: Stop,
) => TreeValue;
/**
 * Utility library to traverse AST
 */
declare function traverse(tree1: TreeValue, cb1: Callback): TreeValue;

export { traverse, version };
export type {
  Callback,
  InnerObj,
  ReadonlyTreeArray,
  ReadonlyTreeContainer,
  ReadonlyTreeObject,
  ReadonlyTreeValue,
  Stop,
  TreeArray,
  TreeObject,
  TreePrimitive,
  TreeValue,
};
