/* eslint import/extensions:0, no-unused-vars:0 */

// Quick Take

import { strict as assert } from "assert";
import { det, opts, version } from "../dist/detergent.esm.js";

// on default setting, widow removal and encoding are enabled:
assert.equal(det("clean this text £").res, "clean this text&nbsp;&pound;");
