import { isMatch } from "matcher";

import { version as v } from "../package.json";

const version: string = v;

interface Opts {
  arrayVsArrayAllMustBeFound?: "any" | "all";
  caseSensitive?: boolean;
}

const defaults: Opts = {
  arrayVsArrayAllMustBeFound: "any", // two options: 'any' or 'all'
  caseSensitive: true,
};

/**
 * Like _.includes but with wildcards
 */
function includesWithGlob(
  originalInput: string | string[],
  stringToFind: string | string[],
  originalOpts?: Opts
): boolean {
  // maybe we can end prematurely:
  if (!originalInput.length || !stringToFind.length) {
    return false; // because nothing can be found in it
  }

  let opts = { ...defaults, ...originalOpts };

  let input =
    typeof originalInput === "string"
      ? [originalInput]
      : Array.from(originalInput);

  if (typeof stringToFind === "string") {
    return input.some((val) =>
      isMatch(val, stringToFind, { caseSensitive: opts.caseSensitive })
    );
  }
  // array then.
  if (opts.arrayVsArrayAllMustBeFound === "any") {
    return stringToFind.some((stringToFindVal) =>
      input.some((val) =>
        isMatch(val, stringToFindVal, {
          caseSensitive: opts.caseSensitive,
        })
      )
    );
  }
  return stringToFind.every((stringToFindVal) =>
    input.some((val) =>
      isMatch(val, stringToFindVal, {
        caseSensitive: opts.caseSensitive,
      })
    )
  );
}

export { includesWithGlob, defaults, version };
