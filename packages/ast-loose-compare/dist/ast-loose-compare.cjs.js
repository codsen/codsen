/**
 * @name ast-loose-compare
 * @fileoverview Compare anything: AST, objects, arrays and strings
 * @version 2.0.15
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ast-loose-compare/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = require('@babel/runtime/helpers/typeof');
var astContainsOnlyEmptySpace = require('ast-contains-only-empty-space');
var isObj = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version$1 = "2.0.15";

var version = version$1;
function internalCompare(bigObj, smallObj, res) {
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
  if (_typeof__default['default'](bigObj) !== _typeof__default['default'](smallObj)) {
    if (astContainsOnlyEmptySpace.empty(bigObj) && astContainsOnlyEmptySpace.empty(smallObj)) {
      return true;
    }
    return false;
  }
  if (Array.isArray(bigObj) && Array.isArray(smallObj)) {
    if (smallObj.length > 0) {
      for (i = 0, len = smallObj.length; i < len; i++) {
        if (Array.isArray(smallObj[i]) || isObj__default['default'](smallObj[i])) {
          res = internalCompare(bigObj[i], smallObj[i], res);
          if (!res) {
            return false;
          }
        } else if (smallObj[i] !== bigObj[i]) {
          if (astContainsOnlyEmptySpace.empty(smallObj[i]) && astContainsOnlyEmptySpace.empty(bigObj[i])) {
            return true;
          }
          return false;
        }
      }
    } else {
      if (smallObj.length === 0 && bigObj.length === 0 || astContainsOnlyEmptySpace.empty(smallObj) && astContainsOnlyEmptySpace.empty(bigObj)) {
        return true;
      }
      return false;
    }
  } else if (isObj__default['default'](bigObj) && isObj__default['default'](smallObj)) {
    if (Object.keys(smallObj).length > 0) {
      var keysArr = Object.keys(smallObj);
      for (i = 0, len = keysArr.length; i < len; i++) {
        /* istanbul ignore else */
        if (Array.isArray(smallObj[keysArr[i]]) || isObj__default['default'](smallObj[keysArr[i]]) || typeof smallObj[keysArr[i]] === "string") {
          res = internalCompare(bigObj[keysArr[i]], smallObj[keysArr[i]], res);
          if (!res) {
            return false;
          }
        } else if (smallObj[keysArr[i]] !== bigObj[keysArr[i]]) {
          if (!astContainsOnlyEmptySpace.empty(smallObj[keysArr[i]]) || !astContainsOnlyEmptySpace.empty(bigObj[keysArr[i]])) {
            return false;
          }
        }
      }
    } else {
      if (Object.keys(smallObj).length === 0 && Object.keys(bigObj).length === 0 || astContainsOnlyEmptySpace.empty(smallObj) && astContainsOnlyEmptySpace.empty(bigObj)) {
        return true;
      }
      return false;
    }
  } else if (typeof bigObj === "string" && typeof smallObj === "string") {
    /* istanbul ignore else */
    if (bigObj !== smallObj) {
      if (astContainsOnlyEmptySpace.empty(smallObj) && astContainsOnlyEmptySpace.empty(bigObj)) {
        return true;
      }
      return false;
    }
  } else {
    if (astContainsOnlyEmptySpace.empty(smallObj) && astContainsOnlyEmptySpace.empty(bigObj)) {
      return true;
    }
    return false;
  }
  return res;
}
function looseCompare(bigObj, smallObj) {
  return internalCompare(bigObj, smallObj);
}

exports.looseCompare = looseCompare;
exports.version = version;
