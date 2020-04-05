/**
 * codsen-tokenizer
 * HTML Lexer aimed at erroneous code
 * Version: 2.11.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
 */

import { allHtmlAttribs } from 'html-all-known-attributes';
import { matchRight, matchLeft, matchRightIncl, matchLeftIncl } from 'string-match-left-right';
import clone from 'lodash.clonedeep';
import { left, right } from 'string-left-right';
import isTagOpening from 'is-html-tag-opening';

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
const espChars = `{}%-$_()*|`;
const espLumpBlacklist = [")|(", "|(", ")(", "()", "{}", "%)", "*)", "**"];
function isStr(something) {
  return typeof something === "string";
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
  return /[.\-_a-z0-9\u00B7\u00C0-\uFFFD]/i.test(char);
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
function xBeforeYOnTheRight(str, startingIdx, x, y) {
  for (let i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      return true;
    } else if (str.startsWith(y, i)) {
      return false;
    }
  }
  return false;
}
function ensureXIsNotPresentBeforeOneOfY(str, startingIdx, x, y = []) {
  for (let i = startingIdx, len = str.length; i < len; i++) {
    if (y.some((oneOfStr) => str.startsWith(oneOfStr, i))) {
      return true;
    } else if (str[i] === x) {
      return false;
    }
  }
  return true;
}

function startsEsp(str, i, token, layers, styleStarts) {
  return (
    espChars.includes(str[i]) &&
    str[i + 1] &&
    espChars.includes(str[i + 1]) &&
    token.type !== "rule" &&
    token.type !== "at" &&
    !(str[i] === "-" && "-{(".includes(str[i + 1])) &&
    !("})".includes(str[i]) && "-".includes(str[i + 1])) &&
    !(
      (
        "0123456789".includes(str[left(str, i)]) &&
        (!str[i + 2] ||
          [`"`, `'`, ";"].includes(str[i + 2]) ||
          !str[i + 2].trim().length)
      )
    ) &&
    !(
      styleStarts &&
      ("{}".includes(str[i]) || "{}".includes(str[right(str, i)]))
    )
  );
}

const BACKSLASH = "\u005C";
function startsTag(str, i, token, layers) {
  return (
    str[i] &&
    str[i].trim().length &&
    (!layers.length || token.type === "text") &&
    !["doctype", "xml"].includes(token.kind) &&
    ((str[i] === "<" &&
      (isTagOpening(str, i, {
        allowCustomTagNames: true,
      }) ||
        str[right(str, i)] === ">" ||
        matchRight(str, i, ["doctype", "xml", "cdata"], {
          i: true,
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
        }))) ||
      (isLatinLetter(str[i]) &&
        (!str[i - 1] ||
          (!isLatinLetter(str[i - 1]) &&
            !["<", "/", "!", BACKSLASH].includes(str[left(str, i)]))) &&
        isTagOpening(str, i, {
          allowCustomTagNames: false,
          skipOpeningBracket: true,
        }))) &&
    (token.type !== "esp" || token.tail.includes(str[i]))
  );
}

function startsComment(str, i, token) {
  return (
    ((str[i] === "<" &&
      (matchRight(str, i, ["!--"], {
        maxMismatches: 1,
        firstMustMatch: true,
        trimBeforeMatching: true,
      }) ||
        matchRight(str, i, ["![endif]"], {
          i: true,
          maxMismatches: 2,
          trimBeforeMatching: true,
        })) &&
      !matchRight(str, i, ["![cdata", "<"], {
        i: true,
        maxMismatches: 1,
        trimBeforeMatching: true,
      }) &&
      (token.type !== "comment" || token.kind !== "not")) ||
      (str[i] === "-" &&
        matchRight(str, i, ["->"], {
          trimBeforeMatching: true,
        }) &&
        (token.type !== "comment" ||
          (!token.closing && token.kind !== "not")) &&
        !matchLeft(str, i, "<", {
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["-", "!"],
        }))) &&
    (token.type !== "esp" || token.tail.includes(str[i]))
  );
}

