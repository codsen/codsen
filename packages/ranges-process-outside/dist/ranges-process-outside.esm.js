/**
 * @name ranges-process-outside
 * @fileoverview Iterate string considering ranges, as if they were already applied
 * @version 5.0.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-process-outside/}
 */

import runes from 'runes';
import { rInvert } from 'ranges-invert';
import { rCrop } from 'ranges-crop';

var version$1 = "5.0.0";

const version = version$1;
function rProcessOutside(originalStr, originalRanges, cb, skipChecks = false) {
  if (typeof originalStr !== "string") {
    if (originalStr === undefined) {
      throw new Error(`ranges-process-outside: [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!`);
    } else {
      throw new Error(`ranges-process-outside: [THROW_ID_02] the first input argument must be string! It was given as:\n${JSON.stringify(originalStr, null, 4)} (type ${typeof originalStr})`);
    }
  }
  if (originalRanges && (!Array.isArray(originalRanges) || originalRanges.length && !Array.isArray(originalRanges[0]))) {
    throw new Error(`ranges-process-outside: [THROW_ID_03] the second input argument must be array of ranges or null! It was given as:\n${JSON.stringify(originalRanges, null, 4)} (type ${typeof originalRanges})`);
  }
  if (typeof cb !== "function") {
    throw new Error(`ranges-process-outside: [THROW_ID_04] the third input argument must be a function! It was given as:\n${JSON.stringify(cb, null, 4)} (type ${typeof cb})`);
  }
  function iterator(str, arrOfArrays) {
    (arrOfArrays || []).forEach(([fromIdx, toIdx]) => {
      for (let i = fromIdx; i < toIdx; i++) {
        const charLength = runes(str.slice(i))[0].length;
        cb(i, i + charLength, offsetValue => {
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
    const temp = rCrop(rInvert(skipChecks ? originalRanges : originalRanges, originalStr.length, {
      skipChecks: !!skipChecks
    }), originalStr.length);
    iterator(originalStr, temp);
  } else {
    iterator(originalStr, [[0, originalStr.length]]);
  }
}

export { rProcessOutside, version };
