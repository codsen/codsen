import { isMatch } from "matcher";

import { version as v } from "../package.json";

const version: string = v;

export interface Opts {
  caseSensitive: boolean;
}

// resolvedOpts are mirroring matcher's at the moment, can't promise that for the future
const defaults: Opts = {
  caseSensitive: true,
};

/**
 * Like _.pullAll but with globs (wildcards)
 */
function pull(
  strArr: string[],
  toBeRemoved: string | string[],
  opts?: Partial<Opts>,
): string[] {
  // insurance
  if (!strArr.length) {
    return [];
  }
  if (!strArr.length || !toBeRemoved.length) {
    return Array.from(strArr);
  }
  let resolvedToBeRemoved: string[] =
    typeof toBeRemoved === "string" ? [toBeRemoved] : Array.from(toBeRemoved);
  let resolvedOpts: Opts = { ...defaults, ...opts };

  let res = Array.from(strArr).filter(
    (originalVal) =>
      !resolvedToBeRemoved.some((remVal) =>
        isMatch(originalVal, remVal, {
          caseSensitive: resolvedOpts.caseSensitive,
        }),
      ),
  );
  return res;
}

export { pull, defaults, version };
