/**
 * codsen-tokenizer
 * HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 * Version: 5.1.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/codsen-tokenizer/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.codsenTokenizer = {}));
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

/**
 * arrayiffy-if-string
 * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * Version: 3.13.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/arrayiffy-if-string/
 */

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
function arrayiffy(something) {
  if (typeof something === "string") {
    if (something.length) {
      return [something];
    }

    return [];
  }

  return something;
}

/* eslint no-plusplus:0 */

function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}

function isStr(something) {
  return typeof something === "string";
}

var defaults = {
  cb: undefined,
  i: false,
  trimBeforeMatching: false,
  trimCharsBeforeMatching: [],
  maxMismatches: 0,
  firstMustMatch: false,
  lastMustMatch: false
};

var defaultGetNextIdx = function defaultGetNextIdx(index) {
  return index + 1;
}; // eslint-disable-next-line consistent-return


function march(str, position, whatToMatchVal, originalOpts, special, getNextIdx) {
  if (special === void 0) {
    special = false;
  }

  if (getNextIdx === void 0) {
    getNextIdx = defaultGetNextIdx;
  }

  var whatToMatchValVal = typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal; // early ending case if matching EOL being at 0-th index:

  if (+position < 0 && special && whatToMatchValVal === "EOL") {
    return whatToMatchValVal;
  }

  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

  if (position >= str.length && !special) {
    return false;
  }

  var charsToCheckCount = special ? 1 : whatToMatchVal.length;
  var lastWasMismatched = false; // value is "false" or index of where it was activated
  // if no character was ever matched, even through if opts.maxMismatches
  // would otherwise allow to skip characters, this will act as a last
  // insurance - at least one character must have been matched to yield a
  // positive result!

  var atLeastSomethingWasMatched = false;
  var patience = opts.maxMismatches;
  var i = position;
  var somethingFound = false; // these two drive opts.firstMustMatch and opts.lastMustMatch:

  var firstCharacterMatched = false;
  var lastCharacterMatched = false;

  while (str[i]) {
    var nextIdx = getNextIdx(i);

    if (opts.trimBeforeMatching && str[i].trim() === "") {
      if (!str[nextIdx] && special && whatToMatchVal === "EOL") {
        return true;
      }

      i = getNextIdx(i);
      continue;
    }

    if (opts && !opts.i && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.includes(str[i]) || opts && opts.i && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.map(function (val) {
      return val.toLowerCase();
    }).includes(str[i].toLowerCase())) {
      if (special && whatToMatchVal === "EOL" && !str[nextIdx]) {
        // return true because we reached the zero'th index, exactly what we're looking for
        return true;
      }

      i = getNextIdx(i);
      continue;
    }

    var charToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount] : whatToMatchVal[charsToCheckCount - 1]; // let's match

    if (!opts.i && str[i] === charToCompareAgainst || opts.i && str[i].toLowerCase() === charToCompareAgainst.toLowerCase()) {
      if (!somethingFound) {
        somethingFound = true;
      }

      if (!atLeastSomethingWasMatched) {
        atLeastSomethingWasMatched = true;
      } // if this was the first character from the "to-match" list, flip the flag


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
        patience -= 1; // the bigger the maxMismatches, the further away we must check for
        // alternative matches

        for (var y = 0; y <= patience; y++) {
          // maybe str[i] will match against next charToCompareAgainst?
          var nextCharToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount + 1 + y] : whatToMatchVal[charsToCheckCount - 2 - y];
          var nextCharInSource = str[getNextIdx(i)];

          if (nextCharToCompareAgainst && (!opts.i && str[i] === nextCharToCompareAgainst || opts.i && str[i].toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && ( // ensure we're not skipping the first enforced character:
          !opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
            charsToCheckCount -= 2;
            somethingFound = true;
            break;
          } else if (nextCharInSource && nextCharToCompareAgainst && (!opts.i && nextCharInSource === nextCharToCompareAgainst || opts.i && nextCharInSource.toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && ( // ensure we're not skipping the first enforced character:
          !opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
            charsToCheckCount -= 1;
            somethingFound = true;
            break;
          } else if (nextCharToCompareAgainst === undefined && patience >= 0 && somethingFound && (!opts.firstMustMatch || firstCharacterMatched) && (!opts.lastMustMatch || lastCharacterMatched)) {
            // If "nextCharToCompareAgainst" is undefined, this
            // means there are no more characters left to match,
            // this is the last character to be matched.
            // This means, if patience >= 0, this is it,
            // the match is still positive.
            return i;
          } // ███████████████████████████████████████

        }

        if (!somethingFound) {
          // if the character was rogue, we mark it:
          lastWasMismatched = i; // patience--;
          // console.log(
          //   `350 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`patience`}\u001b[${39}m`} = ${patience}`
          // );
        }
      } else if (i === 0 && charsToCheckCount === 1 && !opts.lastMustMatch && atLeastSomethingWasMatched) {
        return 0;
      } else {
        return false;
      }
    } // turn off "lastWasMismatched" if it's on and it hasn't been activated
    // on this current index:


    if (lastWasMismatched !== false && lastWasMismatched !== i) {
      lastWasMismatched = false;
    } // if all was matched, happy days


    if (charsToCheckCount < 1) {
      return i;
    } // iterate onto the next index, otherwise while would loop infinitely


    i = getNextIdx(i);
  }

  if (charsToCheckCount > 0) {
    if (special && whatToMatchValVal === "EOL") {
      return true;
    }

    if (opts && opts.maxMismatches >= charsToCheckCount && atLeastSomethingWasMatched) {
      return lastWasMismatched || 0;
    }

    return false;
  }
} //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// Real deal


function main(mode, str, position, originalWhatToMatch, originalOpts) {
  // insurance
  if (isObj(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!" + (Array.isArray(originalOpts.trimBeforeMatching) ? " Did you mean to use opts.trimCharsBeforeMatching?" : ""));
  }

  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

  if (typeof opts.trimCharsBeforeMatching === "string") {
    // arrayiffy if needed:
    opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  } // stringify all:


  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(function (el) {
    return isStr(el) ? el : String(el);
  });

  if (!isStr(str)) {
    return false;
  }

  if (!str.length) {
    return false;
  }

  if (!Number.isInteger(position) || position < 0) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: " + typeof position + ", equal to:\n" + JSON.stringify(position, null, 4));
  }

  var whatToMatch;
  var special;

  if (isStr(originalWhatToMatch)) {
    whatToMatch = [originalWhatToMatch];
  } else if (Array.isArray(originalWhatToMatch)) {
    whatToMatch = originalWhatToMatch;
  } else if (!originalWhatToMatch) {
    whatToMatch = originalWhatToMatch;
  } else if (typeof originalWhatToMatch === "function") {
    whatToMatch = [];
    whatToMatch.push(originalWhatToMatch);
  } else {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's " + typeof originalWhatToMatch + ", equal to:\n" + JSON.stringify(originalWhatToMatch, null, 4));
  }

  if (originalOpts && !isObj(originalOpts)) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type \"" + typeof originalOpts + "\", and equal to:\n" + JSON.stringify(originalOpts, null, 4));
  }

  var culpritsIndex = 0;
  var culpritsVal = "";

  if (opts && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.some(function (el, i) {
    if (el.length > 1) {
      culpritsIndex = i;
      culpritsVal = el;
      return true;
    }

    return false;
  })) {
    throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index " + culpritsIndex + " is longer than 1 character, " + culpritsVal.length + " (equals to " + culpritsVal + "). Please split it into separate characters and put into array as separate elements.");
  } // action
  // CASE 1. If it's driven by callback-only, the 3rd input argument, what to look
  // for - is falsey - empty string within array (or not), OR given null


  if (!whatToMatch || !Array.isArray(whatToMatch) || // 0
  Array.isArray(whatToMatch) && !whatToMatch.length || // []
  Array.isArray(whatToMatch) && whatToMatch.length === 1 && isStr(whatToMatch[0]) && !whatToMatch[0].trim() // [""]
  ) {
      if (typeof opts.cb === "function") {
        var firstCharOutsideIndex; // matchLeft() or matchRightIncl() methods start at index "position"

        var startingPosition = position;

        if (mode === "matchLeftIncl" || mode === "matchRight") {
          startingPosition += 1;
        }

        if (mode[5] === "L") {
          for (var y = startingPosition; y--;) {
            // assemble the value of the current character
            var currentChar = str[y]; // do the actual evaluation, is the current character non-whitespace/non-skiped

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar !== undefined && currentChar.trim()) && (!opts.trimCharsBeforeMatching || !opts.trimCharsBeforeMatching.length || currentChar !== undefined && !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        } else if (mode.startsWith("matchRight")) {
          for (var _y = startingPosition; _y < str.length; _y++) {
            // assemble the value of the current character
            var _currentChar = str[_y]; // do the actual evaluation, is the current character non-whitespace/non-skiped

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && _currentChar.trim()) && (!opts.trimCharsBeforeMatching || !opts.trimCharsBeforeMatching.length || !opts.trimCharsBeforeMatching.includes(_currentChar))) {
              firstCharOutsideIndex = _y;
              break;
            }
          }
        }

        if (firstCharOutsideIndex === undefined) {
          return false;
        }

        var wholeCharacterOutside = str[firstCharOutsideIndex];
        var indexOfTheCharacterAfter = firstCharOutsideIndex + 1;
        var theRemainderOfTheString = "";

        if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
          theRemainderOfTheString = str.slice(0, indexOfTheCharacterAfter);
        }

        if (mode[5] === "L") {
          return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
        } // ELSE matchRight & matchRightIncl


        if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
          theRemainderOfTheString = str.slice(firstCharOutsideIndex);
        }

        return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
      }

      var extraNote = "";

      if (!originalOpts) {
        extraNote = " More so, the whole options object, the fourth input argument, is missing!";
      }

      throw new Error("string-match-left-right/" + mode + "(): [THROW_ID_08] the third argument, \"whatToMatch\", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key \"cb\" is not set!" + extraNote);
    } // Case 2. Normal operation where callback may or may not be present, but it is
  // only accompanying the matching of what was given in 3rd input argument.
  // Then if 3rd arg's contents were matched, callback is checked and its Boolean
  // result is merged using logical "AND" - meaning both have to be true to yield
  // final result "true".


  for (var i = 0, len = whatToMatch.length; i < len; i++) {
    special = typeof whatToMatch[i] === "function"; // since input can be function, we need to grab the value explicitly:

    var whatToMatchVal = whatToMatch[i];
    var fullCharacterInFront = void 0;
    var indexOfTheCharacterInFront = void 0;
    var restOfStringInFront = "";
    var _startingPosition = position;

    if (mode === "matchRight") {
      _startingPosition += 1;
    } else if (mode === "matchLeft") {
      _startingPosition -= 1;
    }

    var found = march(str, _startingPosition, whatToMatchVal, opts, special, function (i2) {
      return mode[5] === "L" ? i2 - 1 : i2 + 1;
    }); // if march() returned positive result and it was "special" case,
    // Bob's your uncle, here's the result:

    if (found && special && typeof whatToMatchVal === "function" && whatToMatchVal() === "EOL") {
      return whatToMatchVal() && (opts.cb ? opts.cb(fullCharacterInFront, restOfStringInFront, indexOfTheCharacterInFront) : true) ? whatToMatchVal() : false;
    } // now, the "found" is the index of the first character of what was found.
    // we need to calculate the character to the left/right of it:


    if (Number.isInteger(found)) {
      indexOfTheCharacterInFront = mode.startsWith("matchLeft") ? found - 1 : found + 1; //

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
} // External API functions


function matchLeftIncl(str, position, whatToMatch, opts) {
  return main("matchLeftIncl", str, position, whatToMatch, opts);
}

function matchLeft(str, position, whatToMatch, opts) {
  return main("matchLeft", str, position, whatToMatch, opts);
}

function matchRightIncl(str, position, whatToMatch, opts) {
  return main("matchRightIncl", str, position, whatToMatch, opts);
}

function matchRight(str, position, whatToMatch, opts) {
  return main("matchRight", str, position, whatToMatch, opts);
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
var lodash_clonedeep = createCommonjsModule(function (module, exports) {
  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;
  /** Used to stand-in for `undefined` hash values. */

  var HASH_UNDEFINED = '__lodash_hash_undefined__';
  /** Used as references for various `Number` constants. */

  var MAX_SAFE_INTEGER = 9007199254740991;
  /** `Object#toString` result references. */

  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      symbolTag = '[object Symbol]',
      weakMapTag = '[object WeakMap]';
  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';
  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */

  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  /** Used to match `RegExp` flags from their coerced string values. */

  var reFlags = /\w*$/;
  /** Used to detect host constructors (Safari). */

  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  /** Used to detect unsigned integer values. */

  var reIsUint = /^(?:0|[1-9]\d*)$/;
  /** Used to identify `toStringTag` values supported by `_.clone`. */

  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
  /** Detect free variable `global` from Node.js. */

  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  /** Detect free variable `self`. */

  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = freeGlobal || freeSelf || Function('return this')();
  /** Detect free variable `exports`. */

  var freeExports = exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */

  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  /** Detect the popular CommonJS extension `module.exports`. */

  var moduleExports = freeModule && freeModule.exports === freeExports;
  /**
   * Adds the key-value `pair` to `map`.
   *
   * @private
   * @param {Object} map The map to modify.
   * @param {Array} pair The key-value pair to add.
   * @returns {Object} Returns `map`.
   */

  function addMapEntry(map, pair) {
    // Don't return `map.set` because it's not chainable in IE 11.
    map.set(pair[0], pair[1]);
    return map;
  }
  /**
   * Adds `value` to `set`.
   *
   * @private
   * @param {Object} set The set to modify.
   * @param {*} value The value to add.
   * @returns {Object} Returns `set`.
   */


  function addSetEntry(set, value) {
    // Don't return `set.add` because it's not chainable in IE 11.
    set.add(value);
    return set;
  }
  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */


  function arrayEach(array, iteratee) {
    var index = -1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }

    return array;
  }
  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */


  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }

    return array;
  }
  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */


  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array ? array.length : 0;

    if (initAccum && length) {
      accumulator = array[++index];
    }

    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }

    return accumulator;
  }
  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */


  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }

    return result;
  }
  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */


  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }
  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */


  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;

    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }

    return result;
  }
  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */


  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);
    map.forEach(function (value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */


  function overArg(func, transform) {
    return function (arg) {
      return func(transform(arg));
    };
  }
  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */


  function setToArray(set) {
    var index = -1,
        result = Array(set.size);
    set.forEach(function (value) {
      result[++index] = value;
    });
    return result;
  }
  /** Used for built-in method references. */


  var arrayProto = Array.prototype,
      funcProto = Function.prototype,
      objectProto = Object.prototype;
  /** Used to detect overreaching core-js shims. */

  var coreJsData = root['__core-js_shared__'];
  /** Used to detect methods masquerading as native. */

  var maskSrcKey = function () {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
  }();
  /** Used to resolve the decompiled source of functions. */


  var funcToString = funcProto.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty = objectProto.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString = objectProto.toString;
  /** Used to detect if a method is native. */

  var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  /** Built-in value references. */

  var Buffer = moduleExports ? root.Buffer : undefined,
      Symbol = root.Symbol,
      Uint8Array = root.Uint8Array,
      getPrototype = overArg(Object.getPrototypeOf, Object),
      objectCreate = Object.create,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      splice = arrayProto.splice;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeGetSymbols = Object.getOwnPropertySymbols,
      nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
      nativeKeys = overArg(Object.keys, Object);
  /* Built-in method references that are verified to be native. */

  var DataView = getNative(root, 'DataView'),
      Map = getNative(root, 'Map'),
      Promise = getNative(root, 'Promise'),
      Set = getNative(root, 'Set'),
      WeakMap = getNative(root, 'WeakMap'),
      nativeCreate = getNative(Object, 'create');
  /** Used to detect maps, sets, and weakmaps. */

  var dataViewCtorString = toSource(DataView),
      mapCtorString = toSource(Map),
      promiseCtorString = toSource(Promise),
      setCtorString = toSource(Set),
      weakMapCtorString = toSource(WeakMap);
  /** Used to convert symbols to primitives and strings. */

  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function Hash(entries) {
    var index = -1,
        length = entries ? entries.length : 0;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */


  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }
  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }
  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function hashGet(key) {
    var data = this.__data__;

    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }

    return hasOwnProperty.call(data, key) ? data[key] : undefined;
  }
  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
  }
  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */


  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
  } // Add methods to `Hash`.


  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function ListCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */


  function listCacheClear() {
    this.__data__ = [];
  }
  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }

    var lastIndex = data.length - 1;

    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }

    return true;
  }
  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
  }
  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }
  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */


  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }

    return this;
  } // Add methods to `ListCache`.


  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function MapCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;
    this.clear();

    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */


  function mapCacheClear() {
    this.__data__ = {
      'hash': new Hash(),
      'map': new (Map || ListCache)(),
      'string': new Hash()
    };
  }
  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function mapCacheDelete(key) {
    return getMapData(this, key)['delete'](key);
  }
  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }
  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }
  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */


  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  } // Add methods to `MapCache`.


  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */

  function Stack(entries) {
    this.__data__ = new ListCache(entries);
  }
  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */


  function stackClear() {
    this.__data__ = new ListCache();
  }
  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */


  function stackDelete(key) {
    return this.__data__['delete'](key);
  }
  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */


  function stackGet(key) {
    return this.__data__.get(key);
  }
  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */


  function stackHas(key) {
    return this.__data__.has(key);
  }
  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */


  function stackSet(key, value) {
    var cache = this.__data__;

    if (cache instanceof ListCache) {
      var pairs = cache.__data__;

      if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        return this;
      }

      cache = this.__data__ = new MapCache(pairs);
    }

    cache.set(key, value);
    return this;
  } // Add methods to `Stack`.


  Stack.prototype.clear = stackClear;
  Stack.prototype['delete'] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */

  function arrayLikeKeys(value, inherited) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    // Safari 9 makes `arguments.length` enumerable in strict mode.
    var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
    var length = result.length,
        skipIndexes = !!length;

    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
        result.push(key);
      }
    }

    return result;
  }
  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */


  function assignValue(object, key, value) {
    var objValue = object[key];

    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
      object[key] = value;
    }
  }
  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function assocIndexOf(array, key) {
    var length = array.length;

    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }

    return -1;
  }
  /**
   * The base implementation of `_.assign` without support for multiple sources
   * or `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */


  function baseAssign(object, source) {
    return object && copyObject(source, keys(source), object);
  }
  /**
   * The base implementation of `_.clone` and `_.cloneDeep` which tracks
   * traversed objects.
   *
   * @private
   * @param {*} value The value to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @param {boolean} [isFull] Specify a clone including symbols.
   * @param {Function} [customizer] The function to customize cloning.
   * @param {string} [key] The key of `value`.
   * @param {Object} [object] The parent object of `value`.
   * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
   * @returns {*} Returns the cloned value.
   */


  function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
    var result;

    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }

    if (result !== undefined) {
      return result;
    }

    if (!isObject(value)) {
      return value;
    }

    var isArr = isArray(value);

    if (isArr) {
      result = initCloneArray(value);

      if (!isDeep) {
        return copyArray(value, result);
      }
    } else {
      var tag = getTag(value),
          isFunc = tag == funcTag || tag == genTag;

      if (isBuffer(value)) {
        return cloneBuffer(value, isDeep);
      }

      if (tag == objectTag || tag == argsTag || isFunc && !object) {
        if (isHostObject(value)) {
          return object ? value : {};
        }

        result = initCloneObject(isFunc ? {} : value);

        if (!isDeep) {
          return copySymbols(value, baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }

        result = initCloneByTag(value, tag, baseClone, isDeep);
      }
    } // Check for circular references and return its corresponding clone.


    stack || (stack = new Stack());
    var stacked = stack.get(value);

    if (stacked) {
      return stacked;
    }

    stack.set(value, result);

    if (!isArr) {
      var props = isFull ? getAllKeys(value) : keys(value);
    }

    arrayEach(props || value, function (subValue, key) {
      if (props) {
        key = subValue;
        subValue = value[key];
      } // Recursively populate clone (susceptible to call stack limits).


      assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
    });
    return result;
  }
  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} prototype The object to inherit from.
   * @returns {Object} Returns the new object.
   */


  function baseCreate(proto) {
    return isObject(proto) ? objectCreate(proto) : {};
  }
  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */


  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }
  /**
   * The base implementation of `getTag`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */


  function baseGetTag(value) {
    return objectToString.call(value);
  }
  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */


  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }

    var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }
  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */


  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }

    var result = [];

    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }

    return result;
  }
  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */


  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }

    var result = new buffer.constructor(buffer.length);
    buffer.copy(result);
    return result;
  }
  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */


  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
  }
  /**
   * Creates a clone of `dataView`.
   *
   * @private
   * @param {Object} dataView The data view to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned data view.
   */


  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }
  /**
   * Creates a clone of `map`.
   *
   * @private
   * @param {Object} map The map to clone.
   * @param {Function} cloneFunc The function to clone values.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned map.
   */


  function cloneMap(map, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
    return arrayReduce(array, addMapEntry, new map.constructor());
  }
  /**
   * Creates a clone of `regexp`.
   *
   * @private
   * @param {Object} regexp The regexp to clone.
   * @returns {Object} Returns the cloned regexp.
   */


  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }
  /**
   * Creates a clone of `set`.
   *
   * @private
   * @param {Object} set The set to clone.
   * @param {Function} cloneFunc The function to clone values.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned set.
   */


  function cloneSet(set, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
    return arrayReduce(array, addSetEntry, new set.constructor());
  }
  /**
   * Creates a clone of the `symbol` object.
   *
   * @private
   * @param {Object} symbol The symbol object to clone.
   * @returns {Object} Returns the cloned symbol object.
   */


  function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  }
  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */


  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
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
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */


  function copyObject(source, props, object, customizer) {
    object || (object = {});
    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
      assignValue(object, key, newValue === undefined ? source[key] : newValue);
    }

    return object;
  }
  /**
   * Copies own symbol properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy symbols from.
   * @param {Object} [object={}] The object to copy symbols to.
   * @returns {Object} Returns `object`.
   */


  function copySymbols(source, object) {
    return copyObject(source, getSymbols(source), object);
  }
  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */


  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }
  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */


  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
  }
  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */


  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }
  /**
   * Creates an array of the own enumerable symbol properties of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */


  var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */

  var getTag = baseGetTag; // Fallback for data views, maps, sets, and weak maps in IE 11,
  // for data views in Edge < 14, and promises in Node.js.

  if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
    getTag = function getTag(value) {
      var result = objectToString.call(value),
          Ctor = result == objectTag ? value.constructor : undefined,
          ctorString = Ctor ? toSource(Ctor) : undefined;

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;

          case mapCtorString:
            return mapTag;

          case promiseCtorString:
            return promiseTag;

          case setCtorString:
            return setTag;

          case weakMapCtorString:
            return weakMapTag;
        }
      }

      return result;
    };
  }
  /**
   * Initializes an array clone.
   *
   * @private
   * @param {Array} array The array to clone.
   * @returns {Array} Returns the initialized clone.
   */


  function initCloneArray(array) {
    var length = array.length,
        result = array.constructor(length); // Add properties assigned by `RegExp#exec`.

    if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
      result.index = array.index;
      result.input = array.input;
    }

    return result;
  }
  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */


  function initCloneObject(object) {
    return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
  }
  /**
   * Initializes an object clone based on its `toStringTag`.
   *
   * **Note:** This function only supports cloning values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {string} tag The `toStringTag` of the object to clone.
   * @param {Function} cloneFunc The function to clone values.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the initialized clone.
   */


  function initCloneByTag(object, tag, cloneFunc, isDeep) {
    var Ctor = object.constructor;

    switch (tag) {
      case arrayBufferTag:
        return cloneArrayBuffer(object);

      case boolTag:
      case dateTag:
        return new Ctor(+object);

      case dataViewTag:
        return cloneDataView(object, isDeep);

      case float32Tag:
      case float64Tag:
      case int8Tag:
      case int16Tag:
      case int32Tag:
      case uint8Tag:
      case uint8ClampedTag:
      case uint16Tag:
      case uint32Tag:
        return cloneTypedArray(object, isDeep);

      case mapTag:
        return cloneMap(object, isDeep, cloneFunc);

      case numberTag:
      case stringTag:
        return new Ctor(object);

      case regexpTag:
        return cloneRegExp(object);

      case setTag:
        return cloneSet(object, isDeep, cloneFunc);

      case symbolTag:
        return cloneSymbol(object);
    }
  }
  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */


  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == 'number' || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
  }
  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */


  function isKeyable(value) {
    var type = typeof value;
    return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
  }
  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */


  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }
  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */


  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
    return value === proto;
  }
  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to process.
   * @returns {string} Returns the source code.
   */


  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}

      try {
        return func + '';
      } catch (e) {}
    }

    return '';
  }
  /**
   * This method is like `_.clone` except that it recursively clones `value`.
   *
   * @static
   * @memberOf _
   * @since 1.0.0
   * @category Lang
   * @param {*} value The value to recursively clone.
   * @returns {*} Returns the deep cloned value.
   * @see _.clone
   * @example
   *
   * var objects = [{ 'a': 1 }, { 'b': 2 }];
   *
   * var deep = _.cloneDeep(objects);
   * console.log(deep[0] === objects[0]);
   * // => false
   */


  function cloneDeep(value) {
    return baseClone(value, true, true);
  }
  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */


  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }
  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */


  function isArguments(value) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') && (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
  }
  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */


  var isArray = Array.isArray;
  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */

  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }
  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */


  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }
  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */


  var isBuffer = nativeIsBuffer || stubFalse;
  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */

  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : '';
    return tag == funcTag || tag == genTag;
  }
  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */


  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
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
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */


  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */


  function stubArray() {
    return [];
  }
  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */


  function stubFalse() {
    return false;
  }

  module.exports = cloneDeep;
});

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
/** Used for built-in method references. */


