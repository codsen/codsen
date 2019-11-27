/**
 * csv-split-easy
 * Splits the CSV string into array of arrays, each representing a row of columns
 * Version: 3.0.42
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/csv-split-easy
 */

import remSep from 'string-remove-thousand-separators';
import isObj from 'lodash.isplainobject';

function splitEasy(str, originalOpts) {
  let colStarts = 0;
  let lineBreakStarts = 0;
  let rowArray = [];
  const resArray = [];
  let ignoreCommasThatFollow = false;
  let thisRowContainsOnlyEmptySpace = true;
  if (originalOpts !== undefined && !isObj(originalOpts)) {
    throw new Error(
      `csv-split-easy/split(): [THROW_ID_02] Options object must be a plain object! Currently it's of a type ${typeof originalOpts} equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  const defaults = {
    removeThousandSeparatorsFromNumbers: true,
    padSingleDecimalPlaceNumbers: true,
    forceUKStyle: false
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (typeof str !== "string") {
    throw new TypeError(
      `csv-split-easy/split(): [THROW_ID_04] input must be string! Currently it's: ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  } else {
    if (str === "") {
      return [[""]];
    }
    str = str.trim();
  }
  for (let i = 0, len = str.length; i < len; i++) {
    if (
      thisRowContainsOnlyEmptySpace &&
      str[i] !== '"' &&
      str[i] !== "," &&
      str[i].trim() !== ""
    ) {
      thisRowContainsOnlyEmptySpace = false;
    }
    if (str[i] === '"') {
      if (ignoreCommasThatFollow && str[i + 1] === '"') {
        i += 1;
      } else if (ignoreCommasThatFollow) {
        ignoreCommasThatFollow = false;
        const newElem = str.slice(colStarts, i);
        if (newElem.trim() !== "") {
          thisRowContainsOnlyEmptySpace = false;
        }
        const processedElem = /""/.test(newElem)
          ? newElem.replace(/""/g, '"')
          : remSep(newElem, {
              removeThousandSeparatorsFromNumbers:
                opts.removeThousandSeparatorsFromNumbers,
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
        const newElem = str.slice(colStarts, i);
        if (newElem.trim() !== "") {
          thisRowContainsOnlyEmptySpace = false;
        }
        rowArray.push(
          remSep(
            newElem,
            {
              removeThousandSeparatorsFromNumbers:
                opts.removeThousandSeparatorsFromNumbers,
              padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
              forceUKStyle: opts.forceUKStyle
            }
          )
        );
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
          const newElem = str.slice(colStarts, i);
          if (newElem.trim() !== "") {
            thisRowContainsOnlyEmptySpace = false;
          }
          rowArray.push(
            remSep(newElem, {
              removeThousandSeparatorsFromNumbers:
                opts.removeThousandSeparatorsFromNumbers,
              padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
              forceUKStyle: opts.forceUKStyle
            })
          );
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
        const newElem = str.slice(colStarts, i + 1);
        if (newElem.trim() !== "") {
          thisRowContainsOnlyEmptySpace = false;
        }
        rowArray.push(
          remSep(newElem, {
            removeThousandSeparatorsFromNumbers:
              opts.removeThousandSeparatorsFromNumbers,
            padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
            forceUKStyle: opts.forceUKStyle
          })
        );
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

export default splitEasy;
