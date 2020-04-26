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

function rangesSort(arrOfRanges, originalOptions) {
  // arrOfRanges validation
  if (!Array.isArray(arrOfRanges)) {
    throw new TypeError(
      `ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(
        arrOfRanges,
        null,
        4
      )}`
    );
  }
  if (arrOfRanges.length === 0) {
    return arrOfRanges;
  }

  // opts validation

  // declare defaults, so we can enforce types later:
  const defaults = {
    strictlyTwoElementsInRangeArrays: false,
    progressFn: null,
  };

  // fill any settings with defaults if missing:
  const opts = { ...defaults, ...originalOptions };

  // arrOfRanges validation
  let culpritsIndex;
  let culpritsLen;
  // validate does every range consist of exactly two indexes:
  if (
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
      `ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(
        arrOfRanges[culpritsIndex],
        null,
        4
      )}) has not two but ${culpritsLen} elements!`
    );
  }

  // validate are range indexes natural numbers:
  if (
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
    throw new TypeError(
      `ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(
        arrOfRanges[culpritsIndex],
        null,
        4
      )}) does not consist of only natural numbers!`
    );
  }

  // let's assume worst case scenario is N x N.
  const maxPossibleIterations = arrOfRanges.length * arrOfRanges.length;
  let counter = 0;

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

export default rangesSort;
