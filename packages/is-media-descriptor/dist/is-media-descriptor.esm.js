/**
 * is-media-descriptor
 * Is given string a valid media descriptor (including media query)?
 * Version: 3.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-media-descriptor/
 */

import leven from 'leven';
import { processCommaSep } from 'string-process-comma-separated';

const recognisedMediaTypes = ["all", "aural", "braille", "embossed", "handheld", "print", "projection", "screen", "speech", "tty", "tv"]; // eslint-disable-next-line no-unused-vars

const recognisedMediaFeatures = ["width", "min-width", "max-width", "height", "min-height", "max-height", "aspect-ratio", "min-aspect-ratio", "max-aspect-ratio", "orientation", "resolution", "min-resolution", "max-resolution", "scan", "grid", "update", "overflow-block", "overflow-inline", "color", "min-color", "max-color", "color-index", "min-color-index", "max-color-index", "monochrome", "color-gamut", "pointer", "hover", "any-pointer", "any-hover"]; // TODO:
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

function loop(str, opts, res) {
  // opts.offset is passed but we don't Object.assign for perf reasons
  let chunkStartsAt = null;
  const gatheredChunksArr = [];
  let whitespaceStartsAt = null;

  let nextCanBeMediaType = true;
  let nextCanBeMediaCondition = true;
  let nextCanBeNotOrOnly = true;
  let nextCanBeAnd = false; // here we keep a note where we are bracket-wise, how deep

  const bracketOpeningIndexes = [];

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
    // ------------------------------------------------------------------------- //
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
      const lastOpening = bracketOpeningIndexes.pop();
      const extractedValueWithinBrackets = str.slice(lastOpening + 1, i); // Preliminary check, will be improved later.
      // Idea: if extracted chunk in the brackets doesn't have any nested
      // brackets, we can evaluate it quickly, especially if it does not
      // contain colon.
      // For example we extracted "zzz" from:
      // screen and not (print and (zzz))

      if (!extractedValueWithinBrackets.includes("(") && !extractedValueWithinBrackets.includes(")")) {

        if (extractedValueWithinBrackets.match(lettersOnlyRegex)) {

          if (!recognisedMediaFeatures.includes(extractedValueWithinBrackets.toLowerCase().trim())) {
            res.push({
              idxFrom: lastOpening + 1 + opts.offset,
              idxTo: i + opts.offset,
              message: `Unrecognised "${extractedValueWithinBrackets.trim()}".`,
              fix: null
            });
          }
        }
      } // everything nested like (screen and (color))
      // and contains media type


      const regexFromAllKnownMediaTypes = new RegExp(recognisedMediaTypes.join("|"), "gi");
      const findings = extractedValueWithinBrackets.match(regexFromAllKnownMediaTypes) || [];
      findings.forEach(mediaTypeFound => {
        const startingIdx = str.indexOf(mediaTypeFound);
        res.push({
          idxFrom: startingIdx + opts.offset,
          idxTo: startingIdx + mediaTypeFound.length + opts.offset,
          message: `Media type "${mediaTypeFound}" inside brackets.`,
          fix: null
        });
      });
    } // catch opening bracket


    if (str[i] === "(") {
      bracketOpeningIndexes.push(i);
    } // catch the ending of a whitespace chunk


    if (str[i] && str[i].trim().length && whitespaceStartsAt !== null) {
      if (str[whitespaceStartsAt - 1] === "(" || str[i] === ")") {
        // if it's whitespace inside brackets, wipe it
        res.push({
          idxFrom: whitespaceStartsAt + opts.offset,
          idxTo: i + opts.offset,
          message: `Bad whitespace.`,
          fix: {
            ranges: [[whitespaceStartsAt + opts.offset, i + opts.offset]]
          }
        });
      } else if (whitespaceStartsAt < i - 1 || str[i - 1] !== " ") { // Depends what whitespace is this. We aim to remove minimal amount
        // of characters possible. If there is excessive whitespace, we'll
        // delete all spaces except one instead of deleting all spaces and
        // inserting a space. That's to minimize the footprint of amends,
        // also to make merged ranges simpler later.
        // defaults is whole thing replacement:

        let rangesFrom = whitespaceStartsAt + opts.offset;
        let rangesTo = i + opts.offset;
        let rangesInsert = " "; // if whitespace chunk is longer than one, let's try to cut corners:

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
            ranges: [rangesInsert ? [rangesFrom, rangesTo, " "] : [rangesFrom, rangesTo]]
          }
        });
      } // reset


      whitespaceStartsAt = null;
    } // catch the beginning of a whitespace chunk


    if (str[i] && !str[i].trim().length && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
    } // catch the ending of a chunk
    // we deliberately wander outside of the string length by 1 character
    // to simplify calculations and to shake up the type complaceancy,
    // str[i] can be undefined now (on the last traversal cycle)!


    if (chunkStartsAt !== null && (!str[i] || !str[i].trim().length) && !bracketOpeningIndexes.length) { // extract the value:

      const chunk = str.slice(chunkStartsAt, i);
      gatheredChunksArr.push(chunk.toLowerCase()); // we use nextCanBeMediaTypeOrMediaCondition to establish where we are
      // logically - media type/condition might be preceded by not/only or
      // might be not - that's why we need this flag, to distinguish these
      // two cases

      if (nextCanBeAnd && (!(nextCanBeMediaType || nextCanBeMediaCondition) || chunk === "and")) {

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
              ranges: [[str.slice(0, chunkStartsAt).trim().length + opts.offset, i + opts.offset]]
            }
          });
        }

        nextCanBeAnd = false;
        nextCanBeMediaCondition = true;
      } else if (nextCanBeNotOrOnly && ["not", "only"].includes(chunk)) {
        nextCanBeNotOrOnly = false; // nextCanBeMediaType stays true
        // but nextCanBeMediaCondition is now off because media conditions
        // can't be preceded by not/only
        // spec:
        //
        // <media-query> = <media-condition>
        //     | [ not | only ]? <media-type> [ and <media-condition-without-or> ]?
        // - https://www.w3.org/TR/mediaqueries-4/#typedef-media-condition
        //

        nextCanBeMediaCondition = false;
      } else if (nextCanBeMediaType || nextCanBeMediaCondition) { // is it media type or media condition?

        if (chunk.startsWith("(")) {
          // resembles media condition // is there a media condition allowed here?

          if (nextCanBeMediaCondition) ; else {
            let message = `Media condition "${str.slice(chunkStartsAt, i)}" can't be here.`; // try to pinpoint the error's cause:

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
          // resembles media type // is there a media type allowed here?

          if (nextCanBeMediaType) { // is it a recognised type?

            if (recognisedMediaTypes.includes(chunk.toLowerCase())) {
              nextCanBeMediaType = false;
              nextCanBeMediaCondition = false;
            } else {
              let message = `Unrecognised "${chunk}".`;

              if (!chunk.match(/\w/g)) {
                message = `Strange symbol${chunk.trim().length === 1 ? "" : "s"} "${chunk}".`;
              } else if (["and", "only", "or", "not"].includes(chunk.toLowerCase())) {
                message = `"${chunk}" instead of a media type.`;
              }
              res.push({
                idxFrom: chunkStartsAt + opts.offset,
                idxTo: i + opts.offset,
                message,
                fix: null
              });
            }
          } else { // as a last resort, let's check, maybe it's a known condition but without brackets?

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
                ranges: [[chunkStartsAt + opts.offset, chunkStartsAt + opts.offset, "("], [i + opts.offset, i + opts.offset, ")"]]
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
              fix: fix
            });
            break;
          }
        } // finally, set the flag for the next chunk's expectations


        nextCanBeAnd = true;
      } else { // if flag "nextCanBeMediaTypeOrMediaCondition" is false, this means we are
        // currently located at after the media type or media condition,
        // for example, where <here> marks below:
        // "@media screen <here>" or "@media (color) <here>"
        res.push({
          idxFrom: chunkStartsAt + opts.offset,
          idxTo: i + opts.offset,
          message: `Unrecognised media type "${str.slice(chunkStartsAt, i)}".`,
          fix: null
        });
      } // reset


      chunkStartsAt = null;

      if (nextCanBeNotOrOnly) {
        nextCanBeNotOrOnly = false;
      }
    } // catch the beginning of a chunk, without brackets like "print" or
    // with brackets like (min-resolution: 300dpi)


    if (chunkStartsAt === null && str[i] && str[i].trim().length && str[i] !== ")") {
      // Deliberately we keep chunk opening clauses and logic which
      // determines is chunk within brackets, together.
      // That's to potentially avoid logic clause mishaps later.
      if (str[i] === "(") ;

      chunkStartsAt = i;
    } //
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
  }
}

