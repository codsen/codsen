import { left, right, leftStopAtNewLines, chompLeft } from "string-left-right";
import fixBrokenEntities from "string-fix-broken-named-entities";
import { processCharacter } from "./processCharacter";
import { removeWidows } from "string-remove-widows";
import processOutside from "ranges-process-outside";
import collapse from "string-collapse-white-space";
import trimSpaces from "string-trim-spaces-only";
import { version } from "../package.json";
import stripHtml from "string-strip-html";
import isObj from "lodash.isplainobject";
// import escape from "js-string-escape";
import rangesApply from "ranges-apply";
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

  if (typeof str !== "string") {
    throw new Error(
      `detergent(): [THROW_ID_01] the first input argument must be of a string type, not ${typeof str}`
    );
  }

  if (inputOpts && !isObj(inputOpts)) {
    throw new Error(
      `detergent(): [THROW_ID_02] Options object must be a plain object, not ${typeof inputOpts}`
    );
  }

  const opts = Object.assign({}, defaultOpts, inputOpts);

  if (!["lf", "crlf", "cr"].includes(opts.eol)) {
    opts.eol = "lf";
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
  // --------------------------------------------------------------------------

  let endOfLine = "\n";
  if (opts.eol === "crlf") {
    endOfLine = "\r\n";
  } else if (opts.eol === "cr") {
    endOfLine = "\r";
  }

  const brClosingBracketIndexesArr = [];

  // We need to track what actions need to be done. Each action (a range) is
  // an array of two elements: from index and to index. It means what to delete.
  // There can be third element, a string, which means what to insert instead.
  const finalIndexesToDelete = new Ranges({
    limitToBeAddedWhitespace: false
  }); // the main container to gather the ranges. Ranges is a JS class.

  // When we process the input, we gather the information about it and sometimes
  // it's very efficient to stop processing chunks once they're cleared.
  // For example, any index ranges taken by HTML entities can be ignored after
  // those index range are identified. It's even a hassle otherwise: entities
  // contain ampersands and if we didn't ignore entity ranges, we'd have to
  // take measures to ignore ampersand encoding.
  const skipArr = new Ranges();

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

  console.log(
    `146 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

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
    `188 ${`\u001b[${90}m${`================= NEXT STEP. Initial =================`}\u001b[${39}m`}`
  );
  str = trimSpaces(str.replace(ansiRegex(), "").replace(/\u200A/g, " "), {
    cr: true,
    lf: true,
    tab: true,
    space: true,
    nbsp: false
  }).res;
  console.log(
    `198 after the initial trim, str = ${JSON.stringify(str, null, 0)}`
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
  }

  console.log(
    `216 "str" after decoding, before collapsing: ${JSON.stringify(
      str,
      null,
      0
    )}`
  );
  str = collapse(str, {
    trimLines: true,
    recogniseHTML: false,
    removeEmptyLines: true,
    limitConsecutiveEmptyLinesTo: 1
  });
  console.log(`228 "str" after collapsing: ${JSON.stringify(str, null, 0)}`);

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  // preliminary loop through to remove/replace characters which later might
  // be needed to be considered when replacing others in the main loop;
  // that's mostly some nasties converted into spaces - those spaces will
  // be needed to already by there in the main loop

  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i].charCodeAt(0) === 65533) {
      // REPLACEMENT CHARACTER, \uFFFD, or "�"
      console.log(`241 main.js: entering charcode #65533 catch clauses`);
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
        console.log(`300 main.js - PUSH [${i}, ${i + 1}, ${replacement}]`);
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
        console.log(`312 main.js - PUSH [${i}, ${i + 1}, ${rawMDash}]`);
        // it's because it's a preliminary replacement, we'll encode in the main loop
      } else {
        finalIndexesToDelete.push(i, i + 1);
        console.log(`316 main.js - PUSH [${i}, ${i + 1}]`);
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
    `331 ${`\u001b[${90}m${`================= NEXT STEP. fix broken HTML entity references =================`}\u001b[${39}m`}`
  );

  const entityFixes = fixBrokenEntities(str, { decode: false });
  if (entityFixes && entityFixes.length) {
    // 1. report option as applicable:
    applicableOpts.fixBrokenEntities = true;

    // 2. if option is enabled, apply it:
    if (opts.fixBrokenEntities) {
      str = rangesApply(str, entityFixes);
      console.log(
        `343 after fixing broken entities, str = ${JSON.stringify(
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
      `359 ${`\u001b[${90}m${`================= NEXT STEP. HTML tags =================`}\u001b[${39}m`}`
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
        `379 main.js: ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
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
        console.log(`393 tag confirmed`);
        applicableOpts.stripHtml = true;
        console.log(
          `396 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.stripHtml = ${
            applicableOpts.stripHtml
          }`
        );

        // 1. add range from bracket to bracket to ignores list:
        skipArr.push(
          tag.lastOpeningBracketAt,
          tag.lastClosingBracketAt ? tag.lastClosingBracketAt + 1 : str.length
        );
        console.log(
          `407 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to skipArr [${
            tag.lastOpeningBracketAt
          }, ${
            tag.lastClosingBracketAt ? tag.lastClosingBracketAt + 1 : str.length
          }]`
        );

        // 2. strip tag if opts.stripHtml is enabled
        if (
          opts.stripHtml &&
          !opts.stripHtmlButIgnoreTags.includes(tag.name.toLowerCase())
        ) {
          // 1. strip tag
          console.log(`420 strip tag clauses`);

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
            console.log(`435 opts.stripHtmlAddNewLine clauses`);

            applicableOpts.removeLineBreaks = true;
            console.log(
              `439 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.removeLineBreaks`}\u001b[${39}m`} = ${
                applicableOpts.removeLineBreaks
              }`
            );

            if (!opts.removeLineBreaks) {
              applicableOpts.replaceLineBreaks = true;
              console.log(
                `447 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.replaceLineBreaks`}\u001b[${39}m`} = ${
                  applicableOpts.replaceLineBreaks
                }`
              );

              if (opts.replaceLineBreaks) {
                applicableOpts.useXHTML = true;
                console.log(
                  `455 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.useXHTML`}\u001b[${39}m`} = ${
                    applicableOpts.useXHTML
                  }`
                );
              }

              // insert <br>
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
                `472 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
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
              console.log(
                `487 FINALLY, finalIndexesToDelete.current() = ${JSON.stringify(
                  finalIndexesToDelete.current(),
                  null,
                  4
                )}`
              );
            } else {
              finalIndexesToDelete.push(proposedReturn);
              console.log(
                `496 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  proposedReturn,
                  null,
                  4
                )}`
              );
            }
          } else {
            console.log(
              `505 didn't fell into opts.stripHtmlAddNewLine clauses`
            );
            finalIndexesToDelete.push(proposedReturn);
            skipArr.push(proposedReturn);
            console.log(
              `510 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to ${`\u001b[${33}m${`finalIndexesToDelete`}\u001b[${39}m`} and ${`\u001b[${33}m${`skipArr`}\u001b[${39}m`} ${JSON.stringify(
                proposedReturn,
                null,
                4
              )}`
            );
          }
        } else {
          console.log("518 - not stripping tags");
          // 3. add closing slash on void tags if XHTML mode is on
          if (voidTags.includes(tag.name.toLowerCase())) {
            //
            // IF A VOID TAG
            //

            applicableOpts.useXHTML = true;
            console.log(
              `527 it's a void tag. ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.useXHTML = ${
                applicableOpts.useXHTML
              }`
            );

            if (
              str[left(str, tag.lastClosingBracketAt)] !== "/" &&
              tag.lastClosingBracketAt
            ) {
              if (opts.useXHTML) {
                console.log(
                  `538 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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

            // 4. remove slashes in front of a void tag
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
                `562 remove whitespace/slashes ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${tag.lastOpeningBracketAt +
                  1}, ${tag.nameStarts}]`
              );
              finalIndexesToDelete.push(
                tag.lastOpeningBracketAt + 1,
                tag.nameStarts
              );
            }

            console.log(
              `572 finalIndexesToDelete.current() = ${JSON.stringify(
                finalIndexesToDelete.current(),
                null,
                4
              )}`
            );

            // 5. remove closing slash from void tags is XHTML mode is off
            // or excessive, multiple closing slashes
            if (
              tag.slashPresent &&
              str[left(str, tag.lastClosingBracketAt)] === "/"
            ) {
              console.log("585");
              if (str[left(str, left(str, tag.lastClosingBracketAt))] === "/") {
                applicableOpts.useXHTML = true;
                console.log(
                  `589 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.useXHTML = ${
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
                    `612 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} chomped [${chompLeft(
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
                  `627 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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

            // 6. if it's not a void tag and there's slash on a wrong side, correct it
            if (
              tag.slashPresent &&
              str[left(str, tag.lastClosingBracketAt)] === "/"
            ) {
              // 6-1. remove the wrong slash
              finalIndexesToDelete.push(
                chompLeft(str, tag.lastClosingBracketAt, { mode: 2 }, "/"),
                tag.lastClosingBracketAt
              );
              // 6-2. add where it needs to be
              finalIndexesToDelete.push(
                tag.lastOpeningBracketAt + 1,
                tag.lastOpeningBracketAt + 1,
                "/"
              );
            }
          }

          console.log(
            `662 finalIndexesToDelete.current() = ${JSON.stringify(
              finalIndexesToDelete.current(),
              null,
              4
            )}`
          );

          // 7. tackle wrong letter case
          if (tag.name.toLowerCase() !== tag.name) {
            console.log(
              `672 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                tag.nameStarts
              }, ${tag.nameEnds}, ${tag.name.toLowerCase()}]`
            );
            finalIndexesToDelete.push(
              tag.nameStarts,
              tag.nameEnds,
              tag.name.toLowerCase()
            );
          }

          // 8. remove whitespace after tag name like <tr >
          if (
            `/>`.includes(str[right(str, tag.nameEnds - 1)]) &&
            right(str, tag.nameEnds - 1) > tag.nameEnds
          ) {
            console.log(
              `689 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                tag.nameEnds
              }, ${right(str, tag.nameEnds - 1)}]`
            );
            finalIndexesToDelete.push(
              tag.nameEnds,
              right(str, tag.nameEnds - 1)
            );
          }

          // 9. remove whitespace in front of tag name, considering closing slashes
          if (
            isNum(tag.lastOpeningBracketAt) &&
            isNum(tag.nameStarts) &&
            tag.lastOpeningBracketAt + 1 < tag.nameStarts
          ) {
            // cases like < tr>
            if (
              !str.slice(tag.lastOpeningBracketAt + 1, tag.nameStarts).trim()
                .length
            ) {
              // all this whitespace goes
              console.log(
                `712 whitespace in front of tag name - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${tag.lastOpeningBracketAt +
                  1}, ${tag.nameStarts}]`
              );
              finalIndexesToDelete.push(
                tag.lastOpeningBracketAt + 1,
                tag.nameStarts
              );
            } else if (
              !voidTags.includes(tag.name.toLowerCase()) &&
              str
                .slice(tag.lastOpeningBracketAt + 1, tag.nameStarts)
                .split("")
                .every(char => !char.trim().length || char === "/")
            ) {
              // if there is mix of whitespace and closing slashes, all this
              // goes and replaced with single slash.
              // Imagine: < ///    ///    table>
              finalIndexesToDelete.push(
                tag.lastOpeningBracketAt + 1,
                tag.nameStarts,
                "/"
              );
              console.log(
                `735 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${tag.lastOpeningBracketAt +
                  1}, ${tag.nameStarts}, ${"/"}]`
              );
            }
          }
        }

        // 10. if it's a BR, take a note of its closing bracket's location:
        if (tag.name.toLowerCase() === "br" && tag.lastClosingBracketAt) {
          brClosingBracketIndexesArr.push(tag.lastClosingBracketAt);
          console.log(
            `746 brClosingBracketIndexesArr now = ${JSON.stringify(
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
          console.log(`761 - ul/li prep`);
          // if there's whitespace in front,
          finalIndexesToDelete.push(
            leftStopAtNewLines(str, tag.lastOpeningBracketAt) + 1,
            tag.lastOpeningBracketAt
          );
          console.log(
            `768 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${leftStopAtNewLines(
              str,
              tag.lastOpeningBracketAt
            ) + 1}, ${tag.lastOpeningBracketAt}]`
          );
        }

        // 12. remove whitespace before closing bracket
        if (
          str[tag.lastClosingBracketAt - 1] &&
          !str[tag.lastClosingBracketAt - 1].trim().length
        ) {
          finalIndexesToDelete.push(
            left(str, tag.lastClosingBracketAt) + 1,
            tag.lastClosingBracketAt
          );
          console.log(
            `785 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${left(
              str,
              tag.lastClosingBracketAt
            ) + 1}, ${tag.lastClosingBracketAt}]`
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
    `821 ${str.includes("<") || str.includes(">") ? "" : "no tags found"}`
  );
  console.log(
    `824 ${`\u001b[${33}m${`rangesArr`}\u001b[${39}m`}.current() = ${JSON.stringify(
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
    `839 ${`\u001b[${90}m${`================= NEXT STEP. Process outside tags =================`}\u001b[${39}m`}`
  );

  console.log(`842 call processOutside()`);
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
        applicableOpts,
        endOfLine
      ),
    true
  );
  console.log(
    `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m looping done \u001b[${36}m${`===============================`}\u001b[${39}m`
  );

  console.log(
    `866 back to main.js(): ${`\u001b[${33}m${`str`}\u001b[${39}m`}=${JSON.stringify(
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
    `881 ${`\u001b[${90}m${`================= NEXT STEP. apply+wipe =================`}\u001b[${39}m`}`
  );

  console.log(
    `885 ${`\u001b[${33}m${`str`}\u001b[${39}m`} before apply+wipe: ${JSON.stringify(
      str,
      null,
      4
    )}`
  );
  applyAndWipe();
  console.log(
    `893 ${`\u001b[${33}m${`str`}\u001b[${39}m`} after apply+wipe: ${JSON.stringify(
      str,
      null,
      4
    )}`
  );
  // patch up spaces in front of <br/>
  str = str.replace(/ (<br[/]?>)/g, "$1");

  str = str.replace(/(\r\n|\r|\n){3,}/g, `${endOfLine}${endOfLine}`);
  console.log(
    `904 ${`\u001b[${33}m${`str`}\u001b[${39}m`} after str.replace: ${JSON.stringify(
      str,
      null,
      4
    )}`
  );
  console.log(
    `911 ${`\u001b[${33}m${`finalIndexesToDelete.current()`}\u001b[${39}m`} = ${JSON.stringify(
      finalIndexesToDelete.current(),
      null,
      4
    )}`
  );

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `922 ${`\u001b[${90}m${`================= NEXT STEP. widows =================`}\u001b[${39}m`}`
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
    `934 ${`\u001b[${33}m${`widowFixes`}\u001b[${39}m`} = ${JSON.stringify(
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
        `945 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.removeWidows`}\u001b[${39}m`} = true`
      );
      if (opts.removeWidows) {
        applicableOpts.convertEntities = true;
        console.log(
          `950 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.convertEntities`}\u001b[${39}m`} = true`
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
        `961 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.convertEntities`}\u001b[${39}m`} = true`
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
        `975 after fixing widows, str = ${JSON.stringify(str, null, 0)}`
      );
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `984 ${`\u001b[${90}m${`================= NEXT STEP. linebreaks =================`}\u001b[${39}m`}`
  );

  console.log("\n\n\n");
  console.log(
    `989 STEP#6 ${`\u001b[${33}m${`brClosingBracketIndexesArr`}\u001b[${39}m`} = ${JSON.stringify(
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
    `1011 ${`\u001b[${90}m${`================= NEXT STEP. collapse =================`}\u001b[${39}m`}`
  );

  console.log(`1014 str before collapsing: ${JSON.stringify(str, null, 0)}`);
  str = collapse(str, {
    trimLines: true,
    recogniseHTML: false
  });
  console.log(`1019 str after collapsing: ${JSON.stringify(str, null, 0)}`);

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `1025 ${`\u001b[${90}m${`================= NEXT STEP. final =================`}\u001b[${39}m`}`
  );

  console.log(
    `1029 FINAL RESULT:\n${JSON.stringify(
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
