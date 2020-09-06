/**
 * csv-split-easy
 * Splits the CSV string into array of arrays, each representing a row of columns
 * Version: 3.0.67
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/csv-split-easy/
 */

'use strict';

var remSep = require('string-remove-thousand-separators');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var remSep__default = /*#__PURE__*/_interopDefaultLegacy(remSep);

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

function splitEasy(str, originalOpts) {
  var colStarts = 0;
  var lineBreakStarts = 0;
  var rowArray = [];
  var resArray = [];
  var ignoreCommasThatFollow = false;
  var thisRowContainsOnlyEmptySpace = true;
  if (originalOpts && _typeof(originalOpts) !== "object") {
    throw new Error("csv-split-easy/split(): [THROW_ID_02] Options object must be a plain object! Currently it's of a type ".concat(_typeof(originalOpts), " equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var defaults = {
    removeThousandSeparatorsFromNumbers: true,
    padSingleDecimalPlaceNumbers: true,
    forceUKStyle: false
  };
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  if (typeof str !== "string") {
    throw new TypeError("csv-split-easy/split(): [THROW_ID_04] input must be string! Currently it's: ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
  } else {
    if (str === "") {
      return [[""]];
    }
    str = str.trim();
  }
  for (var i = 0, len = str.length; i < len; i++) {
    if (thisRowContainsOnlyEmptySpace && str[i] !== '"' && str[i] !== "," && str[i].trim() !== "") {
      thisRowContainsOnlyEmptySpace = false;
    }
    if (str[i] === '"') {
      if (ignoreCommasThatFollow && str[i + 1] === '"') {
        i += 1;
      } else if (ignoreCommasThatFollow) {
        ignoreCommasThatFollow = false;
        var newElem = str.slice(colStarts, i);
        if (newElem.trim() !== "") {
          thisRowContainsOnlyEmptySpace = false;
        }
        var processedElem = /""/.test(newElem) ? newElem.replace(/""/g, '"') : remSep__default['default'](newElem, {
          removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
          padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
          forceUKStyle: opts.forceUKStyle
        });
        rowArray.push(processedElem);
      } else {
        ignoreCommasThatFollow = true;
        colStarts = i + 1;
      }
    }
    else if (!ignoreCommasThatFollow && str[i] === ",") {
        if (str[i - 1] !== '"' && !ignoreCommasThatFollow) {
          var _newElem = str.slice(colStarts, i);
          if (_newElem.trim() !== "") {
            thisRowContainsOnlyEmptySpace = false;
          }
          rowArray.push(remSep__default['default'](_newElem,
          {
            removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
            padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
            forceUKStyle: opts.forceUKStyle
          }));
        }
        colStarts = i + 1;
        if (lineBreakStarts) {
          lineBreakStarts = 0;
        }
      }
      else if (str[i] === "\n" || str[i] === "\r") {
          if (!lineBreakStarts) {
            lineBreakStarts = i;
            if (!ignoreCommasThatFollow && str[i - 1] !== '"') {
              var _newElem2 = str.slice(colStarts, i);
              if (_newElem2.trim() !== "") {
                thisRowContainsOnlyEmptySpace = false;
              }
              rowArray.push(remSep__default['default'](_newElem2, {
                removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
                padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
                forceUKStyle: opts.forceUKStyle
              }));
            }
            if (!thisRowContainsOnlyEmptySpace) {
              resArray.push(rowArray);
            } else {
              rowArray.length = 0;
            }
            thisRowContainsOnlyEmptySpace = true;
            rowArray = [];
          }
          colStarts = i + 1;
        }
        else if (lineBreakStarts) {
            lineBreakStarts = 0;
            colStarts = i;
          }
    if (i + 1 === len) {
      if (str[i] !== '"') {
        var _newElem3 = str.slice(colStarts, i + 1);
        if (_newElem3.trim()) {
          thisRowContainsOnlyEmptySpace = false;
        }
        rowArray.push(remSep__default['default'](_newElem3, {
          removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
          padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
          forceUKStyle: opts.forceUKStyle
        }));
      }
      if (!thisRowContainsOnlyEmptySpace) {
        resArray.push(rowArray);
      } else {
        rowArray = [];
      }
      thisRowContainsOnlyEmptySpace = true;
    }
  }
  if (resArray.length === 0) {
    return [[""]];
  }
  return resArray;
}

module.exports = splitEasy;
