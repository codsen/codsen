// Return an empty ranges array when the value needs no trimming

import { strict as assert } from "node:assert";

import { trimSpaces } from "../dist/string-trim-spaces-only.esm.js";

assert.deepEqual(trimSpaces("value"), { res: "value", ranges: [] });
