/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import removeDuplicateHeadsTails from "../dist/string-remove-duplicate-heads-tails.esm.js";

assert.equal(
  removeDuplicateHeadsTails("{{ Hi {{ first_name }}! }}", {
    heads: "{{ ",
    tails: " }}",
  }),
  "Hi {{ first_name }}!"
);
