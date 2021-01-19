import { version as v } from "../package.json";
const version: string = v;
import { Ranges } from "../../../scripts/common";

function rOffset(arrOfRanges: Ranges, offset = 0): Ranges {
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
