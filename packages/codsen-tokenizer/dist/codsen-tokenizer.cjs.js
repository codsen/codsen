/**
 * codsen-tokenizer
 * Tokenizer for mixed inputs aiming at broken code, especially HTML & CSS
 * Version: 2.10.0
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
function charSuitableForHTMLAttrName(_char6) {
  return isLatinLetter(_char6) || _char6.charCodeAt(0) >= 48 && _char6.charCodeAt(0) <= 57 || [":", "-"].includes(_char6);
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
      if (token.type === "tag" && str[token.end - 1] !== ">") {
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
      token.esp = [];
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
  for (var i = 0; i <= len; i++) {
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
    if (styleStarts && token.type && !["rule", "at", "text"].includes(token.type)) {
      styleStarts = false;
    }
    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
    }
    if (!doNothing && atRuleWaitingForClosingCurlie()) {
      if (str[i] === "}") {
        if (token.type === null || token.type === "text" || token.type === "rule" && token.openingCurlyAt === null) {
          if (token.type === "rule") {
            token.end = stringLeftRight.left(str, i) + 1;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token);
            token = tokenReset();
            if (stringLeftRight.left(str, i) < i - 1) {
              initToken("text", stringLeftRight.left(str, i) + 1);
            }
          }
          dumpCurrentToken(token, i);
          var poppedToken = layers.pop();
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
      if (["tag", "esp", "rule", "at"].includes(token.type) && token.kind !== "cdata") {
        if (["\"", "'", "(", ")"].includes(str[i]) && !(
        ["\"", "'"].includes(str[stringLeftRight.left(str, i)]) && str[stringLeftRight.left(str, i)] === str[stringLeftRight.right(str, i)])) {
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
      } else if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
        if (["[", "]"].includes(str[i])) {
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
    }
    if (!doNothing && token.type === "at" && Number.isInteger(token.start) && i >= token.start && !Number.isInteger(token.identifierStartsAt) && str[i] && str[i].trim().length && str[i] !== "@") {
      token.identifierStartsAt = i;
    }
    if (!doNothing && token.type === "at" && Number.isInteger(token.queryStartsAt) && !Number.isInteger(token.queryEndsAt) && "{};".includes(str[i])) {
      if (str[i - 1] && str[i - 1].trim().length) {
        token.queryEndsAt = i;
      } else {
        token.queryEndsAt = stringLeftRight.left(str, i) + 1;
      }
      token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
    }
    if (!doNothing && token.type === "at" && str[i] === "{" && token.identifier && !Number.isInteger(token.openingCurlyAt)) {
      token.openingCurlyAt = i;
      layers.push({
        type: "at",
        token: token
      });
      var charIdxOnTheRight = stringLeftRight.right(str, i);
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
    if (!doNothing && token.type === "at" && token.identifier && str[i] && str[i].trim().length && !Number.isInteger(token.queryStartsAt)) {
      token.queryStartsAt = i;
    }
    if (!doNothing && token.type === "at" && Number.isInteger(token.identifierStartsAt) && i >= token.start && str[i] && (!str[i].trim().length || "()".includes(str[i])) && !Number.isInteger(token.identifierEndsAt)) {
      token.identifierEndsAt = i;
      token.identifier = str.slice(token.identifierStartsAt, i);
    }
    if (token.type === "rule" && Number.isInteger(selectorChunkStartedAt) && (charsThatEndCSSChunks.includes(str[i]) || str[i] && !str[i].trim().length && charsThatEndCSSChunks.includes(str[stringLeftRight.right(str, i)]))) {
      token.selectors.push({
        value: str.slice(selectorChunkStartedAt, i),
        selectorStarts: selectorChunkStartedAt,
        selectorEnds: i
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
        if (stringMatchLeftRight.matchRight(str, i, "doctype", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
        })) {
          token.kind = "doctype";
        } else if (stringMatchLeftRight.matchRight(str, i, "cdata", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
        })) {
          token.kind = "cdata";
        } else if (stringMatchLeftRight.matchRight(str, i, "xml", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
        })) {
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
        } else if (stringMatchLeftRight.matchRightIncl(str, i, ["<![endif]-->"], {
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
      } else if (startsEsp(str, i, token, layers, styleStarts)) {
        var wholeEspTagLump = "";
        for (var y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagLump = wholeEspTagLump + str[y];
          } else {
            break;
          }
        }
        if (!espLumpBlacklist.includes(wholeEspTagLump) && (!Array.isArray(layers) || !layers.length || layers[layers.length - 1].type !== "simple" || layers[layers.length - 1].value !== str[i + wholeEspTagLump.length])) {
          var lengthOfClosingEspChunk = void 0;
          if (layers.length && matchLayerLast(str, i)) {
            lengthOfClosingEspChunk = matchLayerLast(str, i);
            if (token.type === "esp") {
              if (!Number.isInteger(token.end)) {
                token.end = i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
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
              position: i
            });
            if (!(token.type === "tag" && (token.kind === "comment" ||
            Number.isInteger(attrib.attribStart) && !Number.isInteger(attrib.attribEnd)))) {
              dumpCurrentToken(token, i);
              initToken("esp", i);
              token.tail = flipEspTag(wholeEspTagLump);
              token.head = wholeEspTagLump;
            }
          }
          doNothing = i + (lengthOfClosingEspChunk ? lengthOfClosingEspChunk : wholeEspTagLump.length);
        }
      } else if (token.start === null || token.end === i) {
        if (styleStarts) {
          if (str[i] && !str[i].trim().length) {
            tokenReset();
            initToken("text", i);
            token.end = stringLeftRight.right(str, i) || str.length;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token);
            doNothing = token.end;
            tokenReset();
            if (stringLeftRight.right(str, i) && !["{", "}", "<"].includes(str[stringLeftRight.right(str, i)])) {
              var idxOnTheRight = stringLeftRight.right(str, i);
              initToken(str[idxOnTheRight] === "@" ? "at" : "rule", idxOnTheRight);
              if (str[i + 1] && !str[i + 1].trim().length) {
                doNothing = stringLeftRight.right(str, i);
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
          token = tokenReset();
          initToken("text", i);
        }
      } else if (token.type === "text" && styleStarts && str[i] && str[i].trim().length && !"{},".includes(str[i])) {
        dumpCurrentToken(token, i);
        tokenReset();
        initToken("rule", i);
      }
    }
    if (!doNothing && token.type === "rule" && str[i] && str[i].trim().length && !"{}".includes(str[i]) && !Number.isInteger(selectorChunkStartedAt) && !Number.isInteger(token.openingCurlyAt)) {
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
      } else if (token.type === "comment" && !layers.length && token.kind === "simple" && (str[token.start] === "<" && str[i] === "-" && (stringMatchLeftRight.matchLeft(str, i, "!-", {
        trimBeforeMatching: true
      }) || stringMatchLeftRight.matchLeftIncl(str, i, "!-", {
        trimBeforeMatching: true
      }) && str[i + 1] !== "-") || str[token.start] === "-" && str[i] === ">" && stringMatchLeftRight.matchLeft(str, i, "--", {
        trimBeforeMatching: true,
        maxMismatches: 1
      }))) {
        if (str[i] === "-" && (stringMatchLeftRight.matchRight(str, i, ["[if", "(if", "{if"], {
          i: true,
          trimBeforeMatching: true
        }) || stringMatchLeftRight.matchRight(str, i, ["if"], {
          i: true,
          trimBeforeMatching: true
        }) && (
        xBeforeYOnTheRight(str, i, "]", ">") ||
        str.includes("mso", i) && !str.slice(i, str.indexOf("mso")).includes("<") && !str.slice(i, str.indexOf("mso")).includes(">")))) {
          token.kind = "only";
        } else if (
        str[token.start] !== "-" && stringMatchLeftRight.matchRightIncl(str, i, ["-<![endif"], {
          i: true,
          trimBeforeMatching: true,
          maxMismatches: 2
        })) {
          token.kind = "not";
          token.closing = true;
        } else if (token.kind === "simple" && !token.closing && str[stringLeftRight.right(str, i)] === ">") {
          token.end = stringLeftRight.right(str, i) + 1;
          token.kind = "simplet";
          token.closing = null;
        } else {
          token.end = i + 1;
          if (str[stringLeftRight.left(str, i)] === "!" && str[stringLeftRight.right(str, i)] === "-") {
            token.end = stringLeftRight.right(str, i) + 1;
          }
          token.value = str.slice(token.start, token.end);
        }
      } else if (token.type === "comment" && str[i] === ">" && (!layers.length || str[stringLeftRight.right(str, i)] === "<")) {
        if (Array.isArray(layers) && layers.length && layers[layers.length - 1].value === "[") {
          layers.pop();
        }
        if (!["simplet", "not"].includes(token.kind) && stringMatchLeftRight.matchRight(str, i, ["<!-->", "<!---->"], {
          trimBeforeMatching: true,
          maxMismatches: 1,
          lastMustMatch: true
        })) {
          token.kind = "not";
        } else {
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (token.type === "esp" && token.end === null && isStr(token.tail) && token.tail.includes(str[i])) {
        var wholeEspTagClosing = "";
        for (var _y2 = i; _y2 < len; _y2++) {
          if (espChars.includes(str[_y2])) {
            wholeEspTagClosing = wholeEspTagClosing + str[_y2];
          } else {
            break;
          }
        }
        if (wholeEspTagClosing.length > token.head.length) {
          var headsFirstChar = token.head[0];
          if (wholeEspTagClosing.endsWith(token.head)) {
            token.end = i + wholeEspTagClosing.length - token.head.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = i + token.tail.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (!token.tail.includes(headsFirstChar) && wholeEspTagClosing.includes(headsFirstChar) || wholeEspTagClosing.endsWith(token.head) || wholeEspTagClosing.startsWith(token.tail)) {
            (function () {
              var firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(0, wholeEspTagClosing.indexOf(headsFirstChar));
              var secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(wholeEspTagClosing.indexOf(headsFirstChar));
              if (firstPartOfWholeEspTagClosing.length && secondPartOfWholeEspTagClosing.length && token.tail.split("").every(function (_char2) {
                return firstPartOfWholeEspTagClosing.includes(_char2);
              })) {
                token.end = i + firstPartOfWholeEspTagClosing.length;
                token.value = str.slice(token.start, token.end);
                doNothing = token.end;
              }
            })();
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
    if (!doNothing && token.type === "tag" && Number.isInteger(token.tagNameStartsAt) && !Number.isInteger(token.tagNameEndsAt)) {
      if (!str[i] || !charSuitableForTagName(str[i])) {
        token.tagNameEndsAt = i;
        token.tagName = str.slice(token.tagNameStartsAt, i).toLowerCase();
        if (token.tagName === "xml" && token.closing && !token.kind) {
          token.kind = "xml";
        }
        if (voidTags.includes(token.tagName)) {
          token["void"] = true;
        }
        token.recognised = isTagNameRecognised(token.tagName);
      }
    }
    if (!doNothing && token.type === "tag" && !Number.isInteger(token.tagNameStartsAt) && Number.isInteger(token.start) && (token.start < i || str[token.start] !== "<")) {
      if (str[i] === "/") {
        token.closing = true;
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartsAt = i;
        if (!token.closing) {
          token.closing = false;
        }
      }
    }
    if (!doNothing && token.type === "tag" && token.kind !== "cdata" && Number.isInteger(attrib.attribNameStartsAt) && i > attrib.attribNameStartsAt && attrib.attribNameEndsAt === null && !charSuitableForHTMLAttrName(str[i])) {
      attrib.attribNameEndsAt = i;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, i);
      attrib.attribNameRecognised = htmlAllKnownAttributes.allHtmlAttribs.includes(attrib.attribName);
      if (str[i] && !str[i].trim().length && str[stringLeftRight.right(str, i)] === "=") ; else if (str[i] && !str[i].trim().length || str[i] === ">" || str[i] === "/" && str[stringLeftRight.right(str, i)] === ">") {
        attrib.attribEnd = i;
        token.attribs.push(clone(attrib));
        attribReset();
      }
    }
    if (!doNothing && str[i] && token.type === "tag" && token.kind !== "cdata" && Number.isInteger(token.tagNameEndsAt) && i > token.tagNameEndsAt && attrib.attribStart === null && charSuitableForHTMLAttrName(str[i])) {
      attrib.attribStart = i;
      attrib.attribNameStartsAt = i;
    }
    if (!doNothing && token.type === "rule") {
      if (str[i] === "{" && !Number.isInteger(token.openingCurlyAt)) {
        token.openingCurlyAt = i;
      } else if (str[i] === "}" && Number.isInteger(token.openingCurlyAt) && !Number.isInteger(token.closingCurlyAt)) {
        token.closingCurlyAt = i;
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        pingTagCb(token);
        tokenReset();
      }
    }
    if (!doNothing && token.type === "tag" && Number.isInteger(attrib.attribValueStartsAt) && i >= attrib.attribValueStartsAt && attrib.attribValueEndsAt === null) {
      if ("'\"".includes(str[i])) {
        if (str[stringLeftRight.left(str, i)] === str[i] &&
        !"/>".concat(espChars).includes(str[stringLeftRight.right(str, i)]) && !xBeforeYOnTheRight(str, i, "=", "\"") && !xBeforeYOnTheRight(str, i, "=", "'") && (xBeforeYOnTheRight(str, i, "\"", ">") || xBeforeYOnTheRight(str, i, "'", ">")) && (
        !str.slice(i + 1).includes("<") ||
        !str.slice(0, str.indexOf("<")).includes("="))) {
          attrib.attribOpeningQuoteAt = i;
          attrib.attribValueStartsAt = i + 1;
          layers.push({
            type: "simple",
            value: str[i],
            position: i
          });
        } else if (
        (attrib.attribOpeningQuoteAt === null || str[attrib.attribOpeningQuoteAt] === str[i]) && !layers.some(function (layerObj) {
          return layerObj.type === "esp";
        }) ||
        "'\"".includes(str[attrib.attribOpeningQuoteAt]) && !xBeforeYOnTheRight(str, i, str[attrib.attribOpeningQuoteAt], "=")) {
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
      } else if (attrib.attribOpeningQuoteAt === null && (str[i] && !str[i].trim().length || ["/", ">"].includes(str[i]) || espChars.includes(str[i]) && espChars.includes(str[i + 1]))) {
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
      } else if (str[i] === "=" && "'\"".includes(str[stringLeftRight.right(str, i)])) {
        var whitespaceFound = void 0;
        var attribClosingQuoteAt = void 0;
        for (var _y3 = stringLeftRight.left(str, i); _y3 >= attrib.attribValueStartsAt; _y3--) {
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
          if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
            layers.pop();
          }
          token.attribs.push(clone(attrib));
          attribReset();
          i = attribClosingQuoteAt - 1;
          continue;
        } else if (attrib.attribOpeningQuoteAt) {
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
    if (!doNothing && token.type === "tag" && !Number.isInteger(attrib.attribValueStartsAt) && Number.isInteger(attrib.attribNameEndsAt) && attrib.attribNameEndsAt <= i && str[i] && str[i].trim().length) {
      if (str[i] === "=" && !"'\"=".includes(str[stringLeftRight.right(str, i)]) && !espChars.includes(str[stringLeftRight.right(str, i)])
      ) {
          var firstCharOnTheRight = stringLeftRight.right(str, i);
          if (
          firstCharOnTheRight &&
          str.slice(firstCharOnTheRight).includes("=") &&
          htmlAllKnownAttributes.allHtmlAttribs.includes(str.slice(firstCharOnTheRight, firstCharOnTheRight + str.slice(firstCharOnTheRight).indexOf("=")).trim().toLowerCase())) {
            attrib.attribEnd = i + 1;
            token.attribs.push(clone(attrib));
            attribReset();
          } else {
            attrib.attribValueStartsAt = firstCharOnTheRight;
            layers.push({
              type: "simple",
              value: null,
              position: attrib.attribValueStartsAt
            });
          }
        } else if ("'\"".includes(str[i])) {
        attrib.attribOpeningQuoteAt = i;
        if (str[i + 1]) {
          attrib.attribValueStartsAt = i + 1;
        }
      }
    }
    if (str[i] === ">" && token.type === "tag" && attrib.attribStart !== null && attrib.attribEnd === null) {
      var thisIsRealEnding = false;
      if (str[i + 1]) {
        for (var _y4 = i + 1; _y4 < len; _y4++) {
          if (attrib.attribOpeningQuoteAt !== null && str[_y4] === str[attrib.attribOpeningQuoteAt]) {
            if (_y4 !== i + 1 && str[_y4 - 1] !== "=") {
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
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        if (Number.isInteger(attrib.attribValueStartsAt) && i && attrib.attribValueStartsAt < i && str.slice(attrib.attribValueStartsAt, i).trim().length) {
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
        i: i
      });
    }
    if (!str[i] && token.start !== null) {
      token.end = i;
      token.value = str.slice(token.start, token.end);
      pingTagCb(token);
    }
  }
  if (charStash.length) {
    for (var _i2 = 0, _len2 = charStash.length; _i2 < _len2; _i2++) {
      reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
    }
  }
  if (tagStash.length) {
    for (var _i3 = 0, _len3 = tagStash.length; _i3 < _len3; _i3++) {
      reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
    }
  }
}

module.exports = tokenizer;
