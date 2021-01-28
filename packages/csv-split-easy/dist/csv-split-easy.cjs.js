/**
 * csv-split-easy
 * Splits the CSV string into array of arrays, each representing a row of columns
 * Version: 5.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/csv-split-easy/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var stringRemoveThousandSeparators = require('string-remove-thousand-separators');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version = "5.0.1";

var version$1 = version;
var defaults = {
  removeThousandSeparatorsFromNumbers: true,
  padSingleDecimalPlaceNumbers: true,
  forceUKStyle: false
};

function splitEasy(str, originalOpts) {
  // traverse the string and push each column into array
  // when line break is detected, push what's gathered into main array
  var colStarts = 0;
  var lineBreakStarts = 0;
  var rowArray = [];
  var resArray = [];
  var ignoreCommasThatFollow = false;
  var thisRowContainsOnlyEmptySpace = true; // we need at least one non-empty element to
  // flip it to `false` on each line

  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error("csv-split-easy/split(): [THROW_ID_02] Options object must be a plain object! Currently it's of a type " + typeof originalOpts + " equal to:\n" + JSON.stringify(originalOpts, null, 4));
  } // prep opts


  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);

  if (typeof str !== "string") {
    throw new TypeError("csv-split-easy/split(): [THROW_ID_04] input must be string! Currently it's: " + typeof str + ", equal to: " + JSON.stringify(str, null, 4));
  } else {
    if (str === "") {
      return [[""]];
    }

    str = str.trim();
  }

  for (var i = 0, len = str.length; i < len; i++) {
    if (thisRowContainsOnlyEmptySpace && str[i] !== '"' && str[i] !== "," && str[i].trim() !== "") {
      thisRowContainsOnlyEmptySpace = false;
    } //
    // detect a double quote
    // ======================


    if (str[i] === '"') {
      // if this is a double quote escape character
      if (ignoreCommasThatFollow && str[i + 1] === '"') {
        // skip it and the next
        i += 1;
      } else if (ignoreCommasThatFollow) {
        // 1. turn off the flag:
        ignoreCommasThatFollow = false; // 2. dump the value that ends here:

        var newElem = str.slice(colStarts, i); // if the element contains only empty space,

        if (newElem.trim() !== "") {
          thisRowContainsOnlyEmptySpace = false;
        } // if the element contains the double quote escape character,
        // chances are it doesn't need to have seperators removed


        var processedElem = /""/.test(newElem) ? newElem.replace(/""/g, '"') : stringRemoveThousandSeparators.remSep(newElem, {
          removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
          padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
          forceUKStyle: opts.forceUKStyle
        });
        rowArray.push(processedElem); // push it anyway, if it's empty or not.
        // later if whole row comprises of empty columns (thisRowContainsOnlyEmptySpace still
        // equals `true`), we won't push that `rowArray` into `resArray`.
      } else {
        ignoreCommasThatFollow = true;
        colStarts = i + 1;
      }
    } //
    // detect a comma
    // ======================
    else if (!ignoreCommasThatFollow && str[i] === ",") {
        if (str[i - 1] !== '"' && !ignoreCommasThatFollow) {
          // dump the previous value into array if the character before it, the double
          // quote, hasn't dumped the value already:
          var _newElem = str.slice(colStarts, i); // if the element contains only empty space,


          if (_newElem.trim() !== "") {
            thisRowContainsOnlyEmptySpace = false;
          }

          rowArray.push(stringRemoveThousandSeparators.remSep(_newElem, // same, push anyway. We'll check `resArray` in the end
          {
            removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
            padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
            forceUKStyle: opts.forceUKStyle
          })); // for emptiness via `thisRowContainsOnlyEmptySpace`
        } // in all cases, set the new start marker


        colStarts = i + 1; // also, reset the lineBreakStarts in one was active

        if (lineBreakStarts) {
          lineBreakStarts = 0;
        }
      } //
      // detect a line break
      // ======================
      else if (str[i] === "\n" || str[i] === "\r") {
          // question: is it the first line break of its cluster, or not?
          if (!lineBreakStarts) {
            // 1. mark where line break starts:
            lineBreakStarts = i; // 2. dump the value into rowArray only if closing double quote hasn't dumped already:

            if (!ignoreCommasThatFollow && str[i - 1] !== '"') {
              var _newElem2 = str.slice(colStarts, i); // if the element contains only empty space,


              if (_newElem2.trim() !== "") {
                thisRowContainsOnlyEmptySpace = false;
              }

              rowArray.push(stringRemoveThousandSeparators.remSep(_newElem2, {
                removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
                padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
                forceUKStyle: opts.forceUKStyle
              }));
            } // 3. dump the whole row's array into result array:


            if (!thisRowContainsOnlyEmptySpace) {
              resArray.push(rowArray);
            } else {
              // wipe rowArray
              rowArray.length = 0;
            } // 4. reset thisRowContainsOnlyEmptySpace


            thisRowContainsOnlyEmptySpace = true; // 5. wipe the rowArray:

            rowArray = [];
          }

          colStarts = i + 1;
        } // if ((str[i] !== '\n') && (str[i] !== '\r'))
        //
        // but then, take care if line break state is actice
        //
        else if (lineBreakStarts) {
            // 1. first, turn off the line break state flag:
            lineBreakStarts = 0; // 2. second, new column's value starts here, so mark that:

            colStarts = i;
          } //
    // detect the end of the file/string
    // ======================


    if (i + 1 === len) {
      // dump the value into rowArray, but only if the current character is
      // not a double quote, because it will have dumped already:
      if (str[i] !== '"') {
        var _newElem3 = str.slice(colStarts, i + 1); // if the element contains only empty space,


        if (_newElem3.trim()) {
          thisRowContainsOnlyEmptySpace = false;
        }

        rowArray.push(stringRemoveThousandSeparators.remSep(_newElem3, {
          removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
          padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
          forceUKStyle: opts.forceUKStyle
        }));
      } // in any case, dump the whole row's array into result array.
      // for posterity, the whole row (`rowArray`) dumping (into `resArray`) is
      // done at two places: here and the first encountered line break character
      // that follows non-line break character.


      if (!thisRowContainsOnlyEmptySpace) {
        resArray.push(rowArray);
      } else {
        // wipe rowArray
        rowArray = [];
      } // reset thisRowContainsOnlyEmptySpace


      thisRowContainsOnlyEmptySpace = true;
    } //
    // ======================
    // ======================

  }

  if (resArray.length === 0) {
    return [[""]]; // because in some cases only [] reaches here
  }

  return resArray;
}

exports.defaults = defaults;
exports.splitEasy = splitEasy;
exports.version = version$1;
