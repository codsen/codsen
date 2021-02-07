/**
 * ast-deep-contains
 * Like t.same assert on array of objects, where element order doesn't matter.
 * Version: 3.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-deep-contains/
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.astDeepContains = {}));
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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
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

      var hasShallowProperty;

      if (options.includeInheritedProps) {
        hasShallowProperty = function hasShallowProperty() {
          return true;
        };
      } else {
        hasShallowProperty = function hasShallowProperty(obj, prop) {
          return typeof prop === 'number' && Array.isArray(obj) || hasOwnProperty(obj, prop);
        };
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

        if (options.includeInheritedProps && (currentPath === '__proto__' || currentPath === 'constructor' && typeof currentValue === 'function')) {
          throw new Error('For security reasons, object\'s magic properties cannot be set');
        }

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
 * ast-monkey-util
 * Utility library of AST helper functions
 * Version: 1.3.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-util/
 */
// "a" => null
// "0" => null
// "a.b" => "a"
// "a.0" => "a"
// "a.0.c" => "0"


function parent(str) {
  // input must have at least one dot:
  if (str.includes(".")) {
    var lastDotAt = str.lastIndexOf(".");

    if (!str.slice(0, lastDotAt).includes(".")) {
      return str.slice(0, lastDotAt);
    }

    for (var i = lastDotAt - 1; i--;) {
      if (str[i] === ".") {
        return str.slice(i + 1, lastDotAt);
      }
    }
  }

  return null;
}

/**
 * Utility library to traverse AST
 */

function traverse(tree1, cb1) {
  var stop2 = {
    now: false
  }; //
  // traverseInner() needs a wrapper to shield the last two input args from the outside
  //

  function traverseInner(treeOriginal, callback, originalInnerObj, stop) {
    var tree = lodash_clonedeep(treeOriginal);
    var res;

    var innerObj = _objectSpread2({
      depth: -1,
      path: ""
    }, originalInnerObj);

    innerObj.depth += 1;

    if (Array.isArray(tree)) {
      for (var i = 0, len = tree.length; i < len; i++) {
        if (stop.now) {
          break;
        }

        var path = innerObj.path ? innerObj.path + "." + i : "" + i;

        if (tree[i] !== undefined) {
          innerObj.parent = lodash_clonedeep(tree);
          innerObj.parentType = "array";
          innerObj.parentKey = parent(path); // innerObj.path = `${innerObj.path}[${i}]`

          res = traverseInner(callback(tree[i], undefined, _objectSpread2(_objectSpread2({}, innerObj), {}, {
            path: path
          }), stop), callback, _objectSpread2(_objectSpread2({}, innerObj), {}, {
            path: path
          }), stop);

          if (Number.isNaN(res) && i < tree.length) {
            tree.splice(i, 1);
            i -= 1;
          } else {
            tree[i] = res;
          }
        } else {
          tree.splice(i, 1);
        }
      }
    } else if (lodash_isplainobject(tree)) {
      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (var key in tree) {
        if (stop.now && key != null) {
          break;
        }

        var _path = innerObj.path ? innerObj.path + "." + key : key;

        if (innerObj.depth === 0 && key != null) {
          innerObj.topmostKey = key;
        }

        innerObj.parent = lodash_clonedeep(tree);
        innerObj.parentType = "object";
        innerObj.parentKey = parent(_path);
        res = traverseInner(callback(key, tree[key], _objectSpread2(_objectSpread2({}, innerObj), {}, {
          path: _path
        }), stop), callback, _objectSpread2(_objectSpread2({}, innerObj), {}, {
          path: _path
        }), stop);

        if (Number.isNaN(res)) {
          delete tree[key];
        } else {
          tree[key] = res;
        }
      }
    }

    return tree;
  }

  return traverseInner(tree1, cb1, {}, stop2);
} // -----------------------------------------------------------------------------

