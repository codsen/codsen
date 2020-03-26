'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var stringLeftRight = require('string-left-right');

const isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}
const headsAndTails = {
  CONFIGHEAD: "GENERATE-ATOMIC-CSS-CONFIG-STARTS",
  CONFIGTAIL: "GENERATE-ATOMIC-CSS-CONFIG-ENDS",
  CONTENTHEAD: "GENERATE-ATOMIC-CSS-CONTENT-STARTS",
  CONTENTTAIL: "GENERATE-ATOMIC-CSS-CONTENT-ENDS",
};
const units = [
  "px",
  "em",
  "%",
  "rem",
  "cm",
  "mm",
  "in",
  "pt",
  "pc",
  "ex",
  "ch",
  "vw",
  "vmin",
  "vmax",
];
const { CONFIGHEAD, CONFIGTAIL, CONTENTHEAD, CONTENTTAIL } = headsAndTails;
const padLeftIfTheresOnTheLeft = [":"];
function extractConfig(str) {
  let extractedConfig = str;
  let rawContentAbove = "";
  let rawContentBelow = "";
  if (str.includes(CONFIGHEAD) && str.includes(CONFIGTAIL)) {
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
      str[stringLeftRight.right(str, sliceFrom)] === "*" &&
      str[stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom))] === "/"
    ) {
      sliceFrom = stringLeftRight.right(str, stringLeftRight.right(str, sliceFrom)) + 1;
    }
    if (
      str[stringLeftRight.left(str, sliceTo)] === "*" &&
      str[stringLeftRight.left(str, stringLeftRight.left(str, sliceTo))] === "/"
    ) {
      sliceTo = stringLeftRight.left(str, stringLeftRight.left(str, sliceTo));
    }
    extractedConfig = str.slice(sliceFrom, sliceTo).trim();
    if (!isStr(extractedConfig) || !extractedConfig.trim().length) {
      return {
        log: {
          count: 0,
        },
        result: "",
      };
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
      if (stringLeftRight.left(str, extractedConfig.indexOf(CONTENTHEAD))) {
        let sliceTo = extractedConfig.indexOf(CONTENTHEAD);
        if (stringLeftRight.leftSeq(str, sliceTo, "/", "*")) {
          sliceTo = stringLeftRight.leftSeq(str, sliceTo, "/", "*").leftmostChar;
        }
        rawContentAbove = sliceTo === 0 ? "" : str.slice(0, sliceTo);
      }
      let sliceFrom = extractedConfig.indexOf(CONTENTHEAD) + CONTENTHEAD.length;
      if (stringLeftRight.rightSeq(extractedConfig, sliceFrom - 1, "*", "/")) {
        sliceFrom =
          stringLeftRight.rightSeq(extractedConfig, sliceFrom - 1, "*", "/").rightmostChar + 1;
      }
      let sliceTo = null;
      if (str.includes(CONTENTTAIL)) {
        sliceTo = str.indexOf(CONTENTTAIL);
        if (
          str[stringLeftRight.left(str, sliceTo)] === "*" &&
          str[stringLeftRight.left(str, stringLeftRight.left(str, sliceTo))] === "/"
        ) {
          sliceTo = stringLeftRight.left(str, stringLeftRight.left(str, sliceTo));
        }
        let contentAfterStartsAt =
          str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
        if (
          str[stringLeftRight.right(str, contentAfterStartsAt - 1)] === "*" &&
          str[stringLeftRight.right(str, stringLeftRight.right(str, contentAfterStartsAt - 1))] === "/"
        ) {
          contentAfterStartsAt =
            stringLeftRight.right(str, stringLeftRight.right(str, contentAfterStartsAt - 1)) + 1;
        }
        if (stringLeftRight.right(str, contentAfterStartsAt)) {
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
        .filter((rowStr) => {
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
      if (stringLeftRight.leftSeq(extractedConfig, sliceTo, "/", "*")) {
        sliceTo = stringLeftRight.leftSeq(extractedConfig, sliceTo, "/", "*").leftmostChar;
      }
      extractedConfig = extractedConfig.slice(0, sliceTo).trim();
      if (contentInFront.length) {
        rawContentAbove = `${contentInFront.join("\n")}\n`;
      }
      let contentAfterStartsAt;
      if (stringLeftRight.right(str, str.indexOf(CONTENTTAIL) + CONTENTTAIL.length)) {
        contentAfterStartsAt = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
        if (
          str[stringLeftRight.right(str, contentAfterStartsAt)] === "*" &&
          str[stringLeftRight.right(str, stringLeftRight.right(str, contentAfterStartsAt))] === "/"
        ) {
          contentAfterStartsAt =
            stringLeftRight.right(str, stringLeftRight.right(str, contentAfterStartsAt)) + 1;
          if (stringLeftRight.right(str, contentAfterStartsAt)) {
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
    const configLines = str.split("\n").filter((rowStr) => {
      if (stopFiltering) {
        return true;
      }
      if (
        !rowStr.includes("$$$") &&
        !rowStr.includes("{") &&
        !rowStr.includes(":")
      ) {
        gatheredLinesAboveTopmostConfigLine.push(rowStr);
        return false;
      }
      stopFiltering = true;
      return true;
    });
    for (let i = configLines.length; i--; ) {
      if (
        !configLines[i].includes("$$$") &&
        !configLines[i].includes("}") &&
        !configLines[i].includes(":")
      ) {
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
  return [extractedConfig, rawContentAbove, rawContentBelow];
}
function trimBlankLinesFromLinesArray(lineArr, trim = true) {
  if (!trim) {
    return lineArr;
  }
  const copyArr = Array.from(lineArr);
  if (copyArr.length && isStr(copyArr[0]) && !copyArr[0].trim().length) {
    do {
      copyArr.shift();
    } while (isStr(copyArr[0]) && !copyArr[0].trim().length);
  }
  if (
    copyArr.length &&
    isStr(copyArr[copyArr.length - 1]) &&
    !copyArr[copyArr.length - 1].trim().length
  ) {
    do {
      copyArr.pop();
    } while (
      copyArr &&
      copyArr[copyArr.length - 1] &&
      !copyArr[copyArr.length - 1].trim().length
    );
  }
  return copyArr;
}
function extractFromToSource(str, fromDefault = 0, toDefault = 500) {
  let from = fromDefault;
  let to = toDefault;
  let source = str;
  let tempArr;
  if (
    str.lastIndexOf("}") > 0 &&
    str.slice(str.lastIndexOf("}") + 1).includes("|")
  ) {
    tempArr = str
      .slice(str.lastIndexOf("}") + 1)
      .split("|")
      .filter((val) => val.trim().length)
      .map((val) => val.trim())
      .filter((val) =>
        String(val)
          .split("")
          .every((char) => /\d/g.test(char))
      );
  } else if (str.includes("|")) {
    tempArr = str
      .split("|")
      .filter((val) => val.trim().length)
      .map((val) => val.trim())
      .filter((val) =>
        String(val)
          .split("")
          .every((char) => /\d/g.test(char))
      );
  }
  if (isArr(tempArr)) {
    if (tempArr.length === 1) {
      to = Number.parseInt(tempArr[0], 10);
    } else if (tempArr.length > 1) {
      from = Number.parseInt(tempArr[0], 10);
      to = Number.parseInt(tempArr[1], 10);
    }
  }
  if (
    str.lastIndexOf("}") > 0 &&
    str.slice(str.lastIndexOf("}") + 1).includes("|")
  ) {
    source = str.slice(0, str.indexOf("|", str.lastIndexOf("}") + 1)).trimEnd();
    if (source.trim().startsWith("|")) {
      while (source.trim().startsWith("|")) {
        source = source.trimStart().slice(1);
      }
    }
  } else {
    let lastPipeWasAt = null;
    let firstNonPipeNonWhitespaceCharMet = false;
    let startFrom = 0;
    let endTo = str.length;
    let onlyDigitsAndWhitespaceBeenMet = null;
    for (let i = 0, len = str.length; i < len; i++) {
      if ("0123456789".includes(str[i])) {
        if (onlyDigitsAndWhitespaceBeenMet === null && str[i].trim().length) {
          onlyDigitsAndWhitespaceBeenMet = true;
        }
      } else {
        if (str[i] !== "|" && str[i].trim().length) {
          onlyDigitsAndWhitespaceBeenMet = false;
        }
      }
      if (!str[i + 1] && onlyDigitsAndWhitespaceBeenMet) {
        endTo = lastPipeWasAt;
      }
      if (str[i] === "|") {
        if (onlyDigitsAndWhitespaceBeenMet) {
          endTo = lastPipeWasAt;
          break;
        }
        lastPipeWasAt = i;
        onlyDigitsAndWhitespaceBeenMet = null;
      } else if (!firstNonPipeNonWhitespaceCharMet && str[i].trim().length) {
        firstNonPipeNonWhitespaceCharMet = true;
        if (lastPipeWasAt !== null) {
          startFrom = lastPipeWasAt + 1;
        }
      }
    }
    source = str.slice(startFrom, endTo).trimEnd();
  }
  return [from, to, source];
}
function prepLine(str, progressFn, subsetFrom, subsetTo, generatedCount, pad) {
  let currentPercentageDone;
  let lastPercentage = 0;
  const [from, to, source] = extractFromToSource(str, 0, 500);
  const subsetRange = subsetTo - subsetFrom;
  let res = "";
  for (let i = from; i <= to; i++) {
    let debtPaddingLen = 0;
    let startPoint = 0;
    for (let y = 0, len = source.length; y < len; y++) {
      const charcode = source[y].charCodeAt(0);
      if (source[y] === "$" && source[y - 1] === "$" && source[y - 2] === "$") {
        const restOfStr = source.slice(y + 1);
        let unitFound;
        if (
          i === 0 &&
          units.some((unit) => {
            if (restOfStr.startsWith(unit)) {
              unitFound = unit;
              return true;
            }
          }) &&
          (source[stringLeftRight.right(source, y + unitFound.length)] === "{" ||
            !source[y + unitFound.length + 1].trim().length)
        ) {
          res += `${source.slice(startPoint, y - 2)}${
            pad
              ? String(i).padStart(
                  String(to).length - String(i).length + unitFound.length + 1
                )
              : i
          }`;
          startPoint = y + 1 + (unitFound ? unitFound.length : 0);
        } else {
          let unitThatFollow;
          units.some((unit) => {
            if (source.slice(y + 1).startsWith(unit)) {
              unitThatFollow = unit;
              return true;
            }
          });
          if (
            !source[y - 3].trim().length ||
            padLeftIfTheresOnTheLeft.some((val) =>
              source
                .slice(startPoint, y - 2)
                .trim()
                .endsWith(val)
            )
          ) {
            let temp = 0;
            if (i === 0) {
              units.some((unit) => {
                if (`${source.slice(startPoint, y - 2)}`.startsWith(unit)) {
                  temp = unit.length;
                }
                return true;
              });
            }
            res += `${source.slice(startPoint + temp, y - 2)}${
              pad
                ? String(i).padStart(
                    String(to).length +
                      (i === 0 && unitThatFollow ? unitThatFollow.length : 0)
                  )
                : i
            }`;
          } else if (
            !source[y + 1].trim().length ||
            source[stringLeftRight.right(source, y)] === "{"
          ) {
            res += `${source.slice(startPoint, y - 2)}${
              pad
                ? String(i).padEnd(
                    String(to).length +
                      (i === 0 && unitThatFollow ? unitThatFollow.length : 0)
                  )
                : i
            }`;
          } else {
            res += `${source.slice(startPoint, y - 2)}${i}`;
            if (pad) {
              debtPaddingLen = String(to).length - String(i).length;
            }
          }
          startPoint = y + 1;
        }
      }
      if (source[y] === "{" && pad) {
        if (debtPaddingLen) {
          res += `${source.slice(startPoint, y)}${` `.repeat(debtPaddingLen)}`;
          startPoint = y;
          debtPaddingLen = 0;
        }
      }
      if (!source[y + 1]) {
        let unitFound;
        const restOfStr = source.slice(startPoint);
        if (
          i === 0 &&
          units.some((unit) => {
            if (restOfStr.startsWith(unit)) {
              unitFound = unit;
              return true;
            }
          })
        ) {
          res += `${source.slice(startPoint + unitFound.length)}`;
        } else {
          res += `${source.slice(startPoint)}`;
        }
        res += `${i !== to ? "\n" : ""}`;
      }
    }
    generatedCount.count++;
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
function bump(str, thingToBump) {
  if (/\.\w/g.test(str)) {
    thingToBump.count++;
  }
  return str;
}
function prepConfig(
  str,
  progressFn,
  progressFrom,
  progressTo,
  trim = true,
  generatedCount,
  pad
) {
  return trimBlankLinesFromLinesArray(
    str
      .split(/\r?\n/)
      .map((rowStr, i, arr) =>
        rowStr.includes("$$$")
          ? prepLine(
              rowStr,
              progressFn,
              progressFrom + ((progressTo - progressFrom) / arr.length) * i,
              progressFrom +
                ((progressTo - progressFrom) / arr.length) * (i + 1),
              generatedCount,
              pad
            )
          : bump(rowStr, generatedCount)
      ),
    trim
  ).join("\n");
}

exports.extractConfig = extractConfig;
exports.extractFromToSource = extractFromToSource;
exports.headsAndTails = headsAndTails;
exports.isArr = isArr;
exports.isStr = isStr;
exports.prepConfig = prepConfig;
exports.prepLine = prepLine;
