'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isObj = _interopDefault(require('lodash.isplainobject'));
var isEq = _interopDefault(require('lodash.isequal'));
var checkTypes = _interopDefault(require('check-types-mini'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isArr = Array.isArray;

// T H E   M A I N   F U N C T I O N   T H A T   D O E S   T H E   J O B
// -----------------------------------------------------------------------------
function allValuesEqualTo(input, value, opts) {
  if (isArr(input)) {
    if (input.length === 0) {
      return true;
    }
    if (opts.arraysMustNotContainPlaceholders && input.length > 0 && input.some(function (el) {
      return isEq(el, value);
    })) {
      return false;
    }
    // so at this point
    // backwards traversal for increased performance:
    for (var i = input.length; i--;) {
      if (!allValuesEqualTo(input[i], value, opts)) {
        return false;
      }
    }
    return true;
  } else if (isObj(input)) {
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
  return isEq(input, value);
}

// T H E   E X P O S E D   W R A P P E R   F U N C T I O N
// -----------------------------------------------------------------------------
// we use this wrapper function because there will be recursive calls and it would
// be a waste of resources to perform the input checks each time within recursion

function allValuesEqualToWrapper(inputOriginal, valueOriginal, originalOpts) {
  // precautions:
  if (inputOriginal === undefined) {
    throw new Error('object-all-values-equal-to: [THROW_ID_01] The first input is undefined! Please provide the first argument.');
  }
  if (valueOriginal === undefined) {
    throw new Error('object-all-values-equal-to: [THROW_ID_02] The second input is undefined! Please provide the second argument.');
  }
  if (originalOpts !== undefined && originalOpts !== null && !isObj(originalOpts)) {
    throw new Error('object-all-values-equal-to: [THROW_ID_03] The third argument, options object, was given not as a plain object but as a ' + (typeof originalOpts === 'undefined' ? 'undefined' : _typeof(originalOpts)) + ', equal to:\n' + JSON.stringify(originalOpts, null, 4));
  }

  // prep opts
  var defaults = {
    arraysMustNotContainPlaceholders: true
  };
  var opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, { msg: 'object-all-values-equal-to: [THROW_ID_04*]' });

  // and finally,
  return allValuesEqualTo(inputOriginal, valueOriginal, opts);
}

module.exports = allValuesEqualToWrapper;
