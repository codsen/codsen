import { test } from "uvu";
import { equal } from "uvu/assert";

import { formatDiagnosticValue } from "../dist/codsen-utils.esm.js";

test("01 - retains the diagnostic formatter compatibility export", () => {
  equal(
    formatDiagnosticValue({ input: Symbol("marker") }),
    '{"input":Symbol("marker")}',
    "01.01",
  );
});

test.run();
