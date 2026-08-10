import { match } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

export interface Opts {
  caseSensitive: boolean;
}

// Matching is case-sensitive by default.
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
  const resolvedToBeRemoved: string[] =
    typeof toBeRemoved === "string" ? [toBeRemoved] : Array.from(toBeRemoved);
  const resolvedOpts: Opts = { ...defaults, ...opts };

  const res = Array.from(strArr).filter(
    (originalVal) =>
      !resolvedToBeRemoved.some((remVal) =>
        match(originalVal, remVal, {
          caseSensitiveMatch: resolvedOpts.caseSensitive,
        }),
      ),
  );
  return res;
}

export { defaults, pull, version };
