/**
 * generate-atomic-css
 * Generate Atomic CSS
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/generate-atomic-css
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var stringLeftRight = require('string-left-right');
var split = _interopDefault(require('split-lines'));

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

var version = "1.0.1";

function isStr(something) {
  return typeof something === "string";
}
function trimBlankLinesFromLinesArray(lineArr) {
  var copyArr = Array.from(lineArr);
  if (copyArr.length && isStr(copyArr[0]) && !copyArr[0].trim().length) {
    do {
      copyArr.shift();
    } while (!copyArr[0].trim().length);
  }
  if (copyArr.length && isStr(copyArr[copyArr.length - 1]) && !copyArr[copyArr.length - 1].trim().length) {
    do {
      copyArr.pop();
    } while (!copyArr[copyArr.length - 1].trim().length);
  }
  return copyArr;
}
function prepLine(str, progressFn, subsetFrom, subsetTo) {
  var currentPercentageDone;
  var lastPercentage = 0;
  var split = str.split("|").filter(function (val) {
    return val.length;
  });
  var from = 0;
  var to = 500;
  if (split[1]) {
    if (split[2]) {
      from = Number.parseInt(split[1].trim());
      to = Number.parseInt(split[2].trim());
    } else {
      to = Number.parseInt(split[1].trim());
    }
  }
  var res = "";
  var subsetRange = subsetTo - subsetFrom;
  for (var i = from; i <= to; i++) {
    var newStr = split[0];
    var threeDollarRegexWithUnits = /\$\$\$(px|em|%|rem|cm|mm|in|pt|pc|ex|ch|vw|vmin|vmax)/g;
    var threeDollarFollowedByWhitespaceRegex = /\$\$\$(?=[{ ])/g;
    var threeDollarRegex = /\$\$\$/g;
    res += "".concat(i === from ? "" : "\n").concat(newStr.replace(threeDollarRegexWithUnits, "".concat(i).concat(i === 0 ? "" : "$1").padStart(String(to).length + "$1".length)).replace(threeDollarFollowedByWhitespaceRegex, "".concat(i).padEnd(String(to).length)).replace(threeDollarRegex, i)).trimEnd();
    if (typeof progressFn === "function") {
      currentPercentageDone = Math.floor(subsetFrom + i / (to - from) * subsetRange);
      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        progressFn(currentPercentageDone);
      }
    }
  }
  return res;
}
function prepConfig(str, progressFn, progressFrom, progressTo) {
  return trimBlankLinesFromLinesArray(split(str).map(function (rowStr, i, arr) {
    return rowStr.includes("$$$") ? prepLine(rowStr, progressFn, progressFrom + (progressTo - progressFrom) / arr.length * i, progressFrom + (progressTo - progressFrom) / arr.length * (i + 1)) : rowStr;
  })).join("\n");
}

var headsAndTails = {
  CONFIGHEAD: "GENERATE-ATOMIC-CSS-CONFIG-STARTS",
  CONFIGTAIL: "GENERATE-ATOMIC-CSS-CONFIG-ENDS",
  CONTENTHEAD: "GENERATE-ATOMIC-CSS-CONTENT-STARTS",
  CONTENTTAIL: "GENERATE-ATOMIC-CSS-CONTENT-ENDS"
};
function genAtomic(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error("generate-atomic-css: [THROW_ID_01] First input argument must be a string! It was given as \"".concat(JSON.stringify(str, null, 4), "\" (type ").concat(_typeof(str), ")"));
  }
  var CONFIGHEAD = headsAndTails.CONFIGHEAD,
      CONFIGTAIL = headsAndTails.CONFIGTAIL,
      CONTENTHEAD = headsAndTails.CONTENTHEAD,
      CONTENTTAIL = headsAndTails.CONTENTTAIL;
  var defaults = {
    includeConfig: true,
    includeHeadsAndTails: true,
    pad: true,
    configOverride: null,
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100
  };
  var opts = Object.assign({}, defaults, originalOpts);
  if (opts.includeConfig && !opts.includeHeadsAndTails) {
    opts.includeHeadsAndTails = true;
  }
  var frontPart = "";
  var endPart = "";
  var rawContentAbove = "";
  var extractedConfig;
  if (opts.configOverride) {
    extractedConfig = opts.configOverride;
  } else if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL)) {
    if (str.indexOf(CONFIGTAIL) !== -1 && str.indexOf(CONTENTHEAD) !== -1 && str.indexOf(CONFIGTAIL) > str.indexOf(CONTENTHEAD)) {
      throw new Error("generate-atomic-css: [THROW_ID_02] Config heads are after config tails!");
    }
    extractedConfig = str.slice(str.indexOf(CONFIGHEAD) + CONFIGHEAD.length, str.indexOf(CONFIGTAIL));
    if (!isStr(extractedConfig) || !extractedConfig.trim().length) {
      return "";
    }
  } else if (str.includes(CONFIGHEAD) && !str.includes(CONFIGTAIL) && str.includes(CONTENTHEAD)) {
    if (str.indexOf(CONFIGHEAD) > str.indexOf(CONTENTHEAD)) {
      throw new Error("generate-atomic-css: [THROW_ID_03] Config heads are after content heads!");
    }
    extractedConfig = str.slice(str.indexOf(CONFIGHEAD) + CONFIGHEAD.length, str.indexOf(CONTENTHEAD));
  } else if (!str.includes(CONFIGHEAD) && !str.includes(CONFIGTAIL) && (str.includes(CONTENTHEAD) || str.includes(CONTENTTAIL))) {
    extractedConfig = str;
    if (extractedConfig.includes(CONTENTHEAD)) {
      if (stringLeftRight.left(str, extractedConfig.indexOf(CONTENTHEAD))) {
        var sliceTo = extractedConfig.indexOf(CONTENTHEAD);
        if (stringLeftRight.leftSeq(str, sliceTo, "/", "*")) {
          sliceTo = stringLeftRight.leftSeq(str, sliceTo, "/", "*").leftmostChar;
        }
        rawContentAbove = sliceTo === 0 ? "" : str.slice(0, sliceTo);
      }
      var sliceFrom = extractedConfig.indexOf(CONTENTHEAD) + CONTENTHEAD.length;
      if (stringLeftRight.rightSeq(extractedConfig, sliceFrom - 1, "*", "/")) {
        sliceFrom = stringLeftRight.rightSeq(extractedConfig, sliceFrom - 1, "*", "/").rightmostChar + 1;
      }
      extractedConfig = extractedConfig.slice(sliceFrom).trim();
    }
    if (extractedConfig.includes(CONTENTTAIL)) {
      var _sliceTo = extractedConfig.indexOf(CONTENTTAIL);
      if (stringLeftRight.leftSeq(extractedConfig, _sliceTo, "/", "*")) {
        _sliceTo = stringLeftRight.leftSeq(extractedConfig, _sliceTo, "/", "*").leftmostChar;
      }
      extractedConfig = extractedConfig.slice(0, _sliceTo).trim();
    }
  } else {
    var contentHeadsRegex = new RegExp("(\\/\\s*\\*\\s*)*".concat(CONTENTHEAD, "(\\s*\\*\\s*\\/)*"));
    var contentTailsRegex = new RegExp("(\\/\\s*\\*\\s*)*".concat(CONTENTTAIL, "(\\s*\\*\\s*\\/)*"));
    extractedConfig = str.replace(contentHeadsRegex, "").replace(contentTailsRegex, "");
  }
  if (!isStr(extractedConfig) || !extractedConfig.trim().length) {
    return "";
  }
  if (opts.includeConfig || opts.includeHeadsAndTails) {
    frontPart = "".concat(CONTENTHEAD, " */\n");
    endPart = "\n/* ".concat(CONTENTTAIL, " */");
  }
  if (opts.includeConfig) {
    frontPart = "/* ".concat(CONFIGHEAD, "\n").concat(extractedConfig.trim(), "\n").concat(CONFIGTAIL, "\n").concat(frontPart);
  }
  if (str.includes(CONFIGHEAD)) {
    var matchedOpeningCSSCommentOnTheLeft = stringLeftRight.leftSeq(str, str.indexOf(CONFIGHEAD), "/", "*");
    if (matchedOpeningCSSCommentOnTheLeft && matchedOpeningCSSCommentOnTheLeft.leftmostChar) {
      if (stringLeftRight.left(str, matchedOpeningCSSCommentOnTheLeft.leftmostChar)) {
        frontPart = "".concat(str.slice(0, stringLeftRight.left(str, matchedOpeningCSSCommentOnTheLeft.leftmostChar) + 1), "\n").concat(frontPart);
      }
    }
  } else if (opts.includeHeadsAndTails && !frontPart.trim().startsWith("/*")) {
    frontPart = "/* ".concat(frontPart);
  }
  if (isStr(rawContentAbove)) {
    if (rawContentAbove.trim().startsWith("/*") && !rawContentAbove.trim().endsWith("*/")) {
      rawContentAbove = "".concat(rawContentAbove.trim(), " */").concat(rawContentAbove.slice(stringLeftRight.left(rawContentAbove, rawContentAbove.length) + 1));
    }
    frontPart = "".concat(rawContentAbove).concat(isStr(rawContentAbove) && rawContentAbove.trim().length && !rawContentAbove.endsWith("\n") ? "\n" : "").concat(frontPart);
  }
  if (str.includes(CONTENTTAIL)) {
    var matchedClosingCSSCommentOnTheRight = stringLeftRight.rightSeq(str, str.indexOf(CONTENTTAIL) + CONTENTTAIL.length, "*", "/");
    if (matchedClosingCSSCommentOnTheRight && matchedClosingCSSCommentOnTheRight.rightmostChar && stringLeftRight.right(str, matchedClosingCSSCommentOnTheRight.rightmostChar)) {
      endPart = "".concat(endPart, "\n").concat(str.slice(stringLeftRight.right(str, matchedClosingCSSCommentOnTheRight.rightmostChar)));
    }
  }
  var finalRes = "".concat("".concat(frontPart).concat(prepConfig(extractedConfig, opts.reportProgressFunc, opts.reportProgressFuncFrom, opts.reportProgressFuncTo)).concat(endPart).trimEnd(), "\n");
  return finalRes;
}

exports.genAtomic = genAtomic;
exports.headsAndTails = headsAndTails;
exports.version = version;
