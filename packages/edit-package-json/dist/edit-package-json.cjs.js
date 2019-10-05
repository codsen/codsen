/**
 * edit-package-json
 * Edit package.json without parsing, as string, keep indentation etc intact
 * Version: 0.1.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/edit-package-json
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var stringLeftRight = require('string-left-right');
var apply = _interopDefault(require('ranges-apply'));

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
function isNum(something) {
  return typeof something === "number";
}
function stringifyPath(something) {
  if (isArr(something)) {
    return something.join(".");
  } else if (isStr(something)) {
    return something;
  }
  return String(something);
}
function stringifyAndEscapeValue(something) {
  if (isStr(something) && something.startsWith("\"") && something.endsWith("\"")) {
    return "".concat(JSON.stringify(something.slice(1, something.length - 1), null, 0));
  }
  return JSON.stringify(something, null, 0);
}
function isNotEscape(str, idx) {
  if (str[idx] !== "\\") {
    return true;
  }
  var temp = stringLeftRight.chompLeft(str, idx, {
    mode: 1
  }, "\\");
  if (isNum(temp) && (idx - temp) % 2 !== 0) {
    return true;
  }
  return false;
}
function main(_ref) {
  var str = _ref.str,
      path = _ref.path,
      valToInsert = _ref.valToInsert,
      mode = _ref.mode;
  var i;
  var len = str.length;
  var ranges = [];
  var badChars = ["{", "}", "[", "]", ":", ","];
  var calculatedValueToInsert = valToInsert;
  if (isStr(valToInsert) && !valToInsert.startsWith("\"") && !valToInsert.startsWith("{")) {
    calculatedValueToInsert = "\"".concat(valToInsert, "\"");
  }
  var withinObject = [];
  var withinArray = [];
  function currentlyWithinObject() {
    /* istanbul ignore next */
    if (!withinObject.length) {
      return false;
    } else if (withinArray.length) {
      return (
        withinObject[withinObject.length - 1] > withinArray[withinArray.length - 1]
      );
    }
    return true;
  }
  function currentlyWithinArray() {
    if (!withinArray.length) {
      return false;
    } else if (withinObject.length) {
      return (
        withinArray[withinArray.length - 1] > withinObject[withinObject.length - 1]
      );
    }
    return true;
  }
  var replaceThisValue = false;
  var keyStartedAt;
  var keyEndedAt;
  var valueStartedAt;
  var valueEndedAt;
  var keyName;
  var keyValue;
  var withinQuotesSince;
  function withinQuotes() {
    return isNum(withinQuotesSince);
  }
  var itsTheFirstElem = false;
  var skipUntilTheFollowingIsMet;
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
  for (i = 0; i < len; i++) {
    if (str[i] === "\"" && isNotEscape(str, i - 1)) {
      withinQuotesSince = isNum(withinQuotesSince) ? undefined : i;
    }
    if (str[i] === "{" && str[i - 1] !== "\\" && !replaceThisValue) {
      if (currentlyWithinArray()) {
        if (itsTheFirstElem) {
          currentPath.push(0);
        } else {
          currentPath[currentPath.length - 1] = currentPath[currentPath.length - 1] + 1;
        }
      }
      withinObject.push(i);
    }
    if (str[i] === "}" && str[i - 1] !== "\\" && !replaceThisValue) {
      withinObject.pop();
    }
    if (str[i] === "[" && str[i - 1] !== "\\" && !replaceThisValue) {
      withinArray.push(i);
      itsTheFirstElem = true;
    }
    if (str[i] === "]" && str[i - 1] !== "\\" && !replaceThisValue) {
      withinArray.pop();
      currentPath.pop();
      reset();
      if (!itsTheFirstElem && currentlyWithinObject()) {
        currentPath.pop();
      }
      if (itsTheFirstElem) {
        itsTheFirstElem = false;
      }
    }
    if (currentlyWithinArray() && str[i] === "," && itsTheFirstElem && !(valueStartedAt && !valueEndedAt)
    ) {
        itsTheFirstElem = false;
      }
    if (!replaceThisValue && !valueStartedAt && str[i].trim().length && !badChars.includes(str[i]) && (currentlyWithinArray() || !currentlyWithinArray() && keyName)) {
      valueStartedAt = i;
      if (currentlyWithinArray()) {
        if (itsTheFirstElem) {
          currentPath.push(0);
          itsTheFirstElem = false;
        } else {
          currentPath[currentPath.length - 1] = currentPath[currentPath.length - 1] + 1;
        }
      }
    }
    if (!replaceThisValue && !withinQuotes() && (currentlyWithinArray() || !currentlyWithinArray() && keyName) && valueStartedAt && valueStartedAt < i && !valueEndedAt && (str[valueStartedAt] === "\"" && str[i] === "\"" && str[i - 1] !== "\\" || str[valueStartedAt] !== "\"" && !str[i].trim().length || ["}", ","].includes(str[i]))) {
      keyValue = str.slice(valueStartedAt, str[valueStartedAt] === "\"" ? i + 1 : i);
      valueEndedAt = i;
      if (currentlyWithinArray() && (stringifyPath(path) === currentPath.join(".") || currentPath.join(".").endsWith(".".concat(stringifyPath(path))))) {
        replaceThisValue = true;
      }
    }
    if (!replaceThisValue && !currentlyWithinArray() && str[i] === "\"" && str[i - 1] !== "\\" && !keyName && !keyStartedAt && !keyEndedAt && str[i + 1]) {
      keyStartedAt = i + 1;
    }
    if (!replaceThisValue && !currentlyWithinArray() && str[i] === "\"" && str[i - 1] !== "\\" && !keyEndedAt && keyStartedAt && !valueStartedAt && keyStartedAt < i) {
      keyEndedAt = i + 1;
      keyName = str.slice(keyStartedAt, i);
      currentPath.push(keyName);
      if (stringifyPath(path) === currentPath.join(".") || currentPath.join(".").endsWith(".".concat(stringifyPath(path)))) {
        replaceThisValue = true;
      }
    }
    if (!replaceThisValue && (valueEndedAt && i >= valueEndedAt || ["}", "]"].includes(str[stringLeftRight.left(str, i)]) && ["}", "]"].includes(str[i])) && str[i].trim().length) {
      if (str[i] === ",") {
        if (currentlyWithinArray()) ; else {
          currentPath.pop();
        }
        reset();
      } else if (str[i] === "}") {
        if (valueEndedAt) {
          currentPath.pop();
        }
        currentPath.pop();
        reset();
      }
    }
    if (!replaceThisValue && str[i] === "{" && isStr(keyName) && !valueStartedAt && !keyValue) {
      reset();
    }
    if (str[i].trim().length && replaceThisValue && !valueStartedAt && i > keyEndedAt && ![":"].includes(str[i])) {
      valueStartedAt = i;
    }
    if (skipUntilTheFollowingIsMet && str[i] === skipUntilTheFollowingIsMet && isNotEscape(str, i - 1)) {
      skipUntilTheFollowingIsMet = undefined;
    } else if (replaceThisValue && !skipUntilTheFollowingIsMet && !currentlyWithinArray() && valueStartedAt) {
      if (str[i] === "{" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = "}";
      } else if (str[i] === "[" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = "]";
      } else if (str[i] === "\"" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = "\"";
      }
    }
    if (replaceThisValue && !skipUntilTheFollowingIsMet && valueStartedAt && i > valueStartedAt) {
      if (str[valueStartedAt] === "[" && str[i] === "]" || str[valueStartedAt] === "{" && str[i] === "}" || str[valueStartedAt] === "\"" && str[i] === "\"" || str[valueStartedAt].trim().length && (!str[i].trim().length || badChars.includes(str[i]) && isNotEscape(str, i - 1))
      ) {
          if (mode === "set") {
            return "".concat(str.slice(0, valueStartedAt)).concat(stringifyAndEscapeValue(calculatedValueToInsert)).concat(str.slice(i + (str[i].trim().length ? 1 : 0)));
          } else if (mode === "del") {
            var startingPoint = stringLeftRight.left(str, (currentlyWithinArray() ? valueStartedAt : keyStartedAt) - 1) + 1;
            var endingPoint = i + (str[i].trim().length ? 1 : 0);
            if (str[startingPoint - 1] === "," && ["}", "]"].includes(str[stringLeftRight.right(str, endingPoint - 1)])) {
              startingPoint--;
            }
            if (str[endingPoint] === ",") {
              endingPoint++;
            }
            ranges.push([startingPoint, endingPoint]);
            break;
          }
        }
    }
  }
  return apply(str, ranges);
}
function set(str, path, valToInsert) {
  if (!isStr(str) || !str.length) {
    throw new Error("edit-package-json/set(): [THROW_ID_01] first input argument must be a non-empty string. It was given as ".concat(JSON.stringify(str, null, 4), " (type ").concat(_typeof(str), ")"));
  }
  return main({
    str: str,
    path: path,
    valToInsert: valToInsert,
    mode: "set"
  });
}
function del(str, path) {
  if (!isStr(str) || !str.length) {
    throw new Error("edit-package-json/del(): [THROW_ID_02] first input argument must be a non-empty string. It was given as ".concat(JSON.stringify(str, null, 4), " (type ").concat(_typeof(str), ")"));
  }
  return main({
    str: str,
    path: path,
    mode: "del"
  });
}

exports.del = del;
exports.set = set;
