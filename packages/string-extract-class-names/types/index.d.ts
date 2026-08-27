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
 * Extract raw CSS class and ID selector spellings from a selector fragment.
 *
 * In addition to dot and hash selectors, this function recognises HTML-style
 * `[class=...]`, `[class~=...]`, and `[id=...]` attribute selectors. Attribute
 * names are ASCII-case-insensitive. Values can use CSS identifier or string
 * syntax, and an exact class string can contain multiple HTML class tokens.
 * Partial-match attribute operators do not produce selectors.
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
