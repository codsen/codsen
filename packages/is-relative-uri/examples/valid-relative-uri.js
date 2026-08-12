// A valid relative URI

import { strict as assert } from "node:assert";

import { isRel } from "../dist/is-relative-uri.esm.js";

assert.deepEqual(isRel("../images/logo.svg"), { res: true, message: null });
