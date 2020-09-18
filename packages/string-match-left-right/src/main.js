/* eslint no-plusplus:0 */

import arrayiffy from "arrayiffy-if-string";

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function isStr(something) {
  return typeof something === "string";
}

// eslint-disable-next-line consistent-return
function march(
  str,
  fromIndexInclusive,
  whatToMatchVal,
  opts,
  special,
  getNextIdx
) {
  console.log(`023 \u001b[${35}m${"CALLED march()"}\u001b[${39}m`);
  console.log(
    `======\nargs:
${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${str}
${`\u001b[${33}m${`fromIndexInclusive`}\u001b[${39}m`} = ${fromIndexInclusive}
${`\u001b[${33}m${`whatToMatchVal`}\u001b[${39}m`} = ${whatToMatchVal}
${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(opts, null, 4)}
${`\u001b[${33}m${`special`}\u001b[${39}m`} = ${special}
======`
  );

  const whatToMatchValVal =
    typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal;

  // early ending case if matching EOL being at 0-th index:
  if (fromIndexInclusive < 0 && special && whatToMatchValVal === "EOL") {
    console.log("039 EARLY ENDING, return true");
    return whatToMatchValVal;
  }

  console.log(
    `044 ${`\u001b[${33}m${"fromIndexInclusive"}\u001b[${39}m`} = ${JSON.stringify(
      fromIndexInclusive,
      null,
      4
    )}`
  );

  if (fromIndexInclusive >= str.length && !special) {
    console.log(
      `053 starting index is beyond the string length so RETURN FALSE`
    );
    return false;
  }
  let charsToCheckCount = special ? 1 : whatToMatchVal.length;
  console.log(`058 starting charsToCheckCount = ${charsToCheckCount}`);

  let lastWasMismatched = false; // value is "false" or index of where it was activated

  // if no character was ever matched, even through if opts.maxMismatches
  // would otherwise allow to skip characters, this will act as a last
  // insurance - at least one character must have been matched to yield a
  // positive result!
  let atLeastSomethingWasMatched = false;

  let patience = opts.maxMismatches;

  let i = fromIndexInclusive;
  console.log(
    `072 FIY, ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${JSON.stringify(
      i,
      null,
      4
    )}`
  );
  console.log(
    `079 FIY, ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
      str,
      null,
      4
    )}`
  );

  let somethingFound = false;

  // these two drive opts.firstMustMatch and opts.lastMustMatch:
  let firstCharacterMatched = false;
  let lastCharacterMatched = false;

  while (str[i]) {
    const nextIdx = getNextIdx(i);

    console.log(
      `096 \u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim() ? str[i] : JSON.stringify(str[i], null, 4)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

    if (opts.trimBeforeMatching && str[i].trim() === "") {
      console.log("102 trimmed");
      if (!str[nextIdx] && special && whatToMatchVal === "EOL") {
        console.log(
          "105 start/end of string reached, matching to EOL, so return true"
        );
        return true;
      }
      i = getNextIdx(i);
      continue;
    }

    console.log(
      `114 ${`\u001b[${33}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`} = ${JSON.stringify(
        opts.trimCharsBeforeMatching,
        null,
        4
      )}`
    );
    console.log(
      `121 ${`\u001b[${33}m${`opts.trimCharsBeforeMatching.includes("${str[i]}")`}\u001b[${39}m`} = ${JSON.stringify(
        opts.trimCharsBeforeMatching.includes(str[i]),
        null,
        4
      )}`
    );

    if (
      (!opts.i && opts.trimCharsBeforeMatching.includes(str[i])) ||
      (opts.i &&
        opts.trimCharsBeforeMatching
          .map((val) => val.toLowerCase())
          .includes(str[i].toLowerCase()))
    ) {
      console.log("135 char is in the skip list");
      if (special && whatToMatchVal === "EOL" && !str[nextIdx]) {
        // return true because we reached the zero'th index, exactly what we're looking for
        console.log(
          "139 RETURN true because it's EOL next, exactly what we're looking for"
        );
        return true;
      }
      i = getNextIdx(i);
      continue;
    }
    console.log(
      `147 ${`\u001b[${33}m${"charsToCheckCount"}\u001b[${39}m`} = ${JSON.stringify(
        charsToCheckCount,
        null,
        4
      )}`
    );
    console.log(
      `154 whatToMatchVal[charsToCheckCount - 1] = whatToMatchVal[${
        charsToCheckCount - 1
      }] = ${whatToMatchVal[charsToCheckCount - 1]}`
    );
    console.log(
      `159 whatToMatchVal[charsToCheckCount - 2]whatToMatchVal[charsToCheckCount - 1] = whatToMatchVal[${
        charsToCheckCount - 2
      }]whatToMatchVal[${charsToCheckCount - 1}] = ${
        whatToMatchVal[charsToCheckCount - 2]
      }${whatToMatchVal[charsToCheckCount - 1]}`
    );

    const charToCompareAgainst =
      nextIdx > i
        ? whatToMatchVal[whatToMatchVal.length - charsToCheckCount]
        : whatToMatchVal[charsToCheckCount - 1];

    console.log(" ");
    console.log(`172 \u001b[${35}m${"██ str[i]"}\u001b[${39}m = ${str[i]}`);
    console.log(
      `174 \u001b[${35}m${"██ charToCompareAgainst"}\u001b[${39}m = ${charToCompareAgainst}`
    );

    // let's match
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
      // if this was the first character from the "to-match" list, flip the flag
      if (charsToCheckCount === whatToMatchVal.length) {
        firstCharacterMatched = true;
        console.log(
          `193 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} firstCharacterMatched = true`
        );
      } else if (charsToCheckCount === 1) {
        lastCharacterMatched = true;
        console.log(
          `198 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} lastCharacterMatched = true`
        );
      }

      console.log(" ");
      console.log(`203 ${`\u001b[${32}m${`MATCHED!`}\u001b[${39}m`}`);
      console.log(" ");
      charsToCheckCount -= 1;
      console.log(
        `207 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`charsToCheckCount`}\u001b[${39}m`} = ${JSON.stringify(
          charsToCheckCount,
          null,
          4
        )}`
      );

      if (charsToCheckCount < 1) {
        console.log(
          `216 all chars matched, ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} i: ${i}; charsToCheckCount = ${charsToCheckCount}`
        );
        return i;
      }

      console.log(
        `222 ${`\u001b[${32}m${`${`\u001b[${32}m${`OK.`}\u001b[${39}m`} Reduced charsToCheckCount to ${charsToCheckCount}`}\u001b[${39}m`}`
      );
    } else {
      console.log(" ");
      console.log(`226 ${`\u001b[${31}m${`DID'T MATCH!`}\u001b[${39}m`}`);
      console.log(" ");
      console.log(`228 str[i = ${i}] = ${JSON.stringify(str[i], null, 4)}`);
      console.log(
        `230 whatToMatchVal[whatToMatchVal.length - charsToCheckCount = ${
          whatToMatchVal.length - charsToCheckCount
        }] = ${JSON.stringify(
          whatToMatchVal[whatToMatchVal.length - charsToCheckCount],
          null,
          4
        )}`
      );

      if (opts.maxMismatches && patience && i) {
        patience -= 1;
        console.log(
          `242 ${`\u001b[${31}m${`DECREASE`}\u001b[${39}m`} patience to ${patience}`
        );

        // the bigger the maxMismatches, the further away we must check for
        // alternative matches
        for (let y = 0; y <= patience; y++) {
          console.log(
            `249 █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ current mismatch limit = ${y}`
          );

          // maybe str[i] will match against next charToCompareAgainst?
          const nextCharToCompareAgainst =
            nextIdx > i
              ? whatToMatchVal[
                  whatToMatchVal.length - charsToCheckCount + 1 + y
                ]
              : whatToMatchVal[charsToCheckCount - 2 - y];

          console.log(" ");
          console.log(
            `██ ${`\u001b[${33}m${`whatToMatchVal.length`}\u001b[${39}m`} = ${JSON.stringify(
              whatToMatchVal.length,
              null,
              4
            )}`
          );
          console.log(
            `██ ${`\u001b[${33}m${`charsToCheckCount`}\u001b[${39}m`} = ${JSON.stringify(
              charsToCheckCount,
              null,
              4
            )}`
          );
          console.log(
            `276 ${`\u001b[${35}m${`██ MAYBE NEXT CHAR WILL MATCH?`}\u001b[${39}m`}`
          );
          console.log(
            `279 \u001b[${35}m${"██ str[i]"}\u001b[${39}m = ${str[i]}`
          );
          console.log(
            `282 \u001b[${35}m${"██ nextCharToCompareAgainst"}\u001b[${39}m = ${nextCharToCompareAgainst}`
          );
          console.log(" ");

          const nextCharInSource = str[getNextIdx(i)];

          console.log(
            `289 ${`\u001b[${35}m${`██ OR MAYBE CURRENT CHAR CAN BE SKIPPED?`}\u001b[${39}m`}`
          );
          console.log(
            `292 \u001b[${35}m${"██ nextCharInSource"}\u001b[${39}m = ${nextCharInSource}`
          );
          console.log(
            `295 \u001b[${35}m${"██ nextCharToCompareAgainst"}\u001b[${39}m = ${nextCharToCompareAgainst}`
          );
          console.log(" ");

          if (
            nextCharToCompareAgainst &&
            ((!opts.i && str[i] === nextCharToCompareAgainst) ||
              (opts.i &&
                str[i].toLowerCase() ===
                  nextCharToCompareAgainst.toLowerCase())) &&
            // ensure we're not skipping the first enforced character:
            (!opts.firstMustMatch ||
              charsToCheckCount !== whatToMatchVal.length)
          ) {
            console.log(" ");
            console.log(`310 ${`\u001b[${32}m${`MATCHED!`}\u001b[${39}m`}`);
            console.log(" ");
            charsToCheckCount -= 2;
            console.log(
              `314 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`charsToCheckCount`}\u001b[${39}m`} = ${JSON.stringify(
                charsToCheckCount,
                null,
                4
              )}`
            );

            somethingFound = true;
            break;
          } else if (
            nextCharInSource &&
            nextCharToCompareAgainst &&
            ((!opts.i && nextCharInSource === nextCharToCompareAgainst) ||
              (opts.i &&
                nextCharInSource.toLowerCase() ===
                  nextCharToCompareAgainst.toLowerCase())) &&
            // ensure we're not skipping the first enforced character:
            (!opts.firstMustMatch ||
              charsToCheckCount !== whatToMatchVal.length)
          ) {
            console.log(" ");
            console.log(`335 ${`\u001b[${32}m${`MATCHED!`}\u001b[${39}m`}`);
            console.log(" ");
            charsToCheckCount -= 1;
            console.log(
              `339 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`charsToCheckCount`}\u001b[${39}m`} = ${JSON.stringify(
                charsToCheckCount,
                null,
                4
              )}`
            );

            somethingFound = true;
            break;
          } else if (
            nextCharToCompareAgainst === undefined &&
            patience >= 0 &&
            somethingFound &&
            (!opts.firstMustMatch || firstCharacterMatched) &&
            (!opts.lastMustMatch || lastCharacterMatched)
          ) {
            // If "nextCharToCompareAgainst" is undefined, this
            // means there are no more characters left to match,
            // this is the last character to be matched.
            // This means, if patience >= 0, this is it,
            // the match is still positive.
            console.log(
              `361 ${`\u001b[${32}m${`STILL MATCHED DESPITE MISMATCH`}\u001b[${39}m`}, RETURN "${i}"`
            );
            return i;
          }

          // ███████████████████████████████████████
        }
        console.log(`368 █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ `);

        if (!somethingFound) {
          // if the character was rogue, we mark it:
          lastWasMismatched = i;
          console.log(
            `374 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastWasMismatched`}\u001b[${39}m`} = ${lastWasMismatched}`
          );
          // patience--;
          // console.log(
          //   `350 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`patience`}\u001b[${39}m`} = ${patience}`
          // );
        }
      } else if (
        i === 0 &&
        charsToCheckCount === 1 &&
        !opts.lastMustMatch &&
        atLeastSomethingWasMatched
      ) {
        console.log(`387 LAST CHARACTER. RETURN 0.`);
        return 0;
      } else {
        console.log(`390 ${`\u001b[${31}m${`RETURN false.`}\u001b[${39}m`}`);
        return false;
      }
    }

    // turn off "lastWasMismatched" if it's on and it hasn't been activated
    // on this current index:
    if (lastWasMismatched !== false && lastWasMismatched !== i) {
      lastWasMismatched = false;
      console.log(
        `400 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastWasMismatched`}\u001b[${39}m`} = ${lastWasMismatched}`
      );
    }

    // if all was matched, happy days
    if (charsToCheckCount < 1) {
      console.log(
        `407 all chars matched, ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} i: ${i}; charsToCheckCount = ${charsToCheckCount}`
      );
      return i;
    }

    // iterate onto the next index, otherwise while would loop infinitely
    i = getNextIdx(i);

    console.log(
      `${`\u001b[${90}m${`--------------------- ending with: ---------------------`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`charsToCheckCount = ${JSON.stringify(
        charsToCheckCount,
        null,
        4
      )}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`lastWasMismatched = ${JSON.stringify(
        lastWasMismatched,
        null,
        4
      )}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`patience = ${JSON.stringify(
        patience,
        null,
        4
      )}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`atLeastSomethingWasMatched = ${JSON.stringify(
        atLeastSomethingWasMatched,
        null,
        4
      )}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`firstCharacterMatched = ${JSON.stringify(
        firstCharacterMatched,
        null,
        4
      )}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`lastCharacterMatched = ${JSON.stringify(
        lastCharacterMatched,
        null,
        4
      )}`}\u001b[${39}m`}`
    );
  }

  console.log(`462 AFTER THE WHILE LOOP`);

  if (charsToCheckCount > 0) {
    if (special && whatToMatchValVal === "EOL") {
      console.log(
        `467 charsToCheckCount = ${charsToCheckCount};\nwent past the beginning of the string and EOL was queried to ${`\u001b[${32}m${`return TRUE`}\u001b[${39}m`}`
      );
      return true;
    }
    if (opts.maxMismatches >= charsToCheckCount && atLeastSomethingWasMatched) {
      console.log(`472 RETURN ${lastWasMismatched || 0}`);
      return lastWasMismatched || 0;
    }
    console.log(
      `476 ${`\u001b[${31}m${`charsToCheckCount = ${charsToCheckCount} THEREFORE, returning FALSE`}\u001b[${39}m`}`
    );
    return false;
  }
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// Real deal

function main(mode, str, position, originalWhatToMatch, originalOpts) {
  const defaults = {
    cb: undefined,
    i: false,
    trimBeforeMatching: false,
    trimCharsBeforeMatching: [],
    maxMismatches: 0,
    firstMustMatch: false,
    lastMustMatch: false,
  };

  // insurance
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

  const opts = { ...defaults, ...originalOpts };
  opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map((el) =>
    isStr(el) ? el : String(el)
  );

  if (!isStr(str)) {
    return false;
  }
  if (!str.length) {
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
    console.log("572");
    whatToMatch = [originalWhatToMatch];
  } else if (Array.isArray(originalWhatToMatch)) {
    console.log("575");
    whatToMatch = originalWhatToMatch;
  } else if (!originalWhatToMatch) {
    console.log("578");
    whatToMatch = originalWhatToMatch;
  } else if (typeof originalWhatToMatch === "function") {
    console.log("581");
    whatToMatch = [];
    whatToMatch.push(originalWhatToMatch);
    console.log(
      `585 whatToMatch = ${whatToMatch}; Array.isArray(whatToMatch) = ${Array.isArray(
        whatToMatch
      )}; whatToMatch.length = ${whatToMatch.length}`
    );
  } else {
    console.log("590");
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof originalWhatToMatch}, equal to:\n${JSON.stringify(
        originalWhatToMatch,
        null,
        4
      )}`
    );
  }

  console.log("\n\n");
  console.log(`601 whatToMatch = ${JSON.stringify(whatToMatch, null, 4)}`);

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

  // action

  // CASE 1. If it's driven by callback-only, the 3rd input argument, what to look
  // for - is falsey - empty string within array (or not), OR given null

  if (
    !whatToMatch ||
    !Array.isArray(whatToMatch) || // 0
    (Array.isArray(whatToMatch) && !whatToMatch.length) || // []
    (Array.isArray(whatToMatch) &&
      whatToMatch.length === 1 &&
      isStr(whatToMatch[0]) &&
      !whatToMatch[0].trim()) // [""]
  ) {
    if (typeof opts.cb === "function") {
      console.log("645");
      let firstCharOutsideIndex;

      // matchLeft() or matchRightIncl() methods start at index "position"
      let startingPosition = position;
      if (mode === "matchLeftIncl" || mode === "matchRight") {
        startingPosition += 1;
      }

      if (mode[5] === "L") {
        for (let y = startingPosition; y--; ) {
          // assemble the value of the current character
          const currentChar = str[y];
          // do the actual evaluation, is the current character non-whitespace/non-skiped
          if (
            (!opts.trimBeforeMatching ||
              (opts.trimBeforeMatching &&
                currentChar !== undefined &&
                currentChar.trim())) &&
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
          // assemble the value of the current character
          const currentChar = str[y];
          console.log(
            `677 ${`\u001b[${33}m${"currentChar"}\u001b[${39}m`} = ${JSON.stringify(
              currentChar,
              null,
              4
            )}`
          );
          // do the actual evaluation, is the current character non-whitespace/non-skiped
          if (
            (!opts.trimBeforeMatching ||
              (opts.trimBeforeMatching && currentChar.trim())) &&
            (!opts.trimCharsBeforeMatching.length ||
              !opts.trimCharsBeforeMatching.includes(currentChar))
          ) {
            console.log("690 breaking!");
            firstCharOutsideIndex = y;
            break;
          }
        }
      }
      if (firstCharOutsideIndex === undefined) {
        console.log("697 RETURN false");
        return false;
      }

      const wholeCharacterOutside = str[firstCharOutsideIndex];
      const indexOfTheCharacterAfter = firstCharOutsideIndex + 1;

      let theRemainderOfTheString = "";
      if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
        theRemainderOfTheString = str.slice(0, indexOfTheCharacterAfter);
      }
      if (mode[5] === "L") {
        console.log(`709 ${`\u001b[${32}m${`CALL THE CB()`}\u001b[${39}m`}`);
        return opts.cb(
          wholeCharacterOutside,
          theRemainderOfTheString,
          firstCharOutsideIndex
        );
      }
      // ELSE matchRight & matchRightIncl

      if (firstCharOutsideIndex && firstCharOutsideIndex > 0) {
        theRemainderOfTheString = str.slice(firstCharOutsideIndex);
      }
      console.log(`721 ${`\u001b[${32}m${`CALL THE CB()`}\u001b[${39}m`}`);
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

  // Case 2. Normal operation where callback may or may not be present, but it is
  // only accompanying the matching of what was given in 3rd input argument.
  // Then if 3rd arg's contents were matched, callback is checked and its Boolean
  // result is merged using logical "AND" - meaning both have to be true to yield
  // final result "true".

  for (let i = 0, len = whatToMatch.length; i < len; i++) {
    console.log(
      `\n760 matchLeft() LOOP ${i} ${`\u001b[${32}m${`=================================================================================`}\u001b[${39}m`} \n\n`
    );

    special = typeof whatToMatch[i] === "function";
    console.log(`750 special = ${special}`);

    console.log(
      `753 🔥 whatToMatch no. ${i} = ${
        whatToMatch[i]
      } (type ${typeof whatToMatch[i]})`
    );
    console.log(`757 🔥 special = ${special}`);

    // since input can be function, we need to grab the value explicitly:
    const whatToMatchVal = whatToMatch[i];

    let fullCharacterInFront;
    let indexOfTheCharacterInFront;
    let restOfStringInFront = "";

    let startingPosition = position;
    if (mode === "matchRight") {
      startingPosition += 1;
    } else if (mode === "matchLeft") {
      startingPosition -= 1;
    }

    console.log(
      `774 \u001b[${33}m${"march() called with:"}\u001b[${39}m\n* startingPosition = ${JSON.stringify(
        startingPosition,
        null,
        4
      )}\n* whatToMatchVal = "${whatToMatchVal}"\n`
    );
    console.log("\n\n\n\n\n\n");
    console.log(
      `782 ███████████████████████████████████████ march() STARTS BELOW ███████████████████████████████████████`
    );
    const found = march(
      str,
      startingPosition,
      whatToMatchVal,
      opts,
      special,
      (i2) => (mode[5] === "L" ? i2 - 1 : i2 + 1)
    );
    console.log(
      `793 ███████████████████████████████████████ march() ENDED ABOVE ███████████████████████████████████████\n\n\n\n\n\n`
    );
    console.log(
      `796 \u001b[${33}m${"found"}\u001b[${39}m = ${JSON.stringify(
        found,
        null,
        4
      )}`
    );

    // if march() returned positive result and it was "special" case,
    // Bob's your uncle, here's the result:
    if (
      found &&
      special &&
      typeof whatToMatchVal === "function" &&
      whatToMatchVal() === "EOL"
    ) {
      console.log(`811 returning whatToMatchVal() = ${whatToMatchVal()}`);
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

    // now, the "found" is the index of the first character of what was found.
    // we need to calculate the character to the left/right of it:

    if (Number.isInteger(found)) {
      indexOfTheCharacterInFront = mode.startsWith("matchLeft")
        ? found - 1
        : found + 1;

      //
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

    console.log(
      `849 FINAL ${`\u001b[${33}m${`indexOfTheCharacterInFront`}\u001b[${39}m`} = ${JSON.stringify(
        indexOfTheCharacterInFront,
        null,
        4
      )}
        ${`\u001b[${33}m${`fullCharacterInFront`}\u001b[${39}m`} = ${JSON.stringify(
        fullCharacterInFront,
        null,
        4
      )}
        ${`\u001b[${33}m${`restOfStringInFront`}\u001b[${39}m`} = ${JSON.stringify(
        restOfStringInFront,
        null,
        4
      )}`
    );

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
      console.log(
        `877 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${`\u001b[${33}m${`whatToMatchVal`}\u001b[${39}m`} = ${JSON.stringify(
          whatToMatchVal,
          null,
          4
        )}`
      );
      return whatToMatchVal;
    }
  }
  console.log(`886 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} false`);
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
