import { test } from "uvu";
import { equal } from "uvu/assert";

import { extract } from "../dist/extract-search-index.esm.js";

test("01 - repeated mixed typography retains stable keyword order", () => {
  equal(
    extract("“Alpha”…‘beta’\u00A0—− Gamma… ".repeat(1_000)),
    "alpha beta gamma",
    "01.01",
  );
});

test("02 - repeated encoded typography deduplicates its decoded words", () => {
  equal(
    extract(
      "&amp;ldquo;Alpha&amp;rdquo;&amp;hellip;&amp;nbsp;&amp;ndash; beta ".repeat(
        500,
      ),
    ),
    "alpha beta",
    "02.01",
  );
});

test("03 - repeated calls keep independent keyword results", () => {
  for (let i = 0; i < 20; i += 1) {
    equal(extract("…“Alpha” Alpha"), "alpha", `03.01 - call ${i + 1}`);
    equal(extract("ordinary ASCII"), "ordinary ascii", `03.02 - call ${i + 1}`);
    equal(extract(""), "", `03.03 - call ${i + 1}`);
    equal(extract("‘beta’… Gamma"), "beta gamma", `03.04 - call ${i + 1}`);
  }
});

test.run();
