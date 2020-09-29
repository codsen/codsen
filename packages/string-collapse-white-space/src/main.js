import apply from "ranges-apply";
import merge from "ranges-merge";
import { matchLeftIncl } from "string-match-left-right";

function collapse(str, originalOpts) {
  console.log(
    `007 ██ string-collapse-whitespace called: str = ${JSON.stringify(
      str,
      null,
      4
    )}; originalOpts = ${JSON.stringify(originalOpts, null, 4)}`
  );

  // f's
  function charCodeBetweenInclusive(character, from, end) {
    return character.charCodeAt(0) >= from && character.charCodeAt(0) <= end;
  }
  function isSpaceOrLeftBracket(character) {
    return (
      typeof character === "string" && (character === "<" || !character.trim())
    );
  }
  if (typeof str !== "string") {
    throw new Error(
      `string-collapse-white-space/collapse(): [THROW_ID_01] The input is not string but ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(
      `string-collapse-white-space/collapse(): [THROW_ID_02] The opts is not a plain object but ${typeof originalOpts}, equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  if (!str.length) {
    return {
      result: "",
      ranges: null,
    };
  }

  const finalIndexesToDelete = [];

  // declare defaults, so we can enforce types later:
  const defaults = {
    trimStart: true, // otherwise, leading whitespace will be collapsed to a single space
    trimEnd: true, // otherwise, trailing whitespace will be collapsed to a single space
    trimLines: false, // activates trim per-line basis
    trimnbsp: false, // non-breaking spaces are trimmed too
    recogniseHTML: true, // collapses whitespace around HTML brackets
    removeEmptyLines: false, // if line trim()'s to an empty string, it's removed
    returnRangesOnly: false, // if on, only ranges array is returned
    limitConsecutiveEmptyLinesTo: 0, // zero lines are allowed (if opts.removeEmptyLines is on)
  };

  // fill any settings with defaults if missing:
  const opts = { ...defaults, ...originalOpts };

  let preliminaryIndexesToDelete;
  if (opts.recogniseHTML) {
    preliminaryIndexesToDelete = [];
  }

  // -----------------------------------------------------------------------------

  let spacesEndAt = null;
  let whiteSpaceEndsAt = null;
  let lineWhiteSpaceEndsAt = null;
  let endingOfTheLine = false;
  let stateWithinTag = false;
  let whiteSpaceWithinTagEndsAt = null;
  let tagMatched = false;
  let tagCanEndHere = false;
  const count = {};
  let bail = false; // bool flag to notify when false positive detected, used in HTML detection
  const resetCounts = (obj) => {
    obj.equalDoubleQuoteCombo = 0;
    obj.equalOnly = 0;
    obj.doubleQuoteOnly = 0;
    obj.spacesBetweenLetterChunks = 0;
    obj.linebreaks = 0;
  };
  let bracketJustFound = false; // dumb state switch, activated by > and terminated by
  // first non-whitespace char

  if (opts.recogniseHTML) {
    resetCounts(count); // initiates the count object, assigning all keys to zero
  }

  let lastLineBreaksLastCharIndex;
  let consecutiveLineBreakCount = 0;

  // looping backwards for better efficiency
  for (let i = str.length; i--; ) {
    console.log(
      `${`\u001b[${36}m${`-----------------------------------------------`}\u001b[${39}m`} str[${`\u001b[${35}m${i}\u001b[${39}m`}] = ${
        str[i].trim() !== ""
          ? str[i]
          : str[i] === "\n"
          ? "\\n"
          : str[i] === "\r"
          ? "\\r"
          : "whitespace"
      }`
    );
    // line break counting
    if (str[i] === "\n" || (str[i] === "\r" && str[i + 1] !== "\n")) {
      consecutiveLineBreakCount += 1;
      console.log(
        `116 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} consecutiveLineBreakCount = ${consecutiveLineBreakCount}`
      );
    } else if (str[i].trim()) {
      consecutiveLineBreakCount = 0;
      console.log(
        `121 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} consecutiveLineBreakCount = ${consecutiveLineBreakCount}`
      );
    }

    //
    // space clauses
    if (str[i] === " ") {
      if (spacesEndAt === null) {
        spacesEndAt = i;
        console.log(
          `131 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`spacesEndAt`}\u001b[${39}m`} = ${spacesEndAt}`
        );
      }
    } else if (spacesEndAt !== null) {
      // it's not a space character
      // if we have a sequence of spaces, this character terminates that sequence
      if (i + 1 !== spacesEndAt) {
        finalIndexesToDelete.push([i + 1, spacesEndAt]);
        console.log(
          `140 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
            i + 1
          }, ${spacesEndAt}]`
        );
      }
      spacesEndAt = null;
      console.log(
        `147 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`spacesEndAt`}\u001b[${39}m`} = ${spacesEndAt}`
      );
    }

    // white space clauses
    if (
      str[i].trim() === "" &&
      ((!opts.trimnbsp && str[i] !== "\xa0") || opts.trimnbsp)
    ) {
      // it's some sort of white space character, but not a non-breaking space
      if (whiteSpaceEndsAt === null) {
        whiteSpaceEndsAt = i;
        console.log(
          `160 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whiteSpaceEndsAt`}\u001b[${39}m`} = ${whiteSpaceEndsAt}`
        );
      }
      // line trimming:
      if (str[i] !== "\n" && str[i] !== "\r" && lineWhiteSpaceEndsAt === null) {
        lineWhiteSpaceEndsAt = i + 1;
        console.log(
          `167 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lineWhiteSpaceEndsAt`}\u001b[${39}m`} = ${lineWhiteSpaceEndsAt}`
        );
      }

      // per-line trimming:
      if (str[i] === "\n" || str[i] === "\r") {
        if (lineWhiteSpaceEndsAt !== null) {
          if (opts.trimLines) {
            console.log(
              `176 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                i + 1
              }, ${lineWhiteSpaceEndsAt}]`
            );
            finalIndexesToDelete.push([i + 1, lineWhiteSpaceEndsAt]);
          }
          lineWhiteSpaceEndsAt = null;
          console.log(
            `184 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lineWhiteSpaceEndsAt`}\u001b[${39}m`} = ${lineWhiteSpaceEndsAt}`
          );
        }
        if (str[i - 1] !== "\n" && str[i - 1] !== "\r") {
          lineWhiteSpaceEndsAt = i;
          endingOfTheLine = true;
          console.log(
            `191 ${`\u001b[${33}m${`lineWhiteSpaceEndsAt`}\u001b[${39}m`} = ${lineWhiteSpaceEndsAt}`
          );
          console.log(
            `194 ${`\u001b[${33}m${`endingOfTheLine`}\u001b[${39}m`} = ${endingOfTheLine}`
          );
        }
      }

      // empty line deletion:
      // PS. remember we're traversing backwards, so CRLF indexes go in order LF, CR
      if (str[i] === "\n" || (str[i] === "\r" && str[i + 1] !== "\n")) {
        const sliceFrom = i + 1;
        console.log(
          `204 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${sliceFrom}`
        );
        console.log(
          `207 ${`\u001b[${33}m${`lastLineBreaksLastCharIndex`}\u001b[${39}m`} = ${JSON.stringify(
            lastLineBreaksLastCharIndex,
            null,
            4
          )}`
        );
        let sliceTo;

        if (Number.isInteger(lastLineBreaksLastCharIndex)) {
          sliceTo = lastLineBreaksLastCharIndex + 1;
          console.log(
            `218 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`sliceTo`}\u001b[${39}m`} = ${sliceTo}`
          );
          console.log(
            `221 \u001b[${33}m [${sliceFrom}, ${sliceTo}] >>>${JSON.stringify(
              str.slice(sliceFrom, sliceTo),
              null,
              4
            )}<<<\u001b[${39}m`
          );
          if (
            opts.removeEmptyLines &&
            lastLineBreaksLastCharIndex !== undefined &&
            str.slice(sliceFrom, sliceTo).trim() === ""
          ) {
            // push only if limit has been reached
            if (
              consecutiveLineBreakCount >
              opts.limitConsecutiveEmptyLinesTo + 1
            ) {
              console.log(
                `238 consecutiveLineBreakCount=${consecutiveLineBreakCount} > opts.limitConsecutiveEmptyLinesTo + 1=${
                  opts.limitConsecutiveEmptyLinesTo + 1
                }`
              );
              finalIndexesToDelete.push([
                i + 1,
                lastLineBreaksLastCharIndex + 1,
              ]);
              console.log(
                `247 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} \u001b[${33}m${`[i=${
                  i + 1
                }, lastLineBreaksLastCharIndex + 1=${
                  lastLineBreaksLastCharIndex + 1
                }]`}\u001b[${39}m\n`
              );
            } else {
              console.log(
                `255 DIDN'T PUSH, because consecutiveLineBreakCount=${consecutiveLineBreakCount} <= opts.limitConsecutiveEmptyLinesTo + 1=${
                  opts.limitConsecutiveEmptyLinesTo + 1
                }`
              );
            }
          }
        }
        lastLineBreaksLastCharIndex = i;
        console.log(
          `264 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${35}m${`lastLineBreaksLastCharIndex`}\u001b[${39}m`} = ${lastLineBreaksLastCharIndex}`
        );
      }
    } else {
      // it's not white space character
      if (whiteSpaceEndsAt !== null) {
        if (
          i + 1 !== whiteSpaceEndsAt + 1 &&
          whiteSpaceEndsAt === str.length - 1 &&
          opts.trimEnd
        ) {
          console.log(
            `276 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i + 1}, ${
              whiteSpaceEndsAt + 1
            }]`
          );
          finalIndexesToDelete.push([i + 1, whiteSpaceEndsAt + 1]);
        }
        whiteSpaceEndsAt = null;
        console.log(
          `284 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whiteSpaceEndsAt`}\u001b[${39}m`} = ${whiteSpaceEndsAt}`
        );
      }

      // encountered letter resets line trim counters:
      if (lineWhiteSpaceEndsAt !== null) {
        if (endingOfTheLine && opts.trimLines) {
          endingOfTheLine = false; // apply either way
          console.log(
            `293 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`endingOfTheLine`}\u001b[${39}m`} = ${endingOfTheLine}`
          );
          if (lineWhiteSpaceEndsAt !== i + 1) {
            console.log(
              `297 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                i + 1
              }, ${lineWhiteSpaceEndsAt}]`
            );
            finalIndexesToDelete.push([i + 1, lineWhiteSpaceEndsAt]);
          }
        }
        lineWhiteSpaceEndsAt = null;
        console.log(
          `306 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lineWhiteSpaceEndsAt`}\u001b[${39}m`} = ${lineWhiteSpaceEndsAt}`
        );
      }
    }

    // this chunk could be ported to the (str[i].trim() === '') clause for example,
    // but it depends on the flags that aforementioned's "else" is setting,
    // (whiteSpaceEndsAt !== null),
    // therefore it's less code if we put zero index clauses here.
    if (i === 0) {
      if (whiteSpaceEndsAt !== null && opts.trimStart) {
        finalIndexesToDelete.push([0, whiteSpaceEndsAt + 1]);
        console.log(`318 PUSH [0, ${whiteSpaceEndsAt + 1}]`);
      } else if (spacesEndAt !== null) {
        finalIndexesToDelete.push([i + 1, spacesEndAt + 1]);
        console.log(`321 PUSH [${i + 1}, ${spacesEndAt + 1}]`);
      }
    }

    if (opts.recogniseHTML) {
      if (str[i].trim() === "") {
        // W H I T E S P A C E
        if (stateWithinTag && !tagCanEndHere) {
          tagCanEndHere = true;
          console.log(
            `331 SET ${`\u001b[${33}m${`tagCanEndHere`}\u001b[${39}m`} = ${tagCanEndHere}`
          );
        }
        if (tagMatched && !whiteSpaceWithinTagEndsAt) {
          // cases where there's space between opening bracket and a confirmed HTML tag name
          whiteSpaceWithinTagEndsAt = i + 1;
          console.log(
            `338 SET ${`\u001b[${33}m${`whiteSpaceWithinTagEndsAt`}\u001b[${39}m`} = ${whiteSpaceWithinTagEndsAt}`
          );
        }
        if (
          tagMatched &&
          str[i - 1] !== undefined &&
          str[i - 1].trim() !== "" &&
          str[i - 1] !== "<" &&
          str[i - 1] !== "/"
        ) {
          // bail, something's wrong, there's non-whitespace character to the left of a
          // recognised HTML tag. For example: "< zzz div ...>"
          tagMatched = false;
          stateWithinTag = false;
          console.log("352 SET tagMatched = false; stateWithinTag = false;");

          preliminaryIndexesToDelete = [];
          console.log("355 WIPE preliminaryIndexesToDelete");
        }
        if (
          !bail &&
          !bracketJustFound &&
          str[i].trim() === "" &&
          str[i - 1] !== "<" &&
          (str[i + 1] === undefined ||
            (str[i + 1].trim() !== "" && str[i + 1].trim() !== "/"))
        ) {
          if (
            str[i - 1] === undefined ||
            (str[i - 1].trim() !== "" &&
              str[i - 1] !== "<" &&
              str[i - 1] !== "/")
          ) {
            console.log(
              `372: count.spacesBetweenLetterChunks was ${count.spacesBetweenLetterChunks}`
            );
            count.spacesBetweenLetterChunks += 1;
            console.log(
              `376: count.spacesBetweenLetterChunks became ${count.spacesBetweenLetterChunks}`
            );
          } else {
            // loop backwards and check, is the first non-space char being "<".
            console.log(
              `381 ${`\u001b[${31}m${`LOOP BACKWARDS`}\u001b[${39}m`}`
            );
            for (let y = i - 1; y--; ) {
              console.log(
                `385 ${`\u001b[${31}m ======= ${str[y]} ======= \u001b[${39}m`}`
              );
              if (str[y].trim() !== "") {
                if (str[y] === "<") {
                  bail = true;
                } else if (str[y] !== "/") {
                  console.log(
                    `392 ${`\u001b[${31}m${`██`}\u001b[${39}m`} count.spacesBetweenLetterChunks was ${
                      count.spacesBetweenLetterChunks
                    }`
                  );
                  count.spacesBetweenLetterChunks += i - y;
                  console.log(
                    `398 ${`\u001b[${31}m${`██`}\u001b[${39}m`} count.spacesBetweenLetterChunks became ${
                      count.spacesBetweenLetterChunks
                    }`
                  );
                }
                console.log(`403 ${`\u001b[${31}m${`██ BREAK`}\u001b[${39}m`}`);
                break;
              }
            }
            console.log(`407 ${`\u001b[${31}mEND OF A LOOP\u001b[${39}m`}`);
          }
        }
      } else {
        // N O T   W H I T E S P A C E

        // =========
        // count equal characters and double quotes
        if (str[i] === "=") {
          count.equalOnly += 1;
          console.log(
            `418 SET ${`\u001b[${33}m${`count.equalOnly`}\u001b[${39}m`} = ${
              count.equalOnly
            }`
          );
          if (str[i + 1] === '"') {
            count.equalDoubleQuoteCombo += 1;
            console.log(
              `425 SET ${`\u001b[${33}m${`count.equalDoubleQuoteCombo`}\u001b[${39}m`} = ${
                count.equalDoubleQuoteCombo
              }`
            );
          }
        } else if (str[i] === '"') {
          count.doubleQuoteOnly += 1;
          console.log(
            `433 SET ${`\u001b[${33}m${`count.doubleQuoteOnly`}\u001b[${39}m`} = ${
              count.doubleQuoteOnly
            }`
          );
        }

        // if the dumb flag is on, turn it off.
        // first non-whitespace character deactivates it.
        if (bracketJustFound) {
          bracketJustFound = false;
          console.log(
            `444 SET ${`\u001b[${33}m${`bracketJustFound`}\u001b[${39}m`} = ${bracketJustFound}`
          );
        }

        // =========
        // terminate existing range, push the captured range into preliminaries' array
        if (whiteSpaceWithinTagEndsAt !== null) {
          console.log(`451 PUSH [${i + 1}, ${whiteSpaceWithinTagEndsAt}]`);
          preliminaryIndexesToDelete.push([i + 1, whiteSpaceWithinTagEndsAt]);
          // finalIndexesToDelete.push([i + 1, whiteSpaceWithinTagEndsAt])
          whiteSpaceWithinTagEndsAt = null;
          console.log(
            `456 SET ${`\u001b[${33}m${`whiteSpaceWithinTagEndsAt`}\u001b[${39}m`} = ${whiteSpaceWithinTagEndsAt}`
          );
        }

        // =========
        // html detection bits:
        // mind you, we're iterating backwards, so tag starts with ">"
        if (str[i] === ">") {
          // first, reset the count obj.
          resetCounts(count);
          console.log(
            `467 REST COUNT: NOW, count = ${JSON.stringify(count, null, 0)}`
          );
          // set dumb bracket flag to on
          bracketJustFound = true;
          console.log(
            `472 SET ${`\u001b[${33}m${`bracketJustFound`}\u001b[${39}m`} = ${bracketJustFound}`
          );
          // two cases:
          if (stateWithinTag) {
            // this is bad, another closing bracket
            preliminaryIndexesToDelete = [];
            console.log("478 WIPE preliminaryIndexesToDelete");
          } else {
            stateWithinTag = true;
            console.log(
              `482 SET ${`\u001b[${33}m${`stateWithinTag`}\u001b[${39}m`} = ${stateWithinTag}`
            );
            if (
              str[i - 1] !== undefined &&
              str[i - 1].trim() === "" &&
              !whiteSpaceWithinTagEndsAt
            ) {
              whiteSpaceWithinTagEndsAt = i;
              console.log(
                `491 SET ${`\u001b[${33}m${`whiteSpaceWithinTagEndsAt`}\u001b[${39}m`} = ${whiteSpaceWithinTagEndsAt}`
              );
            }
          }
          if (!tagCanEndHere) {
            tagCanEndHere = true;
            console.log(
              `498 SET ${`\u001b[${33}m${`tagCanEndHere`}\u001b[${39}m`} = ${tagCanEndHere}`
            );
            // tag name might be ending with bracket: <br>
          }
        } else if (str[i] === "<") {
          console.log(
            `504 preliminaryIndexesToDelete = ${JSON.stringify(
              preliminaryIndexesToDelete,
              null,
              4
            )}`
          );
          // the rest of calculations:
          stateWithinTag = false;
          console.log(
            `513 SET ${`\u001b[${33}m${`stateWithinTag`}\u001b[${39}m`} = ${stateWithinTag}`
          );
          // reset bail flag
          if (bail) {
            bail = false;
            console.log(
              `519 SET ${`\u001b[${33}m${`bail`}\u001b[${39}m`} = ${bail}`
            );
          }
          // bail clause, when false positives are detected, such as "a < b and c > d" -
          // the part: < b and c > looks really deceptive, b is valid tag name...
          // this bail will detect such cases, freak out and bail, wiping preliminary ranges.
          if (
            count.spacesBetweenLetterChunks > 0 &&
            count.equalDoubleQuoteCombo === 0
          ) {
            tagMatched = false;
            console.log(
              `531 SET ${`\u001b[${33}m${`tagMatched`}\u001b[${39}m`} = ${tagMatched}`
            );
            preliminaryIndexesToDelete = [];
            console.log("534 WIPE preliminaryIndexesToDelete");
          }
          // if somehow we're within a tag and there are already provisional ranges
          if (tagMatched) {
            if (preliminaryIndexesToDelete.length) {
              preliminaryIndexesToDelete.forEach(([rangeStart, rangeEnd]) =>
                finalIndexesToDelete.push([rangeStart, rangeEnd])
              );
            }
            tagMatched = false;
            console.log(
              `545 SET ${`\u001b[${33}m${`tagMatched`}\u001b[${39}m`} = ${tagMatched}`
            );
          }
          // finally, reset the count obj.
          resetCounts(count);
          console.log(
            `551 SET ${`\u001b[${33}m${`count`}\u001b[${39}m`} = ${JSON.stringify(
              count,
              null,
              0
            )}`
          );
        } else if (stateWithinTag && str[i] === "/") {
          whiteSpaceWithinTagEndsAt = i;
          console.log(
            `560 SET ${`\u001b[${33}m${`whiteSpaceWithinTagEndsAt`}\u001b[${39}m`} = ${whiteSpaceWithinTagEndsAt}`
          );
        } else if (stateWithinTag && !tagMatched) {
          if (tagCanEndHere && charCodeBetweenInclusive(str[i], 97, 122)) {
            // if letters a-z, inclusive:
            // ---------------------------------------------------------------
            tagCanEndHere = false;
            console.log(
              `568 SET ${`\u001b[${33}m${`tagCanEndHere`}\u001b[${39}m`} = ${tagCanEndHere}`
            );
            if (charCodeBetweenInclusive(str[i], 97, 110)) {
              // if letters a-n, inclusive:
              if (
                (str[i] === "a" &&
                  ((str[i - 1] === "e" &&
                    matchLeftIncl(str, i, ["area", "textarea"], {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    })) ||
                    (str[i - 1] === "t" &&
                      matchLeftIncl(str, i, ["data", "meta"], {
                        cb: isSpaceOrLeftBracket,
                        i: true,
                      })) ||
                    isSpaceOrLeftBracket(str[i - 1]))) ||
                (str[i] === "b" &&
                  (matchLeftIncl(str, i, ["rb", "sub"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }) ||
                    isSpaceOrLeftBracket(str[i - 1]))) ||
                (str[i] === "c" &&
                  matchLeftIncl(str, i, "rtc", {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                (str[i] === "d" &&
                  ((str[i - 1] === "a" &&
                    matchLeftIncl(str, i, ["head", "thead"], {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    })) ||
                    matchLeftIncl(
                      str,
                      i,
                      ["kbd", "dd", "embed", "legend", "td"],
                      {
                        cb: isSpaceOrLeftBracket,
                        i: true,
                      }
                    ))) ||
                (str[i] === "e" &&
                  (matchLeftIncl(str, i, "source", {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }) ||
                    (str[i - 1] === "d" &&
                      matchLeftIncl(str, i, ["aside", "code"], {
                        cb: isSpaceOrLeftBracket,
                        i: true,
                      })) ||
                    (str[i - 1] === "l" &&
                      matchLeftIncl(
                        str,
                        i,
                        ["table", "article", "title", "style"],
                        {
                          cb: isSpaceOrLeftBracket,
                          i: true,
                        }
                      )) ||
                    (str[i - 1] === "m" &&
                      matchLeftIncl(str, i, ["iframe", "time"], {
                        cb: isSpaceOrLeftBracket,
                        i: true,
                      })) ||
                    (str[i - 1] === "r" &&
                      matchLeftIncl(str, i, ["pre", "figure", "picture"], {
                        cb: isSpaceOrLeftBracket,
                        i: true,
                      })) ||
                    (str[i - 1] === "t" &&
                      matchLeftIncl(
                        str,
                        i,
                        ["template", "cite", "blockquote"],
                        {
                          cb: isSpaceOrLeftBracket,
                          i: true,
                        }
                      )) ||
                    matchLeftIncl(str, i, "base", {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    }) ||
                    isSpaceOrLeftBracket(str[i - 1]))) ||
                (str[i] === "g" &&
                  matchLeftIncl(str, i, ["img", "strong", "dialog", "svg"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                (str[i] === "h" &&
                  matchLeftIncl(str, i, ["th", "math"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                (str[i] === "i" &&
                  (matchLeftIncl(str, i, ["bdi", "li"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }) ||
                    isSpaceOrLeftBracket(str[i - 1]))) ||
                (str[i] === "k" &&
                  matchLeftIncl(str, i, ["track", "link", "mark"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                (str[i] === "l" &&
                  matchLeftIncl(
                    str,
                    i,
                    ["html", "ol", "ul", "dl", "label", "del", "small", "col"],
                    {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    }
                  )) ||
                (str[i] === "m" &&
                  matchLeftIncl(str, i, ["param", "em", "menuitem", "form"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                (str[i] === "n" &&
                  ((str[i - 1] === "o" &&
                    matchLeftIncl(
                      str,
                      i,
                      ["section", "caption", "figcaption", "option", "button"],
                      {
                        cb: isSpaceOrLeftBracket,
                        i: true,
                      }
                    )) ||
                    matchLeftIncl(str, i, ["span", "keygen", "dfn", "main"], {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    })))
              ) {
                tagMatched = true;
                console.log(
                  `710 SET ${`\u001b[${33}m${`tagMatched`}\u001b[${39}m`} = ${tagMatched}`
                );
              }
            }
            // o-z, inclusive. codes 111-122, inclusive
            else if (
              (str[i] === "o" &&
                matchLeftIncl(str, i, ["bdo", "video", "audio"], {
                  cb: isSpaceOrLeftBracket,
                  i: true,
                })) ||
              (str[i] === "p" &&
                (isSpaceOrLeftBracket(str[i - 1]) ||
                  (str[i - 1] === "u" &&
                    matchLeftIncl(
                      str,
                      i,
                      ["hgroup", "colgroup", "optgroup", "sup"],
                      {
                        cb: isSpaceOrLeftBracket,
                        i: true,
                      }
                    )) ||
                  matchLeftIncl(str, i, ["map", "samp", "rp"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }))) ||
              (str[i] === "q" && isSpaceOrLeftBracket(str[i - 1])) ||
              (str[i] === "r" &&
                ((str[i - 1] === "e" &&
                  matchLeftIncl(str, i, ["header", "meter", "footer"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                  matchLeftIncl(
                    str,
                    i,
                    ["var", "br", "abbr", "wbr", "hr", "tr"],
                    {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    }
                  ))) ||
              (str[i] === "s" &&
                ((str[i - 1] === "s" &&
                  matchLeftIncl(str, i, ["address", "progress"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                  matchLeftIncl(str, i, ["canvas", "details", "ins"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }) ||
                  isSpaceOrLeftBracket(str[i - 1]))) ||
              (str[i] === "t" &&
                ((str[i - 1] === "c" &&
                  matchLeftIncl(str, i, ["object", "select"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  })) ||
                  (str[i - 1] === "o" &&
                    matchLeftIncl(str, i, ["slot", "tfoot"], {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    })) ||
                  (str[i - 1] === "p" &&
                    matchLeftIncl(str, i, ["script", "noscript"], {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    })) ||
                  (str[i - 1] === "u" &&
                    matchLeftIncl(str, i, ["input", "output"], {
                      cb: isSpaceOrLeftBracket,
                      i: true,
                    })) ||
                  matchLeftIncl(str, i, ["fieldset", "rt", "datalist", "dt"], {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }))) ||
              (str[i] === "u" &&
                (isSpaceOrLeftBracket(str[i - 1]) ||
                  matchLeftIncl(str, i, "menu", {
                    cb: isSpaceOrLeftBracket,
                    i: true,
                  }))) ||
              (str[i] === "v" &&
                matchLeftIncl(str, i, ["nav", "div"], {
                  cb: isSpaceOrLeftBracket,
                  i: true,
                })) ||
              (str[i] === "y" &&
                matchLeftIncl(str, i, ["ruby", "body", "tbody", "summary"], {
                  cb: isSpaceOrLeftBracket,
                  i: true,
                }))
            ) {
              tagMatched = true;
              console.log(
                `808 SET ${`\u001b[${33}m${`tagMatched`}\u001b[${39}m`} = ${tagMatched}`
              );
            }

            // ---------------------------------------------------------------
          } else if (
            tagCanEndHere &&
            charCodeBetweenInclusive(str[i], 49, 54)
          ) {
            // if digits 1-6
            tagCanEndHere = false;
            console.log(
              `820 SET ${`\u001b[${33}m${`tagCanEndHere`}\u001b[${39}m`} = ${tagCanEndHere}`
            );
            if (
              str[i - 1] === "h" &&
              (str[i - 2] === "<" || str[i - 2].trim() === "")
            ) {
              tagMatched = true;
              console.log(
                `828 SET ${`\u001b[${33}m${`tagMatched`}\u001b[${39}m`} = ${tagMatched}`
              );
            }
          } else if (str[i] === "=" || str[i] === '"') {
            tagCanEndHere = false;
            console.log(
              `834 SET ${`\u001b[${33}m${`tagCanEndHere`}\u001b[${39}m`} = ${`\u001b[${35}m${tagCanEndHere}\u001b[${39}m`}`
            );
          }
        }
      }
    }

    console.log(`\u001b[${90}m${`============================`}\u001b[${39}m`);
    console.log(
      `\u001b[${36}m${`spacesEndAt`}\u001b[${39}m = ${spacesEndAt};
\u001b[${36}m${`whiteSpaceEndsAt`}\u001b[${39}m = ${whiteSpaceEndsAt};
\u001b[${36}m${`lineWhiteSpaceEndsAt`}\u001b[${39}m = ${lineWhiteSpaceEndsAt};
\u001b[${36}m${`endingOfTheLine`}\u001b[${39}m = ${endingOfTheLine};
\u001b[${36}m${`consecutiveLineBreakCount`}\u001b[${39}m = ${consecutiveLineBreakCount}`
    );
    console.log(
      `\n\u001b[${36}m${`stateWithinTag`}\u001b[${39}m = ${stateWithinTag};
\u001b[${36}m${`whiteSpaceWithinTagEndsAt`}\u001b[${39}m = ${whiteSpaceWithinTagEndsAt};
\u001b[${36}m${`tagMatched`}\u001b[${39}m = ${tagMatched};
\u001b[${36}m${`tagCanEndHere`}\u001b[${39}m = ${tagCanEndHere}`
    );
  }

  return {
    result: finalIndexesToDelete.length
      ? apply(str, finalIndexesToDelete)
      : str,
    ranges: finalIndexesToDelete.length ? merge(finalIndexesToDelete) : null,
  };
}

export default collapse;
