// Prefer HTML when self-closing and open single tags are tied

import { strict as assert } from "node:assert";

import { detectIsItHTMLOrXhtml } from "../dist/detect-is-it-html-or-xhtml.esm.js";

assert.equal(detectIsItHTMLOrXhtml("<br/><hr>"), "html");
