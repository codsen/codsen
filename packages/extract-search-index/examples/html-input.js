// Strip HTML tags and decode entities

import { strict as assert } from "node:assert";

import { extract } from "../dist/extract-search-index.esm.js";

assert.equal(extract("<tralala><div>some&nbsp;text</div>"), "some text");
