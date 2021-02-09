/**
 * object-all-values-equal-to
 * Does the AST/nested-plain-object/array/whatever contain only one kind of value?
 * Version: 2.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-all-values-equal-to/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var isObj = require('lodash.isplainobject');
var isEq = require('lodash.isequal');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);
var isEq__default = /*#__PURE__*/_interopDefaultLegacy(isEq);

var version = "2.0.3";

var version$1 = version; // T H E   M A I N   F U N C T I O N   T H A T   D O E S   T H E   J O B
// -----------------------------------------------------------------------------

function allValuesEqualTo(input, value, opts) {
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return true;
    }

    if (opts.arraysMustNotContainPlaceholders && input.length > 0 && input.some(function (el) {
      return isEq__default['default'](el, value);
    })) {
      return false;
    } // so at this point
    // backwards traversal for increased performance:


    for (var i = input.length; i--;) {
      if (!allValuesEqualTo(input[i], value, opts)) {
        return false;
      }
    }

    return true;
  }

  if (isObj__default['default'](input)) {
    var keys = Object.keys(input);

    if (keys.length === 0) {
      return true;
    }

    for (var _i = keys.length; _i--;) {
      if (!allValuesEqualTo(input[keys[_i]], value, opts)) {
        return false;
      }
    }

    return true;
  }

  return isEq__default['default'](input, value);
} // T H E   E X P O S E D   W R A P P E R   F U N C T I O N
// -----------------------------------------------------------------------------
// we use this wrapper function because there will be recursive calls and it would
// be a waste of resources to perform the input checks each time within recursion


function allEq(inputOriginal, valueOriginal, originalOpts) {
  // precautions:
  if (inputOriginal === undefined) {
    throw new Error("object-all-values-equal-to: [THROW_ID_01] The first input is undefined! Please provide the first argument.");
  }

  if (valueOriginal === undefined) {
    throw new Error("object-all-values-equal-to: [THROW_ID_02] The second input is undefined! Please provide the second argument.");
  }

  if (originalOpts && !isObj__default['default'](originalOpts)) {
    throw new Error("object-all-values-equal-to: [THROW_ID_03] The third argument, options object, was given not as a plain object but as a " + typeof originalOpts + ", equal to:\n" + JSON.stringify(originalOpts, null, 4));
  } // prep opts


  var defaults = {
    arraysMustNotContainPlaceholders: true
  };

  var opts = _objectSpread__default['default'](_objectSpread__default['default']({}, defaults), originalOpts); // and finally,


  return allValuesEqualTo(inputOriginal, valueOriginal, opts);
}

exports.allEq = allEq;
exports.version = version$1;
