/* eslint import/extensions:0, no-unused-vars:0 */

// Quick Take

import { strict as assert } from "assert";
import {
  getKeysetSync,
  getKeyset,
  enforceKeyset,
  enforceKeysetSync,
  sortAllObjectsSync,
  noNewKeysSync,
  findUnusedSync,
} from "../dist/json-comb-core.esm";

const schema = {
  a: false,
  b: false,
  c: {
    d: false,
    e: false,
    f: false,
  },
};

assert.deepEqual(
  enforceKeysetSync(
    {
      c: { d: "x" },
    },
    schema
  ),
  {
    a: false,
    b: false,
    c: {
      d: "x",
      e: false,
      f: false,
    },
  }
);
