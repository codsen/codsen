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
type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
type JsonObject = {
  [Key in string]?: JSONValue;
};
type JSONArray = JSONValue[];
interface JSONObject {
  [key: string]: JSONValue;
}
type Obj = JSONObject;
type EolChar = "\n" | "\r" | "\r\n";
type EolSetting = "lf" | "crlf" | "cr";
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
declare function isPlainObject(value: unknown): value is JSONObject;
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
declare function isRegExp(something: any): something is RegExp;
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
declare function detectEol(str: string | unknown): EolChar | undefined;
declare function resolveEolSetting(
  str: string | unknown,
  eolSetting: EolSetting | unknown,
  defaultEolChar?: EolChar
): EolChar;
declare function hasOwnProp(obj: unknown, prop: string): boolean;
/**
 * Related to @typescript-eslint/require-array-sort-compare lint error
 */
declare function compareFn(a: string, b: string): number;
declare const voidTags: string[];
declare const inlineTags: Set<string>;
/**
 * Like Array.prototype.includes() but it takes a mix of strings and/or
 * regex'es, and matches that against a string. It's also a friendly API,
 * it will not throw if the inputs are wrong.
 * @param arr - array of zero or more strings or regex'es
 * @param whatToMatch - string to match
 * @returns boolean
 */
declare function includes(
  arr: (string | RegExp)[],
  whatToMatch: string
): boolean;
/** Alternative to lodash.intersection */
declare function intersection<T, U>(a?: T[], b?: U[]): T[];
/** Alternative to lodash.omit */
declare function omit(obj: JSONObject, keysToRemove?: string[]): JSONObject;

export {
  EolChar,
  EolSetting,
  JSONArray,
  JSONObject,
  JSONValue,
  JsonObject,
  Obj,
  backslash,
  backtick,
  compareFn,
  detectEol,
  doublePrime,
  ellipsis,
  existy,
  findAllIdx,
  hairspace,
  hasOwnProp,
  includes,
  inlineTags,
  intersection,
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
  isRegExp,
  isStr,
  isUppercaseLetter,
  isWhitespaceChar,
  leftDoubleQuote,
  leftSingleQuote,
  multiplicationSign,
  omit,
  pullAll,
  punctuationChars,
  rawMDash,
  rawNDash,
  rawNbsp,
  rawReplacementMark,
  removeTrailingSlash,
  resolveEolSetting,
  rightDoubleQuote,
  rightSingleQuote,
  singlePrime,
  stringSplice,
  thinSpace,
  uniq,
  version,
  voidTags,
};
