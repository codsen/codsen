// Wrap the resolved values

import { strict as assert } from "node:assert";

import { jVar } from "../dist/json-variables.esm.js";

assert.deepEqual(
  jVar(
    { template: "Hello %%_name_%%", name: "Ada" },
    { wrapHeadsWith: "${", wrapTailsWith: "}" },
  ),
  // biome-ignore lint/suspicious/noTemplateCurlyInString: the configured output intentionally uses template syntax
  { template: "Hello ${Ada}", name: "Ada" },
);
