/**
 * @name html-table-patcher
 * @fileoverview Visual helper to place templating code around table tags into correct places
 * @version 4.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/html-table-patcher/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.htmlTablePatcher = {}));
}(this, (function (exports) { 'use strict';

/**
 * @name ast-monkey-util
 * @fileoverview Utility library of AST helper functions
 * @version 1.3.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ast-monkey-util/}
 */

function pathNext(str) {
  if (str.includes(".") && /^\d*$/.test(str.slice(str.lastIndexOf(".") + 1))) {
    return `${str.slice(0, str.lastIndexOf(".") + 1)}${+str.slice(str.lastIndexOf(".") + 1) + 1}`;
  }
  if (/^\d*$/.test(str)) {
    return `${+str + 1}`;
  }
  return str;
}

function pathPrev(str) {
  if (!str) {
    return null;
  }
  const extractedValue = str.slice(str.lastIndexOf(".") + 1);
  if (extractedValue === "0") {
    return null;
  }
  if (str.includes(".") && /^\d*$/.test(extractedValue)) {
    return `${str.slice(0, str.lastIndexOf(".") + 1)}${+str.slice(str.lastIndexOf(".") + 1) - 1}`;
  }
  if (/^\d*$/.test(str)) {
    return `${+str - 1}`;
  }
  return null;
}

function pathUp(str) {
  if (str.includes(".") && str.slice(str.indexOf(".") + 1).includes(".")) {
    let dotsCount = 0;
    for (let i = str.length; i--;) {
      if (str[i] === ".") {
        dotsCount += 1;
      }
      if (dotsCount === 2) {
        return str.slice(0, i);
      }
    }
  }
  return "0";
}

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
/** `Object#toString` result references. */
var objectTag = '[object Object]';

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

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

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
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) ||
      objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

var lodash_isplainobject = isPlainObject;

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
 * @name string-left-right
 * @fileoverview Looks up the first non-whitespace character to the left/right of a given index
 * @version 4.0.13
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
 * @name string-find-malformed
 * @fileoverview Search for a malformed string. Think of Levenshtein distance but in search.
 * @version 2.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-find-malformed/}
 */
