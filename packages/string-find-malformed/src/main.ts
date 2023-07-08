import { existy, isStr, isPlainObject as isObj } from "codsen-utils";
import { right } from "string-left-right";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Opts {
  stringOffset: number;
  maxDistance: number;
  ignoreWhitespace: boolean;
}
const defaults: Opts = {
  stringOffset: 0,
  maxDistance: 1,
  ignoreWhitespace: true,
};

export interface DataObj {
  idxFrom: number;
  idxTo: number;
}

function findMalformed(
  str: string,
  refStr: string,
  cb: (obj: DataObj) => void,
  opts?: Partial<Opts>,
): void {
  DEV && console.log(`032 strFindMalformed() START:`);
  DEV &&
    console.log(
      `* ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
        str,
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `* ${`\u001b[${33}m${`refStr`}\u001b[${39}m`} = ${JSON.stringify(
        refStr,
        null,
        4,
      )}`,
    );
  //
  // insurance
  // ---------

  if (!isStr(str)) {
    throw new TypeError(
      `string-find-malformed: [THROW_ID_01] the first input argument, string where to look for, must be a string! Currently it's equal to: ${str} (type: ${typeof str})`,
    );
  } else if (!str.length) {
    // empty string - quick ending
    DEV && console.log(`059 QUICK ENDING - 1st arg, "str" was empty`);
    return;
  }
  if (!isStr(refStr)) {
    throw new TypeError(
      `string-find-malformed: [THROW_ID_02] the second input argument, string we should find, must be a string! Currently it's equal to: ${refStr} (type: ${typeof refStr})`,
    );
  } else if (!refStr.length) {
    // empty string to look for - quick ending
    DEV && console.log(`068 QUICK ENDING - 2nd arg, "refStr" was empty`);
    return;
  }
  if (typeof cb !== "function") {
    throw new TypeError(
      `string-find-malformed: [THROW_ID_03] the third input argument, a callback function, must be a function! Currently it's equal to: ${cb} (type: ${typeof cb})`,
    );
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError(
      `string-find-malformed: [THROW_ID_04] the fourth input argument, an Optional Options Object, must be a plain object! Currently it's equal to: ${opts} (type: ${typeof opts})`,
    );
  }

  let resolvedOpts: Opts = { ...defaults, ...opts };

  // we perform the validation upon Object-assigned "resolvedOpts" instead
  // of incoming "opts" because we don't want to mutate the
  // "opts" and making note of fixed values, Object-assigning
  // "resolvedOpts" and then putting those noted fixed values on top is more
  // tedious than letting Object-assign to do the job, then validating
  // it, then trying to salvage the value (if possible).

  if (
    typeof resolvedOpts.stringOffset === "string" &&
    /^\d*$/.test(resolvedOpts.stringOffset)
  ) {
    resolvedOpts.stringOffset = Number(resolvedOpts.stringOffset);
  } else if (
    !Number.isInteger(resolvedOpts.stringOffset) ||
    resolvedOpts.stringOffset < 0
  ) {
    throw new TypeError(
      `[THROW_ID_05] resolvedOpts.stringOffset must be a natural number or zero! Currently it's: ${resolvedOpts.stringOffset}`,
    );
  }
  DEV &&
    console.log(
      `106 FINAL ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}`,
    );

  //
  // action
  // ------

  let len = str.length;

  // "current" character (str[i]) is matched against first character
  // of "refStr", then, if resolvedOpts.maxDistance allows and refStr has
  // enough length, current character (str[i]) is matched against the
  // second character of "refStr" - this time, "patience" is subtracted
  // by amount of skipped characters, in this case, by 1... and so on...
  // That matching chain is a "for" loop and that loop's length is below:
  let len2 = Math.min(refStr.length, (resolvedOpts.maxDistance || 0) + 1);

  interface MatchesObj {
    startsAt: number;
    patienceLeft: number;
    pendingToCheck: string[];
  }

  let pendingMatchesArr: MatchesObj[] = [];

  // when it attempts to dip below zero, match is failed
  let patience: number = resolvedOpts.maxDistance || 1;

  let wasThisLetterMatched;

  for (let i = 0; i < len; i++) {
    //
    //
    //
    //
    //                             THE TOP
    //                             ███████
    //
    //
    //
    //

    // Logging:
    // -------------------------------------------------------------------------
    DEV &&
      console.log(
        `\u001b[${36}m${`================================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
          str[i]?.trim() ? str[i] : JSON.stringify(str[i], null, 4)
        }`}\u001b[${39}m \u001b[${36}m${`================================`}\u001b[${39}m\n`,
      );

    if (resolvedOpts.ignoreWhitespace && !str[i].trim()) {
      DEV && console.log(`162 ${`\u001b[${32}m${`SKIP`}\u001b[${39}m`}`);
      continue;
    }

    //
    //
    //
    //
    //                            THE MIDDLE
    //                            ██████████
    //
    //
    //
    //

    DEV &&
      console.log(
        `179 ${`\u001b[${34}m${`I. tend the existing entries in pendingMatchesArr[]`}\u001b[${39}m`}`,
      );
    for (let z = 0, len3 = pendingMatchesArr.length; z < len3; z++) {
      DEV && console.log(" ");
      DEV && console.log(`-----------------------------------`);
      DEV && console.log(" ");
      DEV &&
        console.log(
          `187 ${`\u001b[${33}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
            pendingMatchesArr[z],
            null,
            4,
          )}`,
        );

      wasThisLetterMatched = false;
      if (
        Array.isArray(pendingMatchesArr[z].pendingToCheck) &&
        pendingMatchesArr[z].pendingToCheck.length &&
        str[i] === pendingMatchesArr[z].pendingToCheck[0]
      ) {
        DEV && console.log(`200 CASE I. Happy path - matched.`);
        wasThisLetterMatched = true;
        DEV &&
          console.log(
            `204 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} wasThisLetterMatched = ${wasThisLetterMatched}`,
          );

        // if matched, shift() it
        pendingMatchesArr[z].pendingToCheck.shift();
        DEV &&
          console.log(
            `211 ${`\u001b[${32}m${`SHIFT`}\u001b[${39}m`} pendingMatchesArr[z].pendingToCheck now = ${JSON.stringify(
              pendingMatchesArr[z].pendingToCheck,
              null,
              4,
            )}`,
          );
      } else if (
        Array.isArray(pendingMatchesArr[z].pendingToCheck) &&
        pendingMatchesArr[z].pendingToCheck.length &&
        str[i] === pendingMatchesArr[z].pendingToCheck[1]
      ) {
        DEV && console.log(`222 CASE II. Next-one matched instead.`);
        wasThisLetterMatched = true;
        DEV &&
          console.log(
            `226 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} wasThisLetterMatched = ${wasThisLetterMatched}`,
          );

        // if matched, shift() it
        pendingMatchesArr[z].pendingToCheck.shift();
        pendingMatchesArr[z].pendingToCheck.shift();
        DEV &&
          console.log(
            `234 ${`\u001b[${32}m${`SHIFT`}\u001b[${39}m`} pendingMatchesArr[z].pendingToCheck now = ${JSON.stringify(
              pendingMatchesArr[z].pendingToCheck,
              null,
              4,
            )}`,
          );

        pendingMatchesArr[z].patienceLeft -= 1;
        DEV &&
          console.log(
            `244 ${`\u001b[${31}m${`DECREASE PATIENCE`}\u001b[${39}m`} ${`\u001b[${33}m${`patienceLeft`}\u001b[${39}m`} = ${
              pendingMatchesArr[z].patienceLeft
            }`,
          );
        //
      } else {
        pendingMatchesArr[z].patienceLeft -= 1;
        DEV &&
          console.log(
            `253 ${`\u001b[${31}m${`DECREASE PATIENCE`}\u001b[${39}m`} ${`\u001b[${33}m${`patienceLeft`}\u001b[${39}m`} = ${
              pendingMatchesArr[z].patienceLeft
            }`,
          );

        // we look up the next character, if it matches, we don't pop it
        if (
          str[right(str, i) as number] !==
          pendingMatchesArr[z].pendingToCheck[0]
        ) {
          DEV &&
            console.log(
              `265 ██ str[${right(str, i)}] = "${
                str[right(str, i) as number]
              }" DIDN'T MATCH pendingMatchesArr[${z}].pendingToCheck[0] = "${
                pendingMatchesArr[z].pendingToCheck[0]
              }"`,
            );
          pendingMatchesArr[z].pendingToCheck.shift();
          DEV &&
            console.log(
              `274 ${`\u001b[${31}m${`SHIFT`}\u001b[${39}m`} pendingMatchesArr[z].pendingToCheck now: ${JSON.stringify(
                pendingMatchesArr[z].pendingToCheck,
                null,
                4,
              )}`,
            );

          // after popping, match the current character at str[i] is it
          // equal to the first element of recently-shifted
          // pendingMatchesArr[z].pendingToCheck:
          DEV &&
            console.log(
              `286 ${`\u001b[${32}m${`CHECK`}\u001b[${39}m`}, does str[${i}]=${
                str[i]
              } === pendingMatchesArr[${z}].pendingToCheck[0]=${
                pendingMatchesArr[z].pendingToCheck[0]
              }`,
            );
          if (str[i] === pendingMatchesArr[z].pendingToCheck[0]) {
            pendingMatchesArr[z].pendingToCheck.shift();
            DEV &&
              console.log(
                `296 pendingMatchesArr[z].pendingToCheck now: ${JSON.stringify(
                  pendingMatchesArr[z].pendingToCheck,
                  null,
                  4,
                )}`,
              );
          }
        }
      }
    }
    DEV && console.log(" ");
    DEV && console.log(`-----------------------------------`);
    pendingMatchesArr = pendingMatchesArr.filter(
      (obj) => obj.patienceLeft >= 0,
    );

    // out of all objects which deplete pendingToCheck[] to zero length,
    // we pick the one with the smallest "startsAt" value - that's filtering
    // the overlapping values

    let tempArr = pendingMatchesArr
      .filter((obj) => obj.pendingToCheck.length === 0)
      .map((obj) => obj.startsAt);

    if (Array.isArray(tempArr) && tempArr.length) {
      DEV &&
        console.log(
          `323 ${`\u001b[${33}m${`tempArr`}\u001b[${39}m`} = ${JSON.stringify(
            tempArr,
            null,
            4,
          )}`,
        );
      DEV &&
        console.log(
          `331 ${`\u001b[${32}m${`PING CB`}\u001b[${39}m`} with ${JSON.stringify(
            {
              idxFrom: Math.min(...tempArr) + (resolvedOpts.stringOffset || 0),
              idxTo:
                i +
                (wasThisLetterMatched ? 1 : 0) +
                (resolvedOpts.stringOffset || 0),
            },
            null,
            4,
          )}`,
        );
      let idxFrom = Math.min(...tempArr);
      let idxTo = i + (wasThisLetterMatched ? 1 : 0);
      if (str.slice(idxFrom, idxTo) !== refStr) {
        // only ping malformed values, don't ping those exactly matching "refStr"
        cb({
          idxFrom: idxFrom + (resolvedOpts.stringOffset || 0),
          idxTo: idxTo + (resolvedOpts.stringOffset || 0),
        });
      }

      // remove pendingMatchesArr[] entries with no characters to check
      pendingMatchesArr = pendingMatchesArr.filter(
        (obj) => obj.pendingToCheck.length,
      );
    }

    DEV &&
      console.log(
        `361 ${`\u001b[${34}m${`II. check the current character, maybe it matches something new`}\u001b[${39}m`}`,
      );
    for (let y = 0; y < len2; y++) {
      DEV &&
        console.log(
          `366 ${`\u001b[${36}m${`=== matching index: ${y}, that's characters str[${i}]="${str[i]}" vs. refStr[${y}]="${refStr[y]}" ===`}\u001b[${39}m`}`,
        );

      if (str[i] === refStr[y]) {
        let whatToPush = {
          startsAt: i,
          patienceLeft: patience - y,
          pendingToCheck: Array.from(refStr.slice(y + 1)),
        };
        DEV &&
          console.log(
            `377 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
              whatToPush,
              null,
              4,
            )}; break`,
          );
        pendingMatchesArr.push(whatToPush);
        break;
      }
    }

    //
    //
    //
    //
    //                            THE BOTTOM
    //                            ██████████
    //
    //
    //
    //

    // Logging

    DEV &&
      console.log(
        `${`\u001b[${90}m${`██  pendingMatchesArr = ${JSON.stringify(
          pendingMatchesArr,
          null,
          4,
        )}`}\u001b[${39}m`}`,
      );
  }
}

export { findMalformed, defaults, version };
