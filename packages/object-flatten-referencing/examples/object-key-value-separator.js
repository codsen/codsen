// Set the separator used by flattenObject

import { strict as assert } from "node:assert";

import { flattenObject } from "../dist/object-flatten-referencing.esm.js";

assert.deepEqual(
  flattenObject(
    { name: "Ada", roles: ["author", "editor"] },
    { objectKeyAndValueJoinChar: ":" },
  ),
  ["name:Ada", "roles:author", "roles:editor"],
);
