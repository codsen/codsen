/**
 * string-remove-widows
 * Helps to prevent widow words in a text
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-widows
 */

import apply from 'ranges-apply';
import { left, right } from 'string-left-right';
import { matchRightIncl } from 'string-match-left-right';
import isObj from 'lodash.isplainobject';
import arrayiffyIfStr from 'arrayiffy-if-string';

var version = "1.1.1";

const rawnbsp = "\u00A0";
const encodedNbspHtml = "&nbsp;";
const encodedNbspCss = "\\00A0";
const encodedNbspJs = "\\u00A0";
const rawNdash = "\u2013";
const encodedNdashHtml = "&ndash;";
const encodedNdashCss = "\\2013";
const encodedNdashJs = "\\u2013";
const rawMdash = "\u2014";
const encodedMdashHtml = "&mdash;";
const encodedMdashCss = "\\2014";
const encodedMdashJs = "\\u2014";
const headsAndTailsJinja = [
  {
    heads: "{{",
    tails: "}}"
  },
  {
    heads: ["{% if", "{%- if"],
    tails: ["{% endif", "{%- endif"]
  },
  {
    heads: ["{% for", "{%- for"],
    tails: ["{% endfor", "{%- endfor"]
  },
  {
    heads: ["{%", "{%-"],
    tails: ["%}", "-%}"]
  },
  {
    heads: "{#",
    tails: "#}"
  }
];
const headsAndTailsHugo = [
  {
    heads: "{{",
    tails: "}}"
  }
];
const headsAndTailsHexo = [
  {
    heads: ["<%", "<%=", "<%-"],
    tails: ["%>", "=%>", "-%>"]
  }
];

