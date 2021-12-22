import { rMerge } from "ranges-merge";
import type { Range, Ranges } from "ranges-merge";
import invariant from "tiny-invariant";

import { version as v } from "../package.json";

const version: string = v;

function rApply(
  str: string,
  originalRangesArr: Ranges,
  progressFn?: (percentageDone: number) => void
): string {
  let percentageDone = 0;
  let lastPercentageDone = 0;

  if (arguments.length === 0) {
    throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
  }
  if (typeof str !== "string") {
    throw new TypeError(
      `ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (originalRangesArr && !Array.isArray(originalRangesArr)) {
    throw new TypeError(
      `ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ${typeof originalRangesArr}, equal to: ${JSON.stringify(
        originalRangesArr,
        null,
        4
      )}`
    );
  }
  if (progressFn && typeof progressFn !== "function") {
    throw new TypeError(
      `ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ${typeof progressFn}, equal to: ${JSON.stringify(
        progressFn,
        null,
        4
      )}`
    );
  }
  if (
    !originalRangesArr ||
    // insurance against array of nulls
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    !originalRangesArr.filter((range) => range).length
  ) {
    // quick ending - no ranges passed
    return str;
  }

  let rangesArr: Range[];
  if (
    Array.isArray(originalRangesArr) &&
    Number.isInteger(originalRangesArr[0]) &&
    Number.isInteger(originalRangesArr[1])
  ) {
    // if single array was passed, wrap it into an array
    rangesArr = [Array.from(originalRangesArr) as any];
  } else {
    rangesArr = Array.from(originalRangesArr as any);
  }

  // allocate first 10% of progress to this stage
  let len = rangesArr.length;
  let counter = 0;

  rangesArr
    // insurance against array of nulls
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    .filter((range) => range)
    .forEach((el, i) => {
      if (progressFn) {
        percentageDone = Math.floor((counter / len) * 10);
        /* istanbul ignore else */
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          progressFn(percentageDone);
        }
      }

      if (!Array.isArray(el)) {
        throw new TypeError(
          `ranges-apply: [THROW_ID_05] ranges array, second input arg., has ${i}th element not an array: ${JSON.stringify(
            el,
            null,
            4
          )}, which is ${typeof el}`
        );
      }
      if (!Number.isInteger(el[0])) {
        if (!Number.isInteger(+el[0]) || +el[0] < 0) {
          throw new TypeError(
            `ranges-apply: [THROW_ID_06] ranges array, second input arg. has ${i}th element, array ${JSON.stringify(
              el,
              null,
              0
            )}. Its first element is not an integer, string index, but ${typeof el[0]}, equal to: ${JSON.stringify(
              el[0],
              null,
              4
            )}.`
          );
        } else {
          (rangesArr as any)[i][0] = +(rangesArr as any)[i][0];
        }
      }
      if (!Number.isInteger(el[1])) {
        if (!Number.isInteger(+el[1]) || +el[1] < 0) {
          throw new TypeError(
            `ranges-apply: [THROW_ID_07] ranges array, second input arg. has ${i}th element, array ${JSON.stringify(
              el,
              null,
              0
            )}. Its second element is not an integer, string index, but ${typeof el[1]}, equal to: ${JSON.stringify(
              el[1],
              null,
              4
            )}.`
          );
        } else {
          (rangesArr as any)[i][1] = +(rangesArr as any)[i][1];
        }
      }

      counter += 1;
    });

  // allocate another 10% of the progress indicator length to the rangesMerge step:
  let workingRanges = rMerge(rangesArr, {
    progressFn: (perc) => {
      if (progressFn) {
        // since "perc" is already from zero to hundred, we just divide by 10 and
        // get the range from zero to ten:
        percentageDone = 10 + Math.floor(perc / 10);
        /* istanbul ignore else */
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          progressFn(percentageDone);
        }
      }
    },
  });

  invariant(workingRanges);

  // allocate the rest 80% to the actual string assembly:
  let len2 = workingRanges.length;
  if (len2 > 0) {
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
      return `${acc}${str.slice(beginning, ending)}${arr[i][2] || ""}`;
    }, "");
    str += tails;
  }
  return str;
}

export { rApply, version, Range, Ranges };
