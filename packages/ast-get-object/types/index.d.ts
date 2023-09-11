declare const version: string;
interface UnknownValueObj {
  [key: string]: any;
}
declare function getObj(
  originalAst: any,
  keyValPair: UnknownValueObj,
  replacementContentsArr?: UnknownValueObj[],
): any;

export { type UnknownValueObj, getObj, version };
