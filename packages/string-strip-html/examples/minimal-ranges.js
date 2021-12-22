// Minimal example using Ranges

// We strip tags and fix apostrophes
// that's part of what https://codsen.com/os/detergent/ does

import { strict as assert } from "assert";

import { rApply } from "../../ranges-apply/dist/ranges-apply.esm.js";
import { stripHtml } from "../dist/string-strip-html.esm.js";
import { convertAll } from "../../string-apostrophes/dist/string-apostrophes.esm.js";

function stripAndFixApos(str) {
  if (!str || typeof str !== "string") {
    return "";
  }
  // Keep in mind, Ranges are array of 2-3 element arrays.
  // But absent Ranges are marked as null, not empty array.
  // It's so that we could test in "if-else" easily - null
  // is falsy but empty array is truthy.
  // That's why below we take precautions with "|| []".
  return rApply(
    str,
    (stripHtml(str).ranges || []).concat(convertAll(str).ranges || [])
  );
}

// strips tags and fixes apostrophes:
assert.equal(
  stripAndFixApos(`Let's Go <strong>Larval</strong>`),
  `Let’s Go Larval`
);

// no tags, no apostrophes:
assert.equal(stripAndFixApos(`zzz`), `zzz`);
