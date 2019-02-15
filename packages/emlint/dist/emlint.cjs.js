/**
 * emlint
 * Detects errors in HTML/CSS, proposes fixes, email-template friendly
 * Version: 0.7.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/emlint
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var checkTypes = _interopDefault(require('check-types-mini'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var clone = _interopDefault(require('lodash.clonedeep'));
var merge = _interopDefault(require('ranges-merge'));

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

var version = "0.7.0";

var lowAsciiCharacterNames = ["null", "start-of-heading", "start-of-text", "end-of-text", "end-of-transmission", "enquiry", "acknowledge", "bell", "backspace", "character-tabulation", "line-feed", "line-tabulation", "form-feed", "carriage-return", "shift-out", "shift-in", "data-link-escape", "device-control-one", "device-control-two", "device-control-three", "device-control-four", "negative-acknowledge", "synchronous-idle", "end-of-transmission-block", "cancel", "end-of-medium", "substitute", "escape", "information-separator-four", "information-separator-three", "information-separator-two", "information-separator-one", "space", "exclamation-mark"];
var knownHTMLTags = ["abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"];
function charSuitableForAttrName(char) {
  var res = !"\"'><=".includes(char);
  console.log("157 emlint/util/charSuitableForAttrName(): return ".concat(res));
  return res;
}
function charIsQuote(char) {
  var res = "\"'\u2018\u2019\u201D\u201D".includes(char);
  console.log("163 emlint/util/charIsQuote(): return ".concat(res));
  return res;
}
function notTagChar(char) {
  if (typeof char !== "string" || char.length > 1) {
    throw new Error("emlint/util/charNotTag(): input is not a single string character!");
  }
  var res = !"><=".includes(char);
  console.log("174 emlint/util/charNotTag(): return ".concat(res));
  return res;
}
function isLowerCaseLetter(char) {
  return isStr(char) && char.length === 1 && char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123;
}
function isUppercaseLetter(char) {
  return isStr(char) && char.length === 1 && char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91;
}
function isStr(something) {
  return typeof something === "string";
}
function isLatinLetter(char) {
  return isStr(char) && char.length === 1 && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
}
function charSuitableForTagName(char) {
  return isLowerCaseLetter(char);
}
function log() {
  for (var _len = arguments.length, pairs = new Array(_len), _key = 0; _key < _len; _key++) {
    pairs[_key] = arguments[_key];
  }
  return pairs.reduce(function (accum, curr, idx, arr) {
    if (idx === 0 && typeof curr === "string") {
      return "\x1B[".concat(32, "m", curr.toUpperCase(), "\x1B[", 39, "m");
    } else if (idx % 2 !== 0) {
      return "".concat(accum, " \x1B[", 33, "m").concat(curr, "\x1B[", 39, "m");
    }
    return "".concat(accum, " = ").concat(JSON.stringify(curr, null, 4)).concat(arr[idx + 1] ? ";" : "");
  }, "");
}
function withinTagInnerspace(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  console.log("250 withinTagInnerspace() called, idx = ".concat(idx));
  var whitespaceStartAt = null;
  var closingBracket = {
    at: null,
    last: false,
    precedes: false
  };
  var slash = {
    at: null,
    last: false,
    precedes: false
  };
  var quotes = {
    at: null,
    last: false,
    precedes: false,
    within: false
  };
  var beginningOfAString = true;
  var r2_1 = false;
  var r2_2 = false;
  var r2_3 = false;
  var r2_4 = false;
  var r3_1 = false;
  var r3_2 = false;
  var r3_3 = false;
  var r3_4 = false;
  var r3_5 = false;
  var r4_1 = false;
  for (var i = idx, len = str.length; i < len; i++) {
    var charcode = str[i].charCodeAt(0);
    console.log("".concat("\x1B[".concat(36, "m", "=", "\x1B[", 39, "m\x1B[", 34, "m", "=", "\x1B[", 39, "m").repeat(15), " \x1B[", 31, "m", "str[ ".concat(i, " ] = ").concat(str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)), "\x1B[", 39, "m ", "\x1B[".concat(90, "m#", charcode, "\x1B[", 39, "m"), " ").concat("\x1B[".concat(36, "m", "=", "\x1B[", 39, "m\x1B[", 34, "m", "=", "\x1B[", 39, "m").repeat(15)));
    if (!str[i].trim().length) {
      if (whitespaceStartAt === null) {
        whitespaceStartAt = i;
      }
      if (closingBracket.last) {
        closingBracket.precedes = true;
      }
      if (slash.last) {
        slash.precedes = true;
      }
      if (quotes.last) {
        quotes.precedes = true;
      }
    }
    if (str[i] === ">") {
      closingBracket.at = i;
      closingBracket.last = true;
    } else if (closingBracket.last) {
      closingBracket.precedes = true;
      closingBracket.last = false;
    } else {
      closingBracket.precedes = false;
    }
    if (str[i] === "/") {
      slash.at = i;
      slash.last = true;
    } else if (slash.last) {
      slash.precedes = true;
      slash.last = false;
    } else {
      slash.precedes = false;
    }
    if (str[i] === ">") ;
    if ("'\"".includes(str[i])) {
      if (quotes.at === null) {
        quotes.within = true;
        quotes.at = i;
      } else if (str[i] === str[quotes.at]) {
        quotes.within = false;
      }
      quotes.last = true;
    } else if (quotes.last) {
      quotes.precedes = true;
      quotes.last = false;
    } else {
      quotes.precedes = false;
    }
    if (quotes.at && !quotes.within && quotes.precedes && str[i] !== str[quotes.at]) {
      quotes.at = null;
      console.log("423 ".concat("\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "quotes.at", quotes.at)));
    }
    if (!quotes.within && beginningOfAString && str[i] === "/" && ">".includes(str[firstIdxOnTheRight(str, i)])) {
      console.log("459 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R1", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
      return true;
    }
    if (!quotes.within && beginningOfAString && charSuitableForAttrName(str[i]) && !r2_1) {
      r2_1 = true;
      console.log("481 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_1", r2_1)));
    }
    else if (!r2_2 && r2_1 && str[i].trim().length && !charSuitableForAttrName(str[i])) {
        if (str[i] === "=") {
          r2_2 = true;
          console.log("500 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_2", r2_2)));
        } else {
          r2_1 = false;
          console.log("509 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r2_1", r2_1)));
        }
      }
      else if (!r2_3 && r2_2 && str[i].trim().length) {
          if ("'\"".includes(str[i])) {
            r2_3 = true;
            console.log("523 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_3", r2_3)));
          } else {
            r2_1 = false;
            r2_2 = false;
            console.log("533 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r2_1", r2_1, "r2_2", r2_2)));
          }
        }
        else if (r2_3 && str[i] === str[quotes.at]) {
            r2_4 = true;
            console.log("548 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r2_4", r2_4)));
          }
          else if (r2_4 && !quotes.within && str[i] === ">") {
              console.log("559 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R2", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
              return true;
            }
    if (!quotes.within && beginningOfAString && str[i] === ">" && !r3_1) {
      r3_1 = true;
      console.log("576 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_1", r3_1)));
      if (str[firstIdxOnTheRight(str, i)] === "<") {
        console.log("586 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R3.2", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
        return true;
      }
    }
    else if (r3_1 && !r3_2 && !notTagChar(str[i])) {
        r3_2 = true;
        console.log("599 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_2", r3_2)));
      }
      else if (r3_2 && !r3_3 && str[i].trim().length) {
          if (charSuitableForTagName(str[i]) || str[i] === "/") {
            r3_3 = true;
            console.log("612 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_3", r3_3)));
          } else {
            r3_1 = false;
            r3_2 = false;
            console.log("622 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r3_1", r3_1, "r3_2", r3_2)));
          }
        }
        else if (r3_3 && !r3_4 && str[i].trim().length && !charSuitableForTagName(str[i])) {
            if ("<>".includes(str[i]) || str[i] === "/" && "<>".includes(firstIdxOnTheRight(str, i))) {
              console.log("647 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R3", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
              return true;
            } else if ("='\"".includes(str[i])) {
              r3_1 = false;
              r3_2 = false;
              r3_3 = false;
              console.log("659 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r3_1", r3_1, "r3_2", r3_2, "r3_3", r3_3)));
            }
          }
          else if (r3_3 && !r3_4 && !str[i].trim().length) {
              r3_4 = true;
              console.log("676 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_4", r3_4)));
            }
            else if (r3_4 && !r3_5 && str[i].trim().length) {
                if (charSuitableForAttrName(str[i])) {
                  r3_5 = true;
                  console.log("690 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r3_5", r3_5)));
                } else {
                  r3_1 = false;
                  r3_2 = false;
                  r3_3 = false;
                  r3_4 = false;
                  console.log("702 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r3_1", r3_1, "r3_2", r3_2, "r3_3", r3_3, "r3_4", r3_4)));
                }
              }
              else if (r3_5) {
                  if (!str[i].trim().length || str[i] === "=" || charIsQuote(str[i])) {
                    console.log("722 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R3", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
                    return true;
                  }
                }
    if (!quotes.within && beginningOfAString && !r4_1 && charSuitableForAttrName(str[i])) {
      r4_1 = true;
      console.log("743 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "r4_1", r4_1)));
    }
    else if (r4_1 && str[i].trim().length && (!charSuitableForAttrName(str[i]) || str[i] === "/")) {
        if (str[i] === "/" && str[firstIdxOnTheRight(str, i)] === ">") {
          console.log("760 ".concat("\x1B[".concat(32, "m", "\u2588\u2588 R4", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("return", "true")));
          return true;
        }
        r4_1 = false;
        console.log("769 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " ", "\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("reset", "r4_1", r4_1)));
      }
    if (whitespaceStartAt !== null) {
      whitespaceStartAt = null;
    }
    if (beginningOfAString && str[i].trim().length) {
      beginningOfAString = false;
      console.log("812 ".concat("\x1B[".concat(90, "m", "withinTagInnerspace()", "\x1B[", 39, "m"), " ", log("set", "beginningOfAString", beginningOfAString)));
    }
    console.log("\x1B[".concat(36, "m", "\u2588", "\x1B[", 39, "m"));
    console.log("".concat("\x1B[".concat(33, "m", "whitespaceStartAt", "\x1B[", 39, "m"), " = ", JSON.stringify(whitespaceStartAt, null, 0)));
    console.log("".concat("\x1B[".concat(33, "m", "closingBracket", "\x1B[", 39, "m"), " = ", JSON.stringify(closingBracket, null, 0)));
    console.log("".concat("\x1B[".concat(33, "m", "slash", "\x1B[", 39, "m"), " = ", JSON.stringify(slash, null, 0)));
    console.log("".concat("\x1B[".concat(33, "m", "beginningOfAString", "\x1B[", 39, "m"), " = ", JSON.stringify(beginningOfAString, null, 0)));
    console.log("".concat("\x1B[".concat(33, "m", "quotes", "\x1B[", 39, "m"), " = ", JSON.stringify(quotes, null, 0)));
    console.log("".concat("\x1B[".concat(33, "m", "r3_1", "\x1B[", 39, "m"), " = ", JSON.stringify(r3_1, null, 0)));
    console.log("".concat("\x1B[".concat(33, "m", "r3_2", "\x1B[", 39, "m"), " = ", JSON.stringify(r3_2, null, 0)));
    console.log("".concat("\x1B[".concat(33, "m", "r3_3", "\x1B[", 39, "m"), " = ", JSON.stringify(r3_3, null, 0)));
    console.log("".concat("\x1B[".concat(33, "m", "r3_4", "\x1B[", 39, "m"), " = ", JSON.stringify(r3_4, null, 0)));
  }
  console.log("\n\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588");
  console.log("899 FIN. REACHED. RETURN FALSE.");
  return false;
}
function tagOnTheRight(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  console.log("914 util/tagOnTheRight() called, ".concat("\x1B[".concat(33, "m", "idx", "\x1B[", 39, "m"), " = ", "\x1B[".concat(31, "m", idx, "\x1B[", 39, "m")));
  console.log("916 tagOnTheRight() called, idx = ".concat(idx));
  var r1 = /^<\s*\w+\s*\/?\s*>/g;
  var r2 = /^<\s*\w+\s+\w+\s*=\s*['"]/g;
  var r3 = /^<\s*\/?\s*\w+\s*\/?\s*>/g;
  var r4 = /^<\s*\w+(?:\s*\w+)*\s*\w+=['"]/g;
  var whatToTest = idx ? str.slice(idx) : str;
  var passed = false;
  if (r1.test(whatToTest)) {
    console.log("935 util/tagOnTheRight(): ".concat("\x1B[".concat(31, "m", "R1", "\x1B[", 39, "m"), " passed"));
    passed = true;
  } else if (r2.test(whatToTest)) {
    console.log("940 util/tagOnTheRight(): ".concat("\x1B[".concat(31, "m", "R2", "\x1B[", 39, "m"), " passed"));
    passed = true;
  } else if (r3.test(whatToTest)) {
    console.log("945 util/tagOnTheRight(): ".concat("\x1B[".concat(31, "m", "R3", "\x1B[", 39, "m"), " passed"));
    passed = true;
  } else if (r4.test(whatToTest)) {
    console.log("950 util/tagOnTheRight(): ".concat("\x1B[".concat(31, "m", "R4", "\x1B[", 39, "m"), " passed"));
    passed = true;
  }
  var res = isStr(str) && idx < str.length && passed;
  console.log("956 util/tagOnTheRight(): return ".concat("\x1B[".concat(36, "m", res, "\x1B[", 39, "m")));
  return res;
}
function firstIdxOnTheRight(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (!str[idx + 1]) {
    return null;
  } else if (str[idx + 1] && str[idx + 1].trim().length) {
    return idx + 1;
  } else if (str[idx + 2] && str[idx + 2].trim().length) {
    return idx + 2;
  }
  for (var i = idx + 1, len = str.length; i < len; i++) {
    if (str[i].trim().length) {
      return i;
    }
  }
  return null;
}
function firstOnTheLeft(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  if (idx < 1) {
    return null;
  } else if (str[idx - 1] && str[idx - 1].trim().length) {
    return idx - 1;
  } else if (str[idx - 2] && str[idx - 2].trim().length) {
    return idx - 2;
  }
  for (var i = idx; i--;) {
    if (str[i] && str[i].trim().length) {
      return i;
    }
  }
  return null;
}
function attributeOnTheRight(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var closingQuoteAt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  console.log("".concat("\x1B[".concat(32, "m", "\n\u2588\u2588", "\x1B[", 39, "m"), " util/attributeOnTheRight() ", "\x1B[".concat(32, "m", "\u2588\u2588\n", "\x1B[", 39, "m")));
  console.log("closingQuoteAt = ".concat(JSON.stringify(closingQuoteAt, null, 4)));
  var startingQuoteVal = str[idx];
  if (startingQuoteVal !== "'" && startingQuoteVal !== '"') {
    throw new Error("1 emlint/util/attributeOnTheRight(): first character is not a single/double quote!\nstartingQuoteVal = ".concat(JSON.stringify(startingQuoteVal, null, 0), "\nstr = ").concat(JSON.stringify(str, null, 4), "\nidx = ").concat(JSON.stringify(idx, null, 0)));
  }
  var closingQuoteMatched = false;
  var lastClosingBracket = null;
  var lastOpeningBracket = null;
  var lastSomeQuote = null;
  var lastEqual = null;
  for (var i = idx, len = str.length; i < len; i++) {
    var charcode = str[i].charCodeAt(0);
    console.log("\x1B[".concat(closingQuoteAt === null ? 36 : 32, "m", "===============================", "\x1B[", 39, "m \x1B[").concat(closingQuoteAt === null ? 34 : 31, "m", "str[ ".concat(i, " ] = ").concat(str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)), "\x1B[", 39, "m ", "\x1B[".concat(90, "m#", charcode, "\x1B[", 39, "m"), " \x1B[").concat(closingQuoteAt === null ? 36 : 32, "m", "===============================", "\x1B[", 39, "m"));
    if (i === closingQuoteAt && i > idx || closingQuoteAt === null && i > idx && str[i] === startingQuoteVal) {
      closingQuoteAt = i;
      console.log("1090 (util/attributeOnTheRight) ".concat(log("set", "closingQuoteAt", closingQuoteAt)));
      if (!closingQuoteMatched) {
        closingQuoteMatched = true;
        console.log("1099 (util/attributeOnTheRight) ".concat(log("set", "closingQuoteMatched", closingQuoteMatched)));
      }
    }
    if (str[i] === ">") {
      lastClosingBracket = i;
      console.log("1111 (util/attributeOnTheRight) ".concat(log("set", "lastClosingBracket", lastClosingBracket)));
    }
    if (str[i] === "<") {
      lastOpeningBracket = i;
      console.log("1121 (util/attributeOnTheRight) ".concat(log("set", "lastOpeningBracket", lastOpeningBracket)));
    }
    if (str[i] === "=") {
      lastEqual = i;
      console.log("1131 (util/attributeOnTheRight) ".concat(log("set", "lastEqual", lastEqual)));
    }
    if (str[i] === "'" || str[i] === '"') {
      lastSomeQuote = i;
      console.log("1137 (util/attributeOnTheRight) ".concat(log("set", "lastSomeQuote", lastSomeQuote)));
    }
    if (str[i] === "=" && (str[i + 1] === "'" || str[i + 1] === '"')) {
      console.log("1153 (util/attributeOnTheRight) within pattern check: equal-quote");
      if (closingQuoteMatched) {
        if (!lastClosingBracket || lastClosingBracket < closingQuoteAt) {
          console.log("1161 (util/attributeOnTheRight) ".concat(log("return", "closingQuoteAt", closingQuoteAt)));
          return closingQuoteAt;
        }
      } else {
        if (closingQuoteAt) {
          console.log("1176 (util/attributeOnTheRight) STOP", 'recursive check ends, it\'s actually messed up. We are already within a recursion. Return "false".');
          return false;
        }
        console.log("1183 (util/attributeOnTheRight) ".concat(log(" ███████████████████████████████████████ correction!\n", "true")));
        if (lastSomeQuote !== 0 && str[i + 1] !== lastSomeQuote) {
          var correctionsRes1 = attributeOnTheRight(str, idx, lastSomeQuote);
          if (correctionsRes1) {
            console.log("1198 (util/attributeOnTheRight) CORRECTION #1 PASSED - so it was mismatching quote");
            console.log("1201 (util/attributeOnTheRight) ".concat(log("return", "lastSomeQuote", lastSomeQuote)));
            return lastSomeQuote;
          }
        }
        var correctionsRes2 = attributeOnTheRight(str, i + 1);
        if (correctionsRes2) {
          console.log("1217 (util/attributeOnTheRight) CORRECTION #2 PASSED - healthy attributes follow");
          console.log("1220 (util/attributeOnTheRight) ".concat(log("return", "false")));
          return false;
        }
      }
    }
    if (closingQuoteMatched && lastClosingBracket && lastClosingBracket > closingQuoteMatched) {
      console.log("1234 (util/attributeOnTheRight) ".concat(log("return", "closingQuoteAt", closingQuoteAt)));
      return closingQuoteAt;
    }
    if (closingQuoteMatched && lastClosingBracket === null && lastOpeningBracket === null && (lastSomeQuote === null || lastSomeQuote && closingQuoteAt >= lastSomeQuote) && lastEqual === null) {
      console.log("1258 (util/attributeOnTheRight) ".concat(log("return", "closingQuoteAt", closingQuoteAt)));
      return closingQuoteAt;
    }
    if (!str[i + 1]) {
      console.log("1281 (util) \"EOL reached\"");
    }
    console.log(closingQuoteMatched ? "closingQuoteMatched" : "");
  }
  if (lastSomeQuote && closingQuoteAt === null) {
    console.log("1299 (util) last chance, run correction 3");
    console.log("".concat("\x1B[".concat(33, "m", "lastSomeQuote", "\x1B[", 39, "m"), " = ", JSON.stringify(lastSomeQuote, null, 4)));
    var correctionsRes3 = attributeOnTheRight(str, idx, lastSomeQuote);
    if (correctionsRes3) {
      console.log("1311 (util) CORRECTION #3 PASSED - mismatched quotes confirmed");
      console.log("1313 (util) ".concat(log("return", true)));
      return lastSomeQuote;
    }
  }
  console.log("1318 (util) ".concat(log("bottom - return", "false")));
  return false;
}
function findClosingQuote(str) {
  var idx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  console.log("1338 util/findClosingQuote() called, ".concat("\x1B[".concat(33, "m", "idx", "\x1B[", 39, "m"), " = ", "\x1B[".concat(31, "m", idx, "\x1B[", 39, "m")));
  var lastNonWhitespaceCharWasQuoteAt = null;
  var lastQuoteAt = null;
  var startingQuote = "\"'".includes(str[idx]) ? str[idx] : null;
  var lastClosingBracketAt = null;
  for (var i = idx, len = str.length; i < len; i++) {
    var charcode = str[i].charCodeAt(0);
    console.log("\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 34, "m", "str[ ".concat(i, " ] = ").concat(str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)), "\x1B[", 39, "m ", "\x1B[".concat(90, "m#", charcode, "\x1B[", 39, "m"), " \x1B[", 36, "m", "===============================", "\x1B[", 39, "m"));
    if (charcode === 34 || charcode === 39) {
      if (str[i] === startingQuote && i > idx) {
        console.log("1369 (util/findClosingQuote) quick ending, ".concat(i, " is the matching quote"));
        return i;
      }
      lastNonWhitespaceCharWasQuoteAt = i;
      lastQuoteAt = i;
      console.log("1377 (util/findClosingQuote) ".concat(log("set", "lastNonWhitespaceCharWasQuoteAt", lastNonWhitespaceCharWasQuoteAt)));
      if (i > idx && (str[i] === "'" || str[i] === '"') && withinTagInnerspace(str, i + 1)) {
        console.log("1391 (util/findClosingQuote) ".concat(log("return", i)));
        return i;
      }
      console.log("1394 (util/findClosingQuote) didn't pass");
      if (tagOnTheRight(str, i + 1)) {
        console.log("1398 \x1B[".concat(35, "m", "\u2588\u2588", "\x1B[", 39, "m (util/findClosingQuote) tag on the right - return i=", i));
        return i;
      }
      console.log("1403 \x1B[".concat(35, "m", "\u2588\u2588", "\x1B[", 39, "m (util/findClosingQuote) NOT tag on the right"));
    }
    else if (str[i].trim().length) {
        console.log("1409 (util/findClosingQuote)");
        if (str[i] === ">") {
          lastClosingBracketAt = i;
          if (lastNonWhitespaceCharWasQuoteAt !== null) {
            console.log("1416 (util/findClosingQuote) ".concat(log("!", "suitable candidate found")));
            var temp = withinTagInnerspace(str, i);
            console.log("1425 (util/findClosingQuote) withinTagInnerspace() result: ".concat(temp));
            if (temp) {
              if (lastNonWhitespaceCharWasQuoteAt === idx) {
                console.log("1448 (util/findClosingQuote) ".concat(log("return", "lastNonWhitespaceCharWasQuoteAt + 1", lastNonWhitespaceCharWasQuoteAt + 1)));
                return lastNonWhitespaceCharWasQuoteAt + 1;
              }
              console.log("1457 (util/findClosingQuote) ".concat(log("return", "lastNonWhitespaceCharWasQuoteAt", lastNonWhitespaceCharWasQuoteAt)));
              return lastNonWhitespaceCharWasQuoteAt;
            }
          }
        } else if (str[i] === "=") {
          var whatFollowsEq = firstIdxOnTheRight(str, i);
          console.log("1472 (util/findClosingQuote) ".concat(log("set", "whatFollowsEq", whatFollowsEq)));
          if (whatFollowsEq && (str[whatFollowsEq] === "'" || str[whatFollowsEq] === '"')) {
            console.log("1482 (util/findClosingQuote)");
            console.log("".concat("\x1B[".concat(33, "m", "lastNonWhitespaceCharWasQuoteAt", "\x1B[", 39, "m"), " = ", JSON.stringify(lastNonWhitespaceCharWasQuoteAt, null, 4)));
            if (withinTagInnerspace(str, lastQuoteAt + 1)) {
              console.log("1494 (util/findClosingQuote) ".concat(log("return", "lastQuoteAt + 1", lastQuoteAt + 1)));
              return lastQuoteAt + 1;
            }
            console.log("1502 didn't pass");
          }
        } else if (str[i] !== "/") {
          if (str[i] === "<" && tagOnTheRight(str, i)) {
            console.log("1507 \u2588\u2588 tag on the right");
            if (lastClosingBracketAt !== null) {
              console.log("1510 (util/findClosingQuote) ".concat(log("return", "lastClosingBracketAt", lastClosingBracketAt)));
              return lastClosingBracketAt;
            }
          }
          if (lastNonWhitespaceCharWasQuoteAt !== null) {
            lastNonWhitespaceCharWasQuoteAt = null;
            console.log("1524 (util/findClosingQuote) ".concat(log("set", "lastNonWhitespaceCharWasQuoteAt", lastNonWhitespaceCharWasQuoteAt)));
          }
        }
      }
    console.log("1536 (util/findClosingQuote) ".concat(log("END", "lastNonWhitespaceCharWasQuoteAt", lastNonWhitespaceCharWasQuoteAt)));
  }
  return null;
}
function encodeChar(str, i) {
  if (str[i] === "&" && (!str[i + 1] || str[i + 1] !== "a") && (!str[i + 2] || str[i + 2] !== "m") && (!str[i + 3] || str[i + 3] !== "p") && (!str[i + 3] || str[i + 3] !== ";")) {
    return {
      name: "bad-character-unencoded-ampersand",
      position: [[i, i + 1, "&amp;"]]
    };
  } else if (str[i] === "<") {
    return {
      name: "bad-character-unencoded-opening-bracket",
      position: [[i, i + 1, "&lt;"]]
    };
  } else if (str[i] === ">") {
    return {
      name: "bad-character-unencoded-closing-bracket",
      position: [[i, i + 1, "&gt;"]]
    };
  } else if (str[i] === '"') {
    return {
      name: "bad-character-unencoded-double-quotes",
      position: [[i, i + 1, "&quot;"]]
    };
  }
  return null;
}

var errors = "./errors.json";
var isArr = Array.isArray;
var isStr$1 = isStr,
    log$1 = log,
    withinTagInnerspace$1 = withinTagInnerspace,
    firstIdxOnTheRight$1 = firstIdxOnTheRight,
    firstOnTheLeft$1 = firstOnTheLeft,
    attributeOnTheRight$1 = attributeOnTheRight,
    findClosingQuote$1 = findClosingQuote,
    encodeChar$1 = encodeChar,
    tagOnTheRight$1 = tagOnTheRight;
function lint(str, originalOpts) {
  function pingTag(logTag) {
    console.log("027 pingTag(): ".concat(JSON.stringify(logTag, null, 4)));
  }
  if (!isStr$1(str)) {
    throw new Error("emlint: [THROW_ID_01] the first input argument must be a string. It was given as:\n".concat(JSON.stringify(str, null, 4), " (type ").concat(_typeof(str), ")"));
  }
  var defaults = {
    rules: "recommended",
    style: {
      line_endings_CR_LF_CRLF: null
    }
  };
  var opts;
  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = Object.assign({}, defaults, originalOpts);
      checkTypes(opts, defaults, {
        msg: "emlint: [THROW_ID_03*]",
        schema: {
          rules: ["string", "object", "false", "null", "undefined"],
          style: ["object", "null", "undefined"],
          "style.line_endings_CR_LF_CRLF": ["string", "null", "undefined"]
        }
      });
      if (opts.style && isStr$1(opts.style.line_endings_CR_LF_CRLF)) {
        if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "cr") {
          if (opts.style.line_endings_CR_LF_CRLF !== "CR") {
            opts.style.line_endings_CR_LF_CRLF === "CR";
          }
        } else if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "lf") {
          if (opts.style.line_endings_CR_LF_CRLF !== "LF") {
            opts.style.line_endings_CR_LF_CRLF === "LF";
          }
        } else if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "crlf") {
          if (opts.style.line_endings_CR_LF_CRLF !== "CRLF") {
            opts.style.line_endings_CR_LF_CRLF === "CRLF";
          }
        } else {
          throw new Error("emlint: [THROW_ID_04] opts.style.line_endings_CR_LF_CRLF should be either falsey or string \"CR\" or \"LF\" or \"CRLF\". It was given as:\n".concat(JSON.stringify(opts.style.line_endings_CR_LF_CRLF, null, 4), " (type is string)"));
        }
      }
    } else {
      throw new Error("emlint: [THROW_ID_02] the second input argument must be a plain object. It was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (type ").concat(_typeof(originalOpts), ")"));
    }
  } else {
    opts = clone(defaults);
  }
  console.log("109 USING ".concat("\x1B[".concat(33, "m", "opts", "\x1B[", 39, "m"), " = ", JSON.stringify(opts, null, 4)));
  var rawEnforcedEOLChar;
  if (opts.style && isStr$1(opts.style.line_endings_CR_LF_CRLF)) {
    if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "cr") {
      rawEnforcedEOLChar = "\r";
    } else if (opts.style.line_endings_CR_LF_CRLF.toLowerCase() === "crlf") {
      rawEnforcedEOLChar = "\r\n";
    } else {
      rawEnforcedEOLChar = "\n";
    }
  }
  var logTag;
  var defaultLogTag = {
    tagStartAt: null,
    tagEndAt: null,
    tagNameStartAt: null,
    tagNameEndAt: null,
    tagName: null,
    recognised: null,
    pureHTML: true,
    attributes: []
  };
  function resetLogTag() {
    logTag = clone(defaultLogTag);
  }
  resetLogTag();
  var logAttr;
  var defaultLogAttr = {
    attrStartAt: null,
    attrEndAt: null,
    attrNameStartAt: null,
    attrNameEndAt: null,
    attrName: null,
    attrValue: null,
    attrValueStartAt: null,
    attrValueEndAt: null,
    attrEqualAt: null,
    attrOpeningQuote: {
      pos: null,
      val: null
    },
    attrClosingQuote: {
      pos: null,
      val: null
    },
    recognised: null,
    pureHTML: true
  };
  function resetLogAttr() {
    logAttr = clone(defaultLogAttr);
  }
  resetLogAttr();
  var logWhitespace;
  var defaultLogWhitespace = {
    startAt: null,
    includesLinebreaks: false,
    lastLinebreakAt: null
  };
  function resetLogWhitespace() {
    logWhitespace = clone(defaultLogWhitespace);
  }
  resetLogWhitespace();
  var retObj = {
    issues: []
  };
  var tagIssueStaging = [];
  var rawIssueStaging = [];
  var logLineEndings = {
    cr: [],
    lf: [],
    crlf: []
  };
  var _loop = function _loop(_i, len) {
    var charcode = str[_i].charCodeAt(0);
    console.log("\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 35, "m", "str[ ".concat(_i, " ] = ").concat(str[_i].trim().length ? str[_i] : JSON.stringify(str[_i], null, 0)), "\x1B[", 39, "m ", "\x1B[".concat(90, "m#", charcode, "\x1B[", 39, "m"), " \x1B[", 36, "m", "===============================", "\x1B[", 39, "m"));
    if (logTag.tagNameEndAt !== null) {
      if (logAttr.attrNameStartAt !== null && logAttr.attrNameEndAt === null && logAttr.attrName === null && !isLatinLetter(str[_i])) {
        logAttr.attrNameEndAt = _i;
        logAttr.attrName = str.slice(logAttr.attrNameStartAt, logAttr.attrNameEndAt);
        console.log("305 ".concat(log$1("SET", "logAttr.attrNameEndAt", logAttr.attrNameEndAt, "logAttr.attrName", logAttr.attrName)));
        if (str[_i] !== "=") {
          if (str[firstIdxOnTheRight$1(str, _i)] === "=") {
            console.log("320 equal to the right though");
          } else {
            console.log("323 not equal, so terminate attr");
          }
        }
      }
      if (logAttr.attrNameEndAt !== null && logAttr.attrEqualAt === null && _i >= logAttr.attrNameEndAt && str[_i].trim().length) {
        var temp;
        if (str[_i] === "'" || str[_i] === '"') {
          temp = attributeOnTheRight$1(str, _i);
        }
        console.log("339 catch what follows the attribute's name");
        if (str[_i] === "=") {
          logAttr.attrEqualAt = _i;
          console.log("343 ".concat(log$1("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)));
        } else if (temp) {
          console.log("".concat("\x1B[".concat(32, "m", "\n\u2588\u2588", "\x1B[", 39, "m"), " util/attributeOnTheRight() ENDED ", "\x1B[".concat(32, "m", "\u2588\u2588\n", "\x1B[", 39, "m")));
          console.log("350 quoted attribute's value on the right, equal is indeed missing");
          retObj.issues.push({
            name: "tag-attribute-missing-equal",
            position: [[_i, _i, "="]]
          });
          console.log("358 ".concat(log$1("push", "tag-attribute-missing-equal", "".concat("[[".concat(_i, ", ").concat(_i, ", \"=\"]]")))));
          logAttr.attrEqualAt = _i;
          console.log("367 ".concat(log$1("SET", "logAttr.attrEqualAt", logAttr.attrEqualAt)));
          logAttr.attrValueStartAt = _i + 1;
          console.log("372 ".concat(log$1("SET", "logAttr.attrValueStartAt", logAttr.attrValueStartAt)));
          logAttr.attrValueEndAt = temp;
          console.log("381 ".concat(log$1("SET", "logAttr.attrValueEndAt", logAttr.attrValueEndAt)));
          logAttr.attrOpeningQuote.pos = _i;
          logAttr.attrOpeningQuote.val = str[_i];
          logAttr.attrClosingQuote.pos = temp;
          logAttr.attrClosingQuote.val = str[temp];
          console.log("393 ".concat(log$1("SET", "logAttr.attrOpeningQuote", logAttr.attrOpeningQuote, "logAttr.attrClosingQuote", logAttr.attrClosingQuote)));
          logAttr.attrValue = str.slice(_i + 1, temp);
          console.log("404 ".concat(log$1("SET", "logAttr.attrValue", logAttr.attrValue)));
        } else {
          console.log("".concat("\x1B[".concat(32, "m", "\n\u2588\u2588", "\x1B[", 39, "m"), " util/attributeOnTheRight() ENDED ", "\x1B[".concat(32, "m", "\u2588\u2588\n", "\x1B[", 39, "m")));
          logTag.attributes.push(clone(logAttr));
          console.log("416 ".concat(log$1("PUSH, then RESET", "logAttr")));
          resetLogAttr();
        }
        if (logWhitespace.startAt !== null) {
          if (str[_i] === "=") {
            retObj.issues.push({
              name: "tag-attribute-space-between-name-and-equals",
              position: [[logWhitespace.startAt, _i]]
            });
            console.log("431 ".concat(log$1("push", "tag-attribute-space-between-name-and-equals", "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, "]]")))));
          } else if (isLatinLetter(str[_i])) {
            logTag.attributes.push(clone(logAttr));
            console.log("440 ".concat(log$1("PUSH, then RESET", "logAttr")));
            resetLogAttr();
            if (logWhitespace.startAt !== null) {
              if (str[logWhitespace.startAt] === " ") {
                if (logWhitespace.startAt + 1 < _i) {
                  retObj.issues.push({
                    name: "tag-excessive-whitespace-inside-tag",
                    position: [[logWhitespace.startAt + 1, _i]]
                  });
                  console.log("455 ".concat(log$1("push", "tag-excessive-whitespace-inside-tag", "".concat("[[".concat(logWhitespace.startAt + 1, ", ").concat(_i, "]]")))));
                }
                console.log("462 dead end of excessive whitespace check");
              } else {
                retObj.issues.push({
                  name: "tag-excessive-whitespace-inside-tag",
                  position: [[logWhitespace.startAt, _i, " "]]
                });
                console.log("470 ".concat(log$1("push", "tag-excessive-whitespace-inside-tag", "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, ", \" \"]]")))));
              }
            }
          }
        }
      }
      if (logAttr.attrStartAt === null && isLatinLetter(str[_i])) {
        console.log("486 above catching the begining of an attribute's name");
        logAttr.attrStartAt = _i;
        logAttr.attrNameStartAt = _i;
        console.log("490 ".concat(log$1("SET", "logAttr.attrStartAt", logAttr.attrStartAt)));
        if (logWhitespace.startAt !== null && logWhitespace.startAt < _i - 1) {
          if (str[logWhitespace.startAt] === " ") {
            retObj.issues.push({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt + 1, _i]]
            });
            console.log("506 ".concat(log$1("push", "tag-excessive-whitespace-inside-tag", "".concat("[[".concat(logWhitespace.startAt + 1, ", ").concat(_i, "]]")))));
          } else {
            retObj.issues.push({
              name: "tag-excessive-whitespace-inside-tag",
              position: [[logWhitespace.startAt, _i, " "]]
            });
            console.log("519 ".concat(log$1("push", "tag-excessive-whitespace-inside-tag", "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, ", \" \"]]")))));
          }
        }
      }
      if (logAttr.attrEqualAt !== null && logAttr.attrEqualAt < _i && logAttr.attrOpeningQuote.pos === null && str[_i].trim().length) {
        console.log("536 rules above catching what follows attribute's equal");
        if (charcode === 34 || charcode === 39) {
          if (logWhitespace.startAt && logWhitespace.startAt < _i) {
            retObj.issues.push({
              name: "tag-attribute-space-between-equals-and-opening-quotes",
              position: [[logWhitespace.startAt, _i]]
            });
            console.log("547 ".concat(log$1("push", "tag-attribute-space-between-equals-and-opening-quotes", "".concat(JSON.stringify([[logWhitespace.startAt, _i]], null, 0)))));
          }
          resetLogWhitespace();
          logAttr.attrOpeningQuote.pos = _i;
          logAttr.attrOpeningQuote.val = str[_i];
          var closingQuotePeek = findClosingQuote$1(str, _i);
          console.log("561 ".concat(log$1("set", "closingQuotePeek", closingQuotePeek)));
          if (closingQuotePeek) {
            if (str[closingQuotePeek] !== str[_i]) {
              if (str[closingQuotePeek] === "'" || str[closingQuotePeek] === '"') {
                var isDouble = str[closingQuotePeek] === '"';
                var name$$1 = "tag-attribute-mismatching-quotes-is-".concat(isDouble ? "double" : "single");
                retObj.issues.push({
                  name: name$$1,
                  position: [[closingQuotePeek, closingQuotePeek + 1, "".concat(isDouble ? "'" : '"')]]
                });
                console.log("592 ".concat(log$1("push", name$$1, "".concat("[[".concat(closingQuotePeek, ", ").concat(closingQuotePeek + 1, ", ").concat(isDouble ? "'" : '"', "]]")))));
              } else {
                var compensation = "";
                if (str[closingQuotePeek - 1] && str[closingQuotePeek] && str[closingQuotePeek - 1].trim().length && str[closingQuotePeek].trim().length && str[closingQuotePeek] !== "/" && str[closingQuotePeek] !== ">") {
                  compensation = " ";
                }
                var fromPositionToInsertAt = str[closingQuotePeek - 1].trim().length ? closingQuotePeek : firstOnTheLeft$1(str, closingQuotePeek) + 1;
                console.log("625 ".concat(log$1("set", "fromPositionToInsertAt", fromPositionToInsertAt)));
                var toPositionToInsertAt = closingQuotePeek;
                console.log("633 ".concat(log$1("set", "toPositionToInsertAt", toPositionToInsertAt)));
                if (str[firstOnTheLeft$1(str, closingQuotePeek)] === "/") {
                  console.log("641 SLASH ON THE LEFT");
                  toPositionToInsertAt = firstOnTheLeft$1(str, closingQuotePeek);
                  if (toPositionToInsertAt + 1 < closingQuotePeek) {
                    retObj.issues.push({
                      name: "tag-whitespace-closing-slash-and-bracket",
                      position: [[toPositionToInsertAt + 1, closingQuotePeek]]
                    });
                    console.log("650 ".concat(log$1("push", "tag-whitespace-closing-slash-and-bracket", "".concat("[[".concat(toPositionToInsertAt + 1, ", ").concat(closingQuotePeek, "]]")))));
                  }
                  fromPositionToInsertAt = firstOnTheLeft$1(str, toPositionToInsertAt) + 1;
                  console.log("663 ".concat(log$1("set", "toPositionToInsertAt", toPositionToInsertAt, "fromPositionToInsertAt", fromPositionToInsertAt)));
                }
                retObj.issues.push({
                  name: "tag-attribute-closing-quotation-mark-missing",
                  position: [[fromPositionToInsertAt, toPositionToInsertAt, "".concat(str[_i]).concat(compensation)]]
                });
                console.log("684 ".concat(log$1("push", "tag-attribute-closing-quotation-mark-missing", "".concat("[[".concat(closingQuotePeek, ", ").concat(closingQuotePeek, ", ", "".concat(str[_i]).concat(compensation), "]]")))));
              }
            }
            logAttr.attrClosingQuote.pos = closingQuotePeek;
            logAttr.attrClosingQuote.val = str[_i];
            logAttr.attrValue = str.slice(_i + 1, closingQuotePeek);
            logAttr.attrValueStartAt = _i + 1;
            logAttr.attrValueEndAt = closingQuotePeek;
            logAttr.attrEndAt = closingQuotePeek;
            console.log("702 ".concat(log$1("set", "logAttr.attrClosingQuote", logAttr.attrClosingQuote, "logAttr.attrValue", logAttr.attrValue, "logAttr.attrValueStartAt", logAttr.attrValueStartAt, "logAttr.attrValueEndAt", logAttr.attrValueEndAt, "logAttr.attrEndAt", logAttr.attrEndAt)));
            for (var y = _i + 1; y < closingQuotePeek; y++) {
              var newIssue = encodeChar$1(str, y);
              if (newIssue) {
                tagIssueStaging.push(newIssue);
                console.log("728 ".concat(log$1("push tagIssueStaging", "newIssue", newIssue)));
              }
            }
            if (rawIssueStaging.length) {
              console.log("737 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " raw stage present!"));
            }
            logTag.attributes.push(clone(logAttr));
            console.log("743 ".concat(log$1("PUSH, then RESET", "logAttr")));
            resetLogAttr();
            if (str[closingQuotePeek].trim().length) {
              _i = closingQuotePeek;
            } else {
              _i = firstOnTheLeft$1(str, closingQuotePeek);
            }
            console.log("758 ".concat(log$1("set", "i", _i, "then CONTINUE")));
            if (_i === len - 1 && logTag.tagStartAt !== null && (logAttr.attrEqualAt !== null && logAttr.attrOpeningQuote.pos !== null || logTag.attributes.some(function (attrObj) {
              return attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote.pos !== null;
            }))) {
              retObj.issues.push({
                name: "tag-missing-closing-bracket",
                position: [[_i + 1, _i + 1, ">"]]
              });
              console.log("778 ".concat(log$1("push", "tag-missing-closing-bracket", "".concat("[[".concat(_i + 1, ", ").concat(_i + 1, ", \">\"]]")))));
            }
            i = _i;
            return "continue";
          }
        } else if (charcode === 8220 || charcode === 8221) {
          logAttr.attrOpeningQuote.pos = _i;
          logAttr.attrOpeningQuote.val = "\"";
          console.log("796 ".concat(log$1("set", "logAttr.attrOpeningQuote", logAttr.attrOpeningQuote)));
          var _name = charcode === 8220 ? "tag-attribute-left-double-quotation-mark" : "tag-attribute-right-double-quotation-mark";
          retObj.issues.push({
            name: _name,
            position: [[_i, _i + 1, "\""]]
          });
          console.log("813 ".concat(log$1("push", _name, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", '\"']]")))));
        } else if (charcode === 8216 || charcode === 8217) {
          logAttr.attrOpeningQuote.pos = _i;
          logAttr.attrOpeningQuote.val = "'";
          console.log("823 ".concat(log$1("set", "logAttr.attrOpeningQuote", logAttr.attrOpeningQuote)));
          var _name2 = charcode === 8216 ? "tag-attribute-left-single-quotation-mark" : "tag-attribute-right-single-quotation-mark";
          retObj.issues.push({
            name: _name2,
            position: [[_i, _i + 1, "'"]]
          });
          console.log("840 ".concat(log$1("push", _name2, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", '\"']]")))));
          logAttr.attrValueStartAt = _i + 1;
          console.log("845 ".concat(log$1("set", "logAttr.attrValueStartAt", logAttr.attrValueStartAt)));
        } else if (withinTagInnerspace$1(str, _i)) {
          console.log("853 withinTagInnerspace() ".concat("\x1B[".concat(32, "m", "positive", "\x1B[", 39, "m")));
          var start = logAttr.attrStartAt;
          if (str[_i] === "/" || str[_i] === ">") {
            for (var _y = logAttr.attrStartAt; _y--;) {
              if (str[_y].trim().length) {
                start = _y + 1;
                break;
              }
            }
          }
          retObj.issues.push({
            name: "tag-attribute-quote-and-onwards-missing",
            position: [[start, _i]]
          });
          console.log("871 ".concat(log$1("push", "tag-attribute-quote-and-onwards-missing", "".concat("[[".concat(start, ", ").concat(_i, "]]")))));
          console.log("878 ".concat(log$1("reset", "logWhitespace")));
          resetLogWhitespace();
          console.log("880 ".concat(log$1("reset", "logAttr")));
          resetLogAttr();
        } else {
          console.log("884 withinTagInnerspace() ".concat("\x1B[".concat(31, "m", "negative", "\x1B[", 39, "m"), " - final ELSE clauses"));
          var endingQuotesPos = findClosingQuote$1(str, _i);
          if (endingQuotesPos !== null) {
            console.log("892 ending quote found: ".concat(log$1("set", "endingQuotesPos", endingQuotesPos)));
            retObj.issues.push({
              name: "tag-attribute-opening-quotation-mark-missing",
              position: [[_i, _i, str[endingQuotesPos]]]
            });
            console.log("904 ".concat(log$1("push", "tag-attribute-space-between-equals-and-opening-quotes", "".concat("[[".concat(_i, ", ").concat(_i, ", ").concat(JSON.stringify(str[endingQuotesPos], null, 0), "]]")))));
            logAttr.attrOpeningQuote.pos = _i;
            logAttr.attrOpeningQuote.val = str[endingQuotesPos];
            logAttr.attrValueStartAt = _i;
            logAttr.attrClosingQuote.pos = endingQuotesPos;
            logAttr.attrClosingQuote.val = str[endingQuotesPos];
            logAttr.attrValue = str.slice(_i, endingQuotesPos);
            console.log("923 ".concat(log$1("SET", "logAttr.attrOpeningQuote", logAttr.attrOpeningQuote, "logAttr.attrClosingQuote", logAttr.attrClosingQuote, "logAttr.attrValueStartAt", logAttr.attrValueStartAt, "logAttr.attrValue", logAttr.attrValue)));
            for (var _y2 = _i; _y2 < endingQuotesPos; _y2++) {
              var _newIssue = encodeChar$1(str, _y2);
              if (_newIssue) {
                tagIssueStaging.push(_newIssue);
                console.log("943 ".concat(log$1("push tagIssueStaging", "newIssue", _newIssue)));
              }
            }
          } else {
            console.log("949 ".concat(log$1("set", "endingQuotesPos", endingQuotesPos)));
          }
        }
        console.log("956 ".concat(log$1("SET", "logAttr.attrOpeningQuote.pos", logAttr.attrOpeningQuote.pos, "logAttr.attrOpeningQuote.val", logAttr.attrOpeningQuote.val)));
        if (logWhitespace.startAt !== null) {
          if (str[_i] === "'" || str[_i] === '"') {
            retObj.issues.push({
              name: "tag-attribute-space-between-equals-and-opening-quotes",
              position: [[logWhitespace.startAt, _i]]
            });
            console.log("974 ".concat(log$1("push", "tag-attribute-space-between-equals-and-opening-quotes", "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, "]]")))));
          } else if (withinTagInnerspace$1(str, _i + 1)) {
            retObj.issues.push({
              name: "tag-attribute-quote-and-onwards-missing",
              position: [[logAttr.attrStartAt, _i]]
            });
            console.log("989 ".concat(log$1("push", "tag-attribute-quote-and-onwards-missing", "".concat("[[".concat(logAttr.attrStartAt, ", ").concat(_i, "]]")))));
            console.log("995 ".concat(log$1("reset", "logAttr")));
            resetLogAttr();
          }
        }
      }
      if (logAttr.attrEqualAt !== null && logAttr.attrOpeningQuote.pos !== null && _i > logAttr.attrOpeningQuote.pos && (str[_i] === logAttr.attrOpeningQuote.val || withinTagInnerspace$1(str, _i + 1))) {
        console.log("1009 above catching closing quote (single or double)");
        if (charcode === 34 || charcode === 39) {
          var issueName = "tag-attribute-mismatching-quotes-is-".concat(charcode === 34 ? "double" : "single");
          if (str[_i] !== logAttr.attrOpeningQuote.val && (!retObj.issues.length || !retObj.issues.some(function (issueObj) {
            i = _i;
            return issueObj.name === issueName && issueObj.position.length === 1 && issueObj.position[0][0] === _i && issueObj.position[0][1] === _i + 1;
          }))) {
            retObj.issues.push({
              name: issueName,
              position: [[_i, _i + 1, "".concat(charcode === 34 ? "'" : '"')]]
            });
            console.log("1035 ".concat(log$1("push", issueName, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", ").concat(charcode === 34 ? "'" : '"', "]]")))));
          } else {
            console.log("1043 ".concat("\x1B[".concat(31, "m", "didn't push an issue", "\x1B[", 39, "m")));
          }
          logAttr.attrClosingQuote.pos = _i;
          logAttr.attrClosingQuote.val = str[_i];
          console.log("1054 ".concat(log$1("SET", "logAttr.attrClosingQuote.pos", logAttr.attrClosingQuote.pos, "logAttr.attrClosingQuote.val", logAttr.attrClosingQuote.val)));
          if (logAttr.attrValue === null) {
            if (logAttr.attrOpeningQuote.pos && logAttr.attrClosingQuote.pos && logAttr.attrOpeningQuote.pos + 1 < logAttr.attrClosingQuote.pos) {
              logAttr.attrValue = str.slice(logAttr.attrOpeningQuote.pos, logAttr.attrClosingQuote.pos);
            } else {
              logAttr.attrValue = "";
            }
            console.log("1082 ".concat(log$1("SET", "logAttr.attrValue", logAttr.attrValue)));
          }
          logAttr.attrEndAt = _i;
          logAttr.attrValueEndAt = _i;
          console.log("1090 ".concat(log$1("SET", "logAttr.attrEndAt", logAttr.attrEndAt, "logAttr.attrValueEndAt", logAttr.attrValueEndAt)));
          logTag.attributes.push(clone(logAttr));
          console.log("1101 ".concat(log$1("PUSH, then RESET", "logAttr")));
          resetLogAttr();
        } else if (isStr$1(logAttr.attrOpeningQuote.val) && (charcode === 8220 || charcode === 8221)
        ) {
            var _name3 = charcode === 8220 ? "tag-attribute-left-double-quotation-mark" : "tag-attribute-right-double-quotation-mark";
            retObj.issues.push({
              name: _name3,
              position: [[_i, _i + 1, '"']]
            });
            console.log("1123 ".concat(log$1("push", _name3, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", '\"']]")))));
            logAttr.attrEndAt = _i;
            logAttr.attrClosingQuote.pos = _i;
            logAttr.attrClosingQuote.val = '"';
            console.log("1131 ".concat(log$1("SET", "logAttr.attrEndAt", logAttr.attrEndAt, "logAttr.attrClosingQuote", logAttr.attrClosingQuote)));
            logTag.attributes.push(clone(logAttr));
            console.log("1142 ".concat(log$1("PUSH, then RESET", "logAttr")));
            resetLogAttr();
          } else if (isStr$1(logAttr.attrOpeningQuote.val) && (charcode === 8216 || charcode === 8217) && (firstIdxOnTheRight$1(str, _i) !== null && (str[firstIdxOnTheRight$1(str, _i)] === ">" || str[firstIdxOnTheRight$1(str, _i)] === "/") || withinTagInnerspace$1(str, _i + 1))) {
          var _name4 = charcode === 8216 ? "tag-attribute-left-single-quotation-mark" : "tag-attribute-right-single-quotation-mark";
          retObj.issues.push({
            name: _name4,
            position: [[_i, _i + 1, "'"]]
          });
          console.log("1164 ".concat(log$1("push", _name4, "".concat("[[".concat(_i, ", ").concat(_i + 1, ", \"'\"]]")))));
          logAttr.attrEndAt = _i;
          logAttr.attrClosingQuote.pos = _i;
          logAttr.attrClosingQuote.val = "'";
          console.log("1172 ".concat(log$1("SET", "logAttr.attrEndAt", logAttr.attrEndAt, "logAttr.attrClosingQuote", logAttr.attrClosingQuote)));
          logTag.attributes.push(clone(logAttr));
          console.log("1183 ".concat(log$1("PUSH, then RESET", "logAttr")));
          resetLogAttr();
        } else if (withinTagInnerspace$1(str, _i)) {
          var compensationSpace = " ";
          var whatsOnTheRight = str[firstIdxOnTheRight$1(str, _i - 1)];
          console.log("1193 ".concat("\x1B[".concat(33, "m", "whatsOnTheRight", "\x1B[", 39, "m"), " = ", JSON.stringify(whatsOnTheRight, null, 4)));
          if (!str[_i].trim().length || !whatsOnTheRight || whatsOnTheRight === ">" || whatsOnTheRight === "/") {
            compensationSpace = "";
            console.log("1206 no compensation space");
          }
          console.log("1210 compensationSpace.length = ".concat(compensationSpace.length));
          var _issueName = "tag-attribute-closing-quotation-mark-missing";
          if (logAttr.attrOpeningQuote.val && (!logAttr.attrClosingQuote || logAttr.attrClosingQuote.pos === _i)) {
            console.log("1219");
            if (!retObj.issues.some(function (issueObj) {
              i = _i;
              return issueObj.name === _issueName && issueObj.position.length === 1 && issueObj.position[0][0] === _i && issueObj.position[0][1] === _i;
            })) {
              retObj.issues.push({
                name: _issueName,
                position: [[_i, _i, "".concat(logAttr.attrOpeningQuote.val).concat(compensationSpace)]]
              });
              console.log("1238 ".concat(log$1("push", _issueName, "".concat("[[".concat(_i, ", ").concat(_i, ", ", "".concat(logAttr.attrOpeningQuote.val).concat(compensationSpace), "]]")))));
            } else {
              console.log("1248 ".concat("\x1B[".concat(31, "m", "didn't push a duplicate issue", "\x1B[", 39, "m")));
            }
          }
          if (!logAttr.attrClosingQuote.pos) {
            logAttr.attrEndAt = _i;
            logAttr.attrClosingQuote.pos = _i;
            logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
            console.log("1259 ".concat(log$1("set", "logAttr.attrClosingQuote", logAttr.attrClosingQuote, "logAttr.attrEndAt", logAttr.attrEndAt)));
            logTag.attributes.push(clone(logAttr));
            console.log("1269 ".concat(log$1("PUSH, then RESET", "logAttr")));
            resetLogAttr();
          }
        }
      }
      if (logAttr.attrOpeningQuote.val && logAttr.attrOpeningQuote.pos < _i && logAttr.attrClosingQuote.pos === null && (
      str[_i] === "/" && firstIdxOnTheRight$1(str, _i) && str[firstIdxOnTheRight$1(str, _i)] === ">" || str[_i] === ">")) {
        console.log("1289 inside error catch clauses");
        retObj.issues.push({
          name: "tag-attribute-closing-quotation-mark-missing",
          position: [[_i, _i, logAttr.attrOpeningQuote.val]]
        });
        console.log("1296 ".concat(log$1("push", "tag-attribute-closing-quotation-mark-missing", "".concat("[[".concat(_i, ", ").concat(_i, ", ").concat(logAttr.attrOpeningQuote.val, "]]")))));
        logAttr.attrClosingQuote.pos = _i;
        logAttr.attrClosingQuote.val = logAttr.attrOpeningQuote.val;
        console.log("1306 ".concat(log$1("set", "logAttr.attrClosingQuote", logAttr.attrClosingQuote)));
        logTag.attributes.push(clone(logAttr));
        console.log("1314 ".concat(log$1("PUSH, then RESET", "logAttr")));
        resetLogAttr();
      }
    }
    if (charcode < 32) {
      var _name5 = "bad-character-".concat(lowAsciiCharacterNames[charcode]);
      if (charcode === 9) {
        retObj.issues.push({
          name: _name5,
          position: [[_i, _i + 1, "  "]]
        });
        console.log("1342 PUSH \"".concat(_name5, "\", [[").concat(_i, ", ").concat(_i + 1, ", \"  \"]]"));
      } else if (charcode === 13) {
        if (isStr$1(str[_i + 1]) && str[_i + 1].charCodeAt(0) === 10) {
          if (opts.style && opts.style.line_endings_CR_LF_CRLF && opts.style.line_endings_CR_LF_CRLF !== "CRLF") {
            retObj.issues.push({
              name: "file-wrong-type-line-ending-CRLF",
              position: [[_i, _i + 2, rawEnforcedEOLChar]]
            });
            console.log("1361 ".concat(log$1("push", "file-wrong-type-line-ending-CRLF", "".concat("[[".concat(_i, ", ").concat(_i + 2, ", ").concat(JSON.stringify(rawEnforcedEOLChar, null, 0), "]]")))));
          } else {
            logLineEndings.crlf.push([_i, _i + 2]);
            console.log("1375 ".concat(log$1("logLineEndings.crlf push", "[".concat(_i, ", ").concat(_i + 2, "]"))));
          }
        } else {
          if (opts.style && opts.style.line_endings_CR_LF_CRLF && opts.style.line_endings_CR_LF_CRLF !== "CR") {
            retObj.issues.push({
              name: "file-wrong-type-line-ending-CR",
              position: [[_i, _i + 1, rawEnforcedEOLChar]]
            });
            console.log("1391 ".concat(log$1("push", "file-wrong-type-line-ending-CR", "".concat("[[".concat(_i, ", ").concat(_i + 1, ", ").concat(JSON.stringify(rawEnforcedEOLChar, null, 0), "]]")))));
          } else {
            logLineEndings.cr.push([_i, _i + 1]);
            console.log("1405 ".concat(log$1("logLineEndings.cr push", "[".concat(_i, ", ").concat(_i + 1, "]"))));
          }
        }
      } else if (charcode === 10) {
        if (!(isStr$1(str[_i - 1]) && str[_i - 1].charCodeAt(0) === 13)) {
          if (opts.style && opts.style.line_endings_CR_LF_CRLF && opts.style.line_endings_CR_LF_CRLF !== "LF") {
            retObj.issues.push({
              name: "file-wrong-type-line-ending-LF",
              position: [[_i, _i + 1, rawEnforcedEOLChar]]
            });
            console.log("1425 ".concat(log$1("push", "file-wrong-type-line-ending-LF", "".concat("[[".concat(_i, ", ").concat(_i + 1, ", ").concat(JSON.stringify(rawEnforcedEOLChar, null, 0), "]]")))));
          } else {
            logLineEndings.lf.push([_i, _i + 1]);
            console.log("1439 ".concat(log$1("logLineEndings.lf push", "[".concat(_i, ", ").concat(_i + 1, "]"))));
          }
        }
      } else {
        retObj.issues.push({
          name: _name5,
          position: [[_i, _i + 1]]
        });
        console.log("1449 ".concat(log$1("push", _name5, "".concat("[[".concat(_i, ", ").concat(_i + 1, "]]")))));
      }
    } else if (encodeChar$1(str, _i)) {
      var _newIssue2 = encodeChar$1(str, _i);
      console.log("1454 ".concat("\x1B[".concat(31, "m", "\u2588\u2588", "\x1B[", 39, "m"), " new issue: ", JSON.stringify(_newIssue2, null, 0)));
      rawIssueStaging.push(_newIssue2);
      console.log("1462 push above issue to ".concat("\x1B[".concat(36, "m", "rawIssueStaging", "\x1B[", 39, "m")));
    }
    if (logWhitespace.startAt !== null && str[_i].trim().length) {
      console.log("1469 - inside whitespace chunks ending clauses");
      if (logTag.tagNameStartAt !== null && logAttr.attrStartAt === null && (!logAttr.attrClosingQuote.pos || logAttr.attrClosingQuote.pos <= _i) && (str[_i] === ">" || str[_i] === "/" && "<>".includes(str[firstIdxOnTheRight$1(str, _i)]))) {
        console.log("1477");
        var _name6 = "tag-excessive-whitespace-inside-tag";
        if (str[logWhitespace.startAt - 1] === "/") {
          _name6 = "tag-whitespace-closing-slash-and-bracket";
        }
        retObj.issues.push({
          name: _name6,
          position: [[logWhitespace.startAt, _i]]
        });
        console.log("1490 ".concat(log$1("push", _name6, "".concat("[[".concat(logWhitespace.startAt, ", ").concat(_i, "]]")))));
      }
    }
    if (!str[_i].trim().length && logWhitespace.startAt === null) {
      logWhitespace.startAt = _i;
      console.log("1499 ".concat(log$1("set", "logWhitespace.startAt", logWhitespace.startAt)));
    }
    if (str[_i] === "\n" || str[_i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
        console.log("1508 ".concat(log$1("set", "logWhitespace.includesLinebreaks", logWhitespace.includesLinebreaks)));
      }
      logWhitespace.lastLinebreakAt = _i;
      console.log("1517 ".concat(log$1("set", "logWhitespace.lastLinebreakAt", logWhitespace.lastLinebreakAt)));
    }
    if (logTag.tagNameStartAt !== null && logTag.tagNameEndAt === null && !isLatinLetter(str[_i]) && str[_i] !== "<" && str[_i] !== "/") {
      console.log("1535 not a latin letter, thus we assume tag name ends here");
      logTag.tagNameEndAt = _i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, _i);
      logTag.recognised = knownHTMLTags.includes(logTag.tagName.toLowerCase());
      console.log("1542 ".concat(log$1("set", "logTag.tagNameEndAt", logTag.tagNameEndAt, "logTag.tagName", logTag.tagName, "logTag.recognised", logTag.recognised)));
    }
    if (logTag.tagStartAt !== null && logTag.tagNameStartAt === null && isLatinLetter(str[_i]) && logTag.tagStartAt < _i) {
      logTag.tagNameStartAt = _i;
      console.log("1563 ".concat(log$1("set", "logTag.tagNameStartAt", logTag.tagNameStartAt)));
      if (logTag.tagStartAt < _i - 1 && logWhitespace.startAt !== null) {
        tagIssueStaging.push({
          name: "tag-space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, _i]]
        });
        console.log("1573 ".concat(log$1("stage", "tag-space-after-opening-bracket", "".concat("[[".concat(logTag.tagStartAt + 1, ", ").concat(_i, "]]")))));
      }
    }
    if (logTag.tagNameStartAt !== null && logTag.tagNameEndAt === null && isUppercaseLetter(str[_i])) {
      retObj.issues.push({
        name: "tag-name-lowercase",
        position: [[_i, _i + 1, str[_i].toLowerCase()]]
      });
      console.log("1593 ".concat(log$1("push", "tag-name-lowercase", "".concat("[[".concat(_i, ", ").concat(_i + 1, ", ").concat(JSON.stringify(str[_i].toLowerCase(), null, 4), "]]")))));
    }
    if (str[_i] === "<") {
      console.log("1608 catch the beginning of a tag ".concat("\x1B[".concat(31, "m", "\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588", "\x1B[", 39, "m")));
      if (logTag.tagStartAt === null) {
        logTag.tagStartAt = _i;
        console.log("1614 ".concat(log$1("set", "logTag.tagStartAt", logTag.tagStartAt)));
      } else if (tagOnTheRight$1(str, _i)) {
        console.log("1620 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " new tag starts"));
        if (logTag.tagStartAt !== null && logTag.attributes.length && logTag.attributes.some(function (attrObj) {
          return attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote.pos !== null;
        })) {
          console.log("1636 TAG ON THE LEFT, WE CAN ADD CLOSING BRACKET (IF MISSING)");
          var lastNonWhitespaceOnLeft = firstOnTheLeft$1(str, _i);
          console.log("1650 ".concat(log$1("set", "lastNonWhitespaceOnLeft", lastNonWhitespaceOnLeft)));
          if (str[lastNonWhitespaceOnLeft] === ">") {
            logTag.tagEndAt = lastNonWhitespaceOnLeft + 1;
            console.log("1663 ".concat(log$1("set", "logTag.tagEndAt", logTag.tagEndAt)));
          } else {
            retObj.issues.push({
              name: "tag-missing-closing-bracket",
              position: [[lastNonWhitespaceOnLeft + 1, _i, ">"]]
            });
            console.log("1673 ".concat(log$1("push", "tag-missing-closing-bracket", "".concat("[[".concat(lastNonWhitespaceOnLeft + 1, ", ").concat(_i, ", \">\"]]")))));
          }
          if (rawIssueStaging.length) {
            console.log("1683 let's process all ".concat(rawIssueStaging.length, " raw character issues at staging"));
            rawIssueStaging.forEach(function (issueObj) {
              if (issueObj.position[0][0] < logTag.tagStartAt) {
                retObj.issues.push(issueObj);
                console.log("1690 ".concat(log$1("push", "issueObj", issueObj)));
              } else {
                console.log("1693 discarding ".concat(JSON.stringify(issueObj, null, 4)));
              }
            });
          }
          pingTag(clone(logTag));
          resetLogTag();
          resetLogAttr();
          rawIssueStaging = [];
          console.log("1707 ".concat(log$1("reset", "logTag & logAttr && rawIssueStaging")));
          logTag.tagStartAt = _i;
          console.log("1713 ".concat(log$1("set", "logTag.tagStartAt", logTag.tagStartAt)));
        } else {
          console.log("1716 NOT TAG ON THE LEFT, WE CAN ADD ENCODE BRACKETS");
          if (rawIssueStaging.length) {
            console.log("1721 ".concat(log$1("processing", "rawIssueStaging", rawIssueStaging)));
            console.log("1724 ".concat(log$1("log", "logTag.tagStartAt", logTag.tagStartAt)));
            console.log("1727 ".concat("\x1B[".concat(31, "m", JSON.stringify(logAttr, null, 4), "\x1B[", 39, "m")));
            rawIssueStaging.forEach(function (issueObj) {
              if (
              issueObj.position[0][0] < _i
              ) {
                  retObj.issues.push(issueObj);
                  console.log("1740 ".concat(log$1("push", "issueObj", issueObj)));
                } else {
                console.log("");
                console.log("1744 ".concat("\x1B[".concat(31, "m", "not pushed", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "issueObj", "\x1B[", 39, "m"), " = ", JSON.stringify(issueObj, null, 4), "\nbecause ", "\x1B[".concat(33, "m", "issueObj.position[0][0]", "\x1B[", 39, "m"), "=").concat(issueObj.position[0][0], " not < ", "\x1B[".concat(33, "m", "logTag.tagStartAt", "\x1B[", 39, "m"), "=").concat(logTag.tagStartAt));
              }
            });
            console.log("1756 wipe rawIssueStaging");
            rawIssueStaging = [];
          }
          if (tagIssueStaging.length) {
            console.log("1762 ".concat(log$1("wipe", "tagIssueStaging")));
            tagIssueStaging = [];
          }
        }
      }
    }
    if (charcode === 62 && logTag.tagStartAt !== null && (!logAttr.attrClosingQuote || logAttr.attrClosingQuote.pos < _i)) {
      if (tagIssueStaging.length) {
        console.log("1778 concat ".concat("\x1B[".concat(33, "m", "tagIssueStaging", "\x1B[", 39, "m"), " then wipe"));
        retObj.issues = retObj.issues.concat(tagIssueStaging);
        tagIssueStaging = [];
      }
      if (rawIssueStaging.length) {
        console.log("1786 ".concat(log$1("processing", "rawIssueStaging", rawIssueStaging)));
        console.log("".concat("\x1B[".concat(33, "m", "logTag", "\x1B[", 39, "m"), " = ", JSON.stringify(logTag, null, 4)));
        rawIssueStaging.forEach(function (issueObj) {
          if (issueObj.position[0][0] < logTag.tagStartAt || logTag.attributes.some(function (attrObj) {
            i = _i;
            return attrObj.attrValueStartAt < issueObj.position[0][0] && attrObj.attrValueEndAt > issueObj.position[0][0];
          }) && !retObj.issues.some(function (existingIssue) {
            i = _i;
            return existingIssue.position[0][0] === issueObj.position[0][0] && existingIssue.position[0][1] === issueObj.position[0][1];
          })) {
            retObj.issues.push(issueObj);
            console.log("1812 ".concat(log$1("push", "issueObj", issueObj)));
          } else {
            console.log("");
            console.log("1816 ".concat("\x1B[".concat(31, "m", "not pushed", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "issueObj", "\x1B[", 39, "m"), " = ", JSON.stringify(issueObj, null, 4), "\nbecause ", "\x1B[".concat(33, "m", "issueObj.position[0][0]", "\x1B[", 39, "m"), "=").concat(issueObj.position[0][0], " not < ", "\x1B[".concat(33, "m", "logTag.tagStartAt", "\x1B[", 39, "m"), "=").concat(logTag.tagStartAt));
          }
        });
        console.log("1828 wipe rawIssueStaging");
        rawIssueStaging = [];
      }
      resetLogTag();
      resetLogAttr();
      console.log("1835 ".concat(log$1("reset", "logTag & logAttr")));
    }
    if (str[_i].trim().length) {
      resetLogWhitespace();
      console.log("1861 ".concat(log$1("reset", "logWhitespace")));
    }
    if (!str[_i + 1]) {
      console.log("1866");
      if (rawIssueStaging.length) {
        console.log("1869");
        if (logTag.tagStartAt !== null && logTag.attributes.some(function (attrObj) {
          return attrObj.attrEqualAt !== null && attrObj.attrOpeningQuote !== null;
        })) {
          console.log("1880");
          rawIssueStaging.forEach(function (issueObj) {
            if (issueObj.position[0][0] < logTag.tagStartAt) {
              retObj.issues.push(issueObj);
              console.log("1885 ".concat(log$1("push", "issueObj", issueObj)));
            } else {
              console.log("\n1519 ".concat("\x1B[".concat(31, "m", "not pushed", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "issueObj", "\x1B[", 39, "m"), " = ", JSON.stringify(issueObj, null, 4), "\nbecause ", "\x1B[".concat(33, "m", "issueObj.position[0][0]", "\x1B[", 39, "m"), "=").concat(issueObj.position[0][0], " not < ", "\x1B[".concat(33, "m", "logTag.tagStartAt", "\x1B[", 39, "m"), "=").concat(logTag.tagStartAt));
            }
          });
          console.log("1900 wipe rawIssueStaging");
          rawIssueStaging = [];
          retObj.issues.push({
            name: "tag-missing-closing-bracket",
            position: [[logWhitespace.startAt ? logWhitespace.startAt : _i + 1, _i + 1, ">"]]
          });
          console.log("1915 ".concat(log$1("push", "tag-missing-closing-bracket", "".concat("[[".concat(logWhitespace.startAt ? logWhitespace.startAt : _i + 1, ", ").concat(_i + 1, ", \">\"]]")))));
        } else {
          retObj.issues = retObj.issues.concat(rawIssueStaging);
          console.log("1929 concat, then wipe ".concat("\x1B[".concat(33, "m", "rawIssueStaging", "\x1B[", 39, "m")));
          rawIssueStaging = [];
        }
      }
    }
    var output = {
      logTag: true,
      logAttr: true,
      logWhitespace: true,
      logLineEndings: false,
      retObj: false,
      tagIssueStaging: true,
      rawIssueStaging: true
    };
    console.log("".concat(Object.keys(output).some(function (key) {
      return output[key];
    }) ? "".concat("\x1B[".concat(31, "m", "\u2588 ", "\x1B[", 39, "m")) : "").concat(output.logTag && logTag.tagStartAt !== null ? "".concat("\x1B[".concat(33, "m", "logTag", "\x1B[", 39, "m"), " ", JSON.stringify(logTag, null, 4), "; ") : "").concat(output.logAttr && logAttr.attrStartAt !== null ? "".concat("\x1B[".concat(33, "m", "logAttr", "\x1B[", 39, "m"), " ", JSON.stringify(logAttr, null, 4), "; ") : "").concat(output.logWhitespace && logWhitespace.startAt !== null ? "".concat("\x1B[".concat(33, "m", "logWhitespace", "\x1B[", 39, "m"), " ", JSON.stringify(logWhitespace, null, 0), "; ") : "").concat(output.logLineEndings ? "".concat("\x1B[".concat(33, "m", "logLineEndings", "\x1B[", 39, "m"), " ", JSON.stringify(logLineEndings, null, 0), "; ") : "").concat(output.retObj ? "".concat("\x1B[".concat(33, "m", "retObj", "\x1B[", 39, "m"), " ", JSON.stringify(retObj, null, 4), "; ") : "").concat(output.tagIssueStaging && tagIssueStaging.length ? "\n".concat("\x1B[".concat(33, "m", "tagIssueStaging", "\x1B[", 39, "m"), " ", JSON.stringify(tagIssueStaging, null, 4), "; ") : "").concat(output.rawIssueStaging && rawIssueStaging.length ? "\n".concat("\x1B[".concat(33, "m", "rawIssueStaging", "\x1B[", 39, "m"), " ", JSON.stringify(rawIssueStaging, null, 4), "; ") : ""));
    i = _i;
  };
  for (var i = 0, len = str.length; i < len; i++) {
    var _ret = _loop(i, len);
    if (_ret === "continue") continue;
  }
  if ((!opts.style || !opts.style.line_endings_CR_LF_CRLF) && (logLineEndings.cr.length && logLineEndings.lf.length || logLineEndings.lf.length && logLineEndings.crlf.length || logLineEndings.cr.length && logLineEndings.crlf.length)) {
    if (logLineEndings.cr.length > logLineEndings.crlf.length && logLineEndings.cr.length > logLineEndings.lf.length) {
      console.log("2042 CR clearly prevalent");
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CR-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r"]]
          });
        });
      }
    } else if (logLineEndings.lf.length > logLineEndings.crlf.length && logLineEndings.lf.length > logLineEndings.cr.length) {
      console.log("2064 LF clearly prevalent");
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
    } else if (logLineEndings.crlf.length > logLineEndings.lf.length && logLineEndings.crlf.length > logLineEndings.cr.length) {
      console.log("2086 CRLF clearly prevalent");
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
    } else if (logLineEndings.crlf.length === logLineEndings.lf.length && logLineEndings.lf.length === logLineEndings.cr.length) {
      console.log("2108 same amount of each type of EOL");
      logLineEndings.crlf.forEach(function (eolEntryArr) {
        retObj.issues.push({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
      logLineEndings.cr.forEach(function (eolEntryArr) {
        retObj.issues.push({
          name: "file-mixed-line-endings-file-is-LF-mainly",
          position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
        });
      });
    } else if (logLineEndings.cr.length === logLineEndings.crlf.length && logLineEndings.cr.length > logLineEndings.lf.length) {
      console.log("2127 CR & CRLF are prevalent over LF");
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
      if (logLineEndings.lf.length) {
        logLineEndings.lf.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-CRLF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\r\n"]]
          });
        });
      }
    } else if (logLineEndings.lf.length === logLineEndings.crlf.length && logLineEndings.lf.length > logLineEndings.cr.length || logLineEndings.cr.length === logLineEndings.lf.length && logLineEndings.cr.length > logLineEndings.crlf.length) {
      console.log("2152 LF && CRLF are prevalent over CR or CR & LF are prevalent over CRLF");
      if (logLineEndings.cr.length) {
        logLineEndings.cr.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
      if (logLineEndings.crlf.length) {
        logLineEndings.crlf.forEach(function (eolEntryArr) {
          retObj.issues.push({
            name: "file-mixed-line-endings-file-is-LF-mainly",
            position: [[eolEntryArr[0], eolEntryArr[1], "\n"]]
          });
        });
      }
    }
  }
  console.log("2175 BEFORE FIX");
  console.log("2177 ".concat("\x1B[".concat(33, "m", "retObj.issues", "\x1B[", 39, "m"), " = ", JSON.stringify(retObj.issues, null, 4)));
  retObj.fix = isArr(retObj.issues) && retObj.issues.length ? merge(retObj.issues.reduce(function (acc, obj) {
    return acc.concat(obj.position);
  }, [])) : null;
  return retObj;
}

exports.lint = lint;
exports.version = version;
exports.errors = errors;
