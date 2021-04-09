/**
 * @name codsen-tokenizer
 * @fileoverview HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 * @version 5.5.5
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/codsen-tokenizer/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.codsenTokenizer = {}));
}(this, (function (exports) { 'use strict';

/**
 * @name arrayiffy-if-string
 * @fileoverview Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * @version 3.13.14
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
 * @version 7.0.8
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-match-left-right/}
 */

function isObj$1(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
function isStr(something) {
  return typeof something === "string";
}
const defaults$1 = {
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
  const opts = { ...defaults$1,
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
  const opts = { ...defaults$1,
    ...originalOpts
  };
  if (typeof opts.trimCharsBeforeMatching === "string") {
    opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  }
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(el => isStr(el) ? el : String(el));
  if (!isStr(str)) {
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
  Array.isArray(whatToMatch) && whatToMatch.length === 1 && isStr(whatToMatch[0]) && !whatToMatch[0].trim()
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

/**
 * @name string-left-right
 * @fileoverview Looks up the first non-whitespace character to the left/right of a given index
 * @version 4.0.14
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
 * @name html-all-known-attributes
 * @fileoverview All HTML attributes known to the Humanity
 * @version 4.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/html-all-known-attributes/}
 */
const allHtmlAttribs = new Set(["abbr", "accept", "accept-charset", "accesskey", "action", "align", "alink", "allow", "alt", "archive", "async", "autocapitalize", "autocomplete", "autofocus", "autoplay", "axis", "background", "background-attachment", "background-color", "background-image", "background-position", "background-position-x", "background-position-y", "background-repeat", "bgcolor", "border", "border-bottom", "border-bottom-color", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-style", "border-top", "border-top-color", "border-top-style", "border-top-width", "border-width", "buffered", "capture", "cellpadding", "cellspacing", "challenge", "char", "charoff", "charset", "checked", "cite", "class", "classid", "clear", "clip", "code", "codebase", "codetype", "color", "cols", "colspan", "column-span", "compact", "content", "contenteditable", "contextmenu", "controls", "coords", "crossorigin", "csp", "cursor", "data", "data-*", "datetime", "declare", "decoding", "default", "defer", "dir", "direction", "dirname", "disabled", "display", "download", "draggable", "dropzone", "enctype", "enterkeyhint", "face", "filter", "float", "font", "font-color", "font-emphasize", "font-emphasize-position", "font-emphasize-style", "font-family", "font-size", "font-style", "font-variant", "font-weight", "for", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "frame", "frameborder", "frontuid", "headers", "height", "hidden", "high", "horiz-align", "href", "hreflang", "hspace", "http-equiv", "icon", "id", "importance", "inputmode", "integrity", "intrinsicsize", "ismap", "itemprop", "keytype", "kind", "label", "lang", "language", "layout-flow", "layout-grid", "layout-grid-char", "layout-grid-line", "layout-grid-mode", "layout-grid-type", "left", "letter-spacing", "line-break", "line-height", "link", "list", "list-image-1", "list-image-2", "list-image-3", "list-style", "list-style-image", "list-style-position", "list-style-type", "loading", "longdesc", "loop", "low", "manifest", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marginheight", "marginwidth", "max", "maxlength", "media", "method", "min", "minlength", "mso-ansi-font-size", "mso-ansi-font-style", "mso-ansi-font-weight", "mso-ansi-language", "mso-ascii-font-family", "mso-background", "mso-background-source", "mso-baseline-position", "mso-bidi-flag", "mso-bidi-font-family", "mso-bidi-font-size", "mso-bidi-font-style", "mso-bidi-font-weight", "mso-bidi-language", "mso-bookmark", "mso-border-alt", "mso-border-between", "mso-border-between-color", "mso-border-between-style", "mso-border-between-width", "mso-border-bottom-alt", "mso-border-bottom-color-alt", "mso-border-bottom-source", "mso-border-bottom-style-alt", "mso-border-bottom-width-alt", "mso-border-color-alt", "mso-border-effect", "mso-border-left-alt", "mso-border-left-color-alt", "mso-border-left-source", "mso-border-left-style-alt", "mso-border-left-width-alt", "mso-border-right-alt", "mso-border-right-color-alt", "mso-border-right-source", "mso-border-right-style-alt", "mso-border-right-width-alt", "mso-border-shadow", "mso-border-source", "mso-border-style-alt", "mso-border-top-alt", "mso-border-top-color-alt", "mso-border-top-source", "mso-border-top-style-alt", "mso-border-top-width-alt", "mso-border-width-alt", "mso-break-type", "mso-build", "mso-build-after-action", "mso-build-after-color", "mso-build-auto-secs", "mso-build-avi", "mso-build-dual-id", "mso-build-order", "mso-build-sound-name", "mso-bullet-image", "mso-cell-special", "mso-cellspacing", "mso-char-indent", "mso-char-indent-count", "mso-char-indent-size", "mso-char-type", "mso-char-wrap", "mso-color-alt", "mso-color-index", "mso-color-source", "mso-column-break-before", "mso-column-separator", "mso-columns", "mso-comment-author", "mso-comment-continuation", "mso-comment-id", "mso-comment-reference", "mso-data-placement", "mso-default-height", "mso-default-width", "mso-diagonal-down", "mso-diagonal-down-color", "mso-diagonal-down-source", "mso-diagonal-down-style", "mso-diagonal-down-width", "mso-diagonal-up", "mso-diagonal-up-color", "mso-diagonal-up-source", "mso-diagonal-up-style", "mso-diagonal-up-width", "mso-displayed-decimal-separator", "mso-displayed-thousand-separator", "mso-element", "mso-element-anchor-horizontal", "mso-element-anchor-lock", "mso-element-anchor-vertical", "mso-element-frame-height", "mso-element-frame-hspace", "mso-element-frame-vspace", "mso-element-frame-width", "mso-element-left", "mso-element-linespan", "mso-element-top", "mso-element-wrap", "mso-endnote-continuation-notice", "mso-endnote-continuation-notice-id", "mso-endnote-continuation-notice-src", "mso-endnote-continuation-separator", "mso-endnote-continuation-separator-id", "mso-endnote-continuation-separator-src", "mso-endnote-display", "mso-endnote-id", "mso-endnote-numbering", "mso-endnote-numbering-restart", "mso-endnote-numbering-start", "mso-endnote-numbering-style", "mso-endnote-position", "mso-endnote-separator", "mso-endnote-separator-id", "mso-endnote-separator-src", "mso-even-footer", "mso-even-footer-id", "mso-even-footer-src", "mso-even-header", "mso-even-header-id", "mso-even-header-src", "mso-facing-pages", "mso-fareast-font-family", "mso-fareast-hint", "mso-fareast-language", "mso-field-change", "mso-field-change-author", "mso-field-change-time", "mso-field-change-value", "mso-field-code", "mso-field-lock", "mso-fills-color", "mso-first-footer", "mso-first-footer-id", "mso-first-footer-src", "mso-first-header", "mso-first-header-id", "mso-first-header-src", "mso-font-alt", "mso-font-charset", "mso-font-format", "mso-font-info", "mso-font-info-charset", "mso-font-info-type", "mso-font-kerning", "mso-font-pitch", "mso-font-signature", "mso-font-signature-csb-one", "mso-font-signature-csb-two", "mso-font-signature-usb-four", "mso-font-signature-usb-one", "mso-font-signature-usb-three", "mso-font-signature-usb-two", "mso-font-src", "mso-font-width", "mso-footer", "mso-footer-data", "mso-footer-id", "mso-footer-margin", "mso-footer-src", "mso-footnote-continuation-notice", "mso-footnote-continuation-notice-id", "mso-footnote-continuation-notice-src", "mso-footnote-continuation-separator", "mso-footnote-continuation-separator-id", "mso-footnote-continuation-separator-src", "mso-footnote-id", "mso-footnote-numbering", "mso-footnote-numbering-restart", "mso-footnote-numbering-start", "mso-footnote-numbering-style", "mso-footnote-position", "mso-footnote-separator", "mso-footnote-separator-id", "mso-footnote-separator-src", "mso-foreground", "mso-forms-protection", "mso-generic-font-family", "mso-grid-bottom", "mso-grid-bottom-count", "mso-grid-left", "mso-grid-left-count", "mso-grid-right", "mso-grid-right-count", "mso-grid-top", "mso-grid-top-count", "mso-gutter-direction", "mso-gutter-margin", "mso-gutter-position", "mso-hansi-font-family", "mso-header", "mso-header-data", "mso-header-id", "mso-header-margin", "mso-header-src", "mso-height-alt", "mso-height-rule", "mso-height-source", "mso-hide", "mso-highlight", "mso-horizontal-page-align", "mso-hyphenate", "mso-ignore", "mso-kinsoku-overflow", "mso-layout-grid-align", "mso-layout-grid-char-alt", "mso-layout-grid-origin", "mso-level-inherit", "mso-level-legacy", "mso-level-legacy-indent", "mso-level-legacy-space", "mso-level-legal-format", "mso-level-number-format", "mso-level-number-position", "mso-level-numbering", "mso-level-reset-level", "mso-level-start-at", "mso-level-style-link", "mso-level-suffix", "mso-level-tab-stop", "mso-level-text", "mso-line-break-override", "mso-line-grid", "mso-line-height-alt", "mso-line-height-rule", "mso-line-numbers-count-by", "mso-line-numbers-distance", "mso-line-numbers-restart", "mso-line-numbers-start", "mso-line-spacing", "mso-linked-frame", "mso-list", "mso-list-change", "mso-list-change-author", "mso-list-change-time", "mso-list-change-values", "mso-list-id", "mso-list-ins", "mso-list-ins-author", "mso-list-ins-time", "mso-list-name", "mso-list-template-ids", "mso-list-type", "mso-margin-bottom-alt", "mso-margin-left-alt", "mso-margin-top-alt", "mso-mirror-margins", "mso-negative-indent-tab", "mso-number-format", "mso-outline-level", "mso-outline-parent", "mso-outline-parent-col", "mso-outline-parent-row", "mso-outline-parent-visibility", "mso-outline-style", "mso-padding-alt", "mso-padding-between", "mso-padding-bottom-alt", "mso-padding-left-alt", "mso-padding-right-alt", "mso-padding-top-alt", "mso-page-border-aligned", "mso-page-border-art", "mso-page-border-bottom-art", "mso-page-border-display", "mso-page-border-left-art", "mso-page-border-offset-from", "mso-page-border-right-art", "mso-page-border-surround-footer", "mso-page-border-surround-header", "mso-page-border-top-art", "mso-page-border-z-order", "mso-page-numbers", "mso-page-numbers-chapter-separator", "mso-page-numbers-chapter-style", "mso-page-numbers-start", "mso-page-numbers-style", "mso-page-orientation", "mso-page-scale", "mso-pagination", "mso-panose-arm-style", "mso-panose-contrast", "mso-panose-family-type", "mso-panose-letterform", "mso-panose-midline", "mso-panose-proportion", "mso-panose-serif-style", "mso-panose-stroke-variation", "mso-panose-weight", "mso-panose-x-height", "mso-paper-source", "mso-paper-source-first-page", "mso-paper-source-other-pages", "mso-pattern", "mso-pattern-color", "mso-pattern-style", "mso-print-area", "mso-print-color", "mso-print-gridlines", "mso-print-headings", "mso-print-resolution", "mso-print-sheet-order", "mso-print-title-column", "mso-print-title-row", "mso-prop-change", "mso-prop-change-author", "mso-prop-change-time", "mso-protection", "mso-rotate", "mso-row-margin-left", "mso-row-margin-right", "mso-ruby-merge", "mso-ruby-visibility", "mso-scheme-fill-color", "mso-scheme-shadow-color", "mso-shading", "mso-shadow-color", "mso-space-above", "mso-space-below", "mso-spacerun", "mso-special-character", "mso-special-format", "mso-style-id", "mso-style-name", "mso-style-next", "mso-style-parent", "mso-style-type", "mso-style-update", "mso-subdocument", "mso-symbol-font-family", "mso-tab-count", "mso-table-anchor-horizontal", "mso-table-anchor-vertical", "mso-table-bspace", "mso-table-del-author", "mso-table-del-time", "mso-table-deleted", "mso-table-dir", "mso-table-ins-author", "mso-table-ins-time", "mso-table-inserted", "mso-table-layout-alt", "mso-table-left", "mso-table-lspace", "mso-table-overlap", "mso-table-prop-author", "mso-table-prop-change", "mso-table-prop-time", "mso-table-rspace", "mso-table-top", "mso-table-tspace", "mso-table-wrap", "mso-text-animation", "mso-text-combine-brackets", "mso-text-combine-id", "mso-text-control", "mso-text-fit-id", "mso-text-indent-alt", "mso-text-orientation", "mso-text-raise", "mso-title-page", "mso-tny-compress", "mso-unsynced", "mso-vertical-align-alt", "mso-vertical-align-special", "mso-vertical-page-align", "mso-width-alt", "mso-width-source", "mso-word-wrap", "mso-xlrowspan", "mso-zero-height", "multiple", "muted", "name", "nav-banner-image", "navbutton_background_color", "navbutton_home_hovered", "navbutton_home_normal", "navbutton_home_pushed", "navbutton_horiz_hovered", "navbutton_horiz_normal", "navbutton_horiz_pushed", "navbutton_next_hovered", "navbutton_next_normal", "navbutton_next_pushed", "navbutton_prev_hovered", "navbutton_prev_normal", "navbutton_prev_pushed", "navbutton_up_hovered", "navbutton_up_normal", "navbutton_up_pushed", "navbutton_vert_hovered", "navbutton_vert_normal", "navbutton_vert_pushed", "nohref", "noresize", "noshade", "novalidate", "nowrap", "object", "onblur", "onchange", "onclick", "ondblclick", "onfocus", "onkeydown", "onkeypress", "onkeyup", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onreset", "onselect", "onsubmit", "onunload", "open", "optimum", "overflow", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "panose-1", "pattern", "ping", "placeholder", "position", "poster", "preload", "profile", "prompt", "punctuation-trim", "punctuation-wrap", "radiogroup", "readonly", "referrerpolicy", "rel", "required", "rev", "reversed", "right", "row-span", "rows", "rowspan", "ruby-align", "ruby-overhang", "ruby-position", "rules", "sandbox", "scheme", "scope", "scoped", "scrolling", "selected", "separator-image", "shape", "size", "sizes", "slot", "span", "spellcheck", "src", "srcdoc", "srclang", "srcset", "standby", "start", "step", "style", "summary", "tab-interval", "tab-stops", "tabindex", "table-border-color-dark", "table-border-color-light", "table-layout", "target", "text", "text-align", "text-autospace", "text-combine", "text-decoration", "text-effect", "text-fit", "text-indent", "text-justify", "text-justify-trim", "text-kashida", "text-line-through", "text-shadow", "text-transform", "text-underline", "text-underline-color", "text-underline-style", "title", "top", "top-bar-button", "translate", "type", "unicode-bidi", "urlId", "usemap", "valign", "value", "valuetype", "version", "vert-align", "vertical-align", "visibility", "vlink", "vnd.ms-excel.numberformat", "vspace", "white-space", "width", "word-break", "word-spacing", "wrap", "xmlns", "z-index"]);

/**
 * @name is-char-suitable-for-html-attr-name
 * @fileoverview Is given character suitable to be in an HTML attribute's name?
 * @version 2.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/is-char-suitable-for-html-attr-name/}
 */

function isAttrNameChar(char) {
  return typeof char === "string" && (
  char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123 ||
  char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 ||
  char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58 || char === ":" || char === "-");
}

/**
 * @name is-html-attribute-closing
 * @fileoverview Is a character on a given index a closing of an HTML attribute?
 * @version 2.2.5
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/is-html-attribute-closing/}
 */

function makeTheQuoteOpposite(quoteChar) {
  return quoteChar === `'` ? `"` : `'`;
}
function ensureXIsNotPresentBeforeOneOfY(str, startingIdx, x, y = []) {
  for (let i = startingIdx, len = str.length; i < len; i++) {
    if (y.some(oneOfStr => str.startsWith(oneOfStr, i))) {
      return true;
    }
    if (str[i] === x) {
      return false;
    }
  }
  return true;
}
function xBeforeYOnTheRight$1(str, startingIdx, x, y) {
  for (let i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      return true;
    }
    if (str.startsWith(y, i)) {
      return false;
    }
  }
  return false;
}
function plausibleAttrStartsAtX(str, start) {
  if (!isAttrNameChar(str[start]) || !start) {
    return false;
  }
  const regex = /^[a-zA-Z0-9:-]*(\s*[=]?\s*((?:'[^']*')|(?:"[^"]*")))|( [^/>'"=]*['"])/;
  return regex.test(str.slice(start));
}
function guaranteedAttrStartsAtX(str, start) {
  if (!start || !isAttrNameChar(str[start])) {
    return false;
  }
  const regex = /^[a-zA-Z0-9:-]*=(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/;
  return regex.test(str.slice(start));
}
function findAttrNameCharsChunkOnTheLeft(str, i) {
  if (!isAttrNameChar(str[left(str, i)])) {
    return;
  }
  for (let y = i; y--;) {
    if (str[y].trim().length && !isAttrNameChar(str[y])) {
      return str.slice(y + 1, i);
    }
  }
}
function isAttrClosing(str, idxOfAttrOpening, isThisClosingIdx) {
  if (typeof str !== "string" || !str.trim() || !Number.isInteger(idxOfAttrOpening) || !Number.isInteger(isThisClosingIdx) || !str[idxOfAttrOpening] || !str[isThisClosingIdx] || idxOfAttrOpening >= isThisClosingIdx) {
    return false;
  }
  const openingQuote = `'"`.includes(str[idxOfAttrOpening]) ? str[idxOfAttrOpening] : null;
  let oppositeToOpeningQuote = null;
  if (openingQuote) {
    oppositeToOpeningQuote = makeTheQuoteOpposite(openingQuote);
  }
  let chunkStartsAt;
  const quotesCount = new Map().set(`'`, 0).set(`"`, 0).set(`matchedPairs`, 0);
  let lastQuoteAt = null;
  let totalQuotesCount = 0;
  let lastQuoteWasMatched = false;
  let lastMatchedQuotesPairsStartIsAt;
  let lastMatchedQuotesPairsEndIsAt;
  let lastCapturedChunk;
  let secondLastCapturedChunk;
  let lastChunkWasCapturedAfterSuspectedClosing = false;
  let closingBracketMet = false;
  let openingBracketMet = false;
  for (let i = idxOfAttrOpening, len = str.length; i < len; i++) {
    const rightVal = right(str, i);
    const leftVal = left(str, i);
    if (
    `'"`.includes(str[i]) &&
    lastQuoteWasMatched &&
    lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening &&
    lastMatchedQuotesPairsEndIsAt !== undefined && lastMatchedQuotesPairsEndIsAt < i &&
    i >= isThisClosingIdx) {
      const E1 = i !== isThisClosingIdx || guaranteedAttrStartsAtX(str, right(str, isThisClosingIdx)) || `/>`.includes(str[rightVal]);
      const E2 = !(i > isThisClosingIdx && str[idxOfAttrOpening] === str[isThisClosingIdx] && str[idxOfAttrOpening] === str[i] &&
      plausibleAttrStartsAtX(str, i + 1));
      const E31 =
      i === isThisClosingIdx &&
      plausibleAttrStartsAtX(str, isThisClosingIdx + 1);
      const E32 =
      chunkStartsAt && chunkStartsAt < i && allHtmlAttribs.has(str.slice(chunkStartsAt, i).trim());
      if (chunkStartsAt) {
        str.slice(chunkStartsAt, i).trim();
      }
      const E33 = chunkStartsAt && chunkStartsAt < i && str[chunkStartsAt - 1] && !str[chunkStartsAt - 1].trim() &&
      Array.from(str.slice(chunkStartsAt, i).trim()).every(char => isAttrNameChar(char)) &&
      str[idxOfAttrOpening] === str[isThisClosingIdx] && !`/>`.includes(str[rightVal]) && ensureXIsNotPresentBeforeOneOfY(str, i + 1, "=", [`'`, `"`]);
      let attrNameCharsChunkOnTheLeft;
      if (i === isThisClosingIdx) {
        attrNameCharsChunkOnTheLeft = findAttrNameCharsChunkOnTheLeft(str, i);
      }
      const E34 =
      i === isThisClosingIdx && (
      !isAttrNameChar(str[leftVal]) ||
      attrNameCharsChunkOnTheLeft && !allHtmlAttribs.has(attrNameCharsChunkOnTheLeft)) &&
      str[leftVal] !== "=";
      const E41 =
      `/>`.includes(str[rightVal]) && i === isThisClosingIdx;
      const E42 =
      isAttrNameChar(str[rightVal]);
      const E43 =
      lastQuoteWasMatched && i !== isThisClosingIdx;
      const E5 =
      !(
      i >= isThisClosingIdx &&
      str[left(str, isThisClosingIdx)] === ":");
      return !!(E1 && E2 && (E31 || E32 || E33 || E34) && (E41 || E42 || E43) && E5);
    }
    if (`'"`.includes(str[i])) {
      if (str[i] === `'` && str[i - 1] === `"` && str[i + 1] === `"` || str[i] === `"` && str[i - 1] === `'` && str[i + 1] === `'`) {
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
      }
      quotesCount.set(str[i], quotesCount.get(str[i]) + 1);
      totalQuotesCount = quotesCount.get(`"`) + quotesCount.get(`'`);
    }
    if (str[i] === ">" && !closingBracketMet) {
      closingBracketMet = true;
      if (totalQuotesCount && quotesCount.get(`matchedPairs`) && totalQuotesCount === quotesCount.get(`matchedPairs`) * 2 &&
      i < isThisClosingIdx) {
        return false;
      }
    }
    if (str[i] === "<" &&
    str[rightVal] !== "%" && closingBracketMet && !openingBracketMet) {
      openingBracketMet = true;
      return false;
    }
    if (str[i].trim() && !chunkStartsAt) {
      if (isAttrNameChar(str[i])) {
        chunkStartsAt = i;
      }
    } else if (chunkStartsAt && !isAttrNameChar(str[i])) {
      secondLastCapturedChunk = lastCapturedChunk;
      lastCapturedChunk = str.slice(chunkStartsAt, i);
      lastChunkWasCapturedAfterSuspectedClosing = chunkStartsAt >= isThisClosingIdx;
      if (`'"`.includes(str[i]) && quotesCount.get(`matchedPairs`) === 0 && totalQuotesCount === 3 && str[idxOfAttrOpening] === str[i] && allHtmlAttribs.has(lastCapturedChunk) && !`'"`.includes(str[rightVal])) {
        const A1 = i > isThisClosingIdx;
        const A21 = !lastQuoteAt;
        const A22 = lastQuoteAt + 1 >= i;
        const A23 = str.slice(lastQuoteAt + 1, i).trim().split(/\s+/).every(chunk => allHtmlAttribs.has(chunk));
        const A3 = !lastCapturedChunk || !secondLastCapturedChunk || !secondLastCapturedChunk.endsWith(":");
        const B1 = i === isThisClosingIdx;
        const B21 = totalQuotesCount < 3;
        const B22 = !!lastQuoteWasMatched;
        const B23 = !lastQuoteAt;
        const B24 = lastQuoteAt + 1 >= i;
        const B25 = !str.slice(lastQuoteAt + 1, i).trim().split(/\s+/).every(chunk => allHtmlAttribs.has(chunk));
        return A1 && (A21 || A22 || A23) && A3 || B1 && (B21 || B22 || B23 || B24 || B25);
      }
      if (
      lastCapturedChunk && allHtmlAttribs.has(lastCapturedChunk) && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && lastMatchedQuotesPairsEndIsAt === isThisClosingIdx) {
        return true;
      }
    }
    if (
    `'"`.includes(str[i]) && (
    !(quotesCount.get(`"`) % 2) || !(quotesCount.get(`'`) % 2)) &&
    (quotesCount.get(`"`) + quotesCount.get(`'`)) % 2 && (
    lastCapturedChunk &&
    allHtmlAttribs.has(lastCapturedChunk) ||
    i > isThisClosingIdx + 1 && allHtmlAttribs.has(str.slice(isThisClosingIdx + 1, i).trim())) &&
    !(str[i + 1] === str[i] && str[i] === str[idxOfAttrOpening]) &&
    !(
    i > isThisClosingIdx + 1 &&
    str[left(str, isThisClosingIdx)] === ":") &&
    !(lastCapturedChunk && secondLastCapturedChunk && secondLastCapturedChunk.trim().endsWith(":"))) {
      const R0 = i > isThisClosingIdx;
      const R1 = !!openingQuote;
      const R2 = str[idxOfAttrOpening] !== str[isThisClosingIdx];
      const R3 = allHtmlAttribs.has(str.slice(idxOfAttrOpening + 1, isThisClosingIdx).trim());
      const R4 = !xBeforeYOnTheRight$1(str, i + 1, str[isThisClosingIdx], makeTheQuoteOpposite(str[isThisClosingIdx]));
      return R0 && !(R1 && R2 && R3 && R4);
    }
    if (
    (str[i] === "=" ||
    !str[i].length &&
    str[rightVal] === "=") &&
    lastCapturedChunk &&
    allHtmlAttribs.has(lastCapturedChunk)) {
      const W1 = i > isThisClosingIdx;
      const W2 =
      !(!(
      lastQuoteWasMatched && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && lastMatchedQuotesPairsEndIsAt === isThisClosingIdx ||
      guaranteedAttrStartsAtX(str, chunkStartsAt)) &&
      lastQuoteWasMatched && lastMatchedQuotesPairsStartIsAt !== undefined && lastMatchedQuotesPairsStartIsAt <= isThisClosingIdx);
      return W1 && W2;
    }
    if (i > isThisClosingIdx) {
      if (openingQuote && str[i] === openingQuote) {
        const Y1 = !!lastQuoteAt;
        const Y2 = lastQuoteAt === isThisClosingIdx;
        const Y3 = lastQuoteAt + 1 < i && str.slice(lastQuoteAt + 1, i).trim();
        const Y4 = str.slice(lastQuoteAt + 1, i).trim().split(/\s+/).every(chunk => allHtmlAttribs.has(chunk));
        const Y5 = i >= isThisClosingIdx;
        const Y6 = !str[rightVal] || !`'"`.includes(str[rightVal]);
        return !!(Y1 && Y2 && Y3 && Y4 && Y5 && Y6);
      }
      if (
      openingQuote &&
      str[isThisClosingIdx] === oppositeToOpeningQuote &&
      str[i] === oppositeToOpeningQuote) {
        return false;
      }
      if (str[i] === "/" || str[i] === ">" || str[i] === "<") {
        const R0 =
        str[idxOfAttrOpening] === str[isThisClosingIdx] &&
        lastQuoteAt === isThisClosingIdx &&
        !str.slice(idxOfAttrOpening + 1, isThisClosingIdx).includes(str[idxOfAttrOpening]);
        const R11 = quotesCount.get(`matchedPairs`) < 2;
        const attrNameCharsChunkOnTheLeft = findAttrNameCharsChunkOnTheLeft(str, i);
        const R12 = (!attrNameCharsChunkOnTheLeft || !allHtmlAttribs.has(attrNameCharsChunkOnTheLeft)) && (
        !(i > isThisClosingIdx &&
        quotesCount.get(`'`) &&
        quotesCount.get(`"`) &&
        quotesCount.get(`matchedPairs`) > 1) ||
        `/>`.includes(str[rightVal]));
        const R2 = totalQuotesCount < 3 ||
        quotesCount.get(`"`) + quotesCount.get(`'`) - quotesCount.get(`matchedPairs`) * 2 !== 2;
        const R31 = !lastQuoteWasMatched || lastQuoteWasMatched && !(lastMatchedQuotesPairsStartIsAt !== undefined && Array.from(str.slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt).trim()).every(char => isAttrNameChar(char)) && allHtmlAttribs.has(str.slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt).trim()));
        const R32 = !rightVal && totalQuotesCount % 2 === 0;
        const R33 = str[idxOfAttrOpening - 2] && str[idxOfAttrOpening - 1] === "=" && isAttrNameChar(str[idxOfAttrOpening - 2]);
        const R34 = !ensureXIsNotPresentBeforeOneOfY(str, i + 1, "<", [`='`, `="`]);
        return (
          R0 ||
          (R11 || R12) &&
          R2 && (
          R31 ||
          R32 ||
          R33 ||
          R34)
        );
      }
      if (str[i] === "=" && matchRight(str, i, [`'`, `"`], {
        trimBeforeMatching: true,
        trimCharsBeforeMatching: ["="]
      })) {
        return true;
      }
    } else {
      let firstNonWhitespaceCharOnTheLeft;
      if (str[i - 1] && str[i - 1].trim() && str[i - 1] !== "=") {
        firstNonWhitespaceCharOnTheLeft = i - 1;
      } else {
        for (let y = i; y--;) {
          if (str[y].trim() && str[y] !== "=") {
            firstNonWhitespaceCharOnTheLeft = y;
            break;
          }
        }
      }
      if (str[i] === "=" && matchRight(str, i, [`'`, `"`], {
        cb: char => !`/>`.includes(char),
        trimBeforeMatching: true,
        trimCharsBeforeMatching: ["="]
      }) &&
      isAttrNameChar(str[firstNonWhitespaceCharOnTheLeft]) &&
      !str.slice(idxOfAttrOpening + 1).startsWith("http") && !str.slice(idxOfAttrOpening + 1, i).includes("/") && !str.endsWith("src=", idxOfAttrOpening) && !str.endsWith("href=", idxOfAttrOpening)) {
        return false;
      }
      if (i === isThisClosingIdx && guaranteedAttrStartsAtX(str, i + 1)) {
        return true;
      }
      if (i < isThisClosingIdx && `'"`.includes(str[i]) && lastCapturedChunk && str[left(str, idxOfAttrOpening)] && str[left(str, idxOfAttrOpening)] !== "=" && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && allHtmlAttribs.has(lastCapturedChunk)) {
        return false;
      }
      if (i === isThisClosingIdx && `'"`.includes(str[i]) && (str[leftVal] === `'` || str[leftVal] === `"`) && lastCapturedChunk && secondLastCapturedChunk && totalQuotesCount % 2 === 0 && secondLastCapturedChunk.endsWith(":")) {
        return true;
      }
      if (i === isThisClosingIdx && `'"`.includes(str[i]) && str.slice(idxOfAttrOpening, isThisClosingIdx).includes(":") && (str[rightVal] === ">" || str[rightVal] === "/" && str[right(str, rightVal)] === ">")) {
        return true;
      }
    }
    if (`'"`.includes(str[i]) &&
    i > isThisClosingIdx) {
      if (
      !lastChunkWasCapturedAfterSuspectedClosing || !lastCapturedChunk ||
      !allHtmlAttribs.has(lastCapturedChunk)) {
        return false;
      }
      return true;
    }
    if (`'"`.includes(str[i])) {
      lastQuoteAt = i;
    }
    if (chunkStartsAt && !isAttrNameChar(str[i])) {
      chunkStartsAt = null;
    }
  }
  return false;
}

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const allHTMLTagsKnownToHumanity = new Set([
    "a",
    "abbr",
    "acronym",
    "address",
    "applet",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "basefont",
    "bdi",
    "bdo",
    "bgsound",
    "big",
    "blink",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "col",
    "colgroup",
    "command",
    "content",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "element",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "font",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "image",
    "img",
    "input",
    "ins",
    "isindex",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "listing",
    "main",
    "map",
    "mark",
    "marquee",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "multicol",
    "nav",
    "nextid",
    "nobr",
    "noembed",
    "noframes",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "plaintext",
    "pre",
    "progress",
    "q",
    "rb",
    "rp",
    "rt",
    "rtc",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "shadow",
    "slot",
    "small",
    "source",
    "spacer",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "tt",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    "xmp",
]);
// contains all common templating language head/tail marker characters:
const espChars = `{}%-$_()*|#`;
const veryEspChars = `{}|#`;
const notVeryEspChars = `%()$_*#`;
const leftyChars = `({`;
const rightyChars = `})`;
const espLumpBlacklist = [
    ")|(",
    "|(",
    ")(",
    "()",
    "}{",
    "{}",
    "%)",
    "*)",
    "||",
    "--",
];
const punctuationChars = `.,;!?`;
const BACKTICK = "\x60";
const LEFTDOUBLEQUOTMARK = `\u201C`;
const RIGHTDOUBLEQUOTMARK = `\u201D`;
function isLatinLetter(char) {
    // we mean Latin letters A-Z, a-z
    return !!(char &&
        ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
            (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123)));
}
// Considering custom element name character requirements:
// https://html.spec.whatwg.org/multipage/custom-elements.html
// Example of Unicode character in a regex:
// \u0041
// "-" | "." | [0-9] | "_" | [a-z] | #xB7 | [#xC0-#xEFFFF]
function charSuitableForTagName(char) {
    return /[.\-_a-z0-9\u00B7\u00C0-\uFFFD]/i.test(char);
}
// it flips all brackets backwards and puts characters in the opposite order
function flipEspTag(str) {
    let res = "";
    for (let i = 0, len = str.length; i < len; i++) {
        if (str[i] === "[") {
            res = `]${res}`;
        }
        else if (str[i] === "]") {
            res = `[${res}`;
        }
        else if (str[i] === "{") {
            res = `}${res}`;
        }
        else if (str[i] === "}") {
            res = `{${res}`;
        }
        else if (str[i] === "(") {
            res = `)${res}`;
        }
        else if (str[i] === ")") {
            res = `(${res}`;
        }
        else if (str[i] === "<") {
            res = `>${res}`;
        }
        else if (str[i] === ">") {
            res = `<${res}`;
        }
        else if (str[i] === LEFTDOUBLEQUOTMARK) {
            res = `${RIGHTDOUBLEQUOTMARK}${res}`;
        }
        else if (str[i] === RIGHTDOUBLEQUOTMARK) {
            res = `${LEFTDOUBLEQUOTMARK}${res}`;
        }
        else {
            res = `${str[i]}${res}`;
        }
    }
    return res;
}
function isTagNameRecognised(tagName) {
    return (allHTMLTagsKnownToHumanity.has(tagName.toLowerCase()) ||
        ["doctype", "cdata", "xml"].includes(tagName.toLowerCase()));
}
// Tells, if substring x goes before substring y on the right
// side of "str", starting at index "startingIdx".
// Used to troubleshoot dirty broken code.
function xBeforeYOnTheRight(str, startingIdx, x, y) {
    for (let i = startingIdx, len = str.length; i < len; i++) {
        if (str.startsWith(x, i)) {
            // if x was first, Bob's your uncle, that's truthy result
            return true;
        }
        if (str.startsWith(y, i)) {
            // since we're in this clause, x failed, so if y matched,
            // this means y precedes x
            return false;
        }
    }
    // default result
    return false;
}
// deliberately a simpler check for perf reasons
function isObj(something) {
    return (something && typeof something === "object" && !Array.isArray(something));
}
// https://html.spec.whatwg.org/multipage/syntax.html#elements-2
const voidTags = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
];
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Inline_text_semantics
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Image_and_multimedia
const inlineTags = new Set([
    "a",
    "abbr",
    "acronym",
    "audio",
    "b",
    "bdi",
    "bdo",
    "big",
    "br",
    "button",
    "canvas",
    "cite",
    "code",
    "data",
    "datalist",
    "del",
    "dfn",
    "em",
    "embed",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "map",
    "mark",
    "meter",
    "noscript",
    "object",
    "output",
    "picture",
    "progress",
    "q",
    "ruby",
    "s",
    "samp",
    "script",
    "select",
    "slot",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
    "svg",
    "template",
    "textarea",
    "time",
    "u",
    "tt",
    "var",
    "video",
    "wbr",
]);
// Rules which might wrap the media queries, for example:
// @supports (display: grid) {...
// const atRulesWhichMightWrapStyles = ["media", "supports", "document"];
const charsThatEndCSSChunks = ["{", "}", ","];
const SOMEQUOTE = `'"${LEFTDOUBLEQUOTMARK}${RIGHTDOUBLEQUOTMARK}`;
const attrNameRegexp = /[\w-]/;

// returns found object's index in "layers" array
function getLastEspLayerObjIdx(layers) {
    if (layers && layers.length) {
        // traverse layers backwards
        for (let z = layers.length; z--;) {
            if (layers[z].type === "esp") {
                return z;
            }
        }
    }
    return undefined;
}

function getWholeEspTagLumpOnTheRight(str, i, layers) {
    let wholeEspTagLumpOnTheRight = str[i];
    const len = str.length;
    // getLastEspLayerObj()
    const lastEspLayerObj = layers[getLastEspLayerObjIdx(layers)];
    for (let y = i + 1; y < len; y++) {
        // if righty character is on the left and now it's lefty,
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
        // we slice off where righty starts
        if (leftyChars.includes(str[y]) && rightyChars.includes(str[y - 1])) {
            break;
        }
        if (
        // consider:
        // ${(y/4)?int}
        //   ^
        //   we're here - is this opening bracket part of heads?!?
        //
        // or JSP:
        // <%=(new java.util.Date()).toLocaleString()%>
        //    ^
        // if lump already is two chars long
        wholeEspTagLumpOnTheRight.length > 1 &&
            // contains one of opening-polarity characters
            (wholeEspTagLumpOnTheRight.includes(`<`) ||
                wholeEspTagLumpOnTheRight.includes(`{`) ||
                wholeEspTagLumpOnTheRight.includes(`[`) ||
                wholeEspTagLumpOnTheRight.includes(`(`)) &&
            // bail if it's a bracket
            str[y] === "(") {
            break;
        }
        if (espChars.includes(str[y]) ||
            // in case it's XML tag-like templating tag, such as JSP,
            // we check, is it in the last guessed lump's character's list
            (lastEspLayerObj &&
                lastEspLayerObj.guessedClosingLump.includes(str[y])) ||
            (str[i] === "<" && str[y] === "/") ||
            // accept closing bracket if it's RPL comment, tails of: <#-- z -->
            (str[y] === ">" &&
                wholeEspTagLumpOnTheRight === "--" &&
                Array.isArray(layers) &&
                layers.length &&
                layers[layers.length - 1].type === "esp" &&
                layers[layers.length - 1].openingLump[0] === "<" &&
                layers[layers.length - 1].openingLump[2] === "-" &&
                layers[layers.length - 1].openingLump[3] === "-") ||
            // we do exception for extra characters, such as JSP's
            // exclamation mark: <%! yo %>
            //                     ^
            // which is legit...
            //
            // at least one character must have been caught already
            (!lastEspLayerObj && y > i && `!=@`.includes(str[y]))) {
            wholeEspTagLumpOnTheRight += str[y];
        }
        else {
            break;
        }
    }
    // if lump is tails+heads, report the length of tails only:
    // {%- a -%}{%- b -%}
    //        ^
    //      we're talking about this lump of tails and heads
    if (wholeEspTagLumpOnTheRight &&
        Array.isArray(layers) &&
        layers.length &&
        layers[layers.length - 1].type === "esp" &&
        layers[layers.length - 1].guessedClosingLump &&
        wholeEspTagLumpOnTheRight.length >
            layers[layers.length - 1].guessedClosingLump.length) {
        //
        // case I.
        //
        if (wholeEspTagLumpOnTheRight.endsWith(layers[layers.length - 1].openingLump)) {
            // no need to extract tails, heads "{%-" were confirmed in example:
            // {%- a -%}{%- b -%}
            //          ^
            //         here
            // return string, extracted ESP tails
            return wholeEspTagLumpOnTheRight.slice(0, wholeEspTagLumpOnTheRight.length -
                layers[layers.length - 1].openingLump.length);
        }
        // ELSE
        // imagine a case like:
        // {%- aa %}{% bb %}
        // opening heads were {%-, flipped were -%}. Now when we take lump %}{%
        // and match, the dash will be missing.
        // What we're going to do is we'll split the lump where last matched
        // continuous chunk ends (%} in example above) with condition that
        // at least one character from ESP-list follows, which is not part of
        // guessed closing lump.
        let uniqueCharsListFromGuessedClosingLumpArr = new Set(layers[layers.length - 1].guessedClosingLump);
        let found = 0;
        for (let y = 0, len2 = wholeEspTagLumpOnTheRight.length; y < len2; y++) {
            if (!uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLumpOnTheRight[y]) &&
                found > 1) {
                return wholeEspTagLumpOnTheRight.slice(0, y);
            }
            if (uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLumpOnTheRight[y])) {
                found += 1;
                uniqueCharsListFromGuessedClosingLumpArr = new Set([...uniqueCharsListFromGuessedClosingLumpArr].filter((el) => el !== wholeEspTagLumpOnTheRight[y]));
            }
        }
    }
    return wholeEspTagLumpOnTheRight;
}

