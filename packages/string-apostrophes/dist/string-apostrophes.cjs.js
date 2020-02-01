/**
 * string-apostrophes
 * Comprehensive, HTML-entities-aware tool to typographically-correct the apostrophes and single/double quotes
 * Version: 1.2.13
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-apostrophes
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rangesApply = _interopDefault(require('ranges-apply'));

function convertOne(str, _ref) {
  var from = _ref.from,
      to = _ref.to,
      value = _ref.value,
      _ref$convertEntities = _ref.convertEntities,
      convertEntities = _ref$convertEntities === void 0 ? true : _ref$convertEntities,
      _ref$convertApostroph = _ref.convertApostrophes,
      convertApostrophes = _ref$convertApostroph === void 0 ? true : _ref$convertApostroph,
      offsetBy = _ref.offsetBy;
  if (!Number.isInteger(to)) {
    if (Number.isInteger(from)) {
      to = from + 1;
    } else {
      throw new Error("string-apostrophes: [THROW_ID_01] options objects keys' \"to\" and \"from\" values are not integers!");
    }
  }
  var rangesArr = [];
  var leftSingleQuote = "\u2018";
  var rightSingleQuote = "\u2019";
  var leftDoubleQuote = "\u201C";
  var rightDoubleQuote = "\u201D";
  var singlePrime = "\u2032";
  var doublePrime = "\u2033";
  var punctuationChars = [".", ",", ";", "!", "?"];
  function isNumber(str) {
    return typeof str === "string" && str.charCodeAt(0) >= 48 && str.charCodeAt(0) <= 57;
  }
  function isLetter(str) {
    return typeof str === "string" && str.length === 1 && str.toUpperCase() !== str.toLowerCase();
  }
  if (["'", leftSingleQuote, rightSingleQuote, singlePrime].includes(value) || to === from + 1 && ["'", leftSingleQuote, rightSingleQuote, singlePrime].includes(str[from])) {
    if (str[from - 1] && str[to] && isNumber(str[from - 1]) && !isLetter(str[to])) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&prime;" : singlePrime) && value !== (convertEntities ? "&prime;" : singlePrime)) {
        rangesArr.push([from, to, convertEntities ? "&prime;" : singlePrime]);
      } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
        rangesArr.push([from, to, "'"]);
      }
    } else if (str[to] && str[to + 1] && str[to] === "n" && str.slice(from, to) === str.slice(to + 1, to + 1 + (to - from))
    ) {
        if (convertApostrophes && str.slice(from, to + 2) !== (convertEntities ? "&rsquo;n&rsquo;" : "".concat(rightSingleQuote, "n").concat(rightSingleQuote)) && value !== (convertEntities ? "&rsquo;n&rsquo;" : "".concat(rightSingleQuote, "n").concat(rightSingleQuote))) {
          rangesArr.push([from, to + 2, convertEntities ? "&rsquo;n&rsquo;" : "".concat(rightSingleQuote, "n").concat(rightSingleQuote)]);
          if (typeof offsetBy === "function") {
            offsetBy(2);
          }
        } else if (!convertApostrophes && str.slice(from, to + 2) !== "'n'" && value !== "'n'") {
          rangesArr.push([from, to + 2, "'n'"]);
          if (typeof offsetBy === "function") {
            offsetBy(2);
          }
        }
      } else if (str[to] && str[to].toLowerCase() === "t" && (!str[to + 1] || str[to + 1].trim().length === 0 || str[to + 1].toLowerCase() === "i") || str[to] && str[to + 2] && str[to].toLowerCase() === "t" && str[to + 1].toLowerCase() === "w" && (str[to + 2].toLowerCase() === "a" || str[to + 2].toLowerCase() === "e" || str[to + 2].toLowerCase() === "i" || str[to + 2].toLowerCase() === "o") || str[to] && str[to + 1] && str[to].toLowerCase() === "e" && str[to + 1].toLowerCase() === "m" || str[to] && str[to + 4] && str[to].toLowerCase() === "c" && str[to + 1].toLowerCase() === "a" && str[to + 2].toLowerCase() === "u" && str[to + 3].toLowerCase() === "s" && str[to + 4].toLowerCase() === "e" || str[to] && isNumber(str[to])) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rsquo;" : rightSingleQuote) && value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
        rangesArr.push([from, to, convertEntities ? "&rsquo;" : rightSingleQuote]);
      } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
        rangesArr.push([from, to, "'"]);
      }
    } else if (str[from - 1] && str[to] && punctuationChars.includes(str[from - 1])) {
      if (str[to].trim().length === 0) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rsquo;" : rightSingleQuote) && value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&rsquo;" : rightSingleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
          rangesArr.push([from, to, "'"]);
        }
      } else if (str[to].charCodeAt(0) === 34 &&
      str[to + 1] && str[to + 1].trim().length === 0
      ) {
          if (convertApostrophes && str.slice(from, to + 1) !== (convertEntities ? "&rsquo;&rdquo;" : "".concat(rightSingleQuote).concat(rightDoubleQuote)) && value !== (convertEntities ? "&rsquo;&rdquo;" : "".concat(rightSingleQuote).concat(rightDoubleQuote))) {
            rangesArr.push([from, to + 1, "".concat(convertEntities ? "&rsquo;&rdquo;" : "".concat(rightSingleQuote).concat(rightDoubleQuote))]);
            if (typeof offsetBy === "function") {
              offsetBy(1);
            }
          } else if (!convertApostrophes && str.slice(from, to + 1) !== "'\"" && value !== "'\"") {
            rangesArr.push([from, to + 1, "'\""]);
            if (typeof offsetBy === "function") {
              offsetBy(1);
            }
          }
        }
    } else if (from === 0 && str.slice(to).trim().length) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&lsquo;" : leftSingleQuote) && value !== (convertEntities ? "&lsquo;" : leftSingleQuote)) {
        rangesArr.push([from, to, convertEntities ? "&lsquo;" : leftSingleQuote]);
      } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
        rangesArr.push([from, to, "'"]);
      }
    } else if (!str[to] && str.slice(0, from).trim().length) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rsquo;" : rightSingleQuote) && value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
        rangesArr.push([from, to, convertEntities ? "&rsquo;" : rightSingleQuote]);
      } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
        rangesArr.push([from, to, "'"]);
      }
    } else if (str[from - 1] && str[to] && (isLetter(str[from - 1]) || isNumber(str[from - 1])) && (isLetter(str[to]) || isNumber(str[to]))) {
      if (convertApostrophes) {
        if ((str[to] && str[from - 5] && str[from - 5].toLowerCase() === "h" && str[from - 4].toLowerCase() === "a" && str[from - 3].toLowerCase() === "w" && str[from - 2].toLowerCase() === "a" && str[from - 1].toLowerCase() === "i" && str[to].toLowerCase() === "i" || str[from - 1] && str[from - 1].toLowerCase() === "o" && str[to + 2] && str[to].toLowerCase() === "a" && str[to + 1].toLowerCase() === "h" && str[to + 2].toLowerCase() === "u") && str.slice(from, to) !== (convertEntities ? "&lsquo;" : leftSingleQuote) && value !== (convertEntities ? "&lsquo;" : leftSingleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&lsquo;" : leftSingleQuote]);
        } else if (str.slice(from, to) !== (convertEntities ? "&rsquo;" : rightSingleQuote) && value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&rsquo;" : rightSingleQuote]);
        }
      } else if (str.slice(from, to) !== "'" && value !== "'") {
        rangesArr.push([from, to, "'"]);
      }
    } else if (str[to] && (isLetter(str[to]) || isNumber(str[to]))) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&lsquo;" : leftSingleQuote) && value !== (convertEntities ? "&lsquo;" : leftSingleQuote)) {
        rangesArr.push([from, to, convertEntities ? "&lsquo;" : leftSingleQuote]);
      } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
        rangesArr.push([from, to, "'"]);
      }
    } else if (isLetter(str[from - 1]) || isNumber(str[from - 1])) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rsquo;" : rightSingleQuote) && value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
        rangesArr.push([from, to, convertEntities ? "&rsquo;" : rightSingleQuote]);
      } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
        rangesArr.push([from, to, "'"]);
      }
    } else if (str[from - 1] && str[from - 1].trim().length === 0) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&lsquo;" : leftSingleQuote) && value !== (convertEntities ? "&lsquo;" : leftSingleQuote)) {
        rangesArr.push([from, to, convertEntities ? "&lsquo;" : leftSingleQuote]);
      } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
        rangesArr.push([from, to, "'"]);
      }
    } else if (str[to] && str[to].trim().length === 0) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rsquo;" : rightSingleQuote) && value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
        rangesArr.push([from, to, convertEntities ? "&rsquo;" : rightSingleQuote]);
      } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
        rangesArr.push([from, to, "'"]);
      }
    }
  } else if (["\"", leftDoubleQuote, rightDoubleQuote, doublePrime].includes(value) || to === from + 1 && ["\"", leftDoubleQuote, rightDoubleQuote, doublePrime].includes(str[from])) {
    if (str[from - 1] && isNumber(str[from - 1]) && str[to] && str[to] !== "'" && str[to] !== '"' && str[to] !== rightSingleQuote && str[to] !== rightDoubleQuote && str[to] !== leftSingleQuote && str[to] !== leftDoubleQuote) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&Prime;" : doublePrime) && value !== (convertEntities ? "&Prime;" : doublePrime)) {
        rangesArr.push([from, to, convertEntities ? "&Prime;" : doublePrime]);
      } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
        rangesArr.push([from, to, "\""]);
      }
    } else if (str[from - 1] && str[to] && punctuationChars.includes(str[from - 1])) {
      if (str[to].trim().length === 0) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rdquo;" : rightDoubleQuote) && value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&rdquo;" : rightDoubleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
          rangesArr.push([from, to, "\""]);
        }
      } else if (str[to].charCodeAt(0) === 39 &&
      str[to + 1] && str[to + 1].trim().length === 0) {
        if (convertApostrophes && str.slice(from, to + 1) !== (convertEntities ? "&rdquo;&rsquo;" : "".concat(rightDoubleQuote).concat(rightSingleQuote)) && value !== (convertEntities ? "&rdquo;&rsquo;" : "".concat(rightDoubleQuote).concat(rightSingleQuote))) {
          rangesArr.push([from, to + 1, convertEntities ? "&rdquo;&rsquo;" : "".concat(rightDoubleQuote).concat(rightSingleQuote)]);
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        } else if (!convertApostrophes && str.slice(from, to + 1) !== "\"'" && value !== "\"'") {
          rangesArr.push([from, to + 1, "\"'"]);
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        }
      }
    } else if (from === 0 && str[to] && str.slice(to).trim().length) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&ldquo;" : leftDoubleQuote) && value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)) {
        rangesArr.push([from, to, convertEntities ? "&ldquo;" : leftDoubleQuote]);
      } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
        rangesArr.push([from, to, "\""]);
      }
    } else if (!str[to] && str.slice(0, from).trim().length) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rdquo;" : rightDoubleQuote) && value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)) {
        rangesArr.push([from, to, convertEntities ? "&rdquo;" : rightDoubleQuote]);
      } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
        rangesArr.push([from, to, "\""]);
      }
    } else if (str[to] && (isLetter(str[to]) || isNumber(str[to]))) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&ldquo;" : leftDoubleQuote) && value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)) {
        rangesArr.push([from, to, convertEntities ? "&ldquo;" : leftDoubleQuote]);
      } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
        rangesArr.push([from, to, "\""]);
      }
    } else if (str[from - 1] && (isLetter(str[from - 1]) || isNumber(str[from - 1]))) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rdquo;" : rightDoubleQuote) && value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)) {
        rangesArr.push([from, to, convertEntities ? "&rdquo;" : rightDoubleQuote]);
      } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
        rangesArr.push([from, to, "\""]);
      }
    } else if (str[from - 1] && str[from - 1].trim().length === 0) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&ldquo;" : leftDoubleQuote) && value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)) {
        rangesArr.push([from, to, convertEntities ? "&ldquo;" : leftDoubleQuote]);
      } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
        rangesArr.push([from, to, "\""]);
      }
    } else if (str[to] && str[to].trim().length === 0) {
      if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rdquo;" : rightDoubleQuote) && value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)) {
        rangesArr.push([from, to, convertEntities ? "&rdquo;" : rightDoubleQuote]);
      } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
        rangesArr.push([from, to, "\""]);
      }
    }
  }
  return rangesArr;
}
function convertAll(str, opts) {
  var ranges = [];
  var preppedOpts = Object.assign({
    convertApostrophes: true,
    convertEntities: false
  }, opts);
  var _loop = function _loop(_i, len) {
    preppedOpts.from = _i;
    preppedOpts.offsetBy = function (idx) {
      _i = _i + idx;
    };
    var res = convertOne(str, preppedOpts);
    if (Array.isArray(res) && res.length) {
      ranges = ranges.concat(res);
    }
    i = _i;
  };
  for (var i = 0, len = str.length; i < len; i++) {
    _loop(i);
  }
  return {
    result: rangesApply(str, ranges),
    ranges: ranges
  };
}

exports.convertAll = convertAll;
exports.convertOne = convertOne;