const Ranges = require("ranges-push");
const defaultOpts = {
  removeWidowPreventionMeasures: false,
  convertEntities: true,
  targetLanguage: "html",
  UKPostcodes: false,
  hyphens: true,
  minWordCount: 4,
  minCharCount: 5,
  ignore: [],
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
function removeWidows(str, originalOpts) {
  function push(finalStart, finalEnd) {
    let finalWhatToInsert = rawnbsp;
    if (opts.removeWidowPreventionMeasures) {
      finalWhatToInsert = " ";
    } else if (opts.convertEntities) {
      finalWhatToInsert = encodedNbspHtml;
      if (isStr(opts.targetLanguage)) {
        if (opts.targetLanguage.trim().toLowerCase() === "css") {
          finalWhatToInsert = encodedNbspCss;
        } else if (opts.targetLanguage.trim().toLowerCase() === "js") {
          finalWhatToInsert = encodedNbspJs;
        }
      }
    }
    rangesArr.push(finalStart, finalEnd, finalWhatToInsert);
    console.log(
      `058 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${finalStart}, ${finalEnd}, "${finalWhatToInsert}"]`
    );
  }
  function isStr(something) {
    return typeof something === "string";
  }
  const start = Date.now();
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
  const isArr = Array.isArray;
  const len = str.length;
  const rangesArr = new Ranges({ mergeType: 2 });
  const punctuationCharsToConsiderWidowIssue = ["."];
  const postcodeRegexFront = /[A-Z]{1,2}[0-9][0-9A-Z]?$/;
  const postcodeRegexEnd = /^[0-9][A-Z]{2}/;
  const leavePercForLastStage = 0.06;
  let currentPercentageDone;
  let lastPercentage = 0;
  let wordCount;
  let charCount;
  let secondToLastWhitespaceStartedAt;
  let secondToLastWhitespaceEndedAt;
  let lastWhitespaceStartedAt;
  let lastWhitespaceEndedAt;
  let lastEncodedNbspStartedAt;
  let lastEncodedNbspEndedAt;
  let doNothingUntil;
  let bumpWordCountAt;
  const opts = Object.assign({}, defaultOpts, originalOpts);
  if (opts.dashes) {
    opts.hyphens = true;
    delete opts.dashes;
  }
  if (!opts.ignore || (!isArr(opts.ignore) && !isStr(opts.ignore))) {
    opts.ignore = [];
  } else {
    opts.ignore = arrayiffyIfStr(opts.ignore);
    if (opts.ignore.some(val => isStr(val))) {
      let temp = [];
      opts.ignore = opts.ignore.filter(val => {
        if (isStr(val) && val.length) {
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
        } else if (typeof val === "object") {
          return true;
        }
      });
      if (temp.length) {
        opts.ignore = opts.ignore.concat(temp);
      }
    }
  }
  let ceil;
  if (opts.reportProgressFunc) {
    ceil = Math.floor(
      opts.reportProgressFuncTo -
        (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) *
          leavePercForLastStage -
        opts.reportProgressFuncFrom
    );
    console.log(
      `185 ${`\u001b[${33}m${`ceil`}\u001b[${39}m`} = ${JSON.stringify(
        ceil,
        null,
        4
      )}`
    );
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
  }
  resetAll();
  console.log(
    `216 ${`\u001b[${32}m${`USING`}\u001b[${39}m`} ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );
  for (let i = 0; i < len; i++) {
    console.log(
      `\n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );
    if (!doNothingUntil && isArr(opts.ignore) && opts.ignore.length) {
      opts.ignore.some((valObj, y) => {
        if (
          (isArr(valObj.heads) &&
            valObj.heads.some(oneOfHeads => str.startsWith(oneOfHeads, i))) ||
          (isStr(valObj.heads) && str.startsWith(valObj.heads, i))
        ) {
          console.log(
            `252 ${`\u001b[${31}m${`heads detected!`}\u001b[${39}m`}`
          );
          wordCount++;
          doNothingUntil = opts.ignore[y].tails;
          console.log(
            `257 ${`\u001b[${90}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`} = ${doNothingUntil}`
          );
          return true;
        }
      });
    }
    if (!doNothingUntil && bumpWordCountAt && bumpWordCountAt === i) {
      wordCount++;
      bumpWordCountAt = undefined;
      console.log(
        `270 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wordCount`}\u001b[${39}m`} = ${wordCount}; ${`\u001b[${33}m${`bumpWordCountAt`}\u001b[${39}m`} = ${bumpWordCountAt}`
      );
    }
    if (typeof opts.reportProgressFunc === "function") {
      currentPercentageDone =
        opts.reportProgressFuncFrom + Math.floor((i / len) * ceil);
      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        opts.reportProgressFunc(currentPercentageDone);
      }
    }
    if (
      !doNothingUntil &&
      i &&
      str[i].trim().length &&
      (!str[i - 1] || (str[i - 1] && !str[i - 1].trim().length))
    ) {
      lastWhitespaceEndedAt = i;
      console.log(
        `302 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastWhitespaceEndedAt`}\u001b[${39}m`} = ${lastWhitespaceEndedAt}`
      );
    }
    if (!doNothingUntil && str[i].trim().length) {
      charCount++;
    }
    if (
      !doNothingUntil &&
      opts.hyphens &&
      (str[i] === "-" ||
        str[i] === rawMdash ||
        str[i] === rawNdash ||
        str.slice(i).startsWith(encodedNdashHtml) ||
        str.slice(i).startsWith(encodedNdashCss) ||
        str.slice(i).startsWith(encodedNdashJs) ||
        str.slice(i).startsWith(encodedMdashHtml) ||
        str.slice(i).startsWith(encodedMdashCss) ||
        str.slice(i).startsWith(encodedMdashJs)) &&
      str[i + 1] &&
      (!str[i + 1].trim().length || str[i] === "&")
    ) {
      console.log(`344 dash starts here`);
      if (str[i - 1] && !str[i - 1].trim().length && str[left(str, i)]) {
        push(left(str, i) + 1, i);
        console.log(`347 push [${left(str, i) + 1}, ${i}]`);
      }
    } else {
      console.log(`350 ELSE didn't catch the dash`);
    }
    if (
      !doNothingUntil &&
      ((str[i] === "&" &&
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
          str[i + 5] === ";"))
    ) {
      console.log(`369 HTML-encoded NBSP caught!`);
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6;
      console.log(
        `373 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastEncodedNbspStartedAt`}\u001b[${39}m`} = ${lastEncodedNbspStartedAt}; ${`\u001b[${33}m${`lastEncodedNbspEndedAt`}\u001b[${39}m`} = ${lastEncodedNbspEndedAt}`
      );
      if (str[i + 6] && str[i + 6].trim().length) {
        bumpWordCountAt = i + 6;
      }
      if (!opts.convertEntities) {
        rangesArr.push(i, i + 6, rawnbsp);
        console.log(
          `386 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i +
            6}, "${rawnbsp}"]`
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
          `399 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i + 6}, "${
            opts.targetLanguage === "css" ? encodedNbspCss : encodedNbspJs
          }"]`
        );
      }
    }
    if (
      !doNothingUntil &&
      str[i] === "\\" &&
      str[i + 1] === "0" &&
      str[i + 2] === "0" &&
      str[i + 3] &&
      str[i + 3].toUpperCase() === "A" &&
      str[i + 4] === "0"
    ) {
      console.log(`416 CSS-encoded NBSP caught!`);
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 5;
      console.log(
        `420 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastEncodedNbspStartedAt`}\u001b[${39}m`} = ${lastEncodedNbspStartedAt}; ${`\u001b[${33}m${`lastEncodedNbspEndedAt`}\u001b[${39}m`} = ${lastEncodedNbspEndedAt}`
      );
      if (str[i + 5] && str[i + 5].trim().length) {
        bumpWordCountAt = i + 5;
      }
      if (!opts.convertEntities) {
        rangesArr.push(i, i + 5, rawnbsp);
        console.log(
          `433 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i +
            5}, "${rawnbsp}"]`
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
          `446 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i + 5}, "${
            opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspJs
          }"]`
        );
      }
    }
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
      console.log(`465 JS-encoded NBSP caught!`);
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6;
      console.log(
        `469 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastEncodedNbspStartedAt`}\u001b[${39}m`} = ${lastEncodedNbspStartedAt}; ${`\u001b[${33}m${`lastEncodedNbspEndedAt`}\u001b[${39}m`} = ${lastEncodedNbspEndedAt}`
      );
      if (str[i + 6] && str[i + 6].trim().length) {
        bumpWordCountAt = i + 6;
      }
      if (!opts.convertEntities) {
        rangesArr.push(i, i + 6, rawnbsp);
        console.log(
          `482 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i +
            6}, "${rawnbsp}"]`
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
          `495 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i + 6}, "${
            opts.targetLanguage === "html" ? encodedNbspHtml : encodedNbspCss
          }"]`
        );
      }
    }
    if (!doNothingUntil && str[i] === rawnbsp) {
      console.log(`504 raw unencoded NBSP caught!`);
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 1;
      console.log(
        `508 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastEncodedNbspStartedAt`}\u001b[${39}m`} = ${lastEncodedNbspStartedAt}; ${`\u001b[${33}m${`lastEncodedNbspEndedAt`}\u001b[${39}m`} = ${lastEncodedNbspEndedAt}`
      );
      if (str[i + 2] && str[i + 2].trim().length) {
        bumpWordCountAt = i + 2;
      }
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
          `529 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${i}, ${i + 1}, "${
            opts.targetLanguage === "css"
              ? encodedNbspCss
              : opts.targetLanguage === "js"
              ? encodedNbspJs
              : encodedNbspHtml
          }"]`
        );
      }
    }
    if (
      !doNothingUntil &&
      str[i].trim().length &&
      (!str[i - 1] || !str[i - 1].trim().length)
    ) {
      wordCount++;
      console.log(
        `549 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`wordCount`}\u001b[${39}m`} = ${wordCount}`
      );
    }
    if (
      !doNothingUntil &&
      (!str[i + 1] ||
        ((str[i] === "\n" && str[i + 1] === "\n") ||
          (str[i] === "\r" && str[i + 1] === "\r") ||
          (str[i] === "\r" &&
            str[i + 1] === "\n" &&
            str[i + 2] === "\r" &&
            str[i + 3] === "\n")) ||
        ((str[i] === "\n" ||
          str[i] === "\r" ||
          (str[i] === "\r" && str[i + 1] === "\n")) &&
          str[i - 1] &&
          punctuationCharsToConsiderWidowIssue.includes(str[left(str, i)])))
    ) {
      console.log(
        `570 ${`\u001b[${32}m${`██`}\u001b[${39}m`} PARAGRAPH ENDING!`
      );
      if (
        (!opts.minWordCount || wordCount >= opts.minWordCount) &&
        (!opts.minCharCount || charCount >= opts.minCharCount)
      ) {
        let finalStart;
        let finalEnd;
        if (
          lastWhitespaceStartedAt !== undefined &&
          lastWhitespaceEndedAt !== undefined &&
          lastEncodedNbspStartedAt !== undefined &&
          lastEncodedNbspEndedAt !== undefined
        ) {
          console.log(`587`);
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
          console.log(`599`);
          finalStart = lastWhitespaceStartedAt;
          finalEnd = lastWhitespaceEndedAt;
        } else if (
          lastEncodedNbspStartedAt !== undefined &&
          lastEncodedNbspEndedAt !== undefined
        ) {
          console.log(`606`);
          finalStart = lastEncodedNbspStartedAt;
          finalEnd = lastEncodedNbspEndedAt;
        }
        if (
          !(finalStart && finalEnd) &&
          secondToLastWhitespaceStartedAt &&
          secondToLastWhitespaceEndedAt
        ) {
          console.log(`619`);
          finalStart = secondToLastWhitespaceStartedAt;
          finalEnd = secondToLastWhitespaceEndedAt;
        }
        console.log(`624 finalStart = ${finalStart}; finalEnd = ${finalEnd}`);
        if (finalStart && finalEnd) {
          push(finalStart, finalEnd);
        }
      }
      resetAll();
      console.log(`632 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`}`);
    }
    if (
      opts.UKPostcodes &&
      !str[i].trim().length &&
      str[i - 1] &&
      str[i - 1].trim().length &&
      postcodeRegexFront.test(str.slice(0, i)) &&
      str[right(str, i)] &&
      postcodeRegexEnd.test(str.slice(right(str, i)))
    ) {
      console.log(`646 POSTCODE caught: [${i}, ${right(str, i)}]`);
      push(i, right(str, i));
    }
    if (
      !doNothingUntil &&
      !str[i].trim().length &&
      str[i - 1] &&
      str[i - 1].trim().length &&
      (lastWhitespaceStartedAt === undefined ||
        (str[lastWhitespaceStartedAt - 1] &&
          str[lastWhitespaceStartedAt - 1].trim().length)) &&
      !"/>".includes(str[right(str, i)]) &&
      !str.slice(0, left(str, i) + 1).endsWith("br") &&
      !str.slice(0, left(str, i) + 1).endsWith("hr")
    ) {
      secondToLastWhitespaceStartedAt = lastWhitespaceStartedAt;
      secondToLastWhitespaceEndedAt = lastWhitespaceEndedAt;
      lastWhitespaceStartedAt = i;
      lastWhitespaceEndedAt = undefined;
      console.log(
        `696 ${`\u001b[${32}m${`SET 2`}\u001b[${39}m`} ${`\u001b[${33}m${`secondToLastWhitespaceStartedAt`}\u001b[${39}m`} = ${secondToLastWhitespaceStartedAt};${" ".repeat(
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
        `711 ${`\u001b[${32}m${`SET 2`}\u001b[${39}m`} ${`\u001b[${33}m${`lastWhitespaceStartedAt`}\u001b[${39}m`}         = ${lastWhitespaceStartedAt};${" ".repeat(
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
      if (
        lastEncodedNbspStartedAt !== undefined ||
        lastEncodedNbspEndedAt !== undefined
      ) {
        lastEncodedNbspStartedAt = undefined;
        lastEncodedNbspEndedAt = undefined;
        console.log(
          `734 ${`\u001b[${90}m${`RESET`}\u001b[${39}m`} lastEncodedNbspStartedAt, lastEncodedNbspEndedAt`
        );
      }
    }
    let tempTailFinding;
    if (doNothingUntil) {
      if (
        isStr(doNothingUntil) &&
        (!doNothingUntil.length || str.startsWith(doNothingUntil, i))
      ) {
        doNothingUntil = undefined;
      } else if (
        isArr(doNothingUntil) &&
        (!doNothingUntil.length ||
          doNothingUntil.some(val => {
            if (str.startsWith(val, i)) {
              tempTailFinding = val;
              return true;
            }
          }))
      ) {
        doNothingUntil = undefined;
        console.log(
          `759 RESET ${`\u001b[${33}m${`doNothingUntil`}\u001b[${39}m`}`
        );
        console.log(
          `762 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} i: ${`\u001b[${33}m${i}\u001b[${39}m`}=>${`\u001b[${33}m${i +
            tempTailFinding.length}\u001b[${39}m`}`
        );
        i += tempTailFinding.length;
        console.log(
          `772 \u001b[${32}m${`██`}\u001b[${39}m we're at i=${i}, to the right is: ${str.slice(
            i
          )}`
        );
        if (isArr(opts.ignore) && opts.ignore.length && str[i + 1]) {
          opts.ignore.some(oneOfHeadsTailsObjs => {
            return matchRightIncl(str, i, oneOfHeadsTailsObjs.tails, {
              trimBeforeMatching: true,
              cb: (char, theRemainderOfTheString, index) => {
                if (index) {
                  console.log(`793 RECEIVED by CB() index = ${index}`);
                  i = index - 1;
                  console.log(
                    `796 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} i = ${i - 1}`
                  );
                  if (str[i + 1] && str[i + 1].trim().length) {
                    wordCount++;
                    console.log(
                      `801 ${`\u001b[${32}m${`BUMP`}\u001b[${39}m`} wordCount now = ${wordCount}`
                    );
                  }
                }
                return true;
              }
            });
          });
        }
      }
    }
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
  }
  return {
    res: apply(
      str,
      rangesArr.current(),
      opts.reportProgressFunc
        ? incomingPerc => {
            currentPercentageDone = Math.floor(
              (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) *
                (1 - leavePercForLastStage) +
                (incomingPerc / 100) *
                  (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) *
                  leavePercForLastStage
            );
            console.log(
              `870 ${`\u001b[${33}m${`currentPercentageDone`}\u001b[${39}m`} = ${JSON.stringify(
                currentPercentageDone,
                null,
                4
              )}`
            );
            if (currentPercentageDone !== lastPercentage) {
              lastPercentage = currentPercentageDone;
              opts.reportProgressFunc(currentPercentageDone);
            }
          }
        : null
    ),
    ranges: rangesArr.current(),
    log: {
      timeTakenInMiliseconds: Date.now() - start
    }
  };
}

export { defaultOpts, removeWidows, version };
