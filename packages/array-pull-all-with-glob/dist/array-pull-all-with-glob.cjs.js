/**
 * array-pull-all-with-glob
 * pullAllWithGlob - like _.pullAll but pulling stronger, with globs
 * Version: 4.12.56
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-pull-all-with-glob
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var matcher = _interopDefault(require('matcher'));
var checkTypes = _interopDefault(require('check-types-mini'));
var isObj = _interopDefault(require('lodash.isplainobject'));

function _typeof(obj) {
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

var isArr = Array.isArray;
function pullAllWithGlob(originalInput, originalToBeRemoved) {
  var originalOpts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  function existy(x) {
    return x != null;
  }
  function isStr(something) {
    return typeof something === "string";
  }
  if (!existy(originalInput)) {
    throw new Error("array-pull-all-with-glob: [THROW_ID_01] first argument is missing!");
  }
  if (!existy(originalToBeRemoved)) {
    throw new Error("array-pull-all-with-glob: [THROW_ID_02] second argument is missing!");
  }
  if (!isArr(originalInput)) {
    throw new Error("array-pull-all-with-glob: [THROW_ID_03] first argument must be an array! Currently it's ".concat(_typeof(originalInput), ", equal to: ").concat(JSON.stringify(originalInput, null, 4)));
  }
  var toBeRemoved;
  if (typeof originalToBeRemoved === "string") {
    if (originalToBeRemoved.length === 0) {
      return originalInput;
    }
    toBeRemoved = [originalToBeRemoved];
  } else if (isArr(originalToBeRemoved)) {
    if (originalToBeRemoved.length === 0) {
      return originalInput;
    }
    toBeRemoved = Array.from(originalToBeRemoved);
  } else if (!isArr(originalToBeRemoved)) {
    throw new Error("array-pull-all-with-glob: [THROW_ID_04] first argument must be an array! Currently it's ".concat(_typeof(originalToBeRemoved), ", equal to: ").concat(JSON.stringify(originalToBeRemoved, null, 4)));
  }
  if (originalInput.length === 0 || originalToBeRemoved.length === 0) {
    return originalInput;
  }
  if (!originalInput.every(function (el) {
    return isStr(el);
  })) {
    throw new Error("array-pull-all-with-glob: [THROW_ID_05] first argument array contains non-string elements: ".concat(JSON.stringify(originalInput, null, 4)));
  }
  if (!toBeRemoved.every(function (el) {
    return isStr(el);
  })) {
    throw new Error("array-pull-all-with-glob: [THROW_ID_06] first argument array contains non-string elements: ".concat(JSON.stringify(toBeRemoved, null, 4)));
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error("array-pull-all-with-glob: [THROW_ID_07] third argument, options object is not a plain object but ".concat(Array.isArray(originalOpts) ? "array" : _typeof(originalOpts)));
  }
  var opts;
  var defaults = {
    caseSensitive: true
  };
  if (originalOpts === null) {
    opts = Object.assign({}, defaults);
  } else {
    opts = Object.assign({}, defaults, originalOpts);
  }
  checkTypes(opts, defaults, {
    msg: "newLibrary/yourFunction(): [THROW_ID_08]",
    optsVarName: "opts"
  });
  return Array.from(originalInput).filter(function (originalVal) {
    return !toBeRemoved.some(function (remVal) {
      return matcher.isMatch(originalVal, remVal, {
        caseSensitive: opts.caseSensitive
      });
    });
  });
}

module.exports = pullAllWithGlob;
