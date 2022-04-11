/* eslint max-len:0 */

import { traverse } from "ast-monkey-traverse";
import { isMatch } from "matcher";
import objectPath from "object-path";
import { arrayiffy } from "arrayiffy-if-string";
import { strFindHeadsTails } from "string-find-heads-tails";
import { getByKey } from "ast-get-values-by-key";
import { Ranges } from "ranges-push";
import { rApply } from "ranges-apply";
import { remDup } from "string-remove-duplicate-heads-tails";
import { matchLeftIncl, matchRightIncl } from "string-match-left-right";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

const has = Object.prototype.hasOwnProperty;

interface Obj {
  [key: string]: any;
}

interface Opts {
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

function isStr(something: any): boolean {
  return typeof something === "string";
}
function isNum(something: any): boolean {
  return typeof something === "number";
}
function isBool(something: any): boolean {
  return typeof something === "boolean";
}
function isNull(something: any): boolean {
  return something === null;
}
function isObj(something: any): boolean {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function existy(x: any): boolean {
  return x != null;
}

// TS overloading
function trimIfString(something: string): string;
function trimIfString(something: any): any {
  return isStr(something) ? something.trim() : something;
}

function getTopmostKey(str: string): string {
  if (typeof str === "string" && str.length && str.indexOf(".") !== -1) {
    for (let i = 0, len = str.length; i < len; i++) {
      if (str[i] === ".") {
        return str.slice(0, i);
      }
    }
  }
  return str;
}
function withoutTopmostKey(str: string): string {
  if (typeof str === "string" && str.length && str.indexOf(".") !== -1) {
    for (let i = 0, len = str.length; i < len; i++) {
      if (str[i] === ".") {
        return str.slice(i + 1);
      }
    }
  }
  return str;
}
function goLevelUp(str: string): string {
  if (typeof str === "string" && str.length && str.indexOf(".") !== -1) {
    for (let i = str.length; i--; ) {
      if (str[i] === ".") {
        return str.slice(0, i);
      }
    }
  }
  return str;
}
function getLastKey(str: string): string {
  if (typeof str === "string" && str.length && str.indexOf(".") !== -1) {
    for (let i = str.length; i--; ) {
      if (str[i] === ".") {
        return str.slice(i + 1);
      }
    }
  }
  return str;
}
function containsHeadsOrTails(str: string, opts: Opts): boolean {
  if (typeof str !== "string" || !str.trim()) {
    return false;
  }
  if (
    str.includes(opts.heads) ||
    str.includes(opts.tails) ||
    (isStr(opts.headsNoWrap) &&
      opts.headsNoWrap.length &&
      str.includes(opts.headsNoWrap)) ||
    (isStr(opts.tailsNoWrap) &&
      opts.tailsNoWrap.length &&
      str.includes(opts.tailsNoWrap))
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
    typeof str === "string" &&
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
        tempTo = +(index as any) + 1;
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
  opts: Opts,
  dontWrapTheseVars = false,
  breadCrumbPath: string[],
  newPath: string,
  oldVarName: string
): string | false {
  DEV &&
    console.log(
      `196 >>>>>>>>>> WRAP(): placementValue = ${JSON.stringify(
        placementValue,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `204 >>>>>>>>>> WRAP(): breadCrumbPath = ${JSON.stringify(
        breadCrumbPath,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `212 >>>>>>>>>> WRAP(): newPath = ${JSON.stringify(newPath, null, 4)}`
    );
  DEV &&
    console.log(
      `216 >>>>>>>>>> WRAP(): oldVarName = ${JSON.stringify(
        oldVarName,
        null,
        4
      )}\n`
    );

  // opts validation
  if (!opts.wrapHeadsWith) {
    // eslint-disable-next-line no-param-reassign
    opts.wrapHeadsWith = "";
  }
  if (!opts.wrapTailsWith) {
    // eslint-disable-next-line no-param-reassign
    opts.wrapTailsWith = "";
  }

  // main opts

  if (
    isStr(placementValue) &&
    !dontWrapTheseVars &&
    opts.wrapGlobalFlipSwitch &&
    !opts.dontWrapVars.some((val) => isMatch(oldVarName, val)) && // considering double-wrapping prevention setting:
    (!opts.preventDoubleWrapping ||
      (opts.preventDoubleWrapping &&
        isStr(placementValue) &&
        !placementValue.includes(opts.wrapHeadsWith as string) &&
        !placementValue.includes(opts.wrapTailsWith as string)))
  ) {
    DEV && console.log("246 +++ WE WILL WRAP THIS!");
    return `${opts.wrapHeadsWith}${placementValue}${opts.wrapTailsWith}`;
  }
  if (dontWrapTheseVars) {
    DEV &&
      console.log(
        "\n\n\n252 💥💥💥💥💥💥 !!! dontWrapTheseVars is ON!!!\n\n\n"
      );
    DEV &&
      console.log(
        `256 placementValue = ${JSON.stringify(placementValue, null, 4)}`
      );
    DEV &&
      console.log(
        `260 opts.wrapHeadsWith = ${JSON.stringify(
          opts.wrapHeadsWith,
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `268 opts.wrapTailsWith = ${JSON.stringify(
          opts.wrapTailsWith,
          null,
          4
        )}`
      );

    DEV &&
      console.log(
        `277 about to return:\n${JSON.stringify(
          remDup(placementValue, {
            heads: opts.wrapHeadsWith,
            tails: opts.wrapTailsWith,
          }),
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `288 \u001b[${36}m placementValue = ${JSON.stringify(
          placementValue,
          null,
          4
        )}\u001b[${39}m`
      );
    if (!isStr(placementValue)) {
      DEV && console.log(`295 Returning placementValue = ${placementValue}`);
      return placementValue;
    }
    let tempValue = remDup(placementValue, {
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
  DEV && console.log("311 +++ NO WRAP");
  return placementValue;
}
function findValues(
  input: any,
  varName: string,
  path: string,
  opts: Opts
): string | undefined {
  DEV &&
    console.log(
      `322 findValues(): looking for varName = ${JSON.stringify(
        varName,
        null,
        4
      )}`
    );
  DEV && console.log(`328 path = ${JSON.stringify(path, null, 4)}\n\n`);
  let resolveValue;
  // 1.1. first, traverse up to root level, looking for key right at that level
  // or within data store, respecting the config
  if (path.indexOf(".") !== -1) {
    let currentPath = path;
    // traverse upwards:
    let handBrakeOff = true;

    // first, check the current level's datastore:
    if (
      opts.lookForDataContainers &&
      typeof opts.dataContainerIdentifierTails === "string" &&
      opts.dataContainerIdentifierTails.length &&
      !currentPath.endsWith(opts.dataContainerIdentifierTails)
    ) {
      // 1.1.1. first check data store
      DEV && console.log("345: 1.1.0.");
      DEV &&
        console.log(
          `\n256 * datastore = ${JSON.stringify(
            currentPath + opts.dataContainerIdentifierTails,
            null,
            4
          )}`
        );
      let gotPath = objectPath.get(
        input,
        currentPath + opts.dataContainerIdentifierTails
      );
      DEV && console.log(`358 * gotPath = ${JSON.stringify(gotPath, null, 4)}`);
      if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
        DEV && console.log(`360 FOUND!\n${gotPath[varName]}`);
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
      DEV && console.log(`376 traversing up. Currently at: ${currentPath}`);

      // first, check the current level's datastore:
      if (
        opts.lookForDataContainers &&
        typeof opts.dataContainerIdentifierTails === "string" &&
        opts.dataContainerIdentifierTails.length &&
        !currentPath.endsWith(opts.dataContainerIdentifierTails)
      ) {
        // 1.1.1. first check data store
        DEV && console.log("386: 1.1.1.");
        DEV &&
          console.log(
            `\n296 * datastore = ${JSON.stringify(
              currentPath + opts.dataContainerIdentifierTails,
              null,
              4
            )}`
          );
        let gotPath = objectPath.get(
          input,
          currentPath + opts.dataContainerIdentifierTails
        );
        DEV &&
          console.log(`400 * gotPath = ${JSON.stringify(gotPath, null, 4)}`);
        if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
          DEV && console.log(`402 FOUND!\n${gotPath[varName]}`);
          resolveValue = objectPath.get(gotPath, varName);
          handBrakeOff = false;
        }
      }

      if (resolveValue === undefined) {
        DEV && console.log("409 1.1.2.");
        // 1.1.2. second check for key straight in parent level
        let gotPath = objectPath.get(input, currentPath);
        DEV && console.log(`412 gotPath = ${JSON.stringify(gotPath, null, 4)}`);
        if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
          DEV &&
            console.log(
              `416 SUCCESS! currentPath = ${JSON.stringify(
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
    DEV && console.log("432 check the root");
    let gotPath = objectPath.get(input, varName);
    DEV &&
      console.log(`435 ROOT's gotPath = ${JSON.stringify(gotPath, null, 4)}`);
    if (gotPath !== undefined) {
      DEV &&
        console.log(
          `439 SET resolveValue = ${JSON.stringify(gotPath, null, 4)}`
        );
      resolveValue = gotPath;
    }
  }
  // 1.3. Last resort, just look for key ANYWHERE, as long as it's named as
  // our variable name's topmost key (if it's a path with dots) or equal to key entirely (no dots)
  if (resolveValue === undefined) {
    DEV && console.log(`447 search for key: ${getTopmostKey(varName)}`);

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
          `461 *** gotPathArr = ${JSON.stringify(gotPathArr, null, 4)}`
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
                `473 resolveValue = ${JSON.stringify(resolveValue, null, 4)}`
              );
            break;
          } else if (isNum(gotPathArr[y].val)) {
            resolveValue = String(gotPathArr[y].val);
            DEV &&
              console.log(
                `480 resolveValue = ${JSON.stringify(resolveValue, null, 4)}`
              );
            break;
          } else if (Array.isArray(gotPathArr[y].val)) {
            resolveValue = gotPathArr[y].val.join("");
            DEV &&
              console.log(
                `487 resolveValue = ${JSON.stringify(resolveValue, null, 4)}`
              );
            break;
          }
        }
      }
    } else {
      // it's a path (contains dots)
      let gotPath = getByKey(input, getTopmostKey(varName));
      DEV &&
        console.log(`497 *** gotPath = ${JSON.stringify(gotPath, null, 4)}`);
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
  DEV && console.log(`508 findValues(): FINAL RETURN: ${resolveValue}\n`);
  return resolveValue;
}

// Explanation of the resolveString() function's inputs.

// Heads or tails were detected in the "string", which is located in the "path"
// within "input" (JSON object normally, an AST). All the settings are in "opts".
// Since this function will be called recursively, we have to keep a breadCrumbPath -
// all keys visited so far and always check, was the current key not been
// traversed already (present in breadCrumbPath). Otherwise, we might get into a
// closed loop.
function resolveString(
  input: any,
  string: string,
  path: string,
  opts: Opts,
  incomingBreadCrumbPath: string[] = []
): string | false | undefined {
  DEV &&
    console.log(
      `\u001b[${33}m${`\n\n429 CALLED resolveString() on "${string}". Path = "${path}"`}\u001b[${39}m`
    );
  DEV &&
    console.log(
      `533 incomingBreadCrumbPath = ${JSON.stringify(
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
          `606 ${`\u001b[${33}m${`varName`}\u001b[${39}m`} = ${JSON.stringify(
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
        DEV && console.log("622 Yay! Value taken from stash!");
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
          opts // opts
        );
        if (resolvedValue === undefined) {
          if (opts.allowUnresolved === true) {
            resolvedValue = "";
          } else if (typeof opts.allowUnresolved === "string") {
            resolvedValue = opts.allowUnresolved;
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
            finalRangesArr.wipe();
            if (!opts.resolveToFalseIfAnyValuesContainBool) {
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
        if (containsHeadsOrTails(resolvedValue, opts)) {
          let replacementVal = wrap(
            resolveString(
              // replacement value    <--------- R E C U R S I O N
              input,
              resolvedValue,
              newPath,
              opts,
              breadCrumbPath
            ) as string,
            opts,
            dontWrapTheseVars,
            breadCrumbPath,
            newPath,
            varName.trim()
          );
          if (typeof replacementVal === "string") {
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
            opts,
            dontWrapTheseVars,
            breadCrumbPath,
            newPath,
            varName.trim()
          ); // replacement value
          if (typeof replacementVal === "string") {
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
    foundHeadsAndTails = strFindHeadsTails(string, opts.heads, opts.tails, {
      source: "",
      throwWhenSomethingWrongIsDetected: false,
    });
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

  // 2. Process opts.headsNoWrap, opts.tailsNoWrap as well
  try {
    // strFindHeadsTails() can throw as well if there's mismatch in heads and tails,
    // for example, so it needs to be contained:
    foundHeadsAndTails = strFindHeadsTails(
      string,
      opts.headsNoWrap,
      opts.tailsNoWrap,
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

  DEV && console.log(`846 temp2 = ${JSON.stringify(temp2, null, 4)}`);

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
function jVar(input: Obj, originalOpts?: Partial<Opts>): Obj {
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
  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError(
      `json-variables/jVar(): [THROW_ID_03] Alas! An Optional Options Object must be a plain object! Currently it's: ${
        Array.isArray(originalOpts) ? "array" : typeof originalOpts
      }`
    );
  }
  let opts: Opts = { ...defaults, ...originalOpts };

  if (!opts.dontWrapVars) {
    opts.dontWrapVars = [];
  } else if (!Array.isArray(opts.dontWrapVars)) {
    opts.dontWrapVars = arrayiffy(opts.dontWrapVars);
  }

  let culpritVal;
  let culpritIndex;
  if (
    opts.dontWrapVars.length &&
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
      `json-variables/jVar(): [THROW_ID_05] Alas! All variable names set in opts.dontWrapVars should be of a string type. Computer detected a value "${culpritVal}" at index ${culpritIndex}, which is not string but ${
        Array.isArray(culpritVal) ? "array" : typeof culpritVal
      }!`
    );
  }

  if (opts.heads === "") {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_06] Alas! opts.heads are empty!"
    );
  }
  if (opts.tails === "") {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_07] Alas! opts.tails are empty!"
    );
  }
  if (opts.lookForDataContainers && opts.dataContainerIdentifierTails === "") {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_08] Alas! opts.dataContainerIdentifierTails is empty!"
    );
  }
  if (opts.heads === opts.tails) {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_09] Alas! opts.heads and opts.tails can't be equal!"
    );
  }
  if (opts.heads === opts.headsNoWrap) {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_10] Alas! opts.heads and opts.headsNoWrap can't be equal!"
    );
  }
  if (opts.tails === opts.tailsNoWrap) {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_11] Alas! opts.tails and opts.tailsNoWrap can't be equal!"
    );
  }
  if (opts.headsNoWrap === "") {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_12] Alas! opts.headsNoWrap is an empty string!"
    );
  }
  if (opts.tailsNoWrap === "") {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_13] Alas! opts.tailsNoWrap is an empty string!"
    );
  }
  if (opts.headsNoWrap === opts.tailsNoWrap) {
    throw new Error(
      "json-variables/jVar(): [THROW_ID_14] Alas! opts.headsNoWrap and opts.tailsNoWrap can't be equal!"
    );
  }

  let current;

  DEV && console.log("======== JSON VARIABLES START ========");
  DEV && console.log(`input = ${JSON.stringify(input, null, 4)}`);
  DEV && console.log(`opts = ${JSON.stringify(opts, null, 4)}`);
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
    if (existy(val) && containsHeadsOrTails(key, opts)) {
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

    DEV && console.log(`1013 current = ${JSON.stringify(current, null, 4)}`);

    // *
    // Instantly skip empty strings:
    if (current === "") {
      return current;
    }

    // *
    // If the "current" that monkey brought us is equal to whole heads or tails:
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
        `json-variables/jVar(): [THROW_ID_16] Alas! While processing the input, we stumbled upon ${trimIfString(
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

    DEV && console.log(`\n953 current = ${JSON.stringify(current, null, 4)}`);

    // *
    // Process the current node if it's a string and it contains heads / tails /
    // headsNoWrap / tailsNoWrap:
    if (isStr(current) && containsHeadsOrTails(current, opts)) {
      // breadCrumbPath, the fifth argument is not passed as there're no previous paths
      return resolveString(input, current, innerObj.path, opts);
    }

    // otherwise, just return as it is. We're not going to touch plain objects/arrays,numbers/bools etc.
    return current;

    // END OF MONKEY'S TRAVERSE
    // -------------------------------------------------------------------------
  });
}

export { jVar, defaults, version };
