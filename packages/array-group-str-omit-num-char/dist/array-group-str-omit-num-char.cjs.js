/**
 * array-group-str-omit-num-char
 * Groups array of strings by omitting number characters
 * Version: 2.1.39
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-group-str-omit-num-char
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var uniq = _interopDefault(require('lodash.uniq'));
var rangesApply = _interopDefault(require('ranges-apply'));

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var isArr = Array.isArray;
function groupStr(originalArr, originalOpts) {
  if (!isArr(originalArr)) {
    return originalArr;
  }
  if (!originalArr.length) {
    return {};
  }
  var opts;
  var defaults = {
    wildcard: "*",
    dedupePlease: true
  };
  if (originalOpts != null) {
    opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
  } else {
    opts = _objectSpread2({}, defaults);
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
          digitChunks.forEach(function (digitsChunkStr, i2) {
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
