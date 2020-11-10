/**
 * ranges-merge
 * Merge and sort string index ranges
 * Version: 5.0.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-merge/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rangesMerge = factory());
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
   * Version: 3.13.4
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

  // case #1. exact extension:
  // [ [1, 5], [5, 10] ] => [ [1, 10] ]
  // case #2. overlap:
  // [ [1, 4], [3, 5] ] => [ [1, 5] ]

  function mergeRanges(arrOfRanges, originalOpts) {
    //
    // internal functions:
    // ---------------------------------------------------------------------------
    function isStr(something) {
      return typeof something === "string";
    }

    function isObj(something) {
      return something && _typeof(something) === "object" && !Array.isArray(something);
    } // quick ending:
    // ---------------------------------------------------------------------------


    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
      return null;
    } // tend the opts:
    // ---------------------------------------------------------------------------


    var defaults = {
      mergeType: 1,
      progressFn: null,
      joinRangesThatTouchEdges: true
    };
    var opts;

    if (originalOpts) {
      if (isObj(originalOpts)) {
        opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts); // 1. validate opts.progressFn

        if (opts.progressFn && isObj(opts.progressFn) && !Object.keys(opts.progressFn).length) {
          opts.progressFn = null;
        } else if (opts.progressFn && typeof opts.progressFn !== "function") {
          throw new Error("ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: \"".concat(_typeof(opts.progressFn), "\", equal to ").concat(JSON.stringify(opts.progressFn, null, 4)));
        } // 2. validate opts.mergeType


        if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
          if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
            opts.mergeType = 1;
          } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
            opts.mergeType = 2;
          } else {
            throw new Error("ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.mergeType), "\", equal to ").concat(JSON.stringify(opts.mergeType, null, 4)));
          }
        } // 3. validate opts.joinRangesThatTouchEdges


        if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
          throw new Error("ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.joinRangesThatTouchEdges), "\", equal to ").concat(JSON.stringify(opts.joinRangesThatTouchEdges, null, 4)));
        }
      } else {
        throw new Error("emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (type ").concat(_typeof(originalOpts), ")"));
      }
    } else {
      opts = _objectSpread2({}, defaults);
    } // progress-wise, sort takes first 20%
    // two-level-deep array clone:


    var filtered = arrOfRanges // filter out null
    .filter(function (range) {
      return range;
    }).map(function (subarr) {
      return _toConsumableArray(subarr);
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
      sortedRanges = rangesSort(filtered, {
        progressFn: function progressFn(percentage) {
          percentageDone = Math.floor(percentage / 5); // ensure each percent is passed only once:

          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;
            opts.progressFn(percentageDone);
          }
        }
      });
    } else {
      sortedRanges = rangesSort(filtered);
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
            } else if (sortedRanges[i - 1][2] !== undefined) {
              // if there's a clash of "insert" values:
              if (opts.mergeType === 2 && sortedRanges[i - 1][0] === sortedRanges[i][0]) {
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

  return mergeRanges;

})));
