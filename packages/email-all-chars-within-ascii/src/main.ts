import { version } from "../package.json";

interface Res {
  type: "character" | "line length";
  line: number;
  column: number;
  positionIdx: number;
  value: number | string;
  codePoint?: undefined | number;
}

interface Opts {
  lineLength: number;
}

const defaults: Opts = {
  lineLength: 500,
};

function within(str: string, originalOpts?: Opts): Res[] {
  if (typeof str !== "string") {
    throw new Error(
      `email-all-chars-within-ascii/within(): [THROW_ID_01] The input is not string but ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(
      `email-all-chars-within-ascii/within(): [THROW_ID_02] The opts is not a plain object but ${typeof originalOpts}, equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  // quick ending
  if (!str.length) {
    return [];
  }

  // set the options
  const opts: Opts = { ...defaults, ...originalOpts };

  // -----------------------------------------------------------------------------

  // max line length will be measured against it:
  let column = 0;

  // current row number
  let currLine = 1;

  // what to return
  const res: Res[] = [];

  for (let i = 0, len = str.length; i <= len; i++) {
    //
    // top clauses
    // -----------------------------------------------------------------------------

    // check the line length
    // =====================

    if (
      opts.lineLength &&
      (!str[i] || str[i] === "\r" || str[i] === "\n") &&
      column > opts.lineLength
    ) {
      console.log(`069 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
      res.push({
        type: "line length",
        line: currLine,
        column: column,
        positionIdx: i,
        value: column,
      });
    }

    // count chars per line
    // ====================

    if (str[i] === "\r" || str[i] === "\n") {
      // 2. reset per-line char counter
      column = 0;

      // 3. count line breaks, minding the CRLF
      if (str[i] === "\n" || str[i + 1] !== "\n") {
        currLine += 1;
      }
    } else {
      column += 1;
    }

    //
    // middle clauses
    // -----------------------------------------------------------------------------

    // logging
    // =======

    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim() ? str[i] : JSON.stringify(str[i], null, 4)
      }; column = ${column}; line = ${currLine}`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

    // track non-ASCII
    // ===============

    // allowed ASCII control characters:
    //
    // #9  - HT, horizontal tab
    // #10 - LF, new line
    // #13 - CR, carriage return
    //
    // the rest, below decimal point #32 are not allowed
    // Naturally, above #126 is not allowed. This concerns #127, DEL too!
    if (str[i]) {
      const currCodePoint = str[i].codePointAt(0);
      if (
        currCodePoint === undefined ||
        currCodePoint > 126 ||
        currCodePoint < 9 ||
        currCodePoint === 11 ||
        currCodePoint === 12 ||
        (currCodePoint > 13 && currCodePoint < 32)
      ) {
        console.log(`125 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
        res.push({
          type: "character",
          line: currLine,
          column,
          positionIdx: i,
          value: str[i],
          codePoint: currCodePoint,
        });
      }
    }

    //
    // bottom clauses
    // -----------------------------------------------------------------------------
  }

  console.log(
    `098 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  return res;
}

export { within, defaults, version };
