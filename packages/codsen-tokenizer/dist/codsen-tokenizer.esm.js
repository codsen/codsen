/**
 * codsen-tokenizer
 * HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 * Version: 2.17.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
 */

import { matchRight, matchLeft, matchRightIncl, matchLeftIncl } from 'string-match-left-right';
import clone from 'lodash.clonedeep';
import { right, left } from 'string-left-right';
import attributeEnds from 'is-html-attribute-closing';
import { allHtmlAttribs } from 'html-all-known-attributes';
import charSuitableForHTMLAttrName from 'is-char-suitable-for-html-attr-name';
import isTagOpening from 'is-html-tag-opening';

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
const espChars = `{}%-$_()*|#`;
const veryEspChars = `{}()|#`;
const notVeryEspChars = `%$_*#`;
const espLumpBlacklist = [")|(", "|(", ")(", "()", "}{", "{}", "%)", "*)"];
const punctuationChars = `.,;!?`;
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
function flipEspTag(str) {
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
    } else {
      res = `${str[i]}${res}`;
    }
  }
  return res;
}
function isTagNameRecognised(tagName) {
  return (
    allHTMLTagsKnownToHumanity.has(tagName.toLowerCase()) ||
    ["doctype", "cdata", "xml"].includes(tagName.toLowerCase())
  );
}
function xBeforeYOnTheRight(str, startingIdx, x, y) {
  for (let i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      return true;
    }
    if (str.startsWith(y, i)) {
      return false;
    }
  }
  return false;
}

function getWholeEspTagLumpOnTheRight(str, i, layers) {
  let wholeEspTagLumpOnTheRight = str[i];
  const len = str.length;
  for (let y = i + 1; y < len; y++) {
    if (
      wholeEspTagLumpOnTheRight.length > 1 &&
      (wholeEspTagLumpOnTheRight.includes(`{`) ||
        wholeEspTagLumpOnTheRight.includes(`[`) ||
        wholeEspTagLumpOnTheRight.includes(`(`)) &&
      str[y] === "("
    ) {
      break;
    }
    if (
      espChars.includes(str[y]) ||
      (str[i] === "<" && str[y] === "/") ||
      (str[y] === ">" &&
        wholeEspTagLumpOnTheRight === "--" &&
        Array.isArray(layers) &&
        layers.length &&
        layers[layers.length - 1].type === "esp" &&
        layers[layers.length - 1].openingLump[0] === "<" &&
        layers[layers.length - 1].openingLump[2] === "-" &&
        layers[layers.length - 1].openingLump[3] === "-")
    ) {
      wholeEspTagLumpOnTheRight += str[y];
    } else {
      break;
    }
  }
  if (
    wholeEspTagLumpOnTheRight &&
    Array.isArray(layers) &&
    layers.length &&
    layers[layers.length - 1].type === "esp" &&
    layers[layers.length - 1].guessedClosingLump &&
    wholeEspTagLumpOnTheRight.length >
      layers[layers.length - 1].guessedClosingLump.length
  ) {
    if (
      wholeEspTagLumpOnTheRight.endsWith(layers[layers.length - 1].openingLump)
    ) {
      return wholeEspTagLumpOnTheRight.slice(
        0,
        wholeEspTagLumpOnTheRight.length -
          layers[layers.length - 1].openingLump.length
      );
    }
    let uniqueCharsListFromGuessedClosingLumpArr = new Set(
      layers[layers.length - 1].guessedClosingLump
    );
    let found = 0;
    for (let y = 0, len2 = wholeEspTagLumpOnTheRight.length; y < len2; y++) {
      if (
        !uniqueCharsListFromGuessedClosingLumpArr.has(
          wholeEspTagLumpOnTheRight[y]
        ) &&
        found > 1
      ) {
        return wholeEspTagLumpOnTheRight.slice(0, y);
      }
      if (
        uniqueCharsListFromGuessedClosingLumpArr.has(
          wholeEspTagLumpOnTheRight[y]
        )
      ) {
        found += 1;
        uniqueCharsListFromGuessedClosingLumpArr = new Set(
          [...uniqueCharsListFromGuessedClosingLumpArr].filter(
            (el) => el !== wholeEspTagLumpOnTheRight[y]
          )
        );
      }
    }
  }
  return wholeEspTagLumpOnTheRight;
}

