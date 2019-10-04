/**
 * edit-package-json
 * Edit package.json without parsing, as string, keep indentation etc intact
 * Version: 0.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/edit-package-json
 */

import { left, right } from 'string-left-right';
import apply from 'ranges-apply';

const isArr = Array.isArray;
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
function stringifyAndEscapeValue(something) {
  if (
    isStr(something) &&
    something.startsWith(`"`) &&
    something.endsWith(`"`)
  ) {
    return `${JSON.stringify(
      something.slice(1, something.length - 1),
      null,
      0
    )}`;
  }
  return JSON.stringify(something, null, 0);
}
function isNotEscape(str, idx) {
  return str[idx] !== "\\" || str[idx - 2] === "\\";
}
function main({ str, path, valToInsert, mode }) {
  const ranges = [];
  const badChars = ["{", "}", "[", "]", ":", ","];
  let calculatedValueToInsert = valToInsert;
  if (
    isStr(valToInsert) &&
    !valToInsert.startsWith(`"`) &&
    !valToInsert.startsWith(`{`)
  ) {
    calculatedValueToInsert = `"${valToInsert}"`;
  }
  const withinObject = [];
  const withinArray = [];
  function currentlyWithinObject() {
    /* istanbul ignore next */
    if (!withinObject.length) {
      return false;
    } else if (withinArray.length) {
      return (
        withinObject[withinObject.length - 1] >
        withinArray[withinArray.length - 1]
      );
    }
    return true;
  }
  function currentlyWithinArray() {
    if (!withinArray.length) {
      return false;
    } else if (withinObject.length) {
      return (
        withinArray[withinArray.length - 1] >
        withinObject[withinObject.length - 1]
      );
    }
    return true;
  }
  let replaceThisValue = false;
  let keyStartedAt;
  let keyEndedAt;
  let valueStartedAt;
  let valueEndedAt;
  let keyName;
  let keyValue;
  let itsTheFirstElem = false;
  let skipUntilTheFollowingIsMet;
  function reset() {
    keyStartedAt = null;
    keyEndedAt = null;
    valueStartedAt = null;
    valueEndedAt = null;
    keyName = null;
    keyValue = null;
  }
  reset();
  const currentPath = [];
  const len = str.length;
  for (let i = 0; i < len; i++) {
    if (str[i] === "{" && str[i - 1] !== "\\" && !replaceThisValue) {
      if (currentlyWithinArray()) {
        if (itsTheFirstElem) {
          currentPath.push(0);
        } else {
          currentPath[currentPath.length - 1] =
            currentPath[currentPath.length - 1] + 1;
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
    if (
      currentlyWithinArray() &&
      str[i] === "," &&
      itsTheFirstElem &&
      !(valueStartedAt && !valueEndedAt)
    ) {
      itsTheFirstElem = false;
    }
    if (
      !replaceThisValue &&
      !valueStartedAt &&
      str[i].trim().length &&
      !badChars.includes(str[i]) &&
      (currentlyWithinArray() || (!currentlyWithinArray() && keyName))
    ) {
      valueStartedAt = i;
      if (currentlyWithinArray()) {
        if (itsTheFirstElem) {
          currentPath.push(0);
          itsTheFirstElem = false;
        } else {
          currentPath[currentPath.length - 1] =
            currentPath[currentPath.length - 1] + 1;
        }
      }
    }
    if (
      !replaceThisValue &&
      (currentlyWithinArray() || (!currentlyWithinArray() && keyName)) &&
      valueStartedAt &&
      valueStartedAt < i &&
      !valueEndedAt &&
      ((str[valueStartedAt] === `"` && str[i] === `"` && str[i - 1] !== `\\`) ||
        ((str[valueStartedAt] !== `"` && !str[i].trim().length) ||
          ["}", ","].includes(str[i])))
    ) {
      keyValue = str.slice(
        valueStartedAt,
        str[valueStartedAt] === `"` ? i + 1 : i
      );
      valueEndedAt = i;
      if (
        currentlyWithinArray() &&
        (stringifyPath(path) === currentPath.join(".") ||
          currentPath.join(".").endsWith(`.${stringifyPath(path)}`))
      ) {
        replaceThisValue = true;
      }
    }
    if (
      !replaceThisValue &&
      !currentlyWithinArray() &&
      str[i] === `"` &&
      str[i - 1] !== `\\` &&
      !keyName &&
      !keyStartedAt &&
      !keyEndedAt &&
      str[i + 1]
    ) {
      keyStartedAt = i + 1;
    }
    if (
      !replaceThisValue &&
      !currentlyWithinArray() &&
      str[i] === `"` &&
      str[i - 1] !== `\\` &&
      !keyEndedAt &&
      keyStartedAt &&
      !valueStartedAt &&
      keyStartedAt < i
    ) {
      keyEndedAt = i + 1;
      keyName = str.slice(keyStartedAt, i);
      currentPath.push(keyName);
      if (
        stringifyPath(path) === currentPath.join(".") ||
        currentPath.join(".").endsWith(`.${stringifyPath(path)}`)
      ) {
        replaceThisValue = true;
      }
    }
    if (
      !replaceThisValue &&
      valueEndedAt &&
      i >= valueEndedAt &&
      str[i].trim().length
    ) {
      if (str[i] === ",") {
        if (currentlyWithinArray()) ; else {
          currentPath.pop();
        }
        reset();
      } else if (str[i] === "}") {
        reset();
        currentPath.pop();
        currentPath.pop();
      }
    }
    if (
      !replaceThisValue &&
      str[i] === "{" &&
      isStr(keyName) &&
      !valueStartedAt &&
      !keyValue
    ) {
      reset();
    }
    if (
      str[i].trim().length &&
      replaceThisValue &&
      !valueStartedAt &&
      i > keyEndedAt &&
      ![":"].includes(str[i])
    ) {
      valueStartedAt = i;
    }
    if (
      skipUntilTheFollowingIsMet &&
      str[i] === skipUntilTheFollowingIsMet &&
      isNotEscape(str, i - 1)
    ) {
      skipUntilTheFollowingIsMet = undefined;
    } else if (
      replaceThisValue &&
      !skipUntilTheFollowingIsMet &&
      !currentlyWithinArray() &&
      valueStartedAt
    ) {
      if (str[i] === "{" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = "}";
      } else if (str[i] === "[" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = "]";
      } else if (str[i] === `"` && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = `"`;
      }
    }
    if (
      replaceThisValue &&
      !skipUntilTheFollowingIsMet &&
      valueStartedAt &&
      i > valueStartedAt
    ) {
      if (
        (str[valueStartedAt] === "[" && str[i] === "]") ||
        (str[valueStartedAt] === "{" && str[i] === "}") ||
        (str[valueStartedAt] === `"` && str[i] === `"`) ||
        (str[valueStartedAt].trim().length &&
          (!str[i].trim().length ||
            (badChars.includes(str[i]) && isNotEscape(str, i - 1))))
      ) {
        if (mode === "set") {
          return `${str.slice(0, valueStartedAt)}${stringifyAndEscapeValue(
            calculatedValueToInsert
          )}${str.slice(i + (str[i].trim().length ? 1 : 0))}`;
        } else if (mode === "del") {
          let startingPoint =
            left(
              str,
              (currentlyWithinArray() ? valueStartedAt : keyStartedAt) - 1
            ) + 1;
          let endingPoint = i + (str[i].trim().length ? 1 : 0);
          if (
            str[startingPoint - 1] === "," &&
            ["}", "]"].includes(str[right(str, endingPoint - 1)])
          ) {
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
    throw new Error(
      `edit-package-json/set(): [THROW_ID_01] first input argument must be a non-empty string. It was given as ${JSON.stringify(
        str,
        null,
        4
      )} (type ${typeof str})`
    );
  }
  return main({ str, path, valToInsert, mode: "set" });
}
function del(str, path) {
  if (!isStr(str) || !str.length) {
    throw new Error(
      `edit-package-json/del(): [THROW_ID_02] first input argument must be a non-empty string. It was given as ${JSON.stringify(
        str,
        null,
        4
      )} (type ${typeof str})`
    );
  }
  return main({ str, path, mode: "del" });
}

export { del, set };
