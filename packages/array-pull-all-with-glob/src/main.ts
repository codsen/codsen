import { isMatch } from "matcher";

import { version as v } from "../package.json";

const version: string = v;

interface Opts {
  caseSensitive?: boolean;
}

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

  // opts are mirroring matcher's at the moment, can't promise that for the future
  let defaults: Opts = {
    caseSensitive: true,
  };
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

export { pull, version };
