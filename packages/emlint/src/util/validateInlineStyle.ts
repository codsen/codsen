import checkForWhitespace from "./checkForWhitespace";
import { ErrorObj } from "./commonTypes";

interface Opts {
  noTrailingSemi: boolean;
}

const defaults: Opts = {
  noTrailingSemi: true,
};

function validateInlineStyle(
  str: string,
  idxOffset: number,
  originalOpts: Opts
): ErrorObj[] {
  console.log(
    `018 ${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} = ${JSON.stringify(
      originalOpts,
      null,
      4
    )}`
  );
  const opts: Opts = { ...defaults, ...originalOpts };
  console.log(
    `026 validateInlineStyle(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // we get trimmed string start and end positions, also an encountered errors array
  // const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);
  console.log(
    `037 ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${JSON.stringify(
      charStart,
      null,
      4
    )}; ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${JSON.stringify(
      charEnd,
      null,
      4
    )}; ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
      errorArr,
      null,
      4
    )}`
  );

  // now that we know where non-whitespace chars are, we can evaluate them

  if (charStart !== null && charEnd) {
    // 1. check inner whitespace:
    // imagine original source:
    // <td style="font-size:  10px;"></td>
    // extracted value is passed as "str":
    //            font-size:  10px;
    //                      ^^
    //             we flag this
    //
    let whitespaceStartsAt: number | null = null;
    let nonSpacesMet = false;
    for (let i = charStart; i < charEnd; i++) {
      console.log(
        `067 ${`\u001b[${36}m${`str[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
          str[i],
          null,
          4
        )}`
      );

      // catch the unspaced colon
      // <td style="font-size:10px;"></td>
      //                     ^
      if (str[i] === ":" && str[i + 1].trim()) {
        errorArr.push({
          idxFrom: i + 1 + idxOffset,
          idxTo: i + 1 + idxOffset,
          message: `Add a space.`,
          fix: { ranges: [[i + 1 + idxOffset, i + 1 + idxOffset, " "]] },
        });
      }

      // catch the start of a wrong whitespace chunk
      if (
        // it's whitespace:
        !str[i].trim() &&
        // it hasn't been recording
        whitespaceStartsAt === null
      ) {
        whitespaceStartsAt = i;
        console.log(
          `095 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
            whitespaceStartsAt,
            null,
            4
          )}`
        );
      }

      // flag up non-space whitespace characters
      if (
        // chunk has been recording
        whitespaceStartsAt &&
        // and it's a whitespace
        !str[i].trim() &&
        // and current char is not a space
        str[i] !== " " &&
        // and flag hasn't been flipped already
        !nonSpacesMet
      ) {
        nonSpacesMet = true;
        console.log(
          `116 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nonSpacesMet`}\u001b[${39}m`} = ${JSON.stringify(
            nonSpacesMet,
            null,
            4
          )}`
        );
      }

      // catch the excessive chunk or anything not-space
      if (
        // it exists
        whitespaceStartsAt &&
        // it's been passed
        i > whitespaceStartsAt &&
        // and current char doesn't exist (end reached)
        (!str[i] ||
          // or it's not whitespace
          str[i].trim())
      ) {
        console.log(
          `136 caught whitespace chunk [${whitespaceStartsAt}, ${i}]`
        );

        if (nonSpacesMet || i > whitespaceStartsAt + 1) {
          console.log(`140 ${`\u001b[${31}m${`error!`}\u001b[${39}m`}`);
          // default is replacement of the whole string with a single space
          let from = whitespaceStartsAt;
          let to = i;
          let replacement: " " | null = " ";

          if (str[whitespaceStartsAt] === " ") {
            // push "from" by one and remove replacement
            from += 1;
            replacement = null;
          } else if (str[i - 1] === " ") {
            to -= 1;
            replacement = null;
          }

          errorArr.push({
            idxFrom: from + idxOffset,
            idxTo: to + idxOffset,
            message: `${
              nonSpacesMet && i === whitespaceStartsAt + 1
                ? "Replace"
                : "Remove"
            } whitespace.`,
            fix: {
              ranges: [
                replacement
                  ? [from + idxOffset, to + idxOffset, replacement]
                  : [from + idxOffset, to + idxOffset],
              ],
            },
          });
        }

        // reset
        whitespaceStartsAt = null;
        nonSpacesMet = false;
      }
    }

    // -----------------------------------------------------------------------------

    // 2. check the trailing semi
    if (opts.noTrailingSemi && str[charEnd - 1] === ";") {
      errorArr.push({
        idxFrom: charEnd - 1 + idxOffset,
        idxTo: charEnd + idxOffset,
        message: `Delete the trailing semicolon.`,
        fix: {
          ranges: [[charEnd - 1 + idxOffset, charEnd + idxOffset]],
        },
      });
    } else if (!opts.noTrailingSemi && str[charEnd - 1] !== ";") {
      errorArr.push({
        idxFrom: charEnd + idxOffset,
        idxTo: charEnd + idxOffset,
        message: `Add the trailing semicolon.`,
        fix: {
          ranges: [[charEnd + idxOffset, charEnd + idxOffset, ";"]],
        },
      });
    }
  }

  return errorArr;
}

export default validateInlineStyle;
