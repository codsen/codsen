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

  // here we keep a note where we are bracket-wise, how deep
  const bracketOpeningIndexes = [];

  console.log(`025 get to business, loop through`);

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
        `065 caught closing bracket, ${`\u001b[${31}m${`POP`}\u001b[${39}m`}`
      );
      const lastOpening = bracketOpeningIndexes.pop();
      console.log(
        `069 extracted bracket contents: "${str.slice(lastOpening + 1, i)}"`
      );
    }

    // catch opening bracket
    if (str[i] === "(") {
      console.log(`075 caught opening bracket`);
      bracketOpeningIndexes.push(i);
      console.log(
        `078 after ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}, ${`\u001b[${33}m${`bracketOpeningIndexes`}\u001b[${39}m`}: ${JSON.stringify(
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
        console.log(`090 PUSH [${whitespaceStartsAt}, ${i}]`);
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
          `101 ${`\u001b[${31}m${`BAD WHITESPACE CAUGHT`}\u001b[${39}m`}`
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
          console.log(`115 A MULTIPLE WHITESPACE CHARS`);
          if (str[whitespaceStartsAt] === " ") {
            rangesFrom++;
            rangesInsert = null;
          } else if (str[i - 1] === " ") {
            rangesTo--;
            rangesInsert = null;
          }
        }
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
        `141 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = null`
      );
    }

    // catch the beginning of a whitespace chunk
    if (str[i] && !str[i].trim().length && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
      console.log(
        `149 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = ${whitespaceStartsAt}`
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
        `165 extracted chunk: "${`\u001b[${33}m${chunk}\u001b[${39}m`}"`
      );

      // we use mediaTypeOrMediaConditionNext to establish where we are
      // logically - media type/condition might be preceded by not/only or
      // might be not - that's why we need this flag, to distinguish these
      // two cases
      if (mediaTypeOrMediaConditionNext) {
        console.log(
          `174 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`mediaTypeOrMediaConditionNext`}\u001b[${39}m`} was true`
        );
        // check is the current chunk wrapped with brackets, because if so,
        // it is media type, and otherwise, it's media condition
        // see https://drafts.csswg.org/mediaqueries/#media for more

        if (["only", "not"].includes(chunk.toLowerCase())) {
          console.log(
            `182 ${`\u001b[${32}m${`CHUNK MATCHED WITH MODIFIER ONLY/NOT`}\u001b[${39}m`}`
          );
          // check for repetition, like "@media only not"
          if (
            gatheredChunksArr.length > 1 &&
            ["only", "not"].includes(
              gatheredChunksArr[gatheredChunksArr.length - 1]
            )
          ) {
            console.log(`191 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
            `203 ${`\u001b[${32}m${`CHUNK MATCHED WITH JOINER AND`}\u001b[${39}m`}`
          );
          // check for missing bits, like "@media only and"
          console.log(
            `207 ${`\u001b[${33}m${`gatheredChunksArr`}\u001b[${39}m`} = ${JSON.stringify(
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
            console.log(`220 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`);
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
            `232 ${`\u001b[${32}m${`CHUNK MATCHED WITH A KNOWN MEDIA TYPE`}\u001b[${39}m`}`
          );
          mediaTypeOrMediaConditionNext = false;
          console.log(
            `236 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`mediaTypeOrMediaConditionNext`}\u001b[${39}m`} = ${mediaTypeOrMediaConditionNext}`
          );
        } else {
          // it's an error, something is not recognised
          console.log(`240 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} an error`);
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
          console.log(`258 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`}`);
          return;
        }
      } else {
        console.log(
          `263 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`mediaTypeOrMediaConditionNext`}\u001b[${39}m`} was false`
        );
        // if flag "mediaTypeOrMediaConditionNext" is false, this means we are
        // currently located at after the media type or media condition,
        // for example, where <here> marks below:
        // "@media screen <here>" or "@media (color) <here>"
        if (chunk === "and") {
          console.log(
            `271 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`mediaTypeOrMediaConditionNext`}\u001b[${39}m`} = true`
          );
          mediaTypeOrMediaConditionNext = true;
        } else {
          console.log(`275 PUSH an error`);
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
        `293 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${32}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}; ${`\u001b[${32}m${`chunkWithinBrackets`}\u001b[${39}m`} = ${chunkWithinBrackets}`
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
          `313 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkWithinBrackets`}\u001b[${39}m`} = ${chunkWithinBrackets}`
        );
      } else if (!chunkWithinBrackets) {
        // chunk within brackets will be fed recursively so we don't
        // process content after opening chunk - when closing bracket
        // will be found, brackets content will be extracted and
        // program will be ran recursively
        chunkStartsAt = i;
        console.log(
          `322 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${32}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}`
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
