/**
 * ast-loose-compare
 * Compare anything: AST, objects, arrays and strings
 * Version: 1.7.55
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-loose-compare
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var empty = _interopDefault(require('ast-contains-only-empty-space'));
var isPlainObject = _interopDefault(require('lodash.isplainobject'));

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

function looseCompare(bigObj, smallObj, res) {
  function existy(x) {
    return x != null;
  }
  var i;
  var len;
  if (res === undefined) {
    if (!existy(bigObj) || !existy(smallObj)) {
      return undefined;
    }
  } else if (!existy(bigObj) || !existy(smallObj)) {
    return false;
  }
  res = res || true;
  if (_typeof(bigObj) !== _typeof(smallObj)) {
    if (empty(bigObj) && empty(smallObj)) {
      return true;
    }
    return false;
  }
  if (Array.isArray(bigObj) && Array.isArray(smallObj)) {
    if (smallObj.length > 0) {
      for (i = 0, len = smallObj.length; i < len; i++) {
        if (Array.isArray(smallObj[i]) || isPlainObject(smallObj[i])) {
          res = looseCompare(bigObj[i], smallObj[i], res);
          if (!res) {
            return false;
          }
        } else if (smallObj[i] !== bigObj[i]) {
          if (empty(smallObj[i]) && empty(bigObj[i])) {
            return true;
          }
          res = false;
          return false;
        }
      }
    } else {
      if (smallObj.length === 0 && bigObj.length === 0 || empty(smallObj) && empty(bigObj)) {
        return true;
      }
      res = false;
      return false;
    }
  } else if (isPlainObject(bigObj) && isPlainObject(smallObj)) {
    if (Object.keys(smallObj).length > 0) {
      var keysArr = Object.keys(smallObj);
      for (i = 0, len = keysArr.length; i < len; i++) {
        if (Array.isArray(smallObj[keysArr[i]]) || isPlainObject(smallObj[keysArr[i]]) || typeof smallObj[keysArr[i]] === "string") {
          res = looseCompare(bigObj[keysArr[i]], smallObj[keysArr[i]], res);
          if (!res) {
            return false;
          }
        } else if (smallObj[keysArr[i]] !== bigObj[keysArr[i]]) {
          if (!empty(smallObj[keysArr[i]]) || !empty(bigObj[keysArr[i]])) {
            res = false;
            return false;
          }
        }
      }
    } else {
      if (Object.keys(smallObj).length === 0 && Object.keys(bigObj).length === 0 || empty(smallObj) && empty(bigObj)) {
        return true;
      }
      res = false;
      return false;
    }
  } else if (typeof bigObj === "string" && typeof smallObj === "string") {
    if (bigObj !== smallObj) {
      if (empty(smallObj) && empty(bigObj)) {
        return true;
      }
      res = false;
      return false;
    }
  } else {
    if (empty(smallObj) && empty(bigObj)) {
      return true;
    }
    res = false;
    return false;
  }
  return res;
}

module.exports = looseCompare;
