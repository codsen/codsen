// Remove URLs and stop words from search-index text

import { strict as assert } from "node:assert";

import { extract } from "../dist/extract-search-index.esm.js";

assert.equal(
  extract("Read docs at https://example.com/guide and save the docs"),
  "read docs save",
);

assert.equal(
  extract("[Guide](https://example.technology/topic_(details))next steps"),
  "guide next steps",
);

assert.equal(
  extract(
    "before https://[::1]:8080/help https://例子.测试/路径?tags[]=one after",
  ),
  "before after",
);

assert.equal(
  extract("before https://example.com/rock'n'roll after"),
  "before after",
);
