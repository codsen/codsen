import { left, right, leftStopAtNewLines, chompLeft } from "string-left-right";
import { fixEnt } from "string-fix-broken-named-entities";
import { removeWidows } from "string-remove-widows";
import { rProcessOutside } from "ranges-process-outside";
import { collapse } from "string-collapse-white-space";
import { trimSpaces } from "string-trim-spaces-only";
import { stripHtml, CbObj } from "string-strip-html";
import { rInvert } from "ranges-invert";
import { rApply } from "ranges-apply";
import ansiRegex from "ansi-regex";
import { Ranges } from "ranges-push";
import he from "he";

import { version as v } from "../package.json";
import { processCharacter } from "./processCharacter";
import {
  removeTrailingSlash,
  defaultOpts,
  Opts,
  State,
  Res,
  voidTags,
  isLetter,
  isNumber,
  isLowercaseLetter,
  rawMDash,
  EndOfLineVal,
  rightSingleQuote,
  ApplicableOpts,
} from "./util";

declare let DEV: boolean;

const version: string = v;
// import escape from "js-string-escape";

/**
 * Extracts, cleans and encodes text
 */
function det(str: string, inputOpts?: Partial<Opts>): Res {
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

  if (inputOpts?.cb && typeof inputOpts.cb !== "function") {
    throw new Error(
      `detergent(): [THROW_ID_03] Options callback, opts.cb must be a function, not ${typeof inputOpts.cb} (value was given as:\n${JSON.stringify(
        inputOpts.cb,
        null,
        0
      )})`
    );
  }

  let opts = { ...defaultOpts, ...inputOpts };

  if (!["lf", "crlf", "cr"].includes(opts.eol)) {
    opts.eol = "lf";
  }

  // prepare applicable rules object. It is a clone of the default opts object
  // (which comes from util.js), where for starters all values are turned off,
  // then upon traversal, each applicable rule sets the key to true, it does not
  // matter, rule is enabled in opts or not. We just mark that particular
  // options setting could be applicable.
  let applicableOpts: ApplicableOpts = {
    fixBrokenEntities: false,
    removeWidows: false,
    convertEntities: false,
    convertDashes: false,
    convertApostrophes: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    useXHTML: false,
    dontEncodeNonLatin: false,
    addMissingSpaces: false,
    convertDotsToEllipsis: false,
    stripHtml: false,
    eol: false,
  };

  //
  // vars and internal functions
  // --------------------------------------------------------------------------

  let endOfLineVal: EndOfLineVal = "\n";
  if (opts.eol === "crlf") {
    endOfLineVal = "\r\n";
  } else if (opts.eol === "cr") {
    endOfLineVal = "\r";
  }

  let brClosingBracketIndexesArr: number[] = [];

  // We need to track what actions need to be done. Each action (a range) is
  // an array of two elements: from index and to index. It means what to delete.
  // There can be third element, a string, which means what to insert instead.
  let finalIndexesToDelete = new Ranges({
    limitToBeAddedWhitespace: false,
  }); // the main container to gather the ranges. Ranges is a JS class.

  // When we process the input, we gather the information about it and sometimes
  // it's very efficient to stop processing chunks once they're cleared.
  // For example, any index ranges taken by HTML entities can be ignored after
  // those index range are identified. It's even a hassle otherwise: entities
  // contain ampersands and if we didn't ignore entity ranges, we'd have to
  // take measures to ignore ampersand encoding.
  let skipArr = new Ranges();

  function applyAndWipe(): void {
    str = rApply(str, finalIndexesToDelete.current());
    finalIndexesToDelete.wipe();
    // skipArr.wipe();
  }
  function isNum(something: any): boolean {
    return Number.isInteger(something);
  }
  let state: State = {
    onUrlCurrently: false,
  };

  DEV &&
    console.log(
      `136 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
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

  DEV &&
    console.log(
      `179 ${`\u001b[${90}m${`================= NEXT STEP. Initial =================`}\u001b[${39}m`}`
    );
  str = trimSpaces(str.replace(ansiRegex(), "").replace(/\u200A/g, " "), {
    cr: true,
    lf: true,
    tab: true,
    space: true,
    nbsp: false,
  }).res;

  DEV &&
    console.log(
      `191 after the initial trim, str = ${JSON.stringify(str, null, 0)}`
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

  DEV &&
    console.log(
      `210 "str" after decoding, before collapsing: ${JSON.stringify(
        str,
        null,
        0
      )}`
    );
  str = collapse(str, {
    trimLines: true,
    removeEmptyLines: true,
    limitConsecutiveEmptyLinesTo: 1,
  }).result;

  DEV &&
    console.log(`223 "str" after collapsing: ${JSON.stringify(str, null, 0)}`);

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  // preliminary loop through to remove/replace characters which later might
  // be needed to be considered when replacing others in the main loop;
  // that's mostly some nasties converted into spaces - those spaces will
  // be needed to already by there in the main loop

  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i].charCodeAt(0) === 65533) {
      // REPLACEMENT CHARACTER, \uFFFD, or "�"
      DEV && console.log(`236 main.js: entering charcode #65533 catch clauses`);
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

        let replacement = opts.convertApostrophes ? rightSingleQuote : "'";
        finalIndexesToDelete.push(i, i + 1, `${replacement}`);

        DEV &&
          console.log(`297 main.js - PUSH [${i}, ${i + 1}, ${replacement}]`);
        applicableOpts.convertApostrophes = true;

        DEV &&
          console.log(
            `302 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.convertApostrophes`}\u001b[${39}m`} = ${JSON.stringify(
              applicableOpts.convertApostrophes,
              null,
              4
            )}`
          );
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
        DEV && console.log(`318 main.js - PUSH [${i}, ${i + 1}, ${rawMDash}]`);
        // it's because it's a preliminary replacement, we'll encode in the main loop
      } else {
        finalIndexesToDelete.push(i, i + 1);
        DEV && console.log(`322 main.js - PUSH [${i}, ${i + 1}]`);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  applyAndWipe();

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  // fix broken named HTML entities, if any:

  DEV &&
    console.log(
      `339 ${`\u001b[${90}m${`================= NEXT STEP. fix broken HTML entity references =================`}\u001b[${39}m`}`
    );

  let entityFixes = fixEnt(str, { decode: false });
  if (entityFixes?.length) {
    // 1. report option as applicable:
    applicableOpts.fixBrokenEntities = true;

    DEV &&
      console.log(
        `349 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.fixBrokenEntities`}\u001b[${39}m`} = ${JSON.stringify(
          applicableOpts.fixBrokenEntities,
          null,
          4
        )}`
      );

    // 2. if option is enabled, apply it:
    if (opts.fixBrokenEntities) {
      str = rApply(str, entityFixes);

      DEV &&
        console.log(
          `362 after fixing broken entities, str = ${JSON.stringify(
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

  if (typeof opts.cb === "function") {
    // if there are potential HTML tags, we'll need to extract them and process
    // outside them
    if (str.includes("<") || str.includes(">")) {
      DEV &&
        console.log(
          `382 ${`\u001b[${90}m${`================= NEXT STEP. HTML tags, pt.1 =================`}\u001b[${39}m`}`
        );

      let calcRanges = stripHtml(str, {
        cb: ({ tag, rangesArr }) => {
          DEV &&
            console.log(
              `${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
                tag,
                null,
                4
              )}`
            );
          rangesArr.push(
            tag.lastOpeningBracketAt,
            tag.lastClosingBracketAt + 1
          );
        },
        skipHtmlDecoding: true,
      }).ranges;

      let outsideTagRanges: Range[] = (
        rInvert(calcRanges, str.length) || []
      ).reduce((accumRanges, currRange) => {
        // if there's difference after callback's result, push it as range
        if (
          typeof opts.cb === "function" &&
          str.slice(currRange[0], currRange[1]) !==
            opts.cb(str.slice(currRange[0], currRange[1]))
        ) {
          return (accumRanges as any).concat([
            [
              currRange[0],
              currRange[1],
              opts.cb(str.slice(currRange[0], currRange[1])),
            ],
          ]);
        }
        return accumRanges;
      }, []);

      DEV &&
        console.log(
          `425 ${`\u001b[${33}m${`outsideTagRanges`}\u001b[${39}m`} = ${JSON.stringify(
            outsideTagRanges,
            null,
            4
          )}`
        );
      if (Array.isArray(outsideTagRanges) && outsideTagRanges.length) {
        DEV && console.log(`432 before cb, str = "${str}"`);
        str = rApply(str, outsideTagRanges as any);
        DEV && console.log(`434 after cb, str = "${str}"`);
      }
    } else {
      // if there are no tags, whole string can be processed:
      DEV && console.log(`438 before cb, str = "${str}"`);
      str = opts.cb(str);
      DEV && console.log(`440 after cb, str = "${str}"`);
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  // tend the HTML tags
  // but maybe our input string doesn't even have any HTML tags?
  if (str.includes("<") || str.includes(">")) {
    DEV &&
      console.log(
        `452 ${`\u001b[${90}m${`================= NEXT STEP. HTML tags, pt.2 =================`}\u001b[${39}m`}`
      );

    // submit all HTML tags to be skipped from now on:
    // we're using callback interface to ignore strictly from bracket to bracket
    // (including brackets), without range extension which normally would get
    // added in callback's "deleteFrom" / "deleteTo" equivalent.
    // Normally, we wipe whole tag and its surrounding whitespace, then replace
    // it with space if needed, otherwise just delete that range.
    // This extended range is a liability in light of widow word removal processes
    // down the line - those won't "see" some of the spaces around tags!

    // prepare the callback for string-strip-html
    let cb = ({
      tag,
      deleteFrom,
      deleteTo,
      // insert,
      // rangesArr
      proposedReturn,
    }: CbObj): void => {
      DEV &&
        console.log(
          `475 main.js: ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
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
        DEV && console.log(`489 tag confirmed`);
        applicableOpts.stripHtml = true;

        DEV &&
          console.log(
            `494 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.stripHtml`}\u001b[${39}m`} = ${JSON.stringify(
              applicableOpts.stripHtml,
              null,
              4
            )}`
          );

        // 1. add range from bracket to bracket to ignores list:
        skipArr.push(
          tag.lastOpeningBracketAt,
          tag.lastClosingBracketAt ? tag.lastClosingBracketAt + 1 : str.length
        );

        DEV &&
          console.log(
            `509 PUSH to skipArr [${tag.lastOpeningBracketAt}, ${
              tag.lastClosingBracketAt
                ? tag.lastClosingBracketAt + 1
                : str.length
            }]`
          );

        // 2. strip tag if opts.stripHtml is enabled
        if (
          opts.stripHtml &&
          (!tag.name ||
            (typeof tag.name === "string" &&
              !opts.stripHtmlButIgnoreTags.includes(tag.name.toLowerCase())))
        ) {
          // 1. strip tag
          DEV && console.log(`524 strip tag clauses`);

          // take care of tags listed under opts.stripHtmlAddNewLine
          if (
            Array.isArray(opts.stripHtmlAddNewLine) &&
            opts.stripHtmlAddNewLine.length &&
            opts.stripHtmlAddNewLine.some(
              (tagName) =>
                (tagName.startsWith("/") &&
                  // present slash will be reported for both frontal and
                  // self-closing cases: </td> and <br/> but we want only
                  // frontal, so...
                  tag.slashPresent &&
                  // additional check, is slash frontal
                  tag.slashPresent < tag.nameEnds &&
                  typeof tag.name === "string" &&
                  tag.name.toLowerCase() === tagName.slice(1)) ||
                (!tagName.startsWith("/") &&
                  !(
                    // slash is present
                    (
                      tag.slashPresent &&
                      // and it's frontal (slash as in </td> not <br/>)
                      tag.slashPresent < tag.nameEnds
                    )
                  ) &&
                  typeof tag.name === "string" &&
                  tag.name.toLowerCase() === removeTrailingSlash(tagName))
            )
          ) {
            DEV && console.log(`554 opts.stripHtmlAddNewLine clauses`);

            applicableOpts.removeLineBreaks = true;

            DEV &&
              console.log(
                `560 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.removeLineBreaks`}\u001b[${39}m`} = ${JSON.stringify(
                  applicableOpts.removeLineBreaks,
                  null,
                  4
                )}`
              );

            if (
              !opts.removeLineBreaks &&
              typeof deleteFrom === "number" &&
              typeof deleteTo === "number"
            ) {
              applicableOpts.replaceLineBreaks = true;

              DEV &&
                console.log(
                  `576 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.replaceLineBreaks`}\u001b[${39}m`} = ${JSON.stringify(
                    applicableOpts.replaceLineBreaks,
                    null,
                    4
                  )}`
                );

              if (opts.replaceLineBreaks) {
                applicableOpts.useXHTML = true;

                DEV &&
                  console.log(
                    `588 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.useXHTML`}\u001b[${39}m`} = ${JSON.stringify(
                      applicableOpts.useXHTML,
                      null,
                      4
                    )}`
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

              DEV &&
                console.log(
                  `609 PUSH ${JSON.stringify(
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

              DEV &&
                console.log(
                  `626 FINALLY, finalIndexesToDelete.current() = ${JSON.stringify(
                    finalIndexesToDelete.current(),
                    null,
                    4
                  )}`
                );
            } else {
              finalIndexesToDelete.push(proposedReturn as any);

              DEV &&
                console.log(
                  `637 PUSH ${JSON.stringify(proposedReturn, null, 4)}`
                );
            }
          } else {
            DEV &&
              console.log(
                `643 didn't fell into opts.stripHtmlAddNewLine clauses`
              );
            finalIndexesToDelete.push(proposedReturn as any);
            skipArr.push(proposedReturn as any);

            DEV &&
              console.log(
                `650 PUSH to finalIndexesToDelete and ${`\u001b[${33}m${`skipArr`}\u001b[${39}m`} ${JSON.stringify(
                  proposedReturn,
                  null,
                  4
                )}`
              );
          }
        } else {
          DEV && console.log("658 - not stripping tags");
          // 3. add closing slash on void tags if XHTML mode is on
          if (
            typeof tag.name === "string" &&
            voidTags.includes(tag.name.toLowerCase())
          ) {
            //
            // IF A VOID TAG
            //

            applicableOpts.useXHTML = true;

            DEV &&
              console.log(
                `672 it's a void tag. ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.useXHTML = ${
                  applicableOpts.useXHTML
                }`
              );

            if (
              str[left(str, tag.lastClosingBracketAt) as number] !== "/" &&
              tag.lastClosingBracketAt
            ) {
              DEV && console.log(`681`);
              if (opts.useXHTML) {
                DEV &&
                  console.log(
                    `685 PUSH [${tag.lastClosingBracketAt}, ${tag.lastClosingBracketAt}, "/"]`
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
              DEV &&
                console.log(
                  `708 remove whitespace/slashes PUSH [${
                    tag.lastOpeningBracketAt + 1
                  }, ${tag.nameStarts}]`
                );
              finalIndexesToDelete.push(
                tag.lastOpeningBracketAt + 1,
                tag.nameStarts
              );
            }

            DEV &&
              console.log(
                `720 finalIndexesToDelete.current() = ${JSON.stringify(
                  finalIndexesToDelete.current(),
                  null,
                  4
                )}`
              );

            // 5. remove closing slash from void tags is XHTML mode is off
            // or excessive, multiple closing slashes
            if (
              tag.slashPresent &&
              str[left(str, tag.lastClosingBracketAt) as number] === "/"
            ) {
              DEV && console.log("733");
              if (
                str[
                  left(
                    str,
                    left(str, tag.lastClosingBracketAt) as number
                  ) as number
                ] === "/"
              ) {
                applicableOpts.useXHTML = true;

                DEV &&
                  console.log(
                    `746 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.useXHTML = ${
                      applicableOpts.useXHTML
                    }`
                  );

                if (
                  !opts.useXHTML ||
                  (typeof chompLeft(
                    str,
                    tag.lastClosingBracketAt,
                    { mode: 2 },
                    "/"
                  ) === "number" &&
                    str.slice(
                      chompLeft(
                        str,
                        tag.lastClosingBracketAt,
                        { mode: 2 },
                        "/"
                      ) as number,
                      tag.lastClosingBracketAt
                    ) !== "/")
                ) {
                  // multiple closing slashes
                  finalIndexesToDelete.push(
                    // chomp mode 2: hungrily chomp all whitespace except newlines
                    // for example:
                    // chompLeft("a  b c b c  x y", 12, { mode: 2 }, "b", "c")
                    // => 1
                    chompLeft(
                      str,
                      tag.lastClosingBracketAt,
                      { mode: 2 },
                      "/"
                    ) as number,
                    tag.lastClosingBracketAt,
                    opts.useXHTML ? "/" : undefined
                  );

                  DEV &&
                    console.log(
                      `787 PUSH chomped [${chompLeft(
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
                typeof left(str, tag.slashPresent) !== "number" ||
                str.slice(
                  (left(str, tag.slashPresent) as number) + 1,
                  tag.lastClosingBracketAt
                ) !== "/"
              ) {
                let calculatedFrom =
                  (left(str, tag.slashPresent) as number) + 1;
                let calculatedTo = tag.lastClosingBracketAt;
                let whatToInsert = opts.useXHTML ? "/" : null;

                if (whatToInsert) {
                  DEV &&
                    console.log(
                      `813 PUSH [${calculatedFrom}, ${calculatedTo}, ${whatToInsert}]`
                    );
                  finalIndexesToDelete.push(
                    calculatedFrom,
                    calculatedTo,
                    whatToInsert
                  );
                } else {
                  DEV &&
                    console.log(
                      `823 PUSH [${calculatedFrom}, ${calculatedTo}]`
                    );
                  finalIndexesToDelete.push(calculatedFrom, calculatedTo);
                }
              }
            }
          }
          //
          // IF NOT A VOID TAG
          //

          // 6. if it's not a void tag and there's slash on a wrong side, correct it
          else if (
            tag.slashPresent &&
            str[left(str, tag.lastClosingBracketAt) as number] === "/"
          ) {
            // 6-1. remove the wrong slash
            finalIndexesToDelete.push(
              chompLeft(
                str,
                tag.lastClosingBracketAt,
                { mode: 2 },
                "/"
              ) as number,
              tag.lastClosingBracketAt
            );
            // 6-2. add where it needs to be
            finalIndexesToDelete.push(
              tag.lastOpeningBracketAt + 1,
              tag.lastOpeningBracketAt + 1,
              "/"
            );
          }

          DEV &&
            console.log(
              `859 finalIndexesToDelete.current() = ${JSON.stringify(
                finalIndexesToDelete.current(),
                null,
                4
              )}`
            );

          // 7. remove whitespace after tag name like <tr >
          if (
            `/>`.includes(str[right(str, tag.nameEnds - 1) as number]) &&
            (right(str, tag.nameEnds - 1) || 0) > tag.nameEnds
          ) {
            DEV &&
              console.log(
                `873 PUSH [${tag.nameEnds}, ${right(str, tag.nameEnds - 1)}]`
              );
            finalIndexesToDelete.push(
              tag.nameEnds,
              right(str, tag.nameEnds - 1) as number
            );
          }

          // 8. remove whitespace in front of tag name, considering closing slashes
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

              DEV &&
                console.log(
                  `896 whitespace in front of tag name - PUSH [${
                    tag.lastOpeningBracketAt + 1
                  }, ${tag.nameStarts}]`
                );
              finalIndexesToDelete.push(
                tag.lastOpeningBracketAt + 1,
                tag.nameStarts
              );
            } else if (
              typeof tag.name === "string" &&
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

              DEV &&
                console.log(
                  `923 PUSH [${tag.lastOpeningBracketAt + 1}, ${
                    tag.nameStarts
                  }, ${"/"}]`
                );
            }
          }
        }

        // 9. if it's a BR, take a note of its closing bracket's location:
        if (
          typeof tag.name === "string" &&
          tag.name.toLowerCase() === "br" &&
          tag.lastClosingBracketAt
        ) {
          brClosingBracketIndexesArr.push(tag.lastClosingBracketAt);

          DEV &&
            console.log(
              `941 brClosingBracketIndexesArr now = ${JSON.stringify(
                brClosingBracketIndexesArr,
                null,
                0
              )}`
            );
        }

        // 10. remove whitespace in front of UL/LI tags
        if (
          typeof tag.name === "string" &&
          ["ul", "li"].includes(tag.name.toLowerCase()) &&
          !opts.removeLineBreaks &&
          str[tag.lastOpeningBracketAt - 1] &&
          !str[tag.lastOpeningBracketAt - 1].trim() &&
          typeof tag.lastOpeningBracketAt === "number" &&
          typeof leftStopAtNewLines(str, tag.lastOpeningBracketAt) === "number"
        ) {
          DEV && console.log(`959 - ul/li prep`);
          // if there's whitespace in front,
          finalIndexesToDelete.push(
            (leftStopAtNewLines(str, tag.lastOpeningBracketAt) as number) + 1,
            tag.lastOpeningBracketAt
          );

          DEV &&
            console.log(
              `968 PUSH [${
                (leftStopAtNewLines(str, tag.lastOpeningBracketAt) as number) +
                1
              }, ${tag.lastOpeningBracketAt}]`
            );
        }

        // 11. remove whitespace before closing bracket
        if (
          str[tag.lastClosingBracketAt - 1] &&
          !str[tag.lastClosingBracketAt - 1].trim() &&
          typeof tag.lastClosingBracketAt === "number" &&
          typeof left(str, tag.lastClosingBracketAt) === "number"
        ) {
          finalIndexesToDelete.push(
            (left(str, tag.lastClosingBracketAt) as number) + 1,
            tag.lastClosingBracketAt
          );

          DEV &&
            console.log(
              `989 PUSH [${
                (left(str, tag.lastClosingBracketAt) as number) + 1
              }, ${tag.lastClosingBracketAt}]`
            );
        }
      }

      // LOGGING:

      DEV &&
        console.log(
          `${`\u001b[${90}m${`========================================\nENDING finalIndexesToDelete[]:\n`}\u001b[${39}m`}`
        );

      DEV &&
        console.log(
          `${`\u001b[${90}m${JSON.stringify(
            finalIndexesToDelete.current(),
            null,
            4
          )}\u001b[${39}m`}`
        );
    };

    DEV &&
      console.log(
        `${`\u001b[${90}m${`========================================`}\u001b[${39}m`}`
      );

    // since we rely on callback interface, we don't need to assign the function
    // to a result, we perform all the processing within the callback "cb":
    stripHtml(str, {
      cb,
      trimOnlySpaces: true,
      ignoreTags: opts.stripHtml ? opts.stripHtmlButIgnoreTags : [],
      skipHtmlDecoding: true,
    });
  }

  DEV &&
    console.log(
      `1030 ${str.includes("<") || str.includes(">") ? "" : "no tags found"}`
    );

  DEV &&
    console.log(
      `1035 ${`\u001b[${33}m${`rangesArr`}\u001b[${39}m`}.current() = ${JSON.stringify(
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

  DEV &&
    console.log(
      `1051 ${`\u001b[${90}m${`================= NEXT STEP. Process outside tags =================`}\u001b[${39}m`}`
    );

  DEV && console.log(`1054 call rProcessOutside()`);
  rProcessOutside(
    str,
    skipArr.current(),
    (idxFrom, idxTo, offsetBy) => {
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
        endOfLineVal
      );
    },
    true
  );

  DEV &&
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m looping done \u001b[${36}m${`===============================`}\u001b[${39}m`
    );

  DEV &&
    console.log(
      `1082 back to main.js(): ${`\u001b[${33}m${`str`}\u001b[${39}m`}=${JSON.stringify(
        str,
        null,
        0
      )}\n---\n${`\u001b[${33}m${`rangesArr.current()`}\u001b[${39}m`} = ${JSON.stringify(
        finalIndexesToDelete.current(),
        null,
        4
      )}`
    );

  DEV &&
    console.log(
      `1095 ${`\u001b[${33}m${`applicableOpts`}\u001b[${39}m`} = ${JSON.stringify(
        applicableOpts,
        null,
        4
      )}`
    );

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  DEV &&
    console.log(
      `1107 ${`\u001b[${90}m${`================= NEXT STEP. apply+wipe =================`}\u001b[${39}m`}`
    );

  DEV &&
    console.log(
      `1112 ${`\u001b[${33}m${`str`}\u001b[${39}m`} before apply+wipe: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  applyAndWipe();

  DEV &&
    console.log(
      `1122 ${`\u001b[${33}m${`str`}\u001b[${39}m`} after apply+wipe: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  // patch up spaces in front of <br/>
  str = str.replace(/ (<br[/]?>)/g, "$1");

  str = str.replace(/(\r\n|\r|\n){3,}/g, `${endOfLineVal}${endOfLineVal}`);

  DEV &&
    console.log(
      `1135 ${`\u001b[${33}m${`str`}\u001b[${39}m`} after str.replace: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );

  DEV &&
    console.log(
      `1144 ${`\u001b[${33}m${`finalIndexesToDelete.current()`}\u001b[${39}m`} = ${JSON.stringify(
        finalIndexesToDelete.current(),
        null,
        4
      )}`
    );

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  DEV &&
    console.log(
      `1156 ${`\u001b[${90}m${`================= NEXT STEP. widows =================`}\u001b[${39}m`}`
    );

  DEV &&
    console.log(
      `1161 ${`\u001b[${33}m${`skipArr.current()`}\u001b[${39}m`} = ${JSON.stringify(
        skipArr.current(),
        null,
        4
      )}`
    );

  // remove widow words
  let widowFixes = removeWidows(str, {
    ignore: "all",
    convertEntities: opts.convertEntities, // full-on setup
    targetLanguage: "html",
    UKPostcodes: true, // full-on setup
    hyphens: opts.convertDashes, // full-on setup
    tagRanges: skipArr.current(),
  });

  DEV &&
    console.log(
      `1180 ${`\u001b[${33}m${`widowFixes`}\u001b[${39}m`} = ${JSON.stringify(
        widowFixes,
        null,
        4
      )}`
    );
  if (widowFixes?.ranges?.length) {
    // 1. report option as potentially applicable:
    if (!applicableOpts.removeWidows && widowFixes.whatWasDone.removeWidows) {
      applicableOpts.removeWidows = true;

      DEV &&
        console.log(
          `1193 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.removeWidows`}\u001b[${39}m`} = true`
        );
      if (opts.removeWidows) {
        applicableOpts.convertEntities = true;

        DEV &&
          console.log(
            `1200 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.convertEntities`}\u001b[${39}m`} = true`
          );
      }
    }
    // 2.
    if (
      !applicableOpts.convertEntities &&
      widowFixes.whatWasDone.convertEntities
    ) {
      applicableOpts.convertEntities = true;

      DEV &&
        console.log(
          `1213 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.convertEntities`}\u001b[${39}m`} = true`
        );
    }

    // 3. if option is enabled, apply it:
    if (opts.removeWidows) {
      str = widowFixes.res;

      DEV &&
        console.log(
          `1223 after fixing widows, str = ${JSON.stringify(str, null, 0)}`
        );
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  DEV &&
    console.log(
      `1233 ${`\u001b[${90}m${`================= NEXT STEP. linebreaks =================`}\u001b[${39}m`}`
    );

  DEV && console.log("\n\n\n");

  DEV &&
    console.log(
      `1240 STEP#6 ${`\u001b[${33}m${`brClosingBracketIndexesArr`}\u001b[${39}m`} = ${JSON.stringify(
        brClosingBracketIndexesArr,
        null,
        4
      )}\n\n\n`
    );

  // replace line breaks

  DEV &&
    console.log(
      `1251 ███████████████████████████████████████ ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  if (str.trim() !== str.replace(/\r\n|\r|\n/gm, " ").trim()) {
    // 1. report opts.removeLineBreaks might be applicable
    applicableOpts.removeLineBreaks = true;

    DEV &&
      console.log(
        `1263 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.removeLineBreaks`}\u001b[${39}m`} = ${
          applicableOpts.removeLineBreaks
        }`
      );

    // 2. apply if option is on
    if (opts.removeLineBreaks) {
      str = str.replace(/\r\n|\r|\n/gm, " ");
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  DEV &&
    console.log(
      `1279 ${`\u001b[${90}m${`================= NEXT STEP. collapse =================`}\u001b[${39}m`}`
    );

  DEV &&
    console.log(`1283 str before collapsing: ${JSON.stringify(str, null, 0)}`);

  str = collapse(str, {
    trimLines: true,
  }).result;

  DEV &&
    console.log(`1290 str after collapsing: ${JSON.stringify(str, null, 0)}`);

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  DEV &&
    console.log(
      `1297 ${`\u001b[${90}m${`================= NEXT STEP. final =================`}\u001b[${39}m`}`
    );

  rApply(str, finalIndexesToDelete.current())
    .split("")
    .forEach((key, idx) => {
      DEV &&
        console.log(
          `1305 - #${idx}: ${`\u001b[${33}m${`key`}\u001b[${39}m`} = ${JSON.stringify(
            key,
            null,
            4
          )} (charcode ${`\u001b[${35}m${key.charCodeAt(0)}\u001b[${39}m`})`
        );
    });

  DEV &&
    console.log(
      `1315 FINAL RESULT:\n${JSON.stringify(
        {
          res: rApply(str, finalIndexesToDelete.current()),
          applicableOpts,
        },
        null,
        4
      )}`
    );
  return {
    res: rApply(str, finalIndexesToDelete.current()),
    applicableOpts,
  };
}

export { det, defaultOpts as opts, version };

// -----------------------------------------------------------------------------
