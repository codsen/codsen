/**
 * array-group-str-omit-num-char
 * Groups array of strings by omitting number characters
 * Version: 2.1.25
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-group-str-omit-num-char
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var uniq = _interopDefault(require('lodash.uniq'));
var rangesApply = _interopDefault(require('ranges-apply'));

var isArr = Array.isArray;
function groupStr(originalArr, originalOpts) {
  if (!isArr(originalArr)) {
    return originalArr;
  } else if (!originalArr.length) {
    return {};
  }
  var opts;
  var defaults = {
    wildcard: "*",
    dedupePlease: true
  };
  if (originalOpts != null) {
    opts = Object.assign({}, defaults, originalOpts);
  } else {
    opts = Object.assign({}, defaults);
  }
  var arr;
  if (opts.dedupePlease) {
    arr = uniq(originalArr);
  } else {
    arr = Array.from(originalArr);
  }
  var len = arr.length;
  var compiledObj = {};
  for (var i = 0; i < len; i++) {
    var digitChunks = arr[i].match(/\d+/gm);
    if (!digitChunks) {
      compiledObj[arr[i]] = {
        count: 1
      };
    } else {
      (function () {
        var wildcarded = arr[i].replace(/\d+/gm, opts.wildcard);
        if (Object.prototype.hasOwnProperty.call(compiledObj, wildcarded)) {
          digitChunks.forEach(function (digitsChunkStr, i) {
            if (compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i] && digitsChunkStr !== compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i]) {
              compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i] = false;
            }
          });
          compiledObj[wildcarded].count++;
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
  Object.keys(compiledObj).forEach(function (key) {
    var newKey = key;
    if (isArr(compiledObj[key].elementsWhichWeCanReplaceWithWildcards) && compiledObj[key].elementsWhichWeCanReplaceWithWildcards.some(function (val) {
      return val !== false;
    })) {
      var rangesArr = [];
      var nThIndex = 0;
      for (var z = 0; z < compiledObj[key].elementsWhichWeCanReplaceWithWildcards.length; z++) {
        nThIndex = newKey.indexOf(opts.wildcard, nThIndex + opts.wildcard.length);
        if (compiledObj[key].elementsWhichWeCanReplaceWithWildcards[z] !== false) {
          rangesArr.push([nThIndex, nThIndex + opts.wildcard.length, compiledObj[key].elementsWhichWeCanReplaceWithWildcards[z]]);
        }
      }
      newKey = rangesApply(newKey, rangesArr);
    }
    resObj[newKey] = compiledObj[key].count;
  });
  return resObj;
}

module.exports = groupStr;
