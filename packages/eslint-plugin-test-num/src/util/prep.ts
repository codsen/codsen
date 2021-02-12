interface Obj {
  [key: string]: any;
}

function prep(str: string, originalOpts?: Obj): Obj {
  console.log(
    `007 prep(): ${`\u001b[${32}m${`RECEIVED`}\u001b[${39}m`} >>>${str}<<<`
  );

  /* istanbul ignore if */
  if (typeof str !== "string" || !str.length) {
    return {};
  }

  const defaults = {
    offset: 0,
  };
  const opts = { ...defaults, ...originalOpts };
  console.log(
    `020 prep(): final ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // So it's a non-empty string. Traverse!

  let digitsChunkStartsAt = null;
  let lastDigitAt: number | null = null;

  console.log(
    `033 prep(): ${`\u001b[${36}m${`traverse starts`}\u001b[${39}m`}`
  );
  for (let i = 0, len = str.length; i <= len; i++) {
    console.log(
      `037 prep(): ${`\u001b[${36}m${`======================== str[${i}]= ${`\u001b[${35}m${
        str[i] && str[i].trim().length
          ? str[i]
          : JSON.stringify(str[i], null, 4)
      }\u001b[${39}m`} ========================`}\u001b[${39}m`}`
    );

    // catch the end of the digit chunk
    // -------------------------------------------------------------------------
    if (
      // if chunk has been recorded as already started
      digitsChunkStartsAt !== null &&
      typeof lastDigitAt === "number" &&
      // and
      // a) it's not a whitespace
      ((str[i] &&
        str[i].trim().length &&
        // it's not a number
        !/\d/.test(str[i]) &&
        // and it's not a dot or hyphen
        !["."].includes(str[i])) ||
        // OR
        // b) we reached the end (we traverse up to and including str.length,
        // which is "undefined" character; notice i <= len in the loop above,
        // normally it would be i < len)
        !str[i])
    ) {
      console.log(
        `065 prep(): ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}: "${JSON.stringify(
          {
            start: opts.offset + digitsChunkStartsAt,
            end: opts.offset + lastDigitAt + 1,
            value: str.slice(digitsChunkStartsAt, lastDigitAt + 1),
          },
          null,
          4
        )}"`
      );
      return {
        start: opts.offset + digitsChunkStartsAt,
        end: opts.offset + lastDigitAt + 1,
        value: str.slice(digitsChunkStartsAt, lastDigitAt + 1),
      };
    }

    // catch digits
    // -------------------------------------------------------------------------
    if (/^\d*$/.test(str[i])) {
      // 1. note that
      lastDigitAt = i;

      // 2. catch the start of the first digit
      if (
        // if chunk hasn't been recorded yet
        digitsChunkStartsAt === null
      ) {
        digitsChunkStartsAt = i;
        console.log(
          `095 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`digitsChunkStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
            digitsChunkStartsAt,
            null,
            4
          )}`
        );
      }
    }

    // catch false scenario cases where letters precede numbers
    // -------------------------------------------------------------------------
    if (
      // chunk hasn't been detected yet:
      digitsChunkStartsAt === null &&
      // it's not whitespace:
      str[i] &&
      str[i].trim() &&
      // it's not dot or digit or some kind of quote:
      !/[\d.'"`]/.test(str[i])
    ) {
      console.log(`115 ${`\u001b[${31}m${`early bail`}\u001b[${39}m`}`);
      return {};
    }

    // logging
    // -------------------------------------------------------------------------

    console.log(" ");
    console.log(
      `${`\u001b[${90}m${`██ digitsChunkStartsAt = ${digitsChunkStartsAt}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`██ lastDigitAt = ${lastDigitAt}`}\u001b[${39}m`}`
    );
    console.log(`${`\u001b[${90}m${`----------------`}\u001b[${39}m`}`);
  }

  return {};
}

export default prep;
