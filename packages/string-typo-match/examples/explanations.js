// Interpret original UTF-16 spans
import assert from "node:assert/strict";
import { matchTypos } from "../dist/string-typo-match.esm.js";

const candidate = "a😀b";
const result = matchTypos("ab", [candidate], { minInputLength: 1 });
const operation = result.matches[0].operations[0];
assert.equal(
  candidate.slice(operation.candidateFrom, operation.candidateTo),
  "😀",
);
assert.equal(operation.inputFrom, operation.inputTo);
