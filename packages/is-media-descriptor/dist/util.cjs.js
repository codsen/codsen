'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
  "any-hover"
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
              fix: null
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
      findings.forEach(mediaTypeFound => {
        const startingIdx = str.indexOf(mediaTypeFound);
        res.push({
          idxFrom: startingIdx + opts.offset,
          idxTo: startingIdx + mediaTypeFound.length + opts.offset,
          message: `Media type "${mediaTypeFound}" inside brackets.`,
          fix: null
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
            fix: null
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
                  i + opts.offset
                ]
              ]
            }
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
              fix: null
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
                fix: null
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
                    "("
                  ],
                  [i + opts.offset, i + opts.offset, ")"]
                ]
              };
            } else if (
              str
                .slice(i)
                .trim()
                .startsWith(":")
            ) {
              const valueWithoutColon = chunk.slice(0, i).trim();
              message = `Expected brackets on "${valueWithoutColon}" and its value.`;
              idxTo = chunkStartsAt + valueWithoutColon.length + opts.offset;
            }
            res.push({
              idxFrom: chunkStartsAt + opts.offset,
              idxTo,
              message,
              fix
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
          fix: null
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

exports.lettersOnlyRegex = lettersOnlyRegex;
exports.loop = loop;
exports.recognisedMediaTypes = recognisedMediaTypes;
