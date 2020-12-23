/**
 * array-pull-all-with-glob
 * PullAllWithGlob - like _.pullAll but pulling stronger, with globs
 * Version: 4.13.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-pull-all-with-glob/
 */

import matcher from 'matcher';

var version = "4.13.0";

function pull(originalInput, originalToBeRemoved, originalOpts) {
  // insurance
  if (!originalInput.length) {
    return [];
  }

  if (!originalInput.length || !originalToBeRemoved.length) {
    return Array.from(originalInput);
  }

  const toBeRemoved = typeof originalToBeRemoved === "string" ? [originalToBeRemoved] : Array.from(originalToBeRemoved); // opts are mirroring matcher's at the moment, can't promise that for the future

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
