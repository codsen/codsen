import test from "ava";
import { version as version1 } from "../dist/emlint.esm";
import { version as version2 } from "../dist/emlint.cjs";
import { version as version3 } from "../dist/emlint.umd";

test("shows version from ESM build", t => {
  t.regex(version1, /\d+\.\d+\.\d+/g);
});

test("shows version from CJS build", t => {
  t.regex(version2, /\d+\.\d+\.\d+/g);
});

test("shows version from UMD build", t => {
  t.regex(version3, /\d+\.\d+\.\d+/g);
});
