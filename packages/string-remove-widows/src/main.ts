import { matchRightIncl } from "string-match-left-right";
import { left, right } from "string-left-right";
import { Ranges } from "ranges-push";
import { rApply } from "ranges-apply";
import { version as v } from "../package.json";
const version: string = v;
import {
  rawnbsp,
  encodedNbspHtml,
  encodedNbspCss,
  encodedNbspJs,
  rawNdash,
  encodedNdashHtml,
  encodedNdashCss,
  encodedNdashJs,
  rawMdash,
  encodedMdashHtml,
  encodedMdashCss,
  encodedMdashJs,
  headsAndTailsJinja,
  headsAndTailsHugo,
  headsAndTailsHexo,
  knownHTMLTags,
} from "./util";
import { Range, Ranges as RangesType } from "../../../scripts/common";

interface Obj {
  [key: string]: any;
}

interface HeadsAndTailsObj {
  heads: string | string[];
  tails: string | string[];
}

interface Opts {
  removeWidowPreventionMeasures: boolean;
  convertEntities: boolean;
  targetLanguage: "html" | "css" | "js";
  UKPostcodes: boolean;
  hyphens: boolean;
  minWordCount: number;
  minCharCount: number;
  ignore: HeadsAndTailsObj[] | string | string[];
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
  tagRanges: Range[] | null;
}

const defaults: Opts = {
  removeWidowPreventionMeasures: false,
  convertEntities: true, // encode?
  targetLanguage: "html", // encode in what? [html, css, js]
  UKPostcodes: false, // replace space in UK postcodes?
  hyphens: true, // replace space with non-breaking space in front of dash
  minWordCount: 4, // if there are less words than this in chunk, skip
  minCharCount: 5, // if there are less characters than this in chunk, skip
  ignore: [], // put {heads: "{{", tails: "}}"} or presets: "jinja", "nunjucks", "hugo", "hexo"
  reportProgressFunc: null, // reporting progress function
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  tagRanges: [],
};

interface Res {
  res: string;
  ranges: RangesType;
  log: {
    timeTakenInMilliseconds: number;
  };
  whatWasDone: {
    removeWidows: boolean;
    convertEntities: boolean;
  };
}

