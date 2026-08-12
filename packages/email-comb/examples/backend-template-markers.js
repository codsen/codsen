import { strict as assert } from "node:assert";

import { comb } from "../dist/email-comb.esm.js";

const source = `<body class="{{ dynamic_class }} unused"></body>`;
const result = comb(source, {
  backend: [{ heads: "{{", tails: "}}" }],
}).result;

assert.equal(result.includes("{{ dynamic_class }}"), true);
assert.equal(result.includes("unused"), false);
