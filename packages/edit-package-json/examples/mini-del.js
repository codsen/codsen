/* eslint import/extensions:0 */

// Minimal example, `del()`

import { strict as assert } from "assert";
import { del } from "../dist/edit-package-json.esm";

// edit JSON as string
assert.equal(
  del(
    `{
  "a": "b",
  "c": "d"
}`,
    "c" // path to delete
  ),
  `{
  "a": "b"
}`
);
