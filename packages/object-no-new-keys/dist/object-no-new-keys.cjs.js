/**
 * object-no-new-keys
 * Check, does a plain object (AST/JSON) has any unique keys, not present in a reference object (another AST/JSON)
 * Version: 3.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-no-new-keys/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);

var version$1 = "3.0.8";

var version = version$1;
function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
function noNewKeys(inputOuter, referenceOuter, originalOptsOuter) {
  if (originalOptsOuter && !isObj(originalOptsOuter)) {
    throw new TypeError("object-no-new-keys/noNewKeys(): [THROW_ID_02] opts should be a plain object. It was given as " + JSON.stringify(originalOptsOuter, null, 4) + " (type " + typeof originalOptsOuter + ")");
  }
  var defaults = {
    mode: 2
  };
  var optsOuter = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOptsOuter);
  if (typeof optsOuter.mode === "string" && ["1", "2"].includes(optsOuter.mode)) {
    optsOuter.mode = +optsOuter.mode;
  } else if (![1, 2].includes(optsOuter.mode)) {
    throw new TypeError("object-no-new-keys/objectNoNewKeys(): [THROW_ID_01] opts.mode should be \"1\" or \"2\" (string or number).");
  }
  function objectNoNewKeysInternal(input, reference, opts, innerVar) {
    var temp;
    if (isObj(input)) {
      if (isObj(reference)) {
        Object.keys(input).forEach(function (key) {
          if (!Object.prototype.hasOwnProperty.call(reference, key)) {
            temp = innerVar.path.length > 0 ? innerVar.path + "." + key : key;
            innerVar.res.push(temp);
          } else if (isObj(input[key]) || Array.isArray(input[key])) {
            temp = {
              path: innerVar.path.length > 0 ? innerVar.path + "." + key : key,
              res: innerVar.res
            };
            innerVar.res = objectNoNewKeysInternal(input[key], reference[key], opts, temp).res;
          }
        });
      } else {
        innerVar.res = innerVar.res.concat(Object.keys(input).map(function (key) {
          return innerVar.path.length > 0 ? innerVar.path + "." + key : key;
        }));
      }
    } else if (Array.isArray(input)) {
      if (Array.isArray(reference)) {
        for (var i = 0, len = input.length; i < len; i++) {
          temp = {
            path: (innerVar.path.length > 0 ? innerVar.path : "") + "[" + i + "]",
            res: innerVar.res
          };
          if (opts.mode === 2) {
            innerVar.res = objectNoNewKeysInternal(input[i], reference[0], opts, temp).res;
          } else {
            innerVar.res = objectNoNewKeysInternal(input[i], reference[i], opts, temp).res;
          }
        }
      } else {
        innerVar.res = innerVar.res.concat(input.map(function (_el, i) {
          return (innerVar.path.length > 0 ? innerVar.path : "") + "[" + i + "]";
        }));
      }
    }
    return innerVar;
  }
  return objectNoNewKeysInternal(inputOuter, referenceOuter, optsOuter, {
    path: "",
    res: []
  }).res;
}

exports.noNewKeys = noNewKeys;
exports.version = version;
