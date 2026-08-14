import { formatDiagnosticValue } from "codsen-utils";
import { rCrop } from "ranges-crop";

import type { Range, Ranges } from "ranges-merge";
import { rMerge } from "ranges-merge";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Opts {
  strictlyTwoElementsInRangeArrays: boolean;
  skipChecks: boolean;
}
const defaults: Opts = {
  strictlyTwoElementsInRangeArrays: false,
  skipChecks: false,
};

function rInvert(
  arrOfRanges: Ranges,
  strLen: number,
  originalOptions?: Partial<Opts>,
): Ranges {
  if (!Array.isArray(arrOfRanges) && arrOfRanges !== null) {
    throw new TypeError(
      `ranges-invert/rInvert(): [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${formatDiagnosticValue(arrOfRanges, 4)}`,
    );
  }
  // strLen validation
  if (!Number.isInteger(strLen) || strLen < 0) {
    throw new TypeError(
      `ranges-invert/rInvert(): [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: ${typeof strLen}, equal to: ${formatDiagnosticValue(strLen, 4)}`,
    );
  }
  // arrOfRanges validation
  if (
    Array.isArray(arrOfRanges) &&
    typeof arrOfRanges[0] === "number" &&
    typeof arrOfRanges[1] === "number"
  ) {
    throw new TypeError(
      `ranges-invert/rInvert(): [THROW_ID_03] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ${formatDiagnosticValue(arrOfRanges)}!`,
    );
  }
  if (!Array.isArray(arrOfRanges) || !strLen) {
    // this could be ranges.current() from "ranges-push" npm library
    // which means, absence of any ranges, so invert result is everything:
    // from index zero to index string.length
    if (!strLen) {
      return null;
    }
    return [[0, strLen]];
  }

  // opts validation

  DEV && console.log("060 ███████████████████████████████████████");
  // declare defaults, so we can enforce types later:
  // fill any settings with defaults if missing:
  let opts = { ...defaults, ...originalOptions };
  // arrOfRanges validation

  const nonEmptyRanges: Range[] = [];
  for (let i = 0; i < arrOfRanges.length; i++) {
    const range = arrOfRanges[i];
    if (!range) {
      continue;
    }
    if (!opts.skipChecks) {
      if (
        opts.strictlyTwoElementsInRangeArrays &&
        (!Array.isArray(range) || range.length !== 2)
      ) {
        throw new TypeError(
          `ranges-invert/rInvert(): [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the ${i}th range (${formatDiagnosticValue(range)}) has not two but ${range.length} elements!`,
        );
      }
      if (
        !Array.isArray(range) ||
        !Number.isInteger(range[0]) ||
        range[0] < 0 ||
        !Number.isInteger(range[1]) ||
        range[1] < 0
      ) {
        throw new TypeError(
          `ranges-invert/rInvert(): [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ${
            i + 1
          }th range (${formatDiagnosticValue(range)}) does not consist of only natural numbers!`,
        );
      }
    }
    if (Array.isArray(range) && range[0] !== range[1]) {
      nonEmptyRanges.push(range);
    }
  }

  if (!nonEmptyRanges.length) {
    return [[0, strLen]];
  }

  let prep: Range[];

  if (!opts.skipChecks) {
    // if checks are enabled, filter merged ranges.

    // For posterity, merging is general cleaning: sorting, joining overlapping
    // ranges, also deleting blank ranges (equal start and end indexes with
    // nothing to insert). Imagine, how can we iterate unsorted ranges, for
    // example: [[1, 3], [0, 4]] -> it's impossible because order is messed up
    // and there's overlap. In reality, merged result is simply [[0, 4]].
    // Then, we invert from 4 onwards to the end of reference string length.
    prep = rMerge(nonEmptyRanges) as Range[];
  } else {
    prep = nonEmptyRanges;
    // hopefully input ranges were really sorted...
  }

  DEV &&
    console.log(
      `123 ${`\u001b[${33}m${`prep`}\u001b[${39}m`} = ${JSON.stringify(
        prep,
        null,
        4,
      )}`,
    );

  const res: Range[] = [];
  for (let i = 0; i < prep.length; i++) {
    const currArr = prep[i];
    DEV &&
      console.log(`134 \u001b[${35}m${`=====================`}\u001b[${39}m`);
    DEV &&
      console.log(
        `137 accum = ${res.length ? JSON.stringify(res, null, 0) : "[]"}`,
      );
    DEV && console.log(`139 currArr = ${JSON.stringify(currArr, null, 0)}`);
    DEV && console.log(`140 i = ${i}`);

    // if the first range's first index is not zero, additionally add zero range:
    if (i === 0 && prep[0][0] !== 0) {
      DEV &&
        console.log(
          `146 \u001b[${36}m${`PUSH [0, ${prep[0][0]}]`}\u001b[${39}m`,
        );
      res.push([0, prep[0][0]]);
    }

    // Now, for every range, add inverted range that follows. For example,
    // if we've got [[1, 2], [4, 5]] and we're processing [1, 2], then
    // add the inverted chunk that follows it, [2, 4].
    const endingIndex = i < prep.length - 1 ? prep[i + 1][0] : strLen;
    if (currArr[1] !== endingIndex) {
      DEV &&
        console.log(
          `158 \u001b[${36}m${`PUSH [${currArr[1]}, ${endingIndex}]`}\u001b[${39}m`,
        );

      // this can happen only when opts.skipChecks is on:
      if (opts.skipChecks && currArr[1] > endingIndex) {
        throw new TypeError(
          `ranges-invert/rInvert(): [THROW_ID_06] The checking (opts.skipChecks) is off and input ranges were not sorted! We nearly wrote range [${
            currArr[1]
          }, ${endingIndex}] which is backwards. For investigation, whole ranges array is:\n${formatDiagnosticValue(prep)}`,
        );
      }
      res.push([currArr[1], endingIndex]);
    }
  }

  DEV &&
    console.log(
      `175 ${`\u001b[${33}m${`about to return ${`\u001b[${32}m${`res`}\u001b[${39}m`}`}\u001b[${39}m`} = ${JSON.stringify(
        res,
        null,
        4,
      )}\n\n\n`,
    );

  return rCrop(res, strLen);
}

export { defaults, type Range, type Ranges, rInvert, version };
