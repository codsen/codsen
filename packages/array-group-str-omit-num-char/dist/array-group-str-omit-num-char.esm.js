/**
 * array-group-str-omit-num-char
 * Groups array of strings by omitting number characters
 * Version: 4.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-group-str-omit-num-char/
 */

import uniq from 'lodash.uniq';
import { rApply } from 'ranges-apply';

var version$1 = "4.0.11";

const version = version$1;
const defaults = {
  wildcard: "*",
  dedupePlease: true
};
function groupStr(originalArr, originalOpts) {
  if (!Array.isArray(originalArr)) {
    return originalArr;
  }
  if (!originalArr.length) {
    return {};
  }
  const opts = { ...defaults,
    ...originalOpts
  };
  const arr = opts.dedupePlease ? uniq(originalArr) : Array.from(originalArr);
  const compiledObj = {};
  for (let i = 0, len = arr.length; i < len; i++) {
    const digitChunks = arr[i].match(/\d+/gm);
    if (!digitChunks) {
      compiledObj[arr[i]] = {
        count: 1
      };
    } else {
      const wildcarded = arr[i].replace(/\d+/gm, opts.wildcard);
      if (Object.prototype.hasOwnProperty.call(compiledObj, wildcarded)) {
        digitChunks.forEach((digitsChunkStr, i2) => {
          if (compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i2] && digitsChunkStr !== compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i2]) {
            compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i2] = false;
          }
        });
        compiledObj[wildcarded].count += 1;
      } else {
        compiledObj[wildcarded] = {
          count: 1,
          elementsWhichWeCanReplaceWithWildcards: Array.from(digitChunks)
        };
      }
    }
  }
  const resObj = {};
  Object.keys(compiledObj).forEach(key => {
    let newKey = key;
    if (Array.isArray(compiledObj[key].elementsWhichWeCanReplaceWithWildcards) && compiledObj[key].elementsWhichWeCanReplaceWithWildcards.some(val => val !== false)) {
      const rangesArr = [];
      let nThIndex = 0;
      for (let z = 0; z < compiledObj[key].elementsWhichWeCanReplaceWithWildcards.length; z++) {
        nThIndex = newKey.indexOf(`${opts.wildcard || ""}`, nThIndex + (opts.wildcard || "").length);
        if (compiledObj[key].elementsWhichWeCanReplaceWithWildcards[z] !== false) {
          rangesArr.push([nThIndex, nThIndex + (opts.wildcard || "").length, compiledObj[key].elementsWhichWeCanReplaceWithWildcards[z]]);
        }
      }
      newKey = rApply(newKey, rangesArr);
    }
    resObj[newKey] = compiledObj[key].count;
  });
  return resObj;
}

export { groupStr, version };