function matchLayerLast(wholeEspTagLump, layers, matchFirstInstead) {
  if (!layers.length) {
    return;
  }
  const whichLayerToMatch = matchFirstInstead
    ? layers[0]
    : layers[layers.length - 1];
  if (whichLayerToMatch.type !== "esp") {
    return;
  }
  if (
    wholeEspTagLump.includes(whichLayerToMatch.guessedClosingLump) ||
    Array.from(wholeEspTagLump).every((char) =>
      whichLayerToMatch.guessedClosingLump.includes(char)
    )
  ) {
    return wholeEspTagLump.length;
  }
}

function startsComment(str, i, token, layers) {
  return (
    (str[i] === "<" &&
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
      (token.type !== "comment" || (!token.closing && token.kind !== "not")) &&
      !matchLeft(str, i, "<", {
        trimBeforeMatching: true,
        trimCharsBeforeMatching: ["-", "!"],
      }) &&
      (!Array.isArray(layers) ||
        !layers.length ||
        layers[layers.length - 1].type !== "esp" ||
        !(
          layers[layers.length - 1].openingLump[0] === "<" &&
          layers[layers.length - 1].openingLump[2] === "-" &&
          layers[layers.length - 1].openingLump[3] === "-"
        )))
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
    (token.type !== "esp" || (token.tail && token.tail.includes(str[i])))
  );
}

