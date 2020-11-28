/**
 * array-pull-all-with-glob
 * PullAllWithGlob - like _.pullAll but pulling stronger, with globs
 * Version: 4.13.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-pull-all-with-glob/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.arrayPullAllWithGlob = factory());
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

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var escapeStringRegexp = function escapeStringRegexp(string) {
    if (typeof string !== 'string') {
      throw new TypeError('Expected a string');
    } // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a \unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.


    return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
  };

  var regexpCache = new Map();

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
    var regexp = new RegExp("^".concat(pattern, "$"), options.caseSensitive ? '' : 'i');
    regexp.negated = negated;
    regexpCache.set(cacheKey, regexp);
    return regexp;
  }

  var matcher = function matcher(inputs, patterns, options) {
    if (!(Array.isArray(inputs) && Array.isArray(patterns))) {
      throw new TypeError("Expected two arrays, got ".concat(_typeof(inputs), " ").concat(_typeof(patterns)));
    }

    if (patterns.length === 0) {
      return inputs;
    }

    var isFirstPatternNegated = patterns[0][0] === '!';
    patterns = patterns.map(function (pattern) {
      return makeRegexp(pattern, options);
    });
    var result = [];

    var _iterator = _createForOfIteratorHelper(inputs),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var input = _step.value;
        // If first pattern is negated we include everything to match user expectation.
        var matches = isFirstPatternNegated;

        var _iterator2 = _createForOfIteratorHelper(patterns),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var pattern = _step2.value;

            if (pattern.test(input)) {
              matches = !pattern.negated;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (matches) {
          result.push(input);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return result;
  };

  var isMatch = function isMatch(input, pattern, options) {
    var inputArray = Array.isArray(input) ? input : [input];
    var patternArray = Array.isArray(pattern) ? pattern : [pattern];
    return inputArray.some(function (input) {
      return patternArray.every(function (pattern) {
        var regexp = makeRegexp(pattern, options);
        var matches = regexp.test(input);
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
      opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
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
