import { version as v } from "../package.json";

export const version: string = v;

export const leftSingleQuote = "\u2018";
export const rightSingleQuote = "\u2019";
export const leftDoubleQuote = "\u201C";
export const rightDoubleQuote = "\u201D";
export const rawNDash = "\u2013"; // https://www.fileformat.info/info/unicode/char/2013/index.htm
export const rawMDash = "\u2014"; // https://www.fileformat.info/info/unicode/char/2014/index.htm
export const rawNbsp = "\u00A0"; // https://www.fileformat.info/info/unicode/char/00a0/index.htm
export const ellipsis = "\u2026"; // https://www.fileformat.info/info/unicode/char/2026/index.htm
export const hairspace = "\u200A"; // https://www.fileformat.info/info/unicode/char/200a/index.htm
export const thinSpace = "\u2009"; // https://www.fileformat.info/info/unicode/char/2009/index.htm
export const singlePrime = "\u2032";
export const doublePrime = "\u2033";
export const backslash = "\u005C";
export const rawReplacementMark = "\uFFFD";
export const backtick = "\x60";
export const multiplicationSign = "\u00D7"; // https://www.fileformat.info/info/unicode/char/00d7/index.htm

export const punctuationChars = [".", ",", ";", "!", "?"];

export interface Obj {
  [key: string]: any;
}

export type EolChar = "\n" | "\r" | "\r\n";

export function isNumberChar(value: unknown): boolean {
  return isStr(value) && value.charCodeAt(0) >= 48 && value.charCodeAt(0) <= 57;
}

export function isCurrencyChar(value: unknown): boolean {
  return isStr(value) && "؋$₼៛¥₡₱£€¢₹﷼₪₩₭₨₮₦₽₫฿₩₺₴".includes(value);
}

export function isCurrencySymbol(value: unknown): boolean {
  let currencySymbols = new Set([
    "$U",
    "$b",
    "B/.",
    "BZ$",
    "Br",
    "Bs",
    "C$",
    "CHF",
    "Ft",
    "Gs",
    "J$",
    "KM",
    "Kč",
    "L",
    "MT",
    "NT$",
    "P",
    "Q",
    "R",
    "R$",
    "RD$",
    "RM",
    "Rp",
    "S",
    "S/.",
    "TT$",
    "Z$",
    "kn",
    "kr",
    "lei",
    "zł",
    "ƒ",
    "Дин.",
    "ден",
    "лв",
    "د.إ",
    "Lek",
  ]);
  return (
    isStr(value) &&
    !!value.trim() &&
    (isCurrencyChar(value) || currencySymbols.has(value))
  );
}

export function isLetter(value: unknown): boolean {
  return (
    isStr(value) &&
    value.length === 1 &&
    value.toUpperCase() !== value.toLowerCase()
  );
}

export function isLatinLetter(value: unknown): boolean {
  // A-Z, a-z
  return !!(
    value &&
    isStr(value) &&
    ((value.charCodeAt(0) > 64 && value.charCodeAt(0) < 91) ||
      (value.charCodeAt(0) > 96 && value.charCodeAt(0) < 123))
  );
}

export function isQuote(value: unknown): boolean {
  return (
    isStr(value) &&
    (value === '"' ||
      value === "'" ||
      value === leftSingleQuote ||
      value === rightSingleQuote ||
      value === leftDoubleQuote ||
      value === rightDoubleQuote)
  );
}

export function isLowercaseLetter(value: unknown): boolean {
  if (!isStr(value) || !isLetter(value)) {
    return false;
  }
  return value === value.toLowerCase() && value !== value.toUpperCase();
}

export function isUppercaseLetter(value: unknown): boolean {
  if (!isStr(value) || !isLetter(value)) {
    return false;
  }
  return value === value.toUpperCase() && value !== value.toLowerCase();
}

export function isWhitespaceChar(value: unknown): boolean {
  if (!isStr(value) || !value) {
    return false;
  }
  return !value[0].trim();
}

// -----------------------------------------------------------------

export const removeTrailingSlash = <T>(value: T) => {
  if (isStr(value) && value.length && value.endsWith("/")) {
    return value.slice(0, -1).trim();
  }
  // else, does nothing
  return value;
};

// -----------------------------------------------------------------

/**
 * Tells, is given input a plain object (an object literal,
 * a container object Object.create(null) or created by new Object())
 * @param value unknown
 * @returns boolean
 */
