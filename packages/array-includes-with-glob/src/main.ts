import matcher from "matcher";
import { version } from "../package.json";

interface Opts {
  arrayVsArrayAllMustBeFound?: "any" | "all";
  caseSensitive?: boolean;
}

const defaults: Opts = {
  arrayVsArrayAllMustBeFound: "any", // two options: 'any' or 'all'
  caseSensitive: true,
};

function includesWithGlob(
  originalInput: string | string[],
  stringToFind: string | string[],
  originalOpts?: Opts
): boolean {
  // maybe we can end prematurely:
  if (!originalInput.length || !stringToFind.length) {
    return false; // because nothing can be found in it
  }

  const opts = { ...defaults, ...originalOpts };

  const input =
    typeof originalInput === "string"
      ? [originalInput]
      : Array.from(originalInput);

  if (typeof stringToFind === "string") {
    return input.some((val) =>
      matcher.isMatch(val, stringToFind, { caseSensitive: opts.caseSensitive })
    );
  }
  // array then.
  if (opts.arrayVsArrayAllMustBeFound === "any") {
    return stringToFind.some((stringToFindVal) =>
      input.some((val) =>
        matcher.isMatch(val, stringToFindVal, {
          caseSensitive: opts.caseSensitive,
        })
      )
    );
  }
  return stringToFind.every((stringToFindVal) =>
    input.some((val) =>
      matcher.isMatch(val, stringToFindVal, {
        caseSensitive: opts.caseSensitive,
      })
    )
  );
}

export { includesWithGlob, defaults, version };
