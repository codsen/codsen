import { version as v } from "../package.json";
import { left, right } from "string-left-right";
import deburr from "lodash.deburr";

const version: string = v;
declare let DEV: boolean;

// Taken from an empirical data, as measured Outfit font on the UI.
// Only the ratios between the numbers matter.
// For example, "A: 14266" means ten letters A on my sidebar are
// 142.66px wide
const letterWidths: Record<string, number> = {
  // Latin
  A: 142.66,
  a: 131.48,
  B: 137.23,
  b: 131.48,
  C: 148.8,
  c: 117.33,
  D: 153.61,
  d: 131.48,
  E: 132.61,
  e: 125.05,
  F: 129.25,
  f: 102.34,
  G: 158.98,
  g: 131.06,
  H: 148.84,
  h: 126.73,
  I: 86.13,
  i: 81.38,
  J: 113.27,
  j: 90.14,
  K: 140.98,
  k: 119.73,
  L: 127.28,
  l: 81.09,
  M: 167.47,
  m: 169.7,
  N: 149.41,
  n: 126.73,
  O: 161.92,
  o: 129.25,
  P: 133.84,
  p: 131.48,
  Q: 164.39,
  q: 131.63,
  R: 136.44,
  r: 106.66,
  S: 125.44,
  s: 109.78,
  T: 131.84,
  t: 99.27,
  U: 145.63,
  u: 122.25,
  V: 142.05,
  v: 119.28,
  W: 183.81,
  w: 152.23,
  X: 140.95,
  x: 117.3,
  Y: 137.81,
  y: 119.7,
  Z: 128.09,
  z: 112.59,
  // Russian alphabet
  А: 144.95,
  а: 127.88,
  Б: 142.7,
  б: 127.88,
  В: 143.39,
  в: 126.7,
  Г: 122.67,
  г: 106.41,
  Д: 148.17,
  д: 134.84,
  Е: 143.39,
  е: 127.88,
  Ё: 143.39,
  ё: 127.88,
  Ж: 188.91,
  ж: 159.17,
  З: 143.25,
  з: 120.0,
  И: 151.11,
  и: 131.7,
  Й: 151.11,
  й: 131.7,
  К: 143.39,
  к: 126.7,
  Л: 146.13,
  л: 130.39,
  М: 166.63,
  м: 143.25,
  Н: 151.11,
  н: 127.88,
  О: 158.91,
  о: 127.88,
  П: 151.11,
  п: 127.88,
  Р: 143.39,
  р: 127.88,
  С: 151.11,
  с: 120.0,
  Т: 135.53,
  т: 120.0,
  У: 143.39,
  у: 120.0,
  Ф: 169.77,
  ф: 166.48,
  Х: 143.39,
  х: 120.0,
  Ц: 152.48,
  ц: 129.92,
  Ч: 141.2,
  ч: 125.34,
  Ш: 182.14,
  ш: 158.91,
  Щ: 183.52,
  щ: 160.95,
  Ъ: 166.63,
  ъ: 135.53,
  Ы: 173.13,
  ы: 151.11,
  Ь: 141.2,
  ь: 119.94,
  Э: 151.11,
  э: 121.38,
  Ю: 190.0,
  ю: 158.91,
  Я: 150.02,
  я: 128.14,
  // Other Slavic letters
  Ѐ: 144.95,
  ѐ: 129.17,
  Ђ: 156.58,
  ђ: 127.88,
  Ѓ: 122.67,
  ѓ: 106.41,
  Є: 151.11,
  є: 120.0,
  Ѕ: 143.39,
  ѕ: 120.0,
  І: 88.91,
  і: 81.11,
  Ї: 88.91,
  ї: 85.22,
  Ј: 120.0,
  ј: 81.11,
  Љ: 190.0,
  љ: 168.34,
  Њ: 187.89,
  њ: 163.48,
  Ћ: 158.91,
  ћ: 127.88,
  Ќ: 143.39,
  ќ: 126.7,
  Ѝ: 152.75,
  ѝ: 129.17,
  Ў: 143.39,
  ў: 120.0,
  Џ: 151.11,
  џ: 127.88,
  Đ: 151.11,
  đ: 127.88,
  // Hebrew
  א: 140.31,
  ב: 128.83,
  ג: 109.83,
  ד: 120.14,
  ה: 149.67,
  ו: 94.78,
  ז: 97.66,
  ח: 149.67,
  ט: 140.17,
  י: 94.44,
  ך: 123.91,
  כ: 130.06,
  ל: 124.66,
  מ: 146.88,
  ם: 148.11,
  ן: 93.63,
  נ: 107.84,
  ס: 143.05,
  ע: 134.09,
  ף: 123.36,
  פ: 130.13,
  ץ: 118.03,
  צ: 130.47,
  ק: 143.25,
  ר: 121.38,
  ש: 150.3,
  ת: 147.14,
  // Punctuation
  "&": 142.27,
  "-": 114.55,
  "'": 83.19,
  "!": 86.55,
  "?": 120.7,
  "\x60": 89.34,
  '"': 106.0,
  _: 120.7,
  "*": 118.61,
  "(": 92.42,
  ")": 92.28,
  "{": 95.23,
  "}": 95.23,
  "[": 97.33,
  "]": 97.33,
  "+": 125.89,
  "=": 125.89,
  "^": 113.42,
  "%": 142.41,
  "#": 139.61,
  "/": 104.61,
  "\\": 104.61,
  "|": 88.92,
  ",": 88.5,
  ".": 90.61,
  ";": 87.67,
  "\u2026": 155.0,
  " ": 79.2,
};

