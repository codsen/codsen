/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import detectIsItHTMLOrXhtml from "../dist/detect-is-it-html-or-xhtml.esm.js";

assert.equal(
  detectIsItHTMLOrXhtml(
    `<img src="some.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/>`
  ),
  "xhtml"
);
