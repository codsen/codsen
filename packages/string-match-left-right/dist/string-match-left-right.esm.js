/** 
 * string-match-left-right
 * Do substrings match what's on the left or right of a given index?
 * Version: 3.10.36
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-match-left-right
 */
import isNaturalNumber from 'is-natural-number';
import isObj from 'lodash.isplainobject';
import isFun from 'lodash.isfunction';
import arrayiffy from 'arrayiffy-if-string';
import { isHighSurrogate, isLowSurrogate } from 'string-character-is-astral-surrogate';

const isArr = Array.isArray;
function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === "string";
}
function isAstral(char) {
  if (typeof char !== "string") {
    return false;
  }
  return char.charCodeAt(0) >= 55296 && char.charCodeAt(0) <= 57343;
}
function marchForward(str, fromIndexInclusive, strToMatch, opts, special) {
  console.log(`030 \u001b[${35}m${"CALLED marchForward()"}\u001b[${39}m`);
  console.log(
    `======\nargs:\nstr=${str}\nfromIndexInclusive=${fromIndexInclusive}\nstrToMatch=${strToMatch}\nopts=${JSON.stringify(
      opts,
      null,
      4
    )}\nspecial=${special}\n======\n`
  );
  const strToMatchVal =
    typeof strToMatch === "function" ? strToMatch() : strToMatch;
  if (fromIndexInclusive >= str.length && special && strToMatchVal === "EOL") {
    console.log("044 EARLY ENDING, return true");
    return strToMatchVal;
  }
  console.log(
    `049 ${`\u001b[${33}m${"fromIndexInclusive"}\u001b[${39}m`} = ${JSON.stringify(
      fromIndexInclusive,
      null,
      4
    )}`
  );
  if (fromIndexInclusive <= str.length) {
    let charsToCheckCount = special ? 1 : strToMatch.length;
    console.log(`058 starting charsToCheckCount = ${charsToCheckCount}`);
    for (let i = fromIndexInclusive, len = str.length; i < len; i++) {
      console.log(
        `\u001b[${36}m${`================================== str[${i}] = ${str[i]}`}\u001b[${39}m`
      );
      let current = str[i];
      if (isHighSurrogate(str[i]) && isLowSurrogate(str[i + 1])) {
        console.log(
          `071 \u001b[${33}m${"low surrogate on the right added"}\u001b[${39}m`
        );
        current = str[i] + str[i + 1];
      }
      if (isLowSurrogate(str[i]) && isHighSurrogate(str[i - 1])) {
        console.log(
          `081 \u001b[${33}m${"high surrogate on the left added"}\u001b[${39}m`
        );
        current = str[i - 1] + str[i];
      }
      console.log(
        `087 ${`\u001b[${33}m${"current"}\u001b[${39}m`} = ${JSON.stringify(
          current,
          null,
          4
        )}`
      );
      if (opts.trimBeforeMatching && str[i].trim() === "") {
        console.log(`094 \u001b[${31}m${"trimmed"}\u001b[${39}m`);
        continue;
      }
      if (
        (!opts.i && opts.trimCharsBeforeMatching.includes(current)) ||
        (opts.i &&
          opts.trimCharsBeforeMatching
            .map(val => val.toLowerCase())
            .includes(current.toLowerCase()))
      ) {
        console.log("104 char in the skip list");
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
      console.log(
        `124 ${`\u001b[${33}m${"whatToCompareTo"}\u001b[${39}m`} = ${JSON.stringify(
          whatToCompareTo,
          null,
          4
        )}`
      );
      if (
        (!opts.i && current === whatToCompareTo) ||
        (opts.i && current.toLowerCase() === whatToCompareTo.toLowerCase())
      ) {
        charsToCheckCount -= current.length;
        if (charsToCheckCount < 1) {
          console.log(`138 THIS WAS THE LAST SYMBOL TO CHECK, ${current}`);
          console.log(
            `140 ${`\u001b[${33}m${"i"}\u001b[${39}m`} = ${JSON.stringify(
              i,
              null,
              4
            )}`
          );
          console.log(
            `147 ${`\u001b[${33}m${"strToMatch.length"}\u001b[${39}m`} = ${JSON.stringify(
              strToMatch.length,
              null,
              4
            )}`
          );
          let aboutToReturn = i - strToMatch.length + current.length;
          console.log(
            `157 ${`\u001b[${33}m${"aboutToReturn"}\u001b[${39}m`} = ${JSON.stringify(
              aboutToReturn,
              null,
              4
            )}`
          );
          if (
            aboutToReturn >= 0 &&
            isLowSurrogate(str[aboutToReturn]) &&
            existy(str[aboutToReturn - 1]) &&
            isHighSurrogate(str[aboutToReturn - 1])
          ) {
            console.log(
              `177 ${`\u001b[${33}m${"aboutToReturn --1, now = "}\u001b[${39}m`} = ${JSON.stringify(
                aboutToReturn,
                null,
                4
              )}`
            );
            aboutToReturn -= 1;
          }
          return aboutToReturn >= 0 ? aboutToReturn : 0;
        }
        console.log(
          `190 OK. Reduced charsToCheckCount to ${charsToCheckCount}`
        );
        if (current.length === 2 && isHighSurrogate(str[i])) {
          i += 1;
        }
      } else {
        console.log(`197 str[i = ${i}] = ${JSON.stringify(str[i], null, 4)}`);
        console.log(
          `199 strToMatch[strToMatch.length - charsToCheckCount = ${strToMatch.length -
            charsToCheckCount}] = ${JSON.stringify(
            strToMatch[strToMatch.length - charsToCheckCount],
            null,
            4
          )}`
        );
        console.log("206 THEREFORE, returning false.");
        return false;
      }
      console.log(
        `210 * charsToCheckCount = ${JSON.stringify(
          charsToCheckCount,
          null,
          4
        )}`
      );
    }
    if (charsToCheckCount > 0) {
      if (special && strToMatchVal === "EOL") {
        console.log(
          `220 charsToCheckCount = ${charsToCheckCount};\nwent past the beginning of the string and EOL was queried to return TRUE`
        );
        return true;
      }
      console.log(
        `225 charsToCheckCount = ${charsToCheckCount} THEREFORE, returning FALSE`
      );
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
  console.log(`240 \u001b[${35}m${"CALLED marchBackward()"}\u001b[${39}m`);
  console.log(
    `======\nargs:\nstr=${str}\nfromIndexInclusive=${fromIndexInclusive}\nstrToMatch=${strToMatch}\nopts=${JSON.stringify(
      opts,
      null,
      4
    )}\nspecial=${special}\n======\n`
  );
  const strToMatchVal =
    typeof strToMatch === "function" ? strToMatch() : strToMatch;
  if (fromIndexInclusive < 0 && special && strToMatchVal === "EOL") {
    console.log("254 EARLY ENDING, return true");
    return strToMatchVal;
  }
  console.log(
    `259 ${`\u001b[${33}m${"fromIndexInclusive"}\u001b[${39}m`} = ${JSON.stringify(
      fromIndexInclusive,
      null,
      4
    )}`
  );
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
  console.log(`282 starting charsToCheckCount = ${charsToCheckCount}`);
  for (let i = fromIndexInclusive + 1; i--; ) {
    console.log(
      `286 ${`\u001b[${36}m${"=================================="}\u001b[${39}m`} ${i}: >>${
        str[i]
      }<< [${str[i].charCodeAt(0)}]`
    );
    console.log(
      `291 ${i - 1}: >>${str[i - 1]}<< [${
        existy(str[i - 1]) ? str[i - 1].charCodeAt(0) : "undefined"
      }]`
    );
    if (opts.trimBeforeMatching && str[i].trim() === "") {
      console.log("296 trimmed");
      if (i === 0 && special && strToMatch === "EOL") {
        console.log(
          "299 start of string reached, matching to EOL, so return true"
        );
        return true;
      }
      continue;
    }
    let currentCharacter = str[i];
    if (isLowSurrogate(str[i]) && isHighSurrogate(str[i - 1])) {
      currentCharacter = str[i - 1] + str[i];
      console.log(
        `309 ${`\u001b[${33}m${"currentCharacter"}\u001b[${39}m`} = ${JSON.stringify(
          currentCharacter,
          null,
          4
        )}`
      );
    } else if (isHighSurrogate(str[i]) && isLowSurrogate(str[i + 1])) {
      currentCharacter = str[i] + str[i + 1];
    }
    console.log(
      `319 \u001b[${32}m${"currentCharacter"}\u001b[${39}m = ${currentCharacter}`
    );
    console.log(
      `322 ${`\u001b[${33}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`} = ${JSON.stringify(
        opts.trimCharsBeforeMatching,
        null,
        4
      )}`
    );
    console.log(
      `329 ${`\u001b[${33}m${"opts.trimCharsBeforeMatching.includes(currentCharacter)"}\u001b[${39}m`} = ${JSON.stringify(
        opts.trimCharsBeforeMatching.includes(currentCharacter),
        null,
        4
      )}`
    );
    if (
      (!opts.i && opts.trimCharsBeforeMatching.includes(currentCharacter)) ||
      (opts.i &&
        opts.trimCharsBeforeMatching
          .map(val => val.toLowerCase())
          .includes(currentCharacter.toLowerCase()))
    ) {
      console.log("342 char is in the skip list");
      if (currentCharacter.length === 2) {
        i -= 1;
      }
      if (special && strToMatch === "EOL" && i === 0) {
        console.log(
          "350 RETURN true because it's EOL next, exactly what we're looking for"
        );
        return true;
      }
      continue;
    }
    console.log(
      `357 ${`\u001b[${33}m${"charsToCheckCount"}\u001b[${39}m`} = ${JSON.stringify(
        charsToCheckCount,
        null,
        4
      )}`
    );
    console.log(`363 ${strToMatch[charsToCheckCount - 1]}`);
    console.log(
      `365 ${strToMatch[charsToCheckCount - 2]}${
        strToMatch[charsToCheckCount - 1]
      }`
    );
    let charToCompareAgainst = strToMatch[charsToCheckCount - 1];
    if (isLowSurrogate(charToCompareAgainst)) {
      charToCompareAgainst = `${strToMatch[charsToCheckCount - 2]}${
        strToMatch[charsToCheckCount - 1]
      }`;
      console.log(
        `377 ${`\u001b[${33}m${"charToCompareAgainst"}\u001b[${39}m`} = ${JSON.stringify(
          charToCompareAgainst,
          null,
          4
        )}`
      );
      charsToCheckCount -= 1;
      i -= 1;
    }
    console.log(
      `\n* 371 \u001b[${31}m${"currentCharacter"}\u001b[${39}m = ${currentCharacter}`
    );
    console.log(
      `* 391 \u001b[${31}m${"charToCompareAgainst"}\u001b[${39}m = ${charToCompareAgainst}`
    );
    if (
      (!opts.i && currentCharacter === charToCompareAgainst) ||
      (opts.i &&
        currentCharacter.toLowerCase() === charToCompareAgainst.toLowerCase())
    ) {
      charsToCheckCount -= 1;
      if (charsToCheckCount < 1) {
        console.log(
          `401 all chars matched so returning i = ${i}; charsToCheckCount = ${charsToCheckCount}`
        );
        return i >= 0 ? i : 0;
      }
      console.log(
        `407 ${`\u001b[${32}m${`OK. Reduced charsToCheckCount to ${charsToCheckCount}`}\u001b[${39}m`}`
      );
    } else {
      console.log(`410 str[i = ${i}] = ${JSON.stringify(str[i], null, 4)}`);
      console.log(
        `412 strToMatch[strToMatch.length - charsToCheckCount = ${strToMatch.length -
          charsToCheckCount}] = ${JSON.stringify(
          strToMatch[strToMatch.length - charsToCheckCount],
          null,
          4
        )}`
      );
      console.log("419 THEREFORE, returning false.");
      return false;
    }
    console.log(
      `424 * charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`
    );
  }
  if (charsToCheckCount > 0) {
    if (special && strToMatchVal === "EOL") {
      console.log(
        `430 charsToCheckCount = ${charsToCheckCount};\nwent past the beginning of the string and EOL was queried to return TRUE`
      );
      return true;
    }
    console.log(
      `435 charsToCheckCount = ${charsToCheckCount} THEREFORE, returning FALSE`
    );
    return false;
  }
}
function main(mode, str, position, originalWhatToMatch, originalOpts) {
  const defaults = {
    i: false,
    trimBeforeMatching: false,
    trimCharsBeforeMatching: [],
    relaxedApi: false
  };
  const opts = Object.assign({}, defaults, originalOpts);
  opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(el =>
    isStr(el) ? el : String(el)
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
  if (!isStr(str)) {
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
  if (!isNaturalNumber(position, { includeZero: true })) {
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
  if (isStr(originalWhatToMatch)) {
    console.log("508");
    whatToMatch = [originalWhatToMatch];
  } else if (isArr(originalWhatToMatch)) {
    console.log("511");
    whatToMatch = originalWhatToMatch;
  } else if (!existy(originalWhatToMatch)) {
    console.log("514");
    whatToMatch = originalWhatToMatch;
  } else if (isFun(originalWhatToMatch)) {
    console.log("517");
    whatToMatch = [];
    whatToMatch.push(originalWhatToMatch);
    console.log(
      `521 whatToMatch = ${whatToMatch}; Array.isArray(whatToMatch) = ${Array.isArray(
        whatToMatch
      )}; whatToMatch.length = ${whatToMatch.length}`
    );
  } else {
    console.log("526");
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof originalWhatToMatch}, equal to:\n${JSON.stringify(
        originalWhatToMatch,
        null,
        4
      )}`
    );
  }
  console.log("\n\n");
  console.log(
    `538 whatToMatch = ${whatToMatch}; typeof whatToMatch = ${typeof whatToMatch}`
  );
  if (existy(originalOpts) && !isObj(originalOpts)) {
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
    !isArr(whatToMatch) ||
    (isArr(whatToMatch) && !whatToMatch.length) ||
    (isArr(whatToMatch) &&
      whatToMatch.length === 1 &&
      isStr(whatToMatch[0]) &&
      whatToMatch[0].trim().length === 0)
  ) {
    if (typeof opts.cb === "function") {
      console.log("566");
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
          console.log(
            `622 ${`\u001b[${33}m${"currentChar"}\u001b[${39}m`} = ${JSON.stringify(
              currentChar,
              null,
              4
            )}`
          );
          if (
            (!opts.trimBeforeMatching ||
              (opts.trimBeforeMatching && currentChar.trim() !== "")) &&
            (opts.trimCharsBeforeMatching.length === 0 ||
              !opts.trimCharsBeforeMatching.includes(currentChar))
          ) {
            console.log("635 breaking!");
            firstCharOutsideIndex = y;
            break;
          }
          if (isHighSurrogate(str[y]) && isLowSurrogate(str[y + 1])) {
            y += 1;
          }
        }
      }
      if (firstCharOutsideIndex === undefined) {
        console.log("647 returning false");
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
        console.log(`681`);
        return opts.cb(wholeCharacterOutside, secondArg, firstCharOutsideIndex);
      }
      if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
        secondArg = str.slice(firstCharOutsideIndex);
      }
      console.log(`689`);
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
      console.log(
        `\n689 matchLeft() LOOP ${i} ${`\u001b[${32}m${`=================================================================================`}\u001b[${39}m`} \n\n`
      );
      special = typeof whatToMatch[i] === "function";
      console.log(`715 special = ${special}`);
      console.log(
        "\n\n\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
      );
      console.log(
        `721 whatToMatch no. ${i} = ${
          whatToMatch[i]
        } (type ${typeof whatToMatch[i]})`
      );
      console.log(`special = ${special}`);
      console.log(
        "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
      );
      const whatToMatchVal = whatToMatch[i];
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
      console.log(
        `760 \u001b[${33}m${"marchBackward() called with:"}\u001b[${39}m\n* startingPosition = ${JSON.stringify(
          startingPosition,
          null,
          4
        )}\n* whatToMatchVal = "${whatToMatchVal}"\n`
      );
      console.log("\n\n\n\n\n\n");
      console.log(
        `768 ███████████████████████████████████████ marchBackward() STARTS BELOW ███████████████████████████████████████`
      );
      const found = marchBackward(
        str,
        startingPosition,
        whatToMatchVal,
        opts,
        special
      );
      console.log(
        `778 ███████████████████████████████████████ marchBackward() ENDED ABOVE ███████████████████████████████████████\n\n\n\n\n\n`
      );
      console.log(
        `781 \u001b[${33}m${"found"}\u001b[${39}m = ${JSON.stringify(
          found,
          null,
          4
        )}`
      );
      if (
        found &&
        special &&
        typeof whatToMatchVal === "function" &&
        whatToMatchVal() === "EOL"
      ) {
        console.log(`796 returning whatToMatchVal() = ${whatToMatchVal()}`);
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
      let indexOfTheCharacterInFront;
      let fullCharacterInFront;
      let restOfStringInFront = "";
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
        console.log("836 the character in front is low surrogate");
        indexOfTheCharacterInFront -= 1;
        fullCharacterInFront =
          str[indexOfTheCharacterInFront - 1] + str[indexOfTheCharacterInFront];
        console.log(
          `${`\u001b[${33}m${"fullCharacterInFront"}\u001b[${39}m`} = ${JSON.stringify(
            fullCharacterInFront,
            null,
            4
          )}`
        );
      }
      if (
        isHighSurrogate(str[indexOfTheCharacterInFront]) &&
        existy(str[indexOfTheCharacterInFront + 1]) &&
        isLowSurrogate(str[indexOfTheCharacterInFront + 1])
      ) {
        console.log(
          "854 adding low surrogate to str[indexOfTheCharacterInFront]"
        );
        fullCharacterInFront =
          str[indexOfTheCharacterInFront] + str[indexOfTheCharacterInFront + 1];
        console.log(
          `${`\u001b[${33}m${"fullCharacterInFront"}\u001b[${39}m`} = ${JSON.stringify(
            fullCharacterInFront,
            null,
            4
          )}`
        );
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
    console.log(
      "\n\n\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
    );
    console.log(`889 whatToMatch no. ${i} = ${whatToMatch[i]}`);
    console.log(`special = ${special}`);
    console.log(
      "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
    );
    const whatToMatchVal = whatToMatch[i];
    let startingPosition = position + (mode === "matchRight" ? 1 : 0);
    console.log(
      `901 \u001b[${32}m${"startingPosition"}\u001b[${39}m = ${startingPosition}`
    );
    if (
      mode === "matchRight" &&
      (isHighSurrogate(str[startingPosition - 1]) &&
        isLowSurrogate(str[startingPosition]))
    ) {
      startingPosition += 1;
      console.log(
        `910 +1: \u001b[${32}m${"startingPosition"}\u001b[${39}m = ${startingPosition}`
      );
    }
    const found = marchForward(
      str,
      startingPosition,
      whatToMatchVal,
      opts,
      special
    );
    console.log(
      `922 ${`\u001b[${33}m${"found"}\u001b[${39}m`} = ${JSON.stringify(
        found,
        null,
        4
      )}`
    );
    if (
      found &&
      special &&
      typeof whatToMatchVal === "function" &&
      whatToMatchVal() === "EOL"
    ) {
      console.log(`937 returning whatToMatchVal() = ${whatToMatchVal()}`);
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
    console.log(
      `\n808 ${`\u001b[${33}m${"fullCharacterAfter"}\u001b[${39}m`} = ${JSON.stringify(
        fullCharacterAfter,
        null,
        4
      )}`
    );
    console.log(
      `983 ${`\u001b[${33}m${"indexOfTheCharacterAfter"}\u001b[${39}m`} = ${JSON.stringify(
        indexOfTheCharacterAfter,
        null,
        4
      )}\n`
    );
    console.log(
      `990 ${`\u001b[${33}m${`whatToMatchVal`}\u001b[${39}m`} = ${JSON.stringify(
        whatToMatchVal,
        null,
        4
      )} (${typeof whatToMatchVal})`
    );
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
