/* eslint import/extensions:0 */

// Minimal example, `set()`

import { strict as assert } from "assert";
import { set } from "../dist/edit-package-json.esm";

// edit JSON as string
assert.equal(
  set(
    `{
  "a": "b",
  "c": {
    "d": "e"
  }
}`,
    "c.d", // path
    "x" // value to put
  ),
  `{
  "a": "b",
  "c": {
    "d": "x"
  }
}`
);
