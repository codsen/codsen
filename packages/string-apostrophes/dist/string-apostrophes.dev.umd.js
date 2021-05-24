/**
 * @name string-apostrophes
 * @fileoverview Comprehensive, HTML-entities-aware tool to typographically-correct the apostrophes and single/double quotes
 * @version 1.5.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-apostrophes/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.stringApostrophes = {}));
}(this, (function (exports) { 'use strict';

/**
 * @name ranges-sort
 * @fileoverview Sort string index ranges
 * @version 4.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-sort/}
 */
const defaults$1 = {
  strictlyTwoElementsInRangeArrays: false,
  progressFn: null
};
function rSort(arrOfRanges, originalOptions) {
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return arrOfRanges;
  }
  const opts = { ...defaults$1,
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
const defaults = {
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
      opts = { ...defaults,
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
    opts = { ...defaults
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
 * @name ranges-apply
 * @fileoverview Take an array of string index ranges, delete/replace the string according to them
 * @version 5.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-apply/}
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

var version$1 = "1.5.0";

const version = version$1;
function convertOne(str, { from, to, value, convertEntities = true, convertApostrophes = true, offsetBy, }) {
    // insurance
    // =========
    if (!Number.isInteger(from) || from < 0) {
        throw new Error(`string-apostrophes: [THROW_ID_01] options objects key "to", a starting string index, is wrong! It was given as ${from} (type ${typeof from})`);
    }
    if (!Number.isInteger(to)) {
        to = from + 1;
    }
    // consts
    // ======
    const rangesArr = [];
    const leftSingleQuote = "\u2018";
    const rightSingleQuote = "\u2019";
    const leftDoubleQuote = "\u201C";
    const rightDoubleQuote = "\u201D";
    const singlePrime = "\u2032";
    const doublePrime = "\u2033";
    const punctuationChars = [".", ",", ";", "!", "?"];
    // const rawNDash = "\u2013";
    // const rawMDash = "\u2014";
    // f's
    // ===
    function isDigitStr(str2) {
        return (typeof str2 === "string" &&
            str2.charCodeAt(0) >= 48 &&
            str2.charCodeAt(0) <= 57);
    }
    function isLetter(str2) {
        return (typeof str2 === "string" &&
            !!str2.length &&
            str2.toUpperCase() !== str2.toLowerCase());
    }
    // The following section detects apostrophes, with aim to convert them to
    // curlie right single quote or similar.
    // However, we also need to tackle cases where wrong-side apostrophe is put,
    // for example, right side single quote instead of left side or the opposite.
    if ((value &&
        [`'`, leftSingleQuote, rightSingleQuote, singlePrime].includes(value)) ||
        (to === from + 1 &&
            [`'`, leftSingleQuote, rightSingleQuote, singlePrime].includes(str[from]))) {
        // IF SINGLE QUOTE OR APOSTROPHE, the '
        // OR LEFT/RIGHT SINGLE QUOTES OR SINGLE PRIME
        if (str[from - 1] &&
            str[to] &&
            isDigitStr(str[from - 1]) &&
            !isLetter(str[to])) {
            if (convertApostrophes &&
                str.slice(from, to) !== (convertEntities ? "&prime;" : singlePrime) &&
                value !== (convertEntities ? "&prime;" : singlePrime)) {
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&prime;" : singlePrime,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `'` &&
                value !== `'`) {
                rangesArr.push([from, to, `'`]);
            }
        }
        else if (str[to] &&
            str[to + 1] &&
            str[to] === "n" &&
            str.slice(from, to) ===
                str.slice(to + 1, to + 1 + (to - from)) // ensure quotes/apostrophes match
        ) {
            // specifically take care of 'n' as in "rock ’n’ roll"
            if (convertApostrophes &&
                str.slice(from, to + 2) !==
                    (convertEntities
                        ? "&rsquo;n&rsquo;"
                        : `${rightSingleQuote}n${rightSingleQuote}`) &&
                value !==
                    (convertEntities
                        ? "&rsquo;n&rsquo;"
                        : `${rightSingleQuote}n${rightSingleQuote}`)) {
                rangesArr.push([
                    from,
                    to + 2,
                    convertEntities
                        ? "&rsquo;n&rsquo;"
                        : `${rightSingleQuote}n${rightSingleQuote}`,
                ]);
                /* istanbul ignore next */
                if (typeof offsetBy === "function") {
                    offsetBy(2);
                }
            }
            else if (!convertApostrophes &&
                str.slice(from, to + 2) !== "'n'" &&
                value !== "'n'") {
                rangesArr.push([from, to + 2, "'n'"]);
                /* istanbul ignore next */
                if (typeof offsetBy === "function") {
                    offsetBy(2);
                }
            }
        }
        else if ((str[to] &&
            str[to].toLowerCase() === "t" &&
            (!str[to + 1] ||
                !str[to + 1].trim() ||
                str[to + 1].toLowerCase() === "i")) ||
            (str[to] &&
                str[to + 2] &&
                str[to].toLowerCase() === "t" &&
                str[to + 1].toLowerCase() === "w" &&
                (str[to + 2].toLowerCase() === "a" ||
                    str[to + 2].toLowerCase() === "e" ||
                    str[to + 2].toLowerCase() === "i" ||
                    str[to + 2].toLowerCase() === "o")) ||
            (str[to] &&
                str[to + 1] &&
                str[to].toLowerCase() === "e" &&
                str[to + 1].toLowerCase() === "m") ||
            (str[to] &&
                str[to + 4] &&
                str[to].toLowerCase() === "c" &&
                str[to + 1].toLowerCase() === "a" &&
                str[to + 2].toLowerCase() === "u" &&
                str[to + 3].toLowerCase() === "s" &&
                str[to + 4].toLowerCase() === "e") ||
            (str[to] && isDigitStr(str[to]))) {
            if (convertApostrophes &&
                str.slice(from, to) !==
                    (convertEntities ? "&rsquo;" : rightSingleQuote) &&
                value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
                // first, take care of 'tis, 'twas, 'twere, 'twould and so on
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&rsquo;" : rightSingleQuote,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== "'" &&
                value !== "'") {
                rangesArr.push([from, to, "'"]);
            }
        }
        else if (str[from - 1] &&
            str[to] &&
            punctuationChars.includes(str[from - 1])) {
            // if there's punctuation on the left and something on the right:
            if (!str[to].trim()) {
                if (convertApostrophes &&
                    str.slice(from, to) !==
                        (convertEntities ? "&rsquo;" : rightSingleQuote) &&
                    value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
                    rangesArr.push([
                        from,
                        to,
                        convertEntities ? "&rsquo;" : rightSingleQuote,
                    ]);
                }
                else if (!convertApostrophes &&
                    str.slice(from, to) !== "'" &&
                    value !== "'") {
                    rangesArr.push([from, to, "'"]);
                }
            }
            else if (str[to] === `"` && // double quote follows
                str[to + 1] &&
                !str[to + 1].trim() // and whitespace after
            ) {
                if (convertApostrophes &&
                    str.slice(from, to + 1) !==
                        (convertEntities
                            ? "&rsquo;&rdquo;"
                            : `${rightSingleQuote}${rightDoubleQuote}`) &&
                    value !==
                        (convertEntities
                            ? "&rsquo;&rdquo;"
                            : `${rightSingleQuote}${rightDoubleQuote}`)) {
                    rangesArr.push([
                        from,
                        to + 1,
                        `${convertEntities
                            ? "&rsquo;&rdquo;"
                            : `${rightSingleQuote}${rightDoubleQuote}`}`,
                    ]);
                    /* istanbul ignore next */
                    if (typeof offsetBy === "function") {
                        offsetBy(1);
                    }
                }
                else if (!convertApostrophes &&
                    str.slice(from, to + 1) !== `'"` &&
                    value !== `'"`) {
                    rangesArr.push([from, to + 1, `'"`]);
                    /* istanbul ignore next */
                    if (typeof offsetBy === "function") {
                        offsetBy(1);
                    }
                }
            }
        }
        else if (from === 0 && str.slice(to).trim()) {
            // if it's the beginning of a string
            if (convertApostrophes &&
                str.slice(from, to) !==
                    (convertEntities ? "&lsquo;" : leftSingleQuote) &&
                value !== (convertEntities ? "&lsquo;" : leftSingleQuote)) {
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&lsquo;" : leftSingleQuote,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `'` &&
                value !== `'`) {
                rangesArr.push([from, to, `'`]);
            }
        }
        else if (!str[to] && str.slice(0, from).trim()) {
            //
            if (convertApostrophes &&
                str.slice(from, to) !==
                    (convertEntities ? "&rsquo;" : rightSingleQuote) &&
                value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
                // 3. if it's the ending of a string
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&rsquo;" : rightSingleQuote,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `'` &&
                value !== `'`) {
                rangesArr.push([from, to, `'`]);
            }
        }
        else if (str[from - 1] &&
            str[to] &&
            (isLetter(str[from - 1]) || isDigitStr(str[from - 1])) &&
            (isLetter(str[to]) || isDigitStr(str[to]))) {
            // equivalent of /(\w)'(\w)/g
            // single quote surrounded with alphanumeric characters
            if (convertApostrophes) {
                // exception for a few Hawaiian words:
                if (((str[to] &&
                    str[from - 5] &&
                    str[from - 5].toLowerCase() === "h" &&
                    str[from - 4].toLowerCase() === "a" &&
                    str[from - 3].toLowerCase() === "w" &&
                    str[from - 2].toLowerCase() === "a" &&
                    str[from - 1].toLowerCase() === "i" &&
                    str[to].toLowerCase() === "i") ||
                    (str[from - 1] &&
                        str[from - 1].toLowerCase() === "o" &&
                        str[to + 2] &&
                        str[to].toLowerCase() === "a" &&
                        str[to + 1].toLowerCase() === "h" &&
                        str[to + 2].toLowerCase() === "u")) &&
                    str.slice(from, to) !==
                        (convertEntities ? "&lsquo;" : leftSingleQuote) &&
                    value !== (convertEntities ? "&lsquo;" : leftSingleQuote)) {
                    rangesArr.push([
                        from,
                        to,
                        convertEntities ? "&lsquo;" : leftSingleQuote,
                    ]);
                }
                else if (str.slice(from, to) !==
                    (convertEntities ? "&rsquo;" : rightSingleQuote) &&
                    value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
                    rangesArr.push([
                        from,
                        to,
                        convertEntities ? "&rsquo;" : rightSingleQuote,
                    ]);
                }
            }
            else if (str.slice(from, to) !== "'" && value !== "'") {
                // not convertApostrophes - remove anything that's not apostrophe
                rangesArr.push([from, to, `'`]);
            }
        }
        else if (str[to] &&
            (isLetter(str[to]) || isDigitStr(str[to]))) {
            // equivalent of /'\b/g
            // alphanumeric follows
            if (convertApostrophes &&
                str.slice(from, to) !==
                    (convertEntities ? "&lsquo;" : leftSingleQuote) &&
                value !== (convertEntities ? "&lsquo;" : leftSingleQuote)) {
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&lsquo;" : leftSingleQuote,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `'` &&
                value !== `'`) {
                rangesArr.push([from, to, `'`]);
            }
        }
        else if (isLetter(str[from - 1]) || isDigitStr(str[from - 1])) {
            // equivalent of /'\b/g
            // alphanumeric precedes
            if (convertApostrophes &&
                str.slice(from, to) !==
                    (convertEntities ? "&rsquo;" : rightSingleQuote) &&
                value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&rsquo;" : rightSingleQuote,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `'` &&
                value !== `'`) {
                rangesArr.push([from, to, `'`]);
            }
        }
        else if (str[from - 1] && !str[from - 1].trim()) {
            // whitespace in front
            if (convertApostrophes &&
                str.slice(from, to) !==
                    (convertEntities ? "&lsquo;" : leftSingleQuote) &&
                value !== (convertEntities ? "&lsquo;" : leftSingleQuote)) {
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&lsquo;" : leftSingleQuote,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `'` &&
                value !== `'`) {
                rangesArr.push([from, to, `'`]);
            }
        }
        else if (str[to] && !str[to].trim()) {
            // whitespace after
            if (convertApostrophes &&
                str.slice(from, to) !==
                    (convertEntities ? "&rsquo;" : rightSingleQuote) &&
                value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&rsquo;" : rightSingleQuote,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `'` &&
                value !== `'`) {
                rangesArr.push([from, to, `'`]);
            }
        }
    }
    else if ([`"`, leftDoubleQuote, rightDoubleQuote, doublePrime].includes(value) ||
        (to === from + 1 &&
            [`"`, leftDoubleQuote, rightDoubleQuote, doublePrime].includes(str[from]))) {
        // IF DOUBLE QUOTE (") OR OTHER TYPES OF DOUBLE QUOTES
        if (str[from - 1] &&
            isDigitStr(str[from - 1]) &&
            str[to] &&
            str[to] !== "'" &&
            str[to] !== '"' &&
            str[to] !== rightSingleQuote &&
            str[to] !== rightDoubleQuote &&
            str[to] !== leftSingleQuote &&
            str[to] !== leftDoubleQuote) {
            // 0.
            if (convertApostrophes &&
                str.slice(from, to) !== (convertEntities ? "&Prime;" : doublePrime) &&
                value !== (convertEntities ? "&Prime;" : doublePrime)) {
                // replace double quotes meaning inches with double prime symbol:
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&Prime;" : doublePrime,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `"` &&
                value !== `"`) {
                rangesArr.push([from, to, `"`]);
            }
        }
        else if (str[from - 1] &&
            str[to] &&
            punctuationChars.includes(str[from - 1])) {
            // 1.
            if (!str[to].trim()) {
                if (convertApostrophes &&
                    str.slice(from, to) !==
                        (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
                    value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)) {
                    rangesArr.push([
                        from,
                        to,
                        convertEntities ? "&rdquo;" : rightDoubleQuote,
                    ]);
                }
                else if (!convertApostrophes &&
                    str.slice(from, to) !== `"` &&
                    value !== `"`) {
                    rangesArr.push([from, to, `"`]);
                }
            }
            else if (str[to] === `'` && // single quote follows
                str[to + 1] &&
                !str[to + 1].trim()) {
                if (convertApostrophes &&
                    str.slice(from, to + 1) !==
                        (convertEntities
                            ? "&rdquo;&rsquo;"
                            : `${rightDoubleQuote}${rightSingleQuote}`) &&
                    value !==
                        (convertEntities
                            ? "&rdquo;&rsquo;"
                            : `${rightDoubleQuote}${rightSingleQuote}`)) {
                    rangesArr.push([
                        from,
                        to + 1,
                        convertEntities
                            ? "&rdquo;&rsquo;"
                            : `${rightDoubleQuote}${rightSingleQuote}`,
                    ]);
                    /* istanbul ignore next */
                    if (typeof offsetBy === "function") {
                        offsetBy(1);
                    }
                }
                else if (!convertApostrophes &&
                    str.slice(from, to + 1) !== `"'` &&
                    value !== `"'`) {
                    rangesArr.push([from, to + 1, `"'`]);
                    /* istanbul ignore next */
                    if (typeof offsetBy === "function") {
                        offsetBy(1);
                    }
                }
            }
        }
        else if (from === 0 && str[to] && str.slice(to).trim()) {
            // 2.
            if (convertApostrophes &&
                str.slice(from, to) !==
                    (convertEntities ? "&ldquo;" : leftDoubleQuote) &&
                value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)) {
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&ldquo;" : leftDoubleQuote,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `"` &&
                value !== `"`) {
                rangesArr.push([from, to, `"`]);
            }
        }
        else if (!str[to] && str.slice(0, from).trim()) {
            // 3.
            if (convertApostrophes &&
                str.slice(from, to) !==
                    (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
                value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)) {
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&rdquo;" : rightDoubleQuote,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `"` &&
                value !== `"`) {
                rangesArr.push([from, to, `"`]);
            }
        }
        else if (str[to] &&
            (isLetter(str[to]) || isDigitStr(str[to]))) {
            // equivalent of /"\b/g
            // 4.
            if (convertApostrophes &&
                str.slice(from, to) !==
                    (convertEntities ? "&ldquo;" : leftDoubleQuote) &&
                value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)) {
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&ldquo;" : leftDoubleQuote,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `"` &&
                value !== `"`) {
                rangesArr.push([from, to, `"`]);
            }
        }
        else if (str[from - 1] &&
            (isLetter(str[from - 1]) || isDigitStr(str[from - 1]))) {
            // equivalent of /"\b/g
            // 5.
            if (convertApostrophes &&
                str.slice(from, to) !==
                    (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
                value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)) {
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&rdquo;" : rightDoubleQuote,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `"` &&
                value !== `"`) {
                rangesArr.push([from, to, `"`]);
            }
        }
        else if (str[from - 1] && !str[from - 1].trim()) {
            // 6.
            if (convertApostrophes &&
                str.slice(from, to) !==
                    (convertEntities ? "&ldquo;" : leftDoubleQuote) &&
                value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)) {
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&ldquo;" : leftDoubleQuote,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `"` &&
                value !== `"`) {
                rangesArr.push([from, to, `"`]);
            }
        }
        else if (str[to] && !str[to].trim()) {
            // 7.
            if (convertApostrophes &&
                str.slice(from, to) !==
                    (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
                value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)) {
                rangesArr.push([
                    from,
                    to,
                    convertEntities ? "&rdquo;" : rightDoubleQuote,
                ]);
            }
            else if (!convertApostrophes &&
                str.slice(from, to) !== `"` &&
                value !== `"`) {
                rangesArr.push([from, to, `"`]);
            }
        }
    }
    return rangesArr;
}
/**
 * Typographically-correct the apostrophes and single/double quotes
 */
function convertAll(str, opts) {
    let ranges = [];
    const preppedOpts = {
        convertApostrophes: true,
        convertEntities: false,
        ...opts,
    };
    // loop through the given string
    for (let i = 0, len = str.length; i < len; i++) {
        // offset is needed to bypass characters we already fixed - it happens for
        // example with nested quotes - we'd fix many in one go and we need to skip
        // further processing, otherwise those characters would get processed
        // multiple times
        preppedOpts.from = i;
        preppedOpts.offsetBy = (idx) => {
            i += idx;
        };
        const res = convertOne(str, preppedOpts);
        if (Array.isArray(res) && res.length) {
            ranges = ranges.concat(res);
        }
    }
    return {
        result: rApply(str, ranges),
        ranges,
    };
}

exports.convertAll = convertAll;
exports.convertOne = convertOne;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
