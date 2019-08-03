/** 
 * string-remove-widows
 * Helps to prevent widow words in text
 * Version: 1.2.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-widows
 */
import apply from 'ranges-apply';
import isObj from 'lodash.isplainobject';

var version = "1.2.8";

const rawnbsp = "\u00A0";
const encodedNbspHtml = "&nbsp;";
const encodedNbspCss = "\\00A0";
const encodedNbspJs = "\\u00A0";

const defaultOpts = {
  removeWidowPreventionMeasures: false,
  killSwitch: false,
  convertEntities: false,
  language: "html",
  hyphens: true,
  minWordCount: 4,
  minCharLen: 50,
  reportProgressFunc: null
};
function removeWidows(str, originalOpts) {
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
  const len = str.length;
  const midLen = Math.floor(len / 2);
  const ranges = [];
  let currentPercentageDone;
  let lastPercentage = 0;
  let lastWhitespaceStartedAt;
  let lastWhitespaceEndedAt;
  let lastEncodedNbspStartedAt;
  let lastEncodedNbspEndedAt;
  const opts = Object.assign({}, defaultOpts, originalOpts);
  function resetAll() {
    lastWhitespaceStartedAt = undefined;
    lastWhitespaceEndedAt = undefined;
    lastEncodedNbspStartedAt = undefined;
    lastEncodedNbspEndedAt = undefined;
  }
  resetAll();
  for (let i = 0, len = str.length; i < len; i++) {
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
        currentPercentageDone =
          opts.reportProgressFuncFrom + Math.floor(i / len);
        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
      }
    }
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
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6;
      if (str[i + 6] && str[i + 6].trim().length) ;
    }
    if (
      str[i] === "\\" &&
      str[i + 1] === "0" &&
      str[i + 2] === "0" &&
      str[i + 3] &&
      str[i + 3].toUpperCase() === "A" &&
      str[i + 4] === "0"
    ) {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 5;
      if (str[i + 5] && str[i + 5].trim().length) ;
    }
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
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 6;
      if (str[i + 6] && str[i + 6].trim().length) ;
    }
    if (str[i] === rawnbsp) {
      lastEncodedNbspStartedAt = i;
      lastEncodedNbspEndedAt = i + 1;
      if (str[i + 2] && str[i + 2].trim().length) ;
    }
    if (str[i].trim().length && (!str[i - 1] || !str[i - 1].trim().length)) ;
    if (
      i &&
      str[i].trim().length &&
      (!str[i - 1] || (str[i - 1] && !str[i - 1].trim().length))
    ) {
      lastWhitespaceEndedAt = i;
    }
    if (
      !str[i].trim().length &&
      str[i - 1] &&
      str[i - 1].trim().length &&
      (lastWhitespaceStartedAt === undefined ||
        (str[lastWhitespaceStartedAt - 1] &&
          str[lastWhitespaceStartedAt - 1].trim().length))
    ) {
      lastWhitespaceStartedAt = i;
      lastWhitespaceEndedAt = undefined;
    }
    if (!str[i + 1]) {
      let finalStart;
      let finalEnd;
      let finalWhatToInsert = rawnbsp;
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
      }
      resetAll();
    }
  }
  return {
    res: apply(str, ranges),
    ranges,
    log: {
      timeTakenInMiliseconds: Date.now() - start
    }
  };
}

export { defaultOpts, removeWidows, version };
