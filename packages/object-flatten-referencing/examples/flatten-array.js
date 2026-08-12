// Flatten an array with line breaks between rows

import { strict as assert } from "node:assert";

import { flattenArr } from "../dist/object-flatten-referencing.esm.js";

assert.equal(flattenArr(["one", "two"], {}, false, true), "one<br />two");