function attributeEnds(str, i, attrib) {
  return (
    attrib.attribOpeningQuoteAt === null ||
    str[attrib.attribOpeningQuoteAt] === str[i] ||
    (`'"`.includes(str[attrib.attribOpeningQuoteAt]) &&
      (!xBeforeYOnTheRight(str, i, str[attrib.attribOpeningQuoteAt], "=") ||
        (str.includes(">", i) &&
          Array.from(str.slice(i + 1, str.indexOf(">"))).reduce((acc, curr) => {
            return acc + (`'"`.includes(curr) ? 1 : 0);
          }, 0) %
            2 ==
            0 &&
          attrib.attribOpeningQuoteAt + 1 < i &&
          str.slice(attrib.attribOpeningQuoteAt + 1, i).trim().length &&
          (ensureXIsNotPresentBeforeOneOfY(
            str,
            i,
            str[attrib.attribOpeningQuoteAt],
            [">", `="`, `='`]
          ) ||
            ensureXIsNotPresentBeforeOneOfY(str, i, "=", [">"])))))
  );
}

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
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
const charsThatEndCSSChunks = ["{", "}", ","];
function tokenizer(str, originalOpts) {
  const start = Date.now();
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
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.tagCb &&
    typeof originalOpts.tagCb !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ${typeof originalOpts.tagCb}, equal to ${JSON.stringify(
        originalOpts.tagCb,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.charCb &&
    typeof originalOpts.charCb !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ${typeof originalOpts.charCb}, equal to ${JSON.stringify(
        originalOpts.charCb,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.reportProgressFunc &&
    typeof originalOpts.reportProgressFunc !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ${typeof originalOpts.reportProgressFunc}, equal to ${JSON.stringify(
        originalOpts.reportProgressFunc,
        null,
        4
      )}`
    );
  }
  const defaults = {
    tagCb: null,
    tagCbLookahead: 0,
    charCb: null,
    charCbLookahead: 0,
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100,
  };
  const opts = Object.assign({}, defaults, originalOpts);
  let currentPercentageDone;
  let lastPercentage = 0;
  const len = str.length;
  const midLen = Math.floor(len / 2);
  let doNothing;
  let styleStarts = false;
  const tagStash = [];
  const charStash = [];
  let token = {};
  const tokenDefault = {
    type: null,
    start: null,
    end: null,
  };
  function tokenReset() {
    token = clone(tokenDefault);
    attribReset();
    return token;
  }
  let attrib = {};
  const attribDefault = {
    attribName: null,
    attribNameRecognised: null,
    attribNameStartsAt: null,
    attribNameEndsAt: null,
    attribOpeningQuoteAt: null,
    attribClosingQuoteAt: null,
    attribValue: null,
    attribValueStartsAt: null,
    attribValueEndsAt: null,
    attribStart: null,
    attribEnd: null,
  };
  function attribReset() {
    attrib = clone(attribDefault);
  }
  tokenReset();
  attribReset();
  let selectorChunkStartedAt;
  let parentTokenToWrapAround;
  let layers = [];
  function matchLayerLast(str, i, matchFirstInstead) {
    if (!layers.length) {
      return false;
    }
    const whichLayerToMatch = matchFirstInstead
      ? layers[0]
      : layers[layers.length - 1];
    if (whichLayerToMatch.type === "simple") {
      return (
        !whichLayerToMatch.value ||
        str[i] === flipEspTag(whichLayerToMatch.value)
      );
    } else if (whichLayerToMatch.type === "esp") {
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
      if (
        wholeEspTagLump &&
        whichLayerToMatch.openingLump &&
        wholeEspTagLump.length > whichLayerToMatch.guessedClosingLump.length
      ) {
        if (wholeEspTagLump.endsWith(whichLayerToMatch.openingLump)) {
          return wholeEspTagLump.length - whichLayerToMatch.openingLump.length;
        }
        let uniqueCharsListFromGuessedClosingLumpArr = new Set(
          whichLayerToMatch.guessedClosingLump
        );
        let found = 0;
        for (let y = 0, len2 = wholeEspTagLump.length; y < len2; y++) {
          if (
            !uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLump[y]) &&
            found > 1
          ) {
            return y;
          }
          if (
            uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLump[y])
          ) {
            found++;
            uniqueCharsListFromGuessedClosingLumpArr = new Set(
              [...uniqueCharsListFromGuessedClosingLumpArr].filter(
                (el) => el !== wholeEspTagLump[y]
              )
            );
          }
        }
      } else if (
        whichLayerToMatch.guessedClosingLump
          .split("")
          .every((char) => wholeEspTagLump.includes(char))
      ) {
        return wholeEspTagLump.length;
      }
    }
  }
  function matchLayerFirst(str, i) {
    return matchLayerLast(str, i, true);
  }
  function reportFirstFromStash(stash, cb, lookaheadLength) {
    const currentElem = stash.shift();
    const next = [];
    for (let i = 0; i < lookaheadLength; i++) {
      if (stash[i]) {
        next.push(clone(stash[i]));
      } else {
        break;
      }
    }
    cb(currentElem, next);
  }
  function pingCharCb(incomingToken) {
    if (opts.charCb) {
      charStash.push(incomingToken);
      if (charStash.length > opts.charCbLookahead) {
        reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
      }
    }
  }
  function pingTagCb(incomingToken) {
    if (opts.tagCb) {
      tagStash.push(incomingToken);
      if (tagStash.length > opts.tagCbLookahead) {
        reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
      }
    }
  }
  function dumpCurrentToken(token, i) {
    if (
      !["text", "esp"].includes(token.type) &&
      token.start !== null &&
      token.start < i &&
      ((str[i - 1] && !str[i - 1].trim().length) || str[i] === "<")
    ) {
      token.end = left(str, i) + 1;
      token.value = str.slice(token.start, token.end);
      if (token.type === "tag" && !"/>".includes(str[token.end - 1])) {
        let cutOffIndex = token.tagNameEndsAt || i;
        if (Array.isArray(token.attribs) && token.attribs.length) {
          for (let i = 0, len = token.attribs.length; i < len; i++) {
            if (token.attribs[i].attribNameRecognised) {
              cutOffIndex = token.attribs[i].attribEnd;
              if (
                str[cutOffIndex] &&
                str[cutOffIndex + 1] &&
                !str[cutOffIndex].trim().length &&
                str[cutOffIndex + 1].trim().length
              ) {
                cutOffIndex++;
              }
            } else {
              if (i === 0) {
                token.attribs = [];
              } else {
                token.attribs = token.attribs.splice(0, i);
              }
              break;
            }
          }
        }
        token.end = cutOffIndex;
        token.value = str.slice(token.start, token.end);
        if (!token.tagNameEndsAt) {
          token.tagNameEndsAt = cutOffIndex;
        }
        if (
          Number.isInteger(token.tagNameStartsAt) &&
          Number.isInteger(token.tagNameEndsAt) &&
          !token.tagName
        ) {
          token.tagName = str.slice(token.tagNameStartsAt, cutOffIndex);
          token.recognised = isTagNameRecognised(token.tagName);
        }
        pingTagCb(token);
        token = tokenReset();
        initToken("text", cutOffIndex);
      } else {
        pingTagCb(token);
        token = tokenReset();
        if (str[i - 1] && !str[i - 1].trim().length) {
          initToken("text", left(str, i) + 1);
        }
      }
    }
    if (token.start !== null) {
      if (token.end === null && token.start !== i) {
        token.end = i;
        token.value = str.slice(token.start, token.end);
      }
      if (token.start !== null && token.end !== null) {
        pingTagCb(token);
      }
      token = tokenReset();
    }
  }
  function atRuleWaitingForClosingCurlie() {
    return (
      layers.length &&
      layers[layers.length - 1].type === "at" &&
      isObj(layers[layers.length - 1].token) &&
      Number.isInteger(layers[layers.length - 1].token.openingCurlyAt) &&
      !Number.isInteger(layers[layers.length - 1].token.closingCurlyAt)
    );
  }
  function initToken(type, start) {
    attribReset();
    if (type === "tag") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.value = null;
      token.tagNameStartsAt = null;
      token.tagNameEndsAt = null;
      token.tagName = null;
      token.recognised = null;
      token.closing = false;
      token.void = false;
      token.pureHTML = true;
      token.kind = null;
      token.attribs = [];
    } else if (type === "comment") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.value = null;
      token.kind = "simple";
      token.closing = false;
    } else if (type === "rule") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.value = null;
      token.openingCurlyAt = null;
      token.closingCurlyAt = null;
      token.selectorsStart = null;
      token.selectorsEnd = null;
      token.selectors = [];
    } else if (type === "at") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.value = null;
      token.identifier = null;
      token.identifierStartsAt = null;
      token.identifierEndsAt = null;
      token.query = null;
      token.queryStartsAt = null;
      token.queryEndsAt = null;
      token.openingCurlyAt = null;
      token.closingCurlyAt = null;
    } else if (type === "text") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.value = null;
    } else if (type === "esp") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.value = null;
      token.head = null;
      token.tail = null;
      token.kind = null;
    }
  }
  for (let i = 0; i <= len; i++) {
    if (!doNothing && str[i] && opts.reportProgressFunc) {
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
    if (
      styleStarts &&
      token.type &&
      !["rule", "at", "text"].includes(token.type)
    ) {
      styleStarts = false;
    }
    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
    }
    if (!doNothing && atRuleWaitingForClosingCurlie()) {
      if (str[i] === "}") {
        if (
          token.type === null ||
          token.type === "text" ||
          (token.type === "rule" && token.openingCurlyAt === null)
        ) {
          if (token.type === "rule") {
            token.end = left(str, i) + 1;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token);
            token = tokenReset();
            if (left(str, i) < i - 1) {
              initToken("text", left(str, i) + 1);
            }
          }
          dumpCurrentToken(token, i);
          const poppedToken = layers.pop();
          token = poppedToken.token;
          token.closingCurlyAt = i;
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
          pingTagCb(token);
          token = tokenReset();
          doNothing = i + 1;
        }
      } else if (token.type === "text" && str[i] && str[i].trim().length) {
        token.end = i;
        token.value = str.slice(token.start, token.end);
        pingTagCb(token);
        token = tokenReset();
      }
    }
    if (token.end && token.end === i) {
      if (token.tagName === "style" && !token.closing) {
        styleStarts = true;
      }
      dumpCurrentToken(token, i);
      layers = [];
    }
    if (!doNothing) {
      if (
        ["tag", "esp", "rule", "at"].includes(token.type) &&
        token.kind !== "cdata"
      ) {
        if (
          [`"`, `'`, `(`, `)`].includes(str[i]) &&
          !(
            (
              [`"`, `'`].includes(str[left(str, i)]) &&
              str[left(str, i)] === str[right(str, i)]
            )
          )
        ) {
          if (matchLayerLast(str, i)) {
            layers.pop();
          } else {
            layers.push({
              type: "simple",
              value: str[i],
              position: i,
            });
          }
        }
      } else if (
        token.type === "comment" &&
        ["only", "not"].includes(token.kind)
      ) {
        if ([`[`, `]`].includes(str[i])) {
          if (matchLayerLast(str, i)) {
            layers.pop();
          } else {
            layers.push({
              type: "simple",
              value: str[i],
              position: i,
            });
          }
        }
      }
    }
    if (
      !doNothing &&
      token.type === "at" &&
      Number.isInteger(token.start) &&
      i >= token.start &&
      !Number.isInteger(token.identifierStartsAt) &&
      str[i] &&
      str[i].trim().length &&
      str[i] !== "@"
    ) {
      token.identifierStartsAt = i;
    }
    if (
      !doNothing &&
      token.type === "at" &&
      Number.isInteger(token.queryStartsAt) &&
      !Number.isInteger(token.queryEndsAt) &&
      "{};".includes(str[i])
    ) {
      if (str[i - 1] && str[i - 1].trim().length) {
        token.queryEndsAt = i;
      } else {
        token.queryEndsAt = left(str, i) + 1;
      }
      token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
    }
    if (
      !doNothing &&
      token.type === "at" &&
      str[i] === "{" &&
      token.identifier &&
      !Number.isInteger(token.openingCurlyAt)
    ) {
      token.openingCurlyAt = i;
      layers.push({
        type: "at",
        token,
      });
      const charIdxOnTheRight = right(str, i);
      if (str[charIdxOnTheRight] === "}") {
        token.closingCurlyAt = charIdxOnTheRight;
        pingTagCb(token);
        doNothing = charIdxOnTheRight;
      } else {
        tokenReset();
        if (charIdxOnTheRight > i + 1) {
          initToken("text", i + 1);
          token.end = charIdxOnTheRight;
          token.value = str.slice(token.start, token.end);
          pingTagCb(token);
        }
        tokenReset();
        initToken("rule", charIdxOnTheRight);
        doNothing = charIdxOnTheRight;
      }
    }
    if (
      !doNothing &&
      token.type === "at" &&
      token.identifier &&
      str[i] &&
      str[i].trim().length &&
      !Number.isInteger(token.queryStartsAt)
    ) {
      token.queryStartsAt = i;
    }
    if (
      !doNothing &&
      token.type === "at" &&
      Number.isInteger(token.identifierStartsAt) &&
      i >= token.start &&
      str[i] &&
      (!str[i].trim().length || "()".includes(str[i])) &&
      !Number.isInteger(token.identifierEndsAt)
    ) {
      token.identifierEndsAt = i;
      token.identifier = str.slice(token.identifierStartsAt, i);
    }
    if (
      token.type === "rule" &&
      Number.isInteger(selectorChunkStartedAt) &&
      (charsThatEndCSSChunks.includes(str[i]) ||
        (str[i] &&
          !str[i].trim().length &&
          charsThatEndCSSChunks.includes(str[right(str, i)])))
    ) {
      token.selectors.push({
        value: str.slice(selectorChunkStartedAt, i),
        selectorStarts: selectorChunkStartedAt,
        selectorEnds: i,
      });
      selectorChunkStartedAt = undefined;
      token.selectorsEnd = i;
    }
    if (!doNothing) {
      if (startsTag(str, i, token, layers)) {
        if (token.type && token.start !== null) {
          dumpCurrentToken(token, i);
          tokenReset();
        }
        initToken("tag", i);
        if (styleStarts) {
          styleStarts = false;
        }
        if (
          matchRight(str, i, "doctype", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
          })
        ) {
          token.kind = "doctype";
        } else if (
          matchRight(str, i, "cdata", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
          })
        ) {
          token.kind = "cdata";
        } else if (
          matchRight(str, i, "xml", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
          })
        ) {
          token.kind = "xml";
        }
      } else if (startsComment(str, i, token)) {
        if (Number.isInteger(token.start)) {
          dumpCurrentToken(token, i);
        }
        tokenReset();
        initToken("comment", i);
        if (str[i] === "-") {
          token.closing = true;
        } else if (
          matchRightIncl(str, i, ["<![endif]-->"], {
            i: true,
            trimBeforeMatching: true,
            maxMismatches: 2,
          })
        ) {
          token.closing = true;
          token.kind = "only";
        }
        if (styleStarts) {
          styleStarts = false;
        }
      } else if (startsEsp(str, i, token, layers, styleStarts)) {
        let wholeEspTagLump = "";
        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagLump = wholeEspTagLump + str[y];
          } else {
            break;
          }
        }
        if (
          !espLumpBlacklist.includes(wholeEspTagLump) &&
          (!Array.isArray(layers) ||
            !layers.length ||
            layers[layers.length - 1].type !== "simple" ||
            layers[layers.length - 1].value !== str[i + wholeEspTagLump.length])
        ) {
          let lengthOfClosingEspChunk;
          if (layers.length && matchLayerLast(str, i)) {
            lengthOfClosingEspChunk = matchLayerLast(str, i);
            if (token.type === "esp") {
              if (!Number.isInteger(token.end)) {
                token.end = i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
              }
              if (parentTokenToWrapAround) {
                if (!Array.isArray(parentTokenToWrapAround.attribs)) {
                  parentTokenToWrapAround.attribs = [];
                }
                parentTokenToWrapAround.attribs.push(clone(token));
                token = clone(parentTokenToWrapAround);
                parentTokenToWrapAround = undefined;
                layers.pop();
                continue;
              } else {
                dumpCurrentToken(token, i);
              }
              tokenReset();
            }
            layers.pop();
          } else if (layers.length && matchLayerFirst(str, i)) {
            lengthOfClosingEspChunk = matchLayerFirst(str, i);
            if (token.type === "esp") {
              if (!Number.isInteger(token.end)) {
                token.end = i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
              }
              dumpCurrentToken(token, i);
              tokenReset();
            }
            layers = [];
          } else {
            layers.push({
              type: "esp",
              openingLump: wholeEspTagLump,
              guessedClosingLump: flipEspTag(wholeEspTagLump),
              position: i,
            });
            if (token.start !== null) {
              if (
                token.type === "tag"
              ) {
                if (!token.tagName || !token.tagNameEndsAt) {
                  token.tagNameEndsAt = i;
                  token.tagName = str.slice(token.tagNameStartsAt, i);
                  token.recognised = isTagNameRecognised(token.tagName);
                }
                parentTokenToWrapAround = clone(token);
              } else {
                dumpCurrentToken(token, i);
              }
            }
            initToken("esp", i);
            token.tail = flipEspTag(wholeEspTagLump);
            token.head = wholeEspTagLump;
          }
          doNothing =
            i +
            (lengthOfClosingEspChunk
              ? lengthOfClosingEspChunk
              : wholeEspTagLump.length);
        }
      } else if (token.start === null || token.end === i) {
        if (styleStarts) {
          if (str[i] && !str[i].trim().length) {
            tokenReset();
            initToken("text", i);
            token.end = right(str, i) || str.length;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token);
            doNothing = token.end;
            tokenReset();
            if (
              right(str, i) &&
              !["{", "}", "<"].includes(str[right(str, i)])
            ) {
              const idxOnTheRight = right(str, i);
              initToken(
                str[idxOnTheRight] === "@" ? "at" : "rule",
                idxOnTheRight
              );
              if (str[i + 1] && !str[i + 1].trim().length) {
                doNothing = right(str, i);
              }
            }
          } else if (str[i]) {
            tokenReset();
            if ("}".includes(str[i])) {
              initToken("text", i);
              doNothing = i + 1;
            } else {
              initToken(str[i] === "@" ? "at" : "rule", i);
            }
          }
        } else if (str[i]) {
          if (i) {
            token = tokenReset();
          }
          initToken("text", i);
        }
      } else if (
        token.type === "text" &&
        styleStarts &&
        str[i] &&
        str[i].trim().length &&
        !"{},".includes(str[i])
      ) {
        dumpCurrentToken(token, i);
        tokenReset();
        initToken("rule", i);
      }
    }
    if (
      !doNothing &&
      token.type === "rule" &&
      str[i] &&
      str[i].trim().length &&
      !"{}".includes(str[i]) &&
      !Number.isInteger(selectorChunkStartedAt) &&
      !Number.isInteger(token.openingCurlyAt)
    ) {
      if (!",".includes(str[i])) {
        selectorChunkStartedAt = i;
        if (token.selectorsStart === null) {
          token.selectorsStart = i;
        }
      } else {
        token.selectorsEnd = i + 1;
      }
    }
    if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
      if (str[i] === "[") ;
    }
    if (!doNothing) {
      if (token.type === "tag" && !layers.length && str[i] === ">") {
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
      } else if (
        token.type === "comment" &&
        !layers.length &&
        token.kind === "simple" &&
        ((str[token.start] === "<" &&
          str[i] === "-" &&
          (matchLeft(str, i, "!-", {
            trimBeforeMatching: true,
          }) ||
            (matchLeftIncl(str, i, "!-", {
              trimBeforeMatching: true,
            }) &&
              str[i + 1] !== "-"))) ||
          (str[token.start] === "-" &&
            str[i] === ">" &&
            matchLeft(str, i, "--", {
              trimBeforeMatching: true,
              maxMismatches: 1,
            })))
      ) {
        if (
          str[i] === "-" &&
          (matchRight(str, i, ["[if", "(if", "{if"], {
            i: true,
            trimBeforeMatching: true,
          }) ||
            (matchRight(str, i, ["if"], {
              i: true,
              trimBeforeMatching: true,
            }) &&
              (xBeforeYOnTheRight(str, i, "]", ">") ||
                (str.includes("mso", i) &&
                  !str.slice(i, str.indexOf("mso")).includes("<") &&
                  !str.slice(i, str.indexOf("mso")).includes(">")))))
        ) {
          token.kind = "only";
        } else if (
          str[token.start] !== "-" &&
          matchRightIncl(str, i, ["-<![endif"], {
            i: true,
            trimBeforeMatching: true,
            maxMismatches: 2,
          })
        ) {
          token.kind = "not";
          token.closing = true;
        } else if (
          token.kind === "simple" &&
          !token.closing &&
          str[right(str, i)] === ">"
        ) {
          token.end = right(str, i) + 1;
          token.kind = "simplet";
          token.closing = null;
        } else {
          token.end = i + 1;
          if (str[left(str, i)] === "!" && str[right(str, i)] === "-") {
            token.end = right(str, i) + 1;
          }
          token.value = str.slice(token.start, token.end);
        }
      } else if (
        token.type === "comment" &&
        str[i] === ">" &&
        (!layers.length || str[right(str, i)] === "<")
      ) {
        if (
          Array.isArray(layers) &&
          layers.length &&
          layers[layers.length - 1].value === "["
        ) {
          layers.pop();
        }
        if (
          !["simplet", "not"].includes(token.kind) &&
          matchRight(str, i, ["<!-->", "<!---->"], {
            trimBeforeMatching: true,
            maxMismatches: 1,
            lastMustMatch: true,
          })
        ) {
          token.kind = "not";
        } else {
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
        }
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
        if (wholeEspTagClosing.length > token.head.length) {
          const headsFirstChar = token.head[0];
          if (wholeEspTagClosing.endsWith(token.head)) {
            token.end = i + wholeEspTagClosing.length - token.head.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = i + token.tail.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (
            (!token.tail.includes(headsFirstChar) &&
              wholeEspTagClosing.includes(headsFirstChar)) ||
            wholeEspTagClosing.endsWith(token.head) ||
            wholeEspTagClosing.startsWith(token.tail)
          ) {
            const firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(
              0,
              wholeEspTagClosing.indexOf(headsFirstChar)
            );
            const secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(
              wholeEspTagClosing.indexOf(headsFirstChar)
            );
            if (
              firstPartOfWholeEspTagClosing.length &&
              secondPartOfWholeEspTagClosing.length &&
              token.tail
                .split("")
                .every((char) => firstPartOfWholeEspTagClosing.includes(char))
            ) {
              token.end = i + firstPartOfWholeEspTagClosing.length;
              token.value = str.slice(token.start, token.end);
              doNothing = token.end;
            }
          } else {
            token.end = i + wholeEspTagClosing.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          }
        } else {
          token.end = i + wholeEspTagClosing.length;
          token.value = str.slice(token.start, token.end);
          doNothing = token.end;
        }
      }
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      Number.isInteger(token.tagNameStartsAt) &&
      !Number.isInteger(token.tagNameEndsAt)
    ) {
      if (!str[i] || !charSuitableForTagName(str[i])) {
        token.tagNameEndsAt = i;
        token.tagName = str.slice(token.tagNameStartsAt, i).toLowerCase();
        if (token.tagName === "xml" && token.closing && !token.kind) {
          token.kind = "xml";
        }
        if (voidTags.includes(token.tagName)) {
          token.void = true;
        }
        token.recognised = isTagNameRecognised(token.tagName);
      }
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      !Number.isInteger(token.tagNameStartsAt) &&
      Number.isInteger(token.start) &&
      (token.start < i || str[token.start] !== "<")
    ) {
      if (str[i] === "/") {
        token.closing = true;
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartsAt = i;
        if (!token.closing) {
          token.closing = false;
        }
      }
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      token.kind !== "cdata" &&
      Number.isInteger(attrib.attribNameStartsAt) &&
      i > attrib.attribNameStartsAt &&
      attrib.attribNameEndsAt === null &&
      !charSuitableForHTMLAttrName(str[i])
    ) {
      attrib.attribNameEndsAt = i;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, i);
      attrib.attribNameRecognised = allHtmlAttribs.includes(attrib.attribName);
      if (str[i] && !str[i].trim().length && str[right(str, i)] === "=") ; else if (
        (str[i] && !str[i].trim().length) ||
        str[i] === ">" ||
        (str[i] === "/" && str[right(str, i)] === ">")
      ) {
        if (`'"`.includes(str[right(str, i)])) ; else {
          attrib.attribEnd = i;
          token.attribs.push(clone(attrib));
          attribReset();
        }
      }
    }
    if (
      !doNothing &&
      str[i] &&
      token.type === "tag" &&
      token.kind !== "cdata" &&
      Number.isInteger(token.tagNameEndsAt) &&
      i > token.tagNameEndsAt &&
      attrib.attribStart === null &&
      charSuitableForHTMLAttrName(str[i])
    ) {
      attrib.attribStart = i;
      attrib.attribNameStartsAt = i;
    }
    if (!doNothing && token.type === "rule") {
      if (str[i] === "{" && !Number.isInteger(token.openingCurlyAt)) {
        token.openingCurlyAt = i;
      } else if (
        str[i] === "}" &&
        Number.isInteger(token.openingCurlyAt) &&
        !Number.isInteger(token.closingCurlyAt)
      ) {
        token.closingCurlyAt = i;
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        pingTagCb(token);
        tokenReset();
      }
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      Number.isInteger(attrib.attribValueStartsAt) &&
      i >= attrib.attribValueStartsAt &&
      attrib.attribValueEndsAt === null
    ) {
      if (`'"`.includes(str[i])) {
        if (
          str[left(str, i)] === str[i] &&
          !`/>${espChars}`.includes(str[right(str, i)]) &&
          !xBeforeYOnTheRight(str, i, "=", `"`) &&
          !xBeforeYOnTheRight(str, i, "=", `'`) &&
          (xBeforeYOnTheRight(str, i, `"`, `>`) ||
            xBeforeYOnTheRight(str, i, `'`, `>`)) &&
          (!str.slice(i + 1).includes("<") ||
            !str.slice(0, str.indexOf("<")).includes("="))
        ) {
          attrib.attribOpeningQuoteAt = i;
          attrib.attribValueStartsAt = i + 1;
          layers.push({
            type: "simple",
            value: str[i],
            position: i,
          });
        } else if (
          !layers.some((layerObj) => layerObj.type === "esp") &&
          attributeEnds(str, i, attrib)
        ) {
          attrib.attribClosingQuoteAt = i;
          attrib.attribValueEndsAt = i;
          if (Number.isInteger(attrib.attribValueStartsAt)) {
            attrib.attribValue = str.slice(attrib.attribValueStartsAt, i);
          }
          attrib.attribEnd = i + 1;
          if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
            layers.pop();
            layers.pop();
          }
          token.attribs.push(clone(attrib));
          attribReset();
        }
      } else if (
        attrib.attribOpeningQuoteAt === null &&
        ((str[i] && !str[i].trim().length) ||
          ["/", ">"].includes(str[i]) ||
          (espChars.includes(str[i]) && espChars.includes(str[i + 1])))
      ) {
        attrib.attribValueEndsAt = i;
        attrib.attribValue = str.slice(attrib.attribValueStartsAt, i);
        attrib.attribEnd = i;
        token.attribs.push(clone(attrib));
        attribReset();
        layers.pop();
        if (str[i] === ">") {
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (
        str[i] === "=" &&
        (`'"`.includes(str[right(str, i)]) ||
          (str[i - 1] && isLatinLetter(str[i - 1])))
      ) {
        let whitespaceFound;
        let attribClosingQuoteAt;
        for (let y = left(str, i); y >= attrib.attribValueStartsAt; y--) {
          if (!whitespaceFound && str[y] && !str[y].trim().length) {
            whitespaceFound = true;
            if (attribClosingQuoteAt) {
              const extractedChunksVal = str.slice(y, attribClosingQuoteAt);
            }
          }
          if (whitespaceFound && str[y] && str[y].trim().length) {
            whitespaceFound = false;
            if (!attribClosingQuoteAt) {
              attribClosingQuoteAt = y + 1;
            }
          }
        }
        if (attribClosingQuoteAt) {
          attrib.attribValueEndsAt = attribClosingQuoteAt;
          if (Number.isInteger(attrib.attribValueStartsAt)) {
            attrib.attribValue = str.slice(
              attrib.attribValueStartsAt,
              attribClosingQuoteAt
            );
          }
          attrib.attribEnd = attribClosingQuoteAt;
          if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
            layers.pop();
          }
          token.attribs.push(clone(attrib));
          attribReset();
          i = attribClosingQuoteAt - 1;
          continue;
        } else if (
          attrib.attribOpeningQuoteAt &&
          (`'"`.includes(str[right(str, i)]) ||
            allHtmlAttribs.includes(
              str.slice(attrib.attribOpeningQuoteAt + 1, i).trim()
            ))
        ) {
          i = attrib.attribOpeningQuoteAt;
          attrib.attribEnd = attrib.attribOpeningQuoteAt + 1;
          attrib.attribValueStartsAt = null;
          layers.pop();
          token.attribs.push(clone(attrib));
          attribReset();
          continue;
        }
      }
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      !Number.isInteger(attrib.attribValueStartsAt) &&
      Number.isInteger(attrib.attribNameEndsAt) &&
      attrib.attribNameEndsAt <= i &&
      str[i] &&
      str[i].trim().length
    ) {
      if (
        str[i] === "=" &&
        !`'"=`.includes(str[right(str, i)]) &&
        !espChars.includes(str[right(str, i)])
      ) {
        const firstCharOnTheRight = right(str, i);
        const firstQuoteOnTheRightIdx = [
          str.indexOf(`'`, firstCharOnTheRight),
          str.indexOf(`"`, firstCharOnTheRight),
        ].filter((val) => val > 0).length
          ? Math.min(
              ...[
                str.indexOf(`'`, firstCharOnTheRight),
                str.indexOf(`"`, firstCharOnTheRight),
              ].filter((val) => val > 0)
            )
          : undefined;
        if (
          firstCharOnTheRight &&
          str.slice(firstCharOnTheRight).includes("=") &&
          allHtmlAttribs.includes(
            str
              .slice(
                firstCharOnTheRight,
                firstCharOnTheRight +
                  str.slice(firstCharOnTheRight).indexOf("=")
              )
              .trim()
              .toLowerCase()
          )
        ) {
          attrib.attribEnd = i + 1;
          token.attribs.push(clone(attrib));
          attribReset();
        } else if (
          !firstQuoteOnTheRightIdx ||
          str
            .slice(firstCharOnTheRight, firstQuoteOnTheRightIdx)
            .includes("=") ||
          !str.includes(
            str[firstQuoteOnTheRightIdx],
            firstQuoteOnTheRightIdx + 1
          ) ||
          Array.from(
            str.slice(
              firstQuoteOnTheRightIdx + 1,
              str.indexOf(
                str[firstQuoteOnTheRightIdx],
                firstQuoteOnTheRightIdx + 1
              )
            )
          ).some((char) => `<>=`.includes(char))
        ) {
          attrib.attribValueStartsAt = firstCharOnTheRight;
          layers.push({
            type: "simple",
            value: null,
            position: attrib.attribValueStartsAt,
          });
        }
      } else if (`'"`.includes(str[i])) {
        const nextCharIdx = right(str, i);
        if (
          nextCharIdx &&
          `'"`.includes(str[nextCharIdx]) &&
          str[i] !== str[nextCharIdx] &&
          str.length > nextCharIdx + 2 &&
          str.slice(nextCharIdx + 1).includes(str[nextCharIdx]) &&
          (!str.indexOf(str[nextCharIdx], nextCharIdx + 1) ||
            !right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1)) ||
            str[i] !==
              str[
                right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1))
              ]) &&
          !Array.from(
            str.slice(nextCharIdx + 1, str.indexOf(str[nextCharIdx]))
          ).some((char) => `<>=${str[i]}`.includes(char))
        ) {
          layers.pop();
        } else {
          attrib.attribOpeningQuoteAt = i;
          if (str[i + 1]) {
            attrib.attribValueStartsAt = i + 1;
          }
        }
      }
    }
    if (
      str[i] === ">" &&
      token.type === "tag" &&
      attrib.attribStart !== null &&
      attrib.attribEnd === null
    ) {
      let thisIsRealEnding = false;
      if (str[i + 1]) {
        for (let y = i + 1; y < len; y++) {
          if (
            attrib.attribOpeningQuoteAt !== null &&
            str[y] === str[attrib.attribOpeningQuoteAt]
          ) {
            if (y !== i + 1 && str[y - 1] !== "=") {
              thisIsRealEnding = true;
            }
            break;
          } else if (str[y] === ">") {
            break;
          } else if (str[y] === "<") {
            thisIsRealEnding = true;
            layers.pop();
            break;
          } else if (!str[y + 1]) {
            thisIsRealEnding = true;
            break;
          }
        }
      } else {
        thisIsRealEnding = true;
      }
      if (thisIsRealEnding) {
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        if (
          Number.isInteger(attrib.attribValueStartsAt) &&
          i &&
          attrib.attribValueStartsAt < i &&
          str.slice(attrib.attribValueStartsAt, i).trim().length
        ) {
          attrib.attribValueEndsAt = i;
          attrib.attribValue = str.slice(attrib.attribValueStartsAt, i);
        } else {
          attrib.attribValueStartsAt = null;
        }
        attrib.attribEnd = i;
        token.attribs.push(clone(attrib));
        attribReset();
      }
    }
    if (str[i] && opts.charCb) {
      pingCharCb({
        type: token.type,
        chr: str[i],
        i,
      });
    }
    if (!str[i] && token.start !== null) {
      token.end = i;
      token.value = str.slice(token.start, token.end);
      pingTagCb(token);
    }
  }
  if (charStash.length) {
    for (let i = 0, len = charStash.length; i < len; i++) {
      reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
    }
  }
  if (tagStash.length) {
    for (let i = 0, len = tagStash.length; i < len; i++) {
      reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
    }
  }
  return {
    timeTakenInMilliseconds: Date.now() - start,
  };
}

export default tokenizer;
