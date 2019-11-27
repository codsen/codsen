/**
 * string-remove-thousand-separators
 * Detects and removes thousand separators (dot/comma/quote/space) from string-type digits
 * Version: 3.0.42
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-thousand-separators
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var replaceSlicesArr = _interopDefault(require('ranges-apply'));
var Slices = _interopDefault(require('ranges-push'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var isNum = _interopDefault(require('is-numeric'));
var trimChars = _interopDefault(require('lodash.trim'));

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

function remSep(str, originalOpts) {
  var allOK = true;
  var knownSeparatorsArray = [".", ",", "'", " "];
  var firstSeparator;
  if (typeof str !== "string") {
    throw new TypeError("string-remove-thousand-separators/remSep(): [THROW_ID_01] Input must be string! Currently it's: ".concat(_typeof(str), ", equal to:\n").concat(JSON.stringify(str, null, 4)));
  }
  if (originalOpts !== undefined && originalOpts !== null && !isObj(originalOpts)) {
    throw new TypeError("string-remove-thousand-separators/remSep(): [THROW_ID_02] Options object must be a plain object! Currently it's: ".concat(_typeof(originalOpts), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var defaults = {
    removeThousandSeparatorsFromNumbers: true,
    padSingleDecimalPlaceNumbers: true,
    forceUKStyle: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  var res = trimChars(str.trim(), '"');
  if (res === "") {
    return res;
  }
  var rangesToDelete = new Slices();
  for (var i = 0, len = res.length; i < len; i++) {
    if (opts.removeThousandSeparatorsFromNumbers && res[i].trim() === "") {
      rangesToDelete.add(i, i + 1);
    }
    if (opts.removeThousandSeparatorsFromNumbers && res[i] === "'") {
      rangesToDelete.add(i, i + 1);
      if (res[i + 1] === "'") {
        allOK = false;
        break;
      }
    }
    if (knownSeparatorsArray.includes(res[i])) {
      if (res[i + 1] !== undefined && isNum(res[i + 1])) {
        if (res[i + 2] !== undefined) {
          if (isNum(res[i + 2])) {
            if (res[i + 3] !== undefined) {
              if (isNum(res[i + 3])) {
                if (res[i + 4] !== undefined && isNum(res[i + 4])) {
                  allOK = false;
                  break;
                } else {
                  if (opts.removeThousandSeparatorsFromNumbers) {
                    rangesToDelete.add(i, i + 1);
                  }
                  if (!firstSeparator) {
                    firstSeparator = res[i];
                  } else if (res[i] !== firstSeparator) {
                    allOK = false;
                    break;
                  }
                }
              } else {
                allOK = false;
                break;
              }
            } else if (opts.removeThousandSeparatorsFromNumbers && opts.forceUKStyle && res[i] === ",") {
              rangesToDelete.add(i, i + 1, ".");
            }
          } else {
            allOK = false;
            break;
          }
        } else {
          if (opts.forceUKStyle && res[i] === ",") {
            rangesToDelete.add(i, i + 1, ".");
          }
          if (opts.padSingleDecimalPlaceNumbers) {
            rangesToDelete.add(i + 2, i + 2, "0");
          }
        }
      }
    } else if (!isNum(res[i])) {
      allOK = false;
      break;
    }
  }
  if (allOK && rangesToDelete.current()) {
    return replaceSlicesArr(res, rangesToDelete.current());
  }
  return res;
}

module.exports = remSep;
