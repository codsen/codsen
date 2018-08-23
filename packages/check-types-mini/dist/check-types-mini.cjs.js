'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var typ = _interopDefault(require('type-detect'));
var pullAll = _interopDefault(require('lodash.pullall'));
var traverse = _interopDefault(require('ast-monkey-traverse'));
var intersection = _interopDefault(require('lodash.intersection'));
var arrayiffyIfString = _interopDefault(require('arrayiffy-if-string'));
var objectPath = _interopDefault(require('object-path'));
var ordinal = _interopDefault(require('ordinal'));
var matcher = _interopDefault(require('matcher'));

function checkTypesMini(obj, ref, originalOptions) {
  var shouldWeCheckTheOpts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  function existy(something) {
    return something != null;
  }
  function isObj(something) {
    return typ(something) === "Object";
  }
  function pullAllWithGlob(originalInput, toBeRemoved) {
    if (typeof toBeRemoved === "string") {
      toBeRemoved = [toBeRemoved];
    }
    return Array.from(originalInput).filter(function (originalVal) {
      return !toBeRemoved.some(function (remVal) {
        return matcher.isMatch(originalVal, remVal, {
          caseSensitive: true
        });
      });
    });
  }
  function goUpByOneLevel(path) {
    if (path.includes(".")) {
      var split = path.split(".");
      split.pop();
      return split.join(".");
    }
    return path;
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
    opts = Object.assign({}, defaults, originalOptions);
  } else {
    opts = Object.assign({}, defaults);
  }
  if (!existy(opts.ignoreKeys) || !opts.ignoreKeys) {
    opts.ignoreKeys = [];
  } else {
    opts.ignoreKeys = arrayiffyIfString(opts.ignoreKeys);
  }
  if (!existy(opts.ignorePaths) || !opts.ignorePaths) {
    opts.ignorePaths = [];
  } else {
    opts.ignorePaths = arrayiffyIfString(opts.ignorePaths);
  }
  if (!existy(opts.acceptArraysIgnore) || !opts.acceptArraysIgnore) {
    opts.acceptArraysIgnore = [];
  } else {
    opts.acceptArraysIgnore = arrayiffyIfString(opts.acceptArraysIgnore);
  }
  opts.msg = typeof opts.msg === "string" ? opts.msg.trim() : opts.msg;
  if (opts.msg[opts.msg.length - 1] === ":") {
    opts.msg = opts.msg.slice(0, opts.msg.length - 1).trim();
  }
  if (opts.schema) {
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
      if (pullAllWithGlob(pullAll(Object.keys(obj), Object.keys(ref).concat(Object.keys(opts.schema))), opts.ignoreKeys).length !== 0) {
        var keys = pullAll(Object.keys(obj), Object.keys(ref).concat(Object.keys(opts.schema)));
        throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".enforceStrictKeyset is on and the following key").concat(keys.length > 1 ? "s" : "", " ").concat(keys.length > 1 ? "are" : "is", " not covered by schema and/or reference objects: ").concat(keys.join(", ")));
      }
    } else if (existy(ref) && Object.keys(ref).length > 0) {
      if (pullAllWithGlob(pullAll(Object.keys(obj), Object.keys(ref)), opts.ignoreKeys).length !== 0) {
        var _keys = pullAll(Object.keys(obj), Object.keys(ref));
        throw new TypeError("".concat(opts.msg, ": The input object has key").concat(_keys.length > 1 ? "s" : "", " which ").concat(_keys.length > 1 ? "are" : "is", " not covered by the reference object: ").concat(_keys.join(", ")));
      } else if (pullAllWithGlob(pullAll(Object.keys(ref), Object.keys(obj)), opts.ignoreKeys).length !== 0) {
        var _keys2 = pullAll(Object.keys(ref), Object.keys(obj));
        throw new TypeError("".concat(opts.msg, ": The reference object has key").concat(_keys2.length > 1 ? "s" : "", " which ").concat(_keys2.length > 1 ? "are" : "is", " not present in the input object: ").concat(_keys2.join(", ")));
      }
    } else {
      throw new TypeError("".concat(opts.msg, ": Both ").concat(opts.optsVarName, ".schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!"));
    }
  }
  traverse(obj, function (key, val, innerObj) {
    var current = val !== undefined ? val : key;
    if (opts.enforceStrictKeyset && !(!isObj(current) && !isArr(current) && isArr(innerObj.parent)) && (!existy(opts.schema) || !isObj(opts.schema) || isObj(opts.schema) && (!Object.keys(opts.schema).length || !isArr(innerObj.parent) && !Object.prototype.hasOwnProperty.call(opts.schema, innerObj.path) || isArr(innerObj.parent) && !objectPath.has(opts.schema, goUpByOneLevel(innerObj.path)))) && (!existy(ref) || !isObj(ref) || isObj(ref) && (!Object.keys(ref).length || !opts.acceptArrays && !objectPath.has(ref, innerObj.path) || opts.acceptArrays && (!isArr(innerObj.parent) && !objectPath.has(ref, innerObj.path) || isArr(innerObj.parent) && !objectPath.has(ref, goUpByOneLevel(innerObj.path)))))) {
      throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, " is neither covered by reference object (second input argument), nor ").concat(opts.optsVarName, ".schema! To stop this error, turn off ").concat(opts.optsVarName, ".enforceStrictKeyset or provide some type reference (2nd argument or ").concat(opts.optsVarName, ".schema)."));
    } else if (isObj(opts.schema) && Object.keys(opts.schema).length && Object.prototype.hasOwnProperty.call(opts.schema, innerObj.path)
    ) {
        var currentKeysSchema = arrayiffyIfString(opts.schema[innerObj.path]).map(String).map(function (el) {
          return el.toLowerCase();
        });
        objectPath.set(opts.schema, innerObj.path, currentKeysSchema);
        if (!intersection(currentKeysSchema, NAMESFORANYTYPE).length) {
          if (current !== true && current !== false && !currentKeysSchema.includes(typ(current).toLowerCase()) || (current === true || current === false) && !currentKeysSchema.includes(String(current)) && !currentKeysSchema.includes("boolean")) {
            if (isArr(current) && opts.acceptArrays) {
              for (var i = 0, len = current.length; i < len; i++) {
                if (!currentKeysSchema.includes(typ(current[i]).toLowerCase())) {
                  throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, ".").concat(i, ", the ").concat(ordinal(i + 1), " element (equal to ").concat(JSON.stringify(current[i], null, 0), ") is of a type ").concat(typ(current[i]).toLowerCase(), ", but only the following are allowed by the ").concat(opts.optsVarName, ".schema: ").concat(currentKeysSchema.join(", ")));
                }
              }
            } else {
              throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, " was customised to ").concat(typ(current) !== "string" ? '"' : "").concat(JSON.stringify(current, null, 0)).concat(typ(current) !== "string" ? '"' : "", " (").concat(typ(current).toLowerCase(), ") which is not among the allowed types in schema (").concat(currentKeysSchema.join(", "), ")"));
            }
          }
        }
      } else if (existy(ref) && Object.keys(ref).length && objectPath.has(ref, innerObj.path) && typ(current) !== typ(objectPath.get(ref, innerObj.path)) && (!opts.ignoreKeys || !opts.ignoreKeys.some(function (oneOfKeysToIgnore) {
      return matcher.isMatch(key, oneOfKeysToIgnore);
    })) && (!opts.ignorePaths || !opts.ignorePaths.some(function (oneOfPathsToIgnore) {
      return matcher.isMatch(innerObj.path, oneOfPathsToIgnore);
    }))) {
      var compareTo = objectPath.get(ref, innerObj.path);
      if (opts.acceptArrays && isArr(current) && !opts.acceptArraysIgnore.includes(key)) {
        var allMatch = current.every(function (el) {
          return typ(el).toLowerCase() === typ(ref[key]).toLowerCase();
        });
        if (!allMatch) {
          throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, " was customised to be array, but not all of its elements are ").concat(typ(ref[key]).toLowerCase(), "-type"));
        }
      } else {
        throw new TypeError("".concat(opts.msg, ": ").concat(opts.optsVarName, ".").concat(innerObj.path, " was customised to ").concat(typ(current).toLowerCase() === "string" ? "" : '"').concat(JSON.stringify(current, null, 0)).concat(typ(current).toLowerCase() === "string" ? "" : '"', " which is not ").concat(typ(compareTo).toLowerCase(), " but ").concat(typ(current).toLowerCase()));
      }
    }
    return current;
  });
}
function externalApi(obj, ref, originalOptions) {
  return checkTypesMini(obj, ref, originalOptions);
}

module.exports = externalApi;
