// Apply the returned ranges to repair the source string

import { strict as assert } from "node:assert";
import { rApply } from "ranges-apply";

import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

const source = "&nsp;x&nsp;y&nsp;";

assert.equal(rApply(source, fixEnt(source)), "&nbsp;x&nbsp;y&nbsp;");
