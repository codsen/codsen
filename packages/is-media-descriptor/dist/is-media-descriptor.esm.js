/**
 * is-media-descriptor
 * Is given string a valid media descriptor (including media query)?
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-media-descriptor
 */

import leven from 'leven';

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
function isMediaD(str, originalOpts) {
  const defaults = {
    offset: 0
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (opts.offset && !Number.isInteger(opts.offset)) {
    throw new Error(
      `is-media-descriptor: [THROW_ID_01] opts.offset must be an integer, it was given as ${
        opts.offset
      } (type ${typeof opts.offset})`
    );
  }
  if (!opts.offset) {
    opts.offset = 0;
  }
  if (typeof str !== "string") {
    return [];
  } else if (!str.trim().length) {
    return [];
  }
  const mostlyLettersRegex = /^\w+$|^\w*\W\w+$|^\w+\W\w*$/g;
  const res = [];
  let nonWhitespaceStart = 0;
  let nonWhitespaceEnd = str.length;
  const trimmedStr = str.trim();
  if (str !== str.trim()) {
    const ranges = [];
    if (!str[0].trim().length) {
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i].trim().length) {
          ranges.push([0 + opts.offset, i + opts.offset]);
          nonWhitespaceStart = i;
          break;
        }
      }
    }
    if (!str[str.length - 1].trim().length) {
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
  if (recognisedMediaTypes.includes(trimmedStr)) {
    return res;
  } else if (trimmedStr.match(mostlyLettersRegex)) {
    for (let i = 0, len = recognisedMediaTypes.length; i < len; i++) {
      if (leven(recognisedMediaTypes[i], trimmedStr) === 1) {
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
  return res;
}

export default isMediaD;
