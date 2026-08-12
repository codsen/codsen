// Remove a duplicate outer layer with the default markers

import { strict as assert } from "node:assert";

import { remDup } from "../dist/string-remove-duplicate-heads-tails.esm.js";

assert.equal(remDup("{{ {{ customer }} }}"), "{{ customer }}");
