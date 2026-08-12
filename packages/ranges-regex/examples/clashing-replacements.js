// Clashing replacement values

import { strict as assert } from "node:assert";
import { rApply } from "../../ranges-apply/dist/ranges-apply.esm.js";
import { Ranges } from "../../ranges-push/dist/ranges-push.esm.js";
import { rRegex } from "../dist/ranges-regex.esm.js";

const source = "sequence: 1234 5678 0000 1234";
const gatheredRanges = new Ranges();
gatheredRanges.push(rRegex(/\d/g, source, "*"));
gatheredRanges.push(rRegex(/\b[0]+\b/g, source, null));

assert.deepEqual(gatheredRanges.current(), [
  [10, 14, "****"],
  [15, 19, "****"],
  [20, 24, null],
  [25, 29, "****"],
]);

assert.equal(
  rApply(source, gatheredRanges.current()),
  "sequence: **** ****  ****",
);
