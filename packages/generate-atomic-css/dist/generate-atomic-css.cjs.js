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

var isArr = Array.isArray;
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
  var _loop = function _loop(i) {
    var newStr = split[0];
    var threeDollarRegexWithUnits = /\$\$\$(px|em|%|rem|cm|mm|in|pt|pc|ex|ch|vw|vmin|vmax)/g;
    var threeDollarRegex = /\$\$\$/g;
    var findingsThreeDollarWithUnits = newStr.match(threeDollarRegexWithUnits);
    if (isArr(findingsThreeDollarWithUnits) && findingsThreeDollarWithUnits.length && i === from && i === 0) {
      findingsThreeDollarWithUnits.forEach(function (valFound) {
        newStr = newStr.replace(valFound, "".concat(i).padStart(valFound.length - 3 + String(to).length, " "));
      });
    }
    res += "".concat(i === from ? "" : "\n").concat(newStr.replace(threeDollarRegex, i)).trimEnd();
    if (typeof progressFn === "function") {
      currentPercentageDone = subsetFrom + Math.floor(i / (to - from) * subsetRange);
      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        progressFn(currentPercentageDone);
      }
    }
  };
  for (var i = from; i <= to; i++) {
    _loop(i);
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
  var extractedConfig;
  if (opts.configOverride) {
    console.log("042 config calc - case #1");
    extractedConfig = opts.configOverride;
  } else if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL)) {
    console.log("045 config calc - case #2");
    if (str.indexOf(CONFIGTAIL) > str.indexOf(CONTENTHEAD)) {
      throw new Error("generate-atomic-css: [THROW_ID_02] Config heads are after config tails!");
    }
    extractedConfig = str.slice(str.indexOf(CONFIGHEAD) + CONFIGHEAD.length, str.indexOf(CONFIGTAIL));
  } else if (str.includes(CONFIGHEAD) && !str.includes(CONFIGTAIL) && str.includes(CONTENTHEAD)) {
    console.log("060 config calc - case #3");
    if (str.indexOf(CONFIGHEAD) > str.indexOf(CONTENTHEAD)) {
      throw new Error("generate-atomic-css: [THROW_ID_03] Config heads are after content heads!");
    }
    extractedConfig = str.slice(str.indexOf(CONFIGHEAD) + CONFIGHEAD.length, str.indexOf(CONTENTHEAD));
  } else {
    console.log("071 config calc - case #4");
    extractedConfig = str;
  }
  console.log("075 ".concat("\x1B[".concat(33, "m", "extractedConfig", "\x1B[", 39, "m"), " = ", JSON.stringify(extractedConfig, null, 4)));
  var frontPart = "";
  var endPart = "";
  if (opts.includeConfig || opts.includeHeadsAndTails) {
    frontPart = "".concat(CONTENTHEAD, " */\n");
    endPart = "\n/* ".concat(CONTENTTAIL, " */");
  }
  if (opts.includeConfig) {
    frontPart = "/* ".concat(CONFIGHEAD, "\n").concat(extractedConfig.trim(), "\n").concat(CONFIGTAIL, "\n").concat(frontPart);
  }
  if (str.includes(CONFIGHEAD)) {
    var matchedOpeningCSSCommentOnTheLeft = stringLeftRight.leftSeq(str, str.indexOf(CONFIGHEAD), "/", "*");
    console.log("118 ".concat("\x1B[".concat(33, "m", "matchedOpeningCSSCommentOnTheLeft", "\x1B[", 39, "m"), " = ", JSON.stringify(matchedOpeningCSSCommentOnTheLeft, null, 4)));
    if (matchedOpeningCSSCommentOnTheLeft && matchedOpeningCSSCommentOnTheLeft.leftmostChar) {
      if (stringLeftRight.left(str, matchedOpeningCSSCommentOnTheLeft.leftmostChar)) {
        frontPart = "".concat(str.slice(0, stringLeftRight.left(str, matchedOpeningCSSCommentOnTheLeft.leftmostChar) + 1), "\n").concat(frontPart);
      }
    }
  }
  if (str.includes(CONTENTTAIL)) {
    var matchedClosingCSSCommentOnTheRight = stringLeftRight.rightSeq(str, str.indexOf(CONTENTTAIL) + CONTENTTAIL.length, "*", "/");
    console.log("150 ".concat("\x1B[".concat(33, "m", "matchedClosingCSSCommentOnTheRight", "\x1B[", 39, "m"), " = ", JSON.stringify(matchedClosingCSSCommentOnTheRight, null, 4)));
    if (matchedClosingCSSCommentOnTheRight && matchedClosingCSSCommentOnTheRight.rightmostChar && stringLeftRight.right(str, matchedClosingCSSCommentOnTheRight.rightmostChar)) {
      endPart = "".concat(endPart, "\n").concat(str.slice(stringLeftRight.right(str, matchedClosingCSSCommentOnTheRight.rightmostChar)));
    }
  }
  return "".concat("".concat(frontPart).concat(prepConfig(extractedConfig, opts.reportProgressFunc, opts.reportProgressFuncFrom, opts.reportProgressFuncTo)).concat(endPart).trimEnd(), "\n");
}

exports.genAtomic = genAtomic;
exports.headsAndTails = headsAndTails;
exports.version = version;
