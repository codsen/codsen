/**
 * array-of-arrays-sort-by-col
 * Sort array of arrays by column, rippling the sorting outwards from that column
 * Version: 3.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-of-arrays-sort-by-col/
 */

var version$1 = "3.0.12";

const version = version$1;
function existy(x) {
  return x != null;
}
function sortByCol(arr, axis = 0) {
  if (!Array.isArray(arr)) {
    throw new Error(`array-of-arrays-sort-by-col: [THROW_ID_01]: The first input argument was given not as array but as ${typeof arr}, equal to:\n${JSON.stringify(arr, null, 0)}`);
  }
  if (isNaN(+axis)) {
    throw new Error(`array-of-arrays-sort-by-col: [THROW_ID_02]: The second input argument, index of the column to sort by (axis), is not integer (incl. zero)! It's currently given as:\n${JSON.stringify(axis, null, 0)} (type ${typeof axis})`);
  }
  const maxLength = Math.max(...arr.map(arr2 => arr2.length));
  if (!maxLength) {
    return arr;
  }
  if (+axis >= maxLength) {
    throw new Error(`array-of-arrays-sort-by-col: [THROW_ID_03]: The second input argument, index of the column to sort by (axis), is marking the column which does not exist on any of the input arrays. Axis was given as ${+axis} while highest index goes as far as ${maxLength}.`);
  }
  const resToBeReturned = Array.from(arr).sort((arr1, arr2) => {
    if (arr1[+axis] !== arr2[+axis]) {
      if (!existy(arr1[+axis]) && existy(arr2[+axis]) || existy(arr1[+axis]) && existy(arr2[+axis]) && arr1[+axis] > arr2[+axis]) {
        return 1;
      }
      /* istanbul ignore else */
      if (existy(arr1[+axis]) && !existy(arr2[+axis]) || existy(arr1[+axis]) && existy(arr2[+axis]) && arr1[+axis] < arr2[+axis]) {
        return -1;
      }
    }
    const maxRangeToIterate = Math.max(arr1.length, arr2.length);
    const maxRipplesLength = Math.max(+axis, maxRangeToIterate - +axis - 1);
    for (let i = 1; i <= maxRipplesLength; i++) {
      if (+axis - i >= 0) {
        if (existy(arr1[+axis - i])) {
          if (existy(arr2[+axis - i])) {
            if (arr1[+axis - i] < arr2[+axis - i]) {
              return -1;
            }
            if (arr1[+axis - i] > arr2[+axis - i]) {
              return 1;
            }
          } else {
            return -1;
          }
        }
        else if (existy(arr2[+axis - i])) {
            return 1;
          }
      }
      /* istanbul ignore else */
      if (+axis + i < maxRangeToIterate) {
        if (existy(arr1[+axis + i])) {
          if (existy(arr2[+axis + i])) {
            if (arr1[+axis + i] < arr2[+axis + i]) {
              return -1;
            }
            if (arr1[+axis + i] > arr2[+axis + i]) {
              return 1;
            }
          } else {
            return -1;
          }
        }
        else if (existy(arr2[+axis + i])) {
            return 1;
          }
      }
    }
    return 0;
  });
  return resToBeReturned;
}

export { sortByCol, version };
