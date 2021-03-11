/**
 * codsen-tokenizer
 * HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 * Version: 5.3.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/codsen-tokenizer/
 */

import { matchRight, matchRightIncl, matchLeft, matchLeftIncl } from 'string-match-left-right';
import clone from 'lodash.clonedeep';
import { right, left } from 'string-left-right';
import { isAttrClosing } from 'is-html-attribute-closing';
import { allHtmlAttribs } from 'html-all-known-attributes';
import { isAttrNameChar } from 'is-char-suitable-for-html-attr-name';
import { isOpening } from 'is-html-tag-opening';

const allHTMLTagsKnownToHumanity = new Set(["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"]);
const espChars = `{}%-$_()*|#`;
const veryEspChars = `{}|#`;
const notVeryEspChars = `%()$_*#`;
const leftyChars = `({`;
const rightyChars = `})`;
const espLumpBlacklist = [")|(", "|(", ")(", "()", "}{", "{}", "%)", "*)", "||", "--"];
const punctuationChars = `.,;!?`;
const BACKTICK = "\x60";
const LEFTDOUBLEQUOTMARK = `\u201C`;
const RIGHTDOUBLEQUOTMARK = `\u201D`;
function isLatinLetter(char) {
  return !!(char && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123));
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
function isTagNameRecognised(tagName) {
  return allHTMLTagsKnownToHumanity.has(tagName.toLowerCase()) || ["doctype", "cdata", "xml"].includes(tagName.toLowerCase());
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
function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
const voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
const inlineTags = new Set(["a", "abbr", "acronym", "audio", "b", "bdi", "bdo", "big", "br", "button", "canvas", "cite", "code", "data", "datalist", "del", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins", "kbd", "label", "map", "mark", "meter", "noscript", "object", "output", "picture", "progress", "q", "ruby", "s", "samp", "script", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "template", "textarea", "time", "u", "tt", "var", "video", "wbr"]);
const charsThatEndCSSChunks = ["{", "}", ","];
const SOMEQUOTE = `'"${LEFTDOUBLEQUOTMARK}${RIGHTDOUBLEQUOTMARK}`;
const attrNameRegexp = /[\w-]/;

function getLastEspLayerObjIdx(layers) {
  if (layers && layers.length) {
    for (let z = layers.length; z--;) {
      if (layers[z].type === "esp") {
        return z;
      }
    }
  }
  return undefined;
}

function getWholeEspTagLumpOnTheRight(str, i, layers) {
  let wholeEspTagLumpOnTheRight = str[i];
  const len = str.length;
  const lastEspLayerObj = layers[getLastEspLayerObjIdx(layers)];
  for (let y = i + 1; y < len; y++) {
    if (leftyChars.includes(str[y]) && rightyChars.includes(str[y - 1])) {
      break;
    }
    if (
    wholeEspTagLumpOnTheRight.length > 1 && (
    wholeEspTagLumpOnTheRight.includes(`<`) || wholeEspTagLumpOnTheRight.includes(`{`) || wholeEspTagLumpOnTheRight.includes(`[`) || wholeEspTagLumpOnTheRight.includes(`(`)) &&
    str[y] === "(") {
      break;
    }
    if (espChars.includes(str[y]) ||
    lastEspLayerObj && lastEspLayerObj.guessedClosingLump.includes(str[y]) || str[i] === "<" && str[y] === "/" ||
    str[y] === ">" && wholeEspTagLumpOnTheRight === "--" && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-" ||
    !lastEspLayerObj && y > i && `!=@`.includes(str[y])) {
      wholeEspTagLumpOnTheRight += str[y];
    } else {
      break;
    }
  }
  if (wholeEspTagLumpOnTheRight && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].guessedClosingLump && wholeEspTagLumpOnTheRight.length > layers[layers.length - 1].guessedClosingLump.length) {
    if (wholeEspTagLumpOnTheRight.endsWith(layers[layers.length - 1].openingLump)) {
      return wholeEspTagLumpOnTheRight.slice(0, wholeEspTagLumpOnTheRight.length - layers[layers.length - 1].openingLump.length);
    }
    let uniqueCharsListFromGuessedClosingLumpArr = new Set(layers[layers.length - 1].guessedClosingLump);
    let found = 0;
    for (let y = 0, len2 = wholeEspTagLumpOnTheRight.length; y < len2; y++) {
      if (!uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLumpOnTheRight[y]) && found > 1) {
        return wholeEspTagLumpOnTheRight.slice(0, y);
      }
      if (uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLumpOnTheRight[y])) {
        found += 1;
        uniqueCharsListFromGuessedClosingLumpArr = new Set([...uniqueCharsListFromGuessedClosingLumpArr].filter(el => el !== wholeEspTagLumpOnTheRight[y]));
      }
    }
  }
  return wholeEspTagLumpOnTheRight;
}

