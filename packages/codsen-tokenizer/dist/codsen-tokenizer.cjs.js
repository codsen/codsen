/**
 * codsen-tokenizer
 * HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 * Version: 5.4.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/codsen-tokenizer/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var stringMatchLeftRight = require('string-match-left-right');
var clone = require('lodash.clonedeep');
var stringLeftRight = require('string-left-right');
var isHtmlAttributeClosing = require('is-html-attribute-closing');
var htmlAllKnownAttributes = require('html-all-known-attributes');
var isCharSuitableForHtmlAttrName = require('is-char-suitable-for-html-attr-name');
var isHtmlTagOpening = require('is-html-tag-opening');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);

var allHTMLTagsKnownToHumanity = new Set(["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"]);
var espChars = "{}%-$_()*|#";
var veryEspChars = "{}|#";
var notVeryEspChars = "%()$_*#";
var leftyChars = "({";
var rightyChars = "})";
var espLumpBlacklist = [")|(", "|(", ")(", "()", "}{", "{}", "%)", "*)", "||", "--"];
var punctuationChars = ".,;!?";
var BACKTICK = "\x60";
var LEFTDOUBLEQUOTMARK = "\u201C";
var RIGHTDOUBLEQUOTMARK = "\u201D";
function isLatinLetter(char) {
  return !!(char && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123));
}
function charSuitableForTagName(char) {
  return /[.\-_a-z0-9\u00B7\u00C0-\uFFFD]/i.test(char);
}
function flipEspTag(str) {
  var res = "";
  for (var i = 0, len = str.length; i < len; i++) {
    if (str[i] === "[") {
      res = "]" + res;
    } else if (str[i] === "]") {
      res = "[" + res;
    } else if (str[i] === "{") {
      res = "}" + res;
    } else if (str[i] === "}") {
      res = "{" + res;
    } else if (str[i] === "(") {
      res = ")" + res;
    } else if (str[i] === ")") {
      res = "(" + res;
    } else if (str[i] === "<") {
      res = ">" + res;
    } else if (str[i] === ">") {
      res = "<" + res;
    } else if (str[i] === LEFTDOUBLEQUOTMARK) {
      res = "" + RIGHTDOUBLEQUOTMARK + res;
    } else if (str[i] === RIGHTDOUBLEQUOTMARK) {
      res = "" + LEFTDOUBLEQUOTMARK + res;
    } else {
      res = "" + str[i] + res;
    }
  }
  return res;
}
function isTagNameRecognised(tagName) {
  return allHTMLTagsKnownToHumanity.has(tagName.toLowerCase()) || ["doctype", "cdata", "xml"].includes(tagName.toLowerCase());
}
function xBeforeYOnTheRight(str, startingIdx, x, y) {
  for (var i = startingIdx, len = str.length; i < len; i++) {
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
var voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
var inlineTags = new Set(["a", "abbr", "acronym", "audio", "b", "bdi", "bdo", "big", "br", "button", "canvas", "cite", "code", "data", "datalist", "del", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins", "kbd", "label", "map", "mark", "meter", "noscript", "object", "output", "picture", "progress", "q", "ruby", "s", "samp", "script", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "template", "textarea", "time", "u", "tt", "var", "video", "wbr"]);
var charsThatEndCSSChunks = ["{", "}", ","];
var SOMEQUOTE = "'\"" + LEFTDOUBLEQUOTMARK + RIGHTDOUBLEQUOTMARK;
var attrNameRegexp = /[\w-]/;

function getLastEspLayerObjIdx(layers) {
  if (layers && layers.length) {
    for (var z = layers.length; z--;) {
      if (layers[z].type === "esp") {
        return z;
      }
    }
  }
  return undefined;
}

function getWholeEspTagLumpOnTheRight(str, i, layers) {
  var wholeEspTagLumpOnTheRight = str[i];
  var len = str.length;
  var lastEspLayerObj = layers[getLastEspLayerObjIdx(layers)];
  for (var y = i + 1; y < len; y++) {
    if (leftyChars.includes(str[y]) && rightyChars.includes(str[y - 1])) {
      break;
    }
    if (
    wholeEspTagLumpOnTheRight.length > 1 && (
    wholeEspTagLumpOnTheRight.includes("<") || wholeEspTagLumpOnTheRight.includes("{") || wholeEspTagLumpOnTheRight.includes("[") || wholeEspTagLumpOnTheRight.includes("(")) &&
    str[y] === "(") {
      break;
    }
    if (espChars.includes(str[y]) ||
    lastEspLayerObj && lastEspLayerObj.guessedClosingLump.includes(str[y]) || str[i] === "<" && str[y] === "/" ||
    str[y] === ">" && wholeEspTagLumpOnTheRight === "--" && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-" ||
    !lastEspLayerObj && y > i && "!=@".includes(str[y])) {
      wholeEspTagLumpOnTheRight += str[y];
    } else {
      break;
    }
  }
  if (wholeEspTagLumpOnTheRight && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].guessedClosingLump && wholeEspTagLumpOnTheRight.length > layers[layers.length - 1].guessedClosingLump.length) {
    if (wholeEspTagLumpOnTheRight.endsWith(layers[layers.length - 1].openingLump)) {
      return wholeEspTagLumpOnTheRight.slice(0, wholeEspTagLumpOnTheRight.length - layers[layers.length - 1].openingLump.length);
    }
    var uniqueCharsListFromGuessedClosingLumpArr = new Set(layers[layers.length - 1].guessedClosingLump);
    var found = 0;
    var _loop = function _loop(len2, _y) {
      if (!uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLumpOnTheRight[_y]) && found > 1) {
        return {
          v: wholeEspTagLumpOnTheRight.slice(0, _y)
        };
      }
      if (uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLumpOnTheRight[_y])) {
        found += 1;
        uniqueCharsListFromGuessedClosingLumpArr = new Set([].concat(uniqueCharsListFromGuessedClosingLumpArr).filter(function (el) {
          return el !== wholeEspTagLumpOnTheRight[_y];
        }));
      }
    };
    for (var _y = 0, len2 = wholeEspTagLumpOnTheRight.length; _y < len2; _y++) {
      var _ret = _loop(len2, _y);
      if (typeof _ret === "object") return _ret.v;
    }
  }
  return wholeEspTagLumpOnTheRight;
}

function startsHtmlComment(str, i, token, layers) {
  return !!(
  str[i] === "<" && (stringMatchLeftRight.matchRight(str, i, ["!--"], {
    maxMismatches: 1,
    firstMustMatch: true,
    trimBeforeMatching: true
  }) || stringMatchLeftRight.matchRightIncl(str, i, ["<![endif]"], {
    i: true,
    maxMismatches: 2,
    trimBeforeMatching: true
  })) && !stringMatchLeftRight.matchRight(str, i, ["![cdata", "<"], {
    i: true,
    maxMismatches: 1,
    trimBeforeMatching: true
  }) && (token.type !== "comment" || token.kind !== "not") || str[i] === "-" && stringMatchLeftRight.matchRightIncl(str, i, ["-->"], {
    trimBeforeMatching: true
  }) && (token.type !== "comment" || !token.closing && token.kind !== "not") && !stringMatchLeftRight.matchLeft(str, i, "<", {
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

function matchLayerLast(wholeEspTagLump, layers, matchFirstInstead) {
  if (matchFirstInstead === void 0) {
    matchFirstInstead = false;
  }
  if (!layers.length) {
    return;
  }
  var whichLayerToMatch = matchFirstInstead ? layers[0] : layers[layers.length - 1];
  if (whichLayerToMatch.type !== "esp") {
    return;
  }
  if (
  wholeEspTagLump.includes(whichLayerToMatch.guessedClosingLump) ||
  Array.from(wholeEspTagLump).every(function (char) {
    return whichLayerToMatch.guessedClosingLump.includes(char);
  }) ||
  whichLayerToMatch.guessedClosingLump &&
  whichLayerToMatch.guessedClosingLump.length > 2 &&
  whichLayerToMatch.guessedClosingLump[whichLayerToMatch.guessedClosingLump.length - 1] === wholeEspTagLump[wholeEspTagLump.length - 1] && whichLayerToMatch.guessedClosingLump[whichLayerToMatch.guessedClosingLump.length - 2] === wholeEspTagLump[wholeEspTagLump.length - 2]) {
    return wholeEspTagLump.length;
  }
}

var BACKSLASH = "\\";
function startsTag(str, i, token, layers, withinStyle, leftVal, rightVal) {
  return !!(str[i] && str[i].trim().length && (!layers.length || token.type === "text") && (!token.kind || !["doctype", "xml"].includes(token.kind)) && (
  !withinStyle || str[i] === "<") && (str[i] === "<" && (isHtmlTagOpening.isOpening(str, i, {
    allowCustomTagNames: true
  }) || str[rightVal] === ">" || stringMatchLeftRight.matchRight(str, i, ["doctype", "xml", "cdata"], {
    i: true,
    trimBeforeMatching: true,
    trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
  })) ||
  str[i] === "/" && isLatinLetter(str[i + 1]) && str[leftVal] !== "<" && isHtmlTagOpening.isOpening(str, i, {
    allowCustomTagNames: true,
    skipOpeningBracket: true
  }) || isLatinLetter(str[i]) && (!str[i - 1] || !isLatinLetter(str[i - 1]) && !["<", "/", "!", BACKSLASH].includes(str[leftVal])) && isHtmlTagOpening.isOpening(str, i, {
    allowCustomTagNames: false,
    skipOpeningBracket: true
  })) && (token.type !== "esp" || token.tail && token.tail.includes(str[i])));
}

function startsEsp(str, i, token, layers, withinStyle) {
  var res =
  espChars.includes(str[i]) && str[i + 1] && espChars.includes(str[i + 1]) &&
  !(notVeryEspChars.includes(str[i]) && notVeryEspChars.includes(str[i + 1])) && (
  str[i] !== str[i + 1] || veryEspChars.includes(str[i])) && token.type !== "rule" && token.type !== "at" && !(str[i] === "-" && "-{(".includes(str[i + 1])) && !("})".includes(str[i]) && "-".includes(str[i + 1])) && !(
  str[i] === "%" && str[i + 1] === "%" && "0123456789".includes(str[i - 1]) && (!str[i + 2] || punctuationChars.includes(str[i + 2]) || !str[i + 2].trim().length)) && !(withinStyle && ("{}".includes(str[i]) || "{}".includes(str[stringLeftRight.right(str, i)]))) ||
  str[i] === "<" && (
  str[i + 1] === "/" && espChars.includes(str[i + 2]) ||
  espChars.includes(str[i + 1]) &&
  !["-"].includes(str[i + 1])) ||
  str[i] === "<" && (
  str[i + 1] === "%" ||
  str.startsWith("jsp:", i + 1) ||
  str.startsWith("cms:", i + 1) ||
  str.startsWith("c:", i + 1)) || str.startsWith("${jspProp", i) ||
  ">})".includes(str[i]) &&
  Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump.includes(flipEspTag(str[i])) && (
  str[i] !== ">" || !xBeforeYOnTheRight(str, i + 1, ">", "<")) ||
  str[i] === "-" && str[i + 1] === "-" && str[i + 2] === ">" && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-";
  return !!res;
}

var version$1 = "5.4.0";

var version = version$1;
var importantStartsRegexp = /^\s*!?\s*[a-zA-Z0-9]+(?:[\s;}<>'"]|$)/gm;
var defaults = {
  tagCb: null,
  tagCbLookahead: 0,
  charCb: null,
  charCbLookahead: 0,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
function tokenizer(str, originalOpts) {
  var start = Date.now();
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as \"" + typeof str + "\", equal to:\n" + JSON.stringify(str, null, 4));
    }
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type " + typeof originalOpts + ", equal to " + JSON.stringify(originalOpts, null, 4));
  }
  if (originalOpts && isObj(originalOpts) && originalOpts.tagCb && typeof originalOpts.tagCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type " + typeof originalOpts.tagCb + ", equal to " + JSON.stringify(originalOpts.tagCb, null, 4));
  }
  if (originalOpts && isObj(originalOpts) && originalOpts.charCb && typeof originalOpts.charCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type " + typeof originalOpts.charCb + ", equal to " + JSON.stringify(originalOpts.charCb, null, 4));
  }
  if (originalOpts && isObj(originalOpts) && originalOpts.reportProgressFunc && typeof originalOpts.reportProgressFunc !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type " + typeof originalOpts.reportProgressFunc + ", equal to " + JSON.stringify(originalOpts.reportProgressFunc, null, 4));
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  var currentPercentageDone = 0;
  var lastPercentage = 0;
  var len = str.length;
  var midLen = Math.floor(len / 2);
  var doNothing = 0;
  var withinScript = false;
  var withinStyle = false;
  var withinStyleComment = false;
  var tagStash = [];
  var charStash = [];
  var token = {};
  function tokenReset() {
    token = {
      type: null,
      start: null,
      end: null,
      value: null
    };
    attribReset();
  }
  var attribDefaults = {
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
  var attrib = _objectSpread__default['default']({}, attribDefaults);
  function attribReset() {
    attrib = clone__default['default'](attribDefaults);
  }
  function attribPush(tokenObj) {
    /* istanbul ignore else */
    if (attrib.attribValue.length && attrib.attribValue[~-attrib.attribValue.length].start && !attrib.attribValue[~-attrib.attribValue.length].end) {
      attrib.attribValue[~-attrib.attribValue.length].end = tokenObj.start;
      attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, tokenObj.start);
    }
    attrib.attribValue.push(tokenObj);
  }
  var propertyDefault = {
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
  var property = _objectSpread__default['default']({}, propertyDefault);
  function propertyReset() {
    property = _objectSpread__default['default']({}, propertyDefault);
  }
  function pushProperty(p) {
    if (attrib && attrib.attribName === "style") {
      attrib.attribValue.push(_objectSpread__default['default']({}, p));
    } else if (token && Array.isArray(token.properties)) {
      token.properties.push(_objectSpread__default['default']({}, p));
    }
  }
  tokenReset();
  var selectorChunkStartedAt;
  var parentTokenToBackup;
  var attribToBackup;
  var lastNonWhitespaceCharAt = null;
  var layers = [];
  function lastLayerIs(something) {
    return !!(Array.isArray(layers) && layers.length && layers[~-layers.length].type === something);
  }
  function closingComment(i) {
    var end = (stringLeftRight.right(str, i) || i) + 1;
    attribPush({
      type: "comment",
      start: i,
      end: end,
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
    var currentElem = stash.shift();
    var next = [];
    for (var i = 0; i < lookaheadLength; i++) {
      if (stash[i]) {
        next.push(clone__default['default'](stash[i]));
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
      if (stringLeftRight.left(str, i) !== null) {
        incomingToken.end = stringLeftRight.left(str, i) + 1;
      } else {
        incomingToken.end = i;
      }
      incomingToken.value = str.slice(incomingToken.start, incomingToken.end);
      if (incomingToken.type === "tag" && !"/>".includes(str[~-incomingToken.end])) {
        var cutOffIndex = incomingToken.tagNameEndsAt || i;
        if (Array.isArray(incomingToken.attribs) && incomingToken.attribs.length) {
          for (var i2 = 0, len2 = incomingToken.attribs.length; i2 < len2; i2++) {
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
          initToken("text", stringLeftRight.left(str, i) + 1);
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
  function getNewToken(type, startVal) {
    if (startVal === void 0) {
      startVal = null;
    }
    if (type === "tag") {
      return {
        type: type,
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
        type: type,
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
        type: type,
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
        type: type,
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
        type: type,
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
      property = _objectSpread__default['default'](_objectSpread__default['default']({}, propertyDefault), propertyStarts);
    }
  }
  function ifQuoteThenAttrClosingQuote(idx) {
    return !"'\"".includes(str[idx]) ||
    !(attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt) ||
    isHtmlAttributeClosing.isAttrClosing(str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, idx);
  }
  function attrEndsAt(idx) {
    return ";}/".includes(str[idx]) && (!attrib || !attrib.attribName || attrib.attribName !== "style") ||
    "/;'\"><".includes(str[idx]) && attrib && attrib.attribName === "style" &&
    ifQuoteThenAttrClosingQuote(idx);
  }
  var _loop = function _loop(_i) {
    if (!doNothing && str[_i] && opts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (_i === midLen) {
          opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
        }
      } else if (len >= 2000) {
        currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(_i / len * (opts.reportProgressFuncTo - opts.reportProgressFuncFrom));
        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
      }
    }
    var leftVal = stringLeftRight.left(str, _i);
    var rightVal = stringLeftRight.right(str, _i);
    if (withinStyle && token.type && !["rule", "at", "text", "comment"].includes(token.type)) {
      withinStyle = false;
    }
    if (doNothing && _i >= doNothing) {
      doNothing = 0;
    }
    if (isLatinLetter(str[_i]) && isLatinLetter(str[~-_i]) && isLatinLetter(str[_i + 1])) {
      if (property && property.valueStarts && !property.valueEnds && !property.importantStarts && str.startsWith("important", _i)) {
        property.valueEnds = _i;
        property.value = str.slice(property.valueStarts, _i);
        property.importantStarts = _i;
      }
      i = _i;
      return "continue";
    }
    if (" \t\r\n".includes(str[_i]) &&
    str[_i] === str[~-_i] && str[_i] === str[_i + 1]) {
      i = _i;
      return "continue";
    }
    if (!doNothing && atRuleWaitingForClosingCurlie()) {
      if (str[_i] === "}") {
        if (!token.type || token.type === "text" || token.type === "rule" && token.openingCurlyAt === null) {
          if (token.type === "rule") {
            token.end = leftVal + 1;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token);
            if (lastLayerIs("at")) {
              layers[~-layers.length].token.rules.push(token);
            }
            tokenReset();
            if (leftVal !== null && leftVal < ~-_i) {
              initToken("text", leftVal + 1);
            }
          }
          dumpCurrentToken(token, _i);
          var poppedToken = layers.pop();
          token = poppedToken.token;
          token.closingCurlyAt = _i;
          token.end = _i + 1;
          token.value = str.slice(token.start, token.end);
          pingTagCb(token);
          if (lastLayerIs("at")) {
            layers[~-layers.length].token.rules.push(token);
          }
          tokenReset();
          doNothing = _i + 1;
        }
      } else if (token.type === "text" && str[_i] && str[_i].trim()) {
        token.end = _i;
        token.value = str.slice(token.start, token.end);
        if (lastLayerIs("at")) {
          layers[~-layers.length].token.rules.push(token);
        } else {
          pingTagCb(token);
        }
        tokenReset();
      }
    }
    if (token.end && token.end === _i) {
      if (token.tagName === "style" && !token.closing) {
        withinStyle = true;
      }
      if (attribToBackup) {
        attrib = attribToBackup;
        attrib.attribValue.push(token);
        token = clone__default['default'](parentTokenToBackup);
        attribToBackup = undefined;
        parentTokenToBackup = undefined;
      } else {
        dumpCurrentToken(token, _i);
        layers.length = 0;
      }
    }
    if (!doNothing) {
      if (["tag", "at"].includes(token.type) && token.kind !== "cdata") {
        if (str[_i] && (SOMEQUOTE.includes(str[_i]) || "()".includes(str[_i])) && !(
        SOMEQUOTE.includes(str[leftVal]) && str[leftVal] === str[rightVal]) &&
        ifQuoteThenAttrClosingQuote(_i)
        ) {
            if (
            lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[_i])) {
              layers.pop();
            } else {
              layers.push({
                type: "simple",
                value: str[_i],
                position: _i
              });
            }
          }
      } else if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
        if (["[", "]"].includes(str[_i])) {
          if (
          lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[_i])) {
            layers.pop();
          } else {
            layers.push({
              type: "simple",
              value: str[_i],
              position: _i
            });
          }
        }
      } else if (token.type === "esp" && ("'\"" + BACKTICK + "()").includes(str[_i]) && !(
      ["\"", "'", "`"].includes(str[leftVal]) && str[leftVal] === str[rightVal])) {
        if (
        lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[_i])) {
          layers.pop();
          doNothing = _i + 1;
        } else if (!"]})>".includes(str[_i])) {
          layers.push({
            type: "simple",
            value: str[_i],
            position: _i
          });
        }
      }
    }
    if (!doNothing && token.type === "at" && token.start != null && _i >= token.start && !token.identifierStartsAt && str[_i] && str[_i].trim() && str[_i] !== "@") {
      token.identifierStartsAt = _i;
    }
    if (!doNothing && token.type === "at" && token.queryStartsAt && !token.queryEndsAt && "{;".includes(str[_i])) {
      if (str[_i] === "{") {
        if (str[~-_i] && str[~-_i].trim()) {
          token.queryEndsAt = _i;
        } else {
          token.queryEndsAt = leftVal !== null ? leftVal + 1 : _i;
        }
      } else {
        token.queryEndsAt = stringLeftRight.left(str, _i + 1) || 0;
      }
      if (token.queryStartsAt && token.queryEndsAt) {
        token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
      }
      token.end = str[_i] === ";" ? _i + 1 : _i;
      token.value = str.slice(token.start, token.end);
      if (str[_i] === ";") {
        pingTagCb(token);
      } else {
        token.openingCurlyAt = _i;
        layers.push({
          type: "at",
          token: token
        });
      }
      tokenReset();
      doNothing = _i + 1;
    }
    if (!doNothing && token.type === "at" && token.identifier && str[_i] && str[_i].trim() && !token.queryStartsAt) {
      token.queryStartsAt = _i;
    }
    if (!doNothing && token && token.type === "at" && token.identifierStartsAt && _i >= token.start && str[_i] && (!str[_i].trim() || "()".includes(str[_i])) && !token.identifierEndsAt) {
      token.identifierEndsAt = _i;
      token.identifier = str.slice(token.identifierStartsAt, _i);
    }
    if (token.type === "rule") {
      if (selectorChunkStartedAt && (charsThatEndCSSChunks.includes(str[_i]) || str[_i] && rightVal && !str[_i].trim() && charsThatEndCSSChunks.includes(str[rightVal]))) {
        token.selectors.push({
          value: str.slice(selectorChunkStartedAt, _i),
          selectorStarts: selectorChunkStartedAt,
          selectorEnds: _i
        });
        selectorChunkStartedAt = undefined;
        token.selectorsEnd = _i;
      } else if (str[_i] === "{" && str[_i - 1] !== "{" &&
      str[_i + 1] !== "{" &&
      token.openingCurlyAt && !token.closingCurlyAt) {
        for (var y = _i; y--;) {
          if (!str[y].trim() || "{}\"';".includes(str[y])) {
            if (property && property.start && !property.end) {
              property.end = y + 1;
              property.property = str.slice(property.start, property.end);
              pushProperty(property);
              propertyReset();
              token.end = y + 1;
              token.value = str.slice(token.start, token.end);
              pingTagCb(token);
              initToken(str[y + 1] === "@" ? "at" : "rule", y + 1);
              token.left = stringLeftRight.left(str, y + 1);
              token.selectorsStart = y + 1;
              _i = y + 1;
            }
            break;
          }
        }
      }
    }
    var lastEspLayerObjIdx = getLastEspLayerObjIdx(layers);
    if (!doNothing && str[_i]) {
      if (startsTag(str, _i, token, layers, withinStyle, leftVal, rightVal)) {
        if (token.type && token.start !== null) {
          if (token.type === "rule") {
            if (property && property.start) {
              if (property.importantStarts && !property.importantEnds) {
                property.importantEnds = _i;
                property.important = str.slice(property.importantStarts, _i);
              }
              if (property.propertyStarts && !property.propertyEnds) {
                property.propertyEnds = _i;
                if (!property.property) {
                  property.property = str.slice(property.propertyStarts, _i);
                }
              }
              if (!property.end) {
                property.end = _i;
              }
              if (property.valueStarts && !property.valueEnds) {
                property.valueEnds = _i;
                if (!property.value) {
                  property.value = str.slice(property.valueStarts, _i);
                }
              }
              pushProperty(property);
              propertyReset();
            }
          }
          dumpCurrentToken(token, _i);
          tokenReset();
        }
        initToken("tag", _i);
        if (withinStyle) {
          withinStyle = false;
        }
        var badCharacters = "?![-/";
        var extractedTagName = "";
        var letterMet = false;
        if (rightVal) {
          for (var _y = rightVal; _y < len; _y++) {
            if (!letterMet && str[_y] && str[_y].trim() && str[_y].toUpperCase() !== str[_y].toLowerCase()) {
              letterMet = true;
            }
            if (
            letterMet && str[_y] && (
            !str[_y].trim() ||
            !/\w/.test(str[_y]) && !badCharacters.includes(str[_y]) || str[_y] === "[")
            ) {
                break;
              } else if (!badCharacters.includes(str[_y])) {
              extractedTagName += str[_y].trim().toLowerCase();
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
            doNothing = _i;
          }
        }
      } else if (!withinScript && startsHtmlComment(str, _i, token, layers)) {
        if (token.start != null) {
          dumpCurrentToken(token, _i);
        }
        initToken("comment", _i);
        if (str[_i] === "-") {
          token.closing = true;
        } else if (stringMatchLeftRight.matchRightIncl(str, _i, ["<![endif]-->"], {
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
      } else if (!withinScript && startsCssComment(str, _i, token, layers, withinStyle)) {
        if (token.start != null) {
          dumpCurrentToken(token, _i);
        }
        initToken("comment", _i);
        token.language = "css";
        token.kind = str[_i] === "/" && str[_i + 1] === "/" ? "line" : "block";
        token.value = str.slice(_i, _i + 2);
        token.end = _i + 2;
        token.closing = str[_i] === "*" && str[_i + 1] === "/";
        withinStyleComment = true;
        if (token.closing) {
          withinStyleComment = false;
        }
        doNothing = _i + 2;
      } else if (!withinScript && (
      typeof lastEspLayerObjIdx === "number" && layers[lastEspLayerObjIdx] && layers[lastEspLayerObjIdx].type === "esp" && layers[lastEspLayerObjIdx].openingLump && layers[lastEspLayerObjIdx].guessedClosingLump && layers[lastEspLayerObjIdx].guessedClosingLump.length > 1 &&
      layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[_i]) &&
      layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[_i + 1]) &&
      !(
      layers[lastEspLayerObjIdx + 1] &&
      "'\"".includes(layers[lastEspLayerObjIdx + 1].value) &&
      str.indexOf(layers[lastEspLayerObjIdx + 1].value, _i) > 0 && layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[stringLeftRight.right(str, str.indexOf(layers[lastEspLayerObjIdx + 1].value, _i))])) ||
      startsEsp(str, _i, token, layers, withinStyle) && (
      !lastLayerIs("simple") || !["'", "\""].includes(layers[~-layers.length].value) ||
      attrib && attrib.attribStarts && !attrib.attribEnds))) {
        var wholeEspTagLumpOnTheRight = getWholeEspTagLumpOnTheRight(str, _i, layers);
        if (!espLumpBlacklist.includes(wholeEspTagLumpOnTheRight)) {
          var lengthOfClosingEspChunk;
          var disposableVar;
          if (layers.length && (
          lengthOfClosingEspChunk = matchLayerLast(wholeEspTagLumpOnTheRight, layers))) {
            if (token.type === "esp") {
              if (!token.end) {
                token.end = _i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
                token.tail = str.slice(_i, _i + lengthOfClosingEspChunk);
                token.tailStartsAt = _i;
                token.tailEndsAt = token.end;
                if (str[_i] === ">" && str[leftVal] === "/") {
                  token.tailStartsAt = leftVal;
                  token.tail = str.slice(token.tailStartsAt, _i + 1);
                }
              }
              doNothing = token.tailEndsAt;
              if (parentTokenToBackup) {
                if (!Array.isArray(parentTokenToBackup.attribs)) {
                  parentTokenToBackup.attribs = [];
                }
                if (attribToBackup) {
                  attrib = attribToBackup;
                  attrib.attribValue.push(_objectSpread__default['default']({}, token));
                } else {
                  parentTokenToBackup.attribs.push(_objectSpread__default['default']({}, token));
                }
                token = clone__default['default'](parentTokenToBackup);
                parentTokenToBackup = undefined;
                attribToBackup = undefined;
                layers.pop();
                i = _i;
                return "continue";
              } else {
                dumpCurrentToken(token, _i);
              }
              tokenReset();
            }
            layers.pop();
          } else if (layers.length && (
          lengthOfClosingEspChunk = matchLayerLast(wholeEspTagLumpOnTheRight, layers, true))) {
            if (token.type === "esp") {
              if (!token.end) {
                token.end = _i + (lengthOfClosingEspChunk || 0);
                token.value = str.slice(token.start, token.end);
              }
              if (!token.tailStartsAt) {
                token.tailStartsAt = _i;
              }
              if (!token.tailEndsAt && lengthOfClosingEspChunk) {
                token.tailEndsAt = token.tailStartsAt + lengthOfClosingEspChunk;
                token.tail = str.slice(_i, _i + lengthOfClosingEspChunk);
              }
              dumpCurrentToken(token, _i);
              tokenReset();
            }
            layers.length = 0;
          } else if (
          attrib && attrib.attribValue && attrib.attribValue.length && attrib.attribValue[~-attrib.attribValue.length].start && Array.from(str.slice(attrib.attribValue[~-attrib.attribValue.length].start, _i)).some(function (char, idx) {
            return wholeEspTagLumpOnTheRight.includes(flipEspTag(char)) && (
            veryEspChars.includes(char) ||
            !idx) && (disposableVar = {
              char: char,
              idx: idx
            });
          }) &&
          token.type === "tag" && attrib && attrib.attribValueStartsAt && !attrib.attribValueEndsAt &&
          attrib.attribValue[~-attrib.attribValue.length] && attrib.attribValue[~-attrib.attribValue.length].type === "text") {
            token.pureHTML = false;
            var lastAttrValueObj = attrib.attribValue[~-attrib.attribValue.length];
            var newTokenToPutInstead = getNewToken("esp", lastAttrValueObj.start);
            if (!disposableVar || !disposableVar.idx) {
              newTokenToPutInstead.head = disposableVar.char;
              newTokenToPutInstead.headStartsAt = lastAttrValueObj.start;
              newTokenToPutInstead.headEndsAt = newTokenToPutInstead.headStartsAt + 1;
              newTokenToPutInstead.tailStartsAt = _i;
              newTokenToPutInstead.tailEndsAt = _i + wholeEspTagLumpOnTheRight.length;
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
              position: _i
            });
            if (token.start !== null) {
              if (token.type === "tag") {
                if (token.tagNameStartsAt && (!token.tagName || !token.tagNameEndsAt)) {
                  token.tagNameEndsAt = _i;
                  token.tagName = str.slice(token.tagNameStartsAt, _i);
                  token.recognised = isTagNameRecognised(token.tagName);
                }
                parentTokenToBackup = clone__default['default'](token);
                if (attrib.attribStarts && !attrib.attribEnds) {
                  attribToBackup = clone__default['default'](attrib);
                }
              } else if (!attribToBackup) {
                dumpCurrentToken(token, _i);
              } else if (attribToBackup && Array.isArray(attribToBackup.attribValue) && attribToBackup.attribValue.length && attribToBackup.attribValue[~-attribToBackup.attribValue.length].type === "esp" && !attribToBackup.attribValue[~-attribToBackup.attribValue.length].end) {
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].end = _i;
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].value = str.slice(attribToBackup.attribValue[~-attribToBackup.attribValue.length].start, _i);
              }
            }
            initToken("esp", _i);
            token.head = wholeEspTagLumpOnTheRight;
            token.headStartsAt = _i;
            token.headEndsAt = _i + wholeEspTagLumpOnTheRight.length;
            if (parentTokenToBackup && parentTokenToBackup.pureHTML) {
              parentTokenToBackup.pureHTML = false;
            }
            if (attribToBackup && Array.isArray(attribToBackup.attribValue) && attribToBackup.attribValue.length) {
              if (attribToBackup.attribValue[~-attribToBackup.attribValue.length].start === token.start) {
                attribToBackup.attribValue.pop();
              } else if (
              attribToBackup.attribValue[~-attribToBackup.attribValue.length].type === "text" && !attribToBackup.attribValue[~-attribToBackup.attribValue.length].end) {
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].end = _i;
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].value = str.slice(attribToBackup.attribValue[~-attribToBackup.attribValue.length].start, _i);
              }
            }
          }
          doNothing = _i + (lengthOfClosingEspChunk || wholeEspTagLumpOnTheRight.length);
        }
      } else if (!withinScript && withinStyle && !withinStyleComment && str[_i] && str[_i].trim() &&
      !"{}".includes(str[_i]) && (
      !token.type ||
      ["text"].includes(token.type))) {
        if (token.type) {
          dumpCurrentToken(token, _i);
        }
        initToken(str[_i] === "@" ? "at" : "rule", _i);
        token.left = lastNonWhitespaceCharAt;
        token.nested = layers.some(function (o) {
          return o.type === "at";
        });
      } else if (!token.type) {
        initToken("text", _i);
        if (withinScript && str.indexOf("</script>", _i)) {
          doNothing = str.indexOf("</script>", _i);
        } else {
          doNothing = _i;
        }
      }
    }
    var R1 = void 0;
    var R2 = void 0;
    if (!doNothing && (property.start || str[_i] === "!")) {
      var idxRightIncl = stringLeftRight.right(str, _i - 1);
      R1 = ";<>".includes(str[idxRightIncl]) ||
      str[idxRightIncl] === "{" && str[_i - 1] !== "{" || str[idxRightIncl] === "}" && str[_i - 1] !== "}" ||
      "'\"".includes(str[idxRightIncl]) && (
      !layers ||
      !layers.length ||
      !layers[~-layers.length] ||
      !layers[~-layers.length].value ||
      layers[~-layers.length].value === str[idxRightIncl]);
      R2 = stringMatchLeftRight.matchRightIncl(str, _i, ["!important"], {
        i: true,
        trimBeforeMatching: true,
        maxMismatches: 2
      });
    }
    /* istanbul ignore else */
    if (!doNothing && property && (property.semi && property.semi < _i && property.semi < _i || (property.valueStarts && !property.valueEnds && str[rightVal] !== "!" && (
    !rightVal ||
    R1) || property.importantStarts && !property.importantEnds) && (!property.valueEnds || str[rightVal] !== ";") && (
    !str[_i] ||
    !str[_i].trim() ||
    !property.valueEnds && str[_i] === ";" ||
    attrEndsAt(_i)))) {
      /* istanbul ignore else */
      if (property.importantStarts && !property.importantEnds) {
        property.importantEnds = stringLeftRight.left(str, _i) + 1;
        property.important = str.slice(property.importantStarts, property.importantEnds);
      }
      /* istanbul ignore else */
      if (property.valueStarts && !property.valueEnds) {
        property.valueEnds = _i;
        property.value = str.slice(property.valueStarts, _i);
      }
      /* istanbul ignore else */
      if (str[_i] === ";") {
        property.semi = _i;
        property.end = _i + 1;
      } else if (str[rightVal] === ";") {
        property.semi = rightVal;
        property.end = property.semi + 1;
        doNothing = property.end;
      }
      if (!property.end) {
        property.end = _i;
      }
      pushProperty(property);
      propertyReset();
      if (!doNothing && (!str[_i] || str[_i].trim()) && str[_i] === ";") {
        doNothing = _i;
      }
    }
    /* istanbul ignore else */
    if (!doNothing &&
    property && property.valueStarts && !property.valueEnds) {
      if (
      !str[_i] ||
      R1 ||
      R2 || str[stringLeftRight.right(str, _i - 1)] === "!" ||
      ";}".includes(str[_i]) && (!attrib || !attrib.attribName || attrib.attribName !== "style") ||
      ";'\"".includes(str[_i]) && attrib && attrib.attribName === "style" &&
      ifQuoteThenAttrClosingQuote(_i) ||
      rightVal && !str[_i].trim() && (str.slice(_i, rightVal).includes("\n") || str.slice(_i, rightVal).includes("\r"))) {
        if (lastNonWhitespaceCharAt && (
        !"'\"".includes(str[_i]) ||
        !rightVal ||
        !"'\";".includes(str[rightVal]))) {
          property.valueEnds = lastNonWhitespaceCharAt + 1;
          property.value = str.slice(property.valueStarts, lastNonWhitespaceCharAt + 1);
        }
        if (str[_i] === ";") {
          property.semi = _i;
        } else if (
        str[_i] && !str[_i].trim() &&
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
        !R2 && str[stringLeftRight.right(str, _i - 1)] !== "!" &&
        !property.end) {
          property.end = _i;
        }
        if (property.end) {
          if (property.end > _i) {
            doNothing = property.end;
          }
          pushProperty(property);
          propertyReset();
        }
      } else if (str[_i] === ":" && property && property.colon && property.colon < _i && lastNonWhitespaceCharAt && property.colon + 1 < lastNonWhitespaceCharAt) {
        var split = [];
        if (stringLeftRight.right(str, property.colon)) {
          split = str.slice(stringLeftRight.right(str, property.colon), lastNonWhitespaceCharAt + 1).split(/\s+/);
        }
        if (split.length === 2) {
          property.valueEnds = property.valueStarts + split[0].length;
          property.value = str.slice(property.valueStarts, property.valueEnds);
          property.end = property.valueEnds;
          pushProperty(property);
          var whitespaceStarts = property.end;
          var newPropertyStarts = lastNonWhitespaceCharAt + 1 - split[1].length;
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
      } else if (str[_i] === "/" && str[rightVal] === "*") {
        /* istanbul ignore else */
        if (property.valueStarts && !property.valueEnds) {
          property.valueEnds = _i;
          property.value = str.slice(property.valueStarts, _i);
        }
        /* istanbul ignore else */
        if (!property.end) {
          property.end = _i;
        }
        pushProperty(property);
        propertyReset();
      }
    }
    if (!doNothing && property && property.start && !property.end && str[_i] === ";") {
      property.semi = _i;
      property.end = _i + 1;
      if (!property.propertyEnds) {
        property.propertyEnds = _i;
      }
      if (property.propertyStarts && property.propertyEnds && !property.property) {
        property.property = str.slice(property.propertyStarts, property.propertyEnds);
      }
      pushProperty(property);
      propertyReset();
      doNothing = _i;
    }
    /* istanbul ignore else */
    if (property && property.importantStarts && !property.importantEnds && str[_i] && !str[_i].trim()) {
      property.importantEnds = _i;
      property.important = str.slice(property.importantStarts, _i);
    }
    /* istanbul ignore else */
    if (!doNothing && property && property.valueEnds && !property.importantStarts && (
    str[_i] === "!" ||
    isLatinLetter(str[_i]) && str.slice(_i).match(importantStartsRegexp))) {
      property.importantStarts = _i;
      if (
      str[_i - 1] && str[_i - 1].trim() &&
      str[_i - 2] && !str[_i - 2].trim() ||
      str[_i - 1] === "1" &&
      str[_i - 2] && !/\d/.test(str[_i - 2])) {
        property.valueEnds = stringLeftRight.left(str, _i - 1) + 1;
        property.value = str.slice(property.valueStarts, property.valueEnds);
        property.importantStarts--;
        property.important = str[_i - 1] + property.important;
      }
    }
    /* istanbul ignore else */
    if (!doNothing && property && property.colon && !property.valueStarts && str[_i] && str[_i].trim()) {
      /* istanbul ignore else */
      if (
      ";}'\"".includes(str[_i]) &&
      ifQuoteThenAttrClosingQuote(_i)) {
        /* istanbul ignore else */
        if (str[_i] === ";") {
          property.semi = _i;
        }
        var temp;
        /* istanbul ignore else */
        if (!property.end) {
          property.end = property.semi ? property.semi + 1 : stringLeftRight.left(str, _i) + 1;
          temp = property.end;
        }
        pushProperty(property);
        propertyReset();
        /* istanbul ignore else */
        if (temp && temp < _i) {
          pushProperty({
            type: "text",
            start: temp,
            end: _i,
            value: str.slice(temp, _i)
          });
        }
      } else if (str[_i] === "!") {
        property.importantStarts = _i;
      } else {
        property.valueStarts = _i;
      }
    }
    if (!doNothing && str[_i] === "{" && str[_i + 1] === "{" && property && property.valueStarts && !property.valueEnds && str.indexOf("}}", _i) > 0) {
      doNothing = str.indexOf("}}") + 2;
    }
    if (!doNothing && token.type === "rule" && str[_i] && str[_i].trim() && !"{}".includes(str[_i]) && !selectorChunkStartedAt && !token.openingCurlyAt) {
      if (!",".includes(str[_i])) {
        selectorChunkStartedAt = _i;
        if (token.selectorsStart === null) {
          token.selectorsStart = _i;
        }
      } else {
        token.selectorsEnd = _i + 1;
      }
    }
    if (!doNothing &&
    property && property.propertyStarts && property.propertyStarts < _i && !property.propertyEnds && (
    !str[_i] ||
    !str[_i].trim() ||
    !attrNameRegexp.test(str[_i]) && (
    str[_i] === ":" ||
    !rightVal || !":/}".includes(str[rightVal]) ||
    str[_i] === "}" && str[rightVal] === "}") ||
    str[_i] === "!") && (
    str[_i] !== "/" || str[_i - 1] !== "/")) {
      property.propertyEnds = _i;
      property.property = str.slice(property.propertyStarts, _i);
      if (property.valueStarts) {
        property.end = _i;
      }
      if ("};".includes(str[_i]) ||
      str[_i] && !str[_i].trim() && str[rightVal] !== ":") {
        if (str[_i] === ";") {
          property.semi = _i;
        }
        if (!property.end) {
          property.end = property.semi ? property.semi + 1 : _i;
        }
        pushProperty(property);
        propertyReset();
      }
      if (
      str[_i] && str[_i].trim() &&
      attrNameRegexp.test(str[property.propertyStarts]) &&
      !attrNameRegexp.test(str[_i]) &&
      !":'\"".includes(str[_i])) {
        var nextSemi = str.indexOf(";", _i);
        var nextColon = str.indexOf(":", _i);
        if (
        (nextColon === -1 && nextSemi !== -1 || !(nextColon !== -1 && nextSemi !== -1 && nextColon < nextSemi)) && !"{}".includes(str[_i]) && rightVal && (
        !"!".includes(str[_i]) || isLatinLetter(str[rightVal]))) {
          property.colon = _i;
          property.valueStarts = rightVal;
        } else if (nextColon !== -1 && nextSemi !== -1 && nextColon < nextSemi) {
          property.propertyEnds = null;
        } else if (str[_i] === "!") {
          property.importantStarts = _i;
        }
      }
    }
    if (!doNothing &&
    property && property.propertyEnds && !property.valueStarts && str[_i] === ":") {
      property.colon = _i;
      if (!rightVal) {
        property.end = _i + 1;
        if (str[_i + 1]) {
          pushProperty(property);
          propertyReset();
          if (token.properties) {
            token.properties.push({
              type: "text",
              start: _i + 1,
              end: null,
              value: null
            });
            doNothing = _i + 1;
          }
        }
      }
      if (property.propertyEnds && lastNonWhitespaceCharAt && property.propertyEnds !== lastNonWhitespaceCharAt + 1 &&
      !attrNameRegexp.test(str[property.propertyEnds])) {
        property.propertyEnds = lastNonWhitespaceCharAt + 1;
        property.property = str.slice(property.propertyStarts, property.propertyEnds);
      }
    }
    if (!doNothing && token.type === "rule" && str[_i] && str[_i].trim() &&
    !"{}".includes(str[_i]) &&
    token.selectorsEnd && token.openingCurlyAt && !property.propertyStarts && !property.importantStarts) {
      if (Array.isArray(token.properties) && token.properties.length && token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].end) {
        token.properties[~-token.properties.length].end = _i;
        token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, _i);
      }
      if (str[_i] === ";") {
        initProperty({
          start: _i,
          end: _i + 1,
          semi: _i
        });
        pushProperty(property);
        propertyReset();
      } else if (str[_i] === "!") {
        initProperty({
          start: _i,
          importantStarts: _i
        });
      } else {
        initProperty(_i);
      }
      doNothing = _i;
    }
    if (!doNothing &&
    attrib && attrib.attribName === "style" &&
    attrib.attribOpeningQuoteAt && !attrib.attribClosingQuoteAt &&
    !property.start &&
    str[_i] && str[_i].trim() &&
    !"'\"".includes(str[_i]) &&
    !lastLayerIs("block")) {
      if (
      str[_i] === "/" &&
      str[rightVal] === "*") {
        attribPush({
          type: "comment",
          start: _i,
          end: rightVal + 1,
          value: str.slice(_i, rightVal + 1),
          closing: false,
          kind: "block",
          language: "css"
        });
        layers.push({
          type: "block",
          value: str.slice(_i, rightVal + 1),
          position: _i
        });
        doNothing = rightVal + 1;
      }
      else if (str[_i] === "*" && str[rightVal] === "/") {
          closingComment(_i);
        } else {
          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = _i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, _i);
          }
          if (str[_i] === ";") {
            initProperty({
              start: _i,
              end: _i + 1,
              semi: _i
            });
            doNothing = _i;
          } else if (R2) {
            initProperty({
              start: _i,
              importantStarts: _i
            });
          } else {
            initProperty(_i);
          }
        }
    }
    if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
      if (str[_i] === "[") ;
    }
    if (!doNothing) {
      if (token.type === "tag" && !layers.length && str[_i] === ">") {
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end);
      } else if (token.type === "comment" && token.language === "html" && !layers.length && token.kind === "simple" && (str[token.start] === "<" && str[_i] === "-" && (stringMatchLeftRight.matchLeft(str, _i, "!-", {
        trimBeforeMatching: true
      }) || stringMatchLeftRight.matchLeftIncl(str, _i, "!-", {
        trimBeforeMatching: true
      }) && str[_i + 1] !== "-") || str[token.start] === "-" && str[_i] === ">" && stringMatchLeftRight.matchLeft(str, _i, "--", {
        trimBeforeMatching: true,
        maxMismatches: 1
      }))) {
        if (str[_i] === "-" && (stringMatchLeftRight.matchRight(str, _i, ["[if", "(if", "{if"], {
          i: true,
          trimBeforeMatching: true
        }) || stringMatchLeftRight.matchRight(str, _i, ["if"], {
          i: true,
          trimBeforeMatching: true
        }) && (
        xBeforeYOnTheRight(str, _i, "]", ">") ||
        str.includes("mso", _i) && !str.slice(_i, str.indexOf("mso")).includes("<") && !str.slice(_i, str.indexOf("mso")).includes(">")))) {
          token.kind = "only";
        } else if (
        str[token.start] !== "-" && stringMatchLeftRight.matchRightIncl(str, _i, ["-<![endif"], {
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
          token.end = _i + 1;
          if (str[leftVal] === "!" && str[rightVal] === "-") {
            token.end = rightVal + 1;
          }
          token.value = str.slice(token.start, token.end);
        }
      } else if (token.type === "comment" && token.language === "html" && str[_i] === ">" && (!layers.length || str[rightVal] === "<")) {
        if (Array.isArray(layers) && layers.length && layers[~-layers.length].value === "[") {
          layers.pop();
        }
        if (!["simplet", "not"].includes(token.kind) && stringMatchLeftRight.matchRight(str, _i, ["<!-->", "<!---->"], {
          trimBeforeMatching: true,
          maxMismatches: 1,
          lastMustMatch: true
        })) {
          token.kind = "not";
        } else {
          token.end = _i + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (token.type === "comment" && token.language === "css" && str[_i] === "*" && str[_i + 1] === "/") {
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end);
      } else if (token.type === "esp" && token.end === null && typeof token.head === "string" && typeof token.tail === "string" && token.tail.includes(str[_i])) {
        var wholeEspTagClosing = "";
        for (var _y2 = _i; _y2 < len; _y2++) {
          if (espChars.includes(str[_y2])) {
            wholeEspTagClosing += str[_y2];
          } else {
            break;
          }
        }
        if (wholeEspTagClosing.length > token.head.length) {
          var headsFirstChar = token.head[0];
          if (wholeEspTagClosing.endsWith(token.head)) {
            token.end = _i + wholeEspTagClosing.length - token.head.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = _i + token.tail.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (!token.tail.includes(headsFirstChar) && wholeEspTagClosing.includes(headsFirstChar) || wholeEspTagClosing.endsWith(token.head) || wholeEspTagClosing.startsWith(token.tail)) {
            var firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(0, wholeEspTagClosing.indexOf(headsFirstChar));
            var secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(wholeEspTagClosing.indexOf(headsFirstChar));
            if (firstPartOfWholeEspTagClosing.length && secondPartOfWholeEspTagClosing.length && token.tail.split("").every(function (char) {
              return firstPartOfWholeEspTagClosing.includes(char);
            })) {
              token.end = _i + firstPartOfWholeEspTagClosing.length;
              token.value = str.slice(token.start, token.end);
              doNothing = token.end;
            }
          } else {
            token.end = _i + wholeEspTagClosing.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          }
        } else {
          token.end = _i + wholeEspTagClosing.length;
          token.value = str.slice(token.start, token.end);
          if (lastLayerIs("esp")) {
            layers.pop();
          }
          doNothing = token.end;
        }
      }
    }
    if (!doNothing && token.type === "tag" && token.tagNameStartsAt && !token.tagNameEndsAt) {
      if (!str[_i] || !charSuitableForTagName(str[_i])) {
        token.tagNameEndsAt = _i;
        token.tagName = str.slice(token.tagNameStartsAt, _i).toLowerCase();
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
        doNothing = _i;
      }
    }
    if (!doNothing && token.type === "tag" && !token.tagNameStartsAt && token.start != null && (token.start < _i || str[token.start] !== "<")) {
      if (str[_i] === "/") {
        token.closing = true;
        doNothing = _i;
      } else if (isLatinLetter(str[_i])) {
        token.tagNameStartsAt = _i;
        if (!token.closing) {
          token.closing = false;
          doNothing = _i;
        }
      } else ;
    }
    if (!doNothing && token.type === "tag" && token.kind !== "cdata" && attrib.attribNameStartsAt && _i > attrib.attribNameStartsAt && attrib.attribNameEndsAt === null && !isCharSuitableForHtmlAttrName.isAttrNameChar(str[_i])) {
      attrib.attribNameEndsAt = _i;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, _i);
      attrib.attribNameRecognised = htmlAllKnownAttributes.allHtmlAttribs.has(attrib.attribName);
      if (attrib.attribName.startsWith("mc:")) {
        token.pureHTML = false;
      }
      if (str[_i] && !str[_i].trim() && str[rightVal] === "=") ; else if (str[_i] && !str[_i].trim() || str[_i] === ">" || str[_i] === "/" && str[rightVal] === ">") {
        if ("'\"".includes(str[rightVal])) ; else {
          attrib.attribEnds = _i;
          token.attribs.push(clone__default['default'](attrib));
          attribReset();
        }
      }
    }
    if (!doNothing && str[_i] && token.type === "tag" && token.kind !== "cdata" && token.tagNameEndsAt && _i > token.tagNameEndsAt && attrib.attribStarts === null && isCharSuitableForHtmlAttrName.isAttrNameChar(str[_i])) {
      attrib.attribStarts = _i;
      attrib.attribLeft = lastNonWhitespaceCharAt;
      attrib.attribNameStartsAt = _i;
    }
    if (!doNothing && token.type === "rule") {
      if (str[_i] === "{" && str[_i + 1] !== "{" && str[_i - 1] !== "{" && !token.openingCurlyAt) {
        token.openingCurlyAt = _i;
      } else if (str[_i] === "}" && token.openingCurlyAt && !token.closingCurlyAt) {
        token.closingCurlyAt = _i;
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end);
        if (Array.isArray(token.properties) && token.properties.length && token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].end) {
          token.properties[~-token.properties.length].end = _i;
          token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, _i);
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
      if (str[_i] === "*" && str[rightVal] === "/") {
        closingComment(_i);
      }
    }
    if (
    !doNothing &&
    attrib &&
    attrib.attribValueStartsAt && !attrib.attribValueEndsAt &&
    !property.propertyStarts &&
    _i >= attrib.attribValueStartsAt &&
    Array.isArray(attrib.attribValue) && (!attrib.attribValue.length ||
    attrib.attribValue[~-attrib.attribValue.length].end &&
    attrib.attribValue[~-attrib.attribValue.length].end <= _i) ||
    !doNothing &&
    token.type === "rule" &&
    token.openingCurlyAt &&
    !token.closingCurlyAt &&
    !property.propertyStarts) {
      if (str[_i] === ";" && (
      attrib && Array.isArray(attrib.attribValue) && attrib.attribValue.length &&
      attrib.attribValue[~-attrib.attribValue.length].semi &&
      attrib.attribValue[~-attrib.attribValue.length].semi < _i ||
      token && token.type === "rule" && Array.isArray(token.properties) && token.properties.length && token.properties[~-token.properties.length].semi && token.properties[~-token.properties.length].semi < _i)) {
        initProperty({
          start: _i,
          semi: _i
        });
        doNothing = _i + 1;
      }
      else if (
        str[_i] && !str[_i].trim() ||
        lastLayerIs("block")) {
          if (attrib.attribName) {
            attrib.attribValue.push({
              type: "text",
              start: _i,
              end: null,
              value: null
            });
          } else if (token.type === "rule" && (
          !Array.isArray(token.properties) || !token.properties.length ||
          token.properties[~-token.properties.length].end)) {
            token.properties.push({
              type: "text",
              start: _i,
              end: null,
              value: null
            });
          }
        }
    }
    if (!doNothing && token.type === "tag" && attrib.attribValueStartsAt && _i >= attrib.attribValueStartsAt && attrib.attribValueEndsAt === null) {
      if (SOMEQUOTE.includes(str[_i])) {
        if (
        !layers.some(function (layerObj) {
          return layerObj.type === "esp";
        }) && (
        !str[_i] ||
        !str.includes(">", _i) ||
        isHtmlAttributeClosing.isAttrClosing(str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, _i))) {
          attrib.attribClosingQuoteAt = _i;
          attrib.attribValueEndsAt = _i;
          if (attrib.attribValueStartsAt) {
            attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, _i);
          }
          attrib.attribEnds = _i + 1;
          if (property.propertyStarts) {
            attrib.attribValue.push(clone__default['default'](property));
            propertyReset();
          }
          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
            if (!attrib.attribValue[~-attrib.attribValue.length].property) {
              attrib.attribValue[~-attrib.attribValue.length].end = _i;
              attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, _i);
            }
          }
          if (str[attrib.attribOpeningQuoteAt] !== str[_i]) {
            layers.pop();
            layers.pop();
          }
          if (attrib.attribValue[~-attrib.attribValue.length] && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = _i;
          }
          token.attribs.push(clone__default['default'](attrib));
          attribReset();
        } else if ((!Array.isArray(attrib.attribValue) || !attrib.attribValue.length ||
        attrib.attribValue[~-attrib.attribValue.length].type !== "text") && !property.propertyStarts) {
          attrib.attribValue.push({
            type: "text",
            start: _i,
            end: null,
            value: null
          });
        }
      } else if (attrib.attribOpeningQuoteAt === null && (str[_i] && !str[_i].trim() || ["/", ">"].includes(str[_i]) || espChars.includes(str[_i]) && espChars.includes(str[_i + 1]))) {
        attrib.attribValueEndsAt = _i;
        attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, _i);
        if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
          attrib.attribValue[~-attrib.attribValue.length].end = _i;
          attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, attrib.attribValue[~-attrib.attribValue.length].end);
        }
        attrib.attribEnds = _i;
        token.attribs.push(clone__default['default'](attrib));
        attribReset();
        layers.pop();
        if (str[_i] === ">") {
          token.end = _i + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (str[_i] === "=" && leftVal !== null && rightVal && ("'\"".includes(str[rightVal]) || str[~-_i] && isLatinLetter(str[~-_i])) &&
      !(attrib && attrib.attribOpeningQuoteAt && (
      /\//.test(str.slice(attrib.attribOpeningQuoteAt + 1, _i)) ||
      /mailto:/.test(str.slice(attrib.attribOpeningQuoteAt + 1, _i)) ||
      /\w\?\w/.test(str.slice(attrib.attribOpeningQuoteAt + 1, _i))))) {
        var whitespaceFound;
        var attribClosingQuoteAt;
        for (var _y3 = leftVal; _y3 >= attrib.attribValueStartsAt; _y3--) {
          if (!whitespaceFound && str[_y3] && !str[_y3].trim()) {
            whitespaceFound = true;
            if (attribClosingQuoteAt) {
              str.slice(_y3, attribClosingQuoteAt);
            }
          }
          if (whitespaceFound && str[_y3] && str[_y3].trim()) {
            whitespaceFound = false;
            if (!attribClosingQuoteAt) {
              attribClosingQuoteAt = _y3 + 1;
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
          if (str[attrib.attribOpeningQuoteAt] !== str[_i]) {
            layers.pop();
          }
          token.attribs.push(clone__default['default'](attrib));
          attribReset();
          _i = ~-attribClosingQuoteAt;
          i = _i;
          return "continue";
        } else if (attrib.attribOpeningQuoteAt && ("'\"".includes(str[rightVal]) || htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(attrib.attribOpeningQuoteAt + 1, _i).trim()))) {
          _i = attrib.attribOpeningQuoteAt;
          attrib.attribEnds = attrib.attribOpeningQuoteAt + 1;
          attrib.attribValueStartsAt = null;
          layers.pop();
          token.attribs.push(clone__default['default'](attrib));
          attribReset();
          i = _i;
          return "continue";
        }
      } else if (str[_i] === "/" && str[rightVal] === ">") {
        if (attrib.attribValueStartsAt) {
          attrib.attribValueStartsAt = null;
        }
        if (!attrib.attribEnds) {
          attrib.attribEnds = _i;
        }
      } else if (attrib && attrib.attribName !== "style" && attrib.attribStarts && !attrib.attribEnds && !property.propertyStarts && (
      !Array.isArray(attrib.attribValue) ||
      !attrib.attribValue.length ||
      attrib.attribValue[~-attrib.attribValue.length].end && attrib.attribValue[~-attrib.attribValue.length].end <= _i)) {
        attrib.attribValue.push({
          type: "text",
          start: _i,
          end: null,
          value: null
        });
      }
    } else if (token.type === "esp" && attribToBackup && parentTokenToBackup && attribToBackup.attribOpeningQuoteAt && attribToBackup.attribValueStartsAt && "'\"".includes(str[_i]) && str[attribToBackup.attribOpeningQuoteAt] === str[_i] && isHtmlAttributeClosing.isAttrClosing(str, attribToBackup.attribOpeningQuoteAt, _i)) {
      token.end = _i;
      token.value = str.slice(token.start, _i);
      if (attribToBackup && !Array.isArray(attribToBackup.attribValue)) {
        attribToBackup.attribValue = [];
      }
      attribToBackup.attribValue.push(token);
      attribToBackup.attribValueEndsAt = _i;
      attribToBackup.attribValueRaw = str.slice(attribToBackup.attribValueStartsAt, _i);
      attribToBackup.attribClosingQuoteAt = _i;
      attribToBackup.attribEnds = _i + 1;
      token = clone__default['default'](parentTokenToBackup);
      token.attribs.push(attribToBackup);
      attribToBackup = undefined;
      parentTokenToBackup = undefined;
      layers.pop();
      layers.pop();
      layers.pop();
    }
    if (!doNothing && token.type === "tag" && !attrib.attribValueStartsAt && attrib.attribNameEndsAt && attrib.attribNameEndsAt <= _i && str[_i] && str[_i].trim()) {
      if (str[_i] === "=" && !SOMEQUOTE.includes(str[rightVal]) && !"=".includes(str[rightVal]) && !espChars.includes(str[rightVal])
      ) {
          var firstQuoteOnTheRightIdx = SOMEQUOTE.split("").map(function (quote) {
            return str.indexOf(quote, rightVal);
          }).filter(function (val) {
            return val > 0;
          }).length ? Math.min.apply(Math, SOMEQUOTE.split("").map(function (quote) {
            return str.indexOf(quote, rightVal);
          }).filter(function (val) {
            return val > 0;
          })) : undefined;
          if (
          rightVal &&
          str.slice(rightVal).includes("=") &&
          htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(rightVal, rightVal + str.slice(rightVal).indexOf("=")).trim().toLowerCase())) {
            attrib.attribEnds = _i + 1;
            token.attribs.push(_objectSpread__default['default']({}, attrib));
            attribReset();
          } else if (
          !firstQuoteOnTheRightIdx ||
          str.slice(rightVal, firstQuoteOnTheRightIdx).includes("=") ||
          !str.includes(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1) ||
          Array.from(str.slice(firstQuoteOnTheRightIdx + 1, str.indexOf(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1))).some(function (char) {
            return "<>=".includes(char);
          })) {
            attrib.attribValueStartsAt = rightVal;
            layers.push({
              type: "simple",
              value: null,
              position: attrib.attribValueStartsAt
            });
          }
        } else if (SOMEQUOTE.includes(str[_i])) {
        var nextCharIdx = rightVal;
        if (
        nextCharIdx &&
        SOMEQUOTE.includes(str[nextCharIdx]) &&
        str[_i] !== str[nextCharIdx] &&
        str.length > nextCharIdx + 2 &&
        str.slice(nextCharIdx + 1).includes(str[nextCharIdx]) && (
        !str.indexOf(str[nextCharIdx], nextCharIdx + 1) || !stringLeftRight.right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1)) || str[_i] !== str[stringLeftRight.right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1))]) &&
        !Array.from(str.slice(nextCharIdx + 1, str.indexOf(str[nextCharIdx]))).some(function (char) {
          return ("<>=" + str[_i]).includes(char);
        })) {
          layers.pop();
        } else {
          if (!attrib.attribOpeningQuoteAt) {
            attrib.attribOpeningQuoteAt = _i;
            if (
            str[_i + 1] && (
            str[_i + 1] !== str[_i] ||
            !ifQuoteThenAttrClosingQuote(_i + 1))) {
              attrib.attribValueStartsAt = _i + 1;
            }
          } else {
            /* istanbul ignore else */
            if (isHtmlAttributeClosing.isAttrClosing(str, attrib.attribOpeningQuoteAt, _i)) {
              attrib.attribClosingQuoteAt = _i;
            }
            /* istanbul ignore else */
            if (attrib.attribOpeningQuoteAt && attrib.attribClosingQuoteAt) {
              if (attrib.attribOpeningQuoteAt < ~-attrib.attribClosingQuoteAt) {
                attrib.attribValueRaw = str.slice(attrib.attribOpeningQuoteAt + 1, attrib.attribClosingQuoteAt);
              } else {
                attrib.attribValueRaw = "";
              }
              attrib.attribEnds = _i + 1;
              token.attribs.push(clone__default['default'](attrib));
              attribReset();
            }
          }
        }
      }
    }
    if (!doNothing && str[_i] === ">" &&
    str[_i - 1] !== "%" && token.type === "tag" && attrib.attribStarts && !attrib.attribEnds) {
      var thisIsRealEnding = false;
      if (str[_i + 1]) {
        for (var _y4 = _i + 1; _y4 < len; _y4++) {
          if (attrib.attribOpeningQuoteAt && str[_y4] === str[attrib.attribOpeningQuoteAt]) {
            if (_y4 !== _i + 1 && str[~-_y4] !== "=") {
              thisIsRealEnding = true;
            }
            break;
          } else if (str[_y4] === ">") {
            break;
          } else if (str[_y4] === "<") {
            thisIsRealEnding = true;
            layers.pop();
            break;
          } else if (!str[_y4 + 1]) {
            thisIsRealEnding = true;
            break;
          }
        }
      } else {
        thisIsRealEnding = true;
      }
      if (thisIsRealEnding) {
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end);
        if (attrib.attribValueStartsAt && _i && attrib.attribValueStartsAt < _i && str.slice(attrib.attribValueStartsAt, _i).trim()) {
          attrib.attribValueEndsAt = _i;
          attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, _i);
          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = _i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, _i);
          }
        } else {
          attrib.attribValueStartsAt = null;
        }
        if (attrib.attribEnds === null) {
          attrib.attribEnds = _i;
        }
        if (attrib) {
          token.attribs.push(clone__default['default'](attrib));
          attribReset();
        }
      }
    }
    if (str[_i] && opts.charCb) {
      pingCharCb({
        type: token.type,
        chr: str[_i],
        i: _i
      });
    }
    if (!str[_i] && token.start !== null) {
      token.end = _i;
      token.value = str.slice(token.start, token.end);
      if (attrib && attrib.attribName) {
        if (!attrib.attribEnds) {
          attrib.attribEnds = _i;
        }
        token.attribs.push(_objectSpread__default['default']({}, attrib));
        attribReset();
      }
      if (token && Array.isArray(token.properties) && token.properties.length && !token.properties[~-token.properties.length].end) {
        token.properties[~-token.properties.length].end = _i;
        if (token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].value) {
          token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, _i);
        }
      }
      if (property && property.propertyStarts) {
        if (!property.end) {
          property.end = _i;
        }
        pushProperty(property);
        propertyReset();
      }
      pingTagCb(token);
    }
    if (str[_i] && str[_i].trim()) {
      lastNonWhitespaceCharAt = _i;
    }
    i = _i;
  };
  for (var i = 0; i <= len; i++) {
    var _ret = _loop(i);
    if (_ret === "continue") continue;
  }
  if (charStash.length) {
    for (var _i2 = 0, len2 = charStash.length; _i2 < len2; _i2++) {
      reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
    }
  }
  if (tagStash.length) {
    for (var _i3 = 0, _len = tagStash.length; _i3 < _len; _i3++) {
      reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
    }
  }
  var timeTakenInMilliseconds = Date.now() - start;
  return {
    timeTakenInMilliseconds: timeTakenInMilliseconds
  };
}
var util = {
  matchLayerLast: matchLayerLast
};

exports.defaults = defaults;
exports.tokenizer = tokenizer;
exports.util = util;
exports.version = version;
