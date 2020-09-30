/* eslint import/extensions:0, no-unused-vars:0 */

// Nothing was found

import { strict as assert } from "assert";
import raReg from "../dist/ranges-regex.esm.js";

assert.equal(raReg(/abc/g, "xyz"), null);
// Falsy null means no ranges, other Ranges ecosystem
// packages will accept null as input value
// For the record, an empty array is truthy
