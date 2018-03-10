import empty from 'ast-contains-only-empty-space';
import isString from 'lodash.isstring';
import isPlainObject from 'lodash.isplainobject';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function looseCompare(bigObj, smallObj, res) {
  function existy(x) {
    return x != null;
  }
  var i = void 0;
  var len = void 0;
  // precautions
  if (res === undefined) {
    // means original cycle, function is called first time from outside
    if (!existy(bigObj) || !existy(smallObj)) {
      return undefined;
    }
  } else if (!existy(bigObj) || !existy(smallObj)) {
    // means it's inner cycle, outside doesn't use res
    // false because it's for recursion
    return false;
  }
  res = res || true;
  if ((typeof bigObj === 'undefined' ? 'undefined' : _typeof(bigObj)) !== (typeof smallObj === 'undefined' ? 'undefined' : _typeof(smallObj))) {
    if (empty(bigObj) && empty(smallObj)) {
      return true;
    }
    return false;
  }
  // if both are arrays
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
    // if both are plain objects
    if (Object.keys(smallObj).length > 0) {
      var keysArr = Object.keys(smallObj);
      for (i = 0, len = keysArr.length; i < len; i++) {
        if (Array.isArray(smallObj[keysArr[i]]) || isPlainObject(smallObj[keysArr[i]]) || isString(smallObj[keysArr[i]])) {
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
  } else if (isString(bigObj) && isString(smallObj)) {
    // if both are strings
    if (bigObj !== smallObj) {
      if (empty(smallObj) && empty(bigObj)) {
        return true;
      }
      res = false;
      return false;
    }
  } else {
    // or if both are empty
    if (empty(smallObj) && empty(bigObj)) {
      return true;
    }
    res = false;
    return false;
  }
  return res;
}

export default looseCompare;
