/**
 * string-match-left-right
 * Do substrings match what's on the left or right of a given index?
 * Version: 3.11.19
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right
 */

import arrayiffy from 'arrayiffy-if-string';
import { isHighSurrogate, isLowSurrogate } from 'string-character-is-astral-surrogate';

function existy(x) {
  return x != null;
}
function isAstral(char) {
  if (typeof char !== "string") {
    return false;
  }
  return char.charCodeAt(0) >= 55296 && char.charCodeAt(0) <= 57343;
}
function marchForward(str, fromIndexInclusive, strToMatch, opts, special) {
  const strToMatchVal =
    typeof strToMatch === "function" ? strToMatch() : strToMatch;
  if (fromIndexInclusive >= str.length && special && strToMatchVal === "EOL") {
    return strToMatchVal;
  }
  if (fromIndexInclusive <= str.length) {
    let charsToCheckCount = special ? 1 : strToMatch.length;
    for (let i = fromIndexInclusive, len = str.length; i < len; i++) {
      let current = str[i];
      if (opts.skipWhitespace && !str[i].trim().length && str[i + 1]) {
        continue;
      }
      if (isHighSurrogate(str[i]) && isLowSurrogate(str[i + 1])) {
        current = str[i] + str[i + 1];
      }
      if (isLowSurrogate(str[i]) && isHighSurrogate(str[i - 1])) {
        current = str[i - 1] + str[i];
      }
      if (opts.trimBeforeMatching && str[i].trim() === "") {
        continue;
      }
      if (
        (!opts.i && opts.trimCharsBeforeMatching.includes(current)) ||
        (opts.i &&
          opts.trimCharsBeforeMatching
            .map(val => val.toLowerCase())
            .includes(current.toLowerCase()))
      ) {
        if (current.length === 2) {
          i += 1;
        }
        continue;
      }
      let whatToCompareTo = strToMatch[strToMatch.length - charsToCheckCount];
      if (
        isHighSurrogate(whatToCompareTo) &&
        existy(strToMatch[strToMatch.length - charsToCheckCount + 1]) &&
        isLowSurrogate(strToMatch[strToMatch.length - charsToCheckCount + 1])
      ) {
        whatToCompareTo =
          strToMatch[strToMatch.length - charsToCheckCount] +
          strToMatch[strToMatch.length - charsToCheckCount + 1];
      }
      if (
        (!opts.i && current === whatToCompareTo) ||
        (opts.i && current.toLowerCase() === whatToCompareTo.toLowerCase())
      ) {
        charsToCheckCount -= current.length;
        if (charsToCheckCount < 1) {
          let aboutToReturn = i - strToMatch.length + current.length;
          if (
            aboutToReturn >= 0 &&
            isLowSurrogate(str[aboutToReturn]) &&
            existy(str[aboutToReturn - 1]) &&
            isHighSurrogate(str[aboutToReturn - 1])
          ) {
            aboutToReturn -= 1;
          }
          return aboutToReturn >= 0 ? aboutToReturn : 0;
        }
        if (current.length === 2 && isHighSurrogate(str[i])) {
          i += 1;
        }
      } else {
        return false;
      }
    }
    if (charsToCheckCount > 0) {
      if (special && strToMatchVal === "EOL") {
        return true;
      }
      return false;
    }
  } else if (!opts.relaxedApi) {
    throw new Error(
      `string-match-left-right/marchForward(): [THROW_ID_102] second argument, fromIndexInclusive is ${fromIndexInclusive} beyond the input string length, ${str.length}.`
    );
  } else {
    return false;
  }
}
function marchBackward(str, fromIndexInclusive, strToMatch, opts, special) {
  const strToMatchVal =
    typeof strToMatch === "function" ? strToMatch() : strToMatch;
  if (fromIndexInclusive < 0 && special && strToMatchVal === "EOL") {
    return strToMatchVal;
  }
  if (fromIndexInclusive >= str.length) {
    if (!opts.relaxedApi) {
      throw new Error(
        `string-match-left-right/marchBackward(): [THROW_ID_203] second argument, starting index, should not be beyond the last character of the input string! Currently the first argument's last character's index is ${
          str.length
        } but the second argument is beyond it:\n${JSON.stringify(
          fromIndexInclusive,
          null,
          4
        )}`
      );
    } else {
      return false;
    }
  }
  let charsToCheckCount = special ? 1 : strToMatch.length;
  for (let i = fromIndexInclusive + 1; i--; ) {
    if (opts.skipWhitespace && !str[i].trim().length && str[i - 1]) {
      continue;
    }
    if (opts.trimBeforeMatching && str[i].trim() === "") {
      if (i === 0 && special && strToMatch === "EOL") {
        return true;
      }
      continue;
    }
    let currentCharacter = str[i];
    if (isLowSurrogate(str[i]) && isHighSurrogate(str[i - 1])) {
      currentCharacter = str[i - 1] + str[i];
    } else if (isHighSurrogate(str[i]) && isLowSurrogate(str[i + 1])) {
      currentCharacter = str[i] + str[i + 1];
    }
    if (
      (!opts.i && opts.trimCharsBeforeMatching.includes(currentCharacter)) ||
      (opts.i &&
        opts.trimCharsBeforeMatching
          .map(val => val.toLowerCase())
          .includes(currentCharacter.toLowerCase()))
    ) {
      if (currentCharacter.length === 2) {
        i -= 1;
      }
      if (special && strToMatch === "EOL" && i === 0) {
        return true;
      }
      continue;
    }
    let charToCompareAgainst = strToMatch[charsToCheckCount - 1];
    if (isLowSurrogate(charToCompareAgainst)) {
      charToCompareAgainst = `${strToMatch[charsToCheckCount - 2]}${
        strToMatch[charsToCheckCount - 1]
      }`;
      charsToCheckCount -= 1;
      i -= 1;
    }
    if (
      (!opts.i && currentCharacter === charToCompareAgainst) ||
      (opts.i &&
        currentCharacter.toLowerCase() === charToCompareAgainst.toLowerCase())
    ) {
      charsToCheckCount -= 1;
      if (charsToCheckCount < 1) {
        return i >= 0 ? i : 0;
      }
    } else {
      return false;
    }
  }
  if (charsToCheckCount > 0) {
    if (special && strToMatchVal === "EOL") {
      return true;
    }
    return false;
  }
}
function main(mode, str, position, originalWhatToMatch, originalOpts) {
  const defaults = {
    i: false,
    skipWhitespace: false,
    trimBeforeMatching: false,
    trimCharsBeforeMatching: [],
    relaxedApi: false
  };
  if (
    typeof originalOpts === "object" &&
    originalOpts !== null &&
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
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(el =>
    typeof el === "string" ? el : String(el)
  );
  let culpritsIndex;
  let culpritsVal;
  if (
    opts.trimCharsBeforeMatching.some((el, i) => {
      if (el.length > 1 && !isAstral(el)) {
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
  if (typeof str !== "string") {
    if (opts.relaxedApi) {
      return false;
    }
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_01] the first argument should be a string. Currently it's of a type: ${typeof str}, equal to:\n${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  } else if (str.length === 0) {
    if (opts.relaxedApi) {
      return false;
    }
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_02] the first argument should be a non-empty string. Currently it's empty!`
    );
  }
  if (!(Number.isInteger(position) && position >= 0)) {
    if (opts.relaxedApi) {
      return false;
    }
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
  if (typeof originalWhatToMatch === "string") {
    whatToMatch = [originalWhatToMatch];
  } else if (Array.isArray(originalWhatToMatch)) {
    whatToMatch = originalWhatToMatch;
  } else if (!existy(originalWhatToMatch)) {
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
  if (existy(originalOpts) && typeof originalOpts !== "object") {
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof originalOpts}", and equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  if (
    !existy(whatToMatch) ||
    !Array.isArray(whatToMatch) ||
    (Array.isArray(whatToMatch) && !whatToMatch.length) ||
    (Array.isArray(whatToMatch) &&
      whatToMatch.length === 1 &&
      typeof whatToMatch[0] === "string" &&
      whatToMatch[0].trim().length === 0)
  ) {
    if (typeof opts.cb === "function") {
      let firstCharOutsideIndex;
      let startingPosition = position;
      if (
        mode === "matchRight" &&
        isHighSurrogate(str[position]) &&
        isLowSurrogate(str[position + 1])
      ) {
        startingPosition += 1;
      }
      if (mode === "matchLeftIncl" || mode === "matchRight") {
        startingPosition += 1;
      }
      if (mode.startsWith("matchLeft")) {
        for (let y = startingPosition; y--; ) {
          if (
            isLowSurrogate(str[y]) &&
            isHighSurrogate(str[y - 1])
          ) {
            continue;
          }
          let currentChar = str[y];
          if (isHighSurrogate(str[y]) && isLowSurrogate(str[y + 1])) {
            currentChar = str[y] + str[y + 1];
          }
          if (
            (!opts.trimBeforeMatching ||
              (opts.trimBeforeMatching &&
                currentChar !== undefined &&
                currentChar.trim() !== "")) &&
            (opts.trimCharsBeforeMatching.length === 0 ||
              (currentChar !== undefined &&
                !opts.trimCharsBeforeMatching.includes(currentChar)))
          ) {
            firstCharOutsideIndex = y;
            break;
          }
          if (isLowSurrogate(str[y - 1]) && isHighSurrogate(str[y - 2])) {
            y -= 1;
          }
        }
      } else if (mode.startsWith("matchRight")) {
        for (let y = startingPosition; y < str.length; y++) {
          let currentChar = str[y];
          if (isHighSurrogate(str[y]) && isLowSurrogate(str[y + 1])) {
            currentChar = str[y] + str[y + 1];
          }
          if (
            (!opts.trimBeforeMatching ||
              (opts.trimBeforeMatching && currentChar.trim() !== "")) &&
            (opts.trimCharsBeforeMatching.length === 0 ||
              !opts.trimCharsBeforeMatching.includes(currentChar))
          ) {
            firstCharOutsideIndex = y;
            break;
          }
          if (isHighSurrogate(str[y]) && isLowSurrogate(str[y + 1])) {
            y += 1;
          }
        }
      }
      if (firstCharOutsideIndex === undefined) {
        return false;
      }
      let wholeCharacterOutside = str[firstCharOutsideIndex];
      if (
        isHighSurrogate(str[firstCharOutsideIndex]) &&
        isLowSurrogate(str[firstCharOutsideIndex + 1])
      ) {
        wholeCharacterOutside =
          str[firstCharOutsideIndex] + str[firstCharOutsideIndex + 1];
      }
      if (
        isLowSurrogate(str[firstCharOutsideIndex]) &&
        isHighSurrogate(str[firstCharOutsideIndex - 1])
      ) {
        wholeCharacterOutside =
          str[firstCharOutsideIndex - 1] + str[firstCharOutsideIndex];
        firstCharOutsideIndex -= 1;
      }
      let indexOfTheCharacterAfter = firstCharOutsideIndex + 1;
      if (
        isHighSurrogate(str[firstCharOutsideIndex]) &&
        isLowSurrogate(str[firstCharOutsideIndex + 1])
      ) {
        indexOfTheCharacterAfter += 1;
      }
      let secondArg;
      if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
        secondArg = str.slice(0, indexOfTheCharacterAfter);
      }
      if (mode.startsWith("matchLeft")) {
        return opts.cb(wholeCharacterOutside, secondArg, firstCharOutsideIndex);
      }
      if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
        secondArg = str.slice(firstCharOutsideIndex);
      }
      return opts.cb(wholeCharacterOutside, secondArg, firstCharOutsideIndex);
    }
    let extraNote = "";
    if (!existy(originalOpts)) {
      extraNote =
        " More so, the whole options object, the fourth input argument, is missing!";
    }
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!${extraNote}`
    );
  }
  if (mode.startsWith("matchLeft")) {
    for (let i = 0, len = whatToMatch.length; i < len; i++) {
      special = typeof whatToMatch[i] === "function";
      const whatToMatchVal = whatToMatch[i];
      let fullCharacterInFront;
      let indexOfTheCharacterInFront;
      let restOfStringInFront = "";
      let startingPosition = position;
      if (mode === "matchLeft") {
        if (
          isAstral(str[i - 1]) &&
          isAstral(str[i - 2])
        ) {
          startingPosition -= 2;
        } else {
          startingPosition -= 1;
        }
      }
      const found = marchBackward(
        str,
        startingPosition,
        whatToMatchVal,
        opts,
        special
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
      if (existy(found) && found > 0) {
        indexOfTheCharacterInFront = found - 1;
        fullCharacterInFront = str[indexOfTheCharacterInFront];
        restOfStringInFront = str.slice(0, found);
      }
      if (
        isLowSurrogate(str[indexOfTheCharacterInFront]) &&
        existy(str[indexOfTheCharacterInFront - 1]) &&
        isHighSurrogate(str[indexOfTheCharacterInFront - 1])
      ) {
        indexOfTheCharacterInFront -= 1;
        fullCharacterInFront =
          str[indexOfTheCharacterInFront - 1] + str[indexOfTheCharacterInFront];
      }
      if (
        isHighSurrogate(str[indexOfTheCharacterInFront]) &&
        existy(str[indexOfTheCharacterInFront + 1]) &&
        isLowSurrogate(str[indexOfTheCharacterInFront + 1])
      ) {
        fullCharacterInFront =
          str[indexOfTheCharacterInFront] + str[indexOfTheCharacterInFront + 1];
        restOfStringInFront = str.slice(0, indexOfTheCharacterInFront + 2);
      }
      if (
        found !== false &&
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
  for (let i = 0, len = whatToMatch.length; i < len; i++) {
    special = typeof whatToMatch[i] === "function";
    const whatToMatchVal = whatToMatch[i];
    let startingPosition = position + (mode === "matchRight" ? 1 : 0);
    if (
      mode === "matchRight" &&
      isHighSurrogate(str[startingPosition - 1]) &&
      isLowSurrogate(str[startingPosition])
    ) {
      startingPosition += 1;
    }
    const found = marchForward(
      str,
      startingPosition,
      whatToMatchVal,
      opts,
      special
    );
    if (
      found &&
      special &&
      typeof whatToMatchVal === "function" &&
      whatToMatchVal() === "EOL"
    ) {
      let fullCharacterInFront;
      let restOfStringInFront;
      let indexOfTheCharacterInFront;
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
    let indexOfTheCharacterAfter;
    let fullCharacterAfter;
    if (existy(found) && existy(str[found + whatToMatchVal.length - 1])) {
      indexOfTheCharacterAfter = found + whatToMatchVal.length;
      fullCharacterAfter = str[indexOfTheCharacterAfter];
      if (
        isHighSurrogate(str[indexOfTheCharacterAfter]) &&
        isLowSurrogate(str[indexOfTheCharacterAfter + 1])
      ) {
        fullCharacterAfter =
          str[indexOfTheCharacterAfter] + str[indexOfTheCharacterAfter + 1];
      }
    }
    let secondArg;
    if (existy(indexOfTheCharacterAfter) && indexOfTheCharacterAfter >= 0) {
      secondArg = str.slice(indexOfTheCharacterAfter);
    }
    if (
      found !== false &&
      (opts.cb
        ? opts.cb(fullCharacterAfter, secondArg, indexOfTheCharacterAfter)
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
