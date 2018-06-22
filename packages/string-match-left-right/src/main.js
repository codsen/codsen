import isNaturalNumber from "is-natural-number";
import checkTypes from "check-types-mini";
import isObj from "lodash.isplainobject";
import arrayiffy from "arrayiffy-if-string";
import {
  isHighSurrogate,
  isLowSurrogate
} from "string-character-is-astral-surrogate";

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

// A helper f(). Uses 1xx range error codes.
// Returns the index number of the first character of "strToMatch". That's location
// within the input string, "str".
function marchForward(str, fromIndexInclusive, strToMatch, opts) {
  console.log(
    `29 marchForward: ${`\u001b[${33}m${"fromIndexInclusive"}\u001b[${39}m`} = ${JSON.stringify(
      fromIndexInclusive,
      null,
      4
    )}`
  );

  if (fromIndexInclusive <= str.length) {
    let charsToCheckCount = strToMatch.length;
    console.log(
      `39 starting ${`\u001b[${33}m${"charsToCheckCount"}\u001b[${39}m`} = ${JSON.stringify(
        charsToCheckCount,
        null,
        4
      )}`
    );
    for (let i = fromIndexInclusive, len = str.length; i < len; i++) {
      console.log(
        `\u001b[${36}m${`================================== str[${i}] = ${
          str[i]
        }`}\u001b[${39}m`
      );
      let current = str[i];

      // FIY, high surrogate goes first, low goes second
      // if it's first part of the emoji, glue the second part onto this:
      if (isHighSurrogate(str[i]) && isLowSurrogate(str[i + 1])) {
        // and if it is, glue second onto first-one
        console.log(
          `58 \u001b[${33}m${"low surrogate on the right added"}\u001b[${39}m`
        );
        current = str[i] + str[i + 1];
      }
      // alternatively, if somehow the starting index was given in the middle,
      // between heads and tails surrogates of this emoji, and we're on the tails
      // already, check for presence of heads in front and glue that if present:
      if (isLowSurrogate(str[i]) && isHighSurrogate(str[i - 1])) {
        // and if it is, glue second onto first-one
        console.log(
          `68 \u001b[${33}m${"high surrogate on the left added"}\u001b[${39}m`
        );
        current = str[i - 1] + str[i];
      }

      console.log(
        `74 ${`\u001b[${33}m${"current"}\u001b[${39}m`} = ${JSON.stringify(
          current,
          null,
          4
        )}`
      );
      if (opts.trimBeforeMatching && str[i].trim() === "") {
        console.log(`81 \u001b[${31}m${"trimmed"}\u001b[${39}m`);
        continue;
      }
      if (
        (!opts.i && opts.trimCharsBeforeMatching.includes(current)) ||
        (opts.i &&
          opts.trimCharsBeforeMatching
            .map(val => val.toLowerCase())
            .includes(current.toLowerCase()))
      ) {
        console.log("91 char in the skip list");
        if (current.length === 2) {
          // if it was emoji, offset by two
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
        `111 ${`\u001b[${33}m${"whatToCompareTo"}\u001b[${39}m`} = ${JSON.stringify(
          whatToCompareTo,
          null,
          4
        )}`
      );
      if (
        (!opts.i && current === whatToCompareTo) ||
        (opts.i && current.toLowerCase() === whatToCompareTo.toLowerCase())
      ) {
        charsToCheckCount -= current.length; // normally 1, but
        // if it's emoji, it can be 2

        if (charsToCheckCount < 1) {
          console.log(`125 THIS WAS THE LAST SYMBOL TO CHECK, ${current}`);
          console.log(
            `127 ${`\u001b[${33}m${"i"}\u001b[${39}m`} = ${JSON.stringify(
              i,
              null,
              4
            )}`
          );
          console.log(
            `134 ${`\u001b[${33}m${"strToMatch.length"}\u001b[${39}m`} = ${JSON.stringify(
              strToMatch.length,
              null,
              4
            )}`
          );

          let aboutToReturn = i - strToMatch.length + current.length;

          console.log(
            `144 ${`\u001b[${33}m${"aboutToReturn"}\u001b[${39}m`} = ${JSON.stringify(
              aboutToReturn,
              null,
              4
            )}`
          );

          // Now, before returning result index, we need to take care of one specific
          // case.
          // If somehow the starting index was given in the middle of astral character,
          // algorithm would treat that as index at the beginning of the character.
          // However, at this point, result is that index in the middle.
          // We need to check and offset the index to be also at the beginning here.
          if (
            aboutToReturn >= 0 &&
            isLowSurrogate(str[aboutToReturn]) &&
            existy(str[aboutToReturn - 1]) &&
            isHighSurrogate(str[aboutToReturn - 1])
          ) {
            console.log(
              `164 ${`\u001b[${33}m${"aboutToReturn --1, now = "}\u001b[${39}m`} = ${JSON.stringify(
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
          `176 OK. Reduced charsToCheckCount to ${charsToCheckCount}`
        );
        if (current.length === 2 && isHighSurrogate(str[i])) {
          // if it was emoji, offset by two
          i += 1;
        }
      } else {
        console.log(`184 str[i = ${i}] = ${JSON.stringify(str[i], null, 4)}`);
        console.log(
          `105 strToMatch[strToMatch.length - charsToCheckCount = ${strToMatch.length -
            charsToCheckCount}] = ${JSON.stringify(
            strToMatch[strToMatch.length - charsToCheckCount],
            null,
            4
          )}`
        );
        console.log("193 THEREFORE, returning false.");
        return false;
      }
      console.log(
        `197 * charsToCheckCount = ${JSON.stringify(
          charsToCheckCount,
          null,
          4
        )}`
      );
    }
    if (charsToCheckCount > 0) {
      console.log(
        `206 charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`
      );
      console.log("208 THEREFORE, returning false.");
      return false;
    }
  } else if (!opts.relaxedApi) {
    throw new Error(
      `string-match-left-right/marchForward(): [THROW_ID_102] second argument, fromIndexInclusive is ${fromIndexInclusive} beyond the input string length, ${
        str.length
      }.`
    );
  } else {
    return false;
  }
}

// A helper f(). Uses 2xx range error codes.
function marchBackward(str, fromIndexInclusive, strToMatch, opts) {
  console.log(`\n224 \u001b[${35}m${"CALLED marchBackward()"}\u001b[${39}m`);
  console.log(
    `226 ${`\u001b[${33}m${"fromIndexInclusive"}\u001b[${39}m`} = ${JSON.stringify(
      fromIndexInclusive,
      null,
      4
    )}`
  );
  console.log(
    `233 ${`\u001b[${33}m${"strToMatch"}\u001b[${39}m`} = ${JSON.stringify(
      strToMatch,
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
  let charsToCheckCount = strToMatch.length;
  console.log(
    `259 starting charsToCheckCount = ${JSON.stringify(
      charsToCheckCount,
      null,
      4
    )}`
  );

  for (let i = fromIndexInclusive + 1; i--; ) {
    console.log(
      `268 ${`\u001b[${36}m${"=================================="}\u001b[${39}m`} ${i}: >>${
        str[i]
      }<< [${str[i].charCodeAt(0)}]`
    );
    console.log(
      `273 ${i - 1}: >>${str[i - 1]}<< [${
        existy(str[i - 1]) ? str[i - 1].charCodeAt(0) : "undefined"
      }]`
    );
    if (opts.trimBeforeMatching && str[i].trim() === "") {
      console.log("276 trimmed");
      continue;
    }
    let currentCharacter = str[i];
    if (isLowSurrogate(str[i]) && isHighSurrogate(str[i - 1])) {
      currentCharacter = str[i - 1] + str[i];
      console.log(
        `283 ${`\u001b[${33}m${"currentCharacter"}\u001b[${39}m`} = ${JSON.stringify(
          currentCharacter,
          null,
          4
        )}`
      );
    } else if (isHighSurrogate(str[i]) && isLowSurrogate(str[i + 1])) {
      currentCharacter = str[i] + str[i + 1];
    }
    console.log(
      `293 \u001b[${32}m${"currentCharacter"}\u001b[${39}m = ${currentCharacter}`
    );
    console.log(
      `296 ${`\u001b[${33}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`} = ${JSON.stringify(
        opts.trimCharsBeforeMatching,
        null,
        4
      )}`
    );
    console.log(
      `303 ${`\u001b[${33}m${"opts.trimCharsBeforeMatching.includes(currentCharacter)"}\u001b[${39}m`} = ${JSON.stringify(
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
      console.log("316 char is in the skip list");
      if (currentCharacter.length === 2) {
        // if it was emoji, offset by two
        i -= 1;
      }
      continue;
    }
    console.log(
      `324 ${`\u001b[${33}m${"charsToCheckCount"}\u001b[${39}m`} = ${JSON.stringify(
        charsToCheckCount,
        null,
        4
      )}`
    );
    console.log(`330 ${strToMatch[charsToCheckCount - 1]}`);
    console.log(
      `332 ${strToMatch[charsToCheckCount - 2]}${
        strToMatch[charsToCheckCount - 1]
      }`
    );

    let charToCompareAgainst = strToMatch[charsToCheckCount - 1];
    if (isLowSurrogate(charToCompareAgainst)) {
      // this means current strToMatch ends with emoji
      charToCompareAgainst = `${strToMatch[charsToCheckCount - 2]}${
        strToMatch[charsToCheckCount - 1]
      }`;
      console.log(
        `344 ${`\u001b[${33}m${"charToCompareAgainst"}\u001b[${39}m`} = ${JSON.stringify(
          charToCompareAgainst,
          null,
          4
        )}`
      );
      charsToCheckCount -= 1;
      i -= 1;
    }

    console.log(
      `\n* 355 \u001b[${31}m${"currentCharacter"}\u001b[${39}m = ${currentCharacter}`
    );
    console.log(
      `* 358 \u001b[${31}m${"charToCompareAgainst"}\u001b[${39}m = ${charToCompareAgainst}`
    );
    if (
      (!opts.i && currentCharacter === charToCompareAgainst) ||
      (opts.i &&
        currentCharacter.toLowerCase() === charToCompareAgainst.toLowerCase())
    ) {
      charsToCheckCount -= 1;
      if (charsToCheckCount < 1) {
        console.log(
          `368 all chars matched so returning i = ${i}; charsToCheckCount = ${charsToCheckCount}`
        );
        return i >= 0 ? i : 0;
      }

      console.log(
        `374 ${`\u001b[${32}m${`OK. Reduced charsToCheckCount to ${charsToCheckCount}`}\u001b[${39}m`}`
      );
    } else {
      console.log(`377 str[i = ${i}] = ${JSON.stringify(str[i], null, 4)}`);
      console.log(
        `379 strToMatch[strToMatch.length - charsToCheckCount = ${strToMatch.length -
          charsToCheckCount}] = ${JSON.stringify(
          strToMatch[strToMatch.length - charsToCheckCount],
          null,
          4
        )}`
      );
      console.log("386 THEREFORE, returning false.");
      return false;
    }

    console.log(
      `391 * charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`
    );
  }
  if (charsToCheckCount > 0) {
    console.log(
      `396 charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`
    );
    console.log("398 THEREFORE, returning false.");
    return false;
  }
}

// Real deal
function main(mode, str, position, originalWhatToMatch, originalOpts) {
  const defaults = {
    i: false,
    trimBeforeMatching: false,
    trimCharsBeforeMatching: [],
    relaxedApi: false
  };
  const opts = Object.assign({}, defaults, originalOpts);
  opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  checkTypes(opts, defaults, {
    msg: "string-match-left-right: [THROW_ID_07*]",
    schema: {
      cb: ["null", "undefined", "function"]
    }
  });
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(
    el => (isStr(el) ? el : String(el))
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
      `string-match-left-right/${mode}(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ${culpritsIndex} is longer than 1 character, ${
        culpritsVal.length
      } (equals to ${culpritsVal}). Please split it into separate characters and put into array as separate elements.`
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

  if (isStr(originalWhatToMatch)) {
    whatToMatch = [originalWhatToMatch];
  } else if (isArr(originalWhatToMatch)) {
    whatToMatch = originalWhatToMatch;
  } else if (!existy(originalWhatToMatch)) {
    whatToMatch = [""];
  } else {
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof originalWhatToMatch}, equal to:\n${JSON.stringify(
        originalWhatToMatch,
        null,
        4
      )}`
    );
  }

  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof originalOpts}", and equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }

  // action

  // CASE 1. If it's driven by callback-only, the 3rd input argument, what to look
  // for - is falsey - empty string within array (or not), OR given null

  if (
    !existy(whatToMatch) ||
    (isArr(whatToMatch) &&
      existy(whatToMatch[0]) &&
      whatToMatch[0].length === 0)
  ) {
    if (opts.cb) {
      let firstCharOutsideIndex;

      // matchLeft() or matchRightIncl() methods start ar "position"
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
          // if we're on the right side of emoji, low surrogate, skip to next iteration
          if (
            isLowSurrogate(str[y]) &&
            isHighSurrogate(str[y - 1]) // function will accept undefined if it happens
          ) {
            continue;
          }
          // assemble the value of the current character
          let currentChar = str[y];
          if (isHighSurrogate(str[y]) && isLowSurrogate(str[y + 1])) {
            currentChar = str[y] + str[y + 1];
          }
          // do the actual evaluation, is the current character non-whitespace/non-skiped
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
          // if there's emoji on the left, skip its low surrogate, jump left by two indexes
          if (isLowSurrogate(str[y - 1]) && isHighSurrogate(str[y - 2])) {
            y -= 1;
          }
        }
      } else if (mode.startsWith("matchRight")) {
        for (let y = startingPosition; y < str.length; y++) {
          // assemble the value of the current character
          let currentChar = str[y];
          if (isHighSurrogate(str[y]) && isLowSurrogate(str[y + 1])) {
            currentChar = str[y] + str[y + 1];
          }
          console.log(
            `358 ${`\u001b[${33}m${"currentChar"}\u001b[${39}m`} = ${JSON.stringify(
              currentChar,
              null,
              4
            )}`
          );
          // do the actual evaluation, is the current character non-whitespace/non-skiped
          if (
            (!opts.trimBeforeMatching ||
              (opts.trimBeforeMatching && currentChar.trim() !== "")) &&
            (opts.trimCharsBeforeMatching.length === 0 ||
              !opts.trimCharsBeforeMatching.includes(currentChar))
          ) {
            console.log("573 breaking!");
            firstCharOutsideIndex = y;
            break;
          }
          // if it's high surrogate, and we reached this far, and low surrogate
          // follows, skipt that low surrogate
          if (isHighSurrogate(str[y]) && isLowSurrogate(str[y + 1])) {
            y += 1;
          }
        }
      }
      if (firstCharOutsideIndex === undefined) {
        console.log("585 returning false");
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
      if (mode.startsWith("matchLeft")) {
        return opts.cb(
          wholeCharacterOutside,
          str.slice(0, indexOfTheCharacterAfter),
          firstCharOutsideIndex
        );
      }
      // ELSE matchRight & matchRightIncl
      return opts.cb(
        wholeCharacterOutside,
        str.slice(firstCharOutsideIndex),
        firstCharOutsideIndex
      );
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

  // Case 2. Normal operation where callback may or may not be present, but it is
  // only accompanying the matching of what was given in 3rd input argument.
  // Then if 3rd arg's contents were matched, callback is checked and its Boolean
  // result is merged using logical "AND" - meaning both have to be true to yield
  // final result "true".

  if (mode.startsWith("matchLeft")) {
    for (let i = 0, len = whatToMatch.length; i < len; i++) {
      console.log(
        "\n\n\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
      );
      console.log(`whatToMatch no. ${i} = ${whatToMatch[i]}`);
      console.log(
        "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
      );
      let startingPosition = position;
      if (mode === "matchLeft") {
        // Depends if the current character is surrogate.
        // Imagine, you've got blue hat emoji: \uD83E\uDDE2 to the left of your
        // current character at current index. In order to "jump left by one character"
        // you have to subtract the index by two, not by one.
        //
        if (
          // if preceding two characters exist and make a surrogate pair
          isAstral(str[i - 1]) &&
          isAstral(str[i - 2])
        ) {
          startingPosition -= 2;
        } else {
          startingPosition -= 1;
        }
      }
      console.log(
        `670 \u001b[${33}m${"marchBackward() called with:"}\u001b[${39}m\n* startingPosition = ${JSON.stringify(
          startingPosition,
          null,
          4
        )}\n* whatToMatch[${i}] = ${JSON.stringify(whatToMatch[i], null, 4)}\n`
      );
      const found = marchBackward(str, startingPosition, whatToMatch[i], opts);
      console.log(
        `678 \u001b[${33}m${"found"}\u001b[${39}m = ${JSON.stringify(
          found,
          null,
          4
        )}`
      );
      // now, the "found" is the index of the first character of what was found.
      // we need to calculate the character to the left of it, which might be emoji
      // so its first character might be either "minus one index" (normal character)
      // or "minus two indexes" (emoji). Let's calculate that:

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
        console.log("703 the character in front is low surrogate");
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
          "721 adding low surrogate to str[indexOfTheCharacterInFront]"
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

      if (indexOfTheCharacterInFront < 0) {
        indexOfTheCharacterInFront = undefined;
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
        return whatToMatch[i];
      }
    }
    return false;
  }
  // ELSE - matchRight & matchRightIncl
  for (let i = 0, len = whatToMatch.length; i < len; i++) {
    console.log(
      "\n\n\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
    );
    console.log(`whatToMatch no. ${i} = ${whatToMatch[i]}`);
    console.log(
      "🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥"
    );

    let startingPosition = position + (mode === "matchRight" ? 1 : 0);
    // compensate for emoji, since if currently we've sat upon emoji,
    // we need to add not one but two to reference the "character on the right"
    console.log(
      `768 \u001b[${32}m${"startingPosition"}\u001b[${39}m = ${startingPosition}`
    );
    if (
      mode === "matchRight" &&
      (isHighSurrogate(str[startingPosition - 1]) &&
        isLowSurrogate(str[startingPosition]))
    ) {
      startingPosition += 1;
      console.log(
        `777 +1: \u001b[${32}m${"startingPosition"}\u001b[${39}m = ${startingPosition}`
      );
    }

    const found = marchForward(str, startingPosition, whatToMatch[i], opts);
    console.log(
      `783 ${`\u001b[${33}m${"found"}\u001b[${39}m`} = ${JSON.stringify(
        found,
        null,
        4
      )}`
    );

    let indexOfTheCharacterAfter;
    let fullCharacterAfter;
    if (existy(found) && existy(str[found + whatToMatch[i].length])) {
      indexOfTheCharacterAfter = found + whatToMatch[i].length;
      fullCharacterAfter = str[indexOfTheCharacterAfter];

      // fixes for emoji:
      // if the next character is high surrogate, add its counterpart
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
      `815 ${`\u001b[${33}m${"indexOfTheCharacterAfter"}\u001b[${39}m`} = ${JSON.stringify(
        indexOfTheCharacterAfter,
        null,
        4
      )}\n`
    );

    if (
      found !== false &&
      (opts.cb
        ? opts.cb(
            fullCharacterAfter,
            existy(indexOfTheCharacterAfter)
              ? str.slice(indexOfTheCharacterAfter)
              : "",
            indexOfTheCharacterAfter
          )
        : true)
    ) {
      return whatToMatch[i];
    }
  }
  return false;
}

// External API functions

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

export { matchLeftIncl, matchRightIncl, matchLeft, matchRight };
