// Recognise Jinja and Nunjucks delimiter styles

import { strict as assert } from "node:assert";

import { isJinjaNunjucksRegex } from "../dist/regex-is-jinja-nunjucks.esm.js";

assert.equal(isJinjaNunjucksRegex().test("{{ user.name }}"), true);
assert.equal(isJinjaNunjucksRegex().test("{% if ready %}"), true);

// This package specifically detects output and statement delimiters.
assert.equal(isJinjaNunjucksRegex().test("{# a template comment #}"), false);
