// Fix SourceHut commit links

import { strict as assert } from "node:assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const source = "- Fixed in https://git.sr.ht/~user/project/commits/abc123";

assert.equal(
  cleanChangelogs(source).res,
  "- Fixed in https://git.sr.ht/~user/project/commit/abc123",
);
