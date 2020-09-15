/**
 * string-convert-indexes
 * Convert string character indexes from JS native index-based to Unicode character-count-based and backwards.
 * Version: 1.10.18
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-convert-indexes/
 */

import { traverse, set } from 'ast-monkey';

function isStr(something) {
  return typeof something === "string";
}
function mandatory(i) {
  throw new Error(
    `string-convert-indexes: [THROW_ID_01*] Missing ${i}th parameter!`
  );
}
function prep(something) {
  if (typeof something === "string") {
    return parseInt(something, 10);
  }
  return something;
}
function customSort(arr) {
  return arr.sort((a, b) => {
    if (prep(a.val) < prep(b.val)) {
      return -1;
    }
    if (prep(a.val) > prep(b.val)) {
      return 1;
    }
    return 0;
  });
}
function strConvertIndexes(mode, str, indexes, originalOpts) {
  if (!isStr(str) || str.length === 0) {
    throw new TypeError(
      `string-convert-indexes: [THROW_ID_02] the first input argument, input string, must be a non-zero-length string! Currently it's: ${typeof str}, equal to:\n${str}`
    );
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new TypeError(
      `string-convert-indexes: [THROW_ID_03] the third input argument, Optional Options Object, must be a plain object! Currently it's: ${typeof originalOpts}, equal to:\n${originalOpts}`
    );
  }
  const defaults = {
    throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: true,
  };
  const opts = { ...defaults, ...originalOpts };
  const data = { id: 0 };
  let toDoList = [];
  if ((Number.isInteger(indexes) && indexes >= 0) || /^\d*$/.test(indexes)) {
    toDoList = [
      {
        id: 1,
        val: indexes,
      },
    ];
  } else {
    indexes = traverse(indexes, (key, val) => {
      data.id += 1;
      data.val = val !== undefined ? val : key;
      if (
        (Number.isInteger(data.val) && data.val >= 0) ||
        /^\d*$/.test(data.val)
      ) {
        toDoList.push({ ...data });
      }
      return data.val;
    });
  }
  if (toDoList.length === 0) {
    return indexes;
  }
  toDoList = customSort(toDoList);
  let unicodeIndex = -1;
  let surrogateDetected = false;
  for (let i = 0, len = str.length; i <= len; i++) {
    if (str[i] === undefined) {
      unicodeIndex += 1;
    } else if (str[i].charCodeAt(0) >= 55296 && str[i].charCodeAt(0) <= 57343) {
      if (surrogateDetected !== true) {
        unicodeIndex += 1;
        surrogateDetected = true;
      } else {
        surrogateDetected = false;
      }
    } else {
      unicodeIndex += 1;
      if (surrogateDetected === true) {
        surrogateDetected = false;
      }
    }
    if (mode === "n") {
      for (let y = 0, leny = toDoList.length; y < leny; y++) {
        if (prep(toDoList[y].val) === i) {
          toDoList[y].res = isStr(toDoList[y].val)
            ? String(unicodeIndex)
            : unicodeIndex;
        } else if (prep(toDoList[y].val) > i) {
          break;
        }
      }
    } else {
      for (let y = 0, leny = toDoList.length; y < leny; y++) {
        if (
          prep(toDoList[y].val) === unicodeIndex &&
          toDoList[y].res === undefined
        ) {
          toDoList[y].res = isStr(toDoList[y].val) ? String(i) : i;
        } else if (prep(toDoList[y].val) > unicodeIndex) {
          break;
        }
      }
    }
    if (
      opts.throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString &&
      i === len - 1 &&
      ((mode === "n" && prep(toDoList[toDoList.length - 1].val) > len) ||
        (mode === "u" &&
          prep(toDoList[toDoList.length - 1].val) > unicodeIndex + 1))
    ) {
      if (mode === "n") {
        throw new Error(
          `string-convert-indexes: [THROW_ID_05] the reference string has native JS string indexes going only upto ${i}, but you are trying to convert an index larger than that, ${prep(
            toDoList[toDoList.length - 1].val
          )}`
        );
      } else {
        throw new Error(
          `string-convert-indexes: [THROW_ID_06] the reference string has Unicode character count going only upto ${unicodeIndex}, but you are trying to convert an index larger than that, ${prep(
            toDoList[toDoList.length - 1].val
          )}`
        );
      }
    }
  }
  if ((Number.isInteger(indexes) && indexes >= 0) || /^\d*$/.test(indexes)) {
    return toDoList[0].res !== undefined ? toDoList[0].res : toDoList[0].val;
  }
  let res = Array.from(indexes);
  for (let z = toDoList.length; z--; ) {
    res = set(res, {
      index: toDoList[z].id,
      val: toDoList[z].res !== undefined ? toDoList[z].res : toDoList[z].val,
    });
  }
  return res;
}
function nativeToUnicode(str = mandatory(1), indexes = mandatory(2), opts) {
  return strConvertIndexes("n", str, indexes, opts);
}
function unicodeToNative(str = mandatory(1), indexes = mandatory(2), opts) {
  return strConvertIndexes("u", str, indexes, opts);
}

export { nativeToUnicode, unicodeToNative };