var funcProto = Function.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString = funcProto.toString;
/** Used to infer the `Object` constructor. */

funcToString.call(Object);

var RAWNBSP = "\xA0"; // separates the value from flags

function rightMain(_ref) {
  var str = _ref.str,
      _ref$idx = _ref.idx,
      idx = _ref$idx === void 0 ? 0 : _ref$idx,
      _ref$stopAtNewlines = _ref.stopAtNewlines,
      stopAtNewlines = _ref$stopAtNewlines === void 0 ? false : _ref$stopAtNewlines,
      _ref$stopAtRawNbsp = _ref.stopAtRawNbsp,
      stopAtRawNbsp = _ref$stopAtRawNbsp === void 0 ? false : _ref$stopAtRawNbsp;

  if (typeof str !== "string" || !str.length) {
    return null;
  }

  if (!idx || typeof idx !== "number") {
    idx = 0;
  }

  if (!str[idx + 1]) {
    return null;
  }

  if ( // next character exists
  str[idx + 1] && ( // and...
  // it's solid
  str[idx + 1].trim() || // or it's a whitespace character, but...
  // stop at newlines is on
  stopAtNewlines && // and it's a newline
  "\n\r".includes(str[idx + 1]) || // stop at raw nbsp is on
  stopAtRawNbsp && // and it's a raw nbsp
  str[idx + 1] === RAWNBSP)) {
    // best case scenario - next character is non-whitespace:
    return idx + 1;
  }

  if ( // second next character exists
  str[idx + 2] && ( // and...
  // it's solid
  str[idx + 2].trim() || // it's a whitespace character and...
  // stop at newlines is on
  stopAtNewlines && // and it's a newline
  "\n\r".includes(str[idx + 2]) || // stop at raw nbsp is on
  stopAtRawNbsp && // and it's a raw nbsp
  str[idx + 2] === RAWNBSP)) {
    // second best case scenario - second next character is non-whitespace:
    return idx + 2;
  } // worst case scenario - traverse forwards


  for (var i = idx + 1, len = str.length; i < len; i++) {
    if ( // it's solid
    str[i].trim() || // it's a whitespace character and...
    // stop at newlines is on
    stopAtNewlines && // and it's a newline
    "\n\r".includes(str[i]) || // stop at raw nbsp is on
    stopAtRawNbsp && // and it's a raw nbsp
    str[i] === RAWNBSP) {
      return i;
    }
  }

  return null;
}

function right(str, idx) {
  if (idx === void 0) {
    idx = 0;
  }

  return rightMain({
    str: str,
    idx: idx,
    stopAtNewlines: false,
    stopAtRawNbsp: false
  });
}
//
//       lllllll                        ffffffffffffffff           tttt                    ((((((       ))))))
//       l:::::l                       f::::::::::::::::f       ttt:::t                  ((::::::(     )::::::))
//       l:::::l                      f::::::::::::::::::f      t:::::t                ((:::::::(       ):::::::))
//       l:::::l                      f::::::fffffff:::::f      t:::::t               (:::::::((         )):::::::)
//       l::::l     eeeeeeeeeeee     f:::::f       ffffffttttttt:::::ttttttt         (::::::(             )::::::)
//       l::::l   ee::::::::::::ee   f:::::f             t:::::::::::::::::t         (:::::(               ):::::)
//       l::::l  e::::::eeeee:::::eef:::::::ffffff       t:::::::::::::::::t         (:::::(               ):::::)
//       l::::l e::::::e     e:::::ef::::::::::::f       tttttt:::::::tttttt         (:::::(               ):::::)
//       l::::l e:::::::eeeee::::::ef::::::::::::f             t:::::t               (:::::(               ):::::)
//       l::::l e:::::::::::::::::e f:::::::ffffff             t:::::t               (:::::(               ):::::)
//       l::::l e::::::eeeeeeeeeee   f:::::f                   t:::::t               (:::::(               ):::::)
//       l::::l e:::::::e            f:::::f                   t:::::t    tttttt     (::::::(             )::::::)
//       l::::::le::::::::e          f:::::::f                  t::::::tttt:::::t     (:::::::((         )):::::::)
//       l::::::l e::::::::eeeeeeee  f:::::::f                  tt::::::::::::::t      ((:::::::(       ):::::::))
//       l::::::l  ee:::::::::::::e  f:::::::f                    tt:::::::::::tt        ((::::::(     )::::::)
//       llllllll    eeeeeeeeeeeeee  fffffffff                      ttttttttttt            ((((((       ))))))
//
//
// Finds the index of the first non-whitespace character on the left


function leftMain(_ref2) {
  var str = _ref2.str,
      idx = _ref2.idx,
      stopAtNewlines = _ref2.stopAtNewlines,
      stopAtRawNbsp = _ref2.stopAtRawNbsp;

  if (typeof str !== "string" || !str.length) {
    return null;
  }

  if (!idx || typeof idx !== "number") {
    idx = 0;
  }

  if (idx < 1) {
    return null;
  }

  if ( // ~- means minus one, in bitwise
  str[~-idx] && ( // either it's not a whitespace
  str[~-idx].trim() || // or it is whitespace, but...
  // stop at newlines is on
  stopAtNewlines && // and it's a newline
  "\n\r".includes(str[~-idx]) || // stop at raw nbsp is on
  stopAtRawNbsp && // and it's a raw nbsp
  str[~-idx] === RAWNBSP)) {
    // best case scenario - next character is non-whitespace:
    return ~-idx;
  } // if we reached this point, this means character on the left is whitespace -
  // fine - check the next character on the left, str[idx - 2]


  if ( // second character exists
  str[idx - 2] && ( // either it's not whitespace so Bob's your uncle here's non-whitespace character
  str[idx - 2].trim() || // it is whitespace, but...
  // stop at newlines is on
  stopAtNewlines && // it's some sort of a newline
  "\n\r".includes(str[idx - 2]) || // stop at raw nbsp is on
  stopAtRawNbsp && // and it's a raw nbsp
  str[idx - 2] === RAWNBSP)) {
    // second best case scenario - second next character is non-whitespace:
    return idx - 2;
  } // worst case scenario - traverse backwards


  for (var i = idx; i--;) {
    if (str[i] && ( // it's non-whitespace character
    str[i].trim() || // or it is whitespace character, but...
    // stop at newlines is on
    stopAtNewlines && // it's some sort of a newline
    "\n\r".includes(str[i]) || // stop at raw nbsp is on
    stopAtRawNbsp && // and it's a raw nbsp
    str[i] === RAWNBSP)) {
      return i;
    }
  }

  return null;
}

function left(str, idx) {
  if (idx === void 0) {
    idx = 0;
  }

  return leftMain({
    str: str,
    idx: idx,
    stopAtNewlines: false,
    stopAtRawNbsp: false
  });
}

/**
 * html-all-known-attributes
 * All HTML attributes known to the Humanity
 * Version: 4.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/html-all-known-attributes/
 */
