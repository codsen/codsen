// Supports legacy bracket notation emails used to use

import { strict as assert } from "assert";
import { extract } from "../dist/string-extract-class-names.esm.js";

// Yahoo has changed many years ago so email template
// must be really arcane to contain this notation
// https://github.com/hteumeuleu/email-bugs/issues/49

assert.deepEqual(extract(`td[id=" abc-def "]`), {
  res: ["#abc-def"],
  ranges: [[8, 15]],
});

// notice the hash # is not covered by range indexes!
