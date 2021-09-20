/**
 * @name array-includes-with-glob
 * @fileoverview Like _.includes but with wildcards
 * @version 4.0.2
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/array-includes-with-glob/}
 */

import matcher from 'matcher';

var version$1 = "4.0.2";

const version = version$1;
const defaults = {
  arrayVsArrayAllMustBeFound: "any",
  caseSensitive: true
};
function includesWithGlob(originalInput, stringToFind, originalOpts) {
  if (!originalInput.length || !stringToFind.length) {
    return false;
  }
  const opts = { ...defaults,
    ...originalOpts
  };
  const input = typeof originalInput === "string" ? [originalInput] : Array.from(originalInput);
  if (typeof stringToFind === "string") {
    return input.some(val => matcher.isMatch(val, stringToFind, {
      caseSensitive: opts.caseSensitive
    }));
  }
  if (opts.arrayVsArrayAllMustBeFound === "any") {
    return stringToFind.some(stringToFindVal => input.some(val => matcher.isMatch(val, stringToFindVal, {
      caseSensitive: opts.caseSensitive
    })));
  }
  return stringToFind.every(stringToFindVal => input.some(val => matcher.isMatch(val, stringToFindVal, {
    caseSensitive: opts.caseSensitive
  })));
}

export { defaults, includesWithGlob, version };
