// Treat a raw non-breaking space as a stopping point

import { strict as assert } from "node:assert";

import {
  left,
  leftStopAtRawNbsp,
  right,
  rightStopAtRawNbsp,
} from "../dist/string-left-right.esm.js";

const source = "abc\u00a0  def";

assert.equal(right(source, 2), 6);
assert.equal(rightStopAtRawNbsp(source, 2), 3);
assert.equal(left(source, 6), 2);
assert.equal(leftStopAtRawNbsp(source, 6), 3);
