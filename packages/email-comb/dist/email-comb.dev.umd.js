/**
 * @name email-comb
 * @fileoverview Remove unused CSS from email templates
 * @version 5.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/email-comb/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.emailComb = {}));
}(this, (function (exports) { 'use strict';

/**
 * @name arrayiffy-if-string
 * @fileoverview Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * @version 3.13.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/arrayiffy-if-string/}
 */

function arrayiffy(something) {
  if (typeof something === "string") {
    if (something.length) {
      return [something];
    }
    return [];
  }
  return something;
}

/**
 * @name string-match-left-right
 * @fileoverview Match substrings on the left or right of a given index, ignoring whitespace
 * @version 7.0.10
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-match-left-right/}
 */

function isObj$1(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
function isStr$2(something) {
  return typeof something === "string";
}
const defaults$6 = {
  cb: undefined,
  i: false,
  trimBeforeMatching: false,
  trimCharsBeforeMatching: [],
  maxMismatches: 0,
  firstMustMatch: false,
  lastMustMatch: false,
  hungry: false
};
const defaultGetNextIdx = index => index + 1;
function march(str, position, whatToMatchVal, originalOpts, special = false, getNextIdx = defaultGetNextIdx) {
  const whatToMatchValVal = typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal;
  if (+position < 0 && special && whatToMatchValVal === "EOL") {
    return whatToMatchValVal;
  }
  const opts = { ...defaults$6,
    ...originalOpts
  };
  if (position >= str.length && !special) {
    return false;
  }
  let charsToCheckCount = special ? 1 : whatToMatchVal.length;
  let charsMatchedTotal = 0;
  let patienceReducedBeforeFirstMatch = false;
  let lastWasMismatched = false;
  let atLeastSomethingWasMatched = false;
  let patience = opts.maxMismatches;
  let i = position;
  let somethingFound = false;
  let firstCharacterMatched = false;
  let lastCharacterMatched = false;
  function whitespaceInFrontOfFirstChar() {
    return (
      charsMatchedTotal === 1 &&
      patience < opts.maxMismatches - 1
    );
  }
  while (str[i]) {
    const nextIdx = getNextIdx(i);
    if (opts.trimBeforeMatching && str[i].trim() === "") {
      if (!str[nextIdx] && special && whatToMatchVal === "EOL") {
        return true;
      }
      i = getNextIdx(i);
      continue;
    }
    if (opts && !opts.i && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.includes(str[i]) || opts && opts.i && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.map(val => val.toLowerCase()).includes(str[i].toLowerCase())) {
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
        if (patience !== opts.maxMismatches) {
          return false;
        }
      } else if (charsToCheckCount === 1) {
        lastCharacterMatched = true;
      }
      charsToCheckCount -= 1;
      charsMatchedTotal++;
      if (whitespaceInFrontOfFirstChar()) {
        return false;
      }
      if (!charsToCheckCount) {
        return (
          charsMatchedTotal !== whatToMatchVal.length ||
          patience === opts.maxMismatches ||
          !patienceReducedBeforeFirstMatch ? i : false
        );
      }
    } else {
      if (!patienceReducedBeforeFirstMatch && !charsMatchedTotal) {
        patienceReducedBeforeFirstMatch = true;
      }
      if (opts.maxMismatches && patience && i) {
        patience -= 1;
        for (let y = 0; y <= patience; y++) {
          const nextCharToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount + 1 + y] : whatToMatchVal[charsToCheckCount - 2 - y];
          const nextCharInSource = str[getNextIdx(i)];
          if (nextCharToCompareAgainst && (!opts.i && str[i] === nextCharToCompareAgainst || opts.i && str[i].toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && (
          !opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
            charsMatchedTotal++;
            if (whitespaceInFrontOfFirstChar()) {
              return false;
            }
            charsToCheckCount -= 2;
            somethingFound = true;
            break;
          } else if (nextCharInSource && nextCharToCompareAgainst && (!opts.i && nextCharInSource === nextCharToCompareAgainst || opts.i && nextCharInSource.toLowerCase() === nextCharToCompareAgainst.toLowerCase()) && (
          !opts.firstMustMatch || charsToCheckCount !== whatToMatchVal.length)) {
            if (!charsMatchedTotal && !opts.hungry) {
              return false;
            }
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
    }
    if (opts && opts.maxMismatches >= charsToCheckCount && atLeastSomethingWasMatched) {
      return lastWasMismatched || 0;
    }
    return false;
  }
}
function main(mode, str, position, originalWhatToMatch, originalOpts) {
  if (isObj$1(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!${Array.isArray(originalOpts.trimBeforeMatching) ? ` Did you mean to use opts.trimCharsBeforeMatching?` : ""}`);
  }
  const opts = { ...defaults$6,
    ...originalOpts
  };
  if (typeof opts.trimCharsBeforeMatching === "string") {
    opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  }
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(el => isStr$2(el) ? el : String(el));
  if (!isStr$2(str)) {
    return false;
  }
  if (!str.length) {
    return false;
  }
  if (!Number.isInteger(position) || position < 0) {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ${typeof position}, equal to:\n${JSON.stringify(position, null, 4)}`);
  }
  let whatToMatch;
  let special;
  if (isStr$2(originalWhatToMatch)) {
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
  if (originalOpts && !isObj$1(originalOpts)) {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof originalOpts}", and equal to:\n${JSON.stringify(originalOpts, null, 4)}`);
  }
  let culpritsIndex = 0;
  let culpritsVal = "";
  if (opts && opts.trimCharsBeforeMatching && opts.trimCharsBeforeMatching.some((el, i) => {
    if (el.length > 1) {
      culpritsIndex = i;
      culpritsVal = el;
      return true;
    }
    return false;
  })) {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ${culpritsIndex} is longer than 1 character, ${culpritsVal.length} (equals to ${culpritsVal}). Please split it into separate characters and put into array as separate elements.`);
  }
  if (!whatToMatch || !Array.isArray(whatToMatch) ||
  Array.isArray(whatToMatch) && !whatToMatch.length ||
  Array.isArray(whatToMatch) && whatToMatch.length === 1 && isStr$2(whatToMatch[0]) && !whatToMatch[0].trim()
  ) {
      if (typeof opts.cb === "function") {
        let firstCharOutsideIndex;
        let startingPosition = position;
        if (mode === "matchLeftIncl" || mode === "matchRight") {
          startingPosition += 1;
        }
        if (mode[5] === "L") {
          for (let y = startingPosition; y--;) {
            const currentChar = str[y];
            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar !== undefined && currentChar.trim()) && (!opts.trimCharsBeforeMatching || !opts.trimCharsBeforeMatching.length || currentChar !== undefined && !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        } else if (mode.startsWith("matchRight")) {
          for (let y = startingPosition; y < str.length; y++) {
            const currentChar = str[y];
            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar.trim()) && (!opts.trimCharsBeforeMatching || !opts.trimCharsBeforeMatching.length || !opts.trimCharsBeforeMatching.includes(currentChar))) {
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
      startingPosition += 1;
    } else if (mode === "matchLeft") {
      startingPosition -= 1;
    }
    const found = march(str, startingPosition, whatToMatchVal, opts, special, i2 => mode[5] === "L" ? i2 - 1 : i2 + 1);
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
function matchLeft(str, position, whatToMatch, opts) {
  return main("matchLeft", str, position, whatToMatch, opts);
}
function matchRightIncl(str, position, whatToMatch, opts) {
  return main("matchRightIncl", str, position, whatToMatch, opts);
}
function matchRight(str, position, whatToMatch, opts) {
  return main("matchRight", str, position, whatToMatch, opts);
}

/**
 * @name regex-empty-conditional-comments
 * @fileoverview Regular expression for matching HTML empty conditional comments
 * @version 1.10.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/regex-empty-conditional-comments/}
 */
function emptyCondCommentRegex() {
  return /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;
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

/** Used for built-in method references. */
var funcProto$2 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to infer the `Object` constructor. */
funcToString$2.call(Object);

var lodash_clonedeep = {exports: {}};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

(function (module, exports) {
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
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

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

  map.forEach(function(value, key) {
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
  return function(arg) {
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

  set.forEach(function(value) {
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
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

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
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

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
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
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
}

// Add methods to `ListCache`.
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
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
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
}

// Add methods to `MapCache`.
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
  this.__data__ = new ListCache;
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
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
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
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
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
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
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
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
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
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
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
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
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
  return arrayReduce(array, addMapEntry, new map.constructor);
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
  return arrayReduce(array, addSetEntry, new set.constructor);
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

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

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
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
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
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
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
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
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
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
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

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
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
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
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
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
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
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

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
      return (func + '');
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
  return value === other || (value !== value && other !== other);
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
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
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
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
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
}(lodash_clonedeep, lodash_clonedeep.exports));

/**
 * @name string-left-right
 * @fileoverview Looks up the first non-whitespace character to the left/right of a given index
 * @version 4.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-left-right/}
 */
const RAWNBSP = "\u00A0";
function rightMain({
  str,
  idx = 0,
  stopAtNewlines = false,
  stopAtRawNbsp = false
}) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (!str[idx + 1]) {
    return null;
  }
  if (
  str[idx + 1] && (
  str[idx + 1].trim() ||
  stopAtNewlines &&
  "\n\r".includes(str[idx + 1]) ||
  stopAtRawNbsp &&
  str[idx + 1] === RAWNBSP)) {
    return idx + 1;
  }
  if (
  str[idx + 2] && (
  str[idx + 2].trim() ||
  stopAtNewlines &&
  "\n\r".includes(str[idx + 2]) ||
  stopAtRawNbsp &&
  str[idx + 2] === RAWNBSP)) {
    return idx + 2;
  }
  for (let i = idx + 1, len = str.length; i < len; i++) {
    if (
    str[i].trim() ||
    stopAtNewlines &&
    "\n\r".includes(str[i]) ||
    stopAtRawNbsp &&
    str[i] === RAWNBSP) {
      return i;
    }
  }
  return null;
}
function right(str, idx = 0) {
  return rightMain({
    str,
    idx,
    stopAtNewlines: false,
    stopAtRawNbsp: false
  });
}
function leftMain({
  str,
  idx,
  stopAtNewlines,
  stopAtRawNbsp
}) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  if (!idx || typeof idx !== "number") {
    idx = 0;
  }
  if (idx < 1) {
    return null;
  }
  if (
  str[~-idx] && (
  str[~-idx].trim() ||
  stopAtNewlines &&
  "\n\r".includes(str[~-idx]) ||
  stopAtRawNbsp &&
  str[~-idx] === RAWNBSP)) {
    return ~-idx;
  }
  if (
  str[idx - 2] && (
  str[idx - 2].trim() ||
  stopAtNewlines &&
  "\n\r".includes(str[idx - 2]) ||
  stopAtRawNbsp &&
  str[idx - 2] === RAWNBSP)) {
    return idx - 2;
  }
  for (let i = idx; i--;) {
    if (str[i] && (
    str[i].trim() ||
    stopAtNewlines &&
    "\n\r".includes(str[i]) ||
    stopAtRawNbsp &&
    str[i] === RAWNBSP)) {
      return i;
    }
  }
  return null;
}
function left(str, idx = 0) {
  return leftMain({
    str,
    idx,
    stopAtNewlines: false,
    stopAtRawNbsp: false
  });
}

/**
 * @name string-extract-class-names
 * @fileoverview Extracts CSS class/id names from a string
 * @version 6.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-extract-class-names/}
 */
function extract(str) {
  if (typeof str !== "string") {
    throw new TypeError(`string-extract-class-names: [THROW_ID_01] first str should be string, not ${typeof str}, currently equal to ${JSON.stringify(str, null, 4)}`);
  }
  const badChars = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\``;
  let stateCurrentlyIs;
  function isLatinLetter(char) {
    return typeof char === "string" && !!char.length && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
  }
  let selectorStartsAt = null;
  const result = {
    res: [],
    ranges: []
  };
  for (let i = 0, len = str.length; i <= len; i++) {
    if (selectorStartsAt !== null && i >= selectorStartsAt && (
    !str[i] ||
    !str[i].trim() ||
    badChars.includes(str[i]))) {
      if (i > selectorStartsAt + 1) {
        result.ranges.push([selectorStartsAt, i]);
        result.res.push(`${stateCurrentlyIs || ""}${str.slice(selectorStartsAt, i)}`);
        if (stateCurrentlyIs) {
          stateCurrentlyIs = undefined;
        }
      }
      selectorStartsAt = null;
    }
    if (str[i] && selectorStartsAt === null && (str[i] === "." || str[i] === "#")) {
      selectorStartsAt = i;
    }
    const temp1 = right(str, i + 4);
    if (str.startsWith("class", i) && typeof left(str, i) === "number" && str[left(str, i)] === "[" && typeof temp1 === "number" && str[temp1] === "=") {
      /* istanbul ignore else */
      if (right(str, temp1) && isLatinLetter(str[right(str, temp1)])) {
        selectorStartsAt = right(str, temp1);
      } else if (`'"`.includes(str[right(str, temp1)]) && isLatinLetter(str[right(str, right(str, temp1))])) {
        selectorStartsAt = right(str, right(str, temp1));
      }
      stateCurrentlyIs = ".";
    }
    const temp2 = right(str, i + 1);
    if (str.startsWith("id", i) && str[left(str, i)] === "[" && temp2 !== null && str[temp2] === "=") {
      if (isLatinLetter(str[right(str, temp2)])) {
        selectorStartsAt = right(str, temp2);
      } else if (`'"`.includes(str[right(str, temp2)]) && isLatinLetter(str[right(str, right(str, temp2))])) {
        selectorStartsAt = right(str, right(str, temp2));
      }
      stateCurrentlyIs = "#";
    }
  }
  if (!result.ranges.length) {
    result.ranges = null;
  }
  return result;
}

var matcher$1 = {exports: {}};

var escapeStringRegexp$1 = string => {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a \unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
};

const escapeStringRegexp = escapeStringRegexp$1;

const regexpCache = new Map();

function sanitizeArray(input, inputName) {
	if (!Array.isArray(input)) {
		switch (typeof input) {
			case 'string':
				input = [input];
				break;
			case 'undefined':
				input = [];
				break;
			default:
				throw new TypeError(`Expected '${inputName}' to be a string or an array, but got a type of '${typeof input}'`);
		}
	}

	return input.filter(string => {
		if (typeof string !== 'string') {
			if (typeof string === 'undefined') {
				return false;
			}

			throw new TypeError(`Expected '${inputName}' to be an array of strings, but found a type of '${typeof string}' in the array`);
		}

		return true;
	});
}

function makeRegexp(pattern, options) {
	options = {
		caseSensitive: false,
		...options
	};

	const cacheKey = pattern + JSON.stringify(options);

	if (regexpCache.has(cacheKey)) {
		return regexpCache.get(cacheKey);
	}

	const negated = pattern[0] === '!';

	if (negated) {
		pattern = pattern.slice(1);
	}

	pattern = escapeStringRegexp(pattern).replace(/\\\*/g, '[\\s\\S]*');

	const regexp = new RegExp(`^${pattern}$`, options.caseSensitive ? '' : 'i');
	regexp.negated = negated;
	regexpCache.set(cacheKey, regexp);

	return regexp;
}

matcher$1.exports = (inputs, patterns, options) => {
	inputs = sanitizeArray(inputs, 'inputs');
	patterns = sanitizeArray(patterns, 'patterns');

	if (patterns.length === 0) {
		return [];
	}

	const isFirstPatternNegated = patterns[0][0] === '!';

	patterns = patterns.map(pattern => makeRegexp(pattern, options));

	const result = [];

	for (const input of inputs) {
		// If first pattern is negated we include everything to match user expectation.
		let matches = isFirstPatternNegated;

		for (const pattern of patterns) {
			if (pattern.test(input)) {
				matches = !pattern.negated;
			}
		}

		if (matches) {
			result.push(input);
		}
	}

	return result;
};

matcher$1.exports.isMatch = (inputs, patterns, options) => {
	inputs = sanitizeArray(inputs, 'inputs');
	patterns = sanitizeArray(patterns, 'patterns');

	if (patterns.length === 0) {
		return false;
	}

	return inputs.some(input => {
		return patterns.every(pattern => {
			const regexp = makeRegexp(pattern, options);
			const matches = regexp.test(input);
			return regexp.negated ? !matches : matches;
		});
	});
};

var matcher = matcher$1.exports;

/**
 * @name array-pull-all-with-glob
 * @fileoverview Like _.pullAll but with globs (wildcards)
 * @version 5.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/array-pull-all-with-glob/}
 */
function pull(originalInput, originalToBeRemoved, originalOpts) {
  if (!originalInput.length) {
    return [];
  }
  if (!originalInput.length || !originalToBeRemoved.length) {
    return Array.from(originalInput);
  }
  const toBeRemoved = typeof originalToBeRemoved === "string" ? [originalToBeRemoved] : Array.from(originalToBeRemoved);
  const defaults = {
    caseSensitive: true
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  const res = Array.from(originalInput).filter(originalVal => !toBeRemoved.some(remVal => matcher.isMatch(originalVal, remVal, {
    caseSensitive: opts.caseSensitive
  })));
  return res;
}

var version$1 = "5.0.16";

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag$1 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor$1 = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf$1 = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal$1 || freeSelf$1 || Function('return this')();

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
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes$1(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf$2(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith$1(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
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
function arrayMap$1(array, iteratee) {
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
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex$2(array, predicate, fromIndex, fromRight) {
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
function baseIndexOf$2(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex$2(array, baseIsNaN$2, fromIndex);
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
function baseIsNaN$2(value) {
  return value !== value;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary$1(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas$1(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$1(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject$1(value) {
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

/** Used for built-in method references. */
var arrayProto$2 = Array.prototype,
    funcProto$1 = Function.prototype,
    objectProto$1 = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData$1 = root$1['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey$1 = (function() {
  var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString$1 = objectProto$1.toString;

/** Used to detect if a method is native. */
var reIsNative$1 = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar$1, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice$2 = arrayProto$2.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/* Built-in method references that are verified to be native. */
var Map$2 = getNative$1(root$1, 'Map'),
    nativeCreate$1 = getNative$1(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash$1(entries) {
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
function hashClear$1() {
  this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
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
function hashDelete$1(key) {
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
function hashGet$1(key) {
  var data = this.__data__;
  if (nativeCreate$1) {
    var result = data[key];
    return result === HASH_UNDEFINED$1 ? undefined : result;
  }
  return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
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
function hashHas$1(key) {
  var data = this.__data__;
  return nativeCreate$1 ? data[key] !== undefined : hasOwnProperty$1.call(data, key);
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
function hashSet$1(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate$1 && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

// Add methods to `Hash`.
Hash$1.prototype.clear = hashClear$1;
Hash$1.prototype['delete'] = hashDelete$1;
Hash$1.prototype.get = hashGet$1;
Hash$1.prototype.has = hashHas$1;
Hash$1.prototype.set = hashSet$1;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache$1(entries) {
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
function listCacheClear$1() {
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
function listCacheDelete$1(key) {
  var data = this.__data__,
      index = assocIndexOf$1(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice$2.call(data, index, 1);
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
function listCacheGet$1(key) {
  var data = this.__data__,
      index = assocIndexOf$1(data, key);

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
function listCacheHas$1(key) {
  return assocIndexOf$1(this.__data__, key) > -1;
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
function listCacheSet$1(key, value) {
  var data = this.__data__,
      index = assocIndexOf$1(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache$1.prototype.clear = listCacheClear$1;
ListCache$1.prototype['delete'] = listCacheDelete$1;
ListCache$1.prototype.get = listCacheGet$1;
ListCache$1.prototype.has = listCacheHas$1;
ListCache$1.prototype.set = listCacheSet$1;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache$1(entries) {
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
function mapCacheClear$1() {
  this.__data__ = {
    'hash': new Hash$1,
    'map': new (Map$2 || ListCache$1),
    'string': new Hash$1
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
function mapCacheDelete$1(key) {
  return getMapData$1(this, key)['delete'](key);
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
function mapCacheGet$1(key) {
  return getMapData$1(this, key).get(key);
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
function mapCacheHas$1(key) {
  return getMapData$1(this, key).has(key);
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
function mapCacheSet$1(key, value) {
  getMapData$1(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache$1.prototype.clear = mapCacheClear$1;
MapCache$1.prototype['delete'] = mapCacheDelete$1;
MapCache$1.prototype.get = mapCacheGet$1;
MapCache$1.prototype.has = mapCacheHas$1;
MapCache$1.prototype.set = mapCacheSet$1;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache$1(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache$1;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd$1(value) {
  this.__data__.set(value, HASH_UNDEFINED$1);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas$1(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache$1.prototype.add = SetCache$1.prototype.push = setCacheAdd$1;
SetCache$1.prototype.has = setCacheHas$1;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf$1(array, key) {
  var length = array.length;
  while (length--) {
    if (eq$1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith$1 : arrayIncludes$1,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap$1(array, baseUnary$1(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
      ? new SetCache$1(othIndex && array)
      : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer:
  while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (!(seen
          ? cacheHas$1(seen, computed)
          : includes(result, computed, comparator)
        )) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache
              ? cacheHas$1(cache, computed)
              : includes(arrays[othIndex], computed, comparator))
            ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$1(value) {
  if (!isObject$1(value) || isMasked$1(value)) {
    return false;
  }
  var pattern = (isFunction$1(value) || isHostObject$1(value)) ? reIsNative$1 : reIsHostCtor$1;
  return pattern.test(toSource$1(value));
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
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData$1(map, key) {
  var data = map.__data__;
  return isKeyable$1(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$1(object, key) {
  var value = getValue$1(object, key);
  return baseIsNative$1(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable$1(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$1(func) {
  return !!maskSrcKey$1 && (maskSrcKey$1 in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource$1(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order of result values is determined by the
 * order they occur in the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */
var intersection = baseRest(function(arrays) {
  var mapped = arrayMap$1(arrays, castArrayLikeObject);
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped)
    : [];
});

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
function eq$1(value, other) {
  return value === other || (value !== value && other !== other);
}

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
  return value != null && isLength(value.length) && !isFunction$1(value);
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
function isFunction$1(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject$1(value) ? objectToString$1.call(value) : '';
  return tag == funcTag$1 || tag == genTag$1;
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
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
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
function isObject$1(value) {
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

var lodash_intersection = intersection;

/**
 * @name string-range-expander
 * @fileoverview Expands string index ranges within whitespace boundaries until letters are met
 * @version 2.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-range-expander/}
 */
const defaults$5 = {
  str: "",
  from: 0,
  to: 0,
  ifLeftSideIncludesThisThenCropTightly: "",
  ifLeftSideIncludesThisCropItToo: "",
  ifRightSideIncludesThisThenCropTightly: "",
  ifRightSideIncludesThisCropItToo: "",
  extendToOneSide: false,
  wipeAllWhitespaceOnLeft: false,
  wipeAllWhitespaceOnRight: false,
  addSingleSpaceToPreventAccidentalConcatenation: false
};
function expander(originalOpts) {
  const letterOrDigit = /^[0-9a-zA-Z]+$/;
  function isWhitespace(char) {
    if (!char || typeof char !== "string") {
      return false;
    }
    return !char.trim();
  }
  function isStr(something) {
    return typeof something === "string";
  }
  if (!originalOpts || typeof originalOpts !== "object" || Array.isArray(originalOpts)) {
    let supplementalString;
    if (originalOpts === undefined) {
      supplementalString = "but it is missing completely.";
    } else if (originalOpts === null) {
      supplementalString = "but it was given as null.";
    } else {
      supplementalString = `but it was given as ${typeof originalOpts}, equal to:\n${JSON.stringify(originalOpts, null, 4)}.`;
    }
    throw new Error(`string-range-expander: [THROW_ID_01] Input must be a plain object ${supplementalString}`);
  } else if (typeof originalOpts === "object" && originalOpts !== null && !Array.isArray(originalOpts) && !Object.keys(originalOpts).length) {
    throw new Error(`string-range-expander: [THROW_ID_02] Input must be a plain object but it was given as a plain object without any keys.`);
  }
  if (typeof originalOpts.from !== "number") {
    throw new Error(`string-range-expander: [THROW_ID_03] The input's "from" value opts.from, is not a number! Currently it's given as ${typeof originalOpts.from}, equal to ${JSON.stringify(originalOpts.from, null, 0)}`);
  }
  if (typeof originalOpts.to !== "number") {
    throw new Error(`string-range-expander: [THROW_ID_04] The input's "to" value opts.to, is not a number! Currently it's given as ${typeof originalOpts.to}, equal to ${JSON.stringify(originalOpts.to, null, 0)}`);
  }
  if (originalOpts && originalOpts.str && !originalOpts.str[originalOpts.from] && originalOpts.from !== originalOpts.to) {
    throw new Error(`string-range-expander: [THROW_ID_05] The given input string opts.str ("${originalOpts.str}") must contain the character at index "from" ("${originalOpts.from}")`);
  }
  if (originalOpts && originalOpts.str && !originalOpts.str[originalOpts.to - 1]) {
    throw new Error(`string-range-expander: [THROW_ID_06] The given input string, opts.str ("${originalOpts.str}") must contain the character at index before "to" ("${originalOpts.to - 1}")`);
  }
  if (originalOpts.from > originalOpts.to) {
    throw new Error(`string-range-expander: [THROW_ID_07] The given "from" index, "${originalOpts.from}" is greater than "to" index, "${originalOpts.to}". That's wrong!`);
  }
  if (isStr(originalOpts.extendToOneSide) && originalOpts.extendToOneSide !== "left" && originalOpts.extendToOneSide !== "right" || !isStr(originalOpts.extendToOneSide) && originalOpts.extendToOneSide !== undefined && originalOpts.extendToOneSide !== false) {
    throw new Error(`string-range-expander: [THROW_ID_08] The opts.extendToOneSide value is not recogniseable! It's set to: "${originalOpts.extendToOneSide}" (${typeof originalOpts.extendToOneSide}). It has to be either Boolean "false" or strings "left" or "right"`);
  }
  const opts = { ...defaults$5,
    ...originalOpts
  };
  if (Array.isArray(opts.ifLeftSideIncludesThisThenCropTightly)) {
    let culpritsIndex;
    let culpritsValue;
    if (opts.ifLeftSideIncludesThisThenCropTightly.every((val, i) => {
      if (!isStr(val)) {
        culpritsIndex = i;
        culpritsValue = val;
        return false;
      }
      return true;
    })) {
      opts.ifLeftSideIncludesThisThenCropTightly = opts.ifLeftSideIncludesThisThenCropTightly.join("");
    } else {
      throw new Error(`string-range-expander: [THROW_ID_09] The opts.ifLeftSideIncludesThisThenCropTightly was set to an array:\n${JSON.stringify(opts.ifLeftSideIncludesThisThenCropTightly, null, 4)}. Now, that array contains not only string elements. For example, an element at index ${culpritsIndex} is of a type ${typeof culpritsValue} (equal to ${JSON.stringify(culpritsValue, null, 0)}).`);
    }
  }
  const str = opts.str;
  let from = opts.from;
  let to = opts.to;
  if (opts.extendToOneSide !== "right" && (isWhitespace(str[from - 1]) && (isWhitespace(str[from - 2]) || opts.ifLeftSideIncludesThisCropItToo.includes(str[from - 2])) || str[from - 1] && opts.ifLeftSideIncludesThisCropItToo.includes(str[from - 1]) || opts.wipeAllWhitespaceOnLeft && isWhitespace(str[from - 1]))) {
    for (let i = from; i--;) {
      if (!opts.ifLeftSideIncludesThisCropItToo.includes(str[i])) {
        if (str[i].trim()) {
          if (opts.wipeAllWhitespaceOnLeft || opts.ifLeftSideIncludesThisCropItToo.includes(str[i + 1])) {
            from = i + 1;
          } else {
            from = i + 2;
          }
          break;
        } else if (i === 0) {
          if (opts.wipeAllWhitespaceOnLeft) {
            from = 0;
          } else {
            from = 1;
          }
          break;
        }
      }
    }
  }
  if (opts.extendToOneSide !== "left" && (isWhitespace(str[to]) && (opts.wipeAllWhitespaceOnRight || isWhitespace(str[to + 1])) || opts.ifRightSideIncludesThisCropItToo.includes(str[to]))) {
    for (let i = to, len = str.length; i < len; i++) {
      if (!opts.ifRightSideIncludesThisCropItToo.includes(str[i]) && (str[i] && str[i].trim() || str[i] === undefined)) {
        if (opts.wipeAllWhitespaceOnRight || opts.ifRightSideIncludesThisCropItToo.includes(str[i - 1])) {
          to = i;
        } else {
          to = i - 1;
        }
        break;
      }
    }
  }
  if (opts.extendToOneSide !== "right" && isStr(opts.ifLeftSideIncludesThisThenCropTightly) && opts.ifLeftSideIncludesThisThenCropTightly && (str[from - 2] && opts.ifLeftSideIncludesThisThenCropTightly.includes(str[from - 2]) || str[from - 1] && opts.ifLeftSideIncludesThisThenCropTightly.includes(str[from - 1])) || opts.extendToOneSide !== "left" && isStr(opts.ifRightSideIncludesThisThenCropTightly) && opts.ifRightSideIncludesThisThenCropTightly && (str[to + 1] && opts.ifRightSideIncludesThisThenCropTightly.includes(str[to + 1]) || str[to] && opts.ifRightSideIncludesThisThenCropTightly.includes(str[to]))) {
    if (opts.extendToOneSide !== "right" && isWhitespace(str[from - 1]) && !opts.wipeAllWhitespaceOnLeft) {
      from -= 1;
    }
    if (opts.extendToOneSide !== "left" && isWhitespace(str[to]) && !opts.wipeAllWhitespaceOnRight) {
      to += 1;
    }
  }
  if (opts.addSingleSpaceToPreventAccidentalConcatenation && str[from - 1] && str[from - 1].trim() && str[to] && str[to].trim() && (!opts.ifLeftSideIncludesThisThenCropTightly && !opts.ifRightSideIncludesThisThenCropTightly || !((!opts.ifLeftSideIncludesThisThenCropTightly || opts.ifLeftSideIncludesThisThenCropTightly.includes(str[from - 1])) && (!opts.ifRightSideIncludesThisThenCropTightly || str[to] && opts.ifRightSideIncludesThisThenCropTightly.includes(str[to])))) && (letterOrDigit.test(str[from - 1]) || letterOrDigit.test(str[to]))) {
    return [from, to, " "];
  }
  return [from, to];
}

/**
 * @name string-uglify
 * @fileoverview Shorten sets of strings deterministically, to be git-friendly
 * @version 1.4.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-uglify/}
 */
function tellcp(str, idNum = 0) {
  return str.codePointAt(idNum) || 0;
}
function uglifyArr(arr) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const lettersAndNumbers = "abcdefghijklmnopqrstuvwxyz0123456789";
  const singleClasses = {
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
    i: false,
    j: false,
    k: false,
    l: false,
    m: false,
    n: false,
    o: false,
    p: false,
    q: false,
    r: false,
    s: false,
    t: false,
    u: false,
    v: false,
    w: false,
    x: false,
    y: false,
    z: false
  };
  const singleIds = {
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
    i: false,
    j: false,
    k: false,
    l: false,
    m: false,
    n: false,
    o: false,
    p: false,
    q: false,
    r: false,
    s: false,
    t: false,
    u: false,
    v: false,
    w: false,
    x: false,
    y: false,
    z: false
  };
  const singleNameonly = {
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
    i: false,
    j: false,
    k: false,
    l: false,
    m: false,
    n: false,
    o: false,
    p: false,
    q: false,
    r: false,
    s: false,
    t: false,
    u: false,
    v: false,
    w: false,
    x: false,
    y: false,
    z: false
  };
  const res = [];
  if (!Array.isArray(arr) || !arr.length) {
    return arr;
  }
  for (let id = 0, len = arr.length; id < len; id++) {
    if (arr.indexOf(arr[id]) < id) {
      res.push(res[arr.indexOf(arr[id])]);
      continue;
    }
    const prefix = `.#`.includes(arr[id][0]) ? arr[id][0] : "";
    const codePointSum = Array.from(arr[id]).reduce((acc, curr) => acc + tellcp(curr), 0);
    if (`.#`.includes(arr[id][0]) && arr[id].length < 4 || !`.#`.includes(arr[id][0]) && arr[id].length < 3) {
      const val = arr[id];
      if (!res.includes(val)) {
        res.push(val);
        if (val.startsWith(".") && val.length === 2 && singleClasses[val.slice(1)] === false) {
          singleClasses[val.slice(1)] = true;
        } else if (val.startsWith("#") && val.length === 2 && singleIds[val.slice(1)] === false) {
          singleIds[val.slice(1)] = true;
        } else if (!val.startsWith(".") && !val.startsWith("#") && val.length === 1 && singleNameonly[val] === false) {
          singleNameonly[val] = true;
        }
        continue;
      }
    }
    let generated = `${prefix}${letters[codePointSum % letters.length]}${lettersAndNumbers[codePointSum % lettersAndNumbers.length]}`;
    if (res.includes(generated)) {
      let soFarWeveGot = generated;
      let counter = 0;
      const reducedCodePointSum = Array.from(arr[id]).reduce((acc, curr) => acc < 200 ? acc + tellcp(curr) : (acc + tellcp(curr)) % lettersAndNumbers.length, 0);
      const magicNumber = Array.from(arr[id]).map(val => tellcp(val)).reduce((accum, curr) => {
        let temp = accum + curr;
        do {
          temp = String(temp).split("").reduce((acc, curr1) => acc + Number.parseInt(curr1, 10), 0);
        } while (temp >= 10);
        return temp;
      }, 0);
      while (res.includes(soFarWeveGot)) {
        counter += 1;
        soFarWeveGot += lettersAndNumbers[reducedCodePointSum * magicNumber * counter % lettersAndNumbers.length];
      }
      generated = soFarWeveGot;
    }
    res.push(generated);
    if (generated.startsWith(".") && generated.length === 2 && singleClasses[generated.slice(1)] === false) {
      singleClasses[generated.slice(1)] = true;
    } else if (generated.startsWith("#") && generated.length === 2 && singleIds[generated.slice(1)] === false) {
      singleIds[generated.slice(1)] = true;
    } else if (!generated.startsWith(".") && !generated.startsWith("#") && generated.length === 1 && singleNameonly[generated] === false) {
      singleNameonly[generated] = true;
    }
  }
  for (let i = 0, len = res.length; i < len; i++) {
    if (res[i].startsWith(".")) {
      if (singleClasses[res[i].slice(1, 2)] === false) {
        singleClasses[res[i].slice(1, 2)] = res[i];
        res[i] = res[i].slice(0, 2);
      } else if (singleClasses[res[i].slice(1, 2)] === res[i]) {
        res[i] = res[i].slice(0, 2);
      }
    } else if (res[i].startsWith("#")) {
      if (singleIds[res[i].slice(1, 2)] === false) {
        singleIds[res[i].slice(1, 2)] = res[i];
        res[i] = res[i].slice(0, 2);
      } else if (singleIds[res[i].slice(1, 2)] === res[i]) {
        res[i] = res[i].slice(0, 2);
      }
    } else if (!res[i].startsWith(".") && !res[i].startsWith("#")) {
      if (!singleNameonly[res[i].slice(0, 1)]) {
        singleNameonly[res[i].slice(0, 1)] = res[i];
        res[i] = res[i].slice(0, 1);
      } else if (singleNameonly[res[i].slice(0, 1)] === res[i]) {
        res[i] = res[i].slice(0, 1);
      }
    }
  }
  return res;
}

/**
 * @name ranges-sort
 * @fileoverview Sort string index ranges
 * @version 4.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-sort/}
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
 * @name ranges-merge
 * @fileoverview Merge and sort string index ranges
 * @version 7.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-merge/}
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
 * @name ranges-apply
 * @fileoverview Take an array of string index ranges, delete/replace the string according to them
 * @version 5.0.16
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

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

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
var arrayProto$1 = Array.prototype;

/** Built-in value references. */
var splice$1 = arrayProto$1.splice;

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
        splice$1.call(seen, fromIndex, 1);
      }
      splice$1.call(array, fromIndex, 1);
    }
  }
  return array;
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

var lodash_pullall = pullAll;

/**
 * @name string-collapse-leading-whitespace
 * @fileoverview Collapse the leading and trailing whitespace of a string
 * @version 5.0.16
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
 * @name ranges-push
 * @fileoverview Gather string index ranges
 * @version 5.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-push/}
 */
function existy(x) {
  return x != null;
}
function isNum(something) {
  return Number.isInteger(something) && something >= 0;
}
function isStr$1(something) {
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
      if (isStr$1(opts.mergeType) && opts.mergeType.trim() === "1") {
        opts.mergeType = 1;
      } else if (isStr$1(opts.mergeType) && opts.mergeType.trim() === "2") {
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
      if (existy(addVal) && !isStr$1(addVal) && !isNum(addVal)) {
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
          if (!(isStr$1(calculatedVal) && !calculatedVal.length)) {
            this.last()[2] = calculatedVal;
          }
        }
      } else {
        if (!this.ranges) {
          this.ranges = [];
        }
        const whatToPush = addVal !== undefined && !(isStr$1(addVal) && !addVal.length) ? [from, to, addVal && this.opts.limitToBeAddedWhitespace ? collWhitespace(addVal, this.opts.limitLinebreaksCount) : addVal] : [from, to];
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
 * @name html-crush
 * @fileoverview Minifies HTML/CSS: valid or broken, pure or mixed with other languages
 * @version 4.1.10
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/html-crush/}
 */
const finalIndexesToDelete = new Ranges({
  limitToBeAddedWhitespace: true
});
const defaults$1 = {
  lineLengthLimit: 500,
  removeIndentations: true,
  removeLineBreaks: false,
  removeHTMLComments: false,
  removeCSSComments: true,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  breakToTheLeftOf: ["</td", "<html", "</html", "<head", "</head", "<meta", "<link", "<table", "<script", "</script", "<!DOCTYPE", "<style", "</style", "<title", "<body", "@media", "</body", "<!--[if", "<!--<![endif", "<![endif]"],
  mindTheInlineTags: ["a", "abbr", "acronym", "audio", "b", "bdi", "bdo", "big", "br", "button", "canvas", "cite", "code", "data", "datalist", "del", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins", "kbd", "label", "map", "mark", "meter", "noscript", "object", "output", "picture", "progress", "q", "ruby", "s", "samp", "script", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "template", "textarea", "time", "u", "tt", "var", "video", "wbr"]
};
const applicableOpts = {
  removeHTMLComments: false,
  removeCSSComments: false
};
function isStr(something) {
  return typeof something === "string";
}
function isLetter(something) {
  return typeof something === "string" && something.toUpperCase() !== something.toLowerCase();
}
function crush(str, originalOpts) {
  const start = Date.now();
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error("html-crush: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error(`html-crush: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(str, null, 4)}`);
    }
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(`html-crush: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(originalOpts, null, 4)}`);
  }
  if (originalOpts && Array.isArray(originalOpts.breakToTheLeftOf) && originalOpts.breakToTheLeftOf.length) {
    for (let z = 0, len = originalOpts.breakToTheLeftOf.length; z < len; z++) {
      if (!isStr(originalOpts.breakToTheLeftOf[z])) {
        throw new TypeError(`html-crush: [THROW_ID_05] the opts.breakToTheLeftOf array contains non-string elements! For example, element at index ${z} is of a type "${typeof originalOpts.breakToTheLeftOf[z]}" and is equal to:\n${JSON.stringify(originalOpts.breakToTheLeftOf[z], null, 4)}`);
      }
    }
  }
  const opts = { ...defaults$1,
    ...originalOpts
  };
  if (typeof opts.removeHTMLComments === "boolean") {
    opts.removeHTMLComments = opts.removeHTMLComments ? 1 : 0;
  }
  let breakToTheLeftOfFirstLetters = "";
  if (Array.isArray(opts.breakToTheLeftOf) && opts.breakToTheLeftOf.length) {
    breakToTheLeftOfFirstLetters = [...new Set(opts.breakToTheLeftOf.map(val => val[0]))].join("");
  }
  let lastLinebreak = null;
  let whitespaceStartedAt = null;
  let nonWhitespaceCharMet = false;
  let countCharactersPerLine = 0;
  let cpl = 0;
  let withinStyleTag = false;
  let withinHTMLConditional = false;
  let withinInlineStyle = null;
  let styleCommentStartedAt = null;
  let htmlCommentStartedAt = null;
  let scriptStartedAt = null;
  let doNothing;
  let stageFrom = null;
  let stageTo = null;
  let stageAdd = null;
  let tagName = null;
  let tagNameStartsAt = null;
  let leftTagName = null;
  const CHARS_BREAK_ON_THE_RIGHT_OF_THEM = `>};`;
  const CHARS_BREAK_ON_THE_LEFT_OF_THEM = `<`;
  const CHARS_DONT_BREAK_ON_THE_LEFT_OF_THEM = `!`;
  const DELETE_TIGHTLY_IF_ON_LEFT_IS = `>`;
  const DELETE_TIGHTLY_IF_ON_RIGHT_IS = `<`;
  const set = `{},:;<>~+`;
  const DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS = set;
  const DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS = set;
  let beginningOfAFile = true;
  const len = str.length;
  const midLen = Math.floor(len / 2);
  const leavePercForLastStage = 0.01;
  let ceil;
  if (opts.reportProgressFunc) {
    ceil = Math.floor(opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom);
  }
  let currentPercentageDone;
  let lastPercentage = 0;
  let lineEnding = `\n`;
  if (str.includes(`\r\n`)) {
    lineEnding = `\r\n`;
  } else if (str.includes(`\r`)) {
    lineEnding = `\r`;
  }
  if (len) {
    for (let i = 0; i < len; i++) {
      if (opts.reportProgressFunc) {
        if (len > 1000 && len < 2000) {
          if (i === midLen) {
            opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
          }
        } else if (len >= 2000) {
          currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / len * (ceil || 1));
          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      }
      cpl++;
      if (doNothing && typeof doNothing === "number" && i >= doNothing) {
        doNothing = undefined;
      }
      if (scriptStartedAt !== null && str.startsWith("</script", i) && !isLetter(str[i + 8])) {
        if ((opts.removeIndentations || opts.removeLineBreaks) && i > 0 && str[~-i] && !str[~-i].trim()) {
          for (let y = i; y--;) {
            if (str[y] === "\n" || str[y] === "\r" || str[y].trim()) {
              if (y + 1 < i) {
                finalIndexesToDelete.push(y + 1, i);
              }
              break;
            }
          }
        }
        scriptStartedAt = null;
        doNothing = false;
        i += 8;
        continue;
      }
      if (!doNothing && !withinStyleTag && str.startsWith("<script", i) && !isLetter(str[i + 7])) {
        scriptStartedAt = i;
        doNothing = true;
        let whatToInsert = "";
        if ((opts.removeLineBreaks || opts.removeIndentations) && whitespaceStartedAt !== null) {
          if (whitespaceStartedAt > 0) {
            whatToInsert = lineEnding;
          }
          finalIndexesToDelete.push(whitespaceStartedAt, i, whatToInsert);
        }
        whitespaceStartedAt = null;
        lastLinebreak = null;
      }
      if (tagNameStartsAt !== null && tagName === null && !/\w/.test(str[i])
      ) {
          tagName = str.slice(tagNameStartsAt, i);
          const idxOnTheRight = right(str, ~-i);
          if (typeof idxOnTheRight === "number" && str[idxOnTheRight] === ">" && !str[i].trim() && right(str, i)) {
            finalIndexesToDelete.push(i, right(str, i));
          } else if (idxOnTheRight && str[idxOnTheRight] === "/" && str[right(str, idxOnTheRight)] === ">") {
            if (!str[i].trim() && right(str, i)) {
              finalIndexesToDelete.push(i, right(str, i));
            }
            if (str[idxOnTheRight + 1] !== ">" && right(str, idxOnTheRight + 1)) {
              finalIndexesToDelete.push(idxOnTheRight + 1, right(str, idxOnTheRight + 1));
            }
          }
        }
      if (!doNothing && !withinStyleTag && !withinInlineStyle && str[~-i] === "<" && tagNameStartsAt === null) {
        if (/\w/.test(str[i])) {
          tagNameStartsAt = i;
        } else if (str[right(str, ~-i)] === "/" && /\w/.test(str[right(str, right(str, ~-i))] || "")) {
          tagNameStartsAt = right(str, right(str, ~-i));
        }
      }
      if (!doNothing && (withinStyleTag || withinInlineStyle) && styleCommentStartedAt !== null && str[i] === "*" && str[i + 1] === "/") {
        [stageFrom, stageTo] = expander({
          str,
          from: styleCommentStartedAt,
          to: i + 2,
          ifLeftSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS ,
          ifRightSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS 
        });
        styleCommentStartedAt = null;
        if (stageFrom != null) {
          finalIndexesToDelete.push(stageFrom, stageTo);
        } else {
          countCharactersPerLine += 1;
          i += 1;
        }
        doNothing = i + 2;
      }
      if (!doNothing && (withinStyleTag || withinInlineStyle) && styleCommentStartedAt === null && str[i] === "/" && str[i + 1] === "*") {
        if (!applicableOpts.removeCSSComments) {
          applicableOpts.removeCSSComments = true;
        }
        if (opts.removeCSSComments) {
          styleCommentStartedAt = i;
        }
      }
      if (withinHTMLConditional && str.startsWith("![endif", i + 1)) {
        withinHTMLConditional = false;
      }
      if (!doNothing && !withinStyleTag && !withinInlineStyle && htmlCommentStartedAt !== null) {
        let distanceFromHereToCommentEnding;
        if (str.startsWith("-->", i)) {
          distanceFromHereToCommentEnding = 3;
        } else if (str[i] === ">" && str[i - 1] === "]") {
          distanceFromHereToCommentEnding = 1;
        }
        if (distanceFromHereToCommentEnding) {
          [stageFrom, stageTo] = expander({
            str,
            from: htmlCommentStartedAt,
            to: i + distanceFromHereToCommentEnding
          });
          htmlCommentStartedAt = null;
          if (stageFrom != null) {
            if (opts.lineLengthLimit && cpl - (stageTo - stageFrom) >= opts.lineLengthLimit) {
              finalIndexesToDelete.push(stageFrom, stageTo, lineEnding);
              cpl = -distanceFromHereToCommentEnding;
            } else {
              finalIndexesToDelete.push(stageFrom, stageTo);
              cpl -= stageTo - stageFrom;
            }
          } else {
            countCharactersPerLine += distanceFromHereToCommentEnding - 1;
            i += distanceFromHereToCommentEnding - 1;
          }
          doNothing = i + distanceFromHereToCommentEnding;
        }
      }
      if (!doNothing && !withinStyleTag && !withinInlineStyle && str.startsWith("<!--", i) && htmlCommentStartedAt === null) {
        if (str.startsWith("[if", i + 4)) {
          if (!withinHTMLConditional) {
            withinHTMLConditional = true;
          }
          if (opts.removeHTMLComments === 2) {
            htmlCommentStartedAt = i;
          }
        } else if (
        opts.removeHTMLComments && (
        !withinHTMLConditional || opts.removeHTMLComments === 2)) {
          htmlCommentStartedAt = i;
        }
        if (!applicableOpts.removeHTMLComments) {
          applicableOpts.removeHTMLComments = true;
        }
      }
      if (!doNothing && withinStyleTag && styleCommentStartedAt === null && str.startsWith("</style", i) && !isLetter(str[i + 7])) {
        withinStyleTag = false;
      } else if (!doNothing && !withinStyleTag && styleCommentStartedAt === null && str.startsWith("<style", i) && !isLetter(str[i + 6])) {
        withinStyleTag = true;
        if ((opts.removeLineBreaks || opts.removeIndentations) && opts.breakToTheLeftOf.includes("<style") && str.startsWith(` type="text/css">`, i + 6) && str[i + 24]) {
          finalIndexesToDelete.push(i + 23, i + 23, lineEnding);
        }
      }
      if (!doNothing && !withinInlineStyle && `"'`.includes(str[i]) && str.endsWith("style=", i)) {
        withinInlineStyle = i;
      }
      if (!doNothing && !str[i].trim()) {
        if (whitespaceStartedAt === null) {
          whitespaceStartedAt = i;
        }
      } else if (!doNothing && !((withinStyleTag || withinInlineStyle) && styleCommentStartedAt !== null)) {
        if (whitespaceStartedAt !== null) {
          if (opts.removeLineBreaks) {
            countCharactersPerLine += 1;
          }
          if (beginningOfAFile) {
            beginningOfAFile = false;
            if (opts.removeIndentations || opts.removeLineBreaks) {
              finalIndexesToDelete.push(0, i);
            }
          } else {
            if (opts.removeIndentations && !opts.removeLineBreaks) {
              if (!nonWhitespaceCharMet && lastLinebreak !== null && i > lastLinebreak) {
                finalIndexesToDelete.push(lastLinebreak + 1, i);
              } else if (whitespaceStartedAt + 1 < i) {
                if (
                str.endsWith("]>", whitespaceStartedAt) ||
                str.endsWith("-->", whitespaceStartedAt) ||
                str.startsWith("<![", i) ||
                str.startsWith("<!--<![", i)) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i);
                } else if (str[whitespaceStartedAt] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
                } else if (str[~-i] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt, ~-i);
                } else {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, " ");
                }
              }
            }
            if (opts.removeLineBreaks || withinInlineStyle) {
              if (breakToTheLeftOfFirstLetters.includes(str[i]) && matchRightIncl(str, i, opts.breakToTheLeftOf)) {
                if (
                !(`\r\n`.includes(str[~-i]) && whitespaceStartedAt === ~-i) &&
                !(str[~-i] === "\n" && str[i - 2] === "\r" && whitespaceStartedAt === i - 2)) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, lineEnding);
                }
                stageFrom = null;
                stageTo = null;
                stageAdd = null;
                whitespaceStartedAt = null;
                countCharactersPerLine = 1;
                continue;
              }
              let whatToAdd = " ";
              if (
              str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
                cb: nextChar => !nextChar || !/\w/.test(nextChar)
              })
              ) ; else if (str[~-whitespaceStartedAt] && DELETE_TIGHTLY_IF_ON_LEFT_IS.includes(str[~-whitespaceStartedAt]) && DELETE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[i]) || (withinStyleTag || withinInlineStyle) && styleCommentStartedAt === null && (DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS.includes(str[~-whitespaceStartedAt]) || DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[i])) || str.startsWith("!important", i) && !withinHTMLConditional || withinInlineStyle && (str[~-whitespaceStartedAt] === "'" || str[~-whitespaceStartedAt] === '"') || str[~-whitespaceStartedAt] === "}" && str.startsWith("</style", i) || str[i] === ">" && (`'"`.includes(str[left(str, i)]) || str[right(str, i)] === "<") || str[i] === "/" && str[right(str, i)] === ">") {
                whatToAdd = "";
                if (str[i] === "/" && str[i + 1] === ">" && right(str, i) && right(str, i) > i + 1) {
                  finalIndexesToDelete.push(i + 1, right(str, i));
                  countCharactersPerLine -= right(str, i) - i + 1;
                }
              }
              if (whatToAdd && whatToAdd.length) {
                countCharactersPerLine += 1;
              }
              if (!opts.lineLengthLimit) {
                if (!(i === whitespaceStartedAt + 1 &&
                whatToAdd === " ")) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, whatToAdd);
                }
              } else {
                if (countCharactersPerLine >= opts.lineLengthLimit || !str[i + 1] || str[i] === ">" || str[i] === "/" && str[i + 1] === ">") {
                  if (countCharactersPerLine > opts.lineLengthLimit || countCharactersPerLine === opts.lineLengthLimit && str[i + 1] && str[i + 1].trim() && !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) && !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i + 1])) {
                    whatToAdd = lineEnding;
                    countCharactersPerLine = 1;
                  }
                  if (countCharactersPerLine > opts.lineLengthLimit || !(whatToAdd === " " && i === whitespaceStartedAt + 1)) {
                    finalIndexesToDelete.push(whitespaceStartedAt, i, whatToAdd);
                    lastLinebreak = null;
                  }
                  stageFrom = null;
                  stageTo = null;
                  stageAdd = null;
                } else if (stageFrom === null || whitespaceStartedAt < stageFrom) {
                  stageFrom = whitespaceStartedAt;
                  stageTo = i;
                  stageAdd = whatToAdd;
                }
              }
            }
          }
          whitespaceStartedAt = null;
          if (!nonWhitespaceCharMet) {
            nonWhitespaceCharMet = true;
          }
        } else {
          if (beginningOfAFile) {
            beginningOfAFile = false;
          }
          if (opts.removeLineBreaks) {
            countCharactersPerLine += 1;
          }
        }
        if (!nonWhitespaceCharMet) {
          nonWhitespaceCharMet = true;
        }
      }
      if (!doNothing && !beginningOfAFile && i !== 0 && opts.removeLineBreaks && (opts.lineLengthLimit || breakToTheLeftOfFirstLetters) && !str.startsWith("</a", i)) {
        if (breakToTheLeftOfFirstLetters && matchRightIncl(str, i, opts.breakToTheLeftOf) && str.slice(0, i).trim() && (!str.startsWith("<![endif]", i) || !matchLeft(str, i, "<!--"))) {
          finalIndexesToDelete.push(i, i, lineEnding);
          stageFrom = null;
          stageTo = null;
          stageAdd = null;
          countCharactersPerLine = 1;
          continue;
        } else if (opts.lineLengthLimit && countCharactersPerLine <= opts.lineLengthLimit) {
          if (!str[i + 1] || CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) && !CHARS_DONT_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) || CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) || !str[i].trim()) {
            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) {
              let whatToAdd = stageAdd;
              if (str[i].trim() && str[i + 1] && str[i + 1].trim() && countCharactersPerLine + (stageAdd ? stageAdd.length : 0) > opts.lineLengthLimit) {
                whatToAdd = lineEnding;
              }
              if (countCharactersPerLine + (whatToAdd ? whatToAdd.length : 0) > opts.lineLengthLimit || !(whatToAdd === " " && stageTo === stageFrom + 1 && str[stageFrom] === " ")) {
                if (!(str[~-stageFrom] === "}" && str[stageTo] === "{")) {
                  finalIndexesToDelete.push(stageFrom, stageTo, whatToAdd);
                  lastLinebreak = null;
                }
              } else {
                countCharactersPerLine -= lastLinebreak || 0;
              }
            }
            if (str[i].trim() && (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) || str[~-i] && CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[~-i])) && isStr(leftTagName) && (!tagName || !opts.mindTheInlineTags.includes(tagName)) && !(str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
              cb: nextChar => !nextChar || !/\w/.test(nextChar)
            })) && !(str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
              trimCharsBeforeMatching: "/",
              cb: nextChar => !nextChar || !/\w/.test(nextChar)
            }))) {
              stageFrom = i;
              stageTo = i;
              stageAdd = null;
            } else if (styleCommentStartedAt === null && stageFrom !== null && (withinInlineStyle || !opts.mindTheInlineTags || !Array.isArray(opts.mindTheInlineTags) || Array.isArray(opts.mindTheInlineTags.length) && !opts.mindTheInlineTags.length || !isStr(tagName) || Array.isArray(opts.mindTheInlineTags) && opts.mindTheInlineTags.length && isStr(tagName) && !opts.mindTheInlineTags.includes(tagName)) && !(str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
              trimCharsBeforeMatching: "/",
              cb: nextChar => !nextChar || !/\w/.test(nextChar)
            }))) {
              stageFrom = null;
              stageTo = null;
              stageAdd = null;
            }
          }
        } else if (opts.lineLengthLimit) {
          if (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) && !(str[i] === "<" && matchRight(str, i, opts.mindTheInlineTags, {
            trimCharsBeforeMatching: "/",
            cb: nextChar => !nextChar || !/\w/.test(nextChar)
          }))) {
            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) {
              const whatToAddLength = stageAdd && stageAdd.length ? stageAdd.length : 0;
              if (countCharactersPerLine - (stageTo - stageFrom - whatToAddLength) - 1 > opts.lineLengthLimit) ; else {
                finalIndexesToDelete.push(stageFrom, stageTo, stageAdd);
                if (countCharactersPerLine - (stageTo - stageFrom - whatToAddLength) - 1 === opts.lineLengthLimit) {
                  finalIndexesToDelete.push(i, i, lineEnding);
                  countCharactersPerLine = 0;
                }
                stageFrom = null;
                stageTo = null;
                stageAdd = null;
              }
            } else {
              finalIndexesToDelete.push(i, i, lineEnding);
              countCharactersPerLine = 0;
            }
          } else if (str[i + 1] && CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) && isStr(tagName) && Array.isArray(opts.mindTheInlineTags) && opts.mindTheInlineTags.length && !opts.mindTheInlineTags.includes(tagName)) {
            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) ; else {
              finalIndexesToDelete.push(i + 1, i + 1, lineEnding);
              countCharactersPerLine = 0;
            }
          } else if (!str[i].trim()) ; else if (!str[i + 1]) {
            if (stageFrom !== null && stageTo !== null && (stageFrom !== stageTo || stageAdd && stageAdd.length)) {
              finalIndexesToDelete.push(stageFrom, stageTo, lineEnding);
            }
          }
        }
      }
      if (!doNothing && !beginningOfAFile && opts.removeLineBreaks && opts.lineLengthLimit && countCharactersPerLine >= opts.lineLengthLimit && stageFrom !== null && stageTo !== null && !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) && !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) && !"/".includes(str[i])) {
        if (!(countCharactersPerLine === opts.lineLengthLimit && str[i + 1] && !str[i + 1].trim())) {
          let whatToAdd = lineEnding;
          if (str[i + 1] && !str[i + 1].trim() && countCharactersPerLine === opts.lineLengthLimit) {
            whatToAdd = stageAdd;
          }
          if (whatToAdd === lineEnding && !str[~-stageFrom].trim() && left(str, stageFrom)) {
            stageFrom = left(str, stageFrom) + 1;
          }
          finalIndexesToDelete.push(stageFrom, stageTo, whatToAdd);
          countCharactersPerLine = i - stageTo;
          if (str[i].length) {
            countCharactersPerLine += 1;
          }
          stageFrom = null;
          stageTo = null;
          stageAdd = null;
        }
      }
      if (!doNothing && str[i] === "\n" || str[i] === "\r" && (!str[i + 1] || str[i + 1] && str[i + 1] !== "\n")) {
        lastLinebreak = i;
        if (nonWhitespaceCharMet) {
          nonWhitespaceCharMet = false;
        }
        if (!opts.removeLineBreaks && whitespaceStartedAt !== null && whitespaceStartedAt < i && str[i + 1] && str[i + 1] !== "\r" && str[i + 1] !== "\n") {
          finalIndexesToDelete.push(whitespaceStartedAt, i);
        }
      }
      if (!str[i + 1]) {
        if (withinStyleTag && styleCommentStartedAt !== null) {
          finalIndexesToDelete.push(...expander({
            str,
            from: styleCommentStartedAt,
            to: i,
            ifLeftSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS ,
            ifRightSideIncludesThisThenCropTightly: DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS 
          }));
        } else if (whitespaceStartedAt && str[i] !== "\n" && str[i] !== "\r") {
          finalIndexesToDelete.push(whitespaceStartedAt, i + 1);
        } else if (whitespaceStartedAt && (str[i] === "\r" && str[i + 1] === "\n" || str[i] === "\n" && str[i - 1] !== "\r")) {
          finalIndexesToDelete.push(whitespaceStartedAt, i);
        }
      }
      if (!doNothing && withinInlineStyle && withinInlineStyle < i && str[withinInlineStyle] === str[i]) {
        withinInlineStyle = null;
      }
      if (!doNothing && !withinStyleTag && str.startsWith("<pre", i) && !isLetter(str[i + 4])) {
        const locationOfClosingPre = str.indexOf("</pre", i + 5);
        if (locationOfClosingPre > 0) {
          doNothing = locationOfClosingPre;
        }
      }
      if (!doNothing && !withinStyleTag && str.startsWith("<code", i) && !isLetter(str[i + 5])) {
        const locationOfClosingCode = str.indexOf("</code", i + 5);
        if (locationOfClosingCode > 0) {
          doNothing = locationOfClosingCode;
        }
      }
      if (!doNothing && str.startsWith("<![CDATA[", i)) {
        const locationOfClosingCData = str.indexOf("]]>", i + 9);
        if (locationOfClosingCData > 0) {
          doNothing = locationOfClosingCData;
        }
      }
      if (!doNothing && !withinStyleTag && !withinInlineStyle && tagNameStartsAt !== null && str[i] === ">") {
        if (str[right(str, i)] === "<") {
          leftTagName = tagName;
        }
        tagNameStartsAt = null;
        tagName = null;
      }
      if (str[i] === "<" && leftTagName !== null) {
        leftTagName = null;
      }
    }
    if (finalIndexesToDelete.current()) {
      const ranges = finalIndexesToDelete.current();
      finalIndexesToDelete.wipe();
      const startingPercentageDone = opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage;
      const res = rApply(str, ranges, applyPercDone => {
        if (opts.reportProgressFunc && len >= 2000) {
          currentPercentageDone = Math.floor(startingPercentageDone + (opts.reportProgressFuncTo - startingPercentageDone) * (applyPercDone / 100));
          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      });
      const resLen = res.length;
      return {
        log: {
          timeTakenInMilliseconds: Date.now() - start,
          originalLength: len,
          cleanedLength: resLen,
          bytesSaved: Math.max(len - resLen, 0),
          percentageReducedOfOriginal: len ? Math.round(Math.max(len - resLen, 0) * 100 / len) : 0
        },
        ranges,
        applicableOpts,
        result: res
      };
    }
  }
  return {
    log: {
      timeTakenInMilliseconds: Date.now() - start,
      originalLength: len,
      cleanedLength: len,
      bytesSaved: 0,
      percentageReducedOfOriginal: 0
    },
    applicableOpts,
    ranges: null,
    result: str
  };
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
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
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
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
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
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
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

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
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative(root, 'Map'),
    Set$1 = getNative(root, 'Set'),
    nativeCreate = getNative(Object, 'create');

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
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
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
}

// Add methods to `ListCache`.
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
    'hash': new Hash,
    'map': new (Map$1 || ListCache),
    'string': new Hash
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
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

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
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set$1 && (1 / setToArray(new Set$1([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set$1(values);
};

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
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
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
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
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
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each
 * element is kept.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
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
  return value === other || (value !== value && other !== other);
}

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
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

var lodash_uniq = uniq;

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
const regexEmptyStyleTag = /[\n]?\s*<style[^>]*>\s*<\/style\s*>/g;
const regexEmptyMediaQuery = /[\n]?\s*@(media|supports|document)[^{]*{\s*}/g;
const regexEmptyUnclosedMediaQuery = /@media[^{@}]+{(?=\s*<\/style>)/g;
// proper plain object checks such as lodash's cost more perf than this below
function isObj(something) {
    return (something && typeof something === "object" && !Array.isArray(something));
}
function hasOwnProp(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
function isLatinLetter(char) {
    // we mean Latin letters A-Z, a-z
    return (typeof char === "string" &&
        char.length === 1 &&
        ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
            (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123)));
}

const version = version$1;
const defaults = {
    whitelist: [],
    backend: [],
    uglify: false,
    removeHTMLComments: true,
    removeCSSComments: true,
    doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100,
};
/**
 * Remove unused CSS from email templates
 */
function comb(str, originalOpts) {
    const start = Date.now();
    const finalIndexesToDelete = new Ranges({ limitToBeAddedWhitespace: true });
    const currentChunksMinifiedSelectors = new Ranges();
    const lineBreaksToDelete = new Ranges();
    // PS. badChars is also used
    function characterSuitableForNames(char) {
        return /[-_A-Za-z0-9]/.test(char); // notice, there's no dot or hash!
    }
    function resetBodyClassOrId(initObj = {}) {
        return {
            valuesStart: null,
            valueStart: null,
            nameStart: null,
            quoteless: false,
            ...initObj,
        };
    }
    let styleStartedAt;
    let styleEndedAt;
    const headSelectorsArr = [];
    const bodyClassesArr = [];
    const bodyIdsArr = [];
    // const selectorsRemovedDuringRoundOne = [];
    let commentStartedAt;
    let commentNearlyStartedAt;
    let bodyStartedAt;
    let bodyClass;
    let bodyId;
    const headSelectorsCount = {};
    // for each single character traversed on any FOR loop, we increment this counter:
    let totalCounter = 0;
    let checkingInsideCurlyBraces;
    let insideCurlyBraces;
    let uglified = null;
    let allClassesAndIdsWithinHeadFinalUglified = [];
    let countAfterCleaning = 0;
    let countBeforeCleaning = 0;
    let curliesDepth = 0;
    // this flag is on just for the first class or id value on the class/id within body
    // we use it to check leading whitespace, not to waste resources on 2nd class/id
    // onwards..
    let bodyItsTheFirstClassOrId;
    // marker to identify bogus comments. Bogus comments according to the HTML spec
    // are when there's opening bracket and exclamation mark, not followed by doctype
    // or two dashes. In that case, comment is considered to be everything up to
    // the first encountered closing bracket. That's opposed to the healthy comment
    // where only "-->" is considered to be a closing mark.
    let bogusHTMLComment;
    // ---------------------------------------------------------------------------
    // the two below are used to identify where to delete the selectors:
    // the following marker is for marking the beginning of where we would delete
    // the whole "line" in head CSS. For example:
    //
    // <style type="text/css"><----------- rule chunk #1 starts here
    //   .unused1[z], .unused2 {a:1;}<---- rule chunk #1 ends here
    //   .used[z] {a:2;}<----------------- rule chunk #2 ends here
    //
    // * In case of "unused1" class (chunk #1), "ruleChunkStartedAt" would be the
    // index of line break after ">".
    // * In case of "used" class, the "ruleChunkStartedAt" would be the line
    // break after "{a:1;}".
    //
    // TLDR; It's used to mark from where to delete the whole "style" (line if you may):
    let ruleChunkStartedAt;
    // ---------------------------------------------------------------------------
    // the following marker is for marking the beginning of a selector, where we
    // would delete only that particular selector. It will be used when we can't
    // delete the whole line.
    // For example:
    //
    //       <style type="text/css">
    //         .unused1[z].unused2, .used[z] {a:1;}
    //         |                 |
    //         <-selector chunk ->
    //
    //
    // We've got two classes, "used" and "unused". We must delete only
    // ".unused1[z].unused2".
    // The following marker would mark where to delete from.
    // When we traverse the whole string, it will be reassigned again and again
    // as we shift through each selector:
    //
    // TLDR; It's used to mark from where to delete only that selector, usually
    // marking pieces between commas and brackets and curlies:
    let selectorChunkStartedAt;
    // flag used to mark can the selector chunk be deleted (in Round 2 only)
    let selectorChunkCanBeDeleted = false;
    //               ALSO,
    //       <style type="text/css">
    //         .unused1[z].unused2, .used[z] {a:1;}
    //         |         |
    //         | single  |
    //    ---> | selector| <---
    let singleSelectorStartedAt;
    // Used in marking is it class or id (because there's no dot/hash in front
    // when square bracket notation is used), for example:
    //
    // a[class="used"]{x:1;}
    //
    // in which case, singleSelectorType would be === "."
    let singleSelectorType;
    // ---------------------------------------------------------------------------
    // marker to identify when we can delete the whole CSS declaration (or "line" if you keep one style-per-line)
    //       <style type="text/css">
    //         .unused1[z].unused2, .unused3[z] {a:1;}
    //         |                                     |
    //    ---> | means we can delete all this        | <---
    let headWholeLineCanBeDeleted;
    // if used chunk is followed by bunch of unused chunks, that comma that follows
    // used chunk needs to be deleted. Last chunk's comma is registered at index:
    // lastKeptChunksCommaAt and flag which instructs to delete it is the
    // "onlyDeletedChunksFollow":
    let lastKeptChunksCommaAt = null;
    let onlyDeletedChunksFollow = false;
    // marker to identify when we can delete the whole id or class, not just some of classes/id's inside
    let bodyClassOrIdCanBeDeleted;
    // copy of the first round's ranges, used to skip the same ranges
    // in round 2:
    let round1RangesClone;
    // counters:
    let nonIndentationsWhitespaceLength = 0;
    let commentsLength = 0;
    // same as used in string-extract-class-names
    const badChars = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\`\t\n`;
    // Rules which might wrap the media queries, for example:
    // @supports (display: grid) {...
    // We need to process their contents only (and disregard their curlies).
    const atRulesWhichMightWrapStyles = ["media", "supports", "document"];
    // One-liners like:
    // "@charset "utf-8";"
    // and one-liners with URL's:
    // @import url("https://codsen.com/style.css");
    const atRulesWhichNeedToBeIgnored = [
        "font-feature-values",
        "counter-style",
        "namespace",
        "font-face",
        "keyframes",
        "viewport",
        "charset",
        "import",
        "page",
    ];
    const atRuleBreakCharacters = ["{", "(", "<", '"', "'", "@", ";"];
    // insurance
    if (typeof str !== "string") {
        throw new TypeError(`email-comb: [THROW_ID_01] Input must be string! Currently it's ${typeof str}`);
    }
    if (originalOpts && !isObj(originalOpts)) {
        throw new TypeError(`email-comb: [THROW_ID_02] Options, second input argument, must be a plain object! Currently it's ${typeof originalOpts}, equal to: ${JSON.stringify(originalOpts, null, 4)}`);
    }
    const opts = { ...defaults, ...originalOpts };
    // arrayiffy if string:
    if (typeof opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains === "string") {
        opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains = [
            opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains,
        ].filter((val) => val.trim());
    }
    if (typeof opts.whitelist === "string") {
        opts.whitelist = [opts.whitelist];
    }
    else if (!Array.isArray(opts.whitelist)) {
        throw new TypeError(`email-comb: [THROW_ID_03] opts.whitelist should be an array, but it was customised to a wrong thing, ${JSON.stringify(opts.whitelist, null, 4)}`);
    }
    if (opts.whitelist.length > 0 &&
        !opts.whitelist.every((el) => typeof el === "string")) {
        throw new TypeError(`email-comb: [THROW_ID_04] opts.whitelist array should contain only string-type elements. Currently we\ve got:\n${JSON.stringify(opts.whitelist, null, 4)}`);
    }
    if (!Array.isArray(opts.backend)) {
        throw new TypeError(`email-comb: [THROW_ID_05] opts.backend should be an array, but it was customised to a wrong thing, ${JSON.stringify(opts.backend, null, 4)}`);
    }
    if (opts.backend.length > 0 && opts.backend.some((val) => !isObj(val))) {
        throw new TypeError(`email-comb: [THROW_ID_06] opts.backend array should contain only plain objects but it contains something else:\n${JSON.stringify(opts.backend, null, 4)}`);
    }
    if (opts.backend.length > 0 &&
        !opts.backend.every((obj) => hasOwnProp(obj, "heads") && hasOwnProp(obj, "tails"))) {
        throw new TypeError(`email-comb: [THROW_ID_07] every object within opts.backend should contain keys "heads" and "tails" but currently it's not the case. Whole "opts.backend" value array is currently equal to:\n${JSON.stringify(opts.backend, null, 4)}`);
    }
    if (typeof opts.uglify !== "boolean") {
        if (opts.uglify === 1 || opts.uglify === 0) {
            opts.uglify = !!opts.uglify; // turn it into a Boolean
        }
        else {
            throw new TypeError(`email-comb: [THROW_ID_08] opts.uglify should be a Boolean. Currently it's set to: ${JSON.stringify(opts.uglify, null, 4)}}`);
        }
    }
    if (opts.reportProgressFunc &&
        typeof opts.reportProgressFunc !== "function") {
        throw new TypeError(`email-comb: [THROW_ID_09] opts.reportProgressFunc should be a function but it was given as :\n${JSON.stringify(opts.reportProgressFunc, null, 4)} (${typeof opts.reportProgressFunc})`);
    }
    let allHeads = null;
    let allTails = null;
    if (Array.isArray(opts.backend) && opts.backend.length) {
        allHeads = opts.backend.map((headsAndTailsObj) => headsAndTailsObj.heads);
        allTails = opts.backend.map((headsAndTailsObj) => headsAndTailsObj.tails);
    }
    const len = str.length;
    const leavePercForLastStage = 0.06; // in range of [0, 1]
    let ceil = 1;
    if (opts.reportProgressFunc) {
        // ceil is middle of the range [0, 100], or whatever it was customised to,
        // [opts.reportProgressFuncFrom, opts.reportProgressFuncTo].
        // Also, leavePercForLastStage needs to be left to next stage, so "100" or
        // "opts.reportProgressFuncTo" is multiplied by (1 - leavePercForLastStage).
        ceil = Math.floor((opts.reportProgressFuncTo -
            (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) *
                leavePercForLastStage -
            opts.reportProgressFuncFrom) /
            2);
    }
    let trailingLinebreakLengthCorrection = 0;
    if (!str.length || !"\r\n".includes(str[str.length - 1])) {
        // if there's no trailing line break in the input, mark this because
        // output will have it and we need to consider this for matematically
        // precise calculations:
        trailingLinebreakLengthCorrection = 1;
    }
    // global "do nothing" flag. When active, nothing is done, characters are just skipped.
    let doNothing;
    // when "doNothing" is on, only the following value can stop it:
    let doNothingUntil;
    let allClassesAndIdsThatWereCompletelyDeletedFromHead = [];
    let allClassesAndIdsWithinHeadFinal = [];
    let allClassesAndIdsWithinHead = [];
    let allClassesAndIdsWithinBody = [];
    let headSelectorsCountClone = {};
    let currentPercentageDone;
    let stateWithinStyleTag;
    let currentlyWithinQuotes;
    let whitespaceStartedAt;
    let bodyClassesToDelete = [];
    let lastPercentage = 0;
    let stateWithinBody;
    let bodyIdsToDelete = [];
    let bodyCssToDelete = [];
    let headCssToDelete = [];
    let currentChunk;
    let canDelete;
    let usedOnce;
    // ---------------------------------------------------------------------------
    // this is the main FOR loop which will traverse the input string twice:
    for (let round = 1; round <= 2; round++) {
        checkingInsideCurlyBraces = false;
        selectorChunkStartedAt = null;
        selectorChunkCanBeDeleted = false;
        bodyClassOrIdCanBeDeleted = true;
        headWholeLineCanBeDeleted = true;
        bodyClass = resetBodyClassOrId();
        bodyItsTheFirstClassOrId = true;
        onlyDeletedChunksFollow = false;
        singleSelectorStartedAt = null;
        bodyId = resetBodyClassOrId();
        commentNearlyStartedAt = null;
        lastKeptChunksCommaAt = null;
        currentlyWithinQuotes = null;
        stateWithinStyleTag = false;
        whitespaceStartedAt = null;
        insideCurlyBraces = false;
        ruleChunkStartedAt = null;
        stateWithinBody = false;
        commentStartedAt = null;
        doNothingUntil = null;
        styleStartedAt = null;
        bodyStartedAt = null;
        currentChunk = null;
        styleEndedAt = null;
        doNothing = false;
        //                    inner FOR loop starts
        //                              |
        //                              |
        //                              |
        //                              |
        //                              |
        //                              |
        //                              |
        //                              |
        //                              |
        //                              V
        totalCounter += len;
        // eslint-disable-next-line no-restricted-syntax
        stepouter: for (let i = 0; i < len; i++) {
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //
            //                        RULES AT THE TOP
            //
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            // Report the progress. We'll allocate 94% (47% + 47% on each traversal)
            // of the total progress bar to this stage. Now that's considering the
            // opts.reportProgressFuncFrom and opts.reportProgressFuncTo are 0-to-100.
            // If either is skewed then the value will be in that range accordingly.
            if (opts.reportProgressFunc) {
                if (len > 1000 && len < 2000) {
                    // if input is too short, just call once, for the middle value
                    if (round === 1 && i === 0) {
                        opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2) // if range is [0, 100], this would be 50
                        );
                    }
                }
                else if (len >= 2000) {
                    // defaults:
                    // opts.reportProgressFuncFrom = 0
                    // opts.reportProgressFuncTo = 100
                    currentPercentageDone =
                        opts.reportProgressFuncFrom +
                            Math.floor((i / len) * ceil) +
                            (round === 1 ? 0 : ceil);
                    if (currentPercentageDone !== lastPercentage) {
                        lastPercentage = currentPercentageDone;
                        opts.reportProgressFunc(currentPercentageDone);
                    }
                }
            }
            const chr = str[i];
            // count line endings:
            if (str[i] === "\n") {
                if (str[i - 1] === "\r") ;
            }
            else if (str[i] === "\r" && str[i + 1] !== "\n") ;
            if (stateWithinStyleTag !== true &&
                // a) either it's the first style tag and currently we haven't traversed
                // it's closing yet:
                ((styleEndedAt === null &&
                    styleStartedAt !== null &&
                    i >= styleStartedAt) ||
                    // b) or, style tag was closed, later another-one was opened and we
                    // haven't traversed through its closing tag yet:
                    (styleStartedAt !== null &&
                        styleEndedAt !== null &&
                        styleStartedAt > styleEndedAt &&
                        styleStartedAt < i))) {
                // ---------------------------------------------------------------------
                stateWithinStyleTag = true;
                stateWithinBody = false;
            }
            else if (stateWithinBody !== true &&
                bodyStartedAt !== null &&
                (styleStartedAt === null || styleStartedAt < i) &&
                (styleEndedAt === null || styleEndedAt < i)) {
                stateWithinBody = true;
                stateWithinStyleTag = false;
            }
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //
            //                       RULES AT THE MIDDLE
            //
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            // =============================================
            if (!doNothing && (str[i] === '"' || str[i] === "'")) {
                // head: protection against false early curlie endings
                // if we are "insideCurlyBraces" and any kind of quote is detected,
                // traverse until the same is met again, ignore any curlies within.
                if (!currentlyWithinQuotes) {
                    const leftSideIdx = left(str, i);
                    if (typeof leftSideIdx === "number" &&
                        ((stateWithinStyleTag &&
                            ["(", ",", ":"].includes(str[leftSideIdx])) ||
                            (stateWithinBody &&
                                !stateWithinStyleTag &&
                                ["(", ",", ":", "="].includes(str[leftSideIdx])))) {
                        currentlyWithinQuotes = str[i];
                    }
                }
                else if ((str[i] === `"` &&
                    str[right(str, i)] === `'` &&
                    str[right(str, right(str, i))] === `"`) ||
                    (str[i] === `'` &&
                        str[right(str, i)] === `"` &&
                        str[right(str, right(str, i))] === `'`)) {
                    i = right(str, right(str, i));
                    continue;
                }
                else if (currentlyWithinQuotes === str[i]) {
                    currentlyWithinQuotes = null;
                }
            }
            // everywhere: stop the "doNothing"
            // ================
            if (doNothing) {
                if (doNothingUntil === null ||
                    typeof doNothingUntil !== "string" ||
                    (typeof doNothingUntil === "string" && !doNothingUntil)) {
                    // it's some bad case scenario/bug, just turn off the "doNothing"
                    doNothing = false;
                    // just turn it off and move on.
                }
                else if (matchRightIncl(str, i, doNothingUntil)) {
                    // Normally doNothingUntil is a single character.
                    // However, when matching back-end characters, it can be multiple chars.
                    // That's why above we can't compare with '===' and need the
                    // "string-match-left-right" library.
                    // 1. COMMENTS-RELATED SKIPS ARE TENDED SEPARATELY:
                    if (commentStartedAt !== null) {
                        // submit the comment characters range for deletion:
                        // logging:
                        if (round === 1 && opts.removeCSSComments) {
                            const lineBreakPresentOnTheLeft = matchLeft(str, commentStartedAt, ["\r\n", "\n", "\r"]);
                            let startingIndex = commentStartedAt;
                            if (typeof lineBreakPresentOnTheLeft === "string" &&
                                lineBreakPresentOnTheLeft.length) {
                                startingIndex -= lineBreakPresentOnTheLeft.length;
                            }
                            if (str[startingIndex - 1] &&
                                characterSuitableForNames(str[startingIndex - 1]) &&
                                str[i + doNothingUntil.length] &&
                                characterSuitableForNames(str[i + doNothingUntil.length])) {
                                finalIndexesToDelete.push(startingIndex, i + doNothingUntil.length, ";");
                                commentsLength += i + doNothingUntil.length - startingIndex;
                            }
                            else {
                                finalIndexesToDelete.push(startingIndex, i + doNothingUntil.length);
                                commentsLength += i + doNothingUntil.length - startingIndex;
                            }
                        }
                        commentStartedAt = null;
                    }
                    // 2. ALL OTHER CASES OF "DO-NOTHING":
                    // offset the index:
                    i = i + doNothingUntil.length - 1;
                    // Switch off the mode
                    doNothingUntil = null;
                    doNothing = false;
                    continue;
                }
            }
            // head: pinpoint any <style... tag, anywhere within the given HTML
            // ================
            if (!doNothing &&
                str[i] === "<" &&
                str[i + 1] === "s" &&
                str[i + 2] === "t" &&
                str[i + 3] === "y" &&
                str[i + 4] === "l" &&
                str[i + 5] === "e") {
                checkingInsideCurlyBraces = true;
                if (!stateWithinStyleTag) {
                    stateWithinStyleTag = true;
                }
                for (let y = i; y < len; y++) {
                    totalCounter += 1;
                    if (str[y] === ">") {
                        styleStartedAt = y + 1;
                        ruleChunkStartedAt = y + 1;
                        // We can offset the main index ("jump" to an already-traversed closing
                        // closing bracket character of <style.....> tag because this tag
                        // will not have any CLASS or ID attributes).
                        // We would not do that with BODY tag for example.
                        // Offset the index because we traversed it already:
                        // i = y;
                        break;
                        // continue stepouter;
                    }
                }
            }
            // head: pinpoint closing style tag, </style>
            // It's not that easy.
            // There can be whitespace to the left and right of closing slash.
            // ================
            if (!doNothing &&
                stateWithinStyleTag &&
                str[i] === "<" &&
                str[i + 1] === "/" &&
                str[i + 2] === "s" &&
                str[i + 3] === "t" &&
                str[i + 4] === "y" &&
                str[i + 5] === "l" &&
                str[i + 6] === "e") {
                // TODO: take care of any spaces around: 1. slash; 2. brackets
                styleEndedAt = i - 1;
                // we don't need the chunk end tracking marker any more
                ruleChunkStartedAt = null;
                checkingInsideCurlyBraces = false;
                if (stateWithinStyleTag) {
                    stateWithinStyleTag = false;
                }
            }
            // mark where CSS comments start - ROUND 1-only rule
            // ================
            if (round === 1 &&
                (stateWithinStyleTag || stateWithinBody) &&
                str[i] === "/" &&
                str[i + 1] === "*" &&
                commentStartedAt === null) {
                // 1. mark the beginning
                commentStartedAt = i;
                // 2. activate doNothing:
                doNothing = true;
                doNothingUntil = "*/";
                // just over the "*":
                i += 1;
                continue;
            }
            // pinpoint "@"
            if (!doNothing && stateWithinStyleTag && str[i] === "@") {
                // since we are going to march forward, rest the whitespaceStartedAt
                // marker since it might not get reset otherwise
                if (whitespaceStartedAt) {
                    whitespaceStartedAt = null;
                }
                const matchedAtTagsName = matchRight(str, i, atRulesWhichMightWrapStyles) ||
                    matchRight(str, i, atRulesWhichNeedToBeIgnored);
                if (typeof matchedAtTagsName === "string") {
                    let temp;
                    // rare case when semicolon follows the at-tag - in that
                    // case, we remove the at-rule because it's broken
                    if (str[i + matchedAtTagsName.length + 1] === ";" ||
                        (str[i + matchedAtTagsName.length + 1] &&
                            !str[i + matchedAtTagsName.length + 1].trim() &&
                            matchRight(str, i + matchedAtTagsName.length + 1, ";", {
                                trimBeforeMatching: true,
                                cb: (_char, _theRemainderOfTheString, index) => {
                                    temp = index;
                                    return true;
                                },
                            }))) {
                        finalIndexesToDelete.push(i, temp || i + matchedAtTagsName.length + 2);
                    }
                    // these can wrap styles and each other and their pesky curlies can throw
                    // our algorithm off-track. We need to jump past the chunk from "@..."
                    // to, and including, first curly bracket. But mind the dirty code cases.
                    let secondaryStopper;
                    for (let z = i + 1; z < len; z++) {
                        totalCounter += 1;
                        // ------------------------------------------------------------------
                        // a secondary stopper is any character which must be matched with its
                        // closing counterpart before anything continues. For example, we look
                        // for semicolon. On the way, we encounter an opening bracket. Now,
                        // we must march forward until we meet closing bracket. If, in the way,
                        // we encounter semicolon, it will be ignored, only closing bracket is
                        // what we look. When it is found, THEN continue looking for (new) semicolon.
                        // catch the start of Liquid/Nunjucks double opening curlies {{
                        let espTails = "";
                        if (str[z] === "{" && str[z + 1] === "{") {
                            espTails = "}}";
                        }
                        if (str[z] === "{" && str[z + 1] === "%") {
                            espTails = "%}";
                        }
                        if (espTails && str.includes(espTails, z + 1)) {
                            z = str.indexOf(espTails, z + 1) + espTails.length - 1;
                            continue;
                        }
                        else if (espTails) {
                            // if tails are not present, wipe them, for perf reasons
                            espTails = "";
                        }
                        // catch the ending of a secondary stopper
                        if (secondaryStopper && str[z] === secondaryStopper) {
                            if ((str[z] === "}" &&
                                atRulesWhichNeedToBeIgnored.includes(matchedAtTagsName)) ||
                                (str[z] === "{" &&
                                    atRulesWhichMightWrapStyles.includes(matchedAtTagsName))) {
                                i = z;
                                ruleChunkStartedAt = z + 1;
                                continue stepouter;
                            }
                            else {
                                secondaryStopper = undefined;
                                continue;
                                // continue stepouter;
                            }
                        }
                        // set the seconddary stopper
                        if (str[z] === '"' && !secondaryStopper) {
                            secondaryStopper = '"';
                        }
                        else if (str[z] === "'" && !secondaryStopper) {
                            secondaryStopper = "'";
                        }
                        else if (str[z] === "(" && !secondaryStopper) {
                            secondaryStopper = ")";
                        }
                        else if (atRulesWhichNeedToBeIgnored.includes(matchedAtTagsName) &&
                            str[z] === "{" &&
                            !secondaryStopper) {
                            secondaryStopper = "}";
                        }
                        // catch the final, closing character
                        if (!secondaryStopper && atRuleBreakCharacters.includes(str[z])) {
                            // ensure that any wrapped chunks get completely covered and their
                            // contents don't trigger any clauses. There can be links with "@"
                            // for example, and there can be stray tags like @media @media.
                            // These two different cases can be recognised by requiring that any
                            // wrapped chunks like {...} or (...) or "..." or '...' get covered
                            // completely before anything else is considered.
                            // bail out clauses
                            let pushRangeFrom;
                            let pushRangeTo;
                            // normal cases:
                            if (str[z] === "{" || str[z] === ";") {
                                insideCurlyBraces = false;
                                ruleChunkStartedAt = z + 1;
                                i = z;
                                continue stepouter;
                            }
                            else if (str[z] === "@" || str[z] === "<") {
                                if (round === 1 &&
                                    !str.slice(i, z).includes("{") &&
                                    !str.slice(i, z).includes("(") &&
                                    !str.slice(i, z).includes('"') &&
                                    !str.slice(i, z).includes("'")) {
                                    pushRangeFrom = i;
                                    pushRangeTo = z + (str[z] === ";" ? 1 : 0);
                                    finalIndexesToDelete.push(pushRangeFrom, pushRangeTo);
                                }
                            }
                            const iOffset = pushRangeTo
                                ? pushRangeTo - 1
                                : z - 1 + (str[z] === "{" ? 1 : 0);
                            i = iOffset;
                            ruleChunkStartedAt = iOffset + 1;
                            continue stepouter;
                        }
                    }
                }
            }
            // pinpoint closing curly braces
            // ================
            if (!doNothing &&
                stateWithinStyleTag &&
                insideCurlyBraces &&
                checkingInsideCurlyBraces &&
                chr === "}" &&
                !currentlyWithinQuotes &&
                !curliesDepth) {
                // submit whole chunk for deletion if applicable:
                if (round === 2 && headWholeLineCanBeDeleted && ruleChunkStartedAt) {
                    finalIndexesToDelete.push(ruleChunkStartedAt, i + 1);
                }
                insideCurlyBraces = false;
                if (ruleChunkStartedAt) {
                    ruleChunkStartedAt = i + 1;
                }
                // reset selectorChunkStartedAt:
                selectorChunkStartedAt = null;
                selectorChunkCanBeDeleted = false;
                headWholeLineCanBeDeleted = true;
                singleSelectorStartedAt = null;
                lastKeptChunksCommaAt = null;
                onlyDeletedChunksFollow = false;
            }
            // catch the beginning/ending of CSS selectors in head
            // ================
            // markers we'll be dealing with:
            // * selectorChunkStartedAt
            // * ruleChunkStartedAt
            // * selectorChunkCanBeDeleted
            // * singleSelectorStartedAt
            // * headWholeLineCanBeDeleted
            if (!doNothing &&
                !commentStartedAt &&
                styleStartedAt &&
                i >= styleStartedAt &&
                // a) either it's the first style tag and currently we haven't traversed
                // its closing yet:
                ((styleEndedAt === null && i >= styleStartedAt) ||
                    // b) or, style tag was closed, later another-one was opened and we
                    // haven't traversed through its closing tag yet:
                    (styleEndedAt &&
                        styleStartedAt > styleEndedAt &&
                        styleStartedAt <= i)) &&
                !insideCurlyBraces) {
                // TODO: skip all false-positive characters within quotes, like curlies
                // PART 1.
                // catch the START of single selectors (for example, "#head-only-id-2")
                // any character, not permitted in CSS class/id names stops the recording
                if (singleSelectorStartedAt === null) {
                    // catch the start of a single
                    if (chr === "." || chr === "#") {
                        singleSelectorStartedAt = i;
                    }
                    else if (matchLeft(str, i, "[class=")) {
                        if (isLatinLetter(chr)) {
                            singleSelectorStartedAt = i;
                            singleSelectorType = ".";
                        }
                        else if (`"'`.includes(chr) &&
                            isLatinLetter(str[right(str, i)])) {
                            singleSelectorStartedAt = right(str, i);
                            singleSelectorType = ".";
                        }
                    }
                    else if (matchLeft(str, i, "[id=")) {
                        if (isLatinLetter(chr)) {
                            singleSelectorStartedAt = i;
                            singleSelectorType = "#";
                        }
                        else if (`"'`.includes(chr) &&
                            isLatinLetter(str[right(str, i)])) {
                            singleSelectorStartedAt = right(str, i);
                            singleSelectorType = "#";
                        }
                    }
                    else if (chr.trim()) {
                        // logging:
                        if (chr === "}") {
                            ruleChunkStartedAt = i + 1;
                            currentChunk = null;
                        }
                        else if (chr === "<" && str[i + 1] === "!") {
                            // catch comment blocks, probably Outlook conditional comments
                            // like <!--[if mso]>
                            for (let y = i; y < len; y++) {
                                totalCounter += 1;
                                if (str[y] === ">") {
                                    ruleChunkStartedAt = y + 1;
                                    selectorChunkStartedAt = y + 1;
                                    i = y;
                                    continue stepouter;
                                }
                            }
                        }
                    }
                }
                // catch the END of a single selectors
                else if (singleSelectorStartedAt !== null &&
                    !characterSuitableForNames(chr)) {
                    let singleSelector = str.slice(singleSelectorStartedAt, i);
                    if (singleSelectorType) {
                        singleSelector = `${singleSelectorType}${singleSelector}`;
                        singleSelectorType = undefined;
                    }
                    if (round === 2 &&
                        !selectorChunkCanBeDeleted &&
                        headCssToDelete.includes(singleSelector)) {
                        selectorChunkCanBeDeleted = true;
                        onlyDeletedChunksFollow = true;
                    }
                    else if (round === 2 && !selectorChunkCanBeDeleted) {
                        // 1. uglify part
                        if (opts.uglify &&
                            (!Array.isArray(opts.whitelist) ||
                                !opts.whitelist.length ||
                                !matcher([singleSelector], opts.whitelist).length)) {
                            currentChunksMinifiedSelectors.push(singleSelectorStartedAt, i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf(singleSelector)]);
                        }
                        // 2. tend trailing comma issue (lastKeptChunksCommaAt and
                        // onlyDeletedChunksFollow):
                        if (chr === ",") {
                            lastKeptChunksCommaAt = i;
                            onlyDeletedChunksFollow = false;
                        }
                    }
                    if (chr === "." || chr === "#") {
                        singleSelectorStartedAt = i;
                    }
                    else {
                        singleSelectorStartedAt = null;
                    }
                }
                // PART 2.
                // catch the selectorChunks (for example, #head-only-id-2.real-class-1[lang|en]):
                // only opening curly brace or comma stops the recording.
                if (selectorChunkStartedAt === null) {
                    // catch the start of a chunk
                    // if (chr === "." || chr === "#") {
                    if (chr.trim() &&
                        chr !== "}" &&
                        chr !== ";" &&
                        !(str[i] === "/" && str[i + 1] === "*")) {
                        // reset the deletion flag:
                        selectorChunkCanBeDeleted = false;
                        // set the chunk's starting marker:
                        selectorChunkStartedAt = i;
                    }
                }
                // catch the ending of a chunk
                else if (",{".includes(chr)) {
                    const sliceTo = whitespaceStartedAt || i;
                    currentChunk = str.slice(selectorChunkStartedAt, sliceTo);
                    if (round === 1) {
                        // delete whitespace in front of commas or more than two spaces
                        // in front of opening curly braces:
                        if (whitespaceStartedAt) {
                            if (chr === "," && whitespaceStartedAt < i) {
                                finalIndexesToDelete.push(whitespaceStartedAt, i);
                                nonIndentationsWhitespaceLength += i - whitespaceStartedAt;
                            }
                            else if (chr === "{" && whitespaceStartedAt < i - 1) {
                                finalIndexesToDelete.push(whitespaceStartedAt, i - 1);
                                nonIndentationsWhitespaceLength += i - 1 - whitespaceStartedAt;
                            }
                        }
                        headSelectorsArr.push(currentChunk);
                    }
                    // it's round 2
                    else if (selectorChunkCanBeDeleted) {
                        let fromIndex = selectorChunkStartedAt;
                        let toIndex = i;
                        let tempFindingIndex = 0;
                        if (chr === "{" &&
                            str[fromIndex - 1] !== ">" &&
                            str[fromIndex - 1] !== "}") {
                            // take care not to loop backwards from ending of <!--[if mso]>
                            // also, not to loop then CSS is minified, imagine,
                            // we're at here:
                            // .col-3{z:2%}.col-4{y:3%}
                            //             ^
                            //            here
                            //
                            // 1. expand the left side to include comma, if such is present
                            for (let y = selectorChunkStartedAt; y--;) {
                                totalCounter += 1;
                                if (str[y].trim() && str[y] !== ",") {
                                    fromIndex = y + 1;
                                    break;
                                }
                            }
                            // 2. if we're on the opening curly brace currently and there's
                            // a space in front of it, we need to go back by 1 character
                            // to retain that single space in front of opening curly.
                            // Otherwise, we'd crop tightly up to curly which would be wrong.
                            if (!str[i - 1].trim()) {
                                toIndex = i - 1;
                            }
                        }
                        else if (chr === "," && !str[i + 1].trim()) {
                            for (let y = i + 1; y < len; y++) {
                                totalCounter += 1;
                                if (str[y].trim()) {
                                    toIndex = y;
                                    break;
                                }
                            }
                        }
                        else if (matchLeft(str, fromIndex, "{", {
                            trimBeforeMatching: true,
                            cb: (_char, _theRemainderOfTheString, index) => {
                                tempFindingIndex = index;
                                return true;
                            },
                        })) {
                            fromIndex = tempFindingIndex + 2; // "1" being the length of
                            // the finding, the "{" then another + "1" to get to the right
                            // side of opening curly.
                        }
                        const resToPush = expander({
                            str,
                            from: fromIndex,
                            to: toIndex,
                            ifRightSideIncludesThisThenCropTightly: ".#",
                            ifRightSideIncludesThisCropItToo: ",",
                            extendToOneSide: "right",
                        });
                        finalIndexesToDelete.push(...resToPush);
                        // wipe any gathered selectors to be uglified
                        if (opts.uglify) {
                            currentChunksMinifiedSelectors.wipe();
                        }
                    }
                    else {
                        // not selectorChunkCanBeDeleted
                        // 1. reset headWholeLineCanBeDeleted
                        if (headWholeLineCanBeDeleted) {
                            headWholeLineCanBeDeleted = false;
                        }
                        // 2. reset onlyDeletedChunksFollow because this chunk was not
                        // deleted, so this breaks the chain of "onlyDeletedChunksFollow"
                        if (onlyDeletedChunksFollow) {
                            onlyDeletedChunksFollow = false;
                        }
                        // 3. tend uglification
                        if (opts.uglify) {
                            finalIndexesToDelete.push(currentChunksMinifiedSelectors.current());
                            currentChunksMinifiedSelectors.wipe();
                        }
                    }
                    // wipe the marker:
                    if (chr !== "{") {
                        selectorChunkStartedAt = null;
                    }
                    else if (round === 2) {
                        // the last chunk was reached so let's evaluate, can we delete
                        // the whole "row":
                        // Cater the case when there was used class/id, comma, then at
                        // least one unused class/id after (only unused-ones after, no
                        // used classes/id's follow).
                        if (!headWholeLineCanBeDeleted &&
                            lastKeptChunksCommaAt !== null &&
                            onlyDeletedChunksFollow) {
                            let deleteUpTo = lastKeptChunksCommaAt + 1;
                            if ("\n\r".includes(str[lastKeptChunksCommaAt + 1])) {
                                for (let y = lastKeptChunksCommaAt + 1; y < len; y++) {
                                    if (str[y].trim()) {
                                        deleteUpTo = y;
                                        break;
                                    }
                                }
                            }
                            finalIndexesToDelete.push(lastKeptChunksCommaAt, deleteUpTo);
                            // reset:
                            lastKeptChunksCommaAt = null;
                            onlyDeletedChunksFollow = false;
                        }
                    }
                }
                //
            }
            // catch the closing body tag
            // ================
            if (!doNothing &&
                !stateWithinStyleTag &&
                stateWithinBody &&
                str[i] === "/" &&
                matchRight(str, i, "body", { trimBeforeMatching: true, i: true }) &&
                matchLeft(str, i, "<", { trimBeforeMatching: true })) {
                stateWithinBody = false;
                bodyStartedAt = null;
            }
            // catch the opening body tag
            // ================
            if (!doNothing &&
                str[i] === "<" &&
                matchRight(str, i, "body", {
                    i: true,
                    trimBeforeMatching: true,
                    cb: (char, _theRemainderOfTheString, index) => {
                        // remove any whitespace after opening bracket of a body tag:
                        if (round === 1) {
                            if (char !== undefined &&
                                (char.trim() === "" || char === ">") &&
                                typeof index === "number") {
                                if (index - i > 5) {
                                    finalIndexesToDelete.push(i, index, "<body");
                                    // remove the whitespace between < and body
                                    nonIndentationsWhitespaceLength += index - i - 5;
                                }
                                else {
                                    // do nothing
                                    return true;
                                }
                            }
                            return true;
                        }
                        // do nothing in round 2 because fix will already be implemented
                        // during round 1:
                        return true;
                    },
                })) {
                // Find the ending of the body tag:
                for (let y = i; y < len; y++) {
                    totalCounter += 1;
                    if (str[y] === ">") {
                        bodyStartedAt = y + 1;
                        // we can't offset the index because there might be unused classes
                        // or id's on the body tag itself.
                        break;
                    }
                }
            }
            // catch the start of a style attribute within body
            // ================
            if (!doNothing &&
                stateWithinBody &&
                !stateWithinStyleTag &&
                str[i] === "s" &&
                str[i + 1] === "t" &&
                str[i + 2] === "y" &&
                str[i + 3] === "l" &&
                str[i + 4] === "e" &&
                str[i + 5] === "=" &&
                badChars.includes(str[i - 1]) // this is to prevent false positives like attribute "urlid=..."
            ) {
                // TODO - tend the case when there are spaces around equal in style attribute
                if (`"'`.includes(str[i + 6])) ;
            }
            // catch the start of a class attribute within body
            // ================
            if (!doNothing &&
                stateWithinBody &&
                !stateWithinStyleTag &&
                !currentlyWithinQuotes &&
                str[i] === "c" &&
                str[i + 1] === "l" &&
                str[i + 2] === "a" &&
                str[i + 3] === "s" &&
                str[i + 4] === "s" &&
                // a character in front exists
                str[i - 1] &&
                // it's a whitespace character
                !str[i - 1].trim()) {
                // TODO: record which double quote it was exactly, single or double
                let valuesStart;
                let quoteless = false;
                if (str[i + 5] === "=") {
                    if (str[i + 6] === '"' || str[i + 6] === "'") {
                        valuesStart = i + 7;
                    }
                    else if (characterSuitableForNames(str[i + 6])) {
                        valuesStart = i + 6;
                        quoteless = true;
                    }
                    else if (str[i + 6] &&
                        (!str[i + 6].trim() || "/>".includes(str[i + 6]))) {
                        const calculatedRange = expander({
                            str,
                            from: i,
                            to: i + 6,
                            ifRightSideIncludesThisThenCropTightly: "/>",
                            wipeAllWhitespaceOnLeft: true,
                        });
                        finalIndexesToDelete.push(...calculatedRange);
                    }
                }
                else if (!str[i + 5].trim()) {
                    // loop forward:
                    for (let y = i + 5; y < len; y++) {
                        totalCounter += 1;
                        if (str[y].trim()) {
                            // 1. is it the "equals" character?
                            if (str[y] === "=") {
                                // 1-1. remove this gap:
                                if (y > i + 5 && round === 1) {
                                    finalIndexesToDelete.push(i + 5, y);
                                }
                                // 1-2. check what's next:
                                if ((str[y + 1] === '"' || str[y + 1] === "'") && str[y + 2]) {
                                    // 1-2-1. we found where values start:
                                    valuesStart = y + 2;
                                }
                                else if (str[y + 1] && !str[y + 1].trim()) {
                                    // 1-2-2. traverse even more forward:
                                    for (let z = y + 1; z < len; z++) {
                                        totalCounter += 1;
                                        if (str[z].trim()) {
                                            if (z > y + 1 && round === 1) {
                                                finalIndexesToDelete.push(y + 1, z);
                                            }
                                            if ((str[z] === '"' || str[z] === "'") && str[z + 1]) {
                                                valuesStart = z + 1;
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                            // // not equals is followed by "class" attribute's name
                            // else if (round === 1) {
                            //   const calculatedRange = expander({
                            //     str,
                            //     from: i,
                            //     to: y - 1, // leave that space in front
                            //     ifRightSideIncludesThisThenCropTightly: "/>",
                            //     wipeAllWhitespaceOnLeft: true,
                            //   });
                            //   console.log(
                            //     `1856 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
                            //   );
                            //   finalIndexesToDelete.push(...calculatedRange);
                            // }
                            // 2. stop anyway
                            break;
                        }
                    }
                }
                if (valuesStart) {
                    // 1. mark it
                    bodyClass = resetBodyClassOrId({
                        valuesStart,
                        quoteless,
                        nameStart: i,
                    });
                    // 2. resets:
                    if (round === 1) {
                        bodyItsTheFirstClassOrId = true;
                    }
                    else if (round === 2) {
                        // 2. reset the we-can-delete-whole-class/id marker:
                        bodyClassOrIdCanBeDeleted = true;
                    }
                }
            }
            // catch the start of an id attribute within body
            // ================
            if (!doNothing &&
                stateWithinBody &&
                !stateWithinStyleTag &&
                !currentlyWithinQuotes &&
                str[i] === "i" &&
                str[i + 1] === "d" &&
                // a character in front exists
                str[i - 1] &&
                // it's a whitespace character
                !str[i - 1].trim()) {
                let valuesStart;
                let quoteless = false;
                if (str[i + 2] === "=") {
                    if (str[i + 3] === '"' || str[i + 3] === "'") {
                        valuesStart = i + 4;
                    }
                    else if (characterSuitableForNames(str[i + 3])) {
                        valuesStart = i + 3;
                        quoteless = true;
                    }
                    else if (str[i + 3] &&
                        (!str[i + 3].trim() || "/>".includes(str[i + 3]))) {
                        const calculatedRange = expander({
                            str,
                            from: i,
                            to: i + 3,
                            ifRightSideIncludesThisThenCropTightly: "/>",
                            wipeAllWhitespaceOnLeft: true,
                        });
                        finalIndexesToDelete.push(...calculatedRange);
                    }
                }
                else if (!str[i + 2].trim()) {
                    // loop forward:
                    for (let y = i + 2; y < len; y++) {
                        totalCounter += 1;
                        if (str[y].trim()) {
                            // 1. is it the "equals" character?
                            if (str[y] === "=") {
                                // 1-1. remove this gap:
                                if (y > i + 2 && round === 1) {
                                    finalIndexesToDelete.push(i + 2, y);
                                }
                                // 1-2. check what's next:
                                if ((str[y + 1] === '"' || str[y + 1] === "'") && str[y + 2]) {
                                    // 1-2-1. we found where values start:
                                    valuesStart = y + 2;
                                }
                                else if (str[y + 1] && !str[y + 1].trim()) {
                                    // 1-2-2. traverse even more forward:
                                    for (let z = y + 1; z < len; z++) {
                                        totalCounter += 1;
                                        if (str[z].trim()) {
                                            if (z > y + 1 && round === 1) {
                                                finalIndexesToDelete.push(y + 1, z);
                                            }
                                            if ((str[z] === '"' || str[z] === "'") && str[z + 1]) {
                                                valuesStart = z + 1;
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                            // // not equals is followed by "id" attribute's name
                            // else if (round === 1) {
                            //   const calculatedRange = expander({
                            //     str,
                            //     from: i,
                            //     to: y - 1, // leave that space in front
                            //     ifRightSideIncludesThisThenCropTightly: "/>",
                            //     wipeAllWhitespaceOnLeft: true,
                            //   });
                            //   console.log(
                            //     `1987 PUSH ${JSON.stringify(calculatedRange, null, 0)}`
                            //   );
                            //   finalIndexesToDelete.push(...calculatedRange);
                            // }
                            // 2. stop anyway
                            break;
                        }
                    }
                }
                if (valuesStart) {
                    // 1. mark it
                    bodyId = resetBodyClassOrId({
                        valuesStart,
                        quoteless,
                        nameStart: i,
                    });
                    // 2. resets:
                    if (round === 1) {
                        bodyItsTheFirstClassOrId = true;
                    }
                    else if (round === 2) {
                        // 2. reset the we-can-delete-whole-class/id marker:
                        bodyClassOrIdCanBeDeleted = true;
                    }
                }
            }
            // body: catch the first letter within each class attribute
            // ================
            if (!doNothing &&
                bodyClass.valuesStart !== null &&
                i >= bodyClass.valuesStart &&
                bodyClass.valueStart === null) {
                if (allHeads && matchRightIncl(str, i, allHeads)) {
                    // 1. activate do-nothing flag
                    doNothing = true;
                    // 2. mark this class as not to be removed (as a whole)
                    bodyClassOrIdCanBeDeleted = false;
                    if (whitespaceStartedAt && i > whitespaceStartedAt + 1) {
                        const calculatedRange = expander({
                            str,
                            from: whitespaceStartedAt,
                            to: i,
                            ifLeftSideIncludesThisThenCropTightly: "\"'",
                            ifRightSideIncludesThisThenCropTightly: "\"'",
                        });
                        finalIndexesToDelete.push(...calculatedRange);
                        whitespaceStartedAt = null;
                    }
                    else if (whitespaceStartedAt) {
                        whitespaceStartedAt = null;
                    }
                    // 3. set doNothingUntil to corresponding tails
                    const matchedHeads = matchRightIncl(str, i, allHeads);
                    const findings = opts.backend.find((headsTailsObj) => headsTailsObj.heads === matchedHeads);
                    if (findings && findings.tails) {
                        doNothingUntil = findings.tails;
                    }
                }
                else if (characterSuitableForNames(chr)) {
                    // 1. mark the class' starting index
                    bodyClass.valueStart = i;
                    // 2. maybe there was whitespace between quotes and this?, like class="  zzz"
                    if (round === 1) {
                        //
                        if (bodyItsTheFirstClassOrId &&
                            bodyClass.valuesStart !== null &&
                            !str.slice(bodyClass.valuesStart, i).trim() &&
                            bodyClass.valuesStart < i) {
                            // 1. submit the whitespace characters in the range for deletion:
                            finalIndexesToDelete.push(bodyClass.valuesStart, i);
                            nonIndentationsWhitespaceLength += i - bodyClass.valuesStart;
                            // 2. disable bodyItsTheFirstClassOrId flag so we won't waste resources on
                            // further classes/id's:
                            bodyItsTheFirstClassOrId = false;
                        }
                        else if (whitespaceStartedAt !== null &&
                            whitespaceStartedAt < i - 1) {
                            // maybe there's whitespace between classes?
                            finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
                            nonIndentationsWhitespaceLength += i - whitespaceStartedAt + 1;
                        }
                    }
                }
            }
            // catch the ending of a class name
            // ================
            if (!doNothing &&
                bodyClass.valueStart !== null &&
                i > bodyClass.valueStart &&
                (!characterSuitableForNames(chr) ||
                    (allTails && matchRightIncl(str, i, allTails)))) {
                // insurance against ESP tag joined with a class
                // <table class="zzz-{{ loop.index }}">
                if (allHeads && matchRightIncl(str, i, allHeads)) {
                    bodyClass.valueStart = null;
                    bodyClass = resetBodyClassOrId();
                    const matchedHeads = matchRightIncl(str, i, allHeads);
                    const findings = opts.backend.find((headsTailsObj) => headsTailsObj.heads === matchedHeads);
                    if (findings && findings.tails) {
                        doNothingUntil = findings.tails;
                    }
                }
                else {
                    // normal operations can continue
                    const carvedClass = `${str.slice(bodyClass.valueStart, i)}`;
                    // console.log(
                    //   `2206 R1 = ${!!(allTails && matchRightIncl(str, i, allTails))}`
                    // );
                    // console.log(`2208 R2 = ${!!matchRightIncl(str, i, allTails)}`);
                    // console.log(
                    //   `2210 R3 = ${!!(allHeads && matchRightIncl(str, i, allHeads))}`
                    // );
                    if (round === 1) {
                        bodyClassesArr.push(`.${carvedClass}`);
                    }
                    // round 2
                    else if (bodyClass.valueStart != null &&
                        bodyClassesToDelete.includes(carvedClass)) {
                        // submit this class for deletion
                        const expandedRange = expander({
                            str,
                            from: bodyClass.valueStart,
                            to: i,
                            ifLeftSideIncludesThisThenCropTightly: `"'`,
                            ifRightSideIncludesThisThenCropTightly: `"'`,
                            wipeAllWhitespaceOnLeft: true,
                        });
                        // precaution against too tight crop when backend markers are involved
                        let whatToInsert = "";
                        if (str[expandedRange[0] - 1] &&
                            str[expandedRange[0] - 1].trim() &&
                            str[expandedRange[1]] &&
                            str[expandedRange[1]].trim() &&
                            (allHeads || allTails) &&
                            ((allHeads &&
                                matchLeft(str, expandedRange[0], allTails)) ||
                                (allTails &&
                                    matchRightIncl(str, expandedRange[1], allHeads)))) {
                            whatToInsert = " ";
                        }
                        finalIndexesToDelete.push(...expandedRange, whatToInsert);
                    }
                    else {
                        // 1. turn off the bodyClassOrIdCanBeDeleted
                        bodyClassOrIdCanBeDeleted = false;
                        // 2. uglify?
                        if (opts.uglify &&
                            !(Array.isArray(opts.whitelist) &&
                                opts.whitelist.length &&
                                matcher([`.${carvedClass}`], opts.whitelist).length)) {
                            finalIndexesToDelete.push(bodyClass.valueStart, i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf(`.${carvedClass}`)].slice(1));
                        }
                    }
                    bodyClass.valueStart = null;
                }
            }
            // catch the ending of an id name
            // ================
            if (!doNothing &&
                bodyId &&
                bodyId.valueStart !== null &&
                i > bodyId.valueStart &&
                (!characterSuitableForNames(chr) ||
                    (allTails && matchRightIncl(str, i, allTails)))) {
                const carvedId = str.slice(bodyId.valueStart, i);
                if (round === 1) {
                    bodyIdsArr.push(`#${carvedId}`);
                }
                // round 2
                else if (bodyId.valueStart != null &&
                    bodyIdsToDelete.includes(carvedId)) {
                    // submit this id for deletion
                    const expandedRange = expander({
                        str,
                        from: bodyId.valueStart,
                        to: i,
                        ifRightSideIncludesThisThenCropTightly: `"'`,
                        wipeAllWhitespaceOnLeft: true,
                    });
                    // precaution against too tight crop when backend markers are involved
                    if (str[expandedRange[0] - 1] &&
                        str[expandedRange[0] - 1].trim() &&
                        str[expandedRange[1]] &&
                        str[expandedRange[1]].trim() &&
                        (allHeads || allTails) &&
                        ((allHeads && matchLeft(str, expandedRange[0], allTails || [])) ||
                            (allTails &&
                                matchRightIncl(str, expandedRange[1], allHeads || [])))) {
                        expandedRange[0] += 1;
                    }
                    finalIndexesToDelete.push(...expandedRange);
                }
                else {
                    // 1. turn off the bodyClassOrIdCanBeDeleted
                    bodyClassOrIdCanBeDeleted = false;
                    // 2. uglify?
                    if (opts.uglify &&
                        !(Array.isArray(opts.whitelist) &&
                            opts.whitelist.length &&
                            matcher([`#${carvedId}`], opts.whitelist).length)) {
                        finalIndexesToDelete.push(bodyId.valueStart, i, allClassesAndIdsWithinHeadFinalUglified[allClassesAndIdsWithinHeadFinal.indexOf(`#${carvedId}`)].slice(1));
                    }
                }
                bodyId.valueStart = null;
            }
            // body: stop the class attribute's recording if closing single/double quote encountered
            // ================
            // TODO: replace chr check against any quote with exact quote that was previously recorded on opening
            if (!doNothing &&
                bodyClass.valuesStart != null &&
                ((!bodyClass.quoteless && (chr === "'" || chr === '"')) ||
                    (bodyClass.quoteless && !characterSuitableForNames(str[i]))) &&
                i >= bodyClass.valuesStart) {
                if (i === bodyClass.valuesStart) {
                    if (round === 1) {
                        finalIndexesToDelete.push(...expander({
                            str,
                            from: bodyClass.nameStart,
                            to: i + 1,
                            ifRightSideIncludesThisThenCropTightly: "/>",
                            wipeAllWhitespaceOnLeft: true,
                        }));
                    }
                }
                else {
                    // 1. if it's second round and by now the delete-whole-class/id marker
                    // is active (no skipped classes/id which had turn it off yet) then
                    // delete this class or id completely:
                    if (round === 2 && bodyClassOrIdCanBeDeleted) {
                        // 1. submit the range of whole class/id for deletion
                        // finalIndexesToDelete.push(bodyClass.valuesStart - 7, i + 1);
                        const expandedRange = expander({
                            str,
                            from: bodyClass.valuesStart - 7,
                            to: `'"`.includes(str[i]) ? i + 1 : i,
                            ifRightSideIncludesThisThenCropTightly: "/>",
                            wipeAllWhitespaceOnLeft: true,
                        });
                        // precaution against too tight crop when backend markers are involved
                        let whatToInsert = "";
                        if (str[expandedRange[0] - 1] &&
                            str[expandedRange[0] - 1].trim() &&
                            str[expandedRange[1]] &&
                            str[expandedRange[1]].trim() &&
                            !"/>".includes(str[expandedRange[1]])
                        // (allHeads || allTails) &&
                        // ((allHeads && matchLeft(str, expandedRange[0], allHeads)) ||
                        //   (allTails && matchRightIncl(str, expandedRange[1], allTails)))
                        ) {
                            whatToInsert = " ";
                        }
                        finalIndexesToDelete.push(...expandedRange, whatToInsert);
                    }
                    // 3. tend the trailing whitespace, as in class="zzzz  "
                    if (whitespaceStartedAt !== null) {
                        finalIndexesToDelete.push(whitespaceStartedAt, i);
                    }
                }
                // 2. reset the marker
                bodyClass = resetBodyClassOrId();
            }
            // body: stop the id attribute's recording if closing single/double quote encountered
            // ================
            // TODO: replace chr check against any quote with exact quote that was previously
            if (!doNothing &&
                bodyId.valuesStart !== null &&
                ((!bodyId.quoteless && (chr === "'" || chr === '"')) ||
                    (bodyId.quoteless && !characterSuitableForNames(str[i]))) &&
                i >= bodyId.valuesStart) {
                if (i === bodyId.valuesStart) {
                    if (round === 1) {
                        finalIndexesToDelete.push(...expander({
                            str,
                            from: bodyId.nameStart,
                            to: i + 1,
                            ifRightSideIncludesThisThenCropTightly: "/>",
                            wipeAllWhitespaceOnLeft: true,
                        }));
                    }
                }
                else {
                    // not an empty id attribute
                    // 1. if it's second round and by now the delete-whole-class/id marker
                    // is active (no skipped classes/id which had turn it off yet) then
                    // delete this class or id completely:
                    if (round === 2 && bodyClassOrIdCanBeDeleted) {
                        // 1. submit the range of whole class/id for deletion
                        const expandedRange = expander({
                            str,
                            from: bodyId.valuesStart - 4,
                            to: i + 1,
                            ifRightSideIncludesThisThenCropTightly: "/>",
                            wipeAllWhitespaceOnLeft: true,
                        });
                        // precaution against too tight crop when backend markers are involved
                        let whatToInsert = "";
                        if (str[expandedRange[0] - 1] &&
                            str[expandedRange[0] - 1].trim() &&
                            str[expandedRange[1]] &&
                            str[expandedRange[1]].trim() &&
                            !"/>".includes(str[expandedRange[1]])
                        // (allHeads || allTails) &&
                        // ((allHeads && matchLeft(str, expandedRange[0], allHeads)) ||
                        //   (allTails && matchRightIncl(str, expandedRange[1], allTails)))
                        ) {
                            whatToInsert = " ";
                        }
                        finalIndexesToDelete.push(...expandedRange, whatToInsert);
                    }
                    // 3. tend the trailing whitespace, as in id="zzzz  "
                    if (whitespaceStartedAt !== null) {
                        finalIndexesToDelete.push(whitespaceStartedAt, i);
                    }
                }
                // reset the marker in either case
                bodyId = resetBodyClassOrId();
            }
            // body: catch the first letter within each id attribute
            // ================
            if (!doNothing &&
                bodyId.valuesStart &&
                i >= bodyId.valuesStart &&
                bodyId.valueStart === null) {
                if (allHeads && matchRightIncl(str, i, allHeads)) {
                    // 1. activate do-nothing flag
                    doNothing = true;
                    // 2. mark this id as not to be removed (as a whole)
                    bodyClassOrIdCanBeDeleted = false;
                    if (whitespaceStartedAt && i > whitespaceStartedAt + 1) {
                        const calculatedRange = expander({
                            str,
                            from: whitespaceStartedAt,
                            to: i,
                            ifLeftSideIncludesThisThenCropTightly: "\"'",
                            ifRightSideIncludesThisThenCropTightly: "\"'",
                        });
                        finalIndexesToDelete.push(...calculatedRange);
                        whitespaceStartedAt = null;
                    }
                    else if (whitespaceStartedAt) {
                        whitespaceStartedAt = null;
                    }
                    // 3. set doNothingUntil to corresponding tails
                    const matchedHeads = matchRightIncl(str, i, allHeads);
                    const findings = opts.backend.find((headsTailsObj) => headsTailsObj.heads === matchedHeads);
                    if (findings && findings.tails) {
                        doNothingUntil = findings.tails;
                    }
                }
                else if (characterSuitableForNames(chr)) {
                    // 1. mark the id's starting index
                    bodyId.valueStart = i;
                    // 2. maybe there was whitespace between quotes and this?, like id="  zzz"
                    if (round === 1) {
                        //
                        if (bodyItsTheFirstClassOrId &&
                            bodyId.valuesStart !== null &&
                            !str.slice(bodyId.valuesStart, i).trim() &&
                            bodyId.valuesStart < i) {
                            // 1. submit the whitespace characters in the range for deletion:
                            finalIndexesToDelete.push(bodyId.valuesStart, i);
                            nonIndentationsWhitespaceLength += i - bodyId.valuesStart;
                            // 2. disable bodyItsTheFirstClassOrId flag so we won't waste resources on
                            // further classes/id's:
                            bodyItsTheFirstClassOrId = false;
                        }
                        else if (whitespaceStartedAt !== null &&
                            whitespaceStartedAt < i - 1) {
                            // maybe there's whitespace between classes?
                            finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
                            nonIndentationsWhitespaceLength += i - whitespaceStartedAt + 1;
                        }
                    }
                }
            }
            // body: catch the start and end of HTML comments
            // ================
            if (!doNothing && round === 1) {
                // 1. catch the HTML comments' cut off point to check for blocking
                // characters (mso, IE, whatever given in the
                // opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains)
                // ==================================
                if (commentStartedAt !== null &&
                    commentStartedAt < i &&
                    str[i] === ">" &&
                    !usedOnce) {
                    if (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains &&
                        Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) &&
                        opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length &&
                        opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some((val) => val.trim() &&
                            str
                                .slice(commentStartedAt, i)
                                .toLowerCase()
                                .includes(val))) {
                        canDelete = false;
                    }
                    usedOnce = true;
                }
                // 2. catch the HTML comments' ending
                // ==================================
                if (commentStartedAt !== null && str[i] === ">") {
                    // 1. catch healthy comment ending
                    if (!bogusHTMLComment && str[i - 1] === "-" && str[i - 2] === "-") {
                        // not bogus
                        const calculatedRange = expander({
                            str,
                            from: commentStartedAt,
                            to: i + 1,
                            wipeAllWhitespaceOnLeft: true,
                            addSingleSpaceToPreventAccidentalConcatenation: true,
                        });
                        if (opts.removeHTMLComments && canDelete) {
                            // Instead of finalIndexesToDelete.push(i, y + 3); use expander()
                            // so that we manage the whitespace outwards properly:
                            finalIndexesToDelete.push(...calculatedRange);
                        }
                        commentsLength += calculatedRange[1] - calculatedRange[0];
                        // reset the markers:
                        commentStartedAt = null;
                        bogusHTMLComment = undefined;
                    }
                    else if (bogusHTMLComment) {
                        const calculatedRange = expander({
                            str,
                            from: commentStartedAt,
                            to: i + 1,
                            wipeAllWhitespaceOnLeft: true,
                            addSingleSpaceToPreventAccidentalConcatenation: true,
                        });
                        if (opts.removeHTMLComments && canDelete) {
                            finalIndexesToDelete.push(...calculatedRange);
                        }
                        commentsLength += calculatedRange[1] - calculatedRange[0];
                        // reset the markers:
                        commentStartedAt = null;
                        bogusHTMLComment = undefined;
                    }
                }
                // 3. catch the HTML comments' starting
                // ====================================
                if (opts.removeHTMLComments &&
                    commentStartedAt === null &&
                    str[i] === "<" &&
                    str[i + 1] === "!") {
                    if ((!allHeads ||
                        (Array.isArray(allHeads) &&
                            allHeads.length &&
                            !allHeads.includes("<!"))) &&
                        (!allTails ||
                            (Array.isArray(allTails) &&
                                allTails.length &&
                                !allTails.includes("<!")))) {
                        // 3.1. if there's no DOCTYPE on the right, mark the comment's start,
                        // except in cases when it's been whitelisted (Outlook conditionals for example):
                        if (!matchRight(str, i + 1, "doctype", {
                            i: true,
                            trimBeforeMatching: true,
                        }) &&
                            !(str[i + 2] === "-" &&
                                str[i + 3] === "-" &&
                                Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) &&
                                opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length &&
                                matchRight(str, i + 3, opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains, {
                                    trimBeforeMatching: true,
                                }))) {
                            commentStartedAt = i;
                            usedOnce = false;
                            canDelete = true;
                        }
                        // 3.2. detect, is it healthy or bogus comment (bogusHTMLComment = true/false)
                        bogusHTMLComment = !(str[i + 2] === "-" && str[i + 3] === "-");
                    }
                    // if the comment beginning rule was not triggered, mark it as
                    // would-have-been comment anyway because we need to cater empty
                    // comment chunks ("<!-- -->") which follow conditional not-Outlook
                    // comment chunks and without this, there's no way to know that
                    // regular comment chunk was in front.
                    if (commentStartedAt !== i) {
                        commentNearlyStartedAt = i;
                    }
                }
            }
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //
            //                       RULES AT THE BOTTOM
            //
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            //                                S
            // reduce curliesDepth on each closing curlie met
            // ================
            if (chr === "}" && curliesDepth) {
                curliesDepth -= 1;
            }
            // pinpoint opening curly braces (in head styles), but not @media's.
            // ================
            if (!doNothing && chr === "{" && checkingInsideCurlyBraces) {
                if (!insideCurlyBraces) {
                    // 1. flip the flag
                    insideCurlyBraces = true;
                    // 2. if the whitespace was in front and it contained line breaks, wipe
                    // that whitespace:
                    if (whitespaceStartedAt !== null &&
                        (str.slice(whitespaceStartedAt, i).includes("\n") ||
                            str.slice(whitespaceStartedAt, i).includes("\r"))) {
                        finalIndexesToDelete.push(whitespaceStartedAt, i);
                    }
                }
                else {
                    curliesDepth += 1;
                }
            }
            // catch the whitespace
            if (!doNothing) {
                if (!str[i].trim()) {
                    if (whitespaceStartedAt === null) {
                        whitespaceStartedAt = i;
                        // console.log(
                        //   `2974 SET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = ${whitespaceStartedAt}`
                        // );
                    }
                }
                else if (whitespaceStartedAt !== null) {
                    // reset the marker
                    whitespaceStartedAt = null;
                }
            }
            // query the ranges clone from round 1, get the first range,
            // if current index is at the "start" index of that range,
            // offset the current index to its "to" index. This way,
            // in round 2 we "jump" over what was submitted for deletion
            // in round 1.
            if (!doNothing &&
                round === 2 &&
                Array.isArray(round1RangesClone) &&
                round1RangesClone.length &&
                i === round1RangesClone[0][0]) {
                // offset index, essentially "jumping over" what was submitted for deletion in round 1
                const temp = round1RangesClone.shift();
                if (temp && temp[1] - 1 > i) {
                    i = temp[1] - 1;
                }
                // if (doNothing) {
                //   doNothing = false;
                //   console.log(
                //     `3015 SET ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = false`
                //   );
                // }
                // if (ruleChunkStartedAt !== null) {
                //   ruleChunkStartedAt = i + 1;
                //   console.log(
                //     `3021 SET \u001b[${33}m${`ruleChunkStartedAt`}\u001b[${39}m = ${ruleChunkStartedAt}`
                //   );
                // }
                // if (selectorChunkStartedAt !== null) {
                //   selectorChunkStartedAt = i + 1;
                //   console.log(
                //     `3027 SET \u001b[${33}m${`selectorChunkStartedAt`}\u001b[${39}m = ${selectorChunkStartedAt}`
                //   );
                // }
                continue;
            }
            // catch would-have-been comment endings
            if (commentNearlyStartedAt !== null && str[i] === ">") {
                // 1. reset the marker
                commentNearlyStartedAt = null;
                // 2. check, is there empty comment block on the right which sometimes
                // follows outlook conditionals
                let temp = 0;
                if (opts.removeHTMLComments &&
                    Array.isArray(opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains) &&
                    opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.length &&
                    (opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some((val) => val.includes("if")) ||
                        opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some((val) => val.includes("mso")) ||
                        opts.doNotRemoveHTMLCommentsWhoseOpeningTagContains.some((val) => val.includes("ie"))) &&
                    matchRight(str, i, "<!--", {
                        trimBeforeMatching: true,
                        cb: (_char, _theRemainderOfTheString, index) => {
                            temp = index;
                            return true;
                        },
                    })) {
                    if (matchRight(str, temp - 1, "-->", {
                        trimBeforeMatching: true,
                        cb: (_char, _theRemainderOfTheString, index) => {
                            temp = index;
                            return true;
                        },
                    })) ;
                    if (typeof temp === "number") {
                        i = temp - 1;
                    }
                    continue;
                }
            }
            // console.log(`styleStartedAt = ${styleStartedAt}`);
        }
        //
        //
        //
        //
        //
        //
        //              F R U I T S   O F   T H E   L A B O U R
        //
        //
        //
        //
        //
        //
        if (round === 1) {
            //
            //
            //
            //
            //
            //
            //
            //
            allClassesAndIdsWithinBody = lodash_uniq(bodyClassesArr.concat(bodyIdsArr));
            // extract all classes or id's from `headSelectorsArr` and get count of each.
            // That's so we can later exclude sandwitched classes. Each time "collateral"
            // legit, but sandwitched with false-one class gets deleted, we keep count, and
            // later compare totals with these below.
            // If it turns out that a class was in both head and body, but it was sandwitched
            // with unused classes and removed as collateral, we need to remove it from body too.
            // starting point is the selectors, removed from head during first stage.
            headSelectorsArr.forEach((el) => {
                extract(el).res.forEach((selector) => {
                    if (Object.prototype.hasOwnProperty.call(headSelectorsCount, selector)) {
                        headSelectorsCount[selector] += 1;
                    }
                    else {
                        headSelectorsCount[selector] = 1;
                    }
                });
            });
            // create a working copy of `headSelectorsCount` which we'll mutate, subtracting
            // each deleted class/id:
            headSelectorsCountClone = { ...headSelectorsCount };
            // compile list of to-be-terminated
            // ================
            allClassesAndIdsWithinHead = lodash_uniq(headSelectorsArr.reduce((arr, el) => arr.concat(extract(el).res), []));
            countBeforeCleaning = allClassesAndIdsWithinHead.length;
            // to avoid false positives, let's apply two cycles when removing unused classes/id's from head:
            // ---------------------------------------
            // TWO-CYCLE UNUSED CSS IDENTIFICATION:
            // ---------------------------------------
            // cycle #1 - remove comparing separate classes/id's from body against
            // potentially sandwitched lumps from head. Let's see what's left afterwards.
            // ================
            const preppedHeadSelectorsArr = Array.from(headSelectorsArr);
            let deletedFromHeadArr = [];
            for (let y = 0, len2 = preppedHeadSelectorsArr.length; y < len2; y++) {
                totalCounter += 1;
                let temp;
                // intentional loose comparison !=, that's existy():
                if (preppedHeadSelectorsArr[y] != null) {
                    temp = extract(preppedHeadSelectorsArr[y]).res;
                }
                if (temp &&
                    !temp.every((el) => allClassesAndIdsWithinBody.includes(el))) {
                    deletedFromHeadArr.push(...extract(preppedHeadSelectorsArr[y]).res);
                    preppedHeadSelectorsArr.splice(y, 1);
                    y -= 1;
                    len2 -= 1;
                }
            }
            deletedFromHeadArr = lodash_uniq(pull(deletedFromHeadArr, opts.whitelist));
            let preppedAllClassesAndIdsWithinHead;
            if (preppedHeadSelectorsArr && preppedHeadSelectorsArr.length) {
                preppedAllClassesAndIdsWithinHead = preppedHeadSelectorsArr.reduce((acc, curr) => acc.concat(extract(curr).res), []);
            }
            else {
                preppedAllClassesAndIdsWithinHead = [];
            }
            // console.log(`\n* preppedAllClassesAndIdsWithinHead = ${JSON.stringify(preppedAllClassesAndIdsWithinHead, null, 4)}`)
            // cycle #2 - now treat remaining lumps as definite sources of
            // "what classes or id's are present in the head"
            // use "preppedAllClassesAndIdsWithinHead" as a head selector reference when comparing
            // against the body classes/id's.
            // ================
            headCssToDelete = pull(lodash_pullall(lodash_uniq(Array.from(allClassesAndIdsWithinHead)), bodyClassesArr.concat(bodyIdsArr)), opts.whitelist);
            bodyCssToDelete = lodash_uniq(pull(lodash_pullall(bodyClassesArr.concat(bodyIdsArr), preppedAllClassesAndIdsWithinHead), opts.whitelist));
            // now that we know final to-be-deleted selectors list, compare them with `deletedFromHeadArr`
            // and fill any missing CSS in `headCssToDelete`:
            headCssToDelete = lodash_uniq(headCssToDelete.concat(lodash_intersection(deletedFromHeadArr, bodyCssToDelete)));
            bodyClassesToDelete = bodyCssToDelete
                .filter((s) => s.startsWith("."))
                .map((s) => s.slice(1));
            bodyIdsToDelete = bodyCssToDelete
                .filter((s) => s.startsWith("#"))
                .map((s) => s.slice(1));
            allClassesAndIdsThatWereCompletelyDeletedFromHead = Object.keys(headSelectorsCountClone).filter((singleSelector) => headSelectorsCountClone[singleSelector] < 1);
            // at this point, if any classes in `headSelectorsCountClone` have zero counters
            // that means those have all been deleted from head.
            bodyClassesToDelete = lodash_uniq(bodyClassesToDelete.concat(lodash_intersection(pull(allClassesAndIdsWithinBody, opts.whitelist), allClassesAndIdsThatWereCompletelyDeletedFromHead)
                .filter((val) => val[0] === ".") // filter out all classes
                .map((val) => val.slice(1)))); // remove dots from them
            const allClassesAndIdsWithinBodyThatWereWhitelisted = matcher(allClassesAndIdsWithinBody, opts.whitelist);
            // update `bodyCssToDelete` with sandwitched classes, because will be
            // used in reporting
            bodyCssToDelete = lodash_uniq(bodyCssToDelete.concat(bodyClassesToDelete.map((val) => `.${val}`), bodyIdsToDelete.map((val) => `#${val}`)));
            allClassesAndIdsWithinHeadFinal = lodash_pullall(lodash_pullall(Array.from(allClassesAndIdsWithinHead), bodyCssToDelete), headCssToDelete);
            if (Array.isArray(allClassesAndIdsWithinBodyThatWereWhitelisted) &&
                allClassesAndIdsWithinBodyThatWereWhitelisted.length) {
                allClassesAndIdsWithinBodyThatWereWhitelisted.forEach((classOrId) => {
                    if (!allClassesAndIdsWithinHeadFinal.includes(classOrId)) {
                        allClassesAndIdsWithinHeadFinal.push(classOrId);
                    }
                });
            }
            if (opts.uglify) {
                allClassesAndIdsWithinHeadFinalUglified = uglifyArr(allClassesAndIdsWithinHeadFinal);
            }
            countAfterCleaning = allClassesAndIdsWithinHeadFinal.length;
            uglified = opts.uglify
                ? allClassesAndIdsWithinHeadFinal
                    .map((name, id) => [
                    name,
                    allClassesAndIdsWithinHeadFinalUglified[id],
                ])
                    .filter((arr) => !opts.whitelist.some((whitelistVal) => matcher.isMatch(arr[0], whitelistVal)))
                : null;
            if (finalIndexesToDelete.current()) {
                round1RangesClone = Array.from(finalIndexesToDelete.current() || []);
            }
            else {
                round1RangesClone = null;
            }
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
        }
    }
    //                              ^
    //                              |
    //                              |
    //                              |
    //                              |
    //                              |
    //                              |
    //                              |
    //                              |
    //                              |
    //                     inned FOR loop ends
    //
    //
    //
    //                   F I N A L   P R O C E S S I N G
    //
    //
    //
    //
    //
    //
    //
    // actual deletion/insertion:
    // ==========================
    finalIndexesToDelete.push(lineBreaksToDelete.current());
    if (str.length && finalIndexesToDelete.current()) {
        str = rApply(str, finalIndexesToDelete.current());
        finalIndexesToDelete.wipe();
    }
    const startingPercentageDone = opts.reportProgressFuncTo -
        (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) *
            leavePercForLastStage;
    if (opts.reportProgressFunc && len >= 2000) {
        // opts.reportProgressFunc(95);
        currentPercentageDone = Math.floor(startingPercentageDone +
            (opts.reportProgressFuncTo - startingPercentageDone) / 5 // * 1
        );
        if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
        }
    }
    // final fixing:
    // =============
    // remove empty media queries:
    while (regexEmptyMediaQuery.test(str) ||
        regexEmptyUnclosedMediaQuery.test(str)) {
        str = str.replace(regexEmptyMediaQuery, "");
        str = str.replace(regexEmptyUnclosedMediaQuery, "");
        totalCounter += str.length;
    }
    if (opts.reportProgressFunc && len >= 2000) {
        // opts.reportProgressFunc(96);
        currentPercentageDone = Math.floor(startingPercentageDone +
            ((opts.reportProgressFuncTo - startingPercentageDone) / 5) * 2);
        if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
        }
    }
    // remove empty style tags:
    str = str.replace(regexEmptyStyleTag, "\n");
    totalCounter += str.length;
    if (opts.reportProgressFunc && len >= 2000) {
        // opts.reportProgressFunc(97);
        currentPercentageDone = Math.floor(startingPercentageDone +
            ((opts.reportProgressFuncTo - startingPercentageDone) / 5) * 3);
        if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
        }
    }
    // remove empty Outlook conditional comments:
    let tempLen = str.length;
    str = str.replace(emptyCondCommentRegex(), "");
    totalCounter += str.length;
    if (tempLen !== str.length) {
        commentsLength += str.length - tempLen;
    }
    if (opts.reportProgressFunc && len >= 2000) {
        // opts.reportProgressFunc(98);
        currentPercentageDone = Math.floor(startingPercentageDone +
            ((opts.reportProgressFuncTo - startingPercentageDone) / 5) * 4);
        if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
        }
    }
    // minify, limit the line length
    str = crush(str, {
        removeLineBreaks: false,
        removeIndentations: false,
        removeHTMLComments: false,
        removeCSSComments: false,
        lineLengthLimit: 500,
    }).result;
    tempLen = str.length;
    if (tempLen !== str.length) {
        nonIndentationsWhitespaceLength += str.length - tempLen;
    }
    totalCounter += str.length;
    if (opts.reportProgressFunc && len >= 2000) {
        // opts.reportProgressFunc(99);
        currentPercentageDone = Math.floor(startingPercentageDone +
            (opts.reportProgressFuncTo - startingPercentageDone));
        if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
        }
    }
    if (str.length) {
        if ((!str[0].trim() || !str[str.length - 1].trim()) &&
            str.length !== str.trim().length) {
            nonIndentationsWhitespaceLength += str.length - str.trim().length;
        }
        str = str.trimStart();
    }
    // remove first character, space, inside classes/id's - it might
    // be a leftover after class/id removal
    str = str.replace(/ ((class|id)=["']) /g, " $1");
    return {
        log: {
            timeTakenInMilliseconds: Date.now() - start,
            traversedTotalCharacters: totalCounter,
            traversedTimesInputLength: len
                ? Math.round((totalCounter / len) * 100) / 100
                : 0,
            originalLength: len,
            cleanedLength: str.length,
            bytesSaved: Math.max(len - str.length, 0),
            percentageReducedOfOriginal: len
                ? Math.round((Math.max(len - str.length, 0) * 100) / len)
                : 0,
            nonIndentationsWhitespaceLength: Math.max(nonIndentationsWhitespaceLength - trailingLinebreakLengthCorrection, 0),
            nonIndentationsTakeUpPercentageOfOriginal: len &&
                Math.max(nonIndentationsWhitespaceLength - trailingLinebreakLengthCorrection, 0)
                ? Math.round((Math.max(nonIndentationsWhitespaceLength, 0) * 100) / len)
                : 0,
            commentsLength,
            commentsTakeUpPercentageOfOriginal: len && commentsLength ? Math.round((commentsLength * 100) / len) : 0,
            uglified,
        },
        result: str,
        countAfterCleaning,
        countBeforeCleaning,
        allInHead: allClassesAndIdsWithinHead.sort(),
        allInBody: allClassesAndIdsWithinBody.sort(),
        deletedFromHead: headCssToDelete.sort(),
        deletedFromBody: bodyCssToDelete.sort(),
    };
}

exports.comb = comb;
exports.defaults = defaults;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
