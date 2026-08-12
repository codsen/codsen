// Insert line breaks before selected tokens

import { strict as assert } from "node:assert";

import { crush } from "../dist/html-crush.esm.js";

assert.equal(
  crush("<m><n><o>", {
    removeLineBreaks: true,
    breakToTheLeftOf: ["<n", "<o"],
  }).result,
  "<m>\n<n>\n<o>",
);
