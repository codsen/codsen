/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import { stri } from "../dist/stristri.esm.js";

// strips both HTML and Nunjucks, leaves text only:
assert.equal(
  stri(
    `<html><div>The price is{% if data.price > 100 %} high{% endif %}</div>`,
    {
      html: true,
      css: true,
      text: false,
      templatingTags: true,
    }
  ).result,
  "The price is high"
);
