// Exclude selected paths from array acceptance

import { strict as assert } from "node:assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

assert.throws(() => {
  checkTypesMini(
    { extensions: ["js", "ts"], aliases: ["src"] },
    { extensions: "js", aliases: "src" },
    {
      acceptArrays: true,
      acceptArraysIgnore: "extensions",
    },
  );
}, /opts\.extensions was customised/);
