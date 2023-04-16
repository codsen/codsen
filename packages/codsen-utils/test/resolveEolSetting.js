import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { resolveEolSetting } from "../dist/codsen-utils.esm.js";

test("01 - only relying on default", () => {
  // implied default, LF
  equal(resolveEolSetting("a", null), "\n", "01.01");
  // hardcoded default
  equal(resolveEolSetting("a", null, "\n"), "\n", "01.02");
  equal(resolveEolSetting("a", null, "\r"), "\r", "01.03");
  equal(resolveEolSetting("a", null, "\r\n"), "\r\n", "01.04");
  throws(
    () => {
      resolveEolSetting("a", null, "foo");
    },
    /defaultEolChar/gm,
    "01.05"
  );
});

test("02 - decision is made based on passed settings", () => {
  // ██ 1. LF
  // implied default, LF
  equal(resolveEolSetting("a", "lf"), "\n", "02.01");
  // even if defaults are contradicting...
  equal(resolveEolSetting("a", "lf", "\r\n"), "\n", "02.02");
  equal(resolveEolSetting("a", "lf", "\r"), "\n", "02.03");

  // ██ 2. CR
  equal(resolveEolSetting("a", "cr", "\r\n"), "\r", "02.04");
  equal(resolveEolSetting("a", "cr", "\r"), "\r", "02.05");
  equal(resolveEolSetting("a", "cr", "\n"), "\r", "02.06");

  // ██ 3. CRLF
  equal(resolveEolSetting("a", "crlf", "\r\n"), "\r\n", "02.07");
  equal(resolveEolSetting("a", "crlf", "\r"), "\r\n", "02.08");
  equal(resolveEolSetting("a", "crlf", "\n"), "\r\n", "02.09");
});

