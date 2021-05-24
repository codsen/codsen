/**
 * @name ast-loose-compare
 * @fileoverview Compare anything: AST, objects, arrays and strings
 * @version 2.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ast-loose-compare/}
 */

import { empty } from 'ast-contains-only-empty-space';
import isObj from 'lodash.isplainobject';

var version$1 = "2.1.0";

const version = version$1;
function internalCompare(bigObj, smallObj, res) {
  function existy(x) {
    return x != null;
  }
  let i;
  let len;
  if (res === undefined) {
    if (!existy(bigObj) || !existy(smallObj)) {
      return undefined;
    }
  } else if (!existy(bigObj) || !existy(smallObj)) {
    return false;
  }
  res = res || true;
  if (typeof bigObj !== typeof smallObj) {
    if (empty(bigObj) && empty(smallObj)) {
      return true;
    }
    return false;
  }
  if (Array.isArray(bigObj) && Array.isArray(smallObj)) {
    if (smallObj.length > 0) {
      for (i = 0, len = smallObj.length; i < len; i++) {
        if (Array.isArray(smallObj[i]) || isObj(smallObj[i])) {
          res = internalCompare(bigObj[i], smallObj[i], res);
          if (!res) {
            return false;
          }
        } else if (smallObj[i] !== bigObj[i]) {
          if (empty(smallObj[i]) && empty(bigObj[i])) {
            return true;
          }
          return false;
        }
      }
    } else {
      if (smallObj.length === 0 && bigObj.length === 0 || empty(smallObj) && empty(bigObj)) {
        return true;
      }
      return false;
    }
  } else if (isObj(bigObj) && isObj(smallObj)) {
    if (Object.keys(smallObj).length > 0) {
      const keysArr = Object.keys(smallObj);
      for (i = 0, len = keysArr.length; i < len; i++) {
        /* istanbul ignore else */
        if (Array.isArray(smallObj[keysArr[i]]) || isObj(smallObj[keysArr[i]]) || typeof smallObj[keysArr[i]] === "string") {
          res = internalCompare(bigObj[keysArr[i]], smallObj[keysArr[i]], res);
          if (!res) {
            return false;
          }
        } else if (smallObj[keysArr[i]] !== bigObj[keysArr[i]]) {
          if (!empty(smallObj[keysArr[i]]) || !empty(bigObj[keysArr[i]])) {
            return false;
          }
        }
      }
    } else {
      if (Object.keys(smallObj).length === 0 && Object.keys(bigObj).length === 0 || empty(smallObj) && empty(bigObj)) {
        return true;
      }
      return false;
    }
  } else if (typeof bigObj === "string" && typeof smallObj === "string") {
    /* istanbul ignore else */
    if (bigObj !== smallObj) {
      if (empty(smallObj) && empty(bigObj)) {
        return true;
      }
      return false;
    }
  } else {
    if (empty(smallObj) && empty(bigObj)) {
      return true;
    }
    return false;
  }
  return res;
}
function looseCompare(bigObj, smallObj) {
  return internalCompare(bigObj, smallObj);
}

export { looseCompare, version };
