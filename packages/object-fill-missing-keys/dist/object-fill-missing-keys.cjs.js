/**
 * @name object-fill-missing-keys
 * @fileoverview Add missing keys into plain objects, according to a reference object
 * @version 8.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/object-fill-missing-keys/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _typeof = require('@babel/runtime/helpers/typeof');
var clone = require('lodash.clonedeep');
var objectMergeAdvanced = require('object-merge-advanced');
var arrayiffyIfString = require('arrayiffy-if-string');
var objectAllValuesEqualTo = require('object-all-values-equal-to');
var isObj = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version$1 = "8.0.14";

var version = version$1;
var defaults = {
  placeholder: false,
  doNotFillThesePathsIfTheyContainPlaceholders: [],
  useNullAsExplicitFalse: true
};
function typ(something) {
  if (isObj__default['default'](something)) {
    return "plain object";
  }
  if (Array.isArray(something)) {
    return "array";
  }
  return _typeof__default['default'](something);
}
function isStr(something) {
  return typeof something === "string";
}
function existy(x) {
  return x != null;
}
function fillMissingKeys(incompleteOriginal, schema, opts) {
  var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
  var incomplete = clone__default['default'](incompleteOriginal);
  if (existy(incomplete) || !(path.length && opts.doNotFillThesePathsIfTheyContainPlaceholders.includes(path) && objectAllValuesEqualTo.allEq(incomplete, opts.placeholder))) {
    if (isObj__default['default'](schema) && isObj__default['default'](incomplete)) {
      Object.keys(schema).forEach(function (key) {
        var currentPath = "".concat(path ? "".concat(path, ".") : "").concat(key);
        if (opts.doNotFillThesePathsIfTheyContainPlaceholders.includes(currentPath)) {
          if (existy(incomplete[key])) {
            if (objectAllValuesEqualTo.allEq(incomplete[key], opts.placeholder)) {
              incomplete[key] = opts.placeholder;
            }
          } else {
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
          var currentPath = "".concat(path ? "".concat(path, ".") : "", "0");
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
}
function fillMissing(originalIncompleteWrapper, originalSchemaWrapper, originalOptsWrapper) {
  if (arguments.length === 0) {
    throw new Error("object-fill-missing-keys: [THROW_ID_01] All arguments are missing!");
  }
  if (!isObj__default['default'](originalIncompleteWrapper)) {
    throw new Error("object-fill-missing-keys: [THROW_ID_02] First argument, input object must be a plain object. Currently it's type is \"".concat(typ(originalIncompleteWrapper), "\" and it's equal to: ").concat(JSON.stringify(originalIncompleteWrapper, null, 4)));
  }
  if (!isObj__default['default'](originalSchemaWrapper)) {
    throw new Error("object-fill-missing-keys: [THROW_ID_03] Second argument, schema object, must be a plain object. Currently it's type is \"".concat(typ(originalSchemaWrapper), "\" and it's equal to: ").concat(JSON.stringify(originalSchemaWrapper, null, 4)));
  }
  if (originalOptsWrapper && !isObj__default['default'](originalOptsWrapper)) {
    throw new Error("object-fill-missing-keys: [THROW_ID_04] Third argument, schema object, must be a plain object. Currently it's type is \"".concat(typ(originalOptsWrapper), "\" and it's equal to: ").concat(JSON.stringify(originalOptsWrapper, null, 4)));
  }
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
    throw new Error("object-fill-missing-keys: [THROW_ID_06] opts.doNotFillThesePathsIfTheyContainPlaceholders element with an index number \"".concat(culpritsIndex, "\" is not a string! It's ").concat(typ(culpritsVal), ", equal to:\n").concat(JSON.stringify(culpritsVal, null, 4)));
  }
  return fillMissingKeys(clone__default['default'](originalIncompleteWrapper), clone__default['default'](originalSchemaWrapper), opts);
}

exports.fillMissing = fillMissing;
exports.version = version;
