import leven from "leven";

const recognisedMediaTypes = [
  "all",
  "aural",
  "braille",
  "embossed",
  "handheld",
  "print",
  "projection",
  "screen",
  "speech",
  "tty",
  "tv"
];

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
      `058 early exit, ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} []`
    );
    return [];
  } else if (!originalStr.trim().length) {
    console.log(
      `063 early exit, ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} []`
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
    `128 ██ working non-whitespace range: [${`\u001b[${35}m${nonWhitespaceStart}\u001b[${39}m`}, ${`\u001b[${35}m${nonWhitespaceEnd}\u001b[${39}m`}]`
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
      `152 whole string matched! ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`
    );
    return res;
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
    console.log(`177 mostly-letters clauses`);

    for (let i = 0, len = recognisedMediaTypes.length; i < len; i++) {
      console.log(
        `181 leven ${recognisedMediaTypes[i]} = ${leven(
          recognisedMediaTypes[i],
          str
        )}`
      );
      if (leven(recognisedMediaTypes[i], str) === 1) {
        console.log(`187 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
        console.log(`207 end reached`);
        console.log(
          `209 PUSH [${`\u001b[${33}m${nonWhitespaceStart +
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
          `220 ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
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
    // 3. mixed, like "screen"
    //
    //
    //
    //
    //
    //
    //
    //

    // THE MAIN LOOP
    // ---------------------------------------------------------------------------

    let chunkStartsAt = null;

    console.log(`253 get to business, loop through`);
    for (let i = 0, len = str.length; i <= len; i++) {
      //

      //
      //
      //
      //
      //                                THE TOP
      //                                ███████
      //
      //
      //
      //

      // Logging:
      // -------------------------------------------------------------------------
      console.log(
        `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
          str[i] && str[i].trim().length
            ? str[i]
            : JSON.stringify(str[i], null, 4)
        }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
      );

      //
      //
      //
      //
      //                               MIDDLE
      //                               ██████
      //
      //
      //
      //

      // catch the ending of a chunk
      // we deliberately wander outside of the string length by 1 character
      // to simplify calculations and to shake up the type complaceancy,
      // str[i] can be undefined now (on the last traversal cycle)!
      if (chunkStartsAt !== null && (!str[i] || !str[i].trim().length)) {
        // extract the value:
        const chunk = str.slice(chunkStartsAt, i);
        console.log(`296 extracted: "${`\u001b[${33}m${chunk}\u001b[${39}m`}"`);

        // reset
        chunkStartsAt = null;
        console.log(
          `301 RESET ${`\u001b[${32}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}`
        );
      }

      // catch the beginning of a chunk, without brackets like "print" or
      // with brackets like (min-resolution: 300dpi)
      if (chunkStartsAt === null && str[i] && str[i].trim().length) {
        chunkStartsAt = i;
        console.log(
          `310 SET ${`\u001b[${32}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}`
        );
      }

      //
      //
      //
      //
      //                               BOTTOM
      //                               ██████
      //
      //
      //
      //

      // LOGGING
      console.log(
        `${`\u001b[${90}m${`chunkStartsAt: ${chunkStartsAt}`}\u001b[${39}m`}`
      );
    }
  }

  // ---------------------------------------------------------------------------

  console.log(`334 ${`\u001b[${32}m${`FINAL RETURN`}\u001b[${39}m`}`);
  console.log(
    `336 ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}`
  );
  return res;
}

export default isMediaD;
