/**
 * codsen-tokenizer
 * Tokenizer for mixed inputs aiming at broken code, especially HTML & CSS
 * Version: 2.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
 */

import { matchRight } from 'string-match-left-right';
import { right, left } from 'string-left-right';
import isTagOpening from 'is-html-tag-opening';
import isObj from 'lodash.isplainobject';
import clone from 'lodash.clonedeep';

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
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}
function isLatinLetter(char) {
  return (
    isStr(char) &&
    char.length === 1 &&
    ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
      (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
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

const defaults = {
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
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
  "wbr"
];
const espChars = `{}%-$_()*|`;
function tokenizer(str, tagCb, charCb, originalOpts) {
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error(
        "codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string."
      );
    } else {
      throw new Error(
        `codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(
          str,
          null,
          4
        )}`
      );
    }
  }
  if (tagCb && typeof tagCb !== "function") {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_03] the second input argument, callback function, should be a function but it was given as type ${typeof tagCb}, equal to ${JSON.stringify(
        tagCb,
        null,
        4
      )}`
    );
  }
  if (charCb && typeof charCb !== "function") {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_04] the second input argument, callback function, should be a function but it was given as type ${typeof charCb}, equal to ${JSON.stringify(
        charCb,
        null,
        4
      )}`
    );
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_05] the third input argument, options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  const opts = Object.assign({}, defaults, originalOpts);
  if (
    opts.reportProgressFunc &&
    typeof opts.reportProgressFunc !== "function"
  ) {
    throw new TypeError(
      `codsen-tokenizer: [THROW_ID_06] opts.reportProgressFunc should be a function but it was given as :\n${JSON.stringify(
        opts.reportProgressFunc,
        null,
        4
      )} (${typeof opts.reportProgressFunc})`
    );
  }
  let currentPercentageDone;
  let lastPercentage = 0;
  const len = str.length;
  const midLen = Math.floor(len / 2);
  let doNothing;
  let styleStarts = false;
  let token = {};
  const tokenDefault = {
    type: null,
    start: null,
    end: null,
    tail: null,
    kind: null
  };
  function tokenReset() {
    token = Object.assign({}, tokenDefault);
  }
  tokenReset();
  const layers = [];
  function matchLayerLast(str, i) {
    if (!layers.length) {
      return false;
    } else if (layers[layers.length - 1].type === "simple") {
      return str[i] === layers[layers.length - 1].value;
    } else if (layers[layers.length - 1].type === "esp") {
      if (!espChars.includes(str[i])) {
        return false;
      }
      let wholeEspTagLump = "";
      const len = str.length;
      for (let y = i; y < len; y++) {
        if (espChars.includes(str[y])) {
          wholeEspTagLump = wholeEspTagLump + str[y];
        } else {
          break;
        }
      }
      return layers[layers.length - 1].value
        .split("")
        .every(char => wholeEspTagLump.includes(char));
    }
  }
  function pingCharCb(incomingToken) {
    if (charCb) {
      charCb(incomingToken);
    }
  }
  function pingTagCb(incomingToken) {
    if (tagCb) {
      tagCb(clone(incomingToken));
      tokenReset();
    }
  }
  function dumpCurrentToken(token, i) {
    if (
      token.type !== "text" &&
      token.start !== null &&
      str[i - 1] &&
      !str[i - 1].trim().length
    ) {
      token.end = left(str, i) + 1;
      pingTagCb(token);
      token.start = left(str, i) + 1;
      token.type = "text";
    }
    if (token.start !== null) {
      token.end = i;
      pingTagCb(token);
    }
  }
  function initHtmlToken() {
    token = Object.assign(
      {
        tagNameStartAt: null,
        tagNameEndAt: null,
        tagName: null,
        recognised: null,
        closing: false,
        void: false,
        pureHTML: true,
        esp: []
      },
      token
    );
  }
  for (let i = 0; i < len; i++) {
    if (opts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (i === midLen) {
          opts.reportProgressFunc(
            Math.floor(
              (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2
            )
          );
        }
      } else if (len >= 2000) {
        currentPercentageDone =
          opts.reportProgressFuncFrom +
          Math.floor(
            (i / len) *
              (opts.reportProgressFuncTo - opts.reportProgressFuncFrom)
          );
        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
      }
    }
    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
    }
    if (token.end && token.end === i) {
      if (token.kind === "style") {
        styleStarts = true;
      }
      dumpCurrentToken(token, i);
    }
    if (
      !doNothing &&
      ["html"].includes(token.type) &&
      [`"`, `'`].includes(str[i])
    ) {
      if (matchLayerLast(str, i)) {
        layers.pop();
      } else if (!layers.length || layers[layers.length - 1].type !== "esp") {
        layers.push({
          type: "simple",
          value: str[i]
        });
      }
    }
    if (!doNothing) {
      if (
        !layers.length &&
        str[i] === "<" &&
        (isTagOpening(str, i) ||
          matchRight(str, i, ["!--", "!doctype", "?xml"], { i: true })) &&
        (token.type !== "esp" || token.tail.includes(str[i]))
      ) {
        if (token.type) {
          dumpCurrentToken(token, i);
        }
        token.start = i;
        token.type = "html";
        initHtmlToken();
        if (matchRight(str, i, "!--")) {
          token.kind = "comment";
        } else if (matchRight(str, i, "!doctype", { i: true })) {
          token.kind = "doctype";
        } else if (matchRight(str, i, "?xml", { i: true })) {
          token.kind = "xml";
        } else if (
          matchRight(str, i, "style", { i: true, trimCharsBeforeMatching: "/" })
        ) {
          token.kind = "style";
        }
      } else if (
        !(token.type === "html" && token.kind === "comment") &&
        espChars.includes(str[i]) &&
        str[i + 1] &&
        espChars.includes(str[i + 1]) &&
        !(str[i] === "-" && str[i + 1] === "-")
      ) {
        let wholeEspTagLump = "";
        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagLump = wholeEspTagLump + str[y];
          } else {
            break;
          }
        }
        if (!["html", "esp"].includes(token.type)) {
          dumpCurrentToken(token, i);
          token.start = i;
          token.type = "esp";
          doNothing = i + wholeEspTagLump.length;
          token.tail = flipEspTag(wholeEspTagLump);
        } else if (token.type === "html") {
          if (matchLayerLast(str, i)) {
            layers.pop();
          } else {
            layers.push({
              type: "esp",
              value: flipEspTag(wholeEspTagLump)
            });
          }
        }
      } else if (token.start === null || token.end === i) {
        if (styleStarts) {
          if (!str[i].trim().length) {
            token.start = i;
            token.type = "text";
            token.end = right(str, i) || str.length;
            pingTagCb(token);
            if (right(str, i)) {
              token.start = right(str, i);
              token.type = "css";
              doNothing = right(str, i);
            }
          } else {
            token.start = i;
            token.type = "css";
          }
        } else {
          token.start = i;
          token.type = "text";
        }
      }
    }
    if (!doNothing) {
      if (token.type === "html" && !layers.length && str[i] === ">") {
        token.end = i + 1;
      } else if (
        token.type === "esp" &&
        token.end === null &&
        isStr(token.tail) &&
        token.tail.includes(str[i])
      ) {
        let wholeEspTagClosing = "";
        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagClosing = wholeEspTagClosing + str[y];
          } else {
            break;
          }
        }
        token.end = i + wholeEspTagClosing.length;
        doNothing = i + wholeEspTagClosing.length;
      }
    }
    if (
      token.type === "html" &&
      isNum(token.tagNameStartAt) &&
      !isNum(token.tagNameEndAt)
    ) {
      if (!isLatinLetter(str[i])) {
        token.tagNameEndAt = i;
        token.tagName = str.slice(token.tagNameStartAt, i);
        if (voidTags.includes(token.tagName)) {
          token.void = true;
        }
        token.recognised = allHTMLTagsKnownToHumanity.includes(
          token.tagName.toLowerCase()
        );
      }
    }
    if (
      token.type === "html" &&
      !isNum(token.tagNameStartAt) &&
      isNum(token.start) &&
      token.start < i
    ) {
      if (str[i] === "/") {
        token.closing = true;
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartAt = i;
        if (!token.closing) {
          token.closing = false;
        }
      }
    }
    if (charCb) {
      pingCharCb({
        type: token.type,
        chr: str[i],
        i
      });
    }
    if (!str[i + 1] && token.start !== null) {
      token.end = i + 1;
      pingTagCb(token);
    }
  }
}

export default tokenizer;
