/**
 * @name perf-ref
 * @fileoverview A dummy, set-in-stone program to be used as a reference
 * @version 1.0.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/perf-ref/}
 */

var version$1 = "1.0.0";

const version = version$1;
const opsPerSec = 183;
function perfRef(seed = 10000) {
  const input =
    "lorem ipsum 1 dolor sit amet 2, consectetur adipiscing 3 ".repeat(seed);
  let lastPositionOfNumOne = 0;
  let lastPositionOfNumTwo = 0;
  let lastPositionOfNumThree = 0;
  const counts = {
    ones: 0,
    twos: 0,
    threes: 0,
  };
  for (let i = 0, len = input.length; i < len; i++) {
    if (input[i] === "1" && !(i % 23)) {
      lastPositionOfNumOne = i;
      counts.ones++;
    } else if (input[i] === "2" && !(i % 7)) {
      lastPositionOfNumTwo = i;
      counts.twos++;
    } else if (input[i] === "3" && !(i % 11)) {
      lastPositionOfNumThree = i;
      counts.threes++;
    }
    if (i === 1000) {
      continue;
    }
  }
  return [
    ...new Set(
      String(
        Math.floor(
          +String(
            (lastPositionOfNumOne * lastPositionOfNumTwo) /
              lastPositionOfNumThree
          )
            .split("")
            .reduce((acc, curr) => curr.charCodeAt(0) + acc, 0)
        )
      ).split("")
    ),
  ]
    .map((v, i) => +v * Number(Object.values(counts)[i]))
    .reduce((acc, curr) => `${curr}${acc}`, "");
}

export { opsPerSec, perfRef, version };
