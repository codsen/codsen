/**
 * generate-atomic-css
 * Generate Atomic CSS
 * Version: 1.2.49
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/generate-atomic-css/
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.generateAtomicCss = {}));
}(this, (function (exports) { 'use strict';

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
    return !!value && _typeof(value) == 'object';
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

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  	  path: basedir,
  	  exports: {},
  	  require: function (path, base) {
        return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
      }
  	}, fn(module, module.exports), module.exports;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
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

    var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
    /** Detect free variable `self`. */

    var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
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
        _Symbol = root.Symbol,
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

    var symbolProto = _Symbol ? _Symbol.prototype : undefined,
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
      var type = _typeof(value);

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
      var type = _typeof(value);

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
      return !!value && _typeof(value) == 'object';
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

  function x(something) {
    var res = {
      value: something,
      hungry: false,
      optional: false
    };

    if ((res.value.endsWith("?*") || res.value.endsWith("*?")) && res.value.length > 2) {
      res.value = res.value.slice(0, res.value.length - 2);
      res.optional = true;
      res.hungry = true;
    } else if (res.value.endsWith("?") && res.value.length > 1) {
      res.value = res.value.slice(0, ~-res.value.length);
      res.optional = true;
    } else if (res.value.endsWith("*") && res.value.length > 1) {
      res.value = res.value.slice(0, ~-res.value.length);
      res.hungry = true;
    }

    return res;
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

    for (var i = idx + 1, len = str.length; i < len; i++) {
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

    if (str[~-idx] && (!stopAtNewlines && str[~-idx].trim() || stopAtNewlines && (str[~-idx].trim() || "\n\r".includes(str[~-idx])))) {
      return ~-idx;
    }

    if (str[idx - 2] && (!stopAtNewlines && str[idx - 2].trim() || stopAtNewlines && (str[idx - 2].trim() || "\n\r".includes(str[idx - 2])))) {
      return idx - 2;
    }

    for (var i = idx; i--;) {
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

    if (direction === "right" && !str[idx + 1] || direction === "left" && !str[~-idx]) {
      return null;
    }

    var lastFinding = idx;
    var gaps = [];
    var leftmostChar;
    var rightmostChar;
    var satiated;
    var i = 0;

    while (i < args.length) {
      if (!isStr(args[i]) || !args[i].length) {
        i += 1;
        continue;
      }

      var _x = x(args[i]),
          value = _x.value,
          optional = _x.optional,
          hungry = _x.hungry;

      var whattsOnTheSide = direction === "right" ? right(str, lastFinding) : left(str, lastFinding);

      if (opts.i && str[whattsOnTheSide].toLowerCase() === value.toLowerCase() || !opts.i && str[whattsOnTheSide] === value) {
        var temp = direction === "right" ? right(str, whattsOnTheSide) : left(str, whattsOnTheSide);

        if (hungry && (opts.i && str[temp].toLowerCase() === value.toLowerCase() || !opts.i && str[temp] === value)) {
          satiated = true;
        } else {
          i += 1;
        }

        if (direction === "right" && whattsOnTheSide > lastFinding + 1) {
          gaps.push([lastFinding + 1, whattsOnTheSide]);
        } else if (direction === "left" && whattsOnTheSide < ~-lastFinding) {
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
      gaps: gaps,
      leftmostChar: leftmostChar,
      rightmostChar: rightmostChar
    };
  }

  function leftSeq(str, idx) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (!args.length) {
      return left(str, idx);
    }

    var defaults = {
      i: false
    };
    var opts;

    if (lodash_isplainobject(args[0])) {
      opts = _objectSpread2(_objectSpread2({}, defaults), args.shift());
    } else {
      opts = defaults;
    }

    return seq("left", str, idx, opts, Array.from(args).reverse());
  }

  function rightSeq(str, idx) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    if (!args.length) {
      return right(str, idx);
    }

    var defaults = {
      i: false
    };
    var opts;

    if (lodash_isplainobject(args[0])) {
      opts = _objectSpread2(_objectSpread2({}, defaults), args.shift());
    } else {
      opts = defaults;
    }

    return seq("right", str, idx, opts, args);
  }

  var version = "1.2.49";

  var isArr = Array.isArray;

  function isStr$1(something) {
    return typeof something === "string";
  }

  var headsAndTails = {
    CONFIGHEAD: "GENERATE-ATOMIC-CSS-CONFIG-STARTS",
    CONFIGTAIL: "GENERATE-ATOMIC-CSS-CONFIG-ENDS",
    CONTENTHEAD: "GENERATE-ATOMIC-CSS-CONTENT-STARTS",
    CONTENTTAIL: "GENERATE-ATOMIC-CSS-CONTENT-ENDS"
  };
  var units = ["px", "em", "%", "rem", "cm", "mm", "in", "pt", "pc", "ex", "ch", "vw", "vmin", "vmax"];
  var CONFIGHEAD = headsAndTails.CONFIGHEAD,
      CONFIGTAIL = headsAndTails.CONFIGTAIL,
      CONTENTHEAD = headsAndTails.CONTENTHEAD,
      CONTENTTAIL = headsAndTails.CONTENTTAIL;
  var padLeftIfTheresOnTheLeft = [":"];

  function extractConfig(str) {
    var extractedConfig = str;
    var rawContentAbove = "";
    var rawContentBelow = "";

    if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL)) {
      if (str.indexOf(CONFIGTAIL) !== -1 && str.indexOf(CONTENTHEAD) !== -1 && str.indexOf(CONFIGTAIL) > str.indexOf(CONTENTHEAD)) {
        throw new Error("generate-atomic-css: [THROW_ID_02] Config heads are after config tails!");
      }

      var sliceFrom = str.indexOf(CONFIGHEAD) + CONFIGHEAD.length;
      var sliceTo = str.indexOf(CONFIGTAIL); // if there are opening CSS comments, include them:

      if (str[right(str, sliceFrom)] === "*" && str[right(str, right(str, sliceFrom))] === "/") {
        sliceFrom = right(str, right(str, sliceFrom)) + 1;
      } // if there are closing CSS comments include them too:


      if (str[left(str, sliceTo)] === "*" && str[left(str, left(str, sliceTo))] === "/") {
        sliceTo = left(str, left(str, sliceTo));
      }

      extractedConfig = str.slice(sliceFrom, sliceTo).trim();

      if (!isStr$1(extractedConfig) || !extractedConfig.trim().length) {
        return {
          log: {
            count: 0
          },
          result: ""
        };
      }
    } else if (str.includes(CONFIGHEAD) && !str.includes(CONFIGTAIL) && str.includes(CONTENTHEAD)) {
      if (str.indexOf(CONFIGHEAD) > str.indexOf(CONTENTHEAD)) {
        throw new Error("generate-atomic-css: [THROW_ID_03] Config heads are after content heads!");
      }

      extractedConfig = str.slice(str.indexOf(CONFIGHEAD) + CONFIGHEAD.length, str.indexOf(CONTENTHEAD));
    } else if (!str.includes(CONFIGHEAD) && !str.includes(CONFIGTAIL) && (str.includes(CONTENTHEAD) || str.includes(CONTENTTAIL))) {
      // strange case where instead of config heads/tails we have content heads/tails
      extractedConfig = str; // remove content head

      if (extractedConfig.includes(CONTENTHEAD)) {
        // if content heads are present, cut off right after the closing comment
        // if such follows, or right after heads if not
        if (left(str, extractedConfig.indexOf(CONTENTHEAD))) {
          var _sliceTo2 = extractedConfig.indexOf(CONTENTHEAD); // if there are opening or closing comments, don't include those


          if (leftSeq(str, _sliceTo2, "/", "*")) {
            _sliceTo2 = leftSeq(str, _sliceTo2, "/", "*").leftmostChar;
          }

          rawContentAbove = _sliceTo2 === 0 ? "" : str.slice(0, _sliceTo2);
        }

        var _sliceFrom = extractedConfig.indexOf(CONTENTHEAD) + CONTENTHEAD.length;

        if (rightSeq(extractedConfig, _sliceFrom - 1, "*", "/")) {
          _sliceFrom = rightSeq(extractedConfig, _sliceFrom - 1, "*", "/").rightmostChar + 1;
        }

        var _sliceTo = null;

        if (str.includes(CONTENTTAIL)) {
          _sliceTo = str.indexOf(CONTENTTAIL); // don't include comment on the left

          if (str[left(str, _sliceTo)] === "*" && str[left(str, left(str, _sliceTo))] === "/") {
            _sliceTo = left(str, left(str, _sliceTo));
          } // is there content afterwards?


          var contentAfterStartsAt = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;

          if (str[right(str, contentAfterStartsAt - 1)] === "*" && str[right(str, right(str, contentAfterStartsAt - 1))] === "/") {
            contentAfterStartsAt = right(str, right(str, contentAfterStartsAt - 1)) + 1; // if there are non-whitespace characters, that's rawContentBelow
          }

          if (right(str, contentAfterStartsAt)) {
            rawContentBelow = str.slice(contentAfterStartsAt);
          }
        }

        if (_sliceTo) {
          extractedConfig = extractedConfig.slice(_sliceFrom, _sliceTo).trim();
        } else {
          extractedConfig = extractedConfig.slice(_sliceFrom).trim();
        }
      } // remove content tail
      else if (extractedConfig.includes(CONTENTTAIL)) {
          var contentInFront = [];
          var stopFilteringAndPassAllLines = false;
          extractedConfig = extractedConfig.split("\n").filter(function (rowStr) {
            if (!rowStr.includes("$$$") && !stopFilteringAndPassAllLines) {
              if (!stopFilteringAndPassAllLines) {
                contentInFront.push(rowStr);
              }

              return false;
            } // ... so the row contains $$$


            if (!stopFilteringAndPassAllLines) {
              stopFilteringAndPassAllLines = true;
              return true;
            }

            return true;
          }).join("\n");

          var _sliceTo3 = extractedConfig.indexOf(CONTENTTAIL);

          if (leftSeq(extractedConfig, _sliceTo3, "/", "*")) {
            _sliceTo3 = leftSeq(extractedConfig, _sliceTo3, "/", "*").leftmostChar;
          }

          extractedConfig = extractedConfig.slice(0, _sliceTo3).trim();

          if (contentInFront.length) {
            rawContentAbove = "".concat(contentInFront.join("\n"), "\n");
          } // retrieve the content after content tails


          var _contentAfterStartsAt;

          if (right(str, str.indexOf(CONTENTTAIL) + CONTENTTAIL.length)) {
            _contentAfterStartsAt = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;

            if (str[right(str, _contentAfterStartsAt)] === "*" && str[right(str, right(str, _contentAfterStartsAt))] === "/") {
              _contentAfterStartsAt = right(str, right(str, _contentAfterStartsAt)) + 1;

              if (right(str, _contentAfterStartsAt)) {
                rawContentBelow = str.slice(_contentAfterStartsAt);
              }
            }
          }
        }
    } else {
      var contentHeadsRegex = new RegExp("(\\/\\s*\\*\\s*)*".concat(CONTENTHEAD, "(\\s*\\*\\s*\\/)*"));
      var contentTailsRegex = new RegExp("(\\/\\s*\\*\\s*)*".concat(CONTENTTAIL, "(\\s*\\*\\s*\\/)*"));
      var stopFiltering = false;
      var gatheredLinesAboveTopmostConfigLine = [];
      var gatheredLinesBelowLastConfigLine = []; // remove all lines above the first line which contains $$$

      var configLines = str.split("\n").filter(function (rowStr) {
        if (stopFiltering) {
          return true;
        }

        if (!rowStr.includes("$$$") && !rowStr.includes("{") && !rowStr.includes(":")) {
          gatheredLinesAboveTopmostConfigLine.push(rowStr);
          return false;
        } // but if it does contain $$$...


        stopFiltering = true;
        return true;
      }); // now we need to separate any rows in the end that don't contain $$$

      for (var i = configLines.length; i--;) {
        if (!configLines[i].includes("$$$") && !configLines[i].includes("}") && !configLines[i].includes(":")) {
          gatheredLinesBelowLastConfigLine.unshift(configLines.pop());
        } else {
          break;
        }
      }

      extractedConfig = configLines.join("\n").replace(contentHeadsRegex, "").replace(contentTailsRegex, "");

      if (gatheredLinesAboveTopmostConfigLine.length) {
        rawContentAbove = "".concat(gatheredLinesAboveTopmostConfigLine.join("\n"), "\n");
      }

      if (gatheredLinesBelowLastConfigLine.length) {
        rawContentBelow = "\n".concat(gatheredLinesBelowLastConfigLine.join("\n"));
      }
    }

    return [extractedConfig, rawContentAbove, rawContentBelow];
  }

  function trimBlankLinesFromLinesArray(lineArr) {
    var trim = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    // killswitch is activated, do nothing
    if (!trim) {
      return lineArr;
    }

    var copyArr = Array.from(lineArr);

    if (copyArr.length && isStr$1(copyArr[0]) && !copyArr[0].trim().length) {
      do {
        copyArr.shift();
      } while (isStr$1(copyArr[0]) && !copyArr[0].trim().length);
    }

    if (copyArr.length && isStr$1(copyArr[copyArr.length - 1]) && !copyArr[copyArr.length - 1].trim().length) {
      do {
        copyArr.pop();
      } while (copyArr && copyArr[copyArr.length - 1] && !copyArr[copyArr.length - 1].trim().length);
    }

    return copyArr;
  } // takes string for example, .mt$$$ { margin-top: $$$px; }|3
  // and extracts the parts after the pipe
  // also, we use it for simpler format sources that come from wizard on the
  // webapp, format .mt|0|500 - same business, extract digits between pipes


  function extractFromToSource(str) {
    var fromDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var toDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;
    var from = fromDefault;
    var to = toDefault;
    var source = str;
    var tempArr;

    if (str.lastIndexOf("}") > 0 && str.slice(str.lastIndexOf("}") + 1).includes("|")) {
      tempArr = str.slice(str.lastIndexOf("}") + 1).split("|").filter(function (val) {
        return val.trim().length;
      }).map(function (val) {
        return val.trim();
      }).filter(function (val) {
        return String(val).split("").every(function (char) {
          return /\d/g.test(char);
        });
      });
    } else if (str.includes("|")) {
      tempArr = str.split("|").filter(function (val) {
        return val.trim().length;
      }).map(function (val) {
        return val.trim();
      }).filter(function (val) {
        return String(val).split("").every(function (char) {
          return /\d/g.test(char);
        });
      });
    }

    if (isArr(tempArr)) {
      if (tempArr.length === 1) {
        to = Number.parseInt(tempArr[0], 10);
      } else if (tempArr.length > 1) {
        from = Number.parseInt(tempArr[0], 10);
        to = Number.parseInt(tempArr[1], 10);
      }
    } // extract the source string - it's everything from zero to first pipe
    // that follows the last closing curly brace


    if (str.lastIndexOf("}") > 0 && str.slice(str.lastIndexOf("}") + 1).includes("|")) {
      source = str.slice(0, str.indexOf("|", str.lastIndexOf("}") + 1)).trimEnd();

      if (source.trim().startsWith("|")) {
        while (source.trim().startsWith("|")) {
          source = source.trimStart().slice(1);
        }
      }
    } else {
      var lastPipeWasAt = null;
      var firstNonPipeNonWhitespaceCharMet = false;
      var startFrom = 0;
      var endTo = str.length; // null is fresh state, true is met, false is pattern of only digits was broken

      var onlyDigitsAndWhitespaceBeenMet = null;

      for (var i = 0, len = str.length; i < len; i++) {
        // first "cell" between pipes which contains only digits terminates the
        // loop; its opening pipe is "endTo", we slice up to it
        if ("0123456789".includes(str[i])) {
          // if it's digit...
          if (onlyDigitsAndWhitespaceBeenMet === null && str[i].trim().length) {
            onlyDigitsAndWhitespaceBeenMet = true;
          }
        } // if not digit...
        else if (str[i] !== "|" && str[i].trim().length) {
            onlyDigitsAndWhitespaceBeenMet = false;
          } // catch the last character


        if (!str[i + 1] && onlyDigitsAndWhitespaceBeenMet) {
          endTo = lastPipeWasAt;
        } // catch pipe


        if (str[i] === "|") {
          if (onlyDigitsAndWhitespaceBeenMet) {
            endTo = lastPipeWasAt;
            break;
          }

          lastPipeWasAt = i; // reset:

          onlyDigitsAndWhitespaceBeenMet = null;
        } else if (!firstNonPipeNonWhitespaceCharMet && str[i].trim().length) {
          firstNonPipeNonWhitespaceCharMet = true;

          if (lastPipeWasAt !== null) {
            startFrom = lastPipeWasAt + 1;
          }
        }
      }

      source = str.slice(startFrom, endTo).trimEnd();
    }

    return [from, to, source];
  }

  function prepLine(str, progressFn, subsetFrom, subsetTo, generatedCount, pad) {
    //
    //
    //
    //                PART I. Extract from, to and source values
    //
    //
    //
    var currentPercentageDone;
    var lastPercentage = 0; // we need to extract the "from" and to "values"
    // the separator is vertical pipe, which is a legit CSS selector

    var _extractFromToSource = extractFromToSource(str, 0, 500),
        _extractFromToSource2 = _slicedToArray(_extractFromToSource, 3),
        from = _extractFromToSource2[0],
        to = _extractFromToSource2[1],
        source = _extractFromToSource2[2]; //
    //
    //
    //           PART II. extract dollar-dollar-dollar positions and types
    //
    //
    //


    var subsetRange = subsetTo - subsetFrom;
    var res = ""; // traverse

    var _loop = function _loop(i) {
      var debtPaddingLen = 0; // if (pad) {

      var startPoint = 0;

      var _loop2 = function _loop2(y, len) {
        var charcode = source[y].charCodeAt(0); // catch third dollar of three dollars in a row
        // -----------------------------------------------------------------------

        if (source[y] === "$" && source[y - 1] === "$" && source[y - 2] === "$") {
          // submit all the content up until now
          var restOfStr = source.slice(y + 1);
          var unitFound;

          if (i === 0 && // eslint-disable-next-line consistent-return, array-callback-return
          units.some(function (unit) {
            if (restOfStr.startsWith(unit)) {
              unitFound = unit;
              return true;
            }
          }) && (source[right(source, y + unitFound.length)] === "{" || !source[y + unitFound.length + 1].trim().length)) {
            res += "".concat(source.slice(startPoint, y - 2)).concat(pad ? String(i).padStart(String(to).length - String(i).length + unitFound.length + 1) : i);
            startPoint = y + 1 + (unitFound ? unitFound.length : 0);
          } else {
            // extract units if any follow the $$$
            var unitThatFollow; // eslint-disable-next-line consistent-return, array-callback-return

            units.some(function (unit) {
              if (source.startsWith(unit, y + 1)) {
                unitThatFollow = unit;
                return true;
              }
            });

            if (!source[y - 3].trim().length || // eslint-disable-next-line
            padLeftIfTheresOnTheLeft.some(function (val) {
              return source.slice(startPoint, y - 2).trim().endsWith(val);
            })) {
              // if left-side padding can be possible:
              // if the chunk we're adding starts with unit, we need to remove it
              // if it's zero'th row
              var temp = 0;

              if (i === 0) {
                // eslint-disable-next-line no-loop-func
                units.some(function (unit) {
                  if ("".concat(source.slice(startPoint, y - 2)).startsWith(unit)) {
                    temp = unit.length;
                  }

                  return true;
                });
              }

              res += "".concat(source.slice(startPoint + temp, y - 2)).concat(pad ? String(i).padStart(String(to).length + (i === 0 && unitThatFollow ? unitThatFollow.length : 0)) : i);
            } else if (!source[y + 1].trim().length || source[right(source, y)] === "{") {
              // if right-side padding can be possible:
              res += "".concat(source.slice(startPoint, y - 2)).concat(pad ? String(i).padEnd(String(to).length + (i === 0 && unitThatFollow ? unitThatFollow.length : 0)) : i);
            } else {
              res += "".concat(source.slice(startPoint, y - 2)).concat(i); // also, make a note of padding which we'll need to do later,
              // in front of the next opening curlie.
              // for example, range is 0-10, so 2 digit padding, and we have
              // .pt0px[lang|=en]
              // this zero above needs to be padded at the next available location
              // that is before opening curlie.
              //

              if (pad) {
                debtPaddingLen = String(to).length - String(i).length;
              }
            }

            startPoint = y + 1;
          }
        } // catch opening curlie
        // -----------------------------------------------------------------------


        if (source[y] === "{" && pad) {
          if (debtPaddingLen) {
            res += "".concat(source.slice(startPoint, y)).concat(" ".repeat(debtPaddingLen));
            startPoint = y;
            debtPaddingLen = 0;
          }
        } // catch the last character of a line


        if (!source[y + 1]) {
          var _unitFound;

          var _restOfStr = source.slice(startPoint);

          if (i === 0 && // eslint-disable-next-line
          units.some(function (unit) {
            if (_restOfStr.startsWith(unit)) {
              _unitFound = unit;
              return true;
            }
          })) {
            res += "".concat(source.slice(startPoint + _unitFound.length));
          } else {
            res += "".concat(source.slice(startPoint));
          } // add line break


          res += "".concat(i !== to ? "\n" : "");
        }
      };

      for (var y = 0, len = source.length; y < len; y++) {
        _loop2(y);
      } // eslint-disable-next-line no-param-reassign


      generatedCount.count += 1;

      if (typeof progressFn === "function") {
        currentPercentageDone = Math.floor(subsetFrom + i / (to - from) * subsetRange);

        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          progressFn(currentPercentageDone);
        }
      }
    };

    for (var i = from; i <= to; i++) {
      _loop(i);
    }

    return res;
  }

  function bump(str, thingToBump) {
    if (/\.\w/g.test(str)) {
      // eslint-disable-next-line no-param-reassign
      thingToBump.count += 1;
    }

    return str;
  }

  function prepConfig(str, progressFn, progressFrom, progressTo) {
    var trim = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    var generatedCount = arguments.length > 5 ? arguments[5] : undefined;
    var pad = arguments.length > 6 ? arguments[6] : undefined;
    // all rows will report the progress from progressFrom to progressTo.
    // For example, defaults 0 to 100.
    // If there are for example 5 rows, each row will iterate through
    // (100-0)/5 = 20 percent range. This means, progress bar will be jumpy:
    // it will pass rows without $$$ quick but ones with $$$ slow and granular.
    return trimBlankLinesFromLinesArray(str.split(/\r?\n/).map(function (rowStr, i, arr) {
      return rowStr.includes("$$$") ? prepLine(rowStr, progressFn, progressFrom + (progressTo - progressFrom) / arr.length * i, progressFrom + (progressTo - progressFrom) / arr.length * (i + 1), generatedCount, pad) : bump(rowStr, generatedCount);
    }), trim).join("\n");
  }

  function genAtomic(str, originalOpts) {
    function trimIfNeeded(str2) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      // if config and heads/tails are turned off, don't trim
      if (!opts.includeConfig && !opts.includeHeadsAndTails) {
        return str2;
      }

      return str2.trim();
    }

    if (typeof str !== "string") {
      throw new Error("generate-atomic-css: [THROW_ID_01] First input argument must be a string! It was given as \"".concat(JSON.stringify(str, null, 4), "\" (type ").concat(_typeof(str), ")"));
    }

    var CONFIGHEAD = headsAndTails.CONFIGHEAD,
        CONFIGTAIL = headsAndTails.CONFIGTAIL,
        CONTENTHEAD = headsAndTails.CONTENTHEAD,
        CONTENTTAIL = headsAndTails.CONTENTTAIL;
    var defaults = {
      includeConfig: true,
      includeHeadsAndTails: true,
      pad: true,
      configOverride: null,
      reportProgressFunc: null,
      reportProgressFuncFrom: 0,
      reportProgressFuncTo: 100
    };
    var generatedCount = {
      count: 0
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

    if (opts.includeConfig && !opts.includeHeadsAndTails) {
      // opts.includeConfig is a superset feature of opts.includeHeadsAndTails
      opts.includeHeadsAndTails = true;
    } // quick end if there are no $$$ in the input


    if (!opts.configOverride && !str.includes("$$$") && !str.includes(CONFIGHEAD) && !str.includes(CONFIGTAIL) && !str.includes(CONTENTHEAD) && !str.includes(CONTENTTAIL) || isStr$1(opts.configOverride) && !opts.configOverride.includes("$$$") && !opts.configOverride.includes(CONFIGHEAD) && !opts.configOverride.includes(CONFIGTAIL) && !opts.configOverride.includes(CONTENTHEAD) && !opts.configOverride.includes(CONTENTTAIL)) {
      return {
        log: {
          count: 0
        },
        result: str
      };
    } // either insert the generated CSS in between placeholders or just return the
    // generated CSS


    var frontPart = "";
    var endPart = ""; // find out what to generate
    // eslint-disable-next-line prefer-const

    var _extractConfig = extractConfig(opts.configOverride ? opts.configOverride : str),
        _extractConfig2 = _slicedToArray(_extractConfig, 3),
        extractedConfig = _extractConfig2[0],
        rawContentAbove = _extractConfig2[1],
        rawContentBelow = _extractConfig2[2];

    if (!isStr$1(extractedConfig) || !extractedConfig.trim()) {
      return {
        log: {
          count: 0
        },
        result: ""
      };
    }

    if (opts.includeConfig || opts.includeHeadsAndTails) {
      // wrap with content heads:
      frontPart = "".concat(CONTENTHEAD, " */\n");

      if (!opts.includeConfig) {
        frontPart = "/* ".concat(frontPart);
      } // and with content tails:


      endPart = "\n/* ".concat(CONTENTTAIL, " */");
    } // tackle config


    if (opts.includeConfig) {
      frontPart = "/* ".concat(CONFIGHEAD, "\n").concat(extractedConfig.trim(), "\n").concat(CONFIGTAIL, "\n").concat(frontPart);
    } // maybe there was some content above?


    if (str.includes(CONFIGHEAD)) {
      if (left(str, str.indexOf(CONFIGHEAD)) != null) {
        // in normal cases, content should be between opening CSS comment +
        // CONFIGHEAD and CONFIGTAIL + closing CSS comment, we just have to mind
        // the whitespace
        var sliceUpTo = str.indexOf(CONFIGHEAD);

        if (str[left(str, sliceUpTo)] === "*" && str[left(str, left(str, sliceUpTo))] === "/") {
          sliceUpTo = left(str, left(str, sliceUpTo));
        }

        var putInFront = "/* ";

        if (str[right(str, sliceUpTo - 1)] === "/" && str[right(str, right(str, sliceUpTo - 1))] === "*" || frontPart.trim().startsWith("/*")) {
          putInFront = "";
        } //       console.log(`187 ASSEMBLING frontPart:\n
        // \n1. str.slice(0, sliceUpTo)="${str.slice(0, sliceUpTo)}"
        // \n2. putInFront="${putInFront}"
        // \n3. frontPart="${frontPart}"
        // `);


        frontPart = "".concat(str.slice(0, sliceUpTo)).concat(putInFront).concat(frontPart);
      }
    }

    if (str.includes(CONFIGTAIL) && right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)) {
      // extract content that follows CONFIGTAIL:
      var sliceFrom = str.indexOf(CONFIGTAIL) + CONFIGTAIL.length; // include closing comment:

      if (str[right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)] === "*" && str[right(str, right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length))] === "/") {
        sliceFrom = right(str, right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)) + 1;
      } // in clean code case, opening head of content follows so let's check for it


      if (str.slice(right(str, sliceFrom - 1)).startsWith(CONTENTHEAD)) {
        var contentHeadsStartAt = right(str, sliceFrom);
        sliceFrom = contentHeadsStartAt + CONTENTHEAD.length;

        if (str[right(str, sliceFrom - 1)] === "*" && str[right(str, right(str, sliceFrom - 1))] === "/") {
          sliceFrom = right(str, right(str, sliceFrom - 1)) + 1;
        } // if CONTENTTAIL exists, jump over all the content


        if (str.includes(CONTENTTAIL)) {
          sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length; // tackle any closing comment that follows:

          if (str[right(str, sliceFrom)] === "*" && str[right(str, right(str, sliceFrom))] === "/") {
            sliceFrom = right(str, right(str, sliceFrom)) + 1;
          }
        }
      } // now, check, does this ending chunk already include the content heads,
      // GENERATE-ATOMIC-CSS-CONTENT-STARTS,
      // because if so, there will be duplication and we need to remove them


      var slicedFrom = str.slice(sliceFrom);

      if (slicedFrom.length && slicedFrom.includes(CONTENTTAIL)) {
        sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;

        if (str[right(str, sliceFrom)] === "*" && str[right(str, right(str, sliceFrom))] === "/") {
          sliceFrom = right(str, right(str, sliceFrom)) + 1;
        }
      } //     console.log(`292 ASSEMBLE endPart:
      // \n1. endPart = "${endPart}"
      // \n2. bool str[sliceFrom] && right(str, sliceFrom - 1) = ${str[sliceFrom] &&
      //       right(str, sliceFrom - 1)}
      // \n3. str[sliceFrom] && right(str, sliceFrom - 1) ? str.slice(slicedFrom) : "" = "${
      //       str[sliceFrom] && right(str, sliceFrom - 1) ? str.slice(slicedFrom) : ""
      //     }"
      // \n4. sliceFrom = ${sliceFrom}
      // \n5. str.slice(${slicedFrom}) = ${`\u001b[${31}m${str.slice(
      //       slicedFrom
      //     )}\u001b[${39}m`}
      // `);


      endPart = "".concat(endPart).concat(str[sliceFrom] && right(str, sliceFrom - 1) ? str.slice(sliceFrom) : "");
    }

    if (isStr$1(rawContentAbove)) {
      frontPart = "".concat(rawContentAbove).concat(frontPart);
    }

    if (isStr$1(rawContentBelow)) {
      // precaution if rawContentBelow ends but not starts with CSS comment
      if (rawContentBelow.trim().endsWith("/*") && !rawContentBelow.trim().startsWith("*/")) {
        // but leave leading whitespace intact
        var frontPart2 = "";

        if (isStr$1(rawContentBelow) && rawContentBelow[0] && !rawContentBelow[0].trim()) {
          frontPart2 = rawContentBelow.slice(0, right(rawContentBelow, 0));
        }

        rawContentBelow = "".concat(frontPart2, "/* ").concat(rawContentBelow.trim());
      }

      endPart = "".concat(endPart).concat(rawContentBelow);
    }

    var finalRes = "".concat(trimIfNeeded("".concat(frontPart).concat(prepConfig(extractedConfig, opts.reportProgressFunc, opts.reportProgressFuncFrom, opts.reportProgressFuncTo, true, // opts.includeConfig || opts.includeHeadsAndTails
    generatedCount, opts.pad)).concat(endPart), opts), "\n");
    return {
      log: {
        count: generatedCount.count
      },
      result: finalRes
    };
  }

  exports.extractFromToSource = extractFromToSource;
  exports.genAtomic = genAtomic;
  exports.headsAndTails = headsAndTails;
  exports.version = version;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
