'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint no-param-reassign:0 */

var matcher = require('matcher');

var isArr = Array.isArray;

function arrayIncludesWithGlob(originalInput, stringToFind, originalOpts) {
  //
  // internal f()'s
  function existy(x) {
    return x != null;
  }
  function isStr(something) {
    return typeof something === 'string';
  }

  var defaults = {
    arrayVsArrayAllMustBeFound: 'any' // two options: 'any' or 'all'
  };

  var opts = Object.assign({}, defaults, originalOpts);

  // insurance
  if (arguments.length === 0) {
    throw new Error('array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_01] all inputs missing!');
  }
  if (arguments.length === 1) {
    throw new Error('array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_02] second argument missing!');
  }
  if (!isArr(originalInput)) {
    if (isStr(originalInput)) {
      originalInput = [originalInput];
    } else {
      throw new Error('array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_03] first argument must be an array! It was given as ' + (typeof originalInput === 'undefined' ? 'undefined' : _typeof(originalInput)));
    }
  }
  if (!isStr(stringToFind) && !isArr(stringToFind)) {
    throw new Error('array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_04] second argument must be a string or array of strings! It was given as ' + (typeof stringToFind === 'undefined' ? 'undefined' : _typeof(stringToFind)));
  }
  if (opts.arrayVsArrayAllMustBeFound !== 'any' && opts.arrayVsArrayAllMustBeFound !== 'all') {
    throw new Error('array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_05] opts.arrayVsArrayAllMustBeFound was customised to an unrecognised value, ' + opts.arrayVsArrayAllMustBeFound + '. It must be equal to either "any" or "all".');
  }

  // maybe we can end prematurely:
  if (originalInput.length === 0) {
    return false; // because nothing can be found in it
  }

  // prevent any mutation + filter out undefined and null elements:
  var input = originalInput.filter(function (elem) {
    return existy(elem);
  });

  // if array contained only null/undefined values, do a Dutch leave:
  if (input.length === 0) {
    return false;
  }

  if (isStr(stringToFind)) {
    return input.some(function (val) {
      return matcher.isMatch(val, stringToFind);
    });
  }
  // array then.
  if (opts.arrayVsArrayAllMustBeFound === 'any') {
    return stringToFind.some(function (stringToFindVal) {
      return input.some(function (val) {
        return matcher.isMatch(val, stringToFindVal);
      });
    });
  }
  return stringToFind.every(function (stringToFindVal) {
    return input.some(function (val) {
      return matcher.isMatch(val, stringToFindVal);
    });
  });
}

module.exports = arrayIncludesWithGlob;
