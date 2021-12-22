/* eslint-disable no-unused-vars */
// The Callback Use

import { strict as assert } from "assert";

import {
  matchLeftIncl,
  matchRightIncl,
  matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm.js";

// imagine you looped the string and wanted to catch where does attribute "class" start
// and end (not to mention to ensure that it's a real attribute, not something ending with this
// string "class").
// You catch "=", an index number 8.
// This library can check, is "class" to the left of it and feed what's to the left of it
// to your supplied callback function, which happens to be a checker "is it a space":
function isSpace(char) {
  return typeof char === "string" && char.trim() === "";
}

assert.equal(
  matchLeft('<a class="something">', 8, "class", { cb: isSpace }),
  "class"
);
