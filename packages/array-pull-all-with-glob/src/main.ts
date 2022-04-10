import { isMatch } from "matcher";

import { version as v } from "../package.json";

const version: string = v;

interface Opts {
  caseSensitive?: boolean;
}

// opts are mirroring matcher's at the moment, can't promise that for the future
const defaults: Opts = {
  caseSensitive: true,
};

/**
 * Like _.pullAll but with globs (wildcards)
 */
function pull(
  originalInput: string[],
  originalToBeRemoved: string | string[],
  originalOpts?: Opts
): string[] {
  // insurance
  if (!originalInput.length) {
    return [];
  }
  if (!originalInput.length || !originalToBeRemoved.length) {
    return Array.from(originalInput);
  }
  let toBeRemoved: string[] =
    typeof originalToBeRemoved === "string"
      ? [originalToBeRemoved]
      : Array.from(originalToBeRemoved);
  let opts: Opts = { ...defaults, ...originalOpts };

  let res = Array.from(originalInput).filter(
    (originalVal) =>
      !toBeRemoved.some((remVal) =>
        isMatch(originalVal, remVal, {
          caseSensitive: opts.caseSensitive,
        })
      )
  );
  return res;
}

export { pull, defaults, version };
