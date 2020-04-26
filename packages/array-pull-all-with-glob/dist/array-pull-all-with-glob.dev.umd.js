/**
 * array-pull-all-with-glob
 * pullAllWithGlob - like _.pullAll but pulling stronger, with globs
 * Version: 4.12.64
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-pull-all-with-glob
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.arrayPullAllWithGlob = factory());
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

  function pullAllWithGlob(originalInput, originalToBeRemoved, originalOpts) {
    function isStr(something) {
      return typeof something === "string";
    } // insurance


    if (!Array.isArray(originalInput)) {
      throw new Error("array-pull-all-with-glob: [THROW_ID_01] first argument must be an array! Currently it's ".concat(_typeof(originalInput), ", equal to: ").concat(JSON.stringify(originalInput, null, 4)));
    } else if (!originalInput.length) {
      return [];
    }

    if (originalToBeRemoved == null) {
      // deliberate ==
      throw new Error("array-pull-all-with-glob: [THROW_ID_02] second argument is missing!");
    }

    var toBeRemoved;

    if (typeof originalToBeRemoved === "string") {
      if (originalToBeRemoved.length === 0) {
        return originalInput;
      }

      toBeRemoved = [originalToBeRemoved];
    } else if (Array.isArray(originalToBeRemoved)) {
      if (originalToBeRemoved.length === 0) {
        return originalInput;
      }

      toBeRemoved = Array.from(originalToBeRemoved);
    } else if (!Array.isArray(originalToBeRemoved)) {
      throw new Error("array-pull-all-with-glob: [THROW_ID_04] first argument must be an array! Currently it's ".concat(_typeof(originalToBeRemoved), ", equal to: ").concat(JSON.stringify(originalToBeRemoved, null, 4)));
    }

    if (originalInput.length === 0 || originalToBeRemoved.length === 0) {
      return originalInput;
    }

    if (!originalInput.every(function (el) {
      return isStr(el);
    })) {
      throw new Error("array-pull-all-with-glob: [THROW_ID_05] first argument array contains non-string elements: ".concat(JSON.stringify(originalInput, null, 4)));
    }

    if (!toBeRemoved.every(function (el) {
      return isStr(el);
    })) {
      throw new Error("array-pull-all-with-glob: [THROW_ID_06] first argument array contains non-string elements: ".concat(JSON.stringify(toBeRemoved, null, 4)));
    }

    if (originalOpts && (Array.isArray(originalOpts) || _typeof(originalOpts) !== "object")) {
      throw new Error("array-pull-all-with-glob: [THROW_ID_07] third argument, options object is not a plain object but ".concat(Array.isArray(originalOpts) ? "array" : _typeof(originalOpts)));
    }

    var opts;
    var defaults = {
      caseSensitive: true
    };

    if (originalOpts === null) {
      opts = _objectSpread2({}, defaults);
    } else {
      opts = _objectSpread2({}, defaults, {}, originalOpts);
    }

    return Array.from(originalInput).filter(function (originalVal) {
      return !toBeRemoved.some(function (remVal) {
        return matcher.isMatch(originalVal, remVal, {
          caseSensitive: opts.caseSensitive
        });
      });
    });
  }

  return pullAllWithGlob;

})));
