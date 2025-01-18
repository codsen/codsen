import { rApply } from "ranges-apply";
import { left, right } from "string-left-right";
import {
  isQuote,
  isLetter,
  rawNDash,
  rawMDash,
  isNumberChar,
  isCurrencyChar,
  isWhitespaceChar,
  isUppercaseLetter,
} from "codsen-utils";
// eslint-disable-next-line @typescript-eslint/no-redeclare
import type { Range, Ranges } from "ranges-apply";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Opts {
  from: number;
  to?: number;
  value?: string;
  convertEntities?: boolean;
  convertDashes?: boolean;
  // offsetBy increments the index of external iterator
  offsetBy?: (amount: number) => void;
}
const defaults = {
  convertEntities: false,
  convertDashes: true,
};

function convertOne(str: string, opts: Opts): Ranges {
  // opts.from is obligatory because we need to know which character(s) to fix

  // insurance
  // =========

  if (typeof str !== "string") {
    throw new Error(
      `string-dashes/convertOne(): [THROW_ID_01] first input argument should be string! It's been passed as ${str} (its typeof ${typeof str})`,
    );
  }

  if (typeof opts !== "object" || Array.isArray(opts)) {
    throw new Error(
      `string-dashes/convertOne(): [THROW_ID_02] options object should be a plain object. It has was passed as ${JSON.stringify(
        opts,
        null,
        4,
      )} (its typeof is ${typeof opts})`,
    );
  } else if (!Number.isInteger(opts.from) || opts.from < 0) {
    throw new Error(
      `string-dashes/convertOne(): [THROW_ID_03] options objects key "to", a starting string index, should be a natural number! It was given as ${
        opts.from
      } (its typeof is ${typeof opts.from})`,
    );
  } else if (opts.from >= str.length) {
    // empty string would trigger this clause, so early exit clause is not needed
    throw new Error(
      `string-dashes/convertOne(): [THROW_ID_04] opts.from is beyond str length! opts.from was passed as ${opts.from} and str.length is ${str.length}`,
    );
  }

  // operations
  // ==========

  let {
    from = 0, // needed to trick TS; this zero default is not possible, see the checks above
    to,
    value,
    convertEntities,
    convertDashes,
    offsetBy,
  } = {
    ...defaults,
    ...opts,
  } as Required<Opts>;

  if (!Number.isInteger(to)) {
    to = from + 1;
  }

  // consts
  // ======

  let rangesArr: Range[] = [];

  DEV &&
    console.log(
      `095 ${`\u001b[${36}m${`convertOne():`}\u001b[${39}m`} ${`\u001b[${32}m${`START`}\u001b[${39}m`}`,
    );

  DEV && console.log("098 settings: n/a");
  DEV &&
    console.log(
      `${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
        str,
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${JSON.stringify(
        from,
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${JSON.stringify(to, null, 4)}`,
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`value`}\u001b[${39}m`} = ${JSON.stringify(
        value,
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`convertEntities`}\u001b[${39}m`} = ${JSON.stringify(
        convertEntities,
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`convertDashes`}\u001b[${39}m`} = ${JSON.stringify(
        convertDashes,
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`offsetBy`}\u001b[${39}m`} type - ${typeof offsetBy}`,
    );
  DEV && console.log("---------------");

  if (!convertDashes) {
    DEV &&
      console.log(
        `152 opts.convertDashes = false, ${`\u001b[${32}m${`early exit`}\u001b[${39}m`}`,
      );
    return null;
  }

  // 1. N-DASH
  if (
    (value && [`-`, rawMDash].includes(value)) ||
    (to === from + 1 && [`-`, rawMDash].includes(str[from]))
  ) {
    DEV && console.log(`162 n-dash clauses`);

    if (
      // 1.1. tight dash surrounded by numbers 1880-1912
      (str[from - 1] &&
        str[to] &&
        isNumberChar(str[from - 1]) &&
        isNumberChar(str[to])) ||
      // 1.2. A-Z
      (!isLetter(str[from - 2]) &&
        !isLetter(str[to + 1]) &&
        isUppercaseLetter(str[from - 1]) &&
        isUppercaseLetter(str[to]))
    ) {
      rangesArr.push([from, to, convertEntities ? "&ndash;" : rawNDash]);
      DEV &&
        console.log(
          `179 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} n-dash symbol [${from}, ${to}, ${
            convertEntities ? "&ndash;" : rawNDash
          }]`,
        );
    }
  }

  // 2. M-DASH
  if (
    (value && [`-`, rawNDash].includes(value)) ||
    (to === from + 1 && [`-`, rawNDash].includes(str[from]))
  ) {
    DEV && console.log(`191 m-dash clauses`);

    if (
      // 2.1. whitespace-hyphen-whitespace
      str[from - 1] &&
      str[to] &&
      isWhitespaceChar(str[from - 1]) &&
      isWhitespaceChar(str[to])
    ) {
      // find out what are nearest surrounding non-whitespace characters
      let idxOnTheLeft: number | null = null;
      let idxOnTheRight: number | null = null;

      if (str[from - 2]) {
        if (str[from - 2].trim()) {
          // "cheaper" calculation
          idxOnTheLeft = from - 2;
          DEV &&
            console.log(
              `210 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`idxOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
                idxOnTheLeft,
                null,
                4,
              )}`,
            );
        } else {
          // a more "expensive" calculation
          idxOnTheLeft = left(str, from);
          DEV &&
            console.log(
              `221 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`idxOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
                idxOnTheLeft,
                null,
                4,
              )}`,
            );
        }
      }
      if (str[to + 1]) {
        if (str[to + 1].trim()) {
          // "cheaper" calculation
          idxOnTheRight = to + 1;
          DEV &&
            console.log(
              `235 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`idxOnTheRight`}\u001b[${39}m`} = ${JSON.stringify(
                idxOnTheRight,
                null,
                4,
              )}`,
            );
        } else {
          // a more "expensive" calculation
          idxOnTheRight = right(str, from);
          DEV &&
            console.log(
              `246 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`idxOnTheRight`}\u001b[${39}m`} = ${JSON.stringify(
                idxOnTheRight,
                null,
                4,
              )}`,
            );
        }
      }

      // 2.1.2
      // If it's a mathematical minus sign, use n-dash
      if (
        // 2.1.2.1
        // "1 - 2"
        (isNumberChar(str[idxOnTheLeft as number]) &&
          isNumberChar(str[idxOnTheRight as number])) ||
        // 2.1.2.2
        // "$5 - $2 = $3"
        (isNumberChar(str[idxOnTheLeft as number]) &&
          isCurrencyChar(str[idxOnTheRight as number])) ||
        // "5$ - 2$ = 3$"
        (isCurrencyChar(str[idxOnTheLeft as number]) &&
          isNumberChar(str[idxOnTheRight as number]))
      ) {
        rangesArr.push([from, to, convertEntities ? "&ndash;" : rawNDash]);
        DEV &&
          console.log(
            `273 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} n-dash symbol [${from}, ${to}, ${
              convertEntities ? "&ndash;" : rawNDash
            }]`,
          );
      }

      // 2.2.2
      // else, use m-dash
      else {
        rangesArr.push([from, to, convertEntities ? "&mdash;" : rawMDash]);
        DEV &&
          console.log(
            `285 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} m-dash symbol [${from}, ${to}, ${
              convertEntities ? "&mdash;" : rawMDash
            }]`,
          );
      }
    } else if (
      // 2.2. letter-hyphen-single quote — cut-off speech quote
      str[from - 1] &&
      isLetter(str[from - 1]) &&
      str[to] &&
      isQuote(str[to])
    ) {
      rangesArr.push([from, to, convertEntities ? "&mdash;" : rawMDash]);
      DEV &&
        console.log(
          `300 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} m-dash symbol [${from}, ${to}, ${
            convertEntities ? "&mdash;" : rawMDash
          }]`,
        );
    }
  }

  DEV &&
    console.log(
      `309 ${`\u001b[${36}m${`convertOne():`}\u001b[${39}m`} ${`\u001b[${32}m${`END`}\u001b[${39}m`}`,
    );

  return rangesArr.length ? rangesArr : null;
}

interface convertAllRes {
  result: string;
  ranges: Ranges;
}

/**
 * Typographically-correct the hyphens and dashes
 */
function convertAll(str: string, opts?: Partial<Opts>): convertAllRes {
  //
  // insurance
  // =========

  if (typeof str !== "string") {
    throw new Error(
      `string-dashes: [THROW_ID_10] first input argument should be string! It's been passed as ${str} (its typeof ${typeof str})`,
    );
  }

  if (opts && (typeof opts !== "object" || Array.isArray(opts))) {
    throw new Error(
      `string-dashes: [THROW_ID_11] options object should be a plain object! It was passed as ${JSON.stringify(
        opts,
        null,
        4,
      )} (its typeof is ${typeof opts})`,
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
      `365 CALCULATED ${`\u001b[${33}m${`preppedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        preppedOpts,
        null,
        4,
      )}`,
    );

  let len = str.length;
  // loop through the given string
  for (let i = 0; i < len; i++) {
    DEV &&
      console.log(
        `${`\u001b[${36}m${`=`.repeat(50)}\u001b[${39}m`} ${JSON.stringify(
          str[i],
          null,
          0,
        )} (idx ${i}) ${`\u001b[${36}m${`=`.repeat(50)}\u001b[${39}m`}`,
      );
    // offset is needed to bypass characters we already fixed - it happens for
    // example with nested quotes - we'd fix many in one go and we need to skip
    // further processing, otherwise those characters would get processed
    // multiple times
    preppedOpts.from = i;
    preppedOpts.offsetBy = (idx) => {
      DEV && console.log(`389 ██ BUMP i from ${i} to ${i + idx}`);
      i += idx;
    };
    DEV &&
      console.log(
        `394 ${`\u001b[${36}m${`convertAll():`}\u001b[${39}m`} ${`\u001b[${33}m${`preppedOpts`}\u001b[${39}m`} = ${JSON.stringify(
          preppedOpts,
          null,
          4,
        )}`,
      );
    let res = convertOne(str, preppedOpts as Opts);
    if (Array.isArray(res) && res.length) {
      ranges = ranges.concat(res);
    }
  }
  DEV && console.log(`${`\u001b[${36}m${`=`.repeat(100)}\u001b[${39}m`}`);

  DEV &&
    console.log(
      `409 ${`\u001b[${36}m${`convertAll():`}\u001b[${39}m`} FINAL ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
        ranges,
        null,
        4,
      )}`,
    );

  DEV &&
    console.log(
      `418 ${`\u001b[${36}m${`convertAll():`}\u001b[${39}m`} ${`\u001b[${32}m${`END`}\u001b[${39}m`}`,
    );
  DEV && console.log(" ");
  return {
    result: rApply(str, ranges),
    ranges,
  };
}

export { convertOne, convertAll, defaults, version, Range, Ranges };
