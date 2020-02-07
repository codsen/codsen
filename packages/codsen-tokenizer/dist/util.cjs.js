'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
  "xmp"
];
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
  return (
    isStr(char) &&
    char.length === 1 &&
    ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
      (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
  );
}
function charSuitableForTagName(char) {
  return isLowerCaseLetter(char) || char === ":";
}
function charSuitableForHTMLAttrName(char) {
  return (
    isLatinLetter(char) ||
    (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57) ||
    [":", "-"].includes(char)
  );
}
function flipEspTag(str) {
  let res = "";
  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i] === "{") {
      res = `}${res}`;
    } else if (str[i] === "(") {
      res = `)${res}`;
    } else {
      res = `${str[i]}${res}`;
    }
  }
  return res;
}

exports.allHTMLTagsKnownToHumanity = allHTMLTagsKnownToHumanity;
exports.charSuitableForHTMLAttrName = charSuitableForHTMLAttrName;
exports.charSuitableForTagName = charSuitableForTagName;
exports.firstChar = firstChar;
exports.flipEspTag = flipEspTag;
exports.isLatinLetter = isLatinLetter;
exports.isLowerCaseLetter = isLowerCaseLetter;
exports.isLowercase = isLowercase;
exports.isNumOrNumStr = isNumOrNumStr;
exports.isStr = isStr;
exports.isUppercaseLetter = isUppercaseLetter;
exports.lastChar = lastChar;
exports.secondChar = secondChar;
exports.secondToLastChar = secondToLastChar;
