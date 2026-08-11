/* eslint no-param-reassign:0 */

import { remSep } from "string-remove-thousand-separators";

import { version as v } from "../package.json";

const version: string = v;

export interface Opts {
  delimiter: string;
  removeThousandSeparatorsFromNumbers: boolean;
  padSingleDecimalPlaceNumbers: boolean;
  forceUKStyle: boolean;
}

const defaults: Opts = {
  delimiter: ",",
  removeThousandSeparatorsFromNumbers: true,
  padSingleDecimalPlaceNumbers: true,
  forceUKStyle: false,
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

function trimOuterWhitespace(str: string, delimiter: string): string {
  let start = 0;
  let end = str.length;

  while (start < end && str[start] !== delimiter && str[start].trim() === "") {
    start += 1;
  }
  while (
    end > start &&
    str[end - 1] !== delimiter &&
    str[end - 1].trim() === ""
  ) {
    end -= 1;
  }

  return str.slice(start, end);
}

function splitEasy(str: string, opts?: Partial<Opts>): string[][] {
  // traverse the string and push each column into array
  // when line break is detected, push what's gathered into main array
  let colStarts = 0;
  let lineBreakStarts = 0;
  let rowArray = [];
  let resArray = [];
  let ignoreDelimitersThatFollow = false;
  let thisRowContainsOnlyEmptySpace = true; // we need at least one non-empty element to
  // flip it to `false` on each line

  if (opts && !isPlainObject(opts)) {
    throw new Error(
      `csv-split-easy/splitEasy(): [THROW_ID_01] Options object must be a plain object! Currently it's of a type ${typeof opts} equal to:\n${JSON.stringify(
        opts,
        null,
        4,
      )}`,
    );
  }

  // prep resolvedOpts
  let resolvedOpts: Opts = { ...defaults, ...opts };

  if (typeof str !== "string") {
    throw new TypeError(
      `csv-split-easy/splitEasy(): [THROW_ID_02] input must be string! Currently it's: ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        4,
      )}`,
    );
  } else {
    if (
      typeof resolvedOpts.delimiter !== "string" ||
      resolvedOpts.delimiter.length !== 1 ||
      resolvedOpts.delimiter === '"' ||
      resolvedOpts.delimiter === "\n" ||
      resolvedOpts.delimiter === "\r"
    ) {
      throw new TypeError(
        `csv-split-easy/splitEasy(): [THROW_ID_03] The "delimiter" option must be a single character other than a double quote or a line break! Currently it's: ${typeof resolvedOpts.delimiter}, equal to: ${JSON.stringify(
          resolvedOpts.delimiter,
        )}`,
      );
    }
    if (str === "") {
      return [[""]];
    }
    str = trimOuterWhitespace(str, resolvedOpts.delimiter);
  }
  for (let i = 0, len = str.length; i < len; i++) {
    if (
      thisRowContainsOnlyEmptySpace &&
      str[i] !== '"' &&
      str[i] !== resolvedOpts.delimiter &&
      str[i].trim() !== ""
    ) {
      thisRowContainsOnlyEmptySpace = false;
    }
    //
    // detect a double quote
    // ======================
    if (str[i] === '"') {
      // if this is a double quote escape character
      if (ignoreDelimitersThatFollow && str[i + 1] === '"') {
        // skip it and the next
        i += 1;
      } else if (ignoreDelimitersThatFollow) {
        // 1. turn off the flag:
        ignoreDelimitersThatFollow = false;
        // 2. dump the value that ends here:
        let newElem = str.slice(colStarts, i);
        // if the element contains only empty space,
        if (newElem.trim() !== "") {
          thisRowContainsOnlyEmptySpace = false;
        }
        // if the element contains the double quote escape character,
        // chances are it doesn't need to have seperators removed
        let processedElem = /""/.test(newElem)
          ? newElem.replace(/""/g, '"')
          : remSep(newElem, {
              removeThousandSeparatorsFromNumbers:
                resolvedOpts.removeThousandSeparatorsFromNumbers,
              padSingleDecimalPlaceNumbers:
                resolvedOpts.padSingleDecimalPlaceNumbers,
              forceUKStyle: resolvedOpts.forceUKStyle,
            });
        rowArray.push(processedElem); // push it anyway, if it's empty or not.
        // later if whole row comprises of empty columns (thisRowContainsOnlyEmptySpace still
        // equals `true`), we won't push that `rowArray` into `resArray`.
      } else {
        ignoreDelimitersThatFollow = true;
        colStarts = i + 1;
      }
    }
    //
    // detect a delimiter
    // ======================
    else if (!ignoreDelimitersThatFollow && str[i] === resolvedOpts.delimiter) {
      if (str[i - 1] !== '"' && !ignoreDelimitersThatFollow) {
        // dump the previous value into array if the character before it, the double
        // quote, hasn't dumped the value already:
        let newElem = str.slice(colStarts, i);
        // if the element contains only empty space,
        if (newElem.trim() !== "") {
          thisRowContainsOnlyEmptySpace = false;
        }
        rowArray.push(
          remSep(
            newElem, // same, push anyway. We'll check `resArray` in the end
            {
              removeThousandSeparatorsFromNumbers:
                resolvedOpts.removeThousandSeparatorsFromNumbers,
              padSingleDecimalPlaceNumbers:
                resolvedOpts.padSingleDecimalPlaceNumbers,
              forceUKStyle: resolvedOpts.forceUKStyle,
            },
          ),
        );
        // for emptiness via `thisRowContainsOnlyEmptySpace`
      }
      // in all cases, set the new start marker
      colStarts = i + 1;
      // also, reset the lineBreakStarts in one was active
      if (lineBreakStarts) {
        lineBreakStarts = 0;
      }
    }
    //
    // detect a line break
    // ======================
    else if (str[i] === "\n" || str[i] === "\r") {
      // question: is it the first line break of its cluster, or not?
      if (!lineBreakStarts) {
        // 1. mark where line break starts:
        lineBreakStarts = i;
        // 2. dump the value into rowArray only if closing double quote hasn't dumped already:
        if (!ignoreDelimitersThatFollow && str[i - 1] !== '"') {
          let newElem = str.slice(colStarts, i);
          // if the element contains only empty space,
          if (newElem.trim() !== "") {
            thisRowContainsOnlyEmptySpace = false;
          }
          rowArray.push(
            remSep(newElem, {
              removeThousandSeparatorsFromNumbers:
                resolvedOpts.removeThousandSeparatorsFromNumbers,
              padSingleDecimalPlaceNumbers:
                resolvedOpts.padSingleDecimalPlaceNumbers,
              forceUKStyle: resolvedOpts.forceUKStyle,
            }),
          );
        }
        // 3. dump the whole row's array into result array:
        if (!thisRowContainsOnlyEmptySpace) {
          resArray.push(rowArray);
        } else {
          // wipe rowArray
          rowArray.length = 0;
        }
        // 4. reset thisRowContainsOnlyEmptySpace
        thisRowContainsOnlyEmptySpace = true;
        // 5. wipe the rowArray:
        rowArray = [];
      }
      colStarts = i + 1;
    }
    // if ((str[i] !== '\n') && (str[i] !== '\r'))
    //
    // but then, take care if line break state is actice
    //
    else if (lineBreakStarts) {
      // 1. first, turn off the line break state flag:
      lineBreakStarts = 0;
      // 2. second, new column's value starts here, so mark that:
      colStarts = i;
    }
    //
    // detect the end of the file/string
    // ======================
    if (i + 1 === len) {
      // dump the value into rowArray, but only if the current character is
      // not a double quote, because it will have dumped already:
      if (str[i] !== '"') {
        let newElem = str.slice(colStarts, i + 1);
        // if the element contains only empty space,
        if (newElem.trim()) {
          thisRowContainsOnlyEmptySpace = false;
        }
        rowArray.push(
          remSep(newElem, {
            removeThousandSeparatorsFromNumbers:
              resolvedOpts.removeThousandSeparatorsFromNumbers,
            padSingleDecimalPlaceNumbers:
              resolvedOpts.padSingleDecimalPlaceNumbers,
            forceUKStyle: resolvedOpts.forceUKStyle,
          }),
        );
      }
      // in any case, dump the whole row's array into result array.
      // for posterity, the whole row (`rowArray`) dumping (into `resArray`) is
      // done at two places: here and the first encountered line break character
      // that follows non-line break character.
      if (!thisRowContainsOnlyEmptySpace) {
        resArray.push(rowArray);
      } else {
        // wipe rowArray
        rowArray = [];
      }
      // reset thisRowContainsOnlyEmptySpace
      thisRowContainsOnlyEmptySpace = true;
    }
    //
    // ======================
    // ======================
  }
  if (resArray.length === 0) {
    return [[""]]; // because in some cases only [] reaches here
  }
  return resArray;
}

export { defaults, splitEasy, version };