var allHtmlAttribs = new Set(["abbr", "accept", "accept-charset", "accesskey", "action", "align", "alink", "allow", "alt", "archive", "async", "autocapitalize", "autocomplete", "autofocus", "autoplay", "axis", "background", "background-attachment", "background-color", "background-image", "background-position", "background-position-x", "background-position-y", "background-repeat", "bgcolor", "border", "border-bottom", "border-bottom-color", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-style", "border-top", "border-top-color", "border-top-style", "border-top-width", "border-width", "buffered", "capture", "cellpadding", "cellspacing", "challenge", "char", "charoff", "charset", "checked", "cite", "class", "classid", "clear", "clip", "code", "codebase", "codetype", "color", "cols", "colspan", "column-span", "compact", "content", "contenteditable", "contextmenu", "controls", "coords", "crossorigin", "csp", "cursor", "data", "data-*", "datetime", "declare", "decoding", "default", "defer", "dir", "direction", "dirname", "disabled", "display", "download", "draggable", "dropzone", "enctype", "enterkeyhint", "face", "filter", "float", "font", "font-color", "font-emphasize", "font-emphasize-position", "font-emphasize-style", "font-family", "font-size", "font-style", "font-variant", "font-weight", "for", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "frame", "frameborder", "frontuid", "headers", "height", "hidden", "high", "horiz-align", "href", "hreflang", "hspace", "http-equiv", "icon", "id", "importance", "inputmode", "integrity", "intrinsicsize", "ismap", "itemprop", "keytype", "kind", "label", "lang", "language", "layout-flow", "layout-grid", "layout-grid-char", "layout-grid-line", "layout-grid-mode", "layout-grid-type", "left", "letter-spacing", "line-break", "line-height", "link", "list", "list-image-1", "list-image-2", "list-image-3", "list-style", "list-style-image", "list-style-position", "list-style-type", "loading", "longdesc", "loop", "low", "manifest", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marginheight", "marginwidth", "max", "maxlength", "media", "method", "min", "minlength", "mso-ansi-font-size", "mso-ansi-font-style", "mso-ansi-font-weight", "mso-ansi-language", "mso-ascii-font-family", "mso-background", "mso-background-source", "mso-baseline-position", "mso-bidi-flag", "mso-bidi-font-family", "mso-bidi-font-size", "mso-bidi-font-style", "mso-bidi-font-weight", "mso-bidi-language", "mso-bookmark", "mso-border-alt", "mso-border-between", "mso-border-between-color", "mso-border-between-style", "mso-border-between-width", "mso-border-bottom-alt", "mso-border-bottom-color-alt", "mso-border-bottom-source", "mso-border-bottom-style-alt", "mso-border-bottom-width-alt", "mso-border-color-alt", "mso-border-effect", "mso-border-left-alt", "mso-border-left-color-alt", "mso-border-left-source", "mso-border-left-style-alt", "mso-border-left-width-alt", "mso-border-right-alt", "mso-border-right-color-alt", "mso-border-right-source", "mso-border-right-style-alt", "mso-border-right-width-alt", "mso-border-shadow", "mso-border-source", "mso-border-style-alt", "mso-border-top-alt", "mso-border-top-color-alt", "mso-border-top-source", "mso-border-top-style-alt", "mso-border-top-width-alt", "mso-border-width-alt", "mso-break-type", "mso-build", "mso-build-after-action", "mso-build-after-color", "mso-build-auto-secs", "mso-build-avi", "mso-build-dual-id", "mso-build-order", "mso-build-sound-name", "mso-bullet-image", "mso-cell-special", "mso-cellspacing", "mso-char-indent", "mso-char-indent-count", "mso-char-indent-size", "mso-char-type", "mso-char-wrap", "mso-color-alt", "mso-color-index", "mso-color-source", "mso-column-break-before", "mso-column-separator", "mso-columns", "mso-comment-author", "mso-comment-continuation", "mso-comment-id", "mso-comment-reference", "mso-data-placement", "mso-default-height", "mso-default-width", "mso-diagonal-down", "mso-diagonal-down-color", "mso-diagonal-down-source", "mso-diagonal-down-style", "mso-diagonal-down-width", "mso-diagonal-up", "mso-diagonal-up-color", "mso-diagonal-up-source", "mso-diagonal-up-style", "mso-diagonal-up-width", "mso-displayed-decimal-separator", "mso-displayed-thousand-separator", "mso-element", "mso-element-anchor-horizontal", "mso-element-anchor-lock", "mso-element-anchor-vertical", "mso-element-frame-height", "mso-element-frame-hspace", "mso-element-frame-vspace", "mso-element-frame-width", "mso-element-left", "mso-element-linespan", "mso-element-top", "mso-element-wrap", "mso-endnote-continuation-notice", "mso-endnote-continuation-notice-id", "mso-endnote-continuation-notice-src", "mso-endnote-continuation-separator", "mso-endnote-continuation-separator-id", "mso-endnote-continuation-separator-src", "mso-endnote-display", "mso-endnote-id", "mso-endnote-numbering", "mso-endnote-numbering-restart", "mso-endnote-numbering-start", "mso-endnote-numbering-style", "mso-endnote-position", "mso-endnote-separator", "mso-endnote-separator-id", "mso-endnote-separator-src", "mso-even-footer", "mso-even-footer-id", "mso-even-footer-src", "mso-even-header", "mso-even-header-id", "mso-even-header-src", "mso-facing-pages", "mso-fareast-font-family", "mso-fareast-hint", "mso-fareast-language", "mso-field-change", "mso-field-change-author", "mso-field-change-time", "mso-field-change-value", "mso-field-code", "mso-field-lock", "mso-fills-color", "mso-first-footer", "mso-first-footer-id", "mso-first-footer-src", "mso-first-header", "mso-first-header-id", "mso-first-header-src", "mso-font-alt", "mso-font-charset", "mso-font-format", "mso-font-info", "mso-font-info-charset", "mso-font-info-type", "mso-font-kerning", "mso-font-pitch", "mso-font-signature", "mso-font-signature-csb-one", "mso-font-signature-csb-two", "mso-font-signature-usb-four", "mso-font-signature-usb-one", "mso-font-signature-usb-three", "mso-font-signature-usb-two", "mso-font-src", "mso-font-width", "mso-footer", "mso-footer-data", "mso-footer-id", "mso-footer-margin", "mso-footer-src", "mso-footnote-continuation-notice", "mso-footnote-continuation-notice-id", "mso-footnote-continuation-notice-src", "mso-footnote-continuation-separator", "mso-footnote-continuation-separator-id", "mso-footnote-continuation-separator-src", "mso-footnote-id", "mso-footnote-numbering", "mso-footnote-numbering-restart", "mso-footnote-numbering-start", "mso-footnote-numbering-style", "mso-footnote-position", "mso-footnote-separator", "mso-footnote-separator-id", "mso-footnote-separator-src", "mso-foreground", "mso-forms-protection", "mso-generic-font-family", "mso-grid-bottom", "mso-grid-bottom-count", "mso-grid-left", "mso-grid-left-count", "mso-grid-right", "mso-grid-right-count", "mso-grid-top", "mso-grid-top-count", "mso-gutter-direction", "mso-gutter-margin", "mso-gutter-position", "mso-hansi-font-family", "mso-header", "mso-header-data", "mso-header-id", "mso-header-margin", "mso-header-src", "mso-height-alt", "mso-height-rule", "mso-height-source", "mso-hide", "mso-highlight", "mso-horizontal-page-align", "mso-hyphenate", "mso-ignore", "mso-kinsoku-overflow", "mso-layout-grid-align", "mso-layout-grid-char-alt", "mso-layout-grid-origin", "mso-level-inherit", "mso-level-legacy", "mso-level-legacy-indent", "mso-level-legacy-space", "mso-level-legal-format", "mso-level-number-format", "mso-level-number-position", "mso-level-numbering", "mso-level-reset-level", "mso-level-start-at", "mso-level-style-link", "mso-level-suffix", "mso-level-tab-stop", "mso-level-text", "mso-line-break-override", "mso-line-grid", "mso-line-height-alt", "mso-line-height-rule", "mso-line-numbers-count-by", "mso-line-numbers-distance", "mso-line-numbers-restart", "mso-line-numbers-start", "mso-line-spacing", "mso-linked-frame", "mso-list", "mso-list-change", "mso-list-change-author", "mso-list-change-time", "mso-list-change-values", "mso-list-id", "mso-list-ins", "mso-list-ins-author", "mso-list-ins-time", "mso-list-name", "mso-list-template-ids", "mso-list-type", "mso-margin-bottom-alt", "mso-margin-left-alt", "mso-margin-top-alt", "mso-mirror-margins", "mso-negative-indent-tab", "mso-number-format", "mso-outline-level", "mso-outline-parent", "mso-outline-parent-col", "mso-outline-parent-row", "mso-outline-parent-visibility", "mso-outline-style", "mso-padding-alt", "mso-padding-between", "mso-padding-bottom-alt", "mso-padding-left-alt", "mso-padding-right-alt", "mso-padding-top-alt", "mso-page-border-aligned", "mso-page-border-art", "mso-page-border-bottom-art", "mso-page-border-display", "mso-page-border-left-art", "mso-page-border-offset-from", "mso-page-border-right-art", "mso-page-border-surround-footer", "mso-page-border-surround-header", "mso-page-border-top-art", "mso-page-border-z-order", "mso-page-numbers", "mso-page-numbers-chapter-separator", "mso-page-numbers-chapter-style", "mso-page-numbers-start", "mso-page-numbers-style", "mso-page-orientation", "mso-page-scale", "mso-pagination", "mso-panose-arm-style", "mso-panose-contrast", "mso-panose-family-type", "mso-panose-letterform", "mso-panose-midline", "mso-panose-proportion", "mso-panose-serif-style", "mso-panose-stroke-variation", "mso-panose-weight", "mso-panose-x-height", "mso-paper-source", "mso-paper-source-first-page", "mso-paper-source-other-pages", "mso-pattern", "mso-pattern-color", "mso-pattern-style", "mso-print-area", "mso-print-color", "mso-print-gridlines", "mso-print-headings", "mso-print-resolution", "mso-print-sheet-order", "mso-print-title-column", "mso-print-title-row", "mso-prop-change", "mso-prop-change-author", "mso-prop-change-time", "mso-protection", "mso-rotate", "mso-row-margin-left", "mso-row-margin-right", "mso-ruby-merge", "mso-ruby-visibility", "mso-scheme-fill-color", "mso-scheme-shadow-color", "mso-shading", "mso-shadow-color", "mso-space-above", "mso-space-below", "mso-spacerun", "mso-special-character", "mso-special-format", "mso-style-id", "mso-style-name", "mso-style-next", "mso-style-parent", "mso-style-type", "mso-style-update", "mso-subdocument", "mso-symbol-font-family", "mso-tab-count", "mso-table-anchor-horizontal", "mso-table-anchor-vertical", "mso-table-bspace", "mso-table-del-author", "mso-table-del-time", "mso-table-deleted", "mso-table-dir", "mso-table-ins-author", "mso-table-ins-time", "mso-table-inserted", "mso-table-layout-alt", "mso-table-left", "mso-table-lspace", "mso-table-overlap", "mso-table-prop-author", "mso-table-prop-change", "mso-table-prop-time", "mso-table-rspace", "mso-table-top", "mso-table-tspace", "mso-table-wrap", "mso-text-animation", "mso-text-combine-brackets", "mso-text-combine-id", "mso-text-control", "mso-text-fit-id", "mso-text-indent-alt", "mso-text-orientation", "mso-text-raise", "mso-title-page", "mso-tny-compress", "mso-unsynced", "mso-vertical-align-alt", "mso-vertical-align-special", "mso-vertical-page-align", "mso-width-alt", "mso-width-source", "mso-word-wrap", "mso-xlrowspan", "mso-zero-height", "multiple", "muted", "name", "nav-banner-image", "navbutton_background_color", "navbutton_home_hovered", "navbutton_home_normal", "navbutton_home_pushed", "navbutton_horiz_hovered", "navbutton_horiz_normal", "navbutton_horiz_pushed", "navbutton_next_hovered", "navbutton_next_normal", "navbutton_next_pushed", "navbutton_prev_hovered", "navbutton_prev_normal", "navbutton_prev_pushed", "navbutton_up_hovered", "navbutton_up_normal", "navbutton_up_pushed", "navbutton_vert_hovered", "navbutton_vert_normal", "navbutton_vert_pushed", "nohref", "noresize", "noshade", "novalidate", "nowrap", "object", "onblur", "onchange", "onclick", "ondblclick", "onfocus", "onkeydown", "onkeypress", "onkeyup", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onreset", "onselect", "onsubmit", "onunload", "open", "optimum", "overflow", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "panose-1", "pattern", "ping", "placeholder", "position", "poster", "preload", "profile", "prompt", "punctuation-trim", "punctuation-wrap", "radiogroup", "readonly", "referrerpolicy", "rel", "required", "rev", "reversed", "right", "row-span", "rows", "rowspan", "ruby-align", "ruby-overhang", "ruby-position", "rules", "sandbox", "scheme", "scope", "scoped", "scrolling", "selected", "separator-image", "shape", "size", "sizes", "slot", "span", "spellcheck", "src", "srcdoc", "srclang", "srcset", "standby", "start", "step", "style", "summary", "tab-interval", "tab-stops", "tabindex", "table-border-color-dark", "table-border-color-light", "table-layout", "target", "text", "text-align", "text-autospace", "text-combine", "text-decoration", "text-effect", "text-fit", "text-indent", "text-justify", "text-justify-trim", "text-kashida", "text-line-through", "text-shadow", "text-transform", "text-underline", "text-underline-color", "text-underline-style", "title", "top", "top-bar-button", "translate", "type", "unicode-bidi", "urlId", "usemap", "valign", "value", "valuetype", "version", "vert-align", "vertical-align", "visibility", "vlink", "vnd.ms-excel.numberformat", "vspace", "white-space", "width", "word-break", "word-spacing", "wrap", "xmlns", "z-index"]);

/**
 * is-char-suitable-for-html-attr-name
 * Is given character suitable to be in an HTML attribute's name?
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-char-suitable-for-html-attr-name/
 */
// Follows the spec:
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
function isAttrNameChar(char) {
  return typeof char === "string" && ( //
  // lowercase letters, indexes 97 - 122:
  char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123 || // uppercase letters, indexes 65 - 90
  char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || // digits 0 - 9, indexes 48 - 57
  char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58 || char === ":" || char === "-");
}

/**
 * is-html-attribute-closing
 * Is a character on a given index a closing of an HTML attribute?
 * Version: 2.1.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-html-attribute-closing/
 */

function makeTheQuoteOpposite(quoteChar) {
  return quoteChar === "'" ? "\"" : "'";
}

function ensureXIsNotPresentBeforeOneOfY(str, startingIdx, x, y) {
  if (y === void 0) {
    y = [];
  }

  var _loop = function _loop(i, len) {
    if (y.some(function (oneOfStr) {
      return str.startsWith(oneOfStr, i);
    })) {
      // it's escape clause, bracket or whatever was reached and yet,
      // "x" hasn't been encountered yet
      return {
        v: true
      };
    }

    if (str[i] === x) {
      // if "x" was found, that's it - falsey result
      return {
        v: false
      };
    }
  };

  for (var i = startingIdx, len = str.length; i < len; i++) {
    var _ret = _loop(i);

    if (typeof _ret === "object") return _ret.v;
  } // default result


  return true;
} // Tells, if substring x goes before substring y on the right
// side of "str", starting at index "startingIdx".
// Used to troubleshoot dirty broken code.


function xBeforeYOnTheRight(str, startingIdx, x, y) {
  for (var i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      // if x was first, Bob's your uncle, that's truthy result
      return true;
    }

    if (str.startsWith(y, i)) {
      // since we're in this clause, x failed, so if y matched,
      // this means y precedes x
      return false;
    }
  } // default result


  return false;
} // Tells, is this a clean plausible attribute starting at given index
// <img alt="so-called "artists"class='yo'/>
//                              ^
//                            start


function plausibleAttrStartsAtX(str, start) {
  if (!isAttrNameChar(str[start]) || !start) {
    return false;
  } // const regex = /^[a-zA-Z0-9:-]*[=]?((?:'[^']*')|(?:"[^"]*"))/;


  var regex = /^[a-zA-Z0-9:-]*(\s*[=]?\s*((?:'[^']*')|(?:"[^"]*")))|( [^/>'"=]*['"])/;
  return regex.test(str.slice(start));
} // difference is equal is required


function guaranteedAttrStartsAtX(str, start) {
  if (!start || !isAttrNameChar(str[start])) {
    return false;
  } // either quotes match or does not match but tag closing follows
  // const regex = /^[a-zA-Z0-9:-]*[=]?(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/;


  var regex = /^[a-zA-Z0-9:-]*=(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/;
  return regex.test(str.slice(start));
}

function findAttrNameCharsChunkOnTheLeft(str, i) {
  if (!isAttrNameChar(str[left(str, i)])) {
    return;
  }

  for (var y = i; y--;) {
    if (str[y].trim().length && !isAttrNameChar(str[y])) {
      return str.slice(y + 1, i);
    }
  }
}

function isAttrClosing(str, idxOfAttrOpening, isThisClosingIdx) {
  if (typeof str !== "string" || !str.trim() || !Number.isInteger(idxOfAttrOpening) || !Number.isInteger(isThisClosingIdx) || !str[idxOfAttrOpening] || !str[isThisClosingIdx] || idxOfAttrOpening >= isThisClosingIdx) {
    return false;
  }

  var openingQuote = "'\"".includes(str[idxOfAttrOpening]) ? str[idxOfAttrOpening] : null;
  var oppositeToOpeningQuote = null;

  if (openingQuote) {
    oppositeToOpeningQuote = makeTheQuoteOpposite(openingQuote);
  }

  var chunkStartsAt;
  var quotesCount = new Map().set("'", 0).set("\"", 0).set("matchedPairs", 0);
  var lastQuoteAt = null;
  var totalQuotesCount = 0;
  var lastQuoteWasMatched = false;
  var lastMatchedQuotesPairsStartIsAt;
  var lastMatchedQuotesPairsEndIsAt; // when suspected attribute name chunks end, we wipe them, but here
  // we store the last extracted chunk - then later, for example, when we
  // traverse further and meet opening quote (even with equal missing),
  // we can evaluate that chunk, was it a known attribute name (idea being,
  // known attribute name followed by quote is probably legit attribute starting)

  var lastCapturedChunk;
  var secondLastCapturedChunk; // this boolean flag signifies, was the last chunk captured after passing
  // "isThisClosingIdx":
  // idea being, if you pass suspected quotes, then encounter new-ones and
  // in-between does not resemble an attribute name, it's falsey result:
  // <img alt="so-called "artists"!' class='yo'/>
  //          ^                  ^
  //        start             suspected
  //
  // that exclamation mark above doesn't resemble an attribute name,
  // so single quote that follows it is not a starting of its value

  var lastChunkWasCapturedAfterSuspectedClosing = false; // does what it says on the tin - flips on the first instance

  var closingBracketMet = false;
  var openingBracketMet = false; // let's traverse from opening to the end of the string, then in happy
  // path scenarios, let's exit way earlier, upon closing quote

  for (var i = idxOfAttrOpening, len = str.length; i < len; i++) {
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                                THE TOP
    //                                ███████
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // Logging:
    // -------------------------------------------------------------------------
    if ( // Imagine we're here:
    // <z bbb"c" ddd'e>
    //       ^      ^
    //   start     suspected closing
    //
    // this single quote at 13 is preceded by fully matched pair of quotes
    // there's also attribute-name-like chunk preceding in front.
    // Let's catch such case.
    //
    // 1. we're on a quote
    "'\"".includes(str[i]) && // 2. we ensure that a pair of quotes was catched so far
    lastQuoteWasMatched && // 3. lastMatchedQuotesPairsStartIsAt is our known opening
    lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && // 4. lastMatchedQuotesPairsEndIsAt is the last matched pair's closing:
    // <z bbb"c" ddd'e>
    //         ^
    //        this if to reuse the example..
    //
    lastMatchedQuotesPairsEndIsAt !== undefined && lastMatchedQuotesPairsEndIsAt < i && // rule must not trigger before the suspected quote index
    i >= isThisClosingIdx) {
      // ███████████████████████████████████████ E1
      //
      // consider WHERE WE ARE AT THE MOMENT in relation to
      // the INDEX THAT'S QUESTIONED FOR BEING A CLOSING-ONE
      // FALSEY result:
      // <z bbb"c" ddd'e'>.<z fff"g">
      //       ^      ^
      //     start   suspected
      //
      // <z bbb"c" ddd'e'>.<z fff"g">
      //              ^
      //            we're here
      // TRUTHY result:
      // <img class="so-called "alt"!' border='10'/>
      //            ^          ^
      //          start      suspected
      //
      // where we're at:
      // <img class="so-called "alt"!' border='10'/>
      //                           ^
      //
      var E1 = i !== isThisClosingIdx || guaranteedAttrStartsAtX(str, right(str, isThisClosingIdx)) || "/>".includes(str[right(str, i)]); // ███████████████████████████████████████ E2
      //
      //
      // ensure it's not a triplet of quotes:
      // <img alt="so-called "artists"!' class='yo'/>
      //          ^          ^       ^
      //       start      suspected  |
      //                             current index
      //

      var E2 = !(i > isThisClosingIdx && str[idxOfAttrOpening] === str[isThisClosingIdx] && str[idxOfAttrOpening] === str[i] && // rule out cases where plausible attribute starts:
      // <img class="so-called "alt"!' border='10'/>
      //            ^          ^   ^
      //        start          |    \
      //           suspected end    currently on
      plausibleAttrStartsAtX(str, i + 1)); // ███████████████████████████████████████ E3

      var E31 = // or a proper recognised attribute follows:
      // <img alt="so-called "artists"class='yo'/>
      //          ^                  ^
      //       start              suspected and currently on
      //
      // we're on a suspected quote
      i === isThisClosingIdx && // plus one because we're on a quote
      plausibleAttrStartsAtX(str, isThisClosingIdx + 1);
      var E32 = // or the last chunk is a known attribute name:
      // <img class="so-called "alt"!' border='10'/>
      //            ^          ^
      //         start      suspected/we're currently on
      //
      chunkStartsAt && chunkStartsAt < i && allHtmlAttribs.has(str.slice(chunkStartsAt, i).trim()); // imagine:

      if (chunkStartsAt) {
        str.slice(chunkStartsAt, i).trim();
      }

      var E33 = chunkStartsAt && chunkStartsAt < i && str[chunkStartsAt - 1] && !str[chunkStartsAt - 1].trim() && // and whole chunk is a plausible attribute name
      Array.from(str.slice(chunkStartsAt, i).trim()).every(function (char) {
        return isAttrNameChar(char);
      }) && // known opening and suspected closing are both singles or doubles
      str[idxOfAttrOpening] === str[isThisClosingIdx] && !"/>".includes(str[right(str, i)]) && ensureXIsNotPresentBeforeOneOfY(str, i + 1, "=", ["'", "\""]); // anti-rule - it's fine if we're on suspected ending and to the left
      // it's not an attribute start
      // <img alt='Deal is your's!"/>
      //          ^               ^
      //       start            suspected/current
      // extract attr name characters chunk on the left, "s" in the case below
      // <img alt='Deal is your's"/>
      //                         ^
      //                       start

      var attrNameCharsChunkOnTheLeft = void 0;

      if (i === isThisClosingIdx) {
        attrNameCharsChunkOnTheLeft = findAttrNameCharsChunkOnTheLeft(str, i);
      }

      var E34 = // we're on suspected
      i === isThisClosingIdx && ( // it's not a character suitable for attr name,
      !isAttrNameChar(str[left(str, i)]) || // or it is, but whatever we extracted is not recognised attr name
      attrNameCharsChunkOnTheLeft && !allHtmlAttribs.has(attrNameCharsChunkOnTheLeft)) && // rule out equal
      str[left(str, i)] !== "="; // ███████████████████████████████████████ E4

      var E41 = // either it's a tag ending and we're at the suspected quote
      "/>".includes(str[right(str, i)]) && i === isThisClosingIdx;
      var E42 = // or next character is suitable for a tag name:
      isAttrNameChar(str[right(str, i)]);
      var E43 = // or in case of:
      // <img class="so-called "alt"!' border='10'/>
      //            ^          ^
      //          start      suspected
      //
      // where we're at:
      // <img class="so-called "alt"!' border='10'/>
      //                           ^
      //                          here
      lastQuoteWasMatched && i !== isThisClosingIdx;
      var E5 = // it's not a double-wrapped attribute value:
      //
      // <div style="float:"left"">z</div>
      //            ^      ^
      //          start   suspected
      //
      // we're at:
      // <div style="float:"left"">z</div>
      //                        ^
      //                      here
      !( // rule must not trigger before the suspected quote index
      i >= isThisClosingIdx && // there's colon to the left of a suspected quote
      str[left(str, isThisClosingIdx)] === ":");
      return !!(E1 && E2 && (E31 || E32 || E33 || E34) && (E41 || E42 || E43) && E5);
    } // catch quotes


    if ("'\"".includes(str[i])) {
      // catch the non-overlapping matched pairs of quotes
      // for example that's three pairs in total below:
      // <z bbb"c" ddd'e'>.<z fff"g">
      // Insurace against the Killer Triplet - a quoted quote
      if (str[i] === "'" && str[i - 1] === "\"" && str[i + 1] === "\"" || str[i] === "\"" && str[i - 1] === "'" && str[i + 1] === "'") {
        continue;
      }

      if (lastQuoteAt && str[i] === str[lastQuoteAt]) {
        quotesCount.set("matchedPairs", quotesCount.get("matchedPairs") + 1);
        lastMatchedQuotesPairsStartIsAt = lastQuoteAt;
        lastMatchedQuotesPairsEndIsAt = i;
        lastQuoteAt = null;
        lastQuoteWasMatched = true;
      } else {
        lastQuoteWasMatched = false;
      } // bump total counts:


      quotesCount.set(str[i], quotesCount.get(str[i]) + 1);
      totalQuotesCount = quotesCount.get("\"") + quotesCount.get("'"); // lastQuoteAt = i;
      // console.log(
      //   `325 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
      //     lastQuoteAt,
      //     null,
      //     4
      //   )}`
      // );
    } // catch closing brackets


    if (str[i] === ">" && !closingBracketMet) {
      closingBracketMet = true; // if all pairs of quotes were met, that's a good indicator, imagine
      // <z bbb"c" ddd'e'>
      //                 ^

      if (totalQuotesCount && quotesCount.get("matchedPairs") && totalQuotesCount === quotesCount.get("matchedPairs") * 2 && // we haven't reached the suspected quote and tag's already ending
      i < isThisClosingIdx) {
        return false;
      }
    } // catch opening brackets


    if (str[i] === "<" && // consider ERB templating tags, <%= zzz %>
    str[right(str, i)] !== "%" && closingBracketMet && !openingBracketMet) {
      openingBracketMet = true; // if it's past the "isThisClosingIdx", that's very falsey
      // if (i > isThisClosingIdx) {

      return false; // }
    } //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                               MIDDLE
    //                               ██████
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // before and after the suspected index, all the way while traversing the
    // string from known, starting quotes (or in their absence, starting of
    // the attribute's value, the second input argument "idxOfAttrOpening")
    // all the way until the end, we catch the first character past the
    // questioned attribute closing.
    // imagine
    // <img alt="so-called "artists"!' class='yo'/>
    //          ^                  ^
    //        opening          suspected closing


    if (str[i].trim() && !chunkStartsAt) {
      // <img alt="so-called "artists"!' class='yo'/>
      //                              ^
      //                         we land here, on excl. mark
      if (isAttrNameChar(str[i])) {
        chunkStartsAt = i;
      }
    } else if (chunkStartsAt && !isAttrNameChar(str[i])) {
      // ending of an attr name chunk
      secondLastCapturedChunk = lastCapturedChunk;
      lastCapturedChunk = str.slice(chunkStartsAt, i);
      lastChunkWasCapturedAfterSuspectedClosing = chunkStartsAt >= isThisClosingIdx; // console.log(
      //   `434 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`}`
      // );
      // chunkStartsAt = null;
      // imagine:
      // <z bbb"c' href"e>
      //       ^ ^
      //   start suspected ending
      //
      // we're here:
      // <z bbb"c' href"e>
      //               ^

      if ("'\"".includes(str[i]) && quotesCount.get("matchedPairs") === 0 && totalQuotesCount === 3 && str[idxOfAttrOpening] === str[i] && allHtmlAttribs.has(lastCapturedChunk) && !"'\"".includes(str[right(str, i)])) {
        var A1 = i > isThisClosingIdx; //
        // ensure that all continuous chunks since the last quote are
        // recognised attribute names

        var A21 = !lastQuoteAt;
        var A22 = lastQuoteAt + 1 >= i;
        var A23 = str.slice(lastQuoteAt + 1, i).trim().split(/\s+/).every(function (chunk) {
          return allHtmlAttribs.has(chunk);
        }); // <div style="float:'left"">z</div>
        //            ^           ^
        //          start      we're here

        var A3 = !lastCapturedChunk || !secondLastCapturedChunk || !secondLastCapturedChunk.endsWith(":");
        var B1 = i === isThisClosingIdx;
        var B21 = totalQuotesCount < 3;
        var B22 = !!lastQuoteWasMatched;
        var B23 = !lastQuoteAt;
        var B24 = lastQuoteAt + 1 >= i;
        var B25 = !str.slice(lastQuoteAt + 1, i).trim().split(/\s+/).every(function (chunk) {
          return allHtmlAttribs.has(chunk);
        });
        return A1 && (A21 || A22 || A23) && A3 || B1 && (B21 || B22 || B23 || B24 || B25);
      }

      if ( // this is a recognised attribute
      lastCapturedChunk && allHtmlAttribs.has(lastCapturedChunk) && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && lastMatchedQuotesPairsEndIsAt === isThisClosingIdx) {
        return true;
      }
    } // catching new attributes that follow after suspected quote.
    // Imagine
    // <a class "c" id 'e' href "www">
    //                 ^            ^
    //        known start at 16     suspected ending at 29


    if ( // if we're currently on some quote:
    "'\"".includes(str[i]) && ( // and if either quote count is an even number (the "!" checking is it zero)
    !(quotesCount.get("\"") % 2) || !(quotesCount.get("'") % 2)) && // and sum of quotes is odd, for example,
    // <a class "c" id 'e' href "www">
    //                          ^
    //                   reusing example above, let's say we're here
    //
    // in this situation, both single quotes around "e" add up to 2, then
    // current opening quote of "www" adds up to 3.
    //
    // In human language, this means, we check, was there a complete
    // set of quotes recorded by now, plus is current chunk a known
    // attribute name - this allows us to catch an attribute with equal missing
    (quotesCount.get("\"") + quotesCount.get("'")) % 2 && ( //
    // last chunk is not falsey (thus a string):
    lastCapturedChunk && // and finally, perf resource-taxing evaluation, is it recognised:
    allHtmlAttribs.has(lastCapturedChunk) || // imagine
    // <z bbb"c" ddd'e'>
    //         ^
    //        a suspected closing
    //
    // alternatively, check the count of remaining quotes, ensure that
    // leading up to closing bracket, everything's neat (not overlapping
    // at least and opened and closed)
    // this catch is for the following attributes, for example,
    // <z bbb"c" ddd'e'>
    //       ^      ^
    //     start   suspected ending
    i > isThisClosingIdx + 1 && allHtmlAttribs.has(str.slice(isThisClosingIdx + 1, i).trim())) && //
    // the same quote doesn't follow on the right,
    // think <div style="float:"left"">z</div>
    //                  ^           ^
    //               start    suspected closing
    !(str[i + 1] === str[i] && str[i] === str[idxOfAttrOpening]) && //
    //
    // and it's not this case:
    //
    // <div style="float:'left'">z</div>
    //            ^      ^
    //         start   suspected
    //
    // we're here:
    // <div style="float:'left'">z</div>
    //                        ^
    //                       here
    !( // we're part the suspected closing, on another closing
    i > isThisClosingIdx + 1 && // colon is to the left of suspected
    str[left(str, isThisClosingIdx)] === ":") && //
    // the suspected quote is the fourth,
    // <div style="float:'left'">z</div>
    //            ^            ^
    //          start        suspected
    //
    // we want to exclude the quote on the left:
    // <div style="float:'left'">z</div>
    //                        ^
    //                       this
    //
    // in which case, we'd have:
    // lastCapturedChunk = "left"
    // secondLastCapturedChunk = "float:"
    !(lastCapturedChunk && secondLastCapturedChunk && secondLastCapturedChunk.trim().endsWith(":"))) {
      // rules:
      // before suspected index this pattern is falsey, after - truthy
      var R0 = i > isThisClosingIdx; //

      var R1 = !!openingQuote;
      var R2 = str[idxOfAttrOpening] !== str[isThisClosingIdx];
      var R3 = allHtmlAttribs.has(str.slice(idxOfAttrOpening + 1, isThisClosingIdx).trim()); // that quote we suspected as closing, is from an opening-closing
      // set on another attribute:

      var R4 = !xBeforeYOnTheRight(str, i + 1, str[isThisClosingIdx], makeTheQuoteOpposite(str[isThisClosingIdx])); // const R5 = plausibleAttrStartsAtX(str, start) // consider:
      // <z alt"href' www'/>
      //       ^    ^
      //    start   suspected ending
      // let's rule out the case where a whole (suspected) attribute's value is
      // a known attribute value, plus quotes mismatch plus that closing quote
      // is on the right, before the its opposite kind

      return R0 && !(R1 && R2 && R3 && R4);
    }

    if ( // imagine
    // <a href=www" class=e'>
    //         ^  ^
    //     start  suspected
    // if it's equal following attribute name
    (str[i] === "=" || // OR
    // it's whitespace
    !str[i].length && // and next non-whitespace character is "equal" character
    str[right(str, i)] === "=") && // last chunk is not falsey (thus a string)
    lastCapturedChunk && // and finally, perf resource-taxing evaluation, is it recognised:
    allHtmlAttribs.has(lastCapturedChunk)) {
      // definitely that's new attribute starting
      var W1 = i > isThisClosingIdx;
      var W2 = // insurance against:
      // <z alt"href' www' id=z"/>
      //       ^         ^
      //     start      suspected ending
      //
      // <z alt"href' www' id=z"/>
      //                       ^
      //                    we're here currently
      !(!( //
      // first, rule out healthy code scenarios,
      // <a href="zzz" target="_blank" style="color: black;">
      //         ^   ^       ^
      //        /    |        \
      //   start   suspected   we're here
      lastQuoteWasMatched && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && lastMatchedQuotesPairsEndIsAt === isThisClosingIdx || // or quotes can be mismatching, but last chunk's start should
      // match a confirmed attribute regex (with matching quotes and
      // equal present)
      guaranteedAttrStartsAtX(str, chunkStartsAt)) && //
      // continuing with catch clauses of the insurance case:
      lastQuoteWasMatched && lastMatchedQuotesPairsStartIsAt !== undefined && lastMatchedQuotesPairsStartIsAt <= isThisClosingIdx);
      return W1 && W2;
    } // when index "isThisClosingIdx" has been passed...


    if (i > isThisClosingIdx) {
      // if current quote matches the opening
      if (openingQuote && str[i] === openingQuote) {
        // we want to return false as default...
        // except if we're able to extract a clean recognised attribute name
        // in front of here and prove that it's actually a new attribute starting
        // here, then it's true
        // imagine
        // <img alt="somethin' fishy going on' class">z<a class="y">
        //          ^                        ^      ^
        //         start            suspected       we're here
        var Y1 = !!lastQuoteAt;
        var Y2 = lastQuoteAt === isThisClosingIdx; // ensure there's some content between suspected and "here":

        var Y3 = lastQuoteAt + 1 < i && str.slice(lastQuoteAt + 1, i).trim();
        var Y4 = str.slice(lastQuoteAt + 1, i).trim().split(/\s+/).every(function (chunk) {
          return allHtmlAttribs.has(chunk);
        });
        var Y5 = i >= isThisClosingIdx;
        var Y6 = !str[right(str, i)] || !"'\"".includes(str[right(str, i)]);
        return !!(Y1 && Y2 && Y3 && Y4 && Y5 && Y6);
      } // if we have passed the suspected closing quote
      // and we meet another quote of the same kind,
      // it's false result. Imagine code:
      // <img alt='so-called "artists"!" class='yo'/>
      //                     ^       ^
      //               questioned    |
      //                 index     we're here
      //                           so it's false


      if ( // if attribute starts with a quote
      openingQuote && // and we're suspecting a mismatching pair:
      str[isThisClosingIdx] === oppositeToOpeningQuote && // we're questioning, maybe current
      // suspected closing quote is of the
      // opposite kind (single-double, double-single)
      str[i] === oppositeToOpeningQuote) {
        return false;
      } // if the tag closing was met, that's fine, imagine:
      // <div class='c">.</div>
      //              ^
      //        we went past this suspected closing quote
      //        and reached the tag ending...


      if (str[i] === "/" || str[i] === ">" || str[i] === "<") {
        // happy path scenario
        var _R = // opening matches closing
        str[idxOfAttrOpening] === str[isThisClosingIdx] && // last captured quote was the suspected ("isThisClosingIdx")
        lastQuoteAt === isThisClosingIdx && // all is clean inside - there are no quotes of the ones used in
        // opening/closing (there can be opposite type quotes though)
        !str.slice(idxOfAttrOpening + 1, isThisClosingIdx).includes(str[idxOfAttrOpening]); // Not more than one pair of non-overlapping quotes should have been matched.


        var R11 = quotesCount.get("matchedPairs") < 2; // at least it's not a recognised attribute name on the left:

        var _attrNameCharsChunkOnTheLeft = findAttrNameCharsChunkOnTheLeft(str, i);

        var R12 = (!_attrNameCharsChunkOnTheLeft || !allHtmlAttribs.has(_attrNameCharsChunkOnTheLeft)) && ( // avoid cases where multiple pairs of mismatching quotes were matched
        // we're past suspected closing:
        !(i > isThisClosingIdx && // and there were some single quotes recorded so far
        quotesCount.get("'") && // and doubles too
        quotesCount.get("\"") && // and there were few quote pairs matched
        quotesCount.get("matchedPairs") > 1) || // but add escape latch for when tag closing follows:
        // <img alt='so-called "artists"!"/>
        //          ^                    ^^
        //        start         suspected  currently we're on slash
        "/>".includes(str[right(str, i)]));

        var _R2 = totalQuotesCount < 3 || // there's only two quotes mismatching:
        quotesCount.get("\"") + quotesCount.get("'") - quotesCount.get("matchedPairs") * 2 !== 2;

        var R31 = !lastQuoteWasMatched || lastQuoteWasMatched && !(lastMatchedQuotesPairsStartIsAt !== undefined && Array.from(str.slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt).trim()).every(function (char) {
          return isAttrNameChar(char);
        }) && allHtmlAttribs.has(str.slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt).trim()));
        var R32 = !right(str, i) && totalQuotesCount % 2 === 0;
        var R33 = str[idxOfAttrOpening - 2] && str[idxOfAttrOpening - 1] === "=" && isAttrNameChar(str[idxOfAttrOpening - 2]);
        var R34 = !ensureXIsNotPresentBeforeOneOfY(str, i + 1, "<", ["='", "=\""]);
        return (// happy path - known opening matched suspected closing and
          // that suspected closing was the last captured quote ("lastQuoteAt")
          //
          _R || // The matched pair count total has not reach or exceed two
          //
          // because we're talking about fully matched opening-closing quote
          // pairs.
          //
          // Let me remind you the question algorithm is answering:
          // Is quote at index y closing quote, considering opening is at x?
          //
          // Now, imagine we went past index y, reached index z, and up to
          // this point two sets of quotes were caught, as in:
          // <z bbb"c" ddd"e">
          //       ^        ^
          //     start     we're here, quote in question
          //
          // above, that's falsey result, it can't be fourth caught quote!
          (R11 || R12) && // besides that,
          // We need to account for mismatching quote pair. If a pair is
          // mismatching, "matchedPairs" might not get bumped to two thus
          // leading to a mistake.
          // When pair is mismatching, we can tell it's so because total count
          // minus matched count times two would be equal to two - two
          // quotes left unmatched.
          // Mind you, it's not more because algorithm would exit by the time
          // we would reach 4 let's say...
          // either there's not more than one pair:
          _R2 && ( // also, protection against cases like:
          // <z bbb"c" ddd'e>
          //       ^      ^
          //   start     suspected
          //
          // in case above, all the clauses up until now pass
          //
          // we need to check against "lastQuoteWasMatched" flag
          //
          //
          // or last pair was matched:
          R31 || // either this closing bracket is the last:
          R32 || // or char before starting is equal and char before that
          // satisfies attribute name requirements
          R33 || // or it seems like it's outside rather inside a tag:
          R34)
        );
      } // if the true attribute ending was met passing
      // past the suspected one, this means that
      // suspected one was a false guess. Correct ending
      // is at this index "i"


      if (str[i] === "=" && matchRight(str, i, ["'", "\""], {
        trimBeforeMatching: true,
        trimCharsBeforeMatching: ["="]
      })) {
        return true;
      }
    } else {
      // this clause is meant to catch the suspected quotes
      // which don't belong to the tag, it's where quotes
      // in question are way beyond the actual attribute's ending.
      // For example, consider
      // <div class="c' id="x'>.</div>
      //            ^        ^
      //            |        |
      //         known      suspected
      //         opening    closing
      //
      // That equal-quote after "id" would trigger the alarm,
      // that is the clause below..
      // BUT mind the false positive:
      // <img src="xyz" alt="="/>
      //                    ^ ^
      //                    | |
      //      known opening/  \suspected closing
      //
      // by the way we use right() to jump over whitespace
      // for example, this will also catch:
      // <img src="xyz" alt="=   "/>
      //
      var firstNonWhitespaceCharOnTheLeft = void 0;

      if (str[i - 1] && str[i - 1].trim() && str[i - 1] !== "=") {
        // happy path
        firstNonWhitespaceCharOnTheLeft = i - 1;
      } else {
        for (var y = i; y--;) {
          if (str[y].trim() && str[y] !== "=") {
            firstNonWhitespaceCharOnTheLeft = y;
            break;
          }
        }
      }

      if (str[i] === "=" && matchRight(str, i, ["'", "\""], {
        // ensure it's not tag ending on the right
        // before freaking out:
        cb: function cb(char) {
          return !"/>".includes(char);
        },
        trimBeforeMatching: true,
        trimCharsBeforeMatching: ["="]
      }) && // ensure it's a character suitable for attribute
      // name on the left of equal (if it's a real
      // attribute name its name characters must pass
      // the isAttrNameChar()...)
      isAttrNameChar(str[firstNonWhitespaceCharOnTheLeft]) && // ensure it's not
      // <img src="https://z.com/r.png?a=" />
      //                                ^
      //                              here
      //
      // in which case it's a false positive!!!
      !str.slice(idxOfAttrOpening + 1).startsWith("http") && !str.slice(idxOfAttrOpening + 1, i).includes("/") && !str.endsWith("src=", idxOfAttrOpening) && !str.endsWith("href=", idxOfAttrOpening)) {
        return false;
      }

      if (i === isThisClosingIdx && guaranteedAttrStartsAtX(str, i + 1)) {
        return true;
      } // also some insurance for crazier patterns like:
      // <z alt"href" www'/>
      //        ^   |    ^
      //    start   |    suspected
      //            |
      //          currently on
      //
      // catch this pattern where initial equal to the left of start is missing
      // and this pattern implies equals will be missing further


      if (i < isThisClosingIdx && "'\"".includes(str[i]) && lastCapturedChunk && str[left(str, idxOfAttrOpening)] && str[left(str, idxOfAttrOpening)] !== "=" && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && allHtmlAttribs.has(lastCapturedChunk)) {
        return false;
      } // catch
      // <div style="float:"left'">z</div>
      //            ^            ^
      //          start       we're here, and also it's suspected too
      //


      if (i === isThisClosingIdx && "'\"".includes(str[i]) && lastCapturedChunk && secondLastCapturedChunk && totalQuotesCount % 2 === 0 && secondLastCapturedChunk.endsWith(":")) {
        return true;
      }
    } //
    //
    //
    //
    //
    //
    //
    //
    //
    //                               BOTTOM
    //                               ██████
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // catch quotes again - these clauses are specifically at the bottom
    // because they're depdendent on "lastCapturedChunk" which is calculated
    // after quote catching at the top


    if ("'\"".includes(str[i]) && // if these quotes are after "isThisClosingIdx", a suspected closing
    i > isThisClosingIdx) {
      // if these quotes are after "isThisClosingIdx", if there
      // was no chunk recorded after it until now,
      // ("lastChunkWasCapturedAfterSuspectedClosing" flag)
      // or there was but it's not recognised, that's falsey result
      if ( // if there was no chunk recorded after it until now
      !lastChunkWasCapturedAfterSuspectedClosing || !lastCapturedChunk || // or there was but lastCapturedChunk is not recognised
      !allHtmlAttribs.has(lastCapturedChunk)) {
        return false;
      } // ELSE - it does match, so it seems legit


      return true;
    } // at the bottom, PART II of catch quotes


    if ("'\"".includes(str[i])) {
      lastQuoteAt = i;
    } // at the bottom, PART II of reset chunk


    if (chunkStartsAt && !isAttrNameChar(str[i])) {
      chunkStartsAt = null;
    } // logging
    // -----------------------------------------------------------------------------

  } // if this point was reached and loop didn't exit...
  // default is false


  return false;
}

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
var allHTMLTagsKnownToHumanity = new Set(["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"]); // contains all common templating language head/tail marker characters:

