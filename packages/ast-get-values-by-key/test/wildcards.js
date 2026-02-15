// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

test("01 - get with wildcards", () => {
  let source = {
    popsicles: 1,
    tentacles: 0,
    nested: [
      {
        cutticles: "yes",
      },
    ],
  };

  equal(
    getByKey(source, "*cles"),
    [
      {
        val: 1,
        path: "popsicles",
      },
      {
        val: 0,
        path: "tentacles",
      },
      {
        val: "yes",
        path: "nested.0.cutticles",
      },
    ],
    "01.01",
  );

  equal(
    getByKey(source, ["*cles"]),
    [
      {
        val: 1,
        path: "popsicles",
      },
      {
        val: 0,
        path: "tentacles",
      },
      {
        val: "yes",
        path: "nested.0.cutticles",
      },
    ],
    "01.02",
  );
});

test.run();
