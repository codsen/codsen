// Encode using stable named aliases
import assert from "node:assert/strict";
import { encode } from "../dist/html-entity-codec.esm.js";

assert.equal(encode("≈ 𝌆", { useNamedReferences: true }), "&ap; &#x1D306;");
