import leven from "leven";
import { processCommaSep } from "string-process-comma-separated";
import type { Ranges } from "../../../ops/typedefs/common";

import {
  loop,
  recognisedMediaTypes,
  lettersOnlyRegex,
  Opts,
  ResObj,
} from "./util";
import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

const defaults = {
  offset: 0,
};

// See https://drafts.csswg.org/mediaqueries/
// Also https://csstree.github.io/docs/validator.html
// Also, test in Chrome yourself
function isMediaD(str: string, opts?: Partial<Opts>): ResObj[] {
  let resolvedOpts: Opts = { ...defaults, ...opts };
  // insurance first
  if (resolvedOpts.offset && !Number.isInteger(resolvedOpts.offset)) {
    throw new Error(
      `is-media-descriptor: [THROW_ID_01] resolvedOpts.offset must be an integer, it was given as ${
        resolvedOpts.offset
      } (type ${typeof resolvedOpts.offset})`
    );
  }
  if (!resolvedOpts.offset) {
    // to cater false/null
    resolvedOpts.offset = 0;
  }

  // quick ending
  if (typeof str !== "string") {
    DEV &&
      console.log(
        `044 isMediaD(): early exit, ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} []`
      );
    return [];
  }
  if (!str.trim()) {
    DEV &&
      console.log(
        `051 isMediaD(): early exit, ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} []`
      );
    return [];
  }

  let res: ResObj[] = [];

  // We pay extra attention to whitespace. These two below
  // mark the known index of the first and last non-whitespace
  // character (a'la trim)
  let nonWhitespaceStart = 0;
  let nonWhitespaceEnd = str.length;

  let resolvedStr = str.trim();

  DEV &&
    console.log(
      `068 FINAL ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4
      )}`
    );

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

  if (str !== str.trim()) {
    let ranges = [];
    if (!str[0].trim()) {
      DEV && console.log(`090 traverse forward`);
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i].trim()) {
          ranges.push([0 + resolvedOpts.offset, i + resolvedOpts.offset]);
          nonWhitespaceStart = i;
          break;
        }
      }
    }
    if (!str[str.length - 1].trim()) {
      DEV && console.log(`100 traverse backwards from the end`);
      for (let i = str.length; i--; ) {
        if (str[i].trim()) {
          ranges.push([
            i + 1 + resolvedOpts.offset,
            str.length + resolvedOpts.offset,
          ]);
          nonWhitespaceEnd = i + 1;
          break;
        }
      }
    }
    DEV &&
      console.log(
        `114 PUSH [${ranges[0][0]}, ${ranges[ranges.length - 1][1]}]`
      );
    res.push({
      idxFrom: ranges[0][0],
      idxTo: ranges[ranges.length - 1][1],
      message: "Remove whitespace.",
      fix: {
        ranges: ranges as Ranges,
      },
    });
  }

  // ---------------------------------------------------------------------------

  DEV &&
    console.log(
      `130 isMediaD(): ██ working non-whitespace range: [${`\u001b[${35}m${nonWhitespaceStart}\u001b[${39}m`}, ${`\u001b[${35}m${nonWhitespaceEnd}\u001b[${39}m`}]`
    );

  // quick checks first - cover the most common cases, to make checks the
  // quickest possible when everything's all right
  if (recognisedMediaTypes.includes(resolvedStr)) {
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
    DEV &&
      console.log(
        `155 isMediaD(): whole string matched! ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`
      );
    return res;
  }
  if (["only", "not"].includes(resolvedStr)) {
    DEV &&
      console.log(
        `162 isMediaD(): PUSH [${nonWhitespaceStart + resolvedOpts.offset}, ${
          nonWhitespaceEnd + resolvedOpts.offset
        }]`
      );
    res.push({
      idxFrom: nonWhitespaceStart + resolvedOpts.offset,
      idxTo: nonWhitespaceEnd + resolvedOpts.offset,
      message: `Missing media type or condition.`,
      fix: null,
    });
  } else if (
    resolvedStr.match(lettersOnlyRegex) &&
    !resolvedStr.includes("(") &&
    !resolvedStr.includes(")")
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
    DEV && console.log(`194 isMediaD(): mostly-letters clauses`);

    for (let i = 0, len = recognisedMediaTypes.length; i < len; i++) {
      DEV &&
        console.log(
          `199 isMediaD(): leven ${recognisedMediaTypes[i]} = ${leven(
            recognisedMediaTypes[i],
            resolvedStr
          )}`
        );
      if (leven(recognisedMediaTypes[i], resolvedStr) === 1) {
        DEV &&
          console.log(
            `207 isMediaD(): ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`
          );
        res.push({
          idxFrom: nonWhitespaceStart + resolvedOpts.offset,
          idxTo: nonWhitespaceEnd + resolvedOpts.offset,
          message: `Did you mean "${recognisedMediaTypes[i]}"?`,
          fix: {
            ranges: [
              [
                nonWhitespaceStart + resolvedOpts.offset,
                nonWhitespaceEnd + resolvedOpts.offset,
                recognisedMediaTypes[i],
              ],
            ],
          },
        });
        break;
      }

      if (i === len - 1) {
        // it means nothing was matched
        DEV && console.log(`228 isMediaD(): end reached`);
        DEV &&
          console.log(
            `231 isMediaD(): ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${`\u001b[${33}m${
              nonWhitespaceStart + resolvedOpts.offset
            }\u001b[${39}m`}, ${`\u001b[${33}m${
              nonWhitespaceEnd + resolvedOpts.offset
            }\u001b[${39}m`}] (not offset [${`\u001b[${33}m${nonWhitespaceStart}\u001b[${39}m`}, ${`\u001b[${33}m${nonWhitespaceEnd}\u001b[${39}m`}])`
          );
        res.push({
          idxFrom: nonWhitespaceStart + resolvedOpts.offset,
          idxTo: nonWhitespaceEnd + resolvedOpts.offset,
          message: `Unrecognised media type "${resolvedStr}".`,
          fix: null,
        });
        DEV &&
          console.log(
            `245 isMediaD(): ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
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

    DEV &&
      console.log(
        `277 isMediaD(): ${`\u001b[${36}m${`PART I.`}\u001b[${39}m`} Preliminary checks.`
      );

    // Preventive checks will help to simplify the algorithm - we won't need
    // to cater for so many edge cases later.

    let wrongOrder = false;
    let [openingBracketCount, closingBracketCount] = Array.from(
      resolvedStr
    ).reduce(
      (acc, curr, idx) => {
        if (curr === ")") {
          // if at any time, there are more closing brackets than opening-ones,
          // this means order is messed up
          if (!wrongOrder && acc[1] + 1 > acc[0]) {
            DEV &&
              console.log(
                `294 isMediaD(): set ${`\u001b[${33}m${`wrongOrder`}\u001b[${39}m`} = true`
              );
            wrongOrder = true;
          }
          return [acc[0], acc[1] + 1];
        }
        if (curr === "(") {
          return [acc[0] + 1, acc[1]];
        }
        if (curr === ";") {
          res.push({
            idxFrom: idx + resolvedOpts.offset,
            idxTo: idx + 1 + resolvedOpts.offset,
            message: "Semicolon found!",
            fix: null,
          });
        }
        return acc;
      },
      [0, 0]
    );

    // we raise this error only when there is equal amount of brackets,
    // only the order is messed up:
    if (wrongOrder && openingBracketCount === closingBracketCount) {
      DEV &&
        console.log(
          `321 isMediaD(): ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} the wrong order error`
        );
      res.push({
        idxFrom: nonWhitespaceStart + resolvedOpts.offset,
        idxTo: nonWhitespaceEnd + resolvedOpts.offset,
        message: "Some closing brackets are before their opening counterparts.",
        fix: null,
      });
    }
    DEV &&
      console.log(
        `332 isMediaD(): ${`\u001b[${33}m${`openingBracketCount`}\u001b[${39}m`} = ${JSON.stringify(
          openingBracketCount,
          null,
          4
        )}`
      );
    DEV &&
      console.log(
        `340 isMediaD(): ${`\u001b[${33}m${`closingBracketCount`}\u001b[${39}m`} = ${JSON.stringify(
          closingBracketCount,
          null,
          4
        )}`
      );

    // reporting that there were more one kind
    // of brackets than the other:
    if (openingBracketCount > closingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + resolvedOpts.offset,
        idxTo: nonWhitespaceEnd + resolvedOpts.offset,
        message: "More opening brackets than closing.",
        fix: null,
      });
    } else if (closingBracketCount > openingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + resolvedOpts.offset,
        idxTo: nonWhitespaceEnd + resolvedOpts.offset,
        message: "More closing brackets than opening.",
        fix: null,
      });
    }

    if (!res.length && resolvedStr.match(/\(\s*\)/g)) {
      DEV && console.log(`366 empty brackets pair detected`);
      // now find out where
      let lastOpening = null;
      let nonWhitespaceFound;
      for (let i = 0, len = resolvedStr.length; i < len; i++) {
        if (resolvedStr[i] === "(") {
          lastOpening = i;
          nonWhitespaceFound = false;
        } else if (resolvedStr[i] === ")" && lastOpening) {
          if (!nonWhitespaceFound) {
            DEV &&
              console.log(
                `378 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${lastOpening}, ${
                  i + 1
                }]`
              );
            res.push({
              idxFrom: lastOpening + resolvedOpts.offset,
              idxTo: i + 1 + resolvedOpts.offset,
              message: "Empty bracket pair.",
              fix: null,
            });
          } else {
            nonWhitespaceFound = true;
          }
        } else if (resolvedStr[i].trim()) {
          nonWhitespaceFound = true;
        }
      }
    }

    if (res.length) {
      // report errors early, save resources
      DEV &&
        console.log(
          `401 isMediaD(): early ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`
        );
      return res;
    }

    // PART 2.
    // ███████████████████████████████████████

    DEV &&
      console.log(
        `411 isMediaD(): ${`\u001b[${36}m${`PART II.`}\u001b[${39}m`} The main loop.`
      );
    // first parse comma-separated chunks
    processCommaSep(resolvedStr, {
      offset: resolvedOpts.offset,
      leadingWhitespaceOK: false,
      trailingWhitespaceOK: false,
      oneSpaceAfterCommaOK: true,
      innerWhitespaceAllowed: true,
      separator: ",",
      cb: (idxFrom: number, idxTo: number) => {
        DEV &&
          console.log(
            `424 isMediaD(): chunk [${idxFrom - resolvedOpts.offset}, ${
              idxTo - resolvedOpts.offset
            }] extracted, passing to loop()`
          );
        loop(
          resolvedStr,
          {
            ...resolvedOpts,
            idxFrom: idxFrom - resolvedOpts.offset,
            idxTo: idxTo - resolvedOpts.offset,
          },
          res
        );
      },
      errCb: (ranges: Ranges, message: string) => {
        DEV &&
          console.log(
            `441 isMediaD(): received error range ${JSON.stringify(
              ranges,
              null,
              4
            )} and message: "${message}"`
          );
      },
    });

    // PART 3.
    // ███████████████████████████████████████

    // if (!res.length) {
    //   // finally, if no errors were caught, parse:
    //   DEV && console.log(`329 PART III. Run through CSS Tree parser.`);
    //   const temp = cssTreeValidate(`@media ${resolvedStr} {}`);
    //   DEV && console.log(
    //     `332 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
    //       temp,
    //       null,
    //       4
    //     )}`
    //   );
    // }
  }

  // ---------------------------------------------------------------------------

  DEV &&
    console.log(
      `471 isMediaD(): ${`\u001b[${32}m${`FINAL RETURN`}\u001b[${39}m`}`
    );
  DEV &&
    console.log(
      `475 isMediaD(): ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
        res,
        null,
        4
      )}`
    );
  return res;
}

export { isMediaD, defaults, version };
