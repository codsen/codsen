/* eslint prefer-const: 0 */

import rangesApply from "ranges-apply";

function convertOne(
  str,
  {
    from,
    to,
    value,
    convertEntities = true,
    convertApostrophes = true,
    offsetBy
  }
) {
  // insurance
  // =========

  if (!Number.isInteger(to)) {
    if (Number.isInteger(from)) {
      to = from + 1;
    } else {
      throw new Error(
        `string-apostrophes: [THROW_ID_01] options objects keys' "to" and "from" values are not integers!`
      );
    }
  }

  // consts
  // ======

  const rangesArr = [];
  const leftSingleQuote = "\u2018";
  const rightSingleQuote = "\u2019";
  const leftDoubleQuote = "\u201C";
  const rightDoubleQuote = "\u201D";
  const singlePrime = "\u2032";
  const doublePrime = "\u2033";
  const punctuationChars = [".", ",", ";", "!", "?"];
  // const rawNDash = "\u2013";
  // const rawMDash = "\u2014";

  // f's
  // ===

  function isNumber(str) {
    return (
      typeof str === "string" &&
      str.charCodeAt(0) >= 48 &&
      str.charCodeAt(0) <= 57
    );
  }

  function isLetter(str) {
    return (
      typeof str === "string" &&
      str.length === 1 &&
      str.toUpperCase() !== str.toLowerCase()
    );
  }

  if (value === "'" || (to === from + 1 && str[from] === "'")) {
    // IF SINGLE QUOTE OR APOSTROPHE, the '
    if (
      str[from - 1] &&
      str[to] &&
      isNumber(str[from - 1]) &&
      !isLetter(str[to])
    ) {
      if (convertApostrophes) {
        rangesArr.push([from, to, convertEntities ? "&prime;" : singlePrime]);
        console.log(
          `073 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} prime symbol [${from}, ${to}, ${
            convertEntities ? "&prime;" : "\u2032"
          }]`
        );
      }
    } else if (
      str[to] &&
      str[to + 1] &&
      str[to] === "n" &&
      str.slice(from, to) === str.slice(to + 1, to + 1 + (to - from))
    ) {
      // specifically take care of 'n' as in "rock ’n’ roll"
      if (convertApostrophes) {
        rangesArr.push([
          from,
          to + 2,
          convertEntities ? "&rsquo;n&rsquo;" : "\u2019n\u2019"
        ]);
        console.log(
          `092 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to +
            2}, ${convertEntities ? "&rsquo;n&rsquo;" : "\u2019n\u2019"}]`
        );
        if (typeof offsetBy === "function") {
          offsetBy(2);
        }
      }
    } else if (
      (str[to] &&
        str[to].toLowerCase() === "t" &&
        (!str[to + 1] ||
          str[to + 1].trim().length === 0 ||
          str[to + 1].toLowerCase() === "i")) ||
      (str[to] &&
        str[to + 2] &&
        str[to].toLowerCase() === "t" &&
        str[to + 1].toLowerCase() === "w" &&
        (str[to + 2].toLowerCase() === "a" ||
          str[to + 2].toLowerCase() === "e" ||
          str[to + 2].toLowerCase() === "i" ||
          str[to + 2].toLowerCase() === "o")) ||
      (str[to] &&
        str[to + 1] &&
        str[to].toLowerCase() === "e" &&
        str[to + 1].toLowerCase() === "m") ||
      (str[to] &&
        str[to + 4] &&
        str[to].toLowerCase() === "c" &&
        str[to + 1].toLowerCase() === "a" &&
        str[to + 2].toLowerCase() === "u" &&
        str[to + 3].toLowerCase() === "s" &&
        str[to + 4].toLowerCase() === "e") ||
      (str[to] && isNumber(str[to]))
    ) {
      if (convertApostrophes) {
        // first, take care of 'tis, 'twas, 'twere, 'twould and so on
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rsquo;" : rightSingleQuote
        ]);
        console.log(
          `134 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rsquo;" : rightSingleQuote
          }]`
        );
      }
    } else if (
      str[from - 1] &&
      str[to] &&
      punctuationChars.includes(str[from - 1])
    ) {
      // 1. if there's punctuation on the left and something on the right:
      if (str[to].trim().length === 0) {
        if (convertApostrophes) {
          rangesArr.push([
            from,
            to,
            convertEntities ? "&rsquo;" : rightSingleQuote
          ]);
          console.log(
            `153 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&rsquo;" : rightSingleQuote
            }]`
          );
        }
      } else if (
        str[to].charCodeAt(0) === 34 && // double quote follows
        str[to + 1] &&
        str[to + 1].trim().length === 0 // and whitespace after
      ) {
        if (convertApostrophes) {
          rangesArr.push([
            from,
            to + 1,
            `${
              convertEntities
                ? "&rsquo;&rdquo;"
                : `${rightSingleQuote}${rightDoubleQuote}`
            }`
          ]);
          console.log(
            `174 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to +
              1}, ${
              convertEntities
                ? "&rsquo;&rdquo;"
                : `${rightSingleQuote}${rightDoubleQuote}`
            }}]`
          );
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        }
      }
    } else if (from === 0) {
      // 2. if it's the beginning of a string
      if (convertApostrophes) {
        rangesArr.push([
          from,
          to,
          convertEntities ? "&lsquo;" : leftSingleQuote
        ]);
        console.log(
          `195 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&lsquo;" : leftSingleQuote
          }]`
        );
      }
    } else if (!str[to]) {
      //
      if (convertApostrophes) {
        // 3. if it's the beginning of a string
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rsquo;" : rightSingleQuote
        ]);
        console.log(
          `210 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rsquo;" : rightSingleQuote
          }]`
        );
      }
    } else if (
      str[from - 1] &&
      str[to] &&
      (isLetter(str[from - 1]) || isNumber(str[from - 1])) &&
      (isLetter(str[to]) || isNumber(str[to]))
    ) {
      // equivalent of /(\w)'(\w)/g
      // 4. single quote surrounded with alphanimeric characters
      if (convertApostrophes) {
        // exception for a few Hawaiian words:
        if (
          (str[to] &&
            str[from - 5] &&
            str[from - 5].toLowerCase() === "h" &&
            str[from - 4].toLowerCase() === "a" &&
            str[from - 3].toLowerCase() === "w" &&
            str[from - 2].toLowerCase() === "a" &&
            str[from - 1].toLowerCase() === "i" &&
            str[to].toLowerCase() === "i") ||
          (str[from - 1] &&
            str[from - 1].toLowerCase() === "o" &&
            str[to + 2] &&
            str[to].toLowerCase() === "a" &&
            str[to + 1].toLowerCase() === "h" &&
            str[to + 2].toLowerCase() === "u")
        ) {
          rangesArr.push([
            from,
            to,
            convertEntities ? "&lsquo;" : leftSingleQuote
          ]);
          console.log(
            `247 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&lsquo;" : leftSingleQuote
            }]`
          );
        } else {
          rangesArr.push([
            from,
            to,
            convertEntities ? "&rsquo;" : rightSingleQuote
          ]);
          console.log(
            `258 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&rsquo;" : rightSingleQuote
            }]`
          );
        }
      }
    } else if (str[to] && (isLetter(str[to]) || isNumber(str[to]))) {
      // equivalent of /'\b/g
      // 5. alphanumeric follows
      if (convertApostrophes) {
        rangesArr.push([
          from,
          to,
          convertEntities ? "&lsquo;" : leftSingleQuote
        ]);
        console.log(
          `274 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&lsquo;" : leftSingleQuote
          }]`
        );
      }
    } else if (isLetter(str[from - 1]) || isNumber(str[from - 1])) {
      // equivalent of /'\b/g
      // 6. alphanumeric precedes
      if (convertApostrophes) {
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rsquo;" : rightSingleQuote
        ]);
        console.log(
          `289 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rsquo;" : rightSingleQuote
          }]`
        );
      }
    } else if (str[from - 1] && str[from - 1].trim().length === 0) {
      // 7. whitespace in front
      if (convertApostrophes) {
        rangesArr.push([
          from,
          to,
          convertEntities ? "&lsquo;" : leftSingleQuote
        ]);
        console.log(
          `303 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&lsquo;" : leftSingleQuote
          }]`
        );
      }
    } else if (str[to] && str[to].trim().length === 0) {
      // 8. whitespace after
      if (convertApostrophes) {
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rsquo;" : rightSingleQuote
        ]);
        console.log(
          `317 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rsquo;" : rightSingleQuote
          }]`
        );
      }
    }
  } else if (value === `"` || (to === from + 1 && str[from] === `"`)) {
    // IF DOUBLE QUOTE (")
    if (convertApostrophes) {
      if (
        str[from - 1] &&
        isNumber(str[from - 1]) &&
        (str[to] &&
          str[to] !== "'" &&
          str[to] !== '"' &&
          str[to] !== rightSingleQuote &&
          str[to] !== rightDoubleQuote &&
          str[to] !== leftSingleQuote &&
          str[to] !== leftDoubleQuote)
      ) {
        // replace double quotes meaning inches with double prime symbol:
        rangesArr.push([from, to, convertEntities ? "&Prime;" : doublePrime]);
        console.log(
          `340 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} double prime symbol [${from}, ${to}, ${
            convertEntities ? "&Prime;" : doublePrime
          }]`
        );
      } else if (
        str[from - 1] &&
        str[to] &&
        punctuationChars.includes(str[from - 1])
      ) {
        // 1. if there's punctuation on the left and space/quote on the right:
        if (str[to].trim().length === 0) {
          rangesArr.push([
            from,
            to,
            convertEntities ? "&rdquo;" : rightDoubleQuote
          ]);
          console.log(
            `357 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&rdquo;" : rightDoubleQuote
            }]`
          );
        } else if (
          str[to].charCodeAt(0) === 39 && // single quote follows
          str[to + 1] &&
          str[to + 1].trim().length === 0
        ) {
          console.log(
            `367 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to +
              1}, ${
              convertEntities
                ? "&rdquo;&rsquo;"
                : `${rightDoubleQuote}${rightSingleQuote}`
            }]`
          );
          rangesArr.push([
            from,
            to + 1,
            convertEntities
              ? "&rdquo;&rsquo;"
              : `${rightDoubleQuote}${rightSingleQuote}`
          ]);
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        }
      } else if (from === 0) {
        // 2. if it's the beginning of a string
        rangesArr.push([
          from,
          to,
          convertEntities ? "&ldquo;" : leftDoubleQuote
        ]);
        console.log(
          `393 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&ldquo;" : leftDoubleQuote
          }]`
        );
      } else if (!str[to]) {
        // 3. if it's the beginning of a string
        console.log(
          `400 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rdquo;" : rightDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rdquo;" : rightDoubleQuote
        ]);
      } else if (str[to] && (isLetter(str[to]) || isNumber(str[to]))) {
        // equivalent of /"\b/g
        // 4. alphanumeric follows
        console.log(
          `413 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&ldquo;" : leftDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to,
          convertEntities ? "&ldquo;" : leftDoubleQuote
        ]);
      } else if (
        str[from - 1] &&
        (isLetter(str[from - 1]) || isNumber(str[from - 1]))
      ) {
        // equivalent of /"\b/g
        // 5. alphanumeric precedes
        console.log(
          `429 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rdquo;" : rightDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rdquo;" : rightDoubleQuote
        ]);
      } else if (str[from - 1] && str[from - 1].trim().length === 0) {
        // 6. whitespace in front
        console.log(
          `441 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&ldquo;" : leftDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to,
          convertEntities ? "&ldquo;" : leftDoubleQuote
        ]);
      } else if (str[to] && str[to].trim().length === 0) {
        // 7. whitespace after
        console.log(
          `453 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rdquo;" : rightDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rdquo;" : rightDoubleQuote
        ]);
      }
    }
  }

  return rangesArr;
}

function convertAll(str, opts) {
  let ranges = [];
  const preppedOpts = Object.assign(
    {
      convertApostrophes: true,
      convertEntities: false
    },
    opts
  );
  // loop through the given string
  for (let i = 0, len = str.length; i < len; i++) {
    console.log(
      `${`\u001b[${36}m${`==========`}\u001b[${39}m`} ${JSON.stringify(
        str[i],
        null,
        0
      )} (idx ${i}) ${`\u001b[${36}m${`==========`}\u001b[${39}m`}`
    );
    // offset is needed to bypass characters we already fixed - it happens for
    // example with nested quotes - we'd fix many in one go and we need to skip
    // further processing, otherwise those characters would get processed
    // multiple times
    preppedOpts.from = i;
    preppedOpts.offsetBy = idx => {
      console.log(`493 ██ BUMP i from ${i} to ${i + idx}`);
      i = i + idx;
    };
    console.log(
      `497 ${`\u001b[${33}m${`preppedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        Object.keys(preppedOpts),
        null,
        4
      )}`
    );
    const res = convertOne(str, preppedOpts);
    if (Array.isArray(res) && res.length) {
      ranges = ranges.concat(res);
    }
  }
  return {
    result: rangesApply(str, ranges),
    ranges
  };
}

export { convertOne, convertAll };
