// avanotonly

import test from "ava";
import { Linter, version as version1 } from "../dist/emlint.esm";
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

test("config is truthy and is not an object", t => {
  const linter = new Linter();
  const error1 = t.throws(() => {
    linter.verify("a", true);
  });
  t.regex(error1.message, /THROW_ID_01/);
});

test("config is an empty object", t => {
  const linter = new Linter();
  t.deepEqual(linter.verify("a", {}), []);
});

test("config is falsey", t => {
  const linter = new Linter();
  t.deepEqual(linter.verify("a", null), []);
  t.deepEqual(linter.verify("a", false), []);
  t.deepEqual(linter.verify("a", undefined), []);
  t.deepEqual(linter.verify("a", 0), []);
  t.deepEqual(linter.verify("a", []), []);
});

test(`config is an object with key without "rules" key`, t => {
  const linter = new Linter();
  const error1 = t.throws(() => {
    linter.verify("a", { a: "z" });
  });
  t.regex(error1.message, /THROW_ID_02/);
});
