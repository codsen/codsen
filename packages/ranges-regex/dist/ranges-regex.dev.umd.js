/**
 * ranges-regex
 * Integrate regex operations into Ranges workflow
 * Version: 4.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-regex/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rangesRegex = {}));
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

var defaults = {
  strictlyTwoElementsInRangeArrays: false,
  progressFn: null
};

function rSort(arrOfRanges, originalOptions) {
  // quick ending
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return arrOfRanges;
  } // fill any settings with defaults if missing:


  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOptions); // arrOfRanges validation


  var culpritsIndex;
  var culpritsLen; // validate does every range consist of exactly two indexes:

  if (opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.filter(function (range) {
    return range;
  }).every(function (rangeArr, indx) {
    if (rangeArr.length !== 2) {
      culpritsIndex = indx;
      culpritsLen = rangeArr.length;
      return false;
    }

    return true;
  })) {
    throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, " + culpritsIndex + "th range (" + JSON.stringify(arrOfRanges[culpritsIndex], null, 4) + ") has not two but " + culpritsLen + " elements!");
  } // validate are range indexes natural numbers:


  if (!arrOfRanges.filter(function (range) {
    return range;
  }).every(function (rangeArr, indx) {
    if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
      culpritsIndex = indx;
      return false;
    }

    return true;
  })) {
    throw new TypeError("ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, " + culpritsIndex + "th range (" + JSON.stringify(arrOfRanges[culpritsIndex], null, 4) + ") does not consist of only natural numbers!");
  } // let's assume worst case scenario is N x N.


  var maxPossibleIterations = Math.pow(arrOfRanges.filter(function (range) {
    return range;
  }).length, 2);
  var counter = 0;
  return Array.from(arrOfRanges).filter(function (range) {
    return range;
  }).sort(function (range1, range2) {
    if (opts.progressFn) {
      counter += 1;
      opts.progressFn(Math.floor(counter * 100 / maxPossibleIterations));
    }

    if (range1[0] === range2[0]) {
      if (range1[1] < range2[1]) {
        return -1;
      }

      if (range1[1] > range2[1]) {
        return 1;
      }

      return 0;
    }

    if (range1[0] < range2[0]) {
      return -1;
    }

    return 1;
  });
}

var defaults$1 = {
  mergeType: 1,
  progressFn: null,
  joinRangesThatTouchEdges: true
}; // merges the overlapping ranges
// case #1. exact extension:
// [ [1, 5], [5, 10] ] => [ [1, 10] ]
// case #2. overlap:
// [ [1, 4], [3, 5] ] => [ [1, 5] ]

function rMerge(arrOfRanges, originalOpts) {
  //
  // internal functions:
  // ---------------------------------------------------------------------------
  function isObj(something) {
    return something && typeof something === "object" && !Array.isArray(something);
  } // quick ending:
  // ---------------------------------------------------------------------------


  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return null;
  }

  var opts;

  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = _objectSpread2(_objectSpread2({}, defaults$1), originalOpts); // 1. validate opts.progressFn

      if (opts.progressFn && isObj(opts.progressFn) && !Object.keys(opts.progressFn).length) {
        opts.progressFn = null;
      } else if (opts.progressFn && typeof opts.progressFn !== "function") {
        throw new Error("ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: \"" + typeof opts.progressFn + "\", equal to " + JSON.stringify(opts.progressFn, null, 4));
      } // 2. validate opts.mergeType


      if (opts.mergeType && +opts.mergeType !== 1 && +opts.mergeType !== 2) {
        throw new Error("ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: \"" + typeof opts.mergeType + "\", equal to " + JSON.stringify(opts.mergeType, null, 4));
      } // 3. validate opts.joinRangesThatTouchEdges


      if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
        throw new Error("ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: \"" + typeof opts.joinRangesThatTouchEdges + "\", equal to " + JSON.stringify(opts.joinRangesThatTouchEdges, null, 4));
      }
    } else {
      throw new Error("emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n" + JSON.stringify(originalOpts, null, 4) + " (type " + typeof originalOpts + ")");
    }
  } else {
    opts = _objectSpread2({}, defaults$1);
  } // progress-wise, sort takes first 20%
  // two-level-deep array clone:


  var filtered = arrOfRanges // filter out null
  .filter(function (range) {
    return range;
  }).map(function (subarr) {
    return [].concat(subarr);
  }).filter( // filter out futile ranges with identical starting and ending points with
  // nothing to add (no 3rd argument)
  function (rangeArr) {
    return rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1];
  });
  var sortedRanges;
  var lastPercentageDone;
  var percentageDone;

  if (opts.progressFn) {
    // progress already gets reported in [0,100] range, so we just need to
    // divide by 5 in order to "compress" that into 20% range.
    sortedRanges = rSort(filtered, {
      progressFn: function progressFn(percentage) {
        percentageDone = Math.floor(percentage / 5); // ensure each percent is passed only once:

        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          opts.progressFn(percentageDone);
        }
      }
    });
  } else {
    sortedRanges = rSort(filtered);
  }

  if (!sortedRanges) {
    return null;
  }

  var len = sortedRanges.length - 1; // reset 80% of progress is this loop:
  // loop from the end:

  for (var i = len; i > 0; i--) {
    if (opts.progressFn) {
      percentageDone = Math.floor((1 - i / len) * 78) + 21;

      if (percentageDone !== lastPercentageDone && percentageDone > lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone); // console.log(
        //   `153 REPORTING ${`\u001b[${33}m${`doneSoFar`}\u001b[${39}m`} = ${doneSoFar}`
        // );
      }
    } // if current range is before the preceding-one


    if (sortedRanges[i][0] <= sortedRanges[i - 1][0] || !opts.joinRangesThatTouchEdges && sortedRanges[i][0] < sortedRanges[i - 1][1] || opts.joinRangesThatTouchEdges && sortedRanges[i][0] <= sortedRanges[i - 1][1]) {
      sortedRanges[i - 1][0] = Math.min(sortedRanges[i][0], sortedRanges[i - 1][0]);
      sortedRanges[i - 1][1] = Math.max(sortedRanges[i][1], sortedRanges[i - 1][1]); // tend the third argument, "what to insert"

      if (sortedRanges[i][2] !== undefined && (sortedRanges[i - 1][0] >= sortedRanges[i][0] || sortedRanges[i - 1][1] <= sortedRanges[i][1])) {
        // if the value of the range before exists:
        if (sortedRanges[i - 1][2] !== null) {
          if (sortedRanges[i][2] === null && sortedRanges[i - 1][2] !== null) {
            sortedRanges[i - 1][2] = null;
          } else if (sortedRanges[i - 1][2] != null) {
            // if there's a clash of "insert" values:
            if (+opts.mergeType === 2 && sortedRanges[i - 1][0] === sortedRanges[i][0]) {
              // take the value from the range that's on the right:
              sortedRanges[i - 1][2] = sortedRanges[i][2];
            } else {
              sortedRanges[i - 1][2] += sortedRanges[i][2];
            }
          } else {
            sortedRanges[i - 1][2] = sortedRanges[i][2];
          }
        }
      } // get rid of the second element:


      sortedRanges.splice(i, 1); // reset the traversal, start from the end again

      i = sortedRanges.length;
    }
  }

  return sortedRanges.length ? sortedRanges : null;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
var lodash_isregexp = createCommonjsModule(function (module, exports) {
  /** `Object#toString` result references. */
  var regexpTag = '[object RegExp]';
  /** Detect free variable `global` from Node.js. */

  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  /** Detect free variable `exports`. */

  var freeExports =  exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports = freeModule && freeModule.exports === freeExports;
  /** Detect free variable `process` from Node.js. */

  var freeProcess = moduleExports && freeGlobal.process;
  /** Used to access faster Node.js helpers. */

  var nodeUtil = function () {
    try {
      return freeProcess && freeProcess.binding('util');
    } catch (e) {}
  }();
  /* Node.js helper references. */


  var nodeIsRegExp = nodeUtil && nodeUtil.isRegExp;
  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */

  function baseUnary(func) {
    return function (value) {
      return func(value);
    };
  }
  /** Used for built-in method references. */


  var objectProto = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString = objectProto.toString;
  /**
   * The base implementation of `_.isRegExp` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
   */

  function baseIsRegExp(value) {
    return isObject(value) && objectToString.call(value) == regexpTag;
  }
  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */


  function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }
  /**
   * Checks if `value` is classified as a `RegExp` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
   * @example
   *
   * _.isRegExp(/abc/);
   * // => true
   *
   * _.isRegExp('/abc/');
   * // => false
   */


  var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
  module.exports = isRegExp;
});

