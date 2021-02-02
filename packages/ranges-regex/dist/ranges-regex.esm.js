/**
 * ranges-regex
 * Integrate regex operations into Ranges workflow
 * Version: 4.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-regex/
 */

import { rMerge } from 'ranges-merge';
import isregexp from 'lodash.isregexp';

var version = "4.0.2";

const version$1 = version;

function rRegex(regx, str, replacement) {
  // given regx validation
  if (regx === undefined) {
    throw new TypeError(`ranges-regex: [THROW_ID_01] The first input's argument must be a regex object! Currently it is missing!`);
  } else if (!isregexp(regx)) {
    throw new TypeError(`ranges-regex: [THROW_ID_02] The first input's argument must be a regex object! Currently its type is: ${typeof regx}, equal to: ${JSON.stringify(regx, null, 4)}`);
  } // str validation


  if (typeof str !== "string") {
    throw new TypeError(`ranges-regex: [THROW_ID_03] The second input's argument must be a string! Currently its type is: ${typeof str}, equal to: ${JSON.stringify(str, null, 4)}`);
  } // replacement validation


  if (replacement && typeof replacement !== "string") {
    throw new TypeError(`ranges-regex: [THROW_ID_04] The third input's argument must be a string or null! Currently its type is: ${typeof replacement}, equal to: ${JSON.stringify(replacement, null, 4)}`);
  } // if an empty string was given, return an empty (ranges) array:


  if (!str.length) {
    return null;
  } //                       finally, the real action
  // ---------------------------------------------------------------------------


  let tempArr;
  const resRange = [];

  if (replacement === null || typeof replacement === "string" && replacement.length) {
    // eslint-disable-next-line no-cond-assign
    while ((tempArr = regx.exec(str)) !== null) {
      resRange.push([regx.lastIndex - tempArr[0].length, regx.lastIndex, replacement]);
    }
  } else {
    // eslint-disable-next-line no-cond-assign
    while ((tempArr = regx.exec(str)) !== null) {
      resRange.push([regx.lastIndex - tempArr[0].length, regx.lastIndex]);
    }
  }

  if (resRange.length) {
    return rMerge(resRange);
  }

  return null;
}

export { rRegex, version$1 as version };
