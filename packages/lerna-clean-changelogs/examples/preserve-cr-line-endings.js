// Clean CR-only documents while retaining their line-ending style.

import { strict as assert } from "node:assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

assert.equal(
  cleanChangelogs("# Changelog\r\r* Fixed a bug\r").res,
  "# Changelog\r\r- Fixed a bug\r",
);
