// Return null when the source contains no decisive markup

import { strict as assert } from "node:assert";

import { detectIsItHTMLOrXhtml } from "../dist/detect-is-it-html-or-xhtml.esm.js";

assert.equal(detectIsItHTMLOrXhtml("A plain text message"), null);
