/**
 * array-includes-with-glob
 * like _.includes but with wildcards
 * Version: 2.12.30
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-includes-with-glob
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var matcher = _interopDefault(require('matcher'));

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
function arrayIncludesWithGlob(originalInput, stringToFind, originalOpts) {
  function existy(x) {
    return x != null;
  }
  function isStr(something) {
    return typeof something === "string";
  }
  var defaults = {
    arrayVsArrayAllMustBeFound: "any"
  };
  var opts = Object.assign({}, defaults, originalOpts);
  if (arguments.length === 0) {
    throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_01] all inputs missing!");
  }
  if (arguments.length === 1) {
    throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_02] second argument missing!");
  }
  if (!isArr(originalInput)) {
    if (isStr(originalInput)) {
      originalInput = [originalInput];
    } else {
      throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_03] first argument must be an array! It was given as ".concat(_typeof(originalInput)));
    }
  }
  if (!isStr(stringToFind) && !isArr(stringToFind)) {
    throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_04] second argument must be a string or array of strings! It was given as ".concat(_typeof(stringToFind)));
  }
  if (opts.arrayVsArrayAllMustBeFound !== "any" && opts.arrayVsArrayAllMustBeFound !== "all") {
    throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_05] opts.arrayVsArrayAllMustBeFound was customised to an unrecognised value, ".concat(opts.arrayVsArrayAllMustBeFound, ". It must be equal to either \"any\" or \"all\"."));
  }
  if (originalInput.length === 0) {
    return false;
  }
  var input = originalInput.filter(function (elem) {
    return existy(elem);
  });
  if (input.length === 0) {
    return false;
  }
  if (isStr(stringToFind)) {
    return input.some(function (val) {
      return matcher.isMatch(val, stringToFind, {
        caseSensitive: true
      });
    });
  }
  if (opts.arrayVsArrayAllMustBeFound === "any") {
    return stringToFind.some(function (stringToFindVal) {
      return input.some(function (val) {
        return matcher.isMatch(val, stringToFindVal, {
          caseSensitive: true
        });
      });
    });
  }
  return stringToFind.every(function (stringToFindVal) {
    return input.some(function (val) {
      return matcher.isMatch(val, stringToFindVal, {
        caseSensitive: true
      });
    });
  });
}

module.exports = arrayIncludesWithGlob;
