/**
 * string-remove-thousand-separators
 * Detects and removes thousand separators (dot/comma/quote/space) from string-type digits
 * Version: 3.0.73
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-remove-thousand-separators/
 */

'use strict';

var replaceSlicesArr = require('ranges-apply');
var Slices = require('ranges-push');
var isObj = require('lodash.isplainobject');
var isNum = require('is-numeric');
var trimChars = require('lodash.trim');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var replaceSlicesArr__default = /*#__PURE__*/_interopDefaultLegacy(replaceSlicesArr);
var Slices__default = /*#__PURE__*/_interopDefaultLegacy(Slices);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);
var isNum__default = /*#__PURE__*/_interopDefaultLegacy(isNum);
var trimChars__default = /*#__PURE__*/_interopDefaultLegacy(trimChars);

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function remSep(str, originalOpts) {
  var allOK = true;
  var knownSeparatorsArray = [".", ",", "'", " "];
  var firstSeparator;
  if (typeof str !== "string") {
    throw new TypeError("string-remove-thousand-separators/remSep(): [THROW_ID_01] Input must be string! Currently it's: ".concat(_typeof(str), ", equal to:\n").concat(JSON.stringify(str, null, 4)));
  }
  if (originalOpts !== undefined && originalOpts !== null && !isObj__default['default'](originalOpts)) {
    throw new TypeError("string-remove-thousand-separators/remSep(): [THROW_ID_02] Options object must be a plain object! Currently it's: ".concat(_typeof(originalOpts), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var defaults = {
    removeThousandSeparatorsFromNumbers: true,
    padSingleDecimalPlaceNumbers: true,
    forceUKStyle: false
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  var res = trimChars__default['default'](str.trim(), '"');
  if (res === "") {
    return res;
  }
  var rangesToDelete = new Slices__default['default']();
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
      if (res[i + 1] !== undefined && isNum__default['default'](res[i + 1])) {
        if (res[i + 2] !== undefined) {
          if (isNum__default['default'](res[i + 2])) {
            if (res[i + 3] !== undefined) {
              if (isNum__default['default'](res[i + 3])) {
                if (res[i + 4] !== undefined && isNum__default['default'](res[i + 4])) {
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
    } else if (!isNum__default['default'](res[i])) {
      allOK = false;
      break;
    }
  }
  if (allOK && rangesToDelete.current()) {
    return replaceSlicesArr__default['default'](res, rangesToDelete.current());
  }
  return res;
}

module.exports = remSep;
