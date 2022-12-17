import { version as v } from "../package.json";

export const version: string = v;

export const leftSingleQuote = "\u2018";
export const rightSingleQuote = "\u2019";
export const leftDoubleQuote = "\u201C";
export const rightDoubleQuote = "\u201D";
export const punctuationChars = [".", ",", ";", "!", "?"];
export const rawNDash = "\u2013";
export const rawMDash = "\u2014";
export const rawNbsp = "\u00A0";
export const rawEllipsis = "\u2026";
export const rawHairspace = "\u200A";
export const rawReplacementMark = "\uFFFD";

export function isNumber(something: any): boolean {
  return (
    (typeof something === "string" &&
      something.charCodeAt(0) >= 48 &&
      something.charCodeAt(0) <= 57) ||
    (Number.isInteger(something) && something >= 0)
  );
}

export function isLetter(str: unknown): boolean {
  return (
    typeof str === "string" &&
    str.length === 1 &&
    str.toUpperCase() !== str.toLowerCase()
  );
}

export function isQuote(str: unknown): boolean {
  return (
    typeof str === "string" &&
    (str === '"' ||
      str === "'" ||
      str === leftSingleQuote ||
      str === rightSingleQuote ||
      str === leftDoubleQuote ||
      str === rightDoubleQuote)
  );
}

export function isLowercaseLetter(str: unknown): boolean {
  if (typeof str !== "string" || !isLetter(str)) {
    return false;
  }
  return str === str.toLowerCase() && str !== str.toUpperCase();
}

export function isUppercaseLetter(str: unknown): boolean {
  if (typeof str !== "string" || !isLetter(str)) {
    return false;
  }
  return str === str.toUpperCase() && str !== str.toLowerCase();
}

export const removeTrailingSlash = <T>(str: T) => {
  if (typeof str === "string" && str.length && str.endsWith("/")) {
    return str.slice(0, -1).trim();
  }
  // default return - does nothing
  return str;
};

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
