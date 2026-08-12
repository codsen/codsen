import { strict as assert } from "node:assert";

import { comb } from "../dist/email-comb.esm.js";

const source = "<body><!-- editorial note --><p>Hello</p></body>";

assert.equal(comb(source, { removeHTMLComments: false }).result, source);
