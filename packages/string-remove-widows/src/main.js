import { version } from "../package.json";
import apply from "ranges-apply";
import {
  rawnbsp,
  encodedNbspHtml,
  encodedNbspCss,
  encodedNbspJs
  // rawNdash,
  // encodedNdashHtml,
  // encodedNdashCss,
  // encodedNdashJs,
  // rawMdash,
  // encodedMdashHtml,
  // encodedMdashCss,
  // encodedMdashJs
} from "./util";
import isObj from "lodash.isplainobject";

const defaultOpts = {
  removeWidowPreventionMeasures: false,
  killSwitch: false, // if on, output is not processed but all logging still given - used in modern apps which report what could have been done even when function is off
  convertEntities: false, // to encode or not to encode?
  language: "html", // encode in what? [html, css, js]
  hyphens: true, // replace space with non-breaking space in front of dash
  minWordCount: 4, // if there are less words than this in chunk, skip
  minCharLen: 50, // if there are less characters than this in chunk, skip
  reportProgressFunc: null // reporting progress function
};

function removeWidows(str, originalOpts) {
  function isStr(something) {
    return typeof something === "string";
  }
  // track time taken
  const start = Date.now();

  // insurance:
  if (!isStr(str)) {
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

  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `string-remove-widows: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }

  // vars
  const len = str.length;
  const midLen = Math.floor(len / 2);
  const ranges = [];

  let currentPercentageDone;
  let lastPercentage = 0;
  let wordCount; // counted per-chunk (paragraph)
  let lastWhitespaceStartedAt;
  let lastWhitespaceEndedAt;
  let lastEncodedNbspStartedAt;
  let lastEncodedNbspEndedAt;
  // let lineBreakCount;

  // requests to bump word count in the future:
  let bumpWordCountAt;

  // prep the opts
  const opts = Object.assign({}, defaultOpts, originalOpts);

  function resetAll() {
    wordCount = 0;
    lastWhitespaceStartedAt = undefined;
    lastWhitespaceEndedAt = undefined;
    lastEncodedNbspStartedAt = undefined;
    lastEncodedNbspEndedAt = undefined;
    // lineBreakCount = undefined;
  }

  resetAll();

  // iterate the string
  for (let i = 0, len = str.length; i < len; i++) {
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
        str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

    // if there was word count bump request issued in the past for current
    // index, do bump it:
    if (bumpWordCountAt && bumpWordCountAt === i) {
      wordCount++;
      bumpWordCountAt = undefined;
      console.log(
        `121 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wordCount`}\u001b[${39}m`} = ${wordCount}; ${`\u001b[${33}m${`bumpWordCountAt`}\u001b[${39}m`} = ${bumpWordCountAt}`
      );
    }

    // Report the progress. Used in web worker setups.
    if (typeof opts.reportProgressFunc === "function") {
      if (len > 1000 && len < 2000) {
        if (i === midLen) {
          opts.reportProgressFunc(
            Math.floor(
              (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2
            )
          );
        }
      } else if (len >= 2000) {
        // defaults:
        // opts.reportProgressFuncFrom = 0
        // opts.reportProgressFuncTo = 100

        currentPercentageDone =
          opts.reportProgressFuncFrom + Math.floor(i / len);

        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
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
    //             MIDDLE
    //
    //
    //
    //
    //
    //
    //
    //

    // catch the HTML-encoded (named or numeric) nbsp's:
    if (
      (str[i] === "&" &&
        str[i + 1] === "n" &&
        str[i + 2] === "b" &&
        str[i + 3] === "s" &&
        str[i + 4] === "p" &&
        str[i + 5] === ";") ||
      (str[i] === "&" &&
        str[i + 1] === "#" &&
        str[i + 2] === "1" &&
        str[i + 3] === "6" &&
        str[i + 4] === "0" &&
        str[i + 5] === ";")
    ) {
      console.log(`183 HTML-encoded NBSP caught!`);
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6;
      console.log(
        `187 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastEncodedNbspStartedAt`}\u001b[${39}m`} = ${lastEncodedNbspStartedAt}; ${`\u001b[${33}m${`lastEncodedNbspEndedAt`}\u001b[${39}m`} = ${lastEncodedNbspEndedAt}`
      );

      // since there was no whitespace, word counting needs to ba taken care of
      // separately, but the index-bumping must happen in future, at correct time
      if (str[i + 6] && str[i + 6].trim().length) {
        bumpWordCountAt = i + 6;
      }
    }

    // catch the CSS-encoded (\00A0) nbsp's:
    if (
      str[i] === "\\" &&
      str[i + 1] === "0" &&
      str[i + 2] === "0" &&
      str[i + 3] &&
      str[i + 3].toUpperCase() === "A" &&
      str[i + 4] === "0"
    ) {
      console.log(`206 CSS-encoded NBSP caught!`);
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 5;
      console.log(
        `210 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastEncodedNbspStartedAt`}\u001b[${39}m`} = ${lastEncodedNbspStartedAt}; ${`\u001b[${33}m${`lastEncodedNbspEndedAt`}\u001b[${39}m`} = ${lastEncodedNbspEndedAt}`
      );

      // since there was no whitespace, word counting needs to ba taken care of
      // separately, but the index-bumping must happen in future, at correct time
      if (str[i + 5] && str[i + 5].trim().length) {
        bumpWordCountAt = i + 5;
      }
    }

    // catch the JS-encoded (\u00A0) nbsp's:
    if (
      str[i] === "\\" &&
      str[i + 1] &&
      str[i + 1].toLowerCase() === "u" &&
      str[i + 2] === "0" &&
      str[i + 3] === "0" &&
      str[i + 4] &&
      str[i + 4].toUpperCase() === "A" &&
      str[i + 5] === "0"
    ) {
      console.log(`231 JS-encoded NBSP caught!`);
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6;
      console.log(
        `235 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastEncodedNbspStartedAt`}\u001b[${39}m`} = ${lastEncodedNbspStartedAt}; ${`\u001b[${33}m${`lastEncodedNbspEndedAt`}\u001b[${39}m`} = ${lastEncodedNbspEndedAt}`
      );

      // since there was no whitespace, word counting needs to ba taken care of
      // separately, but the index-bumping must happen in future, at correct time
      if (str[i + 6] && str[i + 6].trim().length) {
        bumpWordCountAt = i + 6;
      }
    }

    // catch raw nbsp's:
    if (str[i] === rawnbsp) {
      console.log(`247 raw unencoded NBSP caught!`);
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 1;
      console.log(
        `251 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastEncodedNbspStartedAt`}\u001b[${39}m`} = ${lastEncodedNbspStartedAt}; ${`\u001b[${33}m${`lastEncodedNbspEndedAt`}\u001b[${39}m`} = ${lastEncodedNbspEndedAt}`
      );

      // since there was no whitespace, word counting needs to ba taken care of
      // separately, but the index-bumping must happen in future, at correct time
      if (str[i + 2] && str[i + 2].trim().length) {
        bumpWordCountAt = i + 2;
      }
    }

    // catch the first letter of the first word
    if (str[i].trim().length && (!str[i - 1] || !str[i - 1].trim().length)) {
      // 1. bump the word counter
      wordCount++;
      console.log(
        `266 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wordCount`}\u001b[${39}m`} = ${wordCount}`
      );
    }

    // catch the end of whitespace
    if (
      i &&
      str[i].trim().length &&
      (!str[i - 1] || (str[i - 1] && !str[i - 1].trim().length))
    ) {
      // 1. mark the ending
      lastWhitespaceEndedAt = i;
      console.log(
        `279 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastWhitespaceEndedAt`}\u001b[${39}m`} = ${lastWhitespaceEndedAt}`
      );
    }

    // catch the start of whitespace
    //
    // either it's first whitespace character ever met, or we're overwriting an
    // old whitespace record and it's the first character of new whitespace chunk
    if (
      !str[i].trim().length &&
      str[i - 1] &&
      str[i - 1].trim().length &&
      (lastWhitespaceStartedAt === undefined ||
        (str[lastWhitespaceStartedAt - 1] &&
          str[lastWhitespaceStartedAt - 1].trim().length))
    ) {
      // 1. mark it
      lastWhitespaceStartedAt = i;

      // 2. wipe the ending
      lastWhitespaceEndedAt = undefined;

      console.log(
        `302 ${`\u001b[${32}m${`SET 2`}\u001b[${39}m`} ${`\u001b[${33}m${`lastWhitespaceStartedAt`}\u001b[${39}m`} = ${lastWhitespaceStartedAt}; ${`\u001b[${33}m${`lastWhitespaceEndedAt`}\u001b[${39}m`} = ${lastWhitespaceEndedAt}`
      );
    }

    // catch the ending of paragraphs or the EOL - here's where the action happens
    if (!str[i + 1]) {
      let finalStart;
      let finalEnd;
      let finalWhatToInsert = rawnbsp;

      // calculate start and end values
      if (
        lastWhitespaceStartedAt !== undefined &&
        lastWhitespaceEndedAt !== undefined &&
        lastEncodedNbspStartedAt !== undefined &&
        lastEncodedNbspEndedAt !== undefined
      ) {
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
        finalStart = lastWhitespaceStartedAt;
        finalEnd = lastWhitespaceEndedAt;
      } else if (
        lastEncodedNbspStartedAt !== undefined &&
        lastEncodedNbspEndedAt !== undefined
      ) {
        finalStart = lastEncodedNbspStartedAt;
        finalEnd = lastEncodedNbspEndedAt;
      }

      // calculate what to insert

      if (opts.removeWidowPreventionMeasures) {
        finalWhatToInsert = " ";
      } else if (opts.convertEntities) {
        finalWhatToInsert = encodedNbspHtml;
        if (isStr(opts.language)) {
          if (opts.language.trim().toLowerCase() === "css") {
            finalWhatToInsert = encodedNbspCss;
          } else if (opts.language.trim().toLowerCase() === "js") {
            finalWhatToInsert = encodedNbspJs;
          }
        }
      }

      if (finalStart && finalEnd) {
        ranges.push([finalStart, finalEnd, finalWhatToInsert]);
        console.log(
          `358 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${lastWhitespaceStartedAt}, ${lastWhitespaceEndedAt}, "${finalWhatToInsert}"]`
        );
      }

      resetAll();
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

    // logging after each loop's iteration:
    // ███████████████████████████████████████
    console.log(
      `    \u001b[${90}m${`██ ██ ██ ██ ██ END ██ ██ ██ ██ ██`}\u001b[${39}m`
    );
    console.log(
      `${`\u001b[${90}m${`231 last whitespace: [${lastWhitespaceStartedAt}, ${lastWhitespaceEndedAt}]`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`234 last encoded nbsp: [${lastEncodedNbspStartedAt}, ${lastEncodedNbspEndedAt}]`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`237 word count ${wordCount}`}\u001b[${39}m`}${
        bumpWordCountAt
          ? `${`\u001b[${90}m${`;`}\u001b[${39}m`}${`\u001b[${90}m${` bumpWordCountAt = ${bumpWordCountAt}`}\u001b[${39}m`}`
          : ""
      }`
    );
    console.log(
      `${`\u001b[${90}m${`1 ranges: ${JSON.stringify(
        ranges,
        null,
        0
      )}`}\u001b[${39}m`}`
    );

    //
    //
    //
    // end of the loop
  }

  return {
    res: apply(str, ranges),
    ranges,
    log: {
      timeTakenInMiliseconds: Date.now() - start
    }
  };
}

// main export
export { removeWidows, defaultOpts, version };
