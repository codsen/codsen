/**
 * is-media-descriptor
 * Is given string a valid media descriptor (including media query)?
 * Version: 0.1.0
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
function isMediaD(str, offset = 0) {
  if (typeof str !== "string") {
    return [];
  } else if (!str.trim().length) {
    return [];
  }
  if (!Number.isInteger(offset)) {
    offset = 0;
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
          ranges.push([0, i]);
          nonWhitespaceStart = i;
          break;
        }
      }
    }
    if (!str[str.length - 1].trim().length) {
      for (let i = str.length; i--; ) {
        if (str[i].trim().length) {
          ranges.push([i + 1, str.length]);
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
          idxFrom: nonWhitespaceStart,
          idxTo: nonWhitespaceEnd,
          message: `Did you mean "${recognisedMediaTypes[i]}"?`,
          fix: {
            ranges: [
              [nonWhitespaceStart, nonWhitespaceEnd, recognisedMediaTypes[i]]
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
