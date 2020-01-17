/**
 * is-media-descriptor
 * Is given string a valid media descriptor (including media query)?
 * Version: 1.1.0
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
function loop(str, opts, res) {
  let chunkStartsAt = null;
  let mediaTypeOrMediaConditionNext = true;
  const gatheredChunksArr = [];
  let whitespaceStartsAt = null;
  let chunkWithinBrackets = false;
  for (let i = 0, len = str.length; i <= len; i++) {
    if (str[i] === ")") ;
    if (str[i] === "(") ;
    if (str[i] && str[i].trim().length && whitespaceStartsAt !== null) {
      if (str[whitespaceStartsAt - 1] === "(" || str[i] === ")") {
        res.push({
          idxFrom: whitespaceStartsAt + opts.offset,
          idxTo: i + opts.offset,
          message: `Bad whitespace.`,
          fix: {
            ranges: [[whitespaceStartsAt + opts.offset, i + opts.offset]]
          }
        });
      } else if (whitespaceStartsAt < i - 1 || str[i - 1] !== " ") {
        let rangesFrom = whitespaceStartsAt + opts.offset;
        let rangesTo = i + opts.offset;
        let rangesInsert = " ";
        if (whitespaceStartsAt !== i - 1) {
          if (str[whitespaceStartsAt] === " ") {
            rangesFrom++;
            rangesInsert = null;
          } else if (str[i - 1] === " ") {
            rangesTo--;
            rangesInsert = null;
          }
        }
        res.push({
          idxFrom: whitespaceStartsAt + opts.offset,
          idxTo: i + opts.offset,
          message: `Bad whitespace.`,
          fix: {
            ranges: [
              rangesInsert
                ? [rangesFrom, rangesTo, " "]
                : [rangesFrom, rangesTo]
            ]
          }
        });
      }
      whitespaceStartsAt = null;
    }
    if (str[i] && !str[i].trim().length && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
    }
    if (
      chunkStartsAt !== null &&
      (!str[i] || !str[i].trim().length || "():".includes(str[i]))
    ) {
      const chunk = str.slice(chunkStartsAt, i);
      gatheredChunksArr.push(chunk);
      if (mediaTypeOrMediaConditionNext) {
        if (["only", "not"].includes(chunk.toLowerCase())) {
          if (
            gatheredChunksArr.length > 1 &&
            ["only", "not"].includes(
              gatheredChunksArr[gatheredChunksArr.length - 1]
            )
          ) {
            res.push({
              idxFrom: chunkStartsAt + opts.offset,
              idxTo: i + opts.offset,
              message: `"${chunk}" instead of a media type.`,
              fix: null
            });
          }
        } else if (["and"].includes(chunk.toLowerCase())) {
          if (
            gatheredChunksArr.length > 1 &&
            ["only", "not"].includes(
              gatheredChunksArr[gatheredChunksArr.length - 2]
            )
          ) {
            res.push({
              idxFrom: chunkStartsAt + opts.offset,
              idxTo: i + opts.offset,
              message: `"${chunk}" instead of a media type.`,
              fix: null
            });
          }
        } else if (recognisedMediaTypes.includes(chunk.toLowerCase())) {
          mediaTypeOrMediaConditionNext = false;
        } else {
          const chunksValue = str.slice(chunkStartsAt, i);
          let message = `Unrecognised "${chunksValue}".`;
          if (chunksValue.includes("-")) {
            message = `Brackets missing around "${chunksValue}"${
              str[i] === ":" ? ` and its value` : ""
            }.`;
          }
          if (chunksValue && chunksValue.length && chunksValue.length === 1) {
            message = `Strange symbol "${chunksValue}".`;
          }
          res.push({
            idxFrom: chunkStartsAt + opts.offset,
            idxTo: i + opts.offset,
            message,
            fix: null
          });
          return;
        }
      } else {
        if (chunk === "and") {
          mediaTypeOrMediaConditionNext = true;
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
        }
      }
      chunkStartsAt = null;
      chunkWithinBrackets = false;
    }
    if (
      chunkStartsAt === null &&
      str[i] &&
      str[i].trim().length &&
      str[i] !== ")"
    ) {
      if (str[i] === "(") {
        chunkWithinBrackets = true;
      } else if (!chunkWithinBrackets) {
        chunkStartsAt = i;
      }
    }
  }
}

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
      (acc, curr, idx) => {
        if (curr === ")") {
          if (!wrongOrder && acc[1] + 1 > acc[0]) {
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
    loop(str, opts, res);
  }
  return res;
}

export default isMediaD;