function isObj$4(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
function isStr$2(something) {
  return typeof something === "string";
}
const defaults$7 = {
  stringOffset: 0,
  maxDistance: 1,
  ignoreWhitespace: true
};
function findMalformed(str, refStr, cb, originalOpts) {
  if (!isStr$2(str)) {
    throw new TypeError(`string-find-malformed: [THROW_ID_01] the first input argument, string where to look for, must be a string! Currently it's equal to: ${str} (type: ${typeof str})`);
  } else if (!str.length) {
    return;
  }
  if (!isStr$2(refStr)) {
    throw new TypeError(`string-find-malformed: [THROW_ID_02] the second input argument, string we should find, must be a string! Currently it's equal to: ${refStr} (type: ${typeof refStr})`);
  } else if (!refStr.length) {
    return;
  }
  if (typeof cb !== "function") {
    throw new TypeError(`string-find-malformed: [THROW_ID_03] the third input argument, a callback function, must be a function! Currently it's equal to: ${cb} (type: ${typeof cb})`);
  }
  if (originalOpts && !isObj$4(originalOpts)) {
    throw new TypeError(`string-find-malformed: [THROW_ID_04] the fourth input argument, an Optional Options Object, must be a plain object! Currently it's equal to: ${originalOpts} (type: ${typeof originalOpts})`);
  }
  const opts = { ...defaults$7,
    ...originalOpts
  };
  if (typeof opts.stringOffset === "string" && /^\d*$/.test(opts.stringOffset)) {
    opts.stringOffset = Number(opts.stringOffset);
  } else if (!Number.isInteger(opts.stringOffset) || opts.stringOffset < 0) {
    throw new TypeError(`[THROW_ID_05] opts.stringOffset must be a natural number or zero! Currently it's: ${opts.stringOffset}`);
  }
  const len = str.length;
  const len2 = Math.min(refStr.length, (opts.maxDistance || 0) + 1);
  let pendingMatchesArr = [];
  const patience = opts.maxDistance || 1;
  let wasThisLetterMatched;
  for (let i = 0; i < len; i++) {
    if (opts.ignoreWhitespace && !str[i].trim()) {
      continue;
    }
    for (let z = 0, len3 = pendingMatchesArr.length; z < len3; z++) {
      wasThisLetterMatched = false;
      if (Array.isArray(pendingMatchesArr[z].pendingToCheck) && pendingMatchesArr[z].pendingToCheck.length && str[i] === pendingMatchesArr[z].pendingToCheck[0]) {
        wasThisLetterMatched = true;
        pendingMatchesArr[z].pendingToCheck.shift();
      } else if (Array.isArray(pendingMatchesArr[z].pendingToCheck) && pendingMatchesArr[z].pendingToCheck.length && str[i] === pendingMatchesArr[z].pendingToCheck[1]) {
        wasThisLetterMatched = true;
        pendingMatchesArr[z].pendingToCheck.shift();
        pendingMatchesArr[z].pendingToCheck.shift();
        pendingMatchesArr[z].patienceLeft -= 1;
      } else {
        pendingMatchesArr[z].patienceLeft -= 1;
        if (str[right(str, i)] !== pendingMatchesArr[z].pendingToCheck[0]) {
          pendingMatchesArr[z].pendingToCheck.shift();
          if (str[i] === pendingMatchesArr[z].pendingToCheck[0]) {
            pendingMatchesArr[z].pendingToCheck.shift();
          }
        }
      }
    }
    pendingMatchesArr = pendingMatchesArr.filter(obj => obj.patienceLeft >= 0);
    const tempArr = pendingMatchesArr.filter(obj => obj.pendingToCheck.length === 0).map(obj => obj.startsAt);
    if (Array.isArray(tempArr) && tempArr.length) {
      const idxFrom = Math.min(...tempArr);
      const idxTo = i + (wasThisLetterMatched ? 1 : 0);
      if (str.slice(idxFrom, idxTo) !== refStr) {
        cb({
          idxFrom: idxFrom + (opts.stringOffset || 0),
          idxTo: idxTo + (opts.stringOffset || 0)
        });
      }
      pendingMatchesArr = pendingMatchesArr.filter(obj => obj.pendingToCheck.length);
    }
    for (let y = 0; y < len2; y++) {
      if (str[i] === refStr[y]) {
        const whatToPush = {
          startsAt: i,
          patienceLeft: patience - y,
          pendingToCheck: Array.from(refStr.slice(y + 1))
        };
        pendingMatchesArr.push(whatToPush);
        break;
      }
    }
  }
}

/**
 * @name arrayiffy-if-string
 * @fileoverview Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * @version 3.13.13
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
 * @version 7.0.7
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-match-left-right/}
 */

function isObj$3(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
function isStr$1(something) {
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
  if (isObj$3(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!${Array.isArray(originalOpts.trimBeforeMatching) ? ` Did you mean to use opts.trimCharsBeforeMatching?` : ""}`);
  }
  const opts = { ...defaults$6,
    ...originalOpts
  };
  if (typeof opts.trimCharsBeforeMatching === "string") {
    opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  }
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(el => isStr$1(el) ? el : String(el));
  if (!isStr$1(str)) {
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
  if (originalOpts && !isObj$3(originalOpts)) {
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
  Array.isArray(whatToMatch) && whatToMatch.length === 1 && isStr$1(whatToMatch[0]) && !whatToMatch[0].trim()
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

/**
 * @name html-all-known-attributes
 * @fileoverview All HTML attributes known to the Humanity
 * @version 4.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/html-all-known-attributes/}
 */
const allHtmlAttribs = new Set(["abbr", "accept", "accept-charset", "accesskey", "action", "align", "alink", "allow", "alt", "archive", "async", "autocapitalize", "autocomplete", "autofocus", "autoplay", "axis", "background", "background-attachment", "background-color", "background-image", "background-position", "background-position-x", "background-position-y", "background-repeat", "bgcolor", "border", "border-bottom", "border-bottom-color", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-style", "border-top", "border-top-color", "border-top-style", "border-top-width", "border-width", "buffered", "capture", "cellpadding", "cellspacing", "challenge", "char", "charoff", "charset", "checked", "cite", "class", "classid", "clear", "clip", "code", "codebase", "codetype", "color", "cols", "colspan", "column-span", "compact", "content", "contenteditable", "contextmenu", "controls", "coords", "crossorigin", "csp", "cursor", "data", "data-*", "datetime", "declare", "decoding", "default", "defer", "dir", "direction", "dirname", "disabled", "display", "download", "draggable", "dropzone", "enctype", "enterkeyhint", "face", "filter", "float", "font", "font-color", "font-emphasize", "font-emphasize-position", "font-emphasize-style", "font-family", "font-size", "font-style", "font-variant", "font-weight", "for", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "frame", "frameborder", "frontuid", "headers", "height", "hidden", "high", "horiz-align", "href", "hreflang", "hspace", "http-equiv", "icon", "id", "importance", "inputmode", "integrity", "intrinsicsize", "ismap", "itemprop", "keytype", "kind", "label", "lang", "language", "layout-flow", "layout-grid", "layout-grid-char", "layout-grid-line", "layout-grid-mode", "layout-grid-type", "left", "letter-spacing", "line-break", "line-height", "link", "list", "list-image-1", "list-image-2", "list-image-3", "list-style", "list-style-image", "list-style-position", "list-style-type", "loading", "longdesc", "loop", "low", "manifest", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marginheight", "marginwidth", "max", "maxlength", "media", "method", "min", "minlength", "mso-ansi-font-size", "mso-ansi-font-style", "mso-ansi-font-weight", "mso-ansi-language", "mso-ascii-font-family", "mso-background", "mso-background-source", "mso-baseline-position", "mso-bidi-flag", "mso-bidi-font-family", "mso-bidi-font-size", "mso-bidi-font-style", "mso-bidi-font-weight", "mso-bidi-language", "mso-bookmark", "mso-border-alt", "mso-border-between", "mso-border-between-color", "mso-border-between-style", "mso-border-between-width", "mso-border-bottom-alt", "mso-border-bottom-color-alt", "mso-border-bottom-source", "mso-border-bottom-style-alt", "mso-border-bottom-width-alt", "mso-border-color-alt", "mso-border-effect", "mso-border-left-alt", "mso-border-left-color-alt", "mso-border-left-source", "mso-border-left-style-alt", "mso-border-left-width-alt", "mso-border-right-alt", "mso-border-right-color-alt", "mso-border-right-source", "mso-border-right-style-alt", "mso-border-right-width-alt", "mso-border-shadow", "mso-border-source", "mso-border-style-alt", "mso-border-top-alt", "mso-border-top-color-alt", "mso-border-top-source", "mso-border-top-style-alt", "mso-border-top-width-alt", "mso-border-width-alt", "mso-break-type", "mso-build", "mso-build-after-action", "mso-build-after-color", "mso-build-auto-secs", "mso-build-avi", "mso-build-dual-id", "mso-build-order", "mso-build-sound-name", "mso-bullet-image", "mso-cell-special", "mso-cellspacing", "mso-char-indent", "mso-char-indent-count", "mso-char-indent-size", "mso-char-type", "mso-char-wrap", "mso-color-alt", "mso-color-index", "mso-color-source", "mso-column-break-before", "mso-column-separator", "mso-columns", "mso-comment-author", "mso-comment-continuation", "mso-comment-id", "mso-comment-reference", "mso-data-placement", "mso-default-height", "mso-default-width", "mso-diagonal-down", "mso-diagonal-down-color", "mso-diagonal-down-source", "mso-diagonal-down-style", "mso-diagonal-down-width", "mso-diagonal-up", "mso-diagonal-up-color", "mso-diagonal-up-source", "mso-diagonal-up-style", "mso-diagonal-up-width", "mso-displayed-decimal-separator", "mso-displayed-thousand-separator", "mso-element", "mso-element-anchor-horizontal", "mso-element-anchor-lock", "mso-element-anchor-vertical", "mso-element-frame-height", "mso-element-frame-hspace", "mso-element-frame-vspace", "mso-element-frame-width", "mso-element-left", "mso-element-linespan", "mso-element-top", "mso-element-wrap", "mso-endnote-continuation-notice", "mso-endnote-continuation-notice-id", "mso-endnote-continuation-notice-src", "mso-endnote-continuation-separator", "mso-endnote-continuation-separator-id", "mso-endnote-continuation-separator-src", "mso-endnote-display", "mso-endnote-id", "mso-endnote-numbering", "mso-endnote-numbering-restart", "mso-endnote-numbering-start", "mso-endnote-numbering-style", "mso-endnote-position", "mso-endnote-separator", "mso-endnote-separator-id", "mso-endnote-separator-src", "mso-even-footer", "mso-even-footer-id", "mso-even-footer-src", "mso-even-header", "mso-even-header-id", "mso-even-header-src", "mso-facing-pages", "mso-fareast-font-family", "mso-fareast-hint", "mso-fareast-language", "mso-field-change", "mso-field-change-author", "mso-field-change-time", "mso-field-change-value", "mso-field-code", "mso-field-lock", "mso-fills-color", "mso-first-footer", "mso-first-footer-id", "mso-first-footer-src", "mso-first-header", "mso-first-header-id", "mso-first-header-src", "mso-font-alt", "mso-font-charset", "mso-font-format", "mso-font-info", "mso-font-info-charset", "mso-font-info-type", "mso-font-kerning", "mso-font-pitch", "mso-font-signature", "mso-font-signature-csb-one", "mso-font-signature-csb-two", "mso-font-signature-usb-four", "mso-font-signature-usb-one", "mso-font-signature-usb-three", "mso-font-signature-usb-two", "mso-font-src", "mso-font-width", "mso-footer", "mso-footer-data", "mso-footer-id", "mso-footer-margin", "mso-footer-src", "mso-footnote-continuation-notice", "mso-footnote-continuation-notice-id", "mso-footnote-continuation-notice-src", "mso-footnote-continuation-separator", "mso-footnote-continuation-separator-id", "mso-footnote-continuation-separator-src", "mso-footnote-id", "mso-footnote-numbering", "mso-footnote-numbering-restart", "mso-footnote-numbering-start", "mso-footnote-numbering-style", "mso-footnote-position", "mso-footnote-separator", "mso-footnote-separator-id", "mso-footnote-separator-src", "mso-foreground", "mso-forms-protection", "mso-generic-font-family", "mso-grid-bottom", "mso-grid-bottom-count", "mso-grid-left", "mso-grid-left-count", "mso-grid-right", "mso-grid-right-count", "mso-grid-top", "mso-grid-top-count", "mso-gutter-direction", "mso-gutter-margin", "mso-gutter-position", "mso-hansi-font-family", "mso-header", "mso-header-data", "mso-header-id", "mso-header-margin", "mso-header-src", "mso-height-alt", "mso-height-rule", "mso-height-source", "mso-hide", "mso-highlight", "mso-horizontal-page-align", "mso-hyphenate", "mso-ignore", "mso-kinsoku-overflow", "mso-layout-grid-align", "mso-layout-grid-char-alt", "mso-layout-grid-origin", "mso-level-inherit", "mso-level-legacy", "mso-level-legacy-indent", "mso-level-legacy-space", "mso-level-legal-format", "mso-level-number-format", "mso-level-number-position", "mso-level-numbering", "mso-level-reset-level", "mso-level-start-at", "mso-level-style-link", "mso-level-suffix", "mso-level-tab-stop", "mso-level-text", "mso-line-break-override", "mso-line-grid", "mso-line-height-alt", "mso-line-height-rule", "mso-line-numbers-count-by", "mso-line-numbers-distance", "mso-line-numbers-restart", "mso-line-numbers-start", "mso-line-spacing", "mso-linked-frame", "mso-list", "mso-list-change", "mso-list-change-author", "mso-list-change-time", "mso-list-change-values", "mso-list-id", "mso-list-ins", "mso-list-ins-author", "mso-list-ins-time", "mso-list-name", "mso-list-template-ids", "mso-list-type", "mso-margin-bottom-alt", "mso-margin-left-alt", "mso-margin-top-alt", "mso-mirror-margins", "mso-negative-indent-tab", "mso-number-format", "mso-outline-level", "mso-outline-parent", "mso-outline-parent-col", "mso-outline-parent-row", "mso-outline-parent-visibility", "mso-outline-style", "mso-padding-alt", "mso-padding-between", "mso-padding-bottom-alt", "mso-padding-left-alt", "mso-padding-right-alt", "mso-padding-top-alt", "mso-page-border-aligned", "mso-page-border-art", "mso-page-border-bottom-art", "mso-page-border-display", "mso-page-border-left-art", "mso-page-border-offset-from", "mso-page-border-right-art", "mso-page-border-surround-footer", "mso-page-border-surround-header", "mso-page-border-top-art", "mso-page-border-z-order", "mso-page-numbers", "mso-page-numbers-chapter-separator", "mso-page-numbers-chapter-style", "mso-page-numbers-start", "mso-page-numbers-style", "mso-page-orientation", "mso-page-scale", "mso-pagination", "mso-panose-arm-style", "mso-panose-contrast", "mso-panose-family-type", "mso-panose-letterform", "mso-panose-midline", "mso-panose-proportion", "mso-panose-serif-style", "mso-panose-stroke-variation", "mso-panose-weight", "mso-panose-x-height", "mso-paper-source", "mso-paper-source-first-page", "mso-paper-source-other-pages", "mso-pattern", "mso-pattern-color", "mso-pattern-style", "mso-print-area", "mso-print-color", "mso-print-gridlines", "mso-print-headings", "mso-print-resolution", "mso-print-sheet-order", "mso-print-title-column", "mso-print-title-row", "mso-prop-change", "mso-prop-change-author", "mso-prop-change-time", "mso-protection", "mso-rotate", "mso-row-margin-left", "mso-row-margin-right", "mso-ruby-merge", "mso-ruby-visibility", "mso-scheme-fill-color", "mso-scheme-shadow-color", "mso-shading", "mso-shadow-color", "mso-space-above", "mso-space-below", "mso-spacerun", "mso-special-character", "mso-special-format", "mso-style-id", "mso-style-name", "mso-style-next", "mso-style-parent", "mso-style-type", "mso-style-update", "mso-subdocument", "mso-symbol-font-family", "mso-tab-count", "mso-table-anchor-horizontal", "mso-table-anchor-vertical", "mso-table-bspace", "mso-table-del-author", "mso-table-del-time", "mso-table-deleted", "mso-table-dir", "mso-table-ins-author", "mso-table-ins-time", "mso-table-inserted", "mso-table-layout-alt", "mso-table-left", "mso-table-lspace", "mso-table-overlap", "mso-table-prop-author", "mso-table-prop-change", "mso-table-prop-time", "mso-table-rspace", "mso-table-top", "mso-table-tspace", "mso-table-wrap", "mso-text-animation", "mso-text-combine-brackets", "mso-text-combine-id", "mso-text-control", "mso-text-fit-id", "mso-text-indent-alt", "mso-text-orientation", "mso-text-raise", "mso-title-page", "mso-tny-compress", "mso-unsynced", "mso-vertical-align-alt", "mso-vertical-align-special", "mso-vertical-page-align", "mso-width-alt", "mso-width-source", "mso-word-wrap", "mso-xlrowspan", "mso-zero-height", "multiple", "muted", "name", "nav-banner-image", "navbutton_background_color", "navbutton_home_hovered", "navbutton_home_normal", "navbutton_home_pushed", "navbutton_horiz_hovered", "navbutton_horiz_normal", "navbutton_horiz_pushed", "navbutton_next_hovered", "navbutton_next_normal", "navbutton_next_pushed", "navbutton_prev_hovered", "navbutton_prev_normal", "navbutton_prev_pushed", "navbutton_up_hovered", "navbutton_up_normal", "navbutton_up_pushed", "navbutton_vert_hovered", "navbutton_vert_normal", "navbutton_vert_pushed", "nohref", "noresize", "noshade", "novalidate", "nowrap", "object", "onblur", "onchange", "onclick", "ondblclick", "onfocus", "onkeydown", "onkeypress", "onkeyup", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onreset", "onselect", "onsubmit", "onunload", "open", "optimum", "overflow", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "panose-1", "pattern", "ping", "placeholder", "position", "poster", "preload", "profile", "prompt", "punctuation-trim", "punctuation-wrap", "radiogroup", "readonly", "referrerpolicy", "rel", "required", "rev", "reversed", "right", "row-span", "rows", "rowspan", "ruby-align", "ruby-overhang", "ruby-position", "rules", "sandbox", "scheme", "scope", "scoped", "scrolling", "selected", "separator-image", "shape", "size", "sizes", "slot", "span", "spellcheck", "src", "srcdoc", "srclang", "srcset", "standby", "start", "step", "style", "summary", "tab-interval", "tab-stops", "tabindex", "table-border-color-dark", "table-border-color-light", "table-layout", "target", "text", "text-align", "text-autospace", "text-combine", "text-decoration", "text-effect", "text-fit", "text-indent", "text-justify", "text-justify-trim", "text-kashida", "text-line-through", "text-shadow", "text-transform", "text-underline", "text-underline-color", "text-underline-style", "title", "top", "top-bar-button", "translate", "type", "unicode-bidi", "urlId", "usemap", "valign", "value", "valuetype", "version", "vert-align", "vertical-align", "visibility", "vlink", "vnd.ms-excel.numberformat", "vspace", "white-space", "width", "word-break", "word-spacing", "wrap", "xmlns", "z-index"]);

/**
 * @name is-char-suitable-for-html-attr-name
 * @fileoverview Is given character suitable to be in an HTML attribute's name?
 * @version 2.0.13
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
 * @version 2.2.4
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

/**
 * @name is-html-tag-opening
 * @fileoverview Does an HTML tag start at given position?
 * @version 2.0.13
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

/**
 * @name codsen-tokenizer
 * @fileoverview HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 * @version 5.5.4
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/codsen-tokenizer/}
 */

const allHTMLTagsKnownToHumanity = new Set(["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"]);
const espChars = `{}%-$_()*|#`;
const veryEspChars = `{}|#`;
const notVeryEspChars = `%()$_*#`;
const leftyChars = `({`;
const rightyChars = `})`;
const espLumpBlacklist = [")|(", "|(", ")(", "()", "}{", "{}", "%)", "*)", "||", "--"];
const punctuationChars = `.,;!?`;
const BACKTICK = "\x60";
const LEFTDOUBLEQUOTMARK = `\u201C`;
const RIGHTDOUBLEQUOTMARK = `\u201D`;
function isLatinLetter(char) {
  return !!(char && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123));
}
function charSuitableForTagName(char) {
  return /[.\-_a-z0-9\u00B7\u00C0-\uFFFD]/i.test(char);
}
function flipEspTag(str) {
  let res = "";
  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i] === "[") {
      res = `]${res}`;
    } else if (str[i] === "]") {
      res = `[${res}`;
    } else if (str[i] === "{") {
      res = `}${res}`;
    } else if (str[i] === "}") {
      res = `{${res}`;
    } else if (str[i] === "(") {
      res = `)${res}`;
    } else if (str[i] === ")") {
      res = `(${res}`;
    } else if (str[i] === "<") {
      res = `>${res}`;
    } else if (str[i] === ">") {
      res = `<${res}`;
    } else if (str[i] === LEFTDOUBLEQUOTMARK) {
      res = `${RIGHTDOUBLEQUOTMARK}${res}`;
    } else if (str[i] === RIGHTDOUBLEQUOTMARK) {
      res = `${LEFTDOUBLEQUOTMARK}${res}`;
    } else {
      res = `${str[i]}${res}`;
    }
  }
  return res;
}
function isTagNameRecognised(tagName) {
  return allHTMLTagsKnownToHumanity.has(tagName.toLowerCase()) || ["doctype", "cdata", "xml"].includes(tagName.toLowerCase());
}
function xBeforeYOnTheRight(str, startingIdx, x, y) {
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
function isObj$2(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
const voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
const inlineTags = new Set(["a", "abbr", "acronym", "audio", "b", "bdi", "bdo", "big", "br", "button", "canvas", "cite", "code", "data", "datalist", "del", "dfn", "em", "embed", "i", "iframe", "img", "input", "ins", "kbd", "label", "map", "mark", "meter", "noscript", "object", "output", "picture", "progress", "q", "ruby", "s", "samp", "script", "select", "slot", "small", "span", "strong", "sub", "sup", "svg", "template", "textarea", "time", "u", "tt", "var", "video", "wbr"]);
const charsThatEndCSSChunks = ["{", "}", ","];
const SOMEQUOTE = `'"${LEFTDOUBLEQUOTMARK}${RIGHTDOUBLEQUOTMARK}`;
const attrNameRegexp = /[\w-]/;

function getLastEspLayerObjIdx(layers) {
  if (layers && layers.length) {
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
  const lastEspLayerObj = layers[getLastEspLayerObjIdx(layers)];
  for (let y = i + 1; y < len; y++) {
    if (leftyChars.includes(str[y]) && rightyChars.includes(str[y - 1])) {
      break;
    }
    if (
    wholeEspTagLumpOnTheRight.length > 1 && (
    wholeEspTagLumpOnTheRight.includes(`<`) || wholeEspTagLumpOnTheRight.includes(`{`) || wholeEspTagLumpOnTheRight.includes(`[`) || wholeEspTagLumpOnTheRight.includes(`(`)) &&
    str[y] === "(") {
      break;
    }
    if (espChars.includes(str[y]) ||
    lastEspLayerObj && lastEspLayerObj.guessedClosingLump.includes(str[y]) || str[i] === "<" && str[y] === "/" ||
    str[y] === ">" && wholeEspTagLumpOnTheRight === "--" && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-" ||
    !lastEspLayerObj && y > i && `!=@`.includes(str[y])) {
      wholeEspTagLumpOnTheRight += str[y];
    } else {
      break;
    }
  }
  if (wholeEspTagLumpOnTheRight && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].guessedClosingLump && wholeEspTagLumpOnTheRight.length > layers[layers.length - 1].guessedClosingLump.length) {
    if (wholeEspTagLumpOnTheRight.endsWith(layers[layers.length - 1].openingLump)) {
      return wholeEspTagLumpOnTheRight.slice(0, wholeEspTagLumpOnTheRight.length - layers[layers.length - 1].openingLump.length);
    }
    let uniqueCharsListFromGuessedClosingLumpArr = new Set(layers[layers.length - 1].guessedClosingLump);
    let found = 0;
    for (let y = 0, len2 = wholeEspTagLumpOnTheRight.length; y < len2; y++) {
      if (!uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLumpOnTheRight[y]) && found > 1) {
        return wholeEspTagLumpOnTheRight.slice(0, y);
      }
      if (uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLumpOnTheRight[y])) {
        found += 1;
        uniqueCharsListFromGuessedClosingLumpArr = new Set([...uniqueCharsListFromGuessedClosingLumpArr].filter(el => el !== wholeEspTagLumpOnTheRight[y]));
      }
    }
  }
  return wholeEspTagLumpOnTheRight;
}

function startsHtmlComment(str, i, token, layers) {
  return !!(
  str[i] === "<" && (matchRight(str, i, ["!--"], {
    maxMismatches: 1,
    firstMustMatch: true,
    trimBeforeMatching: true
  }) || matchRightIncl(str, i, ["<![endif]"], {
    i: true,
    maxMismatches: 2,
    trimBeforeMatching: true
  })) && !matchRight(str, i, ["![cdata", "<"], {
    i: true,
    maxMismatches: 1,
    trimBeforeMatching: true
  }) && (token.type !== "comment" || token.kind !== "not") || str[i] === "-" && matchRightIncl(str, i, ["-->"], {
    trimBeforeMatching: true
  }) && (token.type !== "comment" || !token.closing && token.kind !== "not") && !matchLeft(str, i, "<", {
    trimBeforeMatching: true,
    trimCharsBeforeMatching: ["-", "!"]
  }) && (
  !Array.isArray(layers) || !layers.length || layers[layers.length - 1].type !== "esp" || !(layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-")));
}

function startsCssComment(str, i, _token, _layers, withinStyle) {
  return (
    withinStyle && (
    str[i] === "/" && str[i + 1] === "*" ||
    str[i] === "*" && str[i + 1] === "/")
  );
}

function matchLayerLast(wholeEspTagLump, layers, matchFirstInstead = false) {
  if (!layers.length) {
    return;
  }
  const whichLayerToMatch = matchFirstInstead ? layers[0] : layers[layers.length - 1];
  if (whichLayerToMatch.type !== "esp") {
    return;
  }
  if (
  wholeEspTagLump.includes(whichLayerToMatch.guessedClosingLump) ||
  Array.from(wholeEspTagLump).every(char => whichLayerToMatch.guessedClosingLump.includes(char)) ||
  whichLayerToMatch.guessedClosingLump &&
  whichLayerToMatch.guessedClosingLump.length > 2 &&
  whichLayerToMatch.guessedClosingLump[whichLayerToMatch.guessedClosingLump.length - 1] === wholeEspTagLump[wholeEspTagLump.length - 1] && whichLayerToMatch.guessedClosingLump[whichLayerToMatch.guessedClosingLump.length - 2] === wholeEspTagLump[wholeEspTagLump.length - 2]) {
    return wholeEspTagLump.length;
  }
}

const BACKSLASH = "\u005C";
function startsTag(str, i, token, layers, withinStyle, leftVal, rightVal) {
  return !!(str[i] && str[i].trim().length && (!layers.length || token.type === "text") && (!token.kind || !["doctype", "xml"].includes(token.kind)) && (
  !withinStyle || str[i] === "<") && (str[i] === "<" && (isOpening(str, i, {
    allowCustomTagNames: true
  }) || str[rightVal] === ">" || matchRight(str, i, ["doctype", "xml", "cdata"], {
    i: true,
    trimBeforeMatching: true,
    trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
  })) ||
  str[i] === "/" && isLatinLetter(str[i + 1]) && str[leftVal] !== "<" && isOpening(str, i, {
    allowCustomTagNames: true,
    skipOpeningBracket: true
  }) || isLatinLetter(str[i]) && (!str[i - 1] || !isLatinLetter(str[i - 1]) && !["<", "/", "!", BACKSLASH].includes(str[leftVal])) && isOpening(str, i, {
    allowCustomTagNames: false,
    skipOpeningBracket: true
  })) && (token.type !== "esp" || token.tail && token.tail.includes(str[i])));
}

function startsEsp(str, i, token, layers, withinStyle) {
  const res =
  espChars.includes(str[i]) && str[i + 1] && espChars.includes(str[i + 1]) &&
  !(notVeryEspChars.includes(str[i]) && notVeryEspChars.includes(str[i + 1])) && (
  str[i] !== str[i + 1] || veryEspChars.includes(str[i])) && token.type !== "rule" && token.type !== "at" && !(str[i] === "-" && "-{(".includes(str[i + 1])) && !("})".includes(str[i]) && "-".includes(str[i + 1])) && !(
  str[i] === "%" && str[i + 1] === "%" && "0123456789".includes(str[i - 1]) && (!str[i + 2] || punctuationChars.includes(str[i + 2]) || !str[i + 2].trim().length)) && !(withinStyle && ("{}".includes(str[i]) || "{}".includes(str[right(str, i)]))) ||
  str[i] === "<" && (
  str[i + 1] === "/" && espChars.includes(str[i + 2]) ||
  espChars.includes(str[i + 1]) &&
  !["-"].includes(str[i + 1])) ||
  str[i] === "<" && (
  str[i + 1] === "%" ||
  str.startsWith("jsp:", i + 1) ||
  str.startsWith("cms:", i + 1) ||
  str.startsWith("c:", i + 1)) || str.startsWith("${jspProp", i) ||
  `>})`.includes(str[i]) &&
  Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump.includes(flipEspTag(str[i])) && (
  str[i] !== ">" || !xBeforeYOnTheRight(str, i + 1, ">", "<")) ||
  str[i] === "-" && str[i + 1] === "-" && str[i + 2] === ">" && Array.isArray(layers) && layers.length && layers[layers.length - 1].type === "esp" && layers[layers.length - 1].openingLump[0] === "<" && layers[layers.length - 1].openingLump[2] === "-" && layers[layers.length - 1].openingLump[3] === "-";
  return !!res;
}
const importantStartsRegexp = /^\s*!?\s*[a-zA-Z0-9]+(?:[\s;}<>'"]|$)/gm;
const defaults$5 = {
  tagCb: null,
  tagCbLookahead: 0,
  charCb: null,
  charCbLookahead: 0,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
function tokenizer(str, originalOpts) {
  const start = Date.now();
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error(`codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(str, null, 4)}`);
    }
  }
  if (originalOpts && !isObj$2(originalOpts)) {
    throw new Error(`codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(originalOpts, null, 4)}`);
  }
  if (originalOpts && isObj$2(originalOpts) && originalOpts.tagCb && typeof originalOpts.tagCb !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ${typeof originalOpts.tagCb}, equal to ${JSON.stringify(originalOpts.tagCb, null, 4)}`);
  }
  if (originalOpts && isObj$2(originalOpts) && originalOpts.charCb && typeof originalOpts.charCb !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ${typeof originalOpts.charCb}, equal to ${JSON.stringify(originalOpts.charCb, null, 4)}`);
  }
  if (originalOpts && isObj$2(originalOpts) && originalOpts.reportProgressFunc && typeof originalOpts.reportProgressFunc !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ${typeof originalOpts.reportProgressFunc}, equal to ${JSON.stringify(originalOpts.reportProgressFunc, null, 4)}`);
  }
  const opts = { ...defaults$5,
    ...originalOpts
  };
  let currentPercentageDone = 0;
  let lastPercentage = 0;
  const len = str.length;
  const midLen = Math.floor(len / 2);
  let doNothing = 0;
  let withinScript = false;
  let withinStyle = false;
  let withinStyleComment = false;
  const tagStash = [];
  const charStash = [];
  let token = {};
  function tokenReset() {
    token = {
      type: null,
      start: null,
      end: null,
      value: null
    };
    attribReset();
  }
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
    attribLeft: null
  };
  let attrib = { ...attribDefaults
  };
  function attribReset() {
    attrib = lodash_clonedeep(attribDefaults);
  }
  function attribPush(tokenObj) {
    /* istanbul ignore else */
    if (attrib.attribValue.length && attrib.attribValue[~-attrib.attribValue.length].start && !attrib.attribValue[~-attrib.attribValue.length].end) {
      attrib.attribValue[~-attrib.attribValue.length].end = tokenObj.start;
      attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, tokenObj.start);
    }
    attrib.attribValue.push(tokenObj);
  }
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
    semi: null
  };
  let property = { ...propertyDefault
  };
  function propertyReset() {
    property = { ...propertyDefault
    };
  }
  function pushProperty(p) {
    if (attrib && attrib.attribName === "style") {
      attrib.attribValue.push({ ...p
      });
    } else if (token && Array.isArray(token.properties)) {
      token.properties.push({ ...p
      });
    }
  }
  tokenReset();
  let selectorChunkStartedAt;
  let parentTokenToBackup;
  let attribToBackup;
  let lastNonWhitespaceCharAt = null;
  const layers = [];
  function lastLayerIs(something) {
    return !!(Array.isArray(layers) && layers.length && layers[~-layers.length].type === something);
  }
  function closingComment(i) {
    const end = (right(str, i) || i) + 1;
    attribPush({
      type: "comment",
      start: i,
      end,
      value: str.slice(i, end),
      closing: true,
      kind: "block",
      language: "css"
    });
    doNothing = end;
    if (lastLayerIs("block")) {
      layers.pop();
    }
  }
  function reportFirstFromStash(stash, cb, lookaheadLength) {
    const currentElem = stash.shift();
    const next = [];
    for (let i = 0; i < lookaheadLength; i++) {
      if (stash[i]) {
        next.push(lodash_clonedeep(stash[i]));
      } else {
        break;
      }
    }
    if (typeof cb === "function") {
      cb(currentElem, next);
    }
  }
  function pingCharCb(incomingToken) {
    if (opts.charCb) {
      charStash.push(incomingToken);
      if (charStash.length > opts.charCbLookahead) {
        reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
      }
    }
  }
  function pingTagCb(incomingToken) {
    if (opts.tagCb) {
      tagStash.push(incomingToken);
      if (tagStash.length > opts.tagCbLookahead) {
        reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
      }
    }
  }
  function dumpCurrentToken(incomingToken, i) {
    if (!["text", "esp"].includes(incomingToken.type) && incomingToken.start !== null && incomingToken.start < i && (str[~-i] && !str[~-i].trim() || str[i] === "<")) {
      if (left(str, i) !== null) {
        incomingToken.end = left(str, i) + 1;
      } else {
        incomingToken.end = i;
      }
      incomingToken.value = str.slice(incomingToken.start, incomingToken.end);
      if (incomingToken.type === "tag" && !"/>".includes(str[~-incomingToken.end])) {
        let cutOffIndex = incomingToken.tagNameEndsAt || i;
        if (Array.isArray(incomingToken.attribs) && incomingToken.attribs.length) {
          for (let i2 = 0, len2 = incomingToken.attribs.length; i2 < len2; i2++) {
            if (incomingToken.attribs[i2].attribNameRecognised && incomingToken.attribs[i2].attribEnds) {
              cutOffIndex = incomingToken.attribs[i2].attribEnds;
              if (str[cutOffIndex + 1] && !str[cutOffIndex].trim() && str[cutOffIndex + 1].trim()) {
                cutOffIndex += 1;
              }
            } else {
              if (i2 === 0) {
                incomingToken.attribs = [];
              } else {
                incomingToken.attribs = incomingToken.attribs.splice(0, i2);
              }
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
        tokenReset();
        if (str[~-i] && !str[~-i].trim()) {
          initToken("text", left(str, i) + 1);
        }
      }
    }
    if (token.start !== null) {
      if (token.end === null && token.start !== i) {
        token.end = i;
        token.value = str.slice(token.start, token.end);
      }
      if (token.start !== null && token.end) {
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
    return lastLayerIs("at") && isObj$2(layers[~-layers.length].token) && layers[~-layers.length].token.openingCurlyAt && !layers[~-layers.length].token.closingCurlyAt;
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
        attribs: []
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
        language: "html"
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
        properties: []
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
        rules: []
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
        tailEndsAt: null
      };
    }
    return {
      type: "text",
      start: startVal,
      end: null,
      value: null
    };
  }
  function initToken(type, startVal) {
    attribReset();
    token = getNewToken(type, startVal);
  }
  function initProperty(propertyStarts) {
    propertyReset();
    if (typeof propertyStarts === "number") {
      property.propertyStarts = propertyStarts;
      property.start = propertyStarts;
    } else {
      property = { ...propertyDefault,
        ...propertyStarts
      };
    }
  }
  function ifQuoteThenAttrClosingQuote(idx) {
    return !`'"`.includes(str[idx]) ||
    !(attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt) ||
    isAttrClosing(str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, idx);
  }
  function attrEndsAt(idx) {
    return `;}/`.includes(str[idx]) && (!attrib || !attrib.attribName || attrib.attribName !== "style") ||
    `/;'"><`.includes(str[idx]) && attrib && attrib.attribName === "style" &&
    ifQuoteThenAttrClosingQuote(idx);
  }
  for (let i = 0; i <= len; i++) {
    if (!doNothing && str[i] && opts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (i === midLen) {
          opts.reportProgressFunc(Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2));
        }
      } else if (len >= 2000) {
        currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(i / len * (opts.reportProgressFuncTo - opts.reportProgressFuncFrom));
        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
      }
    }
    const leftVal = left(str, i);
    const rightVal = right(str, i);
    if (withinStyle && token.type && !["rule", "at", "text", "comment"].includes(token.type)) {
      withinStyle = false;
    }
    if (doNothing && i >= doNothing) {
      doNothing = 0;
    }
    if (isLatinLetter(str[i]) && isLatinLetter(str[~-i]) && isLatinLetter(str[i + 1])) {
      if (property && property.valueStarts && !property.valueEnds && !property.importantStarts && str.startsWith("important", i)) {
        property.valueEnds = i;
        property.value = str.slice(property.valueStarts, i);
        property.importantStarts = i;
      }
      continue;
    }
    if (` \t\r\n`.includes(str[i]) &&
    str[i] === str[~-i] && str[i] === str[i + 1]) {
      continue;
    }
    if (!doNothing && atRuleWaitingForClosingCurlie()) {
      if (str[i] === "}") {
        if (!token.type || token.type === "text" || token.type === "rule" && token.openingCurlyAt === null) {
          if (token.type === "rule") {
            token.end = leftVal + 1;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token);
            if (lastLayerIs("at")) {
              layers[~-layers.length].token.rules.push(token);
            }
            tokenReset();
            if (leftVal !== null && leftVal < ~-i) {
              initToken("text", leftVal + 1);
            }
          }
          dumpCurrentToken(token, i);
          const poppedToken = layers.pop();
          token = poppedToken.token;
          token.closingCurlyAt = i;
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
          pingTagCb(token);
          if (lastLayerIs("at")) {
            layers[~-layers.length].token.rules.push(token);
          }
          tokenReset();
          doNothing = i + 1;
        }
      } else if (token.type === "text" && str[i] && str[i].trim()) {
        token.end = i;
        token.value = str.slice(token.start, token.end);
        if (lastLayerIs("at")) {
          layers[~-layers.length].token.rules.push(token);
        } else {
          pingTagCb(token);
        }
        tokenReset();
      }
    }
    if (token.end && token.end === i) {
      if (token.tagName === "style" && !token.closing) {
        withinStyle = true;
      }
      if (attribToBackup) {
        attrib = attribToBackup;
        attrib.attribValue.push(token);
        token = lodash_clonedeep(parentTokenToBackup);
        attribToBackup = undefined;
        parentTokenToBackup = undefined;
      } else {
        dumpCurrentToken(token, i);
        layers.length = 0;
      }
    }
    if (!doNothing) {
      if (["tag", "at"].includes(token.type) && token.kind !== "cdata") {
        if (str[i] && (SOMEQUOTE.includes(str[i]) || `()`.includes(str[i])) && !(
        SOMEQUOTE.includes(str[leftVal]) && str[leftVal] === str[rightVal]) &&
        ifQuoteThenAttrClosingQuote(i)
        ) {
            if (
            lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[i])) {
              layers.pop();
            } else {
              layers.push({
                type: "simple",
                value: str[i],
                position: i
              });
            }
          }
      } else if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
        if ([`[`, `]`].includes(str[i])) {
          if (
          lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[i])) {
            layers.pop();
          } else {
            layers.push({
              type: "simple",
              value: str[i],
              position: i
            });
          }
        }
      } else if (token.type === "esp" && `'"${BACKTICK}()`.includes(str[i]) && !(
      [`"`, `'`, "`"].includes(str[leftVal]) && str[leftVal] === str[rightVal])) {
        if (
        lastLayerIs("simple") && layers[~-layers.length].value === flipEspTag(str[i])) {
          layers.pop();
          doNothing = i + 1;
        } else if (!`]})>`.includes(str[i])) {
          layers.push({
            type: "simple",
            value: str[i],
            position: i
          });
        }
      }
    }
    if (!doNothing && token.type === "at" && token.start != null && i >= token.start && !token.identifierStartsAt && str[i] && str[i].trim() && str[i] !== "@") {
      token.identifierStartsAt = i;
    }
    if (!doNothing && token.type === "at" && token.queryStartsAt && !token.queryEndsAt && `{;`.includes(str[i])) {
      if (str[i] === "{") {
        if (str[~-i] && str[~-i].trim()) {
          token.queryEndsAt = i;
        } else {
          token.queryEndsAt = leftVal !== null ? leftVal + 1 : i;
        }
      } else {
        token.queryEndsAt = left(str, i + 1) || 0;
      }
      if (token.queryStartsAt && token.queryEndsAt) {
        token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
      }
      token.end = str[i] === ";" ? i + 1 : i;
      token.value = str.slice(token.start, token.end);
      if (str[i] === ";") {
        pingTagCb(token);
      } else {
        token.openingCurlyAt = i;
        layers.push({
          type: "at",
          token
        });
      }
      tokenReset();
      doNothing = i + 1;
    }
    if (!doNothing && token.type === "at" && token.identifier && str[i] && str[i].trim() && !token.queryStartsAt) {
      token.queryStartsAt = i;
    }
    if (!doNothing && token && token.type === "at" && token.identifierStartsAt && i >= token.start && str[i] && (!str[i].trim() || "()".includes(str[i])) && !token.identifierEndsAt) {
      token.identifierEndsAt = i;
      token.identifier = str.slice(token.identifierStartsAt, i);
    }
    if (token.type === "rule") {
      if (selectorChunkStartedAt && (charsThatEndCSSChunks.includes(str[i]) || str[i] && rightVal && !str[i].trim() && charsThatEndCSSChunks.includes(str[rightVal]))) {
        token.selectors.push({
          value: str.slice(selectorChunkStartedAt, i),
          selectorStarts: selectorChunkStartedAt,
          selectorEnds: i
        });
        selectorChunkStartedAt = undefined;
        token.selectorsEnd = i;
      } else if (str[i] === "{" && str[i - 1] !== "{" &&
      str[i + 1] !== "{" &&
      token.openingCurlyAt && !token.closingCurlyAt) {
        for (let y = i; y--;) {
          if (!str[y].trim() || `{}"';`.includes(str[y])) {
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
    const lastEspLayerObjIdx = getLastEspLayerObjIdx(layers);
    if (!doNothing && str[i]) {
      if (startsTag(str, i, token, layers, withinStyle, leftVal, rightVal)) {
        if (token.type && token.start !== null) {
          if (token.type === "rule") {
            if (property && property.start) {
              if (property.importantStarts && !property.importantEnds) {
                property.importantEnds = i;
                property.important = str.slice(property.importantStarts, i);
              }
              if (property.propertyStarts && !property.propertyEnds) {
                property.propertyEnds = i;
                if (!property.property) {
                  property.property = str.slice(property.propertyStarts, i);
                }
              }
              if (!property.end) {
                property.end = i;
              }
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
        initToken("tag", i);
        if (withinStyle) {
          withinStyle = false;
        }
        const badCharacters = `?![-/`;
        let extractedTagName = "";
        let letterMet = false;
        if (rightVal) {
          for (let y = rightVal; y < len; y++) {
            if (!letterMet && str[y] && str[y].trim() && str[y].toUpperCase() !== str[y].toLowerCase()) {
              letterMet = true;
            }
            if (
            letterMet && str[y] && (
            !str[y].trim() ||
            !/\w/.test(str[y]) && !badCharacters.includes(str[y]) || str[y] === "[")
            ) {
                break;
              } else if (!badCharacters.includes(str[y])) {
              extractedTagName += str[y].trim().toLowerCase();
            }
          }
        }
        if (extractedTagName === "doctype") {
          token.kind = "doctype";
        } else if (extractedTagName === "cdata") {
          token.kind = "cdata";
        } else if (extractedTagName === "xml") {
          token.kind = "xml";
        } else if (inlineTags.has(extractedTagName)) {
          token.kind = "inline";
          if (extractedTagName) {
            doNothing = i;
          }
        }
      } else if (!withinScript && startsHtmlComment(str, i, token, layers)) {
        if (token.start != null) {
          dumpCurrentToken(token, i);
        }
        initToken("comment", i);
        if (str[i] === "-") {
          token.closing = true;
        } else if (matchRightIncl(str, i, ["<![endif]-->"], {
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
      } else if (!withinScript && startsCssComment(str, i, token, layers, withinStyle)) {
        if (token.start != null) {
          dumpCurrentToken(token, i);
        }
        initToken("comment", i);
        token.language = "css";
        token.kind = str[i] === "/" && str[i + 1] === "/" ? "line" : "block";
        token.value = str.slice(i, i + 2);
        token.end = i + 2;
        token.closing = str[i] === "*" && str[i + 1] === "/";
        withinStyleComment = true;
        if (token.closing) {
          withinStyleComment = false;
        }
        doNothing = i + 2;
      } else if (!withinScript && (
      typeof lastEspLayerObjIdx === "number" && layers[lastEspLayerObjIdx] && layers[lastEspLayerObjIdx].type === "esp" && layers[lastEspLayerObjIdx].openingLump && layers[lastEspLayerObjIdx].guessedClosingLump && layers[lastEspLayerObjIdx].guessedClosingLump.length > 1 &&
      layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[i]) &&
      layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[i + 1]) &&
      !(
      layers[lastEspLayerObjIdx + 1] &&
      `'"`.includes(layers[lastEspLayerObjIdx + 1].value) &&
      str.indexOf(layers[lastEspLayerObjIdx + 1].value, i) > 0 && layers[lastEspLayerObjIdx].guessedClosingLump.includes(str[right(str, str.indexOf(layers[lastEspLayerObjIdx + 1].value, i))])) ||
      startsEsp(str, i, token, layers, withinStyle) && (
      !lastLayerIs("simple") || ![`'`, `"`].includes(layers[~-layers.length].value) ||
      attrib && attrib.attribStarts && !attrib.attribEnds))) {
        const wholeEspTagLumpOnTheRight = getWholeEspTagLumpOnTheRight(str, i, layers);
        if (!espLumpBlacklist.includes(wholeEspTagLumpOnTheRight)) {
          let lengthOfClosingEspChunk;
          let disposableVar;
          if (layers.length && (
          lengthOfClosingEspChunk = matchLayerLast(wholeEspTagLumpOnTheRight, layers))) {
            if (token.type === "esp") {
              if (!token.end) {
                token.end = i + lengthOfClosingEspChunk;
                token.value = str.slice(token.start, token.end);
                token.tail = str.slice(i, i + lengthOfClosingEspChunk);
                token.tailStartsAt = i;
                token.tailEndsAt = token.end;
                if (str[i] === ">" && str[leftVal] === "/") {
                  token.tailStartsAt = leftVal;
                  token.tail = str.slice(token.tailStartsAt, i + 1);
                }
              }
              doNothing = token.tailEndsAt;
              if (parentTokenToBackup) {
                if (!Array.isArray(parentTokenToBackup.attribs)) {
                  parentTokenToBackup.attribs = [];
                }
                if (attribToBackup) {
                  attrib = attribToBackup;
                  attrib.attribValue.push({ ...token
                  });
                } else {
                  parentTokenToBackup.attribs.push({ ...token
                  });
                }
                token = lodash_clonedeep(parentTokenToBackup);
                parentTokenToBackup = undefined;
                attribToBackup = undefined;
                layers.pop();
                continue;
              } else {
                dumpCurrentToken(token, i);
              }
              tokenReset();
            }
            layers.pop();
          } else if (layers.length && (
          lengthOfClosingEspChunk = matchLayerLast(wholeEspTagLumpOnTheRight, layers, true))) {
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
            layers.length = 0;
          } else if (
          attrib && attrib.attribValue && attrib.attribValue.length && attrib.attribValue[~-attrib.attribValue.length].start && Array.from(str.slice(attrib.attribValue[~-attrib.attribValue.length].start, i)).some((char, idx) => wholeEspTagLumpOnTheRight.includes(flipEspTag(char)) && (
          veryEspChars.includes(char) ||
          !idx) && (disposableVar = {
            char,
            idx
          })) &&
          token.type === "tag" && attrib && attrib.attribValueStartsAt && !attrib.attribValueEndsAt &&
          attrib.attribValue[~-attrib.attribValue.length] && attrib.attribValue[~-attrib.attribValue.length].type === "text") {
            token.pureHTML = false;
            const lastAttrValueObj = attrib.attribValue[~-attrib.attribValue.length];
            const newTokenToPutInstead = getNewToken("esp", lastAttrValueObj.start);
            if (!disposableVar || !disposableVar.idx) {
              newTokenToPutInstead.head = disposableVar.char;
              newTokenToPutInstead.headStartsAt = lastAttrValueObj.start;
              newTokenToPutInstead.headEndsAt = newTokenToPutInstead.headStartsAt + 1;
              newTokenToPutInstead.tailStartsAt = i;
              newTokenToPutInstead.tailEndsAt = i + wholeEspTagLumpOnTheRight.length;
              newTokenToPutInstead.tail = wholeEspTagLumpOnTheRight;
              attrib.attribValue[~-attrib.attribValue.length] = newTokenToPutInstead;
            }
          } else {
            if (lastLayerIs("esp")) {
              layers.pop();
            }
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
              position: i
            });
            if (token.start !== null) {
              if (token.type === "tag") {
                if (token.tagNameStartsAt && (!token.tagName || !token.tagNameEndsAt)) {
                  token.tagNameEndsAt = i;
                  token.tagName = str.slice(token.tagNameStartsAt, i);
                  token.recognised = isTagNameRecognised(token.tagName);
                }
                parentTokenToBackup = lodash_clonedeep(token);
                if (attrib.attribStarts && !attrib.attribEnds) {
                  attribToBackup = lodash_clonedeep(attrib);
                }
              } else if (!attribToBackup) {
                dumpCurrentToken(token, i);
              } else if (attribToBackup && Array.isArray(attribToBackup.attribValue) && attribToBackup.attribValue.length && attribToBackup.attribValue[~-attribToBackup.attribValue.length].type === "esp" && !attribToBackup.attribValue[~-attribToBackup.attribValue.length].end) {
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].end = i;
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].value = str.slice(attribToBackup.attribValue[~-attribToBackup.attribValue.length].start, i);
              }
            }
            initToken("esp", i);
            token.head = wholeEspTagLumpOnTheRight;
            token.headStartsAt = i;
            token.headEndsAt = i + wholeEspTagLumpOnTheRight.length;
            if (parentTokenToBackup && parentTokenToBackup.pureHTML) {
              parentTokenToBackup.pureHTML = false;
            }
            if (attribToBackup && Array.isArray(attribToBackup.attribValue) && attribToBackup.attribValue.length) {
              if (attribToBackup.attribValue[~-attribToBackup.attribValue.length].start === token.start) {
                attribToBackup.attribValue.pop();
              } else if (
              attribToBackup.attribValue[~-attribToBackup.attribValue.length].type === "text" && !attribToBackup.attribValue[~-attribToBackup.attribValue.length].end) {
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].end = i;
                attribToBackup.attribValue[~-attribToBackup.attribValue.length].value = str.slice(attribToBackup.attribValue[~-attribToBackup.attribValue.length].start, i);
              }
            }
          }
          doNothing = i + (lengthOfClosingEspChunk || wholeEspTagLumpOnTheRight.length);
        }
      } else if (!withinScript && withinStyle && !withinStyleComment && str[i] && str[i].trim() &&
      !`{}`.includes(str[i]) && (
      !token.type ||
      ["text"].includes(token.type))) {
        if (token.type) {
          dumpCurrentToken(token, i);
        }
        initToken(str[i] === "@" ? "at" : "rule", i);
        token.left = lastNonWhitespaceCharAt;
        token.nested = layers.some(o => o.type === "at");
      } else if (!token.type) {
        initToken("text", i);
        if (withinScript && str.indexOf("</script>", i)) {
          doNothing = str.indexOf("</script>", i);
        } else {
          doNothing = i;
        }
      }
    }
    let R1;
    let R2;
    if (!doNothing && (property.start || str[i] === "!")) {
      const idxRightIncl = right(str, i - 1);
      R1 = `;<>`.includes(str[idxRightIncl]) ||
      str[idxRightIncl] === `{` && str[i - 1] !== `{` || str[idxRightIncl] === `}` && str[i - 1] !== `}` ||
      `'"`.includes(str[idxRightIncl]) && (
      !layers ||
      !layers.length ||
      !layers[~-layers.length] ||
      !layers[~-layers.length].value ||
      layers[~-layers.length].value === str[idxRightIncl]);
      R2 = matchRightIncl(str, i, ["!important"], {
        i: true,
        trimBeforeMatching: true,
        maxMismatches: 2
      });
    }
    /* istanbul ignore else */
    if (!doNothing && property && (property.semi && property.semi < i && property.semi < i || (property.valueStarts && !property.valueEnds && str[rightVal] !== "!" && (
    !rightVal ||
    R1) || property.importantStarts && !property.importantEnds) && (!property.valueEnds || str[rightVal] !== ";") && (
    !str[i] ||
    !str[i].trim() ||
    !property.valueEnds && str[i] === ";" ||
    attrEndsAt(i)))) {
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
      } else if (str[rightVal] === ";") {
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
    /* istanbul ignore else */
    if (!doNothing &&
    property && property.valueStarts && !property.valueEnds) {
      if (
      !str[i] ||
      R1 ||
      R2 || str[right(str, i - 1)] === "!" ||
      `;}`.includes(str[i]) && (!attrib || !attrib.attribName || attrib.attribName !== "style") ||
      `;'"`.includes(str[i]) && attrib && attrib.attribName === "style" &&
      ifQuoteThenAttrClosingQuote(i) ||
      rightVal && !str[i].trim() && (str.slice(i, rightVal).includes("\n") || str.slice(i, rightVal).includes("\r"))) {
        if (lastNonWhitespaceCharAt && (
        !`'"`.includes(str[i]) ||
        !rightVal ||
        !`'";`.includes(str[rightVal]))) {
          property.valueEnds = lastNonWhitespaceCharAt + 1;
          property.value = str.slice(property.valueStarts, lastNonWhitespaceCharAt + 1);
        }
        if (str[i] === ";") {
          property.semi = i;
        } else if (
        str[i] && !str[i].trim() &&
        str[rightVal] === ";") {
          property.semi = rightVal;
        }
        if (
        property.semi) {
          property.end = property.semi + 1;
        }
        if (
        !property.semi &&
        !R1 &&
        !R2 && str[right(str, i - 1)] !== "!" &&
        !property.end) {
          property.end = i;
        }
        if (property.end) {
          if (property.end > i) {
            doNothing = property.end;
          }
          pushProperty(property);
          propertyReset();
        }
      } else if (str[i] === ":" && property && property.colon && property.colon < i && lastNonWhitespaceCharAt && property.colon + 1 < lastNonWhitespaceCharAt) {
        let split = [];
        if (right(str, property.colon)) {
          split = str.slice(right(str, property.colon), lastNonWhitespaceCharAt + 1).split(/\s+/);
        }
        if (split.length === 2) {
          property.valueEnds = property.valueStarts + split[0].length;
          property.value = str.slice(property.valueStarts, property.valueEnds);
          property.end = property.valueEnds;
          pushProperty(property);
          const whitespaceStarts = property.end;
          const newPropertyStarts = lastNonWhitespaceCharAt + 1 - split[1].length;
          propertyReset();
          pushProperty({
            type: "text",
            start: whitespaceStarts,
            end: newPropertyStarts,
            value: str.slice(whitespaceStarts, newPropertyStarts)
          });
          property.start = newPropertyStarts;
          property.propertyStarts = newPropertyStarts;
        }
      } else if (str[i] === "/" && str[rightVal] === "*") {
        /* istanbul ignore else */
        if (property.valueStarts && !property.valueEnds) {
          property.valueEnds = i;
          property.value = str.slice(property.valueStarts, i);
        }
        /* istanbul ignore else */
        if (!property.end) {
          property.end = i;
        }
        pushProperty(property);
        propertyReset();
      }
    }
    if (!doNothing && property && property.start && !property.end && str[i] === ";") {
      property.semi = i;
      property.end = i + 1;
      if (!property.propertyEnds) {
        property.propertyEnds = i;
      }
      if (property.propertyStarts && property.propertyEnds && !property.property) {
        property.property = str.slice(property.propertyStarts, property.propertyEnds);
      }
      pushProperty(property);
      propertyReset();
      doNothing = i;
    }
    /* istanbul ignore else */
    if (property && property.importantStarts && !property.importantEnds && str[i] && !str[i].trim()) {
      property.importantEnds = i;
      property.important = str.slice(property.importantStarts, i);
    }
    /* istanbul ignore else */
    if (!doNothing && property && property.valueEnds && !property.importantStarts && (
    str[i] === "!" ||
    isLatinLetter(str[i]) && str.slice(i).match(importantStartsRegexp))) {
      property.importantStarts = i;
      if (
      str[i - 1] && str[i - 1].trim() &&
      str[i - 2] && !str[i - 2].trim() ||
      str[i - 1] === "1" &&
      str[i - 2] && !/\d/.test(str[i - 2])) {
        property.valueEnds = left(str, i - 1) + 1;
        property.value = str.slice(property.valueStarts, property.valueEnds);
        property.importantStarts--;
        property.important = str[i - 1] + property.important;
      }
    }
    /* istanbul ignore else */
    if (!doNothing && property && property.colon && !property.valueStarts && str[i] && str[i].trim()) {
      /* istanbul ignore else */
      if (
      `;}'"`.includes(str[i]) &&
      ifQuoteThenAttrClosingQuote(i)) {
        /* istanbul ignore else */
        if (str[i] === ";") {
          property.semi = i;
        }
        let temp;
        /* istanbul ignore else */
        if (!property.end) {
          property.end = property.semi ? property.semi + 1 : left(str, i) + 1;
          temp = property.end;
        }
        pushProperty(property);
        propertyReset();
        /* istanbul ignore else */
        if (temp && temp < i) {
          pushProperty({
            type: "text",
            start: temp,
            end: i,
            value: str.slice(temp, i)
          });
        }
      } else if (str[i] === "!") {
        property.importantStarts = i;
      } else {
        property.valueStarts = i;
      }
    }
    if (!doNothing && str[i] === "{" && str[i + 1] === "{" && property && property.valueStarts && !property.valueEnds && str.indexOf("}}", i) > 0) {
      doNothing = str.indexOf("}}") + 2;
    }
    if (!doNothing && token.type === "rule" && str[i] && str[i].trim() && !"{}".includes(str[i]) && !selectorChunkStartedAt && !token.openingCurlyAt) {
      if (!",".includes(str[i])) {
        selectorChunkStartedAt = i;
        if (token.selectorsStart === null) {
          token.selectorsStart = i;
        }
      } else {
        token.selectorsEnd = i + 1;
      }
    }
    if (!doNothing &&
    property && property.propertyStarts && property.propertyStarts < i && !property.propertyEnds && (
    !str[i] ||
    !str[i].trim() ||
    !attrNameRegexp.test(str[i]) && (
    str[i] === ":" ||
    !rightVal || !`:/}`.includes(str[rightVal]) ||
    str[i] === "}" && str[rightVal] === "}") ||
    str[i] === "!") && (
    str[i] !== "/" || str[i - 1] !== "/")) {
      property.propertyEnds = i;
      property.property = str.slice(property.propertyStarts, i);
      if (property.valueStarts) {
        property.end = i;
      }
      if (`};`.includes(str[i]) ||
      str[i] && !str[i].trim() && str[rightVal] !== ":") {
        if (str[i] === ";") {
          property.semi = i;
        }
        if (!property.end) {
          property.end = property.semi ? property.semi + 1 : i;
        }
        pushProperty(property);
        propertyReset();
      }
      if (
      str[i] && str[i].trim() &&
      attrNameRegexp.test(str[property.propertyStarts]) &&
      !attrNameRegexp.test(str[i]) &&
      !`:'"`.includes(str[i])) {
        const nextSemi = str.indexOf(";", i);
        const nextColon = str.indexOf(":", i);
        if (
        (nextColon === -1 && nextSemi !== -1 || !(nextColon !== -1 && nextSemi !== -1 && nextColon < nextSemi)) && !`{}`.includes(str[i]) && rightVal && (
        !`!`.includes(str[i]) || isLatinLetter(str[rightVal]))) {
          property.colon = i;
          property.valueStarts = rightVal;
        } else if (nextColon !== -1 && nextSemi !== -1 && nextColon < nextSemi) {
          property.propertyEnds = null;
        } else if (str[i] === "!") {
          property.importantStarts = i;
        }
      }
    }
    if (!doNothing &&
    property && property.propertyEnds && !property.valueStarts && str[i] === ":") {
      property.colon = i;
      if (!rightVal) {
        property.end = i + 1;
        if (str[i + 1]) {
          pushProperty(property);
          propertyReset();
          if (token.properties) {
            token.properties.push({
              type: "text",
              start: i + 1,
              end: null,
              value: null
            });
            doNothing = i + 1;
          }
        }
      }
      if (property.propertyEnds && lastNonWhitespaceCharAt && property.propertyEnds !== lastNonWhitespaceCharAt + 1 &&
      !attrNameRegexp.test(str[property.propertyEnds])) {
        property.propertyEnds = lastNonWhitespaceCharAt + 1;
        property.property = str.slice(property.propertyStarts, property.propertyEnds);
      }
    }
    if (!doNothing && token.type === "rule" && str[i] && str[i].trim() &&
    !"{}".includes(str[i]) &&
    token.selectorsEnd && token.openingCurlyAt && !property.propertyStarts && !property.importantStarts) {
      if (Array.isArray(token.properties) && token.properties.length && token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].end) {
        token.properties[~-token.properties.length].end = i;
        token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, i);
      }
      if (str[i] === ";") {
        initProperty({
          start: i,
          end: i + 1,
          semi: i
        });
        pushProperty(property);
        propertyReset();
      } else if (str[i] === "!") {
        initProperty({
          start: i,
          importantStarts: i
        });
      } else {
        initProperty(i);
      }
      doNothing = i;
    }
    if (!doNothing &&
    attrib && attrib.attribName === "style" &&
    attrib.attribOpeningQuoteAt && !attrib.attribClosingQuoteAt &&
    !property.start &&
    str[i] && str[i].trim() &&
    !`'"`.includes(str[i]) &&
    !lastLayerIs("block")) {
      if (
      str[i] === "/" &&
      str[rightVal] === "*") {
        attribPush({
          type: "comment",
          start: i,
          end: rightVal + 1,
          value: str.slice(i, rightVal + 1),
          closing: false,
          kind: "block",
          language: "css"
        });
        layers.push({
          type: "block",
          value: str.slice(i, rightVal + 1),
          position: i
        });
        doNothing = rightVal + 1;
      }
      else if (str[i] === "*" && str[rightVal] === "/") {
          closingComment(i);
        } else {
          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, i);
          }
          if (str[i] === ";") {
            initProperty({
              start: i,
              end: i + 1,
              semi: i
            });
            doNothing = i;
          } else if (R2) {
            initProperty({
              start: i,
              importantStarts: i
            });
          } else {
            initProperty(i);
          }
        }
    }
    if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
      if (str[i] === "[") ;
    }
    if (!doNothing) {
      if (token.type === "tag" && !layers.length && str[i] === ">") {
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
      } else if (token.type === "comment" && token.language === "html" && !layers.length && token.kind === "simple" && (str[token.start] === "<" && str[i] === "-" && (matchLeft(str, i, "!-", {
        trimBeforeMatching: true
      }) || matchLeftIncl(str, i, "!-", {
        trimBeforeMatching: true
      }) && str[i + 1] !== "-") || str[token.start] === "-" && str[i] === ">" && matchLeft(str, i, "--", {
        trimBeforeMatching: true,
        maxMismatches: 1
      }))) {
        if (str[i] === "-" && (matchRight(str, i, ["[if", "(if", "{if"], {
          i: true,
          trimBeforeMatching: true
        }) || matchRight(str, i, ["if"], {
          i: true,
          trimBeforeMatching: true
        }) && (
        xBeforeYOnTheRight(str, i, "]", ">") ||
        str.includes("mso", i) && !str.slice(i, str.indexOf("mso")).includes("<") && !str.slice(i, str.indexOf("mso")).includes(">")))) {
          token.kind = "only";
        } else if (
        str[token.start] !== "-" && matchRightIncl(str, i, ["-<![endif"], {
          i: true,
          trimBeforeMatching: true,
          maxMismatches: 2
        })) {
          token.kind = "not";
          token.closing = true;
        } else if (token.kind === "simple" && token.language === "html" && !token.closing && str[rightVal] === ">") {
          token.end = rightVal + 1;
          token.kind = "simplet";
          token.closing = null;
        } else if (token.language === "html") {
          token.end = i + 1;
          if (str[leftVal] === "!" && str[rightVal] === "-") {
            token.end = rightVal + 1;
          }
          token.value = str.slice(token.start, token.end);
        }
      } else if (token.type === "comment" && token.language === "html" && str[i] === ">" && (!layers.length || str[rightVal] === "<")) {
        if (Array.isArray(layers) && layers.length && layers[~-layers.length].value === "[") {
          layers.pop();
        }
        if (!["simplet", "not"].includes(token.kind) && matchRight(str, i, ["<!-->", "<!---->"], {
          trimBeforeMatching: true,
          maxMismatches: 1,
          lastMustMatch: true
        })) {
          token.kind = "not";
        } else {
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (token.type === "comment" && token.language === "css" && str[i] === "*" && str[i + 1] === "/") {
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
      } else if (token.type === "esp" && token.end === null && typeof token.head === "string" && typeof token.tail === "string" && token.tail.includes(str[i])) {
        let wholeEspTagClosing = "";
        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagClosing += str[y];
          } else {
            break;
          }
        }
        if (wholeEspTagClosing.length > token.head.length) {
          const headsFirstChar = token.head[0];
          if (wholeEspTagClosing.endsWith(token.head)) {
            token.end = i + wholeEspTagClosing.length - token.head.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (wholeEspTagClosing.startsWith(token.tail)) {
            token.end = i + token.tail.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          } else if (!token.tail.includes(headsFirstChar) && wholeEspTagClosing.includes(headsFirstChar) || wholeEspTagClosing.endsWith(token.head) || wholeEspTagClosing.startsWith(token.tail)) {
            const firstPartOfWholeEspTagClosing = wholeEspTagClosing.slice(0, wholeEspTagClosing.indexOf(headsFirstChar));
            const secondPartOfWholeEspTagClosing = wholeEspTagClosing.slice(wholeEspTagClosing.indexOf(headsFirstChar));
            if (firstPartOfWholeEspTagClosing.length && secondPartOfWholeEspTagClosing.length && token.tail.split("").every(char => firstPartOfWholeEspTagClosing.includes(char))) {
              token.end = i + firstPartOfWholeEspTagClosing.length;
              token.value = str.slice(token.start, token.end);
              doNothing = token.end;
            }
          } else {
            token.end = i + wholeEspTagClosing.length;
            token.value = str.slice(token.start, token.end);
            doNothing = token.end;
          }
        } else {
          token.end = i + wholeEspTagClosing.length;
          token.value = str.slice(token.start, token.end);
          if (lastLayerIs("esp")) {
            layers.pop();
          }
          doNothing = token.end;
        }
      }
    }
    if (!doNothing && token.type === "tag" && token.tagNameStartsAt && !token.tagNameEndsAt) {
      if (!str[i] || !charSuitableForTagName(str[i])) {
        token.tagNameEndsAt = i;
        token.tagName = str.slice(token.tagNameStartsAt, i).toLowerCase();
        if (token.tagName && token.tagName.toLowerCase() === "script") {
          withinScript = !withinScript;
        }
        if (token.tagName === "xml" && token.closing && !token.kind) {
          token.kind = "xml";
        }
        if (voidTags.includes(token.tagName)) {
          token.void = true;
        }
        token.recognised = isTagNameRecognised(token.tagName);
        doNothing = i;
      }
    }
    if (!doNothing && token.type === "tag" && !token.tagNameStartsAt && token.start != null && (token.start < i || str[token.start] !== "<")) {
      if (str[i] === "/") {
        token.closing = true;
        doNothing = i;
      } else if (isLatinLetter(str[i])) {
        token.tagNameStartsAt = i;
        if (!token.closing) {
          token.closing = false;
          doNothing = i;
        }
      } else ;
    }
    if (!doNothing && token.type === "tag" && token.kind !== "cdata" && attrib.attribNameStartsAt && i > attrib.attribNameStartsAt && attrib.attribNameEndsAt === null && !isAttrNameChar(str[i])) {
      attrib.attribNameEndsAt = i;
      attrib.attribName = str.slice(attrib.attribNameStartsAt, i);
      attrib.attribNameRecognised = allHtmlAttribs.has(attrib.attribName);
      if (attrib.attribName.startsWith("mc:")) {
        token.pureHTML = false;
      }
      if (str[i] && !str[i].trim() && str[rightVal] === "=") ; else if (str[i] && !str[i].trim() || str[i] === ">" || str[i] === "/" && str[rightVal] === ">") {
        if (`'"`.includes(str[rightVal])) ; else {
          attrib.attribEnds = i;
          token.attribs.push(lodash_clonedeep(attrib));
          attribReset();
        }
      }
    }
    if (!doNothing && str[i] && token.type === "tag" && token.kind !== "cdata" && token.tagNameEndsAt && i > token.tagNameEndsAt && attrib.attribStarts === null && isAttrNameChar(str[i])) {
      attrib.attribStarts = i;
      attrib.attribLeft = lastNonWhitespaceCharAt;
      attrib.attribNameStartsAt = i;
    }
    if (!doNothing && token.type === "rule") {
      if (str[i] === "{" && str[i + 1] !== "{" && str[i - 1] !== "{" && !token.openingCurlyAt) {
        token.openingCurlyAt = i;
      } else if (str[i] === "}" && token.openingCurlyAt && !token.closingCurlyAt) {
        token.closingCurlyAt = i;
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        if (Array.isArray(token.properties) && token.properties.length && token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].end) {
          token.properties[~-token.properties.length].end = i;
          token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, i);
        }
        if (property.start) {
          token.properties.push(property);
          propertyReset();
        }
        pingTagCb(token);
        if (lastLayerIs("at")) {
          layers[~-layers.length].token.rules.push(token);
        }
        tokenReset();
      }
    }
    if (!doNothing && attrib.attribName && Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
      if (str[i] === "*" && str[rightVal] === "/") {
        closingComment(i);
      }
    }
    if (
    !doNothing &&
    attrib &&
    attrib.attribValueStartsAt && !attrib.attribValueEndsAt &&
    !property.propertyStarts &&
    i >= attrib.attribValueStartsAt &&
    Array.isArray(attrib.attribValue) && (!attrib.attribValue.length ||
    attrib.attribValue[~-attrib.attribValue.length].end &&
    attrib.attribValue[~-attrib.attribValue.length].end <= i) ||
    !doNothing &&
    token.type === "rule" &&
    token.openingCurlyAt &&
    !token.closingCurlyAt &&
    !property.propertyStarts) {
      if (str[i] === ";" && (
      attrib && Array.isArray(attrib.attribValue) && attrib.attribValue.length &&
      attrib.attribValue[~-attrib.attribValue.length].semi &&
      attrib.attribValue[~-attrib.attribValue.length].semi < i ||
      token && token.type === "rule" && Array.isArray(token.properties) && token.properties.length && token.properties[~-token.properties.length].semi && token.properties[~-token.properties.length].semi < i)) {
        initProperty({
          start: i,
          semi: i
        });
        doNothing = i + 1;
      }
      else if (
        str[i] && !str[i].trim() ||
        lastLayerIs("block")) {
          if (attrib.attribName) {
            attrib.attribValue.push({
              type: "text",
              start: i,
              end: null,
              value: null
            });
          } else if (token.type === "rule" && (
          !Array.isArray(token.properties) || !token.properties.length ||
          token.properties[~-token.properties.length].end)) {
            token.properties.push({
              type: "text",
              start: i,
              end: null,
              value: null
            });
          }
        }
    }
    if (!doNothing && token.type === "tag" && attrib.attribValueStartsAt && i >= attrib.attribValueStartsAt && attrib.attribValueEndsAt === null) {
      if (SOMEQUOTE.includes(str[i])) {
        if (
        !layers.some(layerObj => layerObj.type === "esp") && (
        !str[i] ||
        !str.includes(">", i) ||
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
          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
            if (!attrib.attribValue[~-attrib.attribValue.length].property) {
              attrib.attribValue[~-attrib.attribValue.length].end = i;
              attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, i);
            }
          }
          if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
            layers.pop();
            layers.pop();
          }
          if (attrib.attribValue[~-attrib.attribValue.length] && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = i;
          }
          token.attribs.push(lodash_clonedeep(attrib));
          attribReset();
        } else if ((!Array.isArray(attrib.attribValue) || !attrib.attribValue.length ||
        attrib.attribValue[~-attrib.attribValue.length].type !== "text") && !property.propertyStarts) {
          attrib.attribValue.push({
            type: "text",
            start: i,
            end: null,
            value: null
          });
        }
      } else if (attrib.attribOpeningQuoteAt === null && (str[i] && !str[i].trim() || ["/", ">"].includes(str[i]) || espChars.includes(str[i]) && espChars.includes(str[i + 1]))) {
        attrib.attribValueEndsAt = i;
        attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
        if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
          attrib.attribValue[~-attrib.attribValue.length].end = i;
          attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, attrib.attribValue[~-attrib.attribValue.length].end);
        }
        attrib.attribEnds = i;
        token.attribs.push(lodash_clonedeep(attrib));
        attribReset();
        layers.pop();
        if (str[i] === ">") {
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
        }
      } else if (str[i] === "=" && leftVal !== null && rightVal && (`'"`.includes(str[rightVal]) || str[~-i] && isLatinLetter(str[~-i])) &&
      !(attrib && attrib.attribOpeningQuoteAt && (
      /\//.test(str.slice(attrib.attribOpeningQuoteAt + 1, i)) ||
      /mailto:/.test(str.slice(attrib.attribOpeningQuoteAt + 1, i)) ||
      /\w\?\w/.test(str.slice(attrib.attribOpeningQuoteAt + 1, i))))) {
        let whitespaceFound;
        let attribClosingQuoteAt;
        for (let y = leftVal; y >= attrib.attribValueStartsAt; y--) {
          if (!whitespaceFound && str[y] && !str[y].trim()) {
            whitespaceFound = true;
            if (attribClosingQuoteAt) {
              str.slice(y, attribClosingQuoteAt);
            }
          }
          if (whitespaceFound && str[y] && str[y].trim()) {
            whitespaceFound = false;
            if (!attribClosingQuoteAt) {
              attribClosingQuoteAt = y + 1;
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
          attrib.attribEnds = attribClosingQuoteAt;
          if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
            layers.pop();
          }
          token.attribs.push(lodash_clonedeep(attrib));
          attribReset();
          i = ~-attribClosingQuoteAt;
          continue;
        } else if (attrib.attribOpeningQuoteAt && (`'"`.includes(str[rightVal]) || allHtmlAttribs.has(str.slice(attrib.attribOpeningQuoteAt + 1, i).trim()))) {
          i = attrib.attribOpeningQuoteAt;
          attrib.attribEnds = attrib.attribOpeningQuoteAt + 1;
          attrib.attribValueStartsAt = null;
          layers.pop();
          token.attribs.push(lodash_clonedeep(attrib));
          attribReset();
          continue;
        }
      } else if (str[i] === "/" && str[rightVal] === ">") {
        if (attrib.attribValueStartsAt) {
          attrib.attribValueStartsAt = null;
        }
        if (!attrib.attribEnds) {
          attrib.attribEnds = i;
        }
      } else if (attrib && attrib.attribName !== "style" && attrib.attribStarts && !attrib.attribEnds && !property.propertyStarts && (
      !Array.isArray(attrib.attribValue) ||
      !attrib.attribValue.length ||
      attrib.attribValue[~-attrib.attribValue.length].end && attrib.attribValue[~-attrib.attribValue.length].end <= i)) {
        attrib.attribValue.push({
          type: "text",
          start: i,
          end: null,
          value: null
        });
      }
    } else if (token.type === "esp" && attribToBackup && parentTokenToBackup && attribToBackup.attribOpeningQuoteAt && attribToBackup.attribValueStartsAt && `'"`.includes(str[i]) && str[attribToBackup.attribOpeningQuoteAt] === str[i] && isAttrClosing(str, attribToBackup.attribOpeningQuoteAt, i)) {
      token.end = i;
      token.value = str.slice(token.start, i);
      if (attribToBackup && !Array.isArray(attribToBackup.attribValue)) {
        attribToBackup.attribValue = [];
      }
      attribToBackup.attribValue.push(token);
      attribToBackup.attribValueEndsAt = i;
      attribToBackup.attribValueRaw = str.slice(attribToBackup.attribValueStartsAt, i);
      attribToBackup.attribClosingQuoteAt = i;
      attribToBackup.attribEnds = i + 1;
      token = lodash_clonedeep(parentTokenToBackup);
      token.attribs.push(attribToBackup);
      attribToBackup = undefined;
      parentTokenToBackup = undefined;
      layers.pop();
      layers.pop();
      layers.pop();
    }
    if (!doNothing && token.type === "tag" && !attrib.attribValueStartsAt && attrib.attribNameEndsAt && attrib.attribNameEndsAt <= i && str[i] && str[i].trim()) {
      if (str[i] === "=" && !SOMEQUOTE.includes(str[rightVal]) && !`=`.includes(str[rightVal]) && !espChars.includes(str[rightVal])
      ) {
          const firstQuoteOnTheRightIdx = SOMEQUOTE.split("").map(quote => str.indexOf(quote, rightVal)).filter(val => val > 0).length ? Math.min(...SOMEQUOTE.split("").map(quote => str.indexOf(quote, rightVal)).filter(val => val > 0)) : undefined;
          if (
          rightVal &&
          str.slice(rightVal).includes("=") &&
          allHtmlAttribs.has(str.slice(rightVal, rightVal + str.slice(rightVal).indexOf("=")).trim().toLowerCase())) {
            attrib.attribEnds = i + 1;
            token.attribs.push({ ...attrib
            });
            attribReset();
          } else if (
          !firstQuoteOnTheRightIdx ||
          str.slice(rightVal, firstQuoteOnTheRightIdx).includes("=") ||
          !str.includes(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1) ||
          Array.from(str.slice(firstQuoteOnTheRightIdx + 1, str.indexOf(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1))).some(char => `<>=`.includes(char))) {
            attrib.attribValueStartsAt = rightVal;
            layers.push({
              type: "simple",
              value: null,
              position: attrib.attribValueStartsAt
            });
          }
        } else if (SOMEQUOTE.includes(str[i])) {
        const nextCharIdx = rightVal;
        if (
        nextCharIdx &&
        SOMEQUOTE.includes(str[nextCharIdx]) &&
        str[i] !== str[nextCharIdx] &&
        str.length > nextCharIdx + 2 &&
        str.slice(nextCharIdx + 1).includes(str[nextCharIdx]) && (
        !str.indexOf(str[nextCharIdx], nextCharIdx + 1) || !right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1)) || str[i] !== str[right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1))]) &&
        !Array.from(str.slice(nextCharIdx + 1, str.indexOf(str[nextCharIdx]))).some(char => `<>=${str[i]}`.includes(char))) {
          layers.pop();
        } else {
          if (!attrib.attribOpeningQuoteAt) {
            attrib.attribOpeningQuoteAt = i;
            if (
            str[i + 1] && (
            str[i + 1] !== str[i] ||
            !ifQuoteThenAttrClosingQuote(i + 1))) {
              attrib.attribValueStartsAt = i + 1;
            }
          } else {
            /* istanbul ignore else */
            if (isAttrClosing(str, attrib.attribOpeningQuoteAt, i)) {
              attrib.attribClosingQuoteAt = i;
            }
            /* istanbul ignore else */
            if (attrib.attribOpeningQuoteAt && attrib.attribClosingQuoteAt) {
              if (attrib.attribOpeningQuoteAt < ~-attrib.attribClosingQuoteAt) {
                attrib.attribValueRaw = str.slice(attrib.attribOpeningQuoteAt + 1, attrib.attribClosingQuoteAt);
              } else {
                attrib.attribValueRaw = "";
              }
              attrib.attribEnds = i + 1;
              token.attribs.push(lodash_clonedeep(attrib));
              attribReset();
            }
          }
        }
      }
    }
    if (!doNothing && str[i] === ">" &&
    str[i - 1] !== "%" && token.type === "tag" && attrib.attribStarts && !attrib.attribEnds) {
      let thisIsRealEnding = false;
      if (str[i + 1]) {
        for (let y = i + 1; y < len; y++) {
          if (attrib.attribOpeningQuoteAt && str[y] === str[attrib.attribOpeningQuoteAt]) {
            if (y !== i + 1 && str[~-y] !== "=") {
              thisIsRealEnding = true;
            }
            break;
          } else if (str[y] === ">") {
            break;
          } else if (str[y] === "<") {
            thisIsRealEnding = true;
            layers.pop();
            break;
          } else if (!str[y + 1]) {
            thisIsRealEnding = true;
            break;
          }
        }
      } else {
        thisIsRealEnding = true;
      }
      if (thisIsRealEnding) {
        token.end = i + 1;
        token.value = str.slice(token.start, token.end);
        if (attrib.attribValueStartsAt && i && attrib.attribValueStartsAt < i && str.slice(attrib.attribValueStartsAt, i).trim()) {
          attrib.attribValueEndsAt = i;
          attrib.attribValueRaw = str.slice(attrib.attribValueStartsAt, i);
          if (Array.isArray(attrib.attribValue) && attrib.attribValue.length && !attrib.attribValue[~-attrib.attribValue.length].end) {
            attrib.attribValue[~-attrib.attribValue.length].end = i;
            attrib.attribValue[~-attrib.attribValue.length].value = str.slice(attrib.attribValue[~-attrib.attribValue.length].start, i);
          }
        } else {
          attrib.attribValueStartsAt = null;
        }
        if (attrib.attribEnds === null) {
          attrib.attribEnds = i;
        }
        if (attrib) {
          token.attribs.push(lodash_clonedeep(attrib));
          attribReset();
        }
      }
    }
    if (str[i] && opts.charCb) {
      pingCharCb({
        type: token.type,
        chr: str[i],
        i
      });
    }
    if (!str[i] && token.start !== null) {
      token.end = i;
      token.value = str.slice(token.start, token.end);
      if (attrib && attrib.attribName) {
        if (!attrib.attribEnds) {
          attrib.attribEnds = i;
        }
        token.attribs.push({ ...attrib
        });
        attribReset();
      }
      if (token && Array.isArray(token.properties) && token.properties.length && !token.properties[~-token.properties.length].end) {
        token.properties[~-token.properties.length].end = i;
        if (token.properties[~-token.properties.length].start && !token.properties[~-token.properties.length].value) {
          token.properties[~-token.properties.length].value = str.slice(token.properties[~-token.properties.length].start, i);
        }
      }
      if (property && property.propertyStarts) {
        if (!property.end) {
          property.end = i;
        }
        pushProperty(property);
        propertyReset();
      }
      pingTagCb(token);
    }
    if (str[i] && str[i].trim()) {
      lastNonWhitespaceCharAt = i;
    }
  }
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
  const timeTakenInMilliseconds = Date.now() - start;
  return {
    timeTakenInMilliseconds
  };
}

