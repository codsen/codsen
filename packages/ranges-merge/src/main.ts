import { formatDiagnosticValue } from "codsen-utils";
import type { Range, Ranges } from "ranges-sort";
import { rSort } from "ranges-sort";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface UnknownValueObj {
  [key: string]: any;
}

export type ProgressFn = (percentageDone: number) => void;

export interface Opts {
  mergeType: 1 | 2 | "1" | "2";
  progressFn: null | undefined | ProgressFn;
  joinRangesThatTouchEdges: boolean;
}

const defaults: Opts = {
  mergeType: 1,
  progressFn: null,
  joinRangesThatTouchEdges: true,
};

// merges the overlapping ranges
// case #1. exact extension:
// [ [1, 5], [5, 10] ] => [ [1, 10] ]
// case #2. overlap:
// [ [1, 4], [3, 5] ] => [ [1, 5] ]
function rMerge(arrOfRanges: Ranges, originalOpts?: Partial<Opts>): Ranges {
  //
  // internal functions:
  // ---------------------------------------------------------------------------
  function isObj(something: unknown): boolean {
    return (
      !!something && typeof something === "object" && !Array.isArray(something)
    );
  }

  // quick ending:
  // ---------------------------------------------------------------------------
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return null;
  }

  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError(
      `ranges-merge/rMerge(): [THROW_ID_01] the second input argument must be a plain object. It was given as:\n${formatDiagnosticValue(originalOpts, 4)} (type ${typeof originalOpts})`,
    );
  }

  const opts: Opts = { ...defaults, ...originalOpts };
  if (
    opts.progressFn &&
    isObj(opts.progressFn) &&
    !Object.keys(opts.progressFn).length
  ) {
    opts.progressFn = null;
  } else if (opts.progressFn && typeof opts.progressFn !== "function") {
    throw new TypeError(
      `ranges-merge/rMerge(): [THROW_ID_02] opts.progressFn must be a function! It was given of a type: "${typeof opts.progressFn}", equal to ${formatDiagnosticValue(opts.progressFn, 4)}`,
    );
  }
  if (
    opts.mergeType !== 1 &&
    opts.mergeType !== 2 &&
    opts.mergeType !== "1" &&
    opts.mergeType !== "2"
  ) {
    throw new TypeError(
      `ranges-merge/rMerge(): [THROW_ID_03] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${formatDiagnosticValue(opts.mergeType, 4)}`,
    );
  }
  if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
    throw new TypeError(
      `ranges-merge/rMerge(): [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof opts.joinRangesThatTouchEdges}", equal to ${formatDiagnosticValue(opts.joinRangesThatTouchEdges, 4)}`,
    );
  }
  const progressFn = opts.progressFn;
  const joinRangesThatTouchEdges = opts.joinRangesThatTouchEdges;

  DEV && console.log();

  // progress-wise, sort takes first 20%

  // Filter and clone in one pass so the input is never mutated.
  const filtered: Range[] = [];
  for (const range of arrOfRanges) {
    if (
      Array.isArray(range) &&
      (range[2] !== undefined || range[0] !== range[1])
    ) {
      filtered.push([...range] as Range);
    }
  }

  let sortedRanges;
  let lastPercentageDone: any;
  let percentageDone;

  if (progressFn) {
    // progress already gets reported in [0,100] range, so we just need to
    // divide by 5 in order to "compress" that into 20% range.
    sortedRanges = rSort(filtered, {
      progressFn: (percentage) => {
        percentageDone = Math.floor(percentage / 5);
        // ensure each percent is passed only once:
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          progressFn(percentageDone);
        }
      },
    }) as Range[];
  } else {
    sortedRanges = rSort(filtered) as Range[];
  }

  const len = sortedRanges.length - 1;
  const mergeTypeIsTwo = opts.mergeType === 2 || opts.mergeType === "2";

  // Work right-to-left, keeping completed ranges in the unused suffix of the
  // same array. A newly widened range can absorb as many completed neighbours
  // as necessary without splicing or restarting the traversal.
  let writeIndex = sortedRanges.length;
  for (let readIndex = len; readIndex >= 0; readIndex--) {
    const currentRange = sortedRanges[readIndex];

    DEV && console.log("\n\n");
    DEV &&
      console.log(
        `\u001b[${36}m${`-------------- sortedRanges[${readIndex}] = ${JSON.stringify(
          currentRange,
          null,
          0,
        )} --------------`}\u001b[${39}m\n`,
      );

    if (progressFn && readIndex < len) {
      percentageDone = Math.floor((1 - (readIndex + 1) / len) * 78) + 21;
      if (
        percentageDone !== lastPercentageDone &&
        percentageDone > lastPercentageDone
      ) {
        lastPercentageDone = percentageDone;
        progressFn(percentageDone);
        // DEV && console.log(
        //   `153 REPORTING ${`\u001b[${33}m${`doneSoFar`}\u001b[${39}m`} = ${doneSoFar}`
        // );
      }
    }

    while (writeIndex < sortedRanges.length) {
      const nextRange = sortedRanges[writeIndex];
      const startsAtSameIndex = nextRange[0] === currentRange[0];
      if (
        !startsAtSameIndex &&
        (joinRangesThatTouchEdges
          ? nextRange[0] > currentRange[1]
          : nextRange[0] >= currentRange[1])
      ) {
        break;
      }

      DEV &&
        console.log(` nextRange[0] = ${`\u001b[${33}m${nextRange[0]}\u001b[${39}m`} ? ${`\u001b[${32}m${`<=`}\u001b[${39}m`} ? currentRange[0] = ${`\u001b[${33}m${currentRange[0]}\u001b[${39}m`} ||
     nextRange[0] = ${`\u001b[${33}m${nextRange[0]}\u001b[${39}m`} ? ${`\u001b[${32}m${`<=`}\u001b[${39}m`} ? currentRange[1] = ${`\u001b[${33}m${currentRange[1]}\u001b[${39}m`}
`);
      const nextRangeExtendsEnd = nextRange[1] >= currentRange[1];
      if (nextRangeExtendsEnd) {
        currentRange[1] = nextRange[1];
      }
      DEV &&
        console.log(
          `${`\u001b[${32}m${`SET`}\u001b[${39}m`} currentRange[0] = ${currentRange[0]}; currentRange[1] = ${currentRange[1]}`,
        );

      // tend the third argument, "what to insert"
      if (
        nextRange[2] !== undefined &&
        (startsAtSameIndex || nextRangeExtendsEnd)
      ) {
        DEV && console.log(`inside tend the insert value clauses`);

        // if the value of the range before exists:
        if (currentRange[2] !== null) {
          if (nextRange[2] === null && currentRange[2] !== null) {
            currentRange[2] = null;
          } else if (currentRange[2] != null) {
            // if there's a clash of "insert" values:
            if (mergeTypeIsTwo && startsAtSameIndex) {
              // take the value from the range that's on the right:
              currentRange[2] = nextRange[2];
            } else {
              currentRange[2] += nextRange[2];
            }
          } else {
            currentRange[2] = nextRange[2];
          }
        }
      }

      writeIndex += 1;
    }

    writeIndex -= 1;
    sortedRanges[writeIndex] = currentRange;
  }

  const mergedLength = sortedRanges.length - writeIndex;
  for (let i = 0; i < mergedLength; i++) {
    sortedRanges[i] = sortedRanges[writeIndex + i];
  }
  sortedRanges.length = mergedLength;
  DEV &&
    console.log(
      `${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} sortedRanges = ${JSON.stringify(
        sortedRanges,
        null,
        4,
      )}\n`,
    );
  return sortedRanges.length ? sortedRanges : null;
}

export { defaults, type Range, type Ranges, rMerge, version };
