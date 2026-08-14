import { formatDiagnosticValue } from "codsen-utils";
import type { Range, Ranges } from "ranges-merge";
import { rMerge } from "ranges-merge";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

function rCrop(arrOfRanges: Ranges, strLen: number): Ranges {
  if (arrOfRanges === null) {
    return null;
  }
  if (!Array.isArray(arrOfRanges)) {
    throw new TypeError(
      `ranges-crop/rCrop(): [THROW_ID_01] The first input's argument must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${formatDiagnosticValue(arrOfRanges, 4)}`,
    );
  }
  // strLen validation
  if (!Number.isInteger(strLen) || strLen < 0) {
    throw new TypeError(
      `ranges-crop/rCrop(): [THROW_ID_02] The second input's argument must be a natural number or zero (coming from String.length)! Currently its type is: ${typeof strLen}, equal to: ${formatDiagnosticValue(strLen, 4)}`,
    );
  }
  if (!arrOfRanges.some(Boolean)) {
    return [];
  }

  if (
    typeof arrOfRanges[0] === "number" &&
    typeof arrOfRanges[1] === "number"
  ) {
    throw new TypeError(
      `ranges-crop/rCrop(): [THROW_ID_03] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ${formatDiagnosticValue(arrOfRanges)}!`,
    );
  }

  for (let i = 0; i < arrOfRanges.length; i++) {
    const range = arrOfRanges[i];
    if (!range) {
      continue;
    }
    if (
      !Array.isArray(range) ||
      !Number.isInteger(range[0]) ||
      range[0] < 0 ||
      !Number.isInteger(range[1]) ||
      range[1] < 0
    ) {
      throw new TypeError(
        `ranges-crop/rCrop(): [THROW_ID_04] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ${i}th range (${formatDiagnosticValue(range)}) does not consist of only natural numbers!`,
      );
    }
    if (range[2] != null && typeof range[2] !== "string") {
      throw new TypeError(
        `ranges-crop/rCrop(): [THROW_ID_05] The third argument, if present at all, should be of a string-type or null. Currently the ${i}th range ${formatDiagnosticValue(range)} has a argument in the range of a type ${typeof range[2]}`,
      );
    }
  }

  //                       finally, the real action
  // ---------------------------------------------------------------------------

  DEV &&
    console.log(
      `067 ${`\u001b[${33}m${`arrOfRanges`}\u001b[${39}m`} = ${JSON.stringify(
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
            `083 - we will process the ${JSON.stringify(
              singleRangeArr,
              null,
              0,
            )}`,
          );
        if (singleRangeArr[2] != null) {
          DEV &&
            console.log(
              `092 - third argument detected! RETURN [${singleRangeArr[0]}, ${strLen}, ${singleRangeArr[2]}]`,
            );
          return [singleRangeArr[0], strLen, singleRangeArr[2]];
        }
        DEV &&
          console.log(
            `098 - no third argument detected, returning [${singleRangeArr[0]}, ${strLen}]`,
          );
        return [singleRangeArr[0], strLen];
      }
      DEV &&
        console.log(
          `104 - returning intact ${JSON.stringify(singleRangeArr, null, 0)}`,
        );
      return singleRangeArr;
    });
  DEV &&
    console.log(
      `110 ${`\u001b[${33}m${`about to return ${`\u001b[${32}m${`res`}\u001b[${39}m`}`}\u001b[${39}m`} = ${JSON.stringify(
        res,
        null,
        4,
      )}\n\n\n`,
    );

  return !res.length ? null : (res as Ranges);
}

export { type Range, type Ranges, rCrop, version };
