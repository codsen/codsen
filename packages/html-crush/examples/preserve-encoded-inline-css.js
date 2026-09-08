// Preserve encoded inline CSS

import { strict as assert } from "node:assert";
import { crush } from "../dist/html-crush.esm.js";

const html = '<b style="content:&quot;a  b&quot;;font-family:&#92;31  a">x</b>';
const result = crush(html);
assert.equal(result.result, html);
assert.equal(result.applicableOpts.removeCSSComments, false);