var espChars = "{}%-$_()*|#";
var veryEspChars = "{}|#";
var notVeryEspChars = "%()$_*#";
var leftyChars = "({";
var rightyChars = "})";
var espLumpBlacklist = [")|(", "|(", ")(", "()", "}{", "{}", "%)", "*)", "||", "--"];
var punctuationChars = ".,;!?";
var BACKTICK = "\x60";
var LEFTDOUBLEQUOTMARK = "\u201C";
var RIGHTDOUBLEQUOTMARK = "\u201D";

function isLatinLetter(char) {
  // we mean Latin letters A-Z, a-z
  return !!(char && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123));
} // Considering custom element name character requirements:
// https://html.spec.whatwg.org/multipage/custom-elements.html
// Example of Unicode character in a regex:
// \u0041
// "-" | "." | [0-9] | "_" | [a-z] | #xB7 | [#xC0-#xEFFFF]


function charSuitableForTagName(char) {
  return /[.\-_a-z0-9\u00B7\u00C0-\uFFFD]/i.test(char);
} // it flips all brackets backwards and puts characters in the opposite order


function flipEspTag(str) {
  var res = "";

  for (var i = 0, len = str.length; i < len; i++) {
    if (str[i] === "[") {
      res = "]" + res;
    } else if (str[i] === "]") {
      res = "[" + res;
    } else if (str[i] === "{") {
      res = "}" + res;
    } else if (str[i] === "}") {
      res = "{" + res;
    } else if (str[i] === "(") {
      res = ")" + res;
    } else if (str[i] === ")") {
      res = "(" + res;
    } else if (str[i] === "<") {
      res = ">" + res;
    } else if (str[i] === ">") {
      res = "<" + res;
    } else if (str[i] === LEFTDOUBLEQUOTMARK) {
      res = "" + RIGHTDOUBLEQUOTMARK + res;
    } else if (str[i] === RIGHTDOUBLEQUOTMARK) {
      res = "" + LEFTDOUBLEQUOTMARK + res;
    } else {
      res = "" + str[i] + res;
    }
  }

  return res;
}

function isTagNameRecognised(tagName) {
  return allHTMLTagsKnownToHumanity.has(tagName.toLowerCase()) || ["doctype", "cdata", "xml"].includes(tagName.toLowerCase());
} // Tells, if substring x goes before substring y on the right
// side of "str", starting at index "startingIdx".
// Used to troubleshoot dirty broken code.


function xBeforeYOnTheRight$1(str, startingIdx, x, y) {
  for (var i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      // if x was first, Bob's your uncle, that's truthy result
      return true;
    }

    if (str.startsWith(y, i)) {
      // since we're in this clause, x failed, so if y matched,
      // this means y precedes x
      return false;
    }
  } // default result


  return false;
}


function isObj$1(something) {
  return something && typeof something === "object" && !Array.isArray(something);
} // https://html.spec.whatwg.org/multipage/syntax.html#elements-2


var voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]; // https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Inline_text_semantics
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Image_and_multimedia

var inlineTags = new Set(["a", "abbr", "acronym", "audio", "b", "bdi", "bdo", "big", "br", "button", "canvas", "cite", "code", "data", "datalist", "del", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins", "kbd", "label", "map", "mark", "meter", "noscript", "object", "output", "picture", "progress", "q", "ruby", "s", "samp", "script", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "template", "textarea", "time", "u", "tt", "var", "video", "wbr"]); // Rules which might wrap the media queries, for example:
// @supports (display: grid) {...
// const atRulesWhichMightWrapStyles = ["media", "supports", "document"];

var charsThatEndCSSChunks = ["{", "}", ","];
var SOMEQUOTE = "'\"" + LEFTDOUBLEQUOTMARK + RIGHTDOUBLEQUOTMARK;
var attrNameRegexp = /[\w-]/;

// returns found object's index in "layers" array
function getLastEspLayerObjIdx(layers) {
  if (layers && layers.length) {
    // traverse layers backwards
    for (var z = layers.length; z--;) {
      if (layers[z].type === "esp") {
        return z;
      }
    }
  }

  return undefined;
}

function getWholeEspTagLumpOnTheRight(str, i, layers) {
  var wholeEspTagLumpOnTheRight = str[i];
  var len = str.length; // getLastEspLayerObj()

  var lastEspLayerObj = layers[getLastEspLayerObjIdx(layers)];

  for (var y = i + 1; y < len; y++) { // if righty character is on the left and now it's lefty,
    // we have a situation like:
    // {{ abc }}{% endif %}
    //        ^^^^
    //        lump
    //
    // {{ abc }}{% endif %}
    //         ^^
    //         ||
    //    lefty  righty
    //
    // we clice off where righty starts

    if (leftyChars.includes(str[y]) && rightyChars.includes(str[y - 1])) {
      break;
    }

    if ( // consider:
    // ${(y/4)?int}
    //   ^
    //   we're here - is this opening bracket part of heads?!?
    //
    // or JSP:
    // <%=(new java.util.Date()).toLocaleString()%>
    //    ^
    // if lump already is two chars long
    wholeEspTagLumpOnTheRight.length > 1 && ( // contains one of opening-polarity characters
    wholeEspTagLumpOnTheRight.includes("<") || wholeEspTagLumpOnTheRight.includes("{") || wholeEspTagLumpOnTheRight.includes("[") || wholeEspTagLumpOnTheRight.includes("(")) && // bail if it's a bracket
    str[y] === "(") {
      break;
    }

    if (espChars.includes(str[y]) || // in case it's XML tag-like templating tag, such as JSP,
    // we check, is it in the last guessed lump's character's list
    lastEspLayerObj && lastEspLayerObj.guessedClosingLump.includes(str[y]) || str[i] === "<" && str[y] === "/" || // accept closing bracket if it's RPL comment, tails of: <#-- z -->
    str[y] === ">" && wholeEspTagLumpOnTheRight === "--" && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-" || // we do exception for extra characters, such as JSP's
    // exclamation mark: <%! yo %>
    //                     ^
    // which is legit...
    //
    // at least one character must have been caught already
    !lastEspLayerObj && y > i && "!=@".includes(str[y])) {
      wholeEspTagLumpOnTheRight += str[y];
    } else {
      break;
    }
  } // if lump is tails+heads, report the length of tails only:
  // {%- a -%}{%- b -%}
  //        ^
  //      we're talking about this lump of tails and heads


  if (wholeEspTagLumpOnTheRight && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].guessedClosingLump && wholeEspTagLumpOnTheRight.length > layers[layers.length - 1].guessedClosingLump.length) {
    //
    // case I.
    //
    if (wholeEspTagLumpOnTheRight.endsWith(layers[layers.length - 1].openingLump)) {
      // no need to extract tails, heads "{%-" were confirmed in example:
      // {%- a -%}{%- b -%}
      //          ^
      //         here
      // return string, extracted ESP tails
      return wholeEspTagLumpOnTheRight.slice(0, wholeEspTagLumpOnTheRight.length - layers[layers.length - 1].openingLump.length);
    } // ELSE
    // imagine a case like:
    // {%- aa %}{% bb %}
    // opening heads were {%-, flipped were -%}. Now when we take lump %}{%
    // and match, the dash will be missing.
    // What we're going to do is we'll split the lump where last matched
    // continuous chunk ends (%} in example above) with condition that
    // at least one character from ESP-list follows, which is not part of
    // guessed closing lump.


    var uniqueCharsListFromGuessedClosingLumpArr = new Set(layers[layers.length - 1].guessedClosingLump);
    var found = 0;

    var _loop = function _loop(len2, _y) {
      if (!uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLumpOnTheRight[_y]) && found > 1) {
        return {
          v: wholeEspTagLumpOnTheRight.slice(0, _y)
        };
      }

      if (uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLumpOnTheRight[_y])) {
        found += 1;
        uniqueCharsListFromGuessedClosingLumpArr = new Set([].concat(uniqueCharsListFromGuessedClosingLumpArr).filter(function (el) {
          return el !== wholeEspTagLumpOnTheRight[_y];
        }));
      }
    };

    for (var _y = 0, len2 = wholeEspTagLumpOnTheRight.length; _y < len2; _y++) {
      var _ret = _loop(len2, _y);

      if (typeof _ret === "object") return _ret.v;
    }
  }
  return wholeEspTagLumpOnTheRight;
}

// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsHtmlComment(str, i, token, layers) {
  // console.log(
  //   `R1: ${!!matchRight(str, i, ["!--"], {
  //     maxMismatches: 1,
  //     firstMustMatch: true, // <--- FUZZY MATCH, BUT EXCL. MARK IS OBLIGATORY
  //     trimBeforeMatching: true
  //   }) ||
  //     matchRight(str, i, ["![endif]"], {
  //       i: true,
  //       maxMismatches: 2,
  //       trimBeforeMatching: true
  //     })}`
  // );
  // console.log(
  //   `R2: ${!matchRight(str, i, ["![cdata", "<"], {
  //     i: true,
  //     maxMismatches: 1,
  //     trimBeforeMatching: true
  //   })}`
  // );
  // console.log(`R3: ${!!(token.type !== "comment" || token.kind !== "not")}`);
  // console.log(
  //   `R3*: ${`\u001b[${33}m${`token.kind`}\u001b[${39}m`} = ${JSON.stringify(
  //     token.kind,
  //     null,
  //     4
  //   )}`
  // );
  return !!( // the opening is deliberately loose, with one dash missing, "!-" instead of "!--"
  str[i] === "<" && (matchRight(str, i, ["!--"], {
    maxMismatches: 1,
    firstMustMatch: true,
    trimBeforeMatching: true
  }) || matchRight(str, i, ["![endif]"], {
    i: true,
    maxMismatches: 2,
    trimBeforeMatching: true
  })) && !matchRight(str, i, ["![cdata", "<"], {
    i: true,
    maxMismatches: 1,
    trimBeforeMatching: true
  }) && (token.type !== "comment" || token.kind !== "not") || str[i] === "-" && matchRight(str, i, ["->"], {
    trimBeforeMatching: true
  }) && (token.type !== "comment" || !token.closing && token.kind !== "not") && !matchLeft(str, i, "<", {
    trimBeforeMatching: true,
    trimCharsBeforeMatching: ["-", "!"]
  }) && ( // insurance against ESP tag, RPL comments: <#-- z -->
  !Array.isArray(layers) || !layers.length || layers[layers.length - 1].type !== "esp" || !(layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-")));
}

// import { matchLeft, matchRight } from "string-match-left-right";
function startsCssComment(str, i, _token, _layers, withinStyle) {
  return (// cast to bool
    withinStyle && ( // match the / *
    str[i] === "/" && str[i + 1] === "*" || // match the * /
    str[i] === "*" && str[i + 1] === "/")
  );
}

// We record ESP tag head and tails as we traverse code because we need to know
// the arrangement of all pieces: start, end, nesting etc.
//
// Now, we keep records of each "layer" - new opening of some sorts: quotes,
// heads of ESP tags and so on.
//
// This function is a helper to check, does something match as a counterpart
// to the last/first layer.
//
// Quotes could be checked here but are not at the moment, here currently
// we deal with ESP tokens only
// RETURNS: undefined or integer, length of a matched ESP lump.
function matchLayerLast(wholeEspTagLump, layers, matchFirstInstead) {
  if (matchFirstInstead === void 0) {
    matchFirstInstead = false;
  }

  if (!layers.length) {
    return;
  }

  var whichLayerToMatch = matchFirstInstead ? layers[0] : layers[layers.length - 1]; // console.log(
  //   `023 matchLayer(): ${`\u001b[${33}m${`whichLayerToMatch`}\u001b[${39}m`} = ${JSON.stringify(
  //     whichLayerToMatch,
  //     null,
  //     4
  //   )}`
  // );

  if (whichLayerToMatch.type !== "esp") {
    // we aim to match ESP tag layers, so instantly it's falsey result
    // because layer we match against is not ESP tag layer
    // console.log(`033 matchLayer(): early return undefined`);
    return;
  }

  if ( // imagine case of Nunjucks: heads "{%" are normal but tails "-%}" (notice dash)
  wholeEspTagLump.includes(whichLayerToMatch.guessedClosingLump) || // match every character from the last "layers" complex-type entry must be
  // present in the extracted lump
  Array.from(wholeEspTagLump).every(function (char) {
    return whichLayerToMatch.guessedClosingLump.includes(char);
  }) || // consider ruby heads, <%# and tails -%>
  whichLayerToMatch.guessedClosingLump && // length is more than 2
  whichLayerToMatch.guessedClosingLump.length > 2 && // and last two characters match to what was guessed
  whichLayerToMatch.guessedClosingLump[whichLayerToMatch.guessedClosingLump.length - 1] === wholeEspTagLump[wholeEspTagLump.length - 1] && whichLayerToMatch.guessedClosingLump[whichLayerToMatch.guessedClosingLump.length - 2] === wholeEspTagLump[wholeEspTagLump.length - 2]) {
    return wholeEspTagLump.length;
  } // console.log(`054 matchLayer(): finally, return undefined`);

}

var defaultOpts = {
  allowCustomTagNames: false,
  skipOpeningBracket: false
};
var BACKSLASH = "\\";
var knownHtmlTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h1 - h6", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "slot", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xml"];

function isNotLetter(char) {
  return char === undefined || char.toUpperCase() === char.toLowerCase() && !/\d/.test(char) && char !== "=";
}

function extraRequirements(str, idx) {
  // either it's opening bracket
  return str[idx] === "<" || // or there's one opening bracket to the left
  str[left(str, idx)] === "<"; // TODO: consider adding clauses for br/> -
  // slash-closing follows, but no opening
}

function isOpening(str, idx, originalOpts) {
  if (idx === void 0) {
    idx = 0;
  }

  // -----------------------------------------------------------------------------
  if (typeof str !== "string") {
    throw new Error("is-html-tag-opening: [THROW_ID_01] the first input argument should have been a string but it was given as \"" + typeof str + "\", value being " + JSON.stringify(str, null, 4));
  }

  if (!Number.isInteger(idx) || idx < 0) {
    throw new Error("is-html-tag-opening: [THROW_ID_02] the second input argument should have been a natural number string index but it was given as \"" + typeof idx + "\", value being " + JSON.stringify(idx, null, 4));
  }

  var opts = _objectSpread2(_objectSpread2({}, defaultOpts), originalOpts); // -----------------------------------------------------------------------------


  var whitespaceChunk = "[\\\\ \\t\\r\\n/]*"; // generalChar does not include the dash, -

  var generalChar = "._a-z0-9\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\uFFFF"; // =======
  // r1. tag without attributes
  // for example <br>, <br/>

  var r1 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + whitespaceChunk + "\\w+" + whitespaceChunk + "\\/?" + whitespaceChunk + ">", "g"); // its custom-html tag version:

  var r5 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + whitespaceChunk + "[" + generalChar + "]+[-" + generalChar + "]*" + whitespaceChunk + ">", "g"); // to anybody who wonders, the \u2070-\uFFFF covers all the surrogates
  // of which emoji can be assembled. This is a very rough match, aiming to
  // catch as much as possible, not the validation-level match.
  // If you put bunch of opening surrogates in a sequence, for example,
  // this program would still match them positively. It's to catch all emoji,
  // including future, new-fangled emoji.
  // =======
  // r2. tag with one healthy attribute (no closing slash or whatever follow afterwards is matched)

  var r2 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + "\\s*\\w+\\s+\\w+(?:-\\w+)?\\s*=\\s*['\"\\w]", "g"); // its custom-html tag version:

  var r6 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + "\\s*\\w+\\s+[" + generalChar + "]+[-" + generalChar + "]*(?:-\\w+)?\\s*=\\s*['\"\\w]"); // =======
  // r3. closing/self-closing tags

  var r3 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + "\\s*\\/?\\s*\\w+\\s*\\/?\\s*>", "g"); // its custom-html tag version:

  var r7 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + "\\s*\\/?\\s*[" + generalChar + "]+[-" + generalChar + "]*\\s*\\/?\\s*>", "g"); // =======
  // r4. opening tag with attributes,

  var r4 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + whitespaceChunk + "\\w+(?:\\s*\\w+)?\\s*\\w+=['\"]", "g"); // its custom-html tag version:

  var r8 = new RegExp("^<" + (opts.skipOpeningBracket ? "?" : "") + whitespaceChunk + "[" + generalChar + "]+[-" + generalChar + "]*\\s+(?:\\s*\\w+)?\\s*\\w+=['\"]", "g"); // =======
  // lesser requirements when opening bracket precedes index "idx"

  var r9 = new RegExp("^<" + (opts.skipOpeningBracket ? "?\\/?" : "") + "(" + whitespaceChunk + "[" + generalChar + "]+)+" + whitespaceChunk + "[\\\\/=>]", ""); // =======

  var whatToTest = idx ? str.slice(idx) : str;
  var qualified = false;
  var passed = false; // if the result is still falsey, we match against the known HTML tag names list

  var matchingOptions = {
    cb: isNotLetter,
    i: true,
    trimCharsBeforeMatching: ["/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
  }; // -----------------------------------------------------------------------------

  if (opts.allowCustomTagNames) {
    if ((opts.skipOpeningBracket && (str[idx - 1] === "<" || str[idx - 1] === "/" && str[left(str, left(str, idx))] === "<") || whatToTest[0] === "<" && whatToTest[1] && whatToTest[1].trim()) && (r9.test(whatToTest) || /^<\w+$/.test(whatToTest))) {
      passed = true;
    } else if (r5.test(whatToTest) && extraRequirements(str, idx)) {
      passed = true;
    } else if (r6.test(whatToTest)) {
      passed = true;
    } else if (r7.test(whatToTest) && extraRequirements(str, idx)) {
      passed = true;
    } else if (r8.test(whatToTest)) {
      passed = true;
    }
  } else {
    if ((opts.skipOpeningBracket && (str[idx - 1] === "<" || str[idx - 1] === "/" && str[left(str, left(str, idx))] === "<") || whatToTest[0] === "<" && whatToTest[1] && whatToTest[1].trim()) && r9.test(whatToTest)) {
      qualified = true;
    } else if (r1.test(whatToTest) && extraRequirements(str, idx)) {
      qualified = true;
    } else if (r2.test(whatToTest)) {
      qualified = true;
    } else if (r3.test(whatToTest) && extraRequirements(str, idx)) {
      qualified = true;
    } else if (r4.test(whatToTest)) {
      qualified = true;
    }

    if (qualified && matchRightIncl(str, idx, knownHtmlTags, {
      cb: function cb(char) {
        if (char === undefined) {
          if (str[idx] === "<" && str[idx + 1] && str[idx + 1].trim() || str[idx - 1] === "<") {
            passed = true;
          }

          return true;
        }

        return char.toUpperCase() === char.toLowerCase() && !/\d/.test(char) && char !== "=";
      },
      i: true,
      trimCharsBeforeMatching: ["<", "/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
    })) {
      passed = true;
    }
  }

  if (!passed && str[idx] === "<" && str[idx + 1] && str[idx + 1].trim() && matchRight(str, idx, knownHtmlTags, matchingOptions)) {
    passed = true;
  } //


  var res = typeof str === "string" && idx < str.length && passed;
  return res;
}

var BACKSLASH$1 = "\\"; // This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsTag(str, i, token, layers, withinStyle) {
  return !!(str[i] && str[i].trim().length && (!layers.length || token.type === "text") && (!token.kind || !["doctype", "xml"].includes(token.kind)) && ( // within CSS styles, initiate tags only on opening bracket:
  !withinStyle || str[i] === "<") && (str[i] === "<" && (isOpening(str, i, {
    allowCustomTagNames: true
  }) || str[right(str, i)] === ">" || matchRight(str, i, ["doctype", "xml", "cdata"], {
    i: true,
    trimBeforeMatching: true,
    trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
  })) || isLatinLetter(str[i]) && (!str[i - 1] || !isLatinLetter(str[i - 1]) && !["<", "/", "!", BACKSLASH$1].includes(str[left(str, i)])) && isOpening(str, i, {
    allowCustomTagNames: false,
    skipOpeningBracket: true
  })) && (token.type !== "esp" || token.tail && token.tail.includes(str[i])));
}

// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.

function startsEsp(str, i, token, layers, withinStyle) {
  var res = // 1. two consecutive esp characters - Liquid, Mailchimp etc.
  // {{ or |* and so on
  espChars.includes(str[i]) && str[i + 1] && espChars.includes(str[i + 1]) && // ensure our suspected lump doesn't comprise only
  // of "notVeryEspChars" - real ESP tag |**| can
  // contain asterisk (*) but only asterisks can't
  // comprise an ESP tag. But curly braces can -
  // {{ and }} are valid Nunjucks heads/tails.
  // So not all ESP tag characters are equal.
  !(notVeryEspChars.includes(str[i]) && notVeryEspChars.includes(str[i + 1])) && ( // only "veryEspChars" group characters can
  // be repeated, like {{ and }} - other's can't
  // for example, ** is not real ESP heads
  str[i] !== str[i + 1] || veryEspChars.includes(str[i])) && token.type !== "rule" && token.type !== "at" && !(str[i] === "-" && "-{(".includes(str[i + 1])) && !("})".includes(str[i]) && "-".includes(str[i + 1])) && !( // insurance against repeated percentages
  //
  // imagine: "99%%."
  //             ^
  //      we're here
  str[i] === "%" && str[i + 1] === "%" && "0123456789".includes(str[i - 1]) && (!str[i + 2] || punctuationChars.includes(str[i + 2]) || !str[i + 2].trim().length)) && !(withinStyle && ("{}".includes(str[i]) || "{}".includes(str[right(str, i)]))) || //
  // 2. html-like syntax
  //
  // 2.1 - Responsys RPL and similar
  // <#if z> or </#if> and so on
  // normal opening tag
  str[i] === "<" && ( // and
  // either it's closing tag and what follows is ESP-char
  str[i + 1] === "/" && espChars.includes(str[i + 2]) || // or
  // it's not closing and esp char follows right away
  espChars.includes(str[i + 1]) && // but no cheating, character must not be second-grade
  !["-"].includes(str[i + 1])) || // 2.2 - JSP (Java Server Pages)
  // <%@ page blablabla %>
  // <c:set var="someList" value="${jspProp.someList}" />
  str[i] === "<" && ( // covers majority of JSP tag cases
  str[i + 1] === "%" || // <jsp:
  str.startsWith("jsp:", i + 1) || // <cms:
  str.startsWith("cms:", i + 1) || // <c:
  str.startsWith("c:", i + 1)) || str.startsWith("${jspProp", i) || //
  // 3. single character tails, for example RPL's closing curlies: ${zzz}
  // it's specifically a closing-kind character
  ">})".includes(str[i]) && // heads include the opposite of it
  Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump.includes(flipEspTag(str[i])) && ( // insurance against "greater than", as in:
  // <#if product.weight > 100>
  str[i] !== ">" || !xBeforeYOnTheRight$1(str, i + 1, ">", "<")) || //
  // 4. comment closing in RPL-like templating languages, for example:
  // <#-- z -->
  str[i] === "-" && str[i + 1] === "-" && str[i + 2] === ">" && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-";
  return !!res;
}

var version = "5.1.2";

