/**
 * @name array-pull-all-with-glob
 * @fileoverview Like _.pullAll but with globs (wildcards)
 * @version 6.0.5
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/array-pull-all-with-glob/}
 */

import { isMatch } from 'matcher';

var version$1 = "6.0.5";

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
  const res = Array.from(originalInput).filter(originalVal => !toBeRemoved.some(remVal => isMatch(originalVal, remVal, {
    caseSensitive: opts.caseSensitive
  })));
  return res;
}

export { pull, version };
