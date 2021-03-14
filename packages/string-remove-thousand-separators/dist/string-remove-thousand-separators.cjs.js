/**
 * string-remove-thousand-separators
 * Detects and removes thousand separators (dot/comma/quote/space) from string-type digits
 * Version: 5.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-remove-thousand-separators/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var rangesApply = require('ranges-apply');
var rangesPush = require('ranges-push');
var trimChars = require('lodash.trim');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var trimChars__default = /*#__PURE__*/_interopDefaultLegacy(trimChars);

var version$1 = "5.0.8";

var version = version$1;
function remSep(str, originalOpts) {
  var allOK = true;
  var knownSeparatorsArray = [".", ",", "'", " "];
  var firstSeparator;
  if (typeof str !== "string") {
    throw new TypeError("string-remove-thousand-separators/remSep(): [THROW_ID_01] Input must be string! Currently it's: " + typeof str + ", equal to:\n" + JSON.stringify(str, null, 4));
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new TypeError("string-remove-thousand-separators/remSep(): [THROW_ID_02] Options object must be a plain object! Currently it's: " + typeof originalOpts + ", equal to:\n" + JSON.stringify(originalOpts, null, 4));
  }
  var defaults = {
    removeThousandSeparatorsFromNumbers: true,
    padSingleDecimalPlaceNumbers: true,
    forceUKStyle: false
  };
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  var res = trimChars__default['default'](str.trim(), '"');
  if (res === "") {
    return res;
  }
  var rangesToDelete = new rangesPush.Ranges();
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
      if (res[i + 1] !== undefined && /^\d*$/.test(res[i + 1])) {
        if (res[i + 2] !== undefined) {
          if (/^\d*$/.test(res[i + 2])) {
            if (res[i + 3] !== undefined) {
              if (/^\d*$/.test(res[i + 3])) {
                if (res[i + 4] !== undefined && /^\d*$/.test(res[i + 4])) {
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
    } else if (!/^\d*$/.test(res[i])) {
      allOK = false;
      break;
    }
  }
  if (allOK && rangesToDelete.current()) {
    return rangesApply.rApply(res, rangesToDelete.current());
  }
  return res;
}

exports.remSep = remSep;
exports.version = version;
