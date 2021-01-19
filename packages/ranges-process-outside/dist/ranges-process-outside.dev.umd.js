/**
 * ranges-process-outside
 * Iterate string considering ranges, as if they were already applied
 * Version: 3.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-process-outside/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.rangesProcessOutside = {}));
}(this, (function (exports) { 'use strict';

var HIGH_SURROGATE_START = 0xd800;
var HIGH_SURROGATE_END = 0xdbff;
var LOW_SURROGATE_START = 0xdc00;
var REGIONAL_INDICATOR_START = 0x1f1e6;
var REGIONAL_INDICATOR_END = 0x1f1ff;
var FITZPATRICK_MODIFIER_START = 0x1f3fb;
var FITZPATRICK_MODIFIER_END = 0x1f3ff;
var VARIATION_MODIFIER_START = 0xfe00;
var VARIATION_MODIFIER_END = 0xfe0f;
var DIACRITICAL_MARKS_START = 0x20d0;
var DIACRITICAL_MARKS_END = 0x20ff;
var ZWJ = 0x200d;
var GRAPHEMS = [0x0308, // ( ◌̈ ) COMBINING DIAERESIS
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

  var result = [];
  var i = 0;
  var increment = 0;

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
  var current = string[i]; // If we don't have a value that is part of a surrogate pair, or we're at
  // the end, only take the value at i

  if (!isFirstOfSurrogatePair(current) || i === string.length - 1) {
    return 1;
  }

  var currentPair = current + string[i + 1];
  var nextPair = string.substring(i + 2, i + 5); // Country flags are comprised of two regional indicator symbols,
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
  var highOffset = pair.charCodeAt(0) - HIGH_SURROGATE_START;
  var lowOffset = pair.charCodeAt(1) - LOW_SURROGATE_START;
  return (highOffset << 10) + lowOffset + 0x10000;
}

function betweenInclusive(value, lower, upper) {
  return value >= lower && value <= upper;
}

function substring(string, start, width) {
  var chars = runes(string);

  if (start === undefined) {
    return string;
  }

  if (start >= chars.length) {
    return '';
  }

  var rest = chars.length - start;
  var stringWidth = width === undefined ? rest : width;
  var endIndex = start + stringWidth;

  if (endIndex > start + rest) {
    endIndex = undefined;
  }

  return chars.slice(start, endIndex).join('');
}

var runes_1 = runes;
var substr = substring;
runes_1.substr = substr;

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

/**
 * ranges-crop
 * Crop array of ranges when they go beyond the reference string's length
 * Version: 3.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-crop/
 */

function rCrop(arrOfRanges, strLen) {
  if (arrOfRanges === null) {
    return null;
  }

  if (!Array.isArray(arrOfRanges)) {
    throw new TypeError("ranges-crop: [THROW_ID_01] The first input's argument must be an array, consisting of range arrays! Currently its type is: " + typeof arrOfRanges + ", equal to: " + JSON.stringify(arrOfRanges, null, 4));
  } // strLen validation


  if (!Number.isInteger(strLen)) {
    throw new TypeError("ranges-crop: [THROW_ID_02] The second input's argument must be a natural number or zero (coming from String.length)! Currently its type is: " + typeof strLen + ", equal to: " + JSON.stringify(strLen, null, 4));
  }

  if (!arrOfRanges.filter(function (range) {
    return range;
  }).length) {
    return arrOfRanges.filter(function (range) {
      return range;
    });
  }

  var culpritsIndex = 0; // validate are range indexes natural numbers:

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
      throw new TypeError("ranges-crop: [THROW_ID_03] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = " + JSON.stringify(arrOfRanges, null, 0) + "!");
    }

    throw new TypeError("ranges-crop: [THROW_ID_04] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here " + culpritsIndex + "th range (" + JSON.stringify(arrOfRanges[culpritsIndex], null, 0) + ") does not consist of only natural numbers!");
  } // validate that any third argument values (if any) are of a string-type


  if (!arrOfRanges.filter(function (range) {
    return range;
  }).every(function (rangeArr, indx) {
    if (rangeArr[2] != null && typeof rangeArr[2] !== "string") {
      culpritsIndex = indx;
      return false;
    }

    return true;
  })) {
    throw new TypeError("ranges-crop: [THROW_ID_05] The third argument, if present at all, should be of a string-type or null. Currently the " + culpritsIndex + "th range " + JSON.stringify(arrOfRanges[culpritsIndex], null, 0) + " has a argument in the range of a type " + typeof arrOfRanges[culpritsIndex][2]);
  } //                       finally, the real action
  // ---------------------------------------------------------------------------


  var res = (rMerge(arrOfRanges) || []).filter(function (singleRangeArr) {
    return singleRangeArr[0] <= strLen && (singleRangeArr[2] != undefined || singleRangeArr[0] < strLen);
  }).map(function (singleRangeArr) {
    if (singleRangeArr[1] > strLen) {
      if (singleRangeArr[2] != undefined) {
        return [singleRangeArr[0], strLen, singleRangeArr[2]];
      }

      return [singleRangeArr[0], strLen];
    }

    return singleRangeArr;
  });
  return res === [] ? null : res;
}

