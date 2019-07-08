import split from "split-lines";
import { right } from "string-left-right";
const isArr = Array.isArray;
const threeDollarRegexWithUnits = /(\$\$\$(px|em|%|rem|cm|mm|in|pt|pc|ex|ch|vw|vmin|vmax))/g;
const unitsOnly = /(px|em|%|rem|cm|mm|in|pt|pc|ex|ch|vw|vmin|vmax)/g;
const threeDollarFollowedByWhitespaceRegex = /\$\$\$(?=[{ ])/g;
const threeDollarRegex = /\$\$\$/g;

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
  console.log(`071 util: ${`\u001b[${36}m${`===========`}\u001b[${39}m`}`);
  console.log(
    `073 util: prepLine(): str: ${`\u001b[${35}m${str}\u001b[${39}m`}`
  );

  // we need to extract the "from" and to "values"
  // the separator is vertical pipe, which is a legit CSS selector

  let from = 0;
  let to = 500;
  let source = str;

  if (str.lastIndexOf("}") > 0) {
    console.log(`084 util: closing curlie detected`);
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
      console.log(
        `097 util: ${`\u001b[${33}m${`tempArr`}\u001b[${39}m`} = ${JSON.stringify(
          tempArr,
          null,
          4
        )}`
      );
      if (tempArr.length === 1) {
        to = Number.parseInt(tempArr[0], 10);
      } else if (tempArr.length > 1) {
        from = Number.parseInt(tempArr[0], 10);
        to = Number.parseInt(tempArr[1], 10);
      }

      // extract the source string - it's everything from zero to first pipe
      // that follows the last closing curly brace
      source = str
        .slice(0, str.indexOf("|", str.lastIndexOf("}") + 1))
        .trimEnd();
      if (source.trim().startsWith("|")) {
        console.log(`116 util: crop leading pipe`);
        while (source.trim().startsWith("|")) {
          source = source.trimStart().slice(1);
        }
      }
    }
  }
  console.log(
    `124 ${`\u001b[${33}m${`source`}\u001b[${39}m`} = "${source}"\n${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${from}\n${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${to}`
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
      `143 ███████████████████████████████████████ row i=${i} ███████████████████████████████████████\n`
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
          `161 ${`\u001b[${33}m${`startPoint`}\u001b[${39}m`} = ${JSON.stringify(
            startPoint,
            null,
            4
          )}`
        );
        console.log(`167 $$$ caught`);
        // submit all the content up until now
        const restOfStr = source.slice(y + 1);
        console.log(
          `171 ${`\u001b[${33}m${`restOfStr`}\u001b[${39}m`} = ${JSON.stringify(
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
          console.log(`189 push: "${source.slice(startPoint, y - 2)}"`);
          console.log(
            `191 push also: "${
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
              `225 push ${`${source.slice(startPoint, y - 2)}${String(
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
              `242 push ${`${source.slice(startPoint, y - 2)}${
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
            console.log(`261 push ${`${source.slice(startPoint, y - 2)}${i}`}`);
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
                `275 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`debtPaddingLen`}\u001b[${39}m`} = ${JSON.stringify(
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
        console.log(`290 opening curlie caught`);
        if (debtPaddingLen) {
          res += `${source.slice(startPoint, y)}${` `.repeat(debtPaddingLen)}`;
          startPoint = y;
          debtPaddingLen = 0;
          console.log(
            `296 SET startPoint = ${startPoint}; debtPaddingLen = ${debtPaddingLen}`
          );
        }
      }

      // catch the last character of a line
      if (!source[y + 1]) {
        console.log(`303 last character on a line!`);
        console.log(
          `305 ${`\u001b[${33}m${`startPoint`}\u001b[${39}m`} = ${JSON.stringify(
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
            `323 push "${source.slice(startPoint + unitFound.length)}"`
          );
          res += `${source.slice(startPoint + unitFound.length)}`;
        } else {
          console.log(`327 last char - submit "${source.slice(startPoint)}"`);
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

export { prepLine, prepConfig, isStr, isArr };
