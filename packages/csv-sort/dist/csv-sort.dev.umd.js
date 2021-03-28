/**
 * csv-sort
 * Sorts double-entry bookkeeping CSV coming from internet banking
 * Version: 5.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/csv-sort/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.csvSort = {}));
}(this, (function (exports) { 'use strict';

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex$1(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf$1(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex$1(array, baseIsNaN$1, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * This function is like `baseIndexOf` except that it accepts a comparator.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOfWith(array, value, fromIndex, comparator) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (comparator(array[index], value)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN$1(value) {
  return value !== value;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * The base implementation of `_.pullAllBy` without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns `array`.
 */
function basePullAll(array, values, iteratee, comparator) {
  var indexOf = comparator ? baseIndexOfWith : baseIndexOf$1,
      index = -1,
      length = values.length,
      seen = array;

  if (array === values) {
    values = copyArray(values);
  }
  if (iteratee) {
    seen = arrayMap(array, baseUnary(iteratee));
  }
  while (++index < length) {
    var fromIndex = 0,
        value = values[index],
        computed = iteratee ? iteratee(value) : value;

    while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
      if (seen !== array) {
        splice.call(seen, fromIndex, 1);
      }
      splice.call(array, fromIndex, 1);
    }
  }
  return array;
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Removes all given values from `array` using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
 * to remove elements from an array by predicate.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {...*} [values] The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pull(array, 'a', 'c');
 * console.log(array);
 * // => ['b', 'b']
 */
var pull = baseRest(pullAll);

/**
 * This method is like `_.pull` except that it accepts an array of values to remove.
 *
 * **Note:** Unlike `_.difference`, this method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Array} values The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pullAll(array, ['a', 'c']);
 * console.log(array);
 * // => ['b', 'b']
 */
function pullAll(array, values) {
  return (array && array.length && values && values.length)
    ? basePullAll(array, values)
    : array;
}

var lodash_pull = pull;

/**
 * ranges-sort
 * Sort string index ranges
 * Version: 4.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-sort/
 */
