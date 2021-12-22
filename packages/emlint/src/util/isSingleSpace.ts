import { ErrorObj, Range } from "./commonTypes";

interface Opts {
  from: number;
  to: number;
  offset: number;
}

function isSingleSpace(
  str: string,
  originalOpts: Partial<Opts>,
  errorArr: ErrorObj[]
): void {
  let defaults = {
    from: 0,
    to: str.length,
    offset: 0,
  };
  let opts = { ...defaults, ...originalOpts };

  // whitespace starts at "from" and ends at "to"
  console.log(`022 opts.from = ${opts.from}; opts.to = ${opts.to}`);
  if (str.slice(opts.from, opts.to) !== " ") {
    console.log(
      `025 isSingleSpace(): problems with whitespace, carved out ${JSON.stringify(
        str.slice(opts.from, opts.to),
        null,
        4
      )}`
    );
    // remove the minimal amount of content - if spaces are there
    // already, leave them
    let ranges: Range[];
    if (str[opts.from] === " ") {
      ranges = [[opts.offset + opts.from + 1, opts.offset + opts.to]];
      console.log(
        `037 isSingleSpace(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
          ranges,
          null,
          4
        )}`
      );
    } else if (str[opts.to - 1] === " ") {
      ranges = [[opts.offset + opts.from, opts.offset + opts.to - 1]];
      console.log(
        `046 isSingleSpace(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
          ranges,
          null,
          4
        )}`
      );
    } else {
      console.log(
        `054 isSingleSpace(): worst case scenario, replace the whole whitespace`
      );
      ranges = [[opts.offset + opts.from, opts.offset + opts.to, " "]];
      console.log(
        `058 isSingleSpace(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
          ranges,
          null,
          4
        )}`
      );
    }

    // raise an error about this excessive/wrong whitespace
    console.log(
      `068 isSingleSpace(): [[${opts.offset + opts.from}, ${
        opts.offset + opts.to
      }]]`
    );
    errorArr.push({
      idxFrom: opts.offset + opts.from,
      idxTo: opts.offset + opts.to,
      message: `Should be a single space.`,
      fix: {
        ranges,
      },
    });
  }
}

export default isSingleSpace;
