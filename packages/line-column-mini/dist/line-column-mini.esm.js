/**
 * line-column-mini
 * Convert string index to line-column position
 * Version: 1.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/line-column-mini/
 */

var version = "1.1.0";

const version$1 = version; // find where is a given element located

function binarySearch(el, arr) {
  let m = 0;
  let n = arr.length - 2;

  while (m < n) {
    const k = m + (n - m >> 1);

    if (el < arr[k]) {
      n = k - 1;
    } else if (el >= arr[k + 1]) {
      m = k + 1;
    } else {
      m = k;
      break;
    }
  }

  return m;
} // split by line break characters, CR, LF or CRLF
// compile an array of indexes, where each line starts


function getLineStartIndexes(str) {
  return str.split(/\n|\r(?!\n)/g).reduce((acc, curr) => {
    acc.push(acc[acc.length - 1] + curr.length + 1);
    return acc;
  }, [0]);
}
/**
 * Convert string index to line-column position
 */


function lineCol(input, idx, skipChecks = false) {

  if (!skipChecks && (!Array.isArray(input) && typeof input !== "string" || (typeof input === "string" || Array.isArray(input)) && !input.length)) {
    return null;
  }

  if (!skipChecks && (typeof idx !== "number" || typeof input === "string" && idx >= input.length || Array.isArray(input) && idx + 1 >= input[input.length - 1])) {
    return null;
  } // it depends, pre-cached input was given or a string


  if (typeof input === "string") {
    // not cached - calculate the line start indexes
    const startIndexesOfEachLine = getLineStartIndexes(input);
    const line = binarySearch(idx, startIndexesOfEachLine);
    return {
      col: idx - startIndexesOfEachLine[line] + 1,
      line: line + 1
    };
  } // ELSE - cached line start indexes - we don't even need the string source!


  const line = binarySearch(idx, input);
  return {
    col: idx - input[line] + 1,
    line: line + 1
  };
}

export { getLineStartIndexes, lineCol, version$1 as version };
