function splitByWhitespace(str, cbValues, cbWhitespace, originalOpts) {
  // console.log(
  //   `003 splitByWhitespace(): ${`\u001b[${36}m${`traverse and extract`}\u001b[${39}m`}`
  // );

  const defaults = {
    offset: 0,
    from: 0,
    to: str.length
  };
  const opts = Object.assign({}, defaults, originalOpts);

  let nameStartsAt = null;
  let whitespaceStartsAt = null;

  for (let i = opts.from; i < opts.to; i++) {
    // console.log(
    //   `018 ${`\u001b[${36}m${`------------------------------------------------\nstr[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
    //     str[i],
    //     null,
    //     4
    //   )}`
    // );

    // catch the beginning of a whitespace
    if (whitespaceStartsAt === null && !str[i].trim().length) {
      whitespaceStartsAt = i;
      // console.log(
      //   `029 splitByWhitespace(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = ${whitespaceStartsAt}`
      // );
    }

    // catch the ending of a whitespace
    if (
      whitespaceStartsAt !== null &&
      (str[i].trim().length || i + 1 === opts.to)
    ) {
      // console.log(
      //   `039 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} whitespace [${whitespaceStartsAt}, ${
      //     str[i].trim().length ? i : i + 1
      //   }]`
      // );
      if (typeof cbWhitespace === "function") {
        cbWhitespace([whitespaceStartsAt, str[i].trim().length ? i : i + 1]);
      }
      whitespaceStartsAt = null;
      // console.log(
      //   `048 splitByWhitespace(): ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = ${whitespaceStartsAt}`
      // );
    }

    // catch the beginning of a name
    if (nameStartsAt === null && str[i].trim().length) {
      nameStartsAt = i;
      // console.log(
      //   `056 splitByWhitespace(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nameStartsAt`}\u001b[${39}m`} = ${nameStartsAt}`
      // );
    }

    // catch the ending of a name
    if (nameStartsAt !== null && (!str[i].trim().length || i + 1 === opts.to)) {
      // console.log(
      //   `063 splitByWhitespace(): ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${32}m${`carved out ${opts.typeName} name`}\u001b[${39}m`} ${JSON.stringify(
      //     str.slice(nameStartsAt, i + 1 === opts.to ? i + 1 : i),
      //     null,
      //     0
      //   )}`
      // );

      // call CB
      // console.log(
      //   `072 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} chunk [${nameStartsAt}, ${
      //     i + 1 === opts.to ? i + 1 : i
      //   }]`
      // );
      if (typeof cbValues === "function") {
        cbValues([nameStartsAt, i + 1 === opts.to ? i + 1 : i]);
      }

      // reset
      nameStartsAt = null;
      // console.log(
      //   `083 splitByWhitespace(): ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`nameStartsAt`}\u001b[${39}m`} = ${nameStartsAt}`
      // );
    }

    // console.log(" ");
    // console.log(" ");
    // console.log(
    //   `${`\u001b[${90}m${`1 splitByWhitespace(): ██ nameStartsAt = ${nameStartsAt}; whitespaceStartsAt = ${whitespaceStartsAt}`}\u001b[${39}m`}`
    // );
    // console.log(" ");
    // console.log(" ");
  }
}

export default splitByWhitespace;