var version$1 = version;
var importantStartsRegexp = /^\s*!?\s*[a-zA-Z]+(?:[\s;}<>'"]|$)/gm;
var defaults$1 = {
  tagCb: null,
  tagCbLookahead: 0,
  charCb: null,
  charCbLookahead: 0,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
/**
 * HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 */

function tokenizer(str, originalOpts) {
  var start = Date.now(); //
  //
  //
  //
  //
  //
  //
  // INSURANCE
  // ---------------------------------------------------------------------------

  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error("codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as \"" + typeof str + "\", equal to:\n" + JSON.stringify(str, null, 4));
    }
  }

  if (originalOpts && !isObj$1(originalOpts)) {
    throw new Error("codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type " + typeof originalOpts + ", equal to " + JSON.stringify(originalOpts, null, 4));
  }

  if (originalOpts && isObj$1(originalOpts) && originalOpts.tagCb && typeof originalOpts.tagCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type " + typeof originalOpts.tagCb + ", equal to " + JSON.stringify(originalOpts.tagCb, null, 4));
  }

  if (originalOpts && isObj$1(originalOpts) && originalOpts.charCb && typeof originalOpts.charCb !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type " + typeof originalOpts.charCb + ", equal to " + JSON.stringify(originalOpts.charCb, null, 4));
  }

  if (originalOpts && isObj$1(originalOpts) && originalOpts.reportProgressFunc && typeof originalOpts.reportProgressFunc !== "function") {
    throw new Error("codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type " + typeof originalOpts.reportProgressFunc + ", equal to " + JSON.stringify(originalOpts.reportProgressFunc, null, 4));
  } //
  //
  //
  //
  //
  //
  //
  // OPTS
  // ---------------------------------------------------------------------------


  var opts = _objectSpread2(_objectSpread2({}, defaults$1), originalOpts); //
  //
  //
  //
  //
  //
  //
  // VARS
  // ---------------------------------------------------------------------------


  var currentPercentageDone = 0;
  var lastPercentage = 0;
  var len = str.length;
  var midLen = Math.floor(len / 2);
  var doNothing = 0; // index until where to do nothing

  var withinStyle = false; // flag used to instruct content after <style> to toggle type="css"

  var withinStyleComment = false; // opts.*CbLookahead allows to request "x"-many tokens "from the future"
  // to be reported upon each token. You can check what's coming next.
  // To implement this, we need to stash "x"-many tokens and only when enough
  // have been gathered, array.shift() the first one and ping the callback
  // with it, along with "x"-many following tokens. Later, in the end,
  // we clean up stashes and report only as many as we have.
  // The stashes will be LIFO (last in first out) style arrays:

  var tagStash = [];
  var charStash = []; // when we compile the token, we fill this object:

  var token = {};

  function tokenReset() {
    // object-assign is basically cloning - objects are passed by reference,
    // we can't risk mutating the default object:
    token = {
      type: null,
      start: null,
      end: null,
      value: null
    };
    attribReset();
  } // same for attributes:


  var attribDefaults = {
    attribName: "",
    attribNameRecognised: false,
    attribNameStartsAt: null,
    attribNameEndsAt: null,
    attribOpeningQuoteAt: null,
    attribClosingQuoteAt: null,
    attribValueRaw: null,
    attribValue: [],
    attribValueStartsAt: null,
    attribValueEndsAt: null,
    attribStarts: null,
    attribEnds: null,
    attribLeft: null
  };

  var attrib = _objectSpread2({}, attribDefaults);

  function attribReset() {
    // object-assign is basically cloning - objects are passed by reference,
    // we can't risk mutating the default object:
    attrib = lodash_clonedeep(attribDefaults);
  }

  function attribPush(tokenObj) { // 1. clean up any existing tokens first

    /* istanbul ignore else */

    if (attrib.attribValue.length && attrib.attribValue[~-attrib.attribValue.length].start && !attrib.attribValue[~-attrib.attribValue.length].end) {
      attrib.attribValue[~-attrib.attribValue.length].end = tokenObj.start;
      attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, tokenObj.start);
    }

    attrib.attribValue.push(tokenObj);
  } // same for property


  var propertyDefault = {
    start: null,
    end: null,
    value: null,
    property: null,
    propertyStarts: null,
    propertyEnds: null,
    importantStarts: null,
    importantEnds: null,
    important: null,
    colon: null,
    valueStarts: null,
    valueEnds: null,
    semi: null
  };

  var property = _objectSpread2({}, propertyDefault);

  function propertyReset() {
    property = _objectSpread2({}, propertyDefault);
  } // The CSS properties can be in <style> blocks or inline, <div style="">.
  // When we process the code, we have to address both places. This "push"
  // is used in handful of places so we DRY'ed it to a function.


  function pushProperty(p) {
    // push and init and patch up to resume
    if (attrib && attrib.attribName === "style") {
      attrib.attribValue.push(_objectSpread2({}, p));
    } else if (token && Array.isArray(token.properties)) {
      token.properties.push(_objectSpread2({}, p));
    }
  } // Initial resets:


  tokenReset(); // ---------------------------------------------------------------------------

  var selectorChunkStartedAt; // For example:
  //
  //       <style type="text/css">
  //         .unused1[z].unused2, .used[z] {a:1;}
  //         |                 |
  //         <-selector chunk ->
  //
  //
  // ---------------------------------------------------------------------------

  var parentTokenToBackup; // We use it for nested ESP tags - for example, <td{% z %}>
  // The esp tag {% z %} is nested among the tag's attributes:
  // {
  //   type: "tag",
  //   start: 0,
  //   end: 11,
  //   value: `<td{% z %}>`,
  //   attribs: [
  //     {
  //       type: "esp",
  //       start: 3,
  //       end: 10,
  //       value: "{% z %}",
  //       head: "{%",
  //       tail: "%}",
  //       kind: null,
  //     },
  //   ],
  // }
  //
  // to allow this, we have to save the current, parent token, in case above,
  // <td...> and then initiate the ESP token, which later will get nested

  var attribToBackup; // We use it when ESP tag is inside the attribute:
  // <a b="{{ c }}d">
  //
  // we need to back up both tag and attrib objects, assemble esp tag, then
  // restore both and stick it inside the "attrib"'s array "attribValue":
  //
  // attribValue: [
  //   {
  //     type: "esp",
  //     start: 6,
  //     end: 13,
  //     value: "{{ c }}",
  //     head: "{{",
  //     tail: "}}",
  //   },
  //   {
  //     type: "text",
  //     start: 13,
  //     end: 14,
  //     value: "d",
  //   },
  // ],

  var lastNonWhitespaceCharAt = null; // ---------------------------------------------------------------------------
  //
  //
  //
  //
  //
  //
  //
  // INNER FUNCTIONS
  // ---------------------------------------------------------------------------
  // When we enter the double quotes or any other kind of "layer", we need to
  // ignore all findings until the "layer" is exited. Here we keep note of the
  // closing strings which exit the current "layer". There can be many of them,
  // nested and escaped and so on.

  var layers = []; // example of contents:
  // [
  //     {
  //         type: "simple",
  //         value: "'",
  //     },
  //     {
  //         type: "esp",
  //         guessedClosingLump: "%}"
  //     }
  // ]
  // there can be two types of layer values: simple strings to match html/css
  // token types and complex, to match esp tokens heuristically, where we don't
  // know exact ESP tails but we know set of characters that suspected "tail"
  // should match.
  //

  function lastLayerIs(something) {
    return !!(Array.isArray(layers) && layers.length && layers[~-layers.length].type === something);
  } // processes closing comment - it's DRY'ed here because it's in multiple places
  // considering broken code like stray closing inline css comment blocks etc.


  function closingComment(i) {
    var end = (right(str, i) || i) + 1;
    attribPush({
      type: "comment",
      start: i,
      end: end,
      value: str.slice(i, end),
      closing: true,
      kind: "block",
      language: "css"
    }); // skip next character

    doNothing = end; // pop the block comment layer

    if (lastLayerIs("block")) {
      layers.pop();
    }
  }

  function reportFirstFromStash(stash, cb, lookaheadLength) { // start to assemble node we're report to the callback cb1()

    var currentElem = stash.shift(); // ^ shift removes it from stash
    // now we need the "future" nodes, as many as "lookahead" of them
    // that's the container where they'll sit:

    var next = [];

    for (var i = 0; i < lookaheadLength; i++) { // we want as many as "lookaheadLength" from stash but there might be
      // not enough there

      if (stash[i]) {
        next.push(lodash_clonedeep(stash[i]));
      } else {
        break;
      }
    } // finally, ping the callback with assembled element:

    if (typeof cb === "function") {
      cb(currentElem, next);
    }
  }

  function pingCharCb(incomingToken) { // no cloning, no reset

    if (opts.charCb) {
      // if there were no stashes, we'd call the callback like this:
      // opts.charCb(incomingToken);
      // 1. push to stash
      charStash.push(incomingToken); // 2. is there are enough tokens in the stash, ping the first-one

      if (charStash.length > opts.charCbLookahead) {
        reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
      }
    }
  }

  function pingTagCb(incomingToken) {

    if (opts.tagCb) {
      // console.log(
      //   `419 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} tagCb() with ${JSON.stringify(
      //     incomingToken,
      //     null,
      //     4
      //   )}`
      // );
      // opts.tagCb(clone(incomingToken));
      // 1. push to stash
      tagStash.push(incomingToken); // 2. is there are enough tokens in the stash, ping the first-one

      if (tagStash.length > opts.tagCbLookahead) {
        reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
      }
    }
  }

  function dumpCurrentToken(incomingToken, i) { // Let's ensure it was not a token with trailing whitespace, because now is
    // the time to separate it and report it as a standalone token.
    // Also, the following clause will catch the unclosed tags like
    // <a href="z" click here</a>

    if (!["text", "esp"].includes(incomingToken.type) && incomingToken.start !== null && incomingToken.start < i && (str[~-i] && !str[~-i].trim() || str[i] === "<")) { // this ending is definitely a token ending. Now the question is,
      // maybe we need to split all gathered token contents into two:
      // maybe it's a tag and a whitespace? or an unclosed tag?
      // in some cases, this token.end will be only end of a second token,
      // we'll need to find where this last chunk started and terminate the
      // previous token (one which started at the current token.start) there.

      if (left(str, i) !== null) {
        incomingToken.end = left(str, i) + 1;
      } else {
        incomingToken.end = i;
      }

      incomingToken.value = str.slice(incomingToken.start, incomingToken.end);

      if (incomingToken.type === "tag" && !"/>".includes(str[~-incomingToken.end])) { // we need to potentially shift the incomingToken.end left, imagine:
        // <a href="z" click here</a>
        //                       ^
        //               we are here ("i" value), that's incomingToken.end currently
        //
        // <a href="z" click here</a>
        //            ^
        //        incomingToken.end should be here
        //
        // PLAN: take current token, if there are attributes, validate
        // each one of them, terminate at the point of the first smell.
        // If there are no attributes, terminate at the end of a tag name

        var cutOffIndex = incomingToken.tagNameEndsAt || i;

        if (Array.isArray(incomingToken.attribs) && incomingToken.attribs.length) { // initial cut-off point is token.tagNameEndsAt // with each validated attribute, push the cutOffIndex forward:

          for (var i2 = 0, len2 = incomingToken.attribs.length; i2 < len2; i2++) {

            if (incomingToken.attribs[i2].attribNameRecognised && incomingToken.attribs[i2].attribEnds) {
              cutOffIndex = incomingToken.attribs[i2].attribEnds; // small tweak - consider this:
              // <a href="z" click here</a>
              //            ^
              //         this space in particular
              // that space above should belong to the tag's index range,
              // unless the whitespace is bigger than 1:
              // <a href="z"   click here</a>

              if (str[cutOffIndex + 1] && !str[cutOffIndex].trim() && str[cutOffIndex + 1].trim()) {
                cutOffIndex += 1;
              }
            } else { // delete false attributes from incomingToken.attribs

              if (i2 === 0) {
                // if it's the first attribute and it's already
                // not suitable, for example:
                // <a click here</a>
                // all attributes ("click", "here") are removed:
                incomingToken.attribs = [];
              } else {
                // leave only attributes up to i2-th
                incomingToken.attribs = incomingToken.attribs.splice(0, i2);
              } // in the end stop the loop:

              break;
            }
          }
        }

        incomingToken.end = cutOffIndex;
        incomingToken.value = str.slice(incomingToken.start, incomingToken.end);

        if (!incomingToken.tagNameEndsAt) {
          incomingToken.tagNameEndsAt = cutOffIndex;
        }

        if (incomingToken.tagNameStartsAt && incomingToken.tagNameEndsAt && !incomingToken.tagName) {
          incomingToken.tagName = str.slice(incomingToken.tagNameStartsAt, cutOffIndex);
          incomingToken.recognised = isTagNameRecognised(incomingToken.tagName);
        }
        pingTagCb(incomingToken);
        initToken("text", cutOffIndex);
      } else {
        pingTagCb(incomingToken);
        tokenReset(); // if there was whitespace after token's end:

        if (str[~-i] && !str[~-i].trim()) {
          initToken("text", left(str, i) + 1);
        }
      }
    } // if a token is already being recorded, end it


    if (token.start !== null) {

      if (token.end === null && token.start !== i) {
        // (esp tags will have it set already)
        token.end = i;
        token.value = str.slice(token.start, token.end);
      } // normally we'd ping the token but let's not forget we have token stashes
      // in "attribToBackup" and "parentTokenToBackup"

      if (token.start !== null && token.end) {
        // if it's a text token inside "at" rule, nest it, push into that
        // "at" rule pending in layers - otherwise, ping as standalone
        if (lastLayerIs("at")) {
          layers[~-layers.length].token.rules.push(token);
        } else {
          pingTagCb(token);
        }
      }
      tokenReset();
    }
  }

  function atRuleWaitingForClosingCurlie() {
    return lastLayerIs("at") && isObj$1(layers[~-layers.length].token) && layers[~-layers.length].token.openingCurlyAt && !layers[~-layers.length].token.closingCurlyAt;
  }

  function getNewToken(type, startVal) {
    if (startVal === void 0) {
      startVal = null;
    }

    if (type === "tag") {
      return {
        type: type,
        start: startVal,
        end: null,
        value: null,
        tagNameStartsAt: null,
        tagNameEndsAt: null,
        tagName: null,
        recognised: null,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: []
      };
    }

    if (type === "comment") {
      return {
        type: type,
        start: startVal,
        end: null,
        value: null,
        closing: false,
        kind: "simple",
        language: "html"
      };
    }

    if (type === "rule") {
      return {
        type: type,
        start: startVal,
        end: null,
        value: null,
        left: null,
        nested: false,
        openingCurlyAt: null,
        closingCurlyAt: null,
        selectorsStart: null,
        selectorsEnd: null,
        selectors: [],
        properties: []
      };
    }

    if (type === "at") {
      return {
        type: type,
        start: startVal,
        end: null,
        value: null,
        left: null,
        nested: false,
        openingCurlyAt: null,
        closingCurlyAt: null,
        identifier: null,
        identifierStartsAt: null,
        identifierEndsAt: null,
        query: null,
        queryStartsAt: null,
        queryEndsAt: null,
        rules: []
      };
    }

    if (type === "esp") {
      return {
        type: type,
        start: startVal,
        end: null,
        value: null,
        head: null,
        headStartsAt: null,
        headEndsAt: null,
        tail: null,
        tailStartsAt: null,
        tailEndsAt: null
      };
    } // a default is text token


    return {
      type: "text",
      start: startVal,
      end: null,
      value: null
    };
  }

  function initToken(type, startVal) { // we mutate the object on the parent scope, so no Object.assign here

    attribReset();
    token = getNewToken(type, startVal);
  }

  function initProperty(propertyStarts) { // we mutate the object on the parent scope, so no Object.assign here

    propertyReset();

    if (typeof propertyStarts === "number") {
      property.propertyStarts = propertyStarts;
      property.start = propertyStarts;
    } else {
      property = _objectSpread2(_objectSpread2({}, propertyDefault), propertyStarts);
    }
  }

  function ifQuoteThenAttrClosingQuote(idx) {
    // either it's not a quote:
    return !"'\"".includes(str[idx]) || // precaution when both attrib.attribOpeningQuoteAt and
    // attrib.attribValueStartsAt are missing and thus unusable - just
    // skip this clause in that case... (but it should not ever happen)
    !(attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt) || // or it's real closing quote, because if not, let's keep it within
    // the value, it will be easier to validate, imagine:
    // <div style="float:"left"">
    //
    isAttrClosing(str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, idx);
  }

  function attrEndsAt(idx) {
    // either we're within normal head css styles:
    return ";}/".includes(str[idx]) && (!attrib || !attrib.attribName || attrib.attribName !== "style") || // or within inline css styles within html
    "/;'\"><".includes(str[idx]) && attrib && attrib.attribName === "style" && // and it's a real quote, not rogue double-wrapping around the value
    ifQuoteThenAttrClosingQuote(idx);
  } //
  //
  //
  //
  //
  //
  //
  // THE MAIN LOOP
  // ---------------------------------------------------------------------------
  // We deliberately step 1 character outside of str length
  // to simplify the algorithm. Thusly, it's i <= len not i < len:


  var _loop = function _loop(_i) { //
    //
    //
    //
    //                                THE TOP
    //                                ███████
    //
    //
    //
    //
    // Logging:
    // ------------------------------------------------------------------------- // Progress:
    // -------------------------------------------------------------------------

    if (!doNothing && str[_i] && opts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (_i === midLen) {
          opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
        }
      } else if (len >= 2000) {
        // defaults:
        // opts.reportProgressFuncFrom = 0
        // opts.reportProgressFuncTo = 100
        currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(_i / len * (opts.reportProgressFuncTo - opts.reportProgressFuncFrom));

        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
      }
    } // Left/Right helpers
    // -------------------------------------------------------------------------


    var leftVal = left(str, _i);
    var rightVal = right(str, _i); // Turn off doNothing if marker passed
    // -------------------------------------------------------------------------

    if (withinStyle && token.type && !["rule", "at", "text", "comment"].includes(token.type)) {
      withinStyle = false;
    }

    if (doNothing && _i >= doNothing) {
      doNothing = 0;
    } // skip chain of the same-type characters
    // -------------------------------------------------------------------------


    if (isLatinLetter(str[_i]) && isLatinLetter(str[~-_i]) && isLatinLetter(str[_i + 1])) {
      i = _i;
      return "continue";
    }

    if (" \t\r\n".includes(str[_i]) && // ~- means subtract 1
    str[_i] === str[~-_i] && str[_i] === str[_i + 1]) {
      i = _i;
      return "continue";
    } // catch the curly tails of at-rules
    // -------------------------------------------------------------------------


    if (!doNothing && atRuleWaitingForClosingCurlie()) { // if (token.type === null && str[i] === "}") {
      // if (str[i] === "}") {

      if (str[_i] === "}") {
        if (!token.type || token.type === "text" || token.type === "rule" && token.openingCurlyAt === null) {
          // rule token must end earlier
          if (token.type === "rule") {
            token.end = leftVal + 1;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token); // if it's a text token inside "at" rule, nest it, push into that
            // "at" rule pending in layers - otherwise, ping as standalone

            if (lastLayerIs("at")) {
              layers[~-layers.length].token.rules.push(token);
            }
            tokenReset(); // if there was trailing whitespace, initiate it

            if (leftVal !== null && leftVal < ~-_i) {
              initToken("text", leftVal + 1);
            }
          }
          dumpCurrentToken(token, _i);
          var poppedToken = layers.pop();
          token = poppedToken.token; // then, continue on "at" rule's token...

          token.closingCurlyAt = _i;
          token.end = _i + 1;
          token.value = str.slice(token.start, token.end);
          pingTagCb(token); // if it's a "rule" token and a parent "at" rule is pending in layers,
          // also put this "rule" into that parent in layers

          if (lastLayerIs("at")) {
            layers[~-layers.length].token.rules.push(token);
          }
          tokenReset();
          doNothing = _i + 1;
        }
      } else if (token.type === "text" && str[_i] && str[_i].trim()) {
        // terminate the text token, all the non-whitespace characters comprise
        // rules because we're inside the at-token, it's CSS!
        token.end = _i;
        token.value = str.slice(token.start, token.end); // if it's a text token inside "at" rule, nest it, push into that
        // "at" rule pending in layers - otherwise, ping as standalone

        if (lastLayerIs("at")) {
          layers[~-layers.length].token.rules.push(token);
        } else {
          pingTagCb(token);
        }
        tokenReset();
      }
    }

    if (token.end && token.end === _i) {

      if (token.tagName === "style" && !token.closing) {
        withinStyle = true;
      } // we need to retain the information after tag was dumped to tagCb() and wiped


      if (attribToBackup) { // 1. restore

        attrib = attribToBackup; // 2. push current token into attrib.attribValue
        attrib.attribValue.push(token); // 3. restore real token

        token = lodash_clonedeep(parentTokenToBackup); // 4. reset

        attribToBackup = undefined;
        parentTokenToBackup = undefined;
      } else {
        dumpCurrentToken(token, _i);
        layers.length = 0;
      }
    } //
    //
    //
    //
    //                               MIDDLE
    //                               ██████
    //
    //
    //
    //
    // record "layers" like entering double quotes
    // -------------------------------------------------------------------------

    if (!doNothing) {
      if (["tag", "rule", "at"].includes(token.type) && token.kind !== "cdata") {

        if (str[_i] && (SOMEQUOTE.includes(str[_i]) || "()".includes(str[_i])) && !( // below, we have insurance against single quotes, wrapped with quotes:
        // "'" or '"' - templating languages might put single quote as a sttring
        // character, not meaning wrapped-something.
        SOMEQUOTE.includes(str[leftVal]) && str[leftVal] === str[rightVal]) && // protection against double-wrapped values, like
        // <div style="float:"left"">
        //
        //
        // it's not a quote or a real attr ending
        ifQuoteThenAttrClosingQuote(_i) // because if it's not really a closing quote, it's a rogue-one and
        // it belongs to the current attribute's value so that later we
        // can catch it, validating values, imagine "float" value "left" comes
        // with quotes, as in ""left""
        ) {

            if ( // maybe it's the closing counterpart?
            lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[_i])) {
              layers.pop();
            } else {
              // it's opening then
              layers.push({
                type: "simple",
                value: str[_i],
                position: _i
              });
            }
          }
      } else if (token.type === "comment" && ["only", "not"].includes(token.kind)) {

        if (["[", "]"].includes(str[_i])) {

          if ( // maybe it's the closing counterpart?
          lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[_i])) {
            // maybe it's the closing counterpart?
            layers.pop();
          } else {
            // it's opening then
            layers.push({
              type: "simple",
              value: str[_i],
              position: _i
            });
          }
        }
      } else if (token.type === "esp" && ("'\"" + BACKTICK + "()").includes(str[_i]) && !( // below, we have insurance against single quotes, wrapped with quotes:
      // "'" or '"' - templating languages might put single quote as a sttring
      // character, not meaning wrapped-something.
      ["\"", "'", "`"].includes(str[leftVal]) && str[leftVal] === str[rightVal])) {

        if ( // maybe it's the closing counterpart?
        lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[_i])) {
          // maybe it's the closing counterpart?
          layers.pop();
          doNothing = _i + 1;
        } else if (!"]})>".includes(str[_i])) {
          // it's opening then
          layers.push({
            type: "simple",
            value: str[_i],
            position: _i
          });
        }
      } // console.log(
      //   `1094 FIY, currently ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
      //     layers,
      //     null,
      //     4
      //   )}`
      // );

    } // catch the start of at rule's identifierStartsAt
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "at" && token.start != null && _i >= token.start && !token.identifierStartsAt && str[_i] && str[_i].trim() && str[_i] !== "@") {
      // the media identifier's "entry" requirements are deliberately loose
      // because we want to catch errors there, imagine somebody mistakenly
      // adds a comma, @,media
      // or adds a space, @ media
      token.identifierStartsAt = _i;
    } // catch the end of the "at" rule token
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "at" && token.queryStartsAt && !token.queryEndsAt && "{;".includes(str[_i])) {

      if (str[_i] === "{") {
        if (str[~-_i] && str[~-_i].trim()) {
          token.queryEndsAt = _i;
        } else {
          // trim the trailing whitespace:
          // @media (max-width: 600px) {
          //                          ^
          //                        this
          //
          token.queryEndsAt = leftVal !== null ? leftVal + 1 : _i; // left() stops "to the left" of a character, if you used that index
          // for slicing, that character would be included, in our case,
          // @media (max-width: 600px) {
          //                         ^
          //            that would be index of this bracket
        }
      } else {
        // ; closing, for example, illegal:
        // @charset "UTF-8";
        //                 ^
        //          we're here
        //
        token.queryEndsAt = left(str, _i + 1) || 0;
      }

      if (token.queryStartsAt && token.queryEndsAt) {
        token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
      }

      token.end = str[_i] === ";" ? _i + 1 : _i;
      token.value = str.slice(token.start, token.end);

      if (str[_i] === ";") {
        // if code is clean, that would be @charset for example, no curlies
        pingTagCb(token);
      } else {
        // then it's opening curlie
        token.openingCurlyAt = _i; // push so far gathered token into layers

        layers.push({
          type: "at",
          token: token
        });
      }
      tokenReset();
      doNothing = _i + 1;
    } // catch the start of the query
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "at" && token.identifier && str[_i] && str[_i].trim() && !token.queryStartsAt) {
      token.queryStartsAt = _i;
    } // catch the end of at rule's identifierStartsAt
    // -------------------------------------------------------------------------


    if (!doNothing && token && token.type === "at" && token.identifierStartsAt && _i >= token.start && str[_i] && (!str[_i].trim() || "()".includes(str[_i])) && !token.identifierEndsAt) {
      token.identifierEndsAt = _i;
      token.identifier = str.slice(token.identifierStartsAt, _i);
    } // catch the end of a CSS chunk
    // -------------------------------------------------------------------------
    // charsThatEndCSSChunks:  } , {


    if (token.type === "rule" && selectorChunkStartedAt && (charsThatEndCSSChunks.includes(str[_i]) || str[_i] && !str[_i].trim() && charsThatEndCSSChunks.includes(str[rightVal]))) {
      token.selectors.push({
        value: str.slice(selectorChunkStartedAt, _i),
        selectorStarts: selectorChunkStartedAt,
        selectorEnds: _i
      });
      selectorChunkStartedAt = undefined;
      token.selectorsEnd = _i;
    } // catch the beginning of a token
    // -------------------------------------------------------------------------
    // imagine layers are like this:
    // [
    //   {
    //     type: "esp",
    //     openingLump: "<%@",
    //     guessedClosingLump: "@%>",
    //     position: 0,
    //   },
    //   {
    //     type: "simple",
    //     value: '"',
    //     position: 17,
    //   },
    //   {
    //     type: "simple",
    //     value: "'",
    //     position: 42,
    //   },
    // ];
    // we extract the last type="esp" layer to simplify calculations


    var lastEspLayerObjIdx = getLastEspLayerObjIdx(layers);

    if (!doNothing && str[_i]) { // console.log(
      //   `1707 ███████████████████████████████████████ IS COMMENT STARTING? ${startsHtmlComment(
      //     str,
      //     i,
      //     token,
      //     layers,
      //     withinStyle
      //   )}`
      // );
      // console.log(
      //   `1717 ███████████████████████████████████████ IS ESP TAG STARTING? ${startsEsp(
      //     str,
      //     i,
      //     token,
      //     layers,
      //     withinStyle
      //   )}`
      // );

      if (startsTag(str, _i, token, layers, withinStyle)) {
        //
        //
        //
        // TAG STARTING
        //
        //
        //

        if (token.type && token.start !== null) {
          if (token.type === "rule") {
            if (property && property.propertyStarts) {
              property.propertyEnds = _i;
              property.property = str.slice(property.propertyStarts, _i);

              if (!property.end) {
                property.end = _i;
              }

              pushProperty(property);
              propertyReset();
            }
          }
          dumpCurrentToken(token, _i);
          tokenReset();
        } // add other HTML-specific keys onto the object
        // second arg is "start" key:


        initToken("tag", _i);

        if (withinStyle) {
          withinStyle = false;
        } // extract the tag name:


        var badCharacters = "?![-/";
        var extractedTagName = "";
        var letterMet = false;

        if (rightVal) {
          for (var y = rightVal; y < len; y++) {

            if (!letterMet && str[y] && str[y].trim() && str[y].toUpperCase() !== str[y].toLowerCase()) {
              letterMet = true;
            }

            if ( // at least one letter has been met, to cater
            // <? xml ...
            letterMet && str[y] && ( // it's whitespace
            !str[y].trim() || // or symbol which definitely does not belong to a tag,
            // considering we want to catch some rogue characters to
            // validate and flag them up later
            !/\w/.test(str[y]) && !badCharacters.includes(str[y]) || str[y] === "[") // if letter has been met, "[" is also terminating character
            // think <![CDATA[x<y]]>
            //               ^
            //             this
            ) {
                break;
              } else if (!badCharacters.includes(str[y])) {
              extractedTagName += str[y].trim().toLowerCase();
            }
          }
        } // set the kind:

        if (extractedTagName === "doctype") {
          token.kind = "doctype";
        } else if (extractedTagName === "cdata") {
          token.kind = "cdata";
        } else if (extractedTagName === "xml") {
          token.kind = "xml";
        } else if (inlineTags.has(extractedTagName)) {
          token.kind = "inline";
        }
      } else if (startsHtmlComment(str, _i, token, layers)) {
        //
        //
        //
        // HTML COMMENT STARTING
        //
        //
        //

        if (token.start != null) {
          dumpCurrentToken(token, _i);
        } // add other HTML-specific keys onto the object
        // second arg is "start" key:


        initToken("comment", _i); // the "language" default is "html" anyway so no need to set it // set "closing"

        if (str[_i] === "-") {
          token.closing = true;
        } else if (matchRightIncl(str, _i, ["<![endif]-->"], {
          i: true,
          trimBeforeMatching: true,
          maxMismatches: 2
        })) {
          token.closing = true;
          token.kind = "only";
        }

        if (withinStyle) {
          withinStyle = false;
        }
      } else if (startsCssComment(str, _i, token, layers, withinStyle)) {
        //
        //
        //
        // CSS COMMENT STARTING
        //
        //
        //

        if (token.start != null) {
          dumpCurrentToken(token, _i);
        } // add other token-specific keys onto the object
        // second arg is "start" key:


        initToken("comment", _i);
        token.language = "css";
        token.kind = str[_i] === "/" && str[_i + 1] === "/" ? "line" : "block";
        token.value = str.slice(_i, _i + 2);
        token.end = _i + 2;
        token.closing = str[_i] === "*" && str[_i + 1] === "/";
        withinStyleComment = true;

        if (token.closing) {
          withinStyleComment = false;
        }

        doNothing = _i + 2;
      } else if ( // if we encounter two consecutive characters of guessed lump
      typeof lastEspLayerObjIdx === "number" && layers[lastEspLayerObjIdx] && layers[lastEspLayerObjIdx].type === "esp" && layers[lastEspLayerObjIdx].openingLump && layers[lastEspLayerObjIdx].guessedClosingLump && layers[lastEspLayerObjIdx].guessedClosingLump.length > 1 && // current character is among guessed lump's characters
      layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[_i]) && // ...and the following character too...
      layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[_i + 1]) && // since we "jump" over layers, that is, passed quotes
      // and what not, we have to ensure we don't skip
      // legit cases like:
      // ${"${name}${name}${name}${name}"}
      //          ^
      //          here
      // Responsys expression can be within a value! we have
      // to respect those quotes!
      //
      // these are erroneous quotes representing layers
      // which we do ignore (JSP example):
      //
      // <%@taglib prefix="t' tagdir='/WEB-INF/tags"%>
      //                  ^ ^        ^             ^
      //                  errors
      !( // we excluse the same case,
      // ${"${name}${name}${name}${name}"}
      //          ^
      //        false ending
      // we ensure that quote doesn't follow the esp layer
      // "lastEspLayerObjIdx" and there's counterpart of it
      // on the right, and there's ESP char on the right of it
      // next layer after esp's follows
      layers[lastEspLayerObjIdx + 1] && // and it's quote
      "'\"".includes(layers[lastEspLayerObjIdx + 1].value) && // matching quote on the right has ESP character following
      // it exists (>-1)
      str.indexOf(layers[lastEspLayerObjIdx + 1].value, _i) > 0 && layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[right(str, str.indexOf(layers[lastEspLayerObjIdx + 1].value, _i))])) || // hard check
      startsEsp(str, _i, token, layers, withinStyle) && ( // ensure we're not inside quotes, so it's not an expression within a value
      // ${"${name}${name}${name}${name}"}
      //    ^
      //   we could be here - notice quotes wrapping all around
      //
      !lastLayerIs("simple") || !["'", "\""].includes(layers[~-layers.length].value) || // or we're within an attribute (so quotes are HTML tag's not esp tag's)
      attrib && attrib.attribStarts && !attrib.attribEnds)) {
        //
        //
        //
        // ESP TAG STARTING
        //
        //
        // // ESP tags can't be entered from after CSS at-rule tokens or
        // normal CSS rule tokens
        //
        //
        //
        // FIRST, extract the tag opening and guess the closing judging from it

        var wholeEspTagLumpOnTheRight = getWholeEspTagLumpOnTheRight(str, _i, layers); // lump can't end with attribute's ending, that is, something like:
        // <frameset cols="**">
        // that's a false positive

        if (!espLumpBlacklist.includes(wholeEspTagLumpOnTheRight)) { // check the "layers" records - maybe it's a closing part of a set?

          var lengthOfClosingEspChunk;
          var disposableVar;

          if (layers.length && ( //
          // if layer match result is truthy, we take it, otherwise, move on
          // but don't calculate twice!
          // eslint-disable-next-line no-cond-assign
          lengthOfClosingEspChunk = matchLayerLast(wholeEspTagLumpOnTheRight, layers))) { // if this was closing of a standalone esp tag, terminate it and ping
            // it to the cb()

            if (token.type === "esp") {
              if (!token.end) {
                token.end = _i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
                token.tail = str.slice(_i, _i + lengthOfClosingEspChunk);
                token.tailStartsAt = _i;
                token.tailEndsAt = token.end; // correction for XML-like templating tags, closing can
                // have a slash, <c:set zzz/>
                //                         ^

                if (str[_i] === ">" && str[leftVal] === "/") {
                  token.tailStartsAt = leftVal;
                  token.tail = str.slice(token.tailStartsAt, _i + 1);
                }
              } // activate doNothing until the end of tails because otherwise,
              // mid-tail characters will initiate new tail start clauses
              // and we'll have overlap/false result


              doNothing = token.tailEndsAt; // it depends will we ping it as a standalone token or will we
              // nest inside the parent tag among attributes

              if (parentTokenToBackup) { // push token to parent, to be among its attributes
                // 1. ensure key "attribs" exist (thinking about comment tokens etc)

                if (!Array.isArray(parentTokenToBackup.attribs)) {
                  parentTokenToBackup.attribs = [];
                } // 2. push somewhere


                if (attribToBackup) {
                  // 1. restore
                  attrib = attribToBackup; // 2. push to attribValue
                  attrib.attribValue.push(_objectSpread2({}, token));
                } else {
                  // push to attribs
                  parentTokenToBackup.attribs.push(_objectSpread2({}, token));
                } // 3. parentTokenToBackup becomes token


                token = lodash_clonedeep(parentTokenToBackup); // 4. resets

                parentTokenToBackup = undefined;
                attribToBackup = undefined; // 5. pop layers, remove the opening ESP tag record
                layers.pop(); // 6. finally, continue, bypassing the rest of the code in this loop
                i = _i;
                return "continue";
              } else {
                dumpCurrentToken(token, _i);
              }
              tokenReset();
            } // pop the recorded layers, at this moment record of ESP chunk
            // will be lost:


            layers.pop();
          } else if (layers.length && ( // eslint-disable-next-line no-cond-assign
          lengthOfClosingEspChunk = matchLayerLast(wholeEspTagLumpOnTheRight, layers, true))) { // if this was closing of a standalone esp tag, terminate it and ping
            // it to the cb()

            if (token.type === "esp") {
              if (!token.end) {
                token.end = _i + (lengthOfClosingEspChunk || 0);
                token.value = str.slice(token.start, token.end);
              }

              if (!token.tailStartsAt) {
                token.tailStartsAt = _i;
              }

              if (!token.tailEndsAt && lengthOfClosingEspChunk) {
                token.tailEndsAt = token.tailStartsAt + lengthOfClosingEspChunk;
                token.tail = str.slice(_i, _i + lengthOfClosingEspChunk);
              }

              dumpCurrentToken(token, _i);
              tokenReset();
            } // pop the recorded layers, at this moment record of ESP chunk
            // will be lost:


            layers.length = 0;
          } else if ( // insurance against stray tails inside attributes:
          // <a b="{ x %}">
          //       ^   ^
          //       |   |
          //       |   we're here
          //       |
          //       |
          //     this opening bracket is incomplete
          //     and therefore not recognised as an opening
          //
          //
          // if ESP character lump we extracted, for example,
          // %} contains a closing character, in this case, a }
          attrib && attrib.attribValue && attrib.attribValue.length && attrib.attribValue[~-attrib.attribValue.length].start && Array.from(str.slice(attrib.attribValue[~-attrib.attribValue.length].start, _i)).some(function (char, idx) {
            return wholeEspTagLumpOnTheRight.includes(flipEspTag(char)) && ( // ensure it's not a false alarm, "notVeryEspChars"
            // bunch, for example, % or $ can be legit characters
            //
            // either it's from "veryEspChars" list so
            // it can be anywhere, not necessarily at the
            // beginning, for example, broken mailchimp:
            // <a b="some text | x *|">
            //                 ^
            //               this is
            //
            veryEspChars.includes(char) || // or that character must be the first character
            // of the attribute's value, for example:
            // <a b="% x %}">
            //       ^
            //     this
            //
            // because imagine false positive, legit %:
            // <a b="Real 5% discount! x %}">
            //             ^
            //    definitely not a part of broken opening {%
            //
            // it's zero'th index:
            !idx) && (disposableVar = {
              char: char,
              idx: idx
            });
          }) && // we're inside attribute
          token.type === "tag" && attrib && attrib.attribValueStartsAt && !attrib.attribValueEndsAt && // last attribute's value element is text-type
          // imagine, the { x from <a b="{ x %}"> would be
          // such unrecognised text:
          attrib.attribValue[~-attrib.attribValue.length] && attrib.attribValue[~-attrib.attribValue.length].type === "text") { // token does contain ESP tags, so it's not pure HTML

            token.pureHTML = false;
            var lastAttrValueObj = attrib.attribValue[~-attrib.attribValue.length]; // getNewToken() just creates a new token according
            // the latest (DRY) reference, it doesn't reset
            // the "token" unlike initToken()

            var newTokenToPutInstead = getNewToken("esp", lastAttrValueObj.start); // for remaining values, we need to consider, is there
            // text in front:
            //
            // <a b="{ x %}">
            // vs.
            // <a b="something { x %}">

            if (!disposableVar || !disposableVar.idx) {
              newTokenToPutInstead.head = disposableVar.char;
              newTokenToPutInstead.headStartsAt = lastAttrValueObj.start;
              newTokenToPutInstead.headEndsAt = newTokenToPutInstead.headStartsAt + 1;
              newTokenToPutInstead.tailStartsAt = _i;
              newTokenToPutInstead.tailEndsAt = _i + wholeEspTagLumpOnTheRight.length;
              newTokenToPutInstead.tail = wholeEspTagLumpOnTheRight;
              attrib.attribValue[~-attrib.attribValue.length] = newTokenToPutInstead;
            }
          } else { // If we've got an unclosed heads and here new heads are starting,
            // pop the last heads in layers - they will never be matched anyway.
            // Let parser/linter deal with it

            if (lastLayerIs("esp")) {
              layers.pop();
            } // if we're within a tag attribute, push the last esp token there


            if (attribToBackup) {
              if (!Array.isArray(attribToBackup.attribValue)) {
                attribToBackup.attribValue = [];
              }
              attribToBackup.attribValue.push(token);
            }
            layers.push({
              type: "esp",
              openingLump: wholeEspTagLumpOnTheRight,
              guessedClosingLump: flipEspTag(wholeEspTagLumpOnTheRight),
              position: _i
            }); // also, if it's a standalone ESP token, terminate the previous token
            // and start recording a new-one

            if (token.start !== null) {
              // it means token has already being recorded, we need to tackle it -
              // the new, ESP token is incoming!
              // we nest ESP tokens inside "tag" type attributes
              if (token.type === "tag") { // instead of dumping the tag token and starting a new-one,
                // save the parent token, then nest all ESP tags among attributes

                if (token.tagNameStartsAt && (!token.tagName || !token.tagNameEndsAt)) {
                  token.tagNameEndsAt = _i;
                  token.tagName = str.slice(token.tagNameStartsAt, _i);
                  token.recognised = isTagNameRecognised(token.tagName);
                }

                parentTokenToBackup = lodash_clonedeep(token);

                if (attrib.attribStarts && !attrib.attribEnds) {
                  attribToBackup = lodash_clonedeep(attrib);
                }
              } else if (!attribToBackup) {
                dumpCurrentToken(token, _i);
              } else if (attribToBackup && Array.isArray(attribToBackup.attribValue) && attribToBackup.attribValue.length && attribToBackup.attribValue[~-attribToBackup.attribValue.length].type === "esp" && !attribToBackup.attribValue[~-attribToBackup.attribValue.length].end) {
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].end = _i;
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].value = str.slice(attribToBackup.attribValue[~-attribToBackup.attribValue.length].start, _i);
              }
            } // now, either way, if parent tag was stashed in "parentTokenToBackup"
            // or if this is a new ESP token and there's nothing to nest,
            // let's initiate it:


            initToken("esp", _i);
            token.head = wholeEspTagLumpOnTheRight;
            token.headStartsAt = _i;
            token.headEndsAt = _i + wholeEspTagLumpOnTheRight.length; // toggle parentTokenToBackup.pureHTML

            if (parentTokenToBackup && parentTokenToBackup.pureHTML) {
              parentTokenToBackup.pureHTML = false;
            } // if text token has been initiated, imagine:
            //  "attribValue": [
            //     {
            //         "type": "text",
            //         "start": 6, <-------- after the initiation of this, we started ESP token at 6
            //         "end": null,
            //         "value": null
            //     },
            //     {
            //         "type": "esp",
            //         "start": 6, <-------- same start on real ESP token
            //           ...
            //  ],


            if (attribToBackup && Array.isArray(attribToBackup.attribValue) && attribToBackup.attribValue.length) {

              if (attribToBackup.attribValue[~-attribToBackup.attribValue.length].start === token.start) { // erase it from stash

                attribToBackup.attribValue.pop();
              } else if ( // if the "text" type object is the last in "attribValue" and
              // it's not closed, let's close it and calculate its value:
              attribToBackup.attribValue[~-attribToBackup.attribValue.length].type === "text" && !attribToBackup.attribValue[~-attribToBackup.attribValue.length].end) {
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].end = _i;
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].value = str.slice(attribToBackup.attribValue[~-attribToBackup.attribValue.length].start, _i);
              }
            }
          } // do nothing for the second and following characters from the lump


          doNothing = _i + (lengthOfClosingEspChunk || wholeEspTagLumpOnTheRight.length);
        }
      } else if (withinStyle && !withinStyleComment && str[_i] && str[_i].trim() && // insurance against rogue extra closing curlies:
      // .a{x}}
      // don't start new rule at closing curlie!
      !"{}".includes(str[_i]) && ( // if at rule starts right after <style>, if we're on "@"
      // for example:
      // <style>@media a {.b{c}}</style>
      // first the <style> tag token will be pushed and then tag object
      // reset and then, still at "@"
      !token.type || // or, there was whitespace and we started recording a text token
      // <style>  @media a {.b{c}}</style>
      //          ^
      //        we're here - look at the whitespace on the left.
      //
      ["text"].includes(token.type))) {
        // Text token inside styles can be either whitespace chunk
        // or rogue characters. In either case, inside styles, when
        // "withinStyle" is on, non-whitespace character terminates
        // this text token and "rule" token starts

        if (token.type) {
          dumpCurrentToken(token, _i);
        }

        initToken(str[_i] === "@" ? "at" : "rule", _i);
        token.left = lastNonWhitespaceCharAt;
        token.nested = layers.some(function (o) {
          return o.type === "at";
        });
      } else if (!token.type) {
        initToken("text", _i);
      }
    } // catch the end of a css property (with or without !important)
    // -------------------------------------------------------------------------

    /* istanbul ignore else */


    if (!doNothing && property && (property.valueStarts && !property.valueEnds && str[rightVal] !== "!" || property.importantStarts && !property.importantEnds) && str[rightVal] !== ";" && ( // either end of string was reached
    !str[_i] || // or it's a whitespace
    !str[_i].trim() || // or we reached the end of the attribute
    attrEndsAt(_i))) {
      /* istanbul ignore else */

      if (property.importantStarts && !property.importantEnds) {
        property.importantEnds = _i;
        property.important = str.slice(property.importantStarts, _i);
      }
      /* istanbul ignore else */


      if (property.valueStarts && !property.valueEnds) {
        property.valueEnds = _i;
        property.value = str.slice(property.valueStarts, _i);
      }
      /* istanbul ignore else */


      if (str[_i] === ";") {
        property.semi = _i;
        property.end = _i + 1;
      } else if (str[rightVal] === ";") {
        property.semi = rightVal;
        property.end = property.semi + 1;
      }

      if (!property.end) {
        property.end = _i;
      }

      pushProperty(property);
      propertyReset();
    } // catch the css property's semicolon
    // -------------------------------------------------------------------------


    if (!doNothing && property && property.start && !property.end && str[_i] === ";") {
      property.semi = _i;
      property.end = _i + 1;

      if (!property.propertyEnds) {
        property.propertyEnds = _i;
      }

      if (property.propertyStarts && property.propertyEnds && !property.property) {
        property.property = str.slice(property.propertyStarts, property.propertyEnds);
      }

      pushProperty(property);
      propertyReset();
    } // catch the start of css property's !important
    // -------------------------------------------------------------------------

    /* istanbul ignore else */


    if (!doNothing && property && property.valueEnds && !property.importantStarts && (str[_i] === "!" || isLatinLetter(str[_i])) && importantStartsRegexp.test(str.slice(_i))) {
      property.importantStarts = _i;
    } // catch the end of a css property's value
    // -------------------------------------------------------------------------

    /* istanbul ignore else */


    if (!doNothing && property && (property.valueStarts && !property.valueEnds || property.propertyEnds && !property.valueStarts && !rightVal) && str[_i] && (!str[_i].trim() || str[_i] === "!")) {

      if (property.valueStarts && !property.valueEnds) {
        property.valueEnds = _i;
        property.value = str.slice(property.valueStarts, _i);
      } // it depends what's on the right, is it !important (considering mangled)
      // <div style="float:left impotant">
      //                       ^
      //               we're here
      //
      // or a new property without semi:
      // <div style="float:left color:red">
      //                       ^
      //               we're here
      //
      // or spaced out semi:
      // <div style="float:left  ;">
      //                       ^
      //               we're here
      /* istanbul ignore else */

      if (str[_i] === "!") {
        property.importantStarts = _i;
      } else if (rightVal && str[rightVal] === "!" || importantStartsRegexp.test(str.slice(_i))) {
        property.importantStarts = right(str, _i);
      } else if (!rightVal || str[rightVal] !== ";") {
        property.end = left(str, _i + 1) + 1;
        pushProperty(property);
        propertyReset();
      }

      if (!property.start && str[_i] && !str[_i].trim()) {
        pushProperty({
          type: "text",
          start: _i,
          end: null,
          value: null
        });
      }
    } // catch the start of a css property's value
    // -------------------------------------------------------------------------

    /* istanbul ignore else */


    if (!doNothing && property && property.colon && !property.valueStarts && str[_i] && str[_i].trim()) {
      /* istanbul ignore else */

      if ( // stopper character met:
      ";}'\"".includes(str[_i]) && // either it's real closing quote or not a quote
      ifQuoteThenAttrClosingQuote(_i)) {
        /* istanbul ignore else */

        if (str[_i] === ";") {
          property.semi = _i;
        }

        var temp; // patch missing .end

        /* istanbul ignore else */

        if (!property.end) {
          property.end = property.semi ? property.semi + 1 : left(str, _i) + 1;
          temp = property.end;
        } // push and init and patch up to resume


        pushProperty(property);
        propertyReset(); // if there was a whitespace gap, submit it as text token

        /* istanbul ignore else */

        if (temp && temp < _i) {
          pushProperty({
            type: "text",
            start: temp,
            end: _i,
            value: str.slice(temp, _i)
          });
        }
      } else {
        property.valueStarts = _i;
      }
    } // catch the start of a css chunk
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "rule" && str[_i] && str[_i].trim() && !"{}".includes(str[_i]) && !selectorChunkStartedAt && !token.openingCurlyAt) {
      if (!",".includes(str[_i])) {
        selectorChunkStartedAt = _i;

        if (token.selectorsStart === null) {
          token.selectorsStart = _i;
        }
      } else {
        // this contraption is needed to catch commas and assign
        // correctly broken chunk range, [selectorsStart, selectorsEnd]
        token.selectorsEnd = _i + 1;
      }
    } // catch the end of a css property's name
    // -------------------------------------------------------------------------


    if (!doNothing && // token.type === "rule" &&
    property && property.propertyStarts && property.propertyStarts < _i && !property.propertyEnds && ( // end was reached
    !str[_i] || // or it's whitespace
    !str[_i].trim() || // or
    // it's not suitable
    !attrNameRegexp.test(str[_i]) && ( // and
    // it's a colon (clean code)
    // <div style="float:left;">z</div>
    //                  ^
    //          we're here
    //
    str[_i] === ":" || //
    // or
    //
    // <div style="float.:left;">z</div>
    //                  ^
    //                include this dot within property name
    //                so that we can catch it later validating prop names
    //
    !rightVal || !":/".includes(str[rightVal]))) && ( // also, regarding the slash,
    // <div style="//color: red;">
    //              ^
    //            don't close here, continue, gather "//color"
    //
    str[_i] !== "/" || str[_i - 1] !== "/")) {
      property.propertyEnds = _i;
      property.property = str.slice(property.propertyStarts, _i);

      if (property.valueStarts) {
        // it's needed to safeguard against case like:
        // <style>.a{b:c d:e;}</style>
        //                ^
        //            imagine we're here - valueStarts is not set!
        property.end = _i;
      } // missing colon and onwards:
      // <style>.b{c}</style>
      // <style>.b{c;d}</style>


      if ("};".includes(str[_i]) || // it's whitespace and it's not leading up to a colon
      str[_i] && !str[_i].trim() && str[rightVal] !== ":") {
        if (str[_i] === ";") {
          property.semi = _i;
        } // precaution against broken code:
        // .a{x}}
        //


        if (!property.end) {
          property.end = property.semi ? property.semi + 1 : _i;
        } // push and init and patch up to resume


        pushProperty(property);
        propertyReset();
      }
    } // catch the colon of a css property
    // -------------------------------------------------------------------------


    if (!doNothing && // we don't check for token.type === "rule" because inline css will use
    // these clauses too and token.type === "tag" there, but
    // attrib.attribName === "style"
    // on other hand, we don't need strict validation here either, to enter
    // these clauses it's enough that "property" was initiated.
    property && property.propertyEnds && !property.valueStarts && str[_i] === ":") {
      property.colon = _i;
    } // catch the start of a css property's name
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "rule" && str[_i] && str[_i].trim() && // let all the crap in, filter later:
    !"{};".includes(str[_i]) && // above is instead of a stricter clause:
    // attrNameRegexp.test(str[i]) &&
    //
    token.selectorsEnd && token.openingCurlyAt && !property.propertyStarts && !property.importantStarts) { // first, check maybe there's unfinished text token before it

      if (Array.isArray(token.properties) && token.properties.length && token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].end) {
        token.properties[~-token.properties.length].end = _i;
        token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, _i);
      } // in normal cases we're set propertyStarts but sometimes it can be
      // importantStarts, imagine:
      // <style>.a{color:red; !important;}
      //                      ^
      //                we're here
      //
      // we want to put "!important" under key "important", not under
      // "property"


      if (str[_i] === "!") {
        initProperty({
          start: _i,
          importantStarts: _i
        });
      } else {
        initProperty(_i);
      }
    } // catch the start a property
    // -------------------------------------------------------------------------
    // Mostly happens in dirty code cases - the start is normally being triggered
    // not from here, the first character, but earlier, from previous clauses.
    // But imagine <div style="float;left">z</div>
    //                              ^
    //                            wrong
    //
    // in case like above, "l" would not have the beginning of a property
    // triggered, hence this clause here


    if (!doNothing && // style attribute is being processed at the moment
    attrib && attrib.attribName === "style" && // it's not done yet
    attrib.attribOpeningQuoteAt && !attrib.attribClosingQuoteAt && // but property hasn't been initiated
    !property.propertyStarts && // yet the character is suitable:
    // it's not a whitespace
    str[_i] && str[_i].trim() && // it's not some separator
    !"'\";".includes(str[_i]) && // it's not inside CSS block comment
    !lastLayerIs("block")) { // It's either css comment or a css property.
      // Dirty characters go as property name, then later we validate and
      // catch them.
      // Empty space goes as text token, see separate clauses above.

      if ( // currently it's slash
      str[_i] === "/" && // asterisk follows, straight away or after whitespace
      str[rightVal] === "*") {
        attribPush({
          type: "comment",
          start: _i,
          end: rightVal + 1,
          value: str.slice(_i, rightVal + 1),
          closing: false,
          kind: "block",
          language: "css"
        }); // push a new layer, comment

        layers.push({
          type: "block",
          value: str.slice(_i, rightVal + 1),
          position: _i
        }); // skip the next char, consider there might be whitespace in front

        doNothing = rightVal + 1;
      } // if it's a closing comment
      else if (str[_i] === "*" && str[rightVal] === "/") {
          closingComment(_i);
        } else { // first, close the text token if it's not ended

          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = _i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, _i);
          } // initiate a property


          initProperty(_i);
        }
    } // in comment type, "only" kind tokens, submit square brackets to layers
    // -------------------------------------------------------------------------
    // ps. it's so that we can rule out greater-than signs


    if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
      if (str[_i] === "[") ;
    } // catch the ending of a token
    // -------------------------------------------------------------------------


    if (!doNothing) {
      if (token.type === "tag" && !layers.length && str[_i] === ">") {
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end); // at this point other attributes might be still not submitted yet,
        // we can't reset it here
      } else if (token.type === "comment" && token.language === "html" && !layers.length && token.kind === "simple" && (str[token.start] === "<" && str[_i] === "-" && (matchLeft(str, _i, "!-", {
        trimBeforeMatching: true
      }) || matchLeftIncl(str, _i, "!-", {
        trimBeforeMatching: true
      }) && str[_i + 1] !== "-") || str[token.start] === "-" && str[_i] === ">" && matchLeft(str, _i, "--", {
        trimBeforeMatching: true,
        maxMismatches: 1
      }))) {
        if (str[_i] === "-" && (matchRight(str, _i, ["[if", "(if", "{if"], {
          i: true,
          trimBeforeMatching: true
        }) || matchRight(str, _i, ["if"], {
          i: true,
          trimBeforeMatching: true
        }) && ( // the following case will assume closing sq. bracket is present
        xBeforeYOnTheRight$1(str, _i, "]", ">") || // in case there are no brackets leading up to "mso" (which must exist)
        str.includes("mso", _i) && !str.slice(_i, str.indexOf("mso")).includes("<") && !str.slice(_i, str.indexOf("mso")).includes(">")))) {
          // don't set the token's end, leave it open until the
          // closing bracket, for example, it might be:
          // <!--[if gte mso 9]>
          //     ^
          //    we're here
          //
          token.kind = "only";
        } else if ( // ensure it's not starting with closing counterpart,
        // --><![endif]-->
        // but with
        // <!--<![endif]-->
        str[token.start] !== "-" && matchRightIncl(str, _i, ["-<![endif"], {
          i: true,
          trimBeforeMatching: true,
          maxMismatches: 2
        })) {
          // don't set the token's end, leave it open until the
          // closing bracket, for example, it might be:
          // <!--<![endif]-->
          //     ^
          //    we're here
          //
          token.kind = "not";
          token.closing = true;
        } else if (token.kind === "simple" && token.language === "html" && !token.closing && str[rightVal] === ">") {
          token.end = rightVal + 1;
          token.kind = "simplet";
          token.closing = null;
        } else if (token.language === "html") {
          // if it's a simple HTML comment, <!--, end it right here
          token.end = _i + 1; // tokenizer will catch <!- as opening, so we need to extend
          // for correct cases with two dashes <!--

          if (str[leftVal] === "!" && str[rightVal] === "-") {
            token.end = rightVal + 1;
          }

          token.value = str.slice(token.start, token.end);
        } // at this point other attributes might be still not submitted yet,
        // we can't reset it here

      } else if (token.type === "comment" && token.language === "html" && str[_i] === ">" && (!layers.length || str[rightVal] === "<")) {
        // if last layer was for square bracket, this means closing
        // counterpart is missing so we need to remove it now
        // because it's the ending of the tag ("only" kind) or
        // at least the first part of it ("not" kind)
        if (Array.isArray(layers) && layers.length && layers[~-layers.length].value === "[") {
          layers.pop();
        } // the difference between opening Outlook conditional comment "only"
        // and conditional "only not" is that <!--> follows


        if (!["simplet", "not"].includes(token.kind) && matchRight(str, _i, ["<!-->", "<!---->"], {
          trimBeforeMatching: true,
          maxMismatches: 1,
          lastMustMatch: true
        })) {
          token.kind = "not";
        } else {
          token.end = _i + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (token.type === "comment" && token.language === "css" && str[_i] === "*" && str[_i + 1] === "/") {
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end);
      } else if (token.type === "esp" && token.end === null && typeof token.head === "string" && typeof token.tail === "string" && token.tail.includes(str[_i])) { // extract the whole lump of ESP tag characters:

        var wholeEspTagClosing = "";

        for (var _y = _i; _y < len; _y++) {
          if (espChars.includes(str[_y])) {
            wholeEspTagClosing += str[_y];
          } else {
            break;
          }
        } // now, imagine the new heads start, for example,
        // {%- z -%}{%-
        //       ^
        //   we're here
        // find the breaking point where tails end

        if (wholeEspTagClosing.length > token.head.length) { // in order for this to be tails + new heads, the total length should be
          // at least bigger than heads.
          //
          // For example: Responsys heads: $( - 2 chars. Tails = ) - 1 char.
          // Responsys total of closing tail + head - )$( - 3 chars.
          // That's more than head, 2 chars.
          //
          // For example, eDialog heads: _ - 1 char. Tails: __ - 2 chars.
          // eDialog total of closing tail +  head = 3 chars.
          // That's more than head, 1 char.
          //
          // And same applies to Nujnucks, even considering mix of diferent
          // heads.
          //
          // Another important point - first character in ESP literals.
          // Even if there are different types of literals, more often than not
          // first character is constant. Variations are often inside of
          // the literals pair - for example Nunjucks {{ and {% and {%-
          // the first character is always the same.
          //

          var headsFirstChar = token.head[0];

          if (wholeEspTagClosing.endsWith(token.head)) { // we have a situation like
            // zzz *|aaaa|**|bbb|*
            //           ^
            //         we're here and we extracted a chunk |**| and we're
            //         trying to split it into two.
            //
            // by the way, that's very lucky because node.heads (opening *| above)
            // is confirmed - we passed those heads and we know they are exact.
            // Now, our chunk ends with exactly the same new heads.
            // The only consideration is error scenario, heads intead of tails.
            // That's why we'll check, tags excluded, that's the length left:
            // |**| minus heads *| equals |* -- length 2 -- happy days.
            // Bad scenario:
            // *|aaaa*|bbb|*
            //       ^
            //      we're here
            //
            // *| minus heads *| -- length 0 -- raise an error!

            token.end = _i + wholeEspTagClosing.length - token.head.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = _i + token.tail.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (!token.tail.includes(headsFirstChar) && wholeEspTagClosing.includes(headsFirstChar) || wholeEspTagClosing.endsWith(token.head) || wholeEspTagClosing.startsWith(token.tail)) { // We're very lucky because heads and tails are using different
            // characters, possibly opposite brackets of some kind.
            // That's Nunjucks, Responsys (but no eDialog) patterns.

            var firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(0, wholeEspTagClosing.indexOf(headsFirstChar));
            var secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(wholeEspTagClosing.indexOf(headsFirstChar)); // imagine we sliced off (Nunjucks): -%}{%-
            // if every character from anticipated tails (-%}) is present in the front
            // chunk, Bob's your uncle, that's tails with new heads following.

            if (firstPartOfWholeEspTagClosing.length && secondPartOfWholeEspTagClosing.length && token.tail.split("").every(function (char) {
              return firstPartOfWholeEspTagClosing.includes(char);
            })) {
              token.end = _i + firstPartOfWholeEspTagClosing.length;
              token.value = str.slice(token.start, token.end);
              doNothing = token.end;
            }
          } else {
            // so heads and tails don't contain unique character, and more so,
            // starting-one, PLUS, second set is different.
            // For example, ESP heads/tails can be *|zzz|*
            // Imaginary example, following heads would be variation of those
            // above, ^|zzz|^ // TODO
            // for now, return defaults, from else scenario below:
            // we consider this whole chunk is tails.

            token.end = _i + wholeEspTagClosing.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          }
        } else {
          // we consider this whole chunk is tails.
          token.end = _i + wholeEspTagClosing.length;
          token.value = str.slice(token.start, token.end); // if last layer is ESP tag and we've got its closing, pop the layer

          if (lastLayerIs("esp")) {
            layers.pop();
          }

          doNothing = token.end;
        }
      } // END OF if (!doNothing)

    } // Catch the end of a tag name
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "tag" && token.tagNameStartsAt && !token.tagNameEndsAt) { // tag names can be with numbers, h1

      if (!str[_i] || !charSuitableForTagName(str[_i])) {
        token.tagNameEndsAt = _i;
        token.tagName = str.slice(token.tagNameStartsAt, _i).toLowerCase();

        if (token.tagName === "xml" && token.closing && !token.kind) {
          token.kind = "xml";
        } // We evaluate self-closing tags not by presence of slash but evaluating
        // is the tag name among known self-closing tags. This way, we can later
        // catch and fix missing closing slashes.


        if (voidTags.includes(token.tagName)) {
          token.void = true;
        }

        token.recognised = isTagNameRecognised(token.tagName);
      }
    } // Catch the start of a tag name:
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "tag" && !token.tagNameStartsAt && token.start != null && (token.start < _i || str[token.start] !== "<")) { // MULTIPLE ENTRY!
      // Consider closing tag's slashes and tag name itself.

      if (str[_i] === "/") {
        token.closing = true;
      } else if (isLatinLetter(str[_i])) {
        token.tagNameStartsAt = _i; // if by now closing marker is still null, set it to false - there
        // won't be any closing slashes between opening bracket and tag name

        if (!token.closing) {
          token.closing = false;
        }
      } else ;
    } // catch the end of a tag attribute's name
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "tag" && token.kind !== "cdata" && attrib.attribNameStartsAt && _i > attrib.attribNameStartsAt && attrib.attribNameEndsAt === null && !isAttrNameChar(str[_i])) {
      attrib.attribNameEndsAt = _i;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, _i);
      attrib.attribNameRecognised = allHtmlAttribs.has(attrib.attribName);

      if (attrib.attribName.startsWith("mc:")) {
        // that's a mailchimp attribute
        token.pureHTML = false;
      } // maybe there's a space in front of equal, <div class= "">

      if (str[_i] && !str[_i].trim() && str[rightVal] === "=") ; else if (str[_i] && !str[_i].trim() || str[_i] === ">" || str[_i] === "/" && str[rightVal] === ">") {
        if ("'\"".includes(str[rightVal])) ; else {
          attrib.attribEnds = _i; // push and wipe
          token.attribs.push(lodash_clonedeep(attrib));
          attribReset();
        }
      }
    } // catch the start of a tag attribute's name
    // -------------------------------------------------------------------------


    if (!doNothing && str[_i] && token.type === "tag" && token.kind !== "cdata" && token.tagNameEndsAt && _i > token.tagNameEndsAt && attrib.attribStarts === null && isAttrNameChar(str[_i])) {
      attrib.attribStarts = _i; // even though in theory left() which reports first non-whitespace
      // character's index on the left can be null, it does not happen
      // in this context - there will be tag's name or something in front!

      attrib.attribLeft = lastNonWhitespaceCharAt;
      attrib.attribNameStartsAt = _i;
    } // catch the curlies inside CSS rule
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "rule") {
      if (str[_i] === "{" && !token.openingCurlyAt) {
        token.openingCurlyAt = _i;
      } else if (str[_i] === "}" && token.openingCurlyAt && !token.closingCurlyAt) {
        token.closingCurlyAt = _i;
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end); // check is the property's last text token closed:

        if (Array.isArray(token.properties) && token.properties.length && token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].end) {
          token.properties[~-token.properties.length].end = _i;
          token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, _i);
        }
        pingTagCb(token); // if it's a "rule" token and a parent "at" rule is pending in layers,
        // also put this "rule" into that parent in layers

        if (lastLayerIs("at")) {
          layers[~-layers.length].token.rules.push(token);
        }
        tokenReset();
      }
    } // catch the ending of a attribute sub-token value
    // -------------------------------------------------------------------------


    if (!doNothing && attrib.attribName && Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
      // TODO // if it's a closing comment

      if (str[_i] === "*" && str[rightVal] === "/") {
        closingComment(_i);
      }
    } // catch the beginning of a attribute sub-token value
    // -------------------------------------------------------------------------


    if ( // EITHER IT'S INLINE CSS:
    !doNothing && // attribute has been recording
    attrib && // and it's not finished
    attrib.attribValueStartsAt && !attrib.attribValueEndsAt && // and its property hasn't been recording
    !property.propertyStarts && // we're inside the value
    _i >= attrib.attribValueStartsAt && // if attribValue array is empty, no object has been placed yet,
    Array.isArray(attrib.attribValue) && (!attrib.attribValue.length || // or there is one but it's got ending (prevention from submitting
    // another text type object on top, before previous has been closed)
    attrib.attribValue[~-attrib.attribValue.length].end && // and that end is less than current index i
    attrib.attribValue[~-attrib.attribValue.length].end <= _i) || // OR IT'S HEAD CSS
    !doNothing && // css rule token has been recording
    token.type === "rule" && // token started:
    token.openingCurlyAt && // but not ended:
    !token.closingCurlyAt && // there is no unfinished property being recorded
    !property.propertyStarts) { // if it's suitable for property, start a property
      // if it's whitespace, for example,
      // <a style="  /* zzz */color: red;  ">
      //           ^
      //         this
      //
      // rogue text will go as property, for example:
      //
      // <a style="  z color: red;  ">

      if ( // whitespace is automatically text token
      str[_i] && !str[_i].trim() || // if comment layer has been started, it's also a text token, no matter even
      // if it's a property, because it's comment's contents.
      lastLayerIs("block")) { // depends where to push, is it inline css or head css rule

        if (attrib.attribName) {
          attrib.attribValue.push({
            type: "text",
            start: _i,
            end: null,
            value: null
          });
        } else if (token.type === "rule" && ( // we don't want to push over the properties in-progress
        !Array.isArray(token.properties) || !token.properties.length || // last property should have ended
        token.properties[~-token.properties.length].end)) {
          token.properties.push({
            type: "text",
            start: _i,
            end: null,
            value: null
          });
        }
      }
    } // Catch the end of a tag attribute's value:
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "tag" && attrib.attribValueStartsAt && _i >= attrib.attribValueStartsAt && attrib.attribValueEndsAt === null) {

      if (SOMEQUOTE.includes(str[_i])) { // const R1 = !layers.some((layerObj) => layerObj.type === "esp");
        // const R2 = isAttrClosing(
        //   str,
        //   attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt,
        //   i
        // );
        // console.log(
        //   `${`\u001b[${33}m${`R1`}\u001b[${39}m`} = ${`\u001b[${
        //     R1 ? 32 : 31
        //   }m${R1}\u001b[${39}m`}`
        // );
        // console.log(
        //   `${`\u001b[${33}m${`R2`}\u001b[${39}m`} = ${`\u001b[${
        //     R2 ? 32 : 31
        //   }m${R2}\u001b[${39}m`}`
        // );

        if ( // so we're on a single/double quote,
        // (str[i], the current character is a quote)
        // and...
        // we're not inside some ESP tag - ESP layers are not pending:
        !layers.some(function (layerObj) {
          return layerObj.type === "esp";
        }) && ( // and the current character passed the
        // attribute closing quote validation by
        // "is-html-attribute-closing"
        //
        // the isAttrClosing() api is the following:
        // 1. str, 2. opening quotes index, 3. suspected
        // character for attribute closing (quotes typically,
        // but can be mismatching)...
        // see the package "is-html-attribute-closing" on npm:
        //
        //
        // either end was reached,
        !str[_i] || // or there is no closing bracket further
        !str.includes(">", _i) || // further checks confirm it looks like legit closing
        isAttrClosing(str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, _i))) {
          attrib.attribClosingQuoteAt = _i;
          attrib.attribValueEndsAt = _i;

          if (attrib.attribValueStartsAt) {
            attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, _i);
          }

          attrib.attribEnds = _i + 1;

          if (property.propertyStarts) {
            attrib.attribValue.push(lodash_clonedeep(property));
            propertyReset();
          }

          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) { // if it's not a property (of inline style), set its "end"

            if (!attrib.attribValue[~-attrib.attribValue.length].property) {
              attrib.attribValue[~-attrib.attribValue.length].end = _i;
              attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, _i);
            }
          } // 2. if the pair was mismatching, wipe layers' last element

          if (str[attrib.attribOpeningQuoteAt] !== str[_i]) {
            layers.pop();
            layers.pop();
          } // 3. last check for the last attribValue's .end - in some broken code
          // cases it might be still null:
          // <div style="float:left;x">
          //                         ^
          //                       we're here


          if (attrib.attribValue[~-attrib.attribValue.length] && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = _i;
          } // 4. push and wipe
          token.attribs.push(lodash_clonedeep(attrib));
          attribReset();
        } else if ((!Array.isArray(attrib.attribValue) || !attrib.attribValue.length || // last attrib value should not be a text token
        attrib.attribValue[~-attrib.attribValue.length].type !== "text") && !property.propertyStarts) {
          // quotes not matched, so it's unencoded, raw quote, part of the value
          // for example
          // <table width=""100">
          //               ^
          //            rogue quote
          // let's initiate a next token
          attrib.attribValue.push({
            type: "text",
            start: _i,
            end: null,
            value: null
          });
        }
      } else if (attrib.attribOpeningQuoteAt === null && (str[_i] && !str[_i].trim() || ["/", ">"].includes(str[_i]) || espChars.includes(str[_i]) && espChars.includes(str[_i + 1]))) {
        // ^ either whitespace or tag's closing or ESP literal's start ends
        // the attribute's value if there are no quotes
        attrib.attribValueEndsAt = _i;
        attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, _i);

        if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
          attrib.attribValue[~-attrib.attribValue.length].end = _i;
          attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, attrib.attribValue[~-attrib.attribValue.length].end);
        }

        attrib.attribEnds = _i; // 2. push and wipe

        token.attribs.push(lodash_clonedeep(attrib));
        attribReset(); // 3. pop layers

        layers.pop(); // 4. tackle the tag ending

        if (str[_i] === ">") {
          token.end = _i + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (str[_i] === "=" && leftVal !== null && rightVal && ("'\"".includes(str[rightVal]) || str[~-_i] && isLatinLetter(str[~-_i])) && // this will catch url params like
      // <img src="https://z.png?query=" />
      //                              ^
      //                            false alarm
      //
      // let's exclude anything URL-related
      !(attrib && attrib.attribOpeningQuoteAt && ( // check for presence of slash, /
      /\//.test(str.slice(attrib.attribOpeningQuoteAt + 1, _i)) || // check for mailto:
      /mailto:/.test(str.slice(attrib.attribOpeningQuoteAt + 1, _i)) || // check for /\w?\w/ like
      // <img src="codsen.com?query=" />
      //                     ^
      /\w\?\w/.test(str.slice(attrib.attribOpeningQuoteAt + 1, _i))))) { // all depends, are there whitespace characters:
        // imagine
        // <a href="border="0">
        // vs
        // <a href="xyz border="0">
        // that's two different cases - there's nothing to salvage in former!
        var whitespaceFound;
        var attribClosingQuoteAt;

        for (var _y2 = leftVal; _y2 >= attrib.attribValueStartsAt; _y2--) { // catch where whitespace starts

          if (!whitespaceFound && str[_y2] && !str[_y2].trim()) {
            whitespaceFound = true;

            if (attribClosingQuoteAt) {
              // slice the captured chunk
              str.slice(_y2, attribClosingQuoteAt);
            }
          } // where that caught whitespace ends, that's the default location
          // of double quotes.
          // <a href="xyz border="0">
          //            ^        ^
          //            |        |
          //            |   we go from here
          //         to here


          if (whitespaceFound && str[_y2] && str[_y2].trim()) {
            whitespaceFound = false;

            if (!attribClosingQuoteAt) {
              // that's the first, default location
              attribClosingQuoteAt = _y2 + 1;
            }
          }
        }

        if (attribClosingQuoteAt) {
          attrib.attribValueEndsAt = attribClosingQuoteAt;

          if (attrib.attribValueStartsAt) {
            attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, attribClosingQuoteAt);

            if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
              attrib.attribValue[~-attrib.attribValue.length].end = attrib.attribValueEndsAt;
              attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, attrib.attribValueEndsAt);
            }
          }

          attrib.attribEnds = attribClosingQuoteAt; // 2. if the pair was mismatching, wipe layers' last element

          if (str[attrib.attribOpeningQuoteAt] !== str[_i]) {
            layers.pop();
          } // 3. push and wipe


          token.attribs.push(lodash_clonedeep(attrib));
          attribReset(); // 4. pull the i back to the position where the attribute ends

          _i = ~-attribClosingQuoteAt;
          i = _i;
          return "continue";
        } else if (attrib.attribOpeningQuoteAt && ("'\"".includes(str[rightVal]) || allHtmlAttribs.has(str.slice(attrib.attribOpeningQuoteAt + 1, _i).trim()))) {
          // worst case scenario:
          // <span width="height="100">
          //
          // traversing back from second "=" we hit only the beginning of an
          // attribute, there was nothing to salvage.
          // In this case, reset the attribute's calculation, go backwards to "h".
          // 1. pull back the index, go backwards, read this new attribute again
          _i = attrib.attribOpeningQuoteAt; // 2. end the attribute

          attrib.attribEnds = attrib.attribOpeningQuoteAt + 1; // 3. value doesn't start, this needs correction

          attrib.attribValueStartsAt = null; // 4. pop the opening quotes layer

          layers.pop(); // 5. push and wipe

          token.attribs.push(lodash_clonedeep(attrib));
          attribReset(); // 6. continue
          i = _i;
          return "continue";
        }
      } else if (attrib && attrib.attribName !== "style" && attrib.attribStarts && !attrib.attribEnds && !property.propertyStarts && ( //
      // AND,
      //
      // either there are no attributes recorded under attrib.attribValue:
      !Array.isArray(attrib.attribValue) || // or it's array but empty:
      !attrib.attribValue.length || // or is it not empty but its last attrib has ended by now
      attrib.attribValue[~-attrib.attribValue.length].end && attrib.attribValue[~-attrib.attribValue.length].end <= _i)) {
        attrib.attribValue.push({
          type: "text",
          start: _i,
          end: null,
          value: null
        });
      }
    } else if (token.type === "esp" && attribToBackup && parentTokenToBackup && attribToBackup.attribOpeningQuoteAt && attribToBackup.attribValueStartsAt && "'\"".includes(str[_i]) && str[attribToBackup.attribOpeningQuoteAt] === str[_i] && isAttrClosing(str, attribToBackup.attribOpeningQuoteAt, _i)) { // imagine unclosed ESP tag inside attr value:
      // <tr class="{% x">
      //                ^
      //             we're here
      // we need to still proactively look for closing attribute quotes,
      // even inside ESP tags, if we're inside tag attributes // 1. patch up missing token (which is type="esp" currently) values

      token.end = _i;
      token.value = str.slice(token.start, _i); // 2. push token into attribToBackup.attribValue

      if (attribToBackup && !Array.isArray(attribToBackup.attribValue)) {
        attribToBackup.attribValue = [];
      }
      attribToBackup.attribValue.push(token); // 3. patch up missing values in attribToBackup

      attribToBackup.attribValueEndsAt = _i;
      attribToBackup.attribValueRaw = str.slice(attribToBackup.attribValueStartsAt, _i);
      attribToBackup.attribClosingQuoteAt = _i;
      attribToBackup.attribEnds = _i + 1; // 4. restore parent token

      token = lodash_clonedeep(parentTokenToBackup);
      token.attribs.push(attribToBackup); // 5. reset all

      attribToBackup = undefined;
      parentTokenToBackup = undefined; // 6. pop the last 3 layers
      // currently layers array should be like:
      // [
      //   {
      //     "type": "simple",
      //     "value": '"',
      //     "position": 10
      //   },
      //   {
      //     "type": "esp",
      //     "openingLump": "{%",
      //     "guessedClosingLump": "%}",
      //     "position": 11
      //   }
      //   {
      //     "type": "simple",
      //     "value": '"',
      //     "position": 15
      //   },
      // ]

      layers.pop();
      layers.pop();
      layers.pop();
    } // Catch the start of a tag attribute's value:
    // -------------------------------------------------------------------------


    if (!doNothing && token.type === "tag" && !attrib.attribValueStartsAt && attrib.attribNameEndsAt && attrib.attribNameEndsAt <= _i && str[_i] && str[_i].trim()) {

      if (str[_i] === "=" && !SOMEQUOTE.includes(str[rightVal]) && !"=".includes(str[rightVal]) && !espChars.includes(str[rightVal]) // it might be an ESP literal
      ) {
          // find the index of the next quote, single or double
          var firstQuoteOnTheRightIdx = SOMEQUOTE.split("").map(function (quote) {
            return str.indexOf(quote, rightVal);
          }).filter(function (val) {
            return val > 0;
          }).length ? Math.min.apply(Math, SOMEQUOTE.split("").map(function (quote) {
            return str.indexOf(quote, rightVal);
          }).filter(function (val) {
            return val > 0;
          })) : undefined; // catch attribute name - equal - attribute name - equal
          // <span width=height=100>

          if ( // there is a character on the right (otherwise value would be null)
          rightVal && // there is equal character in the remaining chunk
          str.slice(rightVal).includes("=") && // characters upto first equals form a known attribute value
          allHtmlAttribs.has(str.slice(rightVal, rightVal + str.slice(rightVal).indexOf("=")).trim().toLowerCase())) { // we have something like:
            // <span width=height=100>
            // 1. end the attribute

            attrib.attribEnds = _i + 1; // 2. push and wipe
            token.attribs.push(_objectSpread2({}, attrib));
            attribReset();
          } else if ( // try to stop this clause:
          //
          // if there are no quotes in the remaining string
          !firstQuoteOnTheRightIdx || // there is one but there are equal character between here and its location
          str.slice(rightVal, firstQuoteOnTheRightIdx).includes("=") || // if there is no second quote of that type in the remaining string
          !str.includes(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1) || // if string slice from quote to quote includes equal or brackets
          Array.from(str.slice(firstQuoteOnTheRightIdx + 1, str.indexOf(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1))).some(function (char) {
            return "<>=".includes(char);
          })) { // case of missing opening quotes

            attrib.attribValueStartsAt = rightVal; // push missing entry into layers

            layers.push({
              type: "simple",
              value: null,
              position: attrib.attribValueStartsAt
            });
          }
        } else if (SOMEQUOTE.includes(str[_i])) {
        // maybe it's <span width='"100"> and it's a false opening quote, '
        var nextCharIdx = rightVal;

        if ( // a non-whitespace character exists on the right of index i
        nextCharIdx && // if it is a quote character
        SOMEQUOTE.includes(str[nextCharIdx]) && // but opposite kind,
        str[_i] !== str[nextCharIdx] && // and string is long enough
        str.length > nextCharIdx + 2 && // and remaining string contains that quote like the one on the right
        str.slice(nextCharIdx + 1).includes(str[nextCharIdx]) && ( // and to the right of it we don't have str[i] quote,
        // case: <span width="'100'">
        !str.indexOf(str[nextCharIdx], nextCharIdx + 1) || !right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1)) || str[_i] !== str[right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1))]) && // and that slice does not contain equal or brackets or quote of other kind
        !Array.from(str.slice(nextCharIdx + 1, str.indexOf(str[nextCharIdx]))).some(function (char) {
          return ("<>=" + str[_i]).includes(char);
        })) { // pop the layers

          layers.pop();
        } else {
          // OK then...
          // has the quotes started (it's closing quote) or it's the opening quote?

          /* eslint no-lonely-if: "off" */
          if (!attrib.attribOpeningQuoteAt) {
            attrib.attribOpeningQuoteAt = _i;

            if ( // character exists on the right
            str[_i + 1] && ( // EITHER it's not the same as opening quote we're currently on
            str[_i + 1] !== str[_i] || // OR it's a rogue quote, part of the value
            !ifQuoteThenAttrClosingQuote(_i + 1))) {
              attrib.attribValueStartsAt = _i + 1;
            }
          } else {
            // One quote exists.
            // <table width="100">
            //                  ^
            //

            /* istanbul ignore else */
            if (isAttrClosing(str, attrib.attribOpeningQuoteAt, _i)) {
              attrib.attribClosingQuoteAt = _i;
            }
            /* istanbul ignore else */


            if (attrib.attribOpeningQuoteAt && attrib.attribClosingQuoteAt) {
              if (attrib.attribOpeningQuoteAt < ~-attrib.attribClosingQuoteAt) {
                attrib.attribValueRaw = str.slice(attrib.attribOpeningQuoteAt + 1, attrib.attribClosingQuoteAt);
              } else {
                attrib.attribValueRaw = "";
              }

              attrib.attribEnds = _i + 1; // push and wipe
              token.attribs.push(lodash_clonedeep(attrib));
              attribReset();
            }
          }
        }
      } // else - value we assume does not start

    } //
    //
    //
    //
    //
    //                       "PARSING" ERROR CLAUSES
    //                       ███████████████████████
    //
    //
    //
    //
    //
    // Catch raw closing brackets inside attribute's contents, maybe they
    // mean the tag ending and maybe the closing quotes are missing?


    if (!doNothing && str[_i] === ">" && // consider ERB templating tags like <%= @p1 %>
    str[_i - 1] !== "%" && token.type === "tag" && attrib.attribStarts && !attrib.attribEnds) { // Idea is simple: we have to situations:
      // 1. this closing bracket is real, closing bracket
      // 2. this closing bracket is unencoded raw text
      // Now, we need to distinguish these two cases.
      // It's easiest done traversing right until the next closing bracket.
      // If it's case #1, we'll likely encounter a new tag opening (or nothing).
      // If it's case #2, we'll likely encounter a tag closing or attribute
      // combo's equal+quote

      var thisIsRealEnding = false;

      if (str[_i + 1]) {
        // Traverse then
        for (var _y3 = _i + 1; _y3 < len; _y3++) { // if we reach the closing counterpart of the quotes, terminate

          if (attrib.attribOpeningQuoteAt && str[_y3] === str[attrib.attribOpeningQuoteAt]) {

            if (_y3 !== _i + 1 && str[~-_y3] !== "=") {
              thisIsRealEnding = true;
            }

            break;
          } else if (str[_y3] === ">") {
            // must be real tag closing, we just tackle missing quotes
            // TODO - missing closing quotes
            break;
          } else if (str[_y3] === "<") {
            thisIsRealEnding = true; // TODO - pop only if type === "simple" and it's the same opening
            // quotes of this attribute

            layers.pop();
            break;
          } else if (!str[_y3 + 1]) {
            // if end was reached and nothing caught, that's also positive sign
            thisIsRealEnding = true;
            break;
          }
        }
      } else {
        thisIsRealEnding = true;
      } //
      //
      //
      // FINALLY,
      //
      //
      //
      // if "thisIsRealEnding" was set to "true", terminate the tag here.


      if (thisIsRealEnding) {
        token.end = _i + 1;
        token.value = str.slice(token.start, token.end); // set and push the attribute's records, just closing quote will be
        // null and possibly value too

        if (attrib.attribValueStartsAt && _i && attrib.attribValueStartsAt < _i && str.slice(attrib.attribValueStartsAt, _i).trim()) {
          attrib.attribValueEndsAt = _i;
          attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, _i);

          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = _i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, _i);
          } // otherwise, nulls stay

        } else {
          attrib.attribValueStartsAt = null;
        }

        if (attrib.attribEnds === null) {
          attrib.attribEnds = _i;
        }

        if (attrib) {
          // 2. push and wipe
          token.attribs.push(lodash_clonedeep(attrib));
          attribReset();
        }
      }
    } //
    //
    //
    //
    //                               BOTTOM
    //                               ██████
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // ping charCb
    // -------------------------------------------------------------------------


    if (str[_i] && opts.charCb) {
      pingCharCb({
        type: token.type,
        chr: str[_i],
        i: _i
      });
    } //
    //
    //
    //
    //
    //
    //
    // catch end of the string
    // -------------------------------------------------------------------------
    // notice there's no "doNothing"


    if (!str[_i] && token.start !== null) {
      token.end = _i;
      token.value = str.slice(token.start, token.end); // if there is unfinished "attrib" object, submit it
      // as is, that's abruptly ended attribute

      if (attrib && attrib.attribName) { // push and wipe // patch the attr ending if it's missing

        if (!attrib.attribEnds) {
          attrib.attribEnds = _i;
        }

        token.attribs.push(_objectSpread2({}, attrib));
        attribReset();
      } // if there was an unfinished CSS property, finish it


      if (token && Array.isArray(token.properties) && token.properties.length && !token.properties[~-token.properties.length].end) {
        token.properties[~-token.properties.length].end = _i;

        if (token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].value) {
          token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, _i);
        }
      } // if there is unfinished css property that has been
      // recording, end it and push it as is. That's an
      // abruptly ended css chunk.


      if (property && property.propertyStarts) {
        // patch property.end
        if (!property.end) {
          property.end = _i;
        }

        pushProperty(property);
        propertyReset();
      }
      pingTagCb(token);
    } //
    //
    //
    //
    //
    //
    //
    // Record last non-whitespace character
    // -------------------------------------------------------------------------


    if (str[_i] && str[_i].trim()) {
      lastNonWhitespaceCharAt = _i;
    } //
    //
    //
    //
    //
    //
    //
    // logging:
    // -------------------------------------------------------------------------
    i = _i;
  };

  for (var i = 0; i <= len; i++) {
    var _ret = _loop(i);

    if (_ret === "continue") continue;
  } //
  // finally, clear stashes
  //


  if (charStash.length) {

    for (var _i2 = 0, len2 = charStash.length; _i2 < len2; _i2++) {
      reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
    }
  }

  if (tagStash.length) {

    for (var _i3 = 0, _len = tagStash.length; _i3 < _len; _i3++) {
      reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
    }
  } // return stats


  var timeTakenInMilliseconds = Date.now() - start;
  return {
    timeTakenInMilliseconds: timeTakenInMilliseconds
  };
} // -----------------------------------------------------------------------------
// export some util functions for testing purposes because sources are in TS
// and unit test runners can't read TS


var util = {
  matchLayerLast: matchLayerLast
};

exports.defaults = defaults$1;
exports.tokenizer = tokenizer;
exports.util = util;
exports.version = version$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
