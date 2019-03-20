/**
 * array-group-str-omit-num-char
 * Groups array of strings by omitting number characters
 * Version: 2.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-group-str-omit-num-char
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var checkTypes = _interopDefault(require('check-types-mini'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var uniq = _interopDefault(require('lodash.uniq'));
var rangesApply = _interopDefault(require('ranges-apply'));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var isArr = Array.isArray;
function groupStr(originalArr, originalOpts) {
  if (!isArr(originalArr)) {
    throw new Error("array-group-str-omit-num-char: [THROW_ID_01] the first input argument must be an array!");
  }
  var opts;
  var defaults = {
    wildcard: "*",
    dedupePlease: true
  };
  if (originalOpts != null) {
    if (!isObj(originalOpts)) {
      throw new Error("array-group-str-omit-num-char: [THROW_ID_02] the second input argument, options object must be a plain object! It was given as ".concat(_typeof(originalOpts), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
    } else {
      opts = Object.assign({}, defaults, originalOpts);
      checkTypes(opts, defaults, {
        msg: "array-group-str-omit-num-char: [THROW_ID_03*]"
      });
    }
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
        if (compiledObj.hasOwnProperty(wildcarded)) {
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