const defaults$4 = {
  strictlyTwoElementsInRangeArrays: false,
  progressFn: null
};
function rSort(arrOfRanges, originalOptions) {
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return arrOfRanges;
  }
  const opts = { ...defaults$4,
    ...originalOptions
  };
  let culpritsIndex;
  let culpritsLen;
  if (opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.filter(range => range).every((rangeArr, indx) => {
    if (rangeArr.length !== 2) {
      culpritsIndex = indx;
      culpritsLen = rangeArr.length;
      return false;
    }
    return true;
  })) {
    throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 4)}) has not two but ${culpritsLen} elements!`);
  }
  if (!arrOfRanges.filter(range => range).every((rangeArr, indx) => {
    if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
      culpritsIndex = indx;
      return false;
    }
    return true;
  })) {
    throw new TypeError(`ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 4)}) does not consist of only natural numbers!`);
  }
  const maxPossibleIterations = arrOfRanges.filter(range => range).length ** 2;
  let counter = 0;
  return Array.from(arrOfRanges).filter(range => range).sort((range1, range2) => {
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

/**
 * ranges-merge
 * Merge and sort string index ranges
 * Version: 7.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-merge/
 */
const defaults$3 = {
  mergeType: 1,
  progressFn: null,
  joinRangesThatTouchEdges: true
};
function rMerge(arrOfRanges, originalOpts) {
  function isObj(something) {
    return something && typeof something === "object" && !Array.isArray(something);
  }
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return null;
  }
  let opts;
  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = { ...defaults$3,
        ...originalOpts
      };
      if (opts.progressFn && isObj(opts.progressFn) && !Object.keys(opts.progressFn).length) {
        opts.progressFn = null;
      } else if (opts.progressFn && typeof opts.progressFn !== "function") {
        throw new Error(`ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: "${typeof opts.progressFn}", equal to ${JSON.stringify(opts.progressFn, null, 4)}`);
      }
      if (opts.mergeType && +opts.mergeType !== 1 && +opts.mergeType !== 2) {
        throw new Error(`ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${JSON.stringify(opts.mergeType, null, 4)}`);
      }
      if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
        throw new Error(`ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof opts.joinRangesThatTouchEdges}", equal to ${JSON.stringify(opts.joinRangesThatTouchEdges, null, 4)}`);
      }
    } else {
      throw new Error(`emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n${JSON.stringify(originalOpts, null, 4)} (type ${typeof originalOpts})`);
    }
  } else {
    opts = { ...defaults$3
    };
  }
  const filtered = arrOfRanges
  .filter(range => range).map(subarr => [...subarr]).filter(
  rangeArr => rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1]);
  let sortedRanges;
  let lastPercentageDone;
  let percentageDone;
  if (opts.progressFn) {
    sortedRanges = rSort(filtered, {
      progressFn: percentage => {
        percentageDone = Math.floor(percentage / 5);
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
  const len = sortedRanges.length - 1;
  for (let i = len; i > 0; i--) {
    if (opts.progressFn) {
      percentageDone = Math.floor((1 - i / len) * 78) + 21;
      if (percentageDone !== lastPercentageDone && percentageDone > lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    }
    if (sortedRanges[i][0] <= sortedRanges[i - 1][0] || !opts.joinRangesThatTouchEdges && sortedRanges[i][0] < sortedRanges[i - 1][1] || opts.joinRangesThatTouchEdges && sortedRanges[i][0] <= sortedRanges[i - 1][1]) {
      sortedRanges[i - 1][0] = Math.min(sortedRanges[i][0], sortedRanges[i - 1][0]);
      sortedRanges[i - 1][1] = Math.max(sortedRanges[i][1], sortedRanges[i - 1][1]);
      if (sortedRanges[i][2] !== undefined && (sortedRanges[i - 1][0] >= sortedRanges[i][0] || sortedRanges[i - 1][1] <= sortedRanges[i][1])) {
        if (sortedRanges[i - 1][2] !== null) {
          if (sortedRanges[i][2] === null && sortedRanges[i - 1][2] !== null) {
            sortedRanges[i - 1][2] = null;
          } else if (sortedRanges[i - 1][2] != null) {
            if (+opts.mergeType === 2 && sortedRanges[i - 1][0] === sortedRanges[i][0]) {
              sortedRanges[i - 1][2] = sortedRanges[i][2];
            } else {
              sortedRanges[i - 1][2] += sortedRanges[i][2];
            }
          } else {
            sortedRanges[i - 1][2] = sortedRanges[i][2];
          }
        }
      }
      sortedRanges.splice(i, 1);
      i = sortedRanges.length;
    }
  }
  return sortedRanges.length ? sortedRanges : null;
}

/**
 * ranges-apply
 * Take an array of string index ranges, delete/replace the string according to them
 * Version: 5.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-apply/
 */
function rApply(str, originalRangesArr, progressFn) {
  let percentageDone = 0;
  let lastPercentageDone = 0;
  if (arguments.length === 0) {
    throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
  }
  if (typeof str !== "string") {
    throw new TypeError(`ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ${typeof str}, equal to: ${JSON.stringify(str, null, 4)}`);
  }
  if (originalRangesArr && !Array.isArray(originalRangesArr)) {
    throw new TypeError(`ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ${typeof originalRangesArr}, equal to: ${JSON.stringify(originalRangesArr, null, 4)}`);
  }
  if (progressFn && typeof progressFn !== "function") {
    throw new TypeError(`ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ${typeof progressFn}, equal to: ${JSON.stringify(progressFn, null, 4)}`);
  }
  if (!originalRangesArr || !originalRangesArr.filter(range => range).length) {
    return str;
  }
  let rangesArr;
  if (Array.isArray(originalRangesArr) && Number.isInteger(originalRangesArr[0]) && Number.isInteger(originalRangesArr[1])) {
    rangesArr = [Array.from(originalRangesArr)];
  } else {
    rangesArr = Array.from(originalRangesArr);
  }
  const len = rangesArr.length;
  let counter = 0;
  rangesArr.filter(range => range).forEach((el, i) => {
    if (progressFn) {
      percentageDone = Math.floor(counter / len * 10);
      /* istanbul ignore else */
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        progressFn(percentageDone);
      }
    }
    if (!Array.isArray(el)) {
      throw new TypeError(`ranges-apply: [THROW_ID_05] ranges array, second input arg., has ${i}th element not an array: ${JSON.stringify(el, null, 4)}, which is ${typeof el}`);
    }
    if (!Number.isInteger(el[0])) {
      if (!Number.isInteger(+el[0]) || +el[0] < 0) {
        throw new TypeError(`ranges-apply: [THROW_ID_06] ranges array, second input arg. has ${i}th element, array ${JSON.stringify(el, null, 0)}. Its first element is not an integer, string index, but ${typeof el[0]}, equal to: ${JSON.stringify(el[0], null, 4)}.`);
      } else {
        rangesArr[i][0] = +rangesArr[i][0];
      }
    }
    if (!Number.isInteger(el[1])) {
      if (!Number.isInteger(+el[1]) || +el[1] < 0) {
        throw new TypeError(`ranges-apply: [THROW_ID_07] ranges array, second input arg. has ${i}th element, array ${JSON.stringify(el, null, 0)}. Its second element is not an integer, string index, but ${typeof el[1]}, equal to: ${JSON.stringify(el[1], null, 4)}.`);
      } else {
        rangesArr[i][1] = +rangesArr[i][1];
      }
    }
    counter += 1;
  });
  const workingRanges = rMerge(rangesArr, {
    progressFn: perc => {
      if (progressFn) {
        percentageDone = 10 + Math.floor(perc / 10);
        /* istanbul ignore else */
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          progressFn(percentageDone);
        }
      }
    }
  });
  const len2 = Array.isArray(workingRanges) ? workingRanges.length : 0;
  /* istanbul ignore else */
  if (len2 > 0) {
    const tails = str.slice(workingRanges[len2 - 1][1]);
    str = workingRanges.reduce((acc, _val, i, arr) => {
      if (progressFn) {
        percentageDone = 20 + Math.floor(i / len2 * 80);
        /* istanbul ignore else */
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          progressFn(percentageDone);
        }
      }
      const beginning = i === 0 ? 0 : arr[i - 1][1];
      const ending = arr[i][0];
      return acc + str.slice(beginning, ending) + (arr[i][2] || "");
    }, "");
    str += tails;
  }
  return str;
}

/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 5.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-collapse-leading-whitespace/
 */
function collWhitespace(str, originallineBreakLimit = 1) {
  const rawNbsp = "\u00A0";
  function reverse(s) {
    return Array.from(s).reverse().join("");
  }
  function prep(whitespaceChunk, limit, trailing) {
    const firstBreakChar = trailing ? "\n" : "\r";
    const secondBreakChar = trailing ? "\r" : "\n";
    if (!whitespaceChunk) {
      return whitespaceChunk;
    }
    let crlfCount = 0;
    let res = "";
    for (let i = 0, len = whitespaceChunk.length; i < len; i++) {
      if (whitespaceChunk[i] === firstBreakChar || whitespaceChunk[i] === secondBreakChar && whitespaceChunk[i - 1] !== firstBreakChar) {
        crlfCount++;
      }
      if (`\r\n`.includes(whitespaceChunk[i]) || whitespaceChunk[i] === rawNbsp) {
        if (whitespaceChunk[i] === rawNbsp) {
          res += whitespaceChunk[i];
        } else if (whitespaceChunk[i] === firstBreakChar) {
          if (crlfCount <= limit) {
            res += whitespaceChunk[i];
            if (whitespaceChunk[i + 1] === secondBreakChar) {
              res += whitespaceChunk[i + 1];
              i++;
            }
          }
        } else if (whitespaceChunk[i] === secondBreakChar && (!whitespaceChunk[i - 1] || whitespaceChunk[i - 1] !== firstBreakChar) && crlfCount <= limit) {
          res += whitespaceChunk[i];
        }
      } else {
        if (!whitespaceChunk[i + 1] && !crlfCount) {
          res += " ";
        }
      }
    }
    return res;
  }
  if (typeof str === "string" && str.length) {
    let lineBreakLimit = 1;
    if (typeof +originallineBreakLimit === "number" && Number.isInteger(+originallineBreakLimit) && +originallineBreakLimit >= 0) {
      lineBreakLimit = +originallineBreakLimit;
    }
    let frontPart = "";
    let endPart = "";
    if (!str.trim()) {
      frontPart = str;
    } else if (!str[0].trim()) {
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i].trim()) {
          frontPart = str.slice(0, i);
          break;
        }
      }
    }
    if (str.trim() && (str.slice(-1).trim() === "" || str.slice(-1) === rawNbsp)) {
      for (let i = str.length; i--;) {
        if (str[i].trim()) {
          endPart = str.slice(i + 1);
          break;
        }
      }
    }
    return `${prep(frontPart, lineBreakLimit, false)}${str.trim()}${reverse(prep(reverse(endPart), lineBreakLimit, true))}`;
  }
  return str;
}

/**
 * ranges-push
 * Gather string index ranges
 * Version: 5.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-push/
 */
