/**
 * array-group-str-omit-num-char
 * Groups array of strings by omitting number characters
 * Version: 4.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-group-str-omit-num-char/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var uniq = require('lodash.uniq');
var rangesApply = require('ranges-apply');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var uniq__default = /*#__PURE__*/_interopDefaultLegacy(uniq);

var version = "4.0.2";

var version$1 = version;
var defaults = {
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

  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts);

  var arr = opts.dedupePlease ? uniq__default['default'](originalArr) : Array.from(originalArr); // traverse the given array

  var compiledObj = {};

  for (var i = 0, len = arr.length; i < len; i++) { // compile an array of digit chunks, consisting of at least one digit
    // (will return null when there are no digits found):

    var digitChunks = arr[i].match(/\d+/gm);

    if (!digitChunks) {
      // if there were no digits, there's nothing to group, so this string goes
      // straight to output. Just check for duplicates.
      compiledObj[arr[i]] = {
        count: 1
      }; // notice above doesn't have "elementsWhichWeCanReplaceWithWildcards" key
    } else {
      (function () {
        // so there were numbers in that string...
        // first, prepare the reference version of this string with chunks of digits
        // replaced with the wildcard
        var wildcarded = arr[i].replace(/\d+/gm, opts.wildcard); // the plan is, in order to extract the pattern, we'll use
        // elementsWhichWeCanReplaceWithWildcards where we'll keep record of the
        // previous element's value. Once the value is different, we set it to Bool
        // "false", marking it for replacement with wildcard.

        if (Object.prototype.hasOwnProperty.call(compiledObj, wildcarded)) {
          // so entry already exists for this wildcarded pattern.
          // Let's check each digit chunk where it's not already set to false (submitted
          // for replacement with wildcards), is it different from previous string's
          // chunk at that position (there can be multiple chunks of digits).
          digitChunks.forEach(function (digitsChunkStr, i2) {

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
      })();
    }
  }
  var resObj = {};
  Object.keys(compiledObj).forEach(function (key) { // here were restore the values which were replaced with wildcards where
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

    var newKey = key; // if not all digit chunks are to be replaced, that is, compiledObj[key].elementsWhichWeCanReplaceWithWildcards
    // contains some constant values we harvested from the set:

    if (Array.isArray(compiledObj[key].elementsWhichWeCanReplaceWithWildcards) && compiledObj[key].elementsWhichWeCanReplaceWithWildcards.some(function (val) {
      return val !== false;
    })) { // we'll compile ranges array and replace all wildcards in one go using https://www.npmjs.com/package/ranges-apply

      var rangesArr = [];
      var nThIndex = 0;

      for (var z = 0; z < compiledObj[key].elementsWhichWeCanReplaceWithWildcards.length; z++) {
        nThIndex = newKey.indexOf("" + (opts.wildcard || ""), nThIndex + (opts.wildcard || "").length);

        if (compiledObj[key].elementsWhichWeCanReplaceWithWildcards[z] !== false) {
          rangesArr.push([nThIndex, nThIndex + (opts.wildcard || "").length, compiledObj[key].elementsWhichWeCanReplaceWithWildcards[z]]);
        }
      }

      newKey = rangesApply.rApply(newKey, rangesArr);
    }

    resObj[newKey] = compiledObj[key].count;
  });
  return resObj;
}

exports.groupStr = groupStr;
exports.version = version$1;
