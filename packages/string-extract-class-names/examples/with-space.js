/* eslint import/extensions:0 */

// Processes whole CSS selectors

import { strict as assert } from "assert";
import extract from "../dist/string-extract-class-names.esm.js";

assert.deepEqual(extract("div.first.second#third a[target=_blank]"), [
  ".first",
  ".second",
  "#third",
]);
