// Iterate text inserted at the end of a string

import { strict as assert } from "node:assert";

import { rIterate } from "../dist/ranges-iterate.esm.js";

const characters = [];
rIterate("abc", [[3, 3, "!"]], ({ val }) => characters.push(val));

assert.equal(characters.join(""), "abc!");
