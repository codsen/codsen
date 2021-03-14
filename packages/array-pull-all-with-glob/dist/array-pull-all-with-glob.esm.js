/**
 * array-pull-all-with-glob
 * Like _.pullAll but with globs (wildcards)
 * Version: 5.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-pull-all-with-glob/
 */

import matcher from 'matcher';

var version$1 = "5.0.8";

const version = version$1;
function pull(originalInput, originalToBeRemoved, originalOpts) {
  if (!originalInput.length) {
    return [];
  }
  if (!originalInput.length || !originalToBeRemoved.length) {
    return Array.from(originalInput);
  }
  const toBeRemoved = typeof originalToBeRemoved === "string" ? [originalToBeRemoved] : Array.from(originalToBeRemoved);
  const defaults = {
    caseSensitive: true
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  const res = Array.from(originalInput).filter(originalVal => !toBeRemoved.some(remVal => matcher.isMatch(originalVal, remVal, {
    caseSensitive: opts.caseSensitive
  })));
  return res;
}

export { pull, version };
