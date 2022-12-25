declare const version: string;
declare const leftSingleQuote = "\u2018";
declare const rightSingleQuote = "\u2019";
declare const leftDoubleQuote = "\u201C";
declare const rightDoubleQuote = "\u201D";
declare const rawNDash = "\u2013";
declare const rawMDash = "\u2014";
declare const rawNbsp = "\u00A0";
declare const rawEllipsis = "\u2026";
declare const rawHairspace = "\u200A";
declare const singlePrime = "\u2032";
declare const doublePrime = "\u2033";
declare const backslash = "\\";
declare const rawReplacementMark = "\uFFFD";
declare const backtick = "`";
declare const punctuationChars: string[];
declare function isNumberChar(value: unknown): boolean;
declare function isLetter(value: unknown): boolean;
declare function isLatinLetter(value: unknown): boolean;
declare function isQuote(value: unknown): boolean;
declare function isLowercaseLetter(value: unknown): boolean;
declare function isUppercaseLetter(value: unknown): boolean;
declare const removeTrailingSlash: <T>(value: T) => string | T;
/**
 * Tells, is given input a plain object (an object literal,
 * a container object Object.create(null) or created by new Object())
 * @param value unknown
 * @returns boolean
 */
declare function isPlainObject(value: unknown): boolean;
/**
 * Adapted from https://stackoverflow.com/a/21350614
 * @param str input string
 * @param index starting index
 * @param count how many characters to replace
 * @param add what string to insert
 * @returns string
 */
declare function stringSplice(
  str?: string,
  index?: number,
  count?: number,
  add?: string
): string;
declare const voidTags: string[];
declare const inlineTags: Set<string>;

export {
  backslash,
  backtick,
  doublePrime,
  inlineTags,
  isLatinLetter,
  isLetter,
  isLowercaseLetter,
  isNumberChar,
  isPlainObject,
  isQuote,
  isUppercaseLetter,
  leftDoubleQuote,
  leftSingleQuote,
  punctuationChars,
  rawEllipsis,
  rawHairspace,
  rawMDash,
  rawNDash,
  rawNbsp,
  rawReplacementMark,
  removeTrailingSlash,
  rightDoubleQuote,
  rightSingleQuote,
  singlePrime,
  stringSplice,
  version,
  voidTags,
};
