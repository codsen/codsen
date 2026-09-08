import { test } from "uvu";
import { equal } from "uvu/assert";

import { unfancy } from "../dist/string-unfancy.esm.js";

test("01 - omitted and disabled options preserve existing combining-mark mappings", () => {
  equal(unfancy("q\u0313word"), "q'word", "01.01");
  equal(unfancy("q\u0313word", undefined), "q'word", "01.02");
  equal(unfancy("q\u0313word", {}), "q'word", "01.03");
  equal(
    unfancy("q\u0313word", { preserveCombiningMarks: false }),
    "q'word",
    "01.04",
  );
});

test("02 - previously ignored null and numeric extra arguments remain harmless", () => {
  equal(unfancy("q\u0313word", null), "q'word", "02.01");
  equal(unfancy("q\u0313word", 1), "q'word", "02.02");
});

test("03 - the option preserves all four mapped combining marks", () => {
  equal(
    unfancy("q\u0312word q\u0313word q\u0314word q\u0315word", {
      preserveCombiningMarks: true,
    }),
    "q\u0312word q\u0313word q\u0314word q\u0315word",
    "03.01",
  );
  equal(
    unfancy("q\u0312word q\u0313word q\u0314word q\u0315word"),
    "q'word q'word q'word q'word",
    "03.02",
  );
});

test("04 - decoded combining marks receive the selected mapping policy", () => {
  equal(
    unfancy("q&#786;word q&#x313;word q&amp;#788;word q&amp;amp;#x315;word", {
      preserveCombiningMarks: true,
    }),
    "q\u0312word q\u0313word q\u0314word q\u0315word",
    "04.01",
  );
  equal(unfancy("q&amp;amp;#x313;word"), "q'word", "04.02");
});

test("05 - preserving marks does not normalize their spelling or order", () => {
  equal(
    unfancy("cafe\u0301", { preserveCombiningMarks: true }),
    "cafe\u0301",
    "05.01",
  );
  equal(
    unfancy("a\u0315\u0300", { preserveCombiningMarks: true }),
    "a\u0315\u0300",
    "05.02",
  );
  equal(
    unfancy("ab\u0374cd", { preserveCombiningMarks: true }),
    "ab\u0374cd",
    "05.03",
  );
});

test("06 - other typography mappings remain enabled", () => {
  equal(
    unfancy("…“q\u0313word”\u00A0—‘beta’", { preserveCombiningMarks: true }),
    "...\"q\u0313word\" -'beta'",
    "06.01",
  );
  equal(
    unfancy("ab\u02B9cd", { preserveCombiningMarks: true }),
    "ab'cd",
    "06.02",
  );
});

test("07 - alternating option values do not share replacement state", () => {
  for (let i = 0; i < 5; i += 1) {
    equal(
      unfancy("q\u0313word", { preserveCombiningMarks: true }),
      "q\u0313word",
      `07.01 - call ${i + 1}`,
    );
    equal(unfancy("q\u0313word"), "q'word", `07.02 - call ${i + 1}`);
    equal(
      unfancy("…“alpha”", { preserveCombiningMarks: true }),
      '..."alpha"',
      `07.03 - call ${i + 1}`,
    );
  }
});

test("08 - empty and ASCII text retain their existing result", () => {
  equal(unfancy("", { preserveCombiningMarks: true }), "", "08.01");
  equal(
    unfancy("plain ASCII", { preserveCombiningMarks: true }),
    "plain ASCII",
    "08.02",
  );
});

test.run();
