/**
 * @name generate-atomic-css
 * @fileoverview Generate Atomic CSS
 * @version 1.4.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/generate-atomic-css/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');
var stringLeftRight = require('string-left-right');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _slicedToArray__default = /*#__PURE__*/_interopDefaultLegacy(_slicedToArray);
var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "1.4.16";

function isStr(something) {
  return typeof something === "string";
}
var headsAndTails = {
  CONFIGHEAD: "GENERATE-ATOMIC-CSS-CONFIG-STARTS",
  CONFIGTAIL: "GENERATE-ATOMIC-CSS-CONFIG-ENDS",
  CONTENTHEAD: "GENERATE-ATOMIC-CSS-CONTENT-STARTS",
  CONTENTTAIL: "GENERATE-ATOMIC-CSS-CONTENT-ENDS"
};
var units = ["px", "em", "%", "rem", "cm", "mm", "in", "pt", "pc", "ex", "ch", "vw", "vmin", "vmax"];
var CONFIGHEAD = headsAndTails.CONFIGHEAD,
    CONFIGTAIL = headsAndTails.CONFIGTAIL,
    CONTENTHEAD = headsAndTails.CONTENTHEAD,
    CONTENTTAIL = headsAndTails.CONTENTTAIL;
var padLeftIfTheresOnTheLeft = [":"];
function extractConfig(str) {
  var extractedConfig = str;
  var rawContentAbove = "";
  var rawContentBelow = "";
  if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL)) {
    if (str.indexOf(CONFIGTAIL) !== -1 && str.indexOf(CONTENTHEAD) !== -1 && str.indexOf(CONFIGTAIL) > str.indexOf(CONTENTHEAD)) {
      throw new Error("generate-atomic-css: [THROW_ID_02] Config heads are after config tails!");
    }
    var sliceFrom = str.indexOf(CONFIGHEAD) + CONFIGHEAD.length;
    var sliceTo = str.indexOf(CONFIGTAIL);
    if (str[stringLeftRight.right(str, sliceFrom)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom))] === "/") {
      sliceFrom = stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom)) + 1;
    }
    if (str[stringLeftRight.left(str, sliceTo)] === "*" && str[stringLeftRight.left(str, stringLeftRight.left(str, sliceTo))] === "/") {
      sliceTo = stringLeftRight.left(str, stringLeftRight.left(str, sliceTo));
    }
    extractedConfig = str.slice(sliceFrom, sliceTo).trim();
    if (!isStr(extractedConfig) || !extractedConfig.trim().length) {
      return [extractedConfig, rawContentAbove, rawContentBelow];
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
        var _sliceTo2 = extractedConfig.indexOf(CONTENTHEAD);
        if (stringLeftRight.leftSeq(str, _sliceTo2, "/", "*")) {
          _sliceTo2 = stringLeftRight.leftSeq(str, _sliceTo2, "/", "*").leftmostChar;
        }
        rawContentAbove = _sliceTo2 === 0 ? "" : str.slice(0, _sliceTo2);
      }
      var _sliceFrom = extractedConfig.indexOf(CONTENTHEAD) + CONTENTHEAD.length;
      if (stringLeftRight.rightSeq(extractedConfig, _sliceFrom - 1, "*", "/")) {
        _sliceFrom = stringLeftRight.rightSeq(extractedConfig, _sliceFrom - 1, "*", "/").rightmostChar + 1;
      }
      var _sliceTo = null;
      if (str.includes(CONTENTTAIL)) {
        _sliceTo = str.indexOf(CONTENTTAIL);
        if (str[stringLeftRight.left(str, _sliceTo)] === "*" && str[stringLeftRight.left(str, stringLeftRight.left(str, _sliceTo))] === "/") {
          _sliceTo = stringLeftRight.left(str, stringLeftRight.left(str, _sliceTo));
        }
        var contentAfterStartsAt = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
        if (str[stringLeftRight.right(str, contentAfterStartsAt - 1)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, contentAfterStartsAt - 1))] === "/") {
          contentAfterStartsAt = stringLeftRight.right(str, stringLeftRight.right(str, contentAfterStartsAt - 1)) + 1;
        }
        if (stringLeftRight.right(str, contentAfterStartsAt)) {
          rawContentBelow = str.slice(contentAfterStartsAt);
        }
      }
      if (_sliceTo) {
        extractedConfig = extractedConfig.slice(_sliceFrom, _sliceTo).trim();
      } else {
        extractedConfig = extractedConfig.slice(_sliceFrom).trim();
      }
    }
    else if (extractedConfig.includes(CONTENTTAIL)) {
        var contentInFront = [];
        var stopFilteringAndPassAllLines = false;
        extractedConfig = extractedConfig.split("\n").filter(function (rowStr) {
          if (!rowStr.includes("$$$") && !stopFilteringAndPassAllLines) {
            if (!stopFilteringAndPassAllLines) {
              contentInFront.push(rowStr);
            }
            return false;
          }
          if (!stopFilteringAndPassAllLines) {
            stopFilteringAndPassAllLines = true;
            return true;
          }
          return true;
        }).join("\n");
        var _sliceTo3 = extractedConfig.indexOf(CONTENTTAIL);
        if (stringLeftRight.leftSeq(extractedConfig, _sliceTo3, "/", "*")) {
          _sliceTo3 = stringLeftRight.leftSeq(extractedConfig, _sliceTo3, "/", "*").leftmostChar;
        }
        extractedConfig = extractedConfig.slice(0, _sliceTo3).trim();
        if (contentInFront.length) {
          rawContentAbove = "".concat(contentInFront.join("\n"), "\n");
        }
        var _contentAfterStartsAt;
        if (stringLeftRight.right(str, str.indexOf(CONTENTTAIL) + CONTENTTAIL.length)) {
          _contentAfterStartsAt = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
          if (str[stringLeftRight.right(str, _contentAfterStartsAt)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, _contentAfterStartsAt))] === "/") {
            _contentAfterStartsAt = stringLeftRight.right(str, stringLeftRight.right(str, _contentAfterStartsAt)) + 1;
            if (stringLeftRight.right(str, _contentAfterStartsAt)) {
              rawContentBelow = str.slice(_contentAfterStartsAt);
            }
          }
        }
      }
  } else {
    var contentHeadsRegex = new RegExp("(\\/\\s*\\*\\s*)*".concat(CONTENTHEAD, "(\\s*\\*\\s*\\/)*"));
    var contentTailsRegex = new RegExp("(\\/\\s*\\*\\s*)*".concat(CONTENTTAIL, "(\\s*\\*\\s*\\/)*"));
    var stopFiltering = false;
    var gatheredLinesAboveTopmostConfigLine = [];
    var gatheredLinesBelowLastConfigLine = [];
    var configLines = str.split("\n").filter(function (rowStr) {
      if (stopFiltering) {
        return true;
      }
      if (!rowStr.includes("$$$") && !rowStr.includes("{") && !rowStr.includes(":")) {
        gatheredLinesAboveTopmostConfigLine.push(rowStr);
        return false;
      }
      stopFiltering = true;
      return true;
    });
    for (var i = configLines.length; i--;) {
      if (!configLines[i].includes("$$$") && !configLines[i].includes("}") && !configLines[i].includes(":")) {
        gatheredLinesBelowLastConfigLine.unshift(configLines.pop());
      } else {
        break;
      }
    }
    extractedConfig = configLines.join("\n").replace(contentHeadsRegex, "").replace(contentTailsRegex, "");
    if (gatheredLinesAboveTopmostConfigLine.length) {
      rawContentAbove = "".concat(gatheredLinesAboveTopmostConfigLine.join("\n"), "\n");
    }
    if (gatheredLinesBelowLastConfigLine.length) {
      rawContentBelow = "\n".concat(gatheredLinesBelowLastConfigLine.join("\n"));
    }
  }
  return [extractedConfig, rawContentAbove, rawContentBelow];
}
function trimBlankLinesFromLinesArray(lineArr) {
  var trim = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if (!trim) {
    return lineArr;
  }
  var copyArr = Array.from(lineArr);
  if (copyArr.length && isStr(copyArr[0]) && !copyArr[0].trim().length) {
    do {
      copyArr.shift();
    } while (isStr(copyArr[0]) && !copyArr[0].trim().length);
  }
  if (copyArr.length && isStr(copyArr[copyArr.length - 1]) && !copyArr[copyArr.length - 1].trim().length) {
    do {
      copyArr.pop();
    } while (copyArr && copyArr[copyArr.length - 1] && !copyArr[copyArr.length - 1].trim().length);
  }
  return copyArr;
}
function extractFromToSource(str) {
  var fromDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var toDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;
  var from = fromDefault;
  var to = toDefault;
  var source = str;
  var tempArr;
  if (str.lastIndexOf("}") > 0 && str.slice(str.lastIndexOf("}") + 1).includes("|")) {
    tempArr = str.slice(str.lastIndexOf("}") + 1).split("|").filter(function (val) {
      return val.trim().length;
    }).map(function (val) {
      return val.trim();
    }).filter(function (val) {
      return String(val).split("").every(function (_char) {
        return /\d/g.test(_char);
      });
    });
  } else if (str.includes("|")) {
    tempArr = str.split("|").filter(function (val) {
      return val.trim().length;
    }).map(function (val) {
      return val.trim();
    }).filter(function (val) {
      return String(val).split("").every(function (_char2) {
        return /\d/g.test(_char2);
      });
    });
  }
  if (Array.isArray(tempArr)) {
    if (tempArr.length === 1) {
      to = Number.parseInt(tempArr[0], 10);
    } else if (tempArr.length > 1) {
      from = Number.parseInt(tempArr[0], 10);
      to = Number.parseInt(tempArr[1], 10);
    }
  }
  if (str.lastIndexOf("}") > 0 && str.slice(str.lastIndexOf("}") + 1).includes("|")) {
    source = str.slice(0, str.indexOf("|", str.lastIndexOf("}") + 1)).trimEnd();
    if (source.trim().startsWith("|")) {
      while (source.trim().startsWith("|")) {
        source = source.trim().slice(1);
      }
    }
  } else {
    var lastPipeWasAt = null;
    var firstNonPipeNonWhitespaceCharMet = false;
    var startFrom = 0;
    var endTo = str.length;
    var onlyDigitsAndWhitespaceBeenMet = null;
    for (var i = 0, len = str.length; i < len; i++) {
      if ("0123456789".includes(str[i])) {
        if (onlyDigitsAndWhitespaceBeenMet === null && str[i].trim().length) {
          onlyDigitsAndWhitespaceBeenMet = true;
        }
      }
      else if (str[i] !== "|" && str[i].trim().length) {
          onlyDigitsAndWhitespaceBeenMet = false;
        }
      if (!str[i + 1] && onlyDigitsAndWhitespaceBeenMet && lastPipeWasAt) {
        endTo = lastPipeWasAt;
      }
      if (str[i] === "|") {
        if (onlyDigitsAndWhitespaceBeenMet && lastPipeWasAt) {
          endTo = lastPipeWasAt;
          break;
        }
        lastPipeWasAt = i;
        onlyDigitsAndWhitespaceBeenMet = null;
      } else if (!firstNonPipeNonWhitespaceCharMet && str[i].trim().length) {
        firstNonPipeNonWhitespaceCharMet = true;
        if (lastPipeWasAt !== null) {
          startFrom = lastPipeWasAt + 1;
        }
      }
    }
    source = str.slice(startFrom, endTo).trimEnd();
  }
  return [from, to, source];
}
function prepLine(str, progressFn, subsetFrom, subsetTo, generatedCount, pad) {
  var currentPercentageDone;
  var lastPercentage = 0;
  var _extractFromToSource = extractFromToSource(str, 0, 500),
      _extractFromToSource2 = _slicedToArray__default['default'](_extractFromToSource, 3),
      from = _extractFromToSource2[0],
      to = _extractFromToSource2[1],
      source = _extractFromToSource2[2];
  var subsetRange = subsetTo - subsetFrom;
  var res = "";
  var _loop = function _loop(i) {
    var debtPaddingLen = 0;
    var startPoint = 0;
    var _loop2 = function _loop2(y, len) {
      source[y].charCodeAt(0);
      if (source[y] === "$" && source[y - 1] === "$" && source[y - 2] === "$") {
        var restOfStr = source.slice(y + 1);
        var unitFound;
        if (i === 0 &&
        units.some(function (unit) {
          if (restOfStr.startsWith(unit)) {
            unitFound = unit;
            return true;
          }
        }) && (source[stringLeftRight.right(source, y + unitFound.length)] === "{" || !source[y + unitFound.length + 1].trim().length)) {
          res += "".concat(source.slice(startPoint, y - 2)).concat(pad ? String(i).padStart(String(to).length - String(i).length + unitFound.length + 1) : i);
          startPoint = y + 1 + (unitFound ? unitFound.length : 0);
        } else {
          var unitThatFollow;
          units.some(function (unit) {
            if (source.startsWith(unit, y + 1)) {
              unitThatFollow = unit;
              return true;
            }
          });
          if (!source[y - 3].trim().length ||
          padLeftIfTheresOnTheLeft.some(function (val) {
            return source.slice(startPoint, y - 2).trim().endsWith(val);
          })) {
            var temp = 0;
            if (i === 0) {
              units.some(function (unit) {
                if ("".concat(source.slice(startPoint, y - 2)).startsWith(unit)) {
                  temp = unit.length;
                }
                return true;
              });
            }
            res += "".concat(source.slice(startPoint + temp, y - 2)).concat(pad ? String(i).padStart(String(to).length + (i === 0 && unitThatFollow ? unitThatFollow.length : 0)) : i);
          } else if (!source[y + 1].trim().length || source[stringLeftRight.right(source, y)] === "{") {
            res += "".concat(source.slice(startPoint, y - 2)).concat(pad ? String(i).padEnd(String(to).length + (i === 0 && unitThatFollow ? unitThatFollow.length : 0)) : i);
          } else {
            res += "".concat(source.slice(startPoint, y - 2)).concat(i);
            if (pad) {
              debtPaddingLen = String(to).length - String(i).length;
            }
          }
          startPoint = y + 1;
        }
      }
      if (source[y] === "{" && pad) {
        if (debtPaddingLen) {
          res += "".concat(source.slice(startPoint, y)).concat(" ".repeat(debtPaddingLen));
          startPoint = y;
          debtPaddingLen = 0;
        }
      }
      if (!source[y + 1]) {
        var _unitFound;
        var _restOfStr = source.slice(startPoint);
        if (i === 0 &&
        units.some(function (unit) {
          if (_restOfStr.startsWith(unit)) {
            _unitFound = unit;
            return true;
          }
        })) {
          res += "".concat(source.slice(startPoint + _unitFound.length));
        } else {
          res += "".concat(source.slice(startPoint));
        }
        res += "".concat(i !== to ? "\n" : "");
      }
    };
    for (var y = 0, len = source.length; y < len; y++) {
      _loop2(y);
    }
    generatedCount.count += 1;
    if (typeof progressFn === "function") {
      currentPercentageDone = Math.floor(subsetFrom + i / (to - from) * subsetRange);
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
function bump(str, thingToBump) {
  if (/\.\w/g.test(str)) {
    thingToBump.count += 1;
  }
  return str;
}
function prepConfig(str, progressFn, progressFrom, progressTo) {
  var trim = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var generatedCount = arguments.length > 5 ? arguments[5] : undefined;
  var pad = arguments.length > 6 ? arguments[6] : undefined;
  return trimBlankLinesFromLinesArray(str.split(/\r?\n/).map(function (rowStr, i, arr) {
    return rowStr.includes("$$$") ? prepLine(rowStr, progressFn, progressFrom + (progressTo - progressFrom) / arr.length * i, progressFrom + (progressTo - progressFrom) / arr.length * (i + 1), generatedCount, pad) : bump(rowStr, generatedCount);
  }), trim).join("\n");
}

var version = version$1;
var defaults = {
  includeConfig: true,
  includeHeadsAndTails: true,
  pad: true,
  configOverride: null,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
function genAtomic(str, originalOpts) {
  function trimIfNeeded(str2) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!opts.includeConfig && !opts.includeHeadsAndTails) {
      return str2;
    }
    return str2.trim();
  }
  if (typeof str !== "string") {
    throw new Error("generate-atomic-css: [THROW_ID_01] First input argument must be a string! It was given as \"".concat(JSON.stringify(str, null, 4), "\" (type ").concat(_typeof__default['default'](str), ")"));
  }
  var CONFIGHEAD = headsAndTails.CONFIGHEAD,
      CONFIGTAIL = headsAndTails.CONFIGTAIL,
      CONTENTHEAD = headsAndTails.CONTENTHEAD,
      CONTENTTAIL = headsAndTails.CONTENTTAIL;
  var generatedCount = {
    count: 0
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (opts.includeConfig && !opts.includeHeadsAndTails) {
    opts.includeHeadsAndTails = true;
  }
  if (!opts.configOverride && !str.includes("$$$") && !str.includes(CONFIGHEAD) && !str.includes(CONFIGTAIL) && !str.includes(CONTENTHEAD) && !str.includes(CONTENTTAIL) || opts && opts.configOverride && typeof opts.configOverride === "string" && !opts.configOverride.includes("$$$") && !opts.configOverride.includes(CONFIGHEAD) && !opts.configOverride.includes(CONFIGTAIL) && !opts.configOverride.includes(CONTENTHEAD) && !opts.configOverride.includes(CONTENTTAIL)) {
    return {
      log: {
        count: 0
      },
      result: str
    };
  }
  var frontPart = "";
  var endPart = "";
  var _extractConfig = extractConfig(opts.configOverride ? opts.configOverride : str),
      _extractConfig2 = _slicedToArray__default['default'](_extractConfig, 3),
      extractedConfig = _extractConfig2[0],
      rawContentAbove = _extractConfig2[1],
      rawContentBelow = _extractConfig2[2];
  if (typeof extractedConfig !== "string" || !extractedConfig.trim()) {
    return {
      log: {
        count: 0
      },
      result: ""
    };
  }
  if (opts.includeConfig || opts.includeHeadsAndTails) {
    frontPart = "".concat(CONTENTHEAD, " */\n");
    if (!opts.includeConfig) {
      frontPart = "/* ".concat(frontPart);
    }
    endPart = "\n/* ".concat(CONTENTTAIL, " */");
  }
  if (opts.includeConfig) {
    frontPart = "/* ".concat(CONFIGHEAD, "\n").concat(extractedConfig.trim(), "\n").concat(CONFIGTAIL, "\n").concat(frontPart);
  }
  if (str.includes(CONFIGHEAD)) {
    if (stringLeftRight.left(str, str.indexOf(CONFIGHEAD)) != null) {
      var sliceUpTo = str.indexOf(CONFIGHEAD);
      if (str[stringLeftRight.left(str, sliceUpTo)] === "*" && str[stringLeftRight.left(str, stringLeftRight.left(str, sliceUpTo))] === "/") {
        sliceUpTo = stringLeftRight.left(str, stringLeftRight.left(str, sliceUpTo));
      }
      var putInFront = "/* ";
      if (str[stringLeftRight.right(str, sliceUpTo - 1)] === "/" && str[stringLeftRight.right(str, stringLeftRight.right(str, sliceUpTo - 1))] === "*" || frontPart.trim().startsWith("/*")) {
        putInFront = "";
      }
      frontPart = "".concat(str.slice(0, sliceUpTo)).concat(putInFront).concat(frontPart);
    }
  }
  if (str.includes(CONFIGTAIL) && stringLeftRight.right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)) {
    var sliceFrom = str.indexOf(CONFIGTAIL) + CONFIGTAIL.length;
    if (str[stringLeftRight.right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length))] === "/") {
      sliceFrom = stringLeftRight.right(str, stringLeftRight.right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)) + 1;
    }
    if (str.slice(stringLeftRight.right(str, sliceFrom - 1)).startsWith(CONTENTHEAD)) {
      var contentHeadsStartAt = stringLeftRight.right(str, sliceFrom);
      sliceFrom = contentHeadsStartAt || 0 + CONTENTHEAD.length;
      if (str[stringLeftRight.right(str, sliceFrom - 1)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom - 1))] === "/") {
        sliceFrom = stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom - 1)) + 1;
      }
      if (str.includes(CONTENTTAIL)) {
        sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
        if (str[stringLeftRight.right(str, sliceFrom)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom))] === "/") {
          sliceFrom = stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom)) + 1;
        }
      }
    }
    var slicedFrom = str.slice(sliceFrom);
    if (slicedFrom.length && slicedFrom.includes(CONTENTTAIL)) {
      sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
      if (str[stringLeftRight.right(str, sliceFrom)] === "*" && str[stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom))] === "/") {
        sliceFrom = stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom)) + 1;
      }
    }
    endPart = "".concat(endPart).concat(str[sliceFrom] && stringLeftRight.right(str, sliceFrom - 1) ? str.slice(sliceFrom) : "");
  }
  if (typeof rawContentAbove === "string") {
    frontPart = "".concat(rawContentAbove).concat(frontPart);
  }
  if (typeof rawContentBelow === "string") {
    if (rawContentBelow.trim().endsWith("/*") && !rawContentBelow.trim().startsWith("*/")) {
      var frontPart2 = "";
      if (typeof rawContentBelow === "string" && rawContentBelow[0] && !rawContentBelow[0].trim()) {
        frontPart2 = rawContentBelow.slice(0, stringLeftRight.right(rawContentBelow, 0) || 0);
      }
      rawContentBelow = "".concat(frontPart2, "/* ").concat(rawContentBelow.trim());
    }
    endPart = "".concat(endPart).concat(rawContentBelow);
  }
  var finalRes = "".concat(trimIfNeeded("".concat(frontPart).concat(prepConfig(extractedConfig, opts.reportProgressFunc, opts.reportProgressFuncFrom, opts.reportProgressFuncTo, true,
  generatedCount, opts.pad)).concat(endPart), opts), "\n");
  return {
    log: {
      count: generatedCount.count
    },
    result: finalRes
  };
}

exports.defaults = defaults;
exports.extractFromToSource = extractFromToSource;
exports.genAtomic = genAtomic;
exports.headsAndTails = headsAndTails;
exports.version = version;
