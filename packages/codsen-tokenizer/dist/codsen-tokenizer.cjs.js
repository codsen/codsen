/**
 * codsen-tokenizer
 * Tokenizer for mixed inputs aiming at broken code, especially HTML & CSS
 * Version: 2.2.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var stringMatchLeftRight = require('string-match-left-right');
var stringLeftRight = require('string-left-right');
var isTagOpening = _interopDefault(require('is-html-tag-opening'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var clone = _interopDefault(require('lodash.clonedeep'));

function _typeof(obj) {
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

var allHTMLTagsKnownToHumanity = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"];
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "string" && something.charCodeAt(0) >= 48 && something.charCodeAt(0) <= 57 || Number.isInteger(something);
}
function isLatinLetter(_char4) {
  return isStr(_char4) && _char4.length === 1 && (_char4.charCodeAt(0) > 64 && _char4.charCodeAt(0) < 91 || _char4.charCodeAt(0) > 96 && _char4.charCodeAt(0) < 123);
}
function charSuitableForHTMLAttrName(_char6) {
  return isLatinLetter(_char6) || _char6.charCodeAt(0) >= 48 && _char6.charCodeAt(0) <= 57 || [":", "-"].includes(_char6);
}
function flipEspTag(str) {
  var res = "";
  for (var i = 0, len = str.length; i < len; i++) {
    if (str[i] === "{") {
      res = "}".concat(res);
    } else if (str[i] === "(") {
      res = ")".concat(res);
    } else {
      res = "".concat(str[i]).concat(res);
    }
  }
  return res;
}

var defaults = {
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
var voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
var espChars = "{}%-$_()*|";
var espLumpBlacklist = [")|(", "|(", ")("];
function tokenizer(str, tagCb, charCb, originalOpts) {
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as \"".concat(_typeof(str), "\", equal to:\n").concat(JSON.stringify(str, null, 4)));
    }
  }
  if (tagCb && typeof tagCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_03] the second input argument, callback function, should be a function but it was given as type ".concat(_typeof(tagCb), ", equal to ").concat(JSON.stringify(tagCb, null, 4)));
  }
  if (charCb && typeof charCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_04] the second input argument, callback function, should be a function but it was given as type ".concat(_typeof(charCb), ", equal to ").concat(JSON.stringify(charCb, null, 4)));
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("codsen-tokenizer: [THROW_ID_05] the third input argument, options object, should be a plain object but it was given as type ".concat(_typeof(originalOpts), ", equal to ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var opts = Object.assign({}, defaults, originalOpts);
  if (opts.reportProgressFunc && typeof opts.reportProgressFunc !== "function") {
    throw new TypeError("codsen-tokenizer: [THROW_ID_06] opts.reportProgressFunc should be a function but it was given as :\n".concat(JSON.stringify(opts.reportProgressFunc, null, 4), " (").concat(_typeof(opts.reportProgressFunc), ")"));
  }
  var currentPercentageDone;
  var lastPercentage = 0;
  var len = str.length;
  var midLen = Math.floor(len / 2);
  var doNothing;
  var styleStarts = false;
  var token = {};
  var tokenDefault = {
    type: null,
    start: null,
    end: null,
    tail: null,
    kind: null,
    attribs: []
  };
  function tokenReset() {
    token = Object.assign({}, tokenDefault);
  }
  var attrib = {};
  var attribDefault = {
    parent: null,
    attribName: null,
    attribNameStartAt: null,
    attribNameEndAt: null,
    attribOpeningQuoteAt: null,
    attribClosingQuoteAt: null,
    attribValue: null,
    attribValueStartAt: null,
    attribValueEndAt: null,
    attribStart: null,
    attribEnd: null
  };
  function attribReset() {
    attrib = Object.assign({}, attribDefault);
  }
  tokenReset();
  attribReset();
  var layers = [];
  function matchLayerLast(str, i, matchFirstInstead) {
    if (!layers.length) {
      return false;
    }
    var whichLayerToMatch = matchFirstInstead ? layers[0] : layers[layers.length - 1];
    if (whichLayerToMatch.type === "simple") {
      return str[i] === flipEspTag(whichLayerToMatch.value);
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
          var uniqueCharsListFromGuessedClosingLumpArr = whichLayerToMatch.guessedClosingLump.split("").reduce(function (acc, curr) {
            if (!acc.includes(curr)) {
              return acc.concat([curr]);
            }
            return acc;
          }, []);
          var found = 0;
          var _loop = function _loop(len2, _y) {
            if (!uniqueCharsListFromGuessedClosingLumpArr.includes(wholeEspTagLump[_y]) && found > 1) {
              return {
                v: {
                  v: _y
                }
              };
            }
            if (uniqueCharsListFromGuessedClosingLumpArr.includes(wholeEspTagLump[_y])) {
              found++;
              uniqueCharsListFromGuessedClosingLumpArr = uniqueCharsListFromGuessedClosingLumpArr.filter(function (el) {
                return el !== wholeEspTagLump[_y];
              });
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
    if (!["text", "esp"].includes(token.type) && token.start !== null && token.start < i && str[i - 1] && !str[i - 1].trim().length) {
      token.end = stringLeftRight.left(str, i) + 1;
      pingTagCb(token);
      token.start = stringLeftRight.left(str, i) + 1;
      token.end = null;
      token.type = "text";
    }
    if (token.start !== null) {
      if (token.end === null) {
        token.end = i;
      }
      pingTagCb(token);
    }
  }
  function initHtmlToken() {
    token = Object.assign({
      tagNameStartAt: null,
      tagNameEndAt: null,
      tagName: null,
      recognised: null,
      closing: false,
      "void": false,
      pureHTML: true,
      esp: []
    }, token);
  }
  for (var i = 0; i < len; i++) {
    if (opts.reportProgressFunc) {
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
    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
    }
    if (token.end && token.end === i) {
      if (token.kind === "style") {
        styleStarts = true;
      }
      dumpCurrentToken(token, i);
      layers = [];
    }
    if (!doNothing && ["html", "esp", "css"].includes(token.type)) {
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
    }
    if (!doNothing) {
      if (!layers.length && str[i] === "<" && (isTagOpening(str, i) || str.startsWith("!--", i + 1) || stringMatchLeftRight.matchRight(str, i, ["doctype", "xml", "cdata"], {
        i: true,
        trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
      })) && (token.type !== "esp" || token.tail.includes(str[i]))) {
        if (token.type && Number.isInteger(token.start)) {
          dumpCurrentToken(token, i);
        }
        token.start = i;
        token.type = "html";
        initHtmlToken();
        if (stringMatchLeftRight.matchRight(str, i, "!--")) {
          token.kind = "comment";
        } else if (stringMatchLeftRight.matchRight(str, i, "doctype", {
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
        } else if (stringMatchLeftRight.matchRight(str, i, "style", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-", "/", "\\"]
        })) {
          token.kind = "style";
        }
      } else if (espChars.includes(str[i]) && str[i + 1] && espChars.includes(str[i + 1]) && !(str[i] === "-" && str[i + 1] === "-")) {
        var wholeEspTagLump = "";
        for (var y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagLump = wholeEspTagLump + str[y];
          } else {
            break;
          }
        }
        if (!espLumpBlacklist.includes(wholeEspTagLump)) {
          var lengthOfClosingEspChunk = void 0;
          if (layers.length && matchLayerLast(str, i)) {
            lengthOfClosingEspChunk = matchLayerLast(str, i);
            if (token.type === "esp") {
              if (token.end === null) {
                token.end = i + lengthOfClosingEspChunk;
              }
              dumpCurrentToken(token, i);
            }
            layers.pop();
          } else if (layers.length && matchLayerFirst(str, i)) {
            lengthOfClosingEspChunk = matchLayerFirst(str, i);
            if (token.type === "esp") {
              if (token.end === null) {
                token.end = i + lengthOfClosingEspChunk;
              }
              dumpCurrentToken(token, i);
            }
            layers = [];
          } else {
            layers.push({
              type: "esp",
              openingLump: wholeEspTagLump,
              guessedClosingLump: flipEspTag(wholeEspTagLump),
              position: i
            });
            if (!(token.type === "html" && (token.kind === "comment" ||
            isNum(attrib.attribStart) && attrib.attribEnd === null))) {
              dumpCurrentToken(token, i);
              token.start = i;
              token.type = "esp";
              token.tail = flipEspTag(wholeEspTagLump);
              token.head = wholeEspTagLump;
            }
          }
          doNothing = i + (lengthOfClosingEspChunk ? lengthOfClosingEspChunk : wholeEspTagLump.length);
        }
      } else if (token.start === null || token.end === i) {
        if (styleStarts) {
          if (!str[i].trim().length) {
            token.start = i;
            token.type = "text";
            token.end = stringLeftRight.right(str, i) || str.length;
            pingTagCb(token);
            if (stringLeftRight.right(str, i)) {
              token.start = stringLeftRight.right(str, i);
              token.type = "css";
              doNothing = stringLeftRight.right(str, i);
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
            doNothing = token.end;
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = i + token.tail.length;
            doNothing = token.end;
          } else if (!token.tail.includes(headsFirstChar) && wholeEspTagClosing.includes(headsFirstChar) || wholeEspTagClosing.endsWith(token.head) || wholeEspTagClosing.startsWith(token.tail)) {
            (function () {
              var firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(0, wholeEspTagClosing.indexOf(headsFirstChar));
              var secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(wholeEspTagClosing.indexOf(headsFirstChar));
              if (firstPartOfWholeEspTagClosing.length && secondPartOfWholeEspTagClosing.length && token.tail.split("").every(function (_char2) {
                return firstPartOfWholeEspTagClosing.includes(_char2);
              })) {
                token.end = i + firstPartOfWholeEspTagClosing.length;
                doNothing = token.end;
              }
            })();
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
    if (!doNothing && token.type === "html" && isNum(token.tagNameStartAt) && !isNum(token.tagNameEndAt)) {
      if (!isLatinLetter(str[i]) && !isNum(str[i])) {
        token.tagNameEndAt = i;
        token.tagName = str.slice(token.tagNameStartAt, i);
        if (voidTags.includes(token.tagName)) {
          token["void"] = true;
        }
        token.recognised = allHTMLTagsKnownToHumanity.includes(token.tagName.toLowerCase()) || ["doctype", "cdata", "xml"].includes(token.tagName.toLowerCase());
      }
    }
    if (!doNothing && token.type === "html" && !isNum(token.tagNameStartAt) && isNum(token.start) && token.start < i) {
      if (str[i] === "/") {
        token.closing = true;
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartAt = i;
        if (!token.closing) {
          token.closing = false;
        }
      }
    }
    if (!doNothing && token.type === "html" && isNum(attrib.attribNameStartAt) && i > attrib.attribNameStartAt && attrib.attribNameEndAt === null && !charSuitableForHTMLAttrName(str[i])) {
      attrib.attribNameEndAt = i;
      attrib.attribName = str.slice(attrib.attribNameStartAt, i);
      if (!str[i].trim().length) {
        attrib.attribEnd = i;
        token.attribs.push(Object.assign({}, attrib));
        attribReset();
      }
    }
    if (!doNothing && token.type === "html" && isNum(token.tagNameEndAt) && i > token.tagNameEndAt && attrib.attribStart === null && charSuitableForHTMLAttrName(str[i])) {
      attrib.attribStart = i;
      attrib.attribNameStartAt = i;
    }
    if (!doNothing && token.type === "html" && isNum(attrib.attribValueStartAt) && i > attrib.attribValueStartAt && attrib.attribValueEndAt === null) {
      if ("'\"".includes(str[i])) {
        if (str[attrib.attribOpeningQuoteAt] === str[i] && !layers.some(function (layerObj) {
          return layerObj.type === "esp";
        })) {
          attrib.attribClosingQuoteAt = i;
          attrib.attribValueEndAt = i;
          attrib.attribValue = str.slice(attrib.attribValueStartAt, i);
          attrib.attribEnd = i + 1;
          token.attribs.push(Object.assign({}, attrib));
          attribReset();
        }
      }
    }
    if (!doNothing && token.type === "html" && !isNum(attrib.attribValueStartAt) && isNum(attrib.attribNameEndAt) && attrib.attribNameEndAt <= i && str[i].trim().length) {
      if (str[i] === "=" && !"'\"=".includes(str[stringLeftRight.right(str, i)]) && !espChars.includes(str[stringLeftRight.right(str, i)])
      ) {
          attrib.attribValueStartAt = stringLeftRight.right(str, i);
        } else if ("'\"".includes(str[i])) {
        attrib.attribOpeningQuoteAt = i;
        if (str[i + 1]) {
          attrib.attribValueStartAt = i + 1;
        }
      }
    }
    if (charCb) {
      pingCharCb({
        type: token.type,
        chr: str[i],
        i: i
      });
    }
    if (!str[i + 1] && token.start !== null) {
      token.end = i + 1;
      pingTagCb(token);
    }
  }
}

module.exports = tokenizer;
