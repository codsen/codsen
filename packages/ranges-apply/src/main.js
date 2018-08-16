import isInt from "is-natural-number";
import isNumStr from "is-natural-number-string";
import ordinal from "ordinal-number-suffix";
import rangesMerge from "ranges-merge";

const isArr = Array.isArray;

function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === "string";
}

function replaceSlicesArr(str, rangesArr) {
  if (arguments.length === 0) {
    throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
  }
  if (!isStr(str)) {
    throw new TypeError(
      `ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ${typeof str}, equal to: ${str}`
    );
  }
  if (!isArr(rangesArr)) {
    throw new TypeError(
      `ranges-apply: [THROW_ID_03] second input argument must be an array! Currently it's: ${typeof rangesArr}, equal to: ${rangesArr}`
    );
  }
  if (
    isArr(rangesArr) &&
    (isInt(rangesArr[0], { includeZero: true }) ||
      isNumStr(rangesArr[0], { includeZero: true })) &&
    (isInt(rangesArr[1], { includeZero: true }) ||
      isNumStr(rangesArr[1], { includeZero: true }))
  ) {
    rangesArr = [rangesArr];
  }

  rangesArr.forEach((el, i) => {
    if (!isArr(el)) {
      throw new TypeError(
        `ranges-apply: [THROW_ID_04] ranges array, second input arg., has ${ordinal(
          i
        )} element not an array: ${JSON.stringify(
          el,
          null,
          4
        )}, which is ${typeof el}`
      );
    }
    if (!isInt(el[0], { includeZero: true })) {
      if (isNumStr(el[0], { includeZero: true })) {
        rangesArr[i][0] = Number.parseInt(rangesArr[i][0], 10);
      } else {
        throw new TypeError(
          `ranges-apply: [THROW_ID_05] ranges array, second input arg. has ${ordinal(
            i
          )} element, array [${el[0]},${
            el[1]
          }]. That array has first element not an integer, but ${typeof el[0]}, equal to: ${JSON.stringify(
            el[0],
            null,
            4
          )}. Computer doesn't like this.`
        );
      }
    }
    if (!isInt(el[1], { includeZero: true })) {
      if (isNumStr(el[1], { includeZero: true })) {
        rangesArr[i][1] = Number.parseInt(rangesArr[i][1], 10);
      } else {
        throw new TypeError(
          `ranges-apply: [THROW_ID_06] ranges array, second input arg. has ${ordinal(
            i
          )} element, array [${el[0]},${
            el[1]
          }]. That array has second element not an integer, but ${typeof el[1]}, equal to: ${JSON.stringify(
            el[1],
            null,
            4
          )}. Computer doesn't like this.`
        );
      }
    }
  });

  const workingRanges = rangesMerge(rangesArr);

  if (workingRanges.length > 0) {
    const tails = str.slice(workingRanges[workingRanges.length - 1][1]);
    str = workingRanges.reduce((acc, val, i, arr) => {
      const beginning = i === 0 ? 0 : arr[i - 1][1];
      const ending = arr[i][0];
      return (
        acc +
        str.slice(beginning, ending) +
        (existy(arr[i][2]) ? arr[i][2] : "")
      );
    }, "");
    str += tails;
  }
  return str;
}

export default replaceSlicesArr;
