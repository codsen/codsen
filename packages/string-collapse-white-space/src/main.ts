/* eslint @typescript-eslint/ban-ts-comment:1 */

import { rApply } from "ranges-apply";
import { Ranges } from "ranges-push";
import { right } from "string-left-right";
import type { Range, Ranges as RangesType } from "../../../ops/typedefs/common";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

interface Extras {
  whiteSpaceStartsAt: null | number;
  whiteSpaceEndsAt: null | number;
  str: string;
}

interface CbObj extends Extras {
  suggested: Range;
}

type Callback = (cbObj: CbObj) => any;

interface Opts {
  trimStart: boolean;
  trimEnd: boolean;
  trimLines: boolean;
  trimnbsp: boolean;
  removeEmptyLines: boolean;
  limitConsecutiveEmptyLinesTo: number;
  enforceSpacesOnly: boolean;
  cb: Callback;
}

// default set of options
const defaults: Opts = {
  trimStart: true,
  trimEnd: true,
  trimLines: false,
  trimnbsp: false,
  removeEmptyLines: false,
  limitConsecutiveEmptyLinesTo: 0,
  enforceSpacesOnly: false,
  cb: ({ suggested }) => {
    // DEV && console.log(`default CB called`);
    // DEV && console.log(
    //   `${`\u001b[${33}m${`suggested`}\u001b[${39}m`} = ${JSON.stringify(
    //     suggested,
    //     null,
    //     4
    //   )}`
    // );
    return suggested;
  },
};

interface Res {
  result: string;
  ranges: RangesType;
}

const cbSchema = ["suggested", "whiteSpaceStartsAt", "whiteSpaceEndsAt", "str"];