export interface Opts {
  maxLen: number;
  maxLines: number;
  ellipsisLen?: number;
  monospace: boolean;
  noEmpty: boolean;
  letterWidths: Record<string, number>;
}

const defaults: Opts = {
  maxLen: 10,
  maxLines: 2,
  ellipsisLen: undefined,
  monospace: false,
  noEmpty: true,
  letterWidths,
};

export interface Res {
  result: string;
  addEllipsis: boolean;
}

function truncate(str: string, opts?: Partial<Opts>): Res {
  let DASHES = `-–—`;
  DEV && console.log(`-----`);
  DEV &&
    console.log(
      `253 incoming ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  // Two equals will match both null and undefined
  // That's existy() from the Functional JavaScript by Fogus
  if (str == null) {
    throw new Error("string-truncator: [THROW_ID_01] The input is missing!");
  }
  if (typeof str !== "string") {
    throw new Error(
      `string-truncator: [THROW_ID_02] The input is not a string! It's: ${typeof str}`
    );
  }

  let resolvedOpts: Opts = { ...defaults, ...opts };
  // DEV &&
  //   console.log(
  //     `278 ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`}: ${JSON.stringify(
  //       resolvedOpts,
  //       null,
  //       4
  //     )}`
  //   );

  if (resolvedOpts.noEmpty && !str.trim().length) {
    throw new Error(
      `string-truncator: [THROW_ID_03] The input string is empty!`
    );
  }

  if (typeof resolvedOpts.maxLen !== "number") {
    throw new Error(
      `string-truncator: [THROW_ID_04] opts.maxLen must be a number! It was given: ${JSON.stringify(
        resolvedOpts.maxLen,
        null,
        4
      )} (typeof is ${typeof resolvedOpts.maxLen})`
    );
  }

  if (typeof resolvedOpts.maxLines !== "number") {
    throw new Error(
      `string-truncator: [THROW_ID_05] opts.maxLines must be a number! It was given: ${JSON.stringify(
        resolvedOpts.maxLines,
        null,
        4
      )} (typeof is ${typeof resolvedOpts.maxLines})`
    );
  }

  if (resolvedOpts.maxLines === 0) {
    throw new Error(
      `string-truncator: [THROW_ID_06] opts.maxLines must not be a zero! It was set to zero.`
    );
  }

  let len = str.length;

  let average = (...args: number[]) =>
    args.reduce((a, b) => a + b) / args.length;

  let maxLetterLen = 1;
  let minLetterLen = 1;
  let averageLetterLen = 1;
  if (
    typeof resolvedOpts === "object" &&
    typeof resolvedOpts.letterWidths === "object"
  ) {
    maxLetterLen = Math.max(...Object.values(resolvedOpts.letterWidths));
    minLetterLen = Math.min(...Object.values(resolvedOpts.letterWidths));
    averageLetterLen = Math.floor(
      average(...Object.values(resolvedOpts.letterWidths))
    );
  }

  DEV &&
    console.log(
      `333 ${`\u001b[${33}m${`maxLetterLen`}\u001b[${39}m`} = ${JSON.stringify(
        maxLetterLen,
        null,
        4
      )} (${Object.keys(resolvedOpts.letterWidths).filter(
        (k) => resolvedOpts.letterWidths[k] === maxLetterLen
      )}); ${`\u001b[${33}m${`minLetterLen`}\u001b[${39}m`} = ${JSON.stringify(
        minLetterLen,
        null,
        4
      )} (${Object.keys(resolvedOpts.letterWidths).filter(
        (k) => resolvedOpts.letterWidths[k] === minLetterLen
      )})`
    );

  let maxLength = maxLetterLen * resolvedOpts.maxLen;
  DEV &&
    console.log(
      `351 ${`\u001b[${33}m${`maxLength`}\u001b[${39}m`} = ${JSON.stringify(
        maxLength,
        null,
        4
      )}`
    );

  let separatorLength =
    resolvedOpts.ellipsisLen ||
    resolvedOpts.letterWidths["…"] ||
    averageLetterLen;

  // -----------------------------------------------------------------------------

  let totalLinesSoFar = 1;

  // -----------------------------------------------------------------------------

  // accumulate the line length so far:
  let totalLengthSoFar = 0;
  // for example,
  // string: "the quick fox", maxLen: 10, maxLines: 1
  //          ^^^^^^^^^^^
  //                    |
  //            we'd sum up to here, until we make line breaking decision

  // -----------------------------------------------------------------------------

  // accumulate the length since the last suitable breakpoint:
  let lengthSinceTheLastSuitableBreakpoint = 0;
  // for example, reusing same situation above,
  // string: "the quick fox", maxLen: 10, maxLines: 1
  //                    ^
  //                    |
  //            if we've currently reached "f", value would be 1
  //            because the space in front was a suitable breakpoint

  // -----------------------------------------------------------------------------

  // Makes a record of the index, suitable for a breakpoint.
  // Imagine a string: "quick brown fox".
  // Let's say maxLen === 8, maxLines === 1.

  // Typically, algorithm would traverse the string, make a note of
  // the last dash or space,

  // quick brown fox
  //      ^
  //     make a note, that's a breakpoint

  // then continue onto a next word,

  // quick brown fox
  //        ^
  //      reach here

  // then find out that maxLen (8) was reached, then use this last breakpoint,
  // depending on opts.maxLines to either
  //   1) truncate the string right here in the middle, adding ellipsis
  //   2) or, reset the widths counting to start from that last breakpoint

  // We're not interested in the last suitable breakpoint's string index position,
  // but rather the calculated length leading up to it, because in case 2),
  // we'll need to reset the line length by subtracting this number.

  let theLastSuitableBreakpoint = { width: 0, index: 0 };

  // -----------------------------------------------------------------------------

  function slice(i: number) {
    let cutoffIdx = (left(str, i) as number) + 1;
    // prevent cases like:
    // "the quick brown fox"
    //             ^
    //          chop here, resulting in a single
    //          trailing letter: "the·quick·b"
    //
    if (str[i - 2] && !str[i - 2].trim().length) {
      cutoffIdx -= 2;
    }
    return str.slice(0, cutoffIdx);
  }

  function isSuitableBreakingPoint(i: number) {
    return (
      // potential break point upon the dash
      DASHES.includes(str[i]) ||
      // also, on any whitespace, but only if it's not followed a dash
      (!str[i].trim() &&
        !DASHES.includes(str[right(str, i) as number]) &&
        !DASHES.includes(str[left(str, i) as number]))
    );
  }

  // -----------------------------------------------------------------------------

  for (let i = 0; i < len; i++) {
    //
    //
    //
    //
    //                    TOP
    //
    //
    //
    //

    // Logging:
    // ███████████████████████████████████████
    DEV &&
      console.log(
        `\n\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
          str[i]?.trim() ? str[i] : JSON.stringify(str[i], null, 0)
        }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
      );

    //
    //
    //
    //
    //                    MIDDLE
    //
    //
    //
    //

    // Increment the totalLengthSoFar:
    // ███████████████████████████████████████
    if (
      !resolvedOpts.monospace &&
      resolvedOpts.letterWidths &&
      resolvedOpts.letterWidths[deburr(str[i])]
    ) {
      // 1. add to total
      DEV &&
        console.log(
          `487 reference letter length ${`\u001b[${32}m${`found`}\u001b[${39}m`}: ${`\u001b[${36}m${
            resolvedOpts.letterWidths[deburr(str[i])]
          }\u001b[${39}m`}`
        );
      totalLengthSoFar += resolvedOpts.letterWidths[deburr(str[i])];
      DEV &&
        console.log(
          `494 ${`\u001b[${32}m${`INCREASE`}\u001b[${39}m`} ${`\u001b[${33}m${`totalLengthSoFar`}\u001b[${39}m`} now = ${totalLengthSoFar} / ${maxLength}`
        );

      // 2. add the current-one since breakpoint
      if (str[i]?.trim().length) {
        lengthSinceTheLastSuitableBreakpoint += (resolvedOpts as any)
          .letterWidths[deburr(str[i])];
        DEV &&
          console.log(
            `503 ${`\u001b[${32}m${`INCREASE`}\u001b[${39}m`} ${`\u001b[${33}m${`lengthSinceTheLastSuitableBreakpoint`}\u001b[${39}m`} now = ${lengthSinceTheLastSuitableBreakpoint}`
          );
      }
    } else {
      DEV && console.log(`507 using maxLetterLen`);
      // 1. add to total
      totalLengthSoFar += maxLetterLen;
      DEV &&
        console.log(
          `512 ${`\u001b[${32}m${`INCREASE`}\u001b[${39}m`} totalLengthSoFar by maxLength ${`\u001b[${33}m${`totalLengthSoFar`}\u001b[${39}m`} now = ${totalLengthSoFar} / ${maxLength}`
        );
      // 2. add the current-one since breakpoint
      if (str[i]?.trim().length) {
        lengthSinceTheLastSuitableBreakpoint += maxLetterLen;
        DEV &&
          console.log(
            `519 ${`\u001b[${32}m${`INCREASE`}\u001b[${39}m`} ${`\u001b[${33}m${`lengthSinceTheLastSuitableBreakpoint`}\u001b[${39}m`} now = ${lengthSinceTheLastSuitableBreakpoint}`
          );
      }
    }

    // Check the length limit:
    // ███████████████████████████████████████

    if (totalLengthSoFar + separatorLength > maxLength) {
      DEV &&
        console.log(
          `530 ${`\u001b[${31}m${`LIMIT REACHED`}\u001b[${39}m`} (totalLengthSoFar + separatorLength)=${
            totalLengthSoFar + separatorLength
          } > maxLength=${maxLength}`
        );

      // make a decision, do we truncate or have we just detected a breakpoint
      // (theLastSuitableBreakpoint)
      if (totalLinesSoFar < resolvedOpts.maxLines) {
        DEV &&
          console.log(
            `540 ${`\u001b[${32}m${`within maxLines`}\u001b[${39}m`}`
          );

        // if it's one long string which is overflowing,
        // maxLines don't matter, we need to chop it right here
        if (
          lengthSinceTheLastSuitableBreakpoint + separatorLength >
          maxLength
        ) {
          DEV &&
            console.log(
              `551 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} result: ${`\u001b[${35}m${`str.slice(0, ${theLastSuitableBreakpoint.index})`}\u001b[${39}m`}`
            );
          return {
            result: slice(i),
            addEllipsis: true,
          };
        } else {
          totalLinesSoFar++;
          DEV &&
            console.log(
              `561 ${`\u001b[${36}m${`██`}\u001b[${39}m`} ${`\u001b[${32}m${`INCREASE`}\u001b[${39}m`} ${`\u001b[${33}m${`totalLinesSoFar`}\u001b[${39}m`} = ${JSON.stringify(
                totalLinesSoFar,
                null,
                4
              )}`
            );
          totalLengthSoFar = isSuitableBreakingPoint(i)
            ? 0
            : lengthSinceTheLastSuitableBreakpoint;
          DEV &&
            console.log(
              `572 ${`\u001b[${36}m${`██`}\u001b[${39}m`} ${`\u001b[${32}m${`CORRECTION`}\u001b[${39}m`} ${`\u001b[${33}m${`totalLengthSoFar`}\u001b[${39}m`} now = ${JSON.stringify(
                totalLengthSoFar,
                null,
                4
              )}`
            );
        }
      } else {
        DEV &&
          console.log(
            `582 ${`\u001b[${31}m${`maxLines limit reached!`}\u001b[${39}m`}`
          );
        DEV &&
          console.log(`585 result: ${`\u001b[${35}m${slice(i)}\u001b[${39}m`}`);
        return {
          result: slice(i), // slice() used to DRY further corrections
          addEllipsis: true,
        };
      }
    }

    //
    //
    //
    //
    //                    BOTTOM
    //
    //
    //
    //

    // Set theLastSuitableBreakpoint
    // ███████████████████████████████████████
    if (isSuitableBreakingPoint(i)) {
      theLastSuitableBreakpoint.width = totalLengthSoFar;
      theLastSuitableBreakpoint.index = i;
      lengthSinceTheLastSuitableBreakpoint = 0;
      DEV &&
        console.log(
          `611 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`theLastSuitableBreakpoint`}\u001b[${39}m`} = ${JSON.stringify(
            theLastSuitableBreakpoint,
            null,
            4
          )};  ${`\u001b[${33}m${`lengthSinceTheLastSuitableBreakpoint`}\u001b[${39}m`} = ${lengthSinceTheLastSuitableBreakpoint}`
        );
    }

    // Logging
    // ███████████████████████████████████████
    DEV && console.log(`${`\u001b[${90}m${`██`}\u001b[${39}m`}`);
    DEV &&
      console.log(
        `${`\u001b[${90}m${`maxLength: ${maxLength} - totalLengthSoFar: ${totalLengthSoFar} - theLastSuitableBreakpoint: ${JSON.stringify(
          theLastSuitableBreakpoint,
          null,
          0
        )} - lengthSinceTheLastSuitableBreakpoint: ${lengthSinceTheLastSuitableBreakpoint} - totalLinesSoFar: ${totalLinesSoFar}`}\u001b[${39}m`}`
      );
  }

  return {
    result: str,
    addEllipsis: totalLengthSoFar > maxLength,
  };
}

export { truncate, defaults, version };
