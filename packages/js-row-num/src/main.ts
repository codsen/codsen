import { Ranges } from "ranges-push";
import { rApply } from "ranges-apply";
import type { Ranges as RangesType } from "../../../ops/typedefs/common";

import { version as v } from "../package.json";

const version: string = v;

const BACKSLASH = `\u005C`;

interface Opts {
  padStart: number;
  overrideRowNum: null | number;
  returnRangesOnly: boolean;
  triggerKeywords: string[];
  extractedLogContentsWereGiven: boolean;
}

const defaults: Opts = {
  padStart: 3,
  overrideRowNum: null,
  returnRangesOnly: false,
  triggerKeywords: ["console.log"],
  extractedLogContentsWereGiven: false,
};

function fixRowNums(
  str: string,
  originalOpts?: Partial<Opts>
): string | RangesType {
  console.log(
    `032 ${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} = ${JSON.stringify(
      originalOpts,
      null,
      4
    )}`
  );
  if (typeof str !== "string" || !str.length) {
    return str;
  }
  function isDigit(something: any): boolean {
    return /[0-9]/.test(something);
  }
  function isAZ(something: any): boolean {
    return /[A-Za-z]/.test(something);
  }
  function isObj(something: any): boolean {
    return (
      something && typeof something === "object" && !Array.isArray(something)
    );
  }

  let opts: Opts = { ...defaults, ...originalOpts };

  if (
    !opts.padStart ||
    typeof opts.padStart !== "number" ||
    (typeof opts.padStart === "number" && opts.padStart < 0)
  ) {
    opts.padStart = 0;
  }

  let finalIndexesToDelete = new Ranges();

  let i;
  let len = str.length;
  let quotes: { start: number; type: string } | null = null;
  let consoleStartsAt = null;
  let bracketOpensAt = null;
  let currentRow = 1;
  let wasLetterDetected: undefined | boolean = false;
  let digitStartsAt = null;

  if (opts.padStart && len > 45000) {
    opts.padStart = 4;
  }

  console.log(
    `079 ${`\u001b[${33}m${`str`}\u001b[${39}m`}:\n${JSON.stringify(
      str,
      null,
      0
    )}\n${`\u001b[${35}m${`FINAL`}\u001b[${39}m`} opts: ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  for (i = 0; i < len; i++) {
    console.log(
      `\u001b[${36}m${`--------------------------------`}\u001b[${39}m ${`\u001b[${33}m${`str[${i}]`}\u001b[${39}m`} = ${
        str[i].trim() ? str[i] : JSON.stringify(str[i], null, 0)
      }`
    );

    // count lines:
    if (
      opts.overrideRowNum === null &&
      (str[i] === "\n" || (str[i] === "\r" && str[i + 1] !== "\n"))
    ) {
      currentRow += 1;
      console.log(
        `104 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} currentRow = ${currentRow}`
      );
    }

    // catch closing quotes console.log( ' -----> ' <------)
    if (
      !opts.extractedLogContentsWereGiven &&
      quotes !== null &&
      quotes.start < i &&
      quotes.type === str[i]
    ) {
      console.log(
        `116 \u001b[${31}m${`CLOSING QUOTE DETECTED - WIPE`}\u001b[${39}m`
      );
      quotes = null;
      consoleStartsAt = null;
      bracketOpensAt = null;
      digitStartsAt = null;
      wasLetterDetected = false;
    }

    // catch opening quotes console.log( -----> ' <------ ')
    if (
      quotes === null &&
      (opts.extractedLogContentsWereGiven ||
        (consoleStartsAt &&
          consoleStartsAt < i &&
          bracketOpensAt &&
          bracketOpensAt < i)) &&
      str[i].trim()
    ) {
      console.log("135 within opening quotes trap clauses");

      if (str[i] === '"' || str[i] === "'" || str[i] === "`") {
        console.log(`138 clause #1 - quotes`);
        quotes = {
          start: i,
          type: str[i],
        };
        wasLetterDetected = false;
        console.log(
          `145 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wasLetterDetected`}\u001b[${39}m`} = ${JSON.stringify(
            wasLetterDetected,
            null,
            4
          )}`
        );
        console.log(
          `152 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`quotes`}\u001b[${39}m`} = ${JSON.stringify(
            quotes,
            null,
            4
          )}`
        );
      } else if (opts.extractedLogContentsWereGiven && digitStartsAt === null) {
        if (isDigit(str[i])) {
          console.log(`160 clause #2`);
          digitStartsAt = i;
          console.log(
            `163 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`digitStartsAt`}\u001b[${39}m`} = ${digitStartsAt}`
          );
        } else {
          console.log(`166 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
      } else if (
        str[i].trim() &&
        str[i] !== "/" &&
        !opts.extractedLogContentsWereGiven
      ) {
        console.log(`174 clause #3`);
        // wipe
        console.log(
          `177 \u001b[${31}m${`A QUOTE EXPECTED HERE SO WIPE`}\u001b[${39}m`
        );
        consoleStartsAt = null;
        bracketOpensAt = null;
        digitStartsAt = null;
      }
    }

    // catch the first digit within console.log:
    if (
      quotes &&
      Number.isInteger(quotes.start) &&
      quotes.start < i &&
      !wasLetterDetected &&
      digitStartsAt === null &&
      isDigit(str[i])
    ) {
      digitStartsAt = i;
      console.log(
        `196 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`digitStartsAt`}\u001b[${39}m`} = ${digitStartsAt}`
      );
    }

    // catch the ending of the digits within console.log:
    if (
      Number.isInteger(digitStartsAt) &&
      (!isDigit(str[i]) || !str[i + 1]) &&
      (i > (digitStartsAt as number) || !str[i + 1])
    ) {
      // replace the digits:
      console.log(
        `208 ${`\u001b[${32}m${`THING ABOUT TO BE PUSHED:`}\u001b[${39}m`}`
      );
      console.log(
        `211 ${`\u001b[${33}m${`opts.padStart`}\u001b[${39}m`} = ${JSON.stringify(
          opts.padStart,
          null,
          4
        )}`
      );
      console.log(
        `218 ${`\u001b[${33}m${`padStart(${currentRow} (${typeof currentRow}), ${
          opts.padStart
        } (${typeof opts.padStart}), "0")`}\u001b[${39}m`} = ${JSON.stringify(
          String(currentRow).padStart(opts.padStart, "0"),
          null,
          4
        )}`
      );
      console.log(
        `227 ${`\u001b[${33}m${`currentRow`}\u001b[${39}m`} = ${JSON.stringify(
          currentRow,
          null,
          4
        )}`
      );
      console.log(
        `234 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
          [
            digitStartsAt,
            !isDigit(str[i]) ? i : i + 1,
            opts.padStart
              ? String(
                  opts.overrideRowNum !== null
                    ? opts.overrideRowNum
                    : currentRow
                ).padStart(opts.padStart, "0")
              : `${
                  opts.overrideRowNum !== null
                    ? opts.overrideRowNum
                    : currentRow
                }`,
          ],
          null,
          0
        )}`
      );
      console.log(
        `255 ${`\u001b[${35}m${`███████████████████████████████████████`}\u001b[${39}m`}`
      );
      if (!opts.padStart) {
        console.log(`258 `);
        if (opts.overrideRowNum != null) {
          console.log(`260 ██ case 1`);
        } else {
          console.log(`262 ██ case 2`);
        }
      }

      // PS. finalIndexesToDelete is a Ranges class so we can push
      // two/three arguments and it will understand it's (range) array...
      finalIndexesToDelete.push(
        digitStartsAt as number,
        !isDigit(str[i]) ? i : i + 1,
        opts.padStart
          ? String(
              opts.overrideRowNum != null ? opts.overrideRowNum : currentRow
            ).padStart(opts.padStart, "0")
          : `${opts.overrideRowNum != null ? opts.overrideRowNum : currentRow}`
      );
      console.log(
        `278 NOW ${`\u001b[${33}m${`finalIndexesToDelete`}\u001b[${39}m`} = ${JSON.stringify(
          finalIndexesToDelete.current(),
          null,
          4
        )}`
      );
      // then, reset:
      digitStartsAt = null;
      console.log(
        `287 ${`\u001b[${33}m${`digitStartsAt`}\u001b[${39}m`} = null`
      );
      // set wasLetterDetected as a decoy to prevent further digit lumps from being edited:
      wasLetterDetected = true;
      console.log(
        `292 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wasLetterDetected`}\u001b[${39}m`} = true`
      );
    }

    // catch first letter within console.log:
    if (
      quotes &&
      Number.isInteger(quotes.start) &&
      quotes.start < i &&
      !wasLetterDetected &&
      isAZ(str[i]) &&
      !(str[i] === "n" && str[i - 1] === BACKSLASH)
    ) {
      // Skip one of more of either patterns:
      // \u001b[${33}m
      // ${`
      // `\u001b[33m       \u001b[39m`

      // \u001B[4m        \u001B[0m

      // \u001B[4m   \u001B[0m

      // check for pattern \u001B[ + optional ${ + any amount of digits + optional } + m

      /* istanbul ignore if */
      if (
        /* istanbul ignore next */
        str[i - 1] === BACKSLASH &&
        str[i] === "u" &&
        str[i + 1] === "0" &&
        str[i + 2] === "0" &&
        str[i + 3] === "1" &&
        (str[i + 4] === "b" || str[i + 5] === "B") &&
        str[i + 5] === "["
      ) {
        console.log(`327 \u001b[${35}m${`MATCHED`}\u001b[${39}m`);
        // at this moment, we have stuck here:
        //
        // console.log(`\u001b[${33}m${`291 zzz`}\u001b[${39}m`)
        //                    ^
        //           here, at this bracket

        // now, the ANSI colour digit code might be wrapped with ${} and also,
        // it can be of an indeterminate width: normally there is either one or
        // two digits.

        // We need to find where digits start.

        // There are two possibilities: either here, or after string literal ${}
        // wrapper:

        // base assumption, we're here:
        // console.log(`\u001b[33m 123 zzz \u001b[${39}m`)
        //                     ^
        //                   here

        let startMarchingForwFrom;
        if (isDigit(str[i + 6])) {
          startMarchingForwFrom = i + 6;
          console.log(
            `352 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`startMarchingForwFrom`}\u001b[${39}m`} = ${startMarchingForwFrom}`
          );
        } else if (
          str[i + 6] === "$" &&
          str[i + 7] === "{" &&
          isDigit(str[i + 8])
        ) {
          startMarchingForwFrom = i + 8;
          console.log(
            `361 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`startMarchingForwFrom`}\u001b[${39}m`} = ${startMarchingForwFrom}`
          );
        }

        console.log(
          `366 FINAL ${`\u001b[${33}m${`startMarchingForwFrom`}\u001b[${39}m`} = ${startMarchingForwFrom}`
        );

        // find out where does this (possibly a sequence) of number(s) end:
        let numbersSequenceEndsAt;
        if (startMarchingForwFrom as number) {
          console.log(
            `373 \u001b[${36}m${`startMarchingForwFrom`}\u001b[${39}m was set so marching forward`
          );
          for (let y = startMarchingForwFrom as number; y < len; y++) {
            console.log(`\u001b[${36}m${`str[${y}] = ${str[y]}`}\u001b[${39}m`);
            if (!isDigit(str[y])) {
              numbersSequenceEndsAt = y;
              console.log(`\u001b[${36}m${`not digit, so break`}\u001b[${39}m`);
              break;
            }
          }
          console.log(`383 \u001b[${36}m${`stop marching`}\u001b[${39}m`);
        }

        // answer: at "numbersSequenceEndsAt".
        console.log(
          `388 \u001b[${32}m${`str[${numbersSequenceEndsAt}] = ${
            str[numbersSequenceEndsAt as number]
          }`}\u001b[${39}m`
        );

        // We're at the next character where digits end. That is:

        // console.log(`\u001b[33m 123 zzz \u001b[${39}m`)
        //                       ^
        //                     here, OR

        // console.log(`\u001b[${33}m 123 zzz \u001b[${39}m`)
        //                         ^
        //                       here

        let ansiSequencesLetterMAt;

        if (
          numbersSequenceEndsAt !== undefined &&
          str[numbersSequenceEndsAt] === "m"
        ) {
          // if number follows "m", this is it:
          ansiSequencesLetterMAt = numbersSequenceEndsAt;
        } else if (
          numbersSequenceEndsAt !== undefined &&
          str[numbersSequenceEndsAt] === "}" &&
          str[numbersSequenceEndsAt + 1] === "m"
        ) {
          ansiSequencesLetterMAt = numbersSequenceEndsAt + 1;
        }

        console.log(
          `420 ${`\u001b[${33}m${`ansiSequencesLetterMAt`}\u001b[${39}m`} = ${ansiSequencesLetterMAt};`
        );

        /* istanbul ignore else */
        if (!ansiSequencesLetterMAt) {
          // if ANSI closing "m" hasn't been detected yet, bail:
          wasLetterDetected = true;
          continue;
        }

        /* istanbul ignore else */
        if (
          str[ansiSequencesLetterMAt + 1] === "$" &&
          str[ansiSequencesLetterMAt + 2] === "{" &&
          str[ansiSequencesLetterMAt + 3] === "`"
        ) {
          i = ansiSequencesLetterMAt + 3;
          console.log(
            `438 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${i}`
          );
          continue;
        }
      }

      wasLetterDetected = true;
      console.log(
        `446 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wasLetterDetected`}\u001b[${39}m`} = true`
      );
    }

    // catch the opening bracket of console.log ---->(<----- )
    if (
      !bracketOpensAt &&
      str[i].trim() &&
      consoleStartsAt &&
      consoleStartsAt <= i
    ) {
      if (str[i] === "(") {
        bracketOpensAt = i;
        console.log(
          `460 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`bracketOpensAt`}\u001b[${39}m`} = ${JSON.stringify(
            bracketOpensAt,
            null,
            4
          )}`
        );
      } else {
        // wipe
        console.log(`468 \u001b[${31}m${`WIPE`}\u001b[${39}m`);
        consoleStartsAt = null;
        digitStartsAt = null;
      }
    }

    // catch the trigger keywords
    if (
      isObj(opts) &&
      opts.triggerKeywords &&
      Array.isArray(opts.triggerKeywords)
    ) {
      // check does any of the trigger keywords match
      let caughtKeyword;

      for (let y = 0, len2 = opts.triggerKeywords.length; y < len2; y++) {
        /* istanbul ignore else */
        if (str.startsWith(opts.triggerKeywords[y], i)) {
          caughtKeyword = opts.triggerKeywords[y];
          break;
        }
      }

      // if any of trigger keywords starts here
      /* istanbul ignore else */
      if (caughtKeyword) {
        consoleStartsAt = i + caughtKeyword.length;
        console.log(
          `496 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`consoleStartsAt`}\u001b[${39}m`} = ${consoleStartsAt}`
        );
        // offset the index so we don't traverse twice what was traversed already:
        i = i + caughtKeyword.length - 1;
        console.log(
          `501 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${i}`
        );
        continue;
      }
    }

    console.log(`\u001b[${90}m${`--------------------------`}\u001b[${39}m`);
    console.log(`\u001b[${90}m${`currentRow = ${currentRow}`}\u001b[${39}m`);
    console.log(
      `\u001b[${90}m${`digitStartsAt = ${digitStartsAt}`}\u001b[${39}m`
    );
    console.log(
      `\u001b[${90}m${`bracketOpensAt = ${bracketOpensAt}`}\u001b[${39}m`
    );
    console.log(
      `\u001b[${90}m${`consoleStartsAt = ${consoleStartsAt}`}\u001b[${39}m`
    );
    console.log(
      `\u001b[${90}m${`quotes = ${JSON.stringify(quotes, null, 0)}${
        quotes ? `\nwasLetterDetected = ${wasLetterDetected}` : ""
      }`}\u001b[${39}m`
    );
  }

  console.log(
    `526 ${`\u001b[${33}m${`finalIndexesToDelete.current()`}\u001b[${39}m`} = ${JSON.stringify(
      finalIndexesToDelete.current(),
      null,
      4
    )}`
  );

  // wipe
  quotes = null;
  consoleStartsAt = null;
  bracketOpensAt = null;
  currentRow = 1;
  wasLetterDetected = undefined;
  digitStartsAt = null;
  currentRow = 1;

  if (opts.returnRangesOnly) {
    console.log(`543`);
    return finalIndexesToDelete.current();
  }
  if (finalIndexesToDelete.current()) {
    console.log(`547`);
    return rApply(str, finalIndexesToDelete.current());
  }
  console.log(`550`);
  return str;
}

export { fixRowNums, defaults, version };
