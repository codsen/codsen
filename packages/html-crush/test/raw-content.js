// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { m } from "./util/util.js";

test("01 - protects script contents across HTML name casing", () => {
  const inputs = [
    '<script>const x = "a   b";\n  run();</script>',
    '<SCRIPT>const x = "a   b";\n  run();</SCRIPT>',
    '<ScRiPt>const x = "a   b";\n  run();</sCrIpT>',
  ];

  for (const [index, input] of inputs.entries()) {
    equal(
      m(equal, input, { removeLineBreaks: true }).result,
      input,
      `01.${String(index + 1).padStart(2, "0")}`,
    );
  }
});

test("02 - protects pre, code, and textarea contents across casing", () => {
  const inputs = [
    "<PRE>  a\n   b  </pre>",
    "<CoDe>  a\n   b  </cOdE>",
    "<TEXTAREA>  a\n   b  </textarea>",
  ];

  for (const [index, input] of inputs.entries()) {
    equal(
      m(equal, input, { removeLineBreaks: true }).result,
      input,
      `02.${String(index + 1).padStart(2, "0")}`,
    );
  }
});

test("03 - does not classify prefix-sharing custom tags as built-ins", () => {
  const inputs = [
    "<script-widget>a   b</script-widget>",
    "<style-widget>a   b</style-widget>",
    "<pre2>a   b</pre2>",
    "<textarea-widget>a   b</textarea-widget>",
  ];

  for (const [index, input] of inputs.entries()) {
    equal(
      m(equal, input, { removeLineBreaks: false }).result,
      input.replace("a   b", "a b"),
      `03.${String(index + 1).padStart(2, "0")}`,
    );
  }
});

test("04 - protects unclosed raw and preformatted contents", () => {
  const inputs = [
    '<SCRIPT>const x = "a   b";',
    "<PRE>  a\n   b",
    "<CODE>  a\n   b",
    "<TEXTAREA>  a\n   b",
  ];

  for (const [index, input] of inputs.entries()) {
    equal(
      m(equal, input, { removeLineBreaks: true }).result,
      input,
      `04.${String(index + 1).padStart(2, "0")}`,
    );
  }
});

test("05 - preserves nested preformatted markup", () => {
  const input = "<PRE> a <CODE>  b\n c </CODE> d </PRE>";

  equal(
    m(equal, input, { removeLineBreaks: true }).result,
    input,
    "05.01",
  );
});

test.run();
