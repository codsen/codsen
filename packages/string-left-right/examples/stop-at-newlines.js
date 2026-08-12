// Treat a newline as a stopping point in either direction

import { strict as assert } from "node:assert";

import {
  left,
  leftStopAtNewLines,
  right,
  rightStopAtNewLines,
} from "../dist/string-left-right.esm.js";

const source = "abc\n  def";

assert.equal(right(source, 2), 6);
assert.equal(rightStopAtNewLines(source, 2), 3);
assert.equal(left(source, 6), 2);
assert.equal(leftStopAtNewLines(source, 6), 3);
