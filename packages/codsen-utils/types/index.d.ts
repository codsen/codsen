declare const version: string;
declare const leftSingleQuote = "\u2018";
declare const rightSingleQuote = "\u2019";
declare const leftDoubleQuote = "\u201C";
declare const rightDoubleQuote = "\u201D";
declare const rawNDash = "\u2013";
declare const rawMDash = "\u2014";
declare const rawNbsp = "\u00A0";
declare const ellipsis = "\u2026";
declare const hairspace = "\u200A";
declare const thinSpace = "\u2009";
declare const singlePrime = "\u2032";
declare const doublePrime = "\u2033";
declare const backslash = "\\";
declare const rawReplacementMark = "\uFFFD";
declare const backtick = "`";
declare const multiplicationSign = "\u00D7";
declare const punctuationChars: string[];
interface Obj {
  [key: string]: any;
}
declare function isNumberChar(value: unknown): boolean;
declare function isCurrencyChar(value: unknown): boolean;
declare function isCurrencySymbol(value: unknown): boolean;
declare function isLetter(value: unknown): boolean;
declare function isLatinLetter(value: unknown): boolean;
declare function isQuote(value: unknown): boolean;
declare function isLowercaseLetter(value: unknown): boolean;
declare function isUppercaseLetter(value: unknown): boolean;
declare function isWhitespaceChar(value: unknown): boolean;
declare const removeTrailingSlash: <T>(value: T) => string | T;
/**
 * Tells, is given input a plain object (an object literal,
 * a container object Object.create(null) or created by new Object())
 * @param value unknown
 * @returns boolean
 */
declare function isPlainObject(value: unknown): boolean;
/**
 * @param str input string
 * @param index starting index
 * @param count how many characters to replace
 * @param add what string to insert
 * @returns string
 * Adapted from https://stackoverflow.com/a/21350614
 */
declare function stringSplice(
  str?: string,
  index?: number,
  count?: number,
  add?: string
): string;
declare function isStr(something: unknown): something is string;
declare function isNum(something: unknown): something is number;
declare function isInt(something: unknown): something is number;
declare function isBool(something: unknown): something is boolean;
declare function isNull(something: unknown): something is null;
/**
 * Gives array of indexes of all found substring occurrences
 * @param string source string
 * @param substring what to look for
 * @returns array of findings' position indexes
 * adapted from https://stackoverflow.com/a/10710406
 * console.log(findAllIdx("scissors", "s"));
 * -> [0, 3, 4, 7]
 */
declare function findAllIdx(value: unknown, substring: unknown): number[];
/**
 * Unlike lodash equivalent, it does not mutate the input array
 * @param input
 * @param remove
 * @returns
 */
declare function pullAll<T, U>(input?: T[], remove?: U[]): T[];
declare function existy(x: unknown): boolean;
/**
 * Returns a shallow copy of input array, with only unique elements
 * @param input array
 * @returns de-duped array
 */
declare function uniq<T>(input: T[]): T[];
declare function hasOwnProp(obj: unknown, prop: string): boolean;
declare const voidTags: string[];
declare const inlineTags: Set<string>;

export {
  Obj,
  backslash,
  backtick,
  doublePrime,
  ellipsis,
  existy,
  findAllIdx,
  hairspace,
  hasOwnProp,
  inlineTags,
  isBool,
  isCurrencyChar,
  isCurrencySymbol,
  isInt,
  isLatinLetter,
  isLetter,
  isLowercaseLetter,
  isNull,
  isNum,
  isNumberChar,
  isPlainObject,
  isQuote,
  isStr,
  isUppercaseLetter,
  isWhitespaceChar,
  leftDoubleQuote,
  leftSingleQuote,
  multiplicationSign,
  pullAll,
  punctuationChars,
  rawMDash,
  rawNDash,
  rawNbsp,
  rawReplacementMark,
  removeTrailingSlash,
  rightDoubleQuote,
  rightSingleQuote,
  singlePrime,
  stringSplice,
  thinSpace,
  uniq,
  version,
  voidTags,
};
