// Encode without a named-reference table in bundled output
import assert from "node:assert/strict";
import { encodeNumeric } from "../dist/html-entity-codec.esm.js";

assert.equal(encodeNumeric("© 𝌆"), "&#xA9; &#x1D306;");
