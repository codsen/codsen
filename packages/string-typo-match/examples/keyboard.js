// Supply directional keyboard neighbours
import assert from "node:assert/strict";
import { matchTypos } from "../dist/string-typo-match.esm.js";

const result = matchTypos("pwned", ["owned", "awned", "paned", "pined"], {
  keyboard: { o: ["p"], a: ["w"] },
});
assert.equal(result.status, "ambiguous");
assert.equal(result.matches[0].cost, 75);
assert.equal(result.matches[1].cost, 75);
