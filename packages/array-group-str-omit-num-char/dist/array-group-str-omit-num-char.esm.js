/**
 * array-group-str-omit-num-char
 * Groups array of strings by omitting number characters
 * Version: 4.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-group-str-omit-num-char/
 */

import uniq from 'lodash.uniq';
import { rApply } from 'ranges-apply';

var version = "4.0.5";

const version$1 = version;
const defaults = {
  wildcard: "*",
  dedupePlease: true
};
/**
 * Groups array of strings by omitting number characters
 */

function groupStr(originalArr, originalOpts) {
  if (!Array.isArray(originalArr)) {
    return originalArr;
  }

  if (!originalArr.length) {
    // quick ending
    return {};
  }

  const opts = { ...defaults,
    ...originalOpts
  };
  const arr = opts.dedupePlease ? uniq(originalArr) : Array.from(originalArr); // traverse the given array

  const compiledObj = {};

  for (let i = 0, len = arr.length; i < len; i++) { // compile an array of digit chunks, consisting of at least one digit
    // (will return null when there are no digits found):

    const digitChunks = arr[i].match(/\d+/gm);

    if (!digitChunks) {
      // if there were no digits, there's nothing to group, so this string goes
      // straight to output. Just check for duplicates.
      compiledObj[arr[i]] = {
        count: 1
      }; // notice above doesn't have "elementsWhichWeCanReplaceWithWildcards" key
    } else {
      // so there were numbers in that string...
      // first, prepare the reference version of this string with chunks of digits
      // replaced with the wildcard
      const wildcarded = arr[i].replace(/\d+/gm, opts.wildcard); // the plan is, in order to extract the pattern, we'll use
      // elementsWhichWeCanReplaceWithWildcards where we'll keep record of the
      // previous element's value. Once the value is different, we set it to Bool
      // "false", marking it for replacement with wildcard.

      if (Object.prototype.hasOwnProperty.call(compiledObj, wildcarded)) {
        // so entry already exists for this wildcarded pattern.
        // Let's check each digit chunk where it's not already set to false (submitted
        // for replacement with wildcards), is it different from previous string's
        // chunk at that position (there can be multiple chunks of digits).
        digitChunks.forEach((digitsChunkStr, i2) => {

          if (compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i2] && digitsChunkStr !== compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i2]) {
            compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i2] = false;
          }
        }); // finally, bump the count:

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
  Object.keys(compiledObj).forEach(key => { // here were restore the values which were replaced with wildcards where
    // those values were identical across the whole set. That's the whole point
    // of this library.
    //
    // For example, you had three CSS class names:
    // [
    //    width425-margin1px,
    //    width425-margin2px
    //    width425-margin3px
    // ]
    //
    // We want them grouped into width425-margin*px, not width*-margin*px, because
    // 425 is constant.
    //

    let newKey = key; // if not all digit chunks are to be replaced, that is, compiledObj[key].elementsWhichWeCanReplaceWithWildcards
    // contains some constant values we harvested from the set:

    if (Array.isArray(compiledObj[key].elementsWhichWeCanReplaceWithWildcards) && compiledObj[key].elementsWhichWeCanReplaceWithWildcards.some(val => val !== false)) { // we'll compile ranges array and replace all wildcards in one go using https://www.npmjs.com/package/ranges-apply

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

export { groupStr, version$1 as version };
