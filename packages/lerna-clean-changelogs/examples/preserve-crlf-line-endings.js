import { strict as assert } from "node:assert";

import { cleanChangelogs } from "../dist/lerna-clean-changelogs.esm.js";

const result = cleanChangelogs("# Changelog\r\n\r\n* Fixed\r\n").res;

assert.equal(result, "# Changelog\r\n\r\n- Fixed\r\n");
