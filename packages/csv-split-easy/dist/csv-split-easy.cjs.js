/**
 * csv-split-easy
 * Splits the CSV string into array of arrays, each representing a row of columns
 * Version: 3.0.42
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/csv-split-easy
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var remSep = _interopDefault(require('string-remove-thousand-separators'));
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

function splitEasy(str, originalOpts) {
  var colStarts = 0;
  var lineBreakStarts = 0;
  var rowArray = [];
  var resArray = [];
  var ignoreCommasThatFollow = false;
  var thisRowContainsOnlyEmptySpace = true;
  if (originalOpts !== undefined && !isObj(originalOpts)) {
    throw new Error("csv-split-easy/split(): [THROW_ID_02] Options object must be a plain object! Currently it's of a type ".concat(_typeof(originalOpts), " equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var defaults = {
    removeThousandSeparatorsFromNumbers: true,
    padSingleDecimalPlaceNumbers: true,
    forceUKStyle: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
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
        var processedElem = /""/.test(newElem) ? newElem.replace(/""/g, '"') : remSep(newElem, {
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
          rowArray.push(remSep(_newElem,
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
              rowArray.push(remSep(_newElem2, {
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
        if (_newElem3.trim() !== "") {
          thisRowContainsOnlyEmptySpace = false;
        }
        rowArray.push(remSep(_newElem3, {
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