var objectPath = createCommonjsModule(function (module) {
(function (root, factory){

  /*istanbul ignore next:cant test*/
  {
    module.exports = factory();
  }
})(commonjsGlobal, function(){

  var toStr = Object.prototype.toString;
  function hasOwnProperty(obj, prop) {
    if(obj == null) {
      return false
    }
    //to handle objects with null prototypes (too edge case?)
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }

  function isEmpty(value){
    if (!value) {
      return true;
    }
    if (isArray(value) && value.length === 0) {
        return true;
    } else if (typeof value !== 'string') {
        for (var i in value) {
            if (hasOwnProperty(value, i)) {
                return false;
            }
        }
        return true;
    }
    return false;
  }

  function toString(type){
    return toStr.call(type);
  }

  function isObject(obj){
    return typeof obj === 'object' && toString(obj) === "[object Object]";
  }

  var isArray = Array.isArray || function(obj){
    /*istanbul ignore next:cant test*/
    return toStr.call(obj) === '[object Array]';
  };

  function isBoolean(obj){
    return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
  }

  function getKey(key){
    var intKey = parseInt(key);
    if (intKey.toString() === key) {
      return intKey;
    }
    return key;
  }

  function factory(options) {
    options = options || {};

    var objectPath = function(obj) {
      return Object.keys(objectPath).reduce(function(proxy, prop) {
        if(prop === 'create') {
          return proxy;
        }

        /*istanbul ignore else*/
        if (typeof objectPath[prop] === 'function') {
          proxy[prop] = objectPath[prop].bind(objectPath, obj);
        }

        return proxy;
      }, {});
    };

    var hasShallowProperty;
    if (options.includeInheritedProps) {
      hasShallowProperty = function () {
        return true
      };
    } else {
      hasShallowProperty = function (obj, prop) {
        return (typeof prop === 'number' && Array.isArray(obj)) || hasOwnProperty(obj, prop)
      };
    }

    function getShallowProperty(obj, prop) {
      if (hasShallowProperty(obj, prop)) {
        return obj[prop];
      }
    }

    function set(obj, path, value, doNotReplace){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        return obj;
      }
      if (typeof path === 'string') {
        return set(obj, path.split('.').map(getKey), value, doNotReplace);
      }
      var currentPath = path[0];
      var currentValue = getShallowProperty(obj, currentPath);
      if (options.includeInheritedProps && (currentPath === '__proto__' ||
        (currentPath === 'constructor' && typeof currentValue === 'function'))) {
        throw new Error('For security reasons, object\'s magic properties cannot be set')
      }
      if (path.length === 1) {
        if (currentValue === void 0 || !doNotReplace) {
          obj[currentPath] = value;
        }
        return currentValue;
      }

      if (currentValue === void 0) {
        //check if we assume an array
        if(typeof path[1] === 'number') {
          obj[currentPath] = [];
        } else {
          obj[currentPath] = {};
        }
      }

      return set(obj[currentPath], path.slice(1), value, doNotReplace);
    }

    objectPath.has = function (obj, path) {
      if (typeof path === 'number') {
        path = [path];
      } else if (typeof path === 'string') {
        path = path.split('.');
      }

      if (!path || path.length === 0) {
        return !!obj;
      }

      for (var i = 0; i < path.length; i++) {
        var j = getKey(path[i]);

        if((typeof j === 'number' && isArray(obj) && j < obj.length) ||
          (options.includeInheritedProps ? (j in Object(obj)) : hasOwnProperty(obj, j))) {
          obj = obj[j];
        } else {
          return false;
        }
      }

      return true;
    };

    objectPath.ensureExists = function (obj, path, value){
      return set(obj, path, value, true);
    };

    objectPath.set = function (obj, path, value, doNotReplace){
      return set(obj, path, value, doNotReplace);
    };

    objectPath.insert = function (obj, path, value, at){
      var arr = objectPath.get(obj, path);
      at = ~~at;
      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }
      arr.splice(at, 0, value);
    };

    objectPath.empty = function(obj, path) {
      if (isEmpty(path)) {
        return void 0;
      }
      if (obj == null) {
        return void 0;
      }

      var value, i;
      if (!(value = objectPath.get(obj, path))) {
        return void 0;
      }

      if (typeof value === 'string') {
        return objectPath.set(obj, path, '');
      } else if (isBoolean(value)) {
        return objectPath.set(obj, path, false);
      } else if (typeof value === 'number') {
        return objectPath.set(obj, path, 0);
      } else if (isArray(value)) {
        value.length = 0;
      } else if (isObject(value)) {
        for (i in value) {
          if (hasShallowProperty(value, i)) {
            delete value[i];
          }
        }
      } else {
        return objectPath.set(obj, path, null);
      }
    };

    objectPath.push = function (obj, path /*, values */){
      var arr = objectPath.get(obj, path);
      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }

      arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
    };

    objectPath.coalesce = function (obj, paths, defaultValue) {
      var value;

      for (var i = 0, len = paths.length; i < len; i++) {
        if ((value = objectPath.get(obj, paths[i])) !== void 0) {
          return value;
        }
      }

      return defaultValue;
    };

    objectPath.get = function (obj, path, defaultValue){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        return obj;
      }
      if (obj == null) {
        return defaultValue;
      }
      if (typeof path === 'string') {
        return objectPath.get(obj, path.split('.'), defaultValue);
      }

      var currentPath = getKey(path[0]);
      var nextObj = getShallowProperty(obj, currentPath);
      if (nextObj === void 0) {
        return defaultValue;
      }

      if (path.length === 1) {
        return nextObj;
      }

      return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
    };

    objectPath.del = function del(obj, path) {
      if (typeof path === 'number') {
        path = [path];
      }

      if (obj == null) {
        return obj;
      }

      if (isEmpty(path)) {
        return obj;
      }
      if(typeof path === 'string') {
        return objectPath.del(obj, path.split('.'));
      }

      var currentPath = getKey(path[0]);
      if (!hasShallowProperty(obj, currentPath)) {
        return obj;
      }

      if(path.length === 1) {
        if (isArray(obj)) {
          obj.splice(currentPath, 1);
        } else {
          delete obj[currentPath];
        }
      } else {
        return objectPath.del(obj[currentPath], path.slice(1));
      }

      return obj;
    };

    return objectPath;
  }

  var mod = factory();
  mod.create = factory;
  mod.withInheritedProps = factory({includeInheritedProps: true});
  return mod;
});
});

