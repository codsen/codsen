import invert from "ranges-invert";
import crop from "ranges-crop";

const isArr = Array.isArray;

function processOutside(str, originalRanges, cb, skipChecks = false) {
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
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error(
        `ranges-process-outside: [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!`
      );
    } else {
      throw new Error(
        `ranges-process-outside: [THROW_ID_02] the first input argument must be string! It was given as:\n${JSON.stringify(
          str,
          null,
          4
        )} (type ${typeof str})`
      );
    }
  }
  if (originalRanges && !isArr(originalRanges)) {
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
  function iterator(arrOfArrays) {
    console.log(
      `057 iterator called with ${JSON.stringify(arrOfArrays, null, 4)}`
    );
    arrOfArrays.forEach(([fromIdx, toIdx]) => {
      console.log(`060 fromIdx = ${fromIdx}; toIdx = ${toIdx}`);
      for (let i = fromIdx; i < toIdx; i++) {
        console.log(`062 ${`\u001b[${36}m${`i = ${i}`}\u001b[${39}m`}`);
        cb(i);
      }
    });
  }

  if (originalRanges && originalRanges.length) {
    // if ranges are given, invert and run callback against each character
    const temp = crop(
      invert(skipChecks ? originalRanges : originalRanges, str.length, {
        skipChecks: !!skipChecks
      }),
      str.length
    );
    console.log(
      `077 ${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
        temp,
        null,
        4
      )}`
    );

    iterator(temp);
  } else {
    // otherwise, run callback on everything
    iterator([[0, str.length]]);
  }
}

export default processOutside;
