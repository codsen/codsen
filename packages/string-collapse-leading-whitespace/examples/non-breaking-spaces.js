// Preserve non-breaking-space boundaries

import { strict as assert } from "node:assert";

import { collWhitespace } from "../dist/string-collapse-leading-whitespace.esm.js";

const nbsp = "\u00A0";

assert.equal(collWhitespace(`  ${nbsp}content`), `${nbsp}content`);
assert.equal(collWhitespace(`content${nbsp}  `), `content${nbsp}`);
