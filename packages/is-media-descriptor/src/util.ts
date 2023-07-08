import { Range, Ranges } from "../../../ops/typedefs/common";

declare let DEV: boolean;

interface Opts {
  offset: number;
}

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
  "any-hover",
];

// TODO:
// const deprecatedMediaFeatures = [
//   "device-width",
//   "min-device-width",
//   "max-device-width",
//   "device-height",
//   "min-device-height",
//   "max-device-height",
//   "device-aspect-ratio",
//   "min-device-aspect-ratio",
//   "max-device-aspect-ratio",
// ];

const lettersOnlyRegex = /^\w+$/g;

interface LoopOpts extends Opts {
  idxFrom: number;
  idxTo: number;
}

interface ResObj {
  idxFrom: number;
  idxTo: number;
  message: string;
  fix: { ranges: Ranges } | null;
}

function loop(str: string, opts: LoopOpts, res: ResObj[]): void {
  // opts.offset is passed but we don't Object.assign for perf reasons

  let chunkStartsAt = null;
  let gatheredChunksArr = [];
  let whitespaceStartsAt = null;
  let chunkWithinBrackets = false;

  // upcoming chunk expectation flags:
  let nextCanBeMediaType = true;
  let nextCanBeMediaCondition = true;
  let nextCanBeNotOrOnly = true;
  let nextCanBeAnd = false;

  // here we keep a note where we are bracket-wise, how deep
  let bracketOpeningIndexes = [];

  DEV && console.log(`101 get to business, loop through`);

  for (let i = opts.idxFrom; i <= opts.idxTo; i++) {
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
    DEV &&
      console.log(
        `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
          str[i]?.trim().length ? str[i] : JSON.stringify(str[i], null, 4)
        }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`,
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
      DEV &&
        console.log(
          `141 caught closing bracket, ${`\u001b[${31}m${`POP`}\u001b[${39}m`}`,
        );
      let lastOpening = bracketOpeningIndexes.pop();
      let extractedValueWithinBrackets = str.slice(
        (lastOpening as number) + 1,
        i,
      );
      DEV &&
        console.log(
          `150 extracted last bracket contents: "${extractedValueWithinBrackets}"`,
        );

      // Preliminary check, will be improved later.
      // Idea: if extracted chunk in the brackets doesn't have any nested
      // brackets, we can evaluate it quickly, especially if it does not
      // contain colon.
      // For example we extracted "zzz" from:
      // screen and not (print and (zzz))
      if (
        !extractedValueWithinBrackets.includes("(") &&
        !extractedValueWithinBrackets.includes(")")
      ) {
        DEV && console.log(`163 util(): final chunk within brackets extracted`);
        if (extractedValueWithinBrackets.match(lettersOnlyRegex)) {
          DEV &&
            console.log(`166 util(): chunk within brackets is only letters`);
          if (
            !recognisedMediaFeatures.includes(
              extractedValueWithinBrackets.toLowerCase().trim(),
            )
          ) {
            DEV &&
              console.log(
                `174 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  (lastOpening as number) + 1
                }, ${i}]`,
              );
            res.push({
              idxFrom: (lastOpening as number) + 1 + opts.offset,
              idxTo: i + opts.offset,
              message: `Unrecognised "${extractedValueWithinBrackets.trim()}".`,
              fix: null,
            });
          }
        }
      }

      // everything nested like (screen and (color))
      // and contains media type
      let regexFromAllKnownMediaTypes = new RegExp(
        recognisedMediaTypes.join("|"),
        "gi",
      );
      let findings =
        extractedValueWithinBrackets.match(regexFromAllKnownMediaTypes) || [];

      findings.forEach((mediaTypeFound) => {
        let startingIdx = str.indexOf(mediaTypeFound);
        res.push({
          idxFrom: startingIdx + opts.offset,
          idxTo: startingIdx + mediaTypeFound.length + opts.offset,
          message: `Media type "${mediaTypeFound}" inside brackets.`,
          fix: null,
        });
      });
    }

    // catch the ending of a whitespace chunk
    if (str[i]?.trim().length && whitespaceStartsAt !== null) {
      if (str[whitespaceStartsAt - 1] === "(" || str[i] === ")") {
        // if it's whitespace inside brackets, wipe it
        DEV &&
          console.log(
            `214 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${whitespaceStartsAt}, ${i}]`,
          );
        res.push({
          idxFrom: whitespaceStartsAt + opts.offset, // reporting is always whole whitespace
          idxTo: i + opts.offset, // reporting is always whole whitespace
          message: `Bad whitespace.`,
          fix: {
            ranges: [
              [whitespaceStartsAt + opts.offset, i + opts.offset] as Range,
            ],
          },
        });
      } else if (whitespaceStartsAt < i - 1 || str[i - 1] !== " ") {
        DEV &&
          console.log(
            `229 ${`\u001b[${31}m${`BAD WHITESPACE CAUGHT`}\u001b[${39}m`}`,
          );
        // Depends what whitespace is this. We aim to remove minimal amount
        // of characters possible. If there is excessive whitespace, we'll
        // delete all spaces except one instead of deleting all spaces and
        // inserting a space. That's to minimize the footprint of amends,
        // also to make merged ranges simpler later.

        // defaults is whole thing replacement:
        let rangesFrom = whitespaceStartsAt + opts.offset;
        let rangesTo = i + opts.offset;
        let rangesInsert: string | null = " ";
        // if whitespace chunk is longer than one, let's try to cut corners:
        if (whitespaceStartsAt !== i - 1) {
          DEV && console.log(`243 A MULTIPLE WHITESPACE CHARS`);
          if (str[whitespaceStartsAt] === " ") {
            rangesFrom += 1;
            rangesInsert = null;
          } else if (str[i - 1] === " ") {
            rangesTo -= 1;
            rangesInsert = null;
          }
        }
        DEV &&
          console.log(
            `254 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
              whitespaceStartsAt + opts.offset
            }, ${i + opts.offset}]`,
          );
        res.push({
          idxFrom: whitespaceStartsAt + opts.offset, // reporting is always whole whitespace
          idxTo: i + opts.offset, // reporting is always whole whitespace
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

      // reset
      whitespaceStartsAt = null;
      DEV &&
        console.log(
          `276 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = null`,
        );
    }

    // catch the beginning of a whitespace chunk
    if (str[i] && !str[i].trim().length && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
      DEV &&
        console.log(
          `285 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = ${whitespaceStartsAt}`,
        );
    }

    // catch the ending of a chunk
    // we deliberately wander outside of the string length by 1 character
    // to simplify calculations and to shake up the type complaceancy,
    // str[i] can be undefined now (on the last traversal cycle)!
    if (
      chunkStartsAt !== null &&
      (!str[i]?.trim() ||
        // imagine screen and(min-width: 100px)
        //                   ^
        str[i] === "(") &&
      !bracketOpeningIndexes.length
    ) {
      DEV && console.log(`301 inside ending of a chunk clauses`);
      // extract the value:
      let chunk = str.slice(chunkStartsAt, i);
      gatheredChunksArr.push(chunk.toLowerCase());
      DEV &&
        console.log(
          `307 extracted chunk: "${`\u001b[${33}m${chunk}\u001b[${39}m`}"`,
        );

      // we use nextCanBeMediaTypeOrMediaCondition to establish where we are
      // logically - media type/condition might be preceded by not/only or
      // might be not - that's why we need this flag, to distinguish these
      // two cases
      if (
        nextCanBeAnd &&
        (!(nextCanBeMediaType || nextCanBeMediaCondition) || chunk === "and")
      ) {
        DEV &&
          console.log(`319 ${`\u001b[${36}m${`██`}\u001b[${39}m`} AND CLAUSES`);
        if (chunk.toLowerCase() !== "and") {
          DEV && console.log(`321 ERROR - "and" was expected`);
          DEV &&
            console.log(
              `324 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                chunkStartsAt + opts.offset
              }, ${i + opts.offset}]`,
            );
          res.push({
            idxFrom: chunkStartsAt + opts.offset,
            idxTo: i + opts.offset,
            message: `Expected "and", found "${chunk}".`,
            fix: null,
          });
        } else if (!str[i]) {
          DEV &&
            console.log(
              `337 ${`\u001b[${31}m${`last chunk can't be AND!`}\u001b[${39}m`}`,
            );
          DEV &&
            console.log(
              `341 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                chunkStartsAt + opts.offset
              }, ${i + opts.offset}]`,
            );
          res.push({
            idxFrom: chunkStartsAt + opts.offset,
            idxTo: i + opts.offset,
            message: `Dangling "${chunk}".`,
            fix: {
              ranges: [
                [
                  str.slice(0, chunkStartsAt).trim().length + opts.offset,
                  i + opts.offset,
                ],
              ],
            },
          });
        } else if (str[i].trim()) {
          DEV && console.log(`359 ERROR - space after "and" missing`);
          DEV &&
            console.log(
              `362 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                i + opts.offset
              }, ${i + opts.offset}, " "]`,
            );
          res.push({
            idxFrom: chunkStartsAt + opts.offset,
            idxTo: i + opts.offset,
            message: `Space after "and" missing.`,
            fix: { ranges: [[i + opts.offset, i + opts.offset, " "]] },
          });
        }

        nextCanBeAnd = false;
        nextCanBeMediaCondition = true;
        DEV &&
          console.log(
            `378 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nextCanBeAnd`}\u001b[${39}m`} = ${nextCanBeAnd}; ${`\u001b[${33}m${`nextCanBeMediaCondition`}\u001b[${39}m`} = ${nextCanBeMediaCondition}`,
          );
      } else if (nextCanBeNotOrOnly && ["not", "only"].includes(chunk)) {
        DEV &&
          console.log(
            `383 ${`\u001b[${36}m${`██`}\u001b[${39}m`} NOT/ONLY CLAUSES`,
          );
        nextCanBeNotOrOnly = false;
        DEV &&
          console.log(
            `388 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nextCanBeNotOrOnly`}\u001b[${39}m`} = ${nextCanBeNotOrOnly}`,
          );
        // nextCanBeMediaType stays true
        // but nextCanBeMediaCondition is now off because media conditions
        // can't be preceded by not/only
        // spec:
        //
        // <media-query> = <media-condition>
        //     | [ not | only ]? <media-type> [ and <media-condition-without-or> ]?
        // - https://www.w3.org/TR/mediaqueries-4/#typedef-media-condition
        //
        nextCanBeMediaCondition = false;
        DEV &&
          console.log(
            `402 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nextCanBeMediaCondition`}\u001b[${39}m`} = ${nextCanBeMediaCondition}`,
          );
      } else if (nextCanBeMediaType || nextCanBeMediaCondition) {
        DEV &&
          console.log(
            `407 ${`\u001b[${36}m${`██`}\u001b[${39}m`} MEDIA TYPE/CONDITION CLAUSES`,
          );

        // is it media type or media condition?
        if (chunk.startsWith("(")) {
          // resembles media condition
          DEV &&
            console.log(
              `415 ${`\u001b[${36}m${`chunk resembles media condition`}\u001b[${39}m`}`,
            );
          // is there a media condition allowed here?
          if (nextCanBeMediaCondition) {
            DEV &&
              console.log(`420 POSSIBLY FINE, MEDIA CONDITION IS EXPECTED`);
            // TODO
          } else {
            DEV && console.log(`423 ERROR, MEDIA CONDITION WAS NOT EXPECTED`);
            let message = `Media condition "${str.slice(
              chunkStartsAt,
              i,
            )}" can't be here.`;
            // try to pinpoint the error's cause:
            if (gatheredChunksArr[gatheredChunksArr.length - 2] === "not") {
              message = `"not" can be only in front of media type.`;
            }

            DEV &&
              console.log(
                `435 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  chunkStartsAt + opts.offset
                }, ${i + opts.offset}]`,
              );
            res.push({
              idxFrom: chunkStartsAt + opts.offset,
              idxTo: i + opts.offset,
              message,
              fix: null,
            });
          }
        } else {
          // resembles media type
          DEV &&
            console.log(
              `450 ${`\u001b[${36}m${`chunk resembles media type`}\u001b[${39}m`}`,
            );
          // is there a media type allowed here?
          if (nextCanBeMediaType) {
            DEV && console.log(`454 POSSIBLY FINE, MEDIA TYPE IS EXPECTED`);

            // is it a recognised type?
            if (recognisedMediaTypes.includes(chunk.toLowerCase())) {
              DEV &&
                console.log(
                  `460 ${`\u001b[${32}m${`CHUNK MATCHED WITH A KNOWN MEDIA TYPE`}\u001b[${39}m`}`,
                );
              nextCanBeMediaType = false;
              nextCanBeMediaCondition = false;
              DEV &&
                console.log(
                  `466 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nextCanBeMediaType`}\u001b[${39}m`} = ${nextCanBeMediaType}; ${`\u001b[${33}m${`nextCanBeMediaCondition`}\u001b[${39}m`} = ${nextCanBeMediaCondition}`,
                );
            } else {
              DEV &&
                console.log(
                  `471 ${`\u001b[${31}m${`ERROR`}\u001b[${39}m`} - this does not match any known media types`,
                );
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
              DEV &&
                console.log(
                  `485 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                    chunkStartsAt + opts.offset
                  }, ${i + opts.offset}], message: "${message}"`,
                );
              res.push({
                idxFrom: chunkStartsAt + opts.offset,
                idxTo: i + opts.offset,
                message,
                fix: null,
              });
            }
          } else {
            DEV &&
              console.log(
                `499 ERROR, MEDIA TYPE (OR SOMETHING BRACKET-LESS) WAS NOT EXPECTED`,
              );

            // as a last resort, let's check, maybe it's a known condition but without brackets?
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
              DEV && console.log(`523 ██ ... and its value`);
              let valueWithoutColon = chunk.slice(0, i).trim();
              message = `Expected brackets on "${valueWithoutColon}" and its value.`;
              idxTo = chunkStartsAt + valueWithoutColon.length + opts.offset;
            }

            DEV &&
              console.log(
                `531 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                  chunkStartsAt + opts.offset
                }, ${
                  i + opts.offset
                }], message: "${message}", fix: ${JSON.stringify(
                  fix,
                  null,
                  4,
                )}`,
              );
            res.push({
              idxFrom: chunkStartsAt + opts.offset,
              idxTo,
              message,
              fix: fix as any,
            });

            DEV && console.log(`548 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
            break;
          }
        }

        // finally, set the flag for the next chunk's expectations
        nextCanBeAnd = true;
        DEV &&
          console.log(
            `557 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nextCanBeAnd`}\u001b[${39}m`} = ${nextCanBeAnd}`,
          );
      } else {
        DEV &&
          console.log(
            `562 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`ELSE CLAUSES`}\u001b[${39}m`}`,
          );
        // if flag "nextCanBeMediaTypeOrMediaCondition" is false, this means we are
        // currently located at after the media type or media condition,
        // for example, where <here> marks below:
        // "@media screen <here>" or "@media (color) <here>"
        DEV &&
          console.log(
            `570 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
              chunkStartsAt + opts.offset
            }, ${i + opts.offset}]`,
          );
        res.push({
          idxFrom: chunkStartsAt + opts.offset,
          idxTo: i + opts.offset,
          message: `Unrecognised media type "${str.slice(chunkStartsAt, i)}".`,
          fix: null,
        });
      }

      // reset
      chunkStartsAt = null;
      DEV &&
        console.log(
          `586 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${32}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}; ${`\u001b[${32}m${`chunkWithinBrackets`}\u001b[${39}m`} = ${chunkWithinBrackets}`,
        );
      chunkWithinBrackets = false;

      if (nextCanBeNotOrOnly) {
        nextCanBeNotOrOnly = false;
        DEV &&
          console.log(
            `594 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`nextCanBeNotOrOnly`}\u001b[${39}m`} = ${nextCanBeNotOrOnly}`,
          );
      }
    } else {
      // TODO - remove
      DEV &&
        console.log(
          `601 ELSE - ${`\u001b[${33}m${`bracketOpeningIndexes`}\u001b[${39}m`} = ${JSON.stringify(
            bracketOpeningIndexes,
            null,
            4,
          )}`,
        );
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
        DEV &&
          console.log(
            `625 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkWithinBrackets`}\u001b[${39}m`} = ${chunkWithinBrackets}`,
          );
      }

      chunkStartsAt = i;
      DEV &&
        console.log(
          `632 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${32}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}`,
        );
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

    // catch opening bracket
    if (str[i] === "(") {
      DEV && console.log(`649 caught opening bracket`);
      bracketOpeningIndexes.push(i);
      DEV &&
        console.log(
          `653 after ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}, ${`\u001b[${33}m${`bracketOpeningIndexes`}\u001b[${39}m`}: ${JSON.stringify(
            bracketOpeningIndexes,
            null,
            4,
          )}`,
        );
    }

    // LOGGING
    DEV &&
      console.log(
        `${`\u001b[${90}m${`chunkStartsAt: ${chunkStartsAt}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`chunkWithinBrackets: ${chunkWithinBrackets}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`whitespaceStartsAt: ${whitespaceStartsAt}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`██ nextCanBeNotOrOnly: ${nextCanBeNotOrOnly}`}\u001b[${39}m`} ${`\u001b[${
          nextCanBeNotOrOnly ? 32 : 31
        }m${nextCanBeNotOrOnly}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`██ nextCanBeMediaType: `}\u001b[${39}m`} ${`\u001b[${
          nextCanBeMediaType ? 32 : 31
        }m${nextCanBeMediaType}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`██ nextCanBeMediaCondition: ${nextCanBeMediaCondition}`}\u001b[${39}m`} ${`\u001b[${
          nextCanBeMediaCondition ? 32 : 31
        }m${nextCanBeMediaCondition}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`██ nextCanBeAnd: ${nextCanBeAnd}`}\u001b[${39}m`} ${`\u001b[${
          nextCanBeAnd ? 32 : 31
        }m${nextCanBeAnd}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`gatheredChunksArr: ${JSON.stringify(
          gatheredChunksArr,
          null,
          0,
        )}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`bracketOpeningIndexes: ${JSON.stringify(
          bracketOpeningIndexes,
          null,
          0,
        )}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `██ ${`\u001b[${90}m${`res: ${JSON.stringify(
          res,
          null,
          4,
        )}`}\u001b[${39}m`}`,
      );
  }
}

export { loop, recognisedMediaTypes, lettersOnlyRegex, Opts, ResObj };
