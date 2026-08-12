// Asynchronous `enforceKeyset()`

import { strict as assert } from "node:assert";

import { enforceKeyset, getKeyset } from "../dist/json-comb-core.esm.js";

// Let's enforce the keyset using previously-calculated schema.

// Let's use an async IIFE to trigger the action and let us use await:
(async () => {
  // let's create three plain objects, each somewhat overlapping with others:
  let obj1 = {
    b: [
      {
        c: "ccc",
        d: "ddd",
      },
    ],
    a: "aaa",
  };
  let obj2 = {
    a: "ccc",
    e: "eee",
  };
  let obj3 = {
    a: "zzz",
  };
  // calculate the schema:
  let schema = await getKeyset([obj1, obj2, obj3]);

  const enforced = await Promise.all(
    [obj1, obj2, obj3].map((object) => enforceKeyset(object, schema)),
  );

  assert.deepEqual(
    { schema, enforced },
    {
      schema: {
        a: false,
        b: [{ c: false, d: false }],
        e: false,
      },
      enforced: [
        { a: "aaa", b: [{ c: "ccc", d: "ddd" }], e: false },
        { a: "ccc", b: [{ c: false, d: false }], e: "eee" },
        { a: "zzz", b: [{ c: false, d: false }], e: false },
      ],
    },
  );
})();
