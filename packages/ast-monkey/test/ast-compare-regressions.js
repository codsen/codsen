import { test } from "uvu";
import { equal } from "uvu/assert";

import { del } from "../dist/ast-monkey.esm.js";

test("01 - wildcard keys cannot reuse targets or ignore values", () => {
  const input = {
    wrapper: { alpha: "x", beta: "y" },
    keep: 1,
  };
  equal(
    del(input, {
      key: "wrapper",
      val: { "a*": "ignored", "al*": "ignored" },
    }),
    input,
    "01.01",
  );
});

test.run();
