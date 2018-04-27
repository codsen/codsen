/* eslint no-console:0 */

import clone from "lodash.clonedeep";
import isNaturalNumber from "is-natural-number";
import isNaturalNumberString from "is-natural-number-string";

const isArr = Array.isArray;

function sortBySubarray(arr, idx = 0) {
  if (!isArr(arr)) {
    throw new Error(
      `array-of-arrays-sort-by-col: [THROW_ID_01]: The first input argument was given not as array but as ${typeof arr}, equal to:\n${JSON.stringify(
        arr,
        null,
        0
      )}`
    );
  }
  if (!isNaturalNumber(idx, { includeZero: true })) {
    if (isNaturalNumberString(idx, { includeZero: true })) {
      idx = parseInt(idx, 10);
    } else {
      throw new Error(
        `array-of-arrays-sort-by-col: [THROW_ID_02]: The second input argument, index of the column to sort by, is not integer (incl. zero)! It's currently given as:\n${JSON.stringify(
          idx,
          null,
          0
        )}`
      );
    }
  }
  // sort array by sub-array's first element
  return clone(arr).sort((a, b) => {
    if (idx < Math.max(a.length) || idx < Math.max(b.length)) {
      // first do idx index
      if (a[idx] === undefined || a[idx] === null) {
        return 1;
      }
      if (b[idx] === undefined || b[idx] === null) {
        return -1;
      }
      if (a[idx] < b[idx]) {
        return -1;
      }
      if (a[idx] > b[idx]) {
        return 1;
      }
    }
    // then run whole loop skipping idx
    for (let i = 0, len = Math.max(a.length, b.length); i < len; i++) {
      if (i === idx) {
        continue; // skip idx
      }
      if (a[i] === undefined || a[i] === null) {
        return 1;
      }
      if (b[i] === undefined || b[i] === null) {
        return -1;
      }
      if (a[i] < b[i]) {
        return -1;
      }
      if (a[i] > b[i]) {
        return 1;
      }
    }
    // a must be equal to b
    return 0;
  });
}

export default sortBySubarray;
