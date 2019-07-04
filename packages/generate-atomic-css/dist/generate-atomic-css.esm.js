/**
 * generate-atomic-css
 * Generate Atomic CSS
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/generate-atomic-css
 */

import { right, left, leftSeq, rightSeq } from 'string-left-right';
import split from 'split-lines';

var version = "1.0.1";

const isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}
function trimBlankLinesFromLinesArray(lineArr, trim = true) {
  if (!trim) {
    return lineArr;
  }
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
    let newStr = split[0];
    const threeDollarRegexWithUnits = /(\$\$\$(px|em|%|rem|cm|mm|in|pt|pc|ex|ch|vw|vmin|vmax))/g;
    const unitsOnly = /(px|em|%|rem|cm|mm|in|pt|pc|ex|ch|vw|vmin|vmax)/g;
    const threeDollarFollowedByWhitespaceRegex = /\$\$\$(?=[{ ])/g;
    const threeDollarRegex = /\$\$\$/g;
    const findingsThreeDollarWithUnits = newStr.match(
      threeDollarRegexWithUnits
    );
    if (
      isArr(findingsThreeDollarWithUnits) &&
      findingsThreeDollarWithUnits.length
    ) {
      findingsThreeDollarWithUnits.forEach(valFound => {
        newStr = newStr.replace(
          valFound,
          `${i}${i === 0 ? "" : unitsOnly.exec(valFound)[0]}`.padStart(
            valFound.length - 3 + String(to).length
          )
        );
      });
    }
    res += `${i === from ? "" : "\n"}${newStr
      .replace(
        threeDollarFollowedByWhitespaceRegex,
        `${i}`.padEnd(String(to).length)
      )
      .replace(threeDollarRegex, i)}`.trimEnd();
    if (typeof progressFn === "function") {
      currentPercentageDone = Math.floor(
        subsetFrom + (i / (to - from)) * subsetRange
      );
      if (currentPercentageDone !== lastPercentage) {
        lastPercentage = currentPercentageDone;
        progressFn(currentPercentageDone);
      }
    }
  }
  return res;
}
function prepConfig(str, progressFn, progressFrom, progressTo, trim = true) {
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
    ),
    trim
  ).join("\n");
}

