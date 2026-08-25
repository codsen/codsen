// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

let thrower = (val) => {
  throw new Error(val);
};

const everyPercentage = Array.from({ length: 99 }, (_, idx) => idx + 1);

function runWithProgress(input, options = {}) {
  const progress = [];
  const actual = stripHtml(input, {
    ...options,
    reportProgressFunc: (percentage) => progress.push(percentage),
  });

  return {
    actual,
    expected: stripHtml(input, options),
    progress,
  };
}

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

test("007 - measures medium decoded input in caller coordinates", () => {
  const observed = runWithProgress("&amp;".repeat(300));

  equal(observed.progress, [50], "007.01");
  equal(observed.actual, observed.expected, "007.02");
});

test("008 - measures long decoded input in caller coordinates", () => {
  const observed = runWithProgress("&amp;".repeat(500));

  equal(observed.progress, everyPercentage, "008.01");
  equal(observed.actual, observed.expected, "008.02");
});

test("009 - reports progress while scanning medium comments and CDATA", () => {
  for (const input of [
    `<!--${"x".repeat(1493)}-->`,
    `<![CDATA[${"x".repeat(1488)}]]>`,
  ]) {
    const observed = runWithProgress(input);

    equal(observed.progress, [50], "009.01");
    equal(observed.actual, observed.expected, "009.02");
  }
});

test("010 - reports progress while scanning long comments and CDATA", () => {
  for (const input of [
    `<!--${"x".repeat(2993)}-->`,
    `<![CDATA[${"x".repeat(2988)}]]>`,
  ]) {
    const observed = runWithProgress(input);

    equal(observed.progress, everyPercentage, "010.01");
    equal(observed.actual, observed.expected, "010.02");
  }
});

test("011 - reports progress after skipping ESP token contents", () => {
  const medium = runWithProgress(`{%${"x".repeat(1496)}%}`);
  const long = runWithProgress(`{%${"x".repeat(2996)}%}`);

  equal(medium.progress, [50], "011.01");
  equal(medium.actual, medium.expected, "011.02");
  equal(long.progress, [99], "011.03");
  equal(long.actual, long.expected, "011.04");
});

test("012 - reports a complete monotonic sequence across mixed paths", () => {
  const input = `${"&amp;".repeat(100)}<!--${"x".repeat(
    993,
  )}--><![CDATA[${"x".repeat(988)}]]>`;
  const observed = runWithProgress(input);

  equal(observed.progress, everyPercentage, "012.01");
  equal(observed.actual, observed.expected, "012.02");
});

test("013 - composes skipped input progress into the configured range", () => {
  const observed = runWithProgress(`<!--${"x".repeat(1493)}-->`, {
    reportProgressFuncFrom: 80,
    reportProgressFuncTo: 100,
  });

  equal(observed.progress, [90], "013.01");
  equal(observed.actual, observed.expected, "013.02");
});

test("014 - reports a recursively decoded span at its caller extent", () => {
  const observed = runWithProgress(`&${"amp;".repeat(625)}`);

  equal(observed.progress, [99], "014.01");
  equal(observed.actual, observed.expected, "014.02");
  equal(observed.actual.result, "&", "014.03");
});

test.run();
