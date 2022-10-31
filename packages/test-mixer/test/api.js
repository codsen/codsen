import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { mixer } from "../dist/test-mixer.esm.js";

test("01", () => {
  throws(() => {
    mixer("z");
  }, /THROW_ID_01/g);
});

test("02", () => {
  throws(() => {
    mixer(
      {
        foo: true,
      },
      "z"
    );
  }, /THROW_ID_02/g);
});

test("03", () => {
  throws(() => {
    mixer(
      {
        foo: true,
      },
      {
        bar: true,
        baz: "zz",
      }
    );
  }, /THROW_ID_03/g);
});

test("04", () => {
  equal(mixer({}, {}), [], "04.01");
});

test.run();
