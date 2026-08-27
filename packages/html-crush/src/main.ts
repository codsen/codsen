import {
  formatDiagnosticValue,
  isLetter,
  isPlainObject as isObj,
  isStr,
  isWhitespaceChar,
} from "codsen-utils";
import { rApply } from "ranges-apply";
import { Ranges } from "ranges-push";
import { left, right } from "string-left-right";
import { matchLeft, matchRight, matchRightIncl } from "string-match-left-right";
import { expander } from "string-range-expander";
import type { Ranges as RangesType } from "../../../ops/typedefs/common";

import { version as v } from "../package.json";
import { codePointAtIndex } from "./codePoint";

const version: string = v;

declare let DEV: boolean;

// \w equivalent - [A-Za-z0-9_] - straight off the char code. The regex
// literals this replaces sit in the per-character hot path.
function isWordCharCode(code: number): boolean {
  return (
    (code > 96 && code < 123) || // a-z
    (code > 64 && code < 91) || // A-Z
    (code > 47 && code < 58) || // 0-9
    code === 95 // _
  );
}

function isWordChar(char: string | undefined): boolean {
  return char !== undefined && isWordCharCode(char.charCodeAt(0));
}

function isHtmlNameChar(char: string | undefined): boolean {
  return (
    char !== undefined &&
    (isWordCharCode(char.charCodeAt(0)) || `:-.`.includes(char))
  );
}
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

  const finalIndexesToDelete = new Ranges<string | null | undefined>({
    limitToBeAddedWhitespace: true,
  });
  let resolvedOpts: Opts = { ...defaults, ...opts };
  DEV &&
    console.log(
      `FINAL ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
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
      `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`breakToTheLeftOfFirstLetters`}\u001b[${39}m`} = ${JSON.stringify(
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

  // "mindTheInlineTags" is consulted for every "<" in the input, previously
  // through matchRight() against all ~57 names. Both an array scan and, more
  // expensively, matchRight()'s per-name options-object rebuild are avoidable:
  // hold the names in a Set instead.
  let mindTheInlineTags = Array.isArray(resolvedOpts.mindTheInlineTags)
    ? resolvedOpts.mindTheInlineTags
    : [];
  let mindTheInlineTagsSet = new Set(mindTheInlineTags);
  // Reading the whole word-character run at once and looking it up is
  // equivalent to matchRight() + its "next char is not \w" callback only while
  // every name is itself a run of word characters - which the defaults, and
  // any real tag name, are. Anything else keeps the original code path.
  // An empty list is not a "no tag matches" shortcut: matchRight() with
  // nothing to match falls through to matching by the callback alone, which
  // accepts any "<" not followed by a word character. Leave that to it.
  let inlineTagsAreWordsOnly =
    !!mindTheInlineTags.length &&
    mindTheInlineTags.every(
      (tag) =>
        isStr(tag) && !!tag.length && ![...tag].some((c) => !isWordChar(c)),
    );

  // resolvedOpts.breakToTheLeftOf is matched at nearly every character, and
  // matchRightIncl() rebuilds its options object once per name on every call.
  // Since these are plain, case-sensitive literals with no callback and no
  // trimming, matching one is just String#startsWith - so group the names by
  // their first character and only test the ones that could start here.
  //
  // Entries that are empty strings are dropped: march() never matches those,
  // whereas startsWith("") would match anywhere.
  let breakToTheLeftOfByFirstChar = new Map<string, string[]>();
  // A lone whitespace-only or empty entry sends matchRightIncl() down its
  // "match by callback alone" branch, which throws when there is no callback.
  // Leave any such list to it rather than reproducing that here.
  let breakToTheLeftOfIsSimple =
    Array.isArray(resolvedOpts.breakToTheLeftOf) &&
    !!resolvedOpts.breakToTheLeftOf.length &&
    resolvedOpts.breakToTheLeftOf.every(isStr) &&
    !(
      resolvedOpts.breakToTheLeftOf.length === 1 &&
      !resolvedOpts.breakToTheLeftOf[0].trim()
    );
  if (breakToTheLeftOfIsSimple) {
    for (let oneOfNames of resolvedOpts.breakToTheLeftOf) {
      if (!oneOfNames.length) {
        continue;
      }
      let bucket = breakToTheLeftOfByFirstChar.get(oneOfNames[0]);
      if (bucket) {
        bucket.push(oneOfNames);
      } else {
        breakToTheLeftOfByFirstChar.set(oneOfNames[0], [oneOfNames]);
      }
    }
  }

  // Does any resolvedOpts.breakToTheLeftOf name start at "idx"?
  function breakToTheLeftOfMatches(idx: number): boolean {
    if (!breakToTheLeftOfIsSimple) {
      return !!matchRightIncl(str, idx, resolvedOpts.breakToTheLeftOf);
    }
    let bucket = breakToTheLeftOfByFirstChar.get(str[idx]);
    if (bucket === undefined) {
      return false;
    }
    for (let n = 0, bucketLen = bucket.length; n < bucketLen; n++) {
      if (str.startsWith(bucket[n], idx)) {
        return true;
      }
    }
    return false;
  }

  // Is the tag starting at "idx" (which the callers have already established
  // to be a "<") one of resolvedOpts.mindTheInlineTags? "allowSlash" mirrors
  // opts.trimCharsBeforeMatching = "/", i.e. it also accepts closing tags.
  function inlineTagOnTheRight(idx: number, allowSlash: boolean): boolean {
    if (!inlineTagsAreWordsOnly) {
      return !!matchRight(str, idx, resolvedOpts.mindTheInlineTags, {
        ...(allowSlash ? { trimCharsBeforeMatching: "/" } : {}),
        cb: (nextChar) => !nextChar || !isWordChar(nextChar),
      });
    }
    let start = idx + 1;
    if (allowSlash) {
      while (str[start] === "/") {
        start++;
      }
    }
    let end = start;
    while (end < len && isWordCharCode(str.charCodeAt(end))) {
      end++;
    }
    return end > start && mindTheInlineTagsSet.has(str.slice(start, end));
  }

  // Return the ASCII-lowercased attribute name whose quoted value starts at
  // "idx". HTML allows whitespace on either side of the equals sign.
  function attributeNameBeforeQuote(idx: number): string | null {
    let equalsAt = idx - 1;
    while (equalsAt >= 0 && isWhitespaceChar(str[equalsAt])) {
      equalsAt--;
    }
    if (str[equalsAt] !== "=") {
      return null;
    }

    let nameEndsAt = equalsAt;
    let nameStartsAt = equalsAt - 1;
    while (nameStartsAt >= 0 && isWhitespaceChar(str[nameStartsAt])) {
      nameStartsAt--;
      nameEndsAt--;
    }
    while (
      nameStartsAt >= 0 &&
      isHtmlNameChar(str[nameStartsAt])
    ) {
      nameStartsAt--;
    }

    return nameStartsAt + 1 < nameEndsAt
      ? str.slice(nameStartsAt + 1, nameEndsAt).toLowerCase()
      : null;
  }

  function isHtmlTagAt(idx: number, name: string, closing: boolean): boolean {
    if (str[idx] !== "<") {
      return false;
    }
    let nameStartsAt = idx + 1;
    if (closing) {
      if (str[nameStartsAt] !== "/") {
        return false;
      }
      nameStartsAt++;
    } else if (str[nameStartsAt] === "/") {
      return false;
    }

    for (let offset = 0; offset < name.length; offset++) {
      let code = str.charCodeAt(nameStartsAt + offset);
      if (code > 64 && code < 91) {
        code += 32;
      }
      if (code !== name.charCodeAt(offset)) {
        return false;
      }
    }

    return (
      !isHtmlNameChar(str[nameStartsAt + name.length]) &&
      !isLetter(codePointAtIndex(str, nameStartsAt + name.length))
    );
  }

  function findClosingHtmlTag(from: number, name: string): number {
    let candidate = str.indexOf("<", from);
    while (candidate !== -1) {
      if (isHtmlTagAt(candidate, name, true)) {
        return candidate;
      }
      candidate = str.indexOf("<", candidate + 1);
    }
    return -1;
  }
  let lastLinebreak = null;
  let whitespaceStartedAt = null;
  let nonWhitespaceCharMet = false;
  let countCharactersPerLine = 0;

  // new characters-per-line counter
  let cpl = 0;

  let withinStyleTag = false;
  let withinHTMLConditional = false; // <!--[if lte mso 11]> etc
  let withinInlineStyle = null;
  let htmlAttributeQuoteStartedAt = null;
  let cssQuoteStartedAt = null;
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
  // index of the first non-whitespace character, or "len" when the input is
  // whitespace-only; lets the loop answer "is there content to the left of
  // i?" in constant time. Walked rather than derived from trimStart(), which
  // would copy the whole string just to measure it.
  let contentStartsAt = 0;
  while (contentStartsAt < len && isWhitespaceChar(str[contentStartsAt])) {
    contentStartsAt++;
  }
  let midLen = Math.floor(len / 2);
  const leavePercForLastStage = 0.01; // in range of [0, 1]
  const mainProgressShare = 1 - leavePercForLastStage;
  let lastPercentage: number | null = null;

  function reportProgressAt(fraction: number): void {
    if (!resolvedOpts.reportProgressFunc || len <= 1000) {
      return;
    }

    const boundedFraction = Math.max(0, Math.min(fraction, 1));
    const percentage = Math.floor(
      resolvedOpts.reportProgressFuncFrom +
        (resolvedOpts.reportProgressFuncTo -
          resolvedOpts.reportProgressFuncFrom) *
          boundedFraction,
    );

    if (percentage !== lastPercentage) {
      lastPercentage = percentage;
      resolvedOpts.reportProgressFunc(percentage);
    }
  }

  // one more round to collapse the whitespace to:
  // 1. Tackle indentations
  // 2. Remove excessive whitespace between strings on each line (not touching indentations)

  // Progress-wise, 99% is allocated to the loop and the final 1% to applying
  // ranges. Both paths explicitly report completion.

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
          `\n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
            str[i]?.trim() ? str[i] : JSON.stringify(str[i], null, 0)
          }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`,
        );

      // Report the progress. We'll allocate 98% of the progress bar to this stage
      if (resolvedOpts.reportProgressFunc) {
        if (len > 1000 && len < 2000) {
          if (i === midLen) {
            reportProgressAt(0.5);
          }
        } else if (len >= 2000) {
          reportProgressAt((i / len) * mainProgressShare);
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
            `${`\u001b[${32}m${`TWO CLOSING CURLY BRACES`}\u001b[${39}m`}`,
          );
        if (countCharactersPerLine + 1 >= resolvedOpts.lineLengthLimit) {
          DEV && console.log(`line length exceeded!`);
          finalIndexesToDelete.push(i, i, lineEnding);
          DEV &&
            console.log(
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                [i, i, lineEnding],
                null,
                0,
              )}`,
            );
          DEV &&
            console.log(
              `${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${0}`,
            );
          countCharactersPerLine = 0;
        } else {
          DEV && console.log(`within line length limit, overwrite the stage`);
          stageFrom = i;
          stageTo = i;
          stageAdd = " ";
          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} stageFrom = ${stageFrom}; stageTo = ${stageTo}; stageAdd = "${stageAdd}"`,
            );
        }
      }

      // turn off doNothing if marker passed
      // ███████████████████████████████████████

      if (doNothing && typeof doNothing === "number" && i >= doNothing) {
        doNothing = undefined;
        DEV && console.log(`TURN OFF doNothing`);
      }

      // catch ending of </script...
      // ███████████████████████████████████████

      if (
        scriptStartedAt !== null &&
        isHtmlTagAt(i, "script", true)
      ) {
        DEV && console.log(`ENDING OF A SCRIPT TAG CAUGHT`);
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
          isWhitespaceChar(str[~-i])
        ) {
          // march backwards
          DEV && console.log(`\u001b[${36}m${`march backwards`}\u001b[${39}m`);
          for (let y = i; y--; ) {
            DEV &&
              console.log(
                `\u001b[${36}m${`str[${y}] = ${JSON.stringify(
                  str[y],
                  null,
                  0,
                )}`}\u001b[${39}m`,
              );
            if (
              str[y] === "\n" ||
              str[y] === "\r" ||
              !isWhitespaceChar(str[y])
            ) {
              if (y + 1 < i) {
                DEV &&
                  console.log(
                    `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${y + 1}, ${i}]`,
                  );
                finalIndexesToDelete.push(y + 1, i);
              }
              DEV && console.log(`\u001b[${36}m${`BREAK`}\u001b[${39}m`);
              break;
            }
          }
        }

        // 2.
        scriptStartedAt = null;
        doNothing = false;
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`scriptStartedAt`}\u001b[${39}m`} = null, ${`\u001b[${33}m${`doNothing`}\u001b[${39}m`} = false`,
          );
        i += 8;
        DEV && console.log(`OFFSET i now = ${i}, then CONTINUE`);
        continue;
      }

      // catch start of <script...
      // ███████████████████████████████████████

      if (
        !doNothing &&
        !withinStyleTag &&
        isHtmlTagAt(i, "script", false)
      ) {
        DEV && console.log(`STARTING OF A SCRIPT TAG CAUGHT`);
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
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                whitespaceStartedAt + 1
              }, ${i}, ${JSON.stringify(whatToInsert, null, 0)}]`,
            );
        }

        whitespaceStartedAt = null;
        lastLinebreak = null;
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`scriptStartedAt`}\u001b[${39}m`} = ${i}, ${`\u001b[${33}m${`scriptStartedAt`}\u001b[${39}m`} = true, RESET ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = null; ${`\u001b[${33}m${`lastLinebreak`}\u001b[${39}m`} = null`,
          );
      }

      // Preserve ordinary quoted HTML attribute values verbatim. Inline style
      // attributes deliberately enter their CSS-specific minification mode.
      if (!doNothing && htmlAttributeQuoteStartedAt !== null) {
        if (resolvedOpts.removeLineBreaks) {
          countCharactersPerLine = `\r\n`.includes(str[i])
            ? 0
            : countCharactersPerLine + 1;
        }
        if (
          i > htmlAttributeQuoteStartedAt &&
          str[i] === str[htmlAttributeQuoteStartedAt]
        ) {
          htmlAttributeQuoteStartedAt = null;
        }
        continue;
      }
      if (
        !doNothing &&
        tagNameStartsAt !== null &&
        !withinInlineStyle &&
        `"'`.includes(str[i])
      ) {
        let attributeName = attributeNameBeforeQuote(i);
        if (attributeName === "style") {
          withinInlineStyle = i;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`withinInlineStyle`}\u001b[${39}m`} = ${withinInlineStyle}`,
          );
        } else if (attributeName !== null) {
          htmlAttributeQuoteStartedAt = i;
          if (resolvedOpts.removeLineBreaks) {
            countCharactersPerLine += 1;
          }
          continue;
        }
      }

      // CSS comment delimiters and whitespace inside a quoted CSS value are
      // data. Preserve the string until its matching unescaped quote.
      if (!doNothing && cssQuoteStartedAt !== null) {
        if (resolvedOpts.removeLineBreaks) {
          countCharactersPerLine = `\r\n`.includes(str[i])
            ? 0
            : countCharactersPerLine + 1;
        }
        if (i > cssQuoteStartedAt && str[i] === str[cssQuoteStartedAt]) {
          let backslashes = 0;
          for (let y = i; y > 0 && str[y - 1] === "\\"; y--) {
            backslashes++;
          }
          if (backslashes % 2 === 0) {
            cssQuoteStartedAt = null;
          }
        }
        continue;
      }
      if (
        !doNothing &&
        (withinStyleTag || withinInlineStyle) &&
        (withinInlineStyle || tagNameStartsAt === null) &&
        `"'`.includes(str[i]) &&
        !(withinInlineStyle && str[i] === str[withinInlineStyle])
      ) {
        cssQuoteStartedAt = i;
        if (resolvedOpts.removeLineBreaks) {
          countCharactersPerLine += 1;
        }
        continue;
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
        !isWordChar(str[i]) // not a letter
      ) {
        tagName = str.slice(tagNameStartsAt, i);
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`tagName`}\u001b[${39}m`} = ${tagName}`,
          );

        // check for inner tag whitespace
        let idxOnTheRight = right(str, ~-i);
        let idxRightOfI = right(str, i);
        if (
          typeof idxOnTheRight === "number" &&
          str[idxOnTheRight] === ">" &&
          isWhitespaceChar(str[i]) &&
          idxRightOfI
        ) {
          finalIndexesToDelete.push(i, idxRightOfI as number);
          DEV &&
            console.log(
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${right(
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
          if (isWhitespaceChar(str[i]) && idxRightOfI) {
            finalIndexesToDelete.push(i, idxRightOfI as number);
            DEV &&
              console.log(
                `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${right(
                  str,
                  i,
                )}]`,
              );
          }
          // if there's space between slash and bracket
          let idxAfterSlashGap = right(str, idxOnTheRight + 1);
          if (str[idxOnTheRight + 1] !== ">" && idxAfterSlashGap) {
            finalIndexesToDelete.push(
              idxOnTheRight + 1,
              idxAfterSlashGap as number,
            );
            DEV &&
              console.log(
                `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
        if (isWordChar(str[i])) {
          tagNameStartsAt = i;
          DEV && console.log(`SET tagNameStartsAt = ${tagNameStartsAt}`);
        } else {
          let idxAfterBracket = right(str, ~-i);
          let idxAfterSlash = right(str, idxAfterBracket);
          if (
            str[idxAfterBracket as number] === "/" &&
            isWordChar(str[idxAfterSlash as number] || "")
          ) {
            tagNameStartsAt = idxAfterSlash;
            DEV && console.log(`SET tagNameStartsAt = ${tagNameStartsAt}`);
          }
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
            `${`\u001b[${32}m${`ENDING OF A CSS COMMENT CAUGHT`}\u001b[${39}m`}`,
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
            `EXPANDED TO ${JSON.stringify([stageFrom, stageTo], null, 0)}`,
          );

        // reset marker:
        styleCommentStartedAt = null;
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`styleCommentStartedAt`}\u001b[${39}m`} = null`,
          );

        if (stageFrom != null) {
          finalIndexesToDelete.push(stageFrom, stageTo);
          DEV &&
            console.log(
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to final [${stageFrom}, ${stageTo}]`,
            );
        } else {
          countCharactersPerLine += 1;
          DEV &&
            console.log(
              `${`\u001b[${33}m${`countCharactersPerLine++`}\u001b[${39}m`}, now = ${JSON.stringify(
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
        DEV && console.log(`SET doNothing = ${doNothing}`);
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
            `${`\u001b[${32}m${`STARTING OF A CSS COMMENT CAUGHT`}\u001b[${39}m`}`,
          );

        // independently of options settings, mark the options setting
        // "removeCSSComments" as applicable:
        if (!applicableOpts.removeCSSComments) {
          applicableOpts.removeCSSComments = true;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`applicableOpts.removeCSSComments`}\u001b[${39}m`} = ${JSON.stringify(
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
              `SET ${`\u001b[${33}m${`styleCommentStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
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
            `${`\u001b[${36}m${`██ CONDITIONAL'S CLOSING CAUGHT`}\u001b[${39}m`}`,
          );
        withinHTMLConditional = false;
        DEV &&
          console.log(
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinHTMLConditional`}\u001b[${39}m`} = ${withinHTMLConditional}`,
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
              `${`\u001b[${32}m${`ENDING OF AN HTML COMMENT CAUGHT`}\u001b[${39}m`}`,
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
              `EXPANDED TO ${JSON.stringify([stageFrom, stageTo], null, 0)}`,
            );

          // reset marker:
          htmlCommentStartedAt = null;
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`htmlCommentStartedAt`}\u001b[${39}m`} = null`,
            );

          if (stageFrom != null) {
            // it depends is there any character allowance left from the
            // line length limit or not
            DEV &&
              console.log(
                `${`\u001b[${33}m${`cpl`}\u001b[${39}m`} = ${JSON.stringify(
                  cpl,
                  null,
                  4,
                )}`,
              );
            if (
              resolvedOpts.removeLineBreaks &&
              resolvedOpts.lineLengthLimit &&
              cpl - (stageTo - stageFrom) >= resolvedOpts.lineLengthLimit
            ) {
              finalIndexesToDelete.push(stageFrom, stageTo, lineEnding);
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to final [${stageFrom}, ${stageTo}, ${JSON.stringify(
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
                  `${`\u001b[${31}m${`RESET`}\u001b[${39}m`} cpl = ${cpl}`,
                );
            } else {
              // we have some character length allowance left so
              // let's just delete the comment and reduce the cpl
              // by that length
              finalIndexesToDelete.push(stageFrom, stageTo);
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to final [${stageFrom}, ${stageTo}]`,
                );

              cpl -= stageTo - stageFrom;
              DEV &&
                console.log(
                  `${`\u001b[${31}m${`SET`}\u001b[${39}m`} cpl = ${cpl}`,
                );
            }

            // finalIndexesToDelete.push(i + 1, i + 1, "\n");
            // DEV && console.log(`0851 PUSH [${i + 1}, ${i + 1}, "\\n"]`);
            // countCharactersPerLine = 0;
          } else {
            DEV &&
              console.log(
                `${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
                  countCharactersPerLine + distanceFromHereToCommentEnding - 1
                }`,
              );
            countCharactersPerLine += distanceFromHereToCommentEnding - 1;
            i += distanceFromHereToCommentEnding - 1;
          }
          // DEV && console.log(`0863 CONTINUE`);
          // continue;

          doNothing = i + distanceFromHereToCommentEnding;
          DEV && console.log(`SET doNothing = ${doNothing}`);
        }
      }

      // catch a start of HTML comment
      // ███████████████████████████████████████

      if (
        !doNothing &&
        !withinStyleTag &&
        !withinInlineStyle &&
        str[i] === "<" &&
        (str.startsWith("<!--", i) || str.startsWith("<![endif", i)) &&
        htmlCommentStartedAt === null
      ) {
        DEV &&
          console.log(
            `${`\u001b[${32}m${`STARTING OF AN HTML COMMENT CAUGHT`}\u001b[${39}m`}`,
          );

        // A bare conditional tail is applicable in every mode but removable
        // only when conditional-comment removal is enabled.
        if (str.startsWith("<![endif", i)) {
          if (resolvedOpts.removeHTMLComments === 2) {
            htmlCommentStartedAt = i;
          }
        } else if (str.startsWith("[if", i + 4)) {
          // detect outlook conditionals
          DEV && console.log();
          if (!withinHTMLConditional) {
            DEV &&
              console.log(
                `${`\u001b[${36}m${`██ CONDITIONAL'S OPENING CAUGHT`}\u001b[${39}m`}`,
              );
            withinHTMLConditional = true;
            DEV &&
              console.log(
                `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinHTMLConditional`}\u001b[${39}m`} = ${withinHTMLConditional}`,
              );
          }

          // skip the second counterpart, "<!-->" of "<!--[if !mso]><!-->"

          // the plan is to not set the "htmlCommentStartedAt" at all if deletion
          // is not needed
          if (resolvedOpts.removeHTMLComments === 2) {
            htmlCommentStartedAt = i;
            DEV &&
              console.log(
                `SET ${`\u001b[${33}m${`htmlCommentStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
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
              `SET ${`\u001b[${33}m${`htmlCommentStartedAt`}\u001b[${39}m`} = ${JSON.stringify(
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
              `SET ${`\u001b[${33}m${`applicableOpts.removeHTMLComments`}\u001b[${39}m`} = ${JSON.stringify(
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
        isHtmlTagAt(i, "style", true)
      ) {
        withinStyleTag = false;
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`withinStyleTag`}\u001b[${39}m`} = false`,
          );
      } else if (
        !doNothing &&
        !withinStyleTag &&
        styleCommentStartedAt === null &&
        isHtmlTagAt(i, "style", false)
      ) {
        withinStyleTag = true;
        DEV &&
          console.log(
            `SET ${`\u001b[${33}m${`withinStyleTag`}\u001b[${39}m`} = true`,
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
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i + 23}, ${
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
            `SET ${`\u001b[${33}m${`withinInlineStyle`}\u001b[${39}m`} = ${withinInlineStyle}`,
          );
      }

      // catch whitespace
      // ███████████████████████████████████████
      if (!doNothing && isWhitespaceChar(str[i])) {
        // if whitespace
        if (whitespaceStartedAt === null) {
          whitespaceStartedAt = i;
          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = ${whitespaceStartedAt}`,
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
          DEV && console.log();
          if (resolvedOpts.removeLineBreaks) {
            DEV &&
              console.log(
                `${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
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
                  `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [0, ${i}]`,
                );
            }
          } else {
            DEV && console.log("not beginning of a file");
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
                  `inside ${`\u001b[${33}m${`CASE 1`}\u001b[${39}m`}`,
                );

              if (
                !nonWhitespaceCharMet &&
                lastLinebreak !== null &&
                i > lastLinebreak
              ) {
                finalIndexesToDelete.push(lastLinebreak + 1, i);
                DEV &&
                  console.log(
                    `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
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
                      `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                        whitespaceStartedAt + 1
                      }, ${i}]`,
                    );
                } else if (str[whitespaceStartedAt] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                        whitespaceStartedAt + 1
                      }, ${i}]`,
                    );
                } else if (str[~-i] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt, ~-i);
                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartedAt}, ${~-i}]`,
                    );
                } else {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, " ");
                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartedAt}, ${i}, " "]`,
                    );
                }
              }
            }

            // ===================================================================
            // ██ CASE 2. Remove linebreaks (includes indentation removal by definition).
            if (resolvedOpts.removeLineBreaks || withinInlineStyle) {
              DEV &&
                console.log(
                  `inside ${`\u001b[${33}m${`CASE 2`}\u001b[${39}m`}`,
                );
              //
              // ██ CASE 2-1 - special break points from resolvedOpts.breakToTheLeftOf

              DEV &&
                console.log(
                  `${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`breakToTheLeftOfFirstLetters`}\u001b[${39}m`} = ${JSON.stringify(
                    [...breakToTheLeftOfFirstLetters],
                    null,
                    4,
                  )}`,
                );
              if (
                breakToTheLeftOfFirstLetters.includes(str[i]) &&
                breakToTheLeftOfMatches(i)
              ) {
                DEV && console.log("inside CASE 2-1");
                DEV &&
                  console.log(
                    `\u001b[${36}m${`██`}\u001b[${39}m line break removal section`,
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
                      `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartedAt}, ${i}, ${JSON.stringify(
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
                    `${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${1}`,
                  );

                countCharactersPerLine = 1;
                DEV &&
                  console.log(
                    `RESET all ${`\u001b[${33}m${`stage*`}\u001b[${39}m`} and ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`}`,
                  );
                DEV && console.log(`CONTINUE`);
                continue;
              }

              // ██ CASE 2-2 - rest of whitespace chunk removal clauses

              DEV && console.log("inside CASE 2-2");
              let whatToAdd = " ";

              // skip for inline tags and also inline comparisons vs. numbers
              // for example "something < 2" or "zzz > 1"
              if (
                // (
                str[i] === "<" &&
                inlineTagOnTheRight(i, false)
                // ) ||
                // ("<>".includes(str[i]) &&
                //   ("0123456789".includes(str[right(str, i)]) ||
                //     "0123456789".includes(str[left(str, i)])))
              ) {
                // nothing
                DEV && console.log(`do nothing`);
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
                (str[i] === "!" &&
                  str.startsWith("!important", i) &&
                  !withinHTMLConditional) ||
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
                DEV && console.log(`whatToAdd = ""`);

                whatToAdd = "";

                let idxRightOfSlash =
                  str[i] === "/" && str[i + 1] === ">" ? right(str, i) : null;
                if (idxRightOfSlash && (idxRightOfSlash as number) > i + 1) {
                  // delete whitespace between / and >
                  finalIndexesToDelete.push(i + 1, idxRightOfSlash as number);
                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                        i + 1
                      }, ${right(str, i)}]`,
                    );

                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
                        countCharactersPerLine -
                        (right(str, i) as number) -
                        i +
                        1
                      }`,
                    );
                  countCharactersPerLine -= (idxRightOfSlash as number) - i + 1;
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
                    `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whatToAdd`}\u001b[${39}m`} = "${whatToAdd}"`,
                  );
              }

              DEV &&
                console.log(
                  `calculated ${`\u001b[${33}m${`whatToAdd`}\u001b[${39}m`} = ${JSON.stringify(
                    whatToAdd,
                    null,
                    0,
                  )}`,
                );
              if (whatToAdd?.length) {
                DEV &&
                  console.log(
                    `${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
                      countCharactersPerLine + 1
                    }`,
                  );
                countCharactersPerLine += 1;
              }

              // TWO CASES:
              if (!resolvedOpts.lineLengthLimit) {
                DEV && console.log(`\u001b[${35}m${`2-1`}\u001b[${39}m`);
                DEV && console.log("!resolvedOpts.lineLengthLimit");
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
                      `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartedAt}, ${i}, ${JSON.stringify(
                        whatToAdd,
                        null,
                        0,
                      )}]`,
                    );
                }
              } else {
                DEV && console.log(`\u001b[${35}m${`2-2`}\u001b[${39}m`);
                DEV &&
                  console.log(
                    `- 2-2 - resolvedOpts.lineLengthLimit; ${`\u001b[${33}m${`LIMIT`}\u001b[${39}m`} = ${`\u001b[${35}m${resolvedOpts.lineLengthLimit}\u001b[${39}m`}; ${`\u001b[${33}m${`COUNT`}\u001b[${39}m`} = ${`\u001b[${35}m${countCharactersPerLine}\u001b[${39}m`}`,
                  );
                // 2-2: Line-length limiting is on (not that easy)
                // maybe we are already beyond the limit?
                if (
                  countCharactersPerLine >= resolvedOpts.lineLengthLimit ||
                  !str[i + 1] ||
                  str[i] === ">" ||
                  (str[i] === "/" && str[i + 1] === ">")
                ) {
                  DEV && console.log(`\u001b[${35}m${`2-2-1`}\u001b[${39}m`);
                  DEV &&
                    console.log(
                      `${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`}(${countCharactersPerLine}) >= ${`\u001b[${33}m${`resolvedOpts.lineLengthLimit`}\u001b[${39}m`}(${
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
                    DEV && console.log(`SET whatToAdd = "\\n"`);
                    countCharactersPerLine = 1;
                    DEV && console.log(`RESET countCharactersPerLine = 1`);
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
                        `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartedAt}, ${i}, ${JSON.stringify(
                          whatToAdd,
                          null,
                          0,
                        )}]`,
                      );
                    lastLinebreak = null;
                    DEV &&
                      console.log(
                        `${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastLinebreak`}\u001b[${39}m`} = ${JSON.stringify(
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
                      `${`\u001b[${32}m${`RESET`}\u001b[${39}m`} all stage* vars`,
                    );
                } else if (
                  stageFrom === null ||
                  whitespaceStartedAt < stageFrom
                ) {
                  // only submit the range if it's bigger
                  DEV && console.log(`\u001b[${35}m${`2-2-2`}\u001b[${39}m`);
                  DEV &&
                    console.log(
                      `${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`}(${countCharactersPerLine}) <= ${`\u001b[${33}m${`resolvedOpts.lineLengthLimit`}\u001b[${39}m`}(${
                        resolvedOpts.lineLengthLimit
                      })`,
                    );
                  stageFrom = whitespaceStartedAt;
                  stageTo = i;
                  stageAdd = whatToAdd;
                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`SET`}\u001b[${39}m`} stageFrom = ${stageFrom}; stageTo = ${stageTo}; stageAdd = "${stageAdd}"`,
                    );
                }

                DEV &&
                  console.log(
                    `stageFrom = ${stageFrom}; whitespaceStartedAt = ${whitespaceStartedAt}`,
                  );
              }
            }
            // ===================================================================
          }

          // finally, toggle the marker:
          whitespaceStartedAt = null;
          DEV &&
            console.log(
              `${`\u001b[${32}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartedAt`}\u001b[${39}m`} = ${whitespaceStartedAt}, (${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} = ${countCharactersPerLine})`,
            );

          // toggle nonWhitespaceCharMet
          if (!nonWhitespaceCharMet) {
            nonWhitespaceCharMet = true;
            DEV &&
              console.log(
                `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nonWhitespaceCharMet`}\u001b[${39}m`} = ${JSON.stringify(
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
                `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`beginningOfAFile`}\u001b[${39}m`} = ${JSON.stringify(
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
                `${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
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
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nonWhitespaceCharMet`}\u001b[${39}m`} = ${JSON.stringify(
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
        !(str[i] === "<" && str.startsWith("</a", i))
      ) {
        if (
          breakToTheLeftOfFirstLetters &&
          breakToTheLeftOfMatches(i) &&
          // is there any non-whitespace to the left? Asking str.slice(0, i)
          // would copy the whole left side on every breakpoint - quadratic
          // over the input - and the answer never changes once known.
          contentStartsAt < i &&
          (str[i] !== "<" ||
            !str.startsWith("<![endif]", i) ||
            !matchLeft(str, i, "<!--"))
        ) {
          DEV &&
            console.log(
              `${`\u001b[${31}m${`resolvedOpts.breakToTheLeftOf BREAKPOINT!`}\u001b[${39}m`}`,
            );
          DEV &&
            console.log(
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i}, "\\n"]`,
            );
          finalIndexesToDelete.push(i, i, lineEnding);
          stageFrom = null;
          stageTo = null;
          stageAdd = null;

          DEV &&
            console.log(
              `${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${1}`,
            );
          countCharactersPerLine = 1;
          DEV &&
            console.log(
              `RESET all ${`\u001b[${33}m${`stage*`}\u001b[${39}m`}, then CONTINUE`,
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
            isWhitespaceChar(str[i])
          ) {
            DEV && console.log(`inside release-stage clauses`);
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
                  `INITIAL ${`\u001b[${33}m${`whatToAdd`}\u001b[${39}m`} = ${JSON.stringify(
                    whatToAdd,
                    null,
                    4,
                  )}`,
                );

              DEV &&
                console.log(
                  `FIY, ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} = ${JSON.stringify(
                    countCharactersPerLine,
                    null,
                    4,
                  )}`,
                );

              // if we are not on breaking point, last "stageAdd" needs to be
              // amended into linebreak because otherwise we'll exceed the
              // character limit
              if (
                !isWhitespaceChar(str[i]) &&
                str[i + 1]?.trim() &&
                countCharactersPerLine + (stageAdd ? stageAdd.length : 0) >
                  resolvedOpts.lineLengthLimit
              ) {
                DEV &&
                  console.log(
                    `SET whatToAdd = ${JSON.stringify(lineEnding, null, 0)}`,
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
                    `- ${`\u001b[${32}m${`REPLACE`}\u001b[${39}m`} this white space`,
                  );
                // push this range only if it's not between curlies, } and {
                if (!(str[~-stageFrom] === "}" && str[stageTo] === "{")) {
                  finalIndexesToDelete.push(stageFrom, stageTo, whatToAdd);
                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${stageFrom}, ${stageTo}, ${JSON.stringify(
                        whatToAdd,
                        null,
                        0,
                      )}]`,
                    );
                  lastLinebreak = null;
                  DEV &&
                    console.log(
                      `${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastLinebreak`}\u001b[${39}m`} = ${JSON.stringify(
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
                    `${`${`\u001b[${31}m${`██`}\u001b[${39}m`}${`\u001b[${33}m${`██`}\u001b[${39}m`}`.repeat(
                      10,
                    )} - lastLinebreak = ${lastLinebreak}`,
                  );
                // countCharactersPerLine -= i - (lastLinebreak || 0);
              }
            }

            DEV &&
              console.log(
                `${`\u001b[${33}m${`leftTagName`}\u001b[${39}m`} = ${leftTagName}`,
              );
            // 2. put this current place into stage
            // =============================================================
            if (
              !isWhitespaceChar(str[i]) &&
              (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) ||
                (str[~-i] &&
                  CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[~-i]))) &&
              isStr(leftTagName) &&
              (!tagName || !mindTheInlineTagsSet.has(tagName)) &&
              !(str[i] === "<" && inlineTagOnTheRight(i, false)) &&
              !(str[i] === "<" && inlineTagOnTheRight(i, true))
            ) {
              stageFrom = i;
              stageTo = i;
              stageAdd = null;
              DEV &&
                console.log(
                  `SET stage from = ${stageFrom}; stageTo = ${stageTo}; RESET "stageAdd = null"`,
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
                  !mindTheInlineTagsSet.has(tagName))) &&
              !(str[i] === "<" && inlineTagOnTheRight(i, true))
            ) {
              stageFrom = null;
              stageTo = null;
              stageAdd = null;
              DEV && console.log("RESET all stage vars");
            }
          }
        } else if (resolvedOpts.lineLengthLimit) {
          // countCharactersPerLine > resolvedOpts.lineLengthLimit

          DEV && console.log(`${`\u001b[${36}m${`██`}\u001b[${39}m`}`);
          // LIMIT HAS BEEN EXCEEDED!
          // WE NEED TO BREAK RIGHT HERE
          if (
            CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) &&
            !(str[i] === "<" && inlineTagOnTheRight(i, true))
          ) {
            // ██ 1.
            //
            DEV &&
              console.log(
                `${`\u001b[${36}m${`██ LIMIT (${resolvedOpts.lineLengthLimit}) EXCEEDED`}\u001b[${39}m`} char break on left`,
              );
            // if really exceeded, not on limit, commit stage which will shorten
            // the string and maybe we'll be within the limit range again
            if (
              stageFrom !== null &&
              stageTo !== null &&
              (stageFrom !== stageTo || stageAdd?.length)
            ) {
              DEV && console.log(`FOUND STAGED`);
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
                DEV && console.log(`${`\u001b[${34}m${`██`}\u001b[${39}m`}`);
              } else {
                // So,
                // countCharactersPerLine -
                // (stageTo - stageFrom - whatToAddLength) - 1 <=
                // resolvedOpts.lineLengthLimit

                // don't break at stage, just apply its contents and we're good
                DEV && console.log(`${`\u001b[${34}m${`██`}\u001b[${39}m`}`);
                finalIndexesToDelete.push(stageFrom, stageTo, stageAdd);
                DEV &&
                  console.log(
                    `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${stageFrom}, ${stageTo}, ${JSON.stringify(
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
                  DEV && console.log(`${`\u001b[${34}m${`██`}\u001b[${39}m`}`);
                  finalIndexesToDelete.push(i, i, lineEnding);
                  DEV &&
                    console.log(
                      `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i}, ${JSON.stringify(
                        lineEnding,
                        null,
                        0,
                      )}]`,
                    );
                  countCharactersPerLine = 0;
                  DEV &&
                    console.log(
                      `${`\u001b[${31}m${`RESET`}\u001b[${39}m`} countCharactersPerLine = 0`,
                    );
                }

                // reset
                stageFrom = null;
                stageTo = null;
                stageAdd = null;
                DEV && console.log(`RESET all stage vars`);
              }
            } else {
              DEV && console.log(`BUT NO STAGED FOUND`);
              //
              finalIndexesToDelete.push(i, i, lineEnding);
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i}, ${JSON.stringify(
                    lineEnding,
                    null,
                    0,
                  )}]`,
                );
              countCharactersPerLine = 0;
              DEV &&
                console.log(
                  `${`\u001b[${31}m${`RESET`}\u001b[${39}m`} countCharactersPerLine = 0`,
                );
            }
          } else if (
            str[i + 1] &&
            CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) &&
            isStr(tagName) &&
            Array.isArray(resolvedOpts.mindTheInlineTags) &&
            resolvedOpts.mindTheInlineTags.length &&
            !mindTheInlineTagsSet.has(tagName)
          ) {
            // ██ 2.
            //
            DEV &&
              console.log(
                `${`\u001b[${36}m${`██ LIMIT (${resolvedOpts.lineLengthLimit}) EXCEEDED`}\u001b[${39}m`} break on the right of this character`,
              );
            if (
              stageFrom !== null &&
              stageTo !== null &&
              (stageFrom !== stageTo || stageAdd?.length)
            ) {
              DEV && console.log(`FOUND STAGED`);
            } else {
              DEV && console.log(`BUT NO STAGED FOUND`);
              //
              finalIndexesToDelete.push(i + 1, i + 1, lineEnding);
              DEV &&
                console.log(
                  `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i + 1}, ${
                    i + 1
                  }, ${JSON.stringify(lineEnding, null, 0)}]`,
                );
              countCharactersPerLine = 0;
              DEV &&
                console.log(
                  `${`\u001b[${31}m${`RESET`}\u001b[${39}m`} countCharactersPerLine = 0`,
                );
            }
          } else if (isWhitespaceChar(str[i])) {
            // ██ 3.
            //
            DEV &&
              console.log(
                `${`\u001b[${36}m${`██ LIMIT (${resolvedOpts.lineLengthLimit}) EXCEEDED`}\u001b[${39}m`} whitespace as breaking point`,
              );
          } else if (!str[i + 1]) {
            // ██ 4.
            //
            DEV &&
              console.log(
                `${`\u001b[${36}m${`██ LIMIT (${resolvedOpts.lineLengthLimit}) EXCEEDED`}\u001b[${39}m`} EOL is next`,
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
                  `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${stageFrom}, ${stageTo}, ${JSON.stringify(
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
            `${`\u001b[${32}m${`██ LIMIT REACHED`}\u001b[${39}m`}! countCharactersPerLine(${`\u001b[${33}m${countCharactersPerLine}\u001b[${39}m`}) >= resolvedOpts.lineLengthLimit(${`\u001b[${33}m${resolvedOpts.lineLengthLimit}\u001b[${39}m`}) MIGHT RELEASE STAGE TO FINAL`,
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
                `SET whatToAdd = ${JSON.stringify(whatToAdd, null, 4)}`,
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
                `${`\u001b[${33}m${`CORRECTION`}\u001b[${39}m`} stageFrom now = ${stageFrom}`,
              );
          }
          DEV &&
            console.log(
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${stageFrom}, ${stageTo}, ${JSON.stringify(
                whatToAdd,
                null,
                0,
              )}]`,
            );
          finalIndexesToDelete.push(stageFrom, stageTo, whatToAdd);

          DEV &&
            console.log(
              `${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
                i - stageTo
              }`,
            );
          countCharactersPerLine = i - stageTo;
          if (str[i].length) {
            DEV &&
              console.log(
                `${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} ${`\u001b[${33}m${`countCharactersPerLine`}\u001b[${39}m`} ${countCharactersPerLine} -> ${
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
              `RESET stage* vars; per-line count to ${countCharactersPerLine}`,
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
            `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastLinebreak`}\u001b[${39}m`} = ${JSON.stringify(
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
              `${`\u001b[${32}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`nonWhitespaceCharMet`}\u001b[${39}m`} = ${JSON.stringify(
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
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} line's trailing whitespace [${whitespaceStartedAt}, ${i}]`,
            );
        }
      }

      // catch the EOF
      // ███████████████████████████████████████
      if (!str[i + 1]) {
        if (withinStyleTag && styleCommentStartedAt !== null) {
          DEV &&
            console.log(
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} THIS UNFINISHED COMMENT`,
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
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} string's trailing whitespace [${whitespaceStartedAt}, ${
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
              `${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} string's trailing whitespace [${whitespaceStartedAt}, ${i}]`,
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
            `SET ${`\u001b[${33}m${`withinInlineStyle`}\u001b[${39}m`} = null`,
          );
      }

      // catch raw and preformatted element contents
      // ███████████████████████████████████████

      if (!doNothing && !withinStyleTag && str[i] === "<") {
        let protectedTagName = null;
        if (isHtmlTagAt(i, "pre", false)) {
          protectedTagName = "pre";
        } else if (isHtmlTagAt(i, "code", false)) {
          protectedTagName = "code";
        } else if (isHtmlTagAt(i, "textarea", false)) {
          protectedTagName = "textarea";
        }

        if (protectedTagName !== null) {
          DEV &&
            console.log(
              `OPENING ${protectedTagName.toUpperCase()} TAG CAUGHT`,
            );
          let closingTagAt = findClosingHtmlTag(i + 2, protectedTagName);
          doNothing = closingTagAt === -1 ? len : closingTagAt;
          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`} = ${doNothing}`,
            );
        }
      }

      // catch start of <![CDATA[
      // ███████████████████████████████████████

      if (!doNothing && str[i] === "<" && str.startsWith("<![CDATA[", i)) {
        DEV && console.log(`STARTING OF <![CDATA[`);

        let locationOfClosingCData = str.indexOf("]]>", i + 9);
        if (locationOfClosingCData > 0) {
          doNothing = locationOfClosingCData;
          DEV &&
            console.log(
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${31}m${`doNothing`}\u001b[${39}m`}`,
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
              `${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`leftTagName`}\u001b[${39}m`} = ${leftTagName}`,
            );
        }

        tagNameStartsAt = null;
        tagName = null;
        DEV &&
          console.log(
            `${`\u001b[${31}m${`RESET`}\u001b[${39}m`} tagNameStartsAt = null; tagName = null;`,
          );
      }

      // catch tag's opening bracket
      // ███████████████████████████████████████
      if (str[i] === "<" && leftTagName !== null) {
        // reset it after use
        leftTagName = null;
        DEV &&
          console.log(
            `${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`leftTagName`}\u001b[${39}m`} = null`,
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
          DEV && console.log(`SET doNothing = ${doNothing}`);
        }
      }

      // logging after each loop's iteration:
      // ███████████████████████████████████████
      DEV &&
        console.log(
          `    \u001b[${90}m${`██ ██ ██ ██ ██ END ██ ██ ██ ██ ██`}\u001b[${39}m`,
        );
      DEV &&
        console.log(
          `${`\u001b[${35}m${`cpl`}\u001b[${39}m`} = ${`\u001b[${35}m${cpl}\u001b[${39}m`};`,
        );

      let logDoNothing = true;

      DEV &&
        console.log(
          `${`\u001b[${36}m${`countCharactersPerLine`}\u001b[${39}m`} = ${JSON.stringify(
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
        `AFTER THE LOOP, finalIndexesToDelete.current() = ${JSON.stringify(
          finalIndexesToDelete.current(),
          null,
          4,
        )}`,
      );

    const ranges = finalIndexesToDelete.current();
    if (ranges) {
      // This accumulator is local to the call, so no wipe is necessary.

      let res = rApply(str, ranges, (applyPercDone) => {
        // allocate remaining "leavePercForLastStage" percentage of the total
        // progress reporting to this stage:
        if (resolvedOpts.reportProgressFunc && len >= 2000) {
          reportProgressAt(
            mainProgressShare +
              leavePercForLastStage * (applyPercDone / 100),
          );
        }
      });

      reportProgressAt(1);

      DEV &&
        console.log(
          `returning ${`\u001b[${33}m${`res`}\u001b[${39}m`} =\n\n${JSON.stringify(
            res,
            null,
            4,
          )}\n\n ${`\u001b[${90}m${`or:`}\u001b[${39}m`}\n\n"${res}"`,
        );
      DEV &&
        console.log(`\u001b[${90}m${`\n      ██ FIN ██\n\n`}\u001b[${39}m`);
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
  reportProgressAt(1);
  DEV &&
    console.log(
      `returning original ${`\u001b[${33}m${`str`}\u001b[${39}m`} =\n\n${JSON.stringify(
        str,
        null,
        4,
      )}\n\n ${`\u001b[${90}m${`or:`}\u001b[${39}m`}\n\n${str}`,
    );

  DEV && console.log();
  DEV && console.log();
  DEV && console.log(`\u001b[${90}m${`      ██ FIN ██\n\n`}\u001b[${39}m`);
  DEV && console.log();
  DEV && console.log();

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
