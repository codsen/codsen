import mergeRanges from "ranges-merge";
import rangesCrop from "ranges-crop";

const isArr = Array.isArray;

function rangesInvert(arrOfRanges, strLen, originalOptions) {
  if (!isArr(arrOfRanges) && arrOfRanges !== null) {
    throw new TypeError(
      `ranges-invert: [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(
        arrOfRanges,
        null,
        4
      )}`
    );
  }

  // strLen validation
  if (!Number.isInteger(strLen) || strLen < 0) {
    throw new TypeError(
      `ranges-invert: [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: ${typeof strLen}, equal to: ${JSON.stringify(
        strLen,
        null,
        4
      )}`
    );
  }
  // arrOfRanges validation
  if (arrOfRanges === null) {
    // this could be ranges.current() from "ranges-push" npm library
    // which means, absence of any ranges, so invert result is everything:
    // from index zero to index string.length
    if (strLen === 0) {
      return [];
    }
    return [[0, strLen]];
  } else if (arrOfRanges.length === 0) {
    return [];
  }

  // opts validation

  // declare defaults, so we can enforce types later:
  const defaults = {
    strictlyTwoElementsInRangeArrays: false,
    skipChecks: false,
  };
  // fill any settings with defaults if missing:
  const opts = Object.assign({}, defaults, originalOptions);
  // arrOfRanges validation

  let culpritsIndex;
  let culpritsLen;

  // validate does every range consist of exactly two indexes:
  if (
    !opts.skipChecks &&
    opts.strictlyTwoElementsInRangeArrays &&
    !arrOfRanges.every((rangeArr, indx) => {
      if (rangeArr.length !== 2) {
        culpritsIndex = indx;
        culpritsLen = rangeArr.length;
        return false;
      }
      return true;
    })
  ) {
    throw new TypeError(
      `ranges-invert: [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the ${culpritsIndex}th range (${JSON.stringify(
        arrOfRanges[culpritsIndex],
        null,
        0
      )}) has not two but ${culpritsLen} elements!`
    );
  }
  // validate are range indexes natural numbers:
  if (
    !opts.skipChecks &&
    !arrOfRanges.every((rangeArr, indx) => {
      if (
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
    if (
      Array.isArray(arrOfRanges) &&
      typeof arrOfRanges[0] === "number" &&
      typeof arrOfRanges[1] === "number"
    ) {
      throw new TypeError(
        `ranges-invert: [THROW_ID_07] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ${JSON.stringify(
          arrOfRanges,
          null,
          0
        )}!`
      );
    }

    throw new TypeError(
      `ranges-invert: [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ${
        culpritsIndex + 1
      }th range (${JSON.stringify(
        arrOfRanges[culpritsIndex],
        null,
        0
      )}) does not consist of only natural numbers!`
    );
  }

  let prep;

  if (!opts.skipChecks) {
    // if checks are enabled, filter merged ranges.

    // For posterity, merging is general cleaning: sorting, joining overlapping
    // ranges, also deleting blank ranges (equal start and end indexes with
    // nothing to insert). Imagine, how can we iterate unsorted ranges, for
    // example: [[1, 3], [0, 4]] -> it's impossible because order is messed up
    // and there's overlap. In reality, merged result is simply [[0, 4]].
    // Then, we invert from 4 onwards to the end of reference string length.
    prep = mergeRanges(
      arrOfRanges.filter((rangeArr) => rangeArr[0] !== rangeArr[1])
    );
  } else {
    // but if checks are turned off, filter straight away:
    prep = arrOfRanges.filter((rangeArr) => rangeArr[0] !== rangeArr[1]);
    // hopefully input ranges were really sorted...
  }

  if (prep.length === 0) {
    if (strLen === 0) {
      return [];
    }
    return [[0, strLen]];
  }

  console.log(
    `144 ${`\u001b[${33}m${`prep`}\u001b[${39}m`} = ${JSON.stringify(
      prep,
      null,
      4
    )}`
  );

  const res = prep.reduce((accum, currArr, i, arr) => {
    console.log(`\u001b[${35}m${`=====================`}\u001b[${39}m`);
    console.log(
      `accum = ${accum.length ? JSON.stringify(accum, null, 0) : "[]"}`
    );
    console.log(`currArr = ${JSON.stringify(currArr, null, 0)}`);
    console.log(`i = ${i}`);

    const res = [];

    // if the first range's first index is not zero, additionally add zero range:
    if (i === 0 && arr[0][0] !== 0) {
      console.log(`163 \u001b[${36}m${`PUSH [0, ${arr[0][0]}]`}\u001b[${39}m`);
      res.push([0, arr[0][0]]);
    }

    // Now, for every range, add inverted range that follows. For example,
    // if we've got [[1, 2], [4, 5]] and we're processing [1, 2], then
    // add the inverted chunk that follows it, [2, 4].
    const endingIndex = i < arr.length - 1 ? arr[i + 1][0] : strLen;
    if (currArr[1] !== endingIndex) {
      console.log(
        `173 \u001b[${36}m${`PUSH [${currArr[1]}, ${endingIndex}]`}\u001b[${39}m`
      );

      // this can happen only when opts.skipChecks is on:
      if (opts.skipChecks && currArr[1] > endingIndex) {
        throw new TypeError(
          `ranges-invert: [THROW_ID_08] The checking (opts.skipChecks) is off and input ranges were not sorted! We nearly wrote range [${
            currArr[1]
          }, ${endingIndex}] which is backwards. For investigation, whole ranges array is:\n${JSON.stringify(
            arr,
            null,
            0
          )}`
        );
      }
      res.push([currArr[1], endingIndex]);
    }

    return accum.concat(res);
  }, []);

  console.log(
    `${`\u001b[${33}m${`about to return ${`\u001b[${32}m${`res`}\u001b[${39}m`}`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}\n\n\n`
  );

  return rangesCrop(res, strLen);
}

export default rangesInvert;
