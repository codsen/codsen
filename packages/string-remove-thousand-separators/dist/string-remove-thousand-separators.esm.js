/**
 * string-remove-thousand-separators
 * Detects and removes thousand separators (dot/comma/quote/space) from string-type digits
 * Version: 3.0.68
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-remove-thousand-separators/
 */

import replaceSlicesArr from 'ranges-apply';
import Slices from 'ranges-push';
import isObj from 'lodash.isplainobject';
import isNum from 'is-numeric';
import trimChars from 'lodash.trim';

function remSep(str, originalOpts) {
  let allOK = true;
  const knownSeparatorsArray = [".", ",", "'", " "];
  let firstSeparator;
  if (typeof str !== "string") {
    throw new TypeError(
      `string-remove-thousand-separators/remSep(): [THROW_ID_01] Input must be string! Currently it's: ${typeof str}, equal to:\n${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (
    originalOpts !== undefined &&
    originalOpts !== null &&
    !isObj(originalOpts)
  ) {
    throw new TypeError(
      `string-remove-thousand-separators/remSep(): [THROW_ID_02] Options object must be a plain object! Currently it's: ${typeof originalOpts}, equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  const defaults = {
    removeThousandSeparatorsFromNumbers: true,
    padSingleDecimalPlaceNumbers: true,
    forceUKStyle: false,
  };
  const opts = { ...defaults, ...originalOpts };
  const res = trimChars(str.trim(), '"');
  if (res === "") {
    return res;
  }
  const rangesToDelete = new Slices();
  for (let i = 0, len = res.length; i < len; i++) {
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
            } else if (
              opts.removeThousandSeparatorsFromNumbers &&
              opts.forceUKStyle &&
              res[i] === ","
            ) {
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

export default remSep;
