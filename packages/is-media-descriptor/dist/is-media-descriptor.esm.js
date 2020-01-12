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
function isMediaD(originalStr, originalOpts) {
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
  if (typeof originalStr !== "string") {
    return [];
  } else if (!originalStr.trim().length) {
    return [];
  }
  const mostlyLettersRegex = /^\w+$/g;
  const res = [];
  let nonWhitespaceStart = 0;
  let nonWhitespaceEnd = originalStr.length;
  const str = originalStr.trim();
  if (originalStr !== originalStr.trim()) {
    const ranges = [];
    if (!originalStr[0].trim().length) {
      for (let i = 0, len = originalStr.length; i < len; i++) {
        if (originalStr[i].trim().length) {
          ranges.push([0 + opts.offset, i + opts.offset]);
          nonWhitespaceStart = i;
          break;
        }
      }
    }
    if (!originalStr[originalStr.length - 1].trim().length) {
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
  if (recognisedMediaTypes.includes(str)) {
    return res;
  } else if (["only", "not"].includes(str)) {
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
    for (let i = 0, len = recognisedMediaTypes.length; i < len; i++) {
      if (leven(recognisedMediaTypes[i], str) === 1) {
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
        res.push({
          idxFrom: nonWhitespaceStart + opts.offset,
          idxTo: nonWhitespaceEnd + opts.offset,
          message: `Unrecognised media type "${str}".`,
          fix: null
        });
      }
    }
  } else {
    let wrongOrder = false;
    const [openingBracketCount, closingBracketCount] = Array.from(str).reduce(
      (acc, curr) => {
        if (curr === ")") {
          if (!wrongOrder && acc[1] + 1 > acc[0]) {
            wrongOrder = true;
          }
          return [acc[0], acc[1] + 1];
        } else if (curr === "(") {
          return [acc[0] + 1, acc[1]];
        }
        return acc;
      },
      [0, 0]
    );
    if (wrongOrder && openingBracketCount === closingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "Some closing brackets are before their opening counterparts.",
        fix: null
      });
    }
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
      return res;
    }
    let chunkStartsAt = null;
    let mediaTypeOrMediaConditionNext = true;
    for (let i = 0, len = str.length; i <= len; i++) {
      if (chunkStartsAt !== null && (!str[i] || !str[i].trim().length)) {
        const chunk = str.slice(chunkStartsAt, i);
        if (mediaTypeOrMediaConditionNext) {
          if (chunk.startsWith("(")) ; else {
            if (["only", "not"].includes(chunk.toLowerCase())) ; else if (recognisedMediaTypes.includes(chunk.toLowerCase())) {
              mediaTypeOrMediaConditionNext = false;
            } else {
              res.push({
                idxFrom: chunkStartsAt + opts.offset,
                idxTo: i + opts.offset,
                message: `Unrecognised media type "${str.slice(
                  chunkStartsAt,
                  i
                )}".`,
                fix: null
              });
              break;
            }
          }
        }
        chunkStartsAt = null;
      }
      if (chunkStartsAt === null && str[i] && str[i].trim().length) {
        chunkStartsAt = i;
      }
    }
  }
  return res;
}

export default isMediaD;
