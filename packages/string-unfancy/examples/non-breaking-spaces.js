// Convert non-breaking spaces

import { strict as assert } from "node:assert";

import { unfancy } from "../dist/string-unfancy.esm.js";

assert.equal(unfancy("left&nbsp;&ndash;&nbsp;right"), "left - right");
