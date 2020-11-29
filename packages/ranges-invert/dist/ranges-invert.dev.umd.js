/**
 * ranges-invert
 * Invert string index ranges
 * Version: 3.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-invert/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rangesInvert = factory());
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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /**
   * ranges-sort
   * Sort string index ranges
   * Version: 3.14.0
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://codsen.com/os/ranges-sort/
   */
  function rangesSort(arrOfRanges, originalOptions) {
    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
      return arrOfRanges;
    }

    var defaults = {
      strictlyTwoElementsInRangeArrays: false,
      progressFn: null
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOptions);

    var culpritsIndex;
    var culpritsLen;

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
      throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") has not two but ").concat(culpritsLen, " elements!"));
    }

    if (!arrOfRanges.filter(function (range) {
      return range;
    }).every(function (rangeArr, indx) {
      if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") does not consist of only natural numbers!"));
    }

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

  function mergeRanges(arrOfRanges, originalOpts) {
    function isObj(something) {
      return something && _typeof(something) === "object" && !Array.isArray(something);
    }

    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
      return null;
    }

    var defaults = {
      mergeType: 1,
      progressFn: null,
      joinRangesThatTouchEdges: true
    };
    var opts;

    if (originalOpts) {
      if (isObj(originalOpts)) {
        opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

        if (opts.progressFn && isObj(opts.progressFn) && !Object.keys(opts.progressFn).length) {
          opts.progressFn = null;
        } else if (opts.progressFn && typeof opts.progressFn !== "function") {
          throw new Error("ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: \"".concat(_typeof(opts.progressFn), "\", equal to ").concat(JSON.stringify(opts.progressFn, null, 4)));
        }

        if (opts.mergeType && +opts.mergeType !== 1 && +opts.mergeType !== 2) {
          throw new Error("ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.mergeType), "\", equal to ").concat(JSON.stringify(opts.mergeType, null, 4)));
        }

        if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
          throw new Error("ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.joinRangesThatTouchEdges), "\", equal to ").concat(JSON.stringify(opts.joinRangesThatTouchEdges, null, 4)));
        }
      } else {
        throw new Error("emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (type ").concat(_typeof(originalOpts), ")"));
      }
    } else {
      opts = _objectSpread2({}, defaults);
    }

    var filtered = arrOfRanges.filter(function (range) {
      return range;
    }).map(function (subarr) {
      return _toConsumableArray(subarr);
    }).filter(function (rangeArr) {
      return rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1];
    });
    var sortedRanges;
    var lastPercentageDone;
    var percentageDone;

    if (opts.progressFn) {
      sortedRanges = rangesSort(filtered, {
        progressFn: function progressFn(percentage) {
          percentageDone = Math.floor(percentage / 5);

          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;
            opts.progressFn(percentageDone);
          }
        }
      });
    } else {
      sortedRanges = rangesSort(filtered);
    }

    var len = sortedRanges.length - 1;

    for (var i = len; i > 0; i--) {
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
            } else if (sortedRanges[i - 1][2] !== undefined) {
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

  function isStr(something) {
    return typeof something === "string";
  }

  function rangesCrop(arrOfRanges, strLen) {
    if (!Array.isArray(arrOfRanges)) {
      throw new TypeError("ranges-crop: [THROW_ID_01] The first input's argument must be an array, consisting of range arrays! Currently its type is: ".concat(_typeof(arrOfRanges), ", equal to: ").concat(JSON.stringify(arrOfRanges, null, 4)));
    }

    if (!Number.isInteger(strLen)) {
      throw new TypeError("ranges-crop: [THROW_ID_02] The second input's argument must be a natural number or zero (coming from String.length)! Currently its type is: ".concat(_typeof(strLen), ", equal to: ").concat(JSON.stringify(strLen, null, 4)));
    }

    if (!arrOfRanges.filter(function (range) {
      return range;
    }).length) {
      return arrOfRanges.filter(function (range) {
        return range;
      });
    }

    var culpritsIndex;

    if (!arrOfRanges.filter(function (range) {
      return range;
    }).every(function (rangeArr, indx) {
      if (!Number.isInteger(rangeArr[0]) || !Number.isInteger(rangeArr[1])) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
        throw new TypeError("ranges-crop: [THROW_ID_03] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ".concat(JSON.stringify(arrOfRanges, null, 0), "!"));
      }

      throw new TypeError("ranges-crop: [THROW_ID_04] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ".concat(culpritsIndex + 1, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), ") does not consist of only natural numbers!"));
    }

    if (!arrOfRanges.filter(function (range) {
      return range;
    }).every(function (rangeArr, indx) {
      if (rangeArr[2] != null && !isStr(rangeArr[2])) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-crop: [THROW_ID_05] The third argument, if present at all, should be of a string-type or null. Currently the ".concat(culpritsIndex, "th range ").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), " has a argument in the range of a type ").concat(_typeof(arrOfRanges[culpritsIndex][2])));
    }

    var res = mergeRanges(arrOfRanges).filter(function (singleRangeArr) {
      return singleRangeArr[0] <= strLen && (singleRangeArr[2] !== undefined || singleRangeArr[0] < strLen);
    }).map(function (singleRangeArr) {
      if (singleRangeArr[1] > strLen) {
        if (singleRangeArr[2] !== undefined) {
          return [singleRangeArr[0], strLen, singleRangeArr[2]];
        }

        return [singleRangeArr[0], strLen];
      }

      return singleRangeArr;
    });
    return res;
  }

  function rangesInvert(arrOfRanges, strLen, originalOptions) {
    if (!Array.isArray(arrOfRanges) && arrOfRanges !== null) {
      throw new TypeError("ranges-invert: [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: ".concat(_typeof(arrOfRanges), ", equal to: ").concat(JSON.stringify(arrOfRanges, null, 4)));
    } // strLen validation


    if (!Number.isInteger(strLen) || strLen < 0) {
      throw new TypeError("ranges-invert: [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: ".concat(_typeof(strLen), ", equal to: ").concat(JSON.stringify(strLen, null, 4)));
    } // arrOfRanges validation


    if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
      throw new TypeError("ranges-invert: [THROW_ID_07] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ".concat(JSON.stringify(arrOfRanges, null, 0), "!"));
    }

    if (!Array.isArray(arrOfRanges) || !arrOfRanges.filter(function (range) {
      return Array.isArray(range) && range[0] !== range[1];
    }).length || !strLen) {
      // this could be ranges.current() from "ranges-push" npm library
      // which means, absence of any ranges, so invert result is everything:
      // from index zero to index string.length
      if (!strLen) {
        return null;
      }

      return [[0, strLen]];
    } // opts validation
    // declare defaults, so we can enforce types later:


    var defaults = {
      strictlyTwoElementsInRangeArrays: false,
      skipChecks: false
    }; // fill any settings with defaults if missing:

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOptions); // arrOfRanges validation


    var culpritsIndex;
    var culpritsLen; // validate does every range consist of exactly two indexes:

    if (!opts.skipChecks && opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.filter(function (range) {
      return range;
    }).every(function (rangeArr, indx) {
      if (rangeArr.length !== 2) {
        culpritsIndex = indx;
        culpritsLen = rangeArr.length;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-invert: [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), ") has not two but ").concat(culpritsLen, " elements!"));
    } // validate are range indexes natural numbers:


    if (!opts.skipChecks && !arrOfRanges.every(function (rangeArr, indx) {
      if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-invert: [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ".concat(culpritsIndex + 1, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), ") does not consist of only natural numbers!"));
    }

    var prep;

    if (!opts.skipChecks) {
      // if checks are enabled, filter merged ranges.
      // For posterity, merging is general cleaning: sorting, joining overlapping
      // ranges, also deleting blank ranges (equal start and end indexes with
      // nothing to insert). Imagine, how can we iterate unsorted ranges, for
      // example: [[1, 3], [0, 4]] -> it's impossible because order is messed up
      // and there's overlap. In reality, merged result is simply [[0, 4]].
      // Then, we invert from 4 onwards to the end of reference string length.
      prep = mergeRanges(arrOfRanges.filter(function (rangeArr) {
        return rangeArr[0] !== rangeArr[1];
      }));
    } else {
      // but if checks are turned off, filter straight away:
      prep = arrOfRanges.filter(function (rangeArr) {
        return rangeArr[0] !== rangeArr[1];
      }); // hopefully input ranges were really sorted...
    }

    var res = prep.reduce(function (accum, currArr, i, arr) {
      var res2 = []; // if the first range's first index is not zero, additionally add zero range:

      if (i === 0 && arr[0][0] !== 0) {
        res2.push([0, arr[0][0]]);
      } // Now, for every range, add inverted range that follows. For example,
      // if we've got [[1, 2], [4, 5]] and we're processing [1, 2], then
      // add the inverted chunk that follows it, [2, 4].


      var endingIndex = i < arr.length - 1 ? arr[i + 1][0] : strLen;

      if (currArr[1] !== endingIndex) {
        // this can happen only when opts.skipChecks is on:
        if (opts.skipChecks && currArr[1] > endingIndex) {
          throw new TypeError("ranges-invert: [THROW_ID_08] The checking (opts.skipChecks) is off and input ranges were not sorted! We nearly wrote range [".concat(currArr[1], ", ").concat(endingIndex, "] which is backwards. For investigation, whole ranges array is:\n").concat(JSON.stringify(arr, null, 0)));
        }

        res2.push([currArr[1], endingIndex]);
      }

      return accum.concat(res2);
    }, []);
    return rangesCrop(res, strLen);
  }

  return rangesInvert;

})));
