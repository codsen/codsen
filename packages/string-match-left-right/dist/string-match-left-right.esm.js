/**
 * string-match-left-right
 * Do substrings match what's on the left or right of a given index?
 * Version: 4.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right
 */

import arrayiffy from 'arrayiffy-if-string';

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function isStr(something) {
  return typeof something === "string";
}
function march(
  str,
  fromIndexInclusive,
  whatToMatchVal,
  opts,
  special,
  getNextIdx
) {
  const whatToMatchValVal =
    typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal;
  if (fromIndexInclusive < 0 && special && whatToMatchValVal === "EOL") {
    return whatToMatchValVal;
  }
  if (fromIndexInclusive >= str.length && !special) {
    return false;
  }
  let charsToCheckCount = special ? 1 : whatToMatchVal.length;
  let lastWasMismatched = false;
  let atLeastSomethingWasMatched = false;
  let patience = opts.maxMismatches;
  let i = fromIndexInclusive;
  let somethingFound = false;
  let firstCharacterMatched = false;
  let lastCharacterMatched = false;
  while (str[i]) {
    const nextIdx = getNextIdx(i);
    if (opts.trimBeforeMatching && str[i].trim() === "") {
      if (!str[nextIdx] && special && whatToMatchVal === "EOL") {
        return true;
      }
      i = getNextIdx(i);
      continue;
    }
    if (
      (!opts.i && opts.trimCharsBeforeMatching.includes(str[i])) ||
      (opts.i &&
        opts.trimCharsBeforeMatching
          .map((val) => val.toLowerCase())
          .includes(str[i].toLowerCase()))
    ) {
      if (special && whatToMatchVal === "EOL" && !str[nextIdx]) {
        return true;
      }
      i = getNextIdx(i);
      continue;
    }
    const charToCompareAgainst =
      nextIdx > i
        ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount]
        : whatToMatchVal[charsToCheckCount - 1];
    if (
      (!opts.i && str[i] === charToCompareAgainst) ||
      (opts.i && str[i].toLowerCase() === charToCompareAgainst.toLowerCase())
    ) {
      if (!somethingFound) {
        somethingFound = true;
      }
      if (!atLeastSomethingWasMatched) {
        atLeastSomethingWasMatched = true;
      }
      if (charsToCheckCount === whatToMatchVal.length) {
        firstCharacterMatched = true;
      } else if (charsToCheckCount === 1) {
        lastCharacterMatched = true;
      }
      charsToCheckCount -= 1;
      if (charsToCheckCount < 1) {
        return i;
      }
    } else {
      if (opts.maxMismatches && patience && i) {
        patience--;
        for (let y = 0; y <= patience; y++) {
          const nextCharToCompareAgainst =
            nextIdx > i
              ? whatToMatchVal[
                  whatToMatchVal.length - charsToCheckCount + 1 + y
                ]
              : whatToMatchVal[charsToCheckCount - 2 - y];
          const nextCharInSource = str[getNextIdx(i)];
          if (
            nextCharToCompareAgainst &&
            ((!opts.i && str[i] === nextCharToCompareAgainst) ||
              (opts.i &&
                str[i].toLowerCase() ===
                  nextCharToCompareAgainst.toLowerCase())) &&
            (!opts.firstMustMatch ||
              charsToCheckCount !== whatToMatchVal.length)
          ) {
            charsToCheckCount -= 2;
            somethingFound = true;
            break;
          } else if (
            nextCharInSource &&
            nextCharToCompareAgainst &&
            ((!opts.i && nextCharInSource === nextCharToCompareAgainst) ||
              (opts.i &&
                nextCharInSource.toLowerCase() ===
                  nextCharToCompareAgainst.toLowerCase())) &&
            (!opts.firstMustMatch ||
              charsToCheckCount !== whatToMatchVal.length)
          ) {
            charsToCheckCount -= 1;
            somethingFound = true;
            break;
          } else if (
            nextCharToCompareAgainst === undefined &&
            patience >= 0 &&
            somethingFound &&
            (!opts.firstMustMatch || firstCharacterMatched) &&
            (!opts.lastMustMatch || lastCharacterMatched)
          ) {
            return i;
          }
        }
        if (!somethingFound) {
          lastWasMismatched = i;
        }
      } else if (
        i === 0 &&
        charsToCheckCount === 1 &&
        !opts.lastMustMatch &&
        atLeastSomethingWasMatched
      ) {
        return 0;
      } else {
        return false;
      }
    }
    if (lastWasMismatched !== false && lastWasMismatched !== i) {
      lastWasMismatched = false;
    }
    if (charsToCheckCount < 1) {
      return i;
    }
    i = getNextIdx(i);
  }
  if (charsToCheckCount > 0) {
    if (special && whatToMatchValVal === "EOL") {
      return true;
    } else if (
      opts.maxMismatches >= charsToCheckCount &&
      atLeastSomethingWasMatched
    ) {
      return lastWasMismatched || 0;
    }
    return false;
  }
}
function main(mode, str, position, originalWhatToMatch, originalOpts) {
  const defaults = {
    i: false,
    trimBeforeMatching: false,
    trimCharsBeforeMatching: [],
    maxMismatches: 0,
    firstMustMatch: false,
    lastMustMatch: false,
  };
  if (
    isObj(originalOpts) &&
    Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") &&
    typeof originalOpts.trimBeforeMatching !== "boolean"
  ) {
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!${
        Array.isArray(originalOpts.trimBeforeMatching)
          ? ` Did you mean to use opts.trimCharsBeforeMatching?`
          : ""
      }`
    );
  }
  const opts = Object.assign({}, defaults, originalOpts);
  opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map((el) =>
    isStr(el) ? el : String(el)
  );
  if (!isStr(str)) {
    return false;
  } else if (!str.length) {
    return false;
  }
  if (!Number.isInteger(position) || position < 0) {
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ${typeof position}, equal to:\n${JSON.stringify(
        position,
        null,
        4
      )}`
    );
  }
  let whatToMatch;
  let special;
  if (isStr(originalWhatToMatch)) {
    whatToMatch = [originalWhatToMatch];
  } else if (Array.isArray(originalWhatToMatch)) {
    whatToMatch = originalWhatToMatch;
  } else if (!originalWhatToMatch) {
    whatToMatch = originalWhatToMatch;
  } else if (typeof originalWhatToMatch === "function") {
    whatToMatch = [];
    whatToMatch.push(originalWhatToMatch);
  } else {
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof originalWhatToMatch}, equal to:\n${JSON.stringify(
        originalWhatToMatch,
        null,
        4
      )}`
    );
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof originalOpts}", and equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  let culpritsIndex;
  let culpritsVal;
  if (
    opts.trimCharsBeforeMatching.some((el, i) => {
      if (el.length > 1) {
        culpritsIndex = i;
        culpritsVal = el;
        return true;
      }
      return false;
    })
  ) {
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ${culpritsIndex} is longer than 1 character, ${culpritsVal.length} (equals to ${culpritsVal}). Please split it into separate characters and put into array as separate elements.`
    );
  }
  if (
    !whatToMatch ||
    !Array.isArray(whatToMatch) ||
    (Array.isArray(whatToMatch) && !whatToMatch.length) ||
    (Array.isArray(whatToMatch) &&
      whatToMatch.length === 1 &&
      isStr(whatToMatch[0]) &&
      !whatToMatch[0].trim().length)
  ) {
    if (typeof opts.cb === "function") {
      let firstCharOutsideIndex;
      let startingPosition = position;
      if (mode === "matchLeftIncl" || mode === "matchRight") {
        startingPosition += 1;
      }
      if (mode[5] === "L") {
        for (let y = startingPosition; y--; ) {
          const currentChar = str[y];
          if (
            (!opts.trimBeforeMatching ||
              (opts.trimBeforeMatching &&
                currentChar !== undefined &&
                currentChar.trim().length)) &&
            (!opts.trimCharsBeforeMatching.length ||
              (currentChar !== undefined &&
                !opts.trimCharsBeforeMatching.includes(currentChar)))
          ) {
            firstCharOutsideIndex = y;
            break;
          }
        }
      } else if (mode.startsWith("matchRight")) {
        for (let y = startingPosition; y < str.length; y++) {
          const currentChar = str[y];
          if (
            (!opts.trimBeforeMatching ||
              (opts.trimBeforeMatching && currentChar.trim().length)) &&
            (!opts.trimCharsBeforeMatching.length ||
              !opts.trimCharsBeforeMatching.includes(currentChar))
          ) {
            firstCharOutsideIndex = y;
            break;
          }
        }
      }
      if (firstCharOutsideIndex === undefined) {
        return false;
      }
      const wholeCharacterOutside = str[firstCharOutsideIndex];
      const indexOfTheCharacterAfter = firstCharOutsideIndex + 1;
      let theRemainderOfTheString = "";
      if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
        theRemainderOfTheString = str.slice(0, indexOfTheCharacterAfter);
      }
      if (mode[5] === "L") {
        return opts.cb(
          wholeCharacterOutside,
          theRemainderOfTheString,
          firstCharOutsideIndex
        );
      }
      if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
        theRemainderOfTheString = str.slice(firstCharOutsideIndex);
      }
      return opts.cb(
        wholeCharacterOutside,
        theRemainderOfTheString,
        firstCharOutsideIndex
      );
    }
    let extraNote = "";
    if (!originalOpts) {
      extraNote =
        " More so, the whole options object, the fourth input argument, is missing!";
    }
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!${extraNote}`
    );
  }
  for (let i = 0, len = whatToMatch.length; i < len; i++) {
    special = typeof whatToMatch[i] === "function";
    const whatToMatchVal = whatToMatch[i];
    let fullCharacterInFront;
    let indexOfTheCharacterInFront;
    let restOfStringInFront = "";
    let startingPosition = position;
    if (mode === "matchRight") {
      startingPosition++;
    } else if (mode === "matchLeft") {
      startingPosition--;
    }
    const found = march(
      str,
      startingPosition,
      whatToMatchVal,
      opts,
      special,
      (i) => (mode[5] === "L" ? i - 1 : i + 1)
    );
    if (
      found &&
      special &&
      typeof whatToMatchVal === "function" &&
      whatToMatchVal() === "EOL"
    ) {
      return whatToMatchVal() &&
        (opts.cb
          ? opts.cb(
              fullCharacterInFront,
              restOfStringInFront,
              indexOfTheCharacterInFront
            )
          : true)
        ? whatToMatchVal()
        : false;
    }
    if (Number.isInteger(found)) {
      indexOfTheCharacterInFront = mode.startsWith("matchLeft")
        ? found - 1
        : found + 1;
      if (mode[5] === "L") {
        restOfStringInFront = str.slice(0, found);
      } else {
        restOfStringInFront = str.slice(indexOfTheCharacterInFront);
      }
    }
    if (indexOfTheCharacterInFront < 0) {
      indexOfTheCharacterInFront = undefined;
    }
    if (str[indexOfTheCharacterInFront]) {
      fullCharacterInFront = str[indexOfTheCharacterInFront];
    }
    if (
      Number.isInteger(found) &&
      (opts.cb
        ? opts.cb(
            fullCharacterInFront,
            restOfStringInFront,
            indexOfTheCharacterInFront
          )
        : true)
    ) {
      return whatToMatchVal;
    }
  }
  return false;
}
function matchLeftIncl(str, position, whatToMatch, opts) {
  return main("matchLeftIncl", str, position, whatToMatch, opts);
}
function matchLeft(str, position, whatToMatch, opts) {
  return main("matchLeft", str, position, whatToMatch, opts);
}
function matchRightIncl(str, position, whatToMatch, opts) {
  return main("matchRightIncl", str, position, whatToMatch, opts);
}
function matchRight(str, position, whatToMatch, opts) {
  return main("matchRight", str, position, whatToMatch, opts);
}

export { matchLeft, matchLeftIncl, matchRight, matchRightIncl };
