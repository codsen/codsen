/**
 * array-includes-with-glob
 * like _.includes but with wildcards
 * Version: 2.12.32
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-includes-with-glob
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.arrayIncludesWithGlob = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

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

  const matchOperatorsRegex = /[|\\{}()[\]^$+*?.-]/g;

  var escapeStringRegexp = string => {
    if (typeof string !== 'string') {
      throw new TypeError('Expected a string');
    }

    return string.replace(matchOperatorsRegex, '\\$&');
  };

  const regexpCache = new Map();

  function makeRegexp(pattern, options) {
    options = {
      caseSensitive: false,
      ...options
    };
    const cacheKey = pattern + JSON.stringify(options);

    if (regexpCache.has(cacheKey)) {
      return regexpCache.get(cacheKey);
    }

    const negated = pattern[0] === '!';

    if (negated) {
      pattern = pattern.slice(1);
    }

    pattern = escapeStringRegexp(pattern).replace(/\\\*/g, '.*');
    const regexp = new RegExp(`^${pattern}$`, options.caseSensitive ? '' : 'i');
    regexp.negated = negated;
    regexpCache.set(cacheKey, regexp);
    return regexp;
  }

  var matcher = (inputs, patterns, options) => {
    if (!(Array.isArray(inputs) && Array.isArray(patterns))) {
      throw new TypeError(`Expected two arrays, got ${typeof inputs} ${typeof patterns}`);
    }

    if (patterns.length === 0) {
      return inputs;
    }

    const firstNegated = patterns[0][0] === '!';
    patterns = patterns.map(pattern => makeRegexp(pattern, options));
    const result = [];

    for (const input of inputs) {
      // If first pattern is negated we include everything to match user expectation
      let matches = firstNegated;

      for (const pattern of patterns) {
        if (pattern.test(input)) {
          matches = !pattern.negated;
        }
      }

      if (matches) {
        result.push(input);
      }
    }

    return result;
  };

  var isMatch = (input, pattern, options) => {
    const inputArray = Array.isArray(input) ? input : [input];
    const patternArray = Array.isArray(pattern) ? pattern : [pattern];
    return inputArray.some(input => {
      return patternArray.every(pattern => {
        const regexp = makeRegexp(pattern, options);
        const matches = regexp.test(input);
        return regexp.negated ? !matches : matches;
      });
    });
  };
  matcher.isMatch = isMatch;

  var isArr = Array.isArray;

  function arrayIncludesWithGlob(originalInput, stringToFind, originalOpts) {
    // internal f()'s
    function existy(x) {
      return x != null;
    }

    function isStr(something) {
      return typeof something === "string";
    }

    var defaults = {
      arrayVsArrayAllMustBeFound: "any" // two options: 'any' or 'all'

    };
    var opts = Object.assign({}, defaults, originalOpts); // insurance

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
    } // maybe we can end prematurely:


    if (originalInput.length === 0) {
      return false; // because nothing can be found in it
    } // prevent any mutation + filter out undefined and null elements:


    var input = originalInput.filter(function (elem) {
      return existy(elem);
    }); // if array contained only null/undefined values, do a Dutch leave:

    if (input.length === 0) {
      return false;
    }

    if (isStr(stringToFind)) {
      return input.some(function (val) {
        return matcher.isMatch(val, stringToFind, {
          caseSensitive: true
        });
      });
    } // array then.


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

  return arrayIncludesWithGlob;

})));
