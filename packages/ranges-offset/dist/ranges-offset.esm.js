/**
 * ranges-offset
 * Increment or decrement each index in every range
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-offset/
 */

var version = "2.0.5";

const version$1 = version;

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

export { rOffset, version$1 as version };
