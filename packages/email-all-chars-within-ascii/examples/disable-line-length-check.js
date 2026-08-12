import { strict as assert } from "node:assert";

import { within } from "../dist/email-all-chars-within-ascii.esm.js";

assert.deepEqual(within("a".repeat(1_000), { lineLength: 0 }), []);
