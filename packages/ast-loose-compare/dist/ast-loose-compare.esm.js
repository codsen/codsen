/**
 * ast-loose-compare
 * Compare anything: AST, objects, arrays and strings
 * Version: 1.8.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-loose-compare
 */

import empty from 'ast-contains-only-empty-space';

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function looseCompare(bigObj, smallObj, res) {
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
      if (
        (smallObj.length === 0 && bigObj.length === 0) ||
        (empty(smallObj) && empty(bigObj))
      ) {
        return true;
      }
      res = false;
      return false;
    }
  } else if (isObj(bigObj) && isObj(smallObj)) {
    if (Object.keys(smallObj).length > 0) {
      const keysArr = Object.keys(smallObj);
      for (i = 0, len = keysArr.length; i < len; i++) {
        if (
          Array.isArray(smallObj[keysArr[i]]) ||
          isObj(smallObj[keysArr[i]]) ||
          typeof smallObj[keysArr[i]] === "string"
        ) {
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
      if (
        (Object.keys(smallObj).length === 0 &&
          Object.keys(bigObj).length === 0) ||
        (empty(smallObj) && empty(bigObj))
      ) {
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
function externalApi(bigObj, smallObj) {
  return looseCompare(bigObj, smallObj);
}

export default externalApi;
