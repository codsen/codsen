/**
 * string-extract-class-names
 * Extracts CSS class/id names from a string
 * Version: 5.10.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-extract-class-names/
 */

import { right, left } from 'string-left-right';

var version = "5.10.1";

const version$1 = version;
/**
 * Extracts CSS class/id names from a string
 */

function extract(str) {
  // insurance
  // =========
  if (typeof str !== "string") {
    throw new TypeError(`string-extract-class-names: [THROW_ID_01] first str should be string, not ${typeof str}, currently equal to ${JSON.stringify(str, null, 4)}`);
  }

  const badChars = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\``;
  let stateCurrentlyIs; // "." or "#"
  // functions
  // =========

  function isLatinLetter(char) {
    // we mean Latin letters A-Z, a-z
    return typeof char === "string" && !!char.length && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
  } // action
  // ======


  let selectorStartsAt = null;
  const result = {
    res: [],
    ranges: []
  }; // we iterate upto and including str.length - last element will be undefined
  // at cost of extra protective clauses (if not undefined) we simplify the
  // algorithm ending clauses - things' ending at string's end can now be
  // tackled in the same logic as things' that end in the middle of the string

  for (let i = 0, len = str.length; i <= len; i++) { // catch the ending of a selector's name:

    if (selectorStartsAt !== null && i >= selectorStartsAt && ( // and...
    // either the end of string has been reached
    !str[i] || // or it's a whitespace
    !str[i].trim() || // or it's a character, unsuitable for class/id names
    badChars.includes(str[i]))) {
      // if selector is more than dot or hash:
      if (i > selectorStartsAt + 1) {
        // If we reached the last character and selector's beginning has not been
        // interrupted, extend the slice's ending by 1 character. If we terminate
        // the selector because of illegal character, slice right here, at index "i".
        result.ranges.push([selectorStartsAt, i]);
        result.res.push(`${stateCurrentlyIs || ""}${str.slice(selectorStartsAt, i)}`);

        if (stateCurrentlyIs) {
          stateCurrentlyIs = undefined;
        }
      }

      selectorStartsAt = null;
    } // catch dot or hash:


    if (str[i] && selectorStartsAt === null && (str[i] === "." || str[i] === "#")) {
      selectorStartsAt = i;
    } // catch zzz[class=]


    const temp1 = right(str, i + 4);

    if (str.startsWith("class", i) && typeof left(str, i) === "number" && str[left(str, i)] === "[" && typeof temp1 === "number" && str[temp1] === "=") { // if it's zzz[class=something] (without quotes)

      /* istanbul ignore else */

      if (right(str, temp1) && isLatinLetter(str[right(str, temp1)])) {
        selectorStartsAt = right(str, temp1);
      } else if (`'"`.includes(str[right(str, temp1)]) && isLatinLetter(str[right(str, right(str, temp1))])) {
        selectorStartsAt = right(str, right(str, temp1));
      }

      stateCurrentlyIs = ".";
    } // catch zzz[id=]


    const temp2 = right(str, i + 1);

    if (str.startsWith("id", i) && str[left(str, i)] === "[" && temp2 !== null && str[temp2] === "=") { // if it's zzz[id=something] (without quotes)

      if (isLatinLetter(str[right(str, temp2)])) {
        selectorStartsAt = right(str, temp2);
      } else if (`'"`.includes(str[right(str, temp2)]) && isLatinLetter(str[right(str, right(str, temp2))])) {
        selectorStartsAt = right(str, right(str, temp2));
      }

      stateCurrentlyIs = "#";
    }
  } // absence of ranges is falsy "null", not truthy empty array, so
  // if nothing was extracted and empty array is in result.ranges,
  // overwrite it to falsy "null"


  if (!result.ranges.length) {
    result.ranges = null;
  }

  return result;
}

export { extract, version$1 as version };
