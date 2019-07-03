import split from "split-lines";
const isArr = Array.isArray;

function isStr(something) {
  return typeof something === "string";
}

function trimBlankLinesFromLinesArray(lineArr, trim = true) {
  // killswitch is activated, do nothing
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

  // console.log(`\n\n\n\n\n`);
  // console.log(`036 ${`\u001b[${36}m${`===========`}\u001b[${39}m`}`);
  // console.log(`037 prepLine(): str: ${`\u001b[${35}m${str}\u001b[${39}m`}`);
  const split = str.split("|").filter(val => val.length);
  // console.log(
  //   `040 prepLine(): ${`\u001b[${33}m${`split`}\u001b[${39}m`} = ${JSON.stringify(
  //     split,
  //     null,
  //     4
  //   )}`
  // );

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
  // console.log(`\n\n`);
  const subsetRange = subsetTo - subsetFrom;
  for (let i = from; i <= to; i++) {
    console.log("\n\n");
    console.log(
      `063 ${`\u001b[${36}m${`-----------`}\u001b[${39}m`} i = ${`\u001b[${31}m${i}\u001b[${39}m`}`
    );
    console.log(
      `066 ${`\u001b[${33}m${`split[0]`}\u001b[${39}m`} = ${JSON.stringify(
        split[0],
        null,
        4
      )}`
    );

    let newStr = split[0];

    const threeDollarRegexWithUnits = /(\$\$\$(px|em|%|rem|cm|mm|in|pt|pc|ex|ch|vw|vmin|vmax))/g;
    const unitsOnly = /(px|em|%|rem|cm|mm|in|pt|pc|ex|ch|vw|vmin|vmax)/g;
    const threeDollarFollowedByWhitespaceRegex = /\$\$\$(?=[{ ])/g;
    const threeDollarRegex = /\$\$\$/g;

    // // 1. first process three dollar sequences with units:
    const findingsThreeDollarWithUnits = newStr.match(
      threeDollarRegexWithUnits
    );
    console.log(
      `085 ${`\u001b[${33}m${`findingsThreeDollarWithUnits`}\u001b[${39}m`} = ${JSON.stringify(
        findingsThreeDollarWithUnits,
        null,
        4
      )}`
    );
    if (
      isArr(findingsThreeDollarWithUnits) &&
      findingsThreeDollarWithUnits.length // &&
      // i === from &&
      // i === 0
    ) {
      console.log(
        `098 ${`\u001b[${33}m${`findingsThreeDollarWithUnits`}\u001b[${39}m`} = ${JSON.stringify(
          findingsThreeDollarWithUnits,
          null,
          4
        )}`
      );
      // take care of padding zeros:
      findingsThreeDollarWithUnits.forEach(valFound => {
        newStr = newStr.replace(
          valFound,
          `${i}${i === 0 ? "" : unitsOnly.exec(valFound)[0]}`.padStart(
            valFound.length - 3 + String(to).length
          )
        );
      });
    }

    console.log(
      `116 assembled ${`\u001b[${33}m${`newStr`}\u001b[${39}m`} = ${JSON.stringify(
        newStr,
        null,
        4
      )}`
    );

    // first replace with padding (when whitespace or curlies follow), then
    // replace what's left simply replacing the number
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
  // console.log(`143 ${`\u001b[${36}m${`-----------`}\u001b[${39}m`}\n`);
  // console.log(`144 prepLine(): about to return res="${res}"`);
  return res;
}

function prepConfig(str, progressFn, progressFrom, progressTo, trim = true) {
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
            progressFrom + ((progressTo - progressFrom) / arr.length) * (i + 1)
          )
        : rowStr
    ),
    trim
  ).join("\n");
}

export { prepLine, prepConfig, isStr, isArr };
