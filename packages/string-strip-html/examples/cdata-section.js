// Strip an entire CDATA section

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(
  stripHtml("before<![CDATA[ hidden <tag> ]]>after").result,
  "before after",
);
