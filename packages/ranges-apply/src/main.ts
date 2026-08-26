import { formatDiagnosticValue } from "codsen-utils";
import type { Range, Ranges } from "ranges-merge";
import { rMerge } from "ranges-merge";

import { version as v } from "../package.json";

const version: string = v;

type RangesInput = Range | Ranges;

function isNaturalNumberOrNumericString(value: unknown): boolean {
  if (typeof value === "number") {
    return Number.isInteger(value) && value >= 0;
  }
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }
  const numericValue = Number(value);
  return Number.isInteger(numericValue) && numericValue >= 0;
}

function rApply(
  str: string,
  originalRangesArr: RangesInput,
  progressFn?: null | false | 0 | ((percentageDone: number) => void),
): string {
  let percentageDone = 0;
  let lastPercentageDone = 0;

  if (
    str === undefined &&
    originalRangesArr === undefined &&
    progressFn === undefined
  ) {
    throw new Error("ranges-apply/rApply(): [THROW_ID_01] inputs missing!");
  }
  if (typeof str !== "string") {
    throw new TypeError(
      `ranges-apply/rApply(): [THROW_ID_02] first input argument must be a string! Currently it's: ${typeof str}, equal to: ${formatDiagnosticValue(str, 4)}`,
    );
  }
  if (originalRangesArr != null && !Array.isArray(originalRangesArr)) {
    throw new TypeError(
      `ranges-apply/rApply(): [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ${typeof originalRangesArr}, equal to: ${formatDiagnosticValue(originalRangesArr, 4)}`,
    );
  }
  if (progressFn && typeof progressFn !== "function") {
    throw new TypeError(
      `ranges-apply/rApply(): [THROW_ID_04] the third input argument must be a function (or falsy)! Currently it's: ${typeof progressFn}, equal to: ${formatDiagnosticValue(progressFn, 4)}`,
    );
  }
  // insurance against array of nulls
  if (!originalRangesArr?.some(Boolean)) {
    // quick ending - no ranges passed
    return str;
  }

  let rangesArr: Range[];
  if (
    Array.isArray(originalRangesArr) &&
    !Array.isArray(originalRangesArr[0]) &&
    isNaturalNumberOrNumericString(originalRangesArr[0]) &&
    isNaturalNumberOrNumericString(originalRangesArr[1])
  ) {
    // if single array was passed, wrap it into an array
    rangesArr = [Array.from(originalRangesArr as Range) as Range];
  } else {
    rangesArr = Array.from(originalRangesArr as any);
  }

  // allocate first 10% of progress to this stage
  let len = rangesArr.length;
  let counter = 0;

  rangesArr.forEach((el, i) => {
    // insurance against array of nulls
    if (!el) {
      return;
    }
    if (progressFn) {
      percentageDone = Math.floor((counter / len) * 10);
      /* c8 ignore next */
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        progressFn(percentageDone);
      }
    }

    if (!Array.isArray(el)) {
      throw new TypeError(
        `ranges-apply/rApply(): [THROW_ID_05] ranges array, second input arg., has ${i}th element not an array: ${formatDiagnosticValue(el, 4)}, which is ${typeof el}`,
      );
    }
    if (!isNaturalNumberOrNumericString(el[0])) {
      throw new TypeError(
        `ranges-apply/rApply(): [THROW_ID_06] ranges array, second input arg. has ${i}th element, array ${formatDiagnosticValue(el)}. Its first element is not a non-negative integer or string index, but ${typeof el[0]}, equal to: ${formatDiagnosticValue(el[0], 4)}.`,
      );
    }
    if (typeof el[0] === "string") {
      rangesArr[i] = [...el] as Range;
      rangesArr[i][0] = Number(el[0]);
    }
    if (!isNaturalNumberOrNumericString(el[1])) {
      throw new TypeError(
        `ranges-apply/rApply(): [THROW_ID_07] ranges array, second input arg. has ${i}th element, array ${formatDiagnosticValue(el)}. Its second element is not a non-negative integer or string index, but ${typeof el[1]}, equal to: ${formatDiagnosticValue(el[1], 4)}.`,
      );
    }
    if (typeof el[1] === "string") {
      if (rangesArr[i] === el) {
        rangesArr[i] = [...el] as Range;
      }
      rangesArr[i][1] = Number(el[1]);
    }

    counter += 1;
  });

  // allocate another 10% of the progress indicator length to the rangesMerge step:
  let workingRanges = progressFn
    ? rMerge(rangesArr, {
        progressFn: (perc) => {
          // since "perc" is already from zero to hundred, we just divide by 10 and
          // get the range from zero to ten:
          percentageDone = 10 + Math.floor(perc / 10);
          /* c8 ignore next */
          if (percentageDone !== lastPercentageDone) {
            lastPercentageDone = percentageDone;
            progressFn(percentageDone);
          }
        },
      })
    : rMerge(rangesArr);

  // allocate the rest 80% to the actual string assembly:
  let len2 = workingRanges?.length || 0;
  if (workingRanges && len2 > 0) {
    let tails = str.slice(workingRanges[len2 - 1][1]);
    str = workingRanges.reduce((acc, _val, i, arr) => {
      if (progressFn) {
        // since "perc" is already from zero to hundred, we just divide by 10 and
        // get the range from zero to ten:
        percentageDone = 20 + Math.floor((i / len2) * 80);
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          progressFn(percentageDone);
        }
      }

      let beginning = i === 0 ? 0 : arr[i - 1][1];
      let ending = arr[i][0];
      return `${acc}${str.slice(beginning, ending)}${arr[i][2] ?? ""}`;
    }, "");
    str += tails;
  }
  return str;
}

export { type Range, type Ranges, type RangesInput, rApply, version };
