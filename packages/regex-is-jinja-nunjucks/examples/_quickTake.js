// Quick Take

import { strict as assert } from "assert";
import { isJinjaNunjucksRegex } from "../dist/regex-is-jinja-nunjucks.esm.js";

// detects Jinja/Nunjucks code
assert.equal(
  isJinjaNunjucksRegex().test(
    `<div>{% if data.purchases.count > 1 %}these{% else %}this{% endif %}</div>`
  ),
  true
);

// in case if it's not nunjucks
assert.equal(isJinjaNunjucksRegex().test(`<div>tralala</div>`), false);
