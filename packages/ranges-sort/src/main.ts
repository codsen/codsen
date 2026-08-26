import { formatDiagnosticValue, isPlainObject } from "codsen-utils";
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
  /**
   * Reports best-effort integer progress for successful nonempty sorts. The
   * final call is 100. Empty inputs and validation failures do not call it.
   */
  progressFn: false | undefined | null | ProgressFn;
}
const defaults: Opts = {
  strictlyTwoElementsInRangeArrays: false,
  progressFn: null,
};

function restoreExactTieOrder(sorted: Range[], original: Range[]): Range[] {
  let originalOrder: Map<Range, number> | undefined;
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
      if (!originalOrder) {
        originalOrder = new Map(original.map((range, index) => [range, index]));
      }
      const order = originalOrder;
      const stableGroup = sorted
        .slice(groupStart, groupEnd)
        .sort(
          (range1, range2) =>
            (order.get(range1) as number) - (order.get(range2) as number),
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

  const optionsArePlain =
    originalOptions === undefined ? true : isPlainObject(originalOptions);
  const strictlyTwoElementsInRangeArrays =
    originalOptions !== undefined &&
    optionsArePlain &&
    originalOptions?.strictlyTwoElementsInRangeArrays === true;

  // Validate by index so that sparse slots are observed as undefined entries.
  if (strictlyTwoElementsInRangeArrays) {
    for (let index = 0; index < arrOfRanges.length; index += 1) {
      const range = arrOfRanges[index];
      if (!Array.isArray(range) || range.length !== 2) {
        throw new TypeError(
          `ranges-sort/rSort(): [THROW_ID_01] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, range at index ${index} (${formatDiagnosticValue(range, 4)}) is ${Array.isArray(range) ? `an array with ${range.length} elements` : "not an array"}!`,
        );
      }
      if (
        !Number.isInteger(range[0]) ||
        range[0] < 0 ||
        !Number.isInteger(range[1]) ||
        range[1] < 0
      ) {
        throw new TypeError(
          `ranges-sort/rSort(): [THROW_ID_02] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, range at index ${index} (${formatDiagnosticValue(range, 4)}) does not consist of only natural numbers!`,
        );
      }
    }
  } else {
    for (let index = 0; index < arrOfRanges.length; index += 1) {
      const range = arrOfRanges[index];
      if (
        !Array.isArray(range) ||
        !Number.isInteger(range[0]) ||
        range[0] < 0 ||
        !Number.isInteger(range[1]) ||
        range[1] < 0
      ) {
        throw new TypeError(
          `ranges-sort/rSort(): [THROW_ID_02] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, range at index ${index} (${formatDiagnosticValue(range, 4)}) does not consist of only natural numbers!`,
        );
      }
    }
  }

  if (originalOptions !== undefined && !optionsArePlain) {
    throw new TypeError(
      `ranges-sort/rSort(): [THROW_ID_03] The second argument must be a plain options object; received ${formatDiagnosticValue(originalOptions, 4)} (type ${typeof originalOptions})!`,
    );
  }
  let progressFn: Opts["progressFn"] = defaults.progressFn;
  if (originalOptions !== undefined) {
    const strictOption = originalOptions.strictlyTwoElementsInRangeArrays;
    if (strictOption !== undefined && typeof strictOption !== "boolean") {
      throw new TypeError(
        `ranges-sort/rSort(): [THROW_ID_04] opts.strictlyTwoElementsInRangeArrays must be a boolean; received ${formatDiagnosticValue(strictOption, 4)} (type ${typeof strictOption})!`,
      );
    }
    progressFn = originalOptions.progressFn ?? defaults.progressFn;
    if (
      progressFn !== false &&
      progressFn !== null &&
      typeof progressFn !== "function"
    ) {
      throw new TypeError(
        `ranges-sort/rSort(): [THROW_ID_05] opts.progressFn must be a function, false, null, or undefined; received ${formatDiagnosticValue(progressFn, 4)} (type ${typeof progressFn})!`,
      );
    }
  }

  let sorted: Range[];
  let reportProgress: ((percentageDone: number) => void) | undefined;
  if (progressFn) {
    const maxPossibleIterations = arrOfRanges.length ** 2;
    let counter = 0;
    let lastPercentageDone: number | undefined;
    reportProgress = (percentageDone) => {
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        progressFn(percentageDone);
      }
    };
    sorted = Array.from(arrOfRanges).sort((range1, range2) => {
      counter += 1;
      reportProgress?.(
        Math.min(99, Math.floor((counter * 100) / maxPossibleIterations)),
      );
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
  } else {
    // Keep callback checks and progress arithmetic out of the default hot path.
    sorted = Array.from(arrOfRanges).sort((range1, range2) => {
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
  }
  // Chromium 58's native sort becomes unstable above ten entries. Exact-key
  // groups are adjacent after sorting, so only those groups need restoration.
  const result =
    sorted.length > 10 ? restoreExactTieOrder(sorted, arrOfRanges) : sorted;
  reportProgress?.(100);
  return result;
}

export { defaults, rSort, version };
