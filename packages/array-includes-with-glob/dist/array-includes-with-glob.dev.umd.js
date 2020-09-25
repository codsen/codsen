/**
 * array-includes-with-glob
 * like _.includes but with wildcards
 * Version: 2.12.41
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-includes-with-glob/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.arrayIncludesWithGlob = factory());
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

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts); // insurance


    if (arguments.length === 0) {
      throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_01] all inputs missing!");
    }

    if (arguments.length === 1) {
      throw new Error("array-includes-with-glob/arrayIncludesWithGlob(): [THROW_ID_02] second argument missing!");
    }

    if (!isArr(originalInput)) {
      if (isStr(originalInput)) {
        // eslint-disable-next-line no-param-reassign
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
