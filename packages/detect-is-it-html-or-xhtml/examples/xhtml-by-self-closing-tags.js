// Infer XHTML when most single tags are self-closing

import { strict as assert } from "node:assert";

import { detectIsItHTMLOrXhtml } from "../dist/detect-is-it-html-or-xhtml.esm.js";

assert.equal(detectIsItHTMLOrXhtml("<br/><hr /><img src=x>"), "xhtml");
