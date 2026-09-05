// Match a contiguous omission
import assert from "node:assert/strict";
import { matchTypos } from "../dist/string-typo-match.esm.js";

const result = matchTypos("Lenstein", ["Levenstein", "Einstein"]);
assert.equal(result.bestMatch, "Levenstein");
assert.equal(result.matches[0].operations[0].kind, "omitted-block");
