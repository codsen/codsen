/**
 * array-includes-with-glob
 * Like _.includes but with wildcards
 * Version: 3.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-includes-with-glob/
 */

import matcher from 'matcher';

var version = "3.0.5";

const version$1 = version;
const defaults = {
  arrayVsArrayAllMustBeFound: "any",
  caseSensitive: true
};
/**
 * Like _.includes but with wildcards
 */

function includesWithGlob(originalInput, stringToFind, originalOpts) {
  // maybe we can end prematurely:
  if (!originalInput.length || !stringToFind.length) {
    return false; // because nothing can be found in it
  }

  const opts = { ...defaults,
    ...originalOpts
  };
  const input = typeof originalInput === "string" ? [originalInput] : Array.from(originalInput);

  if (typeof stringToFind === "string") {
    return input.some(val => matcher.isMatch(val, stringToFind, {
      caseSensitive: opts.caseSensitive
    }));
  } // array then.


  if (opts.arrayVsArrayAllMustBeFound === "any") {
    return stringToFind.some(stringToFindVal => input.some(val => matcher.isMatch(val, stringToFindVal, {
      caseSensitive: opts.caseSensitive
    })));
  }

  return stringToFind.every(stringToFindVal => input.some(val => matcher.isMatch(val, stringToFindVal, {
    caseSensitive: opts.caseSensitive
  })));
}

export { defaults, includesWithGlob, version$1 as version };
