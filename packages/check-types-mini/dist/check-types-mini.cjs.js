/**
 * check-types-mini
 * Validate options object
 * Version: 6.0.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/check-types-mini/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var typ = require('type-detect');
var pullAll = require('lodash.pullall');
var astMonkeyTraverse = require('ast-monkey-traverse');
var intersection = require('lodash.intersection');
var arrayiffyIfString = require('arrayiffy-if-string');
var objectPath = require('object-path');
var matcher = require('matcher');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var typ__default = /*#__PURE__*/_interopDefaultLegacy(typ);
var pullAll__default = /*#__PURE__*/_interopDefaultLegacy(pullAll);
var intersection__default = /*#__PURE__*/_interopDefaultLegacy(intersection);
var objectPath__default = /*#__PURE__*/_interopDefaultLegacy(objectPath);
var matcher__default = /*#__PURE__*/_interopDefaultLegacy(matcher);

var defaults = {
  ignoreKeys: [],
  ignorePaths: [],
  acceptArrays: false,
  acceptArraysIgnore: [],
  enforceStrictKeyset: true,
  schema: {},
  msg: "check-types-mini",
  optsVarName: "opts"
}; // fourth input argument is shielded from an external API:

function internalApi(obj, ref, originalOptions) {
  //
  // Functions
  // =========
  function existy(something) {
    return something != null; // deliberate !=
  }

  function isObj(something) {
    return typ__default['default'](something) === "Object";
  }

  function pullAllWithGlob(originalInput, toBeRemoved) {
    if (typeof toBeRemoved === "string") {
      toBeRemoved = arrayiffyIfString.arrayiffy(toBeRemoved);
    }

    return Array.from(originalInput).filter(function (originalVal) {
      return !toBeRemoved.some(function (remVal) {
        return matcher__default['default'].isMatch(originalVal, remVal, {
          caseSensitive: true
        });
      });
    });
  }

  var hasKey = Object.prototype.hasOwnProperty; // Variables
  // =========

  var NAMESFORANYTYPE = ["any", "anything", "every", "everything", "all", "whatever", "whatevs"];

  if (!existy(obj)) {
    throw new Error("check-types-mini: [THROW_ID_01] First argument is missing!");
  } // Prep our own opts
  // =================


  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOptions);

  if (typeof opts.ignoreKeys === "string") {
    opts.ignoreKeys = [opts.ignoreKeys];
  }

  if (typeof opts.ignorePaths === "string") {
    opts.ignorePaths = [opts.ignorePaths];
  }

  if (typeof opts.acceptArraysIgnore === "string") {
    opts.acceptArraysIgnore = [opts.acceptArraysIgnore];
  }

  opts.msg = ("" + opts.msg).trim();

  if (opts.msg[opts.msg.length - 1] === ":") {
    opts.msg = opts.msg.slice(0, opts.msg.length - 1).trim();
  } // now, since we let users type the allowed types, we have to normalise the letter case:


  if (isObj(opts.schema)) {
    // 1. if schema is given as nested AST tree, for example:
    // {
    //   schema: {
    //     option1: { somekey: "any" }, // <------ !
    //     option2: "whatever"
    //   }
    // }
    //
    // (notice it's not flat, "option1.somekey": "any", but nested!)
    //
    // then, we flatten it first, so that each AST branch's path is key and the
    // value at that branch's tip is the key's value:
    // {
    //   schema: {
    //     "option1.somekey": "any", // <------ !
    //     option2: "whatever"
    //   }
    // }
    Object.keys(opts.schema).forEach(function (oneKey) {
      if (isObj(opts.schema[oneKey])) {
        // 1. extract all unique AST branches leading to their tips
        var tempObj = {};
        astMonkeyTraverse.traverse(opts.schema[oneKey], function (key, val, innerObj) {
          var current = val !== undefined ? val : key;

          if (!Array.isArray(current) && !isObj(current)) {
            tempObj[oneKey + "." + innerObj.path] = current;
          }

          return current;
        }); // 2. delete that key which leads to object:

        delete opts.schema[oneKey]; // 3. merge in all paths-as-keys into schema opts object:

        opts.schema = _objectSpread__default['default'](_objectSpread__default['default']({}, opts.schema), tempObj);
      }
    }); //
    //
    //
    //
    //
    // 2. arrayiffy

    Object.keys(opts.schema).forEach(function (oneKey) {
      if (!Array.isArray(opts.schema[oneKey])) {
        opts.schema[oneKey] = [opts.schema[oneKey]];
      } // then turn all keys into strings and trim and lowercase them:


      opts.schema[oneKey] = opts.schema[oneKey].map(function (el) {
        return ("" + el).toLowerCase().trim();
      });
    });
  } else if (opts.schema != null) {
    throw new Error("check-types-mini: opts.schema was customised to " + JSON.stringify(opts.schema, null, 0) + " which is not object but " + typeof opts.schema);
  }

  if (!existy(ref)) {
    // eslint-disable-next-line no-param-reassign
    ref = {};
  } // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // THE BUSINESS
  // ============
  // Since v.4 we support nested opts. That's AST's. This means, we will have to
  // traverse them somehow up until the last tip of each branch. Luckily, we have
  // tools for traversal - ast-monkey-traverse.
  // 1. The "obj" and "ref" root level keys need separate attention.
  // If keys mismatch, we need to check them separately from traversal.
  // During traversal, we'll check if each value is a plain object/array and
  // match the keysets as well. However, traversal won't "see" root level keys.

  if (opts.enforceStrictKeyset) {

    if (existy(opts.schema) && Object.keys(opts.schema).length > 0) {
      if (ref && pullAllWithGlob(pullAll__default['default'](Object.keys(obj), Object.keys(ref).concat(Object.keys(opts.schema))), opts.ignoreKeys).length) {
        var keys = pullAll__default['default'](Object.keys(obj), Object.keys(ref).concat(Object.keys(opts.schema)));
        throw new TypeError(opts.msg + ": " + opts.optsVarName + ".enforceStrictKeyset is on and the following key" + (keys.length > 1 ? "s" : "") + " " + (keys.length > 1 ? "are" : "is") + " not covered by schema and/or reference objects: " + keys.join(", "));
      }
    } else if (isObj(ref) && Object.keys(ref).length > 0) {
      if (pullAllWithGlob(pullAll__default['default'](Object.keys(obj), Object.keys(ref)), opts.ignoreKeys).length !== 0) {
        var _keys = pullAll__default['default'](Object.keys(obj), Object.keys(ref));

        throw new TypeError(opts.msg + ": The input object has key" + (_keys.length > 1 ? "s" : "") + " which " + (_keys.length > 1 ? "are" : "is") + " not covered by the reference object: " + _keys.join(", "));
      } else if (pullAllWithGlob(pullAll__default['default'](Object.keys(ref), Object.keys(obj)), opts.ignoreKeys).length !== 0) {
        var _keys2 = pullAll__default['default'](Object.keys(ref), Object.keys(obj));

        throw new TypeError(opts.msg + ": The reference object has key" + (_keys2.length > 1 ? "s" : "") + " which " + (_keys2.length > 1 ? "are" : "is") + " not present in the input object: " + _keys2.join(", "));
      }
    } else {
      // it's an error because both schema and reference don't exist
      throw new TypeError(opts.msg + ": Both " + opts.optsVarName + ".schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!");
    }
  } // 2. Call the monkey and traverse the schema object, checking each value-as-object
  // or value-as-array separately, if opts.enforceStrictKeyset is on. Root level
  // was checked in step 1. above. What's left is deeper levels. // When users set schema to "any" for certain path, this applies to that path
  // and any (if exists) children objects/arrays/strings whatever on deeper children
  // paths. Now, the problem is, we check by traversing everything - this means,
  // for example, we have this to check:
  //
  // {
  //   a: {
  //     b: "c"
  //   },
  //  d: "e"
  // }
  // ast-monkey-traverse will check "a" and find it's schema is "any" - basically,
  // we don't care what it's type is and instruct "check-types-mini" to skip it.
  // This "skip" instruction applies to "b" too! However, our checking engine,
  // "ast-monkey-traverse" will still traverse "b". It can't stop there, because
  // there's still "d" key to check - we're traversing EVERYTHING.
  // Challenge: when "ast-monkey" will stumble upon "b" it might flag it up as
  // being of a wrong type, it does not have visibility of its parent's schemas.
  // What we'll do to fix this is we'll compile the list of any paths that have
  // "any"/"whatever" schemas in an array. Then, when deeper children nodes are
  // traversed, we'll check, are they children of any aforementioned paths (technically
  // speaking, do their path strings start with any of the strings in aforementioned
  // paths array strings).

  var ignoredPathsArr = [];
  astMonkeyTraverse.traverse(obj, function (key, val, innerObj) {
    // innerObj.path // Here what we have been given:

    var current = val;
    var objKey = key;

    if (innerObj.parentType === "array") {
      objKey = undefined;
      current = key;
    } // Here's what we will compare against to.
    // If schema exists, types defined there will be used to compare against: // if current path is a children of any paths in "ignoredPathsArr", skip it:

    if (Array.isArray(ignoredPathsArr) && ignoredPathsArr.length && ignoredPathsArr.some(function (path) {
      return innerObj.path.startsWith(path);
    })) {
      return current;
    } // if this key is ignored, skip it:


    if (objKey && opts.ignoreKeys.some(function (oneOfKeysToIgnore) {
      return matcher__default['default'].isMatch(objKey, oneOfKeysToIgnore);
    })) {
      return current;
    } // if this path is ignored, skip it:

    if (opts.ignorePaths.some(function (oneOfPathsToIgnore) {
      return matcher__default['default'].isMatch(innerObj.path, oneOfPathsToIgnore);
    })) {
      return current;
    }
    var isNotAnArrayChild = !(!isObj(current) && !Array.isArray(current) && Array.isArray(innerObj.parent)); // ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  █
    var optsSchemaHasThisPathDefined = false;

    if (isObj(opts.schema) && hasKey.call(opts.schema, innerObj.path)) {
      optsSchemaHasThisPathDefined = true;
    }
    var refHasThisPathDefined = false;

    if (isObj(ref) && objectPath__default['default'].has(ref, innerObj.path)) {
      refHasThisPathDefined = true;
    } // ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  █
    // First, check if given path is not covered by neither ref object nor schema.
    // We also skip the non-container types (obj/arr) within arrays (test 02.11)
    // Otherwise, we would get false throws because arrays can mention list of
    // "things" (tag names, for example) and this application would enforce each
    // one of them, does it exist in schema/ref, but it won't exist!
    // Thus, strict existence checks apply only for object keys and arrays, not
    // array elements which are not objects/arrays.

    if (opts.enforceStrictKeyset && isNotAnArrayChild && !optsSchemaHasThisPathDefined && !refHasThisPathDefined) {
      throw new TypeError(opts.msg + ": " + opts.optsVarName + "." + innerObj.path + " is neither covered by reference object (second input argument), nor " + opts.optsVarName + ".schema! To stop this error, turn off " + opts.optsVarName + ".enforceStrictKeyset or provide some type reference (2nd argument or " + opts.optsVarName + ".schema).\n\nDebug info:\n\nobj = " + JSON.stringify(obj, null, 4) + "\n\nref = " + JSON.stringify(ref, null, 4) + "\n\ninnerObj = " + JSON.stringify(innerObj, null, 4) + "\n\nopts = " + JSON.stringify(opts, null, 4) + "\n\ncurrent = " + JSON.stringify(current, null, 4) + "\n\n");
    } else if (optsSchemaHasThisPathDefined) { // step 1. Fetch the current keys' schema and normalise it - it's an array
      // which holds strings. Those strings have to be lowercased. It also can
      // be raw null/undefined, which would be arrayified and turned into string.
      var currentKeysSchema = arrayiffyIfString.arrayiffy(opts.schema[innerObj.path]).map(function (el) {
        return ("" + el).toLowerCase();
      });
      objectPath__default['default'].set(opts.schema, innerObj.path, currentKeysSchema); // step 2. First check does our schema contain any blanket names, "any", "whatever" etc.

      if (!intersection__default['default'](currentKeysSchema, NAMESFORANYTYPE).length) {
        // Because, if not, it means we need to do some work, check types.
        // Beware, Booleans can be allowed blanket, as "boolean", but also,
        // in granular fashion: as just "true" or just "false".

        if (current !== true && current !== false && !currentKeysSchema.includes(typ__default['default'](current).toLowerCase()) || (current === true || current === false) && !currentKeysSchema.includes(String(current)) && !currentKeysSchema.includes("boolean")) { // new in v.2.2
          // Check if key's value is array. Then, if it is, check if opts.acceptArrays is on.
          // If it is, then iterate through the array, checking does each value conform to the
          // types listed in that key's schema entry.

          if (Array.isArray(current) && opts.acceptArrays) { // check each key:

            for (var i = 0, len = current.length; i < len; i++) {
              if (!currentKeysSchema.includes(typ__default['default'](current[i]).toLowerCase())) {
                throw new TypeError(opts.msg + ": " + opts.optsVarName + "." + innerObj.path + "." + i + ", the " + i + "th element (equal to " + JSON.stringify(current[i], null, 0) + ") is of a type " + typ__default['default'](current[i]).toLowerCase() + ", but only the following are allowed by the " + opts.optsVarName + ".schema: " + currentKeysSchema.join(", "));
              }
            }
          } else { // only then do throw...

            throw new TypeError(opts.msg + ": " + opts.optsVarName + "." + innerObj.path + " was customised to " + (typ__default['default'](current) !== "string" ? '"' : "") + JSON.stringify(current, null, 0) + (typ__default['default'](current) !== "string" ? '"' : "") + " (type: " + typ__default['default'](current).toLowerCase() + ") which is not among the allowed types in schema (which is equal to " + JSON.stringify(currentKeysSchema, null, 0) + ")");
          }
        }
      } else {
        ignoredPathsArr.push(innerObj.path);
      }
    } else if (ref && isObj(ref) && refHasThisPathDefined) {
      var compareTo = objectPath__default['default'].get(ref, innerObj.path);

      if (opts.acceptArrays && Array.isArray(current) && !opts.acceptArraysIgnore.includes(key)) {
        var allMatch = current.every(function (el) {
          return typ__default['default'](el).toLowerCase() === typ__default['default'](ref[key]).toLowerCase();
        });

        if (!allMatch) {
          throw new TypeError(opts.msg + ": " + opts.optsVarName + "." + innerObj.path + " was customised to be array, but not all of its elements are " + typ__default['default'](ref[key]).toLowerCase() + "-type");
        }
      } else if (typ__default['default'](current) !== typ__default['default'](compareTo)) {
        throw new TypeError(opts.msg + ": " + opts.optsVarName + "." + innerObj.path + " was customised to " + (typ__default['default'](current).toLowerCase() === "string" ? "" : '"') + JSON.stringify(current, null, 0) + (typ__default['default'](current).toLowerCase() === "string" ? "" : '"') + " which is not " + typ__default['default'](compareTo).toLowerCase() + " but " + typ__default['default'](current).toLowerCase());
      }
    } else ;
    return current;
  });
}
/**
 * Validate options object
 */


function checkTypesMini(obj, ref, originalOptions) {
  return internalApi(obj, ref, originalOptions);
}

exports.checkTypesMini = checkTypesMini;
