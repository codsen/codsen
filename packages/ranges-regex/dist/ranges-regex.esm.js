/**
 * @name ranges-regex
 * @fileoverview Integrate regex operations into Ranges workflow
 * @version 5.0.5
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-regex/}
 */

import { rMerge } from 'ranges-merge';
import isregexp from 'lodash.isregexp';

var version$1 = "5.0.5";

const version = version$1;
function rRegex(regx, str, replacement) {
  if (regx === undefined) {
    throw new TypeError(`ranges-regex: [THROW_ID_01] The first input's argument must be a regex object! Currently it is missing!`);
  } else if (!isregexp(regx)) {
    throw new TypeError(`ranges-regex: [THROW_ID_02] The first input's argument must be a regex object! Currently its type is: ${typeof regx}, equal to: ${JSON.stringify(regx, null, 4)}`);
  }
  if (typeof str !== "string") {
    throw new TypeError(`ranges-regex: [THROW_ID_03] The second input's argument must be a string! Currently its type is: ${typeof str}, equal to: ${JSON.stringify(str, null, 4)}`);
  }
  if (replacement && typeof replacement !== "string") {
    throw new TypeError(`ranges-regex: [THROW_ID_04] The third input's argument must be a string or null! Currently its type is: ${typeof replacement}, equal to: ${JSON.stringify(replacement, null, 4)}`);
  }
  if (!str.length) {
    return null;
  }
  let tempArr;
  const resRange = [];
  if (replacement === null || typeof replacement === "string" && replacement.length) {
    while ((tempArr = regx.exec(str)) !== null) {
      resRange.push([regx.lastIndex - tempArr[0].length, regx.lastIndex, replacement]);
    }
  } else {
    while ((tempArr = regx.exec(str)) !== null) {
      resRange.push([regx.lastIndex - tempArr[0].length, regx.lastIndex]);
    }
  }
  if (resRange.length) {
    return rMerge(resRange);
  }
  return null;
}

export { rRegex, version };