var dist = createCommonjsModule(function (module, exports) {
  /// <reference lib="dom"/>
  /// <reference types="node"/>

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var typedArrayTypeNames = ['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array'];

  function isTypedArrayName(name) {
    return typedArrayTypeNames.includes(name);
  }

  var objectTypeNames = ['Function', 'Generator', 'AsyncGenerator', 'GeneratorFunction', 'AsyncGeneratorFunction', 'AsyncFunction', 'Observable', 'Array', 'Buffer', 'Object', 'RegExp', 'Date', 'Error', 'Map', 'Set', 'WeakMap', 'WeakSet', 'ArrayBuffer', 'SharedArrayBuffer', 'DataView', 'Promise', 'URL', 'HTMLElement'].concat(typedArrayTypeNames);

  function isObjectTypeName(name) {
    return objectTypeNames.includes(name);
  }

  var primitiveTypeNames = ['null', 'undefined', 'string', 'number', 'bigint', 'boolean', 'symbol'];

  function isPrimitiveTypeName(name) {
    return primitiveTypeNames.includes(name);
  } // eslint-disable-next-line @typescript-eslint/ban-types


  function isOfType(type) {
    return function (value) {
      return typeof value === type;
    };
  }

  var toString = Object.prototype.toString;

  var getObjectType = function getObjectType(value) {
    var objectTypeName = toString.call(value).slice(8, -1);

    if (/HTML\w+Element/.test(objectTypeName) && is.domElement(value)) {
      return 'HTMLElement';
    }

    if (isObjectTypeName(objectTypeName)) {
      return objectTypeName;
    }

    return undefined;
  };

  var isObjectOfType = function isObjectOfType(type) {
    return function (value) {
      return getObjectType(value) === type;
    };
  };

  function is(value) {
    if (value === null) {
      return 'null';
    }

    switch (typeof value) {
      case 'undefined':
        return 'undefined';

      case 'string':
        return 'string';

      case 'number':
        return 'number';

      case 'boolean':
        return 'boolean';

      case 'function':
        return 'Function';

      case 'bigint':
        return 'bigint';

      case 'symbol':
        return 'symbol';
    }

    if (is.observable(value)) {
      return 'Observable';
    }

    if (is.array(value)) {
      return 'Array';
    }

    if (is.buffer(value)) {
      return 'Buffer';
    }

    var tagType = getObjectType(value);

    if (tagType) {
      return tagType;
    }

    if (value instanceof String || value instanceof Boolean || value instanceof Number) {
      throw new TypeError('Please don\'t use object wrappers for primitive types');
    }

    return 'Object';
  }

  is.undefined = isOfType('undefined');
  is.string = isOfType('string');
  var isNumberType = isOfType('number');

  is.number = function (value) {
    return isNumberType(value) && !is.nan(value);
  };

  is.bigint = isOfType('bigint'); // eslint-disable-next-line @typescript-eslint/ban-types

  is.function_ = isOfType('function');

  is.null_ = function (value) {
    return value === null;
  };

  is.class_ = function (value) {
    return is.function_(value) && value.toString().startsWith('class ');
  };

  is.boolean = function (value) {
    return value === true || value === false;
  };

  is.symbol = isOfType('symbol');

  is.numericString = function (value) {
    return is.string(value) && !is.emptyStringOrWhitespace(value) && !Number.isNaN(Number(value));
  };

  is.array = function (value, assertion) {
    if (!Array.isArray(value)) {
      return false;
    }

    if (!is.function_(assertion)) {
      return true;
    }

    return value.every(assertion);
  };

  is.buffer = function (value) {
    var _a, _b, _c, _d;

    return (_d = (_c = (_b = (_a = value) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.isBuffer) === null || _c === void 0 ? void 0 : _c.call(_b, value)) !== null && _d !== void 0 ? _d : false;
  };

  is.nullOrUndefined = function (value) {
    return is.null_(value) || is.undefined(value);
  };

  is.object = function (value) {
    return !is.null_(value) && (typeof value === 'object' || is.function_(value));
  };

  is.iterable = function (value) {
    var _a;

    return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a[Symbol.iterator]);
  };

  is.asyncIterable = function (value) {
    var _a;

    return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a[Symbol.asyncIterator]);
  };

  is.generator = function (value) {
    return is.iterable(value) && is.function_(value.next) && is.function_(value.throw);
  };

  is.asyncGenerator = function (value) {
    return is.asyncIterable(value) && is.function_(value.next) && is.function_(value.throw);
  };

  is.nativePromise = function (value) {
    return isObjectOfType('Promise')(value);
  };

  var hasPromiseAPI = function hasPromiseAPI(value) {
    var _a, _b;

    return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a.then) && is.function_((_b = value) === null || _b === void 0 ? void 0 : _b.catch);
  };

  is.promise = function (value) {
    return is.nativePromise(value) || hasPromiseAPI(value);
  };

  is.generatorFunction = isObjectOfType('GeneratorFunction');

  is.asyncGeneratorFunction = function (value) {
    return getObjectType(value) === 'AsyncGeneratorFunction';
  };

  is.asyncFunction = function (value) {
    return getObjectType(value) === 'AsyncFunction';
  }; // eslint-disable-next-line no-prototype-builtins, @typescript-eslint/ban-types


  is.boundFunction = function (value) {
    return is.function_(value) && !value.hasOwnProperty('prototype');
  };

  is.regExp = isObjectOfType('RegExp');
  is.date = isObjectOfType('Date');
  is.error = isObjectOfType('Error');

  is.map = function (value) {
    return isObjectOfType('Map')(value);
  };

  is.set = function (value) {
    return isObjectOfType('Set')(value);
  };

  is.weakMap = function (value) {
    return isObjectOfType('WeakMap')(value);
  };

  is.weakSet = function (value) {
    return isObjectOfType('WeakSet')(value);
  };

  is.int8Array = isObjectOfType('Int8Array');
  is.uint8Array = isObjectOfType('Uint8Array');
  is.uint8ClampedArray = isObjectOfType('Uint8ClampedArray');
  is.int16Array = isObjectOfType('Int16Array');
  is.uint16Array = isObjectOfType('Uint16Array');
  is.int32Array = isObjectOfType('Int32Array');
  is.uint32Array = isObjectOfType('Uint32Array');
  is.float32Array = isObjectOfType('Float32Array');
  is.float64Array = isObjectOfType('Float64Array');
  is.bigInt64Array = isObjectOfType('BigInt64Array');
  is.bigUint64Array = isObjectOfType('BigUint64Array');
  is.arrayBuffer = isObjectOfType('ArrayBuffer');
  is.sharedArrayBuffer = isObjectOfType('SharedArrayBuffer');
  is.dataView = isObjectOfType('DataView');

  is.directInstanceOf = function (instance, class_) {
    return Object.getPrototypeOf(instance) === class_.prototype;
  };

  is.urlInstance = function (value) {
    return isObjectOfType('URL')(value);
  };

  is.urlString = function (value) {
    if (!is.string(value)) {
      return false;
    }

    try {
      new URL(value); // eslint-disable-line no-new

      return true;
    } catch (_a) {
      return false;
    }
  }; // TODO: Use the `not` operator with a type guard here when it's available.
  // Example: `is.truthy = (value: unknown): value is (not false | not 0 | not '' | not undefined | not null) => Boolean(value);`


  is.truthy = function (value) {
    return Boolean(value);
  }; // Example: `is.falsy = (value: unknown): value is (not true | 0 | '' | undefined | null) => Boolean(value);`


  is.falsy = function (value) {
    return !value;
  };

  is.nan = function (value) {
    return Number.isNaN(value);
  };

  is.primitive = function (value) {
    return is.null_(value) || isPrimitiveTypeName(typeof value);
  };

  is.integer = function (value) {
    return Number.isInteger(value);
  };

  is.safeInteger = function (value) {
    return Number.isSafeInteger(value);
  };

  is.plainObject = function (value) {
    // From: https://github.com/sindresorhus/is-plain-obj/blob/master/index.js
    if (toString.call(value) !== '[object Object]') {
      return false;
    }

    var prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.getPrototypeOf({});
  };

  is.typedArray = function (value) {
    return isTypedArrayName(getObjectType(value));
  };

  var isValidLength = function isValidLength(value) {
    return is.safeInteger(value) && value >= 0;
  };

  is.arrayLike = function (value) {
    return !is.nullOrUndefined(value) && !is.function_(value) && isValidLength(value.length);
  };

  is.inRange = function (value, range) {
    if (is.number(range)) {
      return value >= Math.min(0, range) && value <= Math.max(range, 0);
    }

    if (is.array(range) && range.length === 2) {
      return value >= Math.min.apply(Math, range) && value <= Math.max.apply(Math, range);
    }

    throw new TypeError("Invalid range: " + JSON.stringify(range));
  };

  var NODE_TYPE_ELEMENT = 1;
  var DOM_PROPERTIES_TO_CHECK = ['innerHTML', 'ownerDocument', 'style', 'attributes', 'nodeValue'];

  is.domElement = function (value) {
    return is.object(value) && value.nodeType === NODE_TYPE_ELEMENT && is.string(value.nodeName) && !is.plainObject(value) && DOM_PROPERTIES_TO_CHECK.every(function (property) {
      return property in value;
    });
  };

  is.observable = function (value) {
    var _a, _b, _c, _d;

    if (!value) {
      return false;
    } // eslint-disable-next-line no-use-extend-native/no-use-extend-native


    if (value === ((_b = (_a = value)[Symbol.observable]) === null || _b === void 0 ? void 0 : _b.call(_a))) {
      return true;
    }

    if (value === ((_d = (_c = value)['@@observable']) === null || _d === void 0 ? void 0 : _d.call(_c))) {
      return true;
    }

    return false;
  };

  is.nodeStream = function (value) {
    return is.object(value) && is.function_(value.pipe) && !is.observable(value);
  };

  is.infinite = function (value) {
    return value === Infinity || value === -Infinity;
  };

  var isAbsoluteMod2 = function isAbsoluteMod2(remainder) {
    return function (value) {
      return is.integer(value) && Math.abs(value % 2) === remainder;
    };
  };

  is.evenInteger = isAbsoluteMod2(0);
  is.oddInteger = isAbsoluteMod2(1);

  is.emptyArray = function (value) {
    return is.array(value) && value.length === 0;
  };

  is.nonEmptyArray = function (value) {
    return is.array(value) && value.length > 0;
  };

  is.emptyString = function (value) {
    return is.string(value) && value.length === 0;
  }; // TODO: Use `not ''` when the `not` operator is available.


  is.nonEmptyString = function (value) {
    return is.string(value) && value.length > 0;
  };

  var isWhiteSpaceString = function isWhiteSpaceString(value) {
    return is.string(value) && !/\S/.test(value);
  };

  is.emptyStringOrWhitespace = function (value) {
    return is.emptyString(value) || isWhiteSpaceString(value);
  };

  is.emptyObject = function (value) {
    return is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length === 0;
  }; // TODO: Use `not` operator here to remove `Map` and `Set` from type guard:
  // - https://github.com/Microsoft/TypeScript/pull/29317


  is.nonEmptyObject = function (value) {
    return is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length > 0;
  };

  is.emptySet = function (value) {
    return is.set(value) && value.size === 0;
  };

  is.nonEmptySet = function (value) {
    return is.set(value) && value.size > 0;
  };

  is.emptyMap = function (value) {
    return is.map(value) && value.size === 0;
  };

  is.nonEmptyMap = function (value) {
    return is.map(value) && value.size > 0;
  };

  var predicateOnArray = function predicateOnArray(method, predicate, values) {
    if (!is.function_(predicate)) {
      throw new TypeError("Invalid predicate: " + JSON.stringify(predicate));
    }

    if (values.length === 0) {
      throw new TypeError('Invalid number of values');
    }

    return method.call(values, predicate);
  };

  is.any = function (predicate) {
    for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    var predicates = is.array(predicate) ? predicate : [predicate];
    return predicates.some(function (singlePredicate) {
      return predicateOnArray(Array.prototype.some, singlePredicate, values);
    });
  };

  is.all = function (predicate) {
    for (var _len2 = arguments.length, values = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      values[_key2 - 1] = arguments[_key2];
    }

    return predicateOnArray(Array.prototype.every, predicate, values);
  };

  var assertType = function assertType(condition, description, value) {
    if (!condition) {
      throw new TypeError("Expected value which is `" + description + "`, received value of type `" + is(value) + "`.");
    }
  };

  exports.assert = {
    // Unknowns.
    undefined: function undefined$1(value) {
      return assertType(is.undefined(value), 'undefined', value);
    },
    string: function string(value) {
      return assertType(is.string(value), 'string', value);
    },
    number: function number(value) {
      return assertType(is.number(value), 'number', value);
    },
    bigint: function bigint(value) {
      return assertType(is.bigint(value), 'bigint', value);
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    function_: function function_(value) {
      return assertType(is.function_(value), 'Function', value);
    },
    null_: function null_(value) {
      return assertType(is.null_(value), 'null', value);
    },
    class_: function class_(value) {
      return assertType(is.class_(value), "Class"
      /* class_ */
      , value);
    },
    boolean: function boolean(value) {
      return assertType(is.boolean(value), 'boolean', value);
    },
    symbol: function symbol(value) {
      return assertType(is.symbol(value), 'symbol', value);
    },
    numericString: function numericString(value) {
      return assertType(is.numericString(value), "string with a number"
      /* numericString */
      , value);
    },
    array: function array(value, assertion) {
      var assert = assertType;
      assert(is.array(value), 'Array', value);

      if (assertion) {
        value.forEach(assertion);
      }
    },
    buffer: function buffer(value) {
      return assertType(is.buffer(value), 'Buffer', value);
    },
    nullOrUndefined: function nullOrUndefined(value) {
      return assertType(is.nullOrUndefined(value), "null or undefined"
      /* nullOrUndefined */
      , value);
    },
    object: function object(value) {
      return assertType(is.object(value), 'Object', value);
    },
    iterable: function iterable(value) {
      return assertType(is.iterable(value), "Iterable"
      /* iterable */
      , value);
    },
    asyncIterable: function asyncIterable(value) {
      return assertType(is.asyncIterable(value), "AsyncIterable"
      /* asyncIterable */
      , value);
    },
    generator: function generator(value) {
      return assertType(is.generator(value), 'Generator', value);
    },
    asyncGenerator: function asyncGenerator(value) {
      return assertType(is.asyncGenerator(value), 'AsyncGenerator', value);
    },
    nativePromise: function nativePromise(value) {
      return assertType(is.nativePromise(value), "native Promise"
      /* nativePromise */
      , value);
    },
    promise: function promise(value) {
      return assertType(is.promise(value), 'Promise', value);
    },
    generatorFunction: function generatorFunction(value) {
      return assertType(is.generatorFunction(value), 'GeneratorFunction', value);
    },
    asyncGeneratorFunction: function asyncGeneratorFunction(value) {
      return assertType(is.asyncGeneratorFunction(value), 'AsyncGeneratorFunction', value);
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    asyncFunction: function asyncFunction(value) {
      return assertType(is.asyncFunction(value), 'AsyncFunction', value);
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    boundFunction: function boundFunction(value) {
      return assertType(is.boundFunction(value), 'Function', value);
    },
    regExp: function regExp(value) {
      return assertType(is.regExp(value), 'RegExp', value);
    },
    date: function date(value) {
      return assertType(is.date(value), 'Date', value);
    },
    error: function error(value) {
      return assertType(is.error(value), 'Error', value);
    },
    map: function map(value) {
      return assertType(is.map(value), 'Map', value);
    },
    set: function set(value) {
      return assertType(is.set(value), 'Set', value);
    },
    weakMap: function weakMap(value) {
      return assertType(is.weakMap(value), 'WeakMap', value);
    },
    weakSet: function weakSet(value) {
      return assertType(is.weakSet(value), 'WeakSet', value);
    },
    int8Array: function int8Array(value) {
      return assertType(is.int8Array(value), 'Int8Array', value);
    },
    uint8Array: function uint8Array(value) {
      return assertType(is.uint8Array(value), 'Uint8Array', value);
    },
    uint8ClampedArray: function uint8ClampedArray(value) {
      return assertType(is.uint8ClampedArray(value), 'Uint8ClampedArray', value);
    },
    int16Array: function int16Array(value) {
      return assertType(is.int16Array(value), 'Int16Array', value);
    },
    uint16Array: function uint16Array(value) {
      return assertType(is.uint16Array(value), 'Uint16Array', value);
    },
    int32Array: function int32Array(value) {
      return assertType(is.int32Array(value), 'Int32Array', value);
    },
    uint32Array: function uint32Array(value) {
      return assertType(is.uint32Array(value), 'Uint32Array', value);
    },
    float32Array: function float32Array(value) {
      return assertType(is.float32Array(value), 'Float32Array', value);
    },
    float64Array: function float64Array(value) {
      return assertType(is.float64Array(value), 'Float64Array', value);
    },
    bigInt64Array: function bigInt64Array(value) {
      return assertType(is.bigInt64Array(value), 'BigInt64Array', value);
    },
    bigUint64Array: function bigUint64Array(value) {
      return assertType(is.bigUint64Array(value), 'BigUint64Array', value);
    },
    arrayBuffer: function arrayBuffer(value) {
      return assertType(is.arrayBuffer(value), 'ArrayBuffer', value);
    },
    sharedArrayBuffer: function sharedArrayBuffer(value) {
      return assertType(is.sharedArrayBuffer(value), 'SharedArrayBuffer', value);
    },
    dataView: function dataView(value) {
      return assertType(is.dataView(value), 'DataView', value);
    },
    urlInstance: function urlInstance(value) {
      return assertType(is.urlInstance(value), 'URL', value);
    },
    urlString: function urlString(value) {
      return assertType(is.urlString(value), "string with a URL"
      /* urlString */
      , value);
    },
    truthy: function truthy(value) {
      return assertType(is.truthy(value), "truthy"
      /* truthy */
      , value);
    },
    falsy: function falsy(value) {
      return assertType(is.falsy(value), "falsy"
      /* falsy */
      , value);
    },
    nan: function nan(value) {
      return assertType(is.nan(value), "NaN"
      /* nan */
      , value);
    },
    primitive: function primitive(value) {
      return assertType(is.primitive(value), "primitive"
      /* primitive */
      , value);
    },
    integer: function integer(value) {
      return assertType(is.integer(value), "integer"
      /* integer */
      , value);
    },
    safeInteger: function safeInteger(value) {
      return assertType(is.safeInteger(value), "integer"
      /* safeInteger */
      , value);
    },
    plainObject: function plainObject(value) {
      return assertType(is.plainObject(value), "plain object"
      /* plainObject */
      , value);
    },
    typedArray: function typedArray(value) {
      return assertType(is.typedArray(value), "TypedArray"
      /* typedArray */
      , value);
    },
    arrayLike: function arrayLike(value) {
      return assertType(is.arrayLike(value), "array-like"
      /* arrayLike */
      , value);
    },
    domElement: function domElement(value) {
      return assertType(is.domElement(value), "HTMLElement"
      /* domElement */
      , value);
    },
    observable: function observable(value) {
      return assertType(is.observable(value), 'Observable', value);
    },
    nodeStream: function nodeStream(value) {
      return assertType(is.nodeStream(value), "Node.js Stream"
      /* nodeStream */
      , value);
    },
    infinite: function infinite(value) {
      return assertType(is.infinite(value), "infinite number"
      /* infinite */
      , value);
    },
    emptyArray: function emptyArray(value) {
      return assertType(is.emptyArray(value), "empty array"
      /* emptyArray */
      , value);
    },
    nonEmptyArray: function nonEmptyArray(value) {
      return assertType(is.nonEmptyArray(value), "non-empty array"
      /* nonEmptyArray */
      , value);
    },
    emptyString: function emptyString(value) {
      return assertType(is.emptyString(value), "empty string"
      /* emptyString */
      , value);
    },
    nonEmptyString: function nonEmptyString(value) {
      return assertType(is.nonEmptyString(value), "non-empty string"
      /* nonEmptyString */
      , value);
    },
    emptyStringOrWhitespace: function emptyStringOrWhitespace(value) {
      return assertType(is.emptyStringOrWhitespace(value), "empty string or whitespace"
      /* emptyStringOrWhitespace */
      , value);
    },
    emptyObject: function emptyObject(value) {
      return assertType(is.emptyObject(value), "empty object"
      /* emptyObject */
      , value);
    },
    nonEmptyObject: function nonEmptyObject(value) {
      return assertType(is.nonEmptyObject(value), "non-empty object"
      /* nonEmptyObject */
      , value);
    },
    emptySet: function emptySet(value) {
      return assertType(is.emptySet(value), "empty set"
      /* emptySet */
      , value);
    },
    nonEmptySet: function nonEmptySet(value) {
      return assertType(is.nonEmptySet(value), "non-empty set"
      /* nonEmptySet */
      , value);
    },
    emptyMap: function emptyMap(value) {
      return assertType(is.emptyMap(value), "empty map"
      /* emptyMap */
      , value);
    },
    nonEmptyMap: function nonEmptyMap(value) {
      return assertType(is.nonEmptyMap(value), "non-empty map"
      /* nonEmptyMap */
      , value);
    },
    // Numbers.
    evenInteger: function evenInteger(value) {
      return assertType(is.evenInteger(value), "even integer"
      /* evenInteger */
      , value);
    },
    oddInteger: function oddInteger(value) {
      return assertType(is.oddInteger(value), "odd integer"
      /* oddInteger */
      , value);
    },
    // Two arguments.
    directInstanceOf: function directInstanceOf(instance, class_) {
      return assertType(is.directInstanceOf(instance, class_), "T"
      /* directInstanceOf */
      , instance);
    },
    inRange: function inRange(value, range) {
      return assertType(is.inRange(value, range), "in range"
      /* inRange */
      , value);
    },
    // Variadic functions.
    any: function any(predicate) {
      for (var _len3 = arguments.length, values = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        values[_key3 - 1] = arguments[_key3];
      }

      return assertType(is.any.apply(is, [predicate].concat(values)), "predicate returns truthy for any value"
      /* any */
      , values);
    },
    all: function all(predicate) {
      for (var _len4 = arguments.length, values = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        values[_key4 - 1] = arguments[_key4];
      }

      return assertType(is.all.apply(is, [predicate].concat(values)), "predicate returns truthy for all values"
      /* all */
      , values);
    }
  }; // Some few keywords are reserved, but we'll populate them for Node.js users
  // See https://github.com/Microsoft/TypeScript/issues/2536

  Object.defineProperties(is, {
    class: {
      value: is.class_
    },
    function: {
      value: is.function_
    },
    null: {
      value: is.null_
    }
  });
  Object.defineProperties(exports.assert, {
    class: {
      value: exports.assert.class_
    },
    function: {
      value: exports.assert.function_
    },
    null: {
      value: exports.assert.null_
    }
  });
  exports.default = is; // For CommonJS default export support

  module.exports = is;
  module.exports.default = is;
  module.exports.assert = exports.assert;
});
var is = /*@__PURE__*/getDefaultExportFromCjs(dist);

var version = "3.0.2";

var version$1 = version;

function goUp(pathStr) {
  // console.log(`014 goUp(): INCOMING pathStr = "${pathStr}"`);
  if (pathStr.includes(".")) {
    for (var i = pathStr.length; i--;) {
      if (pathStr[i] === ".") {
        // console.log(`017 goUp(): RETURN "${pathStr.slice(0, i)}"`);
        return pathStr.slice(0, i);
      }
    }
  } // console.log(`021 RETURN pathStr = "${pathStr}"`);


  return pathStr;
}

function dropIth(arr, badIdx) {
  return Array.from(arr).filter(function (_el, i) {
    return i !== badIdx;
  });
}

var defaults = {
  skipContainers: true,
  arrayStrictComparison: false
};
/**
 * Like t.same assert on array of objects, where element order doesn't matter.
 */

function deepContains(tree1, tree2, cb, errCb, originalOpts) {
  var opts = _objectSpread2(_objectSpread2({}, defaults), originalOpts);

  if (is(tree1) !== is(tree2)) {
    errCb("the first input arg is of a type " + is(tree1).toLowerCase() + " but the second is " + is(tree2).toLowerCase() + ". Values are - 1st:\n" + JSON.stringify(tree1, null, 4) + "\n2nd:\n" + JSON.stringify(tree2, null, 4));
  } else {
    // release AST monkey to traverse tree2, check each node's presence in tree1
    traverse(tree2, function (key, val, innerObj, stop) {
      var current = val !== undefined ? val : key;
      var path = innerObj.path; // retrieve the path of the current node from the monkey // console.log(
      //   `061 ${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
      //     innerObj,
      //     null,
      //     4
      //   )}; typeof current = "${typeof current}"`
      // );

      if (objectPath.has(tree1, path)) {

        if (!opts.arrayStrictComparison && is.plainObject(current) && innerObj.parentType === "array" && innerObj.parent.length > 1) {
          (function () { // stop the monkey, we'll go further recursively

            stop.now = true;
            var arr1 = Array.from(innerObj.path.includes(".") ? objectPath.get(tree1, goUp(path)) : tree1);

            if (arr1.length < innerObj.parent.length) {
              // source array from tree1 has less elements than array from tree2!
              // It will not be possible to match them all!
              errCb("the first array: " + JSON.stringify(arr1, null, 4) + "\nhas less objects than array we're matching against, " + JSON.stringify(innerObj.parent, null, 4));
            } else {
              (function () {
                var arr2 = innerObj.parent; // we extract just indexes:

                var tree1RefSource = arr1.map(function (_v, i) {
                  return i;
                });
                arr2.map(function (_v, i) {
                  return i;
                }); // [0, 1, 2] for example.
                // We'll use them to calculate combinations, as in 1st object in tree2
                // array against 2nd object in tree1 array... // Challenge: Array of objects is compared to another array of objects.
                // Order is mixed, the intended object is actually slightly off,
                // it's wrong, test runners will flag it, but we still need to pinpoint which
                // object did user intend to match against.
                // Outcome: we can't use strict comparison or even assume that anything
                // will be matching. The real world bar is the following: we need to
                // calculate which object is the most resembling which.
                //
                //
                // Plan: let's generate the table combinations of each table vs. each
                // table. Think about 3 vs. 2 compares:
                // deepContains(
                //   [
                //       { key1: "a", key2: "b" },
                //       { key1: "k", key2: "l" }, <---- we'd ignore this
                //       { key1: "x", key2: "y" }
                //   ],
                //   [
                //       { key1: "x", key2: "y" }, <---- notice, the order
                //       { key1: "a", key2: "b" }  <---- is wrong
                //   ]
                //
                //  Once we have table of all combinations, we'll calculate the
                // likeness score of each combination, and whichever is the highest
                // we'll ping those objects to user-supplied (likely AVA's t.equal()) callback.
                //
                // We want to achieve something like this (using example above):
                // [[0, 0], [1, 1]]
                // [[0, 0], [1, 2]]
                //
                // [[0, 1], [1, 0]]
                // [[0, 1], [1, 2]]
                //
                // [[0, 2], [1, 0]]
                // [[0, 2], [1, 1]]
                // where [[0, 0], [1, 1]] means:
                // [
                //   [ index 0 from tree2, index 0 from tree1 ]
                //   [ index 1 from tree2, index 1 from tree1 ]
                // ]
                // We'll compose the combinations array from two parts:
                // The first digits are following "tree2RefSource", the tree2 indexes.
                // The second digits are from iterating tree1, picking one and
                // iterating what's left for the second variation.
                // TODO:

                var secondDigits = []; // const secondDigits = [];

                var _loop = function _loop(i, len) {
                  var currArr = [];
                  var pickedVal = tree1RefSource[i];
                  var disposableArr1 = dropIth(tree1RefSource, i);
                  currArr.push(pickedVal); // iterate what's left

                  disposableArr1.forEach(function (key1) {
                    secondDigits.push(Array.from(currArr).concat(key1));
                  });
                };

                for (var i = 0, len = tree1RefSource.length; i < len; i++) {
                  _loop(i);
                }

                var finalCombined = secondDigits.map(function (arr) {
                  return arr.map(function (val2, i) {
                    return [i, val2];
                  });
                }); // now, use the "finalCombined" as a guidance which objects to match against which, and array-push the comparison score as third element into each. Whichever comparison gathers highest score, gets pinged to the callback.
                var maxScore = 0;

                for (var _i = 0, _len = finalCombined.length; _i < _len; _i++) {
                  var score = 0; // finalCombined[i] === something like [[0,0],[1,1]]
                  // tree1 array: arr1
                  // tree2 array: arr2

                  finalCombined[_i].forEach(function (mapping) {

                    if (is.plainObject(arr2[mapping[0]]) && is.plainObject(arr1[mapping[1]])) {
                      Object.keys(arr2[mapping[0]]).forEach(function (key2) {
                        if (Object.keys(arr1[mapping[1]]).includes(key2)) {
                          score += 1;

                          if (arr1[mapping[1]][key2] === arr2[mapping[0]][key2]) {
                            score += 5;
                          }
                        }
                      });
                    }
                  });

                  finalCombined[_i].push(score); // finally, push the score as 3rd arg. into mapping array

                  if (score > maxScore) {
                    maxScore = score;
                  }
                } // FINALLY, ping callbacks with the max score objects

                var _loop2 = function _loop2(_i2, _len2) {
                  if (finalCombined[_i2][2] === maxScore) {

                    finalCombined[_i2].forEach(function (matchPairObj, y) {
                      // beware score is the last element.
                      if (y < finalCombined[_i2].length - 1) {
                        // console.log(
                        //   `${`\u001b[${33}m${`matchPairObj`}\u001b[${39}m`} = ${JSON.stringify(
                        //     matchPairObj,
                        //     null,
                        //     4
                        //   )}`
                        // ); // ping object pairs recursively:

                        deepContains(arr1[matchPairObj[1]], arr2[matchPairObj[0]], cb, errCb, opts);
                      }
                    });

                    return "break";
                  }
                };

                for (var _i2 = 0, _len2 = finalCombined.length; _i2 < _len2; _i2++) {
                  var _ret = _loop2(_i2);

                  if (_ret === "break") break;
                } //

              })();
            }
          })();
        } else { // if tree1 has that path on tree2, call the callback

          var retrieved = objectPath.get(tree1, path);

          if (!opts.skipContainers || !is.plainObject(retrieved) && !Array.isArray(retrieved)) {
            cb(retrieved, current, path);
          }
        }
      } else {
        errCb("the first input: " + JSON.stringify(tree1, null, 4) + "\ndoes not have the path \"" + path + "\", we were looking, would it contain a value " + JSON.stringify(current, null, 0) + ".");
      }
      return current;
    });
  }
} // -----------------------------------------------------------------------------

exports.deepContains = deepContains;
exports.defaults = defaults;
exports.version = version$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