function collapse(str: string, opts?: Partial<Opts>): Res {
  DEV &&
    console.log(
      `069 ██ string-collapse-whitespace called: str = ${JSON.stringify(
        str,
        null,
        4
      )}; opts = ${JSON.stringify(opts, null, 4)}`
    );

  // f's
  if (typeof str !== "string") {
    throw new Error(
      `string-collapse-white-space/collapse(): [THROW_ID_01] The input is not string but ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (opts && typeof opts !== "object") {
    throw new Error(
      `string-collapse-white-space/collapse(): [THROW_ID_02] The resolvedOpts is not a plain object but ${typeof opts}, equal to:\n${JSON.stringify(
        opts,
        null,
        4
      )}`
    );
  }
  if (!str.length) {
    return {
      result: "",
      ranges: null,
    };
  }

  let finalIndexesToDelete = new Ranges();

  let NBSP = `\xa0`;

  // fill any settings with defaults if missing:
  let resolvedOpts: Opts = { ...defaults, ...opts };
  DEV && console.log(` `);
  DEV &&
    console.log(
      `111 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4
      )}`
    );

  function push(something?: any, extras?: Extras): void {
    DEV && console.log(`---- push() ----`);
    DEV &&
      console.log(
        `122 ${`\u001b[${35}m${`push()`}\u001b[${39}m`} ${`\u001b[${32}m${`extras`}\u001b[${39}m`} = ${JSON.stringify(
          extras,
          null,
          4
        )}`
      );

    if (typeof resolvedOpts.cb === "function") {
      let final: Range | null = resolvedOpts.cb({
        suggested: something,
        ...(extras as any),
      });
      DEV &&
        console.log(
          `136 ${`\u001b[${35}m${`push():`}\u001b[${39}m`} ${`\u001b[${33}m${`final`}\u001b[${39}m`} = ${JSON.stringify(
            final,
            null,
            4
          )}`
        );
      if (Array.isArray(final)) {
        DEV &&
          console.log(
            `145 ${`\u001b[${35}m${`push():`}\u001b[${39}m`} ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`}`
          );
        (finalIndexesToDelete as any).push(...final);
      }
    } else if (something) {
      (finalIndexesToDelete as any).push(...something);
    }
  }

  // -----------------------------------------------------------------------------

  let spacesStartAt = null;
  let whiteSpaceStartsAt = null;
  let lineWhiteSpaceStartsAt = null;
  let linebreaksStartAt = null;
  let linebreaksEndAt = null;
  let nbspPresent = false;

  // Logic clauses for spaces, per-line whitespace and general whitespace
  // overlap somewhat and are not aware of each other. For example, mixed chunk
  // "\xa0   a   \xa0"
  //             ^line whitespace ends here - caught by per-line clauses
  //
  // "\xa0   a   \xa0"
  //                 ^non-breaking space ends here, 1 character further
  //                  that's caught by general whitespace clauses
  //
  // as a solution, we stage all whitespace pushing ranges into this array,
  // then general whitespace clauses release all what's gathered and can
  // adjust the logic depending what's in staging.
  // Alternatively we could dig in already staged ranges, but that's slower.

  type Staged = [Range, Extras];
  let staging: Staged[] = [];

  let consecutiveLineBreakCount = 0;

  for (let i = 0, len = str.length; i <= len; i++) {
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                        LOOP STARTS - THE TOP PART
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    DEV &&
      console.log(
        `${`\u001b[${36}m${`-----------------------------------------------`}\u001b[${39}m`} str[${`\u001b[${35}m${i}\u001b[${39}m`}] = ${JSON.stringify(
          str[i],
          null,
          4
        )}`
      );
    // line break counting
    if (str[i] === "\r" || (str[i] === "\n" && str[i - 1] !== "\r")) {
      consecutiveLineBreakCount += 1;
      DEV &&
        console.log(
          `217 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} consecutiveLineBreakCount = ${consecutiveLineBreakCount}`
        );
      if (linebreaksStartAt === null) {
        linebreaksStartAt = i;
        DEV &&
          console.log(
            `223 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} linebreaksStartAt = ${linebreaksStartAt}`
          );
      }

      linebreaksEndAt = str[i] === "\r" && str[i + 1] === "\n" ? i + 2 : i + 1;
      DEV &&
        console.log(
          `230 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} linebreaksEndAt = ${linebreaksEndAt}`
        );
    }

    // catch raw non-breaking spaces
    if (!resolvedOpts.trimnbsp && str[i] === NBSP && !nbspPresent) {
      nbspPresent = true;
      DEV &&
        console.log(
          `239 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} nbspPresent = ${nbspPresent}`
        );
    }

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                             LOOP'S MIDDLE
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    // catch the end of space character (" ") sequences
    if (
      // spaces sequence hasn't started yet
      spacesStartAt !== null &&
      // it's a space
      str[i] !== " "
    ) {
      DEV && console.log(`.`);
      DEV && console.log(`273 space sequence`);
      let a1 = // it's not a beginning of the string (more general whitespace clauses
        // will take care of trimming, taking into account resolvedOpts.trimStart etc)
        // either it's not leading whitespace
        (spacesStartAt && whiteSpaceStartsAt) ||
        // it is within frontal whitespace and
        (!whiteSpaceStartsAt &&
          (!resolvedOpts.trimStart ||
            (!resolvedOpts.trimnbsp && // we can't trim NBSP
              // and there's NBSP on one side
              (str[i] === NBSP || str[spacesStartAt - 1] === NBSP))));

      let a2 = // it is not a trailing whitespace
        str[i] ||
        !resolvedOpts.trimEnd ||
        (!resolvedOpts.trimnbsp && // we can't trim NBSP
          // and there's NBSP on one side
          (str[i] === NBSP || str[spacesStartAt - 1] === NBSP));

      let a3 = // beware that there might be whitespace characters (like tabs, \t)
        // before or after this chunk of spaces - if resolvedOpts.enforceSpacesOnly
        // is enabled, we need to skip this clause because wider, general
        // whitespace chunk clauses will take care of the whole chunk, larger
        // than this [spacesStartAt, i - 1], it will be
        // [whiteSpaceStartsAt, ..., " "]
        //
        // either spaces-only setting is off,
        !resolvedOpts.enforceSpacesOnly ||
        // neither of surrounding characters (if present) is not whitespace
        ((!str[spacesStartAt - 1] ||
          // or it's not whitespace
          str[spacesStartAt - 1].trim()) &&
          // either it's end of string
          (!str[i] ||
            // it's not a whitespace
            str[i].trim()));

      DEV &&
        console.log(
          `312 space char seq. clause: a1=${`\u001b[${
            a1 ? 32 : 31
          }m${!!a1}\u001b[${39}m`} && a2=${`\u001b[${
            a2 ? 32 : 31
          }m${!!a2}\u001b[${39}m`} && a3=${`\u001b[${
            a3 ? 32 : 31
          }m${!!a3}\u001b[${39}m`} ===> ${`\u001b[${
            spacesStartAt < i - 1 && a1 && a2 && a3 ? 32 : 31
          }m${!!(spacesStartAt < i - 1 && a1 && a2 && a3)}\u001b[${39}m`}`
        );

      if (
        // length of spaces sequence is more than 1
        spacesStartAt < i - 1 &&
        a1 &&
        a2 &&
        a3
      ) {
        DEV && console.log(`330 inside space seq. removal clauses`);
        let startIdx = spacesStartAt;
        let endIdx = i;
        let whatToAdd: string | null = " ";

        if (
          resolvedOpts.trimLines &&
          // touches the start
          (!spacesStartAt ||
            // touches the end
            !str[i] ||
            // linebreak before
            (str[spacesStartAt - 1] &&
              `\r\n`.includes(str[spacesStartAt - 1])) ||
            // linebreak after
            (str[i] && `\r\n`.includes(str[i])))
        ) {
          whatToAdd = null;
        }

        DEV &&
          console.log(
            `352 initial range: [${startIdx}, ${endIdx}, ${JSON.stringify(
              whatToAdd,
              null,
              0
            )}]`
          );
        // the plan is to reuse existing spaces - for example, imagine:
        // "a   b" - three space gap.
        // Instead of overwriting all three spaces with single space, range:
        // [1, 4, " "], we leave the last space, only deleting other two:
        // range [1, 3] (notice the third element, "what to add" missing).
        if (whatToAdd && str[spacesStartAt] === " ") {
          DEV && console.log(`364 contract ending index`);
          endIdx -= 1;
          whatToAdd = null;
          DEV && console.log(`367 new range: [${startIdx}, ${endIdx}, " "]`);
        }

        // if nbsp trimming is disabled and we have a situation like:
        // "    \xa0     a"
        //      ^
        // we're here
        //
        // we need to still trim the spaces chunk, in whole
        if (!spacesStartAt && resolvedOpts.trimStart) {
          DEV && console.log(`377 - frontal chunk`);
          endIdx = i;
          DEV && console.log(`379 new range: [${startIdx}, ${endIdx}, " "]`);
        } else if (!str[i] && resolvedOpts.trimEnd) {
          DEV && console.log(`381 - trailing chunk`);
          endIdx = i;
          DEV && console.log(`383 new range: [${startIdx}, ${endIdx}, " "]`);
        }

        DEV &&
          console.log(
            `388 suggested range: ${`\u001b[${35}m${JSON.stringify(
              whatToAdd ? [startIdx, endIdx, whatToAdd] : [startIdx, endIdx],
              null,
              0
            )}\u001b[${39}m`}`
          );

        // Notice we could push ranges to final, using standalone push()
        // but here we stage because general whitespace clauses need to be
        // aware what was "booked" so far.
        staging.push([
          /* istanbul ignore next */
          whatToAdd ? [startIdx, endIdx, whatToAdd] : [startIdx, endIdx],
          {
            whiteSpaceStartsAt,
            whiteSpaceEndsAt: right(str, i - 1) || i,
            str,
          },
        ]);
      }

      // resets are at the bottom
    }

    // catch the start of space character (" ") sequences
    if (
      // spaces sequence hasn't started yet
      spacesStartAt === null &&
      // it's a space
      str[i] === " "
    ) {
      spacesStartAt = i;
      DEV &&
        console.log(
          `422 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`spacesStartAt`}\u001b[${39}m`} = ${JSON.stringify(
            spacesStartAt,
            null,
            4
          )}`
        );
    }

    // catch the start of whitespace chunks
    if (
      // chunk hasn't been recording
      whiteSpaceStartsAt === null &&
      // it's whitespace
      str[i] &&
      !str[i].trim()
    ) {
      whiteSpaceStartsAt = i;
      DEV &&
        console.log(
          `441 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whiteSpaceStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
            whiteSpaceStartsAt,
            null,
            4
          )}`
        );
    }

    // catch the end of line whitespace (chunk of whitespace characters execept LF / CR)
    if (
      // chunk has been recording
      lineWhiteSpaceStartsAt !== null &&
      // and end has been met:
      //
      // either line break has been reached
      (`\n\r`.includes(str[i]) ||
        // or
        // it's not whitespace
        !str[i] ||
        str[i].trim() ||
        // either we don't care about non-breaking spaces and trim/replace them
        (!(resolvedOpts.trimnbsp || resolvedOpts.enforceSpacesOnly) &&
          // and we do care and it's not a non-breaking space
          str[i] === NBSP)) &&
      // also, mind the trim-able whitespace at the edges...
      //
      // it's not beginning of the string (more general whitespace clauses
      // will take care of trimming, taking into account resolvedOpts.trimStart etc)
      (lineWhiteSpaceStartsAt ||
        !resolvedOpts.trimStart ||
        (resolvedOpts.enforceSpacesOnly && nbspPresent)) &&
      // it's not the ending of the string - we traverse upto and including
      // str.length, which means last str[i] is undefined
      (str[i] ||
        !resolvedOpts.trimEnd ||
        (resolvedOpts.enforceSpacesOnly && nbspPresent))
    ) {
      DEV && console.log(`.`);
      DEV && console.log(`479 line whitespace clauses`);

      // tend resolvedOpts.enforceSpacesOnly
      // ---------------------------
      if (
        // setting is on
        resolvedOpts.enforceSpacesOnly &&
        // either chunk's longer than 1
        (i > lineWhiteSpaceStartsAt + 1 ||
          // or it's single character but not a space (yet still whitespace)
          str[lineWhiteSpaceStartsAt] !== " ")
      ) {
        DEV && console.log(`491 resolvedOpts.enforceSpacesOnly clauses`);
        // also whole whitespace chunk goes, only we replace with a single space
        // but maybe we can reuse existing characters to reduce the footprint
        let startIdx = lineWhiteSpaceStartsAt;
        let endIdx = i;
        let whatToAdd: string | null = " ";

        if (str[endIdx - 1] === " ") {
          endIdx -= 1;
          whatToAdd = null;
        } else if (str[lineWhiteSpaceStartsAt] === " ") {
          startIdx += 1;
          whatToAdd = null;
        }

        // make sure it's not on the edge of string with trim options enabled,
        // in that case don't add the space!
        if (
          ((resolvedOpts.trimStart || resolvedOpts.trimLines) &&
            !lineWhiteSpaceStartsAt) ||
          ((resolvedOpts.trimEnd || resolvedOpts.trimLines) && !str[i])
        ) {
          whatToAdd = null;
          DEV &&
            console.log(
              `516 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whatToAdd`}\u001b[${39}m`} = ${JSON.stringify(
                whatToAdd,
                null,
                4
              )}`
            );
        }

        DEV &&
          console.log(
            `526 suggested range: ${`\u001b[${35}m${`[${lineWhiteSpaceStartsAt}, ${i}, " "]`}\u001b[${39}m`}`
          );
        push(whatToAdd ? [startIdx, endIdx, whatToAdd] : [startIdx, endIdx], {
          whiteSpaceStartsAt: whiteSpaceStartsAt as number,
          whiteSpaceEndsAt: i,
          str,
        });
      }

      // tend resolvedOpts.trimLines
      // -------------------
      if (
        // setting is on
        resolvedOpts.trimLines &&
        // it is on the edge of a line
        (!lineWhiteSpaceStartsAt ||
          `\r\n`.includes(str[lineWhiteSpaceStartsAt - 1]) ||
          !str[i] ||
          `\r\n`.includes(str[i])) &&
        // and we don't care about non-breaking spaces
        (resolvedOpts.trimnbsp ||
          // this chunk doesn't contain any
          !nbspPresent)
      ) {
        DEV &&
          console.log(
            `552 suggested range: ${`\u001b[${35}m${`[${lineWhiteSpaceStartsAt}, ${i}, " "]`}\u001b[${39}m`}`
          );
        push([lineWhiteSpaceStartsAt, i], {
          whiteSpaceStartsAt: whiteSpaceStartsAt as number,
          whiteSpaceEndsAt: right(str, i - 1) || i,
          str,
        });
      }

      lineWhiteSpaceStartsAt = null;
      DEV &&
        console.log(
          `564 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`lineWhiteSpaceStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
            lineWhiteSpaceStartsAt,
            null,
            4
          )}`
        );
    }

    // Catch the start of a sequence of line whitespace (chunk of whitespace characters execept LF / CR)
    if (
      // chunk hasn't been recording
      lineWhiteSpaceStartsAt === null &&
      // we're currently not on CR or LF
      !`\r\n`.includes(str[i]) &&
      // and it's whitespace
      str[i] &&
      !str[i].trim() &&
      // mind the raw non-breaking spaces
      (resolvedOpts.trimnbsp ||
        str[i] !== NBSP ||
        resolvedOpts.enforceSpacesOnly)
    ) {
      lineWhiteSpaceStartsAt = i;
      DEV &&
        console.log(
          `589 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lineWhiteSpaceStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
            lineWhiteSpaceStartsAt,
            null,
            4
          )}`
        );
    }

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                             LOOP'S BOTTOM
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    // Catch the end of whitespace chunks

    // This clause is deliberately under the catch clauses of the end of line
    // whitespace chunks because the empty, null ranges are the last thing to
    // be pinged to the callback. "pushed" flag must not be triggered too early.
    if (
      // whitespace chunk has been recording
      whiteSpaceStartsAt !== null &&
      // it's EOL
      (!str[i] ||
        // or non-whitespace character
        str[i].trim())
    ) {
      DEV && console.log(`.`);
      DEV && console.log(`633 general whitespace clauses`);
      // If there's anything staged, that must be string-only or per-line
      // whitespace chunks (possibly even multiple) gathered while we've been
      // traversing this (one) whitespace chunk.

      if (
        // whitespace is frontal
        ((!whiteSpaceStartsAt &&
          // frontal trimming is enabled
          (resolvedOpts.trimStart ||
            // or per-line trimming is enabled
            (resolvedOpts.trimLines &&
              // and we're on the same line (we don't want to remove linebreaks)
              linebreaksStartAt === null))) ||
          // whitespace is trailing
          (!str[i] &&
            // trailing part's trimming is enabled
            (resolvedOpts.trimEnd ||
              // or per-line trimming is enabled
              (resolvedOpts.trimLines &&
                // and we're on the same line (we don't want to remove linebreaks)
                linebreaksStartAt === null)))) &&
        // either we don't care about non-breaking spaces
        (resolvedOpts.trimnbsp ||
          // or there are no raw non-breaking spaces in this trim-suitable chunk
          !nbspPresent ||
          // or there are non-breaking spaces but they don't matter because
          // we want spaces-only everywhere
          resolvedOpts.enforceSpacesOnly)
      ) {
        DEV &&
          console.log(
            `665 suggested range: ${`\u001b[${35}m${`[${whiteSpaceStartsAt}, ${i}]`}\u001b[${39}m`}`
          );
        push([whiteSpaceStartsAt, i], {
          whiteSpaceStartsAt,
          whiteSpaceEndsAt: i,
          str,
        });
      } else {
        DEV && console.log(`673 - neither frontal nor rear`);
        let somethingPushed = false;

        // tackle the line breaks
        // ----------------------
        if (
          resolvedOpts.removeEmptyLines &&
          // there were some linebreaks recorded
          linebreaksStartAt !== null &&
          // there are too many
          consecutiveLineBreakCount >
            (resolvedOpts.limitConsecutiveEmptyLinesTo || 0) + 1
        ) {
          somethingPushed = true;
          DEV && console.log(`687 remove the linebreak sequence`);

          // try to salvage some of the existing linebreaks - don't replace the
          // same with the same
          let startIdx = linebreaksStartAt;
          let endIdx = linebreaksEndAt || str.length;
          let whatToAdd: string | null = `${
            str[linebreaksStartAt] === "\r" &&
            str[linebreaksStartAt + 1] === "\n"
              ? "\r\n"
              : str[linebreaksStartAt]
          }`.repeat((resolvedOpts.limitConsecutiveEmptyLinesTo || 0) + 1);

          DEV &&
            console.log(
              `702 FIY, ${`\u001b[${33}m${`whatToAdd`}\u001b[${39}m`} = ${JSON.stringify(
                whatToAdd,
                null,
                4
              )}`
            );

          /* istanbul ignore else */
          if (str.endsWith(whatToAdd, linebreaksEndAt as number)) {
            DEV && console.log(`711 reuse the ending`);
            endIdx -= whatToAdd.length || 0;
            whatToAdd = null;
          } else if (str.startsWith(whatToAdd, linebreaksStartAt)) {
            DEV && console.log(`715 reuse the beginning`);
            startIdx += whatToAdd.length;
            whatToAdd = null;
          }

          DEV &&
            console.log(
              `722 suggested range: ${`\u001b[${35}m${`[${startIdx}, ${endIdx}, ${JSON.stringify(
                whatToAdd,
                null,
                0
              )}]`}\u001b[${39}m`}`
            );
          /* istanbul ignore next */
          push(whatToAdd ? [startIdx, endIdx, whatToAdd] : [startIdx, endIdx], {
            whiteSpaceStartsAt,
            whiteSpaceEndsAt: i,
            str,
          });
        }

        // push the staging if it exists
        // -----------------------------
        if (staging.length) {
          DEV && console.log(`739 push all staged ranges into final`);
          while (staging.length) {
            // FIFO - first in, first out
            // @tsx-ignore
            push(...(staging.shift() as Staged));
          }
          somethingPushed = true;
        }

        // if nothing has been pushed so far, push nothing to cb()
        // -------------------------------------------------------
        if (!somethingPushed) {
          DEV &&
            console.log(
              `753 suggested range: ${`\u001b[${35}m${`null`}\u001b[${39}m`}`
            );
          push(null, {
            whiteSpaceStartsAt,
            whiteSpaceEndsAt: i,
            str,
          });
        }
      }

      whiteSpaceStartsAt = null;
      lineWhiteSpaceStartsAt = null;
      DEV &&
        console.log(
          `767 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`whiteSpaceStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
            whiteSpaceStartsAt,
            null,
            4
          )}; ${`\u001b[${33}m${`lineWhiteSpaceStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
            lineWhiteSpaceStartsAt,
            null,
            4
          )}`
        );

      nbspPresent = false;
      DEV &&
        console.log(
          `781 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nbspPresent`}\u001b[${39}m`} = ${nbspPresent}`
        );

      // reset line break counts
      if (consecutiveLineBreakCount) {
        consecutiveLineBreakCount = 0;
        DEV &&
          console.log(
            `789 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} consecutiveLineBreakCount = ${consecutiveLineBreakCount}`
          );
        linebreaksStartAt = null;
        DEV &&
          console.log(
            `794 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} linebreaksStartAt = ${linebreaksStartAt}`
          );
        linebreaksEndAt = null;
        DEV &&
          console.log(
            `799 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} linebreaksEndAt = ${linebreaksEndAt}`
          );
      }
    }

    // rest spaces chunk starting record
    if (spacesStartAt !== null && str[i] !== " ") {
      spacesStartAt = null;
      DEV &&
        console.log(
          `809 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`spacesStartAt`}\u001b[${39}m`} = ${JSON.stringify(
            spacesStartAt,
            null,
            4
          )}`
        );
    }

    // -------------------------------------------------------------------------

    DEV && console.log(`${`\u001b[${90}m${`.`}\u001b[${39}m`}`);
    DEV && console.log(`\u001b[${90}m${`██  ██  ██  ██  ██`}\u001b[${39}m`);
    DEV &&
      console.log(
        `\u001b[${36}m${`spacesStartAt`}\u001b[${39}m = ${spacesStartAt};
\u001b[${36}m${`whiteSpaceStartsAt`}\u001b[${39}m = ${whiteSpaceStartsAt};
\u001b[${36}m${`lineWhiteSpaceStartsAt`}\u001b[${39}m = ${lineWhiteSpaceStartsAt};
\u001b[${36}m${`linebreaksStartAt`}\u001b[${39}m = ${linebreaksStartAt};
\u001b[${36}m${`linebreaksEndAt`}\u001b[${39}m = ${linebreaksEndAt};
\u001b[${36}m${`nbspPresent`}\u001b[${39}m = ${nbspPresent};
\u001b[${36}m${`consecutiveLineBreakCount`}\u001b[${39}m = ${consecutiveLineBreakCount}`
      );
    DEV &&
      console.log(
        `${`\u001b[${36}m${`staging`}\u001b[${39}m`} = ${JSON.stringify(
          staging,
          null,
          4
        )}`
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                             LOOP ENDS
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
  }

  DEV && console.log(`863 ----------------------------`);
  DEV &&
    console.log(
      `866 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`finalIndexesToDelete`}\u001b[${39}m`} = ${JSON.stringify(
        finalIndexesToDelete.current(),
        null,
        4
      )}`
    );

  return {
    result: rApply(str, finalIndexesToDelete.current()),
    ranges: finalIndexesToDelete.current(),
  };
}

export { collapse, cbSchema, defaults, version };
