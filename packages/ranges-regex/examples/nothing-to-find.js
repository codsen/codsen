// Nothing was found

import { strict as assert } from "assert";
import { rRegex } from "../dist/ranges-regex.esm.js";

assert.equal(rRegex(/abc/g, "xyz"), null);
// Falsy null means no ranges, other Ranges ecosystem
// packages will accept null as input value
// For the record, an empty array is truthy
