// Iterate the original string when there are no ranges

import { strict as assert } from "node:assert";

import { rIterate } from "../dist/ranges-iterate.esm.js";

const characters = [];
rIterate("abc", [], ({ val }) => characters.push(val));

assert.equal(characters.join(""), "abc");
