/* eslint import/extensions:0, no-unused-vars:0 */

// Asynchronous `enforceKeyset()`

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

// Let's enforce the keyset using previously-calculated schema.

// Let's use an async IIFE to trigger the action and let us use await:
(async () => {
  // let's create three plain objects, each somewhat overlapping with others:
  const obj1 = {
    b: [
      {
        c: "ccc",
        d: "ddd",
      },
    ],
    a: "aaa",
  };
  const obj2 = {
    a: "ccc",
    e: "eee",
  };
  const obj3 = {
    a: "zzz",
  };
  // calculate the schema:
  const schema = await getKeyset([obj1, obj2, obj3]);

  assert.deepEqual(schema, {
    a: false,
    b: [
      {
        c: false,
        d: false,
      },
    ],
    e: false,
  });

  assert.deepEqual(await enforceKeyset(obj1, schema), {
    a: "aaa",
    b: [
      {
        c: "ccc",
        d: "ddd",
      },
    ],
    e: false, // <------ new key added
  });

  assert.deepEqual(await enforceKeyset(obj2, schema), {
    a: "ccc",
    b: [
      // <------- new key added
      {
        c: false,
        d: false,
      },
    ],
    e: "eee",
  });

  assert.deepEqual(await enforceKeyset(obj3, schema), {
    a: "zzz",
    b: [
      // <------- new key added
      {
        c: false,
        d: false,
      },
    ],
    e: false, // <------- new key added
  });
})();
