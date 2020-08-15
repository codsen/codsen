import { left, right, leftStopAtNewLines, chompLeft } from "string-left-right";
import fixBrokenEntities from "string-fix-broken-named-entities";
import { removeWidows } from "string-remove-widows";
import processOutside from "ranges-process-outside";
import collapse from "string-collapse-white-space";
import trimSpaces from "string-trim-spaces-only";
import stripHtml from "string-strip-html";
import invertRanges from "ranges-invert";
// import escape from "js-string-escape";
import rangesApply from "ranges-apply";
import ansiRegex from "ansi-regex";
import Ranges from "ranges-push";
import he from "he";
import { version } from "../package.json";
import { processCharacter } from "./processCharacter";
import {
  defaultOpts,
  voidTags,
  isLetter,
  isNumber,
  isLowercaseLetter,
  rawMDash,
  rightSingleQuote,
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

  if (inputOpts && typeof inputOpts !== "object") {
    throw new Error(
      `detergent(): [THROW_ID_02] Options object must be a plain object, not ${typeof inputOpts}`
    );
  }

  if (inputOpts && inputOpts.cb && typeof inputOpts.cb !== "function") {
    throw new Error(
      `detergent(): [THROW_ID_03] Options callback, opts.cb must be a function, not ${typeof inputOpts.cb} (value was given as:\n${JSON.stringify(
        inputOpts.cb,
        null,
        0
      )})`
    );
  }

  const opts = { ...defaultOpts, ...inputOpts };

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
      (val) =>
        !["stripHtmlAddNewLine", "stripHtmlButIgnoreTags", "cb"].includes(val)
    )
    .forEach((singleOption) => {
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
    limitToBeAddedWhitespace: false,
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
    // skipArr.wipe();
  }
  function isNum(something) {
    return Number.isInteger(something);
  }
  const state = {
    onUrlCurrently: false,
  };

  console.log(
    `120 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
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
    `162 ${`\u001b[${90}m${`================= NEXT STEP. Initial =================`}\u001b[${39}m`}`
  );
  str = trimSpaces(str.replace(ansiRegex(), "").replace(/\u200A/g, " "), {
    cr: true,
    lf: true,
    tab: true,
    space: true,
    nbsp: false,
  }).res;
  console.log(
    `172 after the initial trim, str = ${JSON.stringify(str, null, 0)}`
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
    `190 "str" after decoding, before collapsing: ${JSON.stringify(
      str,
      null,
      0
    )}`
  );
  str = collapse(str, {
    trimLines: true,
    recogniseHTML: false,
    removeEmptyLines: true,
    limitConsecutiveEmptyLinesTo: 1,
  });
  console.log(`202 "str" after collapsing: ${JSON.stringify(str, null, 0)}`);

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  // preliminary loop through to remove/replace characters which later might
  // be needed to be considered when replacing others in the main loop;
  // that's mostly some nasties converted into spaces - those spaces will
  // be needed to already by there in the main loop

  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i].charCodeAt(0) === 65533) {
      // REPLACEMENT CHARACTER, \uFFFD, or "�"
      console.log(`215 main.js: entering charcode #65533 catch clauses`);
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
          str[i + 1].toLowerCase() === "l" &&
          str[i + 2].toLowerCase() === "l") ||
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
        console.log(`274 main.js - PUSH [${i}, ${i + 1}, ${replacement}]`);
        applicableOpts.convertApostrophes = true;
      } else if (
        str[i - 2] &&
        isLowercaseLetter(str[i - 2]) &&
        !str[i - 1].trim() &&
        str[i + 2] &&
        isLowercaseLetter(str[i + 2]) &&
        !str[i + 1].trim()
      ) {
        // we don't encode here, no matter if opts.convertEntities is on:
        finalIndexesToDelete.push(i, i + 1, rawMDash);
        console.log(`286 main.js - PUSH [${i}, ${i + 1}, ${rawMDash}]`);
        // it's because it's a preliminary replacement, we'll encode in the main loop
      } else {
        finalIndexesToDelete.push(i, i + 1);
        console.log(`290 main.js - PUSH [${i}, ${i + 1}]`);
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
    `305 ${`\u001b[${90}m${`================= NEXT STEP. fix broken HTML entity references =================`}\u001b[${39}m`}`
  );

  const entityFixes = fixBrokenEntities(str, { decode: false });
  if (entityFixes && entityFixes.length) {
    // 1. report option as applicable:
    applicableOpts.fixBrokenEntities = true;

    // 2. if option is enabled, apply it:
    if (opts.fixBrokenEntities) {
      str = rangesApply(str, entityFixes);
      console.log(
        `317 after fixing broken entities, str = ${JSON.stringify(
          str,
          null,
          0
        )}`
      );
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  // callback, opts.cb processing outside the tags

  if (opts.cb) {
    // if there are potential HTML tags, we'll need to extract them and process
    // outside them
    if (str.includes("<") || str.includes(">")) {
      console.log(
        `336 ${`\u001b[${90}m${`================= NEXT STEP. HTML tags, pt.1 =================`}\u001b[${39}m`}`
      );

      const outsideTagRanges = invertRanges(
        stripHtml(str, {
          cb: ({ tag, rangesArr }) => {
            console.log(
              `${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
                tag,
                null,
                4
              )}`
            );
            return rangesArr.push(
              tag.lastOpeningBracketAt,
              tag.lastClosingBracketAt + 1
            );
          },
          skipHtmlDecoding: true,
        }).ranges,
        str.length
      ).reduce((accumRanges, currRange) => {
        // if there's difference after callback's result, push it as range
        if (
          str.slice(currRange[0], currRange[1]) !==
          opts.cb(str.slice(currRange[0], currRange[1]))
        ) {
          return accumRanges.concat([
            [
              currRange[0],
              currRange[1],
              opts.cb(str.slice(currRange[0], currRange[1])),
            ],
          ]);
        }
        return accumRanges;
      }, []);
      console.log(
        `374 ${`\u001b[${33}m${`outsideTagRanges`}\u001b[${39}m`} = ${JSON.stringify(
          outsideTagRanges,
          null,
          4
        )}`
      );
      console.log(`380 before cb, str = "${str}"`);
      str = rangesApply(str, outsideTagRanges);
      console.log(`382 after cb, str = "${str}"`);
    } else {
      // if there are no tags, whole string can be processed:
      console.log(`385 before cb, str = "${str}"`);
      str = opts.cb(str);
      console.log(`387 after cb, str = "${str}"`);
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  // tend the HTML tags
  // but maybe our input string doesn't even have any HTML tags?
  if (str.includes("<") || str.includes(">")) {
    console.log(
      `398 ${`\u001b[${90}m${`================= NEXT STEP. HTML tags, pt.2 =================`}\u001b[${39}m`}`
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
      proposedReturn,
    }) => {
      console.log(
        `418 main.js: ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
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
        console.log(`432 tag confirmed`);
        applicableOpts.stripHtml = true;
        console.log(
          `435 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.stripHtml = ${
            applicableOpts.stripHtml
          }`
        );

        // 1. add range from bracket to bracket to ignores list:
        skipArr.push(
          tag.lastOpeningBracketAt,
          tag.lastClosingBracketAt ? tag.lastClosingBracketAt + 1 : str.length
        );
        console.log(
          `446 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to skipArr [${
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
          console.log(`459 strip tag clauses`);

          // take care of tags listed under opts.stripHtmlAddNewLine
          if (
            opts.stripHtmlAddNewLine.length &&
            opts.stripHtmlAddNewLine.some(
              (tagName) =>
                (tagName.startsWith("/") &&
                  tag.slashPresent &&
                  tag.name.toLowerCase() === tagName.slice(1)) ||
                (!tagName.startsWith("/") &&
                  !tag.slashPresent &&
                  tag.name.toLowerCase() === tagName)
            )
          ) {
            console.log(`474 opts.stripHtmlAddNewLine clauses`);

            applicableOpts.removeLineBreaks = true;
            console.log(
              `478 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.removeLineBreaks`}\u001b[${39}m`} = ${
                applicableOpts.removeLineBreaks
              }`
            );

            if (!opts.removeLineBreaks) {
              applicableOpts.replaceLineBreaks = true;
              console.log(
                `486 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.replaceLineBreaks`}\u001b[${39}m`} = ${
                  applicableOpts.replaceLineBreaks
                }`
              );

              if (opts.replaceLineBreaks) {
                applicableOpts.useXHTML = true;
                console.log(
                  `494 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.useXHTML`}\u001b[${39}m`} = ${
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
                `511 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  [
                    deleteFrom,
                    deleteTo,
                    `${
                      opts.replaceLineBreaks
                        ? `<br${opts.useXHTML ? "/" : ""}>`
                        : ""
                    }\n`,
                  ],
                  null,
                  0
                )}`
              );
              console.log(
                `526 FINALLY, finalIndexesToDelete.current() = ${JSON.stringify(
                  finalIndexesToDelete.current(),
                  null,
                  4
                )}`
              );
            } else {
              finalIndexesToDelete.push(proposedReturn);
              console.log(
                `535 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  proposedReturn,
                  null,
                  4
                )}`
              );
            }
          } else {
            console.log(
              `544 didn't fell into opts.stripHtmlAddNewLine clauses`
            );
            finalIndexesToDelete.push(proposedReturn);
            skipArr.push(proposedReturn);
            console.log(
              `549 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to ${`\u001b[${33}m${`finalIndexesToDelete`}\u001b[${39}m`} and ${`\u001b[${33}m${`skipArr`}\u001b[${39}m`} ${JSON.stringify(
                proposedReturn,
                null,
                4
              )}`
            );
          }
        } else {
          console.log("557 - not stripping tags");
          // 3. add closing slash on void tags if XHTML mode is on
          if (voidTags.includes(tag.name.toLowerCase())) {
            //
            // IF A VOID TAG
            //

            applicableOpts.useXHTML = true;
            console.log(
              `566 it's a void tag. ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.useXHTML = ${
                applicableOpts.useXHTML
              }`
            );

            if (
              str[left(str, tag.lastClosingBracketAt)] !== "/" &&
              tag.lastClosingBracketAt
            ) {
              if (opts.useXHTML) {
                console.log(
                  `577 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
                .every((char) => !char.trim() || char === "/")
            ) {
              console.log(
                `601 remove whitespace/slashes ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  tag.lastOpeningBracketAt + 1
                }, ${tag.nameStarts}]`
              );
              finalIndexesToDelete.push(
                tag.lastOpeningBracketAt + 1,
                tag.nameStarts
              );
            }

            console.log(
              `612 finalIndexesToDelete.current() = ${JSON.stringify(
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
              console.log("625");
              if (str[left(str, left(str, tag.lastClosingBracketAt))] === "/") {
                applicableOpts.useXHTML = true;
                console.log(
                  `629 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.useXHTML = ${
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
                    `652 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} chomped [${chompLeft(
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
                  `667 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                    tag.slashPresent
                  }, ${tag.lastClosingBracketAt}]`
                );
                finalIndexesToDelete.push(
                  tag.slashPresent,
                  tag.lastClosingBracketAt
                );
              }
            }
          }
          //
          // IF NOT A VOID TAG
          //

          // 6. if it's not a void tag and there's slash on a wrong side, correct it
          else if (
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

          console.log(
            `701 finalIndexesToDelete.current() = ${JSON.stringify(
              finalIndexesToDelete.current(),
              null,
              4
            )}`
          );

          // 7. tackle wrong letter case
          if (tag.name.toLowerCase() !== tag.name) {
            console.log(
              `711 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
              `728 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
                `751 whitespace in front of tag name - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  tag.lastOpeningBracketAt + 1
                }, ${tag.nameStarts}]`
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
                .every((char) => !char.trim() || char === "/")
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
                `775 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  tag.lastOpeningBracketAt + 1
                }, ${tag.nameStarts}, ${"/"}]`
              );
            }
          }
        }

        // 10. if it's a BR, take a note of its closing bracket's location:
        if (tag.name.toLowerCase() === "br" && tag.lastClosingBracketAt) {
          brClosingBracketIndexesArr.push(tag.lastClosingBracketAt);
          console.log(
            `787 brClosingBracketIndexesArr now = ${JSON.stringify(
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
          !str[tag.lastOpeningBracketAt - 1].trim()
        ) {
          console.log(`802 - ul/li prep`);
          // if there's whitespace in front,
          finalIndexesToDelete.push(
            leftStopAtNewLines(str, tag.lastOpeningBracketAt) + 1,
            tag.lastOpeningBracketAt
          );
          console.log(
            `809 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
              leftStopAtNewLines(str, tag.lastOpeningBracketAt) + 1
            }, ${tag.lastOpeningBracketAt}]`
          );
        }

        // 12. remove whitespace before closing bracket
        if (
          str[tag.lastClosingBracketAt - 1] &&
          !str[tag.lastClosingBracketAt - 1].trim()
        ) {
          finalIndexesToDelete.push(
            left(str, tag.lastClosingBracketAt) + 1,
            tag.lastClosingBracketAt
          );
          console.log(
            `825 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
              left(str, tag.lastClosingBracketAt) + 1
            }, ${tag.lastClosingBracketAt}]`
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
    });
  }

  console.log(
    `859 ${str.includes("<") || str.includes(">") ? "" : "no tags found"}`
  );
  console.log(
    `862 ${`\u001b[${33}m${`rangesArr`}\u001b[${39}m`}.current() = ${JSON.stringify(
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
    `877 ${`\u001b[${90}m${`================= NEXT STEP. Process outside tags =================`}\u001b[${39}m`}`
  );

  console.log(`880 call processOutside()`);
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
        endOfLine,
        opts.cb
      ),
    true
  );
  console.log(
    `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m looping done \u001b[${36}m${`===============================`}\u001b[${39}m`
  );

  console.log(
    `905 back to main.js(): ${`\u001b[${33}m${`str`}\u001b[${39}m`}=${JSON.stringify(
      str,
      null,
      0
    )}\n---\n${`\u001b[${33}m${`rangesArr.current()`}\u001b[${39}m`} = ${JSON.stringify(
      finalIndexesToDelete.current(),
      null,
      4
    )}`
  );
  console.log(
    `916 ${`\u001b[${33}m${`applicableOpts`}\u001b[${39}m`} = ${JSON.stringify(
      applicableOpts,
      null,
      4
    )}`
  );

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `927 ${`\u001b[${90}m${`================= NEXT STEP. apply+wipe =================`}\u001b[${39}m`}`
  );

  console.log(
    `931 ${`\u001b[${33}m${`str`}\u001b[${39}m`} before apply+wipe: ${JSON.stringify(
      str,
      null,
      4
    )}`
  );
  applyAndWipe();
  console.log(
    `939 ${`\u001b[${33}m${`str`}\u001b[${39}m`} after apply+wipe: ${JSON.stringify(
      str,
      null,
      4
    )}`
  );
  // patch up spaces in front of <br/>
  str = str.replace(/ (<br[/]?>)/g, "$1");

  str = str.replace(/(\r\n|\r|\n){3,}/g, `${endOfLine}${endOfLine}`);
  console.log(
    `950 ${`\u001b[${33}m${`str`}\u001b[${39}m`} after str.replace: ${JSON.stringify(
      str,
      null,
      4
    )}`
  );
  console.log(
    `957 ${`\u001b[${33}m${`finalIndexesToDelete.current()`}\u001b[${39}m`} = ${JSON.stringify(
      finalIndexesToDelete.current(),
      null,
      4
    )}`
  );

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `968 ${`\u001b[${90}m${`================= NEXT STEP. widows =================`}\u001b[${39}m`}`
  );
  console.log(
    `971 ${`\u001b[${33}m${`skipArr.current()`}\u001b[${39}m`} = ${JSON.stringify(
      skipArr.current(),
      null,
      4
    )}`
  );

  // remove widow words
  const widowFixes = removeWidows(str, {
    ignore: "all",
    convertEntities: opts.convertEntities, // full-on setup
    targetLanguage: "html",
    UKPostcodes: true, // full-on setup
    hyphens: opts.convertDashes, // full-on setup
    tagRanges: skipArr.current(),
  });
  console.log(
    `988 ${`\u001b[${33}m${`widowFixes`}\u001b[${39}m`} = ${JSON.stringify(
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
        `999 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.removeWidows`}\u001b[${39}m`} = true`
      );
      if (opts.removeWidows) {
        applicableOpts.convertEntities = true;
        console.log(
          `1004 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.convertEntities`}\u001b[${39}m`} = true`
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
        `1015 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.convertEntities`}\u001b[${39}m`} = true`
      );
    }

    // 3. if option is enabled, apply it:
    if (opts.removeWidows) {
      str = widowFixes.res;
      console.log(
        `1023 after fixing widows, str = ${JSON.stringify(str, null, 0)}`
      );
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `1032 ${`\u001b[${90}m${`================= NEXT STEP. linebreaks =================`}\u001b[${39}m`}`
  );

  console.log("\n\n\n");
  console.log(
    `1037 STEP#6 ${`\u001b[${33}m${`brClosingBracketIndexesArr`}\u001b[${39}m`} = ${JSON.stringify(
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
    `1059 ${`\u001b[${90}m${`================= NEXT STEP. collapse =================`}\u001b[${39}m`}`
  );

  console.log(`1062 str before collapsing: ${JSON.stringify(str, null, 0)}`);
  str = collapse(str, {
    trimLines: true,
    recogniseHTML: false,
  });
  console.log(`1067 str after collapsing: ${JSON.stringify(str, null, 0)}`);

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  console.log(
    `1073 ${`\u001b[${90}m${`================= NEXT STEP. final =================`}\u001b[${39}m`}`
  );

  console.log(
    `1077 FINAL RESULT:\n${JSON.stringify(
      {
        res: rangesApply(str, finalIndexesToDelete.current()),
      },
      null,
      4
    )}`
  );
  return {
    res: rangesApply(str, finalIndexesToDelete.current()),
    applicableOpts,
  };
}

export { det, defaultOpts as opts, version };

// -----------------------------------------------------------------------------