/**
 * @name codsen-parser
 * @fileoverview Parser aiming at broken or mixed code, especially HTML & CSS
 * @version 0.10.10
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/codsen-parser/}
 */
const defaults$4 = {
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  tagCb: null,
  charCb: null,
  errCb: null
};
function isObj$1(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
function layerPending(layers, tokenObj) {
  return (
    tokenObj.closing && layers.length && (layers[layers.length - 1].type === tokenObj.type && Object.prototype.hasOwnProperty.call(layers[layers.length - 1], "tagName") && Object.prototype.hasOwnProperty.call(tokenObj, "tagName") && layers[layers.length - 1].tagName === tokenObj.tagName && layers[layers.length - 1].closing === false ||
    tokenObj.type === "comment" && layers.some(layerObjToken => Object.prototype.hasOwnProperty.call(layerObjToken, "closing") && !layerObjToken.closing))
  );
}
function cparser(str, originalOpts) {
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
    } else {
      throw new Error(`codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(str, null, 4)}`);
    }
  }
  if (originalOpts && !isObj$1(originalOpts)) {
    throw new Error(`codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(originalOpts, null, 4)}`);
  }
  if (originalOpts && isObj$1(originalOpts) && originalOpts.tagCb && typeof originalOpts.tagCb !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ${typeof originalOpts.tagCb}, equal to ${JSON.stringify(originalOpts.tagCb, null, 4)}`);
  }
  if (originalOpts && isObj$1(originalOpts) && originalOpts.charCb && typeof originalOpts.charCb !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ${typeof originalOpts.charCb}, equal to ${JSON.stringify(originalOpts.charCb, null, 4)}`);
  }
  if (originalOpts && isObj$1(originalOpts) && originalOpts.reportProgressFunc && typeof originalOpts.reportProgressFunc !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ${typeof originalOpts.reportProgressFunc}, equal to ${JSON.stringify(originalOpts.reportProgressFunc, null, 4)}`);
  }
  if (originalOpts && isObj$1(originalOpts) && originalOpts.errCb && typeof originalOpts.errCb !== "function") {
    throw new Error(`codsen-tokenizer: [THROW_ID_07] the opts.errCb, callback function, should be a function but it was given as type ${typeof originalOpts.errCb}, equal to ${JSON.stringify(originalOpts.errCb, null, 4)}`);
  }
  const opts = { ...defaults$4,
    ...originalOpts
  };
  const layers = [];
  const res = [];
  let path = "";
  let nestNext = false;
  let lastProcessedToken = {};
  const tokensWithChildren = ["tag", "comment"];
  const tagNamesThatDontHaveClosings = ["doctype"];
  tokenizer(str, {
    reportProgressFunc: opts.reportProgressFunc,
    reportProgressFuncFrom: opts.reportProgressFuncFrom,
    reportProgressFuncTo: opts.reportProgressFuncTo,
    tagCbLookahead: 2,
    tagCb: (tokenObj, next) => {
      if (typeof opts.tagCb === "function") {
        opts.tagCb(tokenObj);
      }
      if (!tokenObj.nested) {
        let prevToken = objectPath.get(res, path);
        if (!isObj$1(prevToken)) {
          prevToken = null;
        }
        if (nestNext &&
        !tokenObj.closing && (
        !lastProcessedToken.closing ||
        lastProcessedToken.type === "comment" &&
        lastProcessedToken.language === "html") &&
        lastProcessedToken.type !== "text" && (!prevToken || !(prevToken.tagName === tokenObj.tagName && !prevToken.closing && tokenObj.closing)) && !layerPending(layers, tokenObj)) {
          nestNext = false;
          path = `${path}.children.0`;
        } else if (tokenObj.closing && typeof path === "string" && path.includes(".") && (
        !tokenObj.tagName || lastProcessedToken.tagName !== tokenObj.tagName || lastProcessedToken.closing)) {
          if (tokenObj.type === "comment" && tokenObj.closing && Array.isArray(layers) && layers.length &&
          layers.some(l => l.type === "comment" && l.kind === tokenObj.kind)) {
            for (let i = layers.length; i--;) {
              path = pathNext(pathUp(path));
              if (layers[i].type === "comment" && layers[i].kind === tokenObj.kind) {
                break;
              }
            }
          } else {
            path = pathNext(pathUp(path));
          }
          if (layerPending(layers, tokenObj)) {
            while (layers.length && layers[layers.length - 1].type !== tokenObj.type && layers[layers.length - 1].kind !== tokenObj.kind) {
              layers.pop();
            }
            layers.pop();
            nestNext = false;
          } else {
            if (layers.length && tokenObj.tagName &&
            layers.some(layerObj => layerObj.type === "tag" && layerObj.tagName === tokenObj.tagName)) {
              let lastLayer = layers.pop();
              let currTagName = lastLayer.tagName;
              while (currTagName !== tokenObj.tagName) {
                if (lastLayer && typeof opts.errCb === "function") {
                  opts.errCb({
                    ruleId: `${lastLayer.type}${lastLayer.type === "comment" ? `-${lastLayer.kind}` : ""}-missing-closing`,
                    idxFrom: lastLayer.start,
                    idxTo: lastLayer.end,
                    tokenObj: lastLayer
                  });
                }
                lastLayer = layers.pop();
                currTagName = lastLayer.tagName;
                path = pathNext(pathUp(path));
              }
            } else if (
            layers.length > 1 && layers[layers.length - 2].type === tokenObj.type && layers[layers.length - 2].type === tokenObj.type && layers[layers.length - 2].tagName === tokenObj.tagName) {
              if (typeof opts.errCb === "function") {
                const lastLayersToken = layers[layers.length - 1];
                opts.errCb({
                  ruleId: `tag-rogue`,
                  idxFrom: lastLayersToken.start,
                  idxTo: lastLayersToken.end,
                  tokenObj: lastLayersToken
                });
              }
              layers.pop();
              layers.pop();
            } else ;
          }
        } else if (!path) {
          path = "0";
        } else {
          path = pathNext(path);
          if (layerPending(layers, tokenObj)) {
            layers.pop();
          }
        }
        if (tokensWithChildren.includes(tokenObj.type) && !tokenObj.void && Object.prototype.hasOwnProperty.call(tokenObj, "closing") && !tokenObj.closing) {
          nestNext = true;
          if (!tokenObj.kind || !tagNamesThatDontHaveClosings.includes(tokenObj.kind)) {
            layers.push({ ...tokenObj
            });
          }
        }
        const previousPath = pathPrev(path) || "";
        const parentPath = pathUp(path);
        let parentTagsToken;
        if (parentPath && path.includes(".")) {
          parentTagsToken = objectPath.get(res, parentPath);
        }
        let previousTagsToken;
        if (previousPath) {
          previousTagsToken = objectPath.get(res, previousPath);
        }
        const suspiciousCommentTagEndingRegExp = /(-+|-+[^>])>/;
        let parentsLastChildTokenValue;
        let parentsLastChildTokenPath;
        if (isObj$1(previousTagsToken) && Array.isArray(previousTagsToken.children) && previousTagsToken.children.length && previousTagsToken.children[previousTagsToken.children.length - 1]) {
          parentsLastChildTokenValue = previousTagsToken.children[previousTagsToken.children.length - 1];
          parentsLastChildTokenPath = `${previousPath}.children.${objectPath.get(res, previousPath).children.length - 1}`;
        }
        let tokenTakenCareOf = false;
        if (tokenObj.type === "text" && isObj$1(parentTagsToken) && parentTagsToken.type === "comment" && parentTagsToken.kind === "simple" && !parentTagsToken.closing && suspiciousCommentTagEndingRegExp.test(tokenObj.value)) {
          const suspiciousEndingStartsAt = (suspiciousCommentTagEndingRegExp.exec(tokenObj.value) || {}).index;
          const suspiciousEndingEndsAt = (suspiciousEndingStartsAt || 0) + tokenObj.value.slice(suspiciousEndingStartsAt).indexOf(">") + 1;
          if (suspiciousEndingStartsAt && suspiciousEndingStartsAt > 0) {
            objectPath.set(res, path, { ...tokenObj,
              end: tokenObj.start + suspiciousEndingStartsAt,
              value: tokenObj.value.slice(0, suspiciousEndingStartsAt)
            });
            if (tokensWithChildren.includes(tokenObj.type)) {
              tokenObj.children = [];
            }
          }
          path = pathNext(pathUp(path));
          objectPath.set(res, path, {
            type: "comment",
            kind: "simple",
            closing: true,
            start: tokenObj.start + (suspiciousEndingStartsAt || 0),
            end: tokenObj.start + suspiciousEndingEndsAt,
            value: tokenObj.value.slice(suspiciousEndingStartsAt, suspiciousEndingEndsAt),
            children: []
          });
          if (suspiciousEndingEndsAt < tokenObj.value.length) {
            path = pathNext(path);
            objectPath.set(res, path, {
              type: "text",
              start: tokenObj.start + suspiciousEndingEndsAt,
              end: tokenObj.end,
              value: tokenObj.value.slice(suspiciousEndingEndsAt)
            });
          }
          tokenTakenCareOf = true;
        } else if (tokenObj.type === "comment" && tokenObj.kind === "only" && isObj$1(previousTagsToken)) {
          if (previousTagsToken.type === "text" && previousTagsToken.value.trim() && "<!-".includes(previousTagsToken.value[left(previousTagsToken.value, previousTagsToken.value.length)])) {
            const capturedMalformedTagRanges = [];
            findMalformed(previousTagsToken.value, "<!--", obj => {
              capturedMalformedTagRanges.push(obj);
            }, {
              maxDistance: 2
            });
            if (capturedMalformedTagRanges.length && !right(previousTagsToken.value, capturedMalformedTagRanges[capturedMalformedTagRanges.length - 1].idxTo - 1)) {
              const malformedRange = capturedMalformedTagRanges.pop();
              if (!left(previousTagsToken.value, malformedRange.idxFrom) && previousPath && isObj$1(previousTagsToken)) {
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }
                path = previousPath;
                objectPath.set(res, path, { ...tokenObj,
                  start: malformedRange.idxFrom + previousTagsToken.start,
                  kind: "not",
                  value: `${previousTagsToken.value}${tokenObj.value}`
                });
                tokenTakenCareOf = true;
              } else if (previousPath && isObj$1(previousTagsToken)) {
                objectPath.set(res, previousPath, { ...previousTagsToken,
                  end: malformedRange.idxFrom + previousTagsToken.start,
                  value: previousTagsToken.value.slice(0, malformedRange.idxFrom)
                });
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }
                objectPath.set(res, path, { ...tokenObj,
                  start: malformedRange.idxFrom + previousTagsToken.start,
                  kind: "not",
                  value: `${previousTagsToken.value.slice(malformedRange.idxFrom)}${tokenObj.value}`
                });
                tokenTakenCareOf = true;
              }
            }
          } else if (isObj$1(parentsLastChildTokenValue) && parentsLastChildTokenValue.type === "text" && parentsLastChildTokenValue.value.trim() && "<!-".includes(parentsLastChildTokenValue.value[left(parentsLastChildTokenValue.value, parentsLastChildTokenValue.value.length)])) {
            const capturedMalformedTagRanges = [];
            findMalformed(parentsLastChildTokenValue.value, "<!--", obj => {
              capturedMalformedTagRanges.push(obj);
            }, {
              maxDistance: 2
            });
            if (capturedMalformedTagRanges.length && !right(parentsLastChildTokenValue.value, capturedMalformedTagRanges[capturedMalformedTagRanges.length - 1].idxTo - 1)) {
              const malformedRange = capturedMalformedTagRanges.pop();
              if (!left(parentsLastChildTokenValue.value, malformedRange.idxFrom) && previousPath && isObj$1(parentsLastChildTokenValue)) {
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }
                objectPath.set(res, path, { ...tokenObj,
                  start: malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  kind: "not",
                  value: `${parentsLastChildTokenValue.value}${tokenObj.value}`
                });
                objectPath.del(res, `${previousPath}.children.${objectPath.get(res, previousPath).children.length - 1}`);
                tokenTakenCareOf = true;
              } else if (previousPath && isObj$1(parentsLastChildTokenValue) && parentsLastChildTokenPath) {
                objectPath.set(res, parentsLastChildTokenPath, { ...parentsLastChildTokenValue,
                  end: malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  value: parentsLastChildTokenValue.value.slice(0, malformedRange.idxFrom)
                });
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }
                objectPath.set(res, path, { ...tokenObj,
                  start: malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  kind: "not",
                  value: `${parentsLastChildTokenValue.value.slice(malformedRange.idxFrom)}${tokenObj.value}`
                });
                tokenTakenCareOf = true;
              }
            }
          }
        }
        if (!tokenTakenCareOf) {
          if (tokensWithChildren.includes(tokenObj.type)) {
            tokenObj.children = [];
          }
          objectPath.set(res, path, tokenObj);
        }
        if (tokensWithChildren.includes(tokenObj.type) && tokenObj.closing && (!previousPath || !isObj$1(previousTagsToken) || previousTagsToken.closing || previousTagsToken.type !== tokenObj.type || previousTagsToken.tagName !== tokenObj.tagName)) {
          if (tokenObj.void) {
            if (typeof opts.errCb === "function") {
              opts.errCb({
                ruleId: `tag-void-frontal-slash`,
                idxFrom: tokenObj.start,
                idxTo: tokenObj.end,
                fix: {
                  ranges: [[tokenObj.start + 1, tokenObj.tagNameStartsAt]]
                },
                tokenObj
              });
            }
          } else {
            if (typeof opts.errCb === "function") {
              opts.errCb({
                ruleId: `${tokenObj.type}${tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""}-missing-opening`,
                idxFrom: tokenObj.start,
                idxTo: tokenObj.end,
                tokenObj
              });
            }
          }
        }
        lastProcessedToken = { ...tokenObj
        };
      }
    },
    charCb: opts.charCb
  });
  if (layers.length) {
    layers.forEach(tokenObj => {
      if (typeof opts.errCb === "function") {
        opts.errCb({
          ruleId: `${tokenObj.type}${tokenObj.type === "comment" ? `-${tokenObj.kind}` : ""}-missing-closing`,
          idxFrom: tokenObj.start,
          idxTo: tokenObj.end,
          tokenObj
        });
      }
    });
  }
  return res;
}

/**
 * @name string-collapse-leading-whitespace
 * @fileoverview Collapse the leading and trailing whitespace of a string
 * @version 5.0.13
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
 * @version 4.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-sort/}
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
 * @name ranges-merge
 * @fileoverview Merge and sort string index ranges
 * @version 7.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-merge/}
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
 * @name ranges-push
 * @fileoverview Gather string index ranges
 * @version 5.0.13
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
 * @name ranges-apply
 * @fileoverview Take an array of string index ranges, delete/replace the string according to them
 * @version 5.0.13
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
 * @name ast-monkey-traverse-with-lookahead
 * @fileoverview Utility library to traverse AST, reports upcoming values
 * @version 2.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ast-monkey-traverse-with-lookahead/}
 */
function traverse(tree1, cb1, lookahead = 0) {
  function trimFirstDot(str) {
    if (typeof str === "string" && str[0] === ".") {
      return str.slice(1);
    }
    return str;
  }
  const stop1 = {
    now: false
  };
  const stash = [];
  function traverseInner(tree, callback, innerObj, stop) {
    innerObj = { ...innerObj
    };
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      for (let i = 0, len = tree.length; i < len; i++) {
        if (stop.now) {
          break;
        }
        const path = `${innerObj.path}.${i}`;
        innerObj.parent = lodash_clonedeep(tree);
        innerObj.parentType = "array";
        callback(tree[i], undefined, { ...innerObj,
          path: trimFirstDot(path)
        }, stop);
        traverseInner(tree[i], callback, { ...innerObj,
          path: trimFirstDot(path)
        }, stop);
      }
    } else if (lodash_isplainobject(tree)) {
      for (const key in tree) {
        if (stop.now && key != null) {
          break;
        }
        const path = `${innerObj.path}.${key}`;
        if (innerObj.depth === 0 && key != null) {
          innerObj.topmostKey = key;
        }
        innerObj.parent = lodash_clonedeep(tree);
        innerObj.parentType = "object";
        callback(key, tree[key], { ...innerObj,
          path: trimFirstDot(path)
        }, stop);
        traverseInner(tree[key], callback, { ...innerObj,
          path: trimFirstDot(path)
        }, stop);
      }
    }
    return tree;
  }
  function reportFirstFromStash() {
    const currentElem = stash.shift();
    currentElem[2].next = [];
    for (let i = 0; i < lookahead; i++) {
      if (stash[i]) {
        currentElem[2].next.push(lodash_clonedeep([stash[i][0], stash[i][1], stash[i][2]]));
      } else {
        break;
      }
    }
    cb1(...currentElem);
  }
  function intermediary(...incoming) {
    stash.push([...incoming]);
    if (stash.length > lookahead) {
      reportFirstFromStash();
    }
  }
  traverseInner(tree1, intermediary, {
    depth: -1,
    path: ""
  }, stop1);
  if (stash.length) {
    for (let i = 0, len = stash.length; i < len; i++) {
      reportFirstFromStash();
    }
  }
}

var version$1 = "4.0.13";

const version = version$1;
const htmlCommentRegex = /<!--([\s\S]*?)-->/g;
const ranges = new Ranges();
function isObj(something) {
    return (something && typeof something === "object" && !Array.isArray(something));
}
const defaults = {
    cssStylesContent: "",
    alwaysCenter: false,
};
/**
 * Visual helper to place templating code around table tags into correct places
 */
function patcher(str, generalOpts) {
    // insurance
    // ---------------------------------------------------------------------------
    // if inputs are wrong, just return what was given
    if (typeof str !== "string" || str.length === 0) {
        return { result: str };
    }
    // setup
    // ---------------------------------------------------------------------------
    // clone the defaults, don't mutate the input argument object
    const opts = { ...defaults, ...generalOpts };
    if (opts.cssStylesContent &&
        // if not a string was passed
        (typeof opts.cssStylesContent !== "string" ||
            // or it was empty of full of whitespace
            !opts.cssStylesContent.trim())) {
        opts.cssStylesContent = "";
    }
    // the bizness
    // ---------------------------------------------------------------------------
    // traversal is done from a callback, same like Array.prototype.forEach()
    // you don't assign anything, as in "const x = traverse(..." -
    // instead, you do the deed inside the callback function
    //
    // ensure that we don't traverse inside comment tokens
    // practically we achieve that by comparing does current path start with
    // and of the known comment token paths:
    const knownCommentTokenPaths = [];
    traverse(cparser(str), (token, _val, innerObj) => {
        /* istanbul ignore else */
        if (isObj(token) &&
            token.type === "comment" &&
            !knownCommentTokenPaths.some((oneOfRecordedPaths) => innerObj.path.startsWith(oneOfRecordedPaths))) {
            knownCommentTokenPaths.push(innerObj.path);
        }
        else if (
        // tags are always stuck in an array, "root" level is array too
        // ast-monkey reports array elements as "key" and "value" is undefined.
        // if this was object, "key" would be key of key/value pair, "value"
        // would be value of the key/value pair.
        //
        // The tag itself is a plain object:
        isObj(token) &&
            // filter by type and tag name
            token.type === "tag" &&
            token.tagName === "table" &&
            !knownCommentTokenPaths.some((oneOfKnownCommentPaths) => innerObj.path.startsWith(oneOfKnownCommentPaths)) &&
            // ensure it's not closing, otherwise closing tags will be caught too:
            !token.closing &&
            // we wrap either raw text or esp template tag nodes only:
            token.children.some((childNodeObj) => ["text", "esp"].includes(childNodeObj.type))) {
            // so this table does have some text nodes straight inside TABLE tag
            // find out how many TD's are there on TR's that have TD's (if any exist)
            // then, that value, if greater then 1 will be the colspan value -
            // we'll wrap this text node's contents with one TR and one TD - but
            // set TD colspan to this value:
            let colspanVal = 1;
            // if td we decide the colspan contains some attributes, we'll note
            // down the range of where first attrib starts and last attrib ends
            // then slice that range and insert of every td, along the colspan
            let centered = false;
            let firstTrFound = {};
            if (
            // some TR's exist inside this TABLE tag
            token.children.some((childNodeObj) => childNodeObj.type === "tag" &&
                childNodeObj.tagName === "tr" &&
                !childNodeObj.closing &&
                (firstTrFound = childNodeObj))) {
                // console.log(
                //   `108 ${`\u001b[${33}m${`firstTrFound`}\u001b[${39}m`} = ${JSON.stringify(
                //     firstTrFound,
                //     null,
                //     4
                //   )}`
                // );
                // colspanVal is equal to the count of TD's inside children[] array
                // the only condition - we count consecutive TD's, any ESP or text
                // token breaks the counting
                let count = 0;
                // console.log(
                //   `132 FILTER ${`\u001b[${33}m${`firstTrFound.children`}\u001b[${39}m`} = ${JSON.stringify(
                //     firstTrFound.children,
                //     null,
                //     4
                //   )}`
                // );
                for (let i = 0, len = firstTrFound.children.length; i < len; i++) {
                    const obj = firstTrFound.children[i];
                    // console.log(
                    //   `141 ---------------- ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
                    //     obj,
                    //     null,
                    //     4
                    //   )}`
                    // );
                    // count consecutive TD's
                    if (obj.type === "tag" && obj.tagName === "td") {
                        if (!obj.closing) {
                            // detect center-alignment
                            centered = obj.attribs.some((attrib) => (attrib.attribName === "align" &&
                                attrib.attribValueRaw === "center") ||
                                (attrib.attribName === "style" &&
                                    /text-align:\s*center/i.test(attrib.attribValueRaw)));
                            count++;
                            if (count > colspanVal) {
                                colspanVal = count;
                            }
                        }
                        // else - ignore closing tags
                    }
                    else if (obj.type !== "text" ||
                        obj.value.replace(htmlCommentRegex, "").trim()) {
                        // reset
                        count = 0;
                    }
                    // console.log(
                    //   `174 ${`\u001b[${33}m${`count`}\u001b[${39}m`} = ${JSON.stringify(
                    //     count,
                    //     null,
                    //     4
                    //   )}`
                    // );
                }
            }
            //
            //
            //
            //                         T Y P E      I.
            //
            //
            //
            // -----------------------------------------------------------------------------
            // now filter all "text" type children nodes from this TABLE tag
            // this key below is the table tag we filtered in the beginning
            token.children
                // filter out text nodes:
                .filter((childNodeObj) => ["text", "esp"].includes(childNodeObj.type))
                // wrap each with TR+TD with colspan:
                .forEach((obj) => {
                if (obj.value.replace(htmlCommentRegex, "").trim()) {
                    // There will always be whitespace in nicely formatted tags,
                    // so ignore text tokens which have values that trim to zero length.
                    //
                    // Since trimmed value of zero length is already falsey, we don't
                    // need to do
                    // "if (obj.value.trim().length)" or
                    // "if (obj.value.trim() === "")" or
                    // "if (obj.value.trim().length === 0)"
                    //
                    ranges.push(obj.start, obj.end, `\n<tr>\n  <td${colspanVal > 1 ? ` colspan="${colspanVal}"` : ""}${opts.alwaysCenter || centered ? ` align="center"` : ""}${opts.cssStylesContent ? ` style="${opts.cssStylesContent}"` : ""}>\n    ${obj.value.trim()}\n  </td>\n</tr>\n`);
                }
            });
            //
            //
            //
            //                         T Y P E      II.
            //
            //
            //
            // -----------------------------------------------------------------------------
            token.children
                // filter out text nodes:
                .filter((obj) => obj.type === "tag" && obj.tagName === "tr" && !obj.closing)
                .forEach((trTag) => {
                // console.log(
                //   `224 ██ ${`\u001b[${33}m${`trTag`}\u001b[${39}m`} = ${JSON.stringify(
                //     trTag,
                //     null,
                //     4
                //   )}`
                // );
                // we use for loop because we need to look back, what token was
                // before, plus filter
                let doNothing = false;
                for (let i = 0, len = trTag.children.length; i < len; i++) {
                    const childNodeObj = trTag.children[i];
                    // deactivate
                    if (doNothing &&
                        childNodeObj.type === "comment" &&
                        childNodeObj.closing) {
                        doNothing = false;
                        continue;
                    }
                    // if a child node is opening comment node, activate doNothing
                    // until closing counterpart is found
                    if (!doNothing &&
                        childNodeObj.type === "comment" &&
                        !childNodeObj.closing) {
                        doNothing = true;
                    }
                    if (!doNothing &&
                        ["text", "esp"].includes(childNodeObj.type) &&
                        childNodeObj.value.trim()) {
                        if (childNodeObj.value.trim()) {
                            // There will always be whitespace in nicely formatted tags,
                            // so ignore text tokens which have values that trim to zero length.
                            if (!i) {
                                ranges.push(childNodeObj.start, childNodeObj.end, `\n  <td${colspanVal > 1 ? ` colspan="${colspanVal}"` : ""}${opts.alwaysCenter || centered ? ` align="center"` : ""}${opts.cssStylesContent
                                    ? ` style="${opts.cssStylesContent}"`
                                    : ""}>\n    ${childNodeObj.value.trim()}\n  </td>\n</tr>\n<tr>\n`);
                            }
                            else if (i && len > 1 && i === len - 1) {
                                ranges.push(childNodeObj.start, childNodeObj.end, `\n</tr>\n<tr>\n  <td${colspanVal > 1 ? ` colspan="${colspanVal}"` : ""}${opts.alwaysCenter || centered ? ` align="center"` : ""}${opts.cssStylesContent
                                    ? ` style="${opts.cssStylesContent}"`
                                    : ""}>\n    ${childNodeObj.value.trim()}\n  </td>\n`);
                            }
                            else {
                                ranges.push(childNodeObj.start, childNodeObj.end, `\n</tr>\n<tr>\n  <td${colspanVal > 1 ? ` colspan="${colspanVal}"` : ""}${opts.alwaysCenter || centered ? ` align="center"` : ""}${opts.cssStylesContent
                                    ? ` style="${opts.cssStylesContent}"`
                                    : ""}>\n    ${childNodeObj.value.trim()}\n  </td>\n</tr>\n<tr>\n`);
                            }
                        }
                    }
                }
            });
        }
    });
    if (ranges.current()) {
        const result = rApply(str, ranges.current());
        ranges.wipe();
        return { result };
    }
    return { result: str };
}

exports.defaults = defaults;
exports.patcher = patcher;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
