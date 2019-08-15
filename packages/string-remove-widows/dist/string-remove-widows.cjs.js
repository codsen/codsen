/**
 * string-remove-widows
 * Helps to prevent widow words in a text
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-widows
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var apply = _interopDefault(require('ranges-apply'));
var stringLeftRight = require('string-left-right');
var stringMatchLeftRight = require('string-match-left-right');
var isObj = _interopDefault(require('lodash.isplainobject'));
var arrayiffyIfStr = _interopDefault(require('arrayiffy-if-string'));

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

var version = "1.1.1";

var rawnbsp = "\xA0";
var encodedNbspHtml = "&nbsp;";
var encodedNbspCss = "\\00A0";
var encodedNbspJs = "\\u00A0";
var rawNdash = "\u2013";
var encodedNdashHtml = "&ndash;";
var encodedNdashCss = "\\2013";
var encodedNdashJs = "\\u2013";
var rawMdash = "\u2014";
var encodedMdashHtml = "&mdash;";
var encodedMdashCss = "\\2014";
var encodedMdashJs = "\\u2014";
var headsAndTailsJinja = [{
  heads: "{{",
  tails: "}}"
}, {
  heads: ["{% if", "{%- if"],
  tails: ["{% endif", "{%- endif"]
}, {
  heads: ["{% for", "{%- for"],
  tails: ["{% endfor", "{%- endfor"]
}, {
  heads: ["{%", "{%-"],
  tails: ["%}", "-%}"]
}, {
  heads: "{#",
  tails: "#}"
}];
var headsAndTailsHugo = [{
  heads: "{{",
  tails: "}}"
}];
var headsAndTailsHexo = [{
  heads: ["<%", "<%=", "<%-"],
  tails: ["%>", "=%>", "-%>"]
}];

var Ranges = require("ranges-push");
var defaultOpts = {
  removeWidowPreventionMeasures: false,
  convertEntities: true,
  targetLanguage: "html",
  UKPostcodes: false,
  hyphens: true,
  minWordCount: 4,
  minCharCount: 5,
  ignore: [],
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
function removeWidows(str, originalOpts) {
  function push(finalStart, finalEnd) {
    var finalWhatToInsert = rawnbsp;
    if (opts.removeWidowPreventionMeasures) {
      finalWhatToInsert = " ";
    } else if (opts.convertEntities) {
      finalWhatToInsert = encodedNbspHtml;
      if (isStr(opts.targetLanguage)) {
        if (opts.targetLanguage.trim().toLowerCase() === "css") {
          finalWhatToInsert = encodedNbspCss;
        } else if (opts.targetLanguage.trim().toLowerCase() === "js") {
          finalWhatToInsert = encodedNbspJs;
        }
      }
    }
    rangesArr.push(finalStart, finalEnd, finalWhatToInsert);
    console.log("058 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", finalStart, ", ").concat(finalEnd, ", \"").concat(finalWhatToInsert, "\"]"));
  }
  function isStr(something) {
    return typeof something === "string";
  }
  var start = Date.now();
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error("string-remove-widows: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("string-remove-widows: [THROW_ID_02] the first input argument must be string! It was given as \"".concat(_typeof(str), "\", equal to:\n").concat(JSON.stringify(str, null, 4)));
    }
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("string-remove-widows: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ".concat(_typeof(originalOpts), ", equal to ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var isArr = Array.isArray;
  var len = str.length;
  var rangesArr = new Ranges({
    mergeType: 2
  });
  var punctuationCharsToConsiderWidowIssue = ["."];
  var postcodeRegexFront = /[A-Z]{1,2}[0-9][0-9A-Z]?$/;
  var postcodeRegexEnd = /^[0-9][A-Z]{2}/;
  var leavePercForLastStage = 0.06;
  var currentPercentageDone;
  var lastPercentage = 0;
  var wordCount;
  var charCount;
  var secondToLastWhitespaceStartedAt;
  var secondToLastWhitespaceEndedAt;
  var lastWhitespaceStartedAt;
  var lastWhitespaceEndedAt;
  var lastEncodedNbspStartedAt;
  var lastEncodedNbspEndedAt;
  var doNothingUntil;
  var bumpWordCountAt;
  var opts = Object.assign({}, defaultOpts, originalOpts);
  if (opts.dashes) {
    opts.hyphens = true;
    delete opts.dashes;
  }
  if (!opts.ignore || !isArr(opts.ignore) && !isStr(opts.ignore)) {
    opts.ignore = [];
  } else {
    opts.ignore = arrayiffyIfStr(opts.ignore);
    if (opts.ignore.some(function (val) {
      return isStr(val);
    })) {
      var temp = [];
      opts.ignore = opts.ignore.filter(function (val) {
        if (isStr(val) && val.length) {
          if (["nunjucks", "jinja", "liquid"].includes(val.trim().toLowerCase())) {
            temp = temp.concat(headsAndTailsJinja);
          } else if (["hugo"].includes(val.trim().toLowerCase())) {
            temp = temp.concat(headsAndTailsHugo);
          } else if (["hexo"].includes(val.trim().toLowerCase())) {
            temp = temp.concat(headsAndTailsHexo);
          }
          return false;
        } else if (_typeof(val) === "object") {
          return true;
        }
      });
      if (temp.length) {
        opts.ignore = opts.ignore.concat(temp);
      }
    }
  }
  var ceil;
  if (opts.reportProgressFunc) {
    ceil = Math.floor(opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom);
    console.log("185 ".concat("\x1B[".concat(33, "m", "ceil", "\x1B[", 39, "m"), " = ", JSON.stringify(ceil, null, 4)));
  }
  function resetAll() {
    wordCount = 0;
    charCount = 0;
    secondToLastWhitespaceStartedAt = undefined;
    secondToLastWhitespaceEndedAt = undefined;
    lastWhitespaceStartedAt = undefined;
    lastWhitespaceEndedAt = undefined;
    lastEncodedNbspStartedAt = undefined;
    lastEncodedNbspEndedAt = undefined;
  }
  resetAll();
  console.log("216 ".concat("\x1B[".concat(32, "m", "USING", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "opts", "\x1B[", 39, "m"), " = ", JSON.stringify(opts, null, 4)));
  var _loop = function _loop(_i) {
    console.log("\n\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 35, "m", "str[ ".concat(_i, " ] = ").concat(str[_i].trim().length ? str[_i] : JSON.stringify(str[_i], null, 0)), "\x1B[", 39, "m \x1B[", 36, "m", "===============================", "\x1B[", 39, "m\n"));
    if (!doNothingUntil && isArr(opts.ignore) && opts.ignore.length) {
      opts.ignore.some(function (valObj, y) {
        if (isArr(valObj.heads) && valObj.heads.some(function (oneOfHeads) {
          return str.startsWith(oneOfHeads, _i);
        }) || isStr(valObj.heads) && str.startsWith(valObj.heads, _i)) {
          console.log("252 ".concat("\x1B[".concat(31, "m", "heads detected!", "\x1B[", 39, "m")));
          wordCount++;
          doNothingUntil = opts.ignore[y].tails;
          console.log("257 ".concat("\x1B[".concat(90, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "doNothingUntil", "\x1B[", 39, "m"), " = ", doNothingUntil));
          i = _i;
          return true;
        }
      });
    }
    if (!doNothingUntil && bumpWordCountAt && bumpWordCountAt === _i) {
      wordCount++;
      bumpWordCountAt = undefined;
      console.log("270 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "wordCount", "\x1B[", 39, "m"), " = ", wordCount, "; ", "\x1B[".concat(33, "m", "bumpWordCountAt", "\x1B[", 39, "m"), " = ").concat(bumpWordCountAt));
    }
    if (typeof opts.reportProgressFunc === "function") {
      currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(_i / len * ceil);
      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        opts.reportProgressFunc(currentPercentageDone);
      }
    }
    if (!doNothingUntil && _i && str[_i].trim().length && (!str[_i - 1] || str[_i - 1] && !str[_i - 1].trim().length)) {
      lastWhitespaceEndedAt = _i;
      console.log("302 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "lastWhitespaceEndedAt", "\x1B[", 39, "m"), " = ", lastWhitespaceEndedAt));
    }
    if (!doNothingUntil && str[_i].trim().length) {
      charCount++;
    }
    if (!doNothingUntil && opts.hyphens && (str[_i] === "-" || str[_i] === rawMdash || str[_i] === rawNdash || str.slice(_i).startsWith(encodedNdashHtml) || str.slice(_i).startsWith(encodedNdashCss) || str.slice(_i).startsWith(encodedNdashJs) || str.slice(_i).startsWith(encodedMdashHtml) || str.slice(_i).startsWith(encodedMdashCss) || str.slice(_i).startsWith(encodedMdashJs)) && str[_i + 1] && (!str[_i + 1].trim().length || str[_i] === "&")) {
      console.log("344 dash starts here");
      if (str[_i - 1] && !str[_i - 1].trim().length && str[stringLeftRight.left(str, _i)]) {
        push(stringLeftRight.left(str, _i) + 1, _i);
        console.log("347 push [".concat(stringLeftRight.left(str, _i) + 1, ", ").concat(_i, "]"));
      }
    } else {
      console.log("350 ELSE didn't catch the dash");
    }
    if (!doNothingUntil && (str[_i] === "&" && str[_i + 1] === "n" && str[_i + 2] === "b" && str[_i + 3] === "s" && str[_i + 4] === "p" && str[_i + 5] === ";" || str[_i] === "&" && str[_i + 1] === "#" && str[_i + 2] === "1" && str[_i + 3] === "6" && str[_i + 4] === "0" && str[_i + 5] === ";")) {
      console.log("369 HTML-encoded NBSP caught!");
      lastEncodedNbspStartedAt = _i;
      lastEncodedNbspEndedAt = _i + 6;
      console.log("373 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "lastEncodedNbspStartedAt", "\x1B[", 39, "m"), " = ", lastEncodedNbspStartedAt, "; ", "\x1B[".concat(33, "m", "lastEncodedNbspEndedAt", "\x1B[", 39, "m"), " = ").concat(lastEncodedNbspEndedAt));
      if (str[_i + 6] && str[_i + 6].trim().length) {
        bumpWordCountAt = _i + 6;
      }
      if (!opts.convertEntities) {
        rangesArr.push(_i, _i + 6, rawnbsp);
        console.log("386 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", _i, ", ").concat(_i + 6, ", \"").concat(rawnbsp, "\"]"));
      } else if (opts.targetLanguage === "css" || opts.targetLanguage === "js") {
        rangesArr.push(_i, _i + 6, opts.targetLanguage === "css" ? encodedNbspCss : encodedNbspJs);
        console.log("399 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", _i, ", ").concat(_i + 6, ", \"").concat(opts.targetLanguage === "css" ? encodedNbspCss : encodedNbspJs, "\"]"));
      }
    }
    if (!doNothingUntil && str[_i] === "\\" && str[_i + 1] === "0" && str[_i + 2] === "0" && str[_i + 3] && str[_i + 3].toUpperCase() === "A" && str[_i + 4] === "0") {
      console.log("416 CSS-encoded NBSP caught!");
      lastEncodedNbspStartedAt = _i;
      lastEncodedNbspEndedAt = _i + 5;
      console.log("420 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "lastEncodedNbspStartedAt", "\x1B[", 39, "m"), " = ", lastEncodedNbspStartedAt, "; ", "\x1B[".concat(33, "m", "lastEncodedNbspEndedAt", "\x1B[", 39, "m"), " = ").concat(lastEncodedNbspEndedAt));
      if (str[_i + 5] && str[_i + 5].trim().length) {
        bumpWordCountAt = _i + 5;
      }
      if (!opts.convertEntities) {
        rangesArr.push(_i, _i + 5, rawnbsp);
        console.log("433 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", _i, ", ").concat(_i + 5, ", \"").concat(rawnbsp, "\"]"));
      } else if (opts.targetLanguage === "html" || opts.targetLanguage === "js") {
        rangesArr.push(_i, _i + 5, opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspJs);
        console.log("446 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", _i, ", ").concat(_i + 5, ", \"").concat(opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspJs, "\"]"));
      }
    }
    if (!doNothingUntil && str[_i] === "\\" && str[_i + 1] && str[_i + 1].toLowerCase() === "u" && str[_i + 2] === "0" && str[_i + 3] === "0" && str[_i + 4] && str[_i + 4].toUpperCase() === "A" && str[_i + 5] === "0") {
      console.log("465 JS-encoded NBSP caught!");
      lastEncodedNbspStartedAt = _i;
      lastEncodedNbspEndedAt = _i + 6;
      console.log("469 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "lastEncodedNbspStartedAt", "\x1B[", 39, "m"), " = ", lastEncodedNbspStartedAt, "; ", "\x1B[".concat(33, "m", "lastEncodedNbspEndedAt", "\x1B[", 39, "m"), " = ").concat(lastEncodedNbspEndedAt));
      if (str[_i + 6] && str[_i + 6].trim().length) {
        bumpWordCountAt = _i + 6;
      }
      if (!opts.convertEntities) {
        rangesArr.push(_i, _i + 6, rawnbsp);
        console.log("482 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", _i, ", ").concat(_i + 6, ", \"").concat(rawnbsp, "\"]"));
      } else if (opts.targetLanguage === "html" || opts.targetLanguage === "css") {
        rangesArr.push(_i, _i + 6, opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspCss);
        console.log("495 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", _i, ", ").concat(_i + 6, ", \"").concat(opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspCss, "\"]"));
      }
    }
    if (!doNothingUntil && str[_i] === rawnbsp) {
      console.log("504 raw unencoded NBSP caught!");
      lastEncodedNbspStartedAt = _i;
      lastEncodedNbspEndedAt = _i + 1;
      console.log("508 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "lastEncodedNbspStartedAt", "\x1B[", 39, "m"), " = ", lastEncodedNbspStartedAt, "; ", "\x1B[".concat(33, "m", "lastEncodedNbspEndedAt", "\x1B[", 39, "m"), " = ").concat(lastEncodedNbspEndedAt));
      if (str[_i + 2] && str[_i + 2].trim().length) {
        bumpWordCountAt = _i + 2;
      }
      if (opts.convertEntities) {
        rangesArr.push(_i, _i + 1, opts.targetLanguage === "css" ? encodedNbspCss : opts.targetLanguage === "js" ? encodedNbspJs : encodedNbspHtml);
        console.log("529 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", _i, ", ").concat(_i + 1, ", \"").concat(opts.targetLanguage === "css" ? encodedNbspCss : opts.targetLanguage === "js" ? encodedNbspJs : encodedNbspHtml, "\"]"));
      }
    }
    if (!doNothingUntil && str[_i].trim().length && (!str[_i - 1] || !str[_i - 1].trim().length)) {
      wordCount++;
      console.log("549 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "wordCount", "\x1B[", 39, "m"), " = ", wordCount));
    }
    if (!doNothingUntil && (!str[_i + 1] || str[_i] === "\n" && str[_i + 1] === "\n" || str[_i] === "\r" && str[_i + 1] === "\r" || str[_i] === "\r" && str[_i + 1] === "\n" && str[_i + 2] === "\r" && str[_i + 3] === "\n" || (str[_i] === "\n" || str[_i] === "\r" || str[_i] === "\r" && str[_i + 1] === "\n") && str[_i - 1] && punctuationCharsToConsiderWidowIssue.includes(str[stringLeftRight.left(str, _i)]))) {
      console.log("570 ".concat("\x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m"), " PARAGRAPH ENDING!"));
      if ((!opts.minWordCount || wordCount >= opts.minWordCount) && (!opts.minCharCount || charCount >= opts.minCharCount)) {
        var finalStart;
        var finalEnd;
        if (lastWhitespaceStartedAt !== undefined && lastWhitespaceEndedAt !== undefined && lastEncodedNbspStartedAt !== undefined && lastEncodedNbspEndedAt !== undefined) {
          console.log("587");
          if (lastWhitespaceStartedAt > lastEncodedNbspStartedAt) {
            finalStart = lastWhitespaceStartedAt;
            finalEnd = lastWhitespaceEndedAt;
          } else {
            finalStart = lastEncodedNbspStartedAt;
            finalEnd = lastEncodedNbspEndedAt;
          }
        } else if (lastWhitespaceStartedAt !== undefined && lastWhitespaceEndedAt !== undefined) {
          console.log("599");
          finalStart = lastWhitespaceStartedAt;
          finalEnd = lastWhitespaceEndedAt;
        } else if (lastEncodedNbspStartedAt !== undefined && lastEncodedNbspEndedAt !== undefined) {
          console.log("606");
          finalStart = lastEncodedNbspStartedAt;
          finalEnd = lastEncodedNbspEndedAt;
        }
        if (!(finalStart && finalEnd) && secondToLastWhitespaceStartedAt && secondToLastWhitespaceEndedAt) {
          console.log("619");
          finalStart = secondToLastWhitespaceStartedAt;
          finalEnd = secondToLastWhitespaceEndedAt;
        }
        console.log("624 finalStart = ".concat(finalStart, "; finalEnd = ").concat(finalEnd));
        if (finalStart && finalEnd) {
          push(finalStart, finalEnd);
        }
      }
      resetAll();
      console.log("632 ".concat("\x1B[".concat(31, "m", "RESET", "\x1B[", 39, "m")));
    }
    if (opts.UKPostcodes && !str[_i].trim().length && str[_i - 1] && str[_i - 1].trim().length && postcodeRegexFront.test(str.slice(0, _i)) && str[stringLeftRight.right(str, _i)] && postcodeRegexEnd.test(str.slice(stringLeftRight.right(str, _i)))) {
      console.log("646 POSTCODE caught: [".concat(_i, ", ").concat(stringLeftRight.right(str, _i), "]"));
      push(_i, stringLeftRight.right(str, _i));
    }
    if (!doNothingUntil && !str[_i].trim().length && str[_i - 1] && str[_i - 1].trim().length && (lastWhitespaceStartedAt === undefined || str[lastWhitespaceStartedAt - 1] && str[lastWhitespaceStartedAt - 1].trim().length) && !"/>".includes(str[stringLeftRight.right(str, _i)]) && !str.slice(0, stringLeftRight.left(str, _i) + 1).endsWith("br") && !str.slice(0, stringLeftRight.left(str, _i) + 1).endsWith("hr")) {
      secondToLastWhitespaceStartedAt = lastWhitespaceStartedAt;
      secondToLastWhitespaceEndedAt = lastWhitespaceEndedAt;
      lastWhitespaceStartedAt = _i;
      lastWhitespaceEndedAt = undefined;
      console.log("696 ".concat("\x1B[".concat(32, "m", "SET 2", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "secondToLastWhitespaceStartedAt", "\x1B[", 39, "m"), " = ", secondToLastWhitespaceStartedAt, ";").concat(" ".repeat(String(secondToLastWhitespaceStartedAt).length < String(lastWhitespaceStartedAt).length ? Math.max(String(secondToLastWhitespaceStartedAt).length, String(lastWhitespaceStartedAt).length) - Math.min(String(secondToLastWhitespaceStartedAt).length, String(lastWhitespaceStartedAt).length) : 0), " ", "\x1B[".concat(33, "m", "secondToLastWhitespaceEndedAt", "\x1B[", 39, "m"), " = ").concat(secondToLastWhitespaceEndedAt, ";"));
      console.log("711 ".concat("\x1B[".concat(32, "m", "SET 2", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "lastWhitespaceStartedAt", "\x1B[", 39, "m"), "         = ", lastWhitespaceStartedAt, ";").concat(" ".repeat(String(secondToLastWhitespaceStartedAt).length > String(lastWhitespaceStartedAt).length ? Math.max(String(secondToLastWhitespaceStartedAt).length, String(lastWhitespaceStartedAt).length) - Math.min(String(secondToLastWhitespaceStartedAt).length, String(lastWhitespaceStartedAt).length) : 0), " ", "\x1B[".concat(33, "m", "lastWhitespaceEndedAt", "\x1B[", 39, "m"), "         = ").concat(lastWhitespaceEndedAt, ";"));
      if (lastEncodedNbspStartedAt !== undefined || lastEncodedNbspEndedAt !== undefined) {
        lastEncodedNbspStartedAt = undefined;
        lastEncodedNbspEndedAt = undefined;
        console.log("734 ".concat("\x1B[".concat(90, "m", "RESET", "\x1B[", 39, "m"), " lastEncodedNbspStartedAt, lastEncodedNbspEndedAt"));
      }
    }
    var tempTailFinding = void 0;
    if (doNothingUntil) {
      if (isStr(doNothingUntil) && (!doNothingUntil.length || str.startsWith(doNothingUntil, _i))) {
        doNothingUntil = undefined;
      } else if (isArr(doNothingUntil) && (!doNothingUntil.length || doNothingUntil.some(function (val) {
        if (str.startsWith(val, _i)) {
          tempTailFinding = val;
          i = _i;
          return true;
        }
      }))) {
        doNothingUntil = undefined;
        console.log("759 RESET ".concat("\x1B[".concat(33, "m", "doNothingUntil", "\x1B[", 39, "m")));
        console.log("762 ".concat("\x1B[".concat(32, "m", "BUMP", "\x1B[", 39, "m"), " i: ", "\x1B[".concat(33, "m", _i, "\x1B[", 39, "m"), "=>", "\x1B[".concat(33, "m", _i + tempTailFinding.length, "\x1B[", 39, "m")));
        _i += tempTailFinding.length;
        console.log("772 \x1B[".concat(32, "m", "\u2588\u2588", "\x1B[", 39, "m we're at i=", _i, ", to the right is: ").concat(str.slice(_i)));
        if (isArr(opts.ignore) && opts.ignore.length && str[_i + 1]) {
          opts.ignore.some(function (oneOfHeadsTailsObjs) {
            i = _i;
            return stringMatchLeftRight.matchRightIncl(str, _i, oneOfHeadsTailsObjs.tails, {
              trimBeforeMatching: true,
              cb: function cb(_char, theRemainderOfTheString, index) {
                if (index) {
                  console.log("793 RECEIVED by CB() index = ".concat(index));
                  _i = index - 1;
                  console.log("796 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " i = ", _i - 1));
                  if (str[_i + 1] && str[_i + 1].trim().length) {
                    wordCount++;
                    console.log("801 ".concat("\x1B[".concat(32, "m", "BUMP", "\x1B[", 39, "m"), " wordCount now = ", wordCount));
                  }
                }
                i = _i;
                return true;
              }
            });
          });
        }
      }
    }
    console.log("    \x1B[".concat(90, "m", "\u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 END \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588 \u2588\u2588", "\x1B[", 39, "m"));
    console.log("".concat("\x1B[".concat(90, "m", "231 second-to-last whitespace: [".concat(secondToLastWhitespaceStartedAt, ", ").concat(secondToLastWhitespaceEndedAt, "]"), "\x1B[", 39, "m")));
    console.log("".concat("\x1B[".concat(90, "m", "231 last whitespace: [".concat(lastWhitespaceStartedAt, ", ").concat(lastWhitespaceEndedAt, "]"), "\x1B[", 39, "m")));
    console.log("".concat("\x1B[".concat(90, "m", "234 last encoded nbsp: [".concat(lastEncodedNbspStartedAt, ", ").concat(lastEncodedNbspEndedAt, "]"), "\x1B[", 39, "m")));
    console.log("".concat("\x1B[".concat(90, "m", "237 word count ".concat(wordCount, "; char count ").concat(charCount), "\x1B[", 39, "m"), bumpWordCountAt ? "".concat("\x1B[".concat(90, "m", ";", "\x1B[", 39, "m"), "\x1B[".concat(90, "m", " bumpWordCountAt = ".concat(bumpWordCountAt), "\x1B[", 39, "m")) : ""));
    console.log("".concat("\x1B[".concat(90, "m", "516 rangesArr: ".concat(JSON.stringify(rangesArr.current(), null, 0)), "\x1B[", 39, "m"), doNothingUntil ? "\n".concat("\x1B[".concat(31, "m", "doNothingUntil = ".concat(JSON.stringify(doNothingUntil, null, 0)), "\x1B[", 39, "m")) : ""));
    i = _i;
  };
  for (var i = 0; i < len; i++) {
    _loop(i);
  }
  return {
    res: apply(str, rangesArr.current(), opts.reportProgressFunc ? function (incomingPerc) {
      currentPercentageDone = Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * (1 - leavePercForLastStage) + incomingPerc / 100 * (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage);
      console.log("870 ".concat("\x1B[".concat(33, "m", "currentPercentageDone", "\x1B[", 39, "m"), " = ", JSON.stringify(currentPercentageDone, null, 4)));
      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        opts.reportProgressFunc(currentPercentageDone);
      }
    } : null),
    ranges: rangesArr.current(),
    log: {
      timeTakenInMiliseconds: Date.now() - start
    }
  };
}

exports.defaultOpts = defaultOpts;
exports.removeWidows = removeWidows;
exports.version = version;
