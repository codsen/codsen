// Quick Take

import { strict as assert } from "node:assert";

import { extract } from "../dist/string-extract-class-names.esm.js";

// Pass an isolated CSS selector fragment.
const str = "div#brambles.nushes#croodles";
const { res } = extract(str);
assert.deepEqual(res, ["#brambles", ".nushes", "#croodles"]);
