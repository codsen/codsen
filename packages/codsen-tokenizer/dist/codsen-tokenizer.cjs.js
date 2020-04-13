/**
 * codsen-tokenizer
 * HTML Lexer aimed at erroneous code
 * Version: 2.12.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var htmlAllKnownAttributes = require('html-all-known-attributes');
var stringMatchLeftRight = require('string-match-left-right');
var clone = _interopDefault(require('lodash.clonedeep'));
var stringLeftRight = require('string-left-right');
var isTagOpening = _interopDefault(require('is-html-tag-opening'));
var attributeEnds = _interopDefault(require('is-html-attribute-closing'));
var charSuitableForHTMLAttrName = _interopDefault(require('is-char-suitable-for-html-attr-name'));

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
  if (n === "Map" || n === "Set") return Array.from(n);
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

var allHTMLTagsKnownToHumanity = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"];
var espChars = "{}%-$_()*|";
var espLumpBlacklist = [")|(", "|(", ")(", "()", "{}", "%)", "*)", "**"];
function isStr(something) {
  return typeof something === "string";
}
function isLatinLetter(_char4) {
  return isStr(_char4) && _char4.length === 1 && (_char4.charCodeAt(0) > 64 && _char4.charCodeAt(0) < 91 || _char4.charCodeAt(0) > 96 && _char4.charCodeAt(0) < 123);
}
function charSuitableForTagName(_char5) {
  return /[.\-_a-z0-9\u00B7\u00C0-\uFFFD]/i.test(_char5);
}
function flipEspTag(str) {
  var res = "";
  for (var i = 0, len = str.length; i < len; i++) {
    if (str[i] === "[") {
      res = "]".concat(res);
    } else if (str[i] === "{") {
      res = "}".concat(res);
    } else if (str[i] === "(") {
      res = ")".concat(res);
    } else {
      res = "".concat(str[i]).concat(res);
    }
  }
  return res;
}
function isTagNameRecognised(tagName) {
  return allHTMLTagsKnownToHumanity.includes(tagName.toLowerCase()) || ["doctype", "cdata", "xml"].includes(tagName.toLowerCase());
}
function xBeforeYOnTheRight(str, startingIdx, x, y) {
  for (var i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      return true;
    } else if (str.startsWith(y, i)) {
      return false;
    }
  }
  return false;
}

function startsEsp(str, i, token, layers, styleStarts) {
  return espChars.includes(str[i]) && str[i + 1] && espChars.includes(str[i + 1]) && token.type !== "rule" && token.type !== "at" && !(str[i] === "-" && "-{(".includes(str[i + 1])) && !("})".includes(str[i]) && "-".includes(str[i + 1])) && !(
  "0123456789".includes(str[stringLeftRight.left(str, i)]) && (!str[i + 2] || ["\"", "'", ";"].includes(str[i + 2]) || !str[i + 2].trim().length)) && !(styleStarts && ("{}".includes(str[i]) || "{}".includes(str[stringLeftRight.right(str, i)])));
}

var BACKSLASH = "\\";
function startsTag(str, i, token, layers) {
  return str[i] && str[i].trim().length && (!layers.length || token.type === "text") && !["doctype", "xml"].includes(token.kind) && (str[i] === "<" && (isTagOpening(str, i, {
    allowCustomTagNames: true
  }) || str[stringLeftRight.right(str, i)] === ">" || stringMatchLeftRight.matchRight(str, i, ["doctype", "xml", "cdata"], {
    i: true,
    trimBeforeMatching: true,
    trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
  })) || isLatinLetter(str[i]) && (!str[i - 1] || !isLatinLetter(str[i - 1]) && !["<", "/", "!", BACKSLASH].includes(str[stringLeftRight.left(str, i)])) && isTagOpening(str, i, {
    allowCustomTagNames: false,
    skipOpeningBracket: true
  })) && (
  token.type !== "esp" || token.tail.includes(str[i]));
}

function startsComment(str, i, token) {
  return (
    (str[i] === "<" && (stringMatchLeftRight.matchRight(str, i, ["!--"], {
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
    })) && (token.type !== "esp" || token.tail.includes(str[i]))
  );
}

function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
var voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
var charsThatEndCSSChunks = ["{", "}", ","];
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
  var opts = Object.assign({}, defaults, originalOpts);
  var currentPercentageDone;
  var lastPercentage = 0;
  var len = str.length;
  var midLen = Math.floor(len / 2);
  var doNothing;
  var styleStarts = false;
  var tagStash = [];
  var charStash = [];
  var token = {};
  var tokenDefault = {
    type: null,
    start: null,
    end: null
  };
  function tokenReset() {
    token = clone(tokenDefault);
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
  var selectorChunkStartedAt;
  var parentTokenToWrapAround;
  var layers = [];
  function matchLayerLast(str, i, matchFirstInstead) {
    if (!layers.length) {
      return false;
    }
    var whichLayerToMatch = matchFirstInstead ? layers[0] : layers[layers.length - 1];
    if (whichLayerToMatch.type === "simple") {
      return !whichLayerToMatch.value || str[i] === flipEspTag(whichLayerToMatch.value);
    } else if (whichLayerToMatch.type === "esp") {
      var _ret = function () {
        if (!espChars.includes(str[i])) {
          return {
            v: false
          };
        }
        var wholeEspTagLump = "";
        var len = str.length;
        for (var y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagLump = wholeEspTagLump + str[y];
          } else {
            break;
          }
        }
        if (wholeEspTagLump && whichLayerToMatch.openingLump && wholeEspTagLump.length > whichLayerToMatch.guessedClosingLump.length) {
          if (wholeEspTagLump.endsWith(whichLayerToMatch.openingLump)) {
            return {
              v: wholeEspTagLump.length - whichLayerToMatch.openingLump.length
            };
          }
          var uniqueCharsListFromGuessedClosingLumpArr = new Set(whichLayerToMatch.guessedClosingLump);
          var found = 0;
          var _loop = function _loop(len2, _y) {
            if (!uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLump[_y]) && found > 1) {
              return {
                v: {
                  v: _y
                }
              };
            }
            if (uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLump[_y])) {
              found++;
              uniqueCharsListFromGuessedClosingLumpArr = new Set(_toConsumableArray(uniqueCharsListFromGuessedClosingLumpArr).filter(function (el) {
                return el !== wholeEspTagLump[_y];
              }));
            }
          };
          for (var _y = 0, len2 = wholeEspTagLump.length; _y < len2; _y++) {
            var _ret2 = _loop(len2, _y);
            if (_typeof(_ret2) === "object") return _ret2.v;
          }
        } else if (
        whichLayerToMatch.guessedClosingLump.split("").every(function (_char) {
          return wholeEspTagLump.includes(_char);
        })) {
          return {
            v: wholeEspTagLump.length
          };
        }
      }();
      if (_typeof(_ret) === "object") return _ret.v;
    }
  }
  function matchLayerFirst(str, i) {
    return matchLayerLast(str, i, true);
  }
  function reportFirstFromStash(stash, cb, lookaheadLength) {
    var currentElem = stash.shift();
    var next = [];
    for (var i = 0; i < lookaheadLength; i++) {
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
    if (!["text", "esp"].includes(token.type) && token.start !== null && token.start < i && (str[i - 1] && !str[i - 1].trim().length || str[i] === "<")) {
      token.end = stringLeftRight.left(str, i) + 1;
      token.value = str.slice(token.start, token.end);
      if (token.type === "tag" && !"/>".includes(str[token.end - 1])) {
        var cutOffIndex = token.tagNameEndsAt || i;
        if (Array.isArray(token.attribs) && token.attribs.length) {
          for (var _i = 0, _len = token.attribs.length; _i < _len; _i++) {
            if (token.attribs[_i].attribNameRecognised) {
              cutOffIndex = token.attribs[_i].attribEnd;
              if (str[cutOffIndex] && str[cutOffIndex + 1] && !str[cutOffIndex].trim().length && str[cutOffIndex + 1].trim().length) {
                cutOffIndex++;
              }
            } else {
              if (_i === 0) {
                token.attribs = [];
              } else {
                token.attribs = token.attribs.splice(0, _i);
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
        if (Number.isInteger(token.tagNameStartsAt) && Number.isInteger(token.tagNameEndsAt) && !token.tagName) {
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
          initToken("text", stringLeftRight.left(str, i) + 1);
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
    return layers.length && layers[layers.length - 1].type === "at" && isObj(layers[layers.length - 1].token) && Number.isInteger(layers[layers.length - 1].token.openingCurlyAt) && !Number.isInteger(layers[layers.length - 1].token.closingCurlyAt);
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
      token["void"] = false;
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
  var _loop2 = function _loop2(_i2) {
    if (!doNothing && str[_i2] && opts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (_i2 === midLen) {
          opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
        }
      } else if (len >= 2000) {
        currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(_i2 / len * (opts.reportProgressFuncTo - opts.reportProgressFuncFrom));
        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
      }
    }
    if (styleStarts && token.type && !["rule", "at", "text"].includes(token.type)) {
      styleStarts = false;
    }
    if (Number.isInteger(doNothing) && _i2 >= doNothing) {
      doNothing = false;
    }
    if (!doNothing && atRuleWaitingForClosingCurlie()) {
      if (str[_i2] === "}") {
        if (token.type === null || token.type === "text" || token.type === "rule" && token.openingCurlyAt === null) {
          if (token.type === "rule") {
            token.end = stringLeftRight.left(str, _i2) + 1;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token);
            token = tokenReset();
            if (stringLeftRight.left(str, _i2) < _i2 - 1) {
              initToken("text", stringLeftRight.left(str, _i2) + 1);
            }
          }
          dumpCurrentToken(token, _i2);
          var poppedToken = layers.pop();
          token = poppedToken.token;
          token.closingCurlyAt = _i2;
          token.end = _i2 + 1;
          token.value = str.slice(token.start, token.end);
          pingTagCb(token);
          token = tokenReset();
          doNothing = _i2 + 1;
        }
      } else if (token.type === "text" && str[_i2] && str[_i2].trim().length) {
        token.end = _i2;
        token.value = str.slice(token.start, token.end);
        pingTagCb(token);
        token = tokenReset();
      }
    }
    if (token.end && token.end === _i2) {
      if (token.tagName === "style" && !token.closing) {
        styleStarts = true;
      }
      dumpCurrentToken(token, _i2);
      layers = [];
    }
    if (!doNothing) {
      if (["tag", "esp", "rule", "at"].includes(token.type) && token.kind !== "cdata") {
        if (["\"", "'", "(", ")"].includes(str[_i2]) && !(
        ["\"", "'"].includes(str[stringLeftRight.left(str, _i2)]) && str[stringLeftRight.left(str, _i2)] === str[stringLeftRight.right(str, _i2)])) {
          if (matchLayerLast(str, _i2)) {
            layers.pop();
          } else {
            layers.push({
              type: "simple",
              value: str[_i2],
              position: _i2
            });
          }
        }
      } else if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
        if (["[", "]"].includes(str[_i2])) {
          if (matchLayerLast(str, _i2)) {
            layers.pop();
          } else {
            layers.push({
              type: "simple",
              value: str[_i2],
              position: _i2
            });
          }
        }
      }
    }
    if (!doNothing && token.type === "at" && Number.isInteger(token.start) && _i2 >= token.start && !Number.isInteger(token.identifierStartsAt) && str[_i2] && str[_i2].trim().length && str[_i2] !== "@") {
      token.identifierStartsAt = _i2;
    }
    if (!doNothing && token.type === "at" && Number.isInteger(token.queryStartsAt) && !Number.isInteger(token.queryEndsAt) && "{};".includes(str[_i2])) {
      if (str[_i2 - 1] && str[_i2 - 1].trim().length) {
        token.queryEndsAt = _i2;
      } else {
        token.queryEndsAt = stringLeftRight.left(str, _i2) + 1;
      }
      token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
    }
    if (!doNothing && token.type === "at" && str[_i2] === "{" && token.identifier && !Number.isInteger(token.openingCurlyAt)) {
      token.openingCurlyAt = _i2;
      layers.push({
        type: "at",
        token: token
      });
      var charIdxOnTheRight = stringLeftRight.right(str, _i2);
      if (str[charIdxOnTheRight] === "}") {
        token.closingCurlyAt = charIdxOnTheRight;
        pingTagCb(token);
        doNothing = charIdxOnTheRight;
      } else {
        tokenReset();
        if (charIdxOnTheRight > _i2 + 1) {
          initToken("text", _i2 + 1);
          token.end = charIdxOnTheRight;
          token.value = str.slice(token.start, token.end);
          pingTagCb(token);
        }
        tokenReset();
        initToken("rule", charIdxOnTheRight);
        doNothing = charIdxOnTheRight;
      }
    }
    if (!doNothing && token.type === "at" && token.identifier && str[_i2] && str[_i2].trim().length && !Number.isInteger(token.queryStartsAt)) {
      token.queryStartsAt = _i2;
    }
    if (!doNothing && token.type === "at" && Number.isInteger(token.identifierStartsAt) && _i2 >= token.start && str[_i2] && (!str[_i2].trim().length || "()".includes(str[_i2])) && !Number.isInteger(token.identifierEndsAt)) {
      token.identifierEndsAt = _i2;
      token.identifier = str.slice(token.identifierStartsAt, _i2);
    }
    if (token.type === "rule" && Number.isInteger(selectorChunkStartedAt) && (charsThatEndCSSChunks.includes(str[_i2]) || str[_i2] && !str[_i2].trim().length && charsThatEndCSSChunks.includes(str[stringLeftRight.right(str, _i2)]))) {
      token.selectors.push({
        value: str.slice(selectorChunkStartedAt, _i2),
        selectorStarts: selectorChunkStartedAt,
        selectorEnds: _i2
      });
      selectorChunkStartedAt = undefined;
      token.selectorsEnd = _i2;
    }
    if (!doNothing) {
      if (startsTag(str, _i2, token, layers)) {
        if (token.type && token.start !== null) {
          dumpCurrentToken(token, _i2);
          tokenReset();
        }
        initToken("tag", _i2);
        if (styleStarts) {
          styleStarts = false;
        }
        if (stringMatchLeftRight.matchRight(str, _i2, "doctype", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
        })) {
          token.kind = "doctype";
        } else if (stringMatchLeftRight.matchRight(str, _i2, "cdata", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
        })) {
          token.kind = "cdata";
        } else if (stringMatchLeftRight.matchRight(str, _i2, "xml", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
        })) {
          token.kind = "xml";
        }
      } else if (startsComment(str, _i2, token)) {
        if (Number.isInteger(token.start)) {
          dumpCurrentToken(token, _i2);
        }
        tokenReset();
        initToken("comment", _i2);
        if (str[_i2] === "-") {
          token.closing = true;
        } else if (stringMatchLeftRight.matchRightIncl(str, _i2, ["<![endif]-->"], {
          i: true,
          trimBeforeMatching: true,
          maxMismatches: 2
        })) {
          token.closing = true;
          token.kind = "only";
        }
        if (styleStarts) {
          styleStarts = false;
        }
      } else if (startsEsp(str, _i2, token, layers, styleStarts)) {
        var wholeEspTagLump = "";
        for (var y = _i2; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagLump = wholeEspTagLump + str[y];
          } else {
            break;
          }
        }
        if (!espLumpBlacklist.includes(wholeEspTagLump) && (!Array.isArray(layers) || !layers.length || layers[layers.length - 1].type !== "simple" || layers[layers.length - 1].value !== str[_i2 + wholeEspTagLump.length])) {
          var lengthOfClosingEspChunk;
          if (layers.length && matchLayerLast(str, _i2)) {
            lengthOfClosingEspChunk = matchLayerLast(str, _i2);
            if (token.type === "esp") {
              if (!Number.isInteger(token.end)) {
                token.end = _i2 + lengthOfClosingEspChunk;
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
                i = _i2;
                return "continue";
              } else {
                dumpCurrentToken(token, _i2);
              }
              tokenReset();
            }
            layers.pop();
          } else if (layers.length && matchLayerFirst(str, _i2)) {
            lengthOfClosingEspChunk = matchLayerFirst(str, _i2);
            if (token.type === "esp") {
              if (!Number.isInteger(token.end)) {
                token.end = _i2 + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
              }
              dumpCurrentToken(token, _i2);
              tokenReset();
            }
            layers = [];
          } else {
            layers.push({
              type: "esp",
              openingLump: wholeEspTagLump,
              guessedClosingLump: flipEspTag(wholeEspTagLump),
              position: _i2
            });
            if (token.start !== null) {
              if (
              token.type === "tag") {
                if (!token.tagName || !token.tagNameEndsAt) {
                  token.tagNameEndsAt = _i2;
                  token.tagName = str.slice(token.tagNameStartsAt, _i2);
                  token.recognised = isTagNameRecognised(token.tagName);
                }
                parentTokenToWrapAround = clone(token);
              } else {
                dumpCurrentToken(token, _i2);
              }
            }
            initToken("esp", _i2);
            token.tail = flipEspTag(wholeEspTagLump);
            token.head = wholeEspTagLump;
          }
          doNothing = _i2 + (lengthOfClosingEspChunk ? lengthOfClosingEspChunk : wholeEspTagLump.length);
        }
      } else if (token.start === null || token.end === _i2) {
        if (styleStarts) {
          if (str[_i2] && !str[_i2].trim().length) {
            tokenReset();
            initToken("text", _i2);
            token.end = stringLeftRight.right(str, _i2) || str.length;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token);
            doNothing = token.end;
            tokenReset();
            if (stringLeftRight.right(str, _i2) && !["{", "}", "<"].includes(str[stringLeftRight.right(str, _i2)])) {
              var idxOnTheRight = stringLeftRight.right(str, _i2);
              initToken(str[idxOnTheRight] === "@" ? "at" : "rule", idxOnTheRight);
              if (str[_i2 + 1] && !str[_i2 + 1].trim().length) {
                doNothing = stringLeftRight.right(str, _i2);
              }
            }
          } else if (str[_i2]) {
            tokenReset();
            if ("}".includes(str[_i2])) {
              initToken("text", _i2);
              doNothing = _i2 + 1;
            } else {
              initToken(str[_i2] === "@" ? "at" : "rule", _i2);
            }
          }
        } else if (str[_i2]) {
          if (_i2) {
            token = tokenReset();
          }
          initToken("text", _i2);
        }
      } else if (token.type === "text" && styleStarts && str[_i2] && str[_i2].trim().length && !"{},".includes(str[_i2])) {
        dumpCurrentToken(token, _i2);
        tokenReset();
        initToken("rule", _i2);
      }
    }
    if (!doNothing && token.type === "rule" && str[_i2] && str[_i2].trim().length && !"{}".includes(str[_i2]) && !Number.isInteger(selectorChunkStartedAt) && !Number.isInteger(token.openingCurlyAt)) {
      if (!",".includes(str[_i2])) {
        selectorChunkStartedAt = _i2;
        if (token.selectorsStart === null) {
          token.selectorsStart = _i2;
        }
      } else {
        token.selectorsEnd = _i2 + 1;
      }
    }
    if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
      if (str[_i2] === "[") ;
    }
    if (!doNothing) {
      if (token.type === "tag" && !layers.length && str[_i2] === ">") {
        token.end = _i2 + 1;
        token.value = str.slice(token.start, token.end);
      } else if (token.type === "comment" && !layers.length && token.kind === "simple" && (str[token.start] === "<" && str[_i2] === "-" && (stringMatchLeftRight.matchLeft(str, _i2, "!-", {
        trimBeforeMatching: true
      }) || stringMatchLeftRight.matchLeftIncl(str, _i2, "!-", {
        trimBeforeMatching: true
      }) && str[_i2 + 1] !== "-") || str[token.start] === "-" && str[_i2] === ">" && stringMatchLeftRight.matchLeft(str, _i2, "--", {
        trimBeforeMatching: true,
        maxMismatches: 1
      }))) {
        if (str[_i2] === "-" && (stringMatchLeftRight.matchRight(str, _i2, ["[if", "(if", "{if"], {
          i: true,
          trimBeforeMatching: true
        }) || stringMatchLeftRight.matchRight(str, _i2, ["if"], {
          i: true,
          trimBeforeMatching: true
        }) && (
        xBeforeYOnTheRight(str, _i2, "]", ">") ||
        str.includes("mso", _i2) && !str.slice(_i2, str.indexOf("mso")).includes("<") && !str.slice(_i2, str.indexOf("mso")).includes(">")))) {
          token.kind = "only";
        } else if (
        str[token.start] !== "-" && stringMatchLeftRight.matchRightIncl(str, _i2, ["-<![endif"], {
          i: true,
          trimBeforeMatching: true,
          maxMismatches: 2
        })) {
          token.kind = "not";
          token.closing = true;
        } else if (token.kind === "simple" && !token.closing && str[stringLeftRight.right(str, _i2)] === ">") {
          token.end = stringLeftRight.right(str, _i2) + 1;
          token.kind = "simplet";
          token.closing = null;
        } else {
          token.end = _i2 + 1;
          if (str[stringLeftRight.left(str, _i2)] === "!" && str[stringLeftRight.right(str, _i2)] === "-") {
            token.end = stringLeftRight.right(str, _i2) + 1;
          }
          token.value = str.slice(token.start, token.end);
        }
      } else if (token.type === "comment" && str[_i2] === ">" && (!layers.length || str[stringLeftRight.right(str, _i2)] === "<")) {
        if (Array.isArray(layers) && layers.length && layers[layers.length - 1].value === "[") {
          layers.pop();
        }
        if (!["simplet", "not"].includes(token.kind) && stringMatchLeftRight.matchRight(str, _i2, ["<!-->", "<!---->"], {
          trimBeforeMatching: true,
          maxMismatches: 1,
          lastMustMatch: true
        })) {
          token.kind = "not";
        } else {
          token.end = _i2 + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (token.type === "esp" && token.end === null && isStr(token.tail) && token.tail.includes(str[_i2])) {
        var wholeEspTagClosing = "";
        for (var _y2 = _i2; _y2 < len; _y2++) {
          if (espChars.includes(str[_y2])) {
            wholeEspTagClosing = wholeEspTagClosing + str[_y2];
          } else {
            break;
          }
        }
        if (wholeEspTagClosing.length > token.head.length) {
          var headsFirstChar = token.head[0];
          if (wholeEspTagClosing.endsWith(token.head)) {
            token.end = _i2 + wholeEspTagClosing.length - token.head.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = _i2 + token.tail.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (!token.tail.includes(headsFirstChar) && wholeEspTagClosing.includes(headsFirstChar) || wholeEspTagClosing.endsWith(token.head) || wholeEspTagClosing.startsWith(token.tail)) {
            var firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(0, wholeEspTagClosing.indexOf(headsFirstChar));
            var secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(wholeEspTagClosing.indexOf(headsFirstChar));
            if (firstPartOfWholeEspTagClosing.length && secondPartOfWholeEspTagClosing.length && token.tail.split("").every(function (_char2) {
              return firstPartOfWholeEspTagClosing.includes(_char2);
            })) {
              token.end = _i2 + firstPartOfWholeEspTagClosing.length;
              token.value = str.slice(token.start, token.end);
              doNothing = token.end;
            }
          } else {
            token.end = _i2 + wholeEspTagClosing.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          }
        } else {
          token.end = _i2 + wholeEspTagClosing.length;
          token.value = str.slice(token.start, token.end);
          doNothing = token.end;
        }
      }
    }
    if (!doNothing && token.type === "tag" && Number.isInteger(token.tagNameStartsAt) && !Number.isInteger(token.tagNameEndsAt)) {
      if (!str[_i2] || !charSuitableForTagName(str[_i2])) {
        token.tagNameEndsAt = _i2;
        token.tagName = str.slice(token.tagNameStartsAt, _i2).toLowerCase();
        if (token.tagName === "xml" && token.closing && !token.kind) {
          token.kind = "xml";
        }
        if (voidTags.includes(token.tagName)) {
          token["void"] = true;
        }
        token.recognised = isTagNameRecognised(token.tagName);
      }
    }
    if (!doNothing && token.type === "tag" && !Number.isInteger(token.tagNameStartsAt) && Number.isInteger(token.start) && (token.start < _i2 || str[token.start] !== "<")) {
      if (str[_i2] === "/") {
        token.closing = true;
      } else if (isLatinLetter(str[_i2])) {
        token.tagNameStartsAt = _i2;
        if (!token.closing) {
          token.closing = false;
        }
      }
    }
    if (!doNothing && token.type === "tag" && token.kind !== "cdata" && Number.isInteger(attrib.attribNameStartsAt) && _i2 > attrib.attribNameStartsAt && attrib.attribNameEndsAt === null && !charSuitableForHTMLAttrName(str[_i2])) {
      attrib.attribNameEndsAt = _i2;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, _i2);
      attrib.attribNameRecognised = htmlAllKnownAttributes.allHtmlAttribs.has(attrib.attribName);
      if (str[_i2] && !str[_i2].trim().length && str[stringLeftRight.right(str, _i2)] === "=") ; else if (str[_i2] && !str[_i2].trim().length || str[_i2] === ">" || str[_i2] === "/" && str[stringLeftRight.right(str, _i2)] === ">") {
        if ("'\"".includes(str[stringLeftRight.right(str, _i2)])) ; else {
          attrib.attribEnd = _i2;
          token.attribs.push(clone(attrib));
          attribReset();
        }
      }
    }
    if (!doNothing && str[_i2] && token.type === "tag" && token.kind !== "cdata" && Number.isInteger(token.tagNameEndsAt) && _i2 > token.tagNameEndsAt && attrib.attribStart === null && charSuitableForHTMLAttrName(str[_i2])) {
      attrib.attribStart = _i2;
      attrib.attribNameStartsAt = _i2;
    }
    if (!doNothing && token.type === "rule") {
      if (str[_i2] === "{" && !Number.isInteger(token.openingCurlyAt)) {
        token.openingCurlyAt = _i2;
      } else if (str[_i2] === "}" && Number.isInteger(token.openingCurlyAt) && !Number.isInteger(token.closingCurlyAt)) {
        token.closingCurlyAt = _i2;
        token.end = _i2 + 1;
        token.value = str.slice(token.start, token.end);
        pingTagCb(token);
        tokenReset();
      }
    }
    if (!doNothing && token.type === "tag" && Number.isInteger(attrib.attribValueStartsAt) && _i2 >= attrib.attribValueStartsAt && attrib.attribValueEndsAt === null) {
      if ("'\"".includes(str[_i2])) {
        if (str[stringLeftRight.left(str, _i2)] === str[_i2] &&
        !"/>".concat(espChars).includes(str[stringLeftRight.right(str, _i2)]) && !xBeforeYOnTheRight(str, _i2, "=", "\"") && !xBeforeYOnTheRight(str, _i2, "=", "'") && (xBeforeYOnTheRight(str, _i2, "\"", ">") || xBeforeYOnTheRight(str, _i2, "'", ">")) && (
        !str.slice(_i2 + 1).includes("<") ||
        !str.slice(0, str.indexOf("<")).includes("="))) {
          attrib.attribOpeningQuoteAt = _i2;
          attrib.attribValueStartsAt = _i2 + 1;
          layers.push({
            type: "simple",
            value: str[_i2],
            position: _i2
          });
        } else if (
        !layers.some(function (layerObj) {
          return layerObj.type === "esp";
        }) &&
        attributeEnds(str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, _i2)) {
          attrib.attribClosingQuoteAt = _i2;
          attrib.attribValueEndsAt = _i2;
          if (Number.isInteger(attrib.attribValueStartsAt)) {
            attrib.attribValue = str.slice(attrib.attribValueStartsAt, _i2);
          }
          attrib.attribEnd = _i2 + 1;
          if (str[attrib.attribOpeningQuoteAt] !== str[_i2]) {
            layers.pop();
            layers.pop();
          }
          token.attribs.push(clone(attrib));
          attribReset();
        }
      } else if (attrib.attribOpeningQuoteAt === null && (str[_i2] && !str[_i2].trim().length || ["/", ">"].includes(str[_i2]) || espChars.includes(str[_i2]) && espChars.includes(str[_i2 + 1]))) {
        attrib.attribValueEndsAt = _i2;
        attrib.attribValue = str.slice(attrib.attribValueStartsAt, _i2);
        attrib.attribEnd = _i2;
        token.attribs.push(clone(attrib));
        attribReset();
        layers.pop();
        if (str[_i2] === ">") {
          token.end = _i2 + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (str[_i2] === "=" && ("'\"".includes(str[stringLeftRight.right(str, _i2)]) || str[_i2 - 1] && isLatinLetter(str[_i2 - 1]))) {
        var whitespaceFound;
        var attribClosingQuoteAt;
        for (var _y3 = stringLeftRight.left(str, _i2); _y3 >= attrib.attribValueStartsAt; _y3--) {
          if (!whitespaceFound && str[_y3] && !str[_y3].trim().length) {
            whitespaceFound = true;
            if (attribClosingQuoteAt) {
              var extractedChunksVal = str.slice(_y3, attribClosingQuoteAt);
            }
          }
          if (whitespaceFound && str[_y3] && str[_y3].trim().length) {
            whitespaceFound = false;
            if (!attribClosingQuoteAt) {
              attribClosingQuoteAt = _y3 + 1;
            }
          }
        }
        if (attribClosingQuoteAt) {
          attrib.attribValueEndsAt = attribClosingQuoteAt;
          if (Number.isInteger(attrib.attribValueStartsAt)) {
            attrib.attribValue = str.slice(attrib.attribValueStartsAt, attribClosingQuoteAt);
          }
          attrib.attribEnd = attribClosingQuoteAt;
          if (str[attrib.attribOpeningQuoteAt] !== str[_i2]) {
            layers.pop();
          }
          token.attribs.push(clone(attrib));
          attribReset();
          _i2 = attribClosingQuoteAt - 1;
          i = _i2;
          return "continue";
        } else if (attrib.attribOpeningQuoteAt && ("'\"".includes(str[stringLeftRight.right(str, _i2)]) || htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(attrib.attribOpeningQuoteAt + 1, _i2).trim()))) {
          _i2 = attrib.attribOpeningQuoteAt;
          attrib.attribEnd = attrib.attribOpeningQuoteAt + 1;
          attrib.attribValueStartsAt = null;
          layers.pop();
          token.attribs.push(clone(attrib));
          attribReset();
          i = _i2;
          return "continue";
        }
      }
    }
    if (!doNothing && token.type === "tag" && !Number.isInteger(attrib.attribValueStartsAt) && Number.isInteger(attrib.attribNameEndsAt) && attrib.attribNameEndsAt <= _i2 && str[_i2] && str[_i2].trim().length) {
      if (str[_i2] === "=" && !"'\"=".includes(str[stringLeftRight.right(str, _i2)]) && !espChars.includes(str[stringLeftRight.right(str, _i2)])
      ) {
          var firstCharOnTheRight = stringLeftRight.right(str, _i2);
          var firstQuoteOnTheRightIdx = [str.indexOf("'", firstCharOnTheRight), str.indexOf("\"", firstCharOnTheRight)].filter(function (val) {
            return val > 0;
          }).length ? Math.min.apply(Math, _toConsumableArray([str.indexOf("'", firstCharOnTheRight), str.indexOf("\"", firstCharOnTheRight)].filter(function (val) {
            return val > 0;
          }))) : undefined;
          if (
          firstCharOnTheRight &&
          str.slice(firstCharOnTheRight).includes("=") &&
          htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(firstCharOnTheRight, firstCharOnTheRight + str.slice(firstCharOnTheRight).indexOf("=")).trim().toLowerCase())) {
            attrib.attribEnd = _i2 + 1;
            token.attribs.push(clone(attrib));
            attribReset();
          } else if (
          !firstQuoteOnTheRightIdx ||
          str.slice(firstCharOnTheRight, firstQuoteOnTheRightIdx).includes("=") ||
          !str.includes(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1) ||
          Array.from(str.slice(firstQuoteOnTheRightIdx + 1, str.indexOf(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1))).some(function (_char3) {
            return "<>=".includes(_char3);
          })) {
            attrib.attribValueStartsAt = firstCharOnTheRight;
            layers.push({
              type: "simple",
              value: null,
              position: attrib.attribValueStartsAt
            });
          }
        } else if ("'\"".includes(str[_i2])) {
        var nextCharIdx = stringLeftRight.right(str, _i2);
        if (
        nextCharIdx &&
        "'\"".includes(str[nextCharIdx]) &&
        str[_i2] !== str[nextCharIdx] &&
        str.length > nextCharIdx + 2 &&
        str.slice(nextCharIdx + 1).includes(str[nextCharIdx]) && (
        !str.indexOf(str[nextCharIdx], nextCharIdx + 1) || !stringLeftRight.right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1)) || str[_i2] !== str[stringLeftRight.right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1))]) &&
        !Array.from(str.slice(nextCharIdx + 1, str.indexOf(str[nextCharIdx]))).some(function (_char4) {
          return "<>=".concat(str[_i2]).includes(_char4);
        })) {
          layers.pop();
        } else {
          attrib.attribOpeningQuoteAt = _i2;
          if (str[_i2 + 1]) {
            attrib.attribValueStartsAt = _i2 + 1;
          }
        }
      }
    }
    if (str[_i2] === ">" && token.type === "tag" && attrib.attribStart !== null && attrib.attribEnd === null) {
      var thisIsRealEnding = false;
      if (str[_i2 + 1]) {
        for (var _y4 = _i2 + 1; _y4 < len; _y4++) {
          if (attrib.attribOpeningQuoteAt !== null && str[_y4] === str[attrib.attribOpeningQuoteAt]) {
            if (_y4 !== _i2 + 1 && str[_y4 - 1] !== "=") {
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
        token.end = _i2 + 1;
        token.value = str.slice(token.start, token.end);
        if (Number.isInteger(attrib.attribValueStartsAt) && _i2 && attrib.attribValueStartsAt < _i2 && str.slice(attrib.attribValueStartsAt, _i2).trim().length) {
          attrib.attribValueEndsAt = _i2;
          attrib.attribValue = str.slice(attrib.attribValueStartsAt, _i2);
        } else {
          attrib.attribValueStartsAt = null;
        }
        attrib.attribEnd = _i2;
        token.attribs.push(clone(attrib));
        attribReset();
      }
    }
    if (str[_i2] && opts.charCb) {
      pingCharCb({
        type: token.type,
        chr: str[_i2],
        i: _i2
      });
    }
    if (!str[_i2] && token.start !== null) {
      token.end = _i2;
      token.value = str.slice(token.start, token.end);
      pingTagCb(token);
    }
    i = _i2;
  };
  for (var i = 0; i <= len; i++) {
    var _ret3 = _loop2(i);
    if (_ret3 === "continue") continue;
  }
  if (charStash.length) {
    for (var _i3 = 0, _len2 = charStash.length; _i3 < _len2; _i3++) {
      reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
    }
  }
  if (tagStash.length) {
    for (var _i4 = 0, _len3 = tagStash.length; _i4 < _len3; _i4++) {
      reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
    }
  }
  return {
    timeTakenInMilliseconds: Date.now() - start
  };
}

module.exports = tokenizer;
