import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

function collWhitespace(str: string, lineBreakLimit = 1): string {
  let rawNbsp = "\u00A0";
  // helpers

  function reverse(s: string): string {
    return Array.from(s).reverse().join("");
  }

  // replaces the leading/trailing whitespace chunks with final strings
  function prep(
    whitespaceChunk: string,
    limit: number,
    trailing: boolean
  ): string {
    DEV && console.log(` `);
    DEV && console.log(` `);
    DEV && console.log(` `);
    DEV &&
      console.log(
        `${`\u001b[${34}m${`============== prep() ==============`}\u001b[${39}m`}`
      );
    DEV &&
      console.log(
        `030 ${`\u001b[${36}m${`prep()`}\u001b[${39}m`}: incoming whitespaceChunk=${JSON.stringify(
          whitespaceChunk,
          null,
          4
        )}; limit="${limit}"`
      );

    // when processing the leading whitespace, it's \n\r --- CR - LF
    // when processing the trailing whitespace, we're processing inverted order,
    // so it's \n\r --- LF - CR
    // for this reason, we set first and second linebreak according to direction,
    // the "trailing" boolean:

    let firstBreakChar = trailing ? "\n" : "\r";
    let secondBreakChar = trailing ? "\r" : "\n";

    if (!whitespaceChunk) {
      DEV &&
        console.log(
          `049 ${`\u001b[${36}m${`prep()`}\u001b[${39}m`}: RETURN ${JSON.stringify(
            whitespaceChunk,
            null,
            4
          )}`
        );
      return whitespaceChunk;
    }

    // let whitespace char count since last CR or LF
    let whspCount = 0;
    let crlfCount = 0;
    let res = "";
    // let beginning = true;
    for (let i = 0, len = whitespaceChunk.length; i < len; i++) {
      DEV &&
        console.log(
          `066 ${`\u001b[${36}m${`===============`}\u001b[${39}m`} whitespaceChunk[${`\u001b[${33}m${i}\u001b[${39}m`}] = ${
            whitespaceChunk[i] === rawNbsp
              ? "nbsp"
              : JSON.stringify(whitespaceChunk[i], null, 0)
          } ${`\u001b[${36}m${`===============`}\u001b[${39}m`}`
        );

      if (
        whitespaceChunk[i] === firstBreakChar ||
        (whitespaceChunk[i] === secondBreakChar &&
          whitespaceChunk[i - 1] !== firstBreakChar)
      ) {
        crlfCount++;
      }

      DEV &&
        console.log(
          `083 FIY, ${`\u001b[${33}m${`crlfCount`}\u001b[${39}m`} = ${JSON.stringify(
            crlfCount,
            null,
            4
          )}`
        );

      if (
        `\r\n`.includes(whitespaceChunk[i]) ||
        whitespaceChunk[i] === rawNbsp
      ) {
        whspCount = 0;

        if (whitespaceChunk[i] === rawNbsp) {
          res += whitespaceChunk[i];
          DEV &&
            console.log(
              `100 PUSH ${JSON.stringify(
                whitespaceChunk[i],
                null,
                4
              )}, now res = ${JSON.stringify(res, null, 4)}`
            );
        } else if (whitespaceChunk[i] === firstBreakChar) {
          if (crlfCount <= limit) {
            DEV &&
              console.log(
                `110 FIY, ${`\u001b[${33}m${`crlfCount`}\u001b[${39}m`} = ${JSON.stringify(
                  crlfCount,
                  null,
                  4
                )}; ${`\u001b[${33}m${`limit`}\u001b[${39}m`} = ${JSON.stringify(
                  limit,
                  null,
                  4
                )}`
              );

            res += whitespaceChunk[i];
            DEV &&
              console.log(
                `124 PUSH ${JSON.stringify(
                  whitespaceChunk[i],
                  null,
                  4
                )}, now res = ${JSON.stringify(res, null, 4)}`
              );

            if (whitespaceChunk[i + 1] === secondBreakChar) {
              res += whitespaceChunk[i + 1];
              DEV &&
                console.log(
                  `135 PUSH ${JSON.stringify(
                    whitespaceChunk[i + 1],
                    null,
                    4
                  )}, now res = ${JSON.stringify(res, null, 4)}`
                );

              i++;
              DEV && console.log(`143 BUMP i = ${i}`);
            }
          }
        } else if (
          whitespaceChunk[i] === secondBreakChar &&
          whitespaceChunk?.[i - 1] !== firstBreakChar &&
          crlfCount <= limit
        ) {
          res += whitespaceChunk[i];
          DEV &&
            console.log(
              `154 PUSH ${JSON.stringify(
                whitespaceChunk[i],
                null,
                4
              )}, now res = ${JSON.stringify(res, null, 4)}`
            );
        }
      } else {
        whspCount++;
        if (!whitespaceChunk[i + 1] && !crlfCount) {
          res += " ";
          DEV &&
            console.log(
              `167 PUSH " ", now res = ${JSON.stringify(res, null, 4)}`
            );
        }
      }
      DEV &&
        console.log(
          `173 ${`\u001b[${90}m${`██ whspCount = ${whspCount}; res = ${JSON.stringify(
            res,
            null,
            0
          )}; crlfCount = ${crlfCount}`}\u001b[${39}m`}`
        );
    }
    DEV &&
      console.log(
        `182 ${`\u001b[${36}m${`prep()`}\u001b[${39}m`}: ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
          res,
          null,
          4
        )}`
      );
    return res;
  }

  if (typeof str === "string" && str.length) {
    // without a fuss, set the max allowed line breaks as a leading/trailing whitespace:
    let resolvedLineBreakLimit = 1;
    if (
      typeof +lineBreakLimit === "number" &&
      Number.isInteger(+lineBreakLimit) &&
      +lineBreakLimit >= 0
    ) {
      resolvedLineBreakLimit = +lineBreakLimit;
    }
    DEV &&
      console.log(
        `203 ${`\u001b[${33}m${`resolvedLineBreakLimit`}\u001b[${39}m`} = ${JSON.stringify(
          resolvedLineBreakLimit,
          null,
          4
        )}`
      );

    // plan: extract what would String.prototype() would remove, front and back parts
    let frontPart = "";
    let endPart = "";

    if (!str.trim()) {
      frontPart = str;
    } else if (!str[0].trim()) {
      DEV && console.log(`217 the first char is whitespace`);
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i].trim()) {
          frontPart = str.slice(0, i);
          break;
        }
      }
    }
    DEV && console.log(".");
    DEV &&
      console.log(
        `228 ${`\u001b[${35}m${`██ frontPart`}\u001b[${39}m`} = ${JSON.stringify(
          frontPart,
          null,
          4
        )}`
      );
    DEV && console.log(".");

    // if whole string is whitespace, endPart is empty string
    if (
      str.trim() &&
      (str.slice(-1).trim() === "" || str.slice(-1) === rawNbsp)
    ) {
      DEV && console.log(`241 the last char is whitespace`);
      for (let i = str.length; i--; ) {
        // DEV && console.log(
        //   `${`\u001b[${36}m${`----------------------------------------------\niterating through: ${JSON.stringify(
        //     str[i],
        //     null,
        //     4
        //   )}`}\u001b[${39}m`}`
        // );
        if (str[i].trim()) {
          endPart = str.slice(i + 1);
          break;
        }
      }
    }
    DEV && console.log(".");
    DEV &&
      console.log(
        `259 ${`\u001b[${35}m${`██ endPart`}\u001b[${39}m`} = ${JSON.stringify(
          endPart,
          null,
          4
        )}`
      );
    DEV && console.log(".");

    // -------------------------------------------------------------------------

    DEV && console.log(`269 end reached`);
    return `${prep(
      frontPart,
      resolvedLineBreakLimit,
      false
    )}${str.trim()}${reverse(
      prep(reverse(endPart), resolvedLineBreakLimit, true)
    )}`;
  }
  DEV && console.log(`278 just return whatever was given`);
  return str;
}

export { collWhitespace, version };
