import { version as v } from "../package.json";

export type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];

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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        arrOfRanges[culpritsIndex],
        null,
        4,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      )}) has not two but ${culpritsLen} elements!`,
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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        arrOfRanges[culpritsIndex],
        null,
        4,
      )}) does not consist of only natural numbers!`,
    );
  }

  // let's assume worst case scenario is N x N.
  let maxPossibleIterations = arrOfRanges.length ** 2;
  let counter = 0;

  // return a deep clone
  return Array.from(arrOfRanges).sort((range1, range2) => {
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
}

export { rSort, defaults, version };
