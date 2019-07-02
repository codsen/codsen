/**
 * generate-atomic-css
 * Generate Atomic CSS
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/generate-atomic-css
 */

import { leftSeq, left, rightSeq, right } from 'string-left-right';
import split from 'split-lines';

var version = "1.0.1";

function isStr(something) {
  return typeof something === "string";
}
function trimBlankLinesFromLinesArray(lineArr) {
  const copyArr = Array.from(lineArr);
  if (copyArr.length && isStr(copyArr[0]) && !copyArr[0].trim().length) {
    do {
      copyArr.shift();
    } while (!copyArr[0].trim().length);
  }
  if (
    copyArr.length &&
    isStr(copyArr[copyArr.length - 1]) &&
    !copyArr[copyArr.length - 1].trim().length
  ) {
    do {
      copyArr.pop();
    } while (!copyArr[copyArr.length - 1].trim().length);
  }
  return copyArr;
}
function prepLine(str, progressFn, subsetFrom, subsetTo) {
  let currentPercentageDone;
  let lastPercentage = 0;
  const split = str.split("|").filter(val => val.length);
  let from = 0;
  let to = 500;
  if (split[1]) {
    if (split[2]) {
      from = Number.parseInt(split[1].trim());
      to = Number.parseInt(split[2].trim());
    } else {
      to = Number.parseInt(split[1].trim());
    }
  }
  let res = "";
  const subsetRange = subsetTo - subsetFrom;
  for (let i = from; i <= to; i++) {
    const newStr = split[0];
    const threeDollarRegexWithUnits = /\$\$\$(px|em|%|rem|cm|mm|in|pt|pc|ex|ch|vw|vmin|vmax)/g;
    const threeDollarFollowedByWhitespaceRegex = /\$\$\$(?=[{ ])/g;
    const threeDollarRegex = /\$\$\$/g;
    res += `${i === from ? "" : "\n"}${newStr
      .replace(
        threeDollarRegexWithUnits,
        `${i}${i === 0 ? "" : "$1"}`.padStart(String(to).length + "$1".length)
      )
      .replace(
        threeDollarFollowedByWhitespaceRegex,
        `${i}`.padEnd(String(to).length)
      )
      .replace(threeDollarRegex, i)}`.trimEnd();
    if (typeof progressFn === "function") {
      currentPercentageDone =
        subsetFrom + Math.floor((i / (to - from)) * subsetRange);
      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        progressFn(currentPercentageDone);
      }
    }
  }
  return res;
}
function prepConfig(str, progressFn, progressFrom, progressTo) {
  return trimBlankLinesFromLinesArray(
    split(str).map((rowStr, i, arr) =>
      rowStr.includes("$$$")
        ? prepLine(
            rowStr,
            progressFn,
            progressFrom + ((progressTo - progressFrom) / arr.length) * i,
            progressFrom + ((progressTo - progressFrom) / arr.length) * (i + 1)
          )
        : rowStr
    )
  ).join("\n");
}

const headsAndTails = {
  CONFIGHEAD: "GENERATE-ATOMIC-CSS-CONFIG-STARTS",
  CONFIGTAIL: "GENERATE-ATOMIC-CSS-CONFIG-ENDS",
  CONTENTHEAD: "GENERATE-ATOMIC-CSS-CONTENT-STARTS",
  CONTENTTAIL: "GENERATE-ATOMIC-CSS-CONTENT-ENDS"
};
function genAtomic(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error(
      `generate-atomic-css: [THROW_ID_01] First input argument must be a string! It was given as "${JSON.stringify(
        str,
        null,
        4
      )}" (type ${typeof str})`
    );
  }
  const { CONFIGHEAD, CONFIGTAIL, CONTENTHEAD, CONTENTTAIL } = headsAndTails;
  const defaults = {
    includeConfig: true,
    includeHeadsAndTails: true,
    pad: true,
    configOverride: null,
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (opts.includeConfig && !opts.includeHeadsAndTails) {
    opts.includeHeadsAndTails = true;
  }
  let extractedConfig;
  if (opts.configOverride) {
    extractedConfig = opts.configOverride;
  } else if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL)) {
    if (str.indexOf(CONFIGTAIL) > str.indexOf(CONTENTHEAD)) {
      throw new Error(
        `generate-atomic-css: [THROW_ID_02] Config heads are after config tails!`
      );
    }
    extractedConfig = str.slice(
      str.indexOf(CONFIGHEAD) + CONFIGHEAD.length,
      str.indexOf(CONFIGTAIL)
    );
  } else if (
    str.includes(CONFIGHEAD) &&
    !str.includes(CONFIGTAIL) &&
    str.includes(CONTENTHEAD)
  ) {
    if (str.indexOf(CONFIGHEAD) > str.indexOf(CONTENTHEAD)) {
      throw new Error(
        `generate-atomic-css: [THROW_ID_03] Config heads are after content heads!`
      );
    }
    extractedConfig = str.slice(
      str.indexOf(CONFIGHEAD) + CONFIGHEAD.length,
      str.indexOf(CONTENTHEAD)
    );
  } else {
    extractedConfig = str;
  }
  let frontPart = "";
  let endPart = "";
  if (opts.includeConfig || opts.includeHeadsAndTails) {
    frontPart = `${CONTENTHEAD} */\n`;
    endPart = `\n/* ${CONTENTTAIL} */`;
  }
  if (opts.includeConfig) {
    frontPart = `/* ${CONFIGHEAD}\n${extractedConfig.trim()}\n${CONFIGTAIL}\n${frontPart}`;
  }
  if (str.includes(CONFIGHEAD)) {
    const matchedOpeningCSSCommentOnTheLeft = leftSeq(
      str,
      str.indexOf(CONFIGHEAD),
      "/",
      "*"
    );
    if (
      matchedOpeningCSSCommentOnTheLeft &&
      matchedOpeningCSSCommentOnTheLeft.leftmostChar
    ) {
      if (left(str, matchedOpeningCSSCommentOnTheLeft.leftmostChar)) {
        frontPart = `${str.slice(
          0,
          left(str, matchedOpeningCSSCommentOnTheLeft.leftmostChar) + 1
        )}\n${frontPart}`;
      }
    }
  }
  if (str.includes(CONTENTTAIL)) {
    const matchedClosingCSSCommentOnTheRight = rightSeq(
      str,
      str.indexOf(CONTENTTAIL) + CONTENTTAIL.length,
      "*",
      "/"
    );
    if (
      matchedClosingCSSCommentOnTheRight &&
      matchedClosingCSSCommentOnTheRight.rightmostChar &&
      right(str, matchedClosingCSSCommentOnTheRight.rightmostChar)
    ) {
      endPart = `${endPart}\n${str.slice(
        right(str, matchedClosingCSSCommentOnTheRight.rightmostChar)
      )}`;
    }
  }
  return `${`${frontPart}${prepConfig(
    extractedConfig,
    opts.reportProgressFunc,
    opts.reportProgressFuncFrom,
    opts.reportProgressFuncTo
  )}${endPart}`.trimEnd()}\n`;
}

export { genAtomic, headsAndTails, version };