var version = "4.0.1";

var version$1 = version;

function rRegex(regx, str, replacement) {
  // given regx validation
  if (regx === undefined) {
    throw new TypeError("ranges-regex: [THROW_ID_01] The first input's argument must be a regex object! Currently it is missing!");
  } else if (!lodash_isregexp(regx)) {
    throw new TypeError("ranges-regex: [THROW_ID_02] The first input's argument must be a regex object! Currently its type is: " + typeof regx + ", equal to: " + JSON.stringify(regx, null, 4));
  } // str validation


  if (typeof str !== "string") {
    throw new TypeError("ranges-regex: [THROW_ID_03] The second input's argument must be a string! Currently its type is: " + typeof str + ", equal to: " + JSON.stringify(str, null, 4));
  } // replacement validation


  if (replacement && typeof replacement !== "string") {
    throw new TypeError("ranges-regex: [THROW_ID_04] The third input's argument must be a string or null! Currently its type is: " + typeof replacement + ", equal to: " + JSON.stringify(replacement, null, 4));
  } // if an empty string was given, return an empty (ranges) array:


  if (!str.length) {
    return null;
  } //                       finally, the real action
  // ---------------------------------------------------------------------------


  var tempArr;
  var resRange = [];

  if (replacement === null || typeof replacement === "string" && replacement.length) {
    // eslint-disable-next-line no-cond-assign
    while ((tempArr = regx.exec(str)) !== null) {
      resRange.push([regx.lastIndex - tempArr[0].length, regx.lastIndex, replacement]);
    }
  } else {
    // eslint-disable-next-line no-cond-assign
    while ((tempArr = regx.exec(str)) !== null) {
      resRange.push([regx.lastIndex - tempArr[0].length, regx.lastIndex]);
    }
  }

  if (resRange.length) {
    return rMerge(resRange);
  }

  return null;
}

exports.rRegex = rRegex;
exports.version = version$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
