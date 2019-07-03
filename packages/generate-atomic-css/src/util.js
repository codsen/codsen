import split from "split-lines";
const isArr = Array.isArray;

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

  // console.log(`\n\n\n\n\n`);
  // console.log(`032 ${`\u001b[${36}m${`===========`}\u001b[${39}m`}`);
  // console.log(`033 prepLine(): str: ${`\u001b[${35}m${str}\u001b[${39}m`}`);
  const split = str.split("|").filter(val => val.length);
  // console.log(
  //   `036 prepLine(): ${`\u001b[${33}m${`split`}\u001b[${39}m`} = ${JSON.stringify(
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
      `059 ${`\u001b[${36}m${`-----------`}\u001b[${39}m`} i = ${`\u001b[${31}m${i}\u001b[${39}m`}`
    );
    console.log(
      `062 ${`\u001b[${33}m${`split[0]`}\u001b[${39}m`} = ${JSON.stringify(
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
      `081 ${`\u001b[${33}m${`findingsThreeDollarWithUnits`}\u001b[${39}m`} = ${JSON.stringify(
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
        `094 ${`\u001b[${33}m${`findingsThreeDollarWithUnits`}\u001b[${39}m`} = ${JSON.stringify(
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
      `112 assembled ${`\u001b[${33}m${`newStr`}\u001b[${39}m`} = ${JSON.stringify(
        newStr,
        null,
        4
      )}`
    );

    // .replace(
    //   threeDollarRegexWithUnits,
    //   `${i}${i === 0 ? "" : "$2"}`.padStart(String(to).length + "$1".length)
    // )

    // first replace with padding (when whitespace or curlies follow), then
    // replace what's left simply replacing the number
    res += `${i === from ? "" : "\n"}${newStr
      .replace(
        threeDollarFollowedByWhitespaceRegex,
        `${i}`.padEnd(String(to).length)
      )
      .replace(threeDollarRegex, i)}`.trimEnd();

    // res += `${i === from ? "" : "\n"}${
    //   i === from && i === 0
    //     ? split[0].replace(
    //         threeDollarRegex,
    //         `${i}`.padStart(threeDollarRegex.match(split[0]))
    //       )
    //     : split[0].replace(/\$\$\$/g, i)
    // }`.trimEnd();

    // console.log(`142 prepLine(): new res = "${res}"`);

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
  // console.log(`155 ${`\u001b[${36}m${`-----------`}\u001b[${39}m`}\n`);
  // console.log(`156 prepLine(): about to return res="${res}"`);
  return res;
}

function prepConfig(str, progressFn, progressFrom, progressTo) {
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
    )
  ).join("\n");
}

export { prepLine, prepConfig, isStr };

//   currentPercentageDone =
//     progressFrom +
//     Math.floor((i / arr.length) * Math.floor(progressTo - progressFrom));
//   console.log(
//     `186 prepConfig(): ${`\u001b[${33}m${`currentPercentageDone`}\u001b[${39}m`} = ${JSON.stringify(
//       currentPercentageDone,
//       null,
//       4
//     )}`
//   );
//
//   if (currentPercentageDone !== lastPercentage) {
//     lastPercentage = currentPercentageDone;
//     console.log(
//       `196 prepConfig(): reporting ${`\u001b[${33}m${`currentPercentageDone`}\u001b[${39}m`} = ${`\u001b[${35}m${currentPercentageDone}\u001b[${39}m`}`
//     );
//     progressFn(currentPercentageDone);
//   }
// }
