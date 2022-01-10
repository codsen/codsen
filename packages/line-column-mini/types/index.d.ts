declare const version: string;
declare function getLineStartIndexes(str: string): number[];
/**
 * Convert string index to line-column position
 */
declare function lineCol(
  input: string | number[],
  idx: number,
  skipChecks?: boolean
): {
  line: number;
  col: number;
} | null;

export { getLineStartIndexes, lineCol, version };
