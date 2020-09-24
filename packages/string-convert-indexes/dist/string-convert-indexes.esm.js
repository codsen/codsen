/**
 * string-convert-indexes
 * Convert between native JS string character indexes and grapheme-count-based indexes
 * Version: 2.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-convert-indexes/
 */

import traverse from 'ast-monkey-traverse';
import GraphemeSplitter from 'grapheme-splitter';

function strConvertIndexes(mode, str, indexes) {
  function isItOk(something) {
    if (
      !["string", "number"].includes(typeof something) ||
      (typeof something === "string" && !/^\d*$/.test(something)) ||
      (typeof something === "number" &&
        (!Number.isInteger(something) || something < 0))
    ) {
      return false;
    }
    return true;
  }
  function oneNativeToUnicode(graphemeStrArr, idx) {
    let currLowerIdx = 0;
    let currUpperIdx = 0;
    for (let i = 0, len = graphemeStrArr.length; i < len; i++) {
      currUpperIdx += graphemeStrArr[i].length;
      if (idx >= currLowerIdx && idx < currUpperIdx) {
        return i;
      }
      currLowerIdx += graphemeStrArr[i].length;
    }
    throw new Error(
      `string-convert-indexes: [THROW_ID_05] the "indexes" value, ${indexes}, is not covered by graphemes length!`
    );
  }
  function oneUnicodeToNative(graphemeStrArr, idx) {
    if (idx >= graphemeStrArr.length) {
      throw new Error(
        `string-convert-indexes: [THROW_ID_06] the index to convert, ${idx}, is not covered by graphemes length!`
      );
    }
    return graphemeStrArr.slice(0, idx).join("").length;
  }
  if (typeof str !== "string" || !str) {
    throw new TypeError(
      `string-convert-indexes: [THROW_ID_01] the first input argument, input string, must be a non-zero-length string! Currently it's: ${typeof str}, equal to:\n${str}`
    );
  }
  if (indexes === 0) {
    return 0;
  }
  if (indexes === "0") {
    return "0";
  }
  const splitter = new GraphemeSplitter();
  const graphemeStrArr = splitter.splitGraphemes(str);
  if (["string", "number"].includes(typeof indexes)) {
    if (isItOk(indexes)) {
      if (mode === "u") {
        return typeof indexes === "string"
          ? String(oneUnicodeToNative(graphemeStrArr, +indexes))
          : oneUnicodeToNative(graphemeStrArr, +indexes);
      }
      return typeof indexes === "string"
        ? String(oneNativeToUnicode(graphemeStrArr, +indexes))
        : oneNativeToUnicode(graphemeStrArr, +indexes);
    }
    throw new Error(
      `string-convert-indexes: [THROW_ID_02] the second input argument, "indexes" is not suitable to describe string index - it was given as ${JSON.stringify(
        indexes,
        null,
        4
      )} (${typeof indexes})`
    );
  } else if (indexes && typeof indexes === "object") {
    return mode === "u"
      ? traverse(indexes, (key, val, innerObj) => {
          const current = val !== undefined ? val : key;
          if (["string", "number"].includes(typeof current)) {
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
          return current;
        })
      : traverse(indexes, (key, val, innerObj) => {
          const current = val !== undefined ? val : key;
          if (["string", "number"].includes(typeof current)) {
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
          return current;
        });
  } else {
    throw new Error(
      `string-convert-indexes: [THROW_ID_07] the first input argument, a source string should be a string but it was given as ${str}, type ${typeof str}`
    );
  }
}
function nativeToUnicode(str, indexes) {
  return strConvertIndexes("n", str, indexes);
}
function unicodeToNative(str, indexes) {
  return strConvertIndexes("u", str, indexes);
}

export { nativeToUnicode, unicodeToNative };
