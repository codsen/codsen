// Use true as the placeholder at paths that must remain unfilled

import { strict as assert } from "node:assert";

import { fillMissing } from "../dist/object-fill-missing-keys.esm.js";

assert.deepEqual(
  fillMissing(
    { section: { settings: true } },
    { section: { settings: { visible: false, featured: false } } },
    {
      placeholder: true,
      doNotFillThesePathsIfTheyContainPlaceholders: ["section.settings"],
    },
  ),
  { section: { settings: true } },
);
