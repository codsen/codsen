import tap from "tap";
import { mixer } from "../dist/test-mixer.esm.js";

tap.test("01", (t) => {
  t.throws(() => {
    mixer("z");
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("02", (t) => {
  t.throws(() => {
    mixer(
      {
        foo: true,
      },
      "z"
    );
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("03", (t) => {
  t.throws(() => {
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
  t.end();
});

tap.test("04", (t) => {
  t.strictSame(mixer({}, {}), [], "04");
  t.end();
});
