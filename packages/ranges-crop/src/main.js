import mergeRanges from "ranges-merge";

const isArr = Array.isArray;

function isStr(something) {
  return typeof something === "string";
}

function existy(x) {
  return x != null;
}

function rangesCrop(arrOfRanges, strLen) {
  // arrOfRanges validation
  if (!isArr(arrOfRanges)) {
    throw new TypeError(
      `ranges-crop: [THROW_ID_01] The first input's argument must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(
        arrOfRanges,
        null,
        4
      )}`
    );
  }
  // strLen validation
  if (!Number.isInteger(strLen)) {
    throw new TypeError(
      `ranges-crop: [THROW_ID_02] The second input's argument must be a natural number or zero (coming from String.length)! Currently its type is: ${typeof strLen}, equal to: ${JSON.stringify(
        strLen,
        null,
        4
      )}`
    );
  }
  if (arrOfRanges.length === 0) {
    return arrOfRanges;
  }

  let culpritsIndex;

  // validate are range indexes natural numbers:
  if (
    !arrOfRanges.every((rangeArr, indx) => {
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
          0
        )}!`
      );
    }

    throw new TypeError(
      `ranges-crop: [THROW_ID_04] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ${culpritsIndex +
        1}th range (${JSON.stringify(
        arrOfRanges[culpritsIndex],
        null,
        0
      )}) does not consist of only natural numbers!`
    );
  }

  // validate that any third argument values (if any) are of a string-type
  if (
    !arrOfRanges.every((rangeArr, indx) => {
      if (existy(rangeArr[2]) && !isStr(rangeArr[2])) {
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
        0
      )} has a argument in the range of a type ${typeof arrOfRanges[
        culpritsIndex
      ][2]}`
    );
  }

  //                       finally, the real action
  // ---------------------------------------------------------------------------

  console.log(
    `099 ${`\u001b[${33}m${`arrOfRanges`}\u001b[${39}m`} = ${JSON.stringify(
      arrOfRanges,
      null,
      4
    )}`
  );
  const res = mergeRanges(arrOfRanges)
    .filter(
      singleRangeArr =>
        singleRangeArr[0] <= strLen &&
        (singleRangeArr[2] !== undefined || singleRangeArr[0] < strLen)
    )
    .map(singleRangeArr => {
      if (singleRangeArr[1] > strLen) {
        console.log(
          `114 - we will process the ${JSON.stringify(singleRangeArr, null, 0)}`
        );
        if (singleRangeArr[2] !== undefined) {
          console.log(
            `118 - third argument detected! RETURN [${singleRangeArr[0]}, ${strLen}, ${singleRangeArr[2]}]`
          );
          return [singleRangeArr[0], strLen, singleRangeArr[2]];
        }
        console.log(
          `123 - no third argument detected, returning [${singleRangeArr[0]}, ${strLen}]`
        );
        return [singleRangeArr[0], strLen];
      }
      console.log(
        `128 - returning intact ${JSON.stringify(singleRangeArr, null, 0)}`
      );
      return singleRangeArr;
    });
  console.log(
    `133 ${`\u001b[${33}m${`about to return ${`\u001b[${32}m${`res`}\u001b[${39}m`}`}\u001b[${39}m`} = ${JSON.stringify(
      res,
      null,
      4
    )}\n\n\n`
  );

  return res;
}

export default rangesCrop;
