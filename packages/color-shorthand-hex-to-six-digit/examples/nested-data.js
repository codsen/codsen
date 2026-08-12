// Nested arrays and objects

import { strict as assert } from "node:assert";

import { conv } from "../dist/color-shorthand-hex-to-six-digit.esm.js";

assert.deepEqual(conv(["#abc", { accent: "#f0c" }, 42]), [
  "#aabbcc",
  { accent: "#ff00cc" },
  42,
]);
