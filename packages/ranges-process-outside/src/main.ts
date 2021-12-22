import runes from "runes";
import { rInvert } from "ranges-invert";
import { rCrop } from "ranges-crop";
import type { Ranges } from "ranges-crop";

import { version as v } from "../package.json";

const version: string = v;

type OffsetValueCb = (amountToOffset: number) => void;
type Callback = (
  fromIdx: number,
  toIdx: number,
  offsetValueCb: OffsetValueCb
) => void;

function rProcessOutside(
  originalStr: string,
  originalRanges: Ranges,
  cb: Callback,
  skipChecks = false
): void {
  //
  // insurance:
  //
  if (typeof originalStr !== "string") {
    if (originalStr === undefined) {
      throw new Error(
        `ranges-process-outside: [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!`
      );
    } else {
      throw new Error(
        `ranges-process-outside: [THROW_ID_02] the first input argument must be string! It was given as:\n${JSON.stringify(
          originalStr,
          null,
          4
        )} (type ${typeof originalStr})`
      );
    }
  }
  if (
    originalRanges &&
    (!Array.isArray(originalRanges) ||
      (originalRanges.length && !Array.isArray(originalRanges[0])))
  ) {
    throw new Error(
      `ranges-process-outside: [THROW_ID_03] the second input argument must be array of ranges or null! It was given as:\n${JSON.stringify(
        originalRanges,
        null,
        4
      )} (type ${typeof originalRanges})`
    );
  }
  if (typeof cb !== "function") {
    throw new Error(
      `ranges-process-outside: [THROW_ID_04] the third input argument must be a function! It was given as:\n${JSON.stringify(
        cb,
        null,
        4
      )} (type ${typeof cb})`
    );
  }

  // separate the iterator because it might be called with inverted ranges or
  // with separately calculated "everything" if the ranges are empty/falsey
  function iterator(str: string, arrOfArrays: Ranges): void {
    console.log(
      `068 iterator called with ${JSON.stringify(arrOfArrays, null, 0)}`
    );
    console.log(
      `071 ${`\u001b[${36}m${`loop [${JSON.stringify(
        arrOfArrays,
        null,
        0
      )}]`}\u001b[${39}m`}`
    );
    (arrOfArrays || []).forEach(([fromIdx, toIdx]) => {
      console.log(
        `079 ${`\u001b[${36}m${`----------------------- [${fromIdx}, ${toIdx}]`}\u001b[${39}m`}`
      );
      console.log(`081 fromIdx = ${fromIdx}; toIdx = ${toIdx}`);
      for (let i = fromIdx; i < toIdx; i++) {
        console.log(`083 ${`\u001b[${36}m${`i = ${i}`}\u001b[${39}m`}`);
        let charLength = runes(str.slice(i))[0].length;

        console.log(`086 charLength = ${charLength}`);
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        cb(i, i + charLength, (offsetValue) => {
          /* istanbul ignore else */
          if (offsetValue != null) {
            console.log(`091 offset i by "${offsetValue}" requested`);
            console.log(`092 old i = ${i}`);
            i += offsetValue;
            console.log(`094 new i = ${i}`);
          }
        });
        if (charLength && charLength > 1) {
          console.log(`098 old i = ${i}`);
          i += charLength - 1;
          console.log(`100 new i = ${i}`);
        }
      }
    });
    console.log(
      `105 ${`\u001b[${36}m${`-----------------------`}\u001b[${39}m`}`
    );
  }

  if (originalRanges?.length) {
    // if ranges are given, invert and run callback against each character
    let temp = rCrop(
      rInvert(
        skipChecks ? originalRanges : originalRanges,
        originalStr.length,
        {
          skipChecks: !!skipChecks,
        }
      ),
      originalStr.length
    );
    console.log(
      `122 ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
        temp,
        null,
        0
      )}`
    );

    iterator(originalStr, temp);
  } else {
    // otherwise, run callback on everything
    iterator(originalStr, [[0, originalStr.length]]);
  }
}

export { rProcessOutside, version };
