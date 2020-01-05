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

function isMediaD(str, originalOpts) {
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
  if (typeof str !== "string") {
    return [];
  } else if (!str.trim().length) {
    return [];
  }

  // allows one non-letter among letters:
  const mostlyLettersRegex = /^\w+$|^\w*\W\w+$|^\w+\W\w*$/g;

  const res = [];

  // We pay extra attention to whitespace. These two below
  // mark the known index of the first and last non-whitespace
  // character (a'la trim)
  let nonWhitespaceStart = 0;
  let nonWhitespaceEnd = str.length;

  const trimmedStr = str.trim();

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
    const ranges = [];
    if (!str[0].trim().length) {
      // traverse forward
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i].trim().length) {
          ranges.push([0 + opts.offset, i + opts.offset]);
          nonWhitespaceStart = i;
          break;
        }
      }
    }
    if (!str[str.length - 1].trim().length) {
      // traverse backwards from the end
      for (let i = str.length; i--; ) {
        if (str[i].trim().length) {
          ranges.push([i + 1 + opts.offset, str.length + opts.offset]);
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
    `122 ██ working non-whitespace range: [${`\u001b[${35}m${nonWhitespaceStart}\u001b[${39}m`}, ${`\u001b[${35}m${nonWhitespaceEnd}\u001b[${39}m`}]`
  );

  // quick checks first - cover the most common cases, to make checks the
  // quickest possible when everything's all right
  if (recognisedMediaTypes.includes(trimmedStr)) {
    console.log(
      `129 whole string matched! ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`
    );
    return res;
  } else if (trimmedStr.match(mostlyLettersRegex)) {
    console.log(`133 mostly-letters clauses`);

    for (let i = 0, len = recognisedMediaTypes.length; i < len; i++) {
      console.log(
        `137 leven ${recognisedMediaTypes[i]} = ${leven(
          recognisedMediaTypes[i],
          trimmedStr
        )}`
      );
      if (leven(recognisedMediaTypes[i], trimmedStr) === 1) {
        console.log(`143 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
    }
  }

  // ---------------------------------------------------------------------------

  console.log(`165 ${`\u001b[${32}m${`FINAL RETURN`}\u001b[${39}m`}`);
  return res;
}

export default isMediaD;