function existy(x) {
  return x != null;
}
function isNum(something) {
  return Number.isInteger(something) && something >= 0;
}
function isStr(something) {
  return typeof something === "string";
}
const defaults$2 = {
  limitToBeAddedWhitespace: false,
  limitLinebreaksCount: 1,
  mergeType: 1
};
class Ranges {
  constructor(originalOpts) {
    const opts = { ...defaults$2,
      ...originalOpts
    };
    if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
      if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
        opts.mergeType = 1;
      } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
        opts.mergeType = 2;
      } else {
        throw new Error(`ranges-push: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${JSON.stringify(opts.mergeType, null, 4)}`);
      }
    }
    this.opts = opts;
    this.ranges = [];
  }
  add(originalFrom, originalTo, addVal) {
    if (originalFrom == null && originalTo == null) {
      return;
    }
    if (existy(originalFrom) && !existy(originalTo)) {
      if (Array.isArray(originalFrom)) {
        if (originalFrom.length) {
          if (originalFrom.some(el => Array.isArray(el))) {
            originalFrom.forEach(thing => {
              if (Array.isArray(thing)) {
                this.add(...thing);
              }
            });
            return;
          }
          if (originalFrom.length && isNum(+originalFrom[0]) && isNum(+originalFrom[1])) {
            this.add(...originalFrom);
          }
        }
        return;
      }
      throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_12] the first input argument, "from" is set (${JSON.stringify(originalFrom, null, 0)}) but second-one, "to" is not (${JSON.stringify(originalTo, null, 0)})`);
    } else if (!existy(originalFrom) && existy(originalTo)) {
      throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, "to" is set (${JSON.stringify(originalTo, null, 0)}) but first-one, "from" is not (${JSON.stringify(originalFrom, null, 0)})`);
    }
    const from = +originalFrom;
    const to = +originalTo;
    if (isNum(addVal)) {
      addVal = String(addVal);
    }
    if (isNum(from) && isNum(to)) {
      if (existy(addVal) && !isStr(addVal) && !isNum(addVal)) {
        throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ${typeof addVal}, equal to:\n${JSON.stringify(addVal, null, 4)}`);
      }
      if (existy(this.ranges) && Array.isArray(this.last()) && from === this.last()[1]) {
        this.last()[1] = to;
        if (this.last()[2] === null || addVal === null) ;
        if (this.last()[2] !== null && existy(addVal)) {
          let calculatedVal = this.last()[2] && this.last()[2].length > 0 && (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1) ? this.last()[2] + addVal : addVal;
          if (this.opts.limitToBeAddedWhitespace) {
            calculatedVal = collWhitespace(calculatedVal, this.opts.limitLinebreaksCount);
          }
          if (!(isStr(calculatedVal) && !calculatedVal.length)) {
            this.last()[2] = calculatedVal;
          }
        }
      } else {
        if (!this.ranges) {
          this.ranges = [];
        }
        const whatToPush = addVal !== undefined && !(isStr(addVal) && !addVal.length) ? [from, to, addVal && this.opts.limitToBeAddedWhitespace ? collWhitespace(addVal, this.opts.limitLinebreaksCount) : addVal] : [from, to];
        this.ranges.push(whatToPush);
      }
    } else {
      if (!(isNum(from) && from >= 0)) {
        throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_09] "from" value, the first input argument, must be a natural number or zero! Currently it's of a type "${typeof from}" equal to: ${JSON.stringify(from, null, 4)}`);
      } else {
        throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_10] "to" value, the second input argument, must be a natural number or zero! Currently it's of a type "${typeof to}" equal to: ${JSON.stringify(to, null, 4)}`);
      }
    }
  }
  push(originalFrom, originalTo, addVal) {
    this.add(originalFrom, originalTo, addVal);
  }
  current() {
    if (Array.isArray(this.ranges) && this.ranges.length) {
      this.ranges = rMerge(this.ranges, {
        mergeType: this.opts.mergeType
      });
      if (this.ranges && this.opts.limitToBeAddedWhitespace) {
        return this.ranges.map(val => {
          if (existy(val[2])) {
            return [val[0], val[1], collWhitespace(val[2], this.opts.limitLinebreaksCount)];
          }
          return val;
        });
      }
      return this.ranges;
    }
    return null;
  }
  wipe() {
    this.ranges = [];
  }
  replace(givenRanges) {
    if (Array.isArray(givenRanges) && givenRanges.length) {
      if (!(Array.isArray(givenRanges[0]) && isNum(givenRanges[0][0]))) {
        throw new Error(`ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ${JSON.stringify(givenRanges[0], null, 4)} should be an array and its first element should be an integer, a string index.`);
      } else {
        this.ranges = Array.from(givenRanges);
      }
    } else {
      this.ranges = [];
    }
  }
  last() {
    if (Array.isArray(this.ranges) && this.ranges.length) {
      return this.ranges[this.ranges.length - 1];
    }
    return null;
  }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the first unmatched string symbol.
 */
