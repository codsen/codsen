import { isMatch } from "matcher";

// it's a copy of array-includes-with-glob 3.1.0, to prevent circular deps

interface Opts {
  arrayVsArrayAllMustBeFound: "any" | "all";
  caseSensitive: boolean;
}

const defaults: Opts = {
  arrayVsArrayAllMustBeFound: "any", // two options: 'any' or 'all'
  caseSensitive: true,
};

/**
 * Like _.includes but with wildcards
 */
function includesWithGlob(
  input: string | string[],
  stringToFind: string | string[],
  opts?: Partial<Opts>
): boolean {
  // maybe we can end prematurely:
  if (!input.length || !stringToFind.length) {
    return false; // because nothing can be found in it
  }

  let resolvedOpts = { ...defaults, ...opts };

  let resolvedInput = typeof input === "string" ? [input] : Array.from(input);

  if (typeof stringToFind === "string") {
    return resolvedInput.some((val) =>
      isMatch(val, stringToFind, { caseSensitive: resolvedOpts.caseSensitive })
    );
  }
  // array then.
  if (resolvedOpts.arrayVsArrayAllMustBeFound === "any") {
    return stringToFind.some((stringToFindVal) =>
      resolvedInput.some((val) =>
        isMatch(val, stringToFindVal, {
          caseSensitive: resolvedOpts.caseSensitive,
        })
      )
    );
  }
  return stringToFind.every((stringToFindVal) =>
    resolvedInput.some((val) =>
      isMatch(val, stringToFindVal, {
        caseSensitive: resolvedOpts.caseSensitive,
      })
    )
  );
}

export { includesWithGlob, defaults };
