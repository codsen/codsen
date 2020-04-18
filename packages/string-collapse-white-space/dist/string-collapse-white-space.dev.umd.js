/**
 * string-collapse-white-space
 * Efficient collapsing of white space with optional outer- and/or line-trimming and HTML tag recognition
 * Version: 5.2.17
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-white-space
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.stringCollapseWhiteSpace = factory());
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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /**
   * ranges-sort
   * Sort natural number index ranges [ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]
   * Version: 3.11.2
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort
   */
  function rangesSort(arrOfRanges, originalOptions) {
    if (!Array.isArray(arrOfRanges)) {
      throw new TypeError(`ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(arrOfRanges, null, 4)}`);
    }

    if (arrOfRanges.length === 0) {
      return arrOfRanges;
    }

    const defaults = {
      strictlyTwoElementsInRangeArrays: false,
      progressFn: null
    };
    const opts = Object.assign({}, defaults, originalOptions);
    let culpritsIndex;
    let culpritsLen;

    if (opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.every((rangeArr, indx) => {
      if (rangeArr.length !== 2) {
        culpritsIndex = indx;
        culpritsLen = rangeArr.length;
        return false;
      }

      return true;
    })) {
      throw new TypeError(`ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 4)}) has not two but ${culpritsLen} elements!`);
    }

    if (!arrOfRanges.every((rangeArr, indx) => {
      if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      throw new TypeError(`ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 4)}) does not consist of only natural numbers!`);
    }

    const maxPossibleIterations = arrOfRanges.length * arrOfRanges.length;
    let counter = 0;
    return Array.from(arrOfRanges).sort((range1, range2) => {
      if (opts.progressFn) {
        counter++;
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
   * Merge and sort arrays which mean string slice ranges
   * Version: 4.3.3
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-merge
   */

  function mergeRanges(arrOfRanges, originalOpts) {
    function isStr(something) {
      return typeof something === "string";
    }

    function isObj(something) {
      return something && typeof something === "object" && !Array.isArray(something);
    }

    if (!Array.isArray(arrOfRanges)) {
      return arrOfRanges;
    }

    const defaults = {
      mergeType: 1,
      progressFn: null,
      joinRangesThatTouchEdges: true
    };
    let opts;

    if (originalOpts) {
      if (isObj(originalOpts)) {
        opts = Object.assign({}, defaults, originalOpts);

        if (opts.progressFn && isObj(opts.progressFn) && !Object.keys(opts.progressFn).length) {
          opts.progressFn = null;
        } else if (opts.progressFn && typeof opts.progressFn !== "function") {
          throw new Error(`ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: "${typeof opts.progressFn}", equal to ${JSON.stringify(opts.progressFn, null, 4)}`);
        }

        if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
          if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
            opts.mergeType = 1;
          } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
            opts.mergeType = 2;
          } else {
            throw new Error(`ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${JSON.stringify(opts.mergeType, null, 4)}`);
          }
        }

        if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
          throw new Error(`ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof opts.joinRangesThatTouchEdges}", equal to ${JSON.stringify(opts.joinRangesThatTouchEdges, null, 4)}`);
        }
      } else {
        throw new Error(`emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n${JSON.stringify(originalOpts, null, 4)} (type ${typeof originalOpts})`);
      }
    } else {
      opts = Object.assign({}, defaults);
    }

    const filtered = arrOfRanges.map(subarr => [...subarr]).filter(rangeArr => rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1]);
    let sortedRanges;
    let lastPercentageDone;
    let percentageDone;

    if (opts.progressFn) {
      sortedRanges = rangesSort(filtered, {
        progressFn: percentage => {
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
            } else if (sortedRanges[i - 1][2] !== undefined) {
              if (opts.mergeType === 2 && sortedRanges[i - 1][0] === sortedRanges[i][0]) {
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

    return sortedRanges;
  }

  /**
   * ranges-apply
   * Take an array of string slice ranges, delete/replace the string according to them
   * Version: 3.1.4
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply
   */

  function existy(x) {
    return x != null;
  }

  function isStr(something) {
    return typeof something === "string";
  }

  function rangesApply(str, rangesArr, progressFn) {
    let percentageDone = 0;
    let lastPercentageDone = 0;

    if (arguments.length === 0) {
      throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
    }

    if (!isStr(str)) {
      throw new TypeError(`ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ${typeof str}, equal to: ${JSON.stringify(str, null, 4)}`);
    }

    if (rangesArr === null) {
      return str;
    } else if (!Array.isArray(rangesArr)) {
      throw new TypeError(`ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ${typeof rangesArr}, equal to: ${JSON.stringify(rangesArr, null, 4)}`);
    }

    if (progressFn && typeof progressFn !== "function") {
      throw new TypeError(`ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ${typeof progressFn}, equal to: ${JSON.stringify(progressFn, null, 4)}`);
    }

    if (Array.isArray(rangesArr) && (Number.isInteger(rangesArr[0]) && rangesArr[0] >= 0 || /^\d*$/.test(rangesArr[0])) && (Number.isInteger(rangesArr[1]) && rangesArr[1] >= 0 || /^\d*$/.test(rangesArr[1]))) {
      rangesArr = [rangesArr];
    }

    const len = rangesArr.length;
    let counter = 0;
    rangesArr.forEach((el, i) => {
      if (progressFn) {
        percentageDone = Math.floor(counter / len * 10);

        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          progressFn(percentageDone);
        }
      }

      if (!Array.isArray(el)) {
        throw new TypeError(`ranges-apply: [THROW_ID_05] ranges array, second input arg., has ${i}th element not an array: ${JSON.stringify(el, null, 4)}, which is ${typeof el}`);
      }

      if (!Number.isInteger(el[0]) || el[0] < 0) {
        if (/^\d*$/.test(el[0])) {
          rangesArr[i][0] = Number.parseInt(rangesArr[i][0], 10);
        } else {
          throw new TypeError(`ranges-apply: [THROW_ID_06] ranges array, second input arg. has ${i}th element, array [${el[0]},${el[1]}]. That array has first element not an integer, but ${typeof el[0]}, equal to: ${JSON.stringify(el[0], null, 4)}. Computer doesn't like this.`);
        }
      }

      if (!Number.isInteger(el[1])) {
        if (/^\d*$/.test(el[1])) {
          rangesArr[i][1] = Number.parseInt(rangesArr[i][1], 10);
        } else {
          throw new TypeError(`ranges-apply: [THROW_ID_07] ranges array, second input arg. has ${i}th element, array [${el[0]},${el[1]}]. That array has second element not an integer, but ${typeof el[1]}, equal to: ${JSON.stringify(el[1], null, 4)}. Computer doesn't like this.`);
        }
      }

      counter++;
    });
    const workingRanges = mergeRanges(rangesArr, {
      progressFn: perc => {
        if (progressFn) {
          percentageDone = 10 + Math.floor(perc / 10);

          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;
            progressFn(percentageDone);
          }
        }
      }
    });
    const len2 = workingRanges.length;

    if (len2 > 0) {
      const tails = str.slice(workingRanges[len2 - 1][1]);
      str = workingRanges.reduce((acc, val, i, arr) => {
        if (progressFn) {
          percentageDone = 20 + Math.floor(i / len2 * 80);

          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;
            progressFn(percentageDone);
          }
        }

        const beginning = i === 0 ? 0 : arr[i - 1][1];
        const ending = arr[i][0];
        return acc + str.slice(beginning, ending) + (existy(arr[i][2]) ? arr[i][2] : "");
      }, "");
      str += tails;
    }

    return str;
  }

  /**
   * arrayiffy-if-string
   * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
   * Version: 3.11.29
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/arrayiffy-if-string
   */
  function arrayiffyString(something) {
    if (typeof something === "string") {
      if (something.length > 0) {
        return [something];
      }

      return [];
    }

    return something;
  }

  /**
   * string-match-left-right
   * Do substrings match what's on the left or right of a given index?
   * Version: 4.0.4
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right
   */

  function isObj(something) {
    return something && typeof something === "object" && !Array.isArray(something);
  }

  function isStr$1(something) {
    return typeof something === "string";
  }

  function march(str, fromIndexInclusive, whatToMatchVal, opts, special, getNextIdx) {
    const whatToMatchValVal = typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal;

    if (fromIndexInclusive < 0 && special && whatToMatchValVal === "EOL") {
      return whatToMatchValVal;
    }

    if (fromIndexInclusive >= str.length && !special) {
      return false;
    }

    let charsToCheckCount = special ? 1 : whatToMatchVal.length;
    let lastWasMismatched = false;
    let atLeastSomethingWasMatched = false;
    let patience = opts.maxMismatches;
    let i = fromIndexInclusive;
    let somethingFound = false;
    let firstCharacterMatched = false;
    let lastCharacterMatched = false;

    while (str[i]) {
      const nextIdx = getNextIdx(i);

      if (opts.trimBeforeMatching && str[i].trim() === "") {
        if (!str[nextIdx] && special && whatToMatchVal === "EOL") {
          return true;
        }

        i = getNextIdx(i);
        continue;
      }

      if (!opts.i && opts.trimCharsBeforeMatching.includes(str[i]) || opts.i && opts.trimCharsBeforeMatching.map(val => val.toLowerCase()).includes(str[i].toLowerCase())) {
        if (special && whatToMatchVal === "EOL" && !str[nextIdx]) {
          return true;
        }

        i = getNextIdx(i);
        continue;
      }

      const charToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount] : whatToMatchVal[charsToCheckCount - 1];

      if (!opts.i && str[i] === charToCompareAgainst || opts.i && str[i].toLowerCase() === charToCompareAgainst.toLowerCase()) {
        if (!somethingFound) {
          somethingFound = true;
        }

        if (!atLeastSomethingWasMatched) {
          atLeastSomethingWasMatched = true;
        }

        if (charsToCheckCount === whatToMatchVal.length) {
          firstCharacterMatched = true;
        } else if (charsToCheckCount === 1) {
          lastCharacterMatched = true;
        }

        charsToCheckCount -= 1;

        if (charsToCheckCount < 1) {
          return i;
        }
      } else {
        if (opts.maxMismatches && patience && i) {
          patience--;

          for (let y = 0; y <= patience; y++) {
            const nextCharToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount + 1 + y] : whatToMatchVal[charsToCheckCount - 2 - y];
            const nextCharInSource = str[getNextIdx(i)];

            if (nextCharToCompareAgainst && (!opts.i && str[i] === nextCharToCompareAgainst || opts.i && str[i].toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && (!opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
              charsToCheckCount -= 2;
              somethingFound = true;
              break;
            } else if (nextCharInSource && nextCharToCompareAgainst && (!opts.i && nextCharInSource === nextCharToCompareAgainst || opts.i && nextCharInSource.toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && (!opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
              charsToCheckCount -= 1;
              somethingFound = true;
              break;
            } else if (nextCharToCompareAgainst === undefined && patience >= 0 && somethingFound && (!opts.firstMustMatch || firstCharacterMatched) && (!opts.lastMustMatch || lastCharacterMatched)) {
              return i;
            }
          }

          if (!somethingFound) {
            lastWasMismatched = i;
          }
        } else if (i === 0 && charsToCheckCount === 1 && !opts.lastMustMatch && atLeastSomethingWasMatched) {
          return 0;
        } else {
          return false;
        }
      }

      if (lastWasMismatched !== false && lastWasMismatched !== i) {
        lastWasMismatched = false;
      }

      if (charsToCheckCount < 1) {
        return i;
      }

      i = getNextIdx(i);
    }

    if (charsToCheckCount > 0) {
      if (special && whatToMatchValVal === "EOL") {
        return true;
      } else if (opts.maxMismatches >= charsToCheckCount && atLeastSomethingWasMatched) {
        return lastWasMismatched || 0;
      }

      return false;
    }
  }

  function main(mode, str, position, originalWhatToMatch, originalOpts) {
    const defaults = {
      i: false,
      trimBeforeMatching: false,
      trimCharsBeforeMatching: [],
      maxMismatches: 0,
      firstMustMatch: false,
      lastMustMatch: false
    };

    if (isObj(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!${Array.isArray(originalOpts.trimBeforeMatching) ? ` Did you mean to use opts.trimCharsBeforeMatching?` : ""}`);
    }

    const opts = Object.assign({}, defaults, originalOpts);
    opts.trimCharsBeforeMatching = arrayiffyString(opts.trimCharsBeforeMatching);
    opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(el => isStr$1(el) ? el : String(el));

    if (!isStr$1(str)) {
      return false;
    } else if (!str.length) {
      return false;
    }

    if (!Number.isInteger(position) || position < 0) {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ${typeof position}, equal to:\n${JSON.stringify(position, null, 4)}`);
    }

    let whatToMatch;
    let special;

    if (isStr$1(originalWhatToMatch)) {
      whatToMatch = [originalWhatToMatch];
    } else if (Array.isArray(originalWhatToMatch)) {
      whatToMatch = originalWhatToMatch;
    } else if (!originalWhatToMatch) {
      whatToMatch = originalWhatToMatch;
    } else if (typeof originalWhatToMatch === "function") {
      whatToMatch = [];
      whatToMatch.push(originalWhatToMatch);
    } else {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof originalWhatToMatch}, equal to:\n${JSON.stringify(originalWhatToMatch, null, 4)}`);
    }

    if (originalOpts && !isObj(originalOpts)) {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof originalOpts}", and equal to:\n${JSON.stringify(originalOpts, null, 4)}`);
    }

    let culpritsIndex;
    let culpritsVal;

    if (opts.trimCharsBeforeMatching.some((el, i) => {
      if (el.length > 1) {
        culpritsIndex = i;
        culpritsVal = el;
        return true;
      }

      return false;
    })) {
      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ${culpritsIndex} is longer than 1 character, ${culpritsVal.length} (equals to ${culpritsVal}). Please split it into separate characters and put into array as separate elements.`);
    }

    if (!whatToMatch || !Array.isArray(whatToMatch) || Array.isArray(whatToMatch) && !whatToMatch.length || Array.isArray(whatToMatch) && whatToMatch.length === 1 && isStr$1(whatToMatch[0]) && !whatToMatch[0].trim()) {
      if (typeof opts.cb === "function") {
        let firstCharOutsideIndex;
        let startingPosition = position;

        if (mode === "matchLeftIncl" || mode === "matchRight") {
          startingPosition += 1;
        }

        if (mode[5] === "L") {
          for (let y = startingPosition; y--;) {
            const currentChar = str[y];

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar !== undefined && currentChar.trim()) && (!opts.trimCharsBeforeMatching.length || currentChar !== undefined && !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        } else if (mode.startsWith("matchRight")) {
          for (let y = startingPosition; y < str.length; y++) {
            const currentChar = str[y];

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar.trim()) && (!opts.trimCharsBeforeMatching.length || !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        }

        if (firstCharOutsideIndex === undefined) {
          return false;
        }

        const wholeCharacterOutside = str[firstCharOutsideIndex];
        const indexOfTheCharacterAfter = firstCharOutsideIndex + 1;
        let theRemainderOfTheString = "";

        if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
          theRemainderOfTheString = str.slice(0, indexOfTheCharacterAfter);
        }

        if (mode[5] === "L") {
          return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
        }

        if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
          theRemainderOfTheString = str.slice(firstCharOutsideIndex);
        }

        return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
      }

      let extraNote = "";

      if (!originalOpts) {
        extraNote = " More so, the whole options object, the fourth input argument, is missing!";
      }

      throw new Error(`string-match-left-right/${mode}(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!${extraNote}`);
    }

    for (let i = 0, len = whatToMatch.length; i < len; i++) {
      special = typeof whatToMatch[i] === "function";
      const whatToMatchVal = whatToMatch[i];
      let fullCharacterInFront;
      let indexOfTheCharacterInFront;
      let restOfStringInFront = "";
      let startingPosition = position;

      if (mode === "matchRight") {
        startingPosition++;
      } else if (mode === "matchLeft") {
        startingPosition--;
      }

      const found = march(str, startingPosition, whatToMatchVal, opts, special, i => mode[5] === "L" ? i - 1 : i + 1);

      if (found && special && typeof whatToMatchVal === "function" && whatToMatchVal() === "EOL") {
        return whatToMatchVal() && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true) ? whatToMatchVal() : false;
      }

      if (Number.isInteger(found)) {
        indexOfTheCharacterInFront = mode.startsWith("matchLeft") ? found - 1 : found + 1;

        if (mode[5] === "L") {
          restOfStringInFront = str.slice(0, found);
        } else {
          restOfStringInFront = str.slice(indexOfTheCharacterInFront);
        }
      }

      if (indexOfTheCharacterInFront < 0) {
        indexOfTheCharacterInFront = undefined;
      }

      if (str[indexOfTheCharacterInFront]) {
        fullCharacterInFront = str[indexOfTheCharacterInFront];
      }

      if (Number.isInteger(found) && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true)) {
        return whatToMatchVal;
      }
    }

    return false;
  }

  function matchLeftIncl(str, position, whatToMatch, opts) {
    return main("matchLeftIncl", str, position, whatToMatch, opts);
  }

  function collapse(str, originalOpts) {
    // f's
    function charCodeBetweenInclusive(character, from, end) {
      return character.charCodeAt(0) >= from && character.charCodeAt(0) <= end;
    }

    function isSpaceOrLeftBracket(character) {
      return typeof character === "string" && (character === "<" || !character.trim());
    }

    if (typeof str !== "string") {
      throw new Error("string-collapse-white-space/collapse(): [THROW_ID_01] The input is not string but ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
    }

    if (originalOpts && _typeof(originalOpts) !== "object") {
      throw new Error("string-collapse-white-space/collapse(): [THROW_ID_02] The opts is not a plain object but ".concat(_typeof(originalOpts), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
    }

    if (!str.length) {
      return "";
    }

    var finalIndexesToDelete = []; // declare defaults, so we can enforce types later:

    var defaults = {
      trimStart: true,
      // otherwise, leading whitespace will be collapsed to a single space
      trimEnd: true,
      // otherwise, trailing whitespace will be collapsed to a single space
      trimLines: false,
      // activates trim per-line basis
      trimnbsp: false,
      // non-breaking spaces are trimmed too
      recogniseHTML: true,
      // collapses whitespace around HTML brackets
      removeEmptyLines: false,
      // if line trim()'s to an empty string, it's removed
      returnRangesOnly: false,
      // if on, only ranges array is returned
      limitConsecutiveEmptyLinesTo: 0 // zero lines are allowed (if opts.removeEmptyLines is on)

    }; // fill any settings with defaults if missing:

    var opts = Object.assign({}, defaults, originalOpts);
    var preliminaryIndexesToDelete;

    if (opts.recogniseHTML) {
      preliminaryIndexesToDelete = [];
    } // -----------------------------------------------------------------------------


    var spacesEndAt = null;
    var whiteSpaceEndsAt = null;
    var lineWhiteSpaceEndsAt = null;
    var endingOfTheLine = false;
    var stateWithinTag = false;
    var whiteSpaceWithinTagEndsAt = null;
    var tagMatched = false;
    var tagCanEndHere = false;
    var count = {};
    var bail = false; // bool flag to notify when false positive detected, used in HTML detection

    var resetCounts = function resetCounts(obj) {
      obj.equalDoubleQuoteCombo = 0;
      obj.equalOnly = 0;
      obj.doubleQuoteOnly = 0;
      obj.spacesBetweenLetterChunks = 0;
      obj.linebreaks = 0;
    };

    var bracketJustFound = false; // dumb state switch, activated by > and terminated by
    // first non-whitespace char

    if (opts.recogniseHTML) {
      resetCounts(count); // initiates the count object, assigning all keys to zero
    }

    var lastLineBreaksLastCharIndex;
    var consecutiveLineBreakCount = 0; // looping backwards for better efficiency

    for (var i = str.length; i--;) {
      // line break counting
      if (str[i] === "\n" || str[i] === "\r" && str[i + 1] !== "\n") {
        consecutiveLineBreakCount++;
      } else if (str[i].trim()) {
        consecutiveLineBreakCount = 0;
      } //
      // space clauses


      if (str[i] === " ") {
        if (spacesEndAt === null) {
          spacesEndAt = i;
        }
      } else if (spacesEndAt !== null) {
        // it's not a space character
        // if we have a sequence of spaces, this character terminates that sequence
        if (i + 1 !== spacesEndAt) {
          finalIndexesToDelete.push([i + 1, spacesEndAt]);
        }

        spacesEndAt = null;
      } // white space clauses


      if (str[i].trim() === "" && (!opts.trimnbsp && str[i] !== "\xa0" || opts.trimnbsp)) {
        // it's some sort of white space character, but not a non-breaking space
        if (whiteSpaceEndsAt === null) {
          whiteSpaceEndsAt = i;
        } // line trimming:


        if (str[i] !== "\n" && str[i] !== "\r" && lineWhiteSpaceEndsAt === null) {
          lineWhiteSpaceEndsAt = i + 1;
        } // per-line trimming:


        if (str[i] === "\n" || str[i] === "\r") {
          if (lineWhiteSpaceEndsAt !== null) {
            if (opts.trimLines) {
              finalIndexesToDelete.push([i + 1, lineWhiteSpaceEndsAt]);
            }

            lineWhiteSpaceEndsAt = null;
          }

          if (str[i - 1] !== "\n" && str[i - 1] !== "\r") {
            lineWhiteSpaceEndsAt = i;
            endingOfTheLine = true;
          }
        } // empty line deletion:
        // PS. remember we're traversing backwards, so CRLF indexes go in order LF, CR


        if (str[i] === "\n" || str[i] === "\r" && str[i + 1] !== "\n") {
          var sliceFrom = i + 1;
          var sliceTo = void 0;

          if (Number.isInteger(lastLineBreaksLastCharIndex)) {
            sliceTo = lastLineBreaksLastCharIndex + 1;

            if (opts.removeEmptyLines && lastLineBreaksLastCharIndex !== undefined && str.slice(sliceFrom, sliceTo).trim() === "") {
              // push only if limit has been reached
              if (consecutiveLineBreakCount > opts.limitConsecutiveEmptyLinesTo + 1) {
                finalIndexesToDelete.push([i + 1, lastLineBreaksLastCharIndex + 1]);
              }
            }
          }

          lastLineBreaksLastCharIndex = i;
        }
      } else {
        // it's not white space character
        if (whiteSpaceEndsAt !== null) {
          if (i + 1 !== whiteSpaceEndsAt + 1 && whiteSpaceEndsAt === str.length - 1 && opts.trimEnd) {
            finalIndexesToDelete.push([i + 1, whiteSpaceEndsAt + 1]);
          }

          whiteSpaceEndsAt = null;
        } // encountered letter resets line trim counters:


        if (lineWhiteSpaceEndsAt !== null) {
          if (endingOfTheLine && opts.trimLines) {
            endingOfTheLine = false; // apply either way

            if (lineWhiteSpaceEndsAt !== i + 1) {
              finalIndexesToDelete.push([i + 1, lineWhiteSpaceEndsAt]);
            }
          }

          lineWhiteSpaceEndsAt = null;
        }
      } // this chunk could be ported to the (str[i].trim() === '') clause for example,
      // but it depends on the flags that aforementioned's "else" is setting,
      // (whiteSpaceEndsAt !== null),
      // therefore it's less code if we put zero index clauses here.


      if (i === 0) {
        if (whiteSpaceEndsAt !== null && opts.trimStart) {
          finalIndexesToDelete.push([0, whiteSpaceEndsAt + 1]);
        } else if (spacesEndAt !== null) {
          finalIndexesToDelete.push([i + 1, spacesEndAt + 1]);
        }
      }

      if (opts.recogniseHTML) {
        if (str[i].trim() === "") {
          // W H I T E S P A C E
          if (stateWithinTag && !tagCanEndHere) {
            tagCanEndHere = true;
          }

          if (tagMatched && !whiteSpaceWithinTagEndsAt) {
            // cases where there's space between opening bracket and a confirmed HTML tag name
            whiteSpaceWithinTagEndsAt = i + 1;
          }

          if (tagMatched && str[i - 1] !== undefined && str[i - 1].trim() !== "" && str[i - 1] !== "<" && str[i - 1] !== "/") {
            // bail, something's wrong, there's non-whitespace character to the left of a
            // recognised HTML tag. For example: "< zzz div ...>"
            tagMatched = false;
            stateWithinTag = false;
            preliminaryIndexesToDelete = [];
          }

          if (!bail && !bracketJustFound && str[i].trim() === "" && str[i - 1] !== "<" && (str[i + 1] === undefined || str[i + 1].trim() !== "" && str[i + 1].trim() !== "/")) {
            if (str[i - 1] === undefined || str[i - 1].trim() !== "" && str[i - 1] !== "<" && str[i - 1] !== "/") {
              count.spacesBetweenLetterChunks += 1;
            } else {
              // loop backwards and check, is the first non-space char being "<".
              for (var y = i - 1; y--;) {
                if (str[y].trim() !== "") {
                  if (str[y] === "<") {
                    bail = true;
                  } else if (str[y] !== "/") {
                    count.spacesBetweenLetterChunks += i - y;
                  }

                  break;
                }
              }
            }
          }
        } else {
          // N O T   W H I T E S P A C E
          // =========
          // count equal characters and double quotes
          if (str[i] === "=") {
            count.equalOnly += 1;

            if (str[i + 1] === '"') {
              count.equalDoubleQuoteCombo += 1;
            }
          } else if (str[i] === '"') {
            count.doubleQuoteOnly += 1;
          } // if the dumb flag is on, turn it off.
          // first non-whitespace character deactivates it.


          if (bracketJustFound) {
            bracketJustFound = false;
          } // =========
          // terminate existing range, push the captured range into preliminaries' array


          if (whiteSpaceWithinTagEndsAt !== null) {
            preliminaryIndexesToDelete.push([i + 1, whiteSpaceWithinTagEndsAt]); // finalIndexesToDelete.push([i + 1, whiteSpaceWithinTagEndsAt])

            whiteSpaceWithinTagEndsAt = null;
          } // =========
          // html detection bits:
          // mind you, we're iterating backwards, so tag starts with ">"


          if (str[i] === ">") {
            // first, reset the count obj.
            resetCounts(count); // set dumb bracket flag to on

            bracketJustFound = true; // two cases:

            if (stateWithinTag) {
              // this is bad, another closing bracket
              preliminaryIndexesToDelete = [];
            } else {
              stateWithinTag = true;

              if (str[i - 1] !== undefined && str[i - 1].trim() === "" && !whiteSpaceWithinTagEndsAt) {
                whiteSpaceWithinTagEndsAt = i;
              }
            }

            if (!tagCanEndHere) {
              tagCanEndHere = true; // tag name might be ending with bracket: <br>
            }
          } else if (str[i] === "<") {
            // the rest of calculations:
            stateWithinTag = false; // reset bail flag

            if (bail) {
              bail = false;
            } // bail clause, when false positives are detected, such as "a < b and c > d" -
            // the part: < b and c > looks really deceptive, b is valid tag name...
            // this bail will detect such cases, freak out and bail, wiping preliminary ranges.


            if (count.spacesBetweenLetterChunks > 0 && count.equalDoubleQuoteCombo === 0) {
              tagMatched = false;
              preliminaryIndexesToDelete = [];
            } // if somehow we're within a tag and there are already provisional ranges


            if (tagMatched) {
              if (preliminaryIndexesToDelete.length) {
                preliminaryIndexesToDelete.forEach(function (_ref) {
                  var _ref2 = _slicedToArray(_ref, 2),
                      rangeStart = _ref2[0],
                      rangeEnd = _ref2[1];

                  return finalIndexesToDelete.push([rangeStart, rangeEnd]);
                });
              }

              tagMatched = false;
            } // finally, reset the count obj.


            resetCounts(count);
          } else if (stateWithinTag && str[i] === "/") {
            whiteSpaceWithinTagEndsAt = i;
          } else if (stateWithinTag && !tagMatched) {
            if (tagCanEndHere && charCodeBetweenInclusive(str[i], 97, 122)) {
              // if letters a-z, inclusive:
              // ---------------------------------------------------------------
              tagCanEndHere = false;

              if (charCodeBetweenInclusive(str[i], 97, 110)) {
                // if letters a-n, inclusive:
                if (str[i] === "a" && (str[i - 1] === "e" && matchLeftIncl(str, i, ["area", "textarea"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i - 1] === "t" && matchLeftIncl(str, i, ["data", "meta"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || isSpaceOrLeftBracket(str[i - 1])) || str[i] === "b" && (matchLeftIncl(str, i, ["rb", "sub"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || isSpaceOrLeftBracket(str[i - 1])) || str[i] === "c" && matchLeftIncl(str, i, "rtc", {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i] === "d" && (str[i - 1] === "a" && matchLeftIncl(str, i, ["head", "thead"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || matchLeftIncl(str, i, ["kbd", "dd", "embed", "legend", "td"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                })) || str[i] === "e" && (matchLeftIncl(str, i, "source", {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i - 1] === "d" && matchLeftIncl(str, i, ["aside", "code"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i - 1] === "l" && matchLeftIncl(str, i, ["table", "article", "title", "style"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i - 1] === "m" && matchLeftIncl(str, i, ["iframe", "time"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i - 1] === "r" && matchLeftIncl(str, i, ["pre", "figure", "picture"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i - 1] === "t" && matchLeftIncl(str, i, ["template", "cite", "blockquote"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || matchLeftIncl(str, i, "base", {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || isSpaceOrLeftBracket(str[i - 1])) || str[i] === "g" && matchLeftIncl(str, i, ["img", "strong", "dialog", "svg"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i] === "h" && matchLeftIncl(str, i, ["th", "math"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i] === "i" && (matchLeftIncl(str, i, ["bdi", "li"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || isSpaceOrLeftBracket(str[i - 1])) || str[i] === "k" && matchLeftIncl(str, i, ["track", "link", "mark"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i] === "l" && matchLeftIncl(str, i, ["html", "ol", "ul", "dl", "label", "del", "small", "col"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i] === "m" && matchLeftIncl(str, i, ["param", "em", "menuitem", "form"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i] === "n" && (str[i - 1] === "o" && matchLeftIncl(str, i, ["section", "caption", "figcaption", "option", "button"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || matchLeftIncl(str, i, ["span", "keygen", "dfn", "main"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }))) {
                  tagMatched = true;
                }
              } else {
                // o-z, inclusive. codes 111-122, inclusive
                if (str[i] === "o" && matchLeftIncl(str, i, ["bdo", "video", "audio"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i] === "p" && (isSpaceOrLeftBracket(str[i - 1]) || str[i - 1] === "u" && matchLeftIncl(str, i, ["hgroup", "colgroup", "optgroup", "sup"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || matchLeftIncl(str, i, ["map", "samp", "rp"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                })) || str[i] === "q" && isSpaceOrLeftBracket(str[i - 1]) || str[i] === "r" && (str[i - 1] === "e" && matchLeftIncl(str, i, ["header", "meter", "footer"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || matchLeftIncl(str, i, ["var", "br", "abbr", "wbr", "hr", "tr"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                })) || str[i] === "s" && (str[i - 1] === "s" && matchLeftIncl(str, i, ["address", "progress"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || matchLeftIncl(str, i, ["canvas", "details", "ins"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || isSpaceOrLeftBracket(str[i - 1])) || str[i] === "t" && (str[i - 1] === "c" && matchLeftIncl(str, i, ["object", "select"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i - 1] === "o" && matchLeftIncl(str, i, ["slot", "tfoot"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i - 1] === "p" && matchLeftIncl(str, i, ["script", "noscript"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i - 1] === "u" && matchLeftIncl(str, i, ["input", "output"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || matchLeftIncl(str, i, ["fieldset", "rt", "datalist", "dt"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                })) || str[i] === "u" && (isSpaceOrLeftBracket(str[i - 1]) || matchLeftIncl(str, i, "menu", {
                  cb: isSpaceOrLeftBracket,
                  i: true
                })) || str[i] === "v" && matchLeftIncl(str, i, ["nav", "div"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                }) || str[i] === "y" && matchLeftIncl(str, i, ["ruby", "body", "tbody", "summary"], {
                  cb: isSpaceOrLeftBracket,
                  i: true
                })) {
                  tagMatched = true;
                }
              } // ---------------------------------------------------------------

            } else if (tagCanEndHere && charCodeBetweenInclusive(str[i], 49, 54)) {
              // if digits 1-6
              tagCanEndHere = false;

              if (str[i - 1] === "h" && (str[i - 2] === "<" || str[i - 2].trim() === "")) {
                tagMatched = true;
              }
            } else if (str[i] === "=" || str[i] === '"') {
              tagCanEndHere = false;
            }
          }
        }
      }
    }

    if (opts.returnRangesOnly) {
      return mergeRanges(finalIndexesToDelete);
    }

    return finalIndexesToDelete.length ? rangesApply(str, finalIndexesToDelete) : str;
  }

  return collapse;

})));
