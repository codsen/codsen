/** 
 * string-remove-widows
 * Helps to prevent widow words in text
 * Version: 1.2.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-widows
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var apply = _interopDefault(require('ranges-apply'));
var isObj = _interopDefault(require('lodash.isplainobject'));

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

var version = "1.2.8";

var rawnbsp = "\xA0";
var encodedNbspHtml = "&nbsp;";
var encodedNbspCss = "\\00A0";
var encodedNbspJs = "\\u00A0";

var defaultOpts = {
  removeWidowPreventionMeasures: false,
  killSwitch: false,
  convertEntities: false,
  language: "html",
  hyphens: true,
  minWordCount: 4,
  minCharLen: 50,
  reportProgressFunc: null
};
function removeWidows(str, originalOpts) {
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
  var len = str.length;
  var midLen = Math.floor(len / 2);
  var ranges = [];
  var currentPercentageDone;
  var lastPercentage = 0;
  var lastWhitespaceStartedAt;
  var lastWhitespaceEndedAt;
  var lastEncodedNbspStartedAt;
  var lastEncodedNbspEndedAt;
  var opts = Object.assign({}, defaultOpts, originalOpts);
  function resetAll() {
    lastWhitespaceStartedAt = undefined;
    lastWhitespaceEndedAt = undefined;
    lastEncodedNbspStartedAt = undefined;
    lastEncodedNbspEndedAt = undefined;
  }
  resetAll();
  for (var i = 0, _len = str.length; i < _len; i++) {
    if (typeof opts.reportProgressFunc === "function") {
      if (_len > 1000 && _len < 2000) {
        if (i === midLen) {
          opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
        }
      } else if (_len >= 2000) {
        currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / _len);
        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
      }
    }
    if (str[i] === "&" && str[i + 1] === "n" && str[i + 2] === "b" && str[i + 3] === "s" && str[i + 4] === "p" && str[i + 5] === ";" || str[i] === "&" && str[i + 1] === "#" && str[i + 2] === "1" && str[i + 3] === "6" && str[i + 4] === "0" && str[i + 5] === ";") {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6;
      if (str[i + 6] && str[i + 6].trim().length) ;
    }
    if (str[i] === "\\" && str[i + 1] === "0" && str[i + 2] === "0" && str[i + 3] && str[i + 3].toUpperCase() === "A" && str[i + 4] === "0") {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 5;
      if (str[i + 5] && str[i + 5].trim().length) ;
    }
    if (str[i] === "\\" && str[i + 1] && str[i + 1].toLowerCase() === "u" && str[i + 2] === "0" && str[i + 3] === "0" && str[i + 4] && str[i + 4].toUpperCase() === "A" && str[i + 5] === "0") {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6;
      if (str[i + 6] && str[i + 6].trim().length) ;
    }
    if (str[i] === rawnbsp) {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 1;
      if (str[i + 2] && str[i + 2].trim().length) ;
    }
    if (str[i].trim().length && (!str[i - 1] || !str[i - 1].trim().length)) ;
    if (i && str[i].trim().length && (!str[i - 1] || str[i - 1] && !str[i - 1].trim().length)) {
      lastWhitespaceEndedAt = i;
    }
    if (!str[i].trim().length && str[i - 1] && str[i - 1].trim().length && (lastWhitespaceStartedAt === undefined || str[lastWhitespaceStartedAt - 1] && str[lastWhitespaceStartedAt - 1].trim().length)) {
      lastWhitespaceStartedAt = i;
      lastWhitespaceEndedAt = undefined;
    }
    if (!str[i + 1]) {
      var finalStart = void 0;
      var finalEnd = void 0;
      var finalWhatToInsert = rawnbsp;
      if (lastWhitespaceStartedAt !== undefined && lastWhitespaceEndedAt !== undefined && lastEncodedNbspStartedAt !== undefined && lastEncodedNbspEndedAt !== undefined) {
        if (lastWhitespaceStartedAt > lastEncodedNbspStartedAt) {
          finalStart = lastWhitespaceStartedAt;
          finalEnd = lastWhitespaceEndedAt;
        } else {
          finalStart = lastEncodedNbspStartedAt;
          finalEnd = lastEncodedNbspEndedAt;
        }
      } else if (lastWhitespaceStartedAt !== undefined && lastWhitespaceEndedAt !== undefined) {
        finalStart = lastWhitespaceStartedAt;
        finalEnd = lastWhitespaceEndedAt;
      } else if (lastEncodedNbspStartedAt !== undefined && lastEncodedNbspEndedAt !== undefined) {
        finalStart = lastEncodedNbspStartedAt;
        finalEnd = lastEncodedNbspEndedAt;
      }
      if (opts.removeWidowPreventionMeasures) {
        finalWhatToInsert = " ";
      } else if (opts.convertEntities) {
        finalWhatToInsert = encodedNbspHtml;
        if (isStr(opts.language)) {
          if (opts.language.trim().toLowerCase() === "css") {
            finalWhatToInsert = encodedNbspCss;
          } else if (opts.language.trim().toLowerCase() === "js") {
            finalWhatToInsert = encodedNbspJs;
          }
        }
      }
      if (finalStart && finalEnd) {
        ranges.push([finalStart, finalEnd, finalWhatToInsert]);
      }
      resetAll();
    }
  }
  return {
    res: apply(str, ranges),
    ranges: ranges,
    log: {
      timeTakenInMiliseconds: Date.now() - start
    }
  };
}

exports.defaultOpts = defaultOpts;
exports.removeWidows = removeWidows;
exports.version = version;
