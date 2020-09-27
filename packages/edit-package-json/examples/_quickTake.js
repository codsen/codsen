/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import { set, del } from "../dist/edit-package-json.esm";

// edit JSON as string
assert.equal(
  set(
    `{
  "name": "test",
  "dependencies": {
    "ranges-apply": "^2.0.0",
    "string-left-right": "^2.3.30"
  },
  "devDependencies": {}
}`,
    "dependencies.ranges-apply", // path to amend
    "^3.2.2" // new value
  ),
  `{
  "name": "test",
  "dependencies": {
    "ranges-apply": "^3.2.2",
    "string-left-right": "^2.3.30"
  },
  "devDependencies": {}
}`
);

// edit from JSON string
assert.equal(
  del(
    `{
  "name": "test",
  "dependencies": {
    "ranges-apply": "^2.0.0",
    "string-left-right": "^2.3.30"
  },
  "devDependencies": {}
}`,
    "devDependencies" // path to delete
  ),
  `{
  "name": "test",
  "dependencies": {
    "ranges-apply": "^2.0.0",
    "string-left-right": "^2.3.30"
  }
}`
);
