import { strict as assert } from "node:assert";

import { within } from "../dist/email-all-chars-within-ascii.esm.js";

assert.deepEqual(within("name\tvalue\r\nnext line"), []);
