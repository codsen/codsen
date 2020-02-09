/**
 * codsen-tokenizer
 * Tokenizer for mixed inputs aiming at broken code, especially HTML & CSS
 * Version: 2.7.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
 */

import { allHtmlAttribs } from 'html-all-known-attributes';
import { matchRight } from 'string-match-left-right';
import { left, right } from 'string-left-right';
import isTagOpening from 'is-html-tag-opening';
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
  return /[.\-_a-z0-9\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/i.test(
    char
  );
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
  "wbr"
];
const espChars = `{}%-$_()*|`;
const espLumpBlacklist = [")|(", "|(", ")(", "()", "%)", "*)", "**"];
const charsThatEndCSSChunks = ["{", "}", ","];
function tokenizer(str, originalOpts) {
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
    charCb: null,
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100
  };
  const opts = Object.assign({}, defaults, originalOpts);
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
    end: null
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
    attribEnd: null
  };
  function attribReset() {
    attrib = clone(attribDefault);
  }
  tokenReset();
  attribReset();
  let selectorChunkStartedAt;
  let layers = [];
  function matchLayerLast(str, i, matchFirstInstead) {
    if (!layers.length) {
      return false;
    }
    const whichLayerToMatch = matchFirstInstead
      ? layers[0]
      : layers[layers.length - 1];
    if (whichLayerToMatch.type === "simple") {
      return str[i] === flipEspTag(whichLayerToMatch.value);
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
        let uniqueCharsListFromGuessedClosingLumpArr = whichLayerToMatch.guessedClosingLump
          .split("")
          .reduce((acc, curr) => {
            if (!acc.includes(curr)) {
              return acc.concat([curr]);
            }
            return acc;
          }, []);
        let found = 0;
        for (let y = 0, len2 = wholeEspTagLump.length; y < len2; y++) {
          if (
            !uniqueCharsListFromGuessedClosingLumpArr.includes(
              wholeEspTagLump[y]
            ) &&
            found > 1
          ) {
            return y;
          }
          if (
            uniqueCharsListFromGuessedClosingLumpArr.includes(
              wholeEspTagLump[y]
            )
          ) {
            found++;
            uniqueCharsListFromGuessedClosingLumpArr = uniqueCharsListFromGuessedClosingLumpArr.filter(
              el => el !== wholeEspTagLump[y]
            );
          }
        }
      } else if (
        whichLayerToMatch.guessedClosingLump
          .split("")
          .every(char => wholeEspTagLump.includes(char))
      ) {
        return wholeEspTagLump.length;
      }
    }
  }
  function matchLayerFirst(str, i) {
    return matchLayerLast(str, i, true);
  }
  function pingCharCb(incomingToken) {
    if (opts.charCb) {
      opts.charCb(incomingToken);
    }
  }
  function pingTagCb(incomingToken) {
    if (opts.tagCb) {
      opts.tagCb(clone(incomingToken));
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
      if (token.type === "html" && str[token.end - 1] !== ">") {
        let cutOffIndex = token.tagNameEndsAt;
        if (Array.isArray(token.attribs) && token.attribs.length) {
          for (let i = 0, len = token.attribs.length; i < len; i++) {
            if (token.attribs[i].attribNameRecognised) {
              cutOffIndex = token.attribs[i].attribEnd;
              if (
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
        pingTagCb(token);
        token = tokenReset();
        initToken("text", cutOffIndex);
      } else {
        pingTagCb(token);
        token = tokenReset();
        if (!str[i - 1].trim().length) {
          initToken("text", left(str, i) + 1);
        }
      }
    }
    if (token.start !== null) {
      if (token.end === null && token.start !== i) {
        token.end = i;
      }
      pingTagCb(token);
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
    if (type === "html") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.tagNameStartsAt = null;
      token.tagNameEndsAt = null;
      token.tagName = null;
      token.recognised = null;
      token.closing = false;
      token.void = false;
      token.pureHTML = true;
      token.esp = [];
      token.kind = null;
      token.attribs = [];
    } else if (type === "rule") {
      token.type = type;
      token.start = start;
      token.end = null;
      token.openingCurlyAt = null;
      token.closingCurlyAt = null;
      token.selectors = [];
    } else if (type === "at") {
      token.type = type;
      token.start = start;
      token.end = null;
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
    } else if (type === "esp") {
      token.type = type;
      token.start = start;
      token.end = null;
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
    if (styleStarts && !["rule", "at", "text"].includes(token.type)) {
      styleStarts = false;
    }
    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
    }
    if (token.end && token.end === i) {
      if (token.tagName === "style" && !token.closing) {
        styleStarts = true;
      }
      dumpCurrentToken(token, i);
      layers = [];
    }
    if (!doNothing && atRuleWaitingForClosingCurlie()) {
      if ((token.type === null || token.type === "text") && str[i] === "}") {
        dumpCurrentToken(token, i);
        const poppedToken = layers.pop();
        token = poppedToken.token;
        token.closingCurlyAt = i;
        token.end = i + 1;
        pingTagCb(token);
        token = tokenReset();
        doNothing = i + 1;
      } else if (token.type === "text" && str[i].trim().length) {
        token.end = i;
        pingTagCb(token);
        token = tokenReset();
      }
    }
    if (
      !doNothing &&
      ["html", "esp", "css"].includes(token.type) &&
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
            position: i
          });
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
      token.query = str.slice(token.queryStartsAt, i);
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
        token
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
        selectorStart: selectorChunkStartedAt,
        selectorEnd: i
      });
      selectorChunkStartedAt = undefined;
    }
    if (!doNothing) {
      if (
        str[i] === "<" &&
        ((token.type === "text" &&
          isTagOpening(str, i, {
            allowCustomTagNames: true
          })) ||
          !layers.length) &&
        (isTagOpening(str, i, {
          allowCustomTagNames: true
        }) ||
          str.startsWith("!--", i + 1) ||
          matchRight(str, i, ["doctype", "xml", "cdata"], {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })) &&
        (token.type !== "esp" || token.tail.includes(str[i]))
      ) {
        if (token.type && Number.isInteger(token.start) && token.start !== i) {
          dumpCurrentToken(token, i);
        }
        tokenReset();
        initToken("html", i);
        if (styleStarts) {
          styleStarts = false;
        }
        if (matchRight(str, i, "!--")) {
          token.kind = "comment";
        } else if (
          matchRight(str, i, "doctype", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })
        ) {
          token.kind = "doctype";
        } else if (
          matchRight(str, i, "cdata", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })
        ) {
          token.kind = "cdata";
        } else if (
          matchRight(str, i, "xml", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })
        ) {
          token.kind = "xml";
        }
      } else if (
        espChars.includes(str[i]) &&
        str[i + 1] &&
        espChars.includes(str[i + 1]) &&
        !(str[i] === "-" && str[i + 1] === "-") &&
        !(
          (
            "0123456789".includes(str[left(str, i)]) &&
            (!str[i + 2] ||
              [`"`, `'`, ";"].includes(str[i + 2]) ||
              !str[i + 2].trim().length)
          )
        ) &&
        !(
          (
            str[i] === "}" &&
            (token.type === "rule" || token.type === "at") &&
            Number.isInteger(token.openingCurlyAt) &&
            !Number.isInteger(token.closingCurlyAt)
          )
        )
      ) {
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
              }
              dumpCurrentToken(token, i);
              tokenReset();
            }
            layers.pop();
          } else if (layers.length && matchLayerFirst(str, i)) {
            lengthOfClosingEspChunk = matchLayerFirst(str, i);
            if (token.type === "esp") {
              if (!Number.isInteger(token.end)) {
                token.end = i + lengthOfClosingEspChunk;
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
              position: i
            });
            if (
              !(
                token.type === "html" &&
                (token.kind === "comment" ||
                  (Number.isInteger(attrib.attribStart) &&
                    !Number.isInteger(attrib.attribEnd)))
              )
            ) {
              dumpCurrentToken(token, i);
              initToken("esp", i);
              token.tail = flipEspTag(wholeEspTagLump);
              token.head = wholeEspTagLump;
            }
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
            pingTagCb(token);
            if (right(str, i)) {
              tokenReset();
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
            initToken(str[i] === "@" ? "at" : "rule", i);
          }
        } else if (str[i]) {
          token = tokenReset();
          initToken("text", i);
        }
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
      selectorChunkStartedAt = i;
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
        if (wholeEspTagClosing.length > token.head.length) {
          const headsFirstChar = token.head[0];
          if (wholeEspTagClosing.endsWith(token.head)) {
            token.end = i + wholeEspTagClosing.length - token.head.length;
            doNothing = token.end;
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = i + token.tail.length;
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
                .every(char => firstPartOfWholeEspTagClosing.includes(char))
            ) {
              token.end = i + firstPartOfWholeEspTagClosing.length;
              doNothing = token.end;
            }
          } else {
            token.end = i + wholeEspTagClosing.length;
            doNothing = token.end;
          }
        } else {
          token.end = i + wholeEspTagClosing.length;
          doNothing = token.end;
        }
      }
    }
    if (
      !doNothing &&
      token.type === "html" &&
      Number.isInteger(token.tagNameStartsAt) &&
      !Number.isInteger(token.tagNameEndsAt)
    ) {
      if (!str[i] || !charSuitableForTagName(str[i])) {
        token.tagNameEndsAt = i;
        token.tagName = str.slice(token.tagNameStartsAt, i).toLowerCase();
        if (voidTags.includes(token.tagName)) {
          token.void = true;
        }
        token.recognised =
          allHTMLTagsKnownToHumanity.includes(token.tagName.toLowerCase()) ||
          ["doctype", "cdata", "xml"].includes(token.tagName.toLowerCase());
      }
    }
    if (
      !doNothing &&
      token.type === "html" &&
      !Number.isInteger(token.tagNameStartsAt) &&
      Number.isInteger(token.start) &&
      token.start < i
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
      token.type === "html" &&
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
        attrib.attribEnd = i;
        token.attribs.push(clone(attrib));
        attribReset();
      }
    }
    if (
      !doNothing &&
      str[i] &&
      token.type === "html" &&
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
        pingTagCb(token);
        tokenReset();
      }
    }
    if (
      !doNothing &&
      token.type === "html" &&
      Number.isInteger(attrib.attribValueStartsAt) &&
      i >= attrib.attribValueStartsAt &&
      attrib.attribValueEndsAt === null
    ) {
      if (`'"`.includes(str[i])) {
        if (
          str[attrib.attribOpeningQuoteAt] === str[i] &&
          !layers.some(layerObj => layerObj.type === "esp")
        ) {
          attrib.attribClosingQuoteAt = i;
          attrib.attribValueEndsAt = i;
          attrib.attribValue = str.slice(attrib.attribValueStartsAt, i);
          attrib.attribEnd = i + 1;
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
      }
    }
    if (
      !doNothing &&
      token.type === "html" &&
      !Number.isInteger(attrib.attribValueStartsAt) &&
      Number.isInteger(attrib.attribNameEndsAt) &&
      attrib.attribNameEndsAt <= i &&
      str[i].trim().length
    ) {
      if (
        str[i] === "=" &&
        !`'"=`.includes(str[right(str, i)]) &&
        !espChars.includes(str[right(str, i)])
      ) {
        attrib.attribValueStartsAt = right(str, i);
      } else if (`'"`.includes(str[i])) {
        attrib.attribOpeningQuoteAt = i;
        if (str[i + 1]) {
          attrib.attribValueStartsAt = i + 1;
        }
      }
    }
    if (
      str[i] === ">" &&
      token.type === "html" &&
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
        if (
          Number.isInteger(attrib.attribValueStartsAt) &&
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
        i
      });
    }
    if (!str[i] && token.start !== null) {
      token.end = i;
      pingTagCb(token);
    }
  }
}

export default tokenizer;
