/**
 * ranges-process-outside
 * Iterate through string and optionally a given ranges as if they were one
 * Version: 2.2.27
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-process-outside
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.rangesProcessOutside = factory());
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
    if (n === "Map" || n === "Set") return Array.from(o);
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
   * Version: 3.12.0
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort
   */
  function rangesSort(arrOfRanges, originalOptions) {
    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
      return arrOfRanges;
    }

    const defaults = {
      strictlyTwoElementsInRangeArrays: false,
      progressFn: null
    };
    const opts = { ...defaults,
      ...originalOptions
    };
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
   * Merge and sort arrays which mean string slice ranges
   * Version: 4.3.8
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

    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
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
        opts = { ...defaults,
          ...originalOpts
        };

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
      opts = { ...defaults
      };
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
   * ranges-crop
   * Crop array of ranges when they go beyond the reference string's length
   * Version: 2.0.55
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-crop
   */
  const isArr = Array.isArray;

  function isStr(something) {
    return typeof something === "string";
  }

  function existy(x) {
    return x != null;
  }

  function rangesCrop(arrOfRanges, strLen) {
    if (!isArr(arrOfRanges)) {
      throw new TypeError(`ranges-crop: [THROW_ID_01] The first input's argument must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(arrOfRanges, null, 4)}`);
    }

    if (!Number.isInteger(strLen)) {
      throw new TypeError(`ranges-crop: [THROW_ID_02] The second input's argument must be a natural number or zero (coming from String.length)! Currently its type is: ${typeof strLen}, equal to: ${JSON.stringify(strLen, null, 4)}`);
    }

    if (arrOfRanges.length === 0) {
      return arrOfRanges;
    }

    let culpritsIndex;

    if (!arrOfRanges.every((rangeArr, indx) => {
      if (!Number.isInteger(rangeArr[0]) || !Number.isInteger(rangeArr[1])) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
        throw new TypeError(`ranges-crop: [THROW_ID_03] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ${JSON.stringify(arrOfRanges, null, 0)}!`);
      }

      throw new TypeError(`ranges-crop: [THROW_ID_04] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ${culpritsIndex + 1}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 0)}) does not consist of only natural numbers!`);
    }

    if (!arrOfRanges.every((rangeArr, indx) => {
      if (existy(rangeArr[2]) && !isStr(rangeArr[2])) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      throw new TypeError(`ranges-crop: [THROW_ID_05] The third argument, if present at all, should be of a string-type or null. Currently the ${culpritsIndex}th range ${JSON.stringify(arrOfRanges[culpritsIndex], null, 0)} has a argument in the range of a type ${typeof arrOfRanges[culpritsIndex][2]}`);
    }

    const res = mergeRanges(arrOfRanges).filter(singleRangeArr => singleRangeArr[0] <= strLen && (singleRangeArr[2] !== undefined || singleRangeArr[0] < strLen)).map(singleRangeArr => {
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

  /**
   * ranges-invert
   * Invert string index ranges [ [1, 3] ] => [ [0, 1], [3, ...] ]
   * Version: 2.1.42
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-invert
   */
  const isArr$1 = Array.isArray;

  function rangesInvert(arrOfRanges, strLen, originalOptions) {
    if (!isArr$1(arrOfRanges) && arrOfRanges !== null) {
      throw new TypeError(`ranges-invert: [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(arrOfRanges, null, 4)}`);
    }

    if (!Number.isInteger(strLen) || strLen < 0) {
      throw new TypeError(`ranges-invert: [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: ${typeof strLen}, equal to: ${JSON.stringify(strLen, null, 4)}`);
    }

    if (arrOfRanges === null) {
      if (strLen === 0) {
        return [];
      }

      return [[0, strLen]];
    }

    if (arrOfRanges.length === 0) {
      return [];
    }

    const defaults = {
      strictlyTwoElementsInRangeArrays: false,
      skipChecks: false
    };
    const opts = { ...defaults,
      ...originalOptions
    };
    let culpritsIndex;
    let culpritsLen;

    if (!opts.skipChecks && opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.every((rangeArr, indx) => {
      if (rangeArr.length !== 2) {
        culpritsIndex = indx;
        culpritsLen = rangeArr.length;
        return false;
      }

      return true;
    })) {
      throw new TypeError(`ranges-invert: [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 0)}) has not two but ${culpritsLen} elements!`);
    }

    if (!opts.skipChecks && !arrOfRanges.every((rangeArr, indx) => {
      if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
        throw new TypeError(`ranges-invert: [THROW_ID_07] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ${JSON.stringify(arrOfRanges, null, 0)}!`);
      }

      throw new TypeError(`ranges-invert: [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ${culpritsIndex + 1}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 0)}) does not consist of only natural numbers!`);
    }

    let prep;

    if (!opts.skipChecks) {
      prep = mergeRanges(arrOfRanges.filter(rangeArr => rangeArr[0] !== rangeArr[1]));
    } else {
      prep = arrOfRanges.filter(rangeArr => rangeArr[0] !== rangeArr[1]);
    }

    if (prep.length === 0) {
      if (strLen === 0) {
        return [];
      }

      return [[0, strLen]];
    }

    const res = prep.reduce((accum, currArr, i, arr) => {
      const res2 = [];

      if (i === 0 && arr[0][0] !== 0) {
        res2.push([0, arr[0][0]]);
      }

      const endingIndex = i < arr.length - 1 ? arr[i + 1][0] : strLen;

      if (currArr[1] !== endingIndex) {
        if (opts.skipChecks && currArr[1] > endingIndex) {
          throw new TypeError(`ranges-invert: [THROW_ID_08] The checking (opts.skipChecks) is off and input ranges were not sorted! We nearly wrote range [${currArr[1]}, ${endingIndex}] which is backwards. For investigation, whole ranges array is:\n${JSON.stringify(arr, null, 0)}`);
        }

        res2.push([currArr[1], endingIndex]);
      }

      return accum.concat(res2);
    }, []);
    return rangesCrop(res, strLen);
  }

  const HIGH_SURROGATE_START = 0xd800;
  const HIGH_SURROGATE_END = 0xdbff;
  const LOW_SURROGATE_START = 0xdc00;
  const REGIONAL_INDICATOR_START = 0x1f1e6;
  const REGIONAL_INDICATOR_END = 0x1f1ff;
  const FITZPATRICK_MODIFIER_START = 0x1f3fb;
  const FITZPATRICK_MODIFIER_END = 0x1f3ff;
  const VARIATION_MODIFIER_START = 0xfe00;
  const VARIATION_MODIFIER_END = 0xfe0f;
  const DIACRITICAL_MARKS_START = 0x20d0;
  const DIACRITICAL_MARKS_END = 0x20ff;
  const ZWJ = 0x200d;
  const GRAPHEMS = [0x0308, // ( ◌̈ ) COMBINING DIAERESIS
  0x0937, // ( ष ) DEVANAGARI LETTER SSA
  0x0937, // ( ष ) DEVANAGARI LETTER SSA
  0x093F, // ( ि ) DEVANAGARI VOWEL SIGN I
  0x093F, // ( ि ) DEVANAGARI VOWEL SIGN I
  0x0BA8, // ( ந ) TAMIL LETTER NA
  0x0BBF, // ( ி ) TAMIL VOWEL SIGN I
  0x0BCD, // ( ◌்) TAMIL SIGN VIRAMA
  0x0E31, // ( ◌ั ) THAI CHARACTER MAI HAN-AKAT
  0x0E33, // ( ำ ) THAI CHARACTER SARA AM
  0x0E40, // ( เ ) THAI CHARACTER SARA E
  0x0E49, // ( เ ) THAI CHARACTER MAI THO
  0x1100, // ( ᄀ ) HANGUL CHOSEONG KIYEOK
  0x1161, // ( ᅡ ) HANGUL JUNGSEONG A
  0x11A8 // ( ᆨ ) HANGUL JONGSEONG KIYEOK
  ];

  function runes(string) {
    if (typeof string !== 'string') {
      throw new Error('string cannot be undefined or null');
    }

    const result = [];
    let i = 0;
    let increment = 0;

    while (i < string.length) {
      increment += nextUnits(i + increment, string);

      if (isGraphem(string[i + increment])) {
        increment++;
      }

      if (isVariationSelector(string[i + increment])) {
        increment++;
      }

      if (isDiacriticalMark(string[i + increment])) {
        increment++;
      }

      if (isZeroWidthJoiner(string[i + increment])) {
        increment++;
        continue;
      }

      result.push(string.substring(i, i + increment));
      i += increment;
      increment = 0;
    }

    return result;
  } // Decide how many code units make up the current character.
  // BMP characters: 1 code unit
  // Non-BMP characters (represented by surrogate pairs): 2 code units
  // Emoji with skin-tone modifiers: 4 code units (2 code points)
  // Country flags: 4 code units (2 code points)
  // Variations: 2 code units


  function nextUnits(i, string) {
    const current = string[i]; // If we don't have a value that is part of a surrogate pair, or we're at
    // the end, only take the value at i

    if (!isFirstOfSurrogatePair(current) || i === string.length - 1) {
      return 1;
    }

    const currentPair = current + string[i + 1];
    let nextPair = string.substring(i + 2, i + 5); // Country flags are comprised of two regional indicator symbols,
    // each represented by a surrogate pair.
    // See http://emojipedia.org/flags/
    // If both pairs are regional indicator symbols, take 4

    if (isRegionalIndicator(currentPair) && isRegionalIndicator(nextPair)) {
      return 4;
    } // If the next pair make a Fitzpatrick skin tone
    // modifier, take 4
    // See http://emojipedia.org/modifiers/
    // Technically, only some code points are meant to be
    // combined with the skin tone modifiers. This function
    // does not check the current pair to see if it is
    // one of them.


    if (isFitzpatrickModifier(nextPair)) {
      return 4;
    }

    return 2;
  }

  function isFirstOfSurrogatePair(string) {
    return string && betweenInclusive(string[0].charCodeAt(0), HIGH_SURROGATE_START, HIGH_SURROGATE_END);
  }

  function isRegionalIndicator(string) {
    return betweenInclusive(codePointFromSurrogatePair(string), REGIONAL_INDICATOR_START, REGIONAL_INDICATOR_END);
  }

  function isFitzpatrickModifier(string) {
    return betweenInclusive(codePointFromSurrogatePair(string), FITZPATRICK_MODIFIER_START, FITZPATRICK_MODIFIER_END);
  }

  function isVariationSelector(string) {
    return typeof string === 'string' && betweenInclusive(string.charCodeAt(0), VARIATION_MODIFIER_START, VARIATION_MODIFIER_END);
  }

  function isDiacriticalMark(string) {
    return typeof string === 'string' && betweenInclusive(string.charCodeAt(0), DIACRITICAL_MARKS_START, DIACRITICAL_MARKS_END);
  }

  function isGraphem(string) {
    return typeof string === 'string' && GRAPHEMS.indexOf(string.charCodeAt(0)) !== -1;
  }

  function isZeroWidthJoiner(string) {
    return typeof string === 'string' && string.charCodeAt(0) === ZWJ;
  }

  function codePointFromSurrogatePair(pair) {
    const highOffset = pair.charCodeAt(0) - HIGH_SURROGATE_START;
    const lowOffset = pair.charCodeAt(1) - LOW_SURROGATE_START;
    return (highOffset << 10) + lowOffset + 0x10000;
  }

  function betweenInclusive(value, lower, upper) {
    return value >= lower && value <= upper;
  }

  function substring(string, start, width) {
    const chars = runes(string);

    if (start === undefined) {
      return string;
    }

    if (start >= chars.length) {
      return '';
    }

    const rest = chars.length - start;
    const stringWidth = width === undefined ? rest : width;
    let endIndex = start + stringWidth;

    if (endIndex > start + rest) {
      endIndex = undefined;
    }

    return chars.slice(start, endIndex).join('');
  }

  var runes_1 = runes;
  var substr = substring;
  runes_1.substr = substr;

  var isArr$2 = Array.isArray;

  function processOutside(originalStr, originalRanges, cb) {
    var skipChecks = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    //
    // internal functions:
    //
    function isFunction(functionToCheck) {
      return functionToCheck && {}.toString.call(functionToCheck) === "[object Function]";
    } //
    // insurance:
    //


    if (typeof originalStr !== "string") {
      if (originalStr === undefined) {
        throw new Error("ranges-process-outside: [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!");
      } else {
        throw new Error("ranges-process-outside: [THROW_ID_02] the first input argument must be string! It was given as:\n".concat(JSON.stringify(originalStr, null, 4), " (type ").concat(_typeof(originalStr), ")"));
      }
    }

    if (originalRanges && !isArr$2(originalRanges)) {
      throw new Error("ranges-process-outside: [THROW_ID_03] the second input argument must be array of ranges or null! It was given as:\n".concat(JSON.stringify(originalRanges, null, 4), " (type ").concat(_typeof(originalRanges), ")"));
    }

    if (!isFunction(cb)) {
      throw new Error("ranges-process-outside: [THROW_ID_04] the third input argument must be a function! It was given as:\n".concat(JSON.stringify(cb, null, 4), " (type ").concat(_typeof(cb), ")"));
    } // separate the iterator because it might be called with inverted ranges or
    // with separately calculated "everything" if the ranges are empty/falsey


    function iterator(str, arrOfArrays) {
      arrOfArrays.forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            fromIdx = _ref2[0],
            toIdx = _ref2[1];

        for (var i = fromIdx; i < toIdx; i++) {
          var charLength = runes_1(str.slice(i))[0].length;
          cb(i, i + charLength, function (offsetValue) {
            /* istanbul ignore else */
            if (offsetValue != null) {
              i += offsetValue;
            }
          });

          if (charLength && charLength > 1) {
            i += charLength - 1;
          }
        }
      });
    }

    if (originalRanges && originalRanges.length) {
      // if ranges are given, invert and run callback against each character
      var temp = rangesCrop(rangesInvert(skipChecks ? originalRanges : originalRanges, originalStr.length, {
        skipChecks: !!skipChecks
      }), originalStr.length);
      iterator(originalStr, temp);
    } else {
      // otherwise, run callback on everything
      iterator(originalStr, [[0, originalStr.length]]);
    }
  }

  return processOutside;

})));
