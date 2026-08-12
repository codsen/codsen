// Insert spaces when removing tags between adjacent text

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(stripHtml("aaa<div>bbb</div>ccc").result, "aaa bbb ccc");
