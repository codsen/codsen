declare const version: string;
declare const leftSingleQuote = "\u2018";
declare const rightSingleQuote = "\u2019";
declare const leftDoubleQuote = "\u201C";
declare const rightDoubleQuote = "\u201D";
declare const punctuationChars: string[];
declare const rawNDash = "\u2013";
declare const rawMDash = "\u2014";
declare const rawNbsp = "\u00A0";
declare const rawEllipsis = "\u2026";
declare const rawHairspace = "\u200A";
declare const rawReplacementMark = "\uFFFD";
declare function isNumber(something: any): boolean;
declare function isLetter(str: unknown): boolean;
declare function isQuote(str: unknown): boolean;
declare function isLowercaseLetter(str: unknown): boolean;
declare function isUppercaseLetter(str: unknown): boolean;
declare const removeTrailingSlash: <T>(str: T) => string | T;
declare const voidTags: string[];

export {
  isLetter,
  isLowercaseLetter,
  isNumber,
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
  version,
  voidTags,
};
