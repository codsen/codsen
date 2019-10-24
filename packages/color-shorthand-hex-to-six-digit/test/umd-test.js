// avanotonly

import test from "ava";
import c1 from "../dist/color-shorthand-hex-to-six-digit.umd";
import c2 from "../dist/color-shorthand-hex-to-six-digit.cjs";

const input = "aaaa #ccc zzzz\n\t\t\t#000.";
const result = "aaaa #cccccc zzzz\n\t\t\t#000000.";

test("UMD build works fine", t => {
  t.deepEqual(c1(input), result);
});

test("CJS build works fine", t => {
  t.deepEqual(c2(input), result);
});
