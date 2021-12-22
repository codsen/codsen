import { rApply } from "ranges-apply";
import { Ranges } from "ranges-push";
import trimChars from "lodash.trim";

import { version as v } from "../package.json";

const version: string = v;

interface Opts {
  removeThousandSeparatorsFromNumbers: boolean;
  padSingleDecimalPlaceNumbers: boolean;
  forceUKStyle: boolean;
}

function remSep(str: string, originalOpts?: Partial<Opts>): string {
  // vars
  let allOK = true; // used to bail somewhere down the line. It's a killswitch.
  let knownSeparatorsArray = [".", ",", "'", " "];
  let firstSeparator;

  // validation
  if (typeof str !== "string") {
    throw new TypeError(
      `string-remove-thousand-separators/remSep(): [THROW_ID_01] Input must be string! Currently it's: ${typeof str}, equal to:\n${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new TypeError(
      `string-remove-thousand-separators/remSep(): [THROW_ID_02] Options object must be a plain object! Currently it's: ${typeof originalOpts}, equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }

  // prep opts
  let defaults: Opts = {
    removeThousandSeparatorsFromNumbers: true,
    padSingleDecimalPlaceNumbers: true,
    forceUKStyle: false,
  };
  let opts: Opts = { ...defaults, ...originalOpts };

  // trim whitespace and wrapping double quotes:
  let res = trimChars(str.trim(), '"');

  // end sooner if it's an empty string:
  if (res === "") {
    return res;
  }

  // we'll manage the TO-DELETE string slice ranges using this:
  let rangesToDelete = new Ranges();

  // traverse the string indexes
  for (let i = 0, len = res.length; i < len; i++) {
    // -------------------------------------------------------------------------
    // catch empty space for Russian-style thousand separators (spaces):
    if (opts.removeThousandSeparatorsFromNumbers && res[i].trim() === "") {
      rangesToDelete.add(i, i + 1);
    }
    // -------------------------------------------------------------------------
    // catch single quotes for Swiss-style thousand separators:
    // (safe to delete instantly because they're not commas or dots)
    if (opts.removeThousandSeparatorsFromNumbers && res[i] === "'") {
      rangesToDelete.add(i, i + 1);
      // but if single quote follows this, that's dodgy and let's bail
      if (res[i + 1] === "'") {
        // bail!
        allOK = false;
        break;
        // That's very weird case by the way. We're talking about CSV contents here after all...
      }
    }
    // -------------------------------------------------------------------------
    // catch thousand separators
    if (knownSeparatorsArray.includes(res[i])) {
      // check three characters to the right
      if (res[i + 1] !== undefined && /^\d*$/.test(res[i + 1])) {
        if (res[i + 2] !== undefined) {
          if (/^\d*$/.test(res[i + 2])) {
            //
            // thousands separator followed by two digits...
            if (res[i + 3] !== undefined) {
              if (/^\d*$/.test(res[i + 3])) {
                if (res[i + 4] !== undefined && /^\d*$/.test(res[i + 4])) {
                  // four digits after thousands separator
                  // bail!
                  allOK = false;
                  break;
                } else {
                  //
                  // thousands separator followed by three digits...
                  // =============
                  // 1. submit for deletion
                  if (opts.removeThousandSeparatorsFromNumbers) {
                    rangesToDelete.add(i, i + 1);
                  }

                  // 2. enforce the thousands separator consistency:
                  if (!firstSeparator) {
                    // It's the first encountered thousand separator. Make a record of it.
                    firstSeparator = res[i];
                  } else if (res[i] !== firstSeparator) {
                    // Check against the previous separator. These have to be consistent,
                    // of we'll bail.
                    allOK = false;
                    break;
                  }
                  //
                  //
                }
              } else {
                // bail!
                allOK = false;
                break;
              }
            } else if (
              opts.removeThousandSeparatorsFromNumbers &&
              opts.forceUKStyle &&
              res[i] === ","
            ) {
              //
              // Stuff like "100,01" (Russian notation) or "100.01" (UK notation).
              // A Separator followed by two digits and string ends.
              //
              // If Russian notation:
              rangesToDelete.add(i, i + 1, ".");
            }
          } else {
            // stuff like "1,0a" - bail
            allOK = false;
            break;
          }
        } else {
          // second digit IS UNDEFINED
          //
          // Stuff like "10.1" (UK notation) or "10,1" (Russian notation).
          // Thousands separator followed by only one digit and then string ends.
          // =============
          // Convert Russian notation if requested:
          if (opts.forceUKStyle && res[i] === ",") {
            rangesToDelete.add(i, i + 1, ".");
          }
          // Pad it with zero if requested:
          if (opts.padSingleDecimalPlaceNumbers) {
            rangesToDelete.add(i + 2, i + 2, "0");
          }
        }
      }
      // when we have one decimal place, like "100.2", we pad it to two places, like "100.20"
      // -------------------------------------------------------------------------
    } else if (!/^\d*$/.test(res[i])) {
      // catch unrecognised characters,
      // then turn off the killswitch and break the loop
      allOK = false;
      break;
    }
  }

  if (allOK && rangesToDelete.current()) {
    return rApply(res, rangesToDelete.current());
  }
  return res;
}

export { remSep, version };
