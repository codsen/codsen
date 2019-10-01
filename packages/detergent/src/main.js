import { left, right, leftStopAtNewLines, chompLeft } from "string-left-right";
import fixBrokenEntities from "string-fix-broken-named-entities";
import { processCharacter } from "./processCharacter";
import { removeWidows } from "string-remove-widows";
import processOutside from "ranges-process-outside";
import collapse from "string-collapse-white-space";
import trimSpaces from "string-trim-spaces-only";
import arrayiffy from "arrayiffy-if-string";
import merge from "object-merge-advanced";
import { version } from "../package.json";
import stripHtml from "string-strip-html";
import isObj from "lodash.isplainobject";
// import escape from "js-string-escape";
import rangesApply from "ranges-apply";
import clone from "lodash.clonedeep";
import ansiRegex from "ansi-regex";
import Ranges from "ranges-push";
import he from "he";
import {
  defaultOpts,
  voidTags,
  isLetter,
  isNumber,
  isLowercaseLetter,
  rawMDash,
  rightSingleQuote
} from "./util";

function det(str, inputOpts) {
  //
  // input validation
  // ---------------------------------------------------------------------------

  let opts;
  if (inputOpts) {
    opts = clone(inputOpts);

    // "inputOpts" might be messed up so clone() above would yield a messed up
    // value, so we're still querying "inputOpts" not "opts" -
    // that's the last instance where we touch it, to prevent mutating it.
    if (isObj(inputOpts)) {
      if (!opts.stripHtmlButIgnoreTags) {
        opts.stripHtmlButIgnoreTags = [];
      } else {
        opts.stripHtmlButIgnoreTags = arrayiffy(opts.stripHtmlButIgnoreTags);
      }

      if (!opts.stripHtmlButIgnoreTags) {
        opts.stripHtmlButIgnoreTags = [];
      } else {
        opts.stripHtmlButIgnoreTags = arrayiffy(opts.stripHtmlButIgnoreTags);
      }

      // defaults object (opts) is in util.js to keep it DRY
      // fill any settings with defaults if missing:
      opts = merge(defaultOpts, opts, {
        cb: (inputArg1, inputArg2, resultAboutToBeReturned) => {
          if (
            (Array.isArray(inputArg1) &&
              Array.isArray(inputArg2) &&
              inputArg2.length) ||
            (typeof inputArg1 === "boolean" && typeof inputArg2 === "boolean")
          ) {
            return inputArg2;
          }
          return resultAboutToBeReturned;
        }
      });
    } else {
      throw new Error(
        `detergent(): [THROW_ID_01] Options object must be a plain object, not ${typeof inputOpts}`
      );
    }
  } else {
    opts = clone(defaultOpts);
  }

  // prepare applicable rules object. It is a clone of the default opts object
  // (which comes from util.js), where for starters all values are turned off,
  // then upon traversal, each applicable rule sets the key to true, it does not
  // matter, rule is enabled in opts or not. We just mark that particular
  // options setting could be applicable.
  const applicableOpts = {};

  Object.keys(defaultOpts)
    .sort()
    .filter(
      val => !["stripHtmlAddNewLine", "stripHtmlButIgnoreTags"].includes(val)
    )
    .forEach(singleOption => {
      applicableOpts[singleOption] = false;
    });

  // the tags whitelist is not boolean, it falls outside reporting cases
  delete applicableOpts.stripHtmlButIgnoreTags;

  //
  // vars and internal functions
  // ---------------------------------------------------------------------------

  const endOfLine = require("os").EOL || "\n";
  const brClosingBracketIndexesArr = [];

  // We need to track what actions need to be done. Each action (a range) is
  // an array of two elements: from index and to index. It means what to delete.
  // There can be third element, a string, which means what to insert instead.
  const finalIndexesToDelete = new Ranges({
    limitToBeAddedWhitespace: true
  }); // the main container to gather the ranges. Ranges is a JS class.

  // When we process the input, we gather the information about it and sometimes
  // it's very efficient to stop processing chunks once they're cleared.
  // For example, any index ranges taken by HTML entities can be ignored after
  // those index range are identified. It's even a hassle otherwise: entities
  // contain ampersands and if we didn't ignore entity ranges, we'd have to
  // take measures to ignore ampersand encoding.
  const skipArr = new Ranges();

  // function processOutSideRanges(ranges, cb) {
  //   rangesInvert(finalIndexesToDelete.current(), len).reduce((accum, curr) => {
  //     const receivedFromCallback = cb(curr);
  //     if (receivedFromCallback) {
  //       return accum.concat(receivedFromCallback);
  //     }
  //   }, []);
  //
  //   rangesInvert(finalIndexesToDelete.current(), len).forEach(range => {});
  // }

  function applyAndWipe() {
    str = rangesApply(str, finalIndexesToDelete.current());
    finalIndexesToDelete.wipe();
    skipArr.wipe();
  }
  function isNum(something) {
    return Number.isInteger(something);
  }
  const state = {
    onUrlCurrently: false
  };

  //                                          ____
  //                         massive hammer  |    |
  //                       O=================|    |
  //                         upon all bugs   |____|

  //                                        .=O=.

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
  //                       T H E    P I P E L I N E
  //

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `177 ${`\u001b[${90}m${`================= NEXT STEP. Initial =================`}\u001b[${39}m`}`
  );
  str = trimSpaces(str.replace(ansiRegex(), "").replace(/\u200A/g, " "), {
    cr: true,
    lf: true,
    tab: true,
    space: true,
    nbsp: false
  }).res;
  console.log(
    `187 after the initial trim, str = ${JSON.stringify(str, null, 0)}`
  );

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  let temp = str;
  let lastVal;
  do {
    lastVal = temp;
    temp = he.decode(temp);
  } while (temp !== str && lastVal !== temp);

  if (str !== temp) {
    str = temp;
    applicableOpts.convertEntities = true;
    console.log(
      `204 processCharacter.js: ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.convertEntities = ${
        applicableOpts.convertEntities
      }`
    );
  }
  console.log(
    `210 after recursive decoding, str = ${JSON.stringify(str, null, 4)}`
  );

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  // preliminary loop through to remove/replace characters which later might
  // be needed to be considered when replacing others in the main loop;
  // that's mostly some nasties converted into spaces - those spaces will
  // be needed to already by there in the main loop

  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i].charCodeAt(0) === 65533) {
      // REPLACEMENT CHARACTER, \uFFFD, or "�"
      console.log(`224 main.js: entering charcode #65533 catch clauses`);
      // Delete/fix all cases of Replacement character, \uFFFD, or "�":
      // It usually comes from Windows.
      if (
        (str[i - 1] &&
          str[i + 1] &&
          ((str[i - 1].toLowerCase() === "n" &&
            str[i + 1].toLowerCase() === "t") ||
            (isLetter(str[i - 1]) && str[i + 1].toLowerCase() === "s"))) ||
        (str[i + 2] &&
          (((str[i + 1].toLowerCase() === "r" ||
            str[i + 1].toLowerCase() === "v") &&
            str[i + 2].toLowerCase() === "e") ||
            (str[i + 1].toLowerCase() === "l" &&
              str[i + 2].toLowerCase() === "l")) &&
          ((str[i - 3] &&
            str[i - 3].toLowerCase() === "y" &&
            str[i - 2].toLowerCase() === "o" &&
            str[i - 1].toLowerCase() === "u") ||
            (str[i - 2] &&
              str[i - 2].toLowerCase() === "w" &&
              str[i - 1].toLowerCase() === "e") ||
            (str[i - 4] &&
              str[i - 4].toLowerCase() === "t" &&
              str[i - 3].toLowerCase() === "h" &&
              str[i - 2].toLowerCase() === "e" &&
              str[i - 1].toLowerCase() === "y"))) ||
        (((str[i - 1] && str[i - 1].toLowerCase() === "i") ||
          (str[i - 2] &&
            str[i - 2].toLowerCase() === "h" &&
            str[i - 1].toLowerCase() === "e") ||
          (str[i - 3] &&
            str[i - 3].toLowerCase() === "s" &&
            str[i - 2].toLowerCase() === "h" &&
            str[i - 1].toLowerCase() === "e")) &&
          str[i + 2] &&
          (str[i + 1].toLowerCase() === "l" &&
            str[i + 2].toLowerCase() === "l")) ||
        (str[i - 5] &&
          str[i + 2] &&
          str[i - 5].toLowerCase() === "m" &&
          str[i - 4].toLowerCase() === "i" &&
          str[i - 3].toLowerCase() === "g" &&
          str[i - 2].toLowerCase() === "h" &&
          str[i - 1].toLowerCase() === "t" &&
          str[i + 1] === "v" &&
          str[i + 2] === "e") ||
        (str[i - 1] &&
          str[i - 1].toLowerCase() === "s" &&
          (!str[i + 1] || (!isLetter(str[i + 1]) && !isNumber(str[i + 1]))))
      ) {
        // 1. case of n�t, for example, couldn�t (n + � + t),
        // or case of <letter>�s, for example your�s (letter + � + s).
        // 2. case of we�re, you�re, they�re
        // 3. case of we�ve, you�ve, they�ve
        // 4. case of I�ll, you�ll, he'�ll, she�ll, we�ll, they�ll, it�ll

        const replacement = opts.convertApostrophes ? rightSingleQuote : "'";
        finalIndexesToDelete.push(i, i + 1, `${replacement}`);
        console.log(`283 main.js - PUSH [${i}, ${i + 1}, ${replacement}]`);
        applicableOpts.convertApostrophes = true;
      } else if (
        str[i - 2] &&
        isLowercaseLetter(str[i - 2]) &&
        !str[i - 1].trim().length &&
        str[i + 2] &&
        isLowercaseLetter(str[i + 2]) &&
        !str[i + 1].trim().length
      ) {
        // we don't encode here, no matter if opts.convertEntities is on:
        finalIndexesToDelete.push(i, i + 1, rawMDash);
        console.log(`295 main.js - PUSH [${i}, ${i + 1}, ${rawMDash}]`);
        // it's because it's a preliminary replacement, we'll encode in the main loop
      } else {
        finalIndexesToDelete.push(i, i + 1);
        console.log(`299 main.js - PUSH [${i}, ${i + 1}]`);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  applyAndWipe();

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  // fix broken named HTML entities, if any:
  console.log(
    `314 ${`\u001b[${90}m${`================= NEXT STEP. fix broken HTML entity references =================`}\u001b[${39}m`}`
  );

  const entityFixes = fixBrokenEntities(str, { decode: false });
  if (entityFixes && entityFixes.length) {
    // 1. report option as applicable:
    applicableOpts.fixBrokenEntities = true;

    // 2. if option is enabled, apply it:
    if (opts.fixBrokenEntities) {
      str = rangesApply(str, entityFixes);
      console.log(
        `326 after fixing broken entities, str = ${JSON.stringify(
          str,
          null,
          0
        )}`
      );
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  // tend the HTML tags
  // but maybe our input string doesn't even have any HTML tags?
  if (str.includes("<") || str.includes(">")) {
    console.log(
      `342 ${`\u001b[${90}m${`================= NEXT STEP. HTML tags =================`}\u001b[${39}m`}`
    );

    // submit all HTML tags to be skipped from now on:
    // we're using callback interface to ignore strictly from bracket to bracket
    // (including brackets), without range extension which normally would get
    // added in callback's "deleteFrom" / "deleteTo" equivalent.
    // Normally, we wipe whole tag and its surrounding whitespace, then replace
    // it with space if needed, otherwise just delete that range.
    // This extended range is a liability in light of widow word removal processes
    // down the line - those won't "see" some of the spaces around tags!
    const cb = ({
      tag,
      deleteFrom,
      deleteTo,
      // insert,
      // rangesArr
      proposedReturn
    }) => {
      console.log(
        `362 main.js: ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
          tag,
          null,
          4
        )}`
      );

      // if it's a tag
      if (
        (isNum(tag.lastOpeningBracketAt) &&
          isNum(tag.lastClosingBracketAt) &&
          tag.lastOpeningBracketAt < tag.lastClosingBracketAt) ||
        tag.slashPresent
      ) {
        console.log(`376 tag confirmed`);
        applicableOpts.stripHtml = true;
        console.log(
          `379 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.stripHtml = ${
            applicableOpts.stripHtml
          }`
        );

        // 1. add range from bracket to bracket to ignores list:
        skipArr.push(
          tag.lastOpeningBracketAt,
          tag.lastClosingBracketAt ? tag.lastClosingBracketAt + 1 : str.length
        );

        // 2. strip tag if opts.stripHtml is enabled
        if (
          opts.stripHtml &&
          !opts.stripHtmlButIgnoreTags.includes(tag.name.toLowerCase())
        ) {
          // 1. strip tag
          console.log(`396 strip tag clauses`);
          console.log(`███████████████████████████████████████`);
          console.log(`398 R1 = ${!!opts.stripHtmlAddNewLine.length}`);
          console.log(
            `400 R2 = ${opts.stripHtmlAddNewLine.some(tagName => {
              (tagName.startsWith("/") &&
                tag.slashPresent &&
                tag.name.toLowerCase() === tagName.slice(1)) ||
                (!tagName.startsWith("/") &&
                  !tag.slashPresent &&
                  tag.name.toLowerCase() === tagName);
            })}`
          );

          // take care of tags listed under opts.stripHtmlAddNewLine
          if (
            opts.stripHtmlAddNewLine.length &&
            opts.stripHtmlAddNewLine.some(
              tagName =>
                (tagName.startsWith("/") &&
                  tag.slashPresent &&
                  tag.name.toLowerCase() === tagName.slice(1)) ||
                (!tagName.startsWith("/") &&
                  !tag.slashPresent &&
                  tag.name.toLowerCase() === tagName)
            )
          ) {
            console.log(`423 opts.stripHtmlAddNewLine clauses`);
            applicableOpts.replaceLineBreaks = true;
            console.log(
              `426 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.replaceLineBreaks`}\u001b[${39}m`} = ${
                applicableOpts.replaceLineBreaks
              }`
            );

            if (!opts.removeLineBreaks) {
              if (opts.replaceLineBreaks) {
                applicableOpts.useXHTML = true;
                console.log(
                  `435 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.useXHTML`}\u001b[${39}m`} = ${
                    applicableOpts.useXHTML
                  }`
                );
              }

              finalIndexesToDelete.push(
                deleteFrom,
                deleteTo,
                `${
                  opts.replaceLineBreaks
                    ? `<br${opts.useXHTML ? "/" : ""}>`
                    : ""
                }\n`
              );
              console.log(
                `451 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  [
                    deleteFrom,
                    deleteTo,
                    `${
                      opts.replaceLineBreaks
                        ? `<br${opts.useXHTML ? "/" : ""}>`
                        : ""
                    }\n`
                  ],
                  null,
                  0
                )}`
              );
            } else {
              finalIndexesToDelete.push(proposedReturn);
              console.log(
                `468 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  proposedReturn,
                  null,
                  4
                )}`
              );
            }
          } else {
            console.log(
              `477 didn't fell into opts.stripHtmlAddNewLine clauses`
            );
            finalIndexesToDelete.push(proposedReturn);
            console.log(
              `481 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                proposedReturn,
                null,
                4
              )}`
            );
          }
        } else {
          console.log("489 - not stripping tags");
          // 3. add line breaks after <br>
          // if (
          //   (!opts.stripHtml ||
          //     (isArr(opts.stripHtmlButIgnoreTags) &&
          //       opts.stripHtmlButIgnoreTags.includes("br"))) &&
          //   tag.name.toLowerCase() === "br" &&
          //   tag.lastClosingBracketAt &&
          //   !`\n\r`.includes(str[tag.lastClosingBracketAt + 1])
          // ) {
          //   applicableOpts.replaceLineBreaks = true;
          //   console.log(
          //     `501 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.replaceLineBreaks = ${
          //       applicableOpts.replaceLineBreaks
          //     }`
          //   );
          //
          //   if (opts.replaceLineBreaks) {
          //     console.log(`507 insert line break clauses`);
          //     finalIndexesToDelete.push(
          //       tag.lastClosingBracketAt + 1,
          //       tag.lastClosingBracketAt + 1,
          //       "\n"
          //     );
          //   }
          // }

          // 4. add closing slash on void tags if XHTML mode is on
          if (voidTags.includes(tag.name.toLowerCase())) {
            //
            // IF A VOID TAG
            //

            applicableOpts.useXHTML = true;
            console.log(
              `524 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.useXHTML = ${
                applicableOpts.useXHTML
              }`
            );

            if (
              str[left(str, tag.lastClosingBracketAt)] !== "/" &&
              tag.lastClosingBracketAt
            ) {
              if (opts.useXHTML) {
                console.log(
                  `535 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                    tag.lastClosingBracketAt
                  }, ${tag.lastClosingBracketAt}, "/"]`
                );
                finalIndexesToDelete.push(
                  tag.lastClosingBracketAt,
                  tag.lastClosingBracketAt,
                  "/"
                );
              }
            }

            // 5. remove slashes in front of a void tag
            if (
              tag.slashPresent &&
              isNum(tag.lastOpeningBracketAt) &&
              tag.nameStarts &&
              tag.lastOpeningBracketAt < tag.nameStarts - 1 &&
              str
                .slice(tag.lastOpeningBracketAt + 1, tag.nameStarts)
                .split("")
                .every(char => !char.trim().length || char === "/")
            ) {
              console.log(
                `559 remove whitespace ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${tag.lastOpeningBracketAt +
                  1}, ${tag.nameStarts}]`
              );
              finalIndexesToDelete.push(
                tag.lastOpeningBracketAt + 1,
                tag.nameStarts
              );
            }

            // 6. remove closing slash from void tags is XHTML mode is off
            // or excessive, multiple closing slashes
            if (
              tag.slashPresent &&
              str[left(str, tag.lastClosingBracketAt)] === "/"
            ) {
              console.log("574");
              if (str[left(str, left(str, tag.lastClosingBracketAt))] === "/") {
                applicableOpts.useXHTML = true;
                console.log(
                  `578 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.useXHTML = ${
                    applicableOpts.useXHTML
                  }`
                );

                if (
                  !opts.useXHTML ||
                  str.slice(
                    chompLeft(str, tag.lastClosingBracketAt, { mode: 2 }, "/"),
                    tag.lastClosingBracketAt
                  ) !== "/"
                ) {
                  // multiple closing slashes
                  finalIndexesToDelete.push(
                    // chomp mode 2: hungrily chomp all whitespace except newlines
                    // for example:
                    // chompLeft("a  b c b c  x y", 12, { mode: 2 }, "b", "c")
                    // => 1
                    chompLeft(str, tag.lastClosingBracketAt, { mode: 2 }, "/"),
                    tag.lastClosingBracketAt,
                    opts.useXHTML ? "/" : undefined
                  );
                  console.log(
                    `601 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} chomped [${chompLeft(
                      str,
                      tag.lastClosingBracketAt,
                      { mode: 2 },
                      "/"
                    )}, ${tag.lastClosingBracketAt}, ${
                      opts.useXHTML ? "/" : undefined
                    }]`
                  );
                }
              } else if (
                !opts.useXHTML ||
                str.slice(tag.slashPresent, tag.lastClosingBracketAt) !== "/"
              ) {
                console.log(
                  `616 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                    tag.slashPresent
                  }, ${tag.lastClosingBracketAt}]`
                );
                finalIndexesToDelete.push(
                  tag.slashPresent,
                  tag.lastClosingBracketAt
                );
              }
            }
          } else {
            //
            // IF NOT A VOID TAG
            //

            // 9. if it's not a void tag and there's slash on a wrong side, correct it
            if (
              tag.slashPresent &&
              str[left(str, tag.lastClosingBracketAt)] === "/"
            ) {
              // 9-1. remove the wrong slash
              finalIndexesToDelete.push(
                chompLeft(str, tag.lastClosingBracketAt, { mode: 2 }, "/"),
                tag.lastClosingBracketAt
              );
              // 9-2. add where it needs to be
              finalIndexesToDelete.push(
                tag.lastOpeningBracketAt + 1,
                tag.lastOpeningBracketAt + 1,
                "/"
              );
            }
          }

          // 7. tackle wrong letter case
          if (tag.name.toLowerCase() !== tag.name) {
            console.log(
              `653 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                tag.nameStarts
              }, ${tag.nameEnds}, ${tag.name.toLowerCase()}]`
            );
            finalIndexesToDelete.push(
              tag.nameStarts,
              tag.nameEnds,
              tag.name.toLowerCase()
            );
          }

          // 8. remove whitespace after tag name
          if (
            `/>`.includes(str[right(str, tag.nameEnds - 1)]) &&
            right(str, tag.nameEnds - 1) > tag.nameEnds
          ) {
            console.log(
              `670 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                tag.nameEnds
              }, ${right(str, tag.nameEnds - 1)}]`
            );
            finalIndexesToDelete.push(
              tag.nameEnds,
              right(str, tag.nameEnds - 1)
            );
          }
        }

        // 10. if it's a BR, take a note of its closing bracket's location:
        if (tag.name.toLowerCase() === "br" && tag.lastClosingBracketAt) {
          brClosingBracketIndexesArr.push(tag.lastClosingBracketAt);
          console.log(
            `685 brClosingBracketIndexesArr now = ${JSON.stringify(
              brClosingBracketIndexesArr,
              null,
              0
            )}`
          );
        }

        // 11. remove whitespace in front of UL/LI tags
        if (
          ["ul", "li"].includes(tag.name.toLowerCase()) &&
          !opts.removeLineBreaks &&
          str[tag.lastOpeningBracketAt - 1] &&
          !str[tag.lastOpeningBracketAt - 1].trim().length
        ) {
          console.log(`700 - ul/li prep`);
          // if there's whitespace in front,
          finalIndexesToDelete.push(
            leftStopAtNewLines(str, tag.lastOpeningBracketAt) + 1,
            tag.lastOpeningBracketAt
          );
          console.log(
            `707 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${leftStopAtNewLines(
              str,
              tag.lastOpeningBracketAt
            ) + 1}, ${tag.lastOpeningBracketAt}]`
          );
        }
      }

      // LOGGING:
      console.log(
        `${`\u001b[${90}m${`========================================\nENDING finalIndexesToDelete[]:\n`}\u001b[${39}m`}`
      );
      console.log(
        `${`\u001b[${90}m${JSON.stringify(
          finalIndexesToDelete.current(),
          null,
          4
        )}\u001b[${39}m`}`
      );
    };
    console.log(
      `${`\u001b[${90}m${`========================================`}\u001b[${39}m`}`
    );

    // since we rely on callback interface, we don't need to assign the function
    // to a result, we perform all the processing within the callback "cb":
    stripHtml(str, {
      cb,
      trimOnlySpaces: true,
      ignoreTags: stripHtml ? opts.stripHtmlButIgnoreTags : [],
      skipHtmlDecoding: true,
      returnRangesOnly: true
    });
  }

  console.log(
    `743 ${str.includes("<") || str.includes(">") ? "" : "no tags found"}`
  );
  console.log(
    `746 ${`\u001b[${33}m${`rangesArr`}\u001b[${39}m`}.current() = ${JSON.stringify(
      finalIndexesToDelete.current(),
      null,
      0
    )}; ${`\u001b[${33}m${`skipArr`}\u001b[${39}m`}.current() = ${JSON.stringify(
      skipArr.current(),
      null,
      0
    )}`
  );

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `761 ${`\u001b[${90}m${`================= NEXT STEP. Process outside tags =================`}\u001b[${39}m`}`
  );

  console.log(`764 call processOutside()`);
  processOutside(
    str,
    skipArr.current(),
    (idxFrom, idxTo, offsetBy) =>
      processCharacter(
        str,
        opts,
        finalIndexesToDelete,
        idxFrom,
        idxTo,
        offsetBy,
        brClosingBracketIndexesArr,
        state,
        applicableOpts
      ),
    true
  );

  console.log(
    `784 LOOPING DONE: ${`\u001b[${33}m${`str`}\u001b[${39}m`}=${JSON.stringify(
      str,
      null,
      0
    )}\n---\n${`\u001b[${33}m${`rangesArr.current()`}\u001b[${39}m`} = ${JSON.stringify(
      finalIndexesToDelete.current(),
      null,
      4
    )}`
  );

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `799 ${`\u001b[${90}m${`================= NEXT STEP. apply+wipe =================`}\u001b[${39}m`}`
  );

  console.log(
    `803 ${`\u001b[${33}m${`str`}\u001b[${39}m`} before apply+wipe: ${JSON.stringify(
      str,
      null,
      4
    )}`
  );
  applyAndWipe();
  console.log(
    `811 ${`\u001b[${33}m${`str`}\u001b[${39}m`} after apply+wipe: ${JSON.stringify(
      str,
      null,
      4
    )}`
  );
  str = str.replace(/(\r\n|\r|\n){3,}/g, `${endOfLine}${endOfLine}`);
  console.log(
    `819 ${`\u001b[${33}m${`str`}\u001b[${39}m`} after str.replace: ${JSON.stringify(
      str,
      null,
      4
    )}`
  );
  console.log(
    `826 ${`\u001b[${33}m${`finalIndexesToDelete.current()`}\u001b[${39}m`} = ${JSON.stringify(
      finalIndexesToDelete.current(),
      null,
      4
    )}`
  );

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `837 ${`\u001b[${90}m${`================= NEXT STEP. widows =================`}\u001b[${39}m`}`
  );

  // remove widow words
  const widowFixes = removeWidows(str, {
    ignore: "all",
    convertEntities: true, // full-on setup
    targetLanguage: "html",
    UKPostcodes: true, // full-on setup
    hyphens: true // full-on setup
  });
  console.log(
    `849 ${`\u001b[${33}m${`widowFixes`}\u001b[${39}m`} = ${JSON.stringify(
      widowFixes,
      null,
      4
    )}`
  );
  if (widowFixes && widowFixes.ranges && widowFixes.ranges.length) {
    // 1. report option as potentially applicable:
    if (!applicableOpts.removeWidows && widowFixes.whatWasDone.removeWidows) {
      applicableOpts.removeWidows = true;
      console.log(
        `860 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.removeWidows`}\u001b[${39}m`} = true`
      );
      if (opts.removeWidows) {
        applicableOpts.convertEntities = true;
        console.log(
          `865 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.convertEntities`}\u001b[${39}m`} = true`
        );
      }
    }
    // 2.
    if (
      !applicableOpts.convertEntities &&
      widowFixes.whatWasDone.convertEntities
    ) {
      applicableOpts.convertEntities = true;
      console.log(
        `876 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.convertEntities`}\u001b[${39}m`} = true`
      );
    }

    // 3. if option is enabled, apply it:
    if (opts.removeWidows) {
      str = removeWidows(str, {
        ignore: "all",
        convertEntities: opts.convertEntities,
        targetLanguage: "html",
        UKPostcodes: true,
        hyphens: opts.convertDashes
      }).res;
      console.log(
        `890 after fixing widows, str = ${JSON.stringify(str, null, 0)}`
      );
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `899 ${`\u001b[${90}m${`================= NEXT STEP. linebreaks =================`}\u001b[${39}m`}`
  );

  console.log("\n\n\n");
  console.log(
    `904 STEP#6 ${`\u001b[${33}m${`brClosingBracketIndexesArr`}\u001b[${39}m`} = ${JSON.stringify(
      brClosingBracketIndexesArr,
      null,
      4
    )}\n\n\n`
  );

  // replace line breaks
  if (str !== str.replace(/\r\n|\r|\n/gm, " ")) {
    // 1. report opts.removeLineBreaks might be applicable
    applicableOpts.removeLineBreaks = true;

    // 2. apply if option is on
    if (opts.removeLineBreaks) {
      str = str.replace(/\r\n|\r|\n/gm, " ");
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `926 ${`\u001b[${90}m${`================= NEXT STEP. collapse =================`}\u001b[${39}m`}`
  );

  console.log(`929 str before collapsing: ${JSON.stringify(str, null, 0)}`);
  str = collapse(str, {
    trimLines: true,
    recogniseHTML: true
  });
  console.log(`934 str after collapsing: ${JSON.stringify(str, null, 0)}`);

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `940 ${`\u001b[${90}m${`================= NEXT STEP. final =================`}\u001b[${39}m`}`
  );

  console.log(
    `944 FINAL RESULT:\n${JSON.stringify(
      {
        res: rangesApply(str, finalIndexesToDelete.current())
      },
      null,
      4
    )}`
  );
  return {
    res: rangesApply(str, finalIndexesToDelete.current()),
    applicableOpts
  };
}

export { det, defaultOpts as opts, version };

// -----------------------------------------------------------------------------
