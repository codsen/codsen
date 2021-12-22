// `entStartsWithCaseInsensitive`

import { strict as assert } from "assert";

import { entStartsWithCaseInsensitive } from "../dist/all-named-html-entities.esm.js";

// case-insensitive "entStartsWithCaseInsensitive" is useful
// when looking for possibly mis-typed entities; emlint uses it

// which entities, lowercased, start with "j"?
assert.deepEqual(entStartsWithCaseInsensitive.j, {
  c: ["jcirc", "jcy"],
  f: ["jfr"],
  m: ["jmath"],
  o: ["jopf"],
  s: ["jscr", "jsercy"],
  u: ["jukcy"],
});
