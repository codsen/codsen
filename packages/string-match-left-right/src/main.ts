/* eslint no-plusplus:0 */

import { arrayiffy } from "arrayiffy-if-string";

interface Obj {
  [key: string]: any;
}

function isObj(something: any): boolean {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function isStr(something: any): boolean {
  return typeof something === "string";
}

interface Opts {
  cb:
    | undefined
    | null
    | ((
        wholeCharacterOutside?: string | undefined,
        theRemainderOfTheString?: string,
        firstCharOutsideIndex?: number
      ) => string | boolean);
  i: boolean;
  trimBeforeMatching: boolean;
  trimCharsBeforeMatching: string | string[];
  maxMismatches: number;
  firstMustMatch: boolean;
  lastMustMatch: boolean;
}
const defaults: Opts = {
  cb: undefined,
  i: false,
  trimBeforeMatching: false,
  trimCharsBeforeMatching: [],
  maxMismatches: 0,
  firstMustMatch: false,
  lastMustMatch: false,
};

const defaultGetNextIdx = (index: number) => index + 1;

// eslint-disable-next-line consistent-return
function march(
  str: string,
  position: number,
  whatToMatchVal: (() => string) | string,
  originalOpts?: Partial<Opts>,
  special = false,
  getNextIdx = defaultGetNextIdx
) {
  console.log(`055 \u001b[${35}m${"CALLED march()"}\u001b[${39}m`);
  console.log(
    `======\nargs:
${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${str}
${`\u001b[${33}m${`position`}\u001b[${39}m`} = ${position}
${`\u001b[${33}m${`whatToMatchVal`}\u001b[${39}m`} = ${whatToMatchVal}
${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} = ${JSON.stringify(
      originalOpts,
      null,
      4
    )}
${`\u001b[${33}m${`special`}\u001b[${39}m`} = ${special}
======`
  );

  const whatToMatchValVal =
    typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal;

  // early ending case if matching EOL being at 0-th index:
  if (+position < 0 && special && whatToMatchValVal === "EOL") {
    console.log("075 EARLY ENDING, return true");
    return whatToMatchValVal;
  }

  const opts: Opts = { ...defaults, ...originalOpts };

  console.log(
    `082 ${`\u001b[${33}m${"position"}\u001b[${39}m`} = ${JSON.stringify(
      position,
      null,
      4
    )}`
  );

  if (position >= str.length && !special) {
    console.log(
      `091 starting index is beyond the string length so RETURN FALSE`
    );
    return false;
  }
  let charsToCheckCount = special ? 1 : whatToMatchVal.length;
  console.log(`096 starting charsToCheckCount = ${charsToCheckCount}`);

  let lastWasMismatched: false | number = false; // value is "false" or index of where it was activated

  // if no character was ever matched, even through if opts.maxMismatches
  // would otherwise allow to skip characters, this will act as a last
  // insurance - at least one character must have been matched to yield a
  // positive result!
  let atLeastSomethingWasMatched = false;

  let patience = opts.maxMismatches;

  let i = position;
  console.log(
    `110 FIY, ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${JSON.stringify(
      i,
      null,
      4
    )}`
  );
  console.log(
    `117 FIY, ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
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
      `134 \u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim() ? str[i] : JSON.stringify(str[i], null, 4)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

    if (opts.trimBeforeMatching && str[i].trim() === "") {
      console.log("140 trimmed");
      if (!str[nextIdx] && special && whatToMatchVal === "EOL") {
        console.log(
          "143 start/end of string reached, matching to EOL, so return true"
        );
        return true;
      }
      i = getNextIdx(i);
      continue;
    }

    console.log(
      `152 ${`\u001b[${33}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`} = ${JSON.stringify(
        opts.trimCharsBeforeMatching,
        null,
        4
      )}`
    );
    console.log(
      `159 ${`\u001b[${33}m${`opts.trimCharsBeforeMatching.includes("${str[i]}")`}\u001b[${39}m`} = ${JSON.stringify(
        (opts as Obj).trimCharsBeforeMatching.includes(str[i]),
        null,
        4
      )}`
    );

    if (
      (opts &&
        !opts.i &&
        opts.trimCharsBeforeMatching &&
        opts.trimCharsBeforeMatching.includes(str[i])) ||
      (opts &&
        opts.i &&
        opts.trimCharsBeforeMatching &&
        (opts.trimCharsBeforeMatching as string[])
          .map((val) => val.toLowerCase())
          .includes(str[i].toLowerCase()))
    ) {
      console.log("178 char is in the skip list");
      if (special && whatToMatchVal === "EOL" && !str[nextIdx]) {
        // return true because we reached the zero'th index, exactly what we're looking for
        console.log(
          "182 RETURN true because it's EOL next, exactly what we're looking for"
        );
        return true;
      }
      i = getNextIdx(i);
      continue;
    }
    console.log(
      `190 ${`\u001b[${33}m${"charsToCheckCount"}\u001b[${39}m`} = ${JSON.stringify(
        charsToCheckCount,
        null,
        4
      )}`
    );
    console.log(
      `197 whatToMatchVal[charsToCheckCount - 1] = whatToMatchVal[${
        charsToCheckCount - 1
      }] = ${(whatToMatchVal as string)[charsToCheckCount - 1]}`
    );
    console.log(
      `202 whatToMatchVal[charsToCheckCount - 2]whatToMatchVal[charsToCheckCount - 1] = whatToMatchVal[${
        charsToCheckCount - 2
      }]whatToMatchVal[${charsToCheckCount - 1}] = ${
        (whatToMatchVal as string)[charsToCheckCount - 2]
      }${(whatToMatchVal as string)[charsToCheckCount - 1]}`
    );

    const charToCompareAgainst =
      nextIdx > i
        ? (whatToMatchVal as string)[whatToMatchVal.length - charsToCheckCount]
        : (whatToMatchVal as string)[charsToCheckCount - 1];

    console.log(" ");
    console.log(`215 \u001b[${35}m${"██ str[i]"}\u001b[${39}m = ${str[i]}`);
    console.log(
      `217 \u001b[${35}m${"██ charToCompareAgainst"}\u001b[${39}m = ${charToCompareAgainst}`
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
          `236 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} firstCharacterMatched = true`
        );
      } else if (charsToCheckCount === 1) {
        lastCharacterMatched = true;
        console.log(
          `241 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} lastCharacterMatched = true`
        );
      }

      console.log(" ");
      console.log(`246 ${`\u001b[${32}m${`MATCHED!`}\u001b[${39}m`}`);
      console.log(" ");
      charsToCheckCount -= 1;
      console.log(
        `250 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`charsToCheckCount`}\u001b[${39}m`} = ${JSON.stringify(
          charsToCheckCount,
          null,
          4
        )}`
      );

      if (charsToCheckCount < 1) {
        console.log(
          `259 all chars matched, ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} i: ${i}; charsToCheckCount = ${charsToCheckCount}`
        );
        return i;
      }

      console.log(
        `265 ${`\u001b[${32}m${`${`\u001b[${32}m${`OK.`}\u001b[${39}m`} Reduced charsToCheckCount to ${charsToCheckCount}`}\u001b[${39}m`}`
      );
    } else {
      console.log(" ");
      console.log(`269 ${`\u001b[${31}m${`DID'T MATCH!`}\u001b[${39}m`}`);
      console.log(" ");
      console.log(`271 str[i = ${i}] = ${JSON.stringify(str[i], null, 4)}`);
      console.log(
        `273 whatToMatchVal[whatToMatchVal.length - charsToCheckCount = ${
          whatToMatchVal.length - charsToCheckCount
        }] = ${JSON.stringify(
          (whatToMatchVal as string)[whatToMatchVal.length - charsToCheckCount],
          null,
          4
        )}`
      );

      if (opts.maxMismatches && patience && i) {
        patience -= 1;
        console.log(
          `285 ${`\u001b[${31}m${`DECREASE`}\u001b[${39}m`} patience to ${patience}`
        );

        // the bigger the maxMismatches, the further away we must check for
        // alternative matches
        for (let y = 0; y <= patience; y++) {
          console.log(
            `292 █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ current mismatch limit = ${y}`
          );

          // maybe str[i] will match against next charToCompareAgainst?
          const nextCharToCompareAgainst =
            nextIdx > i
              ? (whatToMatchVal as string)[
                  whatToMatchVal.length - charsToCheckCount + 1 + y
                ]
              : (whatToMatchVal as string)[charsToCheckCount - 2 - y];

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
            `319 ${`\u001b[${35}m${`██ MAYBE NEXT CHAR WILL MATCH?`}\u001b[${39}m`}`
          );
          console.log(
            `322 \u001b[${35}m${"██ str[i]"}\u001b[${39}m = ${str[i]}`
          );
          console.log(
            `325 \u001b[${35}m${"██ nextCharToCompareAgainst"}\u001b[${39}m = ${nextCharToCompareAgainst}`
          );
          console.log(" ");

          const nextCharInSource = str[getNextIdx(i)];

          console.log(
            `332 ${`\u001b[${35}m${`██ OR MAYBE CURRENT CHAR CAN BE SKIPPED?`}\u001b[${39}m`}`
          );
          console.log(
            `335 \u001b[${35}m${"██ nextCharInSource"}\u001b[${39}m = ${nextCharInSource}`
          );
          console.log(
            `338 \u001b[${35}m${"██ nextCharToCompareAgainst"}\u001b[${39}m = ${nextCharToCompareAgainst}`
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
            console.log(`353 ${`\u001b[${32}m${`MATCHED!`}\u001b[${39}m`}`);
            console.log(" ");
            charsToCheckCount -= 2;
            console.log(
              `357 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`charsToCheckCount`}\u001b[${39}m`} = ${JSON.stringify(
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
            console.log(`378 ${`\u001b[${32}m${`MATCHED!`}\u001b[${39}m`}`);
            console.log(" ");
            charsToCheckCount -= 1;
            console.log(
              `382 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`charsToCheckCount`}\u001b[${39}m`} = ${JSON.stringify(
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
              `404 ${`\u001b[${32}m${`STILL MATCHED DESPITE MISMATCH`}\u001b[${39}m`}, RETURN "${i}"`
            );
            return i;
          }

          // ███████████████████████████████████████
        }
        console.log(`411 █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ `);

        if (!somethingFound) {
          // if the character was rogue, we mark it:
          lastWasMismatched = i;
          console.log(
            `417 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastWasMismatched`}\u001b[${39}m`} = ${lastWasMismatched}`
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
        console.log(`430 LAST CHARACTER. RETURN 0.`);
        return 0;
      } else {
        console.log(`433 ${`\u001b[${31}m${`RETURN false.`}\u001b[${39}m`}`);
        return false;
      }
    }

    // turn off "lastWasMismatched" if it's on and it hasn't been activated
    // on this current index:
    if (lastWasMismatched !== false && lastWasMismatched !== i) {
      lastWasMismatched = false;
      console.log(
        `443 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastWasMismatched`}\u001b[${39}m`} = ${lastWasMismatched}`
      );
    }

    // if all was matched, happy days
    if (charsToCheckCount < 1) {
      console.log(
        `450 all chars matched, ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} i: ${i}; charsToCheckCount = ${charsToCheckCount}`
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

  console.log(`505 AFTER THE WHILE LOOP`);

  if (charsToCheckCount > 0) {
    if (special && whatToMatchValVal === "EOL") {
      console.log(
        `510 charsToCheckCount = ${charsToCheckCount};\nwent past the beginning of the string and EOL was queried to ${`\u001b[${32}m${`return TRUE`}\u001b[${39}m`}`
      );
      return true;
    }
    if (
      opts &&
      (opts as Obj).maxMismatches >= charsToCheckCount &&
      atLeastSomethingWasMatched
    ) {
      console.log(`519 RETURN ${lastWasMismatched || 0}`);
      return lastWasMismatched || 0;
    }
    console.log(
      `523 ${`\u001b[${31}m${`charsToCheckCount = ${charsToCheckCount} THEREFORE, returning FALSE`}\u001b[${39}m`}`
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

function main(
  mode: "matchLeftIncl" | "matchLeft" | "matchRightIncl" | "matchRight",
  str: string,
  position: number,
  originalWhatToMatch: (() => string) | string | string[],
  originalOpts?: Partial<Opts>
): boolean | string {
  // insurance
  if (
    isObj(originalOpts) &&
    Object.prototype.hasOwnProperty.call(originalOpts, "trimBeforeMatching") &&
    typeof (originalOpts as Obj).trimBeforeMatching !== "boolean"
  ) {
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_09] opts.trimBeforeMatching should be boolean!${
        Array.isArray((originalOpts as Obj).trimBeforeMatching)
          ? ` Did you mean to use opts.trimCharsBeforeMatching?`
          : ""
      }`
    );
  }

  const opts: Opts = { ...defaults, ...originalOpts };
  if (typeof opts.trimCharsBeforeMatching === "string") {
    // arrayiffy if needed:
    opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  }
  // stringify all:
  opts.trimCharsBeforeMatching = (opts as Obj).trimCharsBeforeMatching.map(
    (el: any) => (isStr(el) ? el : String(el))
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
    console.log("619");
    whatToMatch = [originalWhatToMatch];
  } else if (Array.isArray(originalWhatToMatch)) {
    console.log("622");
    whatToMatch = originalWhatToMatch;
  } else if (!originalWhatToMatch) {
    console.log("625");
    whatToMatch = originalWhatToMatch;
  } else if (typeof originalWhatToMatch === "function") {
    console.log("628");
    whatToMatch = [];
    whatToMatch.push(originalWhatToMatch);
    console.log(
      `632 whatToMatch = ${whatToMatch}; Array.isArray(whatToMatch) = ${Array.isArray(
        whatToMatch
      )}; whatToMatch.length = ${whatToMatch.length}`
    );
  } else {
    console.log("637");
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof originalWhatToMatch}, equal to:\n${JSON.stringify(
        originalWhatToMatch,
        null,
        4
      )}`
    );
  }

  console.log("\n\n");
  console.log(`648 whatToMatch = ${JSON.stringify(whatToMatch, null, 4)}`);

  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof originalOpts}", and equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }

  let culpritsIndex = 0;
  let culpritsVal = "";
  if (
    opts &&
    opts.trimCharsBeforeMatching &&
    (opts.trimCharsBeforeMatching as string[]).some((el, i) => {
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
      !(whatToMatch[0] as string).trim()) // [""]
  ) {
    if (typeof opts.cb === "function") {
      console.log("694");
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
            (!opts.trimCharsBeforeMatching ||
              !opts.trimCharsBeforeMatching.length ||
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
            `727 ${`\u001b[${33}m${"currentChar"}\u001b[${39}m`} = ${JSON.stringify(
              currentChar,
              null,
              4
            )}`
          );
          // do the actual evaluation, is the current character non-whitespace/non-skiped
          if (
            (!opts.trimBeforeMatching ||
              (opts.trimBeforeMatching && currentChar.trim())) &&
            (!opts.trimCharsBeforeMatching ||
              !opts.trimCharsBeforeMatching.length ||
              !opts.trimCharsBeforeMatching.includes(currentChar))
          ) {
            console.log("741 breaking!");
            firstCharOutsideIndex = y;
            break;
          }
        }
      }
      if (firstCharOutsideIndex === undefined) {
        console.log("748 RETURN false");
        return false;
      }

      const wholeCharacterOutside = str[firstCharOutsideIndex];
      const indexOfTheCharacterAfter = firstCharOutsideIndex + 1;

      let theRemainderOfTheString = "";
      if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
        theRemainderOfTheString = str.slice(0, indexOfTheCharacterAfter);
      }
      if (mode[5] === "L") {
        console.log(`760 ${`\u001b[${32}m${`CALL THE CB()`}\u001b[${39}m`}`);
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
      console.log(`772 ${`\u001b[${32}m${`CALL THE CB()`}\u001b[${39}m`}`);
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
    console.log(`801 special = ${special}`);

    console.log(
      `804 🔥 whatToMatch no. ${i} = ${
        whatToMatch[i]
      } (type ${typeof whatToMatch[i]})`
    );
    console.log(`808 🔥 special = ${special}`);

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
      `825 \u001b[${33}m${"march() called with:"}\u001b[${39}m\n* startingPosition = ${JSON.stringify(
        startingPosition,
        null,
        4
      )}\n* whatToMatchVal = "${whatToMatchVal}"\n`
    );
    console.log("\n\n\n\n\n\n");
    console.log(
      `833 ███████████████████████████████████████ march() STARTS BELOW ███████████████████████████████████████`
    );
    const found = march(
      str,
      startingPosition,
      whatToMatchVal as string,
      opts,
      special,
      (i2) => (mode[5] === "L" ? i2 - 1 : i2 + 1)
    );
    console.log(
      `844 ███████████████████████████████████████ march() ENDED ABOVE ███████████████████████████████████████\n\n\n\n\n\n`
    );
    console.log(
      `847 \u001b[${33}m${"found"}\u001b[${39}m = ${JSON.stringify(
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
      console.log(`862 returning whatToMatchVal() = ${whatToMatchVal()}`);
      return whatToMatchVal() &&
        (opts.cb
          ? opts.cb(
              fullCharacterInFront as string,
              restOfStringInFront,
              indexOfTheCharacterInFront as number
            )
          : true)
        ? whatToMatchVal()
        : false;
    }

    // now, the "found" is the index of the first character of what was found.
    // we need to calculate the character to the left/right of it:

    if (Number.isInteger(found)) {
      indexOfTheCharacterInFront = mode.startsWith("matchLeft")
        ? (found as number) - 1
        : (found as number) + 1;

      //
      if (mode[5] === "L") {
        restOfStringInFront = str.slice(0, found as number);
      } else {
        restOfStringInFront = str.slice(indexOfTheCharacterInFront);
      }
    }

    if ((indexOfTheCharacterInFront as number) < 0) {
      indexOfTheCharacterInFront = undefined;
    }

    if (str[indexOfTheCharacterInFront as number]) {
      fullCharacterInFront = str[indexOfTheCharacterInFront as number];
    }

    console.log(
      `900 FINAL ${`\u001b[${33}m${`indexOfTheCharacterInFront`}\u001b[${39}m`} = ${JSON.stringify(
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
            fullCharacterInFront as string,
            restOfStringInFront,
            indexOfTheCharacterInFront as number
          )
        : true)
    ) {
      console.log(
        `928 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${`\u001b[${33}m${`whatToMatchVal`}\u001b[${39}m`} = ${JSON.stringify(
          whatToMatchVal,
          null,
          4
        )}`
      );
      return whatToMatchVal as string;
    }
  }
  console.log(`937 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} false`);
  return false;
}

// External API functions

function matchLeftIncl(
  str: string,
  position: number,
  whatToMatch: (() => string) | string | string[],
  opts?: Partial<Opts>
): boolean | string {
  return main("matchLeftIncl", str, position, whatToMatch, opts);
}

function matchLeft(
  str: string,
  position: number,
  whatToMatch: (() => string) | string | string[],
  opts?: Partial<Opts>
): boolean | string {
  return main("matchLeft", str, position, whatToMatch, opts);
}

function matchRightIncl(
  str: string,
  position: number,
  whatToMatch: (() => string) | string | string[],
  opts?: Partial<Opts>
): boolean | string {
  return main("matchRightIncl", str, position, whatToMatch, opts);
}

function matchRight(
  str: string,
  position: number,
  whatToMatch: (() => string) | string | string[],
  opts?: Partial<Opts>
): boolean | string {
  return main("matchRight", str, position, whatToMatch, opts);
}

export { matchLeftIncl, matchRightIncl, matchLeft, matchRight };
