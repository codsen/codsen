/**
 * ranges-process-outside
 * Iterate string considering ranges, as if they were already applied
 * Version: 2.2.36
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-process-outside/
 */

import invert from 'ranges-invert';
import crop from 'ranges-crop';
import runes from 'runes';

function processOutside(originalStr, originalRanges, cb, skipChecks = false) {
  function isFunction(functionToCheck) {
    return (
      functionToCheck &&
      {}.toString.call(functionToCheck) === "[object Function]"
    );
  }
  if (typeof originalStr !== "string") {
    if (originalStr === undefined) {
      throw new Error(
        `ranges-process-outside: [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!`
      );
    } else {
      throw new Error(
        `ranges-process-outside: [THROW_ID_02] the first input argument must be string! It was given as:\n${JSON.stringify(
          originalStr,
          null,
          4
        )} (type ${typeof originalStr})`
      );
    }
  }
  if (
    originalRanges &&
    (!Array.isArray(originalRanges) ||
      (originalRanges.length && !Array.isArray(originalRanges[0])))
  ) {
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
        cb(i, i + charLength, (offsetValue) => {
          /* istanbul ignore else */
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
      invert(skipChecks ? originalRanges : originalRanges, originalStr.length, {
        skipChecks: !!skipChecks,
      }),
      originalStr.length
    );
    iterator(originalStr, temp);
  } else {
    iterator(originalStr, [[0, originalStr.length]]);
  }
}

export default processOutside;
