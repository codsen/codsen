/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const allHTMLTagsKnownToHumanity = new Set([
  "a",
  "abbr",
  "acronym",
  "address",
  "applet",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "basefont",
  "bdi",
  "bdo",
  "bgsound",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "command",
  "content",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "element",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "image",
  "img",
  "input",
  "ins",
  "isindex",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "listing",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "multicol",
  "nav",
  "nextid",
  "nobr",
  "noembed",
  "noframes",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "plaintext",
  "pre",
  "progress",
  "q",
  "rb",
  "rp",
  "rt",
  "rtc",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "shadow",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
  "xmp",
]);

// contains all common templating language head/tail marker characters:
const espChars = `{}%-$_()*|#`;
const veryEspChars = `{}|#`;
const notVeryEspChars = `%()$_*#`;
const leftyChars = `({`;
const rightyChars = `})`;

const espLumpBlacklist = [
  ")|(",
  "|(",
  ")(",
  "()",
  "}{",
  "{}",
  "%)",
  "*)",
  "||",
  "--",
];

const punctuationChars = `.,;!?`;

const BACKTICK = "\x60";
const LEFTDOUBLEQUOTMARK = `\u201C`;
const RIGHTDOUBLEQUOTMARK = `\u201D`;

function lastChar(str: string): string {
  return str[str.length - 1] || "";
}

function secondToLastChar(str: string): string {
  return str[str.length - 2] || "";
}

function firstChar(str: string): string {
  return str[0] || "";
}

function secondChar(str: string): string {
  return str[1] || "";
}

function isLowerCaseLetter(char: string): boolean {
  return char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123;
}

// "is an upper case LATIN letter", that is
function isUppercaseLetter(char: string): boolean {
  return !!(char && char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91);
}

function isNumOrNumStr(something: any): boolean {
  return (
    (typeof something === "string" &&
      something.charCodeAt(0) >= 48 &&
      something.charCodeAt(0) <= 57) ||
    Number.isInteger(something)
  );
}

function isLowercase(char: string): boolean {
  return !!(char && char.toLowerCase() === char && char.toUpperCase() !== char);
}

function isLatinLetter(char: string): boolean {
  // we mean Latin letters A-Z, a-z
  return !!(
    char &&
    ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
      (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
  );
}

// Considering custom element name character requirements:
// https://html.spec.whatwg.org/multipage/custom-elements.html

// Example of Unicode character in a regex:
// \u0041

// "-" | "." | [0-9] | "_" | [a-z] | #xB7 | [#xC0-#xEFFFF]
function charSuitableForTagName(char: string): boolean {
  return /[.\-_a-z0-9\u00B7\u00C0-\uFFFD]/i.test(char);
}

// it flips all brackets backwards and puts characters in the opposite order
function flipEspTag(str: string): string {
  let res = "";
  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i] === "[") {
      res = `]${res}`;
    } else if (str[i] === "]") {
      res = `[${res}`;
    } else if (str[i] === "{") {
      res = `}${res}`;
    } else if (str[i] === "}") {
      res = `{${res}`;
    } else if (str[i] === "(") {
      res = `)${res}`;
    } else if (str[i] === ")") {
      res = `(${res}`;
    } else if (str[i] === "<") {
      res = `>${res}`;
    } else if (str[i] === ">") {
      res = `<${res}`;
    } else if (str[i] === LEFTDOUBLEQUOTMARK) {
      res = `${RIGHTDOUBLEQUOTMARK}${res}`;
    } else if (str[i] === RIGHTDOUBLEQUOTMARK) {
      res = `${LEFTDOUBLEQUOTMARK}${res}`;
    } else {
      res = `${str[i]}${res}`;
    }
  }
  return res;
}

function isTagNameRecognised(tagName: string): boolean {
  return (
    allHTMLTagsKnownToHumanity.has(tagName.toLowerCase()) ||
    ["doctype", "cdata", "xml"].includes(tagName.toLowerCase())
  );
}

// Tells, if substring x goes before substring y on the right
// side of "str", starting at index "startingIdx".
// Used to troubleshoot dirty broken code.
function xBeforeYOnTheRight(
  str: string,
  startingIdx: number,
  x: string,
  y: string
) {
  for (let i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      // if x was first, Bob's your uncle, that's truthy result
      return true;
    }
    if (str.startsWith(y, i)) {
      // since we're in this clause, x failed, so if y matched,
      // this means y precedes x
      return false;
    }
  }
  // default result
  return false;
}

function ensureXIsNotPresentBeforeOneOfY(
  str: string,
  startingIdx: number,
  x: string,
  y: string[] = []
) {
  for (let i = startingIdx, len = str.length; i < len; i++) {
    if (y.some((oneOfStr) => str.startsWith(oneOfStr, i))) {
      // it's escape clause, bracket or whatever was reached and yet,
      // "x" hasn't been encountered yet
      return true;
    }
    if (str[i] === x) {
      // if "x" was found, that's it - falsey result
      return false;
    }
  }
  // default result
  return true;
}

// deliberately a simpler check for perf reasons
function isObj(something: any): boolean {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}

