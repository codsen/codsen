// Keep the full version and date while removing its complete Markdown link.

import { strict as assert } from "node:assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

assert.equal(
  cleanChangelogs(
    "## [2.0.0-rc.1+build.007](https://example.com/(old)/(new)) (2026-09-08)",
    { extras: true },
  ).res,
  "## 2.0.0-rc.1+build.007 (2026-09-08)",
);
