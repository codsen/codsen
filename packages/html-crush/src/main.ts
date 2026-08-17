import {
  formatDiagnosticValue,
  isLetter,
  isPlainObject as isObj,
  isStr,
} from "codsen-utils";
import { rApply } from "ranges-apply";
import { Ranges } from "ranges-push";
import { left, right } from "string-left-right";
import { matchLeft, matchRight, matchRightIncl } from "string-match-left-right";
import { expander } from "string-range-expander";
import type { Ranges as RangesType } from "../../../ops/typedefs/common";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;
export interface Opts {
  lineLengthLimit: number;
  removeIndentations: boolean;
  removeLineBreaks: boolean;
  removeHTMLComments: boolean | 0 | 1 | 2;
  removeCSSComments: boolean;
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
  breakToTheLeftOf: string[];
  mindTheInlineTags: string[];
}

const defaults: Opts = {
  lineLengthLimit: 500,
  removeIndentations: true,
  removeLineBreaks: false,
  removeHTMLComments: false,
  removeCSSComments: true,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  breakToTheLeftOf: [
    "</td",
    "<html",
    "</html",
    "<head",
    "</head",
    "<meta",
    "<link",
    "<table",
    "<script",
    "</script",
    "<!DOCTYPE",
    "<style",
    "</style",
    "<title",
    "<body",
    "@media",
    "</body",
    "<!--[if",
    "<!--<![endif",
    "<![endif]",
  ],
  mindTheInlineTags: [
    "a",
    "abbr",
    "acronym",
    "audio",
    "b",
    "bdi",
    "bdo",
    "big",
    "br",
    "button",
    "canvas",
    "cite",
    "code",
    "data",
    "datalist",
    "del",
    "dfn",
    "em",
    "embed",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "map",
    "mark",
    "meter",
    "noscript",
    "object",
    "output",
    "picture",
    "progress",
    "q",
    "ruby",
    "s",
    "samp",
    "script",
    "select",
    "slot",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
    "svg",
    "template",
    "textarea",
    "time",
    "u",
    "tt",
    "var",
    "video",
    "wbr",
  ],
};

export interface Res {
  /** Best-effort completion statistics for user-facing feedback.
   * Observational fields do not affect the transformation. */
  log: {
    timeTakenInMilliseconds: number;
    originalLength: number;
    cleanedLength: number;
    bytesSaved: number;
    percentageReducedOfOriginal: number;
  };
  applicableOpts: {
    removeHTMLComments: boolean;
    removeCSSComments: boolean;
  };
  ranges: RangesType;
  result: string;
}

/**
 * Minifies HTML/CSS: valid or broken, pure or mixed with other languages
 */
