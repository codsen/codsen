// Quick Take

import { strict as assert } from "node:assert";

import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

const source = "&nsp;x&nsp;y&nsp;";

// returns Ranges notation, see codsen.com/ranges/
assert.deepEqual(fixEnt(source), [
  [0, 5, "&nbsp;"],
  [6, 11, "&nbsp;"],
  [12, 17, "&nbsp;"],
]);
