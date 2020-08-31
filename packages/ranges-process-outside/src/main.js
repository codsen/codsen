import invert from "ranges-invert";
import crop from "ranges-crop";
import runes from "runes";

function processOutside(originalStr, originalRanges, cb, skipChecks = false) {
  //
  // internal functions:
  //
  function isFunction(functionToCheck) {
    return (
      functionToCheck &&
      {}.toString.call(functionToCheck) === "[object Function]"
    );
  }
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
  if (!isFunction(cb)) {
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
  function iterator(str, arrOfArrays) {
    console.log(
      `060 iterator called with ${JSON.stringify(arrOfArrays, null, 0)}`
    );
    console.log(
      `063 ${`\u001b[${36}m${`loop [${JSON.stringify(
        arrOfArrays,
        null,
        0
      )}]`}\u001b[${39}m`}`
    );
    arrOfArrays.forEach(([fromIdx, toIdx]) => {
      console.log(
        `071 ${`\u001b[${36}m${`----------------------- [${fromIdx}, ${toIdx}]`}\u001b[${39}m`}`
      );
      console.log(`073 fromIdx = ${fromIdx}; toIdx = ${toIdx}`);
      for (let i = fromIdx; i < toIdx; i++) {
        console.log(`075 ${`\u001b[${36}m${`i = ${i}`}\u001b[${39}m`}`);
        const charLength = runes(str.slice(i))[0].length;

        console.log(`078 charLength = ${charLength}`);
        cb(i, i + charLength, (offsetValue) => {
          /* istanbul ignore else */
          if (offsetValue != null) {
            console.log(`082 offset i by "${offsetValue}" requested`);
            console.log(`083 old i = ${i}`);
            i += offsetValue;
            console.log(`085 new i = ${i}`);
          }
        });
        if (charLength && charLength > 1) {
          console.log(`089 old i = ${i}`);
          i += charLength - 1;
          console.log(`091 new i = ${i}`);
        }
      }
    });
    console.log(
      `096 ${`\u001b[${36}m${`-----------------------`}\u001b[${39}m`}`
    );
  }

  if (originalRanges && originalRanges.length) {
    // if ranges are given, invert and run callback against each character
    const temp = crop(
      invert(skipChecks ? originalRanges : originalRanges, originalStr.length, {
        skipChecks: !!skipChecks,
      }),
      originalStr.length
    );
    console.log(
      `109 ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
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

export default processOutside;
