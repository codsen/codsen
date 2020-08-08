/**
 * eslint-plugin-test-num
 * ESLint plugin to update unit test numbers automatically
 * Version: 1.3.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/eslint-plugin-test-num
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.eslintPluginTestNum = factory());
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
        return _typeof(obj) === 'object' && toString(obj) === "[object Object]";
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

        var objectPath = function objectPath(obj) {
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

  /** Used for built-in method references. */


  var funcProto = Function.prototype;
  /** Used to resolve the decompiled source of functions. */

  var funcToString = funcProto.toString;
  /** Used to infer the `Object` constructor. */

  var objectCtorString = funcToString.call(Object);

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

  function prep(str, originalOpts) {
    // console.log(
    //   `003 prep(): ${`\u001b[${32}m${`RECEIVED`}\u001b[${39}m`} >>>${str}<<<`
    // );

    /* istanbul ignore if */
    if (typeof str !== "string" || !str.length) {
      return;
    }

    var defaults = {
      offset: 0
    };

    var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts); // console.log(
    //   `015 prep(): final ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
    //     opts,
    //     null,
    //     4
    //   )}`
    // );
    // So it's a non-empty string. Traverse!


    var digitsChunkStartsAt = null;
    var lastDigitAt; // console.log(
    //   `028 prep(): ${`\u001b[${36}m${`traverse starts`}\u001b[${39}m`}`
    // );

    for (var i = 0, len = str.length; i <= len; i++) {
      // console.log(
      //   `032 prep(): ${`\u001b[${36}m${`======================== str[${i}]= ${`\u001b[${35}m${
      //     str[i] && str[i].trim().length
      //       ? str[i]
      //       : JSON.stringify(str[i], null, 4)
      //   }\u001b[${39}m`} ========================`}\u001b[${39}m`}`
      // );
      // catch the end of the digit chunk
      // -------------------------------------------------------------------------
      if ( // if chunk has been recorded as already started
      digitsChunkStartsAt !== null && ( // and
      // a) it's not a whitespace
      str[i] && str[i].trim().length && // it's not a number
      !/\d/.test(str[i]) && // and it's not a dot or hyphen
      !["."].includes(str[i]) || // OR
      // b) we reached the end (we traverse up to and including str.length,
      // which is "undefined" character; notice i <= len in the loop above,
      // normally it would be i < len)
      !str[i])) {
        // console.log(
        //   `059 prep(): ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}: "${JSON.stringify(
        //     {
        //       start: opts.offset + digitsChunkStartsAt,
        //       end: opts.offset + lastDigitAt + 1,
        //       value: str.slice(digitsChunkStartsAt, lastDigitAt + 1),
        //     },
        //     null,
        //     4
        //   )}"`
        // );
        return {
          start: opts.offset + digitsChunkStartsAt,
          end: opts.offset + lastDigitAt + 1,
          value: str.slice(digitsChunkStartsAt, lastDigitAt + 1)
        };
      } // catch digits
      // -------------------------------------------------------------------------


      if (/^\d*$/.test(str[i])) {
        // 1. note that
        lastDigitAt = i; // 2. catch the start of the first digit

        if ( // if chunk hasn't been recorded yet
        digitsChunkStartsAt === null) {
          digitsChunkStartsAt = i; // console.log(
          //   `089 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`digitsChunkStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
          //     digitsChunkStartsAt,
          //     null,
          //     4
          //   )}`
          // );
        }
      } // catch false scenario cases where letters precede numbers
      // -------------------------------------------------------------------------


      if ( // chunk hasn't been detected yet:
      digitsChunkStartsAt === null && // it's not whitespace:
      str[i] && str[i].trim().length && // it's not dot or digit or some kind of quote:
      !/[\d.'"`]/.test(str[i])) {
        // console.log(`109 ${`\u001b[${31}m${`early bail`}\u001b[${39}m`}`);
        return;
      } // logging
      // -------------------------------------------------------------------------
      // console.log(" ");
      // console.log(
      //   `${`\u001b[${90}m${`██ digitsChunkStartsAt = ${digitsChunkStartsAt}`}\u001b[${39}m`}`
      // );
      // console.log(
      //   `${`\u001b[${90}m${`██ lastDigitAt = ${lastDigitAt}`}\u001b[${39}m`}`
      // );
      // console.log(`${`\u001b[${90}m${`----------------`}\u001b[${39}m`}`);

    }
  }

  var getNewValue = function getNewValue(subTestCount, testOrderNumber, counter2) {
    return subTestCount === "single" ? testOrderNumber : "".concat(testOrderNumber, ".").concat("".concat(counter2).padStart(2, "0"));
  };

  /* eslint no-cond-assign: 0 */
  // compiled from https://node-tap.org/docs/api/asserts/

  var messageIsSecondArg = new Set(["ok", "notOk", "true", "false", "assert", "assertNot", "error", "ifErr", "ifError", "rejects", // "rejects" message can be 2nd or 3rd arg!!!
  "resolves", "resolveMatchSnapshot", "throws", // "throws" message can be 2nd or 3rd arg!!!
  "throw", // "throw" message can be 2nd or 3rd arg!!!
  "doesNotThrow", "notThrow", "expectUncaughtException" // "expectUncaughtException" message can be 2nd or 3rd arg!!!
  ]); // compiled from https://node-tap.org/docs/api/asserts/

  var messageIsThirdArg = new Set(["emits", "rejects", // "rejects" message can be 2nd or 3rd arg!!!
  "resolveMatch", "throws", // "throws" message can be 2nd or 3rd arg!!!
  "throw", // "throw" message can be 2nd or 3rd arg!!!
  "expectUncaughtException", // "expectUncaughtException" message can be 2nd or 3rd arg!!!
  "equal", "equals", "isEqual", "is", "strictEqual", "strictEquals", "strictIs", "isStrict", "isStrictly", "notEqual", "inequal", "notEqual", "notEquals", "notStrictEqual", "notStrictEquals", "isNotEqual", "isNot", "doesNotEqual", "isInequal", "same", "equivalent", "looseEqual", "looseEquals", "deepEqual", "deepEquals", "isLoose", "looseIs", "notSame", "inequivalent", "looseInequal", "notDeep", "deepInequal", "notLoose", "looseNot", "strictSame", "strictEquivalent", "strictDeepEqual", "sameStrict", "deepIs", "isDeeply", "isDeep", "strictDeepEquals", "strictNotSame", "strictInequivalent", "strictDeepInequal", "notSameStrict", "deepNot", "notDeeply", "strictDeepInequals", "notStrictSame", "hasStrict", "match", "has", "hasFields", "matches", "similar", "like", "isLike", "includes", "include", "contains", "notMatch", "dissimilar", "unsimilar", "notSimilar", "unlike", "isUnlike", "notLike", "isNotLike", "doesNotHave", "isNotSimilar", "isDissimilar", "type", "isa", "isA"]);

  var create = function create(context) {
    // console.log(
    //   `119 ${`\u001b[${33}m${`███████████████████████████████████████`}\u001b[${39}m`}`
    // );
    var counter = 0;
    return {
      ExpressionStatement: function ExpressionStatement(node) {
        if (objectPath.get(node, "expression.type") === "CallExpression" && ["test", "only", "skip", "todo"].includes(objectPath.get(node, "expression.callee.property.name")) && ["TemplateLiteral", "Literal"].includes(objectPath.get(node, "expression.arguments.0.type"))) {
          // console.log(" ");
          // console.log("-------------------------------");
          // console.log(" ");
          counter += 1; // console.log(
          //   `${`\u001b[${33}m${`node.expression`}\u001b[${39}m`} #${`${counter}`.padStart(
          //     2,
          //     "0"
          //   )}: ${node.expression.start}-${node.expression.end}`
          // );

          var testOrderNumber = "".concat(counter).padStart(2, "0"); // TACKLE THE FIRST ARG
          // ████████████████████
          // for example, the "09" in:
          // t.test("09 - something", (t) => ...)
          // it will be under "TemplateLiteral" node if backticks were used,
          // for example:
          // t.test(`09 - something`, (t) => ...) or "Literal" if quotes were used,
          // for example:
          // t.test("09 - something", (t) => ...)

          var finalDigitChunk;

          if (!finalDigitChunk && objectPath.get(node, "expression.arguments.0.type") === "TemplateLiteral" && objectPath.has(node, "expression.arguments.0.quasis.0.value.raw")) {
            // console.log(" ");
            // console.log(" ");
            // console.log(
            //   `169 ${`\u001b[${34}m${`██ TemplateLiteral caught!`}\u001b[${39}m`}`
            // );
            //
            // console.log(
            //   `173 node.expression.arguments[0].quasis[0].value.raw: "${node.expression.arguments[0].quasis[0].value.raw}"`
            // );
            var _ref = prep(objectPath.get(node, "expression.arguments.0.quasis.0.value.raw"), {
              offset: objectPath.get(node, "expression.arguments.0.quasis.0.start"),
              returnRangesOnly: true
            }) || {},
                start = _ref.start,
                end = _ref.end,
                value = _ref.value;

            if (start && end && value && value !== testOrderNumber) {
              // console.log(
              //   `184 ${`\u001b[${33}m${`value`}\u001b[${39}m`} = ${stringify(
              //     value,
              //     null,
              //     4
              //   )}`
              // );
              // console.log("!==");
              // console.log(
              //   `192 ${`\u001b[${33}m${`testOrderNumber`}\u001b[${39}m`} = ${stringify(
              //     testOrderNumber,
              //     null,
              //     4
              //   )}`
              // );
              finalDigitChunk = {
                start: start,
                end: end,
                value: testOrderNumber,
                node: objectPath.get(node, "expression.arguments.0.quasis.0")
              }; // console.log(
              //   `206 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalDigitChunk.node.loc`}\u001b[${39}m`} = ${stringify(
              //     finalDigitChunk.node.loc,
              //     null,
              //     4
              //   )}`
              // );
            }
          }

          if (!finalDigitChunk && node.expression.arguments[0].type === "Literal" && node.expression.arguments[0].raw) {
            // console.log(" ");
            // console.log(" ");
            // console.log(
            //   `223 ${`\u001b[${34}m${`██ Literal caught!`}\u001b[${39}m`}`
            // );
            var _ref2 = prep(node.expression.arguments[0].raw, {
              offset: node.expression.arguments[0].start,
              returnRangesOnly: true
            }) || {},
                _start = _ref2.start,
                _end = _ref2.end,
                _value = _ref2.value;

            if (_start && _end && _value && _value !== testOrderNumber) {
              finalDigitChunk = {
                start: _start,
                end: _end,
                value: testOrderNumber,
                node: node.expression.arguments[0]
              }; // console.log(
              //   `240 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`finalDigitChunk.node.loc`}\u001b[${39}m`} = ${stringify(
              //     finalDigitChunk.node.loc,
              //     null,
              //     4
              //   )}`
              // );
            }
          } // TACKLE THE THIRD ARG
          // ████████████████████
          // for example, the "09" in:
          // t.test(
          //   "some name",
          //   (t) => {
          //     t.same(fix("z &angst; y"), [], "09");
          //     t.end();
          //   }
          // );


          if (!finalDigitChunk && objectPath.get(node, "expression.arguments.1.type") === "ArrowFunctionExpression" && objectPath.get(node, "expression.arguments.1.body.type") === "BlockStatement" && objectPath.get(node, "expression.arguments.1.body.body").length) {
            // console.log(" ");
            // console.log(" ");
            // console.log(
            //   `271 ${`\u001b[${34}m${`██ Third arg literal found!`}\u001b[${39}m`}`
            // );
            // let's find out, is it a single test clause or there are multiple
            var subTestCount = "multiple";
            var filteredExpressionStatements = {};

            if ((filteredExpressionStatements = objectPath.get(node, "expression.arguments.1.body.body").filter(function (nodeObj) {
              return nodeObj.type === "ExpressionStatement" && objectPath.get(nodeObj, "expression.callee.object.name") === "t";
            })).length === 2 && // ensure last expression is t.end:
            objectPath.get(filteredExpressionStatements[filteredExpressionStatements.length - 1], "expression.callee.property.name") === "end") {
              subTestCount = "single";
            } // console.log(
            //   `297 ${`\u001b[${33}m${`subTestCount`}\u001b[${39}m`} = ${stringify(
            //     subTestCount,
            //     null,
            //     4
            //   )}`
            // );


            var exprStatements = objectPath.get(node, "expression.arguments.1.body.body");
            /* istanbul ignore else */

            if (Array.isArray(exprStatements)) {
              // loop through expression statements, t.* calls inside the (t) => {...}
              // this counter is to count expression statements and whatnot
              // within the "expression.arguments.1.body.body" path (array).
              //
              // For example, within:
              // tap.test(`01 - a`, (t) => {
              //
              // one might have many bits:
              // 1. const k = ...
              // 2. t.match(... <----- true index - #1
              // 3. const l = ...
              // 4. t.match(... <----- true index - #2
              // 5. const m = ...
              // 6. t.match(... <----- true index - #3
              //
              // but this index system above is wrong, we count only assertions -
              // only *.only, *.test and *.skip
              //
              // this counter below will be that index counter
              //
              var counter2 = 0;

              for (var i = 0, len = exprStatements.length; i < len; i++) {
                // console.log(
                //   `336 ${`\u001b[${90}m${`=================================`}\u001b[${39}m`}`
                // );
                var assertsName = objectPath.get(exprStatements[i], "expression.callee.property.name");

                if (!assertsName) {
                  // console.log(
                  //   `344 ${`\u001b[${31}m${`error - no assert name could be extracted! CONTINUE`}\u001b[${39}m`}`
                  // );
                  continue;
                } // console.log(
                //   `350 #${i} - assert: ${`\u001b[${36}m${assertsName}\u001b[${39}m`}, category: ${`\u001b[${36}m${
                //     messageIsThirdArg.has(assertsName)
                //       ? "III"
                //       : messageIsSecondArg.has(assertsName)
                //       ? "II"
                //       : "n/a"
                //   }\u001b[${39}m`}`
                // );
                // "message" argument's position is variable, sometimes it can be
                // either 2nd or 3rd


                var messageArgsPositionWeWillAimFor = void 0;

                if ( // assertion's name is known to contain "message" as third arg
                messageIsThirdArg.has(assertsName) && // and there is an argument present at that position
                objectPath.has(exprStatements[i], "expression.arguments.2")) {
                  messageArgsPositionWeWillAimFor = 2; // zero-based count
                } else if ( // assertion's name is known to contain "message" as second arg
                messageIsSecondArg.has(assertsName) && // and there is an argument present at that position
                objectPath.has(exprStatements[i], "expression.arguments.1")) {
                  messageArgsPositionWeWillAimFor = 1; // zero-based count
                } // console.log(
                //   `379 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`messageArgsPositionWeWillAimFor`}\u001b[${39}m`} = ${stringify(
                //     messageArgsPositionWeWillAimFor,
                //     null,
                //     4
                //   )}`
                // );


                if (messageArgsPositionWeWillAimFor) {
                  var _ret = function () {
                    // console.log(
                    //   `388 ${`\u001b[${32}m${`message argument missing from assertion!`}\u001b[${39}m`}`
                    // );
                    //
                    // console.log(
                    //   `392 ${`\u001b[${90}m${`let's extract the value from "message" arg in assertion`}\u001b[${39}m`}`
                    // );
                    // the "message" can be Literal (single/double quotes) or
                    // TemplateLiteral (backticks)
                    var pathToMsgArgValue = void 0;
                    var rawPathToMsgArgValue = void 0; // used later in eslint reporting

                    var pathToMsgArgStart = void 0;
                    /* istanbul ignore else */

                    if (objectPath.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".type")) === "TemplateLiteral") {
                      rawPathToMsgArgValue = "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".quasis.0");
                      pathToMsgArgValue = objectPath.get(exprStatements[i], "".concat(rawPathToMsgArgValue, ".value.raw"));
                      pathToMsgArgStart = objectPath.get(exprStatements[i], "".concat(rawPathToMsgArgValue, ".start"));
                      counter2 += 1;
                    } else if (objectPath.get(exprStatements[i], "expression.arguments.".concat(messageArgsPositionWeWillAimFor, ".type")) === "Literal") {
                      rawPathToMsgArgValue = "expression.arguments.".concat(messageArgsPositionWeWillAimFor);
                      pathToMsgArgValue = objectPath.get(exprStatements[i], "".concat(rawPathToMsgArgValue, ".raw"));
                      pathToMsgArgStart = objectPath.get(exprStatements[i], "".concat(rawPathToMsgArgValue, ".start"));
                      counter2 += 1;
                    }

                    var _ref3 = prep(pathToMsgArgValue, {
                      offset: pathToMsgArgStart,
                      returnRangesOnly: true
                    }) || {},
                        start = _ref3.start,
                        end = _ref3.end;

                    if (!start || !end) {
                      // console.log(
                      //   `444 ${`\u001b[${31}m${`SKIP`}\u001b[${39}m`} - no value extracted`
                      // );
                      return "continue";
                    } // console.log(
                    //   `450 old: ${`\u001b[${35}m${pathToMsgArgValue}\u001b[${39}m`} (pathToMsgArgValue)`
                    // );
                    // console.log(
                    //   `453 old prepped value: ${`\u001b[${35}m${
                    //     prep(pathToMsgArgValue).value
                    //   }\u001b[${39}m`}`
                    // );


                    var newValue = getNewValue(subTestCount, testOrderNumber, counter2); // console.log(
                    //   `465 new: ${`\u001b[${35}m${newValue}\u001b[${39}m`}  range: ${`\u001b[${35}m${`[${start}, ${end}]`}\u001b[${39}m`}`
                    // );

                    if (prep(pathToMsgArgValue).value !== newValue) {
                      // console.log(
                      //   `470 ${`\u001b[${31}m${`MISMATCH!`}\u001b[${39}m`} reporting range [${start}, ${end}] to replace with a new value "${`\u001b[${35}m${newValue}\u001b[${39}m`}"`
                      // );
                      context.report({
                        node: objectPath.get(exprStatements[i], rawPathToMsgArgValue),
                        messageId: "correctTestNum",
                        fix: function fix(fixerObj) {
                          return fixerObj.replaceTextRange([start, end], newValue);
                        }
                      });
                    }
                  }();

                  if (_ret === "continue") continue;
                } else {
                  // console.log(
                  //   `482 ${`\u001b[${31}m${`message argument missing from assertion!`}\u001b[${39}m`}`
                  // );
                  // First, find out at which index position should message
                  // argument be on this given assertion. Keep in mind, there
                  // can be wrong args present at desired argument position or not
                  // enough arguments to reach that argument position
                  var positionDecided = void 0;

                  if ( // if assert's API takes three input arguments, the last arg
                  // being the message's value
                  messageIsThirdArg.has(assertsName) && // there are two arguments currently present in this assert
                  Array.isArray(objectPath.get(exprStatements[i], "expression.arguments")) && objectPath.get(exprStatements[i], "expression.arguments").length === 2) {
                    positionDecided = 2; // counting from zero, means 3rd in a row
                  } else if (messageIsSecondArg.has(assertsName) && Array.isArray(objectPath.get(exprStatements[i], "expression.arguments")) && objectPath.get(exprStatements[i], "expression.arguments").length === 1) {
                    positionDecided = 1; // counting from zero, means 2nd in a row
                  }

                  if (positionDecided) {
                    (function () {
                      // console.log(
                      //   `514 ${`\u001b[${32}m${`DECIDED!`}\u001b[${39}m`} We'll insert arg at position: ${`\u001b[${33}m${`positionDecided`}\u001b[${39}m`} = ${stringify(
                      //     positionDecided,
                      //     null,
                      //     4
                      //   )}`
                      // );
                      // insert the value
                      var positionToInsertAt = objectPath.get(exprStatements[i], "expression.end") - 1; // console.log(
                      //   `525 ${`\u001b[${35}m${`██`}\u001b[${39}m`} positionToInsertAt = ${positionToInsertAt}`
                      // );

                      var newValue = getNewValue(subTestCount, testOrderNumber, counter2); // there might be whitespace, so comma we're about to add
                      // must sit on a different line!!!

                      var wholeSourceStr = context.getSourceCode().getText();
                      var endIdx = positionToInsertAt; // left() finds the index of the first non-whitespace on the
                      // left, then we add +1 to not include it

                      var startIdx = left(wholeSourceStr, endIdx) + 1; // console.log(
                      //   `544 SET ${`\u001b[${33}m${`startIdx`}\u001b[${39}m`} = ${JSON.stringify(
                      //     startIdx,
                      //     null,
                      //     4
                      //   )}`
                      // );

                      var valueToInsert = ", \"".concat(newValue, "\"");

                      if ( // if there's a linebreak between closing bracket inside
                      // the assetion and the last expression statement
                      // imagine:
                      // t.match(
                      //   resIn,
                      //   {
                      //     fixed: true,
                      //     output: read("out"),
                      //   },
                      //   "01.01" <----- we're about to add this line and that comma
                      // );
                      wholeSourceStr.slice(startIdx, endIdx).includes("\n")) {
                        // console.log(`569 we've got a multi-line case`);
                        // console.log(`570 slice [${startIdx}, ${endIdx}]`);
                        var frontalIndentation = Array.from(wholeSourceStr.slice(startIdx, endIdx)).filter(function (char) {
                          return !"\r\n".includes(char);
                        }).join("");
                        valueToInsert = ",\n".concat(frontalIndentation, "  \"").concat(newValue, "\"\n").concat(frontalIndentation);
                      } // console.log(
                      //   `581 ${`\u001b[${32}m${`REPORT`}\u001b[${39}m`} ${JSON.stringify(
                      //     [startIdx, endIdx, valueToInsert],
                      //     null,
                      //     4
                      //   )}`
                      // );


                      context.report({
                        node: exprStatements[i],
                        messageId: "correctTestNum",
                        fix: function fix(fixerObj) {
                          return fixerObj.replaceTextRange([startIdx, endIdx], valueToInsert);
                        }
                      });
                    })();
                  }
                }
              } // console.log(
              //   `606 ${`\u001b[${90}m${`=================================`}\u001b[${39}m`}`
              // );

            }
          } // console.log(" ");


          if (finalDigitChunk) {
            // console.log(
            //   `615 ${`\u001b[${31}m${`MISMATCH!`}\u001b[${39}m`} reporting range [${
            //     finalDigitChunk.start
            //   }, ${
            //     finalDigitChunk.end
            //   }] to replace with a new value "${`\u001b[${35}m${
            //     finalDigitChunk.value
            //   }\u001b[${39}m`}"`
            // );

            /* istanbul ignore next */
            context.report({
              messageId: "correctTestNum",
              node: finalDigitChunk.node || node,
              fix: function fix(fixerObj) {
                return fixerObj.replaceTextRange([finalDigitChunk.start, finalDigitChunk.end], finalDigitChunk.value);
              }
            });
          }
        }
      }
    };
  };

  var correctTestNum = {
    create: create,
    meta: {
      // docs: {
      //   url: getDocumentationUrl(__filename),
      // },
      type: "suggestion",
      messages: {
        correctTestNum: "Update the test number."
      },
      fixable: "code" // or "code" or "whitespace"

    }
  };

  var main = {
    configs: {
      recommended: {
        plugins: ["test-num"],
        rules: {
          "no-console": "off",
          "test-num/correct-test-num": "error"
        }
      }
    },
    rules: {
      "correct-test-num": correctTestNum
    }
  };

  return main;

})));
