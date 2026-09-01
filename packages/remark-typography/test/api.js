import api from "remark-typography";
import { test } from "uvu";
import { equal } from "uvu/assert";

// -----------------------------------------------------------------------------

test("01 - a function is exported", () => {
  equal(typeof api, "function", "01.01");
});

test.run();
