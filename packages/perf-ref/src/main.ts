import { version as v } from "../package.json";
const version: string = v;
const opsPerSec = 182; // arbitrary perf measure (originally, from M1 Mac Mini)

// The following dummy function tries to do "everything" - it's used
// as a benchmark reference for all other bechmarks.
// The purpose of the "seed" is to trick the V8 to make the
// algorithm unpredictible, to prevent v8 from "cutting corners".
// If statical analysis would determine that program always yields
// a fixed value, v8 can cut corners, turn the function into:
//
// function perfRef() { return "something" }
//
// That's why we make it seemingly-indeterminable, dependant on the input seed.

function perfRef(seed = 10000): string {
  // Prepare the considerably large input:
  const input =
    "lorem ipsum 1 dolor sit amet 2, consectetur adipiscing 3 ".repeat(seed);
  // this makes our input 570,000/1024 = 556KB, the size of UMD bundle of
  // a relatively complex program

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

export { perfRef, opsPerSec, version };
