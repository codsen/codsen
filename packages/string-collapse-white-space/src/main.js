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

  const defaults = {
    trimStart: true, // otherwise, leading whitespace will be collapsed to a single space
    trimEnd: true, // otherwise, trailing whitespace will be collapsed to a single space
    trimLines: false, // activates trim per-line basis
    trimnbsp: false, // non-breaking spaces are trimmed too
    recogniseHTML: true, // collapses whitespace around HTML brackets
    removeEmptyLines: false, // if line trim()'s to an empty string, it's removed
    limitConsecutiveEmptyLinesTo: 0, // zero lines are allowed (if opts.removeEmptyLines is on),
    rangesOffset: 0, // add this number to all range indexes
    enforceSpacesOnly: false, // nothing else than space allowed (linebreaks not touched)
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
      `${`\u001b[${36}m${`-----------------------------------------------`}\u001b[${39}m`} str[${`\u001b[${35}m${i}\u001b[${39}m`}] = ${JSON.stringify(
        str[i],
        null,
        4
      )}`
    );
    // line break counting
    if (str[i] === "\n" || (str[i] === "\r" && str[i + 1] !== "\n")) {
      consecutiveLineBreakCount += 1;
      console.log(
        `112 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} consecutiveLineBreakCount = ${consecutiveLineBreakCount}`
      );
    } else if (consecutiveLineBreakCount && str[i].trim()) {
      consecutiveLineBreakCount = 0;
      console.log(
        `117 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} consecutiveLineBreakCount = ${consecutiveLineBreakCount}`
      );
    }

    //
    // space clauses
    if (!opts.enforceSpacesOnly && str[i] === " ") {
      if (spacesEndAt === null) {
        spacesEndAt = i;
        console.log(
          `127 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`spacesEndAt`}\u001b[${39}m`} = ${spacesEndAt}`
        );
      }
    } else if (!opts.enforceSpacesOnly && spacesEndAt !== null) {
      // it's not a space character
      // if we have a sequence of spaces, this character terminates that sequence
      if (i + 1 !== spacesEndAt) {
        finalIndexesToDelete.push([i + 1, spacesEndAt]);
        console.log(
          `136 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
            i + 1
          }, ${spacesEndAt}]`
        );
      }
      spacesEndAt = null;
      console.log(
        `143 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`spacesEndAt`}\u001b[${39}m`} = ${spacesEndAt}`
      );
    }

    // white space clauses
    if (str[i].trim() === "" && (opts.trimnbsp || str[i] !== "\xa0")) {
      console.log(`149 it's a whitespace character, suitable for collapsing`);
      if (whiteSpaceEndsAt === null) {
        whiteSpaceEndsAt = i;
        console.log(
          `153 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whiteSpaceEndsAt`}\u001b[${39}m`} = ${whiteSpaceEndsAt}`
        );
      }
      // line trimming:
      if (str[i] !== "\n" && str[i] !== "\r" && lineWhiteSpaceEndsAt === null) {
        lineWhiteSpaceEndsAt = i + 1;
        console.log(
          `160 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lineWhiteSpaceEndsAt`}\u001b[${39}m`} = ${lineWhiteSpaceEndsAt}`
        );
      }

      // per-line trimming:
      if (str[i] === "\n" || str[i] === "\r") {
        if (lineWhiteSpaceEndsAt !== null) {
          if (opts.trimLines) {
            console.log(
              `169 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                i + 1
              }, ${lineWhiteSpaceEndsAt}]`
            );
            finalIndexesToDelete.push([i + 1, lineWhiteSpaceEndsAt]);
          }
          lineWhiteSpaceEndsAt = null;
          console.log(
            `177 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lineWhiteSpaceEndsAt`}\u001b[${39}m`} = ${lineWhiteSpaceEndsAt}`
          );
        }
        if (str[i - 1] !== "\n" && str[i - 1] !== "\r") {
          lineWhiteSpaceEndsAt = i;
          endingOfTheLine = true;
          console.log(
            `184 ${`\u001b[${33}m${`lineWhiteSpaceEndsAt`}\u001b[${39}m`} = ${lineWhiteSpaceEndsAt}`
          );
          console.log(
            `187 ${`\u001b[${33}m${`endingOfTheLine`}\u001b[${39}m`} = ${endingOfTheLine}`
          );
        }
      }

      // empty line deletion:
      // PS. remember we're traversing backwards, so CRLF indexes go in order LF, CR
      if (str[i] === "\n" || (str[i] === "\r" && str[i + 1] !== "\n")) {
        const sliceFrom = i + 1;
        console.log(
          `197 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${sliceFrom}`
        );
        console.log(
          `200 ${`\u001b[${33}m${`lastLineBreaksLastCharIndex`}\u001b[${39}m`} = ${JSON.stringify(
            lastLineBreaksLastCharIndex,
            null,
            4
          )}`
        );
        let sliceTo;

        if (Number.isInteger(lastLineBreaksLastCharIndex)) {
          sliceTo = lastLineBreaksLastCharIndex + 1;
          console.log(
            `211 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`sliceTo`}\u001b[${39}m`} = ${sliceTo}`
          );
          console.log(
            `214 \u001b[${33}m [${sliceFrom}, ${sliceTo}] >>>${JSON.stringify(
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
                `231 consecutiveLineBreakCount=${consecutiveLineBreakCount} > opts.limitConsecutiveEmptyLinesTo + 1=${
                  opts.limitConsecutiveEmptyLinesTo + 1
                }`
              );
              finalIndexesToDelete.push([
                i + 1,
                lastLineBreaksLastCharIndex + 1,
              ]);
              console.log(
                `240 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} \u001b[${33}m${`[i=${
                  i + 1
                }, lastLineBreaksLastCharIndex + 1=${
                  lastLineBreaksLastCharIndex + 1
                }]`}\u001b[${39}m\n`
              );
            } else {
              console.log(
                `248 DIDN'T PUSH, because consecutiveLineBreakCount=${consecutiveLineBreakCount} <= opts.limitConsecutiveEmptyLinesTo + 1=${
                  opts.limitConsecutiveEmptyLinesTo + 1
                }`
              );
            }
          }
        }
        lastLineBreaksLastCharIndex = i;
        console.log(
          `257 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${35}m${`lastLineBreaksLastCharIndex`}\u001b[${39}m`} = ${lastLineBreaksLastCharIndex}`
        );
      }
    } else {
      console.log(`261 it's not white space character`);
      if (whiteSpaceEndsAt !== null) {
        if (
          // the chunk has some length
          i + 1 !== whiteSpaceEndsAt + 1 &&
          // EITHER it's ending whitespace, which we trim whole
          whiteSpaceEndsAt === str.length - 1 &&
          opts.trimEnd
        ) {
          console.log(
            `271 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i + 1}, ${
              whiteSpaceEndsAt + 1
            }]`
          );
          finalIndexesToDelete.push([i + 1, whiteSpaceEndsAt + 1]);
        } else if (
          // the chunk has some length
          i + 1 !== whiteSpaceEndsAt + 1 &&
          // the chunk is not a single linebreak
          str[i + 1] !== "\r" &&
          str[i + 1] !== "\n" &&
          str[whiteSpaceEndsAt] !== "\r" &&
          str[whiteSpaceEndsAt] !== "\n" &&
          // OR opts.enforceSpacesOnly is on
          opts.enforceSpacesOnly &&
          // EITHER length is more than 1
          (i + 1 < whiteSpaceEndsAt ||
            // OR (length is one but) it's not a space
            str[i + 1] !== " ")
        ) {
          console.log(
            `292 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${35}m${`[${
              i + 1
            }, ${whiteSpaceEndsAt + 1}]`}\u001b[${39}m`}`
          );
          finalIndexesToDelete.push([i + 1, whiteSpaceEndsAt + 1, " "]);
        }
        whiteSpaceEndsAt = null;
        console.log(
          `300 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whiteSpaceEndsAt`}\u001b[${39}m`} = ${whiteSpaceEndsAt}`
        );
      }

      // encountered letter resets line trim counters:
      if (lineWhiteSpaceEndsAt !== null) {
        if (endingOfTheLine && opts.trimLines) {
          endingOfTheLine = false; // apply either way
          console.log(
            `309 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`endingOfTheLine`}\u001b[${39}m`} = ${endingOfTheLine}`
          );
          if (lineWhiteSpaceEndsAt !== i + 1) {
            console.log(
              `313 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${35}m${`[${
                i + 1
              }, ${lineWhiteSpaceEndsAt}]`}\u001b[${39}m`}`
            );
            finalIndexesToDelete.push([i + 1, lineWhiteSpaceEndsAt]);
          }
        }
        lineWhiteSpaceEndsAt = null;
        console.log(
          `322 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lineWhiteSpaceEndsAt`}\u001b[${39}m`} = ${lineWhiteSpaceEndsAt}`
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
        console.log(`334 PUSH [0, ${whiteSpaceEndsAt + 1}]`);
      } else if (spacesEndAt !== null) {
        finalIndexesToDelete.push([i + 1, spacesEndAt + 1]);
        console.log(`337 PUSH [${i + 1}, ${spacesEndAt + 1}]`);
      }
    }

    if (opts.recogniseHTML) {
      if (str[i].trim() === "") {
        // W H I T E S P A C E
        if (stateWithinTag && !tagCanEndHere) {
          tagCanEndHere = true;
          console.log(
            `347 SET ${`\u001b[${33}m${`tagCanEndHere`}\u001b[${39}m`} = ${tagCanEndHere}`
          );
        }
        if (tagMatched && !whiteSpaceWithinTagEndsAt) {
          // cases where there's space between opening bracket and a confirmed HTML tag name
          whiteSpaceWithinTagEndsAt = i + 1;
          console.log(
            `354 SET ${`\u001b[${33}m${`whiteSpaceWithinTagEndsAt`}\u001b[${39}m`} = ${whiteSpaceWithinTagEndsAt}`
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
          console.log("368 SET tagMatched = false; stateWithinTag = false;");

          preliminaryIndexesToDelete = [];
          console.log("371 WIPE preliminaryIndexesToDelete");
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
              `388: count.spacesBetweenLetterChunks was ${count.spacesBetweenLetterChunks}`
            );
            count.spacesBetweenLetterChunks += 1;
            console.log(
              `392: count.spacesBetweenLetterChunks became ${count.spacesBetweenLetterChunks}`
            );
          } else {
            // loop backwards and check, is the first non-space char being "<".
            console.log(
              `397 ${`\u001b[${31}m${`LOOP BACKWARDS`}\u001b[${39}m`}`
            );
            for (let y = i - 1; y--; ) {
              console.log(
                `401 ${`\u001b[${31}m ======= ${str[y]} ======= \u001b[${39}m`}`
              );
              if (str[y].trim() !== "") {
                if (str[y] === "<") {
                  bail = true;
                } else if (str[y] !== "/") {
                  console.log(
                    `408 ${`\u001b[${31}m${`██`}\u001b[${39}m`} count.spacesBetweenLetterChunks was ${
                      count.spacesBetweenLetterChunks
                    }`
                  );
                  count.spacesBetweenLetterChunks += i - y;
                  console.log(
                    `414 ${`\u001b[${31}m${`██`}\u001b[${39}m`} count.spacesBetweenLetterChunks became ${
                      count.spacesBetweenLetterChunks
                    }`
                  );
                }
                console.log(`419 ${`\u001b[${31}m${`██ BREAK`}\u001b[${39}m`}`);
                break;
              }
            }
            console.log(`423 ${`\u001b[${31}mEND OF A LOOP\u001b[${39}m`}`);
          }
        }
      } else {
        // N O T   W H I T E S P A C E

        // =========
        // count equal characters and double quotes
        if (str[i] === "=") {
          count.equalOnly += 1;
          console.log(
            `434 SET ${`\u001b[${33}m${`count.equalOnly`}\u001b[${39}m`} = ${
              count.equalOnly
            }`
          );
          if (str[i + 1] === '"') {
            count.equalDoubleQuoteCombo += 1;
            console.log(
              `441 SET ${`\u001b[${33}m${`count.equalDoubleQuoteCombo`}\u001b[${39}m`} = ${
                count.equalDoubleQuoteCombo
              }`
            );
          }
        } else if (str[i] === '"') {
          count.doubleQuoteOnly += 1;
          console.log(
            `449 SET ${`\u001b[${33}m${`count.doubleQuoteOnly`}\u001b[${39}m`} = ${
              count.doubleQuoteOnly
            }`
          );
        }

        // if the dumb flag is on, turn it off.
        // first non-whitespace character deactivates it.
        if (bracketJustFound) {
          bracketJustFound = false;
          console.log(
            `460 SET ${`\u001b[${33}m${`bracketJustFound`}\u001b[${39}m`} = ${bracketJustFound}`
          );
        }

        // =========
        // terminate existing range, push the captured range into preliminaries' array
        if (whiteSpaceWithinTagEndsAt !== null) {
          console.log(`467 PUSH [${i + 1}, ${whiteSpaceWithinTagEndsAt}]`);
          preliminaryIndexesToDelete.push([i + 1, whiteSpaceWithinTagEndsAt]);
          whiteSpaceWithinTagEndsAt = null;
          console.log(
            `471 SET ${`\u001b[${33}m${`whiteSpaceWithinTagEndsAt`}\u001b[${39}m`} = ${whiteSpaceWithinTagEndsAt}`
          );
        }

        // =========
        // html detection bits:
        // mind you, we're iterating backwards, so tag starts with ">"
        if (str[i] === ">") {
          // first, reset the count obj.
          resetCounts(count);
          console.log(
            `482 REST COUNT: NOW, count = ${JSON.stringify(count, null, 0)}`
          );
          // set dumb bracket flag to on
          bracketJustFound = true;
          console.log(
            `487 SET ${`\u001b[${33}m${`bracketJustFound`}\u001b[${39}m`} = ${bracketJustFound}`
          );
          // two cases:
          if (stateWithinTag) {
            // this is bad, another closing bracket
            preliminaryIndexesToDelete = [];
            console.log("493 WIPE preliminaryIndexesToDelete");
          } else {
            stateWithinTag = true;
            console.log(
              `497 SET ${`\u001b[${33}m${`stateWithinTag`}\u001b[${39}m`} = ${stateWithinTag}`
            );
            if (
              str[i - 1] !== undefined &&
              str[i - 1].trim() === "" &&
              !whiteSpaceWithinTagEndsAt
            ) {
              whiteSpaceWithinTagEndsAt = i;
              console.log(
                `506 SET ${`\u001b[${33}m${`whiteSpaceWithinTagEndsAt`}\u001b[${39}m`} = ${whiteSpaceWithinTagEndsAt}`
              );
            }
          }
          if (!tagCanEndHere) {
            tagCanEndHere = true;
            console.log(
              `513 SET ${`\u001b[${33}m${`tagCanEndHere`}\u001b[${39}m`} = ${tagCanEndHere}`
            );
            // tag name might be ending with bracket: <br>
          }
        } else if (str[i] === "<") {
          console.log(
            `519 preliminaryIndexesToDelete = ${JSON.stringify(
              preliminaryIndexesToDelete,
              null,
              4
            )}`
          );
          // the rest of calculations:
          stateWithinTag = false;
          console.log(
            `528 SET ${`\u001b[${33}m${`stateWithinTag`}\u001b[${39}m`} = ${stateWithinTag}`
          );
          // reset bail flag
          if (bail) {
            bail = false;
            console.log(
              `534 SET ${`\u001b[${33}m${`bail`}\u001b[${39}m`} = ${bail}`
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
              `546 SET ${`\u001b[${33}m${`tagMatched`}\u001b[${39}m`} = ${tagMatched}`
            );
            preliminaryIndexesToDelete = [];
            console.log("549 WIPE preliminaryIndexesToDelete");
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
              `560 SET ${`\u001b[${33}m${`tagMatched`}\u001b[${39}m`} = ${tagMatched}`
            );
          }
          // finally, reset the count obj.
          resetCounts(count);
          console.log(
            `566 SET ${`\u001b[${33}m${`count`}\u001b[${39}m`} = ${JSON.stringify(
              count,
              null,
              0
            )}`
          );
        } else if (stateWithinTag && str[i] === "/") {
          whiteSpaceWithinTagEndsAt = i;
          console.log(
            `575 SET ${`\u001b[${33}m${`whiteSpaceWithinTagEndsAt`}\u001b[${39}m`} = ${whiteSpaceWithinTagEndsAt}`
          );
        } else if (stateWithinTag && !tagMatched) {
          if (tagCanEndHere && charCodeBetweenInclusive(str[i], 97, 122)) {
            // if letters a-z, inclusive:
            // ---------------------------------------------------------------
            tagCanEndHere = false;
            console.log(
              `583 SET ${`\u001b[${33}m${`tagCanEndHere`}\u001b[${39}m`} = ${tagCanEndHere}`
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
                  `725 SET ${`\u001b[${33}m${`tagMatched`}\u001b[${39}m`} = ${tagMatched}`
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
                `823 SET ${`\u001b[${33}m${`tagMatched`}\u001b[${39}m`} = ${tagMatched}`
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
              `835 SET ${`\u001b[${33}m${`tagCanEndHere`}\u001b[${39}m`} = ${tagCanEndHere}`
            );
            if (
              str[i - 1] === "h" &&
              (str[i - 2] === "<" || str[i - 2].trim() === "")
            ) {
              tagMatched = true;
              console.log(
                `843 SET ${`\u001b[${33}m${`tagMatched`}\u001b[${39}m`} = ${tagMatched}`
              );
            }
          } else if (str[i] === "=" || str[i] === '"') {
            tagCanEndHere = false;
            console.log(
              `849 SET ${`\u001b[${33}m${`tagCanEndHere`}\u001b[${39}m`} = ${`\u001b[${35}m${tagCanEndHere}\u001b[${39}m`}`
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

  let ranges = finalIndexesToDelete.length ? merge(finalIndexesToDelete) : null;
  if (opts.rangesOffset && ranges && ranges.length) {
    ranges = ranges.map(([from, to]) => [
      from + opts.rangesOffset,
      to + opts.rangesOffset,
    ]);
  }

  console.log(`880 --------`);
  console.log(
    `882 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
      ranges,
      null,
      4
    )}`
  );

  return {
    result: finalIndexesToDelete.length
      ? apply(str, finalIndexesToDelete)
      : str,
    ranges,
  };
}

export default collapse;
