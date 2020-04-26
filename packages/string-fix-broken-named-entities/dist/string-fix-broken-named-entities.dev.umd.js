/**
 * string-fix-broken-named-entities
 * Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes
 * Version: 2.5.14
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.stringFixBrokenNamedEntities = factory());
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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

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
   * all-named-html-entities
   * List of all named HTML entities
   * Version: 1.2.18
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/all-named-html-entities
   */
  var Aacute = "Á";
  var aacute = "á";
  var Abreve = "Ă";
  var abreve = "ă";
  var ac = "∾";
  var acd = "∿";
  var acE = "∾̳";
  var Acirc = "Â";
  var acirc = "â";
  var acute = "´";
  var Acy = "А";
  var acy = "а";
  var AElig = "Æ";
  var aelig = "æ";
  var af = "⁡";
  var Afr = "𝔄";
  var afr = "𝔞";
  var Agrave = "À";
  var agrave = "à";
  var alefsym = "ℵ";
  var aleph = "ℵ";
  var Alpha = "Α";
  var alpha = "α";
  var Amacr = "Ā";
  var amacr = "ā";
  var amalg = "⨿";
  var AMP = "&";
  var amp = "&";
  var And = "⩓";
  var and = "∧";
  var andand = "⩕";
  var andd = "⩜";
  var andslope = "⩘";
  var andv = "⩚";
  var ang = "∠";
  var ange = "⦤";
  var angle = "∠";
  var angmsd = "∡";
  var angmsdaa = "⦨";
  var angmsdab = "⦩";
  var angmsdac = "⦪";
  var angmsdad = "⦫";
  var angmsdae = "⦬";
  var angmsdaf = "⦭";
  var angmsdag = "⦮";
  var angmsdah = "⦯";
  var angrt = "∟";
  var angrtvb = "⊾";
  var angrtvbd = "⦝";
  var angsph = "∢";
  var angst = "Å";
  var angzarr = "⍼";
  var Aogon = "Ą";
  var aogon = "ą";
  var Aopf = "𝔸";
  var aopf = "𝕒";
  var ap = "≈";
  var apacir = "⩯";
  var apE = "⩰";
  var ape = "≊";
  var apid = "≋";
  var apos = "'";
  var ApplyFunction = "⁡";
  var approx = "≈";
  var approxeq = "≊";
  var Aring = "Å";
  var aring = "å";
  var Ascr = "𝒜";
  var ascr = "𝒶";
  var Assign = "≔";
  var ast = "*";
  var asymp = "≈";
  var asympeq = "≍";
  var Atilde = "Ã";
  var atilde = "ã";
  var Auml = "Ä";
  var auml = "ä";
  var awconint = "∳";
  var awint = "⨑";
  var backcong = "≌";
  var backepsilon = "϶";
  var backprime = "‵";
  var backsim = "∽";
  var backsimeq = "⋍";
  var Backslash = "∖";
  var Barv = "⫧";
  var barvee = "⊽";
  var Barwed = "⌆";
  var barwed = "⌅";
  var barwedge = "⌅";
  var bbrk = "⎵";
  var bbrktbrk = "⎶";
  var bcong = "≌";
  var Bcy = "Б";
  var bcy = "б";
  var bdquo = "„";
  var becaus = "∵";
  var Because = "∵";
  var because = "∵";
  var bemptyv = "⦰";
  var bepsi = "϶";
  var bernou = "ℬ";
  var Bernoullis = "ℬ";
  var Beta = "Β";
  var beta = "β";
  var beth = "ℶ";
  var between = "≬";
  var Bfr = "𝔅";
  var bfr = "𝔟";
  var bigcap = "⋂";
  var bigcirc = "◯";
  var bigcup = "⋃";
  var bigodot = "⨀";
  var bigoplus = "⨁";
  var bigotimes = "⨂";
  var bigsqcup = "⨆";
  var bigstar = "★";
  var bigtriangledown = "▽";
  var bigtriangleup = "△";
  var biguplus = "⨄";
  var bigvee = "⋁";
  var bigwedge = "⋀";
  var bkarow = "⤍";
  var blacklozenge = "⧫";
  var blacksquare = "▪";
  var blacktriangle = "▴";
  var blacktriangledown = "▾";
  var blacktriangleleft = "◂";
  var blacktriangleright = "▸";
  var blank = "␣";
  var blk12 = "▒";
  var blk14 = "░";
  var blk34 = "▓";
  var block = "█";
  var bne = "=⃥";
  var bnequiv = "≡⃥";
  var bNot = "⫭";
  var bnot = "⌐";
  var Bopf = "𝔹";
  var bopf = "𝕓";
  var bot = "⊥";
  var bottom = "⊥";
  var bowtie = "⋈";
  var boxbox = "⧉";
  var boxDL = "╗";
  var boxDl = "╖";
  var boxdL = "╕";
  var boxdl = "┐";
  var boxDR = "╔";
  var boxDr = "╓";
  var boxdR = "╒";
  var boxdr = "┌";
  var boxH = "═";
  var boxh = "─";
  var boxHD = "╦";
  var boxHd = "╤";
  var boxhD = "╥";
  var boxhd = "┬";
  var boxHU = "╩";
  var boxHu = "╧";
  var boxhU = "╨";
  var boxhu = "┴";
  var boxminus = "⊟";
  var boxplus = "⊞";
  var boxtimes = "⊠";
  var boxUL = "╝";
  var boxUl = "╜";
  var boxuL = "╛";
  var boxul = "┘";
  var boxUR = "╚";
  var boxUr = "╙";
  var boxuR = "╘";
  var boxur = "└";
  var boxV = "║";
  var boxv = "│";
  var boxVH = "╬";
  var boxVh = "╫";
  var boxvH = "╪";
  var boxvh = "┼";
  var boxVL = "╣";
  var boxVl = "╢";
  var boxvL = "╡";
  var boxvl = "┤";
  var boxVR = "╠";
  var boxVr = "╟";
  var boxvR = "╞";
  var boxvr = "├";
  var bprime = "‵";
  var Breve = "˘";
  var breve = "˘";
  var brvbar = "¦";
  var Bscr = "ℬ";
  var bscr = "𝒷";
  var bsemi = "⁏";
  var bsim = "∽";
  var bsime = "⋍";
  var bsol = "\\";
  var bsolb = "⧅";
  var bsolhsub = "⟈";
  var bull = "•";
  var bullet = "•";
  var bump = "≎";
  var bumpE = "⪮";
  var bumpe = "≏";
  var Bumpeq = "≎";
  var bumpeq = "≏";
  var Cacute = "Ć";
  var cacute = "ć";
  var Cap = "⋒";
  var cap = "∩";
  var capand = "⩄";
  var capbrcup = "⩉";
  var capcap = "⩋";
  var capcup = "⩇";
  var capdot = "⩀";
  var CapitalDifferentialD = "ⅅ";
  var caps = "∩︀";
  var caret = "⁁";
  var caron = "ˇ";
  var Cayleys = "ℭ";
  var ccaps = "⩍";
  var Ccaron = "Č";
  var ccaron = "č";
  var Ccedil = "Ç";
  var ccedil = "ç";
  var Ccirc = "Ĉ";
  var ccirc = "ĉ";
  var Cconint = "∰";
  var ccups = "⩌";
  var ccupssm = "⩐";
  var Cdot = "Ċ";
  var cdot = "ċ";
  var cedil = "¸";
  var Cedilla = "¸";
  var cemptyv = "⦲";
  var cent = "¢";
  var CenterDot = "·";
  var centerdot = "·";
  var Cfr = "ℭ";
  var cfr = "𝔠";
  var CHcy = "Ч";
  var chcy = "ч";
  var check = "✓";
  var checkmark = "✓";
  var Chi = "Χ";
  var chi = "χ";
  var cir = "○";
  var circ = "ˆ";
  var circeq = "≗";
  var circlearrowleft = "↺";
  var circlearrowright = "↻";
  var circledast = "⊛";
  var circledcirc = "⊚";
  var circleddash = "⊝";
  var CircleDot = "⊙";
  var circledR = "®";
  var circledS = "Ⓢ";
  var CircleMinus = "⊖";
  var CirclePlus = "⊕";
  var CircleTimes = "⊗";
  var cirE = "⧃";
  var cire = "≗";
  var cirfnint = "⨐";
  var cirmid = "⫯";
  var cirscir = "⧂";
  var ClockwiseContourIntegral = "∲";
  var CloseCurlyDoubleQuote = "”";
  var CloseCurlyQuote = "’";
  var clubs = "♣";
  var clubsuit = "♣";
  var Colon = "∷";
  var colon = ":";
  var Colone = "⩴";
  var colone = "≔";
  var coloneq = "≔";
  var comma = ",";
  var commat = "@";
  var comp = "∁";
  var compfn = "∘";
  var complement = "∁";
  var complexes = "ℂ";
  var cong = "≅";
  var congdot = "⩭";
  var Congruent = "≡";
  var Conint = "∯";
  var conint = "∮";
  var ContourIntegral = "∮";
  var Copf = "ℂ";
  var copf = "𝕔";
  var coprod = "∐";
  var Coproduct = "∐";
  var COPY = "©";
  var copy = "©";
  var copysr = "℗";
  var CounterClockwiseContourIntegral = "∳";
  var crarr = "↵";
  var Cross = "⨯";
  var cross = "✗";
  var Cscr = "𝒞";
  var cscr = "𝒸";
  var csub = "⫏";
  var csube = "⫑";
  var csup = "⫐";
  var csupe = "⫒";
  var ctdot = "⋯";
  var cudarrl = "⤸";
  var cudarrr = "⤵";
  var cuepr = "⋞";
  var cuesc = "⋟";
  var cularr = "↶";
  var cularrp = "⤽";
  var Cup = "⋓";
  var cup = "∪";
  var cupbrcap = "⩈";
  var CupCap = "≍";
  var cupcap = "⩆";
  var cupcup = "⩊";
  var cupdot = "⊍";
  var cupor = "⩅";
  var cups = "∪︀";
  var curarr = "↷";
  var curarrm = "⤼";
  var curlyeqprec = "⋞";
  var curlyeqsucc = "⋟";
  var curlyvee = "⋎";
  var curlywedge = "⋏";
  var curren = "¤";
  var curvearrowleft = "↶";
  var curvearrowright = "↷";
  var cuvee = "⋎";
  var cuwed = "⋏";
  var cwconint = "∲";
  var cwint = "∱";
  var cylcty = "⌭";
  var Dagger = "‡";
  var dagger = "†";
  var daleth = "ℸ";
  var Darr = "↡";
  var dArr = "⇓";
  var darr = "↓";
  var dash = "‐";
  var Dashv = "⫤";
  var dashv = "⊣";
  var dbkarow = "⤏";
  var dblac = "˝";
  var Dcaron = "Ď";
  var dcaron = "ď";
  var Dcy = "Д";
  var dcy = "д";
  var DD = "ⅅ";
  var dd = "ⅆ";
  var ddagger = "‡";
  var ddarr = "⇊";
  var DDotrahd = "⤑";
  var ddotseq = "⩷";
  var deg = "°";
  var Del = "∇";
  var Delta = "Δ";
  var delta = "δ";
  var demptyv = "⦱";
  var dfisht = "⥿";
  var Dfr = "𝔇";
  var dfr = "𝔡";
  var dHar = "⥥";
  var dharl = "⇃";
  var dharr = "⇂";
  var DiacriticalAcute = "´";
  var DiacriticalDot = "˙";
  var DiacriticalDoubleAcute = "˝";
  var DiacriticalGrave = "`";
  var DiacriticalTilde = "˜";
  var diam = "⋄";
  var Diamond = "⋄";
  var diamond = "⋄";
  var diamondsuit = "♦";
  var diams = "♦";
  var die = "¨";
  var DifferentialD = "ⅆ";
  var digamma = "ϝ";
  var disin = "⋲";
  var div = "÷";
  var divide = "÷";
  var divideontimes = "⋇";
  var divonx = "⋇";
  var DJcy = "Ђ";
  var djcy = "ђ";
  var dlcorn = "⌞";
  var dlcrop = "⌍";
  var dollar = "$";
  var Dopf = "𝔻";
  var dopf = "𝕕";
  var Dot = "¨";
  var dot = "˙";
  var DotDot = "⃜";
  var doteq = "≐";
  var doteqdot = "≑";
  var DotEqual = "≐";
  var dotminus = "∸";
  var dotplus = "∔";
  var dotsquare = "⊡";
  var doublebarwedge = "⌆";
  var DoubleContourIntegral = "∯";
  var DoubleDot = "¨";
  var DoubleDownArrow = "⇓";
  var DoubleLeftArrow = "⇐";
  var DoubleLeftRightArrow = "⇔";
  var DoubleLeftTee = "⫤";
  var DoubleLongLeftArrow = "⟸";
  var DoubleLongLeftRightArrow = "⟺";
  var DoubleLongRightArrow = "⟹";
  var DoubleRightArrow = "⇒";
  var DoubleRightTee = "⊨";
  var DoubleUpArrow = "⇑";
  var DoubleUpDownArrow = "⇕";
  var DoubleVerticalBar = "∥";
  var DownArrow = "↓";
  var Downarrow = "⇓";
  var downarrow = "↓";
  var DownArrowBar = "⤓";
  var DownArrowUpArrow = "⇵";
  var DownBreve = "̑";
  var downdownarrows = "⇊";
  var downharpoonleft = "⇃";
  var downharpoonright = "⇂";
  var DownLeftRightVector = "⥐";
  var DownLeftTeeVector = "⥞";
  var DownLeftVector = "↽";
  var DownLeftVectorBar = "⥖";
  var DownRightTeeVector = "⥟";
  var DownRightVector = "⇁";
  var DownRightVectorBar = "⥗";
  var DownTee = "⊤";
  var DownTeeArrow = "↧";
  var drbkarow = "⤐";
  var drcorn = "⌟";
  var drcrop = "⌌";
  var Dscr = "𝒟";
  var dscr = "𝒹";
  var DScy = "Ѕ";
  var dscy = "ѕ";
  var dsol = "⧶";
  var Dstrok = "Đ";
  var dstrok = "đ";
  var dtdot = "⋱";
  var dtri = "▿";
  var dtrif = "▾";
  var duarr = "⇵";
  var duhar = "⥯";
  var dwangle = "⦦";
  var DZcy = "Џ";
  var dzcy = "џ";
  var dzigrarr = "⟿";
  var Eacute = "É";
  var eacute = "é";
  var easter = "⩮";
  var Ecaron = "Ě";
  var ecaron = "ě";
  var ecir = "≖";
  var Ecirc = "Ê";
  var ecirc = "ê";
  var ecolon = "≕";
  var Ecy = "Э";
  var ecy = "э";
  var eDDot = "⩷";
  var Edot = "Ė";
  var eDot = "≑";
  var edot = "ė";
  var ee = "ⅇ";
  var efDot = "≒";
  var Efr = "𝔈";
  var efr = "𝔢";
  var eg = "⪚";
  var Egrave = "È";
  var egrave = "è";
  var egs = "⪖";
  var egsdot = "⪘";
  var el = "⪙";
  var Element = "∈";
  var elinters = "⏧";
  var ell = "ℓ";
  var els = "⪕";
  var elsdot = "⪗";
  var Emacr = "Ē";
  var emacr = "ē";
  var empty = "∅";
  var emptyset = "∅";
  var EmptySmallSquare = "◻";
  var emptyv = "∅";
  var EmptyVerySmallSquare = "▫";
  var emsp = " ";
  var emsp13 = " ";
  var emsp14 = " ";
  var ENG = "Ŋ";
  var eng = "ŋ";
  var ensp = " ";
  var Eogon = "Ę";
  var eogon = "ę";
  var Eopf = "𝔼";
  var eopf = "𝕖";
  var epar = "⋕";
  var eparsl = "⧣";
  var eplus = "⩱";
  var epsi = "ε";
  var Epsilon = "Ε";
  var epsilon = "ε";
  var epsiv = "ϵ";
  var eqcirc = "≖";
  var eqcolon = "≕";
  var eqsim = "≂";
  var eqslantgtr = "⪖";
  var eqslantless = "⪕";
  var Equal = "⩵";
  var equals = "=";
  var EqualTilde = "≂";
  var equest = "≟";
  var Equilibrium = "⇌";
  var equiv = "≡";
  var equivDD = "⩸";
  var eqvparsl = "⧥";
  var erarr = "⥱";
  var erDot = "≓";
  var Escr = "ℰ";
  var escr = "ℯ";
  var esdot = "≐";
  var Esim = "⩳";
  var esim = "≂";
  var Eta = "Η";
  var eta = "η";
  var ETH = "Ð";
  var eth = "ð";
  var Euml = "Ë";
  var euml = "ë";
  var euro = "€";
  var excl = "!";
  var exist = "∃";
  var Exists = "∃";
  var expectation = "ℰ";
  var ExponentialE = "ⅇ";
  var exponentiale = "ⅇ";
  var fallingdotseq = "≒";
  var Fcy = "Ф";
  var fcy = "ф";
  var female = "♀";
  var ffilig = "ﬃ";
  var fflig = "ﬀ";
  var ffllig = "ﬄ";
  var Ffr = "𝔉";
  var ffr = "𝔣";
  var filig = "ﬁ";
  var FilledSmallSquare = "◼";
  var FilledVerySmallSquare = "▪";
  var fjlig = "fj";
  var flat = "♭";
  var fllig = "ﬂ";
  var fltns = "▱";
  var fnof = "ƒ";
  var Fopf = "𝔽";
  var fopf = "𝕗";
  var ForAll = "∀";
  var forall = "∀";
  var fork = "⋔";
  var forkv = "⫙";
  var Fouriertrf = "ℱ";
  var fpartint = "⨍";
  var frac12 = "½";
  var frac13 = "⅓";
  var frac14 = "¼";
  var frac15 = "⅕";
  var frac16 = "⅙";
  var frac18 = "⅛";
  var frac23 = "⅔";
  var frac25 = "⅖";
  var frac34 = "¾";
  var frac35 = "⅗";
  var frac38 = "⅜";
  var frac45 = "⅘";
  var frac56 = "⅚";
  var frac58 = "⅝";
  var frac78 = "⅞";
  var frasl = "⁄";
  var frown = "⌢";
  var Fscr = "ℱ";
  var fscr = "𝒻";
  var gacute = "ǵ";
  var Gamma = "Γ";
  var gamma = "γ";
  var Gammad = "Ϝ";
  var gammad = "ϝ";
  var gap = "⪆";
  var Gbreve = "Ğ";
  var gbreve = "ğ";
  var Gcedil = "Ģ";
  var Gcirc = "Ĝ";
  var gcirc = "ĝ";
  var Gcy = "Г";
  var gcy = "г";
  var Gdot = "Ġ";
  var gdot = "ġ";
  var gE = "≧";
  var ge = "≥";
  var gEl = "⪌";
  var gel = "⋛";
  var geq = "≥";
  var geqq = "≧";
  var geqslant = "⩾";
  var ges = "⩾";
  var gescc = "⪩";
  var gesdot = "⪀";
  var gesdoto = "⪂";
  var gesdotol = "⪄";
  var gesl = "⋛︀";
  var gesles = "⪔";
  var Gfr = "𝔊";
  var gfr = "𝔤";
  var Gg = "⋙";
  var gg = "≫";
  var ggg = "⋙";
  var gimel = "ℷ";
  var GJcy = "Ѓ";
  var gjcy = "ѓ";
  var gl = "≷";
  var gla = "⪥";
  var glE = "⪒";
  var glj = "⪤";
  var gnap = "⪊";
  var gnapprox = "⪊";
  var gnE = "≩";
  var gne = "⪈";
  var gneq = "⪈";
  var gneqq = "≩";
  var gnsim = "⋧";
  var Gopf = "𝔾";
  var gopf = "𝕘";
  var grave = "`";
  var GreaterEqual = "≥";
  var GreaterEqualLess = "⋛";
  var GreaterFullEqual = "≧";
  var GreaterGreater = "⪢";
  var GreaterLess = "≷";
  var GreaterSlantEqual = "⩾";
  var GreaterTilde = "≳";
  var Gscr = "𝒢";
  var gscr = "ℊ";
  var gsim = "≳";
  var gsime = "⪎";
  var gsiml = "⪐";
  var GT = ">";
  var Gt = "≫";
  var gt = ">";
  var gtcc = "⪧";
  var gtcir = "⩺";
  var gtdot = "⋗";
  var gtlPar = "⦕";
  var gtquest = "⩼";
  var gtrapprox = "⪆";
  var gtrarr = "⥸";
  var gtrdot = "⋗";
  var gtreqless = "⋛";
  var gtreqqless = "⪌";
  var gtrless = "≷";
  var gtrsim = "≳";
  var gvertneqq = "≩︀";
  var gvnE = "≩︀";
  var Hacek = "ˇ";
  var hairsp = " ";
  var half = "½";
  var hamilt = "ℋ";
  var HARDcy = "Ъ";
  var hardcy = "ъ";
  var hArr = "⇔";
  var harr = "↔";
  var harrcir = "⥈";
  var harrw = "↭";
  var Hat = "^";
  var hbar = "ℏ";
  var Hcirc = "Ĥ";
  var hcirc = "ĥ";
  var hearts = "♥";
  var heartsuit = "♥";
  var hellip = "…";
  var hercon = "⊹";
  var Hfr = "ℌ";
  var hfr = "𝔥";
  var HilbertSpace = "ℋ";
  var hksearow = "⤥";
  var hkswarow = "⤦";
  var hoarr = "⇿";
  var homtht = "∻";
  var hookleftarrow = "↩";
  var hookrightarrow = "↪";
  var Hopf = "ℍ";
  var hopf = "𝕙";
  var horbar = "―";
  var HorizontalLine = "─";
  var Hscr = "ℋ";
  var hscr = "𝒽";
  var hslash = "ℏ";
  var Hstrok = "Ħ";
  var hstrok = "ħ";
  var HumpDownHump = "≎";
  var HumpEqual = "≏";
  var hybull = "⁃";
  var hyphen = "‐";
  var Iacute = "Í";
  var iacute = "í";
  var ic = "⁣";
  var Icirc = "Î";
  var icirc = "î";
  var Icy = "И";
  var icy = "и";
  var Idot = "İ";
  var IEcy = "Е";
  var iecy = "е";
  var iexcl = "¡";
  var iff = "⇔";
  var Ifr = "ℑ";
  var ifr = "𝔦";
  var Igrave = "Ì";
  var igrave = "ì";
  var ii = "ⅈ";
  var iiiint = "⨌";
  var iiint = "∭";
  var iinfin = "⧜";
  var iiota = "℩";
  var IJlig = "Ĳ";
  var ijlig = "ĳ";
  var Im = "ℑ";
  var Imacr = "Ī";
  var imacr = "ī";
  var image = "ℑ";
  var ImaginaryI = "ⅈ";
  var imagline = "ℐ";
  var imagpart = "ℑ";
  var imath = "ı";
  var imof = "⊷";
  var imped = "Ƶ";
  var Implies = "⇒";
  var incare = "℅";
  var infin = "∞";
  var infintie = "⧝";
  var inodot = "ı";
  var Int = "∬";
  var int = "∫";
  var intcal = "⊺";
  var integers = "ℤ";
  var Integral = "∫";
  var intercal = "⊺";
  var Intersection = "⋂";
  var intlarhk = "⨗";
  var intprod = "⨼";
  var InvisibleComma = "⁣";
  var InvisibleTimes = "⁢";
  var IOcy = "Ё";
  var iocy = "ё";
  var Iogon = "Į";
  var iogon = "į";
  var Iopf = "𝕀";
  var iopf = "𝕚";
  var Iota = "Ι";
  var iota = "ι";
  var iprod = "⨼";
  var iquest = "¿";
  var Iscr = "ℐ";
  var iscr = "𝒾";
  var isin = "∈";
  var isindot = "⋵";
  var isinE = "⋹";
  var isins = "⋴";
  var isinsv = "⋳";
  var isinv = "∈";
  var it = "⁢";
  var Itilde = "Ĩ";
  var itilde = "ĩ";
  var Iukcy = "І";
  var iukcy = "і";
  var Iuml = "Ï";
  var iuml = "ï";
  var Jcirc = "Ĵ";
  var jcirc = "ĵ";
  var Jcy = "Й";
  var jcy = "й";
  var Jfr = "𝔍";
  var jfr = "𝔧";
  var jmath = "ȷ";
  var Jopf = "𝕁";
  var jopf = "𝕛";
  var Jscr = "𝒥";
  var jscr = "𝒿";
  var Jsercy = "Ј";
  var jsercy = "ј";
  var Jukcy = "Є";
  var jukcy = "є";
  var Kappa = "Κ";
  var kappa = "κ";
  var kappav = "ϰ";
  var Kcedil = "Ķ";
  var kcedil = "ķ";
  var Kcy = "К";
  var kcy = "к";
  var Kfr = "𝔎";
  var kfr = "𝔨";
  var kgreen = "ĸ";
  var KHcy = "Х";
  var khcy = "х";
  var KJcy = "Ќ";
  var kjcy = "ќ";
  var Kopf = "𝕂";
  var kopf = "𝕜";
  var Kscr = "𝒦";
  var kscr = "𝓀";
  var lAarr = "⇚";
  var Lacute = "Ĺ";
  var lacute = "ĺ";
  var laemptyv = "⦴";
  var lagran = "ℒ";
  var Lambda = "Λ";
  var lambda = "λ";
  var Lang = "⟪";
  var lang = "⟨";
  var langd = "⦑";
  var langle = "⟨";
  var lap = "⪅";
  var Laplacetrf = "ℒ";
  var laquo = "«";
  var Larr = "↞";
  var lArr = "⇐";
  var larr = "←";
  var larrb = "⇤";
  var larrbfs = "⤟";
  var larrfs = "⤝";
  var larrhk = "↩";
  var larrlp = "↫";
  var larrpl = "⤹";
  var larrsim = "⥳";
  var larrtl = "↢";
  var lat = "⪫";
  var lAtail = "⤛";
  var latail = "⤙";
  var late = "⪭";
  var lates = "⪭︀";
  var lBarr = "⤎";
  var lbarr = "⤌";
  var lbbrk = "❲";
  var lbrace = "{";
  var lbrack = "[";
  var lbrke = "⦋";
  var lbrksld = "⦏";
  var lbrkslu = "⦍";
  var Lcaron = "Ľ";
  var lcaron = "ľ";
  var Lcedil = "Ļ";
  var lcedil = "ļ";
  var lceil = "⌈";
  var lcub = "{";
  var Lcy = "Л";
  var lcy = "л";
  var ldca = "⤶";
  var ldquo = "“";
  var ldquor = "„";
  var ldrdhar = "⥧";
  var ldrushar = "⥋";
  var ldsh = "↲";
  var lE = "≦";
  var le = "≤";
  var LeftAngleBracket = "⟨";
  var LeftArrow = "←";
  var Leftarrow = "⇐";
  var leftarrow = "←";
  var LeftArrowBar = "⇤";
  var LeftArrowRightArrow = "⇆";
  var leftarrowtail = "↢";
  var LeftCeiling = "⌈";
  var LeftDoubleBracket = "⟦";
  var LeftDownTeeVector = "⥡";
  var LeftDownVector = "⇃";
  var LeftDownVectorBar = "⥙";
  var LeftFloor = "⌊";
  var leftharpoondown = "↽";
  var leftharpoonup = "↼";
  var leftleftarrows = "⇇";
  var LeftRightArrow = "↔";
  var Leftrightarrow = "⇔";
  var leftrightarrow = "↔";
  var leftrightarrows = "⇆";
  var leftrightharpoons = "⇋";
  var leftrightsquigarrow = "↭";
  var LeftRightVector = "⥎";
  var LeftTee = "⊣";
  var LeftTeeArrow = "↤";
  var LeftTeeVector = "⥚";
  var leftthreetimes = "⋋";
  var LeftTriangle = "⊲";
  var LeftTriangleBar = "⧏";
  var LeftTriangleEqual = "⊴";
  var LeftUpDownVector = "⥑";
  var LeftUpTeeVector = "⥠";
  var LeftUpVector = "↿";
  var LeftUpVectorBar = "⥘";
  var LeftVector = "↼";
  var LeftVectorBar = "⥒";
  var lEg = "⪋";
  var leg = "⋚";
  var leq = "≤";
  var leqq = "≦";
  var leqslant = "⩽";
  var les = "⩽";
  var lescc = "⪨";
  var lesdot = "⩿";
  var lesdoto = "⪁";
  var lesdotor = "⪃";
  var lesg = "⋚︀";
  var lesges = "⪓";
  var lessapprox = "⪅";
  var lessdot = "⋖";
  var lesseqgtr = "⋚";
  var lesseqqgtr = "⪋";
  var LessEqualGreater = "⋚";
  var LessFullEqual = "≦";
  var LessGreater = "≶";
  var lessgtr = "≶";
  var LessLess = "⪡";
  var lesssim = "≲";
  var LessSlantEqual = "⩽";
  var LessTilde = "≲";
  var lfisht = "⥼";
  var lfloor = "⌊";
  var Lfr = "𝔏";
  var lfr = "𝔩";
  var lg = "≶";
  var lgE = "⪑";
  var lHar = "⥢";
  var lhard = "↽";
  var lharu = "↼";
  var lharul = "⥪";
  var lhblk = "▄";
  var LJcy = "Љ";
  var ljcy = "љ";
  var Ll = "⋘";
  var ll = "≪";
  var llarr = "⇇";
  var llcorner = "⌞";
  var Lleftarrow = "⇚";
  var llhard = "⥫";
  var lltri = "◺";
  var Lmidot = "Ŀ";
  var lmidot = "ŀ";
  var lmoust = "⎰";
  var lmoustache = "⎰";
  var lnap = "⪉";
  var lnapprox = "⪉";
  var lnE = "≨";
  var lne = "⪇";
  var lneq = "⪇";
  var lneqq = "≨";
  var lnsim = "⋦";
  var loang = "⟬";
  var loarr = "⇽";
  var lobrk = "⟦";
  var LongLeftArrow = "⟵";
  var Longleftarrow = "⟸";
  var longleftarrow = "⟵";
  var LongLeftRightArrow = "⟷";
  var Longleftrightarrow = "⟺";
  var longleftrightarrow = "⟷";
  var longmapsto = "⟼";
  var LongRightArrow = "⟶";
  var Longrightarrow = "⟹";
  var longrightarrow = "⟶";
  var looparrowleft = "↫";
  var looparrowright = "↬";
  var lopar = "⦅";
  var Lopf = "𝕃";
  var lopf = "𝕝";
  var loplus = "⨭";
  var lotimes = "⨴";
  var lowast = "∗";
  var lowbar = "_";
  var LowerLeftArrow = "↙";
  var LowerRightArrow = "↘";
  var loz = "◊";
  var lozenge = "◊";
  var lozf = "⧫";
  var lpar = "(";
  var lparlt = "⦓";
  var lrarr = "⇆";
  var lrcorner = "⌟";
  var lrhar = "⇋";
  var lrhard = "⥭";
  var lrm = "‎";
  var lrtri = "⊿";
  var lsaquo = "‹";
  var Lscr = "ℒ";
  var lscr = "𝓁";
  var Lsh = "↰";
  var lsh = "↰";
  var lsim = "≲";
  var lsime = "⪍";
  var lsimg = "⪏";
  var lsqb = "[";
  var lsquo = "‘";
  var lsquor = "‚";
  var Lstrok = "Ł";
  var lstrok = "ł";
  var LT = "<";
  var Lt = "≪";
  var lt = "<";
  var ltcc = "⪦";
  var ltcir = "⩹";
  var ltdot = "⋖";
  var lthree = "⋋";
  var ltimes = "⋉";
  var ltlarr = "⥶";
  var ltquest = "⩻";
  var ltri = "◃";
  var ltrie = "⊴";
  var ltrif = "◂";
  var ltrPar = "⦖";
  var lurdshar = "⥊";
  var luruhar = "⥦";
  var lvertneqq = "≨︀";
  var lvnE = "≨︀";
  var macr = "¯";
  var male = "♂";
  var malt = "✠";
  var maltese = "✠";
  var map = "↦";
  var mapsto = "↦";
  var mapstodown = "↧";
  var mapstoleft = "↤";
  var mapstoup = "↥";
  var marker = "▮";
  var mcomma = "⨩";
  var Mcy = "М";
  var mcy = "м";
  var mdash = "—";
  var mDDot = "∺";
  var measuredangle = "∡";
  var MediumSpace = " ";
  var Mellintrf = "ℳ";
  var Mfr = "𝔐";
  var mfr = "𝔪";
  var mho = "℧";
  var micro = "µ";
  var mid = "∣";
  var midast = "*";
  var midcir = "⫰";
  var middot = "·";
  var minus = "−";
  var minusb = "⊟";
  var minusd = "∸";
  var minusdu = "⨪";
  var MinusPlus = "∓";
  var mlcp = "⫛";
  var mldr = "…";
  var mnplus = "∓";
  var models = "⊧";
  var Mopf = "𝕄";
  var mopf = "𝕞";
  var mp = "∓";
  var Mscr = "ℳ";
  var mscr = "𝓂";
  var mstpos = "∾";
  var Mu = "Μ";
  var mu = "μ";
  var multimap = "⊸";
  var mumap = "⊸";
  var nabla = "∇";
  var Nacute = "Ń";
  var nacute = "ń";
  var nang = "∠⃒";
  var nap = "≉";
  var napE = "⩰̸";
  var napid = "≋̸";
  var napos = "ŉ";
  var napprox = "≉";
  var natur = "♮";
  var natural = "♮";
  var naturals = "ℕ";
  var nbsp = " ";
  var nbump = "≎̸";
  var nbumpe = "≏̸";
  var ncap = "⩃";
  var Ncaron = "Ň";
  var ncaron = "ň";
  var Ncedil = "Ņ";
  var ncedil = "ņ";
  var ncong = "≇";
  var ncongdot = "⩭̸";
  var ncup = "⩂";
  var Ncy = "Н";
  var ncy = "н";
  var ndash = "–";
  var ne = "≠";
  var nearhk = "⤤";
  var neArr = "⇗";
  var nearr = "↗";
  var nearrow = "↗";
  var nedot = "≐̸";
  var NegativeMediumSpace = "​";
  var NegativeThickSpace = "​";
  var NegativeThinSpace = "​";
  var NegativeVeryThinSpace = "​";
  var nequiv = "≢";
  var nesear = "⤨";
  var nesim = "≂̸";
  var NestedGreaterGreater = "≫";
  var NestedLessLess = "≪";
  var NewLine = "\n";
  var nexist = "∄";
  var nexists = "∄";
  var Nfr = "𝔑";
  var nfr = "𝔫";
  var ngE = "≧̸";
  var nge = "≱";
  var ngeq = "≱";
  var ngeqq = "≧̸";
  var ngeqslant = "⩾̸";
  var nges = "⩾̸";
  var nGg = "⋙̸";
  var ngsim = "≵";
  var nGt = "≫⃒";
  var ngt = "≯";
  var ngtr = "≯";
  var nGtv = "≫̸";
  var nhArr = "⇎";
  var nharr = "↮";
  var nhpar = "⫲";
  var ni = "∋";
  var nis = "⋼";
  var nisd = "⋺";
  var niv = "∋";
  var NJcy = "Њ";
  var njcy = "њ";
  var nlArr = "⇍";
  var nlarr = "↚";
  var nldr = "‥";
  var nlE = "≦̸";
  var nle = "≰";
  var nLeftarrow = "⇍";
  var nleftarrow = "↚";
  var nLeftrightarrow = "⇎";
  var nleftrightarrow = "↮";
  var nleq = "≰";
  var nleqq = "≦̸";
  var nleqslant = "⩽̸";
  var nles = "⩽̸";
  var nless = "≮";
  var nLl = "⋘̸";
  var nlsim = "≴";
  var nLt = "≪⃒";
  var nlt = "≮";
  var nltri = "⋪";
  var nltrie = "⋬";
  var nLtv = "≪̸";
  var nmid = "∤";
  var NoBreak = "⁠";
  var NonBreakingSpace = " ";
  var Nopf = "ℕ";
  var nopf = "𝕟";
  var Not = "⫬";
  var not = "¬";
  var NotCongruent = "≢";
  var NotCupCap = "≭";
  var NotDoubleVerticalBar = "∦";
  var NotElement = "∉";
  var NotEqual = "≠";
  var NotEqualTilde = "≂̸";
  var NotExists = "∄";
  var NotGreater = "≯";
  var NotGreaterEqual = "≱";
  var NotGreaterFullEqual = "≧̸";
  var NotGreaterGreater = "≫̸";
  var NotGreaterLess = "≹";
  var NotGreaterSlantEqual = "⩾̸";
  var NotGreaterTilde = "≵";
  var NotHumpDownHump = "≎̸";
  var NotHumpEqual = "≏̸";
  var notin = "∉";
  var notindot = "⋵̸";
  var notinE = "⋹̸";
  var notinva = "∉";
  var notinvb = "⋷";
  var notinvc = "⋶";
  var NotLeftTriangle = "⋪";
  var NotLeftTriangleBar = "⧏̸";
  var NotLeftTriangleEqual = "⋬";
  var NotLess = "≮";
  var NotLessEqual = "≰";
  var NotLessGreater = "≸";
  var NotLessLess = "≪̸";
  var NotLessSlantEqual = "⩽̸";
  var NotLessTilde = "≴";
  var NotNestedGreaterGreater = "⪢̸";
  var NotNestedLessLess = "⪡̸";
  var notni = "∌";
  var notniva = "∌";
  var notnivb = "⋾";
  var notnivc = "⋽";
  var NotPrecedes = "⊀";
  var NotPrecedesEqual = "⪯̸";
  var NotPrecedesSlantEqual = "⋠";
  var NotReverseElement = "∌";
  var NotRightTriangle = "⋫";
  var NotRightTriangleBar = "⧐̸";
  var NotRightTriangleEqual = "⋭";
  var NotSquareSubset = "⊏̸";
  var NotSquareSubsetEqual = "⋢";
  var NotSquareSuperset = "⊐̸";
  var NotSquareSupersetEqual = "⋣";
  var NotSubset = "⊂⃒";
  var NotSubsetEqual = "⊈";
  var NotSucceeds = "⊁";
  var NotSucceedsEqual = "⪰̸";
  var NotSucceedsSlantEqual = "⋡";
  var NotSucceedsTilde = "≿̸";
  var NotSuperset = "⊃⃒";
  var NotSupersetEqual = "⊉";
  var NotTilde = "≁";
  var NotTildeEqual = "≄";
  var NotTildeFullEqual = "≇";
  var NotTildeTilde = "≉";
  var NotVerticalBar = "∤";
  var npar = "∦";
  var nparallel = "∦";
  var nparsl = "⫽⃥";
  var npart = "∂̸";
  var npolint = "⨔";
  var npr = "⊀";
  var nprcue = "⋠";
  var npre = "⪯̸";
  var nprec = "⊀";
  var npreceq = "⪯̸";
  var nrArr = "⇏";
  var nrarr = "↛";
  var nrarrc = "⤳̸";
  var nrarrw = "↝̸";
  var nRightarrow = "⇏";
  var nrightarrow = "↛";
  var nrtri = "⋫";
  var nrtrie = "⋭";
  var nsc = "⊁";
  var nsccue = "⋡";
  var nsce = "⪰̸";
  var Nscr = "𝒩";
  var nscr = "𝓃";
  var nshortmid = "∤";
  var nshortparallel = "∦";
  var nsim = "≁";
  var nsime = "≄";
  var nsimeq = "≄";
  var nsmid = "∤";
  var nspar = "∦";
  var nsqsube = "⋢";
  var nsqsupe = "⋣";
  var nsub = "⊄";
  var nsubE = "⫅̸";
  var nsube = "⊈";
  var nsubset = "⊂⃒";
  var nsubseteq = "⊈";
  var nsubseteqq = "⫅̸";
  var nsucc = "⊁";
  var nsucceq = "⪰̸";
  var nsup = "⊅";
  var nsupE = "⫆̸";
  var nsupe = "⊉";
  var nsupset = "⊃⃒";
  var nsupseteq = "⊉";
  var nsupseteqq = "⫆̸";
  var ntgl = "≹";
  var Ntilde = "Ñ";
  var ntilde = "ñ";
  var ntlg = "≸";
  var ntriangleleft = "⋪";
  var ntrianglelefteq = "⋬";
  var ntriangleright = "⋫";
  var ntrianglerighteq = "⋭";
  var Nu = "Ν";
  var nu = "ν";
  var num = "#";
  var numero = "№";
  var numsp = " ";
  var nvap = "≍⃒";
  var nVDash = "⊯";
  var nVdash = "⊮";
  var nvDash = "⊭";
  var nvdash = "⊬";
  var nvge = "≥⃒";
  var nvgt = ">⃒";
  var nvHarr = "⤄";
  var nvinfin = "⧞";
  var nvlArr = "⤂";
  var nvle = "≤⃒";
  var nvlt = "<⃒";
  var nvltrie = "⊴⃒";
  var nvrArr = "⤃";
  var nvrtrie = "⊵⃒";
  var nvsim = "∼⃒";
  var nwarhk = "⤣";
  var nwArr = "⇖";
  var nwarr = "↖";
  var nwarrow = "↖";
  var nwnear = "⤧";
  var Oacute = "Ó";
  var oacute = "ó";
  var oast = "⊛";
  var ocir = "⊚";
  var Ocirc = "Ô";
  var ocirc = "ô";
  var Ocy = "О";
  var ocy = "о";
  var odash = "⊝";
  var Odblac = "Ő";
  var odblac = "ő";
  var odiv = "⨸";
  var odot = "⊙";
  var odsold = "⦼";
  var OElig = "Œ";
  var oelig = "œ";
  var ofcir = "⦿";
  var Ofr = "𝔒";
  var ofr = "𝔬";
  var ogon = "˛";
  var Ograve = "Ò";
  var ograve = "ò";
  var ogt = "⧁";
  var ohbar = "⦵";
  var ohm = "Ω";
  var oint = "∮";
  var olarr = "↺";
  var olcir = "⦾";
  var olcross = "⦻";
  var oline = "‾";
  var olt = "⧀";
  var Omacr = "Ō";
  var omacr = "ō";
  var Omega = "Ω";
  var omega = "ω";
  var Omicron = "Ο";
  var omicron = "ο";
  var omid = "⦶";
  var ominus = "⊖";
  var Oopf = "𝕆";
  var oopf = "𝕠";
  var opar = "⦷";
  var OpenCurlyDoubleQuote = "“";
  var OpenCurlyQuote = "‘";
  var operp = "⦹";
  var oplus = "⊕";
  var Or = "⩔";
  var or = "∨";
  var orarr = "↻";
  var ord = "⩝";
  var order = "ℴ";
  var orderof = "ℴ";
  var ordf = "ª";
  var ordm = "º";
  var origof = "⊶";
  var oror = "⩖";
  var orslope = "⩗";
  var orv = "⩛";
  var oS = "Ⓢ";
  var Oscr = "𝒪";
  var oscr = "ℴ";
  var Oslash = "Ø";
  var oslash = "ø";
  var osol = "⊘";
  var Otilde = "Õ";
  var otilde = "õ";
  var Otimes = "⨷";
  var otimes = "⊗";
  var otimesas = "⨶";
  var Ouml = "Ö";
  var ouml = "ö";
  var ovbar = "⌽";
  var OverBar = "‾";
  var OverBrace = "⏞";
  var OverBracket = "⎴";
  var OverParenthesis = "⏜";
  var par = "∥";
  var para = "¶";
  var parallel = "∥";
  var parsim = "⫳";
  var parsl = "⫽";
  var part = "∂";
  var PartialD = "∂";
  var Pcy = "П";
  var pcy = "п";
  var percnt = "%";
  var period = ".";
  var permil = "‰";
  var perp = "⊥";
  var pertenk = "‱";
  var Pfr = "𝔓";
  var pfr = "𝔭";
  var Phi = "Φ";
  var phi = "φ";
  var phiv = "ϕ";
  var phmmat = "ℳ";
  var phone = "☎";
  var Pi = "Π";
  var pi = "π";
  var pitchfork = "⋔";
  var piv = "ϖ";
  var planck = "ℏ";
  var planckh = "ℎ";
  var plankv = "ℏ";
  var plus = "+";
  var plusacir = "⨣";
  var plusb = "⊞";
  var pluscir = "⨢";
  var plusdo = "∔";
  var plusdu = "⨥";
  var pluse = "⩲";
  var PlusMinus = "±";
  var plusmn = "±";
  var plussim = "⨦";
  var plustwo = "⨧";
  var pm = "±";
  var Poincareplane = "ℌ";
  var pointint = "⨕";
  var Popf = "ℙ";
  var popf = "𝕡";
  var pound = "£";
  var Pr = "⪻";
  var pr = "≺";
  var prap = "⪷";
  var prcue = "≼";
  var prE = "⪳";
  var pre = "⪯";
  var prec = "≺";
  var precapprox = "⪷";
  var preccurlyeq = "≼";
  var Precedes = "≺";
  var PrecedesEqual = "⪯";
  var PrecedesSlantEqual = "≼";
  var PrecedesTilde = "≾";
  var preceq = "⪯";
  var precnapprox = "⪹";
  var precneqq = "⪵";
  var precnsim = "⋨";
  var precsim = "≾";
  var Prime = "″";
  var prime = "′";
  var primes = "ℙ";
  var prnap = "⪹";
  var prnE = "⪵";
  var prnsim = "⋨";
  var prod = "∏";
  var Product = "∏";
  var profalar = "⌮";
  var profline = "⌒";
  var profsurf = "⌓";
  var prop = "∝";
  var Proportion = "∷";
  var Proportional = "∝";
  var propto = "∝";
  var prsim = "≾";
  var prurel = "⊰";
  var Pscr = "𝒫";
  var pscr = "𝓅";
  var Psi = "Ψ";
  var psi = "ψ";
  var puncsp = " ";
  var Qfr = "𝔔";
  var qfr = "𝔮";
  var qint = "⨌";
  var Qopf = "ℚ";
  var qopf = "𝕢";
  var qprime = "⁗";
  var Qscr = "𝒬";
  var qscr = "𝓆";
  var quaternions = "ℍ";
  var quatint = "⨖";
  var quest = "?";
  var questeq = "≟";
  var QUOT = "\"";
  var quot = "\"";
  var rAarr = "⇛";
  var race = "∽̱";
  var Racute = "Ŕ";
  var racute = "ŕ";
  var radic = "√";
  var raemptyv = "⦳";
  var Rang = "⟫";
  var rang = "⟩";
  var rangd = "⦒";
  var range = "⦥";
  var rangle = "⟩";
  var raquo = "»";
  var Rarr = "↠";
  var rArr = "⇒";
  var rarr = "→";
  var rarrap = "⥵";
  var rarrb = "⇥";
  var rarrbfs = "⤠";
  var rarrc = "⤳";
  var rarrfs = "⤞";
  var rarrhk = "↪";
  var rarrlp = "↬";
  var rarrpl = "⥅";
  var rarrsim = "⥴";
  var Rarrtl = "⤖";
  var rarrtl = "↣";
  var rarrw = "↝";
  var rAtail = "⤜";
  var ratail = "⤚";
  var ratio = "∶";
  var rationals = "ℚ";
  var RBarr = "⤐";
  var rBarr = "⤏";
  var rbarr = "⤍";
  var rbbrk = "❳";
  var rbrace = "}";
  var rbrack = "]";
  var rbrke = "⦌";
  var rbrksld = "⦎";
  var rbrkslu = "⦐";
  var Rcaron = "Ř";
  var rcaron = "ř";
  var Rcedil = "Ŗ";
  var rcedil = "ŗ";
  var rceil = "⌉";
  var rcub = "}";
  var Rcy = "Р";
  var rcy = "р";
  var rdca = "⤷";
  var rdldhar = "⥩";
  var rdquo = "”";
  var rdquor = "”";
  var rdsh = "↳";
  var Re = "ℜ";
  var real = "ℜ";
  var realine = "ℛ";
  var realpart = "ℜ";
  var reals = "ℝ";
  var rect = "▭";
  var REG = "®";
  var reg = "®";
  var ReverseElement = "∋";
  var ReverseEquilibrium = "⇋";
  var ReverseUpEquilibrium = "⥯";
  var rfisht = "⥽";
  var rfloor = "⌋";
  var Rfr = "ℜ";
  var rfr = "𝔯";
  var rHar = "⥤";
  var rhard = "⇁";
  var rharu = "⇀";
  var rharul = "⥬";
  var Rho = "Ρ";
  var rho = "ρ";
  var rhov = "ϱ";
  var RightAngleBracket = "⟩";
  var RightArrow = "→";
  var Rightarrow = "⇒";
  var rightarrow = "→";
  var RightArrowBar = "⇥";
  var RightArrowLeftArrow = "⇄";
  var rightarrowtail = "↣";
  var RightCeiling = "⌉";
  var RightDoubleBracket = "⟧";
  var RightDownTeeVector = "⥝";
  var RightDownVector = "⇂";
  var RightDownVectorBar = "⥕";
  var RightFloor = "⌋";
  var rightharpoondown = "⇁";
  var rightharpoonup = "⇀";
  var rightleftarrows = "⇄";
  var rightleftharpoons = "⇌";
  var rightrightarrows = "⇉";
  var rightsquigarrow = "↝";
  var RightTee = "⊢";
  var RightTeeArrow = "↦";
  var RightTeeVector = "⥛";
  var rightthreetimes = "⋌";
  var RightTriangle = "⊳";
  var RightTriangleBar = "⧐";
  var RightTriangleEqual = "⊵";
  var RightUpDownVector = "⥏";
  var RightUpTeeVector = "⥜";
  var RightUpVector = "↾";
  var RightUpVectorBar = "⥔";
  var RightVector = "⇀";
  var RightVectorBar = "⥓";
  var ring = "˚";
  var risingdotseq = "≓";
  var rlarr = "⇄";
  var rlhar = "⇌";
  var rlm = "‏";
  var rmoust = "⎱";
  var rmoustache = "⎱";
  var rnmid = "⫮";
  var roang = "⟭";
  var roarr = "⇾";
  var robrk = "⟧";
  var ropar = "⦆";
  var Ropf = "ℝ";
  var ropf = "𝕣";
  var roplus = "⨮";
  var rotimes = "⨵";
  var RoundImplies = "⥰";
  var rpar = ")";
  var rpargt = "⦔";
  var rppolint = "⨒";
  var rrarr = "⇉";
  var Rrightarrow = "⇛";
  var rsaquo = "›";
  var Rscr = "ℛ";
  var rscr = "𝓇";
  var Rsh = "↱";
  var rsh = "↱";
  var rsqb = "]";
  var rsquo = "’";
  var rsquor = "’";
  var rthree = "⋌";
  var rtimes = "⋊";
  var rtri = "▹";
  var rtrie = "⊵";
  var rtrif = "▸";
  var rtriltri = "⧎";
  var RuleDelayed = "⧴";
  var ruluhar = "⥨";
  var rx = "℞";
  var Sacute = "Ś";
  var sacute = "ś";
  var sbquo = "‚";
  var Sc = "⪼";
  var sc = "≻";
  var scap = "⪸";
  var Scaron = "Š";
  var scaron = "š";
  var sccue = "≽";
  var scE = "⪴";
  var sce = "⪰";
  var Scedil = "Ş";
  var scedil = "ş";
  var Scirc = "Ŝ";
  var scirc = "ŝ";
  var scnap = "⪺";
  var scnE = "⪶";
  var scnsim = "⋩";
  var scpolint = "⨓";
  var scsim = "≿";
  var Scy = "С";
  var scy = "с";
  var sdot = "⋅";
  var sdotb = "⊡";
  var sdote = "⩦";
  var searhk = "⤥";
  var seArr = "⇘";
  var searr = "↘";
  var searrow = "↘";
  var sect = "§";
  var semi = ";";
  var seswar = "⤩";
  var setminus = "∖";
  var setmn = "∖";
  var sext = "✶";
  var Sfr = "𝔖";
  var sfr = "𝔰";
  var sfrown = "⌢";
  var sharp = "♯";
  var SHCHcy = "Щ";
  var shchcy = "щ";
  var SHcy = "Ш";
  var shcy = "ш";
  var ShortDownArrow = "↓";
  var ShortLeftArrow = "←";
  var shortmid = "∣";
  var shortparallel = "∥";
  var ShortRightArrow = "→";
  var ShortUpArrow = "↑";
  var shy = "­";
  var Sigma = "Σ";
  var sigma = "σ";
  var sigmaf = "ς";
  var sigmav = "ς";
  var sim = "∼";
  var simdot = "⩪";
  var sime = "≃";
  var simeq = "≃";
  var simg = "⪞";
  var simgE = "⪠";
  var siml = "⪝";
  var simlE = "⪟";
  var simne = "≆";
  var simplus = "⨤";
  var simrarr = "⥲";
  var slarr = "←";
  var SmallCircle = "∘";
  var smallsetminus = "∖";
  var smashp = "⨳";
  var smeparsl = "⧤";
  var smid = "∣";
  var smile = "⌣";
  var smt = "⪪";
  var smte = "⪬";
  var smtes = "⪬︀";
  var SOFTcy = "Ь";
  var softcy = "ь";
  var sol = "/";
  var solb = "⧄";
  var solbar = "⌿";
  var Sopf = "𝕊";
  var sopf = "𝕤";
  var spades = "♠";
  var spadesuit = "♠";
  var spar = "∥";
  var sqcap = "⊓";
  var sqcaps = "⊓︀";
  var sqcup = "⊔";
  var sqcups = "⊔︀";
  var Sqrt = "√";
  var sqsub = "⊏";
  var sqsube = "⊑";
  var sqsubset = "⊏";
  var sqsubseteq = "⊑";
  var sqsup = "⊐";
  var sqsupe = "⊒";
  var sqsupset = "⊐";
  var sqsupseteq = "⊒";
  var squ = "□";
  var Square = "□";
  var square = "□";
  var SquareIntersection = "⊓";
  var SquareSubset = "⊏";
  var SquareSubsetEqual = "⊑";
  var SquareSuperset = "⊐";
  var SquareSupersetEqual = "⊒";
  var SquareUnion = "⊔";
  var squarf = "▪";
  var squf = "▪";
  var srarr = "→";
  var Sscr = "𝒮";
  var sscr = "𝓈";
  var ssetmn = "∖";
  var ssmile = "⌣";
  var sstarf = "⋆";
  var Star = "⋆";
  var star = "☆";
  var starf = "★";
  var straightepsilon = "ϵ";
  var straightphi = "ϕ";
  var strns = "¯";
  var Sub = "⋐";
  var sub = "⊂";
  var subdot = "⪽";
  var subE = "⫅";
  var sube = "⊆";
  var subedot = "⫃";
  var submult = "⫁";
  var subnE = "⫋";
  var subne = "⊊";
  var subplus = "⪿";
  var subrarr = "⥹";
  var Subset = "⋐";
  var subset = "⊂";
  var subseteq = "⊆";
  var subseteqq = "⫅";
  var SubsetEqual = "⊆";
  var subsetneq = "⊊";
  var subsetneqq = "⫋";
  var subsim = "⫇";
  var subsub = "⫕";
  var subsup = "⫓";
  var succ = "≻";
  var succapprox = "⪸";
  var succcurlyeq = "≽";
  var Succeeds = "≻";
  var SucceedsEqual = "⪰";
  var SucceedsSlantEqual = "≽";
  var SucceedsTilde = "≿";
  var succeq = "⪰";
  var succnapprox = "⪺";
  var succneqq = "⪶";
  var succnsim = "⋩";
  var succsim = "≿";
  var SuchThat = "∋";
  var Sum = "∑";
  var sum = "∑";
  var sung = "♪";
  var Sup = "⋑";
  var sup = "⊃";
  var sup1 = "¹";
  var sup2 = "²";
  var sup3 = "³";
  var supdot = "⪾";
  var supdsub = "⫘";
  var supE = "⫆";
  var supe = "⊇";
  var supedot = "⫄";
  var Superset = "⊃";
  var SupersetEqual = "⊇";
  var suphsol = "⟉";
  var suphsub = "⫗";
  var suplarr = "⥻";
  var supmult = "⫂";
  var supnE = "⫌";
  var supne = "⊋";
  var supplus = "⫀";
  var Supset = "⋑";
  var supset = "⊃";
  var supseteq = "⊇";
  var supseteqq = "⫆";
  var supsetneq = "⊋";
  var supsetneqq = "⫌";
  var supsim = "⫈";
  var supsub = "⫔";
  var supsup = "⫖";
  var swarhk = "⤦";
  var swArr = "⇙";
  var swarr = "↙";
  var swarrow = "↙";
  var swnwar = "⤪";
  var szlig = "ß";
  var Tab = "\t";
  var target = "⌖";
  var Tau = "Τ";
  var tau = "τ";
  var tbrk = "⎴";
  var Tcaron = "Ť";
  var tcaron = "ť";
  var Tcedil = "Ţ";
  var tcedil = "ţ";
  var Tcy = "Т";
  var tcy = "т";
  var tdot = "⃛";
  var telrec = "⌕";
  var Tfr = "𝔗";
  var tfr = "𝔱";
  var there4 = "∴";
  var Therefore = "∴";
  var therefore = "∴";
  var Theta = "Θ";
  var theta = "θ";
  var thetasym = "ϑ";
  var thetav = "ϑ";
  var thickapprox = "≈";
  var thicksim = "∼";
  var ThickSpace = "  ";
  var thinsp = " ";
  var ThinSpace = " ";
  var thkap = "≈";
  var thksim = "∼";
  var THORN = "Þ";
  var thorn = "þ";
  var Tilde = "∼";
  var tilde = "˜";
  var TildeEqual = "≃";
  var TildeFullEqual = "≅";
  var TildeTilde = "≈";
  var times = "×";
  var timesb = "⊠";
  var timesbar = "⨱";
  var timesd = "⨰";
  var tint = "∭";
  var toea = "⤨";
  var top = "⊤";
  var topbot = "⌶";
  var topcir = "⫱";
  var Topf = "𝕋";
  var topf = "𝕥";
  var topfork = "⫚";
  var tosa = "⤩";
  var tprime = "‴";
  var TRADE = "™";
  var trade = "™";
  var triangle = "▵";
  var triangledown = "▿";
  var triangleleft = "◃";
  var trianglelefteq = "⊴";
  var triangleq = "≜";
  var triangleright = "▹";
  var trianglerighteq = "⊵";
  var tridot = "◬";
  var trie = "≜";
  var triminus = "⨺";
  var TripleDot = "⃛";
  var triplus = "⨹";
  var trisb = "⧍";
  var tritime = "⨻";
  var trpezium = "⏢";
  var Tscr = "𝒯";
  var tscr = "𝓉";
  var TScy = "Ц";
  var tscy = "ц";
  var TSHcy = "Ћ";
  var tshcy = "ћ";
  var Tstrok = "Ŧ";
  var tstrok = "ŧ";
  var twixt = "≬";
  var twoheadleftarrow = "↞";
  var twoheadrightarrow = "↠";
  var Uacute = "Ú";
  var uacute = "ú";
  var Uarr = "↟";
  var uArr = "⇑";
  var uarr = "↑";
  var Uarrocir = "⥉";
  var Ubrcy = "Ў";
  var ubrcy = "ў";
  var Ubreve = "Ŭ";
  var ubreve = "ŭ";
  var Ucirc = "Û";
  var ucirc = "û";
  var Ucy = "У";
  var ucy = "у";
  var udarr = "⇅";
  var Udblac = "Ű";
  var udblac = "ű";
  var udhar = "⥮";
  var ufisht = "⥾";
  var Ufr = "𝔘";
  var ufr = "𝔲";
  var Ugrave = "Ù";
  var ugrave = "ù";
  var uHar = "⥣";
  var uharl = "↿";
  var uharr = "↾";
  var uhblk = "▀";
  var ulcorn = "⌜";
  var ulcorner = "⌜";
  var ulcrop = "⌏";
  var ultri = "◸";
  var Umacr = "Ū";
  var umacr = "ū";
  var uml = "¨";
  var UnderBar = "_";
  var UnderBrace = "⏟";
  var UnderBracket = "⎵";
  var UnderParenthesis = "⏝";
  var Union = "⋃";
  var UnionPlus = "⊎";
  var Uogon = "Ų";
  var uogon = "ų";
  var Uopf = "𝕌";
  var uopf = "𝕦";
  var UpArrow = "↑";
  var Uparrow = "⇑";
  var uparrow = "↑";
  var UpArrowBar = "⤒";
  var UpArrowDownArrow = "⇅";
  var UpDownArrow = "↕";
  var Updownarrow = "⇕";
  var updownarrow = "↕";
  var UpEquilibrium = "⥮";
  var upharpoonleft = "↿";
  var upharpoonright = "↾";
  var uplus = "⊎";
  var UpperLeftArrow = "↖";
  var UpperRightArrow = "↗";
  var Upsi = "ϒ";
  var upsi = "υ";
  var upsih = "ϒ";
  var Upsilon = "Υ";
  var upsilon = "υ";
  var UpTee = "⊥";
  var UpTeeArrow = "↥";
  var upuparrows = "⇈";
  var urcorn = "⌝";
  var urcorner = "⌝";
  var urcrop = "⌎";
  var Uring = "Ů";
  var uring = "ů";
  var urtri = "◹";
  var Uscr = "𝒰";
  var uscr = "𝓊";
  var utdot = "⋰";
  var Utilde = "Ũ";
  var utilde = "ũ";
  var utri = "▵";
  var utrif = "▴";
  var uuarr = "⇈";
  var Uuml = "Ü";
  var uuml = "ü";
  var uwangle = "⦧";
  var vangrt = "⦜";
  var varepsilon = "ϵ";
  var varkappa = "ϰ";
  var varnothing = "∅";
  var varphi = "ϕ";
  var varpi = "ϖ";
  var varpropto = "∝";
  var vArr = "⇕";
  var varr = "↕";
  var varrho = "ϱ";
  var varsigma = "ς";
  var varsubsetneq = "⊊︀";
  var varsubsetneqq = "⫋︀";
  var varsupsetneq = "⊋︀";
  var varsupsetneqq = "⫌︀";
  var vartheta = "ϑ";
  var vartriangleleft = "⊲";
  var vartriangleright = "⊳";
  var Vbar = "⫫";
  var vBar = "⫨";
  var vBarv = "⫩";
  var Vcy = "В";
  var vcy = "в";
  var VDash = "⊫";
  var Vdash = "⊩";
  var vDash = "⊨";
  var vdash = "⊢";
  var Vdashl = "⫦";
  var Vee = "⋁";
  var vee = "∨";
  var veebar = "⊻";
  var veeeq = "≚";
  var vellip = "⋮";
  var Verbar = "‖";
  var verbar = "|";
  var Vert = "‖";
  var vert = "|";
  var VerticalBar = "∣";
  var VerticalLine = "|";
  var VerticalSeparator = "❘";
  var VerticalTilde = "≀";
  var VeryThinSpace = " ";
  var Vfr = "𝔙";
  var vfr = "𝔳";
  var vltri = "⊲";
  var vnsub = "⊂⃒";
  var vnsup = "⊃⃒";
  var Vopf = "𝕍";
  var vopf = "𝕧";
  var vprop = "∝";
  var vrtri = "⊳";
  var Vscr = "𝒱";
  var vscr = "𝓋";
  var vsubnE = "⫋︀";
  var vsubne = "⊊︀";
  var vsupnE = "⫌︀";
  var vsupne = "⊋︀";
  var Vvdash = "⊪";
  var vzigzag = "⦚";
  var Wcirc = "Ŵ";
  var wcirc = "ŵ";
  var wedbar = "⩟";
  var Wedge = "⋀";
  var wedge = "∧";
  var wedgeq = "≙";
  var weierp = "℘";
  var Wfr = "𝔚";
  var wfr = "𝔴";
  var Wopf = "𝕎";
  var wopf = "𝕨";
  var wp = "℘";
  var wr = "≀";
  var wreath = "≀";
  var Wscr = "𝒲";
  var wscr = "𝓌";
  var xcap = "⋂";
  var xcirc = "◯";
  var xcup = "⋃";
  var xdtri = "▽";
  var Xfr = "𝔛";
  var xfr = "𝔵";
  var xhArr = "⟺";
  var xharr = "⟷";
  var Xi = "Ξ";
  var xi = "ξ";
  var xlArr = "⟸";
  var xlarr = "⟵";
  var xmap = "⟼";
  var xnis = "⋻";
  var xodot = "⨀";
  var Xopf = "𝕏";
  var xopf = "𝕩";
  var xoplus = "⨁";
  var xotime = "⨂";
  var xrArr = "⟹";
  var xrarr = "⟶";
  var Xscr = "𝒳";
  var xscr = "𝓍";
  var xsqcup = "⨆";
  var xuplus = "⨄";
  var xutri = "△";
  var xvee = "⋁";
  var xwedge = "⋀";
  var Yacute = "Ý";
  var yacute = "ý";
  var YAcy = "Я";
  var yacy = "я";
  var Ycirc = "Ŷ";
  var ycirc = "ŷ";
  var Ycy = "Ы";
  var ycy = "ы";
  var yen = "¥";
  var Yfr = "𝔜";
  var yfr = "𝔶";
  var YIcy = "Ї";
  var yicy = "ї";
  var Yopf = "𝕐";
  var yopf = "𝕪";
  var Yscr = "𝒴";
  var yscr = "𝓎";
  var YUcy = "Ю";
  var yucy = "ю";
  var Yuml = "Ÿ";
  var yuml = "ÿ";
  var Zacute = "Ź";
  var zacute = "ź";
  var Zcaron = "Ž";
  var zcaron = "ž";
  var Zcy = "З";
  var zcy = "з";
  var Zdot = "Ż";
  var zdot = "ż";
  var zeetrf = "ℨ";
  var ZeroWidthSpace = "​";
  var Zeta = "Ζ";
  var zeta = "ζ";
  var Zfr = "ℨ";
  var zfr = "𝔷";
  var ZHcy = "Ж";
  var zhcy = "ж";
  var zigrarr = "⇝";
  var Zopf = "ℤ";
  var zopf = "𝕫";
  var Zscr = "𝒵";
  var zscr = "𝓏";
  var zwj = "‍";
  var zwnj = "‌";
  var allNamedEntities = {
    Aacute: Aacute,
    aacute: aacute,
    Abreve: Abreve,
    abreve: abreve,
    ac: ac,
    acd: acd,
    acE: acE,
    Acirc: Acirc,
    acirc: acirc,
    acute: acute,
    Acy: Acy,
    acy: acy,
    AElig: AElig,
    aelig: aelig,
    af: af,
    Afr: Afr,
    afr: afr,
    Agrave: Agrave,
    agrave: agrave,
    alefsym: alefsym,
    aleph: aleph,
    Alpha: Alpha,
    alpha: alpha,
    Amacr: Amacr,
    amacr: amacr,
    amalg: amalg,
    AMP: AMP,
    amp: amp,
    And: And,
    and: and,
    andand: andand,
    andd: andd,
    andslope: andslope,
    andv: andv,
    ang: ang,
    ange: ange,
    angle: angle,
    angmsd: angmsd,
    angmsdaa: angmsdaa,
    angmsdab: angmsdab,
    angmsdac: angmsdac,
    angmsdad: angmsdad,
    angmsdae: angmsdae,
    angmsdaf: angmsdaf,
    angmsdag: angmsdag,
    angmsdah: angmsdah,
    angrt: angrt,
    angrtvb: angrtvb,
    angrtvbd: angrtvbd,
    angsph: angsph,
    angst: angst,
    angzarr: angzarr,
    Aogon: Aogon,
    aogon: aogon,
    Aopf: Aopf,
    aopf: aopf,
    ap: ap,
    apacir: apacir,
    apE: apE,
    ape: ape,
    apid: apid,
    apos: apos,
    ApplyFunction: ApplyFunction,
    approx: approx,
    approxeq: approxeq,
    Aring: Aring,
    aring: aring,
    Ascr: Ascr,
    ascr: ascr,
    Assign: Assign,
    ast: ast,
    asymp: asymp,
    asympeq: asympeq,
    Atilde: Atilde,
    atilde: atilde,
    Auml: Auml,
    auml: auml,
    awconint: awconint,
    awint: awint,
    backcong: backcong,
    backepsilon: backepsilon,
    backprime: backprime,
    backsim: backsim,
    backsimeq: backsimeq,
    Backslash: Backslash,
    Barv: Barv,
    barvee: barvee,
    Barwed: Barwed,
    barwed: barwed,
    barwedge: barwedge,
    bbrk: bbrk,
    bbrktbrk: bbrktbrk,
    bcong: bcong,
    Bcy: Bcy,
    bcy: bcy,
    bdquo: bdquo,
    becaus: becaus,
    Because: Because,
    because: because,
    bemptyv: bemptyv,
    bepsi: bepsi,
    bernou: bernou,
    Bernoullis: Bernoullis,
    Beta: Beta,
    beta: beta,
    beth: beth,
    between: between,
    Bfr: Bfr,
    bfr: bfr,
    bigcap: bigcap,
    bigcirc: bigcirc,
    bigcup: bigcup,
    bigodot: bigodot,
    bigoplus: bigoplus,
    bigotimes: bigotimes,
    bigsqcup: bigsqcup,
    bigstar: bigstar,
    bigtriangledown: bigtriangledown,
    bigtriangleup: bigtriangleup,
    biguplus: biguplus,
    bigvee: bigvee,
    bigwedge: bigwedge,
    bkarow: bkarow,
    blacklozenge: blacklozenge,
    blacksquare: blacksquare,
    blacktriangle: blacktriangle,
    blacktriangledown: blacktriangledown,
    blacktriangleleft: blacktriangleleft,
    blacktriangleright: blacktriangleright,
    blank: blank,
    blk12: blk12,
    blk14: blk14,
    blk34: blk34,
    block: block,
    bne: bne,
    bnequiv: bnequiv,
    bNot: bNot,
    bnot: bnot,
    Bopf: Bopf,
    bopf: bopf,
    bot: bot,
    bottom: bottom,
    bowtie: bowtie,
    boxbox: boxbox,
    boxDL: boxDL,
    boxDl: boxDl,
    boxdL: boxdL,
    boxdl: boxdl,
    boxDR: boxDR,
    boxDr: boxDr,
    boxdR: boxdR,
    boxdr: boxdr,
    boxH: boxH,
    boxh: boxh,
    boxHD: boxHD,
    boxHd: boxHd,
    boxhD: boxhD,
    boxhd: boxhd,
    boxHU: boxHU,
    boxHu: boxHu,
    boxhU: boxhU,
    boxhu: boxhu,
    boxminus: boxminus,
    boxplus: boxplus,
    boxtimes: boxtimes,
    boxUL: boxUL,
    boxUl: boxUl,
    boxuL: boxuL,
    boxul: boxul,
    boxUR: boxUR,
    boxUr: boxUr,
    boxuR: boxuR,
    boxur: boxur,
    boxV: boxV,
    boxv: boxv,
    boxVH: boxVH,
    boxVh: boxVh,
    boxvH: boxvH,
    boxvh: boxvh,
    boxVL: boxVL,
    boxVl: boxVl,
    boxvL: boxvL,
    boxvl: boxvl,
    boxVR: boxVR,
    boxVr: boxVr,
    boxvR: boxvR,
    boxvr: boxvr,
    bprime: bprime,
    Breve: Breve,
    breve: breve,
    brvbar: brvbar,
    Bscr: Bscr,
    bscr: bscr,
    bsemi: bsemi,
    bsim: bsim,
    bsime: bsime,
    bsol: bsol,
    bsolb: bsolb,
    bsolhsub: bsolhsub,
    bull: bull,
    bullet: bullet,
    bump: bump,
    bumpE: bumpE,
    bumpe: bumpe,
    Bumpeq: Bumpeq,
    bumpeq: bumpeq,
    Cacute: Cacute,
    cacute: cacute,
    Cap: Cap,
    cap: cap,
    capand: capand,
    capbrcup: capbrcup,
    capcap: capcap,
    capcup: capcup,
    capdot: capdot,
    CapitalDifferentialD: CapitalDifferentialD,
    caps: caps,
    caret: caret,
    caron: caron,
    Cayleys: Cayleys,
    ccaps: ccaps,
    Ccaron: Ccaron,
    ccaron: ccaron,
    Ccedil: Ccedil,
    ccedil: ccedil,
    Ccirc: Ccirc,
    ccirc: ccirc,
    Cconint: Cconint,
    ccups: ccups,
    ccupssm: ccupssm,
    Cdot: Cdot,
    cdot: cdot,
    cedil: cedil,
    Cedilla: Cedilla,
    cemptyv: cemptyv,
    cent: cent,
    CenterDot: CenterDot,
    centerdot: centerdot,
    Cfr: Cfr,
    cfr: cfr,
    CHcy: CHcy,
    chcy: chcy,
    check: check,
    checkmark: checkmark,
    Chi: Chi,
    chi: chi,
    cir: cir,
    circ: circ,
    circeq: circeq,
    circlearrowleft: circlearrowleft,
    circlearrowright: circlearrowright,
    circledast: circledast,
    circledcirc: circledcirc,
    circleddash: circleddash,
    CircleDot: CircleDot,
    circledR: circledR,
    circledS: circledS,
    CircleMinus: CircleMinus,
    CirclePlus: CirclePlus,
    CircleTimes: CircleTimes,
    cirE: cirE,
    cire: cire,
    cirfnint: cirfnint,
    cirmid: cirmid,
    cirscir: cirscir,
    ClockwiseContourIntegral: ClockwiseContourIntegral,
    CloseCurlyDoubleQuote: CloseCurlyDoubleQuote,
    CloseCurlyQuote: CloseCurlyQuote,
    clubs: clubs,
    clubsuit: clubsuit,
    Colon: Colon,
    colon: colon,
    Colone: Colone,
    colone: colone,
    coloneq: coloneq,
    comma: comma,
    commat: commat,
    comp: comp,
    compfn: compfn,
    complement: complement,
    complexes: complexes,
    cong: cong,
    congdot: congdot,
    Congruent: Congruent,
    Conint: Conint,
    conint: conint,
    ContourIntegral: ContourIntegral,
    Copf: Copf,
    copf: copf,
    coprod: coprod,
    Coproduct: Coproduct,
    COPY: COPY,
    copy: copy,
    copysr: copysr,
    CounterClockwiseContourIntegral: CounterClockwiseContourIntegral,
    crarr: crarr,
    Cross: Cross,
    cross: cross,
    Cscr: Cscr,
    cscr: cscr,
    csub: csub,
    csube: csube,
    csup: csup,
    csupe: csupe,
    ctdot: ctdot,
    cudarrl: cudarrl,
    cudarrr: cudarrr,
    cuepr: cuepr,
    cuesc: cuesc,
    cularr: cularr,
    cularrp: cularrp,
    Cup: Cup,
    cup: cup,
    cupbrcap: cupbrcap,
    CupCap: CupCap,
    cupcap: cupcap,
    cupcup: cupcup,
    cupdot: cupdot,
    cupor: cupor,
    cups: cups,
    curarr: curarr,
    curarrm: curarrm,
    curlyeqprec: curlyeqprec,
    curlyeqsucc: curlyeqsucc,
    curlyvee: curlyvee,
    curlywedge: curlywedge,
    curren: curren,
    curvearrowleft: curvearrowleft,
    curvearrowright: curvearrowright,
    cuvee: cuvee,
    cuwed: cuwed,
    cwconint: cwconint,
    cwint: cwint,
    cylcty: cylcty,
    Dagger: Dagger,
    dagger: dagger,
    daleth: daleth,
    Darr: Darr,
    dArr: dArr,
    darr: darr,
    dash: dash,
    Dashv: Dashv,
    dashv: dashv,
    dbkarow: dbkarow,
    dblac: dblac,
    Dcaron: Dcaron,
    dcaron: dcaron,
    Dcy: Dcy,
    dcy: dcy,
    DD: DD,
    dd: dd,
    ddagger: ddagger,
    ddarr: ddarr,
    DDotrahd: DDotrahd,
    ddotseq: ddotseq,
    deg: deg,
    Del: Del,
    Delta: Delta,
    delta: delta,
    demptyv: demptyv,
    dfisht: dfisht,
    Dfr: Dfr,
    dfr: dfr,
    dHar: dHar,
    dharl: dharl,
    dharr: dharr,
    DiacriticalAcute: DiacriticalAcute,
    DiacriticalDot: DiacriticalDot,
    DiacriticalDoubleAcute: DiacriticalDoubleAcute,
    DiacriticalGrave: DiacriticalGrave,
    DiacriticalTilde: DiacriticalTilde,
    diam: diam,
    Diamond: Diamond,
    diamond: diamond,
    diamondsuit: diamondsuit,
    diams: diams,
    die: die,
    DifferentialD: DifferentialD,
    digamma: digamma,
    disin: disin,
    div: div,
    divide: divide,
    divideontimes: divideontimes,
    divonx: divonx,
    DJcy: DJcy,
    djcy: djcy,
    dlcorn: dlcorn,
    dlcrop: dlcrop,
    dollar: dollar,
    Dopf: Dopf,
    dopf: dopf,
    Dot: Dot,
    dot: dot,
    DotDot: DotDot,
    doteq: doteq,
    doteqdot: doteqdot,
    DotEqual: DotEqual,
    dotminus: dotminus,
    dotplus: dotplus,
    dotsquare: dotsquare,
    doublebarwedge: doublebarwedge,
    DoubleContourIntegral: DoubleContourIntegral,
    DoubleDot: DoubleDot,
    DoubleDownArrow: DoubleDownArrow,
    DoubleLeftArrow: DoubleLeftArrow,
    DoubleLeftRightArrow: DoubleLeftRightArrow,
    DoubleLeftTee: DoubleLeftTee,
    DoubleLongLeftArrow: DoubleLongLeftArrow,
    DoubleLongLeftRightArrow: DoubleLongLeftRightArrow,
    DoubleLongRightArrow: DoubleLongRightArrow,
    DoubleRightArrow: DoubleRightArrow,
    DoubleRightTee: DoubleRightTee,
    DoubleUpArrow: DoubleUpArrow,
    DoubleUpDownArrow: DoubleUpDownArrow,
    DoubleVerticalBar: DoubleVerticalBar,
    DownArrow: DownArrow,
    Downarrow: Downarrow,
    downarrow: downarrow,
    DownArrowBar: DownArrowBar,
    DownArrowUpArrow: DownArrowUpArrow,
    DownBreve: DownBreve,
    downdownarrows: downdownarrows,
    downharpoonleft: downharpoonleft,
    downharpoonright: downharpoonright,
    DownLeftRightVector: DownLeftRightVector,
    DownLeftTeeVector: DownLeftTeeVector,
    DownLeftVector: DownLeftVector,
    DownLeftVectorBar: DownLeftVectorBar,
    DownRightTeeVector: DownRightTeeVector,
    DownRightVector: DownRightVector,
    DownRightVectorBar: DownRightVectorBar,
    DownTee: DownTee,
    DownTeeArrow: DownTeeArrow,
    drbkarow: drbkarow,
    drcorn: drcorn,
    drcrop: drcrop,
    Dscr: Dscr,
    dscr: dscr,
    DScy: DScy,
    dscy: dscy,
    dsol: dsol,
    Dstrok: Dstrok,
    dstrok: dstrok,
    dtdot: dtdot,
    dtri: dtri,
    dtrif: dtrif,
    duarr: duarr,
    duhar: duhar,
    dwangle: dwangle,
    DZcy: DZcy,
    dzcy: dzcy,
    dzigrarr: dzigrarr,
    Eacute: Eacute,
    eacute: eacute,
    easter: easter,
    Ecaron: Ecaron,
    ecaron: ecaron,
    ecir: ecir,
    Ecirc: Ecirc,
    ecirc: ecirc,
    ecolon: ecolon,
    Ecy: Ecy,
    ecy: ecy,
    eDDot: eDDot,
    Edot: Edot,
    eDot: eDot,
    edot: edot,
    ee: ee,
    efDot: efDot,
    Efr: Efr,
    efr: efr,
    eg: eg,
    Egrave: Egrave,
    egrave: egrave,
    egs: egs,
    egsdot: egsdot,
    el: el,
    Element: Element,
    elinters: elinters,
    ell: ell,
    els: els,
    elsdot: elsdot,
    Emacr: Emacr,
    emacr: emacr,
    empty: empty,
    emptyset: emptyset,
    EmptySmallSquare: EmptySmallSquare,
    emptyv: emptyv,
    EmptyVerySmallSquare: EmptyVerySmallSquare,
    emsp: emsp,
    emsp13: emsp13,
    emsp14: emsp14,
    ENG: ENG,
    eng: eng,
    ensp: ensp,
    Eogon: Eogon,
    eogon: eogon,
    Eopf: Eopf,
    eopf: eopf,
    epar: epar,
    eparsl: eparsl,
    eplus: eplus,
    epsi: epsi,
    Epsilon: Epsilon,
    epsilon: epsilon,
    epsiv: epsiv,
    eqcirc: eqcirc,
    eqcolon: eqcolon,
    eqsim: eqsim,
    eqslantgtr: eqslantgtr,
    eqslantless: eqslantless,
    Equal: Equal,
    equals: equals,
    EqualTilde: EqualTilde,
    equest: equest,
    Equilibrium: Equilibrium,
    equiv: equiv,
    equivDD: equivDD,
    eqvparsl: eqvparsl,
    erarr: erarr,
    erDot: erDot,
    Escr: Escr,
    escr: escr,
    esdot: esdot,
    Esim: Esim,
    esim: esim,
    Eta: Eta,
    eta: eta,
    ETH: ETH,
    eth: eth,
    Euml: Euml,
    euml: euml,
    euro: euro,
    excl: excl,
    exist: exist,
    Exists: Exists,
    expectation: expectation,
    ExponentialE: ExponentialE,
    exponentiale: exponentiale,
    fallingdotseq: fallingdotseq,
    Fcy: Fcy,
    fcy: fcy,
    female: female,
    ffilig: ffilig,
    fflig: fflig,
    ffllig: ffllig,
    Ffr: Ffr,
    ffr: ffr,
    filig: filig,
    FilledSmallSquare: FilledSmallSquare,
    FilledVerySmallSquare: FilledVerySmallSquare,
    fjlig: fjlig,
    flat: flat,
    fllig: fllig,
    fltns: fltns,
    fnof: fnof,
    Fopf: Fopf,
    fopf: fopf,
    ForAll: ForAll,
    forall: forall,
    fork: fork,
    forkv: forkv,
    Fouriertrf: Fouriertrf,
    fpartint: fpartint,
    frac12: frac12,
    frac13: frac13,
    frac14: frac14,
    frac15: frac15,
    frac16: frac16,
    frac18: frac18,
    frac23: frac23,
    frac25: frac25,
    frac34: frac34,
    frac35: frac35,
    frac38: frac38,
    frac45: frac45,
    frac56: frac56,
    frac58: frac58,
    frac78: frac78,
    frasl: frasl,
    frown: frown,
    Fscr: Fscr,
    fscr: fscr,
    gacute: gacute,
    Gamma: Gamma,
    gamma: gamma,
    Gammad: Gammad,
    gammad: gammad,
    gap: gap,
    Gbreve: Gbreve,
    gbreve: gbreve,
    Gcedil: Gcedil,
    Gcirc: Gcirc,
    gcirc: gcirc,
    Gcy: Gcy,
    gcy: gcy,
    Gdot: Gdot,
    gdot: gdot,
    gE: gE,
    ge: ge,
    gEl: gEl,
    gel: gel,
    geq: geq,
    geqq: geqq,
    geqslant: geqslant,
    ges: ges,
    gescc: gescc,
    gesdot: gesdot,
    gesdoto: gesdoto,
    gesdotol: gesdotol,
    gesl: gesl,
    gesles: gesles,
    Gfr: Gfr,
    gfr: gfr,
    Gg: Gg,
    gg: gg,
    ggg: ggg,
    gimel: gimel,
    GJcy: GJcy,
    gjcy: gjcy,
    gl: gl,
    gla: gla,
    glE: glE,
    glj: glj,
    gnap: gnap,
    gnapprox: gnapprox,
    gnE: gnE,
    gne: gne,
    gneq: gneq,
    gneqq: gneqq,
    gnsim: gnsim,
    Gopf: Gopf,
    gopf: gopf,
    grave: grave,
    GreaterEqual: GreaterEqual,
    GreaterEqualLess: GreaterEqualLess,
    GreaterFullEqual: GreaterFullEqual,
    GreaterGreater: GreaterGreater,
    GreaterLess: GreaterLess,
    GreaterSlantEqual: GreaterSlantEqual,
    GreaterTilde: GreaterTilde,
    Gscr: Gscr,
    gscr: gscr,
    gsim: gsim,
    gsime: gsime,
    gsiml: gsiml,
    GT: GT,
    Gt: Gt,
    gt: gt,
    gtcc: gtcc,
    gtcir: gtcir,
    gtdot: gtdot,
    gtlPar: gtlPar,
    gtquest: gtquest,
    gtrapprox: gtrapprox,
    gtrarr: gtrarr,
    gtrdot: gtrdot,
    gtreqless: gtreqless,
    gtreqqless: gtreqqless,
    gtrless: gtrless,
    gtrsim: gtrsim,
    gvertneqq: gvertneqq,
    gvnE: gvnE,
    Hacek: Hacek,
    hairsp: hairsp,
    half: half,
    hamilt: hamilt,
    HARDcy: HARDcy,
    hardcy: hardcy,
    hArr: hArr,
    harr: harr,
    harrcir: harrcir,
    harrw: harrw,
    Hat: Hat,
    hbar: hbar,
    Hcirc: Hcirc,
    hcirc: hcirc,
    hearts: hearts,
    heartsuit: heartsuit,
    hellip: hellip,
    hercon: hercon,
    Hfr: Hfr,
    hfr: hfr,
    HilbertSpace: HilbertSpace,
    hksearow: hksearow,
    hkswarow: hkswarow,
    hoarr: hoarr,
    homtht: homtht,
    hookleftarrow: hookleftarrow,
    hookrightarrow: hookrightarrow,
    Hopf: Hopf,
    hopf: hopf,
    horbar: horbar,
    HorizontalLine: HorizontalLine,
    Hscr: Hscr,
    hscr: hscr,
    hslash: hslash,
    Hstrok: Hstrok,
    hstrok: hstrok,
    HumpDownHump: HumpDownHump,
    HumpEqual: HumpEqual,
    hybull: hybull,
    hyphen: hyphen,
    Iacute: Iacute,
    iacute: iacute,
    ic: ic,
    Icirc: Icirc,
    icirc: icirc,
    Icy: Icy,
    icy: icy,
    Idot: Idot,
    IEcy: IEcy,
    iecy: iecy,
    iexcl: iexcl,
    iff: iff,
    Ifr: Ifr,
    ifr: ifr,
    Igrave: Igrave,
    igrave: igrave,
    ii: ii,
    iiiint: iiiint,
    iiint: iiint,
    iinfin: iinfin,
    iiota: iiota,
    IJlig: IJlig,
    ijlig: ijlig,
    Im: Im,
    Imacr: Imacr,
    imacr: imacr,
    image: image,
    ImaginaryI: ImaginaryI,
    imagline: imagline,
    imagpart: imagpart,
    imath: imath,
    imof: imof,
    imped: imped,
    Implies: Implies,
    "in": "∈",
    incare: incare,
    infin: infin,
    infintie: infintie,
    inodot: inodot,
    Int: Int,
    int: int,
    intcal: intcal,
    integers: integers,
    Integral: Integral,
    intercal: intercal,
    Intersection: Intersection,
    intlarhk: intlarhk,
    intprod: intprod,
    InvisibleComma: InvisibleComma,
    InvisibleTimes: InvisibleTimes,
    IOcy: IOcy,
    iocy: iocy,
    Iogon: Iogon,
    iogon: iogon,
    Iopf: Iopf,
    iopf: iopf,
    Iota: Iota,
    iota: iota,
    iprod: iprod,
    iquest: iquest,
    Iscr: Iscr,
    iscr: iscr,
    isin: isin,
    isindot: isindot,
    isinE: isinE,
    isins: isins,
    isinsv: isinsv,
    isinv: isinv,
    it: it,
    Itilde: Itilde,
    itilde: itilde,
    Iukcy: Iukcy,
    iukcy: iukcy,
    Iuml: Iuml,
    iuml: iuml,
    Jcirc: Jcirc,
    jcirc: jcirc,
    Jcy: Jcy,
    jcy: jcy,
    Jfr: Jfr,
    jfr: jfr,
    jmath: jmath,
    Jopf: Jopf,
    jopf: jopf,
    Jscr: Jscr,
    jscr: jscr,
    Jsercy: Jsercy,
    jsercy: jsercy,
    Jukcy: Jukcy,
    jukcy: jukcy,
    Kappa: Kappa,
    kappa: kappa,
    kappav: kappav,
    Kcedil: Kcedil,
    kcedil: kcedil,
    Kcy: Kcy,
    kcy: kcy,
    Kfr: Kfr,
    kfr: kfr,
    kgreen: kgreen,
    KHcy: KHcy,
    khcy: khcy,
    KJcy: KJcy,
    kjcy: kjcy,
    Kopf: Kopf,
    kopf: kopf,
    Kscr: Kscr,
    kscr: kscr,
    lAarr: lAarr,
    Lacute: Lacute,
    lacute: lacute,
    laemptyv: laemptyv,
    lagran: lagran,
    Lambda: Lambda,
    lambda: lambda,
    Lang: Lang,
    lang: lang,
    langd: langd,
    langle: langle,
    lap: lap,
    Laplacetrf: Laplacetrf,
    laquo: laquo,
    Larr: Larr,
    lArr: lArr,
    larr: larr,
    larrb: larrb,
    larrbfs: larrbfs,
    larrfs: larrfs,
    larrhk: larrhk,
    larrlp: larrlp,
    larrpl: larrpl,
    larrsim: larrsim,
    larrtl: larrtl,
    lat: lat,
    lAtail: lAtail,
    latail: latail,
    late: late,
    lates: lates,
    lBarr: lBarr,
    lbarr: lbarr,
    lbbrk: lbbrk,
    lbrace: lbrace,
    lbrack: lbrack,
    lbrke: lbrke,
    lbrksld: lbrksld,
    lbrkslu: lbrkslu,
    Lcaron: Lcaron,
    lcaron: lcaron,
    Lcedil: Lcedil,
    lcedil: lcedil,
    lceil: lceil,
    lcub: lcub,
    Lcy: Lcy,
    lcy: lcy,
    ldca: ldca,
    ldquo: ldquo,
    ldquor: ldquor,
    ldrdhar: ldrdhar,
    ldrushar: ldrushar,
    ldsh: ldsh,
    lE: lE,
    le: le,
    LeftAngleBracket: LeftAngleBracket,
    LeftArrow: LeftArrow,
    Leftarrow: Leftarrow,
    leftarrow: leftarrow,
    LeftArrowBar: LeftArrowBar,
    LeftArrowRightArrow: LeftArrowRightArrow,
    leftarrowtail: leftarrowtail,
    LeftCeiling: LeftCeiling,
    LeftDoubleBracket: LeftDoubleBracket,
    LeftDownTeeVector: LeftDownTeeVector,
    LeftDownVector: LeftDownVector,
    LeftDownVectorBar: LeftDownVectorBar,
    LeftFloor: LeftFloor,
    leftharpoondown: leftharpoondown,
    leftharpoonup: leftharpoonup,
    leftleftarrows: leftleftarrows,
    LeftRightArrow: LeftRightArrow,
    Leftrightarrow: Leftrightarrow,
    leftrightarrow: leftrightarrow,
    leftrightarrows: leftrightarrows,
    leftrightharpoons: leftrightharpoons,
    leftrightsquigarrow: leftrightsquigarrow,
    LeftRightVector: LeftRightVector,
    LeftTee: LeftTee,
    LeftTeeArrow: LeftTeeArrow,
    LeftTeeVector: LeftTeeVector,
    leftthreetimes: leftthreetimes,
    LeftTriangle: LeftTriangle,
    LeftTriangleBar: LeftTriangleBar,
    LeftTriangleEqual: LeftTriangleEqual,
    LeftUpDownVector: LeftUpDownVector,
    LeftUpTeeVector: LeftUpTeeVector,
    LeftUpVector: LeftUpVector,
    LeftUpVectorBar: LeftUpVectorBar,
    LeftVector: LeftVector,
    LeftVectorBar: LeftVectorBar,
    lEg: lEg,
    leg: leg,
    leq: leq,
    leqq: leqq,
    leqslant: leqslant,
    les: les,
    lescc: lescc,
    lesdot: lesdot,
    lesdoto: lesdoto,
    lesdotor: lesdotor,
    lesg: lesg,
    lesges: lesges,
    lessapprox: lessapprox,
    lessdot: lessdot,
    lesseqgtr: lesseqgtr,
    lesseqqgtr: lesseqqgtr,
    LessEqualGreater: LessEqualGreater,
    LessFullEqual: LessFullEqual,
    LessGreater: LessGreater,
    lessgtr: lessgtr,
    LessLess: LessLess,
    lesssim: lesssim,
    LessSlantEqual: LessSlantEqual,
    LessTilde: LessTilde,
    lfisht: lfisht,
    lfloor: lfloor,
    Lfr: Lfr,
    lfr: lfr,
    lg: lg,
    lgE: lgE,
    lHar: lHar,
    lhard: lhard,
    lharu: lharu,
    lharul: lharul,
    lhblk: lhblk,
    LJcy: LJcy,
    ljcy: ljcy,
    Ll: Ll,
    ll: ll,
    llarr: llarr,
    llcorner: llcorner,
    Lleftarrow: Lleftarrow,
    llhard: llhard,
    lltri: lltri,
    Lmidot: Lmidot,
    lmidot: lmidot,
    lmoust: lmoust,
    lmoustache: lmoustache,
    lnap: lnap,
    lnapprox: lnapprox,
    lnE: lnE,
    lne: lne,
    lneq: lneq,
    lneqq: lneqq,
    lnsim: lnsim,
    loang: loang,
    loarr: loarr,
    lobrk: lobrk,
    LongLeftArrow: LongLeftArrow,
    Longleftarrow: Longleftarrow,
    longleftarrow: longleftarrow,
    LongLeftRightArrow: LongLeftRightArrow,
    Longleftrightarrow: Longleftrightarrow,
    longleftrightarrow: longleftrightarrow,
    longmapsto: longmapsto,
    LongRightArrow: LongRightArrow,
    Longrightarrow: Longrightarrow,
    longrightarrow: longrightarrow,
    looparrowleft: looparrowleft,
    looparrowright: looparrowright,
    lopar: lopar,
    Lopf: Lopf,
    lopf: lopf,
    loplus: loplus,
    lotimes: lotimes,
    lowast: lowast,
    lowbar: lowbar,
    LowerLeftArrow: LowerLeftArrow,
    LowerRightArrow: LowerRightArrow,
    loz: loz,
    lozenge: lozenge,
    lozf: lozf,
    lpar: lpar,
    lparlt: lparlt,
    lrarr: lrarr,
    lrcorner: lrcorner,
    lrhar: lrhar,
    lrhard: lrhard,
    lrm: lrm,
    lrtri: lrtri,
    lsaquo: lsaquo,
    Lscr: Lscr,
    lscr: lscr,
    Lsh: Lsh,
    lsh: lsh,
    lsim: lsim,
    lsime: lsime,
    lsimg: lsimg,
    lsqb: lsqb,
    lsquo: lsquo,
    lsquor: lsquor,
    Lstrok: Lstrok,
    lstrok: lstrok,
    LT: LT,
    Lt: Lt,
    lt: lt,
    ltcc: ltcc,
    ltcir: ltcir,
    ltdot: ltdot,
    lthree: lthree,
    ltimes: ltimes,
    ltlarr: ltlarr,
    ltquest: ltquest,
    ltri: ltri,
    ltrie: ltrie,
    ltrif: ltrif,
    ltrPar: ltrPar,
    lurdshar: lurdshar,
    luruhar: luruhar,
    lvertneqq: lvertneqq,
    lvnE: lvnE,
    macr: macr,
    male: male,
    malt: malt,
    maltese: maltese,
    "Map": "⤅",
    map: map,
    mapsto: mapsto,
    mapstodown: mapstodown,
    mapstoleft: mapstoleft,
    mapstoup: mapstoup,
    marker: marker,
    mcomma: mcomma,
    Mcy: Mcy,
    mcy: mcy,
    mdash: mdash,
    mDDot: mDDot,
    measuredangle: measuredangle,
    MediumSpace: MediumSpace,
    Mellintrf: Mellintrf,
    Mfr: Mfr,
    mfr: mfr,
    mho: mho,
    micro: micro,
    mid: mid,
    midast: midast,
    midcir: midcir,
    middot: middot,
    minus: minus,
    minusb: minusb,
    minusd: minusd,
    minusdu: minusdu,
    MinusPlus: MinusPlus,
    mlcp: mlcp,
    mldr: mldr,
    mnplus: mnplus,
    models: models,
    Mopf: Mopf,
    mopf: mopf,
    mp: mp,
    Mscr: Mscr,
    mscr: mscr,
    mstpos: mstpos,
    Mu: Mu,
    mu: mu,
    multimap: multimap,
    mumap: mumap,
    nabla: nabla,
    Nacute: Nacute,
    nacute: nacute,
    nang: nang,
    nap: nap,
    napE: napE,
    napid: napid,
    napos: napos,
    napprox: napprox,
    natur: natur,
    natural: natural,
    naturals: naturals,
    nbsp: nbsp,
    nbump: nbump,
    nbumpe: nbumpe,
    ncap: ncap,
    Ncaron: Ncaron,
    ncaron: ncaron,
    Ncedil: Ncedil,
    ncedil: ncedil,
    ncong: ncong,
    ncongdot: ncongdot,
    ncup: ncup,
    Ncy: Ncy,
    ncy: ncy,
    ndash: ndash,
    ne: ne,
    nearhk: nearhk,
    neArr: neArr,
    nearr: nearr,
    nearrow: nearrow,
    nedot: nedot,
    NegativeMediumSpace: NegativeMediumSpace,
    NegativeThickSpace: NegativeThickSpace,
    NegativeThinSpace: NegativeThinSpace,
    NegativeVeryThinSpace: NegativeVeryThinSpace,
    nequiv: nequiv,
    nesear: nesear,
    nesim: nesim,
    NestedGreaterGreater: NestedGreaterGreater,
    NestedLessLess: NestedLessLess,
    NewLine: NewLine,
    nexist: nexist,
    nexists: nexists,
    Nfr: Nfr,
    nfr: nfr,
    ngE: ngE,
    nge: nge,
    ngeq: ngeq,
    ngeqq: ngeqq,
    ngeqslant: ngeqslant,
    nges: nges,
    nGg: nGg,
    ngsim: ngsim,
    nGt: nGt,
    ngt: ngt,
    ngtr: ngtr,
    nGtv: nGtv,
    nhArr: nhArr,
    nharr: nharr,
    nhpar: nhpar,
    ni: ni,
    nis: nis,
    nisd: nisd,
    niv: niv,
    NJcy: NJcy,
    njcy: njcy,
    nlArr: nlArr,
    nlarr: nlarr,
    nldr: nldr,
    nlE: nlE,
    nle: nle,
    nLeftarrow: nLeftarrow,
    nleftarrow: nleftarrow,
    nLeftrightarrow: nLeftrightarrow,
    nleftrightarrow: nleftrightarrow,
    nleq: nleq,
    nleqq: nleqq,
    nleqslant: nleqslant,
    nles: nles,
    nless: nless,
    nLl: nLl,
    nlsim: nlsim,
    nLt: nLt,
    nlt: nlt,
    nltri: nltri,
    nltrie: nltrie,
    nLtv: nLtv,
    nmid: nmid,
    NoBreak: NoBreak,
    NonBreakingSpace: NonBreakingSpace,
    Nopf: Nopf,
    nopf: nopf,
    Not: Not,
    not: not,
    NotCongruent: NotCongruent,
    NotCupCap: NotCupCap,
    NotDoubleVerticalBar: NotDoubleVerticalBar,
    NotElement: NotElement,
    NotEqual: NotEqual,
    NotEqualTilde: NotEqualTilde,
    NotExists: NotExists,
    NotGreater: NotGreater,
    NotGreaterEqual: NotGreaterEqual,
    NotGreaterFullEqual: NotGreaterFullEqual,
    NotGreaterGreater: NotGreaterGreater,
    NotGreaterLess: NotGreaterLess,
    NotGreaterSlantEqual: NotGreaterSlantEqual,
    NotGreaterTilde: NotGreaterTilde,
    NotHumpDownHump: NotHumpDownHump,
    NotHumpEqual: NotHumpEqual,
    notin: notin,
    notindot: notindot,
    notinE: notinE,
    notinva: notinva,
    notinvb: notinvb,
    notinvc: notinvc,
    NotLeftTriangle: NotLeftTriangle,
    NotLeftTriangleBar: NotLeftTriangleBar,
    NotLeftTriangleEqual: NotLeftTriangleEqual,
    NotLess: NotLess,
    NotLessEqual: NotLessEqual,
    NotLessGreater: NotLessGreater,
    NotLessLess: NotLessLess,
    NotLessSlantEqual: NotLessSlantEqual,
    NotLessTilde: NotLessTilde,
    NotNestedGreaterGreater: NotNestedGreaterGreater,
    NotNestedLessLess: NotNestedLessLess,
    notni: notni,
    notniva: notniva,
    notnivb: notnivb,
    notnivc: notnivc,
    NotPrecedes: NotPrecedes,
    NotPrecedesEqual: NotPrecedesEqual,
    NotPrecedesSlantEqual: NotPrecedesSlantEqual,
    NotReverseElement: NotReverseElement,
    NotRightTriangle: NotRightTriangle,
    NotRightTriangleBar: NotRightTriangleBar,
    NotRightTriangleEqual: NotRightTriangleEqual,
    NotSquareSubset: NotSquareSubset,
    NotSquareSubsetEqual: NotSquareSubsetEqual,
    NotSquareSuperset: NotSquareSuperset,
    NotSquareSupersetEqual: NotSquareSupersetEqual,
    NotSubset: NotSubset,
    NotSubsetEqual: NotSubsetEqual,
    NotSucceeds: NotSucceeds,
    NotSucceedsEqual: NotSucceedsEqual,
    NotSucceedsSlantEqual: NotSucceedsSlantEqual,
    NotSucceedsTilde: NotSucceedsTilde,
    NotSuperset: NotSuperset,
    NotSupersetEqual: NotSupersetEqual,
    NotTilde: NotTilde,
    NotTildeEqual: NotTildeEqual,
    NotTildeFullEqual: NotTildeFullEqual,
    NotTildeTilde: NotTildeTilde,
    NotVerticalBar: NotVerticalBar,
    npar: npar,
    nparallel: nparallel,
    nparsl: nparsl,
    npart: npart,
    npolint: npolint,
    npr: npr,
    nprcue: nprcue,
    npre: npre,
    nprec: nprec,
    npreceq: npreceq,
    nrArr: nrArr,
    nrarr: nrarr,
    nrarrc: nrarrc,
    nrarrw: nrarrw,
    nRightarrow: nRightarrow,
    nrightarrow: nrightarrow,
    nrtri: nrtri,
    nrtrie: nrtrie,
    nsc: nsc,
    nsccue: nsccue,
    nsce: nsce,
    Nscr: Nscr,
    nscr: nscr,
    nshortmid: nshortmid,
    nshortparallel: nshortparallel,
    nsim: nsim,
    nsime: nsime,
    nsimeq: nsimeq,
    nsmid: nsmid,
    nspar: nspar,
    nsqsube: nsqsube,
    nsqsupe: nsqsupe,
    nsub: nsub,
    nsubE: nsubE,
    nsube: nsube,
    nsubset: nsubset,
    nsubseteq: nsubseteq,
    nsubseteqq: nsubseteqq,
    nsucc: nsucc,
    nsucceq: nsucceq,
    nsup: nsup,
    nsupE: nsupE,
    nsupe: nsupe,
    nsupset: nsupset,
    nsupseteq: nsupseteq,
    nsupseteqq: nsupseteqq,
    ntgl: ntgl,
    Ntilde: Ntilde,
    ntilde: ntilde,
    ntlg: ntlg,
    ntriangleleft: ntriangleleft,
    ntrianglelefteq: ntrianglelefteq,
    ntriangleright: ntriangleright,
    ntrianglerighteq: ntrianglerighteq,
    Nu: Nu,
    nu: nu,
    num: num,
    numero: numero,
    numsp: numsp,
    nvap: nvap,
    nVDash: nVDash,
    nVdash: nVdash,
    nvDash: nvDash,
    nvdash: nvdash,
    nvge: nvge,
    nvgt: nvgt,
    nvHarr: nvHarr,
    nvinfin: nvinfin,
    nvlArr: nvlArr,
    nvle: nvle,
    nvlt: nvlt,
    nvltrie: nvltrie,
    nvrArr: nvrArr,
    nvrtrie: nvrtrie,
    nvsim: nvsim,
    nwarhk: nwarhk,
    nwArr: nwArr,
    nwarr: nwarr,
    nwarrow: nwarrow,
    nwnear: nwnear,
    Oacute: Oacute,
    oacute: oacute,
    oast: oast,
    ocir: ocir,
    Ocirc: Ocirc,
    ocirc: ocirc,
    Ocy: Ocy,
    ocy: ocy,
    odash: odash,
    Odblac: Odblac,
    odblac: odblac,
    odiv: odiv,
    odot: odot,
    odsold: odsold,
    OElig: OElig,
    oelig: oelig,
    ofcir: ofcir,
    Ofr: Ofr,
    ofr: ofr,
    ogon: ogon,
    Ograve: Ograve,
    ograve: ograve,
    ogt: ogt,
    ohbar: ohbar,
    ohm: ohm,
    oint: oint,
    olarr: olarr,
    olcir: olcir,
    olcross: olcross,
    oline: oline,
    olt: olt,
    Omacr: Omacr,
    omacr: omacr,
    Omega: Omega,
    omega: omega,
    Omicron: Omicron,
    omicron: omicron,
    omid: omid,
    ominus: ominus,
    Oopf: Oopf,
    oopf: oopf,
    opar: opar,
    OpenCurlyDoubleQuote: OpenCurlyDoubleQuote,
    OpenCurlyQuote: OpenCurlyQuote,
    operp: operp,
    oplus: oplus,
    Or: Or,
    or: or,
    orarr: orarr,
    ord: ord,
    order: order,
    orderof: orderof,
    ordf: ordf,
    ordm: ordm,
    origof: origof,
    oror: oror,
    orslope: orslope,
    orv: orv,
    oS: oS,
    Oscr: Oscr,
    oscr: oscr,
    Oslash: Oslash,
    oslash: oslash,
    osol: osol,
    Otilde: Otilde,
    otilde: otilde,
    Otimes: Otimes,
    otimes: otimes,
    otimesas: otimesas,
    Ouml: Ouml,
    ouml: ouml,
    ovbar: ovbar,
    OverBar: OverBar,
    OverBrace: OverBrace,
    OverBracket: OverBracket,
    OverParenthesis: OverParenthesis,
    par: par,
    para: para,
    parallel: parallel,
    parsim: parsim,
    parsl: parsl,
    part: part,
    PartialD: PartialD,
    Pcy: Pcy,
    pcy: pcy,
    percnt: percnt,
    period: period,
    permil: permil,
    perp: perp,
    pertenk: pertenk,
    Pfr: Pfr,
    pfr: pfr,
    Phi: Phi,
    phi: phi,
    phiv: phiv,
    phmmat: phmmat,
    phone: phone,
    Pi: Pi,
    pi: pi,
    pitchfork: pitchfork,
    piv: piv,
    planck: planck,
    planckh: planckh,
    plankv: plankv,
    plus: plus,
    plusacir: plusacir,
    plusb: plusb,
    pluscir: pluscir,
    plusdo: plusdo,
    plusdu: plusdu,
    pluse: pluse,
    PlusMinus: PlusMinus,
    plusmn: plusmn,
    plussim: plussim,
    plustwo: plustwo,
    pm: pm,
    Poincareplane: Poincareplane,
    pointint: pointint,
    Popf: Popf,
    popf: popf,
    pound: pound,
    Pr: Pr,
    pr: pr,
    prap: prap,
    prcue: prcue,
    prE: prE,
    pre: pre,
    prec: prec,
    precapprox: precapprox,
    preccurlyeq: preccurlyeq,
    Precedes: Precedes,
    PrecedesEqual: PrecedesEqual,
    PrecedesSlantEqual: PrecedesSlantEqual,
    PrecedesTilde: PrecedesTilde,
    preceq: preceq,
    precnapprox: precnapprox,
    precneqq: precneqq,
    precnsim: precnsim,
    precsim: precsim,
    Prime: Prime,
    prime: prime,
    primes: primes,
    prnap: prnap,
    prnE: prnE,
    prnsim: prnsim,
    prod: prod,
    Product: Product,
    profalar: profalar,
    profline: profline,
    profsurf: profsurf,
    prop: prop,
    Proportion: Proportion,
    Proportional: Proportional,
    propto: propto,
    prsim: prsim,
    prurel: prurel,
    Pscr: Pscr,
    pscr: pscr,
    Psi: Psi,
    psi: psi,
    puncsp: puncsp,
    Qfr: Qfr,
    qfr: qfr,
    qint: qint,
    Qopf: Qopf,
    qopf: qopf,
    qprime: qprime,
    Qscr: Qscr,
    qscr: qscr,
    quaternions: quaternions,
    quatint: quatint,
    quest: quest,
    questeq: questeq,
    QUOT: QUOT,
    quot: quot,
    rAarr: rAarr,
    race: race,
    Racute: Racute,
    racute: racute,
    radic: radic,
    raemptyv: raemptyv,
    Rang: Rang,
    rang: rang,
    rangd: rangd,
    range: range,
    rangle: rangle,
    raquo: raquo,
    Rarr: Rarr,
    rArr: rArr,
    rarr: rarr,
    rarrap: rarrap,
    rarrb: rarrb,
    rarrbfs: rarrbfs,
    rarrc: rarrc,
    rarrfs: rarrfs,
    rarrhk: rarrhk,
    rarrlp: rarrlp,
    rarrpl: rarrpl,
    rarrsim: rarrsim,
    Rarrtl: Rarrtl,
    rarrtl: rarrtl,
    rarrw: rarrw,
    rAtail: rAtail,
    ratail: ratail,
    ratio: ratio,
    rationals: rationals,
    RBarr: RBarr,
    rBarr: rBarr,
    rbarr: rbarr,
    rbbrk: rbbrk,
    rbrace: rbrace,
    rbrack: rbrack,
    rbrke: rbrke,
    rbrksld: rbrksld,
    rbrkslu: rbrkslu,
    Rcaron: Rcaron,
    rcaron: rcaron,
    Rcedil: Rcedil,
    rcedil: rcedil,
    rceil: rceil,
    rcub: rcub,
    Rcy: Rcy,
    rcy: rcy,
    rdca: rdca,
    rdldhar: rdldhar,
    rdquo: rdquo,
    rdquor: rdquor,
    rdsh: rdsh,
    Re: Re,
    real: real,
    realine: realine,
    realpart: realpart,
    reals: reals,
    rect: rect,
    REG: REG,
    reg: reg,
    ReverseElement: ReverseElement,
    ReverseEquilibrium: ReverseEquilibrium,
    ReverseUpEquilibrium: ReverseUpEquilibrium,
    rfisht: rfisht,
    rfloor: rfloor,
    Rfr: Rfr,
    rfr: rfr,
    rHar: rHar,
    rhard: rhard,
    rharu: rharu,
    rharul: rharul,
    Rho: Rho,
    rho: rho,
    rhov: rhov,
    RightAngleBracket: RightAngleBracket,
    RightArrow: RightArrow,
    Rightarrow: Rightarrow,
    rightarrow: rightarrow,
    RightArrowBar: RightArrowBar,
    RightArrowLeftArrow: RightArrowLeftArrow,
    rightarrowtail: rightarrowtail,
    RightCeiling: RightCeiling,
    RightDoubleBracket: RightDoubleBracket,
    RightDownTeeVector: RightDownTeeVector,
    RightDownVector: RightDownVector,
    RightDownVectorBar: RightDownVectorBar,
    RightFloor: RightFloor,
    rightharpoondown: rightharpoondown,
    rightharpoonup: rightharpoonup,
    rightleftarrows: rightleftarrows,
    rightleftharpoons: rightleftharpoons,
    rightrightarrows: rightrightarrows,
    rightsquigarrow: rightsquigarrow,
    RightTee: RightTee,
    RightTeeArrow: RightTeeArrow,
    RightTeeVector: RightTeeVector,
    rightthreetimes: rightthreetimes,
    RightTriangle: RightTriangle,
    RightTriangleBar: RightTriangleBar,
    RightTriangleEqual: RightTriangleEqual,
    RightUpDownVector: RightUpDownVector,
    RightUpTeeVector: RightUpTeeVector,
    RightUpVector: RightUpVector,
    RightUpVectorBar: RightUpVectorBar,
    RightVector: RightVector,
    RightVectorBar: RightVectorBar,
    ring: ring,
    risingdotseq: risingdotseq,
    rlarr: rlarr,
    rlhar: rlhar,
    rlm: rlm,
    rmoust: rmoust,
    rmoustache: rmoustache,
    rnmid: rnmid,
    roang: roang,
    roarr: roarr,
    robrk: robrk,
    ropar: ropar,
    Ropf: Ropf,
    ropf: ropf,
    roplus: roplus,
    rotimes: rotimes,
    RoundImplies: RoundImplies,
    rpar: rpar,
    rpargt: rpargt,
    rppolint: rppolint,
    rrarr: rrarr,
    Rrightarrow: Rrightarrow,
    rsaquo: rsaquo,
    Rscr: Rscr,
    rscr: rscr,
    Rsh: Rsh,
    rsh: rsh,
    rsqb: rsqb,
    rsquo: rsquo,
    rsquor: rsquor,
    rthree: rthree,
    rtimes: rtimes,
    rtri: rtri,
    rtrie: rtrie,
    rtrif: rtrif,
    rtriltri: rtriltri,
    RuleDelayed: RuleDelayed,
    ruluhar: ruluhar,
    rx: rx,
    Sacute: Sacute,
    sacute: sacute,
    sbquo: sbquo,
    Sc: Sc,
    sc: sc,
    scap: scap,
    Scaron: Scaron,
    scaron: scaron,
    sccue: sccue,
    scE: scE,
    sce: sce,
    Scedil: Scedil,
    scedil: scedil,
    Scirc: Scirc,
    scirc: scirc,
    scnap: scnap,
    scnE: scnE,
    scnsim: scnsim,
    scpolint: scpolint,
    scsim: scsim,
    Scy: Scy,
    scy: scy,
    sdot: sdot,
    sdotb: sdotb,
    sdote: sdote,
    searhk: searhk,
    seArr: seArr,
    searr: searr,
    searrow: searrow,
    sect: sect,
    semi: semi,
    seswar: seswar,
    setminus: setminus,
    setmn: setmn,
    sext: sext,
    Sfr: Sfr,
    sfr: sfr,
    sfrown: sfrown,
    sharp: sharp,
    SHCHcy: SHCHcy,
    shchcy: shchcy,
    SHcy: SHcy,
    shcy: shcy,
    ShortDownArrow: ShortDownArrow,
    ShortLeftArrow: ShortLeftArrow,
    shortmid: shortmid,
    shortparallel: shortparallel,
    ShortRightArrow: ShortRightArrow,
    ShortUpArrow: ShortUpArrow,
    shy: shy,
    Sigma: Sigma,
    sigma: sigma,
    sigmaf: sigmaf,
    sigmav: sigmav,
    sim: sim,
    simdot: simdot,
    sime: sime,
    simeq: simeq,
    simg: simg,
    simgE: simgE,
    siml: siml,
    simlE: simlE,
    simne: simne,
    simplus: simplus,
    simrarr: simrarr,
    slarr: slarr,
    SmallCircle: SmallCircle,
    smallsetminus: smallsetminus,
    smashp: smashp,
    smeparsl: smeparsl,
    smid: smid,
    smile: smile,
    smt: smt,
    smte: smte,
    smtes: smtes,
    SOFTcy: SOFTcy,
    softcy: softcy,
    sol: sol,
    solb: solb,
    solbar: solbar,
    Sopf: Sopf,
    sopf: sopf,
    spades: spades,
    spadesuit: spadesuit,
    spar: spar,
    sqcap: sqcap,
    sqcaps: sqcaps,
    sqcup: sqcup,
    sqcups: sqcups,
    Sqrt: Sqrt,
    sqsub: sqsub,
    sqsube: sqsube,
    sqsubset: sqsubset,
    sqsubseteq: sqsubseteq,
    sqsup: sqsup,
    sqsupe: sqsupe,
    sqsupset: sqsupset,
    sqsupseteq: sqsupseteq,
    squ: squ,
    Square: Square,
    square: square,
    SquareIntersection: SquareIntersection,
    SquareSubset: SquareSubset,
    SquareSubsetEqual: SquareSubsetEqual,
    SquareSuperset: SquareSuperset,
    SquareSupersetEqual: SquareSupersetEqual,
    SquareUnion: SquareUnion,
    squarf: squarf,
    squf: squf,
    srarr: srarr,
    Sscr: Sscr,
    sscr: sscr,
    ssetmn: ssetmn,
    ssmile: ssmile,
    sstarf: sstarf,
    Star: Star,
    star: star,
    starf: starf,
    straightepsilon: straightepsilon,
    straightphi: straightphi,
    strns: strns,
    Sub: Sub,
    sub: sub,
    subdot: subdot,
    subE: subE,
    sube: sube,
    subedot: subedot,
    submult: submult,
    subnE: subnE,
    subne: subne,
    subplus: subplus,
    subrarr: subrarr,
    Subset: Subset,
    subset: subset,
    subseteq: subseteq,
    subseteqq: subseteqq,
    SubsetEqual: SubsetEqual,
    subsetneq: subsetneq,
    subsetneqq: subsetneqq,
    subsim: subsim,
    subsub: subsub,
    subsup: subsup,
    succ: succ,
    succapprox: succapprox,
    succcurlyeq: succcurlyeq,
    Succeeds: Succeeds,
    SucceedsEqual: SucceedsEqual,
    SucceedsSlantEqual: SucceedsSlantEqual,
    SucceedsTilde: SucceedsTilde,
    succeq: succeq,
    succnapprox: succnapprox,
    succneqq: succneqq,
    succnsim: succnsim,
    succsim: succsim,
    SuchThat: SuchThat,
    Sum: Sum,
    sum: sum,
    sung: sung,
    Sup: Sup,
    sup: sup,
    sup1: sup1,
    sup2: sup2,
    sup3: sup3,
    supdot: supdot,
    supdsub: supdsub,
    supE: supE,
    supe: supe,
    supedot: supedot,
    Superset: Superset,
    SupersetEqual: SupersetEqual,
    suphsol: suphsol,
    suphsub: suphsub,
    suplarr: suplarr,
    supmult: supmult,
    supnE: supnE,
    supne: supne,
    supplus: supplus,
    Supset: Supset,
    supset: supset,
    supseteq: supseteq,
    supseteqq: supseteqq,
    supsetneq: supsetneq,
    supsetneqq: supsetneqq,
    supsim: supsim,
    supsub: supsub,
    supsup: supsup,
    swarhk: swarhk,
    swArr: swArr,
    swarr: swarr,
    swarrow: swarrow,
    swnwar: swnwar,
    szlig: szlig,
    Tab: Tab,
    target: target,
    Tau: Tau,
    tau: tau,
    tbrk: tbrk,
    Tcaron: Tcaron,
    tcaron: tcaron,
    Tcedil: Tcedil,
    tcedil: tcedil,
    Tcy: Tcy,
    tcy: tcy,
    tdot: tdot,
    telrec: telrec,
    Tfr: Tfr,
    tfr: tfr,
    there4: there4,
    Therefore: Therefore,
    therefore: therefore,
    Theta: Theta,
    theta: theta,
    thetasym: thetasym,
    thetav: thetav,
    thickapprox: thickapprox,
    thicksim: thicksim,
    ThickSpace: ThickSpace,
    thinsp: thinsp,
    ThinSpace: ThinSpace,
    thkap: thkap,
    thksim: thksim,
    THORN: THORN,
    thorn: thorn,
    Tilde: Tilde,
    tilde: tilde,
    TildeEqual: TildeEqual,
    TildeFullEqual: TildeFullEqual,
    TildeTilde: TildeTilde,
    times: times,
    timesb: timesb,
    timesbar: timesbar,
    timesd: timesd,
    tint: tint,
    toea: toea,
    top: top,
    topbot: topbot,
    topcir: topcir,
    Topf: Topf,
    topf: topf,
    topfork: topfork,
    tosa: tosa,
    tprime: tprime,
    TRADE: TRADE,
    trade: trade,
    triangle: triangle,
    triangledown: triangledown,
    triangleleft: triangleleft,
    trianglelefteq: trianglelefteq,
    triangleq: triangleq,
    triangleright: triangleright,
    trianglerighteq: trianglerighteq,
    tridot: tridot,
    trie: trie,
    triminus: triminus,
    TripleDot: TripleDot,
    triplus: triplus,
    trisb: trisb,
    tritime: tritime,
    trpezium: trpezium,
    Tscr: Tscr,
    tscr: tscr,
    TScy: TScy,
    tscy: tscy,
    TSHcy: TSHcy,
    tshcy: tshcy,
    Tstrok: Tstrok,
    tstrok: tstrok,
    twixt: twixt,
    twoheadleftarrow: twoheadleftarrow,
    twoheadrightarrow: twoheadrightarrow,
    Uacute: Uacute,
    uacute: uacute,
    Uarr: Uarr,
    uArr: uArr,
    uarr: uarr,
    Uarrocir: Uarrocir,
    Ubrcy: Ubrcy,
    ubrcy: ubrcy,
    Ubreve: Ubreve,
    ubreve: ubreve,
    Ucirc: Ucirc,
    ucirc: ucirc,
    Ucy: Ucy,
    ucy: ucy,
    udarr: udarr,
    Udblac: Udblac,
    udblac: udblac,
    udhar: udhar,
    ufisht: ufisht,
    Ufr: Ufr,
    ufr: ufr,
    Ugrave: Ugrave,
    ugrave: ugrave,
    uHar: uHar,
    uharl: uharl,
    uharr: uharr,
    uhblk: uhblk,
    ulcorn: ulcorn,
    ulcorner: ulcorner,
    ulcrop: ulcrop,
    ultri: ultri,
    Umacr: Umacr,
    umacr: umacr,
    uml: uml,
    UnderBar: UnderBar,
    UnderBrace: UnderBrace,
    UnderBracket: UnderBracket,
    UnderParenthesis: UnderParenthesis,
    Union: Union,
    UnionPlus: UnionPlus,
    Uogon: Uogon,
    uogon: uogon,
    Uopf: Uopf,
    uopf: uopf,
    UpArrow: UpArrow,
    Uparrow: Uparrow,
    uparrow: uparrow,
    UpArrowBar: UpArrowBar,
    UpArrowDownArrow: UpArrowDownArrow,
    UpDownArrow: UpDownArrow,
    Updownarrow: Updownarrow,
    updownarrow: updownarrow,
    UpEquilibrium: UpEquilibrium,
    upharpoonleft: upharpoonleft,
    upharpoonright: upharpoonright,
    uplus: uplus,
    UpperLeftArrow: UpperLeftArrow,
    UpperRightArrow: UpperRightArrow,
    Upsi: Upsi,
    upsi: upsi,
    upsih: upsih,
    Upsilon: Upsilon,
    upsilon: upsilon,
    UpTee: UpTee,
    UpTeeArrow: UpTeeArrow,
    upuparrows: upuparrows,
    urcorn: urcorn,
    urcorner: urcorner,
    urcrop: urcrop,
    Uring: Uring,
    uring: uring,
    urtri: urtri,
    Uscr: Uscr,
    uscr: uscr,
    utdot: utdot,
    Utilde: Utilde,
    utilde: utilde,
    utri: utri,
    utrif: utrif,
    uuarr: uuarr,
    Uuml: Uuml,
    uuml: uuml,
    uwangle: uwangle,
    vangrt: vangrt,
    varepsilon: varepsilon,
    varkappa: varkappa,
    varnothing: varnothing,
    varphi: varphi,
    varpi: varpi,
    varpropto: varpropto,
    vArr: vArr,
    varr: varr,
    varrho: varrho,
    varsigma: varsigma,
    varsubsetneq: varsubsetneq,
    varsubsetneqq: varsubsetneqq,
    varsupsetneq: varsupsetneq,
    varsupsetneqq: varsupsetneqq,
    vartheta: vartheta,
    vartriangleleft: vartriangleleft,
    vartriangleright: vartriangleright,
    Vbar: Vbar,
    vBar: vBar,
    vBarv: vBarv,
    Vcy: Vcy,
    vcy: vcy,
    VDash: VDash,
    Vdash: Vdash,
    vDash: vDash,
    vdash: vdash,
    Vdashl: Vdashl,
    Vee: Vee,
    vee: vee,
    veebar: veebar,
    veeeq: veeeq,
    vellip: vellip,
    Verbar: Verbar,
    verbar: verbar,
    Vert: Vert,
    vert: vert,
    VerticalBar: VerticalBar,
    VerticalLine: VerticalLine,
    VerticalSeparator: VerticalSeparator,
    VerticalTilde: VerticalTilde,
    VeryThinSpace: VeryThinSpace,
    Vfr: Vfr,
    vfr: vfr,
    vltri: vltri,
    vnsub: vnsub,
    vnsup: vnsup,
    Vopf: Vopf,
    vopf: vopf,
    vprop: vprop,
    vrtri: vrtri,
    Vscr: Vscr,
    vscr: vscr,
    vsubnE: vsubnE,
    vsubne: vsubne,
    vsupnE: vsupnE,
    vsupne: vsupne,
    Vvdash: Vvdash,
    vzigzag: vzigzag,
    Wcirc: Wcirc,
    wcirc: wcirc,
    wedbar: wedbar,
    Wedge: Wedge,
    wedge: wedge,
    wedgeq: wedgeq,
    weierp: weierp,
    Wfr: Wfr,
    wfr: wfr,
    Wopf: Wopf,
    wopf: wopf,
    wp: wp,
    wr: wr,
    wreath: wreath,
    Wscr: Wscr,
    wscr: wscr,
    xcap: xcap,
    xcirc: xcirc,
    xcup: xcup,
    xdtri: xdtri,
    Xfr: Xfr,
    xfr: xfr,
    xhArr: xhArr,
    xharr: xharr,
    Xi: Xi,
    xi: xi,
    xlArr: xlArr,
    xlarr: xlarr,
    xmap: xmap,
    xnis: xnis,
    xodot: xodot,
    Xopf: Xopf,
    xopf: xopf,
    xoplus: xoplus,
    xotime: xotime,
    xrArr: xrArr,
    xrarr: xrarr,
    Xscr: Xscr,
    xscr: xscr,
    xsqcup: xsqcup,
    xuplus: xuplus,
    xutri: xutri,
    xvee: xvee,
    xwedge: xwedge,
    Yacute: Yacute,
    yacute: yacute,
    YAcy: YAcy,
    yacy: yacy,
    Ycirc: Ycirc,
    ycirc: ycirc,
    Ycy: Ycy,
    ycy: ycy,
    yen: yen,
    Yfr: Yfr,
    yfr: yfr,
    YIcy: YIcy,
    yicy: yicy,
    Yopf: Yopf,
    yopf: yopf,
    Yscr: Yscr,
    yscr: yscr,
    YUcy: YUcy,
    yucy: yucy,
    Yuml: Yuml,
    yuml: yuml,
    Zacute: Zacute,
    zacute: zacute,
    Zcaron: Zcaron,
    zcaron: zcaron,
    Zcy: Zcy,
    zcy: zcy,
    Zdot: Zdot,
    zdot: zdot,
    zeetrf: zeetrf,
    ZeroWidthSpace: ZeroWidthSpace,
    Zeta: Zeta,
    zeta: zeta,
    Zfr: Zfr,
    zfr: zfr,
    ZHcy: ZHcy,
    zhcy: zhcy,
    zigrarr: zigrarr,
    Zopf: Zopf,
    zopf: zopf,
    Zscr: Zscr,
    zscr: zscr,
    zwj: zwj,
    zwnj: zwnj
  };
  var ound = "pound";
  var pond = "pound";
  var poubd = "pound";
  var poud = "pound";
  var poumd = "pound";
  var poun = "pound";
  var pund = "pound";
  var zvbj = "zwnj";
  var zvhj = "zwnj";
  var zvjb = "zwnj";
  var zvjh = "zwnj";
  var zvjm = "zwnj";
  var zvjn = "zwnj";
  var zvmj = "zwnj";
  var zvng = "zwnj";
  var zvnh = "zwnj";
  var zvnj = "zwnj";
  var zvnk = "zwnj";
  var zvnm = "zwnj";
  var zwbj = "zwnj";
  var zwhj = "zwnj";
  var zwjb = "zwnj";
  var zwjh = "zwnj";
  var zwjm = "zwnj";
  var zwjn = "zwnj";
  var zwmj = "zwnj";
  var zwng = "zwnj";
  var zwnh = "zwnj";
  var zwnk = "zwnj";
  var zwnm = "zwnj";
  var brokenNamedEntities = {
    ound: ound,
    pond: pond,
    poubd: poubd,
    poud: poud,
    poumd: poumd,
    poun: poun,
    pund: pund,
    zvbj: zvbj,
    zvhj: zvhj,
    zvjb: zvjb,
    zvjh: zvjh,
    zvjm: zvjm,
    zvjn: zvjn,
    zvmj: zvmj,
    zvng: zvng,
    zvnh: zvnh,
    zvnj: zvnj,
    zvnk: zvnk,
    zvnm: zvnm,
    zwbj: zwbj,
    zwhj: zwhj,
    zwjb: zwjb,
    zwjh: zwjh,
    zwjm: zwjm,
    zwjn: zwjn,
    zwmj: zwmj,
    zwng: zwng,
    zwnh: zwnh,
    zwnk: zwnk,
    zwnm: zwnm
  };
  var A = {
    a: ["Aacute"],
    b: ["Abreve"],
    c: ["Acirc", "Acy"],
    E: ["AElig"],
    f: ["Afr"],
    g: ["Agrave"],
    l: ["Alpha"],
    m: ["Amacr"],
    M: ["AMP"],
    n: ["And"],
    o: ["Aogon", "Aopf"],
    p: ["ApplyFunction"],
    r: ["Aring"],
    s: ["Ascr", "Assign"],
    t: ["Atilde"],
    u: ["Auml"]
  };
  var a = {
    a: ["aacute"],
    b: ["abreve"],
    c: ["ac", "acd", "acE", "acirc", "acute", "acy"],
    e: ["aelig"],
    f: ["af", "afr"],
    g: ["agrave"],
    l: ["alefsym", "aleph", "alpha"],
    m: ["amacr", "amalg", "amp"],
    n: ["and", "andand", "andd", "andslope", "andv", "ang", "ange", "angle", "angmsd", "angmsdaa", "angmsdab", "angmsdac", "angmsdad", "angmsdae", "angmsdaf", "angmsdag", "angmsdah", "angrt", "angrtvb", "angrtvbd", "angsph", "angst", "angzarr"],
    o: ["aogon", "aopf"],
    p: ["ap", "apacir", "apE", "ape", "apid", "apos", "approx", "approxeq"],
    r: ["aring"],
    s: ["ascr", "ast", "asymp", "asympeq"],
    t: ["atilde"],
    u: ["auml"],
    w: ["awconint", "awint"]
  };
  var b = {
    a: ["backcong", "backepsilon", "backprime", "backsim", "backsimeq", "barvee", "barwed", "barwedge"],
    b: ["bbrk", "bbrktbrk"],
    c: ["bcong", "bcy"],
    d: ["bdquo"],
    e: ["becaus", "because", "bemptyv", "bepsi", "bernou", "beta", "beth", "between"],
    f: ["bfr"],
    i: ["bigcap", "bigcirc", "bigcup", "bigodot", "bigoplus", "bigotimes", "bigsqcup", "bigstar", "bigtriangledown", "bigtriangleup", "biguplus", "bigvee", "bigwedge"],
    k: ["bkarow"],
    l: ["blacklozenge", "blacksquare", "blacktriangle", "blacktriangledown", "blacktriangleleft", "blacktriangleright", "blank", "blk12", "blk14", "blk34", "block"],
    n: ["bne", "bnequiv", "bnot"],
    N: ["bNot"],
    o: ["bopf", "bot", "bottom", "bowtie", "boxbox", "boxDL", "boxDl", "boxdL", "boxdl", "boxDR", "boxDr", "boxdR", "boxdr", "boxH", "boxh", "boxHD", "boxHd", "boxhD", "boxhd", "boxHU", "boxHu", "boxhU", "boxhu", "boxminus", "boxplus", "boxtimes", "boxUL", "boxUl", "boxuL", "boxul", "boxUR", "boxUr", "boxuR", "boxur", "boxV", "boxv", "boxVH", "boxVh", "boxvH", "boxvh", "boxVL", "boxVl", "boxvL", "boxvl", "boxVR", "boxVr", "boxvR", "boxvr"],
    p: ["bprime"],
    r: ["breve", "brvbar"],
    s: ["bscr", "bsemi", "bsim", "bsime", "bsol", "bsolb", "bsolhsub"],
    u: ["bull", "bullet", "bump", "bumpE", "bumpe", "bumpeq"]
  };
  var B = {
    a: ["Backslash", "Barv", "Barwed"],
    c: ["Bcy"],
    e: ["Because", "Bernoullis", "Beta"],
    f: ["Bfr"],
    o: ["Bopf"],
    r: ["Breve"],
    s: ["Bscr"],
    u: ["Bumpeq"]
  };
  var C = {
    a: ["Cacute", "Cap", "CapitalDifferentialD", "Cayleys"],
    c: ["Ccaron", "Ccedil", "Ccirc", "Cconint"],
    d: ["Cdot"],
    e: ["Cedilla", "CenterDot"],
    f: ["Cfr"],
    H: ["CHcy"],
    h: ["Chi"],
    i: ["CircleDot", "CircleMinus", "CirclePlus", "CircleTimes"],
    l: ["ClockwiseContourIntegral", "CloseCurlyDoubleQuote", "CloseCurlyQuote"],
    o: ["Colon", "Colone", "Congruent", "Conint", "ContourIntegral", "Copf", "Coproduct", "CounterClockwiseContourIntegral"],
    O: ["COPY"],
    r: ["Cross"],
    s: ["Cscr"],
    u: ["Cup", "CupCap"]
  };
  var c = {
    a: ["cacute", "cap", "capand", "capbrcup", "capcap", "capcup", "capdot", "caps", "caret", "caron"],
    c: ["ccaps", "ccaron", "ccedil", "ccirc", "ccups", "ccupssm"],
    d: ["cdot"],
    e: ["cedil", "cemptyv", "cent", "centerdot"],
    f: ["cfr"],
    h: ["chcy", "check", "checkmark", "chi"],
    i: ["cir", "circ", "circeq", "circlearrowleft", "circlearrowright", "circledast", "circledcirc", "circleddash", "circledR", "circledS", "cirE", "cire", "cirfnint", "cirmid", "cirscir"],
    l: ["clubs", "clubsuit"],
    o: ["colon", "colone", "coloneq", "comma", "commat", "comp", "compfn", "complement", "complexes", "cong", "congdot", "conint", "copf", "coprod", "copy", "copysr"],
    r: ["crarr", "cross"],
    s: ["cscr", "csub", "csube", "csup", "csupe"],
    t: ["ctdot"],
    u: ["cudarrl", "cudarrr", "cuepr", "cuesc", "cularr", "cularrp", "cup", "cupbrcap", "cupcap", "cupcup", "cupdot", "cupor", "cups", "curarr", "curarrm", "curlyeqprec", "curlyeqsucc", "curlyvee", "curlywedge", "curren", "curvearrowleft", "curvearrowright", "cuvee", "cuwed"],
    w: ["cwconint", "cwint"],
    y: ["cylcty"]
  };
  var D = {
    a: ["Dagger", "Darr", "Dashv"],
    c: ["Dcaron", "Dcy"],
    D: ["DD", "DDotrahd"],
    e: ["Del", "Delta"],
    f: ["Dfr"],
    i: ["DiacriticalAcute", "DiacriticalDot", "DiacriticalDoubleAcute", "DiacriticalGrave", "DiacriticalTilde", "Diamond", "DifferentialD"],
    J: ["DJcy"],
    o: ["Dopf", "Dot", "DotDot", "DotEqual", "DoubleContourIntegral", "DoubleDot", "DoubleDownArrow", "DoubleLeftArrow", "DoubleLeftRightArrow", "DoubleLeftTee", "DoubleLongLeftArrow", "DoubleLongLeftRightArrow", "DoubleLongRightArrow", "DoubleRightArrow", "DoubleRightTee", "DoubleUpArrow", "DoubleUpDownArrow", "DoubleVerticalBar", "DownArrow", "Downarrow", "DownArrowBar", "DownArrowUpArrow", "DownBreve", "DownLeftRightVector", "DownLeftTeeVector", "DownLeftVector", "DownLeftVectorBar", "DownRightTeeVector", "DownRightVector", "DownRightVectorBar", "DownTee", "DownTeeArrow"],
    s: ["Dscr", "Dstrok"],
    S: ["DScy"],
    Z: ["DZcy"]
  };
  var d = {
    a: ["dagger", "daleth", "darr", "dash", "dashv"],
    A: ["dArr"],
    b: ["dbkarow", "dblac"],
    c: ["dcaron", "dcy"],
    d: ["dd", "ddagger", "ddarr", "ddotseq"],
    e: ["deg", "delta", "demptyv"],
    f: ["dfisht", "dfr"],
    H: ["dHar"],
    h: ["dharl", "dharr"],
    i: ["diam", "diamond", "diamondsuit", "diams", "die", "digamma", "disin", "div", "divide", "divideontimes", "divonx"],
    j: ["djcy"],
    l: ["dlcorn", "dlcrop"],
    o: ["dollar", "dopf", "dot", "doteq", "doteqdot", "dotminus", "dotplus", "dotsquare", "doublebarwedge", "downarrow", "downdownarrows", "downharpoonleft", "downharpoonright"],
    r: ["drbkarow", "drcorn", "drcrop"],
    s: ["dscr", "dscy", "dsol", "dstrok"],
    t: ["dtdot", "dtri", "dtrif"],
    u: ["duarr", "duhar"],
    w: ["dwangle"],
    z: ["dzcy", "dzigrarr"]
  };
  var E = {
    a: ["Eacute"],
    c: ["Ecaron", "Ecirc", "Ecy"],
    d: ["Edot"],
    f: ["Efr"],
    g: ["Egrave"],
    l: ["Element"],
    m: ["Emacr", "EmptySmallSquare", "EmptyVerySmallSquare"],
    N: ["ENG"],
    o: ["Eogon", "Eopf"],
    p: ["Epsilon"],
    q: ["Equal", "EqualTilde", "Equilibrium"],
    s: ["Escr", "Esim"],
    t: ["Eta"],
    T: ["ETH"],
    u: ["Euml"],
    x: ["Exists", "ExponentialE"]
  };
  var e = {
    a: ["eacute", "easter"],
    c: ["ecaron", "ecir", "ecirc", "ecolon", "ecy"],
    D: ["eDDot", "eDot"],
    d: ["edot"],
    e: ["ee"],
    f: ["efDot", "efr"],
    g: ["eg", "egrave", "egs", "egsdot"],
    l: ["el", "elinters", "ell", "els", "elsdot"],
    m: ["emacr", "empty", "emptyset", "emptyv", "emsp", "emsp13", "emsp14"],
    n: ["eng", "ensp"],
    o: ["eogon", "eopf"],
    p: ["epar", "eparsl", "eplus", "epsi", "epsilon", "epsiv"],
    q: ["eqcirc", "eqcolon", "eqsim", "eqslantgtr", "eqslantless", "equals", "equest", "equiv", "equivDD", "eqvparsl"],
    r: ["erarr", "erDot"],
    s: ["escr", "esdot", "esim"],
    t: ["eta", "eth"],
    u: ["euml", "euro"],
    x: ["excl", "exist", "expectation", "exponentiale"]
  };
  var f = {
    a: ["fallingdotseq"],
    c: ["fcy"],
    e: ["female"],
    f: ["ffilig", "fflig", "ffllig", "ffr"],
    i: ["filig"],
    j: ["fjlig"],
    l: ["flat", "fllig", "fltns"],
    n: ["fnof"],
    o: ["fopf", "forall", "fork", "forkv"],
    p: ["fpartint"],
    r: ["frac12", "frac13", "frac14", "frac15", "frac16", "frac18", "frac23", "frac25", "frac34", "frac35", "frac38", "frac45", "frac56", "frac58", "frac78", "frasl", "frown"],
    s: ["fscr"]
  };
  var F = {
    c: ["Fcy"],
    f: ["Ffr"],
    i: ["FilledSmallSquare", "FilledVerySmallSquare"],
    o: ["Fopf", "ForAll", "Fouriertrf"],
    s: ["Fscr"]
  };
  var g = {
    a: ["gacute", "gamma", "gammad", "gap"],
    b: ["gbreve"],
    c: ["gcirc", "gcy"],
    d: ["gdot"],
    E: ["gE", "gEl"],
    e: ["ge", "gel", "geq", "geqq", "geqslant", "ges", "gescc", "gesdot", "gesdoto", "gesdotol", "gesl", "gesles"],
    f: ["gfr"],
    g: ["gg", "ggg"],
    i: ["gimel"],
    j: ["gjcy"],
    l: ["gl", "gla", "glE", "glj"],
    n: ["gnap", "gnapprox", "gnE", "gne", "gneq", "gneqq", "gnsim"],
    o: ["gopf"],
    r: ["grave"],
    s: ["gscr", "gsim", "gsime", "gsiml"],
    t: ["gt", "gtcc", "gtcir", "gtdot", "gtlPar", "gtquest", "gtrapprox", "gtrarr", "gtrdot", "gtreqless", "gtreqqless", "gtrless", "gtrsim"],
    v: ["gvertneqq", "gvnE"]
  };
  var G = {
    a: ["Gamma", "Gammad"],
    b: ["Gbreve"],
    c: ["Gcedil", "Gcirc", "Gcy"],
    d: ["Gdot"],
    f: ["Gfr"],
    g: ["Gg"],
    J: ["GJcy"],
    o: ["Gopf"],
    r: ["GreaterEqual", "GreaterEqualLess", "GreaterFullEqual", "GreaterGreater", "GreaterLess", "GreaterSlantEqual", "GreaterTilde"],
    s: ["Gscr"],
    T: ["GT"],
    t: ["Gt"]
  };
  var H = {
    a: ["Hacek", "Hat"],
    A: ["HARDcy"],
    c: ["Hcirc"],
    f: ["Hfr"],
    i: ["HilbertSpace"],
    o: ["Hopf", "HorizontalLine"],
    s: ["Hscr", "Hstrok"],
    u: ["HumpDownHump", "HumpEqual"]
  };
  var h = {
    a: ["hairsp", "half", "hamilt", "hardcy", "harr", "harrcir", "harrw"],
    A: ["hArr"],
    b: ["hbar"],
    c: ["hcirc"],
    e: ["hearts", "heartsuit", "hellip", "hercon"],
    f: ["hfr"],
    k: ["hksearow", "hkswarow"],
    o: ["hoarr", "homtht", "hookleftarrow", "hookrightarrow", "hopf", "horbar"],
    s: ["hscr", "hslash", "hstrok"],
    y: ["hybull", "hyphen"]
  };
  var I = {
    a: ["Iacute"],
    c: ["Icirc", "Icy"],
    d: ["Idot"],
    E: ["IEcy"],
    f: ["Ifr"],
    g: ["Igrave"],
    J: ["IJlig"],
    m: ["Im", "Imacr", "ImaginaryI", "Implies"],
    n: ["Int", "Integral", "Intersection", "InvisibleComma", "InvisibleTimes"],
    O: ["IOcy"],
    o: ["Iogon", "Iopf", "Iota"],
    s: ["Iscr"],
    t: ["Itilde"],
    u: ["Iukcy", "Iuml"]
  };
  var i = {
    a: ["iacute"],
    c: ["ic", "icirc", "icy"],
    e: ["iecy", "iexcl"],
    f: ["iff", "ifr"],
    g: ["igrave"],
    i: ["ii", "iiiint", "iiint", "iinfin", "iiota"],
    j: ["ijlig"],
    m: ["imacr", "image", "imagline", "imagpart", "imath", "imof", "imped"],
    n: ["in", "incare", "infin", "infintie", "inodot", "int", "intcal", "integers", "intercal", "intlarhk", "intprod"],
    o: ["iocy", "iogon", "iopf", "iota"],
    p: ["iprod"],
    q: ["iquest"],
    s: ["iscr", "isin", "isindot", "isinE", "isins", "isinsv", "isinv"],
    t: ["it", "itilde"],
    u: ["iukcy", "iuml"]
  };
  var J = {
    c: ["Jcirc", "Jcy"],
    f: ["Jfr"],
    o: ["Jopf"],
    s: ["Jscr", "Jsercy"],
    u: ["Jukcy"]
  };
  var j = {
    c: ["jcirc", "jcy"],
    f: ["jfr"],
    m: ["jmath"],
    o: ["jopf"],
    s: ["jscr", "jsercy"],
    u: ["jukcy"]
  };
  var K = {
    a: ["Kappa"],
    c: ["Kcedil", "Kcy"],
    f: ["Kfr"],
    H: ["KHcy"],
    J: ["KJcy"],
    o: ["Kopf"],
    s: ["Kscr"]
  };
  var k = {
    a: ["kappa", "kappav"],
    c: ["kcedil", "kcy"],
    f: ["kfr"],
    g: ["kgreen"],
    h: ["khcy"],
    j: ["kjcy"],
    o: ["kopf"],
    s: ["kscr"]
  };
  var l = {
    A: ["lAarr", "lArr", "lAtail"],
    a: ["lacute", "laemptyv", "lagran", "lambda", "lang", "langd", "langle", "lap", "laquo", "larr", "larrb", "larrbfs", "larrfs", "larrhk", "larrlp", "larrpl", "larrsim", "larrtl", "lat", "latail", "late", "lates"],
    B: ["lBarr"],
    b: ["lbarr", "lbbrk", "lbrace", "lbrack", "lbrke", "lbrksld", "lbrkslu"],
    c: ["lcaron", "lcedil", "lceil", "lcub", "lcy"],
    d: ["ldca", "ldquo", "ldquor", "ldrdhar", "ldrushar", "ldsh"],
    E: ["lE", "lEg"],
    e: ["le", "leftarrow", "leftarrowtail", "leftharpoondown", "leftharpoonup", "leftleftarrows", "leftrightarrow", "leftrightarrows", "leftrightharpoons", "leftrightsquigarrow", "leftthreetimes", "leg", "leq", "leqq", "leqslant", "les", "lescc", "lesdot", "lesdoto", "lesdotor", "lesg", "lesges", "lessapprox", "lessdot", "lesseqgtr", "lesseqqgtr", "lessgtr", "lesssim"],
    f: ["lfisht", "lfloor", "lfr"],
    g: ["lg", "lgE"],
    H: ["lHar"],
    h: ["lhard", "lharu", "lharul", "lhblk"],
    j: ["ljcy"],
    l: ["ll", "llarr", "llcorner", "llhard", "lltri"],
    m: ["lmidot", "lmoust", "lmoustache"],
    n: ["lnap", "lnapprox", "lnE", "lne", "lneq", "lneqq", "lnsim"],
    o: ["loang", "loarr", "lobrk", "longleftarrow", "longleftrightarrow", "longmapsto", "longrightarrow", "looparrowleft", "looparrowright", "lopar", "lopf", "loplus", "lotimes", "lowast", "lowbar", "loz", "lozenge", "lozf"],
    p: ["lpar", "lparlt"],
    r: ["lrarr", "lrcorner", "lrhar", "lrhard", "lrm", "lrtri"],
    s: ["lsaquo", "lscr", "lsh", "lsim", "lsime", "lsimg", "lsqb", "lsquo", "lsquor", "lstrok"],
    t: ["lt", "ltcc", "ltcir", "ltdot", "lthree", "ltimes", "ltlarr", "ltquest", "ltri", "ltrie", "ltrif", "ltrPar"],
    u: ["lurdshar", "luruhar"],
    v: ["lvertneqq", "lvnE"]
  };
  var L = {
    a: ["Lacute", "Lambda", "Lang", "Laplacetrf", "Larr"],
    c: ["Lcaron", "Lcedil", "Lcy"],
    e: ["LeftAngleBracket", "LeftArrow", "Leftarrow", "LeftArrowBar", "LeftArrowRightArrow", "LeftCeiling", "LeftDoubleBracket", "LeftDownTeeVector", "LeftDownVector", "LeftDownVectorBar", "LeftFloor", "LeftRightArrow", "Leftrightarrow", "LeftRightVector", "LeftTee", "LeftTeeArrow", "LeftTeeVector", "LeftTriangle", "LeftTriangleBar", "LeftTriangleEqual", "LeftUpDownVector", "LeftUpTeeVector", "LeftUpVector", "LeftUpVectorBar", "LeftVector", "LeftVectorBar", "LessEqualGreater", "LessFullEqual", "LessGreater", "LessLess", "LessSlantEqual", "LessTilde"],
    f: ["Lfr"],
    J: ["LJcy"],
    l: ["Ll", "Lleftarrow"],
    m: ["Lmidot"],
    o: ["LongLeftArrow", "Longleftarrow", "LongLeftRightArrow", "Longleftrightarrow", "LongRightArrow", "Longrightarrow", "Lopf", "LowerLeftArrow", "LowerRightArrow"],
    s: ["Lscr", "Lsh", "Lstrok"],
    T: ["LT"],
    t: ["Lt"]
  };
  var m = {
    a: ["macr", "male", "malt", "maltese", "map", "mapsto", "mapstodown", "mapstoleft", "mapstoup", "marker"],
    c: ["mcomma", "mcy"],
    d: ["mdash"],
    D: ["mDDot"],
    e: ["measuredangle"],
    f: ["mfr"],
    h: ["mho"],
    i: ["micro", "mid", "midast", "midcir", "middot", "minus", "minusb", "minusd", "minusdu"],
    l: ["mlcp", "mldr"],
    n: ["mnplus"],
    o: ["models", "mopf"],
    p: ["mp"],
    s: ["mscr", "mstpos"],
    u: ["mu", "multimap", "mumap"]
  };
  var M = {
    a: ["Map"],
    c: ["Mcy"],
    e: ["MediumSpace", "Mellintrf"],
    f: ["Mfr"],
    i: ["MinusPlus"],
    o: ["Mopf"],
    s: ["Mscr"],
    u: ["Mu"]
  };
  var n = {
    a: ["nabla", "nacute", "nang", "nap", "napE", "napid", "napos", "napprox", "natur", "natural", "naturals"],
    b: ["nbsp", "nbump", "nbumpe"],
    c: ["ncap", "ncaron", "ncedil", "ncong", "ncongdot", "ncup", "ncy"],
    d: ["ndash"],
    e: ["ne", "nearhk", "neArr", "nearr", "nearrow", "nedot", "nequiv", "nesear", "nesim", "nexist", "nexists"],
    f: ["nfr"],
    g: ["ngE", "nge", "ngeq", "ngeqq", "ngeqslant", "nges", "ngsim", "ngt", "ngtr"],
    G: ["nGg", "nGt", "nGtv"],
    h: ["nhArr", "nharr", "nhpar"],
    i: ["ni", "nis", "nisd", "niv"],
    j: ["njcy"],
    l: ["nlArr", "nlarr", "nldr", "nlE", "nle", "nleftarrow", "nleftrightarrow", "nleq", "nleqq", "nleqslant", "nles", "nless", "nlsim", "nlt", "nltri", "nltrie"],
    L: ["nLeftarrow", "nLeftrightarrow", "nLl", "nLt", "nLtv"],
    m: ["nmid"],
    o: ["nopf", "not", "notin", "notindot", "notinE", "notinva", "notinvb", "notinvc", "notni", "notniva", "notnivb", "notnivc"],
    p: ["npar", "nparallel", "nparsl", "npart", "npolint", "npr", "nprcue", "npre", "nprec", "npreceq"],
    r: ["nrArr", "nrarr", "nrarrc", "nrarrw", "nrightarrow", "nrtri", "nrtrie"],
    R: ["nRightarrow"],
    s: ["nsc", "nsccue", "nsce", "nscr", "nshortmid", "nshortparallel", "nsim", "nsime", "nsimeq", "nsmid", "nspar", "nsqsube", "nsqsupe", "nsub", "nsubE", "nsube", "nsubset", "nsubseteq", "nsubseteqq", "nsucc", "nsucceq", "nsup", "nsupE", "nsupe", "nsupset", "nsupseteq", "nsupseteqq"],
    t: ["ntgl", "ntilde", "ntlg", "ntriangleleft", "ntrianglelefteq", "ntriangleright", "ntrianglerighteq"],
    u: ["nu", "num", "numero", "numsp"],
    v: ["nvap", "nvDash", "nvdash", "nvge", "nvgt", "nvHarr", "nvinfin", "nvlArr", "nvle", "nvlt", "nvltrie", "nvrArr", "nvrtrie", "nvsim"],
    V: ["nVDash", "nVdash"],
    w: ["nwarhk", "nwArr", "nwarr", "nwarrow", "nwnear"]
  };
  var N = {
    a: ["Nacute"],
    c: ["Ncaron", "Ncedil", "Ncy"],
    e: ["NegativeMediumSpace", "NegativeThickSpace", "NegativeThinSpace", "NegativeVeryThinSpace", "NestedGreaterGreater", "NestedLessLess", "NewLine"],
    f: ["Nfr"],
    J: ["NJcy"],
    o: ["NoBreak", "NonBreakingSpace", "Nopf", "Not", "NotCongruent", "NotCupCap", "NotDoubleVerticalBar", "NotElement", "NotEqual", "NotEqualTilde", "NotExists", "NotGreater", "NotGreaterEqual", "NotGreaterFullEqual", "NotGreaterGreater", "NotGreaterLess", "NotGreaterSlantEqual", "NotGreaterTilde", "NotHumpDownHump", "NotHumpEqual", "NotLeftTriangle", "NotLeftTriangleBar", "NotLeftTriangleEqual", "NotLess", "NotLessEqual", "NotLessGreater", "NotLessLess", "NotLessSlantEqual", "NotLessTilde", "NotNestedGreaterGreater", "NotNestedLessLess", "NotPrecedes", "NotPrecedesEqual", "NotPrecedesSlantEqual", "NotReverseElement", "NotRightTriangle", "NotRightTriangleBar", "NotRightTriangleEqual", "NotSquareSubset", "NotSquareSubsetEqual", "NotSquareSuperset", "NotSquareSupersetEqual", "NotSubset", "NotSubsetEqual", "NotSucceeds", "NotSucceedsEqual", "NotSucceedsSlantEqual", "NotSucceedsTilde", "NotSuperset", "NotSupersetEqual", "NotTilde", "NotTildeEqual", "NotTildeFullEqual", "NotTildeTilde", "NotVerticalBar"],
    s: ["Nscr"],
    t: ["Ntilde"],
    u: ["Nu"]
  };
  var O = {
    a: ["Oacute"],
    c: ["Ocirc", "Ocy"],
    d: ["Odblac"],
    E: ["OElig"],
    f: ["Ofr"],
    g: ["Ograve"],
    m: ["Omacr", "Omega", "Omicron"],
    o: ["Oopf"],
    p: ["OpenCurlyDoubleQuote", "OpenCurlyQuote"],
    r: ["Or"],
    s: ["Oscr", "Oslash"],
    t: ["Otilde", "Otimes"],
    u: ["Ouml"],
    v: ["OverBar", "OverBrace", "OverBracket", "OverParenthesis"]
  };
  var o = {
    a: ["oacute", "oast"],
    c: ["ocir", "ocirc", "ocy"],
    d: ["odash", "odblac", "odiv", "odot", "odsold"],
    e: ["oelig"],
    f: ["ofcir", "ofr"],
    g: ["ogon", "ograve", "ogt"],
    h: ["ohbar", "ohm"],
    i: ["oint"],
    l: ["olarr", "olcir", "olcross", "oline", "olt"],
    m: ["omacr", "omega", "omicron", "omid", "ominus"],
    o: ["oopf"],
    p: ["opar", "operp", "oplus"],
    r: ["or", "orarr", "ord", "order", "orderof", "ordf", "ordm", "origof", "oror", "orslope", "orv"],
    S: ["oS"],
    s: ["oscr", "oslash", "osol"],
    t: ["otilde", "otimes", "otimesas"],
    u: ["ouml"],
    v: ["ovbar"]
  };
  var p = {
    a: ["par", "para", "parallel", "parsim", "parsl", "part"],
    c: ["pcy"],
    e: ["percnt", "period", "permil", "perp", "pertenk"],
    f: ["pfr"],
    h: ["phi", "phiv", "phmmat", "phone"],
    i: ["pi", "pitchfork", "piv"],
    l: ["planck", "planckh", "plankv", "plus", "plusacir", "plusb", "pluscir", "plusdo", "plusdu", "pluse", "plusmn", "plussim", "plustwo"],
    m: ["pm"],
    o: ["pointint", "popf", "pound"],
    r: ["pr", "prap", "prcue", "prE", "pre", "prec", "precapprox", "preccurlyeq", "preceq", "precnapprox", "precneqq", "precnsim", "precsim", "prime", "primes", "prnap", "prnE", "prnsim", "prod", "profalar", "profline", "profsurf", "prop", "propto", "prsim", "prurel"],
    s: ["pscr", "psi"],
    u: ["puncsp"]
  };
  var P = {
    a: ["PartialD"],
    c: ["Pcy"],
    f: ["Pfr"],
    h: ["Phi"],
    i: ["Pi"],
    l: ["PlusMinus"],
    o: ["Poincareplane", "Popf"],
    r: ["Pr", "Precedes", "PrecedesEqual", "PrecedesSlantEqual", "PrecedesTilde", "Prime", "Product", "Proportion", "Proportional"],
    s: ["Pscr", "Psi"]
  };
  var Q = {
    f: ["Qfr"],
    o: ["Qopf"],
    s: ["Qscr"],
    U: ["QUOT"]
  };
  var q = {
    f: ["qfr"],
    i: ["qint"],
    o: ["qopf"],
    p: ["qprime"],
    s: ["qscr"],
    u: ["quaternions", "quatint", "quest", "questeq", "quot"]
  };
  var r = {
    A: ["rAarr", "rArr", "rAtail"],
    a: ["race", "racute", "radic", "raemptyv", "rang", "rangd", "range", "rangle", "raquo", "rarr", "rarrap", "rarrb", "rarrbfs", "rarrc", "rarrfs", "rarrhk", "rarrlp", "rarrpl", "rarrsim", "rarrtl", "rarrw", "ratail", "ratio", "rationals"],
    B: ["rBarr"],
    b: ["rbarr", "rbbrk", "rbrace", "rbrack", "rbrke", "rbrksld", "rbrkslu"],
    c: ["rcaron", "rcedil", "rceil", "rcub", "rcy"],
    d: ["rdca", "rdldhar", "rdquo", "rdquor", "rdsh"],
    e: ["real", "realine", "realpart", "reals", "rect", "reg"],
    f: ["rfisht", "rfloor", "rfr"],
    H: ["rHar"],
    h: ["rhard", "rharu", "rharul", "rho", "rhov"],
    i: ["rightarrow", "rightarrowtail", "rightharpoondown", "rightharpoonup", "rightleftarrows", "rightleftharpoons", "rightrightarrows", "rightsquigarrow", "rightthreetimes", "ring", "risingdotseq"],
    l: ["rlarr", "rlhar", "rlm"],
    m: ["rmoust", "rmoustache"],
    n: ["rnmid"],
    o: ["roang", "roarr", "robrk", "ropar", "ropf", "roplus", "rotimes"],
    p: ["rpar", "rpargt", "rppolint"],
    r: ["rrarr"],
    s: ["rsaquo", "rscr", "rsh", "rsqb", "rsquo", "rsquor"],
    t: ["rthree", "rtimes", "rtri", "rtrie", "rtrif", "rtriltri"],
    u: ["ruluhar"],
    x: ["rx"]
  };
  var R = {
    a: ["Racute", "Rang", "Rarr", "Rarrtl"],
    B: ["RBarr"],
    c: ["Rcaron", "Rcedil", "Rcy"],
    e: ["Re", "ReverseElement", "ReverseEquilibrium", "ReverseUpEquilibrium"],
    E: ["REG"],
    f: ["Rfr"],
    h: ["Rho"],
    i: ["RightAngleBracket", "RightArrow", "Rightarrow", "RightArrowBar", "RightArrowLeftArrow", "RightCeiling", "RightDoubleBracket", "RightDownTeeVector", "RightDownVector", "RightDownVectorBar", "RightFloor", "RightTee", "RightTeeArrow", "RightTeeVector", "RightTriangle", "RightTriangleBar", "RightTriangleEqual", "RightUpDownVector", "RightUpTeeVector", "RightUpVector", "RightUpVectorBar", "RightVector", "RightVectorBar"],
    o: ["Ropf", "RoundImplies"],
    r: ["Rrightarrow"],
    s: ["Rscr", "Rsh"],
    u: ["RuleDelayed"]
  };
  var S = {
    a: ["Sacute"],
    c: ["Sc", "Scaron", "Scedil", "Scirc", "Scy"],
    f: ["Sfr"],
    H: ["SHCHcy", "SHcy"],
    h: ["ShortDownArrow", "ShortLeftArrow", "ShortRightArrow", "ShortUpArrow"],
    i: ["Sigma"],
    m: ["SmallCircle"],
    O: ["SOFTcy"],
    o: ["Sopf"],
    q: ["Sqrt", "Square", "SquareIntersection", "SquareSubset", "SquareSubsetEqual", "SquareSuperset", "SquareSupersetEqual", "SquareUnion"],
    s: ["Sscr"],
    t: ["Star"],
    u: ["Sub", "Subset", "SubsetEqual", "Succeeds", "SucceedsEqual", "SucceedsSlantEqual", "SucceedsTilde", "SuchThat", "Sum", "Sup", "Superset", "SupersetEqual", "Supset"]
  };
  var s = {
    a: ["sacute"],
    b: ["sbquo"],
    c: ["sc", "scap", "scaron", "sccue", "scE", "sce", "scedil", "scirc", "scnap", "scnE", "scnsim", "scpolint", "scsim", "scy"],
    d: ["sdot", "sdotb", "sdote"],
    e: ["searhk", "seArr", "searr", "searrow", "sect", "semi", "seswar", "setminus", "setmn", "sext"],
    f: ["sfr", "sfrown"],
    h: ["sharp", "shchcy", "shcy", "shortmid", "shortparallel", "shy"],
    i: ["sigma", "sigmaf", "sigmav", "sim", "simdot", "sime", "simeq", "simg", "simgE", "siml", "simlE", "simne", "simplus", "simrarr"],
    l: ["slarr"],
    m: ["smallsetminus", "smashp", "smeparsl", "smid", "smile", "smt", "smte", "smtes"],
    o: ["softcy", "sol", "solb", "solbar", "sopf"],
    p: ["spades", "spadesuit", "spar"],
    q: ["sqcap", "sqcaps", "sqcup", "sqcups", "sqsub", "sqsube", "sqsubset", "sqsubseteq", "sqsup", "sqsupe", "sqsupset", "sqsupseteq", "squ", "square", "squarf", "squf"],
    r: ["srarr"],
    s: ["sscr", "ssetmn", "ssmile", "sstarf"],
    t: ["star", "starf", "straightepsilon", "straightphi", "strns"],
    u: ["sub", "subdot", "subE", "sube", "subedot", "submult", "subnE", "subne", "subplus", "subrarr", "subset", "subseteq", "subseteqq", "subsetneq", "subsetneqq", "subsim", "subsub", "subsup", "succ", "succapprox", "succcurlyeq", "succeq", "succnapprox", "succneqq", "succnsim", "succsim", "sum", "sung", "sup", "sup1", "sup2", "sup3", "supdot", "supdsub", "supE", "supe", "supedot", "suphsol", "suphsub", "suplarr", "supmult", "supnE", "supne", "supplus", "supset", "supseteq", "supseteqq", "supsetneq", "supsetneqq", "supsim", "supsub", "supsup"],
    w: ["swarhk", "swArr", "swarr", "swarrow", "swnwar"],
    z: ["szlig"]
  };
  var T = {
    a: ["Tab", "Tau"],
    c: ["Tcaron", "Tcedil", "Tcy"],
    f: ["Tfr"],
    h: ["Therefore", "Theta", "ThickSpace", "ThinSpace"],
    H: ["THORN"],
    i: ["Tilde", "TildeEqual", "TildeFullEqual", "TildeTilde"],
    o: ["Topf"],
    R: ["TRADE"],
    r: ["TripleDot"],
    s: ["Tscr", "Tstrok"],
    S: ["TScy", "TSHcy"]
  };
  var t = {
    a: ["target", "tau"],
    b: ["tbrk"],
    c: ["tcaron", "tcedil", "tcy"],
    d: ["tdot"],
    e: ["telrec"],
    f: ["tfr"],
    h: ["there4", "therefore", "theta", "thetasym", "thetav", "thickapprox", "thicksim", "thinsp", "thkap", "thksim", "thorn"],
    i: ["tilde", "times", "timesb", "timesbar", "timesd", "tint"],
    o: ["toea", "top", "topbot", "topcir", "topf", "topfork", "tosa"],
    p: ["tprime"],
    r: ["trade", "triangle", "triangledown", "triangleleft", "trianglelefteq", "triangleq", "triangleright", "trianglerighteq", "tridot", "trie", "triminus", "triplus", "trisb", "tritime", "trpezium"],
    s: ["tscr", "tscy", "tshcy", "tstrok"],
    w: ["twixt", "twoheadleftarrow", "twoheadrightarrow"]
  };
  var U = {
    a: ["Uacute", "Uarr", "Uarrocir"],
    b: ["Ubrcy", "Ubreve"],
    c: ["Ucirc", "Ucy"],
    d: ["Udblac"],
    f: ["Ufr"],
    g: ["Ugrave"],
    m: ["Umacr"],
    n: ["UnderBar", "UnderBrace", "UnderBracket", "UnderParenthesis", "Union", "UnionPlus"],
    o: ["Uogon", "Uopf"],
    p: ["UpArrow", "Uparrow", "UpArrowBar", "UpArrowDownArrow", "UpDownArrow", "Updownarrow", "UpEquilibrium", "UpperLeftArrow", "UpperRightArrow", "Upsi", "Upsilon", "UpTee", "UpTeeArrow"],
    r: ["Uring"],
    s: ["Uscr"],
    t: ["Utilde"],
    u: ["Uuml"]
  };
  var u = {
    a: ["uacute", "uarr"],
    A: ["uArr"],
    b: ["ubrcy", "ubreve"],
    c: ["ucirc", "ucy"],
    d: ["udarr", "udblac", "udhar"],
    f: ["ufisht", "ufr"],
    g: ["ugrave"],
    H: ["uHar"],
    h: ["uharl", "uharr", "uhblk"],
    l: ["ulcorn", "ulcorner", "ulcrop", "ultri"],
    m: ["umacr", "uml"],
    o: ["uogon", "uopf"],
    p: ["uparrow", "updownarrow", "upharpoonleft", "upharpoonright", "uplus", "upsi", "upsih", "upsilon", "upuparrows"],
    r: ["urcorn", "urcorner", "urcrop", "uring", "urtri"],
    s: ["uscr"],
    t: ["utdot", "utilde", "utri", "utrif"],
    u: ["uuarr", "uuml"],
    w: ["uwangle"]
  };
  var v = {
    a: ["vangrt", "varepsilon", "varkappa", "varnothing", "varphi", "varpi", "varpropto", "varr", "varrho", "varsigma", "varsubsetneq", "varsubsetneqq", "varsupsetneq", "varsupsetneqq", "vartheta", "vartriangleleft", "vartriangleright"],
    A: ["vArr"],
    B: ["vBar", "vBarv"],
    c: ["vcy"],
    D: ["vDash"],
    d: ["vdash"],
    e: ["vee", "veebar", "veeeq", "vellip", "verbar", "vert"],
    f: ["vfr"],
    l: ["vltri"],
    n: ["vnsub", "vnsup"],
    o: ["vopf"],
    p: ["vprop"],
    r: ["vrtri"],
    s: ["vscr", "vsubnE", "vsubne", "vsupnE", "vsupne"],
    z: ["vzigzag"]
  };
  var V = {
    b: ["Vbar"],
    c: ["Vcy"],
    D: ["VDash"],
    d: ["Vdash", "Vdashl"],
    e: ["Vee", "Verbar", "Vert", "VerticalBar", "VerticalLine", "VerticalSeparator", "VerticalTilde", "VeryThinSpace"],
    f: ["Vfr"],
    o: ["Vopf"],
    s: ["Vscr"],
    v: ["Vvdash"]
  };
  var W = {
    c: ["Wcirc"],
    e: ["Wedge"],
    f: ["Wfr"],
    o: ["Wopf"],
    s: ["Wscr"]
  };
  var w = {
    c: ["wcirc"],
    e: ["wedbar", "wedge", "wedgeq", "weierp"],
    f: ["wfr"],
    o: ["wopf"],
    p: ["wp"],
    r: ["wr", "wreath"],
    s: ["wscr"]
  };
  var x = {
    c: ["xcap", "xcirc", "xcup"],
    d: ["xdtri"],
    f: ["xfr"],
    h: ["xhArr", "xharr"],
    i: ["xi"],
    l: ["xlArr", "xlarr"],
    m: ["xmap"],
    n: ["xnis"],
    o: ["xodot", "xopf", "xoplus", "xotime"],
    r: ["xrArr", "xrarr"],
    s: ["xscr", "xsqcup"],
    u: ["xuplus", "xutri"],
    v: ["xvee"],
    w: ["xwedge"]
  };
  var X = {
    f: ["Xfr"],
    i: ["Xi"],
    o: ["Xopf"],
    s: ["Xscr"]
  };
  var Y = {
    a: ["Yacute"],
    A: ["YAcy"],
    c: ["Ycirc", "Ycy"],
    f: ["Yfr"],
    I: ["YIcy"],
    o: ["Yopf"],
    s: ["Yscr"],
    U: ["YUcy"],
    u: ["Yuml"]
  };
  var y = {
    a: ["yacute", "yacy"],
    c: ["ycirc", "ycy"],
    e: ["yen"],
    f: ["yfr"],
    i: ["yicy"],
    o: ["yopf"],
    s: ["yscr"],
    u: ["yucy", "yuml"]
  };
  var Z = {
    a: ["Zacute"],
    c: ["Zcaron", "Zcy"],
    d: ["Zdot"],
    e: ["ZeroWidthSpace", "Zeta"],
    f: ["Zfr"],
    H: ["ZHcy"],
    o: ["Zopf"],
    s: ["Zscr"]
  };
  var z = {
    a: ["zacute"],
    c: ["zcaron", "zcy"],
    d: ["zdot"],
    e: ["zeetrf", "zeta"],
    f: ["zfr"],
    h: ["zhcy"],
    i: ["zigrarr"],
    o: ["zopf"],
    s: ["zscr"],
    w: ["zwj", "zwnj"]
  };
  var startsWith = {
    A: A,
    a: a,
    b: b,
    B: B,
    C: C,
    c: c,
    D: D,
    d: d,
    E: E,
    e: e,
    f: f,
    F: F,
    g: g,
    G: G,
    H: H,
    h: h,
    I: I,
    i: i,
    J: J,
    j: j,
    K: K,
    k: k,
    l: l,
    L: L,
    m: m,
    M: M,
    n: n,
    N: N,
    O: O,
    o: o,
    p: p,
    P: P,
    Q: Q,
    q: q,
    r: r,
    R: R,
    S: S,
    s: s,
    T: T,
    t: t,
    U: U,
    u: u,
    v: v,
    V: V,
    W: W,
    w: w,
    x: x,
    X: X,
    Y: Y,
    y: y,
    Z: Z,
    z: z
  };
  var e$1 = {
    t: ["Aacute", "aacute", "acute", "Cacute", "cacute", "CloseCurlyDoubleQuote", "CloseCurlyQuote", "DiacriticalAcute", "DiacriticalDoubleAcute", "Eacute", "eacute", "gacute", "Iacute", "iacute", "Lacute", "lacute", "late", "Nacute", "nacute", "Oacute", "oacute", "OpenCurlyDoubleQuote", "OpenCurlyQuote", "Racute", "racute", "Sacute", "sacute", "sdote", "smte", "Uacute", "uacute", "Yacute", "yacute", "Zacute", "zacute"],
    v: ["Abreve", "abreve", "Agrave", "agrave", "Breve", "breve", "DiacriticalGrave", "DownBreve", "Egrave", "egrave", "Gbreve", "gbreve", "grave", "Igrave", "igrave", "Ograve", "ograve", "Ubreve", "ubreve", "Ugrave", "ugrave"],
    p: ["andslope", "ape", "bumpe", "csupe", "nbumpe", "nsqsupe", "nsupe", "orslope", "sqsupe", "supe"],
    g: ["ange", "barwedge", "bigwedge", "blacklozenge", "curlywedge", "doublebarwedge", "ge", "image", "lozenge", "nge", "nvge", "range", "Wedge", "wedge", "xwedge"],
    l: ["angle", "blacktriangle", "dwangle", "exponentiale", "female", "langle", "le", "LeftTriangle", "male", "measuredangle", "nle", "NotLeftTriangle", "NotRightTriangle", "nvle", "rangle", "RightTriangle", "SmallCircle", "smile", "ssmile", "triangle", "uwangle"],
    a: ["angmsdae"],
    d: ["Atilde", "atilde", "DiacriticalTilde", "divide", "EqualTilde", "GreaterTilde", "Itilde", "itilde", "LessTilde", "NotEqualTilde", "NotGreaterTilde", "NotLessTilde", "NotSucceedsTilde", "NotTilde", "NotTildeTilde", "Ntilde", "ntilde", "Otilde", "otilde", "PrecedesTilde", "SucceedsTilde", "Tilde", "tilde", "TildeTilde", "trade", "Utilde", "utilde", "VerticalTilde"],
    m: ["backprime", "bprime", "bsime", "gsime", "lsime", "nsime", "Prime", "prime", "qprime", "sime", "tprime", "tritime", "xotime"],
    e: ["barvee", "bigvee", "curlyvee", "cuvee", "DoubleLeftTee", "DoubleRightTee", "DownTee", "ee", "LeftTee", "lthree", "RightTee", "rthree", "UpTee", "Vee", "vee", "xvee"],
    s: ["Because", "because", "maltese", "pluse"],
    r: ["blacksquare", "cire", "dotsquare", "EmptySmallSquare", "EmptyVerySmallSquare", "FilledSmallSquare", "FilledVerySmallSquare", "incare", "npre", "pre", "Square", "square", "Therefore", "therefore"],
    n: ["bne", "Colone", "colone", "gne", "HorizontalLine", "imagline", "lne", "ne", "NewLine", "oline", "phone", "Poincareplane", "profline", "realine", "simne", "subne", "supne", "VerticalLine", "vsubne", "vsupne"],
    i: ["bowtie", "die", "infintie", "ltrie", "nltrie", "nrtrie", "nvltrie", "nvrtrie", "rtrie", "trie"],
    b: ["csube", "nsqsube", "nsube", "sqsube", "sube"],
    c: ["HilbertSpace", "lbrace", "MediumSpace", "NegativeMediumSpace", "NegativeThickSpace", "NegativeThinSpace", "NegativeVeryThinSpace", "NonBreakingSpace", "nsce", "OverBrace", "race", "rbrace", "sce", "ThickSpace", "ThinSpace", "UnderBrace", "VeryThinSpace", "ZeroWidthSpace"],
    k: ["lbrke", "rbrke"],
    h: ["lmoustache", "rmoustache"],
    u: ["nprcue", "nsccue", "prcue", "sccue"],
    R: ["Re"]
  };
  var c$1 = {
    a: ["ac", "angmsdac", "dblac", "Odblac", "odblac", "Udblac", "udblac"],
    r: ["Acirc", "acirc", "bigcirc", "Ccirc", "ccirc", "circ", "circledcirc", "Ecirc", "ecirc", "eqcirc", "Gcirc", "gcirc", "Hcirc", "hcirc", "Icirc", "icirc", "Jcirc", "jcirc", "nrarrc", "Ocirc", "ocirc", "rarrc", "Scirc", "scirc", "Ucirc", "ucirc", "Wcirc", "wcirc", "xcirc", "Ycirc", "ycirc"],
    s: ["cuesc", "nsc", "sc"],
    e: ["curlyeqprec", "nprec", "prec", "telrec"],
    c: ["curlyeqsucc", "gescc", "gtcc", "lescc", "ltcc", "nsucc", "succ"],
    i: ["ic", "radic"],
    v: ["notinvc", "notnivc"],
    S: ["Sc"]
  };
  var d$1 = {
    c: ["acd"],
    n: ["And", "and", "andand", "capand", "Diamond", "diamond", "pound"],
    d: ["andd", "dd"],
    s: ["angmsd", "minusd", "nisd", "timesd"],
    a: ["angmsdad", "Gammad", "gammad"],
    b: ["angrtvbd"],
    i: ["apid", "cirmid", "mid", "napid", "nmid", "nshortmid", "nsmid", "omid", "rnmid", "shortmid", "smid"],
    e: ["Barwed", "barwed", "cuwed", "imped", "RuleDelayed"],
    H: ["boxHd"],
    h: ["boxhd", "DDotrahd"],
    o: ["coprod", "intprod", "iprod", "period", "prod"],
    g: ["langd", "rangd"],
    l: ["lbrksld", "odsold", "rbrksld"],
    r: ["lhard", "llhard", "lrhard", "ord", "rhard"]
  };
  var E$1 = {
    c: ["acE", "scE"],
    p: ["apE", "bumpE", "napE", "nsupE", "supE"],
    r: ["cirE", "prE"],
    l: ["ExponentialE", "glE", "lE", "nlE", "simlE"],
    g: ["gE", "lgE", "ngE", "simgE"],
    n: ["gnE", "gvnE", "isinE", "lnE", "lvnE", "notinE", "prnE", "scnE", "subnE", "supnE", "vsubnE", "vsupnE"],
    b: ["nsubE", "subE"],
    D: ["TRADE"]
  };
  var y$1 = {
    c: ["Acy", "acy", "Bcy", "bcy", "CHcy", "chcy", "Dcy", "dcy", "DJcy", "djcy", "DScy", "dscy", "DZcy", "dzcy", "Ecy", "ecy", "Fcy", "fcy", "Gcy", "gcy", "GJcy", "gjcy", "HARDcy", "hardcy", "Icy", "icy", "IEcy", "iecy", "IOcy", "iocy", "Iukcy", "iukcy", "Jcy", "jcy", "Jsercy", "jsercy", "Jukcy", "jukcy", "Kcy", "kcy", "KHcy", "khcy", "KJcy", "kjcy", "Lcy", "lcy", "LJcy", "ljcy", "Mcy", "mcy", "Ncy", "ncy", "NJcy", "njcy", "Ocy", "ocy", "Pcy", "pcy", "Rcy", "rcy", "Scy", "scy", "SHCHcy", "shchcy", "SHcy", "shcy", "SOFTcy", "softcy", "Tcy", "tcy", "TScy", "tscy", "TSHcy", "tshcy", "Ubrcy", "ubrcy", "Ucy", "ucy", "Vcy", "vcy", "YAcy", "yacy", "Ycy", "ycy", "YIcy", "yicy", "YUcy", "yucy", "Zcy", "zcy", "ZHcy", "zhcy"],
    p: ["copy"],
    t: ["cylcty", "empty"],
    h: ["shy"]
  };
  var g$1 = {
    i: ["AElig", "aelig", "ffilig", "fflig", "ffllig", "filig", "fjlig", "fllig", "IJlig", "ijlig", "OElig", "oelig", "szlig"],
    l: ["amalg", "lg", "ntlg"],
    n: ["ang", "Aring", "aring", "backcong", "bcong", "cong", "eng", "Lang", "lang", "LeftCeiling", "loang", "nang", "ncong", "Rang", "rang", "RightCeiling", "ring", "roang", "sung", "Uring", "uring", "varnothing"],
    a: ["angmsdag", "vzigzag"],
    e: ["deg", "eg", "leg", "reg"],
    G: ["Gg", "nGg"],
    g: ["gg", "ggg"],
    E: ["lEg"],
    s: ["lesg"],
    m: ["lsimg", "simg"]
  };
  var f$1 = {
    a: ["af", "angmsdaf", "sigmaf"],
    p: ["Aopf", "aopf", "Bopf", "bopf", "Copf", "copf", "Dopf", "dopf", "Eopf", "eopf", "Fopf", "fopf", "Gopf", "gopf", "Hopf", "hopf", "Iopf", "iopf", "Jopf", "jopf", "Kopf", "kopf", "Lopf", "lopf", "Mopf", "mopf", "Nopf", "nopf", "Oopf", "oopf", "Popf", "popf", "Qopf", "qopf", "Ropf", "ropf", "Sopf", "sopf", "Topf", "topf", "Uopf", "uopf", "Vopf", "vopf", "Wopf", "wopf", "Xopf", "xopf", "Yopf", "yopf", "Zopf", "zopf"],
    i: ["dtrif", "ltrif", "rtrif", "utrif"],
    o: ["fnof", "imof", "orderof", "origof"],
    r: ["Fouriertrf", "Laplacetrf", "Mellintrf", "profsurf", "squarf", "sstarf", "starf", "zeetrf"],
    l: ["half"],
    f: ["iff"],
    z: ["lozf"],
    d: ["ordf"],
    u: ["squf"]
  };
  var r$1 = {
    f: ["Afr", "afr", "Bfr", "bfr", "Cfr", "cfr", "Dfr", "dfr", "Efr", "efr", "Ffr", "ffr", "Gfr", "gfr", "Hfr", "hfr", "Ifr", "ifr", "Jfr", "jfr", "Kfr", "kfr", "Lfr", "lfr", "Mfr", "mfr", "Nfr", "nfr", "Ofr", "ofr", "Pfr", "pfr", "Qfr", "qfr", "Rfr", "rfr", "Sfr", "sfr", "Tfr", "tfr", "Ufr", "ufr", "Vfr", "vfr", "Wfr", "wfr", "Xfr", "xfr", "Yfr", "yfr", "Zfr", "zfr"],
    c: ["Amacr", "amacr", "Ascr", "ascr", "Bscr", "bscr", "Cscr", "cscr", "Dscr", "dscr", "Emacr", "emacr", "Escr", "escr", "Fscr", "fscr", "Gscr", "gscr", "Hscr", "hscr", "Imacr", "imacr", "Iscr", "iscr", "Jscr", "jscr", "Kscr", "kscr", "Lscr", "lscr", "macr", "Mscr", "mscr", "Nscr", "nscr", "Omacr", "omacr", "Oscr", "oscr", "Pscr", "pscr", "Qscr", "qscr", "Rscr", "rscr", "Sscr", "sscr", "Tscr", "tscr", "Umacr", "umacr", "Uscr", "uscr", "Vscr", "vscr", "Wscr", "wscr", "Xscr", "xscr", "Yscr", "yscr", "Zscr", "zscr"],
    r: ["angzarr", "crarr", "cudarrr", "cularr", "curarr", "Darr", "dArr", "darr", "ddarr", "dharr", "duarr", "dzigrarr", "erarr", "gtrarr", "hArr", "harr", "hoarr", "lAarr", "Larr", "lArr", "larr", "lBarr", "lbarr", "llarr", "loarr", "lrarr", "ltlarr", "neArr", "nearr", "nhArr", "nharr", "nlArr", "nlarr", "nrArr", "nrarr", "nvHarr", "nvlArr", "nvrArr", "nwArr", "nwarr", "olarr", "orarr", "rAarr", "Rarr", "rArr", "rarr", "RBarr", "rBarr", "rbarr", "rlarr", "roarr", "rrarr", "seArr", "searr", "simrarr", "slarr", "srarr", "subrarr", "suplarr", "swArr", "swarr", "Uarr", "uArr", "uarr", "udarr", "uharr", "uuarr", "vArr", "varr", "xhArr", "xharr", "xlArr", "xlarr", "xrArr", "xrarr", "zigrarr"],
    i: ["apacir", "cir", "cirscir", "ecir", "gtcir", "harrcir", "ltcir", "midcir", "ocir", "ofcir", "olcir", "plusacir", "pluscir", "topcir", "Uarrocir"],
    a: ["bigstar", "brvbar", "dHar", "dollar", "DoubleVerticalBar", "DownArrowBar", "DownLeftVectorBar", "DownRightVectorBar", "duhar", "epar", "gtlPar", "hbar", "horbar", "ldrdhar", "ldrushar", "LeftArrowBar", "LeftDownVectorBar", "LeftTriangleBar", "LeftUpVectorBar", "LeftVectorBar", "lHar", "lopar", "lowbar", "lpar", "lrhar", "ltrPar", "lurdshar", "luruhar", "nesear", "nhpar", "NotDoubleVerticalBar", "NotLeftTriangleBar", "NotRightTriangleBar", "NotVerticalBar", "npar", "nspar", "nwnear", "ohbar", "opar", "ovbar", "OverBar", "par", "profalar", "rdldhar", "rHar", "RightArrowBar", "RightDownVectorBar", "RightTriangleBar", "RightUpVectorBar", "RightVectorBar", "rlhar", "ropar", "rpar", "ruluhar", "seswar", "solbar", "spar", "Star", "star", "swnwar", "timesbar", "udhar", "uHar", "UnderBar", "UpArrowBar", "Vbar", "vBar", "veebar", "Verbar", "verbar", "VerticalBar", "wedbar"],
    D: ["boxDr"],
    d: ["boxdr", "mldr", "nldr"],
    U: ["boxUr"],
    u: ["boxur", "natur"],
    V: ["boxVr"],
    v: ["boxvr"],
    s: ["copysr"],
    p: ["cuepr", "npr", "pr"],
    o: ["cupor", "DownLeftRightVector", "DownLeftTeeVector", "DownLeftVector", "DownRightTeeVector", "DownRightVector", "ldquor", "LeftDownTeeVector", "LeftDownVector", "LeftFloor", "LeftRightVector", "LeftTeeVector", "LeftUpDownVector", "LeftUpTeeVector", "LeftUpVector", "LeftVector", "lesdotor", "lfloor", "lsquor", "or", "oror", "rdquor", "rfloor", "RightDownTeeVector", "RightDownVector", "RightFloor", "RightTeeVector", "RightUpDownVector", "RightUpTeeVector", "RightUpVector", "RightVector", "rsquor", "VerticalSeparator"],
    e: ["Dagger", "dagger", "ddagger", "easter", "GreaterGreater", "LessEqualGreater", "LessGreater", "llcorner", "lrcorner", "marker", "NestedGreaterGreater", "NotGreater", "NotGreaterGreater", "NotLessGreater", "NotNestedGreaterGreater", "order", "ulcorner", "urcorner"],
    t: ["eqslantgtr", "lesseqgtr", "lesseqqgtr", "lessgtr", "ngtr"],
    O: ["Or"],
    P: ["Pr"],
    w: ["wr"]
  };
  var m$1 = {
    y: ["alefsym", "thetasym"],
    i: ["backsim", "bsim", "eqsim", "Esim", "esim", "gnsim", "gsim", "gtrsim", "larrsim", "lesssim", "lnsim", "lsim", "nesim", "ngsim", "nlsim", "nsim", "nvsim", "parsim", "plussim", "precnsim", "precsim", "prnsim", "prsim", "rarrsim", "scnsim", "scsim", "sim", "subsim", "succnsim", "succsim", "supsim", "thicksim", "thksim"],
    o: ["bottom"],
    s: ["ccupssm"],
    r: ["curarrm", "lrm"],
    a: ["diam"],
    u: ["Equilibrium", "num", "ReverseEquilibrium", "ReverseUpEquilibrium", "Sum", "sum", "trpezium", "UpEquilibrium"],
    I: ["Im"],
    h: ["ohm"],
    d: ["ordm"],
    p: ["pm"],
    l: ["rlm"]
  };
  var h$1 = {
    p: ["aleph", "angsph"],
    a: ["angmsdah"],
    s: ["Backslash", "circleddash", "dash", "hslash", "ldsh", "Lsh", "lsh", "mdash", "ndash", "nVDash", "nVdash", "nvDash", "nvdash", "odash", "Oslash", "oslash", "rdsh", "Rsh", "rsh", "VDash", "Vdash", "vDash", "vdash", "Vvdash"],
    t: ["beth", "daleth", "eth", "imath", "jmath", "wreath"],
    x: ["boxh"],
    V: ["boxVh"],
    v: ["boxvh"],
    k: ["planckh"],
    i: ["upsih"]
  };
  var a$1 = {
    h: ["Alpha", "alpha"],
    a: ["angmsdaa"],
    t: ["Beta", "beta", "Delta", "delta", "Eta", "eta", "iiota", "Iota", "iota", "Theta", "theta", "vartheta", "Zeta", "zeta"],
    l: ["Cedilla", "gla", "nabla"],
    m: ["comma", "digamma", "Gamma", "gamma", "InvisibleComma", "mcomma", "Sigma", "sigma", "varsigma"],
    p: ["Kappa", "kappa", "varkappa"],
    d: ["Lambda", "lambda"],
    c: ["ldca", "rdca"],
    v: ["notinva", "notniva"],
    g: ["Omega", "omega"],
    r: ["para"],
    e: ["toea"],
    s: ["tosa"]
  };
  var P$1 = {
    M: ["AMP"]
  };
  var p$1 = {
    m: ["amp", "asymp", "bump", "comp", "HumpDownHump", "mp", "nbump", "NotHumpDownHump"],
    a: ["ap", "bigcap", "Cap", "cap", "capcap", "cupbrcap", "CupCap", "cupcap", "gap", "gnap", "lap", "lnap", "Map", "map", "multimap", "mumap", "nap", "ncap", "NotCupCap", "nvap", "prap", "prnap", "rarrap", "scap", "scnap", "sqcap", "thkap", "xcap", "xmap"],
    u: ["bigcup", "bigsqcup", "bigtriangleup", "capbrcup", "capcup", "csup", "Cup", "cup", "cupcup", "leftharpoonup", "mapstoup", "ncup", "nsup", "rightharpoonup", "sqcup", "sqsup", "subsup", "Sup", "sup", "supsup", "vnsup", "xcup", "xsqcup"],
    r: ["cularrp", "operp", "perp", "sharp", "weierp"],
    o: ["dlcrop", "drcrop", "prop", "top", "ulcrop", "urcrop", "vprop"],
    s: ["emsp", "ensp", "hairsp", "nbsp", "numsp", "puncsp", "thinsp"],
    i: ["hellip", "vellip"],
    l: ["larrlp", "rarrlp"],
    c: ["mlcp"],
    h: ["smashp"],
    w: ["wp"]
  };
  var v$1 = {
    d: ["andv"],
    r: ["Barv", "orv", "vBarv"],
    y: ["bemptyv", "cemptyv", "demptyv", "emptyv", "laemptyv", "raemptyv"],
    i: ["bnequiv", "div", "epsiv", "equiv", "nequiv", "niv", "odiv", "phiv", "piv"],
    x: ["boxv"],
    h: ["Dashv", "dashv"],
    k: ["forkv", "plankv"],
    s: ["isinsv"],
    n: ["isinv"],
    a: ["kappav", "sigmav", "thetav"],
    t: ["nGtv", "nLtv"],
    o: ["rhov"]
  };
  var b$1 = {
    a: ["angmsdab", "Tab"],
    v: ["angrtvb", "notinvb", "notnivb"],
    l: ["bsolb", "solb"],
    u: ["bsolhsub", "csub", "lcub", "nsub", "rcub", "sqsub", "Sub", "sub", "subsub", "supdsub", "suphsub", "supsub", "vnsub"],
    r: ["larrb", "rarrb"],
    q: ["lsqb", "rsqb"],
    s: ["minusb", "plusb", "timesb", "trisb"],
    t: ["sdotb"]
  };
  var t$1 = {
    r: ["angrt", "imagpart", "npart", "part", "realpart", "Sqrt", "vangrt", "Vert", "vert"],
    s: ["angst", "ast", "circledast", "equest", "exist", "gtquest", "iquest", "lmoust", "lowast", "ltquest", "midast", "nexist", "oast", "quest", "rmoust"],
    n: ["awconint", "awint", "Cconint", "cent", "cirfnint", "complement", "Congruent", "Conint", "conint", "cwconint", "cwint", "Element", "fpartint", "geqslant", "iiiint", "iiint", "Int", "int", "leqslant", "ngeqslant", "nleqslant", "NotCongruent", "NotElement", "NotReverseElement", "npolint", "oint", "percnt", "pointint", "qint", "quatint", "ReverseElement", "rppolint", "scpolint", "tint"],
    o: ["bigodot", "bNot", "bnot", "bot", "capdot", "Cdot", "cdot", "CenterDot", "centerdot", "CircleDot", "congdot", "ctdot", "cupdot", "DiacriticalDot", "Dot", "dot", "DotDot", "doteqdot", "DoubleDot", "dtdot", "eDDot", "Edot", "eDot", "edot", "efDot", "egsdot", "elsdot", "erDot", "esdot", "Gdot", "gdot", "gesdot", "gtdot", "gtrdot", "Idot", "inodot", "isindot", "lesdot", "lessdot", "Lmidot", "lmidot", "ltdot", "mDDot", "middot", "ncongdot", "nedot", "Not", "not", "notindot", "odot", "quot", "sdot", "simdot", "subdot", "subedot", "supdot", "supedot", "tdot", "topbot", "tridot", "TripleDot", "utdot", "xodot", "Zdot", "zdot"],
    f: ["blacktriangleleft", "circlearrowleft", "curvearrowleft", "downharpoonleft", "looparrowleft", "mapstoleft", "ntriangleleft", "triangleleft", "upharpoonleft", "vartriangleleft"],
    h: ["blacktriangleright", "circlearrowright", "curvearrowright", "dfisht", "downharpoonright", "homtht", "lfisht", "looparrowright", "ntriangleright", "rfisht", "triangleright", "ufisht", "upharpoonright", "vartriangleright"],
    e: ["bullet", "caret", "emptyset", "LeftAngleBracket", "LeftDoubleBracket", "NotSquareSubset", "NotSquareSuperset", "NotSubset", "NotSuperset", "nsubset", "nsupset", "OverBracket", "RightAngleBracket", "RightDoubleBracket", "sqsubset", "sqsupset", "SquareSubset", "SquareSuperset", "Subset", "subset", "Superset", "Supset", "supset", "target", "UnderBracket"],
    i: ["clubsuit", "diamondsuit", "heartsuit", "it", "spadesuit"],
    a: ["commat", "flat", "Hat", "lat", "phmmat", "SuchThat"],
    c: ["Coproduct", "Product", "rect", "sect"],
    G: ["Gt", "nGt"],
    g: ["gt", "ngt", "nvgt", "ogt", "rpargt"],
    l: ["hamilt", "lparlt", "lt", "malt", "nlt", "nvlt", "olt", "submult", "supmult"],
    L: ["Lt", "nLt"],
    x: ["sext", "twixt"],
    m: ["smt"]
  };
  var n$1 = {
    o: ["Aogon", "aogon", "ApplyFunction", "backepsilon", "caron", "Ccaron", "ccaron", "Colon", "colon", "Dcaron", "dcaron", "Ecaron", "ecaron", "ecolon", "Eogon", "eogon", "Epsilon", "epsilon", "eqcolon", "expectation", "hercon", "Intersection", "Iogon", "iogon", "Lcaron", "lcaron", "Ncaron", "ncaron", "ogon", "Omicron", "omicron", "Proportion", "Rcaron", "rcaron", "Scaron", "scaron", "SquareIntersection", "SquareUnion", "straightepsilon", "Tcaron", "tcaron", "Union", "Uogon", "uogon", "Upsilon", "upsilon", "varepsilon", "Zcaron", "zcaron"],
    g: ["Assign"],
    e: ["between", "curren", "hyphen", "kgreen", "yen"],
    w: ["bigtriangledown", "blacktriangledown", "frown", "leftharpoondown", "mapstodown", "rightharpoondown", "sfrown", "triangledown"],
    f: ["compfn"],
    i: ["disin", "iinfin", "in", "infin", "isin", "notin", "nvinfin"],
    r: ["dlcorn", "drcorn", "thorn", "ulcorn", "urcorn"],
    a: ["lagran"],
    m: ["plusmn", "setmn", "ssetmn"]
  };
  var s$1 = {
    o: ["apos", "mstpos", "napos"],
    u: ["becaus", "bigoplus", "biguplus", "boxminus", "boxplus", "CircleMinus", "CirclePlus", "dotminus", "dotplus", "eplus", "loplus", "minus", "MinusPlus", "mnplus", "ominus", "oplus", "plus", "PlusMinus", "roplus", "setminus", "simplus", "smallsetminus", "subplus", "supplus", "triminus", "triplus", "UnionPlus", "uplus", "xoplus", "xuplus"],
    i: ["Bernoullis", "nis", "OverParenthesis", "UnderParenthesis", "xnis"],
    e: ["bigotimes", "boxtimes", "CircleTimes", "complexes", "divideontimes", "ges", "gesles", "Implies", "InvisibleTimes", "lates", "leftthreetimes", "les", "lesges", "lotimes", "ltimes", "nges", "nles", "NotPrecedes", "Otimes", "otimes", "Precedes", "primes", "rightthreetimes", "rotimes", "RoundImplies", "rtimes", "smtes", "spades", "times"],
    p: ["caps", "ccaps", "ccups", "cups", "sqcaps", "sqcups"],
    y: ["Cayleys"],
    b: ["clubs"],
    s: ["Cross", "cross", "eqslantless", "GreaterEqualLess", "GreaterLess", "gtreqless", "gtreqqless", "gtrless", "LessLess", "NestedLessLess", "nless", "NotGreaterLess", "NotLess", "NotLessLess", "NotNestedLessLess", "olcross"],
    m: ["diams"],
    w: ["downdownarrows", "leftleftarrows", "leftrightarrows", "rightleftarrows", "rightrightarrows", "upuparrows"],
    g: ["egs"],
    r: ["elinters", "integers"],
    l: ["els", "equals", "models", "naturals", "rationals", "reals"],
    t: ["Exists", "hearts", "nexists", "NotExists"],
    n: ["fltns", "isins", "leftrightharpoons", "quaternions", "rightleftharpoons", "strns"],
    f: ["larrbfs", "larrfs", "rarrbfs", "rarrfs"],
    d: ["NotSucceeds", "Succeeds"],
    a: ["otimesas"]
  };
  var x$1 = {
    o: ["approx", "boxbox", "gnapprox", "gtrapprox", "lessapprox", "lnapprox", "napprox", "precapprox", "precnapprox", "succapprox", "succnapprox", "thickapprox"],
    n: ["divonx"],
    r: ["rx"]
  };
  var q$1 = {
    e: ["approxeq", "asympeq", "backsimeq", "Bumpeq", "bumpeq", "circeq", "coloneq", "ddotseq", "doteq", "fallingdotseq", "geq", "gneq", "leq", "lneq", "ngeq", "nleq", "npreceq", "nsimeq", "nsubseteq", "nsucceq", "nsupseteq", "ntrianglelefteq", "ntrianglerighteq", "preccurlyeq", "preceq", "questeq", "risingdotseq", "simeq", "sqsubseteq", "sqsupseteq", "subseteq", "subsetneq", "succcurlyeq", "succeq", "supseteq", "supsetneq", "trianglelefteq", "triangleq", "trianglerighteq", "varsubsetneq", "varsupsetneq", "veeeq", "wedgeq"],
    q: ["geqq", "gneqq", "gvertneqq", "leqq", "lneqq", "lvertneqq", "ngeqq", "nleqq", "nsubseteqq", "nsupseteqq", "precneqq", "subseteqq", "subsetneqq", "succneqq", "supseteqq", "supsetneqq", "varsubsetneqq", "varsupsetneqq"]
  };
  var l$1 = {
    m: ["Auml", "auml", "Euml", "euml", "gsiml", "Iuml", "iuml", "Ouml", "ouml", "siml", "uml", "Uuml", "uuml", "Yuml", "yuml"],
    D: ["boxDl"],
    d: ["boxdl"],
    U: ["boxUl"],
    u: ["boxul", "lharul", "rharul"],
    V: ["boxVl"],
    v: ["boxvl"],
    o: ["bsol", "dsol", "gesdotol", "osol", "sol", "suphsol"],
    l: ["bull", "ell", "ForAll", "forall", "hybull", "ll"],
    i: ["Ccedil", "ccedil", "cedil", "Gcedil", "Kcedil", "kcedil", "lAtail", "latail", "Lcedil", "lcedil", "lceil", "leftarrowtail", "Ncedil", "ncedil", "permil", "rAtail", "ratail", "Rcedil", "rcedil", "rceil", "rightarrowtail", "Scedil", "scedil", "Tcedil", "tcedil"],
    a: ["ClockwiseContourIntegral", "ContourIntegral", "CounterClockwiseContourIntegral", "DotEqual", "DoubleContourIntegral", "Equal", "GreaterEqual", "GreaterFullEqual", "GreaterSlantEqual", "HumpEqual", "intcal", "Integral", "intercal", "LeftTriangleEqual", "LessFullEqual", "LessSlantEqual", "natural", "NotEqual", "NotGreaterEqual", "NotGreaterFullEqual", "NotGreaterSlantEqual", "NotHumpEqual", "NotLeftTriangleEqual", "NotLessEqual", "NotLessSlantEqual", "NotPrecedesEqual", "NotPrecedesSlantEqual", "NotRightTriangleEqual", "NotSquareSubsetEqual", "NotSquareSupersetEqual", "NotSubsetEqual", "NotSucceedsEqual", "NotSucceedsSlantEqual", "NotSupersetEqual", "NotTildeEqual", "NotTildeFullEqual", "PrecedesEqual", "PrecedesSlantEqual", "Proportional", "real", "RightTriangleEqual", "SquareSubsetEqual", "SquareSupersetEqual", "SubsetEqual", "SucceedsEqual", "SucceedsSlantEqual", "SupersetEqual", "TildeEqual", "TildeFullEqual"],
    r: ["cudarrl", "dharl", "uharl"],
    e: ["Del", "el", "gel", "gimel", "nparallel", "nshortparallel", "parallel", "prurel", "shortparallel"],
    s: ["eparsl", "eqvparsl", "frasl", "gesl", "nparsl", "parsl", "smeparsl"],
    c: ["excl", "iexcl"],
    E: ["gEl"],
    g: ["gl", "ntgl"],
    p: ["larrpl", "rarrpl"],
    t: ["larrtl", "Rarrtl", "rarrtl"],
    L: ["Ll", "nLl"],
    h: ["Vdashl"]
  };
  var k$1 = {
    r: ["bbrk", "bbrktbrk", "checkmark", "fork", "lbbrk", "lobrk", "pitchfork", "rbbrk", "robrk", "tbrk", "topfork"],
    n: ["blank", "pertenk"],
    c: ["block", "check", "lbrack", "planck", "rbrack"],
    o: ["Dstrok", "dstrok", "Hstrok", "hstrok", "Lstrok", "lstrok", "Tstrok", "tstrok"],
    e: ["Hacek"],
    h: ["intlarhk", "larrhk", "nearhk", "nwarhk", "rarrhk", "searhk", "swarhk"],
    l: ["lhblk", "uhblk"],
    a: ["NoBreak"]
  };
  var o$1 = {
    u: ["bdquo", "laquo", "ldquo", "lsaquo", "lsquo", "raquo", "rdquo", "rsaquo", "rsquo", "sbquo"],
    r: ["euro", "micro", "numero"],
    t: ["gesdoto", "lesdoto", "longmapsto", "mapsto", "propto", "varpropto"],
    h: ["mho", "Rho", "rho", "varrho"],
    d: ["plusdo"],
    w: ["plustwo"],
    i: ["ratio"]
  };
  var i$1 = {
    s: ["bepsi", "epsi", "Psi", "psi", "Upsi", "upsi"],
    m: ["bsemi", "semi"],
    h: ["Chi", "chi", "Phi", "phi", "straightphi", "varphi"],
    r: ["dtri", "lltri", "lrtri", "ltri", "nltri", "nrtri", "rtri", "rtriltri", "ultri", "urtri", "utri", "vltri", "vrtri", "xdtri", "xutri"],
    i: ["ii"],
    n: ["ni", "notni"],
    P: ["Pi"],
    p: ["pi", "varpi"],
    X: ["Xi"],
    x: ["xi"]
  };
  var u$1 = {
    o: ["bernou"],
    H: ["boxHu"],
    h: ["boxhu"],
    l: ["lbrkslu", "rbrkslu"],
    r: ["lharu", "rharu"],
    d: ["minusdu", "plusdu"],
    M: ["Mu"],
    m: ["mu"],
    N: ["Nu"],
    n: ["nu"],
    q: ["squ"],
    a: ["Tau", "tau"]
  };
  var w$1 = {
    o: ["bkarow", "dbkarow", "DoubleDownArrow", "DoubleLeftArrow", "DoubleLeftRightArrow", "DoubleLongLeftArrow", "DoubleLongLeftRightArrow", "DoubleLongRightArrow", "DoubleRightArrow", "DoubleUpArrow", "DoubleUpDownArrow", "DownArrow", "Downarrow", "downarrow", "DownArrowUpArrow", "DownTeeArrow", "drbkarow", "hksearow", "hkswarow", "hookleftarrow", "hookrightarrow", "LeftArrow", "Leftarrow", "leftarrow", "LeftArrowRightArrow", "LeftRightArrow", "Leftrightarrow", "leftrightarrow", "leftrightsquigarrow", "LeftTeeArrow", "Lleftarrow", "LongLeftArrow", "Longleftarrow", "longleftarrow", "LongLeftRightArrow", "Longleftrightarrow", "longleftrightarrow", "LongRightArrow", "Longrightarrow", "longrightarrow", "LowerLeftArrow", "LowerRightArrow", "nearrow", "nLeftarrow", "nleftarrow", "nLeftrightarrow", "nleftrightarrow", "nRightarrow", "nrightarrow", "nwarrow", "RightArrow", "Rightarrow", "rightarrow", "RightArrowLeftArrow", "rightsquigarrow", "RightTeeArrow", "Rrightarrow", "searrow", "ShortDownArrow", "ShortLeftArrow", "ShortRightArrow", "ShortUpArrow", "swarrow", "twoheadleftarrow", "twoheadrightarrow", "UpArrow", "Uparrow", "uparrow", "UpArrowDownArrow", "UpDownArrow", "Updownarrow", "updownarrow", "UpperLeftArrow", "UpperRightArrow", "UpTeeArrow"],
    r: ["harrw", "nrarrw", "rarrw"]
  };
  var L$1 = {
    D: ["boxDL"],
    d: ["boxdL"],
    U: ["boxUL"],
    u: ["boxuL"],
    V: ["boxVL"],
    v: ["boxvL"]
  };
  var R$1 = {
    D: ["boxDR"],
    d: ["boxdR", "circledR"],
    U: ["boxUR"],
    u: ["boxuR"],
    V: ["boxVR"],
    v: ["boxvR"]
  };
  var H$1 = {
    x: ["boxH"],
    V: ["boxVH"],
    v: ["boxvH"],
    T: ["ETH"]
  };
  var D$1 = {
    H: ["boxHD"],
    h: ["boxhD"],
    l: ["CapitalDifferentialD", "DifferentialD", "PartialD"],
    D: ["DD", "equivDD"]
  };
  var U$1 = {
    H: ["boxHU"],
    h: ["boxhU"]
  };
  var V$1 = {
    x: ["boxV"]
  };
  var S$1 = {
    d: ["circledS"],
    o: ["oS"]
  };
  var Y$1 = {
    P: ["COPY"]
  };
  var G$1 = {
    N: ["ENG"],
    E: ["REG"]
  };
  var j$1 = {
    l: ["glj"],
    w: ["zwj"],
    n: ["zwnj"]
  };
  var T$1 = {
    G: ["GT"],
    L: ["LT"],
    O: ["QUOT"]
  };
  var I$1 = {
    y: ["ImaginaryI"]
  };
  var z$1 = {
    o: ["loz"]
  };
  var N$1 = {
    R: ["THORN"]
  };
  var endsWith = {
    "1": {
      p: ["sup1"]
    },
    "2": {
      "1": ["blk12", "frac12"],
      p: ["sup2"]
    },
    "3": {
      "1": ["emsp13", "frac13"],
      "2": ["frac23"],
      p: ["sup3"]
    },
    "4": {
      "1": ["blk14", "emsp14", "frac14"],
      "3": ["blk34", "frac34"],
      e: ["there4"]
    },
    "5": {
      "1": ["frac15"],
      "2": ["frac25"],
      "3": ["frac35"],
      "4": ["frac45"]
    },
    "6": {
      "1": ["frac16"],
      "5": ["frac56"]
    },
    "8": {
      "1": ["frac18"],
      "3": ["frac38"],
      "5": ["frac58"],
      "7": ["frac78"]
    },
    e: e$1,
    c: c$1,
    d: d$1,
    E: E$1,
    y: y$1,
    g: g$1,
    f: f$1,
    r: r$1,
    m: m$1,
    h: h$1,
    a: a$1,
    P: P$1,
    p: p$1,
    v: v$1,
    b: b$1,
    t: t$1,
    n: n$1,
    s: s$1,
    x: x$1,
    q: q$1,
    l: l$1,
    k: k$1,
    o: o$1,
    i: i$1,
    u: u$1,
    w: w$1,
    L: L$1,
    R: R$1,
    H: H$1,
    D: D$1,
    U: U$1,
    V: V$1,
    S: S$1,
    Y: Y$1,
    G: G$1,
    j: j$1,
    T: T$1,
    I: I$1,
    z: z$1,
    N: N$1
  };
  var a$2 = {
    a: ["aacute"],
    b: ["abreve"],
    c: ["ac", "acd", "ace", "acirc", "acute", "acy"],
    e: ["aelig"],
    f: ["af", "afr"],
    g: ["agrave"],
    l: ["alefsym", "aleph", "alpha"],
    m: ["amacr", "amalg", "amp"],
    n: ["and", "andand", "andd", "andslope", "andv", "ang", "ange", "angle", "angmsd", "angmsdaa", "angmsdab", "angmsdac", "angmsdad", "angmsdae", "angmsdaf", "angmsdag", "angmsdah", "angrt", "angrtvb", "angrtvbd", "angsph", "angst", "angzarr"],
    o: ["aogon", "aopf"],
    p: ["ap", "apacir", "ape", "apid", "apos", "applyfunction", "approx", "approxeq"],
    r: ["aring"],
    s: ["ascr", "assign", "ast", "asymp", "asympeq"],
    t: ["atilde"],
    u: ["auml"],
    w: ["awconint", "awint"]
  };
  var b$2 = {
    a: ["backcong", "backepsilon", "backprime", "backsim", "backsimeq", "backslash", "barv", "barvee", "barwed", "barwedge"],
    b: ["bbrk", "bbrktbrk"],
    c: ["bcong", "bcy"],
    d: ["bdquo"],
    e: ["becaus", "because", "bemptyv", "bepsi", "bernou", "bernoullis", "beta", "beth", "between"],
    f: ["bfr"],
    i: ["bigcap", "bigcirc", "bigcup", "bigodot", "bigoplus", "bigotimes", "bigsqcup", "bigstar", "bigtriangledown", "bigtriangleup", "biguplus", "bigvee", "bigwedge"],
    k: ["bkarow"],
    l: ["blacklozenge", "blacksquare", "blacktriangle", "blacktriangledown", "blacktriangleleft", "blacktriangleright", "blank", "blk12", "blk14", "blk34", "block"],
    n: ["bne", "bnequiv", "bnot"],
    o: ["bopf", "bot", "bottom", "bowtie", "boxbox", "boxdl", "boxdr", "boxh", "boxhd", "boxhu", "boxminus", "boxplus", "boxtimes", "boxul", "boxur", "boxv", "boxvh", "boxvl", "boxvr"],
    p: ["bprime"],
    r: ["breve", "brvbar"],
    s: ["bscr", "bsemi", "bsim", "bsime", "bsol", "bsolb", "bsolhsub"],
    u: ["bull", "bullet", "bump", "bumpe", "bumpeq"]
  };
  var c$2 = {
    a: ["cacute", "cap", "capand", "capbrcup", "capcap", "capcup", "capdot", "capitaldifferentiald", "caps", "caret", "caron", "cayleys"],
    c: ["ccaps", "ccaron", "ccedil", "ccirc", "cconint", "ccups", "ccupssm"],
    d: ["cdot"],
    e: ["cedil", "cedilla", "cemptyv", "cent", "centerdot"],
    f: ["cfr"],
    h: ["chcy", "check", "checkmark", "chi"],
    i: ["cir", "circ", "circeq", "circlearrowleft", "circlearrowright", "circledast", "circledcirc", "circleddash", "circledot", "circledr", "circleds", "circleminus", "circleplus", "circletimes", "cire", "cirfnint", "cirmid", "cirscir"],
    l: ["clockwisecontourintegral", "closecurlydoublequote", "closecurlyquote", "clubs", "clubsuit"],
    o: ["colon", "colone", "coloneq", "comma", "commat", "comp", "compfn", "complement", "complexes", "cong", "congdot", "congruent", "conint", "contourintegral", "copf", "coprod", "coproduct", "copy", "copysr", "counterclockwisecontourintegral"],
    r: ["crarr", "cross"],
    s: ["cscr", "csub", "csube", "csup", "csupe"],
    t: ["ctdot"],
    u: ["cudarrl", "cudarrr", "cuepr", "cuesc", "cularr", "cularrp", "cup", "cupbrcap", "cupcap", "cupcup", "cupdot", "cupor", "cups", "curarr", "curarrm", "curlyeqprec", "curlyeqsucc", "curlyvee", "curlywedge", "curren", "curvearrowleft", "curvearrowright", "cuvee", "cuwed"],
    w: ["cwconint", "cwint"],
    y: ["cylcty"]
  };
  var d$2 = {
    a: ["dagger", "daleth", "darr", "dash", "dashv"],
    b: ["dbkarow", "dblac"],
    c: ["dcaron", "dcy"],
    d: ["dd", "ddagger", "ddarr", "ddotrahd", "ddotseq"],
    e: ["deg", "del", "delta", "demptyv"],
    f: ["dfisht", "dfr"],
    h: ["dhar", "dharl", "dharr"],
    i: ["diacriticalacute", "diacriticaldot", "diacriticaldoubleacute", "diacriticalgrave", "diacriticaltilde", "diam", "diamond", "diamondsuit", "diams", "die", "differentiald", "digamma", "disin", "div", "divide", "divideontimes", "divonx"],
    j: ["djcy"],
    l: ["dlcorn", "dlcrop"],
    o: ["dollar", "dopf", "dot", "dotdot", "doteq", "doteqdot", "dotequal", "dotminus", "dotplus", "dotsquare", "doublebarwedge", "doublecontourintegral", "doubledot", "doubledownarrow", "doubleleftarrow", "doubleleftrightarrow", "doublelefttee", "doublelongleftarrow", "doublelongleftrightarrow", "doublelongrightarrow", "doublerightarrow", "doublerighttee", "doubleuparrow", "doubleupdownarrow", "doubleverticalbar", "downarrow", "downarrowbar", "downarrowuparrow", "downbreve", "downdownarrows", "downharpoonleft", "downharpoonright", "downleftrightvector", "downleftteevector", "downleftvector", "downleftvectorbar", "downrightteevector", "downrightvector", "downrightvectorbar", "downtee", "downteearrow"],
    r: ["drbkarow", "drcorn", "drcrop"],
    s: ["dscr", "dscy", "dsol", "dstrok"],
    t: ["dtdot", "dtri", "dtrif"],
    u: ["duarr", "duhar"],
    w: ["dwangle"],
    z: ["dzcy", "dzigrarr"]
  };
  var e$2 = {
    a: ["eacute", "easter"],
    c: ["ecaron", "ecir", "ecirc", "ecolon", "ecy"],
    d: ["eddot", "edot"],
    e: ["ee"],
    f: ["efdot", "efr"],
    g: ["eg", "egrave", "egs", "egsdot"],
    l: ["el", "element", "elinters", "ell", "els", "elsdot"],
    m: ["emacr", "empty", "emptyset", "emptysmallsquare", "emptyv", "emptyverysmallsquare", "emsp", "emsp13", "emsp14"],
    n: ["eng", "ensp"],
    o: ["eogon", "eopf"],
    p: ["epar", "eparsl", "eplus", "epsi", "epsilon", "epsiv"],
    q: ["eqcirc", "eqcolon", "eqsim", "eqslantgtr", "eqslantless", "equal", "equals", "equaltilde", "equest", "equilibrium", "equiv", "equivdd", "eqvparsl"],
    r: ["erarr", "erdot"],
    s: ["escr", "esdot", "esim"],
    t: ["eta", "eth"],
    u: ["euml", "euro"],
    x: ["excl", "exist", "exists", "expectation", "exponentiale"]
  };
  var f$2 = {
    a: ["fallingdotseq"],
    c: ["fcy"],
    e: ["female"],
    f: ["ffilig", "fflig", "ffllig", "ffr"],
    i: ["filig", "filledsmallsquare", "filledverysmallsquare"],
    j: ["fjlig"],
    l: ["flat", "fllig", "fltns"],
    n: ["fnof"],
    o: ["fopf", "forall", "fork", "forkv", "fouriertrf"],
    p: ["fpartint"],
    r: ["frac12", "frac13", "frac14", "frac15", "frac16", "frac18", "frac23", "frac25", "frac34", "frac35", "frac38", "frac45", "frac56", "frac58", "frac78", "frasl", "frown"],
    s: ["fscr"]
  };
  var g$2 = {
    a: ["gacute", "gamma", "gammad", "gap"],
    b: ["gbreve"],
    c: ["gcedil", "gcirc", "gcy"],
    d: ["gdot"],
    e: ["ge", "gel", "geq", "geqq", "geqslant", "ges", "gescc", "gesdot", "gesdoto", "gesdotol", "gesl", "gesles"],
    f: ["gfr"],
    g: ["gg", "ggg"],
    i: ["gimel"],
    j: ["gjcy"],
    l: ["gl", "gla", "gle", "glj"],
    n: ["gnap", "gnapprox", "gne", "gneq", "gneqq", "gnsim"],
    o: ["gopf"],
    r: ["grave", "greaterequal", "greaterequalless", "greaterfullequal", "greatergreater", "greaterless", "greaterslantequal", "greatertilde"],
    s: ["gscr", "gsim", "gsime", "gsiml"],
    t: ["gt", "gtcc", "gtcir", "gtdot", "gtlpar", "gtquest", "gtrapprox", "gtrarr", "gtrdot", "gtreqless", "gtreqqless", "gtrless", "gtrsim"],
    v: ["gvertneqq", "gvne"]
  };
  var h$2 = {
    a: ["hacek", "hairsp", "half", "hamilt", "hardcy", "harr", "harrcir", "harrw", "hat"],
    b: ["hbar"],
    c: ["hcirc"],
    e: ["hearts", "heartsuit", "hellip", "hercon"],
    f: ["hfr"],
    i: ["hilbertspace"],
    k: ["hksearow", "hkswarow"],
    o: ["hoarr", "homtht", "hookleftarrow", "hookrightarrow", "hopf", "horbar", "horizontalline"],
    s: ["hscr", "hslash", "hstrok"],
    u: ["humpdownhump", "humpequal"],
    y: ["hybull", "hyphen"]
  };
  var i$2 = {
    a: ["iacute"],
    c: ["ic", "icirc", "icy"],
    d: ["idot"],
    e: ["iecy", "iexcl"],
    f: ["iff", "ifr"],
    g: ["igrave"],
    i: ["ii", "iiiint", "iiint", "iinfin", "iiota"],
    j: ["ijlig"],
    m: ["im", "imacr", "image", "imaginaryi", "imagline", "imagpart", "imath", "imof", "imped", "implies"],
    n: ["in", "incare", "infin", "infintie", "inodot", "int", "intcal", "integers", "integral", "intercal", "intersection", "intlarhk", "intprod", "invisiblecomma", "invisibletimes"],
    o: ["iocy", "iogon", "iopf", "iota"],
    p: ["iprod"],
    q: ["iquest"],
    s: ["iscr", "isin", "isindot", "isine", "isins", "isinsv", "isinv"],
    t: ["it", "itilde"],
    u: ["iukcy", "iuml"]
  };
  var j$2 = {
    c: ["jcirc", "jcy"],
    f: ["jfr"],
    m: ["jmath"],
    o: ["jopf"],
    s: ["jscr", "jsercy"],
    u: ["jukcy"]
  };
  var k$2 = {
    a: ["kappa", "kappav"],
    c: ["kcedil", "kcy"],
    f: ["kfr"],
    g: ["kgreen"],
    h: ["khcy"],
    j: ["kjcy"],
    o: ["kopf"],
    s: ["kscr"]
  };
  var l$2 = {
    a: ["laarr", "lacute", "laemptyv", "lagran", "lambda", "lang", "langd", "langle", "lap", "laplacetrf", "laquo", "larr", "larrb", "larrbfs", "larrfs", "larrhk", "larrlp", "larrpl", "larrsim", "larrtl", "lat", "latail", "late", "lates"],
    b: ["lbarr", "lbbrk", "lbrace", "lbrack", "lbrke", "lbrksld", "lbrkslu"],
    c: ["lcaron", "lcedil", "lceil", "lcub", "lcy"],
    d: ["ldca", "ldquo", "ldquor", "ldrdhar", "ldrushar", "ldsh"],
    e: ["le", "leftanglebracket", "leftarrow", "leftarrowbar", "leftarrowrightarrow", "leftarrowtail", "leftceiling", "leftdoublebracket", "leftdownteevector", "leftdownvector", "leftdownvectorbar", "leftfloor", "leftharpoondown", "leftharpoonup", "leftleftarrows", "leftrightarrow", "leftrightarrows", "leftrightharpoons", "leftrightsquigarrow", "leftrightvector", "lefttee", "leftteearrow", "leftteevector", "leftthreetimes", "lefttriangle", "lefttrianglebar", "lefttriangleequal", "leftupdownvector", "leftupteevector", "leftupvector", "leftupvectorbar", "leftvector", "leftvectorbar", "leg", "leq", "leqq", "leqslant", "les", "lescc", "lesdot", "lesdoto", "lesdotor", "lesg", "lesges", "lessapprox", "lessdot", "lesseqgtr", "lesseqqgtr", "lessequalgreater", "lessfullequal", "lessgreater", "lessgtr", "lessless", "lesssim", "lessslantequal", "lesstilde"],
    f: ["lfisht", "lfloor", "lfr"],
    g: ["lg", "lge"],
    h: ["lhar", "lhard", "lharu", "lharul", "lhblk"],
    j: ["ljcy"],
    l: ["ll", "llarr", "llcorner", "lleftarrow", "llhard", "lltri"],
    m: ["lmidot", "lmoust", "lmoustache"],
    n: ["lnap", "lnapprox", "lne", "lneq", "lneqq", "lnsim"],
    o: ["loang", "loarr", "lobrk", "longleftarrow", "longleftrightarrow", "longmapsto", "longrightarrow", "looparrowleft", "looparrowright", "lopar", "lopf", "loplus", "lotimes", "lowast", "lowbar", "lowerleftarrow", "lowerrightarrow", "loz", "lozenge", "lozf"],
    p: ["lpar", "lparlt"],
    r: ["lrarr", "lrcorner", "lrhar", "lrhard", "lrm", "lrtri"],
    s: ["lsaquo", "lscr", "lsh", "lsim", "lsime", "lsimg", "lsqb", "lsquo", "lsquor", "lstrok"],
    t: ["lt", "ltcc", "ltcir", "ltdot", "lthree", "ltimes", "ltlarr", "ltquest", "ltri", "ltrie", "ltrif", "ltrpar"],
    u: ["lurdshar", "luruhar"],
    v: ["lvertneqq", "lvne"]
  };
  var m$2 = {
    a: ["macr", "male", "malt", "maltese", "map", "mapsto", "mapstodown", "mapstoleft", "mapstoup", "marker"],
    c: ["mcomma", "mcy"],
    d: ["mdash", "mddot"],
    e: ["measuredangle", "mediumspace", "mellintrf"],
    f: ["mfr"],
    h: ["mho"],
    i: ["micro", "mid", "midast", "midcir", "middot", "minus", "minusb", "minusd", "minusdu", "minusplus"],
    l: ["mlcp", "mldr"],
    n: ["mnplus"],
    o: ["models", "mopf"],
    p: ["mp"],
    s: ["mscr", "mstpos"],
    u: ["mu", "multimap", "mumap"]
  };
  var n$2 = {
    a: ["nabla", "nacute", "nang", "nap", "nape", "napid", "napos", "napprox", "natur", "natural", "naturals"],
    b: ["nbsp", "nbump", "nbumpe"],
    c: ["ncap", "ncaron", "ncedil", "ncong", "ncongdot", "ncup", "ncy"],
    d: ["ndash"],
    e: ["ne", "nearhk", "nearr", "nearrow", "nedot", "negativemediumspace", "negativethickspace", "negativethinspace", "negativeverythinspace", "nequiv", "nesear", "nesim", "nestedgreatergreater", "nestedlessless", "newline", "nexist", "nexists"],
    f: ["nfr"],
    g: ["nge", "ngeq", "ngeqq", "ngeqslant", "nges", "ngg", "ngsim", "ngt", "ngtr", "ngtv"],
    h: ["nharr", "nhpar"],
    i: ["ni", "nis", "nisd", "niv"],
    j: ["njcy"],
    l: ["nlarr", "nldr", "nle", "nleftarrow", "nleftrightarrow", "nleq", "nleqq", "nleqslant", "nles", "nless", "nll", "nlsim", "nlt", "nltri", "nltrie", "nltv"],
    m: ["nmid"],
    o: ["nobreak", "nonbreakingspace", "nopf", "not", "notcongruent", "notcupcap", "notdoubleverticalbar", "notelement", "notequal", "notequaltilde", "notexists", "notgreater", "notgreaterequal", "notgreaterfullequal", "notgreatergreater", "notgreaterless", "notgreaterslantequal", "notgreatertilde", "nothumpdownhump", "nothumpequal", "notin", "notindot", "notine", "notinva", "notinvb", "notinvc", "notlefttriangle", "notlefttrianglebar", "notlefttriangleequal", "notless", "notlessequal", "notlessgreater", "notlessless", "notlessslantequal", "notlesstilde", "notnestedgreatergreater", "notnestedlessless", "notni", "notniva", "notnivb", "notnivc", "notprecedes", "notprecedesequal", "notprecedesslantequal", "notreverseelement", "notrighttriangle", "notrighttrianglebar", "notrighttriangleequal", "notsquaresubset", "notsquaresubsetequal", "notsquaresuperset", "notsquaresupersetequal", "notsubset", "notsubsetequal", "notsucceeds", "notsucceedsequal", "notsucceedsslantequal", "notsucceedstilde", "notsuperset", "notsupersetequal", "nottilde", "nottildeequal", "nottildefullequal", "nottildetilde", "notverticalbar"],
    p: ["npar", "nparallel", "nparsl", "npart", "npolint", "npr", "nprcue", "npre", "nprec", "npreceq"],
    r: ["nrarr", "nrarrc", "nrarrw", "nrightarrow", "nrtri", "nrtrie"],
    s: ["nsc", "nsccue", "nsce", "nscr", "nshortmid", "nshortparallel", "nsim", "nsime", "nsimeq", "nsmid", "nspar", "nsqsube", "nsqsupe", "nsub", "nsube", "nsubset", "nsubseteq", "nsubseteqq", "nsucc", "nsucceq", "nsup", "nsupe", "nsupset", "nsupseteq", "nsupseteqq"],
    t: ["ntgl", "ntilde", "ntlg", "ntriangleleft", "ntrianglelefteq", "ntriangleright", "ntrianglerighteq"],
    u: ["nu", "num", "numero", "numsp"],
    v: ["nvap", "nvdash", "nvge", "nvgt", "nvharr", "nvinfin", "nvlarr", "nvle", "nvlt", "nvltrie", "nvrarr", "nvrtrie", "nvsim"],
    w: ["nwarhk", "nwarr", "nwarrow", "nwnear"]
  };
  var o$2 = {
    a: ["oacute", "oast"],
    c: ["ocir", "ocirc", "ocy"],
    d: ["odash", "odblac", "odiv", "odot", "odsold"],
    e: ["oelig"],
    f: ["ofcir", "ofr"],
    g: ["ogon", "ograve", "ogt"],
    h: ["ohbar", "ohm"],
    i: ["oint"],
    l: ["olarr", "olcir", "olcross", "oline", "olt"],
    m: ["omacr", "omega", "omicron", "omid", "ominus"],
    o: ["oopf"],
    p: ["opar", "opencurlydoublequote", "opencurlyquote", "operp", "oplus"],
    r: ["or", "orarr", "ord", "order", "orderof", "ordf", "ordm", "origof", "oror", "orslope", "orv"],
    s: ["os", "oscr", "oslash", "osol"],
    t: ["otilde", "otimes", "otimesas"],
    u: ["ouml"],
    v: ["ovbar", "overbar", "overbrace", "overbracket", "overparenthesis"]
  };
  var p$2 = {
    a: ["par", "para", "parallel", "parsim", "parsl", "part", "partiald"],
    c: ["pcy"],
    e: ["percnt", "period", "permil", "perp", "pertenk"],
    f: ["pfr"],
    h: ["phi", "phiv", "phmmat", "phone"],
    i: ["pi", "pitchfork", "piv"],
    l: ["planck", "planckh", "plankv", "plus", "plusacir", "plusb", "pluscir", "plusdo", "plusdu", "pluse", "plusminus", "plusmn", "plussim", "plustwo"],
    m: ["pm"],
    o: ["poincareplane", "pointint", "popf", "pound"],
    r: ["pr", "prap", "prcue", "pre", "prec", "precapprox", "preccurlyeq", "precedes", "precedesequal", "precedesslantequal", "precedestilde", "preceq", "precnapprox", "precneqq", "precnsim", "precsim", "prime", "primes", "prnap", "prne", "prnsim", "prod", "product", "profalar", "profline", "profsurf", "prop", "proportion", "proportional", "propto", "prsim", "prurel"],
    s: ["pscr", "psi"],
    u: ["puncsp"]
  };
  var q$2 = {
    f: ["qfr"],
    i: ["qint"],
    o: ["qopf"],
    p: ["qprime"],
    s: ["qscr"],
    u: ["quaternions", "quatint", "quest", "questeq", "quot"]
  };
  var r$2 = {
    a: ["raarr", "race", "racute", "radic", "raemptyv", "rang", "rangd", "range", "rangle", "raquo", "rarr", "rarrap", "rarrb", "rarrbfs", "rarrc", "rarrfs", "rarrhk", "rarrlp", "rarrpl", "rarrsim", "rarrtl", "rarrw", "ratail", "ratio", "rationals"],
    b: ["rbarr", "rbbrk", "rbrace", "rbrack", "rbrke", "rbrksld", "rbrkslu"],
    c: ["rcaron", "rcedil", "rceil", "rcub", "rcy"],
    d: ["rdca", "rdldhar", "rdquo", "rdquor", "rdsh"],
    e: ["re", "real", "realine", "realpart", "reals", "rect", "reg", "reverseelement", "reverseequilibrium", "reverseupequilibrium"],
    f: ["rfisht", "rfloor", "rfr"],
    h: ["rhar", "rhard", "rharu", "rharul", "rho", "rhov"],
    i: ["rightanglebracket", "rightarrow", "rightarrowbar", "rightarrowleftarrow", "rightarrowtail", "rightceiling", "rightdoublebracket", "rightdownteevector", "rightdownvector", "rightdownvectorbar", "rightfloor", "rightharpoondown", "rightharpoonup", "rightleftarrows", "rightleftharpoons", "rightrightarrows", "rightsquigarrow", "righttee", "rightteearrow", "rightteevector", "rightthreetimes", "righttriangle", "righttrianglebar", "righttriangleequal", "rightupdownvector", "rightupteevector", "rightupvector", "rightupvectorbar", "rightvector", "rightvectorbar", "ring", "risingdotseq"],
    l: ["rlarr", "rlhar", "rlm"],
    m: ["rmoust", "rmoustache"],
    n: ["rnmid"],
    o: ["roang", "roarr", "robrk", "ropar", "ropf", "roplus", "rotimes", "roundimplies"],
    p: ["rpar", "rpargt", "rppolint"],
    r: ["rrarr", "rrightarrow"],
    s: ["rsaquo", "rscr", "rsh", "rsqb", "rsquo", "rsquor"],
    t: ["rthree", "rtimes", "rtri", "rtrie", "rtrif", "rtriltri"],
    u: ["ruledelayed", "ruluhar"],
    x: ["rx"]
  };
  var s$2 = {
    a: ["sacute"],
    b: ["sbquo"],
    c: ["sc", "scap", "scaron", "sccue", "sce", "scedil", "scirc", "scnap", "scne", "scnsim", "scpolint", "scsim", "scy"],
    d: ["sdot", "sdotb", "sdote"],
    e: ["searhk", "searr", "searrow", "sect", "semi", "seswar", "setminus", "setmn", "sext"],
    f: ["sfr", "sfrown"],
    h: ["sharp", "shchcy", "shcy", "shortdownarrow", "shortleftarrow", "shortmid", "shortparallel", "shortrightarrow", "shortuparrow", "shy"],
    i: ["sigma", "sigmaf", "sigmav", "sim", "simdot", "sime", "simeq", "simg", "simge", "siml", "simle", "simne", "simplus", "simrarr"],
    l: ["slarr"],
    m: ["smallcircle", "smallsetminus", "smashp", "smeparsl", "smid", "smile", "smt", "smte", "smtes"],
    o: ["softcy", "sol", "solb", "solbar", "sopf"],
    p: ["spades", "spadesuit", "spar"],
    q: ["sqcap", "sqcaps", "sqcup", "sqcups", "sqrt", "sqsub", "sqsube", "sqsubset", "sqsubseteq", "sqsup", "sqsupe", "sqsupset", "sqsupseteq", "squ", "square", "squareintersection", "squaresubset", "squaresubsetequal", "squaresuperset", "squaresupersetequal", "squareunion", "squarf", "squf"],
    r: ["srarr"],
    s: ["sscr", "ssetmn", "ssmile", "sstarf"],
    t: ["star", "starf", "straightepsilon", "straightphi", "strns"],
    u: ["sub", "subdot", "sube", "subedot", "submult", "subne", "subplus", "subrarr", "subset", "subseteq", "subseteqq", "subsetequal", "subsetneq", "subsetneqq", "subsim", "subsub", "subsup", "succ", "succapprox", "succcurlyeq", "succeeds", "succeedsequal", "succeedsslantequal", "succeedstilde", "succeq", "succnapprox", "succneqq", "succnsim", "succsim", "suchthat", "sum", "sung", "sup", "sup1", "sup2", "sup3", "supdot", "supdsub", "supe", "supedot", "superset", "supersetequal", "suphsol", "suphsub", "suplarr", "supmult", "supne", "supplus", "supset", "supseteq", "supseteqq", "supsetneq", "supsetneqq", "supsim", "supsub", "supsup"],
    w: ["swarhk", "swarr", "swarrow", "swnwar"],
    z: ["szlig"]
  };
  var t$2 = {
    a: ["tab", "target", "tau"],
    b: ["tbrk"],
    c: ["tcaron", "tcedil", "tcy"],
    d: ["tdot"],
    e: ["telrec"],
    f: ["tfr"],
    h: ["there4", "therefore", "theta", "thetasym", "thetav", "thickapprox", "thicksim", "thickspace", "thinsp", "thinspace", "thkap", "thksim", "thorn"],
    i: ["tilde", "tildeequal", "tildefullequal", "tildetilde", "times", "timesb", "timesbar", "timesd", "tint"],
    o: ["toea", "top", "topbot", "topcir", "topf", "topfork", "tosa"],
    p: ["tprime"],
    r: ["trade", "triangle", "triangledown", "triangleleft", "trianglelefteq", "triangleq", "triangleright", "trianglerighteq", "tridot", "trie", "triminus", "tripledot", "triplus", "trisb", "tritime", "trpezium"],
    s: ["tscr", "tscy", "tshcy", "tstrok"],
    w: ["twixt", "twoheadleftarrow", "twoheadrightarrow"]
  };
  var u$2 = {
    a: ["uacute", "uarr", "uarrocir"],
    b: ["ubrcy", "ubreve"],
    c: ["ucirc", "ucy"],
    d: ["udarr", "udblac", "udhar"],
    f: ["ufisht", "ufr"],
    g: ["ugrave"],
    h: ["uhar", "uharl", "uharr", "uhblk"],
    l: ["ulcorn", "ulcorner", "ulcrop", "ultri"],
    m: ["umacr", "uml"],
    n: ["underbar", "underbrace", "underbracket", "underparenthesis", "union", "unionplus"],
    o: ["uogon", "uopf"],
    p: ["uparrow", "uparrowbar", "uparrowdownarrow", "updownarrow", "upequilibrium", "upharpoonleft", "upharpoonright", "uplus", "upperleftarrow", "upperrightarrow", "upsi", "upsih", "upsilon", "uptee", "upteearrow", "upuparrows"],
    r: ["urcorn", "urcorner", "urcrop", "uring", "urtri"],
    s: ["uscr"],
    t: ["utdot", "utilde", "utri", "utrif"],
    u: ["uuarr", "uuml"],
    w: ["uwangle"]
  };
  var v$2 = {
    a: ["vangrt", "varepsilon", "varkappa", "varnothing", "varphi", "varpi", "varpropto", "varr", "varrho", "varsigma", "varsubsetneq", "varsubsetneqq", "varsupsetneq", "varsupsetneqq", "vartheta", "vartriangleleft", "vartriangleright"],
    b: ["vbar", "vbarv"],
    c: ["vcy"],
    d: ["vdash", "vdashl"],
    e: ["vee", "veebar", "veeeq", "vellip", "verbar", "vert", "verticalbar", "verticalline", "verticalseparator", "verticaltilde", "verythinspace"],
    f: ["vfr"],
    l: ["vltri"],
    n: ["vnsub", "vnsup"],
    o: ["vopf"],
    p: ["vprop"],
    r: ["vrtri"],
    s: ["vscr", "vsubne", "vsupne"],
    v: ["vvdash"],
    z: ["vzigzag"]
  };
  var w$2 = {
    c: ["wcirc"],
    e: ["wedbar", "wedge", "wedgeq", "weierp"],
    f: ["wfr"],
    o: ["wopf"],
    p: ["wp"],
    r: ["wr", "wreath"],
    s: ["wscr"]
  };
  var x$2 = {
    c: ["xcap", "xcirc", "xcup"],
    d: ["xdtri"],
    f: ["xfr"],
    h: ["xharr"],
    i: ["xi"],
    l: ["xlarr"],
    m: ["xmap"],
    n: ["xnis"],
    o: ["xodot", "xopf", "xoplus", "xotime"],
    r: ["xrarr"],
    s: ["xscr", "xsqcup"],
    u: ["xuplus", "xutri"],
    v: ["xvee"],
    w: ["xwedge"]
  };
  var y$2 = {
    a: ["yacute", "yacy"],
    c: ["ycirc", "ycy"],
    e: ["yen"],
    f: ["yfr"],
    i: ["yicy"],
    o: ["yopf"],
    s: ["yscr"],
    u: ["yucy", "yuml"]
  };
  var z$2 = {
    a: ["zacute"],
    c: ["zcaron", "zcy"],
    d: ["zdot"],
    e: ["zeetrf", "zerowidthspace", "zeta"],
    f: ["zfr"],
    h: ["zhcy"],
    i: ["zigrarr"],
    o: ["zopf"],
    s: ["zscr"],
    w: ["zwj", "zwnj"]
  };
  var startsWithCaseInsensitive = {
    a: a$2,
    b: b$2,
    c: c$2,
    d: d$2,
    e: e$2,
    f: f$2,
    g: g$2,
    h: h$2,
    i: i$2,
    j: j$2,
    k: k$2,
    l: l$2,
    m: m$2,
    n: n$2,
    o: o$2,
    p: p$2,
    q: q$2,
    r: r$2,
    s: s$2,
    t: t$2,
    u: u$2,
    v: v$2,
    w: w$2,
    x: x$2,
    y: y$2,
    z: z$2
  };
  var ac$1 = {
    addAmpIfSemiPresent: "edge only",
    addSemiIfAmpPresent: false
  };
  var acute$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Alpha$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var alpha$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var amp$1 = {
    addAmpIfSemiPresent: "edge only",
    addSemiIfAmpPresent: true
  };
  var And$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: true
  };
  var and$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: true
  };
  var ange$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: true
  };
  var angle$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var angst$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: true
  };
  var ap$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ape$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var approx$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Aring$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: true
  };
  var aring$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: true
  };
  var Ascr$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ascr$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Assign$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ast$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var atilde$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: true
  };
  var Backslash$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var barwedge$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var becaus$1 = {
    addAmpIfSemiPresent: true,
    addSemiIfAmpPresent: "edge only"
  };
  var Because$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var because$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var bepsi$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Bernoullis$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Beta$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var beta$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var beth$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var between$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var blank$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var block$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var bot$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var bottom$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var bowtie$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var breve$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var bull$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var bullet$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var bump$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var cacute$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Cap$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var cap$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var capand$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var caps$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var caret$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var caron$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var cedil$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Cedilla$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var cent$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: true
  };
  var check$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var checkmark$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Chi$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var chi$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var cir$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var circ$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var clubs$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var clubsuit$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Colon$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var colon$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Colone$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var colone$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var comma$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var commat$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var comp$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var complement$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var complexes$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var cong$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Congruent$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var conint$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var copf$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var coprod$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var COPY$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var copy$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Cross$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var cross$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Cup$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var cup$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var cups$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Dagger$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var dagger$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var daleth$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var darr$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var dash$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var DD$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var dd$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var deg$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Del$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Delta$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var delta$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var dharr$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var diam$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Diamond$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var diamond$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var diams$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var die$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var digamma$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var disin$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var div$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var divide$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var dollar$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var dopf$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Dot$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var dot$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var dsol$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var dtri$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var easter$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var ecir$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ecolon$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ecy$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var edot$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ee$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var efr$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var eg$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var egrave$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var egs$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var el$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ell$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var els$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var empty$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var ENG$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var eng$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var epsi$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Epsilon$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var epsilon$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Equal$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var equals$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var equest$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Equilibrium$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var equiv$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var escr$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var esim$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Eta$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var eta$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ETH$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var eth$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var euro$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var excl$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var exist$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Exists$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var expectation$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var female$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var flat$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var fork$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var frown$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Gamma$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var gamma$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var gap$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var gcy$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ge$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var gel$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var geq$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ges$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var gesl$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var gg$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var gl$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var gla$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var gne$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var grave$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var GT$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var gt$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var half$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Hat$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var hearts$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var hopf$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var hyphen$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var ic$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var icy$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var iff$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ii$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var image$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var imped$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var int$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var integers$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var iocy$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var iogon$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var iota$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var isin$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var it$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Kappa$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var kappa$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var kopf$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Lambda$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var lambda$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var lang$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var lap$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var lat$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var late$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var lates$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var le$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var leg$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var leq$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var les$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var lg$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ll$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var lne$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var lozenge$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var lsh$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var LT$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var lt$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ltimes$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: true
  };
  var male$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var malt$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var map$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var marker$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var mid$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var minus$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var models$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var mp$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var mu$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var nang$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var nap$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var natural$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var naturals$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var ncy$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ne$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var nge$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ngt$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ni$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var nis$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var nle$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var nles$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var nless$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var nlt$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var nopf$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Not$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var not$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var nsc$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var nsce$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var nu$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var num$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var ogt$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ohm$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var oline$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var olt$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Omega$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var omega$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Omicron$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var omicron$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var oopf$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var opar$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var or$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var order$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var oror$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var orv$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var osol$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var par$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var para$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var parallel$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var part$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var phi$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var phone$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Pi$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var pi$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var pitchfork$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var plus$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var pm$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var popf$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var pound$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var pr$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var prime$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var primes$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var prod$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Product$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var prop$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Proportion$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Proportional$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var psi$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var quest$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var QUOT$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var quot$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var race$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var rang$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var range$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var ratio$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Re$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var real$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var reals$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var rect$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var REG$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: true
  };
  var reg$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ring$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var rsh$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var sc$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var scap$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var sce$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var scy$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var sdot$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var sect$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var semi$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var sharp$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var shy$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Sigma$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var sigma$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var sim$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var sol$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var spades$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var square$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Star$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var star$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Sub$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var sub$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var sube$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Sum$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var sum$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Tab$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var target$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Tau$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var tau$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var therefore$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Theta$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var theta$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var THORN$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var thorn$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Tilde$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var tilde$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var times$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var tint$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var top$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var tosa$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var TRADE$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var trade$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var triangle$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var trie$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ucy$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var uml$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Union$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var uplus$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Upsi$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var upsi$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var uring$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var vee$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Vert$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var vert$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var wedge$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Wedge$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var wreath$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Xi$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var xi$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Ycirc$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ycirc$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var ycy$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var yen$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var Zacute$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var zacute$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: "edge only"
  };
  var Zeta$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var zeta$1 = {
    addAmpIfSemiPresent: false,
    addSemiIfAmpPresent: false
  };
  var uncertain = {
    ac: ac$1,
    acute: acute$1,
    Alpha: Alpha$1,
    alpha: alpha$1,
    amp: amp$1,
    And: And$1,
    and: and$1,
    ange: ange$1,
    angle: angle$1,
    angst: angst$1,
    ap: ap$1,
    ape: ape$1,
    approx: approx$1,
    Aring: Aring$1,
    aring: aring$1,
    Ascr: Ascr$1,
    ascr: ascr$1,
    Assign: Assign$1,
    ast: ast$1,
    atilde: atilde$1,
    Backslash: Backslash$1,
    barwedge: barwedge$1,
    becaus: becaus$1,
    Because: Because$1,
    because: because$1,
    bepsi: bepsi$1,
    Bernoullis: Bernoullis$1,
    Beta: Beta$1,
    beta: beta$1,
    beth: beth$1,
    between: between$1,
    blank: blank$1,
    block: block$1,
    bot: bot$1,
    bottom: bottom$1,
    bowtie: bowtie$1,
    breve: breve$1,
    bull: bull$1,
    bullet: bullet$1,
    bump: bump$1,
    cacute: cacute$1,
    Cap: Cap$1,
    cap: cap$1,
    capand: capand$1,
    caps: caps$1,
    caret: caret$1,
    caron: caron$1,
    cedil: cedil$1,
    Cedilla: Cedilla$1,
    cent: cent$1,
    check: check$1,
    checkmark: checkmark$1,
    Chi: Chi$1,
    chi: chi$1,
    cir: cir$1,
    circ: circ$1,
    clubs: clubs$1,
    clubsuit: clubsuit$1,
    Colon: Colon$1,
    colon: colon$1,
    Colone: Colone$1,
    colone: colone$1,
    comma: comma$1,
    commat: commat$1,
    comp: comp$1,
    complement: complement$1,
    complexes: complexes$1,
    cong: cong$1,
    Congruent: Congruent$1,
    conint: conint$1,
    copf: copf$1,
    coprod: coprod$1,
    COPY: COPY$1,
    copy: copy$1,
    Cross: Cross$1,
    cross: cross$1,
    Cup: Cup$1,
    cup: cup$1,
    cups: cups$1,
    Dagger: Dagger$1,
    dagger: dagger$1,
    daleth: daleth$1,
    darr: darr$1,
    dash: dash$1,
    DD: DD$1,
    dd: dd$1,
    deg: deg$1,
    Del: Del$1,
    Delta: Delta$1,
    delta: delta$1,
    dharr: dharr$1,
    diam: diam$1,
    Diamond: Diamond$1,
    diamond: diamond$1,
    diams: diams$1,
    die: die$1,
    digamma: digamma$1,
    disin: disin$1,
    div: div$1,
    divide: divide$1,
    dollar: dollar$1,
    dopf: dopf$1,
    Dot: Dot$1,
    dot: dot$1,
    dsol: dsol$1,
    dtri: dtri$1,
    easter: easter$1,
    ecir: ecir$1,
    ecolon: ecolon$1,
    ecy: ecy$1,
    edot: edot$1,
    ee: ee$1,
    efr: efr$1,
    eg: eg$1,
    egrave: egrave$1,
    egs: egs$1,
    el: el$1,
    ell: ell$1,
    els: els$1,
    empty: empty$1,
    ENG: ENG$1,
    eng: eng$1,
    epsi: epsi$1,
    Epsilon: Epsilon$1,
    epsilon: epsilon$1,
    Equal: Equal$1,
    equals: equals$1,
    equest: equest$1,
    Equilibrium: Equilibrium$1,
    equiv: equiv$1,
    escr: escr$1,
    esim: esim$1,
    Eta: Eta$1,
    eta: eta$1,
    ETH: ETH$1,
    eth: eth$1,
    euro: euro$1,
    excl: excl$1,
    exist: exist$1,
    Exists: Exists$1,
    expectation: expectation$1,
    female: female$1,
    flat: flat$1,
    fork: fork$1,
    frown: frown$1,
    Gamma: Gamma$1,
    gamma: gamma$1,
    gap: gap$1,
    gcy: gcy$1,
    ge: ge$1,
    gel: gel$1,
    geq: geq$1,
    ges: ges$1,
    gesl: gesl$1,
    gg: gg$1,
    gl: gl$1,
    gla: gla$1,
    gne: gne$1,
    grave: grave$1,
    GT: GT$1,
    gt: gt$1,
    half: half$1,
    Hat: Hat$1,
    hearts: hearts$1,
    hopf: hopf$1,
    hyphen: hyphen$1,
    ic: ic$1,
    icy: icy$1,
    iff: iff$1,
    ii: ii$1,
    image: image$1,
    imped: imped$1,
    "in": {
      addAmpIfSemiPresent: false,
      addSemiIfAmpPresent: false
    },
    int: int$1,
    integers: integers$1,
    iocy: iocy$1,
    iogon: iogon$1,
    iota: iota$1,
    isin: isin$1,
    it: it$1,
    Kappa: Kappa$1,
    kappa: kappa$1,
    kopf: kopf$1,
    Lambda: Lambda$1,
    lambda: lambda$1,
    lang: lang$1,
    lap: lap$1,
    lat: lat$1,
    late: late$1,
    lates: lates$1,
    le: le$1,
    leg: leg$1,
    leq: leq$1,
    les: les$1,
    lg: lg$1,
    ll: ll$1,
    lne: lne$1,
    lozenge: lozenge$1,
    lsh: lsh$1,
    LT: LT$1,
    lt: lt$1,
    ltimes: ltimes$1,
    male: male$1,
    malt: malt$1,
    map: map$1,
    marker: marker$1,
    mid: mid$1,
    minus: minus$1,
    models: models$1,
    mp: mp$1,
    mu: mu$1,
    nang: nang$1,
    nap: nap$1,
    natural: natural$1,
    naturals: naturals$1,
    ncy: ncy$1,
    ne: ne$1,
    nge: nge$1,
    ngt: ngt$1,
    ni: ni$1,
    nis: nis$1,
    nle: nle$1,
    nles: nles$1,
    nless: nless$1,
    nlt: nlt$1,
    nopf: nopf$1,
    Not: Not$1,
    not: not$1,
    nsc: nsc$1,
    nsce: nsce$1,
    nu: nu$1,
    num: num$1,
    ogt: ogt$1,
    ohm: ohm$1,
    oline: oline$1,
    olt: olt$1,
    Omega: Omega$1,
    omega: omega$1,
    Omicron: Omicron$1,
    omicron: omicron$1,
    oopf: oopf$1,
    opar: opar$1,
    or: or$1,
    order: order$1,
    oror: oror$1,
    orv: orv$1,
    osol: osol$1,
    par: par$1,
    para: para$1,
    parallel: parallel$1,
    part: part$1,
    phi: phi$1,
    phone: phone$1,
    Pi: Pi$1,
    pi: pi$1,
    pitchfork: pitchfork$1,
    plus: plus$1,
    pm: pm$1,
    popf: popf$1,
    pound: pound$1,
    pr: pr$1,
    prime: prime$1,
    primes: primes$1,
    prod: prod$1,
    Product: Product$1,
    prop: prop$1,
    Proportion: Proportion$1,
    Proportional: Proportional$1,
    psi: psi$1,
    quest: quest$1,
    QUOT: QUOT$1,
    quot: quot$1,
    race: race$1,
    rang: rang$1,
    range: range$1,
    ratio: ratio$1,
    Re: Re$1,
    real: real$1,
    reals: reals$1,
    rect: rect$1,
    REG: REG$1,
    reg: reg$1,
    ring: ring$1,
    rsh: rsh$1,
    sc: sc$1,
    scap: scap$1,
    sce: sce$1,
    scy: scy$1,
    sdot: sdot$1,
    sect: sect$1,
    semi: semi$1,
    sharp: sharp$1,
    shy: shy$1,
    Sigma: Sigma$1,
    sigma: sigma$1,
    sim: sim$1,
    sol: sol$1,
    spades: spades$1,
    square: square$1,
    Star: Star$1,
    star: star$1,
    Sub: Sub$1,
    sub: sub$1,
    sube: sube$1,
    Sum: Sum$1,
    sum: sum$1,
    Tab: Tab$1,
    target: target$1,
    Tau: Tau$1,
    tau: tau$1,
    therefore: therefore$1,
    Theta: Theta$1,
    theta: theta$1,
    THORN: THORN$1,
    thorn: thorn$1,
    Tilde: Tilde$1,
    tilde: tilde$1,
    times: times$1,
    tint: tint$1,
    top: top$1,
    tosa: tosa$1,
    TRADE: TRADE$1,
    trade: trade$1,
    triangle: triangle$1,
    trie: trie$1,
    ucy: ucy$1,
    uml: uml$1,
    Union: Union$1,
    uplus: uplus$1,
    Upsi: Upsi$1,
    upsi: upsi$1,
    uring: uring$1,
    vee: vee$1,
    Vert: Vert$1,
    vert: vert$1,
    wedge: wedge$1,
    Wedge: Wedge$1,
    wreath: wreath$1,
    Xi: Xi$1,
    xi: xi$1,
    Ycirc: Ycirc$1,
    ycirc: ycirc$1,
    ycy: ycy$1,
    yen: yen$1,
    Zacute: Zacute$1,
    zacute: zacute$1,
    Zeta: Zeta$1,
    zeta: zeta$1
  };

  function decode(ent) {
    if (typeof ent !== "string" || !ent.length || !ent.startsWith("&") || !ent.endsWith(";")) {
      throw new Error(`all-named-html-entities/decode(): [THROW_ID_01] Input must be an HTML entity with leading ampersand and trailing semicolon, but "${ent}" was given`);
    }

    const val = ent.slice(1, ent.length - 1);
    return allNamedEntities[val] ? allNamedEntities[val] : null;
  }
  const maxLength = 31;

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
    return function (arg) {
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
    if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
      return false;
    }

    var proto = getPrototype(value);

    if (proto === null) {
      return true;
    }

    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }

  var lodash_isplainobject = isPlainObject;

  /**
   * string-left-right
   * Look what's to the left or the right of a given index within a string
   * Version: 2.3.20
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-left-right
   */

  function x$3(something) {
    const res = {
      value: something,
      hungry: false,
      optional: false
    };

    if ((res.value.endsWith("?*") || res.value.endsWith("*?")) && res.value.length > 2) {
      res.value = res.value.slice(0, res.value.length - 2);
      res.optional = true;
      res.hungry = true;
    } else if (res.value.endsWith("?") && res.value.length > 1) {
      res.value = res.value.slice(0, res.value.length - 1);
      res.optional = true;
    } else if (res.value.endsWith("*") && res.value.length > 1) {
      res.value = res.value.slice(0, res.value.length - 1);
      res.hungry = true;
    }

    return res;
  }

  function isNum(something) {
    return typeof something === "number";
  }

  function isStr(something) {
    return typeof something === "string";
  }

  function rightMain(str, idx, stopAtNewlines) {
    if (typeof str !== "string" || !str.length) {
      return null;
    }

    if (!idx || typeof idx !== "number") {
      idx = 0;
    }

    if (!str[idx + 1]) {
      return null;
    }

    if (str[idx + 1] && (!stopAtNewlines && str[idx + 1].trim() || stopAtNewlines && (str[idx + 1].trim() || "\n\r".includes(str[idx + 1])))) {
      return idx + 1;
    }

    if (str[idx + 2] && (!stopAtNewlines && str[idx + 2].trim() || stopAtNewlines && (str[idx + 2].trim() || "\n\r".includes(str[idx + 2])))) {
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
    }

    if (str[idx - 1] && (!stopAtNewlines && str[idx - 1].trim() || stopAtNewlines && (str[idx - 1].trim() || "\n\r".includes(str[idx - 1])))) {
      return idx - 1;
    }

    if (str[idx - 2] && (!stopAtNewlines && str[idx - 2].trim() || stopAtNewlines && (str[idx - 2].trim() || "\n\r".includes(str[idx - 2])))) {
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

  function seq(direction, str, idx, opts, args) {
    if (typeof str !== "string" || !str.length) {
      return null;
    }

    if (!idx || typeof idx !== "number") {
      idx = 0;
    }

    if (direction === "right" && !str[idx + 1] || direction === "left" && !str[idx - 1]) {
      return null;
    }

    let lastFinding = idx;
    const gaps = [];
    let leftmostChar;
    let rightmostChar;
    let satiated;
    let i = 0;

    while (i < args.length) {
      if (!isStr(args[i]) || !args[i].length) {
        i += 1;
        continue;
      }

      const {
        value,
        optional,
        hungry
      } = x$3(args[i]);
      const whattsOnTheSide = direction === "right" ? right(str, lastFinding) : left(str, lastFinding);

      if (opts.i && str[whattsOnTheSide].toLowerCase() === value.toLowerCase() || !opts.i && str[whattsOnTheSide] === value) {
        const temp = direction === "right" ? right(str, whattsOnTheSide) : left(str, whattsOnTheSide);

        if (hungry && (opts.i && str[temp].toLowerCase() === value.toLowerCase() || !opts.i && str[temp] === value)) {
          satiated = true;
        } else {
          i += 1;
        }

        if (direction === "right" && whattsOnTheSide > lastFinding + 1) {
          gaps.push([lastFinding + 1, whattsOnTheSide]);
        } else if (direction === "left" && whattsOnTheSide < lastFinding - 1) {
          gaps.unshift([whattsOnTheSide + 1, lastFinding]);
        }

        lastFinding = whattsOnTheSide;

        if (direction === "right") {
          if (leftmostChar === undefined) {
            leftmostChar = whattsOnTheSide;
          }

          rightmostChar = whattsOnTheSide;
        } else {
          if (rightmostChar === undefined) {
            rightmostChar = whattsOnTheSide;
          }

          leftmostChar = whattsOnTheSide;
        }
      } else if (optional) {
        i += 1;
        continue;
      } else if (satiated) {
        i += 1;
        satiated = undefined;
        continue;
      } else {
        return null;
      }
    }

    if (leftmostChar === undefined) {
      return null;
    }

    return {
      gaps,
      leftmostChar,
      rightmostChar
    };
  }

  function leftSeq(str, idx, ...args) {
    if (!args.length) {
      return left(str, idx);
    }

    const defaults = {
      i: false
    };
    let opts;

    if (lodash_isplainobject(args[0])) {
      opts = { ...defaults,
        ...args.shift()
      };
    } else {
      opts = defaults;
    }

    return seq("left", str, idx, opts, Array.from(args).reverse());
  }

  function rightSeq(str, idx, ...args) {
    if (!args.length) {
      return right(str, idx);
    }

    const defaults = {
      i: false
    };
    let opts;

    if (lodash_isplainobject(args[0])) {
      opts = { ...defaults,
        ...args.shift()
      };
    } else {
      opts = defaults;
    }

    return seq("right", str, idx, opts, args);
  }

  function chomp(direction, str, idx, opts, args) {
    if (typeof str !== "string" || !str.length) {
      return null;
    }

    if (!idx || typeof idx !== "number") {
      idx = 0;
    }

    if (direction === "right" && !str[idx + 1] || direction === "left" && (isNum(idx) && idx < 1 || idx === "0")) {
      return null;
    }

    let lastRes = null;
    let lastIdx = null;

    do {
      lastRes = direction === "right" ? rightSeq(str, isNum(lastIdx) ? lastIdx : idx, ...args) : leftSeq(str, isNum(lastIdx) ? lastIdx : idx, ...args);

      if (lastRes !== null) {
        lastIdx = direction === "right" ? lastRes.rightmostChar : lastRes.leftmostChar;
      }
    } while (lastRes);

    if (lastIdx != null && direction === "right") {
      lastIdx += 1;
    }

    if (lastIdx === null) {
      return null;
    }

    if (direction === "right") {
      if (str[lastIdx] && str[lastIdx].trim()) {
        return lastIdx;
      }

      const whatsOnTheRight = right(str, lastIdx);

      if (opts.mode === 0) {
        if (whatsOnTheRight === lastIdx + 1) {
          return lastIdx;
        }

        if (str.slice(lastIdx, whatsOnTheRight || str.length).trim() || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\n") || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\r")) {
          for (let y = lastIdx, len = str.length; y < len; y++) {
            if (`\n\r`.includes(str[y])) {
              return y;
            }
          }
        } else {
          return whatsOnTheRight ? whatsOnTheRight - 1 : str.length;
        }
      } else if (opts.mode === 1) {
        return lastIdx;
      } else if (opts.mode === 2) {
        const remainderString = str.slice(lastIdx);

        if (remainderString.trim() || remainderString.includes("\n") || remainderString.includes("\r")) {
          for (let y = lastIdx, len = str.length; y < len; y++) {
            if (str[y].trim() || `\n\r`.includes(str[y])) {
              return y;
            }
          }
        }

        return str.length;
      }

      return whatsOnTheRight || str.length;
    }

    if (str[lastIdx] && str[lastIdx - 1] && str[lastIdx - 1].trim()) {
      return lastIdx;
    }

    const whatsOnTheLeft = left(str, lastIdx);

    if (opts.mode === 0) {
      if (whatsOnTheLeft === lastIdx - 2) {
        return lastIdx;
      }

      if (str.slice(0, lastIdx).trim() || str.slice(0, lastIdx).includes("\n") || str.slice(0, lastIdx).includes("\r")) {
        for (let y = lastIdx; y--;) {
          if (`\n\r`.includes(str[y]) || str[y].trim()) {
            return y + 1 + (str[y].trim() ? 1 : 0);
          }
        }
      }

      return 0;
    }

    if (opts.mode === 1) {
      return lastIdx;
    }

    if (opts.mode === 2) {
      const remainderString = str.slice(0, lastIdx);

      if (remainderString.trim() || remainderString.includes("\n") || remainderString.includes("\r")) {
        for (let y = lastIdx; y--;) {
          if (str[y].trim() || `\n\r`.includes(str[y])) {
            return y + 1;
          }
        }
      }

      return 0;
    }

    return whatsOnTheLeft !== null ? whatsOnTheLeft + 1 : 0;
  }

  function chompLeft(str, idx, ...args) {
    if (!args.length || args.length === 1 && lodash_isplainobject(args[0])) {
      return null;
    }

    const defaults = {
      mode: 0
    };

    if (lodash_isplainobject(args[0])) {
      const opts = { ...defaults,
        ...lodash_clonedeep(args[0])
      };

      if (!opts.mode) {
        opts.mode = 0;
      } else if (isStr(opts.mode) && `0123`.includes(opts.mode)) {
        opts.mode = Number.parseInt(opts.mode, 10);
      } else if (!isNum(opts.mode)) {
        throw new Error(`string-left-right/chompLeft(): [THROW_ID_01] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as ${opts.mode} (type ${typeof opts.mode})`);
      }

      return chomp("left", str, idx, opts, lodash_clonedeep(args).slice(1));
    }

    if (!isStr(args[0])) {
      return chomp("left", str, idx, defaults, lodash_clonedeep(args).slice(1));
    }

    return chomp("left", str, idx, defaults, lodash_clonedeep(args));
  }

  function isObj(something) {
    return something && _typeof(something) === "object" && !Array.isArray(something);
  } // checks, are there any other non-whitespace characters besides n, b, s or p


  function onlyContainsNbsp(str, from, to) {
    for (var i = from; i < to; i++) {
      if (str[i].trim().length && !"nbsp".includes(str[i].toLowerCase())) {
        return false;
      }
    }

    return true;
  }

  function isLatinLetterOrNumberOrHash(char) {
    // we mean:
    // - Latin letters a-z or
    // - numbers 0-9 or
    // - letters A-Z or
    // - #
    return isStr$1(char) && char.length === 1 && (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123 || char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58 || char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) === 35);
  }

  function isNumber(something) {
    return isStr$1(something) && something.charCodeAt(0) > 47 && something.charCodeAt(0) < 58;
  }

  function isNotaLetter(str2) {
    return !(typeof str2 === "string" && str2.length === 1 && str2.toUpperCase() !== str2.toLowerCase());
  }

  function isStr$1(something) {
    return typeof something === "string";
  }

  function isLatinLetter(something) {
    return typeof something === "string" && (something.charCodeAt(0) > 96 && something.charCodeAt(0) < 123 || something.charCodeAt(0) > 64 && something.charCodeAt(0) < 91);
  }

  function resemblesNumericEntity(str2, from, to) {
    // plan: loop characters, count types, judge what's given
    var lettersCount = 0;
    var numbersCount = 0;
    var othersCount = 0;
    var hashesCount = 0;
    var whitespaceCount = 0;
    var numbersValue = "";
    var charTrimmed = "";

    for (var i = from; i < to; i++) {
      if (str2[i].trim().length) {
        charTrimmed += str2[i];
      } else {
        whitespaceCount += 1;
      }

      if (isLatinLetter(str2[i])) {
        lettersCount += 1;
      } else if (isNumber(str2[i])) {
        numbersCount += 1;
        numbersValue += String(str2[i]);
      } else if (str2[i] === "#") {
        hashesCount += 1;
      } else {
        othersCount += 1;
      }
    } // if there are more numbers than letters (or equal) then it's more likely
    // to be a numeric entity


    var probablyNumeric = false; // if decimal-type, for example, &#999999;
    // but wide enough to include messed up cases

    if (!lettersCount && numbersCount > othersCount) {
      probablyNumeric = "deci";
    } else if ((numbersCount || lettersCount) && (charTrimmed[0] === "#" && charTrimmed[1].toLowerCase() === "x" && (isNumber(charTrimmed[2]) || isLatinLetter(charTrimmed[2])) || charTrimmed[0].toLowerCase() === "x" && numbersCount && !othersCount)) {
      // hexidecimal, for example, &#xA3;
      // but wide enough to include messed up cases
      probablyNumeric = "hexi";
    }

    return {
      probablyNumeric: probablyNumeric,
      lettersCount: lettersCount,
      numbersCount: numbersCount,
      numbersValue: numbersValue,
      hashesCount: hashesCount,
      othersCount: othersCount,
      charTrimmed: charTrimmed,
      whitespaceCount: whitespaceCount
    };
  }

  /**
   * stringFixBrokenNamedEntities - fixes broken named HTML entities
   *
   * @param  {string} inputString
   * @return {array}  ranges array OR null
   */

  function stringFixBrokenNamedEntities(str, originalOpts) {
    function findLongest(temp1) {
      // we are filtering something like this:
      // [
      //   {
      //       "tempEnt": "acute",
      //       "tempRes": {
      //           "gaps": [],
      //           "leftmostChar": 2,
      //           "rightmostChar": 6
      //       }
      //   },
      //   {
      //       "tempEnt": "zacute",
      //       "tempRes": {
      //           "gaps": [],
      //           "leftmostChar": 0,
      //           "rightmostChar": 6
      //       }
      //   }
      // ]
      //
      // we find the object which represents the longest matched entity, that is,
      // object which "tempEnt" key value's length is the longest.
      if (Array.isArray(temp1) && temp1.length) {
        if (temp1.length === 1) {
          // quick ending - only one value anyway
          return temp1[0];
        } // filter-out and return the longest-one


        return temp1.reduce(function (accum, tempObj) {
          if (tempObj.tempEnt.length > accum.tempEnt.length) {
            return tempObj;
          }

          return accum;
        });
      }

      return temp1;
    }

    function removeGappedFromMixedCases(temp1) {
      // If there is one without gaps and all others with gaps, gapless
      // wins, regardless of length.
      // The longest of gapless-one wins, trumping all the ones with gaps.
      // If all are with gaps, the longest one wins.
      // [
      //   {
      //       "tempEnt": "acute",
      //       "tempRes": {
      //           "gaps": [],
      //           "leftmostChar": 2,
      //           "rightmostChar": 6
      //       }
      //   },
      //   {
      //       "tempEnt": "zacute",
      //       "tempRes": {
      //           "gaps": [
      //               [
      //                   1,
      //                   2
      //               ]
      //           ],
      //           "leftmostChar": 0,
      //           "rightmostChar": 6
      //       }
      //   }
      // ]
      // For example, entity "zacute" record above shows it has gaps, while the
      // "acute" does not have gaps. This is a mixed case scenario and we remove
      // all gapped entities, that is, in this case, "zacute".
      // Imagine we have string "zzzzzz acute; yyyyyy". That z on the left of
      // "acute" is legit. That's why we exclude matched gapped entities in
      // mixed cases.
      // But, semicolon also matters, for example, &acd; vs. &ac; in:
      // &ac d;
      // case picks &acd; as winner
      var copy;

      if (Array.isArray(temp1) && temp1.length) {
        // prevent mutation:
        copy = Array.from(temp1); // 1. if some matches have semicolon to the right of rightmostChar and
        // some matches don't, exclude those that don't.
        // If at any moment we've left with one match, Bob's your uncle here's
        // the final result.
        // For example, we might be working on something like this:
        // [
        //     {
        //         "tempEnt": "ac",
        //         "tempRes": {
        //             "gaps": [],
        //             "leftmostChar": 1,
        //             "rightmostChar": 2
        //         }
        //     },
        //     {
        //         "tempEnt": "acd",
        //         "tempRes": {
        //             "gaps": [
        //                 [
        //                     3,
        //                     4
        //                 ]
        //             ],
        //             "leftmostChar": 1,
        //             "rightmostChar": 4
        //         }
        //     }
        // ]

        if (copy.length > 1 && copy.some(function (entityObj) {
          return str[right(str, entityObj.tempRes.rightmostChar)] === ";";
        }) && copy.some(function (entityObj) {
          return str[right(str, entityObj.tempRes.rightmostChar)] !== ";";
        })) {
          // filter out those with semicolon to the right of the last character:
          copy = copy.filter(function (entityObj) {
            return str[right(str, entityObj.tempRes.rightmostChar)] === ";";
          });
        } // 2. if still there is more than one match, first exclude gapped if
        // there is mix of gapped vs. gapless. Then, return longest.
        // If all are either gapped or gapless, return longest.


        if (!(copy.every(function (entObj) {
          return !entObj || !entObj.tempRes || !entObj.tempRes.gaps || !Array.isArray(entObj.tempRes.gaps) || !entObj.tempRes.gaps.length;
        }) || copy.every(function (entObj) {
          return entObj && entObj.tempRes && entObj.tempRes.gaps && Array.isArray(entObj.tempRes.gaps) && entObj.tempRes.gaps.length;
        }))) {
          // filter out entities with gaps, leave gapless-ones
          return findLongest(copy.filter(function (entObj) {
            return !entObj.tempRes.gaps || !Array.isArray(entObj.tempRes.gaps) || !entObj.tempRes.gaps.length;
          }));
        }
      } // else if all entries don't have gaps, return longest


      return findLongest(temp1);
    } //
    //
    //
    //
    //
    //                              THE PROGRAM
    //
    //
    //
    //
    //
    // insurance:
    // ---------------------------------------------------------------------------


    if (typeof str !== "string") {
      throw new Error("string-fix-broken-named-entities: [THROW_ID_01] the first input argument must be string! It was given as:\n".concat(JSON.stringify(str, null, 4), " (").concat(_typeof(str), "-type)"));
    }

    var defaults = {
      decode: false,
      cb: function cb(_ref) {
        var rangeFrom = _ref.rangeFrom,
            rangeTo = _ref.rangeTo,
            rangeValEncoded = _ref.rangeValEncoded,
            rangeValDecoded = _ref.rangeValDecoded;
        return rangeValDecoded || rangeValEncoded ? [rangeFrom, rangeTo, isObj(originalOpts) && originalOpts.decode ? rangeValDecoded : rangeValEncoded] : [rangeFrom, rangeTo];
      },
      progressFn: null,
      entityCatcherCb: null
    };
    var opts;

    if (originalOpts != null) {
      if (!isObj(originalOpts)) {
        throw new Error("string-fix-broken-named-entities: [THROW_ID_02] the second input argument must be a plain object! I was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (").concat(_typeof(originalOpts), "-type)"));
      } else {
        opts = _objectSpread2({}, defaults, {}, originalOpts);
      }
    } else {
      opts = defaults;
    }

    if (opts.cb && typeof opts.cb !== "function") {
      throw new TypeError("string-fix-broken-named-entities: [THROW_ID_03] opts.cb must be a function (or falsey)! Currently it's: ".concat(_typeof(opts.cb), ", equal to: ").concat(JSON.stringify(opts.cb, null, 4)));
    }

    if (opts.entityCatcherCb && typeof opts.entityCatcherCb !== "function") {
      throw new TypeError("string-fix-broken-named-entities: [THROW_ID_03] opts.entityCatcherCb must be a function (or falsey)! Currently it's: ".concat(_typeof(opts.entityCatcherCb), ", equal to: ").concat(JSON.stringify(opts.entityCatcherCb, null, 4)));
    }

    if (opts.progressFn && typeof opts.progressFn !== "function") {
      throw new TypeError("string-fix-broken-named-entities: [THROW_ID_04] opts.progressFn must be a function (or falsey)! Currently it's: ".concat(_typeof(opts.progressFn), ", equal to: ").concat(JSON.stringify(opts.progressFn, null, 4)));
    } // state flags
    // ---------------------------------------------------------------------------
    // this one is to mark the exception when current character is not ampersand
    // where should be one, but it is not necessary to add an ampersand here.
    // For example, there was ampersand and bunch of rubbish in between it and
    // current character. Current character should have ampersand in front of it.
    // We don't add one though, because we consult with this flag.


    var ampersandNotNeeded = false; // markers:
    // define defaults so that we can reset to objects with keys, not empty objects
    // * nbsp tracking:

    var nbspDefault = {
      nameStartsAt: null,
      // when we'll insert range, we'll use this or "this - 1"
      ampersandNecessary: null,
      // default is not Boolean, to mark the state it needs tending
      patience: 1,
      // one letter can be omitted from name
      matchedN: null,
      // set the index of the first catch
      matchedB: null,
      // set the index of the first catch
      matchedS: null,
      // set the index of the first catch
      matchedP: null,
      // set the index of the first catch
      matchedSemicol: null // set the index of the first catch

    };
    var nbsp = lodash_clonedeep(nbspDefault);

    var nbspWipe = function nbspWipe() {
      nbsp = lodash_clonedeep(nbspDefault);
    }; // this is what we'll return, process by default callback or user's custom-one


    var rangesArr2 = [];
    var smallestCharFromTheSetAt;
    var largestCharFromTheSetAt;
    var matchedLettersCount;
    var setOfValues;
    var percentageDone;
    var lastPercentageDone; // allocate all 100 of progress to the main loop below

    var len = str.length + 1;
    var counter = 0; // doNothingUntil can be either falsey or truthy: index number or boolean true
    // If it's number, it's instruction to avoid actions until that index is
    // reached when traversing. If it's boolean, it means we don't know when we'll
    // stop, we just turn on the flag (permanently, for now).

    var doNothingUntil = null; // catch letter sequences, possibly separated with whitespace. Non-letter
    // breaks the sequence. Main aim is to catch names of encoded HTML entities
    // for example, nbsp from "&nbsp;"

    var letterSeqStartAt = null;
    var brokenNumericEntityStartAt = null;
    var falsePositivesArr = ["&nspar;", "&prnsim;", "&subplus;"]; //                                      |
    //                                      |
    //                                      |
    //                                      |
    //                                      |
    //                                      |
    //                                      |
    //              T   H   E       L   O   O   P       S  T  A  R  T  S
    //                                      |
    //                                      |
    //                                 \    |     /
    //                                  \   |    /
    //                                   \  |   /
    //                                    \ |  /
    //                                     \| /
    //                                      V
    // differently from regex-based approach, we aim to traverse the string only once:

    var _loop = function _loop(i) {
      if (opts.progressFn) {
        percentageDone = Math.floor(counter / len * 100);

        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          opts.progressFn(percentageDone);
        }
      } //            |
      //            |
      //            |
      //            |
      //            |
      // PART 1. FRONTAL LOGGING
      //            |
      //            |
      //            |
      //            |
      //            |
      //            |
      //            |
      //            |
      //            |
      //            |
      // PART 3. RULES AT THE TOP
      //            |
      //            |
      //            |
      //            |
      //            |


      if (doNothingUntil) {
        if (doNothingUntil !== true && i >= doNothingUntil) {
          doNothingUntil = null;
        } else {
          counter += 1;
          return "continue";
        }
      } // Catch ending of an nbsp (or messed up set of its characters)
      // It's the character after semicolon or whatever is the last when semicolon
      // itself is missing.


      matchedLettersCount = (nbsp.matchedN !== null ? 1 : 0) + (nbsp.matchedB !== null ? 1 : 0) + (nbsp.matchedS !== null ? 1 : 0) + (nbsp.matchedP !== null ? 1 : 0);
      setOfValues = [nbsp.matchedN, nbsp.matchedB, nbsp.matchedS, nbsp.matchedP].filter(function (val) {
        return val !== null;
      });
      smallestCharFromTheSetAt = Math.min.apply(Math, _toConsumableArray(setOfValues));
      largestCharFromTheSetAt = Math.max.apply(Math, _toConsumableArray(setOfValues)); // in principle, there has to be either ampersand or semicolon on an entity.
      // There are requirements for the length between characters of a set n-b-s-p.
      // If both ampersand and semicolon is missing, on both sides there must be a
      // non-letter.
      // largestCharFromTheSetAt - smallestCharFromTheSetAt <= 4

      if (nbsp.nameStartsAt !== null && matchedLettersCount > 2 && (nbsp.matchedSemicol !== null || !nbsp.ampersandNecessary || isNotaLetter(str[nbsp.nameStartsAt - 1]) && isNotaLetter(str[i]) || (isNotaLetter(str[nbsp.nameStartsAt - 1]) || isNotaLetter(str[i])) && largestCharFromTheSetAt - smallestCharFromTheSetAt <= 4 || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && nbsp.matchedN + 1 === nbsp.matchedB && nbsp.matchedB + 1 === nbsp.matchedS && nbsp.matchedS + 1 === nbsp.matchedP) && (!str[i] || nbsp.matchedN !== null && nbsp.matchedB !== null && nbsp.matchedS !== null && nbsp.matchedP !== null && str[i] !== str[i - 1] || str[i].toLowerCase() !== "n" && str[i].toLowerCase() !== "b" && str[i].toLowerCase() !== "s" && str[i].toLowerCase() !== "p" || str[left(str, i)] === ";") && str[i] !== ";" && (str[i + 1] === undefined || str[right(str, i)] !== ";") && (nbsp.matchedB !== null || !(str[smallestCharFromTheSetAt].toLowerCase() === "n" && str[left(str, smallestCharFromTheSetAt)] && str[left(str, smallestCharFromTheSetAt)].toLowerCase() === "e") && !(nbsp.matchedN !== null && rightSeq(str, nbsp.matchedN, {
        i: true
      }, "s", "u", "p")) && str[right(str, nbsp.matchedN)].toLowerCase() !== "c") && (nbsp.matchedB === null || onlyContainsNbsp(str, smallestCharFromTheSetAt, largestCharFromTheSetAt + 1) || !(str[smallestCharFromTheSetAt] && str[largestCharFromTheSetAt] && str[smallestCharFromTheSetAt].toLowerCase() === "n" && str[largestCharFromTheSetAt].toLowerCase() === "b"))) {
        // chomp all &amp; where ampersand is optional if sandwitched
        var chompedAmpFromLeft = chompLeft(str, nbsp.nameStartsAt, "&?", "a", "m", "p", ";?");
        var beginningOfTheRange = chompedAmpFromLeft || nbsp.nameStartsAt; // if our nbsp has problems:

        if (!falsePositivesArr.some(function (val) {
          return str.slice(beginningOfTheRange).startsWith(val);
        }) && str.slice(beginningOfTheRange, i) !== "&nbsp;") {
          rangesArr2.push({
            ruleName: "bad-named-html-entity-malformed-nbsp",
            entityName: "nbsp",
            rangeFrom: beginningOfTheRange,
            rangeTo: i,
            rangeValEncoded: "&nbsp;",
            rangeValDecoded: "\xA0"
          });
        } // also, if it must be decoded this healthy nbsp is wrong
        else if (opts.decode) {
            rangesArr2.push({
              ruleName: "encoded-html-entity-nbsp",
              entityName: "nbsp",
              rangeFrom: beginningOfTheRange,
              rangeTo: i,
              rangeValEncoded: "&nbsp;",
              rangeValDecoded: "\xA0"
            });
          } else if (opts.entityCatcherCb) {
            // call the general entity callback if it's given
            opts.entityCatcherCb(beginningOfTheRange, i);
          }

        nbspWipe();
        counter += 1; // if we are on an ampersand currently, start a new record

        if (str[i] === "&" && str[i + 1] !== "&") {
          nbsp.nameStartsAt = i;
          nbsp.ampersandNecessary = false;
        }

        return "continue";
      } // If semicolon was passed and tag is not closing, wipe:


      if (str[i] && str[i - 1] === ";" && !leftSeq(str, i - 1, "a", "m", "p") && str[i] !== ";" && matchedLettersCount > 0) {
        nbspWipe();
        counter += 1;
        return "continue";
      } //            |
      //            |
      //            |
      //            |
      //            |
      // PART 3. RULES AT THE MIDDLE
      //            |
      //            |
      //            |
      //            |
      //            |
      // Catch the end of a latin letter sequence.


      if (letterSeqStartAt !== null && (!str[i] || str[i].trim().length && !isLatinLetterOrNumberOrHash(str[i]))) {
        if (i > letterSeqStartAt + 1 && str.slice(letterSeqStartAt - 1, i + 1) !== "&nbsp;") {
          var potentialEntity = str.slice(letterSeqStartAt, i);
          var whatsOnTheLeft = left(str, letterSeqStartAt);
          var whatsEvenMoreToTheLeft = whatsOnTheLeft ? left(str, whatsOnTheLeft) : ""; //
          //
          //
          //
          // CASE 1 - CHECK FOR MISSING SEMICOLON
          //
          //
          //
          //

          if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) {
            // check, what's the index of the character to the right of
            // str[whatsOnTheLeft], is it any of the known named HTML entities.
            var firstChar = letterSeqStartAt;
            var secondChar = letterSeqStartAt ? right(str, letterSeqStartAt) : null; // we'll tap the "entStartsWith" from npm package "all-named-html-entities"
            // which gives a plain object of named entities, all grouped by first
            // and second character first. This reduces amount of matching needed.
            // mind you, there can be overlapping variations of entities, for
            // example, &ang; and &angst;. Now, if you match "ang" from "&ang;",
            // starting from the left side (like we do using "entStartsWith"),
            // when there is "&angst;", answer will also be positive. And we can't
            // rely on semicolon being on the right because we are actually
            // catching MISSING semicolons here.
            // The only way around this is to match all entities that start here
            // and pick the one with the biggest character length.
            // TODO - set up case insensitive matching here:

            if (Object.prototype.hasOwnProperty.call(startsWith, str[firstChar]) && Object.prototype.hasOwnProperty.call(startsWith[str[firstChar]], str[secondChar])) {
              var tempEnt;
              var tempRes;
              var temp1 = startsWith[str[firstChar]][str[secondChar]].reduce(function (gatheredSoFar, oneOfKnownEntities) {
                // find all entities that match on the right of here
                // rightSeq could theoretically give positive answer, zero index,
                // but it's impossible here, so we're fine to match "if true".
                var tempRes = rightSeq.apply(void 0, [str, letterSeqStartAt - 1].concat(_toConsumableArray(oneOfKnownEntities.split(""))));

                if (tempRes && oneOfKnownEntities !== "nbsp") {
                  return gatheredSoFar.concat([{
                    tempEnt: oneOfKnownEntities,
                    tempRes: tempRes
                  }]);
                }

                return gatheredSoFar;
              }, []);
              temp1 = removeGappedFromMixedCases(temp1);

              if (temp1) {
                var _temp = temp1;
                tempEnt = _temp.tempEnt;
                tempRes = _temp.tempRes;
              }

              if (tempEnt && (!Object.keys(uncertain).includes(tempEnt) || !str[tempRes.rightmostChar + 1] || ["&"].includes(str[tempRes.rightmostChar + 1]) || (uncertain[tempEnt].addSemiIfAmpPresent === true || uncertain[tempEnt].addSemiIfAmpPresent && (!str[tempRes.rightmostChar + 1] || !str[tempRes.rightmostChar + 1].trim().length)) && str[tempRes.leftmostChar - 1] === "&")) {
                var decodedEntity = decode("&".concat(tempEnt, ";"));
                rangesArr2.push({
                  ruleName: "bad-named-html-entity-malformed-".concat(tempEnt),
                  entityName: tempEnt,
                  rangeFrom: whatsOnTheLeft,
                  rangeTo: tempRes.rightmostChar + 1,
                  rangeValEncoded: "&".concat(tempEnt, ";"),
                  rangeValDecoded: decodedEntity
                });
              } // ELSE, it was just a legit ampersand

            }
          } else if (str[whatsOnTheLeft] !== "&" && str[whatsEvenMoreToTheLeft] !== "&" && str[i] === ";") {
            //
            //
            //
            //
            // CASE 2 - CHECK FOR MISSING AMPERSAND
            //
            //
            //
            //
            // check, what's on the left of str[i], is it any of known named HTML
            // entities. There are two thousand of them so we'll match by last
            // two characters. For posterity, we assume there can be any amount of
            // whitespace between characters and we need to tackle it as well.
            var lastChar = left(str, i);
            var secondToLast = lastChar ? left(str, lastChar) : null; // we'll tap the "entEndsWith" from npm package "all-named-html-entities"
            // which gives a plain object of named entities, all grouped by first
            // and second character first. This reduces amount of matching needed.
            // TODO - match case-insensitive first, then match case-sensitive:

            if (secondToLast !== null && Object.prototype.hasOwnProperty.call(endsWith, str[lastChar]) && Object.prototype.hasOwnProperty.call(endsWith[str[lastChar]], str[secondToLast])) {
              var _tempEnt;

              var _tempRes;

              var _temp2 = endsWith[str[lastChar]][str[secondToLast]].reduce(function (gatheredSoFar, oneOfKnownEntities) {
                // find all entities that match on the right of here
                // rightSeq could theoretically give positive answer, zero index,
                // but it's impossible here, so we're fine to match "if true".
                var tempRes = leftSeq.apply(void 0, [str, i].concat(_toConsumableArray(oneOfKnownEntities.split(""))));

                if (tempRes && oneOfKnownEntities !== "nbsp" && !(oneOfKnownEntities === "block" && str[left(str, letterSeqStartAt)] === ":")) {
                  return gatheredSoFar.concat([{
                    tempEnt: oneOfKnownEntities,
                    tempRes: tempRes
                  }]);
                }

                return gatheredSoFar;
              }, []);

              _temp2 = removeGappedFromMixedCases(_temp2);

              if (_temp2) {
                var _temp3 = _temp2;
                _tempEnt = _temp3.tempEnt;
                _tempRes = _temp3.tempRes;
              }

              if (_tempEnt && (!Object.keys(uncertain).includes(_tempEnt) || uncertain[_tempEnt].addAmpIfSemiPresent === true || uncertain[_tempEnt].addAmpIfSemiPresent && (!_tempRes.leftmostChar || isStr$1(str[_tempRes.leftmostChar - 1]) && !str[_tempRes.leftmostChar - 1].trim().length))) {
                var _decodedEntity = decode("&".concat(_tempEnt, ";"));

                rangesArr2.push({
                  ruleName: "bad-named-html-entity-malformed-".concat(_tempEnt),
                  entityName: _tempEnt,
                  rangeFrom: _tempRes.leftmostChar,
                  rangeTo: i + 1,
                  rangeValEncoded: "&".concat(_tempEnt, ";"),
                  rangeValDecoded: _decodedEntity
                });
              }
            } else if (brokenNumericEntityStartAt !== null) {
              // we have a malformed numeric entity reference, like #x26; without
              // an ampersand but with the rest of characters
              // 1. push the issue:
              rangesArr2.push({
                ruleName: "bad-malformed-numeric-character-entity",
                entityName: null,
                rangeFrom: brokenNumericEntityStartAt,
                rangeTo: i + 1,
                rangeValEncoded: null,
                rangeValDecoded: null
              }); // 2. reset marker:

              brokenNumericEntityStartAt = null;
            }
          } else if (str[whatsOnTheLeft] === "&" && str[i] === ";") {
            //
            //
            //
            //
            // CASE 3 - CHECK FOR MESSY ENTITIES OR REQUESTED DECODING
            //
            //
            //
            //
            // find out more: is it legit, unrecognised or numeric...
            if (str.slice(whatsOnTheLeft + 1, i).trim().length > 1) {
              // Maybe it's a numeric entity?
              // we can simply check, does entity start with a hash but that
              // would be naive because this is a tool to catch and fix errors
              // and hash might be missing or mis-typed
              // So, we have confirmed ampersand, something in between and then
              // confirmed semicolon.
              // First, we extracted the contents of all this, "situation.charTrimmed".
              // By the way, Character-trimmed string where String.trim() is
              // applied to each character. This is needed so that our tool could
              // recognise whitespace gaps anywhere in the input. Imagine, for
              // example, "&# 85;" with rogue space. Errors like that require
              // constant trimming on the algorithm side.
              // We are going to describe numeric entity as
              // * something that starts with ampersand
              // * ends with semicolon
              // - has no letter characters AND at least one number character OR
              // - has more numeric characters than letters
              var situation = resemblesNumericEntity(str, whatsOnTheLeft + 1, i);

              if (situation.probablyNumeric) {
                // 1. TACKLE HEALTHY DECIMAL NUMERIC CHARACTER REFERENCE ENTITIES:
                if (situation.probablyNumeric && situation.charTrimmed[0] === "#" && !situation.whitespaceCount && ( // decimal:
                !situation.lettersCount && situation.numbersCount > 0 && !situation.othersCount || // hexidecimal:
                (situation.numbersCount || situation.lettersCount) && situation.charTrimmed[1] === "x" && !situation.othersCount)) {
                  // if it's a healthy decimal numeric character reference:
                  var decodedEntitysValue = String.fromCharCode(parseInt(situation.charTrimmed.slice(situation.probablyNumeric === "deci" ? 1 : 2), situation.probablyNumeric === "deci" ? 10 : 16));

                  if (situation.probablyNumeric === "deci" && parseInt(situation.numbersValue, 10) > 918015) {
                    rangesArr2.push({
                      ruleName: "bad-malformed-numeric-character-entity",
                      entityName: null,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: null,
                      rangeValDecoded: null
                    });
                  } else if (opts.decode) {
                    // unless decoding was requested, no further action is needed:
                    rangesArr2.push({
                      ruleName: "encoded-numeric-html-entity-reference",
                      entityName: situation.charTrimmed,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: "&".concat(situation.charTrimmed, ";"),
                      rangeValDecoded: decodedEntitysValue
                    });
                  }
                } else {
                  // RAISE A GENERIC ERROR
                  rangesArr2.push({
                    ruleName: "bad-malformed-numeric-character-entity",
                    entityName: null,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null
                  });
                } // also call the general entity callback if it's given


                if (opts.entityCatcherCb) {
                  opts.entityCatcherCb(whatsOnTheLeft, i + 1);
                }
              } else {
                // it's either named or some sort of messed up HTML entity
                //
                //
                //
                //
                //          NAMED ENTITIES CLAUSES BELOW
                //
                //
                //
                //
                // First, match against case-insensitive list
                // 1. check, maybe it's a known HTML entity
                var _firstChar = letterSeqStartAt;

                var _secondChar = letterSeqStartAt ? right(str, letterSeqStartAt) : null;

                var _tempEnt2;

                if (Object.prototype.hasOwnProperty.call(brokenNamedEntities, situation.charTrimmed.toLowerCase())) {
                  //
                  //                          case I.
                  //
                  _tempEnt2 = situation.charTrimmed;

                  var _decodedEntity2 = decode("&".concat(brokenNamedEntities[situation.charTrimmed.toLowerCase()], ";"));

                  rangesArr2.push({
                    ruleName: "bad-named-html-entity-malformed-".concat(brokenNamedEntities[situation.charTrimmed.toLowerCase()]),
                    entityName: brokenNamedEntities[situation.charTrimmed.toLowerCase()],
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: "&".concat(brokenNamedEntities[situation.charTrimmed.toLowerCase()], ";"),
                    rangeValDecoded: _decodedEntity2
                  });
                } else if (Object.prototype.hasOwnProperty.call(startsWithCaseInsensitive, str[_firstChar].toLowerCase()) && Object.prototype.hasOwnProperty.call(startsWithCaseInsensitive[str[_firstChar].toLowerCase()], str[_secondChar].toLowerCase())) {
                  //
                  //                          case II.
                  //
                  var _tempRes2;

                  var matchedEntity = startsWithCaseInsensitive[str[_firstChar].toLowerCase()][str[_secondChar].toLowerCase()].reduce(function (gatheredSoFar, oneOfKnownEntities) {
                    // find all entities that match on the right of here
                    // rightSeq could theoretically give positive answer, zero index,
                    // but it's impossible here, so we're fine to match "if true".
                    var tempRes = rightSeq.apply(void 0, [str, letterSeqStartAt - 1, {
                      i: true
                    }].concat(_toConsumableArray(oneOfKnownEntities.split(""))));

                    if (tempRes && oneOfKnownEntities !== "nbsp") {
                      return gatheredSoFar.concat([{
                        tempEnt: oneOfKnownEntities,
                        tempRes: tempRes
                      }]);
                    }

                    return gatheredSoFar;
                  }, []);

                  matchedEntity = removeGappedFromMixedCases(matchedEntity);

                  if (matchedEntity) {
                    var _matchedEntity = matchedEntity;
                    _tempEnt2 = _matchedEntity.tempEnt;
                    _tempRes2 = _matchedEntity.tempRes;
                  } // The matching was case insensitive so if anything was found,
                  // it could contain whitespace, or it could contain wrong case.
                  // If no matches were found, it's definitely an unrecognised entity.
                  //
                  // Another consideration is chunks starting with entity's ampersand,
                  // missing semicolon and chunk ends with legit semicolon:
                  // "We spent &pound5;" -> "We spent &pound;5;"
                  //                                        ^ ^
                  //                                       /   \
                  //                                 missing   legit semicol.
                  //                                   added


                  var entitysValue;

                  if (_tempEnt2) {
                    var issue = false;
                    var firstChar2 = _tempRes2.leftmostChar;
                    var secondChar2 = right(str, firstChar2); // precaution against false positives
                    // catch the bail cases:
                    // if it's among uncertain entities, if there is whitespace
                    // around the entity's characters, bail, unless values
                    // un uncertain.json are set to true on that side (amp or
                    // semicol respectively).

                    if (Object.keys(uncertain).includes(potentialEntity) && isStr$1(str[firstChar2 - 1]) && !str[firstChar2 - 1].trim().length && uncertain[potentialEntity].addAmpIfSemiPresent !== true) {
                      letterSeqStartAt = null;
                      return "continue";
                    } // 1. check case-insensitive matched entity "tempEnt"
                    // case-sensitively


                    if (Object.prototype.hasOwnProperty.call(startsWith, str[firstChar2]) && Object.prototype.hasOwnProperty.call(startsWith[str[firstChar2]], str[secondChar2]) && startsWith[str[firstChar2]][str[secondChar2]].includes(situation.charTrimmed)) {
                      entitysValue = situation.charTrimmed; // so entity's case is right, but what about whitespace
                      // between characters?

                      if (i - whatsOnTheLeft - 1 === _tempEnt2.length) {
                        // but it's still an issue if decoding was requested:
                        if (opts.decode) {
                          issue = "encoded-html-entity";
                        }
                      } else {
                        issue = "bad-named-html-entity-malformed";
                      }
                    } else {
                      // case is wrong
                      issue = "bad-named-html-entity-malformed"; // entitysValue = potentialEntity;
                      // Now, we know that our entity "situation.charTrimmed" does exist but
                      // in different character case.
                      // Let's first gather entities that match case-insensitively,
                      // then pick the one that our matched resembles most.

                      var matchingEntities = Object.keys(allNamedEntities).filter(function (entity) {
                        return situation.charTrimmed.toLowerCase().startsWith(entity.toLowerCase());
                      });

                      if (matchingEntities.length === 1) {
                        // if there is one match, Bob's your uncle here's your result
                        entitysValue = matchingEntities[0];
                      } else {
                        // let's pick one.
                        // first, filter the longest entity by length:
                        var filterLongest = matchingEntities.reduce(function (accum, curr) {
                          if (!accum.length || curr.length === accum[0].length) {
                            return accum.concat([curr]);
                          }

                          if (curr.length > accum[0].length) {
                            return [curr];
                          }

                          return accum;
                        }, []);

                        if (filterLongest.length === 1) {
                          entitysValue = filterLongest[0];
                        } else {
                          var missingLetters = filterLongest.map(function (entity) {
                            var count = 0;

                            for (var z = 0, len2 = entity.length; z < len2; z++) {
                              if (entity[z] !== situation.charTrimmed[z]) {
                                count += 1;
                              }
                            }

                            return count;
                          }); // catch ambiguous cases - if there are multiple cases of
                          // minimum missing letter matches, it's inconclusive.
                          // For example, &Aelig; can be either:
                          // * &AElig; accidentally with E in lowercase
                          // * &aelig; accidentally with A in uppercase

                          if (missingLetters.filter(function (val) {
                            return val === Math.min.apply(Math, _toConsumableArray(missingLetters));
                          }).length > 1) {
                            rangesArr2.push({
                              ruleName: "bad-named-html-entity-unrecognised",
                              entityName: null,
                              rangeFrom: whatsOnTheLeft,
                              rangeTo: _tempRes2.rightmostChar + 1 === i ? i + 1 : _tempRes2.rightmostChar + 1,
                              rangeValEncoded: null,
                              rangeValDecoded: null
                            });
                            issue = false;
                          }

                          entitysValue = filterLongest[missingLetters.indexOf(Math.min.apply(Math, _toConsumableArray(missingLetters)))];
                        }
                      }
                    } // let endingIdx = Math.max(i + 1, tempRes.rightmostChar + 1);
                    // was:


                    var endingIdx = _tempRes2.rightmostChar + 1 === i ? i + 1 : _tempRes2.rightmostChar + 1; // 2. submit the issue

                    if (issue) {
                      var _decodedEntity3 = decode("&".concat(entitysValue, ";"));

                      if (str[endingIdx] && str[endingIdx] !== ";" && !str[endingIdx].trim().length && str[right(str, endingIdx)] === ";") {
                        endingIdx = right(str, endingIdx) + 1;
                      }

                      rangesArr2.push({
                        ruleName: "".concat(issue, "-").concat(entitysValue),
                        entityName: entitysValue,
                        rangeFrom: whatsOnTheLeft,
                        rangeTo: endingIdx,
                        rangeValEncoded: "&".concat(entitysValue, ";"),
                        rangeValDecoded: _decodedEntity3
                      });
                    } // 3. ping the entity callback anyway


                    if (opts.entityCatcherCb) {
                      opts.entityCatcherCb(whatsOnTheLeft, endingIdx);
                    }
                  }
                } // if "tempEnt" was not set by now, it is not a known HTML entity


                if (!_tempEnt2) {
                  // check case-insensitively, is it a known broken entity,
                  // for example &poun; (instead of &pound;) - this comes from
                  // an ad-hoc object "brokenNamedEntities" from
                  // package "all-named-html-entities".
                  if (situation.charTrimmed.toLowerCase() !== "&nbsp;") {
                    // it's an unrecognised entity:
                    rangesArr2.push({
                      ruleName: "bad-named-html-entity-unrecognised",
                      entityName: null,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: null,
                      rangeValDecoded: null
                    }); // entity catcher is pinged only with healthy entities -
                    // it's either cb() with broken or catcher - not both.
                    // if (opts.entityCatcherCb) {
                    //   console.log(`1831 call opts.entityCatcherCb()`);
                    //   opts.entityCatcherCb(whatsOnTheLeft, i + 1);
                    // }
                  }
                } //
                //
                //
                //
                //          NAMED ENTITIES CLAUSES ABOVE
                //
                //
                //
                //

              }
            }
          } else if (str[whatsEvenMoreToTheLeft] === "&" && str[i] === ";" && i - whatsEvenMoreToTheLeft < maxLength) {
            //
            //
            //
            //
            // CASE 4 - &*...;
            //
            //
            //
            //
            var _situation = resemblesNumericEntity(str, whatsEvenMoreToTheLeft + 1, i); // push the issue:


            rangesArr2.push({
              ruleName: "".concat(_situation.probablyNumeric ? "bad-malformed-numeric-character-entity" : "bad-named-html-entity-unrecognised"),
              entityName: null,
              rangeFrom: whatsEvenMoreToTheLeft,
              rangeTo: i + 1,
              rangeValEncoded: null,
              rangeValDecoded: null
            });
          }
        } // one-character chunks or chunks ending with ampersand get wiped:


        letterSeqStartAt = null;
      } // Catch the start of the sequence of latin letters. It's necessary to
      // tackle named HTML entity recognition, missing ampersands and semicolons.


      if (letterSeqStartAt === null && isLatinLetterOrNumberOrHash(str[i]) && str[i + 1]) {
        letterSeqStartAt = i;
      } // catch amp;


      if (str[i] === "a") {
        // TODO - rebase with chomp()
        // // 1. catch recursively-encoded cases. They're easy actually, the task will
        // // be deleting sequence of repeated "amp;" between ampersand and letter.
        // For example, we have this:
        // text&   amp  ;  a  m   p   ;  nbsp;text
        // We start at the opening ampersand at index 4;
        var singleAmpOnTheRight = rightSeq(str, i, "m", "p", ";");

        if (singleAmpOnTheRight) {
          // if we had to delete all amp;amp;amp; and leave only ampersand, this
          // will be the index to delete up to:
          var toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1; // so one &amp; is confirmed.

          var nextAmpOnTheRight = rightSeq(str, singleAmpOnTheRight.rightmostChar, "a", "m", "p", ";");

          if (nextAmpOnTheRight) {
            toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;
            var temp;

            do {
              temp = rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");

              if (temp) {
                toDeleteAllAmpEndHere = temp.rightmostChar + 1;
              }
            } while (temp);
          } // What we have is toDeleteAllAmpEndHere which marks where the last amp;
          // semicolon ends (were we to delete the whole thing).
          // For example, in:
          // text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text
          // this would be index 49, the "n" from "nbsp;"


          var firstCharThatFollows = right(str, toDeleteAllAmpEndHere - 1);
          var secondCharThatFollows = firstCharThatFollows ? right(str, firstCharThatFollows) : null; // If entity follows, for example,
          // text&   amp  ;  a  m   p   ;     a  m   p   ;    nbsp;text
          // we delete from the first ampersand to the beginning of that entity.
          // Otherwise, we delete only repetitions of amp; + whitespaces in between.

          var matchedTemp;

          if (secondCharThatFollows && Object.prototype.hasOwnProperty.call(startsWith, str[firstCharThatFollows]) && Object.prototype.hasOwnProperty.call(startsWith[str[firstCharThatFollows]], str[secondCharThatFollows]) && startsWith[str[firstCharThatFollows]][str[secondCharThatFollows]].some(function (entity) {
            // if (str.entStartsWith(`${entity};`, firstCharThatFollows)) {
            var matchEntityOnTheRight = rightSeq.apply(void 0, [str, toDeleteAllAmpEndHere - 1].concat(_toConsumableArray(entity.slice(""))));

            if (matchEntityOnTheRight) {
              matchedTemp = entity;
              return true;
            }
          })) {
            doNothingUntil = firstCharThatFollows + matchedTemp.length + 1; // is there ampersand on the left of "i", the first amp;?

            var _whatsOnTheLeft = left(str, i);

            if (str[_whatsOnTheLeft] === "&") {
              rangesArr2.push({
                ruleName: "bad-named-html-entity-multiple-encoding",
                entityName: matchedTemp,
                rangeFrom: _whatsOnTheLeft,
                rangeTo: doNothingUntil,
                rangeValEncoded: "&".concat(matchedTemp, ";"),
                rangeValDecoded: decode("&".concat(matchedTemp, ";"))
              });
            } else if (_whatsOnTheLeft) {
              // we need to add the ampersand as well. Now, another consideration
              // appears: whitespace and where exactly to put it. Algorithmically,
              // right here, at this first letter "a" from "amp;&<some-entity>;"
              var rangeFrom = i;
              var spaceReplacement = "";

              if (str[i - 1] === " ") ;

              if (opts.cb) {
                rangesArr2.push({
                  ruleName: "bad-named-html-entity-multiple-encoding",
                  entityName: matchedTemp,
                  rangeFrom: rangeFrom,
                  rangeTo: doNothingUntil,
                  rangeValEncoded: "".concat(spaceReplacement, "&").concat(matchedTemp, ";"),
                  rangeValDecoded: "".concat(spaceReplacement).concat(decode("&".concat(matchedTemp, ";")))
                });
              }
            }
          }
        }
      } // catch ampersand


      if (str[i] === "&") {
        // 1. Tackle false positives, where ampersand follows the caught characters
        if (nbsp.nameStartsAt && nbsp.nameStartsAt < i && (nbsp.matchedN || nbsp.matchedB || nbsp.matchedS || nbsp.matchedP)) {
          nbspWipe();
        } // 2. mark the potential beginning of an nbsp:
        // if (nbsp.nameStartsAt === null) {
        //   // 2-1. Tag beginning has not been marked.
        //   if (nbsp.ampersandNecessary === null) {
        //     // The check above is for not false but null.
        //
        //     // mark the beginning
        //     nbsp.nameStartsAt = i;
        //     console.log(
        //       `2170 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
        //         nbsp.nameStartsAt
        //       }`
        //     );
        //     nbsp.ampersandNecessary = false;
        //     console.log(
        //       `2176 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = ${
        //         nbsp.ampersandNecessary
        //       }`
        //     );
        //   }
        // }


        nbsp.nameStartsAt = i;
        nbsp.ampersandNecessary = false;
      } // catch "n"


      if (str[i] && str[i].toLowerCase() === "n") {
        // failsafe
        if (str[i - 1] && str[i - 1].toLowerCase() === "i" && str[i + 1] && str[i + 1].toLowerCase() === "s") {
          nbspWipe();
          counter += 1;
          return "continue";
        } // action


        if (nbsp.matchedN === null) {
          nbsp.matchedN = i;
        }

        if (nbsp.nameStartsAt === null) {
          // 1. mark it
          nbsp.nameStartsAt = i; // 2. tend the ampersand situation

          if (nbsp.ampersandNecessary === null && !ampersandNotNeeded) {
            // if by now there are signs of ampersand records, it must be added later:
            nbsp.ampersandNecessary = true;
          } else if (nbsp.ampersandNecessary !== true) {
            // in all other cases, set it as not needed
            nbsp.ampersandNecessary = false;
          }
        }
      } // catch "b"


      if (str[i] && str[i].toLowerCase() === "b") {
        if (nbsp.nameStartsAt !== null) {
          // clean code, N was already detected
          if (nbsp.matchedB === null) {
            nbsp.matchedB = i;
          }
        } else if (nbsp.patience) {
          // dirty code case because ampersand or "n" are missing so far
          // 1. Patience is reduced for every single character missing. There can
          // be only one character missing out of n-b-s-p.
          nbsp.patience -= 1; // 2. mark the start

          nbsp.nameStartsAt = i;
          nbsp.matchedB = i; // 3. tend the ampersand situation

          if (nbsp.ampersandNecessary === null && !ampersandNotNeeded) {
            // if by now there are signs of ampersand records, it must be added later:
            nbsp.ampersandNecessary = true;
          } else if (nbsp.ampersandNecessary !== true) {
            // in all other cases, set it as not needed
            nbsp.ampersandNecessary = false;
          }
        } else {
          // wipe
          nbspWipe();
          counter += 1;
          return "continue";
        }
      } // catch "s"


      if (str[i] && str[i].toLowerCase() === "s") {
        if (nbsp.nameStartsAt !== null) {
          // clean code
          if (nbsp.matchedS === null) {
            nbsp.matchedS = i;
          }
        } else if (nbsp.patience) {
          // dirty code case because ampersand or "n" are missing so far
          // 1. Patience is reduced for every single character missing. There can
          // be only one character missing out of n-b-s-p.
          nbsp.patience -= 1; // 2. mark the start

          nbsp.nameStartsAt = i;
          nbsp.matchedS = i; // 3. tend the ampersand situation

          if (nbsp.ampersandNecessary === null && !ampersandNotNeeded) {
            // if by now there are signs of ampersand records, it must be added later:
            nbsp.ampersandNecessary = true;
          } else if (nbsp.ampersandNecessary !== true) {
            // in all other cases, set it as not needed
            nbsp.ampersandNecessary = false;
          }
        } else {
          // wipe
          nbspWipe();
          counter += 1;
          return "continue";
        }
      } // catch "p"


      if (str[i] && str[i].toLowerCase() === "p") {
        if (leftSeq(str, i, "t", "h", "i", "n", "s")) {
          nbspWipe();
        } else if (nbsp.nameStartsAt !== null) {
          // clean code
          if (nbsp.matchedP === null) {
            nbsp.matchedP = i;
          }
        } else if (nbsp.patience) {
          // dirty code case because ampersand or "n" are missing so far
          // 1. Patience is reduced for every single character missing. There can
          // be only one character missing out of n-b-s-p.
          nbsp.patience -= 1; // 2. mark the start

          nbsp.nameStartsAt = i;
          nbsp.matchedP = i; // 3. tend the ampersand situation

          if (nbsp.ampersandNecessary === null && !ampersandNotNeeded) {
            // if by now there are signs of ampersand records, it must be added later:
            nbsp.ampersandNecessary = true;
          } else if (nbsp.ampersandNecessary !== true) {
            // in all other cases, set it as not needed
            nbsp.ampersandNecessary = false;
          }
        } else {
          // wipe
          nbspWipe();
          counter += 1;
          return "continue";
        }
      } // catch semicolon


      if (str[i] === ";") {
        if (nbsp.nameStartsAt !== null) {
          nbsp.matchedSemicol = i; // ensure semicolon doesn't precede the n-b-s-p letters, but this applies
          // only if one letter is caught before the semicolon

          if (nbsp.matchedN && // <---- just n
          !nbsp.matchedB && !nbsp.matchedS && !nbsp.matchedP || !nbsp.matchedN && nbsp.matchedB && // <---- just b
          !nbsp.matchedS && !nbsp.matchedP || !nbsp.matchedN && !nbsp.matchedB && nbsp.matchedS && // <---- just s
          !nbsp.matchedP || !nbsp.matchedN && !nbsp.matchedB && !nbsp.matchedS && nbsp.matchedP // <---- just p
          ) {
              nbspWipe();
            }
        }
      } // catch #x of messed up entities without ampersand (like #x26;)


      if (str[i] === "#" && right(str, i) && str[right(str, i)].toLowerCase() === "x" && (!str[i - 1] || !left(str, i) || str[left(str, i)] !== "&")) {
        if (isNumber(str[right(str, right(str, i))])) {
          brokenNumericEntityStartAt = i;
        }
      } // // catch whitespace
      // ["n", "b", "s", "p"] set, reduce "patience" for each character in a
      // sequence as long as it's not from the set.


      if (nbsp.nameStartsAt !== null && i > nbsp.nameStartsAt && str[i] && str[i].toLowerCase() !== "n" && str[i].toLowerCase() !== "b" && str[i].toLowerCase() !== "s" && str[i].toLowerCase() !== "p" && str[i] !== "&" && str[i] !== ";" && str[i] !== " ") {
        if (nbsp.patience) {
          nbsp.patience -= 1;
        } else {
          nbspWipe();
          counter += 1;
          return "continue";
        }
      } //            |
      //            |
      //            |
      //            |
      //            |
      // PART 4. LOGGING:
      //            |
      //            |
      //            |
      //            |
      //            |
      // console.log(`ampersandNotNeeded = ${ampersandNotNeeded}`);
      // console.log(
      //   `${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} = ${JSON.stringify(
      //     nbsp,
      //     null,
      //     4
      //   )}${
      //     Array.isArray(rangesArr2) && rangesArr2.length
      //       ? `\n${`\u001b[${32}m${`rangesArr2`}\u001b[${39}m`} = ${JSON.stringify(
      //           rangesArr2,
      //           null,
      //           4
      //         )}`
      //       : ""
      //   }`
      // );


      counter += 1;
    };

    for (var i = 0; i < len; i++) {
      var _ret = _loop(i);

      if (_ret === "continue") continue;
    } //                                      ^
    //                                     /|\
    //                                    / | \
    //                                   /  |  \
    //                                  /   |   \
    //                                 /    |    \
    //                                      |
    //                                      |
    //              T   H   E       L   O   O   P       E   N   D   S
    //                                      |
    //                                      |
    //                                      |
    //                                      |
    //                                      |
    //                                      |


    if (!rangesArr2.length) {
      return [];
    } // return rangesArr2.map(opts.cb);
    // if any two issue objects have identical "from" indexes, remove the one
    // which spans more. For example, [4, 8] and [4, 12] would end up [4, 12]
    // winning and [4, 8] removed. Obviously, it's not arrays, it's objects,
    // format for example
    // {
    //     "ruleName": "bad-named-html-entity-malformed-amp",
    //     "entityName": "amp",
    //     "rangeFrom": 4,
    //     "rangeTo": 8,
    //     "rangeValEncoded": "&amp;",
    //     "rangeValDecoded": "&"
    // },
    // so instead of [4, 8] that would be [rangeFrom, rangeTo]...


    var res = rangesArr2.filter(function (filteredRangeObj, i) {
      return rangesArr2.every(function (oneOfEveryObj, y) {
        return i === y || !(filteredRangeObj.rangeFrom >= oneOfEveryObj.rangeFrom && filteredRangeObj.rangeTo < oneOfEveryObj.rangeTo);
      });
    }).filter(function (filteredRangeObj, i, allRangesArr) {
      if (filteredRangeObj.ruleName === "bad-named-html-entity-unrecognised" && allRangesArr.some(function (oneRangeObj, y) {
        return i !== y && // prevent matching itself
        oneRangeObj.rangeFrom <= filteredRangeObj.rangeFrom && oneRangeObj.rangeTo === filteredRangeObj.rangeTo;
      })) {
        return false;
      } // ELSE


      return true;
    }).map(opts.cb); // filteredRangeObj.rangeFrom !== oneOfEveryObj.rangeFrom ||
    // filteredRangeObj.rangeTo > oneOfEveryObj.rangeTo

    return res;
  }

  return stringFixBrokenNamedEntities;

})));