test("03 - decision is made based on the reference string", () => {
  // ██ 1. absent/falsy 2nd arg settings - no content
  equal(resolveEolSetting("a", undefined), "\n", "03.01");
  equal(resolveEolSetting("a", undefined, "\r\n"), "\r\n", "03.02");
  equal(resolveEolSetting("a", undefined, "\r"), "\r", "03.03");
  equal(resolveEolSetting("a", undefined, "\n"), "\n", "03.04");

  equal(resolveEolSetting("a", null), "\n", "03.05");
  equal(resolveEolSetting("a", null, "\r\n"), "\r\n", "03.06");
  equal(resolveEolSetting("a", null, "\r"), "\r", "03.07");
  equal(resolveEolSetting("a", null, "\n"), "\n", "03.08");

  // ██ 2. absent/falsy 2nd arg settings - content with line breaks
  // 2.1 CRLF
  equal(resolveEolSetting("a\r\nb", undefined), "\r\n", "03.09");
  equal(resolveEolSetting("a\r\nb", undefined, "\r\n"), "\r\n", "03.10");
  equal(resolveEolSetting("a\r\nb", undefined, "\r"), "\r\n", "03.11");
  equal(resolveEolSetting("a\r\nb", undefined, "\n"), "\r\n", "03.12");

  equal(resolveEolSetting("a\r\nb", null), "\r\n", "03.13");
  equal(resolveEolSetting("a\r\nb", null, "\r\n"), "\r\n", "03.14");
  equal(resolveEolSetting("a\r\nb", null, "\r"), "\r\n", "03.15");
  equal(resolveEolSetting("a\r\nb", null, "\n"), "\r\n", "03.16");

  // 2.2 CR
  equal(resolveEolSetting("a\rb", undefined), "\r", "03.17");
  equal(resolveEolSetting("a\rb", undefined, "\r\n"), "\r", "03.18");
  equal(resolveEolSetting("a\rb", undefined, "\r"), "\r", "03.19");
  equal(resolveEolSetting("a\rb", undefined, "\n"), "\r", "03.20");

  equal(resolveEolSetting("a\rb", null), "\r", "03.21");
  equal(resolveEolSetting("a\rb", null, "\r\n"), "\r", "03.22");
  equal(resolveEolSetting("a\rb", null, "\r"), "\r", "03.23");
  equal(resolveEolSetting("a\rb", null, "\n"), "\r", "03.24");

  // 2.3 LF
  equal(resolveEolSetting("a\nb", undefined), "\n", "03.25");
  equal(resolveEolSetting("a\nb", undefined, "\r\n"), "\n", "03.26");
  equal(resolveEolSetting("a\nb", undefined, "\r"), "\n", "03.27");
  equal(resolveEolSetting("a\nb", undefined, "\n"), "\n", "03.28");

  equal(resolveEolSetting("a\nb", null), "\n", "03.29");
  equal(resolveEolSetting("a\nb", null, "\r\n"), "\n", "03.30");
  equal(resolveEolSetting("a\nb", null, "\r"), "\n", "03.31");
  equal(resolveEolSetting("a\nb", null, "\n"), "\n", "03.32");

  // ██ 3. truthy 2nd arg settings - no matter what, opts (2nd arg) prevail
  equal(resolveEolSetting("a", "crlf", "\r\n"), "\r\n", "03.33");
  equal(resolveEolSetting("a", "cr", "\r\n"), "\r", "03.34");
  equal(resolveEolSetting("a", "lf", "\r\n"), "\n", "03.35");

  equal(resolveEolSetting("a", "crlf", "\r"), "\r\n", "03.36");
  equal(resolveEolSetting("a", "cr", "\r"), "\r", "03.37");
  equal(resolveEolSetting("a", "lf", "\r"), "\n", "03.38");

  equal(resolveEolSetting("a", "crlf", "\n"), "\r\n", "03.39");
  equal(resolveEolSetting("a", "cr", "\n"), "\r", "03.40");
  equal(resolveEolSetting("a", "lf", "\n"), "\n", "03.41");

  // ---

  equal(resolveEolSetting("a\r\nb", "crlf", "\r\n"), "\r\n", "03.42");
  equal(resolveEolSetting("a\rb", "crlf", "\r\n"), "\r\n", "03.43");
  equal(resolveEolSetting("a\nb", "crlf", "\r\n"), "\r\n", "03.44");

  equal(resolveEolSetting("a\r\nb", "cr", "\r\n"), "\r", "03.45");
  equal(resolveEolSetting("a\rb", "cr", "\r\n"), "\r", "03.46");
  equal(resolveEolSetting("a\nb", "cr", "\r\n"), "\r", "03.47");

  equal(resolveEolSetting("a\r\nb", "lf", "\r\n"), "\n", "03.48");
  equal(resolveEolSetting("a\rb", "lf", "\r\n"), "\n", "03.49");
  equal(resolveEolSetting("a\nb", "lf", "\r\n"), "\n", "03.50");

  // ---

  equal(resolveEolSetting("a\r\nb", "crlf", "\r"), "\r\n", "03.51");
  equal(resolveEolSetting("a\rb", "crlf", "\r"), "\r\n", "03.52");
  equal(resolveEolSetting("a\nb", "crlf", "\r"), "\r\n", "03.53");

  equal(resolveEolSetting("a\r\nb", "cr", "\r"), "\r", "03.54");
  equal(resolveEolSetting("a\rb", "cr", "\r"), "\r", "03.55");
  equal(resolveEolSetting("a\nb", "cr", "\r"), "\r", "03.56");

  equal(resolveEolSetting("a\r\nb", "lf", "\r"), "\n", "03.57");
  equal(resolveEolSetting("a\rb", "lf", "\r"), "\n", "03.58");
  equal(resolveEolSetting("a\nb", "lf", "\r"), "\n", "03.59");

  // ---

  equal(resolveEolSetting("a\r\nb", "crlf", "\n"), "\r\n", "03.60");
  equal(resolveEolSetting("a\rb", "crlf", "\n"), "\r\n", "03.61");
  equal(resolveEolSetting("a\nb", "crlf", "\n"), "\r\n", "03.62");

  equal(resolveEolSetting("a\r\nb", "cr", "\n"), "\r", "03.63");
  equal(resolveEolSetting("a\rb", "cr", "\n"), "\r", "03.64");
  equal(resolveEolSetting("a\nb", "cr", "\n"), "\r", "03.65");

  equal(resolveEolSetting("a\r\nb", "lf", "\n"), "\n", "03.66");
  equal(resolveEolSetting("a\rb", "lf", "\n"), "\n", "03.67");
  equal(resolveEolSetting("a\nb", "lf", "\n"), "\n", "03.68");
});

test.run();
