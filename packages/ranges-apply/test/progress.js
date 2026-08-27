import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import { rApply } from "../dist/ranges-apply.esm.js";

function traceForRangeCount(count) {
  const percentages = [];
  const ranges = Array.from({ length: count }, (_, index) => [
    index * 2,
    index * 2 + 1,
  ]);
  rApply("a".repeat(count * 2), ranges, (percentage) => {
    percentages.push(percentage);
  });
  return percentages;
}

function isStrictlyIncreasing(values) {
  return values.every(
    (value, index) => index === 0 || value > values[index - 1],
  );
}

test("01 - one range reports terminal completion once", () => {
  const percentages = traceForRangeCount(1);
  equal(percentages.at(-1), 100, "01.01");
  equal(
    percentages.filter((percentage) => percentage === 100).length,
    1,
    "01.02",
  );
  equal(isStrictlyIncreasing(percentages), true, "01.03");
});

test("02 - two ranges report terminal completion once", () => {
  const percentages = traceForRangeCount(2);
  equal(percentages.at(-1), 100, "02.01");
  equal(
    percentages.filter((percentage) => percentage === 100).length,
    1,
    "02.02",
  );
  equal(isStrictlyIncreasing(percentages), true, "02.03");
});

test("03 - five ranges report terminal completion once", () => {
  const percentages = traceForRangeCount(5);
  equal(percentages.at(-1), 100, "03.01");
  equal(
    percentages.filter((percentage) => percentage === 100).length,
    1,
    "03.02",
  );
  equal(isStrictlyIncreasing(percentages), true, "03.03");
});

test("04 - one hundred ranges report terminal completion once", () => {
  const percentages = traceForRangeCount(100);
  equal(percentages.at(-1), 100, "04.01");
  equal(
    percentages.filter((percentage) => percentage === 100).length,
    1,
    "04.02",
  );
  equal(isStrictlyIncreasing(percentages), true, "04.03");
});

test("05 - no ranges still report successful completion", () => {
  const percentages = [];
  equal(
    rApply("abc", [], (percentage) => percentages.push(percentage)),
    "abc",
    "05.01",
  );
  equal(percentages, [100], "05.02");
});

test("06 - callback errors propagate", () => {
  throws(
    () =>
      rApply("abc", [[0, 1]], () => {
        throw new Error("stop");
      }),
    /stop/,
    "06.01",
  );
});

test.run();
