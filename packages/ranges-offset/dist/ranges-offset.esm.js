/**
 * @name ranges-offset
 * @fileoverview Increment or decrement each index in every range
 * @version 2.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-offset/}
 */

var version$1 = "2.0.13";

const version = version$1;
function rOffset(arrOfRanges, offset = 0) {
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
