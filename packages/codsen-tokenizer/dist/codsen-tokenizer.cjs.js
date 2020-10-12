/**
 * codsen-tokenizer
 * HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 * Version: 3.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/codsen-tokenizer/
 */

'use strict';

var stringMatchLeftRight = require('string-match-left-right');
var clone = require('lodash.clonedeep');
var stringLeftRight = require('string-left-right');
var attributeEnds = require('is-html-attribute-closing');
var htmlAllKnownAttributes = require('html-all-known-attributes');
var charSuitableForHTMLAttrName = require('is-char-suitable-for-html-attr-name');
var isTagOpening = require('is-html-tag-opening');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var attributeEnds__default = /*#__PURE__*/_interopDefaultLegacy(attributeEnds);
var charSuitableForHTMLAttrName__default = /*#__PURE__*/_interopDefaultLegacy(charSuitableForHTMLAttrName);
var isTagOpening__default = /*#__PURE__*/_interopDefaultLegacy(isTagOpening);

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var allHTMLTagsKnownToHumanity = new Set(["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"]);
var espChars = "{}%-$_()*|#";
var veryEspChars = "{}()|#";
var notVeryEspChars = "%$_*#";
var espLumpBlacklist = [")|(", "|(", ")(", "()", "}{", "{}", "%)", "*)"];
var punctuationChars = ".,;!?";
function isStr(something) {
  return typeof something === "string";
}
function isLatinLetter(char) {
  return isStr(char) && char.length === 1 && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
}
function charSuitableForTagName(char) {
  return /[.\-_a-z0-9\u00B7\u00C0-\uFFFD]/i.test(char);
}
function flipEspTag(str) {
  var res = "";
  for (var i = 0, len = str.length; i < len; i++) {
    if (str[i] === "[") {
      res = "]".concat(res);
    } else if (str[i] === "]") {
      res = "[".concat(res);
    } else if (str[i] === "{") {
      res = "}".concat(res);
    } else if (str[i] === "}") {
      res = "{".concat(res);
    } else if (str[i] === "(") {
      res = ")".concat(res);
    } else if (str[i] === ")") {
      res = "(".concat(res);
    } else if (str[i] === "<") {
      res = ">".concat(res);
    } else if (str[i] === ">") {
      res = "<".concat(res);
    } else {
      res = "".concat(str[i]).concat(res);
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

function getWholeEspTagLumpOnTheRight(str, i, layers) {
  var wholeEspTagLumpOnTheRight = str[i];
  var len = str.length;
  for (var y = i + 1; y < len; y++) {
    if (
    wholeEspTagLumpOnTheRight.length > 1 && (
    wholeEspTagLumpOnTheRight.includes("{") || wholeEspTagLumpOnTheRight.includes("[") || wholeEspTagLumpOnTheRight.includes("(")) &&
    str[y] === "(") {
      break;
    }
    if (espChars.includes(str[y]) || str[i] === "<" && str[y] === "/" ||
    str[y] === ">" && wholeEspTagLumpOnTheRight === "--" && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-") {
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
        uniqueCharsListFromGuessedClosingLumpArr = new Set(_toConsumableArray(uniqueCharsListFromGuessedClosingLumpArr).filter(function (el) {
          return el !== wholeEspTagLumpOnTheRight[_y];
        }));
      }
    };
    for (var _y = 0, len2 = wholeEspTagLumpOnTheRight.length; _y < len2; _y++) {
      var _ret = _loop(len2, _y);
      if (_typeof(_ret) === "object") return _ret.v;
    }
  }
  return wholeEspTagLumpOnTheRight;
}

function startsHtmlComment(str, i, token, layers) {
  return (
    str[i] === "<" && (stringMatchLeftRight.matchRight(str, i, ["!--"], {
      maxMismatches: 1,
      firstMustMatch: true,
      trimBeforeMatching: true
    }) || stringMatchLeftRight.matchRight(str, i, ["![endif]"], {
      i: true,
      maxMismatches: 2,
      trimBeforeMatching: true
    })) && !stringMatchLeftRight.matchRight(str, i, ["![cdata", "<"], {
      i: true,
      maxMismatches: 1,
      trimBeforeMatching: true
    }) && (token.type !== "comment" || token.kind !== "not") || str[i] === "-" && stringMatchLeftRight.matchRight(str, i, ["->"], {
      trimBeforeMatching: true
    }) && (token.type !== "comment" || !token.closing && token.kind !== "not") && !stringMatchLeftRight.matchLeft(str, i, "<", {
      trimBeforeMatching: true,
      trimCharsBeforeMatching: ["-", "!"]
    }) && (
    !Array.isArray(layers) || !layers.length || layers[layers.length - 1].type !== "esp" || !(layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-"))
  );
}

function startsCssComment(str, i, token, layers, withinStyle) {
  return (
    withinStyle && (
    str[i] === "/" && str[i + 1] === "*" ||
    str[i] === "*" && str[i + 1] === "/")
  );
}

function matchLayerLast(wholeEspTagLump, layers, matchFirstInstead) {
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
  })) {
    return wholeEspTagLump.length;
  }
}

var BACKSLASH = "\\";
function startsTag(str, i, token, layers) {
  return str[i] && str[i].trim().length && (!layers.length || token.type === "text") && !["doctype", "xml"].includes(token.kind) && (str[i] === "<" && (isTagOpening__default['default'](str, i, {
    allowCustomTagNames: true
  }) || str[stringLeftRight.right(str, i)] === ">" || stringMatchLeftRight.matchRight(str, i, ["doctype", "xml", "cdata"], {
    i: true,
    trimBeforeMatching: true,
    trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
  })) || isLatinLetter(str[i]) && (!str[i - 1] || !isLatinLetter(str[i - 1]) && !["<", "/", "!", BACKSLASH].includes(str[stringLeftRight.left(str, i)])) && isTagOpening__default['default'](str, i, {
    allowCustomTagNames: false,
    skipOpeningBracket: true
  })) && (token.type !== "esp" || token.tail && token.tail.includes(str[i]));
}

function startsEsp(str, i, token, layers, styleStarts) {
  var res =
  espChars.includes(str[i]) && str[i + 1] && espChars.includes(str[i + 1]) &&
  !(notVeryEspChars.includes(str[i]) && notVeryEspChars.includes(str[i + 1])) && (
  str[i] !== str[i + 1] || veryEspChars.includes(str[i])) && token.type !== "rule" && token.type !== "at" && !(str[i] === "-" && "-{(".includes(str[i + 1])) && !("})".includes(str[i]) && "-".includes(str[i + 1])) && !(
  str[i] === "%" && str[i + 1] === "%" && "0123456789".includes(str[i - 1]) && (!str[i + 2] || punctuationChars.includes(str[i + 2]) || !str[i + 2].trim().length)) && !(styleStarts && ("{}".includes(str[i]) || "{}".includes(str[stringLeftRight.right(str, i)]))) ||
  str[i] === "<" && (
  str[i + 1] === "/" && espChars.includes(str[i + 2]) ||
  espChars.includes(str[i + 1]) &&
  !["-"].includes(str[i + 1])) ||
  ">})".includes(str[i]) &&
  Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump.includes(flipEspTag(str[i])) && (
  str[i] !== ">" || !xBeforeYOnTheRight(str, i + 1, ">", "<")) ||
  str[i] === "-" && str[i + 1] === "-" && str[i + 2] === ">" && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-";
  return res;
}

function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
var voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
var inlineTags = new Set(["a", "abbr", "acronym", "audio", "b", "bdi", "bdo", "big", "br", "button", "canvas", "cite", "code", "data", "datalist", "del", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins", "kbd", "label", "map", "mark", "meter", "noscript", "object", "output", "picture", "progress", "q", "ruby", "s", "samp", "script", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "template", "textarea", "time", "u", "tt", "var", "video", "wbr"]);
var charsThatEndCSSChunks = ["{", "}", ","];
var BACKTICK = "\x60";
var attrNameRegexp = /[\w-]/;
function tokenizer(str, originalOpts) {
  var start = Date.now();
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as \"".concat(_typeof(str), "\", equal to:\n").concat(JSON.stringify(str, null, 4)));
    }
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ".concat(_typeof(originalOpts), ", equal to ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  if (isObj(originalOpts) && originalOpts.tagCb && typeof originalOpts.tagCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ".concat(_typeof(originalOpts.tagCb), ", equal to ").concat(JSON.stringify(originalOpts.tagCb, null, 4)));
  }
  if (isObj(originalOpts) && originalOpts.charCb && typeof originalOpts.charCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ".concat(_typeof(originalOpts.charCb), ", equal to ").concat(JSON.stringify(originalOpts.charCb, null, 4)));
  }
  if (isObj(originalOpts) && originalOpts.reportProgressFunc && typeof originalOpts.reportProgressFunc !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ".concat(_typeof(originalOpts.reportProgressFunc), ", equal to ").concat(JSON.stringify(originalOpts.reportProgressFunc, null, 4)));
  }
  var defaults = {
    tagCb: null,
    tagCbLookahead: 0,
    charCb: null,
    charCbLookahead: 0,
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  var currentPercentageDone;
  var lastPercentage = 0;
  var len = str.length;
  var midLen = Math.floor(len / 2);
  var doNothing;
  var withinStyle = false;
  var withinStyleComment = false;
  var tagStash = [];
  var charStash = [];
  var token = {};
  var tokenDefault = {
    type: null,
    start: null,
    end: null,
    value: null
  };
  function tokenReset() {
    token = clone__default['default'](tokenDefault);
    attribReset();
    return token;
  }
  var attrib = {};
  var attribDefault = {
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
    attribStarts: null,
    attribEnds: null,
    attribLeft: null
  };
  function attribReset() {
    attrib = clone__default['default'](attribDefault);
  }
  var property = null;
  var propertyDefault = {
    property: null,
    propertyStarts: null,
    propertyEnds: null,
    colon: null,
    value: null,
    valueStarts: null,
    valueEnds: null,
    semi: null
  };
  function propertyReset() {
    property = clone__default['default'](propertyDefault);
  }
  function pushProperty(p) {
    if (attrib && attrib.attribName === "style") {
      attrib.attribValue.push(clone__default['default'](p));
    } else if (token && Array.isArray(token.properties)) {
      token.properties.push(clone__default['default'](p));
    }
  }
  tokenReset();
  var selectorChunkStartedAt;
  var parentTokenToBackup;
  var attribToBackup;
  var lastNonWhitespaceCharAt;
  var layers = [];
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
    if (!["text", "esp"].includes(incomingToken.type) && incomingToken.start !== null && incomingToken.start < i && (str[~-i] && !str[~-i].trim() || str[i] === "<")) {
      incomingToken.end = stringLeftRight.left(str, i) + 1;
      incomingToken.value = str.slice(incomingToken.start, incomingToken.end);
      if (incomingToken.type === "tag" && !"/>".includes(str[~-incomingToken.end])) {
        var cutOffIndex = incomingToken.tagNameEndsAt || i;
        if (Array.isArray(incomingToken.attribs) && incomingToken.attribs.length) {
          for (var i2 = 0, len2 = incomingToken.attribs.length; i2 < len2; i2++) {
            if (incomingToken.attribs[i2].attribNameRecognised) {
              cutOffIndex = incomingToken.attribs[i2].attribEnds;
              if (str[cutOffIndex + 1] && !str[cutOffIndex].trim() && str[cutOffIndex + 1].trim()) {
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
        if (Array.isArray(layers) && layers.length && layers[~-layers.length].type === "at") {
          layers[~-layers.length].token.rules.push(token);
        } else {
          pingTagCb(token);
        }
      }
      tokenReset();
    }
  }
  function atRuleWaitingForClosingCurlie() {
    return layers.length && layers[~-layers.length].type === "at" && isObj(layers[~-layers.length].token) && layers[~-layers.length].token.openingCurlyAt && !layers[~-layers.length].token.closingCurlyAt;
  }
  function getNewToken(type) {
    var startVal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
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
    if (type === "text") {
      return {
        type: type,
        start: startVal,
        end: null,
        value: null
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
  }
  function initToken(type, startVal) {
    attribReset();
    token = getNewToken(type, startVal);
  }
  function initProperty(propertyStarts) {
    propertyReset();
    property.propertyStarts = propertyStarts;
  }
  function ifQuoteThenAttrClosingQuote(idx) {
    return !"'\"".includes(str[idx]) ||
    !(attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt) ||
    attributeEnds__default['default'](str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, idx);
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
    if (withinStyle && token.type && !["rule", "at", "text", "comment"].includes(token.type)) {
      withinStyle = false;
    }
    if (doNothing && _i >= doNothing) {
      doNothing = false;
    }
    if (isLatinLetter(str[_i]) && isLatinLetter(str[~-_i]) && isLatinLetter(str[_i + 1])) {
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
        if (token.type === null || token.type === "text" || token.type === "rule" && token.openingCurlyAt === null) {
          if (token.type === "rule") {
            token.end = stringLeftRight.left(str, _i) + 1;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token);
            if (Array.isArray(layers) && layers.length && layers[~-layers.length].type === "at") {
              layers[~-layers.length].token.rules.push(token);
            }
            tokenReset();
            if (stringLeftRight.left(str, _i) < ~-_i) {
              initToken("text", stringLeftRight.left(str, _i) + 1);
            }
          }
          dumpCurrentToken(token, _i);
          var poppedToken = layers.pop();
          token = poppedToken.token;
          token.closingCurlyAt = _i;
          token.end = _i + 1;
          token.value = str.slice(token.start, token.end);
          pingTagCb(token);
          if (Array.isArray(layers) && layers.length && layers[~-layers.length].type === "at") {
            layers[~-layers.length].token.rules.push(token);
          }
          tokenReset();
          doNothing = _i + 1;
        }
      } else if (token.type === "text" && str[_i] && str[_i].trim()) {
        token.end = _i;
        token.value = str.slice(token.start, token.end);
        if (Array.isArray(layers) && layers.length && layers[~-layers.length].type === "at") {
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
      if (["tag", "rule", "at"].includes(token.type) && token.kind !== "cdata") {
        if (["\"", "'", "(", ")"].includes(str[_i]) && !(
        ["\"", "'", "`"].includes(str[stringLeftRight.left(str, _i)]) && str[stringLeftRight.left(str, _i)] === str[stringLeftRight.right(str, _i)]) &&
        ifQuoteThenAttrClosingQuote(_i)
        ) {
            if (
            Array.isArray(layers) && layers.length && layers[~-layers.length].type === "simple" && layers[~-layers.length].value === flipEspTag(str[_i])) {
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
          Array.isArray(layers) && layers.length && layers[~-layers.length].type === "simple" && layers[~-layers.length].value === flipEspTag(str[_i])) {
            layers.pop();
          } else {
            layers.push({
              type: "simple",
              value: str[_i],
              position: _i
            });
          }
        }
      } else if (token.type === "esp" && "'\"".concat(BACKTICK, "()").includes(str[_i]) && !(
      ["\"", "'", "`"].includes(str[stringLeftRight.left(str, _i)]) && str[stringLeftRight.left(str, _i)] === str[stringLeftRight.right(str, _i)])) {
        if (
        Array.isArray(layers) && layers.length && layers[~-layers.length].type === "simple" && layers[~-layers.length].value === flipEspTag(str[_i])) {
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
    if (!doNothing && token.type === "at" && token.queryStartsAt != null && !token.queryEndsAt && "{;".includes(str[_i])) {
      if (str[_i] === "{") {
        if (str[~-_i] && str[~-_i].trim()) {
          token.queryEndsAt = _i;
        } else {
          token.queryEndsAt = stringLeftRight.left(str, _i) + 1;
        }
      } else {
        token.queryEndsAt = stringLeftRight.left(str, _i + 1);
      }
      token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
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
    if (!doNothing && token.type === "at" && token.identifierStartsAt != null && _i >= token.start && str[_i] && (!str[_i].trim() || "()".includes(str[_i])) && !token.identifierEndsAt) {
      token.identifierEndsAt = _i;
      token.identifier = str.slice(token.identifierStartsAt, _i);
    }
    if (token.type === "rule" && selectorChunkStartedAt && (charsThatEndCSSChunks.includes(str[_i]) || str[_i] && !str[_i].trim() && charsThatEndCSSChunks.includes(str[stringLeftRight.right(str, _i)]))) {
      token.selectors.push({
        value: str.slice(selectorChunkStartedAt, _i),
        selectorStarts: selectorChunkStartedAt,
        selectorEnds: _i
      });
      selectorChunkStartedAt = undefined;
      token.selectorsEnd = _i;
    }
    if (!doNothing && str[_i]) {
      if (startsTag(str, _i, token, layers)) {
        if (token.type && token.start !== null) {
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
        for (var y = stringLeftRight.right(str, _i); y < len; y++) {
          if (!letterMet && str[y].trim() && str[y].toUpperCase() !== str[y].toLowerCase()) {
            letterMet = true;
          }
          if (
          letterMet && (
          !str[y].trim() ||
          !/\w/.test(str[y]) && !badCharacters.includes(str[y]) || str[y] === "[")
          ) {
              break;
            } else if (!badCharacters.includes(str[y])) {
            extractedTagName += str[y].trim().toLowerCase();
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
        }
      } else if (startsHtmlComment(str, _i, token, layers)) {
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
      } else if (startsCssComment(str, _i, token, layers, withinStyle)) {
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
      } else if (startsEsp(str, _i, token, layers, withinStyle) && (
      !Array.isArray(layers) || !layers.length ||
      layers[~-layers.length].type !== "simple" || !["'", "\""].includes(layers[~-layers.length].value) ||
      attrib && attrib.attribStarts && !attrib.attribEnds)) {
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
              }
              doNothing = token.tailEndsAt;
              if (parentTokenToBackup) {
                if (!Array.isArray(parentTokenToBackup.attribs)) {
                  parentTokenToBackup.attribs.length = 0;
                }
                if (attribToBackup) {
                  attrib = attribToBackup;
                  attrib.attribValue.push(clone__default['default'](token));
                } else {
                  parentTokenToBackup.attribs.push(clone__default['default'](token));
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
          lengthOfClosingEspChunk = matchLayerLast(wholeEspTagLumpOnTheRight, layers, "matchFirst"))) {
            if (token.type === "esp") {
              if (!token.end) {
                token.end = _i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
              }
              dumpCurrentToken(token, _i);
              tokenReset();
            }
            layers.length = 0;
          } else if (
          attrib && attrib.attribValue && attrib.attribValue.length && Array.from(str.slice(attrib.attribValue[~-attrib.attribValue.length].start, _i)).some(function (char, idx) {
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
            if (Array.isArray(layers) && layers.length && layers[~-layers.length].type === "esp") {
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
              position: _i
            });
            if (token.start !== null) {
              if (token.type === "tag") {
                if (!token.tagName || !token.tagNameEndsAt) {
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
      } else if (withinStyle && !withinStyleComment && str[_i] && str[_i].trim() &&
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
      }
    }
    if (!doNothing &&
    property && property.valueStarts && !property.valueEnds) {
      if (
      ";}".includes(str[_i]) && (!attrib || !attrib.attribName || attrib.attribName !== "style") ||
      ";'\"".includes(str[_i]) && attrib && attrib.attribName === "style" &&
      ifQuoteThenAttrClosingQuote(_i) ||
      !str[_i].trim()) {
        property.valueEnds = lastNonWhitespaceCharAt + 1;
        property.value = str.slice(property.valueStarts, lastNonWhitespaceCharAt + 1);
        if (str[_i] === ";") {
          property.semi = _i;
        } else if (
        !str[_i].trim() &&
        str[stringLeftRight.right(str, _i)] === ";") {
          property.semi = stringLeftRight.right(str, _i);
        }
        pushProperty(property);
        property = null;
        var nextChar = stringLeftRight.right(str, _i);
        if (nextChar &&
        str[nextChar].trim() && (
        attrib && attrib.attribName === "style" && !"\"'<>".includes(str[nextChar]) ||
        token.type === "rule" && !";{}@".includes(str[nextChar]))) {
          if (str[nextChar] === "*" && str[nextChar + 1] === "/") {
            attrib.attribValue.push({
              type: "comment",
              start: nextChar,
              end: nextChar + 2,
              value: "*/",
              closing: true,
              kind: "block",
              language: "css"
            });
            doNothing = nextChar + 2;
          } else {
            initProperty(nextChar);
          }
        }
      } else if (str[_i] === ":" && Number.isInteger(property.colon) && property.colon < _i && lastNonWhitespaceCharAt && property.colon + 1 < lastNonWhitespaceCharAt) {
        var split = str.slice(stringLeftRight.right(str, property.colon), lastNonWhitespaceCharAt + 1).split(/\s+/);
        if (split.length === 2) {
          property.valueEnds = property.valueStarts + split[0].length;
          property.value = str.slice(property.valueStarts, property.valueEnds);
          pushProperty(property);
          propertyReset();
          property.propertyStarts = lastNonWhitespaceCharAt + 1 - split[1].length;
        }
      }
    }
    if (!doNothing &&
    property && property.colon && !property.valueStarts && str[_i].trim()) {
      if (
      ";}'\"".includes(str[_i]) &&
      ifQuoteThenAttrClosingQuote(_i)) {
        if (str[_i] === ";") {
          property.semi = _i;
        }
        pushProperty(property);
        property = null;
      } else {
        property.valueStarts = _i;
      }
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
    !str[_i].trim() ||
    !attrNameRegexp.test(str[_i]) && (
    str[_i] === ":" ||
    !stringLeftRight.right(str, _i) || !":/".includes(str[stringLeftRight.right(str, _i)]))) && (
    str[_i] !== "/" || str[_i - 1] !== "/")) {
      property.propertyEnds = _i;
      property.property = str.slice(property.propertyStarts, _i);
      if ("};".includes(str[_i]) || !str[_i].trim() && str[stringLeftRight.right(str, _i)] === "}") {
        if (str[_i] === ";") {
          property.semi = _i;
        }
        pushProperty(property);
        property = null;
      }
      else if ("\r\n".includes(str[_i])) {
          var nextCharIdx = stringLeftRight.right(str, _i);
          if (!":}'\"".includes(str[nextCharIdx])) {
            pushProperty(property);
            property = null;
            initProperty(nextCharIdx);
          }
        }
    }
    if (!doNothing &&
    property && property.propertyEnds && !property.valueStarts && str[_i] === ":") {
      property.colon = _i;
    }
    if (!doNothing && token.type === "rule" && str[_i] && str[_i].trim() &&
    !"{};".includes(str[_i]) &&
    token.selectorsEnd && token.openingCurlyAt && (!property || !property.propertyStarts)) {
      initProperty(_i);
    }
    if (!doNothing &&
    attrib && attrib.attribName === "style" &&
    attrib.attribOpeningQuoteAt && !attrib.attribClosingQuoteAt &&
    !property &&
    str[_i].trim() &&
    !"'\";".includes(str[_i])) {
      initProperty(_i);
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
        } else if (token.kind === "simple" && token.language === "html" && !token.closing && str[stringLeftRight.right(str, _i)] === ">") {
          token.end = stringLeftRight.right(str, _i) + 1;
          token.kind = "simplet";
          token.closing = null;
        } else if (token.language === "html") {
          token.end = _i + 1;
          if (str[stringLeftRight.left(str, _i)] === "!" && str[stringLeftRight.right(str, _i)] === "-") {
            token.end = stringLeftRight.right(str, _i) + 1;
          }
          token.value = str.slice(token.start, token.end);
        }
      } else if (token.type === "comment" && token.language === "html" && str[_i] === ">" && (!layers.length || str[stringLeftRight.right(str, _i)] === "<")) {
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
      } else if (token.type === "comment" && token.language === "CSS" && str[_i] === "*" && str[_i + 1] === "/") {
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end);
      } else if (token.type === "esp" && token.end === null && isStr(token.tail) && token.tail.includes(str[_i])) {
        var wholeEspTagClosing = "";
        for (var _y = _i; _y < len; _y++) {
          if (espChars.includes(str[_y])) {
            wholeEspTagClosing += str[_y];
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
          if (Array.isArray(layers) && layers.length && layers[~-layers.length].type === "esp") {
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
        if (token.tagName === "xml" && token.closing && !token.kind) {
          token.kind = "xml";
        }
        if (voidTags.includes(token.tagName)) {
          token.void = true;
        }
        token.recognised = isTagNameRecognised(token.tagName);
      }
    }
    if (!doNothing && token.type === "tag" && !token.tagNameStartsAt && token.start != null && (token.start < _i || str[token.start] !== "<")) {
      if (str[_i] === "/") {
        token.closing = true;
      } else if (isLatinLetter(str[_i])) {
        token.tagNameStartsAt = _i;
        if (!token.closing) {
          token.closing = false;
        }
      } else ;
    }
    if (!doNothing && token.type === "tag" && token.kind !== "cdata" && attrib.attribNameStartsAt && _i > attrib.attribNameStartsAt && attrib.attribNameEndsAt === null && !charSuitableForHTMLAttrName__default['default'](str[_i])) {
      attrib.attribNameEndsAt = _i;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, _i);
      attrib.attribNameRecognised = htmlAllKnownAttributes.allHtmlAttribs.has(attrib.attribName);
      if (str[_i] && !str[_i].trim() && str[stringLeftRight.right(str, _i)] === "=") ; else if (str[_i] && !str[_i].trim() || str[_i] === ">" || str[_i] === "/" && str[stringLeftRight.right(str, _i)] === ">") {
        if ("'\"".includes(str[stringLeftRight.right(str, _i)])) ; else {
          attrib.attribEnds = _i;
          token.attribs.push(clone__default['default'](attrib));
          attribReset();
        }
      }
    }
    if (!doNothing && str[_i] && token.type === "tag" && token.kind !== "cdata" && token.tagNameEndsAt && _i > token.tagNameEndsAt && attrib.attribStarts === null && charSuitableForHTMLAttrName__default['default'](str[_i])) {
      attrib.attribStarts = _i;
      attrib.attribLeft = lastNonWhitespaceCharAt;
      attrib.attribNameStartsAt = _i;
    }
    if (!doNothing && token.type === "rule") {
      if (str[_i] === "{" && !token.openingCurlyAt) {
        token.openingCurlyAt = _i;
      } else if (str[_i] === "}" && token.openingCurlyAt && !token.closingCurlyAt) {
        token.closingCurlyAt = _i;
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end);
        pingTagCb(token);
        if (Array.isArray(layers) && layers.length && layers[~-layers.length].type === "at") {
          layers[~-layers.length].token.rules.push(token);
        }
        tokenReset();
      }
    }
    if (!doNothing && token.type === "tag" && attrib.attribValueStartsAt && _i >= attrib.attribValueStartsAt && attrib.attribValueEndsAt === null) {
      if ("'\"".includes(str[_i])) {
        var R1 = !layers.some(function (layerObj) {
          return layerObj.type === "esp";
        });
        var R2 = attributeEnds__default['default'](str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, _i);
        if (
        !layers.some(function (layerObj) {
          return layerObj.type === "esp";
        }) &&
        attributeEnds__default['default'](str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, _i)) {
          attrib.attribClosingQuoteAt = _i;
          attrib.attribValueEndsAt = _i;
          if (attrib.attribValueStartsAt) {
            attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, _i);
          }
          attrib.attribEnds = _i + 1;
          if (property) {
            attrib.attribValue.push(clone__default['default'](property));
            property = null;
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
          token.attribs.push(clone__default['default'](attrib));
          attribReset();
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
      } else if (str[_i] === "=" && ("'\"".includes(str[stringLeftRight.right(str, _i)]) || str[~-_i] && isLatinLetter(str[~-_i]))) {
        var whitespaceFound;
        var attribClosingQuoteAt;
        for (var _y2 = stringLeftRight.left(str, _i); _y2 >= attrib.attribValueStartsAt; _y2--) {
          if (!whitespaceFound && str[_y2] && !str[_y2].trim()) {
            whitespaceFound = true;
            if (attribClosingQuoteAt) {
              var extractedChunksVal = str.slice(_y2, attribClosingQuoteAt);
            }
          }
          if (whitespaceFound && str[_y2] && str[_y2].trim()) {
            whitespaceFound = false;
            if (!attribClosingQuoteAt) {
              attribClosingQuoteAt = _y2 + 1;
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
        } else if (attrib.attribOpeningQuoteAt && ("'\"".includes(str[stringLeftRight.right(str, _i)]) || htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(attrib.attribOpeningQuoteAt + 1, _i).trim()))) {
          _i = attrib.attribOpeningQuoteAt;
          attrib.attribEnds = attrib.attribOpeningQuoteAt + 1;
          attrib.attribValueStartsAt = null;
          layers.pop();
          token.attribs.push(clone__default['default'](attrib));
          attribReset();
          i = _i;
          return "continue";
        }
      } else if (attrib && attrib.attribName !== "style" && attrib.attribStarts && !attrib.attribEnds && !property && (
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
    } else if (token.type === "esp" && attribToBackup && parentTokenToBackup && attribToBackup.attribOpeningQuoteAt && "'\"".includes(str[_i]) && str[attribToBackup.attribOpeningQuoteAt] === str[_i] && attributeEnds__default['default'](str, attribToBackup.attribOpeningQuoteAt, _i)) {
      token.end = _i;
      token.value = str.slice(token.start, _i);
      if (attribToBackup && !Array.isArray(attribToBackup.attribValue)) {
        attribToBackup.attribValue.length = 0;
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
      if (str[_i] === "=" && !"'\"=".includes(str[stringLeftRight.right(str, _i)]) && !espChars.includes(str[stringLeftRight.right(str, _i)])
      ) {
          var firstCharOnTheRight = stringLeftRight.right(str, _i);
          var firstQuoteOnTheRightIdx = [str.indexOf("'", firstCharOnTheRight), str.indexOf("\"", firstCharOnTheRight)].filter(function (val) {
            return val > 0;
          }).length ? Math.min.apply(Math, _toConsumableArray([str.indexOf("'", firstCharOnTheRight), str.indexOf("\"", firstCharOnTheRight)].filter(function (val) {
            return val > 0;
          }))) : undefined;
          if (
          firstCharOnTheRight &&
          str.slice(firstCharOnTheRight).includes("=") &&
          htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(firstCharOnTheRight, firstCharOnTheRight + str.slice(firstCharOnTheRight).indexOf("=")).trim().toLowerCase())) {
            attrib.attribEnds = _i + 1;
            token.attribs.push(_objectSpread2({}, attrib));
            attribReset();
          } else if (
          !firstQuoteOnTheRightIdx ||
          str.slice(firstCharOnTheRight, firstQuoteOnTheRightIdx).includes("=") ||
          !str.includes(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1) ||
          Array.from(str.slice(firstQuoteOnTheRightIdx + 1, str.indexOf(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1))).some(function (char) {
            return "<>=".includes(char);
          })) {
            attrib.attribValueStartsAt = firstCharOnTheRight;
            layers.push({
              type: "simple",
              value: null,
              position: attrib.attribValueStartsAt
            });
          }
        } else if ("'\"".includes(str[_i])) {
        var _nextCharIdx = stringLeftRight.right(str, _i);
        if (
        _nextCharIdx &&
        "'\"".includes(str[_nextCharIdx]) &&
        str[_i] !== str[_nextCharIdx] &&
        str.length > _nextCharIdx + 2 &&
        str.slice(_nextCharIdx + 1).includes(str[_nextCharIdx]) && (
        !str.indexOf(str[_nextCharIdx], _nextCharIdx + 1) || !stringLeftRight.right(str, str.indexOf(str[_nextCharIdx], _nextCharIdx + 1)) || str[_i] !== str[stringLeftRight.right(str, str.indexOf(str[_nextCharIdx], _nextCharIdx + 1))]) &&
        !Array.from(str.slice(_nextCharIdx + 1, str.indexOf(str[_nextCharIdx]))).some(function (char) {
          return "<>=".concat(str[_i]).includes(char);
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
              if (
              Array.isArray(attrib.attribValue) && (!attrib.attribValue.length ||
              attrib.attribValue[~-attrib.attribValue.length].end)) {
                if (attrib.attribName === "style") {
                  var charOnTheRight = stringLeftRight.right(str, _i);
                  if (str[charOnTheRight] === "/" && str[charOnTheRight + 1] === "*") {
                    attrib.attribValue.push({
                      type: "comment",
                      start: charOnTheRight,
                      end: charOnTheRight + 2,
                      value: "/*",
                      closing: false,
                      kind: "block",
                      language: "css"
                    });
                    doNothing = charOnTheRight + 2;
                  } else {
                    initProperty(stringLeftRight.right(str, _i));
                  }
                } else if (
                !ifQuoteThenAttrClosingQuote(_i + 1)) {
                  attrib.attribValue.push({
                    type: "text",
                    start: attrib.attribValueStartsAt,
                    end: null,
                    value: null
                  });
                }
              }
            }
          } else {
            /* istanbul ignore else */
            if (attributeEnds__default['default'](str, attrib.attribOpeningQuoteAt, _i)) {
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
    if (str[_i] === ">" && token.type === "tag" && attrib.attribStarts && !attrib.attribEnds) {
      var thisIsRealEnding = false;
      if (str[_i + 1]) {
        for (var _y3 = _i + 1; _y3 < len; _y3++) {
          if (attrib.attribOpeningQuoteAt && str[_y3] === str[attrib.attribOpeningQuoteAt]) {
            if (_y3 !== _i + 1 && str[~-_y3] !== "=") {
              thisIsRealEnding = true;
            }
            break;
          } else if (str[_y3] === ">") {
            break;
          } else if (str[_y3] === "<") {
            thisIsRealEnding = true;
            layers.pop();
            break;
          } else if (!str[_y3 + 1]) {
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

module.exports = tokenizer;
