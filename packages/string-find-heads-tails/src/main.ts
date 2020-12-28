import { matchRightIncl } from "string-match-left-right";
import { arrayiffy } from "arrayiffy-if-string";
import { version } from "../package.json";

function isObj(something: any): boolean {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function isStr(something: any): boolean {
  return typeof something === "string";
}

interface Opts {
  fromIndex?: number;
  throwWhenSomethingWrongIsDetected?: boolean;
  allowWholeValueToBeOnlyHeadsOrTails?: boolean;
  source?: string;
  matchHeadsAndTailsStrictlyInPairsByTheirOrder?: boolean;
  relaxedAPI?: boolean;
}

const defaults = {
  fromIndex: 0,
  throwWhenSomethingWrongIsDetected: true,
  allowWholeValueToBeOnlyHeadsOrTails: true,
  source: "string-find-heads-tails",
  matchHeadsAndTailsStrictlyInPairsByTheirOrder: false,
  relaxedAPI: false,
};

interface ResObj {
  headsStartAt: number;
  headsEndAt: number;
  tailsStartAt: number;
  tailsEndAt: number;
}

function strFindHeadsTails(
  str: string,
  heads: string | string[],
  tails: string | string[],
  originalOpts?: Opts
): ResObj[] {
  // prep opts
  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError(
      `string-find-heads-tails: [THROW_ID_01] the fourth input argument, an Optional Options Object, must be a plain object! Currently it's equal to: ${originalOpts} (type: ${typeof originalOpts})`
    );
  }

  const opts = { ...defaults, ...originalOpts };

  if (typeof opts.fromIndex === "string" && /^\d*$/.test(opts.fromIndex)) {
    opts.fromIndex = Number(opts.fromIndex);
  } else if (!Number.isInteger(opts.fromIndex) || opts.fromIndex < 0) {
    throw new TypeError(
      `${opts.source} [THROW_ID_18] the fourth input argument must be a natural number or zero! Currently it's: ${opts.fromIndex}`
    );
  }
  console.log(
    `039 FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  //
  // insurance
  // ---------

  if (!isStr(str) || str.length === 0) {
    if (opts.relaxedAPI) {
      return [];
    }
    throw new TypeError(
      `string-find-heads-tails: [THROW_ID_02] the first input argument, input string, must be a non-zero-length string! Currently it's: ${typeof str}, equal to: ${str}`
    );
  }

  let culpritsVal;
  let culpritsIndex;

  // - for heads
  if (typeof heads !== "string" && !Array.isArray(heads)) {
    if (opts.relaxedAPI) {
      return [];
    }
    throw new TypeError(
      `string-find-heads-tails: [THROW_ID_03] the second input argument, heads, must be either a string or an array of strings! Currently it's: ${typeof heads}, equal to:\n${JSON.stringify(
        heads,
        null,
        4
      )}`
    );
  } else if (typeof heads === "string") {
    if (heads.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }
      throw new TypeError(
        "string-find-heads-tails: [THROW_ID_04] the second input argument, heads, must be a non-empty string! Currently it's empty."
      );
    } else {
      // eslint-disable-next-line no-param-reassign
      heads = arrayiffy(heads);
    }
  } else if (Array.isArray(heads)) {
    if (heads.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }
      throw new TypeError(
        "string-find-heads-tails: [THROW_ID_05] the second input argument, heads, must be a non-empty array and contain at least one string! Currently it's empty."
      );
    } else if (
      !heads.every((val, index) => {
        culpritsVal = val;
        culpritsIndex = index;
        return isStr(val);
      })
    ) {
      if (opts.relaxedAPI) {
        // eslint-disable-next-line no-param-reassign
        heads = heads.filter((el) => isStr(el) && el.length > 0);
        if (heads.length === 0) {
          return [];
        }
      } else {
        throw new TypeError(
          `string-find-heads-tails: [THROW_ID_06] the second input argument, heads, contains non-string elements! For example, element at ${culpritsIndex}th index is ${typeof culpritsVal}, equal to:\n${JSON.stringify(
            culpritsVal,
            null,
            4
          )}. Whole heads array looks like:\n${JSON.stringify(heads, null, 4)}`
        );
      }
    } else if (
      !heads.every((val, index) => {
        culpritsIndex = index;
        return isStr(val) && val.length > 0 && val.trim() !== "";
      })
    ) {
      if (opts.relaxedAPI) {
        // eslint-disable-next-line no-param-reassign
        heads = heads.filter((el) => isStr(el) && el.length > 0);
        if (heads.length === 0) {
          return [];
        }
      } else {
        throw new TypeError(
          `string-find-heads-tails: [THROW_ID_07] the second input argument, heads, should not contain empty strings! For example, there's one detected at index ${culpritsIndex} of heads array:\n${JSON.stringify(
            heads,
            null,
            4
          )}.`
        );
      }
    }
  }

  // - for tails
  if (!isStr(tails) && !Array.isArray(tails)) {
    if (opts.relaxedAPI) {
      return [];
    }
    throw new TypeError(
      `string-find-heads-tails: [THROW_ID_08] the third input argument, tails, must be either a string or an array of strings! Currently it's: ${typeof tails}, equal to:\n${JSON.stringify(
        tails,
        null,
        4
      )}`
    );
  } else if (isStr(tails)) {
    if (tails.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }
      throw new TypeError(
        "string-find-heads-tails: [THROW_ID_09] the third input argument, tails, must be a non-empty string! Currently it's empty."
      );
    } else {
      // eslint-disable-next-line no-param-reassign
      tails = arrayiffy(tails);
    }
  } else if (Array.isArray(tails)) {
    if (tails.length === 0) {
      if (opts.relaxedAPI) {
        return [];
      }
      throw new TypeError(
        "string-find-heads-tails: [THROW_ID_10] the third input argument, tails, must be a non-empty array and contain at least one string! Currently it's empty."
      );
    } else if (
      !tails.every((val, index) => {
        culpritsVal = val;
        culpritsIndex = index;
        return isStr(val);
      })
    ) {
      if (opts.relaxedAPI) {
        // eslint-disable-next-line no-param-reassign
        tails = tails.filter((el) => isStr(el) && el.length > 0);
        if (tails.length === 0) {
          return [];
        }
      } else {
        throw new TypeError(
          `string-find-heads-tails: [THROW_ID_11] the third input argument, tails, contains non-string elements! For example, element at ${culpritsIndex}th index is ${typeof culpritsVal}, equal to:\n${JSON.stringify(
            culpritsVal,
            null,
            4
          )}. Whole tails array is equal to:\n${JSON.stringify(tails, null, 4)}`
        );
      }
    } else if (
      !tails.every((val, index) => {
        culpritsIndex = index;
        return isStr(val) && val.length > 0 && val.trim() !== "";
      })
    ) {
      if (opts.relaxedAPI) {
        // eslint-disable-next-line no-param-reassign
        tails = tails.filter((el) => isStr(el) && el.length > 0);
        if (tails.length === 0) {
          return [];
        }
      } else {
        throw new TypeError(
          `string-find-heads-tails: [THROW_ID_12] the third input argument, tails, should not contain empty strings! For example, there's one detected at index ${culpritsIndex}. Whole tails array is equal to:\n${JSON.stringify(
            tails,
            null,
            4
          )}`
        );
      }
    }
  }

  // inner variable meaning is opts.source the default-one
  const s = opts.source === defaults.source;

  if (
    opts.throwWhenSomethingWrongIsDetected &&
    !opts.allowWholeValueToBeOnlyHeadsOrTails
  ) {
    if (arrayiffy(heads).includes(str)) {
      throw new Error(
        `${opts.source}${
          s ? ": [THROW_ID_16]" : ""
        } the whole input string can't be equal to ${
          isStr(heads) ? "" : "one of "
        }heads (${str})!`
      );
    } else if (arrayiffy(tails).includes(str)) {
      throw new Error(
        `${opts.source}${
          s ? ": [THROW_ID_17]" : ""
        } the whole input string can't be equal to ${
          isStr(tails) ? "" : "one of "
        }tails (${str})!`
      );
    }
  }

  //
  // prep stage.
  // ----
  // We are going to traverse the input string, checking each character one-by-one,
  // is it a first character of a sub-string, heads or tails.
  // The easy but inefficient algorithm is to traverse the input string, then
  // for each of the character, run another loop, slicing and matching, is there
  // one of heads or tails on the right of it.

  // Let's cut corners a little bit.

  // We know that heads and tails often start with special characters, not letters.
  // For example, "%%-" and "-%%".
  // There might be few types of heads and tails, for example, ones that will be
  // further processed (like wrapped with other strings) and ones that won't.

  // So, you might have two sets of heads and tails:
  // "%%-" and "-%%"; "%%_" and "_%%".

  // Notice they're quite similar and don't contain letters.

  // Imagine we're traversing the string and looking for above set of heads and
  // tails. We're concerned only if the current character is equal to "%", "-" or "_".
  // Practically, that "String.charCodeAt(0)" values:
  // '%'.charCodeAt(0) = 37
  // '-'.charCodeAt(0) = 45
  // '_'.charCodeAt(0) = 95

  // Since we don't know how many head and tail sets there will be nor their values,
  // conceptually, we are going to extract the RANGE OF CHARCODES, in the case above,
  // [37, 95].

  // This means, we traverse the string and check, is its charcode in range [37, 95].
  // If so, then we'll do all slicing/comparing.

  // take array of strings, heads, and extract the upper and lower range of indexes
  // of their first letters using charCodeAt(0)
  const headsAndTailsFirstCharIndexesRange = heads
    .concat(tails)
    .map((value) => value.charAt(0)) // get first letters
    .reduce(
      (res, val) => {
        if (val.charCodeAt(0) > res[1]) {
          return [res[0], val.charCodeAt(0)]; // find the char index of the max char index out of all
        }
        if (val.charCodeAt(0) < res[0]) {
          return [val.charCodeAt(0), res[1]]; // find the char index of the min char index out of all
        }
        return res;
      },
      [
        heads[0].charCodeAt(0), // base is the 1st char index of 1st el.
        heads[0].charCodeAt(0),
      ]
    );
  console.log(
    `300 headsAndTailsFirstCharIndexesRange = ${JSON.stringify(
      headsAndTailsFirstCharIndexesRange,
      null,
      4
    )}`
  );

  const res = [];
  let oneHeadFound = false;
  let tempResObj: Partial<ResObj> = {};
  let tailSuspicionRaised = "";

  // if opts.opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder is on and heads
  // matched was i-th in the array, we will record its index "i" and later match
  // the next tails to be also "i-th". Or throw.
  let strictMatchingIndex;

  for (let i = opts.fromIndex, len = str.length; i < len; i++) {
    const firstCharsIndex = str[i].charCodeAt(0);
    console.log(
      `---------------------------------------> ${str[i]} i=${i} (#${firstCharsIndex})`
    );
    if (
      firstCharsIndex <= headsAndTailsFirstCharIndexesRange[1] &&
      firstCharsIndex >= headsAndTailsFirstCharIndexesRange[0]
    ) {
      const matchedHeads = matchRightIncl(str, i, heads);
      if (matchedHeads && opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder) {
        for (let z = heads.length; z--; ) {
          if (heads[z] === matchedHeads) {
            strictMatchingIndex = z;
            break;
          }
        }
      }
      console.log(
        `336 matchedHeads = ${JSON.stringify(matchedHeads, null, 4)}`
      );
      if (matchedHeads) {
        if (!oneHeadFound) {
          // res[0].push(i)
          tempResObj = {};
          tempResObj.headsStartAt = i;
          tempResObj.headsEndAt = i + matchedHeads.length;
          oneHeadFound = true;
          console.log("345 head pushed");
          // offset the index so the characters of the confirmed heads can't be "reused"
          // again for subsequent, false detections:
          i += matchedHeads.length - 1;
          if (tailSuspicionRaised) {
            tailSuspicionRaised = "";
            console.log(
              `352 !!! tailSuspicionRaised = ${!!tailSuspicionRaised}`
            );
          }
          continue;
        } else if (opts.throwWhenSomethingWrongIsDetected) {
          throw new TypeError(
            `${opts.source}${
              s ? ": [THROW_ID_19]" : ""
            } When processing "${str}", we found heads (${str.slice(
              i,
              i + matchedHeads.length
            )}) starting at character with index number "${i}" and there was another set of heads before it! Generally speaking, there should be "heads-tails-heads-tails", not "heads-heads-tails"!\nWe're talking about the area of the code:\n\n\n--------------------------------------starts\n${str.slice(
              Math.max(i - 200, 0),
              i
            )}\n      ${`\u001b[${33}m------->\u001b[${39}m`} ${`\u001b[${31}m${str.slice(
              i,
              i + matchedHeads.length
            )}\u001b[${39}m`} \u001b[${33}m${"<-------"}\u001b[${39}m\n${str.slice(
              i + matchedHeads.length,
              Math.min(len, i + 200)
            )}\n--------------------------------------ends\n\n\nTo turn off this error being thrown, set opts.throwWhenSomethingWrongIsDetected to Boolean false.`
          );
        }
      }
      const matchedTails = matchRightIncl(str, i, tails);
      console.log(
        `378 matchedTails = ${JSON.stringify(matchedTails, null, 4)}`
      );

      if (
        oneHeadFound &&
        matchedTails &&
        opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder &&
        strictMatchingIndex !== undefined &&
        tails[strictMatchingIndex] !== undefined &&
        tails[strictMatchingIndex] !== matchedTails
      ) {
        let temp;
        // find out which index in "matchedTails" does have "tails":
        for (let z = tails.length; z--; ) {
          if (tails[z] === matchedTails) {
            temp = z;
            break;
          }
        }
        throw new TypeError(
          `${opts.source}${
            s ? ": [THROW_ID_20]" : ""
          } When processing "${str}", we had "opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder" on. We found heads (${
            heads[strictMatchingIndex]
          }) but the tails the followed it were not of the same index, ${strictMatchingIndex} (${
            tails[strictMatchingIndex]
          }) but ${temp} (${matchedTails}).`
        );
      }

      if (matchedTails) {
        if (oneHeadFound) {
          tempResObj.tailsStartAt = i;
          tempResObj.tailsEndAt = i + matchedTails.length;
          res.push(tempResObj);
          tempResObj = {};
          oneHeadFound = false;
          console.log("415 tail pushed");
          // same for tails, offset the index to prevent partial, erroneous detections:
          i += matchedTails.length - 1;
          continue;
        } else if (opts.throwWhenSomethingWrongIsDetected) {
          // this means it's tails found, without preceding heads
          tailSuspicionRaised = `${opts.source}${
            s ? ": [THROW_ID_21]" : ""
          } When processing "${str}", we found tails (${str.slice(
            i,
            i + matchedTails.length
          )}) starting at character with index number "${i}" but there were no heads preceding it. That's very naughty!`;
          console.log(`427 !!! tailSuspicionRaised = ${!!tailSuspicionRaised}`);
        }
      }
    }

    // closing, global checks:

    console.log(`434 tempResObj = ${JSON.stringify(tempResObj, null, 4)}`);
    // if it's the last character and some heads were found but no tails:
    if (opts.throwWhenSomethingWrongIsDetected && i === len - 1) {
      console.log("437");
      if (Object.keys(tempResObj).length !== 0) {
        console.log("439");
        throw new TypeError(
          `${opts.source}${
            s ? ": [THROW_ID_22]" : ""
          } When processing "${str}", we reached the end of the string and yet didn't find any tails (${JSON.stringify(
            tails,
            null,
            4
          )}) to match the last detected heads (${str.slice(
            tempResObj.headsStartAt,
            tempResObj.headsEndAt
          )})!`
        );
      } else if (tailSuspicionRaised) {
        console.log("453");
        throw new Error(tailSuspicionRaised);
      }
    }
  }
  console.log(`458 final res = ${JSON.stringify(res, null, 4)}`);
  return res as ResObj[];
}

export { strFindHeadsTails, defaults, version };
