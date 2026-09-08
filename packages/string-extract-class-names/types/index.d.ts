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
 * Pass an isolated selector prelude or an already-tokenized selector fragment.
 * This is a context-free scanner, not an HTML or stylesheet parser. Declarations,
 * comments, strings outside attribute values, URLs, and HTML character references
 * are not recognised as outer syntax and can produce matches if they are included
 * in the input. Decode HTML character references in the HTML parsing layer before
 * constructing the selector fragment. CSS escapes remain raw in `res`.
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
interface CssToken {
  kind:
    | "identifier"
    | "at-keyword"
    | "function"
    | "string"
    | "bad-string"
    | "url"
    | "bad-url"
    | "comment"
    | "whitespace"
    | "delimiter";
  /** Decoded content; names exclude @ and (, strings exclude their quotes. */
  value: string;
  raw: string;
  /** Half-open UTF-16 offsets in the supplied CSS region. */
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
/**
 * Extract canonical class/ID inventory entries with their original source
 * spelling and UTF-16 ranges. Quoted attribute values follow CSS string rules;
 * exact ID values retain their whitespace. This is not a selector evaluator.
 */
declare function extractCssSelectorTokens(str: string): CssSelectorToken[];
/**
 * Read one lexical token at an exact UTF-16 index in an isolated CSS region.
 * Advance to range[1] to continue; out-of-range positions return null.
 *
 * Identifiers, at-keywords, function names, strings, and unquoted URLs expose
 * decoded values. Whitespace retains its raw value, comments expose their raw
 * body, bad strings expose the decoded prefix, and bad URLs have an empty value.
 * Quoted URL arguments are separate function, whitespace, and string tokens.
 * Numbers, hashes, and other grammar-specific tokens use individual delimiters
 * and identifiers; this bounded reader is not a complete CSS tokenizer/parser.
 * Callers must establish HTML boundaries and decode inline HTML references first.
 */
declare function readCssToken(str: string, start: number): CssToken | null;

export {
  decodeCssSelector,
  extract,
  extractCssSelectorTokens,
  readCssSelectorToken,
  readCssToken,
  version,
};
export type { CssSelectorToken, CssToken, Result };
