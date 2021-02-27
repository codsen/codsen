/**
 * ranges-offset
 * Increment or decrement each index in every range
 * Version: 2.0.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-offset/
 */

var version$1 = "2.0.6";

const version = version$1;

function rOffset(arrOfRanges, offset = 0) {
  // empty Ranges are null!
  if (Array.isArray(arrOfRanges) && arrOfRanges.length) {
    return arrOfRanges.map(([...elem]) => {
      if (typeof elem[0] === "number") {
        elem[0] += offset;
      }

      if (typeof elem[1] === "number") {
        elem[1] += offset;
      }

      return [...elem];
    });
  }

  return arrOfRanges;
}

export { rOffset, version };
