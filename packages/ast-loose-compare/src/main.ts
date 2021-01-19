import { empty } from "ast-contains-only-empty-space";
import isObj from "lodash.isplainobject";
import { version as v } from "../package.json";
const version: string = v;

/* eslint no-use-before-define: 0 */
// From "type-fest" by Sindre Sorhus:
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [Key in string]?: JsonValue };
type JsonArray = Array<JsonValue>;

interface UnknownValueObj {
  [key: string]: any;
}

// we use internal function to shield the third input arg from the outside api
function internalCompare(
  bigObj: JsonValue,
  smallObj: JsonValue,
  res?: boolean
): boolean | undefined {
  function existy(x: any): boolean {
    return x != null;
  }
  let i;
  let len;
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
  if (typeof bigObj !== typeof smallObj) {
    if (empty(bigObj) && empty(smallObj)) {
      return true;
    }
    return false;
  }
  // if both are arrays
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
      if (
        (smallObj.length === 0 && bigObj.length === 0) ||
        (empty(smallObj) && empty(bigObj))
      ) {
        return true;
      }
      return false;
    }
  } else if (isObj(bigObj) && isObj(smallObj)) {
    // if both are plain objects
    if (Object.keys(smallObj as UnknownValueObj).length > 0) {
      const keysArr = Object.keys(smallObj as UnknownValueObj);
      for (i = 0, len = keysArr.length; i < len; i++) {
        /* istanbul ignore else */
        if (
          Array.isArray((smallObj as UnknownValueObj)[keysArr[i]]) ||
          isObj((smallObj as UnknownValueObj)[keysArr[i]]) ||
          typeof (smallObj as UnknownValueObj)[keysArr[i]] === "string"
        ) {
          res = internalCompare(
            (bigObj as UnknownValueObj)[keysArr[i]],
            (smallObj as UnknownValueObj)[keysArr[i]],
            res
          );
          if (!res) {
            return false;
          }
        } else if (
          (smallObj as UnknownValueObj)[keysArr[i]] !==
          (bigObj as UnknownValueObj)[keysArr[i]]
        ) {
          if (
            !empty((smallObj as UnknownValueObj)[keysArr[i]]) ||
            !empty((bigObj as UnknownValueObj)[keysArr[i]])
          ) {
            return false;
          }
        }
      }
    } else {
      if (
        (Object.keys(smallObj as UnknownValueObj).length === 0 &&
          Object.keys(bigObj as UnknownValueObj).length === 0) ||
        (empty(smallObj) && empty(bigObj))
      ) {
        return true;
      }
      return false;
    }
  } else if (typeof bigObj === "string" && typeof smallObj === "string") {
    // if both are strings
    /* istanbul ignore else */
    if (bigObj !== smallObj) {
      if (empty(smallObj) && empty(bigObj)) {
        return true;
      }
      return false;
    }
  } else {
    // or if both are empty
    if (empty(smallObj) && empty(bigObj)) {
      return true;
    }
    return false;
  }
  return res;
}

function looseCompare(
  bigObj: JsonValue,
  smallObj: JsonValue
): boolean | undefined {
  return internalCompare(bigObj, smallObj);
}

export { looseCompare, version };