function crush(str: string, opts?: Partial<Opts>): Res {
  const start = Date.now();
  // insurance:
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error(
        "html-crush/crush(): [THROW_ID_01] the first input argument is completely missing! It should be given as string.",
      );
    } else {
      throw new Error(
        `html-crush/crush(): [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${formatDiagnosticValue(str, 4)}`,
      );
    }
  }

  if (opts && !isObj(opts)) {
    throw new Error(
      `html-crush/crush(): [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ${typeof opts}, equal to ${formatDiagnosticValue(opts, 4)}`,
    );
  }

  if (
    opts &&
    Array.isArray(opts.breakToTheLeftOf) &&
    opts.breakToTheLeftOf.length
  ) {
    for (let z = 0, len = opts.breakToTheLeftOf.length; z < len; z++) {
      if (!isStr(opts.breakToTheLeftOf[z])) {
        throw new TypeError(
          `html-crush/crush(): [THROW_ID_04] the resolvedOpts.breakToTheLeftOf array contains non-string elements! For example, element at index ${z} is of a type "${typeof opts
            .breakToTheLeftOf[
            z
          ]}" and is equal to:\n${formatDiagnosticValue(opts.breakToTheLeftOf[z], 4)}`,
        );
      }
    }
  }

  const finalIndexesToDelete = new Ranges({
    limitToBeAddedWhitespace: true,
  });
  let resolvedOpts: Opts = { ...defaults, ...opts };
  DEV &&
    console.log(
      `0187 FINAL ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}`,
    );

  // normalize the resolvedOpts.removeHTMLComments
  if (typeof resolvedOpts.removeHTMLComments === "boolean") {
    resolvedOpts.removeHTMLComments = resolvedOpts.removeHTMLComments ? 1 : 0;
  }

  let breakToTheLeftOfFirstLetters = "";
  if (
    Array.isArray(resolvedOpts.breakToTheLeftOf) &&
    resolvedOpts.breakToTheLeftOf.length
  ) {
    breakToTheLeftOfFirstLetters = [
      ...new Set(resolvedOpts.breakToTheLeftOf.map((val) => val[0])),
    ].join("");
  }
  DEV &&
    console.log(
      `0210 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`breakToTheLeftOfFirstLetters`}\u001b[${39}m`} = ${JSON.stringify(
        [...breakToTheLeftOfFirstLetters],
        null,
        4,
      )}`,
    );

  // DEV && console.log(
  //   `0218 ${`\u001b[${33}m${`breakToTheLeftOfFirstLetters`}\u001b[${39}m`} = ${JSON.stringify(
  //     breakToTheLeftOfFirstLetters,
  //     null,
  //     4
  //   )}`
  // );
  //
  // DEV && console.log("\n");
  // DEV && console.log(
  //   `0227 ${`\u001b[${33}m${`██ ██ ██`}\u001b[${39}m`} ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
  //     resolvedOpts,
  //     null,
  //     4
  //   )}`
  // );

  let applicableOpts = {
    removeHTMLComments: false,
    removeCSSComments: false,
  };
  let lastLinebreak = null;
  let whitespaceStartedAt = null;
  let nonWhitespaceCharMet = false;
  let countCharactersPerLine = 0;

  // new characters-per-line counter
  let cpl = 0;

  let withinStyleTag = false;
  let withinHTMLConditional = false; // <!--[if lte mso 11]> etc
  let withinInlineStyle = null;
  let styleCommentStartedAt = null;
  let htmlCommentStartedAt = null;
  let scriptStartedAt = null;

  // main do nothing switch, used to skip chunks of code and perform no action
  let doNothing;

  // we use staging "from" and "to" to pre-emptively mark the chunks
  // of whitespace that will be either: a) replaced with a space; or
  // b) replaced with linebreak. If resolvedOpts.removeLineBreaks is on,
  // if we need to break where the particular whitespace chunk is
  // located, we replace it with line break. Otherwise, if
  // the next chunk of characters that follows it fits on one line,
  // we replace it with a single space.
  let stageFrom = null;
  let stageTo = null;
  let stageAdd = null;

  let tagName = null;
  let tagNameStartsAt = null;
  let leftTagName = null;

  let CHARS_BREAK_ON_THE_RIGHT_OF_THEM = `>};`;
  let CHARS_BREAK_ON_THE_LEFT_OF_THEM = `<`;
  let CHARS_DONT_BREAK_ON_THE_LEFT_OF_THEM = `!`;
  let DELETE_TIGHTLY_IF_ON_LEFT_IS = `>`;
  let DELETE_TIGHTLY_IF_ON_RIGHT_IS = `<`;

  let set = `{},:;<>~+`;
  let DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS = set;
  let DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS = set;

  // the first non-whitespace character turns this flag off:
  let beginningOfAFile = true;
  // it will be used to trim start of the file.

  let len = str.length;
  let midLen = Math.floor(len / 2);
  let leavePercForLastStage = 0.01; // in range of [0, 1]

  // ceil - total range which is allocated to the main processing
  let ceil;
  if (resolvedOpts.reportProgressFunc) {
    ceil = Math.floor(
      resolvedOpts.reportProgressFuncTo -
        (resolvedOpts.reportProgressFuncTo -
          resolvedOpts.reportProgressFuncFrom) *
          leavePercForLastStage -
        resolvedOpts.reportProgressFuncFrom,
    );
    DEV &&
      console.log(
        `0301 ${`\u001b[${33}m${`ceil`}\u001b[${39}m`} = ${JSON.stringify(
          ceil,
          null,
          4,
        )}`,
      );
  }

  // one more round to collapse the whitespace to:
  // 1. Tackle indentations
  // 2. Remove excessive whitespace between strings on each line (not touching indentations)

  // progress-wise, 98% will be allocated to loop, rest 2% - to range applies and
  // final return clauses

  let currentPercentageDone;
  let lastPercentage = 0;

  let lineEnding = `\n`;
  if (str.includes(`\r\n`)) {
    lineEnding = `\r\n`;
  } else if (str.includes(`\r`)) {
    lineEnding = `\r`;
  }

  if (len) {
    for (let i = 0; i < len; i++) {
      //
      //
      //
      //
      //                    TOP
      //
      //
      //
      //

      // Logging:
      // ███████████████████████████████████████
      DEV &&
        console.log(
          `0342 \n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
            str[i]?.trim() ? str[i] : JSON.stringify(str[i], null, 0)
          }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`,
        );

      // Report the progress. We'll allocate 98% of the progress bar to this stage
      if (resolvedOpts.reportProgressFunc) {
        if (len > 1000 && len < 2000) {
          if (i === midLen) {
            resolvedOpts.reportProgressFunc(
              Math.floor(
                (resolvedOpts.reportProgressFuncTo -
                  resolvedOpts.reportProgressFuncFrom) /
                  2,
              ),
            );
          }
        } else if (len >= 2000) {
          // defaults:
          // resolvedOpts.reportProgressFuncFrom = 0
          // resolvedOpts.reportProgressFuncTo = 100

          currentPercentageDone =
            resolvedOpts.reportProgressFuncFrom +
            Math.floor((i / len) * (ceil || 1));

          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            resolvedOpts.reportProgressFunc(currentPercentageDone);
          }
        }
      }

      // count characters-per-line
      cpl++;

      // catch the sequence of two closing curly braces
      // ███████████████████████████████████████
      // MUST BE BEFORE doNothing is toggled off because of
      // @media screen{div{color:{{brandWhite}}}}
      //                                       ^
      //                        imagine we're here
      if (
        !doNothing &&
        withinStyleTag &&
        str[i] === "}" &&
        str[i - 1] === "}"
      ) {
        DEV &&
          console.log(
            `0392 ${`\u001b[${32}m${`TWO CLOSING CURLY BRACES`}\u001b[${39}m`}`,
          );
        if (countCharactersPerLine + 1 >= resolvedOpts.lineLengthLimit) {
          DEV && console.log(`0395 line length exceeded!`);
          finalIndexesToDelete.push(i, i, lineEnding);
          DEV &&
            console.log(
              `0399 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                [i, i, lineEnding],
                null,
                0,
              )}`,
            );
          DEV &&
            console.log(
              `0407 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${0}`,
            );
          countCharactersPerLine = 0;
        } else {
          DEV &&
            console.log(`0412 within line length limit, overwrite the stage`);
          stageFrom = i;
          stageTo = i;
          stageAdd = " ";
          DEV &&
            console.log(
              `0418 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} stageFrom = ${stageFrom}; stageTo = ${stageTo}; stageAdd = "${stageAdd}"`,
            );
        }
      }

      // turn off doNothing if marker passed
      // ███████████████████████████████████████

      if (doNothing && typeof doNothing === "number" && i >= doNothing) {
        doNothing = undefined;
        DEV && console.log(`0428 TURN OFF doNothing`);
      }

      // catch ending of </script...
      // ███████████████████████████████████████

      if (
        scriptStartedAt !== null &&
        str.startsWith("</script", i) &&
        !isLetter(str[i + 8])
      ) {
        DEV && console.log(`0439 ENDING OF A SCRIPT TAG CAUGHT`);
        // 1. if there is a line break, chunk of whitespace and </script>,
        // delete that chunk of whitespace, leave line break.
        // If there's non-whitespace character, chunk of whitespace and </script>,
        // delete that chunk of whitespace.
        // Basically, traverse backwards from "<" of "</script>", stop either
        // at first line break or non-whitespace character.

        if (
          (resolvedOpts.removeIndentations || resolvedOpts.removeLineBreaks) &&
          i > 0 &&
          str[~-i] &&
          !str[~-i].trim()
        ) {
          // march backwards
          DEV &&
            console.log(`0455 \u001b[${36}m${`march backwards`}\u001b[${39}m`);
          for (let y = i; y--; ) {
            DEV &&
              console.log(
                `0459 \u001b[${36}m${`str[${y}] = ${JSON.stringify(
                  str[y],
                  null,
                  0,
                )}`}\u001b[${39}m`,
              );
            if (str[y] === "\n" || str[y] === "\r" || str[y].trim()) {
              if (y + 1 < i) {
                DEV &&
                  console.log(
                    `0469 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                      y + 1
                    }, ${i}]`,
                  );
                finalIndexesToDelete.push(y + 1, i);
              }
              DEV && console.log(`\u001b[${36}m${`0475 BREAK`}\u001b[${39}m`);
              break;
            }
          }
        }

        // 2.
        scriptStartedAt = null;
        doNothing = false;
        DEV &&
          console.log(
            `0486 SET ${`\u001b[${33}m${`scriptStartedAt`}\u001b[${39}m`} = null, ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = false`,
          );
        i += 8;
        DEV && console.log(`0489 OFFSET i now = ${i}, then CONTINUE`);
        continue;
      }

      // catch start of <script...
      // ███████████████████████████████████████

      if (
        !doNothing &&
        !withinStyleTag &&
        str.startsWith("<script", i) &&
        !isLetter(str[i + 7])
      ) {
        DEV && console.log(`0502 STARTING OF A SCRIPT TAG CAUGHT`);
        scriptStartedAt = i;
        doNothing = true;
        let whatToInsert = "";
        if (
          (resolvedOpts.removeLineBreaks || resolvedOpts.removeIndentations) &&
          whitespaceStartedAt !== null
        ) {
          if (whitespaceStartedAt > 0) {
            whatToInsert = lineEnding;
          }
          finalIndexesToDelete.push(whitespaceStartedAt, i, whatToInsert);
          DEV &&
            console.log(
              `0516 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                whitespaceStartedAt + 1
              }, ${i}, ${JSON.stringify(whatToInsert, null, 0)}]`,
            );
        }

        whitespaceStartedAt = null;
        lastLinebreak = null;
        DEV &&
          console.log(
            `0526 SET ${`\u001b[${33}m${`scriptStartedAt`}\u001b[${39}m`} = ${i}, ${`\u001b[${33}m${`scriptStartedAt`}\u001b[${39}m`} = true, RESET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`lastLinebreak`}\u001b[${39}m`} = null`,
          );
      }

      //
      //
      //
      //
      //
      //
      //
      //
      //             MIDDLE
      //
      //
      //
      //
      //
      //
      //
      //

      // catch ending of the tag's name
      // ███████████████████████████████████████
      if (
        tagNameStartsAt !== null &&
        tagName === null &&
        !/\w/.test(str[i]) // not a letter
      ) {
        tagName = str.slice(tagNameStartsAt, i);
        DEV &&
          console.log(
            `0558 SET ${`\u001b[${33}m${`tagName`}\u001b[${39}m`} = ${tagName}`,
          );

        // check for inner tag whitespace
        let idxOnTheRight = right(str, ~-i);
        if (
          typeof idxOnTheRight === "number" &&
          str[idxOnTheRight] === ">" &&
          !str[i].trim() &&
          right(str, i)
        ) {
          finalIndexesToDelete.push(i, right(str, i) as number);
          DEV &&
            console.log(
              `0572 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${right(
                str,
                i,
              )}]`,
            );
        } else if (
          idxOnTheRight &&
          str[idxOnTheRight] === "/" &&
          str[right(str, idxOnTheRight) as number] === ">"
        ) {
          // if there's a space in front of "/>"
          if (!str[i].trim() && right(str, i)) {
            finalIndexesToDelete.push(i, right(str, i) as number);
            DEV &&
              console.log(
                `0587 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${right(
                  str,
                  i,
                )}]`,
              );
          }
          // if there's space between slash and bracket
          if (str[idxOnTheRight + 1] !== ">" && right(str, idxOnTheRight + 1)) {
            finalIndexesToDelete.push(
              idxOnTheRight + 1,
              right(str, idxOnTheRight + 1) as number,
            );
            DEV &&
              console.log(
                `0601 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  idxOnTheRight + 1
                }, ${right(str, right(str, idxOnTheRight + 1))}]`,
              );
          }
        }
      }

      // catch a tag's opening bracket
      // ███████████████████████████████████████
      if (
        !doNothing &&
        !withinStyleTag &&
        !withinInlineStyle &&
        str[~-i] === "<" &&
        tagNameStartsAt === null
      ) {
        if (/\w/.test(str[i])) {
          tagNameStartsAt = i;
          DEV && console.log(`0620 SET tagNameStartsAt = ${tagNameStartsAt}`);
        } else if (
          str[right(str, ~-i) as number] === "/" &&
          /\w/.test(str[right(str, right(str, ~-i)) as number] || "")
        ) {
          tagNameStartsAt = right(str, right(str, ~-i));
          DEV && console.log(`0626 SET tagNameStartsAt = ${tagNameStartsAt}`);
        }
      }

      // catch an end of CSS comments
      // ███████████████████████████████████████

      if (
        !doNothing &&
        (withinStyleTag || withinInlineStyle) &&
        styleCommentStartedAt !== null &&
        str[i] === "*" &&
        str[i + 1] === "/"
      ) {
        DEV &&
          console.log(
            `0642 ${`\u001b[${32}m${`ENDING OF A CSS COMMENT CAUGHT`}\u001b[${39}m`}`,
          );
        // stage:
        [stageFrom, stageTo] = expander({
          str,
          from: styleCommentStartedAt,
          to: i + 2,
          ifLeftSideIncludesThisThenCropTightly:
            DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS || "",
          ifRightSideIncludesThisThenCropTightly:
            DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS || "",
        });
        DEV &&
          console.log(
            `0656 EXPANDED TO ${JSON.stringify([stageFrom, stageTo], null, 0)}`,
          );

        // reset marker:
        styleCommentStartedAt = null;
        DEV &&
          console.log(
            `0663 SET ${`\u001b[${33}m${`styleCommentStartedAt`}\u001b[${39}m`} = null`,
          );

        if (stageFrom != null) {
          finalIndexesToDelete.push(stageFrom, stageTo);
          DEV &&
            console.log(
              `0670 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to final [${stageFrom}, ${stageTo}]`,
            );
        } else {
          countCharactersPerLine += 1;
          DEV &&
            console.log(
              `0676 ${`\u001b[${33}m${`countCharactersPerLine++`}\u001b[${39}m`}, now = ${JSON.stringify(
                countCharactersPerLine,
                null,
                4,
              )}`,
            );
          i += 1;
        }
        // DEV && console.log(`0684 CONTINUE`);
        // continue;

        doNothing = i + 2;
        DEV && console.log(`0688 SET doNothing = ${doNothing}`);
      }

      // catch a start of CSS comments
      // ███████████████████████████████████████

      if (
        !doNothing &&
        (withinStyleTag || withinInlineStyle) &&
        styleCommentStartedAt === null &&
        str[i] === "/" &&
        str[i + 1] === "*"
      ) {
        DEV &&
          console.log(
            `0703 ${`\u001b[${32}m${`STARTING OF A CSS COMMENT CAUGHT`}\u001b[${39}m`}`,
          );

        // independently of options settings, mark the options setting
        // "removeCSSComments" as applicable:
        if (!applicableOpts.removeCSSComments) {
          applicableOpts.removeCSSComments = true;
          DEV &&
            console.log(
              `0712 SET ${`\u001b[${33}m${`applicableOpts.removeCSSComments`}\u001b[${39}m`} = ${JSON.stringify(
                applicableOpts.removeCSSComments,
                null,
                4,
              )}; now applicableOpts = ${JSON.stringify(
                applicableOpts,
                null,
                4,
              )}`,
            );
        }

        if (resolvedOpts.removeCSSComments) {
          styleCommentStartedAt = i;
          DEV &&
            console.log(
              `0728 SET ${`\u001b[${33}m${`styleCommentStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
                styleCommentStartedAt,
                null,
                4,
              )}`,
            );
        }
      }

      // catch an ending of mso conditional tags
      // ███████████████████████████████████████
      if (withinHTMLConditional && str.startsWith("![endif", i + 1)) {
        DEV &&
          console.log(
            `0742 ${`\u001b[${36}m${`██ CONDITIONAL'S CLOSING CAUGHT`}\u001b[${39}m`}`,
          );
        withinHTMLConditional = false;
        DEV &&
          console.log(
            `0747 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinHTMLConditional`}\u001b[${39}m`} = ${withinHTMLConditional}`,
          );
      }

      // catch an end of HTML comment
      // ███████████████████████████████████████

      if (
        !doNothing &&
        !withinStyleTag &&
        !withinInlineStyle &&
        htmlCommentStartedAt !== null
      ) {
        let distanceFromHereToCommentEnding;

        if (str.startsWith("-->", i)) {
          DEV &&
            console.log(
              `0765 ${`\u001b[${32}m${`ENDING OF AN HTML COMMENT CAUGHT`}\u001b[${39}m`}`,
            );
          distanceFromHereToCommentEnding = 3;
        } else if (str[i] === ">" && str[i - 1] === "]") {
          distanceFromHereToCommentEnding = 1;
        }

        if (distanceFromHereToCommentEnding) {
          // stage:
          [stageFrom, stageTo] = expander({
            str,
            from: htmlCommentStartedAt,
            to: i + distanceFromHereToCommentEnding,
          });
          DEV &&
            console.log(
              `0781 EXPANDED TO ${JSON.stringify(
                [stageFrom, stageTo],
                null,
                0,
              )}`,
            );

          // reset marker:
          htmlCommentStartedAt = null;
          DEV &&
            console.log(
              `0792 SET ${`\u001b[${33}m${`htmlCommentStartedAt`}\u001b[${39}m`} = null`,
            );

          if (stageFrom != null) {
            // it depends is there any character allowance left from the
            // line length limit or not
            DEV &&
              console.log(
                `0800 ${`\u001b[${33}m${`cpl`}\u001b[${39}m`} = ${JSON.stringify(
                  cpl,
                  null,
                  4,
                )}`,
              );
            if (
              resolvedOpts.lineLengthLimit &&
              cpl - (stageTo - stageFrom) >= resolvedOpts.lineLengthLimit
            ) {
              finalIndexesToDelete.push(stageFrom, stageTo, lineEnding);
              DEV &&
                console.log(
                  `0813 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to final [${stageFrom}, ${stageTo}, ${JSON.stringify(
                    lineEnding,
                    null,
                    0,
                  )}]`,
                );
              // Currently we're not on the bracket ">" of the comment
              // closing "-->", we're at the start of it, that first
              // dash. This means, we'll still traverse to the end
              // of this comment tag, before the actual "reset" should
              // happen.
              // Luckily we know how many characters are there left
              // to traverse until the comment's ending is reached -
              // "distanceFromHereToCommentEnding".
              cpl = -distanceFromHereToCommentEnding;
              // here we've reset cpl to some negative value, like -3
              DEV &&
                console.log(
                  `0831 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} cpl = ${cpl}`,
                );
            } else {
              // we have some character length allowance left so
              // let's just delete the comment and reduce the cpl
              // by that length
              finalIndexesToDelete.push(stageFrom, stageTo);
              DEV &&
                console.log(
                  `0840 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to final [${stageFrom}, ${stageTo}]`,
                );

              cpl -= stageTo - stageFrom;
              DEV &&
                console.log(
                  `0846 ${`\u001b[${31}m${`SET`}\u001b[${39}m`} cpl = ${cpl}`,
                );
            }

            // finalIndexesToDelete.push(i + 1, i + 1, "\n");
            // DEV && console.log(`0851 PUSH [${i + 1}, ${i + 1}, "\\n"]`);
            // countCharactersPerLine = 0;
          } else {
            DEV &&
              console.log(
                `0856 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
                  countCharactersPerLine + distanceFromHereToCommentEnding - 1
                }`,
              );
            countCharactersPerLine += distanceFromHereToCommentEnding - 1;
            i += distanceFromHereToCommentEnding - 1;
          }
          // DEV && console.log(`0863 CONTINUE`);
          // continue;

          doNothing = i + distanceFromHereToCommentEnding;
          DEV && console.log(`0867 SET doNothing = ${doNothing}`);
        }
      }

      // catch a start of HTML comment
      // ███████████████████████████████████████

      if (
        !doNothing &&
        !withinStyleTag &&
        !withinInlineStyle &&
        (str.startsWith("<!--", i) ||
          (resolvedOpts.removeHTMLComments === 2 &&
            str.startsWith("<![endif", i))) &&
        htmlCommentStartedAt === null
      ) {
        DEV &&
          console.log(
            `0885 ${`\u001b[${32}m${`STARTING OF AN HTML COMMENT CAUGHT`}\u001b[${39}m`}`,
          );

        // detect outlook conditionals
        if (str.startsWith("[if", i + 4)) {
          DEV && console.log(`890`);
          if (!withinHTMLConditional) {
            DEV &&
              console.log(
                `0894 ${`\u001b[${36}m${`██ CONDITIONAL'S OPENING CAUGHT`}\u001b[${39}m`}`,
              );
            withinHTMLConditional = true;
            DEV &&
              console.log(
                `0899 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinHTMLConditional`}\u001b[${39}m`} = ${withinHTMLConditional}`,
              );
          }

          // skip the second counterpart, "<!-->" of "<!--[if !mso]><!-->"

          // the plan is to not set the "htmlCommentStartedAt" at all if deletion
          // is not needed
          if (resolvedOpts.removeHTMLComments === 2) {
            htmlCommentStartedAt = i;
            DEV &&
              console.log(
                `0911 SET ${`\u001b[${33}m${`htmlCommentStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
                  htmlCommentStartedAt,
                  null,
                  4,
                )}`,
              );
          }
        } else if (
          // setting is either 1 or 2 (delete text comments only or any comments):
          resolvedOpts.removeHTMLComments &&
          // prevent the "not" type tails' "<!--" of "<!--<![endif]-->" from
          // accidentally triggering the clauses
          (!withinHTMLConditional || resolvedOpts.removeHTMLComments === 2)
        ) {
          htmlCommentStartedAt = i;
          DEV &&
            console.log(
              `0928 SET ${`\u001b[${33}m${`htmlCommentStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
                htmlCommentStartedAt,
                null,
                4,
              )}`,
            );
        }

        // independently of options settings, mark the options setting
        // "removeHTMLComments" as applicable:
        if (!applicableOpts.removeHTMLComments) {
          applicableOpts.removeHTMLComments = true;
          DEV &&
            console.log(
              `0942 SET ${`\u001b[${33}m${`applicableOpts.removeHTMLComments`}\u001b[${39}m`} = ${JSON.stringify(
                applicableOpts.removeHTMLComments,
                null,
                4,
              )}; now applicableOpts = ${JSON.stringify(
                applicableOpts,
                null,
                4,
              )}`,
            );
        }

        // resolvedOpts.removeHTMLComments: 0|1|2
      }

      // catch style tag
      // ███████████████████████████████████████

      if (
        !doNothing &&
        withinStyleTag &&
        styleCommentStartedAt === null &&
        str.startsWith("</style", i) &&
        !isLetter(str[i + 7])
      ) {
        withinStyleTag = false;
        DEV &&
          console.log(
            `0970 SET ${`\u001b[${33}m${`withinStyleTag`}\u001b[${39}m`} = false`,
          );
      } else if (
        !doNothing &&
        !withinStyleTag &&
        styleCommentStartedAt === null &&
        str.startsWith("<style", i) &&
        !isLetter(str[i + 6])
      ) {
        withinStyleTag = true;
        DEV &&
          console.log(
            `0982 SET ${`\u001b[${33}m${`withinStyleTag`}\u001b[${39}m`} = true`,
          );

        // if resolvedOpts.breakToTheLeftOf have "<style" among them, break to the
        // right of this tag as well
        if (
          (resolvedOpts.removeLineBreaks || resolvedOpts.removeIndentations) &&
          resolvedOpts.breakToTheLeftOf.includes("<style") &&
          str.startsWith(` type="text/css">`, i + 6) &&
          str[i + 24]
        ) {
          finalIndexesToDelete.push(i + 23, i + 23, lineEnding);
          DEV &&
            console.log(
              `0996 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i + 23}, ${
                i + 23
              }, ${JSON.stringify(lineEnding, null, 0)}]`,
            );
        }
      }

      // catch start of inline styles
      // ███████████████████████████████████████

      if (
        !doNothing &&
        !withinInlineStyle &&
        `"'`.includes(str[i]) &&
        str.endsWith("style=", i)
      ) {
        withinInlineStyle = i;
        DEV &&
          console.log(
            `1015 SET ${`\u001b[${33}m${`withinInlineStyle`}\u001b[${39}m`} = ${withinInlineStyle}`,
          );
      }

      // catch whitespace
      // ███████████████████████████████████████
      if (!doNothing && !str[i].trim()) {
        // if whitespace
        if (whitespaceStartedAt === null) {
          whitespaceStartedAt = i;
          DEV &&
            console.log(
              `1027 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = ${whitespaceStartedAt}`,
            );
        }
      } else if (
        !doNothing &&
        !(
          (withinStyleTag || withinInlineStyle) &&
          styleCommentStartedAt !== null
        )
      ) {
        // catch the ending of a whitespace chunk
        // DEV && console.log(`0912`);
        if (whitespaceStartedAt !== null) {
          DEV && console.log(`1040`);
          if (resolvedOpts.removeLineBreaks) {
            DEV &&
              console.log(
                `1044 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
                  countCharactersPerLine + 1
                }`,
              );
            countCharactersPerLine += 1;
          }

          if (beginningOfAFile) {
            beginningOfAFile = false;
            if (
              resolvedOpts.removeIndentations ||
              resolvedOpts.removeLineBreaks
            ) {
              finalIndexesToDelete.push(0, i);
              DEV &&
                console.log(
                  `1060 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [0, ${i}]`,
                );
            }
          } else {
            DEV && console.log("1064 not beginning of a file");
            // so it's not beginning of a file

            // this is the most important area of the program - catching normal
            // whitespace chunks

            // ===================================================================
            // ██ CASE 1. Remove indentations only.
            if (
              resolvedOpts.removeIndentations &&
              !resolvedOpts.removeLineBreaks
            ) {
              DEV &&
                console.log(
                  `1078 inside ${`\u001b[${33}m${`CASE 1`}\u001b[${39}m`}`,
                );

              if (
                !nonWhitespaceCharMet &&
                lastLinebreak !== null &&
                i > lastLinebreak
              ) {
                finalIndexesToDelete.push(lastLinebreak + 1, i);
                DEV &&
                  console.log(
                    `1089 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                      lastLinebreak + 1
                    }, ${i}]`,
                  );
              } else if (whitespaceStartedAt + 1 < i) {
                // we'll try to recycle some spaces, either at the
                // beginning (preferable) or ending (at least) of the
                // whitespace chunk, instead of wiping whole whitespace
                // chunk and adding single space again.

                // first, crop tight around the conditional comments
                if (
                  // imagine <!--[if mso]>
                  str.endsWith("]>", whitespaceStartedAt) ||
                  // imagine <!--[if !mso]><!-->...<
                  //                            ^
                  //                            |
                  //                          our "whitespaceStartedAt"
                  str.endsWith("-->", whitespaceStartedAt) ||
                  // imagine closing counterparts, .../>...<![endif]-->
                  str.startsWith("<![", i) ||
                  // imagine other type of closing counterpart, .../>...<!--<![
                  str.startsWith("<!--<![", i)
                ) {
                  // push the whole whitespace chunk
                  finalIndexesToDelete.push(whitespaceStartedAt, i);
                  DEV &&
                    console.log(
                      `1117 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                        whitespaceStartedAt + 1
                      }, ${i}]`,
                    );
                } else if (str[whitespaceStartedAt] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
                  DEV &&
                    console.log(
                      `1125 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                        whitespaceStartedAt + 1
                      }, ${i}]`,
                    );
                } else if (str[~-i] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt, ~-i);
                  DEV &&
                    console.log(
                      `1133 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartedAt}, ${~-i}]`,
                    );
                } else {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, " ");
                  DEV &&
                    console.log(
                      `1139 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartedAt}, ${i}, " "]`,
                    );
                }
              }
            }

            // ===================================================================
            // ██ CASE 2. Remove linebreaks (includes indentation removal by definition).
            if (resolvedOpts.removeLineBreaks || withinInlineStyle) {
              DEV &&
                console.log(
                  `1150 inside ${`\u001b[${33}m${`CASE 2`}\u001b[${39}m`}`,
                );
              //
              // ██ CASE 2-1 - special break points from resolvedOpts.breakToTheLeftOf

              DEV &&
                console.log(
                  `1157 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`breakToTheLeftOfFirstLetters`}\u001b[${39}m`} = ${JSON.stringify(
                    [...breakToTheLeftOfFirstLetters],
                    null,
                    4,
                  )}`,
                );
              if (
                breakToTheLeftOfFirstLetters.includes(str[i]) &&
                matchRightIncl(str, i, resolvedOpts.breakToTheLeftOf)
              ) {
                DEV && console.log("1167 inside CASE 2-1");
                DEV &&
                  console.log(
                    `1170 \u001b[${36}m${`██`}\u001b[${39}m line break removal section`,
                  );

                // maybe there was just single line break?
                if (
                  // CR or LF endings
                  !(`\r\n`.includes(str[~-i]) && whitespaceStartedAt === ~-i) &&
                  // CRLF endings
                  !(
                    str[~-i] === "\n" &&
                    str[i - 2] === "\r" &&
                    whitespaceStartedAt === i - 2
                  )
                ) {
                  DEV &&
                    console.log(
                      `1186 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartedAt}, ${i}, ${JSON.stringify(
                        lineEnding,
                        null,
                        0,
                      )}]`,
                    );
                  finalIndexesToDelete.push(whitespaceStartedAt, i, lineEnding);
                }
                stageFrom = null;
                stageTo = null;
                stageAdd = null;
                whitespaceStartedAt = null;

                DEV &&
                  console.log(
                    `1201 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${1}`,
                  );

                countCharactersPerLine = 1;
                DEV &&
                  console.log(
                    `1207 RESET all ${`\u001b[${33}m${`stage*`}\u001b[${39}m`} and ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`}`,
                  );
                DEV && console.log(`1209 CONTINUE`);
                continue;
              }

              // ██ CASE 2-2 - rest of whitespace chunk removal clauses

              DEV && console.log("1215 inside CASE 2-2");
              let whatToAdd = " ";

              // skip for inline tags and also inline comparisons vs. numbers
              // for example "something < 2" or "zzz > 1"
              if (
                // (
                str[i] === "<" &&
                matchRight(str, i, resolvedOpts.mindTheInlineTags, {
                  cb: (nextChar) => !nextChar || !/\w/.test(nextChar), // not a letter
                })
                // ) ||
                // ("<>".includes(str[i]) &&
                //   ("0123456789".includes(str[right(str, i)]) ||
                //     "0123456789".includes(str[left(str, i)])))
              ) {
                // nothing
                DEV && console.log(`1232 do nothing`);
              } else if (
                (str[~-whitespaceStartedAt] &&
                  DELETE_TIGHTLY_IF_ON_LEFT_IS.includes(
                    str[~-whitespaceStartedAt],
                  ) &&
                  DELETE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[i])) ||
                ((withinStyleTag || withinInlineStyle) &&
                  styleCommentStartedAt === null &&
                  (DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS.includes(
                    str[~-whitespaceStartedAt],
                  ) ||
                    DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[i]))) ||
                (str.startsWith("!important", i) && !withinHTMLConditional) ||
                (withinInlineStyle &&
                  (str[~-whitespaceStartedAt] === "'" ||
                    str[~-whitespaceStartedAt] === '"')) ||
                (str[~-whitespaceStartedAt] === "}" &&
                  str.startsWith("</style", i)) ||
                (str[i] === ">" &&
                  (`'"`.includes(str[left(str, i) as number]) ||
                    str[right(str, i) as number] === "<")) ||
                (str[i] === "/" && str[right(str, i) as number] === ">")
              ) {
                DEV && console.log(`1256 whatToAdd = ""`);

                whatToAdd = "";

                if (
                  str[i] === "/" &&
                  str[i + 1] === ">" &&
                  right(str, i) &&
                  (right(str, i) as number) > i + 1
                ) {
                  // delete whitespace between / and >
                  finalIndexesToDelete.push(i + 1, right(str, i) as number);
                  DEV &&
                    console.log(
                      `1270 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                        i + 1
                      }, ${right(str, i)}]`,
                    );

                  DEV &&
                    console.log(
                      `1277 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
                        countCharactersPerLine -
                        (right(str, i) as number) -
                        i +
                        1
                      }`,
                    );
                  countCharactersPerLine -= (right(str, i) as number) - i + 1;
                }
              }
              // tend double closing curlies in sequence
              if (
                withinStyleTag &&
                str[i] === "}" &&
                whitespaceStartedAt &&
                str[whitespaceStartedAt - 1] === "}"
              ) {
                whatToAdd = " ";
                DEV &&
                  console.log(
                    `1297 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whatToAdd`}\u001b[${39}m`} = "${whatToAdd}"`,
                  );
              }

              DEV &&
                console.log(
                  `1303 calculated ${`\u001b[${33}m${`whatToAdd`}\u001b[${39}m`} = ${JSON.stringify(
                    whatToAdd,
                    null,
                    0,
                  )}`,
                );
              if (whatToAdd?.length) {
                DEV &&
                  console.log(
                    `1312 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
                      countCharactersPerLine + 1
                    }`,
                  );
                countCharactersPerLine += 1;
              }

              // TWO CASES:
              if (!resolvedOpts.lineLengthLimit) {
                DEV && console.log(`\u001b[${35}m${`1321: 2-1`}\u001b[${39}m`);
                DEV && console.log("1322: !resolvedOpts.lineLengthLimit");
                // 2-1: Line-length limiting is off (easy)
                // We skip the stage part, the whitespace chunks to straight to
                // finalIndexesToDelete ranges array.

                // but ensure that we're not replacing a single space with a single space
                if (
                  !(
                    i === whitespaceStartedAt + 1 &&
                    // str[whitespaceStartedAt] === " " &&
                    whatToAdd === " "
                  )
                ) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, whatToAdd);
                  DEV &&
                    console.log(
                      `1338 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartedAt}, ${i}, ${JSON.stringify(
                        whatToAdd,
                        null,
                        0,
                      )}]`,
                    );
                }
              } else {
                DEV && console.log(`\u001b[${35}m${`1346: 2-2`}\u001b[${39}m`);
                DEV &&
                  console.log(
                    `1349 - 2-2 - resolvedOpts.lineLengthLimit; ${`\u001b[${33}m${`LIMIT`}\u001b[${39}m`} = ${`\u001b[${35}m${resolvedOpts.lineLengthLimit}\u001b[${39}m`}; ${`\u001b[${33}m${`COUNT`}\u001b[${39}m`} = ${`\u001b[${35}m${countCharactersPerLine}\u001b[${39}m`}`,
                  );
                // 2-2: Line-length limiting is on (not that easy)
                // maybe we are already beyond the limit?
                if (
                  countCharactersPerLine >= resolvedOpts.lineLengthLimit ||
                  !str[i + 1] ||
                  str[i] === ">" ||
                  (str[i] === "/" && str[i + 1] === ">")
                ) {
                  DEV &&
                    console.log(`\u001b[${35}m${`1360: 2-2-1`}\u001b[${39}m`);
                  DEV &&
                    console.log(
                      `1363: ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`}(${countCharactersPerLine}) >= ${`\u001b[${33}m${`resolvedOpts.lineLengthLimit`}\u001b[${39}m`}(${
                        resolvedOpts.lineLengthLimit
                      })`,
                    );

                  if (
                    countCharactersPerLine > resolvedOpts.lineLengthLimit ||
                    (countCharactersPerLine === resolvedOpts.lineLengthLimit &&
                      str[i + 1]?.trim() &&
                      !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) &&
                      !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i + 1]))
                  ) {
                    whatToAdd = lineEnding;
                    DEV && console.log(`1376 SET whatToAdd = "\\n"`);
                    countCharactersPerLine = 1;
                    DEV && console.log(`1378 RESET countCharactersPerLine = 1`);
                  }

                  // replace the whitespace only in two cases:
                  // 1) if line length limit would otherwise be exceeded
                  // 2) if this replacement reduces the file length. For example,
                  // don't replace the linebreak with a space. But do delete
                  // linebreak like it happens between tags.
                  if (
                    countCharactersPerLine > resolvedOpts.lineLengthLimit ||
                    !(whatToAdd === " " && i === whitespaceStartedAt + 1)
                  ) {
                    finalIndexesToDelete.push(
                      whitespaceStartedAt,
                      i,
                      whatToAdd,
                    );
                    DEV &&
                      console.log(
                        `1397 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartedAt}, ${i}, ${JSON.stringify(
                          whatToAdd,
                          null,
                          0,
                        )}]`,
                      );
                    lastLinebreak = null;
                    DEV &&
                      console.log(
                        `1406 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastLinebreak`}\u001b[${39}m`} = ${JSON.stringify(
                          lastLinebreak,
                          null,
                          4,
                        )}`,
                      );
                  }
                  stageFrom = null;
                  stageTo = null;
                  stageAdd = null;
                  DEV &&
                    console.log(
                      `1418 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} all stage* vars`,
                    );
                } else if (
                  stageFrom === null ||
                  whitespaceStartedAt < stageFrom
                ) {
                  // only submit the range if it's bigger
                  DEV &&
                    console.log(`\u001b[${35}m${`1426: 2-2-2`}\u001b[${39}m`);
                  DEV &&
                    console.log(
                      `1429: ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`}(${countCharactersPerLine}) <= ${`\u001b[${33}m${`resolvedOpts.lineLengthLimit`}\u001b[${39}m`}(${
                        resolvedOpts.lineLengthLimit
                      })`,
                    );
                  stageFrom = whitespaceStartedAt;
                  stageTo = i;
                  stageAdd = whatToAdd;
                  DEV &&
                    console.log(
                      `1438 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} stageFrom = ${stageFrom}; stageTo = ${stageTo}; stageAdd = "${stageAdd}"`,
                    );
                }

                DEV &&
                  console.log(
                    `1444 stageFrom = ${stageFrom}; whitespaceStartedAt = ${whitespaceStartedAt}`,
                  );
              }
            }
            // ===================================================================
          }

          // finally, toggle the marker:
          whitespaceStartedAt = null;
          DEV &&
            console.log(
              `1455 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = ${whitespaceStartedAt}, (${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} = ${countCharactersPerLine})`,
            );

          // toggle nonWhitespaceCharMet
          if (!nonWhitespaceCharMet) {
            nonWhitespaceCharMet = true;
            DEV &&
              console.log(
                `1463 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nonWhitespaceCharMet`}\u001b[${39}m`} = ${JSON.stringify(
                  nonWhitespaceCharMet,
                  null,
                  4,
                )}`,
              );
          }
          // continue;
        } else {
          // 1. case when first character in string is not whitespace:
          if (beginningOfAFile) {
            beginningOfAFile = false;
            DEV &&
              console.log(
                `1477 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`beginningOfAFile`}\u001b[${39}m`} = ${JSON.stringify(
                  beginningOfAFile,
                  null,
                  4,
                )}`,
              );
          }

          // 2. tend count if linebreak removal is on:
          if (resolvedOpts.removeLineBreaks) {
            // there was no whitespace gap and linebreak removal is on, so just
            // increment the count
            DEV &&
              console.log(
                `1491 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
                  countCharactersPerLine + 1
                }`,
              );
            countCharactersPerLine += 1;
          }
        }

        // ===================================================================
        // ██ EXTRAS:

        // toggle nonWhitespaceCharMet
        if (!nonWhitespaceCharMet) {
          nonWhitespaceCharMet = true;
          DEV &&
            console.log(
              `1507 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nonWhitespaceCharMet`}\u001b[${39}m`} = ${JSON.stringify(
                nonWhitespaceCharMet,
                null,
                4,
              )}`,
            );
        }
      }

      // catch the characters, suitable for a break
      if (
        !doNothing &&
        !beginningOfAFile &&
        i !== 0 &&
        resolvedOpts.removeLineBreaks &&
        (resolvedOpts.lineLengthLimit || breakToTheLeftOfFirstLetters) &&
        !str.startsWith("</a", i)
      ) {
        if (
          breakToTheLeftOfFirstLetters &&
          matchRightIncl(str, i, resolvedOpts.breakToTheLeftOf) &&
          str.slice(0, i).trim() &&
          (!str.startsWith("<![endif]", i) || !matchLeft(str, i, "<!--"))
        ) {
          DEV &&
            console.log(
              `1533 ${`\u001b[${31}m${`resolvedOpts.breakToTheLeftOf BREAKPOINT!`}\u001b[${39}m`}`,
            );
          DEV &&
            console.log(
              `1537 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i}, "\\n"]`,
            );
          finalIndexesToDelete.push(i, i, lineEnding);
          stageFrom = null;
          stageTo = null;
          stageAdd = null;

          DEV &&
            console.log(
              `1546 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${1}`,
            );
          countCharactersPerLine = 1;
          DEV &&
            console.log(
              `1551 RESET all ${`\u001b[${33}m${`stage*`}\u001b[${39}m`}, then CONTINUE`,
            );
          continue;
        } else if (
          resolvedOpts.lineLengthLimit &&
          countCharactersPerLine <= resolvedOpts.lineLengthLimit
        ) {
          if (
            !str[i + 1] ||
            (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) &&
              !CHARS_DONT_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i])) ||
            CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) ||
            !str[i].trim()
          ) {
            DEV && console.log(`1565 inside release-stage clauses`);
            // 1. release stage contents - now they'll be definitely deleted
            // =============================================================
            if (
              stageFrom !== null &&
              stageTo !== null &&
              (stageFrom !== stageTo || stageAdd?.length)
            ) {
              let whatToAdd = stageAdd;
              DEV &&
                console.log(
                  `1576 INITIAL ${`\u001b[${33}m${`whatToAdd`}\u001b[${39}m`} = ${JSON.stringify(
                    whatToAdd,
                    null,
                    4,
                  )}`,
                );

              DEV &&
                console.log(
                  `1585 FIY, ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} = ${JSON.stringify(
                    countCharactersPerLine,
                    null,
                    4,
                  )}`,
                );

              // if we are not on breaking point, last "stageAdd" needs to be
              // amended into linebreak because otherwise we'll exceed the
              // character limit
              if (
                str[i].trim() &&
                str[i + 1]?.trim() &&
                countCharactersPerLine + (stageAdd ? stageAdd.length : 0) >
                  resolvedOpts.lineLengthLimit
              ) {
                DEV &&
                  console.log(
                    `1603 SET whatToAdd = ${JSON.stringify(
                      lineEnding,
                      null,
                      0,
                    )}`,
                  );
                whatToAdd = lineEnding;
              }

              // if line is beyond the line length limit or whitespace is not
              // a single space, staged to be replaced with single space,
              // tackle this whitespace
              if (
                countCharactersPerLine + (whatToAdd ? whatToAdd.length : 0) >
                  resolvedOpts.lineLengthLimit ||
                !(
                  whatToAdd === " " &&
                  stageTo === stageFrom + 1 &&
                  str[stageFrom] === " "
                )
              ) {
                DEV &&
                  console.log(
                    `1626 - ${`\u001b[${32}m${`REPLACE`}\u001b[${39}m`} this white space`,
                  );
                // push this range only if it's not between curlies, } and {
                if (!(str[~-stageFrom] === "}" && str[stageTo] === "{")) {
                  finalIndexesToDelete.push(stageFrom, stageTo, whatToAdd);
                  DEV &&
                    console.log(
                      `1633 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${stageFrom}, ${stageTo}, ${JSON.stringify(
                        whatToAdd,
                        null,
                        0,
                      )}]`,
                    );
                  lastLinebreak = null;
                  DEV &&
                    console.log(
                      `1642 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastLinebreak`}\u001b[${39}m`} = ${JSON.stringify(
                        lastLinebreak,
                        null,
                        4,
                      )}`,
                    );
                } // else {
                //   DEV && console.log(
                //     `1650 didn't push because whitespace is between curlies`
                //   );
                // }
              } else {
                DEV &&
                  console.log(
                    `1656 ${`${`\u001b[${31}m${`██`}\u001b[${39}m`}${`\u001b[${33}m${`██`}\u001b[${39}m`}`.repeat(
                      10,
                    )} - lastLinebreak = ${lastLinebreak}`,
                  );
                // countCharactersPerLine -= i - (lastLinebreak || 0);
              }
            }

            DEV &&
              console.log(
                `1666 ${`\u001b[${33}m${`leftTagName`}\u001b[${39}m`} = ${leftTagName}`,
              );
            // 2. put this current place into stage
            // =============================================================
            if (
              str[i].trim() &&
              (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) ||
                (str[~-i] &&
                  CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[~-i]))) &&
              isStr(leftTagName) &&
              (!tagName || !resolvedOpts.mindTheInlineTags.includes(tagName)) &&
              !(
                str[i] === "<" &&
                matchRight(str, i, resolvedOpts.mindTheInlineTags, {
                  cb: (nextChar) => !nextChar || !/\w/.test(nextChar), // not a letter
                })
              ) &&
              !(
                str[i] === "<" &&
                matchRight(str, i, resolvedOpts.mindTheInlineTags, {
                  trimCharsBeforeMatching: "/",
                  cb: (nextChar) => !nextChar || !/\w/.test(nextChar), // not a letter
                })
              )
            ) {
              stageFrom = i;
              stageTo = i;
              stageAdd = null;
              DEV &&
                console.log(
                  `1696 SET stage from = ${stageFrom}; stageTo = ${stageTo}; RESET "stageAdd = null"`,
                );
            } else if (
              styleCommentStartedAt === null &&
              stageFrom !== null &&
              (withinInlineStyle ||
                !resolvedOpts.mindTheInlineTags ||
                !Array.isArray(resolvedOpts.mindTheInlineTags) ||
                (Array.isArray(resolvedOpts.mindTheInlineTags.length) &&
                  !resolvedOpts.mindTheInlineTags.length) ||
                !isStr(tagName) ||
                (Array.isArray(resolvedOpts.mindTheInlineTags) &&
                  resolvedOpts.mindTheInlineTags.length &&
                  isStr(tagName) &&
                  !resolvedOpts.mindTheInlineTags.includes(tagName))) &&
              !(
                str[i] === "<" &&
                matchRight(str, i, resolvedOpts.mindTheInlineTags, {
                  trimCharsBeforeMatching: "/",
                  cb: (nextChar) => !nextChar || !/\w/.test(nextChar), // not a letter
                })
              )
            ) {
              stageFrom = null;
              stageTo = null;
              stageAdd = null;
              DEV && console.log("1722 RESET all stage vars");
            }
          }
        } else if (resolvedOpts.lineLengthLimit) {
          // countCharactersPerLine > resolvedOpts.lineLengthLimit

          DEV && console.log(`1728 ${`\u001b[${36}m${`██`}\u001b[${39}m`}`);
          // LIMIT HAS BEEN EXCEEDED!
          // WE NEED TO BREAK RIGHT HERE
          if (
            CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) &&
            !(
              str[i] === "<" &&
              matchRight(str, i, resolvedOpts.mindTheInlineTags, {
                trimCharsBeforeMatching: "/",
                cb: (nextChar) => !nextChar || !/\w/.test(nextChar), // not a letter
              })
            )
          ) {
            // ██ 1.
            //
            DEV &&
              console.log(
                `1745 ${`\u001b[${36}m${`██ LIMIT (${resolvedOpts.lineLengthLimit}) EXCEEDED`}\u001b[${39}m`} char break on left`,
              );
            // if really exceeded, not on limit, commit stage which will shorten
            // the string and maybe we'll be within the limit range again
            if (
              stageFrom !== null &&
              stageTo !== null &&
              (stageFrom !== stageTo || stageAdd?.length)
            ) {
              DEV && console.log(`1754 FOUND STAGED`);
              // case in test 02.11.09
              // We might have passed some tabs for example, which should be
              // deleted what might put line length back within limit. Or not.
              //
              let whatToAddLength = stageAdd?.length ? stageAdd.length : 0;

              // Currently, countCharactersPerLine > resolvedOpts.lineLengthLimit
              // But, will it still be true if we compensate for what's in stage?

              if (
                countCharactersPerLine -
                  (stageTo - stageFrom - whatToAddLength) -
                  1 >
                resolvedOpts.lineLengthLimit
              ) {
                // still beyond limit so break at stage
                DEV &&
                  console.log(`1772 ${`\u001b[${34}m${`██`}\u001b[${39}m`}`);
              } else {
                // So,
                // countCharactersPerLine -
                // (stageTo - stageFrom - whatToAddLength) - 1 <=
                // resolvedOpts.lineLengthLimit

                // don't break at stage, just apply its contents and we're good
                DEV &&
                  console.log(`1781 ${`\u001b[${34}m${`██`}\u001b[${39}m`}`);
                finalIndexesToDelete.push(stageFrom, stageTo, stageAdd);
                DEV &&
                  console.log(
                    `1785 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${stageFrom}, ${stageTo}, ${JSON.stringify(
                      stageAdd,
                      null,
                      4,
                    )}]`,
                  );

                // We're not done yet. We are currently located on a potential
                // break point,
                // countCharactersPerLine -
                // (stageTo - stageFrom - whatToAddLength) - 1 ===
                // resolvedOpts.lineLengthLimit ?

                if (
                  countCharactersPerLine -
                    (stageTo - stageFrom - whatToAddLength) -
                    1 ===
                  resolvedOpts.lineLengthLimit
                ) {
                  DEV &&
                    console.log(`1805 ${`\u001b[${34}m${`██`}\u001b[${39}m`}`);
                  finalIndexesToDelete.push(i, i, lineEnding);
                  DEV &&
                    console.log(
                      `1809 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i}, ${JSON.stringify(
                        lineEnding,
                        null,
                        0,
                      )}]`,
                    );
                  countCharactersPerLine = 0;
                  DEV &&
                    console.log(
                      `1818 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} countCharactersPerLine = 0`,
                    );
                }

                // reset
                stageFrom = null;
                stageTo = null;
                stageAdd = null;
                DEV && console.log(`1826 RESET all stage vars`);
              }
            } else {
              DEV && console.log(`1829 BUT NO STAGED FOUND`);
              //
              finalIndexesToDelete.push(i, i, lineEnding);
              DEV &&
                console.log(
                  `1834 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i}, ${JSON.stringify(
                    lineEnding,
                    null,
                    0,
                  )}]`,
                );
              countCharactersPerLine = 0;
              DEV &&
                console.log(
                  `1843 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} countCharactersPerLine = 0`,
                );
            }
          } else if (
            str[i + 1] &&
            CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) &&
            isStr(tagName) &&
            Array.isArray(resolvedOpts.mindTheInlineTags) &&
            resolvedOpts.mindTheInlineTags.length &&
            !resolvedOpts.mindTheInlineTags.includes(tagName)
          ) {
            // ██ 2.
            //
            DEV &&
              console.log(
                `1858 ${`\u001b[${36}m${`██ LIMIT (${resolvedOpts.lineLengthLimit}) EXCEEDED`}\u001b[${39}m`} break on the right of this character`,
              );
            if (
              stageFrom !== null &&
              stageTo !== null &&
              (stageFrom !== stageTo || stageAdd?.length)
            ) {
              DEV && console.log(`1865 FOUND STAGED`);
            } else {
              DEV && console.log(`1867 BUT NO STAGED FOUND`);
              //
              finalIndexesToDelete.push(i + 1, i + 1, lineEnding);
              DEV &&
                console.log(
                  `1872 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i + 1}, ${
                    i + 1
                  }, ${JSON.stringify(lineEnding, null, 0)}]`,
                );
              countCharactersPerLine = 0;
              DEV &&
                console.log(
                  `1879 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} countCharactersPerLine = 0`,
                );
            }
          } else if (!str[i].trim()) {
            // ██ 3.
            //
            DEV &&
              console.log(
                `1887 ${`\u001b[${36}m${`██ LIMIT (${resolvedOpts.lineLengthLimit}) EXCEEDED`}\u001b[${39}m`} whitespace as breaking point`,
              );
          } else if (!str[i + 1]) {
            // ██ 4.
            //
            DEV &&
              console.log(
                `1894 ${`\u001b[${36}m${`██ LIMIT (${resolvedOpts.lineLengthLimit}) EXCEEDED`}\u001b[${39}m`} EOL is next`,
              );
            // if we reached the end of string, check what's in stage
            if (
              stageFrom !== null &&
              stageTo !== null &&
              (stageFrom !== stageTo || stageAdd?.length)
            ) {
              finalIndexesToDelete.push(stageFrom, stageTo, lineEnding);
              DEV &&
                console.log(
                  `1905 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${stageFrom}, ${stageTo}, ${JSON.stringify(
                    lineEnding,
                    null,
                    0,
                  )}]`,
                );
            }
          }
        }
      }

      // catch any character beyond the line length limit:
      if (
        !doNothing &&
        !beginningOfAFile &&
        resolvedOpts.removeLineBreaks &&
        resolvedOpts.lineLengthLimit &&
        countCharactersPerLine >= resolvedOpts.lineLengthLimit &&
        stageFrom !== null &&
        stageTo !== null &&
        !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) &&
        !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) &&
        !"/".includes(str[i])
      ) {
        DEV &&
          console.log(
            `1931 ${`\u001b[${32}m${`██ LIMIT REACHED`}\u001b[${39}m`}! countCharactersPerLine(${`\u001b[${33}m${countCharactersPerLine}\u001b[${39}m`}) >= resolvedOpts.lineLengthLimit(${`\u001b[${33}m${resolvedOpts.lineLengthLimit}\u001b[${39}m`}) MIGHT RELEASE STAGE TO FINAL`,
          );

        // two possible cases:
        // 1. we hit the line length limit and we can break afterwards
        // 2. we can't break afterwards, and there might be stage present
        if (
          !(
            countCharactersPerLine === resolvedOpts.lineLengthLimit &&
            str[i + 1] &&
            !str[i + 1].trim()
          )
        ) {
          //
          let whatToAdd = lineEnding;
          if (
            str[i + 1] &&
            !str[i + 1].trim() &&
            countCharactersPerLine === resolvedOpts.lineLengthLimit
          ) {
            whatToAdd = stageAdd as string;
            DEV &&
              console.log(
                `1954 SET whatToAdd = ${JSON.stringify(whatToAdd, null, 4)}`,
              );
          }

          // final correction - we might need to extend stageFrom to include
          // all whitespace on the left if whatToAdd is a line break
          if (
            whatToAdd === lineEnding &&
            !str[~-stageFrom].trim() &&
            left(str, stageFrom)
          ) {
            stageFrom = (left(str, stageFrom) as number) + 1;
            DEV &&
              console.log(
                `1968 ${`\u001b[${33}m${`CORRECTION`}\u001b[${39}m`} stageFrom now = ${stageFrom}`,
              );
          }
          DEV &&
            console.log(
              `1973 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${stageFrom}, ${stageTo}, ${JSON.stringify(
                whatToAdd,
                null,
                0,
              )}]`,
            );
          finalIndexesToDelete.push(stageFrom, stageTo, whatToAdd);

          DEV &&
            console.log(
              `1983 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
                i - stageTo
              }`,
            );
          countCharactersPerLine = i - stageTo;
          if (str[i].length) {
            DEV &&
              console.log(
                `1991 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
                  countCharactersPerLine + 1
                }`,
              );
            countCharactersPerLine += 1;
          }
          stageFrom = null;
          stageTo = null;
          stageAdd = null;
          DEV &&
            console.log(
              `2002 RESET stage* vars; per-line count to ${countCharactersPerLine}`,
            );
        }
      }

      // catch line breaks
      // ███████████████████████████████████████
      if (
        (!doNothing && str[i] === "\n") ||
        (str[i] === "\r" &&
          (!str[i + 1] || (str[i + 1] && str[i + 1] !== "\n")))
      ) {
        // =======================================================================
        // mark this
        lastLinebreak = i;
        DEV &&
          console.log(
            `2019 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastLinebreak`}\u001b[${39}m`} = ${JSON.stringify(
              lastLinebreak,
              null,
              4,
            )}`,
          );

        // =======================================================================
        // reset nonWhitespaceCharMet
        if (nonWhitespaceCharMet) {
          nonWhitespaceCharMet = false;
          DEV &&
            console.log(
              `2032 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`nonWhitespaceCharMet`}\u001b[${39}m`} = ${JSON.stringify(
                nonWhitespaceCharMet,
                null,
                4,
              )}`,
            );
        }

        // =======================================================================
        // delete trailing whitespace on each line OR empty lines
        if (
          !resolvedOpts.removeLineBreaks &&
          whitespaceStartedAt !== null &&
          whitespaceStartedAt < i &&
          str[i + 1] &&
          str[i + 1] !== "\r" &&
          str[i + 1] !== "\n"
        ) {
          finalIndexesToDelete.push(whitespaceStartedAt, i);
          DEV &&
            console.log(
              `2053 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} line's trailing whitespace [${whitespaceStartedAt}, ${i}]`,
            );
        }
      }

      // catch the EOF
      // ███████████████████████████████████████
      if (!str[i + 1]) {
        if (withinStyleTag && styleCommentStartedAt !== null) {
          DEV &&
            console.log(
              `2064 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} THIS UNFINISHED COMMENT`,
            );
          finalIndexesToDelete.push([
            ...expander({
              str,
              from: styleCommentStartedAt,
              to: i,
              ifLeftSideIncludesThisThenCropTightly:
                DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS || "",
              ifRightSideIncludesThisThenCropTightly:
                DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS || "",
            }),
          ]);
        } else if (whitespaceStartedAt && str[i] !== "\n" && str[i] !== "\r") {
          // catch trailing whitespace at the end of the string which is not legit
          // trailing linebreak
          finalIndexesToDelete.push(whitespaceStartedAt, i + 1);
          DEV &&
            console.log(
              `2083 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} string's trailing whitespace [${whitespaceStartedAt}, ${
                i + 1
              }]`,
            );
        } else if (
          whitespaceStartedAt &&
          ((str[i] === "\r" && str[i + 1] === "\n") ||
            (str[i] === "\n" && str[i - 1] !== "\r"))
        ) {
          finalIndexesToDelete.push(whitespaceStartedAt, i);
          DEV &&
            console.log(
              `2095 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} string's trailing whitespace [${whitespaceStartedAt}, ${i}]`,
            );
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
      //              BOTTOM
      //
      //
      //
      //
      //
      //
      //
      //

      // catch end of inline styles
      // ███████████████████████████████████████

      if (
        !doNothing &&
        withinInlineStyle &&
        withinInlineStyle < i &&
        str[withinInlineStyle] === str[i]
      ) {
        withinInlineStyle = null;
        DEV &&
          console.log(
            `2131 SET ${`\u001b[${33}m${`withinInlineStyle`}\u001b[${39}m`} = null`,
          );
      }

      // catch <pre...>
      // ███████████████████████████████████████

      if (
        !doNothing &&
        !withinStyleTag &&
        str.startsWith("<pre", i) &&
        !isLetter(str[i + 4])
      ) {
        DEV && console.log(`2144 OPENING PRE TAG CAUGHT`);

        let locationOfClosingPre = str.indexOf("</pre", i + 5);
        if (locationOfClosingPre > 0) {
          doNothing = locationOfClosingPre;
          DEV &&
            console.log(
              `2151 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`}`,
            );
        }
      }

      // catch <code...>
      // ███████████████████████████████████████

      if (
        !doNothing &&
        !withinStyleTag &&
        str.startsWith("<code", i) &&
        !isLetter(str[i + 5])
      ) {
        DEV && console.log(`2165 OPENING CODE TAG CAUGHT`);

        let locationOfClosingCode = str.indexOf("</code", i + 5);
        if (locationOfClosingCode > 0) {
          doNothing = locationOfClosingCode;
          DEV &&
            console.log(
              `2172 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`}`,
            );
        }
      }

      // catch start of <![CDATA[
      // ███████████████████████████████████████

      if (!doNothing && str.startsWith("<![CDATA[", i)) {
        DEV && console.log(`2181 STARTING OF <![CDATA[`);

        let locationOfClosingCData = str.indexOf("]]>", i + 9);
        if (locationOfClosingCData > 0) {
          doNothing = locationOfClosingCData;
          DEV &&
            console.log(
              `2188 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`}`,
            );
        }
      }

      // catch tag's closing bracket
      // ███████████████████████████████████████
      if (
        !doNothing &&
        !withinStyleTag &&
        !withinInlineStyle &&
        tagNameStartsAt !== null &&
        str[i] === ">"
      ) {
        // if another tag starts on the right, hand over the name:
        if (str[right(str, i) as number] === "<") {
          leftTagName = tagName;
          DEV &&
            console.log(
              `2207 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`leftTagName`}\u001b[${39}m`} = ${leftTagName}`,
            );
        }

        tagNameStartsAt = null;
        tagName = null;
        DEV &&
          console.log(
            `2215 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} tagNameStartsAt = null; tagName = null;`,
          );
      }

      // catch tag's opening bracket
      // ███████████████████████████████████████
      if (str[i] === "<" && leftTagName !== null) {
        // reset it after use
        leftTagName = null;
        DEV &&
          console.log(
            `2226 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`leftTagName`}\u001b[${39}m`} = null`,
          );
      }

      // catch Jinja/Nunjucks two opening curlies and jump to the closing ones if latter exists
      // ███████████████████████████████████████
      if (
        !doNothing &&
        withinStyleTag &&
        str[i] === "{" &&
        str[i + 1] === "{"
      ) {
        // search from past the opening curlies, the way the </pre>, </code> and
        // ]]> handlers above do. Searching from zero finds the first `}}` in the
        // whole string, which for every expression after the first is already
        // behind i, so doNothing is set to a past index and cleared on the next
        // iteration - leaving the expression unprotected.
        let locationOfClosingCurlies = str.indexOf("}}", i + 2);
        if (locationOfClosingCurlies !== -1) {
          doNothing = locationOfClosingCurlies + 2;
          DEV && console.log(`2246 SET doNothing = ${doNothing}`);
        }
      }

      // logging after each loop's iteration:
      // ███████████████████████████████████████
      DEV &&
        console.log(
          `2254     \u001b[${90}m${`██ ██ ██ ██ ██ END ██ ██ ██ ██ ██`}\u001b[${39}m`,
        );
      DEV &&
        console.log(
          `2258 ${`\u001b[${35}m${`cpl`}\u001b[${39}m`} = ${`\u001b[${35}m${cpl}\u001b[${39}m`};`,
        );

      let logDoNothing = true;

      DEV &&
        console.log(
          `2265 ${`\u001b[${36}m${`countCharactersPerLine`}\u001b[${39}m`} = ${JSON.stringify(
            countCharactersPerLine,
            null,
            0,
          )}; ${`\u001b[${33}m${`stageFrom`}\u001b[${39}m`} = ${stageFrom}; ${`\u001b[${33}m${`stageTo`}\u001b[${39}m`} = ${stageTo}; ${`\u001b[${33}m${`stageAdd`}\u001b[${39}m`} = ${JSON.stringify(
            stageAdd,
            null,
            0,
          )}; ${`\u001b[${33}m${`indexes`}\u001b[${39}m`} = ${JSON.stringify(
            finalIndexesToDelete.current(),
            null,
            0,
          )}; ${`\u001b[${33}m${`lastLinebreak`}\u001b[${39}m`} = ${lastLinebreak}; ${`\u001b[${33}m${`withinStyleTag`}\u001b[${39}m`} = ${withinStyleTag}; ${`\u001b[${33}m${`nonWhitespaceCharMet`}\u001b[${39}m`} = ${nonWhitespaceCharMet};\n${
            logDoNothing
              ? `${`\u001b[${doNothing ? 31 : 32}m${`██ doNothing ${
                  doNothing || "OFF"
                } ██`}\u001b[${39}m`}; `
              : ""
          }${`\u001b[${withinInlineStyle ? 32 : 31}m${`██ withinInlineStyle ${
            withinInlineStyle ? "yes" : "no"
          } ██`}\u001b[${39}m`}`,
        );

      //
      //
      //
      // end of the loop
    }
    DEV &&
      console.log(
        `2295 AFTER THE LOOP, finalIndexesToDelete.current() = ${JSON.stringify(
          finalIndexesToDelete.current(),
          null,
          4,
        )}`,
      );

    const ranges = finalIndexesToDelete.current();
    if (ranges) {
      // This accumulator is local to the call, so no wipe is necessary.

      let startingPercentageDone =
        resolvedOpts.reportProgressFuncTo -
        (resolvedOpts.reportProgressFuncTo -
          resolvedOpts.reportProgressFuncFrom) *
          leavePercForLastStage;
      DEV &&
        console.log(
          `2313 ${`\u001b[${33}m${`startingPercentageDone`}\u001b[${39}m`} = ${JSON.stringify(
            startingPercentageDone,
            null,
            4,
          )}`,
        );

      let res = rApply(str, ranges, (applyPercDone) => {
        // allocate remaining "leavePercForLastStage" percentage of the total
        // progress reporting to this stage:
        if (resolvedOpts.reportProgressFunc && len >= 2000) {
          currentPercentageDone = Math.floor(
            startingPercentageDone +
              (resolvedOpts.reportProgressFuncTo - startingPercentageDone) *
                (applyPercDone / 100),
          );

          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            resolvedOpts.reportProgressFunc(currentPercentageDone);
          }
        }
      });

      DEV &&
        console.log(
          `2339 returning ${`\u001b[${33}m${`res`}\u001b[${39}m`} =\n\n${JSON.stringify(
            res,
            null,
            4,
          )}\n\n ${`\u001b[${90}m${`or:`}\u001b[${39}m`}\n\n"${res}"`,
        );
      DEV &&
        console.log(
          `\u001b[${90}m${`2347 \n      ██ FIN ██\n\n`}\u001b[${39}m`,
        );
      let resLen = res.length;
      return {
        log: {
          timeTakenInMilliseconds: Date.now() - start,
          originalLength: len,
          cleanedLength: resLen,
          bytesSaved: Math.max(len - resLen, 0),
          percentageReducedOfOriginal: len
            ? Math.round((Math.max(len - resLen, 0) * 100) / len)
            : 0,
        },
        ranges,
        applicableOpts,
        result: res,
      };
    }
  }
  // ELSE - return the original input string
  DEV &&
    console.log(
      `2369 returning original ${`\u001b[${33}m${`str`}\u001b[${39}m`} =\n\n${JSON.stringify(
        str,
        null,
        4,
      )}\n\n ${`\u001b[${90}m${`or:`}\u001b[${39}m`}\n\n${str}`,
    );

  DEV && console.log("2376 ");
  DEV && console.log("2377 ");
  DEV && console.log(`\u001b[${90}m${`2378       ██ FIN ██\n\n`}\u001b[${39}m`);
  DEV && console.log("2379 ");
  DEV && console.log("2380 ");

  return {
    log: {
      timeTakenInMilliseconds: Date.now() - start,
      originalLength: len,
      cleanedLength: len,
      bytesSaved: 0,
      percentageReducedOfOriginal: 0,
    },
    applicableOpts,
    ranges: null,
    result: str,
  };
}

export { crush, defaults, version };
