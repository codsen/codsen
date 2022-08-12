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
  skipChecks?: boolean
): Res | null;

export { Res, getLineStartIndexes, lineCol, version };
