/**
 * array-includes-with-glob
 * Like _.includes but with wildcards
 * Version: 2.12.43
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-includes-with-glob/
 */

import matcher from 'matcher';

const isArr = Array.isArray;
function arrayIncludesWithGlob(originalInput, stringToFind, originalOpts) {
  function existy(x) {
    return x != null;
  }
  function isStr(something) {
    return typeof something === "string";
  }
  const defaults = {
    arrayVsArrayAllMustBeFound: "any",
  };
  const opts = { ...defaults, ...originalOpts };
  if (arguments.length === 0) {
    throw new Error(
      "array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_01] all inputs missing!"
    );
  }
  if (arguments.length === 1) {
    throw new Error(
      "array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_02] second argument missing!"
    );
  }
  if (!isArr(originalInput)) {
    if (isStr(originalInput)) {
      originalInput = [originalInput];
    } else {
      throw new Error(
        `array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_03] first argument must be an array! It was given as ${typeof originalInput}`
      );
    }
  }
  if (!isStr(stringToFind) && !isArr(stringToFind)) {
    throw new Error(
      `array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_04] second argument must be a string or array of strings! It was given as ${typeof stringToFind}`
    );
  }
  if (
    opts.arrayVsArrayAllMustBeFound !== "any" &&
    opts.arrayVsArrayAllMustBeFound !== "all"
  ) {
    throw new Error(
      `array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_05] opts.arrayVsArrayAllMustBeFound was customised to an unrecognised value, ${opts.arrayVsArrayAllMustBeFound}. It must be equal to either "any" or "all".`
    );
  }
  if (originalInput.length === 0) {
    return false;
  }
  const input = originalInput.filter((elem) => existy(elem));
  if (input.length === 0) {
    return false;
  }
  if (isStr(stringToFind)) {
    return input.some((val) =>
      matcher.isMatch(val, stringToFind, { caseSensitive: true })
    );
  }
  if (opts.arrayVsArrayAllMustBeFound === "any") {
    return stringToFind.some((stringToFindVal) =>
      input.some((val) =>
        matcher.isMatch(val, stringToFindVal, { caseSensitive: true })
      )
    );
  }
  return stringToFind.every((stringToFindVal) =>
    input.some((val) =>
      matcher.isMatch(val, stringToFindVal, { caseSensitive: true })
    )
  );
}

export default arrayIncludesWithGlob;
