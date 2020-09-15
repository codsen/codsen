/**
 * check-types-mini
 * Check the types of your options object's values after user has customised them
 * Version: 5.7.70
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/check-types-mini/
 */

'use strict';

var typ = require('type-detect');
var pullAll = require('lodash.pullall');
var traverse = require('ast-monkey-traverse');
var intersection = require('lodash.intersection');
var arrayiffyIfString = require('arrayiffy-if-string');
var objectPath = require('object-path');
var matcher = require('matcher');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var typ__default = /*#__PURE__*/_interopDefaultLegacy(typ);
var pullAll__default = /*#__PURE__*/_interopDefaultLegacy(pullAll);
var traverse__default = /*#__PURE__*/_interopDefaultLegacy(traverse);
var intersection__default = /*#__PURE__*/_interopDefaultLegacy(intersection);
var arrayiffyIfString__default = /*#__PURE__*/_interopDefaultLegacy(arrayiffyIfString);
var objectPath__default = /*#__PURE__*/_interopDefaultLegacy(objectPath);
var matcher__default = /*#__PURE__*/_interopDefaultLegacy(matcher);

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

function checkTypesMini(obj, ref, originalOptions) {
  var shouldWeCheckTheOpts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var hasKey = Object.prototype.hasOwnProperty;
  function existy(something) {
    return something != null;
  }
  function isObj(something) {
    return typ__default['default'](something) === "Object";
  }
  function pullAllWithGlob(originalInput, toBeRemoved) {
    toBeRemoved = arrayiffyIfString__default['default'](toBeRemoved);
    return Array.from(originalInput).filter(function (originalVal) {
      return !toBeRemoved.some(function (remVal) {
        return matcher__default['default'].isMatch(originalVal, remVal, {
          caseSensitive: true
        });
      });
    });
  }
  var NAMESFORANYTYPE = ["any", "anything", "every", "everything", "all", "whatever", "whatevs"];
  var isArr = Array.isArray;
  if (!existy(obj)) {
    throw new Error("check-types-mini: [THROW_ID_01] First argument is missing!");
  }
  var defaults = {
    ignoreKeys: [],
    ignorePaths: [],
    acceptArrays: false,
    acceptArraysIgnore: [],
    enforceStrictKeyset: true,
    schema: {},
    msg: "check-types-mini",
    optsVarName: "opts"
  };
  var opts;
  if (existy(originalOptions) && isObj(originalOptions)) {
    opts = _objectSpread2(_objectSpread2({}, defaults), originalOptions);
  } else {
    opts = _objectSpread2({}, defaults);
  }
  if (!existy(opts.ignoreKeys) || !opts.ignoreKeys) {
    opts.ignoreKeys = [];
  } else {
    opts.ignoreKeys = arrayiffyIfString__default['default'](opts.ignoreKeys);
  }
  if (!existy(opts.ignorePaths) || !opts.ignorePaths) {
    opts.ignorePaths = [];
  } else {
    opts.ignorePaths = arrayiffyIfString__default['default'](opts.ignorePaths);
  }
  if (!existy(opts.acceptArraysIgnore) || !opts.acceptArraysIgnore) {
    opts.acceptArraysIgnore = [];
  } else {
    opts.acceptArraysIgnore = arrayiffyIfString__default['default'](opts.acceptArraysIgnore);
  }
  opts.msg = typeof opts.msg === "string" ? opts.msg.trim() : opts.msg;
  if (opts.msg[opts.msg.length - 1] === ":") {
    opts.msg = opts.msg.slice(0, opts.msg.length - 1).trim();
  }
  if (opts.schema) {
    Object.keys(opts.schema).forEach(function (oneKey) {
      if (isObj(opts.schema[oneKey])) {
        var tempObj = {};
        traverse__default['default'](opts.schema[oneKey], function (key, val, innerObj) {
          var current = val !== undefined ? val : key;
          if (!isArr(current) && !isObj(current)) {
            tempObj["".concat(oneKey, ".").concat(innerObj.path)] = current;
          }
          return current;
        });
        delete opts.schema[oneKey];
        opts.schema = Object.assign(opts.schema, tempObj);
      }
    });
    Object.keys(opts.schema).forEach(function (oneKey) {
      if (!isArr(opts.schema[oneKey])) {
        opts.schema[oneKey] = [opts.schema[oneKey]];
      }
      opts.schema[oneKey] = opts.schema[oneKey].map(String).map(function (el) {
        return el.toLowerCase();
      }).map(function (el) {
        return el.trim();
      });
    });
  }
  if (!existy(ref)) {
    ref = {};
  }
  if (shouldWeCheckTheOpts) {
    checkTypesMini(opts, defaults, {
      enforceStrictKeyset: false
    }, false);
  }
  if (opts.enforceStrictKeyset) {
    if (existy(opts.schema) && Object.keys(opts.schema).length > 0) {
      if (pullAllWithGlob(pullAll__default['default'](Object.keys(obj), Object.keys(ref).concat(Object.keys(opts.schema))), opts.ignoreKeys).length !== 0) {
        var keys = pullAll__default['default'](Object.keys(obj), Object.keys(ref).concat(Object.keys(opts.schema)));
        throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".enforceStrictKeyset is on and the following key").concat(keys.length > 1 ? "s" : "", " ").concat(keys.length > 1 ? "are" : "is", " not covered by schema and/or reference objects: ").concat(keys.join(", ")));
      }
    } else if (existy(ref) && Object.keys(ref).length > 0) {
      if (pullAllWithGlob(pullAll__default['default'](Object.keys(obj), Object.keys(ref)), opts.ignoreKeys).length !== 0) {
        var _keys = pullAll__default['default'](Object.keys(obj), Object.keys(ref));
        throw new TypeError("".concat(opts.msg, ": The input object has key").concat(_keys.length > 1 ? "s" : "", " which ").concat(_keys.length > 1 ? "are" : "is", " not covered by the reference object: ").concat(_keys.join(", ")));
      } else if (pullAllWithGlob(pullAll__default['default'](Object.keys(ref), Object.keys(obj)), opts.ignoreKeys).length !== 0) {
        var _keys2 = pullAll__default['default'](Object.keys(ref), Object.keys(obj));
        throw new TypeError("".concat(opts.msg, ": The reference object has key").concat(_keys2.length > 1 ? "s" : "", " which ").concat(_keys2.length > 1 ? "are" : "is", " not present in the input object: ").concat(_keys2.join(", ")));
      }
    } else {
      throw new TypeError("".concat(opts.msg, ": Both ").concat(opts.optsVarName, ".schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!"));
    }
  }
  var ignoredPathsArr = [];
  traverse__default['default'](obj, function (key, val, innerObj) {
    var current = val;
    var objKey = key;
    if (innerObj.parentType === "array") {
      objKey = undefined;
      current = key;
    }
    if (isArr(ignoredPathsArr) && ignoredPathsArr.length && ignoredPathsArr.some(function (path) {
      return innerObj.path.startsWith(path);
    })) {
      return current;
    }
    if (objKey && opts.ignoreKeys.some(function (oneOfKeysToIgnore) {
      return matcher__default['default'].isMatch(objKey, oneOfKeysToIgnore);
    })) {
      return current;
    }
    if (opts.ignorePaths.some(function (oneOfPathsToIgnore) {
      return matcher__default['default'].isMatch(innerObj.path, oneOfPathsToIgnore);
    })) {
      return current;
    }
    var isNotAnArrayChild = !(!isObj(current) && !isArr(current) && isArr(innerObj.parent));
    var optsSchemaHasThisPathDefined = false;
    if (isObj(opts.schema) && hasKey.call(opts.schema, objectPath__default['default'].get(innerObj.path))) {
      optsSchemaHasThisPathDefined = true;
    }
    var refHasThisPathDefined = false;
    if (isObj(ref) && objectPath__default['default'].has(ref, objectPath__default['default'].get(innerObj.path))) {
      refHasThisPathDefined = true;
    }
    if (opts.enforceStrictKeyset && isNotAnArrayChild && !optsSchemaHasThisPathDefined && !refHasThisPathDefined) {
      throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, " is neither covered by reference object (second input argument), nor ").concat(opts.optsVarName, ".schema! To stop this error, turn off ").concat(opts.optsVarName, ".enforceStrictKeyset or provide some type reference (2nd argument or ").concat(opts.optsVarName, ".schema).\n\nDebug info:\n\nobj = ").concat(JSON.stringify(obj, null, 4), "\n\nref = ").concat(JSON.stringify(ref, null, 4), "\n\ninnerObj = ").concat(JSON.stringify(innerObj, null, 4), "\n\nopts = ").concat(JSON.stringify(opts, null, 4), "\n\ncurrent = ").concat(JSON.stringify(current, null, 4), "\n\n"));
    } else if (optsSchemaHasThisPathDefined) {
      var currentKeysSchema = arrayiffyIfString__default['default'](opts.schema[innerObj.path]).map(String).map(function (el) {
        return el.toLowerCase();
      });
      objectPath__default['default'].set(opts.schema, innerObj.path, currentKeysSchema);
      if (!intersection__default['default'](currentKeysSchema, NAMESFORANYTYPE).length) {
        if (current !== true && current !== false && !currentKeysSchema.includes(typ__default['default'](current).toLowerCase()) || (current === true || current === false) && !currentKeysSchema.includes(String(current)) && !currentKeysSchema.includes("boolean")) {
          if (isArr(current) && opts.acceptArrays) {
            for (var i = 0, len = current.length; i < len; i++) {
              if (!currentKeysSchema.includes(typ__default['default'](current[i]).toLowerCase())) {
                throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, ".").concat(i, ", the ").concat(i, "th element (equal to ").concat(JSON.stringify(current[i], null, 0), ") is of a type ").concat(typ__default['default'](current[i]).toLowerCase(), ", but only the following are allowed by the ").concat(opts.optsVarName, ".schema: ").concat(currentKeysSchema.join(", ")));
              }
            }
          } else {
            throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, " was customised to ").concat(typ__default['default'](current) !== "string" ? '"' : "").concat(JSON.stringify(current, null, 0)).concat(typ__default['default'](current) !== "string" ? '"' : "", " (type: ").concat(typ__default['default'](current).toLowerCase(), ") which is not among the allowed types in schema (which is equal to ").concat(JSON.stringify(currentKeysSchema, null, 0), ")"));
          }
        }
      } else {
        ignoredPathsArr.push(innerObj.path);
      }
    } else if (refHasThisPathDefined) {
      var compareTo = objectPath__default['default'].get(ref, innerObj.path);
      if (opts.acceptArrays && isArr(current) && !opts.acceptArraysIgnore.includes(key)) {
        var allMatch = current.every(function (el) {
          return typ__default['default'](el).toLowerCase() === typ__default['default'](ref[key]).toLowerCase();
        });
        if (!allMatch) {
          throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, " was customised to be array, but not all of its elements are ").concat(typ__default['default'](ref[key]).toLowerCase(), "-type"));
        }
      } else if (typ__default['default'](current) !== typ__default['default'](compareTo)) {
        throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, " was customised to ").concat(typ__default['default'](current).toLowerCase() === "string" ? "" : '"').concat(JSON.stringify(current, null, 0)).concat(typ__default['default'](current).toLowerCase() === "string" ? "" : '"', " which is not ").concat(typ__default['default'](compareTo).toLowerCase(), " but ").concat(typ__default['default'](current).toLowerCase()));
      }
    } else ;
    return current;
  });
}
function externalApi(obj, ref, originalOptions) {
  return checkTypesMini(obj, ref, originalOptions);
}

module.exports = externalApi;
