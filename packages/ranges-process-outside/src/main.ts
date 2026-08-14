import { formatDiagnosticValue } from "codsen-utils";
import type { Ranges } from "ranges-crop";
import { rCrop } from "ranges-crop";
import { rInvert } from "ranges-invert";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export type OffsetValueCb = (amountToOffset: number) => void;
export type Callback = (
  fromIdx: number,
  toIdx: number,
  offsetValueCb: OffsetValueCb,
) => void;

function rProcessOutside(
  originalStr: string,
  originalRanges: Ranges,
  cb: Callback,
  skipChecks = false,
): void {
  //
  // insurance:
  //
  if (typeof originalStr !== "string") {
    if (originalStr === undefined) {
      throw new Error(
        `ranges-process-outside/rProcessOutside(): [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!`,
      );
    } else {
      throw new Error(
        `ranges-process-outside/rProcessOutside(): [THROW_ID_02] the first input argument must be string! It was given as:\n${formatDiagnosticValue(originalStr, 4)} (type ${typeof originalStr})`,
      );
    }
  }
  if (
    originalRanges != null &&
    (!Array.isArray(originalRanges) ||
      (originalRanges.length && !Array.isArray(originalRanges[0])))
  ) {
    throw new Error(
      `ranges-process-outside/rProcessOutside(): [THROW_ID_03] the second input argument must be array of ranges or null! It was given as:\n${formatDiagnosticValue(originalRanges, 4)} (type ${typeof originalRanges})`,
    );
  }
  if (typeof cb !== "function") {
    throw new Error(
      `ranges-process-outside/rProcessOutside(): [THROW_ID_04] the third input argument must be a function! It was given as:\n${formatDiagnosticValue(cb, 4)} (type ${typeof cb})`,
    );
  }

  // separate the iterator because it might be called with inverted ranges or
  // with separately calculated "everything" if the ranges are empty/falsy
  function iterator(str: string, arrOfArrays: Ranges): void {
    DEV &&
      console.log(
        `059 iterator called with ${JSON.stringify(arrOfArrays, null, 0)}`,
      );
    DEV &&
      console.log(
        `063 ${`\u001b[${36}m${`loop [${JSON.stringify(
          arrOfArrays,
          null,
          0,
        )}]`}\u001b[${39}m`}`,
      );
    const characterLengths = new Uint32Array(str.length);
    let characterIndex = 0;
    for (const character of str) {
      characterLengths[characterIndex] = character.length;
      characterIndex += character.length;
    }

    (arrOfArrays || []).forEach(([fromIdx, toIdx]) => {
      DEV &&
        console.log(
          `079 ${`\u001b[${36}m${`----------------------- [${fromIdx}, ${toIdx}]`}\u001b[${39}m`}`,
        );
      DEV && console.log(`081 fromIdx = ${fromIdx}; toIdx = ${toIdx}`);
      for (let i = fromIdx; i < toIdx; i++) {
        DEV && console.log(`083 ${`\u001b[${36}m${`i = ${i}`}\u001b[${39}m`}`);
        const charLength = characterLengths[i] || 1;

        DEV && console.log(`086 charLength = ${charLength}`);

        cb(i, i + charLength, (offsetValue) => {
          /* c8 ignore next */
          if (offsetValue != null) {
            DEV && console.log(`091 offset i by "${offsetValue}" requested`);
            DEV && console.log(`092 old i = ${i}`);
            i += offsetValue;
            DEV && console.log(`094 new i = ${i}`);
          }
        });
        if (charLength && charLength > 1) {
          DEV && console.log(`098 old i = ${i}`);
          i += charLength - 1;
          DEV && console.log(`100 new i = ${i}`);
        }
      }
    });
    DEV &&
      console.log(
        `106 ${`\u001b[${36}m${`-----------------------`}\u001b[${39}m`}`,
      );
  }

  if (originalRanges?.length) {
    // if ranges are given, invert and run callback against each character
    let temp = rCrop(
      rInvert(originalRanges, originalStr.length, {
        skipChecks: !!skipChecks,
      }),
      originalStr.length,
    );
    DEV &&
      console.log(
        `120 ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
          temp,
          null,
          0,
        )}`,
      );

    iterator(originalStr, temp);
  } else {
    // otherwise, run callback on everything
    iterator(originalStr, [[0, originalStr.length]]);
  }
}

export { type Ranges, rProcessOutside, version };
