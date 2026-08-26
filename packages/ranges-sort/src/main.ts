import { formatDiagnosticValue } from "codsen-utils";
import { version as v } from "../package.json";

export type Range =
  | [from: number, to: number]
  | [
      from: number,
      to: number,
      whatToInsert: string | number | null | undefined,
    ];

export type Ranges = Range[] | null;

const version: string = v;

//
//                              /\___/\
//                             ( o   o )
//                             ====Y====
//                             (        )
//                             (         )
//                             (        )))))))))))
//

// does this: [ [2, 5], [1, 6] ] => [ [1, 6], [2, 5] ]
// sorts first by first element, then by second. Retains possible third element.

export type ProgressFn = (percentageDone: number) => void;

export interface Opts {
  strictlyTwoElementsInRangeArrays: boolean;
  progressFn: undefined | null | ProgressFn;
}
const defaults: Opts = {
  strictlyTwoElementsInRangeArrays: false,
  progressFn: null,
};

function restoreExactTieOrder(sorted: Range[], original: Range[]): Range[] {
  const originalOrder = new Map(
    original.map((range, index) => [range, index]),
  );
  let groupStart = 0;
  while (groupStart < sorted.length) {
    let groupEnd = groupStart + 1;
    while (
      groupEnd < sorted.length &&
      sorted[groupStart][0] === sorted[groupEnd][0] &&
      sorted[groupStart][1] === sorted[groupEnd][1]
    ) {
      groupEnd += 1;
    }
    if (groupEnd - groupStart > 1) {
      const stableGroup = sorted
        .slice(groupStart, groupEnd)
        .sort(
          (range1, range2) =>
            (originalOrder.get(range1) as number) -
            (originalOrder.get(range2) as number),
        );
      sorted.splice(groupStart, stableGroup.length, ...stableGroup);
    }
    groupStart = groupEnd;
  }
  return sorted;
}

function rSort(arrOfRanges: Ranges, originalOptions?: Partial<Opts>): Ranges {
  // quick ending
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return arrOfRanges;
  }

  // fill any settings with defaults if missing:
  let opts = { ...defaults, ...originalOptions };

  // arrOfRanges validation
  let culpritsIndex: any;
  let culpritsLen: any;
  // validate does every range consist of exactly two indexes:
  if (
    opts.strictlyTwoElementsInRangeArrays &&
    !arrOfRanges
      // theoretically, there can be holes in the given array!
      .every((rangeArr, indx) => {
        if (!Array.isArray(rangeArr) || rangeArr.length !== 2) {
          culpritsIndex = indx;
          culpritsLen = rangeArr.length;
          return false;
        }
        return true;
      })
  ) {
    throw new TypeError(
      `ranges-sort/rSort(): [THROW_ID_01] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${culpritsIndex}th range (${formatDiagnosticValue(arrOfRanges[culpritsIndex], 4)}) has not two but ${culpritsLen} elements!`,
    );
  }

  // validate are range indexes natural numbers:
  if (
    !arrOfRanges.every((rangeArr, indx) => {
      if (
        !Array.isArray(rangeArr) ||
        !Number.isInteger(rangeArr[0]) ||
        rangeArr[0] < 0 ||
        !Number.isInteger(rangeArr[1]) ||
        rangeArr[1] < 0
      ) {
        culpritsIndex = indx;
        return false;
      }
      return true;
    })
  ) {
    throw new TypeError(
      `ranges-sort/rSort(): [THROW_ID_02] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${culpritsIndex}th range (${formatDiagnosticValue(arrOfRanges[culpritsIndex], 4)}) does not consist of only natural numbers!`,
    );
  }

  // let's assume worst case scenario is N x N.
  let maxPossibleIterations = arrOfRanges.length ** 2;
  let counter = 0;

  // return a deep clone
  const sorted = Array.from(arrOfRanges).sort((range1, range2) => {
    if (opts.progressFn) {
      counter += 1;
      opts.progressFn(Math.floor((counter * 100) / maxPossibleIterations));
    }
    if (range1[0] === range2[0]) {
      if (range1[1] < range2[1]) {
        return -1;
      }
      if (range1[1] > range2[1]) {
        return 1;
      }
      return 0;
    }
    if (range1[0] < range2[0]) {
      return -1;
    }
    return 1;
  });
  // Chromium 58's native sort becomes unstable above ten entries. Exact-key
  // groups are adjacent after sorting, so only those groups need restoration.
  return sorted.length > 10
    ? restoreExactTieOrder(sorted, arrOfRanges)
    : sorted;
}

export { defaults, rSort, version };
