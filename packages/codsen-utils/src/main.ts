import { version as v } from "../package.json";

export const version: string = v;

export const leftSingleQuote = "\u2018";
export const rightSingleQuote = "\u2019";
export const leftDoubleQuote = "\u201C";
export const rightDoubleQuote = "\u201D";
export const rawNDash = "\u2013";
export const rawMDash = "\u2014";
export const rawNbsp = "\u00A0";
export const rawEllipsis = "\u2026";
export const rawHairspace = "\u200A";
export const singlePrime = "\u2032";
export const doublePrime = "\u2033";
export const backslash = "\u005C";
export const rawReplacementMark = "\uFFFD";
export const backtick = "\x60";

export const punctuationChars = [".", ",", ";", "!", "?"];

export function isNumberChar(value: unknown): boolean {
  return (
    typeof value === "string" &&
    value.charCodeAt(0) >= 48 &&
    value.charCodeAt(0) <= 57
  );
}

export function isLetter(value: unknown): boolean {
  return (
    typeof value === "string" &&
    value.length === 1 &&
    value.toUpperCase() !== value.toLowerCase()
  );
}

export function isLatinLetter(value: unknown): boolean {
  // A-Z, a-z
  return !!(
    value &&
    typeof value === "string" &&
    ((value.charCodeAt(0) > 64 && value.charCodeAt(0) < 91) ||
      (value.charCodeAt(0) > 96 && value.charCodeAt(0) < 123))
  );
}

export function isQuote(value: unknown): boolean {
  return (
    typeof value === "string" &&
    (value === '"' ||
      value === "'" ||
      value === leftSingleQuote ||
      value === rightSingleQuote ||
      value === leftDoubleQuote ||
      value === rightDoubleQuote)
  );
}

export function isLowercaseLetter(value: unknown): boolean {
  if (typeof value !== "string" || !isLetter(value)) {
    return false;
  }
  return value === value.toLowerCase() && value !== value.toUpperCase();
}

export function isUppercaseLetter(value: unknown): boolean {
  if (typeof value !== "string" || !isLetter(value)) {
    return false;
  }
  return value === value.toUpperCase() && value !== value.toLowerCase();
}

export const removeTrailingSlash = <T>(value: T) => {
  if (typeof value === "string" && value.length && value.endsWith("/")) {
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
  if (typeof value !== "string" || typeof substring !== "string") {
    return [];
  }
  let a = [];
  let i = -1;
  while ((i = value.indexOf(substring, i + 1)) >= 0) a.push(i);
  return a;
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
