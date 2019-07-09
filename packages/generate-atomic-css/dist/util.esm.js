import split from 'split-lines';
import { right } from 'string-left-right';

const isArr = Array.isArray;
function isStr(something) {
  return typeof something === "string";
}
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
  "vmax"
];
const padLeftIfTheresOnTheLeft = [":"];
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
function extractFromToSource(str, fromDefault, toDefault) {
  let from = fromDefault;
  let to = toDefault;
  let source = str;
  if (str.lastIndexOf("}") > 0) {
    if (str.slice(str.lastIndexOf("}") + 1).includes("|")) {
      const tempArr = str
        .slice(str.lastIndexOf("}") + 1)
        .split("|")
        .filter(val => val.trim().length)
        .map(val => val.trim())
        .filter(val =>
          String(val)
            .split("")
            .every(char => /\d/g.test(char))
        );
      if (tempArr.length === 1) {
        to = Number.parseInt(tempArr[0], 10);
      } else if (tempArr.length > 1) {
        from = Number.parseInt(tempArr[0], 10);
        to = Number.parseInt(tempArr[1], 10);
      }
      source = str
        .slice(0, str.indexOf("|", str.lastIndexOf("}") + 1))
        .trimEnd();
      if (source.trim().startsWith("|")) {
        while (source.trim().startsWith("|")) {
          source = source.trimStart().slice(1);
        }
      }
    }
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
          units.some(unit => {
            if (restOfStr.startsWith(unit)) {
              unitFound = unit;
              return true;
            }
          }) &&
          (source[right(source, y + unitFound.length)] === "{" ||
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
          units.some(unit => {
            if (source.slice(y + 1).startsWith(unit)) {
              unitThatFollow = unit;
              return true;
            }
          });
          if (
            !source[y - 3].trim().length ||
            padLeftIfTheresOnTheLeft.some(val =>
              source.slice(startPoint, y - 2).endsWith(val)
            )
          ) {
            res += `${source.slice(startPoint, y - 2)}${
              pad
                ? String(i).padStart(
                    String(to).length +
                      (i === 0 && unitThatFollow ? unitThatFollow.length : 0)
                  )
                : i
            }`;
          } else if (
            !source[y + 1].trim().length ||
            source[right(source, y)] === "{"
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
          units.some(unit => {
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
    split(str).map((rowStr, i, arr) =>
      rowStr.includes("$$$")
        ? prepLine(
            rowStr,
            progressFn,
            progressFrom + ((progressTo - progressFrom) / arr.length) * i,
            progressFrom + ((progressTo - progressFrom) / arr.length) * (i + 1),
            generatedCount,
            pad
          )
        : rowStr
    ),
    trim
  ).join("\n");
}

export { extractFromToSource, isArr, isStr, prepConfig, prepLine };
