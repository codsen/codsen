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

function isNum(something) {
  return typeof something === "number";
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

function charSuitableForTagName(char) {
  return isLowerCaseLetter(char) || char === ":";
}

// it flips all brackets backwards and puts characters in the opposite order
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

export {
  allHTMLTagsKnownToHumanity,
  charSuitableForTagName,
  isLowerCaseLetter,
  isUppercaseLetter,
  secondToLastChar,
  isLatinLetter,
  isLowercase,
  flipEspTag,
  secondChar,
  firstChar,
  lastChar,
  isStr,
  isNum
};
