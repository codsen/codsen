import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require2 = createRequire(import.meta.url);

const { test } = require2("uvu");
/* eslint-disable @typescript-eslint/no-unused-vars */
const { equal, is, ok, throws, type, not, match } = require2("uvu/assert");
// the CJS imported file can't be ".cjs.js", so we rename temporarily:
fs.renameSync(
  path.resolve("dist/remark-typography.cjs.js"),
  path.resolve("dist/remark-typography.cjs"),
);
const api = require2("../dist/remark-typography.cjs");

test.after(() => {
  fs.renameSync(
    path.resolve("dist/remark-typography.cjs"),
    path.resolve("dist/remark-typography.cjs.js"),
  );
});

// -----------------------------------------------------------------------------

test("01 - a function is exported", () => {
  equal(typeof api, "function", "01.01");
});

test.run();
