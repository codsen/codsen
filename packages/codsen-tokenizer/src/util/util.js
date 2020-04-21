// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const allHTMLTagsKnownToHumanity = [
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
];

// contains all common templating language head/tail marker characters:
const espChars = `{}%-$_()*|`;

const espLumpBlacklist = [")|(", "|(", ")(", "()", "{}", "%)", "*)", "**"];

function lastChar(str) {
  if (!isStr(str) || !str.length) {
    return "";
  }
  return str[str.length - 1];
}

function secondToLastChar(str) {
  if (!isStr(str) || !str.length || str.length === 1) {
    return "";
  }
  return str[str.length - 2];
}

function firstChar(str) {
  if (!isStr(str) || !str.length) {
    return "";
  }
  return str[0];
}

function secondChar(str) {
  if (!isStr(str) || !str.length || str.length === 1) {
    return "";
  }
  return str[1];
}

function isLowerCaseLetter(char) {
  return isStr(char) && char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123;
}

// "is an upper case LATIN letter", that is
function isUppercaseLetter(char) {
  return (
    isStr(char) &&
    char.length === 1 &&
    char.charCodeAt(0) > 64 &&
    char.charCodeAt(0) < 91
  );
}

function isStr(something) {
  return typeof something === "string";
}

function isNumOrNumStr(something) {
  return (
    (typeof something === "string" &&
      something.charCodeAt(0) >= 48 &&
      something.charCodeAt(0) <= 57) ||
    Number.isInteger(something)
  );
}

function isLowercase(char) {
  return (
    isStr(char) && char.toLowerCase() === char && char.toUpperCase() !== char
  );
}

function isLatinLetter(char) {
  // we mean Latin letters A-Z, a-z
  return (
    isStr(char) &&
    char.length === 1 &&
    ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
      (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
  );
}

// Considering custom element name character requirements:
// https://html.spec.whatwg.org/multipage/custom-elements.html

// Example of Unicode character in a regex:
// \u0041

// "-" | "." | [0-9] | "_" | [a-z] | #xB7 | [#xC0-#xEFFFF]
function charSuitableForTagName(char) {
  return /[.\-_a-z0-9\u00B7\u00C0-\uFFFD]/i.test(char);
}

// it flips all brackets backwards and puts characters in the opposite order
function flipEspTag(str) {
  let res = "";
  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i] === "[") {
      res = `]${res}`;
    } else if (str[i] === "{") {
      res = `}${res}`;
    } else if (str[i] === "(") {
      res = `)${res}`;
    } else {
      res = `${str[i]}${res}`;
    }
  }
  return res;
}

function isTagNameRecognised(tagName) {
  return (
    allHTMLTagsKnownToHumanity.includes(tagName.toLowerCase()) ||
    ["doctype", "cdata", "xml"].includes(tagName.toLowerCase())
  );
}

// Tells, if substring x goes before substring y on the right
// side of "str", starting at index "startingIdx".
// Used to troubleshoot dirty broken code.
function xBeforeYOnTheRight(str, startingIdx, x, y) {
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

function ensureXIsNotPresentBeforeOneOfY(str, startingIdx, x, y = []) {
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
  isNumOrNumStr,
  isLatinLetter,
  isLowercase,
  flipEspTag,
  secondChar,
  firstChar,
  lastChar,
  espChars,
  isStr,
};
