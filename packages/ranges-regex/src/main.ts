import { rMerge } from "ranges-merge";
import { isRegExp } from "lodash-es";

import type { Range, Ranges } from "ranges-merge";

import { version as v } from "../package.json";

const version: string = v;

function rRegex(
  regExp: RegExp,
  str: string,
  replacement?: string | null | undefined,
): Ranges {
  // given regx validation
  if (regExp === undefined) {
    throw new TypeError(
      `ranges-regex: [THROW_ID_01] The first input's argument must be a regex object! Currently it is missing!`,
    );
  } else if (!isRegExp(regExp)) {
    throw new TypeError(
      `ranges-regex: [THROW_ID_02] The first input's argument must be a regex object! Currently its type is: ${typeof regExp}, equal to: ${JSON.stringify(
        regExp,
        null,
        4,
      )}`,
    );
  }
  // str validation
  if (typeof str !== "string") {
    throw new TypeError(
      `ranges-regex: [THROW_ID_03] The second input's argument must be a string! Currently its type is: ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        4,
      )}`,
    );
  }
  // replacement validation
  if (replacement && typeof replacement !== "string") {
    throw new TypeError(
      `ranges-regex: [THROW_ID_04] The third input's argument must be a string or null! Currently its type is: ${typeof replacement}, equal to: ${JSON.stringify(
        replacement,
        null,
        4,
      )}`,
    );
  }
  // if an empty string was given, return an empty (ranges) array:
  if (!str.length) {
    return null;
  }

  //                       finally, the real action
  // ---------------------------------------------------------------------------

  let tempArr;

  let resRange: Range[] = [];
  if (
    replacement === null ||
    (typeof replacement === "string" && replacement.length)
  ) {
    while ((tempArr = regExp.exec(str)) !== null) {
      resRange.push([
        regExp.lastIndex - tempArr[0].length,
        regExp.lastIndex,
        replacement,
      ]);
    }
  } else {
    while ((tempArr = regExp.exec(str)) !== null) {
      resRange.push([regExp.lastIndex - tempArr[0].length, regExp.lastIndex]);
    }
  }

  if (resRange.length) {
    return rMerge(resRange);
  }
  return null;
}

export { rRegex, version };
