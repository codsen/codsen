/**
 * edit-package-json
 * Edit package.json without parsing, as string, to keep the formatting intact
 * Version: 0.2.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/edit-package-json/
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
  }
  if (isStr(something)) {
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
    if (str[i] !== " ") ;
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
  const withinObjectIndexes = [];
  const withinArrayIndexes = [];
  let currentlyWithinObject = false;
  let currentlyWithinArray = false;
  let replaceThisValue = false;
  let keyStartedAt;
  let keyEndedAt;
  let valueStartedAt;
  let valueEndedAt;
  let keyName;
  let keyValue;
  let withinQuotesSince;
  let itsTheFirstElem = false;
  const skipUntilTheFollowingIsMet = [];
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
        str[i] && str[i].trim() ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );
    if (!isNum(withinQuotesSince) && str[i - 1] === "[") {
      currentlyWithinArray = true;
      if (str[i] !== "]") {
        currentlyWithinObject = false;
      }
    }
    if (!isNum(withinQuotesSince) && str[i - 1] === "{") {
      currentlyWithinObject = true;
      if (str[i] !== "}") {
        currentlyWithinArray = false;
      }
    }
    if (
      !isNum(withinQuotesSince) &&
      str[i] === "{" &&
      isNotEscape(str, i - 1) &&
      !replaceThisValue
    ) {
      if (currentlyWithinArray) {
        if (!itsTheFirstElem) {
          log(
            `198 ${`\u001b[${33}m${`currentPath`}\u001b[${39}m`} = ${JSON.stringify(
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
      withinObjectIndexes.push(i);
      log(
        `215 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`withinObjectIndexes`}\u001b[${39}m`} = ${JSON.stringify(
          withinObjectIndexes,
          null,
          4
        )}`
      );
    }
    if (
      !isNum(withinQuotesSince) &&
      str[i] === "}" &&
      isNotEscape(str, i - 1) &&
      !replaceThisValue
    ) {
      withinObjectIndexes.pop();
      log(
        `231 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} ${`\u001b[${33}m${`withinObjectIndexes`}\u001b[${39}m`} = ${JSON.stringify(
          withinObjectIndexes,
          null,
          4
        )}`
      );
    }
    if (
      !isNum(withinQuotesSince) &&
      str[i] === "]" &&
      isNotEscape(str, i - 1) &&
      !replaceThisValue
    ) {
      withinArrayIndexes.pop();
      log(
        `248 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} ${`\u001b[${33}m${`withinArrayIndexes`}\u001b[${39}m`} = ${JSON.stringify(
          withinArrayIndexes,
          null,
          4
        )}`
      );
      currentPath.pop();
      log(`256 POP path, now = ${JSON.stringify(currentPath, null, 4)}`);
      log();
      reset();
      if (itsTheFirstElem) {
        itsTheFirstElem = false;
        log();
      }
    }
    if (!isNum(withinQuotesSince) && str[i] === "]") {
      if (!withinArrayIndexes.length) {
        currentlyWithinArray = false;
        if (withinObjectIndexes.length && !currentlyWithinObject) {
          currentlyWithinObject = true;
        }
      } else if (
        withinArrayIndexes.length &&
        (!withinObjectIndexes.length ||
          withinArrayIndexes[withinArrayIndexes.length - 1] >
            withinObjectIndexes[withinObjectIndexes.length - 1])
      ) {
        currentlyWithinArray = true;
      }
    }
    if (!isNum(withinQuotesSince) && str[i] === "}") {
      if (!withinObjectIndexes.length) {
        currentlyWithinObject = false;
      } else if (
        !withinArrayIndexes.length ||
        withinObjectIndexes[withinObjectIndexes.length - 1] >
          withinArrayIndexes[withinArrayIndexes.length - 1]
      ) {
        currentlyWithinObject = true;
      }
    }
    if (
      currentlyWithinArray &&
      stringifyPath(path) === currentPath.join(".") &&
      !replaceThisValue &&
      str[i].trim()
    ) {
      replaceThisValue = true;
      log();
      valueStartedAt = i;
      log();
    }
    if (
      !isNum(withinQuotesSince) &&
      str[i] === "[" &&
      isNotEscape(str, i - 1) &&
      !replaceThisValue
    ) {
      withinArrayIndexes.push(i);
      itsTheFirstElem = true;
      log(
        `348 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`withinArrayIndexes`}\u001b[${39}m`} = ${JSON.stringify(
          withinArrayIndexes,
          null,
          4
        )}; ${`\u001b[${33}m${`itsTheFirstElem`}\u001b[${39}m`} = ${itsTheFirstElem}`
      );
      currentPath.push(0);
      log(
        `359 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} zero to path, now = ${JSON.stringify(
          currentPath,
          null,
          0
        )}`
      );
    }
    if (
      currentlyWithinArray &&
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
      str[i].trim() &&
      !badChars.includes(str[i]) &&
      (currentlyWithinArray || (!currentlyWithinArray && keyName))
    ) {
      log();
      valueStartedAt = i;
      log();
      if (currentlyWithinArray) {
        if (itsTheFirstElem) {
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
      !isNum(withinQuotesSince) &&
      (currentlyWithinArray || (!currentlyWithinArray && keyName)) &&
      valueStartedAt &&
      valueStartedAt < i &&
      !valueEndedAt &&
      ((str[valueStartedAt] === `"` && str[i] === `"` && str[i - 1] !== `\\`) ||
        (str[valueStartedAt] !== `"` && !str[i].trim()) ||
        ["}", ","].includes(str[i]))
    ) {
      log();
      keyValue = str.slice(
        valueStartedAt,
        str[valueStartedAt] === `"` ? i + 1 : i
      );
      log();
      valueEndedAt = i;
      log();
    }
    if (
      !replaceThisValue &&
      !currentlyWithinArray &&
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
      !currentlyWithinArray &&
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
      log(`506 PUSH to path, now = ${JSON.stringify(currentPath, null, 4)}`);
      if (
        stringifyPath(path) === currentPath.join(".")
      ) {
        replaceThisValue = true;
        log();
      }
    }
    if (
      !replaceThisValue &&
      !isNum(withinQuotesSince) &&
      str[i] === "," &&
      currentlyWithinObject
    ) {
      currentPath.pop();
      log(
        `535 POP(), now ${`\u001b[${33}m${`currentPath`}\u001b[${39}m`} = ${JSON.stringify(
          currentPath,
          null,
          0
        )}`
      );
    }
    if (
      !replaceThisValue &&
      ((valueEndedAt && i >= valueEndedAt) ||
        (["}", "]"].includes(str[left(str, i)]) &&
          ["}", "]"].includes(str[i])) ||
        (str[i] === "}" && str[left(str, i)] === "{")) &&
      str[i].trim()
    ) {
      log();
      if (str[i] === "," && !["}", "]"].includes(str[right(str, i)])) {
        log();
        reset();
      } else if (str[i] === "}") {
        log();
        if (valueEndedAt || str[left(str, i)] !== "{") {
          currentPath.pop();
          log(
            `569 POP(), now ${`\u001b[${33}m${`currentPath`}\u001b[${39}m`} = ${JSON.stringify(
              currentPath,
              null,
              0
            )}`
          );
        }
        log();
        log();
        if (
          withinArrayIndexes.length &&
          withinObjectIndexes.length &&
          withinArrayIndexes[withinArrayIndexes.length - 1] >
            withinObjectIndexes[withinObjectIndexes.length - 1]
        ) {
          currentlyWithinObject = false;
          currentlyWithinArray = true;
        }
        log();
        reset();
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
      str[i].trim() &&
      replaceThisValue &&
      !valueStartedAt &&
      i > keyEndedAt &&
      ![":"].includes(str[i])
    ) {
      valueStartedAt = i;
      log();
    }
    if (
      str[i] === `"` &&
      isNotEscape(str, i - 1) &&
      ((isNum(keyStartedAt) && !keyEndedAt) ||
        (isNum(valueStartedAt) && !valueEndedAt)) &&
      !isNum(withinQuotesSince)
    ) {
      withinQuotesSince = i;
      log();
    }
    if (
      skipUntilTheFollowingIsMet.length &&
      str[i] ===
        skipUntilTheFollowingIsMet[skipUntilTheFollowingIsMet.length - 1] &&
      isNotEscape(str, i - 1)
    ) {
      skipUntilTheFollowingIsMet.pop();
      log(
        `677 ${`\u001b[${32}m${`POP`}\u001b[${39}m`} skipUntilTheFollowingIsMet = ${JSON.stringify(
          skipUntilTheFollowingIsMet,
          null,
          4
        )}`
      );
    } else if (
      (!withinQuotesSince || withinQuotesSince === i) &&
      replaceThisValue &&
      !currentlyWithinArray &&
      valueStartedAt
    ) {
      if (str[i] === "{" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet.push("}");
        log(
          `695 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`skipUntilTheFollowingIsMet`}\u001b[${39}m`} = ${JSON.stringify(
            skipUntilTheFollowingIsMet,
            null,
            4
          )}`
        );
      } else if (str[i] === "[" && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet.push("]");
        log(
          `705 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`skipUntilTheFollowingIsMet`}\u001b[${39}m`} = ${JSON.stringify(
            skipUntilTheFollowingIsMet,
            null,
            4
          )}`
        );
      } else if (str[i] === `"` && isNotEscape(str, i - 1)) {
        skipUntilTheFollowingIsMet.push(`"`);
        log(
          `715 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`skipUntilTheFollowingIsMet`}\u001b[${39}m`} = ${JSON.stringify(
            skipUntilTheFollowingIsMet,
            null,
            4
          )}`
        );
      }
    }
    if (
      str[i] === `"` &&
      isNotEscape(str, i - 1) &&
      isNum(withinQuotesSince) &&
      withinQuotesSince !== i
    ) {
      withinQuotesSince = undefined;
      log();
    }
    if (
      replaceThisValue &&
      isArr(skipUntilTheFollowingIsMet) &&
      !skipUntilTheFollowingIsMet.length &&
      valueStartedAt &&
      i > valueStartedAt
    ) {
      log();
      if (
        !withinQuotesSince &&
        ((str[valueStartedAt] === "[" && str[i] === "]") ||
          (str[valueStartedAt] === "{" && str[i] === "}") ||
          (str[valueStartedAt] === `"` && str[i] === `"`) ||
          (!["[", "{", `"`].includes(str[valueStartedAt]) &&
            str[valueStartedAt].trim() &&
            (!str[i].trim() ||
              (badChars.includes(str[i]) && isNotEscape(str, i - 1)))))
      ) {
        log(
          `780 INSIDE CATCH-END CLAUSES currently ${`\u001b[${33}m${`str[valueStartedAt=${valueStartedAt}]`}\u001b[${39}m`} = ${JSON.stringify(
            str[valueStartedAt],
            null,
            4
          )}`
        );
        if (mode === "set") {
          log();
          let extraLineBreak = "";
          if (
            str
              .slice(valueStartedAt, i + (str[i].trim() ? 1 : 0))
              .includes("\n") &&
            str[i + (str[i].trim() ? 1 : 0)] !== "\n"
          ) {
            extraLineBreak = "\n";
          }
          let endingPartsBeginning = i + (str[i].trim() ? 1 : 0);
          if (
            (currentlyWithinArray &&
              ![`"`, `[`, `{`].includes(str[valueStartedAt]) &&
              str[right(str, endingPartsBeginning - 1)] !== "]") ||
            (str[endingPartsBeginning - 1] === "," &&
              str[valueStartedAt - 1] !== `"`)
          ) {
            endingPartsBeginning -= 1;
          }
          if (currentlyWithinArray && str[valueStartedAt - 1] === `"`) {
            valueStartedAt -= 1;
          }
          return `${str.slice(0, valueStartedAt)}${stringifyAndEscapeValue(
            calculatedValueToInsert
          )}${extraLineBreak}${str.slice(endingPartsBeginning)}`;
        }
        if (mode === "del") {
          log();
          log(
            `851 ${`\u001b[${33}m${`keyStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
              keyStartedAt,
              null,
              4
            )}; val = ${
              (currentlyWithinArray ? valueStartedAt : keyStartedAt) - 1
            }`
          );
          let startingPoint =
            left(
              str,
              (currentlyWithinArray ? valueStartedAt : keyStartedAt) - 1
            ) + 1;
          log();
          let endingPoint = i + (str[i].trim() ? 1 : 0);
          if (
            str[startingPoint - 1] === "," &&
            ["}", "]"].includes(str[right(str, endingPoint - 1)])
          ) {
            startingPoint -= 1;
            log();
          }
          if (str[endingPoint] === ",") {
            endingPoint += 1;
            log();
          }
          log(
            `883 ${`\u001b[${33}m${`startingPoint`}\u001b[${39}m`} = ${JSON.stringify(
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
            `896 ${`\u001b[${32}m${`FINAL PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
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
    log(
      `${`\u001b[${withinQuotesSince ? 32 : 31}m${`withinQuotesSince${
        isNum(withinQuotesSince) ? `=${withinQuotesSince}` : ""
      }`}\u001b[${39}m`}; ${`\u001b[${
        currentlyWithinObject ? 32 : 31
      }m${`currentlyWithinObject`}\u001b[${39}m`}; ${`\u001b[${
        currentlyWithinArray ? 32 : 31
      }m${`currentlyWithinArray`}\u001b[${39}m`}; ${`\u001b[${
        replaceThisValue ? 32 : 31
      }m${`replaceThisValue`}\u001b[${39}m`}; ${`\u001b[${
        itsTheFirstElem ? 32 : 31
      }m${`itsTheFirstElem`}\u001b[${39}m`}; ${`\u001b[${
        skipUntilTheFollowingIsMet.length ? 32 : 31
      }m${`skipUntilTheFollowingIsMet${
        skipUntilTheFollowingIsMet
          ? `: ${JSON.stringify(skipUntilTheFollowingIsMet, null, 0)}`
          : ""
      }`}\u001b[${39}m`}`
    );
    log(`current path: ${JSON.stringify(currentPath.join("."), null, 0)}`);
    log();
    log(
      `${`\u001b[${33}m${`withinArrayIndexes`}\u001b[${39}m`} = ${JSON.stringify(
        withinArrayIndexes,
        null,
        0
      )}; ${`\u001b[${33}m${`withinObjectIndexes`}\u001b[${39}m`} = ${JSON.stringify(
        withinObjectIndexes,
        null,
        0
      )};`
    );
  }
  log();
  log(`947 RETURN applied ${JSON.stringify(apply(str, ranges), null, 4)}`);
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