function startsHtmlComment(str, i, token, layers) {
  return !!(
  str[i] === "<" && (matchRight(str, i, ["!--"], {
    maxMismatches: 1,
    firstMustMatch: true,
    trimBeforeMatching: true
  }) || matchRightIncl(str, i, ["<![endif]"], {
    i: true,
    maxMismatches: 2,
    trimBeforeMatching: true
  })) && !matchRight(str, i, ["![cdata", "<"], {
    i: true,
    maxMismatches: 1,
    trimBeforeMatching: true
  }) && (token.type !== "comment" || token.kind !== "not") || str[i] === "-" && matchRightIncl(str, i, ["-->"], {
    trimBeforeMatching: true
  }) && (token.type !== "comment" || !token.closing && token.kind !== "not") && !matchLeft(str, i, "<", {
    trimBeforeMatching: true,
    trimCharsBeforeMatching: ["-", "!"]
  }) && (
  !Array.isArray(layers) || !layers.length || layers[layers.length - 1].type !== "esp" || !(layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-")));
}

function startsCssComment(str, i, _token, _layers, withinStyle) {
  return (
    withinStyle && (
    str[i] === "/" && str[i + 1] === "*" ||
    str[i] === "*" && str[i + 1] === "/")
  );
}

function matchLayerLast(wholeEspTagLump, layers, matchFirstInstead = false) {
  if (!layers.length) {
    return;
  }
  const whichLayerToMatch = matchFirstInstead ? layers[0] : layers[layers.length - 1];
  if (whichLayerToMatch.type !== "esp") {
    return;
  }
  if (
  wholeEspTagLump.includes(whichLayerToMatch.guessedClosingLump) ||
  Array.from(wholeEspTagLump).every(char => whichLayerToMatch.guessedClosingLump.includes(char)) ||
  whichLayerToMatch.guessedClosingLump &&
  whichLayerToMatch.guessedClosingLump.length > 2 &&
  whichLayerToMatch.guessedClosingLump[whichLayerToMatch.guessedClosingLump.length - 1] === wholeEspTagLump[wholeEspTagLump.length - 1] && whichLayerToMatch.guessedClosingLump[whichLayerToMatch.guessedClosingLump.length - 2] === wholeEspTagLump[wholeEspTagLump.length - 2]) {
    return wholeEspTagLump.length;
  }
}

const BACKSLASH = "\u005C";
function startsTag(str, i, token, layers, withinStyle) {
  return !!(str[i] && str[i].trim().length && (!layers.length || token.type === "text") && (!token.kind || !["doctype", "xml"].includes(token.kind)) && (
  !withinStyle || str[i] === "<") && (str[i] === "<" && (isOpening(str, i, {
    allowCustomTagNames: true
  }) || str[right(str, i)] === ">" || matchRight(str, i, ["doctype", "xml", "cdata"], {
    i: true,
    trimBeforeMatching: true,
    trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
  })) || isLatinLetter(str[i]) && (!str[i - 1] || !isLatinLetter(str[i - 1]) && !["<", "/", "!", BACKSLASH].includes(str[left(str, i)])) && isOpening(str, i, {
    allowCustomTagNames: false,
    skipOpeningBracket: true
  })) && (token.type !== "esp" || token.tail && token.tail.includes(str[i])));
}

function startsEsp(str, i, token, layers, withinStyle) {
  const res =
  espChars.includes(str[i]) && str[i + 1] && espChars.includes(str[i + 1]) &&
  !(notVeryEspChars.includes(str[i]) && notVeryEspChars.includes(str[i + 1])) && (
  str[i] !== str[i + 1] || veryEspChars.includes(str[i])) && token.type !== "rule" && token.type !== "at" && !(str[i] === "-" && "-{(".includes(str[i + 1])) && !("})".includes(str[i]) && "-".includes(str[i + 1])) && !(
  str[i] === "%" && str[i + 1] === "%" && "0123456789".includes(str[i - 1]) && (!str[i + 2] || punctuationChars.includes(str[i + 2]) || !str[i + 2].trim().length)) && !(withinStyle && ("{}".includes(str[i]) || "{}".includes(str[right(str, i)]))) ||
  str[i] === "<" && (
  str[i + 1] === "/" && espChars.includes(str[i + 2]) ||
  espChars.includes(str[i + 1]) &&
  !["-"].includes(str[i + 1])) ||
  str[i] === "<" && (
  str[i + 1] === "%" ||
  str.startsWith("jsp:", i + 1) ||
  str.startsWith("cms:", i + 1) ||
  str.startsWith("c:", i + 1)) || str.startsWith("${jspProp", i) ||
  `>})`.includes(str[i]) &&
  Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump.includes(flipEspTag(str[i])) && (
  str[i] !== ">" || !xBeforeYOnTheRight(str, i + 1, ">", "<")) ||
  str[i] === "-" && str[i + 1] === "-" && str[i + 2] === ">" && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-";
  return !!res;
}

var version$1 = "5.3.0";

const version = version$1;
const importantStartsRegexp = /^\s*!?\s*[a-zA-Z0-9]+(?:[\s;}<>'"]|$)/gm;
const defaults = {
  tagCb: null,
  tagCbLookahead: 0,
  charCb: null,
  charCbLookahead: 0,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
function tokenizer(str, originalOpts) {
  const start = Date.now();
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error(`codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(str, null, 4)}`);
    }
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(`codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(originalOpts, null, 4)}`);
  }
  if (originalOpts && isObj(originalOpts) && originalOpts.tagCb && typeof originalOpts.tagCb !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ${typeof originalOpts.tagCb}, equal to ${JSON.stringify(originalOpts.tagCb, null, 4)}`);
  }
  if (originalOpts && isObj(originalOpts) && originalOpts.charCb && typeof originalOpts.charCb !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ${typeof originalOpts.charCb}, equal to ${JSON.stringify(originalOpts.charCb, null, 4)}`);
  }
  if (originalOpts && isObj(originalOpts) && originalOpts.reportProgressFunc && typeof originalOpts.reportProgressFunc !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ${typeof originalOpts.reportProgressFunc}, equal to ${JSON.stringify(originalOpts.reportProgressFunc, null, 4)}`);
  }
  const opts = { ...defaults,
    ...originalOpts
  };
  let currentPercentageDone = 0;
  let lastPercentage = 0;
  const len = str.length;
  const midLen = Math.floor(len / 2);
  let doNothing = 0;
  let withinScript = false;
  let withinStyle = false;
  let withinStyleComment = false;
  const tagStash = [];
  const charStash = [];
  let token = {};
  function tokenReset() {
    token = {
      type: null,
      start: null,
      end: null,
      value: null
    };
    attribReset();
  }
  const attribDefaults = {
    attribName: "",
    attribNameRecognised: false,
    attribNameStartsAt: null,
    attribNameEndsAt: null,
    attribOpeningQuoteAt: null,
    attribClosingQuoteAt: null,
    attribValueRaw: null,
    attribValue: [],
    attribValueStartsAt: null,
    attribValueEndsAt: null,
    attribStarts: null,
    attribEnds: null,
    attribLeft: null
  };
  let attrib = { ...attribDefaults
  };
  function attribReset() {
    attrib = clone(attribDefaults);
  }
  function attribPush(tokenObj) {
    /* istanbul ignore else */
    if (attrib.attribValue.length && attrib.attribValue[~-attrib.attribValue.length].start && !attrib.attribValue[~-attrib.attribValue.length].end) {
      attrib.attribValue[~-attrib.attribValue.length].end = tokenObj.start;
      attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, tokenObj.start);
    }
    attrib.attribValue.push(tokenObj);
  }
  const propertyDefault = {
    start: null,
    end: null,
    property: null,
    propertyStarts: null,
    propertyEnds: null,
    value: null,
    valueStarts: null,
    valueEnds: null,
    important: null,
    importantStarts: null,
    importantEnds: null,
    colon: null,
    semi: null
  };
  let property = { ...propertyDefault
  };
  function propertyReset() {
    property = { ...propertyDefault
    };
  }
  function pushProperty(p) {
    if (attrib && attrib.attribName === "style") {
      attrib.attribValue.push({ ...p
      });
    } else if (token && Array.isArray(token.properties)) {
      token.properties.push({ ...p
      });
    }
  }
  tokenReset();
  let selectorChunkStartedAt;
  let parentTokenToBackup;
  let attribToBackup;
  let lastNonWhitespaceCharAt = null;
  const layers = [];
  function lastLayerIs(something) {
    return !!(Array.isArray(layers) && layers.length && layers[~-layers.length].type === something);
  }
  function closingComment(i) {
    const end = (right(str, i) || i) + 1;
    attribPush({
      type: "comment",
      start: i,
      end,
      value: str.slice(i, end),
      closing: true,
      kind: "block",
      language: "css"
    });
    doNothing = end;
    if (lastLayerIs("block")) {
      layers.pop();
    }
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
    if (typeof cb === "function") {
      cb(currentElem, next);
    }
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
    if (!["text", "esp"].includes(incomingToken.type) && incomingToken.start !== null && incomingToken.start < i && (str[~-i] && !str[~-i].trim() || str[i] === "<")) {
      if (left(str, i) !== null) {
        incomingToken.end = left(str, i) + 1;
      } else {
        incomingToken.end = i;
      }
      incomingToken.value = str.slice(incomingToken.start, incomingToken.end);
      if (incomingToken.type === "tag" && !"/>".includes(str[~-incomingToken.end])) {
        let cutOffIndex = incomingToken.tagNameEndsAt || i;
        if (Array.isArray(incomingToken.attribs) && incomingToken.attribs.length) {
          for (let i2 = 0, len2 = incomingToken.attribs.length; i2 < len2; i2++) {
            if (incomingToken.attribs[i2].attribNameRecognised && incomingToken.attribs[i2].attribEnds) {
              cutOffIndex = incomingToken.attribs[i2].attribEnds;
              if (str[cutOffIndex + 1] && !str[cutOffIndex].trim() && str[cutOffIndex + 1].trim()) {
                cutOffIndex += 1;
              }
            } else {
              if (i2 === 0) {
                incomingToken.attribs = [];
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
        if (incomingToken.tagNameStartsAt && incomingToken.tagNameEndsAt && !incomingToken.tagName) {
          incomingToken.tagName = str.slice(incomingToken.tagNameStartsAt, cutOffIndex);
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
        if (lastLayerIs("at")) {
          layers[~-layers.length].token.rules.push(token);
        } else {
          pingTagCb(token);
        }
      }
      tokenReset();
    }
  }
  function atRuleWaitingForClosingCurlie() {
    return lastLayerIs("at") && isObj(layers[~-layers.length].token) && layers[~-layers.length].token.openingCurlyAt && !layers[~-layers.length].token.closingCurlyAt;
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
        attribs: []
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
        language: "html"
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
        properties: []
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
        rules: []
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
        tailEndsAt: null
      };
    }
    return {
      type: "text",
      start: startVal,
      end: null,
      value: null
    };
  }
  function initToken(type, startVal) {
    attribReset();
    token = getNewToken(type, startVal);
  }
  function initProperty(propertyStarts) {
    propertyReset();
    if (typeof propertyStarts === "number") {
      property.propertyStarts = propertyStarts;
      property.start = propertyStarts;
    } else {
      property = { ...propertyDefault,
        ...propertyStarts
      };
    }
  }
  function ifQuoteThenAttrClosingQuote(idx) {
    return !`'"`.includes(str[idx]) ||
    !(attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt) ||
    isAttrClosing(str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, idx);
  }
  function attrEndsAt(idx) {
    return `;}/`.includes(str[idx]) && (!attrib || !attrib.attribName || attrib.attribName !== "style") ||
    `/;'"><`.includes(str[idx]) && attrib && attrib.attribName === "style" &&
    ifQuoteThenAttrClosingQuote(idx);
  }
  for (let i = 0; i <= len; i++) {
    if (!doNothing && str[i] && opts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (i === midLen) {
          opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
        }
      } else if (len >= 2000) {
        currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / len * (opts.reportProgressFuncTo - opts.reportProgressFuncFrom));
        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
      }
    }
    const leftVal = left(str, i);
    const rightVal = right(str, i);
    if (withinStyle && token.type && !["rule", "at", "text", "comment"].includes(token.type)) {
      withinStyle = false;
    }
    if (doNothing && i >= doNothing) {
      doNothing = 0;
    }
    if (isLatinLetter(str[i]) && isLatinLetter(str[~-i]) && isLatinLetter(str[i + 1])) {
      if (property && property.valueStarts && !property.valueEnds && !property.importantStarts && str.startsWith("important", i)) {
        property.valueEnds = i;
        property.value = str.slice(property.valueStarts, i);
        property.importantStarts = i;
      }
      continue;
    }
    if (` \t\r\n`.includes(str[i]) &&
    str[i] === str[~-i] && str[i] === str[i + 1]) {
      continue;
    }
    if (!doNothing && atRuleWaitingForClosingCurlie()) {
      if (str[i] === "}") {
        if (!token.type || token.type === "text" || token.type === "rule" && token.openingCurlyAt === null) {
          if (token.type === "rule") {
            token.end = leftVal + 1;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token);
            if (lastLayerIs("at")) {
              layers[~-layers.length].token.rules.push(token);
            }
            tokenReset();
            if (leftVal !== null && leftVal < ~-i) {
              initToken("text", leftVal + 1);
            }
          }
          dumpCurrentToken(token, i);
          const poppedToken = layers.pop();
          token = poppedToken.token;
          token.closingCurlyAt = i;
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
          pingTagCb(token);
          if (lastLayerIs("at")) {
            layers[~-layers.length].token.rules.push(token);
          }
          tokenReset();
          doNothing = i + 1;
        }
      } else if (token.type === "text" && str[i] && str[i].trim()) {
        token.end = i;
        token.value = str.slice(token.start, token.end);
        if (lastLayerIs("at")) {
          layers[~-layers.length].token.rules.push(token);
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
      if (["tag", "at"].includes(token.type) && token.kind !== "cdata") {
        if (str[i] && (SOMEQUOTE.includes(str[i]) || `()`.includes(str[i])) && !(
        SOMEQUOTE.includes(str[leftVal]) && str[leftVal] === str[rightVal]) &&
        ifQuoteThenAttrClosingQuote(i)
        ) {
            if (
            lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[i])) {
              layers.pop();
            } else {
              layers.push({
                type: "simple",
                value: str[i],
                position: i
              });
            }
          }
      } else if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
        if ([`[`, `]`].includes(str[i])) {
          if (
          lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[i])) {
            layers.pop();
          } else {
            layers.push({
              type: "simple",
              value: str[i],
              position: i
            });
          }
        }
      } else if (token.type === "esp" && `'"${BACKTICK}()`.includes(str[i]) && !(
      [`"`, `'`, "`"].includes(str[leftVal]) && str[leftVal] === str[rightVal])) {
        if (
        lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[i])) {
          layers.pop();
          doNothing = i + 1;
        } else if (!`]})>`.includes(str[i])) {
          layers.push({
            type: "simple",
            value: str[i],
            position: i
          });
        }
      }
    }
    if (!doNothing && token.type === "at" && token.start != null && i >= token.start && !token.identifierStartsAt && str[i] && str[i].trim() && str[i] !== "@") {
      token.identifierStartsAt = i;
    }
    if (!doNothing && token.type === "at" && token.queryStartsAt && !token.queryEndsAt && `{;`.includes(str[i])) {
      if (str[i] === "{") {
        if (str[~-i] && str[~-i].trim()) {
          token.queryEndsAt = i;
        } else {
          token.queryEndsAt = leftVal !== null ? leftVal + 1 : i;
        }
      } else {
        token.queryEndsAt = left(str, i + 1) || 0;
      }
      if (token.queryStartsAt && token.queryEndsAt) {
        token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
      }
      token.end = str[i] === ";" ? i + 1 : i;
      token.value = str.slice(token.start, token.end);
      if (str[i] === ";") {
        pingTagCb(token);
      } else {
        token.openingCurlyAt = i;
        layers.push({
          type: "at",
          token
        });
      }
      tokenReset();
      doNothing = i + 1;
    }
    if (!doNothing && token.type === "at" && token.identifier && str[i] && str[i].trim() && !token.queryStartsAt) {
      token.queryStartsAt = i;
    }
    if (!doNothing && token && token.type === "at" && token.identifierStartsAt && i >= token.start && str[i] && (!str[i].trim() || "()".includes(str[i])) && !token.identifierEndsAt) {
      token.identifierEndsAt = i;
      token.identifier = str.slice(token.identifierStartsAt, i);
    }
    if (token.type === "rule") {
      if (selectorChunkStartedAt && (charsThatEndCSSChunks.includes(str[i]) || str[i] && rightVal && !str[i].trim() && charsThatEndCSSChunks.includes(str[rightVal]))) {
        token.selectors.push({
          value: str.slice(selectorChunkStartedAt, i),
          selectorStarts: selectorChunkStartedAt,
          selectorEnds: i
        });
        selectorChunkStartedAt = undefined;
        token.selectorsEnd = i;
      } else if (str[i] === "{" && token.openingCurlyAt && !token.closingCurlyAt) {
        for (let y = i; y--;) {
          if (!str[y].trim() || `{}"';`.includes(str[y])) {
            if (property && property.start && !property.end) {
              property.end = y + 1;
              property.property = str.slice(property.start, property.end);
              pushProperty(property);
              propertyReset();
              token.end = y + 1;
              token.value = str.slice(token.start, token.end);
              pingTagCb(token);
              initToken(str[y + 1] === "@" ? "at" : "rule", y + 1);
              token.left = left(str, y + 1);
              token.selectorsStart = y + 1;
              i = y + 1;
            }
            break;
          }
        }
      }
    }
    const lastEspLayerObjIdx = getLastEspLayerObjIdx(layers);
    if (!doNothing && str[i]) {
      if (startsTag(str, i, token, layers, withinStyle)) {
        if (token.type && token.start !== null) {
          if (token.type === "rule") {
            if (property && property.start) {
              if (property.importantStarts && !property.importantEnds) {
                property.importantEnds = i;
                property.important = str.slice(property.importantStarts, i);
              }
              if (property.propertyStarts && !property.propertyEnds) {
                property.propertyEnds = i;
                if (!property.property) {
                  property.property = str.slice(property.propertyStarts, i);
                }
              }
              if (!property.end) {
                property.end = i;
              }
              if (property.valueStarts && !property.valueEnds) {
                property.valueEnds = i;
                if (!property.value) {
                  property.value = str.slice(property.valueStarts, i);
                }
              }
              pushProperty(property);
              propertyReset();
            }
          }
          dumpCurrentToken(token, i);
          tokenReset();
        }
        initToken("tag", i);
        if (withinStyle) {
          withinStyle = false;
        }
        const badCharacters = `?![-/`;
        let extractedTagName = "";
        let letterMet = false;
        if (rightVal) {
          for (let y = rightVal; y < len; y++) {
            if (!letterMet && str[y] && str[y].trim() && str[y].toUpperCase() !== str[y].toLowerCase()) {
              letterMet = true;
            }
            if (
            letterMet && str[y] && (
            !str[y].trim() ||
            !/\w/.test(str[y]) && !badCharacters.includes(str[y]) || str[y] === "[")
            ) {
                break;
              } else if (!badCharacters.includes(str[y])) {
              extractedTagName += str[y].trim().toLowerCase();
            }
          }
        }
        if (extractedTagName === "doctype") {
          token.kind = "doctype";
        } else if (extractedTagName === "cdata") {
          token.kind = "cdata";
        } else if (extractedTagName === "xml") {
          token.kind = "xml";
        } else if (inlineTags.has(extractedTagName)) {
          token.kind = "inline";
          if (extractedTagName) {
            doNothing = i;
          }
        }
      } else if (!withinScript && startsHtmlComment(str, i, token, layers)) {
        if (token.start != null) {
          dumpCurrentToken(token, i);
        }
        initToken("comment", i);
        if (str[i] === "-") {
          token.closing = true;
        } else if (matchRightIncl(str, i, ["<![endif]-->"], {
          i: true,
          trimBeforeMatching: true,
          maxMismatches: 2
        })) {
          token.closing = true;
          token.kind = "only";
        }
        if (withinStyle) {
          withinStyle = false;
        }
      } else if (!withinScript && startsCssComment(str, i, token, layers, withinStyle)) {
        if (token.start != null) {
          dumpCurrentToken(token, i);
        }
        initToken("comment", i);
        token.language = "css";
        token.kind = str[i] === "/" && str[i + 1] === "/" ? "line" : "block";
        token.value = str.slice(i, i + 2);
        token.end = i + 2;
        token.closing = str[i] === "*" && str[i + 1] === "/";
        withinStyleComment = true;
        if (token.closing) {
          withinStyleComment = false;
        }
        doNothing = i + 2;
      } else if (!withinScript && (
      typeof lastEspLayerObjIdx === "number" && layers[lastEspLayerObjIdx] && layers[lastEspLayerObjIdx].type === "esp" && layers[lastEspLayerObjIdx].openingLump && layers[lastEspLayerObjIdx].guessedClosingLump && layers[lastEspLayerObjIdx].guessedClosingLump.length > 1 &&
      layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[i]) &&
      layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[i + 1]) &&
      !(
      layers[lastEspLayerObjIdx + 1] &&
      `'"`.includes(layers[lastEspLayerObjIdx + 1].value) &&
      str.indexOf(layers[lastEspLayerObjIdx + 1].value, i) > 0 && layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[right(str, str.indexOf(layers[lastEspLayerObjIdx + 1].value, i))])) ||
      startsEsp(str, i, token, layers, withinStyle) && (
      !lastLayerIs("simple") || ![`'`, `"`].includes(layers[~-layers.length].value) ||
      attrib && attrib.attribStarts && !attrib.attribEnds))) {
        const wholeEspTagLumpOnTheRight = getWholeEspTagLumpOnTheRight(str, i, layers);
        if (!espLumpBlacklist.includes(wholeEspTagLumpOnTheRight)) {
          let lengthOfClosingEspChunk;
          let disposableVar;
          if (layers.length && (
          lengthOfClosingEspChunk = matchLayerLast(wholeEspTagLumpOnTheRight, layers))) {
            if (token.type === "esp") {
              if (!token.end) {
                token.end = i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
                token.tail = str.slice(i, i + lengthOfClosingEspChunk);
                token.tailStartsAt = i;
                token.tailEndsAt = token.end;
                if (str[i] === ">" && str[leftVal] === "/") {
                  token.tailStartsAt = leftVal;
                  token.tail = str.slice(token.tailStartsAt, i + 1);
                }
              }
              doNothing = token.tailEndsAt;
              if (parentTokenToBackup) {
                if (!Array.isArray(parentTokenToBackup.attribs)) {
                  parentTokenToBackup.attribs = [];
                }
                if (attribToBackup) {
                  attrib = attribToBackup;
                  attrib.attribValue.push({ ...token
                  });
                } else {
                  parentTokenToBackup.attribs.push({ ...token
                  });
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
          } else if (layers.length && (
          lengthOfClosingEspChunk = matchLayerLast(wholeEspTagLumpOnTheRight, layers, true))) {
            if (token.type === "esp") {
              if (!token.end) {
                token.end = i + (lengthOfClosingEspChunk || 0);
                token.value = str.slice(token.start, token.end);
              }
              if (!token.tailStartsAt) {
                token.tailStartsAt = i;
              }
              if (!token.tailEndsAt && lengthOfClosingEspChunk) {
                token.tailEndsAt = token.tailStartsAt + lengthOfClosingEspChunk;
                token.tail = str.slice(i, i + lengthOfClosingEspChunk);
              }
              dumpCurrentToken(token, i);
              tokenReset();
            }
            layers.length = 0;
          } else if (
          attrib && attrib.attribValue && attrib.attribValue.length && attrib.attribValue[~-attrib.attribValue.length].start && Array.from(str.slice(attrib.attribValue[~-attrib.attribValue.length].start, i)).some((char, idx) => wholeEspTagLumpOnTheRight.includes(flipEspTag(char)) && (
          veryEspChars.includes(char) ||
          !idx) && (disposableVar = {
            char,
            idx
          })) &&
          token.type === "tag" && attrib && attrib.attribValueStartsAt && !attrib.attribValueEndsAt &&
          attrib.attribValue[~-attrib.attribValue.length] && attrib.attribValue[~-attrib.attribValue.length].type === "text") {
            token.pureHTML = false;
            const lastAttrValueObj = attrib.attribValue[~-attrib.attribValue.length];
            const newTokenToPutInstead = getNewToken("esp", lastAttrValueObj.start);
            if (!disposableVar || !disposableVar.idx) {
              newTokenToPutInstead.head = disposableVar.char;
              newTokenToPutInstead.headStartsAt = lastAttrValueObj.start;
              newTokenToPutInstead.headEndsAt = newTokenToPutInstead.headStartsAt + 1;
              newTokenToPutInstead.tailStartsAt = i;
              newTokenToPutInstead.tailEndsAt = i + wholeEspTagLumpOnTheRight.length;
              newTokenToPutInstead.tail = wholeEspTagLumpOnTheRight;
              attrib.attribValue[~-attrib.attribValue.length] = newTokenToPutInstead;
            }
          } else {
            if (lastLayerIs("esp")) {
              layers.pop();
            }
            if (attribToBackup) {
              if (!Array.isArray(attribToBackup.attribValue)) {
                attribToBackup.attribValue = [];
              }
              attribToBackup.attribValue.push(token);
            }
            layers.push({
              type: "esp",
              openingLump: wholeEspTagLumpOnTheRight,
              guessedClosingLump: flipEspTag(wholeEspTagLumpOnTheRight),
              position: i
            });
            if (token.start !== null) {
              if (token.type === "tag") {
                if (token.tagNameStartsAt && (!token.tagName || !token.tagNameEndsAt)) {
                  token.tagNameEndsAt = i;
                  token.tagName = str.slice(token.tagNameStartsAt, i);
                  token.recognised = isTagNameRecognised(token.tagName);
                }
                parentTokenToBackup = clone(token);
                if (attrib.attribStarts && !attrib.attribEnds) {
                  attribToBackup = clone(attrib);
                }
              } else if (!attribToBackup) {
                dumpCurrentToken(token, i);
              } else if (attribToBackup && Array.isArray(attribToBackup.attribValue) && attribToBackup.attribValue.length && attribToBackup.attribValue[~-attribToBackup.attribValue.length].type === "esp" && !attribToBackup.attribValue[~-attribToBackup.attribValue.length].end) {
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].end = i;
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].value = str.slice(attribToBackup.attribValue[~-attribToBackup.attribValue.length].start, i);
              }
            }
            initToken("esp", i);
            token.head = wholeEspTagLumpOnTheRight;
            token.headStartsAt = i;
            token.headEndsAt = i + wholeEspTagLumpOnTheRight.length;
            if (parentTokenToBackup && parentTokenToBackup.pureHTML) {
              parentTokenToBackup.pureHTML = false;
            }
            if (attribToBackup && Array.isArray(attribToBackup.attribValue) && attribToBackup.attribValue.length) {
              if (attribToBackup.attribValue[~-attribToBackup.attribValue.length].start === token.start) {
                attribToBackup.attribValue.pop();
              } else if (
              attribToBackup.attribValue[~-attribToBackup.attribValue.length].type === "text" && !attribToBackup.attribValue[~-attribToBackup.attribValue.length].end) {
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].end = i;
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].value = str.slice(attribToBackup.attribValue[~-attribToBackup.attribValue.length].start, i);
              }
            }
          }
          doNothing = i + (lengthOfClosingEspChunk || wholeEspTagLumpOnTheRight.length);
        }
      } else if (!withinScript && withinStyle && !withinStyleComment && str[i] && str[i].trim() &&
      !`{}`.includes(str[i]) && (
      !token.type ||
      ["text"].includes(token.type))) {
        if (token.type) {
          dumpCurrentToken(token, i);
        }
        initToken(str[i] === "@" ? "at" : "rule", i);
        token.left = lastNonWhitespaceCharAt;
        token.nested = layers.some(o => o.type === "at");
      } else if (!token.type) {
        initToken("text", i);
        if (withinScript && str.indexOf("</script>", i)) {
          doNothing = str.indexOf("</script>", i);
        } else {
          doNothing = i;
        }
      }
    }
    let R1;
    let R2;
    if (!doNothing && (property.start || str[i] === "!")) {
      R1 = `;'"{}<>`.includes(str[right(str, i - 1)]);
      R2 = matchRightIncl(str, i, ["!important"], {
        i: true,
        trimBeforeMatching: true,
        maxMismatches: 2
      });
    }
    /* istanbul ignore else */
    if (!doNothing && property && (property.semi && property.semi < i && property.semi < i || (property.valueStarts && !property.valueEnds && str[rightVal] !== "!" && (
    !rightVal ||
    R1) || property.importantStarts && !property.importantEnds) && (!property.valueEnds || str[rightVal] !== ";") && (
    !str[i] ||
    !str[i].trim() ||
    !property.valueEnds && str[i] === ";" ||
    attrEndsAt(i)))) {
      /* istanbul ignore else */
      if (property.importantStarts && !property.importantEnds) {
        property.importantEnds = left(str, i) + 1;
        property.important = str.slice(property.importantStarts, property.importantEnds);
      }
      /* istanbul ignore else */
      if (property.valueStarts && !property.valueEnds) {
        property.valueEnds = i;
        property.value = str.slice(property.valueStarts, i);
      }
      /* istanbul ignore else */
      if (str[i] === ";") {
        property.semi = i;
        property.end = i + 1;
      } else if (str[rightVal] === ";") {
        property.semi = rightVal;
        property.end = property.semi + 1;
        doNothing = property.end;
      }
      if (!property.end) {
        property.end = i;
      }
      pushProperty(property);
      propertyReset();
      if (!doNothing && (!str[i] || str[i].trim()) && str[i] === ";") {
        doNothing = i;
      }
    }
    /* istanbul ignore else */
    if (!doNothing &&
    property && property.valueStarts && !property.valueEnds) {
      if (
      !str[i] ||
      R1 ||
      R2 || str[right(str, i - 1)] === "!" ||
      `;}`.includes(str[i]) && (!attrib || !attrib.attribName || attrib.attribName !== "style") ||
      `;'"`.includes(str[i]) && attrib && attrib.attribName === "style" &&
      ifQuoteThenAttrClosingQuote(i) ||
      rightVal && !str[i].trim() && (str.slice(i, rightVal).includes("\n") || str.slice(i, rightVal).includes("\r"))) {
        if (lastNonWhitespaceCharAt && (
        !`'"`.includes(str[i]) ||
        !rightVal ||
        !`'";`.includes(str[rightVal]))) {
          property.valueEnds = lastNonWhitespaceCharAt + 1;
          property.value = str.slice(property.valueStarts, lastNonWhitespaceCharAt + 1);
        }
        if (str[i] === ";") {
          property.semi = i;
        } else if (
        str[i] && !str[i].trim() &&
        str[rightVal] === ";") {
          property.semi = rightVal;
        }
        if (
        property.semi) {
          property.end = property.semi + 1;
        }
        if (
        !property.semi &&
        !R1 &&
        !R2 && str[right(str, i - 1)] !== "!" &&
        !property.end) {
          property.end = i;
        }
        if (property.end) {
          if (property.end > i) {
            doNothing = property.end;
          }
          pushProperty(property);
          propertyReset();
        }
      } else if (str[i] === ":" && property && property.colon && property.colon < i && lastNonWhitespaceCharAt && property.colon + 1 < lastNonWhitespaceCharAt) {
        let split = [];
        if (right(str, property.colon)) {
          split = str.slice(right(str, property.colon), lastNonWhitespaceCharAt + 1).split(/\s+/);
        }
        if (split.length === 2) {
          property.valueEnds = property.valueStarts + split[0].length;
          property.value = str.slice(property.valueStarts, property.valueEnds);
          property.end = property.valueEnds;
          pushProperty(property);
          const whitespaceStarts = property.end;
          const newPropertyStarts = lastNonWhitespaceCharAt + 1 - split[1].length;
          propertyReset();
          pushProperty({
            type: "text",
            start: whitespaceStarts,
            end: newPropertyStarts,
            value: str.slice(whitespaceStarts, newPropertyStarts)
          });
          property.start = newPropertyStarts;
          property.propertyStarts = newPropertyStarts;
        }
      } else if (str[i] === "/" && str[rightVal] === "*") {
        /* istanbul ignore else */
        if (property.valueStarts && !property.valueEnds) {
          property.valueEnds = i;
          property.value = str.slice(property.valueStarts, i);
        }
        /* istanbul ignore else */
        if (!property.end) {
          property.end = i;
        }
        pushProperty(property);
        propertyReset();
      }
    }
    if (!doNothing && property && property.start && !property.end && str[i] === ";") {
      property.semi = i;
      property.end = i + 1;
      if (!property.propertyEnds) {
        property.propertyEnds = i;
      }
      if (property.propertyStarts && property.propertyEnds && !property.property) {
        property.property = str.slice(property.propertyStarts, property.propertyEnds);
      }
      pushProperty(property);
      propertyReset();
      doNothing = i;
    }
    /* istanbul ignore else */
    if (property && property.importantStarts && !property.importantEnds && str[i] && !str[i].trim()) {
      property.importantEnds = i;
      property.important = str.slice(property.importantStarts, i);
    }
    /* istanbul ignore else */
    if (!doNothing && property && property.valueEnds && !property.importantStarts && (
    str[i] === "!" ||
    isLatinLetter(str[i]) && str.slice(i).match(importantStartsRegexp))) {
      property.importantStarts = i;
      if (
      str[i - 1] && str[i - 1].trim() &&
      str[i - 2] && !str[i - 2].trim() ||
      str[i - 1] === "1" &&
      str[i - 2] && !/\d/.test(str[i - 2])) {
        property.valueEnds = left(str, i - 1) + 1;
        property.value = str.slice(property.valueStarts, property.valueEnds);
        property.importantStarts--;
        property.important = str[i - 1] + property.important;
      }
    }
    /* istanbul ignore else */
    if (!doNothing && property && property.colon && !property.valueStarts && str[i] && str[i].trim()) {
      /* istanbul ignore else */
      if (
      `;}'"`.includes(str[i]) &&
      ifQuoteThenAttrClosingQuote(i)) {
        /* istanbul ignore else */
        if (str[i] === ";") {
          property.semi = i;
        }
        let temp;
        /* istanbul ignore else */
        if (!property.end) {
          property.end = property.semi ? property.semi + 1 : left(str, i) + 1;
          temp = property.end;
        }
        pushProperty(property);
        propertyReset();
        /* istanbul ignore else */
        if (temp && temp < i) {
          pushProperty({
            type: "text",
            start: temp,
            end: i,
            value: str.slice(temp, i)
          });
        }
      } else if (str[i] === "!") {
        property.importantStarts = i;
      } else {
        property.valueStarts = i;
      }
    }
    if (!doNothing && token.type === "rule" && str[i] && str[i].trim() && !"{}".includes(str[i]) && !selectorChunkStartedAt && !token.openingCurlyAt) {
      if (!",".includes(str[i])) {
        selectorChunkStartedAt = i;
        if (token.selectorsStart === null) {
          token.selectorsStart = i;
        }
      } else {
        token.selectorsEnd = i + 1;
      }
    }
    if (!doNothing &&
    property && property.propertyStarts && property.propertyStarts < i && !property.propertyEnds && (
    !str[i] ||
    !str[i].trim() ||
    !attrNameRegexp.test(str[i]) && (
    str[i] === ":" ||
    !rightVal || !`:/}`.includes(str[rightVal]) ||
    str[i] === "}" && str[rightVal] === "}") ||
    str[i] === "!") && (
    str[i] !== "/" || str[i - 1] !== "/")) {
      property.propertyEnds = i;
      property.property = str.slice(property.propertyStarts, i);
      if (property.valueStarts) {
        property.end = i;
      }
      if (`};`.includes(str[i]) ||
      str[i] && !str[i].trim() && str[rightVal] !== ":") {
        if (str[i] === ";") {
          property.semi = i;
        }
        if (!property.end) {
          property.end = property.semi ? property.semi + 1 : i;
        }
        pushProperty(property);
        propertyReset();
      }
      if (
      str[i] && str[i].trim() &&
      attrNameRegexp.test(str[property.propertyStarts]) &&
      !attrNameRegexp.test(str[i]) &&
      !`:'"`.includes(str[i])) {
        const nextSemi = str.indexOf(";", i);
        const nextColon = str.indexOf(":", i);
        if (
        (nextColon === -1 && nextSemi !== -1 || !(nextColon !== -1 && nextSemi !== -1 && nextColon < nextSemi)) && !`{}`.includes(str[i]) && rightVal && (
        !`!`.includes(str[i]) || isLatinLetter(str[rightVal]))) {
          property.colon = i;
          property.valueStarts = rightVal;
        } else if (nextColon !== -1 && nextSemi !== -1 && nextColon < nextSemi) {
          property.propertyEnds = null;
        } else if (str[i] === "!") {
          property.importantStarts = i;
        }
      }
    }
    if (!doNothing &&
    property && property.propertyEnds && !property.valueStarts && str[i] === ":") {
      property.colon = i;
      if (!rightVal) {
        property.end = i + 1;
        if (str[i + 1]) {
          pushProperty(property);
          propertyReset();
          if (token.properties) {
            token.properties.push({
              type: "text",
              start: i + 1,
              end: null,
              value: null
            });
            doNothing = i + 1;
          }
        }
      }
      if (property.propertyEnds && lastNonWhitespaceCharAt && property.propertyEnds !== lastNonWhitespaceCharAt + 1 &&
      !attrNameRegexp.test(str[property.propertyEnds])) {
        property.propertyEnds = lastNonWhitespaceCharAt + 1;
        property.property = str.slice(property.propertyStarts, property.propertyEnds);
      }
    }
    if (!doNothing && token.type === "rule" && str[i] && str[i].trim() &&
    !"{}".includes(str[i]) &&
    token.selectorsEnd && token.openingCurlyAt && !property.propertyStarts && !property.importantStarts) {
      if (Array.isArray(token.properties) && token.properties.length && token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].end) {
        token.properties[~-token.properties.length].end = i;
        token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, i);
      }
      if (str[i] === ";") {
        initProperty({
          start: i,
          end: i + 1,
          semi: i
        });
        pushProperty(property);
        propertyReset();
      } else if (str[i] === "!") {
        initProperty({
          start: i,
          importantStarts: i
        });
      } else {
        initProperty(i);
      }
      doNothing = i;
    }
    if (!doNothing &&
    attrib && attrib.attribName === "style" &&
    attrib.attribOpeningQuoteAt && !attrib.attribClosingQuoteAt &&
    !property.start &&
    str[i] && str[i].trim() &&
    !`'"`.includes(str[i]) &&
    !lastLayerIs("block")) {
      if (
      str[i] === "/" &&
      str[rightVal] === "*") {
        attribPush({
          type: "comment",
          start: i,
          end: rightVal + 1,
          value: str.slice(i, rightVal + 1),
          closing: false,
          kind: "block",
          language: "css"
        });
        layers.push({
          type: "block",
          value: str.slice(i, rightVal + 1),
          position: i
        });
        doNothing = rightVal + 1;
      }
      else if (str[i] === "*" && str[rightVal] === "/") {
          closingComment(i);
        } else {
          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, i);
          }
          if (str[i] === ";") {
            initProperty({
              start: i,
              end: i + 1,
              semi: i
            });
            doNothing = i;
          } else if (R2) {
            initProperty({
              start: i,
              importantStarts: i
            });
          } else {
            initProperty(i);
          }
        }
    }
    if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
      if (str[i] === "[") ;
    }
    if (!doNothing) {
      if (token.type === "tag" && !layers.length && str[i] === ">") {
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
      } else if (token.type === "comment" && token.language === "html" && !layers.length && token.kind === "simple" && (str[token.start] === "<" && str[i] === "-" && (matchLeft(str, i, "!-", {
        trimBeforeMatching: true
      }) || matchLeftIncl(str, i, "!-", {
        trimBeforeMatching: true
      }) && str[i + 1] !== "-") || str[token.start] === "-" && str[i] === ">" && matchLeft(str, i, "--", {
        trimBeforeMatching: true,
        maxMismatches: 1
      }))) {
        if (str[i] === "-" && (matchRight(str, i, ["[if", "(if", "{if"], {
          i: true,
          trimBeforeMatching: true
        }) || matchRight(str, i, ["if"], {
          i: true,
          trimBeforeMatching: true
        }) && (
        xBeforeYOnTheRight(str, i, "]", ">") ||
        str.includes("mso", i) && !str.slice(i, str.indexOf("mso")).includes("<") && !str.slice(i, str.indexOf("mso")).includes(">")))) {
          token.kind = "only";
        } else if (
        str[token.start] !== "-" && matchRightIncl(str, i, ["-<![endif"], {
          i: true,
          trimBeforeMatching: true,
          maxMismatches: 2
        })) {
          token.kind = "not";
          token.closing = true;
        } else if (token.kind === "simple" && token.language === "html" && !token.closing && str[rightVal] === ">") {
          token.end = rightVal + 1;
          token.kind = "simplet";
          token.closing = null;
        } else if (token.language === "html") {
          token.end = i + 1;
          if (str[leftVal] === "!" && str[rightVal] === "-") {
            token.end = rightVal + 1;
          }
          token.value = str.slice(token.start, token.end);
        }
      } else if (token.type === "comment" && token.language === "html" && str[i] === ">" && (!layers.length || str[rightVal] === "<")) {
        if (Array.isArray(layers) && layers.length && layers[~-layers.length].value === "[") {
          layers.pop();
        }
        if (!["simplet", "not"].includes(token.kind) && matchRight(str, i, ["<!-->", "<!---->"], {
          trimBeforeMatching: true,
          maxMismatches: 1,
          lastMustMatch: true
        })) {
          token.kind = "not";
        } else {
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (token.type === "comment" && token.language === "css" && str[i] === "*" && str[i + 1] === "/") {
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
      } else if (token.type === "esp" && token.end === null && typeof token.head === "string" && typeof token.tail === "string" && token.tail.includes(str[i])) {
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
          } else if (!token.tail.includes(headsFirstChar) && wholeEspTagClosing.includes(headsFirstChar) || wholeEspTagClosing.endsWith(token.head) || wholeEspTagClosing.startsWith(token.tail)) {
            const firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(0, wholeEspTagClosing.indexOf(headsFirstChar));
            const secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(wholeEspTagClosing.indexOf(headsFirstChar));
            if (firstPartOfWholeEspTagClosing.length && secondPartOfWholeEspTagClosing.length && token.tail.split("").every(char => firstPartOfWholeEspTagClosing.includes(char))) {
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
          if (lastLayerIs("esp")) {
            layers.pop();
          }
          doNothing = token.end;
        }
      }
    }
    if (!doNothing && token.type === "tag" && token.tagNameStartsAt && !token.tagNameEndsAt) {
      if (!str[i] || !charSuitableForTagName(str[i])) {
        token.tagNameEndsAt = i;
        token.tagName = str.slice(token.tagNameStartsAt, i).toLowerCase();
        if (token.tagName && token.tagName.toLowerCase() === "script") {
          withinScript = !withinScript;
        }
        if (token.tagName === "xml" && token.closing && !token.kind) {
          token.kind = "xml";
        }
        if (voidTags.includes(token.tagName)) {
          token.void = true;
        }
        token.recognised = isTagNameRecognised(token.tagName);
        doNothing = i;
      }
    }
    if (!doNothing && token.type === "tag" && !token.tagNameStartsAt && token.start != null && (token.start < i || str[token.start] !== "<")) {
      if (str[i] === "/") {
        token.closing = true;
        doNothing = i;
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartsAt = i;
        if (!token.closing) {
          token.closing = false;
          doNothing = i;
        }
      } else ;
    }
    if (!doNothing && token.type === "tag" && token.kind !== "cdata" && attrib.attribNameStartsAt && i > attrib.attribNameStartsAt && attrib.attribNameEndsAt === null && !isAttrNameChar(str[i])) {
      attrib.attribNameEndsAt = i;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, i);
      attrib.attribNameRecognised = allHtmlAttribs.has(attrib.attribName);
      if (attrib.attribName.startsWith("mc:")) {
        token.pureHTML = false;
      }
      if (str[i] && !str[i].trim() && str[rightVal] === "=") ; else if (str[i] && !str[i].trim() || str[i] === ">" || str[i] === "/" && str[rightVal] === ">") {
        if (`'"`.includes(str[rightVal])) ; else {
          attrib.attribEnds = i;
          token.attribs.push(clone(attrib));
          attribReset();
        }
      }
    }
    if (!doNothing && str[i] && token.type === "tag" && token.kind !== "cdata" && token.tagNameEndsAt && i > token.tagNameEndsAt && attrib.attribStarts === null && isAttrNameChar(str[i])) {
      attrib.attribStarts = i;
      attrib.attribLeft = lastNonWhitespaceCharAt;
      attrib.attribNameStartsAt = i;
    }
    if (!doNothing && token.type === "rule") {
      if (str[i] === "{" && !token.openingCurlyAt) {
        token.openingCurlyAt = i;
      } else if (str[i] === "}" && token.openingCurlyAt && !token.closingCurlyAt) {
        token.closingCurlyAt = i;
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        if (Array.isArray(token.properties) && token.properties.length && token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].end) {
          token.properties[~-token.properties.length].end = i;
          token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, i);
        }
        if (property.start) {
          token.properties.push(property);
          propertyReset();
        }
        pingTagCb(token);
        if (lastLayerIs("at")) {
          layers[~-layers.length].token.rules.push(token);
        }
        tokenReset();
      }
    }
    if (!doNothing && attrib.attribName && Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
      if (str[i] === "*" && str[rightVal] === "/") {
        closingComment(i);
      }
    }
    if (
    !doNothing &&
    attrib &&
    attrib.attribValueStartsAt && !attrib.attribValueEndsAt &&
    !property.propertyStarts &&
    i >= attrib.attribValueStartsAt &&
    Array.isArray(attrib.attribValue) && (!attrib.attribValue.length ||
    attrib.attribValue[~-attrib.attribValue.length].end &&
    attrib.attribValue[~-attrib.attribValue.length].end <= i) ||
    !doNothing &&
    token.type === "rule" &&
    token.openingCurlyAt &&
    !token.closingCurlyAt &&
    !property.propertyStarts) {
      if (str[i] === ";" && (
      attrib && Array.isArray(attrib.attribValue) && attrib.attribValue.length &&
      attrib.attribValue[~-attrib.attribValue.length].semi &&
      attrib.attribValue[~-attrib.attribValue.length].semi < i ||
      token && token.type === "rule" && Array.isArray(token.properties) && token.properties.length && token.properties[~-token.properties.length].semi && token.properties[~-token.properties.length].semi < i)) {
        initProperty({
          start: i,
          semi: i
        });
        doNothing = i + 1;
      }
      else if (
        str[i] && !str[i].trim() ||
        lastLayerIs("block")) {
          if (attrib.attribName) {
            attrib.attribValue.push({
              type: "text",
              start: i,
              end: null,
              value: null
            });
          } else if (token.type === "rule" && (
          !Array.isArray(token.properties) || !token.properties.length ||
          token.properties[~-token.properties.length].end)) {
            token.properties.push({
              type: "text",
              start: i,
              end: null,
              value: null
            });
          }
        }
    }
    if (!doNothing && token.type === "tag" && attrib.attribValueStartsAt && i >= attrib.attribValueStartsAt && attrib.attribValueEndsAt === null) {
      if (SOMEQUOTE.includes(str[i])) {
        if (
        !layers.some(layerObj => layerObj.type === "esp") && (
        !str[i] ||
        !str.includes(">", i) ||
        isAttrClosing(str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, i))) {
          attrib.attribClosingQuoteAt = i;
          attrib.attribValueEndsAt = i;
          if (attrib.attribValueStartsAt) {
            attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
          }
          attrib.attribEnds = i + 1;
          if (property.propertyStarts) {
            attrib.attribValue.push(clone(property));
            propertyReset();
          }
          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
            if (!attrib.attribValue[~-attrib.attribValue.length].property) {
              attrib.attribValue[~-attrib.attribValue.length].end = i;
              attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, i);
            }
          }
          if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
            layers.pop();
            layers.pop();
          }
          if (attrib.attribValue[~-attrib.attribValue.length] && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = i;
          }
          token.attribs.push(clone(attrib));
          attribReset();
        } else if ((!Array.isArray(attrib.attribValue) || !attrib.attribValue.length ||
        attrib.attribValue[~-attrib.attribValue.length].type !== "text") && !property.propertyStarts) {
          attrib.attribValue.push({
            type: "text",
            start: i,
            end: null,
            value: null
          });
        }
      } else if (attrib.attribOpeningQuoteAt === null && (str[i] && !str[i].trim() || ["/", ">"].includes(str[i]) || espChars.includes(str[i]) && espChars.includes(str[i + 1]))) {
        attrib.attribValueEndsAt = i;
        attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
        if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
          attrib.attribValue[~-attrib.attribValue.length].end = i;
          attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, attrib.attribValue[~-attrib.attribValue.length].end);
        }
        attrib.attribEnds = i;
        token.attribs.push(clone(attrib));
        attribReset();
        layers.pop();
        if (str[i] === ">") {
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (str[i] === "=" && leftVal !== null && rightVal && (`'"`.includes(str[rightVal]) || str[~-i] && isLatinLetter(str[~-i])) &&
      !(attrib && attrib.attribOpeningQuoteAt && (
      /\//.test(str.slice(attrib.attribOpeningQuoteAt + 1, i)) ||
      /mailto:/.test(str.slice(attrib.attribOpeningQuoteAt + 1, i)) ||
      /\w\?\w/.test(str.slice(attrib.attribOpeningQuoteAt + 1, i))))) {
        let whitespaceFound;
        let attribClosingQuoteAt;
        for (let y = leftVal; y >= attrib.attribValueStartsAt; y--) {
          if (!whitespaceFound && str[y] && !str[y].trim()) {
            whitespaceFound = true;
            if (attribClosingQuoteAt) {
              str.slice(y, attribClosingQuoteAt);
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
            attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, attribClosingQuoteAt);
            if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
              attrib.attribValue[~-attrib.attribValue.length].end = attrib.attribValueEndsAt;
              attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, attrib.attribValueEndsAt);
            }
          }
          attrib.attribEnds = attribClosingQuoteAt;
          if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
            layers.pop();
          }
          token.attribs.push(clone(attrib));
          attribReset();
          i = ~-attribClosingQuoteAt;
          continue;
        } else if (attrib.attribOpeningQuoteAt && (`'"`.includes(str[rightVal]) || allHtmlAttribs.has(str.slice(attrib.attribOpeningQuoteAt + 1, i).trim()))) {
          i = attrib.attribOpeningQuoteAt;
          attrib.attribEnds = attrib.attribOpeningQuoteAt + 1;
          attrib.attribValueStartsAt = null;
          layers.pop();
          token.attribs.push(clone(attrib));
          attribReset();
          continue;
        }
      } else if (str[i] === "/" && str[rightVal] === ">") {
        if (attrib.attribValueStartsAt) {
          attrib.attribValueStartsAt = null;
        }
        if (!attrib.attribEnds) {
          attrib.attribEnds = i;
        }
      } else if (attrib && attrib.attribName !== "style" && attrib.attribStarts && !attrib.attribEnds && !property.propertyStarts && (
      !Array.isArray(attrib.attribValue) ||
      !attrib.attribValue.length ||
      attrib.attribValue[~-attrib.attribValue.length].end && attrib.attribValue[~-attrib.attribValue.length].end <= i)) {
        attrib.attribValue.push({
          type: "text",
          start: i,
          end: null,
          value: null
        });
      }
    } else if (token.type === "esp" && attribToBackup && parentTokenToBackup && attribToBackup.attribOpeningQuoteAt && attribToBackup.attribValueStartsAt && `'"`.includes(str[i]) && str[attribToBackup.attribOpeningQuoteAt] === str[i] && isAttrClosing(str, attribToBackup.attribOpeningQuoteAt, i)) {
      token.end = i;
      token.value = str.slice(token.start, i);
      if (attribToBackup && !Array.isArray(attribToBackup.attribValue)) {
        attribToBackup.attribValue = [];
      }
      attribToBackup.attribValue.push(token);
      attribToBackup.attribValueEndsAt = i;
      attribToBackup.attribValueRaw = str.slice(attribToBackup.attribValueStartsAt, i);
      attribToBackup.attribClosingQuoteAt = i;
      attribToBackup.attribEnds = i + 1;
      token = clone(parentTokenToBackup);
      token.attribs.push(attribToBackup);
      attribToBackup = undefined;
      parentTokenToBackup = undefined;
      layers.pop();
      layers.pop();
      layers.pop();
    }
    if (!doNothing && token.type === "tag" && !attrib.attribValueStartsAt && attrib.attribNameEndsAt && attrib.attribNameEndsAt <= i && str[i] && str[i].trim()) {
      if (str[i] === "=" && !SOMEQUOTE.includes(str[rightVal]) && !`=`.includes(str[rightVal]) && !espChars.includes(str[rightVal])
      ) {
          const firstQuoteOnTheRightIdx = SOMEQUOTE.split("").map(quote => str.indexOf(quote, rightVal)).filter(val => val > 0).length ? Math.min(...SOMEQUOTE.split("").map(quote => str.indexOf(quote, rightVal)).filter(val => val > 0)) : undefined;
          if (
          rightVal &&
          str.slice(rightVal).includes("=") &&
          allHtmlAttribs.has(str.slice(rightVal, rightVal + str.slice(rightVal).indexOf("=")).trim().toLowerCase())) {
            attrib.attribEnds = i + 1;
            token.attribs.push({ ...attrib
            });
            attribReset();
          } else if (
          !firstQuoteOnTheRightIdx ||
          str.slice(rightVal, firstQuoteOnTheRightIdx).includes("=") ||
          !str.includes(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1) ||
          Array.from(str.slice(firstQuoteOnTheRightIdx + 1, str.indexOf(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1))).some(char => `<>=`.includes(char))) {
            attrib.attribValueStartsAt = rightVal;
            layers.push({
              type: "simple",
              value: null,
              position: attrib.attribValueStartsAt
            });
          }
        } else if (SOMEQUOTE.includes(str[i])) {
        const nextCharIdx = rightVal;
        if (
        nextCharIdx &&
        SOMEQUOTE.includes(str[nextCharIdx]) &&
        str[i] !== str[nextCharIdx] &&
        str.length > nextCharIdx + 2 &&
        str.slice(nextCharIdx + 1).includes(str[nextCharIdx]) && (
        !str.indexOf(str[nextCharIdx], nextCharIdx + 1) || !right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1)) || str[i] !== str[right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1))]) &&
        !Array.from(str.slice(nextCharIdx + 1, str.indexOf(str[nextCharIdx]))).some(char => `<>=${str[i]}`.includes(char))) {
          layers.pop();
        } else {
          if (!attrib.attribOpeningQuoteAt) {
            attrib.attribOpeningQuoteAt = i;
            if (
            str[i + 1] && (
            str[i + 1] !== str[i] ||
            !ifQuoteThenAttrClosingQuote(i + 1))) {
              attrib.attribValueStartsAt = i + 1;
            }
          } else {
            /* istanbul ignore else */
            if (isAttrClosing(str, attrib.attribOpeningQuoteAt, i)) {
              attrib.attribClosingQuoteAt = i;
            }
            /* istanbul ignore else */
            if (attrib.attribOpeningQuoteAt && attrib.attribClosingQuoteAt) {
              if (attrib.attribOpeningQuoteAt < ~-attrib.attribClosingQuoteAt) {
                attrib.attribValueRaw = str.slice(attrib.attribOpeningQuoteAt + 1, attrib.attribClosingQuoteAt);
              } else {
                attrib.attribValueRaw = "";
              }
              attrib.attribEnds = i + 1;
              token.attribs.push(clone(attrib));
              attribReset();
            }
          }
        }
      }
    }
    if (!doNothing && str[i] === ">" &&
    str[i - 1] !== "%" && token.type === "tag" && attrib.attribStarts && !attrib.attribEnds) {
      let thisIsRealEnding = false;
      if (str[i + 1]) {
        for (let y = i + 1; y < len; y++) {
          if (attrib.attribOpeningQuoteAt && str[y] === str[attrib.attribOpeningQuoteAt]) {
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
        if (attrib.attribValueStartsAt && i && attrib.attribValueStartsAt < i && str.slice(attrib.attribValueStartsAt, i).trim()) {
          attrib.attribValueEndsAt = i;
          attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, i);
          }
        } else {
          attrib.attribValueStartsAt = null;
        }
        if (attrib.attribEnds === null) {
          attrib.attribEnds = i;
        }
        if (attrib) {
          token.attribs.push(clone(attrib));
          attribReset();
        }
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
      token.value = str.slice(token.start, token.end);
      if (attrib && attrib.attribName) {
        if (!attrib.attribEnds) {
          attrib.attribEnds = i;
        }
        token.attribs.push({ ...attrib
        });
        attribReset();
      }
      if (token && Array.isArray(token.properties) && token.properties.length && !token.properties[~-token.properties.length].end) {
        token.properties[~-token.properties.length].end = i;
        if (token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].value) {
          token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, i);
        }
      }
      if (property && property.propertyStarts) {
        if (!property.end) {
          property.end = i;
        }
        pushProperty(property);
        propertyReset();
      }
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
    timeTakenInMilliseconds
  };
}
const util = {
  matchLayerLast
};

export { defaults, tokenizer, util, version };
