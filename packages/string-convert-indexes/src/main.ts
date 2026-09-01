import { formatDiagnosticValue } from "codsen-utils";

/*!
 * unicode-segmenter
 * MIT License
 * Copyright (c) 2024 Hyeseong Kim <hey@hyeseong.kim>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { collectGraphemes } from "unicode-segmenter/grapheme";
/* eslint @typescript-eslint/explicit-module-boundary-types:0 */

import { traverse } from "ast-monkey-traverse";

import { version as v } from "../package.json";

const version: string = v;
const graphemeSegmenter =
  typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : undefined;

declare let DEV: boolean;

function isStringOrNumber(value: unknown): value is string | number {
  const valueType = typeof value;
  return valueType === "string" || valueType === "number";
}

// inner function, common for both external API's methods that does the job:
function strConvertIndexes(mode: "n" | "u", str: string, indexes: any): any {
  const functionName = mode === "n" ? "nativeToUnicode" : "unicodeToNative";

  function isItOk(something: any): boolean {
    if (
      !isStringOrNumber(something) ||
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
          `#${i} - [${currLowerIdx}, ${currUpperIdx}] - char ${
            graphemeStrArr[i]
          } (${graphemeStrArr[i].split("").length})`,
        );
      if (idx >= currLowerIdx && idx < currUpperIdx) {
        return i;
      }

      // in the end, bump lower
      currLowerIdx += graphemeStrArr[i].length;
    }

    // if end is reached, it's an error
    throw new Error(
      `string-convert-indexes/${functionName}(): [THROW_ID_01] the "indexes" value, ${indexes}, is not covered by graphemes length!`,
    );
  }

  function oneUnicodeToNative(graphemeStrArr: string[], idx: number): number {
    if (idx >= graphemeStrArr.length) {
      throw new Error(
        `string-convert-indexes/${functionName}(): [THROW_ID_02] the index to convert, ${idx}, is not covered by graphemes length!`,
      );
    }
    return graphemeStrArr.slice(0, idx).join("").length;
  }

  //
  // insurance
  // ---------
  if (typeof str !== "string" || !str) {
    throw new TypeError(
      `string-convert-indexes/${functionName}(): [THROW_ID_03] the first input argument, input string, must be a non-zero-length string! Currently it's: ${typeof str}, equal to:\n${str}`,
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

  const graphemeStrArr = graphemeSegmenter
    ? Array.from(graphemeSegmenter.segment(str), ({ segment }) => segment)
    : collectGraphemes(str);

  // easy - index will be the total count of all native JS index characters
  // leading up to this

  if (isStringOrNumber(indexes)) {
    DEV && console.log(`██ no AST`);
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
      `string-convert-indexes/${functionName}(): [THROW_ID_04] the second input argument, "indexes" is not suitable to describe string index - it was given as ${formatDiagnosticValue(indexes, 4)} (${typeof indexes})`,
    );
  } else if (indexes && typeof indexes === "object") {
    DEV && console.log(`██ AST - traverse!`);
    // if it's array or object, traverse
    return mode === "u"
      ? traverse(indexes, (key, val, innerObj) => {
          let current = innerObj.parentType === "object" ? val : key;
          if (isStringOrNumber(current)) {
            // process it then
            if (isItOk(current)) {
              return typeof current === "string"
                ? String(oneUnicodeToNative(graphemeStrArr, +current))
                : oneUnicodeToNative(graphemeStrArr, +current);
            }
            throw new Error(
              `string-convert-indexes/${functionName}(): [THROW_ID_05] bad value was encountered, ${formatDiagnosticValue(current, 4)}, its path is ${innerObj.path}`,
            );
          }
          // else - return as is
          return current;
        })
      : traverse(indexes, (key, val, innerObj) => {
          let current = innerObj.parentType === "object" ? val : key;
          if (isStringOrNumber(current)) {
            // process it then
            if (isItOk(current)) {
              return typeof current === "string"
                ? String(oneNativeToUnicode(graphemeStrArr, +current))
                : oneNativeToUnicode(graphemeStrArr, +current);
            }
            throw new Error(
              `string-convert-indexes/${functionName}(): [THROW_ID_06] bad value was encountered, ${formatDiagnosticValue(current, 4)}, its path is ${innerObj.path}`,
            );
          }
          // else - return as is
          return current;
        });
  } else {
    throw new Error(
      `string-convert-indexes/${functionName}(): [THROW_ID_07] the first input argument, a source string should be a string but it was given as ${str}, type ${typeof str}`,
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
