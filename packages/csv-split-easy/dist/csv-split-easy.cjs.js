/**
 * @name csv-split-easy
 * @fileoverview Splits the CSV string into array of arrays, each representing a row of columns
 * @version 5.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/csv-split-easy/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');
var stringRemoveThousandSeparators = require('string-remove-thousand-separators');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "5.0.16";

var version = version$1;
var defaults = {
  removeThousandSeparatorsFromNumbers: true,
  padSingleDecimalPlaceNumbers: true,
  forceUKStyle: false
};
function splitEasy(str, originalOpts) {
  var colStarts = 0;
  var lineBreakStarts = 0;
  var rowArray = [];
  var resArray = [];
  var ignoreCommasThatFollow = false;
  var thisRowContainsOnlyEmptySpace = true;
  if (originalOpts && _typeof__default['default'](originalOpts) !== "object") {
    throw new Error("csv-split-easy/split(): [THROW_ID_02] Options object must be a plain object! Currently it's of a type ".concat(_typeof__default['default'](originalOpts), " equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);
  if (typeof str !== "string") {
    throw new TypeError("csv-split-easy/split(): [THROW_ID_04] input must be string! Currently it's: ".concat(_typeof__default['default'](str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
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
        var processedElem = /""/.test(newElem) ? newElem.replace(/""/g, '"') : stringRemoveThousandSeparators.remSep(newElem, {
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
          rowArray.push(stringRemoveThousandSeparators.remSep(_newElem,
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
              rowArray.push(stringRemoveThousandSeparators.remSep(_newElem2, {
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
        rowArray.push(stringRemoveThousandSeparators.remSep(_newElem3, {
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

exports.defaults = defaults;
exports.splitEasy = splitEasy;
exports.version = version;
