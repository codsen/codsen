/**
 * detergent
 * Extracts and cleans text
 * Version: 5.10.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://detergent.io
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.detergent = {}));
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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

  function rightStopAtNewLines(str, idx) {
    return rightMain(str, idx, true);
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

  function leftStopAtNewLines(str, idx) {
    return leftMain(str, idx, true);
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

    var lastRes = null;
    var lastIdx = null;

    do {
      lastRes = direction === "right" ? rightSeq.apply(void 0, [str, isNum(lastIdx) ? lastIdx : idx].concat(_toConsumableArray(args))) : leftSeq.apply(void 0, [str, isNum(lastIdx) ? lastIdx : idx].concat(_toConsumableArray(args)));

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

      var whatsOnTheRight = right(str, lastIdx);

      if (opts.mode === 0) {
        if (whatsOnTheRight === lastIdx + 1) {
          return lastIdx;
        }

        if (str.slice(lastIdx, whatsOnTheRight || str.length).trim() || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\n") || str.slice(lastIdx, whatsOnTheRight || str.length).includes("\r")) {
          for (var y = lastIdx, len = str.length; y < len; y++) {
            if ("\n\r".includes(str[y])) {
              return y;
            }
          }
        } else {
          return whatsOnTheRight ? ~-whatsOnTheRight : str.length;
        }
      } else if (opts.mode === 1) {
        return lastIdx;
      } else if (opts.mode === 2) {
        var remainderString = str.slice(lastIdx);

        if (remainderString.trim() || remainderString.includes("\n") || remainderString.includes("\r")) {
          for (var _y = lastIdx, _len3 = str.length; _y < _len3; _y++) {
            if (str[_y].trim() || "\n\r".includes(str[_y])) {
              return _y;
            }
          }
        }

        return str.length;
      }

      return whatsOnTheRight || str.length;
    }

    if (str[lastIdx] && str[~-lastIdx] && str[~-lastIdx].trim()) {
      return lastIdx;
    }

    var whatsOnTheLeft = left(str, lastIdx);

    if (opts.mode === 0) {
      if (whatsOnTheLeft === lastIdx - 2) {
        return lastIdx;
      }

      if (str.slice(0, lastIdx).trim() || str.slice(0, lastIdx).includes("\n") || str.slice(0, lastIdx).includes("\r")) {
        for (var _y2 = lastIdx; _y2--;) {
          if ("\n\r".includes(str[_y2]) || str[_y2].trim()) {
            return _y2 + 1 + (str[_y2].trim() ? 1 : 0);
          }
        }
      }

      return 0;
    }

    if (opts.mode === 1) {
      return lastIdx;
    }

    if (opts.mode === 2) {
      var _remainderString = str.slice(0, lastIdx);

      if (_remainderString.trim() || _remainderString.includes("\n") || _remainderString.includes("\r")) {
        for (var _y3 = lastIdx; _y3--;) {
          if (str[_y3].trim() || "\n\r".includes(str[_y3])) {
            return _y3 + 1;
          }
        }
      }

      return 0;
    }

    return whatsOnTheLeft !== null ? whatsOnTheLeft + 1 : 0;
  }

  function chompLeft(str, idx) {
    for (var _len4 = arguments.length, args = new Array(_len4 > 2 ? _len4 - 2 : 0), _key3 = 2; _key3 < _len4; _key3++) {
      args[_key3 - 2] = arguments[_key3];
    }

    if (!args.length || args.length === 1 && lodash_isplainobject(args[0])) {
      return null;
    }

    var defaults = {
      mode: 0
    };

    if (lodash_isplainobject(args[0])) {
      var opts = _objectSpread2(_objectSpread2({}, defaults), lodash_clonedeep(args[0]));

      if (!opts.mode) {
        opts.mode = 0;
      } else if (isStr(opts.mode) && "0123".includes(opts.mode)) {
        opts.mode = Number.parseInt(opts.mode, 10);
      } else if (!isNum(opts.mode)) {
        throw new Error("string-left-right/chompLeft(): [THROW_ID_01] the opts.mode is wrong! It should be 0, 1, 2 or 3. It was given as ".concat(opts.mode, " (type ").concat(_typeof(opts.mode), ")"));
      }

      return chomp("left", str, idx, opts, lodash_clonedeep(args).slice(1));
    }

    if (!isStr(args[0])) {
      return chomp("left", str, idx, defaults, lodash_clonedeep(args).slice(1));
    }

    return chomp("left", str, idx, defaults, lodash_clonedeep(args));
  }

  var array = [];
  var charCodeCache = [];

  var leven = function leven(left, right) {
    if (left === right) {
      return 0;
    }

    var swap = left; // Swapping the strings if `a` is longer than `b` so we know which one is the
    // shortest & which one is the longest

    if (left.length > right.length) {
      left = right;
      right = swap;
    }

    var leftLength = left.length;
    var rightLength = right.length; // Performing suffix trimming:
    // We can linearly drop suffix common to both strings since they
    // don't increase distance at all
    // Note: `~-` is the bitwise way to perform a `- 1` operation

    while (leftLength > 0 && left.charCodeAt(~-leftLength) === right.charCodeAt(~-rightLength)) {
      leftLength--;
      rightLength--;
    } // Performing prefix trimming
    // We can linearly drop prefix common to both strings since they
    // don't increase distance at all


    var start = 0;

    while (start < leftLength && left.charCodeAt(start) === right.charCodeAt(start)) {
      start++;
    }

    leftLength -= start;
    rightLength -= start;

    if (leftLength === 0) {
      return rightLength;
    }

    var bCharCode;
    var result;
    var temp;
    var temp2;
    var i = 0;
    var j = 0;

    while (i < leftLength) {
      charCodeCache[i] = left.charCodeAt(start + i);
      array[i] = ++i;
    }

    while (j < rightLength) {
      bCharCode = right.charCodeAt(start + j);
      temp = j++;
      result = j;

      for (i = 0; i < leftLength; i++) {
        temp2 = bCharCode === charCodeCache[i] ? temp : temp + 1;
        temp = array[i]; // eslint-disable-next-line no-multi-assign

        result = array[i] = temp > result ? temp2 > result ? result + 1 : temp2 : temp2 > temp ? temp + 1 : temp2;
      }
    }

    return result;
  };

  var leven_1 = leven; // TODO: Remove this for the next major release

  var _default = leven;
  leven_1.default = _default;

  /**
   * all-named-html-entities
   * List of all named HTML entities
   * Version: 1.3.2
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
  var bsp = "nbsp";
  var nsp = "nbsp";
  var nbp = "nbsp";
  var nbs = "nbsp";
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
    zwnm: zwnm,
    bsp: bsp,
    nsp: nsp,
    nbp: nbp,
    nbs: nbs
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
  var x$1 = {
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
    x: x$1,
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
  var x$1$1 = {
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
    x: x$1$1,
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
  var allNamedEntitiesSetOnly = new Set(["Aacute", "aacute", "Abreve", "abreve", "ac", "acd", "acE", "Acirc", "acirc", "acute", "Acy", "acy", "AElig", "aelig", "af", "Afr", "afr", "Agrave", "agrave", "alefsym", "aleph", "Alpha", "alpha", "Amacr", "amacr", "amalg", "AMP", "amp", "And", "and", "andand", "andd", "andslope", "andv", "ang", "ange", "angle", "angmsd", "angmsdaa", "angmsdab", "angmsdac", "angmsdad", "angmsdae", "angmsdaf", "angmsdag", "angmsdah", "angrt", "angrtvb", "angrtvbd", "angsph", "angst", "angzarr", "Aogon", "aogon", "Aopf", "aopf", "ap", "apacir", "apE", "ape", "apid", "apos", "ApplyFunction", "approx", "approxeq", "Aring", "aring", "Ascr", "ascr", "Assign", "ast", "asymp", "asympeq", "Atilde", "atilde", "Auml", "auml", "awconint", "awint", "backcong", "backepsilon", "backprime", "backsim", "backsimeq", "Backslash", "Barv", "barvee", "Barwed", "barwed", "barwedge", "bbrk", "bbrktbrk", "bcong", "Bcy", "bcy", "bdquo", "becaus", "Because", "because", "bemptyv", "bepsi", "bernou", "Bernoullis", "Beta", "beta", "beth", "between", "Bfr", "bfr", "bigcap", "bigcirc", "bigcup", "bigodot", "bigoplus", "bigotimes", "bigsqcup", "bigstar", "bigtriangledown", "bigtriangleup", "biguplus", "bigvee", "bigwedge", "bkarow", "blacklozenge", "blacksquare", "blacktriangle", "blacktriangledown", "blacktriangleleft", "blacktriangleright", "blank", "blk12", "blk14", "blk34", "block", "bne", "bnequiv", "bNot", "bnot", "Bopf", "bopf", "bot", "bottom", "bowtie", "boxbox", "boxDL", "boxDl", "boxdL", "boxdl", "boxDR", "boxDr", "boxdR", "boxdr", "boxH", "boxh", "boxHD", "boxHd", "boxhD", "boxhd", "boxHU", "boxHu", "boxhU", "boxhu", "boxminus", "boxplus", "boxtimes", "boxUL", "boxUl", "boxuL", "boxul", "boxUR", "boxUr", "boxuR", "boxur", "boxV", "boxv", "boxVH", "boxVh", "boxvH", "boxvh", "boxVL", "boxVl", "boxvL", "boxvl", "boxVR", "boxVr", "boxvR", "boxvr", "bprime", "Breve", "breve", "brvbar", "Bscr", "bscr", "bsemi", "bsim", "bsime", "bsol", "bsolb", "bsolhsub", "bull", "bullet", "bump", "bumpE", "bumpe", "Bumpeq", "bumpeq", "Cacute", "cacute", "Cap", "cap", "capand", "capbrcup", "capcap", "capcup", "capdot", "CapitalDifferentialD", "caps", "caret", "caron", "Cayleys", "ccaps", "Ccaron", "ccaron", "Ccedil", "ccedil", "Ccirc", "ccirc", "Cconint", "ccups", "ccupssm", "Cdot", "cdot", "cedil", "Cedilla", "cemptyv", "cent", "CenterDot", "centerdot", "Cfr", "cfr", "CHcy", "chcy", "check", "checkmark", "Chi", "chi", "cir", "circ", "circeq", "circlearrowleft", "circlearrowright", "circledast", "circledcirc", "circleddash", "CircleDot", "circledR", "circledS", "CircleMinus", "CirclePlus", "CircleTimes", "cirE", "cire", "cirfnint", "cirmid", "cirscir", "ClockwiseContourIntegral", "CloseCurlyDoubleQuote", "CloseCurlyQuote", "clubs", "clubsuit", "Colon", "colon", "Colone", "colone", "coloneq", "comma", "commat", "comp", "compfn", "complement", "complexes", "cong", "congdot", "Congruent", "Conint", "conint", "ContourIntegral", "Copf", "copf", "coprod", "Coproduct", "COPY", "copy", "copysr", "CounterClockwiseContourIntegral", "crarr", "Cross", "cross", "Cscr", "cscr", "csub", "csube", "csup", "csupe", "ctdot", "cudarrl", "cudarrr", "cuepr", "cuesc", "cularr", "cularrp", "Cup", "cup", "cupbrcap", "CupCap", "cupcap", "cupcup", "cupdot", "cupor", "cups", "curarr", "curarrm", "curlyeqprec", "curlyeqsucc", "curlyvee", "curlywedge", "curren", "curvearrowleft", "curvearrowright", "cuvee", "cuwed", "cwconint", "cwint", "cylcty", "Dagger", "dagger", "daleth", "Darr", "dArr", "darr", "dash", "Dashv", "dashv", "dbkarow", "dblac", "Dcaron", "dcaron", "Dcy", "dcy", "DD", "dd", "ddagger", "ddarr", "DDotrahd", "ddotseq", "deg", "Del", "Delta", "delta", "demptyv", "dfisht", "Dfr", "dfr", "dHar", "dharl", "dharr", "DiacriticalAcute", "DiacriticalDot", "DiacriticalDoubleAcute", "DiacriticalGrave", "DiacriticalTilde", "diam", "Diamond", "diamond", "diamondsuit", "diams", "die", "DifferentialD", "digamma", "disin", "div", "divide", "divideontimes", "divonx", "DJcy", "djcy", "dlcorn", "dlcrop", "dollar", "Dopf", "dopf", "Dot", "dot", "DotDot", "doteq", "doteqdot", "DotEqual", "dotminus", "dotplus", "dotsquare", "doublebarwedge", "DoubleContourIntegral", "DoubleDot", "DoubleDownArrow", "DoubleLeftArrow", "DoubleLeftRightArrow", "DoubleLeftTee", "DoubleLongLeftArrow", "DoubleLongLeftRightArrow", "DoubleLongRightArrow", "DoubleRightArrow", "DoubleRightTee", "DoubleUpArrow", "DoubleUpDownArrow", "DoubleVerticalBar", "DownArrow", "Downarrow", "downarrow", "DownArrowBar", "DownArrowUpArrow", "DownBreve", "downdownarrows", "downharpoonleft", "downharpoonright", "DownLeftRightVector", "DownLeftTeeVector", "DownLeftVector", "DownLeftVectorBar", "DownRightTeeVector", "DownRightVector", "DownRightVectorBar", "DownTee", "DownTeeArrow", "drbkarow", "drcorn", "drcrop", "Dscr", "dscr", "DScy", "dscy", "dsol", "Dstrok", "dstrok", "dtdot", "dtri", "dtrif", "duarr", "duhar", "dwangle", "DZcy", "dzcy", "dzigrarr", "Eacute", "eacute", "easter", "Ecaron", "ecaron", "ecir", "Ecirc", "ecirc", "ecolon", "Ecy", "ecy", "eDDot", "Edot", "eDot", "edot", "ee", "efDot", "Efr", "efr", "eg", "Egrave", "egrave", "egs", "egsdot", "el", "Element", "elinters", "ell", "els", "elsdot", "Emacr", "emacr", "empty", "emptyset", "EmptySmallSquare", "emptyv", "EmptyVerySmallSquare", "emsp", "emsp13", "emsp14", "ENG", "eng", "ensp", "Eogon", "eogon", "Eopf", "eopf", "epar", "eparsl", "eplus", "epsi", "Epsilon", "epsilon", "epsiv", "eqcirc", "eqcolon", "eqsim", "eqslantgtr", "eqslantless", "Equal", "equals", "EqualTilde", "equest", "Equilibrium", "equiv", "equivDD", "eqvparsl", "erarr", "erDot", "Escr", "escr", "esdot", "Esim", "esim", "Eta", "eta", "ETH", "eth", "Euml", "euml", "euro", "excl", "exist", "Exists", "expectation", "ExponentialE", "exponentiale", "fallingdotseq", "Fcy", "fcy", "female", "ffilig", "fflig", "ffllig", "Ffr", "ffr", "filig", "FilledSmallSquare", "FilledVerySmallSquare", "fjlig", "flat", "fllig", "fltns", "fnof", "Fopf", "fopf", "ForAll", "forall", "fork", "forkv", "Fouriertrf", "fpartint", "frac12", "frac13", "frac14", "frac15", "frac16", "frac18", "frac23", "frac25", "frac34", "frac35", "frac38", "frac45", "frac56", "frac58", "frac78", "frasl", "frown", "Fscr", "fscr", "gacute", "Gamma", "gamma", "Gammad", "gammad", "gap", "Gbreve", "gbreve", "Gcedil", "Gcirc", "gcirc", "Gcy", "gcy", "Gdot", "gdot", "gE", "ge", "gEl", "gel", "geq", "geqq", "geqslant", "ges", "gescc", "gesdot", "gesdoto", "gesdotol", "gesl", "gesles", "Gfr", "gfr", "Gg", "gg", "ggg", "gimel", "GJcy", "gjcy", "gl", "gla", "glE", "glj", "gnap", "gnapprox", "gnE", "gne", "gneq", "gneqq", "gnsim", "Gopf", "gopf", "grave", "GreaterEqual", "GreaterEqualLess", "GreaterFullEqual", "GreaterGreater", "GreaterLess", "GreaterSlantEqual", "GreaterTilde", "Gscr", "gscr", "gsim", "gsime", "gsiml", "GT", "Gt", "gt", "gtcc", "gtcir", "gtdot", "gtlPar", "gtquest", "gtrapprox", "gtrarr", "gtrdot", "gtreqless", "gtreqqless", "gtrless", "gtrsim", "gvertneqq", "gvnE", "Hacek", "hairsp", "half", "hamilt", "HARDcy", "hardcy", "hArr", "harr", "harrcir", "harrw", "Hat", "hbar", "Hcirc", "hcirc", "hearts", "heartsuit", "hellip", "hercon", "Hfr", "hfr", "HilbertSpace", "hksearow", "hkswarow", "hoarr", "homtht", "hookleftarrow", "hookrightarrow", "Hopf", "hopf", "horbar", "HorizontalLine", "Hscr", "hscr", "hslash", "Hstrok", "hstrok", "HumpDownHump", "HumpEqual", "hybull", "hyphen", "Iacute", "iacute", "ic", "Icirc", "icirc", "Icy", "icy", "Idot", "IEcy", "iecy", "iexcl", "iff", "Ifr", "ifr", "Igrave", "igrave", "ii", "iiiint", "iiint", "iinfin", "iiota", "IJlig", "ijlig", "Im", "Imacr", "imacr", "image", "ImaginaryI", "imagline", "imagpart", "imath", "imof", "imped", "Implies", "in", "incare", "infin", "infintie", "inodot", "Int", "int", "intcal", "integers", "Integral", "intercal", "Intersection", "intlarhk", "intprod", "InvisibleComma", "InvisibleTimes", "IOcy", "iocy", "Iogon", "iogon", "Iopf", "iopf", "Iota", "iota", "iprod", "iquest", "Iscr", "iscr", "isin", "isindot", "isinE", "isins", "isinsv", "isinv", "it", "Itilde", "itilde", "Iukcy", "iukcy", "Iuml", "iuml", "Jcirc", "jcirc", "Jcy", "jcy", "Jfr", "jfr", "jmath", "Jopf", "jopf", "Jscr", "jscr", "Jsercy", "jsercy", "Jukcy", "jukcy", "Kappa", "kappa", "kappav", "Kcedil", "kcedil", "Kcy", "kcy", "Kfr", "kfr", "kgreen", "KHcy", "khcy", "KJcy", "kjcy", "Kopf", "kopf", "Kscr", "kscr", "lAarr", "Lacute", "lacute", "laemptyv", "lagran", "Lambda", "lambda", "Lang", "lang", "langd", "langle", "lap", "Laplacetrf", "laquo", "Larr", "lArr", "larr", "larrb", "larrbfs", "larrfs", "larrhk", "larrlp", "larrpl", "larrsim", "larrtl", "lat", "lAtail", "latail", "late", "lates", "lBarr", "lbarr", "lbbrk", "lbrace", "lbrack", "lbrke", "lbrksld", "lbrkslu", "Lcaron", "lcaron", "Lcedil", "lcedil", "lceil", "lcub", "Lcy", "lcy", "ldca", "ldquo", "ldquor", "ldrdhar", "ldrushar", "ldsh", "lE", "le", "LeftAngleBracket", "LeftArrow", "Leftarrow", "leftarrow", "LeftArrowBar", "LeftArrowRightArrow", "leftarrowtail", "LeftCeiling", "LeftDoubleBracket", "LeftDownTeeVector", "LeftDownVector", "LeftDownVectorBar", "LeftFloor", "leftharpoondown", "leftharpoonup", "leftleftarrows", "LeftRightArrow", "Leftrightarrow", "leftrightarrow", "leftrightarrows", "leftrightharpoons", "leftrightsquigarrow", "LeftRightVector", "LeftTee", "LeftTeeArrow", "LeftTeeVector", "leftthreetimes", "LeftTriangle", "LeftTriangleBar", "LeftTriangleEqual", "LeftUpDownVector", "LeftUpTeeVector", "LeftUpVector", "LeftUpVectorBar", "LeftVector", "LeftVectorBar", "lEg", "leg", "leq", "leqq", "leqslant", "les", "lescc", "lesdot", "lesdoto", "lesdotor", "lesg", "lesges", "lessapprox", "lessdot", "lesseqgtr", "lesseqqgtr", "LessEqualGreater", "LessFullEqual", "LessGreater", "lessgtr", "LessLess", "lesssim", "LessSlantEqual", "LessTilde", "lfisht", "lfloor", "Lfr", "lfr", "lg", "lgE", "lHar", "lhard", "lharu", "lharul", "lhblk", "LJcy", "ljcy", "Ll", "ll", "llarr", "llcorner", "Lleftarrow", "llhard", "lltri", "Lmidot", "lmidot", "lmoust", "lmoustache", "lnap", "lnapprox", "lnE", "lne", "lneq", "lneqq", "lnsim", "loang", "loarr", "lobrk", "LongLeftArrow", "Longleftarrow", "longleftarrow", "LongLeftRightArrow", "Longleftrightarrow", "longleftrightarrow", "longmapsto", "LongRightArrow", "Longrightarrow", "longrightarrow", "looparrowleft", "looparrowright", "lopar", "Lopf", "lopf", "loplus", "lotimes", "lowast", "lowbar", "LowerLeftArrow", "LowerRightArrow", "loz", "lozenge", "lozf", "lpar", "lparlt", "lrarr", "lrcorner", "lrhar", "lrhard", "lrm", "lrtri", "lsaquo", "Lscr", "lscr", "Lsh", "lsh", "lsim", "lsime", "lsimg", "lsqb", "lsquo", "lsquor", "Lstrok", "lstrok", "LT", "Lt", "lt", "ltcc", "ltcir", "ltdot", "lthree", "ltimes", "ltlarr", "ltquest", "ltri", "ltrie", "ltrif", "ltrPar", "lurdshar", "luruhar", "lvertneqq", "lvnE", "macr", "male", "malt", "maltese", "Map", "map", "mapsto", "mapstodown", "mapstoleft", "mapstoup", "marker", "mcomma", "Mcy", "mcy", "mdash", "mDDot", "measuredangle", "MediumSpace", "Mellintrf", "Mfr", "mfr", "mho", "micro", "mid", "midast", "midcir", "middot", "minus", "minusb", "minusd", "minusdu", "MinusPlus", "mlcp", "mldr", "mnplus", "models", "Mopf", "mopf", "mp", "Mscr", "mscr", "mstpos", "Mu", "mu", "multimap", "mumap", "nabla", "Nacute", "nacute", "nang", "nap", "napE", "napid", "napos", "napprox", "natur", "natural", "naturals", "nbsp", "nbump", "nbumpe", "ncap", "Ncaron", "ncaron", "Ncedil", "ncedil", "ncong", "ncongdot", "ncup", "Ncy", "ncy", "ndash", "ne", "nearhk", "neArr", "nearr", "nearrow", "nedot", "NegativeMediumSpace", "NegativeThickSpace", "NegativeThinSpace", "NegativeVeryThinSpace", "nequiv", "nesear", "nesim", "NestedGreaterGreater", "NestedLessLess", "NewLine", "nexist", "nexists", "Nfr", "nfr", "ngE", "nge", "ngeq", "ngeqq", "ngeqslant", "nges", "nGg", "ngsim", "nGt", "ngt", "ngtr", "nGtv", "nhArr", "nharr", "nhpar", "ni", "nis", "nisd", "niv", "NJcy", "njcy", "nlArr", "nlarr", "nldr", "nlE", "nle", "nLeftarrow", "nleftarrow", "nLeftrightarrow", "nleftrightarrow", "nleq", "nleqq", "nleqslant", "nles", "nless", "nLl", "nlsim", "nLt", "nlt", "nltri", "nltrie", "nLtv", "nmid", "NoBreak", "NonBreakingSpace", "Nopf", "nopf", "Not", "not", "NotCongruent", "NotCupCap", "NotDoubleVerticalBar", "NotElement", "NotEqual", "NotEqualTilde", "NotExists", "NotGreater", "NotGreaterEqual", "NotGreaterFullEqual", "NotGreaterGreater", "NotGreaterLess", "NotGreaterSlantEqual", "NotGreaterTilde", "NotHumpDownHump", "NotHumpEqual", "notin", "notindot", "notinE", "notinva", "notinvb", "notinvc", "NotLeftTriangle", "NotLeftTriangleBar", "NotLeftTriangleEqual", "NotLess", "NotLessEqual", "NotLessGreater", "NotLessLess", "NotLessSlantEqual", "NotLessTilde", "NotNestedGreaterGreater", "NotNestedLessLess", "notni", "notniva", "notnivb", "notnivc", "NotPrecedes", "NotPrecedesEqual", "NotPrecedesSlantEqual", "NotReverseElement", "NotRightTriangle", "NotRightTriangleBar", "NotRightTriangleEqual", "NotSquareSubset", "NotSquareSubsetEqual", "NotSquareSuperset", "NotSquareSupersetEqual", "NotSubset", "NotSubsetEqual", "NotSucceeds", "NotSucceedsEqual", "NotSucceedsSlantEqual", "NotSucceedsTilde", "NotSuperset", "NotSupersetEqual", "NotTilde", "NotTildeEqual", "NotTildeFullEqual", "NotTildeTilde", "NotVerticalBar", "npar", "nparallel", "nparsl", "npart", "npolint", "npr", "nprcue", "npre", "nprec", "npreceq", "nrArr", "nrarr", "nrarrc", "nrarrw", "nRightarrow", "nrightarrow", "nrtri", "nrtrie", "nsc", "nsccue", "nsce", "Nscr", "nscr", "nshortmid", "nshortparallel", "nsim", "nsime", "nsimeq", "nsmid", "nspar", "nsqsube", "nsqsupe", "nsub", "nsubE", "nsube", "nsubset", "nsubseteq", "nsubseteqq", "nsucc", "nsucceq", "nsup", "nsupE", "nsupe", "nsupset", "nsupseteq", "nsupseteqq", "ntgl", "Ntilde", "ntilde", "ntlg", "ntriangleleft", "ntrianglelefteq", "ntriangleright", "ntrianglerighteq", "Nu", "nu", "num", "numero", "numsp", "nvap", "nVDash", "nVdash", "nvDash", "nvdash", "nvge", "nvgt", "nvHarr", "nvinfin", "nvlArr", "nvle", "nvlt", "nvltrie", "nvrArr", "nvrtrie", "nvsim", "nwarhk", "nwArr", "nwarr", "nwarrow", "nwnear", "Oacute", "oacute", "oast", "ocir", "Ocirc", "ocirc", "Ocy", "ocy", "odash", "Odblac", "odblac", "odiv", "odot", "odsold", "OElig", "oelig", "ofcir", "Ofr", "ofr", "ogon", "Ograve", "ograve", "ogt", "ohbar", "ohm", "oint", "olarr", "olcir", "olcross", "oline", "olt", "Omacr", "omacr", "Omega", "omega", "Omicron", "omicron", "omid", "ominus", "Oopf", "oopf", "opar", "OpenCurlyDoubleQuote", "OpenCurlyQuote", "operp", "oplus", "Or", "or", "orarr", "ord", "order", "orderof", "ordf", "ordm", "origof", "oror", "orslope", "orv", "oS", "Oscr", "oscr", "Oslash", "oslash", "osol", "Otilde", "otilde", "Otimes", "otimes", "otimesas", "Ouml", "ouml", "ovbar", "OverBar", "OverBrace", "OverBracket", "OverParenthesis", "par", "para", "parallel", "parsim", "parsl", "part", "PartialD", "Pcy", "pcy", "percnt", "period", "permil", "perp", "pertenk", "Pfr", "pfr", "Phi", "phi", "phiv", "phmmat", "phone", "Pi", "pi", "pitchfork", "piv", "planck", "planckh", "plankv", "plus", "plusacir", "plusb", "pluscir", "plusdo", "plusdu", "pluse", "PlusMinus", "plusmn", "plussim", "plustwo", "pm", "Poincareplane", "pointint", "Popf", "popf", "pound", "Pr", "pr", "prap", "prcue", "prE", "pre", "prec", "precapprox", "preccurlyeq", "Precedes", "PrecedesEqual", "PrecedesSlantEqual", "PrecedesTilde", "preceq", "precnapprox", "precneqq", "precnsim", "precsim", "Prime", "prime", "primes", "prnap", "prnE", "prnsim", "prod", "Product", "profalar", "profline", "profsurf", "prop", "Proportion", "Proportional", "propto", "prsim", "prurel", "Pscr", "pscr", "Psi", "psi", "puncsp", "Qfr", "qfr", "qint", "Qopf", "qopf", "qprime", "Qscr", "qscr", "quaternions", "quatint", "quest", "questeq", "QUOT", "quot", "rAarr", "race", "Racute", "racute", "radic", "raemptyv", "Rang", "rang", "rangd", "range", "rangle", "raquo", "Rarr", "rArr", "rarr", "rarrap", "rarrb", "rarrbfs", "rarrc", "rarrfs", "rarrhk", "rarrlp", "rarrpl", "rarrsim", "Rarrtl", "rarrtl", "rarrw", "rAtail", "ratail", "ratio", "rationals", "RBarr", "rBarr", "rbarr", "rbbrk", "rbrace", "rbrack", "rbrke", "rbrksld", "rbrkslu", "Rcaron", "rcaron", "Rcedil", "rcedil", "rceil", "rcub", "Rcy", "rcy", "rdca", "rdldhar", "rdquo", "rdquor", "rdsh", "Re", "real", "realine", "realpart", "reals", "rect", "REG", "reg", "ReverseElement", "ReverseEquilibrium", "ReverseUpEquilibrium", "rfisht", "rfloor", "Rfr", "rfr", "rHar", "rhard", "rharu", "rharul", "Rho", "rho", "rhov", "RightAngleBracket", "RightArrow", "Rightarrow", "rightarrow", "RightArrowBar", "RightArrowLeftArrow", "rightarrowtail", "RightCeiling", "RightDoubleBracket", "RightDownTeeVector", "RightDownVector", "RightDownVectorBar", "RightFloor", "rightharpoondown", "rightharpoonup", "rightleftarrows", "rightleftharpoons", "rightrightarrows", "rightsquigarrow", "RightTee", "RightTeeArrow", "RightTeeVector", "rightthreetimes", "RightTriangle", "RightTriangleBar", "RightTriangleEqual", "RightUpDownVector", "RightUpTeeVector", "RightUpVector", "RightUpVectorBar", "RightVector", "RightVectorBar", "ring", "risingdotseq", "rlarr", "rlhar", "rlm", "rmoust", "rmoustache", "rnmid", "roang", "roarr", "robrk", "ropar", "Ropf", "ropf", "roplus", "rotimes", "RoundImplies", "rpar", "rpargt", "rppolint", "rrarr", "Rrightarrow", "rsaquo", "Rscr", "rscr", "Rsh", "rsh", "rsqb", "rsquo", "rsquor", "rthree", "rtimes", "rtri", "rtrie", "rtrif", "rtriltri", "RuleDelayed", "ruluhar", "rx", "Sacute", "sacute", "sbquo", "Sc", "sc", "scap", "Scaron", "scaron", "sccue", "scE", "sce", "Scedil", "scedil", "Scirc", "scirc", "scnap", "scnE", "scnsim", "scpolint", "scsim", "Scy", "scy", "sdot", "sdotb", "sdote", "searhk", "seArr", "searr", "searrow", "sect", "semi", "seswar", "setminus", "setmn", "sext", "Sfr", "sfr", "sfrown", "sharp", "SHCHcy", "shchcy", "SHcy", "shcy", "ShortDownArrow", "ShortLeftArrow", "shortmid", "shortparallel", "ShortRightArrow", "ShortUpArrow", "shy", "Sigma", "sigma", "sigmaf", "sigmav", "sim", "simdot", "sime", "simeq", "simg", "simgE", "siml", "simlE", "simne", "simplus", "simrarr", "slarr", "SmallCircle", "smallsetminus", "smashp", "smeparsl", "smid", "smile", "smt", "smte", "smtes", "SOFTcy", "softcy", "sol", "solb", "solbar", "Sopf", "sopf", "spades", "spadesuit", "spar", "sqcap", "sqcaps", "sqcup", "sqcups", "Sqrt", "sqsub", "sqsube", "sqsubset", "sqsubseteq", "sqsup", "sqsupe", "sqsupset", "sqsupseteq", "squ", "Square", "square", "SquareIntersection", "SquareSubset", "SquareSubsetEqual", "SquareSuperset", "SquareSupersetEqual", "SquareUnion", "squarf", "squf", "srarr", "Sscr", "sscr", "ssetmn", "ssmile", "sstarf", "Star", "star", "starf", "straightepsilon", "straightphi", "strns", "Sub", "sub", "subdot", "subE", "sube", "subedot", "submult", "subnE", "subne", "subplus", "subrarr", "Subset", "subset", "subseteq", "subseteqq", "SubsetEqual", "subsetneq", "subsetneqq", "subsim", "subsub", "subsup", "succ", "succapprox", "succcurlyeq", "Succeeds", "SucceedsEqual", "SucceedsSlantEqual", "SucceedsTilde", "succeq", "succnapprox", "succneqq", "succnsim", "succsim", "SuchThat", "Sum", "sum", "sung", "Sup", "sup", "sup1", "sup2", "sup3", "supdot", "supdsub", "supE", "supe", "supedot", "Superset", "SupersetEqual", "suphsol", "suphsub", "suplarr", "supmult", "supnE", "supne", "supplus", "Supset", "supset", "supseteq", "supseteqq", "supsetneq", "supsetneqq", "supsim", "supsub", "supsup", "swarhk", "swArr", "swarr", "swarrow", "swnwar", "szlig", "Tab", "target", "Tau", "tau", "tbrk", "Tcaron", "tcaron", "Tcedil", "tcedil", "Tcy", "tcy", "tdot", "telrec", "Tfr", "tfr", "there4", "Therefore", "therefore", "Theta", "theta", "thetasym", "thetav", "thickapprox", "thicksim", "ThickSpace", "thinsp", "ThinSpace", "thkap", "thksim", "THORN", "thorn", "Tilde", "tilde", "TildeEqual", "TildeFullEqual", "TildeTilde", "times", "timesb", "timesbar", "timesd", "tint", "toea", "top", "topbot", "topcir", "Topf", "topf", "topfork", "tosa", "tprime", "TRADE", "trade", "triangle", "triangledown", "triangleleft", "trianglelefteq", "triangleq", "triangleright", "trianglerighteq", "tridot", "trie", "triminus", "TripleDot", "triplus", "trisb", "tritime", "trpezium", "Tscr", "tscr", "TScy", "tscy", "TSHcy", "tshcy", "Tstrok", "tstrok", "twixt", "twoheadleftarrow", "twoheadrightarrow", "Uacute", "uacute", "Uarr", "uArr", "uarr", "Uarrocir", "Ubrcy", "ubrcy", "Ubreve", "ubreve", "Ucirc", "ucirc", "Ucy", "ucy", "udarr", "Udblac", "udblac", "udhar", "ufisht", "Ufr", "ufr", "Ugrave", "ugrave", "uHar", "uharl", "uharr", "uhblk", "ulcorn", "ulcorner", "ulcrop", "ultri", "Umacr", "umacr", "uml", "UnderBar", "UnderBrace", "UnderBracket", "UnderParenthesis", "Union", "UnionPlus", "Uogon", "uogon", "Uopf", "uopf", "UpArrow", "Uparrow", "uparrow", "UpArrowBar", "UpArrowDownArrow", "UpDownArrow", "Updownarrow", "updownarrow", "UpEquilibrium", "upharpoonleft", "upharpoonright", "uplus", "UpperLeftArrow", "UpperRightArrow", "Upsi", "upsi", "upsih", "Upsilon", "upsilon", "UpTee", "UpTeeArrow", "upuparrows", "urcorn", "urcorner", "urcrop", "Uring", "uring", "urtri", "Uscr", "uscr", "utdot", "Utilde", "utilde", "utri", "utrif", "uuarr", "Uuml", "uuml", "uwangle", "vangrt", "varepsilon", "varkappa", "varnothing", "varphi", "varpi", "varpropto", "vArr", "varr", "varrho", "varsigma", "varsubsetneq", "varsubsetneqq", "varsupsetneq", "varsupsetneqq", "vartheta", "vartriangleleft", "vartriangleright", "Vbar", "vBar", "vBarv", "Vcy", "vcy", "VDash", "Vdash", "vDash", "vdash", "Vdashl", "Vee", "vee", "veebar", "veeeq", "vellip", "Verbar", "verbar", "Vert", "vert", "VerticalBar", "VerticalLine", "VerticalSeparator", "VerticalTilde", "VeryThinSpace", "Vfr", "vfr", "vltri", "vnsub", "vnsup", "Vopf", "vopf", "vprop", "vrtri", "Vscr", "vscr", "vsubnE", "vsubne", "vsupnE", "vsupne", "Vvdash", "vzigzag", "Wcirc", "wcirc", "wedbar", "Wedge", "wedge", "wedgeq", "weierp", "Wfr", "wfr", "Wopf", "wopf", "wp", "wr", "wreath", "Wscr", "wscr", "xcap", "xcirc", "xcup", "xdtri", "Xfr", "xfr", "xhArr", "xharr", "Xi", "xi", "xlArr", "xlarr", "xmap", "xnis", "xodot", "Xopf", "xopf", "xoplus", "xotime", "xrArr", "xrarr", "Xscr", "xscr", "xsqcup", "xuplus", "xutri", "xvee", "xwedge", "Yacute", "yacute", "YAcy", "yacy", "Ycirc", "ycirc", "Ycy", "ycy", "yen", "Yfr", "yfr", "YIcy", "yicy", "Yopf", "yopf", "Yscr", "yscr", "YUcy", "yucy", "Yuml", "yuml", "Zacute", "zacute", "Zcaron", "zcaron", "Zcy", "zcy", "Zdot", "zdot", "zeetrf", "ZeroWidthSpace", "Zeta", "zeta", "Zfr", "zfr", "ZHcy", "zhcy", "zigrarr", "Zopf", "zopf", "Zscr", "zscr", "zwj", "zwnj"]);
  var allNamedEntitiesSetOnlyCaseInsensitive = new Set(["aacute", "abreve", "ac", "acd", "ace", "acirc", "acute", "acy", "aelig", "af", "afr", "agrave", "alefsym", "aleph", "alpha", "amacr", "amalg", "amp", "and", "andand", "andd", "andslope", "andv", "ang", "ange", "angle", "angmsd", "angmsdaa", "angmsdab", "angmsdac", "angmsdad", "angmsdae", "angmsdaf", "angmsdag", "angmsdah", "angrt", "angrtvb", "angrtvbd", "angsph", "angst", "angzarr", "aogon", "aopf", "ap", "apacir", "ape", "apid", "apos", "applyfunction", "approx", "approxeq", "aring", "ascr", "assign", "ast", "asymp", "asympeq", "atilde", "auml", "awconint", "awint", "backcong", "backepsilon", "backprime", "backsim", "backsimeq", "backslash", "barv", "barvee", "barwed", "barwedge", "bbrk", "bbrktbrk", "bcong", "bcy", "bdquo", "becaus", "because", "bemptyv", "bepsi", "bernou", "bernoullis", "beta", "beth", "between", "bfr", "bigcap", "bigcirc", "bigcup", "bigodot", "bigoplus", "bigotimes", "bigsqcup", "bigstar", "bigtriangledown", "bigtriangleup", "biguplus", "bigvee", "bigwedge", "bkarow", "blacklozenge", "blacksquare", "blacktriangle", "blacktriangledown", "blacktriangleleft", "blacktriangleright", "blank", "blk12", "blk14", "blk34", "block", "bne", "bnequiv", "bnot", "bopf", "bot", "bottom", "bowtie", "boxbox", "boxdl", "boxdr", "boxh", "boxhd", "boxhu", "boxminus", "boxplus", "boxtimes", "boxul", "boxur", "boxv", "boxvh", "boxvl", "boxvr", "bprime", "breve", "brvbar", "bscr", "bsemi", "bsim", "bsime", "bsol", "bsolb", "bsolhsub", "bull", "bullet", "bump", "bumpe", "bumpeq", "cacute", "cap", "capand", "capbrcup", "capcap", "capcup", "capdot", "capitaldifferentiald", "caps", "caret", "caron", "cayleys", "ccaps", "ccaron", "ccedil", "ccirc", "cconint", "ccups", "ccupssm", "cdot", "cedil", "cedilla", "cemptyv", "cent", "centerdot", "cfr", "chcy", "check", "checkmark", "chi", "cir", "circ", "circeq", "circlearrowleft", "circlearrowright", "circledast", "circledcirc", "circleddash", "circledot", "circledr", "circleds", "circleminus", "circleplus", "circletimes", "cire", "cirfnint", "cirmid", "cirscir", "clockwisecontourintegral", "closecurlydoublequote", "closecurlyquote", "clubs", "clubsuit", "colon", "colone", "coloneq", "comma", "commat", "comp", "compfn", "complement", "complexes", "cong", "congdot", "congruent", "conint", "contourintegral", "copf", "coprod", "coproduct", "copy", "copysr", "counterclockwisecontourintegral", "crarr", "cross", "cscr", "csub", "csube", "csup", "csupe", "ctdot", "cudarrl", "cudarrr", "cuepr", "cuesc", "cularr", "cularrp", "cup", "cupbrcap", "cupcap", "cupcup", "cupdot", "cupor", "cups", "curarr", "curarrm", "curlyeqprec", "curlyeqsucc", "curlyvee", "curlywedge", "curren", "curvearrowleft", "curvearrowright", "cuvee", "cuwed", "cwconint", "cwint", "cylcty", "dagger", "daleth", "darr", "dash", "dashv", "dbkarow", "dblac", "dcaron", "dcy", "dd", "ddagger", "ddarr", "ddotrahd", "ddotseq", "deg", "del", "delta", "demptyv", "dfisht", "dfr", "dhar", "dharl", "dharr", "diacriticalacute", "diacriticaldot", "diacriticaldoubleacute", "diacriticalgrave", "diacriticaltilde", "diam", "diamond", "diamondsuit", "diams", "die", "differentiald", "digamma", "disin", "div", "divide", "divideontimes", "divonx", "djcy", "dlcorn", "dlcrop", "dollar", "dopf", "dot", "dotdot", "doteq", "doteqdot", "dotequal", "dotminus", "dotplus", "dotsquare", "doublebarwedge", "doublecontourintegral", "doubledot", "doubledownarrow", "doubleleftarrow", "doubleleftrightarrow", "doublelefttee", "doublelongleftarrow", "doublelongleftrightarrow", "doublelongrightarrow", "doublerightarrow", "doublerighttee", "doubleuparrow", "doubleupdownarrow", "doubleverticalbar", "downarrow", "downarrowbar", "downarrowuparrow", "downbreve", "downdownarrows", "downharpoonleft", "downharpoonright", "downleftrightvector", "downleftteevector", "downleftvector", "downleftvectorbar", "downrightteevector", "downrightvector", "downrightvectorbar", "downtee", "downteearrow", "drbkarow", "drcorn", "drcrop", "dscr", "dscy", "dsol", "dstrok", "dtdot", "dtri", "dtrif", "duarr", "duhar", "dwangle", "dzcy", "dzigrarr", "eacute", "easter", "ecaron", "ecir", "ecirc", "ecolon", "ecy", "eddot", "edot", "ee", "efdot", "efr", "eg", "egrave", "egs", "egsdot", "el", "element", "elinters", "ell", "els", "elsdot", "emacr", "empty", "emptyset", "emptysmallsquare", "emptyv", "emptyverysmallsquare", "emsp", "emsp13", "emsp14", "eng", "ensp", "eogon", "eopf", "epar", "eparsl", "eplus", "epsi", "epsilon", "epsiv", "eqcirc", "eqcolon", "eqsim", "eqslantgtr", "eqslantless", "equal", "equals", "equaltilde", "equest", "equilibrium", "equiv", "equivdd", "eqvparsl", "erarr", "erdot", "escr", "esdot", "esim", "eta", "eth", "euml", "euro", "excl", "exist", "exists", "expectation", "exponentiale", "fallingdotseq", "fcy", "female", "ffilig", "fflig", "ffllig", "ffr", "filig", "filledsmallsquare", "filledverysmallsquare", "fjlig", "flat", "fllig", "fltns", "fnof", "fopf", "forall", "fork", "forkv", "fouriertrf", "fpartint", "frac12", "frac13", "frac14", "frac15", "frac16", "frac18", "frac23", "frac25", "frac34", "frac35", "frac38", "frac45", "frac56", "frac58", "frac78", "frasl", "frown", "fscr", "gacute", "gamma", "gammad", "gap", "gbreve", "gcedil", "gcirc", "gcy", "gdot", "ge", "gel", "geq", "geqq", "geqslant", "ges", "gescc", "gesdot", "gesdoto", "gesdotol", "gesl", "gesles", "gfr", "gg", "ggg", "gimel", "gjcy", "gl", "gla", "gle", "glj", "gnap", "gnapprox", "gne", "gneq", "gneqq", "gnsim", "gopf", "grave", "greaterequal", "greaterequalless", "greaterfullequal", "greatergreater", "greaterless", "greaterslantequal", "greatertilde", "gscr", "gsim", "gsime", "gsiml", "gt", "gtcc", "gtcir", "gtdot", "gtlpar", "gtquest", "gtrapprox", "gtrarr", "gtrdot", "gtreqless", "gtreqqless", "gtrless", "gtrsim", "gvertneqq", "gvne", "hacek", "hairsp", "half", "hamilt", "hardcy", "harr", "harrcir", "harrw", "hat", "hbar", "hcirc", "hearts", "heartsuit", "hellip", "hercon", "hfr", "hilbertspace", "hksearow", "hkswarow", "hoarr", "homtht", "hookleftarrow", "hookrightarrow", "hopf", "horbar", "horizontalline", "hscr", "hslash", "hstrok", "humpdownhump", "humpequal", "hybull", "hyphen", "iacute", "ic", "icirc", "icy", "idot", "iecy", "iexcl", "iff", "ifr", "igrave", "ii", "iiiint", "iiint", "iinfin", "iiota", "ijlig", "im", "imacr", "image", "imaginaryi", "imagline", "imagpart", "imath", "imof", "imped", "implies", "in", "incare", "infin", "infintie", "inodot", "int", "intcal", "integers", "integral", "intercal", "intersection", "intlarhk", "intprod", "invisiblecomma", "invisibletimes", "iocy", "iogon", "iopf", "iota", "iprod", "iquest", "iscr", "isin", "isindot", "isine", "isins", "isinsv", "isinv", "it", "itilde", "iukcy", "iuml", "jcirc", "jcy", "jfr", "jmath", "jopf", "jscr", "jsercy", "jukcy", "kappa", "kappav", "kcedil", "kcy", "kfr", "kgreen", "khcy", "kjcy", "kopf", "kscr", "laarr", "lacute", "laemptyv", "lagran", "lambda", "lang", "langd", "langle", "lap", "laplacetrf", "laquo", "larr", "larrb", "larrbfs", "larrfs", "larrhk", "larrlp", "larrpl", "larrsim", "larrtl", "lat", "latail", "late", "lates", "lbarr", "lbbrk", "lbrace", "lbrack", "lbrke", "lbrksld", "lbrkslu", "lcaron", "lcedil", "lceil", "lcub", "lcy", "ldca", "ldquo", "ldquor", "ldrdhar", "ldrushar", "ldsh", "le", "leftanglebracket", "leftarrow", "leftarrowbar", "leftarrowrightarrow", "leftarrowtail", "leftceiling", "leftdoublebracket", "leftdownteevector", "leftdownvector", "leftdownvectorbar", "leftfloor", "leftharpoondown", "leftharpoonup", "leftleftarrows", "leftrightarrow", "leftrightarrows", "leftrightharpoons", "leftrightsquigarrow", "leftrightvector", "lefttee", "leftteearrow", "leftteevector", "leftthreetimes", "lefttriangle", "lefttrianglebar", "lefttriangleequal", "leftupdownvector", "leftupteevector", "leftupvector", "leftupvectorbar", "leftvector", "leftvectorbar", "leg", "leq", "leqq", "leqslant", "les", "lescc", "lesdot", "lesdoto", "lesdotor", "lesg", "lesges", "lessapprox", "lessdot", "lesseqgtr", "lesseqqgtr", "lessequalgreater", "lessfullequal", "lessgreater", "lessgtr", "lessless", "lesssim", "lessslantequal", "lesstilde", "lfisht", "lfloor", "lfr", "lg", "lge", "lhar", "lhard", "lharu", "lharul", "lhblk", "ljcy", "ll", "llarr", "llcorner", "lleftarrow", "llhard", "lltri", "lmidot", "lmoust", "lmoustache", "lnap", "lnapprox", "lne", "lneq", "lneqq", "lnsim", "loang", "loarr", "lobrk", "longleftarrow", "longleftrightarrow", "longmapsto", "longrightarrow", "looparrowleft", "looparrowright", "lopar", "lopf", "loplus", "lotimes", "lowast", "lowbar", "lowerleftarrow", "lowerrightarrow", "loz", "lozenge", "lozf", "lpar", "lparlt", "lrarr", "lrcorner", "lrhar", "lrhard", "lrm", "lrtri", "lsaquo", "lscr", "lsh", "lsim", "lsime", "lsimg", "lsqb", "lsquo", "lsquor", "lstrok", "lt", "ltcc", "ltcir", "ltdot", "lthree", "ltimes", "ltlarr", "ltquest", "ltri", "ltrie", "ltrif", "ltrpar", "lurdshar", "luruhar", "lvertneqq", "lvne", "macr", "male", "malt", "maltese", "map", "mapsto", "mapstodown", "mapstoleft", "mapstoup", "marker", "mcomma", "mcy", "mdash", "mddot", "measuredangle", "mediumspace", "mellintrf", "mfr", "mho", "micro", "mid", "midast", "midcir", "middot", "minus", "minusb", "minusd", "minusdu", "minusplus", "mlcp", "mldr", "mnplus", "models", "mopf", "mp", "mscr", "mstpos", "mu", "multimap", "mumap", "nabla", "nacute", "nang", "nap", "nape", "napid", "napos", "napprox", "natur", "natural", "naturals", "nbsp", "nbump", "nbumpe", "ncap", "ncaron", "ncedil", "ncong", "ncongdot", "ncup", "ncy", "ndash", "ne", "nearhk", "nearr", "nearrow", "nedot", "negativemediumspace", "negativethickspace", "negativethinspace", "negativeverythinspace", "nequiv", "nesear", "nesim", "nestedgreatergreater", "nestedlessless", "newline", "nexist", "nexists", "nfr", "nge", "ngeq", "ngeqq", "ngeqslant", "nges", "ngg", "ngsim", "ngt", "ngtr", "ngtv", "nharr", "nhpar", "ni", "nis", "nisd", "niv", "njcy", "nlarr", "nldr", "nle", "nleftarrow", "nleftrightarrow", "nleq", "nleqq", "nleqslant", "nles", "nless", "nll", "nlsim", "nlt", "nltri", "nltrie", "nltv", "nmid", "nobreak", "nonbreakingspace", "nopf", "not", "notcongruent", "notcupcap", "notdoubleverticalbar", "notelement", "notequal", "notequaltilde", "notexists", "notgreater", "notgreaterequal", "notgreaterfullequal", "notgreatergreater", "notgreaterless", "notgreaterslantequal", "notgreatertilde", "nothumpdownhump", "nothumpequal", "notin", "notindot", "notine", "notinva", "notinvb", "notinvc", "notlefttriangle", "notlefttrianglebar", "notlefttriangleequal", "notless", "notlessequal", "notlessgreater", "notlessless", "notlessslantequal", "notlesstilde", "notnestedgreatergreater", "notnestedlessless", "notni", "notniva", "notnivb", "notnivc", "notprecedes", "notprecedesequal", "notprecedesslantequal", "notreverseelement", "notrighttriangle", "notrighttrianglebar", "notrighttriangleequal", "notsquaresubset", "notsquaresubsetequal", "notsquaresuperset", "notsquaresupersetequal", "notsubset", "notsubsetequal", "notsucceeds", "notsucceedsequal", "notsucceedsslantequal", "notsucceedstilde", "notsuperset", "notsupersetequal", "nottilde", "nottildeequal", "nottildefullequal", "nottildetilde", "notverticalbar", "npar", "nparallel", "nparsl", "npart", "npolint", "npr", "nprcue", "npre", "nprec", "npreceq", "nrarr", "nrarrc", "nrarrw", "nrightarrow", "nrtri", "nrtrie", "nsc", "nsccue", "nsce", "nscr", "nshortmid", "nshortparallel", "nsim", "nsime", "nsimeq", "nsmid", "nspar", "nsqsube", "nsqsupe", "nsub", "nsube", "nsubset", "nsubseteq", "nsubseteqq", "nsucc", "nsucceq", "nsup", "nsupe", "nsupset", "nsupseteq", "nsupseteqq", "ntgl", "ntilde", "ntlg", "ntriangleleft", "ntrianglelefteq", "ntriangleright", "ntrianglerighteq", "nu", "num", "numero", "numsp", "nvap", "nvdash", "nvge", "nvgt", "nvharr", "nvinfin", "nvlarr", "nvle", "nvlt", "nvltrie", "nvrarr", "nvrtrie", "nvsim", "nwarhk", "nwarr", "nwarrow", "nwnear", "oacute", "oast", "ocir", "ocirc", "ocy", "odash", "odblac", "odiv", "odot", "odsold", "oelig", "ofcir", "ofr", "ogon", "ograve", "ogt", "ohbar", "ohm", "oint", "olarr", "olcir", "olcross", "oline", "olt", "omacr", "omega", "omicron", "omid", "ominus", "oopf", "opar", "opencurlydoublequote", "opencurlyquote", "operp", "oplus", "or", "orarr", "ord", "order", "orderof", "ordf", "ordm", "origof", "oror", "orslope", "orv", "os", "oscr", "oslash", "osol", "otilde", "otimes", "otimesas", "ouml", "ovbar", "overbar", "overbrace", "overbracket", "overparenthesis", "par", "para", "parallel", "parsim", "parsl", "part", "partiald", "pcy", "percnt", "period", "permil", "perp", "pertenk", "pfr", "phi", "phiv", "phmmat", "phone", "pi", "pitchfork", "piv", "planck", "planckh", "plankv", "plus", "plusacir", "plusb", "pluscir", "plusdo", "plusdu", "pluse", "plusminus", "plusmn", "plussim", "plustwo", "pm", "poincareplane", "pointint", "popf", "pound", "pr", "prap", "prcue", "pre", "prec", "precapprox", "preccurlyeq", "precedes", "precedesequal", "precedesslantequal", "precedestilde", "preceq", "precnapprox", "precneqq", "precnsim", "precsim", "prime", "primes", "prnap", "prne", "prnsim", "prod", "product", "profalar", "profline", "profsurf", "prop", "proportion", "proportional", "propto", "prsim", "prurel", "pscr", "psi", "puncsp", "qfr", "qint", "qopf", "qprime", "qscr", "quaternions", "quatint", "quest", "questeq", "quot", "raarr", "race", "racute", "radic", "raemptyv", "rang", "rangd", "range", "rangle", "raquo", "rarr", "rarrap", "rarrb", "rarrbfs", "rarrc", "rarrfs", "rarrhk", "rarrlp", "rarrpl", "rarrsim", "rarrtl", "rarrw", "ratail", "ratio", "rationals", "rbarr", "rbbrk", "rbrace", "rbrack", "rbrke", "rbrksld", "rbrkslu", "rcaron", "rcedil", "rceil", "rcub", "rcy", "rdca", "rdldhar", "rdquo", "rdquor", "rdsh", "re", "real", "realine", "realpart", "reals", "rect", "reg", "reverseelement", "reverseequilibrium", "reverseupequilibrium", "rfisht", "rfloor", "rfr", "rhar", "rhard", "rharu", "rharul", "rho", "rhov", "rightanglebracket", "rightarrow", "rightarrowbar", "rightarrowleftarrow", "rightarrowtail", "rightceiling", "rightdoublebracket", "rightdownteevector", "rightdownvector", "rightdownvectorbar", "rightfloor", "rightharpoondown", "rightharpoonup", "rightleftarrows", "rightleftharpoons", "rightrightarrows", "rightsquigarrow", "righttee", "rightteearrow", "rightteevector", "rightthreetimes", "righttriangle", "righttrianglebar", "righttriangleequal", "rightupdownvector", "rightupteevector", "rightupvector", "rightupvectorbar", "rightvector", "rightvectorbar", "ring", "risingdotseq", "rlarr", "rlhar", "rlm", "rmoust", "rmoustache", "rnmid", "roang", "roarr", "robrk", "ropar", "ropf", "roplus", "rotimes", "roundimplies", "rpar", "rpargt", "rppolint", "rrarr", "rrightarrow", "rsaquo", "rscr", "rsh", "rsqb", "rsquo", "rsquor", "rthree", "rtimes", "rtri", "rtrie", "rtrif", "rtriltri", "ruledelayed", "ruluhar", "rx", "sacute", "sbquo", "sc", "scap", "scaron", "sccue", "sce", "scedil", "scirc", "scnap", "scne", "scnsim", "scpolint", "scsim", "scy", "sdot", "sdotb", "sdote", "searhk", "searr", "searrow", "sect", "semi", "seswar", "setminus", "setmn", "sext", "sfr", "sfrown", "sharp", "shchcy", "shcy", "shortdownarrow", "shortleftarrow", "shortmid", "shortparallel", "shortrightarrow", "shortuparrow", "shy", "sigma", "sigmaf", "sigmav", "sim", "simdot", "sime", "simeq", "simg", "simge", "siml", "simle", "simne", "simplus", "simrarr", "slarr", "smallcircle", "smallsetminus", "smashp", "smeparsl", "smid", "smile", "smt", "smte", "smtes", "softcy", "sol", "solb", "solbar", "sopf", "spades", "spadesuit", "spar", "sqcap", "sqcaps", "sqcup", "sqcups", "sqrt", "sqsub", "sqsube", "sqsubset", "sqsubseteq", "sqsup", "sqsupe", "sqsupset", "sqsupseteq", "squ", "square", "squareintersection", "squaresubset", "squaresubsetequal", "squaresuperset", "squaresupersetequal", "squareunion", "squarf", "squf", "srarr", "sscr", "ssetmn", "ssmile", "sstarf", "star", "starf", "straightepsilon", "straightphi", "strns", "sub", "subdot", "sube", "subedot", "submult", "subne", "subplus", "subrarr", "subset", "subseteq", "subseteqq", "subsetequal", "subsetneq", "subsetneqq", "subsim", "subsub", "subsup", "succ", "succapprox", "succcurlyeq", "succeeds", "succeedsequal", "succeedsslantequal", "succeedstilde", "succeq", "succnapprox", "succneqq", "succnsim", "succsim", "suchthat", "sum", "sung", "sup", "sup1", "sup2", "sup3", "supdot", "supdsub", "supe", "supedot", "superset", "supersetequal", "suphsol", "suphsub", "suplarr", "supmult", "supne", "supplus", "supset", "supseteq", "supseteqq", "supsetneq", "supsetneqq", "supsim", "supsub", "supsup", "swarhk", "swarr", "swarrow", "swnwar", "szlig", "tab", "target", "tau", "tbrk", "tcaron", "tcedil", "tcy", "tdot", "telrec", "tfr", "there4", "therefore", "theta", "thetasym", "thetav", "thickapprox", "thicksim", "thickspace", "thinsp", "thinspace", "thkap", "thksim", "thorn", "tilde", "tildeequal", "tildefullequal", "tildetilde", "times", "timesb", "timesbar", "timesd", "tint", "toea", "top", "topbot", "topcir", "topf", "topfork", "tosa", "tprime", "trade", "triangle", "triangledown", "triangleleft", "trianglelefteq", "triangleq", "triangleright", "trianglerighteq", "tridot", "trie", "triminus", "tripledot", "triplus", "trisb", "tritime", "trpezium", "tscr", "tscy", "tshcy", "tstrok", "twixt", "twoheadleftarrow", "twoheadrightarrow", "uacute", "uarr", "uarrocir", "ubrcy", "ubreve", "ucirc", "ucy", "udarr", "udblac", "udhar", "ufisht", "ufr", "ugrave", "uhar", "uharl", "uharr", "uhblk", "ulcorn", "ulcorner", "ulcrop", "ultri", "umacr", "uml", "underbar", "underbrace", "underbracket", "underparenthesis", "union", "unionplus", "uogon", "uopf", "uparrow", "uparrowbar", "uparrowdownarrow", "updownarrow", "upequilibrium", "upharpoonleft", "upharpoonright", "uplus", "upperleftarrow", "upperrightarrow", "upsi", "upsih", "upsilon", "uptee", "upteearrow", "upuparrows", "urcorn", "urcorner", "urcrop", "uring", "urtri", "uscr", "utdot", "utilde", "utri", "utrif", "uuarr", "uuml", "uwangle", "vangrt", "varepsilon", "varkappa", "varnothing", "varphi", "varpi", "varpropto", "varr", "varrho", "varsigma", "varsubsetneq", "varsubsetneqq", "varsupsetneq", "varsupsetneqq", "vartheta", "vartriangleleft", "vartriangleright", "vbar", "vbarv", "vcy", "vdash", "vdashl", "vee", "veebar", "veeeq", "vellip", "verbar", "vert", "verticalbar", "verticalline", "verticalseparator", "verticaltilde", "verythinspace", "vfr", "vltri", "vnsub", "vnsup", "vopf", "vprop", "vrtri", "vscr", "vsubne", "vsupne", "vvdash", "vzigzag", "wcirc", "wedbar", "wedge", "wedgeq", "weierp", "wfr", "wopf", "wp", "wr", "wreath", "wscr", "xcap", "xcirc", "xcup", "xdtri", "xfr", "xharr", "xi", "xlarr", "xmap", "xnis", "xodot", "xopf", "xoplus", "xotime", "xrarr", "xscr", "xsqcup", "xuplus", "xutri", "xvee", "xwedge", "yacute", "yacy", "ycirc", "ycy", "yen", "yfr", "yicy", "yopf", "yscr", "yucy", "yuml", "zacute", "zcaron", "zcy", "zdot", "zeetrf", "zerowidthspace", "zeta", "zfr", "zhcy", "zigrarr", "zopf", "zscr", "zwj", "zwnj"]);

  function decode(ent) {
    if (typeof ent !== "string" || !ent.length || !ent.startsWith("&") || !ent.endsWith(";")) {
      throw new Error("all-named-html-entities/decode(): [THROW_ID_01] Input must be an HTML entity with leading ampersand and trailing semicolon, but \"".concat(ent, "\" was given"));
    }

    var val = ent.slice(1, ent.length - 1);
    return allNamedEntities[val] ? allNamedEntities[val] : null;
  }
  var maxLength = 31;

  function isObj(something) {
    return something && _typeof(something) === "object" && !Array.isArray(something);
  }

  function isLatinLetterOrNumberOrHash(char) {
    return isStr$1(char) && char.length === 1 && (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123 || char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58 || char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91 || char.charCodeAt(0) === 35);
  }

  function isNumber(something) {
    return isStr$1(something) && something.charCodeAt(0) > 47 && something.charCodeAt(0) < 58;
  }

  function isStr$1(something) {
    return typeof something === "string";
  }

  function isLatinLetter(something) {
    return typeof something === "string" && (something.charCodeAt(0) > 96 && something.charCodeAt(0) < 123 || something.charCodeAt(0) > 64 && something.charCodeAt(0) < 91);
  }

  function resemblesNumericEntity(str2, from, to) {
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
    }

    var probablyNumeric = false;

    if (!lettersCount && numbersCount > othersCount) {
      probablyNumeric = "deci";
    } else if ((numbersCount || lettersCount) && (charTrimmed[0] === "#" && charTrimmed[1].toLowerCase() === "x" && (isNumber(charTrimmed[2]) || isLatinLetter(charTrimmed[2])) || charTrimmed[0].toLowerCase() === "x" && numbersCount && !othersCount)) {
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

  function findLongest(temp1) {
    if (Array.isArray(temp1) && temp1.length) {
      if (temp1.length === 1) {
        return temp1[0];
      }

      return temp1.reduce(function (accum, tempObj) {
        if (tempObj.tempEnt.length > accum.tempEnt.length) {
          return tempObj;
        }

        return accum;
      });
    }

    return temp1;
  }

  function removeGappedFromMixedCases(str, temp1) {
    /* istanbul ignore if */
    if (arguments.length !== 2) {
      throw new Error("removeGappedFromMixedCases(): wrong amount of inputs!");
    }

    var copy;

    if (Array.isArray(temp1) && temp1.length) {
      copy = Array.from(temp1);
      /* istanbul ignore if */

      if (copy.length > 1 && copy.some(function (entityObj) {
        return str[right(str, entityObj.tempRes.rightmostChar)] === ";";
      }) && copy.some(function (entityObj) {
        return str[right(str, entityObj.tempRes.rightmostChar)] !== ";";
      })) {
        copy = copy.filter(function (entityObj) {
          return str[right(str, entityObj.tempRes.rightmostChar)] === ";";
        });
      }

      if (!(copy.every(function (entObj) {
        return !entObj || !entObj.tempRes || !entObj.tempRes.gaps || !Array.isArray(entObj.tempRes.gaps) || !entObj.tempRes.gaps.length;
      }) || copy.every(function (entObj) {
        return entObj && entObj.tempRes && entObj.tempRes.gaps && Array.isArray(entObj.tempRes.gaps) && entObj.tempRes.gaps.length;
      }))) {
        return findLongest(copy.filter(function (entObj) {
          return !entObj.tempRes.gaps || !Array.isArray(entObj.tempRes.gaps) || !entObj.tempRes.gaps.length;
        }));
      }
    }

    return findLongest(temp1);
  }

  function stringFixBrokenNamedEntities(str, originalOpts) {
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
        opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);
      }
    } else {
      opts = defaults;
    }

    if (opts.cb && typeof opts.cb !== "function") {
      throw new TypeError("string-fix-broken-named-entities: [THROW_ID_03] opts.cb must be a function (or falsey)! Currently it's: ".concat(_typeof(opts.cb), ", equal to: ").concat(JSON.stringify(opts.cb, null, 4)));
    }

    if (opts.entityCatcherCb && typeof opts.entityCatcherCb !== "function") {
      throw new TypeError("string-fix-broken-named-entities: [THROW_ID_04] opts.entityCatcherCb must be a function (or falsey)! Currently it's: ".concat(_typeof(opts.entityCatcherCb), ", equal to: ").concat(JSON.stringify(opts.entityCatcherCb, null, 4)));
    }

    if (opts.progressFn && typeof opts.progressFn !== "function") {
      throw new TypeError("string-fix-broken-named-entities: [THROW_ID_05] opts.progressFn must be a function (or falsey)! Currently it's: ".concat(_typeof(opts.progressFn), ", equal to: ").concat(JSON.stringify(opts.progressFn, null, 4)));
    }

    var rangesArr2 = [];
    var percentageDone;
    var lastPercentageDone;
    var len = str.length + 1;
    var counter = 0;
    var doNothingUntil = null;
    var letterSeqStartAt = null;
    var brokenNumericEntityStartAt = null;

    var _loop = function _loop(i) {
      if (opts.progressFn) {
        percentageDone = Math.floor(counter / len * 100);
        /* istanbul ignore else */

        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          opts.progressFn(percentageDone);
        }
      }

      if (doNothingUntil) {
        if (doNothingUntil !== true && i >= doNothingUntil) {
          doNothingUntil = null;
        } else {
          counter += 1;
          return "continue";
        }
      }

      if (letterSeqStartAt !== null && i - letterSeqStartAt > 50) {
        letterSeqStartAt = null;
      }

      if (letterSeqStartAt !== null && (!str[i] || str[i].trim().length && !isLatinLetterOrNumberOrHash(str[i]))) {
        if (i > letterSeqStartAt + 1) {
          var potentialEntity = str.slice(letterSeqStartAt, i);
          var whatsOnTheLeft = left(str, letterSeqStartAt);
          var whatsEvenMoreToTheLeft = whatsOnTheLeft ? left(str, whatsOnTheLeft) : "";

          if (str[whatsOnTheLeft] === "&" && (!str[i] || str[i] !== ";")) {
            var firstChar = letterSeqStartAt;
            /* istanbul ignore next */

            var secondChar = letterSeqStartAt ? right(str, letterSeqStartAt) : null;
            /* istanbul ignore else */

            if (Object.prototype.hasOwnProperty.call(startsWith, str[firstChar]) && Object.prototype.hasOwnProperty.call(startsWith[str[firstChar]], str[secondChar])) {
              var tempEnt;
              var tempRes;
              var temp1 = startsWith[str[firstChar]][str[secondChar]].reduce(function (gatheredSoFar, oneOfKnownEntities) {
                tempRes = rightSeq.apply(void 0, [str, letterSeqStartAt - 1].concat(_toConsumableArray(oneOfKnownEntities.split(""))));

                if (tempRes) {
                  return gatheredSoFar.concat([{
                    tempEnt: oneOfKnownEntities,
                    tempRes: tempRes
                  }]);
                }

                return gatheredSoFar;
              }, []);
              temp1 = removeGappedFromMixedCases(str, temp1);
              /* istanbul ignore else */

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
              }
            }
          } else if (str[whatsOnTheLeft] !== "&" && str[whatsEvenMoreToTheLeft] !== "&" && str[i] === ";") {
            var lastChar = left(str, i);
            var secondToLast = left(str, lastChar);

            if (secondToLast !== null && Object.prototype.hasOwnProperty.call(endsWith, str[lastChar]) && Object.prototype.hasOwnProperty.call(endsWith[str[lastChar]], str[secondToLast])) {
              var _tempEnt;

              var _tempRes;

              var _temp2 = endsWith[str[lastChar]][str[secondToLast]].reduce(function (gatheredSoFar, oneOfKnownEntities) {
                _tempRes = leftSeq.apply(void 0, [str, i].concat(_toConsumableArray(oneOfKnownEntities.split(""))));

                if (_tempRes && !(oneOfKnownEntities === "block" && str[left(str, letterSeqStartAt)] === ":")) {
                  return gatheredSoFar.concat([{
                    tempEnt: oneOfKnownEntities,
                    tempRes: _tempRes
                  }]);
                }

                return gatheredSoFar;
              }, []);

              _temp2 = removeGappedFromMixedCases(str, _temp2);
              /* istanbul ignore else */

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
              rangesArr2.push({
                ruleName: "bad-malformed-numeric-character-entity",
                entityName: null,
                rangeFrom: brokenNumericEntityStartAt,
                rangeTo: i + 1,
                rangeValEncoded: null,
                rangeValDecoded: null
              });
              brokenNumericEntityStartAt = null;
            }
          } else if ((str[whatsOnTheLeft] === "&" || str[whatsOnTheLeft] === ";" && str[whatsEvenMoreToTheLeft] === "&") && str[i] === ";") {
            /* istanbul ignore else */
            if (str.slice(whatsOnTheLeft + 1, i).trim().length > 1) {
              var situation = resemblesNumericEntity(str, whatsOnTheLeft + 1, i);

              if (situation.probablyNumeric) {
                if (
                /* istanbul ignore next */
                situation.probablyNumeric && situation.charTrimmed[0] === "#" && !situation.whitespaceCount && (!situation.lettersCount && situation.numbersCount > 0 && !situation.othersCount || (situation.numbersCount || situation.lettersCount) && situation.charTrimmed[1] === "x" && !situation.othersCount)) {
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
                  rangesArr2.push({
                    ruleName: "bad-malformed-numeric-character-entity",
                    entityName: null,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null
                  });
                }

                if (opts.entityCatcherCb) {
                  opts.entityCatcherCb(whatsOnTheLeft, i + 1);
                }
              } else {
                var potentialEntityOnlyNonWhitespaceChars = Array.from(potentialEntity).filter(function (char) {
                  return char.trim().length;
                }).join("");

                if (potentialEntityOnlyNonWhitespaceChars.length <= maxLength && allNamedEntitiesSetOnlyCaseInsensitive.has(potentialEntityOnlyNonWhitespaceChars.toLowerCase())) {
                  if (!allNamedEntitiesSetOnly.has(potentialEntityOnlyNonWhitespaceChars)) {
                    var matchingEntitiesOfCorrectCaseArr = _toConsumableArray(allNamedEntitiesSetOnly).filter(function (ent) {
                      return ent.toLowerCase() === potentialEntityOnlyNonWhitespaceChars.toLowerCase();
                    });

                    if (matchingEntitiesOfCorrectCaseArr.length === 1) {
                      rangesArr2.push({
                        ruleName: "bad-named-html-entity-malformed-".concat(matchingEntitiesOfCorrectCaseArr[0]),
                        entityName: matchingEntitiesOfCorrectCaseArr[0],
                        rangeFrom: whatsOnTheLeft,
                        rangeTo: i + 1,
                        rangeValEncoded: "&".concat(matchingEntitiesOfCorrectCaseArr[0], ";"),
                        rangeValDecoded: decode("&".concat(matchingEntitiesOfCorrectCaseArr[0], ";"))
                      });
                    } else {
                      rangesArr2.push({
                        ruleName: "bad-named-html-entity-unrecognised",
                        entityName: null,
                        rangeFrom: whatsOnTheLeft,
                        rangeTo: i + 1,
                        rangeValEncoded: null,
                        rangeValDecoded: null
                      });
                    }
                  } else if (i - whatsOnTheLeft - 1 !== potentialEntityOnlyNonWhitespaceChars.length || str[whatsOnTheLeft] !== "&") {
                    var rangeFrom = str[whatsOnTheLeft] === "&" ? whatsOnTheLeft : whatsEvenMoreToTheLeft;

                    if (Object.keys(uncertain).includes(potentialEntityOnlyNonWhitespaceChars) && !str[rangeFrom + 1].trim().length) {
                      letterSeqStartAt = null;
                      return "continue";
                    }

                    rangesArr2.push({
                      ruleName: "bad-named-html-entity-malformed-".concat(potentialEntityOnlyNonWhitespaceChars),
                      entityName: potentialEntityOnlyNonWhitespaceChars,
                      rangeFrom: rangeFrom,
                      rangeTo: i + 1,
                      rangeValEncoded: "&".concat(potentialEntityOnlyNonWhitespaceChars, ";"),
                      rangeValDecoded: decode("&".concat(potentialEntityOnlyNonWhitespaceChars, ";"))
                    });
                  } else if (opts.decode) {
                    rangesArr2.push({
                      ruleName: "encoded-html-entity-".concat(potentialEntityOnlyNonWhitespaceChars),
                      entityName: potentialEntityOnlyNonWhitespaceChars,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: "&".concat(potentialEntityOnlyNonWhitespaceChars, ";"),
                      rangeValDecoded: decode("&".concat(potentialEntityOnlyNonWhitespaceChars, ";"))
                    });
                  } else if (opts.entityCatcherCb) {
                    opts.entityCatcherCb(whatsOnTheLeft, i + 1);
                  }

                  letterSeqStartAt = null;
                  return "continue";
                }
                /* istanbul ignore next */


                var _secondChar = letterSeqStartAt ? right(str, letterSeqStartAt) : null;

                var _tempEnt2;

                var temp;

                if (Object.prototype.hasOwnProperty.call(brokenNamedEntities, situation.charTrimmed.toLowerCase())) {
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
                } else if (potentialEntity.length < maxLength + 2 && ((temp = _toConsumableArray(allNamedEntitiesSetOnly).filter(function (curr) {
                  return leven_1(curr, potentialEntity) === 1;
                })) && temp.length || (temp = _toConsumableArray(allNamedEntitiesSetOnly).filter(function (curr) {
                  return (
                    /* istanbul ignore next */
                    leven_1(curr, potentialEntity) === 2 && potentialEntity.length > 3
                  );
                })) && temp.length)) {
                  if (temp.length === 1) {
                    var _temp4 = temp;

                    var _temp5 = _slicedToArray(_temp4, 1);

                    _tempEnt2 = _temp5[0];
                    rangesArr2.push({
                      ruleName: "bad-named-html-entity-malformed-".concat(_tempEnt2),
                      entityName: _tempEnt2,
                      rangeFrom: whatsOnTheLeft,
                      rangeTo: i + 1,
                      rangeValEncoded: "&".concat(_tempEnt2, ";"),
                      rangeValDecoded: decode("&".concat(_tempEnt2, ";"))
                    });
                  }
                }

                if (!_tempEnt2) {
                  rangesArr2.push({
                    ruleName: "bad-named-html-entity-unrecognised",
                    entityName: null,
                    rangeFrom: whatsOnTheLeft,
                    rangeTo: i + 1,
                    rangeValEncoded: null,
                    rangeValDecoded: null
                  });
                }
              }
            }
          } else if (str[whatsEvenMoreToTheLeft] === "&" && str[i] === ";" && i - whatsEvenMoreToTheLeft < maxLength) {
            var _situation = resemblesNumericEntity(str, whatsEvenMoreToTheLeft + 1, i);

            rangesArr2.push({
              ruleName: "".concat(
              /* istanbul ignore next */
              _situation.probablyNumeric ? "bad-malformed-numeric-character-entity" : "bad-named-html-entity-unrecognised"),
              entityName: null,
              rangeFrom: whatsEvenMoreToTheLeft,
              rangeTo: i + 1,
              rangeValEncoded: null,
              rangeValDecoded: null
            });
          }
        }

        letterSeqStartAt = null;
      }

      if (letterSeqStartAt === null && isLatinLetterOrNumberOrHash(str[i]) && str[i + 1]) {
        letterSeqStartAt = i;
      }

      if (str[i] === "a") {
        var singleAmpOnTheRight = rightSeq(str, i, "m", "p", ";");

        if (singleAmpOnTheRight) {
          var toDeleteAllAmpEndHere = singleAmpOnTheRight.rightmostChar + 1;
          var nextAmpOnTheRight = rightSeq(str, singleAmpOnTheRight.rightmostChar, "a", "m", "p", ";");

          if (nextAmpOnTheRight) {
            toDeleteAllAmpEndHere = nextAmpOnTheRight.rightmostChar + 1;

            var _temp6;

            do {
              _temp6 = rightSeq(str, toDeleteAllAmpEndHere - 1, "a", "m", "p", ";");

              if (_temp6) {
                toDeleteAllAmpEndHere = _temp6.rightmostChar + 1;
              }
            } while (_temp6);
          }

          var firstCharThatFollows = right(str, toDeleteAllAmpEndHere - 1);
          var secondCharThatFollows = firstCharThatFollows ? right(str, firstCharThatFollows) : null;
          var matchedTemp;

          if (secondCharThatFollows && Object.prototype.hasOwnProperty.call(startsWith, str[firstCharThatFollows]) && Object.prototype.hasOwnProperty.call(startsWith[str[firstCharThatFollows]], str[secondCharThatFollows]) && startsWith[str[firstCharThatFollows]][str[secondCharThatFollows]].some(function (entity) {
            var matchEntityOnTheRight = rightSeq.apply(void 0, [str, toDeleteAllAmpEndHere - 1].concat(_toConsumableArray(entity.slice(""))));
            /* istanbul ignore else */

            if (matchEntityOnTheRight) {
              matchedTemp = entity;
              return true;
            }
          })) {
            doNothingUntil = firstCharThatFollows + matchedTemp.length + 1;

            var _whatsOnTheLeft = left(str, i);
            /* istanbul ignore else */


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
              var _rangeFrom = i;
              var spaceReplacement = "";
              if (str[i - 1] === " ") ;

              if (opts.cb) {
                rangesArr2.push({
                  ruleName: "bad-named-html-entity-multiple-encoding",
                  entityName: matchedTemp,
                  rangeFrom: _rangeFrom,
                  rangeTo: doNothingUntil,
                  rangeValEncoded: "".concat(spaceReplacement, "&").concat(matchedTemp, ";"),
                  rangeValDecoded: "".concat(spaceReplacement).concat(decode("&".concat(matchedTemp, ";")))
                });
              }
            }
          }
        }
      }

      if (str[i] === "#" && right(str, i) && str[right(str, i)].toLowerCase() === "x" && (!str[i - 1] || !left(str, i) || str[left(str, i)] !== "&")) {
        if (isNumber(str[right(str, right(str, i))])) {
          brokenNumericEntityStartAt = i;
        }
      }

      counter += 1;
    };

    for (var i = 0; i < len; i++) {
      var _ret = _loop(i);

      if (_ret === "continue") continue;
    }

    if (!rangesArr2.length) {
      return [];
    }

    var res = rangesArr2.filter(function (filteredRangeObj, i) {
      return rangesArr2.every(function (oneOfEveryObj, y) {
        return i === y || !(filteredRangeObj.rangeFrom >= oneOfEveryObj.rangeFrom && filteredRangeObj.rangeTo < oneOfEveryObj.rangeTo);
      });
    }).map(opts.cb);
    return res;
  }

  /**
   * arrayiffy-if-string
   * Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
   * Version: 3.11.33
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

  function isObj$1(something) {
    return something && _typeof(something) === "object" && !Array.isArray(something);
  }

  function isStr$2(something) {
    return typeof something === "string";
  }

  function march(str, fromIndexInclusive, whatToMatchVal, opts, special, getNextIdx) {
    var whatToMatchValVal = typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal;

    if (fromIndexInclusive < 0 && special && whatToMatchValVal === "EOL") {
      return whatToMatchValVal;
    }

    if (fromIndexInclusive >= str.length && !special) {
      return false;
    }

    var charsToCheckCount = special ? 1 : whatToMatchVal.length;
    var lastWasMismatched = false;
    var atLeastSomethingWasMatched = false;
    var patience = opts.maxMismatches;
    var i = fromIndexInclusive;
    var somethingFound = false;
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

      if (!opts.i && opts.trimCharsBeforeMatching.includes(str[i]) || opts.i && opts.trimCharsBeforeMatching.map(function (val) {
        return val.toLowerCase();
      }).includes(str[i].toLowerCase())) {
        if (special && whatToMatchVal === "EOL" && !str[nextIdx]) {
          return true;
        }

        i = getNextIdx(i);
        continue;
      }

      var charToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount] : whatToMatchVal[charsToCheckCount - 1];

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
          patience -= 1;

          for (var y = 0; y <= patience; y++) {
            var nextCharToCompareAgainst = nextIdx > i ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount + 1 + y] : whatToMatchVal[charsToCheckCount - 2 - y];
            var nextCharInSource = str[getNextIdx(i)];

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
      }

      if (opts.maxMismatches >= charsToCheckCount && atLeastSomethingWasMatched) {
        return lastWasMismatched || 0;
      }

      return false;
    }
  }

  function main(mode, str, position, originalWhatToMatch, originalOpts) {
    var defaults = {
      i: false,
      trimBeforeMatching: false,
      trimCharsBeforeMatching: [],
      maxMismatches: 0,
      firstMustMatch: false,
      lastMustMatch: false
    };

    if (isObj$1(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") && typeof originalOpts.trimBeforeMatching !== "boolean") {
      throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!").concat(Array.isArray(originalOpts.trimBeforeMatching) ? " Did you mean to use opts.trimCharsBeforeMatching?" : ""));
    }

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

    opts.trimCharsBeforeMatching = arrayiffyString(opts.trimCharsBeforeMatching);
    opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(function (el) {
      return isStr$2(el) ? el : String(el);
    });

    if (!isStr$2(str)) {
      return false;
    }

    if (!str.length) {
      return false;
    }

    if (!Number.isInteger(position) || position < 0) {
      throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ").concat(_typeof(position), ", equal to:\n").concat(JSON.stringify(position, null, 4)));
    }

    var whatToMatch;
    var special;

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
      throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ").concat(_typeof(originalWhatToMatch), ", equal to:\n").concat(JSON.stringify(originalWhatToMatch, null, 4)));
    }

    if (originalOpts && !isObj$1(originalOpts)) {
      throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type \"").concat(_typeof(originalOpts), "\", and equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
    }

    var culpritsIndex;
    var culpritsVal;

    if (opts.trimCharsBeforeMatching.some(function (el, i) {
      if (el.length > 1) {
        culpritsIndex = i;
        culpritsVal = el;
        return true;
      }

      return false;
    })) {
      throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ").concat(culpritsIndex, " is longer than 1 character, ").concat(culpritsVal.length, " (equals to ").concat(culpritsVal, "). Please split it into separate characters and put into array as separate elements."));
    }

    if (!whatToMatch || !Array.isArray(whatToMatch) || Array.isArray(whatToMatch) && !whatToMatch.length || Array.isArray(whatToMatch) && whatToMatch.length === 1 && isStr$2(whatToMatch[0]) && !whatToMatch[0].trim()) {
      if (typeof opts.cb === "function") {
        var firstCharOutsideIndex;
        var startingPosition = position;

        if (mode === "matchLeftIncl" || mode === "matchRight") {
          startingPosition += 1;
        }

        if (mode[5] === "L") {
          for (var y = startingPosition; y--;) {
            var currentChar = str[y];

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && currentChar !== undefined && currentChar.trim()) && (!opts.trimCharsBeforeMatching.length || currentChar !== undefined && !opts.trimCharsBeforeMatching.includes(currentChar))) {
              firstCharOutsideIndex = y;
              break;
            }
          }
        } else if (mode.startsWith("matchRight")) {
          for (var _y = startingPosition; _y < str.length; _y++) {
            var _currentChar = str[_y];

            if ((!opts.trimBeforeMatching || opts.trimBeforeMatching && _currentChar.trim()) && (!opts.trimCharsBeforeMatching.length || !opts.trimCharsBeforeMatching.includes(_currentChar))) {
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
        }

        if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
          theRemainderOfTheString = str.slice(firstCharOutsideIndex);
        }

        return opts.cb(wholeCharacterOutside, theRemainderOfTheString, firstCharOutsideIndex);
      }

      var extraNote = "";

      if (!originalOpts) {
        extraNote = " More so, the whole options object, the fourth input argument, is missing!";
      }

      throw new Error("string-match-left-right/".concat(mode, "(): [THROW_ID_08] the third argument, \"whatToMatch\", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key \"cb\" is not set!").concat(extraNote));
    }

    for (var i = 0, len = whatToMatch.length; i < len; i++) {
      special = typeof whatToMatch[i] === "function";
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
      });

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

  function matchRightIncl(str, position, whatToMatch, opts) {
    return main("matchRightIncl", str, position, whatToMatch, opts);
  }

  /**
   * string-collapse-leading-whitespace
   * Collapse the leading and trailing whitespace of a string
   * Version: 2.0.21
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-leading-whitespace
   */
  var rawNbsp = "\xA0";

  function push(arr) {
    var leftSide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var charToPush = arguments.length > 2 ? arguments[2] : undefined;

    if (!charToPush.trim() && (!arr.length || charToPush === "\n" || charToPush === rawNbsp || (leftSide ? arr[arr.length - 1] : arr[0]) !== " ") && (!arr.length || (leftSide ? arr[arr.length - 1] : arr[0]) !== "\n" || charToPush === "\n" || charToPush === rawNbsp)) {
      if (leftSide) {
        if ((charToPush === "\n" || charToPush === rawNbsp) && arr.length && arr[arr.length - 1] === " ") {
          while (arr.length && arr[arr.length - 1] === " ") {
            arr.pop();
          }
        }

        arr.push(charToPush === rawNbsp || charToPush === "\n" ? charToPush : " ");
      } else {
        if ((charToPush === "\n" || charToPush === rawNbsp) && arr.length && arr[0] === " ") {
          while (arr.length && arr[0] === " ") {
            arr.shift();
          }
        }

        arr.unshift(charToPush === rawNbsp || charToPush === "\n" ? charToPush : " ");
      }
    }
  }

  function collapseLeadingWhitespace(str, originalLimitLinebreaksCount) {
    if (typeof str === "string" && str.length) {
      var windowsEol = false;

      if (str.includes("\r\n")) {
        windowsEol = true;
      }

      var limitLinebreaksCount;

      if (!originalLimitLinebreaksCount || typeof originalLimitLinebreaksCount !== "number") {
        limitLinebreaksCount = 1;
      } else {
        limitLinebreaksCount = originalLimitLinebreaksCount;
      }

      var limit;

      if (str.trim() === "") {
        var resArr = [];
        limit = limitLinebreaksCount;
        Array.from(str).forEach(function (char) {
          if (char !== "\n" || limit) {
            if (char === "\n") {
              limit -= 1;
            }

            push(resArr, true, char);
          }
        });

        while (resArr.length > 1 && resArr[resArr.length - 1] === " ") {
          resArr.pop();
        }

        return resArr.join("");
      }

      var startCharacter = [];
      limit = limitLinebreaksCount;

      if (str[0].trim() === "") {
        for (var i = 0, len = str.length; i < len; i++) {
          if (str[i].trim()) {
            break;
          } else if (str[i] !== "\n" || limit) {
            if (str[i] === "\n") {
              limit -= 1;
            }

            push(startCharacter, true, str[i]);
          }
        }
      }

      var endCharacter = [];
      limit = limitLinebreaksCount;

      if (str.slice(-1).trim() === "") {
        for (var _i = str.length; _i--;) {
          if (str[_i].trim()) {
            break;
          } else if (str[_i] !== "\n" || limit) {
            if (str[_i] === "\n") {
              limit -= 1;
            }

            push(endCharacter, false, str[_i]);
          }
        }
      }

      if (!windowsEol) {
        return startCharacter.join("") + str.trim() + endCharacter.join("");
      }

      return "".concat(startCharacter.join("")).concat(str.trim()).concat(endCharacter.join("")).replace(/\n/g, "\r\n");
    }

    return str;
  }

  /**
   * ranges-sort
   * Sort natural number index ranges [ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]
   * Version: 3.12.1
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort
   */
  function rangesSort(arrOfRanges, originalOptions) {
    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
      return arrOfRanges;
    }

    var defaults = {
      strictlyTwoElementsInRangeArrays: false,
      progressFn: null
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOptions);

    var culpritsIndex;
    var culpritsLen;

    if (opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.every(function (rangeArr, indx) {
      if (rangeArr.length !== 2) {
        culpritsIndex = indx;
        culpritsLen = rangeArr.length;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") has not two but ").concat(culpritsLen, " elements!"));
    }

    if (!arrOfRanges.every(function (rangeArr, indx) {
      if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 4), ") does not consist of only natural numbers!"));
    }

    var maxPossibleIterations = arrOfRanges.length * arrOfRanges.length;
    var counter = 0;
    return Array.from(arrOfRanges).sort(function (range1, range2) {
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

  function mergeRanges(arrOfRanges, originalOpts) {
    function isStr(something) {
      return typeof something === "string";
    }

    function isObj(something) {
      return something && _typeof(something) === "object" && !Array.isArray(something);
    }

    if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
      return arrOfRanges;
    }

    var defaults = {
      mergeType: 1,
      progressFn: null,
      joinRangesThatTouchEdges: true
    };
    var opts;

    if (originalOpts) {
      if (isObj(originalOpts)) {
        opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

        if (opts.progressFn && isObj(opts.progressFn) && !Object.keys(opts.progressFn).length) {
          opts.progressFn = null;
        } else if (opts.progressFn && typeof opts.progressFn !== "function") {
          throw new Error("ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: \"".concat(_typeof(opts.progressFn), "\", equal to ").concat(JSON.stringify(opts.progressFn, null, 4)));
        }

        if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
          if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
            opts.mergeType = 1;
          } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
            opts.mergeType = 2;
          } else {
            throw new Error("ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.mergeType), "\", equal to ").concat(JSON.stringify(opts.mergeType, null, 4)));
          }
        }

        if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
          throw new Error("ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.joinRangesThatTouchEdges), "\", equal to ").concat(JSON.stringify(opts.joinRangesThatTouchEdges, null, 4)));
        }
      } else {
        throw new Error("emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (type ").concat(_typeof(originalOpts), ")"));
      }
    } else {
      opts = _objectSpread2({}, defaults);
    }

    var filtered = arrOfRanges.map(function (subarr) {
      return _toConsumableArray(subarr);
    }).filter(function (rangeArr) {
      return rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1];
    });
    var sortedRanges;
    var lastPercentageDone;
    var percentageDone;

    if (opts.progressFn) {
      sortedRanges = rangesSort(filtered, {
        progressFn: function progressFn(percentage) {
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

    var len = sortedRanges.length - 1;

    for (var i = len; i > 0; i--) {
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

  function existy(x) {
    return x != null;
  }

  function isNum$1(something) {
    return Number.isInteger(something) && something >= 0;
  }

  function isStr$3(something) {
    return typeof something === "string";
  }

  function prepNumStr(str) {
    return /^\d*$/.test(str) ? parseInt(str, 10) : str;
  }

  var Ranges = /*#__PURE__*/function () {
    function Ranges(originalOpts) {
      _classCallCheck(this, Ranges);

      var defaults = {
        limitToBeAddedWhitespace: false,
        limitLinebreaksCount: 1,
        mergeType: 1
      };

      var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

      if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
        if (isStr$3(opts.mergeType) && opts.mergeType.trim() === "1") {
          opts.mergeType = 1;
        } else if (isStr$3(opts.mergeType) && opts.mergeType.trim() === "2") {
          opts.mergeType = 2;
        } else {
          throw new Error("ranges-push: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.mergeType), "\", equal to ").concat(JSON.stringify(opts.mergeType, null, 4)));
        }
      }

      this.opts = opts;
    }

    _createClass(Ranges, [{
      key: "add",
      value: function add(originalFrom, originalTo, addVal) {
        var _this = this;

        for (var _len = arguments.length, etc = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
          etc[_key - 3] = arguments[_key];
        }

        if (etc.length > 0) {
          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_03] Please don't overload the add() method. From the 4th input argument onwards we see these redundant arguments: ".concat(JSON.stringify(etc, null, 4)));
        }

        if (!existy(originalFrom) && !existy(originalTo)) {
          return;
        }

        if (existy(originalFrom) && !existy(originalTo)) {
          if (Array.isArray(originalFrom)) {
            if (originalFrom.length) {
              if (originalFrom.some(function (el) {
                return Array.isArray(el);
              })) {
                originalFrom.forEach(function (thing) {
                  if (Array.isArray(thing)) {
                    _this.add.apply(_this, _toConsumableArray(thing));
                  }
                });
                return;
              }

              if (originalFrom.length > 1 && isNum$1(prepNumStr(originalFrom[0])) && isNum$1(prepNumStr(originalFrom[1]))) {
                this.add.apply(this, _toConsumableArray(originalFrom));
              }
            }

            return;
          }

          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_12] the first input argument, \"from\" is set (".concat(JSON.stringify(originalFrom, null, 0), ") but second-one, \"to\" is not (").concat(JSON.stringify(originalTo, null, 0), ")"));
        } else if (!existy(originalFrom) && existy(originalTo)) {
          throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_13] the second input argument, \"to\" is set (".concat(JSON.stringify(originalTo, null, 0), ") but first-one, \"from\" is not (").concat(JSON.stringify(originalFrom, null, 0), ")"));
        }

        var from = /^\d*$/.test(originalFrom) ? parseInt(originalFrom, 10) : originalFrom;
        var to = /^\d*$/.test(originalTo) ? parseInt(originalTo, 10) : originalTo;

        if (isNum$1(addVal)) {
          addVal = String(addVal);
        }

        if (isNum$1(from) && isNum$1(to)) {
          if (existy(addVal) && !isStr$3(addVal) && !isNum$1(addVal)) {
            throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_08] The third argument, the value to add, was given not as string but ".concat(_typeof(addVal), ", equal to:\n").concat(JSON.stringify(addVal, null, 4)));
          }

          if (existy(this.ranges) && Array.isArray(this.last()) && from === this.last()[1]) {
            this.last()[1] = to;
            if (this.last()[2] === null || addVal === null) ;

            if (this.last()[2] !== null && existy(addVal)) {
              var calculatedVal = existy(this.last()[2]) && this.last()[2].length > 0 && (!this.opts || !this.opts.mergeType || this.opts.mergeType === 1) ? this.last()[2] + addVal : addVal;

              if (this.opts.limitToBeAddedWhitespace) {
                calculatedVal = collapseLeadingWhitespace(calculatedVal, this.opts.limitLinebreaksCount);
              }

              if (!(isStr$3(calculatedVal) && !calculatedVal.length)) {
                this.last()[2] = calculatedVal;
              }
            }
          } else {
            if (!this.ranges) {
              this.ranges = [];
            }

            var whatToPush = addVal !== undefined && !(isStr$3(addVal) && !addVal.length) ? [from, to, this.opts.limitToBeAddedWhitespace ? collapseLeadingWhitespace(addVal, this.opts.limitLinebreaksCount) : addVal] : [from, to];
            this.ranges.push(whatToPush);
          }
        } else {
          if (!(isNum$1(from) && from >= 0)) {
            throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_09] \"from\" value, the first input argument, must be a natural number or zero! Currently it's of a type \"".concat(_typeof(from), "\" equal to: ").concat(JSON.stringify(from, null, 4)));
          } else {
            throw new TypeError("ranges-push/Ranges/add(): [THROW_ID_10] \"to\" value, the second input argument, must be a natural number or zero! Currently it's of a type \"".concat(_typeof(to), "\" equal to: ").concat(JSON.stringify(to, null, 4)));
          }
        }
      }
    }, {
      key: "push",
      value: function push(originalFrom, originalTo, addVal) {
        for (var _len2 = arguments.length, etc = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
          etc[_key2 - 3] = arguments[_key2];
        }

        this.add.apply(this, [originalFrom, originalTo, addVal].concat(etc));
      }
    }, {
      key: "current",
      value: function current() {
        var _this2 = this;

        if (this.ranges != null) {
          this.ranges = mergeRanges(this.ranges, {
            mergeType: this.opts.mergeType
          });

          if (this.opts.limitToBeAddedWhitespace) {
            return this.ranges.map(function (val) {
              if (existy(val[2])) {
                return [val[0], val[1], collapseLeadingWhitespace(val[2], _this2.opts.limitLinebreaksCount)];
              }

              return val;
            });
          }

          return this.ranges;
        }

        return null;
      }
    }, {
      key: "wipe",
      value: function wipe() {
        this.ranges = undefined;
      }
    }, {
      key: "replace",
      value: function replace(givenRanges) {
        if (Array.isArray(givenRanges) && givenRanges.length) {
          if (!(Array.isArray(givenRanges[0]) && isNum$1(givenRanges[0][0]))) {
            throw new Error("ranges-push/Ranges/replace(): [THROW_ID_11] Single range was given but we expected array of arrays! The first element, ".concat(JSON.stringify(givenRanges[0], null, 4), " should be an array and its first element should be an integer, a string index."));
          } else {
            this.ranges = Array.from(givenRanges);
          }
        } else {
          this.ranges = undefined;
        }
      }
    }, {
      key: "last",
      value: function last() {
        if (this.ranges !== undefined && Array.isArray(this.ranges)) {
          return this.ranges[this.ranges.length - 1];
        }

        return null;
      }
    }]);

    return Ranges;
  }();

  function existy$1(x) {
    return x != null;
  }

  function isStr$4(something) {
    return typeof something === "string";
  }

  function rangesApply(str, originalRangesArr, _progressFn) {
    var percentageDone = 0;
    var lastPercentageDone = 0;

    if (arguments.length === 0) {
      throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
    }

    if (!isStr$4(str)) {
      throw new TypeError("ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
    }

    if (originalRangesArr === null) {
      return str;
    }

    if (!Array.isArray(originalRangesArr)) {
      throw new TypeError("ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ".concat(_typeof(originalRangesArr), ", equal to: ").concat(JSON.stringify(originalRangesArr, null, 4)));
    }

    if (_progressFn && typeof _progressFn !== "function") {
      throw new TypeError("ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ".concat(_typeof(_progressFn), ", equal to: ").concat(JSON.stringify(_progressFn, null, 4)));
    }

    var rangesArr;

    if (Array.isArray(originalRangesArr) && (Number.isInteger(originalRangesArr[0]) && originalRangesArr[0] >= 0 || /^\d*$/.test(originalRangesArr[0])) && (Number.isInteger(originalRangesArr[1]) && originalRangesArr[1] >= 0 || /^\d*$/.test(originalRangesArr[1]))) {
      rangesArr = [Array.from(originalRangesArr)];
    } else {
      rangesArr = Array.from(originalRangesArr);
    }

    var len = rangesArr.length;
    var counter = 0;
    rangesArr.forEach(function (el, i) {
      if (_progressFn) {
        percentageDone = Math.floor(counter / len * 10);
        /* istanbul ignore else */

        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;

          _progressFn(percentageDone);
        }
      }

      if (!Array.isArray(el)) {
        throw new TypeError("ranges-apply: [THROW_ID_05] ranges array, second input arg., has ".concat(i, "th element not an array: ").concat(JSON.stringify(el, null, 4), ", which is ").concat(_typeof(el)));
      }

      if (!Number.isInteger(el[0]) || el[0] < 0) {
        if (/^\d*$/.test(el[0])) {
          rangesArr[i][0] = Number.parseInt(rangesArr[i][0], 10);
        } else {
          throw new TypeError("ranges-apply: [THROW_ID_06] ranges array, second input arg. has ".concat(i, "th element, array [").concat(el[0], ",").concat(el[1], "]. That array has first element not an integer, but ").concat(_typeof(el[0]), ", equal to: ").concat(JSON.stringify(el[0], null, 4), ". Computer doesn't like this."));
        }
      }

      if (!Number.isInteger(el[1])) {
        if (/^\d*$/.test(el[1])) {
          rangesArr[i][1] = Number.parseInt(rangesArr[i][1], 10);
        } else {
          throw new TypeError("ranges-apply: [THROW_ID_07] ranges array, second input arg. has ".concat(i, "th element, array [").concat(el[0], ",").concat(el[1], "]. That array has second element not an integer, but ").concat(_typeof(el[1]), ", equal to: ").concat(JSON.stringify(el[1], null, 4), ". Computer doesn't like this."));
        }
      }

      counter += 1;
    });
    var workingRanges = mergeRanges(rangesArr, {
      progressFn: function progressFn(perc) {
        if (_progressFn) {
          percentageDone = 10 + Math.floor(perc / 10);
          /* istanbul ignore else */

          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;

            _progressFn(percentageDone);
          }
        }
      }
    });
    var len2 = workingRanges.length;

    if (len2 > 0) {
      var tails = str.slice(workingRanges[len2 - 1][1]);
      str = workingRanges.reduce(function (acc, val, i, arr) {
        if (_progressFn) {
          percentageDone = 20 + Math.floor(i / len2 * 80);
          /* istanbul ignore else */

          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;

            _progressFn(percentageDone);
          }
        }

        var beginning = i === 0 ? 0 : arr[i - 1][1];
        var ending = arr[i][0];
        return acc + str.slice(beginning, ending) + (existy$1(arr[i][2]) ? arr[i][2] : "");
      }, "");
      str += tails;
    }

    return str;
  }

  var rawnbsp = "\xA0";
  var encodedNbspHtml = "&nbsp;";
  var encodedNbspCss = "\\00A0";
  var encodedNbspJs = "\\u00A0";
  var rawNdash = "\u2013";
  var encodedNdashHtml = "&ndash;";
  var encodedNdashCss = "\\2013";
  var encodedNdashJs = "\\u2013";
  var rawMdash = "\u2014";
  var encodedMdashHtml = "&mdash;";
  var encodedMdashCss = "\\2014";
  var encodedMdashJs = "\\u2014";
  var headsAndTailsJinja = [{
    heads: "{{",
    tails: "}}"
  }, {
    heads: ["{% if", "{%- if"],
    tails: ["{% endif", "{%- endif"]
  }, {
    heads: ["{% for", "{%- for"],
    tails: ["{% endfor", "{%- endfor"]
  }, {
    heads: ["{%", "{%-"],
    tails: ["%}", "-%}"]
  }, {
    heads: "{#",
    tails: "#}"
  }];
  var headsAndTailsHugo = [{
    heads: "{{",
    tails: "}}"
  }];
  var headsAndTailsHexo = [{
    heads: ["<%", "<%=", "<%-"],
    tails: ["%>", "=%>", "-%>"]
  }];
  var knownHTMLTags = ["abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"];
  var defaultOpts = {
    removeWidowPreventionMeasures: false,
    convertEntities: true,
    targetLanguage: "html",
    UKPostcodes: false,
    hyphens: true,
    minWordCount: 4,
    minCharCount: 5,
    ignore: [],
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100,
    tagRanges: []
  };

  function removeWidows(str, originalOpts) {
    function isStr(something) {
      return typeof something === "string";
    }

    var start = Date.now();

    if (!isStr(str)) {
      if (str === undefined) {
        throw new Error("string-remove-widows: [THROW_ID_01] the first input argument is completely missing! It should be given as string.");
      } else {
        throw new Error("string-remove-widows: [THROW_ID_02] the first input argument must be string! It was given as \"".concat(_typeof(str), "\", equal to:\n").concat(JSON.stringify(str, null, 4)));
      }
    }

    if (originalOpts && !lodash_isplainobject(originalOpts)) {
      throw new Error("string-remove-widows: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ".concat(_typeof(originalOpts), ", equal to ").concat(JSON.stringify(originalOpts, null, 4)));
    }

    var isArr = Array.isArray;
    var len = str.length;
    var rangesArr = new Ranges({
      mergeType: 2
    });
    var punctuationCharsToConsiderWidowIssue = ["."];
    var postcodeRegexFront = /[A-Z]{1,2}[0-9][0-9A-Z]?$/;
    var postcodeRegexEnd = /^[0-9][A-Z]{2}/;
    var leavePercForLastStage = 0.06;
    var currentPercentageDone;
    var lastPercentage = 0;
    var wordCount;
    var charCount;
    var secondToLastWhitespaceStartedAt;
    var secondToLastWhitespaceEndedAt;
    var lastWhitespaceStartedAt;
    var lastWhitespaceEndedAt;
    var lastEncodedNbspStartedAt;
    var lastEncodedNbspEndedAt;
    var doNothingUntil;
    var bumpWordCountAt;

    var opts = _objectSpread2(_objectSpread2({}, defaultOpts), originalOpts);

    var whatWasDone = {
      removeWidows: false,
      convertEntities: false
    };

    if (opts.dashes) {
      opts.hyphens = true;
      delete opts.dashes;
    }

    if (!opts.ignore || !isArr(opts.ignore) && !isStr(opts.ignore)) {
      opts.ignore = [];
    } else {
      opts.ignore = arrayiffyString(opts.ignore);

      if (opts.ignore.includes("all")) {
        opts.ignore = opts.ignore.concat(headsAndTailsJinja.concat(headsAndTailsHexo));
      } else if (opts.ignore.some(function (val) {
        return isStr(val);
      })) {
        var temp = [];
        opts.ignore = opts.ignore.filter(function (val) {
          if (isStr(val) && val.length) {
            if (["nunjucks", "jinja", "liquid"].includes(val.trim().toLowerCase())) {
              temp = temp.concat(headsAndTailsJinja);
            } else if (["hugo"].includes(val.trim().toLowerCase())) {
              temp = temp.concat(headsAndTailsHugo);
            } else if (["hexo"].includes(val.trim().toLowerCase())) {
              temp = temp.concat(headsAndTailsHexo);
            }

            return false;
          }

          if (_typeof(val) === "object") {
            return true;
          }
        });

        if (temp.length) {
          opts.ignore = opts.ignore.concat(temp);
        }
      }
    }

    var ceil;

    if (opts.reportProgressFunc) {
      ceil = Math.floor(opts.reportProgressFuncTo - (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage - opts.reportProgressFuncFrom);
    }

    function push(finalStart, finalEnd) {
      var finalWhatToInsert = rawnbsp;

      if (opts.removeWidowPreventionMeasures) {
        finalWhatToInsert = " ";
      } else if (opts.convertEntities) {
        finalWhatToInsert = encodedNbspHtml;

        if (isStr(opts.targetLanguage)) {
          if (opts.targetLanguage.trim().toLowerCase() === "css") {
            finalWhatToInsert = encodedNbspCss;
          } else if (opts.targetLanguage.trim().toLowerCase() === "js") {
            finalWhatToInsert = encodedNbspJs;
          }
        }
      }

      if (str.slice(finalStart, finalEnd) !== finalWhatToInsert) {
        rangesArr.push(finalStart, finalEnd, finalWhatToInsert);
      }
    }

    function resetAll() {
      wordCount = 0;
      charCount = 0;
      secondToLastWhitespaceStartedAt = undefined;
      secondToLastWhitespaceEndedAt = undefined;
      lastWhitespaceStartedAt = undefined;
      lastWhitespaceEndedAt = undefined;
      lastEncodedNbspStartedAt = undefined;
      lastEncodedNbspEndedAt = undefined;
    }

    resetAll();

    var _loop = function _loop(_i) {
      if (!doNothingUntil && isArr(opts.ignore) && opts.ignore.length) {
        opts.ignore.some(function (valObj, y) {
          if (isArr(valObj.heads) && valObj.heads.some(function (oneOfHeads) {
            return str.startsWith(oneOfHeads, _i);
          }) || isStr(valObj.heads) && str.startsWith(valObj.heads, _i)) {
            wordCount += 1;
            doNothingUntil = opts.ignore[y].tails;
            i = _i;
            return true;
          }
        });
      }

      if (!doNothingUntil && bumpWordCountAt && bumpWordCountAt === _i) {
        wordCount += 1;
        bumpWordCountAt = undefined;
      }

      if (typeof opts.reportProgressFunc === "function") {
        currentPercentageDone = opts.reportProgressFuncFrom + Math.floor(_i / len * ceil);

        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
      }

      if (!doNothingUntil && _i && str[_i] && str[_i].trim() && (!str[_i - 1] || str[_i - 1] && !str[_i - 1].trim())) {
        lastWhitespaceEndedAt = _i;
      }

      if (!doNothingUntil && str[_i] && str[_i].trim()) {
        charCount += 1;
      }

      if (!doNothingUntil && opts.hyphens && ("-".concat(rawMdash).concat(rawNdash).includes(str[_i]) || str.startsWith(encodedNdashHtml, _i) || str.startsWith(encodedNdashCss, _i) || str.startsWith(encodedNdashJs, _i) || str.startsWith(encodedMdashHtml, _i) || str.startsWith(encodedMdashCss, _i) || str.startsWith(encodedMdashJs, _i)) && str[_i + 1] && (!str[_i + 1].trim() || str[_i] === "&")) {
        if (str[_i - 1] && !str[_i - 1].trim() && str[left(str, _i)]) {
          push(left(str, _i) + 1, _i);
          whatWasDone.removeWidows = true;
        }
      }

      if (!doNothingUntil && (str.startsWith("&nbsp;", _i) || str.startsWith("&#160;", _i))) {
        lastEncodedNbspStartedAt = _i;
        lastEncodedNbspEndedAt = _i + 6;

        if (str[_i + 6] && str[_i + 6].trim()) {
          bumpWordCountAt = _i + 6;
        }

        if (!opts.convertEntities) {
          rangesArr.push(_i, _i + 6, rawnbsp);
          whatWasDone.convertEntities = true;
        } else if (opts.targetLanguage === "css" || opts.targetLanguage === "js") {
          rangesArr.push(_i, _i + 6, opts.targetLanguage === "css" ? encodedNbspCss : encodedNbspJs);
          whatWasDone.convertEntities = true;
        }
      }

      if (!doNothingUntil && str[_i + 4] && str[_i] === "\\" && str[_i + 1] === "0" && str[_i + 2] === "0" && str[_i + 3].toUpperCase() === "A" && str[_i + 4] === "0") {
        lastEncodedNbspStartedAt = _i;
        lastEncodedNbspEndedAt = _i + 5;

        if (str[_i + 5] && str[_i + 5].trim()) {
          bumpWordCountAt = _i + 5;
        }

        if (!opts.convertEntities) {
          rangesArr.push(_i, _i + 5, rawnbsp);
          whatWasDone.convertEntities = true;
        } else if (opts.targetLanguage === "html" || opts.targetLanguage === "js") {
          rangesArr.push(_i, _i + 5, opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspJs);
          whatWasDone.convertEntities = true;
        }
      }

      if (!doNothingUntil && str[_i] === "\\" && str[_i + 1] && str[_i + 1].toLowerCase() === "u" && str[_i + 2] === "0" && str[_i + 3] === "0" && str[_i + 4] && str[_i + 4].toUpperCase() === "A" && str[_i + 5] === "0") {
        lastEncodedNbspStartedAt = _i;
        lastEncodedNbspEndedAt = _i + 6;

        if (str[_i + 6] && str[_i + 6].trim()) {
          bumpWordCountAt = _i + 6;
        }

        if (!opts.convertEntities) {
          rangesArr.push(_i, _i + 6, rawnbsp);
        } else if (opts.targetLanguage === "html" || opts.targetLanguage === "css") {
          rangesArr.push(_i, _i + 6, opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspCss);
        }
      }

      if (!doNothingUntil && str[_i] === rawnbsp) {
        lastEncodedNbspStartedAt = _i;
        lastEncodedNbspEndedAt = _i + 1;

        if (str[_i + 2] && str[_i + 2].trim()) {
          bumpWordCountAt = _i + 2;
        }

        if (opts.convertEntities) {
          rangesArr.push(_i, _i + 1, opts.targetLanguage === "css" ? encodedNbspCss : opts.targetLanguage === "js" ? encodedNbspJs : encodedNbspHtml);
        }
      }

      if (!doNothingUntil && str[_i] && str[_i].trim() && (!str[_i - 1] || !str[_i - 1].trim())) {
        wordCount += 1;
      }

      if (!doNothingUntil && (!str[_i] || "\r\n".includes(str[_i]) || (str[_i] === "\n" || str[_i] === "\r" || str[_i] === "\r" && str[_i + 1] === "\n") && str[_i - 1] && punctuationCharsToConsiderWidowIssue.includes(str[left(str, _i)]))) {
        if ((!opts.minWordCount || wordCount >= opts.minWordCount) && (!opts.minCharCount || charCount >= opts.minCharCount)) {
          var finalStart;
          var finalEnd;

          if (lastWhitespaceStartedAt !== undefined && lastWhitespaceEndedAt !== undefined && lastEncodedNbspStartedAt !== undefined && lastEncodedNbspEndedAt !== undefined) {
            if (lastWhitespaceStartedAt > lastEncodedNbspStartedAt) {
              finalStart = lastWhitespaceStartedAt;
              finalEnd = lastWhitespaceEndedAt;
            } else {
              finalStart = lastEncodedNbspStartedAt;
              finalEnd = lastEncodedNbspEndedAt;
            }
          } else if (lastWhitespaceStartedAt !== undefined && lastWhitespaceEndedAt !== undefined) {
            finalStart = lastWhitespaceStartedAt;
            finalEnd = lastWhitespaceEndedAt;
          } else if (lastEncodedNbspStartedAt !== undefined && lastEncodedNbspEndedAt !== undefined) {
            finalStart = lastEncodedNbspStartedAt;
            finalEnd = lastEncodedNbspEndedAt;
          }

          if (!(finalStart && finalEnd) && secondToLastWhitespaceStartedAt && secondToLastWhitespaceEndedAt) {
            finalStart = secondToLastWhitespaceStartedAt;
            finalEnd = secondToLastWhitespaceEndedAt;
          }

          if (finalStart && finalEnd) {
            push(finalStart, finalEnd);
            whatWasDone.removeWidows = true;
          }
        }

        resetAll();
      }

      if (opts.UKPostcodes && str[_i] && !str[_i].trim() && str[_i - 1] && str[_i - 1].trim() && postcodeRegexFront.test(str.slice(0, _i)) && str[right(str, _i)] && postcodeRegexEnd.test(str.slice(right(str, _i)))) {
        push(_i, right(str, _i));
        whatWasDone.removeWidows = true;
      }

      if (!doNothingUntil && str[_i] && !str[_i].trim() && str[_i - 1] && str[_i - 1].trim() && (lastWhitespaceStartedAt === undefined || str[lastWhitespaceStartedAt - 1] && str[lastWhitespaceStartedAt - 1].trim()) && !"/>".includes(str[right(str, _i)]) && !str.slice(0, _i).trim().endsWith("br") && !str.slice(0, _i).trim().endsWith("hr") && !(str.slice(0, _i).endsWith("<") && knownHTMLTags.some(function (tag) {
        return str.startsWith(tag, right(str, _i));
      }))) {
        secondToLastWhitespaceStartedAt = lastWhitespaceStartedAt;
        secondToLastWhitespaceEndedAt = lastWhitespaceEndedAt;
        lastWhitespaceStartedAt = _i;
        lastWhitespaceEndedAt = undefined;

        if (lastEncodedNbspStartedAt !== undefined || lastEncodedNbspEndedAt !== undefined) {
          lastEncodedNbspStartedAt = undefined;
          lastEncodedNbspEndedAt = undefined;
        }
      }

      var tempTailFinding = void 0;

      if (doNothingUntil) {
        if (isStr(doNothingUntil) && (!doNothingUntil.length || str.startsWith(doNothingUntil, _i))) {
          doNothingUntil = undefined;
        } else if (isArr(doNothingUntil) && (!doNothingUntil.length || doNothingUntil.some(function (val) {
          if (str.startsWith(val, _i)) {
            tempTailFinding = val;
            i = _i;
            return true;
          }
        }))) {
          doNothingUntil = undefined;
          _i += tempTailFinding.length;

          if (isArr(opts.ignore) && opts.ignore.length && str[_i + 1]) {
            opts.ignore.some(function (oneOfHeadsTailsObjs) {
              i = _i;
              return matchRightIncl(str, _i, oneOfHeadsTailsObjs.tails, {
                trimBeforeMatching: true,
                cb: function cb(char, theRemainderOfTheString, index) {
                  if (index) {
                    _i = index - 1;

                    if (str[_i + 1] && str[_i + 1].trim()) {
                      wordCount += 1;
                    }
                  }

                  i = _i;
                  return true;
                }
              });
            });
          }
        }
      }

      if (str[_i] && "\r\n".includes(str[_i])) {
        wordCount = 0;
        charCount = 0;
      }

      if (isArr(opts.tagRanges) && opts.tagRanges.length && opts.tagRanges.some(function (rangeArr) {
        if (_i >= rangeArr[0] && _i <= rangeArr[1] && rangeArr[1] - 1 > _i) {
          _i = rangeArr[1] - 1;
          i = _i;
          return true;
        }
      })) ;
      i = _i;
    };

    for (var i = 0; i <= len; i++) {
      _loop(i);
    }

    return {
      res: rangesApply(str, rangesArr.current(), opts.reportProgressFunc ? function (incomingPerc) {
        currentPercentageDone = Math.floor((opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * (1 - leavePercForLastStage) + incomingPerc / 100 * (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) * leavePercForLastStage);

        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
      } : null),
      ranges: rangesArr.current(),
      log: {
        timeTakenInMiliseconds: Date.now() - start
      },
      whatWasDone: whatWasDone
    };
  }

  var isArr = Array.isArray;

  function isStr$5(something) {
    return typeof something === "string";
  }

  function existy$2(x) {
    return x != null;
  }

  function rangesCrop(arrOfRanges, strLen) {
    if (!isArr(arrOfRanges)) {
      throw new TypeError("ranges-crop: [THROW_ID_01] The first input's argument must be an array, consisting of range arrays! Currently its type is: ".concat(_typeof(arrOfRanges), ", equal to: ").concat(JSON.stringify(arrOfRanges, null, 4)));
    }

    if (!Number.isInteger(strLen)) {
      throw new TypeError("ranges-crop: [THROW_ID_02] The second input's argument must be a natural number or zero (coming from String.length)! Currently its type is: ".concat(_typeof(strLen), ", equal to: ").concat(JSON.stringify(strLen, null, 4)));
    }

    if (arrOfRanges.length === 0) {
      return arrOfRanges;
    }

    var culpritsIndex;

    if (!arrOfRanges.every(function (rangeArr, indx) {
      if (!Number.isInteger(rangeArr[0]) || !Number.isInteger(rangeArr[1])) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
        throw new TypeError("ranges-crop: [THROW_ID_03] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ".concat(JSON.stringify(arrOfRanges, null, 0), "!"));
      }

      throw new TypeError("ranges-crop: [THROW_ID_04] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ".concat(culpritsIndex + 1, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), ") does not consist of only natural numbers!"));
    }

    if (!arrOfRanges.every(function (rangeArr, indx) {
      if (existy$2(rangeArr[2]) && !isStr$5(rangeArr[2])) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-crop: [THROW_ID_05] The third argument, if present at all, should be of a string-type or null. Currently the ".concat(culpritsIndex, "th range ").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), " has a argument in the range of a type ").concat(_typeof(arrOfRanges[culpritsIndex][2])));
    }

    var res = mergeRanges(arrOfRanges).filter(function (singleRangeArr) {
      return singleRangeArr[0] <= strLen && (singleRangeArr[2] !== undefined || singleRangeArr[0] < strLen);
    }).map(function (singleRangeArr) {
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

  var isArr$1 = Array.isArray;

  function rangesInvert(arrOfRanges, strLen, originalOptions) {
    if (!isArr$1(arrOfRanges) && arrOfRanges !== null) {
      throw new TypeError("ranges-invert: [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: ".concat(_typeof(arrOfRanges), ", equal to: ").concat(JSON.stringify(arrOfRanges, null, 4)));
    }

    if (!Number.isInteger(strLen) || strLen < 0) {
      throw new TypeError("ranges-invert: [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: ".concat(_typeof(strLen), ", equal to: ").concat(JSON.stringify(strLen, null, 4)));
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

    var defaults = {
      strictlyTwoElementsInRangeArrays: false,
      skipChecks: false
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOptions);

    var culpritsIndex;
    var culpritsLen;

    if (!opts.skipChecks && opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.every(function (rangeArr, indx) {
      if (rangeArr.length !== 2) {
        culpritsIndex = indx;
        culpritsLen = rangeArr.length;
        return false;
      }

      return true;
    })) {
      throw new TypeError("ranges-invert: [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the ".concat(culpritsIndex, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), ") has not two but ").concat(culpritsLen, " elements!"));
    }

    if (!opts.skipChecks && !arrOfRanges.every(function (rangeArr, indx) {
      if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
        culpritsIndex = indx;
        return false;
      }

      return true;
    })) {
      if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
        throw new TypeError("ranges-invert: [THROW_ID_07] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ".concat(JSON.stringify(arrOfRanges, null, 0), "!"));
      }

      throw new TypeError("ranges-invert: [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ".concat(culpritsIndex + 1, "th range (").concat(JSON.stringify(arrOfRanges[culpritsIndex], null, 0), ") does not consist of only natural numbers!"));
    }

    var prep;

    if (!opts.skipChecks) {
      prep = mergeRanges(arrOfRanges.filter(function (rangeArr) {
        return rangeArr[0] !== rangeArr[1];
      }));
    } else {
      prep = arrOfRanges.filter(function (rangeArr) {
        return rangeArr[0] !== rangeArr[1];
      });
    }

    if (prep.length === 0) {
      if (strLen === 0) {
        return [];
      }

      return [[0, strLen]];
    }

    var res = prep.reduce(function (accum, currArr, i, arr) {
      var res2 = [];

      if (i === 0 && arr[0][0] !== 0) {
        res2.push([0, arr[0][0]]);
      }

      var endingIndex = i < arr.length - 1 ? arr[i + 1][0] : strLen;

      if (currArr[1] !== endingIndex) {
        if (opts.skipChecks && currArr[1] > endingIndex) {
          throw new TypeError("ranges-invert: [THROW_ID_08] The checking (opts.skipChecks) is off and input ranges were not sorted! We nearly wrote range [".concat(currArr[1], ", ").concat(endingIndex, "] which is backwards. For investigation, whole ranges array is:\n").concat(JSON.stringify(arr, null, 0)));
        }

        res2.push([currArr[1], endingIndex]);
      }

      return accum.concat(res2);
    }, []);
    return rangesCrop(res, strLen);
  }

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

  var isArr$2 = Array.isArray;

  function processOutside(originalStr, originalRanges, cb) {
    var skipChecks = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    function isFunction(functionToCheck) {
      return functionToCheck && {}.toString.call(functionToCheck) === "[object Function]";
    }

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
    }

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
      var temp = rangesCrop(rangesInvert(skipChecks ? originalRanges : originalRanges, originalStr.length, {
        skipChecks: !!skipChecks
      }), originalStr.length);
      iterator(originalStr, temp);
    } else {
      iterator(originalStr, [[0, originalStr.length]]);
    }
  }

  function collapse(str, originalOpts) {
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

    var finalIndexesToDelete = [];
    var defaults = {
      trimStart: true,
      trimEnd: true,
      trimLines: false,
      trimnbsp: false,
      recogniseHTML: true,
      removeEmptyLines: false,
      returnRangesOnly: false,
      limitConsecutiveEmptyLinesTo: 0
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

    var preliminaryIndexesToDelete;

    if (opts.recogniseHTML) {
      preliminaryIndexesToDelete = [];
    }

    var spacesEndAt = null;
    var whiteSpaceEndsAt = null;
    var lineWhiteSpaceEndsAt = null;
    var endingOfTheLine = false;
    var stateWithinTag = false;
    var whiteSpaceWithinTagEndsAt = null;
    var tagMatched = false;
    var tagCanEndHere = false;
    var count = {};
    var bail = false;

    var resetCounts = function resetCounts(obj) {
      obj.equalDoubleQuoteCombo = 0;
      obj.equalOnly = 0;
      obj.doubleQuoteOnly = 0;
      obj.spacesBetweenLetterChunks = 0;
      obj.linebreaks = 0;
    };

    var bracketJustFound = false;

    if (opts.recogniseHTML) {
      resetCounts(count);
    }

    var lastLineBreaksLastCharIndex;
    var consecutiveLineBreakCount = 0;

    for (var i = str.length; i--;) {
      if (str[i] === "\n" || str[i] === "\r" && str[i + 1] !== "\n") {
        consecutiveLineBreakCount += 1;
      } else if (str[i].trim()) {
        consecutiveLineBreakCount = 0;
      }

      if (str[i] === " ") {
        if (spacesEndAt === null) {
          spacesEndAt = i;
        }
      } else if (spacesEndAt !== null) {
        if (i + 1 !== spacesEndAt) {
          finalIndexesToDelete.push([i + 1, spacesEndAt]);
        }

        spacesEndAt = null;
      }

      if (str[i].trim() === "" && (!opts.trimnbsp && str[i] !== "\xa0" || opts.trimnbsp)) {
        if (whiteSpaceEndsAt === null) {
          whiteSpaceEndsAt = i;
        }

        if (str[i] !== "\n" && str[i] !== "\r" && lineWhiteSpaceEndsAt === null) {
          lineWhiteSpaceEndsAt = i + 1;
        }

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
        }

        if (str[i] === "\n" || str[i] === "\r" && str[i + 1] !== "\n") {
          var sliceFrom = i + 1;
          var sliceTo = void 0;

          if (Number.isInteger(lastLineBreaksLastCharIndex)) {
            sliceTo = lastLineBreaksLastCharIndex + 1;

            if (opts.removeEmptyLines && lastLineBreaksLastCharIndex !== undefined && str.slice(sliceFrom, sliceTo).trim() === "") {
              if (consecutiveLineBreakCount > opts.limitConsecutiveEmptyLinesTo + 1) {
                finalIndexesToDelete.push([i + 1, lastLineBreaksLastCharIndex + 1]);
              }
            }
          }

          lastLineBreaksLastCharIndex = i;
        }
      } else {
        if (whiteSpaceEndsAt !== null) {
          if (i + 1 !== whiteSpaceEndsAt + 1 && whiteSpaceEndsAt === str.length - 1 && opts.trimEnd) {
            finalIndexesToDelete.push([i + 1, whiteSpaceEndsAt + 1]);
          }

          whiteSpaceEndsAt = null;
        }

        if (lineWhiteSpaceEndsAt !== null) {
          if (endingOfTheLine && opts.trimLines) {
            endingOfTheLine = false;

            if (lineWhiteSpaceEndsAt !== i + 1) {
              finalIndexesToDelete.push([i + 1, lineWhiteSpaceEndsAt]);
            }
          }

          lineWhiteSpaceEndsAt = null;
        }
      }

      if (i === 0) {
        if (whiteSpaceEndsAt !== null && opts.trimStart) {
          finalIndexesToDelete.push([0, whiteSpaceEndsAt + 1]);
        } else if (spacesEndAt !== null) {
          finalIndexesToDelete.push([i + 1, spacesEndAt + 1]);
        }
      }

      if (opts.recogniseHTML) {
        if (str[i].trim() === "") {
          if (stateWithinTag && !tagCanEndHere) {
            tagCanEndHere = true;
          }

          if (tagMatched && !whiteSpaceWithinTagEndsAt) {
            whiteSpaceWithinTagEndsAt = i + 1;
          }

          if (tagMatched && str[i - 1] !== undefined && str[i - 1].trim() !== "" && str[i - 1] !== "<" && str[i - 1] !== "/") {
            tagMatched = false;
            stateWithinTag = false;
            preliminaryIndexesToDelete = [];
          }

          if (!bail && !bracketJustFound && str[i].trim() === "" && str[i - 1] !== "<" && (str[i + 1] === undefined || str[i + 1].trim() !== "" && str[i + 1].trim() !== "/")) {
            if (str[i - 1] === undefined || str[i - 1].trim() !== "" && str[i - 1] !== "<" && str[i - 1] !== "/") {
              count.spacesBetweenLetterChunks += 1;
            } else {
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
          if (str[i] === "=") {
            count.equalOnly += 1;

            if (str[i + 1] === '"') {
              count.equalDoubleQuoteCombo += 1;
            }
          } else if (str[i] === '"') {
            count.doubleQuoteOnly += 1;
          }

          if (bracketJustFound) {
            bracketJustFound = false;
          }

          if (whiteSpaceWithinTagEndsAt !== null) {
            preliminaryIndexesToDelete.push([i + 1, whiteSpaceWithinTagEndsAt]);
            whiteSpaceWithinTagEndsAt = null;
          }

          if (str[i] === ">") {
            resetCounts(count);
            bracketJustFound = true;

            if (stateWithinTag) {
              preliminaryIndexesToDelete = [];
            } else {
              stateWithinTag = true;

              if (str[i - 1] !== undefined && str[i - 1].trim() === "" && !whiteSpaceWithinTagEndsAt) {
                whiteSpaceWithinTagEndsAt = i;
              }
            }

            if (!tagCanEndHere) {
              tagCanEndHere = true;
            }
          } else if (str[i] === "<") {
            stateWithinTag = false;

            if (bail) {
              bail = false;
            }

            if (count.spacesBetweenLetterChunks > 0 && count.equalDoubleQuoteCombo === 0) {
              tagMatched = false;
              preliminaryIndexesToDelete = [];
            }

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
            }

            resetCounts(count);
          } else if (stateWithinTag && str[i] === "/") {
            whiteSpaceWithinTagEndsAt = i;
          } else if (stateWithinTag && !tagMatched) {
            if (tagCanEndHere && charCodeBetweenInclusive(str[i], 97, 122)) {
              tagCanEndHere = false;

              if (charCodeBetweenInclusive(str[i], 97, 110)) {
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
              } else if (str[i] === "o" && matchLeftIncl(str, i, ["bdo", "video", "audio"], {
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
            } else if (tagCanEndHere && charCodeBetweenInclusive(str[i], 49, 54)) {
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

  /**
   * string-trim-spaces-only
   * Like String.trim() but you can choose granularly what to trim
   * Version: 2.8.18
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-trim-spaces-only
   */
  function trimSpaces(s, originalOpts) {
    if (typeof s !== "string") {
      throw new Error("string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ".concat(_typeof(s), ", equal to:\n").concat(JSON.stringify(s, null, 4)));
    }

    var defaults = {
      classicTrim: false,
      cr: false,
      lf: false,
      tab: false,
      space: true,
      nbsp: false
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

    function check(char) {
      return opts.classicTrim && !char.trim() || !opts.classicTrim && (opts.space && char === " " || opts.cr && char === "\r" || opts.lf && char === "\n" || opts.tab && char === "\t" || opts.nbsp && char === "\xA0");
    }

    var newStart;
    var newEnd;

    if (s.length) {
      if (check(s[0])) {
        for (var i = 0, len = s.length; i < len; i++) {
          if (!check(s[i])) {
            newStart = i;
            break;
          }

          if (i === s.length - 1) {
            return {
              res: "",
              ranges: [[0, s.length]]
            };
          }
        }
      }

      if (check(s[s.length - 1])) {
        for (var _i = s.length; _i--;) {
          if (!check(s[_i])) {
            newEnd = _i + 1;
            break;
          }
        }
      }

      if (newStart) {
        if (newEnd) {
          return {
            res: s.slice(newStart, newEnd),
            ranges: [[0, newStart], [newEnd, s.length]]
          };
        }

        return {
          res: s.slice(newStart),
          ranges: [[0, newStart]]
        };
      }

      if (newEnd) {
        return {
          res: s.slice(0, newEnd),
          ranges: [[newEnd, s.length]]
        };
      }

      return {
        res: s,
        ranges: []
      };
    }

    return {
      res: "",
      ranges: []
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

  /** Used as references for various `Number` constants. */

  var INFINITY = 1 / 0;
  /** `Object#toString` result references. */

  var symbolTag = '[object Symbol]';
  /** Used to match leading and trailing whitespace. */

  var reTrim = /^\s+|\s+$/g;
  /** Used to compose unicode character classes. */

  var rsAstralRange = "\\ud800-\\udfff",
      rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23",
      rsComboSymbolsRange = "\\u20d0-\\u20f0",
      rsVarRange = "\\ufe0e\\ufe0f";
  /** Used to compose unicode capture groups. */

  var rsAstral = '[' + rsAstralRange + ']',
      rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
      rsFitz = "\\ud83c[\\udffb-\\udfff]",
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}",
      rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]",
      rsZWJ = "\\u200d";
  /** Used to compose unicode regexes. */

  var reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */

  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */

  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');
  /** Detect free variable `global` from Node.js. */

  var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  /** Detect free variable `self`. */

  var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = freeGlobal || freeSelf || Function('return this')();
  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */

  function asciiToArray(string) {
    return string.split('');
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

    while (fromRight ? index-- : ++index < length) {
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
   * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the first unmatched string symbol.
   */


  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1,
        length = strSymbols.length;

    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

    return index;
  }
  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
   * that is not found in the character symbols.
   *
   * @private
   * @param {Array} strSymbols The string symbols to inspect.
   * @param {Array} chrSymbols The character symbols to find.
   * @returns {number} Returns the index of the last unmatched string symbol.
   */


  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;

    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

    return index;
  }
  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */


  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }
  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */


  function stringToArray(string) {
    return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
  }
  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */


  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }
  /** Used for built-in method references. */


  var objectProto$1 = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString$1 = objectProto$1.toString;
  /** Built-in value references. */

  var _Symbol = root.Symbol;
  /** Used to convert symbols to primitives and strings. */

  var symbolProto = _Symbol ? _Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;
  /**
   * The base implementation of `_.slice` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */

  function baseSlice(array, start, end) {
    var index = -1,
        length = array.length;

    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }

    end = end > length ? length : end;

    if (end < 0) {
      end += length;
    }

    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    var result = Array(length);

    while (++index < length) {
      result[index] = array[index + start];
    }

    return result;
  }
  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */


  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }

    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }

    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }
  /**
   * Casts `array` to a slice if it's needed.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {number} start The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the cast slice.
   */


  function castSlice(array, start, end) {
    var length = array.length;
    end = end === undefined ? length : end;
    return !start && end >= length ? array : baseSlice(array, start, end);
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


  function isObjectLike$1(value) {
    return !!value && _typeof(value) == 'object';
  }
  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */


  function isSymbol(value) {
    return _typeof(value) == 'symbol' || isObjectLike$1(value) && objectToString$1.call(value) == symbolTag;
  }
  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */


  function toString(value) {
    return value == null ? '' : baseToString(value);
  }
  /**
   * Removes leading and trailing whitespace or specified characters from `string`.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category String
   * @param {string} [string=''] The string to trim.
   * @param {string} [chars=whitespace] The characters to trim.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
   * @returns {string} Returns the trimmed string.
   * @example
   *
   * _.trim('  abc  ');
   * // => 'abc'
   *
   * _.trim('-_-abc-_-', '_-');
   * // => 'abc'
   *
   * _.map(['  foo  ', '  bar  '], _.trim);
   * // => ['foo', 'bar']
   */


  function trim(string, chars, guard) {
    string = toString(string);

    if (string && (guard || chars === undefined)) {
      return string.replace(reTrim, '');
    }

    if (!string || !(chars = baseToString(chars))) {
      return string;
    }

    var strSymbols = stringToArray(string),
        chrSymbols = stringToArray(chars),
        start = charsStartIndex(strSymbols, chrSymbols),
        end = charsEndIndex(strSymbols, chrSymbols) + 1;
    return castSlice(strSymbols, start, end).join('');
  }

  var lodash_trim = trim;

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

  var freeGlobal$1 = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  /** Detect free variable `self`. */

  var freeSelf$1 = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
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
      case 0:
        return func.call(thisArg);

      case 1:
        return func.call(thisArg, args[0]);

      case 2:
        return func.call(thisArg, args[0], args[1]);

      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
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


  function arrayIncludes(array, value) {
    var length = array ? array.length : 0;
    return !!length && baseIndexOf$1(array, value, 0) > -1;
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
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */


  function baseFindIndex$1(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while (fromRight ? index-- : ++index < length) {
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
    return function (value) {
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


  var arrayProto = Array.prototype,
      funcProto$1 = Function.prototype,
      objectProto$2 = Object.prototype;
  /** Used to detect overreaching core-js shims. */

  var coreJsData = root$1['__core-js_shared__'];
  /** Used to detect methods masquerading as native. */

  var maskSrcKey = function () {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? 'Symbol(src)_1.' + uid : '';
  }();
  /** Used to resolve the decompiled source of functions. */


  var funcToString$1 = funcProto$1.toString;
  /** Used to check objects for own properties. */

  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var objectToString$2 = objectProto$2.toString;
  /** Used to detect if a method is native. */

  var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  /** Built-in value references. */

  var splice = arrayProto.splice;
  /* Built-in method references for those with the same name as other `lodash` methods. */

  var nativeMax = Math.max;
  /* Built-in method references that are verified to be native. */

  var Map = getNative(root$1, 'Map'),
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


  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty$1.call(data, key);
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
    this.__data__ = new MapCache();

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
  } // Add methods to `SetCache`.


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
   * The base implementation of methods like `_.difference` without support
   * for excluding multiple arrays or iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Array} values The values to exclude.
   * @param {Function} [iteratee] The iteratee invoked per element.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new array of filtered values.
   */


  function baseDifference(array, values, iteratee, comparator) {
    var index = -1,
        includes = arrayIncludes,
        isCommon = true,
        length = array.length,
        result = [],
        valuesLength = values.length;

    if (!length) {
      return result;
    }

    if (iteratee) {
      values = arrayMap(values, baseUnary(iteratee));
    }

    if (comparator) {
      includes = arrayIncludesWith;
      isCommon = false;
    } else if (values.length >= LARGE_ARRAY_SIZE) {
      includes = cacheHas;
      isCommon = false;
      values = new SetCache(values);
    }

    outer: while (++index < length) {
      var value = array[index],
          computed = iteratee ? iteratee(value) : value;
      value = comparator || value !== 0 ? value : 0;

      if (isCommon && computed === computed) {
        var valuesIndex = valuesLength;

        while (valuesIndex--) {
          if (values[valuesIndex] === computed) {
            continue outer;
          }
        }

        result.push(value);
      } else if (!includes(values, computed, comparator)) {
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


  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }

    var pattern = isFunction(value) || isHostObject$1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
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
    start = nativeMax(start === undefined ? func.length - 1 : start, 0);
    return function () {
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
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to process.
   * @returns {string} Returns the source code.
   */


  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$1.call(func);
      } catch (e) {}

      try {
        return func + '';
      } catch (e) {}
    }

    return '';
  }
  /**
   * Creates an array excluding all given values using
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * **Note:** Unlike `_.pull`, this method returns a new array.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {...*} [values] The values to exclude.
   * @returns {Array} Returns the new array of filtered values.
   * @see _.difference, _.xor
   * @example
   *
   * _.without([2, 1, 2, 3], 1, 2);
   * // => [3]
   */


  var without = baseRest(function (array, values) {
    return isArrayLikeObject(array) ? baseDifference(array, values) : [];
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

  function eq(value, other) {
    return value === other || value !== value && other !== other;
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
    return isObjectLike$2(value) && isArrayLike(value);
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
    var tag = isObject(value) ? objectToString$2.call(value) : '';
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


  function isObjectLike$2(value) {
    return !!value && _typeof(value) == 'object';
  }

  var lodash_without = without;

  /*! https://mths.be/punycode v1.4.1 by @mathias */

  /** Highest positive signed 32-bit float value */
  var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

  /** Bootstring parameters */

  var base = 36;
  var tMin = 1;
  var tMax = 26;
  var skew = 38;
  var damp = 700;
  var initialBias = 72;
  var initialN = 128; // 0x80

  var delimiter = '-'; // '\x2D'

  /** Regular expressions */

  var regexPunycode = /^xn--/;
  var regexNonASCII = /[^\x20-\x7E]/; // unprintable ASCII chars + non-ASCII chars

  var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

  /** Error messages */

  var errors = {
    'overflow': 'Overflow: input needs wider integers to process',
    'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
    'invalid-input': 'Invalid input'
  };
  /** Convenience shortcuts */

  var baseMinusTMin = base - tMin;
  var floor = Math.floor;
  var stringFromCharCode = String.fromCharCode;
  /*--------------------------------------------------------------------------*/

  /**
   * A generic error utility function.
   * @private
   * @param {String} type The error type.
   * @returns {Error} Throws a `RangeError` with the applicable error message.
   */

  function error(type) {
    throw new RangeError(errors[type]);
  }
  /**
   * A generic `Array#map` utility function.
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function that gets called for every array
   * item.
   * @returns {Array} A new array of values returned by the callback function.
   */


  function map$2(array, fn) {
    var length = array.length;
    var result = [];

    while (length--) {
      result[length] = fn(array[length]);
    }

    return result;
  }
  /**
   * A simple `Array#map`-like wrapper to work with domain name strings or email
   * addresses.
   * @private
   * @param {String} domain The domain name or email address.
   * @param {Function} callback The function that gets called for every
   * character.
   * @returns {Array} A new string of characters returned by the callback
   * function.
   */


  function mapDomain(string, fn) {
    var parts = string.split('@');
    var result = '';

    if (parts.length > 1) {
      // In email addresses, only the domain name should be punycoded. Leave
      // the local part (i.e. everything up to `@`) intact.
      result = parts[0] + '@';
      string = parts[1];
    } // Avoid `split(regex)` for IE8 compatibility. See #17.


    string = string.replace(regexSeparators, '\x2E');
    var labels = string.split('.');
    var encoded = map$2(labels, fn).join('.');
    return result + encoded;
  }
  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   * @see `punycode.ucs2.encode`
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode.ucs2
   * @name decode
   * @param {String} string The Unicode input string (UCS-2).
   * @returns {Array} The new array of code points.
   */


  function ucs2decode(string) {
    var output = [],
        counter = 0,
        length = string.length,
        value,
        extra;

    while (counter < length) {
      value = string.charCodeAt(counter++);

      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // high surrogate, and there is a next character
        extra = string.charCodeAt(counter++);

        if ((extra & 0xFC00) == 0xDC00) {
          // low surrogate
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          // unmatched surrogate; only append this code unit, in case the next
          // code unit is the high surrogate of a surrogate pair
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }

    return output;
  }
  /**
   * Creates a string based on an array of numeric code points.
   * @see `punycode.ucs2.decode`
   * @memberOf punycode.ucs2
   * @name encode
   * @param {Array} codePoints The array of numeric code points.
   * @returns {String} The new Unicode string (UCS-2).
   */


  function ucs2encode(array) {
    return map$2(array, function (value) {
      var output = '';

      if (value > 0xFFFF) {
        value -= 0x10000;
        output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
        value = 0xDC00 | value & 0x3FF;
      }

      output += stringFromCharCode(value);
      return output;
    }).join('');
  }
  /**
   * Converts a basic code point into a digit/integer.
   * @see `digitToBasic()`
   * @private
   * @param {Number} codePoint The basic numeric code point value.
   * @returns {Number} The numeric value of a basic code point (for use in
   * representing integers) in the range `0` to `base - 1`, or `base` if
   * the code point does not represent a value.
   */


  function basicToDigit(codePoint) {
    if (codePoint - 48 < 10) {
      return codePoint - 22;
    }

    if (codePoint - 65 < 26) {
      return codePoint - 65;
    }

    if (codePoint - 97 < 26) {
      return codePoint - 97;
    }

    return base;
  }
  /**
   * Converts a digit/integer into a basic code point.
   * @see `basicToDigit()`
   * @private
   * @param {Number} digit The numeric value of a basic code point.
   * @returns {Number} The basic code point whose value (when used for
   * representing integers) is `digit`, which needs to be in the range
   * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
   * used; else, the lowercase form is used. The behavior is undefined
   * if `flag` is non-zero and `digit` has no uppercase form.
   */


  function digitToBasic(digit, flag) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
  }
  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   * @private
   */


  function adapt(delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? floor(delta / damp) : delta >> 1;
    delta += floor(delta / numPoints);

    for (;
    /* no initialization */
    delta > baseMinusTMin * tMax >> 1; k += base) {
      delta = floor(delta / baseMinusTMin);
    }

    return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
  }
  /**
   * Converts a Punycode string of ASCII-only symbols to a string of Unicode
   * symbols.
   * @memberOf punycode
   * @param {String} input The Punycode string of ASCII-only symbols.
   * @returns {String} The resulting string of Unicode symbols.
   */


  function decode$1(input) {
    // Don't use UCS-2
    var output = [],
        inputLength = input.length,
        out,
        i = 0,
        n = initialN,
        bias = initialBias,
        basic,
        j,
        index,
        oldi,
        w,
        k,
        digit,
        t,

    /** Cached calculation results */
    baseMinusT; // Handle the basic code points: let `basic` be the number of input code
    // points before the last delimiter, or `0` if there is none, then copy
    // the first basic code points to the output.

    basic = input.lastIndexOf(delimiter);

    if (basic < 0) {
      basic = 0;
    }

    for (j = 0; j < basic; ++j) {
      // if it's not a basic code point
      if (input.charCodeAt(j) >= 0x80) {
        error('not-basic');
      }

      output.push(input.charCodeAt(j));
    } // Main decoding loop: start just after the last delimiter if any basic code
    // points were copied; start at the beginning otherwise.


    for (index = basic > 0 ? basic + 1 : 0; index < inputLength;)
    /* no final expression */
    {
      // `index` is the index of the next character to be consumed.
      // Decode a generalized variable-length integer into `delta`,
      // which gets added to `i`. The overflow checking is easier
      // if we increase `i` as we go, then subtract off its starting
      // value at the end to obtain `delta`.
      for (oldi = i, w = 1, k = base;;
      /* no condition */
      k += base) {
        if (index >= inputLength) {
          error('invalid-input');
        }

        digit = basicToDigit(input.charCodeAt(index++));

        if (digit >= base || digit > floor((maxInt - i) / w)) {
          error('overflow');
        }

        i += digit * w;
        t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

        if (digit < t) {
          break;
        }

        baseMinusT = base - t;

        if (w > floor(maxInt / baseMinusT)) {
          error('overflow');
        }

        w *= baseMinusT;
      }

      out = output.length + 1;
      bias = adapt(i - oldi, out, oldi == 0); // `i` was supposed to wrap around from `out` to `0`,
      // incrementing `n` each time, so we'll fix that now:

      if (floor(i / out) > maxInt - n) {
        error('overflow');
      }

      n += floor(i / out);
      i %= out; // Insert `n` at position `i` of the output

      output.splice(i++, 0, n);
    }

    return ucs2encode(output);
  }
  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   * @memberOf punycode
   * @param {String} input The string of Unicode symbols.
   * @returns {String} The resulting Punycode string of ASCII-only symbols.
   */

  function encode(input) {
    var n,
        delta,
        handledCPCount,
        basicLength,
        bias,
        j,
        m,
        q,
        k,
        t,
        currentValue,
        output = [],

    /** `inputLength` will hold the number of code points in `input`. */
    inputLength,

    /** Cached calculation results */
    handledCPCountPlusOne,
        baseMinusT,
        qMinusT; // Convert the input in UCS-2 to Unicode

    input = ucs2decode(input); // Cache the length

    inputLength = input.length; // Initialize the state

    n = initialN;
    delta = 0;
    bias = initialBias; // Handle the basic code points

    for (j = 0; j < inputLength; ++j) {
      currentValue = input[j];

      if (currentValue < 0x80) {
        output.push(stringFromCharCode(currentValue));
      }
    }

    handledCPCount = basicLength = output.length; // `handledCPCount` is the number of code points that have been handled;
    // `basicLength` is the number of basic code points.
    // Finish the basic string - if it is not empty - with a delimiter

    if (basicLength) {
      output.push(delimiter);
    } // Main encoding loop:


    while (handledCPCount < inputLength) {
      // All non-basic code points < n have been handled already. Find the next
      // larger one:
      for (m = maxInt, j = 0; j < inputLength; ++j) {
        currentValue = input[j];

        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      } // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
      // but guard against overflow


      handledCPCountPlusOne = handledCPCount + 1;

      if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
        error('overflow');
      }

      delta += (m - n) * handledCPCountPlusOne;
      n = m;

      for (j = 0; j < inputLength; ++j) {
        currentValue = input[j];

        if (currentValue < n && ++delta > maxInt) {
          error('overflow');
        }

        if (currentValue == n) {
          // Represent delta as a generalized variable-length integer
          for (q = delta, k = base;;
          /* no condition */
          k += base) {
            t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

            if (q < t) {
              break;
            }

            qMinusT = q - t;
            baseMinusT = base - t;
            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
            q = floor(qMinusT / baseMinusT);
          }

          output.push(stringFromCharCode(digitToBasic(q, 0)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
          delta = 0;
          ++handledCPCount;
        }
      }

      ++delta;
      ++n;
    }

    return output.join('');
  }
  /**
   * Converts a Punycode string representing a domain name or an email address
   * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
   * it doesn't matter if you call it on a string that has already been
   * converted to Unicode.
   * @memberOf punycode
   * @param {String} input The Punycoded domain name or email address to
   * convert to Unicode.
   * @returns {String} The Unicode representation of the given Punycode
   * string.
   */

  function toUnicode(input) {
    return mapDomain(input, function (string) {
      return regexPunycode.test(string) ? decode$1(string.slice(4).toLowerCase()) : string;
    });
  }
  /**
   * Converts a Unicode string representing a domain name or an email address to
   * Punycode. Only the non-ASCII parts of the domain name will be converted,
   * i.e. it doesn't matter if you call it with a domain that's already in
   * ASCII.
   * @memberOf punycode
   * @param {String} input The domain name or email address to convert, as a
   * Unicode string.
   * @returns {String} The Punycode representation of the given domain name or
   * email address.
   */

  function toASCII(input) {
    return mapDomain(input, function (string) {
      return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
    });
  }
  var version = '1.4.1';
  /**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */

  var ucs2 = {
    decode: ucs2decode,
    encode: ucs2encode
  };
  var punycode = {
    version: version,
    ucs2: ucs2,
    toASCII: toASCII,
    toUnicode: toUnicode,
    encode: encode,
    decode: decode$1
  };

  var punycode$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    decode: decode$1,
    encode: encode,
    toUnicode: toUnicode,
    toASCII: toASCII,
    version: version,
    ucs2: ucs2,
    'default': punycode
  });

  var revEntities = {
  	"9": "Tab;",
  	"10": "NewLine;",
  	"33": "excl;",
  	"34": "quot;",
  	"35": "num;",
  	"36": "dollar;",
  	"37": "percnt;",
  	"38": "amp;",
  	"39": "apos;",
  	"40": "lpar;",
  	"41": "rpar;",
  	"42": "midast;",
  	"43": "plus;",
  	"44": "comma;",
  	"46": "period;",
  	"47": "sol;",
  	"58": "colon;",
  	"59": "semi;",
  	"60": "lt;",
  	"61": "equals;",
  	"62": "gt;",
  	"63": "quest;",
  	"64": "commat;",
  	"91": "lsqb;",
  	"92": "bsol;",
  	"93": "rsqb;",
  	"94": "Hat;",
  	"95": "UnderBar;",
  	"96": "grave;",
  	"123": "lcub;",
  	"124": "VerticalLine;",
  	"125": "rcub;",
  	"160": "NonBreakingSpace;",
  	"161": "iexcl;",
  	"162": "cent;",
  	"163": "pound;",
  	"164": "curren;",
  	"165": "yen;",
  	"166": "brvbar;",
  	"167": "sect;",
  	"168": "uml;",
  	"169": "copy;",
  	"170": "ordf;",
  	"171": "laquo;",
  	"172": "not;",
  	"173": "shy;",
  	"174": "reg;",
  	"175": "strns;",
  	"176": "deg;",
  	"177": "pm;",
  	"178": "sup2;",
  	"179": "sup3;",
  	"180": "DiacriticalAcute;",
  	"181": "micro;",
  	"182": "para;",
  	"183": "middot;",
  	"184": "Cedilla;",
  	"185": "sup1;",
  	"186": "ordm;",
  	"187": "raquo;",
  	"188": "frac14;",
  	"189": "half;",
  	"190": "frac34;",
  	"191": "iquest;",
  	"192": "Agrave;",
  	"193": "Aacute;",
  	"194": "Acirc;",
  	"195": "Atilde;",
  	"196": "Auml;",
  	"197": "Aring;",
  	"198": "AElig;",
  	"199": "Ccedil;",
  	"200": "Egrave;",
  	"201": "Eacute;",
  	"202": "Ecirc;",
  	"203": "Euml;",
  	"204": "Igrave;",
  	"205": "Iacute;",
  	"206": "Icirc;",
  	"207": "Iuml;",
  	"208": "ETH;",
  	"209": "Ntilde;",
  	"210": "Ograve;",
  	"211": "Oacute;",
  	"212": "Ocirc;",
  	"213": "Otilde;",
  	"214": "Ouml;",
  	"215": "times;",
  	"216": "Oslash;",
  	"217": "Ugrave;",
  	"218": "Uacute;",
  	"219": "Ucirc;",
  	"220": "Uuml;",
  	"221": "Yacute;",
  	"222": "THORN;",
  	"223": "szlig;",
  	"224": "agrave;",
  	"225": "aacute;",
  	"226": "acirc;",
  	"227": "atilde;",
  	"228": "auml;",
  	"229": "aring;",
  	"230": "aelig;",
  	"231": "ccedil;",
  	"232": "egrave;",
  	"233": "eacute;",
  	"234": "ecirc;",
  	"235": "euml;",
  	"236": "igrave;",
  	"237": "iacute;",
  	"238": "icirc;",
  	"239": "iuml;",
  	"240": "eth;",
  	"241": "ntilde;",
  	"242": "ograve;",
  	"243": "oacute;",
  	"244": "ocirc;",
  	"245": "otilde;",
  	"246": "ouml;",
  	"247": "divide;",
  	"248": "oslash;",
  	"249": "ugrave;",
  	"250": "uacute;",
  	"251": "ucirc;",
  	"252": "uuml;",
  	"253": "yacute;",
  	"254": "thorn;",
  	"255": "yuml;",
  	"256": "Amacr;",
  	"257": "amacr;",
  	"258": "Abreve;",
  	"259": "abreve;",
  	"260": "Aogon;",
  	"261": "aogon;",
  	"262": "Cacute;",
  	"263": "cacute;",
  	"264": "Ccirc;",
  	"265": "ccirc;",
  	"266": "Cdot;",
  	"267": "cdot;",
  	"268": "Ccaron;",
  	"269": "ccaron;",
  	"270": "Dcaron;",
  	"271": "dcaron;",
  	"272": "Dstrok;",
  	"273": "dstrok;",
  	"274": "Emacr;",
  	"275": "emacr;",
  	"278": "Edot;",
  	"279": "edot;",
  	"280": "Eogon;",
  	"281": "eogon;",
  	"282": "Ecaron;",
  	"283": "ecaron;",
  	"284": "Gcirc;",
  	"285": "gcirc;",
  	"286": "Gbreve;",
  	"287": "gbreve;",
  	"288": "Gdot;",
  	"289": "gdot;",
  	"290": "Gcedil;",
  	"292": "Hcirc;",
  	"293": "hcirc;",
  	"294": "Hstrok;",
  	"295": "hstrok;",
  	"296": "Itilde;",
  	"297": "itilde;",
  	"298": "Imacr;",
  	"299": "imacr;",
  	"302": "Iogon;",
  	"303": "iogon;",
  	"304": "Idot;",
  	"305": "inodot;",
  	"306": "IJlig;",
  	"307": "ijlig;",
  	"308": "Jcirc;",
  	"309": "jcirc;",
  	"310": "Kcedil;",
  	"311": "kcedil;",
  	"312": "kgreen;",
  	"313": "Lacute;",
  	"314": "lacute;",
  	"315": "Lcedil;",
  	"316": "lcedil;",
  	"317": "Lcaron;",
  	"318": "lcaron;",
  	"319": "Lmidot;",
  	"320": "lmidot;",
  	"321": "Lstrok;",
  	"322": "lstrok;",
  	"323": "Nacute;",
  	"324": "nacute;",
  	"325": "Ncedil;",
  	"326": "ncedil;",
  	"327": "Ncaron;",
  	"328": "ncaron;",
  	"329": "napos;",
  	"330": "ENG;",
  	"331": "eng;",
  	"332": "Omacr;",
  	"333": "omacr;",
  	"336": "Odblac;",
  	"337": "odblac;",
  	"338": "OElig;",
  	"339": "oelig;",
  	"340": "Racute;",
  	"341": "racute;",
  	"342": "Rcedil;",
  	"343": "rcedil;",
  	"344": "Rcaron;",
  	"345": "rcaron;",
  	"346": "Sacute;",
  	"347": "sacute;",
  	"348": "Scirc;",
  	"349": "scirc;",
  	"350": "Scedil;",
  	"351": "scedil;",
  	"352": "Scaron;",
  	"353": "scaron;",
  	"354": "Tcedil;",
  	"355": "tcedil;",
  	"356": "Tcaron;",
  	"357": "tcaron;",
  	"358": "Tstrok;",
  	"359": "tstrok;",
  	"360": "Utilde;",
  	"361": "utilde;",
  	"362": "Umacr;",
  	"363": "umacr;",
  	"364": "Ubreve;",
  	"365": "ubreve;",
  	"366": "Uring;",
  	"367": "uring;",
  	"368": "Udblac;",
  	"369": "udblac;",
  	"370": "Uogon;",
  	"371": "uogon;",
  	"372": "Wcirc;",
  	"373": "wcirc;",
  	"374": "Ycirc;",
  	"375": "ycirc;",
  	"376": "Yuml;",
  	"377": "Zacute;",
  	"378": "zacute;",
  	"379": "Zdot;",
  	"380": "zdot;",
  	"381": "Zcaron;",
  	"382": "zcaron;",
  	"402": "fnof;",
  	"437": "imped;",
  	"501": "gacute;",
  	"567": "jmath;",
  	"710": "circ;",
  	"711": "Hacek;",
  	"728": "breve;",
  	"729": "dot;",
  	"730": "ring;",
  	"731": "ogon;",
  	"732": "tilde;",
  	"733": "DiacriticalDoubleAcute;",
  	"785": "DownBreve;",
  	"913": "Alpha;",
  	"914": "Beta;",
  	"915": "Gamma;",
  	"916": "Delta;",
  	"917": "Epsilon;",
  	"918": "Zeta;",
  	"919": "Eta;",
  	"920": "Theta;",
  	"921": "Iota;",
  	"922": "Kappa;",
  	"923": "Lambda;",
  	"924": "Mu;",
  	"925": "Nu;",
  	"926": "Xi;",
  	"927": "Omicron;",
  	"928": "Pi;",
  	"929": "Rho;",
  	"931": "Sigma;",
  	"932": "Tau;",
  	"933": "Upsilon;",
  	"934": "Phi;",
  	"935": "Chi;",
  	"936": "Psi;",
  	"937": "Omega;",
  	"945": "alpha;",
  	"946": "beta;",
  	"947": "gamma;",
  	"948": "delta;",
  	"949": "epsilon;",
  	"950": "zeta;",
  	"951": "eta;",
  	"952": "theta;",
  	"953": "iota;",
  	"954": "kappa;",
  	"955": "lambda;",
  	"956": "mu;",
  	"957": "nu;",
  	"958": "xi;",
  	"959": "omicron;",
  	"960": "pi;",
  	"961": "rho;",
  	"962": "varsigma;",
  	"963": "sigma;",
  	"964": "tau;",
  	"965": "upsilon;",
  	"966": "phi;",
  	"967": "chi;",
  	"968": "psi;",
  	"969": "omega;",
  	"977": "vartheta;",
  	"978": "upsih;",
  	"981": "varphi;",
  	"982": "varpi;",
  	"988": "Gammad;",
  	"989": "gammad;",
  	"1008": "varkappa;",
  	"1009": "varrho;",
  	"1013": "varepsilon;",
  	"1014": "bepsi;",
  	"1025": "IOcy;",
  	"1026": "DJcy;",
  	"1027": "GJcy;",
  	"1028": "Jukcy;",
  	"1029": "DScy;",
  	"1030": "Iukcy;",
  	"1031": "YIcy;",
  	"1032": "Jsercy;",
  	"1033": "LJcy;",
  	"1034": "NJcy;",
  	"1035": "TSHcy;",
  	"1036": "KJcy;",
  	"1038": "Ubrcy;",
  	"1039": "DZcy;",
  	"1040": "Acy;",
  	"1041": "Bcy;",
  	"1042": "Vcy;",
  	"1043": "Gcy;",
  	"1044": "Dcy;",
  	"1045": "IEcy;",
  	"1046": "ZHcy;",
  	"1047": "Zcy;",
  	"1048": "Icy;",
  	"1049": "Jcy;",
  	"1050": "Kcy;",
  	"1051": "Lcy;",
  	"1052": "Mcy;",
  	"1053": "Ncy;",
  	"1054": "Ocy;",
  	"1055": "Pcy;",
  	"1056": "Rcy;",
  	"1057": "Scy;",
  	"1058": "Tcy;",
  	"1059": "Ucy;",
  	"1060": "Fcy;",
  	"1061": "KHcy;",
  	"1062": "TScy;",
  	"1063": "CHcy;",
  	"1064": "SHcy;",
  	"1065": "SHCHcy;",
  	"1066": "HARDcy;",
  	"1067": "Ycy;",
  	"1068": "SOFTcy;",
  	"1069": "Ecy;",
  	"1070": "YUcy;",
  	"1071": "YAcy;",
  	"1072": "acy;",
  	"1073": "bcy;",
  	"1074": "vcy;",
  	"1075": "gcy;",
  	"1076": "dcy;",
  	"1077": "iecy;",
  	"1078": "zhcy;",
  	"1079": "zcy;",
  	"1080": "icy;",
  	"1081": "jcy;",
  	"1082": "kcy;",
  	"1083": "lcy;",
  	"1084": "mcy;",
  	"1085": "ncy;",
  	"1086": "ocy;",
  	"1087": "pcy;",
  	"1088": "rcy;",
  	"1089": "scy;",
  	"1090": "tcy;",
  	"1091": "ucy;",
  	"1092": "fcy;",
  	"1093": "khcy;",
  	"1094": "tscy;",
  	"1095": "chcy;",
  	"1096": "shcy;",
  	"1097": "shchcy;",
  	"1098": "hardcy;",
  	"1099": "ycy;",
  	"1100": "softcy;",
  	"1101": "ecy;",
  	"1102": "yucy;",
  	"1103": "yacy;",
  	"1105": "iocy;",
  	"1106": "djcy;",
  	"1107": "gjcy;",
  	"1108": "jukcy;",
  	"1109": "dscy;",
  	"1110": "iukcy;",
  	"1111": "yicy;",
  	"1112": "jsercy;",
  	"1113": "ljcy;",
  	"1114": "njcy;",
  	"1115": "tshcy;",
  	"1116": "kjcy;",
  	"1118": "ubrcy;",
  	"1119": "dzcy;",
  	"8194": "ensp;",
  	"8195": "emsp;",
  	"8196": "emsp13;",
  	"8197": "emsp14;",
  	"8199": "numsp;",
  	"8200": "puncsp;",
  	"8201": "ThinSpace;",
  	"8202": "VeryThinSpace;",
  	"8203": "ZeroWidthSpace;",
  	"8204": "zwnj;",
  	"8205": "zwj;",
  	"8206": "lrm;",
  	"8207": "rlm;",
  	"8208": "hyphen;",
  	"8211": "ndash;",
  	"8212": "mdash;",
  	"8213": "horbar;",
  	"8214": "Vert;",
  	"8216": "OpenCurlyQuote;",
  	"8217": "rsquor;",
  	"8218": "sbquo;",
  	"8220": "OpenCurlyDoubleQuote;",
  	"8221": "rdquor;",
  	"8222": "ldquor;",
  	"8224": "dagger;",
  	"8225": "ddagger;",
  	"8226": "bullet;",
  	"8229": "nldr;",
  	"8230": "mldr;",
  	"8240": "permil;",
  	"8241": "pertenk;",
  	"8242": "prime;",
  	"8243": "Prime;",
  	"8244": "tprime;",
  	"8245": "bprime;",
  	"8249": "lsaquo;",
  	"8250": "rsaquo;",
  	"8254": "OverBar;",
  	"8257": "caret;",
  	"8259": "hybull;",
  	"8260": "frasl;",
  	"8271": "bsemi;",
  	"8279": "qprime;",
  	"8287": "MediumSpace;",
  	"8288": "NoBreak;",
  	"8289": "ApplyFunction;",
  	"8290": "it;",
  	"8291": "InvisibleComma;",
  	"8364": "euro;",
  	"8411": "TripleDot;",
  	"8412": "DotDot;",
  	"8450": "Copf;",
  	"8453": "incare;",
  	"8458": "gscr;",
  	"8459": "Hscr;",
  	"8460": "Poincareplane;",
  	"8461": "quaternions;",
  	"8462": "planckh;",
  	"8463": "plankv;",
  	"8464": "Iscr;",
  	"8465": "imagpart;",
  	"8466": "Lscr;",
  	"8467": "ell;",
  	"8469": "Nopf;",
  	"8470": "numero;",
  	"8471": "copysr;",
  	"8472": "wp;",
  	"8473": "primes;",
  	"8474": "rationals;",
  	"8475": "Rscr;",
  	"8476": "Rfr;",
  	"8477": "Ropf;",
  	"8478": "rx;",
  	"8482": "trade;",
  	"8484": "Zopf;",
  	"8487": "mho;",
  	"8488": "Zfr;",
  	"8489": "iiota;",
  	"8492": "Bscr;",
  	"8493": "Cfr;",
  	"8495": "escr;",
  	"8496": "expectation;",
  	"8497": "Fscr;",
  	"8499": "phmmat;",
  	"8500": "oscr;",
  	"8501": "aleph;",
  	"8502": "beth;",
  	"8503": "gimel;",
  	"8504": "daleth;",
  	"8517": "DD;",
  	"8518": "DifferentialD;",
  	"8519": "exponentiale;",
  	"8520": "ImaginaryI;",
  	"8531": "frac13;",
  	"8532": "frac23;",
  	"8533": "frac15;",
  	"8534": "frac25;",
  	"8535": "frac35;",
  	"8536": "frac45;",
  	"8537": "frac16;",
  	"8538": "frac56;",
  	"8539": "frac18;",
  	"8540": "frac38;",
  	"8541": "frac58;",
  	"8542": "frac78;",
  	"8592": "slarr;",
  	"8593": "uparrow;",
  	"8594": "srarr;",
  	"8595": "ShortDownArrow;",
  	"8596": "leftrightarrow;",
  	"8597": "varr;",
  	"8598": "UpperLeftArrow;",
  	"8599": "UpperRightArrow;",
  	"8600": "searrow;",
  	"8601": "swarrow;",
  	"8602": "nleftarrow;",
  	"8603": "nrightarrow;",
  	"8605": "rightsquigarrow;",
  	"8606": "twoheadleftarrow;",
  	"8607": "Uarr;",
  	"8608": "twoheadrightarrow;",
  	"8609": "Darr;",
  	"8610": "leftarrowtail;",
  	"8611": "rightarrowtail;",
  	"8612": "mapstoleft;",
  	"8613": "UpTeeArrow;",
  	"8614": "RightTeeArrow;",
  	"8615": "mapstodown;",
  	"8617": "larrhk;",
  	"8618": "rarrhk;",
  	"8619": "looparrowleft;",
  	"8620": "rarrlp;",
  	"8621": "leftrightsquigarrow;",
  	"8622": "nleftrightarrow;",
  	"8624": "lsh;",
  	"8625": "rsh;",
  	"8626": "ldsh;",
  	"8627": "rdsh;",
  	"8629": "crarr;",
  	"8630": "curvearrowleft;",
  	"8631": "curvearrowright;",
  	"8634": "olarr;",
  	"8635": "orarr;",
  	"8636": "lharu;",
  	"8637": "lhard;",
  	"8638": "upharpoonright;",
  	"8639": "upharpoonleft;",
  	"8640": "RightVector;",
  	"8641": "rightharpoondown;",
  	"8642": "RightDownVector;",
  	"8643": "LeftDownVector;",
  	"8644": "rlarr;",
  	"8645": "UpArrowDownArrow;",
  	"8646": "lrarr;",
  	"8647": "llarr;",
  	"8648": "uuarr;",
  	"8649": "rrarr;",
  	"8650": "downdownarrows;",
  	"8651": "ReverseEquilibrium;",
  	"8652": "rlhar;",
  	"8653": "nLeftarrow;",
  	"8654": "nLeftrightarrow;",
  	"8655": "nRightarrow;",
  	"8656": "Leftarrow;",
  	"8657": "Uparrow;",
  	"8658": "Rightarrow;",
  	"8659": "Downarrow;",
  	"8660": "Leftrightarrow;",
  	"8661": "vArr;",
  	"8662": "nwArr;",
  	"8663": "neArr;",
  	"8664": "seArr;",
  	"8665": "swArr;",
  	"8666": "Lleftarrow;",
  	"8667": "Rrightarrow;",
  	"8669": "zigrarr;",
  	"8676": "LeftArrowBar;",
  	"8677": "RightArrowBar;",
  	"8693": "duarr;",
  	"8701": "loarr;",
  	"8702": "roarr;",
  	"8703": "hoarr;",
  	"8704": "forall;",
  	"8705": "complement;",
  	"8706": "PartialD;",
  	"8707": "Exists;",
  	"8708": "NotExists;",
  	"8709": "varnothing;",
  	"8711": "nabla;",
  	"8712": "isinv;",
  	"8713": "notinva;",
  	"8715": "SuchThat;",
  	"8716": "NotReverseElement;",
  	"8719": "Product;",
  	"8720": "Coproduct;",
  	"8721": "sum;",
  	"8722": "minus;",
  	"8723": "mp;",
  	"8724": "plusdo;",
  	"8726": "ssetmn;",
  	"8727": "lowast;",
  	"8728": "SmallCircle;",
  	"8730": "Sqrt;",
  	"8733": "vprop;",
  	"8734": "infin;",
  	"8735": "angrt;",
  	"8736": "angle;",
  	"8737": "measuredangle;",
  	"8738": "angsph;",
  	"8739": "VerticalBar;",
  	"8740": "nsmid;",
  	"8741": "spar;",
  	"8742": "nspar;",
  	"8743": "wedge;",
  	"8744": "vee;",
  	"8745": "cap;",
  	"8746": "cup;",
  	"8747": "Integral;",
  	"8748": "Int;",
  	"8749": "tint;",
  	"8750": "oint;",
  	"8751": "DoubleContourIntegral;",
  	"8752": "Cconint;",
  	"8753": "cwint;",
  	"8754": "cwconint;",
  	"8755": "CounterClockwiseContourIntegral;",
  	"8756": "therefore;",
  	"8757": "because;",
  	"8758": "ratio;",
  	"8759": "Proportion;",
  	"8760": "minusd;",
  	"8762": "mDDot;",
  	"8763": "homtht;",
  	"8764": "Tilde;",
  	"8765": "bsim;",
  	"8766": "mstpos;",
  	"8767": "acd;",
  	"8768": "wreath;",
  	"8769": "nsim;",
  	"8770": "esim;",
  	"8771": "TildeEqual;",
  	"8772": "nsimeq;",
  	"8773": "TildeFullEqual;",
  	"8774": "simne;",
  	"8775": "NotTildeFullEqual;",
  	"8776": "TildeTilde;",
  	"8777": "NotTildeTilde;",
  	"8778": "approxeq;",
  	"8779": "apid;",
  	"8780": "bcong;",
  	"8781": "CupCap;",
  	"8782": "HumpDownHump;",
  	"8783": "HumpEqual;",
  	"8784": "esdot;",
  	"8785": "eDot;",
  	"8786": "fallingdotseq;",
  	"8787": "risingdotseq;",
  	"8788": "coloneq;",
  	"8789": "eqcolon;",
  	"8790": "eqcirc;",
  	"8791": "cire;",
  	"8793": "wedgeq;",
  	"8794": "veeeq;",
  	"8796": "trie;",
  	"8799": "questeq;",
  	"8800": "NotEqual;",
  	"8801": "equiv;",
  	"8802": "NotCongruent;",
  	"8804": "leq;",
  	"8805": "GreaterEqual;",
  	"8806": "LessFullEqual;",
  	"8807": "GreaterFullEqual;",
  	"8808": "lneqq;",
  	"8809": "gneqq;",
  	"8810": "NestedLessLess;",
  	"8811": "NestedGreaterGreater;",
  	"8812": "twixt;",
  	"8813": "NotCupCap;",
  	"8814": "NotLess;",
  	"8815": "NotGreater;",
  	"8816": "NotLessEqual;",
  	"8817": "NotGreaterEqual;",
  	"8818": "lsim;",
  	"8819": "gtrsim;",
  	"8820": "NotLessTilde;",
  	"8821": "NotGreaterTilde;",
  	"8822": "lg;",
  	"8823": "gtrless;",
  	"8824": "ntlg;",
  	"8825": "ntgl;",
  	"8826": "Precedes;",
  	"8827": "Succeeds;",
  	"8828": "PrecedesSlantEqual;",
  	"8829": "SucceedsSlantEqual;",
  	"8830": "prsim;",
  	"8831": "succsim;",
  	"8832": "nprec;",
  	"8833": "nsucc;",
  	"8834": "subset;",
  	"8835": "supset;",
  	"8836": "nsub;",
  	"8837": "nsup;",
  	"8838": "SubsetEqual;",
  	"8839": "supseteq;",
  	"8840": "nsubseteq;",
  	"8841": "nsupseteq;",
  	"8842": "subsetneq;",
  	"8843": "supsetneq;",
  	"8845": "cupdot;",
  	"8846": "uplus;",
  	"8847": "SquareSubset;",
  	"8848": "SquareSuperset;",
  	"8849": "SquareSubsetEqual;",
  	"8850": "SquareSupersetEqual;",
  	"8851": "SquareIntersection;",
  	"8852": "SquareUnion;",
  	"8853": "oplus;",
  	"8854": "ominus;",
  	"8855": "otimes;",
  	"8856": "osol;",
  	"8857": "odot;",
  	"8858": "ocir;",
  	"8859": "oast;",
  	"8861": "odash;",
  	"8862": "plusb;",
  	"8863": "minusb;",
  	"8864": "timesb;",
  	"8865": "sdotb;",
  	"8866": "vdash;",
  	"8867": "LeftTee;",
  	"8868": "top;",
  	"8869": "UpTee;",
  	"8871": "models;",
  	"8872": "vDash;",
  	"8873": "Vdash;",
  	"8874": "Vvdash;",
  	"8875": "VDash;",
  	"8876": "nvdash;",
  	"8877": "nvDash;",
  	"8878": "nVdash;",
  	"8879": "nVDash;",
  	"8880": "prurel;",
  	"8882": "vltri;",
  	"8883": "vrtri;",
  	"8884": "trianglelefteq;",
  	"8885": "trianglerighteq;",
  	"8886": "origof;",
  	"8887": "imof;",
  	"8888": "mumap;",
  	"8889": "hercon;",
  	"8890": "intercal;",
  	"8891": "veebar;",
  	"8893": "barvee;",
  	"8894": "angrtvb;",
  	"8895": "lrtri;",
  	"8896": "xwedge;",
  	"8897": "xvee;",
  	"8898": "xcap;",
  	"8899": "xcup;",
  	"8900": "diamond;",
  	"8901": "sdot;",
  	"8902": "Star;",
  	"8903": "divonx;",
  	"8904": "bowtie;",
  	"8905": "ltimes;",
  	"8906": "rtimes;",
  	"8907": "lthree;",
  	"8908": "rthree;",
  	"8909": "bsime;",
  	"8910": "cuvee;",
  	"8911": "cuwed;",
  	"8912": "Subset;",
  	"8913": "Supset;",
  	"8914": "Cap;",
  	"8915": "Cup;",
  	"8916": "pitchfork;",
  	"8917": "epar;",
  	"8918": "ltdot;",
  	"8919": "gtrdot;",
  	"8920": "Ll;",
  	"8921": "ggg;",
  	"8922": "LessEqualGreater;",
  	"8923": "gtreqless;",
  	"8926": "curlyeqprec;",
  	"8927": "curlyeqsucc;",
  	"8928": "nprcue;",
  	"8929": "nsccue;",
  	"8930": "nsqsube;",
  	"8931": "nsqsupe;",
  	"8934": "lnsim;",
  	"8935": "gnsim;",
  	"8936": "prnsim;",
  	"8937": "succnsim;",
  	"8938": "ntriangleleft;",
  	"8939": "ntriangleright;",
  	"8940": "ntrianglelefteq;",
  	"8941": "ntrianglerighteq;",
  	"8942": "vellip;",
  	"8943": "ctdot;",
  	"8944": "utdot;",
  	"8945": "dtdot;",
  	"8946": "disin;",
  	"8947": "isinsv;",
  	"8948": "isins;",
  	"8949": "isindot;",
  	"8950": "notinvc;",
  	"8951": "notinvb;",
  	"8953": "isinE;",
  	"8954": "nisd;",
  	"8955": "xnis;",
  	"8956": "nis;",
  	"8957": "notnivc;",
  	"8958": "notnivb;",
  	"8965": "barwedge;",
  	"8966": "doublebarwedge;",
  	"8968": "LeftCeiling;",
  	"8969": "RightCeiling;",
  	"8970": "lfloor;",
  	"8971": "RightFloor;",
  	"8972": "drcrop;",
  	"8973": "dlcrop;",
  	"8974": "urcrop;",
  	"8975": "ulcrop;",
  	"8976": "bnot;",
  	"8978": "profline;",
  	"8979": "profsurf;",
  	"8981": "telrec;",
  	"8982": "target;",
  	"8988": "ulcorner;",
  	"8989": "urcorner;",
  	"8990": "llcorner;",
  	"8991": "lrcorner;",
  	"8994": "sfrown;",
  	"8995": "ssmile;",
  	"9005": "cylcty;",
  	"9006": "profalar;",
  	"9014": "topbot;",
  	"9021": "ovbar;",
  	"9023": "solbar;",
  	"9084": "angzarr;",
  	"9136": "lmoustache;",
  	"9137": "rmoustache;",
  	"9140": "tbrk;",
  	"9141": "UnderBracket;",
  	"9142": "bbrktbrk;",
  	"9180": "OverParenthesis;",
  	"9181": "UnderParenthesis;",
  	"9182": "OverBrace;",
  	"9183": "UnderBrace;",
  	"9186": "trpezium;",
  	"9191": "elinters;",
  	"9251": "blank;",
  	"9416": "oS;",
  	"9472": "HorizontalLine;",
  	"9474": "boxv;",
  	"9484": "boxdr;",
  	"9488": "boxdl;",
  	"9492": "boxur;",
  	"9496": "boxul;",
  	"9500": "boxvr;",
  	"9508": "boxvl;",
  	"9516": "boxhd;",
  	"9524": "boxhu;",
  	"9532": "boxvh;",
  	"9552": "boxH;",
  	"9553": "boxV;",
  	"9554": "boxdR;",
  	"9555": "boxDr;",
  	"9556": "boxDR;",
  	"9557": "boxdL;",
  	"9558": "boxDl;",
  	"9559": "boxDL;",
  	"9560": "boxuR;",
  	"9561": "boxUr;",
  	"9562": "boxUR;",
  	"9563": "boxuL;",
  	"9564": "boxUl;",
  	"9565": "boxUL;",
  	"9566": "boxvR;",
  	"9567": "boxVr;",
  	"9568": "boxVR;",
  	"9569": "boxvL;",
  	"9570": "boxVl;",
  	"9571": "boxVL;",
  	"9572": "boxHd;",
  	"9573": "boxhD;",
  	"9574": "boxHD;",
  	"9575": "boxHu;",
  	"9576": "boxhU;",
  	"9577": "boxHU;",
  	"9578": "boxvH;",
  	"9579": "boxVh;",
  	"9580": "boxVH;",
  	"9600": "uhblk;",
  	"9604": "lhblk;",
  	"9608": "block;",
  	"9617": "blk14;",
  	"9618": "blk12;",
  	"9619": "blk34;",
  	"9633": "square;",
  	"9642": "squf;",
  	"9643": "EmptyVerySmallSquare;",
  	"9645": "rect;",
  	"9646": "marker;",
  	"9649": "fltns;",
  	"9651": "xutri;",
  	"9652": "utrif;",
  	"9653": "utri;",
  	"9656": "rtrif;",
  	"9657": "triangleright;",
  	"9661": "xdtri;",
  	"9662": "dtrif;",
  	"9663": "triangledown;",
  	"9666": "ltrif;",
  	"9667": "triangleleft;",
  	"9674": "lozenge;",
  	"9675": "cir;",
  	"9708": "tridot;",
  	"9711": "xcirc;",
  	"9720": "ultri;",
  	"9721": "urtri;",
  	"9722": "lltri;",
  	"9723": "EmptySmallSquare;",
  	"9724": "FilledSmallSquare;",
  	"9733": "starf;",
  	"9734": "star;",
  	"9742": "phone;",
  	"9792": "female;",
  	"9794": "male;",
  	"9824": "spadesuit;",
  	"9827": "clubsuit;",
  	"9829": "heartsuit;",
  	"9830": "diams;",
  	"9834": "sung;",
  	"9837": "flat;",
  	"9838": "natural;",
  	"9839": "sharp;",
  	"10003": "checkmark;",
  	"10007": "cross;",
  	"10016": "maltese;",
  	"10038": "sext;",
  	"10072": "VerticalSeparator;",
  	"10098": "lbbrk;",
  	"10099": "rbbrk;",
  	"10184": "bsolhsub;",
  	"10185": "suphsol;",
  	"10214": "lobrk;",
  	"10215": "robrk;",
  	"10216": "LeftAngleBracket;",
  	"10217": "RightAngleBracket;",
  	"10218": "Lang;",
  	"10219": "Rang;",
  	"10220": "loang;",
  	"10221": "roang;",
  	"10229": "xlarr;",
  	"10230": "xrarr;",
  	"10231": "xharr;",
  	"10232": "xlArr;",
  	"10233": "xrArr;",
  	"10234": "xhArr;",
  	"10236": "xmap;",
  	"10239": "dzigrarr;",
  	"10498": "nvlArr;",
  	"10499": "nvrArr;",
  	"10500": "nvHarr;",
  	"10501": "Map;",
  	"10508": "lbarr;",
  	"10509": "rbarr;",
  	"10510": "lBarr;",
  	"10511": "rBarr;",
  	"10512": "RBarr;",
  	"10513": "DDotrahd;",
  	"10514": "UpArrowBar;",
  	"10515": "DownArrowBar;",
  	"10518": "Rarrtl;",
  	"10521": "latail;",
  	"10522": "ratail;",
  	"10523": "lAtail;",
  	"10524": "rAtail;",
  	"10525": "larrfs;",
  	"10526": "rarrfs;",
  	"10527": "larrbfs;",
  	"10528": "rarrbfs;",
  	"10531": "nwarhk;",
  	"10532": "nearhk;",
  	"10533": "searhk;",
  	"10534": "swarhk;",
  	"10535": "nwnear;",
  	"10536": "toea;",
  	"10537": "tosa;",
  	"10538": "swnwar;",
  	"10547": "rarrc;",
  	"10549": "cudarrr;",
  	"10550": "ldca;",
  	"10551": "rdca;",
  	"10552": "cudarrl;",
  	"10553": "larrpl;",
  	"10556": "curarrm;",
  	"10557": "cularrp;",
  	"10565": "rarrpl;",
  	"10568": "harrcir;",
  	"10569": "Uarrocir;",
  	"10570": "lurdshar;",
  	"10571": "ldrushar;",
  	"10574": "LeftRightVector;",
  	"10575": "RightUpDownVector;",
  	"10576": "DownLeftRightVector;",
  	"10577": "LeftUpDownVector;",
  	"10578": "LeftVectorBar;",
  	"10579": "RightVectorBar;",
  	"10580": "RightUpVectorBar;",
  	"10581": "RightDownVectorBar;",
  	"10582": "DownLeftVectorBar;",
  	"10583": "DownRightVectorBar;",
  	"10584": "LeftUpVectorBar;",
  	"10585": "LeftDownVectorBar;",
  	"10586": "LeftTeeVector;",
  	"10587": "RightTeeVector;",
  	"10588": "RightUpTeeVector;",
  	"10589": "RightDownTeeVector;",
  	"10590": "DownLeftTeeVector;",
  	"10591": "DownRightTeeVector;",
  	"10592": "LeftUpTeeVector;",
  	"10593": "LeftDownTeeVector;",
  	"10594": "lHar;",
  	"10595": "uHar;",
  	"10596": "rHar;",
  	"10597": "dHar;",
  	"10598": "luruhar;",
  	"10599": "ldrdhar;",
  	"10600": "ruluhar;",
  	"10601": "rdldhar;",
  	"10602": "lharul;",
  	"10603": "llhard;",
  	"10604": "rharul;",
  	"10605": "lrhard;",
  	"10606": "UpEquilibrium;",
  	"10607": "ReverseUpEquilibrium;",
  	"10608": "RoundImplies;",
  	"10609": "erarr;",
  	"10610": "simrarr;",
  	"10611": "larrsim;",
  	"10612": "rarrsim;",
  	"10613": "rarrap;",
  	"10614": "ltlarr;",
  	"10616": "gtrarr;",
  	"10617": "subrarr;",
  	"10619": "suplarr;",
  	"10620": "lfisht;",
  	"10621": "rfisht;",
  	"10622": "ufisht;",
  	"10623": "dfisht;",
  	"10629": "lopar;",
  	"10630": "ropar;",
  	"10635": "lbrke;",
  	"10636": "rbrke;",
  	"10637": "lbrkslu;",
  	"10638": "rbrksld;",
  	"10639": "lbrksld;",
  	"10640": "rbrkslu;",
  	"10641": "langd;",
  	"10642": "rangd;",
  	"10643": "lparlt;",
  	"10644": "rpargt;",
  	"10645": "gtlPar;",
  	"10646": "ltrPar;",
  	"10650": "vzigzag;",
  	"10652": "vangrt;",
  	"10653": "angrtvbd;",
  	"10660": "ange;",
  	"10661": "range;",
  	"10662": "dwangle;",
  	"10663": "uwangle;",
  	"10664": "angmsdaa;",
  	"10665": "angmsdab;",
  	"10666": "angmsdac;",
  	"10667": "angmsdad;",
  	"10668": "angmsdae;",
  	"10669": "angmsdaf;",
  	"10670": "angmsdag;",
  	"10671": "angmsdah;",
  	"10672": "bemptyv;",
  	"10673": "demptyv;",
  	"10674": "cemptyv;",
  	"10675": "raemptyv;",
  	"10676": "laemptyv;",
  	"10677": "ohbar;",
  	"10678": "omid;",
  	"10679": "opar;",
  	"10681": "operp;",
  	"10683": "olcross;",
  	"10684": "odsold;",
  	"10686": "olcir;",
  	"10687": "ofcir;",
  	"10688": "olt;",
  	"10689": "ogt;",
  	"10690": "cirscir;",
  	"10691": "cirE;",
  	"10692": "solb;",
  	"10693": "bsolb;",
  	"10697": "boxbox;",
  	"10701": "trisb;",
  	"10702": "rtriltri;",
  	"10703": "LeftTriangleBar;",
  	"10704": "RightTriangleBar;",
  	"10716": "iinfin;",
  	"10717": "infintie;",
  	"10718": "nvinfin;",
  	"10723": "eparsl;",
  	"10724": "smeparsl;",
  	"10725": "eqvparsl;",
  	"10731": "lozf;",
  	"10740": "RuleDelayed;",
  	"10742": "dsol;",
  	"10752": "xodot;",
  	"10753": "xoplus;",
  	"10754": "xotime;",
  	"10756": "xuplus;",
  	"10758": "xsqcup;",
  	"10764": "qint;",
  	"10765": "fpartint;",
  	"10768": "cirfnint;",
  	"10769": "awint;",
  	"10770": "rppolint;",
  	"10771": "scpolint;",
  	"10772": "npolint;",
  	"10773": "pointint;",
  	"10774": "quatint;",
  	"10775": "intlarhk;",
  	"10786": "pluscir;",
  	"10787": "plusacir;",
  	"10788": "simplus;",
  	"10789": "plusdu;",
  	"10790": "plussim;",
  	"10791": "plustwo;",
  	"10793": "mcomma;",
  	"10794": "minusdu;",
  	"10797": "loplus;",
  	"10798": "roplus;",
  	"10799": "Cross;",
  	"10800": "timesd;",
  	"10801": "timesbar;",
  	"10803": "smashp;",
  	"10804": "lotimes;",
  	"10805": "rotimes;",
  	"10806": "otimesas;",
  	"10807": "Otimes;",
  	"10808": "odiv;",
  	"10809": "triplus;",
  	"10810": "triminus;",
  	"10811": "tritime;",
  	"10812": "iprod;",
  	"10815": "amalg;",
  	"10816": "capdot;",
  	"10818": "ncup;",
  	"10819": "ncap;",
  	"10820": "capand;",
  	"10821": "cupor;",
  	"10822": "cupcap;",
  	"10823": "capcup;",
  	"10824": "cupbrcap;",
  	"10825": "capbrcup;",
  	"10826": "cupcup;",
  	"10827": "capcap;",
  	"10828": "ccups;",
  	"10829": "ccaps;",
  	"10832": "ccupssm;",
  	"10835": "And;",
  	"10836": "Or;",
  	"10837": "andand;",
  	"10838": "oror;",
  	"10839": "orslope;",
  	"10840": "andslope;",
  	"10842": "andv;",
  	"10843": "orv;",
  	"10844": "andd;",
  	"10845": "ord;",
  	"10847": "wedbar;",
  	"10854": "sdote;",
  	"10858": "simdot;",
  	"10861": "congdot;",
  	"10862": "easter;",
  	"10863": "apacir;",
  	"10864": "apE;",
  	"10865": "eplus;",
  	"10866": "pluse;",
  	"10867": "Esim;",
  	"10868": "Colone;",
  	"10869": "Equal;",
  	"10871": "eDDot;",
  	"10872": "equivDD;",
  	"10873": "ltcir;",
  	"10874": "gtcir;",
  	"10875": "ltquest;",
  	"10876": "gtquest;",
  	"10877": "LessSlantEqual;",
  	"10878": "GreaterSlantEqual;",
  	"10879": "lesdot;",
  	"10880": "gesdot;",
  	"10881": "lesdoto;",
  	"10882": "gesdoto;",
  	"10883": "lesdotor;",
  	"10884": "gesdotol;",
  	"10885": "lessapprox;",
  	"10886": "gtrapprox;",
  	"10887": "lneq;",
  	"10888": "gneq;",
  	"10889": "lnapprox;",
  	"10890": "gnapprox;",
  	"10891": "lesseqqgtr;",
  	"10892": "gtreqqless;",
  	"10893": "lsime;",
  	"10894": "gsime;",
  	"10895": "lsimg;",
  	"10896": "gsiml;",
  	"10897": "lgE;",
  	"10898": "glE;",
  	"10899": "lesges;",
  	"10900": "gesles;",
  	"10901": "eqslantless;",
  	"10902": "eqslantgtr;",
  	"10903": "elsdot;",
  	"10904": "egsdot;",
  	"10905": "el;",
  	"10906": "eg;",
  	"10909": "siml;",
  	"10910": "simg;",
  	"10911": "simlE;",
  	"10912": "simgE;",
  	"10913": "LessLess;",
  	"10914": "GreaterGreater;",
  	"10916": "glj;",
  	"10917": "gla;",
  	"10918": "ltcc;",
  	"10919": "gtcc;",
  	"10920": "lescc;",
  	"10921": "gescc;",
  	"10922": "smt;",
  	"10923": "lat;",
  	"10924": "smte;",
  	"10925": "late;",
  	"10926": "bumpE;",
  	"10927": "preceq;",
  	"10928": "succeq;",
  	"10931": "prE;",
  	"10932": "scE;",
  	"10933": "prnE;",
  	"10934": "succneqq;",
  	"10935": "precapprox;",
  	"10936": "succapprox;",
  	"10937": "prnap;",
  	"10938": "succnapprox;",
  	"10939": "Pr;",
  	"10940": "Sc;",
  	"10941": "subdot;",
  	"10942": "supdot;",
  	"10943": "subplus;",
  	"10944": "supplus;",
  	"10945": "submult;",
  	"10946": "supmult;",
  	"10947": "subedot;",
  	"10948": "supedot;",
  	"10949": "subseteqq;",
  	"10950": "supseteqq;",
  	"10951": "subsim;",
  	"10952": "supsim;",
  	"10955": "subsetneqq;",
  	"10956": "supsetneqq;",
  	"10959": "csub;",
  	"10960": "csup;",
  	"10961": "csube;",
  	"10962": "csupe;",
  	"10963": "subsup;",
  	"10964": "supsub;",
  	"10965": "subsub;",
  	"10966": "supsup;",
  	"10967": "suphsub;",
  	"10968": "supdsub;",
  	"10969": "forkv;",
  	"10970": "topfork;",
  	"10971": "mlcp;",
  	"10980": "DoubleLeftTee;",
  	"10982": "Vdashl;",
  	"10983": "Barv;",
  	"10984": "vBar;",
  	"10985": "vBarv;",
  	"10987": "Vbar;",
  	"10988": "Not;",
  	"10989": "bNot;",
  	"10990": "rnmid;",
  	"10991": "cirmid;",
  	"10992": "midcir;",
  	"10993": "topcir;",
  	"10994": "nhpar;",
  	"10995": "parsim;",
  	"11005": "parsl;",
  	"64256": "fflig;",
  	"64257": "filig;",
  	"64258": "fllig;",
  	"64259": "ffilig;",
  	"64260": "ffllig;"
  };

  var encode_1 = encode$1;

  function encode$1(str, opts) {
    if (typeof str !== 'string') {
      throw new TypeError('Expected a String');
    }

    if (!opts) opts = {};
    var numeric = true;
    if (opts.named) numeric = false;
    if (opts.numeric !== undefined) numeric = opts.numeric;
    var special = opts.special || {
      '"': true,
      "'": true,
      '<': true,
      '>': true,
      '&': true
    };
    var codePoints = punycode$1.ucs2.decode(str);
    var chars = [];

    for (var i = 0; i < codePoints.length; i++) {
      var cc = codePoints[i];
      var c = punycode$1.ucs2.encode([cc]);
      var e = revEntities[cc];

      if (e && (cc >= 127 || special[c]) && !numeric) {
        chars.push('&' + (/;$/.test(e) ? e : e + ';'));
      } else if (cc < 32 || cc >= 127 || special[c]) {
        chars.push('&#' + cc + ';');
      } else {
        chars.push(c);
      }
    }

    return chars.join('');
  }

  var Aacute$1 = "Á";
  var aacute$1 = "á";
  var Acirc$1 = "Â";
  var acirc$1 = "â";
  var acute$2 = "´";
  var AElig$1 = "Æ";
  var aelig$1 = "æ";
  var Agrave$1 = "À";
  var agrave$1 = "à";
  var AMP$1 = "&";
  var amp$2 = "&";
  var Aring$2 = "Å";
  var aring$2 = "å";
  var Atilde$1 = "Ã";
  var atilde$2 = "ã";
  var Auml$1 = "Ä";
  var auml$1 = "ä";
  var brvbar$1 = "¦";
  var Ccedil$1 = "Ç";
  var ccedil$1 = "ç";
  var cedil$2 = "¸";
  var cent$2 = "¢";
  var COPY$2 = "©";
  var copy$2 = "©";
  var curren$1 = "¤";
  var deg$2 = "°";
  var divide$2 = "÷";
  var Eacute$1 = "É";
  var eacute$1 = "é";
  var Ecirc$1 = "Ê";
  var ecirc$1 = "ê";
  var Egrave$1 = "È";
  var egrave$2 = "è";
  var ETH$2 = "Ð";
  var eth$2 = "ð";
  var Euml$1 = "Ë";
  var euml$1 = "ë";
  var frac12$1 = "½";
  var frac14$1 = "¼";
  var frac34$1 = "¾";
  var GT$2 = ">";
  var gt$2 = ">";
  var Iacute$1 = "Í";
  var iacute$1 = "í";
  var Icirc$1 = "Î";
  var icirc$1 = "î";
  var iexcl$1 = "¡";
  var Igrave$1 = "Ì";
  var igrave$1 = "ì";
  var iquest$1 = "¿";
  var Iuml$1 = "Ï";
  var iuml$1 = "ï";
  var laquo$1 = "«";
  var LT$2 = "<";
  var lt$2 = "<";
  var macr$1 = "¯";
  var micro$1 = "µ";
  var middot$1 = "·";
  var nbsp$1 = " ";
  var not$2 = "¬";
  var Ntilde$1 = "Ñ";
  var ntilde$1 = "ñ";
  var Oacute$1 = "Ó";
  var oacute$1 = "ó";
  var Ocirc$1 = "Ô";
  var ocirc$1 = "ô";
  var Ograve$1 = "Ò";
  var ograve$1 = "ò";
  var ordf$1 = "ª";
  var ordm$1 = "º";
  var Oslash$1 = "Ø";
  var oslash$1 = "ø";
  var Otilde$1 = "Õ";
  var otilde$1 = "õ";
  var Ouml$1 = "Ö";
  var ouml$1 = "ö";
  var para$2 = "¶";
  var plusmn$1 = "±";
  var pound$2 = "£";
  var QUOT$2 = "\"";
  var quot$2 = "\"";
  var raquo$1 = "»";
  var REG$2 = "®";
  var reg$2 = "®";
  var sect$2 = "§";
  var shy$2 = "­";
  var sup1$1 = "¹";
  var sup2$1 = "²";
  var sup3$1 = "³";
  var szlig$1 = "ß";
  var THORN$2 = "Þ";
  var thorn$2 = "þ";
  var times$2 = "×";
  var Uacute$1 = "Ú";
  var uacute$1 = "ú";
  var Ucirc$1 = "Û";
  var ucirc$1 = "û";
  var Ugrave$1 = "Ù";
  var ugrave$1 = "ù";
  var uml$2 = "¨";
  var Uuml$1 = "Ü";
  var uuml$1 = "ü";
  var Yacute$1 = "Ý";
  var yacute$1 = "ý";
  var yen$2 = "¥";
  var yuml$1 = "ÿ";
  var entities = {
  	"Aacute;": "Á",
  	Aacute: Aacute$1,
  	"aacute;": "á",
  	aacute: aacute$1,
  	"Abreve;": "Ă",
  	"abreve;": "ă",
  	"ac;": "∾",
  	"acd;": "∿",
  	"acE;": "∾̳",
  	"Acirc;": "Â",
  	Acirc: Acirc$1,
  	"acirc;": "â",
  	acirc: acirc$1,
  	"acute;": "´",
  	acute: acute$2,
  	"Acy;": "А",
  	"acy;": "а",
  	"AElig;": "Æ",
  	AElig: AElig$1,
  	"aelig;": "æ",
  	aelig: aelig$1,
  	"af;": "⁡",
  	"Afr;": "𝔄",
  	"afr;": "𝔞",
  	"Agrave;": "À",
  	Agrave: Agrave$1,
  	"agrave;": "à",
  	agrave: agrave$1,
  	"alefsym;": "ℵ",
  	"aleph;": "ℵ",
  	"Alpha;": "Α",
  	"alpha;": "α",
  	"Amacr;": "Ā",
  	"amacr;": "ā",
  	"amalg;": "⨿",
  	"AMP;": "&",
  	AMP: AMP$1,
  	"amp;": "&",
  	amp: amp$2,
  	"And;": "⩓",
  	"and;": "∧",
  	"andand;": "⩕",
  	"andd;": "⩜",
  	"andslope;": "⩘",
  	"andv;": "⩚",
  	"ang;": "∠",
  	"ange;": "⦤",
  	"angle;": "∠",
  	"angmsd;": "∡",
  	"angmsdaa;": "⦨",
  	"angmsdab;": "⦩",
  	"angmsdac;": "⦪",
  	"angmsdad;": "⦫",
  	"angmsdae;": "⦬",
  	"angmsdaf;": "⦭",
  	"angmsdag;": "⦮",
  	"angmsdah;": "⦯",
  	"angrt;": "∟",
  	"angrtvb;": "⊾",
  	"angrtvbd;": "⦝",
  	"angsph;": "∢",
  	"angst;": "Å",
  	"angzarr;": "⍼",
  	"Aogon;": "Ą",
  	"aogon;": "ą",
  	"Aopf;": "𝔸",
  	"aopf;": "𝕒",
  	"ap;": "≈",
  	"apacir;": "⩯",
  	"apE;": "⩰",
  	"ape;": "≊",
  	"apid;": "≋",
  	"apos;": "'",
  	"ApplyFunction;": "⁡",
  	"approx;": "≈",
  	"approxeq;": "≊",
  	"Aring;": "Å",
  	Aring: Aring$2,
  	"aring;": "å",
  	aring: aring$2,
  	"Ascr;": "𝒜",
  	"ascr;": "𝒶",
  	"Assign;": "≔",
  	"ast;": "*",
  	"asymp;": "≈",
  	"asympeq;": "≍",
  	"Atilde;": "Ã",
  	Atilde: Atilde$1,
  	"atilde;": "ã",
  	atilde: atilde$2,
  	"Auml;": "Ä",
  	Auml: Auml$1,
  	"auml;": "ä",
  	auml: auml$1,
  	"awconint;": "∳",
  	"awint;": "⨑",
  	"backcong;": "≌",
  	"backepsilon;": "϶",
  	"backprime;": "‵",
  	"backsim;": "∽",
  	"backsimeq;": "⋍",
  	"Backslash;": "∖",
  	"Barv;": "⫧",
  	"barvee;": "⊽",
  	"Barwed;": "⌆",
  	"barwed;": "⌅",
  	"barwedge;": "⌅",
  	"bbrk;": "⎵",
  	"bbrktbrk;": "⎶",
  	"bcong;": "≌",
  	"Bcy;": "Б",
  	"bcy;": "б",
  	"bdquo;": "„",
  	"becaus;": "∵",
  	"Because;": "∵",
  	"because;": "∵",
  	"bemptyv;": "⦰",
  	"bepsi;": "϶",
  	"bernou;": "ℬ",
  	"Bernoullis;": "ℬ",
  	"Beta;": "Β",
  	"beta;": "β",
  	"beth;": "ℶ",
  	"between;": "≬",
  	"Bfr;": "𝔅",
  	"bfr;": "𝔟",
  	"bigcap;": "⋂",
  	"bigcirc;": "◯",
  	"bigcup;": "⋃",
  	"bigodot;": "⨀",
  	"bigoplus;": "⨁",
  	"bigotimes;": "⨂",
  	"bigsqcup;": "⨆",
  	"bigstar;": "★",
  	"bigtriangledown;": "▽",
  	"bigtriangleup;": "△",
  	"biguplus;": "⨄",
  	"bigvee;": "⋁",
  	"bigwedge;": "⋀",
  	"bkarow;": "⤍",
  	"blacklozenge;": "⧫",
  	"blacksquare;": "▪",
  	"blacktriangle;": "▴",
  	"blacktriangledown;": "▾",
  	"blacktriangleleft;": "◂",
  	"blacktriangleright;": "▸",
  	"blank;": "␣",
  	"blk12;": "▒",
  	"blk14;": "░",
  	"blk34;": "▓",
  	"block;": "█",
  	"bne;": "=⃥",
  	"bnequiv;": "≡⃥",
  	"bNot;": "⫭",
  	"bnot;": "⌐",
  	"Bopf;": "𝔹",
  	"bopf;": "𝕓",
  	"bot;": "⊥",
  	"bottom;": "⊥",
  	"bowtie;": "⋈",
  	"boxbox;": "⧉",
  	"boxDL;": "╗",
  	"boxDl;": "╖",
  	"boxdL;": "╕",
  	"boxdl;": "┐",
  	"boxDR;": "╔",
  	"boxDr;": "╓",
  	"boxdR;": "╒",
  	"boxdr;": "┌",
  	"boxH;": "═",
  	"boxh;": "─",
  	"boxHD;": "╦",
  	"boxHd;": "╤",
  	"boxhD;": "╥",
  	"boxhd;": "┬",
  	"boxHU;": "╩",
  	"boxHu;": "╧",
  	"boxhU;": "╨",
  	"boxhu;": "┴",
  	"boxminus;": "⊟",
  	"boxplus;": "⊞",
  	"boxtimes;": "⊠",
  	"boxUL;": "╝",
  	"boxUl;": "╜",
  	"boxuL;": "╛",
  	"boxul;": "┘",
  	"boxUR;": "╚",
  	"boxUr;": "╙",
  	"boxuR;": "╘",
  	"boxur;": "└",
  	"boxV;": "║",
  	"boxv;": "│",
  	"boxVH;": "╬",
  	"boxVh;": "╫",
  	"boxvH;": "╪",
  	"boxvh;": "┼",
  	"boxVL;": "╣",
  	"boxVl;": "╢",
  	"boxvL;": "╡",
  	"boxvl;": "┤",
  	"boxVR;": "╠",
  	"boxVr;": "╟",
  	"boxvR;": "╞",
  	"boxvr;": "├",
  	"bprime;": "‵",
  	"Breve;": "˘",
  	"breve;": "˘",
  	"brvbar;": "¦",
  	brvbar: brvbar$1,
  	"Bscr;": "ℬ",
  	"bscr;": "𝒷",
  	"bsemi;": "⁏",
  	"bsim;": "∽",
  	"bsime;": "⋍",
  	"bsol;": "\\",
  	"bsolb;": "⧅",
  	"bsolhsub;": "⟈",
  	"bull;": "•",
  	"bullet;": "•",
  	"bump;": "≎",
  	"bumpE;": "⪮",
  	"bumpe;": "≏",
  	"Bumpeq;": "≎",
  	"bumpeq;": "≏",
  	"Cacute;": "Ć",
  	"cacute;": "ć",
  	"Cap;": "⋒",
  	"cap;": "∩",
  	"capand;": "⩄",
  	"capbrcup;": "⩉",
  	"capcap;": "⩋",
  	"capcup;": "⩇",
  	"capdot;": "⩀",
  	"CapitalDifferentialD;": "ⅅ",
  	"caps;": "∩︀",
  	"caret;": "⁁",
  	"caron;": "ˇ",
  	"Cayleys;": "ℭ",
  	"ccaps;": "⩍",
  	"Ccaron;": "Č",
  	"ccaron;": "č",
  	"Ccedil;": "Ç",
  	Ccedil: Ccedil$1,
  	"ccedil;": "ç",
  	ccedil: ccedil$1,
  	"Ccirc;": "Ĉ",
  	"ccirc;": "ĉ",
  	"Cconint;": "∰",
  	"ccups;": "⩌",
  	"ccupssm;": "⩐",
  	"Cdot;": "Ċ",
  	"cdot;": "ċ",
  	"cedil;": "¸",
  	cedil: cedil$2,
  	"Cedilla;": "¸",
  	"cemptyv;": "⦲",
  	"cent;": "¢",
  	cent: cent$2,
  	"CenterDot;": "·",
  	"centerdot;": "·",
  	"Cfr;": "ℭ",
  	"cfr;": "𝔠",
  	"CHcy;": "Ч",
  	"chcy;": "ч",
  	"check;": "✓",
  	"checkmark;": "✓",
  	"Chi;": "Χ",
  	"chi;": "χ",
  	"cir;": "○",
  	"circ;": "ˆ",
  	"circeq;": "≗",
  	"circlearrowleft;": "↺",
  	"circlearrowright;": "↻",
  	"circledast;": "⊛",
  	"circledcirc;": "⊚",
  	"circleddash;": "⊝",
  	"CircleDot;": "⊙",
  	"circledR;": "®",
  	"circledS;": "Ⓢ",
  	"CircleMinus;": "⊖",
  	"CirclePlus;": "⊕",
  	"CircleTimes;": "⊗",
  	"cirE;": "⧃",
  	"cire;": "≗",
  	"cirfnint;": "⨐",
  	"cirmid;": "⫯",
  	"cirscir;": "⧂",
  	"ClockwiseContourIntegral;": "∲",
  	"CloseCurlyDoubleQuote;": "”",
  	"CloseCurlyQuote;": "’",
  	"clubs;": "♣",
  	"clubsuit;": "♣",
  	"Colon;": "∷",
  	"colon;": ":",
  	"Colone;": "⩴",
  	"colone;": "≔",
  	"coloneq;": "≔",
  	"comma;": ",",
  	"commat;": "@",
  	"comp;": "∁",
  	"compfn;": "∘",
  	"complement;": "∁",
  	"complexes;": "ℂ",
  	"cong;": "≅",
  	"congdot;": "⩭",
  	"Congruent;": "≡",
  	"Conint;": "∯",
  	"conint;": "∮",
  	"ContourIntegral;": "∮",
  	"Copf;": "ℂ",
  	"copf;": "𝕔",
  	"coprod;": "∐",
  	"Coproduct;": "∐",
  	"COPY;": "©",
  	COPY: COPY$2,
  	"copy;": "©",
  	copy: copy$2,
  	"copysr;": "℗",
  	"CounterClockwiseContourIntegral;": "∳",
  	"crarr;": "↵",
  	"Cross;": "⨯",
  	"cross;": "✗",
  	"Cscr;": "𝒞",
  	"cscr;": "𝒸",
  	"csub;": "⫏",
  	"csube;": "⫑",
  	"csup;": "⫐",
  	"csupe;": "⫒",
  	"ctdot;": "⋯",
  	"cudarrl;": "⤸",
  	"cudarrr;": "⤵",
  	"cuepr;": "⋞",
  	"cuesc;": "⋟",
  	"cularr;": "↶",
  	"cularrp;": "⤽",
  	"Cup;": "⋓",
  	"cup;": "∪",
  	"cupbrcap;": "⩈",
  	"CupCap;": "≍",
  	"cupcap;": "⩆",
  	"cupcup;": "⩊",
  	"cupdot;": "⊍",
  	"cupor;": "⩅",
  	"cups;": "∪︀",
  	"curarr;": "↷",
  	"curarrm;": "⤼",
  	"curlyeqprec;": "⋞",
  	"curlyeqsucc;": "⋟",
  	"curlyvee;": "⋎",
  	"curlywedge;": "⋏",
  	"curren;": "¤",
  	curren: curren$1,
  	"curvearrowleft;": "↶",
  	"curvearrowright;": "↷",
  	"cuvee;": "⋎",
  	"cuwed;": "⋏",
  	"cwconint;": "∲",
  	"cwint;": "∱",
  	"cylcty;": "⌭",
  	"Dagger;": "‡",
  	"dagger;": "†",
  	"daleth;": "ℸ",
  	"Darr;": "↡",
  	"dArr;": "⇓",
  	"darr;": "↓",
  	"dash;": "‐",
  	"Dashv;": "⫤",
  	"dashv;": "⊣",
  	"dbkarow;": "⤏",
  	"dblac;": "˝",
  	"Dcaron;": "Ď",
  	"dcaron;": "ď",
  	"Dcy;": "Д",
  	"dcy;": "д",
  	"DD;": "ⅅ",
  	"dd;": "ⅆ",
  	"ddagger;": "‡",
  	"ddarr;": "⇊",
  	"DDotrahd;": "⤑",
  	"ddotseq;": "⩷",
  	"deg;": "°",
  	deg: deg$2,
  	"Del;": "∇",
  	"Delta;": "Δ",
  	"delta;": "δ",
  	"demptyv;": "⦱",
  	"dfisht;": "⥿",
  	"Dfr;": "𝔇",
  	"dfr;": "𝔡",
  	"dHar;": "⥥",
  	"dharl;": "⇃",
  	"dharr;": "⇂",
  	"DiacriticalAcute;": "´",
  	"DiacriticalDot;": "˙",
  	"DiacriticalDoubleAcute;": "˝",
  	"DiacriticalGrave;": "`",
  	"DiacriticalTilde;": "˜",
  	"diam;": "⋄",
  	"Diamond;": "⋄",
  	"diamond;": "⋄",
  	"diamondsuit;": "♦",
  	"diams;": "♦",
  	"die;": "¨",
  	"DifferentialD;": "ⅆ",
  	"digamma;": "ϝ",
  	"disin;": "⋲",
  	"div;": "÷",
  	"divide;": "÷",
  	divide: divide$2,
  	"divideontimes;": "⋇",
  	"divonx;": "⋇",
  	"DJcy;": "Ђ",
  	"djcy;": "ђ",
  	"dlcorn;": "⌞",
  	"dlcrop;": "⌍",
  	"dollar;": "$",
  	"Dopf;": "𝔻",
  	"dopf;": "𝕕",
  	"Dot;": "¨",
  	"dot;": "˙",
  	"DotDot;": "⃜",
  	"doteq;": "≐",
  	"doteqdot;": "≑",
  	"DotEqual;": "≐",
  	"dotminus;": "∸",
  	"dotplus;": "∔",
  	"dotsquare;": "⊡",
  	"doublebarwedge;": "⌆",
  	"DoubleContourIntegral;": "∯",
  	"DoubleDot;": "¨",
  	"DoubleDownArrow;": "⇓",
  	"DoubleLeftArrow;": "⇐",
  	"DoubleLeftRightArrow;": "⇔",
  	"DoubleLeftTee;": "⫤",
  	"DoubleLongLeftArrow;": "⟸",
  	"DoubleLongLeftRightArrow;": "⟺",
  	"DoubleLongRightArrow;": "⟹",
  	"DoubleRightArrow;": "⇒",
  	"DoubleRightTee;": "⊨",
  	"DoubleUpArrow;": "⇑",
  	"DoubleUpDownArrow;": "⇕",
  	"DoubleVerticalBar;": "∥",
  	"DownArrow;": "↓",
  	"Downarrow;": "⇓",
  	"downarrow;": "↓",
  	"DownArrowBar;": "⤓",
  	"DownArrowUpArrow;": "⇵",
  	"DownBreve;": "̑",
  	"downdownarrows;": "⇊",
  	"downharpoonleft;": "⇃",
  	"downharpoonright;": "⇂",
  	"DownLeftRightVector;": "⥐",
  	"DownLeftTeeVector;": "⥞",
  	"DownLeftVector;": "↽",
  	"DownLeftVectorBar;": "⥖",
  	"DownRightTeeVector;": "⥟",
  	"DownRightVector;": "⇁",
  	"DownRightVectorBar;": "⥗",
  	"DownTee;": "⊤",
  	"DownTeeArrow;": "↧",
  	"drbkarow;": "⤐",
  	"drcorn;": "⌟",
  	"drcrop;": "⌌",
  	"Dscr;": "𝒟",
  	"dscr;": "𝒹",
  	"DScy;": "Ѕ",
  	"dscy;": "ѕ",
  	"dsol;": "⧶",
  	"Dstrok;": "Đ",
  	"dstrok;": "đ",
  	"dtdot;": "⋱",
  	"dtri;": "▿",
  	"dtrif;": "▾",
  	"duarr;": "⇵",
  	"duhar;": "⥯",
  	"dwangle;": "⦦",
  	"DZcy;": "Џ",
  	"dzcy;": "џ",
  	"dzigrarr;": "⟿",
  	"Eacute;": "É",
  	Eacute: Eacute$1,
  	"eacute;": "é",
  	eacute: eacute$1,
  	"easter;": "⩮",
  	"Ecaron;": "Ě",
  	"ecaron;": "ě",
  	"ecir;": "≖",
  	"Ecirc;": "Ê",
  	Ecirc: Ecirc$1,
  	"ecirc;": "ê",
  	ecirc: ecirc$1,
  	"ecolon;": "≕",
  	"Ecy;": "Э",
  	"ecy;": "э",
  	"eDDot;": "⩷",
  	"Edot;": "Ė",
  	"eDot;": "≑",
  	"edot;": "ė",
  	"ee;": "ⅇ",
  	"efDot;": "≒",
  	"Efr;": "𝔈",
  	"efr;": "𝔢",
  	"eg;": "⪚",
  	"Egrave;": "È",
  	Egrave: Egrave$1,
  	"egrave;": "è",
  	egrave: egrave$2,
  	"egs;": "⪖",
  	"egsdot;": "⪘",
  	"el;": "⪙",
  	"Element;": "∈",
  	"elinters;": "⏧",
  	"ell;": "ℓ",
  	"els;": "⪕",
  	"elsdot;": "⪗",
  	"Emacr;": "Ē",
  	"emacr;": "ē",
  	"empty;": "∅",
  	"emptyset;": "∅",
  	"EmptySmallSquare;": "◻",
  	"emptyv;": "∅",
  	"EmptyVerySmallSquare;": "▫",
  	"emsp;": " ",
  	"emsp13;": " ",
  	"emsp14;": " ",
  	"ENG;": "Ŋ",
  	"eng;": "ŋ",
  	"ensp;": " ",
  	"Eogon;": "Ę",
  	"eogon;": "ę",
  	"Eopf;": "𝔼",
  	"eopf;": "𝕖",
  	"epar;": "⋕",
  	"eparsl;": "⧣",
  	"eplus;": "⩱",
  	"epsi;": "ε",
  	"Epsilon;": "Ε",
  	"epsilon;": "ε",
  	"epsiv;": "ϵ",
  	"eqcirc;": "≖",
  	"eqcolon;": "≕",
  	"eqsim;": "≂",
  	"eqslantgtr;": "⪖",
  	"eqslantless;": "⪕",
  	"Equal;": "⩵",
  	"equals;": "=",
  	"EqualTilde;": "≂",
  	"equest;": "≟",
  	"Equilibrium;": "⇌",
  	"equiv;": "≡",
  	"equivDD;": "⩸",
  	"eqvparsl;": "⧥",
  	"erarr;": "⥱",
  	"erDot;": "≓",
  	"Escr;": "ℰ",
  	"escr;": "ℯ",
  	"esdot;": "≐",
  	"Esim;": "⩳",
  	"esim;": "≂",
  	"Eta;": "Η",
  	"eta;": "η",
  	"ETH;": "Ð",
  	ETH: ETH$2,
  	"eth;": "ð",
  	eth: eth$2,
  	"Euml;": "Ë",
  	Euml: Euml$1,
  	"euml;": "ë",
  	euml: euml$1,
  	"euro;": "€",
  	"excl;": "!",
  	"exist;": "∃",
  	"Exists;": "∃",
  	"expectation;": "ℰ",
  	"ExponentialE;": "ⅇ",
  	"exponentiale;": "ⅇ",
  	"fallingdotseq;": "≒",
  	"Fcy;": "Ф",
  	"fcy;": "ф",
  	"female;": "♀",
  	"ffilig;": "ﬃ",
  	"fflig;": "ﬀ",
  	"ffllig;": "ﬄ",
  	"Ffr;": "𝔉",
  	"ffr;": "𝔣",
  	"filig;": "ﬁ",
  	"FilledSmallSquare;": "◼",
  	"FilledVerySmallSquare;": "▪",
  	"fjlig;": "fj",
  	"flat;": "♭",
  	"fllig;": "ﬂ",
  	"fltns;": "▱",
  	"fnof;": "ƒ",
  	"Fopf;": "𝔽",
  	"fopf;": "𝕗",
  	"ForAll;": "∀",
  	"forall;": "∀",
  	"fork;": "⋔",
  	"forkv;": "⫙",
  	"Fouriertrf;": "ℱ",
  	"fpartint;": "⨍",
  	"frac12;": "½",
  	frac12: frac12$1,
  	"frac13;": "⅓",
  	"frac14;": "¼",
  	frac14: frac14$1,
  	"frac15;": "⅕",
  	"frac16;": "⅙",
  	"frac18;": "⅛",
  	"frac23;": "⅔",
  	"frac25;": "⅖",
  	"frac34;": "¾",
  	frac34: frac34$1,
  	"frac35;": "⅗",
  	"frac38;": "⅜",
  	"frac45;": "⅘",
  	"frac56;": "⅚",
  	"frac58;": "⅝",
  	"frac78;": "⅞",
  	"frasl;": "⁄",
  	"frown;": "⌢",
  	"Fscr;": "ℱ",
  	"fscr;": "𝒻",
  	"gacute;": "ǵ",
  	"Gamma;": "Γ",
  	"gamma;": "γ",
  	"Gammad;": "Ϝ",
  	"gammad;": "ϝ",
  	"gap;": "⪆",
  	"Gbreve;": "Ğ",
  	"gbreve;": "ğ",
  	"Gcedil;": "Ģ",
  	"Gcirc;": "Ĝ",
  	"gcirc;": "ĝ",
  	"Gcy;": "Г",
  	"gcy;": "г",
  	"Gdot;": "Ġ",
  	"gdot;": "ġ",
  	"gE;": "≧",
  	"ge;": "≥",
  	"gEl;": "⪌",
  	"gel;": "⋛",
  	"geq;": "≥",
  	"geqq;": "≧",
  	"geqslant;": "⩾",
  	"ges;": "⩾",
  	"gescc;": "⪩",
  	"gesdot;": "⪀",
  	"gesdoto;": "⪂",
  	"gesdotol;": "⪄",
  	"gesl;": "⋛︀",
  	"gesles;": "⪔",
  	"Gfr;": "𝔊",
  	"gfr;": "𝔤",
  	"Gg;": "⋙",
  	"gg;": "≫",
  	"ggg;": "⋙",
  	"gimel;": "ℷ",
  	"GJcy;": "Ѓ",
  	"gjcy;": "ѓ",
  	"gl;": "≷",
  	"gla;": "⪥",
  	"glE;": "⪒",
  	"glj;": "⪤",
  	"gnap;": "⪊",
  	"gnapprox;": "⪊",
  	"gnE;": "≩",
  	"gne;": "⪈",
  	"gneq;": "⪈",
  	"gneqq;": "≩",
  	"gnsim;": "⋧",
  	"Gopf;": "𝔾",
  	"gopf;": "𝕘",
  	"grave;": "`",
  	"GreaterEqual;": "≥",
  	"GreaterEqualLess;": "⋛",
  	"GreaterFullEqual;": "≧",
  	"GreaterGreater;": "⪢",
  	"GreaterLess;": "≷",
  	"GreaterSlantEqual;": "⩾",
  	"GreaterTilde;": "≳",
  	"Gscr;": "𝒢",
  	"gscr;": "ℊ",
  	"gsim;": "≳",
  	"gsime;": "⪎",
  	"gsiml;": "⪐",
  	"GT;": ">",
  	GT: GT$2,
  	"Gt;": "≫",
  	"gt;": ">",
  	gt: gt$2,
  	"gtcc;": "⪧",
  	"gtcir;": "⩺",
  	"gtdot;": "⋗",
  	"gtlPar;": "⦕",
  	"gtquest;": "⩼",
  	"gtrapprox;": "⪆",
  	"gtrarr;": "⥸",
  	"gtrdot;": "⋗",
  	"gtreqless;": "⋛",
  	"gtreqqless;": "⪌",
  	"gtrless;": "≷",
  	"gtrsim;": "≳",
  	"gvertneqq;": "≩︀",
  	"gvnE;": "≩︀",
  	"Hacek;": "ˇ",
  	"hairsp;": " ",
  	"half;": "½",
  	"hamilt;": "ℋ",
  	"HARDcy;": "Ъ",
  	"hardcy;": "ъ",
  	"hArr;": "⇔",
  	"harr;": "↔",
  	"harrcir;": "⥈",
  	"harrw;": "↭",
  	"Hat;": "^",
  	"hbar;": "ℏ",
  	"Hcirc;": "Ĥ",
  	"hcirc;": "ĥ",
  	"hearts;": "♥",
  	"heartsuit;": "♥",
  	"hellip;": "…",
  	"hercon;": "⊹",
  	"Hfr;": "ℌ",
  	"hfr;": "𝔥",
  	"HilbertSpace;": "ℋ",
  	"hksearow;": "⤥",
  	"hkswarow;": "⤦",
  	"hoarr;": "⇿",
  	"homtht;": "∻",
  	"hookleftarrow;": "↩",
  	"hookrightarrow;": "↪",
  	"Hopf;": "ℍ",
  	"hopf;": "𝕙",
  	"horbar;": "―",
  	"HorizontalLine;": "─",
  	"Hscr;": "ℋ",
  	"hscr;": "𝒽",
  	"hslash;": "ℏ",
  	"Hstrok;": "Ħ",
  	"hstrok;": "ħ",
  	"HumpDownHump;": "≎",
  	"HumpEqual;": "≏",
  	"hybull;": "⁃",
  	"hyphen;": "‐",
  	"Iacute;": "Í",
  	Iacute: Iacute$1,
  	"iacute;": "í",
  	iacute: iacute$1,
  	"ic;": "⁣",
  	"Icirc;": "Î",
  	Icirc: Icirc$1,
  	"icirc;": "î",
  	icirc: icirc$1,
  	"Icy;": "И",
  	"icy;": "и",
  	"Idot;": "İ",
  	"IEcy;": "Е",
  	"iecy;": "е",
  	"iexcl;": "¡",
  	iexcl: iexcl$1,
  	"iff;": "⇔",
  	"Ifr;": "ℑ",
  	"ifr;": "𝔦",
  	"Igrave;": "Ì",
  	Igrave: Igrave$1,
  	"igrave;": "ì",
  	igrave: igrave$1,
  	"ii;": "ⅈ",
  	"iiiint;": "⨌",
  	"iiint;": "∭",
  	"iinfin;": "⧜",
  	"iiota;": "℩",
  	"IJlig;": "Ĳ",
  	"ijlig;": "ĳ",
  	"Im;": "ℑ",
  	"Imacr;": "Ī",
  	"imacr;": "ī",
  	"image;": "ℑ",
  	"ImaginaryI;": "ⅈ",
  	"imagline;": "ℐ",
  	"imagpart;": "ℑ",
  	"imath;": "ı",
  	"imof;": "⊷",
  	"imped;": "Ƶ",
  	"Implies;": "⇒",
  	"in;": "∈",
  	"incare;": "℅",
  	"infin;": "∞",
  	"infintie;": "⧝",
  	"inodot;": "ı",
  	"Int;": "∬",
  	"int;": "∫",
  	"intcal;": "⊺",
  	"integers;": "ℤ",
  	"Integral;": "∫",
  	"intercal;": "⊺",
  	"Intersection;": "⋂",
  	"intlarhk;": "⨗",
  	"intprod;": "⨼",
  	"InvisibleComma;": "⁣",
  	"InvisibleTimes;": "⁢",
  	"IOcy;": "Ё",
  	"iocy;": "ё",
  	"Iogon;": "Į",
  	"iogon;": "į",
  	"Iopf;": "𝕀",
  	"iopf;": "𝕚",
  	"Iota;": "Ι",
  	"iota;": "ι",
  	"iprod;": "⨼",
  	"iquest;": "¿",
  	iquest: iquest$1,
  	"Iscr;": "ℐ",
  	"iscr;": "𝒾",
  	"isin;": "∈",
  	"isindot;": "⋵",
  	"isinE;": "⋹",
  	"isins;": "⋴",
  	"isinsv;": "⋳",
  	"isinv;": "∈",
  	"it;": "⁢",
  	"Itilde;": "Ĩ",
  	"itilde;": "ĩ",
  	"Iukcy;": "І",
  	"iukcy;": "і",
  	"Iuml;": "Ï",
  	Iuml: Iuml$1,
  	"iuml;": "ï",
  	iuml: iuml$1,
  	"Jcirc;": "Ĵ",
  	"jcirc;": "ĵ",
  	"Jcy;": "Й",
  	"jcy;": "й",
  	"Jfr;": "𝔍",
  	"jfr;": "𝔧",
  	"jmath;": "ȷ",
  	"Jopf;": "𝕁",
  	"jopf;": "𝕛",
  	"Jscr;": "𝒥",
  	"jscr;": "𝒿",
  	"Jsercy;": "Ј",
  	"jsercy;": "ј",
  	"Jukcy;": "Є",
  	"jukcy;": "є",
  	"Kappa;": "Κ",
  	"kappa;": "κ",
  	"kappav;": "ϰ",
  	"Kcedil;": "Ķ",
  	"kcedil;": "ķ",
  	"Kcy;": "К",
  	"kcy;": "к",
  	"Kfr;": "𝔎",
  	"kfr;": "𝔨",
  	"kgreen;": "ĸ",
  	"KHcy;": "Х",
  	"khcy;": "х",
  	"KJcy;": "Ќ",
  	"kjcy;": "ќ",
  	"Kopf;": "𝕂",
  	"kopf;": "𝕜",
  	"Kscr;": "𝒦",
  	"kscr;": "𝓀",
  	"lAarr;": "⇚",
  	"Lacute;": "Ĺ",
  	"lacute;": "ĺ",
  	"laemptyv;": "⦴",
  	"lagran;": "ℒ",
  	"Lambda;": "Λ",
  	"lambda;": "λ",
  	"Lang;": "⟪",
  	"lang;": "⟨",
  	"langd;": "⦑",
  	"langle;": "⟨",
  	"lap;": "⪅",
  	"Laplacetrf;": "ℒ",
  	"laquo;": "«",
  	laquo: laquo$1,
  	"Larr;": "↞",
  	"lArr;": "⇐",
  	"larr;": "←",
  	"larrb;": "⇤",
  	"larrbfs;": "⤟",
  	"larrfs;": "⤝",
  	"larrhk;": "↩",
  	"larrlp;": "↫",
  	"larrpl;": "⤹",
  	"larrsim;": "⥳",
  	"larrtl;": "↢",
  	"lat;": "⪫",
  	"lAtail;": "⤛",
  	"latail;": "⤙",
  	"late;": "⪭",
  	"lates;": "⪭︀",
  	"lBarr;": "⤎",
  	"lbarr;": "⤌",
  	"lbbrk;": "❲",
  	"lbrace;": "{",
  	"lbrack;": "[",
  	"lbrke;": "⦋",
  	"lbrksld;": "⦏",
  	"lbrkslu;": "⦍",
  	"Lcaron;": "Ľ",
  	"lcaron;": "ľ",
  	"Lcedil;": "Ļ",
  	"lcedil;": "ļ",
  	"lceil;": "⌈",
  	"lcub;": "{",
  	"Lcy;": "Л",
  	"lcy;": "л",
  	"ldca;": "⤶",
  	"ldquo;": "“",
  	"ldquor;": "„",
  	"ldrdhar;": "⥧",
  	"ldrushar;": "⥋",
  	"ldsh;": "↲",
  	"lE;": "≦",
  	"le;": "≤",
  	"LeftAngleBracket;": "⟨",
  	"LeftArrow;": "←",
  	"Leftarrow;": "⇐",
  	"leftarrow;": "←",
  	"LeftArrowBar;": "⇤",
  	"LeftArrowRightArrow;": "⇆",
  	"leftarrowtail;": "↢",
  	"LeftCeiling;": "⌈",
  	"LeftDoubleBracket;": "⟦",
  	"LeftDownTeeVector;": "⥡",
  	"LeftDownVector;": "⇃",
  	"LeftDownVectorBar;": "⥙",
  	"LeftFloor;": "⌊",
  	"leftharpoondown;": "↽",
  	"leftharpoonup;": "↼",
  	"leftleftarrows;": "⇇",
  	"LeftRightArrow;": "↔",
  	"Leftrightarrow;": "⇔",
  	"leftrightarrow;": "↔",
  	"leftrightarrows;": "⇆",
  	"leftrightharpoons;": "⇋",
  	"leftrightsquigarrow;": "↭",
  	"LeftRightVector;": "⥎",
  	"LeftTee;": "⊣",
  	"LeftTeeArrow;": "↤",
  	"LeftTeeVector;": "⥚",
  	"leftthreetimes;": "⋋",
  	"LeftTriangle;": "⊲",
  	"LeftTriangleBar;": "⧏",
  	"LeftTriangleEqual;": "⊴",
  	"LeftUpDownVector;": "⥑",
  	"LeftUpTeeVector;": "⥠",
  	"LeftUpVector;": "↿",
  	"LeftUpVectorBar;": "⥘",
  	"LeftVector;": "↼",
  	"LeftVectorBar;": "⥒",
  	"lEg;": "⪋",
  	"leg;": "⋚",
  	"leq;": "≤",
  	"leqq;": "≦",
  	"leqslant;": "⩽",
  	"les;": "⩽",
  	"lescc;": "⪨",
  	"lesdot;": "⩿",
  	"lesdoto;": "⪁",
  	"lesdotor;": "⪃",
  	"lesg;": "⋚︀",
  	"lesges;": "⪓",
  	"lessapprox;": "⪅",
  	"lessdot;": "⋖",
  	"lesseqgtr;": "⋚",
  	"lesseqqgtr;": "⪋",
  	"LessEqualGreater;": "⋚",
  	"LessFullEqual;": "≦",
  	"LessGreater;": "≶",
  	"lessgtr;": "≶",
  	"LessLess;": "⪡",
  	"lesssim;": "≲",
  	"LessSlantEqual;": "⩽",
  	"LessTilde;": "≲",
  	"lfisht;": "⥼",
  	"lfloor;": "⌊",
  	"Lfr;": "𝔏",
  	"lfr;": "𝔩",
  	"lg;": "≶",
  	"lgE;": "⪑",
  	"lHar;": "⥢",
  	"lhard;": "↽",
  	"lharu;": "↼",
  	"lharul;": "⥪",
  	"lhblk;": "▄",
  	"LJcy;": "Љ",
  	"ljcy;": "љ",
  	"Ll;": "⋘",
  	"ll;": "≪",
  	"llarr;": "⇇",
  	"llcorner;": "⌞",
  	"Lleftarrow;": "⇚",
  	"llhard;": "⥫",
  	"lltri;": "◺",
  	"Lmidot;": "Ŀ",
  	"lmidot;": "ŀ",
  	"lmoust;": "⎰",
  	"lmoustache;": "⎰",
  	"lnap;": "⪉",
  	"lnapprox;": "⪉",
  	"lnE;": "≨",
  	"lne;": "⪇",
  	"lneq;": "⪇",
  	"lneqq;": "≨",
  	"lnsim;": "⋦",
  	"loang;": "⟬",
  	"loarr;": "⇽",
  	"lobrk;": "⟦",
  	"LongLeftArrow;": "⟵",
  	"Longleftarrow;": "⟸",
  	"longleftarrow;": "⟵",
  	"LongLeftRightArrow;": "⟷",
  	"Longleftrightarrow;": "⟺",
  	"longleftrightarrow;": "⟷",
  	"longmapsto;": "⟼",
  	"LongRightArrow;": "⟶",
  	"Longrightarrow;": "⟹",
  	"longrightarrow;": "⟶",
  	"looparrowleft;": "↫",
  	"looparrowright;": "↬",
  	"lopar;": "⦅",
  	"Lopf;": "𝕃",
  	"lopf;": "𝕝",
  	"loplus;": "⨭",
  	"lotimes;": "⨴",
  	"lowast;": "∗",
  	"lowbar;": "_",
  	"LowerLeftArrow;": "↙",
  	"LowerRightArrow;": "↘",
  	"loz;": "◊",
  	"lozenge;": "◊",
  	"lozf;": "⧫",
  	"lpar;": "(",
  	"lparlt;": "⦓",
  	"lrarr;": "⇆",
  	"lrcorner;": "⌟",
  	"lrhar;": "⇋",
  	"lrhard;": "⥭",
  	"lrm;": "‎",
  	"lrtri;": "⊿",
  	"lsaquo;": "‹",
  	"Lscr;": "ℒ",
  	"lscr;": "𝓁",
  	"Lsh;": "↰",
  	"lsh;": "↰",
  	"lsim;": "≲",
  	"lsime;": "⪍",
  	"lsimg;": "⪏",
  	"lsqb;": "[",
  	"lsquo;": "‘",
  	"lsquor;": "‚",
  	"Lstrok;": "Ł",
  	"lstrok;": "ł",
  	"LT;": "<",
  	LT: LT$2,
  	"Lt;": "≪",
  	"lt;": "<",
  	lt: lt$2,
  	"ltcc;": "⪦",
  	"ltcir;": "⩹",
  	"ltdot;": "⋖",
  	"lthree;": "⋋",
  	"ltimes;": "⋉",
  	"ltlarr;": "⥶",
  	"ltquest;": "⩻",
  	"ltri;": "◃",
  	"ltrie;": "⊴",
  	"ltrif;": "◂",
  	"ltrPar;": "⦖",
  	"lurdshar;": "⥊",
  	"luruhar;": "⥦",
  	"lvertneqq;": "≨︀",
  	"lvnE;": "≨︀",
  	"macr;": "¯",
  	macr: macr$1,
  	"male;": "♂",
  	"malt;": "✠",
  	"maltese;": "✠",
  	"Map;": "⤅",
  	"map;": "↦",
  	"mapsto;": "↦",
  	"mapstodown;": "↧",
  	"mapstoleft;": "↤",
  	"mapstoup;": "↥",
  	"marker;": "▮",
  	"mcomma;": "⨩",
  	"Mcy;": "М",
  	"mcy;": "м",
  	"mdash;": "—",
  	"mDDot;": "∺",
  	"measuredangle;": "∡",
  	"MediumSpace;": " ",
  	"Mellintrf;": "ℳ",
  	"Mfr;": "𝔐",
  	"mfr;": "𝔪",
  	"mho;": "℧",
  	"micro;": "µ",
  	micro: micro$1,
  	"mid;": "∣",
  	"midast;": "*",
  	"midcir;": "⫰",
  	"middot;": "·",
  	middot: middot$1,
  	"minus;": "−",
  	"minusb;": "⊟",
  	"minusd;": "∸",
  	"minusdu;": "⨪",
  	"MinusPlus;": "∓",
  	"mlcp;": "⫛",
  	"mldr;": "…",
  	"mnplus;": "∓",
  	"models;": "⊧",
  	"Mopf;": "𝕄",
  	"mopf;": "𝕞",
  	"mp;": "∓",
  	"Mscr;": "ℳ",
  	"mscr;": "𝓂",
  	"mstpos;": "∾",
  	"Mu;": "Μ",
  	"mu;": "μ",
  	"multimap;": "⊸",
  	"mumap;": "⊸",
  	"nabla;": "∇",
  	"Nacute;": "Ń",
  	"nacute;": "ń",
  	"nang;": "∠⃒",
  	"nap;": "≉",
  	"napE;": "⩰̸",
  	"napid;": "≋̸",
  	"napos;": "ŉ",
  	"napprox;": "≉",
  	"natur;": "♮",
  	"natural;": "♮",
  	"naturals;": "ℕ",
  	"nbsp;": " ",
  	nbsp: nbsp$1,
  	"nbump;": "≎̸",
  	"nbumpe;": "≏̸",
  	"ncap;": "⩃",
  	"Ncaron;": "Ň",
  	"ncaron;": "ň",
  	"Ncedil;": "Ņ",
  	"ncedil;": "ņ",
  	"ncong;": "≇",
  	"ncongdot;": "⩭̸",
  	"ncup;": "⩂",
  	"Ncy;": "Н",
  	"ncy;": "н",
  	"ndash;": "–",
  	"ne;": "≠",
  	"nearhk;": "⤤",
  	"neArr;": "⇗",
  	"nearr;": "↗",
  	"nearrow;": "↗",
  	"nedot;": "≐̸",
  	"NegativeMediumSpace;": "​",
  	"NegativeThickSpace;": "​",
  	"NegativeThinSpace;": "​",
  	"NegativeVeryThinSpace;": "​",
  	"nequiv;": "≢",
  	"nesear;": "⤨",
  	"nesim;": "≂̸",
  	"NestedGreaterGreater;": "≫",
  	"NestedLessLess;": "≪",
  	"NewLine;": "\n",
  	"nexist;": "∄",
  	"nexists;": "∄",
  	"Nfr;": "𝔑",
  	"nfr;": "𝔫",
  	"ngE;": "≧̸",
  	"nge;": "≱",
  	"ngeq;": "≱",
  	"ngeqq;": "≧̸",
  	"ngeqslant;": "⩾̸",
  	"nges;": "⩾̸",
  	"nGg;": "⋙̸",
  	"ngsim;": "≵",
  	"nGt;": "≫⃒",
  	"ngt;": "≯",
  	"ngtr;": "≯",
  	"nGtv;": "≫̸",
  	"nhArr;": "⇎",
  	"nharr;": "↮",
  	"nhpar;": "⫲",
  	"ni;": "∋",
  	"nis;": "⋼",
  	"nisd;": "⋺",
  	"niv;": "∋",
  	"NJcy;": "Њ",
  	"njcy;": "њ",
  	"nlArr;": "⇍",
  	"nlarr;": "↚",
  	"nldr;": "‥",
  	"nlE;": "≦̸",
  	"nle;": "≰",
  	"nLeftarrow;": "⇍",
  	"nleftarrow;": "↚",
  	"nLeftrightarrow;": "⇎",
  	"nleftrightarrow;": "↮",
  	"nleq;": "≰",
  	"nleqq;": "≦̸",
  	"nleqslant;": "⩽̸",
  	"nles;": "⩽̸",
  	"nless;": "≮",
  	"nLl;": "⋘̸",
  	"nlsim;": "≴",
  	"nLt;": "≪⃒",
  	"nlt;": "≮",
  	"nltri;": "⋪",
  	"nltrie;": "⋬",
  	"nLtv;": "≪̸",
  	"nmid;": "∤",
  	"NoBreak;": "⁠",
  	"NonBreakingSpace;": " ",
  	"Nopf;": "ℕ",
  	"nopf;": "𝕟",
  	"Not;": "⫬",
  	"not;": "¬",
  	not: not$2,
  	"NotCongruent;": "≢",
  	"NotCupCap;": "≭",
  	"NotDoubleVerticalBar;": "∦",
  	"NotElement;": "∉",
  	"NotEqual;": "≠",
  	"NotEqualTilde;": "≂̸",
  	"NotExists;": "∄",
  	"NotGreater;": "≯",
  	"NotGreaterEqual;": "≱",
  	"NotGreaterFullEqual;": "≧̸",
  	"NotGreaterGreater;": "≫̸",
  	"NotGreaterLess;": "≹",
  	"NotGreaterSlantEqual;": "⩾̸",
  	"NotGreaterTilde;": "≵",
  	"NotHumpDownHump;": "≎̸",
  	"NotHumpEqual;": "≏̸",
  	"notin;": "∉",
  	"notindot;": "⋵̸",
  	"notinE;": "⋹̸",
  	"notinva;": "∉",
  	"notinvb;": "⋷",
  	"notinvc;": "⋶",
  	"NotLeftTriangle;": "⋪",
  	"NotLeftTriangleBar;": "⧏̸",
  	"NotLeftTriangleEqual;": "⋬",
  	"NotLess;": "≮",
  	"NotLessEqual;": "≰",
  	"NotLessGreater;": "≸",
  	"NotLessLess;": "≪̸",
  	"NotLessSlantEqual;": "⩽̸",
  	"NotLessTilde;": "≴",
  	"NotNestedGreaterGreater;": "⪢̸",
  	"NotNestedLessLess;": "⪡̸",
  	"notni;": "∌",
  	"notniva;": "∌",
  	"notnivb;": "⋾",
  	"notnivc;": "⋽",
  	"NotPrecedes;": "⊀",
  	"NotPrecedesEqual;": "⪯̸",
  	"NotPrecedesSlantEqual;": "⋠",
  	"NotReverseElement;": "∌",
  	"NotRightTriangle;": "⋫",
  	"NotRightTriangleBar;": "⧐̸",
  	"NotRightTriangleEqual;": "⋭",
  	"NotSquareSubset;": "⊏̸",
  	"NotSquareSubsetEqual;": "⋢",
  	"NotSquareSuperset;": "⊐̸",
  	"NotSquareSupersetEqual;": "⋣",
  	"NotSubset;": "⊂⃒",
  	"NotSubsetEqual;": "⊈",
  	"NotSucceeds;": "⊁",
  	"NotSucceedsEqual;": "⪰̸",
  	"NotSucceedsSlantEqual;": "⋡",
  	"NotSucceedsTilde;": "≿̸",
  	"NotSuperset;": "⊃⃒",
  	"NotSupersetEqual;": "⊉",
  	"NotTilde;": "≁",
  	"NotTildeEqual;": "≄",
  	"NotTildeFullEqual;": "≇",
  	"NotTildeTilde;": "≉",
  	"NotVerticalBar;": "∤",
  	"npar;": "∦",
  	"nparallel;": "∦",
  	"nparsl;": "⫽⃥",
  	"npart;": "∂̸",
  	"npolint;": "⨔",
  	"npr;": "⊀",
  	"nprcue;": "⋠",
  	"npre;": "⪯̸",
  	"nprec;": "⊀",
  	"npreceq;": "⪯̸",
  	"nrArr;": "⇏",
  	"nrarr;": "↛",
  	"nrarrc;": "⤳̸",
  	"nrarrw;": "↝̸",
  	"nRightarrow;": "⇏",
  	"nrightarrow;": "↛",
  	"nrtri;": "⋫",
  	"nrtrie;": "⋭",
  	"nsc;": "⊁",
  	"nsccue;": "⋡",
  	"nsce;": "⪰̸",
  	"Nscr;": "𝒩",
  	"nscr;": "𝓃",
  	"nshortmid;": "∤",
  	"nshortparallel;": "∦",
  	"nsim;": "≁",
  	"nsime;": "≄",
  	"nsimeq;": "≄",
  	"nsmid;": "∤",
  	"nspar;": "∦",
  	"nsqsube;": "⋢",
  	"nsqsupe;": "⋣",
  	"nsub;": "⊄",
  	"nsubE;": "⫅̸",
  	"nsube;": "⊈",
  	"nsubset;": "⊂⃒",
  	"nsubseteq;": "⊈",
  	"nsubseteqq;": "⫅̸",
  	"nsucc;": "⊁",
  	"nsucceq;": "⪰̸",
  	"nsup;": "⊅",
  	"nsupE;": "⫆̸",
  	"nsupe;": "⊉",
  	"nsupset;": "⊃⃒",
  	"nsupseteq;": "⊉",
  	"nsupseteqq;": "⫆̸",
  	"ntgl;": "≹",
  	"Ntilde;": "Ñ",
  	Ntilde: Ntilde$1,
  	"ntilde;": "ñ",
  	ntilde: ntilde$1,
  	"ntlg;": "≸",
  	"ntriangleleft;": "⋪",
  	"ntrianglelefteq;": "⋬",
  	"ntriangleright;": "⋫",
  	"ntrianglerighteq;": "⋭",
  	"Nu;": "Ν",
  	"nu;": "ν",
  	"num;": "#",
  	"numero;": "№",
  	"numsp;": " ",
  	"nvap;": "≍⃒",
  	"nVDash;": "⊯",
  	"nVdash;": "⊮",
  	"nvDash;": "⊭",
  	"nvdash;": "⊬",
  	"nvge;": "≥⃒",
  	"nvgt;": ">⃒",
  	"nvHarr;": "⤄",
  	"nvinfin;": "⧞",
  	"nvlArr;": "⤂",
  	"nvle;": "≤⃒",
  	"nvlt;": "<⃒",
  	"nvltrie;": "⊴⃒",
  	"nvrArr;": "⤃",
  	"nvrtrie;": "⊵⃒",
  	"nvsim;": "∼⃒",
  	"nwarhk;": "⤣",
  	"nwArr;": "⇖",
  	"nwarr;": "↖",
  	"nwarrow;": "↖",
  	"nwnear;": "⤧",
  	"Oacute;": "Ó",
  	Oacute: Oacute$1,
  	"oacute;": "ó",
  	oacute: oacute$1,
  	"oast;": "⊛",
  	"ocir;": "⊚",
  	"Ocirc;": "Ô",
  	Ocirc: Ocirc$1,
  	"ocirc;": "ô",
  	ocirc: ocirc$1,
  	"Ocy;": "О",
  	"ocy;": "о",
  	"odash;": "⊝",
  	"Odblac;": "Ő",
  	"odblac;": "ő",
  	"odiv;": "⨸",
  	"odot;": "⊙",
  	"odsold;": "⦼",
  	"OElig;": "Œ",
  	"oelig;": "œ",
  	"ofcir;": "⦿",
  	"Ofr;": "𝔒",
  	"ofr;": "𝔬",
  	"ogon;": "˛",
  	"Ograve;": "Ò",
  	Ograve: Ograve$1,
  	"ograve;": "ò",
  	ograve: ograve$1,
  	"ogt;": "⧁",
  	"ohbar;": "⦵",
  	"ohm;": "Ω",
  	"oint;": "∮",
  	"olarr;": "↺",
  	"olcir;": "⦾",
  	"olcross;": "⦻",
  	"oline;": "‾",
  	"olt;": "⧀",
  	"Omacr;": "Ō",
  	"omacr;": "ō",
  	"Omega;": "Ω",
  	"omega;": "ω",
  	"Omicron;": "Ο",
  	"omicron;": "ο",
  	"omid;": "⦶",
  	"ominus;": "⊖",
  	"Oopf;": "𝕆",
  	"oopf;": "𝕠",
  	"opar;": "⦷",
  	"OpenCurlyDoubleQuote;": "“",
  	"OpenCurlyQuote;": "‘",
  	"operp;": "⦹",
  	"oplus;": "⊕",
  	"Or;": "⩔",
  	"or;": "∨",
  	"orarr;": "↻",
  	"ord;": "⩝",
  	"order;": "ℴ",
  	"orderof;": "ℴ",
  	"ordf;": "ª",
  	ordf: ordf$1,
  	"ordm;": "º",
  	ordm: ordm$1,
  	"origof;": "⊶",
  	"oror;": "⩖",
  	"orslope;": "⩗",
  	"orv;": "⩛",
  	"oS;": "Ⓢ",
  	"Oscr;": "𝒪",
  	"oscr;": "ℴ",
  	"Oslash;": "Ø",
  	Oslash: Oslash$1,
  	"oslash;": "ø",
  	oslash: oslash$1,
  	"osol;": "⊘",
  	"Otilde;": "Õ",
  	Otilde: Otilde$1,
  	"otilde;": "õ",
  	otilde: otilde$1,
  	"Otimes;": "⨷",
  	"otimes;": "⊗",
  	"otimesas;": "⨶",
  	"Ouml;": "Ö",
  	Ouml: Ouml$1,
  	"ouml;": "ö",
  	ouml: ouml$1,
  	"ovbar;": "⌽",
  	"OverBar;": "‾",
  	"OverBrace;": "⏞",
  	"OverBracket;": "⎴",
  	"OverParenthesis;": "⏜",
  	"par;": "∥",
  	"para;": "¶",
  	para: para$2,
  	"parallel;": "∥",
  	"parsim;": "⫳",
  	"parsl;": "⫽",
  	"part;": "∂",
  	"PartialD;": "∂",
  	"Pcy;": "П",
  	"pcy;": "п",
  	"percnt;": "%",
  	"period;": ".",
  	"permil;": "‰",
  	"perp;": "⊥",
  	"pertenk;": "‱",
  	"Pfr;": "𝔓",
  	"pfr;": "𝔭",
  	"Phi;": "Φ",
  	"phi;": "φ",
  	"phiv;": "ϕ",
  	"phmmat;": "ℳ",
  	"phone;": "☎",
  	"Pi;": "Π",
  	"pi;": "π",
  	"pitchfork;": "⋔",
  	"piv;": "ϖ",
  	"planck;": "ℏ",
  	"planckh;": "ℎ",
  	"plankv;": "ℏ",
  	"plus;": "+",
  	"plusacir;": "⨣",
  	"plusb;": "⊞",
  	"pluscir;": "⨢",
  	"plusdo;": "∔",
  	"plusdu;": "⨥",
  	"pluse;": "⩲",
  	"PlusMinus;": "±",
  	"plusmn;": "±",
  	plusmn: plusmn$1,
  	"plussim;": "⨦",
  	"plustwo;": "⨧",
  	"pm;": "±",
  	"Poincareplane;": "ℌ",
  	"pointint;": "⨕",
  	"Popf;": "ℙ",
  	"popf;": "𝕡",
  	"pound;": "£",
  	pound: pound$2,
  	"Pr;": "⪻",
  	"pr;": "≺",
  	"prap;": "⪷",
  	"prcue;": "≼",
  	"prE;": "⪳",
  	"pre;": "⪯",
  	"prec;": "≺",
  	"precapprox;": "⪷",
  	"preccurlyeq;": "≼",
  	"Precedes;": "≺",
  	"PrecedesEqual;": "⪯",
  	"PrecedesSlantEqual;": "≼",
  	"PrecedesTilde;": "≾",
  	"preceq;": "⪯",
  	"precnapprox;": "⪹",
  	"precneqq;": "⪵",
  	"precnsim;": "⋨",
  	"precsim;": "≾",
  	"Prime;": "″",
  	"prime;": "′",
  	"primes;": "ℙ",
  	"prnap;": "⪹",
  	"prnE;": "⪵",
  	"prnsim;": "⋨",
  	"prod;": "∏",
  	"Product;": "∏",
  	"profalar;": "⌮",
  	"profline;": "⌒",
  	"profsurf;": "⌓",
  	"prop;": "∝",
  	"Proportion;": "∷",
  	"Proportional;": "∝",
  	"propto;": "∝",
  	"prsim;": "≾",
  	"prurel;": "⊰",
  	"Pscr;": "𝒫",
  	"pscr;": "𝓅",
  	"Psi;": "Ψ",
  	"psi;": "ψ",
  	"puncsp;": " ",
  	"Qfr;": "𝔔",
  	"qfr;": "𝔮",
  	"qint;": "⨌",
  	"Qopf;": "ℚ",
  	"qopf;": "𝕢",
  	"qprime;": "⁗",
  	"Qscr;": "𝒬",
  	"qscr;": "𝓆",
  	"quaternions;": "ℍ",
  	"quatint;": "⨖",
  	"quest;": "?",
  	"questeq;": "≟",
  	"QUOT;": "\"",
  	QUOT: QUOT$2,
  	"quot;": "\"",
  	quot: quot$2,
  	"rAarr;": "⇛",
  	"race;": "∽̱",
  	"Racute;": "Ŕ",
  	"racute;": "ŕ",
  	"radic;": "√",
  	"raemptyv;": "⦳",
  	"Rang;": "⟫",
  	"rang;": "⟩",
  	"rangd;": "⦒",
  	"range;": "⦥",
  	"rangle;": "⟩",
  	"raquo;": "»",
  	raquo: raquo$1,
  	"Rarr;": "↠",
  	"rArr;": "⇒",
  	"rarr;": "→",
  	"rarrap;": "⥵",
  	"rarrb;": "⇥",
  	"rarrbfs;": "⤠",
  	"rarrc;": "⤳",
  	"rarrfs;": "⤞",
  	"rarrhk;": "↪",
  	"rarrlp;": "↬",
  	"rarrpl;": "⥅",
  	"rarrsim;": "⥴",
  	"Rarrtl;": "⤖",
  	"rarrtl;": "↣",
  	"rarrw;": "↝",
  	"rAtail;": "⤜",
  	"ratail;": "⤚",
  	"ratio;": "∶",
  	"rationals;": "ℚ",
  	"RBarr;": "⤐",
  	"rBarr;": "⤏",
  	"rbarr;": "⤍",
  	"rbbrk;": "❳",
  	"rbrace;": "}",
  	"rbrack;": "]",
  	"rbrke;": "⦌",
  	"rbrksld;": "⦎",
  	"rbrkslu;": "⦐",
  	"Rcaron;": "Ř",
  	"rcaron;": "ř",
  	"Rcedil;": "Ŗ",
  	"rcedil;": "ŗ",
  	"rceil;": "⌉",
  	"rcub;": "}",
  	"Rcy;": "Р",
  	"rcy;": "р",
  	"rdca;": "⤷",
  	"rdldhar;": "⥩",
  	"rdquo;": "”",
  	"rdquor;": "”",
  	"rdsh;": "↳",
  	"Re;": "ℜ",
  	"real;": "ℜ",
  	"realine;": "ℛ",
  	"realpart;": "ℜ",
  	"reals;": "ℝ",
  	"rect;": "▭",
  	"REG;": "®",
  	REG: REG$2,
  	"reg;": "®",
  	reg: reg$2,
  	"ReverseElement;": "∋",
  	"ReverseEquilibrium;": "⇋",
  	"ReverseUpEquilibrium;": "⥯",
  	"rfisht;": "⥽",
  	"rfloor;": "⌋",
  	"Rfr;": "ℜ",
  	"rfr;": "𝔯",
  	"rHar;": "⥤",
  	"rhard;": "⇁",
  	"rharu;": "⇀",
  	"rharul;": "⥬",
  	"Rho;": "Ρ",
  	"rho;": "ρ",
  	"rhov;": "ϱ",
  	"RightAngleBracket;": "⟩",
  	"RightArrow;": "→",
  	"Rightarrow;": "⇒",
  	"rightarrow;": "→",
  	"RightArrowBar;": "⇥",
  	"RightArrowLeftArrow;": "⇄",
  	"rightarrowtail;": "↣",
  	"RightCeiling;": "⌉",
  	"RightDoubleBracket;": "⟧",
  	"RightDownTeeVector;": "⥝",
  	"RightDownVector;": "⇂",
  	"RightDownVectorBar;": "⥕",
  	"RightFloor;": "⌋",
  	"rightharpoondown;": "⇁",
  	"rightharpoonup;": "⇀",
  	"rightleftarrows;": "⇄",
  	"rightleftharpoons;": "⇌",
  	"rightrightarrows;": "⇉",
  	"rightsquigarrow;": "↝",
  	"RightTee;": "⊢",
  	"RightTeeArrow;": "↦",
  	"RightTeeVector;": "⥛",
  	"rightthreetimes;": "⋌",
  	"RightTriangle;": "⊳",
  	"RightTriangleBar;": "⧐",
  	"RightTriangleEqual;": "⊵",
  	"RightUpDownVector;": "⥏",
  	"RightUpTeeVector;": "⥜",
  	"RightUpVector;": "↾",
  	"RightUpVectorBar;": "⥔",
  	"RightVector;": "⇀",
  	"RightVectorBar;": "⥓",
  	"ring;": "˚",
  	"risingdotseq;": "≓",
  	"rlarr;": "⇄",
  	"rlhar;": "⇌",
  	"rlm;": "‏",
  	"rmoust;": "⎱",
  	"rmoustache;": "⎱",
  	"rnmid;": "⫮",
  	"roang;": "⟭",
  	"roarr;": "⇾",
  	"robrk;": "⟧",
  	"ropar;": "⦆",
  	"Ropf;": "ℝ",
  	"ropf;": "𝕣",
  	"roplus;": "⨮",
  	"rotimes;": "⨵",
  	"RoundImplies;": "⥰",
  	"rpar;": ")",
  	"rpargt;": "⦔",
  	"rppolint;": "⨒",
  	"rrarr;": "⇉",
  	"Rrightarrow;": "⇛",
  	"rsaquo;": "›",
  	"Rscr;": "ℛ",
  	"rscr;": "𝓇",
  	"Rsh;": "↱",
  	"rsh;": "↱",
  	"rsqb;": "]",
  	"rsquo;": "’",
  	"rsquor;": "’",
  	"rthree;": "⋌",
  	"rtimes;": "⋊",
  	"rtri;": "▹",
  	"rtrie;": "⊵",
  	"rtrif;": "▸",
  	"rtriltri;": "⧎",
  	"RuleDelayed;": "⧴",
  	"ruluhar;": "⥨",
  	"rx;": "℞",
  	"Sacute;": "Ś",
  	"sacute;": "ś",
  	"sbquo;": "‚",
  	"Sc;": "⪼",
  	"sc;": "≻",
  	"scap;": "⪸",
  	"Scaron;": "Š",
  	"scaron;": "š",
  	"sccue;": "≽",
  	"scE;": "⪴",
  	"sce;": "⪰",
  	"Scedil;": "Ş",
  	"scedil;": "ş",
  	"Scirc;": "Ŝ",
  	"scirc;": "ŝ",
  	"scnap;": "⪺",
  	"scnE;": "⪶",
  	"scnsim;": "⋩",
  	"scpolint;": "⨓",
  	"scsim;": "≿",
  	"Scy;": "С",
  	"scy;": "с",
  	"sdot;": "⋅",
  	"sdotb;": "⊡",
  	"sdote;": "⩦",
  	"searhk;": "⤥",
  	"seArr;": "⇘",
  	"searr;": "↘",
  	"searrow;": "↘",
  	"sect;": "§",
  	sect: sect$2,
  	"semi;": ";",
  	"seswar;": "⤩",
  	"setminus;": "∖",
  	"setmn;": "∖",
  	"sext;": "✶",
  	"Sfr;": "𝔖",
  	"sfr;": "𝔰",
  	"sfrown;": "⌢",
  	"sharp;": "♯",
  	"SHCHcy;": "Щ",
  	"shchcy;": "щ",
  	"SHcy;": "Ш",
  	"shcy;": "ш",
  	"ShortDownArrow;": "↓",
  	"ShortLeftArrow;": "←",
  	"shortmid;": "∣",
  	"shortparallel;": "∥",
  	"ShortRightArrow;": "→",
  	"ShortUpArrow;": "↑",
  	"shy;": "­",
  	shy: shy$2,
  	"Sigma;": "Σ",
  	"sigma;": "σ",
  	"sigmaf;": "ς",
  	"sigmav;": "ς",
  	"sim;": "∼",
  	"simdot;": "⩪",
  	"sime;": "≃",
  	"simeq;": "≃",
  	"simg;": "⪞",
  	"simgE;": "⪠",
  	"siml;": "⪝",
  	"simlE;": "⪟",
  	"simne;": "≆",
  	"simplus;": "⨤",
  	"simrarr;": "⥲",
  	"slarr;": "←",
  	"SmallCircle;": "∘",
  	"smallsetminus;": "∖",
  	"smashp;": "⨳",
  	"smeparsl;": "⧤",
  	"smid;": "∣",
  	"smile;": "⌣",
  	"smt;": "⪪",
  	"smte;": "⪬",
  	"smtes;": "⪬︀",
  	"SOFTcy;": "Ь",
  	"softcy;": "ь",
  	"sol;": "/",
  	"solb;": "⧄",
  	"solbar;": "⌿",
  	"Sopf;": "𝕊",
  	"sopf;": "𝕤",
  	"spades;": "♠",
  	"spadesuit;": "♠",
  	"spar;": "∥",
  	"sqcap;": "⊓",
  	"sqcaps;": "⊓︀",
  	"sqcup;": "⊔",
  	"sqcups;": "⊔︀",
  	"Sqrt;": "√",
  	"sqsub;": "⊏",
  	"sqsube;": "⊑",
  	"sqsubset;": "⊏",
  	"sqsubseteq;": "⊑",
  	"sqsup;": "⊐",
  	"sqsupe;": "⊒",
  	"sqsupset;": "⊐",
  	"sqsupseteq;": "⊒",
  	"squ;": "□",
  	"Square;": "□",
  	"square;": "□",
  	"SquareIntersection;": "⊓",
  	"SquareSubset;": "⊏",
  	"SquareSubsetEqual;": "⊑",
  	"SquareSuperset;": "⊐",
  	"SquareSupersetEqual;": "⊒",
  	"SquareUnion;": "⊔",
  	"squarf;": "▪",
  	"squf;": "▪",
  	"srarr;": "→",
  	"Sscr;": "𝒮",
  	"sscr;": "𝓈",
  	"ssetmn;": "∖",
  	"ssmile;": "⌣",
  	"sstarf;": "⋆",
  	"Star;": "⋆",
  	"star;": "☆",
  	"starf;": "★",
  	"straightepsilon;": "ϵ",
  	"straightphi;": "ϕ",
  	"strns;": "¯",
  	"Sub;": "⋐",
  	"sub;": "⊂",
  	"subdot;": "⪽",
  	"subE;": "⫅",
  	"sube;": "⊆",
  	"subedot;": "⫃",
  	"submult;": "⫁",
  	"subnE;": "⫋",
  	"subne;": "⊊",
  	"subplus;": "⪿",
  	"subrarr;": "⥹",
  	"Subset;": "⋐",
  	"subset;": "⊂",
  	"subseteq;": "⊆",
  	"subseteqq;": "⫅",
  	"SubsetEqual;": "⊆",
  	"subsetneq;": "⊊",
  	"subsetneqq;": "⫋",
  	"subsim;": "⫇",
  	"subsub;": "⫕",
  	"subsup;": "⫓",
  	"succ;": "≻",
  	"succapprox;": "⪸",
  	"succcurlyeq;": "≽",
  	"Succeeds;": "≻",
  	"SucceedsEqual;": "⪰",
  	"SucceedsSlantEqual;": "≽",
  	"SucceedsTilde;": "≿",
  	"succeq;": "⪰",
  	"succnapprox;": "⪺",
  	"succneqq;": "⪶",
  	"succnsim;": "⋩",
  	"succsim;": "≿",
  	"SuchThat;": "∋",
  	"Sum;": "∑",
  	"sum;": "∑",
  	"sung;": "♪",
  	"Sup;": "⋑",
  	"sup;": "⊃",
  	"sup1;": "¹",
  	sup1: sup1$1,
  	"sup2;": "²",
  	sup2: sup2$1,
  	"sup3;": "³",
  	sup3: sup3$1,
  	"supdot;": "⪾",
  	"supdsub;": "⫘",
  	"supE;": "⫆",
  	"supe;": "⊇",
  	"supedot;": "⫄",
  	"Superset;": "⊃",
  	"SupersetEqual;": "⊇",
  	"suphsol;": "⟉",
  	"suphsub;": "⫗",
  	"suplarr;": "⥻",
  	"supmult;": "⫂",
  	"supnE;": "⫌",
  	"supne;": "⊋",
  	"supplus;": "⫀",
  	"Supset;": "⋑",
  	"supset;": "⊃",
  	"supseteq;": "⊇",
  	"supseteqq;": "⫆",
  	"supsetneq;": "⊋",
  	"supsetneqq;": "⫌",
  	"supsim;": "⫈",
  	"supsub;": "⫔",
  	"supsup;": "⫖",
  	"swarhk;": "⤦",
  	"swArr;": "⇙",
  	"swarr;": "↙",
  	"swarrow;": "↙",
  	"swnwar;": "⤪",
  	"szlig;": "ß",
  	szlig: szlig$1,
  	"Tab;": "\t",
  	"target;": "⌖",
  	"Tau;": "Τ",
  	"tau;": "τ",
  	"tbrk;": "⎴",
  	"Tcaron;": "Ť",
  	"tcaron;": "ť",
  	"Tcedil;": "Ţ",
  	"tcedil;": "ţ",
  	"Tcy;": "Т",
  	"tcy;": "т",
  	"tdot;": "⃛",
  	"telrec;": "⌕",
  	"Tfr;": "𝔗",
  	"tfr;": "𝔱",
  	"there4;": "∴",
  	"Therefore;": "∴",
  	"therefore;": "∴",
  	"Theta;": "Θ",
  	"theta;": "θ",
  	"thetasym;": "ϑ",
  	"thetav;": "ϑ",
  	"thickapprox;": "≈",
  	"thicksim;": "∼",
  	"ThickSpace;": "  ",
  	"thinsp;": " ",
  	"ThinSpace;": " ",
  	"thkap;": "≈",
  	"thksim;": "∼",
  	"THORN;": "Þ",
  	THORN: THORN$2,
  	"thorn;": "þ",
  	thorn: thorn$2,
  	"Tilde;": "∼",
  	"tilde;": "˜",
  	"TildeEqual;": "≃",
  	"TildeFullEqual;": "≅",
  	"TildeTilde;": "≈",
  	"times;": "×",
  	times: times$2,
  	"timesb;": "⊠",
  	"timesbar;": "⨱",
  	"timesd;": "⨰",
  	"tint;": "∭",
  	"toea;": "⤨",
  	"top;": "⊤",
  	"topbot;": "⌶",
  	"topcir;": "⫱",
  	"Topf;": "𝕋",
  	"topf;": "𝕥",
  	"topfork;": "⫚",
  	"tosa;": "⤩",
  	"tprime;": "‴",
  	"TRADE;": "™",
  	"trade;": "™",
  	"triangle;": "▵",
  	"triangledown;": "▿",
  	"triangleleft;": "◃",
  	"trianglelefteq;": "⊴",
  	"triangleq;": "≜",
  	"triangleright;": "▹",
  	"trianglerighteq;": "⊵",
  	"tridot;": "◬",
  	"trie;": "≜",
  	"triminus;": "⨺",
  	"TripleDot;": "⃛",
  	"triplus;": "⨹",
  	"trisb;": "⧍",
  	"tritime;": "⨻",
  	"trpezium;": "⏢",
  	"Tscr;": "𝒯",
  	"tscr;": "𝓉",
  	"TScy;": "Ц",
  	"tscy;": "ц",
  	"TSHcy;": "Ћ",
  	"tshcy;": "ћ",
  	"Tstrok;": "Ŧ",
  	"tstrok;": "ŧ",
  	"twixt;": "≬",
  	"twoheadleftarrow;": "↞",
  	"twoheadrightarrow;": "↠",
  	"Uacute;": "Ú",
  	Uacute: Uacute$1,
  	"uacute;": "ú",
  	uacute: uacute$1,
  	"Uarr;": "↟",
  	"uArr;": "⇑",
  	"uarr;": "↑",
  	"Uarrocir;": "⥉",
  	"Ubrcy;": "Ў",
  	"ubrcy;": "ў",
  	"Ubreve;": "Ŭ",
  	"ubreve;": "ŭ",
  	"Ucirc;": "Û",
  	Ucirc: Ucirc$1,
  	"ucirc;": "û",
  	ucirc: ucirc$1,
  	"Ucy;": "У",
  	"ucy;": "у",
  	"udarr;": "⇅",
  	"Udblac;": "Ű",
  	"udblac;": "ű",
  	"udhar;": "⥮",
  	"ufisht;": "⥾",
  	"Ufr;": "𝔘",
  	"ufr;": "𝔲",
  	"Ugrave;": "Ù",
  	Ugrave: Ugrave$1,
  	"ugrave;": "ù",
  	ugrave: ugrave$1,
  	"uHar;": "⥣",
  	"uharl;": "↿",
  	"uharr;": "↾",
  	"uhblk;": "▀",
  	"ulcorn;": "⌜",
  	"ulcorner;": "⌜",
  	"ulcrop;": "⌏",
  	"ultri;": "◸",
  	"Umacr;": "Ū",
  	"umacr;": "ū",
  	"uml;": "¨",
  	uml: uml$2,
  	"UnderBar;": "_",
  	"UnderBrace;": "⏟",
  	"UnderBracket;": "⎵",
  	"UnderParenthesis;": "⏝",
  	"Union;": "⋃",
  	"UnionPlus;": "⊎",
  	"Uogon;": "Ų",
  	"uogon;": "ų",
  	"Uopf;": "𝕌",
  	"uopf;": "𝕦",
  	"UpArrow;": "↑",
  	"Uparrow;": "⇑",
  	"uparrow;": "↑",
  	"UpArrowBar;": "⤒",
  	"UpArrowDownArrow;": "⇅",
  	"UpDownArrow;": "↕",
  	"Updownarrow;": "⇕",
  	"updownarrow;": "↕",
  	"UpEquilibrium;": "⥮",
  	"upharpoonleft;": "↿",
  	"upharpoonright;": "↾",
  	"uplus;": "⊎",
  	"UpperLeftArrow;": "↖",
  	"UpperRightArrow;": "↗",
  	"Upsi;": "ϒ",
  	"upsi;": "υ",
  	"upsih;": "ϒ",
  	"Upsilon;": "Υ",
  	"upsilon;": "υ",
  	"UpTee;": "⊥",
  	"UpTeeArrow;": "↥",
  	"upuparrows;": "⇈",
  	"urcorn;": "⌝",
  	"urcorner;": "⌝",
  	"urcrop;": "⌎",
  	"Uring;": "Ů",
  	"uring;": "ů",
  	"urtri;": "◹",
  	"Uscr;": "𝒰",
  	"uscr;": "𝓊",
  	"utdot;": "⋰",
  	"Utilde;": "Ũ",
  	"utilde;": "ũ",
  	"utri;": "▵",
  	"utrif;": "▴",
  	"uuarr;": "⇈",
  	"Uuml;": "Ü",
  	Uuml: Uuml$1,
  	"uuml;": "ü",
  	uuml: uuml$1,
  	"uwangle;": "⦧",
  	"vangrt;": "⦜",
  	"varepsilon;": "ϵ",
  	"varkappa;": "ϰ",
  	"varnothing;": "∅",
  	"varphi;": "ϕ",
  	"varpi;": "ϖ",
  	"varpropto;": "∝",
  	"vArr;": "⇕",
  	"varr;": "↕",
  	"varrho;": "ϱ",
  	"varsigma;": "ς",
  	"varsubsetneq;": "⊊︀",
  	"varsubsetneqq;": "⫋︀",
  	"varsupsetneq;": "⊋︀",
  	"varsupsetneqq;": "⫌︀",
  	"vartheta;": "ϑ",
  	"vartriangleleft;": "⊲",
  	"vartriangleright;": "⊳",
  	"Vbar;": "⫫",
  	"vBar;": "⫨",
  	"vBarv;": "⫩",
  	"Vcy;": "В",
  	"vcy;": "в",
  	"VDash;": "⊫",
  	"Vdash;": "⊩",
  	"vDash;": "⊨",
  	"vdash;": "⊢",
  	"Vdashl;": "⫦",
  	"Vee;": "⋁",
  	"vee;": "∨",
  	"veebar;": "⊻",
  	"veeeq;": "≚",
  	"vellip;": "⋮",
  	"Verbar;": "‖",
  	"verbar;": "|",
  	"Vert;": "‖",
  	"vert;": "|",
  	"VerticalBar;": "∣",
  	"VerticalLine;": "|",
  	"VerticalSeparator;": "❘",
  	"VerticalTilde;": "≀",
  	"VeryThinSpace;": " ",
  	"Vfr;": "𝔙",
  	"vfr;": "𝔳",
  	"vltri;": "⊲",
  	"vnsub;": "⊂⃒",
  	"vnsup;": "⊃⃒",
  	"Vopf;": "𝕍",
  	"vopf;": "𝕧",
  	"vprop;": "∝",
  	"vrtri;": "⊳",
  	"Vscr;": "𝒱",
  	"vscr;": "𝓋",
  	"vsubnE;": "⫋︀",
  	"vsubne;": "⊊︀",
  	"vsupnE;": "⫌︀",
  	"vsupne;": "⊋︀",
  	"Vvdash;": "⊪",
  	"vzigzag;": "⦚",
  	"Wcirc;": "Ŵ",
  	"wcirc;": "ŵ",
  	"wedbar;": "⩟",
  	"Wedge;": "⋀",
  	"wedge;": "∧",
  	"wedgeq;": "≙",
  	"weierp;": "℘",
  	"Wfr;": "𝔚",
  	"wfr;": "𝔴",
  	"Wopf;": "𝕎",
  	"wopf;": "𝕨",
  	"wp;": "℘",
  	"wr;": "≀",
  	"wreath;": "≀",
  	"Wscr;": "𝒲",
  	"wscr;": "𝓌",
  	"xcap;": "⋂",
  	"xcirc;": "◯",
  	"xcup;": "⋃",
  	"xdtri;": "▽",
  	"Xfr;": "𝔛",
  	"xfr;": "𝔵",
  	"xhArr;": "⟺",
  	"xharr;": "⟷",
  	"Xi;": "Ξ",
  	"xi;": "ξ",
  	"xlArr;": "⟸",
  	"xlarr;": "⟵",
  	"xmap;": "⟼",
  	"xnis;": "⋻",
  	"xodot;": "⨀",
  	"Xopf;": "𝕏",
  	"xopf;": "𝕩",
  	"xoplus;": "⨁",
  	"xotime;": "⨂",
  	"xrArr;": "⟹",
  	"xrarr;": "⟶",
  	"Xscr;": "𝒳",
  	"xscr;": "𝓍",
  	"xsqcup;": "⨆",
  	"xuplus;": "⨄",
  	"xutri;": "△",
  	"xvee;": "⋁",
  	"xwedge;": "⋀",
  	"Yacute;": "Ý",
  	Yacute: Yacute$1,
  	"yacute;": "ý",
  	yacute: yacute$1,
  	"YAcy;": "Я",
  	"yacy;": "я",
  	"Ycirc;": "Ŷ",
  	"ycirc;": "ŷ",
  	"Ycy;": "Ы",
  	"ycy;": "ы",
  	"yen;": "¥",
  	yen: yen$2,
  	"Yfr;": "𝔜",
  	"yfr;": "𝔶",
  	"YIcy;": "Ї",
  	"yicy;": "ї",
  	"Yopf;": "𝕐",
  	"yopf;": "𝕪",
  	"Yscr;": "𝒴",
  	"yscr;": "𝓎",
  	"YUcy;": "Ю",
  	"yucy;": "ю",
  	"Yuml;": "Ÿ",
  	"yuml;": "ÿ",
  	yuml: yuml$1,
  	"Zacute;": "Ź",
  	"zacute;": "ź",
  	"Zcaron;": "Ž",
  	"zcaron;": "ž",
  	"Zcy;": "З",
  	"zcy;": "з",
  	"Zdot;": "Ż",
  	"zdot;": "ż",
  	"zeetrf;": "ℨ",
  	"ZeroWidthSpace;": "​",
  	"Zeta;": "Ζ",
  	"zeta;": "ζ",
  	"Zfr;": "ℨ",
  	"zfr;": "𝔷",
  	"ZHcy;": "Ж",
  	"zhcy;": "ж",
  	"zigrarr;": "⇝",
  	"Zopf;": "ℤ",
  	"zopf;": "𝕫",
  	"Zscr;": "𝒵",
  	"zscr;": "𝓏",
  	"zwj;": "‍",
  	"zwnj;": "‌"
  };

  var decode_1 = decode$2;

  function decode$2(str) {
    if (typeof str !== 'string') {
      throw new TypeError('Expected a String');
    }

    return str.replace(/&(#?[^;\W]+;?)/g, function (_, match) {
      var m;

      if (m = /^#(\d+);?$/.exec(match)) {
        return punycode$1.ucs2.encode([parseInt(m[1], 10)]);
      } else if (m = /^#[Xx]([A-Fa-f0-9]+);?/.exec(match)) {
        return punycode$1.ucs2.encode([parseInt(m[1], 16)]);
      } else {
        // named entity
        var hasSemi = /;$/.test(match);
        var withoutSemi = hasSemi ? match.replace(/;$/, '') : match;
        var target = entities[withoutSemi] || hasSemi && entities[match];

        if (typeof target === 'number') {
          return punycode$1.ucs2.encode([target]);
        } else if (typeof target === 'string') {
          return target;
        } else {
          return '&' + match;
        }
      }
    });
  }

  var encode$2 = encode_1;
  var decode$3 = decode_1;
  var ent = {
    encode: encode$2,
    decode: decode$3
  };

  function characterSuitableForNames(char) {
    return /[-_A-Za-z0-9]/.test(char);
  }

  function prepHopefullyAnArray(something, name) {
    if (!something) {
      return [];
    }

    if (Array.isArray(something)) {
      return something.filter(function (val) {
        return typeof val === "string" && val.trim();
      });
    }

    if (typeof something === "string") {
      return something.trim() ? [something] : [];
    }

    throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_03] ".concat(name, " must be array containing zero or more strings or something falsey. Currently it's equal to: ").concat(something, ", that a type of ").concat(_typeof(something), "."));
  }

  function stripHtml(str, originalOpts) {
    var definitelyTagNames = new Set(["!doctype", "abbr", "address", "area", "article", "aside", "audio", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "doctype", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "param", "picture", "pre", "progress", "rb", "rp", "rt", "rtc", "ruby", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "ul", "var", "video", "wbr", "xml"]);
    var singleLetterTags = new Set(["a", "b", "i", "p", "q", "s", "u"]);
    var punctuation = new Set([".", ",", "?", ";", ")", "\u2026", '"', "\xBB"]);
    var stripTogetherWithTheirContentsDefaults = new Set(["script", "style", "xml"]);
    var tag = {
      attributes: []
    };
    var chunkOfWhitespaceStartsAt = null;
    var chunkOfSpacesStartsAt = null;
    var rangedOpeningTags = [];
    var attrObj = {};
    var hrefDump = {};
    var stringToInsertAfter = "";
    var hrefInsertionActive;
    var spacesChunkWhichFollowsTheClosingBracketEndsAt = null;

    function existy(x) {
      return x != null;
    }

    function isStr(something) {
      return typeof something === "string";
    }

    function treatRangedTags(i, opts, rangesToDelete) {
      if (Array.isArray(opts.stripTogetherWithTheirContents) && opts.stripTogetherWithTheirContents.includes(tag.name)) {
        if (Array.isArray(rangedOpeningTags) && rangedOpeningTags.some(function (obj) {
          return obj.name === tag.name && obj.lastClosingBracketAt < i;
        })) {
          for (var y = rangedOpeningTags.length; y--;) {
            if (rangedOpeningTags[y].name === tag.name) {
              if (punctuation.has(str[i])) {
                opts.cb({
                  tag: tag,
                  deleteFrom: rangedOpeningTags[y].lastOpeningBracketAt,
                  deleteTo: i,
                  insert: null,
                  rangesArr: rangesToDelete,
                  proposedReturn: [rangedOpeningTags[y].lastOpeningBracketAt, i, null]
                });
              } else {
                opts.cb({
                  tag: tag,
                  deleteFrom: rangedOpeningTags[y].lastOpeningBracketAt,
                  deleteTo: i,
                  insert: "",
                  rangesArr: rangesToDelete,
                  proposedReturn: [rangedOpeningTags[y].lastOpeningBracketAt, i, ""]
                });
              }

              rangedOpeningTags.splice(y, 1);
              break;
            }
          }
        } else {
          rangedOpeningTags.push(tag);
        }
      }
    }

    function calculateWhitespaceToInsert(str2, currCharIdx, fromIdx, toIdx, lastOpeningBracketAt, lastClosingBracketAt) {
      var strToEvaluateForLineBreaks = "";

      if (fromIdx < lastOpeningBracketAt) {
        strToEvaluateForLineBreaks += str2.slice(fromIdx, lastOpeningBracketAt);
      }

      if (toIdx > lastClosingBracketAt + 1) {
        var temp = str2.slice(lastClosingBracketAt + 1, toIdx);

        if (temp.includes("\n") && str2[toIdx] === "<") {
          strToEvaluateForLineBreaks += " ";
        } else {
          strToEvaluateForLineBreaks += temp;
        }
      }

      if (!punctuation.has(str2[currCharIdx]) && str2[currCharIdx] !== "!") {
        var foundLineBreaks = strToEvaluateForLineBreaks.match(/\n/g);

        if (Array.isArray(foundLineBreaks) && foundLineBreaks.length) {
          if (foundLineBreaks.length === 1) {
            return "\n";
          }

          if (foundLineBreaks.length === 2) {
            return "\n\n";
          }

          return "\n\n\n";
        }

        return " ";
      }

      return "";
    }

    function calculateHrefToBeInserted(opts) {
      if (opts.dumpLinkHrefsNearby.enabled && Object.keys(hrefDump).length && hrefDump.tagName === tag.name && tag.lastOpeningBracketAt && (hrefDump.openingTagEnds && tag.lastOpeningBracketAt > hrefDump.openingTagEnds || !hrefDump.openingTagEnds)) {
        hrefInsertionActive = true;
      }

      if (hrefInsertionActive) {
        var lineBreaks = opts.dumpLinkHrefsNearby.putOnNewLine ? "\n\n" : "";
        stringToInsertAfter = "".concat(lineBreaks).concat(hrefDump.hrefValue).concat(lineBreaks);
      }
    }

    if (typeof str !== "string") {
      throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_01] Input must be string! Currently it's: ".concat(_typeof(str).toLowerCase(), ", equal to:\n").concat(JSON.stringify(str, null, 4)));
    }

    if (originalOpts && !lodash_isplainobject(originalOpts)) {
      throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_02] Optional Options Object must be a plain object! Currently it's: ".concat(_typeof(originalOpts).toLowerCase(), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4)));
    }

    function resetHrefMarkers() {
      if (hrefInsertionActive) {
        hrefDump = {};
        hrefInsertionActive = false;
      }
    }

    var defaults = {
      ignoreTags: [],
      onlyStripTags: [],
      stripTogetherWithTheirContents: _toConsumableArray(stripTogetherWithTheirContentsDefaults),
      skipHtmlDecoding: false,
      returnRangesOnly: false,
      returnTagLocations: false,
      trimOnlySpaces: false,
      dumpLinkHrefsNearby: {
        enabled: false,
        putOnNewLine: false,
        wrapHeads: "",
        wrapTails: ""
      },
      cb: null
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

    opts.ignoreTags = prepHopefullyAnArray(opts.ignoreTags, "opts.ignoreTags");
    opts.onlyStripTags = prepHopefullyAnArray(opts.onlyStripTags, "opts.onlyStripTags");
    var onlyStripTagsMode = !!opts.onlyStripTags.length;

    if (opts.onlyStripTags.length && opts.ignoreTags.length) {
      opts.onlyStripTags = lodash_without.apply(void 0, [opts.onlyStripTags].concat(_toConsumableArray(opts.ignoreTags)));
    }

    if (!lodash_isplainobject(opts.dumpLinkHrefsNearby)) {
      opts.dumpLinkHrefsNearby = _objectSpread2({}, defaults.dumpLinkHrefsNearby);
    }

    opts.dumpLinkHrefsNearby = defaults.dumpLinkHrefsNearby;

    if (lodash_isplainobject(originalOpts) && Object.prototype.hasOwnProperty.call(originalOpts, "dumpLinkHrefsNearby") && existy(originalOpts.dumpLinkHrefsNearby)) {
      /* istanbul ignore else */
      if (lodash_isplainobject(originalOpts.dumpLinkHrefsNearby)) {
        opts.dumpLinkHrefsNearby = _objectSpread2(_objectSpread2({}, defaults.dumpLinkHrefsNearby), originalOpts.dumpLinkHrefsNearby);
      } else if (originalOpts.dumpLinkHrefsNearby) {
        throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_04] Optional Options Object's key dumpLinkHrefsNearby was set to ".concat(_typeof(originalOpts.dumpLinkHrefsNearby), ", equal to ").concat(JSON.stringify(originalOpts.dumpLinkHrefsNearby, null, 4), ". The only allowed value is a plain object. See the API reference."));
      }
    }

    if (!opts.stripTogetherWithTheirContents) {
      opts.stripTogetherWithTheirContents = [];
    } else if (typeof opts.stripTogetherWithTheirContents === "string" && opts.stripTogetherWithTheirContents.length > 0) {
      opts.stripTogetherWithTheirContents = [opts.stripTogetherWithTheirContents];
    }

    var somethingCaught = {};

    if (opts.stripTogetherWithTheirContents && Array.isArray(opts.stripTogetherWithTheirContents) && opts.stripTogetherWithTheirContents.length && !opts.stripTogetherWithTheirContents.every(function (el, i) {
      if (!(typeof el === "string")) {
        somethingCaught.el = el;
        somethingCaught.i = i;
        return false;
      }

      return true;
    })) {
      throw new TypeError("string-strip-html/stripHtml(): [THROW_ID_06] Optional Options Object's key stripTogetherWithTheirContents was set to contain not just string elements! For example, element at index ".concat(somethingCaught.i, " has a value ").concat(somethingCaught.el, " which is not string but ").concat(_typeof(somethingCaught.el).toLowerCase(), "."));
    }

    if (!opts.cb) {
      opts.cb = function (_ref) {
        var rangesArr = _ref.rangesArr,
            proposedReturn = _ref.proposedReturn;
        rangesArr.push.apply(rangesArr, _toConsumableArray(proposedReturn));
      };
    }

    var rangesToDelete = new Ranges({
      limitToBeAddedWhitespace: true,
      limitLinebreaksCount: 2
    });

    if (!opts.skipHtmlDecoding) {
      while (str !== ent.decode(str)) {
        str = ent.decode(str);
      }
    }

    if (!str.length) {
      if (opts.returnRangesOnly) {
        return null;
      }

      if (opts.returnTagLocations) {
        return [];
      }

      return "";
    }

    if (opts.returnTagLocations && !str.trim()) {
      return [];
    }

    for (var i = 0, len = str.length; i < len; i++) {
      if (Object.keys(tag).length > 1 && tag.lastClosingBracketAt && tag.lastClosingBracketAt < i && str[i] !== " " && spacesChunkWhichFollowsTheClosingBracketEndsAt === null) {
        spacesChunkWhichFollowsTheClosingBracketEndsAt = i;
      }

      if (str[i] === ">") {
        if ((!tag || Object.keys(tag).length < 2) && i > 1) {
          for (var y = i; y--;) {
            if (str[y - 1] === undefined || str[y] === ">") {
              var _ret = function () {
                var startingPoint = str[y - 1] === undefined ? y : y + 1;
                var culprit = str.slice(startingPoint, i + 1);

                if (str !== "<".concat(lodash_trim(culprit.trim(), "/>"), ">") && _toConsumableArray(definitelyTagNames).some(function (val) {
                  return lodash_trim(culprit.trim().split(" ").filter(function (val2) {
                    return val2.trim();
                  }).filter(function (val3, i3) {
                    return i3 === 0;
                  }), "/>").toLowerCase() === val;
                }) && stripHtml("<".concat(culprit.trim(), ">"), opts) === "") {
                  var whiteSpaceCompensation = calculateWhitespaceToInsert(str, i, startingPoint, i + 1, startingPoint, i + 1);
                  var deleteUpTo = i + 1;

                  if (str[deleteUpTo] && !str[deleteUpTo].trim()) {
                    for (var z = deleteUpTo; z < len; z++) {
                      if (str[z].trim()) {
                        deleteUpTo = z;
                        break;
                      }
                    }
                  }

                  opts.cb({
                    tag: tag,
                    deleteFrom: startingPoint,
                    deleteTo: deleteUpTo,
                    insert: whiteSpaceCompensation,
                    rangesArr: rangesToDelete,
                    proposedReturn: [startingPoint, deleteUpTo, whiteSpaceCompensation]
                  });
                }

                return "break";
              }();

              if (_ret === "break") break;
            }
          }
        }
      }

      if (str[i] === "/" && !(tag.quotes && tag.quotes.value) && Number.isInteger(tag.lastOpeningBracketAt) && !Number.isInteger(tag.lastClosingBracketAt)) {
        tag.slashPresent = i;
      }

      if (str[i] === '"' || str[i] === "'") {
        if (tag.nameStarts && tag.quotes && tag.quotes.value && tag.quotes.value === str[i]) {
          attrObj.valueEnds = i;
          attrObj.value = str.slice(attrObj.valueStarts, i);
          tag.attributes.push(attrObj);
          attrObj = {};
          tag.quotes = undefined;
          var hrefVal = void 0;

          if (opts.dumpLinkHrefsNearby.enabled && tag.attributes.some(function (obj) {
            if (obj.name && obj.name.toLowerCase() === "href") {
              hrefVal = "".concat(opts.dumpLinkHrefsNearby.wrapHeads || "").concat(obj.value).concat(opts.dumpLinkHrefsNearby.wrapTails || "");
              return true;
            }
          })) {
            hrefDump = {
              tagName: tag.name,
              hrefValue: hrefVal
            };
          }
        } else if (!tag.quotes && tag.nameStarts) {
          tag.quotes = {};
          tag.quotes.value = str[i];
          tag.quotes.start = i;

          if (attrObj.nameStarts && attrObj.nameEnds && attrObj.nameEnds < i && attrObj.nameStarts < i && !attrObj.valueStarts) {
            attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
          }
        }
      }

      if (tag.nameStarts !== undefined && tag.nameEnds === undefined && (!str[i].trim() || !characterSuitableForNames(str[i]))) {
        tag.nameEnds = i;
        tag.name = str.slice(tag.nameStarts, tag.nameEnds + (
        /* istanbul ignore next */
        str[i] !== ">" && str[i] !== "/" && str[i + 1] === undefined ? 1 : 0));

        if (str[tag.nameStarts - 1] !== "!" && !tag.name.replace(/-/g, "").length || /^\d+$/.test(tag.name[0])) {
          tag = {};
          continue;
        }

        if (str[i] === "<") {
          calculateHrefToBeInserted(opts);
          var whiteSpaceCompensation = calculateWhitespaceToInsert(str, i, tag.leftOuterWhitespace, i, tag.lastOpeningBracketAt, i);
          opts.cb({
            tag: tag,
            deleteFrom: tag.leftOuterWhitespace,
            deleteTo: i,
            insert: "".concat(whiteSpaceCompensation).concat(stringToInsertAfter).concat(whiteSpaceCompensation),
            rangesArr: rangesToDelete,
            proposedReturn: [tag.leftOuterWhitespace, i, "".concat(whiteSpaceCompensation).concat(stringToInsertAfter).concat(whiteSpaceCompensation)]
          });
          resetHrefMarkers();
          treatRangedTags(i, opts, rangesToDelete);
        }
      }

      if (tag.quotes && tag.quotes.start && tag.quotes.start < i && !tag.quotes.end && attrObj.nameEnds && attrObj.equalsAt && !attrObj.valueStarts) {
        attrObj.valueStarts = i;
      }

      if (!tag.quotes && attrObj.nameEnds && str[i] === "=" && !attrObj.valueStarts && !attrObj.equalsAt) {
        attrObj.equalsAt = i;
      }

      if (!tag.quotes && attrObj.nameStarts && attrObj.nameEnds && !attrObj.valueStarts && str[i].trim() && str[i] !== "=") {
        tag.attributes.push(attrObj);
        attrObj = {};
      }

      if (!tag.quotes && attrObj.nameStarts && !attrObj.nameEnds) {
        if (!str[i].trim()) {
          attrObj.nameEnds = i;
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
        } else if (str[i] === "=") {
          /* istanbul ignore else */
          if (!attrObj.equalsAt) {
            attrObj.nameEnds = i;
            attrObj.equalsAt = i;
            attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
          }
        } else if (str[i] === "/" || str[i] === ">") {
          attrObj.nameEnds = i;
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
          tag.attributes.push(attrObj);
          attrObj = {};
        } else if (str[i] === "<") {
          attrObj.nameEnds = i;
          attrObj.name = str.slice(attrObj.nameStarts, attrObj.nameEnds);
          tag.attributes.push(attrObj);
          attrObj = {};
        }
      }

      if (!tag.quotes && tag.nameEnds < i && !str[i - 1].trim() && str[i].trim() && !"<>/!".includes(str[i]) && !attrObj.nameStarts && !tag.lastClosingBracketAt) {
        attrObj.nameStarts = i;
      }

      if (tag.lastOpeningBracketAt !== null && tag.lastOpeningBracketAt < i && str[i] === "/" && tag.onlyPlausible) {
        tag.onlyPlausible = false;
      }

      if (tag.lastOpeningBracketAt !== null && tag.lastOpeningBracketAt < i && str[i] !== "/") {
        if (tag.onlyPlausible === undefined) {
          if ((!str[i].trim() || str[i] === "<") && !tag.slashPresent) {
            tag.onlyPlausible = true;
          } else {
            tag.onlyPlausible = false;
          }
        }

        if (str[i].trim() && tag.nameStarts === undefined && str[i] !== "<" && str[i] !== "/" && str[i] !== ">" && str[i] !== "!") {
          tag.nameStarts = i;
          tag.nameContainsLetters = false;
        }
      }

      if (tag.nameStarts && !tag.quotes && str[i].toLowerCase() !== str[i].toUpperCase()) {
        tag.nameContainsLetters = true;
      }

      if (str[i] === ">") {
        if (tag.lastOpeningBracketAt !== undefined) {
          tag.lastClosingBracketAt = i;
          spacesChunkWhichFollowsTheClosingBracketEndsAt = null;

          if (Object.keys(attrObj).length) {
            tag.attributes.push(attrObj);
            attrObj = {};
          }

          if (opts.dumpLinkHrefsNearby.enabled && hrefDump.tagName && !hrefDump.openingTagEnds) {
            hrefDump.openingTagEnds = i;
          }
        }
      }

      if (tag.lastOpeningBracketAt !== undefined) {
        if (tag.lastClosingBracketAt === undefined) {
          if (tag.lastOpeningBracketAt < i && str[i] !== "<" && (str[i + 1] === undefined || str[i + 1] === "<") && tag.nameContainsLetters) {
            tag.name = str.slice(tag.nameStarts, tag.nameEnds ? tag.nameEnds : i + 1).toLowerCase();

            if (opts.ignoreTags.includes(tag.name) || tag.onlyPlausible && !definitelyTagNames.has(tag.name)) {
              tag = {};
              attrObj = {};
              continue;
            }

            if ((definitelyTagNames.has(tag.name) || singleLetterTags.has(tag.name)) && (tag.onlyPlausible === false || tag.onlyPlausible === true && tag.attributes.length) || str[i + 1] === undefined) {
              calculateHrefToBeInserted(opts);

              var _whiteSpaceCompensation = calculateWhitespaceToInsert(str, i, tag.leftOuterWhitespace, i + 1, tag.lastOpeningBracketAt, tag.lastClosingBracketAt);

              opts.cb({
                tag: tag,
                deleteFrom: tag.leftOuterWhitespace,
                deleteTo: i + 1,
                insert: "".concat(_whiteSpaceCompensation).concat(stringToInsertAfter).concat(_whiteSpaceCompensation),
                rangesArr: rangesToDelete,
                proposedReturn: [tag.leftOuterWhitespace, i + 1, "".concat(_whiteSpaceCompensation).concat(stringToInsertAfter).concat(_whiteSpaceCompensation)]
              });
              resetHrefMarkers();
              treatRangedTags(i, opts, rangesToDelete);
            }
          }
        } else if (i > tag.lastClosingBracketAt && str[i].trim() || str[i + 1] === undefined) {
          var endingRangeIndex = tag.lastClosingBracketAt === i ? i + 1 : i;

          if (opts.trimOnlySpaces && endingRangeIndex === len - 1 && spacesChunkWhichFollowsTheClosingBracketEndsAt !== null && spacesChunkWhichFollowsTheClosingBracketEndsAt < i) {
            endingRangeIndex = spacesChunkWhichFollowsTheClosingBracketEndsAt;
          }

          if (!onlyStripTagsMode && opts.ignoreTags.includes(tag.name) || onlyStripTagsMode && !opts.onlyStripTags.includes(tag.name)) {
            opts.cb({
              tag: tag,
              deleteFrom: null,
              deleteTo: null,
              insert: null,
              rangesArr: rangesToDelete,
              proposedReturn: []
            });
            tag = {};
            attrObj = {};
          } else if (!tag.onlyPlausible || tag.attributes.length === 0 && tag.name && (definitelyTagNames.has(tag.name.toLowerCase()) || singleLetterTags.has(tag.name.toLowerCase())) || tag.attributes && tag.attributes.some(function (attrObj2) {
            return attrObj2.equalsAt;
          })) {
            var _whiteSpaceCompensation2 = calculateWhitespaceToInsert(str, i, tag.leftOuterWhitespace, endingRangeIndex, tag.lastOpeningBracketAt, tag.lastClosingBracketAt);

            stringToInsertAfter = "";
            hrefInsertionActive = false;
            calculateHrefToBeInserted(opts);
            var insert = void 0;

            if (isStr(stringToInsertAfter) && stringToInsertAfter.length) {
              insert = "".concat(_whiteSpaceCompensation2).concat(stringToInsertAfter).concat(
              /* istanbul ignore next */
              _whiteSpaceCompensation2 === "\n\n" ? "\n" : _whiteSpaceCompensation2);
            } else {
              insert = _whiteSpaceCompensation2;
            }

            if (tag.leftOuterWhitespace === 0 || !right(str, endingRangeIndex - 1)) {
              insert = "";
            }

            opts.cb({
              tag: tag,
              deleteFrom: tag.leftOuterWhitespace,
              deleteTo: endingRangeIndex,
              insert: insert,
              rangesArr: rangesToDelete,
              proposedReturn: [tag.leftOuterWhitespace, endingRangeIndex, insert]
            });
            resetHrefMarkers();
            treatRangedTags(i, opts, rangesToDelete);
          } else {
            tag = {};
          }

          if (str[i] !== ">") {
            tag = {};
          }
        }
      }

      if (str[i] === "<" && str[i - 1] !== "<") {
        if (str[right(str, i)] === ">") {
          continue;
        } else {
          if (tag.nameEnds && tag.nameEnds < i && !tag.lastClosingBracketAt) {
            if (tag.onlyPlausible === true && tag.attributes && tag.attributes.length || tag.onlyPlausible === false) {
              var _whiteSpaceCompensation3 = calculateWhitespaceToInsert(str, i, tag.leftOuterWhitespace, i, tag.lastOpeningBracketAt, i);

              opts.cb({
                tag: tag,
                deleteFrom: tag.leftOuterWhitespace,
                deleteTo: i,
                insert: _whiteSpaceCompensation3,
                rangesArr: rangesToDelete,
                proposedReturn: [tag.leftOuterWhitespace, i, _whiteSpaceCompensation3]
              });
              treatRangedTags(i, opts, rangesToDelete);
              tag = {};
              attrObj = {};
            }
          }

          if (tag.lastOpeningBracketAt !== undefined && tag.onlyPlausible && tag.name && !tag.quotes) {
            tag.lastOpeningBracketAt = undefined;
            tag.onlyPlausible = false;
          }

          if ((tag.lastOpeningBracketAt === undefined || !tag.onlyPlausible) && !tag.quotes) {
            tag.lastOpeningBracketAt = i;
            tag.slashPresent = false;
            tag.attributes = [];

            if (chunkOfWhitespaceStartsAt === null) {
              tag.leftOuterWhitespace = i;
            } else if (opts.trimOnlySpaces && chunkOfWhitespaceStartsAt === 0) {
              /* istanbul ignore next */
              tag.leftOuterWhitespace = chunkOfSpacesStartsAt || i;
            } else {
              tag.leftOuterWhitespace = chunkOfWhitespaceStartsAt;
            }

            if ("".concat(str[i + 1]).concat(str[i + 2]).concat(str[i + 3]) === "!--" || "".concat(str[i + 1]).concat(str[i + 2]).concat(str[i + 3]).concat(str[i + 4]).concat(str[i + 5]).concat(str[i + 6]).concat(str[i + 7]).concat(str[i + 8]) === "![CDATA[") {
              var cdata = true;

              if (str[i + 2] === "-") {
                cdata = false;
              }

              var closingFoundAt = void 0;

              for (var _y = i; _y < len; _y++) {
                if (!closingFoundAt && cdata && "".concat(str[_y - 2]).concat(str[_y - 1]).concat(str[_y]) === "]]>" || !cdata && "".concat(str[_y - 2]).concat(str[_y - 1]).concat(str[_y]) === "-->") {
                  closingFoundAt = _y;
                }

                if (closingFoundAt && (closingFoundAt < _y && str[_y].trim() || str[_y + 1] === undefined)) {
                  var rangeEnd = _y;

                  if (str[_y + 1] === undefined && !str[_y].trim() || str[_y] === ">") {
                    rangeEnd += 1;
                  }

                  var _whiteSpaceCompensation4 = calculateWhitespaceToInsert(str, _y, tag.leftOuterWhitespace, rangeEnd, tag.lastOpeningBracketAt, closingFoundAt);

                  opts.cb({
                    tag: tag,
                    deleteFrom: tag.leftOuterWhitespace,
                    deleteTo: rangeEnd,
                    insert: _whiteSpaceCompensation4,
                    rangesArr: rangesToDelete,
                    proposedReturn: [tag.leftOuterWhitespace, rangeEnd, _whiteSpaceCompensation4]
                  });
                  i = _y - 1;

                  if (str[_y] === ">") {
                    i = _y;
                  }

                  tag = {};
                  attrObj = {};
                  break;
                }
              }
            }
          }
        }
      }

      if (str[i].trim() === "") {
        if (chunkOfWhitespaceStartsAt === null) {
          chunkOfWhitespaceStartsAt = i;

          if (tag.lastOpeningBracketAt !== undefined && tag.lastOpeningBracketAt < i && tag.nameStarts && tag.nameStarts < tag.lastOpeningBracketAt && i === tag.lastOpeningBracketAt + 1 && !rangedOpeningTags.some(function (rangedTagObj) {
            return rangedTagObj.name === tag.name;
          })) {
            tag.onlyPlausible = true;
            tag.name = undefined;
            tag.nameStarts = undefined;
          }
        }
      } else if (chunkOfWhitespaceStartsAt !== null) {
        if (!tag.quotes && attrObj.equalsAt > chunkOfWhitespaceStartsAt - 1 && attrObj.nameEnds && attrObj.equalsAt > attrObj.nameEnds && str[i] !== '"' && str[i] !== "'") {
          /* istanbul ignore else */
          if (lodash_isplainobject(attrObj)) {
            tag.attributes.push(attrObj);
          }

          attrObj = {};
          tag.equalsSpottedAt = undefined;
        }

        chunkOfWhitespaceStartsAt = null;
      }

      if (str[i] === " ") {
        if (chunkOfSpacesStartsAt === null) {
          chunkOfSpacesStartsAt = i;
        }
      } else if (chunkOfSpacesStartsAt !== null) {
        chunkOfSpacesStartsAt = null;
      }
    }

    if (opts.trimOnlySpaces && str[0] === " " || !opts.trimOnlySpaces && !str[0].trim()) {
      for (var _i = 0, _len = str.length; _i < _len; _i++) {
        if (opts.trimOnlySpaces && str[_i] !== " " || !opts.trimOnlySpaces && str[_i].trim()) {
          rangesToDelete.push([0, _i]);
          break;
        } else if (!str[_i + 1]) {
          rangesToDelete.push([0, _i + 1]);
        }
      }
    }

    if (opts.trimOnlySpaces && str[str.length - 1] === " " || !opts.trimOnlySpaces && !str[str.length - 1].trim()) {
      for (var _i2 = str.length; _i2--;) {
        if (opts.trimOnlySpaces && str[_i2] !== " " || !opts.trimOnlySpaces && str[_i2].trim()) {
          rangesToDelete.push([_i2 + 1, str.length]);
          break;
        }
      }
    }

    if ((!originalOpts || !originalOpts.cb) && rangesToDelete.current()) {
      if (rangesToDelete.current()[0] && !rangesToDelete.current()[0][0]) {
        var startingIdx = rangesToDelete.current()[0][1];
        rangesToDelete.current();
        rangesToDelete.ranges[0] = [rangesToDelete.ranges[0][0], rangesToDelete.ranges[0][1]];
      }

      if (rangesToDelete.current()[rangesToDelete.current().length - 1] && rangesToDelete.current()[rangesToDelete.current().length - 1][1] === str.length) {
        var _startingIdx = rangesToDelete.current()[rangesToDelete.current().length - 1][0];
        rangesToDelete.current();
        var startingIdx2 = rangesToDelete.ranges[rangesToDelete.ranges.length - 1][0];

        if (str[startingIdx2 - 1] && (opts.trimOnlySpaces && str[startingIdx2 - 1] === " " || !opts.trimOnlySpaces && !str[startingIdx2 - 1].trim())) {
          startingIdx2 -= 1;
        }

        var backupWhatToAdd = rangesToDelete.ranges[rangesToDelete.ranges.length - 1][2];
        rangesToDelete.ranges[rangesToDelete.ranges.length - 1] = [startingIdx2, rangesToDelete.ranges[rangesToDelete.ranges.length - 1][1]];

        if (backupWhatToAdd && backupWhatToAdd.trim()) {
          rangesToDelete.ranges[rangesToDelete.ranges.length - 1].push(backupWhatToAdd.trimEnd());
        }
      }
    }

    if (opts.returnRangesOnly) {
      return rangesToDelete.current();
    }

    return rangesApply(str, rangesToDelete.current());
  }

  var ansiRegex = function ansiRegex() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$onlyFirst = _ref.onlyFirst,
        onlyFirst = _ref$onlyFirst === void 0 ? false : _ref$onlyFirst;

    var pattern = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'].join('|');
    return new RegExp(pattern, onlyFirst ? undefined : 'g');
  };

  var he = createCommonjsModule(function (module, exports) {

    (function (root) {
      // Detect free variables `exports`.
      var freeExports =  exports; // Detect free variable `module`.

      var freeModule =  module && module.exports == freeExports && module; // Detect free variable `global`, from Node.js or Browserified code,
      // and use it as `root`.

      var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal;

      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
      }
      /*--------------------------------------------------------------------------*/
      // All astral symbols.


      var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g; // All ASCII symbols (not just printable ASCII) except those listed in the
      // first column of the overrides table.
      // https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides

      var regexAsciiWhitelist = /[\x01-\x7F]/g; // All BMP symbols that are not ASCII newlines, printable ASCII symbols, or
      // code points listed in the first column of the overrides table on
      // https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides.

      var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
      var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
      var encodeMap = {
        '\xAD': 'shy',
        "\u200C": 'zwnj',
        "\u200D": 'zwj',
        "\u200E": 'lrm',
        "\u2063": 'ic',
        "\u2062": 'it',
        "\u2061": 'af',
        "\u200F": 'rlm',
        "\u200B": 'ZeroWidthSpace',
        "\u2060": 'NoBreak',
        "\u0311": 'DownBreve',
        "\u20DB": 'tdot',
        "\u20DC": 'DotDot',
        '\t': 'Tab',
        '\n': 'NewLine',
        "\u2008": 'puncsp',
        "\u205F": 'MediumSpace',
        "\u2009": 'thinsp',
        "\u200A": 'hairsp',
        "\u2004": 'emsp13',
        "\u2002": 'ensp',
        "\u2005": 'emsp14',
        "\u2003": 'emsp',
        "\u2007": 'numsp',
        '\xA0': 'nbsp',
        "\u205F\u200A": 'ThickSpace',
        "\u203E": 'oline',
        '_': 'lowbar',
        "\u2010": 'dash',
        "\u2013": 'ndash',
        "\u2014": 'mdash',
        "\u2015": 'horbar',
        ',': 'comma',
        ';': 'semi',
        "\u204F": 'bsemi',
        ':': 'colon',
        "\u2A74": 'Colone',
        '!': 'excl',
        '\xA1': 'iexcl',
        '?': 'quest',
        '\xBF': 'iquest',
        '.': 'period',
        "\u2025": 'nldr',
        "\u2026": 'mldr',
        '\xB7': 'middot',
        '\'': 'apos',
        "\u2018": 'lsquo',
        "\u2019": 'rsquo',
        "\u201A": 'sbquo',
        "\u2039": 'lsaquo',
        "\u203A": 'rsaquo',
        '"': 'quot',
        "\u201C": 'ldquo',
        "\u201D": 'rdquo',
        "\u201E": 'bdquo',
        '\xAB': 'laquo',
        '\xBB': 'raquo',
        '(': 'lpar',
        ')': 'rpar',
        '[': 'lsqb',
        ']': 'rsqb',
        '{': 'lcub',
        '}': 'rcub',
        "\u2308": 'lceil',
        "\u2309": 'rceil',
        "\u230A": 'lfloor',
        "\u230B": 'rfloor',
        "\u2985": 'lopar',
        "\u2986": 'ropar',
        "\u298B": 'lbrke',
        "\u298C": 'rbrke',
        "\u298D": 'lbrkslu',
        "\u298E": 'rbrksld',
        "\u298F": 'lbrksld',
        "\u2990": 'rbrkslu',
        "\u2991": 'langd',
        "\u2992": 'rangd',
        "\u2993": 'lparlt',
        "\u2994": 'rpargt',
        "\u2995": 'gtlPar',
        "\u2996": 'ltrPar',
        "\u27E6": 'lobrk',
        "\u27E7": 'robrk',
        "\u27E8": 'lang',
        "\u27E9": 'rang',
        "\u27EA": 'Lang',
        "\u27EB": 'Rang',
        "\u27EC": 'loang',
        "\u27ED": 'roang',
        "\u2772": 'lbbrk',
        "\u2773": 'rbbrk',
        "\u2016": 'Vert',
        '\xA7': 'sect',
        '\xB6': 'para',
        '@': 'commat',
        '*': 'ast',
        '/': 'sol',
        'undefined': null,
        '&': 'amp',
        '#': 'num',
        '%': 'percnt',
        "\u2030": 'permil',
        "\u2031": 'pertenk',
        "\u2020": 'dagger',
        "\u2021": 'Dagger',
        "\u2022": 'bull',
        "\u2043": 'hybull',
        "\u2032": 'prime',
        "\u2033": 'Prime',
        "\u2034": 'tprime',
        "\u2057": 'qprime',
        "\u2035": 'bprime',
        "\u2041": 'caret',
        '`': 'grave',
        '\xB4': 'acute',
        "\u02DC": 'tilde',
        '^': 'Hat',
        '\xAF': 'macr',
        "\u02D8": 'breve',
        "\u02D9": 'dot',
        '\xA8': 'die',
        "\u02DA": 'ring',
        "\u02DD": 'dblac',
        '\xB8': 'cedil',
        "\u02DB": 'ogon',
        "\u02C6": 'circ',
        "\u02C7": 'caron',
        '\xB0': 'deg',
        '\xA9': 'copy',
        '\xAE': 'reg',
        "\u2117": 'copysr',
        "\u2118": 'wp',
        "\u211E": 'rx',
        "\u2127": 'mho',
        "\u2129": 'iiota',
        "\u2190": 'larr',
        "\u219A": 'nlarr',
        "\u2192": 'rarr',
        "\u219B": 'nrarr',
        "\u2191": 'uarr',
        "\u2193": 'darr',
        "\u2194": 'harr',
        "\u21AE": 'nharr',
        "\u2195": 'varr',
        "\u2196": 'nwarr',
        "\u2197": 'nearr',
        "\u2198": 'searr',
        "\u2199": 'swarr',
        "\u219D": 'rarrw',
        "\u219D\u0338": 'nrarrw',
        "\u219E": 'Larr',
        "\u219F": 'Uarr',
        "\u21A0": 'Rarr',
        "\u21A1": 'Darr',
        "\u21A2": 'larrtl',
        "\u21A3": 'rarrtl',
        "\u21A4": 'mapstoleft',
        "\u21A5": 'mapstoup',
        "\u21A6": 'map',
        "\u21A7": 'mapstodown',
        "\u21A9": 'larrhk',
        "\u21AA": 'rarrhk',
        "\u21AB": 'larrlp',
        "\u21AC": 'rarrlp',
        "\u21AD": 'harrw',
        "\u21B0": 'lsh',
        "\u21B1": 'rsh',
        "\u21B2": 'ldsh',
        "\u21B3": 'rdsh',
        "\u21B5": 'crarr',
        "\u21B6": 'cularr',
        "\u21B7": 'curarr',
        "\u21BA": 'olarr',
        "\u21BB": 'orarr',
        "\u21BC": 'lharu',
        "\u21BD": 'lhard',
        "\u21BE": 'uharr',
        "\u21BF": 'uharl',
        "\u21C0": 'rharu',
        "\u21C1": 'rhard',
        "\u21C2": 'dharr',
        "\u21C3": 'dharl',
        "\u21C4": 'rlarr',
        "\u21C5": 'udarr',
        "\u21C6": 'lrarr',
        "\u21C7": 'llarr',
        "\u21C8": 'uuarr',
        "\u21C9": 'rrarr',
        "\u21CA": 'ddarr',
        "\u21CB": 'lrhar',
        "\u21CC": 'rlhar',
        "\u21D0": 'lArr',
        "\u21CD": 'nlArr',
        "\u21D1": 'uArr',
        "\u21D2": 'rArr',
        "\u21CF": 'nrArr',
        "\u21D3": 'dArr',
        "\u21D4": 'iff',
        "\u21CE": 'nhArr',
        "\u21D5": 'vArr',
        "\u21D6": 'nwArr',
        "\u21D7": 'neArr',
        "\u21D8": 'seArr',
        "\u21D9": 'swArr',
        "\u21DA": 'lAarr',
        "\u21DB": 'rAarr',
        "\u21DD": 'zigrarr',
        "\u21E4": 'larrb',
        "\u21E5": 'rarrb',
        "\u21F5": 'duarr',
        "\u21FD": 'loarr',
        "\u21FE": 'roarr',
        "\u21FF": 'hoarr',
        "\u2200": 'forall',
        "\u2201": 'comp',
        "\u2202": 'part',
        "\u2202\u0338": 'npart',
        "\u2203": 'exist',
        "\u2204": 'nexist',
        "\u2205": 'empty',
        "\u2207": 'Del',
        "\u2208": 'in',
        "\u2209": 'notin',
        "\u220B": 'ni',
        "\u220C": 'notni',
        "\u03F6": 'bepsi',
        "\u220F": 'prod',
        "\u2210": 'coprod',
        "\u2211": 'sum',
        '+': 'plus',
        '\xB1': 'pm',
        '\xF7': 'div',
        '\xD7': 'times',
        '<': 'lt',
        "\u226E": 'nlt',
        "<\u20D2": 'nvlt',
        '=': 'equals',
        "\u2260": 'ne',
        "=\u20E5": 'bne',
        "\u2A75": 'Equal',
        '>': 'gt',
        "\u226F": 'ngt',
        ">\u20D2": 'nvgt',
        '\xAC': 'not',
        '|': 'vert',
        '\xA6': 'brvbar',
        "\u2212": 'minus',
        "\u2213": 'mp',
        "\u2214": 'plusdo',
        "\u2044": 'frasl',
        "\u2216": 'setmn',
        "\u2217": 'lowast',
        "\u2218": 'compfn',
        "\u221A": 'Sqrt',
        "\u221D": 'prop',
        "\u221E": 'infin',
        "\u221F": 'angrt',
        "\u2220": 'ang',
        "\u2220\u20D2": 'nang',
        "\u2221": 'angmsd',
        "\u2222": 'angsph',
        "\u2223": 'mid',
        "\u2224": 'nmid',
        "\u2225": 'par',
        "\u2226": 'npar',
        "\u2227": 'and',
        "\u2228": 'or',
        "\u2229": 'cap',
        "\u2229\uFE00": 'caps',
        "\u222A": 'cup',
        "\u222A\uFE00": 'cups',
        "\u222B": 'int',
        "\u222C": 'Int',
        "\u222D": 'tint',
        "\u2A0C": 'qint',
        "\u222E": 'oint',
        "\u222F": 'Conint',
        "\u2230": 'Cconint',
        "\u2231": 'cwint',
        "\u2232": 'cwconint',
        "\u2233": 'awconint',
        "\u2234": 'there4',
        "\u2235": 'becaus',
        "\u2236": 'ratio',
        "\u2237": 'Colon',
        "\u2238": 'minusd',
        "\u223A": 'mDDot',
        "\u223B": 'homtht',
        "\u223C": 'sim',
        "\u2241": 'nsim',
        "\u223C\u20D2": 'nvsim',
        "\u223D": 'bsim',
        "\u223D\u0331": 'race',
        "\u223E": 'ac',
        "\u223E\u0333": 'acE',
        "\u223F": 'acd',
        "\u2240": 'wr',
        "\u2242": 'esim',
        "\u2242\u0338": 'nesim',
        "\u2243": 'sime',
        "\u2244": 'nsime',
        "\u2245": 'cong',
        "\u2247": 'ncong',
        "\u2246": 'simne',
        "\u2248": 'ap',
        "\u2249": 'nap',
        "\u224A": 'ape',
        "\u224B": 'apid',
        "\u224B\u0338": 'napid',
        "\u224C": 'bcong',
        "\u224D": 'CupCap',
        "\u226D": 'NotCupCap',
        "\u224D\u20D2": 'nvap',
        "\u224E": 'bump',
        "\u224E\u0338": 'nbump',
        "\u224F": 'bumpe',
        "\u224F\u0338": 'nbumpe',
        "\u2250": 'doteq',
        "\u2250\u0338": 'nedot',
        "\u2251": 'eDot',
        "\u2252": 'efDot',
        "\u2253": 'erDot',
        "\u2254": 'colone',
        "\u2255": 'ecolon',
        "\u2256": 'ecir',
        "\u2257": 'cire',
        "\u2259": 'wedgeq',
        "\u225A": 'veeeq',
        "\u225C": 'trie',
        "\u225F": 'equest',
        "\u2261": 'equiv',
        "\u2262": 'nequiv',
        "\u2261\u20E5": 'bnequiv',
        "\u2264": 'le',
        "\u2270": 'nle',
        "\u2264\u20D2": 'nvle',
        "\u2265": 'ge',
        "\u2271": 'nge',
        "\u2265\u20D2": 'nvge',
        "\u2266": 'lE',
        "\u2266\u0338": 'nlE',
        "\u2267": 'gE',
        "\u2267\u0338": 'ngE',
        "\u2268\uFE00": 'lvnE',
        "\u2268": 'lnE',
        "\u2269": 'gnE',
        "\u2269\uFE00": 'gvnE',
        "\u226A": 'll',
        "\u226A\u0338": 'nLtv',
        "\u226A\u20D2": 'nLt',
        "\u226B": 'gg',
        "\u226B\u0338": 'nGtv',
        "\u226B\u20D2": 'nGt',
        "\u226C": 'twixt',
        "\u2272": 'lsim',
        "\u2274": 'nlsim',
        "\u2273": 'gsim',
        "\u2275": 'ngsim',
        "\u2276": 'lg',
        "\u2278": 'ntlg',
        "\u2277": 'gl',
        "\u2279": 'ntgl',
        "\u227A": 'pr',
        "\u2280": 'npr',
        "\u227B": 'sc',
        "\u2281": 'nsc',
        "\u227C": 'prcue',
        "\u22E0": 'nprcue',
        "\u227D": 'sccue',
        "\u22E1": 'nsccue',
        "\u227E": 'prsim',
        "\u227F": 'scsim',
        "\u227F\u0338": 'NotSucceedsTilde',
        "\u2282": 'sub',
        "\u2284": 'nsub',
        "\u2282\u20D2": 'vnsub',
        "\u2283": 'sup',
        "\u2285": 'nsup',
        "\u2283\u20D2": 'vnsup',
        "\u2286": 'sube',
        "\u2288": 'nsube',
        "\u2287": 'supe',
        "\u2289": 'nsupe',
        "\u228A\uFE00": 'vsubne',
        "\u228A": 'subne',
        "\u228B\uFE00": 'vsupne',
        "\u228B": 'supne',
        "\u228D": 'cupdot',
        "\u228E": 'uplus',
        "\u228F": 'sqsub',
        "\u228F\u0338": 'NotSquareSubset',
        "\u2290": 'sqsup',
        "\u2290\u0338": 'NotSquareSuperset',
        "\u2291": 'sqsube',
        "\u22E2": 'nsqsube',
        "\u2292": 'sqsupe',
        "\u22E3": 'nsqsupe',
        "\u2293": 'sqcap',
        "\u2293\uFE00": 'sqcaps',
        "\u2294": 'sqcup',
        "\u2294\uFE00": 'sqcups',
        "\u2295": 'oplus',
        "\u2296": 'ominus',
        "\u2297": 'otimes',
        "\u2298": 'osol',
        "\u2299": 'odot',
        "\u229A": 'ocir',
        "\u229B": 'oast',
        "\u229D": 'odash',
        "\u229E": 'plusb',
        "\u229F": 'minusb',
        "\u22A0": 'timesb',
        "\u22A1": 'sdotb',
        "\u22A2": 'vdash',
        "\u22AC": 'nvdash',
        "\u22A3": 'dashv',
        "\u22A4": 'top',
        "\u22A5": 'bot',
        "\u22A7": 'models',
        "\u22A8": 'vDash',
        "\u22AD": 'nvDash',
        "\u22A9": 'Vdash',
        "\u22AE": 'nVdash',
        "\u22AA": 'Vvdash',
        "\u22AB": 'VDash',
        "\u22AF": 'nVDash',
        "\u22B0": 'prurel',
        "\u22B2": 'vltri',
        "\u22EA": 'nltri',
        "\u22B3": 'vrtri',
        "\u22EB": 'nrtri',
        "\u22B4": 'ltrie',
        "\u22EC": 'nltrie',
        "\u22B4\u20D2": 'nvltrie',
        "\u22B5": 'rtrie',
        "\u22ED": 'nrtrie',
        "\u22B5\u20D2": 'nvrtrie',
        "\u22B6": 'origof',
        "\u22B7": 'imof',
        "\u22B8": 'mumap',
        "\u22B9": 'hercon',
        "\u22BA": 'intcal',
        "\u22BB": 'veebar',
        "\u22BD": 'barvee',
        "\u22BE": 'angrtvb',
        "\u22BF": 'lrtri',
        "\u22C0": 'Wedge',
        "\u22C1": 'Vee',
        "\u22C2": 'xcap',
        "\u22C3": 'xcup',
        "\u22C4": 'diam',
        "\u22C5": 'sdot',
        "\u22C6": 'Star',
        "\u22C7": 'divonx',
        "\u22C8": 'bowtie',
        "\u22C9": 'ltimes',
        "\u22CA": 'rtimes',
        "\u22CB": 'lthree',
        "\u22CC": 'rthree',
        "\u22CD": 'bsime',
        "\u22CE": 'cuvee',
        "\u22CF": 'cuwed',
        "\u22D0": 'Sub',
        "\u22D1": 'Sup',
        "\u22D2": 'Cap',
        "\u22D3": 'Cup',
        "\u22D4": 'fork',
        "\u22D5": 'epar',
        "\u22D6": 'ltdot',
        "\u22D7": 'gtdot',
        "\u22D8": 'Ll',
        "\u22D8\u0338": 'nLl',
        "\u22D9": 'Gg',
        "\u22D9\u0338": 'nGg',
        "\u22DA\uFE00": 'lesg',
        "\u22DA": 'leg',
        "\u22DB": 'gel',
        "\u22DB\uFE00": 'gesl',
        "\u22DE": 'cuepr',
        "\u22DF": 'cuesc',
        "\u22E6": 'lnsim',
        "\u22E7": 'gnsim',
        "\u22E8": 'prnsim',
        "\u22E9": 'scnsim',
        "\u22EE": 'vellip',
        "\u22EF": 'ctdot',
        "\u22F0": 'utdot',
        "\u22F1": 'dtdot',
        "\u22F2": 'disin',
        "\u22F3": 'isinsv',
        "\u22F4": 'isins',
        "\u22F5": 'isindot',
        "\u22F5\u0338": 'notindot',
        "\u22F6": 'notinvc',
        "\u22F7": 'notinvb',
        "\u22F9": 'isinE',
        "\u22F9\u0338": 'notinE',
        "\u22FA": 'nisd',
        "\u22FB": 'xnis',
        "\u22FC": 'nis',
        "\u22FD": 'notnivc',
        "\u22FE": 'notnivb',
        "\u2305": 'barwed',
        "\u2306": 'Barwed',
        "\u230C": 'drcrop',
        "\u230D": 'dlcrop',
        "\u230E": 'urcrop',
        "\u230F": 'ulcrop',
        "\u2310": 'bnot',
        "\u2312": 'profline',
        "\u2313": 'profsurf',
        "\u2315": 'telrec',
        "\u2316": 'target',
        "\u231C": 'ulcorn',
        "\u231D": 'urcorn',
        "\u231E": 'dlcorn',
        "\u231F": 'drcorn',
        "\u2322": 'frown',
        "\u2323": 'smile',
        "\u232D": 'cylcty',
        "\u232E": 'profalar',
        "\u2336": 'topbot',
        "\u233D": 'ovbar',
        "\u233F": 'solbar',
        "\u237C": 'angzarr',
        "\u23B0": 'lmoust',
        "\u23B1": 'rmoust',
        "\u23B4": 'tbrk',
        "\u23B5": 'bbrk',
        "\u23B6": 'bbrktbrk',
        "\u23DC": 'OverParenthesis',
        "\u23DD": 'UnderParenthesis',
        "\u23DE": 'OverBrace',
        "\u23DF": 'UnderBrace',
        "\u23E2": 'trpezium',
        "\u23E7": 'elinters',
        "\u2423": 'blank',
        "\u2500": 'boxh',
        "\u2502": 'boxv',
        "\u250C": 'boxdr',
        "\u2510": 'boxdl',
        "\u2514": 'boxur',
        "\u2518": 'boxul',
        "\u251C": 'boxvr',
        "\u2524": 'boxvl',
        "\u252C": 'boxhd',
        "\u2534": 'boxhu',
        "\u253C": 'boxvh',
        "\u2550": 'boxH',
        "\u2551": 'boxV',
        "\u2552": 'boxdR',
        "\u2553": 'boxDr',
        "\u2554": 'boxDR',
        "\u2555": 'boxdL',
        "\u2556": 'boxDl',
        "\u2557": 'boxDL',
        "\u2558": 'boxuR',
        "\u2559": 'boxUr',
        "\u255A": 'boxUR',
        "\u255B": 'boxuL',
        "\u255C": 'boxUl',
        "\u255D": 'boxUL',
        "\u255E": 'boxvR',
        "\u255F": 'boxVr',
        "\u2560": 'boxVR',
        "\u2561": 'boxvL',
        "\u2562": 'boxVl',
        "\u2563": 'boxVL',
        "\u2564": 'boxHd',
        "\u2565": 'boxhD',
        "\u2566": 'boxHD',
        "\u2567": 'boxHu',
        "\u2568": 'boxhU',
        "\u2569": 'boxHU',
        "\u256A": 'boxvH',
        "\u256B": 'boxVh',
        "\u256C": 'boxVH',
        "\u2580": 'uhblk',
        "\u2584": 'lhblk',
        "\u2588": 'block',
        "\u2591": 'blk14',
        "\u2592": 'blk12',
        "\u2593": 'blk34',
        "\u25A1": 'squ',
        "\u25AA": 'squf',
        "\u25AB": 'EmptyVerySmallSquare',
        "\u25AD": 'rect',
        "\u25AE": 'marker',
        "\u25B1": 'fltns',
        "\u25B3": 'xutri',
        "\u25B4": 'utrif',
        "\u25B5": 'utri',
        "\u25B8": 'rtrif',
        "\u25B9": 'rtri',
        "\u25BD": 'xdtri',
        "\u25BE": 'dtrif',
        "\u25BF": 'dtri',
        "\u25C2": 'ltrif',
        "\u25C3": 'ltri',
        "\u25CA": 'loz',
        "\u25CB": 'cir',
        "\u25EC": 'tridot',
        "\u25EF": 'xcirc',
        "\u25F8": 'ultri',
        "\u25F9": 'urtri',
        "\u25FA": 'lltri',
        "\u25FB": 'EmptySmallSquare',
        "\u25FC": 'FilledSmallSquare',
        "\u2605": 'starf',
        "\u2606": 'star',
        "\u260E": 'phone',
        "\u2640": 'female',
        "\u2642": 'male',
        "\u2660": 'spades',
        "\u2663": 'clubs',
        "\u2665": 'hearts',
        "\u2666": 'diams',
        "\u266A": 'sung',
        "\u2713": 'check',
        "\u2717": 'cross',
        "\u2720": 'malt',
        "\u2736": 'sext',
        "\u2758": 'VerticalSeparator',
        "\u27C8": 'bsolhsub',
        "\u27C9": 'suphsol',
        "\u27F5": 'xlarr',
        "\u27F6": 'xrarr',
        "\u27F7": 'xharr',
        "\u27F8": 'xlArr',
        "\u27F9": 'xrArr',
        "\u27FA": 'xhArr',
        "\u27FC": 'xmap',
        "\u27FF": 'dzigrarr',
        "\u2902": 'nvlArr',
        "\u2903": 'nvrArr',
        "\u2904": 'nvHarr',
        "\u2905": 'Map',
        "\u290C": 'lbarr',
        "\u290D": 'rbarr',
        "\u290E": 'lBarr',
        "\u290F": 'rBarr',
        "\u2910": 'RBarr',
        "\u2911": 'DDotrahd',
        "\u2912": 'UpArrowBar',
        "\u2913": 'DownArrowBar',
        "\u2916": 'Rarrtl',
        "\u2919": 'latail',
        "\u291A": 'ratail',
        "\u291B": 'lAtail',
        "\u291C": 'rAtail',
        "\u291D": 'larrfs',
        "\u291E": 'rarrfs',
        "\u291F": 'larrbfs',
        "\u2920": 'rarrbfs',
        "\u2923": 'nwarhk',
        "\u2924": 'nearhk',
        "\u2925": 'searhk',
        "\u2926": 'swarhk',
        "\u2927": 'nwnear',
        "\u2928": 'toea',
        "\u2929": 'tosa',
        "\u292A": 'swnwar',
        "\u2933": 'rarrc',
        "\u2933\u0338": 'nrarrc',
        "\u2935": 'cudarrr',
        "\u2936": 'ldca',
        "\u2937": 'rdca',
        "\u2938": 'cudarrl',
        "\u2939": 'larrpl',
        "\u293C": 'curarrm',
        "\u293D": 'cularrp',
        "\u2945": 'rarrpl',
        "\u2948": 'harrcir',
        "\u2949": 'Uarrocir',
        "\u294A": 'lurdshar',
        "\u294B": 'ldrushar',
        "\u294E": 'LeftRightVector',
        "\u294F": 'RightUpDownVector',
        "\u2950": 'DownLeftRightVector',
        "\u2951": 'LeftUpDownVector',
        "\u2952": 'LeftVectorBar',
        "\u2953": 'RightVectorBar',
        "\u2954": 'RightUpVectorBar',
        "\u2955": 'RightDownVectorBar',
        "\u2956": 'DownLeftVectorBar',
        "\u2957": 'DownRightVectorBar',
        "\u2958": 'LeftUpVectorBar',
        "\u2959": 'LeftDownVectorBar',
        "\u295A": 'LeftTeeVector',
        "\u295B": 'RightTeeVector',
        "\u295C": 'RightUpTeeVector',
        "\u295D": 'RightDownTeeVector',
        "\u295E": 'DownLeftTeeVector',
        "\u295F": 'DownRightTeeVector',
        "\u2960": 'LeftUpTeeVector',
        "\u2961": 'LeftDownTeeVector',
        "\u2962": 'lHar',
        "\u2963": 'uHar',
        "\u2964": 'rHar',
        "\u2965": 'dHar',
        "\u2966": 'luruhar',
        "\u2967": 'ldrdhar',
        "\u2968": 'ruluhar',
        "\u2969": 'rdldhar',
        "\u296A": 'lharul',
        "\u296B": 'llhard',
        "\u296C": 'rharul',
        "\u296D": 'lrhard',
        "\u296E": 'udhar',
        "\u296F": 'duhar',
        "\u2970": 'RoundImplies',
        "\u2971": 'erarr',
        "\u2972": 'simrarr',
        "\u2973": 'larrsim',
        "\u2974": 'rarrsim',
        "\u2975": 'rarrap',
        "\u2976": 'ltlarr',
        "\u2978": 'gtrarr',
        "\u2979": 'subrarr',
        "\u297B": 'suplarr',
        "\u297C": 'lfisht',
        "\u297D": 'rfisht',
        "\u297E": 'ufisht',
        "\u297F": 'dfisht',
        "\u299A": 'vzigzag',
        "\u299C": 'vangrt',
        "\u299D": 'angrtvbd',
        "\u29A4": 'ange',
        "\u29A5": 'range',
        "\u29A6": 'dwangle',
        "\u29A7": 'uwangle',
        "\u29A8": 'angmsdaa',
        "\u29A9": 'angmsdab',
        "\u29AA": 'angmsdac',
        "\u29AB": 'angmsdad',
        "\u29AC": 'angmsdae',
        "\u29AD": 'angmsdaf',
        "\u29AE": 'angmsdag',
        "\u29AF": 'angmsdah',
        "\u29B0": 'bemptyv',
        "\u29B1": 'demptyv',
        "\u29B2": 'cemptyv',
        "\u29B3": 'raemptyv',
        "\u29B4": 'laemptyv',
        "\u29B5": 'ohbar',
        "\u29B6": 'omid',
        "\u29B7": 'opar',
        "\u29B9": 'operp',
        "\u29BB": 'olcross',
        "\u29BC": 'odsold',
        "\u29BE": 'olcir',
        "\u29BF": 'ofcir',
        "\u29C0": 'olt',
        "\u29C1": 'ogt',
        "\u29C2": 'cirscir',
        "\u29C3": 'cirE',
        "\u29C4": 'solb',
        "\u29C5": 'bsolb',
        "\u29C9": 'boxbox',
        "\u29CD": 'trisb',
        "\u29CE": 'rtriltri',
        "\u29CF": 'LeftTriangleBar',
        "\u29CF\u0338": 'NotLeftTriangleBar',
        "\u29D0": 'RightTriangleBar',
        "\u29D0\u0338": 'NotRightTriangleBar',
        "\u29DC": 'iinfin',
        "\u29DD": 'infintie',
        "\u29DE": 'nvinfin',
        "\u29E3": 'eparsl',
        "\u29E4": 'smeparsl',
        "\u29E5": 'eqvparsl',
        "\u29EB": 'lozf',
        "\u29F4": 'RuleDelayed',
        "\u29F6": 'dsol',
        "\u2A00": 'xodot',
        "\u2A01": 'xoplus',
        "\u2A02": 'xotime',
        "\u2A04": 'xuplus',
        "\u2A06": 'xsqcup',
        "\u2A0D": 'fpartint',
        "\u2A10": 'cirfnint',
        "\u2A11": 'awint',
        "\u2A12": 'rppolint',
        "\u2A13": 'scpolint',
        "\u2A14": 'npolint',
        "\u2A15": 'pointint',
        "\u2A16": 'quatint',
        "\u2A17": 'intlarhk',
        "\u2A22": 'pluscir',
        "\u2A23": 'plusacir',
        "\u2A24": 'simplus',
        "\u2A25": 'plusdu',
        "\u2A26": 'plussim',
        "\u2A27": 'plustwo',
        "\u2A29": 'mcomma',
        "\u2A2A": 'minusdu',
        "\u2A2D": 'loplus',
        "\u2A2E": 'roplus',
        "\u2A2F": 'Cross',
        "\u2A30": 'timesd',
        "\u2A31": 'timesbar',
        "\u2A33": 'smashp',
        "\u2A34": 'lotimes',
        "\u2A35": 'rotimes',
        "\u2A36": 'otimesas',
        "\u2A37": 'Otimes',
        "\u2A38": 'odiv',
        "\u2A39": 'triplus',
        "\u2A3A": 'triminus',
        "\u2A3B": 'tritime',
        "\u2A3C": 'iprod',
        "\u2A3F": 'amalg',
        "\u2A40": 'capdot',
        "\u2A42": 'ncup',
        "\u2A43": 'ncap',
        "\u2A44": 'capand',
        "\u2A45": 'cupor',
        "\u2A46": 'cupcap',
        "\u2A47": 'capcup',
        "\u2A48": 'cupbrcap',
        "\u2A49": 'capbrcup',
        "\u2A4A": 'cupcup',
        "\u2A4B": 'capcap',
        "\u2A4C": 'ccups',
        "\u2A4D": 'ccaps',
        "\u2A50": 'ccupssm',
        "\u2A53": 'And',
        "\u2A54": 'Or',
        "\u2A55": 'andand',
        "\u2A56": 'oror',
        "\u2A57": 'orslope',
        "\u2A58": 'andslope',
        "\u2A5A": 'andv',
        "\u2A5B": 'orv',
        "\u2A5C": 'andd',
        "\u2A5D": 'ord',
        "\u2A5F": 'wedbar',
        "\u2A66": 'sdote',
        "\u2A6A": 'simdot',
        "\u2A6D": 'congdot',
        "\u2A6D\u0338": 'ncongdot',
        "\u2A6E": 'easter',
        "\u2A6F": 'apacir',
        "\u2A70": 'apE',
        "\u2A70\u0338": 'napE',
        "\u2A71": 'eplus',
        "\u2A72": 'pluse',
        "\u2A73": 'Esim',
        "\u2A77": 'eDDot',
        "\u2A78": 'equivDD',
        "\u2A79": 'ltcir',
        "\u2A7A": 'gtcir',
        "\u2A7B": 'ltquest',
        "\u2A7C": 'gtquest',
        "\u2A7D": 'les',
        "\u2A7D\u0338": 'nles',
        "\u2A7E": 'ges',
        "\u2A7E\u0338": 'nges',
        "\u2A7F": 'lesdot',
        "\u2A80": 'gesdot',
        "\u2A81": 'lesdoto',
        "\u2A82": 'gesdoto',
        "\u2A83": 'lesdotor',
        "\u2A84": 'gesdotol',
        "\u2A85": 'lap',
        "\u2A86": 'gap',
        "\u2A87": 'lne',
        "\u2A88": 'gne',
        "\u2A89": 'lnap',
        "\u2A8A": 'gnap',
        "\u2A8B": 'lEg',
        "\u2A8C": 'gEl',
        "\u2A8D": 'lsime',
        "\u2A8E": 'gsime',
        "\u2A8F": 'lsimg',
        "\u2A90": 'gsiml',
        "\u2A91": 'lgE',
        "\u2A92": 'glE',
        "\u2A93": 'lesges',
        "\u2A94": 'gesles',
        "\u2A95": 'els',
        "\u2A96": 'egs',
        "\u2A97": 'elsdot',
        "\u2A98": 'egsdot',
        "\u2A99": 'el',
        "\u2A9A": 'eg',
        "\u2A9D": 'siml',
        "\u2A9E": 'simg',
        "\u2A9F": 'simlE',
        "\u2AA0": 'simgE',
        "\u2AA1": 'LessLess',
        "\u2AA1\u0338": 'NotNestedLessLess',
        "\u2AA2": 'GreaterGreater',
        "\u2AA2\u0338": 'NotNestedGreaterGreater',
        "\u2AA4": 'glj',
        "\u2AA5": 'gla',
        "\u2AA6": 'ltcc',
        "\u2AA7": 'gtcc',
        "\u2AA8": 'lescc',
        "\u2AA9": 'gescc',
        "\u2AAA": 'smt',
        "\u2AAB": 'lat',
        "\u2AAC": 'smte',
        "\u2AAC\uFE00": 'smtes',
        "\u2AAD": 'late',
        "\u2AAD\uFE00": 'lates',
        "\u2AAE": 'bumpE',
        "\u2AAF": 'pre',
        "\u2AAF\u0338": 'npre',
        "\u2AB0": 'sce',
        "\u2AB0\u0338": 'nsce',
        "\u2AB3": 'prE',
        "\u2AB4": 'scE',
        "\u2AB5": 'prnE',
        "\u2AB6": 'scnE',
        "\u2AB7": 'prap',
        "\u2AB8": 'scap',
        "\u2AB9": 'prnap',
        "\u2ABA": 'scnap',
        "\u2ABB": 'Pr',
        "\u2ABC": 'Sc',
        "\u2ABD": 'subdot',
        "\u2ABE": 'supdot',
        "\u2ABF": 'subplus',
        "\u2AC0": 'supplus',
        "\u2AC1": 'submult',
        "\u2AC2": 'supmult',
        "\u2AC3": 'subedot',
        "\u2AC4": 'supedot',
        "\u2AC5": 'subE',
        "\u2AC5\u0338": 'nsubE',
        "\u2AC6": 'supE',
        "\u2AC6\u0338": 'nsupE',
        "\u2AC7": 'subsim',
        "\u2AC8": 'supsim',
        "\u2ACB\uFE00": 'vsubnE',
        "\u2ACB": 'subnE',
        "\u2ACC\uFE00": 'vsupnE',
        "\u2ACC": 'supnE',
        "\u2ACF": 'csub',
        "\u2AD0": 'csup',
        "\u2AD1": 'csube',
        "\u2AD2": 'csupe',
        "\u2AD3": 'subsup',
        "\u2AD4": 'supsub',
        "\u2AD5": 'subsub',
        "\u2AD6": 'supsup',
        "\u2AD7": 'suphsub',
        "\u2AD8": 'supdsub',
        "\u2AD9": 'forkv',
        "\u2ADA": 'topfork',
        "\u2ADB": 'mlcp',
        "\u2AE4": 'Dashv',
        "\u2AE6": 'Vdashl',
        "\u2AE7": 'Barv',
        "\u2AE8": 'vBar',
        "\u2AE9": 'vBarv',
        "\u2AEB": 'Vbar',
        "\u2AEC": 'Not',
        "\u2AED": 'bNot',
        "\u2AEE": 'rnmid',
        "\u2AEF": 'cirmid',
        "\u2AF0": 'midcir',
        "\u2AF1": 'topcir',
        "\u2AF2": 'nhpar',
        "\u2AF3": 'parsim',
        "\u2AFD": 'parsl',
        "\u2AFD\u20E5": 'nparsl',
        "\u266D": 'flat',
        "\u266E": 'natur',
        "\u266F": 'sharp',
        '\xA4': 'curren',
        '\xA2': 'cent',
        '$': 'dollar',
        '\xA3': 'pound',
        '\xA5': 'yen',
        "\u20AC": 'euro',
        '\xB9': 'sup1',
        '\xBD': 'half',
        "\u2153": 'frac13',
        '\xBC': 'frac14',
        "\u2155": 'frac15',
        "\u2159": 'frac16',
        "\u215B": 'frac18',
        '\xB2': 'sup2',
        "\u2154": 'frac23',
        "\u2156": 'frac25',
        '\xB3': 'sup3',
        '\xBE': 'frac34',
        "\u2157": 'frac35',
        "\u215C": 'frac38',
        "\u2158": 'frac45',
        "\u215A": 'frac56',
        "\u215D": 'frac58',
        "\u215E": 'frac78',
        "\uD835\uDCB6": 'ascr',
        "\uD835\uDD52": 'aopf',
        "\uD835\uDD1E": 'afr',
        "\uD835\uDD38": 'Aopf',
        "\uD835\uDD04": 'Afr',
        "\uD835\uDC9C": 'Ascr',
        '\xAA': 'ordf',
        '\xE1': 'aacute',
        '\xC1': 'Aacute',
        '\xE0': 'agrave',
        '\xC0': 'Agrave',
        "\u0103": 'abreve',
        "\u0102": 'Abreve',
        '\xE2': 'acirc',
        '\xC2': 'Acirc',
        '\xE5': 'aring',
        '\xC5': 'angst',
        '\xE4': 'auml',
        '\xC4': 'Auml',
        '\xE3': 'atilde',
        '\xC3': 'Atilde',
        "\u0105": 'aogon',
        "\u0104": 'Aogon',
        "\u0101": 'amacr',
        "\u0100": 'Amacr',
        '\xE6': 'aelig',
        '\xC6': 'AElig',
        "\uD835\uDCB7": 'bscr',
        "\uD835\uDD53": 'bopf',
        "\uD835\uDD1F": 'bfr',
        "\uD835\uDD39": 'Bopf',
        "\u212C": 'Bscr',
        "\uD835\uDD05": 'Bfr',
        "\uD835\uDD20": 'cfr',
        "\uD835\uDCB8": 'cscr',
        "\uD835\uDD54": 'copf',
        "\u212D": 'Cfr',
        "\uD835\uDC9E": 'Cscr',
        "\u2102": 'Copf',
        "\u0107": 'cacute',
        "\u0106": 'Cacute',
        "\u0109": 'ccirc',
        "\u0108": 'Ccirc',
        "\u010D": 'ccaron',
        "\u010C": 'Ccaron',
        "\u010B": 'cdot',
        "\u010A": 'Cdot',
        '\xE7': 'ccedil',
        '\xC7': 'Ccedil',
        "\u2105": 'incare',
        "\uD835\uDD21": 'dfr',
        "\u2146": 'dd',
        "\uD835\uDD55": 'dopf',
        "\uD835\uDCB9": 'dscr',
        "\uD835\uDC9F": 'Dscr',
        "\uD835\uDD07": 'Dfr',
        "\u2145": 'DD',
        "\uD835\uDD3B": 'Dopf',
        "\u010F": 'dcaron',
        "\u010E": 'Dcaron',
        "\u0111": 'dstrok',
        "\u0110": 'Dstrok',
        '\xF0': 'eth',
        '\xD0': 'ETH',
        "\u2147": 'ee',
        "\u212F": 'escr',
        "\uD835\uDD22": 'efr',
        "\uD835\uDD56": 'eopf',
        "\u2130": 'Escr',
        "\uD835\uDD08": 'Efr',
        "\uD835\uDD3C": 'Eopf',
        '\xE9': 'eacute',
        '\xC9': 'Eacute',
        '\xE8': 'egrave',
        '\xC8': 'Egrave',
        '\xEA': 'ecirc',
        '\xCA': 'Ecirc',
        "\u011B": 'ecaron',
        "\u011A": 'Ecaron',
        '\xEB': 'euml',
        '\xCB': 'Euml',
        "\u0117": 'edot',
        "\u0116": 'Edot',
        "\u0119": 'eogon',
        "\u0118": 'Eogon',
        "\u0113": 'emacr',
        "\u0112": 'Emacr',
        "\uD835\uDD23": 'ffr',
        "\uD835\uDD57": 'fopf',
        "\uD835\uDCBB": 'fscr',
        "\uD835\uDD09": 'Ffr',
        "\uD835\uDD3D": 'Fopf',
        "\u2131": 'Fscr',
        "\uFB00": 'fflig',
        "\uFB03": 'ffilig',
        "\uFB04": 'ffllig',
        "\uFB01": 'filig',
        'fj': 'fjlig',
        "\uFB02": 'fllig',
        "\u0192": 'fnof',
        "\u210A": 'gscr',
        "\uD835\uDD58": 'gopf',
        "\uD835\uDD24": 'gfr',
        "\uD835\uDCA2": 'Gscr',
        "\uD835\uDD3E": 'Gopf',
        "\uD835\uDD0A": 'Gfr',
        "\u01F5": 'gacute',
        "\u011F": 'gbreve',
        "\u011E": 'Gbreve',
        "\u011D": 'gcirc',
        "\u011C": 'Gcirc',
        "\u0121": 'gdot',
        "\u0120": 'Gdot',
        "\u0122": 'Gcedil',
        "\uD835\uDD25": 'hfr',
        "\u210E": 'planckh',
        "\uD835\uDCBD": 'hscr',
        "\uD835\uDD59": 'hopf',
        "\u210B": 'Hscr',
        "\u210C": 'Hfr',
        "\u210D": 'Hopf',
        "\u0125": 'hcirc',
        "\u0124": 'Hcirc',
        "\u210F": 'hbar',
        "\u0127": 'hstrok',
        "\u0126": 'Hstrok',
        "\uD835\uDD5A": 'iopf',
        "\uD835\uDD26": 'ifr',
        "\uD835\uDCBE": 'iscr',
        "\u2148": 'ii',
        "\uD835\uDD40": 'Iopf',
        "\u2110": 'Iscr',
        "\u2111": 'Im',
        '\xED': 'iacute',
        '\xCD': 'Iacute',
        '\xEC': 'igrave',
        '\xCC': 'Igrave',
        '\xEE': 'icirc',
        '\xCE': 'Icirc',
        '\xEF': 'iuml',
        '\xCF': 'Iuml',
        "\u0129": 'itilde',
        "\u0128": 'Itilde',
        "\u0130": 'Idot',
        "\u012F": 'iogon',
        "\u012E": 'Iogon',
        "\u012B": 'imacr',
        "\u012A": 'Imacr',
        "\u0133": 'ijlig',
        "\u0132": 'IJlig',
        "\u0131": 'imath',
        "\uD835\uDCBF": 'jscr',
        "\uD835\uDD5B": 'jopf',
        "\uD835\uDD27": 'jfr',
        "\uD835\uDCA5": 'Jscr',
        "\uD835\uDD0D": 'Jfr',
        "\uD835\uDD41": 'Jopf',
        "\u0135": 'jcirc',
        "\u0134": 'Jcirc',
        "\u0237": 'jmath',
        "\uD835\uDD5C": 'kopf',
        "\uD835\uDCC0": 'kscr',
        "\uD835\uDD28": 'kfr',
        "\uD835\uDCA6": 'Kscr',
        "\uD835\uDD42": 'Kopf',
        "\uD835\uDD0E": 'Kfr',
        "\u0137": 'kcedil',
        "\u0136": 'Kcedil',
        "\uD835\uDD29": 'lfr',
        "\uD835\uDCC1": 'lscr',
        "\u2113": 'ell',
        "\uD835\uDD5D": 'lopf',
        "\u2112": 'Lscr',
        "\uD835\uDD0F": 'Lfr',
        "\uD835\uDD43": 'Lopf',
        "\u013A": 'lacute',
        "\u0139": 'Lacute',
        "\u013E": 'lcaron',
        "\u013D": 'Lcaron',
        "\u013C": 'lcedil',
        "\u013B": 'Lcedil',
        "\u0142": 'lstrok',
        "\u0141": 'Lstrok',
        "\u0140": 'lmidot',
        "\u013F": 'Lmidot',
        "\uD835\uDD2A": 'mfr',
        "\uD835\uDD5E": 'mopf',
        "\uD835\uDCC2": 'mscr',
        "\uD835\uDD10": 'Mfr',
        "\uD835\uDD44": 'Mopf',
        "\u2133": 'Mscr',
        "\uD835\uDD2B": 'nfr',
        "\uD835\uDD5F": 'nopf',
        "\uD835\uDCC3": 'nscr',
        "\u2115": 'Nopf',
        "\uD835\uDCA9": 'Nscr',
        "\uD835\uDD11": 'Nfr',
        "\u0144": 'nacute',
        "\u0143": 'Nacute',
        "\u0148": 'ncaron',
        "\u0147": 'Ncaron',
        '\xF1': 'ntilde',
        '\xD1': 'Ntilde',
        "\u0146": 'ncedil',
        "\u0145": 'Ncedil',
        "\u2116": 'numero',
        "\u014B": 'eng',
        "\u014A": 'ENG',
        "\uD835\uDD60": 'oopf',
        "\uD835\uDD2C": 'ofr',
        "\u2134": 'oscr',
        "\uD835\uDCAA": 'Oscr',
        "\uD835\uDD12": 'Ofr',
        "\uD835\uDD46": 'Oopf',
        '\xBA': 'ordm',
        '\xF3': 'oacute',
        '\xD3': 'Oacute',
        '\xF2': 'ograve',
        '\xD2': 'Ograve',
        '\xF4': 'ocirc',
        '\xD4': 'Ocirc',
        '\xF6': 'ouml',
        '\xD6': 'Ouml',
        "\u0151": 'odblac',
        "\u0150": 'Odblac',
        '\xF5': 'otilde',
        '\xD5': 'Otilde',
        '\xF8': 'oslash',
        '\xD8': 'Oslash',
        "\u014D": 'omacr',
        "\u014C": 'Omacr',
        "\u0153": 'oelig',
        "\u0152": 'OElig',
        "\uD835\uDD2D": 'pfr',
        "\uD835\uDCC5": 'pscr',
        "\uD835\uDD61": 'popf',
        "\u2119": 'Popf',
        "\uD835\uDD13": 'Pfr',
        "\uD835\uDCAB": 'Pscr',
        "\uD835\uDD62": 'qopf',
        "\uD835\uDD2E": 'qfr',
        "\uD835\uDCC6": 'qscr',
        "\uD835\uDCAC": 'Qscr',
        "\uD835\uDD14": 'Qfr',
        "\u211A": 'Qopf',
        "\u0138": 'kgreen',
        "\uD835\uDD2F": 'rfr',
        "\uD835\uDD63": 'ropf',
        "\uD835\uDCC7": 'rscr',
        "\u211B": 'Rscr',
        "\u211C": 'Re',
        "\u211D": 'Ropf',
        "\u0155": 'racute',
        "\u0154": 'Racute',
        "\u0159": 'rcaron',
        "\u0158": 'Rcaron',
        "\u0157": 'rcedil',
        "\u0156": 'Rcedil',
        "\uD835\uDD64": 'sopf',
        "\uD835\uDCC8": 'sscr',
        "\uD835\uDD30": 'sfr',
        "\uD835\uDD4A": 'Sopf',
        "\uD835\uDD16": 'Sfr',
        "\uD835\uDCAE": 'Sscr',
        "\u24C8": 'oS',
        "\u015B": 'sacute',
        "\u015A": 'Sacute',
        "\u015D": 'scirc',
        "\u015C": 'Scirc',
        "\u0161": 'scaron',
        "\u0160": 'Scaron',
        "\u015F": 'scedil',
        "\u015E": 'Scedil',
        '\xDF': 'szlig',
        "\uD835\uDD31": 'tfr',
        "\uD835\uDCC9": 'tscr',
        "\uD835\uDD65": 'topf',
        "\uD835\uDCAF": 'Tscr',
        "\uD835\uDD17": 'Tfr',
        "\uD835\uDD4B": 'Topf',
        "\u0165": 'tcaron',
        "\u0164": 'Tcaron',
        "\u0163": 'tcedil',
        "\u0162": 'Tcedil',
        "\u2122": 'trade',
        "\u0167": 'tstrok',
        "\u0166": 'Tstrok',
        "\uD835\uDCCA": 'uscr',
        "\uD835\uDD66": 'uopf',
        "\uD835\uDD32": 'ufr',
        "\uD835\uDD4C": 'Uopf',
        "\uD835\uDD18": 'Ufr',
        "\uD835\uDCB0": 'Uscr',
        '\xFA': 'uacute',
        '\xDA': 'Uacute',
        '\xF9': 'ugrave',
        '\xD9': 'Ugrave',
        "\u016D": 'ubreve',
        "\u016C": 'Ubreve',
        '\xFB': 'ucirc',
        '\xDB': 'Ucirc',
        "\u016F": 'uring',
        "\u016E": 'Uring',
        '\xFC': 'uuml',
        '\xDC': 'Uuml',
        "\u0171": 'udblac',
        "\u0170": 'Udblac',
        "\u0169": 'utilde',
        "\u0168": 'Utilde',
        "\u0173": 'uogon',
        "\u0172": 'Uogon',
        "\u016B": 'umacr',
        "\u016A": 'Umacr',
        "\uD835\uDD33": 'vfr',
        "\uD835\uDD67": 'vopf',
        "\uD835\uDCCB": 'vscr',
        "\uD835\uDD19": 'Vfr',
        "\uD835\uDD4D": 'Vopf',
        "\uD835\uDCB1": 'Vscr',
        "\uD835\uDD68": 'wopf',
        "\uD835\uDCCC": 'wscr',
        "\uD835\uDD34": 'wfr',
        "\uD835\uDCB2": 'Wscr',
        "\uD835\uDD4E": 'Wopf',
        "\uD835\uDD1A": 'Wfr',
        "\u0175": 'wcirc',
        "\u0174": 'Wcirc',
        "\uD835\uDD35": 'xfr',
        "\uD835\uDCCD": 'xscr',
        "\uD835\uDD69": 'xopf',
        "\uD835\uDD4F": 'Xopf',
        "\uD835\uDD1B": 'Xfr',
        "\uD835\uDCB3": 'Xscr',
        "\uD835\uDD36": 'yfr',
        "\uD835\uDCCE": 'yscr',
        "\uD835\uDD6A": 'yopf',
        "\uD835\uDCB4": 'Yscr',
        "\uD835\uDD1C": 'Yfr',
        "\uD835\uDD50": 'Yopf',
        '\xFD': 'yacute',
        '\xDD': 'Yacute',
        "\u0177": 'ycirc',
        "\u0176": 'Ycirc',
        '\xFF': 'yuml',
        "\u0178": 'Yuml',
        "\uD835\uDCCF": 'zscr',
        "\uD835\uDD37": 'zfr',
        "\uD835\uDD6B": 'zopf',
        "\u2128": 'Zfr',
        "\u2124": 'Zopf',
        "\uD835\uDCB5": 'Zscr',
        "\u017A": 'zacute',
        "\u0179": 'Zacute',
        "\u017E": 'zcaron',
        "\u017D": 'Zcaron',
        "\u017C": 'zdot',
        "\u017B": 'Zdot',
        "\u01B5": 'imped',
        '\xFE': 'thorn',
        '\xDE': 'THORN',
        "\u0149": 'napos',
        "\u03B1": 'alpha',
        "\u0391": 'Alpha',
        "\u03B2": 'beta',
        "\u0392": 'Beta',
        "\u03B3": 'gamma',
        "\u0393": 'Gamma',
        "\u03B4": 'delta',
        "\u0394": 'Delta',
        "\u03B5": 'epsi',
        "\u03F5": 'epsiv',
        "\u0395": 'Epsilon',
        "\u03DD": 'gammad',
        "\u03DC": 'Gammad',
        "\u03B6": 'zeta',
        "\u0396": 'Zeta',
        "\u03B7": 'eta',
        "\u0397": 'Eta',
        "\u03B8": 'theta',
        "\u03D1": 'thetav',
        "\u0398": 'Theta',
        "\u03B9": 'iota',
        "\u0399": 'Iota',
        "\u03BA": 'kappa',
        "\u03F0": 'kappav',
        "\u039A": 'Kappa',
        "\u03BB": 'lambda',
        "\u039B": 'Lambda',
        "\u03BC": 'mu',
        '\xB5': 'micro',
        "\u039C": 'Mu',
        "\u03BD": 'nu',
        "\u039D": 'Nu',
        "\u03BE": 'xi',
        "\u039E": 'Xi',
        "\u03BF": 'omicron',
        "\u039F": 'Omicron',
        "\u03C0": 'pi',
        "\u03D6": 'piv',
        "\u03A0": 'Pi',
        "\u03C1": 'rho',
        "\u03F1": 'rhov',
        "\u03A1": 'Rho',
        "\u03C3": 'sigma',
        "\u03A3": 'Sigma',
        "\u03C2": 'sigmaf',
        "\u03C4": 'tau',
        "\u03A4": 'Tau',
        "\u03C5": 'upsi',
        "\u03A5": 'Upsilon',
        "\u03D2": 'Upsi',
        "\u03C6": 'phi',
        "\u03D5": 'phiv',
        "\u03A6": 'Phi',
        "\u03C7": 'chi',
        "\u03A7": 'Chi',
        "\u03C8": 'psi',
        "\u03A8": 'Psi',
        "\u03C9": 'omega',
        "\u03A9": 'ohm',
        "\u0430": 'acy',
        "\u0410": 'Acy',
        "\u0431": 'bcy',
        "\u0411": 'Bcy',
        "\u0432": 'vcy',
        "\u0412": 'Vcy',
        "\u0433": 'gcy',
        "\u0413": 'Gcy',
        "\u0453": 'gjcy',
        "\u0403": 'GJcy',
        "\u0434": 'dcy',
        "\u0414": 'Dcy',
        "\u0452": 'djcy',
        "\u0402": 'DJcy',
        "\u0435": 'iecy',
        "\u0415": 'IEcy',
        "\u0451": 'iocy',
        "\u0401": 'IOcy',
        "\u0454": 'jukcy',
        "\u0404": 'Jukcy',
        "\u0436": 'zhcy',
        "\u0416": 'ZHcy',
        "\u0437": 'zcy',
        "\u0417": 'Zcy',
        "\u0455": 'dscy',
        "\u0405": 'DScy',
        "\u0438": 'icy',
        "\u0418": 'Icy',
        "\u0456": 'iukcy',
        "\u0406": 'Iukcy',
        "\u0457": 'yicy',
        "\u0407": 'YIcy',
        "\u0439": 'jcy',
        "\u0419": 'Jcy',
        "\u0458": 'jsercy',
        "\u0408": 'Jsercy',
        "\u043A": 'kcy',
        "\u041A": 'Kcy',
        "\u045C": 'kjcy',
        "\u040C": 'KJcy',
        "\u043B": 'lcy',
        "\u041B": 'Lcy',
        "\u0459": 'ljcy',
        "\u0409": 'LJcy',
        "\u043C": 'mcy',
        "\u041C": 'Mcy',
        "\u043D": 'ncy',
        "\u041D": 'Ncy',
        "\u045A": 'njcy',
        "\u040A": 'NJcy',
        "\u043E": 'ocy',
        "\u041E": 'Ocy',
        "\u043F": 'pcy',
        "\u041F": 'Pcy',
        "\u0440": 'rcy',
        "\u0420": 'Rcy',
        "\u0441": 'scy',
        "\u0421": 'Scy',
        "\u0442": 'tcy',
        "\u0422": 'Tcy',
        "\u045B": 'tshcy',
        "\u040B": 'TSHcy',
        "\u0443": 'ucy',
        "\u0423": 'Ucy',
        "\u045E": 'ubrcy',
        "\u040E": 'Ubrcy',
        "\u0444": 'fcy',
        "\u0424": 'Fcy',
        "\u0445": 'khcy',
        "\u0425": 'KHcy',
        "\u0446": 'tscy',
        "\u0426": 'TScy',
        "\u0447": 'chcy',
        "\u0427": 'CHcy',
        "\u045F": 'dzcy',
        "\u040F": 'DZcy',
        "\u0448": 'shcy',
        "\u0428": 'SHcy',
        "\u0449": 'shchcy',
        "\u0429": 'SHCHcy',
        "\u044A": 'hardcy',
        "\u042A": 'HARDcy',
        "\u044B": 'ycy',
        "\u042B": 'Ycy',
        "\u044C": 'softcy',
        "\u042C": 'SOFTcy',
        "\u044D": 'ecy',
        "\u042D": 'Ecy',
        "\u044E": 'yucy',
        "\u042E": 'YUcy',
        "\u044F": 'yacy',
        "\u042F": 'YAcy',
        "\u2135": 'aleph',
        "\u2136": 'beth',
        "\u2137": 'gimel',
        "\u2138": 'daleth'
      };
      var regexEscape = /["&'<>`]/g;
      var escapeMap = {
        '"': '&quot;',
        '&': '&amp;',
        '\'': '&#x27;',
        '<': '&lt;',
        // See https://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
        // following is not strictly necessary unless it’s part of a tag or an
        // unquoted attribute value. We’re only escaping it to support those
        // situations, and for XML support.
        '>': '&gt;',
        // In Internet Explorer ≤ 8, the backtick character can be used
        // to break out of (un)quoted attribute values or HTML comments.
        // See http://html5sec.org/#102, http://html5sec.org/#108, and
        // http://html5sec.org/#133.
        '`': '&#x60;'
      };
      var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
      var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
      var regexDecode = /&(CounterClockwiseContourIntegral|DoubleLongLeftRightArrow|ClockwiseContourIntegral|NotNestedGreaterGreater|NotSquareSupersetEqual|DiacriticalDoubleAcute|NotRightTriangleEqual|NotSucceedsSlantEqual|NotPrecedesSlantEqual|CloseCurlyDoubleQuote|NegativeVeryThinSpace|DoubleContourIntegral|FilledVerySmallSquare|CapitalDifferentialD|OpenCurlyDoubleQuote|EmptyVerySmallSquare|NestedGreaterGreater|DoubleLongRightArrow|NotLeftTriangleEqual|NotGreaterSlantEqual|ReverseUpEquilibrium|DoubleLeftRightArrow|NotSquareSubsetEqual|NotDoubleVerticalBar|RightArrowLeftArrow|NotGreaterFullEqual|NotRightTriangleBar|SquareSupersetEqual|DownLeftRightVector|DoubleLongLeftArrow|leftrightsquigarrow|LeftArrowRightArrow|NegativeMediumSpace|blacktriangleright|RightDownVectorBar|PrecedesSlantEqual|RightDoubleBracket|SucceedsSlantEqual|NotLeftTriangleBar|RightTriangleEqual|SquareIntersection|RightDownTeeVector|ReverseEquilibrium|NegativeThickSpace|longleftrightarrow|Longleftrightarrow|LongLeftRightArrow|DownRightTeeVector|DownRightVectorBar|GreaterSlantEqual|SquareSubsetEqual|LeftDownVectorBar|LeftDoubleBracket|VerticalSeparator|rightleftharpoons|NotGreaterGreater|NotSquareSuperset|blacktriangleleft|blacktriangledown|NegativeThinSpace|LeftDownTeeVector|NotLessSlantEqual|leftrightharpoons|DoubleUpDownArrow|DoubleVerticalBar|LeftTriangleEqual|FilledSmallSquare|twoheadrightarrow|NotNestedLessLess|DownLeftTeeVector|DownLeftVectorBar|RightAngleBracket|NotTildeFullEqual|NotReverseElement|RightUpDownVector|DiacriticalTilde|NotSucceedsTilde|circlearrowright|NotPrecedesEqual|rightharpoondown|DoubleRightArrow|NotSucceedsEqual|NonBreakingSpace|NotRightTriangle|LessEqualGreater|RightUpTeeVector|LeftAngleBracket|GreaterFullEqual|DownArrowUpArrow|RightUpVectorBar|twoheadleftarrow|GreaterEqualLess|downharpoonright|RightTriangleBar|ntrianglerighteq|NotSupersetEqual|LeftUpDownVector|DiacriticalAcute|rightrightarrows|vartriangleright|UpArrowDownArrow|DiacriticalGrave|UnderParenthesis|EmptySmallSquare|LeftUpVectorBar|leftrightarrows|DownRightVector|downharpoonleft|trianglerighteq|ShortRightArrow|OverParenthesis|DoubleLeftArrow|DoubleDownArrow|NotSquareSubset|bigtriangledown|ntrianglelefteq|UpperRightArrow|curvearrowright|vartriangleleft|NotLeftTriangle|nleftrightarrow|LowerRightArrow|NotHumpDownHump|NotGreaterTilde|rightthreetimes|LeftUpTeeVector|NotGreaterEqual|straightepsilon|LeftTriangleBar|rightsquigarrow|ContourIntegral|rightleftarrows|CloseCurlyQuote|RightDownVector|LeftRightVector|nLeftrightarrow|leftharpoondown|circlearrowleft|SquareSuperset|OpenCurlyQuote|hookrightarrow|HorizontalLine|DiacriticalDot|NotLessGreater|ntriangleright|DoubleRightTee|InvisibleComma|InvisibleTimes|LowerLeftArrow|DownLeftVector|NotSubsetEqual|curvearrowleft|trianglelefteq|NotVerticalBar|TildeFullEqual|downdownarrows|NotGreaterLess|RightTeeVector|ZeroWidthSpace|looparrowright|LongRightArrow|doublebarwedge|ShortLeftArrow|ShortDownArrow|RightVectorBar|GreaterGreater|ReverseElement|rightharpoonup|LessSlantEqual|leftthreetimes|upharpoonright|rightarrowtail|LeftDownVector|Longrightarrow|NestedLessLess|UpperLeftArrow|nshortparallel|leftleftarrows|leftrightarrow|Leftrightarrow|LeftRightArrow|longrightarrow|upharpoonleft|RightArrowBar|ApplyFunction|LeftTeeVector|leftarrowtail|NotEqualTilde|varsubsetneqq|varsupsetneqq|RightTeeArrow|SucceedsEqual|SucceedsTilde|LeftVectorBar|SupersetEqual|hookleftarrow|DifferentialD|VerticalTilde|VeryThinSpace|blacktriangle|bigtriangleup|LessFullEqual|divideontimes|leftharpoonup|UpEquilibrium|ntriangleleft|RightTriangle|measuredangle|shortparallel|longleftarrow|Longleftarrow|LongLeftArrow|DoubleLeftTee|Poincareplane|PrecedesEqual|triangleright|DoubleUpArrow|RightUpVector|fallingdotseq|looparrowleft|PrecedesTilde|NotTildeEqual|NotTildeTilde|smallsetminus|Proportional|triangleleft|triangledown|UnderBracket|NotHumpEqual|exponentiale|ExponentialE|NotLessTilde|HilbertSpace|RightCeiling|blacklozenge|varsupsetneq|HumpDownHump|GreaterEqual|VerticalLine|LeftTeeArrow|NotLessEqual|DownTeeArrow|LeftTriangle|varsubsetneq|Intersection|NotCongruent|DownArrowBar|LeftUpVector|LeftArrowBar|risingdotseq|GreaterTilde|RoundImplies|SquareSubset|ShortUpArrow|NotSuperset|quaternions|precnapprox|backepsilon|preccurlyeq|OverBracket|blacksquare|MediumSpace|VerticalBar|circledcirc|circleddash|CircleMinus|CircleTimes|LessGreater|curlyeqprec|curlyeqsucc|diamondsuit|UpDownArrow|Updownarrow|RuleDelayed|Rrightarrow|updownarrow|RightVector|nRightarrow|nrightarrow|eqslantless|LeftCeiling|Equilibrium|SmallCircle|expectation|NotSucceeds|thickapprox|GreaterLess|SquareUnion|NotPrecedes|NotLessLess|straightphi|succnapprox|succcurlyeq|SubsetEqual|sqsupseteq|Proportion|Laplacetrf|ImaginaryI|supsetneqq|NotGreater|gtreqqless|NotElement|ThickSpace|TildeEqual|TildeTilde|Fouriertrf|rmoustache|EqualTilde|eqslantgtr|UnderBrace|LeftVector|UpArrowBar|nLeftarrow|nsubseteqq|subsetneqq|nsupseteqq|nleftarrow|succapprox|lessapprox|UpTeeArrow|upuparrows|curlywedge|lesseqqgtr|varepsilon|varnothing|RightFloor|complement|CirclePlus|sqsubseteq|Lleftarrow|circledast|RightArrow|Rightarrow|rightarrow|lmoustache|Bernoullis|precapprox|mapstoleft|mapstodown|longmapsto|dotsquare|downarrow|DoubleDot|nsubseteq|supsetneq|leftarrow|nsupseteq|subsetneq|ThinSpace|ngeqslant|subseteqq|HumpEqual|NotSubset|triangleq|NotCupCap|lesseqgtr|heartsuit|TripleDot|Leftarrow|Coproduct|Congruent|varpropto|complexes|gvertneqq|LeftArrow|LessTilde|supseteqq|MinusPlus|CircleDot|nleqslant|NotExists|gtreqless|nparallel|UnionPlus|LeftFloor|checkmark|CenterDot|centerdot|Mellintrf|gtrapprox|bigotimes|OverBrace|spadesuit|therefore|pitchfork|rationals|PlusMinus|Backslash|Therefore|DownBreve|backsimeq|backprime|DownArrow|nshortmid|Downarrow|lvertneqq|eqvparsl|imagline|imagpart|infintie|integers|Integral|intercal|LessLess|Uarrocir|intlarhk|sqsupset|angmsdaf|sqsubset|llcorner|vartheta|cupbrcap|lnapprox|Superset|SuchThat|succnsim|succneqq|angmsdag|biguplus|curlyvee|trpezium|Succeeds|NotTilde|bigwedge|angmsdah|angrtvbd|triminus|cwconint|fpartint|lrcorner|smeparsl|subseteq|urcorner|lurdshar|laemptyv|DDotrahd|approxeq|ldrushar|awconint|mapstoup|backcong|shortmid|triangle|geqslant|gesdotol|timesbar|circledR|circledS|setminus|multimap|naturals|scpolint|ncongdot|RightTee|boxminus|gnapprox|boxtimes|andslope|thicksim|angmsdaa|varsigma|cirfnint|rtriltri|angmsdab|rppolint|angmsdac|barwedge|drbkarow|clubsuit|thetasym|bsolhsub|capbrcup|dzigrarr|doteqdot|DotEqual|dotminus|UnderBar|NotEqual|realpart|otimesas|ulcorner|hksearow|hkswarow|parallel|PartialD|elinters|emptyset|plusacir|bbrktbrk|angmsdad|pointint|bigoplus|angmsdae|Precedes|bigsqcup|varkappa|notindot|supseteq|precneqq|precnsim|profalar|profline|profsurf|leqslant|lesdotor|raemptyv|subplus|notnivb|notnivc|subrarr|zigrarr|vzigzag|submult|subedot|Element|between|cirscir|larrbfs|larrsim|lotimes|lbrksld|lbrkslu|lozenge|ldrdhar|dbkarow|bigcirc|epsilon|simrarr|simplus|ltquest|Epsilon|luruhar|gtquest|maltese|npolint|eqcolon|npreceq|bigodot|ddagger|gtrless|bnequiv|harrcir|ddotseq|equivDD|backsim|demptyv|nsqsube|nsqsupe|Upsilon|nsubset|upsilon|minusdu|nsucceq|swarrow|nsupset|coloneq|searrow|boxplus|napprox|natural|asympeq|alefsym|congdot|nearrow|bigstar|diamond|supplus|tritime|LeftTee|nvinfin|triplus|NewLine|nvltrie|nvrtrie|nwarrow|nexists|Diamond|ruluhar|Implies|supmult|angzarr|suplarr|suphsub|questeq|because|digamma|Because|olcross|bemptyv|omicron|Omicron|rotimes|NoBreak|intprod|angrtvb|orderof|uwangle|suphsol|lesdoto|orslope|DownTee|realine|cudarrl|rdldhar|OverBar|supedot|lessdot|supdsub|topfork|succsim|rbrkslu|rbrksld|pertenk|cudarrr|isindot|planckh|lessgtr|pluscir|gesdoto|plussim|plustwo|lesssim|cularrp|rarrsim|Cayleys|notinva|notinvb|notinvc|UpArrow|Uparrow|uparrow|NotLess|dwangle|precsim|Product|curarrm|Cconint|dotplus|rarrbfs|ccupssm|Cedilla|cemptyv|notniva|quatint|frac35|frac38|frac45|frac56|frac58|frac78|tridot|xoplus|gacute|gammad|Gammad|lfisht|lfloor|bigcup|sqsupe|gbreve|Gbreve|lharul|sqsube|sqcups|Gcedil|apacir|llhard|lmidot|Lmidot|lmoust|andand|sqcaps|approx|Abreve|spades|circeq|tprime|divide|topcir|Assign|topbot|gesdot|divonx|xuplus|timesd|gesles|atilde|solbar|SOFTcy|loplus|timesb|lowast|lowbar|dlcorn|dlcrop|softcy|dollar|lparlt|thksim|lrhard|Atilde|lsaquo|smashp|bigvee|thinsp|wreath|bkarow|lsquor|lstrok|Lstrok|lthree|ltimes|ltlarr|DotDot|simdot|ltrPar|weierp|xsqcup|angmsd|sigmav|sigmaf|zeetrf|Zcaron|zcaron|mapsto|vsupne|thetav|cirmid|marker|mcomma|Zacute|vsubnE|there4|gtlPar|vsubne|bottom|gtrarr|SHCHcy|shchcy|midast|midcir|middot|minusb|minusd|gtrdot|bowtie|sfrown|mnplus|models|colone|seswar|Colone|mstpos|searhk|gtrsim|nacute|Nacute|boxbox|telrec|hairsp|Tcedil|nbumpe|scnsim|ncaron|Ncaron|ncedil|Ncedil|hamilt|Scedil|nearhk|hardcy|HARDcy|tcedil|Tcaron|commat|nequiv|nesear|tcaron|target|hearts|nexist|varrho|scedil|Scaron|scaron|hellip|Sacute|sacute|hercon|swnwar|compfn|rtimes|rthree|rsquor|rsaquo|zacute|wedgeq|homtht|barvee|barwed|Barwed|rpargt|horbar|conint|swarhk|roplus|nltrie|hslash|hstrok|Hstrok|rmoust|Conint|bprime|hybull|hyphen|iacute|Iacute|supsup|supsub|supsim|varphi|coprod|brvbar|agrave|Supset|supset|igrave|Igrave|notinE|Agrave|iiiint|iinfin|copysr|wedbar|Verbar|vangrt|becaus|incare|verbar|inodot|bullet|drcorn|intcal|drcrop|cularr|vellip|Utilde|bumpeq|cupcap|dstrok|Dstrok|CupCap|cupcup|cupdot|eacute|Eacute|supdot|iquest|easter|ecaron|Ecaron|ecolon|isinsv|utilde|itilde|Itilde|curarr|succeq|Bumpeq|cacute|ulcrop|nparsl|Cacute|nprcue|egrave|Egrave|nrarrc|nrarrw|subsup|subsub|nrtrie|jsercy|nsccue|Jsercy|kappav|kcedil|Kcedil|subsim|ulcorn|nsimeq|egsdot|veebar|kgreen|capand|elsdot|Subset|subset|curren|aacute|lacute|Lacute|emptyv|ntilde|Ntilde|lagran|lambda|Lambda|capcap|Ugrave|langle|subdot|emsp13|numero|emsp14|nvdash|nvDash|nVdash|nVDash|ugrave|ufisht|nvHarr|larrfs|nvlArr|larrhk|larrlp|larrpl|nvrArr|Udblac|nwarhk|larrtl|nwnear|oacute|Oacute|latail|lAtail|sstarf|lbrace|odblac|Odblac|lbrack|udblac|odsold|eparsl|lcaron|Lcaron|ograve|Ograve|lcedil|Lcedil|Aacute|ssmile|ssetmn|squarf|ldquor|capcup|ominus|cylcty|rharul|eqcirc|dagger|rfloor|rfisht|Dagger|daleth|equals|origof|capdot|equest|dcaron|Dcaron|rdquor|oslash|Oslash|otilde|Otilde|otimes|Otimes|urcrop|Ubreve|ubreve|Yacute|Uacute|uacute|Rcedil|rcedil|urcorn|parsim|Rcaron|Vdashl|rcaron|Tstrok|percnt|period|permil|Exists|yacute|rbrack|rbrace|phmmat|ccaron|Ccaron|planck|ccedil|plankv|tstrok|female|plusdo|plusdu|ffilig|plusmn|ffllig|Ccedil|rAtail|dfisht|bernou|ratail|Rarrtl|rarrtl|angsph|rarrpl|rarrlp|rarrhk|xwedge|xotime|forall|ForAll|Vvdash|vsupnE|preceq|bigcap|frac12|frac13|frac14|primes|rarrfs|prnsim|frac15|Square|frac16|square|lesdot|frac18|frac23|propto|prurel|rarrap|rangle|puncsp|frac25|Racute|qprime|racute|lesges|frac34|abreve|AElig|eqsim|utdot|setmn|urtri|Equal|Uring|seArr|uring|searr|dashv|Dashv|mumap|nabla|iogon|Iogon|sdote|sdotb|scsim|napid|napos|equiv|natur|Acirc|dblac|erarr|nbump|iprod|erDot|ucirc|awint|esdot|angrt|ncong|isinE|scnap|Scirc|scirc|ndash|isins|Ubrcy|nearr|neArr|isinv|nedot|ubrcy|acute|Ycirc|iukcy|Iukcy|xutri|nesim|caret|jcirc|Jcirc|caron|twixt|ddarr|sccue|exist|jmath|sbquo|ngeqq|angst|ccaps|lceil|ngsim|UpTee|delta|Delta|rtrif|nharr|nhArr|nhpar|rtrie|jukcy|Jukcy|kappa|rsquo|Kappa|nlarr|nlArr|TSHcy|rrarr|aogon|Aogon|fflig|xrarr|tshcy|ccirc|nleqq|filig|upsih|nless|dharl|nlsim|fjlig|ropar|nltri|dharr|robrk|roarr|fllig|fltns|roang|rnmid|subnE|subne|lAarr|trisb|Ccirc|acirc|ccups|blank|VDash|forkv|Vdash|langd|cedil|blk12|blk14|laquo|strns|diams|notin|vDash|larrb|blk34|block|disin|uplus|vdash|vBarv|aelig|starf|Wedge|check|xrArr|lates|lbarr|lBarr|notni|lbbrk|bcong|frasl|lbrke|frown|vrtri|vprop|vnsup|gamma|Gamma|wedge|xodot|bdquo|srarr|doteq|ldquo|boxdl|boxdL|gcirc|Gcirc|boxDl|boxDL|boxdr|boxdR|boxDr|TRADE|trade|rlhar|boxDR|vnsub|npart|vltri|rlarr|boxhd|boxhD|nprec|gescc|nrarr|nrArr|boxHd|boxHD|boxhu|boxhU|nrtri|boxHu|clubs|boxHU|times|colon|Colon|gimel|xlArr|Tilde|nsime|tilde|nsmid|nspar|THORN|thorn|xlarr|nsube|nsubE|thkap|xhArr|comma|nsucc|boxul|boxuL|nsupe|nsupE|gneqq|gnsim|boxUl|boxUL|grave|boxur|boxuR|boxUr|boxUR|lescc|angle|bepsi|boxvh|varpi|boxvH|numsp|Theta|gsime|gsiml|theta|boxVh|boxVH|boxvl|gtcir|gtdot|boxvL|boxVl|boxVL|crarr|cross|Cross|nvsim|boxvr|nwarr|nwArr|sqsup|dtdot|Uogon|lhard|lharu|dtrif|ocirc|Ocirc|lhblk|duarr|odash|sqsub|Hacek|sqcup|llarr|duhar|oelig|OElig|ofcir|boxvR|uogon|lltri|boxVr|csube|uuarr|ohbar|csupe|ctdot|olarr|olcir|harrw|oline|sqcap|omacr|Omacr|omega|Omega|boxVR|aleph|lneqq|lnsim|loang|loarr|rharu|lobrk|hcirc|operp|oplus|rhard|Hcirc|orarr|Union|order|ecirc|Ecirc|cuepr|szlig|cuesc|breve|reals|eDDot|Breve|hoarr|lopar|utrif|rdquo|Umacr|umacr|efDot|swArr|ultri|alpha|rceil|ovbar|swarr|Wcirc|wcirc|smtes|smile|bsemi|lrarr|aring|parsl|lrhar|bsime|uhblk|lrtri|cupor|Aring|uharr|uharl|slarr|rbrke|bsolb|lsime|rbbrk|RBarr|lsimg|phone|rBarr|rbarr|icirc|lsquo|Icirc|emacr|Emacr|ratio|simne|plusb|simlE|simgE|simeq|pluse|ltcir|ltdot|empty|xharr|xdtri|iexcl|Alpha|ltrie|rarrw|pound|ltrif|xcirc|bumpe|prcue|bumpE|asymp|amacr|cuvee|Sigma|sigma|iiint|udhar|iiota|ijlig|IJlig|supnE|imacr|Imacr|prime|Prime|image|prnap|eogon|Eogon|rarrc|mdash|mDDot|cuwed|imath|supne|imped|Amacr|udarr|prsim|micro|rarrb|cwint|raquo|infin|eplus|range|rangd|Ucirc|radic|minus|amalg|veeeq|rAarr|epsiv|ycirc|quest|sharp|quot|zwnj|Qscr|race|qscr|Qopf|qopf|qint|rang|Rang|Zscr|zscr|Zopf|zopf|rarr|rArr|Rarr|Pscr|pscr|prop|prod|prnE|prec|ZHcy|zhcy|prap|Zeta|zeta|Popf|popf|Zdot|plus|zdot|Yuml|yuml|phiv|YUcy|yucy|Yscr|yscr|perp|Yopf|yopf|part|para|YIcy|Ouml|rcub|yicy|YAcy|rdca|ouml|osol|Oscr|rdsh|yacy|real|oscr|xvee|andd|rect|andv|Xscr|oror|ordm|ordf|xscr|ange|aopf|Aopf|rHar|Xopf|opar|Oopf|xopf|xnis|rhov|oopf|omid|xmap|oint|apid|apos|ogon|ascr|Ascr|odot|odiv|xcup|xcap|ocir|oast|nvlt|nvle|nvgt|nvge|nvap|Wscr|wscr|auml|ntlg|ntgl|nsup|nsub|nsim|Nscr|nscr|nsce|Wopf|ring|npre|wopf|npar|Auml|Barv|bbrk|Nopf|nopf|nmid|nLtv|beta|ropf|Ropf|Beta|beth|nles|rpar|nleq|bnot|bNot|nldr|NJcy|rscr|Rscr|Vscr|vscr|rsqb|njcy|bopf|nisd|Bopf|rtri|Vopf|nGtv|ngtr|vopf|boxh|boxH|boxv|nges|ngeq|boxV|bscr|scap|Bscr|bsim|Vert|vert|bsol|bull|bump|caps|cdot|ncup|scnE|ncap|nbsp|napE|Cdot|cent|sdot|Vbar|nang|vBar|chcy|Mscr|mscr|sect|semi|CHcy|Mopf|mopf|sext|circ|cire|mldr|mlcp|cirE|comp|shcy|SHcy|vArr|varr|cong|copf|Copf|copy|COPY|malt|male|macr|lvnE|cscr|ltri|sime|ltcc|simg|Cscr|siml|csub|Uuml|lsqb|lsim|uuml|csup|Lscr|lscr|utri|smid|lpar|cups|smte|lozf|darr|Lopf|Uscr|solb|lopf|sopf|Sopf|lneq|uscr|spar|dArr|lnap|Darr|dash|Sqrt|LJcy|ljcy|lHar|dHar|Upsi|upsi|diam|lesg|djcy|DJcy|leqq|dopf|Dopf|dscr|Dscr|dscy|ldsh|ldca|squf|DScy|sscr|Sscr|dsol|lcub|late|star|Star|Uopf|Larr|lArr|larr|uopf|dtri|dzcy|sube|subE|Lang|lang|Kscr|kscr|Kopf|kopf|KJcy|kjcy|KHcy|khcy|DZcy|ecir|edot|eDot|Jscr|jscr|succ|Jopf|jopf|Edot|uHar|emsp|ensp|Iuml|iuml|eopf|isin|Iscr|iscr|Eopf|epar|sung|epsi|escr|sup1|sup2|sup3|Iota|iota|supe|supE|Iopf|iopf|IOcy|iocy|Escr|esim|Esim|imof|Uarr|QUOT|uArr|uarr|euml|IEcy|iecy|Idot|Euml|euro|excl|Hscr|hscr|Hopf|hopf|TScy|tscy|Tscr|hbar|tscr|flat|tbrk|fnof|hArr|harr|half|fopf|Fopf|tdot|gvnE|fork|trie|gtcc|fscr|Fscr|gdot|gsim|Gscr|gscr|Gopf|gopf|gneq|Gdot|tosa|gnap|Topf|topf|geqq|toea|GJcy|gjcy|tint|gesl|mid|Sfr|ggg|top|ges|gla|glE|glj|geq|gne|gEl|gel|gnE|Gcy|gcy|gap|Tfr|tfr|Tcy|tcy|Hat|Tau|Ffr|tau|Tab|hfr|Hfr|ffr|Fcy|fcy|icy|Icy|iff|ETH|eth|ifr|Ifr|Eta|eta|int|Int|Sup|sup|ucy|Ucy|Sum|sum|jcy|ENG|ufr|Ufr|eng|Jcy|jfr|els|ell|egs|Efr|efr|Jfr|uml|kcy|Kcy|Ecy|ecy|kfr|Kfr|lap|Sub|sub|lat|lcy|Lcy|leg|Dot|dot|lEg|leq|les|squ|div|die|lfr|Lfr|lgE|Dfr|dfr|Del|deg|Dcy|dcy|lne|lnE|sol|loz|smt|Cup|lrm|cup|lsh|Lsh|sim|shy|map|Map|mcy|Mcy|mfr|Mfr|mho|gfr|Gfr|sfr|cir|Chi|chi|nap|Cfr|vcy|Vcy|cfr|Scy|scy|ncy|Ncy|vee|Vee|Cap|cap|nfr|scE|sce|Nfr|nge|ngE|nGg|vfr|Vfr|ngt|bot|nGt|nis|niv|Rsh|rsh|nle|nlE|bne|Bfr|bfr|nLl|nlt|nLt|Bcy|bcy|not|Not|rlm|wfr|Wfr|npr|nsc|num|ocy|ast|Ocy|ofr|xfr|Xfr|Ofr|ogt|ohm|apE|olt|Rho|ape|rho|Rfr|rfr|ord|REG|ang|reg|orv|And|and|AMP|Rcy|amp|Afr|ycy|Ycy|yen|yfr|Yfr|rcy|par|pcy|Pcy|pfr|Pfr|phi|Phi|afr|Acy|acy|zcy|Zcy|piv|acE|acd|zfr|Zfr|pre|prE|psi|Psi|qfr|Qfr|zwj|Or|ge|Gg|gt|gg|el|oS|lt|Lt|LT|Re|lg|gl|eg|ne|Im|it|le|DD|wp|wr|nu|Nu|dd|lE|Sc|sc|pi|Pi|ee|af|ll|Ll|rx|gE|xi|pm|Xi|ic|pr|Pr|in|ni|mp|mu|ac|Mu|or|ap|Gt|GT|ii);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)(?!;)([=a-zA-Z0-9]?)|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+)/g;
      var decodeMap = {
        'aacute': '\xE1',
        'Aacute': '\xC1',
        'abreve': "\u0103",
        'Abreve': "\u0102",
        'ac': "\u223E",
        'acd': "\u223F",
        'acE': "\u223E\u0333",
        'acirc': '\xE2',
        'Acirc': '\xC2',
        'acute': '\xB4',
        'acy': "\u0430",
        'Acy': "\u0410",
        'aelig': '\xE6',
        'AElig': '\xC6',
        'af': "\u2061",
        'afr': "\uD835\uDD1E",
        'Afr': "\uD835\uDD04",
        'agrave': '\xE0',
        'Agrave': '\xC0',
        'alefsym': "\u2135",
        'aleph': "\u2135",
        'alpha': "\u03B1",
        'Alpha': "\u0391",
        'amacr': "\u0101",
        'Amacr': "\u0100",
        'amalg': "\u2A3F",
        'amp': '&',
        'AMP': '&',
        'and': "\u2227",
        'And': "\u2A53",
        'andand': "\u2A55",
        'andd': "\u2A5C",
        'andslope': "\u2A58",
        'andv': "\u2A5A",
        'ang': "\u2220",
        'ange': "\u29A4",
        'angle': "\u2220",
        'angmsd': "\u2221",
        'angmsdaa': "\u29A8",
        'angmsdab': "\u29A9",
        'angmsdac': "\u29AA",
        'angmsdad': "\u29AB",
        'angmsdae': "\u29AC",
        'angmsdaf': "\u29AD",
        'angmsdag': "\u29AE",
        'angmsdah': "\u29AF",
        'angrt': "\u221F",
        'angrtvb': "\u22BE",
        'angrtvbd': "\u299D",
        'angsph': "\u2222",
        'angst': '\xC5',
        'angzarr': "\u237C",
        'aogon': "\u0105",
        'Aogon': "\u0104",
        'aopf': "\uD835\uDD52",
        'Aopf': "\uD835\uDD38",
        'ap': "\u2248",
        'apacir': "\u2A6F",
        'ape': "\u224A",
        'apE': "\u2A70",
        'apid': "\u224B",
        'apos': '\'',
        'ApplyFunction': "\u2061",
        'approx': "\u2248",
        'approxeq': "\u224A",
        'aring': '\xE5',
        'Aring': '\xC5',
        'ascr': "\uD835\uDCB6",
        'Ascr': "\uD835\uDC9C",
        'Assign': "\u2254",
        'ast': '*',
        'asymp': "\u2248",
        'asympeq': "\u224D",
        'atilde': '\xE3',
        'Atilde': '\xC3',
        'auml': '\xE4',
        'Auml': '\xC4',
        'awconint': "\u2233",
        'awint': "\u2A11",
        'backcong': "\u224C",
        'backepsilon': "\u03F6",
        'backprime': "\u2035",
        'backsim': "\u223D",
        'backsimeq': "\u22CD",
        'Backslash': "\u2216",
        'Barv': "\u2AE7",
        'barvee': "\u22BD",
        'barwed': "\u2305",
        'Barwed': "\u2306",
        'barwedge': "\u2305",
        'bbrk': "\u23B5",
        'bbrktbrk': "\u23B6",
        'bcong': "\u224C",
        'bcy': "\u0431",
        'Bcy': "\u0411",
        'bdquo': "\u201E",
        'becaus': "\u2235",
        'because': "\u2235",
        'Because': "\u2235",
        'bemptyv': "\u29B0",
        'bepsi': "\u03F6",
        'bernou': "\u212C",
        'Bernoullis': "\u212C",
        'beta': "\u03B2",
        'Beta': "\u0392",
        'beth': "\u2136",
        'between': "\u226C",
        'bfr': "\uD835\uDD1F",
        'Bfr': "\uD835\uDD05",
        'bigcap': "\u22C2",
        'bigcirc': "\u25EF",
        'bigcup': "\u22C3",
        'bigodot': "\u2A00",
        'bigoplus': "\u2A01",
        'bigotimes': "\u2A02",
        'bigsqcup': "\u2A06",
        'bigstar': "\u2605",
        'bigtriangledown': "\u25BD",
        'bigtriangleup': "\u25B3",
        'biguplus': "\u2A04",
        'bigvee': "\u22C1",
        'bigwedge': "\u22C0",
        'bkarow': "\u290D",
        'blacklozenge': "\u29EB",
        'blacksquare': "\u25AA",
        'blacktriangle': "\u25B4",
        'blacktriangledown': "\u25BE",
        'blacktriangleleft': "\u25C2",
        'blacktriangleright': "\u25B8",
        'blank': "\u2423",
        'blk12': "\u2592",
        'blk14': "\u2591",
        'blk34': "\u2593",
        'block': "\u2588",
        'bne': "=\u20E5",
        'bnequiv': "\u2261\u20E5",
        'bnot': "\u2310",
        'bNot': "\u2AED",
        'bopf': "\uD835\uDD53",
        'Bopf': "\uD835\uDD39",
        'bot': "\u22A5",
        'bottom': "\u22A5",
        'bowtie': "\u22C8",
        'boxbox': "\u29C9",
        'boxdl': "\u2510",
        'boxdL': "\u2555",
        'boxDl': "\u2556",
        'boxDL': "\u2557",
        'boxdr': "\u250C",
        'boxdR': "\u2552",
        'boxDr': "\u2553",
        'boxDR': "\u2554",
        'boxh': "\u2500",
        'boxH': "\u2550",
        'boxhd': "\u252C",
        'boxhD': "\u2565",
        'boxHd': "\u2564",
        'boxHD': "\u2566",
        'boxhu': "\u2534",
        'boxhU': "\u2568",
        'boxHu': "\u2567",
        'boxHU': "\u2569",
        'boxminus': "\u229F",
        'boxplus': "\u229E",
        'boxtimes': "\u22A0",
        'boxul': "\u2518",
        'boxuL': "\u255B",
        'boxUl': "\u255C",
        'boxUL': "\u255D",
        'boxur': "\u2514",
        'boxuR': "\u2558",
        'boxUr': "\u2559",
        'boxUR': "\u255A",
        'boxv': "\u2502",
        'boxV': "\u2551",
        'boxvh': "\u253C",
        'boxvH': "\u256A",
        'boxVh': "\u256B",
        'boxVH': "\u256C",
        'boxvl': "\u2524",
        'boxvL': "\u2561",
        'boxVl': "\u2562",
        'boxVL': "\u2563",
        'boxvr': "\u251C",
        'boxvR': "\u255E",
        'boxVr': "\u255F",
        'boxVR': "\u2560",
        'bprime': "\u2035",
        'breve': "\u02D8",
        'Breve': "\u02D8",
        'brvbar': '\xA6',
        'bscr': "\uD835\uDCB7",
        'Bscr': "\u212C",
        'bsemi': "\u204F",
        'bsim': "\u223D",
        'bsime': "\u22CD",
        'bsol': '\\',
        'bsolb': "\u29C5",
        'bsolhsub': "\u27C8",
        'bull': "\u2022",
        'bullet': "\u2022",
        'bump': "\u224E",
        'bumpe': "\u224F",
        'bumpE': "\u2AAE",
        'bumpeq': "\u224F",
        'Bumpeq': "\u224E",
        'cacute': "\u0107",
        'Cacute': "\u0106",
        'cap': "\u2229",
        'Cap': "\u22D2",
        'capand': "\u2A44",
        'capbrcup': "\u2A49",
        'capcap': "\u2A4B",
        'capcup': "\u2A47",
        'capdot': "\u2A40",
        'CapitalDifferentialD': "\u2145",
        'caps': "\u2229\uFE00",
        'caret': "\u2041",
        'caron': "\u02C7",
        'Cayleys': "\u212D",
        'ccaps': "\u2A4D",
        'ccaron': "\u010D",
        'Ccaron': "\u010C",
        'ccedil': '\xE7',
        'Ccedil': '\xC7',
        'ccirc': "\u0109",
        'Ccirc': "\u0108",
        'Cconint': "\u2230",
        'ccups': "\u2A4C",
        'ccupssm': "\u2A50",
        'cdot': "\u010B",
        'Cdot': "\u010A",
        'cedil': '\xB8',
        'Cedilla': '\xB8',
        'cemptyv': "\u29B2",
        'cent': '\xA2',
        'centerdot': '\xB7',
        'CenterDot': '\xB7',
        'cfr': "\uD835\uDD20",
        'Cfr': "\u212D",
        'chcy': "\u0447",
        'CHcy': "\u0427",
        'check': "\u2713",
        'checkmark': "\u2713",
        'chi': "\u03C7",
        'Chi': "\u03A7",
        'cir': "\u25CB",
        'circ': "\u02C6",
        'circeq': "\u2257",
        'circlearrowleft': "\u21BA",
        'circlearrowright': "\u21BB",
        'circledast': "\u229B",
        'circledcirc': "\u229A",
        'circleddash': "\u229D",
        'CircleDot': "\u2299",
        'circledR': '\xAE',
        'circledS': "\u24C8",
        'CircleMinus': "\u2296",
        'CirclePlus': "\u2295",
        'CircleTimes': "\u2297",
        'cire': "\u2257",
        'cirE': "\u29C3",
        'cirfnint': "\u2A10",
        'cirmid': "\u2AEF",
        'cirscir': "\u29C2",
        'ClockwiseContourIntegral': "\u2232",
        'CloseCurlyDoubleQuote': "\u201D",
        'CloseCurlyQuote': "\u2019",
        'clubs': "\u2663",
        'clubsuit': "\u2663",
        'colon': ':',
        'Colon': "\u2237",
        'colone': "\u2254",
        'Colone': "\u2A74",
        'coloneq': "\u2254",
        'comma': ',',
        'commat': '@',
        'comp': "\u2201",
        'compfn': "\u2218",
        'complement': "\u2201",
        'complexes': "\u2102",
        'cong': "\u2245",
        'congdot': "\u2A6D",
        'Congruent': "\u2261",
        'conint': "\u222E",
        'Conint': "\u222F",
        'ContourIntegral': "\u222E",
        'copf': "\uD835\uDD54",
        'Copf': "\u2102",
        'coprod': "\u2210",
        'Coproduct': "\u2210",
        'copy': '\xA9',
        'COPY': '\xA9',
        'copysr': "\u2117",
        'CounterClockwiseContourIntegral': "\u2233",
        'crarr': "\u21B5",
        'cross': "\u2717",
        'Cross': "\u2A2F",
        'cscr': "\uD835\uDCB8",
        'Cscr': "\uD835\uDC9E",
        'csub': "\u2ACF",
        'csube': "\u2AD1",
        'csup': "\u2AD0",
        'csupe': "\u2AD2",
        'ctdot': "\u22EF",
        'cudarrl': "\u2938",
        'cudarrr': "\u2935",
        'cuepr': "\u22DE",
        'cuesc': "\u22DF",
        'cularr': "\u21B6",
        'cularrp': "\u293D",
        'cup': "\u222A",
        'Cup': "\u22D3",
        'cupbrcap': "\u2A48",
        'cupcap': "\u2A46",
        'CupCap': "\u224D",
        'cupcup': "\u2A4A",
        'cupdot': "\u228D",
        'cupor': "\u2A45",
        'cups': "\u222A\uFE00",
        'curarr': "\u21B7",
        'curarrm': "\u293C",
        'curlyeqprec': "\u22DE",
        'curlyeqsucc': "\u22DF",
        'curlyvee': "\u22CE",
        'curlywedge': "\u22CF",
        'curren': '\xA4',
        'curvearrowleft': "\u21B6",
        'curvearrowright': "\u21B7",
        'cuvee': "\u22CE",
        'cuwed': "\u22CF",
        'cwconint': "\u2232",
        'cwint': "\u2231",
        'cylcty': "\u232D",
        'dagger': "\u2020",
        'Dagger': "\u2021",
        'daleth': "\u2138",
        'darr': "\u2193",
        'dArr': "\u21D3",
        'Darr': "\u21A1",
        'dash': "\u2010",
        'dashv': "\u22A3",
        'Dashv': "\u2AE4",
        'dbkarow': "\u290F",
        'dblac': "\u02DD",
        'dcaron': "\u010F",
        'Dcaron': "\u010E",
        'dcy': "\u0434",
        'Dcy': "\u0414",
        'dd': "\u2146",
        'DD': "\u2145",
        'ddagger': "\u2021",
        'ddarr': "\u21CA",
        'DDotrahd': "\u2911",
        'ddotseq': "\u2A77",
        'deg': '\xB0',
        'Del': "\u2207",
        'delta': "\u03B4",
        'Delta': "\u0394",
        'demptyv': "\u29B1",
        'dfisht': "\u297F",
        'dfr': "\uD835\uDD21",
        'Dfr': "\uD835\uDD07",
        'dHar': "\u2965",
        'dharl': "\u21C3",
        'dharr': "\u21C2",
        'DiacriticalAcute': '\xB4',
        'DiacriticalDot': "\u02D9",
        'DiacriticalDoubleAcute': "\u02DD",
        'DiacriticalGrave': '`',
        'DiacriticalTilde': "\u02DC",
        'diam': "\u22C4",
        'diamond': "\u22C4",
        'Diamond': "\u22C4",
        'diamondsuit': "\u2666",
        'diams': "\u2666",
        'die': '\xA8',
        'DifferentialD': "\u2146",
        'digamma': "\u03DD",
        'disin': "\u22F2",
        'div': '\xF7',
        'divide': '\xF7',
        'divideontimes': "\u22C7",
        'divonx': "\u22C7",
        'djcy': "\u0452",
        'DJcy': "\u0402",
        'dlcorn': "\u231E",
        'dlcrop': "\u230D",
        'dollar': '$',
        'dopf': "\uD835\uDD55",
        'Dopf': "\uD835\uDD3B",
        'dot': "\u02D9",
        'Dot': '\xA8',
        'DotDot': "\u20DC",
        'doteq': "\u2250",
        'doteqdot': "\u2251",
        'DotEqual': "\u2250",
        'dotminus': "\u2238",
        'dotplus': "\u2214",
        'dotsquare': "\u22A1",
        'doublebarwedge': "\u2306",
        'DoubleContourIntegral': "\u222F",
        'DoubleDot': '\xA8',
        'DoubleDownArrow': "\u21D3",
        'DoubleLeftArrow': "\u21D0",
        'DoubleLeftRightArrow': "\u21D4",
        'DoubleLeftTee': "\u2AE4",
        'DoubleLongLeftArrow': "\u27F8",
        'DoubleLongLeftRightArrow': "\u27FA",
        'DoubleLongRightArrow': "\u27F9",
        'DoubleRightArrow': "\u21D2",
        'DoubleRightTee': "\u22A8",
        'DoubleUpArrow': "\u21D1",
        'DoubleUpDownArrow': "\u21D5",
        'DoubleVerticalBar': "\u2225",
        'downarrow': "\u2193",
        'Downarrow': "\u21D3",
        'DownArrow': "\u2193",
        'DownArrowBar': "\u2913",
        'DownArrowUpArrow': "\u21F5",
        'DownBreve': "\u0311",
        'downdownarrows': "\u21CA",
        'downharpoonleft': "\u21C3",
        'downharpoonright': "\u21C2",
        'DownLeftRightVector': "\u2950",
        'DownLeftTeeVector': "\u295E",
        'DownLeftVector': "\u21BD",
        'DownLeftVectorBar': "\u2956",
        'DownRightTeeVector': "\u295F",
        'DownRightVector': "\u21C1",
        'DownRightVectorBar': "\u2957",
        'DownTee': "\u22A4",
        'DownTeeArrow': "\u21A7",
        'drbkarow': "\u2910",
        'drcorn': "\u231F",
        'drcrop': "\u230C",
        'dscr': "\uD835\uDCB9",
        'Dscr': "\uD835\uDC9F",
        'dscy': "\u0455",
        'DScy': "\u0405",
        'dsol': "\u29F6",
        'dstrok': "\u0111",
        'Dstrok': "\u0110",
        'dtdot': "\u22F1",
        'dtri': "\u25BF",
        'dtrif': "\u25BE",
        'duarr': "\u21F5",
        'duhar': "\u296F",
        'dwangle': "\u29A6",
        'dzcy': "\u045F",
        'DZcy': "\u040F",
        'dzigrarr': "\u27FF",
        'eacute': '\xE9',
        'Eacute': '\xC9',
        'easter': "\u2A6E",
        'ecaron': "\u011B",
        'Ecaron': "\u011A",
        'ecir': "\u2256",
        'ecirc': '\xEA',
        'Ecirc': '\xCA',
        'ecolon': "\u2255",
        'ecy': "\u044D",
        'Ecy': "\u042D",
        'eDDot': "\u2A77",
        'edot': "\u0117",
        'eDot': "\u2251",
        'Edot': "\u0116",
        'ee': "\u2147",
        'efDot': "\u2252",
        'efr': "\uD835\uDD22",
        'Efr': "\uD835\uDD08",
        'eg': "\u2A9A",
        'egrave': '\xE8',
        'Egrave': '\xC8',
        'egs': "\u2A96",
        'egsdot': "\u2A98",
        'el': "\u2A99",
        'Element': "\u2208",
        'elinters': "\u23E7",
        'ell': "\u2113",
        'els': "\u2A95",
        'elsdot': "\u2A97",
        'emacr': "\u0113",
        'Emacr': "\u0112",
        'empty': "\u2205",
        'emptyset': "\u2205",
        'EmptySmallSquare': "\u25FB",
        'emptyv': "\u2205",
        'EmptyVerySmallSquare': "\u25AB",
        'emsp': "\u2003",
        'emsp13': "\u2004",
        'emsp14': "\u2005",
        'eng': "\u014B",
        'ENG': "\u014A",
        'ensp': "\u2002",
        'eogon': "\u0119",
        'Eogon': "\u0118",
        'eopf': "\uD835\uDD56",
        'Eopf': "\uD835\uDD3C",
        'epar': "\u22D5",
        'eparsl': "\u29E3",
        'eplus': "\u2A71",
        'epsi': "\u03B5",
        'epsilon': "\u03B5",
        'Epsilon': "\u0395",
        'epsiv': "\u03F5",
        'eqcirc': "\u2256",
        'eqcolon': "\u2255",
        'eqsim': "\u2242",
        'eqslantgtr': "\u2A96",
        'eqslantless': "\u2A95",
        'Equal': "\u2A75",
        'equals': '=',
        'EqualTilde': "\u2242",
        'equest': "\u225F",
        'Equilibrium': "\u21CC",
        'equiv': "\u2261",
        'equivDD': "\u2A78",
        'eqvparsl': "\u29E5",
        'erarr': "\u2971",
        'erDot': "\u2253",
        'escr': "\u212F",
        'Escr': "\u2130",
        'esdot': "\u2250",
        'esim': "\u2242",
        'Esim': "\u2A73",
        'eta': "\u03B7",
        'Eta': "\u0397",
        'eth': '\xF0',
        'ETH': '\xD0',
        'euml': '\xEB',
        'Euml': '\xCB',
        'euro': "\u20AC",
        'excl': '!',
        'exist': "\u2203",
        'Exists': "\u2203",
        'expectation': "\u2130",
        'exponentiale': "\u2147",
        'ExponentialE': "\u2147",
        'fallingdotseq': "\u2252",
        'fcy': "\u0444",
        'Fcy': "\u0424",
        'female': "\u2640",
        'ffilig': "\uFB03",
        'fflig': "\uFB00",
        'ffllig': "\uFB04",
        'ffr': "\uD835\uDD23",
        'Ffr': "\uD835\uDD09",
        'filig': "\uFB01",
        'FilledSmallSquare': "\u25FC",
        'FilledVerySmallSquare': "\u25AA",
        'fjlig': 'fj',
        'flat': "\u266D",
        'fllig': "\uFB02",
        'fltns': "\u25B1",
        'fnof': "\u0192",
        'fopf': "\uD835\uDD57",
        'Fopf': "\uD835\uDD3D",
        'forall': "\u2200",
        'ForAll': "\u2200",
        'fork': "\u22D4",
        'forkv': "\u2AD9",
        'Fouriertrf': "\u2131",
        'fpartint': "\u2A0D",
        'frac12': '\xBD',
        'frac13': "\u2153",
        'frac14': '\xBC',
        'frac15': "\u2155",
        'frac16': "\u2159",
        'frac18': "\u215B",
        'frac23': "\u2154",
        'frac25': "\u2156",
        'frac34': '\xBE',
        'frac35': "\u2157",
        'frac38': "\u215C",
        'frac45': "\u2158",
        'frac56': "\u215A",
        'frac58': "\u215D",
        'frac78': "\u215E",
        'frasl': "\u2044",
        'frown': "\u2322",
        'fscr': "\uD835\uDCBB",
        'Fscr': "\u2131",
        'gacute': "\u01F5",
        'gamma': "\u03B3",
        'Gamma': "\u0393",
        'gammad': "\u03DD",
        'Gammad': "\u03DC",
        'gap': "\u2A86",
        'gbreve': "\u011F",
        'Gbreve': "\u011E",
        'Gcedil': "\u0122",
        'gcirc': "\u011D",
        'Gcirc': "\u011C",
        'gcy': "\u0433",
        'Gcy': "\u0413",
        'gdot': "\u0121",
        'Gdot': "\u0120",
        'ge': "\u2265",
        'gE': "\u2267",
        'gel': "\u22DB",
        'gEl': "\u2A8C",
        'geq': "\u2265",
        'geqq': "\u2267",
        'geqslant': "\u2A7E",
        'ges': "\u2A7E",
        'gescc': "\u2AA9",
        'gesdot': "\u2A80",
        'gesdoto': "\u2A82",
        'gesdotol': "\u2A84",
        'gesl': "\u22DB\uFE00",
        'gesles': "\u2A94",
        'gfr': "\uD835\uDD24",
        'Gfr': "\uD835\uDD0A",
        'gg': "\u226B",
        'Gg': "\u22D9",
        'ggg': "\u22D9",
        'gimel': "\u2137",
        'gjcy': "\u0453",
        'GJcy': "\u0403",
        'gl': "\u2277",
        'gla': "\u2AA5",
        'glE': "\u2A92",
        'glj': "\u2AA4",
        'gnap': "\u2A8A",
        'gnapprox': "\u2A8A",
        'gne': "\u2A88",
        'gnE': "\u2269",
        'gneq': "\u2A88",
        'gneqq': "\u2269",
        'gnsim': "\u22E7",
        'gopf': "\uD835\uDD58",
        'Gopf': "\uD835\uDD3E",
        'grave': '`',
        'GreaterEqual': "\u2265",
        'GreaterEqualLess': "\u22DB",
        'GreaterFullEqual': "\u2267",
        'GreaterGreater': "\u2AA2",
        'GreaterLess': "\u2277",
        'GreaterSlantEqual': "\u2A7E",
        'GreaterTilde': "\u2273",
        'gscr': "\u210A",
        'Gscr': "\uD835\uDCA2",
        'gsim': "\u2273",
        'gsime': "\u2A8E",
        'gsiml': "\u2A90",
        'gt': '>',
        'Gt': "\u226B",
        'GT': '>',
        'gtcc': "\u2AA7",
        'gtcir': "\u2A7A",
        'gtdot': "\u22D7",
        'gtlPar': "\u2995",
        'gtquest': "\u2A7C",
        'gtrapprox': "\u2A86",
        'gtrarr': "\u2978",
        'gtrdot': "\u22D7",
        'gtreqless': "\u22DB",
        'gtreqqless': "\u2A8C",
        'gtrless': "\u2277",
        'gtrsim': "\u2273",
        'gvertneqq': "\u2269\uFE00",
        'gvnE': "\u2269\uFE00",
        'Hacek': "\u02C7",
        'hairsp': "\u200A",
        'half': '\xBD',
        'hamilt': "\u210B",
        'hardcy': "\u044A",
        'HARDcy': "\u042A",
        'harr': "\u2194",
        'hArr': "\u21D4",
        'harrcir': "\u2948",
        'harrw': "\u21AD",
        'Hat': '^',
        'hbar': "\u210F",
        'hcirc': "\u0125",
        'Hcirc': "\u0124",
        'hearts': "\u2665",
        'heartsuit': "\u2665",
        'hellip': "\u2026",
        'hercon': "\u22B9",
        'hfr': "\uD835\uDD25",
        'Hfr': "\u210C",
        'HilbertSpace': "\u210B",
        'hksearow': "\u2925",
        'hkswarow': "\u2926",
        'hoarr': "\u21FF",
        'homtht': "\u223B",
        'hookleftarrow': "\u21A9",
        'hookrightarrow': "\u21AA",
        'hopf': "\uD835\uDD59",
        'Hopf': "\u210D",
        'horbar': "\u2015",
        'HorizontalLine': "\u2500",
        'hscr': "\uD835\uDCBD",
        'Hscr': "\u210B",
        'hslash': "\u210F",
        'hstrok': "\u0127",
        'Hstrok': "\u0126",
        'HumpDownHump': "\u224E",
        'HumpEqual': "\u224F",
        'hybull': "\u2043",
        'hyphen': "\u2010",
        'iacute': '\xED',
        'Iacute': '\xCD',
        'ic': "\u2063",
        'icirc': '\xEE',
        'Icirc': '\xCE',
        'icy': "\u0438",
        'Icy': "\u0418",
        'Idot': "\u0130",
        'iecy': "\u0435",
        'IEcy': "\u0415",
        'iexcl': '\xA1',
        'iff': "\u21D4",
        'ifr': "\uD835\uDD26",
        'Ifr': "\u2111",
        'igrave': '\xEC',
        'Igrave': '\xCC',
        'ii': "\u2148",
        'iiiint': "\u2A0C",
        'iiint': "\u222D",
        'iinfin': "\u29DC",
        'iiota': "\u2129",
        'ijlig': "\u0133",
        'IJlig': "\u0132",
        'Im': "\u2111",
        'imacr': "\u012B",
        'Imacr': "\u012A",
        'image': "\u2111",
        'ImaginaryI': "\u2148",
        'imagline': "\u2110",
        'imagpart': "\u2111",
        'imath': "\u0131",
        'imof': "\u22B7",
        'imped': "\u01B5",
        'Implies': "\u21D2",
        'in': "\u2208",
        'incare': "\u2105",
        'infin': "\u221E",
        'infintie': "\u29DD",
        'inodot': "\u0131",
        'int': "\u222B",
        'Int': "\u222C",
        'intcal': "\u22BA",
        'integers': "\u2124",
        'Integral': "\u222B",
        'intercal': "\u22BA",
        'Intersection': "\u22C2",
        'intlarhk': "\u2A17",
        'intprod': "\u2A3C",
        'InvisibleComma': "\u2063",
        'InvisibleTimes': "\u2062",
        'iocy': "\u0451",
        'IOcy': "\u0401",
        'iogon': "\u012F",
        'Iogon': "\u012E",
        'iopf': "\uD835\uDD5A",
        'Iopf': "\uD835\uDD40",
        'iota': "\u03B9",
        'Iota': "\u0399",
        'iprod': "\u2A3C",
        'iquest': '\xBF',
        'iscr': "\uD835\uDCBE",
        'Iscr': "\u2110",
        'isin': "\u2208",
        'isindot': "\u22F5",
        'isinE': "\u22F9",
        'isins': "\u22F4",
        'isinsv': "\u22F3",
        'isinv': "\u2208",
        'it': "\u2062",
        'itilde': "\u0129",
        'Itilde': "\u0128",
        'iukcy': "\u0456",
        'Iukcy': "\u0406",
        'iuml': '\xEF',
        'Iuml': '\xCF',
        'jcirc': "\u0135",
        'Jcirc': "\u0134",
        'jcy': "\u0439",
        'Jcy': "\u0419",
        'jfr': "\uD835\uDD27",
        'Jfr': "\uD835\uDD0D",
        'jmath': "\u0237",
        'jopf': "\uD835\uDD5B",
        'Jopf': "\uD835\uDD41",
        'jscr': "\uD835\uDCBF",
        'Jscr': "\uD835\uDCA5",
        'jsercy': "\u0458",
        'Jsercy': "\u0408",
        'jukcy': "\u0454",
        'Jukcy': "\u0404",
        'kappa': "\u03BA",
        'Kappa': "\u039A",
        'kappav': "\u03F0",
        'kcedil': "\u0137",
        'Kcedil': "\u0136",
        'kcy': "\u043A",
        'Kcy': "\u041A",
        'kfr': "\uD835\uDD28",
        'Kfr': "\uD835\uDD0E",
        'kgreen': "\u0138",
        'khcy': "\u0445",
        'KHcy': "\u0425",
        'kjcy': "\u045C",
        'KJcy': "\u040C",
        'kopf': "\uD835\uDD5C",
        'Kopf': "\uD835\uDD42",
        'kscr': "\uD835\uDCC0",
        'Kscr': "\uD835\uDCA6",
        'lAarr': "\u21DA",
        'lacute': "\u013A",
        'Lacute': "\u0139",
        'laemptyv': "\u29B4",
        'lagran': "\u2112",
        'lambda': "\u03BB",
        'Lambda': "\u039B",
        'lang': "\u27E8",
        'Lang': "\u27EA",
        'langd': "\u2991",
        'langle': "\u27E8",
        'lap': "\u2A85",
        'Laplacetrf': "\u2112",
        'laquo': '\xAB',
        'larr': "\u2190",
        'lArr': "\u21D0",
        'Larr': "\u219E",
        'larrb': "\u21E4",
        'larrbfs': "\u291F",
        'larrfs': "\u291D",
        'larrhk': "\u21A9",
        'larrlp': "\u21AB",
        'larrpl': "\u2939",
        'larrsim': "\u2973",
        'larrtl': "\u21A2",
        'lat': "\u2AAB",
        'latail': "\u2919",
        'lAtail': "\u291B",
        'late': "\u2AAD",
        'lates': "\u2AAD\uFE00",
        'lbarr': "\u290C",
        'lBarr': "\u290E",
        'lbbrk': "\u2772",
        'lbrace': '{',
        'lbrack': '[',
        'lbrke': "\u298B",
        'lbrksld': "\u298F",
        'lbrkslu': "\u298D",
        'lcaron': "\u013E",
        'Lcaron': "\u013D",
        'lcedil': "\u013C",
        'Lcedil': "\u013B",
        'lceil': "\u2308",
        'lcub': '{',
        'lcy': "\u043B",
        'Lcy': "\u041B",
        'ldca': "\u2936",
        'ldquo': "\u201C",
        'ldquor': "\u201E",
        'ldrdhar': "\u2967",
        'ldrushar': "\u294B",
        'ldsh': "\u21B2",
        'le': "\u2264",
        'lE': "\u2266",
        'LeftAngleBracket': "\u27E8",
        'leftarrow': "\u2190",
        'Leftarrow': "\u21D0",
        'LeftArrow': "\u2190",
        'LeftArrowBar': "\u21E4",
        'LeftArrowRightArrow': "\u21C6",
        'leftarrowtail': "\u21A2",
        'LeftCeiling': "\u2308",
        'LeftDoubleBracket': "\u27E6",
        'LeftDownTeeVector': "\u2961",
        'LeftDownVector': "\u21C3",
        'LeftDownVectorBar': "\u2959",
        'LeftFloor': "\u230A",
        'leftharpoondown': "\u21BD",
        'leftharpoonup': "\u21BC",
        'leftleftarrows': "\u21C7",
        'leftrightarrow': "\u2194",
        'Leftrightarrow': "\u21D4",
        'LeftRightArrow': "\u2194",
        'leftrightarrows': "\u21C6",
        'leftrightharpoons': "\u21CB",
        'leftrightsquigarrow': "\u21AD",
        'LeftRightVector': "\u294E",
        'LeftTee': "\u22A3",
        'LeftTeeArrow': "\u21A4",
        'LeftTeeVector': "\u295A",
        'leftthreetimes': "\u22CB",
        'LeftTriangle': "\u22B2",
        'LeftTriangleBar': "\u29CF",
        'LeftTriangleEqual': "\u22B4",
        'LeftUpDownVector': "\u2951",
        'LeftUpTeeVector': "\u2960",
        'LeftUpVector': "\u21BF",
        'LeftUpVectorBar': "\u2958",
        'LeftVector': "\u21BC",
        'LeftVectorBar': "\u2952",
        'leg': "\u22DA",
        'lEg': "\u2A8B",
        'leq': "\u2264",
        'leqq': "\u2266",
        'leqslant': "\u2A7D",
        'les': "\u2A7D",
        'lescc': "\u2AA8",
        'lesdot': "\u2A7F",
        'lesdoto': "\u2A81",
        'lesdotor': "\u2A83",
        'lesg': "\u22DA\uFE00",
        'lesges': "\u2A93",
        'lessapprox': "\u2A85",
        'lessdot': "\u22D6",
        'lesseqgtr': "\u22DA",
        'lesseqqgtr': "\u2A8B",
        'LessEqualGreater': "\u22DA",
        'LessFullEqual': "\u2266",
        'LessGreater': "\u2276",
        'lessgtr': "\u2276",
        'LessLess': "\u2AA1",
        'lesssim': "\u2272",
        'LessSlantEqual': "\u2A7D",
        'LessTilde': "\u2272",
        'lfisht': "\u297C",
        'lfloor': "\u230A",
        'lfr': "\uD835\uDD29",
        'Lfr': "\uD835\uDD0F",
        'lg': "\u2276",
        'lgE': "\u2A91",
        'lHar': "\u2962",
        'lhard': "\u21BD",
        'lharu': "\u21BC",
        'lharul': "\u296A",
        'lhblk': "\u2584",
        'ljcy': "\u0459",
        'LJcy': "\u0409",
        'll': "\u226A",
        'Ll': "\u22D8",
        'llarr': "\u21C7",
        'llcorner': "\u231E",
        'Lleftarrow': "\u21DA",
        'llhard': "\u296B",
        'lltri': "\u25FA",
        'lmidot': "\u0140",
        'Lmidot': "\u013F",
        'lmoust': "\u23B0",
        'lmoustache': "\u23B0",
        'lnap': "\u2A89",
        'lnapprox': "\u2A89",
        'lne': "\u2A87",
        'lnE': "\u2268",
        'lneq': "\u2A87",
        'lneqq': "\u2268",
        'lnsim': "\u22E6",
        'loang': "\u27EC",
        'loarr': "\u21FD",
        'lobrk': "\u27E6",
        'longleftarrow': "\u27F5",
        'Longleftarrow': "\u27F8",
        'LongLeftArrow': "\u27F5",
        'longleftrightarrow': "\u27F7",
        'Longleftrightarrow': "\u27FA",
        'LongLeftRightArrow': "\u27F7",
        'longmapsto': "\u27FC",
        'longrightarrow': "\u27F6",
        'Longrightarrow': "\u27F9",
        'LongRightArrow': "\u27F6",
        'looparrowleft': "\u21AB",
        'looparrowright': "\u21AC",
        'lopar': "\u2985",
        'lopf': "\uD835\uDD5D",
        'Lopf': "\uD835\uDD43",
        'loplus': "\u2A2D",
        'lotimes': "\u2A34",
        'lowast': "\u2217",
        'lowbar': '_',
        'LowerLeftArrow': "\u2199",
        'LowerRightArrow': "\u2198",
        'loz': "\u25CA",
        'lozenge': "\u25CA",
        'lozf': "\u29EB",
        'lpar': '(',
        'lparlt': "\u2993",
        'lrarr': "\u21C6",
        'lrcorner': "\u231F",
        'lrhar': "\u21CB",
        'lrhard': "\u296D",
        'lrm': "\u200E",
        'lrtri': "\u22BF",
        'lsaquo': "\u2039",
        'lscr': "\uD835\uDCC1",
        'Lscr': "\u2112",
        'lsh': "\u21B0",
        'Lsh': "\u21B0",
        'lsim': "\u2272",
        'lsime': "\u2A8D",
        'lsimg': "\u2A8F",
        'lsqb': '[',
        'lsquo': "\u2018",
        'lsquor': "\u201A",
        'lstrok': "\u0142",
        'Lstrok': "\u0141",
        'lt': '<',
        'Lt': "\u226A",
        'LT': '<',
        'ltcc': "\u2AA6",
        'ltcir': "\u2A79",
        'ltdot': "\u22D6",
        'lthree': "\u22CB",
        'ltimes': "\u22C9",
        'ltlarr': "\u2976",
        'ltquest': "\u2A7B",
        'ltri': "\u25C3",
        'ltrie': "\u22B4",
        'ltrif': "\u25C2",
        'ltrPar': "\u2996",
        'lurdshar': "\u294A",
        'luruhar': "\u2966",
        'lvertneqq': "\u2268\uFE00",
        'lvnE': "\u2268\uFE00",
        'macr': '\xAF',
        'male': "\u2642",
        'malt': "\u2720",
        'maltese': "\u2720",
        'map': "\u21A6",
        'Map': "\u2905",
        'mapsto': "\u21A6",
        'mapstodown': "\u21A7",
        'mapstoleft': "\u21A4",
        'mapstoup': "\u21A5",
        'marker': "\u25AE",
        'mcomma': "\u2A29",
        'mcy': "\u043C",
        'Mcy': "\u041C",
        'mdash': "\u2014",
        'mDDot': "\u223A",
        'measuredangle': "\u2221",
        'MediumSpace': "\u205F",
        'Mellintrf': "\u2133",
        'mfr': "\uD835\uDD2A",
        'Mfr': "\uD835\uDD10",
        'mho': "\u2127",
        'micro': '\xB5',
        'mid': "\u2223",
        'midast': '*',
        'midcir': "\u2AF0",
        'middot': '\xB7',
        'minus': "\u2212",
        'minusb': "\u229F",
        'minusd': "\u2238",
        'minusdu': "\u2A2A",
        'MinusPlus': "\u2213",
        'mlcp': "\u2ADB",
        'mldr': "\u2026",
        'mnplus': "\u2213",
        'models': "\u22A7",
        'mopf': "\uD835\uDD5E",
        'Mopf': "\uD835\uDD44",
        'mp': "\u2213",
        'mscr': "\uD835\uDCC2",
        'Mscr': "\u2133",
        'mstpos': "\u223E",
        'mu': "\u03BC",
        'Mu': "\u039C",
        'multimap': "\u22B8",
        'mumap': "\u22B8",
        'nabla': "\u2207",
        'nacute': "\u0144",
        'Nacute': "\u0143",
        'nang': "\u2220\u20D2",
        'nap': "\u2249",
        'napE': "\u2A70\u0338",
        'napid': "\u224B\u0338",
        'napos': "\u0149",
        'napprox': "\u2249",
        'natur': "\u266E",
        'natural': "\u266E",
        'naturals': "\u2115",
        'nbsp': '\xA0',
        'nbump': "\u224E\u0338",
        'nbumpe': "\u224F\u0338",
        'ncap': "\u2A43",
        'ncaron': "\u0148",
        'Ncaron': "\u0147",
        'ncedil': "\u0146",
        'Ncedil': "\u0145",
        'ncong': "\u2247",
        'ncongdot': "\u2A6D\u0338",
        'ncup': "\u2A42",
        'ncy': "\u043D",
        'Ncy': "\u041D",
        'ndash': "\u2013",
        'ne': "\u2260",
        'nearhk': "\u2924",
        'nearr': "\u2197",
        'neArr': "\u21D7",
        'nearrow': "\u2197",
        'nedot': "\u2250\u0338",
        'NegativeMediumSpace': "\u200B",
        'NegativeThickSpace': "\u200B",
        'NegativeThinSpace': "\u200B",
        'NegativeVeryThinSpace': "\u200B",
        'nequiv': "\u2262",
        'nesear': "\u2928",
        'nesim': "\u2242\u0338",
        'NestedGreaterGreater': "\u226B",
        'NestedLessLess': "\u226A",
        'NewLine': '\n',
        'nexist': "\u2204",
        'nexists': "\u2204",
        'nfr': "\uD835\uDD2B",
        'Nfr': "\uD835\uDD11",
        'nge': "\u2271",
        'ngE': "\u2267\u0338",
        'ngeq': "\u2271",
        'ngeqq': "\u2267\u0338",
        'ngeqslant': "\u2A7E\u0338",
        'nges': "\u2A7E\u0338",
        'nGg': "\u22D9\u0338",
        'ngsim': "\u2275",
        'ngt': "\u226F",
        'nGt': "\u226B\u20D2",
        'ngtr': "\u226F",
        'nGtv': "\u226B\u0338",
        'nharr': "\u21AE",
        'nhArr': "\u21CE",
        'nhpar': "\u2AF2",
        'ni': "\u220B",
        'nis': "\u22FC",
        'nisd': "\u22FA",
        'niv': "\u220B",
        'njcy': "\u045A",
        'NJcy': "\u040A",
        'nlarr': "\u219A",
        'nlArr': "\u21CD",
        'nldr': "\u2025",
        'nle': "\u2270",
        'nlE': "\u2266\u0338",
        'nleftarrow': "\u219A",
        'nLeftarrow': "\u21CD",
        'nleftrightarrow': "\u21AE",
        'nLeftrightarrow': "\u21CE",
        'nleq': "\u2270",
        'nleqq': "\u2266\u0338",
        'nleqslant': "\u2A7D\u0338",
        'nles': "\u2A7D\u0338",
        'nless': "\u226E",
        'nLl': "\u22D8\u0338",
        'nlsim': "\u2274",
        'nlt': "\u226E",
        'nLt': "\u226A\u20D2",
        'nltri': "\u22EA",
        'nltrie': "\u22EC",
        'nLtv': "\u226A\u0338",
        'nmid': "\u2224",
        'NoBreak': "\u2060",
        'NonBreakingSpace': '\xA0',
        'nopf': "\uD835\uDD5F",
        'Nopf': "\u2115",
        'not': '\xAC',
        'Not': "\u2AEC",
        'NotCongruent': "\u2262",
        'NotCupCap': "\u226D",
        'NotDoubleVerticalBar': "\u2226",
        'NotElement': "\u2209",
        'NotEqual': "\u2260",
        'NotEqualTilde': "\u2242\u0338",
        'NotExists': "\u2204",
        'NotGreater': "\u226F",
        'NotGreaterEqual': "\u2271",
        'NotGreaterFullEqual': "\u2267\u0338",
        'NotGreaterGreater': "\u226B\u0338",
        'NotGreaterLess': "\u2279",
        'NotGreaterSlantEqual': "\u2A7E\u0338",
        'NotGreaterTilde': "\u2275",
        'NotHumpDownHump': "\u224E\u0338",
        'NotHumpEqual': "\u224F\u0338",
        'notin': "\u2209",
        'notindot': "\u22F5\u0338",
        'notinE': "\u22F9\u0338",
        'notinva': "\u2209",
        'notinvb': "\u22F7",
        'notinvc': "\u22F6",
        'NotLeftTriangle': "\u22EA",
        'NotLeftTriangleBar': "\u29CF\u0338",
        'NotLeftTriangleEqual': "\u22EC",
        'NotLess': "\u226E",
        'NotLessEqual': "\u2270",
        'NotLessGreater': "\u2278",
        'NotLessLess': "\u226A\u0338",
        'NotLessSlantEqual': "\u2A7D\u0338",
        'NotLessTilde': "\u2274",
        'NotNestedGreaterGreater': "\u2AA2\u0338",
        'NotNestedLessLess': "\u2AA1\u0338",
        'notni': "\u220C",
        'notniva': "\u220C",
        'notnivb': "\u22FE",
        'notnivc': "\u22FD",
        'NotPrecedes': "\u2280",
        'NotPrecedesEqual': "\u2AAF\u0338",
        'NotPrecedesSlantEqual': "\u22E0",
        'NotReverseElement': "\u220C",
        'NotRightTriangle': "\u22EB",
        'NotRightTriangleBar': "\u29D0\u0338",
        'NotRightTriangleEqual': "\u22ED",
        'NotSquareSubset': "\u228F\u0338",
        'NotSquareSubsetEqual': "\u22E2",
        'NotSquareSuperset': "\u2290\u0338",
        'NotSquareSupersetEqual': "\u22E3",
        'NotSubset': "\u2282\u20D2",
        'NotSubsetEqual': "\u2288",
        'NotSucceeds': "\u2281",
        'NotSucceedsEqual': "\u2AB0\u0338",
        'NotSucceedsSlantEqual': "\u22E1",
        'NotSucceedsTilde': "\u227F\u0338",
        'NotSuperset': "\u2283\u20D2",
        'NotSupersetEqual': "\u2289",
        'NotTilde': "\u2241",
        'NotTildeEqual': "\u2244",
        'NotTildeFullEqual': "\u2247",
        'NotTildeTilde': "\u2249",
        'NotVerticalBar': "\u2224",
        'npar': "\u2226",
        'nparallel': "\u2226",
        'nparsl': "\u2AFD\u20E5",
        'npart': "\u2202\u0338",
        'npolint': "\u2A14",
        'npr': "\u2280",
        'nprcue': "\u22E0",
        'npre': "\u2AAF\u0338",
        'nprec': "\u2280",
        'npreceq': "\u2AAF\u0338",
        'nrarr': "\u219B",
        'nrArr': "\u21CF",
        'nrarrc': "\u2933\u0338",
        'nrarrw': "\u219D\u0338",
        'nrightarrow': "\u219B",
        'nRightarrow': "\u21CF",
        'nrtri': "\u22EB",
        'nrtrie': "\u22ED",
        'nsc': "\u2281",
        'nsccue': "\u22E1",
        'nsce': "\u2AB0\u0338",
        'nscr': "\uD835\uDCC3",
        'Nscr': "\uD835\uDCA9",
        'nshortmid': "\u2224",
        'nshortparallel': "\u2226",
        'nsim': "\u2241",
        'nsime': "\u2244",
        'nsimeq': "\u2244",
        'nsmid': "\u2224",
        'nspar': "\u2226",
        'nsqsube': "\u22E2",
        'nsqsupe': "\u22E3",
        'nsub': "\u2284",
        'nsube': "\u2288",
        'nsubE': "\u2AC5\u0338",
        'nsubset': "\u2282\u20D2",
        'nsubseteq': "\u2288",
        'nsubseteqq': "\u2AC5\u0338",
        'nsucc': "\u2281",
        'nsucceq': "\u2AB0\u0338",
        'nsup': "\u2285",
        'nsupe': "\u2289",
        'nsupE': "\u2AC6\u0338",
        'nsupset': "\u2283\u20D2",
        'nsupseteq': "\u2289",
        'nsupseteqq': "\u2AC6\u0338",
        'ntgl': "\u2279",
        'ntilde': '\xF1',
        'Ntilde': '\xD1',
        'ntlg': "\u2278",
        'ntriangleleft': "\u22EA",
        'ntrianglelefteq': "\u22EC",
        'ntriangleright': "\u22EB",
        'ntrianglerighteq': "\u22ED",
        'nu': "\u03BD",
        'Nu': "\u039D",
        'num': '#',
        'numero': "\u2116",
        'numsp': "\u2007",
        'nvap': "\u224D\u20D2",
        'nvdash': "\u22AC",
        'nvDash': "\u22AD",
        'nVdash': "\u22AE",
        'nVDash': "\u22AF",
        'nvge': "\u2265\u20D2",
        'nvgt': ">\u20D2",
        'nvHarr': "\u2904",
        'nvinfin': "\u29DE",
        'nvlArr': "\u2902",
        'nvle': "\u2264\u20D2",
        'nvlt': "<\u20D2",
        'nvltrie': "\u22B4\u20D2",
        'nvrArr': "\u2903",
        'nvrtrie': "\u22B5\u20D2",
        'nvsim': "\u223C\u20D2",
        'nwarhk': "\u2923",
        'nwarr': "\u2196",
        'nwArr': "\u21D6",
        'nwarrow': "\u2196",
        'nwnear': "\u2927",
        'oacute': '\xF3',
        'Oacute': '\xD3',
        'oast': "\u229B",
        'ocir': "\u229A",
        'ocirc': '\xF4',
        'Ocirc': '\xD4',
        'ocy': "\u043E",
        'Ocy': "\u041E",
        'odash': "\u229D",
        'odblac': "\u0151",
        'Odblac': "\u0150",
        'odiv': "\u2A38",
        'odot': "\u2299",
        'odsold': "\u29BC",
        'oelig': "\u0153",
        'OElig': "\u0152",
        'ofcir': "\u29BF",
        'ofr': "\uD835\uDD2C",
        'Ofr': "\uD835\uDD12",
        'ogon': "\u02DB",
        'ograve': '\xF2',
        'Ograve': '\xD2',
        'ogt': "\u29C1",
        'ohbar': "\u29B5",
        'ohm': "\u03A9",
        'oint': "\u222E",
        'olarr': "\u21BA",
        'olcir': "\u29BE",
        'olcross': "\u29BB",
        'oline': "\u203E",
        'olt': "\u29C0",
        'omacr': "\u014D",
        'Omacr': "\u014C",
        'omega': "\u03C9",
        'Omega': "\u03A9",
        'omicron': "\u03BF",
        'Omicron': "\u039F",
        'omid': "\u29B6",
        'ominus': "\u2296",
        'oopf': "\uD835\uDD60",
        'Oopf': "\uD835\uDD46",
        'opar': "\u29B7",
        'OpenCurlyDoubleQuote': "\u201C",
        'OpenCurlyQuote': "\u2018",
        'operp': "\u29B9",
        'oplus': "\u2295",
        'or': "\u2228",
        'Or': "\u2A54",
        'orarr': "\u21BB",
        'ord': "\u2A5D",
        'order': "\u2134",
        'orderof': "\u2134",
        'ordf': '\xAA',
        'ordm': '\xBA',
        'origof': "\u22B6",
        'oror': "\u2A56",
        'orslope': "\u2A57",
        'orv': "\u2A5B",
        'oS': "\u24C8",
        'oscr': "\u2134",
        'Oscr': "\uD835\uDCAA",
        'oslash': '\xF8',
        'Oslash': '\xD8',
        'osol': "\u2298",
        'otilde': '\xF5',
        'Otilde': '\xD5',
        'otimes': "\u2297",
        'Otimes': "\u2A37",
        'otimesas': "\u2A36",
        'ouml': '\xF6',
        'Ouml': '\xD6',
        'ovbar': "\u233D",
        'OverBar': "\u203E",
        'OverBrace': "\u23DE",
        'OverBracket': "\u23B4",
        'OverParenthesis': "\u23DC",
        'par': "\u2225",
        'para': '\xB6',
        'parallel': "\u2225",
        'parsim': "\u2AF3",
        'parsl': "\u2AFD",
        'part': "\u2202",
        'PartialD': "\u2202",
        'pcy': "\u043F",
        'Pcy': "\u041F",
        'percnt': '%',
        'period': '.',
        'permil': "\u2030",
        'perp': "\u22A5",
        'pertenk': "\u2031",
        'pfr': "\uD835\uDD2D",
        'Pfr': "\uD835\uDD13",
        'phi': "\u03C6",
        'Phi': "\u03A6",
        'phiv': "\u03D5",
        'phmmat': "\u2133",
        'phone': "\u260E",
        'pi': "\u03C0",
        'Pi': "\u03A0",
        'pitchfork': "\u22D4",
        'piv': "\u03D6",
        'planck': "\u210F",
        'planckh': "\u210E",
        'plankv': "\u210F",
        'plus': '+',
        'plusacir': "\u2A23",
        'plusb': "\u229E",
        'pluscir': "\u2A22",
        'plusdo': "\u2214",
        'plusdu': "\u2A25",
        'pluse': "\u2A72",
        'PlusMinus': '\xB1',
        'plusmn': '\xB1',
        'plussim': "\u2A26",
        'plustwo': "\u2A27",
        'pm': '\xB1',
        'Poincareplane': "\u210C",
        'pointint': "\u2A15",
        'popf': "\uD835\uDD61",
        'Popf': "\u2119",
        'pound': '\xA3',
        'pr': "\u227A",
        'Pr': "\u2ABB",
        'prap': "\u2AB7",
        'prcue': "\u227C",
        'pre': "\u2AAF",
        'prE': "\u2AB3",
        'prec': "\u227A",
        'precapprox': "\u2AB7",
        'preccurlyeq': "\u227C",
        'Precedes': "\u227A",
        'PrecedesEqual': "\u2AAF",
        'PrecedesSlantEqual': "\u227C",
        'PrecedesTilde': "\u227E",
        'preceq': "\u2AAF",
        'precnapprox': "\u2AB9",
        'precneqq': "\u2AB5",
        'precnsim': "\u22E8",
        'precsim': "\u227E",
        'prime': "\u2032",
        'Prime': "\u2033",
        'primes': "\u2119",
        'prnap': "\u2AB9",
        'prnE': "\u2AB5",
        'prnsim': "\u22E8",
        'prod': "\u220F",
        'Product': "\u220F",
        'profalar': "\u232E",
        'profline': "\u2312",
        'profsurf': "\u2313",
        'prop': "\u221D",
        'Proportion': "\u2237",
        'Proportional': "\u221D",
        'propto': "\u221D",
        'prsim': "\u227E",
        'prurel': "\u22B0",
        'pscr': "\uD835\uDCC5",
        'Pscr': "\uD835\uDCAB",
        'psi': "\u03C8",
        'Psi': "\u03A8",
        'puncsp': "\u2008",
        'qfr': "\uD835\uDD2E",
        'Qfr': "\uD835\uDD14",
        'qint': "\u2A0C",
        'qopf': "\uD835\uDD62",
        'Qopf': "\u211A",
        'qprime': "\u2057",
        'qscr': "\uD835\uDCC6",
        'Qscr': "\uD835\uDCAC",
        'quaternions': "\u210D",
        'quatint': "\u2A16",
        'quest': '?',
        'questeq': "\u225F",
        'quot': '"',
        'QUOT': '"',
        'rAarr': "\u21DB",
        'race': "\u223D\u0331",
        'racute': "\u0155",
        'Racute': "\u0154",
        'radic': "\u221A",
        'raemptyv': "\u29B3",
        'rang': "\u27E9",
        'Rang': "\u27EB",
        'rangd': "\u2992",
        'range': "\u29A5",
        'rangle': "\u27E9",
        'raquo': '\xBB',
        'rarr': "\u2192",
        'rArr': "\u21D2",
        'Rarr': "\u21A0",
        'rarrap': "\u2975",
        'rarrb': "\u21E5",
        'rarrbfs': "\u2920",
        'rarrc': "\u2933",
        'rarrfs': "\u291E",
        'rarrhk': "\u21AA",
        'rarrlp': "\u21AC",
        'rarrpl': "\u2945",
        'rarrsim': "\u2974",
        'rarrtl': "\u21A3",
        'Rarrtl': "\u2916",
        'rarrw': "\u219D",
        'ratail': "\u291A",
        'rAtail': "\u291C",
        'ratio': "\u2236",
        'rationals': "\u211A",
        'rbarr': "\u290D",
        'rBarr': "\u290F",
        'RBarr': "\u2910",
        'rbbrk': "\u2773",
        'rbrace': '}',
        'rbrack': ']',
        'rbrke': "\u298C",
        'rbrksld': "\u298E",
        'rbrkslu': "\u2990",
        'rcaron': "\u0159",
        'Rcaron': "\u0158",
        'rcedil': "\u0157",
        'Rcedil': "\u0156",
        'rceil': "\u2309",
        'rcub': '}',
        'rcy': "\u0440",
        'Rcy': "\u0420",
        'rdca': "\u2937",
        'rdldhar': "\u2969",
        'rdquo': "\u201D",
        'rdquor': "\u201D",
        'rdsh': "\u21B3",
        'Re': "\u211C",
        'real': "\u211C",
        'realine': "\u211B",
        'realpart': "\u211C",
        'reals': "\u211D",
        'rect': "\u25AD",
        'reg': '\xAE',
        'REG': '\xAE',
        'ReverseElement': "\u220B",
        'ReverseEquilibrium': "\u21CB",
        'ReverseUpEquilibrium': "\u296F",
        'rfisht': "\u297D",
        'rfloor': "\u230B",
        'rfr': "\uD835\uDD2F",
        'Rfr': "\u211C",
        'rHar': "\u2964",
        'rhard': "\u21C1",
        'rharu': "\u21C0",
        'rharul': "\u296C",
        'rho': "\u03C1",
        'Rho': "\u03A1",
        'rhov': "\u03F1",
        'RightAngleBracket': "\u27E9",
        'rightarrow': "\u2192",
        'Rightarrow': "\u21D2",
        'RightArrow': "\u2192",
        'RightArrowBar': "\u21E5",
        'RightArrowLeftArrow': "\u21C4",
        'rightarrowtail': "\u21A3",
        'RightCeiling': "\u2309",
        'RightDoubleBracket': "\u27E7",
        'RightDownTeeVector': "\u295D",
        'RightDownVector': "\u21C2",
        'RightDownVectorBar': "\u2955",
        'RightFloor': "\u230B",
        'rightharpoondown': "\u21C1",
        'rightharpoonup': "\u21C0",
        'rightleftarrows': "\u21C4",
        'rightleftharpoons': "\u21CC",
        'rightrightarrows': "\u21C9",
        'rightsquigarrow': "\u219D",
        'RightTee': "\u22A2",
        'RightTeeArrow': "\u21A6",
        'RightTeeVector': "\u295B",
        'rightthreetimes': "\u22CC",
        'RightTriangle': "\u22B3",
        'RightTriangleBar': "\u29D0",
        'RightTriangleEqual': "\u22B5",
        'RightUpDownVector': "\u294F",
        'RightUpTeeVector': "\u295C",
        'RightUpVector': "\u21BE",
        'RightUpVectorBar': "\u2954",
        'RightVector': "\u21C0",
        'RightVectorBar': "\u2953",
        'ring': "\u02DA",
        'risingdotseq': "\u2253",
        'rlarr': "\u21C4",
        'rlhar': "\u21CC",
        'rlm': "\u200F",
        'rmoust': "\u23B1",
        'rmoustache': "\u23B1",
        'rnmid': "\u2AEE",
        'roang': "\u27ED",
        'roarr': "\u21FE",
        'robrk': "\u27E7",
        'ropar': "\u2986",
        'ropf': "\uD835\uDD63",
        'Ropf': "\u211D",
        'roplus': "\u2A2E",
        'rotimes': "\u2A35",
        'RoundImplies': "\u2970",
        'rpar': ')',
        'rpargt': "\u2994",
        'rppolint': "\u2A12",
        'rrarr': "\u21C9",
        'Rrightarrow': "\u21DB",
        'rsaquo': "\u203A",
        'rscr': "\uD835\uDCC7",
        'Rscr': "\u211B",
        'rsh': "\u21B1",
        'Rsh': "\u21B1",
        'rsqb': ']',
        'rsquo': "\u2019",
        'rsquor': "\u2019",
        'rthree': "\u22CC",
        'rtimes': "\u22CA",
        'rtri': "\u25B9",
        'rtrie': "\u22B5",
        'rtrif': "\u25B8",
        'rtriltri': "\u29CE",
        'RuleDelayed': "\u29F4",
        'ruluhar': "\u2968",
        'rx': "\u211E",
        'sacute': "\u015B",
        'Sacute': "\u015A",
        'sbquo': "\u201A",
        'sc': "\u227B",
        'Sc': "\u2ABC",
        'scap': "\u2AB8",
        'scaron': "\u0161",
        'Scaron': "\u0160",
        'sccue': "\u227D",
        'sce': "\u2AB0",
        'scE': "\u2AB4",
        'scedil': "\u015F",
        'Scedil': "\u015E",
        'scirc': "\u015D",
        'Scirc': "\u015C",
        'scnap': "\u2ABA",
        'scnE': "\u2AB6",
        'scnsim': "\u22E9",
        'scpolint': "\u2A13",
        'scsim': "\u227F",
        'scy': "\u0441",
        'Scy': "\u0421",
        'sdot': "\u22C5",
        'sdotb': "\u22A1",
        'sdote': "\u2A66",
        'searhk': "\u2925",
        'searr': "\u2198",
        'seArr': "\u21D8",
        'searrow': "\u2198",
        'sect': '\xA7',
        'semi': ';',
        'seswar': "\u2929",
        'setminus': "\u2216",
        'setmn': "\u2216",
        'sext': "\u2736",
        'sfr': "\uD835\uDD30",
        'Sfr': "\uD835\uDD16",
        'sfrown': "\u2322",
        'sharp': "\u266F",
        'shchcy': "\u0449",
        'SHCHcy': "\u0429",
        'shcy': "\u0448",
        'SHcy': "\u0428",
        'ShortDownArrow': "\u2193",
        'ShortLeftArrow': "\u2190",
        'shortmid': "\u2223",
        'shortparallel': "\u2225",
        'ShortRightArrow': "\u2192",
        'ShortUpArrow': "\u2191",
        'shy': '\xAD',
        'sigma': "\u03C3",
        'Sigma': "\u03A3",
        'sigmaf': "\u03C2",
        'sigmav': "\u03C2",
        'sim': "\u223C",
        'simdot': "\u2A6A",
        'sime': "\u2243",
        'simeq': "\u2243",
        'simg': "\u2A9E",
        'simgE': "\u2AA0",
        'siml': "\u2A9D",
        'simlE': "\u2A9F",
        'simne': "\u2246",
        'simplus': "\u2A24",
        'simrarr': "\u2972",
        'slarr': "\u2190",
        'SmallCircle': "\u2218",
        'smallsetminus': "\u2216",
        'smashp': "\u2A33",
        'smeparsl': "\u29E4",
        'smid': "\u2223",
        'smile': "\u2323",
        'smt': "\u2AAA",
        'smte': "\u2AAC",
        'smtes': "\u2AAC\uFE00",
        'softcy': "\u044C",
        'SOFTcy': "\u042C",
        'sol': '/',
        'solb': "\u29C4",
        'solbar': "\u233F",
        'sopf': "\uD835\uDD64",
        'Sopf': "\uD835\uDD4A",
        'spades': "\u2660",
        'spadesuit': "\u2660",
        'spar': "\u2225",
        'sqcap': "\u2293",
        'sqcaps': "\u2293\uFE00",
        'sqcup': "\u2294",
        'sqcups': "\u2294\uFE00",
        'Sqrt': "\u221A",
        'sqsub': "\u228F",
        'sqsube': "\u2291",
        'sqsubset': "\u228F",
        'sqsubseteq': "\u2291",
        'sqsup': "\u2290",
        'sqsupe': "\u2292",
        'sqsupset': "\u2290",
        'sqsupseteq': "\u2292",
        'squ': "\u25A1",
        'square': "\u25A1",
        'Square': "\u25A1",
        'SquareIntersection': "\u2293",
        'SquareSubset': "\u228F",
        'SquareSubsetEqual': "\u2291",
        'SquareSuperset': "\u2290",
        'SquareSupersetEqual': "\u2292",
        'SquareUnion': "\u2294",
        'squarf': "\u25AA",
        'squf': "\u25AA",
        'srarr': "\u2192",
        'sscr': "\uD835\uDCC8",
        'Sscr': "\uD835\uDCAE",
        'ssetmn': "\u2216",
        'ssmile': "\u2323",
        'sstarf': "\u22C6",
        'star': "\u2606",
        'Star': "\u22C6",
        'starf': "\u2605",
        'straightepsilon': "\u03F5",
        'straightphi': "\u03D5",
        'strns': '\xAF',
        'sub': "\u2282",
        'Sub': "\u22D0",
        'subdot': "\u2ABD",
        'sube': "\u2286",
        'subE': "\u2AC5",
        'subedot': "\u2AC3",
        'submult': "\u2AC1",
        'subne': "\u228A",
        'subnE': "\u2ACB",
        'subplus': "\u2ABF",
        'subrarr': "\u2979",
        'subset': "\u2282",
        'Subset': "\u22D0",
        'subseteq': "\u2286",
        'subseteqq': "\u2AC5",
        'SubsetEqual': "\u2286",
        'subsetneq': "\u228A",
        'subsetneqq': "\u2ACB",
        'subsim': "\u2AC7",
        'subsub': "\u2AD5",
        'subsup': "\u2AD3",
        'succ': "\u227B",
        'succapprox': "\u2AB8",
        'succcurlyeq': "\u227D",
        'Succeeds': "\u227B",
        'SucceedsEqual': "\u2AB0",
        'SucceedsSlantEqual': "\u227D",
        'SucceedsTilde': "\u227F",
        'succeq': "\u2AB0",
        'succnapprox': "\u2ABA",
        'succneqq': "\u2AB6",
        'succnsim': "\u22E9",
        'succsim': "\u227F",
        'SuchThat': "\u220B",
        'sum': "\u2211",
        'Sum': "\u2211",
        'sung': "\u266A",
        'sup': "\u2283",
        'Sup': "\u22D1",
        'sup1': '\xB9',
        'sup2': '\xB2',
        'sup3': '\xB3',
        'supdot': "\u2ABE",
        'supdsub': "\u2AD8",
        'supe': "\u2287",
        'supE': "\u2AC6",
        'supedot': "\u2AC4",
        'Superset': "\u2283",
        'SupersetEqual': "\u2287",
        'suphsol': "\u27C9",
        'suphsub': "\u2AD7",
        'suplarr': "\u297B",
        'supmult': "\u2AC2",
        'supne': "\u228B",
        'supnE': "\u2ACC",
        'supplus': "\u2AC0",
        'supset': "\u2283",
        'Supset': "\u22D1",
        'supseteq': "\u2287",
        'supseteqq': "\u2AC6",
        'supsetneq': "\u228B",
        'supsetneqq': "\u2ACC",
        'supsim': "\u2AC8",
        'supsub': "\u2AD4",
        'supsup': "\u2AD6",
        'swarhk': "\u2926",
        'swarr': "\u2199",
        'swArr': "\u21D9",
        'swarrow': "\u2199",
        'swnwar': "\u292A",
        'szlig': '\xDF',
        'Tab': '\t',
        'target': "\u2316",
        'tau': "\u03C4",
        'Tau': "\u03A4",
        'tbrk': "\u23B4",
        'tcaron': "\u0165",
        'Tcaron': "\u0164",
        'tcedil': "\u0163",
        'Tcedil': "\u0162",
        'tcy': "\u0442",
        'Tcy': "\u0422",
        'tdot': "\u20DB",
        'telrec': "\u2315",
        'tfr': "\uD835\uDD31",
        'Tfr': "\uD835\uDD17",
        'there4': "\u2234",
        'therefore': "\u2234",
        'Therefore': "\u2234",
        'theta': "\u03B8",
        'Theta': "\u0398",
        'thetasym': "\u03D1",
        'thetav': "\u03D1",
        'thickapprox': "\u2248",
        'thicksim': "\u223C",
        'ThickSpace': "\u205F\u200A",
        'thinsp': "\u2009",
        'ThinSpace': "\u2009",
        'thkap': "\u2248",
        'thksim': "\u223C",
        'thorn': '\xFE',
        'THORN': '\xDE',
        'tilde': "\u02DC",
        'Tilde': "\u223C",
        'TildeEqual': "\u2243",
        'TildeFullEqual': "\u2245",
        'TildeTilde': "\u2248",
        'times': '\xD7',
        'timesb': "\u22A0",
        'timesbar': "\u2A31",
        'timesd': "\u2A30",
        'tint': "\u222D",
        'toea': "\u2928",
        'top': "\u22A4",
        'topbot': "\u2336",
        'topcir': "\u2AF1",
        'topf': "\uD835\uDD65",
        'Topf': "\uD835\uDD4B",
        'topfork': "\u2ADA",
        'tosa': "\u2929",
        'tprime': "\u2034",
        'trade': "\u2122",
        'TRADE': "\u2122",
        'triangle': "\u25B5",
        'triangledown': "\u25BF",
        'triangleleft': "\u25C3",
        'trianglelefteq': "\u22B4",
        'triangleq': "\u225C",
        'triangleright': "\u25B9",
        'trianglerighteq': "\u22B5",
        'tridot': "\u25EC",
        'trie': "\u225C",
        'triminus': "\u2A3A",
        'TripleDot': "\u20DB",
        'triplus': "\u2A39",
        'trisb': "\u29CD",
        'tritime': "\u2A3B",
        'trpezium': "\u23E2",
        'tscr': "\uD835\uDCC9",
        'Tscr': "\uD835\uDCAF",
        'tscy': "\u0446",
        'TScy': "\u0426",
        'tshcy': "\u045B",
        'TSHcy': "\u040B",
        'tstrok': "\u0167",
        'Tstrok': "\u0166",
        'twixt': "\u226C",
        'twoheadleftarrow': "\u219E",
        'twoheadrightarrow': "\u21A0",
        'uacute': '\xFA',
        'Uacute': '\xDA',
        'uarr': "\u2191",
        'uArr': "\u21D1",
        'Uarr': "\u219F",
        'Uarrocir': "\u2949",
        'ubrcy': "\u045E",
        'Ubrcy': "\u040E",
        'ubreve': "\u016D",
        'Ubreve': "\u016C",
        'ucirc': '\xFB',
        'Ucirc': '\xDB',
        'ucy': "\u0443",
        'Ucy': "\u0423",
        'udarr': "\u21C5",
        'udblac': "\u0171",
        'Udblac': "\u0170",
        'udhar': "\u296E",
        'ufisht': "\u297E",
        'ufr': "\uD835\uDD32",
        'Ufr': "\uD835\uDD18",
        'ugrave': '\xF9',
        'Ugrave': '\xD9',
        'uHar': "\u2963",
        'uharl': "\u21BF",
        'uharr': "\u21BE",
        'uhblk': "\u2580",
        'ulcorn': "\u231C",
        'ulcorner': "\u231C",
        'ulcrop': "\u230F",
        'ultri': "\u25F8",
        'umacr': "\u016B",
        'Umacr': "\u016A",
        'uml': '\xA8',
        'UnderBar': '_',
        'UnderBrace': "\u23DF",
        'UnderBracket': "\u23B5",
        'UnderParenthesis': "\u23DD",
        'Union': "\u22C3",
        'UnionPlus': "\u228E",
        'uogon': "\u0173",
        'Uogon': "\u0172",
        'uopf': "\uD835\uDD66",
        'Uopf': "\uD835\uDD4C",
        'uparrow': "\u2191",
        'Uparrow': "\u21D1",
        'UpArrow': "\u2191",
        'UpArrowBar': "\u2912",
        'UpArrowDownArrow': "\u21C5",
        'updownarrow': "\u2195",
        'Updownarrow': "\u21D5",
        'UpDownArrow': "\u2195",
        'UpEquilibrium': "\u296E",
        'upharpoonleft': "\u21BF",
        'upharpoonright': "\u21BE",
        'uplus': "\u228E",
        'UpperLeftArrow': "\u2196",
        'UpperRightArrow': "\u2197",
        'upsi': "\u03C5",
        'Upsi': "\u03D2",
        'upsih': "\u03D2",
        'upsilon': "\u03C5",
        'Upsilon': "\u03A5",
        'UpTee': "\u22A5",
        'UpTeeArrow': "\u21A5",
        'upuparrows': "\u21C8",
        'urcorn': "\u231D",
        'urcorner': "\u231D",
        'urcrop': "\u230E",
        'uring': "\u016F",
        'Uring': "\u016E",
        'urtri': "\u25F9",
        'uscr': "\uD835\uDCCA",
        'Uscr': "\uD835\uDCB0",
        'utdot': "\u22F0",
        'utilde': "\u0169",
        'Utilde': "\u0168",
        'utri': "\u25B5",
        'utrif': "\u25B4",
        'uuarr': "\u21C8",
        'uuml': '\xFC',
        'Uuml': '\xDC',
        'uwangle': "\u29A7",
        'vangrt': "\u299C",
        'varepsilon': "\u03F5",
        'varkappa': "\u03F0",
        'varnothing': "\u2205",
        'varphi': "\u03D5",
        'varpi': "\u03D6",
        'varpropto': "\u221D",
        'varr': "\u2195",
        'vArr': "\u21D5",
        'varrho': "\u03F1",
        'varsigma': "\u03C2",
        'varsubsetneq': "\u228A\uFE00",
        'varsubsetneqq': "\u2ACB\uFE00",
        'varsupsetneq': "\u228B\uFE00",
        'varsupsetneqq': "\u2ACC\uFE00",
        'vartheta': "\u03D1",
        'vartriangleleft': "\u22B2",
        'vartriangleright': "\u22B3",
        'vBar': "\u2AE8",
        'Vbar': "\u2AEB",
        'vBarv': "\u2AE9",
        'vcy': "\u0432",
        'Vcy': "\u0412",
        'vdash': "\u22A2",
        'vDash': "\u22A8",
        'Vdash': "\u22A9",
        'VDash': "\u22AB",
        'Vdashl': "\u2AE6",
        'vee': "\u2228",
        'Vee': "\u22C1",
        'veebar': "\u22BB",
        'veeeq': "\u225A",
        'vellip': "\u22EE",
        'verbar': '|',
        'Verbar': "\u2016",
        'vert': '|',
        'Vert': "\u2016",
        'VerticalBar': "\u2223",
        'VerticalLine': '|',
        'VerticalSeparator': "\u2758",
        'VerticalTilde': "\u2240",
        'VeryThinSpace': "\u200A",
        'vfr': "\uD835\uDD33",
        'Vfr': "\uD835\uDD19",
        'vltri': "\u22B2",
        'vnsub': "\u2282\u20D2",
        'vnsup': "\u2283\u20D2",
        'vopf': "\uD835\uDD67",
        'Vopf': "\uD835\uDD4D",
        'vprop': "\u221D",
        'vrtri': "\u22B3",
        'vscr': "\uD835\uDCCB",
        'Vscr': "\uD835\uDCB1",
        'vsubne': "\u228A\uFE00",
        'vsubnE': "\u2ACB\uFE00",
        'vsupne': "\u228B\uFE00",
        'vsupnE': "\u2ACC\uFE00",
        'Vvdash': "\u22AA",
        'vzigzag': "\u299A",
        'wcirc': "\u0175",
        'Wcirc': "\u0174",
        'wedbar': "\u2A5F",
        'wedge': "\u2227",
        'Wedge': "\u22C0",
        'wedgeq': "\u2259",
        'weierp': "\u2118",
        'wfr': "\uD835\uDD34",
        'Wfr': "\uD835\uDD1A",
        'wopf': "\uD835\uDD68",
        'Wopf': "\uD835\uDD4E",
        'wp': "\u2118",
        'wr': "\u2240",
        'wreath': "\u2240",
        'wscr': "\uD835\uDCCC",
        'Wscr': "\uD835\uDCB2",
        'xcap': "\u22C2",
        'xcirc': "\u25EF",
        'xcup': "\u22C3",
        'xdtri': "\u25BD",
        'xfr': "\uD835\uDD35",
        'Xfr': "\uD835\uDD1B",
        'xharr': "\u27F7",
        'xhArr': "\u27FA",
        'xi': "\u03BE",
        'Xi': "\u039E",
        'xlarr': "\u27F5",
        'xlArr': "\u27F8",
        'xmap': "\u27FC",
        'xnis': "\u22FB",
        'xodot': "\u2A00",
        'xopf': "\uD835\uDD69",
        'Xopf': "\uD835\uDD4F",
        'xoplus': "\u2A01",
        'xotime': "\u2A02",
        'xrarr': "\u27F6",
        'xrArr': "\u27F9",
        'xscr': "\uD835\uDCCD",
        'Xscr': "\uD835\uDCB3",
        'xsqcup': "\u2A06",
        'xuplus': "\u2A04",
        'xutri': "\u25B3",
        'xvee': "\u22C1",
        'xwedge': "\u22C0",
        'yacute': '\xFD',
        'Yacute': '\xDD',
        'yacy': "\u044F",
        'YAcy': "\u042F",
        'ycirc': "\u0177",
        'Ycirc': "\u0176",
        'ycy': "\u044B",
        'Ycy': "\u042B",
        'yen': '\xA5',
        'yfr': "\uD835\uDD36",
        'Yfr': "\uD835\uDD1C",
        'yicy': "\u0457",
        'YIcy': "\u0407",
        'yopf': "\uD835\uDD6A",
        'Yopf': "\uD835\uDD50",
        'yscr': "\uD835\uDCCE",
        'Yscr': "\uD835\uDCB4",
        'yucy': "\u044E",
        'YUcy': "\u042E",
        'yuml': '\xFF',
        'Yuml': "\u0178",
        'zacute': "\u017A",
        'Zacute': "\u0179",
        'zcaron': "\u017E",
        'Zcaron': "\u017D",
        'zcy': "\u0437",
        'Zcy': "\u0417",
        'zdot': "\u017C",
        'Zdot': "\u017B",
        'zeetrf': "\u2128",
        'ZeroWidthSpace': "\u200B",
        'zeta': "\u03B6",
        'Zeta': "\u0396",
        'zfr': "\uD835\uDD37",
        'Zfr': "\u2128",
        'zhcy': "\u0436",
        'ZHcy': "\u0416",
        'zigrarr': "\u21DD",
        'zopf': "\uD835\uDD6B",
        'Zopf': "\u2124",
        'zscr': "\uD835\uDCCF",
        'Zscr': "\uD835\uDCB5",
        'zwj': "\u200D",
        'zwnj': "\u200C"
      };
      var decodeMapLegacy = {
        'aacute': '\xE1',
        'Aacute': '\xC1',
        'acirc': '\xE2',
        'Acirc': '\xC2',
        'acute': '\xB4',
        'aelig': '\xE6',
        'AElig': '\xC6',
        'agrave': '\xE0',
        'Agrave': '\xC0',
        'amp': '&',
        'AMP': '&',
        'aring': '\xE5',
        'Aring': '\xC5',
        'atilde': '\xE3',
        'Atilde': '\xC3',
        'auml': '\xE4',
        'Auml': '\xC4',
        'brvbar': '\xA6',
        'ccedil': '\xE7',
        'Ccedil': '\xC7',
        'cedil': '\xB8',
        'cent': '\xA2',
        'copy': '\xA9',
        'COPY': '\xA9',
        'curren': '\xA4',
        'deg': '\xB0',
        'divide': '\xF7',
        'eacute': '\xE9',
        'Eacute': '\xC9',
        'ecirc': '\xEA',
        'Ecirc': '\xCA',
        'egrave': '\xE8',
        'Egrave': '\xC8',
        'eth': '\xF0',
        'ETH': '\xD0',
        'euml': '\xEB',
        'Euml': '\xCB',
        'frac12': '\xBD',
        'frac14': '\xBC',
        'frac34': '\xBE',
        'gt': '>',
        'GT': '>',
        'iacute': '\xED',
        'Iacute': '\xCD',
        'icirc': '\xEE',
        'Icirc': '\xCE',
        'iexcl': '\xA1',
        'igrave': '\xEC',
        'Igrave': '\xCC',
        'iquest': '\xBF',
        'iuml': '\xEF',
        'Iuml': '\xCF',
        'laquo': '\xAB',
        'lt': '<',
        'LT': '<',
        'macr': '\xAF',
        'micro': '\xB5',
        'middot': '\xB7',
        'nbsp': '\xA0',
        'not': '\xAC',
        'ntilde': '\xF1',
        'Ntilde': '\xD1',
        'oacute': '\xF3',
        'Oacute': '\xD3',
        'ocirc': '\xF4',
        'Ocirc': '\xD4',
        'ograve': '\xF2',
        'Ograve': '\xD2',
        'ordf': '\xAA',
        'ordm': '\xBA',
        'oslash': '\xF8',
        'Oslash': '\xD8',
        'otilde': '\xF5',
        'Otilde': '\xD5',
        'ouml': '\xF6',
        'Ouml': '\xD6',
        'para': '\xB6',
        'plusmn': '\xB1',
        'pound': '\xA3',
        'quot': '"',
        'QUOT': '"',
        'raquo': '\xBB',
        'reg': '\xAE',
        'REG': '\xAE',
        'sect': '\xA7',
        'shy': '\xAD',
        'sup1': '\xB9',
        'sup2': '\xB2',
        'sup3': '\xB3',
        'szlig': '\xDF',
        'thorn': '\xFE',
        'THORN': '\xDE',
        'times': '\xD7',
        'uacute': '\xFA',
        'Uacute': '\xDA',
        'ucirc': '\xFB',
        'Ucirc': '\xDB',
        'ugrave': '\xF9',
        'Ugrave': '\xD9',
        'uml': '\xA8',
        'uuml': '\xFC',
        'Uuml': '\xDC',
        'yacute': '\xFD',
        'Yacute': '\xDD',
        'yen': '\xA5',
        'yuml': '\xFF'
      };
      var decodeMapNumeric = {
        '0': "\uFFFD",
        '128': "\u20AC",
        '130': "\u201A",
        '131': "\u0192",
        '132': "\u201E",
        '133': "\u2026",
        '134': "\u2020",
        '135': "\u2021",
        '136': "\u02C6",
        '137': "\u2030",
        '138': "\u0160",
        '139': "\u2039",
        '140': "\u0152",
        '142': "\u017D",
        '145': "\u2018",
        '146': "\u2019",
        '147': "\u201C",
        '148': "\u201D",
        '149': "\u2022",
        '150': "\u2013",
        '151': "\u2014",
        '152': "\u02DC",
        '153': "\u2122",
        '154': "\u0161",
        '155': "\u203A",
        '156': "\u0153",
        '158': "\u017E",
        '159': "\u0178"
      };
      var invalidReferenceCodePoints = [1, 2, 3, 4, 5, 6, 7, 8, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 64976, 64977, 64978, 64979, 64980, 64981, 64982, 64983, 64984, 64985, 64986, 64987, 64988, 64989, 64990, 64991, 64992, 64993, 64994, 64995, 64996, 64997, 64998, 64999, 65000, 65001, 65002, 65003, 65004, 65005, 65006, 65007, 65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111];
      /*--------------------------------------------------------------------------*/

      var stringFromCharCode = String.fromCharCode;
      var object = {};
      var hasOwnProperty = object.hasOwnProperty;

      var has = function has(object, propertyName) {
        return hasOwnProperty.call(object, propertyName);
      };

      var contains = function contains(array, value) {
        var index = -1;
        var length = array.length;

        while (++index < length) {
          if (array[index] == value) {
            return true;
          }
        }

        return false;
      };

      var merge = function merge(options, defaults) {
        if (!options) {
          return defaults;
        }

        var result = {};
        var key;

        for (key in defaults) {
          // A `hasOwnProperty` check is not needed here, since only recognized
          // option names are used anyway. Any others are ignored.
          result[key] = has(options, key) ? options[key] : defaults[key];
        }

        return result;
      }; // Modified version of `ucs2encode`; see https://mths.be/punycode.


      var codePointToSymbol = function codePointToSymbol(codePoint, strict) {
        var output = '';

        if (codePoint >= 0xD800 && codePoint <= 0xDFFF || codePoint > 0x10FFFF) {
          // See issue #4:
          // “Otherwise, if the number is in the range 0xD800 to 0xDFFF or is
          // greater than 0x10FFFF, then this is a parse error. Return a U+FFFD
          // REPLACEMENT CHARACTER.”
          if (strict) {
            parseError('character reference outside the permissible Unicode range');
          }

          return "\uFFFD";
        }

        if (has(decodeMapNumeric, codePoint)) {
          if (strict) {
            parseError('disallowed character reference');
          }

          return decodeMapNumeric[codePoint];
        }

        if (strict && contains(invalidReferenceCodePoints, codePoint)) {
          parseError('disallowed character reference');
        }

        if (codePoint > 0xFFFF) {
          codePoint -= 0x10000;
          output += stringFromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
          codePoint = 0xDC00 | codePoint & 0x3FF;
        }

        output += stringFromCharCode(codePoint);
        return output;
      };

      var hexEscape = function hexEscape(codePoint) {
        return '&#x' + codePoint.toString(16).toUpperCase() + ';';
      };

      var decEscape = function decEscape(codePoint) {
        return '&#' + codePoint + ';';
      };

      var parseError = function parseError(message) {
        throw Error('Parse error: ' + message);
      };
      /*--------------------------------------------------------------------------*/


      var encode = function encode(string, options) {
        options = merge(options, encode.options);
        var strict = options.strict;

        if (strict && regexInvalidRawCodePoint.test(string)) {
          parseError('forbidden code point');
        }

        var encodeEverything = options.encodeEverything;
        var useNamedReferences = options.useNamedReferences;
        var allowUnsafeSymbols = options.allowUnsafeSymbols;
        var escapeCodePoint = options.decimal ? decEscape : hexEscape;

        var escapeBmpSymbol = function escapeBmpSymbol(symbol) {
          return escapeCodePoint(symbol.charCodeAt(0));
        };

        if (encodeEverything) {
          // Encode ASCII symbols.
          string = string.replace(regexAsciiWhitelist, function (symbol) {
            // Use named references if requested & possible.
            if (useNamedReferences && has(encodeMap, symbol)) {
              return '&' + encodeMap[symbol] + ';';
            }

            return escapeBmpSymbol(symbol);
          }); // Shorten a few escapes that represent two symbols, of which at least one
          // is within the ASCII range.

          if (useNamedReferences) {
            string = string.replace(/&gt;\u20D2/g, '&nvgt;').replace(/&lt;\u20D2/g, '&nvlt;').replace(/&#x66;&#x6A;/g, '&fjlig;');
          } // Encode non-ASCII symbols.


          if (useNamedReferences) {
            // Encode non-ASCII symbols that can be replaced with a named reference.
            string = string.replace(regexEncodeNonAscii, function (string) {
              // Note: there is no need to check `has(encodeMap, string)` here.
              return '&' + encodeMap[string] + ';';
            });
          } // Note: any remaining non-ASCII symbols are handled outside of the `if`.

        } else if (useNamedReferences) {
          // Apply named character references.
          // Encode `<>"'&` using named character references.
          if (!allowUnsafeSymbols) {
            string = string.replace(regexEscape, function (string) {
              return '&' + encodeMap[string] + ';'; // no need to check `has()` here
            });
          } // Shorten escapes that represent two symbols, of which at least one is
          // `<>"'&`.


          string = string.replace(/&gt;\u20D2/g, '&nvgt;').replace(/&lt;\u20D2/g, '&nvlt;'); // Encode non-ASCII symbols that can be replaced with a named reference.

          string = string.replace(regexEncodeNonAscii, function (string) {
            // Note: there is no need to check `has(encodeMap, string)` here.
            return '&' + encodeMap[string] + ';';
          });
        } else if (!allowUnsafeSymbols) {
          // Encode `<>"'&` using hexadecimal escapes, now that they’re not handled
          // using named character references.
          string = string.replace(regexEscape, escapeBmpSymbol);
        }

        return string // Encode astral symbols.
        .replace(regexAstralSymbols, function ($0) {
          // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
          var high = $0.charCodeAt(0);
          var low = $0.charCodeAt(1);
          var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
          return escapeCodePoint(codePoint);
        }) // Encode any remaining BMP symbols that are not printable ASCII symbols
        // using a hexadecimal escape.
        .replace(regexBmpWhitelist, escapeBmpSymbol);
      }; // Expose default options (so they can be overridden globally).


      encode.options = {
        'allowUnsafeSymbols': false,
        'encodeEverything': false,
        'strict': false,
        'useNamedReferences': false,
        'decimal': false
      };

      var decode = function decode(html, options) {
        options = merge(options, decode.options);
        var strict = options.strict;

        if (strict && regexInvalidEntity.test(html)) {
          parseError('malformed character reference');
        }

        return html.replace(regexDecode, function ($0, $1, $2, $3, $4, $5, $6, $7, $8) {
          var codePoint;
          var semicolon;
          var decDigits;
          var hexDigits;
          var reference;
          var next;

          if ($1) {
            reference = $1; // Note: there is no need to check `has(decodeMap, reference)`.

            return decodeMap[reference];
          }

          if ($2) {
            // Decode named character references without trailing `;`, e.g. `&amp`.
            // This is only a parse error if it gets converted to `&`, or if it is
            // followed by `=` in an attribute context.
            reference = $2;
            next = $3;

            if (next && options.isAttributeValue) {
              if (strict && next == '=') {
                parseError('`&` did not start a character reference');
              }

              return $0;
            } else {
              if (strict) {
                parseError('named character reference was not terminated by a semicolon');
              } // Note: there is no need to check `has(decodeMapLegacy, reference)`.


              return decodeMapLegacy[reference] + (next || '');
            }
          }

          if ($4) {
            // Decode decimal escapes, e.g. `&#119558;`.
            decDigits = $4;
            semicolon = $5;

            if (strict && !semicolon) {
              parseError('character reference was not terminated by a semicolon');
            }

            codePoint = parseInt(decDigits, 10);
            return codePointToSymbol(codePoint, strict);
          }

          if ($6) {
            // Decode hexadecimal escapes, e.g. `&#x1D306;`.
            hexDigits = $6;
            semicolon = $7;

            if (strict && !semicolon) {
              parseError('character reference was not terminated by a semicolon');
            }

            codePoint = parseInt(hexDigits, 16);
            return codePointToSymbol(codePoint, strict);
          } // If we’re still here, `if ($7)` is implied; it’s an ambiguous
          // ampersand for sure. https://mths.be/notes/ambiguous-ampersands


          if (strict) {
            parseError('named character reference was not terminated by a semicolon');
          }

          return $0;
        });
      }; // Expose default options (so they can be overridden globally).


      decode.options = {
        'isAttributeValue': false,
        'strict': false
      };

      var escape = function escape(string) {
        return string.replace(regexEscape, function ($0) {
          // Note: there is no need to check `has(escapeMap, $0)` here.
          return escapeMap[$0];
        });
      };
      /*--------------------------------------------------------------------------*/


      var he = {
        'version': '1.2.0',
        'encode': encode,
        'decode': decode,
        'escape': escape,
        'unescape': decode
      }; // Some AMD build optimizers, like r.js, check for specific condition patterns
      // like the following:

      if (freeExports && !freeExports.nodeType) {
        if (freeModule) {
          // in Node.js, io.js, or RingoJS v0.8.0+
          freeModule.exports = he;
        } else {
          // in Narwhal or RingoJS v0.7.0-
          for (var key in he) {
            has(he, key) && (freeExports[key] = he[key]);
          }
        }
      } else {
        // in Rhino or a web browser
        root.he = he;
      }
    })(commonjsGlobal);
  });

  var version$1 = "5.10.9";

  /**
   * html-entities-not-email-friendly
   * All HTML entities which are not email template friendly
   * Version: 0.2.5
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/all-named-html-entities
   */
  var notEmailFriendly = {
    AMP: "amp",
    Abreve: "#x102",
    Acy: "#x410",
    Afr: "#x1D504",
    Amacr: "#x100",
    And: "#x2A53",
    Aogon: "#x104",
    Aopf: "#x1D538",
    ApplyFunction: "#x2061",
    Ascr: "#x1D49C",
    Assign: "#x2254",
    Backslash: "#x2216",
    Barv: "#x2AE7",
    Barwed: "#x2306",
    Bcy: "#x411",
    Because: "#x2235",
    Bernoullis: "#x212C",
    Bfr: "#x1D505",
    Bopf: "#x1D539",
    Breve: "#x2D8",
    Bscr: "#x212C",
    Bumpeq: "#x224E",
    CHcy: "#x427",
    COPY: "copy",
    Cacute: "#x106",
    Cap: "#x22D2",
    CapitalDifferentialD: "#x2145",
    Cayleys: "#x212D",
    Ccaron: "#x10C",
    Ccirc: "#x108",
    Cconint: "#x2230",
    Cdot: "#x10A",
    Cedilla: "cedil",
    CenterDot: "middot",
    Cfr: "#x212D",
    CircleDot: "#x2299",
    CircleMinus: "#x2296",
    CirclePlus: "oplus",
    CircleTimes: "otimes",
    ClockwiseContourIntegral: "#x2232",
    CloseCurlyDoubleQuote: "rdquo",
    CloseCurlyQuote: "rsquo",
    Colon: "#x2237",
    Colone: "#x2A74",
    Congruent: "equiv",
    Conint: "#x222F",
    ContourIntegral: "#x222E",
    Copf: "#x2102",
    Coproduct: "#x2210",
    CounterClockwiseContourIntegral: "#x2233",
    Cross: "#x2A2F",
    Cscr: "#x1D49E",
    Cup: "#x22D3",
    CupCap: "#x224D",
    DD: "#x2145",
    DDotrahd: "#x2911",
    DJcy: "#x402",
    DScy: "#x405",
    DZcy: "#x40F",
    Darr: "#x21A1",
    Dashv: "#x2AE4",
    Dcaron: "#x10E",
    Dcy: "#x414",
    Del: "#x2207",
    Dfr: "#x1D507",
    DiacriticalAcute: "acute",
    DiacriticalDot: "#x2D9",
    DiacriticalDoubleAcute: "#x2DD",
    DiacriticalGrave: "#x60",
    DiacriticalTilde: "tilde",
    Diamond: "#x22C4",
    DifferentialD: "#x2146",
    Dopf: "#x1D53B",
    Dot: "#xA8",
    DotDot: "#x20DC",
    DotEqual: "#x2250",
    DoubleContourIntegral: "#x222F",
    DoubleDot: "#xA8",
    DoubleDownArrow: "dArr",
    DoubleLeftArrow: "lArr",
    DoubleLeftRightArrow: "#x21D4",
    DoubleLeftTee: "#x2AE4",
    DoubleLongLeftArrow: "#x27F8",
    DoubleLongLeftRightArrow: "#x27FA",
    DoubleLongRightArrow: "#x27F9",
    DoubleRightArrow: "rArr",
    DoubleRightTee: "#x22A8",
    DoubleUpArrow: "uArr",
    DoubleUpDownArrow: "#x21D5",
    DoubleVerticalBar: "#x2225",
    DownArrow: "darr",
    DownArrowBar: "#x2913",
    DownArrowUpArrow: "#x21F5",
    DownBreve: "#x311",
    DownLeftRightVector: "#x2950",
    DownLeftTeeVector: "#x295E",
    DownLeftVector: "#x21BD",
    DownLeftVectorBar: "#x2956",
    DownRightTeeVector: "#x295F",
    DownRightVector: "#x21C1",
    DownRightVectorBar: "#x2957",
    DownTee: "#x22A4",
    DownTeeArrow: "#x21A7",
    Downarrow: "dArr",
    Dscr: "#x1D49F",
    Dstrok: "#x110",
    ENG: "#x14A",
    Ecaron: "#x11A",
    Ecy: "#x42D",
    Edot: "#x116",
    Efr: "#x1D508",
    Element: "#x2208",
    Emacr: "#x112",
    EmptySmallSquare: "#x25FB",
    EmptyVerySmallSquare: "#x25AB",
    Eogon: "#x118",
    Eopf: "#x1D53C",
    Equal: "#x2A75",
    EqualTilde: "#x2242",
    Equilibrium: "#x21CC",
    Escr: "#x2130",
    Esim: "#x2A73",
    Exists: "exist",
    ExponentialE: "#x2147",
    Fcy: "#x424",
    Ffr: "#x1D509",
    FilledSmallSquare: "#x25FC",
    FilledVerySmallSquare: "#x25AA",
    Fopf: "#x1D53D",
    ForAll: "forall",
    Fouriertrf: "#x2131",
    Fscr: "#x2131",
    GJcy: "#x403",
    GT: "gt",
    Gammad: "#x3DC",
    Gbreve: "#x11E",
    Gcedil: "#x122",
    Gcirc: "#x11C",
    Gcy: "#x413",
    Gdot: "#x120",
    Gfr: "#x1D50A",
    Gg: "#x22D9",
    Gopf: "#x1D53E",
    GreaterEqual: "ge",
    GreaterEqualLess: "#x22DB",
    GreaterFullEqual: "#x2267",
    GreaterGreater: "#x2AA2",
    GreaterLess: "#x2277",
    GreaterSlantEqual: "#x2A7E",
    GreaterTilde: "#x2273",
    Gscr: "#x1D4A2",
    Gt: "#x226B",
    HARDcy: "#x42A",
    Hacek: "#x2C7",
    Hcirc: "#x124",
    Hfr: "#x210C",
    HilbertSpace: "#x210B",
    Hopf: "#x210D",
    HorizontalLine: "#x2500",
    Hscr: "#x210B",
    Hstrok: "#x126",
    HumpDownHump: "#x224E",
    HumpEqual: "#x224F",
    IEcy: "#x415",
    IJlig: "#x132",
    IOcy: "#x401",
    Icy: "#x418",
    Idot: "#x130",
    Ifr: "#x2111",
    Im: "#x2111",
    Imacr: "#x12A",
    ImaginaryI: "#x2148",
    Implies: "rArr",
    Int: "#x222C",
    Integral: "int",
    Intersection: "#x22C2",
    InvisibleComma: "#x2063",
    InvisibleTimes: "#x2062",
    Iogon: "#x12E",
    Iopf: "#x1D540",
    Iscr: "#x2110",
    Itilde: "#x128",
    Iukcy: "#x406",
    Jcirc: "#x134",
    Jcy: "#x419",
    Jfr: "#x1D50D",
    Jopf: "#x1D541",
    Jscr: "#x1D4A5",
    Jsercy: "#x408",
    Jukcy: "#x404",
    KHcy: "#x425",
    KJcy: "#x40C",
    Kcedil: "#x136",
    Kcy: "#x41A",
    Kfr: "#x1D50E",
    Kopf: "#x1D542",
    Kscr: "#x1D4A6",
    LJcy: "#x409",
    LT: "lt",
    Lacute: "#x139",
    Lang: "#x27EA",
    Laplacetrf: "#x2112",
    Larr: "#x219E",
    Lcaron: "#x13D",
    Lcedil: "#x13B",
    Lcy: "#x41B",
    LeftAngleBracket: "lang",
    LeftArrow: "larr",
    LeftArrowBar: "#x21E4",
    LeftArrowRightArrow: "#x21C6",
    LeftCeiling: "lceil",
    LeftDoubleBracket: "#x27E6",
    LeftDownTeeVector: "#x2961",
    LeftDownVector: "#x21C3",
    LeftDownVectorBar: "#x2959",
    LeftFloor: "lfloor",
    LeftRightArrow: "harr",
    LeftRightVector: "#x294E",
    LeftTee: "#x22A3",
    LeftTeeArrow: "#x21A4",
    LeftTeeVector: "#x295A",
    LeftTriangle: "#x22B2",
    LeftTriangleBar: "#x29CF",
    LeftTriangleEqual: "#x22B4",
    LeftUpDownVector: "#x2951",
    LeftUpTeeVector: "#x2960",
    LeftUpVector: "#x21BF",
    LeftUpVectorBar: "#x2958",
    LeftVector: "#x21BC",
    LeftVectorBar: "#x2952",
    Leftarrow: "lArr",
    Leftrightarrow: "#x21D4",
    LessEqualGreater: "#x22DA",
    LessFullEqual: "#x2266",
    LessGreater: "#x2276",
    LessLess: "#x2AA1",
    LessSlantEqual: "#x2A7D",
    LessTilde: "#x2272",
    Lfr: "#x1D50F",
    Ll: "#x22D8",
    Lleftarrow: "#x21DA",
    Lmidot: "#x13F",
    LongLeftArrow: "#x27F5",
    LongLeftRightArrow: "#x27F7",
    LongRightArrow: "#x27F6",
    Longleftarrow: "#x27F8",
    Longleftrightarrow: "#x27FA",
    Longrightarrow: "#x27F9",
    Lopf: "#x1D543",
    LowerLeftArrow: "#x2199",
    LowerRightArrow: "#x2198",
    Lscr: "#x2112",
    Lsh: "#x21B0",
    Lstrok: "#x141",
    Lt: "#x226A",
    Map: "#x2905",
    Mcy: "#x41C",
    MediumSpace: "#x205F",
    Mellintrf: "#x2133",
    Mfr: "#x1D510",
    MinusPlus: "#x2213",
    Mopf: "#x1D544",
    Mscr: "#x2133",
    NJcy: "#x40A",
    Nacute: "#x143",
    Ncaron: "#x147",
    Ncedil: "#x145",
    Ncy: "#x41D",
    NegativeMediumSpace: "#x200B",
    NegativeThickSpace: "#x200B",
    NegativeThinSpace: "#x200B",
    NegativeVeryThinSpace: "#x200B",
    NestedGreaterGreater: "#x226B",
    NestedLessLess: "#x226A",
    Nfr: "#x1D511",
    NoBreak: "#x2060",
    NonBreakingSpace: "nbsp",
    Nopf: "#x2115",
    Not: "#x2AEC",
    NotCongruent: "#x2262",
    NotCupCap: "#x226D",
    NotDoubleVerticalBar: "#x2226",
    NotElement: "notin",
    NotEqual: "ne",
    NotEqualTilde: "#x2242;&#x338",
    NotExists: "#x2204",
    NotGreater: "#x226F",
    NotGreaterEqual: "#x2271",
    NotGreaterFullEqual: "#x2267;&#x338",
    NotGreaterGreater: "#x226B;&#x338",
    NotGreaterLess: "#x2279",
    NotGreaterSlantEqual: "#x2A7E;&#x338",
    NotGreaterTilde: "#x2275",
    NotHumpDownHump: "#x224E;&#x338",
    NotHumpEqual: "#x224F;&#x338",
    NotLeftTriangle: "#x22EA",
    NotLeftTriangleBar: "#x29CF;&#x338",
    NotLeftTriangleEqual: "#x22EC",
    NotLess: "#x226E",
    NotLessEqual: "#x2270",
    NotLessGreater: "#x2278",
    NotLessLess: "#x226A;&#x338",
    NotLessSlantEqual: "#x2A7D;&#x338",
    NotLessTilde: "#x2274",
    NotNestedGreaterGreater: "#x2AA2;&#x338",
    NotNestedLessLess: "#x2AA1;&#x338",
    NotPrecedes: "#x2280",
    NotPrecedesEqual: "#x2AAF;&#x338",
    NotPrecedesSlantEqual: "#x22E0",
    NotReverseElement: "#x220C",
    NotRightTriangle: "#x22EB",
    NotRightTriangleBar: "#x29D0;&#x338",
    NotRightTriangleEqual: "#x22ED",
    NotSquareSubset: "#x228F;&#x338",
    NotSquareSubsetEqual: "#x22E2",
    NotSquareSuperset: "#x2290;&#x338",
    NotSquareSupersetEqual: "#x22E3",
    NotSubset: "#x2282;&#x20D2",
    NotSubsetEqual: "#x2288",
    NotSucceeds: "#x2281",
    NotSucceedsEqual: "#x2AB0;&#x338",
    NotSucceedsSlantEqual: "#x22E1",
    NotSucceedsTilde: "#x227F;&#x338",
    NotSuperset: "#x2283;&#x20D2",
    NotSupersetEqual: "#x2289",
    NotTilde: "#x2241",
    NotTildeEqual: "#x2244",
    NotTildeFullEqual: "#x2247",
    NotTildeTilde: "#x2249",
    NotVerticalBar: "#x2224",
    Nscr: "#x1D4A9",
    Ocy: "#x41E",
    Odblac: "#x150",
    Ofr: "#x1D512",
    Omacr: "#x14C",
    Oopf: "#x1D546",
    OpenCurlyDoubleQuote: "ldquo",
    OpenCurlyQuote: "lsquo",
    Or: "#x2A54",
    Oscr: "#x1D4AA",
    Otimes: "#x2A37",
    OverBar: "oline",
    OverBrace: "#x23DE",
    OverBracket: "#x23B4",
    OverParenthesis: "#x23DC",
    PartialD: "part",
    Pcy: "#x41F",
    Pfr: "#x1D513",
    PlusMinus: "#xB1",
    Poincareplane: "#x210C",
    Popf: "#x2119",
    Pr: "#x2ABB",
    Precedes: "#x227A",
    PrecedesEqual: "#x2AAF",
    PrecedesSlantEqual: "#x227C",
    PrecedesTilde: "#x227E",
    Product: "prod",
    Proportion: "#x2237",
    Proportional: "prop",
    Pscr: "#x1D4AB",
    QUOT: "quot",
    Qfr: "#x1D514",
    Qopf: "#x211A",
    Qscr: "#x1D4AC",
    RBarr: "#x2910",
    REG: "reg",
    Racute: "#x154",
    Rang: "#x27EB",
    Rarr: "#x21A0",
    Rarrtl: "#x2916",
    Rcaron: "#x158",
    Rcedil: "#x156",
    Rcy: "#x420",
    Re: "#x211C",
    ReverseElement: "ni",
    ReverseEquilibrium: "#x21CB",
    ReverseUpEquilibrium: "#x296F",
    Rfr: "#x211C",
    RightAngleBracket: "rang",
    RightArrow: "rarr",
    RightArrowBar: "#x21E5",
    RightArrowLeftArrow: "#x21C4",
    RightCeiling: "rceil",
    RightDoubleBracket: "#x27E7",
    RightDownTeeVector: "#x295D",
    RightDownVector: "#x21C2",
    RightDownVectorBar: "#x2955",
    RightFloor: "rfloor",
    RightTee: "#x22A2",
    RightTeeArrow: "#x21A6",
    RightTeeVector: "#x295B",
    RightTriangle: "#x22B3",
    RightTriangleBar: "#x29D0",
    RightTriangleEqual: "#x22B5",
    RightUpDownVector: "#x294F",
    RightUpTeeVector: "#x295C",
    RightUpVector: "#x21BE",
    RightUpVectorBar: "#x2954",
    RightVector: "#x21C0",
    RightVectorBar: "#x2953",
    Rightarrow: "rArr",
    Ropf: "#x211D",
    RoundImplies: "#x2970",
    Rrightarrow: "#x21DB",
    Rscr: "#x211B",
    Rsh: "#x21B1",
    RuleDelayed: "#x29F4",
    SHCHcy: "#x429",
    SHcy: "#x428",
    SOFTcy: "#x42C",
    Sacute: "#x15A",
    Sc: "#x2ABC",
    Scedil: "#x15E",
    Scirc: "#x15C",
    Scy: "#x421",
    Sfr: "#x1D516",
    ShortDownArrow: "darr",
    ShortLeftArrow: "larr",
    ShortRightArrow: "rarr",
    ShortUpArrow: "uarr",
    SmallCircle: "#x2218",
    Sopf: "#x1D54A",
    Sqrt: "#x221A",
    Square: "#x25A1",
    SquareIntersection: "#x2293",
    SquareSubset: "#x228F",
    SquareSubsetEqual: "#x2291",
    SquareSuperset: "#x2290",
    SquareSupersetEqual: "#x2292",
    SquareUnion: "#x2294",
    Sscr: "#x1D4AE",
    Star: "#x22C6",
    Sub: "#x22D0",
    Subset: "#x22D0",
    SubsetEqual: "sube",
    Succeeds: "#x227B",
    SucceedsEqual: "#x2AB0",
    SucceedsSlantEqual: "#x227D",
    SucceedsTilde: "#x227F",
    SuchThat: "ni",
    Sum: "sum",
    Sup: "#x22D1",
    Superset: "sup",
    SupersetEqual: "supe",
    Supset: "#x22D1",
    TRADE: "trade",
    TSHcy: "#x40B",
    TScy: "#x426",
    Tab: "#x9",
    Tcaron: "#x164",
    Tcedil: "#x162",
    Tcy: "#x422",
    Tfr: "#x1D517",
    Therefore: "there4",
    ThickSpace: "#x205F;&#x200A",
    ThinSpace: "thinsp",
    Tilde: "sim",
    TildeEqual: "#x2243",
    TildeFullEqual: "cong",
    TildeTilde: "#x2248",
    Topf: "#x1D54B",
    TripleDot: "#x20DB",
    Tscr: "#x1D4AF",
    Tstrok: "#x166",
    Uarr: "#x219F",
    Uarrocir: "#x2949",
    Ubrcy: "#x40E",
    Ubreve: "#x16C",
    Ucy: "#x423",
    Udblac: "#x170",
    Ufr: "#x1D518",
    Umacr: "#x16A",
    UnderBrace: "#x23DF",
    UnderBracket: "#x23B5",
    UnderParenthesis: "#x23DD",
    Union: "#x22C3",
    UnionPlus: "#x228E",
    Uogon: "#x172",
    Uopf: "#x1D54C",
    UpArrow: "uarr",
    UpArrowBar: "#x2912",
    UpArrowDownArrow: "#x21C5",
    UpDownArrow: "#x2195",
    UpEquilibrium: "#x296E",
    UpTee: "#x22A5",
    UpTeeArrow: "#x21A5",
    Uparrow: "uArr",
    Updownarrow: "#x21D5",
    UpperLeftArrow: "#x2196",
    UpperRightArrow: "#x2197",
    Upsi: "#x3D2",
    Uring: "#x16E",
    Uscr: "#x1D4B0",
    Utilde: "#x168",
    VDash: "#x22AB",
    Vbar: "#x2AEB",
    Vcy: "#x412",
    Vdash: "#x22A9",
    Vdashl: "#x2AE6",
    Vee: "#x22C1",
    Verbar: "#x2016",
    Vert: "#x2016",
    VerticalBar: "#x2223",
    VerticalSeparator: "#x2758",
    VerticalTilde: "#x2240",
    VeryThinSpace: "#x200A",
    Vfr: "#x1D519",
    Vopf: "#x1D54D",
    Vscr: "#x1D4B1",
    Vvdash: "#x22AA",
    Wcirc: "#x174",
    Wedge: "#x22C0",
    Wfr: "#x1D51A",
    Wopf: "#x1D54E",
    Wscr: "#x1D4B2",
    Xfr: "#x1D51B",
    Xopf: "#x1D54F",
    Xscr: "#x1D4B3",
    YAcy: "#x42F",
    YIcy: "#x407",
    YUcy: "#x42E",
    Ycirc: "#x176",
    Ycy: "#x42B",
    Yfr: "#x1D51C",
    Yopf: "#x1D550",
    Yscr: "#x1D4B4",
    ZHcy: "#x416",
    Zacute: "#x179",
    Zcaron: "#x17D",
    Zcy: "#x417",
    Zdot: "#x17B",
    ZeroWidthSpace: "#x200B",
    Zfr: "#x2128",
    Zopf: "#x2124",
    Zscr: "#x1D4B5",
    abreve: "#x103",
    ac: "#x223E",
    acE: "#x223E;&#x333",
    acd: "#x223F",
    acy: "#x430",
    af: "#x2061",
    afr: "#x1D51E",
    aleph: "#x2135",
    amacr: "#x101",
    amalg: "#x2A3F",
    andand: "#x2A55",
    andd: "#x2A5C",
    andslope: "#x2A58",
    andv: "#x2A5A",
    ange: "#x29A4",
    angle: "ang",
    angmsd: "#x2221",
    angmsdaa: "#x29A8",
    angmsdab: "#x29A9",
    angmsdac: "#x29AA",
    angmsdad: "#x29AB",
    angmsdae: "#x29AC",
    angmsdaf: "#x29AD",
    angmsdag: "#x29AE",
    angmsdah: "#x29AF",
    angrt: "#x221F",
    angrtvb: "#x22BE",
    angrtvbd: "#x299D",
    angsph: "#x2222",
    angst: "#xC5",
    angzarr: "#x237C",
    aogon: "#x105",
    aopf: "#x1D552",
    ap: "#x2248",
    apE: "#x2A70",
    apacir: "#x2A6F",
    ape: "#x224A",
    apid: "#x224B",
    approx: "#x2248",
    approxeq: "#x224A",
    ascr: "#x1D4B6",
    asympeq: "#x224D",
    awconint: "#x2233",
    awint: "#x2A11",
    bNot: "#x2AED",
    backcong: "#x224C",
    backepsilon: "#x3F6",
    backprime: "#x2035",
    backsim: "#x223D",
    backsimeq: "#x22CD",
    barvee: "#x22BD",
    barwed: "#x2305",
    barwedge: "#x2305",
    bbrk: "#x23B5",
    bbrktbrk: "#x23B6",
    bcong: "#x224C",
    bcy: "#x431",
    becaus: "#x2235",
    because: "#x2235",
    bemptyv: "#x29B0",
    bepsi: "#x3F6",
    bernou: "#x212C",
    beth: "#x2136",
    between: "#x226C",
    bfr: "#x1D51F",
    bigcap: "#x22C2",
    bigcirc: "#x25EF",
    bigcup: "#x22C3",
    bigodot: "#x2A00",
    bigoplus: "#x2A01",
    bigotimes: "#x2A02",
    bigsqcup: "#x2A06",
    bigstar: "#x2605",
    bigtriangledown: "#x25BD",
    bigtriangleup: "#x25B3",
    biguplus: "#x2A04",
    bigvee: "#x22C1",
    bigwedge: "#x22C0",
    bkarow: "#x290D",
    blacklozenge: "#x29EB",
    blacksquare: "#x25AA",
    blacktriangle: "#x25B4",
    blacktriangledown: "#x25BE",
    blacktriangleleft: "#x25C2",
    blacktriangleright: "#x25B8",
    blank: "#x2423",
    blk12: "#x2592",
    blk14: "#x2591",
    blk34: "#x2593",
    block: "#x2588",
    bne: "&#x20E5",
    bnequiv: "#x2261;&#x20E5",
    bnot: "#x2310",
    bopf: "#x1D553",
    bot: "#x22A5",
    bottom: "#x22A5",
    bowtie: "#x22C8",
    boxDL: "#x2557",
    boxDR: "#x2554",
    boxDl: "#x2556",
    boxDr: "#x2553",
    boxH: "#x2550",
    boxHD: "#x2566",
    boxHU: "#x2569",
    boxHd: "#x2564",
    boxHu: "#x2567",
    boxUL: "#x255D",
    boxUR: "#x255A",
    boxUl: "#x255C",
    boxUr: "#x2559",
    boxV: "#x2551",
    boxVH: "#x256C",
    boxVL: "#x2563",
    boxVR: "#x2560",
    boxVh: "#x256B",
    boxVl: "#x2562",
    boxVr: "#x255F",
    boxbox: "#x29C9",
    boxdL: "#x2555",
    boxdR: "#x2552",
    boxdl: "#x2510",
    boxdr: "#x250C",
    boxh: "#x2500",
    boxhD: "#x2565",
    boxhU: "#x2568",
    boxhd: "#x252C",
    boxhu: "#x2534",
    boxminus: "#x229F",
    boxplus: "#x229E",
    boxtimes: "#x22A0",
    boxuL: "#x255B",
    boxuR: "#x2558",
    boxul: "#x2518",
    boxur: "#x2514",
    boxv: "#x2502",
    boxvH: "#x256A",
    boxvL: "#x2561",
    boxvR: "#x255E",
    boxvh: "#x253C",
    boxvl: "#x2524",
    boxvr: "#x251C",
    bprime: "#x2035",
    breve: "#x2D8",
    bscr: "#x1D4B7",
    bsemi: "#x204F",
    bsim: "#x223D",
    bsime: "#x22CD",
    bsolb: "#x29C5",
    bsolhsub: "#x27C8",
    bullet: "bull",
    bump: "#x224E",
    bumpE: "#x2AAE",
    bumpe: "#x224F",
    bumpeq: "#x224F",
    cacute: "#x107",
    capand: "#x2A44",
    capbrcup: "#x2A49",
    capcap: "#x2A4B",
    capcup: "#x2A47",
    capdot: "#x2A40",
    caps: "#x2229;&#xFE00",
    caret: "#x2041",
    caron: "#x2C7",
    ccaps: "#x2A4D",
    ccaron: "#x10D",
    ccirc: "#x109",
    ccups: "#x2A4C",
    ccupssm: "#x2A50",
    cdot: "#x10B",
    cemptyv: "#x29B2",
    centerdot: "middot",
    cfr: "#x1D520",
    chcy: "#x447",
    check: "#x2713",
    checkmark: "#x2713",
    cir: "#x25CB",
    cirE: "#x29C3",
    circeq: "#x2257",
    circlearrowleft: "#x21BA",
    circlearrowright: "#x21BB",
    circledR: "reg",
    circledS: "#x24C8",
    circledast: "#x229B",
    circledcirc: "#x229A",
    circleddash: "#x229D",
    cire: "#x2257",
    cirfnint: "#x2A10",
    cirmid: "#x2AEF",
    cirscir: "#x29C2",
    clubsuit: "clubs",
    colone: "#x2254",
    coloneq: "#x2254",
    comp: "#x2201",
    compfn: "#x2218",
    complement: "#x2201",
    complexes: "#x2102",
    congdot: "#x2A6D",
    conint: "#x222E",
    copf: "#x1D554",
    coprod: "#x2210",
    copysr: "#x2117",
    cross: "#x2717",
    cscr: "#x1D4B8",
    csub: "#x2ACF",
    csube: "#x2AD1",
    csup: "#x2AD0",
    csupe: "#x2AD2",
    ctdot: "#x22EF",
    cudarrl: "#x2938",
    cudarrr: "#x2935",
    cuepr: "#x22DE",
    cuesc: "#x22DF",
    cularr: "#x21B6",
    cularrp: "#x293D",
    cupbrcap: "#x2A48",
    cupcap: "#x2A46",
    cupcup: "#x2A4A",
    cupdot: "#x228D",
    cupor: "#x2A45",
    cups: "#x222A;&#xFE00",
    curarr: "#x21B7",
    curarrm: "#x293C",
    curlyeqprec: "#x22DE",
    curlyeqsucc: "#x22DF",
    curlyvee: "#x22CE",
    curlywedge: "#x22CF",
    curvearrowleft: "#x21B6",
    curvearrowright: "#x21B7",
    cuvee: "#x22CE",
    cuwed: "#x22CF",
    cwconint: "#x2232",
    cwint: "#x2231",
    cylcty: "#x232D",
    dHar: "#x2965",
    daleth: "#x2138",
    dash: "#x2010",
    dashv: "#x22A3",
    dbkarow: "#x290F",
    dblac: "#x2DD",
    dcaron: "#x10F",
    dcy: "#x434",
    dd: "#x2146",
    ddagger: "Dagger",
    ddarr: "#x21CA",
    ddotseq: "#x2A77",
    demptyv: "#x29B1",
    dfisht: "#x297F",
    dfr: "#x1D521",
    dharl: "#x21C3",
    dharr: "#x21C2",
    diam: "#x22C4",
    diamond: "#x22C4",
    diamondsuit: "diams",
    die: "#xA8",
    digamma: "#x3DD",
    disin: "#x22F2",
    div: "#xF7",
    divideontimes: "#x22C7",
    divonx: "#x22C7",
    djcy: "#x452",
    dlcorn: "#x231E",
    dlcrop: "#x230D",
    dopf: "#x1D555",
    dot: "#x2D9",
    doteq: "#x2250",
    doteqdot: "#x2251",
    dotminus: "#x2238",
    dotplus: "#x2214",
    dotsquare: "#x22A1",
    doublebarwedge: "#x2306",
    downarrow: "darr",
    downdownarrows: "#x21CA",
    downharpoonleft: "#x21C3",
    downharpoonright: "#x21C2",
    drbkarow: "#x2910",
    drcorn: "#x231F",
    drcrop: "#x230C",
    dscr: "#x1D4B9",
    dscy: "#x455",
    dsol: "#x29F6",
    dstrok: "#x111",
    dtdot: "#x22F1",
    dtri: "#x25BF",
    dtrif: "#x25BE",
    duarr: "#x21F5",
    duhar: "#x296F",
    dwangle: "#x29A6",
    dzcy: "#x45F",
    dzigrarr: "#x27FF",
    eDDot: "#x2A77",
    eDot: "#x2251",
    easter: "#x2A6E",
    ecaron: "#x11B",
    ecir: "#x2256",
    ecolon: "#x2255",
    ecy: "#x44D",
    edot: "#x117",
    ee: "#x2147",
    efDot: "#x2252",
    efr: "#x1D522",
    eg: "#x2A9A",
    egs: "#x2A96",
    egsdot: "#x2A98",
    el: "#x2A99",
    elinters: "#x23E7",
    ell: "#x2113",
    els: "#x2A95",
    elsdot: "#x2A97",
    emacr: "#x113",
    emptyset: "empty",
    emptyv: "empty",
    emsp13: "#x2004",
    emsp14: "#x2005",
    eng: "#x14B",
    eogon: "#x119",
    eopf: "#x1D556",
    epar: "#x22D5",
    eparsl: "#x29E3",
    eplus: "#x2A71",
    epsi: "#x3B5",
    epsiv: "#x3F5",
    eqcirc: "#x2256",
    eqcolon: "#x2255",
    eqsim: "#x2242",
    eqslantgtr: "#x2A96",
    eqslantless: "#x2A95",
    equest: "#x225F",
    equivDD: "#x2A78",
    eqvparsl: "#x29E5",
    erDot: "#x2253",
    erarr: "#x2971",
    escr: "#x212F",
    esdot: "#x2250",
    esim: "#x2242",
    expectation: "#x2130",
    exponentiale: "#x2147",
    fallingdotseq: "#x2252",
    fcy: "#x444",
    female: "#x2640",
    ffilig: "#xFB03",
    fflig: "#xFB00",
    ffllig: "#xFB04",
    ffr: "#x1D523",
    filig: "#xFB01",
    flat: "#x266D",
    fllig: "#xFB02",
    fltns: "#x25B1",
    fopf: "#x1D557",
    fork: "#x22D4",
    forkv: "#x2AD9",
    fpartint: "#x2A0D",
    frac13: "#x2153",
    frac15: "#x2155",
    frac16: "#x2159",
    frac18: "#x215B",
    frac23: "#x2154",
    frac25: "#x2156",
    frac35: "#x2157",
    frac38: "#x215C",
    frac45: "#x2158",
    frac56: "#x215A",
    frac58: "#x215D",
    frac78: "#x215E",
    frown: "#x2322",
    fscr: "#x1D4BB",
    gE: "#x2267",
    gEl: "#x2A8C",
    gacute: "#x1F5",
    gammad: "#x3DD",
    gap: "#x2A86",
    gbreve: "#x11F",
    gcirc: "#x11D",
    gcy: "#x433",
    gdot: "#x121",
    gel: "#x22DB",
    geq: "ge",
    geqq: "#x2267",
    geqslant: "#x2A7E",
    ges: "#x2A7E",
    gescc: "#x2AA9",
    gesdot: "#x2A80",
    gesdoto: "#x2A82",
    gesdotol: "#x2A84",
    gesl: "#x22DB;&#xFE00",
    gesles: "#x2A94",
    gfr: "#x1D524",
    gg: "#x226B",
    ggg: "#x22D9",
    gimel: "#x2137",
    gjcy: "#x453",
    gl: "#x2277",
    glE: "#x2A92",
    gla: "#x2AA5",
    glj: "#x2AA4",
    gnE: "#x2269",
    gnap: "#x2A8A",
    gnapprox: "#x2A8A",
    gne: "#x2A88",
    gneq: "#x2A88",
    gneqq: "#x2269",
    gnsim: "#x22E7",
    gopf: "#x1D558",
    grave: "#x60",
    gscr: "#x210A",
    gsim: "#x2273",
    gsime: "#x2A8E",
    gsiml: "#x2A90",
    gtcc: "#x2AA7",
    gtcir: "#x2A7A",
    gtdot: "#x22D7",
    gtlPar: "#x2995",
    gtquest: "#x2A7C",
    gtrapprox: "#x2A86",
    gtrarr: "#x2978",
    gtrdot: "#x22D7",
    gtreqless: "#x22DB",
    gtreqqless: "#x2A8C",
    gtrless: "#x2277",
    gtrsim: "#x2273",
    gvertneqq: "#x2269;&#xFE00",
    gvnE: "#x2269;&#xFE00",
    hairsp: "#x200A",
    half: "#xBD",
    hamilt: "#x210B",
    hardcy: "#x44A",
    harrcir: "#x2948",
    harrw: "#x21AD",
    hbar: "#x210F",
    hcirc: "#x125",
    heartsuit: "hearts",
    hercon: "#x22B9",
    hfr: "#x1D525",
    hksearow: "#x2925",
    hkswarow: "#x2926",
    hoarr: "#x21FF",
    homtht: "#x223B",
    hookleftarrow: "#x21A9",
    hookrightarrow: "#x21AA",
    hopf: "#x1D559",
    horbar: "#x2015",
    hscr: "#x1D4BD",
    hslash: "#x210F",
    hstrok: "#x127",
    hybull: "#x2043",
    hyphen: "#x2010",
    ic: "#x2063",
    icy: "#x438",
    iecy: "#x435",
    iff: "#x21D4",
    ifr: "#x1D526",
    ii: "#x2148",
    iiiint: "#x2A0C",
    iiint: "#x222D",
    iinfin: "#x29DC",
    iiota: "#x2129",
    ijlig: "#x133",
    imacr: "#x12B",
    imagline: "#x2110",
    imagpart: "#x2111",
    imath: "#x131",
    imof: "#x22B7",
    imped: "#x1B5",
    in: "#x2208",
    incare: "#x2105",
    infintie: "#x29DD",
    inodot: "#x131",
    intcal: "#x22BA",
    integers: "#x2124",
    intercal: "#x22BA",
    intlarhk: "#x2A17",
    intprod: "#x2A3C",
    iocy: "#x451",
    iogon: "#x12F",
    iopf: "#x1D55A",
    iprod: "#x2A3C",
    iscr: "#x1D4BE",
    isinE: "#x22F9",
    isindot: "#x22F5",
    isins: "#x22F4",
    isinsv: "#x22F3",
    isinv: "#x2208",
    it: "#x2062",
    itilde: "#x129",
    iukcy: "#x456",
    jcirc: "#x135",
    jcy: "#x439",
    jfr: "#x1D527",
    jmath: "#x237",
    jopf: "#x1D55B",
    jscr: "#x1D4BF",
    jsercy: "#x458",
    jukcy: "#x454",
    kappav: "#x3F0",
    kcedil: "#x137",
    kcy: "#x43A",
    kfr: "#x1D528",
    kgreen: "#x138",
    khcy: "#x445",
    kjcy: "#x45C",
    kopf: "#x1D55C",
    kscr: "#x1D4C0",
    lAarr: "#x21DA",
    lAtail: "#x291B",
    lBarr: "#x290E",
    lE: "#x2266",
    lEg: "#x2A8B",
    lHar: "#x2962",
    lacute: "#x13A",
    laemptyv: "#x29B4",
    lagran: "#x2112",
    langd: "#x2991",
    langle: "lang",
    lap: "#x2A85",
    larrb: "#x21E4",
    larrbfs: "#x291F",
    larrfs: "#x291D",
    larrhk: "#x21A9",
    larrlp: "#x21AB",
    larrpl: "#x2939",
    larrsim: "#x2973",
    larrtl: "#x21A2",
    lat: "#x2AAB",
    latail: "#x2919",
    late: "#x2AAD",
    lates: "#x2AAD;&#xFE00",
    lbarr: "#x290C",
    lbbrk: "#x2772",
    lbrace: "{",
    lbrack: "[",
    lbrke: "#x298B",
    lbrksld: "#x298F",
    lbrkslu: "#x298D",
    lcaron: "#x13E",
    lcedil: "#x13C",
    lcub: "{",
    lcy: "#x43B",
    ldca: "#x2936",
    ldquor: "bdquo",
    ldrdhar: "#x2967",
    ldrushar: "#x294B",
    ldsh: "#x21B2",
    leftarrow: "larr",
    leftarrowtail: "#x21A2",
    leftharpoondown: "#x21BD",
    leftharpoonup: "#x21BC",
    leftleftarrows: "#x21C7",
    leftrightarrow: "harr",
    leftrightarrows: "#x21C6",
    leftrightharpoons: "#x21CB",
    leftrightsquigarrow: "#x21AD",
    leftthreetimes: "#x22CB",
    leg: "#x22DA",
    leq: "le",
    leqq: "#x2266",
    leqslant: "#x2A7D",
    les: "#x2A7D",
    lescc: "#x2AA8",
    lesdot: "#x2A7F",
    lesdoto: "#x2A81",
    lesdotor: "#x2A83",
    lesg: "#x22DA;&#xFE00",
    lesges: "#x2A93",
    lessapprox: "#x2A85",
    lessdot: "#x22D6",
    lesseqgtr: "#x22DA",
    lesseqqgtr: "#x2A8B",
    lessgtr: "#x2276",
    lesssim: "#x2272",
    lfisht: "#x297C",
    lfr: "#x1D529",
    lg: "#x2276",
    lgE: "#x2A91",
    lhard: "#x21BD",
    lharu: "#x21BC",
    lharul: "#x296A",
    lhblk: "#x2584",
    ljcy: "#x459",
    ll: "#x226A",
    llarr: "#x21C7",
    llcorner: "#x231E",
    llhard: "#x296B",
    lltri: "#x25FA",
    lmidot: "#x140",
    lmoust: "#x23B0",
    lmoustache: "#x23B0",
    lnE: "#x2268",
    lnap: "#x2A89",
    lnapprox: "#x2A89",
    lne: "#x2A87",
    lneq: "#x2A87",
    lneqq: "#x2268",
    lnsim: "#x22E6",
    loang: "#x27EC",
    loarr: "#x21FD",
    lobrk: "#x27E6",
    longleftarrow: "#x27F5",
    longleftrightarrow: "#x27F7",
    longmapsto: "#x27FC",
    longrightarrow: "#x27F6",
    looparrowleft: "#x21AB",
    looparrowright: "#x21AC",
    lopar: "#x2985",
    lopf: "#x1D55D",
    loplus: "#x2A2D",
    lotimes: "#x2A34",
    lozenge: "loz",
    lozf: "#x29EB",
    lparlt: "#x2993",
    lrarr: "#x21C6",
    lrcorner: "#x231F",
    lrhar: "#x21CB",
    lrhard: "#x296D",
    lrtri: "#x22BF",
    lscr: "#x1D4C1",
    lsh: "#x21B0",
    lsim: "#x2272",
    lsime: "#x2A8D",
    lsimg: "#x2A8F",
    lsquor: "sbquo",
    lstrok: "#x142",
    ltcc: "#x2AA6",
    ltcir: "#x2A79",
    ltdot: "#x22D6",
    lthree: "#x22CB",
    ltimes: "#x22C9",
    ltlarr: "#x2976",
    ltquest: "#x2A7B",
    ltrPar: "#x2996",
    ltri: "#x25C3",
    ltrie: "#x22B4",
    ltrif: "#x25C2",
    lurdshar: "#x294A",
    luruhar: "#x2966",
    lvertneqq: "#x2268;&#xFE00",
    lvnE: "#x2268;&#xFE00",
    mDDot: "#x223A",
    male: "#x2642",
    malt: "#x2720",
    maltese: "#x2720",
    map: "#x21A6",
    mapsto: "#x21A6",
    mapstodown: "#x21A7",
    mapstoleft: "#x21A4",
    mapstoup: "#x21A5",
    marker: "#x25AE",
    mcomma: "#x2A29",
    mcy: "#x43C",
    measuredangle: "#x2221",
    mfr: "#x1D52A",
    mho: "#x2127",
    mid: "#x2223",
    midcir: "#x2AF0",
    minusb: "#x229F",
    minusd: "#x2238",
    minusdu: "#x2A2A",
    mlcp: "#x2ADB",
    mldr: "#x2026",
    mnplus: "#x2213",
    models: "#x22A7",
    mopf: "#x1D55E",
    mp: "#x2213",
    mscr: "#x1D4C2",
    mstpos: "#x223E",
    multimap: "#x22B8",
    mumap: "#x22B8",
    nGg: "#x22D9;&#x338",
    nGt: "#x226B;&#x20D2",
    nGtv: "#x226B;&#x338",
    nLeftarrow: "#x21CD",
    nLeftrightarrow: "#x21CE",
    nLl: "#x22D8;&#x338",
    nLt: "#x226A;&#x20D2",
    nLtv: "#x226A;&#x338",
    nRightarrow: "#x21CF",
    nVDash: "#x22AF",
    nVdash: "#x22AE",
    nacute: "#x144",
    nang: "#x2220;&#x20D2",
    nap: "#x2249",
    napE: "#x2A70;&#x338",
    napid: "#x224B;&#x338",
    napos: "#x149",
    napprox: "#x2249",
    natur: "#x266E",
    natural: "#x266E",
    naturals: "#x2115",
    nbump: "#x224E;&#x338",
    nbumpe: "#x224F;&#x338",
    ncap: "#x2A43",
    ncaron: "#x148",
    ncedil: "#x146",
    ncong: "#x2247",
    ncongdot: "#x2A6D;&#x338",
    ncup: "#x2A42",
    ncy: "#x43D",
    neArr: "#x21D7",
    nearhk: "#x2924",
    nearr: "#x2197",
    nearrow: "#x2197",
    nedot: "#x2250;&#x338",
    nequiv: "#x2262",
    nesear: "#x2928",
    nesim: "#x2242;&#x338",
    nexist: "#x2204",
    nexists: "#x2204",
    nfr: "#x1D52B",
    ngE: "#x2267;&#x338",
    nge: "#x2271",
    ngeq: "#x2271",
    ngeqq: "#x2267;&#x338",
    ngeqslant: "#x2A7E;&#x338",
    nges: "#x2A7E;&#x338",
    ngsim: "#x2275",
    ngt: "#x226F",
    ngtr: "#x226F",
    nhArr: "#x21CE",
    nharr: "#x21AE",
    nhpar: "#x2AF2",
    nis: "#x22FC",
    nisd: "#x22FA",
    niv: "ni",
    njcy: "#x45A",
    nlArr: "#x21CD",
    nlE: "#x2266;&#x338",
    nlarr: "#x219A",
    nldr: "#x2025",
    nle: "#x2270",
    nleftarrow: "#x219A",
    nleftrightarrow: "#x21AE",
    nleq: "#x2270",
    nleqq: "#x2266;&#x338",
    nleqslant: "#x2A7D;&#x338",
    nles: "#x2A7D;&#x338",
    nless: "#x226E",
    nlsim: "#x2274",
    nlt: "#x226E",
    nltri: "#x22EA",
    nltrie: "#x22EC",
    nmid: "#x2224",
    nopf: "#x1D55F",
    notinE: "#x22F9;&#x338",
    notindot: "#x22F5;&#x338",
    notinva: "notin",
    notinvb: "#x22F7",
    notinvc: "#x22F6",
    notni: "#x220C",
    notniva: "#x220C",
    notnivb: "#x22FE",
    notnivc: "#x22FD",
    npar: "#x2226",
    nparallel: "#x2226",
    nparsl: "#x2AFD;&#x20E5",
    npart: "#x2202;&#x338",
    npolint: "#x2A14",
    npr: "#x2280",
    nprcue: "#x22E0",
    npre: "#x2AAF;&#x338",
    nprec: "#x2280",
    npreceq: "#x2AAF;&#x338",
    nrArr: "#x21CF",
    nrarr: "#x219B",
    nrarrc: "#x2933;&#x338",
    nrarrw: "#x219D;&#x338",
    nrightarrow: "#x219B",
    nrtri: "#x22EB",
    nrtrie: "#x22ED",
    nsc: "#x2281",
    nsccue: "#x22E1",
    nsce: "#x2AB0;&#x338",
    nscr: "#x1D4C3",
    nshortmid: "#x2224",
    nshortparallel: "#x2226",
    nsim: "#x2241",
    nsime: "#x2244",
    nsimeq: "#x2244",
    nsmid: "#x2224",
    nspar: "#x2226",
    nsqsube: "#x22E2",
    nsqsupe: "#x22E3",
    nsubE: "#x2AC5;&#x338",
    nsube: "#x2288",
    nsubset: "#x2282;&#x20D2",
    nsubseteq: "#x2288",
    nsubseteqq: "#x2AC5;&#x338",
    nsucc: "#x2281",
    nsucceq: "#x2AB0;&#x338",
    nsup: "#x2285",
    nsupE: "#x2AC6;&#x338",
    nsupe: "#x2289",
    nsupset: "#x2283;&#x20D2",
    nsupseteq: "#x2289",
    nsupseteqq: "#x2AC6;&#x338",
    ntgl: "#x2279",
    ntlg: "#x2278",
    ntriangleleft: "#x22EA",
    ntrianglelefteq: "#x22EC",
    ntriangleright: "#x22EB",
    ntrianglerighteq: "#x22ED",
    numero: "#x2116",
    numsp: "#x2007",
    nvDash: "#x22AD",
    nvHarr: "#x2904",
    nvap: "#x224D;&#x20D2",
    nvdash: "#x22AC",
    nvge: "#x2265;&#x20D2",
    nvgt: "#x3E;&#x20D2",
    nvinfin: "#x29DE",
    nvlArr: "#x2902",
    nvle: "#x2264;&#x20D2",
    nvlt: "#x3C;&#x20D2",
    nvltrie: "#x22B4;&#x20D2",
    nvrArr: "#x2903",
    nvrtrie: "#x22B5;&#x20D2",
    nvsim: "#x223C;&#x20D2",
    nwArr: "#x21D6",
    nwarhk: "#x2923",
    nwarr: "#x2196",
    nwarrow: "#x2196",
    nwnear: "#x2927",
    oS: "#x24C8",
    oast: "#x229B",
    ocir: "#x229A",
    ocy: "#x43E",
    odash: "#x229D",
    odblac: "#x151",
    odiv: "#x2A38",
    odot: "#x2299",
    odsold: "#x29BC",
    ofcir: "#x29BF",
    ofr: "#x1D52C",
    ogon: "#x2DB",
    ogt: "#x29C1",
    ohbar: "#x29B5",
    ohm: "#x3A9",
    oint: "#x222E",
    olarr: "#x21BA",
    olcir: "#x29BE",
    olcross: "#x29BB",
    olt: "#x29C0",
    omacr: "#x14D",
    omid: "#x29B6",
    ominus: "#x2296",
    oopf: "#x1D560",
    opar: "#x29B7",
    operp: "#x29B9",
    orarr: "#x21BB",
    ord: "#x2A5D",
    order: "#x2134",
    orderof: "#x2134",
    origof: "#x22B6",
    oror: "#x2A56",
    orslope: "#x2A57",
    orv: "#x2A5B",
    oscr: "#x2134",
    osol: "#x2298",
    otimesas: "#x2A36",
    ovbar: "#x233D",
    par: "#x2225",
    parallel: "#x2225",
    parsim: "#x2AF3",
    parsl: "#x2AFD",
    pcy: "#x43F",
    pertenk: "#x2031",
    pfr: "#x1D52D",
    phiv: "#x3D5",
    phmmat: "#x2133",
    phone: "#x260E",
    pitchfork: "#x22D4",
    planck: "#x210F",
    planckh: "#x210E",
    plankv: "#x210F",
    plusacir: "#x2A23",
    plusb: "#x229E",
    pluscir: "#x2A22",
    plusdo: "#x2214",
    plusdu: "#x2A25",
    pluse: "#x2A72",
    plussim: "#x2A26",
    plustwo: "#x2A27",
    pm: "#xB1",
    pointint: "#x2A15",
    popf: "#x1D561",
    pr: "#x227A",
    prE: "#x2AB3",
    prap: "#x2AB7",
    prcue: "#x227C",
    pre: "#x2AAF",
    prec: "#x227A",
    precapprox: "#x2AB7",
    preccurlyeq: "#x227C",
    preceq: "#x2AAF",
    precnapprox: "#x2AB9",
    precneqq: "#x2AB5",
    precnsim: "#x22E8",
    precsim: "#x227E",
    primes: "#x2119",
    prnE: "#x2AB5",
    prnap: "#x2AB9",
    prnsim: "#x22E8",
    profalar: "#x232E",
    profline: "#x2312",
    profsurf: "#x2313",
    propto: "prop",
    prsim: "#x227E",
    prurel: "#x22B0",
    pscr: "#x1D4C5",
    puncsp: "#x2008",
    qfr: "#x1D52E",
    qint: "#x2A0C",
    qopf: "#x1D562",
    qprime: "#x2057",
    qscr: "#x1D4C6",
    quaternions: "#x210D",
    quatint: "#x2A16",
    questeq: "#x225F",
    rAarr: "#x21DB",
    rAtail: "#x291C",
    rBarr: "#x290F",
    rHar: "#x2964",
    race: "#x223D;&#x331",
    racute: "#x155",
    raemptyv: "#x29B3",
    rangd: "#x2992",
    range: "#x29A5",
    rangle: "rang",
    rarrap: "#x2975",
    rarrb: "#x21E5",
    rarrbfs: "#x2920",
    rarrc: "#x2933",
    rarrfs: "#x291E",
    rarrhk: "#x21AA",
    rarrlp: "#x21AC",
    rarrpl: "#x2945",
    rarrsim: "#x2974",
    rarrtl: "#x21A3",
    rarrw: "#x219D",
    ratail: "#x291A",
    ratio: "#x2236",
    rationals: "#x211A",
    rbarr: "#x290D",
    rbbrk: "#x2773",
    rbrke: "#x298C",
    rbrksld: "#x298E",
    rbrkslu: "#x2990",
    rcaron: "#x159",
    rcedil: "#x157",
    rcy: "#x440",
    rdca: "#x2937",
    rdldhar: "#x2969",
    rdquor: "rdquo",
    rdsh: "#x21B3",
    realine: "#x211B",
    realpart: "#x211C",
    reals: "#x211D",
    rect: "#x25AD",
    rfisht: "#x297D",
    rfr: "#x1D52F",
    rhard: "#x21C1",
    rharu: "#x21C0",
    rharul: "#x296C",
    rhov: "#x3F1",
    rightarrow: "rarr",
    rightarrowtail: "#x21A3",
    rightharpoondown: "#x21C1",
    rightharpoonup: "#x21C0",
    rightleftarrows: "#x21C4",
    rightleftharpoons: "#x21CC",
    rightrightarrows: "#x21C9",
    rightsquigarrow: "#x219D",
    rightthreetimes: "#x22CC",
    ring: "#x2DA",
    risingdotseq: "#x2253",
    rlarr: "#x21C4",
    rlhar: "#x21CC",
    rmoust: "#x23B1",
    rmoustache: "#x23B1",
    rnmid: "#x2AEE",
    roang: "#x27ED",
    roarr: "#x21FE",
    robrk: "#x27E7",
    ropar: "#x2986",
    ropf: "#x1D563",
    roplus: "#x2A2E",
    rotimes: "#x2A35",
    rpargt: "#x2994",
    rppolint: "#x2A12",
    rrarr: "#x21C9",
    rscr: "#x1D4C7",
    rsh: "#x21B1",
    rsquor: "rsquo",
    rthree: "#x22CC",
    rtimes: "#x22CA",
    rtri: "#x25B9",
    rtrie: "#x22B5",
    rtrif: "#x25B8",
    rtriltri: "#x29CE",
    ruluhar: "#x2968",
    rx: "#x211E",
    sacute: "#x15B",
    sc: "#x227B",
    scE: "#x2AB4",
    scap: "#x2AB8",
    sccue: "#x227D",
    sce: "#x2AB0",
    scedil: "#x15F",
    scirc: "#x15D",
    scnE: "#x2AB6",
    scnap: "#x2ABA",
    scnsim: "#x22E9",
    scpolint: "#x2A13",
    scsim: "#x227F",
    scy: "#x441",
    sdotb: "#x22A1",
    sdote: "#x2A66",
    seArr: "#x21D8",
    searhk: "#x2925",
    searr: "#x2198",
    searrow: "#x2198",
    seswar: "#x2929",
    setminus: "#x2216",
    setmn: "#x2216",
    sext: "#x2736",
    sfr: "#x1D530",
    sfrown: "#x2322",
    sharp: "#x266F",
    shchcy: "#x449",
    shcy: "#x448",
    shortmid: "#x2223",
    shortparallel: "#x2225",
    sigmav: "sigmaf",
    simdot: "#x2A6A",
    sime: "#x2243",
    simeq: "#x2243",
    simg: "#x2A9E",
    simgE: "#x2AA0",
    siml: "#x2A9D",
    simlE: "#x2A9F",
    simne: "#x2246",
    simplus: "#x2A24",
    simrarr: "#x2972",
    slarr: "larr",
    smallsetminus: "#x2216",
    smashp: "#x2A33",
    smeparsl: "#x29E4",
    smid: "#x2223",
    smile: "#x2323",
    smt: "#x2AAA",
    smte: "#x2AAC",
    smtes: "#x2AAC;&#xFE00",
    softcy: "#x44C",
    solb: "#x29C4",
    solbar: "#x233F",
    sopf: "#x1D564",
    spadesuit: "spades",
    spar: "#x2225",
    sqcap: "#x2293",
    sqcaps: "#x2293;&#xFE00",
    sqcup: "#x2294",
    sqcups: "#x2294;&#xFE00",
    sqsub: "#x228F",
    sqsube: "#x2291",
    sqsubset: "#x228F",
    sqsubseteq: "#x2291",
    sqsup: "#x2290",
    sqsupe: "#x2292",
    sqsupset: "#x2290",
    sqsupseteq: "#x2292",
    squ: "#x25A1",
    square: "#x25A1",
    squarf: "#x25AA",
    squf: "#x25AA",
    srarr: "rarr",
    sscr: "#x1D4C8",
    ssetmn: "#x2216",
    ssmile: "#x2323",
    sstarf: "#x22C6",
    star: "#x2606",
    starf: "#x2605",
    straightepsilon: "#x3F5",
    straightphi: "#x3D5",
    strns: "macr",
    subE: "#x2AC5",
    subdot: "#x2ABD",
    subedot: "#x2AC3",
    submult: "#x2AC1",
    subnE: "#x2ACB",
    subne: "#x228A",
    subplus: "#x2ABF",
    subrarr: "#x2979",
    subset: "sub",
    subseteq: "sube",
    subseteqq: "#x2AC5",
    subsetneq: "#x228A",
    subsetneqq: "#x2ACB",
    subsim: "#x2AC7",
    subsub: "#x2AD5",
    subsup: "#x2AD3",
    succ: "#x227B",
    succapprox: "#x2AB8",
    succcurlyeq: "#x227D",
    succeq: "#x2AB0",
    succnapprox: "#x2ABA",
    succneqq: "#x2AB6",
    succnsim: "#x22E9",
    succsim: "#x227F",
    sung: "#x266A",
    supE: "#x2AC6",
    supdot: "#x2ABE",
    supdsub: "#x2AD8",
    supedot: "#x2AC4",
    suphsol: "#x27C9",
    suphsub: "#x2AD7",
    suplarr: "#x297B",
    supmult: "#x2AC2",
    supnE: "#x2ACC",
    supne: "#x228B",
    supplus: "#x2AC0",
    supset: "sup",
    supseteq: "supe",
    supseteqq: "#x2AC6",
    supsetneq: "#x228B",
    supsetneqq: "#x2ACC",
    supsim: "#x2AC8",
    supsub: "#x2AD4",
    supsup: "#x2AD6",
    swArr: "#x21D9",
    swarhk: "#x2926",
    swarr: "#x2199",
    swarrow: "#x2199",
    swnwar: "#x292A",
    target: "#x2316",
    tbrk: "#x23B4",
    tcaron: "#x165",
    tcedil: "#x163",
    tcy: "#x442",
    tdot: "#x20DB",
    telrec: "#x2315",
    tfr: "#x1D531",
    therefore: "there4",
    thetav: "#x3D1",
    thickapprox: "#x2248",
    thicksim: "sim",
    thkap: "#x2248",
    thksim: "sim",
    timesb: "#x22A0",
    timesbar: "#x2A31",
    timesd: "#x2A30",
    tint: "#x222D",
    toea: "#x2928",
    top: "#x22A4",
    topbot: "#x2336",
    topcir: "#x2AF1",
    topf: "#x1D565",
    topfork: "#x2ADA",
    tosa: "#x2929",
    tprime: "#x2034",
    triangle: "#x25B5",
    triangledown: "#x25BF",
    triangleleft: "#x25C3",
    trianglelefteq: "#x22B4",
    triangleq: "#x225C",
    triangleright: "#x25B9",
    trianglerighteq: "#x22B5",
    tridot: "#x25EC",
    trie: "#x225C",
    triminus: "#x2A3A",
    triplus: "#x2A39",
    trisb: "#x29CD",
    tritime: "#x2A3B",
    trpezium: "#x23E2",
    tscr: "#x1D4C9",
    tscy: "#x446",
    tshcy: "#x45B",
    tstrok: "#x167",
    twixt: "#x226C",
    twoheadleftarrow: "#x219E",
    twoheadrightarrow: "#x21A0",
    uHar: "#x2963",
    ubrcy: "#x45E",
    ubreve: "#x16D",
    ucy: "#x443",
    udarr: "#x21C5",
    udblac: "#x171",
    udhar: "#x296E",
    ufisht: "#x297E",
    ufr: "#x1D532",
    uharl: "#x21BF",
    uharr: "#x21BE",
    uhblk: "#x2580",
    ulcorn: "#x231C",
    ulcorner: "#x231C",
    ulcrop: "#x230F",
    ultri: "#x25F8",
    umacr: "#x16B",
    uogon: "#x173",
    uopf: "#x1D566",
    uparrow: "uarr",
    updownarrow: "#x2195",
    upharpoonleft: "#x21BF",
    upharpoonright: "#x21BE",
    uplus: "#x228E",
    upsi: "#x3C5",
    upuparrows: "#x21C8",
    urcorn: "#x231D",
    urcorner: "#x231D",
    urcrop: "#x230E",
    uring: "#x16F",
    urtri: "#x25F9",
    uscr: "#x1D4CA",
    utdot: "#x22F0",
    utilde: "#x169",
    utri: "#x25B5",
    utrif: "#x25B4",
    uuarr: "#x21C8",
    uwangle: "#x29A7",
    vArr: "#x21D5",
    vBar: "#x2AE8",
    vBarv: "#x2AE9",
    vDash: "#x22A8",
    vangrt: "#x299C",
    varepsilon: "#x3F5",
    varkappa: "#x3F0",
    varnothing: "empty",
    varphi: "#x3D5",
    varpi: "piv",
    varpropto: "prop",
    varr: "#x2195",
    varrho: "#x3F1",
    varsigma: "sigmaf",
    varsubsetneq: "#x228A;&#xFE00",
    varsubsetneqq: "#x2ACB;&#xFE00",
    varsupsetneq: "#x228B;&#xFE00",
    varsupsetneqq: "#x2ACC;&#xFE00",
    vartheta: "#x3D1",
    vartriangleleft: "#x22B2",
    vartriangleright: "#x22B3",
    vcy: "#x432",
    vdash: "#x22A2",
    vee: "or",
    veebar: "#x22BB",
    veeeq: "#x225A",
    vellip: "#x22EE",
    vfr: "#x1D533",
    vltri: "#x22B2",
    vnsub: "#x2282;&#x20D2",
    vnsup: "#x2283;&#x20D2",
    vopf: "#x1D567",
    vprop: "prop",
    vrtri: "#x22B3",
    vscr: "#x1D4CB",
    vsubnE: "#x2ACB;&#xFE00",
    vsubne: "#x228A;&#xFE00",
    vsupnE: "#x2ACC;&#xFE00",
    vsupne: "#x228B;&#xFE00",
    vzigzag: "#x299A",
    wcirc: "#x175",
    wedbar: "#x2A5F",
    wedge: "and",
    wedgeq: "#x2259",
    wfr: "#x1D534",
    wopf: "#x1D568",
    wp: "#x2118",
    wr: "#x2240",
    wreath: "#x2240",
    wscr: "#x1D4CC",
    xcap: "#x22C2",
    xcirc: "#x25EF",
    xcup: "#x22C3",
    xdtri: "#x25BD",
    xfr: "#x1D535",
    xhArr: "#x27FA",
    xharr: "#x27F7",
    xlArr: "#x27F8",
    xlarr: "#x27F5",
    xmap: "#x27FC",
    xnis: "#x22FB",
    xodot: "#x2A00",
    xopf: "#x1D569",
    xoplus: "#x2A01",
    xotime: "#x2A02",
    xrArr: "#x27F9",
    xrarr: "#x27F6",
    xscr: "#x1D4CD",
    xsqcup: "#x2A06",
    xuplus: "#x2A04",
    xutri: "#x25B3",
    xvee: "#x22C1",
    xwedge: "#x22C0",
    yacy: "#x44F",
    ycirc: "#x177",
    ycy: "#x44B",
    yfr: "#x1D536",
    yicy: "#x457",
    yopf: "#x1D56A",
    yscr: "#x1D4CE",
    yucy: "#x44E",
    zacute: "#x17A",
    zcaron: "#x17E",
    zcy: "#x437",
    zdot: "#x17C",
    zeetrf: "#x2128",
    zfr: "#x1D537",
    zhcy: "#x436",
    zigrarr: "#x21DD",
    zopf: "#x1D56B",
    zscr: "#x1D4CF"
  };

  /**
   * string-range-expander
   * Expands string index ranges within whitespace boundaries until letters are met
   * Version: 1.11.6
   * Author: Roy Revelt, Codsen Ltd
   * License: MIT
   * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-range-expander
   */
  function expander(originalOpts) {
    var letterOrDigit = /^[0-9a-zA-Z]+$/;

    function isWhitespace(char) {
      if (!char || typeof char !== "string") {
        return false;
      }

      return !char.trim();
    }

    function isStr(something) {
      return typeof something === "string";
    }

    if (!originalOpts || _typeof(originalOpts) !== "object" || Array.isArray(originalOpts)) {
      var supplementalString;

      if (originalOpts === undefined) {
        supplementalString = "but it is missing completely.";
      } else if (originalOpts === null) {
        supplementalString = "but it was given as null.";
      } else {
        supplementalString = "but it was given as ".concat(_typeof(originalOpts), ", equal to:\n").concat(JSON.stringify(originalOpts, null, 4), ".");
      }

      throw new Error("string-range-expander: [THROW_ID_01] Input must be a plain object ".concat(supplementalString));
    } else if (_typeof(originalOpts) === "object" && originalOpts !== null && !Array.isArray(originalOpts) && !Object.keys(originalOpts).length) {
      throw new Error("string-range-expander: [THROW_ID_02] Input must be a plain object but it was given as a plain object without any keys.");
    }

    if (typeof originalOpts.from !== "number") {
      throw new Error("string-range-expander: [THROW_ID_03] The input's \"from\" value opts.from, is not a number! Currently it's given as ".concat(_typeof(originalOpts.from), ", equal to ").concat(JSON.stringify(originalOpts.from, null, 0)));
    }

    if (typeof originalOpts.to !== "number") {
      throw new Error("string-range-expander: [THROW_ID_04] The input's \"to\" value opts.to, is not a number! Currently it's given as ".concat(_typeof(originalOpts.to), ", equal to ").concat(JSON.stringify(originalOpts.to, null, 0)));
    }

    if (!originalOpts.str[originalOpts.from] && originalOpts.from !== originalOpts.to) {
      throw new Error("string-range-expander: [THROW_ID_05] The given input string opts.str (\"".concat(originalOpts.str, "\") must contain the character at index \"from\" (\"").concat(originalOpts.from, "\")"));
    }

    if (!originalOpts.str[originalOpts.to - 1]) {
      throw new Error("string-range-expander: [THROW_ID_06] The given input string, opts.str (\"".concat(originalOpts.str, "\") must contain the character at index before \"to\" (\"").concat(originalOpts.to - 1, "\")"));
    }

    if (originalOpts.from > originalOpts.to) {
      throw new Error("string-range-expander: [THROW_ID_07] The given \"from\" index, \"".concat(originalOpts.from, "\" is greater than \"to\" index, \"").concat(originalOpts.to, "\". That's wrong!"));
    }

    if (isStr(originalOpts.extendToOneSide) && originalOpts.extendToOneSide !== "left" && originalOpts.extendToOneSide !== "right" || !isStr(originalOpts.extendToOneSide) && originalOpts.extendToOneSide !== undefined && originalOpts.extendToOneSide !== false) {
      throw new Error("string-range-expander: [THROW_ID_08] The opts.extendToOneSide value is not recogniseable! It's set to: \"".concat(originalOpts.extendToOneSide, "\" (").concat(_typeof(originalOpts.extendToOneSide), "). It has to be either Boolean \"false\" or strings \"left\" or \"right\""));
    }

    var defaults = {
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

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

    if (Array.isArray(opts.ifLeftSideIncludesThisThenCropTightly)) {
      var culpritsIndex;
      var culpritsValue;

      if (opts.ifLeftSideIncludesThisThenCropTightly.every(function (val, i) {
        if (!isStr(val)) {
          culpritsIndex = i;
          culpritsValue = val;
          return false;
        }

        return true;
      })) {
        opts.ifLeftSideIncludesThisThenCropTightly = opts.ifLeftSideIncludesThisThenCropTightly.join("");
      } else {
        throw new Error("string-range-expander: [THROW_ID_09] The opts.ifLeftSideIncludesThisThenCropTightly was set to an array:\n".concat(JSON.stringify(opts.ifLeftSideIncludesThisThenCropTightly, null, 4), ". Now, that array contains not only string elements. For example, an element at index ").concat(culpritsIndex, " is of a type ").concat(_typeof(culpritsValue), " (equal to ").concat(JSON.stringify(culpritsValue, null, 0), ")."));
      }
    }

    var str = opts.str;
    var from = opts.from;
    var to = opts.to;

    if (opts.extendToOneSide !== "right" && (isWhitespace(str[from - 1]) && (isWhitespace(str[from - 2]) || opts.ifLeftSideIncludesThisCropItToo.includes(str[from - 2])) || str[from - 1] && opts.ifLeftSideIncludesThisCropItToo.includes(str[from - 1]) || opts.wipeAllWhitespaceOnLeft && isWhitespace(str[from - 1]))) {
      for (var i = from; i--;) {
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
      for (var _i = to, len = str.length; _i < len; _i++) {
        if (!opts.ifRightSideIncludesThisCropItToo.includes(str[_i]) && (str[_i] && str[_i].trim() || str[_i] === undefined)) {
          if (opts.wipeAllWhitespaceOnRight || opts.ifRightSideIncludesThisCropItToo.includes(str[_i - 1])) {
            to = _i;
          } else {
            to = _i - 1;
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

  function convertOne(str, _ref) {
    var from = _ref.from,
        to = _ref.to,
        value = _ref.value,
        _ref$convertEntities = _ref.convertEntities,
        convertEntities = _ref$convertEntities === void 0 ? true : _ref$convertEntities,
        _ref$convertApostroph = _ref.convertApostrophes,
        convertApostrophes = _ref$convertApostroph === void 0 ? true : _ref$convertApostroph,
        offsetBy = _ref.offsetBy;

    if (!Number.isInteger(to)) {
      if (Number.isInteger(from)) {
        to = from + 1;
      } else {
        throw new Error("string-apostrophes: [THROW_ID_01] options objects keys' \"to\" and \"from\" values are not integers!");
      }
    }

    var rangesArr = [];
    var leftSingleQuote = "\u2018";
    var rightSingleQuote = "\u2019";
    var leftDoubleQuote = "\u201C";
    var rightDoubleQuote = "\u201D";
    var singlePrime = "\u2032";
    var doublePrime = "\u2033";
    var punctuationChars = [".", ",", ";", "!", "?"];

    function isDigitStr(str2) {
      return typeof str2 === "string" && str2.charCodeAt(0) >= 48 && str2.charCodeAt(0) <= 57;
    }

    function isLetter(str2) {
      return typeof str2 === "string" && str2.length && str2.toUpperCase() !== str2.toLowerCase();
    }

    if (["'", leftSingleQuote, rightSingleQuote, singlePrime].includes(value) || to === from + 1 && ["'", leftSingleQuote, rightSingleQuote, singlePrime].includes(str[from])) {
      if (str[from - 1] && str[to] && isDigitStr(str[from - 1]) && !isLetter(str[to])) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&prime;" : singlePrime) && value !== (convertEntities ? "&prime;" : singlePrime)) {
          rangesArr.push([from, to, convertEntities ? "&prime;" : singlePrime]);
        } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
          rangesArr.push([from, to, "'"]);
        }
      } else if (str[to] && str[to + 1] && str[to] === "n" && str.slice(from, to) === str.slice(to + 1, to + 1 + (to - from))) {
        if (convertApostrophes && str.slice(from, to + 2) !== (convertEntities ? "&rsquo;n&rsquo;" : "".concat(rightSingleQuote, "n").concat(rightSingleQuote)) && value !== (convertEntities ? "&rsquo;n&rsquo;" : "".concat(rightSingleQuote, "n").concat(rightSingleQuote))) {
          rangesArr.push([from, to + 2, convertEntities ? "&rsquo;n&rsquo;" : "".concat(rightSingleQuote, "n").concat(rightSingleQuote)]);
          /* istanbul ignore next */

          if (typeof offsetBy === "function") {
            offsetBy(2);
          }
        } else if (!convertApostrophes && str.slice(from, to + 2) !== "'n'" && value !== "'n'") {
          rangesArr.push([from, to + 2, "'n'"]);
          /* istanbul ignore next */

          if (typeof offsetBy === "function") {
            offsetBy(2);
          }
        }
      } else if (str[to] && str[to].toLowerCase() === "t" && (!str[to + 1] || !str[to + 1].trim() || str[to + 1].toLowerCase() === "i") || str[to] && str[to + 2] && str[to].toLowerCase() === "t" && str[to + 1].toLowerCase() === "w" && (str[to + 2].toLowerCase() === "a" || str[to + 2].toLowerCase() === "e" || str[to + 2].toLowerCase() === "i" || str[to + 2].toLowerCase() === "o") || str[to] && str[to + 1] && str[to].toLowerCase() === "e" && str[to + 1].toLowerCase() === "m" || str[to] && str[to + 4] && str[to].toLowerCase() === "c" && str[to + 1].toLowerCase() === "a" && str[to + 2].toLowerCase() === "u" && str[to + 3].toLowerCase() === "s" && str[to + 4].toLowerCase() === "e" || str[to] && isDigitStr(str[to])) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rsquo;" : rightSingleQuote) && value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&rsquo;" : rightSingleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
          rangesArr.push([from, to, "'"]);
        }
      } else if (str[from - 1] && str[to] && punctuationChars.includes(str[from - 1])) {
        if (!str[to].trim()) {
          if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rsquo;" : rightSingleQuote) && value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
            rangesArr.push([from, to, convertEntities ? "&rsquo;" : rightSingleQuote]);
          } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
            rangesArr.push([from, to, "'"]);
          }
        } else if (str[to] === "\"" && str[to + 1] && !str[to + 1].trim()) {
          if (convertApostrophes && str.slice(from, to + 1) !== (convertEntities ? "&rsquo;&rdquo;" : "".concat(rightSingleQuote).concat(rightDoubleQuote)) && value !== (convertEntities ? "&rsquo;&rdquo;" : "".concat(rightSingleQuote).concat(rightDoubleQuote))) {
            rangesArr.push([from, to + 1, "".concat(convertEntities ? "&rsquo;&rdquo;" : "".concat(rightSingleQuote).concat(rightDoubleQuote))]);
            /* istanbul ignore next */

            if (typeof offsetBy === "function") {
              offsetBy(1);
            }
          } else if (!convertApostrophes && str.slice(from, to + 1) !== "'\"" && value !== "'\"") {
            rangesArr.push([from, to + 1, "'\""]);
            /* istanbul ignore next */

            if (typeof offsetBy === "function") {
              offsetBy(1);
            }
          }
        }
      } else if (from === 0 && str.slice(to).trim()) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&lsquo;" : leftSingleQuote) && value !== (convertEntities ? "&lsquo;" : leftSingleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&lsquo;" : leftSingleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
          rangesArr.push([from, to, "'"]);
        }
      } else if (!str[to] && str.slice(0, from).trim()) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rsquo;" : rightSingleQuote) && value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&rsquo;" : rightSingleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
          rangesArr.push([from, to, "'"]);
        }
      } else if (str[from - 1] && str[to] && (isLetter(str[from - 1]) || isDigitStr(str[from - 1])) && (isLetter(str[to]) || isDigitStr(str[to]))) {
        if (convertApostrophes) {
          if ((str[to] && str[from - 5] && str[from - 5].toLowerCase() === "h" && str[from - 4].toLowerCase() === "a" && str[from - 3].toLowerCase() === "w" && str[from - 2].toLowerCase() === "a" && str[from - 1].toLowerCase() === "i" && str[to].toLowerCase() === "i" || str[from - 1] && str[from - 1].toLowerCase() === "o" && str[to + 2] && str[to].toLowerCase() === "a" && str[to + 1].toLowerCase() === "h" && str[to + 2].toLowerCase() === "u") && str.slice(from, to) !== (convertEntities ? "&lsquo;" : leftSingleQuote) && value !== (convertEntities ? "&lsquo;" : leftSingleQuote)) {
            rangesArr.push([from, to, convertEntities ? "&lsquo;" : leftSingleQuote]);
          } else if (str.slice(from, to) !== (convertEntities ? "&rsquo;" : rightSingleQuote) && value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
            rangesArr.push([from, to, convertEntities ? "&rsquo;" : rightSingleQuote]);
          }
        } else if (str.slice(from, to) !== "'" && value !== "'") {
          rangesArr.push([from, to, "'"]);
        }
      } else if (str[to] && (isLetter(str[to]) || isDigitStr(str[to]))) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&lsquo;" : leftSingleQuote) && value !== (convertEntities ? "&lsquo;" : leftSingleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&lsquo;" : leftSingleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
          rangesArr.push([from, to, "'"]);
        }
      } else if (isLetter(str[from - 1]) || isDigitStr(str[from - 1])) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rsquo;" : rightSingleQuote) && value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&rsquo;" : rightSingleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
          rangesArr.push([from, to, "'"]);
        }
      } else if (str[from - 1] && !str[from - 1].trim()) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&lsquo;" : leftSingleQuote) && value !== (convertEntities ? "&lsquo;" : leftSingleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&lsquo;" : leftSingleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
          rangesArr.push([from, to, "'"]);
        }
      } else if (str[to] && !str[to].trim()) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rsquo;" : rightSingleQuote) && value !== (convertEntities ? "&rsquo;" : rightSingleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&rsquo;" : rightSingleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "'" && value !== "'") {
          rangesArr.push([from, to, "'"]);
        }
      }
    } else if (["\"", leftDoubleQuote, rightDoubleQuote, doublePrime].includes(value) || to === from + 1 && ["\"", leftDoubleQuote, rightDoubleQuote, doublePrime].includes(str[from])) {
      if (str[from - 1] && isDigitStr(str[from - 1]) && str[to] && str[to] !== "'" && str[to] !== '"' && str[to] !== rightSingleQuote && str[to] !== rightDoubleQuote && str[to] !== leftSingleQuote && str[to] !== leftDoubleQuote) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&Prime;" : doublePrime) && value !== (convertEntities ? "&Prime;" : doublePrime)) {
          rangesArr.push([from, to, convertEntities ? "&Prime;" : doublePrime]);
        } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
          rangesArr.push([from, to, "\""]);
        }
      } else if (str[from - 1] && str[to] && punctuationChars.includes(str[from - 1])) {
        if (!str[to].trim()) {
          if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rdquo;" : rightDoubleQuote) && value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)) {
            rangesArr.push([from, to, convertEntities ? "&rdquo;" : rightDoubleQuote]);
          } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
            rangesArr.push([from, to, "\""]);
          }
        } else if (str[to] === "'" && str[to + 1] && !str[to + 1].trim()) {
          if (convertApostrophes && str.slice(from, to + 1) !== (convertEntities ? "&rdquo;&rsquo;" : "".concat(rightDoubleQuote).concat(rightSingleQuote)) && value !== (convertEntities ? "&rdquo;&rsquo;" : "".concat(rightDoubleQuote).concat(rightSingleQuote))) {
            rangesArr.push([from, to + 1, convertEntities ? "&rdquo;&rsquo;" : "".concat(rightDoubleQuote).concat(rightSingleQuote)]);
            /* istanbul ignore next */

            if (typeof offsetBy === "function") {
              offsetBy(1);
            }
          } else if (!convertApostrophes && str.slice(from, to + 1) !== "\"'" && value !== "\"'") {
            rangesArr.push([from, to + 1, "\"'"]);
            /* istanbul ignore next */

            if (typeof offsetBy === "function") {
              offsetBy(1);
            }
          }
        }
      } else if (from === 0 && str[to] && str.slice(to).trim()) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&ldquo;" : leftDoubleQuote) && value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&ldquo;" : leftDoubleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
          rangesArr.push([from, to, "\""]);
        }
      } else if (!str[to] && str.slice(0, from).trim()) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rdquo;" : rightDoubleQuote) && value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&rdquo;" : rightDoubleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
          rangesArr.push([from, to, "\""]);
        }
      } else if (str[to] && (isLetter(str[to]) || isDigitStr(str[to]))) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&ldquo;" : leftDoubleQuote) && value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&ldquo;" : leftDoubleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
          rangesArr.push([from, to, "\""]);
        }
      } else if (str[from - 1] && (isLetter(str[from - 1]) || isDigitStr(str[from - 1]))) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rdquo;" : rightDoubleQuote) && value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&rdquo;" : rightDoubleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
          rangesArr.push([from, to, "\""]);
        }
      } else if (str[from - 1] && !str[from - 1].trim()) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&ldquo;" : leftDoubleQuote) && value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&ldquo;" : leftDoubleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
          rangesArr.push([from, to, "\""]);
        }
      } else if (str[to] && !str[to].trim()) {
        if (convertApostrophes && str.slice(from, to) !== (convertEntities ? "&rdquo;" : rightDoubleQuote) && value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)) {
          rangesArr.push([from, to, convertEntities ? "&rdquo;" : rightDoubleQuote]);
        } else if (!convertApostrophes && str.slice(from, to) !== "\"" && value !== "\"") {
          rangesArr.push([from, to, "\""]);
        }
      }
    }

    return rangesArr;
  }

  /* eslint no-unused-vars:0 */

  var defaultOpts$1 = {
    fixBrokenEntities: true,
    removeWidows: true,
    convertEntities: true,
    convertDashes: true,
    convertApostrophes: true,
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
    dontEncodeNonLatin: true,
    addMissingSpaces: true,
    convertDotsToEllipsis: true,
    stripHtml: true,
    eol: "lf",
    stripHtmlButIgnoreTags: ["b", "strong", "i", "em", "br", "sup"],
    stripHtmlAddNewLine: ["li", "/ul"],
    cb: null
  };
  var leftSingleQuote = "\u2018";
  var rightSingleQuote = "\u2019";
  var leftDoubleQuote = "\u201C";
  var rightDoubleQuote = "\u201D";
  var punctuationChars = [".", ",", ";", "!", "?"];
  var rawNDash = "\u2013";
  var rawMDash = "\u2014";
  var rawNbsp$1 = "\xA0";
  var rawEllipsis = "\u2026";
  var widowRegexTest = /. ./g;
  var latinAndNonNonLatinRanges = [[0, 880], [887, 890], [894, 900], [906, 908], [908, 910], [929, 931], [1319, 1329], [1366, 1369], [1375, 1377], [1415, 1417], [1418, 1423], [1423, 1425], [1479, 1488], [1514, 1520], [1524, 1536], [1540, 1542], [1563, 1566], [1805, 1807], [1866, 1869], [1969, 1984], [2042, 2048], [2093, 2096], [2110, 2112], [2139, 2142], [2142, 2208], [2208, 2210], [2220, 2276], [2302, 2304], [2423, 2425], [2431, 2433], [2435, 2437], [2444, 2447], [2448, 2451], [2472, 2474], [2480, 2482], [2482, 2486], [2489, 2492], [2500, 2503], [2504, 2507], [2510, 2519], [2519, 2524], [2525, 2527], [2531, 2534], [2555, 2561], [2563, 2565], [2570, 2575], [2576, 2579], [2600, 2602], [2608, 2610], [2611, 2613], [2614, 2616], [2617, 2620], [2620, 2622], [2626, 2631], [2632, 2635], [2637, 2641], [2641, 2649], [2652, 2654], [2654, 2662], [2677, 2689], [2691, 2693], [2701, 2703], [2705, 2707], [2728, 2730], [2736, 2738], [2739, 2741], [2745, 2748], [2757, 2759], [2761, 2763], [2765, 2768], [2768, 2784], [2787, 2790], [2801, 2817], [2819, 2821], [2828, 2831], [2832, 2835], [2856, 2858], [2864, 2866], [2867, 2869], [2873, 2876], [2884, 2887], [2888, 2891], [2893, 2902], [2903, 2908], [2909, 2911], [2915, 2918], [2935, 2946], [2947, 2949], [2954, 2958], [2960, 2962], [2965, 2969], [2970, 2972], [2972, 2974], [2975, 2979], [2980, 2984], [2986, 2990], [3001, 3006], [3010, 3014], [3016, 3018], [3021, 3024], [3024, 3031], [3031, 3046], [3066, 3073], [3075, 3077], [3084, 3086], [3088, 3090], [3112, 3114], [3123, 3125], [3129, 3133], [3140, 3142], [3144, 3146], [3149, 3157], [3158, 3160], [3161, 3168], [3171, 3174], [3183, 3192], [3199, 3202], [3203, 3205], [3212, 3214], [3216, 3218], [3240, 3242], [3251, 3253], [3257, 3260], [3268, 3270], [3272, 3274], [3277, 3285], [3286, 3294], [3294, 3296], [3299, 3302], [3311, 3313], [3314, 3330], [3331, 3333], [3340, 3342], [3344, 3346], [3386, 3389], [3396, 3398], [3400, 3402], [3406, 3415], [3415, 3424], [3427, 3430], [3445, 3449], [3455, 3458], [3459, 3461], [3478, 3482], [3505, 3507], [3515, 3517], [3517, 3520], [3526, 3530], [3530, 3535], [3540, 3542], [3542, 3544], [3551, 3570], [3572, 3585], [3642, 3647], [3675, 3713], [3714, 3716], [3716, 3719], [3720, 3722], [3722, 3725], [3725, 3732], [3735, 3737], [3743, 3745], [3747, 3749], [3749, 3751], [3751, 3754], [3755, 3757], [3769, 3771], [3773, 3776], [3780, 3782], [3782, 3784], [3789, 3792], [3801, 3804], [3807, 3840], [3911, 3913], [3948, 3953], [3991, 3993], [4028, 4030], [4044, 4046], [4058, 4096], [4293, 4295], [4295, 4301], [4301, 4304], [4680, 4682], [4685, 4688], [4694, 4696], [4696, 4698], [4701, 4704], [4744, 4746], [4749, 4752], [4784, 4786], [4789, 4792], [4798, 4800], [4800, 4802], [4805, 4808], [4822, 4824], [4880, 4882], [4885, 4888], [4954, 4957], [4988, 4992], [5017, 5024], [5108, 5120], [5788, 5792], [5872, 5888], [5900, 5902], [5908, 5920], [5942, 5952], [5971, 5984], [5996, 5998], [6000, 6002], [6003, 6016], [6109, 6112], [6121, 6128], [6137, 6144], [6158, 6160], [6169, 6176], [6263, 6272], [6314, 7936], [7957, 7960], [7965, 7968], [8005, 8008], [8013, 8016], [8023, 8025], [8025, 8027], [8027, 8029], [8029, 8031], [8061, 8064], [8116, 8118], [8132, 8134], [8147, 8150], [8155, 8157], [8175, 8178], [8180, 8182], [8190, 11904], [11929, 11931], [12019, 12032], [12245, 12288], [12351, 12353], [12438, 12441], [12543, 12549], [12589, 12593], [12686, 12688], [12730, 12736], [12771, 12784], [12830, 12832], [13054, 13056], [13312, 19893], [19893, 19904], [40869, 40908], [40908, 40960], [42124, 42128], [42182, 42192], [42539, 42560], [42647, 42655], [42743, 42752], [42894, 42896], [42899, 42912], [42922, 43000], [43051, 43056], [43065, 43072], [43127, 43136], [43204, 43214], [43225, 43232], [43259, 43264], [43347, 43359], [43388, 43392], [43469, 43471], [43481, 43486], [43487, 43520], [43574, 43584], [43597, 43600], [43609, 43612], [43643, 43648], [43714, 43739], [43766, 43777], [43782, 43785], [43790, 43793], [43798, 43808], [43814, 43816], [43822, 43968], [44013, 44016], [44025, 44032], [55203, 55216], [55238, 55243], [55291, 63744], [64109, 64112], [64217, 64256], [64262, 64275], [64279, 64285], [64310, 64312], [64316, 64318], [64318, 64320], [64321, 64323], [64324, 64326], [64449, 64467], [64831, 64848], [64911, 64914], [64967, 65008], [65021, 65136], [65140, 65142], [65276, 66560], [66717, 66720], [66729, 67584], [67589, 67592], [67592, 67594], [67637, 67639], [67640, 67644], [67644, 67647], [67669, 67671], [67679, 67840], [67867, 67871], [67897, 67903], [67903, 67968], [68023, 68030], [68031, 68096], [68099, 68101], [68102, 68108], [68115, 68117], [68119, 68121], [68147, 68152], [68154, 68159], [68167, 68176], [68184, 68192], [68223, 68352], [68405, 68409], [68437, 68440], [68466, 68472], [68479, 68608], [68680, 69216], [69246, 69632], [69709, 69714], [69743, 69760], [69825, 69840], [69864, 69872], [69881, 69888], [69940, 69942], [69955, 70016], [70088, 70096], [70105, 71296], [71351, 71360], [71369, 73728], [74606, 74752], [74850, 74864], [74867, 77824], [78894, 92160], [92728, 93952], [94020, 94032], [94078, 94095], [94111, 110592], [110593, 131072], [131072, 173782], [173782, 173824], [173824, 177972], [177972, 177984], [177984, 178205], [178205, 194560]]; // https://html.spec.whatwg.org/multipage/syntax.html#elements-2

  var voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]; // -----------------------------------------------------------------------------

  /**
   * doConvertEntities - converts entities, optionally, skipping all non-latin characters.
   *
   * CHECKS AND CONSUMES o.dontEncodeNonLatin !
   * @param  {string} inputString incoming string
   * @return {string}             result
   */

  function doConvertEntities(inputString, dontEncodeNonLatin) {
    if (dontEncodeNonLatin) {
      // console.log(
      //   `427 doConvertEntities() - inside if (dontEncodeNonLatin) clauses`
      // );
      // split, check, encode conditionally
      return Array.from(inputString).map(function (char) {
        // Separately check lower character indexes because statistically they are
        // most likely to be encountered. That's letters, quotes brackets and so on.
        // console.log(
        //   `435 doConvertEntities() - char = "${char}"; ${`\u001b[${33}m${`char.charCodeAt(0)`}\u001b[${39}m`} = ${JSON.stringify(
        //     char.charCodeAt(0),
        //     null,
        //     4
        //   )}`
        // );
        if (char.charCodeAt(0) < 880 || latinAndNonNonLatinRanges.some(function (rangeArr) {
          return char.charCodeAt(0) > rangeArr[0] && char.charCodeAt(0) < rangeArr[1];
        })) {
          // console.log(
          //   `450 doConvertEntities() - encoding to "${he.encode(char, {
          //     useNamedReferences: true,
          //   })}"`
          // );
          return he.encode(char, {
            useNamedReferences: true
          });
        }

        return char;
      }).join("");
    } // console.log(`462 doConvertEntities() - outside if (dontEncodeNonLatin)`);
    // else, if dontEncodeNonLatin if off, just encode everything:


    return he.encode(inputString, {
      useNamedReferences: true
    });
  } // -----------------------------------------------------------------------------


  function isNumber$1(something) {
    return typeof something === "string" && something.charCodeAt(0) >= 48 && something.charCodeAt(0) <= 57 || Number.isInteger(something);
  }

  function isLetter(str) {
    return typeof str === "string" && str.length === 1 && str.toUpperCase() !== str.toLowerCase();
  }

  function isQuote(str) {
    return str === '"' || str === "'" || str === leftSingleQuote || str === rightSingleQuote || str === leftDoubleQuote || str === rightDoubleQuote;
  }

  function isLowercaseLetter(str) {
    if (!isLetter(str)) {
      return false;
    }

    return str === str.toLowerCase() && str !== str.toUpperCase();
  }

  function isUppercaseLetter(str) {
    if (!isLetter(str)) {
      return false;
    }

    return str === str.toUpperCase() && str !== str.toLowerCase();
  }

  // It is used by processOutside() which skips already processed ranges and
  // iterates over the remaining indexes. Also, it is used to validate the
  // encode entities - those are decoded and ran through this function as well.
  // That's why we need this fancy "y" - "up to" index and we can't make it
  // using simple "i + 1" - the "character" might be actually an encoded
  // chunk of characters. We separate the location of character(s)
  // (which could be expressed as string.slice(i, y)) and the value it
  // represents ("charcode").

  function processCharacter(str, opts, rangesArr, i, y, offsetBy, brClosingBracketIndexesArr, state, applicableOpts, endOfLine) {
    var len = str.length;

    if (/[\uD800-\uDFFF]/g.test(str[i]) && !(str.charCodeAt(i + 1) >= 0xdc00 && str.charCodeAt(i + 1) <= 0xdfff || str.charCodeAt(i - 1) >= 0xd800 && str.charCodeAt(i - 1) <= 0xdbff)) {
      // if it's a surrogate and another surrogate doesn't come in front or
      // follow, it's considered to be stray and liable for removal
      rangesArr.push(i, i + 1);
    } else if (y - i > 1) {
      applicableOpts.convertEntities = true;
      applicableOpts.dontEncodeNonLatin = applicableOpts.dontEncodeNonLatin || doConvertEntities(str.slice(i, y), true) !== doConvertEntities(str.slice(i, y), false); // if it's astral character which comprises of more than one character,
      // tackle it separately from "normal" charactrs of length === 1

      if (opts.convertEntities) {
        rangesArr.push(i, y, doConvertEntities(str.slice(i, y), opts.dontEncodeNonLatin));
      }
    } else {
      //
      //
      //
      //
      //
      //
      //
      // so it's single character.
      var charcode = str[i].charCodeAt(0); // Filter ASCII
      // the cutoff point is 127 not 128 because large chunk of invisibles, C1
      // group starts at DEL, decimal point 128.

      if (charcode < 127) {
        // within ASCII - no need to encode, just clean
        if (charcode < 32) {
          if (charcode < 9) {
            if (charcode === 3) {
              // that's \u0003, END OF TEXT - replace with line break
              rangesArr.push(i, y, opts.removeLineBreaks ? " " : opts.replaceLineBreaks ? "<br".concat(opts.useXHTML ? "/" : "", ">\n") : "\n");
              applicableOpts.removeLineBreaks = true;

              if (!opts.removeLineBreaks) {
                applicableOpts.replaceLineBreaks = true;

                if (opts.replaceLineBreaks) {
                  applicableOpts.useXHTML = true;
                }
              }
            } else {
              // charcodes: [0;2], [4;8] - remove these control chars
              rangesArr.push(i, y);
            } // continue to the next character (otherwise it would get encoded):
            // continue;

          } else if (charcode === 9) {
            // Replace all tabs, '\u0009', with spaces:
            rangesArr.push(i, y, " "); // continue to the next character (otherwise it would get encoded):
            // continue;
          } else if (charcode === 10) {
            // 10 - "\u000A" - line feed, LF or \n
            if (!applicableOpts.removeLineBreaks) {
              applicableOpts.removeLineBreaks = true;
            }

            if (!opts.removeLineBreaks && (!brClosingBracketIndexesArr || Array.isArray(brClosingBracketIndexesArr) && !brClosingBracketIndexesArr.some(function (idx) {
              return left(str, i) === idx;
            }))) {
              if (opts.replaceLineBreaks) {
                applicableOpts.useXHTML = true;
                applicableOpts.replaceLineBreaks = true;
              } else if (!opts.replaceLineBreaks) {
                // opts.replaceLineBreaks === false
                applicableOpts.replaceLineBreaks = true;
              }
            }

            if (!opts.removeLineBreaks) {
              applicableOpts.eol = true;
            } // won't run on CRLF, only on LF - the CR will be processed separately


            if (opts.removeLineBreaks) {
              // only remove replace with space if it's standalone, Mac-style
              // EOL ending, not Windows CRLF, because CR would have already
              // been replaced and replacing here would result in two spaces added
              var whatToInsert = " ";

              if (punctuationChars.includes(str[right(str, i)])) {
                whatToInsert = "";
              }

              rangesArr.push(i, y, whatToInsert);
            } else if (opts.replaceLineBreaks && (!brClosingBracketIndexesArr || Array.isArray(brClosingBracketIndexesArr) && !brClosingBracketIndexesArr.some(function (idx) {
              return left(str, i) === idx;
            }))) {
              // above, we check, is there a closing bracket of <br>.
              // All this contraption is necessary because br's can have HTML
              // attributes - you can't just match <br> or <br/> or <br />,
              // there can be ESP tags in non-HTML
              var startingIdx = i;

              if (str[i - 1] === " ") {
                startingIdx = leftStopAtNewLines(str, i) + 1;
              }

              rangesArr.push(startingIdx, i + (endOfLine === "\r" ? 1 : 0), "<br".concat(opts.useXHTML ? "/" : "", ">").concat(endOfLine === "\r\n" ? "\r" : "").concat(endOfLine === "\r" ? "\r" : ""));
            } else {
              //
              //
              // delete any whitespace to the left
              if (str[leftStopAtNewLines(str, i)].trim().length) {
                // delete trailing whitespace at the end of each line
                var tempIdx = leftStopAtNewLines(str, i);

                if (tempIdx < i - 1) {
                  rangesArr.push(tempIdx + 1, i, "".concat(endOfLine === "\r\n" ? "\r" : ""));
                }
              }

              if (endOfLine === "\r\n" && str[i - 1] !== "\r") {
                rangesArr.push(i, i, "\r");
              } else if (endOfLine === "\r") {
                rangesArr.push(i, i + 1);
              } // either way, delete any whitespace to the right


              if (str[rightStopAtNewLines(str, i)].trim().length) {
                var _tempIdx = rightStopAtNewLines(str, i);

                if (_tempIdx > i + 1) {
                  rangesArr.push(i + 1, _tempIdx);
                }
              }
            } //
            // URL detection:
            //
            // TODO - check state.onUrlCurrently


            state.onUrlCurrently = false;
          } else if (charcode === 11 || charcode === 12) {
            // 11 - "\u000B" - tab
            // 12 - "\u000C" - form feed
            applicableOpts.removeLineBreaks = true;
            rangesArr.push(i, y, opts.removeLineBreaks ? " " : "\n"); // continue;
          } else if (charcode === 13) {
            // 13 - "\u000D" - carriage return
            if (!applicableOpts.removeLineBreaks) {
              applicableOpts.removeLineBreaks = true;
            }

            if (!opts.removeLineBreaks && (!brClosingBracketIndexesArr || Array.isArray(brClosingBracketIndexesArr) && !brClosingBracketIndexesArr.some(function (idx) {
              return left(str, i) === idx;
            }))) {
              if (opts.replaceLineBreaks && !opts.removeLineBreaks) {
                applicableOpts.useXHTML = true;
                applicableOpts.replaceLineBreaks = true;
              } else if (!opts.replaceLineBreaks) {
                // opts.replaceLineBreaks === false
                applicableOpts.replaceLineBreaks = true;
              }
            }

            if (!opts.removeLineBreaks) {
              applicableOpts.eol = true;
            }

            if (opts.removeLineBreaks) {
              var _whatToInsert = " ";

              if (punctuationChars.includes(str[right(str, i)]) || ["\n", "\r"].includes(str[i + 1])) {
                _whatToInsert = "";
              }

              rangesArr.push(i, y, _whatToInsert);
            } else if (opts.replaceLineBreaks && (!brClosingBracketIndexesArr || Array.isArray(brClosingBracketIndexesArr) && !brClosingBracketIndexesArr.some(function (idx) {
              return left(str, i) === idx;
            }))) {
              var _startingIdx = i;

              if (str[i - 1] === " ") {
                _startingIdx = leftStopAtNewLines(str, i) + 1;
              }

              var endingIdx = i;
              var _whatToInsert2 = "";

              if (str[i + 1] !== "\n") {
                if (endOfLine === "\n") {
                  _whatToInsert2 = "\n";
                } else if (endOfLine === "\r\n") {
                  // add missing LF after current CR
                  rangesArr.push(i + 1, i + 1, "\n");
                }
              }

              if (endOfLine === "\n") {
                // extend this range to also delete this CR
                endingIdx = i + 1;
              } else if (endOfLine === "\r" && str[i + 1] === "\n") {
                // delete that LF from wrong CRLF set which is present
                rangesArr.push(i + 1, i + 2);
              }

              rangesArr.push(_startingIdx, endingIdx, "<br".concat(opts.useXHTML ? "/" : "", ">").concat(_whatToInsert2)); // skip the \n that follows

              if (str[i + 1] === "\n") {
                offsetBy(1);
              }
            } else {
              if (endOfLine === "\n") {
                rangesArr.push(i, i + 1, str[i + 1] === "\n" ? "" : "\n");
              } else if (endOfLine === "\r" && str[i + 1] === "\n") {
                // delete the LF that follows
                rangesArr.push(i + 1, i + 2);
              } else if (endOfLine === "\r\n" && str[i + 1] !== "\n") {
                // add LF afterwards
                rangesArr.push(i, i + 1, "\n");
              } // delete whitespace at the beginning and at the end of each line


              if (str[leftStopAtNewLines(str, i)].trim().length) {
                // delete trailing whitespace at the end of each line
                var _endingIdx = i;

                if (endOfLine === "\n") {
                  // extend this range to also delete this CR
                  _endingIdx = i + 1;
                }

                var _tempIdx2 = leftStopAtNewLines(str, i);

                if (_tempIdx2 < i - 1) {
                  rangesArr.push(_tempIdx2 + 1, _endingIdx, "".concat(str[i + 1] === "\n" ? "" : "\n"));
                }
              } // delete whitespace in front of each line


              if (str[rightStopAtNewLines(str, i)].trim().length && str[i + 1] !== "\n") {
                var _tempIdx3 = rightStopAtNewLines(str, i);

                if (_tempIdx3 > i + 1) {
                  rangesArr.push(i + 1, _tempIdx3);
                }
              }
            }
          } else if (charcode > 13) {
            // charcodes: [14;31] - remove these control chars
            rangesArr.push(i, y); // continue;
          }
        } else {
          // 32 <= charcode < 127
          // NO ENCODING HERE, JUST FIXES
          if (charcode === 32) ; else if (charcode === 34) {
            // IF DOUBLE QUOTE
            applicableOpts.convertEntities = true;

            if (isNumber$1(left(str, i)) || isNumber$1(right(str, i))) {
              applicableOpts.convertApostrophes = true;
            }

            var tempRes = convertOne(str, {
              from: i,
              convertEntities: opts.convertEntities,
              convertApostrophes: opts.convertApostrophes,
              offsetBy: offsetBy
            });

            if (tempRes && tempRes.length) {
              rangesArr.push(tempRes);
            } else if (opts.convertEntities) {
              rangesArr.push(i, i + 1, "&quot;");
            }
          } else if (charcode === 38) {
            // IF AMPERSAND, the &
            if (isLetter(str[i + 1])) {
              // it can be a named entity
              var temp = Object.keys(allNamedEntities).find(function (entName) {
                return str.startsWith(entName, i + 1) && str[i + entName.length + 1] === ";";
              });
              applicableOpts.convertEntities = true;

              if (temp) {
                if (temp === "apos") {
                  applicableOpts.convertApostrophes = true;
                  var decodedTempRes = convertOne(str, {
                    from: i,
                    to: i + temp.length + 2,
                    value: "'",
                    convertEntities: opts.convertEntities,
                    convertApostrophes: opts.convertApostrophes,
                    offsetBy: offsetBy
                  });

                  if (Array.isArray(decodedTempRes) && decodedTempRes.length) {
                    rangesArr.push(decodedTempRes);
                    offsetBy(temp.length + 2);
                  } else {
                    rangesArr.push([i, i + temp.length + 2, "'"]);
                    offsetBy(temp.length + 2);
                  }
                } else if (opts.convertEntities && Object.keys(notEmailFriendly).includes(str.slice(i + 1, i + temp.length + 1))) {
                  rangesArr.push(i, i + temp.length + 2, "&".concat(notEmailFriendly[str.slice(i + 1, i + temp.length + 1)], ";"));
                  offsetBy(temp.length + 1);
                } else if (!opts.convertEntities) {
                  rangesArr.push(i, i + temp.length + 2, he.decode("".concat(str.slice(i, i + temp.length + 2))));
                  offsetBy(temp.length + 1);
                } else {
                  // if opts.convertEntities
                  // just skip
                  offsetBy(temp.length + 1);
                }
              } else if (opts.convertEntities) {
                // no named entities matched, so encode the ampersand
                rangesArr.push(i, i + 1, "&amp;");
              }
            } else if (str[right(str, i)] === "#") {
              // it can be a numeric, a decimal or a hex entity
              for (var z = right(str, i); z < len; z++) {
                if (str[z].trim().length && !isNumber$1(str[z]) && str[z] !== "#") {
                  if (str[z] === ";") {
                    // it's numeric entity
                    var _tempRes = he.encode(he.decode(str.slice(i, z + 1)), {
                      useNamedReferences: true
                    });

                    if (_tempRes) {
                      rangesArr.push(i, z + 1, _tempRes);
                    }

                    offsetBy(z + 1 - i);
                  }
                }
              }
            } else {
              applicableOpts.convertEntities = true;

              if (opts.convertEntities) {
                // encode it
                rangesArr.push(i, i + 1, "&amp;");
              }
            }
          } else if (charcode === 39) {
            // IF SINGLE QUOTE OR APOSTROPHE, the '
            // first, calculate theoretical maximum setting and set applicable rules
            // based on it
            var _temp = convertOne(str, {
              from: i,
              convertEntities: true,
              convertApostrophes: true
            });

            if (_temp.length) {
              applicableOpts.convertApostrophes = true;

              if (opts.convertApostrophes) {
                applicableOpts.convertEntities = true;
              }

              rangesArr.push(convertOne(str, {
                from: i,
                convertEntities: opts.convertEntities,
                convertApostrophes: opts.convertApostrophes,
                offsetBy: offsetBy
              }));
            }
          } else if (charcode === 44 || charcode === 59) {
            // IF COMMA (,) OR SEMICOLON (;)
            // 1. check for whitespace leading to colon or semicolon
            if (str[i - 1] && !str[i - 1].trim().length) {
              var whatsOnTheLeft = left(str, i);

              if (whatsOnTheLeft < i - 1) {
                rangesArr.push(whatsOnTheLeft + 1, i);
              }
            } // 2. comma-specific


            if (charcode === 44 && str[y] !== undefined && !state.onUrlCurrently && !isNumber$1(str[y]) && str[y].trim().length && str[y] !== " " && str[y] !== "\n" && str[y] !== '"' && str[y] !== "'" && str[y] !== leftSingleQuote && str[y] !== leftDoubleQuote && str[y] !== rightSingleQuote && str[y] !== rightDoubleQuote) {
              // comma, not on URL, not followed by number = add space afterwards
              applicableOpts.addMissingSpaces = true;

              if (opts.addMissingSpaces) {
                rangesArr.push(y, y, " ");
              }
            } // 3. semicolon-specific


            if (charcode === 59 && str[y] !== undefined && !state.onUrlCurrently && str[y].trim().length && str[y] !== "&" && str[y] !== '"' && str[y] !== "'" && str[y] !== leftSingleQuote && str[y] !== leftDoubleQuote && str[y] !== rightSingleQuote && str[y] !== rightDoubleQuote) {
              applicableOpts.addMissingSpaces = true;

              if (opts.addMissingSpaces) {
                rangesArr.push(y, y, " ");
              }
            }
          } else if (charcode === 45) {
            // IF MINUS SIGN / HYPHEN
            // don't mess up if minus is between two numbers
            if (str[i - 1] === " " && str[y] === " " && isNumber$1(str[left(str, i)]) && isNumber$1(str[right(str, y)])) ; // add space after minus/dash character if there's nbsp or space in front of it,
            // but the next character is not currency or digit.
            // That's to prevent the space addition in front of legit minuses.
            else if ((str[i - 1] === rawNbsp$1 || str[i - 1] === " ") && str[y] !== "$" && str[y] !== "£" && str[y] !== "€" && str[y] !== "₽" && str[y] !== "0" && str[y] !== "1" && str[y] !== "2" && str[y] !== "3" && str[y] !== "4" && str[y] !== "5" && str[y] !== "6" && str[y] !== "7" && str[y] !== "8" && str[y] !== "9" && str[y] !== "-" && str[y] !== ">" && str[y] !== " ") {
                applicableOpts.addMissingSpaces = true;

                if (opts.addMissingSpaces) {
                  // add space after it:
                  rangesArr.push(y, y, " ");
                }
              } else if (str[i - 1] && str[y] && (isNumber$1(str[i - 1]) && isNumber$1(str[y]) || str[i - 1].toLowerCase() === "a" && str[y].toLowerCase() === "z")) {
                applicableOpts.convertDashes = true;

                if (opts.convertDashes) {
                  applicableOpts.convertEntities = true;
                  rangesArr.push(i, y, opts.convertEntities ? "&ndash;" : "\u2013");
                }
              } else if (str[i - 1] && str[y] && (str[i - 1].trim().length === 0 && str[y].trim().length === 0 || isLowercaseLetter(str[i - 1]) && str[y] === "'")) {
                applicableOpts.convertDashes = true;

                if (opts.convertDashes) {
                  applicableOpts.convertEntities = true;
                  rangesArr.push(i, y, opts.convertEntities ? "&mdash;" : rawMDash);
                }
              } else if (str[i - 1] && str[y] && isLetter(str[i - 1]) && isQuote(str[y])) {
                applicableOpts.convertDashes = true;

                if (opts.convertDashes) {
                  applicableOpts.convertEntities = true; // direct speech breaks off

                  rangesArr.push(i, y, opts.convertEntities ? "&mdash;" : rawMDash);
                }
              } // tackle widow word setting - space in front when opts.removeWidows is on


            if (str[i - 2] && str[i - 2].trim().length && !str[i - 1].trim().length && !["\n", "\r"].includes(str[i - 1])) {
              // 1. mark option as applicable
              applicableOpts.removeWidows = true; // 2. if option is on, apply it

              if (opts.removeWidows) {
                applicableOpts.convertEntities = true;
                rangesArr.push(i - 1, i, opts.convertEntities ? "&nbsp;" : rawNbsp$1);
              }
            }
          } else if (charcode === 46) {
            // IF DOT CHARACTER
            //
            // 1. convert first of three and only three dots to ellipsis, encode
            // if needed
            // TODO - improve matching to account for possible spaces between dots
            if (str[i - 1] !== "." && str[y] === "." && str[y + 1] === "." && str[y + 2] !== ".") {
              applicableOpts.convertDotsToEllipsis = true;

              if (opts.convertDotsToEllipsis) {
                applicableOpts.convertEntities = true;
                rangesArr.push(i, y + 2, opts.convertEntities ? "&hellip;" : "".concat(rawEllipsis));
              }
            } // 2. add missing space after full stop or comma except on extensions and URL's


            var first = str[y] ? str[y].toLowerCase() : "";
            var second = str[y + 1] ? str[y + 1].toLowerCase() : "";
            var third = str[y + 2] ? str[y + 2].toLowerCase() : "";
            var fourth = str[y + 3] ? str[y + 3].toLowerCase() : "";
            var nextThreeChars = first + second + third;

            if (first + second !== "js" && nextThreeChars !== "jpg" && nextThreeChars !== "png" && nextThreeChars !== "gif" && nextThreeChars !== "svg" && nextThreeChars !== "htm" && nextThreeChars !== "pdf" && nextThreeChars !== "psd" && nextThreeChars !== "tar" && nextThreeChars !== "zip" && nextThreeChars !== "rar" && nextThreeChars !== "otf" && nextThreeChars !== "ttf" && nextThreeChars !== "eot" && nextThreeChars !== "php" && nextThreeChars !== "rss" && nextThreeChars !== "asp" && nextThreeChars !== "ppt" && nextThreeChars !== "doc" && nextThreeChars !== "txt" && nextThreeChars !== "rtf" && nextThreeChars !== "git" && nextThreeChars + fourth !== "jpeg" && nextThreeChars + fourth !== "html" && nextThreeChars + fourth !== "woff" && !(!isLetter(str[i - 2]) && str[i - 1] === "p" && str[y] === "s" && str[y + 1] === "t" && !isLetter(str[y + 2]))) {
              // two tasks: deleting any spaces before and adding spaces after
              //
              // 2-1. ADDING A MISSING SPACE AFTER IT:
              if (str[y] !== undefined && ( // - When it's not within a URL, the requirement for next letter to be uppercase letter.
              //   This prevents both numbers with decimal digits and short url's like "detergent.io"
              // - When it's within URL, it's stricter:
              //   next letter has to be an uppercase letter, followed by lowercase letter.
              !state.onUrlCurrently && isUppercaseLetter(str[y]) || state.onUrlCurrently && isLetter(str[y]) && isUppercaseLetter(str[y]) && isLetter(str[y + 1]) && isLowercaseLetter(str[y + 1])) && str[y] !== " " && str[y] !== "." && str[y] !== "\n") {
                applicableOpts.addMissingSpaces = true;

                if (opts.addMissingSpaces) {
                  rangesArr.push(y, y, " ");
                }
              } // 2-2. REMOVING SPACES BEFORE IT:


              if (str[i - 1] !== undefined && str[i - 1].trim() === "" && str[y] !== "." && (str[i - 2] === undefined || str[i - 2] !== ".") // that's for cases: "aaa. . " < observe second dot.
              ) {
                  // march backwards
                  for (y = i - 1; y--;) {
                    if (str[y].trim() !== "") {
                      rangesArr.push(y + 1, i);
                      break;
                    }
                  }
                }
            }
          } else if (charcode === 47) ; else if (charcode === 58) {
            // IF COLON (:)
            //
            // URL detection
            //
            if (str[y - 1] && str[right(str, y - 1)] === "/" && str[right(str, right(str, y - 1))] === "/") {
              state.onUrlCurrently = true;
            }
          } else if (charcode === 60) {
            // IF LESS THAN SIGN, <
            applicableOpts.convertEntities = true;

            if (opts.convertEntities) {
              rangesArr.push(i, i + 1, "&lt;");
            }
          } else if (charcode === 62) {
            // IF GREATER THAN SIGN, >
            applicableOpts.convertEntities = true;

            if (opts.convertEntities) {
              rangesArr.push(i, i + 1, "&gt;");
            }
          } else if (charcode === 119) {
            // IF LETTER w
            //
            // URL detection
            //
            if (str[y + 1] && str[y].toLowerCase() === "w" && str[y + 1].toLowerCase() === "w") {
              state.onUrlCurrently = true;
            }
          } else if (charcode === 123) {
            // opening curly bracket {
            // check for following {{ and {%, if following skip until closing found
            var stopUntil;

            if (str[y] === "{") {
              stopUntil = "}}";
            } else if (str[y] === "%") {
              stopUntil = "%}";
            } // PS. whitespace limiting with dashes like {%- zz -%} don't matter
            // because dashes sit inside and will be caught by standard {%..%}


            if (stopUntil) {
              for (var _z = i; _z < len; _z++) {
                if (str[_z] === stopUntil[0] && str[_z + 1] === stopUntil[1]) {
                  offsetBy(_z + 1 - i);
                  break;
                }
              } // if end is reached and closing counterpart is not found,
              // nothing happens.

            }
          }
        }
      } else {
        // >= 127
        // outside ASCII, need to encode (unless requested not to)
        // plan - filter all characters for deletion and leave reset (ELSE) to
        // be encoded
        if (charcode > 126 && charcode < 160) {
          // C1 group
          if (charcode !== 133) {
            // over thirty characters, so they are statistically more likely to happen:
            rangesArr.push(i, y);
          } else {
            // only codepoint 133 - Next Line (NEL), statistically less probable
            // so it comes second:
            applicableOpts.removeLineBreaks = true;
            rangesArr.push(i, y, opts.removeLineBreaks ? "" : "\n");
          }
        } else if (charcode === 173) {
          // IF SOFT HYPHEN, '\u00AD'
          rangesArr.push(i, y);
        } else if (charcode === 8232 || charcode === 8233) {
          // '\u2028', '\u2029'
          applicableOpts.removeLineBreaks = true;
          rangesArr.push(i, y, opts.removeLineBreaks ? "" : "\n");
        } else if ([5760, 8191, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8239, 8287, 12288].includes(charcode)) {
          // replace with spaces from
          // https://www.fileformat.info/info/unicode/category/Zs/list.htm
          // - ogham space marks (#5760), '\u1680'
          // - en quad (#8192), '\u2000'
          // - em quad (#8193), '\u2001'
          // - en space (#8194), '\u2002'
          // - em space (#8195), '\u2003'
          // - three-per-em-space (#8196), '\u2004'
          // - four-per-em-space (#8197), '\u2005'
          // - six-per-em-space (#8198), '\u2006'
          // - figure space (#8199), '\u2007'
          // - punctuation space (#8200), '\u2008'
          // - thin space (#8201), '\u2009'
          // - hair space (#8202), '\u200A'
          // - narrow no break space (#8239), '\u202F'
          // - medium mathematical space (#8287), '\u205F'
          // - ideographic space (#12288), '\u3000'
          if (!str[y]) {
            rangesArr.push(i, y);
          } else {
            // rangesArr.push(i, y, " ");
            var expandedRange = expander({
              str: str,
              from: i,
              to: y,
              wipeAllWhitespaceOnLeft: true,
              wipeAllWhitespaceOnRight: true,
              addSingleSpaceToPreventAccidentalConcatenation: true
            });
            rangesArr.push.apply(rangesArr, _toConsumableArray(expandedRange));
          }
        } else if (charcode === 8206) {
          // remove all left-to-right mark chars, '\u200E'
          rangesArr.push(i, y);
        } else if (charcode === 8207) {
          // remove all right-to-right mark chars, '\u200F'
          rangesArr.push(i, y);
        } else if (charcode === 8211 || charcode === 65533 && isNumber$1(str[i - 1]) && isNumber$1(str[y])) {
          // IF N-DASH, '\u2013'
          applicableOpts.convertDashes = true;

          if (!opts.convertDashes) {
            rangesArr.push(i, y, "-");
          } else {
            applicableOpts.convertEntities = true;

            if (opts.convertEntities) {
              // if it's space-ndash-space, put m-dash instead
              if (str[i - 1] && !str[i - 1].trim().length && str[i + 1] && !str[i + 1].trim().length && !(isNumber$1(str[i - 2]) && isNumber$1(str[i + 2]))) {
                rangesArr.push(i, y, "&mdash;");
              } else {
                // ELSE - n-dash stays
                rangesArr.push(i, y, "&ndash;");
              }
            } else if (charcode === 65533) {
              if (str[i - 1] && !str[i - 1].trim().length && str[i + 1] && !str[i + 1].trim().length) {
                rangesArr.push(i, y, rawMDash);
              } else {
                rangesArr.push(i, y, rawNDash);
              }
            }
          } // if there's space in front but no space after:
          // ---------------------------------------------


          if (str[i - 1] && str[i - 1].trim().length === 0 && str[y].trim().length !== 0) {
            if (str[i - 2] && isNumber$1(str[i - 2]) && isNumber$1(str[y])) {
              rangesArr.push(i - 1, i);
            } else {
              applicableOpts.addMissingSpaces = true;
              applicableOpts.convertEntities = true; // 1.
              // add space after

              if (opts.addMissingSpaces) {
                var whatToAdd = " "; // imagine case "10am&nbsp;&ndash;11am" - we're adding space
                // before "11am", but there needs to be non-breaking space because
                // widow removal is on

                if (!widowRegexTest.test(str.slice(y))) {
                  applicableOpts.removeWidows = true;

                  if (opts.removeWidows) {
                    whatToAdd = opts.convertEntities ? "&nbsp;" : rawNbsp$1;
                  }
                }

                rangesArr.push(y, y, whatToAdd);
              } // 2.
              // replace space in front with non-breaking space if widow removal is on


              if (str.slice(i - 1, i) !== rawNbsp$1) {
                applicableOpts.removeWidows = true;

                if (opts.removeWidows) {
                  rangesArr.push(i - 1, i, opts.convertEntities ? "&nbsp;" : rawNbsp$1);
                }
              }
            }
          } else if (str[i - 2] && str[i - 1] && str[y] && str[y + 1] && isNumber$1(str[i - 2]) && isNumber$1(str[y + 1]) && str[i - 1].trim().length === 0 && str[y].trim().length === 0) {
            // delete spaces around n-dash if those are number strings
            rangesArr.push(i - 1, i);
            rangesArr.push(y, y + 1);
          } // Also, if it is mistakenly put instead of an m-dash, we need to tackle
          // the widow word, space in front of it within this clause.


          if (str[i - 2] && str[i + 1] && !str[i - 1].trim().length && str[i - 2].trim().length && !str[i + 1].trim().length && !(isNumber$1(str[i - 2]) && isNumber$1(str[i + 2]))) {
            // 1. report as applicable
            applicableOpts.removeWidows = true;

            if (opts.removeWidows) {
              // 2. replace the space
              rangesArr.push(i - 1, i, opts.convertEntities ? "&nbsp;" : rawNbsp$1);
            }
          }
        } else if (charcode === 8212 || charcode === 65533 && str[i - 1] === " " && str[y] === " ") {
          // IF RAW M-DASH, '\u2014'
          applicableOpts.convertDashes = true; // replace spaces in front with nbsp if widow removal is on

          if (str[i - 1] === " " && left(str, i) !== null) {
            applicableOpts.removeWidows = true;

            if (opts.removeWidows) {
              applicableOpts.convertEntities = true;
              rangesArr.push(left(str, i) + 1, i, opts.convertEntities ? "&nbsp;" : rawNbsp$1);
            }
          } // tackle conversion into hyphen and surrounding spaces


          if (!opts.convertDashes) {
            rangesArr.push(i, y, "-");
          } else {
            applicableOpts.convertEntities = true; // 1. if there's space in front but no space after M-dash, add one after

            if (str[i - 1] && str[i - 1].trim().length === 0 && str[y].trim().length !== 0) {
              applicableOpts.addMissingSpaces = true;

              if (opts.addMissingSpaces) {
                rangesArr.push(y, y, " ");
              }
            } // 2. encode if applicable


            if (opts.convertEntities) {
              rangesArr.push(i, y, "&mdash;");
            } else if (charcode === 65533) {
              rangesArr.push(i, y, rawMDash);
            }
          }
        } else if (charcode === 8216) {
          // IF UNENCODED LEFT SINGLE QUOTE
          var _tempRes2 = convertOne(str, {
            from: i,
            to: y,
            convertEntities: true,
            convertApostrophes: true
          });

          if (_tempRes2 && _tempRes2.length) {
            applicableOpts.convertApostrophes = true;
            var tempRes2 = convertOne(str, {
              from: i,
              to: y,
              convertEntities: true,
              convertApostrophes: true
            });

            if (tempRes2) {
              if (opts.convertApostrophes) {
                applicableOpts.convertEntities = true;
              }

              rangesArr.push(convertOne(str, {
                from: i,
                to: y,
                convertEntities: opts.convertEntities,
                convertApostrophes: opts.convertApostrophes,
                offsetBy: offsetBy
              }));
            }
          }
        } else if (charcode === 8217) {
          // IF UNENCODED RIGHT SINGLE QUOTE
          applicableOpts.convertApostrophes = true;

          if (!opts.convertApostrophes) {
            rangesArr.push(i, y, "'");
          } else {
            applicableOpts.convertEntities = true;

            if (opts.convertEntities) {
              rangesArr.push(i, y, "&rsquo;");
            }
          }
        } else if (charcode === 8220) {
          // IF UNENCODED LEFT DOUBLE QUOTE
          applicableOpts.convertApostrophes = true;

          if (!opts.convertApostrophes) {
            applicableOpts.convertEntities = true;
            rangesArr.push(i, y, opts.convertEntities ? "&quot;" : "\"");
          } else if (opts.convertEntities) {
            applicableOpts.convertEntities = true;
            rangesArr.push(i, y, "&ldquo;");
          }
        } else if (charcode === 8221) {
          // IF UNENCODED RIGHT DOUBLE QUOTE
          applicableOpts.convertApostrophes = true;

          if (!opts.convertApostrophes) {
            applicableOpts.convertEntities = true;
            rangesArr.push(i, y, opts.convertEntities ? "&quot;" : "\"");
          } else if (opts.convertEntities) {
            applicableOpts.convertEntities = true;
            rangesArr.push(i, y, "&rdquo;");
          }
        } else if (charcode === 8230) {
          // IF UNENCODED HORIZONTAL ELLIPSIS CHARACTER &hellip;
          applicableOpts.convertDotsToEllipsis = true;

          if (!opts.convertDotsToEllipsis) {
            rangesArr.push(i, y, "...");
          } else {
            applicableOpts.convertEntities = true;

            if (opts.convertEntities) {
              rangesArr.push(i, y, "&hellip;");
            }
          }
        } else if (charcode === 65279) {
          // IF BOM, '\uFEFF'
          rangesArr.push(i, y);
        } else {
          //
          //
          // ENCODE (on by default, but can be turned off)
          //
          //
          if (!applicableOpts.dontEncodeNonLatin && doConvertEntities(str[i], true) !== doConvertEntities(str[i], false)) {
            applicableOpts.dontEncodeNonLatin = true;
          } // try to convert the current character into HTML entities.


          var convertedCharVal = doConvertEntities(str[i], opts.dontEncodeNonLatin);

          if (Object.keys(notEmailFriendly).includes(convertedCharVal.slice(1, convertedCharVal.length - 1))) {
            convertedCharVal = "&".concat(notEmailFriendly[convertedCharVal.slice(1, convertedCharVal.length - 1)], ";");
          } // 2. If the result is different from the original character, this means
          // that this character needs to be encoded. We will submit this character's
          // range up for replacement.


          if (str[i] !== convertedCharVal) {
            applicableOpts.convertEntities = true; // here

            if (opts.convertEntities) {
              if (convertedCharVal === "&mldr;") {
                rangesArr.push(i, y, "&hellip;");
              } else if (convertedCharVal !== "&apos;") {
                rangesArr.push(i, y, convertedCharVal);
              }

              applicableOpts.convertEntities = true;
            }
          }
        }
      }

      if (state.onUrlCurrently && !str[i].trim().length) {
        state.onUrlCurrently = false;
      } //
      //
      //
      //
      //
      //
      //

    }
  }

  function det(str, inputOpts) {
    //
    // input validation
    // ---------------------------------------------------------------------------
    if (typeof str !== "string") {
      throw new Error("detergent(): [THROW_ID_01] the first input argument must be of a string type, not ".concat(_typeof(str)));
    }

    if (inputOpts && _typeof(inputOpts) !== "object") {
      throw new Error("detergent(): [THROW_ID_02] Options object must be a plain object, not ".concat(_typeof(inputOpts)));
    }

    if (inputOpts && inputOpts.cb && typeof inputOpts.cb !== "function") {
      throw new Error("detergent(): [THROW_ID_03] Options callback, opts.cb must be a function, not ".concat(_typeof(inputOpts.cb), " (value was given as:\n").concat(JSON.stringify(inputOpts.cb, null, 0), ")"));
    }

    var opts = _objectSpread2(_objectSpread2({}, defaultOpts$1), inputOpts);

    if (!["lf", "crlf", "cr"].includes(opts.eol)) {
      opts.eol = "lf";
    } // prepare applicable rules object. It is a clone of the default opts object
    // (which comes from util.js), where for starters all values are turned off,
    // then upon traversal, each applicable rule sets the key to true, it does not
    // matter, rule is enabled in opts or not. We just mark that particular
    // options setting could be applicable.


    var applicableOpts = {};
    Object.keys(defaultOpts$1).sort().filter(function (val) {
      return !["stripHtmlAddNewLine", "stripHtmlButIgnoreTags", "cb"].includes(val);
    }).forEach(function (singleOption) {
      applicableOpts[singleOption] = false;
    }); // the tags whitelist is not boolean, it falls outside reporting cases

    delete applicableOpts.stripHtmlButIgnoreTags; //
    // vars and internal functions
    // --------------------------------------------------------------------------

    var endOfLine = "\n";

    if (opts.eol === "crlf") {
      endOfLine = "\r\n";
    } else if (opts.eol === "cr") {
      endOfLine = "\r";
    }

    var brClosingBracketIndexesArr = []; // We need to track what actions need to be done. Each action (a range) is
    // an array of two elements: from index and to index. It means what to delete.
    // There can be third element, a string, which means what to insert instead.

    var finalIndexesToDelete = new Ranges({
      limitToBeAddedWhitespace: false
    }); // the main container to gather the ranges. Ranges is a JS class.
    // When we process the input, we gather the information about it and sometimes
    // it's very efficient to stop processing chunks once they're cleared.
    // For example, any index ranges taken by HTML entities can be ignored after
    // those index range are identified. It's even a hassle otherwise: entities
    // contain ampersands and if we didn't ignore entity ranges, we'd have to
    // take measures to ignore ampersand encoding.

    var skipArr = new Ranges();

    function applyAndWipe() {
      str = rangesApply(str, finalIndexesToDelete.current());
      finalIndexesToDelete.wipe(); // skipArr.wipe();
    }

    function isNum(something) {
      return Number.isInteger(something);
    }

    var state = {
      onUrlCurrently: false
    }; //                                          ____
    //                         massive hammer  |    |
    //                       O=================|    |
    //                         upon all bugs   |____|
    //                                        .=O=.
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
    //                       T H E    P I P E L I N E
    //
    // ---------------------------------------------------------------------------
    // NEXT STEP.

    str = trimSpaces(str.replace(ansiRegex(), "").replace(/\u200A/g, " "), {
      cr: true,
      lf: true,
      tab: true,
      space: true,
      nbsp: false
    }).res; // ---------------------------------------------------------------------------
    // NEXT STEP.

    var temp = str;
    var lastVal;

    do {
      lastVal = temp;
      temp = he.decode(temp);
    } while (temp !== str && lastVal !== temp);

    if (str !== temp) {
      str = temp;
    }

    str = collapse(str, {
      trimLines: true,
      recogniseHTML: false,
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 1
    }); // ---------------------------------------------------------------------------
    // NEXT STEP.
    // preliminary loop through to remove/replace characters which later might
    // be needed to be considered when replacing others in the main loop;
    // that's mostly some nasties converted into spaces - those spaces will
    // be needed to already by there in the main loop

    for (var i = 0, len = str.length; i < len; i++) {
      if (str[i].charCodeAt(0) === 65533) {
        // REPLACEMENT CHARACTER, \uFFFD, or "�"
        // Delete/fix all cases of Replacement character, \uFFFD, or "�":
        // It usually comes from Windows.
        if (str[i - 1] && str[i + 1] && (str[i - 1].toLowerCase() === "n" && str[i + 1].toLowerCase() === "t" || isLetter(str[i - 1]) && str[i + 1].toLowerCase() === "s") || str[i + 2] && ((str[i + 1].toLowerCase() === "r" || str[i + 1].toLowerCase() === "v") && str[i + 2].toLowerCase() === "e" || str[i + 1].toLowerCase() === "l" && str[i + 2].toLowerCase() === "l") && (str[i - 3] && str[i - 3].toLowerCase() === "y" && str[i - 2].toLowerCase() === "o" && str[i - 1].toLowerCase() === "u" || str[i - 2] && str[i - 2].toLowerCase() === "w" && str[i - 1].toLowerCase() === "e" || str[i - 4] && str[i - 4].toLowerCase() === "t" && str[i - 3].toLowerCase() === "h" && str[i - 2].toLowerCase() === "e" && str[i - 1].toLowerCase() === "y") || (str[i - 1] && str[i - 1].toLowerCase() === "i" || str[i - 2] && str[i - 2].toLowerCase() === "h" && str[i - 1].toLowerCase() === "e" || str[i - 3] && str[i - 3].toLowerCase() === "s" && str[i - 2].toLowerCase() === "h" && str[i - 1].toLowerCase() === "e") && str[i + 2] && str[i + 1].toLowerCase() === "l" && str[i + 2].toLowerCase() === "l" || str[i - 5] && str[i + 2] && str[i - 5].toLowerCase() === "m" && str[i - 4].toLowerCase() === "i" && str[i - 3].toLowerCase() === "g" && str[i - 2].toLowerCase() === "h" && str[i - 1].toLowerCase() === "t" && str[i + 1] === "v" && str[i + 2] === "e" || str[i - 1] && str[i - 1].toLowerCase() === "s" && (!str[i + 1] || !isLetter(str[i + 1]) && !isNumber$1(str[i + 1]))) {
          // 1. case of n�t, for example, couldn�t (n + � + t),
          // or case of <letter>�s, for example your�s (letter + � + s).
          // 2. case of we�re, you�re, they�re
          // 3. case of we�ve, you�ve, they�ve
          // 4. case of I�ll, you�ll, he'�ll, she�ll, we�ll, they�ll, it�ll
          var replacement = opts.convertApostrophes ? rightSingleQuote : "'";
          finalIndexesToDelete.push(i, i + 1, "".concat(replacement));
          applicableOpts.convertApostrophes = true;
        } else if (str[i - 2] && isLowercaseLetter(str[i - 2]) && !str[i - 1].trim() && str[i + 2] && isLowercaseLetter(str[i + 2]) && !str[i + 1].trim()) {
          // we don't encode here, no matter if opts.convertEntities is on:
          finalIndexesToDelete.push(i, i + 1, rawMDash); // it's because it's a preliminary replacement, we'll encode in the main loop
        } else {
          finalIndexesToDelete.push(i, i + 1);
        }
      }
    } // ---------------------------------------------------------------------------
    // NEXT STEP.


    applyAndWipe(); // ---------------------------------------------------------------------------
    // NEXT STEP.
    // fix broken named HTML entities, if any:

    var entityFixes = stringFixBrokenNamedEntities(str, {
      decode: false
    });

    if (entityFixes && entityFixes.length) {
      // 1. report option as applicable:
      applicableOpts.fixBrokenEntities = true; // 2. if option is enabled, apply it:

      if (opts.fixBrokenEntities) {
        str = rangesApply(str, entityFixes);
      }
    } // ---------------------------------------------------------------------------
    // NEXT STEP.
    // callback, opts.cb processing outside the tags


    if (opts.cb) {
      // if there are potential HTML tags, we'll need to extract them and process
      // outside them
      if (str.includes("<") || str.includes(">")) {
        var outsideTagRanges = rangesInvert(stripHtml(str, {
          cb: function cb(_ref) {
            var tag = _ref.tag,
                rangesArr = _ref.rangesArr;
            return rangesArr.push(tag.lastOpeningBracketAt, tag.lastClosingBracketAt + 1);
          },
          skipHtmlDecoding: true,
          returnRangesOnly: true
        }), str.length).reduce(function (accumRanges, currRange) {
          // if there's difference after callback's result, push it as range
          if (str.slice(currRange[0], currRange[1]) !== opts.cb(str.slice(currRange[0], currRange[1]))) {
            return accumRanges.concat([[currRange[0], currRange[1], opts.cb(str.slice(currRange[0], currRange[1]))]]);
          }

          return accumRanges;
        }, []);
        str = rangesApply(str, outsideTagRanges);
      } else {
        // if there are no tags, whole string can be processed:
        str = opts.cb(str);
      }
    } // ---------------------------------------------------------------------------
    // NEXT STEP.
    // tend the HTML tags
    // but maybe our input string doesn't even have any HTML tags?


    if (str.includes("<") || str.includes(">")) {
      // submit all HTML tags to be skipped from now on:
      // we're using callback interface to ignore strictly from bracket to bracket
      // (including brackets), without range extension which normally would get
      // added in callback's "deleteFrom" / "deleteTo" equivalent.
      // Normally, we wipe whole tag and its surrounding whitespace, then replace
      // it with space if needed, otherwise just delete that range.
      // This extended range is a liability in light of widow word removal processes
      // down the line - those won't "see" some of the spaces around tags!
      var cb = function cb(_ref2) {
        var tag = _ref2.tag,
            deleteFrom = _ref2.deleteFrom,
            deleteTo = _ref2.deleteTo,
            proposedReturn = _ref2.proposedReturn;

        // if it's a tag
        if (isNum(tag.lastOpeningBracketAt) && isNum(tag.lastClosingBracketAt) && tag.lastOpeningBracketAt < tag.lastClosingBracketAt || tag.slashPresent) {
          applicableOpts.stripHtml = true; // 1. add range from bracket to bracket to ignores list:

          skipArr.push(tag.lastOpeningBracketAt, tag.lastClosingBracketAt ? tag.lastClosingBracketAt + 1 : str.length); // 2. strip tag if opts.stripHtml is enabled

          if (opts.stripHtml && !opts.stripHtmlButIgnoreTags.includes(tag.name.toLowerCase())) {
            // 1. strip tag
            // take care of tags listed under opts.stripHtmlAddNewLine
            if (opts.stripHtmlAddNewLine.length && opts.stripHtmlAddNewLine.some(function (tagName) {
              return tagName.startsWith("/") && tag.slashPresent && tag.name.toLowerCase() === tagName.slice(1) || !tagName.startsWith("/") && !tag.slashPresent && tag.name.toLowerCase() === tagName;
            })) {
              applicableOpts.removeLineBreaks = true;

              if (!opts.removeLineBreaks) {
                applicableOpts.replaceLineBreaks = true;

                if (opts.replaceLineBreaks) {
                  applicableOpts.useXHTML = true;
                } // insert <br>


                finalIndexesToDelete.push(deleteFrom, deleteTo, "".concat(opts.replaceLineBreaks ? "<br".concat(opts.useXHTML ? "/" : "", ">") : "", "\n"));
              } else {
                finalIndexesToDelete.push(proposedReturn);
              }
            } else {
              finalIndexesToDelete.push(proposedReturn);
              skipArr.push(proposedReturn);
            }
          } else {
            // 3. add closing slash on void tags if XHTML mode is on
            if (voidTags.includes(tag.name.toLowerCase())) {
              //
              // IF A VOID TAG
              //
              applicableOpts.useXHTML = true;

              if (str[left(str, tag.lastClosingBracketAt)] !== "/" && tag.lastClosingBracketAt) {
                if (opts.useXHTML) {
                  finalIndexesToDelete.push(tag.lastClosingBracketAt, tag.lastClosingBracketAt, "/");
                }
              } // 4. remove slashes in front of a void tag


              if (tag.slashPresent && isNum(tag.lastOpeningBracketAt) && tag.nameStarts && tag.lastOpeningBracketAt < tag.nameStarts - 1 && str.slice(tag.lastOpeningBracketAt + 1, tag.nameStarts).split("").every(function (char) {
                return !char.trim() || char === "/";
              })) {
                finalIndexesToDelete.push(tag.lastOpeningBracketAt + 1, tag.nameStarts);
              } // 5. remove closing slash from void tags is XHTML mode is off
              // or excessive, multiple closing slashes


              if (tag.slashPresent && str[left(str, tag.lastClosingBracketAt)] === "/") {
                if (str[left(str, left(str, tag.lastClosingBracketAt))] === "/") {
                  applicableOpts.useXHTML = true;

                  if (!opts.useXHTML || str.slice(chompLeft(str, tag.lastClosingBracketAt, {
                    mode: 2
                  }, "/"), tag.lastClosingBracketAt) !== "/") {
                    // multiple closing slashes
                    finalIndexesToDelete.push( // chomp mode 2: hungrily chomp all whitespace except newlines
                    // for example:
                    // chompLeft("a  b c b c  x y", 12, { mode: 2 }, "b", "c")
                    // => 1
                    chompLeft(str, tag.lastClosingBracketAt, {
                      mode: 2
                    }, "/"), tag.lastClosingBracketAt, opts.useXHTML ? "/" : undefined);
                  }
                } else if (!opts.useXHTML || str.slice(tag.slashPresent, tag.lastClosingBracketAt) !== "/") {
                  finalIndexesToDelete.push(tag.slashPresent, tag.lastClosingBracketAt);
                }
              }
            } //
            // IF NOT A VOID TAG
            //
            // 6. if it's not a void tag and there's slash on a wrong side, correct it
            else if (tag.slashPresent && str[left(str, tag.lastClosingBracketAt)] === "/") {
                // 6-1. remove the wrong slash
                finalIndexesToDelete.push(chompLeft(str, tag.lastClosingBracketAt, {
                  mode: 2
                }, "/"), tag.lastClosingBracketAt); // 6-2. add where it needs to be

                finalIndexesToDelete.push(tag.lastOpeningBracketAt + 1, tag.lastOpeningBracketAt + 1, "/");
              } // 7. tackle wrong letter case


            if (tag.name.toLowerCase() !== tag.name) {
              finalIndexesToDelete.push(tag.nameStarts, tag.nameEnds, tag.name.toLowerCase());
            } // 8. remove whitespace after tag name like <tr >


            if ("/>".includes(str[right(str, tag.nameEnds - 1)]) && right(str, tag.nameEnds - 1) > tag.nameEnds) {
              finalIndexesToDelete.push(tag.nameEnds, right(str, tag.nameEnds - 1));
            } // 9. remove whitespace in front of tag name, considering closing slashes


            if (isNum(tag.lastOpeningBracketAt) && isNum(tag.nameStarts) && tag.lastOpeningBracketAt + 1 < tag.nameStarts) {
              // cases like < tr>
              if (!str.slice(tag.lastOpeningBracketAt + 1, tag.nameStarts).trim().length) {
                // all this whitespace goes
                finalIndexesToDelete.push(tag.lastOpeningBracketAt + 1, tag.nameStarts);
              } else if (!voidTags.includes(tag.name.toLowerCase()) && str.slice(tag.lastOpeningBracketAt + 1, tag.nameStarts).split("").every(function (char) {
                return !char.trim() || char === "/";
              })) {
                // if there is mix of whitespace and closing slashes, all this
                // goes and replaced with single slash.
                // Imagine: < ///    ///    table>
                finalIndexesToDelete.push(tag.lastOpeningBracketAt + 1, tag.nameStarts, "/");
              }
            }
          } // 10. if it's a BR, take a note of its closing bracket's location:


          if (tag.name.toLowerCase() === "br" && tag.lastClosingBracketAt) {
            brClosingBracketIndexesArr.push(tag.lastClosingBracketAt);
          } // 11. remove whitespace in front of UL/LI tags


          if (["ul", "li"].includes(tag.name.toLowerCase()) && !opts.removeLineBreaks && str[tag.lastOpeningBracketAt - 1] && !str[tag.lastOpeningBracketAt - 1].trim()) {
            // if there's whitespace in front,
            finalIndexesToDelete.push(leftStopAtNewLines(str, tag.lastOpeningBracketAt) + 1, tag.lastOpeningBracketAt);
          } // 12. remove whitespace before closing bracket


          if (str[tag.lastClosingBracketAt - 1] && !str[tag.lastClosingBracketAt - 1].trim()) {
            finalIndexesToDelete.push(left(str, tag.lastClosingBracketAt) + 1, tag.lastClosingBracketAt);
          }
        } // LOGGING:

      }; // since we rely on callback interface, we don't need to assign the function
      // to a result, we perform all the processing within the callback "cb":


      stripHtml(str, {
        cb: cb,
        trimOnlySpaces: true,
        ignoreTags: stripHtml ? opts.stripHtmlButIgnoreTags : [],
        skipHtmlDecoding: true,
        returnRangesOnly: true
      });
    } // ---------------------------------------------------------------------------
    // NEXT STEP.


    processOutside(str, skipArr.current(), function (idxFrom, idxTo, offsetBy) {
      return processCharacter(str, opts, finalIndexesToDelete, idxFrom, idxTo, offsetBy, brClosingBracketIndexesArr, state, applicableOpts, endOfLine, opts.cb);
    }, true); // ---------------------------------------------------------------------------
    // NEXT STEP.

    applyAndWipe(); // patch up spaces in front of <br/>

    str = str.replace(/ (<br[/]?>)/g, "$1");
    str = str.replace(/(\r\n|\r|\n){3,}/g, "".concat(endOfLine).concat(endOfLine)); // ---------------------------------------------------------------------------
    // NEXT STEP.
    // remove widow words

    var widowFixes = removeWidows(str, {
      ignore: "all",
      convertEntities: opts.convertEntities,
      // full-on setup
      targetLanguage: "html",
      UKPostcodes: true,
      // full-on setup
      hyphens: opts.convertDashes,
      // full-on setup
      tagRanges: skipArr.current()
    });

    if (widowFixes && widowFixes.ranges && widowFixes.ranges.length) {
      // 1. report option as potentially applicable:
      if (!applicableOpts.removeWidows && widowFixes.whatWasDone.removeWidows) {
        applicableOpts.removeWidows = true;

        if (opts.removeWidows) {
          applicableOpts.convertEntities = true;
        }
      } // 2.


      if (!applicableOpts.convertEntities && widowFixes.whatWasDone.convertEntities) {
        applicableOpts.convertEntities = true;
      } // 3. if option is enabled, apply it:


      if (opts.removeWidows) {
        str = widowFixes.res;
      }
    } // ---------------------------------------------------------------------------
    // NEXT STEP.
    // replace line breaks


    if (str !== str.replace(/\r\n|\r|\n/gm, " ")) {
      // 1. report opts.removeLineBreaks might be applicable
      applicableOpts.removeLineBreaks = true; // 2. apply if option is on

      if (opts.removeLineBreaks) {
        str = str.replace(/\r\n|\r|\n/gm, " ");
      }
    } // ---------------------------------------------------------------------------
    // NEXT STEP.


    str = collapse(str, {
      trimLines: true,
      recogniseHTML: false
    }); // ---------------------------------------------------------------------------
    // NEXT STEP.

    return {
      res: rangesApply(str, finalIndexesToDelete.current()),
      applicableOpts: applicableOpts
    };
  }
   // -----------------------------------------------------------------------------

  exports.det = det;
  exports.opts = defaultOpts$1;
  exports.version = version$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
