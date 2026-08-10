import { match } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

export interface Opts {
  arrayVsArrayAllMustBeFound: "any" | "all";
  caseSensitive: boolean;
}

const defaults: Opts = {
  arrayVsArrayAllMustBeFound: "any",
  caseSensitive: true,
};

/**
 * Like _.includes but with wildcards
 */
function includesWithGlob(
  input: string | string[],
  findThis: string | string[],
  opts?: Partial<Opts>,
): boolean {
  // maybe we can end quicker:
  if (!input.length || !findThis.length) {
    return false; // because nothing can be found in it
  }

  const resolvedOpts = { ...defaults, ...opts };

  const resolvedInput = typeof input === "string" ? [input] : Array.from(input);

  if (typeof findThis === "string") {
    return resolvedInput.some((val) =>
      match(val, findThis, { caseSensitiveMatch: resolvedOpts.caseSensitive }),
    );
  }
  // array then.
  if (resolvedOpts.arrayVsArrayAllMustBeFound === "any") {
    return findThis.some((stringToFindVal) =>
      resolvedInput.some((val) =>
        match(val, stringToFindVal, {
          caseSensitiveMatch: resolvedOpts.caseSensitive,
        }),
      ),
    );
  }
  return findThis.every((stringToFindVal) =>
    resolvedInput.some((val) =>
      match(val, stringToFindVal, {
        caseSensitiveMatch: resolvedOpts.caseSensitive,
      }),
    ),
  );
}

export { defaults, includesWithGlob, version };
