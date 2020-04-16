import Ranges from "ranges-push";
import apply from "ranges-apply";
const BACKSLASH = `\u005C`;

function fixRowNums(str, originalOpts) {
  console.log(
    `007 ${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} = ${JSON.stringify(
      originalOpts,
      null,
      4
    )}`
  );
  if (typeof str !== "string" || !str.length) {
    return str;
  }
  function isDigit(something) {
    return /[0-9]/.test(something);
  }
  function isAZ(something) {
    return /[A-Za-z]/.test(something);
  }
  function isObj(something) {
    return (
      something && typeof something === "object" && !Array.isArray(something)
    );
  }

  const defaults = {
    padStart: 3,
    overrideRowNum: null,
    returnRangesOnly: false,
    triggerKeywords: ["console.log"],
    extractedLogContentsWereGiven: false,
  };
  const opts = Object.assign(defaults, originalOpts);

  if (
    !opts.padStart ||
    typeof opts.padStart !== "number" ||
    (typeof opts.padStart === "number" && opts.padStart < 0)
  ) {
    opts.padStart = 0;
  }

  const finalIndexesToDelete = new Ranges();

  let i;
  const len = str.length;
  let quotes = null;
  let consoleStartsAt = null;
  let bracketOpensAt = null;
  let currentRow = 1;
  let wasLetterDetected = false;
  let digitStartsAt = null;

  if (opts.padStart && len > 45000) {
    opts.padStart = 4;
  }

  console.log(
    `061 ${`\u001b[${33}m${`str`}\u001b[${39}m`}:\n${JSON.stringify(
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
      currentRow++;
      console.log(
        `086 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} currentRow = ${currentRow}`
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
        `098 \u001b[${31}m${`CLOSING QUOTE DETECTED - WIPE`}\u001b[${39}m`
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
      console.log("117 within opening quotes trap clauses");

      if (str[i] === '"' || str[i] === "'" || str[i] === "`") {
        console.log(`120 clause #1`);
        quotes = {};
        quotes.start = i;
        quotes.type = str[i];
        wasLetterDetected = false;
        console.log(
          `126 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wasLetterDetected`}\u001b[${39}m`} = ${JSON.stringify(
            wasLetterDetected,
            null,
            4
          )}`
        );
        console.log(
          `133 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`quotes`}\u001b[${39}m`} = ${JSON.stringify(
            quotes,
            null,
            4
          )}`
        );
      } else if (opts.extractedLogContentsWereGiven && digitStartsAt === null) {
        if (isDigit(str[i])) {
          console.log(`141 clause #2`);
          // insurance against ANSI color codes, like \u001b[${32}m...
          //                                            ^
          //                                       false digits
          if (str[i - 2] && str[i - 1] === "u" && str[i - 2] === "\\") {
            console.log(`146 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
            break;
          }
          digitStartsAt = i;
          console.log(
            `151 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`digitStartsAt`}\u001b[${39}m`} = ${digitStartsAt}`
          );
        } else {
          console.log(`154 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          break;
        }
      } else if (
        str[i].trim() &&
        str[i] !== "/" &&
        !opts.extractedLogContentsWereGiven
      ) {
        console.log(`162 clause #3`);
        // wipe
        console.log(
          `165 \u001b[${31}m${`A QUOTE EXPECTED HERE SO WIPE`}\u001b[${39}m`
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
        `184 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`digitStartsAt`}\u001b[${39}m`} = ${digitStartsAt}`
      );
    }

    // catch the ending of the digits within console.log:
    if (
      Number.isInteger(digitStartsAt) &&
      (!isDigit(str[i]) || !str[i + 1]) &&
      (i > digitStartsAt || !str[i + 1])
    ) {
      // replace the digits:
      console.log(
        `196 ${`\u001b[${32}m${`THING ABOUT TO BE PUSHED:`}\u001b[${39}m`}`
      );
      console.log(
        `199 ${`\u001b[${33}m${`opts.padStart`}\u001b[${39}m`} = ${JSON.stringify(
          opts.padStart,
          null,
          4
        )}`
      );
      console.log(
        `206 ${`\u001b[${33}m${`padStart(${currentRow} (${typeof currentRow}), ${
          opts.padStart
        } (${typeof opts.padStart}), "0")`}\u001b[${39}m`} = ${JSON.stringify(
          String(currentRow).padStart(opts.padStart, "0"),
          null,
          4
        )}`
      );
      console.log(
        `215 ${`\u001b[${33}m${`currentRow`}\u001b[${39}m`} = ${JSON.stringify(
          currentRow,
          null,
          4
        )}`
      );
      console.log(
        `222 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
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
      finalIndexesToDelete.push(
        digitStartsAt,
        !isDigit(str[i]) ? i : i + 1,
        opts.padStart
          ? String(
              opts.overrideRowNum !== null ? opts.overrideRowNum : currentRow
            ).padStart(opts.padStart, "0")
          : `${opts.overrideRowNum !== null ? opts.overrideRowNum : currentRow}`
      );
      // then, reset:
      digitStartsAt = null;
      console.log(
        `254 ${`\u001b[${33}m${`digitStartsAt`}\u001b[${39}m`} = null`
      );
      // set wasLetterDetected as a decoy to prevent further digit lumps from being edited:
      wasLetterDetected = true;
      console.log(
        `259 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wasLetterDetected`}\u001b[${39}m`} = true`
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
      if (
        str[i - 1] === "\\" &&
        str[i] === "u" &&
        str[i + 1] === "0" &&
        str[i + 2] === "0" &&
        str[i + 3] === "1" &&
        (str[i + 4] === "b" || str[i + 5] === "B") &&
        str[i + 5] === "["
      ) {
        console.log(`291 \u001b[${35}m${`MATCHED`}\u001b[${39}m`);
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
            `316 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`startMarchingForwFrom`}\u001b[${39}m`} = ${startMarchingForwFrom}`
          );
        } else if (
          str[i + 6] === "$" &&
          str[i + 7] === "{" &&
          isDigit(str[i + 8])
        ) {
          startMarchingForwFrom = i + 8;
          console.log(
            `325 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`startMarchingForwFrom`}\u001b[${39}m`} = ${startMarchingForwFrom}`
          );
        }

        console.log(
          `330 FINAL ${`\u001b[${33}m${`startMarchingForwFrom`}\u001b[${39}m`} = ${startMarchingForwFrom}`
        );

        // find out where does this (possibly a sequence) of number(s) end:
        let numbersSequenceEndsAt;
        if (startMarchingForwFrom) {
          console.log(
            `337 \u001b[${36}m${`startMarchingForwFrom`}\u001b[${39}m was set so marching forward`
          );
          for (let y = startMarchingForwFrom; y < len; y++) {
            console.log(`\u001b[${36}m${`str[${y}] = ${str[y]}`}\u001b[${39}m`);
            if (!isDigit(str[y])) {
              numbersSequenceEndsAt = y;
              console.log(`\u001b[${36}m${`not digit, so break`}\u001b[${39}m`);
              break;
            }
          }
          console.log(`347 \u001b[${36}m${`stop marching`}\u001b[${39}m`);
        }

        // answer: at "numbersSequenceEndsAt".
        console.log(
          `352 \u001b[${32}m${`str[${numbersSequenceEndsAt}] = ${str[numbersSequenceEndsAt]}`}\u001b[${39}m`
        );

        // We're at the next character where digits end. That is:

        // console.log(`\u001b[33m 123 zzz \u001b[${39}m`)
        //                       ^
        //                     here, OR

        // console.log(`\u001b[${33}m 123 zzz \u001b[${39}m`)
        //                         ^
        //                       here

        let ansiSequencesLetterMAt;

        if (str[numbersSequenceEndsAt] === "m") {
          // if number follows "m", this is it:
          ansiSequencesLetterMAt = numbersSequenceEndsAt;
        } else if (
          str[numbersSequenceEndsAt] === "}" &&
          str[numbersSequenceEndsAt + 1] === "m"
        ) {
          ansiSequencesLetterMAt = numbersSequenceEndsAt + 1;
        }

        console.log(
          `378 ${`\u001b[${33}m${`ansiSequencesLetterMAt`}\u001b[${39}m`} = ${ansiSequencesLetterMAt};`
        );

        if (!ansiSequencesLetterMAt) {
          // if ANSI closing "m" hasn't been detected yet, bail:
          wasLetterDetected = true;
          continue;
        }

        if (
          str[ansiSequencesLetterMAt + 1] === "$" &&
          str[ansiSequencesLetterMAt + 2] === "{" &&
          str[ansiSequencesLetterMAt + 3] === "`"
        ) {
          i = ansiSequencesLetterMAt + 3;
          console.log(
            `394 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${i}`
          );
          continue;
        }
      }

      wasLetterDetected = true;
      console.log(
        `402 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wasLetterDetected`}\u001b[${39}m`} = true`
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
          `416 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`bracketOpensAt`}\u001b[${39}m`} = ${JSON.stringify(
            bracketOpensAt,
            null,
            4
          )}`
        );
      } else {
        // wipe
        console.log(`424 \u001b[${31}m${`WIPE`}\u001b[${39}m`);
        consoleStartsAt = null;
        digitStartsAt = null;
      }
    }

    // catch console.log
    let caughtKeyword;
    if (
      (isObj(opts) &&
        opts.triggerKeywords &&
        Array.isArray(opts.triggerKeywords) &&
        opts.triggerKeywords.some((keyw) => {
          if (str.startsWith(keyw, i)) {
            caughtKeyword = keyw;
            return true;
          }
        })) ||
      (opts.triggerKeywords !== null &&
        (!Array.isArray(opts.triggerKeywords) ||
          !opts.triggerKeywords.length) &&
        ["console.log"].some((keyw) => {
          if (str.startsWith(keyw, i)) {
            caughtKeyword = keyw;
            return true;
          }
        }))
    ) {
      consoleStartsAt = i + caughtKeyword.length;
      console.log(
        `454 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`consoleStartsAt`}\u001b[${39}m`} = ${consoleStartsAt}`
      );
      // offset the index so we don't traverse twice what was traversed already:
      i = i + caughtKeyword.length - 1;
      console.log(
        `459 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${i}`
      );
      continue;
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
    `483 ${`\u001b[${33}m${`finalIndexesToDelete.current()`}\u001b[${39}m`} = ${JSON.stringify(
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
    console.log(`500`);
    return finalIndexesToDelete.current();
  } else if (finalIndexesToDelete.current()) {
    console.log(`503`);
    return apply(str, finalIndexesToDelete.current());
  }
  console.log(`506`);
  return str;
}

export default fixRowNums;
