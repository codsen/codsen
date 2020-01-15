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

exports.loop = loop;
exports.recognisedMediaTypes = recognisedMediaTypes;
