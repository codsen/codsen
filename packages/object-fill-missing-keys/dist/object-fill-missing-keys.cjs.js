/**
 * object-fill-missing-keys
 * Add missing keys into plain objects, according to a reference object
 * Version: 8.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-fill-missing-keys/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var clone = require('lodash.clonedeep');
var objectMergeAdvanced = require('object-merge-advanced');
var arrayiffyIfString = require('arrayiffy-if-string');
var objectAllValuesEqualTo = require('object-all-values-equal-to');
var isObj = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version = "8.0.3";

var version$1 = version;
var defaults = {
  placeholder: false,
  doNotFillThesePathsIfTheyContainPlaceholders: [],
  useNullAsExplicitFalse: true
}; // ===================================
// F ( )

function typ(something) {
  if (isObj__default['default'](something)) {
    return "plain object";
  }

  if (Array.isArray(something)) {
    return "array";
  }

  return typeof something;
}

function isStr(something) {
  return typeof something === "string";
}

function existy(x) {
  return x != null;
} // this function does the job, but it is not exposed because its first argument
// requirements are loose - it can be anything since it will be calling itself recursively
// with potentially AST contents (objects containing arrays containing objects etc.)


function fillMissingKeys(incompleteOriginal, schema, opts, path) {
  if (path === void 0) {
    path = "";
  }

  var incomplete = clone__default['default'](incompleteOriginal);

  if (existy(incomplete) || !(path.length && opts.doNotFillThesePathsIfTheyContainPlaceholders.includes(path) && objectAllValuesEqualTo.allEq(incomplete, opts.placeholder))) {
    if (isObj__default['default'](schema) && isObj__default['default'](incomplete)) {
      // traverse the keys on schema and add them onto incomplete
      Object.keys(schema).forEach(function (key) {
        // calculate the path for current key
        var currentPath = "" + (path ? path + "." : "") + key;

        if (opts.doNotFillThesePathsIfTheyContainPlaceholders.includes(currentPath)) {
          if (existy(incomplete[key])) {
            if (objectAllValuesEqualTo.allEq(incomplete[key], opts.placeholder)) {
              incomplete[key] = opts.placeholder;
            }
          } else {
            // just create the key and set to placeholder value
            incomplete[key] = opts.placeholder;
          }
        }

        if (!existy(incomplete[key]) || !(opts.doNotFillThesePathsIfTheyContainPlaceholders.includes(currentPath) && objectAllValuesEqualTo.allEq(incomplete[key], opts.placeholder))) {
          incomplete[key] = fillMissingKeys(incomplete[key], schema[key], opts, currentPath);
        }
      });
    } else if (Array.isArray(schema) && Array.isArray(incomplete)) {
      if (incomplete.length === 0) {
        return schema;
      }

      if (schema.length > 0) {
        for (var i = incomplete.length; i--;) {
          var currentPath = (path ? path + "." : "") + "0";

          if (isObj__default['default'](schema[0]) || Array.isArray(schema[0])) {
            incomplete[i] = fillMissingKeys(incomplete[i], schema[0], opts, currentPath);
          }
        }
      }
    } else {
      return objectMergeAdvanced.mergeAdvanced(schema, incomplete, {
        useNullAsExplicitFalse: opts.useNullAsExplicitFalse
      });
    }
  }

  return incomplete;
} // =================================================
// T H E   E X P O S E D   F U N C T I O N


function fillMissing(originalIncompleteWrapper, originalSchemaWrapper, originalOptsWrapper) {
  // first argument must be an object. However, we're going to call recursively,
  // so we have to wrap the main function with another, wrapper-one, and perform
  // object-checks only on that wrapper. This way, only objects can come in,
  // but inside there can be whatever data structures.
  //
  // Also, wrapper function will shield the fourth argument from the outside API
  //
  if (arguments.length === 0) {
    throw new Error("object-fill-missing-keys: [THROW_ID_01] All arguments are missing!");
  }

  if (!isObj__default['default'](originalIncompleteWrapper)) {
    throw new Error("object-fill-missing-keys: [THROW_ID_02] First argument, input object must be a plain object. Currently it's type is \"" + typ(originalIncompleteWrapper) + "\" and it's equal to: " + JSON.stringify(originalIncompleteWrapper, null, 4));
  }

  if (!isObj__default['default'](originalSchemaWrapper)) {
    throw new Error("object-fill-missing-keys: [THROW_ID_03] Second argument, schema object, must be a plain object. Currently it's type is \"" + typ(originalSchemaWrapper) + "\" and it's equal to: " + JSON.stringify(originalSchemaWrapper, null, 4));
  }

  if (originalOptsWrapper && !isObj__default['default'](originalOptsWrapper)) {
    throw new Error("object-fill-missing-keys: [THROW_ID_04] Third argument, schema object, must be a plain object. Currently it's type is \"" + typ(originalOptsWrapper) + "\" and it's equal to: " + JSON.stringify(originalOptsWrapper, null, 4));
  } // fill any settings with defaults if missing:


  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOptsWrapper || {});

  opts.doNotFillThesePathsIfTheyContainPlaceholders = arrayiffyIfString.arrayiffy(opts.doNotFillThesePathsIfTheyContainPlaceholders);
  var culpritsVal = null;
  var culpritsIndex = null;

  if (opts.doNotFillThesePathsIfTheyContainPlaceholders.length > 0 && !opts.doNotFillThesePathsIfTheyContainPlaceholders.every(function (key, idx) {
    if (!isStr(key)) {
      culpritsVal = key;
      culpritsIndex = idx;
      return false;
    }

    return true;
  })) {
    throw new Error("object-fill-missing-keys: [THROW_ID_06] opts.doNotFillThesePathsIfTheyContainPlaceholders element with an index number \"" + culpritsIndex + "\" is not a string! It's " + typ(culpritsVal) + ", equal to:\n" + JSON.stringify(culpritsVal, null, 4));
  }

  return fillMissingKeys(clone__default['default'](originalIncompleteWrapper), clone__default['default'](originalSchemaWrapper), opts);
}

exports.fillMissing = fillMissing;
exports.version = version$1;