// This is an extracted logic which detects where token of a particular kind
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
    return !!(
    // the opening is deliberately loose, with one dash missing, "!-" instead of "!--"
    ((str[i] === "<" &&
        (matchRight(str, i, ["!--"], {
            maxMismatches: 1,
            firstMustMatch: true,
            trimBeforeMatching: true,
        }) ||
            matchRightIncl(str, i, ["<![endif]"], {
                i: true,
                maxMismatches: 2,
                trimBeforeMatching: true,
            })) &&
        !matchRight(str, i, ["![cdata", "<"], {
            i: true,
            maxMismatches: 1,
            trimBeforeMatching: true,
        }) &&
        (token.type !== "comment" || token.kind !== "not")) ||
        (str[i] === "-" &&
            matchRightIncl(str, i, ["-->"], {
                trimBeforeMatching: true,
            }) &&
            (token.type !== "comment" ||
                (!token.closing && token.kind !== "not")) &&
            !matchLeft(str, i, "<", {
                trimBeforeMatching: true,
                trimCharsBeforeMatching: ["-", "!"],
            }) &&
            // insurance against ESP tag, RPL comments: <#-- z -->
            (!Array.isArray(layers) ||
                !layers.length ||
                layers[layers.length - 1].type !== "esp" ||
                !(layers[layers.length - 1].openingLump[0] === "<" &&
                    layers[layers.length - 1].openingLump[2] === "-" &&
                    layers[layers.length - 1].openingLump[3] === "-")))));
}

