/**
 * ast-is-empty
 * Find out, is nested array/object/string/AST tree is empty
 * Version: 1.9.52
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-is-empty
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isObj = _interopDefault(require('lodash.isplainobject'));

function isEmpty(input) {
  var i;
  var len;
  var res = true;
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return true;
    }
    for (i = 0, len = input.length; i < len; i++) {
      res = isEmpty(input[i]);
      if (res === null) {
        return null;
      } else if (!res) {
        return false;
      }
    }
  } else if (isObj(input)) {
    if (Object.keys(input).length === 0) {
      return true;
    }
    for (i = 0, len = Object.keys(input).length; i < len; i++) {
      res = isEmpty(input[Object.keys(input)[i]]);
      if (res === null) {
        return null;
      } else if (!res) {
        return false;
      }
    }
  } else if (typeof input === "string") {
    if (input.length !== 0) {
      return false;
    }
  } else {
    return null;
  }
  return res;
}

module.exports = isEmpty;
