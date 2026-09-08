// Normalize list markers while keeping the separator between the lists.

import { strict as assert } from "node:assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

assert.equal(
  cleanChangelogs("* First change\n\n* * *\n\n* Second change\n").res,
  "- First change\n\n* * *\n\n- Second change\n",
);
