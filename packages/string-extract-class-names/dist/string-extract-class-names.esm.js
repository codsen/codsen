/**
 * string-extract-class-names
 * Extract class (or id) name from a string
 * Version: 5.9.33
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-extract-class-names/
 */

import { left, right } from 'string-left-right';

function stringExtractClassNames(input, returnRangesInstead = false) {
  if (typeof input !== "string") {
    throw new TypeError(
      `string-extract-class-names: [THROW_ID_02] first input should be string, not ${typeof input}, currently equal to ${JSON.stringify(
        input,
        null,
        4
      )}`
    );
  }
  if (typeof returnRangesInstead !== "boolean") {
    throw new TypeError(
      `string-extract-class-names: [THROW_ID_03] second input argument should be a Boolean, not ${typeof input}, currently equal to ${JSON.stringify(
        input,
        null,
        4
      )}`
    );
  }
  const badChars = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\``;
  let stateCurrentlyIs;
  function isLatinLetter(char) {
    return (
      typeof char === "string" &&
      char.length &&
      ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
        (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
    );
  }
  let selectorStartsAt = null;
  const result = [];
  for (let i = 0, len = input.length; i < len; i++) {
    if (
      selectorStartsAt !== null &&
      i >= selectorStartsAt &&
      (badChars.includes(input[i]) || !input[i].trim())
    ) {
      if (i > selectorStartsAt + 1) {
        if (returnRangesInstead) {
          result.push([selectorStartsAt, i]);
        } else {
          result.push(
            `${stateCurrentlyIs || ""}${input.slice(selectorStartsAt, i)}`
          );
        }
        if (stateCurrentlyIs) {
          stateCurrentlyIs = undefined;
        }
      }
      selectorStartsAt = null;
    }
    if (selectorStartsAt === null && (input[i] === "." || input[i] === "#")) {
      selectorStartsAt = i;
    }
    if (
      input.startsWith("class", i) &&
      input[left(input, i)] === "[" &&
      input[right(input, i + 4)] === "="
    ) {
      /* istanbul ignore else */
      if (isLatinLetter(input[right(input, right(input, i + 4))])) {
        selectorStartsAt = right(input, right(input, i + 4));
      } else if (
        `'"`.includes(input[right(input, right(input, i + 4))]) &&
        isLatinLetter(input[right(input, right(input, right(input, i + 4)))])
      ) {
        selectorStartsAt = right(input, right(input, right(input, i + 4)));
      }
      stateCurrentlyIs = ".";
    }
    if (
      input.startsWith("id", i) &&
      input[left(input, i)] === "[" &&
      input[right(input, i + 1)] === "="
    ) {
      if (isLatinLetter(input[right(input, right(input, i + 1))])) {
        selectorStartsAt = right(input, right(input, i + 1));
      } else if (
        `'"`.includes(input[right(input, right(input, i + 1))]) &&
        isLatinLetter(input[right(input, right(input, right(input, i + 1)))])
      ) {
        selectorStartsAt = right(input, right(input, right(input, i + 1)));
      }
      stateCurrentlyIs = "#";
    }
    if (i + 1 === len && selectorStartsAt !== null && i > selectorStartsAt) {
      if (returnRangesInstead) {
        result.push([selectorStartsAt, len]);
      } else {
        result.push(input.slice(selectorStartsAt, len));
      }
    }
  }
  return result;
}

export default stringExtractClassNames;
