// avanotonly

import test from "ava";
import { lint as lint1, version as version1 } from "../dist/emlint.umd";
import { lint as lint2, version as version2 } from "../dist/emlint.cjs";

test("UMD build works fine", t => {
  t.deepEqual(lint1("a").issues, []);
  t.regex(version1, /\d+\.\d+\.\d+/);
});

test("CJS build works fine", t => {
  t.deepEqual(lint2("a").issues, []);
  t.regex(version2, /\d+\.\d+\.\d+/);
});
