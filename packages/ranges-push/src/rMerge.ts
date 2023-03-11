import { rSort } from "ranges-sort";
import type { Range, Ranges } from "ranges-sort";
import { Obj } from "codsen-utils";
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

  let resolvedOpts: Opts;
  if (opts) {
    if (isObj(opts)) {
      resolvedOpts = { ...defaults, ...opts };
      // 1. validate resolvedOpts.progressFn
      if (
        resolvedOpts.progressFn &&
        isObj(resolvedOpts.progressFn) &&
        !Object.keys(resolvedOpts.progressFn).length
      ) {
        resolvedOpts.progressFn = null;
      } else if (
        resolvedOpts.progressFn &&
        typeof resolvedOpts.progressFn !== "function"
      ) {
        throw new Error(
          `ranges-merge: [THROW_ID_01] resolvedOpts.progressFn must be a function! It was given of a type: "${typeof resolvedOpts.progressFn}", equal to ${JSON.stringify(
            resolvedOpts.progressFn,
            null,
            4
          )}`
        );
      }
      // 2. validate resolvedOpts.mergeType
      if (![1, 2, "1", "2"].includes(resolvedOpts.mergeType)) {
        throw new Error(
          `ranges-merge: [THROW_ID_02] resolvedOpts.mergeType was customised to a wrong thing! It was given of a type: "${typeof resolvedOpts.mergeType}", equal to ${JSON.stringify(
            resolvedOpts.mergeType,
            null,
            4
          )}`
        );
      }
      // 3. validate resolvedOpts.joinRangesThatTouchEdges
      if (typeof resolvedOpts.joinRangesThatTouchEdges !== "boolean") {
        throw new Error(
          `ranges-merge: [THROW_ID_04] resolvedOpts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof resolvedOpts.joinRangesThatTouchEdges}", equal to ${JSON.stringify(
            resolvedOpts.joinRangesThatTouchEdges,
            null,
            4
          )}`
        );
      }
    } else {
      throw new Error(
        `emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n${JSON.stringify(
          opts,
          null,
          4
        )} (type ${typeof opts})`
      );
    }
  } else {
    resolvedOpts = { ...defaults };
  }

  DEV && console.log("101");

  // progress-wise, sort takes first 20%

  // two-level-deep array clone:
  let filtered: any[] = ranges
    // filter out null
    .filter((range) => Array.isArray(range))
    .map((subarr) => [...subarr])
    .filter(
      // filter out futile ranges with identical starting and ending points with
      // nothing to add (no 3rd argument)
      (rangeArr) => rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1]
    );

  let sortedRanges;
  let lastPercentageDone: any;
  let percentageDone;

  if (resolvedOpts.progressFn) {
    // progress already gets reported in [0,100] range, so we just need to
    // divide by 5 in order to "compress" that into 20% range.
    sortedRanges = rSort(filtered, {
      progressFn: (percentage) => {
        percentageDone = Math.floor(percentage / 5);
        // ensure each percent is passed only once:
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          (resolvedOpts as Obj).progressFn(percentageDone);
        }
      },
    }) as Range[];
  } else {
    sortedRanges = rSort(filtered) as Range[];
  }

  let len = sortedRanges.length - 1;
  // reset 80% of progress is this loop:

  // loop from the end:
  for (let i = len; i > 0; i--) {
    DEV && console.log("\n\n");
    DEV &&
      console.log(
        `\u001b[${36}m${`137 -------------- sortedRanges[${i}] = ${JSON.stringify(
          sortedRanges[i],
          null,
          0
        )} --------------`}\u001b[${39}m\n`
      );

    if (resolvedOpts.progressFn) {
      percentageDone = Math.floor((1 - i / len) * 78) + 21;
      if (
        percentageDone !== lastPercentageDone &&
        percentageDone > lastPercentageDone
      ) {
        lastPercentageDone = percentageDone;
        resolvedOpts.progressFn(percentageDone);
        // DEV && console.log(
        //   `153 REPORTING ${`\u001b[${33}m${`doneSoFar`}\u001b[${39}m`} = ${doneSoFar}`
        // );
      }
    }

    // if current range is before the preceding-one
    if (
      sortedRanges[i][0] <= sortedRanges[i - 1][0] ||
      (!resolvedOpts.joinRangesThatTouchEdges &&
        sortedRanges[i][0] < sortedRanges[i - 1][1]) ||
      (resolvedOpts.joinRangesThatTouchEdges &&
        sortedRanges[i][0] <= sortedRanges[i - 1][1])
    ) {
      DEV &&
        console.log(`175  sortedRanges[${i}][0] = ${`\u001b[${33}m${
          sortedRanges[i][0]
        }\u001b[${39}m`} ? ${`\u001b[${32}m${`<=`}\u001b[${39}m`} ? sortedRanges[${
          i - 1
        }][0] = ${`\u001b[${33}m${sortedRanges[i - 1][0]}\u001b[${39}m`} ||
     sortedRanges[${i}][0] = ${`\u001b[${33}m${
          sortedRanges[i][0]
        }\u001b[${39}m`} ? ${`\u001b[${32}m${`<=`}\u001b[${39}m`} ? sortedRanges[${
          i - 1
        }][1] = ${`\u001b[${33}m${sortedRanges[i - 1][1]}\u001b[${39}m`}
`);
      sortedRanges[i - 1][0] = Math.min(
        sortedRanges[i][0],
        sortedRanges[i - 1][0]
      );
      sortedRanges[i - 1][1] = Math.max(
        sortedRanges[i][1],
        sortedRanges[i - 1][1]
      );
      DEV &&
        console.log(
          `196 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} sortedRanges[${
            i - 1
          }][0] = ${sortedRanges[i - 1][0]}; sortedRanges[${i - 1}][1] = ${
            sortedRanges[i - 1][1]
          }`
        );

      // tend the third argument, "what to insert"
      if (
        sortedRanges[i][2] !== undefined &&
        (sortedRanges[i - 1][0] >= sortedRanges[i][0] ||
          sortedRanges[i - 1][1] <= sortedRanges[i][1])
      ) {
        DEV && console.log(`209 inside tend the insert value clauses`);

        // if the value of the range before exists:
        if (sortedRanges[i - 1][2] !== null) {
          if (sortedRanges[i][2] === null && sortedRanges[i - 1][2] !== null) {
            sortedRanges[i - 1][2] = null;
          } else if (sortedRanges[i - 1][2] != null) {
            // if there's a clash of "insert" values:
            if (
              +(resolvedOpts as Obj).mergeType === 2 &&
              sortedRanges[i - 1][0] === sortedRanges[i][0]
            ) {
              // take the value from the range that's on the right:
              sortedRanges[i - 1][2] = sortedRanges[i][2];
            } else {
              (sortedRanges as [number, number, any])[i - 1][2] +=
                sortedRanges[i][2];
            }
          } else {
            sortedRanges[i - 1][2] = sortedRanges[i][2];
          }
        }
      }

      // get rid of the second element:
      DEV &&
        console.log(
          "236 --------------------------------------------------------"
        );
      DEV &&
        console.log(
          `240 before splice: ${`\u001b[${33}m${`sortedRanges`}\u001b[${39}m`} = ${JSON.stringify(
            sortedRanges,
            null,
            4
          )}`
        );
      sortedRanges.splice(i, 1);
      DEV &&
        console.log(
          `249 after splice: ${`\u001b[${33}m${`sortedRanges`}\u001b[${39}m`} = ${JSON.stringify(
            sortedRanges,
            null,
            4
          )}`
        );
      // reset the traversal, start from the end again
      i = sortedRanges.length;
      DEV &&
        console.log(
          `259 in the end, ${`\u001b[${32}m${`SET`}\u001b[${39}m`} i = ${i}`
        );
    }
  }
  DEV &&
    console.log(
      `265 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} sortedRanges = ${JSON.stringify(
        sortedRanges,
        null,
        4
      )}\n`
    );
  return sortedRanges.length ? sortedRanges : null;
}

export { rMerge, defaults, version, Range, Ranges };
