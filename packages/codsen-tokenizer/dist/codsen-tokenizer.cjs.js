/**
 * codsen-tokenizer
 * Tokenizer for mixed inputs aiming at broken code, especially HTML & CSS
 * Version: 2.6.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var htmlAllKnownAttributes = require('html-all-known-attributes');
var stringMatchLeftRight = require('string-match-left-right');
var stringLeftRight = require('string-left-right');
var isTagOpening = _interopDefault(require('is-html-tag-opening'));
var clone = _interopDefault(require('lodash.clonedeep'));

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

function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
var voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
var espChars = "{}%-$_()*|";
var espLumpBlacklist = [")|(", "|(", ")(", "()", "%)", "*)", "**"];
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
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100,
    tagCb: null,
    charCb: null
  };
  var opts = Object.assign({}, defaults, originalOpts);
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
    console.log("175 ".concat("\x1B[".concat(36, "m", "\u2588\u2588 tokenReset():", "\x1B[", 39, "m"), " tokenReset() called"));
    token = clone(tokenDefault);
    attribReset();
    return token;
  }
  var attrib = {};
  var attribDefault = {
    attribName: null,
    attribNameRecognised: null,
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
    attrib = clone(attribDefault);
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
        console.log("270 ".concat("\x1B[".concat(33, "m", "wholeEspTagLump", "\x1B[", 39, "m"), " = ", JSON.stringify(wholeEspTagLump, null, 4)));
        console.log("277 ".concat("\x1B[".concat(33, "m", "whichLayerToMatch.openingLump", "\x1B[", 39, "m"), " = ", JSON.stringify(whichLayerToMatch.openingLump, null, 4)));
        if (wholeEspTagLump && whichLayerToMatch.openingLump && wholeEspTagLump.length > whichLayerToMatch.guessedClosingLump.length) {
          if (wholeEspTagLump.endsWith(whichLayerToMatch.openingLump)) {
            console.log("299 RETURN ".concat(wholeEspTagLump.length - whichLayerToMatch.openingLump.length));
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
          console.log("322 ".concat("\x1B[".concat(33, "m", "uniqueCharsListFromGuessedClosingLumpArr", "\x1B[", 39, "m"), " = ", JSON.stringify(uniqueCharsListFromGuessedClosingLumpArr, null, 0)));
          var found = 0;
          var _loop = function _loop(len2, _y) {
            console.log("331 char = ".concat(wholeEspTagLump[_y]));
            if (!uniqueCharsListFromGuessedClosingLumpArr.includes(wholeEspTagLump[_y]) && found > 1) {
              console.log("339 RETURN ".concat(_y));
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
              console.log("353 SET found = ".concat(found, "; uniqueCharsListFromGuessedClosingLumpArr = ").concat(JSON.stringify(uniqueCharsListFromGuessedClosingLumpArr, null, 0)));
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
          console.log("368 RETURN ".concat(wholeEspTagLump.length));
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
    if (opts.charCb) {
      opts.charCb(incomingToken);
    }
  }
  function pingTagCb(incomingToken) {
    if (opts.tagCb) {
      console.log("388 ".concat("\x1B[".concat(32, "m", "PING", "\x1B[", 39, "m"), " tagCb() with ", JSON.stringify(incomingToken, null, 4)));
      opts.tagCb(clone(incomingToken));
    }
  }
  function dumpCurrentToken(token, i) {
    console.log("401 ".concat("\x1B[".concat(35, "m", "dumpCurrentToken()", "\x1B[", 39, "m"), "; incoming token=", JSON.stringify(token, null, 0), "; i = ", "\x1B[".concat(33, "m", i, "\x1B[", 39, "m")));
    if (!["text", "esp"].includes(token.type) && token.start !== null && token.start < i && (str[i - 1] && !str[i - 1].trim().length || str[i] === "<")) {
      console.log("418 ".concat(str[i] === "<" ? "this token was an unclosed tag" : "this token indeed had trailing whitespace"));
      token.end = stringLeftRight.left(str, i) + 1;
      console.log("432 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end, " (last two characters ending at token.end: ").concat(JSON.stringify(str[token.end - 1], null, 4), " + ").concat(JSON.stringify(str[token.end], null, 4), ")"));
      if (token.type === "html" && str[token.end - 1] !== ">") {
        console.log("442 ".concat("\x1B[".concat(35, "m", "\u2588\u2588 UNCLOSED TAG CASES", "\x1B[", 39, "m")));
        var cutOffIndex = token.tagNameEndAt;
        if (Array.isArray(token.attribs) && token.attribs.length) {
          console.log("461 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 validate all attributes", "\x1B[", 39, "m")));
          console.log("464 SET cutOffIndex = ".concat(cutOffIndex));
          for (var _i = 0, _len = token.attribs.length; _i < _len; _i++) {
            console.log("468 ".concat("\x1B[".concat(36, "m", "token.attribs[".concat(_i, "]"), "\x1B[", 39, "m"), " = ", JSON.stringify(token.attribs[_i], null, 4)));
            if (token.attribs[_i].attribNameRecognised) {
              cutOffIndex = token.attribs[_i].attribEnd;
              console.log("477 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "cutOffIndex", "\x1B[", 39, "m"), " = ", cutOffIndex));
              if (str[cutOffIndex + 1] && !str[cutOffIndex].trim().length && str[cutOffIndex + 1].trim().length) {
                cutOffIndex++;
                console.log("496 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "cutOffIndex", "\x1B[", 39, "m"), " = ", cutOffIndex));
              }
            } else {
              console.log("500 ".concat("\x1B[".concat(31, "m", "BREAK", "\x1B[", 39, "m")));
              if (_i === 0) {
                token.attribs = [];
              } else {
                token.attribs = token.attribs.splice(0, _i);
              }
              console.log("513 ".concat("\x1B[".concat(32, "m", "CALCULATED", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.attribs", "\x1B[", 39, "m"), " = ", JSON.stringify(token.attribs, null, 4)));
              break;
            }
          }
        }
        token.end = cutOffIndex;
        console.log("527 ".concat("\x1B[".concat(32, "m", "PING", "\x1B[", 39, "m")));
        pingTagCb(token);
        console.log("529 ".concat("\x1B[".concat(31, "m", "RESET", "\x1B[", 39, "m"), " token"));
        token = tokenReset();
        token.start = cutOffIndex;
        token.type = "text";
      } else {
        console.log("534 ".concat("\x1B[".concat(35, "m", "\u2588\u2588 HEALTHY TAG", "\x1B[", 39, "m")));
        console.log("535 ".concat("\x1B[".concat(32, "m", "PING", "\x1B[", 39, "m")));
        pingTagCb(token);
        console.log("537 ".concat("\x1B[".concat(31, "m", "RESET", "\x1B[", 39, "m"), " token"));
        token = tokenReset();
        if (!str[i - 1].trim().length) {
          console.log("541 indeed there was whitespace after token's end");
          token.start = stringLeftRight.left(str, i) + 1;
          token.type = "text";
          console.log("545 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
        }
      }
      console.log("553 FINALLY, ".concat("\x1B[".concat(33, "m", "token", "\x1B[", 39, "m"), " = ", JSON.stringify(token, null, 4)));
    }
    if (token.start !== null) {
      if (token.end === null && token.start !== i) {
        token.end = i;
        console.log("567 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
      }
      console.log("572 ".concat("\x1B[".concat(32, "m", "PING", "\x1B[", 39, "m")));
      pingTagCb(token);
      console.log("575 ".concat("\x1B[".concat(31, "m", "RESET", "\x1B[", 39, "m"), " token"));
      token = tokenReset();
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
  for (var i = 0; i <= len; i++) {
    console.log("\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 35, "m", "str[ ".concat(i, " ] = ").concat(str[i] && str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 4)), "\x1B[", 39, "m \x1B[", 36, "m", "===============================", "\x1B[", 39, "m\n"));
    if (str[i] && opts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (i === midLen) {
          opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
        }
      } else if (len >= 2000) {
        currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / len * (opts.reportProgressFuncTo - opts.reportProgressFuncFrom));
        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
          console.log("656 DONE ".concat(currentPercentageDone, "%"));
        }
      }
    }
    if (styleStarts && token.type !== "css") {
      styleStarts = false;
      console.log("667 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "styleStarts", "\x1B[", 39, "m"), " = false"));
    }
    if (Number.isInteger(doNothing) && i >= doNothing) {
      doNothing = false;
      console.log("674 TURN OFF doNothing");
    }
    if (token.end && token.end === i) {
      console.log("679 call dumpCurrentToken()");
      if (token.kind === "style") {
        styleStarts = true;
        console.log("683 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "styleStarts", "\x1B[", 39, "m"), " = true"));
      }
      dumpCurrentToken(token, i);
      console.log("689 ".concat("\x1B[".concat(31, "m", "WIPE", "\x1B[", 39, "m"), " layers"));
      layers = [];
    }
    if (!doNothing && ["html", "esp", "css"].includes(token.type)) {
      console.log("707 inside layers clauses");
      if (["\"", "'", "(", ")"].includes(str[i]) && !(
      ["\"", "'"].includes(str[stringLeftRight.left(str, i)]) && str[stringLeftRight.left(str, i)] === str[stringLeftRight.right(str, i)])) {
        if (matchLayerLast(str, i)) {
          layers.pop();
          console.log("724 ".concat("\x1B[".concat(32, "m", "POP", "\x1B[", 39, "m"), " layers"));
        } else {
          layers.push({
            type: "simple",
            value: str[i],
            position: i
          });
          console.log("733 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
            type: "simple",
            value: str[i]
          }, null, 4)));
        }
      }
      console.log("746 now ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
    }
    if (!doNothing) {
      if (str[i] === "<" && (token.type === "text" && isTagOpening(str, i) || !layers.length) && (isTagOpening(str, i) || str.startsWith("!--", i + 1) || stringMatchLeftRight.matchRight(str, i, ["doctype", "xml", "cdata"], {
        i: true,
        trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
      })) && (token.type !== "esp" || token.tail.includes(str[i]))) {
        console.log("773 html tag opening");
        if (token.type && Number.isInteger(token.start) && token.start !== i) {
          console.log("776 call dumpCurrentToken()");
          dumpCurrentToken(token, i);
        } else {
          console.log("779 didn't call dumpCurrentToken()");
        }
        console.log("782 ".concat("\x1B[".concat(31, "m", "RESET", "\x1B[", 39, "m"), " token"));
        tokenReset();
        token.start = i;
        token.type = "html";
        console.log("788 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
        if (styleStarts) {
          styleStarts = false;
          console.log("796 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "styleStarts", "\x1B[", 39, "m"), " = false"));
        }
        initHtmlToken();
        if (stringMatchLeftRight.matchRight(str, i, "!--")) {
          token.kind = "comment";
          console.log("806 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        } else if (stringMatchLeftRight.matchRight(str, i, "doctype", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
        })) {
          token.kind = "doctype";
          console.log("818 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        } else if (stringMatchLeftRight.matchRight(str, i, "cdata", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
        })) {
          token.kind = "cdata";
          console.log("830 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        } else if (stringMatchLeftRight.matchRight(str, i, "xml", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
        })) {
          token.kind = "xml";
          console.log("842 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        } else if (stringMatchLeftRight.matchRight(str, i, "style", {
          i: true,
          trimCharsBeforeMatching: ["?", "!", "[", " ", "-", "/", "\\"]
        })) {
          token.kind = "style";
          console.log("854 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.kind", "\x1B[", 39, "m"), " = ", token.kind));
        }
      } else if (espChars.includes(str[i]) && str[i + 1] && espChars.includes(str[i + 1]) && !(str[i] === "-" && str[i + 1] === "-") && !(
      "0123456789".includes(str[stringLeftRight.left(str, i)]) && (!str[i + 2] || ["\"", "'", ";"].includes(str[i + 2]) || !str[i + 2].trim().length))) {
        console.log("874 ESP tag detected");
        var wholeEspTagLump = "";
        for (var y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagLump = wholeEspTagLump + str[y];
          } else {
            break;
          }
        }
        console.log("889 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " wholeEspTagLump = ", wholeEspTagLump));
        console.log("892 FIY, ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
        console.log("899 FIY, ".concat("\x1B[".concat(33, "m", "token", "\x1B[", 39, "m"), " = ", JSON.stringify(token, null, 4)));
        if (!espLumpBlacklist.includes(wholeEspTagLump) && (!Array.isArray(layers) || !layers.length || layers[layers.length - 1].type !== "simple" || layers[layers.length - 1].value !== str[i + wholeEspTagLump.length])) {
          var lengthOfClosingEspChunk = void 0;
          if (layers.length && matchLayerLast(str, i)) {
            console.log("921 closing part of a set ".concat("\x1B[".concat(32, "m", "MATCHED", "\x1B[", 39, "m"), " against the last layer"));
            lengthOfClosingEspChunk = matchLayerLast(str, i);
            console.log("925 ".concat("\x1B[".concat(33, "m", "lengthOfClosingEspChunk", "\x1B[", 39, "m"), " = ", JSON.stringify(lengthOfClosingEspChunk, null, 4)));
            if (token.type === "esp") {
              if (token.end === null) {
                token.end = i + lengthOfClosingEspChunk;
                console.log("938 SET ".concat("\x1B[".concat(32, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
              }
              console.log("944 ".concat("\x1B[".concat(33, "m", "token", "\x1B[", 39, "m"), " = ", JSON.stringify(token, null, 4), " before pinging"));
              dumpCurrentToken(token, i);
              console.log("953 ".concat("\x1B[".concat(31, "m", "RESET", "\x1B[", 39, "m"), " token"));
              tokenReset();
            }
            layers.pop();
            console.log("961 ".concat("\x1B[".concat(32, "m", "POP", "\x1B[", 39, "m"), " layers"));
          } else if (layers.length && matchLayerFirst(str, i)) {
            console.log("964 closing part of a set ".concat("\x1B[".concat(32, "m", "MATCHED", "\x1B[", 39, "m"), " against first layer"));
            console.log("967 wipe all layers, there were strange unclosed characters");
            lengthOfClosingEspChunk = matchLayerFirst(str, i);
            console.log("971 ".concat("\x1B[".concat(33, "m", "lengthOfClosingEspChunk", "\x1B[", 39, "m"), " = ", JSON.stringify(lengthOfClosingEspChunk, null, 4)));
            if (token.type === "esp") {
              if (token.end === null) {
                token.end = i + lengthOfClosingEspChunk;
                console.log("984 ".concat("\x1B[".concat(33, "m", "token", "\x1B[", 39, "m"), " = ", JSON.stringify(token, null, 4), " before pinging"));
              }
              dumpCurrentToken(token, i);
              console.log("994 ".concat("\x1B[".concat(31, "m", "RESET", "\x1B[", 39, "m"), " token"));
              tokenReset();
            }
            layers = [];
            console.log("1002 ".concat("\x1B[".concat(32, "m", "WIPE", "\x1B[", 39, "m"), " layers"));
          } else {
            console.log("1005 closing part of a set ".concat("\x1B[".concat(31, "m", "NOT MATCHED", "\x1B[", 39, "m"), " - means it's a new opening"));
            console.log("1007 push new layer");
            layers.push({
              type: "esp",
              openingLump: wholeEspTagLump,
              guessedClosingLump: flipEspTag(wholeEspTagLump),
              position: i
            });
            console.log("1015 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify({
              type: "esp",
              openingLump: wholeEspTagLump,
              guessedClosingLump: flipEspTag(wholeEspTagLump),
              position: i
            }, null, 4)));
            console.log("1027 ".concat("\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), " = ", JSON.stringify(layers, null, 4)));
            if (!(token.type === "html" && (token.kind === "comment" ||
            isNum(attrib.attribStart) && attrib.attribEnd === null))) {
              console.log("1046 ".concat("\x1B[".concat(36, "m", "\u2588\u2588", "\x1B[", 39, "m"), " standalone ESP tag"));
              dumpCurrentToken(token, i);
              tokenReset();
              token.start = i;
              token.type = "esp";
              console.log("1054 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
              token.tail = flipEspTag(wholeEspTagLump);
              console.log("1062 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.tail", "\x1B[", 39, "m"), " = ", token.tail));
              token.head = wholeEspTagLump;
            }
          }
          doNothing = i + (lengthOfClosingEspChunk ? lengthOfClosingEspChunk : wholeEspTagLump.length);
          console.log("1077 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
        }
      } else if (token.start === null || token.end === i) {
        if (styleStarts) {
          console.log("1084");
          if (str[i] && !str[i].trim().length) {
            console.log("1087 ".concat("\x1B[".concat(31, "m", "RESET", "\x1B[", 39, "m"), " token"));
            tokenReset();
            token.start = i;
            token.type = "text";
            token.end = stringLeftRight.right(str, i) || str.length;
            console.log("1093 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ").concat(token.end, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
            pingTagCb(token);
            if (stringLeftRight.right(str, i)) {
              console.log("1105 ".concat("\x1B[".concat(31, "m", "RESET", "\x1B[", 39, "m"), " token"));
              tokenReset();
              token.start = stringLeftRight.right(str, i);
              token.type = "css";
              console.log("1112 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
              doNothing = stringLeftRight.right(str, i);
              console.log("1121 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
            }
          } else {
            console.log("1126 ".concat("\x1B[".concat(31, "m", "RESET", "\x1B[", 39, "m"), " token"));
            tokenReset();
            token.start = i;
            token.type = "css";
            console.log("1132 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start, "; ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ").concat(token.type));
          }
        } else if (str[i]) {
          console.log("1139 ".concat("\x1B[".concat(31, "m", "reset", "\x1B[", 39, "m"), " token"));
          token = tokenReset();
          token.start = i;
          console.log("1146 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.start", "\x1B[", 39, "m"), " = ", token.start));
          token.type = "text";
          attribReset();
          console.log("1154 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.type", "\x1B[", 39, "m"), " = ", token.type, "; ", "\x1B[".concat(33, "m", "token.attribs", "\x1B[", 39, "m"), " = ").concat(token.attribs));
          console.log("1161 ".concat("\x1B[".concat(31, "m", "WIPE", "\x1B[", 39, "m"), " layers"));
          layers = [];
        }
      }
    }
    if (!doNothing) {
      if (token.type === "html" && !layers.length && str[i] === ">") {
        token.end = i + 1;
        console.log("1175 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
      } else if (token.type === "esp" && token.end === null && isStr(token.tail) && token.tail.includes(str[i])) {
        console.log("1186 POSSIBLE ESP TAILS");
        var wholeEspTagClosing = "";
        for (var _y2 = i; _y2 < len; _y2++) {
          if (espChars.includes(str[_y2])) {
            wholeEspTagClosing = wholeEspTagClosing + str[_y2];
          } else {
            break;
          }
        }
        console.log("1197 wholeEspTagClosing = ".concat(wholeEspTagClosing));
        if (wholeEspTagClosing.length > token.head.length) {
          console.log("1207 wholeEspTagClosing.length = ".concat("\x1B[".concat(33, "m", wholeEspTagClosing.length, "\x1B[", 39, "m"), " > token.head.length = ", "\x1B[".concat(33, "m", token.head.length, "\x1B[", 39, "m")));
          var headsFirstChar = token.head[0];
          if (wholeEspTagClosing.endsWith(token.head)) {
            console.log("1235 - chunk ends with the same heads");
            token.end = i + wholeEspTagClosing.length - token.head.length;
            console.log("1257 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
            doNothing = token.end;
            console.log("1263 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = i + token.tail.length;
            console.log("1268 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
            doNothing = token.end;
            console.log("1274 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
          } else if (!token.tail.includes(headsFirstChar) && wholeEspTagClosing.includes(headsFirstChar) || wholeEspTagClosing.endsWith(token.head) || wholeEspTagClosing.startsWith(token.tail)) {
            (function () {
              console.log("1282");
              var firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(0, wholeEspTagClosing.indexOf(headsFirstChar));
              var secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(wholeEspTagClosing.indexOf(headsFirstChar));
              console.log("".concat("\x1B[".concat(33, "m", "firstPartOfWholeEspTagClosing", "\x1B[", 39, "m"), " = ", JSON.stringify(firstPartOfWholeEspTagClosing, null, 4)));
              console.log("".concat("\x1B[".concat(33, "m", "secondPartOfWholeEspTagClosing", "\x1B[", 39, "m"), " = ", JSON.stringify(secondPartOfWholeEspTagClosing, null, 4)));
              if (firstPartOfWholeEspTagClosing.length && secondPartOfWholeEspTagClosing.length && token.tail.split("").every(function (_char2) {
                return firstPartOfWholeEspTagClosing.includes(_char2);
              })) {
                console.log("1317 definitely tails + new heads");
                token.end = i + firstPartOfWholeEspTagClosing.length;
                console.log("1320 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
                doNothing = token.end;
                console.log("1326 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
              }
            })();
          } else {
            console.log("CASE #2.");
            token.end = i + wholeEspTagClosing.length;
            console.log("1341 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
            doNothing = token.end;
            console.log("1347 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
          }
          console.log("1350");
        } else {
          token.end = i + wholeEspTagClosing.length;
          console.log("1355 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
          doNothing = token.end;
          console.log("1361 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(31, "m", "doNothing", "\x1B[", 39, "m"), " = ", doNothing));
        }
      }
    }
    if (!doNothing && token.type === "html" && isNum(token.tagNameStartAt) && !isNum(token.tagNameEndAt)) {
      console.log("1377 catch the end of a tag name clauses");
      if (!isLatinLetter(str[i]) && !isNum(str[i])) {
        token.tagNameEndAt = i;
        console.log("1383 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.tagNameEndAt", "\x1B[", 39, "m"), " = ", token.tagNameEndAt));
        token.tagName = str.slice(token.tagNameStartAt, i).toLowerCase();
        console.log("1390 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.tagName", "\x1B[", 39, "m"), " = ", token.tagName));
        if (voidTags.includes(token.tagName)) {
          token["void"] = true;
          console.log("1401 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.void", "\x1B[", 39, "m"), " = ", token["void"]));
        }
        token.recognised = allHTMLTagsKnownToHumanity.includes(token.tagName.toLowerCase()) || ["doctype", "cdata", "xml"].includes(token.tagName.toLowerCase());
        console.log("1411 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.recognised", "\x1B[", 39, "m"), " = ", token.recognised));
      }
    }
    if (!doNothing && token.type === "html" && !isNum(token.tagNameStartAt) && isNum(token.start) && token.start < i) {
      if (str[i] === "/") {
        token.closing = true;
        console.log("1434 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.closing", "\x1B[", 39, "m"), " = ", token.closing));
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartAt = i;
        console.log("1441 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.tagNameStartAt", "\x1B[", 39, "m"), " = ", token.tagNameStartAt));
        if (!token.closing) {
          token.closing = false;
          console.log("1450 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.closing", "\x1B[", 39, "m"), " = ", token.closing));
        }
      }
    }
    if (!doNothing && token.type === "html" && isNum(attrib.attribNameStartAt) && i > attrib.attribNameStartAt && attrib.attribNameEndAt === null && !charSuitableForHTMLAttrName(str[i])) {
      console.log("1471 inside catch the tag attribute name end clauses");
      attrib.attribNameEndAt = i;
      attrib.attribName = str.slice(attrib.attribNameStartAt, i);
      attrib.attribNameRecognised = htmlAllKnownAttributes.allHtmlAttribs.includes(attrib.attribName);
      console.log("1476 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "attrib.attribNameEndAt", "\x1B[", 39, "m"), " = ", attrib.attribNameEndAt, "; ", "\x1B[".concat(33, "m", "attrib.attribName", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(attrib.attribName, null, 0)));
      if (str[i] && !str[i].trim().length && str[stringLeftRight.right(str, i)] === "=") {
        console.log("1487 equal on the right");
      } else if (str[i] && !str[i].trim().length || str[i] === ">" || str[i] === "/" && str[stringLeftRight.right(str, i)] === ">") {
        attrib.attribEnd = i;
        console.log("1496 SET ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "attrib.attribNameEndAt", "\x1B[", 39, "m"), " = ", attrib.attribEnd));
        token.attribs.push(clone(attrib));
        attribReset();
      }
    }
    if (!doNothing && token.type === "html" && isNum(token.tagNameEndAt) && i > token.tagNameEndAt && attrib.attribStart === null && charSuitableForHTMLAttrName(str[i])) {
      console.log("1517 inside catch the tag attribute name start clauses");
      attrib.attribStart = i;
      attrib.attribNameStartAt = i;
      console.log("1521 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "attrib.attribStart", "\x1B[", 39, "m"), " = ", attrib.attribStart, "; ", "\x1B[".concat(33, "m", "attrib.attribNameStartAt", "\x1B[", 39, "m"), " = ").concat(attrib.attribNameStartAt));
    }
    if (!doNothing && token.type === "html" && isNum(attrib.attribValueStartAt) && i >= attrib.attribValueStartAt && attrib.attribValueEndAt === null) {
      console.log("1539 inside catching end of a tag attr clauses");
      if ("'\"".includes(str[i])) {
        if (str[attrib.attribOpeningQuoteAt] === str[i] && !layers.some(function (layerObj) {
          return layerObj.type === "esp";
        })) {
          console.log("1546 opening and closing quotes matched!");
          attrib.attribClosingQuoteAt = i;
          attrib.attribValueEndAt = i;
          attrib.attribValue = str.slice(attrib.attribValueStartAt, i);
          attrib.attribEnd = i + 1;
          console.log("1552 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "attrib.attribClosingQuoteAt", "\x1B[", 39, "m"), " = ", attrib.attribClosingQuoteAt, "; ", "\x1B[".concat(33, "m", "attrib.attribValueEndAt", "\x1B[", 39, "m"), " = ").concat(attrib.attribValueEndAt, "; ", "\x1B[".concat(33, "m", "attrib.attribValue", "\x1B[", 39, "m"), " = ").concat(attrib.attribValue, "; ", "\x1B[".concat(33, "m", "attrib.attribEnd", "\x1B[", 39, "m"), " = ").concat(attrib.attribEnd));
          token.attribs.push(clone(attrib));
          attribReset();
        }
      } else if (attrib.attribOpeningQuoteAt === null && (!str[i].trim().length || ["/", ">"].includes(str[i]) || espChars.includes(str[i]) && espChars.includes(str[i + 1]))) {
        console.log("1575 opening quote was missing, terminate attr val here");
        attrib.attribValueEndAt = i;
        attrib.attribValue = str.slice(attrib.attribValueStartAt, i);
        attrib.attribEnd = i;
        console.log("1581 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "attrib.attribValueEndAt", "\x1B[", 39, "m"), " = ", attrib.attribValueEndAt, "; ", "\x1B[".concat(33, "m", "attrib.attribValue", "\x1B[", 39, "m"), " = ").concat(attrib.attribValue, "; ", "\x1B[".concat(33, "m", "attrib.attribEnd", "\x1B[", 39, "m"), " = ").concat(attrib.attribEnd));
        token.attribs.push(clone(attrib));
        attribReset();
      }
    }
    if (!doNothing && token.type === "html" && !isNum(attrib.attribValueStartAt) && isNum(attrib.attribNameEndAt) && attrib.attribNameEndAt <= i && str[i].trim().length) {
      console.log("1607 inside catching attr value start clauses");
      if (str[i] === "=" && !"'\"=".includes(str[stringLeftRight.right(str, i)]) && !espChars.includes(str[stringLeftRight.right(str, i)])
      ) {
          attrib.attribValueStartAt = stringLeftRight.right(str, i);
          console.log("1615 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "attrib.attribValueStartAt", "\x1B[", 39, "m"), " = ", attrib.attribValueStartAt));
        } else if ("'\"".includes(str[i])) {
        attrib.attribOpeningQuoteAt = i;
        if (str[i + 1]) {
          attrib.attribValueStartAt = i + 1;
        }
        console.log("1625 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "attrib.attribOpeningQuoteAt", "\x1B[", 39, "m"), " = ", attrib.attribOpeningQuoteAt, "; ", "\x1B[".concat(33, "m", "attrib.attribValueStartAt", "\x1B[", 39, "m"), " = ").concat(attrib.attribValueStartAt));
      }
    }
    if (str[i] === ">" && token.type === "html" && attrib.attribStart !== null && attrib.attribEnd === null) {
      console.log("1656 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " bracket within attribute's value"));
      var thisIsRealEnding = false;
      if (str[i + 1]) {
        for (var _y3 = i + 1; _y3 < len; _y3++) {
          console.log("1675 ".concat("\x1B[".concat(36, "m", "str[".concat(_y3, "] = ").concat(JSON.stringify(str[_y3], null, 0)), "\x1B[", 39, "m")));
          if (attrib.attribOpeningQuoteAt !== null && str[_y3] === str[attrib.attribOpeningQuoteAt]) {
            console.log("1688 closing quote (".concat(str[attrib.attribOpeningQuoteAt], ") found, ", "\x1B[".concat(31, "m", "BREAK", "\x1B[", 39, "m")));
            if (_y3 !== i + 1 && str[_y3 - 1] !== "=") {
              thisIsRealEnding = true;
              console.log("1695 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "thisIsRealEnding", "\x1B[", 39, "m"), " = ", thisIsRealEnding));
            }
            break;
          } else if (str[_y3] === ">") {
            break;
          } else if (str[_y3] === "<") {
            thisIsRealEnding = true;
            console.log("1706 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "thisIsRealEnding", "\x1B[", 39, "m"), " = ", thisIsRealEnding));
            layers.pop();
            console.log("1713 ".concat("\x1B[".concat(31, "m", "POP", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "layers", "\x1B[", 39, "m"), ", now:\n", JSON.stringify(layers, null, 4)));
            console.log("1720 break");
            break;
          } else if (!str[_y3 + 1]) {
            thisIsRealEnding = true;
            console.log("1726 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "thisIsRealEnding", "\x1B[", 39, "m"), " = ", thisIsRealEnding));
            console.log("1729 break");
            break;
          }
        }
      } else {
        console.log("1734 string ends so this was the bracket");
        thisIsRealEnding = true;
      }
      if (thisIsRealEnding) {
        token.end = i + 1;
        console.log("1750 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "token.end", "\x1B[", 39, "m"), " = ", token.end));
        if (Number.isInteger(attrib.attribValueStartAt) && attrib.attribValueStartAt < i && str.slice(attrib.attribValueStartAt, i).trim().length) {
          attrib.attribValueEndAt = i;
          attrib.attribValue = str.slice(attrib.attribValueStartAt, i);
        } else {
          attrib.attribValueStartAt = null;
        }
        attrib.attribEnd = i;
        console.log("1772 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), "  ", "\x1B[".concat(33, "m", "attrib.attribEnd", "\x1B[", 39, "m"), " = ", attrib.attribEnd));
        console.log("1779 ".concat("\x1B[".concat(32, "m", "attrib wipe, push and reset", "\x1B[", 39, "m")));
        token.attribs.push(clone(attrib));
        attribReset();
      }
    }
    if (str[i] && opts.charCb) {
      console.log("1808 ".concat("\x1B[".concat(32, "m", "PING", "\x1B[", 39, "m"), " ", JSON.stringify({
        type: token.type,
        chr: str[i],
        i: i
      }, null, 4)));
      pingCharCb({
        type: token.type,
        chr: str[i],
        i: i
      });
    }
    if (!str[i] && token.start !== null) {
      token.end = i;
      console.log("1838 ".concat("\x1B[".concat(32, "m", "PING", "\x1B[", 39, "m")));
      pingTagCb(token);
    }
    console.log("".concat("\x1B[".concat(90, "m", "==========================================\n\u2588\u2588 token: ".concat(JSON.stringify(token, null, 4)).concat(attrib.attribStart !== null ? "\n\u2588\u2588 attrib: ".concat(JSON.stringify(attrib, null, 4)) : "").concat(layers.length ? "\n\u2588\u2588 layers: ".concat(JSON.stringify(layers, null, 4)) : ""), "\x1B[", 39, "m"), doNothing ? "\n".concat("\x1B[".concat(31, "m", "DO NOTHING UNTIL ".concat(doNothing), "\x1B[", 39, "m")) : ""));
    console.log("".concat("\x1B[".concat(90, "m", "styleStarts = ".concat(styleStarts), "\x1B[", 39, "m")));
  }
}

module.exports = tokenizer;
