/**
 * json-variables
 * It's like SASS variables, but for JSON
 * Version: 8.0.56
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/json-variables
 */

import clone from 'lodash.clonedeep';
import traverse from 'ast-monkey-traverse';
import matcher from 'matcher';
import objectPath from 'object-path';
import arrayiffyIfString from 'arrayiffy-if-string';
import strFindHeadsTails from 'string-find-heads-tails';
import get from 'ast-get-values-by-key';
import Ranges from 'ranges-push';
import rangesApply from 'ranges-apply';
import isObj from 'lodash.isplainobject';
import removeDuplicateHeadsTails from 'string-remove-duplicate-heads-tails';
import { matchRightIncl, matchLeftIncl } from 'string-match-left-right';

const isArr = Array.isArray;
const has = Object.prototype.hasOwnProperty;
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}
function isBool(something) {
  return typeof something === "boolean";
}
function isNull(something) {
  return something === null;
}
function existy(x) {
  return x != null;
}
function trimIfString(something) {
  return isStr(something) ? something.trim() : something;
}
function getTopmostKey(str) {
  if (typeof str === "string" && str.length > 0 && str.indexOf(".") !== -1) {
    for (let i = 0, len = str.length; i < len; i++) {
      if (str[i] === ".") {
        return str.slice(0, i);
      }
    }
  }
  return str;
}
function withoutTopmostKey(str) {
  if (typeof str === "string" && str.length > 0 && str.indexOf(".") !== -1) {
    for (let i = 0, len = str.length; i < len; i++) {
      if (str[i] === ".") {
        return str.slice(i + 1);
      }
    }
  }
  return str;
}
function goLevelUp(str) {
  if (typeof str === "string" && str.length > 0 && str.indexOf(".") !== -1) {
    for (let i = str.length; i--; ) {
      if (str[i] === ".") {
        return str.slice(0, i);
      }
    }
  }
  return str;
}
function getLastKey(str) {
  if (typeof str === "string" && str.length > 0 && str.indexOf(".") !== -1) {
    for (let i = str.length; i--; ) {
      if (str[i] === ".") {
        return str.slice(i + 1);
      }
    }
  }
  return str;
}
function containsHeadsOrTails(str, opts) {
  if (typeof str !== "string" || str.trim().length === 0) {
    return false;
  }
  if (
    str.includes(opts.heads) ||
    str.includes(opts.tails) ||
    (isStr(opts.headsNoWrap) &&
      opts.headsNoWrap.length > 0 &&
      str.includes(opts.headsNoWrap)) ||
    (isStr(opts.tailsNoWrap) &&
      opts.tailsNoWrap.length > 0 &&
      str.includes(opts.tailsNoWrap))
  ) {
    return true;
  }
  return false;
}
function removeWrappingHeadsAndTails(str, heads, tails) {
  let tempFrom;
  let tempTo;
  if (
    typeof str === "string" &&
    str.length > 0 &&
    matchRightIncl(str, 0, heads, {
      trimBeforeMatching: true,
      cb: (char, theRemainderOfTheString, index) => {
        tempFrom = index;
        return true;
      },
    }) &&
    matchLeftIncl(str, str.length - 1, tails, {
      trimBeforeMatching: true,
      cb: (char, theRemainderOfTheString, index) => {
        tempTo = index + 1;
        return true;
      },
    })
  ) {
    return str.slice(tempFrom, tempTo);
  }
  return str;
}
function wrap(
  placementValue,
  opts,
  dontWrapTheseVars = false,
  breadCrumbPath,
  newPath,
  oldVarName
) {
  if (!opts.wrapHeadsWith) {
    opts.wrapHeadsWith = "";
  }
  if (!opts.wrapTailsWith) {
    opts.wrapTailsWith = "";
  }
  if (
    isStr(placementValue) &&
    !dontWrapTheseVars &&
    opts.wrapGlobalFlipSwitch &&
    !opts.dontWrapVars.some((val) => matcher.isMatch(oldVarName, val)) &&
    (!opts.preventDoubleWrapping ||
      (opts.preventDoubleWrapping &&
        isStr(placementValue) &&
        !placementValue.includes(opts.wrapHeadsWith) &&
        !placementValue.includes(opts.wrapTailsWith)))
  ) {
    return opts.wrapHeadsWith + placementValue + opts.wrapTailsWith;
  } else if (dontWrapTheseVars) {
    if (!isStr(placementValue)) {
      return placementValue;
    }
    const tempValue = removeDuplicateHeadsTails(placementValue, {
      heads: opts.wrapHeadsWith,
      tails: opts.wrapTailsWith,
    });
    if (!isStr(tempValue)) {
      return tempValue;
    }
    return removeWrappingHeadsAndTails(
      tempValue,
      opts.wrapHeadsWith,
      opts.wrapTailsWith
    );
  }
  return placementValue;
}
function findValues(input, varName, path, opts) {
  let resolveValue;
  if (path.indexOf(".") !== -1) {
    let currentPath = path;
    let handBrakeOff = true;
    if (
      opts.lookForDataContainers &&
      typeof opts.dataContainerIdentifierTails === "string" &&
      opts.dataContainerIdentifierTails.length > 0 &&
      !currentPath.endsWith(opts.dataContainerIdentifierTails)
    ) {
      const gotPath = objectPath.get(
        input,
        currentPath + opts.dataContainerIdentifierTails
      );
      if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
        resolveValue = objectPath.get(gotPath, varName);
        handBrakeOff = false;
      }
    }
    while (handBrakeOff && currentPath.indexOf(".") !== -1) {
      currentPath = goLevelUp(currentPath);
      if (getLastKey(currentPath) === varName) {
        throw new Error(
          `json-variables/findValues(): [THROW_ID_20] While trying to resolve: "${varName}" at path "${path}", we encountered a closed loop. The parent key "${getLastKey(
            currentPath
          )}" is called the same as the variable "${varName}" we're looking for.`
        );
      }
      if (
        opts.lookForDataContainers &&
        typeof opts.dataContainerIdentifierTails === "string" &&
        opts.dataContainerIdentifierTails.length > 0 &&
        !currentPath.endsWith(opts.dataContainerIdentifierTails)
      ) {
        const gotPath = objectPath.get(
          input,
          currentPath + opts.dataContainerIdentifierTails
        );
        if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
          resolveValue = objectPath.get(gotPath, varName);
          handBrakeOff = false;
        }
      }
      if (resolveValue === undefined) {
        const gotPath = objectPath.get(input, currentPath);
        if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
          resolveValue = objectPath.get(gotPath, varName);
          handBrakeOff = false;
        }
      }
    }
  }
  if (resolveValue === undefined) {
    const gotPath = objectPath.get(input, varName);
    if (gotPath !== undefined) {
      resolveValue = gotPath;
    }
  }
  if (resolveValue === undefined) {
    if (varName.indexOf(".") === -1) {
      const gotPathArr = get(input, varName);
      if (gotPathArr.length > 0) {
        for (let y = 0, len2 = gotPathArr.length; y < len2; y++) {
          if (
            isStr(gotPathArr[y].val) ||
            isBool(gotPathArr[y].val) ||
            isNull(gotPathArr[y].val)
          ) {
            resolveValue = gotPathArr[y].val;
            break;
          } else if (isNum(gotPathArr[y].val)) {
            resolveValue = String(gotPathArr[y].val);
            break;
          } else if (isArr(gotPathArr[y].val)) {
            resolveValue = gotPathArr[y].val.join("");
            break;
          } else {
            throw new Error(
              `json-variables/findValues(): [THROW_ID_21] While trying to resolve: "${varName}" at path "${path}", we actually found the key named ${varName}, but it was not equal to a string but to:\n${JSON.stringify(
                gotPathArr[y],
                null,
                4
              )}\nWe can't resolve a string with that! It should be a string.`
            );
          }
        }
      }
    } else {
      const gotPath = get(input, getTopmostKey(varName));
      if (gotPath.length > 0) {
        for (let y = 0, len2 = gotPath.length; y < len2; y++) {
          const temp = objectPath.get(
            gotPath[y].val,
            withoutTopmostKey(varName)
          );
          if (temp && isStr(temp)) {
            resolveValue = temp;
          }
        }
      }
    }
  }
  return resolveValue;
}
function resolveString(input, string, path, opts, incomingBreadCrumbPath = []) {
  if (incomingBreadCrumbPath.includes(path)) {
    let extra = "";
    if (incomingBreadCrumbPath.length > 1) {
      const separator = " →\n";
      extra = incomingBreadCrumbPath.reduce(
        (accum, curr, idx) =>
          accum +
          (idx === 0 ? "" : separator) +
          (curr === path ? "💥 " : "  ") +
          curr,
        " Here's the path we travelled up until we hit the recursion:\n\n"
      );
      extra += `${separator}💥 ${path}`;
    }
    throw new Error(
      `json-variables/resolveString(): [THROW_ID_19] While trying to resolve: "${string}" at path "${path}", we encountered a closed loop, the key is referencing itself."${extra}`
    );
  }
  const secretResolvedVarsStash = {};
  const breadCrumbPath = clone(incomingBreadCrumbPath);
  breadCrumbPath.push(path);
  let finalRangesArr = new Ranges();
  function processHeadsAndTails(arr, dontWrapTheseVars, wholeValueIsVariable) {
    for (let i = 0, len = arr.length; i < len; i++) {
      const obj = arr[i];
      const varName = string.slice(obj.headsEndAt, obj.tailsStartAt);
      if (varName.length === 0) {
        finalRangesArr.push(
          obj.headsStartAt,
          obj.tailsEndAt
        );
      } else if (
        has.call(secretResolvedVarsStash, varName) &&
        isStr(secretResolvedVarsStash[varName])
      ) {
        finalRangesArr.push(
          obj.headsStartAt,
          obj.tailsEndAt,
          secretResolvedVarsStash[varName]
        );
      } else {
        let resolvedValue = findValues(
          input,
          varName.trim(),
          path,
          opts
        );
        if (resolvedValue === undefined) {
          throw new Error(
            `json-variables/processHeadsAndTails(): [THROW_ID_18] We couldn't find the value to resolve the variable ${string.slice(
              obj.headsEndAt,
              obj.tailsStartAt
            )}. We're at path: "${path}".`
          );
        }
        if (
          !wholeValueIsVariable &&
          opts.throwWhenNonStringInsertedInString &&
          !isStr(resolvedValue)
        ) {
          throw new Error(
            `json-variables/processHeadsAndTails(): [THROW_ID_23] While resolving the variable ${string.slice(
              obj.headsEndAt,
              obj.tailsStartAt
            )} at path ${path}, it resolved into a non-string value, ${JSON.stringify(
              resolvedValue,
              null,
              4
            )}. This is happening because options setting "throwWhenNonStringInsertedInString" is active (set to "true").`
          );
        }
        if (isBool(resolvedValue)) {
          if (opts.resolveToBoolIfAnyValuesContainBool) {
            finalRangesArr = undefined;
            if (!opts.resolveToFalseIfAnyValuesContainBool) {
              return resolvedValue;
            }
            return false;
          }
          resolvedValue = "";
        } else if (isNull(resolvedValue) && wholeValueIsVariable) {
          finalRangesArr = undefined;
          return resolvedValue;
        } else if (isArr(resolvedValue)) {
          resolvedValue = String(resolvedValue.join(""));
        } else if (isNull(resolvedValue)) {
          resolvedValue = "";
        } else {
          resolvedValue = String(resolvedValue);
        }
        const newPath = path.includes(".")
          ? `${goLevelUp(path)}.${varName}`
          : varName;
        if (containsHeadsOrTails(resolvedValue, opts)) {
          const replacementVal = wrap(
            resolveString(
              input,
              resolvedValue,
              newPath,
              opts,
              breadCrumbPath
            ),
            opts,
            dontWrapTheseVars,
            breadCrumbPath,
            newPath,
            varName.trim()
          );
          if (isStr(replacementVal)) {
            finalRangesArr.push(
              obj.headsStartAt,
              obj.tailsEndAt,
              replacementVal
            );
          }
        } else {
          secretResolvedVarsStash[varName] = resolvedValue;
          const replacementVal = wrap(
            resolvedValue,
            opts,
            dontWrapTheseVars,
            breadCrumbPath,
            newPath,
            varName.trim()
          );
          if (isStr(replacementVal)) {
            finalRangesArr.push(
              obj.headsStartAt,
              obj.tailsEndAt,
              replacementVal
            );
          }
        }
      }
    }
    return undefined;
  }
  let foundHeadsAndTails;
  try {
    foundHeadsAndTails = strFindHeadsTails(string, opts.heads, opts.tails, {
      source: "",
      throwWhenSomethingWrongIsDetected: false,
    });
  } catch (error) {
    throw new Error(
      `json-variables/resolveString(): [THROW_ID_17] While trying to resolve string: "${string}" at path ${path}, something wrong with heads and tails was detected! Here's the internal error message:\n${error}`
    );
  }
  let wholeValueIsVariable = false;
  if (
    foundHeadsAndTails.length === 1 &&
    rangesApply(string, [
      foundHeadsAndTails[0].headsStartAt,
      foundHeadsAndTails[0].tailsEndAt,
    ]).trim() === ""
  ) {
    wholeValueIsVariable = true;
  }
  const temp1 = processHeadsAndTails(
    foundHeadsAndTails,
    false,
    wholeValueIsVariable
  );
  if (isBool(temp1)) {
    return temp1;
  } else if (isNull(temp1)) {
    return temp1;
  }
  try {
    foundHeadsAndTails = strFindHeadsTails(
      string,
      opts.headsNoWrap,
      opts.tailsNoWrap,
      { source: "", throwWhenSomethingWrongIsDetected: false }
    );
  } catch (error) {
    throw new Error(
      `json-variables/resolveString(): [THROW_ID_22] While trying to resolve string: "${string}" at path ${path}, something wrong with no-wrap heads and no-wrap tails was detected! Here's the internal error message:\n${error}`
    );
  }
  if (
    foundHeadsAndTails.length === 1 &&
    rangesApply(string, [
      foundHeadsAndTails[0].headsStartAt,
      foundHeadsAndTails[0].tailsEndAt,
    ]).trim() === ""
  ) {
    wholeValueIsVariable = true;
  }
  const temp2 = processHeadsAndTails(
    foundHeadsAndTails,
    true,
    wholeValueIsVariable
  );
  if (isBool(temp2)) {
    return temp2;
  } else if (isNull(temp2)) {
    return temp2;
  }
  if (finalRangesArr && finalRangesArr.current()) {
    return rangesApply(string, finalRangesArr.current());
  }
  return string;
}
function jsonVariables(inputOriginal, originalOpts = {}) {
  if (arguments.length === 0) {
    throw new Error(
      "json-variables/jsonVariables(): [THROW_ID_01] Alas! Inputs are missing!"
    );
  }
  if (!isObj(inputOriginal)) {
    throw new TypeError(
      `json-variables/jsonVariables(): [THROW_ID_02] Alas! The input must be a plain object! Currently it's: ${
        Array.isArray(inputOriginal) ? "array" : typeof inputOriginal
      }`
    );
  }
  if (!isObj(originalOpts)) {
    throw new TypeError(
      `json-variables/jsonVariables(): [THROW_ID_03] Alas! An Optional Options Object must be a plain object! Currently it's: ${
        Array.isArray(originalOpts) ? "array" : typeof originalOpts
      }`
    );
  }
  const input = clone(inputOriginal);
  const defaults = {
    heads: "%%_",
    tails: "_%%",
    headsNoWrap: "%%-",
    tailsNoWrap: "-%%",
    lookForDataContainers: true,
    dataContainerIdentifierTails: "_data",
    wrapHeadsWith: "",
    wrapTailsWith: "",
    dontWrapVars: [],
    preventDoubleWrapping: true,
    wrapGlobalFlipSwitch: true,
    noSingleMarkers: false,
    resolveToBoolIfAnyValuesContainBool: true,
    resolveToFalseIfAnyValuesContainBool: true,
    throwWhenNonStringInsertedInString: false,
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (!opts.dontWrapVars) {
    opts.dontWrapVars = [];
  } else if (!isArr(opts.dontWrapVars)) {
    opts.dontWrapVars = arrayiffyIfString(opts.dontWrapVars);
  }
  let culpritVal;
  let culpritIndex;
  if (
    opts.dontWrapVars.length > 0 &&
    !opts.dontWrapVars.every((el, idx) => {
      if (!isStr(el)) {
        culpritVal = el;
        culpritIndex = idx;
        return false;
      }
      return true;
    })
  ) {
    throw new Error(
      `json-variables/jsonVariables(): [THROW_ID_05] Alas! All variable names set in opts.dontWrapVars should be of a string type. Computer detected a value "${culpritVal}" at index ${culpritIndex}, which is not string but ${
        Array.isArray(culpritVal) ? "array" : typeof culpritVal
      }!`
    );
  }
  if (opts.heads === "") {
    throw new Error(
      "json-variables/jsonVariables(): [THROW_ID_06] Alas! opts.heads are empty!"
    );
  }
  if (opts.tails === "") {
    throw new Error(
      "json-variables/jsonVariables(): [THROW_ID_07] Alas! opts.tails are empty!"
    );
  }
  if (opts.lookForDataContainers && opts.dataContainerIdentifierTails === "") {
    throw new Error(
      "json-variables/jsonVariables(): [THROW_ID_08] Alas! opts.dataContainerIdentifierTails is empty!"
    );
  }
  if (opts.heads === opts.tails) {
    throw new Error(
      "json-variables/jsonVariables(): [THROW_ID_09] Alas! opts.heads and opts.tails can't be equal!"
    );
  }
  if (opts.heads === opts.headsNoWrap) {
    throw new Error(
      "json-variables/jsonVariables(): [THROW_ID_10] Alas! opts.heads and opts.headsNoWrap can't be equal!"
    );
  }
  if (opts.tails === opts.tailsNoWrap) {
    throw new Error(
      "json-variables/jsonVariables(): [THROW_ID_11] Alas! opts.tails and opts.tailsNoWrap can't be equal!"
    );
  }
  if (opts.headsNoWrap === "") {
    throw new Error(
      "json-variables/jsonVariables(): [THROW_ID_12] Alas! opts.headsNoWrap is an empty string!"
    );
  }
  if (opts.tailsNoWrap === "") {
    throw new Error(
      "json-variables/jsonVariables(): [THROW_ID_13] Alas! opts.tailsNoWrap is an empty string!"
    );
  }
  if (opts.headsNoWrap === opts.tailsNoWrap) {
    throw new Error(
      "json-variables/jsonVariables(): [THROW_ID_14] Alas! opts.headsNoWrap and opts.tailsNoWrap can't be equal!"
    );
  }
  let current;
  return traverse(input, (key, val, innerObj) => {
    if (existy(val) && containsHeadsOrTails(key, opts)) {
      throw new Error(
        `json-variables/jsonVariables(): [THROW_ID_15] Alas! Object keys can't contain variables!\nPlease check the following key: ${key}`
      );
    }
    if (val !== undefined) {
      current = val;
    } else {
      current = key;
    }
    if (current === "") {
      return current;
    }
    if (
      (opts.heads.length !== 0 &&
        trimIfString(current) === trimIfString(opts.heads)) ||
      (opts.tails.length !== 0 &&
        trimIfString(current) === trimIfString(opts.tails)) ||
      (opts.headsNoWrap.length !== 0 &&
        trimIfString(current) === trimIfString(opts.headsNoWrap)) ||
      (opts.tailsNoWrap.length !== 0 &&
        trimIfString(current) === trimIfString(opts.tailsNoWrap))
    ) {
      if (!opts.noSingleMarkers) {
        return current;
      }
      throw new Error(
        `json-variables/jsonVariables(): [THROW_ID_16] Alas! While processing the input, we stumbled upon ${trimIfString(
          current
        )} which is equal to ${
          trimIfString(current) === trimIfString(opts.heads) ? "heads" : ""
        }${trimIfString(current) === trimIfString(opts.tails) ? "tails" : ""}${
          isStr(opts.headsNoWrap) &&
          trimIfString(current) === trimIfString(opts.headsNoWrap)
            ? "headsNoWrap"
            : ""
        }${
          isStr(opts.tailsNoWrap) &&
          trimIfString(current) === trimIfString(opts.tailsNoWrap)
            ? "tailsNoWrap"
            : ""
        }. If you wouldn't have set opts.noSingleMarkers to "true" this error would not happen and computer would have left the current element (${trimIfString(
          current
        )}) alone`
      );
    }
    if (isStr(current) && containsHeadsOrTails(current, opts)) {
      return resolveString(input, current, innerObj.path, opts);
    }
    return current;
  });
}

export default jsonVariables;
