/**
 * array-pull-all-with-glob
 * Like _.pullAll but with globs (wildcards)
 * Version: 5.0.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-pull-all-with-glob/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.arrayPullAllWithGlob = {}));
}(this, (function (exports) { 'use strict';

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

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

var escapeStringRegexp = function escapeStringRegexp(string) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string');
  } // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a \unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.


  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
};

var regexpCache = new Map();

function sanitizeArray(input, inputName) {
  if (!Array.isArray(input)) {
    switch (typeof input) {
      case 'string':
        input = [input];
        break;

      case 'undefined':
        input = [];
        break;

      default:
        throw new TypeError("Expected '" + inputName + "' to be a string or an array, but got a type of '" + typeof input + "'");
    }
  }

  return input.filter(function (string) {
    if (typeof string !== 'string') {
      if (typeof string === 'undefined') {
        return false;
      }

      throw new TypeError("Expected '" + inputName + "' to be an array of strings, but found a type of '" + typeof string + "' in the array");
    }

    return true;
  });
}

function makeRegexp(pattern, options) {
  options = _objectSpread2({
    caseSensitive: false
  }, options);
  var cacheKey = pattern + JSON.stringify(options);

  if (regexpCache.has(cacheKey)) {
    return regexpCache.get(cacheKey);
  }

  var negated = pattern[0] === '!';

  if (negated) {
    pattern = pattern.slice(1);
  }

  pattern = escapeStringRegexp(pattern).replace(/\\\*/g, '[\\s\\S]*');
  var regexp = new RegExp("^" + pattern + "$", options.caseSensitive ? '' : 'i');
  regexp.negated = negated;
  regexpCache.set(cacheKey, regexp);
  return regexp;
}

var matcher = function matcher(inputs, patterns, options) {
  inputs = sanitizeArray(inputs, 'inputs');
  patterns = sanitizeArray(patterns, 'patterns');

  if (patterns.length === 0) {
    return [];
  }

  var isFirstPatternNegated = patterns[0][0] === '!';
  patterns = patterns.map(function (pattern) {
    return makeRegexp(pattern, options);
  });
  var result = [];

  for (var _iterator = _createForOfIteratorHelperLoose(inputs), _step; !(_step = _iterator()).done;) {
    var input = _step.value;
    // If first pattern is negated we include everything to match user expectation.
    var matches = isFirstPatternNegated;

    for (var _iterator2 = _createForOfIteratorHelperLoose(patterns), _step2; !(_step2 = _iterator2()).done;) {
      var pattern = _step2.value;

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

var isMatch = function isMatch(inputs, patterns, options) {
  inputs = sanitizeArray(inputs, 'inputs');
  patterns = sanitizeArray(patterns, 'patterns');

  if (patterns.length === 0) {
    return false;
  }

  return inputs.some(function (input) {
    return patterns.every(function (pattern) {
      var regexp = makeRegexp(pattern, options);
      var matches = regexp.test(input);
      return regexp.negated ? !matches : matches;
    });
  });
};
matcher.isMatch = isMatch;

var version$1 = "5.0.9";

var version = version$1;
/**
 * Like _.pullAll but with globs (wildcards)
 */

function pull(originalInput, originalToBeRemoved, originalOpts) {
  // insurance
  if (!originalInput.length) {
    return [];
  }

  if (!originalInput.length || !originalToBeRemoved.length) {
    return Array.from(originalInput);
  }

  var toBeRemoved = typeof originalToBeRemoved === "string" ? [originalToBeRemoved] : Array.from(originalToBeRemoved); // opts are mirroring matcher's at the moment, can't promise that for the future

  var defaults = {
    caseSensitive: true
  };

  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

  var res = Array.from(originalInput).filter(function (originalVal) {
    return !toBeRemoved.some(function (remVal) {
      return matcher.isMatch(originalVal, remVal, {
        caseSensitive: opts.caseSensitive
      });
    });
  });
  return res;
}

exports.pull = pull;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
