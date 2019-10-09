/**
 * edit-package-json
 * Edit package.json without parsing, as string, keep indentation etc intact
 * Version: 0.1.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/edit-package-json
 */

import { left, right, chompLeft } from 'string-left-right';
import apply from 'ranges-apply';

const isArr = Array.isArray;
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
  if (str[idx] !== "\\") {
    return true;
  }
  const temp = chompLeft(str, idx, { mode: 1 }, "\\");
  if (isNum(temp) && (idx - temp) % 2 !== 0) {
    return true;
  }
  return false;
}
function main({ str, path, valToInsert, mode }) {
  let i;
  function log(something) {
    if (str[i] && str[i].trim().length) ;
  }
  const len = str.length;
  const ranges = [];
  log();
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
  let withinQuotesSince;
  function withinQuotes() {
    return isNum(withinQuotesSince);
  }
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
  for (i = 0; i < len; i++) {
    log(
      `\n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim().length
          ? str[i]
          : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );
    if (str[i] === `"` && isNotEscape(str, i - 1) && keyName) {
      log();
      withinQuotesSince = isNum(withinQuotesSince) ? undefined : i;
      log();
    }
    if (str[i] === "{" && str[i - 1] !== "\\" && !replaceThisValue) {
      if (currentlyWithinArray()) {
        if (itsTheFirstElem) {
          currentPath.push(0);
          log(
            `201 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} zero to path, now = ${JSON.stringify(
              currentPath,
              null,
              0
            )}`
          );
        } else {
          log(
            `209 ${`\u001b[${33}m${`currentPath`}\u001b[${39}m`} = ${JSON.stringify(
              currentPath,
              null,
              4
            )}`
          );
          currentPath[currentPath.length - 1] =
            currentPath[currentPath.length - 1] + 1;
          log();
        }
      }
      withinObject.push(i);
      log(
        `226 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinObject`}\u001b[${39}m`} = ${JSON.stringify(
          withinObject,
          null,
          4
        )}`
      );
    }
    if (str[i] === "}" && str[i - 1] !== "\\" && !replaceThisValue) {
      withinObject.pop();
      log(
        `237 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinObject`}\u001b[${39}m`} = ${JSON.stringify(
          withinObject,
          null,
          4
        )}`
      );
    }
    if (
      !isNum(withinQuotesSince) &&
      str[i] === "[" &&
      str[i - 1] !== "\\" &&
      !replaceThisValue
    ) {
      withinArray.push(i);
      itsTheFirstElem = true;
      log(
        `249 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinArray`}\u001b[${39}m`} = ${JSON.stringify(
          withinArray,
          null,
          4
        )}; ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`
      );
    }
    if (str[i] === "]" && str[i - 1] !== "\\" && !replaceThisValue) {
      withinArray.pop();
      log(
        `260 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinArray`}\u001b[${39}m`} = ${JSON.stringify(
          withinArray,
          null,
          4
        )}`
      );
      currentPath.pop();
      log(`269 POP path, now = ${JSON.stringify(currentPath, null, 4)}`);
      log();
      reset();
      if (
        currentlyWithinObject() &&
        (!itsTheFirstElem || !(str[i] === "]" && str[left(str, i)] === "["))
      ) {
        currentPath.pop();
        log(
          `286 POP path again, now = ${JSON.stringify(currentPath, null, 4)}`
        );
      }
      if (itsTheFirstElem) {
        itsTheFirstElem = false;
        log();
      }
    }
    if (
      currentlyWithinArray() &&
      str[i] === "," &&
      itsTheFirstElem &&
      !(valueStartedAt && !valueEndedAt)
    ) {
      itsTheFirstElem = false;
      log();
    }
    if (
      !replaceThisValue &&
      !valueStartedAt &&
      str[i].trim().length &&
      !badChars.includes(str[i]) &&
      (currentlyWithinArray() || (!currentlyWithinArray() && keyName))
    ) {
      log();
      valueStartedAt = i;
      log();
      if (currentlyWithinArray()) {
        if (itsTheFirstElem) {
          currentPath.push(0);
          log(
            `355 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} zero to path, now = ${JSON.stringify(
              currentPath,
              null,
              0
            )}`
          );
          itsTheFirstElem = false;
          log();
        } else {
          currentPath[currentPath.length - 1] =
            currentPath[currentPath.length - 1] + 1;
          log();
        }
      }
    }
    if (
      !replaceThisValue &&
      !withinQuotes() &&
      (currentlyWithinArray() || (!currentlyWithinArray() && keyName)) &&
      valueStartedAt &&
      valueStartedAt < i &&
      !valueEndedAt &&
      ((str[valueStartedAt] === `"` && str[i] === `"` && str[i - 1] !== `\\`) ||
        ((str[valueStartedAt] !== `"` && !str[i].trim().length) ||
          ["}", ","].includes(str[i])))
    ) {
      log();
      keyValue = str.slice(
        valueStartedAt,
        str[valueStartedAt] === `"` ? i + 1 : i
      );
      log();
      valueEndedAt = i;
      log();
      if (
        currentlyWithinArray() &&
        (stringifyPath(path) === currentPath.join(".") ||
          currentPath.join(".").endsWith(`.${stringifyPath(path)}`))
      ) {
        replaceThisValue = true;
        log();
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
      log();
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
      log();
      currentPath.push(keyName);
      log(`457 PUSH to path, now = ${JSON.stringify(currentPath, null, 4)}`);
      if (
        stringifyPath(path) === currentPath.join(".") ||
        currentPath.join(".").endsWith(`.${stringifyPath(path)}`)
      ) {
        replaceThisValue = true;
        log();
      }
    }
    if (
      !replaceThisValue &&
      ((valueEndedAt && i >= valueEndedAt) ||
        (["}", "]"].includes(str[left(str, i)]) &&
          ["}", "]"].includes(str[i])) ||
        (str[i] === "}" && str[left(str, i)] === "{")) &&
      str[i].trim().length
    ) {
      log();
      if (str[i] === ",") {
        log();
        if (currentlyWithinArray()) ; else {
          currentPath.pop();
          log(`509 POP path, now = ${JSON.stringify(currentPath, null, 4)}`);
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
        log(
          `540 POP path twice, now = ${JSON.stringify(currentPath, null, 4)}`
        );
      }
    }
    if (
      !replaceThisValue &&
      str[i] === "{" &&
      isStr(keyName) &&
      !valueStartedAt &&
      !keyValue
    ) {
      log();
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
      log();
    }
    if (
      skipUntilTheFollowingIsMet &&
      str[i] === skipUntilTheFollowingIsMet &&
      isNotEscape(str, i - 1)
    ) {
      skipUntilTheFollowingIsMet = undefined;
      log();
    } else if (
      replaceThisValue &&
      !skipUntilTheFollowingIsMet &&
      !currentlyWithinArray() &&
      valueStartedAt
    ) {
      if (str[i] === "{" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = "}";
        log();
      } else if (str[i] === "[" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = "]";
        log();
      } else if (str[i] === `"` && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet = `"`;
        log();
      }
    }
    if (
      replaceThisValue &&
      !skipUntilTheFollowingIsMet &&
      valueStartedAt &&
      i > valueStartedAt
    ) {
      log();
      if (
        (str[valueStartedAt] === "[" && str[i] === "]") ||
        (str[valueStartedAt] === "{" && str[i] === "}") ||
        (str[valueStartedAt] === `"` && str[i] === `"`) ||
        (str[valueStartedAt].trim().length &&
          (!str[i].trim().length ||
            (badChars.includes(str[i]) && isNotEscape(str, i - 1))))
      ) {
        log(
          `629 currently ${`\u001b[${33}m${`str[valueStartedAt=${valueStartedAt}]`}\u001b[${39}m`} = ${JSON.stringify(
            str[valueStartedAt],
            null,
            4
          )}`
        );
        if (mode === "set") {
          log();
          return `${str.slice(0, valueStartedAt)}${stringifyAndEscapeValue(
            calculatedValueToInsert
          )}${str.slice(i + (str[i].trim().length ? 1 : 0))}`;
        } else if (mode === "del") {
          log();
          log(
            `646 ${`\u001b[${33}m${`keyStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
              keyStartedAt,
              null,
              4
            )}; val = ${(currentlyWithinArray()
              ? valueStartedAt
              : keyStartedAt) - 1}`
          );
          let startingPoint =
            left(
              str,
              (currentlyWithinArray() ? valueStartedAt : keyStartedAt) - 1
            ) + 1;
          log();
          let endingPoint = i + (str[i].trim().length ? 1 : 0);
          if (
            str[startingPoint - 1] === "," &&
            ["}", "]"].includes(str[right(str, endingPoint - 1)])
          ) {
            startingPoint--;
            log();
          }
          if (str[endingPoint] === ",") {
            endingPoint++;
            log();
          }
          log(
            `679 ${`\u001b[${33}m${`startingPoint`}\u001b[${39}m`} = ${JSON.stringify(
              startingPoint,
              null,
              4
            )}; ${`\u001b[${33}m${`endingPoint`}\u001b[${39}m`} = ${JSON.stringify(
              endingPoint,
              null,
              4
            )};`
          );
          ranges.push([startingPoint, endingPoint]);
          log(
            `692 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
              ranges,
              null,
              4
            )}`
          );
          log();
          break;
        }
      }
    }
    log();
    log();
    log();
    log(
      `${`\u001b[${33}m${`withinArray`}\u001b[${39}m`} = ${JSON.stringify(
        withinArray,
        null,
        0
      )}; ${`\u001b[${33}m${`withinObject`}\u001b[${39}m`} = ${JSON.stringify(
        withinObject,
        null,
        0
      )};`
    );
  }
  log();
  log(`763 RETURN applied ${JSON.stringify(apply(str, ranges), null, 4)}`);
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