function rInvert(arrOfRanges, strLen, originalOptions) {
  if (!Array.isArray(arrOfRanges) && arrOfRanges !== null) {
    throw new TypeError("ranges-invert: [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: " + typeof arrOfRanges + ", equal to: " + JSON.stringify(arrOfRanges, null, 4));
  } // strLen validation


  if (!Number.isInteger(strLen) || strLen < 0) {
    throw new TypeError("ranges-invert: [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: " + typeof strLen + ", equal to: " + JSON.stringify(strLen, null, 4));
  } // arrOfRanges validation


  if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
    throw new TypeError("ranges-invert: [THROW_ID_07] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = " + JSON.stringify(arrOfRanges, null, 0) + "!");
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
  } // opts validation // declare defaults, so we can enforce types later:


  var defaults = {
    strictlyTwoElementsInRangeArrays: false,
    skipChecks: false
  }; // fill any settings with defaults if missing:

  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOptions); // arrOfRanges validation


  var culpritsIndex = 0;
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
    throw new TypeError("ranges-invert: [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the " + culpritsIndex + "th range (" + JSON.stringify(arrOfRanges[culpritsIndex], null, 0) + ") has not two but " + culpritsLen + " elements!");
  } // validate are range indexes natural numbers:


  if (!opts.skipChecks && !arrOfRanges.every(function (rangeArr, indx) {
    if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
      culpritsIndex = indx;
      return false;
    }

    return true;
  })) {
    throw new TypeError("ranges-invert: [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here " + (culpritsIndex + 1) + "th range (" + JSON.stringify(arrOfRanges[culpritsIndex], null, 0) + ") does not consist of only natural numbers!");
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
    prep = rMerge(arrOfRanges.filter(function (rangeArr) {
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
        throw new TypeError("ranges-invert: [THROW_ID_08] The checking (opts.skipChecks) is off and input ranges were not sorted! We nearly wrote range [" + currArr[1] + ", " + endingIndex + "] which is backwards. For investigation, whole ranges array is:\n" + JSON.stringify(arr, null, 0));
      }

      res2.push([currArr[1], endingIndex]);
    }

    return accum.concat(res2);
  }, []);
  return rCrop(res, strLen);
}

var version = "3.0.2";

var version$1 = version;

function rProcessOutside(originalStr, originalRanges, cb, skipChecks) {
  if (skipChecks === void 0) {
    skipChecks = false;
  }

  //
  // insurance:
  //
  if (typeof originalStr !== "string") {
    if (originalStr === undefined) {
      throw new Error("ranges-process-outside: [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!");
    } else {
      throw new Error("ranges-process-outside: [THROW_ID_02] the first input argument must be string! It was given as:\n" + JSON.stringify(originalStr, null, 4) + " (type " + typeof originalStr + ")");
    }
  }

  if (originalRanges && (!Array.isArray(originalRanges) || originalRanges.length && !Array.isArray(originalRanges[0]))) {
    throw new Error("ranges-process-outside: [THROW_ID_03] the second input argument must be array of ranges or null! It was given as:\n" + JSON.stringify(originalRanges, null, 4) + " (type " + typeof originalRanges + ")");
  }

  if (typeof cb !== "function") {
    throw new Error("ranges-process-outside: [THROW_ID_04] the third input argument must be a function! It was given as:\n" + JSON.stringify(cb, null, 4) + " (type " + typeof cb + ")");
  } // separate the iterator because it might be called with inverted ranges or
  // with separately calculated "everything" if the ranges are empty/falsey


  function iterator(str, arrOfArrays) {
    (arrOfArrays || []).forEach(function (_ref) {
      var fromIdx = _ref[0],
          toIdx = _ref[1];

      var _loop = function _loop(_i) {
        var charLength = runes_1(str.slice(_i))[0].length;
        cb(_i, _i + charLength, function (offsetValue) {
          /* istanbul ignore else */
          if (offsetValue != null) {
            _i += offsetValue;
          }
        });

        if (charLength && charLength > 1) {
          _i += charLength - 1;
        }

        i = _i;
      };

      for (var i = fromIdx; i < toIdx; i++) {
        _loop(i);
      }
    });
  }

  if (originalRanges && originalRanges.length) {
    // if ranges are given, invert and run callback against each character
    var temp = rCrop(rInvert(skipChecks ? originalRanges : originalRanges, originalStr.length, {
      skipChecks: !!skipChecks
    }), originalStr.length);
    iterator(originalStr, temp);
  } else {
    // otherwise, run callback on everything
    iterator(originalStr, [[0, originalStr.length]]);
  }
}

exports.rProcessOutside = rProcessOutside;
exports.version = version$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
