/**
 * is-media-descriptor
 * Is given string a valid media descriptor (including media query)?
 * Version: 1.2.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-media-descriptor
 */

import leven from 'leven';
import processCommaSep from 'string-process-comma-separated';

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
  "tv",
];
const recognisedMediaFeatures = [
  "width",
  "min-width",
  "max-width",
  "height",
  "min-height",
  "max-height",
  "aspect-ratio",
  "min-aspect-ratio",
  "max-aspect-ratio",
  "orientation",
  "resolution",
  "min-resolution",
  "max-resolution",
  "scan",
  "grid",
  "update",
  "overflow-block",
  "overflow-inline",
  "color",
  "min-color",
  "max-color",
  "color-index",
  "min-color-index",
  "max-color-index",
  "monochrome",
  "color-gamut",
  "pointer",
  "hover",
  "any-pointer",
  "any-hover",
];
const lettersOnlyRegex = /^\w+$/g;
function loop(str, opts, res) {
  let chunkStartsAt = null;
  const gatheredChunksArr = [];
  let whitespaceStartsAt = null;
  let nextCanBeMediaType = true;
  let nextCanBeMediaCondition = true;
  let nextCanBeNotOrOnly = true;
  let nextCanBeAnd = false;
  const bracketOpeningIndexes = [];
  for (let i = opts.idxFrom; i <= opts.idxTo; i++) {
    if (str[i] === ")") {
      const lastOpening = bracketOpeningIndexes.pop();
      const extractedValueWithinBrackets = str.slice(lastOpening + 1, i);
      if (
        !extractedValueWithinBrackets.includes("(") &&
        !extractedValueWithinBrackets.includes(")")
      ) {
        if (extractedValueWithinBrackets.match(lettersOnlyRegex)) {
          if (
            !recognisedMediaFeatures.includes(
              extractedValueWithinBrackets.toLowerCase().trim()
            )
          ) {
            res.push({
              idxFrom: lastOpening + 1 + opts.offset,
              idxTo: i + opts.offset,
              message: `Unrecognised "${extractedValueWithinBrackets.trim()}".`,
              fix: null,
            });
          }
        }
      }
      const regexFromAllKnownMediaTypes = new RegExp(
        recognisedMediaTypes.join("|"),
        "gi"
      );
      const findings =
        extractedValueWithinBrackets.match(regexFromAllKnownMediaTypes) || [];
      findings.forEach((mediaTypeFound) => {
        const startingIdx = str.indexOf(mediaTypeFound);
        res.push({
          idxFrom: startingIdx + opts.offset,
          idxTo: startingIdx + mediaTypeFound.length + opts.offset,
          message: `Media type "${mediaTypeFound}" inside brackets.`,
          fix: null,
        });
      });
    }
    if (str[i] === "(") {
      bracketOpeningIndexes.push(i);
    }
    if (str[i] && str[i].trim().length && whitespaceStartsAt !== null) {
      if (str[whitespaceStartsAt - 1] === "(" || str[i] === ")") {
        res.push({
          idxFrom: whitespaceStartsAt + opts.offset,
          idxTo: i + opts.offset,
          message: `Bad whitespace.`,
          fix: {
            ranges: [[whitespaceStartsAt + opts.offset, i + opts.offset]],
          },
        });
      } else if (whitespaceStartsAt < i - 1 || str[i - 1] !== " ") {
        let rangesFrom = whitespaceStartsAt + opts.offset;
        let rangesTo = i + opts.offset;
        let rangesInsert = " ";
        if (whitespaceStartsAt !== i - 1) {
          if (str[whitespaceStartsAt] === " ") {
            rangesFrom += 1;
            rangesInsert = null;
          } else if (str[i - 1] === " ") {
            rangesTo -= 1;
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
                : [rangesFrom, rangesTo],
            ],
          },
        });
      }
      whitespaceStartsAt = null;
    }
    if (str[i] && !str[i].trim().length && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
    }
    if (
      chunkStartsAt !== null &&
      (!str[i] || !str[i].trim().length) &&
      !bracketOpeningIndexes.length
    ) {
      const chunk = str.slice(chunkStartsAt, i);
      gatheredChunksArr.push(chunk.toLowerCase());
      if (
        nextCanBeAnd &&
        (!(nextCanBeMediaType || nextCanBeMediaCondition) || chunk === "and")
      ) {
        if (chunk.toLowerCase() !== "and") {
          res.push({
            idxFrom: chunkStartsAt + opts.offset,
            idxTo: i + opts.offset,
            message: `Expected "and", found "${chunk}".`,
            fix: null,
          });
        } else if (!str[i]) {
          res.push({
            idxFrom: chunkStartsAt + opts.offset,
            idxTo: i + opts.offset,
            message: `Dangling "${chunk}".`,
            fix: {
              ranges: [
                [
                  str.slice(0, chunkStartsAt).trimEnd().length + opts.offset,
                  i + opts.offset,
                ],
              ],
            },
          });
        }
        nextCanBeAnd = false;
        nextCanBeMediaCondition = true;
      } else if (nextCanBeNotOrOnly && ["not", "only"].includes(chunk)) {
        nextCanBeNotOrOnly = false;
        nextCanBeMediaCondition = false;
      } else if (nextCanBeMediaType || nextCanBeMediaCondition) {
        if (chunk.startsWith("(")) {
          if (nextCanBeMediaCondition) ; else {
            let message = `Media condition "${str.slice(
              chunkStartsAt,
              i
            )}" can't be here.`;
            if (gatheredChunksArr[gatheredChunksArr.length - 2] === "not") {
              message = `"not" can be only in front of media type.`;
            }
            res.push({
              idxFrom: chunkStartsAt + opts.offset,
              idxTo: i + opts.offset,
              message,
              fix: null,
            });
          }
        } else {
          if (nextCanBeMediaType) {
            if (recognisedMediaTypes.includes(chunk.toLowerCase())) {
              nextCanBeMediaType = false;
              nextCanBeMediaCondition = false;
            } else {
              let message = `Unrecognised "${chunk}".`;
              if (!chunk.match(/\w/g)) {
                message = `Strange symbol${
                  chunk.trim().length === 1 ? "" : "s"
                } "${chunk}".`;
              } else if (
                ["and", "only", "or", "not"].includes(chunk.toLowerCase())
              ) {
                message = `"${chunk}" instead of a media type.`;
              }
              res.push({
                idxFrom: chunkStartsAt + opts.offset,
                idxTo: i + opts.offset,
                message,
                fix: null,
              });
            }
          } else {
            let message = `Expected brackets on "${chunk}".`;
            let fix = null;
            let idxTo = i + opts.offset;
            if (["not", "else", "or"].includes(chunk.toLowerCase())) {
              message = `"${chunk}" can't be here.`;
            } else if (recognisedMediaTypes.includes(chunk.toLowerCase())) {
              message = `Unexpected media type, try using a comma.`;
            } else if (recognisedMediaFeatures.includes(chunk.toLowerCase())) {
              message = `Missing brackets.`;
              fix = {
                ranges: [
                  [
                    chunkStartsAt + opts.offset,
                    chunkStartsAt + opts.offset,
                    "(",
                  ],
                  [i + opts.offset, i + opts.offset, ")"],
                ],
              };
            } else if (str.slice(i).trim().startsWith(":")) {
              const valueWithoutColon = chunk.slice(0, i).trim();
              message = `Expected brackets on "${valueWithoutColon}" and its value.`;
              idxTo = chunkStartsAt + valueWithoutColon.length + opts.offset;
            }
            res.push({
              idxFrom: chunkStartsAt + opts.offset,
              idxTo,
              message,
              fix,
            });
            break;
          }
        }
        nextCanBeAnd = true;
      } else {
        res.push({
          idxFrom: chunkStartsAt + opts.offset,
          idxTo: i + opts.offset,
          message: `Unrecognised media type "${str.slice(chunkStartsAt, i)}".`,
          fix: null,
        });
      }
      chunkStartsAt = null;
      if (nextCanBeNotOrOnly) {
        nextCanBeNotOrOnly = false;
      }
    }
    if (
      chunkStartsAt === null &&
      str[i] &&
      str[i].trim().length &&
      str[i] !== ")"
    ) {
      if (str[i] === "(") ;
      chunkStartsAt = i;
    }
  }
}

