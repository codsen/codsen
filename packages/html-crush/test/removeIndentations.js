import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { m } from "./util/util.js";

// opts.removeIndentations
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"opts.removeIndentations"}\u001b[${39}m`} - collapses whitespace on removeIndentations`, () => {
  equal(
    m(equal, "a   b\nc    d", {
      removeLineBreaks: false,
      removeIndentations: true,
    }).result,
    "a b\nc d",
    "01.01",
  );
});

test(`02 - ${`\u001b[${33}m${"opts.removeIndentations"}\u001b[${39}m`} - trailing whitespace on removeIndentations`, () => {
  equal(
    m(equal, "a   \nb    ", {
      removeLineBreaks: false,
      removeIndentations: true,
    }).result,
    "a\nb",
    "02.01",
  );
});

test(`03 - ${`\u001b[${33}m${"opts.removeIndentations"}\u001b[${39}m`} - leading whitespace`, () => {
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
