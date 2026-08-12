// Detect XHTML from its doctype

import { strict as assert } from "node:assert";

import { detectIsItHTMLOrXhtml } from "../dist/detect-is-it-html-or-xhtml.esm.js";

assert.equal(
  detectIsItHTMLOrXhtml(
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN">',
  ),
  "xhtml",
);
