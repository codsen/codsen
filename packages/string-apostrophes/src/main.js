import rangesApply from "ranges-apply";

function convertOne(
  str,
  {
    from,
    to,
    value,
    convertEntities = true,
    convertApostrophes = true,
    offsetBy,
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

  function isDigitStr(str2) {
    return (
      typeof str2 === "string" &&
      str2.charCodeAt(0) >= 48 &&
      str2.charCodeAt(0) <= 57
    );
  }

  function isLetter(str2) {
    return (
      typeof str2 === "string" &&
      str2.length &&
      str2.toUpperCase() !== str2.toLowerCase()
    );
  }

  console.log(
    `061 ${`\u001b[${36}m${`convertOne():`}\u001b[${39}m`} ${`\u001b[${32}m${`START`}\u001b[${39}m`}`
  );

  console.log("064 settings: ");
  console.log(
    `${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(str, null, 4)}`
  );
  console.log(
    `${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${JSON.stringify(
      from,
      null,
      4
    )}`
  );
  console.log(
    `${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${JSON.stringify(to, null, 4)}`
  );
  console.log(
    `${`\u001b[${33}m${`value`}\u001b[${39}m`} = ${JSON.stringify(
      value,
      null,
      4
    )}`
  );
  console.log(
    `${`\u001b[${33}m${`convertEntities`}\u001b[${39}m`} = ${JSON.stringify(
      convertEntities,
      null,
      4
    )}`
  );
  console.log(
    `${`\u001b[${33}m${`convertApostrophes`}\u001b[${39}m`} = ${JSON.stringify(
      convertApostrophes,
      null,
      4
    )}`
  );
  console.log(
    `${`\u001b[${33}m${`offsetBy`}\u001b[${39}m`} type - ${typeof offsetBy}`
  );
  console.log("---------------");

  // The following section detects apostrophes, with aim to convert them to
  // curlie right single quote or similar.
  // However, we also need to tackle cases where wrong-side apostrophe is put,
  // for example, right side single quote instead of left side or the opposite.
  if (
    [`'`, leftSingleQuote, rightSingleQuote, singlePrime].includes(value) ||
    (to === from + 1 &&
      [`'`, leftSingleQuote, rightSingleQuote, singlePrime].includes(str[from]))
  ) {
    console.log(`113 single quote/apos clauses`);
    // IF SINGLE QUOTE OR APOSTROPHE, the '
    // OR LEFT/RIGHT SINGLE QUOTES OR SINGLE PRIME
    if (
      str[from - 1] &&
      str[to] &&
      isDigitStr(str[from - 1]) &&
      !isLetter(str[to])
    ) {
      console.log(`122 prime cases`);
      if (
        convertApostrophes &&
        str.slice(from, to) !== (convertEntities ? "&prime;" : singlePrime) &&
        value !== (convertEntities ? "&prime;" : singlePrime)
      ) {
        rangesArr.push([from, to, convertEntities ? "&prime;" : singlePrime]);
        console.log(
          `130 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} prime symbol [${from}, ${to}, ${
            convertEntities ? "&prime;" : "\u2032"
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to, `'`]);
        console.log(
          `141 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
        );
      }
    } else if (
      str[to] &&
      str[to + 1] &&
      str[to] === "n" &&
      str.slice(from, to) === str.slice(to + 1, to + 1 + (to - from)) // ensure quotes/apostrophes match
    ) {
      console.log(`150 rock 'n' roll case`);
      // specifically take care of 'n' as in "rock ’n’ roll"
      if (
        convertApostrophes &&
        str.slice(from, to + 2) !==
          (convertEntities
            ? "&rsquo;n&rsquo;"
            : `${rightSingleQuote}n${rightSingleQuote}`) &&
        value !==
          (convertEntities
            ? "&rsquo;n&rsquo;"
            : `${rightSingleQuote}n${rightSingleQuote}`)
      ) {
        rangesArr.push([
          from,
          to + 2,
          convertEntities
            ? "&rsquo;n&rsquo;"
            : `${rightSingleQuote}n${rightSingleQuote}`,
        ]);
        console.log(
          `171 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
            to + 2
          }, ${
            convertEntities
              ? "&rsquo;n&rsquo;"
              : `${rightSingleQuote}n${rightSingleQuote}`
          }]`
        );
        if (typeof offsetBy === "function") {
          offsetBy(2);
        }
      } else if (
        !convertApostrophes &&
        str.slice(from, to + 2) !== "'n'" &&
        value !== "'n'"
      ) {
        rangesArr.push([from, to + 2, "'n'"]);
        console.log(
          `189 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
            to + 2
          }, "'n'"]`
        );
        if (typeof offsetBy === "function") {
          offsetBy(2);
        }
      }

      console.log(`198 end reached`);
    } else if (
      (str[to] &&
        str[to].toLowerCase() === "t" &&
        (!str[to + 1] ||
          !str[to + 1].trim() ||
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
      (str[to] && isDigitStr(str[to]))
    ) {
      console.log(`226 'tis, 'twas, 'twere clauses`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rsquo;" : rightSingleQuote) &&
        value !== (convertEntities ? "&rsquo;" : rightSingleQuote)
      ) {
        // first, take care of 'tis, 'twas, 'twere, 'twould and so on
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rsquo;" : rightSingleQuote,
        ]);
        console.log(
          `240 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rsquo;" : rightSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== "'" &&
        value !== "'"
      ) {
        rangesArr.push([from, to, "'"]);
        console.log(
          `251 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "'"]`
        );
      }
    } else if (
      str[from - 1] &&
      str[to] &&
      punctuationChars.includes(str[from - 1])
    ) {
      // if there's punctuation on the left and something on the right:
      console.log(
        `261 there's punctuation on the left and something on the right`
      );
      if (!str[to].trim()) {
        if (
          convertApostrophes &&
          str.slice(from, to) !==
            (convertEntities ? "&rsquo;" : rightSingleQuote) &&
          value !== (convertEntities ? "&rsquo;" : rightSingleQuote)
        ) {
          rangesArr.push([
            from,
            to,
            convertEntities ? "&rsquo;" : rightSingleQuote,
          ]);
          console.log(
            `276 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&rsquo;" : rightSingleQuote
            }]`
          );
        } else if (
          !convertApostrophes &&
          str.slice(from, to) !== "'" &&
          value !== "'"
        ) {
          rangesArr.push([from, to, "'"]);
          console.log(
            `287 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "'"]`
          );
        }
      } else if (
        str[to].charCodeAt(0) === 34 && // double quote follows
        str[to + 1] &&
        !str[to + 1].trim() // and whitespace after
      ) {
        if (
          convertApostrophes &&
          str.slice(from, to + 1) !==
            (convertEntities
              ? "&rsquo;&rdquo;"
              : `${rightSingleQuote}${rightDoubleQuote}`) &&
          value !==
            (convertEntities
              ? "&rsquo;&rdquo;"
              : `${rightSingleQuote}${rightDoubleQuote}`)
        ) {
          rangesArr.push([
            from,
            to + 1,
            `${
              convertEntities
                ? "&rsquo;&rdquo;"
                : `${rightSingleQuote}${rightDoubleQuote}`
            }`,
          ]);
          console.log(
            `316 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
              to + 1
            }, ${
              convertEntities
                ? "&rsquo;&rdquo;"
                : `${rightSingleQuote}${rightDoubleQuote}`
            }}]`
          );
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        } else if (
          !convertApostrophes &&
          str.slice(from, to + 1) !== `'"` &&
          value !== `'"`
        ) {
          rangesArr.push([from, to + 1, `'"`]);
          console.log(
            `334 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, '" ]`
          );
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        }
      }
    } else if (from === 0 && str.slice(to).trim()) {
      // TODO - replace hard zero lookup with with left() - will allow more variations!
      // if it's the beginning of a string
      console.log(`344 the beginning of a string clauses`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&lsquo;" : leftSingleQuote) &&
        value !== (convertEntities ? "&lsquo;" : leftSingleQuote)
      ) {
        rangesArr.push([
          from,
          to,
          convertEntities ? "&lsquo;" : leftSingleQuote,
        ]);
        console.log(
          `357 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&lsquo;" : leftSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to, `'`]);
        console.log(
          `368 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ']`
        );
      }
    } else if (!str[to] && str.slice(0, from).trim()) {
      console.log(`372 ending of a string clauses`);
      //
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rsquo;" : rightSingleQuote) &&
        value !== (convertEntities ? "&rsquo;" : rightSingleQuote)
      ) {
        // 3. if it's the ending of a string
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rsquo;" : rightSingleQuote,
        ]);
        console.log(
          `387 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rsquo;" : rightSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to, `'`]);
        console.log(
          `398 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
        );
      }
    } else if (
      str[from - 1] &&
      str[to] &&
      (isLetter(str[from - 1]) || isDigitStr(str[from - 1])) &&
      (isLetter(str[to]) || isDigitStr(str[to]))
    ) {
      // equivalent of /(\w)'(\w)/g
      // single quote surrounded with alphanumeric characters
      console.log(`409 single quote surrounded with alphanumeric characters`);
      if (convertApostrophes) {
        console.log(`411`);
        // exception for a few Hawaiian words:
        if (
          ((str[to] &&
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
              str[to + 2].toLowerCase() === "u")) &&
          str.slice(from, to) !==
            (convertEntities ? "&lsquo;" : leftSingleQuote) &&
          value !== (convertEntities ? "&lsquo;" : leftSingleQuote)
        ) {
          console.log(`432 Hawaiian exceptions`);
          rangesArr.push([
            from,
            to,
            convertEntities ? "&lsquo;" : leftSingleQuote,
          ]);
          console.log(
            `439 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&lsquo;" : leftSingleQuote
            }]`
          );
        } else if (
          str.slice(from, to) !==
            (convertEntities ? "&rsquo;" : rightSingleQuote) &&
          value !== (convertEntities ? "&rsquo;" : rightSingleQuote)
        ) {
          rangesArr.push([
            from,
            to,
            convertEntities ? "&rsquo;" : rightSingleQuote,
          ]);
          console.log(
            `454 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&rsquo;" : rightSingleQuote
            }]`
          );
        }
      } else if (str.slice(from, to) !== "'" && value !== "'") {
        // not convertApostrophes - remove anything that's not apostrophe
        console.log(`461 remove fancy`);
        rangesArr.push([from, to, `'`]);
        console.log(
          `464 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "'"]`
        );
      }
    } else if (str[to] && (isLetter(str[to]) || isDigitStr(str[to]))) {
      // equivalent of /'\b/g
      // alphanumeric follows
      console.log(`470 alphanumeric follows`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&lsquo;" : leftSingleQuote) &&
        value !== (convertEntities ? "&lsquo;" : leftSingleQuote)
      ) {
        rangesArr.push([
          from,
          to,
          convertEntities ? "&lsquo;" : leftSingleQuote,
        ]);
        console.log(
          `483 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&lsquo;" : leftSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to, `'`]);
        console.log(
          `494 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
        );
      }
    } else if (isLetter(str[from - 1]) || isDigitStr(str[from - 1])) {
      // equivalent of /'\b/g
      // alphanumeric precedes
      console.log(`500 alphanumeric precedes`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rsquo;" : rightSingleQuote) &&
        value !== (convertEntities ? "&rsquo;" : rightSingleQuote)
      ) {
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rsquo;" : rightSingleQuote,
        ]);
        console.log(
          `513 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rsquo;" : rightSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to, `'`]);
        console.log(
          `524 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
        );
      }
    } else if (str[from - 1] && !str[from - 1].trim()) {
      // whitespace in front
      console.log(`529 whitespace in front clauses`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&lsquo;" : leftSingleQuote) &&
        value !== (convertEntities ? "&lsquo;" : leftSingleQuote)
      ) {
        rangesArr.push([
          from,
          to,
          convertEntities ? "&lsquo;" : leftSingleQuote,
        ]);
        console.log(
          `542 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&lsquo;" : leftSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to, `'`]);
        console.log(
          `553 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
        );
      }
    } else if (str[to] && !str[to].trim()) {
      // whitespace after
      console.log(`558 whitespace after clauses`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rsquo;" : rightSingleQuote) &&
        value !== (convertEntities ? "&rsquo;" : rightSingleQuote)
      ) {
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rsquo;" : rightSingleQuote,
        ]);
        console.log(
          `571 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rsquo;" : rightSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to, `'`]);
        console.log(
          `582 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
        );
      }
    }
    console.log(`586 fin`);
  } else if (
    [`"`, leftDoubleQuote, rightDoubleQuote, doublePrime].includes(value) ||
    (to === from + 1 &&
      [`"`, leftDoubleQuote, rightDoubleQuote, doublePrime].includes(str[from]))
  ) {
    // IF DOUBLE QUOTE (") OR OTHER TYPES OF DOUBLE QUOTES
    console.log(
      `594 ${`\u001b[${35}m${`██`}\u001b[${39}m`} double quote/apos clauses`
    );

    if (
      str[from - 1] &&
      isDigitStr(str[from - 1]) &&
      str[to] &&
      str[to] !== "'" &&
      str[to] !== '"' &&
      str[to] !== rightSingleQuote &&
      str[to] !== rightDoubleQuote &&
      str[to] !== leftSingleQuote &&
      str[to] !== leftDoubleQuote
    ) {
      // 0.
      console.log(`609 primes clauses`);
      if (
        convertApostrophes &&
        str.slice(from, to) !== (convertEntities ? "&Prime;" : doublePrime) &&
        value !== (convertEntities ? "&Prime;" : doublePrime)
      ) {
        // replace double quotes meaning inches with double prime symbol:
        rangesArr.push([from, to, convertEntities ? "&Prime;" : doublePrime]);
        console.log(
          `618 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} double prime symbol [${from}, ${to}, ${
            convertEntities ? "&Prime;" : doublePrime
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to, `"`]);
        console.log(
          `629 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    } else if (
      str[from - 1] &&
      str[to] &&
      punctuationChars.includes(str[from - 1])
    ) {
      // 1.
      console.log(
        `639 there's punctuation on the left and space/quote on the right`
      );
      if (!str[to].trim()) {
        if (
          convertApostrophes &&
          str.slice(from, to) !==
            (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
          value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)
        ) {
          rangesArr.push([
            from,
            to,
            convertEntities ? "&rdquo;" : rightDoubleQuote,
          ]);
          console.log(
            `654 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&rdquo;" : rightDoubleQuote
            }]`
          );
        } else if (
          !convertApostrophes &&
          str.slice(from, to) !== `"` &&
          value !== `"`
        ) {
          rangesArr.push([from, to, `"`]);
          console.log(
            `665 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
          );
        }
      } else if (
        str[to].charCodeAt(0) === 39 && // single quote follows
        str[to + 1] &&
        !str[to + 1].trim()
      ) {
        if (
          convertApostrophes &&
          str.slice(from, to + 1) !==
            (convertEntities
              ? "&rdquo;&rsquo;"
              : `${rightDoubleQuote}${rightSingleQuote}`) &&
          value !==
            (convertEntities
              ? "&rdquo;&rsquo;"
              : `${rightDoubleQuote}${rightSingleQuote}`)
        ) {
          console.log(
            `685 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
              to + 1
            }, ${
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
              : `${rightDoubleQuote}${rightSingleQuote}`,
          ]);
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        } else if (
          !convertApostrophes &&
          str.slice(from, to + 1) !== `"'` &&
          value !== `"'`
        ) {
          rangesArr.push([from, to + 1, `"'`]);
          console.log(
            `710 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
              to + 1
            }, "']`
          );
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        }
      }
    } else if (from === 0 && str[to] && str.slice(to).trim()) {
      // 2.
      console.log(`721 it's the beginning of a string`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&ldquo;" : leftDoubleQuote) &&
        value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)
      ) {
        rangesArr.push([
          from,
          to,
          convertEntities ? "&ldquo;" : leftDoubleQuote,
        ]);
        console.log(
          `734 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&ldquo;" : leftDoubleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to, `"`]);
        console.log(
          `745 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    } else if (!str[to] && str.slice(0, from).trim()) {
      // 3.
      console.log(`750 it's the end of a string`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
        value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)
      ) {
        console.log(
          `758 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rdquo;" : rightDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rdquo;" : rightDoubleQuote,
        ]);
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to, `"`]);
        console.log(
          `774 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    } else if (str[to] && (isLetter(str[to]) || isDigitStr(str[to]))) {
      // equivalent of /"\b/g
      // 4.
      console.log(`780 alphanumeric follows`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&ldquo;" : leftDoubleQuote) &&
        value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)
      ) {
        console.log(
          `788 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&ldquo;" : leftDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to,
          convertEntities ? "&ldquo;" : leftDoubleQuote,
        ]);
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to, `"`]);
        console.log(
          `804 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    } else if (
      str[from - 1] &&
      (isLetter(str[from - 1]) || isDigitStr(str[from - 1]))
    ) {
      // equivalent of /"\b/g
      // 5.
      console.log(`813 alphanumeric precedes`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
        value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)
      ) {
        console.log(
          `821 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rdquo;" : rightDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rdquo;" : rightDoubleQuote,
        ]);
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to, `"`]);
        console.log(
          `837 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    } else if (str[from - 1] && !str[from - 1].trim()) {
      // 6.
      console.log(`842 whitespace in front`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&ldquo;" : leftDoubleQuote) &&
        value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)
      ) {
        console.log(
          `850 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&ldquo;" : leftDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to,
          convertEntities ? "&ldquo;" : leftDoubleQuote,
        ]);
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to, `"`]);
        console.log(
          `866 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    } else if (str[to] && !str[to].trim()) {
      // 7.
      console.log(`871 whitespace follows`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
        value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)
      ) {
        console.log(
          `879 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rdquo;" : rightDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to,
          convertEntities ? "&rdquo;" : rightDoubleQuote,
        ]);
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to, `"`]);
        console.log(
          `895 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    }
  }

  console.log(
    `902 ${`\u001b[${36}m${`convertOne():`}\u001b[${39}m`} ${`\u001b[${32}m${`END`}\u001b[${39}m`}`
  );

  return rangesArr;
}

function convertAll(str, opts) {
  let ranges = [];
  const preppedOpts = {
    convertApostrophes: true,
    convertEntities: false,
    ...opts,
  };

  console.log(
    `917 CALCULATED ${`\u001b[${33}m${`preppedOpts`}\u001b[${39}m`} = ${JSON.stringify(
      preppedOpts,
      null,
      4
    )}`
  );

  // loop through the given string
  for (let i = 0, len = str.length; i < len; i++) {
    console.log(
      `${`\u001b[${36}m${`=`.repeat(50)}\u001b[${39}m`} ${JSON.stringify(
        str[i],
        null,
        0
      )} (idx ${i}) ${`\u001b[${36}m${`=`.repeat(50)}\u001b[${39}m`}`
    );
    // offset is needed to bypass characters we already fixed - it happens for
    // example with nested quotes - we'd fix many in one go and we need to skip
    // further processing, otherwise those characters would get processed
    // multiple times
    preppedOpts.from = i;
    preppedOpts.offsetBy = (idx) => {
      console.log(`939 ██ BUMP i from ${i} to ${i + idx}`);
      i += idx;
    };
    console.log(
      `943 ${`\u001b[${36}m${`convertAll():`}\u001b[${39}m`} ${`\u001b[${33}m${`preppedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        preppedOpts,
        null,
        4
      )}`
    );
    const res = convertOne(str, preppedOpts);
    if (Array.isArray(res) && res.length) {
      ranges = ranges.concat(res);
    }
  }
  console.log(`${`\u001b[${36}m${`=`.repeat(100)}\u001b[${39}m`}`);

  console.log(
    `957 ${`\u001b[${36}m${`convertAll():`}\u001b[${39}m`} FINAL ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
      ranges,
      null,
      4
    )}`
  );

  console.log(
    `965 ${`\u001b[${36}m${`convertAll():`}\u001b[${39}m`} ${`\u001b[${32}m${`END`}\u001b[${39}m`}`
  );
  console.log(" ");
  return {
    result: rangesApply(str, ranges),
    ranges,
  };
}

export { convertOne, convertAll };
