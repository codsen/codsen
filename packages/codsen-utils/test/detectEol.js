import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { detectEol } from "../dist/codsen-utils.esm.js";

test("01 - unusual inputs", () => {
  equal(detectEol(), undefined, "01.01");
  equal(detectEol(undefined), undefined, "01.02");
  equal(detectEol(null), undefined, "01.03");
  equal(detectEol(""), undefined, "01.04");
  equal(detectEol(1), undefined, "01.05");
  equal(detectEol(true), undefined, "01.06");
  equal(detectEol(false), undefined, "01.07");
  equal(detectEol([]), undefined, "01.08");
  equal(detectEol({}), undefined, "01.09");
  equal(
    detectEol(() => {}),
    undefined,
    "01.10",
  );
});

test("02 - no EOL", () => {
  equal(
    detectEol("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
    undefined,
    "02.01",
  );
  equal(detectEol("a\tb"), undefined, "02.02");
});

test("03 - EOL present", () => {
  equal(detectEol("a\na"), "\n", "03.01");
  equal(detectEol("a\na\n"), "\n", "03.02");

  equal(detectEol("a\r\na"), "\r\n", "03.03");
  equal(detectEol("a\r\na\r\n"), "\r\n", "03.04");

  equal(detectEol("a\ra"), "\r", "03.05");
  equal(detectEol("a\ra\r"), "\r", "03.06");
});

test("04 - mixed cases", () => {
  equal(detectEol("a\na\r".repeat(50)), "\n", "04.01");
  equal(detectEol("a\ra\r\n".repeat(50)), "\r\n", "04.02");
  equal(detectEol("a\r\na\n".repeat(50)), "\r\n", "04.03");
});

test.run();
