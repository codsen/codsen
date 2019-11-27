/**
 * object-no-new-keys
 * Check, does a plain object (AST/JSON) has any unique keys, not present in a reference object (another AST/JSON)
 * Version: 2.8.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/object-no-new-keys
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isObj = _interopDefault(require('lodash.isplainobject'));

function objectNoNewKeys(inputOuter, referenceOuter, originalOptsOuter) {
  var isArr = Array.isArray;
  var defaults = {
    mode: 2
  };
  if (Number.isFinite(originalOptsOuter)) {
    if (!Number.isInteger(originalOptsOuter)) {
      throw new TypeError("object-no-new-keys/objectNoNewKeys(): [THROW_ID_03] The third argument, options object, is not only not an object, it's not even an integer! It's currently: ".concat(originalOptsOuter, " and computer doesn't like it very much."));
    } else {
      throw new TypeError("object-no-new-keys/objectNoNewKeys(): [THROW_ID_02] Please pass a plain object with a key \"mode\" set to 1 or 2, not the number ".concat(originalOptsOuter, " directly! Computer doesn't like that."));
    }
  }
  var optsOuter = Object.assign({}, defaults, originalOptsOuter);
  if (typeof optsOuter.mode === "string") {
    optsOuter.mode = parseInt(optsOuter.mode, 10);
  }
  if (optsOuter.mode !== 1 && optsOuter.mode !== 2) {
    throw new TypeError("object-no-new-keys/objectNoNewKeys(): [THROW_ID_01] opts.mode was customised to be a wrong thing, \"".concat(optsOuter.mode, "\" while it should be either natural number 1 or 2."));
  }
  function objectNoNewKeysInternal(input, reference, opts, innerVar) {
    var temp;
    if (innerVar === undefined) {
      innerVar = {
        path: "",
        res: []
      };
    }
    if (isObj(input)) {
      if (isObj(reference)) {
        Object.keys(input).forEach(function (key) {
          if (!Object.prototype.hasOwnProperty.call(reference, key)) {
            temp = innerVar.path.length > 0 ? "".concat(innerVar.path, ".").concat(key) : key;
            innerVar.res.push(temp);
          } else if (isObj(input[key]) || isArr(input[key])) {
            temp = {
              path: innerVar.path.length > 0 ? "".concat(innerVar.path, ".").concat(key) : key,
              res: innerVar.res
            };
            innerVar.res = objectNoNewKeysInternal(input[key], reference[key], opts, temp).res;
          }
        });
      } else {
        innerVar.res = innerVar.res.concat(Object.keys(input).map(function (key) {
          return innerVar.path.length > 0 ? "".concat(innerVar.path, ".").concat(key) : key;
        }));
      }
    } else if (isArr(input)) {
      if (isArr(reference)) {
        for (var i = 0, len = input.length; i < len; i++) {
          temp = {
            path: "".concat(innerVar.path.length > 0 ? innerVar.path : "", "[").concat(i, "]"),
            res: innerVar.res
          };
          if (opts.mode === 2) {
            innerVar.res = objectNoNewKeysInternal(input[i], reference[0], opts, temp).res;
          } else {
            innerVar.res = objectNoNewKeysInternal(input[i], reference[i], opts, temp).res;
          }
        }
      } else {
        innerVar.res = innerVar.res.concat(input.map(function (el, i) {
          return "".concat(innerVar.path.length > 0 ? innerVar.path : "", "[").concat(i, "]");
        }));
      }
    }
    return innerVar;
  }
  return objectNoNewKeysInternal(inputOuter, referenceOuter, optsOuter).res;
}

module.exports = objectNoNewKeys;
