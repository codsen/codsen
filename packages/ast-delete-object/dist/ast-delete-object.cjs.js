/**
 * ast-delete-object
 * Delete all plain objects that contain a certain key/value pair
 * Version: 1.8.58
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-delete-object
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('lodash.clonedeep'));
var compare = _interopDefault(require('ast-compare'));
var traverse = _interopDefault(require('ast-monkey-traverse'));

function _typeof(obj) {
  "@babel/helpers - typeof";

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

function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function deleteObj(originalInput, objToDelete, originalOpts) {
  function existy(x) {
    return x != null;
  }
  if (!existy(originalInput)) {
    throw new Error("ast-delete-object/deleteObj(): [THROW_ID_01] Missing input!");
  }
  if (!existy(objToDelete)) {
    throw new Error("ast-delete-object/deleteObj(): [THROW_ID_02] Missing second argument, object to search for and delete!");
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error("ast-delete-object/deleteObj(): [THROW_ID_03] Third argument, options object, must be an object!");
  }
  var defaults = {
    matchKeysStrictly: false,
    hungryForWhitespace: false
  };
  var opts = Object.assign({}, defaults, originalOpts);
  var input = clone(originalInput);
  var current;
  if (compare(input, objToDelete, {
    hungryForWhitespace: opts.hungryForWhitespace,
    matchStrictly: opts.matchKeysStrictly
  })) {
    return {};
  }
  input = traverse(input, function (key, val) {
    current = val !== undefined ? val : key;
    if (isObj(current)) {
      if (isObj(objToDelete) && Object.keys(objToDelete).length === 0 && isObj(current) && Object.keys(current).length === 0) {
        return NaN;
      } else if (compare(current, objToDelete, {
        hungryForWhitespace: opts.hungryForWhitespace,
        matchStrictly: opts.matchKeysStrictly
      })) {
        return NaN;
      }
    }
    return current;
  });
  return input;
}

module.exports = deleteObj;
