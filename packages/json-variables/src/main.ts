/* eslint max-len:0 */

import { matchLeftIncl, matchRightIncl } from "string-match-left-right";
import { remDup } from "string-remove-duplicate-heads-tails";
import { strFindHeadsTails } from "string-find-heads-tails";
import { getByKey } from "ast-get-values-by-key";
import { arrayiffy } from "arrayiffy-if-string";
import { traverse } from "ast-monkey-traverse";
import { rApply } from "ranges-apply";
import objectPath from "object-path";
import { Ranges } from "ranges-push";
import { isMatch } from "matcher";
import {
  isPlainObject as isObj,
  existy,
  isBool,
  isNull,
  isStr,
  isNum,
  Obj,
} from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;
const has = Object.prototype.hasOwnProperty;

declare let DEV: boolean;

export interface Opts {
  heads: string;
  tails: string;
  headsNoWrap: string;
  tailsNoWrap: string;
  lookForDataContainers: boolean;
  dataContainerIdentifierTails: string;
  wrapHeadsWith: string | string[];
  wrapTailsWith: string | string[];
  dontWrapVars: string[];
  preventDoubleWrapping: boolean;
  wrapGlobalFlipSwitch: boolean;
  noSingleMarkers: boolean;
  resolveToBoolIfAnyValuesContainBool: boolean;
  resolveToFalseIfAnyValuesContainBool: boolean;
  throwWhenNonStringInsertedInString: boolean;
  allowUnresolved: boolean | string;
}

const defaults: Opts = {
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
  wrapGlobalFlipSwitch: true, // is wrap function on?
  noSingleMarkers: false, // if value has only and exactly heads or tails,
  // don't throw mismatched marker error.
  resolveToBoolIfAnyValuesContainBool: true, // if variable is resolved into
  // anything that contains or is equal to Boolean false, set the whole thing to false
  resolveToFalseIfAnyValuesContainBool: true, // resolve whole value to false,
  // even if some values contain Boolean true. Otherwise, the whole value will
  // resolve to the first encountered Boolean.
  throwWhenNonStringInsertedInString: false,
  allowUnresolved: false, // Allow value to not have a resolved variable
};

// -----------------------------------------------------------------------------
//                       H E L P E R   F U N C T I O N S
// -----------------------------------------------------------------------------

// TS overloading
function trimIfString(something: string): string;
function trimIfString(something: any): any {
  return isStr(something) ? something.trim() : something;
}

