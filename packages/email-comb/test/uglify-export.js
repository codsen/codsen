import { test } from "uvu";
import { equal, ok, throws } from "uvu/assert";

import { comb, uglify } from "../dist/email-comb.esm.js";

const source = `<head>
<style>
  #MessageViewBody .newsletter-title { color: red; }
  .body { color: blue; }
  .unused-selector { color: grey; }
</style>
</head>
<body id="MessageViewBody" class="body">
  <h1 class="newsletter-title">Hello</h1>
</body>`;

test("01 - exposes selector uglification as a convenience function", () => {
  const opts = { whitelist: ["#MessageViewBody", ".body"] };
  const actual = uglify(source, opts);
  const direct = comb(source, { ...opts, uglify: true });

  equal(actual.result, direct.result, "01.01");
  equal(actual.log.uglified, direct.log.uglified, "01.02");
  equal(actual.deletedFromHead, direct.deletedFromHead, "01.03");
  ok(actual.result.includes("#MessageViewBody"), "01.04");
  ok(actual.result.includes(".body"), "01.05");
  ok(!actual.result.includes("newsletter-title"), "01.06");
});

test("02 - always enables uglification", () => {
  equal(uglify(source).result, comb(source, { uglify: true }).result, "02.01");
  equal(
    uglify(source, { uglify: false }).result,
    comb(source, { uglify: true }).result,
    "02.02",
  );
});

test("03 - validates the input with the wrapper's function prefix", () => {
  throws(
    () => {
      uglify();
    },
    /email-comb\/uglify\(\): \[THROW_ID_01\]/,
    "03.01",
  );
  throws(
    () => {
      uglify(true);
    },
    /email-comb\/uglify\(\): \[THROW_ID_01\]/,
    "03.02",
  );
});

test("04 - rejects invalid option containers", () => {
  throws(
    () => {
      uglify(source, true);
    },
    /email-comb\/uglify\(\): \[THROW_ID_02\]/,
    "04.01",
  );
  throws(
    () => {
      uglify(source, false);
    },
    /email-comb\/uglify\(\): \[THROW_ID_02\]/,
    "04.02",
  );
  throws(
    () => {
      uglify(source, 0);
    },
    /email-comb\/uglify\(\): \[THROW_ID_02\]/,
    "04.03",
  );
  throws(
    () => {
      uglify(source, "");
    },
    /email-comb\/uglify\(\): \[THROW_ID_02\]/,
    "04.04",
  );
});

test.run();
