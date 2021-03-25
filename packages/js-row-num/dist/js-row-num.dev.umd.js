/**
 * js-row-num
 * Update all row numbers in all console.logs in JS code
 * Version: 4.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/js-row-num/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jsRowNum = {}));
}(this, (function (exports) { 'use strict';

/**
 * string-collapse-leading-whitespace
 * Collapse the leading and trailing whitespace of a string
 * Version: 5.0.10
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
 * ranges-sort
 * Sort string index ranges
 * Version: 4.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-sort/
 */
const defaults$3 = {
  strictlyTwoElementsInRangeArrays: false,
  progressFn: null
};
function rSort(arrOfRanges, originalOptions) {
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return arrOfRanges;
  }
  const opts = { ...defaults$3,
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
 * Version: 7.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-merge/
 */
const defaults$2 = {
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
      opts = { ...defaults$2,
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
    opts = { ...defaults$2
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
 * ranges-push
 * Gather string index ranges
 * Version: 5.0.10
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
const defaults$1 = {
  limitToBeAddedWhitespace: false,
  limitLinebreaksCount: 1,
  mergeType: 1
};
class Ranges {
  constructor(originalOpts) {
    const opts = { ...defaults$1,
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

/**
 * ranges-apply
 * Take an array of string index ranges, delete/replace the string according to them
 * Version: 5.0.10
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

var version$1 = "4.0.10";

const version = version$1;
const BACKSLASH = `\u005C`;
const defaults = {
    padStart: 3,
    overrideRowNum: null,
    returnRangesOnly: false,
    triggerKeywords: ["console.log"],
    extractedLogContentsWereGiven: false,
};
function fixRowNums(str, originalOpts) {
    if (typeof str !== "string" || !str.length) {
        return str;
    }
    function isDigit(something) {
        return /[0-9]/.test(something);
    }
    function isAZ(something) {
        return /[A-Za-z]/.test(something);
    }
    function isObj(something) {
        return (something && typeof something === "object" && !Array.isArray(something));
    }
    const opts = { ...defaults, ...originalOpts };
    if (!opts.padStart ||
        typeof opts.padStart !== "number" ||
        (typeof opts.padStart === "number" && opts.padStart < 0)) {
        opts.padStart = 0;
    }
    const finalIndexesToDelete = new Ranges();
    let i;
    const len = str.length;
    let quotes = null;
    let consoleStartsAt = null;
    let bracketOpensAt = null;
    let currentRow = 1;
    let wasLetterDetected = false;
    let digitStartsAt = null;
    if (opts.padStart && len > 45000) {
        opts.padStart = 4;
    }
    for (i = 0; i < len; i++) {
        // count lines:
        if (opts.overrideRowNum === null &&
            (str[i] === "\n" || (str[i] === "\r" && str[i + 1] !== "\n"))) {
            currentRow += 1;
        }
        // catch closing quotes console.log( ' -----> ' <------)
        if (!opts.extractedLogContentsWereGiven &&
            quotes !== null &&
            quotes.start < i &&
            quotes.type === str[i]) {
            quotes = null;
            consoleStartsAt = null;
            bracketOpensAt = null;
            digitStartsAt = null;
            wasLetterDetected = false;
        }
        // catch opening quotes console.log( -----> ' <------ ')
        if (quotes === null &&
            (opts.extractedLogContentsWereGiven ||
                (consoleStartsAt &&
                    consoleStartsAt < i &&
                    bracketOpensAt &&
                    bracketOpensAt < i)) &&
            str[i].trim()) {
            if (str[i] === '"' || str[i] === "'" || str[i] === "`") {
                quotes = {
                    start: i,
                    type: str[i],
                };
                wasLetterDetected = false;
            }
            else if (opts.extractedLogContentsWereGiven && digitStartsAt === null) {
                if (isDigit(str[i])) {
                    digitStartsAt = i;
                }
                else {
                    break;
                }
            }
            else if (str[i].trim() &&
                str[i] !== "/" &&
                !opts.extractedLogContentsWereGiven) {
                // wipe
                consoleStartsAt = null;
                bracketOpensAt = null;
                digitStartsAt = null;
            }
        }
        // catch the first digit within console.log:
        if (quotes &&
            Number.isInteger(quotes.start) &&
            quotes.start < i &&
            !wasLetterDetected &&
            digitStartsAt === null &&
            isDigit(str[i])) {
            digitStartsAt = i;
        }
        // catch the ending of the digits within console.log:
        if (Number.isInteger(digitStartsAt) &&
            (!isDigit(str[i]) || !str[i + 1]) &&
            (i > digitStartsAt || !str[i + 1])) {
            // PS. finalIndexesToDelete is a Ranges class so we can push
            // two/three arguments and it will understand it's (range) array...
            finalIndexesToDelete.push(digitStartsAt, !isDigit(str[i]) ? i : i + 1, opts.padStart
                ? String(opts.overrideRowNum != null ? opts.overrideRowNum : currentRow).padStart(opts.padStart, "0")
                : `${opts.overrideRowNum != null ? opts.overrideRowNum : currentRow}`);
            // then, reset:
            digitStartsAt = null;
            // set wasLetterDetected as a decoy to prevent further digit lumps from being edited:
            wasLetterDetected = true;
        }
        // catch first letter within console.log:
        if (quotes &&
            Number.isInteger(quotes.start) &&
            quotes.start < i &&
            !wasLetterDetected &&
            isAZ(str[i]) &&
            !(str[i] === "n" && str[i - 1] === BACKSLASH)) {
            // Skip one of more of either patterns:
            // \u001b[${33}m
            // ${`
            // `\u001b[33m       \u001b[39m`
            // \u001B[4m        \u001B[0m
            // \u001B[4m   \u001B[0m
            // check for pattern \u001B[ + optional ${ + any amount of digits + optional } + m
            /* istanbul ignore if */
            if (
            /* istanbul ignore next */
            str[i - 1] === BACKSLASH &&
                str[i] === "u" &&
                str[i + 1] === "0" &&
                str[i + 2] === "0" &&
                str[i + 3] === "1" &&
                (str[i + 4] === "b" || str[i + 5] === "B") &&
                str[i + 5] === "[") {
                // at this moment, we have stuck here:
                //
                // console.log(`\u001b[${33}m${`291 zzz`}\u001b[${39}m`)
                //                    ^
                //           here, at this bracket
                // now, the ANSI colour digit code might be wrapped with ${} and also,
                // it can be of an indeterminate width: normally there is either one or
                // two digits.
                // We need to find where digits start.
                // There are two possibilities: either here, or after string literal ${}
                // wrapper:
                // base assumption, we're here:
                // console.log(`\u001b[33m 123 zzz \u001b[${39}m`)
                //                     ^
                //                   here
                let startMarchingForwFrom;
                if (isDigit(str[i + 6])) {
                    startMarchingForwFrom = i + 6;
                }
                else if (str[i + 6] === "$" &&
                    str[i + 7] === "{" &&
                    isDigit(str[i + 8])) {
                    startMarchingForwFrom = i + 8;
                }
                // find out where does this (possibly a sequence) of number(s) end:
                let numbersSequenceEndsAt;
                if (startMarchingForwFrom) {
                    for (let y = startMarchingForwFrom; y < len; y++) {
                        if (!isDigit(str[y])) {
                            numbersSequenceEndsAt = y;
                            break;
                        }
                    }
                }
                // answer: at "numbersSequenceEndsAt".
                // We're at the next character where digits end. That is:
                // console.log(`\u001b[33m 123 zzz \u001b[${39}m`)
                //                       ^
                //                     here, OR
                // console.log(`\u001b[${33}m 123 zzz \u001b[${39}m`)
                //                         ^
                //                       here
                let ansiSequencesLetterMAt;
                if (numbersSequenceEndsAt !== undefined &&
                    str[numbersSequenceEndsAt] === "m") {
                    // if number follows "m", this is it:
                    ansiSequencesLetterMAt = numbersSequenceEndsAt;
                }
                else if (numbersSequenceEndsAt !== undefined &&
                    str[numbersSequenceEndsAt] === "}" &&
                    str[numbersSequenceEndsAt + 1] === "m") {
                    ansiSequencesLetterMAt = numbersSequenceEndsAt + 1;
                }
                /* istanbul ignore else */
                if (!ansiSequencesLetterMAt) {
                    // if ANSI closing "m" hasn't been detected yet, bail:
                    wasLetterDetected = true;
                    continue;
                }
                /* istanbul ignore else */
                if (str[ansiSequencesLetterMAt + 1] === "$" &&
                    str[ansiSequencesLetterMAt + 2] === "{" &&
                    str[ansiSequencesLetterMAt + 3] === "`") {
                    i = ansiSequencesLetterMAt + 3;
                    continue;
                }
            }
            wasLetterDetected = true;
        }
        // catch the opening bracket of console.log ---->(<----- )
        if (!bracketOpensAt &&
            str[i].trim() &&
            consoleStartsAt &&
            consoleStartsAt <= i) {
            if (str[i] === "(") {
                bracketOpensAt = i;
            }
            else {
                // wipe
                consoleStartsAt = null;
                digitStartsAt = null;
            }
        }
        // catch the trigger keywords
        if (isObj(opts) &&
            opts.triggerKeywords &&
            Array.isArray(opts.triggerKeywords)) {
            // check does any of the trigger keywords match
            let caughtKeyword;
            for (let y = 0, len2 = opts.triggerKeywords.length; y < len2; y++) {
                /* istanbul ignore else */
                if (str.startsWith(opts.triggerKeywords[y], i)) {
                    caughtKeyword = opts.triggerKeywords[y];
                    break;
                }
            }
            // if any of trigger keywords starts here
            /* istanbul ignore else */
            if (caughtKeyword) {
                consoleStartsAt = i + caughtKeyword.length;
                // offset the index so we don't traverse twice what was traversed already:
                i = i + caughtKeyword.length - 1;
                continue;
            }
        }
    }
    // wipe
    quotes = null;
    consoleStartsAt = null;
    bracketOpensAt = null;
    currentRow = 1;
    wasLetterDetected = undefined;
    digitStartsAt = null;
    currentRow = 1;
    if (opts.returnRangesOnly) {
        return finalIndexesToDelete.current();
    }
    if (finalIndexesToDelete.current()) {
        return rApply(str, finalIndexesToDelete.current());
    }
    return str;
}

exports.defaults = defaults;
exports.fixRowNums = fixRowNums;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
