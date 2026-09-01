// deps
import { strict as assert } from "node:assert";
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { deleteKey } from "../dist/object-delete-key.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  deleteKey(
    [
      {
        a: "a",
        b: "delete this key",
        c: ["b", "b", { b: "d" }],
      },
      {
        b: ["and this key too", "together with this"],
        d: {
          e: { f: { g: ["b", { b: "and this, no matter how deep-nested" }] } },
        },
      },
    ],
    {
      key: "b",
    },
  );

assert.deepEqual(testme(), [{ a: "a" }]);

// action
runPerf(testme, callerDir);
