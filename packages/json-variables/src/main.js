/* eslint max-len:0 */

import traverse from "ast-monkey-traverse";
import matcher from "matcher";
import objectPath from "object-path";
import arrayiffyIfString from "arrayiffy-if-string";
import strFindHeadsTails from "string-find-heads-tails";
import get from "ast-get-values-by-key";
import Ranges from "ranges-push";
import rangesApply from "ranges-apply";
import removeDuplicateHeadsTails from "string-remove-duplicate-heads-tails";
import { matchLeftIncl, matchRightIncl } from "string-match-left-right";

const has = Object.prototype.hasOwnProperty;

// -----------------------------------------------------------------------------
//                       H E L P E R   F U N C T I O N S
// -----------------------------------------------------------------------------

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
function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
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
  if (typeof str !== "string" || !str.trim()) {
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
  console.log(
    `135 >>>>>>>>>> WRAP(): placementValue = ${JSON.stringify(
      placementValue,
      null,
      4
    )}`
  );
  console.log(
    `142 >>>>>>>>>> WRAP(): breadCrumbPath = ${JSON.stringify(
      breadCrumbPath,
      null,
      4
    )}`
  );
  console.log(
    `149 >>>>>>>>>> WRAP(): newPath = ${JSON.stringify(newPath, null, 4)}`
  );
  console.log(
    `152 >>>>>>>>>> WRAP(): oldVarName = ${JSON.stringify(
      oldVarName,
      null,
      4
    )}\n`
  );

  // opts validation
  if (!opts.wrapHeadsWith) {
    opts.wrapHeadsWith = "";
  }
  if (!opts.wrapTailsWith) {
    opts.wrapTailsWith = "";
  }

  // main opts

  if (
    isStr(placementValue) &&
    !dontWrapTheseVars &&
    opts.wrapGlobalFlipSwitch &&
    !opts.dontWrapVars.some((val) => matcher.isMatch(oldVarName, val)) && // considering double-wrapping prevention setting:
    (!opts.preventDoubleWrapping ||
      (opts.preventDoubleWrapping &&
        isStr(placementValue) &&
        !placementValue.includes(opts.wrapHeadsWith) &&
        !placementValue.includes(opts.wrapTailsWith)))
  ) {
    console.log("180 +++ WE GONNA WRAP THIS!");
    return opts.wrapHeadsWith + placementValue + opts.wrapTailsWith;
  } else if (dontWrapTheseVars) {
    console.log("\n\n\n183 💥💥💥💥💥💥 !!! dontWrapTheseVars is ON!!!\n\n\n");
    console.log(
      `185 placementValue = ${JSON.stringify(placementValue, null, 4)}`
    );
    console.log(
      `188 opts.wrapHeadsWith = ${JSON.stringify(opts.wrapHeadsWith, null, 4)}`
    );
    console.log(
      `191 opts.wrapTailsWith = ${JSON.stringify(opts.wrapTailsWith, null, 4)}`
    );

    console.log(
      `195 about to return:\n${JSON.stringify(
        removeDuplicateHeadsTails(placementValue, {
          heads: opts.wrapHeadsWith,
          tails: opts.wrapTailsWith,
        }),
        null,
        4
      )}`
    );
    console.log(
      `205 \u001b[${36}m placementValue = ${JSON.stringify(
        placementValue,
        null,
        4
      )}\u001b[${39}m`
    );
    if (!isStr(placementValue)) {
      console.log(`212 Returning placementValue = ${placementValue}`);
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
  console.log("228 +++ NO WRAP");
  return placementValue;
}
function findValues(input, varName, path, opts) {
  console.log(
    `233 findValues(): looking for varName = ${JSON.stringify(
      varName,
      null,
      4
    )}`
  );
  console.log(`239 path = ${JSON.stringify(path, null, 4)}\n\n`);
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
      opts.dataContainerIdentifierTails.length > 0 &&
      !currentPath.endsWith(opts.dataContainerIdentifierTails)
    ) {
      // 1.1.1. first check data store
      console.log("256: 1.1.0.");
      console.log(
        `\n256 * datastore = ${JSON.stringify(
          currentPath + opts.dataContainerIdentifierTails,
          null,
          4
        )}`
      );
      const gotPath = objectPath.get(
        input,
        currentPath + opts.dataContainerIdentifierTails
      );
      console.log(`268 * gotPath = ${JSON.stringify(gotPath, null, 4)}`);
      if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
        console.log(`270 FOUND!\n${gotPath[varName]}`);
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
      console.log(`286 traversing up. Currently at: ${currentPath}`);

      // first, check the current level's datastore:
      if (
        opts.lookForDataContainers &&
        typeof opts.dataContainerIdentifierTails === "string" &&
        opts.dataContainerIdentifierTails.length > 0 &&
        !currentPath.endsWith(opts.dataContainerIdentifierTails)
      ) {
        // 1.1.1. first check data store
        console.log("296: 1.1.1.");
        console.log(
          `\n296 * datastore = ${JSON.stringify(
            currentPath + opts.dataContainerIdentifierTails,
            null,
            4
          )}`
        );
        const gotPath = objectPath.get(
          input,
          currentPath + opts.dataContainerIdentifierTails
        );
        console.log(`308 * gotPath = ${JSON.stringify(gotPath, null, 4)}`);
        if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
          console.log(`310 FOUND!\n${gotPath[varName]}`);
          resolveValue = objectPath.get(gotPath, varName);
          handBrakeOff = false;
        }
      }

      if (resolveValue === undefined) {
        console.log("317 1.1.2.");
        // 1.1.2. second check for key straight in parent level
        const gotPath = objectPath.get(input, currentPath);
        console.log(`320 gotPath = ${JSON.stringify(gotPath, null, 4)}`);
        if (isObj(gotPath) && objectPath.get(gotPath, varName)) {
          console.log(
            `323 SUCCESS! currentPath = ${JSON.stringify(
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
    console.log("339 check the root");
    const gotPath = objectPath.get(input, varName);
    console.log(`341 ROOT's gotPath = ${JSON.stringify(gotPath, null, 4)}`);
    if (gotPath !== undefined) {
      console.log(`343 SET resolveValue = ${JSON.stringify(gotPath, null, 4)}`);
      resolveValue = gotPath;
    }
  }
  // 1.3. Last resort, just look for key ANYWHERE, as long as it's named as
  // our variable name's topmost key (if it's a path with dots) or equal to key entirely (no dots)
  if (resolveValue === undefined) {
    console.log(`350 search for key: ${getTopmostKey(varName)}`);

    // 1.3.1. It depends, does the varName we're looking for have dot or not.
    // - Because if it does, it's a path and we'll have to split the search into two
    // parts: first find topmost key, then query it's children path part via
    // object-path.
    // - If it does not have a dot, it's straightforward, pick first string
    // finding out of get().

    // it's not a path (does not contain dots)
    if (varName.indexOf(".") === -1) {
      const gotPathArr = get(input, varName);
      console.log(
        `363 *** gotPathArr = ${JSON.stringify(gotPathArr, null, 4)}`
      );
      if (gotPathArr.length > 0) {
        for (let y = 0, len2 = gotPathArr.length; y < len2; y++) {
          if (
            isStr(gotPathArr[y].val) ||
            isBool(gotPathArr[y].val) ||
            isNull(gotPathArr[y].val)
          ) {
            resolveValue = gotPathArr[y].val;
            console.log(
              `374 resolveValue = ${JSON.stringify(resolveValue, null, 4)}`
            );
            break;
          } else if (isNum(gotPathArr[y].val)) {
            resolveValue = String(gotPathArr[y].val);
            console.log(
              `380 resolveValue = ${JSON.stringify(resolveValue, null, 4)}`
            );
            break;
          } else if (Array.isArray(gotPathArr[y].val)) {
            resolveValue = gotPathArr[y].val.join("");
            console.log(
              `386 resolveValue = ${JSON.stringify(resolveValue, null, 4)}`
            );
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
      // it's a path (contains dots)
      const gotPath = get(input, getTopmostKey(varName));
      console.log(`403 *** gotPath = ${JSON.stringify(gotPath, null, 4)}`);
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
  console.log(`417 findValues(): FINAL RETURN: ${resolveValue}\n`);
  return resolveValue;
}

// Explanation of the resolveString() function's inputs.

// Heads or tails were detected in the "string", which is located in the "path"
// within "input" (JSON object normally, an AST). All the settings are in "opts".
// Since this function will be called recursively, we have to keep a breadCrumbPath -
// all keys visited so far and always check, was the current key not been
// traversed already (present in breadCrumbPath). Otherwise, we might get into a
// closed loop.
function resolveString(input, string, path, opts, incomingBreadCrumbPath = []) {
  console.log(
    `\u001b[${33}m${`\n\n429 CALLED resolveString() on "${string}". Path = "${path}"`}\u001b[${39}m`
  );
  console.log(
    `434 incomingBreadCrumbPath = ${JSON.stringify(
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

  // The Secret Data Stash, a way to cache previously resolved values and reuse the
  // values, saving resources. It can't be on the root because it would get retained
  // between different calls on the library, potentially giving wrong results (from
  // the previous resolved variable, from the previous function call).
  const secretResolvedVarsStash = {};

  console.log(
    `=============================\n468 string = ${JSON.stringify(
      string,
      null,
      4
    )}`
  );

  // 0. Add current path into breadCrumbPath
  // =======================================

  const breadCrumbPath = Array.from(incomingBreadCrumbPath);
  breadCrumbPath.push(path);

  // 1. First, extract all vars
  // ==========================

  let finalRangesArr = new Ranges();

  function processHeadsAndTails(arr, dontWrapTheseVars, wholeValueIsVariable) {
    for (let i = 0, len = arr.length; i < len; i++) {
      const obj = arr[i];
      console.log(
        `\u001b[${33}m${`490 obj = ${JSON.stringify(
          obj,
          null,
          4
        )}`}\u001b[${39}m`
      );
      const varName = string.slice(obj.headsEndAt, obj.tailsStartAt);
      console.log(
        `500 ${`\u001b[${33}m${`varName`}\u001b[${39}m`} = ${JSON.stringify(
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
        console.log("516 Yay! Value taken from stash!");
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
          if (opts.allowUnresolved) {
            resolvedValue = "";
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
        } else if (Array.isArray(resolvedValue)) {
          resolvedValue = String(resolvedValue.join(""));
        } else if (isNull(resolvedValue)) {
          resolvedValue = "";
        } else {
          resolvedValue = String(resolvedValue);
        }

        console.log(
          `* 574 resolvedValue = ${JSON.stringify(resolvedValue, null, 4)}`
        );
        console.log(`* 576 path = ${JSON.stringify(path, null, 4)}`);
        console.log(`* 577 varName = ${JSON.stringify(varName, null, 4)}`);

        const newPath = path.includes(".")
          ? `${goLevelUp(path)}.${varName}`
          : varName;
        console.log(`* 582 newPath = ${JSON.stringify(newPath, null, 4)}`);
        if (containsHeadsOrTails(resolvedValue, opts)) {
          const replacementVal = wrap(
            resolveString(
              // replacement value    <--------- R E C U R S I O N
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
              obj.headsStartAt, // replace from index
              obj.tailsEndAt, // replace upto index
              replacementVal
            );
          }
        } else {
          // 1. store it in the stash for the future
          secretResolvedVarsStash[varName] = resolvedValue;
          const replacementVal = wrap(
            resolvedValue,
            opts,
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
    foundHeadsAndTails = strFindHeadsTails(string, opts.heads, opts.tails, {
      source: "",
      throwWhenSomethingWrongIsDetected: false,
    });
  } catch (error) {
    throw new Error(
      `json-variables/resolveString(): [THROW_ID_17] While trying to resolve string: "${string}" at path ${path}, something wrong with heads and tails was detected! Here's the internal error message:\n${error}`
    );
  }
  console.log(
    `${`\u001b[${36}m${"694 foundHeadsAndTails = "}\u001b[${39}m`} ${JSON.stringify(
      foundHeadsAndTails,
      null,
      4
    )}`
  );
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

  // 2. Process opts.headsNoWrap, opts.tailsNoWrap as well
  try {
    // strFindHeadsTails() can throw as well if there's mismatch in heads and tails,
    // for example, so it needs to be contained:
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

  console.log(`730 temp2 = ${JSON.stringify(temp2, null, 4)}`);

  // 3. Then, work the finalRangesArr list
  // ================================
  console.log(
    `\u001b[${33}m${`\n729 END OF rangesApply: finalRangesArr.current() = ${JSON.stringify(
      finalRangesArr.current(),
      null,
      4
    )}`}\u001b[${39}m`
  );
  console.log(
    `\u001b[${33}m${`\n736 string was = ${JSON.stringify(
      string,
      null,
      4
    )}`}\u001b[${39}m`
  );

  if (finalRangesArr && finalRangesArr.current()) {
    return rangesApply(string, finalRangesArr.current());
  }
  return string;
}

// -----------------------------------------------------------------------------
//                         M A I N   F U N C T I O N
// -----------------------------------------------------------------------------

function jsonVariables(input, originalOpts = {}) {
  if (!arguments.length) {
    throw new Error(
      "json-variables/jsonVariables(): [THROW_ID_01] Alas! Inputs are missing!"
    );
  }
  if (!isObj(input)) {
    throw new TypeError(
      `json-variables/jsonVariables(): [THROW_ID_02] Alas! The input must be a plain object! Currently it's: ${
        Array.isArray(input) ? "array" : typeof input
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
  const opts = Object.assign({}, defaults, originalOpts);

  if (!opts.dontWrapVars) {
    opts.dontWrapVars = [];
  } else if (!Array.isArray(opts.dontWrapVars)) {
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

  console.log("======== JSON VARIABLES START ========");
  console.log(`input = ${JSON.stringify(input, null, 4)}`);
  console.log(`opts = ${JSON.stringify(opts, null, 4)}`);
  console.log("======== JSON VARIABLES END ========");

  //
  // ===============================================
  //                        1.
  // Let's compile the list of all the vars to resolve
  // ===============================================
  //

  // we return the result of the traversal:
  return traverse(input, (key, val, innerObj) => {
    console.log("\n========================================");
    if (existy(val) && containsHeadsOrTails(key, opts)) {
      throw new Error(
        `json-variables/jsonVariables(): [THROW_ID_15] Alas! Object keys can't contain variables!\nPlease check the following key: ${key}`
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

    console.log(`914 current = ${JSON.stringify(current, null, 4)}`);

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

    console.log(`\n953 current = ${JSON.stringify(current, null, 4)}`);

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

export default jsonVariables;
