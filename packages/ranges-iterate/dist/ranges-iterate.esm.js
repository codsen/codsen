/**
 * ranges-iterate
 * Iterate a string and any changes within given string index ranges
 * Version: 1.1.46
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-iterate/
 */

const isArr = Array.isArray;
function rangesIterate(str, originalRanges, cb, offset = 0) {
  if (typeof str !== "string") {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_01] Input string must be a string! It was given as ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        0
      )}`
    );
  } else if (!str.length) {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_02] Input string must be non-empty!`
    );
  }
  if (originalRanges !== null && !isArr(originalRanges)) {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_03] Input ranges must be an array, consisting of zero or more arrays! Currently its type is: ${typeof originalRanges}, equal to: ${JSON.stringify(
        originalRanges,
        null,
        0
      )}`
    );
  }
  if (!cb) {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_04] You should provide a callback function as third input argument!`
    );
  } else if (typeof cb !== "function") {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_05] The calllback function (third input argument) must be a function. It was given as: ${typeof cb}, equal to: ${JSON.stringify(
        cb,
        null,
        0
      )}`
    );
  }
  if (originalRanges === null || !originalRanges.length) {
    for (let i = 0; i < str.length; i++) {
      cb({
        i,
        val: str[i],
      });
    }
  } else {
    const ranges = Array.from(originalRanges);
    let currentIdx = offset;
    let finalIdx = offset;
    if (finalIdx < ranges[0][0]) {
      for (; finalIdx < ranges[0][0]; finalIdx++, currentIdx++) {
        if (!str[finalIdx]) {
          break;
        }
        cb({
          i: finalIdx,
          val: str[finalIdx],
        });
      }
    }
    if (ranges[0][0] <= currentIdx) {
      ranges.forEach((rangeArr, rangeArrIdx) => {
        if (rangeArr[2]) {
          for (let y = 0, len = rangeArr[2].length; y < len; y++) {
            cb({
              i: finalIdx,
              val: rangeArr[2][y],
            });
            finalIdx += 1;
          }
        }
        while (currentIdx < rangeArr[1]) {
          currentIdx += 1;
        }
        let loopUntil = str.length;
        if (ranges[rangeArrIdx + 1]) {
          loopUntil = ranges[rangeArrIdx + 1][0];
        }
        for (; currentIdx < loopUntil; finalIdx++, currentIdx++) {
          cb({
            i: finalIdx,
            val: str[currentIdx],
          });
        }
      });
    }
  }
}

export default rangesIterate;
