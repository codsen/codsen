type IdxRange = [charFrom: number, charTo: number];
type CbValues = (idxRange: IdxRange) => void;

interface Opts {
  offset: number;
  from: number;
  to: number;
}

function splitByWhitespace(
  str: string,
  cbValues: CbValues,
  cbWhitespace?: CbValues,
  originalOpts?: Partial<Opts>
): void {
  // DEV && console.log(
  //   `003 splitByWhitespace(): ${`\u001b[${36}m${`traverse and extract`}\u001b[${39}m`}`
  // );

  let defaults: Opts = {
    offset: 0,
    from: 0,
    to: str.length,
  };
  let opts: Opts = { ...defaults, ...originalOpts };

  let nameStartsAt = null;
  let whitespaceStartsAt = null;

  for (let i = opts.from; i < opts.to; i++) {
    // DEV && console.log(
    //   `018 ${`\u001b[${36}m${`------------------------------------------------\nstr[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
    //     str[i],
    //     null,
    //     4
    //   )}`
    // );

    // catch the beginning of a whitespace
    if (whitespaceStartsAt === null && !str[i].trim().length) {
      whitespaceStartsAt = i;
      // DEV && console.log(
      //   `029 splitByWhitespace(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = ${whitespaceStartsAt}`
      // );
    }

    // catch the ending of a whitespace
    if (
      whitespaceStartsAt !== null &&
      (str[i].trim().length || i + 1 === opts.to)
    ) {
      // DEV && console.log(
      //   `039 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} whitespace [${whitespaceStartsAt}, ${
      //     str[i].trim().length ? i : i + 1
      //   }]`
      // );
      if (typeof cbWhitespace === "function") {
        cbWhitespace([
          whitespaceStartsAt + opts.offset,
          (str[i].trim().length ? i : i + 1) + opts.offset,
        ]);
      }
      whitespaceStartsAt = null;
      // DEV && console.log(
      //   `051 splitByWhitespace(): ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = ${whitespaceStartsAt}`
      // );
    }

    // catch the beginning of a name
    if (nameStartsAt === null && str[i].trim().length) {
      nameStartsAt = i;
      // DEV && console.log(
      //   `059 splitByWhitespace(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nameStartsAt`}\u001b[${39}m`} = ${nameStartsAt}`
      // );
    }

    // catch the ending of a name
    if (nameStartsAt !== null && (!str[i].trim().length || i + 1 === opts.to)) {
      // DEV && console.log(
      //   `066 splitByWhitespace(): ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${32}m${`carved out ${opts.typeName} name`}\u001b[${39}m`} ${JSON.stringify(
      //     str.slice(
      //       nameStartsAt,
      //       i + 1 === opts.to && str[i].trim().length ? i + 1 : i
      //     ),
      //     null,
      //     0
      //   )}`
      // );

      // // call CB
      // DEV && console.log(
      //   `078 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} chunk [${nameStartsAt}, ${
      //     i + 1 === opts.to ? i + 1 && str[i].trim().length : i
      //   }]`
      // );
      if (typeof cbValues === "function") {
        cbValues([
          nameStartsAt + opts.offset,
          (i + 1 === opts.to && str[i].trim().length ? i + 1 : i) + opts.offset,
        ]);
      }

      // reset
      nameStartsAt = null;
      // DEV && console.log(
      //   `092 splitByWhitespace(): ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`nameStartsAt`}\u001b[${39}m`} = ${nameStartsAt}`
      // );
    }

    // DEV && console.log(" ");
    // DEV && console.log(" ");
    // DEV && console.log(
    //   `${`\u001b[${90}m${`1 splitByWhitespace(): ██ nameStartsAt = ${nameStartsAt}; whitespaceStartsAt = ${whitespaceStartsAt}`}\u001b[${39}m`}`
    // );
    // DEV && console.log(" ");
    // DEV && console.log(" ");
  }
}

export default splitByWhitespace;
