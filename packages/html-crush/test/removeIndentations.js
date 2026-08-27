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

test("04 - whitespace-only inputs follow the whitespace options", () => {
  for (const lineEnding of ["", "\n", "\r\n", "\r"]) {
    const source = `   ${lineEnding}`;
    for (const [opts, expectedResult, expectedRanges] of [
      [{ removeIndentations: true, removeLineBreaks: false }, lineEnding, [[0, 3]]],
      [{ removeIndentations: false, removeLineBreaks: true }, lineEnding, [[0, 3]]],
      [{ removeIndentations: false, removeLineBreaks: false }, source, null],
    ]) {
      const { result, ranges } = m(equal, source, opts);
      equal(result, expectedResult, "04.01");
      equal(ranges, expectedRanges, "04.02");
    }
  }
});

test("05 - terminal line endings use one consistent EOF policy", () => {
  for (const lineEnding of ["\n", "\r\n", "\r"]) {
    const spacedSource = `a   ${lineEnding}`;
    const spaced = m(equal, spacedSource);
    equal(spaced.result, `a${lineEnding}`, "05.01");
    equal(spaced.ranges, [[1, 4]], "05.02");

    const repeatedSource = `a${lineEnding}${lineEnding}`;
    const repeated = m(equal, repeatedSource);
    equal(repeated.result, `a${lineEnding}`, "05.03");
    equal(repeated.ranges, [[1, 1 + lineEnding.length]], "05.04");
  }
});

test.run();
