/**
 * util-array-object-or-both
 * Validate and normalise user choice: array, object or both?
 * Version: 2.7.53
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/util-array-object-or-both
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var includes = _interopDefault(require('lodash.includes'));
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

function arrObjOrBoth(str, originalOpts) {
  function existy(x) {
    return x != null;
  }
  if (!existy(str)) {
    throw new Error("util-array-object-or-both/validate(): [THROW_ID_01] Please provide a string to work on. Currently it's equal to ".concat(JSON.stringify(str, null, 4)));
  }
  if (typeof str !== "string") {
    throw new Error("util-array-object-or-both/validate(): [THROW_ID_02] Input must be string! Currently it's ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error("util-array-object-or-both/validate(): [THROW_ID_03] Second argument, options object, must be, well, object! Currenlty it's: ".concat(_typeof(originalOpts), ", equal to: ").concat(JSON.stringify(originalOpts, null, 4)));
  }
  var onlyObjectValues = ["object", "objects", "obj", "ob", "o"];
  var onlyArrayValues = ["array", "arrays", "arr", "aray", "arr", "a"];
  var onlyAnyValues = ["any", "all", "everything", "both", "either", "each", "whatever", "whatevs", "e"];
  var defaults = {
    msg: "",
    optsVarName: "given variable"
  };
  var opts = Object.assign({}, defaults, originalOpts);
  if (existy(opts.msg) && opts.msg.length > 0) {
    opts.msg = "".concat(opts.msg.trim(), " ");
  }
  if (opts.optsVarName !== "given variable") {
    opts.optsVarName = "variable \"".concat(opts.optsVarName, "\"");
  }
  if (includes(onlyObjectValues, str.toLowerCase().trim())) {
    return "object";
  } else if (includes(onlyArrayValues, str.toLowerCase().trim())) {
    return "array";
  } else if (includes(onlyAnyValues, str.toLowerCase().trim())) {
    return "any";
  }
  throw new TypeError("".concat(opts.msg, "The ").concat(opts.optsVarName, " was customised to an unrecognised value: ").concat(str, ". Please check it against the API documentation."));
}

module.exports = arrObjOrBoth;
