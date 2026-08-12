// Leave table-like markup inside an HTML comment untouched

import { strict as assert } from "node:assert";

import { patcher } from "../dist/html-table-patcher.esm.js";

const source = "<!-- <table>Message<tr><td>A</td></tr></table> -->";

assert.equal(patcher(source).result, source);
