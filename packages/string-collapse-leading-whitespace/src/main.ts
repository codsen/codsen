import { version as v } from "../package.json";
const version: string = v;

function collWhitespace(str: string, originallineBreakLimit = 1): string {
  const rawNbsp = "\u00A0";
  // helpers

  function reverse(s: string): string {
    return Array.from(s).reverse().join("");
  }

  // replaces the leading/trailing whitespace chunks with final strings
  function prep(whitespaceChunk: string, limit: number, trailing: boolean) {
    console.log(` `);
    console.log(` `);
    console.log(` `);
    console.log(
      `${`\u001b[${34}m${`============== prep() ==============`}\u001b[${39}m`}`
    );
    console.log(
      `021 ${`\u001b[${36}m${`prep()`}\u001b[${39}m`}: incoming whitespaceChunk=${JSON.stringify(
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

    const firstBreakChar = trailing ? "\n" : "\r";
    const secondBreakChar = trailing ? "\r" : "\n";

    if (!whitespaceChunk) {
      console.log(
        `039 ${`\u001b[${36}m${`prep()`}\u001b[${39}m`}: RETURN ${JSON.stringify(
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
      console.log(
        `055 ${`\u001b[${36}m${`===============`}\u001b[${39}m`} whitespaceChunk[${`\u001b[${33}m${i}\u001b[${39}m`}] = ${
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

      console.log(
        `071 FIY, ${`\u001b[${33}m${`crlfCount`}\u001b[${39}m`} = ${JSON.stringify(
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
          console.log(
            `087 PUSH ${JSON.stringify(
              whitespaceChunk[i],
              null,
              4
            )}, now res = ${JSON.stringify(res, null, 4)}`
          );
        } else if (whitespaceChunk[i] === firstBreakChar) {
          if (crlfCount <= limit) {
            console.log(
              `096 FIY, ${`\u001b[${33}m${`crlfCount`}\u001b[${39}m`} = ${JSON.stringify(
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
            console.log(
              `109 PUSH ${JSON.stringify(
                whitespaceChunk[i],
                null,
                4
              )}, now res = ${JSON.stringify(res, null, 4)}`
            );

            if (whitespaceChunk[i + 1] === secondBreakChar) {
              res += whitespaceChunk[i + 1];
              console.log(
                `119 PUSH ${JSON.stringify(
                  whitespaceChunk[i + 1],
                  null,
                  4
                )}, now res = ${JSON.stringify(res, null, 4)}`
              );

              i++;
              console.log(`127 BUMP i = ${i}`);
            }
          }
        } else if (
          whitespaceChunk[i] === secondBreakChar &&
          (!whitespaceChunk[i - 1] ||
            whitespaceChunk[i - 1] !== firstBreakChar) &&
          crlfCount <= limit
        ) {
          res += whitespaceChunk[i];
          console.log(
            `138 PUSH ${JSON.stringify(
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
          console.log(
            `150 PUSH " ", now res = ${JSON.stringify(res, null, 4)}`
          );
        }
      }
      console.log(
        `155 ${`\u001b[${90}m${`██ whspCount = ${whspCount}; res = ${JSON.stringify(
          res,
          null,
          0
        )}; crlfCount = ${crlfCount}`}\u001b[${39}m`}`
      );
    }
    console.log(
      `163 ${`\u001b[${36}m${`prep()`}\u001b[${39}m`}: ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
        res,
        null,
        4
      )}`
    );
    return res;
  }

  if (typeof str === "string" && str.length) {
    // without a fuss, set the max allowed line breaks as a leading/trailing whitespace:
    let lineBreakLimit = 1;
    if (
      typeof +originallineBreakLimit === "number" &&
      Number.isInteger(+originallineBreakLimit) &&
      +originallineBreakLimit >= 0
    ) {
      lineBreakLimit = +originallineBreakLimit;
    }
    console.log(
      `183 ${`\u001b[${33}m${`lineBreakLimit`}\u001b[${39}m`} = ${JSON.stringify(
        lineBreakLimit,
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
      console.log(`197 the first char is whitespace`);
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i].trim()) {
          frontPart = str.slice(0, i);
          break;
        }
      }
    }
    console.log(".");
    console.log(
      `207 ${`\u001b[${35}m${`██ frontPart`}\u001b[${39}m`} = ${JSON.stringify(
        frontPart,
        null,
        4
      )}`
    );
    console.log(".");

    // if whole string is whitespace, endPart is empty string
    if (
      str.trim() &&
      (str.slice(-1).trim() === "" || str.slice(-1) === rawNbsp)
    ) {
      console.log(`220 the last char is whitespace`);
      for (let i = str.length; i--; ) {
        // console.log(
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
    console.log(".");
    console.log(
      `237 ${`\u001b[${35}m${`██ endPart`}\u001b[${39}m`} = ${JSON.stringify(
        endPart,
        null,
        4
      )}`
    );
    console.log(".");

    // -------------------------------------------------------------------------

    console.log(`247 end reached`);
    return `${prep(frontPart, lineBreakLimit, false)}${str.trim()}${reverse(
      prep(reverse(endPart), lineBreakLimit, true)
    )}`;
  }
  console.log(`252 just return whatever was given`);
  return str;
}

export { collWhitespace, version };
