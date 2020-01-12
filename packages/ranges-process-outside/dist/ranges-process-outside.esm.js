/**
 * ranges-process-outside
 * Iterate through string and optionally a given ranges as if they were one
 * Version: 2.2.15
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-process-outside
 */

import invert from 'ranges-invert';
import crop from 'ranges-crop';
import runes from 'runes';

const isArr = Array.isArray;
function processOutside(str, originalRanges, cb, skipChecks = false) {
  function isFunction(functionToCheck) {
    return (
      functionToCheck &&
      {}.toString.call(functionToCheck) === "[object Function]"
    );
  }
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error(
        `ranges-process-outside: [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!`
      );
    } else {
      throw new Error(
        `ranges-process-outside: [THROW_ID_02] the first input argument must be string! It was given as:\n${JSON.stringify(
          str,
          null,
          4
        )} (type ${typeof str})`
      );
    }
  }
  if (originalRanges && !isArr(originalRanges)) {
    throw new Error(
      `ranges-process-outside: [THROW_ID_03] the second input argument must be array of ranges or null! It was given as:\n${JSON.stringify(
        originalRanges,
        null,
        4
      )} (type ${typeof originalRanges})`
    );
  }
  if (!isFunction(cb)) {
    throw new Error(
      `ranges-process-outside: [THROW_ID_04] the third input argument must be a function! It was given as:\n${JSON.stringify(
        cb,
        null,
        4
      )} (type ${typeof cb})`
    );
  }
  function iterator(str, arrOfArrays) {
    arrOfArrays.forEach(([fromIdx, toIdx]) => {
      for (let i = fromIdx; i < toIdx; i++) {
        const charLength = runes(str.slice(i))[0].length;
        cb(i, i + charLength, offsetValue => {
          if (offsetValue != null) {
            i += offsetValue;
          }
        });
        if (charLength && charLength > 1) {
          i += charLength - 1;
        }
      }
    });
  }
  if (originalRanges && originalRanges.length) {
    const temp = crop(
      invert(skipChecks ? originalRanges : originalRanges, str.length, {
        skipChecks: !!skipChecks
      }),
      str.length
    );
    iterator(str, temp);
  } else {
    iterator(str, [[0, str.length]]);
  }
}

export default processOutside;
