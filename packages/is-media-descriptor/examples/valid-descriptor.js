// A valid media descriptor

import { strict as assert } from "node:assert";

import { isMediaD } from "../dist/is-media-descriptor.esm.js";

assert.deepEqual(isMediaD("screen and (min-width: 600px)"), []);
