/**
 * array-of-arrays-sort-by-col
 * sort array of arrays by column, rippling the sorting outwards from that column
 * Version: 2.12.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/array-of-arrays-sort-by-col
 */

function existy(x) {
  return x != null;
}
function sortBySubarray(arr, axis = 0) {
  if (!Array.isArray(arr)) {
    throw new Error(
      `array-of-arrays-sort-by-col: [THROW_ID_01]: The first input argument was given not as array but as ${typeof arr}, equal to:\n${JSON.stringify(
        arr,
        null,
        0
      )}`
    );
  }
  if (!Number.isInteger(axis)) {
    if (/^\d*$/.test(axis)) {
      axis = parseInt(axis, 10);
    } else {
      throw new Error(
        `array-of-arrays-sort-by-col: [THROW_ID_02]: The second input argument, index of the column to sort by (axis), is not integer (incl. zero)! It's currently given as:\n${JSON.stringify(
          axis,
          null,
          0
        )}`
      );
    }
  }
  const maxLength = Math.max(...arr.map((arr) => arr.length));
  if (maxLength === 0) {
    return arr;
  }
  if (axis >= maxLength) {
    throw new Error(
      `array-of-arrays-sort-by-col: [THROW_ID_03]: The second input argument, index of the column to sort by (axis), is marking the column which does not exist on any of the input arrays. Axis was given as ${axis} while highest index goes as far as ${maxLength}.`
    );
  }
  const resToBeReturned = Array.from(arr).sort((arr1, arr2) => {
    if (arr1[axis] !== arr2[axis]) {
      if (
        (!existy(arr1[axis]) && existy(arr2[axis])) ||
        (existy(arr1[axis]) && existy(arr2[axis]) && arr1[axis] > arr2[axis])
      ) {
        return 1;
      }
      if (
        (existy(arr1[axis]) && !existy(arr2[axis])) ||
        (existy(arr1[axis]) && existy(arr2[axis]) && arr1[axis] < arr2[axis])
      ) {
        return -1;
      }
    }
    const maxRangeToIterate = Math.max(arr1.length, arr2.length);
    const maxRipplesLength = Math.max(axis, maxRangeToIterate - axis - 1);
    for (let i = 1; i <= maxRipplesLength; i++) {
      if (axis - i >= 0) {
        if (existy(arr1[axis - i])) {
          if (existy(arr2[axis - i])) {
            if (arr1[axis - i] < arr2[axis - i]) {
              return -1;
            }
            if (arr1[axis - i] > arr2[axis - i]) {
              return 1;
            }
          } else {
            return -1;
          }
        } else {
          if (existy(arr2[axis - i])) {
            return 1;
          }
        }
      }
      if (axis + i < maxRangeToIterate) {
        if (existy(arr1[axis + i])) {
          if (existy(arr2[axis + i])) {
            if (arr1[axis + i] < arr2[axis + i]) {
              return -1;
            }
            if (arr1[axis + i] > arr2[axis + i]) {
              return 1;
            }
          } else {
            return -1;
          }
        } else {
          if (existy(arr2[axis + i])) {
            return 1;
          }
        }
      }
    }
    return 0;
  });
  return resToBeReturned;
}

export default sortBySubarray;