function charsStartIndex(strSymbols, chrSymbols) {
  var index = -1,
      length = strSymbols.length;

  while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the last unmatched string symbol.
 */
function charsEndIndex(strSymbols, chrSymbols) {
  var index = strSymbols.length;

  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Removes leading and trailing whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trim('  abc  ');
 * // => 'abc'
 *
 * _.trim('-_-abc-_-', '_-');
 * // => 'abc'
 *
 * _.map(['  foo  ', '  bar  '], _.trim);
 * // => ['foo', 'bar']
 */
function trim(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrim, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      chrSymbols = stringToArray(chars),
      start = charsStartIndex(strSymbols, chrSymbols),
      end = charsEndIndex(strSymbols, chrSymbols) + 1;

  return castSlice(strSymbols, start, end).join('');
}

var lodash_trim = trim;

/**
 * string-remove-thousand-separators
 * Detects and removes thousand separators (dot/comma/quote/space) from string-type digits
 * Version: 5.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-remove-thousand-separators/
 */
function remSep(str, originalOpts) {
  let allOK = true;
  const knownSeparatorsArray = [".", ",", "'", " "];
  let firstSeparator;
  if (typeof str !== "string") {
    throw new TypeError(`string-remove-thousand-separators/remSep(): [THROW_ID_01] Input must be string! Currently it's: ${typeof str}, equal to:\n${JSON.stringify(str, null, 4)}`);
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new TypeError(`string-remove-thousand-separators/remSep(): [THROW_ID_02] Options object must be a plain object! Currently it's: ${typeof originalOpts}, equal to:\n${JSON.stringify(originalOpts, null, 4)}`);
  }
  const defaults = {
    removeThousandSeparatorsFromNumbers: true,
    padSingleDecimalPlaceNumbers: true,
    forceUKStyle: false
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  const res = lodash_trim(str.trim(), '"');
  if (res === "") {
    return res;
  }
  const rangesToDelete = new Ranges();
  for (let i = 0, len = res.length; i < len; i++) {
    if (opts.removeThousandSeparatorsFromNumbers && res[i].trim() === "") {
      rangesToDelete.add(i, i + 1);
    }
    if (opts.removeThousandSeparatorsFromNumbers && res[i] === "'") {
      rangesToDelete.add(i, i + 1);
      if (res[i + 1] === "'") {
        allOK = false;
        break;
      }
    }
    if (knownSeparatorsArray.includes(res[i])) {
      if (res[i + 1] !== undefined && /^\d*$/.test(res[i + 1])) {
        if (res[i + 2] !== undefined) {
          if (/^\d*$/.test(res[i + 2])) {
            if (res[i + 3] !== undefined) {
              if (/^\d*$/.test(res[i + 3])) {
                if (res[i + 4] !== undefined && /^\d*$/.test(res[i + 4])) {
                  allOK = false;
                  break;
                } else {
                  if (opts.removeThousandSeparatorsFromNumbers) {
                    rangesToDelete.add(i, i + 1);
                  }
                  if (!firstSeparator) {
                    firstSeparator = res[i];
                  } else if (res[i] !== firstSeparator) {
                    allOK = false;
                    break;
                  }
                }
              } else {
                allOK = false;
                break;
              }
            } else if (opts.removeThousandSeparatorsFromNumbers && opts.forceUKStyle && res[i] === ",") {
              rangesToDelete.add(i, i + 1, ".");
            }
          } else {
            allOK = false;
            break;
          }
        } else {
          if (opts.forceUKStyle && res[i] === ",") {
            rangesToDelete.add(i, i + 1, ".");
          }
          if (opts.padSingleDecimalPlaceNumbers) {
            rangesToDelete.add(i + 2, i + 2, "0");
          }
        }
      }
    } else if (!/^\d*$/.test(res[i])) {
      allOK = false;
      break;
    }
  }
  if (allOK && rangesToDelete.current()) {
    return rApply(res, rangesToDelete.current());
  }
  return res;
}

/**
 * csv-split-easy
 * Splits the CSV string into array of arrays, each representing a row of columns
 * Version: 5.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/csv-split-easy/
 */
const defaults$1 = {
  removeThousandSeparatorsFromNumbers: true,
  padSingleDecimalPlaceNumbers: true,
  forceUKStyle: false
};
function splitEasy(str, originalOpts) {
  let colStarts = 0;
  let lineBreakStarts = 0;
  let rowArray = [];
  const resArray = [];
  let ignoreCommasThatFollow = false;
  let thisRowContainsOnlyEmptySpace = true;
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(`csv-split-easy/split(): [THROW_ID_02] Options object must be a plain object! Currently it's of a type ${typeof originalOpts} equal to:\n${JSON.stringify(originalOpts, null, 4)}`);
  }
  const opts = { ...defaults$1,
    ...originalOpts
  };
  if (typeof str !== "string") {
    throw new TypeError(`csv-split-easy/split(): [THROW_ID_04] input must be string! Currently it's: ${typeof str}, equal to: ${JSON.stringify(str, null, 4)}`);
  } else {
    if (str === "") {
      return [[""]];
    }
    str = str.trim();
  }
  for (let i = 0, len = str.length; i < len; i++) {
    if (thisRowContainsOnlyEmptySpace && str[i] !== '"' && str[i] !== "," && str[i].trim() !== "") {
      thisRowContainsOnlyEmptySpace = false;
    }
    if (str[i] === '"') {
      if (ignoreCommasThatFollow && str[i + 1] === '"') {
        i += 1;
      } else if (ignoreCommasThatFollow) {
        ignoreCommasThatFollow = false;
        const newElem = str.slice(colStarts, i);
        if (newElem.trim() !== "") {
          thisRowContainsOnlyEmptySpace = false;
        }
        const processedElem = /""/.test(newElem) ? newElem.replace(/""/g, '"') : remSep(newElem, {
          removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
          padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
          forceUKStyle: opts.forceUKStyle
        });
        rowArray.push(processedElem);
      } else {
        ignoreCommasThatFollow = true;
        colStarts = i + 1;
      }
    }
    else if (!ignoreCommasThatFollow && str[i] === ",") {
        if (str[i - 1] !== '"' && !ignoreCommasThatFollow) {
          const newElem = str.slice(colStarts, i);
          if (newElem.trim() !== "") {
            thisRowContainsOnlyEmptySpace = false;
          }
          rowArray.push(remSep(newElem,
          {
            removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
            padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
            forceUKStyle: opts.forceUKStyle
          }));
        }
        colStarts = i + 1;
        if (lineBreakStarts) {
          lineBreakStarts = 0;
        }
      }
      else if (str[i] === "\n" || str[i] === "\r") {
          if (!lineBreakStarts) {
            lineBreakStarts = i;
            if (!ignoreCommasThatFollow && str[i - 1] !== '"') {
              const newElem = str.slice(colStarts, i);
              if (newElem.trim() !== "") {
                thisRowContainsOnlyEmptySpace = false;
              }
              rowArray.push(remSep(newElem, {
                removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
                padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
                forceUKStyle: opts.forceUKStyle
              }));
            }
            if (!thisRowContainsOnlyEmptySpace) {
              resArray.push(rowArray);
            } else {
              rowArray.length = 0;
            }
            thisRowContainsOnlyEmptySpace = true;
            rowArray = [];
          }
          colStarts = i + 1;
        }
        else if (lineBreakStarts) {
            lineBreakStarts = 0;
            colStarts = i;
          }
    if (i + 1 === len) {
      if (str[i] !== '"') {
        const newElem = str.slice(colStarts, i + 1);
        if (newElem.trim()) {
          thisRowContainsOnlyEmptySpace = false;
        }
        rowArray.push(remSep(newElem, {
          removeThousandSeparatorsFromNumbers: opts.removeThousandSeparatorsFromNumbers,
          padSingleDecimalPlaceNumbers: opts.padSingleDecimalPlaceNumbers,
          forceUKStyle: opts.forceUKStyle
        }));
      }
      if (!thisRowContainsOnlyEmptySpace) {
        resArray.push(rowArray);
      } else {
        rowArray = [];
      }
      thisRowContainsOnlyEmptySpace = true;
    }
  }
  if (resArray.length === 0) {
    return [[""]];
  }
  return resArray;
}

/*!
 * currency.js - v2.0.3
 * http://scurker.github.io/currency.js
 *
 * Copyright (c) 2020 Jason Wilson
 * Released under MIT license
 */

var defaults = {
  symbol: '$',
  separator: ',',
  decimal: '.',
  errorOnInvalid: false,
  precision: 2,
  pattern: '!#',
  negativePattern: '-!#',
  format: format,
  fromCents: false
};

var round = function round(v) {
  return Math.round(v);
};

var pow = function pow(p) {
  return Math.pow(10, p);
};

var rounding = function rounding(value, increment) {
  return round(value / increment) * increment;
};

var groupRegex = /(\d)(?=(\d{3})+\b)/g;
var vedicRegex = /(\d)(?=(\d\d)+\d\b)/g;
/**
 * Create a new instance of currency.js
 * @param {number|string|currency} value
 * @param {object} [opts]
 */

function currency(value, opts) {
  var that = this;

  if (!(that instanceof currency)) {
    return new currency(value, opts);
  }

  var settings = Object.assign({}, defaults, opts),
      precision = pow(settings.precision),
      v = parse(value, settings);
  that.intValue = v;
  that.value = v / precision; // Set default incremental value

  settings.increment = settings.increment || 1 / precision; // Support vedic numbering systems
  // see: https://en.wikipedia.org/wiki/Indian_numbering_system

  if (settings.useVedic) {
    settings.groups = vedicRegex;
  } else {
    settings.groups = groupRegex;
  } // Intended for internal usage only - subject to change


  this.s = settings;
  this.p = precision;
}

function parse(value, opts) {
  var useRounding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var v = 0,
      decimal = opts.decimal,
      errorOnInvalid = opts.errorOnInvalid,
      decimals = opts.precision,
      fromCents = opts.fromCents,
      precision = pow(decimals),
      isNumber = typeof value === 'number',
      isCurrency = value instanceof currency;

  if (isCurrency && fromCents) {
    return value.intValue;
  }

  if (isNumber || isCurrency) {
    v = isCurrency ? value.value : value;
  } else if (typeof value === 'string') {
    var regex = new RegExp('[^-\\d' + decimal + ']', 'g'),
        decimalString = new RegExp('\\' + decimal, 'g');
    v = value.replace(/\((.*)\)/, '-$1') // allow negative e.g. (1.99)
    .replace(regex, '') // replace any non numeric values
    .replace(decimalString, '.'); // convert any decimal values

    v = v || 0;
  } else {
    if (errorOnInvalid) {
      throw Error('Invalid Input');
    }

    v = 0;
  }

  if (!fromCents) {
    v *= precision; // scale number to integer value

    v = v.toFixed(4); // Handle additional decimal for proper rounding.
  }

  return useRounding ? round(v) : v;
}
/**
 * Formats a currency object
 * @param currency
 * @param {object} [opts]
 */


function format(currency, settings) {
  var pattern = settings.pattern,
      negativePattern = settings.negativePattern,
      symbol = settings.symbol,
      separator = settings.separator,
      decimal = settings.decimal,
      groups = settings.groups,
      split = ('' + currency).replace(/^-/, '').split('.'),
      dollars = split[0],
      cents = split[1];
  return (currency.value >= 0 ? pattern : negativePattern).replace('!', symbol).replace('#', dollars.replace(groups, '$1' + separator) + (cents ? decimal + cents : ''));
}

currency.prototype = {
  /**
   * Adds values together.
   * @param {number} number
   * @returns {currency}
   */
  add: function add(number) {
    var intValue = this.intValue,
        _settings = this.s,
        _precision = this.p;
    return currency((intValue += parse(number, _settings)) / (_settings.fromCents ? 1 : _precision), _settings);
  },

  /**
   * Subtracts value.
   * @param {number} number
   * @returns {currency}
   */
  subtract: function subtract(number) {
    var intValue = this.intValue,
        _settings = this.s,
        _precision = this.p;
    return currency((intValue -= parse(number, _settings)) / (_settings.fromCents ? 1 : _precision), _settings);
  },

  /**
   * Multiplies values.
   * @param {number} number
   * @returns {currency}
   */
  multiply: function multiply(number) {
    var intValue = this.intValue,
        _settings = this.s;
    return currency((intValue *= number) / (_settings.fromCents ? 1 : pow(_settings.precision)), _settings);
  },

  /**
   * Divides value.
   * @param {number} number
   * @returns {currency}
   */
  divide: function divide(number) {
    var intValue = this.intValue,
        _settings = this.s;
    return currency(intValue /= parse(number, _settings, false), _settings);
  },

  /**
   * Takes the currency amount and distributes the values evenly. Any extra pennies
   * left over from the distribution will be stacked onto the first set of entries.
   * @param {number} count
   * @returns {array}
   */
  distribute: function distribute(count) {
    var intValue = this.intValue,
        _precision = this.p,
        _settings = this.s,
        distribution = [],
        split = Math[intValue >= 0 ? 'floor' : 'ceil'](intValue / count),
        pennies = Math.abs(intValue - split * count),
        precision = _settings.fromCents ? 1 : _precision;

    for (; count !== 0; count--) {
      var item = currency(split / precision, _settings); // Add any left over pennies

      pennies-- > 0 && (item = item[intValue >= 0 ? 'add' : 'subtract'](1 / precision));
      distribution.push(item);
    }

    return distribution;
  },

  /**
   * Returns the dollar value.
   * @returns {number}
   */
  dollars: function dollars() {
    return ~~this.value;
  },

  /**
   * Returns the cent value.
   * @returns {number}
   */
  cents: function cents() {
    var intValue = this.intValue,
        _precision = this.p;
    return ~~(intValue % _precision);
  },

  /**
   * Formats the value as a string according to the formatting settings.
   * @param {boolean} useSymbol - format with currency symbol
   * @returns {string}
   */
  format: function format(options) {
    var _settings = this.s;

    if (typeof options === 'function') {
      return options(this, _settings);
    }

    return _settings.format(this, Object.assign({}, _settings, options));
  },

  /**
   * Formats the value as a string according to the formatting settings.
   * @returns {string}
   */
  toString: function toString() {
    var intValue = this.intValue,
        _precision = this.p,
        _settings = this.s;
    return rounding(intValue / _precision, _settings.increment).toFixed(_settings.precision);
  },

  /**
   * Value for JSON serialization.
   * @returns {float}
   */
  toJSON: function toJSON() {
    return this.value;
  }
};

function isNumeric(str) {
    // if (typeof str === "number") {
    //   return true;
    // }
    // if (!String(str).trim()) {
    if (!str.trim()) {
        return false;
    }
    return Number(str) === Number(str);
}
const currencySigns = [
    "د.إ",
    "؋",
    "L",
    "֏",
    "ƒ",
    "Kz",
    "$",
    "ƒ",
    "₼",
    "KM",
    "৳",
    "лв",
    ".د.ب",
    "FBu",
    "$b",
    "R$",
    "฿",
    "Nu.",
    "P",
    "p.",
    "BZ$",
    "FC",
    "CHF",
    "¥",
    "₡",
    "₱",
    "Kč",
    "Fdj",
    "kr",
    "RD$",
    "دج",
    "kr",
    "Nfk",
    "Br",
    "Ξ",
    "€",
    "₾",
    "₵",
    "GH₵",
    "D",
    "FG",
    "Q",
    "L",
    "kn",
    "G",
    "Ft",
    "Rp",
    "₪",
    "₹",
    "ع.د",
    "﷼",
    "kr",
    "J$",
    "JD",
    "¥",
    "KSh",
    "лв",
    "៛",
    "CF",
    "₩",
    "₩",
    "KD",
    "лв",
    "₭",
    "₨",
    "M",
    "Ł",
    "Lt",
    "Ls",
    "LD",
    "MAD",
    "lei",
    "Ar",
    "ден",
    "K",
    "₮",
    "MOP$",
    "UM",
    "₨",
    "Rf",
    "MK",
    "RM",
    "MT",
    "₦",
    "C$",
    "kr",
    "₨",
    "﷼",
    "B/.",
    "S/.",
    "K",
    "₱",
    "₨",
    "zł",
    "Gs",
    "﷼",
    "￥",
    "lei",
    "Дин.",
    "₽",
    "R₣",
    "﷼",
    "₨",
    "ج.س.",
    "kr",
    "£",
    "Le",
    "S",
    "Db",
    "E",
    "฿",
    "SM",
    "T",
    "د.ت",
    "T$",
    "₤",
    "₺",
    "TT$",
    "NT$",
    "TSh",
    "₴",
    "USh",
    "$U",
    "лв",
    "Bs",
    "₫",
    "VT",
    "WS$",
    "FCFA",
    "Ƀ",
    "CFA",
    "₣",
    "﷼",
    "R",
    "Z$",
];
function findType(something) {
    /* istanbul ignore next */
    if (typeof something !== "string") {
        throw new Error(`csv-sort/util/findType(): input must be string! Currently it's: ${typeof something}`);
    }
    if (isNumeric(something)) {
        return "numeric";
    }
    /* istanbul ignore next */
    if (currencySigns.some((singleSign) => 
    // We remove all known currency symbols one by one from this input string.
    // If at least one passes as numeric after the currency symbol-removing, it's numeric.
    isNumeric(something.replace(singleSign, "").replace(/[,.]/g, "")))) {
        return "numeric";
    }
    if (!something.trim()) {
        return "empty";
    }
    return "text";
}

/**
 * Sorts double-entry bookkeeping CSV coming from internet banking
 */
function sort(input) {
    let msgContent = null;
    let msgType = null;
    // step 1.
    // ===========================
    // depends what was passed in,
    if (typeof input !== "string") {
        throw new TypeError(`csv-sort/csvSort(): [THROW_ID_01] The input is of a wrong type! We accept either string of array of arrays. We got instead: ${typeof input}, equal to:\n${JSON.stringify(input, null, 4)}`);
    }
    else if (!input.trim()) {
        return { res: [[""]], msgContent, msgType };
    }
    let content = splitEasy(input);
    // step 2.
    // ===========================
    // - iterate from the bottom
    // - calculate schema as you go to save calculation rounds
    // - first row can have different amount of columns
    // - think about 2D trim feature
    let schema = [];
    let stateHeaderRowPresent = false;
    let stateDataColumnRowLengthIsConsistent = true;
    const stateColumnsContainingSameValueEverywhere = [];
    // used for 2D trimming:
    let indexAtWhichEmptyCellsStart = null;
    for (let i = content.length - 1; i >= 0; i--) {
        if (!schema.length) {
            // prevention against last blank row:
            /* istanbul ignore next */
            if (content[i].length !== 1 || content[i][0] !== "") {
                for (let y = 0, len = content[i].length; y < len; y++) {
                    schema.push(findType(content[i][y].trim()));
                    if (indexAtWhichEmptyCellsStart === null &&
                        findType(content[i][y].trim()) === "empty") {
                        indexAtWhichEmptyCellsStart = y;
                    }
                    if (indexAtWhichEmptyCellsStart !== null &&
                        findType(content[i][y].trim()) !== "empty") {
                        indexAtWhichEmptyCellsStart = null;
                    }
                }
            }
        }
        else {
            if (i === 0) {
                // Check is this header row.
                // Header rows should consist of only text content.
                // Let's iterate through all elements and find out.
                stateHeaderRowPresent = content[i].every((el) => findType(el) === "text" || findType(el) === "empty");
                // if schema was calculated (this means there's header row and at least one content row),
                // find out if the column length in the header differs from schema's
                // if (stateHeaderRowPresent && (schema.length !== content[i].length)) {
                // }
            }
            /* istanbul ignore else */
            if (!stateHeaderRowPresent && schema.length !== content[i].length) {
                stateDataColumnRowLengthIsConsistent = false;
            }
            let perRowIndexAtWhichEmptyCellsStart = null;
            for (let y = 0, len = content[i].length; y < len; y++) {
                // trim
                /* istanbul ignore else */
                if (perRowIndexAtWhichEmptyCellsStart === null &&
                    findType(content[i][y].trim()) === "empty") {
                    perRowIndexAtWhichEmptyCellsStart = y;
                }
                /* istanbul ignore else */
                if (perRowIndexAtWhichEmptyCellsStart !== null &&
                    findType(content[i][y].trim()) !== "empty") {
                    perRowIndexAtWhichEmptyCellsStart = null;
                }
                // checking schema
                /* istanbul ignore else */
                if (findType(content[i][y].trim()) !== schema[y] &&
                    !stateHeaderRowPresent) {
                    const toAdd = findType(content[i][y].trim());
                    /* istanbul ignore else */
                    if (Array.isArray(schema[y])) {
                        if (!schema[y].includes(toAdd)) {
                            schema[y].push(findType(content[i][y].trim()));
                        }
                    }
                    else if (schema[y] !== toAdd) {
                        const temp = schema[y];
                        schema[y] = [];
                        schema[y].push(temp);
                        schema[y].push(toAdd);
                    }
                }
            }
            // when row has finished, get the perRowIndexAtWhichEmptyCellsStart
            // that's to cover cases where last row got schema calculated, but it
            // had more empty columns than the following rows:
            //
            // [8, 9, 0, 1,  ,  ]
            // [4, 5, 6, 7,  ,  ] <<< perRowIndexAtWhichEmptyCellsStart would be 3 (indexes start at zero)
            // [1, 2, 3,  ,  ,  ] <<< indexAtWhichEmptyCellsStart would be here 2 (indexes start at zero)
            //
            // as a result, indexAtWhichEmptyCellsStart above would be assigned to 3, not 2
            //
            // That's still an achievement, we "trimmed" CSV by two places.
            // I'm saying "trimmed", but we're not really trimming yet, we're only
            // setting inner variable which we will later use to limit the traversal,
            // so algorithm skips those empty columns.
            //
            /* istanbul ignore next */
            if (indexAtWhichEmptyCellsStart !== null &&
                perRowIndexAtWhichEmptyCellsStart !== null &&
                perRowIndexAtWhichEmptyCellsStart > indexAtWhichEmptyCellsStart &&
                (!stateHeaderRowPresent || (stateHeaderRowPresent && i !== 0))) {
                indexAtWhichEmptyCellsStart = perRowIndexAtWhichEmptyCellsStart;
            }
        }
    }
    /* istanbul ignore else */
    if (!indexAtWhichEmptyCellsStart) {
        indexAtWhichEmptyCellsStart = schema.length;
    }
    // find out at which index non-empty columns start. This is effectively left-side trimming.
    let nonEmptyColsStartAt = 0;
    for (let i = 0, len = schema.length; i < len; i++) {
        if (schema[i] === "empty") {
            nonEmptyColsStartAt = i;
        }
        else {
            break;
        }
    }
    // if there are empty column in front, trim (via slice) both content and schema
    /* istanbul ignore else */
    if (nonEmptyColsStartAt !== 0) {
        content = content.map((arr) => arr.slice(nonEmptyColsStartAt + 1, indexAtWhichEmptyCellsStart));
        schema = schema.slice(nonEmptyColsStartAt + 1, indexAtWhichEmptyCellsStart);
    }
    // step 3.
    // ===========================
    // CHALLENGE: without any assumptions, identify "current balance" and "debit",
    // "credit" columns by analysing their values.
    //
    // - double entry accounting rows will have the "current balance" which will
    //   be strictly numeric, and will be present across all rows. These are the
    //   two first signs of a "current balance" column.
    // - "current balance" should also match up with at least one field under it,
    //   if subracted/added the value from one field in its row
    // swoop in traversing the schema array to get "numeric" columns:
    // ----------------
    const numericSchemaColumns = [];
    let balanceColumnIndex;
    schema.forEach((colType, i) => {
        if (colType === "numeric") {
            numericSchemaColumns.push(i);
        }
    });
    const traverseUpToThisIndexAtTheTop = stateHeaderRowPresent ? 1 : 0;
    if (numericSchemaColumns.length === 1) {
        // Bob's your uncle, the only numeric column is your Balance column
        balanceColumnIndex = numericSchemaColumns[0];
    }
    else if (numericSchemaColumns.length === 0) {
        throw new Error('csv-sort/csvSort(): [THROW_ID_03] Your CSV file does not contain numeric-only columns and computer was not able to detect the "Balance" column!');
    }
    else {
        // So (numericSchemaColumns > 0) and we'll have to do some work.
        // Fine.
        //
        // Clone numericSchemaColumns array, remove columns that have the same value
        // among consecutive rows.
        // For example, accounting CSV's will have "Account number" repeated.
        // Balance is never the same on two rows, otherwise what's the point of
        // accounting if nothing happened?
        // Traverse the CSV vertically on each column from numericSchemaColumns and
        // find out `balanceColumnIndex`:
        // ----------------
        let potentialBalanceColumnIndexesList = Array.from(numericSchemaColumns);
        // iterate through `potentialBalanceColumnIndexesList`
        const deleteFromPotentialBalanceColumnIndexesList = [];
        for (let i = 0, len = potentialBalanceColumnIndexesList.length; i < len; i++) {
            // if any two rows are in sequence currently and they are equal, this column is out
            const suspectedBalanceColumnsIndexNumber = potentialBalanceColumnIndexesList[i];
            // we traverse column suspected to be "Balance" with index `index` vertically,
            // from the top to bottom. Depending if there's heading row, we start at 0 or 1,
            // which is set by `traverseUpToThisIndexAtTheTop`.
            // We will look for two rows having the same value. If it's found that column is
            // not "Balance":
            // EASY ATTEMPT TO RULE-OUT NOT-BALANCE COLUMNS
            let previousValue; // to check if two consecutive are the same
            let lookForTwoEqualAndConsecutive = true;
            let firstValue; // to check if all are the same
            let lookForAllTheSame = true;
            for (let rowNum = traverseUpToThisIndexAtTheTop, len2 = content.length; rowNum < len2; rowNum++) {
                // 1. check for two consecutive equal values
                /* istanbul ignore else */
                if (lookForTwoEqualAndConsecutive) {
                    // deliberate == to catch undefined and null
                    if (previousValue == null) {
                        previousValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
                    }
                    else if (previousValue ===
                        content[rowNum][suspectedBalanceColumnsIndexNumber]) {
                        // potentialBalanceColumnIndexesList.splice(suspectedBalanceColumnsIndexNumber, 1)
                        // don't mutate the `potentialBalanceColumnIndexesList`, do it later.
                        // Let's compile TO-DELETE list instead:
                        deleteFromPotentialBalanceColumnIndexesList.push(suspectedBalanceColumnsIndexNumber);
                        lookForTwoEqualAndConsecutive = false;
                    }
                    else {
                        previousValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
                    }
                }
                // 2. also, tell if ALL values are the same:
                /* istanbul ignore else */
                if (lookForAllTheSame) {
                    // deliberate == to catch undefined and null
                    if (firstValue == null) {
                        firstValue = content[rowNum][suspectedBalanceColumnsIndexNumber];
                    }
                    else if (content[rowNum][suspectedBalanceColumnsIndexNumber] !== firstValue) {
                        lookForAllTheSame = false;
                    }
                }
                if (!lookForTwoEqualAndConsecutive) {
                    break;
                }
            }
            /* istanbul ignore else */
            if (lookForAllTheSame) {
                stateColumnsContainingSameValueEverywhere.push(suspectedBalanceColumnsIndexNumber);
            }
        }
        // now mutate the `potentialBalanceColumnIndexesList` using
        // `deleteFromPotentialBalanceColumnIndexesList`:
        potentialBalanceColumnIndexesList = lodash_pull(potentialBalanceColumnIndexesList, ...deleteFromPotentialBalanceColumnIndexesList);
        /* istanbul ignore else */
        if (potentialBalanceColumnIndexesList.length === 1) {
            balanceColumnIndex = potentialBalanceColumnIndexesList[0];
        }
        else if (potentialBalanceColumnIndexesList.length === 0) {
            throw new Error('csv-sort/csvSort(): [THROW_ID_04] The computer can\'t find the "Balance" column! It saw some numeric-only columns, but they all seem to have certain rows with the same values as rows right below/above them!');
        }
        else ;
        // at this point 99% of normal-size, real-life bank account CSV's should have
        // "Balance" column identified because there will be both "Credit" and "Debit"
        // transaction rows which will be not exclusively numeric, but ["empty", "numeric"] type.
        // Even Lloyds Business banking CSV's that output account numbers
        // will have "Balance" column identified this stage.
    }
    if (!balanceColumnIndex) {
        throw new Error("csv-sort/csvSort(): [THROW_ID_05] Sadly computer couldn't find its way in this CSV and had to stop working on it.");
    }
    // step 4.
    // ===========================
    // query the schema and find out potential Credit/Debit columns
    // take schema, filter all indexes that are equal to or are arrays and have
    // "numeric" among their values, then remove the index of "Balance" column:
    const potentialCreditDebitColumns = lodash_pull(Array.from(schema.reduce((result, el, index) => {
        if ((typeof el === "string" && el === "numeric") ||
            (Array.isArray(el) && el.includes("numeric"))) {
            result.push(index);
        }
        return result;
    }, [])), balanceColumnIndex, ...stateColumnsContainingSameValueEverywhere);
    // step 5.
    // ===========================
    const resContent = [];
    // Now that we know the `balanceColumnIndex`, traverse the CSV rows again,
    // assembling a new array
    // step 5.1. Put the last row into the new array.
    // ---------------------------------------------------------------------------
    // Worst case scenario, if it doesn't match with anything, we'll throw in the end.
    // For now, let's assume CSV is correct, only rows are mixed.
    resContent.push(content[content.length - 1].slice(0, indexAtWhichEmptyCellsStart));
    const usedUpRows = [];
    const bottom = stateHeaderRowPresent ? 1 : 0;
    for (let y = content.length - 2; y >= bottom; y--) {
        // for each row above the last-one (which is already in place), we'll traverse
        // all the rows above to find the match.
        // go through all the rows and pick the right row which matches to the above:
        for (let suspectedRowsIndex = content.length - 2; suspectedRowsIndex >= bottom; suspectedRowsIndex--) {
            if (!usedUpRows.includes(suspectedRowsIndex)) {
                // go through each of the suspected Credit/Debit columns:
                let thisRowIsDone = false;
                for (let suspectedColIndex = 0, len = potentialCreditDebitColumns.length; suspectedColIndex < len; suspectedColIndex++) {
                    let diffVal = null;
                    if (content[suspectedRowsIndex][potentialCreditDebitColumns[suspectedColIndex]] !== "") {
                        diffVal = currency(content[suspectedRowsIndex][potentialCreditDebitColumns[suspectedColIndex]]);
                    }
                    let totalVal = null;
                    /* istanbul ignore else */
                    if (content[suspectedRowsIndex][balanceColumnIndex] !== "") {
                        totalVal = currency(content[suspectedRowsIndex][balanceColumnIndex]);
                    }
                    let topmostResContentBalance = null;
                    /* istanbul ignore else */
                    if (resContent[0][balanceColumnIndex] !== "") {
                        topmostResContentBalance = currency(resContent[0][balanceColumnIndex]).format();
                    }
                    let currentRowsDiffVal = null;
                    /* istanbul ignore else */
                    if (resContent[resContent.length - 1][potentialCreditDebitColumns[suspectedColIndex]] !== "") {
                        currentRowsDiffVal = currency(resContent[resContent.length - 1][potentialCreditDebitColumns[suspectedColIndex]]).format();
                    }
                    let lastResContentRowsBalance = null;
                    /* istanbul ignore else */
                    if (resContent[resContent.length - 1][balanceColumnIndex] !== "") {
                        lastResContentRowsBalance = currency(resContent[resContent.length - 1][balanceColumnIndex]);
                    }
                    /* istanbul ignore else */
                    if (diffVal &&
                        totalVal.add(diffVal).format() ===
                            topmostResContentBalance) {
                        // ADD THIS ROW ABOVE EVERYTHING
                        // add this row above the current HEAD in resContent lines array (index `0`)
                        resContent.unshift(content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart));
                        usedUpRows.push(suspectedRowsIndex);
                        thisRowIsDone = true;
                        break;
                    }
                    else if (diffVal &&
                        totalVal.subtract(diffVal).format() ===
                            topmostResContentBalance) {
                        // ADD THIS ROW ABOVE EVERYTHING
                        resContent.unshift(content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart));
                        usedUpRows.push(suspectedRowsIndex);
                        thisRowIsDone = true;
                        break;
                    }
                    else if (currentRowsDiffVal &&
                        lastResContentRowsBalance
                            .add(currentRowsDiffVal)
                            .format() === totalVal.format()) {
                        // ADD THIS ROW BELOW EVERYTHING
                        resContent.push(content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart));
                        usedUpRows.push(suspectedRowsIndex);
                        thisRowIsDone = true;
                        break;
                    }
                    else if (currentRowsDiffVal &&
                        lastResContentRowsBalance
                            .subtract(currentRowsDiffVal)
                            .format() === totalVal.format()) {
                        // ADD THIS ROW BELOW EVERYTHING
                        resContent.push(content[suspectedRowsIndex].slice(0, indexAtWhichEmptyCellsStart));
                        usedUpRows.push(suspectedRowsIndex);
                        thisRowIsDone = true;
                        break;
                    }
                }
                /* istanbul ignore else */
                if (thisRowIsDone) {
                    thisRowIsDone = false;
                    break;
                }
            }
        }
    }
    // restore title row if present
    /* istanbul ignore else */
    if (stateHeaderRowPresent) {
        // trim header row of trailing empty columns if they protrude outside of the (consistent row length) schema
        if (stateDataColumnRowLengthIsConsistent &&
            content[0].length > schema.length) {
            content[0].length = schema.length;
        }
        // push header row on top of the results array:
        resContent.unshift(content[0].slice(0, indexAtWhichEmptyCellsStart));
    }
    /* istanbul ignore else */
    if (content.length - (stateHeaderRowPresent ? 2 : 1) !== usedUpRows.length) {
        msgContent = "Not all rows were recognised!";
        msgType = "alert";
    }
    return {
        res: resContent,
        msgContent,
        msgType,
    };
}

exports.sort = sort;

Object.defineProperty(exports, '__esModule', { value: true });

})));
