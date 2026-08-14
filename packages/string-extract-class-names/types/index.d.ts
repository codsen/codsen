type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];
type Ranges = Range[] | null;

declare const version: string;
interface Result {
  res: string[];
  ranges: Ranges;
}
/**
 * Extracts CSS class/id names from a string
 */
declare function extract(str: string): Result;
interface CssSelectorToken {
  value: string;
  raw: string;
  range: [from: number, to: number];
}
/**
 * Decode CSS escapes in one extracted class/id selector while retaining its
 * leading dot or hash.
 */
declare function decodeCssSelector(selector: string): string;
/**
 * Read one raw class/id selector token from an exact dot/hash index.
 */
declare function readCssSelectorToken(
  str: string,
  start: number,
): CssSelectorToken | null;

export { decodeCssSelector, extract, readCssSelectorToken, version };
export type { CssSelectorToken, Result };