// import { matchLeft, matchRight } from "string-match-left-right";
function startsCssComment(str, i, _token, _layers, withinStyle) {
    return (
    // cast to bool
    withinStyle &&
        // match the / *
        ((str[i] === "/" && str[i + 1] === "*") ||
            // match the * /
            (str[i] === "*" && str[i + 1] === "/")));
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
function matchLayerLast(wholeEspTagLump, layers, matchFirstInstead = false) {
    if (!layers.length) {
        return;
    }
    const whichLayerToMatch = matchFirstInstead
        ? layers[0]
        : layers[layers.length - 1];
    // console.log(
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
    if (
    // imagine case of Nunjucks: heads "{%" are normal but tails "-%}" (notice dash)
    wholeEspTagLump.includes(whichLayerToMatch.guessedClosingLump) ||
        // match every character from the last "layers" complex-type entry must be
        // present in the extracted lump
        Array.from(wholeEspTagLump).every((char) => whichLayerToMatch.guessedClosingLump.includes(char)) ||
        // consider ruby heads, <%# and tails -%>
        (whichLayerToMatch.guessedClosingLump &&
            // length is more than 2
            whichLayerToMatch.guessedClosingLump.length > 2 &&
            // and last two characters match to what was guessed
            whichLayerToMatch.guessedClosingLump[whichLayerToMatch.guessedClosingLump.length - 1] === wholeEspTagLump[wholeEspTagLump.length - 1] &&
            whichLayerToMatch.guessedClosingLump[whichLayerToMatch.guessedClosingLump.length - 2] === wholeEspTagLump[wholeEspTagLump.length - 2])) {
        return wholeEspTagLump.length;
    }
    // console.log(`054 matchLayer(): finally, return undefined`);
}

/**
 * @name is-html-tag-opening
 * @fileoverview Does an HTML tag start at given position?
 * @version 2.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/is-html-tag-opening/}
 */

const defaultOpts = {
  allowCustomTagNames: false,
  skipOpeningBracket: false
};
const BACKSLASH$1 = "\u005C";
const knownHtmlTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h1 - h6", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "slot", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xml"];

function isNotLetter(char) {
  return char === undefined || char.toUpperCase() === char.toLowerCase() && !/\d/.test(char) && char !== "=";
}

function extraRequirements(str, idx) {
  return str[idx] === "<" ||
  str[left(str, idx)] === "<";
}
function isOpening(str, idx = 0, originalOpts) {
  if (typeof str !== "string") {
    throw new Error(`is-html-tag-opening: [THROW_ID_01] the first input argument should have been a string but it was given as "${typeof str}", value being ${JSON.stringify(str, null, 4)}`);
  }
  if (!Number.isInteger(idx) || idx < 0) {
    throw new Error(`is-html-tag-opening: [THROW_ID_02] the second input argument should have been a natural number string index but it was given as "${typeof idx}", value being ${JSON.stringify(idx, null, 4)}`);
  }
  const opts = { ...defaultOpts,
    ...originalOpts
  };
  const whitespaceChunk = `[\\\\ \\t\\r\\n/]*`;
  const generalChar = `._a-z0-9\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\uFFFF`;
  const r1 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}${whitespaceChunk}\\w+${whitespaceChunk}\\/?${whitespaceChunk}>`, "g");
  const r5 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}${whitespaceChunk}[${generalChar}]+[-${generalChar}]*${whitespaceChunk}>`, "g");
  const r2 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}\\s*\\w+\\s+\\w+(?:-\\w+)?\\s*=\\s*['"\\w]`, "g");
  const r6 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}\\s*\\w+\\s+[${generalChar}]+[-${generalChar}]*(?:-\\w+)?\\s*=\\s*['"\\w]`);
  const r3 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}\\s*\\/?\\s*\\w+\\s*\\/?\\s*>`, "g");
  const r7 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}\\s*\\/?\\s*[${generalChar}]+[-${generalChar}]*\\s*\\/?\\s*>`, "g");
  const r4 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}${whitespaceChunk}\\w+(?:\\s*\\w+)?\\s*\\w+=['"]`, "g");
  const r8 = new RegExp(`^<${opts.skipOpeningBracket ? "?" : ""}${whitespaceChunk}[${generalChar}]+[-${generalChar}]*\\s+(?:\\s*\\w+)?\\s*\\w+=['"]`, "g");
  const r9 = new RegExp(`^<${opts.skipOpeningBracket ? `?\\/?` : ""}(${whitespaceChunk}[${generalChar}]+)+${whitespaceChunk}[\\\\/=>]`, "");
  const r10 = new RegExp(`^\\/\\s*\\w+s*>`);
  const whatToTest = idx ? str.slice(idx) : str;
  const leftSideIdx = left(str, idx);
  let qualified = false;
  let passed = false;
  const matchingOptions = {
    cb: isNotLetter,
    i: true,
    trimCharsBeforeMatching: ["/", BACKSLASH$1, "!", " ", "\t", "\n", "\r"]
  };
  if (opts.allowCustomTagNames) {
    if ((opts.skipOpeningBracket && (str[idx - 1] === "<" || str[idx - 1] === "/" && str[left(str, leftSideIdx)] === "<") || whatToTest[0] === "<" && whatToTest[1] && whatToTest[1].trim()) && (r9.test(whatToTest) || /^<\w+$/.test(whatToTest))) {
      passed = true;
    } else if (r5.test(whatToTest) && extraRequirements(str, idx)) {
      passed = true;
    } else if (r6.test(whatToTest)) {
      passed = true;
    } else if (r7.test(whatToTest) && extraRequirements(str, idx)) {
      passed = true;
    } else if (r8.test(whatToTest)) {
      passed = true;
    } else if (str[idx] === "/" && str[leftSideIdx] !== "<" && r10.test(whatToTest)) {
      passed = true;
    }
  } else {
    if ((opts.skipOpeningBracket && (
    str[idx - 1] === "<" ||
    str[idx - 1] === "/" && str[left(str, leftSideIdx)] === "<") || (whatToTest[0] === "<" || whatToTest[0] === "/" && (!str[leftSideIdx] || str[leftSideIdx] !== "<")) && whatToTest[1] && whatToTest[1].trim()) && r9.test(whatToTest)) {
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
      cb: char => {
        if (char === undefined) {
          if (str[idx] === "<" && str[idx + 1] && str[idx + 1].trim() || str[idx - 1] === "<") {
            passed = true;
          }
          return true;
        }
        return char.toUpperCase() === char.toLowerCase() && !/\d/.test(char) && char !== "=";
      },
      i: true,
      trimCharsBeforeMatching: ["<", "/", BACKSLASH$1, "!", " ", "\t", "\n", "\r"]
    })) {
      passed = true;
    }
  }
  if (!passed && str[idx] === "<" && str[idx + 1] && str[idx + 1].trim() && matchRight(str, idx, knownHtmlTags, matchingOptions)) {
    passed = true;
  }
  const res = typeof str === "string" && idx < str.length && passed;
  return res;
}

const BACKSLASH = "\u005C";
// This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.
function startsTag(str, i, token, layers, withinStyle, leftVal, rightVal) {
    return !!(str[i] &&
        str[i].trim().length &&
        (!layers.length || token.type === "text") &&
        (!token.kind ||
            !["doctype", "xml"].includes(token.kind)) &&
        // within CSS styles, initiate tags only on opening bracket:
        (!withinStyle || str[i] === "<") &&
        ((str[i] === "<" &&
            (isOpening(str, i, {
                allowCustomTagNames: true,
            }) ||
                str[rightVal] === ">" ||
                matchRight(str, i, ["doctype", "xml", "cdata"], {
                    i: true,
                    trimBeforeMatching: true,
                    trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
                }))) ||
            // <div>some text /div>
            //                ^
            //    tag begins here
            (str[i] === "/" &&
                isLatinLetter(str[i + 1]) &&
                str[leftVal] !== "<" &&
                isOpening(str, i, {
                    allowCustomTagNames: true,
                    skipOpeningBracket: true,
                })) ||
            (isLatinLetter(str[i]) &&
                (!str[i - 1] ||
                    (!isLatinLetter(str[i - 1]) &&
                        !["<", "/", "!", BACKSLASH].includes(str[leftVal]))) &&
                isOpening(str, i, {
                    allowCustomTagNames: false,
                    skipOpeningBracket: true,
                }))) &&
        (token.type !== "esp" || (token.tail && token.tail.includes(str[i]))));
}

// This is an extracted logic which detects where token of a particular kind
// starts. Previously it sat within if() clauses but became unwieldy and
// so we extracted into a function.
function startsEsp(str, i, token, layers, withinStyle) {
    const res = 
    // 1. two consecutive esp characters - Liquid, Mailchimp etc.
    // {{ or |* and so on
    (espChars.includes(str[i]) &&
        str[i + 1] &&
        espChars.includes(str[i + 1]) &&
        // ensure our suspected lump doesn't comprise only
        // of "notVeryEspChars" - real ESP tag |**| can
        // contain asterisk (*) but only asterisks can't
        // comprise an ESP tag. But curly braces can -
        // {{ and }} are valid Nunjucks heads/tails.
        // So not all ESP tag characters are equal.
        !(notVeryEspChars.includes(str[i]) && notVeryEspChars.includes(str[i + 1])) &&
        // only "veryEspChars" group characters can
        // be repeated, like {{ and }} - other's can't
        // for example, ** is not real ESP heads
        (str[i] !== str[i + 1] || veryEspChars.includes(str[i])) &&
        token.type !== "rule" &&
        token.type !== "at" &&
        !(str[i] === "-" && "-{(".includes(str[i + 1])) &&
        !("})".includes(str[i]) && "-".includes(str[i + 1])) &&
        !(
        // insurance against repeated percentages
        //
        // imagine: "99%%."
        //             ^
        //      we're here
        (str[i] === "%" &&
            str[i + 1] === "%" &&
            "0123456789".includes(str[i - 1]) &&
            (!str[i + 2] ||
                punctuationChars.includes(str[i + 2]) ||
                !str[i + 2].trim().length))) &&
        !(withinStyle &&
            ("{}".includes(str[i]) || "{}".includes(str[right(str, i)])))) ||
        //
        // 2. html-like syntax
        //
        // 2.1 - Responsys RPL and similar
        // <#if z> or </#if> and so on
        // normal opening tag
        (str[i] === "<" &&
            // and
            // either it's closing tag and what follows is ESP-char
            ((str[i + 1] === "/" && espChars.includes(str[i + 2])) ||
                // or
                // it's not closing and esp char follows right away
                (espChars.includes(str[i + 1]) &&
                    // but no cheating, character must not be second-grade
                    !["-"].includes(str[i + 1])))) ||
        // 2.2 - JSP (Java Server Pages)
        // <%@ page blablabla %>
        // <c:set var="someList" value="${jspProp.someList}" />
        (str[i] === "<" &&
            // covers majority of JSP tag cases
            (str[i + 1] === "%" ||
                // <jsp:
                str.startsWith("jsp:", i + 1) ||
                // <cms:
                str.startsWith("cms:", i + 1) ||
                // <c:
                str.startsWith("c:", i + 1))) ||
        str.startsWith("${jspProp", i) ||
        //
        // 3. single character tails, for example RPL's closing curlies: ${zzz}
        // it's specifically a closing-kind character
        (`>})`.includes(str[i]) &&
            // heads include the opposite of it
            Array.isArray(layers) &&
            layers.length &&
            layers[layers.length - 1].type === "esp" &&
            layers[layers.length - 1].openingLump.includes(flipEspTag(str[i])) &&
            // insurance against "greater than", as in:
            // <#if product.weight > 100>
            (str[i] !== ">" || !xBeforeYOnTheRight(str, i + 1, ">", "<"))) ||
        //
        // 4. comment closing in RPL-like templating languages, for example:
        // <#-- z -->
        (str[i] === "-" &&
            str[i + 1] === "-" &&
            str[i + 2] === ">" &&
            Array.isArray(layers) &&
            layers.length &&
            layers[layers.length - 1].type === "esp" &&
            layers[layers.length - 1].openingLump[0] === "<" &&
            layers[layers.length - 1].openingLump[2] === "-" &&
            layers[layers.length - 1].openingLump[3] === "-");
    return !!res;
}

var version$1 = "5.5.5";

