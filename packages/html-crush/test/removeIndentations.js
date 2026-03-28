// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { m } from "./util/util.js";

// opts.removeIndentations
// -----------------------------------------------------------------------------

test(`01 - opts.removeIndentations - collapses whitespace on removeIndentations`, () => {
  equal(
    m(equal, "a   b\nc    d", {
      removeLineBreaks: false,
      removeIndentations: true,
    }).result,
    "a b\nc d",
    "01.01",
  );
});

test(`02 - opts.removeIndentations - trailing whitespace on removeIndentations`, () => {
  equal(
    m(equal, "a   \nb    ", {
      removeLineBreaks: false,
      removeIndentations: true,
    }).result,
    "a\nb",
    "02.01",
  );
});

test(`03 - opts.removeIndentations - leading whitespace`, () => {
  equal(
    m(
      equal,
      `



<!DOCTYPE HTML>
<html>
<head>
`,
      {
        removeLineBreaks: false,
        removeIndentations: true,
      },
    ).result,
    `<!DOCTYPE HTML>
<html>
<head>
`,
    "03.01",
  );
});

test.run();
