// Detect HTML from its doctype

import { strict as assert } from "node:assert";

import { detectIsItHTMLOrXhtml } from "../dist/detect-is-it-html-or-xhtml.esm.js";

assert.equal(detectIsItHTMLOrXhtml("<!doctype html><html></html>"), "html");