const version = version$1;
const importantStartsRegexp = /^\s*!?\s*[a-zA-Z0-9]+(?:[\s;}<>'"]|$)/gm;
const defaults = {
    tagCb: null,
    tagCbLookahead: 0,
    charCb: null,
    charCbLookahead: 0,
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100,
};
/**
 * HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 */
function tokenizer(str, originalOpts) {
    const start = Date.now();
    //
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
        }
        else {
            throw new Error(`codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(str, null, 4)}`);
        }
    }
    if (originalOpts && !isObj(originalOpts)) {
        throw new Error(`codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(originalOpts, null, 4)}`);
    }
    if (originalOpts &&
        isObj(originalOpts) &&
        originalOpts.tagCb &&
        typeof originalOpts.tagCb !== "function") {
        throw new Error(`codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ${typeof originalOpts.tagCb}, equal to ${JSON.stringify(originalOpts.tagCb, null, 4)}`);
    }
    if (originalOpts &&
        isObj(originalOpts) &&
        originalOpts.charCb &&
        typeof originalOpts.charCb !== "function") {
        throw new Error(`codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ${typeof originalOpts.charCb}, equal to ${JSON.stringify(originalOpts.charCb, null, 4)}`);
    }
    if (originalOpts &&
        isObj(originalOpts) &&
        originalOpts.reportProgressFunc &&
        typeof originalOpts.reportProgressFunc !== "function") {
        throw new Error(`codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ${typeof originalOpts.reportProgressFunc}, equal to ${JSON.stringify(originalOpts.reportProgressFunc, null, 4)}`);
    }
    //
    //
    //
    //
    //
    //
    //
    // OPTS
    // ---------------------------------------------------------------------------
    const opts = { ...defaults, ...originalOpts };
    //
    //
    //
    //
    //
    //
    //
    // VARS
    // ---------------------------------------------------------------------------
    let currentPercentageDone = 0;
    let lastPercentage = 0;
    const len = str.length;
    const midLen = Math.floor(len / 2);
    let doNothing = 0; // index until where to do nothing
    let withinScript = false; // marks a state of being between <script> and </script>
    let withinStyle = false; // flag used to instruct content after <style> to toggle type="css"
    let withinStyleComment = false;
    // opts.*CbLookahead allows to request "x"-many tokens "from the future"
    // to be reported upon each token. You can check what's coming next.
    // To implement this, we need to stash "x"-many tokens and only when enough
    // have been gathered, array.shift() the first one and ping the callback
    // with it, along with "x"-many following tokens. Later, in the end,
    // we clean up stashes and report only as many as we have.
    // The stashes will be LIFO (last in first out) style arrays:
    const tagStash = [];
    const charStash = [];
    // when we compile the token, we fill this object:
    let token = {};
    function tokenReset() {
        // object-assign is basically cloning - objects are passed by reference,
        // we can't risk mutating the default object:
        token = {
            type: null,
            start: null,
            end: null,
            value: null,
        };
        attribReset();
    }
    // same for attributes:
    const attribDefaults = {
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
        attribLeft: null,
    };
    let attrib = { ...attribDefaults };
    function attribReset() {
        // object-assign is basically cloning - objects are passed by reference,
        // we can't risk mutating the default object:
        attrib = lodash_clonedeep(attribDefaults);
    }
    function attribPush(tokenObj) {
        // 1. clean up any existing tokens first
        /* istanbul ignore else */
        if (attrib.attribValue.length &&
            attrib.attribValue[~-attrib.attribValue.length].start &&
            !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = tokenObj.start;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, tokenObj.start);
        }
        attrib.attribValue.push(tokenObj);
    }
    // same for property
    const propertyDefault = {
        start: null,
        end: null,
        property: null,
        propertyStarts: null,
        propertyEnds: null,
        value: null,
        valueStarts: null,
        valueEnds: null,
        important: null,
        importantStarts: null,
        importantEnds: null,
        colon: null,
        semi: null,
    };
    let property = { ...propertyDefault };
    function propertyReset() {
        property = { ...propertyDefault };
    }
    // The CSS properties can be in <style> blocks or inline, <div style="">.
    // When we process the code, we have to address both places. This "push"
    // is used in handful of places so we DRY'ed it to a function.
    function pushProperty(p) {
        // push and init and patch up to resume
        if (attrib && attrib.attribName === "style") {
            attrib.attribValue.push({ ...p });
        }
        else if (token && Array.isArray(token.properties)) {
            token.properties.push({ ...p });
        }
    }
    // Initial resets:
    tokenReset();
    // ---------------------------------------------------------------------------
    let selectorChunkStartedAt;
    // For example:
    //
    //       <style type="text/css">
    //         .unused1[z].unused2, .used[z] {a:1;}
    //         |                 |
    //         <-selector chunk ->
    //
    //
    // ---------------------------------------------------------------------------
    let parentTokenToBackup;
    // We use it for nested ESP tags - for example, <td{% z %}>
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
    let attribToBackup;
    // We use it when ESP tag is inside the attribute:
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
    let lastNonWhitespaceCharAt = null;
    // ---------------------------------------------------------------------------
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
    const layers = [];
    // example of contents:
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
        return !!(Array.isArray(layers) &&
            layers.length &&
            layers[~-layers.length].type === something);
    }
    // processes closing comment - it's DRY'ed here because it's in multiple places
    // considering broken code like stray closing inline css comment blocks etc.
    function closingComment(i) {
        const end = (right(str, i) || i) + 1;
        attribPush({
            type: "comment",
            start: i,
            end,
            value: str.slice(i, end),
            closing: true,
            kind: "block",
            language: "css",
        });
        // skip next character
        doNothing = end;
        // pop the block comment layer
        if (lastLayerIs("block")) {
            layers.pop();
        }
    }
    function reportFirstFromStash(stash, cb, lookaheadLength) {
        // start to assemble node we're report to the callback cb1()
        const currentElem = stash.shift();
        // ^ shift removes it from stash
        // now we need the "future" nodes, as many as "lookahead" of them
        // that's the container where they'll sit:
        const next = [];
        for (let i = 0; i < lookaheadLength; i++) {
            // we want as many as "lookaheadLength" from stash but there might be
            // not enough there
            if (stash[i]) {
                next.push(lodash_clonedeep(stash[i]));
            }
            else {
                break;
            }
        }
        // finally, ping the callback with assembled element:
        if (typeof cb === "function") {
            cb(currentElem, next);
        }
    }
    function pingCharCb(incomingToken) {
        // no cloning, no reset
        if (opts.charCb) {
            // if there were no stashes, we'd call the callback like this:
            // opts.charCb(incomingToken);
            // 1. push to stash
            charStash.push(incomingToken);
            // 2. is there are enough tokens in the stash, ping the first-one
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
            tagStash.push(incomingToken);
            // 2. is there are enough tokens in the stash, ping the first-one
            if (tagStash.length > opts.tagCbLookahead) {
                reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
            }
        }
    }
    function dumpCurrentToken(incomingToken, i) {
        // Let's ensure it was not a token with trailing whitespace, because now is
        // the time to separate it and report it as a standalone token.
        // Also, the following clause will catch the unclosed tags like
        // <a href="z" click here</a>
        if (!["text", "esp"].includes(incomingToken.type) &&
            incomingToken.start !== null &&
            incomingToken.start < i &&
            ((str[~-i] && !str[~-i].trim()) || str[i] === "<")) {
            // this ending is definitely a token ending. Now the question is,
            // maybe we need to split all gathered token contents into two:
            // maybe it's a tag and a whitespace? or an unclosed tag?
            // in some cases, this token.end will be only end of a second token,
            // we'll need to find where this last chunk started and terminate the
            // previous token (one which started at the current token.start) there.
            if (left(str, i) !== null) {
                incomingToken.end = left(str, i) + 1;
            }
            else {
                incomingToken.end = i;
            }
            incomingToken.value = str.slice(incomingToken.start, incomingToken.end);
            if (incomingToken.type === "tag" &&
                !"/>".includes(str[~-incomingToken.end])) {
                // we need to potentially shift the incomingToken.end left, imagine:
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
                let cutOffIndex = incomingToken.tagNameEndsAt || i;
                if (Array.isArray(incomingToken.attribs) &&
                    incomingToken.attribs.length) {
                    // initial cut-off point is token.tagNameEndsAt
                    // with each validated attribute, push the cutOffIndex forward:
                    for (let i2 = 0, len2 = incomingToken.attribs.length; i2 < len2; i2++) {
                        if (incomingToken.attribs[i2].attribNameRecognised &&
                            incomingToken.attribs[i2].attribEnds) {
                            cutOffIndex = incomingToken.attribs[i2].attribEnds;
                            // small tweak - consider this:
                            // <a href="z" click here</a>
                            //            ^
                            //         this space in particular
                            // that space above should belong to the tag's index range,
                            // unless the whitespace is bigger than 1:
                            // <a href="z"   click here</a>
                            if (str[cutOffIndex + 1] &&
                                !str[cutOffIndex].trim() &&
                                str[cutOffIndex + 1].trim()) {
                                cutOffIndex += 1;
                            }
                        }
                        else {
                            // delete false attributes from incomingToken.attribs
                            if (i2 === 0) {
                                // if it's the first attribute and it's already
                                // not suitable, for example:
                                // <a click here</a>
                                // all attributes ("click", "here") are removed:
                                incomingToken.attribs = [];
                            }
                            else {
                                // leave only attributes up to i2-th
                                incomingToken.attribs = incomingToken.attribs.splice(0, i2);
                            }
                            // in the end stop the loop:
                            break;
                        }
                    }
                }
                incomingToken.end = cutOffIndex;
                incomingToken.value = str.slice(incomingToken.start, incomingToken.end);
                if (!incomingToken.tagNameEndsAt) {
                    incomingToken.tagNameEndsAt = cutOffIndex;
                }
                if (incomingToken.tagNameStartsAt &&
                    incomingToken.tagNameEndsAt &&
                    !incomingToken.tagName) {
                    incomingToken.tagName = str.slice(incomingToken.tagNameStartsAt, cutOffIndex);
                    incomingToken.recognised = isTagNameRecognised(incomingToken.tagName);
                }
                pingTagCb(incomingToken);
                initToken("text", cutOffIndex);
            }
            else {
                pingTagCb(incomingToken);
                tokenReset();
                // if there was whitespace after token's end:
                if (str[~-i] && !str[~-i].trim()) {
                    initToken("text", left(str, i) + 1);
                }
            }
        }
        // if a token is already being recorded, end it
        if (token.start !== null) {
            if (token.end === null && token.start !== i) {
                // (esp tags will have it set already)
                token.end = i;
                token.value = str.slice(token.start, token.end);
            }
            // normally we'd ping the token but let's not forget we have token stashes
            // in "attribToBackup" and "parentTokenToBackup"
            if (token.start !== null && token.end) {
                // if it's a text token inside "at" rule, nest it, push into that
                // "at" rule pending in layers - otherwise, ping as standalone
                if (lastLayerIs("at")) {
                    layers[~-layers.length].token.rules.push(token);
                }
                else {
                    pingTagCb(token);
                }
            }
            tokenReset();
        }
    }
    function atRuleWaitingForClosingCurlie() {
        return (lastLayerIs("at") &&
            isObj(layers[~-layers.length].token) &&
            layers[~-layers.length].token.openingCurlyAt &&
            !layers[~-layers.length].token.closingCurlyAt);
    }
    function getNewToken(type, startVal = null) {
        if (type === "tag") {
            return {
                type,
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
                attribs: [],
            };
        }
        if (type === "comment") {
            return {
                type,
                start: startVal,
                end: null,
                value: null,
                closing: false,
                kind: "simple",
                language: "html", // or "css"
            };
        }
        if (type === "rule") {
            return {
                type,
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
                properties: [],
            };
        }
        if (type === "at") {
            return {
                type,
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
                rules: [],
            };
        }
        if (type === "esp") {
            return {
                type,
                start: startVal,
                end: null,
                value: null,
                head: null,
                headStartsAt: null,
                headEndsAt: null,
                tail: null,
                tailStartsAt: null,
                tailEndsAt: null,
            };
        }
        // a default is text token
        return {
            type: "text",
            start: startVal,
            end: null,
            value: null,
        };
    }
    function initToken(type, startVal) {
        // we mutate the object on the parent scope, so no Object.assign here
        attribReset();
        token = getNewToken(type, startVal);
    }
    function initProperty(propertyStarts) {
        // we mutate the object on the parent scope, so no Object.assign here
        propertyReset();
        if (typeof propertyStarts === "number") {
            property.propertyStarts = propertyStarts;
            property.start = propertyStarts;
        }
        else {
            property = { ...propertyDefault, ...propertyStarts };
        }
    }
    function ifQuoteThenAttrClosingQuote(idx) {
        // either it's not a quote:
        return (!`'"`.includes(str[idx]) ||
            // precaution when both attrib.attribOpeningQuoteAt and
            // attrib.attribValueStartsAt are missing and thus unusable - just
            // skip this clause in that case... (but it should not ever happen)
            !(attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt) ||
            // or it's real closing quote, because if not, let's keep it within
            // the value, it will be easier to validate, imagine:
            // <div style="float:"left"">
            //
            isAttrClosing(str, (attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt), idx));
    }
    function attrEndsAt(idx) {
        // either we're within normal head css styles:
        return ((`;}/`.includes(str[idx]) &&
            (!attrib || !attrib.attribName || attrib.attribName !== "style")) ||
            // or within inline css styles within html
            (`/;'"><`.includes(str[idx]) &&
                attrib &&
                attrib.attribName === "style" &&
                // and it's a real quote, not rogue double-wrapping around the value
                ifQuoteThenAttrClosingQuote(idx)));
    }
    //
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
    for (let i = 0; i <= len; i++) {
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
        // Logging:
        // -------------------------------------------------------------------------
        // Progress:
        // -------------------------------------------------------------------------
        if (!doNothing && str[i] && opts.reportProgressFunc) {
            if (len > 1000 && len < 2000) {
                if (i === midLen) {
                    opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
                }
            }
            else if (len >= 2000) {
                // defaults:
                // opts.reportProgressFuncFrom = 0
                // opts.reportProgressFuncTo = 100
                currentPercentageDone =
                    opts.reportProgressFuncFrom +
                        Math.floor((i / len) *
                            (opts.reportProgressFuncTo - opts.reportProgressFuncFrom));
                if (currentPercentageDone !== lastPercentage) {
                    lastPercentage = currentPercentageDone;
                    opts.reportProgressFunc(currentPercentageDone);
                }
            }
        }
        // Left/Right helpers
        // -------------------------------------------------------------------------
        const leftVal = left(str, i);
        const rightVal = right(str, i);
        // Turn off doNothing if marker passed
        // -------------------------------------------------------------------------
        if (withinStyle &&
            token.type &&
            !["rule", "at", "text", "comment"].includes(token.type)) {
            withinStyle = false;
        }
        if (doNothing && i >= doNothing) {
            doNothing = 0;
        }
        // skip chain of the same-type characters
        // -------------------------------------------------------------------------
        if (isLatinLetter(str[i]) &&
            isLatinLetter(str[~-i]) &&
            isLatinLetter(str[i + 1])) {
            // <style>.a{color:1pximportant}
            //                    ^
            //                  mangled !important
            if (property &&
                property.valueStarts &&
                !property.valueEnds &&
                !property.importantStarts &&
                str.startsWith("important", i)) {
                property.valueEnds = i;
                property.value = str.slice(property.valueStarts, i);
                property.importantStarts = i;
            }
            continue;
        }
        if (` \t\r\n`.includes(str[i]) &&
            // ~- means subtract 1
            str[i] === str[~-i] &&
            str[i] === str[i + 1]) {
            continue;
        }
        // catch the curly tails of at-rules
        // -------------------------------------------------------------------------
        if (!doNothing && atRuleWaitingForClosingCurlie()) {
            // if (token.type === null && str[i] === "}") {
            // if (str[i] === "}") {
            if (str[i] === "}") {
                if (!token.type ||
                    token.type === "text" ||
                    (token.type === "rule" && token.openingCurlyAt === null)) {
                    // rule token must end earlier
                    if (token.type === "rule") {
                        token.end = leftVal + 1;
                        token.value = str.slice(token.start, token.end);
                        pingTagCb(token);
                        // if it's a text token inside "at" rule, nest it, push into that
                        // "at" rule pending in layers - otherwise, ping as standalone
                        if (lastLayerIs("at")) {
                            layers[~-layers.length].token.rules.push(token);
                        }
                        tokenReset();
                        // if there was trailing whitespace, initiate it
                        if (leftVal !== null && leftVal < ~-i) {
                            initToken("text", leftVal + 1);
                        }
                    }
                    dumpCurrentToken(token, i);
                    const poppedToken = layers.pop();
                    token = poppedToken.token;
                    // then, continue on "at" rule's token...
                    token.closingCurlyAt = i;
                    token.end = i + 1;
                    token.value = str.slice(token.start, token.end);
                    pingTagCb(token);
                    // if it's a "rule" token and a parent "at" rule is pending in layers,
                    // also put this "rule" into that parent in layers
                    if (lastLayerIs("at")) {
                        layers[~-layers.length].token.rules.push(token);
                    }
                    tokenReset();
                    doNothing = i + 1;
                }
            }
            else if (token.type === "text" && str[i] && str[i].trim()) {
                // terminate the text token, all the non-whitespace characters comprise
                // rules because we're inside the at-token, it's CSS!
                token.end = i;
                token.value = str.slice(token.start, token.end);
                // if it's a text token inside "at" rule, nest it, push into that
                // "at" rule pending in layers - otherwise, ping as standalone
                if (lastLayerIs("at")) {
                    layers[~-layers.length].token.rules.push(token);
                }
                else {
                    pingTagCb(token);
                }
                tokenReset();
            }
        }
        if (token.end && token.end === i) {
            if (token.tagName === "style" && !token.closing) {
                withinStyle = true;
            }
            // we need to retain the information after tag was dumped to tagCb() and wiped
            if (attribToBackup) {
                // 1. restore
                attrib = attribToBackup;
                // 2. push current token into attrib.attribValue
                attrib.attribValue.push(token);
                // 3. restore real token
                token = lodash_clonedeep(parentTokenToBackup);
                // 4. reset
                attribToBackup = undefined;
                parentTokenToBackup = undefined;
            }
            else {
                dumpCurrentToken(token, i);
                layers.length = 0;
            }
        }
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
        // record "layers" like entering double quotes
        // -------------------------------------------------------------------------
        if (!doNothing) {
            if (["tag", "at"].includes(token.type) &&
                token.kind !== "cdata") {
                if (str[i] &&
                    (SOMEQUOTE.includes(str[i]) || `()`.includes(str[i])) &&
                    !(
                    // below, we have insurance against single quotes, wrapped with quotes:
                    // "'" or '"' - templating languages might put single quote as a sttring
                    // character, not meaning wrapped-something.
                    (SOMEQUOTE.includes(str[leftVal]) &&
                        str[leftVal] === str[rightVal])) &&
                    // protection against double-wrapped values, like
                    // <div style="float:"left"">
                    //
                    //
                    // it's not a quote or a real attr ending
                    ifQuoteThenAttrClosingQuote(i)
                // because if it's not really a closing quote, it's a rogue-one and
                // it belongs to the current attribute's value so that later we
                // can catch it, validating values, imagine "float" value "left" comes
                // with quotes, as in ""left""
                ) {
                    if (
                    // maybe it's the closing counterpart?
                    lastLayerIs("simple") &&
                        layers[~-layers.length].value ===
                            flipEspTag(str[i])) {
                        layers.pop();
                    }
                    else {
                        // it's opening then
                        layers.push({
                            type: "simple",
                            value: str[i],
                            position: i,
                        });
                    }
                }
            }
            else if (token.type === "comment" &&
                ["only", "not"].includes(token.kind)) {
                if ([`[`, `]`].includes(str[i])) {
                    if (
                    // maybe it's the closing counterpart?
                    lastLayerIs("simple") &&
                        layers[~-layers.length].value ===
                            flipEspTag(str[i])) {
                        // maybe it's the closing counterpart?
                        layers.pop();
                    }
                    else {
                        // it's opening then
                        layers.push({
                            type: "simple",
                            value: str[i],
                            position: i,
                        });
                    }
                }
            }
            else if (token.type === "esp" &&
                `'"${BACKTICK}()`.includes(str[i]) &&
                !(
                // below, we have insurance against single quotes, wrapped with quotes:
                // "'" or '"' - templating languages might put single quote as a sttring
                // character, not meaning wrapped-something.
                ([`"`, `'`, "`"].includes(str[leftVal]) &&
                    str[leftVal] === str[rightVal]))) {
                if (
                // maybe it's the closing counterpart?
                lastLayerIs("simple") &&
                    layers[~-layers.length].value === flipEspTag(str[i])) {
                    // maybe it's the closing counterpart?
                    layers.pop();
                    doNothing = i + 1;
                }
                else if (!`]})>`.includes(str[i])) {
                    // it's opening then
                    layers.push({
                        type: "simple",
                        value: str[i],
                        position: i,
                    });
                }
            }
            // console.log(
            //   `1094 FIY, currently ${`\u001b[${33}m${`layers`}\u001b[${39}m`} = ${JSON.stringify(
            //     layers,
            //     null,
            //     4
            //   )}`
            // );
        }
        // catch the start of at rule's identifierStartsAt
        // -------------------------------------------------------------------------
        if (!doNothing &&
            token.type === "at" &&
            token.start != null &&
            i >= token.start &&
            !token.identifierStartsAt &&
            str[i] &&
            str[i].trim() &&
            str[i] !== "@") {
            // the media identifier's "entry" requirements are deliberately loose
            // because we want to catch errors there, imagine somebody mistakenly
            // adds a comma, @,media
            // or adds a space, @ media
            token.identifierStartsAt = i;
        }
        // catch the end of the "at" rule token
        // -------------------------------------------------------------------------
        if (!doNothing &&
            token.type === "at" &&
            token.queryStartsAt &&
            !token.queryEndsAt &&
            `{;`.includes(str[i])) {
            if (str[i] === "{") {
                if (str[~-i] && str[~-i].trim()) {
                    token.queryEndsAt = i;
                }
                else {
                    // trim the trailing whitespace:
                    // @media (max-width: 600px) {
                    //                          ^
                    //                        this
                    //
                    token.queryEndsAt = leftVal !== null ? leftVal + 1 : i;
                    // left() stops "to the left" of a character, if you used that index
                    // for slicing, that character would be included, in our case,
                    // @media (max-width: 600px) {
                    //                         ^
                    //            that would be index of this bracket
                }
            }
            else {
                // ; closing, for example, illegal:
                // @charset "UTF-8";
                //                 ^
                //          we're here
                //
                token.queryEndsAt = left(str, i + 1) || 0;
            }
            if (token.queryStartsAt && token.queryEndsAt) {
                token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
            }
            token.end = str[i] === ";" ? i + 1 : i;
            token.value = str.slice(token.start, token.end);
            if (str[i] === ";") {
                // if code is clean, that would be @charset for example, no curlies
                pingTagCb(token);
            }
            else {
                // then it's opening curlie
                token.openingCurlyAt = i;
                // push so far gathered token into layers
                layers.push({
                    type: "at",
                    token,
                });
            }
            tokenReset();
            doNothing = i + 1;
        }
        // catch the start of the query
        // -------------------------------------------------------------------------
        if (!doNothing &&
            token.type === "at" &&
            token.identifier &&
            str[i] &&
            str[i].trim() &&
            !token.queryStartsAt) {
            token.queryStartsAt = i;
        }
        // catch the end of at rule's identifierStartsAt
        // -------------------------------------------------------------------------
        if (!doNothing &&
            token &&
            token.type === "at" &&
            token.identifierStartsAt &&
            i >= token.start &&
            str[i] &&
            (!str[i].trim() || "()".includes(str[i])) &&
            !token.identifierEndsAt) {
            token.identifierEndsAt = i;
            token.identifier = str.slice(token.identifierStartsAt, i);
        }
        // catch the end of a CSS chunk
        // -------------------------------------------------------------------------
        // charsThatEndCSSChunks:  } , {
        if (token.type === "rule") {
            if (selectorChunkStartedAt &&
                (charsThatEndCSSChunks.includes(str[i]) ||
                    (str[i] &&
                        rightVal &&
                        !str[i].trim() &&
                        charsThatEndCSSChunks.includes(str[rightVal])))) {
                token.selectors.push({
                    value: str.slice(selectorChunkStartedAt, i),
                    selectorStarts: selectorChunkStartedAt,
                    selectorEnds: i,
                });
                selectorChunkStartedAt = undefined;
                token.selectorsEnd = i;
            }
            else if (str[i] === "{" &&
                str[i - 1] !== "{" && // avoid Nunjucks variable as CSS rule's value
                str[i + 1] !== "{" && // avoid Nunjucks variable as CSS rule's value
                token.openingCurlyAt &&
                !token.closingCurlyAt) {
                // we encounted an opening curly even though closing hasn't
                // been met yet:
                // <style>.a{float:left;x">.b{color: red}
                //                           ^
                //                    we're here
                // let selectorChunkStartedAt2;
                for (let y = i; y--;) {
                    if (!str[y].trim() || `{}"';`.includes(str[y])) {
                        // patch the property
                        if (property && property.start && !property.end) {
                            property.end = y + 1;
                            property.property = str.slice(property.start, property.end);
                            pushProperty(property);
                            propertyReset();
                            token.end = y + 1;
                            token.value = str.slice(token.start, token.end);
                            pingTagCb(token);
                            initToken(str[y + 1] === "@" ? "at" : "rule", y + 1);
                            token.left = left(str, y + 1);
                            token.selectorsStart = y + 1;
                            i = y + 1;
                        }
                        break;
                    }
                }
            }
        }
        // catch the beginning of a token
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
        const lastEspLayerObjIdx = getLastEspLayerObjIdx(layers);
        if (!doNothing && str[i]) {
            // console.log(
            //   `1857 ███████████████████████████████████████ IS TAG STARTING? ${startsTag(
            //     str,
            //     i,
            //     token,
            //     layers,
            //     withinStyle
            //   )}`
            // );
            // console.log(
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
            if (startsTag(str, i, token, layers, withinStyle, leftVal, rightVal)) {
                //
                //
                //
                // TAG STARTING
                //
                //
                //
                if (token.type && token.start !== null) {
                    if (token.type === "rule") {
                        if (property && property.start) {
                            // patch important if needed
                            if (property.importantStarts && !property.importantEnds) {
                                property.importantEnds = i;
                                property.important = str.slice(property.importantStarts, i);
                            }
                            // patch property
                            if (property.propertyStarts && !property.propertyEnds) {
                                property.propertyEnds = i;
                                if (!property.property) {
                                    property.property = str.slice(property.propertyStarts, i);
                                }
                            }
                            if (!property.end) {
                                property.end = i;
                            }
                            // patch value
                            if (property.valueStarts && !property.valueEnds) {
                                property.valueEnds = i;
                                if (!property.value) {
                                    property.value = str.slice(property.valueStarts, i);
                                }
                            }
                            pushProperty(property);
                            propertyReset();
                        }
                    }
                    dumpCurrentToken(token, i);
                    tokenReset();
                }
                // add other HTML-specific keys onto the object
                // second arg is "start" key:
                initToken("tag", i);
                if (withinStyle) {
                    withinStyle = false;
                }
                // extract the tag name:
                const badCharacters = `?![-/`;
                let extractedTagName = "";
                let letterMet = false;
                if (rightVal) {
                    for (let y = rightVal; y < len; y++) {
                        if (!letterMet &&
                            str[y] &&
                            str[y].trim() &&
                            str[y].toUpperCase() !== str[y].toLowerCase()) {
                            letterMet = true;
                        }
                        if (
                        // at least one letter has been met, to cater
                        // <? xml ...
                        letterMet &&
                            str[y] &&
                            // it's whitespace
                            (!str[y].trim() ||
                                // or symbol which definitely does not belong to a tag,
                                // considering we want to catch some rogue characters to
                                // validate and flag them up later
                                (!/\w/.test(str[y]) && !badCharacters.includes(str[y])) ||
                                str[y] === "[")
                        // if letter has been met, "[" is also terminating character
                        // think <![CDATA[x<y]]>
                        //               ^
                        //             this
                        ) {
                            break;
                        }
                        else if (!badCharacters.includes(str[y])) {
                            extractedTagName += str[y].trim().toLowerCase();
                        }
                    }
                }
                // set the kind:
                if (extractedTagName === "doctype") {
                    token.kind = "doctype";
                }
                else if (extractedTagName === "cdata") {
                    token.kind = "cdata";
                }
                else if (extractedTagName === "xml") {
                    token.kind = "xml";
                }
                else if (inlineTags.has(extractedTagName)) {
                    token.kind = "inline";
                    if (extractedTagName) {
                        // for perf
                        doNothing = i;
                    }
                }
            }
            else if (!withinScript && startsHtmlComment(str, i, token, layers)) {
                //
                //
                //
                // HTML COMMENT STARTING
                //
                //
                //
                if (token.start != null) {
                    dumpCurrentToken(token, i);
                }
                // add other HTML-specific keys onto the object
                // second arg is "start" key:
                initToken("comment", i);
                // the "language" default is "html" anyway so no need to set it
                // set "closing"
                if (str[i] === "-") {
                    token.closing = true;
                }
                else if (matchRightIncl(str, i, ["<![endif]-->"], {
                    i: true,
                    trimBeforeMatching: true,
                    maxMismatches: 2,
                })) {
                    token.closing = true;
                    token.kind = "only";
                }
                if (withinStyle) {
                    withinStyle = false;
                }
            }
            else if (!withinScript &&
                startsCssComment(str, i, token, layers, withinStyle)) {
                //
                //
                //
                // CSS COMMENT STARTING
                //
                //
                //
                if (token.start != null) {
                    dumpCurrentToken(token, i);
                }
                // add other token-specific keys onto the object
                // second arg is "start" key:
                initToken("comment", i);
                token.language = "css";
                token.kind =
                    str[i] === "/" && str[i + 1] === "/" ? "line" : "block";
                token.value = str.slice(i, i + 2);
                token.end = i + 2;
                token.closing = str[i] === "*" && str[i + 1] === "/";
                withinStyleComment = true;
                if (token.closing) {
                    withinStyleComment = false;
                }
                doNothing = i + 2;
            }
            else if (!withinScript &&
                // if we encounter two consecutive characters of guessed lump
                ((typeof lastEspLayerObjIdx === "number" &&
                    layers[lastEspLayerObjIdx] &&
                    layers[lastEspLayerObjIdx].type === "esp" &&
                    layers[lastEspLayerObjIdx].openingLump &&
                    layers[lastEspLayerObjIdx].guessedClosingLump &&
                    layers[lastEspLayerObjIdx].guessedClosingLump.length >
                        1 &&
                    // current character is among guessed lump's characters
                    layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[i]) &&
                    // ...and the following character too...
                    layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[i + 1]) &&
                    // since we "jump" over layers, that is, passed quotes
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
                    !(
                    // we excluse the same case,
                    // ${"${name}${name}${name}${name}"}
                    //          ^
                    //        false ending
                    // we ensure that quote doesn't follow the esp layer
                    // "lastEspLayerObjIdx" and there's counterpart of it
                    // on the right, and there's ESP char on the right of it
                    // next layer after esp's follows
                    (layers[lastEspLayerObjIdx + 1] &&
                        // and it's quote
                        `'"`.includes(layers[lastEspLayerObjIdx + 1].value) &&
                        // matching quote on the right has ESP character following
                        // it exists (>-1)
                        str.indexOf(layers[lastEspLayerObjIdx + 1].value, i) >
                            0 &&
                        layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[right(str, str.indexOf(layers[lastEspLayerObjIdx + 1].value, i))])))) ||
                    // hard check
                    (startsEsp(str, i, token, layers, withinStyle) &&
                        // ensure we're not inside quotes, so it's not an expression within a value
                        // ${"${name}${name}${name}${name}"}
                        //    ^
                        //   we could be here - notice quotes wrapping all around
                        //
                        (!lastLayerIs("simple") ||
                            ![`'`, `"`].includes(layers[~-layers.length].value) ||
                            // or we're within an attribute (so quotes are HTML tag's not esp tag's)
                            (attrib && attrib.attribStarts && !attrib.attribEnds))))) {
                //
                //
                //
                // ESP TAG STARTING
                //
                //
                //
                // ESP tags can't be entered from after CSS at-rule tokens or
                // normal CSS rule tokens
                //
                //
                //
                // FIRST, extract the tag opening and guess the closing judging from it
                const wholeEspTagLumpOnTheRight = getWholeEspTagLumpOnTheRight(str, i, layers);
                // lump can't end with attribute's ending, that is, something like:
                // <frameset cols="**">
                // that's a false positive
                if (!espLumpBlacklist.includes(wholeEspTagLumpOnTheRight)) {
                    // check the "layers" records - maybe it's a closing part of a set?
                    let lengthOfClosingEspChunk;
                    let disposableVar;
                    if (layers.length &&
                        //
                        // if layer match result is truthy, we take it, otherwise, move on
                        // but don't calculate twice!
                        // eslint-disable-next-line no-cond-assign
                        (lengthOfClosingEspChunk = matchLayerLast(wholeEspTagLumpOnTheRight, layers))) {
                        // if this was closing of a standalone esp tag, terminate it and ping
                        // it to the cb()
                        if (token.type === "esp") {
                            if (!token.end) {
                                token.end = i + lengthOfClosingEspChunk;
                                token.value = str.slice(token.start, token.end);
                                token.tail = str.slice(i, i + lengthOfClosingEspChunk);
                                token.tailStartsAt = i;
                                token.tailEndsAt = token.end;
                                // correction for XML-like templating tags, closing can
                                // have a slash, <c:set zzz/>
                                //                         ^
                                if (str[i] === ">" && str[leftVal] === "/") {
                                    token.tailStartsAt = leftVal;
                                    token.tail = str.slice(token.tailStartsAt, i + 1);
                                }
                            }
                            // activate doNothing until the end of tails because otherwise,
                            // mid-tail characters will initiate new tail start clauses
                            // and we'll have overlap/false result
                            doNothing = token.tailEndsAt;
                            // it depends will we ping it as a standalone token or will we
                            // nest inside the parent tag among attributes
                            if (parentTokenToBackup) {
                                // push token to parent, to be among its attributes
                                // 1. ensure key "attribs" exist (thinking about comment tokens etc)
                                if (!Array.isArray(parentTokenToBackup.attribs)) {
                                    parentTokenToBackup.attribs = [];
                                }
                                // 2. push somewhere
                                if (attribToBackup) {
                                    // 1. restore
                                    attrib = attribToBackup;
                                    // 2. push to attribValue
                                    attrib.attribValue.push({ ...token });
                                }
                                else {
                                    // push to attribs
                                    parentTokenToBackup.attribs.push({ ...token });
                                }
                                // 3. parentTokenToBackup becomes token
                                token = lodash_clonedeep(parentTokenToBackup);
                                // 4. resets
                                parentTokenToBackup = undefined;
                                attribToBackup = undefined;
                                // 5. pop layers, remove the opening ESP tag record
                                layers.pop();
                                // 6. finally, continue, bypassing the rest of the code in this loop
                                continue;
                            }
                            else {
                                dumpCurrentToken(token, i);
                            }
                            tokenReset();
                        }
                        // pop the recorded layers, at this moment record of ESP chunk
                        // will be lost:
                        layers.pop();
                    }
                    else if (layers.length &&
                        // eslint-disable-next-line no-cond-assign
                        (lengthOfClosingEspChunk = matchLayerLast(wholeEspTagLumpOnTheRight, layers, true))) {
                        // if this was closing of a standalone esp tag, terminate it and ping
                        // it to the cb()
                        if (token.type === "esp") {
                            if (!token.end) {
                                token.end = i + (lengthOfClosingEspChunk || 0);
                                token.value = str.slice(token.start, token.end);
                            }
                            if (!token.tailStartsAt) {
                                token.tailStartsAt = i;
                            }
                            if (!token.tailEndsAt && lengthOfClosingEspChunk) {
                                token.tailEndsAt = token.tailStartsAt + lengthOfClosingEspChunk;
                                token.tail = str.slice(i, i + lengthOfClosingEspChunk);
                            }
                            dumpCurrentToken(token, i);
                            tokenReset();
                        }
                        // pop the recorded layers, at this moment record of ESP chunk
                        // will be lost:
                        layers.length = 0;
                    }
                    else if (
                    // insurance against stray tails inside attributes:
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
                    attrib &&
                        attrib.attribValue &&
                        attrib.attribValue.length &&
                        attrib.attribValue[~-attrib.attribValue.length].start &&
                        Array.from(str.slice(attrib.attribValue[~-attrib.attribValue.length].start, i)).some((char, idx) => wholeEspTagLumpOnTheRight.includes(flipEspTag(char)) &&
                            // ensure it's not a false alarm, "notVeryEspChars"
                            // bunch, for example, % or $ can be legit characters
                            //
                            // either it's from "veryEspChars" list so
                            // it can be anywhere, not necessarily at the
                            // beginning, for example, broken mailchimp:
                            // <a b="some text | x *|">
                            //                 ^
                            //               this is
                            //
                            (veryEspChars.includes(char) ||
                                // or that character must be the first character
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
                                !idx) &&
                            (disposableVar = { char, idx })) &&
                        // we're inside attribute
                        token.type === "tag" &&
                        attrib &&
                        attrib.attribValueStartsAt &&
                        !attrib.attribValueEndsAt &&
                        // last attribute's value element is text-type
                        // imagine, the { x from <a b="{ x %}"> would be
                        // such unrecognised text:
                        attrib.attribValue[~-attrib.attribValue.length] &&
                        attrib.attribValue[~-attrib.attribValue.length].type ===
                            "text") {
                        // token does contain ESP tags, so it's not pure HTML
                        token.pureHTML = false;
                        const lastAttrValueObj = attrib.attribValue[~-attrib.attribValue.length];
                        // getNewToken() just creates a new token according
                        // the latest (DRY) reference, it doesn't reset
                        // the "token" unlike initToken()
                        const newTokenToPutInstead = getNewToken("esp", lastAttrValueObj.start);
                        // for remaining values, we need to consider, is there
                        // text in front:
                        //
                        // <a b="{ x %}">
                        // vs.
                        // <a b="something { x %}">
                        if (!disposableVar || !disposableVar.idx) {
                            newTokenToPutInstead.head = disposableVar.char;
                            newTokenToPutInstead.headStartsAt = lastAttrValueObj.start;
                            newTokenToPutInstead.headEndsAt =
                                newTokenToPutInstead.headStartsAt + 1;
                            newTokenToPutInstead.tailStartsAt = i;
                            newTokenToPutInstead.tailEndsAt =
                                i + wholeEspTagLumpOnTheRight.length;
                            newTokenToPutInstead.tail = wholeEspTagLumpOnTheRight;
                            attrib.attribValue[~-attrib.attribValue.length] = newTokenToPutInstead;
                        }
                    }
                    else {
                        // If we've got an unclosed heads and here new heads are starting,
                        // pop the last heads in layers - they will never be matched anyway.
                        // Let parser/linter deal with it
                        if (lastLayerIs("esp")) {
                            layers.pop();
                        }
                        // if we're within a tag attribute, push the last esp token there
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
                            position: i,
                        });
                        // also, if it's a standalone ESP token, terminate the previous token
                        // and start recording a new-one
                        if (token.start !== null) {
                            // it means token has already being recorded, we need to tackle it -
                            // the new, ESP token is incoming!
                            // we nest ESP tokens inside "tag" type attributes
                            if (token.type === "tag") {
                                // instead of dumping the tag token and starting a new-one,
                                // save the parent token, then nest all ESP tags among attributes
                                if (token.tagNameStartsAt &&
                                    (!token.tagName || !token.tagNameEndsAt)) {
                                    token.tagNameEndsAt = i;
                                    token.tagName = str.slice(token.tagNameStartsAt, i);
                                    token.recognised = isTagNameRecognised(token.tagName);
                                }
                                parentTokenToBackup = lodash_clonedeep(token);
                                if (attrib.attribStarts && !attrib.attribEnds) {
                                    attribToBackup = lodash_clonedeep(attrib);
                                }
                            }
                            else if (!attribToBackup) {
                                dumpCurrentToken(token, i);
                            }
                            else if (attribToBackup &&
                                Array.isArray(attribToBackup.attribValue) &&
                                attribToBackup.attribValue.length &&
                                attribToBackup.attribValue[~-attribToBackup.attribValue.length].type === "esp" &&
                                !attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                                    .end) {
                                attribToBackup.attribValue[~-attribToBackup.attribValue.length].end = i;
                                attribToBackup.attribValue[~-attribToBackup.attribValue.length].value = str.slice(attribToBackup.attribValue[~-attribToBackup.attribValue.length].start, i);
                            }
                        }
                        // now, either way, if parent tag was stashed in "parentTokenToBackup"
                        // or if this is a new ESP token and there's nothing to nest,
                        // let's initiate it:
                        initToken("esp", i);
                        token.head = wholeEspTagLumpOnTheRight;
                        token.headStartsAt = i;
                        token.headEndsAt =
                            i + wholeEspTagLumpOnTheRight.length;
                        // toggle parentTokenToBackup.pureHTML
                        if (parentTokenToBackup && parentTokenToBackup.pureHTML) {
                            parentTokenToBackup.pureHTML = false;
                        }
                        // if text token has been initiated, imagine:
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
                        if (attribToBackup &&
                            Array.isArray(attribToBackup.attribValue) &&
                            attribToBackup.attribValue.length) {
                            if (attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                                .start === token.start) {
                                // erase it from stash
                                attribToBackup.attribValue.pop();
                            }
                            else if (
                            // if the "text" type object is the last in "attribValue" and
                            // it's not closed, let's close it and calculate its value:
                            attribToBackup.attribValue[~-attribToBackup.attribValue.length].type === "text" &&
                                !attribToBackup.attribValue[~-attribToBackup.attribValue.length]
                                    .end) {
                                attribToBackup.attribValue[~-attribToBackup.attribValue.length].end = i;
                                attribToBackup.attribValue[~-attribToBackup.attribValue.length].value = str.slice(attribToBackup.attribValue[~-attribToBackup.attribValue.length].start, i);
                            }
                        }
                    }
                    // do nothing for the second and following characters from the lump
                    doNothing =
                        i + (lengthOfClosingEspChunk || wholeEspTagLumpOnTheRight.length);
                }
            }
            else if (!withinScript &&
                withinStyle &&
                !withinStyleComment &&
                str[i] &&
                str[i].trim() &&
                // insurance against rogue extra closing curlies:
                // .a{x}}
                // don't start new rule at closing curlie!
                !`{}`.includes(str[i]) &&
                // if at rule starts right after <style>, if we're on "@"
                // for example:
                // <style>@media a {.b{c}}</style>
                // first the <style> tag token will be pushed and then tag object
                // reset and then, still at "@"
                (!token.type ||
                    // or, there was whitespace and we started recording a text token
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
                    dumpCurrentToken(token, i);
                }
                initToken(str[i] === "@" ? "at" : "rule", i);
                token.left = lastNonWhitespaceCharAt;
                token.nested = layers.some((o) => o.type === "at");
            }
            else if (!token.type) {
                initToken("text", i);
                if (withinScript && str.indexOf("</script>", i)) {
                    doNothing = str.indexOf("</script>", i);
                }
                else {
                    doNothing = i;
                }
            }
        }
        let R1;
        let R2;
        if (!doNothing && (property.start || str[i] === "!")) {
            const idxRightIncl = right(str, i - 1);
            R1 =
                `;<>`.includes(str[idxRightIncl]) ||
                    // avoid Nunjucks ESP tags, {{ zzz }}
                    (str[idxRightIncl] === `{` && str[i - 1] !== `{`) ||
                    (str[idxRightIncl] === `}` && str[i - 1] !== `}`) ||
                    // or it's a quote
                    (`'"`.includes(str[idxRightIncl]) &&
                        // but then it has to be a matching counterpart
                        // either there are no layers
                        (!layers ||
                            // or there are but they're empty
                            !layers.length ||
                            // or array is not empty but its last element is
                            !layers[~-layers.length] ||
                            // or it's neither empty not falsy but doesn't have "value" key
                            !layers[~-layers.length].value ||
                            // or it is a plain object with a value key and that layer
                            // means opening quotes has been opened and this quote at this
                            // index (or if it's whitespace, first index to the right) is a
                            // closing counterpart for that quote in "layers"
                            layers[~-layers.length].value === str[idxRightIncl]));
            R2 = matchRightIncl(str, i, ["!important"], {
                i: true,
                trimBeforeMatching: true,
                maxMismatches: 2,
            });
        }
        // catch the end of a css property (with or without !important)
        // -------------------------------------------------------------------------
        /* istanbul ignore else */
        if (!doNothing &&
            property &&
            ((property.semi && property.semi < i && property.semi < i) ||
                (((property.valueStarts &&
                    !property.valueEnds &&
                    str[rightVal] !== "!" &&
                    // either non-whitespace character doesn't exist on the right
                    (!rightVal ||
                        // or at that character !important does not start
                        R1)) ||
                    (property.importantStarts && !property.importantEnds)) &&
                    (!property.valueEnds || str[rightVal] !== ";") &&
                    // either end of string was reached
                    (!str[i] ||
                        // or it's a whitespace
                        !str[i].trim() ||
                        // or it's a semicolon after a value
                        (!property.valueEnds && str[i] === ";") ||
                        // or we reached the end of the attribute
                        attrEndsAt(i))))) {
            /* istanbul ignore else */
            if (property.importantStarts && !property.importantEnds) {
                property.importantEnds = left(str, i) + 1;
                property.important = str.slice(property.importantStarts, property.importantEnds);
            }
            /* istanbul ignore else */
            if (property.valueStarts && !property.valueEnds) {
                property.valueEnds = i;
                property.value = str.slice(property.valueStarts, i);
            }
            /* istanbul ignore else */
            if (str[i] === ";") {
                property.semi = i;
                property.end = i + 1;
            }
            else if (str[rightVal] === ";") {
                property.semi = rightVal;
                property.end = property.semi + 1;
                doNothing = property.end;
            }
            if (!property.end) {
                property.end = i;
            }
            pushProperty(property);
            propertyReset();
            if (!doNothing && (!str[i] || str[i].trim()) && str[i] === ";") {
                doNothing = i;
            }
        }
        // catch the end of a css property's value
        // -------------------------------------------------------------------------
        /* istanbul ignore else */
        if (!doNothing &&
            // token.type === "rule" &&
            property &&
            property.valueStarts &&
            !property.valueEnds) {
            if (
            // either end was reached
            !str[i] ||
                // or terminating characters (semi etc) follow
                R1 ||
                // or !important starts
                R2 ||
                str[right(str, i - 1)] === "!" ||
                // normal head css styles:
                (`;}`.includes(str[i]) &&
                    (!attrib || !attrib.attribName || attrib.attribName !== "style")) ||
                // inline css styles within html
                (`;'"`.includes(str[i]) &&
                    attrib &&
                    attrib.attribName === "style" &&
                    // it's real quote, not rogue double-wrapping around the value
                    ifQuoteThenAttrClosingQuote(i)) ||
                // it's a whitespace chunk with linebreaks
                (rightVal &&
                    !str[i].trim() &&
                    (str.slice(i, rightVal).includes("\n") ||
                        str.slice(i, rightVal).includes("\r")))) {
                if (lastNonWhitespaceCharAt &&
                    // it's not a quote
                    (!`'"`.includes(str[i]) ||
                        // there's nothing on the right
                        !rightVal ||
                        // or it is a quote, but there's no quote on the right
                        !`'";`.includes(str[rightVal]))) {
                    property.valueEnds = lastNonWhitespaceCharAt + 1;
                    property.value = str.slice(property.valueStarts, lastNonWhitespaceCharAt + 1);
                }
                if (str[i] === ";") {
                    property.semi = i;
                }
                else if (
                // it's whitespace
                str[i] &&
                    !str[i].trim() &&
                    // semicolon follows
                    str[rightVal] === ";") {
                    property.semi = rightVal;
                }
                if (
                // if semicolon has been spotted...
                property.semi) {
                    // set the ending too
                    property.end = property.semi + 1; // happy path, clean code has "end" at semi
                }
                if (
                // if there's no semicolon in the view
                !property.semi &&
                    // and semi is not coming next
                    !R1 &&
                    // and !important is not following
                    !R2 &&
                    str[right(str, i - 1)] !== "!" &&
                    // and property hasn't ended
                    !property.end) {
                    // we need to end it because this is it
                    property.end = i;
                }
                if (property.end) {
                    // push and init and patch up to resume
                    if (property.end > i) {
                        // if ending is in the future, skip everything up to it
                        doNothing = property.end;
                    }
                    pushProperty(property);
                    propertyReset();
                }
            }
            else if (str[i] === ":" &&
                property &&
                property.colon &&
                property.colon < i &&
                lastNonWhitespaceCharAt &&
                property.colon + 1 < lastNonWhitespaceCharAt) {
                // .a{b:c d:e;}
                //         ^
                //  we're here
                //
                // semicolon is missing...
                // traverse backwards from "lastNonWhitespaceCharAt", just in case
                // there's space before colon, .a{b:c d :e;}
                //                                      ^
                //                               we're here
                //
                // we're looking to pinpoint where one rule ends and another starts.
                let split = [];
                if (right(str, property.colon)) {
                    split = str
                        .slice(right(str, property.colon), lastNonWhitespaceCharAt + 1)
                        .split(/\s+/);
                }
                if (split.length === 2) {
                    // it's missing semicol, like: .a{b:c d:e;}
                    //                                 ^   ^
                    //                                 |gap| we split
                    //
                    property.valueEnds = property.valueStarts + split[0].length;
                    property.value = str.slice(property.valueStarts, property.valueEnds);
                    property.end = property.valueEnds;
                    // push and init and patch up to resume
                    pushProperty(property);
                    // backup the values before wiping the property:
                    const whitespaceStarts = property.end;
                    const newPropertyStarts = lastNonWhitespaceCharAt + 1 - split[1].length;
                    propertyReset();
                    pushProperty({
                        type: "text",
                        start: whitespaceStarts,
                        end: newPropertyStarts,
                        value: str.slice(whitespaceStarts, newPropertyStarts),
                    });
                    property.start = newPropertyStarts;
                    property.propertyStarts = newPropertyStarts;
                }
            }
            else if (str[i] === "/" && str[rightVal] === "*") {
                // comment starts
                // <a style="color: red/* zzz */">
                //                     ^
                //                we're here
                /* istanbul ignore else */
                if (property.valueStarts && !property.valueEnds) {
                    property.valueEnds = i;
                    property.value = str.slice(property.valueStarts, i);
                }
                /* istanbul ignore else */
                if (!property.end) {
                    property.end = i;
                }
                // push and init and patch up to resume
                pushProperty(property);
                propertyReset();
            }
        }
        // catch the css property's semicolon
        // -------------------------------------------------------------------------
        if (!doNothing &&
            property &&
            property.start &&
            !property.end &&
            str[i] === ";") {
            property.semi = i;
            property.end = i + 1;
            if (!property.propertyEnds) {
                property.propertyEnds = i;
            }
            if (property.propertyStarts &&
                property.propertyEnds &&
                !property.property) {
                property.property = str.slice(property.propertyStarts, property.propertyEnds);
            }
            pushProperty(property);
            propertyReset();
            doNothing = i;
        }
        // catch the end of css property's !important
        // -------------------------------------------------------------------------
        /* istanbul ignore else */
        if (property &&
            property.importantStarts &&
            !property.importantEnds &&
            str[i] &&
            !str[i].trim()) {
            property.importantEnds = i;
            property.important = str.slice(property.importantStarts, i);
        }
        // catch the start of css property's !important
        // -------------------------------------------------------------------------
        /* istanbul ignore else */
        if (!doNothing &&
            property &&
            property.valueEnds &&
            !property.importantStarts &&
            // it's an exclamation mark
            (str[i] === "!" ||
                // considering missing excl. mark cases, more strict req.:
                (isLatinLetter(str[i]) && str.slice(i).match(importantStartsRegexp)))) {
            property.importantStarts = i;
            // correction for cases like:
            // <style>.a{color:red 1important}
            //                     ^
            //            we're here, that "1" needs to be included as part of important
            if (
            // it's non-whitespace char in front
            (str[i - 1] &&
                str[i - 1].trim() &&
                // and before that it's whitespace
                str[i - 2] &&
                !str[i - 2].trim()) ||
                // there's a "1" in front
                (str[i - 1] === "1" &&
                    // and it's not numeric character before it
                    // padding: 101important
                    //            ^
                    //          unlikely it's a mistyped !
                    str[i - 2] &&
                    !/\d/.test(str[i - 2]))) {
                // merge that character into !important
                property.valueEnds = left(str, i - 1) + 1;
                property.value = str.slice(property.valueStarts, property.valueEnds);
                property.importantStarts--;
                property.important = str[i - 1] + property.important;
            }
        }
        // catch the start of a css property's value
        // -------------------------------------------------------------------------
        /* istanbul ignore else */
        if (!doNothing &&
            property &&
            property.colon &&
            !property.valueStarts &&
            str[i] &&
            str[i].trim()) {
            /* istanbul ignore else */
            if (
            // stopper character met:
            `;}'"`.includes(str[i]) &&
                // either it's real closing quote or not a quote
                ifQuoteThenAttrClosingQuote(i)) {
                /* istanbul ignore else */
                if (str[i] === ";") {
                    property.semi = i;
                }
                let temp;
                // patch missing .end
                /* istanbul ignore else */
                if (!property.end) {
                    property.end = property.semi
                        ? property.semi + 1
                        : left(str, i) + 1;
                    temp = property.end;
                }
                // push and init and patch up to resume
                pushProperty(property);
                propertyReset();
                // if there was a whitespace gap, submit it as text token
                /* istanbul ignore else */
                if (temp && temp < i) {
                    pushProperty({
                        type: "text",
                        start: temp,
                        end: i,
                        value: str.slice(temp, i),
                    });
                }
            }
            else if (str[i] === "!") {
                property.importantStarts = i;
            }
            else {
                property.valueStarts = i;
            }
        }
        // catch double opening curlies inside a css property
        if (!doNothing &&
            str[i] === "{" &&
            str[i + 1] === "{" &&
            property &&
            property.valueStarts &&
            !property.valueEnds &&
            str.indexOf("}}", i) > 0) {
            doNothing = str.indexOf("}}") + 2;
        }
        // catch the start of a css chunk
        // -------------------------------------------------------------------------
        if (!doNothing &&
            token.type === "rule" &&
            str[i] &&
            str[i].trim() &&
            !"{}".includes(str[i]) &&
            !selectorChunkStartedAt &&
            !token.openingCurlyAt) {
            if (!",".includes(str[i])) {
                selectorChunkStartedAt = i;
                if (token.selectorsStart === null) {
                    token.selectorsStart = i;
                }
            }
            else {
                // this contraption is needed to catch commas and assign
                // correctly broken chunk range, [selectorsStart, selectorsEnd]
                token.selectorsEnd = i + 1;
            }
        }
        // catch the end of a css property's name
        // -------------------------------------------------------------------------
        if (!doNothing &&
            // token.type === "rule" &&
            property &&
            property.propertyStarts &&
            property.propertyStarts < i &&
            !property.propertyEnds &&
            // end was reached
            (!str[i] ||
                // or it's whitespace
                !str[i].trim() ||
                // or
                // it's not suitable
                (!attrNameRegexp.test(str[i]) &&
                    // and
                    // it's a colon (clean code)
                    // <div style="float:left;">z</div>
                    //                  ^
                    //          we're here
                    //
                    (str[i] === ":" ||
                        //
                        // or
                        //
                        // <div style="float.:left;">z</div>
                        //                  ^
                        //                include this dot within property name
                        //                so that we can catch it later validating prop names
                        //
                        !rightVal ||
                        !`:/}`.includes(str[rightVal]) ||
                        // mind the rogue closings .a{x}}
                        (str[i] === "}" && str[rightVal] === "}"))) ||
                // <style>.a{b!}
                //            ^
                str[i] === "!") &&
            // also, regarding the slash,
            // <div style="//color: red;">
            //              ^
            //            don't close here, continue, gather "//color"
            //
            (str[i] !== "/" || str[i - 1] !== "/")) {
            property.propertyEnds = i;
            property.property = str.slice(property.propertyStarts, i);
            if (property.valueStarts) {
                // it's needed to safeguard against case like:
                // <style>.a{b:c d:e;}</style>
                //                ^
                //            imagine we're here - valueStarts is not set!
                property.end = i;
            }
            // missing colon and onwards:
            // <style>.b{c}</style>
            // <style>.b{c;d}</style>
            if (`};`.includes(str[i]) ||
                // it's whitespace and it's not leading up to a colon
                (str[i] && !str[i].trim() && str[rightVal] !== ":")) {
                if (str[i] === ";") {
                    property.semi = i;
                }
                // precaution against broken code:
                // .a{x}}
                //
                if (!property.end) {
                    property.end = property.semi ? property.semi + 1 : i;
                }
                // push and init and patch up to resume
                pushProperty(property);
                propertyReset();
            }
            // cases with replaced colon:
            // <div style="float.left;">
            if (
            // it's a non-whitespace character
            str[i] &&
                str[i].trim() &&
                // and property seems plausible - its first char at least
                attrNameRegexp.test(str[property.propertyStarts]) &&
                // but this current char is not:
                !attrNameRegexp.test(str[i]) &&
                // and it's not terminating character
                !`:'"`.includes(str[i])) {
                // find out locations of next semi and next colon
                const nextSemi = str.indexOf(";", i);
                const nextColon = str.indexOf(":", i);
                // whatever the situation, colon must not be before semi on the right
                // either one or both missing is fine, we just want to avoid
                // <div style="floa.t:left;
                //                 ^
                //            this is not a dodgy colon
                //
                // but,
                //
                // <div style="float.left;
                //                  ^
                //                this is
                if (
                // either semi but no colon
                ((nextColon === -1 && nextSemi !== -1) ||
                    !(nextColon !== -1 && nextSemi !== -1 && nextColon < nextSemi)) &&
                    !`{}`.includes(str[i]) &&
                    rightVal &&
                    // <style>.a{b!}
                    //            ^
                    (!`!`.includes(str[i]) || isLatinLetter(str[rightVal]))) {
                    // <div style="float.left;">
                    //                  ^
                    //            we're here
                    property.colon = i;
                    property.valueStarts = rightVal;
                }
                else if (nextColon !== -1 &&
                    nextSemi !== -1 &&
                    nextColon < nextSemi) {
                    // case like
                    // <div style="floa/t:left;">
                    //                 ^
                    //          we're here
                    property.propertyEnds = null;
                }
                else if (str[i] === "!") {
                    property.importantStarts = i;
                }
            }
        }
        // catch the colon of a css property
        // -------------------------------------------------------------------------
        if (!doNothing &&
            // we don't check for token.type === "rule" because inline css will use
            // these clauses too and token.type === "tag" there, but
            // attrib.attribName === "style"
            // on other hand, we don't need strict validation here either, to enter
            // these clauses it's enough that "property" was initiated.
            property &&
            property.propertyEnds &&
            !property.valueStarts &&
            str[i] === ":") {
            property.colon = i;
            // if string abruptly ends, record it here
            if (!rightVal) {
                property.end = i + 1;
                if (str[i + 1]) {
                    // push and init and patch up to resume
                    pushProperty(property);
                    propertyReset();
                    // that's some trailing whitespace, create a new text token for it
                    if (token.properties) {
                        token.properties.push({
                            type: "text",
                            start: i + 1,
                            end: null,
                            value: null,
                        });
                        doNothing = i + 1;
                    }
                }
            }
            // insurance against rogue characters
            // <style>.a{float:left;x">color: red}
            //                      |       ^
            //                      |     we're here
            //           propertyStarts
            if (property.propertyEnds &&
                lastNonWhitespaceCharAt &&
                property.propertyEnds !== lastNonWhitespaceCharAt + 1 &&
                // it ends upon a bad character
                !attrNameRegexp.test(str[property.propertyEnds])) {
                property.propertyEnds = lastNonWhitespaceCharAt + 1;
                property.property = str.slice(property.propertyStarts, property.propertyEnds);
            }
        }
        // catch the start of a css property's name
        // -------------------------------------------------------------------------
        if (!doNothing &&
            token.type === "rule" &&
            str[i] &&
            str[i].trim() &&
            // NOTA BENE - there's same clause for inline HTML style
            // let all the crap in, filter later:
            !"{}".includes(str[i]) &&
            // above is instead of a stricter clause:
            // attrNameRegexp.test(str[i]) &&
            token.selectorsEnd &&
            token.openingCurlyAt &&
            !property.propertyStarts &&
            !property.importantStarts) {
            // first, check maybe there's unfinished text token before it
            if (Array.isArray(token.properties) &&
                token.properties.length &&
                token.properties[~-token.properties.length].start &&
                !token.properties[~-token.properties.length].end) {
                token.properties[~-token.properties.length].end = i;
                token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, i);
            }
            // in normal cases we're set propertyStarts but sometimes it can be
            // importantStarts, imagine:
            // <style>.a{color:red; !important;}
            //                      ^
            //                we're here
            //
            // we want to put "!important" under key "important", not under
            // "property"
            if (str[i] === ";") {
                initProperty({
                    start: i,
                    end: i + 1,
                    semi: i,
                });
                pushProperty(property);
                propertyReset();
            }
            else if (str[i] === "!") {
                initProperty({
                    start: i,
                    importantStarts: i,
                });
            }
            else {
                initProperty(i);
            }
            doNothing = i;
        }
        // catch the start a property
        // -------------------------------------------------------------------------
        // Mostly happens in dirty code cases - the start is normally being triggered
        // not from here, the first character, but earlier, from previous clauses.
        // But imagine <div style="float;left">z</div>
        //                              ^
        //                            wrong
        //
        // in case like above, "l" would not have the beginning of a property
        // triggered, hence this clause here
        if (!doNothing &&
            // style attribute is being processed at the moment
            attrib &&
            attrib.attribName === "style" &&
            // it's not done yet
            attrib.attribOpeningQuoteAt &&
            !attrib.attribClosingQuoteAt &&
            // but property hasn't been initiated
            !property.start &&
            // yet the character is suitable:
            // it's not a whitespace
            str[i] &&
            str[i].trim() &&
            // NOTA BENE - there's same clause for inline HTML style
            // it's not some separator
            !`'"`.includes(str[i]) &&
            // TODO - cleanup below:
            // either it's not semi
            // (str[i] !== ";" ||
            //   // or it is, but the last non-whitespace char was semi, so it's a rogue semi here
            //   // we'll put it as a standalone property, it's not a part of text token
            //   str[lastNonWhitespaceCharAt as number] === ";") &&
            // it's not inside CSS block comment
            !lastLayerIs("block")) {
            // It's either css comment or a css property.
            // Dirty characters go as property name, then later we validate and
            // catch them.
            // Empty space goes as text token, see separate clauses above.
            if (
            // currently it's slash
            str[i] === "/" &&
                // asterisk follows, straight away or after whitespace
                str[rightVal] === "*") {
                attribPush({
                    type: "comment",
                    start: i,
                    end: rightVal + 1,
                    value: str.slice(i, rightVal + 1),
                    closing: false,
                    kind: "block",
                    language: "css",
                });
                // push a new layer, comment
                layers.push({
                    type: "block",
                    value: str.slice(i, rightVal + 1),
                    position: i,
                });
                // skip the next char, consider there might be whitespace in front
                doNothing = rightVal + 1;
            }
            // if it's a closing comment
            else if (str[i] === "*" && str[rightVal] === "/") {
                closingComment(i);
            }
            else {
                // first, close the text token if it's not ended
                if (Array.isArray(attrib.attribValue) &&
                    attrib.attribValue.length &&
                    !attrib.attribValue[~-attrib.attribValue.length].end) {
                    attrib.attribValue[~-attrib.attribValue.length].end = i;
                    attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, i);
                }
                // initiate a property
                // if !important has been detected, that's a CSS like:
                // <div style="float:left;!important">
                // the !important is alone by itself
                // also, it can be semi along by itself
                if (str[i] === ";") {
                    initProperty({
                        start: i,
                        end: i + 1,
                        semi: i,
                    });
                    doNothing = i;
                }
                else if (R2) {
                    initProperty({
                        start: i,
                        importantStarts: i,
                    });
                }
                else {
                    // protection against unclosed quotes
                    // <div style="float:left;; >
                    //                          ^
                    //                    we're here
                    initProperty(i);
                }
            }
        }
        // in comment type, "only" kind tokens, submit square brackets to layers
        // -------------------------------------------------------------------------
        // ps. it's so that we can rule out greater-than signs
        if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
            if (str[i] === "[") ;
        }
        // catch the ending of a token
        // -------------------------------------------------------------------------
        if (!doNothing) {
            if (token.type === "tag" && !layers.length && str[i] === ">") {
                token.end = i + 1;
                token.value = str.slice(token.start, token.end);
                // at this point other attributes might be still not submitted yet,
                // we can't reset it here
            }
            else if (token.type === "comment" &&
                token.language === "html" &&
                !layers.length &&
                token.kind === "simple" &&
                ((str[token.start] === "<" &&
                    str[i] === "-" &&
                    (matchLeft(str, i, "!-", {
                        trimBeforeMatching: true,
                    }) ||
                        (matchLeftIncl(str, i, "!-", {
                            trimBeforeMatching: true,
                        }) &&
                            str[i + 1] !== "-"))) ||
                    (str[token.start] === "-" &&
                        str[i] === ">" &&
                        matchLeft(str, i, "--", {
                            trimBeforeMatching: true,
                            maxMismatches: 1,
                        })))) {
                if (str[i] === "-" &&
                    (matchRight(str, i, ["[if", "(if", "{if"], {
                        i: true,
                        trimBeforeMatching: true,
                    }) ||
                        (matchRight(str, i, ["if"], {
                            i: true,
                            trimBeforeMatching: true,
                        }) &&
                            // the following case will assume closing sq. bracket is present
                            (xBeforeYOnTheRight(str, i, "]", ">") ||
                                // in case there are no brackets leading up to "mso" (which must exist)
                                (str.includes("mso", i) &&
                                    !str.slice(i, str.indexOf("mso")).includes("<") &&
                                    !str.slice(i, str.indexOf("mso")).includes(">")))))) {
                    // don't set the token's end, leave it open until the
                    // closing bracket, for example, it might be:
                    // <!--[if gte mso 9]>
                    //     ^
                    //    we're here
                    //
                    token.kind = "only";
                }
                else if (
                // ensure it's not starting with closing counterpart,
                // --><![endif]-->
                // but with
                // <!--<![endif]-->
                str[token.start] !== "-" &&
                    matchRightIncl(str, i, ["-<![endif"], {
                        i: true,
                        trimBeforeMatching: true,
                        maxMismatches: 2,
                    })) {
                    // don't set the token's end, leave it open until the
                    // closing bracket, for example, it might be:
                    // <!--<![endif]-->
                    //     ^
                    //    we're here
                    //
                    token.kind = "not";
                    token.closing = true;
                }
                else if (token.kind === "simple" &&
                    token.language === "html" &&
                    !token.closing &&
                    str[rightVal] === ">") {
                    token.end = rightVal + 1;
                    token.kind = "simplet";
                    token.closing = null;
                }
                else if (token.language === "html") {
                    // if it's a simple HTML comment, <!--, end it right here
                    token.end = i + 1;
                    // tokenizer will catch <!- as opening, so we need to extend
                    // for correct cases with two dashes <!--
                    if (str[leftVal] === "!" &&
                        str[rightVal] === "-") {
                        token.end = rightVal + 1;
                    }
                    token.value = str.slice(token.start, token.end);
                }
                // at this point other attributes might be still not submitted yet,
                // we can't reset it here
            }
            else if (token.type === "comment" &&
                token.language === "html" &&
                str[i] === ">" &&
                (!layers.length || str[rightVal] === "<")) {
                // if last layer was for square bracket, this means closing
                // counterpart is missing so we need to remove it now
                // because it's the ending of the tag ("only" kind) or
                // at least the first part of it ("not" kind)
                if (Array.isArray(layers) &&
                    layers.length &&
                    layers[~-layers.length].value === "[") {
                    layers.pop();
                }
                // the difference between opening Outlook conditional comment "only"
                // and conditional "only not" is that <!--> follows
                if (!["simplet", "not"].includes(token.kind) &&
                    matchRight(str, i, ["<!-->", "<!---->"], {
                        trimBeforeMatching: true,
                        maxMismatches: 1,
                        lastMustMatch: true,
                    })) {
                    token.kind = "not";
                }
                else {
                    token.end = i + 1;
                    token.value = str.slice(token.start, token.end);
                }
            }
            else if (token.type === "comment" &&
                token.language === "css" &&
                str[i] === "*" &&
                str[i + 1] === "/") {
                token.end = i + 1;
                token.value = str.slice(token.start, token.end);
            }
            else if (token.type === "esp" &&
                token.end === null &&
                typeof token.head === "string" &&
                typeof token.tail === "string" &&
                token.tail.includes(str[i])) {
                // extract the whole lump of ESP tag characters:
                let wholeEspTagClosing = "";
                for (let y = i; y < len; y++) {
                    if (espChars.includes(str[y])) {
                        wholeEspTagClosing += str[y];
                    }
                    else {
                        break;
                    }
                }
                // now, imagine the new heads start, for example,
                // {%- z -%}{%-
                //       ^
                //   we're here
                // find the breaking point where tails end
                if (wholeEspTagClosing.length > token.head.length) {
                    // in order for this to be tails + new heads, the total length should be
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
                    const headsFirstChar = token.head[0];
                    if (wholeEspTagClosing.endsWith(token.head)) {
                        // we have a situation like
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
                        token.end = i + wholeEspTagClosing.length - token.head.length;
                        token.value = str.slice(token.start, token.end);
                        doNothing = token.end;
                    }
                    else if (wholeEspTagClosing.startsWith(token.tail)) {
                        token.end = i + token.tail.length;
                        token.value = str.slice(token.start, token.end);
                        doNothing = token.end;
                    }
                    else if ((!token.tail.includes(headsFirstChar) &&
                        wholeEspTagClosing.includes(headsFirstChar)) ||
                        wholeEspTagClosing.endsWith(token.head) ||
                        wholeEspTagClosing.startsWith(token.tail)) {
                        // We're very lucky because heads and tails are using different
                        // characters, possibly opposite brackets of some kind.
                        // That's Nunjucks, Responsys (but no eDialog) patterns.
                        const firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(0, wholeEspTagClosing.indexOf(headsFirstChar));
                        const secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(wholeEspTagClosing.indexOf(headsFirstChar));
                        // imagine we sliced off (Nunjucks): -%}{%-
                        // if every character from anticipated tails (-%}) is present in the front
                        // chunk, Bob's your uncle, that's tails with new heads following.
                        if (firstPartOfWholeEspTagClosing.length &&
                            secondPartOfWholeEspTagClosing.length &&
                            token.tail
                                .split("")
                                .every((char) => firstPartOfWholeEspTagClosing.includes(char))) {
                            token.end = i + firstPartOfWholeEspTagClosing.length;
                            token.value = str.slice(token.start, token.end);
                            doNothing = token.end;
                        }
                    }
                    else {
                        // so heads and tails don't contain unique character, and more so,
                        // starting-one, PLUS, second set is different.
                        // For example, ESP heads/tails can be *|zzz|*
                        // Imaginary example, following heads would be variation of those
                        // above, ^|zzz|^
                        // TODO
                        // for now, return defaults, from else scenario below:
                        // we consider this whole chunk is tails.
                        token.end = i + wholeEspTagClosing.length;
                        token.value = str.slice(token.start, token.end);
                        doNothing = token.end;
                    }
                }
                else {
                    // we consider this whole chunk is tails.
                    token.end = i + wholeEspTagClosing.length;
                    token.value = str.slice(token.start, token.end);
                    // if last layer is ESP tag and we've got its closing, pop the layer
                    if (lastLayerIs("esp")) {
                        layers.pop();
                    }
                    doNothing = token.end;
                }
            }
            // END OF if (!doNothing)
        }
        // Catch the end of a tag name
        // -------------------------------------------------------------------------
        if (!doNothing &&
            token.type === "tag" &&
            token.tagNameStartsAt &&
            !token.tagNameEndsAt) {
            // tag names can be with numbers, h1
            if (!str[i] || !charSuitableForTagName(str[i])) {
                token.tagNameEndsAt = i;
                token.tagName = str.slice(token.tagNameStartsAt, i).toLowerCase();
                if (token.tagName && token.tagName.toLowerCase() === "script") {
                    withinScript = !withinScript;
                }
                if (token.tagName === "xml" && token.closing && !token.kind) {
                    token.kind = "xml";
                }
                // We evaluate self-closing tags not by presence of slash but evaluating
                // is the tag name among known self-closing tags. This way, we can later
                // catch and fix missing closing slashes.
                if (voidTags.includes(token.tagName)) {
                    token.void = true;
                }
                token.recognised = isTagNameRecognised(token.tagName);
                doNothing = i;
            }
        }
        // Catch the start of a tag name:
        // -------------------------------------------------------------------------
        if (!doNothing &&
            token.type === "tag" &&
            !token.tagNameStartsAt &&
            token.start != null &&
            (token.start < i || str[token.start] !== "<")) {
            // MULTIPLE ENTRY!
            // Consider closing tag's slashes and tag name itself.
            if (str[i] === "/") {
                token.closing = true;
                doNothing = i;
            }
            else if (isLatinLetter(str[i])) {
                token.tagNameStartsAt = i;
                // if by now closing marker is still null, set it to false - there
                // won't be any closing slashes between opening bracket and tag name
                if (!token.closing) {
                    token.closing = false;
                    doNothing = i;
                }
            }
            else ;
        }
        // catch the end of a tag attribute's name
        // -------------------------------------------------------------------------
        if (!doNothing &&
            token.type === "tag" &&
            token.kind !== "cdata" &&
            attrib.attribNameStartsAt &&
            i > attrib.attribNameStartsAt &&
            attrib.attribNameEndsAt === null &&
            !isAttrNameChar(str[i])) {
            attrib.attribNameEndsAt = i;
            attrib.attribName = str.slice(attrib.attribNameStartsAt, i);
            attrib.attribNameRecognised = allHtmlAttribs.has(attrib.attribName);
            if (attrib.attribName.startsWith("mc:")) {
                // that's a mailchimp attribute
                token.pureHTML = false;
            }
            // maybe there's a space in front of equal, <div class= "">
            if (str[i] && !str[i].trim() && str[rightVal] === "=") ;
            else if ((str[i] && !str[i].trim()) ||
                str[i] === ">" ||
                (str[i] === "/" && str[rightVal] === ">")) {
                if (`'"`.includes(str[rightVal])) ;
                else {
                    attrib.attribEnds = i;
                    // push and wipe
                    token.attribs.push(lodash_clonedeep(attrib));
                    attribReset();
                }
            }
        }
        // catch the start of a tag attribute's name
        // -------------------------------------------------------------------------
        if (!doNothing &&
            str[i] &&
            token.type === "tag" &&
            token.kind !== "cdata" &&
            token.tagNameEndsAt &&
            i > token.tagNameEndsAt &&
            attrib.attribStarts === null &&
            isAttrNameChar(str[i])) {
            attrib.attribStarts = i;
            // even though in theory left() which reports first non-whitespace
            // character's index on the left can be null, it does not happen
            // in this context - there will be tag's name or something in front!
            attrib.attribLeft = lastNonWhitespaceCharAt;
            attrib.attribNameStartsAt = i;
        }
        // catch the curlies inside CSS rule
        // -------------------------------------------------------------------------
        if (!doNothing && token.type === "rule") {
            if (str[i] === "{" &&
                str[i + 1] !== "{" &&
                str[i - 1] !== "{" &&
                !token.openingCurlyAt) {
                token.openingCurlyAt = i;
            }
            else if (str[i] === "}" &&
                token.openingCurlyAt &&
                !token.closingCurlyAt) {
                token.closingCurlyAt = i;
                token.end = i + 1;
                token.value = str.slice(token.start, token.end);
                // check is the property's last text token closed:
                if (Array.isArray(token.properties) &&
                    token.properties.length &&
                    token.properties[~-token.properties.length].start &&
                    !token.properties[~-token.properties.length].end) {
                    token.properties[~-token.properties.length].end = i;
                    token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, i);
                }
                // if there's partial, still-pending property, push it
                if (property.start) {
                    token.properties.push(property);
                    propertyReset();
                }
                pingTagCb(token);
                // if it's a "rule" token and a parent "at" rule is pending in layers,
                // also put this "rule" into that parent in layers
                if (lastLayerIs("at")) {
                    layers[~-layers.length].token.rules.push(token);
                }
                tokenReset();
            }
        }
        // catch the ending of a attribute sub-token value
        // -------------------------------------------------------------------------
        if (!doNothing &&
            attrib.attribName &&
            Array.isArray(attrib.attribValue) &&
            attrib.attribValue.length &&
            !attrib.attribValue[~-attrib.attribValue.length].end) {
            // TODO
            // if it's a closing comment
            if (str[i] === "*" && str[rightVal] === "/") {
                closingComment(i);
            }
        }
        // catch the beginning of a attribute sub-token value
        // -------------------------------------------------------------------------
        if (
        // EITHER IT'S INLINE CSS:
        (!doNothing &&
            // attribute has been recording
            attrib &&
            // and it's not finished
            attrib.attribValueStartsAt &&
            !attrib.attribValueEndsAt &&
            // and its property hasn't been recording
            !property.propertyStarts &&
            // we're inside the value
            i >= attrib.attribValueStartsAt &&
            // if attribValue array is empty, no object has been placed yet,
            Array.isArray(attrib.attribValue) &&
            (!attrib.attribValue.length ||
                // or there is one but it's got ending (prevention from submitting
                // another text type object on top, before previous has been closed)
                (attrib.attribValue[~-attrib.attribValue.length].end &&
                    // and that end is less than current index i
                    attrib.attribValue[~-attrib.attribValue.length].end <= i))) ||
            // OR IT'S HEAD CSS
            (!doNothing &&
                // css rule token has been recording
                token.type === "rule" &&
                // token started:
                token.openingCurlyAt &&
                // but not ended:
                !token.closingCurlyAt &&
                // there is no unfinished property being recorded
                !property.propertyStarts)) {
            // if it's suitable for property, start a property
            if (str[i] === ";" &&
                // a) if it's inline HTML tag CSS style attribute
                ((attrib &&
                    Array.isArray(attrib.attribValue) &&
                    attrib.attribValue.length &&
                    // last attribute has semi already set:
                    attrib.attribValue[~-attrib.attribValue.length].semi &&
                    // and that semi is really behind this current index
                    attrib.attribValue[~-attrib.attribValue.length].semi < i) ||
                    // or
                    // b) if it's head CSS styles block
                    (token &&
                        token.type === "rule" &&
                        Array.isArray(token.properties) &&
                        token.properties.length &&
                        token.properties[~-token.properties.length].semi &&
                        token.properties[~-token.properties.length].semi < i))) {
                // rogue semi?
                // <div style="float:left;;">
                //                        ^
                // if so, it goes as a standalone property, something like:
                // {
                //   start: 23,
                //   end: 24,
                //   property: null,
                //   propertyStarts: null,
                //   propertyEnds: null,
                //   value: null,
                //   valueStarts: null,
                //   valueEnds: null,
                //   important: null,
                //   importantStarts: null,
                //   importantEnds: null,
                //   colon: null,
                //   semi: 23,
                // }
                initProperty({
                    start: i,
                    semi: i,
                });
                doNothing = i + 1;
            }
            // if it's whitespace, for example,
            // <a style="  /* zzz */color: red;  ">
            //           ^
            //         this
            //
            // rogue text will go as property, for example:
            //
            // <a style="  z color: red;  ">
            else if (
            // whitespace is automatically text token
            (str[i] && !str[i].trim()) ||
                // if comment layer has been started, it's also a text token, no matter even
                // if it's a property, because it's comment's contents.
                lastLayerIs("block")) {
                // depends where to push, is it inline css or head css rule
                if (attrib.attribName) {
                    attrib.attribValue.push({
                        type: "text",
                        start: i,
                        end: null,
                        value: null,
                    });
                }
                else if (token.type === "rule" &&
                    // we don't want to push over the properties in-progress
                    (!Array.isArray(token.properties) ||
                        !token.properties.length ||
                        // last property should have ended
                        token.properties[~-token.properties.length].end)) {
                    token.properties.push({
                        type: "text",
                        start: i,
                        end: null,
                        value: null,
                    });
                }
            }
        }
        // Catch the end of a tag attribute's value:
        // -------------------------------------------------------------------------
        if (!doNothing &&
            token.type === "tag" &&
            attrib.attribValueStartsAt &&
            i >= attrib.attribValueStartsAt &&
            attrib.attribValueEndsAt === null) {
            if (SOMEQUOTE.includes(str[i])) {
                if (
                // so we're on a single/double quote,
                // (str[i], the current character is a quote)
                // and...
                // we're not inside some ESP tag - ESP layers are not pending:
                !layers.some((layerObj) => layerObj.type === "esp") &&
                    // and the current character passed the
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
                    (!str[i] ||
                        // or there is no closing bracket further
                        !str.includes(">", i) ||
                        // further checks confirm it looks like legit closing
                        isAttrClosing(str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, i))) {
                    attrib.attribClosingQuoteAt = i;
                    attrib.attribValueEndsAt = i;
                    if (attrib.attribValueStartsAt) {
                        attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
                    }
                    attrib.attribEnds = i + 1;
                    if (property.propertyStarts) {
                        attrib.attribValue.push(lodash_clonedeep(property));
                        propertyReset();
                    }
                    if (Array.isArray(attrib.attribValue) &&
                        attrib.attribValue.length &&
                        !attrib.attribValue[~-attrib.attribValue.length].end) {
                        // if it's not a property (of inline style), set its "end"
                        if (!attrib.attribValue[~-attrib.attribValue.length].property) {
                            attrib.attribValue[~-attrib.attribValue.length].end = i;
                            if (attrib.attribValue[~-attrib.attribValue.length]
                                .property === null) {
                                // it's CSS property without a value:
                                // <img style="display" />
                                attrib.attribValue[~-attrib.attribValue.length].property = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, i);
                                attrib.attribValue[~-attrib.attribValue.length].propertyEnds = i;
                            }
                            else {
                                attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, i);
                            }
                        }
                    }
                    // 2. if the pair was mismatching, wipe layers' last element
                    if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
                        layers.pop();
                        layers.pop();
                    }
                    // 3. last check for the last attribValue's .end - in some broken code
                    // cases it might be still null:
                    // <div style="float:left;x">
                    //                         ^
                    //                       we're here
                    if (attrib.attribValue[~-attrib.attribValue.length] &&
                        !attrib.attribValue[~-attrib.attribValue.length].end) {
                        attrib.attribValue[~-attrib.attribValue.length].end = i;
                    }
                    // 4. push and wipe
                    token.attribs.push(lodash_clonedeep(attrib));
                    attribReset();
                }
                else if ((!Array.isArray(attrib.attribValue) ||
                    !attrib.attribValue.length ||
                    // last attrib value should not be a text token
                    attrib.attribValue[~-attrib.attribValue.length].type !==
                        "text") &&
                    !property.propertyStarts) {
                    // quotes not matched, so it's unencoded, raw quote, part of the value
                    // for example
                    // <table width=""100">
                    //               ^
                    //            rogue quote
                    // let's initiate a next token
                    attrib.attribValue.push({
                        type: "text",
                        start: i,
                        end: null,
                        value: null,
                    });
                }
            }
            else if (attrib.attribOpeningQuoteAt === null &&
                ((str[i] && !str[i].trim()) ||
                    ["/", ">"].includes(str[i]) ||
                    (espChars.includes(str[i]) && espChars.includes(str[i + 1])))) {
                // ^ either whitespace or tag's closing or ESP literal's start ends
                // the attribute's value if there are no quotes
                attrib.attribValueEndsAt = i;
                attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
                if (Array.isArray(attrib.attribValue) &&
                    attrib.attribValue.length &&
                    !attrib.attribValue[~-attrib.attribValue.length].end) {
                    attrib.attribValue[~-attrib.attribValue.length].end = i;
                    attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, attrib.attribValue[~-attrib.attribValue.length].end);
                }
                attrib.attribEnds = i;
                // 2. push and wipe
                token.attribs.push(lodash_clonedeep(attrib));
                attribReset();
                // 3. pop layers
                layers.pop();
                // 4. tackle the tag ending
                if (str[i] === ">") {
                    token.end = i + 1;
                    token.value = str.slice(token.start, token.end);
                }
            }
            else if (str[i] === "=" &&
                leftVal !== null &&
                rightVal &&
                (`'"`.includes(str[rightVal]) ||
                    (str[~-i] && isLatinLetter(str[~-i]))) &&
                // this will catch url params like
                // <img src="https://z.png?query=" />
                //                              ^
                //                            false alarm
                //
                // let's exclude anything URL-related
                !(attrib &&
                    attrib.attribOpeningQuoteAt &&
                    // check for presence of slash, /
                    (/\//.test(str.slice(attrib.attribOpeningQuoteAt + 1, i)) ||
                        // check for mailto:
                        /mailto:/.test(str.slice(attrib.attribOpeningQuoteAt + 1, i)) ||
                        // check for /\w?\w/ like
                        // <img src="codsen.com?query=" />
                        //                     ^
                        /\w\?\w/.test(str.slice(attrib.attribOpeningQuoteAt + 1, i))))) {
                // all depends, are there whitespace characters:
                // imagine
                // <a href="border="0">
                // vs
                // <a href="xyz border="0">
                // that's two different cases - there's nothing to salvage in former!
                let whitespaceFound;
                let attribClosingQuoteAt;
                for (let y = leftVal; y >= attrib.attribValueStartsAt; y--) {
                    // catch where whitespace starts
                    if (!whitespaceFound && str[y] && !str[y].trim()) {
                        whitespaceFound = true;
                        if (attribClosingQuoteAt) {
                            // slice the captured chunk
                            str.slice(y, attribClosingQuoteAt);
                        }
                    }
                    // where that caught whitespace ends, that's the default location
                    // of double quotes.
                    // <a href="xyz border="0">
                    //            ^        ^
                    //            |        |
                    //            |   we go from here
                    //         to here
                    if (whitespaceFound && str[y] && str[y].trim()) {
                        whitespaceFound = false;
                        if (!attribClosingQuoteAt) {
                            // that's the first, default location
                            attribClosingQuoteAt = y + 1;
                        }
                    }
                }
                if (attribClosingQuoteAt) {
                    attrib.attribValueEndsAt = attribClosingQuoteAt;
                    if (attrib.attribValueStartsAt) {
                        attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, attribClosingQuoteAt);
                        if (Array.isArray(attrib.attribValue) &&
                            attrib.attribValue.length &&
                            !attrib.attribValue[~-attrib.attribValue.length].end) {
                            attrib.attribValue[~-attrib.attribValue.length].end =
                                attrib.attribValueEndsAt;
                            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, attrib.attribValueEndsAt);
                        }
                    }
                    attrib.attribEnds = attribClosingQuoteAt;
                    // 2. if the pair was mismatching, wipe layers' last element
                    if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
                        layers.pop();
                    }
                    // 3. push and wipe
                    token.attribs.push(lodash_clonedeep(attrib));
                    attribReset();
                    // 4. pull the i back to the position where the attribute ends
                    i = ~-attribClosingQuoteAt;
                    continue;
                }
                else if (attrib.attribOpeningQuoteAt &&
                    (`'"`.includes(str[rightVal]) ||
                        allHtmlAttribs.has(str.slice(attrib.attribOpeningQuoteAt + 1, i).trim()))) {
                    // worst case scenario:
                    // <span width="height="100">
                    //
                    // traversing back from second "=" we hit only the beginning of an
                    // attribute, there was nothing to salvage.
                    // In this case, reset the attribute's calculation, go backwards to "h".
                    // 1. pull back the index, go backwards, read this new attribute again
                    i = attrib.attribOpeningQuoteAt;
                    // 2. end the attribute
                    attrib.attribEnds = attrib.attribOpeningQuoteAt + 1;
                    // 3. value doesn't start, this needs correction
                    attrib.attribValueStartsAt = null;
                    // 4. pop the opening quotes layer
                    layers.pop();
                    // 5. push and wipe
                    token.attribs.push(lodash_clonedeep(attrib));
                    attribReset();
                    // 6. continue
                    continue;
                }
            }
            else if (str[i] === "/" && str[rightVal] === ">") {
                if (attrib.attribValueStartsAt) {
                    attrib.attribValueStartsAt = null;
                }
                if (!attrib.attribEnds) {
                    attrib.attribEnds = i;
                }
            }
            else if (attrib &&
                attrib.attribName !== "style" &&
                attrib.attribStarts &&
                !attrib.attribEnds &&
                !property.propertyStarts &&
                //
                // AND,
                //
                // either there are no attributes recorded under attrib.attribValue:
                (!Array.isArray(attrib.attribValue) ||
                    // or it's array but empty:
                    !attrib.attribValue.length ||
                    // or is it not empty but its last attrib has ended by now
                    (attrib.attribValue[~-attrib.attribValue.length].end &&
                        attrib.attribValue[~-attrib.attribValue.length].end <= i))) {
                attrib.attribValue.push({
                    type: "text",
                    start: i,
                    end: null,
                    value: null,
                });
            }
        }
        else if (token.type === "esp" &&
            attribToBackup &&
            parentTokenToBackup &&
            attribToBackup.attribOpeningQuoteAt &&
            attribToBackup.attribValueStartsAt &&
            `'"`.includes(str[i]) &&
            str[attribToBackup.attribOpeningQuoteAt] === str[i] &&
            isAttrClosing(str, attribToBackup.attribOpeningQuoteAt, i)) {
            // imagine unclosed ESP tag inside attr value:
            // <tr class="{% x">
            //                ^
            //             we're here
            // we need to still proactively look for closing attribute quotes,
            // even inside ESP tags, if we're inside tag attributes
            // 1. patch up missing token (which is type="esp" currently) values
            token.end = i;
            token.value = str.slice(token.start, i);
            // 2. push token into attribToBackup.attribValue
            if (attribToBackup && !Array.isArray(attribToBackup.attribValue)) {
                attribToBackup.attribValue = [];
            }
            attribToBackup.attribValue.push(token);
            // 3. patch up missing values in attribToBackup
            attribToBackup.attribValueEndsAt = i;
            attribToBackup.attribValueRaw = str.slice(attribToBackup.attribValueStartsAt, i);
            attribToBackup.attribClosingQuoteAt = i;
            attribToBackup.attribEnds = i + 1;
            // 4. restore parent token
            token = lodash_clonedeep(parentTokenToBackup);
            token.attribs.push(attribToBackup);
            // 5. reset all
            attribToBackup = undefined;
            parentTokenToBackup = undefined;
            // 6. pop the last 3 layers
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
        }
        // Catch the start of a tag attribute's value:
        // -------------------------------------------------------------------------
        if (!doNothing &&
            token.type === "tag" &&
            !attrib.attribValueStartsAt &&
            attrib.attribNameEndsAt &&
            attrib.attribNameEndsAt <= i &&
            str[i] &&
            str[i].trim()) {
            if (str[i] === "=" &&
                !SOMEQUOTE.includes(str[rightVal]) &&
                !`=`.includes(str[rightVal]) &&
                !espChars.includes(str[rightVal]) // it might be an ESP literal
            ) {
                // find the index of the next quote, single or double
                const firstQuoteOnTheRightIdx = SOMEQUOTE.split("")
                    .map((quote) => str.indexOf(quote, rightVal))
                    .filter((val) => val > 0).length
                    ? Math.min(...SOMEQUOTE.split("")
                        .map((quote) => str.indexOf(quote, rightVal))
                        .filter((val) => val > 0))
                    : undefined;
                // catch attribute name - equal - attribute name - equal
                // <span width=height=100>
                if (
                // there is a character on the right (otherwise value would be null)
                rightVal &&
                    // there is equal character in the remaining chunk
                    str.slice(rightVal).includes("=") &&
                    // characters upto first equals form a known attribute value
                    allHtmlAttribs.has(str
                        .slice(rightVal, rightVal + str.slice(rightVal).indexOf("="))
                        .trim()
                        .toLowerCase())) {
                    // we have something like:
                    // <span width=height=100>
                    // 1. end the attribute
                    attrib.attribEnds = i + 1;
                    // 2. push and wipe
                    token.attribs.push({ ...attrib });
                    attribReset();
                }
                else if (
                // try to stop this clause:
                //
                // if there are no quotes in the remaining string
                !firstQuoteOnTheRightIdx ||
                    // there is one but there are equal character between here and its location
                    str
                        .slice(rightVal, firstQuoteOnTheRightIdx)
                        .includes("=") ||
                    // if there is no second quote of that type in the remaining string
                    !str.includes(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1) ||
                    // if string slice from quote to quote includes equal or brackets
                    Array.from(str.slice(firstQuoteOnTheRightIdx + 1, str.indexOf(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1))).some((char) => `<>=`.includes(char))) {
                    // case of missing opening quotes
                    attrib.attribValueStartsAt = rightVal;
                    // push missing entry into layers
                    layers.push({
                        type: "simple",
                        value: null,
                        position: attrib.attribValueStartsAt,
                    });
                }
            }
            else if (SOMEQUOTE.includes(str[i])) {
                // maybe it's <span width='"100"> and it's a false opening quote, '
                const nextCharIdx = rightVal;
                if (
                // a non-whitespace character exists on the right of index i
                nextCharIdx &&
                    // if it is a quote character
                    SOMEQUOTE.includes(str[nextCharIdx]) &&
                    // but opposite kind,
                    str[i] !== str[nextCharIdx] &&
                    // and string is long enough
                    str.length > nextCharIdx + 2 &&
                    // and remaining string contains that quote like the one on the right
                    str.slice(nextCharIdx + 1).includes(str[nextCharIdx]) &&
                    // and to the right of it we don't have str[i] quote,
                    // case: <span width="'100'">
                    (!str.indexOf(str[nextCharIdx], nextCharIdx + 1) ||
                        !right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1)) ||
                        str[i] !==
                            str[right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1))]) &&
                    // and that slice does not contain equal or brackets or quote of other kind
                    !Array.from(str.slice(nextCharIdx + 1, str.indexOf(str[nextCharIdx]))).some((char) => `<>=${str[i]}`.includes(char))) {
                    // pop the layers
                    layers.pop();
                }
                else {
                    // OK then...
                    // has the quotes started (it's closing quote) or it's the opening quote?
                    /* eslint no-lonely-if: "off" */
                    if (!attrib.attribOpeningQuoteAt) {
                        attrib.attribOpeningQuoteAt = i;
                        if (
                        // character exists on the right
                        str[i + 1] &&
                            // EITHER it's not the same as opening quote we're currently on
                            (str[i + 1] !== str[i] ||
                                // OR it's a rogue quote, part of the value
                                !ifQuoteThenAttrClosingQuote(i + 1))) {
                            attrib.attribValueStartsAt = i + 1;
                        }
                    }
                    else {
                        // One quote exists.
                        // <table width="100">
                        //                  ^
                        //
                        /* istanbul ignore else */
                        if (isAttrClosing(str, attrib.attribOpeningQuoteAt, i)) {
                            attrib.attribClosingQuoteAt = i;
                        }
                        /* istanbul ignore else */
                        if (attrib.attribOpeningQuoteAt && attrib.attribClosingQuoteAt) {
                            if (attrib.attribOpeningQuoteAt < ~-attrib.attribClosingQuoteAt) {
                                attrib.attribValueRaw = str.slice(attrib.attribOpeningQuoteAt + 1, attrib.attribClosingQuoteAt);
                            }
                            else {
                                attrib.attribValueRaw = "";
                            }
                            attrib.attribEnds = i + 1;
                            // push and wipe
                            token.attribs.push(lodash_clonedeep(attrib));
                            attribReset();
                        }
                    }
                }
            }
            // else - value we assume does not start
        }
        //
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
        if (!doNothing &&
            str[i] === ">" &&
            // consider ERB templating tags like <%= @p1 %>
            str[i - 1] !== "%" &&
            token.type === "tag" &&
            attrib.attribStarts &&
            !attrib.attribEnds) {
            // Idea is simple: we have to situations:
            // 1. this closing bracket is real, closing bracket
            // 2. this closing bracket is unencoded raw text
            // Now, we need to distinguish these two cases.
            // It's easiest done traversing right until the next closing bracket.
            // If it's case #1, we'll likely encounter a new tag opening (or nothing).
            // If it's case #2, we'll likely encounter a tag closing or attribute
            // combo's equal+quote
            let thisIsRealEnding = false;
            if (str[i + 1]) {
                // Traverse then
                for (let y = i + 1; y < len; y++) {
                    // if we reach the closing counterpart of the quotes, terminate
                    if (attrib.attribOpeningQuoteAt &&
                        str[y] === str[attrib.attribOpeningQuoteAt]) {
                        if (y !== i + 1 && str[~-y] !== "=") {
                            thisIsRealEnding = true;
                        }
                        break;
                    }
                    else if (str[y] === ">") {
                        // must be real tag closing, we just tackle missing quotes
                        // TODO - missing closing quotes
                        break;
                    }
                    else if (str[y] === "<") {
                        thisIsRealEnding = true;
                        // TODO - pop only if type === "simple" and it's the same opening
                        // quotes of this attribute
                        layers.pop();
                        break;
                    }
                    else if (!str[y + 1]) {
                        // if end was reached and nothing caught, that's also positive sign
                        thisIsRealEnding = true;
                        break;
                    }
                }
            }
            else {
                thisIsRealEnding = true;
            }
            //
            //
            //
            // FINALLY,
            //
            //
            //
            // if "thisIsRealEnding" was set to "true", terminate the tag here.
            if (thisIsRealEnding) {
                token.end = i + 1;
                token.value = str.slice(token.start, token.end);
                // set and push the attribute's records, just closing quote will be
                // null and possibly value too
                if (attrib.attribValueStartsAt &&
                    i &&
                    attrib.attribValueStartsAt < i &&
                    str.slice(attrib.attribValueStartsAt, i).trim()) {
                    attrib.attribValueEndsAt = i;
                    attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
                    if (Array.isArray(attrib.attribValue) &&
                        attrib.attribValue.length &&
                        !attrib.attribValue[~-attrib.attribValue.length].end) {
                        attrib.attribValue[~-attrib.attribValue.length].end = i;
                        attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, i);
                    }
                    // otherwise, nulls stay
                }
                else {
                    attrib.attribValueStartsAt = null;
                }
                if (attrib.attribEnds === null) {
                    attrib.attribEnds = i;
                }
                if (attrib) {
                    // 2. push and wipe
                    token.attribs.push(lodash_clonedeep(attrib));
                    attribReset();
                }
            }
        }
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
        // ping charCb
        // -------------------------------------------------------------------------
        if (str[i] && opts.charCb) {
            pingCharCb({
                type: token.type,
                chr: str[i],
                i,
            });
        }
        //
        //
        //
        //
        //
        //
        //
        // catch end of the string
        // -------------------------------------------------------------------------
        // notice there's no "doNothing"
        if (!str[i] && token.start !== null) {
            token.end = i;
            token.value = str.slice(token.start, token.end);
            // if there is unfinished "attrib" object, submit it
            // as is, that's abruptly ended attribute
            if (attrib && attrib.attribName) {
                // push and wipe
                // patch the attr ending if it's missing
                if (!attrib.attribEnds) {
                    attrib.attribEnds = i;
                }
                token.attribs.push({ ...attrib });
                attribReset();
            }
            // if there was an unfinished CSS property, finish it
            if (token &&
                Array.isArray(token.properties) &&
                token.properties.length &&
                !token.properties[~-token.properties.length].end) {
                token.properties[~-token.properties.length].end = i;
                if (token.properties[~-token.properties.length].start &&
                    !token.properties[~-token.properties.length].value) {
                    token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, i);
                }
            }
            // if there is unfinished css property that has been
            // recording, end it and push it as is. That's an
            // abruptly ended css chunk.
            if (property && property.propertyStarts) {
                // patch property.end
                if (!property.end) {
                    property.end = i;
                }
                pushProperty(property);
                propertyReset();
            }
            pingTagCb(token);
        }
        //
        //
        //
        //
        //
        //
        //
        // Record last non-whitespace character
        // -------------------------------------------------------------------------
        if (str[i] && str[i].trim()) {
            lastNonWhitespaceCharAt = i;
        }
        //
        //
        //
        //
        //
        //
        //
        // logging:
        // -------------------------------------------------------------------------
    }
    //
    // finally, clear stashes
    //
    if (charStash.length) {
        for (let i = 0, len2 = charStash.length; i < len2; i++) {
            reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
        }
    }
    if (tagStash.length) {
        for (let i = 0, len2 = tagStash.length; i < len2; i++) {
            reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
        }
    }
    // return stats
    const timeTakenInMilliseconds = Date.now() - start;
    return {
        timeTakenInMilliseconds,
    };
}
// -----------------------------------------------------------------------------
// export some util functions for testing purposes because sources are in TS
// and unit test runners can't read TS
const util = { matchLayerLast };

exports.defaults = defaults;
exports.tokenizer = tokenizer;
exports.util = util;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
