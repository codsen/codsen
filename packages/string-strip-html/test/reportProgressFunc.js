/* eslint-disable no-useless-escape */
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

let thrower = (val) => {
  throw new Error(val);
};

test("01 - progress won't be reported under string length 1001", () => {
  equal(
    stripHtml("<body>text<script>zzz</script</body>", {
      reportProgressFunc: thrower,
    }).result,
    "text",
    "01.01"
  );
});

test("02 - progress won't be reported, length exactly 1000", () => {
  equal(
    // (length 10) × 100 = 1000
    stripHtml("<em>a</em>".repeat(100), {
      reportProgressFunc: thrower,
    }).result,
    "a".repeat(100),
    "02.01"
  );
});

test("03 - reports only at 50% if length is between 1000 and 2000", () => {
  // short input string should report only when passing at 50%:
  throws(
    () => {
      stripHtml("<em>a</em>".repeat(150), {
        reportProgressFunc: thrower,
      });
    },
    /50/,
    `03.01`
  );
});

test("04 - reports all percentages is input is beyond 2000 length - default range 0-100", () => {
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

  equal(gather, compareTo, "04.01");
});

test("05 - reports all percentages is input is beyond 2000 length - custom range 21-86", () => {
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

  equal(gather, compareTo, "05.01");
});

test.run();
