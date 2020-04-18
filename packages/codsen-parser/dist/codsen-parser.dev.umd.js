/**
 * codsen-parser
 * Parser aiming at broken code, especially HTML & CSS
 * Version: 0.5.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.codsenParser = factory());
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
   * ast-monkey-util
   * Utility library of AST helper functions
   * Version: 1.1.3
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-util
   */
  function pathNext(str) {
    if (typeof str !== "string" || !str.length) {
      return str;
    }

    if (str.includes(".") && /^\d*$/.test(str.slice(str.lastIndexOf(".") + 1))) {
      return `${str.slice(0, str.lastIndexOf(".") + 1)}${+str.slice(str.lastIndexOf(".") + 1) + 1}`;
    } else if (/^\d*$/.test(str)) {
      return `${+str + 1}`;
    }

    return str;
  }

  function pathPrev(str) {
    if (typeof str !== "string" || !str.length) {
      return null;
    }

    const extractedValue = str.slice(str.lastIndexOf(".") + 1);

    if (extractedValue === "0") {
      return null;
    } else if (str.includes(".") && /^\d*$/.test(extractedValue)) {
      return `${str.slice(0, str.lastIndexOf(".") + 1)}${+str.slice(str.lastIndexOf(".") + 1) - 1}`;
    } else if (/^\d*$/.test(str)) {
      return `${+str - 1}`;
    }

    return null;
  }

  function pathUp(str) {
    if (typeof str === "string") {
      if (!str.includes(".") || !str.slice(str.indexOf(".") + 1).includes(".")) {
        return "0";
      }

      let dotsCount = 0;

      for (let i = str.length; i--;) {
        if (str[i] === ".") {
          dotsCount++;
        }

        if (dotsCount === 2) {
          return str.slice(0, i);
        }
      }
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
  /** Used for built-in method references. */


  var funcProto = Function.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString = funcProto.toString;
  /** Used to infer the `Object` constructor. */

  var objectCtorString = funcToString.call(Object);

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var lodash_clonedeep = createCommonjsModule(function (module, exports) {
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

    var freeExports =  exports && !exports.nodeType && exports;
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
      getTag = function (value) {
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
   * string-left-right
   * Look what's to the left or the right of a given index within a string
   * Version: 2.3.20
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
   */

  function rightMain(str, idx, stopAtNewlines) {
    if (typeof str !== "string" || !str.length) {
      return null;
    }

    if (!idx || typeof idx !== "number") {
      idx = 0;
    }

    if (!str[idx + 1]) {
      return null;
    } else if (str[idx + 1] && (!stopAtNewlines && str[idx + 1].trim() || stopAtNewlines && (str[idx + 1].trim() || "\n\r".includes(str[idx + 1])))) {
      return idx + 1;
    } else if (str[idx + 2] && (!stopAtNewlines && str[idx + 2].trim() || stopAtNewlines && (str[idx + 2].trim() || "\n\r".includes(str[idx + 2])))) {
      return idx + 2;
    }

    for (let i = idx + 1, len = str.length; i < len; i++) {
      if (str[i] && (!stopAtNewlines && str[i].trim() || stopAtNewlines && (str[i].trim() || "\n\r".includes(str[i])))) {
        return i;
      }
    }

    return null;
  }

  function right(str, idx) {
    return rightMain(str, idx, false);
  }

  function leftMain(str, idx, stopAtNewlines) {
    if (typeof str !== "string" || !str.length) {
      return null;
    }

    if (!idx || typeof idx !== "number") {
      idx = 0;
    }

    if (idx < 1) {
      return null;
    } else if (str[idx - 1] && (!stopAtNewlines && str[idx - 1].trim() || stopAtNewlines && (str[idx - 1].trim() || "\n\r".includes(str[idx - 1])))) {
      return idx - 1;
    } else if (str[idx - 2] && (!stopAtNewlines && str[idx - 2].trim() || stopAtNewlines && (str[idx - 2].trim() || "\n\r".includes(str[idx - 2])))) {
      return idx - 2;
    }

    for (let i = idx; i--;) {
      if (str[i] && (!stopAtNewlines && str[i].trim() || stopAtNewlines && (str[i].trim() || "\n\r".includes(str[i])))) {
        return i;
      }
    }

    return null;
  }

  function left(str, idx) {
    return leftMain(str, idx, false);
  }

  /**
   * string-find-malformed
   * Search for a malformed string. Think of Levenshtein distance but in search.
   * Version: 1.1.4
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-find-malformed
   */

  function isObj(something) {
    return something && typeof something === "object" && !Array.isArray(something);
  }

  function isStr(something) {
    return typeof something === "string";
  }

  function strFindMalformed(str, refStr, cb, originalOpts) {
    if (!isStr(str)) {
      throw new TypeError(`string-find-malformed: [THROW_ID_01] the first input argument, string where to look for, must be a string! Currently it's equal to: ${str} (type: ${typeof str})`);
    } else if (!str.length) {
      return;
    }

    if (!isStr(refStr)) {
      throw new TypeError(`string-find-malformed: [THROW_ID_02] the second input argument, string we should find, must be a string! Currently it's equal to: ${refStr} (type: ${typeof refStr})`);
    } else if (!refStr.length) {
      return;
    }

    if (typeof cb !== "function") {
      throw new TypeError(`string-find-malformed: [THROW_ID_03] the third input argument, a callback function, must be a function! Currently it's equal to: ${cb} (type: ${typeof cb})`);
    }

    if (originalOpts && !isObj(originalOpts)) {
      throw new TypeError(`string-find-malformed: [THROW_ID_04] the fourth input argument, an Optional Options Object, must be a plain object! Currently it's equal to: ${originalOpts} (type: ${typeof originalOpts})`);
    }

    const defaults = {
      stringOffset: 0,
      maxDistance: 1,
      ignoreWhitespace: true
    };
    const opts = Object.assign({}, defaults, originalOpts);

    if (typeof opts.stringOffset === "string" && /^\d*$/.test(opts.stringOffset)) {
      opts.stringOffset = Number(opts.stringOffset);
    } else if (!Number.isInteger(opts.stringOffset) || opts.stringOffset < 0) {
      throw new TypeError(`${opts.source} [THROW_ID_05] opts.stringOffset must be a natural number or zero! Currently it's: ${opts.fromIndex}`);
    }

    const len = str.length;
    const len2 = Math.min(refStr.length, opts.maxDistance + 1);
    let pendingMatchesArr = [];
    const patience = opts.maxDistance;
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
          pendingMatchesArr[z].patienceLeft = pendingMatchesArr[z].patienceLeft - 1;
        } else {
          pendingMatchesArr[z].patienceLeft = pendingMatchesArr[z].patienceLeft - 1;

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
            idxFrom: idxFrom + opts.stringOffset,
            idxTo: idxTo + opts.stringOffset
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
   * html-all-known-attributes
   * All HTML attributes known to the Humanity
   * Version: 2.0.0
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/all-named-html-entities
   */
  const allHtmlAttribs = new Set(["abbr", "accept", "accept-charset", "accesskey", "action", "align", "alink", "allow", "alt", "archive", "async", "autocapitalize", "autocomplete", "autofocus", "autoplay", "axis", "background", "background-attachment", "background-color", "background-image", "background-position", "background-position-x", "background-position-y", "background-repeat", "bgcolor", "border", "border-bottom", "border-bottom-color", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-style", "border-top", "border-top-color", "border-top-style", "border-top-width", "border-width", "buffered", "capture", "cellpadding", "cellspacing", "challenge", "char", "charoff", "charset", "checked", "cite", "class", "classid", "clear", "clip", "code", "codebase", "codetype", "color", "cols", "colspan", "column-span", "compact", "content", "contenteditable", "contextmenu", "controls", "coords", "crossorigin", "csp", "cursor", "data", "data-*", "datetime", "declare", "decoding", "default", "defer", "dir", "direction", "dirname", "disabled", "display", "download", "draggable", "dropzone", "enctype", "enterkeyhint", "face", "filter", "float", "font", "font-color", "font-emphasize", "font-emphasize-position", "font-emphasize-style", "font-family", "font-size", "font-style", "font-variant", "font-weight", "for", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "frame", "frameborder", "frontuid", "headers", "height", "hidden", "high", "horiz-align", "href", "hreflang", "hspace", "http-equiv", "icon", "id", "importance", "inputmode", "integrity", "intrinsicsize", "ismap", "itemprop", "keytype", "kind", "label", "lang", "language", "layout-flow", "layout-grid", "layout-grid-char", "layout-grid-line", "layout-grid-mode", "layout-grid-type", "left", "letter-spacing", "line-break", "line-height", "link", "list", "list-image-1", "list-image-2", "list-image-3", "list-style", "list-style-image", "list-style-position", "list-style-type", "loading", "longdesc", "loop", "low", "manifest", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "marginheight", "marginwidth", "max", "maxlength", "media", "method", "min", "minlength", "mso-ansi-font-size", "mso-ansi-font-style", "mso-ansi-font-weight", "mso-ansi-language", "mso-ascii-font-family", "mso-background", "mso-background-source", "mso-baseline-position", "mso-bidi-flag", "mso-bidi-font-family", "mso-bidi-font-size", "mso-bidi-font-style", "mso-bidi-font-weight", "mso-bidi-language", "mso-bookmark", "mso-border-alt", "mso-border-between", "mso-border-between-color", "mso-border-between-style", "mso-border-between-width", "mso-border-bottom-alt", "mso-border-bottom-color-alt", "mso-border-bottom-source", "mso-border-bottom-style-alt", "mso-border-bottom-width-alt", "mso-border-color-alt", "mso-border-effect", "mso-border-left-alt", "mso-border-left-color-alt", "mso-border-left-source", "mso-border-left-style-alt", "mso-border-left-width-alt", "mso-border-right-alt", "mso-border-right-color-alt", "mso-border-right-source", "mso-border-right-style-alt", "mso-border-right-width-alt", "mso-border-shadow", "mso-border-source", "mso-border-style-alt", "mso-border-top-alt", "mso-border-top-color-alt", "mso-border-top-source", "mso-border-top-style-alt", "mso-border-top-width-alt", "mso-border-width-alt", "mso-break-type", "mso-build", "mso-build-after-action", "mso-build-after-color", "mso-build-auto-secs", "mso-build-avi", "mso-build-dual-id", "mso-build-order", "mso-build-sound-name", "mso-bullet-image", "mso-cell-special", "mso-cellspacing", "mso-char-indent", "mso-char-indent-count", "mso-char-indent-size", "mso-char-type", "mso-char-wrap", "mso-color-alt", "mso-color-index", "mso-color-source", "mso-column-break-before", "mso-column-separator", "mso-columns", "mso-comment-author", "mso-comment-continuation", "mso-comment-id", "mso-comment-reference", "mso-data-placement", "mso-default-height", "mso-default-width", "mso-diagonal-down", "mso-diagonal-down-color", "mso-diagonal-down-source", "mso-diagonal-down-style", "mso-diagonal-down-width", "mso-diagonal-up", "mso-diagonal-up-color", "mso-diagonal-up-source", "mso-diagonal-up-style", "mso-diagonal-up-width", "mso-displayed-decimal-separator", "mso-displayed-thousand-separator", "mso-element", "mso-element-anchor-horizontal", "mso-element-anchor-lock", "mso-element-anchor-vertical", "mso-element-frame-height", "mso-element-frame-hspace", "mso-element-frame-vspace", "mso-element-frame-width", "mso-element-left", "mso-element-linespan", "mso-element-top", "mso-element-wrap", "mso-endnote-continuation-notice", "mso-endnote-continuation-notice-id", "mso-endnote-continuation-notice-src", "mso-endnote-continuation-separator", "mso-endnote-continuation-separator-id", "mso-endnote-continuation-separator-src", "mso-endnote-display", "mso-endnote-id", "mso-endnote-numbering", "mso-endnote-numbering-restart", "mso-endnote-numbering-start", "mso-endnote-numbering-style", "mso-endnote-position", "mso-endnote-separator", "mso-endnote-separator-id", "mso-endnote-separator-src", "mso-even-footer", "mso-even-footer-id", "mso-even-footer-src", "mso-even-header", "mso-even-header-id", "mso-even-header-src", "mso-facing-pages", "mso-fareast-font-family", "mso-fareast-hint", "mso-fareast-language", "mso-field-change", "mso-field-change-author", "mso-field-change-time", "mso-field-change-value", "mso-field-code", "mso-field-lock", "mso-fills-color", "mso-first-footer", "mso-first-footer-id", "mso-first-footer-src", "mso-first-header", "mso-first-header-id", "mso-first-header-src", "mso-font-alt", "mso-font-charset", "mso-font-format", "mso-font-info", "mso-font-info-charset", "mso-font-info-type", "mso-font-kerning", "mso-font-pitch", "mso-font-signature", "mso-font-signature-csb-one", "mso-font-signature-csb-two", "mso-font-signature-usb-four", "mso-font-signature-usb-one", "mso-font-signature-usb-three", "mso-font-signature-usb-two", "mso-font-src", "mso-font-width", "mso-footer", "mso-footer-data", "mso-footer-id", "mso-footer-margin", "mso-footer-src", "mso-footnote-continuation-notice", "mso-footnote-continuation-notice-id", "mso-footnote-continuation-notice-src", "mso-footnote-continuation-separator", "mso-footnote-continuation-separator-id", "mso-footnote-continuation-separator-src", "mso-footnote-id", "mso-footnote-numbering", "mso-footnote-numbering-restart", "mso-footnote-numbering-start", "mso-footnote-numbering-style", "mso-footnote-position", "mso-footnote-separator", "mso-footnote-separator-id", "mso-footnote-separator-src", "mso-foreground", "mso-forms-protection", "mso-generic-font-family", "mso-grid-bottom", "mso-grid-bottom-count", "mso-grid-left", "mso-grid-left-count", "mso-grid-right", "mso-grid-right-count", "mso-grid-top", "mso-grid-top-count", "mso-gutter-direction", "mso-gutter-margin", "mso-gutter-position", "mso-hansi-font-family", "mso-header", "mso-header-data", "mso-header-id", "mso-header-margin", "mso-header-src", "mso-height-alt", "mso-height-rule", "mso-height-source", "mso-hide", "mso-highlight", "mso-horizontal-page-align", "mso-hyphenate", "mso-ignore", "mso-kinsoku-overflow", "mso-layout-grid-align", "mso-layout-grid-char-alt", "mso-layout-grid-origin", "mso-level-inherit", "mso-level-legacy", "mso-level-legacy-indent", "mso-level-legacy-space", "mso-level-legal-format", "mso-level-number-format", "mso-level-number-position", "mso-level-numbering", "mso-level-reset-level", "mso-level-start-at", "mso-level-style-link", "mso-level-suffix", "mso-level-tab-stop", "mso-level-text", "mso-line-break-override", "mso-line-grid", "mso-line-height-alt", "mso-line-height-rule", "mso-line-numbers-count-by", "mso-line-numbers-distance", "mso-line-numbers-restart", "mso-line-numbers-start", "mso-line-spacing", "mso-linked-frame", "mso-list", "mso-list-change", "mso-list-change-author", "mso-list-change-time", "mso-list-change-values", "mso-list-id", "mso-list-ins", "mso-list-ins-author", "mso-list-ins-time", "mso-list-name", "mso-list-template-ids", "mso-list-type", "mso-margin-bottom-alt", "mso-margin-left-alt", "mso-margin-top-alt", "mso-mirror-margins", "mso-negative-indent-tab", "mso-number-format", "mso-outline-level", "mso-outline-parent", "mso-outline-parent-col", "mso-outline-parent-row", "mso-outline-parent-visibility", "mso-outline-style", "mso-padding-alt", "mso-padding-between", "mso-padding-bottom-alt", "mso-padding-left-alt", "mso-padding-right-alt", "mso-padding-top-alt", "mso-page-border-aligned", "mso-page-border-art", "mso-page-border-bottom-art", "mso-page-border-display", "mso-page-border-left-art", "mso-page-border-offset-from", "mso-page-border-right-art", "mso-page-border-surround-footer", "mso-page-border-surround-header", "mso-page-border-top-art", "mso-page-border-z-order", "mso-page-numbers", "mso-page-numbers-chapter-separator", "mso-page-numbers-chapter-style", "mso-page-numbers-start", "mso-page-numbers-style", "mso-page-orientation", "mso-page-scale", "mso-pagination", "mso-panose-arm-style", "mso-panose-contrast", "mso-panose-family-type", "mso-panose-letterform", "mso-panose-midline", "mso-panose-proportion", "mso-panose-serif-style", "mso-panose-stroke-variation", "mso-panose-weight", "mso-panose-x-height", "mso-paper-source", "mso-paper-source-first-page", "mso-paper-source-other-pages", "mso-pattern", "mso-pattern-color", "mso-pattern-style", "mso-print-area", "mso-print-color", "mso-print-gridlines", "mso-print-headings", "mso-print-resolution", "mso-print-sheet-order", "mso-print-title-column", "mso-print-title-row", "mso-prop-change", "mso-prop-change-author", "mso-prop-change-time", "mso-protection", "mso-rotate", "mso-row-margin-left", "mso-row-margin-right", "mso-ruby-merge", "mso-ruby-visibility", "mso-scheme-fill-color", "mso-scheme-shadow-color", "mso-shading", "mso-shadow-color", "mso-space-above", "mso-space-below", "mso-spacerun", "mso-special-character", "mso-special-format", "mso-style-id", "mso-style-name", "mso-style-next", "mso-style-parent", "mso-style-type", "mso-style-update", "mso-subdocument", "mso-symbol-font-family", "mso-tab-count", "mso-table-anchor-horizontal", "mso-table-anchor-vertical", "mso-table-bspace", "mso-table-del-author", "mso-table-del-time", "mso-table-deleted", "mso-table-dir", "mso-table-ins-author", "mso-table-ins-time", "mso-table-inserted", "mso-table-layout-alt", "mso-table-left", "mso-table-lspace", "mso-table-overlap", "mso-table-prop-author", "mso-table-prop-change", "mso-table-prop-time", "mso-table-rspace", "mso-table-top", "mso-table-tspace", "mso-table-wrap", "mso-text-animation", "mso-text-combine-brackets", "mso-text-combine-id", "mso-text-control", "mso-text-fit-id", "mso-text-indent-alt", "mso-text-orientation", "mso-text-raise", "mso-title-page", "mso-tny-compress", "mso-unsynced", "mso-vertical-align-alt", "mso-vertical-align-special", "mso-vertical-page-align", "mso-width-alt", "mso-width-source", "mso-word-wrap", "mso-xlrowspan", "mso-zero-height", "multiple", "muted", "name", "nav-banner-image", "navbutton_background_color", "navbutton_home_hovered", "navbutton_home_normal", "navbutton_home_pushed", "navbutton_horiz_hovered", "navbutton_horiz_normal", "navbutton_horiz_pushed", "navbutton_next_hovered", "navbutton_next_normal", "navbutton_next_pushed", "navbutton_prev_hovered", "navbutton_prev_normal", "navbutton_prev_pushed", "navbutton_up_hovered", "navbutton_up_normal", "navbutton_up_pushed", "navbutton_vert_hovered", "navbutton_vert_normal", "navbutton_vert_pushed", "nohref", "noresize", "noshade", "novalidate", "nowrap", "object", "onblur", "onchange", "onclick", "ondblclick", "onfocus", "onkeydown", "onkeypress", "onkeyup", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onreset", "onselect", "onsubmit", "onunload", "open", "optimum", "overflow", "padding", "padding-bottom", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "panose-1", "pattern", "ping", "placeholder", "position", "poster", "preload", "profile", "prompt", "punctuation-trim", "punctuation-wrap", "radiogroup", "readonly", "referrerpolicy", "rel", "required", "rev", "reversed", "right", "row-span", "rows", "rowspan", "ruby-align", "ruby-overhang", "ruby-position", "rules", "sandbox", "scheme", "scope", "scoped", "scrolling", "selected", "separator-image", "shape", "size", "sizes", "slot", "span", "spellcheck", "src", "srcdoc", "srclang", "srcset", "standby", "start", "step", "style", "summary", "tab-interval", "tab-stops", "tabindex", "table-border-color-dark", "table-border-color-light", "table-layout", "target", "text", "text-align", "text-autospace", "text-combine", "text-decoration", "text-effect", "text-fit", "text-indent", "text-justify", "text-justify-trim", "text-kashida", "text-line-through", "text-shadow", "text-transform", "text-underline", "text-underline-color", "text-underline-style", "title", "top", "top-bar-button", "translate", "type", "unicode-bidi", "urlId", "usemap", "valign", "value", "valuetype", "version", "vert-align", "vertical-align", "visibility", "vlink", "vnd.ms-excel.numberformat", "vspace", "white-space", "width", "word-break", "word-spacing", "wrap", "xmlns", "z-index"]);

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

  function isObj$1(something) {
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

    if (isObj$1(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
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

    if (originalOpts && !isObj$1(originalOpts)) {
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
   * is-html-tag-opening
   * Is given opening bracket a beginning of a tag?
   * Version: 1.7.4
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-tag-opening
   */
  const BACKSLASH = "\u005C";
  const knownHtmlTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h1 - h6", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "slot", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xml"];

  function isStr$2(something) {
    return typeof something === "string";
  }

  function isNotLetter(char) {
    return char === undefined || char.toUpperCase() === char.toLowerCase() && !`0123456789`.includes(char) && char !== "=";
  }

  function isOpening(str, idx = 0, originalOpts) {
    const defaults = {
      allowCustomTagNames: false,
      skipOpeningBracket: false
    };
    const opts = Object.assign({}, defaults, originalOpts);
    const whitespaceChunk = `[\\\\ \\t\\r\\n/]*`;
    const generalChar = `._a-z0-9\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\uFFFF`;
    const r1 = new RegExp(`^${opts.skipOpeningBracket ? "" : "<"}${whitespaceChunk}\\w+${whitespaceChunk}>`, "g");
    const r5 = new RegExp(`^${opts.skipOpeningBracket ? "" : "<"}${whitespaceChunk}[${generalChar}]+[-${generalChar}]*${whitespaceChunk}>`, "g");
    const r2 = new RegExp(`^${opts.skipOpeningBracket ? "" : "<"}\\s*\\w+\\s+\\w+(?:-\\w+)?\\s*=\\s*['"\\w]`, "g");
    const r6 = new RegExp(`^${opts.skipOpeningBracket ? "" : "<"}\\s*\\w+\\s+[${generalChar}]+[-${generalChar}]*(?:-\\w+)?\\s*=\\s*['"\\w]`);
    const r3 = new RegExp(`^${opts.skipOpeningBracket ? "" : "<"}\\s*\\/?\\s*\\w+\\s*\\/?\\s*>`, "g");
    const r7 = new RegExp(`^${opts.skipOpeningBracket ? "" : "<"}\\s*\\/?\\s*[${generalChar}]+[-${generalChar}]*\\s*\\/?\\s*>`, "g");
    const r4 = new RegExp(`^${opts.skipOpeningBracket ? "" : "<"}${whitespaceChunk}\\w+(?:\\s*\\w+)*\\s*\\w+=['"]`, "g");
    const r8 = new RegExp(`^${opts.skipOpeningBracket ? "" : "<"}${whitespaceChunk}[${generalChar}]+[-${generalChar}]*(?:\\s*\\w+)*\\s*\\w+=['"]`, "g");
    const whatToTest = idx ? str.slice(idx) : str;
    let passed = false;
    const matchingOptions = {
      cb: isNotLetter,
      i: true,
      trimCharsBeforeMatching: ["/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
    };

    if (opts.allowCustomTagNames) {
      if (r5.test(whatToTest)) {
        passed = true;
      } else if (r6.test(whatToTest)) {
        passed = true;
      } else if (r7.test(whatToTest)) {
        passed = true;
      } else if (r8.test(whatToTest)) {
        passed = true;
      }
    } else if (matchRightIncl(str, idx, knownHtmlTags, {
      cb: isNotLetter,
      i: true,
      trimCharsBeforeMatching: ["<", "/", BACKSLASH, "!", " ", "\t", "\n", "\r"]
    })) {
      if (r1.test(whatToTest)) {
        passed = true;
      } else if (r2.test(whatToTest)) {
        passed = true;
      } else if (r3.test(whatToTest)) {
        passed = true;
      } else if (r4.test(whatToTest)) {
        passed = true;
      }
    }

    if (!passed && !opts.skipOpeningBracket && str[idx] === "<" && str[idx + 1].trim() && matchRight(str, idx, knownHtmlTags, matchingOptions)) {
      passed = true;
    }

    const res = isStr$2(str) && idx < str.length && passed;
    return res;
  }

  /**
   * is-char-suitable-for-html-attr-name
   * Is given character suitable to be in an HTML attribute's name?
   * Version: 1.1.0
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-char-suitable-for-html-attr-name
   */
  function charSuitableForHTMLAttrName(char) {
    return typeof char === "string" && (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123 || char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58 || char === ":" || char === "-");
  }

  /**
   * ranges-is-index-within
   * Efficiently checks if index is within any of the given ranges
   * Version: 1.14.32
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-is-index-within
   */
  const isArr = Array.isArray;

  function rangesIsIndexWithin(originalIndex, rangesArr, originalOpts) {
    const defaults = {
      inclusiveRangeEnds: false,
      returnMatchedRangeInsteadOfTrue: false
    };
    const opts = Object.assign(Object.assign({}, defaults), originalOpts);

    if (!isArr(rangesArr)) {
      return false;
    }

    if (opts.returnMatchedRangeInsteadOfTrue) {
      return rangesArr.find(arr => opts.inclusiveRangeEnds ? originalIndex >= arr[0] && originalIndex <= arr[1] : originalIndex > arr[0] && originalIndex < arr[1]) || false;
    }

    return rangesArr.some(arr => opts.inclusiveRangeEnds ? originalIndex >= arr[0] && originalIndex <= arr[1] : originalIndex > arr[0] && originalIndex < arr[1]);
  }

  /**
   * string-split-by-whitespace
   * Split string into array by chunks of whitespace
   * Version: 1.6.61
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-split-by-whitespace
   */

  function split(str, originalOpts) {
    if (str === undefined) {
      throw new Error("string-split-by-whitespace: [THROW_ID_01] The input is missing!");
    }

    if (typeof str !== "string") {
      return str;
    }

    if (str.trim() === "") {
      return [];
    }

    const defaults = {
      ignoreRanges: []
    };
    const opts = Object.assign({}, defaults, originalOpts);

    if (opts.ignoreRanges.length > 0 && !opts.ignoreRanges.every(arr => Array.isArray(arr))) {
      throw new Error("string-split-by-whitespace: [THROW_ID_03] The opts.ignoreRanges contains elements which are not arrays!");
    }

    let nonWhitespaceSubStringStartsAt = null;
    const res = [];

    for (let i = 0, len = str.length; i < len; i++) {
      if (nonWhitespaceSubStringStartsAt === null && str[i].trim() !== "" && (opts.ignoreRanges.length === 0 || opts.ignoreRanges.length !== 0 && !rangesIsIndexWithin(i, opts.ignoreRanges.map(arr => [arr[0], arr[1] - 1]), {
        inclusiveRangeEnds: true
      }))) {
        nonWhitespaceSubStringStartsAt = i;
      }

      if (nonWhitespaceSubStringStartsAt !== null) {
        if (str[i].trim() === "") {
          res.push(str.slice(nonWhitespaceSubStringStartsAt, i));
          nonWhitespaceSubStringStartsAt = null;
        } else if (opts.ignoreRanges.length && rangesIsIndexWithin(i, opts.ignoreRanges)) {
          res.push(str.slice(nonWhitespaceSubStringStartsAt, i - 1));
          nonWhitespaceSubStringStartsAt = null;
        } else if (str[i + 1] === undefined) {
          res.push(str.slice(nonWhitespaceSubStringStartsAt, i + 1));
        }
      }
    }

    return res;
  }

  /**
   * is-html-attribute-closing
   * Is a character on a given index a closing of an HTML attribute?
   * Version: 1.1.1
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-attribute-closing
   */

  function ensureXIsNotPresentBeforeOneOfY(str, startingIdx, x, y = []) {
    for (let i = startingIdx, len = str.length; i < len; i++) {
      if (y.some(oneOfStr => str.startsWith(oneOfStr, i))) {
        return true;
      } else if (str[i] === x) {
        return false;
      }
    }

    return true;
  }

  function xBeforeYOnTheRight(str, startingIdx, x, y) {
    for (let i = startingIdx, len = str.length; i < len; i++) {
      if (str.startsWith(x, i)) {
        return true;
      } else if (str.startsWith(y, i)) {
        return false;
      }
    }

    return false;
  }

  function plausibleAttrStartsAtX(str, start) {
    if (!charSuitableForHTMLAttrName(str[start]) || !start) {
      return false;
    }

    const regex = /^[a-zA-Z0-9:-]*(\s*[=]?\s*((?:'[^']*')|(?:"[^"]*")))|( [^/>'"=]*['"])/;
    return regex.test(str.slice(start));
  }

  function guaranteedAttrStartsAtX(str, start) {
    if (!charSuitableForHTMLAttrName(str[start]) || !start) {
      return false;
    }

    const regex = /^[a-zA-Z0-9:-]*=(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/;
    return regex.test(str.slice(start));
  }

  function findAttrNameCharsChunkOnTheLeft(str, i) {
    if (!charSuitableForHTMLAttrName(str[left(str, i)])) {
      return;
    }

    for (let y = i; y--;) {
      if (str[y].trim().length && !charSuitableForHTMLAttrName(str[y])) {
        return str.slice(y + 1, i);
      }
    }
  }

  function makeTheQuoteOpposite(quoteChar) {
    return quoteChar === `'` ? `"` : `'`;
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
    let lastMatchedQuotesPairsStartIsAt = false;
    let lastMatchedQuotesPairsEndIsAt = false;
    let lastCapturedChunk;
    let lastChunkWasCapturedAfterSuspectedClosing = false;
    let closingBracketMet = false;
    let openingBracketMet = false;

    for (let i = idxOfAttrOpening, len = str.length; i < len; i++) {
      if (`'"`.includes(str[i]) && lastQuoteWasMatched && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && lastMatchedQuotesPairsEndIsAt < i && i >= isThisClosingIdx) {
        const E1 = i !== isThisClosingIdx || guaranteedAttrStartsAtX(str, right(str, isThisClosingIdx)) || `/>`.includes(str[right(str, i)]);
        const E2 = !(i > isThisClosingIdx && str[idxOfAttrOpening] === str[isThisClosingIdx] && str[idxOfAttrOpening] === str[i] && plausibleAttrStartsAtX(str, i + 1));
        const E31 = i === isThisClosingIdx && plausibleAttrStartsAtX(str, isThisClosingIdx + 1);
        const E32 = chunkStartsAt && chunkStartsAt < i && allHtmlAttribs.has(str.slice(chunkStartsAt, i).trim());
        const E33 = chunkStartsAt && chunkStartsAt < i && str[chunkStartsAt - 1] && !str[chunkStartsAt - 1].trim() && Array.from(str.slice(chunkStartsAt, i).trim()).every(char => charSuitableForHTMLAttrName(char)) && str[idxOfAttrOpening] === str[isThisClosingIdx];
        let attrNameCharsChunkOnTheLeft;

        if (i === isThisClosingIdx) {
          attrNameCharsChunkOnTheLeft = findAttrNameCharsChunkOnTheLeft(str, i);
        }

        const E34 = i === isThisClosingIdx && (!charSuitableForHTMLAttrName(str[left(str, i)]) || attrNameCharsChunkOnTheLeft && !allHtmlAttribs.has(attrNameCharsChunkOnTheLeft)) && str[left(str, i)] !== "=";
        const E41 = `/>`.includes(str[right(str, i)]) && i === isThisClosingIdx;
        const E42 = charSuitableForHTMLAttrName(str[right(str, i)]);
        const E43 = lastQuoteWasMatched && i !== isThisClosingIdx;
        return E1 && E2 && (E31 || E32 || E33 || E34) && (E41 || E42 || E43);
      }

      if (`'"`.includes(str[i])) {
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

        if (totalQuotesCount && quotesCount.get(`matchedPairs`) && totalQuotesCount === quotesCount.get(`matchedPairs`) * 2 && i < isThisClosingIdx) {
          return false;
        }
      }

      if (str[i] === "<" && closingBracketMet && !openingBracketMet) {
        openingBracketMet = true;
        return false;
      }

      if (str[i].trim() && !chunkStartsAt) {
        if (charSuitableForHTMLAttrName(str[i])) {
          chunkStartsAt = i;
        }
      } else if (chunkStartsAt && !charSuitableForHTMLAttrName(str[i])) {
        lastCapturedChunk = str.slice(chunkStartsAt, i);
        lastChunkWasCapturedAfterSuspectedClosing = chunkStartsAt >= isThisClosingIdx;

        if (`'"`.includes(str[i]) && quotesCount.get(`matchedPairs`) === 0 && totalQuotesCount === 3 && str[idxOfAttrOpening] === str[i] && allHtmlAttribs.has(lastCapturedChunk)) {
          const A1 = i > isThisClosingIdx;
          const A21 = !lastQuoteAt;
          const A22 = lastQuoteAt + 1 >= i;
          const A23 = split(str.slice(lastQuoteAt + 1, i)).every(chunk => allHtmlAttribs.has(chunk));
          const B1 = i === isThisClosingIdx;
          const B21 = totalQuotesCount < 3;
          const B22 = !!lastQuoteWasMatched;
          const B23 = !lastQuoteAt;
          const B24 = lastQuoteAt + 1 >= i;
          const B25 = !split(str.slice(lastQuoteAt + 1, i)).every(chunk => allHtmlAttribs.has(chunk));
          return A1 && (A21 || A22 || A23) || B1 && (B21 || B22 || B23 || B24 || B25);
        } else if (lastCapturedChunk && allHtmlAttribs.has(lastCapturedChunk) && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && lastMatchedQuotesPairsEndIsAt === isThisClosingIdx) {
          return true;
        }
      }

      if (`'"`.includes(str[i]) && (!(quotesCount.get(`"`) % 2) || !(quotesCount.get(`'`) % 2)) && (quotesCount.get(`"`) + quotesCount.get(`'`)) % 2 && (lastCapturedChunk && allHtmlAttribs.has(lastCapturedChunk) || i > isThisClosingIdx + 1 && allHtmlAttribs.has(str.slice(isThisClosingIdx + 1, i).trim()))) {
        const R0 = i > isThisClosingIdx;
        const R1 = !!openingQuote;
        const R2 = str[idxOfAttrOpening] !== str[isThisClosingIdx];
        const R3 = allHtmlAttribs.has(str.slice(idxOfAttrOpening + 1, isThisClosingIdx).trim());
        const R4 = !xBeforeYOnTheRight(str, i + 1, str[isThisClosingIdx], makeTheQuoteOpposite(str[isThisClosingIdx]));
        return R0 && !(R1 && R2 && R3 && R4);
      } else if ((str[i] === "=" || !str[i].length && str[right(str, i)] === "=") && lastCapturedChunk && allHtmlAttribs.has(lastCapturedChunk)) {
        const W1 = i > isThisClosingIdx;
        const W2 = !(!(lastQuoteWasMatched && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && lastMatchedQuotesPairsEndIsAt === isThisClosingIdx || guaranteedAttrStartsAtX(str, chunkStartsAt)) && lastQuoteWasMatched && lastMatchedQuotesPairsStartIsAt && lastMatchedQuotesPairsStartIsAt <= isThisClosingIdx);
        return W1 && W2;
      }

      if (i > isThisClosingIdx) {
        if (openingQuote && str[i] === openingQuote) {
          const Y1 = !!lastQuoteAt;
          const Y2 = lastQuoteAt === isThisClosingIdx;
          const Y3 = lastQuoteAt + 1 < i && str.slice(lastQuoteAt + 1, i).trim();
          const Y4 = split(str.slice(lastQuoteAt + 1, i)).every(chunk => allHtmlAttribs.has(chunk));
          const Y5 = i >= isThisClosingIdx;
          return Y1 && Y2 && Y3 && Y4 && Y5;
        }

        if (openingQuote && str[isThisClosingIdx] === oppositeToOpeningQuote && str[i] === oppositeToOpeningQuote) {
          return false;
        } else if (str[i] === "/" || str[i] === ">" || str[i] === "<") {
          const R0 = str[idxOfAttrOpening] === str[isThisClosingIdx] && lastQuoteAt === isThisClosingIdx && !str.slice(idxOfAttrOpening + 1, isThisClosingIdx).includes(str[idxOfAttrOpening]);
          const R11 = quotesCount.get(`matchedPairs`) < 2;
          const attrNameCharsChunkOnTheLeft = findAttrNameCharsChunkOnTheLeft(str, i);
          const R12 = (!attrNameCharsChunkOnTheLeft || !allHtmlAttribs.has(attrNameCharsChunkOnTheLeft)) && (!(i > isThisClosingIdx && quotesCount.get(`'`) && quotesCount.get(`"`) && quotesCount.get(`matchedPairs`) > 1) || `/>`.includes(str[right(str, i)]));
          const R2 = totalQuotesCount < 3 || quotesCount.get(`"`) + quotesCount.get(`'`) - quotesCount.get(`matchedPairs`) * 2 !== 2;
          const R31 = !lastQuoteWasMatched || lastQuoteWasMatched && !(lastMatchedQuotesPairsStartIsAt && Array.from(str.slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt).trim()).every(char => charSuitableForHTMLAttrName(char)) && allHtmlAttribs.has(str.slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt).trim()));
          const R32 = !right(str, i) && totalQuotesCount % 2 === 0;
          const R33 = str[idxOfAttrOpening - 2] && str[idxOfAttrOpening - 1] === "=" && charSuitableForHTMLAttrName(str[idxOfAttrOpening - 2]);
          const R34 = !ensureXIsNotPresentBeforeOneOfY(str, i + 1, "<", [`='`, `="`]);
          return R0 || (R11 || R12) && R2 && (R31 || R32 || R33 || R34);
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
        }) && charSuitableForHTMLAttrName(str[firstNonWhitespaceCharOnTheLeft])) {
          return false;
        }

        if (i === isThisClosingIdx && guaranteedAttrStartsAtX(str, i + 1)) {
          return true;
        }

        if (i < isThisClosingIdx && `'"`.includes(str[i]) && lastCapturedChunk && str[left(str, idxOfAttrOpening)] && str[left(str, idxOfAttrOpening)] !== "=" && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && allHtmlAttribs.has(lastCapturedChunk)) {
          return false;
        }
      }

      if (`'"`.includes(str[i]) && i > isThisClosingIdx) {
        if (!lastChunkWasCapturedAfterSuspectedClosing || !lastCapturedChunk || !allHtmlAttribs.has(lastCapturedChunk)) {
          return false;
        }

        return true;
      }

      if (`'"`.includes(str[i])) {
        lastQuoteAt = i;
      }

      if (chunkStartsAt && !charSuitableForHTMLAttrName(str[i])) {
        chunkStartsAt = null;
      }
    }

    return false;
  }

  /**
   * codsen-tokenizer
   * HTML and CSS Lexer aimed at code with fatal errors
   * Version: 2.12.1
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
   */
  const allHTMLTagsKnownToHumanity = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"];
  const espChars = `{}%-$_()*|`;
  const espLumpBlacklist = [")|(", "|(", ")(", "()", "{}", "%)", "*)", "**"];

  function isStr$3(something) {
    return typeof something === "string";
  }

  function isLatinLetter(char) {
    return isStr$3(char) && char.length === 1 && (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123);
  }

  function charSuitableForTagName(char) {
    return /[.\-_a-z0-9\u00B7\u00C0-\uFFFD]/i.test(char);
  }

  function flipEspTag(str) {
    let res = "";

    for (let i = 0, len = str.length; i < len; i++) {
      if (str[i] === "[") {
        res = `]${res}`;
      } else if (str[i] === "{") {
        res = `}${res}`;
      } else if (str[i] === "(") {
        res = `)${res}`;
      } else {
        res = `${str[i]}${res}`;
      }
    }

    return res;
  }

  function isTagNameRecognised(tagName) {
    return allHTMLTagsKnownToHumanity.includes(tagName.toLowerCase()) || ["doctype", "cdata", "xml"].includes(tagName.toLowerCase());
  }

  function xBeforeYOnTheRight$1(str, startingIdx, x, y) {
    for (let i = startingIdx, len = str.length; i < len; i++) {
      if (str.startsWith(x, i)) {
        return true;
      } else if (str.startsWith(y, i)) {
        return false;
      }
    }

    return false;
  }

  function startsEsp(str, i, token, layers, styleStarts) {
    return espChars.includes(str[i]) && str[i + 1] && espChars.includes(str[i + 1]) && token.type !== "rule" && token.type !== "at" && !(str[i] === "-" && "-{(".includes(str[i + 1])) && !("})".includes(str[i]) && "-".includes(str[i + 1])) && !("0123456789".includes(str[left(str, i)]) && (!str[i + 2] || [`"`, `'`, ";"].includes(str[i + 2]) || !str[i + 2].trim().length)) && !(styleStarts && ("{}".includes(str[i]) || "{}".includes(str[right(str, i)])));
  }

  const BACKSLASH$1 = "\u005C";

  function startsTag(str, i, token, layers) {
    return str[i] && str[i].trim().length && (!layers.length || token.type === "text") && !["doctype", "xml"].includes(token.kind) && (str[i] === "<" && (isOpening(str, i, {
      allowCustomTagNames: true
    }) || str[right(str, i)] === ">" || matchRight(str, i, ["doctype", "xml", "cdata"], {
      i: true,
      trimBeforeMatching: true,
      trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
    })) || isLatinLetter(str[i]) && (!str[i - 1] || !isLatinLetter(str[i - 1]) && !["<", "/", "!", BACKSLASH$1].includes(str[left(str, i)])) && isOpening(str, i, {
      allowCustomTagNames: false,
      skipOpeningBracket: true
    })) && (token.type !== "esp" || token.tail.includes(str[i]));
  }

  function startsComment(str, i, token) {
    return (str[i] === "<" && (matchRight(str, i, ["!--"], {
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
    })) && (token.type !== "esp" || token.tail.includes(str[i]));
  }

  function isObj$2(something) {
    return something && typeof something === "object" && !Array.isArray(something);
  }

  const voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
  const charsThatEndCSSChunks = ["{", "}", ","];

  function tokenizer(str, originalOpts) {
    const start = Date.now();

    if (!isStr$3(str)) {
      if (str === undefined) {
        throw new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
      } else {
        throw new Error(`codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(str, null, 4)}`);
      }
    }

    if (originalOpts && !isObj$2(originalOpts)) {
      throw new Error(`codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(originalOpts, null, 4)}`);
    }

    if (isObj$2(originalOpts) && originalOpts.tagCb && typeof originalOpts.tagCb !== "function") {
      throw new Error(`codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ${typeof originalOpts.tagCb}, equal to ${JSON.stringify(originalOpts.tagCb, null, 4)}`);
    }

    if (isObj$2(originalOpts) && originalOpts.charCb && typeof originalOpts.charCb !== "function") {
      throw new Error(`codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ${typeof originalOpts.charCb}, equal to ${JSON.stringify(originalOpts.charCb, null, 4)}`);
    }

    if (isObj$2(originalOpts) && originalOpts.reportProgressFunc && typeof originalOpts.reportProgressFunc !== "function") {
      throw new Error(`codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ${typeof originalOpts.reportProgressFunc}, equal to ${JSON.stringify(originalOpts.reportProgressFunc, null, 4)}`);
    }

    const defaults = {
      tagCb: null,
      tagCbLookahead: 0,
      charCb: null,
      charCbLookahead: 0,
      reportProgressFunc: null,
      reportProgressFuncFrom: 0,
      reportProgressFuncTo: 100
    };
    const opts = Object.assign({}, defaults, originalOpts);
    let currentPercentageDone;
    let lastPercentage = 0;
    const len = str.length;
    const midLen = Math.floor(len / 2);
    let doNothing;
    let styleStarts = false;
    const tagStash = [];
    const charStash = [];
    let token = {};
    const tokenDefault = {
      type: null,
      start: null,
      end: null
    };

    function tokenReset() {
      token = lodash_clonedeep(tokenDefault);
      attribReset();
      return token;
    }

    let attrib = {};
    const attribDefault = {
      attribName: null,
      attribNameRecognised: null,
      attribNameStartsAt: null,
      attribNameEndsAt: null,
      attribOpeningQuoteAt: null,
      attribClosingQuoteAt: null,
      attribValue: null,
      attribValueStartsAt: null,
      attribValueEndsAt: null,
      attribStart: null,
      attribEnd: null
    };

    function attribReset() {
      attrib = lodash_clonedeep(attribDefault);
    }

    tokenReset();
    attribReset();
    let selectorChunkStartedAt;
    let parentTokenToWrapAround;
    let layers = [];

    function matchLayerLast(str, i, matchFirstInstead) {
      if (!layers.length) {
        return false;
      }

      const whichLayerToMatch = matchFirstInstead ? layers[0] : layers[layers.length - 1];

      if (whichLayerToMatch.type === "simple") {
        return !whichLayerToMatch.value || str[i] === flipEspTag(whichLayerToMatch.value);
      } else if (whichLayerToMatch.type === "esp") {
        if (!espChars.includes(str[i])) {
          return false;
        }

        let wholeEspTagLump = "";
        const len = str.length;

        for (let y = i; y < len; y++) {
          if (espChars.includes(str[y])) {
            wholeEspTagLump = wholeEspTagLump + str[y];
          } else {
            break;
          }
        }

        if (wholeEspTagLump && whichLayerToMatch.openingLump && wholeEspTagLump.length > whichLayerToMatch.guessedClosingLump.length) {
          if (wholeEspTagLump.endsWith(whichLayerToMatch.openingLump)) {
            return wholeEspTagLump.length - whichLayerToMatch.openingLump.length;
          }

          let uniqueCharsListFromGuessedClosingLumpArr = new Set(whichLayerToMatch.guessedClosingLump);
          let found = 0;

          for (let y = 0, len2 = wholeEspTagLump.length; y < len2; y++) {
            if (!uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLump[y]) && found > 1) {
              return y;
            }

            if (uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLump[y])) {
              found++;
              uniqueCharsListFromGuessedClosingLumpArr = new Set([...uniqueCharsListFromGuessedClosingLumpArr].filter(el => el !== wholeEspTagLump[y]));
            }
          }
        } else if (whichLayerToMatch.guessedClosingLump.split("").every(char => wholeEspTagLump.includes(char))) {
          return wholeEspTagLump.length;
        }
      }
    }

    function matchLayerFirst(str, i) {
      return matchLayerLast(str, i, true);
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

      cb(currentElem, next);
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

    function dumpCurrentToken(token, i) {
      if (!["text", "esp"].includes(token.type) && token.start !== null && token.start < i && (str[i - 1] && !str[i - 1].trim() || str[i] === "<")) {
        token.end = left(str, i) + 1;
        token.value = str.slice(token.start, token.end);

        if (token.type === "tag" && !"/>".includes(str[token.end - 1])) {
          let cutOffIndex = token.tagNameEndsAt || i;

          if (Array.isArray(token.attribs) && token.attribs.length) {
            for (let i = 0, len = token.attribs.length; i < len; i++) {
              if (token.attribs[i].attribNameRecognised) {
                cutOffIndex = token.attribs[i].attribEnd;

                if (str[cutOffIndex] && str[cutOffIndex + 1] && !str[cutOffIndex].trim() && str[cutOffIndex + 1].trim()) {
                  cutOffIndex++;
                }
              } else {
                if (i === 0) {
                  token.attribs = [];
                } else {
                  token.attribs = token.attribs.splice(0, i);
                }

                break;
              }
            }
          }

          token.end = cutOffIndex;
          token.value = str.slice(token.start, token.end);

          if (!token.tagNameEndsAt) {
            token.tagNameEndsAt = cutOffIndex;
          }

          if (Number.isInteger(token.tagNameStartsAt) && Number.isInteger(token.tagNameEndsAt) && !token.tagName) {
            token.tagName = str.slice(token.tagNameStartsAt, cutOffIndex);
            token.recognised = isTagNameRecognised(token.tagName);
          }

          pingTagCb(token);
          token = tokenReset();
          initToken("text", cutOffIndex);
        } else {
          pingTagCb(token);
          token = tokenReset();

          if (str[i - 1] && !str[i - 1].trim()) {
            initToken("text", left(str, i) + 1);
          }
        }
      }

      if (token.start !== null) {
        if (token.end === null && token.start !== i) {
          token.end = i;
          token.value = str.slice(token.start, token.end);
        }

        if (token.start !== null && token.end !== null) {
          pingTagCb(token);
        }

        token = tokenReset();
      }
    }

    function atRuleWaitingForClosingCurlie() {
      return layers.length && layers[layers.length - 1].type === "at" && isObj$2(layers[layers.length - 1].token) && Number.isInteger(layers[layers.length - 1].token.openingCurlyAt) && !Number.isInteger(layers[layers.length - 1].token.closingCurlyAt);
    }

    function initToken(type, start) {
      attribReset();

      if (type === "tag") {
        token.type = type;
        token.start = start;
        token.end = null;
        token.value = null;
        token.tagNameStartsAt = null;
        token.tagNameEndsAt = null;
        token.tagName = null;
        token.recognised = null;
        token.closing = false;
        token.void = false;
        token.pureHTML = true;
        token.kind = null;
        token.attribs = [];
      } else if (type === "comment") {
        token.type = type;
        token.start = start;
        token.end = null;
        token.value = null;
        token.kind = "simple";
        token.closing = false;
      } else if (type === "rule") {
        token.type = type;
        token.start = start;
        token.end = null;
        token.value = null;
        token.openingCurlyAt = null;
        token.closingCurlyAt = null;
        token.selectorsStart = null;
        token.selectorsEnd = null;
        token.selectors = [];
      } else if (type === "at") {
        token.type = type;
        token.start = start;
        token.end = null;
        token.value = null;
        token.identifier = null;
        token.identifierStartsAt = null;
        token.identifierEndsAt = null;
        token.query = null;
        token.queryStartsAt = null;
        token.queryEndsAt = null;
        token.openingCurlyAt = null;
        token.closingCurlyAt = null;
      } else if (type === "text") {
        token.type = type;
        token.start = start;
        token.end = null;
        token.value = null;
      } else if (type === "esp") {
        token.type = type;
        token.start = start;
        token.end = null;
        token.value = null;
        token.head = null;
        token.tail = null;
        token.kind = null;
      }
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

      if (styleStarts && token.type && !["rule", "at", "text"].includes(token.type)) {
        styleStarts = false;
      }

      if (Number.isInteger(doNothing) && i >= doNothing) {
        doNothing = false;
      }

      if (!doNothing && atRuleWaitingForClosingCurlie()) {
        if (str[i] === "}") {
          if (token.type === null || token.type === "text" || token.type === "rule" && token.openingCurlyAt === null) {
            if (token.type === "rule") {
              token.end = left(str, i) + 1;
              token.value = str.slice(token.start, token.end);
              pingTagCb(token);
              token = tokenReset();

              if (left(str, i) < i - 1) {
                initToken("text", left(str, i) + 1);
              }
            }

            dumpCurrentToken(token, i);
            const poppedToken = layers.pop();
            token = poppedToken.token;
            token.closingCurlyAt = i;
            token.end = i + 1;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token);
            token = tokenReset();
            doNothing = i + 1;
          }
        } else if (token.type === "text" && str[i] && str[i].trim()) {
          token.end = i;
          token.value = str.slice(token.start, token.end);
          pingTagCb(token);
          token = tokenReset();
        }
      }

      if (token.end && token.end === i) {
        if (token.tagName === "style" && !token.closing) {
          styleStarts = true;
        }

        dumpCurrentToken(token, i);
        layers = [];
      }

      if (!doNothing) {
        if (["tag", "esp", "rule", "at"].includes(token.type) && token.kind !== "cdata") {
          if ([`"`, `'`, `(`, `)`].includes(str[i]) && !([`"`, `'`].includes(str[left(str, i)]) && str[left(str, i)] === str[right(str, i)])) {
            if (matchLayerLast(str, i)) {
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
            if (matchLayerLast(str, i)) {
              layers.pop();
            } else {
              layers.push({
                type: "simple",
                value: str[i],
                position: i
              });
            }
          }
        }
      }

      if (!doNothing && token.type === "at" && Number.isInteger(token.start) && i >= token.start && !Number.isInteger(token.identifierStartsAt) && str[i] && str[i].trim() && str[i] !== "@") {
        token.identifierStartsAt = i;
      }

      if (!doNothing && token.type === "at" && Number.isInteger(token.queryStartsAt) && !Number.isInteger(token.queryEndsAt) && "{};".includes(str[i])) {
        if (str[i - 1] && str[i - 1].trim()) {
          token.queryEndsAt = i;
        } else {
          token.queryEndsAt = left(str, i) + 1;
        }

        token.query = str.slice(token.queryStartsAt, token.queryEndsAt);
      }

      if (!doNothing && token.type === "at" && str[i] === "{" && token.identifier && !Number.isInteger(token.openingCurlyAt)) {
        token.openingCurlyAt = i;
        layers.push({
          type: "at",
          token
        });
        const charIdxOnTheRight = right(str, i);

        if (str[charIdxOnTheRight] === "}") {
          token.closingCurlyAt = charIdxOnTheRight;
          pingTagCb(token);
          doNothing = charIdxOnTheRight;
        } else {
          tokenReset();

          if (charIdxOnTheRight > i + 1) {
            initToken("text", i + 1);
            token.end = charIdxOnTheRight;
            token.value = str.slice(token.start, token.end);
            pingTagCb(token);
          }

          tokenReset();
          initToken("rule", charIdxOnTheRight);
          doNothing = charIdxOnTheRight;
        }
      }

      if (!doNothing && token.type === "at" && token.identifier && str[i] && str[i].trim() && !Number.isInteger(token.queryStartsAt)) {
        token.queryStartsAt = i;
      }

      if (!doNothing && token.type === "at" && Number.isInteger(token.identifierStartsAt) && i >= token.start && str[i] && (!str[i].trim() || "()".includes(str[i])) && !Number.isInteger(token.identifierEndsAt)) {
        token.identifierEndsAt = i;
        token.identifier = str.slice(token.identifierStartsAt, i);
      }

      if (token.type === "rule" && Number.isInteger(selectorChunkStartedAt) && (charsThatEndCSSChunks.includes(str[i]) || str[i] && !str[i].trim() && charsThatEndCSSChunks.includes(str[right(str, i)]))) {
        token.selectors.push({
          value: str.slice(selectorChunkStartedAt, i),
          selectorStarts: selectorChunkStartedAt,
          selectorEnds: i
        });
        selectorChunkStartedAt = undefined;
        token.selectorsEnd = i;
      }

      if (!doNothing) {
        if (startsTag(str, i, token, layers)) {
          if (token.type && token.start !== null) {
            dumpCurrentToken(token, i);
            tokenReset();
          }

          initToken("tag", i);

          if (styleStarts) {
            styleStarts = false;
          }

          if (matchRight(str, i, "doctype", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })) {
            token.kind = "doctype";
          } else if (matchRight(str, i, "cdata", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })) {
            token.kind = "cdata";
          } else if (matchRight(str, i, "xml", {
            i: true,
            trimCharsBeforeMatching: ["?", "!", "[", " ", "-"]
          })) {
            token.kind = "xml";
          }
        } else if (startsComment(str, i, token)) {
          if (Number.isInteger(token.start)) {
            dumpCurrentToken(token, i);
          }

          tokenReset();
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

          if (styleStarts) {
            styleStarts = false;
          }
        } else if (startsEsp(str, i, token, layers, styleStarts)) {
          let wholeEspTagLump = "";

          for (let y = i; y < len; y++) {
            if (espChars.includes(str[y])) {
              wholeEspTagLump = wholeEspTagLump + str[y];
            } else {
              break;
            }
          }

          if (!espLumpBlacklist.includes(wholeEspTagLump) && (!Array.isArray(layers) || !layers.length || layers[layers.length - 1].type !== "simple" || layers[layers.length - 1].value !== str[i + wholeEspTagLump.length])) {
            let lengthOfClosingEspChunk;

            if (layers.length && matchLayerLast(str, i)) {
              lengthOfClosingEspChunk = matchLayerLast(str, i);

              if (token.type === "esp") {
                if (!Number.isInteger(token.end)) {
                  token.end = i + lengthOfClosingEspChunk;
                  token.value = str.slice(token.start, token.end);
                }

                if (parentTokenToWrapAround) {
                  if (!Array.isArray(parentTokenToWrapAround.attribs)) {
                    parentTokenToWrapAround.attribs = [];
                  }

                  parentTokenToWrapAround.attribs.push(lodash_clonedeep(token));
                  token = lodash_clonedeep(parentTokenToWrapAround);
                  parentTokenToWrapAround = undefined;
                  layers.pop();
                  continue;
                } else {
                  dumpCurrentToken(token, i);
                }

                tokenReset();
              }

              layers.pop();
            } else if (layers.length && matchLayerFirst(str, i)) {
              lengthOfClosingEspChunk = matchLayerFirst(str, i);

              if (token.type === "esp") {
                if (!Number.isInteger(token.end)) {
                  token.end = i + lengthOfClosingEspChunk;
                  token.value = str.slice(token.start, token.end);
                }

                dumpCurrentToken(token, i);
                tokenReset();
              }

              layers = [];
            } else {
              layers.push({
                type: "esp",
                openingLump: wholeEspTagLump,
                guessedClosingLump: flipEspTag(wholeEspTagLump),
                position: i
              });

              if (token.start !== null) {
                if (token.type === "tag") {
                  if (!token.tagName || !token.tagNameEndsAt) {
                    token.tagNameEndsAt = i;
                    token.tagName = str.slice(token.tagNameStartsAt, i);
                    token.recognised = isTagNameRecognised(token.tagName);
                  }

                  parentTokenToWrapAround = lodash_clonedeep(token);
                } else {
                  dumpCurrentToken(token, i);
                }
              }

              initToken("esp", i);
              token.tail = flipEspTag(wholeEspTagLump);
              token.head = wholeEspTagLump;
            }

            doNothing = i + (lengthOfClosingEspChunk ? lengthOfClosingEspChunk : wholeEspTagLump.length);
          }
        } else if (token.start === null || token.end === i) {
          if (styleStarts) {
            if (str[i] && !str[i].trim()) {
              tokenReset();
              initToken("text", i);
              token.end = right(str, i) || str.length;
              token.value = str.slice(token.start, token.end);
              pingTagCb(token);
              doNothing = token.end;
              tokenReset();

              if (right(str, i) && !["{", "}", "<"].includes(str[right(str, i)])) {
                const idxOnTheRight = right(str, i);
                initToken(str[idxOnTheRight] === "@" ? "at" : "rule", idxOnTheRight);

                if (str[i + 1] && !str[i + 1].trim()) {
                  doNothing = right(str, i);
                }
              }
            } else if (str[i]) {
              tokenReset();

              if ("}".includes(str[i])) {
                initToken("text", i);
                doNothing = i + 1;
              } else {
                initToken(str[i] === "@" ? "at" : "rule", i);
              }
            }
          } else if (str[i]) {
            if (i) {
              token = tokenReset();
            }

            initToken("text", i);
          }
        } else if (token.type === "text" && styleStarts && str[i] && str[i].trim() && !"{},".includes(str[i])) {
          dumpCurrentToken(token, i);
          tokenReset();
          initToken("rule", i);
        }
      }

      if (!doNothing && token.type === "rule" && str[i] && str[i].trim() && !"{}".includes(str[i]) && !Number.isInteger(selectorChunkStartedAt) && !Number.isInteger(token.openingCurlyAt)) {
        if (!",".includes(str[i])) {
          selectorChunkStartedAt = i;

          if (token.selectorsStart === null) {
            token.selectorsStart = i;
          }
        } else {
          token.selectorsEnd = i + 1;
        }
      }

      if (token.type === "comment" && ["only", "not"].includes(token.kind)) {
        if (str[i] === "[") ;
      }

      if (!doNothing) {
        if (token.type === "tag" && !layers.length && str[i] === ">") {
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
        } else if (token.type === "comment" && !layers.length && token.kind === "simple" && (str[token.start] === "<" && str[i] === "-" && (matchLeft(str, i, "!-", {
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
          }) && (xBeforeYOnTheRight$1(str, i, "]", ">") || str.includes("mso", i) && !str.slice(i, str.indexOf("mso")).includes("<") && !str.slice(i, str.indexOf("mso")).includes(">")))) {
            token.kind = "only";
          } else if (str[token.start] !== "-" && matchRightIncl(str, i, ["-<![endif"], {
            i: true,
            trimBeforeMatching: true,
            maxMismatches: 2
          })) {
            token.kind = "not";
            token.closing = true;
          } else if (token.kind === "simple" && !token.closing && str[right(str, i)] === ">") {
            token.end = right(str, i) + 1;
            token.kind = "simplet";
            token.closing = null;
          } else {
            token.end = i + 1;

            if (str[left(str, i)] === "!" && str[right(str, i)] === "-") {
              token.end = right(str, i) + 1;
            }

            token.value = str.slice(token.start, token.end);
          }
        } else if (token.type === "comment" && str[i] === ">" && (!layers.length || str[right(str, i)] === "<")) {
          if (Array.isArray(layers) && layers.length && layers[layers.length - 1].value === "[") {
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
        } else if (token.type === "esp" && token.end === null && isStr$3(token.tail) && token.tail.includes(str[i])) {
          let wholeEspTagClosing = "";

          for (let y = i; y < len; y++) {
            if (espChars.includes(str[y])) {
              wholeEspTagClosing = wholeEspTagClosing + str[y];
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
            doNothing = token.end;
          }
        }
      }

      if (!doNothing && token.type === "tag" && Number.isInteger(token.tagNameStartsAt) && !Number.isInteger(token.tagNameEndsAt)) {
        if (!str[i] || !charSuitableForTagName(str[i])) {
          token.tagNameEndsAt = i;
          token.tagName = str.slice(token.tagNameStartsAt, i).toLowerCase();

          if (token.tagName === "xml" && token.closing && !token.kind) {
            token.kind = "xml";
          }

          if (voidTags.includes(token.tagName)) {
            token.void = true;
          }

          token.recognised = isTagNameRecognised(token.tagName);
        }
      }

      if (!doNothing && token.type === "tag" && !Number.isInteger(token.tagNameStartsAt) && Number.isInteger(token.start) && (token.start < i || str[token.start] !== "<")) {
        if (str[i] === "/") {
          token.closing = true;
        } else if (isLatinLetter(str[i])) {
          token.tagNameStartsAt = i;

          if (!token.closing) {
            token.closing = false;
          }
        }
      }

      if (!doNothing && token.type === "tag" && token.kind !== "cdata" && Number.isInteger(attrib.attribNameStartsAt) && i > attrib.attribNameStartsAt && attrib.attribNameEndsAt === null && !charSuitableForHTMLAttrName(str[i])) {
        attrib.attribNameEndsAt = i;
        attrib.attribName = str.slice(attrib.attribNameStartsAt, i);
        attrib.attribNameRecognised = allHtmlAttribs.has(attrib.attribName);
        if (str[i] && !str[i].trim() && str[right(str, i)] === "=") ;else if (str[i] && !str[i].trim() || str[i] === ">" || str[i] === "/" && str[right(str, i)] === ">") {
          if (`'"`.includes(str[right(str, i)])) ;else {
            attrib.attribEnd = i;
            token.attribs.push(lodash_clonedeep(attrib));
            attribReset();
          }
        }
      }

      if (!doNothing && str[i] && token.type === "tag" && token.kind !== "cdata" && Number.isInteger(token.tagNameEndsAt) && i > token.tagNameEndsAt && attrib.attribStart === null && charSuitableForHTMLAttrName(str[i])) {
        attrib.attribStart = i;
        attrib.attribNameStartsAt = i;
      }

      if (!doNothing && token.type === "rule") {
        if (str[i] === "{" && !Number.isInteger(token.openingCurlyAt)) {
          token.openingCurlyAt = i;
        } else if (str[i] === "}" && Number.isInteger(token.openingCurlyAt) && !Number.isInteger(token.closingCurlyAt)) {
          token.closingCurlyAt = i;
          token.end = i + 1;
          token.value = str.slice(token.start, token.end);
          pingTagCb(token);
          tokenReset();
        }
      }

      if (!doNothing && token.type === "tag" && Number.isInteger(attrib.attribValueStartsAt) && i >= attrib.attribValueStartsAt && attrib.attribValueEndsAt === null) {
        if (`'"`.includes(str[i])) {
          if (str[left(str, i)] === str[i] && !`/>${espChars}`.includes(str[right(str, i)]) && !xBeforeYOnTheRight$1(str, i, "=", `"`) && !xBeforeYOnTheRight$1(str, i, "=", `'`) && (xBeforeYOnTheRight$1(str, i, `"`, `>`) || xBeforeYOnTheRight$1(str, i, `'`, `>`)) && (!str.slice(i + 1).includes("<") || !str.slice(0, str.indexOf("<")).includes("="))) {
            attrib.attribOpeningQuoteAt = i;
            attrib.attribValueStartsAt = i + 1;
            layers.push({
              type: "simple",
              value: str[i],
              position: i
            });
          } else if (!layers.some(layerObj => layerObj.type === "esp") && isAttrClosing(str, attrib.attribOpeningQuoteAt || attrib.attribValueStartsAt, i)) {
            attrib.attribClosingQuoteAt = i;
            attrib.attribValueEndsAt = i;

            if (Number.isInteger(attrib.attribValueStartsAt)) {
              attrib.attribValue = str.slice(attrib.attribValueStartsAt, i);
            }

            attrib.attribEnd = i + 1;

            if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
              layers.pop();
              layers.pop();
            }

            token.attribs.push(lodash_clonedeep(attrib));
            attribReset();
          }
        } else if (attrib.attribOpeningQuoteAt === null && (str[i] && !str[i].trim() || ["/", ">"].includes(str[i]) || espChars.includes(str[i]) && espChars.includes(str[i + 1]))) {
          attrib.attribValueEndsAt = i;
          attrib.attribValue = str.slice(attrib.attribValueStartsAt, i);
          attrib.attribEnd = i;
          token.attribs.push(lodash_clonedeep(attrib));
          attribReset();
          layers.pop();

          if (str[i] === ">") {
            token.end = i + 1;
            token.value = str.slice(token.start, token.end);
          }
        } else if (str[i] === "=" && (`'"`.includes(str[right(str, i)]) || str[i - 1] && isLatinLetter(str[i - 1]))) {
          let whitespaceFound;
          let attribClosingQuoteAt;

          for (let y = left(str, i); y >= attrib.attribValueStartsAt; y--) {
            if (!whitespaceFound && str[y] && !str[y].trim()) {
              whitespaceFound = true;

              if (attribClosingQuoteAt) {
                const extractedChunksVal = str.slice(y, attribClosingQuoteAt);
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

            if (Number.isInteger(attrib.attribValueStartsAt)) {
              attrib.attribValue = str.slice(attrib.attribValueStartsAt, attribClosingQuoteAt);
            }

            attrib.attribEnd = attribClosingQuoteAt;

            if (str[attrib.attribOpeningQuoteAt] !== str[i]) {
              layers.pop();
            }

            token.attribs.push(lodash_clonedeep(attrib));
            attribReset();
            i = attribClosingQuoteAt - 1;
            continue;
          } else if (attrib.attribOpeningQuoteAt && (`'"`.includes(str[right(str, i)]) || allHtmlAttribs.has(str.slice(attrib.attribOpeningQuoteAt + 1, i).trim()))) {
            i = attrib.attribOpeningQuoteAt;
            attrib.attribEnd = attrib.attribOpeningQuoteAt + 1;
            attrib.attribValueStartsAt = null;
            layers.pop();
            token.attribs.push(lodash_clonedeep(attrib));
            attribReset();
            continue;
          }
        }
      }

      if (!doNothing && token.type === "tag" && !Number.isInteger(attrib.attribValueStartsAt) && Number.isInteger(attrib.attribNameEndsAt) && attrib.attribNameEndsAt <= i && str[i] && str[i].trim()) {
        if (str[i] === "=" && !`'"=`.includes(str[right(str, i)]) && !espChars.includes(str[right(str, i)])) {
          const firstCharOnTheRight = right(str, i);
          const firstQuoteOnTheRightIdx = [str.indexOf(`'`, firstCharOnTheRight), str.indexOf(`"`, firstCharOnTheRight)].filter(val => val > 0).length ? Math.min(...[str.indexOf(`'`, firstCharOnTheRight), str.indexOf(`"`, firstCharOnTheRight)].filter(val => val > 0)) : undefined;

          if (firstCharOnTheRight && str.slice(firstCharOnTheRight).includes("=") && allHtmlAttribs.has(str.slice(firstCharOnTheRight, firstCharOnTheRight + str.slice(firstCharOnTheRight).indexOf("=")).trim().toLowerCase())) {
            attrib.attribEnd = i + 1;
            token.attribs.push(lodash_clonedeep(attrib));
            attribReset();
          } else if (!firstQuoteOnTheRightIdx || str.slice(firstCharOnTheRight, firstQuoteOnTheRightIdx).includes("=") || !str.includes(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1) || Array.from(str.slice(firstQuoteOnTheRightIdx + 1, str.indexOf(str[firstQuoteOnTheRightIdx], firstQuoteOnTheRightIdx + 1))).some(char => `<>=`.includes(char))) {
            attrib.attribValueStartsAt = firstCharOnTheRight;
            layers.push({
              type: "simple",
              value: null,
              position: attrib.attribValueStartsAt
            });
          }
        } else if (`'"`.includes(str[i])) {
          const nextCharIdx = right(str, i);

          if (nextCharIdx && `'"`.includes(str[nextCharIdx]) && str[i] !== str[nextCharIdx] && str.length > nextCharIdx + 2 && str.slice(nextCharIdx + 1).includes(str[nextCharIdx]) && (!str.indexOf(str[nextCharIdx], nextCharIdx + 1) || !right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1)) || str[i] !== str[right(str, str.indexOf(str[nextCharIdx], nextCharIdx + 1))]) && !Array.from(str.slice(nextCharIdx + 1, str.indexOf(str[nextCharIdx]))).some(char => `<>=${str[i]}`.includes(char))) {
            layers.pop();
          } else {
            attrib.attribOpeningQuoteAt = i;

            if (str[i + 1]) {
              attrib.attribValueStartsAt = i + 1;
            }
          }
        }
      }

      if (str[i] === ">" && token.type === "tag" && attrib.attribStart !== null && attrib.attribEnd === null) {
        let thisIsRealEnding = false;

        if (str[i + 1]) {
          for (let y = i + 1; y < len; y++) {
            if (attrib.attribOpeningQuoteAt !== null && str[y] === str[attrib.attribOpeningQuoteAt]) {
              if (y !== i + 1 && str[y - 1] !== "=") {
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

          if (Number.isInteger(attrib.attribValueStartsAt) && i && attrib.attribValueStartsAt < i && str.slice(attrib.attribValueStartsAt, i).trim()) {
            attrib.attribValueEndsAt = i;
            attrib.attribValue = str.slice(attrib.attribValueStartsAt, i);
          } else {
            attrib.attribValueStartsAt = null;
          }

          attrib.attribEnd = i;
          token.attribs.push(lodash_clonedeep(attrib));
          attribReset();
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
        pingTagCb(token);
      }
    }

    if (charStash.length) {
      for (let i = 0, len = charStash.length; i < len; i++) {
        reportFirstFromStash(charStash, opts.charCb, opts.charCbLookahead);
      }
    }

    if (tagStash.length) {
      for (let i = 0, len = tagStash.length; i < len; i++) {
        reportFirstFromStash(tagStash, opts.tagCb, opts.tagCbLookahead);
      }
    }

    return {
      timeTakenInMilliseconds: Date.now() - start
    };
  }

  var objectPath = createCommonjsModule(function (module) {
    (function (root, factory) {
      /*istanbul ignore next:cant test*/

      {
        module.exports = factory();
      }
    })(commonjsGlobal, function () {

      var toStr = Object.prototype.toString;

      function hasOwnProperty(obj, prop) {
        if (obj == null) {
          return false;
        } //to handle objects with null prototypes (too edge case?)


        return Object.prototype.hasOwnProperty.call(obj, prop);
      }

      function isEmpty(value) {
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

      function toString(type) {
        return toStr.call(type);
      }

      function isObject(obj) {
        return typeof obj === 'object' && toString(obj) === "[object Object]";
      }

      var isArray = Array.isArray || function (obj) {
        /*istanbul ignore next:cant test*/
        return toStr.call(obj) === '[object Array]';
      };

      function isBoolean(obj) {
        return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
      }

      function getKey(key) {
        var intKey = parseInt(key);

        if (intKey.toString() === key) {
          return intKey;
        }

        return key;
      }

      function factory(options) {
        options = options || {};

        var objectPath = function (obj) {
          return Object.keys(objectPath).reduce(function (proxy, prop) {
            if (prop === 'create') {
              return proxy;
            }
            /*istanbul ignore else*/


            if (typeof objectPath[prop] === 'function') {
              proxy[prop] = objectPath[prop].bind(objectPath, obj);
            }

            return proxy;
          }, {});
        };

        function hasShallowProperty(obj, prop) {
          return options.includeInheritedProps || typeof prop === 'number' && Array.isArray(obj) || hasOwnProperty(obj, prop);
        }

        function getShallowProperty(obj, prop) {
          if (hasShallowProperty(obj, prop)) {
            return obj[prop];
          }
        }

        function set(obj, path, value, doNotReplace) {
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

          if (path.length === 1) {
            if (currentValue === void 0 || !doNotReplace) {
              obj[currentPath] = value;
            }

            return currentValue;
          }

          if (currentValue === void 0) {
            //check if we assume an array
            if (typeof path[1] === 'number') {
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

            if (typeof j === 'number' && isArray(obj) && j < obj.length || (options.includeInheritedProps ? j in Object(obj) : hasOwnProperty(obj, j))) {
              obj = obj[j];
            } else {
              return false;
            }
          }

          return true;
        };

        objectPath.ensureExists = function (obj, path, value) {
          return set(obj, path, value, true);
        };

        objectPath.set = function (obj, path, value, doNotReplace) {
          return set(obj, path, value, doNotReplace);
        };

        objectPath.insert = function (obj, path, value, at) {
          var arr = objectPath.get(obj, path);
          at = ~~at;

          if (!isArray(arr)) {
            arr = [];
            objectPath.set(obj, path, arr);
          }

          arr.splice(at, 0, value);
        };

        objectPath.empty = function (obj, path) {
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

        objectPath.push = function (obj, path
        /*, values */
        ) {
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

        objectPath.get = function (obj, path, defaultValue) {
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

          if (typeof path === 'string') {
            return objectPath.del(obj, path.split('.'));
          }

          var currentPath = getKey(path[0]);

          if (!hasShallowProperty(obj, currentPath)) {
            return obj;
          }

          if (path.length === 1) {
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
      mod.withInheritedProps = factory({
        includeInheritedProps: true
      });
      return mod;
    });
  });

  function isObj$3(something) {
    return something && _typeof(something) === "object" && !Array.isArray(something);
  }

  function layerPending(layers, tokenObj) {
    return (// usual closing case
      tokenObj.closing && layers.length && (layers[layers.length - 1].type === tokenObj.type && Object.prototype.hasOwnProperty.call(layers[layers.length - 1], "tagName") && Object.prototype.hasOwnProperty.call(tokenObj, "tagName") && layers[layers.length - 1].tagName === tokenObj.tagName && layers[layers.length - 1].closing === false || // OR,
      // rarer cases - any closing comment tag will close the layer, with
      // condition that opening exists among layers:
      // for example, consider <!--x<a>-->
      // <!-- is one layer
      // <a> is another layer
      // but
      // --> comes in and closes the last opening comment, it does not matter
      // that html tag layer hasn't been closed - comment tags take priority
      tokenObj.type === "comment" && layers.some(function (layerObjToken) {
        return Object.prototype.hasOwnProperty.call(layerObjToken, "closing") && !layerObjToken.closing;
      }))
    );
  }

  function cparser(str, originalOpts) {
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
      } else {
        throw new Error("codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as \"".concat(_typeof(str), "\", equal to:\n").concat(JSON.stringify(str, null, 4)));
      }
    }

    if (originalOpts && !isObj$3(originalOpts)) {
      throw new Error("codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ".concat(_typeof(originalOpts), ", equal to ").concat(JSON.stringify(originalOpts, null, 4)));
    }

    if (isObj$3(originalOpts) && originalOpts.tagCb && typeof originalOpts.tagCb !== "function") {
      throw new Error("codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ".concat(_typeof(originalOpts.tagCb), ", equal to ").concat(JSON.stringify(originalOpts.tagCb, null, 4)));
    }

    if (isObj$3(originalOpts) && originalOpts.charCb && typeof originalOpts.charCb !== "function") {
      throw new Error("codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ".concat(_typeof(originalOpts.charCb), ", equal to ").concat(JSON.stringify(originalOpts.charCb, null, 4)));
    }

    if (isObj$3(originalOpts) && originalOpts.reportProgressFunc && typeof originalOpts.reportProgressFunc !== "function") {
      throw new Error("codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ".concat(_typeof(originalOpts.reportProgressFunc), ", equal to ").concat(JSON.stringify(originalOpts.reportProgressFunc, null, 4)));
    }

    if (isObj$3(originalOpts) && originalOpts.errCb && typeof originalOpts.errCb !== "function") {
      throw new Error("codsen-tokenizer: [THROW_ID_07] the opts.errCb, callback function, should be a function but it was given as type ".concat(_typeof(originalOpts.errCb), ", equal to ").concat(JSON.stringify(originalOpts.errCb, null, 4)));
    } //
    //
    //
    //
    //
    //
    //
    // OPTS
    // ---------------------------------------------------------------------------


    var defaults = {
      reportProgressFunc: null,
      reportProgressFuncFrom: 0,
      reportProgressFuncTo: 100,
      tagCb: null,
      charCb: null,
      errCb: null
    };
    var opts = Object.assign({}, defaults, originalOpts); //
    //
    //
    //
    //
    //
    //
    // ACTION
    // ---------------------------------------------------------------------------
    // layers keep track of tag heads, so that when we hit their tails, we know
    // where both parts are:

    var layers = [];
    var res = []; // this flag is used to give notice
    // we use object-path notation
    // (https://www.npmjs.com/package/object-path)
    // outer container is array so starting path is zero.
    // object-path notation differs from normal js notation
    // in that array paths are with digits, a.2 not a[2]
    // which means, object keys can't have digit-only names.
    // The benefit of this notation is that it's consistent -
    // all the levels are joined with a dot, there are no brackets.

    var path;
    var nestNext = false;
    var lastProcessedToken = {};
    var tokensWithChildren = ["tag", "comment"];
    var tagNamesThatDontHaveClosings = ["doctype"]; // Call codsen-tokenizer. It works through callbacks,
    // pinging each token to the function you give, opts.tagCb

    tokenizer(str, {
      reportProgressFunc: opts.reportProgressFunc,
      reportProgressFuncFrom: opts.reportProgressFuncFrom,
      reportProgressFuncTo: opts.reportProgressFuncTo,
      tagCbLookahead: 2,
      tagCb: function tagCb(tokenObj, next) {
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //              TAG CALLBACK STARTS
        //
        //
        //
        //
        //
        //
        //
        //
        // pass the token to the 3rd parties through opts.tagCb
        if (typeof opts.tagCb === "function") {
          opts.tagCb(tokenObj);
        } // consume the token ourselves
        // tokenizer does not build AST's so there is no
        // "children" key reported on each node. However,
        // here we do build AST's and while some tokens might
        // not have children tokens or can't (text nodes),
        // for consistency we will add children key with
        // an empty array value to each token in AST.
        // recalculate the path for this token


        var prevToken = objectPath.get(res, path);

        if (!isObj$3(prevToken)) {
          prevToken = null;
        }

        if (nestNext && // ensure it's not a closing tag of a pair, in which case
        // don't nest it!
        !tokenObj.closing && (!prevToken || !(prevToken.tagName === tokenObj.tagName && !prevToken.closing && tokenObj.closing)) && !layerPending(layers, tokenObj) && ( //
        // --------
        // imagine the case:
        // <div><a> </div>
        // we don't want to nest that space text token under "a" if the following
        // token </div> closes the pending layer -
        // this means matching token that comes next against second layer
        // behind (the layers[layers.length - 3] below):
        // --------
        //
        !Array.isArray(next) || // another early escape latch:
        !next.length || // another early escape latch:
        !Array.isArray(layers) || // another early escape latch:
        !layers.length || // another early escape latch:
        layers.length < 3 || // the real clause:
        !(tokenObj.type === "text" && next[0].type === "tag" && next[0].closing && // ensure it's not legit closing tag following:
        next[0].tagName !== layers[layers.length - 1].tagName && layers[layers.length - 3].type === "tag" && !layers[layers.length - 3].closing && next[0].tagName === layers[layers.length - 3].tagName))) {
          // 1. reset the flag
          nestNext = false; // 2. go deeper
          // "1.children.3" -> "1.children.3.children.0"

          path = "".concat(path, ".children.0");
        } else if (tokenObj.closing && typeof path === "string" && path.includes(".") && ( // ensure preceding token was not an opening counterpart:
        !tokenObj.tagName || lastProcessedToken.tagName !== tokenObj.tagName || lastProcessedToken.closing)) {
          // goes up and then bumps,
          // "1.children.3" -> "2"
          path = pathNext(pathUp(path));

          if (layerPending(layers, tokenObj)) {
            //
            // in case of comment layers, there can be more layers leading
            // up to this, so more popping might be needed.
            // Imagine <!--<a><a><a><a><a><a>-->
            //                                ^
            //                              we're here
            while (layers.length && layers[layers.length - 1].type !== tokenObj.type && layers[layers.length - 1].kind !== tokenObj.kind) {
              layers.pop();
            }

            layers.pop();
            nestNext = false;
          } else {
            // if this is a gap and current token closes parent token,
            // go another level up
            if (layers.length > 1 && tokenObj.tagName && tokenObj.tagName === layers[layers.length - 2].tagName) {
              // 1. amend the path
              path = pathNext(pathUp(path)); // 2. report the last layer's token as missing closing

              if (opts.errCb) {
                var lastLayersToken = layers[layers.length - 1];
                opts.errCb({
                  ruleId: "".concat(lastLayersToken.type).concat(lastLayersToken.type === "comment" ? "-".concat(lastLayersToken.kind) : "", "-missing-closing"),
                  idxFrom: lastLayersToken.start,
                  idxTo: lastLayersToken.end,
                  tokenObj: lastLayersToken
                });
              } // 3. clean up the layers


              layers.pop();
              layers.pop();
            } else if ( // so it's a closing tag (</table> in example below)
            // and it was not pending (meaning opening heads were not in front)
            // and this token is tag and it's closing the second layer backwards
            // imagine code: <table><tr><td>x</td><a></table>
            // imagine on </table> we have layers:
            // <table>, <tr>, <a> - so <a> is rogue, maybe in its place the
            // </tr> was meant to be, hance the second layer backwards,
            // the "layers[layers.length - 3]"
            layers.length > 2 && layers[layers.length - 3].type === tokenObj.type && layers[layers.length - 3].type === tokenObj.type && layers[layers.length - 3].tagName === tokenObj.tagName) {
              // 1. amend the path
              path = pathNext(pathUp(path)); // 2. report the last layer's token as missing closing

              if (opts.errCb) {
                var _lastLayersToken = layers[layers.length - 1];
                opts.errCb({
                  ruleId: "tag-rogue",
                  idxFrom: _lastLayersToken.start,
                  idxTo: _lastLayersToken.end,
                  tokenObj: _lastLayersToken
                });
              } // 3. pop all 3


              layers.pop();
              layers.pop();
              layers.pop();
            } else if ( // so it's a closing tag (</table> in example below)
            // and it was not pending (meaning opening heads were not in front)
            // and this token is tag and it's closing the first layer backwards
            // imagine code: <table><tr><td>x</td></a></table>
            // imagine we're on </table>
            // The </a> didn't open a new layer so we have layers:
            // <table>, <tr>
            // </tr> was meant to be instead of </a>,
            // the first layer backwards, the <table> does match our </table>
            // that's path "layers[layers.length - 2]"
            layers.length > 1 && layers[layers.length - 2].type === tokenObj.type && layers[layers.length - 2].type === tokenObj.type && layers[layers.length - 2].tagName === tokenObj.tagName) {
              // 1. don't amend the path, because this rogue closing tag has
              // already triggered "UP", tree is fine
              // 2. report the last layer's token as missing closing
              if (opts.errCb) {
                var _lastLayersToken2 = layers[layers.length - 1];
                opts.errCb({
                  ruleId: "tag-rogue",
                  idxFrom: _lastLayersToken2.start,
                  idxTo: _lastLayersToken2.end,
                  tokenObj: _lastLayersToken2
                });
              } // 3. pop all 2


              layers.pop();
              layers.pop();
            }
          }
        } else if (!path) {
          // it's the first element - push the token into index 0
          path = "0";
        } else {
          // bumps the index,
          // "1.children.3" -> "1.children.4"
          path = pathNext(path);

          if (layerPending(layers, tokenObj)) {
            layers.pop();
          }
        } // activate the nestNext


        if (tokensWithChildren.includes(tokenObj.type) && !tokenObj["void"] && Object.prototype.hasOwnProperty.call(tokenObj, "closing") && !tokenObj.closing) {
          nestNext = true;

          if (!tagNamesThatDontHaveClosings.includes(tokenObj.kind)) {
            layers.push(Object.assign({}, tokenObj));
          }
        } // check, does this closing tag have an
        // opening counterpart


        var previousPath = pathPrev(path); // console.log(
        //   `269 ${`\u001b[${33}m${`previousPath`}\u001b[${39}m`} = ${JSON.stringify(
        //     previousPath,
        //     null,
        //     4
        //   )}`
        // );

        var parentPath = pathUp(path);
        var parentTagsToken;

        if (parentPath && path.includes(".")) {
          parentTagsToken = objectPath.get(res, parentPath);
        }

        var previousTagsToken;

        if (previousPath) {
          previousTagsToken = objectPath.get(res, previousPath);
        } //
        // AST CORRECTION PART
        //
        // We change nodes where we recognise the error.
        //
        // case of "a<!--b->c", current token being "text" type, value "b->c"


        var suspiciousCommentTagEndingRegExp = /(-+|-+[^>])>/;
        var parentsLastChildTokenValue;
        var parentsLastChildTokenPath;

        if (isObj$3(previousTagsToken) && Array.isArray(previousTagsToken.children) && previousTagsToken.children.length && previousTagsToken.children[previousTagsToken.children.length - 1]) {
          parentsLastChildTokenValue = previousTagsToken.children[previousTagsToken.children.length - 1];
          parentsLastChildTokenPath = "".concat(previousPath, ".children.").concat(objectPath.get(res, previousPath).children.length - 1);
        }

        var tokenTakenCareOf = false;

        if (tokenObj.type === "text" && isObj$3(parentTagsToken) && parentTagsToken.type === "comment" && parentTagsToken.kind === "simple" && !parentTagsToken.closing && suspiciousCommentTagEndingRegExp.test(tokenObj.value)) {
          var suspiciousEndingStartsAt = suspiciousCommentTagEndingRegExp.exec(tokenObj.value).index;
          var suspiciousEndingEndsAt = suspiciousEndingStartsAt + tokenObj.value.slice(suspiciousEndingStartsAt).indexOf(">") + 1; // part 1.
          // if any text precedes the "->" that text goes in as normal,
          // at this level, under this path:

          if (suspiciousEndingStartsAt > 0) {
            objectPath.set(res, path, Object.assign({}, tokenObj, {
              end: tokenObj.start + suspiciousEndingStartsAt,
              value: tokenObj.value.slice(0, suspiciousEndingStartsAt)
            }));

            if (tokensWithChildren.includes(tokenObj.type)) {
              tokenObj.children = [];
            }
          } // part 2.
          // further, the "->" goes as closing token at parent level


          path = pathNext(pathUp(path));
          objectPath.set(res, path, {
            type: "comment",
            kind: "simple",
            closing: true,
            start: tokenObj.start + suspiciousEndingStartsAt,
            end: tokenObj.start + suspiciousEndingEndsAt,
            value: tokenObj.value.slice(suspiciousEndingStartsAt, suspiciousEndingEndsAt),
            children: []
          }); // part 3.
          // if any text follows "->" add that after

          if (suspiciousEndingEndsAt < tokenObj.value.length) {
            path = pathNext(path);
            objectPath.set(res, path, {
              type: "text",
              start: tokenObj.start + suspiciousEndingEndsAt,
              end: tokenObj.end,
              value: tokenObj.value.slice(suspiciousEndingEndsAt)
            });
          } // part 4.
          // stop token from being pushed in the ELSE clauses below


          tokenTakenCareOf = true; //
        } else if (tokenObj.type === "comment" && tokenObj.kind === "only" && isObj$3(previousTagsToken)) {
          // check "only" kind comment-type tokens for malformed front parts,
          // "<!--", which would turn them into "not" kind comment-type tokens
          if (previousTagsToken.type === "text" && previousTagsToken.value.trim() && "<!-".includes(previousTagsToken.value[left(previousTagsToken.value, previousTagsToken.value.length)])) {
            // if "only" kind token is preceded by something that resembles
            // opening HTML comment ("simple" kind), that might be first part
            // of "not" kind comment:
            //
            // <img/><--<![endif]-->
            //       ^
            //      excl. mark missing on the first part ("<!--")
            // strFindMalformed
            var capturedMalformedTagRanges = []; // Contents will be objects like:
            // {
            //   idxFrom: 3,
            //   idxTo: 9
            // }

            strFindMalformed(previousTagsToken.value, "<!--", function (obj) {
              capturedMalformedTagRanges.push(obj);
            }, {
              maxDistance: 2
            });

            if (capturedMalformedTagRanges.length && !right(previousTagsToken.value, capturedMalformedTagRanges[capturedMalformedTagRanges.length - 1].idxTo - 1)) {
              // pick the last
              // imagine, there were multiple malformed opening comments:
              // <img/><1--<1--<1--<1--<![endif]-->
              var malformedRange = capturedMalformedTagRanges.pop(); // is the whole text token to be merged into the closing comment token,
              // or were there characters in front of text token which remain and
              // form the shorter, text token?

              if (!left(previousTagsToken.value, malformedRange.idxFrom) && previousPath && isObj$3(previousTagsToken)) {
                // if there are no whitespace characters to the left of "from" index
                // of the malformed "<!--", this means whole token is a malformed
                // value and needs to be merged into current "comment" type token
                // and its kind should be changed from "only" to "not".
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                } // path becomes the path of previous, text token - we overwrite it


                path = previousPath;
                objectPath.set(res, path, Object.assign({}, tokenObj, {
                  start: malformedRange.idxFrom + previousTagsToken.start,
                  kind: "not",
                  value: "".concat(previousTagsToken.value).concat(tokenObj.value)
                })); // stop token from being pushed in the ELSE clauses below

                tokenTakenCareOf = true;
              } else if (previousPath && isObj$3(previousTagsToken)) {
                // if there are text characters which are not part of "<!--",
                // shorten the text token, push a new comment token
                // 1. tweak the "text" token
                objectPath.set(res, previousPath, Object.assign({}, previousTagsToken, {
                  end: malformedRange.idxFrom + previousTagsToken.start,
                  value: previousTagsToken.value.slice(0, malformedRange.idxFrom)
                })); // 2. tweak the current "comment" token

                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }

                objectPath.set(res, path, Object.assign({}, tokenObj, {
                  start: malformedRange.idxFrom + previousTagsToken.start,
                  kind: "not",
                  value: "".concat(previousTagsToken.value.slice(malformedRange.idxFrom)).concat(tokenObj.value)
                })); // stop token from being pushed in the ELSE clauses below

                tokenTakenCareOf = true;
              }
            }
          } else if (isObj$3(parentsLastChildTokenValue) && parentsLastChildTokenValue.type === "text" && parentsLastChildTokenValue.value.trim() && "<!-".includes(parentsLastChildTokenValue.value[left(parentsLastChildTokenValue.value, parentsLastChildTokenValue.value.length)])) {
            // the text token might be in parent token's children array, as
            // last element, for example, consider the AST of:
            // <!--[if !mso]><!--><img src="gif"/>!--<![endif]-->
            //
            // strFindMalformed
            var _capturedMalformedTagRanges = []; // Contents will be objects like:
            // {
            //   idxFrom: 3,
            //   idxTo: 9
            // }

            strFindMalformed(parentsLastChildTokenValue.value, "<!--", function (obj) {
              _capturedMalformedTagRanges.push(obj);
            }, {
              maxDistance: 2
            });

            if (_capturedMalformedTagRanges.length && !right(parentsLastChildTokenValue.value, _capturedMalformedTagRanges[_capturedMalformedTagRanges.length - 1].idxTo - 1)) {
              // pick the last
              // imagine, there were multiple malformed opening comments:
              // <!--[if !mso]><!--><img src="gif"/>!--!--!--!--<![endif]-->
              var _malformedRange = _capturedMalformedTagRanges.pop(); // is the whole text token to be merged into the closing comment token,
              // or were there characters in front of text token which remain and
              // form the shorter, text token?


              if (!left(parentsLastChildTokenValue.value, _malformedRange.idxFrom) && previousPath && isObj$3(parentsLastChildTokenValue)) {
                // if there are no whitespace characters to the left of "from" index
                // of the malformed "<!--", this means whole token is a malformed
                // value and needs to be merged into current "comment" type token
                // and its kind should be changed from "only" to "not".
                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                } // 1. Insert current node. The path for current token remains the same - text node was among
                // the previous token's children tokens


                objectPath.set(res, path, Object.assign({}, tokenObj, {
                  start: _malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  kind: "not",
                  value: "".concat(parentsLastChildTokenValue.value).concat(tokenObj.value)
                })); // 2. Delete the text node.

                objectPath.del(res, "".concat(previousPath, ".children.").concat(objectPath.get(res, previousPath).children.length - 1)); // stop token from being pushed in the ELSE clauses below

                tokenTakenCareOf = true;
              } else if (previousPath && isObj$3(parentsLastChildTokenValue) && parentsLastChildTokenPath) {
                // if there are text characters which are not part of "<!--",
                // shorten the text token, push a new comment token
                // 1. tweak the "text" token
                objectPath.set(res, parentsLastChildTokenPath, Object.assign({}, parentsLastChildTokenValue, {
                  end: _malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  value: parentsLastChildTokenValue.value.slice(0, _malformedRange.idxFrom)
                })); // 2. tweak the current "comment" token

                if (tokensWithChildren.includes(tokenObj.type)) {
                  tokenObj.children = [];
                }

                objectPath.set(res, path, Object.assign({}, tokenObj, {
                  start: _malformedRange.idxFrom + parentsLastChildTokenValue.start,
                  kind: "not",
                  value: "".concat(parentsLastChildTokenValue.value.slice(_malformedRange.idxFrom)).concat(tokenObj.value)
                })); // stop token from being pushed in the ELSE clauses below

                tokenTakenCareOf = true;
              }
            }
          }
        } // if token was not pushed yet, push it


        if (!tokenTakenCareOf) {
          if (tokensWithChildren.includes(tokenObj.type)) {
            tokenObj.children = [];
          }

          objectPath.set(res, path, tokenObj);
        } //
        // CHECK CHILD-PARENT MATCH
        //


        if (tokensWithChildren.includes(tokenObj.type) && tokenObj.closing && (!previousPath || !isObj$3(previousTagsToken) || previousTagsToken.closing || previousTagsToken.type !== tokenObj.type || previousTagsToken.tagName !== tokenObj.tagName)) {
          if (tokenObj["void"]) {
            if (opts.errCb) {
              opts.errCb({
                ruleId: "tag-void-frontal-slash",
                idxFrom: tokenObj.start,
                idxTo: tokenObj.end,
                fix: {
                  ranges: [[tokenObj.start + 1, tokenObj.tagNameStartsAt]]
                },
                tokenObj: tokenObj
              });
            }
          } else {
            if (opts.errCb) {
              opts.errCb({
                ruleId: "".concat(tokenObj.type).concat(tokenObj.type === "comment" ? "-".concat(tokenObj.kind) : "", "-missing-opening"),
                idxFrom: tokenObj.start,
                idxTo: tokenObj.end,
                tokenObj: tokenObj
              });
            }
          }
        } // SET a new previous token's value


        lastProcessedToken = _objectSpread2({}, tokenObj); //
        // LOGGING
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //              TAG CALLBACK ENDS
        //
        //
        //
        //
        //
        //
        //
        //
      },
      charCb: opts.charCb
    }); // if there are some unclosed layer tokens, raise errors about them all:

    if (layers.length) {
      layers.forEach(function (tokenObj) {
        if (opts.errCb) {
          opts.errCb({
            ruleId: "".concat(tokenObj.type).concat(tokenObj.type === "comment" ? "-".concat(tokenObj.kind) : "", "-missing-closing"),
            idxFrom: tokenObj.start,
            idxTo: tokenObj.end,
            tokenObj: tokenObj
          });
        }
      });
    }

    return res;
  } // -----------------------------------------------------------------------------

  return cparser;

})));
