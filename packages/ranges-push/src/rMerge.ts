import { formatDiagnosticValue } from "codsen-utils";
import type { Ranges, Range as RangeType } from "ranges-sort";
import { rSort } from "ranges-sort";
import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

type ProgressFn = (percentageDone: number) => void;

interface Opts {
  mergeType: 1 | 2 | "1" | "2";
  progressFn: null | undefined | ProgressFn;
  joinRangesThatTouchEdges: boolean;
}

const defaults: Opts = {
  mergeType: 1,
  progressFn: null,
  joinRangesThatTouchEdges: true,
};

function mergeInsertValues(
  currentValue: any,
  nextValue: any,
  overwriteCurrent: boolean,
): any {
  if (nextValue === undefined || currentValue === null) {
    return currentValue;
  }
  if (nextValue === null) {
    return null;
  }
  if (currentValue === undefined || overwriteCurrent) {
    return nextValue;
  }
  return currentValue + nextValue;
}

// merges the overlapping ranges
// case #1. exact extension:
// [ [1, 5], [5, 10] ] => [ [1, 10] ]
// case #2. overlap:
// [ [1, 4], [3, 5] ] => [ [1, 5] ]
function rMerge(ranges: Ranges, opts?: Partial<Opts>): Ranges {
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
  if (!Array.isArray(ranges) || !ranges.length) {
    return null;
  }

  if (opts && !isObj(opts)) {
    throw new TypeError(
      `ranges-push/rMerge(): [THROW_ID_07] the second input argument must be a plain object. It was given as:\n${formatDiagnosticValue(opts, 4)} (type ${typeof opts})`,
    );
  }
  let progressFn = opts?.progressFn ?? defaults.progressFn;
  const mergeType = opts?.mergeType ?? defaults.mergeType;
  const joinRangesThatTouchEdges =
    opts?.joinRangesThatTouchEdges ?? defaults.joinRangesThatTouchEdges;
  if (progressFn && isObj(progressFn) && !Object.keys(progressFn).length) {
    progressFn = null;
  } else if (progressFn && typeof progressFn !== "function") {
    throw new TypeError(
      `ranges-push/rMerge(): [THROW_ID_08] resolvedOpts.progressFn must be a function! It was given of a type: "${typeof progressFn}", equal to ${formatDiagnosticValue(progressFn, 4)}`,
    );
  }
  if (
    mergeType !== 1 &&
    mergeType !== 2 &&
    mergeType !== "1" &&
    mergeType !== "2"
  ) {
    throw new TypeError(
      `ranges-push/rMerge(): [THROW_ID_09] resolvedOpts.mergeType was customised to a wrong thing! It was given of a type: "${typeof mergeType}", equal to ${formatDiagnosticValue(mergeType, 4)}`,
    );
  }
  if (typeof joinRangesThatTouchEdges !== "boolean") {
    throw new TypeError(
      `ranges-push/rMerge(): [THROW_ID_10] resolvedOpts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof joinRangesThatTouchEdges}", equal to ${formatDiagnosticValue(joinRangesThatTouchEdges, 4)}`,
    );
  }

  DEV && console.log();

  // progress-wise, sort takes first 20%

  // Filter and clone in one pass so the input is never mutated. Skipped here:
  // anything which is not an array, and futile ranges - identical starting and
  // ending points with nothing to insert (no 3rd argument).
  const filtered: RangeType[] = [];
  for (const range of ranges) {
    if (
      Array.isArray(range) &&
      (range[2] !== undefined || range[0] !== range[1])
    ) {
      filtered.push([...range] as RangeType);
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
          if (progressFn != null) {
            progressFn(percentageDone);
          }
        }
      },
    }) as RangeType[];
  } else {
    sortedRanges = rSort(filtered) as RangeType[];
  }

  const len = sortedRanges.length - 1;
  const mergeTypeIsTwo = +mergeType === 2;
  // reset 80% of progress is this loop:

  // Work right-to-left, keeping completed ranges in the unused suffix of the
  // same array. A newly widened range can absorb as many completed neighbours
  // as necessary without splicing, and without restarting the traversal from
  // the end each time it does - which is what made this quadratic.
  let writeIndex = sortedRanges.length;
  for (let readIndex = len; readIndex >= 0; readIndex--) {
    const currentRange = sortedRanges[readIndex];

    DEV && console.log("143\n\n");
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
      }
    }

    while (writeIndex < sortedRanges.length) {
      const nextRange = sortedRanges[writeIndex];
      // rSort() leaves the ranges in non-descending "from" order, so the
      // range on the right can only start at the same index or later - which
      // is what the old `nextRange[0] <= currentRange[0]` clause amounted to
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

      // A null insertion is an explicit veto and wins even when its range is
      // wholly contained. Other contained insertions still contribute no edge
      // and are discarded as before.
      if (nextRange[2] === null) {
        currentRange[2] = null;
      } else if (
        nextRange[2] !== undefined &&
        (startsAtSameIndex || nextRangeExtendsEnd)
      ) {
        DEV && console.log(`inside tend the insert value clauses`);
        (currentRange as [number, number, any])[2] = mergeInsertValues(
          currentRange[2],
          nextRange[2],
          mergeTypeIsTwo && startsAtSameIndex,
        );
      }

      writeIndex += 1;
    }

    writeIndex -= 1;
    sortedRanges[writeIndex] = currentRange;
  }

  // the merged ranges sit in the tail of the array - shift them to the front
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

export {
  defaults,
  mergeInsertValues,
  type Ranges,
  type RangeType as Range,
  rMerge,
  version,
};