function startsEsp(str, i, token, layers, styleStarts) {
  const res =
    (espChars.includes(str[i]) &&
      str[i + 1] &&
      espChars.includes(str[i + 1]) &&
      !(
        notVeryEspChars.includes(str[i]) && notVeryEspChars.includes(str[i + 1])
      ) &&
      (str[i] !== str[i + 1] || veryEspChars.includes(str[i])) &&
      token.type !== "rule" &&
      token.type !== "at" &&
      !(str[i] === "-" && "-{(".includes(str[i + 1])) &&
      !("})".includes(str[i]) && "-".includes(str[i + 1])) &&
      !(
        (
          str[i] === "%" &&
          str[i + 1] === "%" &&
          "0123456789".includes(str[i - 1]) &&
          (!str[i + 2] ||
            punctuationChars.includes(str[i + 2]) ||
            !str[i + 2].trim().length)
        )
      ) &&
      !(
        styleStarts &&
        ("{}".includes(str[i]) || "{}".includes(str[right(str, i)]))
      )) ||
    (str[i] === "<" &&
      ((str[i + 1] === "/" && espChars.includes(str[i + 2])) ||
        (espChars.includes(str[i + 1]) &&
          !["-"].includes(str[i + 1])))) ||
    (`>})`.includes(str[i]) &&
      Array.isArray(layers) &&
      layers.length &&
      layers[layers.length - 1].type === "esp" &&
      layers[layers.length - 1].openingLump.includes(flipEspTag(str[i])) &&
      (str[i] !== ">" || !xBeforeYOnTheRight(str, i + 1, ">", "<"))) ||
    (str[i] === "-" &&
      str[i + 1] === "-" &&
      str[i + 2] === ">" &&
      Array.isArray(layers) &&
      layers.length &&
      layers[layers.length - 1].type === "esp" &&
      layers[layers.length - 1].openingLump[0] === "<" &&
      layers[layers.length - 1].openingLump[2] === "-" &&
      layers[layers.length - 1].openingLump[3] === "-");
  return res;
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
const BACKTICK = "\x60";
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
  const opts = { ...defaults, ...originalOpts };
  let currentPercentageDone;
  let lastPercentage = 0;
  const len = str.length;
  const midLen = Math.floor(len / 2);
  let doNothing;
  let withinStyle = false;
  const tagStash = [];
  const charStash = [];
  let token = {};
  const tokenDefault = {
    type: null,
    start: null,
    end: null,
    value: null,
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
    attribValueRaw: null,
    attribValue: [],
    attribValueStartsAt: null,
    attribValueEndsAt: null,
    attribStart: null,
    attribEnd: null,
    attribLeft: null,
  };
  function attribReset() {
    attrib = clone(attribDefault);
  }
  tokenReset();
  let selectorChunkStartedAt;
  let parentTokenToBackup;
  let attribToBackup;
  let lastNonWhitespaceCharAt;
  const layers = [];
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
  function dumpCurrentToken(incomingToken, i) {
    if (
      !["text", "esp"].includes(incomingToken.type) &&
      incomingToken.start !== null &&
      incomingToken.start < i &&
      ((str[~-i] && !str[~-i].trim()) || str[i] === "<")
    ) {
      incomingToken.end = left(str, i) + 1;
      incomingToken.value = str.slice(incomingToken.start, incomingToken.end);
      if (
        incomingToken.type === "tag" &&
        !"/>".includes(str[~-incomingToken.end])
      ) {
        let cutOffIndex = incomingToken.tagNameEndsAt || i;
        if (
          Array.isArray(incomingToken.attribs) &&
          incomingToken.attribs.length
        ) {
          for (
            let i2 = 0, len2 = incomingToken.attribs.length;
            i2 < len2;
            i2++
          ) {
            if (incomingToken.attribs[i2].attribNameRecognised) {
              cutOffIndex = incomingToken.attribs[i2].attribEnd;
              if (
                str[cutOffIndex + 1] &&
                !str[cutOffIndex].trim() &&
                str[cutOffIndex + 1].trim()
              ) {
                cutOffIndex += 1;
              }
            } else {
              if (i2 === 0) {
                incomingToken.attribs.length = 0;
              } else {
                incomingToken.attribs = incomingToken.attribs.splice(0, i2);
              }
              break;
            }
          }
        }
        incomingToken.end = cutOffIndex;
        incomingToken.value = str.slice(incomingToken.start, incomingToken.end);
        if (!incomingToken.tagNameEndsAt) {
          incomingToken.tagNameEndsAt = cutOffIndex;
        }
        if (
          incomingToken.tagNameStartsAt &&
          incomingToken.tagNameEndsAt &&
          !incomingToken.tagName
        ) {
          incomingToken.tagName = str.slice(
            incomingToken.tagNameStartsAt,
            cutOffIndex
          );
          incomingToken.recognised = isTagNameRecognised(incomingToken.tagName);
        }
        pingTagCb(incomingToken);
        initToken("text", cutOffIndex);
      } else {
        pingTagCb(incomingToken);
        tokenReset();
        if (str[~-i] && !str[~-i].trim()) {
          initToken("text", left(str, i) + 1);
        }
      }
    }
    if (token.start !== null) {
      if (token.end === null && token.start !== i) {
        token.end = i;
        token.value = str.slice(token.start, token.end);
      }
      if (token.start !== null && token.end) {
        if (
          Array.isArray(layers) &&
          layers.length &&
          layers[layers.length - 1].type === "at"
        ) {
          layers[layers.length - 1].token.rules.push(token);
        } else {
          pingTagCb(token);
        }
      }
      tokenReset();
    }
  }
  function atRuleWaitingForClosingCurlie() {
    return (
      layers.length &&
      layers[~-layers.length].type === "at" &&
      isObj(layers[~-layers.length].token) &&
      layers[~-layers.length].token.openingCurlyAt &&
      !layers[~-layers.length].token.closingCurlyAt
    );
  }
  function getNewToken(type, startVal = null) {
    if (type === "tag") {
      return {
        type,
        start: startVal,
        end: null,
        value: null,
        tagNameStartsAt: null,
        tagNameEndsAt: null,
        tagName: null,
        recognised: null,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [],
      };
    }
    if (type === "comment") {
      return {
        type,
        start: startVal,
        end: null,
        value: null,
        closing: false,
        kind: "simple",
      };
    }
    if (type === "rule") {
      return {
        type,
        start: startVal,
        end: null,
        value: null,
        left: null,
        nested: false,
        openingCurlyAt: null,
        closingCurlyAt: null,
        selectorsStart: null,
        selectorsEnd: null,
        selectors: [],
      };
    }
    if (type === "at") {
      return {
        type,
        start: startVal,
        end: null,
        value: null,
        left: null,
        nested: false,
        openingCurlyAt: null,
        closingCurlyAt: null,
        identifier: null,
        identifierStartsAt: null,
        identifierEndsAt: null,
        query: null,
        queryStartsAt: null,
        queryEndsAt: null,
        rules: [],
      };
    }
    if (type === "text") {
      return {
        type,
        start: startVal,
        end: null,
        value: null,
      };
    }
    if (type === "esp") {
      return {
        type,
        start: startVal,
        end: null,
        value: null,
        head: null,
        headStartsAt: null,
        headEndsAt: null,
        tail: null,
        tailStartsAt: null,
        tailEndsAt: null,
      };
    }
  }
  function initToken(type, startVal) {
    attribReset();
    token = getNewToken(type, startVal);
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
      withinStyle &&
      token.type &&
      !["rule", "at", "text"].includes(token.type)
    ) {
      withinStyle = false;
    }
    if (doNothing && i >= doNothing) {
      doNothing = false;
    }
    if (
      isLatinLetter(str[i]) &&
      isLatinLetter(str[~-i]) &&
      isLatinLetter(str[i + 1])
    ) {
      continue;
    }
    if (
      ` \t\r\n`.includes(str[i]) &&
      str[i] === str[~-i] &&
      str[i] === str[i + 1]
    ) {
      continue;
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
            if (
              Array.isArray(layers) &&
              layers.length &&
              layers[layers.length - 1].type === "at"
            ) {
              layers[layers.length - 1].token.rules.push(token);
            }
            tokenReset();
            if (left(str, i) < ~-i) {
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
          if (
            Array.isArray(layers) &&
            layers.length &&
            layers[layers.length - 1].type === "at"
          ) {
            layers[layers.length - 1].token.rules.push(token);
          }
          tokenReset();
          doNothing = i + 1;
        }
      } else if (token.type === "text" && str[i] && str[i].trim()) {
        token.end = i;
        token.value = str.slice(token.start, token.end);
        if (
          Array.isArray(layers) &&
          layers.length &&
          layers[layers.length - 1].type === "at"
        ) {
          layers[layers.length - 1].token.rules.push(token);
        } else {
          pingTagCb(token);
        }
        tokenReset();
      }
    }
    if (token.end && token.end === i) {
      if (token.tagName === "style" && !token.closing) {
        withinStyle = true;
      }
      if (attribToBackup) {
        attrib = attribToBackup;
        attrib.attribValue.push(token);
        token = clone(parentTokenToBackup);
        attribToBackup = undefined;
        parentTokenToBackup = undefined;
      } else {
        dumpCurrentToken(token, i);
        layers.length = 0;
      }
    }
    if (!doNothing) {
      if (
        ["tag", "rule", "at"].includes(token.type) &&
        token.kind !== "cdata"
      ) {
        if (
          [`"`, `'`, `(`, `)`].includes(str[i]) &&
          !(
            (
              [`"`, `'`, "`"].includes(str[left(str, i)]) &&
              str[left(str, i)] === str[right(str, i)]
            )
          )
        ) {
          if (
            Array.isArray(layers) &&
            layers.length &&
            layers[~-layers.length].type === "simple" &&
            layers[~-layers.length].value === flipEspTag(str[i])
          ) {
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
          if (
            Array.isArray(layers) &&
            layers.length &&
            layers[~-layers.length].type === "simple" &&
            layers[~-layers.length].value === flipEspTag(str[i])
          ) {
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
        token.type === "esp" &&
        `'"${BACKTICK}()`.includes(str[i]) &&
        !(
          (
            [`"`, `'`, "`"].includes(str[left(str, i)]) &&
            str[left(str, i)] === str[right(str, i)]
          )
        )
      ) {
        if (
          Array.isArray(layers) &&
          layers.length &&
          layers[~-layers.length].type === "simple" &&
          layers[~-layers.length].value === flipEspTag(str[i])
        ) {
          layers.pop();
          doNothing = i + 1;
        } else if (!`]})>`.includes(str[i])) {
          layers.push({
            type: "simple",
            value: str[i],
            position: i,
          });
        }
      }
    }
    if (
      !doNothing &&
      token.type === "at" &&
      token.start != null &&
      i >= token.start &&
      !token.identifierStartsAt &&
      str[i] &&
      str[i].trim() &&
      str[i] !== "@"
    ) {
      token.identifierStartsAt = i;
    }
    if (
      !doNothing &&
      token.type === "at" &&
      token.queryStartsAt != null &&
      !token.queryEndsAt &&
      `{;`.includes(str[i])
    ) {
      if (str[i] === "{") {
        if (str[~-i] && str[~-i].trim()) {
          token.queryEndsAt = i;
        } else {
          token.queryEndsAt = left(str, i) + 1;
        }
      } else {
        token.queryEndsAt = left(str, i + 1);
      }
      token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
      token.end = str[i] === ";" ? i + 1 : i;
      token.value = str.slice(token.start, token.end);
      if (str[i] === ";") {
        pingTagCb(token);
      } else {
        token.openingCurlyAt = i;
        layers.push({
          type: "at",
          token,
        });
      }
      tokenReset();
      doNothing = i + 1;
    }
    if (
      !doNothing &&
      token.type === "at" &&
      token.identifier &&
      str[i] &&
      str[i].trim() &&
      !token.queryStartsAt
    ) {
      token.queryStartsAt = i;
    }
    if (
      !doNothing &&
      token.type === "at" &&
      token.identifierStartsAt != null &&
      i >= token.start &&
      str[i] &&
      (!str[i].trim() || "()".includes(str[i])) &&
      !token.identifierEndsAt
    ) {
      token.identifierEndsAt = i;
      token.identifier = str.slice(token.identifierStartsAt, i);
    }
    if (
      token.type === "rule" &&
      selectorChunkStartedAt &&
      (charsThatEndCSSChunks.includes(str[i]) ||
        (str[i] &&
          !str[i].trim() &&
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
    if (!doNothing && str[i]) {
      if (startsTag(str, i, token, layers)) {
        if (token.type && token.start !== null) {
          dumpCurrentToken(token, i);
          tokenReset();
        }
        initToken("tag", i);
        if (withinStyle) {
          withinStyle = false;
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
      } else if (startsComment(str, i, token, layers)) {
        if (token.start != null) {
          dumpCurrentToken(token, i);
        }
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
        if (withinStyle) {
          withinStyle = false;
        }
      } else if (
        startsEsp(str, i, token, layers, withinStyle) &&
        (!Array.isArray(layers) ||
          !layers.length ||
          layers[~-layers.length].type !== "simple" ||
          ![`'`, `"`].includes(layers[~-layers.length].value) ||
          (attrib && attrib.attribStart && !attrib.attribEnd))
      ) {
        const wholeEspTagLumpOnTheRight = getWholeEspTagLumpOnTheRight(
          str,
          i,
          layers
        );
        if (!espLumpBlacklist.includes(wholeEspTagLumpOnTheRight)) {
          let lengthOfClosingEspChunk;
          let disposableVar;
          if (
            layers.length &&
            (lengthOfClosingEspChunk = matchLayerLast(
              wholeEspTagLumpOnTheRight,
              layers
            ))
          ) {
            if (token.type === "esp") {
              if (!token.end) {
                token.end = i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
                token.tail = str.slice(i, i + lengthOfClosingEspChunk);
                token.tailStartsAt = i;
                token.tailEndsAt = token.end;
              }
              doNothing = token.tailEndsAt;
              if (parentTokenToBackup) {
                if (!Array.isArray(parentTokenToBackup.attribs)) {
                  parentTokenToBackup.attribs.length = 0;
                }
                if (attribToBackup) {
                  attrib = attribToBackup;
                  attrib.attribValue.push(clone(token));
                } else {
                  parentTokenToBackup.attribs.push(clone(token));
                }
                token = clone(parentTokenToBackup);
                parentTokenToBackup = undefined;
                attribToBackup = undefined;
                layers.pop();
                continue;
              } else {
                dumpCurrentToken(token, i);
              }
              tokenReset();
            }
            layers.pop();
          } else if (
            layers.length &&
            (lengthOfClosingEspChunk = matchLayerLast(
              wholeEspTagLumpOnTheRight,
              layers,
              "matchFirst"
            ))
          ) {
            if (token.type === "esp") {
              if (!token.end) {
                token.end = i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
              }
              dumpCurrentToken(token, i);
              tokenReset();
            }
            layers.length = 0;
          } else if (
            attrib &&
            attrib.attribValue &&
            attrib.attribValue.length &&
            Array.from(
              str.slice(
                attrib.attribValue[~-attrib.attribValue.length].start,
                i
              )
            ).some(
              (char, idx) =>
                wholeEspTagLumpOnTheRight.includes(flipEspTag(char)) &&
                (veryEspChars.includes(char) ||
                  !idx) &&
                (disposableVar = { char, idx })
            ) &&
            token.type === "tag" &&
            attrib &&
            attrib.attribValueStartsAt &&
            !attrib.attribValueEndsAt &&
            attrib.attribValue[~-attrib.attribValue.length] &&
            attrib.attribValue[~-attrib.attribValue.length].type === "text"
          ) {
            token.pureHTML = false;
            const lastAttrValueObj =
              attrib.attribValue[~-attrib.attribValue.length];
            const newTokenToPutInstead = getNewToken(
              "esp",
              lastAttrValueObj.start
            );
            if (!disposableVar || !disposableVar.idx) {
              newTokenToPutInstead.head = disposableVar.char;
              newTokenToPutInstead.headStartsAt = lastAttrValueObj.start;
              newTokenToPutInstead.headEndsAt =
                newTokenToPutInstead.headStartsAt + 1;
              newTokenToPutInstead.tailStartsAt = i;
              newTokenToPutInstead.tailEndsAt =
                i + wholeEspTagLumpOnTheRight.length;
              newTokenToPutInstead.tail = wholeEspTagLumpOnTheRight;
              attrib.attribValue[
                ~-attrib.attribValue.length
              ] = newTokenToPutInstead;
            }
          } else {
            if (
              Array.isArray(layers) &&
              layers.length &&
              layers[~-layers.length].type === "esp"
            ) {
              layers.pop();
            }
            if (attribToBackup) {
              if (!Array.isArray(attribToBackup.attribValue)) {
                attribToBackup.attribValue.length = 0;
              }
              attribToBackup.attribValue.push(token);
            }
            layers.push({
              type: "esp",
              openingLump: wholeEspTagLumpOnTheRight,
              guessedClosingLump: flipEspTag(wholeEspTagLumpOnTheRight),
              position: i,
            });
            if (token.start !== null) {
              if (token.type === "tag") {
                if (!token.tagName || !token.tagNameEndsAt) {
                  token.tagNameEndsAt = i;
                  token.tagName = str.slice(token.tagNameStartsAt, i);
                  token.recognised = isTagNameRecognised(token.tagName);
                }
                parentTokenToBackup = clone(token);
                if (attrib.attribStart && !attrib.attribEnd) {
                  attribToBackup = clone(attrib);
                }
              } else if (!attribToBackup) {
                dumpCurrentToken(token, i);
              } else if (
                attribToBackup &&
                Array.isArray(attribToBackup.attribValue) &&
                attribToBackup.attribValue.length &&
                attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                  .type === "esp" &&
                !attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                  .end
              ) {
                attribToBackup.attribValue[
                  ~-attribToBackup.attribValue.length
                ].end = i;
                attribToBackup.attribValue[
                  ~-attribToBackup.attribValue.length
                ].value = str.slice(
                  attribToBackup.attribValue[
                    ~-attribToBackup.attribValue.length
                  ].start,
                  i
                );
              }
            }
            initToken("esp", i);
            token.head = wholeEspTagLumpOnTheRight;
            token.headStartsAt = i;
            token.headEndsAt = i + wholeEspTagLumpOnTheRight.length;
            if (parentTokenToBackup && parentTokenToBackup.pureHTML) {
              parentTokenToBackup.pureHTML = false;
            }
            if (
              attribToBackup &&
              Array.isArray(attribToBackup.attribValue) &&
              attribToBackup.attribValue.length
            ) {
              if (
                attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                  .start === token.start
              ) {
                attribToBackup.attribValue.pop();
              } else if (
                attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                  .type === "text" &&
                !attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                  .end
              ) {
                attribToBackup.attribValue[
                  ~-attribToBackup.attribValue.length
                ].end = i;
                attribToBackup.attribValue[
                  ~-attribToBackup.attribValue.length
                ].value = str.slice(
                  attribToBackup.attribValue[
                    ~-attribToBackup.attribValue.length
                  ].start,
                  i
                );
              }
            }
          }
          doNothing =
            i + (lengthOfClosingEspChunk || wholeEspTagLumpOnTheRight.length);
        }
      } else if (
        withinStyle &&
        str[i] &&
        str[i].trim() &&
        (!token.type ||
          ["text"].includes(token.type))
      ) {
        if (token.type) {
          dumpCurrentToken(token, i);
        }
        initToken(str[i] === "@" ? "at" : "rule", i);
        token.left = lastNonWhitespaceCharAt;
        token.nested = layers.some((o) => o.type === "at");
      } else if (!token.type) {
        initToken("text", i);
      }
    }
    if (
      !doNothing &&
      token.type === "rule" &&
      str[i] &&
      str[i].trim() &&
      !"{}".includes(str[i]) &&
      !selectorChunkStartedAt &&
      !token.openingCurlyAt
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
          layers[~-layers.length].value === "["
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
            wholeEspTagClosing += str[y];
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
          if (
            Array.isArray(layers) &&
            layers.length &&
            layers[~-layers.length].type === "esp"
          ) {
            layers.pop();
          }
          doNothing = token.end;
        }
      }
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      token.tagNameStartsAt &&
      !token.tagNameEndsAt
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
      !token.tagNameStartsAt &&
      token.start != null &&
      (token.start < i || str[token.start] !== "<")
    ) {
      if (str[i] === "/") {
        token.closing = true;
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartsAt = i;
        if (!token.closing) {
          token.closing = false;
        }
      } else ;
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      token.kind !== "cdata" &&
      attrib.attribNameStartsAt &&
      i > attrib.attribNameStartsAt &&
      attrib.attribNameEndsAt === null &&
      !charSuitableForHTMLAttrName(str[i])
    ) {
      attrib.attribNameEndsAt = i;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, i);
      attrib.attribNameRecognised = allHtmlAttribs.has(attrib.attribName);
      if (str[i] && !str[i].trim() && str[right(str, i)] === "=") ; else if (
        (str[i] && !str[i].trim()) ||
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
      token.tagNameEndsAt &&
      i > token.tagNameEndsAt &&
      attrib.attribStart === null &&
      charSuitableForHTMLAttrName(str[i])
    ) {
      attrib.attribStart = i;
      attrib.attribLeft = lastNonWhitespaceCharAt;
      attrib.attribNameStartsAt = i;
    }
    if (!doNothing && token.type === "rule") {
      if (str[i] === "{" && !token.openingCurlyAt) {
        token.openingCurlyAt = i;
      } else if (
        str[i] === "}" &&
        token.openingCurlyAt &&
        !token.closingCurlyAt
      ) {
        token.closingCurlyAt = i;
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        pingTagCb(token);
        if (
          Array.isArray(layers) &&
          layers.length &&
          layers[layers.length - 1].type === "at"
        ) {
          layers[layers.length - 1].token.rules.push(token);
        }
        tokenReset();
      }
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      attrib.attribValueStartsAt &&
      i >= attrib.attribValueStartsAt &&
      attrib.attribValueEndsAt === null
    ) {
      if (`'"`.includes(str[i])) {
        const R1 = !layers.some((layerObj) => layerObj.type === "esp");
        const R2 = attributeEnds(
          str,
          attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt,
          i
        );
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
          if (
            Array.isArray(attrib.attribValue) &&
            attrib.attribValue.length &&
            attrib.attribValue[~-attrib.attribValue.length].start &&
            !attrib.attribValue[~-attrib.attribValue.length].end &&
            attrib.attribValueStartsAt >
              attrib.attribValue[~-attrib.attribValue.length].start
          ) {
            attrib.attribValue[~-attrib.attribValue.length].start =
              attrib.attribValueStartsAt;
          }
          layers.push({
            type: "simple",
            value: str[i],
            position: i,
          });
        } else if (
          !layers.some((layerObj) => layerObj.type === "esp") &&
          attributeEnds(
            str,
            attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt,
            i
          )
        ) {
          attrib.attribClosingQuoteAt = i;
          attrib.attribValueEndsAt = i;
          if (attrib.attribValueStartsAt) {
            attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
          }
          attrib.attribEnd = i + 1;
          if (
            Array.isArray(attrib.attribValue) &&
            attrib.attribValue.length &&
            !attrib.attribValue[~-attrib.attribValue.length].end
          ) {
            attrib.attribValue[~-attrib.attribValue.length].end = i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(
              attrib.attribValue[~-attrib.attribValue.length].start,
              i
            );
          }
          if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
            layers.pop();
            layers.pop();
          }
          token.attribs.push(clone(attrib));
          attribReset();
        }
      } else if (
        attrib.attribOpeningQuoteAt === null &&
        ((str[i] && !str[i].trim()) ||
          ["/", ">"].includes(str[i]) ||
          (espChars.includes(str[i]) && espChars.includes(str[i + 1])))
      ) {
        attrib.attribValueEndsAt = i;
        attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
        if (
          Array.isArray(attrib.attribValue) &&
          attrib.attribValue.length &&
          !attrib.attribValue[~-attrib.attribValue.length].end
        ) {
          attrib.attribValue[~-attrib.attribValue.length].end = i;
          attrib.attribValue[~-attrib.attribValue.length].value = str.slice(
            attrib.attribValue[~-attrib.attribValue.length].start,
            attrib.attribValue[~-attrib.attribValue.length].end
          );
        }
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
          (str[~-i] && isLatinLetter(str[~-i])))
      ) {
        let whitespaceFound;
        let attribClosingQuoteAt;
        for (let y = left(str, i); y >= attrib.attribValueStartsAt; y--) {
          if (!whitespaceFound && str[y] && !str[y].trim()) {
            whitespaceFound = true;
            if (attribClosingQuoteAt) {
              const extractedChunksVal = str.slice(y, attribClosingQuoteAt);
            }
          }
          if (whitespaceFound && str[y] && str[y].trim()) {
            whitespaceFound = false;
            if (!attribClosingQuoteAt) {
              attribClosingQuoteAt = y + 1;
            }
          }
        }
        if (attribClosingQuoteAt) {
          attrib.attribValueEndsAt = attribClosingQuoteAt;
          if (attrib.attribValueStartsAt) {
            attrib.attribValueRaw = str.slice(
              attrib.attribValueStartsAt,
              attribClosingQuoteAt
            );
            if (
              Array.isArray(attrib.attribValue) &&
              attrib.attribValue.length &&
              !attrib.attribValue[~-attrib.attribValue.length].end
            ) {
              attrib.attribValue[~-attrib.attribValue.length].end =
                attrib.attribValueEndsAt;
              attrib.attribValue[~-attrib.attribValue.length].value = str.slice(
                attrib.attribValue[~-attrib.attribValue.length].start,
                attrib.attribValueEndsAt
              );
            }
          }
          attrib.attribEnd = attribClosingQuoteAt;
          if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
            layers.pop();
          }
          token.attribs.push(clone(attrib));
          attribReset();
          i = ~-attribClosingQuoteAt;
          continue;
        } else if (
          attrib.attribOpeningQuoteAt &&
          (`'"`.includes(str[right(str, i)]) ||
            allHtmlAttribs.has(
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
      } else if (
        attrib &&
        attrib.attribStart &&
        !attrib.attribEnd &&
        (!Array.isArray(attrib.attribValue) ||
          !attrib.attribValue.length ||
          (attrib.attribValue[~-attrib.attribValue.length].end &&
            attrib.attribValue[~-attrib.attribValue.length].end <= i))
      ) {
        attrib.attribValue.push({
          type: "text",
          start: i,
          end: null,
          value: null,
        });
      }
    } else if (
      token.type === "esp" &&
      attribToBackup &&
      parentTokenToBackup &&
      attribToBackup.attribOpeningQuoteAt &&
      `'"`.includes(str[i]) &&
      str[attribToBackup.attribOpeningQuoteAt] === str[i] &&
      attributeEnds(str, attribToBackup.attribOpeningQuoteAt, i)
    ) {
      token.end = i;
      token.value = str.slice(token.start, i);
      if (attribToBackup && !Array.isArray(attribToBackup.attribValue)) {
        attribToBackup.attribValue.length = 0;
      }
      attribToBackup.attribValue.push(token);
      attribToBackup.attribValueEndsAt = i;
      attribToBackup.attribValueRaw = str.slice(
        attribToBackup.attribValueStartsAt,
        i
      );
      attribToBackup.attribClosingQuoteAt = i;
      attribToBackup.attribEnd = i + 1;
      token = clone(parentTokenToBackup);
      token.attribs.push(attribToBackup);
      attribToBackup = undefined;
      parentTokenToBackup = undefined;
      layers.pop();
      layers.pop();
      layers.pop();
    }
    if (
      !doNothing &&
      token.type === "tag" &&
      !attrib.attribValueStartsAt &&
      attrib.attribNameEndsAt &&
      attrib.attribNameEndsAt <= i &&
      str[i] &&
      str[i].trim()
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
          allHtmlAttribs.has(
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
          token.attribs.push({ ...attrib });
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
          if (
            Array.isArray(attrib.attribValue) &&
            (!attrib.attribValue.length ||
              attrib.attribValue[~-attrib.attribValue.length].end)
          ) {
            attrib.attribValue.push({
              type: "text",
              start: attrib.attribValueStartsAt,
              end: null,
              value: null,
            });
          }
        }
      }
    }
    if (
      str[i] === ">" &&
      token.type === "tag" &&
      attrib.attribStart &&
      !attrib.attribEnd
    ) {
      let thisIsRealEnding = false;
      if (str[i + 1]) {
        for (let y = i + 1; y < len; y++) {
          if (
            attrib.attribOpeningQuoteAt &&
            str[y] === str[attrib.attribOpeningQuoteAt]
          ) {
            if (y !== i + 1 && str[~-y] !== "=") {
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
          attrib.attribValueStartsAt &&
          i &&
          attrib.attribValueStartsAt < i &&
          str.slice(attrib.attribValueStartsAt, i).trim()
        ) {
          attrib.attribValueEndsAt = i;
          attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
          if (
            Array.isArray(attrib.attribValue) &&
            attrib.attribValue.length &&
            !attrib.attribValue[~-attrib.attribValue.length].end
          ) {
            attrib.attribValue[~-attrib.attribValue.length].end = i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(
              attrib.attribValue[~-attrib.attribValue.length].start,
              i
            );
          }
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
    if (str[i] && str[i].trim()) {
      lastNonWhitespaceCharAt = i;
    }
  }
  if (charStash.length) {
    for (let i = 0, len2 = charStash.length; i < len2; i++) {
      reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
    }
  }
  if (tagStash.length) {
    for (let i = 0, len2 = tagStash.length; i < len2; i++) {
      reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
    }
  }
  const timeTakenInMilliseconds = Date.now() - start;
  return {
    timeTakenInMilliseconds,
  };
}

export default tokenizer;
