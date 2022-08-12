declare function isNumeric(str: any): boolean;
declare function findType(something: string): string;

declare const version: string;
interface Res {
  res: string[][];
  msgContent: null | string;
  msgType: null | string;
}
/**
 * Sorts double-entry bookkeeping CSV coming from internet banking
 */
declare function sort(input: string): Res;

export { Res, findType, isNumeric, sort, version };
