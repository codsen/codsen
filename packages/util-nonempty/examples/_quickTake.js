

// Quick Take

import { strict as assert } from "assert";
import { nonEmpty } from "../dist/util-nonempty.esm.js";

assert.equal(nonEmpty("z"), true);
assert.equal(nonEmpty(""), false);
assert.equal(nonEmpty(["a"]), true);
assert.equal(nonEmpty([123]), true);
assert.equal(nonEmpty([[[[[[[[[[[]]]]]]]]]]]), true);
assert.equal(nonEmpty({ a: "" }), true);
assert.equal(nonEmpty({ a: "a" }), true);
assert.equal(nonEmpty({}), false);

const f = () => {
  return "z";
};
assert.equal(nonEmpty(f), false);
// (answer is instantly false if input is not array, plain object or string)
