// Normalise common typographic characters

import { strict as assert } from "node:assert";

import { unfancy } from "../dist/string-unfancy.esm.js";

assert.equal(unfancy("Wait… 3 × 4 — done"), "Wait... 3 × 4 - done");
