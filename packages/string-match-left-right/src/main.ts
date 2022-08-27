/* eslint no-plusplus:0 */

import { arrayiffy } from "arrayiffy-if-string";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

function isObj(something: unknown): boolean {
  return (
    !!something && typeof something === "object" && !Array.isArray(something)
  );
}
function isStr(something: unknown): boolean {
  return typeof something === "string";
}

export interface Opts {
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
  hungry: boolean;
}
const defaults: Opts = {
  cb: undefined,
  i: false,
  trimBeforeMatching: false,
  trimCharsBeforeMatching: [],
  maxMismatches: 0,
  firstMustMatch: false,
  lastMustMatch: false,
  hungry: false,
};

export const defaultGetNextIdx = (index: number): number => index + 1;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function march(
  str: string,
  position: number,
  whatToMatchVal: (() => string) | string,
  originalOpts?: Partial<Opts>,
  special = false,
  getNextIdx = defaultGetNextIdx
) {
  DEV && console.log(`059 \u001b[${35}m${"CALLED march()"}\u001b[${39}m`);
  DEV &&
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

  let whatToMatchValVal =
    typeof whatToMatchVal === "function" ? whatToMatchVal() : whatToMatchVal;

  // early ending case if matching EOL being at 0-th index:
  if (+position < 0 && special && whatToMatchValVal === "EOL") {
    DEV && console.log("080 EARLY ENDING, return true");
    return whatToMatchValVal;
  }

  let opts: Opts = { ...defaults, ...originalOpts };

  DEV &&
    console.log(
      `088 ${`\u001b[${33}m${"position"}\u001b[${39}m`} = ${JSON.stringify(
        position,
        null,
        4
      )}`
    );

  if (position >= str.length && !special) {
    DEV &&
      console.log(
        `098 starting index is beyond the string length so RETURN FALSE`
      );
    return false;
  }

  // The "charsToCheckCount" varies, it decreases with skipped characters,
  // as long as "maxMismatches" allows. It's not the count of how many
  // characters de-facto have been matched from the source.
  let charsToCheckCount = special ? 1 : whatToMatchVal.length;
  DEV && console.log(`107 starting charsToCheckCount = ${charsToCheckCount}`);

  // this is the counter of real characters matched. It is not reduced
  // from the holes in matched. For example, if source is "abc" and
  // maxMismatches=1 and we have "ac", result of the match will be true,
  // the following var will be equal to 2, meaning we matched two
  // characters:
  let charsMatchedTotal = 0;

  // used to catch frontal false positives, where too-eager matching
  // depletes the mismatches allowance before precisely matching the exact
  // string that follows, yielding too early false-positive start
  let patienceReducedBeforeFirstMatch = false;

  let lastWasMismatched: false | number = false; // value is "false" or index of where it was activated

  // if no character was ever matched, even through if opts.maxMismatches
  // would otherwise allow to skip characters, this will act as a last
  // insurance - at least one character must have been matched to yield a
  // positive result!
  let atLeastSomethingWasMatched = false;

  let patience = opts.maxMismatches;

  let i = position;
  DEV &&
    console.log(
      `134 FIY, ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${JSON.stringify(
        i,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `142 FIY, ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
        str,
        null,
        4
      )}`
    );

  // internal-use flag, not the same as "atLeastSomethingWasMatched":
  let somethingFound = false;

  // these two drive opts.firstMustMatch and opts.lastMustMatch:
  let firstCharacterMatched = false;
  let lastCharacterMatched = false;

  // bail early if there's whitespace in front, imagine:
  // abc important}
  //   ^
  //  start, match ["!important"], matchRightIncl()
  //
  // in case above, "c" consumed 1 patience, let's say 1 is left,
  // we stumble upon "i" where "!" is missing. "c" is false start.
  function whitespaceInFrontOfFirstChar(): boolean {
    return (
      // it's a first letter match
      charsMatchedTotal === 1 &&
      // and character in front exists
      // str[i - 1] &&
      // and it's whitespace
      // !str[i - 1].trim() &&
      // some patience has been consumed already
      patience < opts.maxMismatches - 1
    );
  }

  while (str[i]) {
    let nextIdx = getNextIdx(i);

    DEV &&
      console.log(
        `181 \u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
          str[i]?.trim() ? str[i] : JSON.stringify(str[i], null, 4)
        }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
      );

    if (opts.trimBeforeMatching && str[i].trim() === "") {
      DEV && console.log("187 trimmed");
      if (!str[nextIdx] && special && whatToMatchVal === "EOL") {
        DEV &&
          console.log(
            "191 start/end of string reached, matching to EOL, so return true"
          );
        return true;
      }
      i = getNextIdx(i);
      continue;
    }

    DEV &&
      console.log(
        `201 ${`\u001b[${33}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`} = ${JSON.stringify(
          opts.trimCharsBeforeMatching,
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `209 ${`\u001b[${33}m${`opts.trimCharsBeforeMatching.includes("${str[i]}")`}\u001b[${39}m`} = ${JSON.stringify(
          opts.trimCharsBeforeMatching.includes(str[i]),
          null,
          4
        )}`
      );

    if (
      (opts &&
        !opts.i &&
        opts.trimCharsBeforeMatching &&
        opts.trimCharsBeforeMatching.includes(str[i])) ||
      (opts?.i &&
        opts.trimCharsBeforeMatching &&
        (opts.trimCharsBeforeMatching as string[])
          .map((val) => val.toLowerCase())
          .includes(str[i].toLowerCase()))
    ) {
      DEV && console.log("227 char is in the skip list");
      if (special && whatToMatchVal === "EOL" && !str[nextIdx]) {
        // return true because we reached the zero'th index, exactly what we're looking for
        DEV &&
          console.log(
            "232 RETURN true because it's EOL next, exactly what we're looking for"
          );
        return true;
      }
      i = getNextIdx(i);
      continue;
    }
    DEV &&
      console.log(
        `241 ${`\u001b[${33}m${"charsToCheckCount"}\u001b[${39}m`} = ${JSON.stringify(
          charsToCheckCount,
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `249 whatToMatchVal[charsToCheckCount - 1] = whatToMatchVal[${
          charsToCheckCount - 1
        }] = ${(whatToMatchVal as string)[charsToCheckCount - 1]}`
      );
    DEV &&
      console.log(
        `255 whatToMatchVal[charsToCheckCount - 2]whatToMatchVal[charsToCheckCount - 1] = whatToMatchVal[${
          charsToCheckCount - 2
        }]whatToMatchVal[${charsToCheckCount - 1}] = ${
          (whatToMatchVal as string)[charsToCheckCount - 2]
        }${(whatToMatchVal as string)[charsToCheckCount - 1]}`
      );

    let charToCompareAgainst =
      nextIdx > i
        ? (whatToMatchVal as string)[whatToMatchVal.length - charsToCheckCount]
        : (whatToMatchVal as string)[charsToCheckCount - 1];

    DEV && console.log(" ");
    DEV &&
      console.log(`269 \u001b[${35}m${"██ str[i]"}\u001b[${39}m = ${str[i]}`);
    DEV &&
      console.log(
        `272 \u001b[${35}m${"██ charToCompareAgainst"}\u001b[${39}m = ${charToCompareAgainst}`
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
        DEV &&
          console.log(
            `292 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} firstCharacterMatched = true`
          );

        // now, if the first character was matched and yet, patience was
        // reduced already, this means there's a false beginning in front
        if (patience !== opts.maxMismatches) {
          DEV &&
            console.log(
              `300 RETURN ${`\u001b[${31}m${`false`}\u001b[${39}m`} because patience was consumed already, before matching this first character!`
            );
          return false;
        }
      } else if (charsToCheckCount === 1) {
        lastCharacterMatched = true;
        DEV &&
          console.log(
            `308 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} lastCharacterMatched = true`
          );
      }

      DEV && console.log(" ");
      DEV && console.log(`313 ${`\u001b[${32}m${`MATCHED!`}\u001b[${39}m`}`);
      DEV && console.log(" ");
      charsToCheckCount -= 1;
      charsMatchedTotal++;
      DEV &&
        console.log(
          `319 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`charsToCheckCount`}\u001b[${39}m`} = ${charsToCheckCount};  ${`\u001b[${33}m${`charsMatchedTotal`}\u001b[${39}m`} = ${charsMatchedTotal}`
        );

      // bail early if there's whitespace in front, imagine:
      // abc important}
      //   ^
      //  start, match ["!important"], matchRightIncl()
      //
      // in case above, "c" consumed 1 patience, let's say 1 is left,
      // we stumble upon "i" where "!" is missing. "c" is false start.
      if (whitespaceInFrontOfFirstChar()) {
        DEV &&
          console.log(`331 ${`\u001b[${31}m${`RETURN false.`}\u001b[${39}m`}`);
        return false;
      }

      if (!charsToCheckCount) {
        DEV &&
          console.log(
            `338 all chars matched, ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}: ${i}; charsToCheckCount = ${charsToCheckCount}; patience = ${patience}`
          );
        return (
          // either it was not a perfect match
          charsMatchedTotal !== whatToMatchVal.length ||
            // or it was, and in that case, no patience was reduced
            // (if a perfect match was found, yet some "patience" was reduced,
            // that means we have false positive characters)
            patience === opts.maxMismatches ||
            // mind you, it can be a case of rogue characters in-between
            // the what was matched, imagine:
            // source: "abxcd", matching ["bc"], maxMismatches=1
            // in above case, charsMatchedTotal === 2 and whatToMatchVal ("bc") === 2
            // - we want to exclude cases of frontal false positives, like:
            // source: "xy abc", match "abc", maxMismatches=2, start at 0
            //          ^
            //       match form here to the right
            !patienceReducedBeforeFirstMatch
            ? i
            : false
        );
      }

      DEV &&
        console.log(
          `363 ${`\u001b[${32}m${`${`\u001b[${32}m${`OK.`}\u001b[${39}m`} Reduced charsToCheckCount to ${charsToCheckCount}`}\u001b[${39}m`}`
        );
    } else {
      DEV && console.log(" ");
      DEV &&
        console.log(`368 ${`\u001b[${31}m${`DIDN'T MATCH!`}\u001b[${39}m`}`);
      DEV && console.log(" ");
      DEV &&
        console.log(`371 str[i = ${i}] = ${JSON.stringify(str[i], null, 4)}`);
      DEV &&
        console.log(
          `374 whatToMatchVal[whatToMatchVal.length - charsToCheckCount = ${
            whatToMatchVal.length - charsToCheckCount
          }] = ${JSON.stringify(
            (whatToMatchVal as string)[
              whatToMatchVal.length - charsToCheckCount
            ],
            null,
            4
          )}`
        );

      if (!patienceReducedBeforeFirstMatch && !charsMatchedTotal) {
        patienceReducedBeforeFirstMatch = true;
        DEV &&
          console.log(
            `389 SET ${`\u001b[${33}m${`patienceReducedBeforeFirstMatch`}\u001b[${39}m`} = ${JSON.stringify(
              patienceReducedBeforeFirstMatch,
              null,
              4
            )}`
          );
      }

      if (opts.maxMismatches && patience && i) {
        patience -= 1;
        DEV &&
          console.log(
            `401 ${`\u001b[${31}m${`DECREASE`}\u001b[${39}m`} patience to ${patience}`
          );

        // the bigger the maxMismatches, the further away we must check for
        // alternative matches
        for (let y = 0; y <= patience; y++) {
          DEV &&
            console.log(
              `409 █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ current mismatch limit = ${y}`
            );

          // maybe str[i] will match against next charToCompareAgainst?
          let nextCharToCompareAgainst =
            nextIdx > i
              ? (whatToMatchVal as string)[
                  whatToMatchVal.length - charsToCheckCount + 1 + y
                ]
              : (whatToMatchVal as string)[charsToCheckCount - 2 - y];

          DEV && console.log(" ");
          DEV &&
            console.log(
              `██ ${`\u001b[${33}m${`whatToMatchVal.length`}\u001b[${39}m`} = ${JSON.stringify(
                whatToMatchVal.length,
                null,
                4
              )}`
            );
          DEV &&
            console.log(
              `██ ${`\u001b[${33}m${`charsToCheckCount`}\u001b[${39}m`} = ${JSON.stringify(
                charsToCheckCount,
                null,
                4
              )}`
            );
          DEV &&
            console.log(
              `439 ${`\u001b[${35}m${`██ MAYBE NEXT CHAR WILL MATCH?`}\u001b[${39}m`}`
            );
          DEV &&
            console.log(
              `443 \u001b[${35}m${"██ str[i]"}\u001b[${39}m = ${str[i]}`
            );
          DEV &&
            console.log(
              `447 \u001b[${35}m${"██ nextCharToCompareAgainst"}\u001b[${39}m = ${nextCharToCompareAgainst}`
            );
          DEV && console.log(" ");

          let nextCharInSource = str[getNextIdx(i)];

          DEV &&
            console.log(
              `455 ${`\u001b[${35}m${`██ OR MAYBE CURRENT CHAR CAN BE SKIPPED?`}\u001b[${39}m`}`
            );
          DEV &&
            console.log(
              `459 \u001b[${35}m${"██ nextCharInSource"}\u001b[${39}m = ${nextCharInSource}`
            );
          DEV &&
            console.log(
              `463 \u001b[${35}m${"██ nextCharToCompareAgainst"}\u001b[${39}m = ${nextCharToCompareAgainst}`
            );
          DEV && console.log(" ");

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
            DEV && console.log(" ");
            DEV &&
              console.log(`479 ${`\u001b[${32}m${`MATCHED!`}\u001b[${39}m`}`);
            DEV && console.log(" ");
            charsMatchedTotal++;

            // bail early if there's whitespace in front, imagine:
            // abc important}
            //   ^
            //  start, match ["!important"], matchRightIncl()
            //
            // in case above, "c" consumed 1 patience, let's say 1 is left,
            // we stumble upon "i" where "!" is missing. "c" is false start.
            if (whitespaceInFrontOfFirstChar()) {
              DEV &&
                console.log(
                  `493 ${`\u001b[${31}m${`RETURN false.`}\u001b[${39}m`}`
                );
              return false;
            }

            charsToCheckCount -= 2;
            DEV &&
              console.log(
                `501 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`charsToCheckCount`}\u001b[${39}m`} = ${JSON.stringify(
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
            DEV && console.log(" ");
            DEV &&
              console.log(`523 ${`\u001b[${32}m${`MATCHED!`}\u001b[${39}m`}`);
            DEV && console.log(" ");

            if (!charsMatchedTotal && !opts.hungry) {
              DEV &&
                console.log(
                  `529 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${`\u001b[${31}m${`false`}\u001b[${39}m`}`
                );
              return false;
            }

            charsToCheckCount -= 1;
            DEV &&
              console.log(
                `537 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`charsToCheckCount`}\u001b[${39}m`} = ${JSON.stringify(
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
            DEV &&
              console.log(
                `560 ${`\u001b[${32}m${`STILL MATCHED DESPITE MISMATCH`}\u001b[${39}m`}, RETURN "${i}"`
              );
            return i;
          }

          // ███████████████████████████████████████
        }
        DEV && console.log(`567 █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ `);

        if (!somethingFound) {
          // if the character was rogue, we mark it:
          lastWasMismatched = i;
          DEV &&
            console.log(
              `574 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastWasMismatched`}\u001b[${39}m`} = ${lastWasMismatched}`
            );
          // patience--;
          // DEV && console.log(
          //   `350 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`patience`}\u001b[${39}m`} = ${patience}`
          // );
        }
      } else if (
        i === 0 &&
        charsToCheckCount === 1 &&
        !opts.lastMustMatch &&
        atLeastSomethingWasMatched
      ) {
        DEV && console.log(`587 LAST CHARACTER. RETURN 0.`);
        return 0;
      } else {
        DEV &&
          console.log(`591 ${`\u001b[${31}m${`RETURN false.`}\u001b[${39}m`}`);
        return false;
      }
    }

    // turn off "lastWasMismatched" if it's on and it hasn't been activated
    // on this current index:
    if (lastWasMismatched !== false && lastWasMismatched !== i) {
      lastWasMismatched = false;
      DEV &&
        console.log(
          `602 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastWasMismatched`}\u001b[${39}m`} = ${lastWasMismatched}`
        );
    }

    // if all was matched, happy days
    if (charsToCheckCount < 1) {
      DEV &&
        console.log(
          `610 all chars matched, ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} i: ${i}; charsToCheckCount = ${charsToCheckCount}`
        );
      return i;
    }

    // iterate onto the next index, otherwise while would loop infinitely
    i = getNextIdx(i);

    DEV &&
      console.log(
        `${`\u001b[${90}m${`--------------------- ending with: ---------------------`}\u001b[${39}m`}`
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`charsToCheckCount = ${JSON.stringify(
          charsToCheckCount,
          null,
          4
        )}`}\u001b[${39}m`}`
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`charsMatchedTotal = ${JSON.stringify(
          charsMatchedTotal,
          null,
          4
        )}`}\u001b[${39}m`}`
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`lastWasMismatched = ${JSON.stringify(
          lastWasMismatched,
          null,
          4
        )}`}\u001b[${39}m`}`
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`patience = ${JSON.stringify(
          patience,
          null,
          4
        )}`}\u001b[${39}m`}`
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`atLeastSomethingWasMatched = ${JSON.stringify(
          atLeastSomethingWasMatched,
          null,
          4
        )}`}\u001b[${39}m`}`
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`firstCharacterMatched = ${JSON.stringify(
          firstCharacterMatched,
          null,
          4
        )}`}\u001b[${39}m`}`
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`lastCharacterMatched = ${JSON.stringify(
          lastCharacterMatched,
          null,
          4
        )}`}\u001b[${39}m`}`
      );
  }

  DEV && console.log(`680 AFTER THE WHILE LOOP`);

  if (charsToCheckCount > 0) {
    if (special && whatToMatchValVal === "EOL") {
      DEV &&
        console.log(
          `686 charsToCheckCount = ${charsToCheckCount};\nwent past the beginning of the string and EOL was queried to ${`\u001b[${32}m${`return TRUE`}\u001b[${39}m`}`
        );
      return true;
    }
    if (
      opts &&
      opts.maxMismatches >= charsToCheckCount &&
      atLeastSomethingWasMatched
    ) {
      DEV && console.log(`695 RETURN ${lastWasMismatched || 0}`);
      return lastWasMismatched || 0;
    }
    DEV &&
      console.log(
        `700 ${`\u001b[${31}m${`charsToCheckCount = ${charsToCheckCount} THEREFORE, returning FALSE`}\u001b[${39}m`}`
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
    originalOpts &&
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

  let opts: Opts = { ...defaults, ...originalOpts };
  if (typeof opts.trimCharsBeforeMatching === "string") {
    // arrayiffy if needed:
    opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching);
  }
  // stringify all:
  opts.trimCharsBeforeMatching = opts.trimCharsBeforeMatching.map(
    (el: unknown) => (isStr(el) ? el : String(el)) as string
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
    DEV && console.log("797");
    whatToMatch = [originalWhatToMatch];
  } else if (Array.isArray(originalWhatToMatch)) {
    DEV && console.log("800");
    whatToMatch = originalWhatToMatch;
  } else if (!originalWhatToMatch) {
    DEV && console.log("803");
    whatToMatch = originalWhatToMatch;
  } else if (typeof originalWhatToMatch === "function") {
    DEV && console.log("806");
    whatToMatch = [];
    whatToMatch.push(originalWhatToMatch);
    DEV &&
      console.log(
        `811 whatToMatch = ${whatToMatch}; Array.isArray(whatToMatch) = ${Array.isArray(
          whatToMatch
        )}; whatToMatch.length = ${whatToMatch.length}`
      );
  } else {
    DEV && console.log("816");
    throw new Error(
      `string-match-left-right/${mode}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof originalWhatToMatch}, equal to:\n${JSON.stringify(
        originalWhatToMatch,
        null,
        4
      )}`
    );
  }

  DEV && console.log("\n\n");
  DEV &&
    console.log(`828 whatToMatch = ${JSON.stringify(whatToMatch, null, 4)}`);

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
    opts?.trimCharsBeforeMatching &&
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
      !(whatToMatch[0] as string).trim()) // [""]
  ) {
    if (typeof opts.cb === "function") {
      DEV && console.log("873");
      let firstCharOutsideIndex;

      // matchLeft() or matchRightIncl() methods start at index "position"
      let startingPosition = position;
      if (mode === "matchLeftIncl" || mode === "matchRight") {
        startingPosition += 1;
      }

      if (mode[5] === "L") {
        for (let y = startingPosition; y--; ) {
          // assemble the value of the current character
          let currentChar = str[y];
          // do the actual evaluation, is the current character non-whitespace/non-skiped
          if (
            (!opts.trimBeforeMatching ||
              (opts.trimBeforeMatching &&
                currentChar !== undefined &&
                currentChar.trim())) &&
            (!opts.trimCharsBeforeMatching?.length ||
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
          let currentChar = str[y];
          DEV &&
            console.log(
              `906 ${`\u001b[${33}m${"currentChar"}\u001b[${39}m`} = ${JSON.stringify(
                currentChar,
                null,
                4
              )}`
            );
          // do the actual evaluation, is the current character non-whitespace/non-skiped
          if (
            (!opts.trimBeforeMatching ||
              (opts.trimBeforeMatching && currentChar.trim())) &&
            (!opts.trimCharsBeforeMatching?.length ||
              !opts.trimCharsBeforeMatching.includes(currentChar))
          ) {
            DEV && console.log("919 breaking!");
            firstCharOutsideIndex = y;
            break;
          }
        }
      }
      if (firstCharOutsideIndex === undefined) {
        DEV && console.log("926 RETURN false");
        return false;
      }

      let wholeCharacterOutside = str[firstCharOutsideIndex];
      let indexOfTheCharacterAfter = firstCharOutsideIndex + 1;

      let theRemainderOfTheString = "";
      if (indexOfTheCharacterAfter && indexOfTheCharacterAfter > 0) {
        theRemainderOfTheString = str.slice(0, indexOfTheCharacterAfter);
      }
      if (mode[5] === "L") {
        DEV &&
          console.log(`939 ${`\u001b[${32}m${`CALL THE CB()`}\u001b[${39}m`}`);
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
      DEV &&
        console.log(`952 ${`\u001b[${32}m${`CALL THE CB()`}\u001b[${39}m`}`);
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
    DEV &&
      console.log(
        `978 matchLeft() LOOP ${i} ${`\u001b[${32}m${`=================================================================================`}\u001b[${39}m`} \n\n`
      );

    special = typeof whatToMatch[i] === "function";
    DEV && console.log(`982 special = ${special}`);

    DEV &&
      console.log(
        `986 🔥 whatToMatch no. ${i} = ${
          whatToMatch[i]
        } (type ${typeof whatToMatch[i]})`
      );
    DEV && console.log(`990 🔥 special = ${special}`);

    // since input can be function, we need to grab the value explicitly:
    let whatToMatchVal = whatToMatch[i];

    let fullCharacterInFront;
    let indexOfTheCharacterInFront;
    let restOfStringInFront = "";

    let startingPosition = position;
    if (mode === "matchRight") {
      startingPosition += 1;
    } else if (mode === "matchLeft") {
      startingPosition -= 1;
    }

    DEV &&
      console.log(
        `1008 \u001b[${33}m${"march() called with:"}\u001b[${39}m\n* startingPosition = ${JSON.stringify(
          startingPosition,
          null,
          4
        )}\n* whatToMatchVal = "${whatToMatchVal}"\n`
      );
    DEV && console.log("\n\n\n\n\n\n");
    DEV &&
      console.log(
        `1017 ███████████████████████████████████████ march() STARTS BELOW ███████████████████████████████████████`
      );
    let found = march(
      str,
      startingPosition,
      whatToMatchVal as string | (() => string),
      opts,
      special,
      (i2) => (mode[5] === "L" ? i2 - 1 : i2 + 1)
    );
    DEV &&
      console.log(
        `1029 ███████████████████████████████████████ march() ENDED ABOVE ███████████████████████████████████████\n\n\n\n\n\n`
      );
    DEV &&
      console.log(
        `1033 \u001b[${33}m${"found"}\u001b[${39}m = ${JSON.stringify(
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
      DEV &&
        console.log(`1049 returning whatToMatchVal() = ${whatToMatchVal()}`);
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

    DEV &&
      console.log(
        `1088 FINAL ${`\u001b[${33}m${`indexOfTheCharacterInFront`}\u001b[${39}m`} = ${JSON.stringify(
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
      DEV &&
        console.log(
          `1117 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${`\u001b[${33}m${`whatToMatchVal`}\u001b[${39}m`} = ${JSON.stringify(
            whatToMatchVal,
            null,
            4
          )}`
        );
      return whatToMatchVal as string;
    }
  }
  DEV && console.log(`1126 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} false`);
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

export {
  matchLeftIncl,
  matchRightIncl,
  matchLeft,
  matchRight,
  defaults,
  version,
};
