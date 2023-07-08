// Quick Take

import { strict as assert } from "assert";

import { bSlug } from "../dist/bitbucket-slug.esm.js";

assert.equal(
  bSlug("# Let's backwards-engineer BitBucket anchor link slug algorithm"),
  "markdown-header-lets-backwards-engineer-bitbucket-anchor-link-slug-algorithm",
);
