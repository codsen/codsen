'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var typ = _interopDefault(require('type-detect'));
var pullAll = _interopDefault(require('lodash.pullall'));
var traverse = _interopDefault(require('ast-monkey-traverse'));
var intersection = _interopDefault(require('lodash.intersection'));
var arrayiffyIfString = _interopDefault(require('arrayiffy-if-string'));
var objectPath = _interopDefault(require('object-path'));

function checkTypesMini(obj, ref, originalOptions) {
  var shouldWeCheckTheOpts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  console.log("\n███████████████████████████████████████ 016 checkTypesMini() called with arguments:");
  console.log(JSON.stringify([].concat(Array.prototype.slice.call(arguments)), null, 4));
  console.log("█████████\n");
  function existy(something) {
    return something != null;
  }
  function isObj(something) {
    return typ(something) === "Object";
  }
  var NAMESFORANYTYPE = ["any", "anything", "every", "everything", "all", "whatever", "whatevs"];
  var isArr = Array.isArray;
  if (!existy(obj)) {
    throw new Error("check-types-mini: [THROW_ID_01] First argument is missing!");
  }
  var defaults = {
    ignoreKeys: [],
    acceptArrays: false,
    acceptArraysIgnore: [],
    enforceStrictKeyset: true,
    schema: {},
    msg: "check-types-mini",
    optsVarName: "opts"
  };
  var opts = void 0;
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
    console.log("098 about to call itself recursively:");
    checkTypesMini(opts, defaults, null, false);
  }
  console.log("111");
  if (opts.enforceStrictKeyset) {
    if (existy(opts.schema) && Object.keys(opts.schema).length > 0) {
      if (pullAll(Object.keys(obj), Object.keys(ref).concat(Object.keys(opts.schema))).length !== 0) {
        var keys = pullAll(Object.keys(obj), Object.keys(ref).concat(Object.keys(opts.schema)));
        throw new TypeError(opts.msg + ": " + opts.optsVarName + ".enforceStrictKeyset is on and the following key" + (keys.length > 1 ? "s" : "") + " " + (keys.length > 1 ? "are" : "is") + " not covered by schema and/or reference objects: " + keys.join(", "));
      }
    } else if (existy(ref) && Object.keys(ref).length > 0) {
      if (pullAll(Object.keys(obj), Object.keys(ref)).length !== 0) {
        var _keys = pullAll(Object.keys(obj), Object.keys(ref));
        throw new TypeError(opts.msg + ": The input object has key" + (_keys.length > 1 ? "s" : "") + " that " + (_keys.length > 1 ? "are" : "is") + " not covered by the reference object: " + _keys.join(", "));
      } else if (pullAll(Object.keys(ref), Object.keys(obj)).length !== 0) {
        var _keys2 = pullAll(Object.keys(ref), Object.keys(obj));
        throw new TypeError(opts.msg + ": The reference object has key" + (_keys2.length > 1 ? "s" : "") + " that " + (_keys2.length > 1 ? "are" : "is") + " not present in the input object: " + _keys2.join(", "));
      }
    } else {
      throw new TypeError(opts.msg + ": Both " + opts.optsVarName + ".schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!");
    }
  }
  console.log("164");
  console.log("172 " + ("\x1B[" + 33 + "m" + "obj" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(obj, null, 4));
  traverse(obj, function (key, val, innerObj) {
    var current = val !== undefined ? val : key;
    console.log("\n\x1B[" + 36 + "m" + (innerObj.path + " ===========================") + "\x1B[" + 39 + "m " + ("\x1B[" + 33 + "m" + "key" + "\x1B[" + 39 + "m") + " = " + key + "; " + ("\x1B[" + 33 + "m" + "val" + "\x1B[" + 39 + "m") + " = " + ("\x1B[" + 35 + "m" + JSON.stringify(val, null, 0) + "\x1B[" + 39 + "m") + "; " + ("\x1B[" + 33 + "m" + "current" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(current, null, 4));
    console.log("206 " + ("\x1B[" + 33 + "m" + "opts.schema" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(opts.schema, null, 4));
    if (isObj(opts.schema) && Object.keys(opts.schema).length && objectPath.has(opts.schema, innerObj.path)) {
      console.log("217");
      var currentKeysSchema = arrayiffyIfString(objectPath.get(opts.schema, innerObj.path)).map(String).map(function (el) {
        return el.toLowerCase();
      });
      console.log("226 " + ("\x1B[" + 33 + "m" + "currentKeysSchema" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(currentKeysSchema, null, 4));
      objectPath.set(opts.schema, innerObj.path, currentKeysSchema);
      if (!intersection(currentKeysSchema, NAMESFORANYTYPE).length) {
        console.log("243 " + ("\x1B[" + 33 + "m" + "currentKeysSchema" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(currentKeysSchema, null, 4));
        if (current !== true && current !== false && !currentKeysSchema.includes(typ(current).toLowerCase()) || (current === true || current === false) && !currentKeysSchema.includes(String(current)) && !currentKeysSchema.includes("boolean")) {
          console.log("251 I. matching against schema.");
          if (isArr(current) && opts.acceptArrays) {
            for (var i = 0, len = current.length; i < len; i++) {
              if (!currentKeysSchema.includes(typ(current[i]).toLowerCase())) {
                throw new TypeError(opts.msg + ": " + opts.optsVarName + "." + key + " is of a type " + typ(current[i]).toLowerCase() + ", but only the following are allowed in " + opts.optsVarName + ".schema: " + currentKeysSchema);
              }
            }
          } else {
            throw new TypeError(opts.msg + ": " + opts.optsVarName + "." + key + " was customised to " + (typ(current) !== "string" ? '"' : "") + JSON.stringify(current, null, 0) + (typ(current) !== "string" ? '"' : "") + " (" + typ(current) + ") which is not among the allowed types in schema (" + currentKeysSchema.join(", ") + ")");
          }
        }
      }
    } else if (existy(ref) && Object.keys(ref).length && objectPath.has(ref, innerObj.path) && typ(current) !== typ(objectPath.get(ref, innerObj.path)) && (!opts.ignoreKeys || !opts.ignoreKeys.includes(key)) && (!opts.ignorePaths || !opts.ignorePaths.includes(innerObj.path))) {
      console.log("300 II. matching against ref.");
      console.log("* 312 " + ("\x1B[" + 33 + "m" + "current" + "\x1B[" + 39 + "m") + " = " + JSON.stringify(current, null, 4) + " (type " + typ(current) + ")");
      console.log("* 319 " + ("\x1B[" + 33 + "m" + "objectPath.get(ref, innerObj.path)" + "\x1B[" + 39 + "m") + " = \"" + JSON.stringify(objectPath.get(ref, innerObj.path), null, 4) + "\" (type " + typ(objectPath.get(ref, innerObj.path)) + ")");
      var compareTo = objectPath.get(ref, innerObj.path);
      if (opts.acceptArrays && isArr(current) && !opts.acceptArraysIgnore.includes(key)) {
        console.log("316");
        var allMatch = current.every(function (el) {
          return typ(el) === typ(ref[key]);
        });
        if (!allMatch) {
          throw new TypeError(opts.msg + ": " + opts.optsVarName + "." + innerObj.path + " was customised to be array, but not all of its elements are " + typ(ref[key]).toLowerCase() + "-type");
        }
      } else {
        console.log("328");
        throw new TypeError(opts.msg + ": " + opts.optsVarName + "." + innerObj.path + " was customised to " + (typ(current).toLowerCase() === "string" ? "" : '"') + JSON.stringify(current, null, 0) + (typ(current).toLowerCase() === "string" ? "" : '"') + " which is not " + typ(compareTo).toLowerCase() + " but " + typ(current).toLowerCase());
      }
    }
    return current;
  });
  console.log("███████████████████████████████████████");
  console.log("████████████████ end ██████████████████");
  console.log("███████████████████████████████████████\n\n\n\n");
}
function externalApi(obj, ref, originalOptions) {
  return checkTypesMini(obj, ref, originalOptions);
}

module.exports = externalApi;
