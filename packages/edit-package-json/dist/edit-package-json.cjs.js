/**
 * edit-package-json
 * Edit package.json without parsing, as string, keep indentation etc intact
 * Version: 0.1.3
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
  function log(something) {
    if (str[i] && str[i].trim().length) ;
  }
  var len = str.length;
  var ranges = [];
  log();
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
    log("\n\x1B[".concat(36, "m", "===============================", "\x1B[", 39, "m \x1B[", 35, "m", "str[ ".concat(i, " ] = ").concat(str[i] && str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)), "\x1B[", 39, "m \x1B[", 36, "m", "===============================", "\x1B[", 39, "m\n"));
    if (str[i] === "\"" && isNotEscape(str, i - 1) && keyName) {
      log();
      withinQuotesSince = isNum(withinQuotesSince) ? undefined : i;
      log();
    }
    if (str[i] === "{" && str[i - 1] !== "\\" && !replaceThisValue) {
      if (currentlyWithinArray()) {
        if (itsTheFirstElem) {
          currentPath.push(0);
          log("201 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " zero to path, now = ", JSON.stringify(currentPath, null, 0)));
        } else {
          log("209 ".concat("\x1B[".concat(33, "m", "currentPath", "\x1B[", 39, "m"), " = ", JSON.stringify(currentPath, null, 4)));
          currentPath[currentPath.length - 1] = currentPath[currentPath.length - 1] + 1;
          log();
        }
      }
      withinObject.push(i);
      log("226 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "withinObject", "\x1B[", 39, "m"), " = ", JSON.stringify(withinObject, null, 4)));
    }
    if (str[i] === "}" && str[i - 1] !== "\\" && !replaceThisValue) {
      withinObject.pop();
      log("237 ".concat("\x1B[".concat(31, "m", "RESET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "withinObject", "\x1B[", 39, "m"), " = ", JSON.stringify(withinObject, null, 4)));
    }
    if (!isNum(withinQuotesSince) && str[i] === "[" && str[i - 1] !== "\\" && !replaceThisValue) {
      withinArray.push(i);
      itsTheFirstElem = true;
      log("249 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "withinArray", "\x1B[", 39, "m"), " = ", JSON.stringify(withinArray, null, 4), "; ", "\x1B[".concat(33, "m", "itsTheFirstElem", "\x1B[", 39, "m"), " = ").concat(itsTheFirstElem));
    }
    if (str[i] === "]" && str[i - 1] !== "\\" && !replaceThisValue) {
      withinArray.pop();
      log("260 ".concat("\x1B[".concat(32, "m", "SET", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "withinArray", "\x1B[", 39, "m"), " = ", JSON.stringify(withinArray, null, 4)));
      currentPath.pop();
      log("269 POP path, now = ".concat(JSON.stringify(currentPath, null, 4)));
      log();
      reset();
      if (currentlyWithinObject() && (!itsTheFirstElem || !(str[i] === "]" && str[stringLeftRight.left(str, i)] === "["))) {
        currentPath.pop();
        log("286 POP path again, now = ".concat(JSON.stringify(currentPath, null, 4)));
      }
      if (itsTheFirstElem) {
        itsTheFirstElem = false;
        log();
      }
    }
    if (currentlyWithinArray() && str[i] === "," && itsTheFirstElem && !(valueStartedAt && !valueEndedAt)
    ) {
        itsTheFirstElem = false;
        log();
      }
    if (!replaceThisValue && !valueStartedAt && str[i].trim().length && !badChars.includes(str[i]) && (currentlyWithinArray() || !currentlyWithinArray() && keyName)) {
      log();
      valueStartedAt = i;
      log();
      if (currentlyWithinArray()) {
        if (itsTheFirstElem) {
          currentPath.push(0);
          log("355 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " zero to path, now = ", JSON.stringify(currentPath, null, 0)));
          itsTheFirstElem = false;
          log();
        } else {
          currentPath[currentPath.length - 1] = currentPath[currentPath.length - 1] + 1;
          log();
        }
      }
    }
    if (!replaceThisValue && !withinQuotes() && (currentlyWithinArray() || !currentlyWithinArray() && keyName) && valueStartedAt && valueStartedAt < i && !valueEndedAt && (str[valueStartedAt] === "\"" && str[i] === "\"" && str[i - 1] !== "\\" || str[valueStartedAt] !== "\"" && !str[i].trim().length || ["}", ","].includes(str[i]))) {
      log();
      keyValue = str.slice(valueStartedAt, str[valueStartedAt] === "\"" ? i + 1 : i);
      log();
      valueEndedAt = i;
      log();
      if (currentlyWithinArray() && (stringifyPath(path) === currentPath.join(".") || currentPath.join(".").endsWith(".".concat(stringifyPath(path))))) {
        replaceThisValue = true;
        log();
      }
    }
    if (!replaceThisValue && !currentlyWithinArray() && str[i] === "\"" && str[i - 1] !== "\\" && !keyName && !keyStartedAt && !keyEndedAt && str[i + 1]) {
      keyStartedAt = i + 1;
      log();
    }
    if (!replaceThisValue && !currentlyWithinArray() && str[i] === "\"" && str[i - 1] !== "\\" && !keyEndedAt && keyStartedAt && !valueStartedAt && keyStartedAt < i) {
      keyEndedAt = i + 1;
      keyName = str.slice(keyStartedAt, i);
      log();
      currentPath.push(keyName);
      log("457 PUSH to path, now = ".concat(JSON.stringify(currentPath, null, 4)));
      if (stringifyPath(path) === currentPath.join(".") || currentPath.join(".").endsWith(".".concat(stringifyPath(path)))) {
        replaceThisValue = true;
        log();
      }
    }
    if (!replaceThisValue && (valueEndedAt && i >= valueEndedAt || ["}", "]"].includes(str[stringLeftRight.left(str, i)]) && ["}", "]"].includes(str[i]) || str[i] === "}" && str[stringLeftRight.left(str, i)] === "{") && str[i].trim().length) {
      log();
      if (str[i] === ",") {
        log();
        if (currentlyWithinArray()) ; else {
          currentPath.pop();
          log("509 POP path, now = ".concat(JSON.stringify(currentPath, null, 4)));
        }
        log();
        reset();
      } else if (str[i] === "}") {
        log();
        if (valueEndedAt) {
          log();
          currentPath.pop();
        }
        log();
        log();
        if (!currentlyWithinArray()) {
          log();
          currentPath.pop();
        }
        log();
        reset();
        log("540 POP path twice, now = ".concat(JSON.stringify(currentPath, null, 4)));
      }
    }
    if (!replaceThisValue && str[i] === "{" && isStr(keyName) && !valueStartedAt && !keyValue) {
      log();
      reset();
    }
    if (str[i].trim().length && replaceThisValue && !valueStartedAt && i > keyEndedAt && ![":"].includes(str[i])) {
      valueStartedAt = i;
      log();
    }
    if (skipUntilTheFollowingIsMet && str[i] === skipUntilTheFollowingIsMet && isNotEscape(str, i - 1)) {
      skipUntilTheFollowingIsMet = undefined;
      log();
    } else if (replaceThisValue && !skipUntilTheFollowingIsMet && !currentlyWithinArray() && valueStartedAt) {
      if (str[i] === "{" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = "}";
        log();
      } else if (str[i] === "[" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = "]";
        log();
      } else if (str[i] === "\"" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = "\"";
        log();
      }
    }
    if (replaceThisValue && !skipUntilTheFollowingIsMet && valueStartedAt && i > valueStartedAt) {
      log();
      if (str[valueStartedAt] === "[" && str[i] === "]" || str[valueStartedAt] === "{" && str[i] === "}" || str[valueStartedAt] === "\"" && str[i] === "\"" || str[valueStartedAt].trim().length && (!str[i].trim().length || badChars.includes(str[i]) && isNotEscape(str, i - 1))
      ) {
          log("629 currently ".concat("\x1B[".concat(33, "m", "str[valueStartedAt=".concat(valueStartedAt, "]"), "\x1B[", 39, "m"), " = ", JSON.stringify(str[valueStartedAt], null, 4)));
          if (mode === "set") {
            log();
            return "".concat(str.slice(0, valueStartedAt)).concat(stringifyAndEscapeValue(calculatedValueToInsert)).concat(str.slice(i + (str[i].trim().length ? 1 : 0)));
          } else if (mode === "del") {
            log();
            log("646 ".concat("\x1B[".concat(33, "m", "keyStartedAt", "\x1B[", 39, "m"), " = ", JSON.stringify(keyStartedAt, null, 4), "; val = ").concat((currentlyWithinArray() ? valueStartedAt : keyStartedAt) - 1));
            var startingPoint = stringLeftRight.left(str, (currentlyWithinArray() ? valueStartedAt : keyStartedAt) - 1) + 1;
            log();
            var endingPoint = i + (str[i].trim().length ? 1 : 0);
            if (str[startingPoint - 1] === "," && ["}", "]"].includes(str[stringLeftRight.right(str, endingPoint - 1)])) {
              startingPoint--;
              log();
            }
            if (str[endingPoint] === ",") {
              endingPoint++;
              log();
            }
            log("679 ".concat("\x1B[".concat(33, "m", "startingPoint", "\x1B[", 39, "m"), " = ", JSON.stringify(startingPoint, null, 4), "; ", "\x1B[".concat(33, "m", "endingPoint", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(endingPoint, null, 4), ";"));
            ranges.push([startingPoint, endingPoint]);
            log("692 ".concat("\x1B[".concat(32, "m", "FINAL", "\x1B[", 39, "m"), " ", "\x1B[".concat(33, "m", "ranges", "\x1B[", 39, "m"), " = ", JSON.stringify(ranges, null, 4)));
            log();
            break;
          }
        }
    }
    log();
    log();
    log();
    log("".concat("\x1B[".concat(33, "m", "withinArray", "\x1B[", 39, "m"), " = ", JSON.stringify(withinArray, null, 0), "; ", "\x1B[".concat(33, "m", "withinObject", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(withinObject, null, 0), ";"));
  }
  log();
  log("763 RETURN applied ".concat(JSON.stringify(apply(str, ranges), null, 4)));
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
