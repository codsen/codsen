import split from "split-lines";
import { right } from "string-left-right";
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
  // killswitch is activated, do nothing
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

// takes string for example, .mt$$$ { margin-top: $$$px; }|3
// and extracts the parts after the pipe
// also, we use it for simpler format sources that come from wizard on the
// webapp, format .mt|0|500 - same business, extract digits between pipes
function extractFromToSource(str, fromDefault = 0, toDefault = 500) {
  let from = fromDefault;
  let to = toDefault;
  let source = str;

  let tempArr;
  if (
    str.lastIndexOf("}") > 0 &&
    str.slice(str.lastIndexOf("}") + 1).includes("|")
  ) {
    console.log(`069 util: closing curlie detected`);
    tempArr = str
      .slice(str.lastIndexOf("}") + 1)
      .split("|")
      .filter(val => val.trim().length)
      .map(val => val.trim())
      .filter(val =>
        String(val)
          .split("")
          .every(char => /\d/g.test(char))
      );
  } else if (str.includes("|")) {
    console.log(`081 util: else case with pipes`);
    tempArr = str
      .split("|")
      .filter(val => val.trim().length)
      .map(val => val.trim())
      .filter(val =>
        String(val)
          .split("")
          .every(char => /\d/g.test(char))
      );
  }

  console.log(
    `094 util: ${`\u001b[${33}m${`tempArr`}\u001b[${39}m`} = ${JSON.stringify(
      tempArr,
      null,
      4
    )}`
  );
  if (isArr(tempArr)) {
    if (tempArr.length === 1) {
      to = Number.parseInt(tempArr[0], 10);
    } else if (tempArr.length > 1) {
      from = Number.parseInt(tempArr[0], 10);
      to = Number.parseInt(tempArr[1], 10);
    }
  }

  console.log(`109 from=${from}; to=${to}`);

  // extract the source string - it's everything from zero to first pipe
  // that follows the last closing curly brace
  if (
    str.lastIndexOf("}") > 0 &&
    str.slice(str.lastIndexOf("}") + 1).includes("|")
  ) {
    source = str.slice(0, str.indexOf("|", str.lastIndexOf("}") + 1)).trimEnd();
    if (source.trim().startsWith("|")) {
      console.log(`119 util: crop leading pipe`);
      while (source.trim().startsWith("|")) {
        source = source.trimStart().slice(1);
      }
    }
  } else {
    console.log(`125 ${`\u001b[${36}m${`loop`}\u001b[${39}m`}`);
    let lastPipeWasAt = null;
    let firstNonPipeNonWhitespaceCharMet = false;
    let startFrom = 0;
    let endTo = str.length;

    // null is fresh state, true is met, false is pattern of only digits was broken
    let onlyDigitsAndWhitespaceBeenMet = null;

    for (let i = 0, len = str.length; i < len; i++) {
      console.log(
        `136 ${`\u001b[${36}m${`------ ${`str[${i}] = ${`\u001b[${35}m${
          str[i]
        }\u001b[${39}m`}`} ------`}\u001b[${39}m`}`
      );

      // first "cell" between pipes which contains only digits terminates the
      // loop; its opening pipe is "endTo", we slice up to it
      if ("0123456789".includes(str[i])) {
        // if it's digit...

        if (onlyDigitsAndWhitespaceBeenMet === null && str[i].trim().length) {
          onlyDigitsAndWhitespaceBeenMet = true;
          console.log(`148 SET onlyDigitsAndWhitespaceBeenMet = true`);
        }
      } else {
        // if not digit...

        if (str[i] !== "|" && str[i].trim().length) {
          onlyDigitsAndWhitespaceBeenMet = false;
          console.log(`155 SET onlyDigitsAndWhitespaceBeenMet = false`);
        }
      }

      // catch the last character
      if (!str[i + 1] && onlyDigitsAndWhitespaceBeenMet) {
        endTo = lastPipeWasAt;
        console.log(
          `163 SET ${`\u001b[${33}m${`endTo`}\u001b[${39}m`} = ${endTo}`
        );
      }

      // catch pipe
      if (str[i] === "|") {
        console.log(`169 ${`\u001b[${33}m${`pipe caught`}\u001b[${39}m`}`);
        if (onlyDigitsAndWhitespaceBeenMet) {
          endTo = lastPipeWasAt;
          console.log(
            `173 set endTo = ${endTo}; ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
          );
          break;
        }

        lastPipeWasAt = i;
        console.log(`179 SET lastPipeWasAt = ${lastPipeWasAt}`);

        // reset:
        onlyDigitsAndWhitespaceBeenMet = null;
        console.log(`183 SET onlyDigitsAndWhitespaceBeenMet = null`);
      } else if (!firstNonPipeNonWhitespaceCharMet && str[i].trim().length) {
        firstNonPipeNonWhitespaceCharMet = true;
        if (lastPipeWasAt !== null) {
          startFrom = lastPipeWasAt + 1;
          console.log(
            `189 SET ${`\u001b[${33}m${`startFrom`}\u001b[${39}m`} = ${startFrom}`
          );
        }
        console.log(
          `193 SET ${`\u001b[${33}m${`firstNonPipeNonWhitespaceCharMet`}\u001b[${39}m`} = ${firstNonPipeNonWhitespaceCharMet};`
        );
      }

      console.log(
        `198 ${`\u001b[${90}m${` ENDING
startFrom = ${startFrom}
endTo = ${endTo}
onlyDigitsAndWhitespaceBeenMet = ${onlyDigitsAndWhitespaceBeenMet}
lastPipeWasAt = ${lastPipeWasAt}
`}\u001b[${39}m`}`
      );
    }
    console.log(`206 startFrom = ${startFrom}; endTo = ${endTo}`);
    source = str.slice(startFrom, endTo).trimEnd();
    console.log(
      `209 FINAL ${`\u001b[${33}m${`source`}\u001b[${39}m`} = ${source}`
    );
  }

  return [from, to, source];
}

function prepLine(str, progressFn, subsetFrom, subsetTo, generatedCount, pad) {
  //
  //
  //
  //                PART I. Extract from, to and source values
  //
  //
  //

  let currentPercentageDone;
  let lastPercentage = 0;
  console.log(`\n\n\n\n\n`);
  console.log(`228 util: ${`\u001b[${36}m${`===========`}\u001b[${39}m`}`);
  console.log(
    `230 util: prepLine(): str: ${`\u001b[${35}m${str}\u001b[${39}m`}`
  );

  // we need to extract the "from" and to "values"
  // the separator is vertical pipe, which is a legit CSS selector

  const [from, to, source] = extractFromToSource(str, 0, 500);

  console.log(
    `239 ${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${from}\n${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${to}\n${`\u001b[${33}m${`source`}\u001b[${39}m`} = "${source}"\n`
  );

  //
  //
  //
  //           PART II. extract dollar-dollar-dollar positions and types
  //
  //
  //

  const subsetRange = subsetTo - subsetFrom;
  let res = "";

  // traverse
  for (let i = from; i <= to; i++) {
    let debtPaddingLen = 0;
    console.log("\n");
    console.log(
      `258 ███████████████████████████████████████ row i=${i} ███████████████████████████████████████\n`
    );
    // if (pad) {
    let startPoint = 0;
    for (let y = 0, len = source.length; y < len; y++) {
      const charcode = source[y].charCodeAt(0);
      console.log(
        `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`source[ ${y} ] = ${
          source[y].trim().length
            ? source[y]
            : JSON.stringify(source[y], null, 0)
        }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} \u001b[${36}m${`===============================`}\u001b[${39}m`
      );

      // catch third dollar of three dollars in a row
      // -----------------------------------------------------------------------
      if (source[y] === "$" && source[y - 1] === "$" && source[y - 2] === "$") {
        console.log(
          `276 ${`\u001b[${33}m${`startPoint`}\u001b[${39}m`} = ${JSON.stringify(
            startPoint,
            null,
            4
          )}`
        );
        console.log(`282 $$$ caught`);
        // submit all the content up until now
        const restOfStr = source.slice(y + 1);
        console.log(
          `286 ${`\u001b[${33}m${`restOfStr`}\u001b[${39}m`} = ${JSON.stringify(
            restOfStr,
            null,
            4
          )}`
        );
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
          console.log(`304 push: "${source.slice(startPoint, y - 2)}"`);
          console.log(
            `306 push also: "${
              pad
                ? String(i).padStart(
                    String(to).length - String(i).length + unitFound.length + 1
                  )
                : i
            }"`
          );
          res += `${source.slice(startPoint, y - 2)}${
            pad
              ? String(i).padStart(
                  String(to).length - String(i).length + unitFound.length + 1
                )
              : i
          }`;
          startPoint = y + 1 + (unitFound ? unitFound.length : 0);
        } else {
          // extract units if any follow the $$$
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
            // if left-side padding can be possible:
            console.log(
              `340 push ${`${source.slice(startPoint, y - 2)}${String(
                i
              ).padStart(String(to).length)}`}`
            );
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
            console.log(
              `357 push ${`${source.slice(startPoint, y - 2)}${
                pad
                  ? String(i).padEnd(
                      String(to).length +
                        (i === 0 && unitThatFollow ? unitThatFollow.length : 0)
                    )
                  : i
              }`}`
            );
            // if right-side padding can be possible:
            res += `${source.slice(startPoint, y - 2)}${
              pad
                ? String(i).padEnd(
                    String(to).length +
                      (i === 0 && unitThatFollow ? unitThatFollow.length : 0)
                  )
                : i
            }`;
          } else {
            console.log(`376 push ${`${source.slice(startPoint, y - 2)}${i}`}`);
            res += `${source.slice(startPoint, y - 2)}${i}`;

            // also, make a note of padding which we'll need to do later,
            // in front of the next opening curlie.
            // for example, range is 0-10, so 2 digit padding, and we have
            // .pt0px[lang|=en]
            // this zero above needs to be padded at the next available location
            // that is before opening curlie.
            //

            if (pad) {
              debtPaddingLen = String(to).length - String(i).length;
              console.log(
                `390 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`debtPaddingLen`}\u001b[${39}m`} = ${JSON.stringify(
                  debtPaddingLen,
                  null,
                  4
                )}`
              );
            }
          }
          startPoint = y + 1;
        }
      }

      // catch opening curlie
      // -----------------------------------------------------------------------
      if (source[y] === "{" && pad) {
        console.log(`405 opening curlie caught`);
        if (debtPaddingLen) {
          res += `${source.slice(startPoint, y)}${` `.repeat(debtPaddingLen)}`;
          startPoint = y;
          debtPaddingLen = 0;
          console.log(
            `411 SET startPoint = ${startPoint}; debtPaddingLen = ${debtPaddingLen}`
          );
        }
      }

      // catch the last character of a line
      if (!source[y + 1]) {
        console.log(`418 last character on a line!`);
        console.log(
          `420 ${`\u001b[${33}m${`startPoint`}\u001b[${39}m`} = ${JSON.stringify(
            startPoint,
            null,
            4
          )}`
        );
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
          console.log(
            `438 push "${source.slice(startPoint + unitFound.length)}"`
          );
          res += `${source.slice(startPoint + unitFound.length)}`;
        } else {
          console.log(`442 last char - submit "${source.slice(startPoint)}"`);
          res += `${source.slice(startPoint)}`;
        }
        // add line break
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
  // all rows will report the progress from progressFrom to progressTo.
  // For example, defaults 0 to 100.
  // If there are for example 5 rows, each row will iterate through
  // (100-0)/5 = 20 percent range. This means, progress bar will be jumpy:
  // it will pass rows without $$$ quick but ones with $$$ slow and granular.
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

export { prepLine, prepConfig, isStr, isArr, extractFromToSource };