var version = "3.0.5";

const version$1 = version;
const defaults = {
  offset: 0
}; // See https://drafts.csswg.org/mediaqueries/
// Also https://csstree.github.io/docs/validator.html
// Also, test in Chrome yourself

function isMediaD(originalStr, originalOpts) {
  const opts = { ...defaults,
    ...originalOpts
  }; // insurance first

  if (opts.offset && !Number.isInteger(opts.offset)) {
    throw new Error(`is-media-descriptor: [THROW_ID_01] opts.offset must be an integer, it was given as ${opts.offset} (type ${typeof opts.offset})`);
  }

  if (!opts.offset) {
    // to cater false/null
    opts.offset = 0;
  } // quick ending


  if (typeof originalStr !== "string") {
    return [];
  }

  if (!originalStr.trim()) {
    return [];
  }

  const res = []; // We pay extra attention to whitespace. These two below
  // mark the known index of the first and last non-whitespace
  // character (a'la trim)

  let nonWhitespaceStart = 0;
  let nonWhitespaceEnd = originalStr.length;
  const str = originalStr.trim(); // ---------------------------------------------------------------------------
  // check for inner whitespace, for example,
  // " screen and (color), projection and (color)"
  //  ^
  //
  // as in...
  //
  // <link media=" screen and (color), projection and (color)" rel="stylesheet" href="example.css">
  //
  // ^ notice rogue space above

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

      for (let i = originalStr.length; i--;) {
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
        ranges: ranges
      }
    });
  } // --------------------------------------------------------------------------- // quick checks first - cover the most common cases, to make checks the
  // quickest possible when everything's all right

  if (recognisedMediaTypes.includes(str)) {
    //
    //
    //
    //
    //
    //
    //
    //
    // 1. string-only, like "screen"
    //
    //
    //
    //
    //
    //
    //
    //
    return res;
  }

  if (["only", "not"].includes(str)) {
    res.push({
      idxFrom: nonWhitespaceStart + opts.offset,
      idxTo: nonWhitespaceEnd + opts.offset,
      message: `Missing media type or condition.`,
      fix: null
    });
  } else if (str.match(lettersOnlyRegex) && !str.includes("(") && !str.includes(")")) {
    //
    //
    //
    //
    //
    //
    //
    //
    // 2. string-only, unrecognised like "screeeen"
    //
    //
    //
    //
    //
    //
    //
    //

    for (let i = 0, len = recognisedMediaTypes.length; i < len; i++) {

      if (leven(recognisedMediaTypes[i], str) === 1) {
        res.push({
          idxFrom: nonWhitespaceStart + opts.offset,
          idxTo: nonWhitespaceEnd + opts.offset,
          message: `Did you mean "${recognisedMediaTypes[i]}"?`,
          fix: {
            ranges: [[nonWhitespaceStart + opts.offset, nonWhitespaceEnd + opts.offset, recognisedMediaTypes[i]]]
          }
        });
        break;
      }

      if (i === len - 1) {
        // it means nothing was matched
        res.push({
          idxFrom: nonWhitespaceStart + opts.offset,
          idxTo: nonWhitespaceEnd + opts.offset,
          message: `Unrecognised media type "${str}".`,
          fix: null
        });
      }
    }
  } else {
    //
    //
    //
    //
    //
    //
    //
    //
    // 3. mixed, like "screen and (color)"
    //
    //
    //
    //
    //
    //
    //
    //
    // PART 1.
    // ███████████████████████████████████████ // Preventive checks will help to simplify the algorithm - we won't need
    // to cater for so many edge cases later.

    let wrongOrder = false;
    const [openingBracketCount, closingBracketCount] = Array.from(str).reduce((acc, curr, idx) => {
      if (curr === ")") {
        // if at any time, there are more closing brackets than opening-ones,
        // this means order is messed up
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
          fix: null
        });
      }

      return acc;
    }, [0, 0]); // we raise this error only when there is equal amount of brackets,
    // only the order is messed up:

    if (wrongOrder && openingBracketCount === closingBracketCount) {
      res.push({
        idxFrom: nonWhitespaceStart + opts.offset,
        idxTo: nonWhitespaceEnd + opts.offset,
        message: "Some closing brackets are before their opening counterparts.",
        fix: null
      });
    } // reporting that there were more one kind
    // of brackets than the other:

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

    if (!res.length && str.match(/\(\s*\)/g)) { // now find out where

      let lastOpening = null;
      let nonWhitespaceFound;

      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i] === "(") {
          lastOpening = i;
          nonWhitespaceFound = false;
        } else if (str[i] === ")" && lastOpening) {
          if (!nonWhitespaceFound) {
            res.push({
              idxFrom: lastOpening + opts.offset,
              idxTo: i + 1 + opts.offset,
              message: "Empty bracket pair.",
              fix: null
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
      // report errors early, save resources
      return res;
    } // PART 2.
    // ███████████████████████████████████████ // first parse comma-separated chunks

    processCommaSep(str, {
      offset: opts.offset,
      leadingWhitespaceOK: false,
      trailingWhitespaceOK: false,
      oneSpaceAfterCommaOK: true,
      innerWhitespaceAllowed: true,
      separator: ",",
      cb: (idxFrom, idxTo) => {
        loop(str, { ...opts,
          idxFrom: idxFrom - opts.offset,
          idxTo: idxTo - opts.offset
        }, res);
      },
      errCb: (ranges, message) => {
      }
    }); // PART 3.
    // ███████████████████████████████████████
    // if (!res.length) {
    //   // finally, if no errors were caught, parse:
    //   console.log(`329 PART III. Run through CSS Tree parser.`);
    //   const temp = cssTreeValidate(`@media ${str} {}`);
    //   console.log(
    //     `332 ${`\u001b[${31}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
    //       temp,
    //       null,
    //       4
    //     )}`
    //   );
    // }
  } // ---------------------------------------------------------------------------
  return res;
}

export { defaults, isMediaD, version$1 as version };