// https://html.spec.whatwg.org/multipage/syntax.html#elements-2
const voidTags = [
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
const inlineTags = new Set([
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

// Rules which might wrap the media queries, for example:
// @supports (display: grid) {...
// const atRulesWhichMightWrapStyles = ["media", "supports", "document"];

const charsThatEndCSSChunks = ["{", "}", ","];

const SOMEQUOTE = `'"${LEFTDOUBLEQUOTMARK}${RIGHTDOUBLEQUOTMARK}`;

const attrNameRegexp = /[\w-]/;

interface Obj {
  [key: string]: any;
}

interface Selector {
  value: string;
  selectorStarts: number;
  selectorEnds: number;
}

interface Property {
  property: null | string;
  propertyStarts: null | number;
  propertyEnds: null | number;
  colon: null | number;
  value: string;
  valueStarts: null | number;
  valueEnds: null | number;
  semi: null | number;
  start: number; // mirrors "propertyStarts"
  end: number; // mirrors whatever was last
}

type TokenType = "text" | "tag" | "rule" | "at" | "comment" | "esp";

type TokenKind = "simplet" | "not" | "doctype" | "cdata" | "xml" | "inline";

// "simple" or "only" or "not" (HTML)
// "block" or "line"(CSS)
type CommentKind = "simple" | "only" | "not" | "block" | "line" | "simplet";

type LayerType = "simple" | "at" | "block" | "esp";

interface TextToken {
  type: "text";
  start: number;
  end: number;
  value: string;
}

interface CommentToken {
  type: "comment";
  start: number;
  end: number;
  value: string;
  closing: null | boolean;
  kind: CommentKind;
  language: "html" | "css";
}

interface EspToken {
  type: "esp";
  start: number;
  end: number;
  value: string;
  head: null | string;
  headStartsAt: null | number;
  headEndsAt: null | number;
  tail: null | string;
  tailStartsAt: null | number;
  tailEndsAt: null | number;
}

interface Attrib {
  attribName: string;
  attribNameRecognised: boolean;
  attribNameStartsAt: number;
  attribNameEndsAt: number;
  attribOpeningQuoteAt: null | number;
  attribClosingQuoteAt: null | number;
  attribValueRaw: string;
  attribValue: (TextToken | Property | CommentToken | EspToken)[];
  attribValueStartsAt: null | number;
  attribValueEndsAt: null | number;
  attribStarts: number;
  attribEnds: number;
  attribLeft: number;
}

interface RuleToken {
  type: "rule";
  start: number;
  end: number;
  value: string;
  left: null | number;
  nested: null | boolean;
  openingCurlyAt: null | number;
  closingCurlyAt: null | number;
  selectorsStart: null | number;
  selectorsEnd: null | number;
  selectors: Selector[];
  properties: (Property | TextToken)[];
}

interface TagToken {
  type: "tag";
  start: number;
  end: number;
  value: string;
  tagNameStartsAt: null | number;
  tagNameEndsAt: null | number;
  tagName: null | string;
  recognised: null | boolean;
  closing: null | boolean;
  void: null | boolean;
  pureHTML: null | boolean;
  kind: null | TokenKind;
  attribs: Attrib[];
}

interface AtToken {
  type: "at";
  start: number;
  end: number;
  value: string;
  left: null | number;
  nested: null | false;
  identifier: null | string;
  identifierStartsAt: null | number;
  identifierEndsAt: null | number;
  query: null | string;
  queryStartsAt: null | number;
  queryEndsAt: null | number;
  openingCurlyAt: null | number;
  closingCurlyAt: null | number;
  rules: (RuleToken | TextToken)[];
}

type Token =
  | TextToken
  | TagToken
  | RuleToken
  | AtToken
  | CommentToken
  | EspToken;

interface LayerKindAt {
  type: "at";
  token: AtToken;
}
interface LayerSimple {
  type: "simple" | "block";
  value: string;
  position: number;
}
interface LayerEsp {
  type: "esp";
  openingLump: string;
  guessedClosingLump: string;
  position: number;
}

type Layer = LayerKindAt | LayerSimple | LayerEsp;

interface CharacterToken {
  chr: string;
  i: number;
  type: TokenType;
}

type TokenCb = (token: Token, next: Token[]) => void;
type CharCb = (token: CharacterToken, next: CharacterToken[]) => void;

interface Opts {
  tagCb: null | TokenCb;
  tagCbLookahead: number;
  charCb: null | CharCb;
  charCbLookahead: number;
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}

export {
  ensureXIsNotPresentBeforeOneOfY,
  allHTMLTagsKnownToHumanity,
  charSuitableForTagName,
  isTagNameRecognised,
  xBeforeYOnTheRight,
  isLowerCaseLetter,
  isUppercaseLetter,
  espLumpBlacklist,
  secondToLastChar,
  punctuationChars,
  notVeryEspChars,
  isNumOrNumStr,
  isLatinLetter,
  veryEspChars,
  rightyChars,
  isLowercase,
  leftyChars,
  flipEspTag,
  secondChar,
  firstChar,
  lastChar,
  espChars,
  isObj,
  Token,
  voidTags,
  inlineTags,
  BACKTICK,
  charsThatEndCSSChunks,
  SOMEQUOTE,
  attrNameRegexp,
  Attrib,
  TokenType,
  Property,
  Layer,
  TextToken,
  RuleToken,
  TagToken,
  CommentToken,
  LayerType,
  LayerSimple,
  CharacterToken,
  LayerEsp,
  EspToken,
  LayerKindAt,
  AtToken,
  Opts,
  Obj,
  TokenCb,
  CharCb,
  LEFTDOUBLEQUOTMARK,
  RIGHTDOUBLEQUOTMARK,
};
