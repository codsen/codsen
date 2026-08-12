// Treat a deeply nested array as non-empty

import { strict as assert } from "node:assert";

import { nonEmpty } from "../dist/util-nonempty.esm.js";

assert.equal(nonEmpty([[[[[[[[[[[]]]]]]]]]]]), true);
