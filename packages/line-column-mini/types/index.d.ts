declare const version: string;
declare function getLineStartIndexes(str: string): number[];
interface Res {
  line: number;
  col: number;
}
/**
 * Convert string index to line-column position
 */
declare function lineCol(
  input: string | number[],
  idx: number,
  skipChecks?: boolean,
): Res | null;
/**
 * Convert line-column position to string index
 */
declare function strIdx(
  input: string,
  line: number,
  col: number,
  skipChecks?: boolean,
): number | null;

export { type Res, getLineStartIndexes, lineCol, strIdx, version };
