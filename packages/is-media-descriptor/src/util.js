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

// eslint-disable-next-line no-unused-vars
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

// eslint-disable-next-line no-unused-vars
const deprecatedMediaFeatures = [
  "device-width",
  "min-device-width",
  "max-device-width",
  "device-height",
  "min-device-height",
  "max-device-height",
  "device-aspect-ratio",
  "min-device-aspect-ratio",
  "max-device-aspect-ratio"
];

function loop(str, opts, res) {
  let chunkStartsAt = null;
  let mediaTypeOrMediaConditionNext = true;
  const gatheredChunksArr = [];
  let whitespaceStartsAt = null;
  let chunkWithinBrackets = false;

  // here we keep a note where we are bracket-wise, how deep
  const bracketOpeningIndexes = [];

  console.log(`072 get to business, loop through`);

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

    // catch closing bracket
    if (str[i] === ")") {
      console.log(
        `112 caught closing bracket, ${`\u001b[${31}m${`POP`}\u001b[${39}m`}`
      );
      const lastOpening = bracketOpeningIndexes.pop();
      console.log(
        `116 extracted bracket contents: "${str.slice(lastOpening + 1, i)}"`
      );

      // call recursively
      console.log(
        `121 ██ recursion starts ██ - offset: opts.offset=${
          opts.offset
        } + chunkStartsAt=${chunkStartsAt} => ${opts.offset + chunkStartsAt}`
      );
      loop(
        str.slice(lastOpening + 1, i),
        Object.assign({}, opts, {
          offset: opts.offset + chunkStartsAt
        }),
        res
      );
      console.log(`██ recursion ends ██ back where str: "${str}" and i: ${i}`);
    }

    // catch opening bracket
    if (str[i] === "(") {
      console.log(`137 caught opening bracket`);
      bracketOpeningIndexes.push(i);
      console.log(
        `140 after ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}, ${`\u001b[${33}m${`bracketOpeningIndexes`}\u001b[${39}m`}: ${JSON.stringify(
          bracketOpeningIndexes,
          null,
          4
        )}`
      );
    }

    // catch the ending of a whitespace chunk
    if (str[i] && str[i].trim().length && whitespaceStartsAt !== null) {
      if (str[whitespaceStartsAt - 1] === "(" || str[i] === ")") {
        // if it's whitespace inside brackets, wipe it
        console.log(
          `153 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartsAt}, ${i}]`
        );
        res.push({
          idxFrom: whitespaceStartsAt + opts.offset, // reporting is always whole whitespace
          idxTo: i + opts.offset, // reporting is always whole whitespace
          message: `Bad whitespace.`,
          fix: {
            ranges: [[whitespaceStartsAt + opts.offset, i + opts.offset]]
          }
        });
      } else if (whitespaceStartsAt < i - 1 || str[i - 1] !== " ") {
        console.log(
          `165 ${`\u001b[${31}m${`BAD WHITESPACE CAUGHT`}\u001b[${39}m`}`
        );
        // Depends what whitespace is this. We aim to remove minimal amount
        // of characters possible. If there is excessive whitespace, we'll
        // delete all spaces except one instead of deleting all spaces and
        // inserting a space. That's to minimize the footprint of amends,
        // also to make merged ranges simpler later.

        // defaults is whole thing replacement:
        let rangesFrom = whitespaceStartsAt + opts.offset;
        let rangesTo = i + opts.offset;
        let rangesInsert = " ";
        // if whitespace chunk is longer than one, let's try to cut corners:
        if (whitespaceStartsAt !== i - 1) {
          console.log(`179 A MULTIPLE WHITESPACE CHARS`);
          if (str[whitespaceStartsAt] === " ") {
            rangesFrom++;
            rangesInsert = null;
          } else if (str[i - 1] === " ") {
            rangesTo--;
            rangesInsert = null;
          }
        }
        console.log(
          `189 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartsAt +
            opts.offset}, ${i + opts.offset}]`
        );
        res.push({
          idxFrom: whitespaceStartsAt + opts.offset, // reporting is always whole whitespace
          idxTo: i + opts.offset, // reporting is always whole whitespace
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

      // reset
      whitespaceStartsAt = null;
      console.log(
        `209 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = null`
      );
    }

    // catch the beginning of a whitespace chunk
    if (str[i] && !str[i].trim().length && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
      console.log(
        `217 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = ${whitespaceStartsAt}`
      );
    }

    // catch the ending of a chunk
    // we deliberately wander outside of the string length by 1 character
    // to simplify calculations and to shake up the type complaceancy,
    // str[i] can be undefined now (on the last traversal cycle)!
    if (
      chunkStartsAt !== null &&
      (!str[i] || !str[i].trim().length || "():".includes(str[i]))
    ) {
      // extract the value:
      const chunk = str.slice(chunkStartsAt, i);
      gatheredChunksArr.push(chunk);
      console.log(
        `233 extracted chunk: "${`\u001b[${33}m${chunk}\u001b[${39}m`}"`
      );

      // we use mediaTypeOrMediaConditionNext to establish where we are
      // logically - media type/condition might be preceded by not/only or
      // might be not - that's why we need this flag, to distinguish these
      // two cases
      if (mediaTypeOrMediaConditionNext) {
        console.log(
          `242 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`mediaTypeOrMediaConditionNext`}\u001b[${39}m`} was true`
        );
        // check is the current chunk wrapped with brackets, because if so,
        // it is media type, and otherwise, it's media condition
        // see https://drafts.csswg.org/mediaqueries/#media for more

        if (["only", "not"].includes(chunk.toLowerCase())) {
          console.log(
            `250 ${`\u001b[${32}m${`CHUNK MATCHED WITH MODIFIER ONLY/NOT`}\u001b[${39}m`}`
          );
          // check for repetition, like "@media only not"
          if (
            gatheredChunksArr.length > 1 &&
            ["only", "not"].includes(
              gatheredChunksArr[gatheredChunksArr.length - 1]
            )
          ) {
            console.log(
              `260 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${chunkStartsAt +
                opts.offset}, ${i + opts.offset}]`
            );
            res.push({
              idxFrom: chunkStartsAt + opts.offset,
              idxTo: i + opts.offset,
              message: `"${chunk}" instead of a media type.`,
              fix: null
            });
            // console.log(`195 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
            // break;
          }
        } else if (["and"].includes(chunk.toLowerCase())) {
          console.log(
            `274 ${`\u001b[${32}m${`CHUNK MATCHED WITH JOINER AND`}\u001b[${39}m`}`
          );
          // check for missing bits, like "@media only and"
          console.log(
            `278 ${`\u001b[${33}m${`gatheredChunksArr`}\u001b[${39}m`} = ${JSON.stringify(
              gatheredChunksArr,
              null,
              4
            )}`
          );
          // if the chunk in front was "only" or "not", it's an error
          if (
            gatheredChunksArr.length > 1 &&
            ["only", "not"].includes(
              gatheredChunksArr[gatheredChunksArr.length - 2]
            )
          ) {
            console.log(
              `292 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${chunkStartsAt +
                opts.offset}, ${i + opts.offset}]`
            );
            res.push({
              idxFrom: chunkStartsAt + opts.offset,
              idxTo: i + opts.offset,
              message: `"${chunk}" instead of a media type.`,
              fix: null
            });
            // console.log(`224 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
            // break;
          }
        } else if (recognisedMediaTypes.includes(chunk.toLowerCase())) {
          console.log(
            `306 ${`\u001b[${32}m${`CHUNK MATCHED WITH A KNOWN MEDIA TYPE`}\u001b[${39}m`}`
          );
          mediaTypeOrMediaConditionNext = false;
          console.log(
            `310 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`mediaTypeOrMediaConditionNext`}\u001b[${39}m`} = ${mediaTypeOrMediaConditionNext}`
          );
        } else {
          // it's an error, something is not recognised
          console.log(
            `315 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} an error [${chunkStartsAt +
              opts.offset}, ${i + opts.offset}]`
          );
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

          console.log(
            `330 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${chunkStartsAt +
              opts.offset}, ${i + opts.offset}]`
          );
          res.push({
            idxFrom: chunkStartsAt + opts.offset,
            idxTo: i + opts.offset,
            message,
            fix: null
          });
          console.log(`339 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`}`);
          return;
        }
      } else {
        console.log(
          `344 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`mediaTypeOrMediaConditionNext`}\u001b[${39}m`} was false`
        );
        // if flag "mediaTypeOrMediaConditionNext" is false, this means we are
        // currently located at after the media type or media condition,
        // for example, where <here> marks below:
        // "@media screen <here>" or "@media (color) <here>"
        if (chunk === "and") {
          console.log(
            `352 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`mediaTypeOrMediaConditionNext`}\u001b[${39}m`} = true`
          );
          mediaTypeOrMediaConditionNext = true;
        } else {
          console.log(
            `357 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${chunkStartsAt +
              opts.offset}, ${i + opts.offset}]`
          );
          res.push({
            idxFrom: chunkStartsAt + opts.offset,
            idxTo: i + opts.offset,
            message: `Unrecognised media type "${str.slice(
              chunkStartsAt,
              i
            )}".`,
            fix: null
          });
          // console.log(`274 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
          // break;
        }
      }

      // reset
      chunkStartsAt = null;
      console.log(
        `377 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${32}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}; ${`\u001b[${32}m${`chunkWithinBrackets`}\u001b[${39}m`} = ${chunkWithinBrackets}`
      );
      chunkWithinBrackets = false;
    }

    // catch the beginning of a chunk, without brackets like "print" or
    // with brackets like (min-resolution: 300dpi)
    if (
      chunkStartsAt === null &&
      str[i] &&
      str[i].trim().length &&
      str[i] !== ")"
    ) {
      // Deliberately we keep chunk opening clauses and logic which
      // determines is chunk within brackets, together.
      // That's to potentially avoid logic clause mishaps later.

      if (str[i] === "(") {
        chunkWithinBrackets = true;
        console.log(
          `397 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkWithinBrackets`}\u001b[${39}m`} = ${chunkWithinBrackets}`
        );
      } else if (str[i] !== "(") {
        // chunk within brackets will be fed recursively so we don't
        // process content after opening chunk - when closing bracket
        // will be found, brackets content will be extracted and
        // program will be ran recursively
        chunkStartsAt = i;
        console.log(
          `406 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${32}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}`
        );
      }
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
    console.log(
      `${`\u001b[${90}m${`chunkWithinBrackets: ${chunkWithinBrackets}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`whitespaceStartsAt: ${whitespaceStartsAt}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`mediaTypeOrMediaConditionNext: ${mediaTypeOrMediaConditionNext}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`gatheredChunksArr: ${JSON.stringify(
        gatheredChunksArr,
        null,
        0
      )}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`bracketOpeningIndexes: ${JSON.stringify(
        bracketOpeningIndexes,
        null,
        0
      )}`}\u001b[${39}m`}`
    );
  }
}

export { loop, recognisedMediaTypes };