export function isPlainObject(value: unknown): boolean {
  if (value == null || typeof value !== "object") {
    return false;
  }
  let proto = Object.getPrototypeOf(value);
  if (
    proto !== null &&
    proto !== Object.prototype &&
    Object.getPrototypeOf(proto) !== null
  ) {
    return false;
  }
  return !(Symbol.iterator in value) && !(Symbol.toStringTag in value);
}

// ----------------------------------------------------------------

/**
 * @param str input string
 * @param index starting index
 * @param count how many characters to replace
 * @param add what string to insert
 * @returns string
 * Adapted from https://stackoverflow.com/a/21350614
 */
export function stringSplice(str = "", index = 0, count = 0, add = "") {
  if (index < 0) {
    index += str.length;
    if (index < 0) {
      index = 0;
    }
  }
  return str.slice(0, index) + (add || "") + str.slice(index + count);
}

// ----------------------------------------------------------------

export function isStr(something: unknown): something is string {
  return typeof something === "string";
}

// ----------------------------------------------------------------

export function isNum(something: unknown): something is number {
  return Number.isFinite(something);
}

// ----------------------------------------------------------------

export function isInt(something: unknown): something is number {
  return Number.isSafeInteger(something) && (something as number) >= 0;
}

// ----------------------------------------------------------------

export function isBool(something: unknown): something is boolean {
  return typeof something === "boolean";
}

// ----------------------------------------------------------------

export function isNull(something: unknown): something is null {
  return something === null;
}

// ----------------------------------------------------------------

/**
 * Gives array of indexes of all found substring occurrences
 * @param string source string
 * @param substring what to look for
 * @returns array of findings' position indexes
 * adapted from https://stackoverflow.com/a/10710406
 * console.log(findAllIdx("scissors", "s"));
 * -> [0, 3, 4, 7]
 */
export function findAllIdx(value: unknown, substring: unknown) {
  if (!isStr(value) || !isStr(substring)) {
    return [];
  }
  let a = [];
  let i = -1;
  while ((i = value.indexOf(substring, i + 1)) >= 0) a.push(i);
  return a;
}

// ----------------------------------------------------------------

/**
 * Unlike lodash equivalent, it does not mutate the input array
 * @param input
 * @param remove
 * @returns
 */
export function pullAll<T, U>(input: T[] = [], remove: U[] = []) {
  // early exit
  if (!input || !Array.isArray(input) || !input.length) {
    // result is always an array
    return [];
  }
  if (!remove || !Array.isArray(remove) || !remove.length) {
    // does nothing
    return input;
  }
  // actual filtration
  return input.filter((val) => !remove.includes(val as any));
}

// ----------------------------------------------------------------

// from Michael Fogus "Functional JavaScript"
export function existy(x: unknown): boolean {
  return x != null;
}

// ----------------------------------------------------------------

/**
 * Returns a shallow copy of input array, with only unique elements
 * @param input array
 * @returns de-duped array
 */
export function uniq<T>(input: T[]): T[] {
  return [...new Set(input)];
}

// ----------------------------------------------------------------

export function detectEol(str: string): EolChar | undefined {
  if (typeof str !== "string" || !str) {
    return;
  }
  // windows ending
  if (str.includes("\r\n")) {
    return "\r\n";
  }
  // modern mac ending
  if (str.includes("\n")) {
    return "\n";
  }
  // old mac ending
  if (str.includes("\r")) {
    return "\r";
  }
  return;
}

// ----------------------------------------------------------------

export function hasOwnProp(obj: unknown, prop: string): boolean {
  return (
    isPlainObject(obj) &&
    isStr(prop) &&
    Object.prototype.hasOwnProperty.call(obj, prop)
  );
}

// ----------------------------------------------------------------

// https://html.spec.whatwg.org/multipage/syntax.html#elements-2
export const voidTags = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Inline_text_semantics
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Image_and_multimedia
export const inlineTags = new Set([
  "a",
  "abbr",
  "acronym",
  "audio",
  "b",
  "bdi",
  "bdo",
  "big",
  "br",
  "button",
  "canvas",
  "cite",
  "code",
  "data",
  "datalist",
  "del",
  "dfn",
  "em",
  "embed",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "map",
  "mark",
  "meter",
  "noscript",
  "object",
  "output",
  "picture",
  "progress",
  "q",
  "ruby",
  "s",
  "samp",
  "script",
  "select",
  "slot",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "svg",
  "template",
  "textarea",
  "time",
  "u",
  "tt",
  "var",
  "video",
  "wbr",
]);
