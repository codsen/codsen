#!/usr/bin/env node
/* eslint import/no-extraneous-dependencies:0 */

const Benchmark = require("benchmark");
const rangesIsIndexWithin = require("./dist/ranges-is-index-within.cjs.js");
const ranges = require("non-lang-charcodes-outside-latin");

console.log(
  `\n\n\n${`\u001b[${32}m${`non-lang-charcodes-outside-latin`}\u001b[${39}m`} benchmark\n`
);

const suite = new Benchmark.Suite();
const rand = ranges[Math.floor(Math.random() * ranges.length)][0] + 2;
console.log(`random charcode from within one of ranges: ${rand}`);

// add tests
suite
  .add("JS native solution via Array.some", () => {
    // checking index 100 - result will hit first range, [0, 880]
    ranges.some(arr => arr[0] < 100 && arr[1] > 100);

    // random charCode from random index range
    ranges.some(arr => arr[0] < rand && arr[1] > rand);

    // checking index 180000 - result will hit last range, [178205, 194560]
    ranges.some(arr => arr[0] < 180000 && arr[1] > 180000);
  })
  .add("ranges-is-index-within", () => {
    rangesIsIndexWithin(100, ranges, { skipIncomingRangeSorting: true });
    rangesIsIndexWithin(rand, ranges, { skipIncomingRangeSorting: true });
    rangesIsIndexWithin(180000, ranges, { skipIncomingRangeSorting: true });
  })
  // add listeners
  .on("cycle", event => {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log(`Fastest is ${this.filter("fastest").map("name")}`);
  })
  // run async
  .run({ async: true });
