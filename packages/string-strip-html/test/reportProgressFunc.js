// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

let thrower = (val) => {
  throw new Error(val);
};

test("001 - progress won't be reported under string length 1001", () => {
  equal(
    stripHtml("<body>text<script>zzz</script</body>", {
      reportProgressFunc: thrower,
    }).result,
    "text",
    "001.01",
  );
});

test("002 - progress won't be reported, length exactly 1000", () => {
  equal(
    // (length 10) × 100 = 1000
    stripHtml("<em>a</em>".repeat(100), {
      reportProgressFunc: thrower,
    }).result,
    "a".repeat(100),
    "002.01",
  );
});

test("003 - reports only at 50% if length is between 1000 and 2000", () => {
  // short input string should report only when passing at 50%:
  throws(
    () => {
      stripHtml("<em>a</em>".repeat(150), {
        reportProgressFunc: thrower,
      });
    },
    /50/,
    "03.01",
  );
});

test("004 - reports all percentages is input is beyond 2000 length - default range 0-100", () => {
  let gather = [];
  let counter = (num) => {
    gather.push(num);
  };

  stripHtml("<em>a</em>".repeat(500), {
    reportProgressFunc: counter,
  });
  let compareTo = [];
  for (let i = 1; i < 100; i++) {
    compareTo.push(i);
  }

  equal(gather, compareTo, "004.01");
});

test("005 - reports all percentages is input is beyond 2000 length - custom range 21-86", () => {
  let gather = [];
  let counter = (num) => {
    gather.push(num);
  };

  stripHtml("<em>a</em>".repeat(500), {
    reportProgressFunc: counter,
    reportProgressFuncFrom: 21,
    reportProgressFuncTo: 86,
  });
  let compareTo = [];
  for (let i = 21; i < 86; i++) {
    compareTo.push(i);
  }

  equal(gather, compareTo, "005.01");
});

test("006 - maps the midpoint into a custom range for medium inputs", () => {
  const gather = [];

  stripHtml("<em>a</em>".repeat(150), {
    reportProgressFunc: (percentage) => gather.push(percentage),
    reportProgressFuncFrom: 80,
    reportProgressFuncTo: 100,
  });

  equal(gather, [90], "006.01");
});

test.run();
