/**
 * @name string-extract-class-names
 * @fileoverview Extracts CSS class/id names from a string
 * @version 7.0.3
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-extract-class-names/}
 */

import { right, left } from 'string-left-right';

var version$1 = "7.0.3";

const version = version$1;
function extract(str) {
  if (typeof str !== "string") {
    throw new TypeError(`string-extract-class-names: [THROW_ID_01] first str should be string, not ${typeof str}, currently equal to ${JSON.stringify(str, null, 4)}`);
  }
  const badChars = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\``;
  let stateCurrentlyIs;
  function isLatinLetter(char) {
    return typeof char === "string" && !!char.length && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
  }
  let selectorStartsAt = null;
  const result = {
    res: [],
    ranges: []
  };
  for (let i = 0, len = str.length; i <= len; i++) {
    if (selectorStartsAt !== null && i >= selectorStartsAt && (
    !str[i] ||
    !str[i].trim() ||
    badChars.includes(str[i]))) {
      if (i > selectorStartsAt + 1) {
        result.ranges.push([selectorStartsAt, i]);
        result.res.push(`${stateCurrentlyIs || ""}${str.slice(selectorStartsAt, i)}`);
        if (stateCurrentlyIs) {
          stateCurrentlyIs = undefined;
        }
      }
      selectorStartsAt = null;
    }
    if (str[i] && selectorStartsAt === null && (str[i] === "." || str[i] === "#")) {
      selectorStartsAt = i;
    }
    const temp1 = right(str, i + 4);
    if (str.startsWith("class", i) && typeof left(str, i) === "number" && str[left(str, i)] === "[" && typeof temp1 === "number" && str[temp1] === "=") {
      /* istanbul ignore else */
      if (right(str, temp1) && isLatinLetter(str[right(str, temp1)])) {
        selectorStartsAt = right(str, temp1);
      } else if (`'"`.includes(str[right(str, temp1)]) && isLatinLetter(str[right(str, right(str, temp1))])) {
        selectorStartsAt = right(str, right(str, temp1));
      }
      stateCurrentlyIs = ".";
    }
    const temp2 = right(str, i + 1);
    if (str.startsWith("id", i) && str[left(str, i)] === "[" && temp2 !== null && str[temp2] === "=") {
      if (isLatinLetter(str[right(str, temp2)])) {
        selectorStartsAt = right(str, temp2);
      } else if (`'"`.includes(str[right(str, temp2)]) && isLatinLetter(str[right(str, right(str, temp2))])) {
        selectorStartsAt = right(str, right(str, temp2));
      }
      stateCurrentlyIs = "#";
    }
  }
  if (!result.ranges.length) {
    result.ranges = null;
  }
  return result;
}

export { extract, version };
