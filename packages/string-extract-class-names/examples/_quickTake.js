// Quick Take

import { strict as assert } from "node:assert";

import { extract } from "../dist/string-extract-class-names.esm.js";

// extracts classes and/or id's
const str = "div#brambles.nushes#croodles";
const { res } = extract(str);
assert.deepEqual(res, ["#brambles", ".nushes", "#croodles"]);
