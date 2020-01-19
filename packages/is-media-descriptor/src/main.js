import leven from "leven";
// import cssTreeValidate from "./cssTreeValidate";
import { loop, recognisedMediaTypes } from "./util";

// const recognisedValues = [
//   "width",
//   "height",
//   "device-width",
//   "device-height",
//   "orientation",
//   "aspect-ratio",
//   "device-aspect-ratio",
//   "color",
//   "color-index",
//   "monochrome",
//   "resolution",
//   "scan",
//   "grid"
// ];

// Reference used:
// https://drafts.csswg.org/mediaqueries/

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
      `046 early exit, ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} []`
    );
    return [];
  } else if (!originalStr.trim().length) {
    console.log(
      `051 early exit, ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} []`
    );
    return [];
  }

  // allows one non-letter among letters:
  const mostlyLettersRegex = /^\w+$/g;

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
    `116 ██ working non-whitespace range: [${`\u001b[${35}m${nonWhitespaceStart}\u001b[${39}m`}, ${`\u001b[${35}m${nonWhitespaceEnd}\u001b[${39}m`}]`
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
      `140 whole string matched! ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`
    );
    return res;
  } else if (["only", "not"].includes(str)) {
    console.log(
      `145 PUSH [${nonWhitespaceStart + opts.offset}, ${nonWhitespaceEnd +
        opts.offset}]`
    );
    res.push({
      idxFrom: nonWhitespaceStart + opts.offset,
      idxTo: nonWhitespaceEnd + opts.offset,
      message: `Missing media type or condition.`,
      fix: null
    });
  } else if (
    str.match(mostlyLettersRegex) &&
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
    console.log(`176 mostly-letters clauses`);

    for (let i = 0, len = recognisedMediaTypes.length; i < len; i++) {
      console.log(
        `180 leven ${recognisedMediaTypes[i]} = ${leven(
          recognisedMediaTypes[i],
          str
        )}`
      );
      if (leven(recognisedMediaTypes[i], str) === 1) {
        console.log(`186 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
        console.log(`206 end reached`);
        console.log(
          `208 PUSH [${`\u001b[${33}m${nonWhitespaceStart +
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
          `219 ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
            res,
            null,
            4
          )}`
        );
      }
      // if break hasn't been triggered yet, if this row has been reached,
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

    console.log(`250 PART I. Preliminary checks.`);

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
              `263 set ${`\u001b[${33}m${`wrongOrder`}\u001b[${39}m`} = true`
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
        `287 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} the wrong order error`
      );
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "Some closing brackets are before their opening counterparts.",
        fix: null
      });
    }
    console.log(
      `297 ${`\u001b[${33}m${`openingBracketCount`}\u001b[${39}m`} = ${JSON.stringify(
        openingBracketCount,
        null,
        4
      )}`
    );
    console.log(
      `304 ${`\u001b[${33}m${`closingBracketCount`}\u001b[${39}m`} = ${JSON.stringify(
        closingBracketCount,
        null,
        4
      )}`
    );

    // these are the "normal" errors - reporting that there were more one kind
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

    if (res.length) {
      // report errors early, save resources
      console.log(`331 early ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);
      return res;
    }

    // PART 2.
    // ███████████████████████████████████████

    console.log(`338 PART II. The main loop.`);
    loop(str, opts, res);

    // PART 3.
    // ███████████████████████████████████████

    if (!res.length) {
      // finally, if no errors were caught, parse:
      console.log(`346 PART III. Run through CSS Tree parser.`);
      // TODO
    }
  }

  // ---------------------------------------------------------------------------

  console.log(`353 ${`\u001b[${32}m${`FINAL RETURN`}\u001b[${39}m`}`);
  console.log(
    `355 ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  return res;
}

export default isMediaD;
