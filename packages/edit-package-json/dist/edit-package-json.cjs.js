/**
 * edit-package-json
 * Edit package.json without parsing, as string, keep indentation etc intact
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/edit-package-json
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

var isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}
function stringifyPath(something) {
  if (isArr(something)) {
    return something.join(".");
  } else if (isStr(something)) {
    return something;
  }
  return String(something);
}
function isNotEscpe(str, idx) {
  return idx !== "\\" || str[idx - 2] === "\\";
}
function set(str, path, valToInsert) {
  if (!isStr(str) || !str.length) {
    throw new Error("edit-package-json: [THROW_ID_01] first input argument must be a non-empty string. It was given as ".concat(JSON.stringify(str, null, 4), " (type ").concat(_typeof(str), ")"));
  }
  var badChars = ["{", "}", "[", "]", ":"];
  var calculatedValueToInsert = valToInsert;
  if (isStr(valToInsert) && !valToInsert.startsWith("\"") && !valToInsert.startsWith("{")) {
    calculatedValueToInsert = "\"".concat(valToInsert, "\"");
  }
  var currentlyWithinObject = false;
  var currentlyWithinArray = false;
  var replaceThisValue = false;
  var keyStartedAt;
  var keyEndedAt;
  var valueStartedAt;
  var valueEndedAt;
  var keyName;
  var keyValue;
  function reset() {
    keyStartedAt = null;
    keyEndedAt = null;
    valueStartedAt = null;
    valueEndedAt = null;
    keyName = null;
    keyValue = null;
  }
  reset();
  var currentPath = [];
  var len = str.length;
  for (var i = 0; i < len; i++) {
    if (str[i] === "{" && str[i - 1] !== "\\" && !currentlyWithinObject && !replaceThisValue) {
      currentlyWithinObject = true;
    }
    if (str[i] === "}" && str[i - 1] !== "\\" && currentlyWithinObject && !replaceThisValue) {
      currentlyWithinObject = false;
    }
    if (str[i] === "[" && str[i - 1] !== "\\" && !currentlyWithinArray && !replaceThisValue) {
      currentlyWithinArray = true;
    }
    if (str[i] === "]" && str[i - 1] !== "\\" && currentlyWithinArray && !replaceThisValue) {
      currentlyWithinArray = false;
      currentPath.pop();
      reset();
    }
    if (!replaceThisValue && !valueStartedAt && str[i].trim().length && !badChars.includes(str[i]) && (currentlyWithinArray || !currentlyWithinArray && keyName)) {
      if (currentlyWithinArray) {
        currentPath.push(0);
      }
      valueStartedAt = i;
      if (currentlyWithinArray && (stringifyPath(path) === currentPath.join(".") || currentPath.join(".").endsWith(".".concat(stringifyPath(path))))) {
        replaceThisValue = true;
      }
    }
    if (!replaceThisValue && (currentlyWithinArray || !currentlyWithinArray && keyName) && valueStartedAt && valueStartedAt < i && !valueEndedAt && (str[valueStartedAt] === "\"" && str[i] === "\"" && str[i - 1] !== "\\" || str[valueStartedAt] !== "\"" && !str[i].trim().length || ["}", ","].includes(str[i]))) {
      keyValue = str.slice(valueStartedAt, str[valueStartedAt] === "\"" ? i + 1 : i);
      valueEndedAt = i;
    }
    if (!replaceThisValue && !currentlyWithinArray && str[i] === "\"" && str[i - 1] !== "\\" && !keyName && !keyStartedAt && !keyEndedAt && str[i + 1]) {
      keyStartedAt = i + 1;
    }
    if (!replaceThisValue && !currentlyWithinArray && str[i] === "\"" && str[i - 1] !== "\\" && !keyEndedAt && keyStartedAt && !valueStartedAt && keyStartedAt < i) {
      keyEndedAt = i + 1;
      keyName = str.slice(keyStartedAt, i);
      currentPath.push(keyName);
      if (stringifyPath(path) === currentPath.join(".") || currentPath.join(".").endsWith(".".concat(stringifyPath(path)))) {
        replaceThisValue = true;
      }
    }
    if (!replaceThisValue && valueEndedAt && i >= valueEndedAt && str[i].trim().length) {
      if (str[i] === ",") {
        if (currentlyWithinArray) {
          currentPath[currentPath.length - 1] = currentPath[currentPath.length - 1] + 1;
        } else {
          currentPath.pop();
        }
        reset();
      } else if (str[i] === "}") {
        reset();
        currentPath.pop();
        currentPath.pop();
      }
    }
    if (!replaceThisValue && str[i] === "{" && isStr(keyName) && !valueStartedAt && !keyValue) {
      reset();
    }
    if (str[i].trim().length && replaceThisValue && !valueStartedAt && i > keyEndedAt && ![":"].includes(str[i])) {
      valueStartedAt = i;
    }
    if (replaceThisValue && valueStartedAt && i > valueStartedAt) {
      if (str[valueStartedAt] === "[" && str[i] === "]" || str[valueStartedAt] === "{" && str[i] === "}" || str[valueStartedAt] === "\"" && str[i] === "\"" || str[valueStartedAt].trim().length && (!str[i].trim().length || badChars.includes(str[i]) && isNotEscpe(str, i - 1))) {
        return "".concat(str.slice(0, valueStartedAt)).concat(calculatedValueToInsert).concat(str.slice(i + (str[i].trim().length ? 1 : 0)));
      }
    }
  }
  return str;
}

exports.set = set;
