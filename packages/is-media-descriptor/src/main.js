import leven from "leven";
import cssTreeValidate from "./cssTreeValidate";
import mediaParser from "postcss-media-query-parser";
import { loop, recognisedMediaTypes, lettersOnlyRegex } from "./util";
import processCommaSep from "string-process-comma-separated";
import stringify from "json-stringify-safe";

// See https://drafts.csswg.org/mediaqueries/
// Also https://csstree.github.io/docs/validator.html
// Also, test in Chrome yourself
function isMediaD(originalStr, originalOpts) {
  const defaults = {
    offset: 0
  };

  const opts = Object.assign({}, defaults, originalOpts);
  // insurance first
  if (opts.offset && !Number.isInteger(opts.offset)) {
    throw new Error(
      `is-media-descriptor: [THROW_ID_01] opts.offset must be an integer, it was given as ${
        opts.offset
      } (type ${typeof opts.offset})`
    );
  }
  if (!opts.offset) {
    // to cater false/null
    opts.offset = 0;
  }

  // quick ending
  if (typeof originalStr !== "string") {
    console.log(
      `033 isMediaD(): early exit, ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} []`
    );
    return [];
  } else if (!originalStr.trim().length) {
    console.log(
      `038 isMediaD(): early exit, ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} []`
    );
    return [];
  }

  const res = [];

  // We pay extra attention to whitespace. These two below
  // mark the known index of the first and last non-whitespace
  // character (a'la trim)
  let nonWhitespaceStart = 0;
  let nonWhitespaceEnd = originalStr.length;

  const str = originalStr.trim();

  // ---------------------------------------------------------------------------

  // check for inner whitespace, for example,
  // " screen and (color), projection and (color)"
  //  ^
  //
  // as in...
  //
  // <link media=" screen and (color), projection and (color)" rel="stylesheet" href="example.css">
  //
  // ^ notice rogue space above

  if (originalStr !== originalStr.trim()) {
    const ranges = [];
    if (!originalStr[0].trim().length) {
      // traverse forward
      for (let i = 0, len = originalStr.length; i < len; i++) {
        if (originalStr[i].trim().length) {
          ranges.push([0 + opts.offset, i + opts.offset]);
          nonWhitespaceStart = i;
          break;
        }
      }
    }
    if (!originalStr[originalStr.length - 1].trim().length) {
      // traverse backwards from the end
      for (let i = originalStr.length; i--; ) {
        if (originalStr[i].trim().length) {
          ranges.push([i + 1 + opts.offset, originalStr.length + opts.offset]);
          nonWhitespaceEnd = i + 1;
          break;
        }
      }
    }
    res.push({
      idxFrom: ranges[0][0],
      idxTo: ranges[ranges.length - 1][1],
      message: "Remove whitespace.",
      fix: {
        ranges
      }
    });
  }

  // ---------------------------------------------------------------------------

  console.log(
    `100 isMediaD(): ██ working non-whitespace range: [${`\u001b[${35}m${nonWhitespaceStart}\u001b[${39}m`}, ${`\u001b[${35}m${nonWhitespaceEnd}\u001b[${39}m`}]`
  );

  // quick checks first - cover the most common cases, to make checks the
  // quickest possible when everything's all right
  if (recognisedMediaTypes.includes(str)) {
    //
    //
    //
    //
    //
    //
    //
    //
    // 1. string-only, like "screen"
    //
    //
    //
    //
    //
    //
    //
    //
    console.log(
      `124 isMediaD(): whole string matched! ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`
    );
    return res;
  } else if (["only", "not"].includes(str)) {
    console.log(
      `129 isMediaD(): PUSH [${nonWhitespaceStart +
        opts.offset}, ${nonWhitespaceEnd + opts.offset}]`
    );
    res.push({
      idxFrom: nonWhitespaceStart + opts.offset,
      idxTo: nonWhitespaceEnd + opts.offset,
      message: `Missing media type or condition.`,
      fix: null
    });
  } else if (
    str.match(lettersOnlyRegex) &&
    !str.includes("(") &&
    !str.includes(")")
  ) {
    //
    //
    //
    //
    //
    //
    //
    //
    // 2. string-only, unrecognised like "screeeen"
    //
    //
    //
    //
    //
    //
    //
    //
    console.log(`160 isMediaD(): mostly-letters clauses`);

    for (let i = 0, len = recognisedMediaTypes.length; i < len; i++) {
      console.log(
        `164 isMediaD(): leven ${recognisedMediaTypes[i]} = ${leven(
          recognisedMediaTypes[i],
          str
        )}`
      );
      if (leven(recognisedMediaTypes[i], str) === 1) {
        console.log(`170 isMediaD(): ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
        res.push({
          idxFrom: nonWhitespaceStart + opts.offset,
          idxTo: nonWhitespaceEnd + opts.offset,
          message: `Did you mean "${recognisedMediaTypes[i]}"?`,
          fix: {
            ranges: [
              [
                nonWhitespaceStart + opts.offset,
                nonWhitespaceEnd + opts.offset,
                recognisedMediaTypes[i]
              ]
            ]
          }
        });
        break;
      }

      if (i === len - 1) {
        // it means nothing was matched
        console.log(`190 isMediaD(): end reached`);
        console.log(
          `192 isMediaD(): ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${`\u001b[${33}m${nonWhitespaceStart +
            opts.offset}\u001b[${39}m`}, ${`\u001b[${33}m${nonWhitespaceEnd +
            opts.offset}\u001b[${39}m`}] (not offset [${`\u001b[${33}m${nonWhitespaceStart}\u001b[${39}m`}, ${`\u001b[${33}m${nonWhitespaceEnd}\u001b[${39}m`}])`
        );
        res.push({
          idxFrom: nonWhitespaceStart + opts.offset,
          idxTo: nonWhitespaceEnd + opts.offset,
          message: `Unrecognised media type "${str}".`,
          fix: null
        });
        console.log(
          `203 isMediaD(): ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
            res,
            null,
            4
          )}`
        );
      }
    }
  } else {
    //
    //
    //
    //
    //
    //
    //
    //
    // 3. mixed, like "screen and (color)"
    //
    //
    //
    //
    //
    //
    //
    //

    // PART 1.
    // ███████████████████████████████████████

    console.log(
      `234 isMediaD(): ${`\u001b[${36}m${`PART I.`}\u001b[${39}m`} Preliminary checks.`
    );

    // Preventive checks will help to simplify the algorithm - we won't need
    // to cater for so many edge cases later.

    let wrongOrder = false;
    const [openingBracketCount, closingBracketCount] = Array.from(str).reduce(
      (acc, curr, idx) => {
        if (curr === ")") {
          // if at any time, there are more closing brackets than opening-ones,
          // this means order is messed up
          if (!wrongOrder && acc[1] + 1 > acc[0]) {
            console.log(
              `248 isMediaD(): set ${`\u001b[${33}m${`wrongOrder`}\u001b[${39}m`} = true`
            );
            wrongOrder = true;
          }
          return [acc[0], acc[1] + 1];
        } else if (curr === "(") {
          return [acc[0] + 1, acc[1]];
        } else if (curr === ";") {
          res.push({
            idxFrom: idx + opts.offset,
            idxTo: idx + 1 + opts.offset,
            message: "Semicolon found!",
            fix: null
          });
        }
        return acc;
      },
      [0, 0]
    );

    // we raise this error only when there is equal amount of brackets,
    // only the order is messed up:
    if (wrongOrder && openingBracketCount === closingBracketCount) {
      console.log(
        `272 isMediaD(): ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} the wrong order error`
      );
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "Some closing brackets are before their opening counterparts.",
        fix: null
      });
    }
    console.log(
      `282 isMediaD(): ${`\u001b[${33}m${`openingBracketCount`}\u001b[${39}m`} = ${JSON.stringify(
        openingBracketCount,
        null,
        4
      )}`
    );
    console.log(
      `289 isMediaD(): ${`\u001b[${33}m${`closingBracketCount`}\u001b[${39}m`} = ${JSON.stringify(
        closingBracketCount,
        null,
        4
      )}`
    );

    // reporting that there were more one kind
    // of brackets than the other:
    if (openingBracketCount > closingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "More opening brackets than closing.",
        fix: null
      });
    } else if (closingBracketCount > openingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "More closing brackets than opening.",
        fix: null
      });
    }

    if (!res.length && str.match(/\(\s*\)/g)) {
      console.log(`315 empty brackets pair detected`);
      // now find out where
      let lastOpening = null;
      let nonWhitespaceFound;
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i] === "(") {
          lastOpening = i;
          nonWhitespaceFound = false;
        } else if (str[i] === ")") {
          if (!nonWhitespaceFound) {
            console.log(
              `326 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${lastOpening}, ${i +
                1}]`
            );
            res.push({
              idxFrom: lastOpening + opts.offset,
              idxTo: i + 1 + opts.offset,
              message: "Empty bracket pair.",
              fix: null
            });
          } else {
            nonWhitespaceFound = true;
          }
        } else if (str[i].trim().length) {
          nonWhitespaceFound = true;
        }
      }
    }

    if (res.length) {
      // report errors early, save resources
      console.log(
        `347 isMediaD(): early ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`
      );
      return res;
    }

    // PART 2.
    // ███████████████████████████████████████

    console.log(
      `356 isMediaD(): ${`\u001b[${36}m${`PART II.`}\u001b[${39}m`} The main loop.`
    );
    // first parse comma-separated chunks
    processCommaSep(str, {
      offset: opts.offset,
      leadingWhitespaceOK: false,
      trailingWhitespaceOK: false,
      oneSpaceAfterCommaOK: true,
      innerWhitespaceAllowed: true,
      separator: ",",
      cb: (idxFrom, idxTo) => {
        console.log(
          `368 isMediaD(): chunk [${idxFrom - opts.offset}, ${idxTo -
            opts.offset}] extracted, passing to loop()`
        );
        console.log(` `);
        console.log(` `);
        console.log(` `);
        console.log(` `);
        const parsed = mediaParser(
          str.slice(idxFrom - opts.offset, idxTo - opts.offset)
        );
        console.log(
          `379 ███████████████████████████████████████\n\n ${`\u001b[${33}m${`parsed`}\u001b[${39}m`} = ${stringify(
            parsed,
            null,
            4
          )}`
        );
        loop(str, opts, res);
      },
      errCb: (ranges, message) => {
        console.log(
          `389 isMediaD(): received error range ${JSON.stringify(
            ranges,
            null,
            4
          )} and message: "${message}"`
        );
      }
    });

    // PART 3.
    // ███████████████████████████████████████

    // if (!res.length) {
    //   // finally, if no errors were caught, parse:
    //   console.log(`329 PART III. Run through CSS Tree parser.`);
    //   const temp = cssTreeValidate(`@media ${str} {}`);
    //   console.log(
    //     `332 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
    //       temp,
    //       null,
    //       4
    //     )}`
    //   );
    // }
  }

  // ---------------------------------------------------------------------------

  console.log(
    `418 isMediaD(): ${`\u001b[${32}m${`FINAL RETURN`}\u001b[${39}m`}`
  );
  console.log(
    `421 isMediaD(): ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  return res;
}

export default isMediaD;
