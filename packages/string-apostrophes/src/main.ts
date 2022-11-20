import { rApply } from "ranges-apply";
import type { Range, Ranges } from "ranges-apply";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Opts {
  from: number;
  to?: number;
  value?: string;
  convertEntities?: boolean;
  convertApostrophes?: boolean;
  offsetBy?: (amount: number) => void;
}
const defaults = {
  convertEntities: false,
  convertApostrophes: true,
};

function convertOne(str: string, opts: Opts): Ranges {
  // opts.from is obligatory because we need to know which character(s) to fix

  // insurance
  // =========

  if (typeof str !== "string") {
    throw new Error(
      `string-apostrophes/convertOne(): [THROW_ID_01] first input argument should be string! It's been passed as ${str} (its typeof ${typeof str})`
    );
  }

  if (typeof opts !== "object" || Array.isArray(opts)) {
    throw new Error(
      `string-apostrophes/convertOne(): [THROW_ID_02] options object should be a plain object. It has was passed as ${JSON.stringify(
        opts,
        null,
        4
      )} (its typeof is ${typeof opts})`
    );
  } else if (!Number.isInteger(opts.from) || opts.from < 0) {
    throw new Error(
      `string-apostrophes/convertOne(): [THROW_ID_03] options objects key "to", a starting string index, should be a natural number! It was given as ${
        opts.from
      } (its typeof is ${typeof opts.from})`
    );
  } else if (opts.from >= str.length) {
    // empty string would trigger this clause, so early exit clause is not needed
    throw new Error(
      `string-apostrophes/convertOne(): [THROW_ID_04] opts.from is beyond str length! opts.from was passed as ${opts.from} and str.length is ${str.length}`
    );
  }

  // operations
  // ==========

  let {
    from = 0, // needed to trick TS; this zero default is not possible, see the checks above
    to,
    value,
    convertEntities,
    convertApostrophes,
    offsetBy,
  } = {
    ...defaults,
    ...opts,
  };

  if (!Number.isInteger(to)) {
    to = from + 1;
  }

  // consts
  // ======

  let rangesArr: Range[] = [];
  let leftSingleQuote = "\u2018";
  let rightSingleQuote = "\u2019";
  let leftDoubleQuote = "\u201C";
  let rightDoubleQuote = "\u201D";
  let singlePrime = "\u2032";
  let doublePrime = "\u2033";
  let punctuationChars = [".", ",", ";", "!", "?"];
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

  DEV &&
    console.log(
      `110 ${`\u001b[${36}m${`convertOne():`}\u001b[${39}m`} ${`\u001b[${32}m${`START`}\u001b[${39}m`}`
    );

  DEV && console.log("113 settings: ");
  DEV &&
    console.log(
      `${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${JSON.stringify(
        from,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${JSON.stringify(to, null, 4)}`
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`value`}\u001b[${39}m`} = ${JSON.stringify(
        value,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`convertEntities`}\u001b[${39}m`} = ${JSON.stringify(
        convertEntities,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`convertApostrophes`}\u001b[${39}m`} = ${JSON.stringify(
        convertApostrophes,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`offsetBy`}\u001b[${39}m`} type - ${typeof offsetBy}`
    );
  DEV && console.log("---------------");

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
    DEV && console.log(`174 single quote/apos clauses`);
    // IF SINGLE QUOTE OR APOSTROPHE, the '
    // OR LEFT/RIGHT SINGLE QUOTES OR SINGLE PRIME
    if (
      str[from - 1] &&
      str[to as number] &&
      isDigitStr(str[from - 1]) &&
      !isLetter(str[to as number])
    ) {
      DEV && console.log(`183 prime cases`);
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
        DEV &&
          console.log(
            `196 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} prime symbol [${from}, ${to}, ${
              convertEntities ? "&prime;" : "\u2032"
            }]`
          );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        DEV &&
          console.log(
            `208 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
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
      DEV && console.log(`221 rock 'n' roll case`);
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
        DEV &&
          console.log(
            `243 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
              (to as number) + 2
            }, ${
              convertEntities
                ? "&rsquo;n&rsquo;"
                : `${rightSingleQuote}n${rightSingleQuote}`
            }]`
          );
        /* c8 ignore next */
        if (typeof offsetBy === "function") {
          offsetBy(2);
        }
      } else if (
        !convertApostrophes &&
        str.slice(from, (to as number) + 2) !== "'n'" &&
        value !== "'n'"
      ) {
        rangesArr.push([from, (to as number) + 2, "'n'"]);
        DEV &&
          console.log(
            `263 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
              (to as number) + 2
            }, "'n'"]`
          );
        /* c8 ignore next */
        if (typeof offsetBy === "function") {
          offsetBy(2);
        }
      }

      DEV && console.log(`273 end reached`);
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
      DEV && console.log(`301 'tis, 'twas, 'twere clauses`);
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
        DEV &&
          console.log(
            `316 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&rsquo;" : rightSingleQuote
            }]`
          );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== "'" &&
        value !== "'"
      ) {
        rangesArr.push([from, to as number, "'"]);
        DEV &&
          console.log(
            `328 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "'"]`
          );
      }
    } else if (
      str[from - 1] &&
      str[to as number] &&
      punctuationChars.includes(str[from - 1])
    ) {
      // if there's punctuation on the left and something on the right:
      DEV &&
        console.log(
          `339 there's punctuation on the left and something on the right`
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
          DEV &&
            console.log(
              `355 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
                convertEntities ? "&rsquo;" : rightSingleQuote
              }]`
            );
        } else if (
          !convertApostrophes &&
          str.slice(from, to) !== "'" &&
          value !== "'"
        ) {
          rangesArr.push([from, to as number, "'"]);
          DEV &&
            console.log(
              `367 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "'"]`
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
          DEV &&
            console.log(
              `397 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
                (to as number) + 1
              }, ${
                convertEntities
                  ? "&rsquo;&rdquo;"
                  : `${rightSingleQuote}${rightDoubleQuote}`
              }}]`
            );
          /* c8 ignore next */
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        } else if (
          !convertApostrophes &&
          str.slice(from, (to as number) + 1) !== `'"` &&
          value !== `'"`
        ) {
          rangesArr.push([from, (to as number) + 1, `'"`]);
          DEV &&
            console.log(
              `417 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, '" ]`
            );
          /* c8 ignore next */
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        }
      }
    } else if (from === 0 && str.slice(to).trim()) {
      // if it's the beginning of a string
      DEV && console.log(`427 the beginning of a string clauses`);
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
        DEV &&
          console.log(
            `441 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&lsquo;" : leftSingleQuote
            }]`
          );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        DEV &&
          console.log(
            `453 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ']`
          );
      }
    } else if (!str[to as number] && str.slice(0, from).trim()) {
      DEV && console.log(`457 ending of a string clauses`);
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
        DEV &&
          console.log(
            `473 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&rsquo;" : rightSingleQuote
            }]`
          );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        DEV &&
          console.log(
            `485 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
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
      DEV &&
        console.log(`497 single quote surrounded with alphanumeric characters`);
      if (convertApostrophes) {
        DEV && console.log(`499`);
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
          DEV && console.log(`520 Hawaiian exceptions`);
          rangesArr.push([
            from,
            to as number,
            convertEntities ? "&lsquo;" : leftSingleQuote,
          ]);
          DEV &&
            console.log(
              `528 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
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
          DEV &&
            console.log(
              `544 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
                convertEntities ? "&rsquo;" : rightSingleQuote
              }]`
            );
        }
      } else if (str.slice(from, to) !== "'" && value !== "'") {
        // not convertApostrophes - remove anything that's not apostrophe
        DEV && console.log(`551 remove fancy`);
        rangesArr.push([from, to as number, `'`]);
        DEV &&
          console.log(
            `555 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "'"]`
          );
      }
    } else if (
      str[to as number] &&
      (isLetter(str[to as number]) || isDigitStr(str[to as number]))
    ) {
      // equivalent of /'\b/g
      // alphanumeric follows
      DEV && console.log(`564 alphanumeric follows`);
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
        DEV &&
          console.log(
            `578 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&lsquo;" : leftSingleQuote
            }]`
          );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        DEV &&
          console.log(
            `590 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
          );
      }
    } else if (isLetter(str[from - 1]) || isDigitStr(str[from - 1])) {
      // equivalent of /'\b/g
      // alphanumeric precedes
      DEV && console.log(`596 alphanumeric precedes`);
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
        DEV &&
          console.log(
            `610 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&rsquo;" : rightSingleQuote
            }]`
          );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        DEV &&
          console.log(
            `622 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
          );
      }
    } else if (str[from - 1] && !str[from - 1].trim()) {
      // whitespace in front
      DEV && console.log(`627 whitespace in front clauses`);
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
        DEV &&
          console.log(
            `641 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&lsquo;" : leftSingleQuote
            }]`
          );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        DEV &&
          console.log(
            `653 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
          );
      }
    } else if (str[to as number] && !str[to as number].trim()) {
      // whitespace after
      DEV && console.log(`658 whitespace after clauses`);
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
        DEV &&
          console.log(
            `672 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&rsquo;" : rightSingleQuote
            }]`
          );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `'` &&
        value !== `'`
      ) {
        rangesArr.push([from, to as number, `'`]);
        DEV &&
          console.log(
            `684 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} a plain apostrophe [${from}, ${to}, ']`
          );
      }
    }
    DEV && console.log(`688 fin`);
  } else if (
    [`"`, leftDoubleQuote, rightDoubleQuote, doublePrime].includes(
      value as string
    ) ||
    (to === from + 1 &&
      [`"`, leftDoubleQuote, rightDoubleQuote, doublePrime].includes(str[from]))
  ) {
    // IF DOUBLE QUOTE (") OR OTHER TYPES OF DOUBLE QUOTES
    DEV &&
      console.log(
        `699 ${`\u001b[${35}m${`██`}\u001b[${39}m`} double quote/apos clauses`
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
      DEV && console.log(`714 primes clauses`);
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
        DEV &&
          console.log(
            `728 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} double prime symbol [${from}, ${to}, ${
              convertEntities ? "&Prime;" : doublePrime
            }]`
          );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to as number, `"`]);
        DEV &&
          console.log(
            `740 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
          );
      }
    } else if (
      str[from - 1] &&
      str[to as number] &&
      punctuationChars.includes(str[from - 1])
    ) {
      // 1.
      DEV &&
        console.log(
          `751 there's punctuation on the left and space/quote on the right`
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
          DEV &&
            console.log(
              `767 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
                convertEntities ? "&rdquo;" : rightDoubleQuote
              }]`
            );
        } else if (
          !convertApostrophes &&
          str.slice(from, to) !== `"` &&
          value !== `"`
        ) {
          rangesArr.push([from, to as number, `"`]);
          DEV &&
            console.log(
              `779 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
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
          DEV &&
            console.log(
              `800 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
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
          /* c8 ignore next */
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        } else if (
          !convertApostrophes &&
          str.slice(from, (to as number) + 1) !== `"'` &&
          value !== `"'`
        ) {
          rangesArr.push([from, (to as number) + 1, `"'`]);
          DEV &&
            console.log(
              `827 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${
                (to as number) + 1
              }, "']`
            );
          /* c8 ignore next */
          if (typeof offsetBy === "function") {
            offsetBy(1);
          }
        }
      }
    } else if (from === 0 && str[to as number] && str.slice(to).trim()) {
      // 2.
      DEV && console.log(`839 it's the beginning of a string`);
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
        DEV &&
          console.log(
            `853 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
              convertEntities ? "&ldquo;" : leftDoubleQuote
            }]`
          );
      } else if (
        !convertApostrophes &&
        str.slice(from, to) !== `"` &&
        value !== `"`
      ) {
        rangesArr.push([from, to as number, `"`]);
        DEV &&
          console.log(
            `865 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
          );
      }
    } else if (!str[to as number] && str.slice(0, from).trim()) {
      // 3.
      DEV && console.log(`870 it's the end of a string`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
        value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)
      ) {
        DEV &&
          console.log(
            `879 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
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
        DEV &&
          console.log(
            `896 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
          );
      }
    } else if (
      str[to as number] &&
      (isLetter(str[to as number]) || isDigitStr(str[to as number]))
    ) {
      // equivalent of /"\b/g
      // 4.
      DEV && console.log(`905 alphanumeric follows`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&ldquo;" : leftDoubleQuote) &&
        value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)
      ) {
        DEV &&
          console.log(
            `914 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
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
        DEV &&
          console.log(
            `931 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
          );
      }
    } else if (
      str[from - 1] &&
      (isLetter(str[from - 1]) || isDigitStr(str[from - 1]))
    ) {
      // equivalent of /"\b/g
      // 5.
      DEV && console.log(`940 alphanumeric precedes`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
        value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)
      ) {
        DEV &&
          console.log(
            `949 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
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
        DEV &&
          console.log(
            `966 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
          );
      }
    } else if (str[from - 1] && !str[from - 1].trim()) {
      // 6.
      DEV && console.log(`971 whitespace in front`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&ldquo;" : leftDoubleQuote) &&
        value !== (convertEntities ? "&ldquo;" : leftDoubleQuote)
      ) {
        DEV &&
          console.log(
            `980 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
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
        DEV &&
          console.log(
            `997 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
          );
      }
    } else if (str[to as number] && !str[to as number].trim()) {
      // 7.
      DEV && console.log(`1002 whitespace follows`);
      if (
        convertApostrophes &&
        str.slice(from, to) !==
          (convertEntities ? "&rdquo;" : rightDoubleQuote) &&
        value !== (convertEntities ? "&rdquo;" : rightDoubleQuote)
      ) {
        DEV &&
          console.log(
            `1011 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, ${
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
        DEV &&
          console.log(
            `1028 string-apostrophes - ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${from}, ${to}, "]`
          );
      }
    }
  }

  DEV &&
    console.log(
      `1036 ${`\u001b[${36}m${`convertOne():`}\u001b[${39}m`} ${`\u001b[${32}m${`END`}\u001b[${39}m`}`
    );

  return rangesArr;
}

interface convertAllRes {
  result: string;
  ranges: Ranges;
}

/**
 * Typographically-correct the apostrophes and single/double quotes
 */
function convertAll(str: string, opts?: Partial<Opts>): convertAllRes {
  //
  // insurance
  // =========

  if (typeof str !== "string") {
    throw new Error(
      `string-apostrophes: [THROW_ID_10] first input argument should be string! It's been passed as ${str} (its typeof ${typeof str})`
    );
  }

  if (opts && (typeof opts !== "object" || Array.isArray(opts))) {
    throw new Error(
      `string-apostrophes: [THROW_ID_11] options object should be a plain object! It was passed as ${JSON.stringify(
        opts,
        null,
        4
      )} (its typeof is ${typeof opts})`
    );
  }

  // early exit
  if (!str) {
    return {
      result: str,
      ranges: null,
    };
  }

  // operations
  // ==========

  let ranges: Range[] = [];

  // opts.from is not obligatory because we loop through everything
  let preppedOpts = {
    ...defaults,
    ...opts,
  };

  DEV &&
    console.log(
      `1092 CALCULATED ${`\u001b[${33}m${`preppedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        preppedOpts,
        null,
        4
      )}`
    );

  let len = str.length;
  // loop through the given string
  for (let i = 0; i < len; i++) {
    DEV &&
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
      DEV && console.log(`1116 ██ BUMP i from ${i} to ${i + idx}`);
      i += idx;
    };
    DEV &&
      console.log(
        `1121 ${`\u001b[${36}m${`convertAll():`}\u001b[${39}m`} ${`\u001b[${33}m${`preppedOpts`}\u001b[${39}m`} = ${JSON.stringify(
          preppedOpts,
          null,
          4
        )}`
      );
    let res = convertOne(str, preppedOpts as Opts);
    if (Array.isArray(res) && res.length) {
      ranges = ranges.concat(res);
    }
  }
  DEV && console.log(`${`\u001b[${36}m${`=`.repeat(100)}\u001b[${39}m`}`);

  DEV &&
    console.log(
      `1136 ${`\u001b[${36}m${`convertAll():`}\u001b[${39}m`} FINAL ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
        ranges,
        null,
        4
      )}`
    );

  DEV &&
    console.log(
      `1145 ${`\u001b[${36}m${`convertAll():`}\u001b[${39}m`} ${`\u001b[${32}m${`END`}\u001b[${39}m`}`
    );
  DEV && console.log(" ");
  return {
    result: rApply(str, ranges),
    ranges,
  };
}

export { convertOne, convertAll, defaults, version, Range, Ranges };
