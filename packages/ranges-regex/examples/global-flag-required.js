// Require the global flag so every match can be collected safely

import { strict as assert } from "node:assert";

import { rRegex } from "../dist/ranges-regex.esm.js";

assert.throws(() => rRegex(/word/u, "word word"), /THROW_ID_05/u);