function getTopmostKey(str: string): string {
  if (isStr(str) && str.length && str.indexOf(".") !== -1) {
    for (let i = 0, len = str.length; i < len; i++) {
      if (str[i] === ".") {
        return str.slice(0, i);
      }
    }
  }
  return str;
}
function withoutTopmostKey(str: string): string {
  if (isStr(str) && str.length && str.indexOf(".") !== -1) {
    for (let i = 0, len = str.length; i < len; i++) {
      if (str[i] === ".") {
        return str.slice(i + 1);
      }
    }
  }
  return str;
}
function goLevelUp(str: string): string {
  if (isStr(str) && str.length && str.indexOf(".") !== -1) {
    for (let i = str.length; i--; ) {
      if (str[i] === ".") {
        return str.slice(0, i);
      }
    }
  }
  return str;
}
function getLastKey(str: string): string {
  if (isStr(str) && str.length && str.indexOf(".") !== -1) {
    for (let i = str.length; i--; ) {
      if (str[i] === ".") {
        return str.slice(i + 1);
      }
    }
  }
  return str;
}
function containsHeadsOrTails(str: string, resolvedOpts: Opts): boolean {
  if (!isStr(str) || !str.trim()) {
    return false;
  }
  if (
    str.includes(resolvedOpts.heads) ||
    str.includes(resolvedOpts.tails) ||
    (isStr(resolvedOpts.headsNoWrap) &&
      resolvedOpts.headsNoWrap.length &&
      str.includes(resolvedOpts.headsNoWrap)) ||
    (isStr(resolvedOpts.tailsNoWrap) &&
      resolvedOpts.tailsNoWrap.length &&
      str.includes(resolvedOpts.tailsNoWrap))
  ) {
    return true;
  }
  return false;
}
function removeWrappingHeadsAndTails(
  str: string,
  heads: string | string[],
  tails: string | string[]
): string {
  let tempFrom;
  let tempTo;
  if (
    isStr(str) &&
    str.length &&
    matchRightIncl(str, 0, heads, {
      trimBeforeMatching: true,
      cb: (_c, _t, index) => {
        tempFrom = index;
        return true;
      },
    }) &&
    matchLeftIncl(str, str.length - 1, tails, {
      trimBeforeMatching: true,
      cb: (_c, _t, index) => {
        tempTo = (index || 0) + 1;
        return true;
      },
    })
  ) {
    return str.slice(tempFrom, tempTo);
  }
  return str;
}
function wrap(
  placementValue: string,
  resolvedOpts: Opts,
  dontWrapTheseVars = false,
  breadCrumbPath: string[],
  newPath: string,
  oldVarName: string
): string | false {
  DEV &&
    console.log(
      `179 >>>>>>>>>> WRAP(): placementValue = ${JSON.stringify(
        placementValue,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `187 >>>>>>>>>> WRAP(): breadCrumbPath = ${JSON.stringify(
        breadCrumbPath,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `195 >>>>>>>>>> WRAP(): newPath = ${JSON.stringify(newPath, null, 4)}`
    );
  DEV &&
    console.log(
      `199 >>>>>>>>>> WRAP(): oldVarName = ${JSON.stringify(
        oldVarName,
        null,
        4
      )}\n`
    );

  // resolvedOpts validation
  if (!resolvedOpts.wrapHeadsWith) {
    // eslint-disable-next-line no-param-reassign
    resolvedOpts.wrapHeadsWith = "";
  }
  if (!resolvedOpts.wrapTailsWith) {
    // eslint-disable-next-line no-param-reassign
    resolvedOpts.wrapTailsWith = "";
  }

  // main resolvedOpts

  if (
    isStr(placementValue) &&
    !dontWrapTheseVars &&
    resolvedOpts.wrapGlobalFlipSwitch &&
    !resolvedOpts.dontWrapVars.some((val) => isMatch(oldVarName, val)) && // considering double-wrapping prevention setting:
    (!resolvedOpts.preventDoubleWrapping ||
      (resolvedOpts.preventDoubleWrapping &&
        isStr(placementValue) &&
        !placementValue.includes(resolvedOpts.wrapHeadsWith as string) &&
        !placementValue.includes(resolvedOpts.wrapTailsWith as string)))
  ) {
    DEV && console.log("229 +++ WE WILL WRAP THIS!");
    return `${resolvedOpts.wrapHeadsWith}${placementValue}${resolvedOpts.wrapTailsWith}`;
  }
  if (dontWrapTheseVars) {
    DEV &&
      console.log(
        "\n\n\n235 💥💥💥💥💥💥 !!! dontWrapTheseVars is ON!!!\n\n\n"
      );
    DEV &&
      console.log(
        `239 placementValue = ${JSON.stringify(placementValue, null, 4)}`
      );
    DEV &&
      console.log(
        `243 resolvedOpts.wrapHeadsWith = ${JSON.stringify(
          resolvedOpts.wrapHeadsWith,
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `251 resolvedOpts.wrapTailsWith = ${JSON.stringify(
          resolvedOpts.wrapTailsWith,
          null,
          4
        )}`
      );

    DEV &&
      console.log(
        `260 about to return:\n${JSON.stringify(
          remDup(placementValue, {
            heads: resolvedOpts.wrapHeadsWith,
            tails: resolvedOpts.wrapTailsWith,
          }),
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `271 \u001b[${36}m placementValue = ${JSON.stringify(
          placementValue,
          null,
          4
        )}\u001b[${39}m`
      );
    if (!isStr(placementValue)) {
      DEV && console.log(`278 Returning placementValue = ${placementValue}`);
      return placementValue;
    }
    let tempValue = remDup(placementValue, {
      heads: resolvedOpts.wrapHeadsWith,
      tails: resolvedOpts.wrapTailsWith,
    });
    if (!isStr(tempValue)) {
      return tempValue;
    }
    return removeWrappingHeadsAndTails(
      tempValue,
      resolvedOpts.wrapHeadsWith,
      resolvedOpts.wrapTailsWith
    );
  }
  DEV && console.log("294 +++ NO WRAP");
  return placementValue;
}
function findValues(
  input: Obj,
  varName: string,
  path: string,
  resolvedOpts: Opts
): string | undefined {
  DEV &&
    console.log(
      `305 findValues(): looking for varName = ${JSON.stringify(
        varName,
        null,
        4
      )}`
    );
  DEV && console.log(`311 path = ${JSON.stringify(path, null, 4)}\n\n`);
  let resolveValue;
  // 1.1. first, traverse up to root level, looking for key right at that level
  // or within data store, respecting the config
  if (path.indexOf(".") !== -1) {
    let currentPath = path;
    // traverse upwards:
    let handBrakeOff = true;

    // first, check the current level's datastore:
    if (
      resolvedOpts.lookForDataContainers &&
      isStr(resolvedOpts.dataContainerIdentifierTails) &&
      resolvedOpts.dataContainerIdentifierTails.length &&
      !currentPath.endsWith(resolvedOpts.dataContainerIdentifierTails)
    ) {
      // 1.1.1. first check data store
      DEV && console.log("328: 1.1.0.");
      DEV &&
        console.log(
          `\n256 * datastore = ${JSON.stringify(
            currentPath + resolvedOpts.dataContainerIdentifierTails,
            null,
            4
          )}`
        );
      let gotPath = objectPath.get(
        input,
        currentPath + resolvedOpts.dataContainerIdentifierTails
      );
      DEV && console.log(`341 * gotPath = ${JSON.stringify(gotPath, null, 4)}`);
      if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
        DEV && console.log(`343 FOUND!\n${gotPath[varName]}`);
        resolveValue = objectPath.get(gotPath, varName);
        handBrakeOff = false;
      }
    }

    // then, start traversing up:
    while (handBrakeOff && currentPath.indexOf(".") !== -1) {
      currentPath = goLevelUp(currentPath);
      if (getLastKey(currentPath) === varName) {
        throw new Error(
          `json-variables/findValues(): [THROW_ID_20] While trying to resolve: "${varName}" at path "${path}", we encountered a closed loop. The parent key "${getLastKey(
            currentPath
          )}" is called the same as the variable "${varName}" we're looking for.`
        );
      }
      DEV && console.log(`359 traversing up. Currently at: ${currentPath}`);

      // first, check the current level's datastore:
      if (
        resolvedOpts.lookForDataContainers &&
        isStr(resolvedOpts.dataContainerIdentifierTails) &&
        resolvedOpts.dataContainerIdentifierTails.length &&
        !currentPath.endsWith(resolvedOpts.dataContainerIdentifierTails)
      ) {
        // 1.1.1. first check data store
        DEV && console.log("369: 1.1.1.");
        DEV &&
          console.log(
            `\n296 * datastore = ${JSON.stringify(
              currentPath + resolvedOpts.dataContainerIdentifierTails,
              null,
              4
            )}`
          );
        let gotPath = objectPath.get(
          input,
          currentPath + resolvedOpts.dataContainerIdentifierTails
        );
        DEV &&
          console.log(`383 * gotPath = ${JSON.stringify(gotPath, null, 4)}`);
        if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
          DEV && console.log(`385 FOUND!\n${gotPath[varName]}`);
          resolveValue = objectPath.get(gotPath, varName);
          handBrakeOff = false;
        }
      }

      if (resolveValue === undefined) {
        DEV && console.log("392 1.1.2.");
        // 1.1.2. second check for key straight in parent level
        let gotPath = objectPath.get(input, currentPath);
        DEV && console.log(`395 gotPath = ${JSON.stringify(gotPath, null, 4)}`);
        if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
          DEV &&
            console.log(
              `399 SUCCESS! currentPath = ${JSON.stringify(
                currentPath,
                null,
                4
              )} has key ${varName}`
            );
          resolveValue = objectPath.get(gotPath, varName);
          handBrakeOff = false;
        }
      }
    }
  }
  // 1.2. Reading this point means that maybe we were already at the root level,
  // maybe we traversed up to root and couldn't resolve anything.
  // Either way, let's check keys and data store at the root level:
  if (resolveValue === undefined) {
    DEV && console.log("415 check the root");
    let gotPath = objectPath.get(input, varName);
    DEV &&
      console.log(`418 ROOT's gotPath = ${JSON.stringify(gotPath, null, 4)}`);
    if (gotPath !== undefined) {
      DEV &&
        console.log(
          `422 SET resolveValue = ${JSON.stringify(gotPath, null, 4)}`
        );
      resolveValue = gotPath;
    }
  }
  // 1.3. Last resort, just look for key ANYWHERE, as long as it's named as
  // our variable name's topmost key (if it's a path with dots) or equal to key entirely (no dots)
  if (resolveValue === undefined) {
    DEV && console.log(`430 search for key: ${getTopmostKey(varName)}`);

    // 1.3.1. It depends, does the varName we're looking for have dot or not.
    // - Because if it does, it's a path and we'll have to split the search into two
    // parts: first find topmost key, then query it's children path part via
    // object-path.
    // - If it does not have a dot, it's straightforward, pick first string
    // finding out of getByKey().

    // it's not a path (does not contain dots)
    if (varName.indexOf(".") === -1) {
      let gotPathArr = getByKey(input, varName);
      DEV &&
        console.log(
          `444 *** gotPathArr = ${JSON.stringify(gotPathArr, null, 4)}`
        );
      if (gotPathArr.length) {
        for (let y = 0, len2 = gotPathArr.length; y < len2; y++) {
          if (
            isStr(gotPathArr[y].val) ||
            isBool(gotPathArr[y].val) ||
            isNull(gotPathArr[y].val)
          ) {
            resolveValue = gotPathArr[y].val;
            DEV &&
              console.log(
                `456 resolveValue = ${JSON.stringify(resolveValue, null, 4)}`
              );
            break;
          } else if (isNum(gotPathArr[y].val)) {
            resolveValue = String(gotPathArr[y].val);
            DEV &&
              console.log(
                `463 resolveValue = ${JSON.stringify(resolveValue, null, 4)}`
              );
            break;
          } else if (Array.isArray(gotPathArr[y].val)) {
            resolveValue = gotPathArr[y].val.join("");
            DEV &&
              console.log(
                `470 resolveValue = ${JSON.stringify(resolveValue, null, 4)}`
              );
            break;
          }
        }
      }
    } else {
      // it's a path (contains dots)
      let gotPath = getByKey(input, getTopmostKey(varName));
      DEV &&
        console.log(`480 *** gotPath = ${JSON.stringify(gotPath, null, 4)}`);
      if (gotPath.length) {
        for (let y = 0, len2 = gotPath.length; y < len2; y++) {
          let temp = objectPath.get(gotPath[y].val, withoutTopmostKey(varName));
          if (temp && isStr(temp)) {
            resolveValue = temp;
          }
        }
      }
    }
  }
  DEV && console.log(`491 findValues(): FINAL RETURN: ${resolveValue}\n`);
  return resolveValue;
}

// Explanation of the resolveString() function's inputs.

// Heads or tails were detected in the "string", which is located in the "path"
// within "input" (JSON object normally, an AST). All the settings are in "resolvedOpts".
// Since this function will be called recursively, we have to keep a breadCrumbPath -
// all keys visited so far and always check, was the current key not been
// traversed already (present in breadCrumbPath). Otherwise, we might get into a
// closed loop.
function resolveString(
  input: Obj,
  string: string,
  path: string,
  resolvedOpts: Opts,
  incomingBreadCrumbPath: string[] = []
): string | false | undefined {
  DEV &&
    console.log(
      `\u001b[${33}m${`\n\n429 CALLED resolveString() on "${string}". Path = "${path}"`}\u001b[${39}m`
    );
  DEV &&
    console.log(
      `516 incomingBreadCrumbPath = ${JSON.stringify(
        incomingBreadCrumbPath,
        null,
        4
      )}`
    );

  // precautions from recursion
  if (incomingBreadCrumbPath.includes(path)) {
    let extra = "";
    if (incomingBreadCrumbPath.length > 1) {
      // extra = ` Here's the path we travelled up until we hit the recursion: ${incomingBreadCrumbPath.join(' - ')}.`

      let separator = " →\n";
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

  // The Secret Data Stash, a way to cache previously resolved values and reuse the
  // values, saving resources. It can't be on the root because it would get retained
  // between different calls on the library, potentially giving wrong results (from
  // the previous resolved variable, from the previous function call).
  let secretResolvedVarsStash: Obj = {};

  DEV &&
    console.log(
      `=============================\n468 string = ${JSON.stringify(
        string,
        null,
        4
      )}`
    );

  // 0. Add current path into breadCrumbPath
  // =======================================

  let breadCrumbPath = Array.from(incomingBreadCrumbPath);
  breadCrumbPath.push(path);

  // 1. First, extract all vars
  // ==========================

  let finalRangesArr = new Ranges();

  function processHeadsAndTails(
    arr: Obj[],
    dontWrapTheseVars: boolean,
    wholeValueIsVariable: boolean
  ): string | false | undefined {
    for (let i = 0, len = arr.length; i < len; i++) {
      let obj = arr[i];
      DEV &&
        console.log(
          `\u001b[${33}m${`490 obj = ${JSON.stringify(
            obj,
            null,
            4
          )}`}\u001b[${39}m`
        );
      let varName = string.slice(obj.headsEndAt, obj.tailsStartAt);
      DEV &&
        console.log(
          `589 ${`\u001b[${33}m${`varName`}\u001b[${39}m`} = ${JSON.stringify(
            varName,
            null,
            4
          )}`
        );
      if (varName.length === 0) {
        finalRangesArr.push(
          obj.headsStartAt, // replace from index
          obj.tailsEndAt // replace upto index - no third argument, just deletion of heads/tails
        );
      } else if (
        has.call(secretResolvedVarsStash, varName) &&
        isStr(secretResolvedVarsStash[varName])
      ) {
        // check, maybe the value was already resolved before and present in secret stash:
        DEV && console.log("605 Yay! Value taken from stash!");
        finalRangesArr.push(
          obj.headsStartAt, // replace from index
          obj.tailsEndAt, // replace upto index
          secretResolvedVarsStash[varName] // replacement value
        );
      } else {
        // it's not in the stash unfortunately, so let's search for it then:
        let resolvedValue = findValues(
          input, // input
          varName.trim(), // varName
          path, // path
          resolvedOpts // resolvedOpts
        );
        if (resolvedValue === undefined) {
          if (resolvedOpts.allowUnresolved === true) {
            resolvedValue = "";
          } else if (isStr(resolvedOpts.allowUnresolved)) {
            resolvedValue = resolvedOpts.allowUnresolved;
          } else {
            throw new Error(
              `json-variables/processHeadsAndTails(): [THROW_ID_18] We couldn't find the value to resolve the variable ${string.slice(
                obj.headsEndAt,
                obj.tailsStartAt
              )}. We're at path: "${path}".`
            );
          }
        }
        if (
          !wholeValueIsVariable &&
          resolvedOpts.throwWhenNonStringInsertedInString &&
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
          if (resolvedOpts.resolveToBoolIfAnyValuesContainBool) {
            finalRangesArr.wipe();
            if (!resolvedOpts.resolveToFalseIfAnyValuesContainBool) {
              return resolvedValue;
            }
            return false;
          }
          resolvedValue = "";
        } else if (isNull(resolvedValue) && wholeValueIsVariable) {
          finalRangesArr.wipe();
          return resolvedValue;
        } else if (Array.isArray(resolvedValue)) {
          resolvedValue = String(resolvedValue.join(""));
        } else if (isNull(resolvedValue)) {
          resolvedValue = "";
        } else {
          resolvedValue = String(resolvedValue);
        }

        DEV &&
          console.log(
            `* 574 resolvedValue = ${JSON.stringify(resolvedValue, null, 4)}`
          );
        DEV && console.log(`* 576 path = ${JSON.stringify(path, null, 4)}`);
        DEV &&
          console.log(`* 577 varName = ${JSON.stringify(varName, null, 4)}`);

        let newPath = path.includes(".")
          ? `${goLevelUp(path)}.${varName}`
          : varName;
        DEV &&
          console.log(`* 582 newPath = ${JSON.stringify(newPath, null, 4)}`);
        if (containsHeadsOrTails(resolvedValue, resolvedOpts)) {
          let replacementVal = wrap(
            resolveString(
              // replacement value    <--------- R E C U R S I O N
              input,
              resolvedValue,
              newPath,
              resolvedOpts,
              breadCrumbPath
            ) as string,
            resolvedOpts,
            dontWrapTheseVars,
            breadCrumbPath,
            newPath,
            varName.trim()
          );
          if (isStr(replacementVal)) {
            finalRangesArr.push(
              obj.headsStartAt, // replace from index
              obj.tailsEndAt, // replace upto index
              replacementVal
            );
          }
        } else {
          // 1. store it in the stash for the future
          secretResolvedVarsStash[varName] = resolvedValue;
          let replacementVal = wrap(
            resolvedValue,
            resolvedOpts,
            dontWrapTheseVars,
            breadCrumbPath,
            newPath,
            varName.trim()
          ); // replacement value
          if (isStr(replacementVal)) {
            // 2. submit to be replaced
            finalRangesArr.push(
              obj.headsStartAt, // replace from index
              obj.tailsEndAt, // replace upto index
              replacementVal
            );
          }
        }
      }
    }
    return undefined;
  }

  let foundHeadsAndTails; // reusing same var as container for both wrapping- and non-wrapping types

  // 1. normal (possibly wrapping-type) heads and tails
  try {
    // strFindHeadsTails() can throw as well if there's mismatch in heads and tails,
    // for example, so it needs to be contained:
    foundHeadsAndTails = strFindHeadsTails(
      string,
      resolvedOpts.heads,
      resolvedOpts.tails,
      {
        source: "",
        throwWhenSomethingWrongIsDetected: false,
      }
    );
  } catch (error) {
    throw new Error(
      `json-variables/resolveString(): [THROW_ID_17] While trying to resolve string: "${string}" at path ${path}, something wrong with heads and tails was detected! Here's the internal error message:\n${error}`
    );
  }
  DEV &&
    console.log(
      `${`\u001b[${36}m${"694 foundHeadsAndTails = "}\u001b[${39}m`} ${JSON.stringify(
        foundHeadsAndTails,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `\u001b[${36}m${`654 string.length = ${string.length}`}\u001b[${39}m`
    );

  // if heads and tails array has only one range inside and it spans whole string's
  // length, this means key is equal to a whole variable, like {a: '%%_b_%%'}.
  // In those cases, there are extra considerations when value is null, because
  // null among string characters is resolved to empty string, but null as a whole
  // value is retained as null. This means, we need to pass this as a flag to
  // processHeadsAndTails() so it can resolve properly...

  let wholeValueIsVariable = false; // we'll reuse it for non-wrap heads/tails too

  if (
    foundHeadsAndTails.length === 1 &&
    rApply(string, [
      [foundHeadsAndTails[0].headsStartAt, foundHeadsAndTails[0].tailsEndAt],
    ]).trim() === ""
  ) {
    wholeValueIsVariable = true;
  }

  let temp1 = processHeadsAndTails(
    foundHeadsAndTails,
    false,
    wholeValueIsVariable
  );
  if (typeof temp1 === "boolean") {
    return temp1;
  }
  if (temp1 === null) {
    return temp1;
  }

  // 2. Process resolvedOpts.headsNoWrap, resolvedOpts.tailsNoWrap as well
  try {
    // strFindHeadsTails() can throw as well if there's mismatch in heads and tails,
    // for example, so it needs to be contained:
    foundHeadsAndTails = strFindHeadsTails(
      string,
      resolvedOpts.headsNoWrap,
      resolvedOpts.tailsNoWrap,
      {
        source: "",
        throwWhenSomethingWrongIsDetected: false,
      }
    );
  } catch (error) {
    throw new Error(
      `json-variables/resolveString(): [THROW_ID_22] While trying to resolve string: "${string}" at path ${path}, something wrong with no-wrap heads and no-wrap tails was detected! Here's the internal error message:\n${error}`
    );
  }

  if (
    foundHeadsAndTails.length === 1 &&
    rApply(string, [
      [foundHeadsAndTails[0].headsStartAt, foundHeadsAndTails[0].tailsEndAt],
    ]).trim() === ""
  ) {
    wholeValueIsVariable = true;
  }

  let temp2 = processHeadsAndTails(
    foundHeadsAndTails,
    true,
    wholeValueIsVariable
  );
  if (isBool(temp2)) {
    return temp2;
  }
  if (isNull(temp2)) {
    return temp2;
  }

  DEV && console.log(`834 temp2 = ${JSON.stringify(temp2, null, 4)}`);

  // 3. Then, work the finalRangesArr list
  // ================================
  DEV &&
    console.log(
      `\u001b[${33}m${`\n729 END OF rApply: finalRangesArr.current() = ${JSON.stringify(
        finalRangesArr.current(),
        null,
        4
      )}`}\u001b[${39}m`
    );
  DEV &&
    console.log(
      `\u001b[${33}m${`\n736 string was = ${JSON.stringify(
        string,
        null,
        4
      )}`}\u001b[${39}m`
    );

  if (finalRangesArr?.current()) {
    return rApply(string, finalRangesArr.current());
  }
  return string;
}

// -----------------------------------------------------------------------------
//                         M A I N   F U N C T I O N
// -----------------------------------------------------------------------------

/**
 * Resolves custom-marked, cross-referenced paths in parsed JSON
 */
function jVar(input: Obj, opts?: Partial<Opts>): Obj {
  if (!arguments.length) {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_01] Alas! Inputs are missing!"
    );
  }
  if (!isObj(input)) {
    throw new TypeError(
      `json-variables/jVar(): [THROW_ID_02] Alas! The input must be a plain object! Currently it's: ${
        Array.isArray(input) ? "array" : typeof input
      }`
    );
  }
  if (opts && !isObj(opts)) {
    throw new TypeError(
      `json-variables/jVar(): [THROW_ID_03] Alas! An Optional Options Object must be a plain object! Currently it's: ${
        Array.isArray(opts) ? "array" : typeof opts
      }`
    );
  }
  let resolvedOpts: Opts = { ...defaults, ...opts };

  if (!resolvedOpts.dontWrapVars) {
    resolvedOpts.dontWrapVars = [];
  } else if (!Array.isArray(resolvedOpts.dontWrapVars)) {
    resolvedOpts.dontWrapVars = arrayiffy(resolvedOpts.dontWrapVars);
  }

  let culpritVal;
  let culpritIndex;
  if (
    resolvedOpts.dontWrapVars.length &&
    !resolvedOpts.dontWrapVars.every((el, idx) => {
      if (!isStr(el)) {
        culpritVal = el;
        culpritIndex = idx;
        return false;
      }
      return true;
    })
  ) {
    throw new Error(
      `json-variables/jVar(): [THROW_ID_05] Alas! All variable names set in resolvedOpts.dontWrapVars should be of a string type. Computer detected a value "${culpritVal}" at index ${culpritIndex}, which is not string but ${
        Array.isArray(culpritVal) ? "array" : typeof culpritVal
      }!`
    );
  }

  if (resolvedOpts.heads === "") {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_06] Alas! resolvedOpts.heads are empty!"
    );
  }
  if (resolvedOpts.tails === "") {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_07] Alas! resolvedOpts.tails are empty!"
    );
  }
  if (
    resolvedOpts.lookForDataContainers &&
    resolvedOpts.dataContainerIdentifierTails === ""
  ) {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_08] Alas! resolvedOpts.dataContainerIdentifierTails is empty!"
    );
  }
  if (resolvedOpts.heads === resolvedOpts.tails) {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_09] Alas! resolvedOpts.heads and resolvedOpts.tails can't be equal!"
    );
  }
  if (resolvedOpts.heads === resolvedOpts.headsNoWrap) {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_10] Alas! resolvedOpts.heads and resolvedOpts.headsNoWrap can't be equal!"
    );
  }
  if (resolvedOpts.tails === resolvedOpts.tailsNoWrap) {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_11] Alas! resolvedOpts.tails and resolvedOpts.tailsNoWrap can't be equal!"
    );
  }
  if (resolvedOpts.headsNoWrap === "") {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_12] Alas! resolvedOpts.headsNoWrap is an empty string!"
    );
  }
  if (resolvedOpts.tailsNoWrap === "") {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_13] Alas! resolvedOpts.tailsNoWrap is an empty string!"
    );
  }
  if (resolvedOpts.headsNoWrap === resolvedOpts.tailsNoWrap) {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_14] Alas! resolvedOpts.headsNoWrap and resolvedOpts.tailsNoWrap can't be equal!"
    );
  }

  let current;

  DEV && console.log("======== JSON VARIABLES START ========");
  DEV && console.log(`input = ${JSON.stringify(input, null, 4)}`);
  DEV && console.log(`resolvedOpts = ${JSON.stringify(resolvedOpts, null, 4)}`);
  DEV && console.log("======== JSON VARIABLES END ========");

  //
  // ===============================================
  //                        1.
  // Let's compile the list of all the vars to resolve
  // ===============================================
  //

  // we return the result of the traversal:
  return traverse(input, (key, val, innerObj) => {
    DEV && console.log("\n========================================");
    if (existy(val) && containsHeadsOrTails(key, resolvedOpts)) {
      throw new Error(
        `json-variables/jVar(): [THROW_ID_15] Alas! Object keys can't contain variables!\nPlease check the following key: ${key}`
      );
    }
    // * * *
    // Get the current values which are being traversed by ast-monkey:
    // If it's an array, val will not exist, only key.
    if (val !== undefined) {
      // if it's object currently being traversed, we'll get both key and value
      current = val;
    } else {
      // if it's an array being traversed currently, we'll get only key
      current = key;
    }

    // * * *
    // In short, ast-monkey works in such way, that what we return will get written
    // over the current element, which is at the moment "current". If we don't want
    // to mutate it, we return "current". If we want to mutate it, we return a new
    // value (which will get written onto that node, previously equal to "current").

    DEV && console.log(`1004 current = ${JSON.stringify(current, null, 4)}`);

    // *
    // Instantly skip empty strings:
    if (current === "") {
      return current;
    }

    // *
    // If the "current" that monkey brought us is equal to whole heads or tails:
    if (
      (resolvedOpts.heads.length &&
        trimIfString(current) === trimIfString(resolvedOpts.heads)) ||
      (resolvedOpts.tails.length &&
        trimIfString(current) === trimIfString(resolvedOpts.tails)) ||
      (resolvedOpts.headsNoWrap.length &&
        trimIfString(current) === trimIfString(resolvedOpts.headsNoWrap)) ||
      (resolvedOpts.tailsNoWrap.length &&
        trimIfString(current) === trimIfString(resolvedOpts.tailsNoWrap))
    ) {
      if (!resolvedOpts.noSingleMarkers) {
        return current;
      }
      throw new Error(
        `json-variables/jVar(): [THROW_ID_16] Alas! While processing the input, we stumbled upon ${trimIfString(
          current
        )} which is equal to ${
          trimIfString(current) === trimIfString(resolvedOpts.heads)
            ? "heads"
            : ""
        }${
          trimIfString(current) === trimIfString(resolvedOpts.tails)
            ? "tails"
            : ""
        }${
          isStr(resolvedOpts.headsNoWrap) &&
          trimIfString(current) === trimIfString(resolvedOpts.headsNoWrap)
            ? "headsNoWrap"
            : ""
        }${
          isStr(resolvedOpts.tailsNoWrap) &&
          trimIfString(current) === trimIfString(resolvedOpts.tailsNoWrap)
            ? "tailsNoWrap"
            : ""
        }. If you wouldn't have set resolvedOpts.noSingleMarkers to "true" this error would not happen and computer would have left the current element (${trimIfString(
          current
        )}) alone`
      );
    }

    DEV && console.log(`\n953 current = ${JSON.stringify(current, null, 4)}`);

    // *
    // Process the current node if it's a string and it contains heads / tails /
    // headsNoWrap / tailsNoWrap:
    if (isStr(current) && containsHeadsOrTails(current, resolvedOpts)) {
      // breadCrumbPath, the fifth argument is not passed as there're no previous paths
      return resolveString(input, current, innerObj.path, resolvedOpts);
    }

    // otherwise, just return as it is. We're not going to touch plain objects/arrays,numbers/bools etc.
    return current;

    // END OF MONKEY'S TRAVERSE
    // -------------------------------------------------------------------------
  });
}

export { jVar, defaults, version };