const headsAndTails = {
  CONFIGHEAD: "GENERATE-ATOMIC-CSS-CONFIG-STARTS",
  CONFIGTAIL: "GENERATE-ATOMIC-CSS-CONFIG-ENDS",
  CONTENTHEAD: "GENERATE-ATOMIC-CSS-CONTENT-STARTS",
  CONTENTTAIL: "GENERATE-ATOMIC-CSS-CONTENT-ENDS"
};
function genAtomic(str, originalOpts) {
  function trimIfNeeded(str) {
    if (!opts.includeConfig && !opts.includeHeadsAndTails) {
      return str;
    }
    return str.trim();
  }
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
  if (
    (!opts.configOverride &&
      !str.includes("$$$") &&
      !str.includes(CONFIGHEAD) &&
      !str.includes(CONFIGTAIL) &&
      !str.includes(CONTENTHEAD) &&
      !str.includes(CONTENTTAIL)) ||
    (isStr(opts.configOverride) &&
      !opts.configOverride.includes("$$$") &&
      !opts.configOverride.includes(CONFIGHEAD) &&
      !opts.configOverride.includes(CONFIGTAIL) &&
      !opts.configOverride.includes(CONTENTHEAD) &&
      !opts.configOverride.includes(CONTENTTAIL))
  ) {
    return str;
  }
  let frontPart = "";
  let endPart = "";
  let rawContentAbove = "";
  let rawContentBelow = "";
  let extractedConfig;
  if (opts.configOverride) {
    extractedConfig = opts.configOverride;
  } else if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL)) {
    if (
      str.indexOf(CONFIGTAIL) !== -1 &&
      str.indexOf(CONTENTHEAD) !== -1 &&
      str.indexOf(CONFIGTAIL) > str.indexOf(CONTENTHEAD)
    ) {
      throw new Error(
        `generate-atomic-css: [THROW_ID_02] Config heads are after config tails!`
      );
    }
    let sliceFrom = str.indexOf(CONFIGHEAD) + CONFIGHEAD.length;
    let sliceTo = str.indexOf(CONFIGTAIL);
    if (
      str[right(str, sliceFrom)] === "*" &&
      str[right(str, right(str, sliceFrom))] === "/"
    ) {
      sliceFrom = right(str, right(str, sliceFrom)) + 1;
    }
    if (
      str[left(str, sliceTo)] === "*" &&
      str[left(str, left(str, sliceTo))] === "/"
    ) {
      sliceTo = left(str, left(str, sliceTo));
    }
    extractedConfig = str.slice(sliceFrom, sliceTo).trim();
    if (!isStr(extractedConfig) || !extractedConfig.trim().length) {
      return "";
    }
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
  } else if (
    !str.includes(CONFIGHEAD) &&
    !str.includes(CONFIGTAIL) &&
    (str.includes(CONTENTHEAD) || str.includes(CONTENTTAIL))
  ) {
    extractedConfig = str;
    if (extractedConfig.includes(CONTENTHEAD)) {
      if (left(str, extractedConfig.indexOf(CONTENTHEAD))) {
        let sliceTo = extractedConfig.indexOf(CONTENTHEAD);
        if (leftSeq(str, sliceTo, "/", "*")) {
          sliceTo = leftSeq(str, sliceTo, "/", "*").leftmostChar;
        }
        rawContentAbove = sliceTo === 0 ? "" : str.slice(0, sliceTo);
      }
      let sliceFrom = extractedConfig.indexOf(CONTENTHEAD) + CONTENTHEAD.length;
      if (rightSeq(extractedConfig, sliceFrom - 1, "*", "/")) {
        sliceFrom =
          rightSeq(extractedConfig, sliceFrom - 1, "*", "/").rightmostChar + 1;
      }
      let sliceTo = null;
      if (str.includes(CONTENTTAIL)) {
        sliceTo = str.indexOf(CONTENTTAIL);
        if (
          str[left(str, sliceTo)] === "*" &&
          str[left(str, left(str, sliceTo))] === "/"
        ) {
          sliceTo = left(str, left(str, sliceTo));
        }
        let contentAfterStartsAt =
          str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
        if (
          str[right(str, contentAfterStartsAt - 1)] === "*" &&
          str[right(str, right(str, contentAfterStartsAt - 1))] === "/"
        ) {
          contentAfterStartsAt =
            right(str, right(str, contentAfterStartsAt - 1)) + 1;
        }
        if (right(str, contentAfterStartsAt)) {
          rawContentBelow = str.slice(contentAfterStartsAt);
        }
      }
      if (sliceTo) {
        extractedConfig = extractedConfig.slice(sliceFrom, sliceTo).trim();
      } else {
        extractedConfig = extractedConfig.slice(sliceFrom).trim();
      }
    }
    else if (extractedConfig.includes(CONTENTTAIL)) {
      const contentInFront = [];
      let stopFilteringAndPassAllLines = false;
      extractedConfig = extractedConfig
        .split("\n")
        .filter(rowStr => {
          if (!rowStr.includes("$$$") && !stopFilteringAndPassAllLines) {
            if (!stopFilteringAndPassAllLines) {
              contentInFront.push(rowStr);
            }
            return false;
          }
          if (!stopFilteringAndPassAllLines) {
            stopFilteringAndPassAllLines = true;
            return true;
          }
          return true;
        })
        .join("\n");
      let sliceTo = extractedConfig.indexOf(CONTENTTAIL);
      if (leftSeq(extractedConfig, sliceTo, "/", "*")) {
        sliceTo = leftSeq(extractedConfig, sliceTo, "/", "*").leftmostChar;
      }
      extractedConfig = extractedConfig.slice(0, sliceTo).trim();
      if (contentInFront.length) {
        rawContentAbove = `${contentInFront.join("\n")}\n`;
      }
      let contentAfterStartsAt;
      if (right(str, str.indexOf(CONTENTTAIL) + CONTENTTAIL.length)) {
        contentAfterStartsAt = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
        if (
          str[right(str, contentAfterStartsAt)] === "*" &&
          str[right(str, right(str, contentAfterStartsAt))] === "/"
        ) {
          contentAfterStartsAt =
            right(str, right(str, contentAfterStartsAt)) + 1;
          if (right(str, contentAfterStartsAt)) {
            rawContentBelow = str.slice(contentAfterStartsAt);
          }
        }
      }
    }
  } else {
    const contentHeadsRegex = new RegExp(
      `(\\/\\s*\\*\\s*)*${CONTENTHEAD}(\\s*\\*\\s*\\/)*`
    );
    const contentTailsRegex = new RegExp(
      `(\\/\\s*\\*\\s*)*${CONTENTTAIL}(\\s*\\*\\s*\\/)*`
    );
    let stopFiltering = false;
    const gatheredLinesAboveTopmostConfigLine = [];
    const gatheredLinesBelowLastConfigLine = [];
    const configLines = str.split("\n").filter(rowStr => {
      if (stopFiltering) {
        return true;
      }
      if (!rowStr.includes("$$$")) {
        gatheredLinesAboveTopmostConfigLine.push(rowStr);
        return false;
      }
      stopFiltering = true;
      return true;
    });
    for (let i = configLines.length; i--; ) {
      if (!configLines[i].includes("$$$")) {
        gatheredLinesBelowLastConfigLine.unshift(configLines.pop());
      } else {
        break;
      }
    }
    extractedConfig = configLines
      .join("\n")
      .replace(contentHeadsRegex, "")
      .replace(contentTailsRegex, "");
    if (gatheredLinesAboveTopmostConfigLine.length) {
      rawContentAbove = `${gatheredLinesAboveTopmostConfigLine.join("\n")}\n`;
    }
    if (gatheredLinesBelowLastConfigLine.length) {
      rawContentBelow = `\n${gatheredLinesBelowLastConfigLine.join("\n")}`;
    }
  }
  if (!isStr(extractedConfig) || !extractedConfig.trim().length) {
    return "";
  }
  if (opts.includeConfig || opts.includeHeadsAndTails) {
    frontPart = `${CONTENTHEAD} */\n`;
    if (!opts.includeConfig) {
      frontPart = `/* ${frontPart}`;
    }
    endPart = `\n/* ${CONTENTTAIL} */`;
  }
  if (opts.includeConfig) {
    frontPart = `/* ${CONFIGHEAD}\n${extractedConfig.trim()}\n${CONFIGTAIL}\n${frontPart}`;
  }
  if (str.includes(CONFIGHEAD)) {
    if (left(str, str.indexOf(CONFIGHEAD))) {
      let sliceUpTo = str.indexOf(CONFIGHEAD);
      if (
        str[left(str, sliceUpTo)] === "*" &&
        str[left(str, left(str, sliceUpTo))] === "/"
      ) {
        sliceUpTo = left(str, left(str, sliceUpTo));
      }
      frontPart = `${str.slice(0, sliceUpTo)}${
        str[right(str, sliceUpTo - 1)] === "/" &&
        str[right(str, right(str, sliceUpTo - 1))] === "*"
          ? ""
          : "/* "
      }${frontPart}`;
    }
  }
  if (
    str.includes(CONFIGTAIL) &&
    right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)
  ) {
    let sliceFrom = str.indexOf(CONFIGTAIL) + CONFIGTAIL.length;
    if (
      str[right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)] === "*" &&
      str[
        right(str, right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length))
      ] === "/"
    ) {
      sliceFrom =
        right(str, right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)) + 1;
    }
    if (str.slice(right(str, sliceFrom - 1)).startsWith(CONTENTHEAD)) {
      const contentHeadsStartAt = right(str, sliceFrom);
      sliceFrom = contentHeadsStartAt + CONTENTHEAD.length;
      if (
        str[right(str, sliceFrom - 1)] === "*" &&
        str[right(str, right(str, sliceFrom - 1))] === "/"
      ) {
        sliceFrom = right(str, right(str, sliceFrom - 1)) + 1;
      }
      if (str.includes(CONTENTTAIL)) {
        sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
        if (
          str[right(str, sliceFrom)] === "*" &&
          str[right(str, right(str, sliceFrom))] === "/"
        ) {
          sliceFrom = right(str, right(str, sliceFrom)) + 1;
        }
      }
    }
    endPart = `${endPart}${
      str[sliceFrom] && right(str, sliceFrom - 1) ? str.slice(sliceFrom) : ""
    }`;
  }
  if (isStr(rawContentAbove)) {
    frontPart = `${rawContentAbove}${frontPart}`;
  }
  if (isStr(rawContentBelow)) {
    if (
      rawContentBelow.trim().endsWith("/*") &&
      !rawContentBelow.trim().startsWith("*/")
    ) {
      let frontPart = "";
      if (
        isStr(rawContentBelow) &&
        rawContentBelow[0] &&
        !rawContentBelow[0].trim().length
      ) {
        frontPart = rawContentBelow.slice(0, right(rawContentBelow, 0));
      }
      rawContentBelow = `${frontPart}/* ${rawContentBelow.trim()}`;
    }
    endPart = `${endPart}${rawContentBelow}`;
  }
  const finalRes = `${trimIfNeeded(
    `${frontPart}${prepConfig(
      extractedConfig,
      opts.reportProgressFunc,
      opts.reportProgressFuncFrom,
      opts.reportProgressFuncTo,
      true
    )}${endPart}`
  )}\n`;
  return finalRes;
}

export { genAtomic, headsAndTails, version };
