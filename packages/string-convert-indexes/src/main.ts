/* eslint @typescript-eslint/explicit-module-boundary-types:0 */

import { traverse } from "ast-monkey-traverse";
import GraphemeSplitter from "grapheme-splitter";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

// inner function, common for both external API's methods that does the job:
function strConvertIndexes(
  mode: "n" | "u",
  str: string,
  indexes: any
): string | number {
  function isItOk(something: any): boolean {
    if (
      !["string", "number"].includes(typeof something) ||
      (typeof something === "string" && !/^\d*$/.test(something)) ||
      (typeof something === "number" &&
        (!Number.isInteger(something) || something < 0))
    ) {
      // we are not going to throw because it will be impossible to
      // report where exactly is the culprit if we did it here
      return false;
    }
    return true;
  }
  function oneNativeToUnicode(graphemeStrArr: string[], idx: number): number {
    // we count what is the range of indexes current grapheme covers,
    // then return if given index falls in-between
    let currLowerIdx = 0;
    let currUpperIdx = 0;
    for (let i = 0, len = graphemeStrArr.length; i < len; i++) {
      // to start, lower is the same
      currUpperIdx += graphemeStrArr[i].length;

      DEV &&
        console.log(
          `042 #${i} - [${currLowerIdx}, ${currUpperIdx}] - char ${
            graphemeStrArr[i]
          } (${graphemeStrArr[i].split("").length})`
        );
      if (idx >= currLowerIdx && idx < currUpperIdx) {
        return i;
      }

      // in the end, bump lower
      currLowerIdx += graphemeStrArr[i].length;
    }

    // if end is reached, it's an error
    throw new Error(
      `string-convert-indexes: [THROW_ID_05] the "indexes" value, ${indexes}, is not covered by graphemes length!`
    );
  }

  function oneUnicodeToNative(graphemeStrArr: string[], idx: number): number {
    if (idx >= graphemeStrArr.length) {
      throw new Error(
        `string-convert-indexes: [THROW_ID_06] the index to convert, ${idx}, is not covered by graphemes length!`
      );
    }
    return graphemeStrArr.slice(0, idx).join("").length;
  }

  //
  // insurance
  // ---------
  if (typeof str !== "string" || !str) {
    throw new TypeError(
      `string-convert-indexes: [THROW_ID_01] the first input argument, input string, must be a non-zero-length string! Currently it's: ${typeof str}, equal to:\n${str}`
    );
  }

  // ---------------------------------------------------------------------------

  // Quick ending
  if (indexes === 0) {
    return 0;
  }
  if (indexes === "0") {
    return "0";
  }

  // ---------------------------------------------------------------------------

  let splitter = new GraphemeSplitter();
  let graphemeStrArr = splitter.splitGraphemes(str);

  // easy - index will be the total count of all native JS index characters
  // leading up to this

  if (["string", "number"].includes(typeof indexes)) {
    DEV && console.log(`097 ██ no AST`);
    // no need for traversal
    // validate
    if (isItOk(indexes)) {
      DEV && console.log(`OK`);

      if (mode === "u") {
        return typeof indexes === "string"
          ? String(oneUnicodeToNative(graphemeStrArr, +indexes))
          : oneUnicodeToNative(graphemeStrArr, +indexes);
      }

      return typeof indexes === "string"
        ? String(oneNativeToUnicode(graphemeStrArr, +indexes))
        : oneNativeToUnicode(graphemeStrArr, +indexes);
    }
    // else - error - messy string or number
    throw new Error(
      `string-convert-indexes: [THROW_ID_02] the second input argument, "indexes" is not suitable to describe string index - it was given as ${JSON.stringify(
        indexes,
        null,
        4
      )} (${typeof indexes})`
    );
  } else if (indexes && typeof indexes === "object") {
    DEV && console.log(`122 ██ AST - traverse!`);
    // if it's array or object, traverse
    return mode === "u"
      ? traverse(indexes, (key, val, innerObj) => {
          let current = val !== undefined ? val : key;
          if (["string", "number"].includes(typeof current)) {
            // process it then
            if (isItOk(current)) {
              return typeof current === "string"
                ? String(oneUnicodeToNative(graphemeStrArr, +current))
                : oneUnicodeToNative(graphemeStrArr, +current);
            }
            throw new Error(
              `string-convert-indexes: [THROW_ID_03] bad value was encountered, ${JSON.stringify(
                current,
                null,
                4
              )}, its path is ${innerObj.path}`
            );
          }
          // else - return as is
          return current;
        })
      : traverse(indexes, (key, val, innerObj) => {
          let current = val !== undefined ? val : key;
          if (["string", "number"].includes(typeof current)) {
            // process it then
            if (isItOk(current)) {
              return typeof current === "string"
                ? String(oneNativeToUnicode(graphemeStrArr, +current))
                : oneNativeToUnicode(graphemeStrArr, +current);
            }
            throw new Error(
              `string-convert-indexes: [THROW_ID_04] bad value was encountered, ${JSON.stringify(
                current,
                null,
                4
              )}, its path is ${innerObj.path}`
            );
          }
          // else - return as is
          return current;
        });
  } else {
    throw new Error(
      `string-convert-indexes: [THROW_ID_07] the first input argument, a source string should be a string but it was given as ${str}, type ${typeof str}`
    );
  }
}

function nativeToUnicode(str: string, indexes: any): number | string {
  return strConvertIndexes("n", str, indexes);
}

function unicodeToNative(str: string, indexes: any): number | string {
  return strConvertIndexes("u", str, indexes);
}

export { nativeToUnicode, unicodeToNative, version };