function removeWidows(str: string, originalOpts?: Partial<Opts>): Res {
  console.log(
    `044 called removeWidows() on\n"${str}"\nusing originalOpts = ${JSON.stringify(
      originalOpts,
      null,
      4
    )}`
  );
  // track time taken
  const start = Date.now();

  // insurance:
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error(
        "string-remove-widows: [THROW_ID_01] the first input argument is completely missing! It should be given as string."
      );
    } else {
      throw new Error(
        `string-remove-widows: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(
          str,
          null,
          4
        )}`
      );
    }
  }

  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(
      `string-remove-widows: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }

  // consts

  const isArr = Array.isArray;
  const len = str.length;
  const rangesArr = new Ranges({ mergeType: 2 });
  const punctuationCharsToConsiderWidowIssue = ["."];
  const postcodeRegexFront = /[A-Z]{1,2}[0-9][0-9A-Z]?$/;
  const postcodeRegexEnd = /^[0-9][A-Z]{2}/;

  const leavePercForLastStage = 0.06; // in range of [0, 1]

  // vars

  let currentPercentageDone;
  let lastPercentage = 0;
  let wordCount = 0; // counted per-chunk (paragraph)
  let charCount = 0; // counted per-character, per chunk (paragraph)

  let secondToLastWhitespaceStartedAt; // necessary to support whitespace at line ends
  let secondToLastWhitespaceEndedAt; // necessary to support whitespace at line ends
  let lastWhitespaceStartedAt;
  let lastWhitespaceEndedAt;
  let lastEncodedNbspStartedAt;
  let lastEncodedNbspEndedAt;
  // let lineBreakCount;
  let doNothingUntil;

  // requests to bump word count in the future:
  let bumpWordCountAt;

  // prep the opts
  const opts: Opts = { ...defaults, ...originalOpts };

  // Now, strictly speaking, this program can remove widow words but also
  // it will decode any entities it encounters if option convertEntities is off.
  // We need an interface to report what actions were taken:
  const whatWasDone = {
    removeWidows: false,
    convertEntities: false,
  };

  if (
    !opts.ignore ||
    (!isArr(opts.ignore) && typeof opts.ignore !== "string")
  ) {
    opts.ignore = [];
  } else {
    // arrayiffy
    if (typeof opts.ignore === "string") {
      opts.ignore = [opts.ignore];
    }
    // expand the string value presets
    if ((opts.ignore as any).includes("all")) {
      // hugo heads tails and included in jinja's list, so can be omitted
      opts.ignore = (opts.ignore as string[]).concat(
        (headsAndTailsJinja as any).concat(headsAndTailsHexo)
      );
    } else if (
      (opts.ignore as any).some((val: any) => typeof val === "string")
    ) {
      // if some values are strings, we need to either remove them or expand them
      // from string to recognised list of heads/tails
      let temp: { heads: string | string[]; tails: string | string[] }[] = [];
      // console.log(
      //   `166 ${`\u001b[${31}m${`OLD`}\u001b[${39}m`} ${`\u001b[${33}m${`opts.ignore`}\u001b[${39}m`} = ${JSON.stringify(
      //     opts.ignore,
      //     null,
      //     0
      //   )}`
      // );
      opts.ignore = (opts.ignore as any[]).filter((val) => {
        if (typeof val === "string" && val.length) {
          if (
            ["nunjucks", "jinja", "liquid"].includes(val.trim().toLowerCase())
          ) {
            temp = temp.concat(headsAndTailsJinja);
          } else if (["hugo"].includes(val.trim().toLowerCase())) {
            temp = temp.concat(headsAndTailsHugo);
          } else if (["hexo"].includes(val.trim().toLowerCase())) {
            temp = temp.concat(headsAndTailsHexo);
          }
          return false;
        }
        if (typeof val === "object") {
          return true;
        }
        // otherwise false is returned, value is excluded
      });
      if (temp.length) {
        opts.ignore = (opts.ignore as any[]).concat(temp);
      }
    }
  }

  let ceil;

  if (opts.reportProgressFunc) {
    // ceil is the top the range [0, 100], or whatever it was customised to,
    // [opts.reportProgressFuncFrom, opts.reportProgressFuncTo].
    // Also, leavePercForLastStage needs to be left to next stage, so "100" or
    // "opts.reportProgressFuncTo" is multiplied by (1 - leavePercForLastStage).
    ceil = Math.floor(
      opts.reportProgressFuncTo -
        (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) *
          leavePercForLastStage -
        opts.reportProgressFuncFrom
    );
    console.log(
      `188 ${`\u001b[${33}m${`ceil`}\u001b[${39}m`} = ${JSON.stringify(
        ceil,
        null,
        4
      )}`
    );
  }

  function push(finalStart: number, finalEnd: number): void {
    let finalWhatToInsert = rawnbsp;
    // calculate what to insert
    if (opts.removeWidowPreventionMeasures) {
      finalWhatToInsert = " ";
    } else if (opts.convertEntities) {
      finalWhatToInsert = encodedNbspHtml;
      if (typeof opts.targetLanguage === "string") {
        if (opts.targetLanguage.trim().toLowerCase() === "css") {
          finalWhatToInsert = encodedNbspCss;
        } else if (opts.targetLanguage.trim().toLowerCase() === "js") {
          finalWhatToInsert = encodedNbspJs;
        }
      }
    }
    if (str.slice(finalStart, finalEnd) !== finalWhatToInsert) {
      rangesArr.push(finalStart, finalEnd, finalWhatToInsert);
      console.log(
        `214 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${finalStart}, ${finalEnd}, "${finalWhatToInsert}"]`
      );
    }
  }

  function resetAll() {
    wordCount = 0;
    charCount = 0;
    secondToLastWhitespaceStartedAt = undefined;
    secondToLastWhitespaceEndedAt = undefined;
    lastWhitespaceStartedAt = undefined;
    lastWhitespaceEndedAt = undefined;
    lastEncodedNbspStartedAt = undefined;
    lastEncodedNbspEndedAt = undefined;
    // lineBreakCount = undefined;
  }

  resetAll();

  console.log(
    `234 ${`\u001b[${32}m${`USING`}\u001b[${39}m`} ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // iterate the string
  for (let i = 0; i <= len; i++) {
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
    console.log(
      `\n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim() ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

    // detect templating language heads and tails
    if (!doNothingUntil && isArr(opts.ignore) && opts.ignore.length) {
      (opts.ignore as HeadsAndTailsObj[]).some((valObj, y) => {
        if (
          (isArr(valObj.heads) &&
            valObj.heads.some((oneOfHeads) => str.startsWith(oneOfHeads, i))) ||
          (typeof valObj.heads === "string" && str.startsWith(valObj.heads, i))
        ) {
          console.log(
            `270 ${`\u001b[${31}m${`heads detected!`}\u001b[${39}m`}`
          );
          wordCount += 1;
          doNothingUntil = (opts.ignore[y] as Obj).tails;
          console.log(
            `275 ${`\u001b[${90}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`
          );
          return true;
        }
      });
    }

    // if there was word count bump request issued in the past for current
    // index, do bump it:
    if (!doNothingUntil && bumpWordCountAt && bumpWordCountAt === i) {
      console.log(
        `286 FIY, ${`\u001b[${33}m${`bumpWordCountAt`}\u001b[${39}m`} = ${JSON.stringify(
          bumpWordCountAt,
          null,
          4
        )}`
      );

      wordCount += 1;
      bumpWordCountAt = undefined;
      console.log(
        `296 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wordCount`}\u001b[${39}m`} = ${wordCount}; ${`\u001b[${33}m${`bumpWordCountAt`}\u001b[${39}m`} = ${bumpWordCountAt}`
      );
    }

    // Report the progress. Used in web worker setups.
    if (typeof opts.reportProgressFunc === "function") {
      // defaults:
      // opts.reportProgressFuncFrom = 0
      // opts.reportProgressFuncTo = 100

      currentPercentageDone =
        opts.reportProgressFuncFrom + Math.floor((i / len) * (ceil || 1));
      // console.log(
      //   `309 ${`\u001b[${33}m${`currentPercentageDone`}\u001b[${39}m`} = ${currentPercentageDone}; ${`\u001b[${33}m${`lastPercentage`}\u001b[${39}m`} = ${lastPercentage};`
      // );

      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        opts.reportProgressFunc(currentPercentageDone);
      }
    }

    // catch the end of whitespace (must be at the top)
    if (
      !doNothingUntil &&
      i &&
      str[i] &&
      str[i].trim() &&
      (!str[i - 1] || (str[i - 1] && !str[i - 1].trim()))
    ) {
      // 1. mark the ending
      lastWhitespaceEndedAt = i;
      console.log(
        `329 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastWhitespaceEndedAt`}\u001b[${39}m`} = ${lastWhitespaceEndedAt}`
      );
    }

    if (!doNothingUntil && str[i] && str[i].trim()) {
      charCount += 1;
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

    // catch dashes
    if (
      !doNothingUntil &&
      opts.hyphens &&
      (`-${rawMdash}${rawNdash}`.includes(str[i]) ||
        str.startsWith(encodedNdashHtml, i) ||
        str.startsWith(encodedNdashCss, i) ||
        str.startsWith(encodedNdashJs, i) ||
        str.startsWith(encodedMdashHtml, i) ||
        str.startsWith(encodedMdashCss, i) ||
        str.startsWith(encodedMdashJs, i)) &&
      str[i + 1] &&
      (!str[i + 1].trim() || str[i] === "&")
    ) {
      console.log(`369 dash starts here`);
      if (str[i - 1] && !str[i - 1].trim() && str[left(str, i) as number]) {
        push((left(str, i) as number) + 1, i);
        console.log(`372 push [${(left(str, i) as number) + 1}, ${i}]`);

        // report what was done:
        whatWasDone.removeWidows = true;
        console.log(
          `377 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whatWasDone.removeWidows`}\u001b[${39}m`} = true`
        );
      }
    }

    // catch the HTML-encoded (named or numeric) nbsp's:
    if (
      !doNothingUntil &&
      (str.startsWith("&nbsp;", i) || str.startsWith("&#160;", i))
    ) {
      console.log(`387 HTML-encoded NBSP caught!`);
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6;
      console.log(
        `391 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastEncodedNbspStartedAt`}\u001b[${39}m`} = ${lastEncodedNbspStartedAt}; ${`\u001b[${33}m${`lastEncodedNbspEndedAt`}\u001b[${39}m`} = ${lastEncodedNbspEndedAt}`
      );

      // since there was no whitespace, word counting needs to ba taken care of
      // separately, but the index-bumping must happen in future, at correct time
      if (str[i + 6] && str[i + 6].trim()) {
        bumpWordCountAt = i + 6;
        console.log(
          `399 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`bumpWordCountAt`}\u001b[${39}m`} = ${JSON.stringify(
            bumpWordCountAt,
            null,
            4
          )}`
        );
      }

      // if it opts.convertEntities is off, replace it right away
      if (!opts.convertEntities) {
        rangesArr.push(i, i + 6, rawnbsp);
        console.log(
          `411 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${
            i + 6
          }, "${rawnbsp}"]`
        );

        whatWasDone.convertEntities = true;
        console.log(
          `418 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whatWasDone.convertEntities`}\u001b[${39}m`} = true`
        );
      } else if (
        opts.targetLanguage === "css" ||
        opts.targetLanguage === "js"
      ) {
        rangesArr.push(
          i,
          i + 6,
          opts.targetLanguage === "css" ? encodedNbspCss : encodedNbspJs
        );
        console.log(
          `430 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i + 6}, "${
            opts.targetLanguage === "css" ? encodedNbspCss : encodedNbspJs
          }"]`
        );

        whatWasDone.convertEntities = true;
        console.log(
          `437 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whatWasDone.convertEntities`}\u001b[${39}m`} = true`
        );
      }
    }

    // catch the CSS-encoded (\00A0) nbsp's:
    if (
      !doNothingUntil &&
      str[i + 4] &&
      str[i] === "\\" &&
      str[i + 1] === "0" &&
      str[i + 2] === "0" &&
      str[i + 3].toUpperCase() === "A" &&
      str[i + 4] === "0"
    ) {
      console.log(`452 CSS-encoded NBSP caught!`);
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 5;
      console.log(
        `456 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastEncodedNbspStartedAt`}\u001b[${39}m`} = ${lastEncodedNbspStartedAt}; ${`\u001b[${33}m${`lastEncodedNbspEndedAt`}\u001b[${39}m`} = ${lastEncodedNbspEndedAt}`
      );

      // since there was no whitespace, word counting needs to ba taken care of
      // separately, but the index-bumping must happen in future, at correct time
      if (str[i + 5] && str[i + 5].trim()) {
        bumpWordCountAt = i + 5;
        console.log(
          `464 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`bumpWordCountAt`}\u001b[${39}m`} = ${JSON.stringify(
            bumpWordCountAt,
            null,
            4
          )}`
        );
      }

      // if it opts.convertEntities is off, replace it right away
      if (!opts.convertEntities) {
        rangesArr.push(i, i + 5, rawnbsp);
        console.log(
          `476 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${
            i + 5
          }, "${rawnbsp}"]`
        );

        whatWasDone.convertEntities = true;
        console.log(
          `483 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whatWasDone.convertEntities`}\u001b[${39}m`} = true`
        );
      } else if (
        opts.targetLanguage === "html" ||
        opts.targetLanguage === "js"
      ) {
        rangesArr.push(
          i,
          i + 5,
          opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspJs
        );
        console.log(
          `495 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i + 5}, "${
            opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspJs
          }"]`
        );

        whatWasDone.convertEntities = true;
        console.log(
          `502 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whatWasDone.convertEntities`}\u001b[${39}m`} = true`
        );
      }
    }

    // catch the JS-encoded (\u00A0) nbsp's:
    if (
      !doNothingUntil &&
      str[i] === "\\" &&
      str[i + 1] &&
      str[i + 1].toLowerCase() === "u" &&
      str[i + 2] === "0" &&
      str[i + 3] === "0" &&
      str[i + 4] &&
      str[i + 4].toUpperCase() === "A" &&
      str[i + 5] === "0"
    ) {
      console.log(`519 JS-encoded NBSP caught!`);
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6;
      console.log(
        `523 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastEncodedNbspStartedAt`}\u001b[${39}m`} = ${lastEncodedNbspStartedAt}; ${`\u001b[${33}m${`lastEncodedNbspEndedAt`}\u001b[${39}m`} = ${lastEncodedNbspEndedAt}`
      );

      // since there was no whitespace, word counting needs to ba taken care of
      // separately, but the index-bumping must happen in future, at correct time
      if (str[i + 6] && str[i + 6].trim()) {
        bumpWordCountAt = i + 6;
        console.log(
          `531 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`bumpWordCountAt`}\u001b[${39}m`} = ${JSON.stringify(
            bumpWordCountAt,
            null,
            4
          )}`
        );
      }

      // if it opts.convertEntities is off, replace it right away
      if (!opts.convertEntities) {
        rangesArr.push(i, i + 6, rawnbsp);
        console.log(
          `543 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${
            i + 6
          }, "${rawnbsp}"]`
        );
      } else if (
        opts.targetLanguage === "html" ||
        opts.targetLanguage === "css"
      ) {
        rangesArr.push(
          i,
          i + 6,
          opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspCss
        );
        console.log(
          `557 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i + 6}, "${
            opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspCss
          }"]`
        );
      }
    }

    // catch raw nbsp's:
    if (!doNothingUntil && str[i] === rawnbsp) {
      console.log(`566 raw unencoded NBSP caught!`);
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 1;
      console.log(
        `570 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastEncodedNbspStartedAt`}\u001b[${39}m`} = ${lastEncodedNbspStartedAt}; ${`\u001b[${33}m${`lastEncodedNbspEndedAt`}\u001b[${39}m`} = ${lastEncodedNbspEndedAt}`
      );

      // if it opts.convertEntities is off, replace it right away
      if (opts.convertEntities) {
        rangesArr.push(
          i,
          i + 1,
          opts.targetLanguage === "css"
            ? encodedNbspCss
            : opts.targetLanguage === "js"
            ? encodedNbspJs
            : encodedNbspHtml
        );
        console.log(
          `585 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i + 1}, "${
            opts.targetLanguage === "css"
              ? encodedNbspCss
              : opts.targetLanguage === "js"
              ? encodedNbspJs
              : encodedNbspHtml
          }"]`
        );
      }
    }

    // catch the first letter of the first word
    if (
      !doNothingUntil &&
      str[i] &&
      str[i].trim() &&
      (!str[i - 1] || !str[i - 1].trim())
    ) {
      // 1. bump the word counter
      wordCount += 1;
      console.log(
        `606 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wordCount`}\u001b[${39}m`} = ${wordCount}`
      );
    }

    // catch the ending of paragraphs or the EOL - here's where the action happens
    if (
      !doNothingUntil &&
      (!str[i] ||
        `\r\n`.includes(str[i]) ||
        ((str[i] === "\n" ||
          str[i] === "\r" ||
          (str[i] === "\r" && str[i + 1] === "\n")) &&
          left(str, i) &&
          punctuationCharsToConsiderWidowIssue.includes(
            str[left(str, i) as number]
          )))
    ) {
      console.log(
        `622 ${`\u001b[${32}m${`██`}\u001b[${39}m`} PARAGRAPH ENDING!`
      );

      if (
        (!opts.minWordCount || wordCount >= opts.minWordCount) &&
        (!opts.minCharCount || charCount >= opts.minCharCount)
      ) {
        console.log(
          `630 ${`\u001b[${32}m${`passed min length requirements`}\u001b[${39}m`}`
        );
        let finalStart;
        let finalEnd;

        // calculate start and end values
        if (
          lastWhitespaceStartedAt !== undefined &&
          lastWhitespaceEndedAt !== undefined &&
          lastEncodedNbspStartedAt !== undefined &&
          lastEncodedNbspEndedAt !== undefined
        ) {
          console.log(`642`);
          if (lastWhitespaceStartedAt > lastEncodedNbspStartedAt) {
            finalStart = lastWhitespaceStartedAt;
            finalEnd = lastWhitespaceEndedAt;
          } else {
            finalStart = lastEncodedNbspStartedAt;
            finalEnd = lastEncodedNbspEndedAt;
          }
        } else if (
          lastWhitespaceStartedAt !== undefined &&
          lastWhitespaceEndedAt !== undefined
        ) {
          console.log(`654`);
          finalStart = lastWhitespaceStartedAt;
          finalEnd = lastWhitespaceEndedAt;
        } else if (
          lastEncodedNbspStartedAt !== undefined &&
          lastEncodedNbspEndedAt !== undefined
        ) {
          console.log(`661`);
          finalStart = lastEncodedNbspStartedAt;
          finalEnd = lastEncodedNbspEndedAt;
        }

        // if by now the point to insert non-breaking space was not found,
        // give last chance to secondToLastWhitespaceStartedAt and
        // secondToLastWhitespaceEndedAt:
        if (
          !(finalStart && finalEnd) &&
          secondToLastWhitespaceStartedAt &&
          secondToLastWhitespaceEndedAt
        ) {
          console.log(`674`);
          finalStart = secondToLastWhitespaceStartedAt;
          finalEnd = secondToLastWhitespaceEndedAt;
        }

        console.log(`679 finalStart = ${finalStart}; finalEnd = ${finalEnd}`);

        if (finalStart && finalEnd) {
          push(finalStart, finalEnd);

          whatWasDone.removeWidows = true;
          console.log(
            `686 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whatWasDone.removeWidows`}\u001b[${39}m`} = true`
          );
        }
      }

      resetAll();
      console.log(`692 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
    }

    // catch postcodes
    // postcodeRegexFront, postcodeRegexEnd
    if (
      opts.UKPostcodes &&
      str[i] &&
      !str[i].trim() &&
      str[i - 1] &&
      str[i - 1].trim() &&
      postcodeRegexFront.test(str.slice(0, i)) &&
      str[right(str, i) as number] &&
      postcodeRegexEnd.test(str.slice(right(str, i) as number))
    ) {
      console.log(`707 POSTCODE caught: [${i}, ${right(str, i)}]`);
      push(i, right(str, i) as number);

      whatWasDone.removeWidows = true;
      console.log(
        `712 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whatWasDone.removeWidows`}\u001b[${39}m`} = true`
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

    // catch the start of whitespace (must be at the bottom)
    //
    // either it's first whitespace character ever met, or we're overwriting an
    // old whitespace record and it's the first character of new whitespace chunk
    if (
      !doNothingUntil &&
      str[i] &&
      !str[i].trim() &&
      str[i - 1] &&
      str[i - 1].trim() &&
      (lastWhitespaceStartedAt === undefined ||
        (str[lastWhitespaceStartedAt - 1] &&
          str[lastWhitespaceStartedAt - 1].trim())) &&
      !"/>".includes(str[right(str, i) as number]) &&
      !str.slice(0, i).trim().endsWith("br") &&
      !str.slice(0, i).trim().endsWith("hr") &&
      !(
        str.slice(0, i).endsWith("<") &&
        knownHTMLTags.some((tag) =>
          str.startsWith(tag, right(str, i) as number)
        )
      )
    ) {
      console.log(`756`);
      // 1. current value becomes second-to-last
      secondToLastWhitespaceStartedAt = lastWhitespaceStartedAt;
      secondToLastWhitespaceEndedAt = lastWhitespaceEndedAt;

      // 2. mark new-one
      lastWhitespaceStartedAt = i;

      // 2. wipe the ending of new-one
      lastWhitespaceEndedAt = undefined;

      console.log(
        `768 ${`\u001b[${32}m${`SET 2`}\u001b[${39}m`} ${`\u001b[${33}m${`secondToLastWhitespaceStartedAt`}\u001b[${39}m`} = ${secondToLastWhitespaceStartedAt};${" ".repeat(
          String(secondToLastWhitespaceStartedAt).length <
            String(lastWhitespaceStartedAt).length
            ? Math.max(
                String(secondToLastWhitespaceStartedAt).length,
                String(lastWhitespaceStartedAt).length
              ) -
                Math.min(
                  String(secondToLastWhitespaceStartedAt).length,
                  String(lastWhitespaceStartedAt).length
                )
            : 0
        )} ${`\u001b[${33}m${`secondToLastWhitespaceEndedAt`}\u001b[${39}m`} = ${secondToLastWhitespaceEndedAt};`
      );
      console.log(
        `783 ${`\u001b[${32}m${`SET 2`}\u001b[${39}m`} ${`\u001b[${33}m${`lastWhitespaceStartedAt`}\u001b[${39}m`}         = ${lastWhitespaceStartedAt};${" ".repeat(
          String(secondToLastWhitespaceStartedAt).length >
            String(lastWhitespaceStartedAt).length
            ? Math.max(
                String(secondToLastWhitespaceStartedAt).length,
                String(lastWhitespaceStartedAt).length
              ) -
                Math.min(
                  String(secondToLastWhitespaceStartedAt).length,
                  String(lastWhitespaceStartedAt).length
                )
            : 0
        )} ${`\u001b[${33}m${`lastWhitespaceEndedAt`}\u001b[${39}m`}         = ${lastWhitespaceEndedAt};`
      );

      // 3. wipe the records of the last nbsp because they are not relevant
      if (
        lastEncodedNbspStartedAt !== undefined ||
        lastEncodedNbspEndedAt !== undefined
      ) {
        lastEncodedNbspStartedAt = undefined;
        lastEncodedNbspEndedAt = undefined;
        console.log(
          `806 ${`\u001b[${90}m${`RESET`}\u001b[${39}m`} lastEncodedNbspStartedAt, lastEncodedNbspEndedAt`
        );
      }
    }

    // look for templating tails
    let tempTailFinding;
    if (doNothingUntil) {
      if (
        typeof doNothingUntil === "string" &&
        (!doNothingUntil.length || str.startsWith(doNothingUntil, i))
      ) {
        doNothingUntil = undefined;
      } else if (
        isArr(doNothingUntil) &&
        (!(doNothingUntil as any[]).length ||
          (doNothingUntil as any[]).some((val) => {
            if (str.startsWith(val, i)) {
              tempTailFinding = val;
              return true;
            }
          }))
      ) {
        doNothingUntil = undefined;
        console.log(
          `831 RESET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`}`
        );
        console.log(
          `834 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} i: ${`\u001b[${33}m${i}\u001b[${39}m`}=>${`\u001b[${33}m${
            i + (tempTailFinding as any).length
          }\u001b[${39}m`}`
        );

        i += (tempTailFinding as any).length;

        // imagine we caught "{% endif" of the following string:
        // {% if something %} some text and more text {% endif %}
        // we need to tackle the "%}" that follows.
        console.log(
          `845 \u001b[${32}m${`██`}\u001b[${39}m we're at i=${i}, to the right is: ${str.slice(
            i
          )}`
        );
        if (isArr(opts.ignore) && opts.ignore.length && str[i + 1]) {
          (opts.ignore as HeadsAndTailsObj[]).some((oneOfHeadsTailsObjs) => {
            // console.log("\n\n\n");
            // console.log(
            //   `857 ${`\u001b[${36}m${`███████████████████████████████████████`}\u001b[${39}m`}\n\n\n`
            // );
            // console.log(
            //   `860 PROCESSING ${`\u001b[${33}m${`oneOfHeadsTailsObjs`}\u001b[${39}m`} = ${JSON.stringify(
            //     oneOfHeadsTailsObjs,
            //     null,
            //     4
            //   )}`
            // );
            return matchRightIncl(str, i, oneOfHeadsTailsObjs.tails, {
              trimBeforeMatching: true,
              cb: (_char, _theRemainderOfTheString, index) => {
                if (index) {
                  console.log(`866 RECEIVED by CB() index = ${index}`);
                  i = index - 1;
                  console.log(
                    `869 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} i = ${i - 1}`
                  );
                  if (str[i + 1] && str[i + 1].trim()) {
                    wordCount += 1;
                    console.log(
                      `874 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} wordCount now = ${wordCount}`
                    );
                  }
                }
                return true;
              },
            });
          });
        }
      }
    }

    // if it's a CR or LF, reset the word/letter counts
    if (str[i] && `\r\n`.includes(str[i])) {
      wordCount = 0;
      charCount = 0;
      console.log(
        `891 RESET wordCount = ${wordCount}; charCount = ${charCount}`
      );
    }

    // skip known tag ranges
    if (
      isArr(opts.tagRanges) &&
      opts.tagRanges.length &&
      opts.tagRanges.some((rangeArr) => {
        console.log(`900`);
        if (i >= rangeArr[0] && i <= rangeArr[1] && rangeArr[1] - 1 > i) {
          i = rangeArr[1] - 1;
          console.log(`903 SET i = ${i}; then CONTINUE`);
          return true;
        }
      })
    ) {
      console.log(`908`);
      // continue;
    }

    // logging after each loop's iteration:
    // ███████████████████████████████████████
    console.log(
      `    \u001b[${90}m${`██ ██ ██ ██ ██ END ██ ██ ██ ██ ██`}\u001b[${39}m`
    );
    console.log(
      `${`\u001b[${90}m${`231 second-to-last whitespace: [${secondToLastWhitespaceStartedAt}, ${secondToLastWhitespaceEndedAt}]`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`231 last whitespace: [${lastWhitespaceStartedAt}, ${lastWhitespaceEndedAt}]`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`234 last encoded nbsp: [${lastEncodedNbspStartedAt}, ${lastEncodedNbspEndedAt}]`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`237 word count ${wordCount}; char count ${charCount}`}\u001b[${39}m`}${
        bumpWordCountAt
          ? `${`\u001b[${90}m${`;`}\u001b[${39}m`}${`\u001b[${90}m${` bumpWordCountAt = ${bumpWordCountAt}`}\u001b[${39}m`}`
          : ""
      }`
    );
    console.log(
      `${`\u001b[${90}m${`516 rangesArr: ${JSON.stringify(
        rangesArr.current(),
        null,
        0
      )}`}\u001b[${39}m`}${
        doNothingUntil
          ? `\n${`\u001b[${31}m${`doNothingUntil = ${JSON.stringify(
              doNothingUntil,
              null,
              0
            )}`}\u001b[${39}m`}`
          : ""
      }`
    );

    //
    //
    //
    // end of the loop
  }

  console.log(
    `956 string-remove-widows: ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}:`
  );
  rApply(str, rangesArr.current())
    .split("")
    .forEach((key, i) => {
      console.log(
        `962 ${`\u001b[${33}m${`#${i}`}\u001b[${39}m`}: ${key} - ${key.charCodeAt(
          0
        )}`
      );
    });

  return {
    res: rApply(
      str,
      rangesArr.current(),
      opts.reportProgressFunc
        ? (incomingPerc) => {
            currentPercentageDone = Math.floor(
              (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) *
                (1 - leavePercForLastStage) +
                (incomingPerc / 100) *
                  (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) *
                  leavePercForLastStage
            );
            console.log(
              `982 ${`\u001b[${33}m${`currentPercentageDone`}\u001b[${39}m`} = ${JSON.stringify(
                currentPercentageDone,
                null,
                4
              )}`
            );
            if (currentPercentageDone !== lastPercentage) {
              lastPercentage = currentPercentageDone;
              (opts as Obj).reportProgressFunc(currentPercentageDone);
            }
          }
        : undefined
    ),
    ranges: rangesArr.current(),
    log: {
      timeTakenInMilliseconds: Date.now() - start,
    },
    whatWasDone,
  };
}

// main export
export { removeWidows, defaults, version };
