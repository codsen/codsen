/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { rMerge } from "ranges-merge";
// eslint-disable-next-line @typescript-eslint/no-redeclare
import type { Range, Ranges } from "ranges-merge";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

function rCrop(arrOfRanges: Ranges, strLen: number): Ranges {
  if (arrOfRanges === null) {
    return null;
  }
  if (!Array.isArray(arrOfRanges)) {
    throw new TypeError(
      `ranges-crop: [THROW_ID_01] The first input's argument must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(
        arrOfRanges,
        null,
        4,
      )}`,
    );
  }
  // strLen validation
  if (!Number.isInteger(strLen)) {
    throw new TypeError(
      `ranges-crop: [THROW_ID_02] The second input's argument must be a natural number or zero (coming from String.length)! Currently its type is: ${typeof strLen}, equal to: ${JSON.stringify(
        strLen,
        null,
        4,
      )}`,
    );
  }
  if (!arrOfRanges.filter((range) => range).length) {
    return arrOfRanges.filter((range) => range);
  }

  let culpritsIndex = 0;

  // validate are range indexes natural numbers:
  if (
    !arrOfRanges
      .filter((range) => range)
      .every((rangeArr, indx) => {
        if (!Number.isInteger(rangeArr[0]) || !Number.isInteger(rangeArr[1])) {
          culpritsIndex = indx;
          return false;
        }
        return true;
      })
  ) {
    if (
      Array.isArray(arrOfRanges) &&
      typeof arrOfRanges[0] === "number" &&
      typeof arrOfRanges[1] === "number"
    ) {
      throw new TypeError(
        `ranges-crop: [THROW_ID_03] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ${JSON.stringify(
          arrOfRanges,
          null,
          0,
        )}!`,
      );
    }

    throw new TypeError(
      `ranges-crop: [THROW_ID_04] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ${culpritsIndex}th range (${JSON.stringify(
        arrOfRanges[culpritsIndex],
        null,
        0,
      )}) does not consist of only natural numbers!`,
    );
  }

  // validate that any third argument values (if any) are of a string-type
  if (
    !arrOfRanges
      .filter((range) => range)
      .every((rangeArr, indx) => {
        if (rangeArr[2] != null && typeof rangeArr[2] !== "string") {
          culpritsIndex = indx;
          return false;
        }
        return true;
      })
  ) {
    throw new TypeError(
      `ranges-crop: [THROW_ID_05] The third argument, if present at all, should be of a string-type or null. Currently the ${culpritsIndex}th range ${JSON.stringify(
        arrOfRanges[culpritsIndex],
        null,
        0,
      )} has a argument in the range of a type ${typeof arrOfRanges[
        culpritsIndex
      ][2]}`,
    );
  }

  //                       finally, the real action
  // ---------------------------------------------------------------------------

  DEV &&
    console.log(
      `104 ${`\u001b[${33}m${`arrOfRanges`}\u001b[${39}m`} = ${JSON.stringify(
        arrOfRanges,
        null,
        4,
      )}`,
    );
  let res = (rMerge(arrOfRanges) || [])
    .filter(
      (singleRangeArr) =>
        singleRangeArr[0] <= strLen &&
        (singleRangeArr[2] != null || singleRangeArr[0] < strLen),
    )
    .map((singleRangeArr) => {
      if (singleRangeArr[1] > strLen) {
        DEV &&
          console.log(
            `120 - we will process the ${JSON.stringify(
              singleRangeArr,
              null,
              0,
            )}`,
          );
        if (singleRangeArr[2] != null) {
          DEV &&
            console.log(
              `129 - third argument detected! RETURN [${singleRangeArr[0]}, ${strLen}, ${singleRangeArr[2]}]`,
            );
          return [singleRangeArr[0], strLen, singleRangeArr[2]];
        }
        DEV &&
          console.log(
            `135 - no third argument detected, returning [${singleRangeArr[0]}, ${strLen}]`,
          );
        return [singleRangeArr[0], strLen];
      }
      DEV &&
        console.log(
          `141 - returning intact ${JSON.stringify(singleRangeArr, null, 0)}`,
        );
      return singleRangeArr;
    });
  DEV &&
    console.log(
      `147 ${`\u001b[${33}m${`about to return ${`\u001b[${32}m${`res`}\u001b[${39}m`}`}\u001b[${39}m`} = ${JSON.stringify(
        res,
        null,
        4,
      )}\n\n\n`,
    );

  return !res.length ? null : (res as Ranges);
}

export { rCrop, version, Range, Ranges };
