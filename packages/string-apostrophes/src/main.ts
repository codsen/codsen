import { rApply } from "ranges-apply";
import { Range, Ranges } from "../../../scripts/common";
import { version as v } from "../package.json";
const version: string = v;

interface Inputs {
  from: number;
  to?: number;
  value?: string;
  convertEntities?: boolean;
  convertApostrophes?: boolean;
  offsetBy?: (amount: number) => void;
}

function convertOne(
  str: string,
  {
    from,
    to,
    value,
    convertEntities = true,
    convertApostrophes = true,
    offsetBy,
  }: Inputs
): Ranges {
  // insurance
  // =========

  if (!Number.isInteger(from) || from < 0) {
    throw new Error(
      `string-apostrophes: [THROW_ID_01] options objects key "to", a starting string index, is wrong! It was given as ${from} (type ${typeof from})`
    );
  }

  if (!Number.isInteger(to)) {
    to = from + 1;
  }

  // consts
  // ======

  const rangesArr: Range[] = [];
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

  function isDigitStr(str2: any): boolean {
    return (
      typeof str2 === "string" &&
      str2.charCodeAt(0) >= 48 &&
      str2.charCodeAt(0) <= 57
    );
  }

  function isLetter(str2: any): boolean {
    return (
      typeof str2 === "string" &&
      !!str2.length &&
      str2.toUpperCase() !== str2.toLowerCase()
    );
  }

  console.log(
    `073 ${`\u001b[${36}m${`convertOne():`}\u001b[${39}m`} ${`\u001b[${32}m${`START`}\u001b[${39}m`}`
  );

  console.log("076 settings: ");
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
    (value &&
      [`'`, leftSingleQuote, rightSingleQuote, singlePrime].includes(value)) ||
    (to === from + 1 &&
      [`'`, leftSingleQuote, rightSingleQuote, singlePrime].includes(str[from]))
  ) {
    console.log(`126 single quote/apos clauses`);
    // IF SINGLE QUOTE OR APOSTROPHE, the '
    // OR LEFT/RIGHT SINGLE QUOTES OR SINGLE PRIME
    if (
      str[from - 1] &&
      str[to as number] &&
      isDigitStr(str[from - 1]) &&
      !isLetter(str[to as number])
    ) {
      console.log(`135 prime cases`);
      if (
        convertApostrophes &&
        str.slice(from, to) !== (convertEntities ? "&prime;" : singlePrime) &&
        value !== (convertEntities ? "&prime;" : singlePrime)
      ) {
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&prime;" : singlePrime,
        ]);
        console.log(
          `147 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} prime symbol [${from}, ${to}, ${
            convertEntities ? "&prime;" : "\u2032"
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        console.log(
          `158 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
        );
      }
    } else if (
      str[to as number] &&
      str[(to as number) + 1] &&
      str[to as number] === "n" &&
      str.slice(from, to) ===
        str.slice(
          (to as number) + 1,
          (to as number) + 1 + ((to as number) - from)
        ) // ensure quotes/apostrophes match
    ) {
      console.log(`171 rock 'n' roll case`);
      // specifically take care of 'n' as in "rock ’n’ roll"
      if (
        convertApostrophes &&
        str.slice(from, (to as number) + 2) !==
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
          (to as number) + 2,
          convertEntities
            ? "&rsquo;n&rsquo;"
            : `${rightSingleQuote}n${rightSingleQuote}`,
        ]);
        console.log(
          `192 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
            (to as number) + 2
          }, ${
            convertEntities
              ? "&rsquo;n&rsquo;"
              : `${rightSingleQuote}n${rightSingleQuote}`
          }]`
        );
        /* istanbul ignore next */
        if (typeof offsetBy === "function") {
          offsetBy(2);
        }
      } else if (
        !convertApostrophes &&
        str.slice(from, (to as number) + 2) !== "'n'" &&
        value !== "'n'"
      ) {
        rangesArr.push([from, (to as number) + 2, "'n'"]);
        console.log(
          `211 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
            (to as number) + 2
          }, "'n'"]`
        );
        /* istanbul ignore next */
        if (typeof offsetBy === "function") {
          offsetBy(2);
        }
      }

      console.log(`221 end reached`);
    } else if (
      (str[to as number] &&
        str[to as number].toLowerCase() === "t" &&
        (!str[(to as number) + 1] ||
          !str[(to as number) + 1].trim() ||
          str[(to as number) + 1].toLowerCase() === "i")) ||
      (str[to as number] &&
        str[(to as number) + 2] &&
        str[to as number].toLowerCase() === "t" &&
        str[(to as number) + 1].toLowerCase() === "w" &&
        (str[(to as number) + 2].toLowerCase() === "a" ||
          str[(to as number) + 2].toLowerCase() === "e" ||
          str[(to as number) + 2].toLowerCase() === "i" ||
          str[(to as number) + 2].toLowerCase() === "o")) ||
      (str[to as number] &&
        str[(to as number) + 1] &&
        str[to as number].toLowerCase() === "e" &&
        str[(to as number) + 1].toLowerCase() === "m") ||
      (str[to as number] &&
        str[(to as number) + 4] &&
        str[to as number].toLowerCase() === "c" &&
        str[(to as number) + 1].toLowerCase() === "a" &&
        str[(to as number) + 2].toLowerCase() === "u" &&
        str[(to as number) + 3].toLowerCase() === "s" &&
        str[(to as number) + 4].toLowerCase() === "e") ||
      (str[to as number] && isDigitStr(str[to as number]))
    ) {
      console.log(`249 'tis, 'twas, 'twere clauses`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rsquo;" : rightSingleQuote) &&
        value !== (convertEntities ? "&rsquo;" : rightSingleQuote)
      ) {
        // first, take care of 'tis, 'twas, 'twere, 'twould and so on
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&rsquo;" : rightSingleQuote,
        ]);
        console.log(
          `263 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rsquo;" : rightSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== "'" &&
        value !== "'"
      ) {
        rangesArr.push([from, to as number, "'"]);
        console.log(
          `274 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "'"]`
        );
      }
    } else if (
      str[from - 1] &&
      str[to as number] &&
      punctuationChars.includes(str[from - 1])
    ) {
      // if there's punctuation on the left and something on the right:
      console.log(
        `284 there's punctuation on the left and something on the right`
      );
      if (!str[to as number].trim()) {
        if (
          convertApostrophes &&
          str.slice(from, to) !==
            (convertEntities ? "&rsquo;" : rightSingleQuote) &&
          value !== (convertEntities ? "&rsquo;" : rightSingleQuote)
        ) {
          rangesArr.push([
            from,
            to as number,
            convertEntities ? "&rsquo;" : rightSingleQuote,
          ]);
          console.log(
            `299 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&rsquo;" : rightSingleQuote
            }]`
          );
        } else if (
          !convertApostrophes &&
          str.slice(from, to) !== "'" &&
          value !== "'"
        ) {
          rangesArr.push([from, to as number, "'"]);
          console.log(
            `310 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "'"]`
          );
        }
      } else if (
        str[to as number] === `"` && // double quote follows
        str[(to as number) + 1] &&
        !str[(to as number) + 1].trim() // and whitespace after
      ) {
        if (
          convertApostrophes &&
          str.slice(from, (to as number) + 1) !==
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
            (to as number) + 1,
            `${
              convertEntities
                ? "&rsquo;&rdquo;"
                : `${rightSingleQuote}${rightDoubleQuote}`
            }`,
          ]);
          console.log(
            `339 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
              (to as number) + 1
            }, ${
              convertEntities
                ? "&rsquo;&rdquo;"
                : `${rightSingleQuote}${rightDoubleQuote}`
            }}]`
          );
          /* istanbul ignore next */
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        } else if (
          !convertApostrophes &&
          str.slice(from, (to as number) + 1) !== `'"` &&
          value !== `'"`
        ) {
          rangesArr.push([from, (to as number) + 1, `'"`]);
          console.log(
            `358 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, '" ]`
          );
          /* istanbul ignore next */
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        }
      }
    } else if (from === 0 && str.slice(to).trim()) {
      // if it's the beginning of a string
      console.log(`368 the beginning of a string clauses`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&lsquo;" : leftSingleQuote) &&
        value !== (convertEntities ? "&lsquo;" : leftSingleQuote)
      ) {
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&lsquo;" : leftSingleQuote,
        ]);
        console.log(
          `381 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&lsquo;" : leftSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        console.log(
          `392 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ']`
        );
      }
    } else if (!str[to as number] && str.slice(0, from).trim()) {
      console.log(`396 ending of a string clauses`);
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
          to as number,
          convertEntities ? "&rsquo;" : rightSingleQuote,
        ]);
        console.log(
          `411 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rsquo;" : rightSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        console.log(
          `422 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
        );
      }
    } else if (
      str[from - 1] &&
      str[to as number] &&
      (isLetter(str[from - 1]) || isDigitStr(str[from - 1])) &&
      (isLetter(str[to as number]) || isDigitStr(str[to as number]))
    ) {
      // equivalent of /(\w)'(\w)/g
      // single quote surrounded with alphanumeric characters
      console.log(`433 single quote surrounded with alphanumeric characters`);
      if (convertApostrophes) {
        console.log(`435`);
        // exception for a few Hawaiian words:
        if (
          ((str[to as number] &&
            str[from - 5] &&
            str[from - 5].toLowerCase() === "h" &&
            str[from - 4].toLowerCase() === "a" &&
            str[from - 3].toLowerCase() === "w" &&
            str[from - 2].toLowerCase() === "a" &&
            str[from - 1].toLowerCase() === "i" &&
            str[to as number].toLowerCase() === "i") ||
            (str[from - 1] &&
              str[from - 1].toLowerCase() === "o" &&
              str[(to as number) + 2] &&
              str[to as number].toLowerCase() === "a" &&
              str[(to as number) + 1].toLowerCase() === "h" &&
              str[(to as number) + 2].toLowerCase() === "u")) &&
          str.slice(from, to) !==
            (convertEntities ? "&lsquo;" : leftSingleQuote) &&
          value !== (convertEntities ? "&lsquo;" : leftSingleQuote)
        ) {
          console.log(`456 Hawaiian exceptions`);
          rangesArr.push([
            from,
            to as number,
            convertEntities ? "&lsquo;" : leftSingleQuote,
          ]);
          console.log(
            `463 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
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
            to as number,
            convertEntities ? "&rsquo;" : rightSingleQuote,
          ]);
          console.log(
            `478 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&rsquo;" : rightSingleQuote
            }]`
          );
        }
      } else if (str.slice(from, to) !== "'" && value !== "'") {
        // not convertApostrophes - remove anything that's not apostrophe
        console.log(`485 remove fancy`);
        rangesArr.push([from, to as number, `'`]);
        console.log(
          `488 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "'"]`
        );
      }
    } else if (
      str[to as number] &&
      (isLetter(str[to as number]) || isDigitStr(str[to as number]))
    ) {
      // equivalent of /'\b/g
      // alphanumeric follows
      console.log(`497 alphanumeric follows`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&lsquo;" : leftSingleQuote) &&
        value !== (convertEntities ? "&lsquo;" : leftSingleQuote)
      ) {
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&lsquo;" : leftSingleQuote,
        ]);
        console.log(
          `510 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&lsquo;" : leftSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        console.log(
          `521 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
        );
      }
    } else if (isLetter(str[from - 1]) || isDigitStr(str[from - 1])) {
      // equivalent of /'\b/g
      // alphanumeric precedes
      console.log(`527 alphanumeric precedes`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rsquo;" : rightSingleQuote) &&
        value !== (convertEntities ? "&rsquo;" : rightSingleQuote)
      ) {
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&rsquo;" : rightSingleQuote,
        ]);
        console.log(
          `540 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rsquo;" : rightSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        console.log(
          `551 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
        );
      }
    } else if (str[from - 1] && !str[from - 1].trim()) {
      // whitespace in front
      console.log(`556 whitespace in front clauses`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&lsquo;" : leftSingleQuote) &&
        value !== (convertEntities ? "&lsquo;" : leftSingleQuote)
      ) {
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&lsquo;" : leftSingleQuote,
        ]);
        console.log(
          `569 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&lsquo;" : leftSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        console.log(
          `580 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
        );
      }
    } else if (str[to as number] && !str[to as number].trim()) {
      // whitespace after
      console.log(`585 whitespace after clauses`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rsquo;" : rightSingleQuote) &&
        value !== (convertEntities ? "&rsquo;" : rightSingleQuote)
      ) {
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&rsquo;" : rightSingleQuote,
        ]);
        console.log(
          `598 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rsquo;" : rightSingleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        console.log(
          `609 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
        );
      }
    }
    console.log(`613 fin`);
  } else if (
    [`"`, leftDoubleQuote, rightDoubleQuote, doublePrime].includes(
      value as string
    ) ||
    (to === from + 1 &&
      [`"`, leftDoubleQuote, rightDoubleQuote, doublePrime].includes(str[from]))
  ) {
    // IF DOUBLE QUOTE (") OR OTHER TYPES OF DOUBLE QUOTES
    console.log(
      `623 ${`\u001b[${35}m${`██`}\u001b[${39}m`} double quote/apos clauses`
    );

    if (
      str[from - 1] &&
      isDigitStr(str[from - 1]) &&
      str[to as number] &&
      str[to as number] !== "'" &&
      str[to as number] !== '"' &&
      str[to as number] !== rightSingleQuote &&
      str[to as number] !== rightDoubleQuote &&
      str[to as number] !== leftSingleQuote &&
      str[to as number] !== leftDoubleQuote
    ) {
      // 0.
      console.log(`638 primes clauses`);
      if (
        convertApostrophes &&
        str.slice(from, to) !== (convertEntities ? "&Prime;" : doublePrime) &&
        value !== (convertEntities ? "&Prime;" : doublePrime)
      ) {
        // replace double quotes meaning inches with double prime symbol:
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&Prime;" : doublePrime,
        ]);
        console.log(
          `651 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} double prime symbol [${from}, ${to}, ${
            convertEntities ? "&Prime;" : doublePrime
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to as number, `"`]);
        console.log(
          `662 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    } else if (
      str[from - 1] &&
      str[to as number] &&
      punctuationChars.includes(str[from - 1])
    ) {
      // 1.
      console.log(
        `672 there's punctuation on the left and space/quote on the right`
      );
      if (!str[to as number].trim()) {
        if (
          convertApostrophes &&
          str.slice(from, to) !==
            (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
          value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)
        ) {
          rangesArr.push([
            from,
            to as number,
            convertEntities ? "&rdquo;" : rightDoubleQuote,
          ]);
          console.log(
            `687 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&rdquo;" : rightDoubleQuote
            }]`
          );
        } else if (
          !convertApostrophes &&
          str.slice(from, to) !== `"` &&
          value !== `"`
        ) {
          rangesArr.push([from, to as number, `"`]);
          console.log(
            `698 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
          );
        }
      } else if (
        str[to as number] === `'` && // single quote follows
        str[(to as number) + 1] &&
        !str[(to as number) + 1].trim()
      ) {
        if (
          convertApostrophes &&
          str.slice(from, (to as number) + 1) !==
            (convertEntities
              ? "&rdquo;&rsquo;"
              : `${rightDoubleQuote}${rightSingleQuote}`) &&
          value !==
            (convertEntities
              ? "&rdquo;&rsquo;"
              : `${rightDoubleQuote}${rightSingleQuote}`)
        ) {
          console.log(
            `718 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
              (to as number) + 1
            }, ${
              convertEntities
                ? "&rdquo;&rsquo;"
                : `${rightDoubleQuote}${rightSingleQuote}`
            }]`
          );
          rangesArr.push([
            from,
            (to as number) + 1,
            convertEntities
              ? "&rdquo;&rsquo;"
              : `${rightDoubleQuote}${rightSingleQuote}`,
          ]);
          /* istanbul ignore next */
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        } else if (
          !convertApostrophes &&
          str.slice(from, (to as number) + 1) !== `"'` &&
          value !== `"'`
        ) {
          rangesArr.push([from, (to as number) + 1, `"'`]);
          console.log(
            `744 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
              (to as number) + 1
            }, "']`
          );
          /* istanbul ignore next */
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        }
      }
    } else if (from === 0 && str[to as number] && str.slice(to).trim()) {
      // 2.
      console.log(`756 it's the beginning of a string`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&ldquo;" : leftDoubleQuote) &&
        value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)
      ) {
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&ldquo;" : leftDoubleQuote,
        ]);
        console.log(
          `769 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&ldquo;" : leftDoubleQuote
          }]`
        );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to as number, `"`]);
        console.log(
          `780 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    } else if (!str[to as number] && str.slice(0, from).trim()) {
      // 3.
      console.log(`785 it's the end of a string`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
        value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)
      ) {
        console.log(
          `793 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rdquo;" : rightDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&rdquo;" : rightDoubleQuote,
        ]);
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to as number, `"`]);
        console.log(
          `809 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    } else if (
      str[to as number] &&
      (isLetter(str[to as number]) || isDigitStr(str[to as number]))
    ) {
      // equivalent of /"\b/g
      // 4.
      console.log(`818 alphanumeric follows`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&ldquo;" : leftDoubleQuote) &&
        value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)
      ) {
        console.log(
          `826 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&ldquo;" : leftDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&ldquo;" : leftDoubleQuote,
        ]);
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to as number, `"`]);
        console.log(
          `842 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    } else if (
      str[from - 1] &&
      (isLetter(str[from - 1]) || isDigitStr(str[from - 1]))
    ) {
      // equivalent of /"\b/g
      // 5.
      console.log(`851 alphanumeric precedes`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
        value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)
      ) {
        console.log(
          `859 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rdquo;" : rightDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&rdquo;" : rightDoubleQuote,
        ]);
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to as number, `"`]);
        console.log(
          `875 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    } else if (str[from - 1] && !str[from - 1].trim()) {
      // 6.
      console.log(`880 whitespace in front`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&ldquo;" : leftDoubleQuote) &&
        value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)
      ) {
        console.log(
          `888 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&ldquo;" : leftDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&ldquo;" : leftDoubleQuote,
        ]);
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to as number, `"`]);
        console.log(
          `904 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    } else if (str[to as number] && !str[to as number].trim()) {
      // 7.
      console.log(`909 whitespace follows`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
        value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)
      ) {
        console.log(
          `917 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
            convertEntities ? "&rdquo;" : rightDoubleQuote
          }]`
        );
        rangesArr.push([
          from,
          to as number,
          convertEntities ? "&rdquo;" : rightDoubleQuote,
        ]);
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to as number, `"`]);
        console.log(
          `933 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
        );
      }
    }
  }

  console.log(
    `940 ${`\u001b[${36}m${`convertOne():`}\u001b[${39}m`} ${`\u001b[${32}m${`END`}\u001b[${39}m`}`
  );

  return rangesArr;
}

/**
 * Typographically-correct the apostrophes and single/double quotes
 */
function convertAll(
  str: string,
  opts?: Inputs
): { result: string; ranges: Ranges } {
  let ranges: Range[] = [];

  const preppedOpts = {
    convertApostrophes: true,
    convertEntities: false,
    ...opts,
  };

  console.log(
    `962 CALCULATED ${`\u001b[${33}m${`preppedOpts`}\u001b[${39}m`} = ${JSON.stringify(
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
      console.log(`984 ██ BUMP i from ${i} to ${i + idx}`);
      i += idx;
    };
    console.log(
      `988 ${`\u001b[${36}m${`convertAll():`}\u001b[${39}m`} ${`\u001b[${33}m${`preppedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        preppedOpts,
        null,
        4
      )}`
    );
    const res = convertOne(str, preppedOpts as Inputs);
    if (Array.isArray(res) && res.length) {
      ranges = ranges.concat(res);
    }
  }
  console.log(`${`\u001b[${36}m${`=`.repeat(100)}\u001b[${39}m`}`);

  console.log(
    `1002 ${`\u001b[${36}m${`convertAll():`}\u001b[${39}m`} FINAL ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
      ranges,
      null,
      4
    )}`
  );

  console.log(
    `1010 ${`\u001b[${36}m${`convertAll():`}\u001b[${39}m`} ${`\u001b[${32}m${`END`}\u001b[${39}m`}`
  );
  console.log(" ");
  return {
    result: rApply(str, ranges),
    ranges,
  };
}

export { convertOne, convertAll, version };
