// Collapse replacement whitespace to one character

import { strict as assert } from "node:assert";

import { Ranges } from "../dist/ranges-push.esm.js";

const ranges = new Ranges({ limitToBeAddedWhitespace: true });
ranges.add(1, 2, "  \t  ");

assert.deepEqual(ranges.current(), [[1, 2, " "]]);
