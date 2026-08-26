import { performance } from "node:perf_hooks";

import { Ranges } from "../dist/ranges-push.esm.js";

const sampleCount = 9;

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function measure(operation, iterations) {
  for (let i = 0; i < 100; i++) {
    operation();
  }
  const samples = [];
  for (let sample = 0; sample < sampleCount; sample++) {
    const start = performance.now();
    for (let iteration = 0; iteration < iterations; iteration++) {
      operation();
    }
    samples.push((performance.now() - start) / iterations);
  }
  return median(samples);
}

function canonicalMerge() {
  const ranges = new Ranges();
  ranges.add(6, 10);
  ranges.add(16, 20, "bbb");
  ranges.add(11, 15, "aaa");
  ranges.add(10, 30);
  ranges.add(1, 5);
  return ranges.current();
}

function adjacentAdds() {
  const ranges = new Ranges();
  for (let i = 0; i < 100; i++) {
    ranges.add(i, i + 1, i % 2 ? "a" : 1);
  }
  return ranges.current();
}

function coverageProbe(size, reversed) {
  const ranges = new Ranges();
  const input = Array.from({ length: size }, (_, index) => [index, index + 1]);
  ranges.replace(reversed ? input.reverse() : input);
  return () => ranges.firstCovers(size);
}

const scaling = [];
for (const size of [500, 1_000, 2_000, 4_000]) {
  scaling.push({
    size,
    sortedMilliseconds: measure(coverageProbe(size, false), 200),
    reversedMilliseconds: measure(coverageProbe(size, true), 200),
  });
}

const repeated = new Ranges({ limitToBeAddedWhitespace: true });
repeated.replace(
  Array.from({ length: 10_000 }, (_, index) => [
    index * 2,
    index * 2 + 1,
    "  x  ",
  ]),
);
const coldCurrentMilliseconds = measure(() => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.replace(repeated.ranges);
  return ranges.current();
}, 20);
repeated.current();
const warmCurrentMilliseconds = measure(() => repeated.current(), 200);

console.log(
  JSON.stringify(
    {
      note: "Directional diagnostics only; perf/check.js remains the normalized historical workload.",
      canonicalMergeMilliseconds: measure(canonicalMerge, 20_000),
      adjacentAddsMilliseconds: measure(adjacentAdds, 2_000),
      firstCoversScaling: scaling.map((entry, index) => ({
        ...entry,
        reversedDoublingRatio:
          index === 0
            ? null
            : entry.reversedMilliseconds /
              scaling[index - 1].reversedMilliseconds,
      })),
      repeatedCurrent: {
        size: 10_000,
        coldMilliseconds: coldCurrentMilliseconds,
        warmMilliseconds: warmCurrentMilliseconds,
        warmSpeedup: coldCurrentMilliseconds / warmCurrentMilliseconds,
      },
    },
    null,
    2,
  ),
);