function isMediaD(originalStr, originalOpts) {
  const defaults = {
    offset: 0,
  };
  const opts = { ...defaults, ...originalOpts };
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
  }
  if (!originalStr.trim()) {
    return [];
  }
  const res = [];
  let nonWhitespaceStart = 0;
  let nonWhitespaceEnd = originalStr.length;
  const str = originalStr.trim();
  if (originalStr !== originalStr.trim()) {
    const ranges = [];
    if (!originalStr[0].trim()) {
      for (let i = 0, len = originalStr.length; i < len; i++) {
        if (originalStr[i].trim()) {
          ranges.push([0 + opts.offset, i + opts.offset]);
          nonWhitespaceStart = i;
          break;
        }
      }
    }
    if (!originalStr[originalStr.length - 1].trim()) {
      for (let i = originalStr.length; i--; ) {
        if (originalStr[i].trim()) {
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
        ranges,
      },
    });
  }
  if (recognisedMediaTypes.includes(str)) {
    return res;
  }
  if (["only", "not"].includes(str)) {
    res.push({
      idxFrom: nonWhitespaceStart + opts.offset,
      idxTo: nonWhitespaceEnd + opts.offset,
      message: `Missing media type or condition.`,
      fix: null,
    });
  } else if (
    str.match(lettersOnlyRegex) &&
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
                recognisedMediaTypes[i],
              ],
            ],
          },
        });
        break;
      }
      if (i === len - 1) {
        res.push({
          idxFrom: nonWhitespaceStart + opts.offset,
          idxTo: nonWhitespaceEnd + opts.offset,
          message: `Unrecognised media type "${str}".`,
          fix: null,
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
        }
        if (curr === "(") {
          return [acc[0] + 1, acc[1]];
        }
        if (curr === ";") {
          res.push({
            idxFrom: idx + opts.offset,
            idxTo: idx + 1 + opts.offset,
            message: "Semicolon found!",
            fix: null,
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
        fix: null,
      });
    }
    if (openingBracketCount > closingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "More opening brackets than closing.",
        fix: null,
      });
    } else if (closingBracketCount > openingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "More closing brackets than opening.",
        fix: null,
      });
    }
    if (!res.length && str.match(/\(\s*\)/g)) {
      let lastOpening = null;
      let nonWhitespaceFound;
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i] === "(") {
          lastOpening = i;
          nonWhitespaceFound = false;
        } else if (str[i] === ")") {
          if (!nonWhitespaceFound) {
            res.push({
              idxFrom: lastOpening + opts.offset,
              idxTo: i + 1 + opts.offset,
              message: "Empty bracket pair.",
              fix: null,
            });
          } else {
            nonWhitespaceFound = true;
          }
        } else if (str[i].trim()) {
          nonWhitespaceFound = true;
        }
      }
    }
    if (res.length) {
      return res;
    }
    processCommaSep(str, {
      offset: opts.offset,
      leadingWhitespaceOK: false,
      trailingWhitespaceOK: false,
      oneSpaceAfterCommaOK: true,
      innerWhitespaceAllowed: true,
      separator: ",",
      cb: (idxFrom, idxTo) => {
        loop(
          str,
          {
            ...opts,
            idxFrom: idxFrom - opts.offset,
            idxTo: idxTo - opts.offset,
          },
          res
        );
      },
      errCb: (ranges, message) => {
      },
    });
  }
  return res;
}

export default isMediaD;
