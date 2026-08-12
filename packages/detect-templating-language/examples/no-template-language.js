// Report when no supported template language is present

import { strict as assert } from "node:assert";

import { detectLang } from "../dist/detect-templating-language.esm.js";

assert.deepEqual(detectLang("<p>Static HTML</p>"), { name: null });
