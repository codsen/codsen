// Fill missing keys in every existing array item

import { strict as assert } from "node:assert";

import { fillMissing } from "../dist/object-fill-missing-keys.esm.js";

assert.deepEqual(
  fillMissing(
    { people: [{ name: "Ada" }, { role: "editor" }] },
    { people: [{ name: "", role: "" }] },
  ),
  {
    people: [
      { name: "Ada", role: "" },
      { name: "", role: "editor" },
    ],
  },
);
