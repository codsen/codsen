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
  voidTags,
  isLetter,
  isNumberChar,
  isLowercaseLetter,
  rawMDash,
  rightSingleQuote,
  resolveEolSetting,
  EolChar,
} from "codsen-utils";
import { defaultOpts, Opts, State, Res, ApplicableOpts } from "./util";

declare let DEV: boolean;

const version: string = v;
// import escape from "js-string-escape";

/**
 * Extracts, cleans and encodes text
 */
function det(str: string, opts?: Partial<Opts>): Res {
  DEV && console.log(`038 START ███████████████████████████████████████`);
  DEV &&
    console.log(
      `041 initial ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4
      )}`
    );
  //
  // input validation
  // ---------------------------------------------------------------------------

  if (typeof str !== "string") {
    throw new Error(
      `detergent(): [THROW_ID_01] the first input argument must be of a string type, not ${typeof str}`
    );
  }

  if (opts && typeof opts !== "object") {
    throw new Error(
      `detergent(): [THROW_ID_02] Options object must be a plain object, not ${typeof opts}`
    );
  }

  if (opts?.cb && typeof opts.cb !== "function") {
    throw new Error(
      `detergent(): [THROW_ID_03] Options callback, resolvedOpts.cb must be a function, not ${typeof opts.cb} (value was given as:\n${JSON.stringify(
        opts.cb,
        null,
        0
      )})`
    );
  }
  if (
    opts?.eol &&
    (typeof opts.eol !== "string" || !["lf", "crlf", "cr"].includes(opts.eol))
  ) {
    throw new Error(
      `detergent(): [THROW_ID_04] Options "eol" (end of line character) setting must be either falsy (will default to "lf") or one of: "lf", "crlf", "cr" but it was given as: ${JSON.stringify(
        opts.eol,
        null,
        0
      )})`
    );
  }

  let resolvedOpts = { ...defaultOpts, ...opts };

  // prepare applicable rules object. It is a clone of the default resolvedOpts object
  // (which comes from util.js), where for starters all values are turned off,
  // then upon traversal, each applicable rule sets the key to true, it does not
  // matter, rule is enabled in resolvedOpts or not. We just mark that particular
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
  // variables and internal functions
  // --------------------------------------------------------------------------

  let eolChar: EolChar = resolveEolSetting(str, opts?.eol);
  DEV &&
    console.log(
      `115 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`endOfLineVal`}\u001b[${39}m`} = ${JSON.stringify(
        eolChar,
        null,
        4
      )}`
    );

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
      `153 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
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
      `196 ${`\u001b[${90}m${`================= NEXT STEP. Initial =================`}\u001b[${39}m`}`
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
      `208 after the initial trim, str = ${JSON.stringify(str, null, 0)}`
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
      `227 "str" after decoding, before collapsing: ${JSON.stringify(
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
    console.log(`240 "str" after collapsing: ${JSON.stringify(str, null, 0)}`);

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  // preliminary loop through to remove/replace characters which later might
  // be needed to be considered when replacing others in the main loop;
  // that's mostly some nasties converted into spaces - those spaces will
  // be needed to already by there in the main loop

  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i].charCodeAt(0) === 65533) {
      // REPLACEMENT CHARACTER, \uFFFD, or "�"
      DEV && console.log(`253 main.js: entering charcode #65533 catch clauses`);
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
          (!str[i + 1] || (!isLetter(str[i + 1]) && !isNumberChar(str[i + 1]))))
      ) {
        // 1. case of n�t, for example, couldn�t (n + � + t),
        // or case of <letter>�s, for example your�s (letter + � + s).
        // 2. case of we�re, you�re, they�re
        // 3. case of we�ve, you�ve, they�ve
        // 4. case of I�ll, you�ll, he'�ll, she�ll, we�ll, they�ll, it�ll

        let replacement = resolvedOpts.convertApostrophes
          ? rightSingleQuote
          : "'";
        finalIndexesToDelete.push(i, i + 1, `${replacement}`);

        DEV &&
          console.log(`316 main.js - PUSH [${i}, ${i + 1}, ${replacement}]`);
        applicableOpts.convertApostrophes = true;

        DEV &&
          console.log(
            `321 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.convertApostrophes`}\u001b[${39}m`} = ${JSON.stringify(
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
        // we don't encode here, no matter if resolvedOpts.convertEntities is on:
        finalIndexesToDelete.push(i, i + 1, rawMDash);
        DEV && console.log(`337 main.js - PUSH [${i}, ${i + 1}, ${rawMDash}]`);
        // it's because it's a preliminary replacement, we'll encode in the main loop
      } else {
        finalIndexesToDelete.push(i, i + 1);
        DEV && console.log(`341 main.js - PUSH [${i}, ${i + 1}]`);
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
      `358 ${`\u001b[${90}m${`================= NEXT STEP. fix broken HTML entity references =================`}\u001b[${39}m`}`
    );

  let entityFixes = fixEnt(str, { decode: false });
  if (entityFixes?.length) {
    // 1. report option as applicable:
    applicableOpts.fixBrokenEntities = true;

    DEV &&
      console.log(
        `368 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.fixBrokenEntities`}\u001b[${39}m`} = ${JSON.stringify(
          applicableOpts.fixBrokenEntities,
          null,
          4
        )}`
      );

    // 2. if option is enabled, apply it:
    if (resolvedOpts.fixBrokenEntities) {
      str = rApply(str, entityFixes);

      DEV &&
        console.log(
          `381 after fixing broken entities, str = ${JSON.stringify(
            str,
            null,
            0
          )}`
        );
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  // callback, resolvedOpts.cb processing outside the tags

  if (typeof resolvedOpts.cb === "function") {
    // if there are potential HTML tags, we'll need to extract them and process
    // outside them
    if (str.includes("<") || str.includes(">")) {
      DEV &&
        console.log(
          `401 ${`\u001b[${90}m${`================= NEXT STEP. HTML tags, pt.1 =================`}\u001b[${39}m`}`
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
          typeof resolvedOpts.cb === "function" &&
          str.slice(currRange[0], currRange[1]) !==
            resolvedOpts.cb(str.slice(currRange[0], currRange[1]))
        ) {
          return (accumRanges as any).concat([
            [
              currRange[0],
              currRange[1],
              resolvedOpts.cb(str.slice(currRange[0], currRange[1])),
            ],
          ]);
        }
        return accumRanges;
      }, []);

      DEV &&
        console.log(
          `444 ${`\u001b[${33}m${`outsideTagRanges`}\u001b[${39}m`} = ${JSON.stringify(
            outsideTagRanges,
            null,
            4
          )}`
        );
      if (Array.isArray(outsideTagRanges) && outsideTagRanges.length) {
        DEV && console.log(`451 before cb, str = "${str}"`);
        str = rApply(str, outsideTagRanges as any);
        DEV && console.log(`453 after cb, str = "${str}"`);
      }
    } else {
      // if there are no tags, whole string can be processed:
      DEV && console.log(`457 before cb, str = "${str}"`);
      str = resolvedOpts.cb(str);
      DEV && console.log(`459 after cb, str = "${str}"`);
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  // tend the HTML tags
  // but maybe our input string doesn't even have any HTML tags?
  if (str.includes("<") || str.includes(">")) {
    DEV &&
      console.log(
        `471 ${`\u001b[${90}m${`================= NEXT STEP. HTML tags, pt.2 =================`}\u001b[${39}m`}`
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
          `494 main.js: ${`\u001b[${33}m${`tag`}\u001b[${39}m`} = ${JSON.stringify(
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
        DEV && console.log(`508 tag confirmed`);
        applicableOpts.stripHtml = true;

        DEV &&
          console.log(
            `513 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.stripHtml`}\u001b[${39}m`} = ${JSON.stringify(
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
            `528 PUSH to skipArr [${tag.lastOpeningBracketAt}, ${
              tag.lastClosingBracketAt
                ? tag.lastClosingBracketAt + 1
                : str.length
            }]`
          );

        // 2. strip tag if resolvedOpts.stripHtml is enabled
        if (
          resolvedOpts.stripHtml &&
          (!tag.name ||
            (typeof tag.name === "string" &&
              !resolvedOpts.stripHtmlButIgnoreTags.includes(
                tag.name.toLowerCase()
              )))
        ) {
          // 1. strip tag
          DEV && console.log(`545 strip tag clauses`);

          // take care of tags listed under resolvedOpts.stripHtmlAddNewLine
          if (
            Array.isArray(resolvedOpts.stripHtmlAddNewLine) &&
            resolvedOpts.stripHtmlAddNewLine.length &&
            resolvedOpts.stripHtmlAddNewLine.some(
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
            DEV && console.log(`575 resolvedOpts.stripHtmlAddNewLine clauses`);

            applicableOpts.removeLineBreaks = true;

            DEV &&
              console.log(
                `581 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.removeLineBreaks`}\u001b[${39}m`} = ${JSON.stringify(
                  applicableOpts.removeLineBreaks,
                  null,
                  4
                )}`
              );

            if (
              !resolvedOpts.removeLineBreaks &&
              typeof deleteFrom === "number" &&
              typeof deleteTo === "number"
            ) {
              applicableOpts.replaceLineBreaks = true;

              DEV &&
                console.log(
                  `597 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.replaceLineBreaks`}\u001b[${39}m`} = ${JSON.stringify(
                    applicableOpts.replaceLineBreaks,
                    null,
                    4
                  )}`
                );

              if (resolvedOpts.replaceLineBreaks) {
                applicableOpts.useXHTML = true;

                DEV &&
                  console.log(
                    `609 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.useXHTML`}\u001b[${39}m`} = ${JSON.stringify(
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
                  resolvedOpts.replaceLineBreaks
                    ? `<br${resolvedOpts.useXHTML ? "/" : ""}>`
                    : ""
                }\n`
              );

              DEV &&
                console.log(
                  `630 PUSH ${JSON.stringify(
                    [
                      deleteFrom,
                      deleteTo,
                      `${
                        resolvedOpts.replaceLineBreaks
                          ? `<br${resolvedOpts.useXHTML ? "/" : ""}>`
                          : ""
                      }\n`,
                    ],
                    null,
                    0
                  )}`
                );

              DEV &&
                console.log(
                  `647 FINALLY, finalIndexesToDelete.current() = ${JSON.stringify(
                    finalIndexesToDelete.current(),
                    null,
                    4
                  )}`
                );
            } else {
              finalIndexesToDelete.push(proposedReturn as any);

              DEV &&
                console.log(
                  `658 PUSH ${JSON.stringify(proposedReturn, null, 4)}`
                );
            }
          } else {
            DEV &&
              console.log(
                `664 didn't fell into resolvedOpts.stripHtmlAddNewLine clauses`
              );
            finalIndexesToDelete.push(proposedReturn as any);
            skipArr.push(proposedReturn as any);

            DEV &&
              console.log(
                `671 PUSH to finalIndexesToDelete and ${`\u001b[${33}m${`skipArr`}\u001b[${39}m`} ${JSON.stringify(
                  proposedReturn,
                  null,
                  4
                )}`
              );
          }
        } else {
          DEV && console.log("679 - not stripping tags");
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
                `693 it's a void tag. ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.useXHTML = ${
                  applicableOpts.useXHTML
                }`
              );

            if (
              str[left(str, tag.lastClosingBracketAt) as number] !== "/" &&
              tag.lastClosingBracketAt
            ) {
              DEV && console.log(`702`);
              if (resolvedOpts.useXHTML) {
                DEV &&
                  console.log(
                    `706 PUSH [${tag.lastClosingBracketAt}, ${tag.lastClosingBracketAt}, "/"]`
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
                  `729 remove whitespace/slashes PUSH [${
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
                `741 finalIndexesToDelete.current() = ${JSON.stringify(
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
              DEV && console.log("754");
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
                    `767 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} applicableOpts.useXHTML = ${
                      applicableOpts.useXHTML
                    }`
                  );

                if (
                  !resolvedOpts.useXHTML ||
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
                    resolvedOpts.useXHTML ? "/" : undefined
                  );

                  DEV &&
                    console.log(
                      `808 PUSH chomped [${chompLeft(
                        str,
                        tag.lastClosingBracketAt,
                        { mode: 2 },
                        "/"
                      )}, ${tag.lastClosingBracketAt}, ${
                        resolvedOpts.useXHTML ? "/" : undefined
                      }]`
                    );
                }
              } else if (
                !resolvedOpts.useXHTML ||
                typeof left(str, tag.slashPresent) !== "number" ||
                str.slice(
                  (left(str, tag.slashPresent) as number) + 1,
                  tag.lastClosingBracketAt
                ) !== "/"
              ) {
                let calculatedFrom =
                  (left(str, tag.slashPresent) as number) + 1;
                let calculatedTo = tag.lastClosingBracketAt;
                let whatToInsert = resolvedOpts.useXHTML ? "/" : null;

                if (whatToInsert) {
                  DEV &&
                    console.log(
                      `834 PUSH [${calculatedFrom}, ${calculatedTo}, ${whatToInsert}]`
                    );
                  finalIndexesToDelete.push(
                    calculatedFrom,
                    calculatedTo,
                    whatToInsert
                  );
                } else {
                  DEV &&
                    console.log(
                      `844 PUSH [${calculatedFrom}, ${calculatedTo}]`
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
              `880 finalIndexesToDelete.current() = ${JSON.stringify(
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
                `894 PUSH [${tag.nameEnds}, ${right(str, tag.nameEnds - 1)}]`
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
                  `917 whitespace in front of tag name - PUSH [${
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
                  `944 PUSH [${tag.lastOpeningBracketAt + 1}, ${
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
              `962 brClosingBracketIndexesArr now = ${JSON.stringify(
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
          !resolvedOpts.removeLineBreaks &&
          str[tag.lastOpeningBracketAt - 1] &&
          !str[tag.lastOpeningBracketAt - 1].trim() &&
          typeof tag.lastOpeningBracketAt === "number" &&
          typeof leftStopAtNewLines(str, tag.lastOpeningBracketAt) === "number"
        ) {
          DEV && console.log(`980 - ul/li prep`);
          // if there's whitespace in front,
          finalIndexesToDelete.push(
            (leftStopAtNewLines(str, tag.lastOpeningBracketAt) as number) + 1,
            tag.lastOpeningBracketAt
          );

          DEV &&
            console.log(
              `989 PUSH [${
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
              `1010 PUSH [${
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
      ignoreTags: resolvedOpts.stripHtml
        ? resolvedOpts.stripHtmlButIgnoreTags
        : [],
      skipHtmlDecoding: true,
    });
  }

  DEV &&
    console.log(
      `1053 ${str.includes("<") || str.includes(">") ? "" : "no tags found"}`
    );

  DEV &&
    console.log(
      `1058 ${`\u001b[${33}m${`rangesArr`}\u001b[${39}m`}.current() = ${JSON.stringify(
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
      `1074 ${`\u001b[${90}m${`================= NEXT STEP. Process outside tags =================`}\u001b[${39}m`}`
    );

  DEV && console.log(`1077 call rProcessOutside()`);
  rProcessOutside(
    str,
    skipArr.current(),
    (idxFrom, idxTo, offsetBy) => {
      processCharacter(
        str,
        resolvedOpts,
        finalIndexesToDelete,
        idxFrom,
        idxTo,
        offsetBy,
        brClosingBracketIndexesArr,
        state,
        applicableOpts,
        eolChar
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
      `1105 back to main.js(): ${`\u001b[${33}m${`str`}\u001b[${39}m`}=${JSON.stringify(
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
      `1118 ${`\u001b[${33}m${`applicableOpts`}\u001b[${39}m`} = ${JSON.stringify(
        applicableOpts,
        null,
        4
      )}`
    );

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  DEV &&
    console.log(
      `1130 ${`\u001b[${90}m${`================= NEXT STEP. apply+wipe =================`}\u001b[${39}m`}`
    );

  DEV &&
    console.log(
      `1135 ${`\u001b[${33}m${`str`}\u001b[${39}m`} before apply+wipe: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  applyAndWipe();

  DEV &&
    console.log(
      `1145 ${`\u001b[${33}m${`str`}\u001b[${39}m`} after apply+wipe: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  // patch up spaces in front of <br/>
  str = str.replace(/ (<br[/]?>)/g, "$1");

  str = str.replace(/(\r\n|\r|\n){3,}/g, `${eolChar}${eolChar}`);

  DEV &&
    console.log(
      `1158 ${`\u001b[${33}m${`str`}\u001b[${39}m`} after str.replace: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );

  DEV &&
    console.log(
      `1167 ${`\u001b[${33}m${`finalIndexesToDelete.current()`}\u001b[${39}m`} = ${JSON.stringify(
        finalIndexesToDelete.current(),
        null,
        4
      )}`
    );

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  DEV &&
    console.log(
      `1179 ${`\u001b[${90}m${`================= NEXT STEP. widows =================`}\u001b[${39}m`}`
    );

  DEV &&
    console.log(
      `1184 ${`\u001b[${33}m${`skipArr.current()`}\u001b[${39}m`} = ${JSON.stringify(
        skipArr.current(),
        null,
        4
      )}`
    );

  // remove widow words
  let widowFixes = removeWidows(str, {
    ignore: "all",
    convertEntities: resolvedOpts.convertEntities, // full-on setup
    targetLanguage: "html",
    UKPostcodes: true, // full-on setup
    hyphens: resolvedOpts.convertDashes, // full-on setup
    tagRanges: skipArr.current(),
  });

  DEV &&
    console.log(
      `1203 ${`\u001b[${33}m${`widowFixes`}\u001b[${39}m`} = ${JSON.stringify(
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
          `1216 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.removeWidows`}\u001b[${39}m`} = true`
        );
      if (resolvedOpts.removeWidows) {
        applicableOpts.convertEntities = true;

        DEV &&
          console.log(
            `1223 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.convertEntities`}\u001b[${39}m`} = true`
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
          `1236 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.convertEntities`}\u001b[${39}m`} = true`
        );
    }

    // 3. if option is enabled, apply it:
    if (resolvedOpts.removeWidows) {
      str = widowFixes.res;

      DEV &&
        console.log(
          `1246 after fixing widows, str = ${JSON.stringify(str, null, 0)}`
        );
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  DEV &&
    console.log(
      `1256 ${`\u001b[${90}m${`================= NEXT STEP. linebreaks =================`}\u001b[${39}m`}`
    );

  DEV && console.log("\n\n\n");

  DEV &&
    console.log(
      `1263 STEP#6 ${`\u001b[${33}m${`brClosingBracketIndexesArr`}\u001b[${39}m`} = ${JSON.stringify(
        brClosingBracketIndexesArr,
        null,
        4
      )}\n\n\n`
    );

  // replace line breaks

  DEV &&
    console.log(
      `1274 ███████████████████████████████████████ ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  if (str.trim() !== str.replace(/\r\n|\r|\n/gm, " ").trim()) {
    // 1. report resolvedOpts.removeLineBreaks might be applicable
    applicableOpts.removeLineBreaks = true;

    DEV &&
      console.log(
        `1286 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`applicableOpts.removeLineBreaks`}\u001b[${39}m`} = ${
          applicableOpts.removeLineBreaks
        }`
      );

    // 2. apply if option is on
    if (resolvedOpts.removeLineBreaks) {
      str = str.replace(/\r\n|\r|\n/gm, " ");
    }
  }

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  DEV &&
    console.log(
      `1302 ${`\u001b[${90}m${`================= NEXT STEP. collapse =================`}\u001b[${39}m`}`
    );

  DEV &&
    console.log(`1306 str before collapsing: ${JSON.stringify(str, null, 0)}`);

  str = collapse(str, {
    trimLines: true,
  }).result;

  DEV &&
    console.log(`1313 str after collapsing: ${JSON.stringify(str, null, 0)}`);

  // ---------------------------------------------------------------------------
  // NEXT STEP.

  DEV &&
    console.log(
      `1320 ${`\u001b[${90}m${`================= NEXT STEP. final =================`}\u001b[${39}m`}`
    );

  rApply(str, finalIndexesToDelete.current())
    .split("")
    .forEach((key, idx) => {
      DEV &&
        console.log(
          `1328 - #${idx}: ${`\u001b[${33}m${`key`}\u001b[${39}m`} = ${JSON.stringify(
            key,
            null,
            4
          )} (charcode ${`\u001b[${35}m${key.charCodeAt(0)}\u001b[${39}m`})`
        );
    });

  DEV &&
    console.log(
      `1338 FINAL RESULT:\n${JSON.stringify(
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

export { det, defaultOpts as opts, version, Opts, Res };

// -----------------------------------------------------------------------------
