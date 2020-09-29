import tap from "tap";
import collapse from "../dist/string-collapse-white-space.esm";

// https://stackoverflow.com/a/1527820/3943954
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// The further function generates random-length strings that do not contain
// anything to collapse. We use it to catch any false positives.
const nonWhitespaceBits = [
  "<br>",
  "<br/>",
  '<zzz class="yyy">',
  "zzz",
  "1",
  "_",
  "a",
  "&",
  "#",
  ".",
]; // bits that each of our tests will comprise of
function nothingToCollapseGenerator() {
  const testLength = getRandomInt(2, 50); // how many bits to pick and glue together
  // final result array which will comprise of "x" strings

  // traverse backwards because direction doesn't matter, yet it's more performant
  // to go backwards:
  let temp = "";
  for (let y = testLength; y--; ) {
    temp += `${nonWhitespaceBits[getRandomInt(0, 9)]}${
      Math.random() > 0.75 && y !== 0 ? " " : ""
    }`;
  }
  return temp;
}

// check a ten thousand randomly-generated strings that don't need collapsing
// -----------------------------------------------------------------------------

tap.test(`01.XX - ${`\u001b[${36}m${`GENERATED TESTS`}\u001b[${39}m`}`, (t) => {
  for (let i = 10000; i--; ) {
    let temp = nothingToCollapseGenerator();
    t.deepEqual(collapse(temp), { result: temp, ranges: null });
    temp = undefined;
  }
  t.end();
});
