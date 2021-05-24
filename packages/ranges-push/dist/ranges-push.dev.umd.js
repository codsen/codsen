/**
 * @name ranges-push
 * @fileoverview Gather string index ranges
 * @version 5.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-push/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rangesPush = {}));
}(this, (function (exports) { 'use strict';

/**
 * @name string-collapse-leading-whitespace
 * @fileoverview Collapse the leading and trailing whitespace of a string
 * @version 5.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-collapse-leading-whitespace/}
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
 * @name ranges-sort
 * @fileoverview Sort string index ranges
 * @version 4.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-sort/}
 */
const defaults$2 = {
  strictlyTwoElementsInRangeArrays: false,
  progressFn: null
};
function rSort(arrOfRanges, originalOptions) {
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return arrOfRanges;
  }
  const opts = { ...defaults$2,
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
 * @name ranges-merge
 * @fileoverview Merge and sort string index ranges
 * @version 7.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-merge/}
 */
const defaults$1 = {
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
      opts = { ...defaults$1,
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
    opts = { ...defaults$1
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

var version$1 = "5.1.0";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
const version = version$1;
function existy(x) {
    return x != null;
}
function isNum(something) {
    return Number.isInteger(something) && something >= 0;
}
function isStr(something) {
    return typeof something === "string";
}
const defaults = {
    limitToBeAddedWhitespace: false,
    limitLinebreaksCount: 1,
    mergeType: 1,
};
// -----------------------------------------------------------------------------
class Ranges {
    //
    // O P T I O N S
    // =============
    constructor(originalOpts) {
        const opts = { ...defaults, ...originalOpts };
        if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
            if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
                opts.mergeType = 1;
            }
            else if (isStr(opts.mergeType) &&
                opts.mergeType.trim() === "2") {
                opts.mergeType = 2;
            }
            else {
                throw new Error(`ranges-push: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${JSON.stringify(opts.mergeType, null, 4)}`);
            }
        }
        // so it's correct, let's get it in:
        this.opts = opts;
        this.ranges = [];
    }
    add(originalFrom, originalTo, addVal) {
        if (originalFrom == null && originalTo == null) {
            // absent ranges are marked as null - instead of array of arrays we can receive a null
            return;
        }
        if (existy(originalFrom) && !existy(originalTo)) {
            if (Array.isArray(originalFrom)) {
                if (originalFrom.length) {
                    if (originalFrom.some((el) => Array.isArray(el))) {
                        originalFrom.forEach((thing) => {
                            if (Array.isArray(thing)) {
                                // recursively feed this subarray, hopefully it's an array
                                this.add(...thing);
                            }
                            // just skip other cases
                        });
                        return;
                    }
                    if (originalFrom.length &&
                        isNum(+originalFrom[0]) &&
                        isNum(+originalFrom[1])) {
                        // recursively pass in those values
                        this.add(...originalFrom);
                    }
                }
                // else,
                return;
            }
            throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_12] the first input argument, "from" is set (${JSON.stringify(originalFrom, null, 0)}) but second-one, "to" is not (${JSON.stringify(originalTo, null, 0)})`);
        }
        else if (!existy(originalFrom) && existy(originalTo)) {
            throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, "to" is set (${JSON.stringify(originalTo, null, 0)}) but first-one, "from" is not (${JSON.stringify(originalFrom, null, 0)})`);
        }
        const from = +originalFrom;
        const to = +originalTo;
        if (isNum(addVal)) {
            // eslint-disable-next-line no-param-reassign
            addVal = String(addVal);
        }
        // validation
        if (isNum(from) && isNum(to)) {
            // This means two indexes were given as arguments. Business as usual.
            if (existy(addVal) && !isStr(addVal) && !isNum(addVal)) {
                throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ${typeof addVal}, equal to:\n${JSON.stringify(addVal, null, 4)}`);
            }
            // Does the incoming "from" value match the existing last element's "to" value?
            if (existy(this.ranges) &&
                Array.isArray(this.last()) &&
                from === this.last()[1]) {
                // The incoming range is an exact extension of the last range, like
                // [1, 100] gets added [100, 200] => you can merge into: [1, 200].
                this.last()[1] = to;
                // console.log(`addVal = ${JSON.stringify(addVal, null, 4)}`)
                if (this.last()[2] === null || addVal === null) ;
                if (this.last()[2] !== null && existy(addVal)) {
                    let calculatedVal = this.last()[2] &&
                        this.last()[2].length > 0 &&
                        (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1)
                        ? this.last()[2] + addVal
                        : addVal;
                    if (this.opts.limitToBeAddedWhitespace) {
                        calculatedVal = collWhitespace(calculatedVal, this.opts.limitLinebreaksCount);
                    }
                    if (!(isStr(calculatedVal) && !calculatedVal.length)) {
                        // don't let the zero-length strings past
                        this.last()[2] = calculatedVal;
                    }
                }
            }
            else {
                if (!this.ranges) {
                    this.ranges = [];
                }
                const whatToPush = addVal !== undefined && !(isStr(addVal) && !addVal.length)
                    ? [
                        from,
                        to,
                        addVal && this.opts.limitToBeAddedWhitespace
                            ? collWhitespace(addVal, this.opts.limitLinebreaksCount)
                            : addVal,
                    ]
                    : [from, to];
                this.ranges.push(whatToPush);
            }
        }
        else {
            // Error somewhere!
            // Let's find out where.
            // is it first arg?
            if (!(isNum(from) && from >= 0)) {
                throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_09] "from" value, the first input argument, must be a natural number or zero! Currently it's of a type "${typeof from}" equal to: ${JSON.stringify(from, null, 4)}`);
            }
            else {
                // then it's second...
                throw new TypeError(`ranges-push/Ranges/add(): [THROW_ID_10] "to" value, the second input argument, must be a natural number or zero! Currently it's of a type "${typeof to}" equal to: ${JSON.stringify(to, null, 4)}`);
            }
        }
    }
    push(originalFrom, originalTo, addVal) {
        this.add(originalFrom, originalTo, addVal);
    }
    // C U R R E N T () - kindof a getter
    // ==================================
    current() {
        if (Array.isArray(this.ranges) && this.ranges.length) {
            // beware, merging can return null
            this.ranges = rMerge(this.ranges, {
                mergeType: this.opts.mergeType,
            });
            if (this.ranges && this.opts.limitToBeAddedWhitespace) {
                return this.ranges.map((val) => {
                    if (existy(val[2])) {
                        return [
                            val[0],
                            val[1],
                            collWhitespace(val[2], this.opts.limitLinebreaksCount),
                        ];
                    }
                    return val;
                });
            }
            return this.ranges;
        }
        return null;
    }
    // W I P E ()
    // ==========
    wipe() {
        this.ranges = [];
    }
    // R E P L A C E ()
    // ==========
    replace(givenRanges) {
        if (Array.isArray(givenRanges) && givenRanges.length) {
            // Now, ranges can be array of arrays, correct format but also single
            // range, an array of two natural numbers might be given.
            // Let's put safety latch against such cases
            if (!(Array.isArray(givenRanges[0]) && isNum(givenRanges[0][0]))) {
                throw new Error(`ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ${JSON.stringify(givenRanges[0], null, 4)} should be an array and its first element should be an integer, a string index.`);
            }
            else {
                this.ranges = Array.from(givenRanges);
            }
        }
        else {
            this.ranges = [];
        }
    }
    // L A S T ()
    // ==========
    last() {
        if (Array.isArray(this.ranges) && this.ranges.length) {
            return this.ranges[this.ranges.length - 1];
        }
        return null;
    }
}

exports.Ranges = Ranges;
exports.defaults = defaults;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
