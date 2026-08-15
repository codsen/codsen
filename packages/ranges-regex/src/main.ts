import { formatDiagnosticValue } from "codsen-utils";
import { isRegExp } from "lodash-es";
import type { Range, Ranges } from "ranges-merge";
import { rMerge } from "ranges-merge";

import { version as v } from "../package.json";

const version: string = v;

function advanceStringIndex(
  str: string,
  index: number,
  unicode: boolean,
): number {
  if (unicode) {
    const first = str.charCodeAt(index);
    if (first >= 0xd800 && first <= 0xdbff) {
      const second = str.charCodeAt(index + 1);
      if (second >= 0xdc00 && second <= 0xdfff) {
        return index + 2;
      }
    }
  }
  return index + 1;
}

function rRegex(
  regExp: RegExp,
  str: string,
  replacement?: string | null | undefined,
): Ranges {
  // given regex validation
  if (regExp === undefined) {
    throw new TypeError(
      `ranges-regex/rRegex(): [THROW_ID_01] The first input's argument must be a regex object! Currently it is missing!`,
    );
  } else if (!isRegExp(regExp)) {
    throw new TypeError(
      `ranges-regex/rRegex(): [THROW_ID_02] The first input's argument must be a regex object! Currently its type is: ${typeof regExp}, equal to: ${formatDiagnosticValue(regExp, 4)}`,
    );
  }
  // str validation
  if (typeof str !== "string") {
    throw new TypeError(
      `ranges-regex/rRegex(): [THROW_ID_03] The second input's argument must be a string! Currently its type is: ${typeof str}, equal to: ${formatDiagnosticValue(str, 4)}`,
    );
  }
  // replacement validation
  if (replacement != null && typeof replacement !== "string") {
    throw new TypeError(
      `ranges-regex/rRegex(): [THROW_ID_04] The third input's argument must be a string or null! Currently its type is: ${typeof replacement}, equal to: ${formatDiagnosticValue(replacement, 4)}`,
    );
  }
  // A non-global RegExp does not advance lastIndex, so an all-matches loop
  // would repeat the first match forever.
  if (!regExp.global) {
    throw new TypeError(
      `ranges-regex/rRegex(): [THROW_ID_05] The first input's regex must have the global ("g") flag! Currently its flags are: "${regExp.flags}".`,
    );
  }
  // if an empty string was given, return an empty (ranges) array:
  if (!str.length) {
    return null;
  }

  //                       finally, the real action
  // ---------------------------------------------------------------------------

  let tempArr;
  let unicodeMode: boolean | null = null;

  let resRange: Range[] = [];
  if (
    replacement === null ||
    (typeof replacement === "string" && replacement.length)
  ) {
    for (tempArr = regExp.exec(str); tempArr; tempArr = regExp.exec(str)) {
      const matchLength = tempArr[0].length;
      resRange.push([
        regExp.lastIndex - matchLength,
        regExp.lastIndex,
        replacement,
      ]);
      if (!matchLength) {
        if (unicodeMode === null) {
          unicodeMode = Boolean(regExp.unicode || regExp.unicodeSets);
        }
        regExp.lastIndex = advanceStringIndex(
          str,
          regExp.lastIndex,
          unicodeMode,
        );
      }
    }
  } else {
    for (tempArr = regExp.exec(str); tempArr; tempArr = regExp.exec(str)) {
      const matchLength = tempArr[0].length;
      if (matchLength) {
        resRange.push([regExp.lastIndex - matchLength, regExp.lastIndex]);
      } else {
        if (unicodeMode === null) {
          unicodeMode = Boolean(regExp.unicode || regExp.unicodeSets);
        }
        regExp.lastIndex = advanceStringIndex(
          str,
          regExp.lastIndex,
          unicodeMode,
        );
      }
    }
  }

  if (resRange.length) {
    return rMerge(resRange);
  }
  return null;
}

export { rRegex, version };
