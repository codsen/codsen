declare let DEV: boolean;

export interface ExtractNumPosRes {
  from: number;
  to: number;
  extracted: string;
}

/**
 * Takes test description string argument, for example "10 - a"
 * and extracts "10", in this case reporting position:
 * { from: 0 + offset, to: 2 + offset }
 *
 * @param val input string
 * @param offset for adjusting indexes to actual parent node positions
 * @returns
 */
export function extractNumPos(
  val: string,
  offset: number,
): ExtractNumPosRes | null {
  // early exit
  if (typeof val !== "string" || !val.trim()) {
    return null;
  }

  let digitsChunkStartsAt = null;
  let lastDigitAt: number | null = null;

  // beware we traverse upto and including val.length, last index,
  // the val[i] will be undefined!
  for (let i = 0, len = val.length; i <= len; i++) {
    DEV &&
      console.log(
        `035 extract-num-positions(): ${`\u001b[${36}m${`======================== str[${i}]= ${`\u001b[${35}m${
          val[i]?.trim() ? val[i] : JSON.stringify(val[i], null, 4)
        }\u001b[${39}m`} ========================`}\u001b[${39}m`}`,
      );

    // catch the end of the digit chunk
    // -------------------------------------------------------------------------
    if (
      // if chunk has been recorded as already started
      digitsChunkStartsAt !== null &&
      typeof lastDigitAt === "number" &&
      // and
      // a) it's whitespace
      (!val[i]?.trim() ||
        //
        // OR
        //
        // b) it's not whitespace, but
        // it's not a number
        (!/\d/.test(val[i]) &&
          // and it's not a dot or hyphen
          !["."].includes(val[i])) ||
        //
        // OR
        //
        // c) we reached the end (we traverse up to and including str.length,
        // which is "undefined" character; notice i <= len in the loop above,
        // normally it would be i < len)
        !val[i])
    ) {
      // DEV &&
      //   console.log(
      //     `071 prep(): ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}: "${JSON.stringify(
      //       {
      //         start: opts.offset + digitsChunkStartsAt,
      //         end: opts.offset + lastDigitAt + 1,
      //         value: str.slice(digitsChunkStartsAt, lastDigitAt + 1),
      //       },
      //       null,
      //       4
      //     )}"`
      //   );
      return {
        from: offset + digitsChunkStartsAt,
        to: offset + lastDigitAt + 1,
        extracted: val.slice(digitsChunkStartsAt, lastDigitAt + 1),
      };
    }

    // catch digits
    // -------------------------------------------------------------------------
    if (/\d/.test(val[i])) {
      // 1. note that
      lastDigitAt = i;

      // 2. catch the start of the first digit
      if (
        // if chunk hasn't been recorded yet
        digitsChunkStartsAt === null
      ) {
        digitsChunkStartsAt = i;
        // DEV &&
        //   console.log(
        //     `102 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`digitsChunkStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
        //       digitsChunkStartsAt,
        //       null,
        //       4
        //     )}`
        //   );
      }
    }

    // catch a false scenario cases where letters precede numbers
    // -------------------------------------------------------------------------
    if (
      // chunk hasn't been detected yet:
      digitsChunkStartsAt === null &&
      // it's not whitespace:
      val[i]?.trim() &&
      // it's not dot or digit or some kind of quote:
      !/[\d.'"`]/.test(val[i])
    ) {
      // DEV && console.log(`122 ${`\u001b[${31}m${`early bail`}\u001b[${39}m`}`);
      return null;
    }

    // logging
    // -------------------------------------------------------------------------

    // DEV && console.log(" ");
    // DEV &&
    //   console.log(
    //     `${`\u001b[${90}m${`██ digitsChunkStartsAt = ${digitsChunkStartsAt}`}\u001b[${39}m`}`
    //   );
    // DEV &&
    //   console.log(
    //     `${`\u001b[${90}m${`██ lastDigitAt = ${lastDigitAt}`}\u001b[${39}m`}`
    //   );
    // DEV && console.log(`${`\u001b[${90}m${`----------------`}\u001b[${39}m`}`);
  }

  return null;
}
