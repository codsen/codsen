/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import mixer from "../dist/test-mixer.esm.js";

// generates 2^n combinations
assert.deepEqual(
  mixer(
    {
      foo: true, // override
      baz: 1, // not a boolean
    },
    {
      // defaults or reference object:
      foo: true,
      bar: false,
      baz: 0, // default is not a boolean either
    }
  ),
  [
    {
      foo: true, // static, as per 1st arg
      bar: false, // combination #1
      baz: 1, // non-bools get copied over
    },
    {
      foo: true, // static, as per 1st arg
      bar: true, // combination #2
      baz: 1, // non-bools get copied over
    },
  ]
);
