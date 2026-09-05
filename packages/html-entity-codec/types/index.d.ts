interface Completion {
  inputLength: number;
  outputLength: number;
  replacements: number;
  timeTakenInMilliseconds: number;
}
interface ObserveOptions {
  /** Receives monotonic percentages from 0 to 100. */
  reportProgressFunc?: (percentage: number) => void;
  /** Receives completion statistics; the transformed string remains the return value. */
  reportCompletionFunc?: (completion: Completion) => void;
}

interface ScanOptions {
  /** Attribute context rejects legacy names followed by ASCII letters, digits, or =. */
  context?: "text" | "attribute";
  /** Leave references without a trailing semicolon unchanged. */
  requireSemicolon?: boolean;
  /** Throw a SyntaxError for HTML character-reference parse errors. */
  strict?: boolean;
}
interface DecodeOptions extends ScanOptions, ObserveOptions {}
interface Reference {
  /** Exclusive UTF-16 offset in the original string. */
  end: number;
  value: string;
}
/** Read one reference beginning at an ampersand, without decoding its output again. */
declare function scanReference(
  str: string,
  index: number,
  opts?: ScanOptions,
): Reference | null;
/** Decode HTML references in one pass. Repeated decoding belongs to the caller. */
declare function decode(str: string, opts?: DecodeOptions): string;

interface EncodeOptions extends ObserveOptions {
  /** Prefer canonical names; otherwise emit uppercase hexadecimal references. */
  useNamedReferences?: boolean;
}
/** Encode non-ASCII characters and HTML-sensitive ASCII with Codsen's stable spelling policy. */
declare function encode(str: string, opts?: EncodeOptions): string;

/** Numeric-only encoding; bundlers can omit the canonical named table. */
declare function encodeNumeric(str: string, opts?: ObserveOptions): string;

interface EscapeAttributeOptions extends ObserveOptions {
  /** Match the surrounding HTML quote delimiter; default: double. */
  quote?: "single" | "double" | "both";
}
/** Escape a quoted HTML attribute value. The caller supplies surrounding quotes. */
declare function escapeAttribute(
  str: string,
  opts?: EscapeAttributeOptions,
): string;
/** Escape an ordinary HTML text node; raw-text elements have different rules. */
declare function escapeText(str: string, opts?: ObserveOptions): string;

declare const version: string;

export {
  decode,
  encode,
  encodeNumeric,
  escapeAttribute,
  escapeText,
  scanReference,
  version,
};
export type {
  Completion,
  DecodeOptions,
  EncodeOptions,
  EscapeAttributeOptions,
  ObserveOptions,
  Reference,
  ScanOptions,
};
