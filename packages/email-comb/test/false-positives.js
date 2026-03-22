// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { comb } from "./util/util.js";

// false positives
// -----------------------------------------------------------------------------

test(`01 - false positives - word class in text`, () => {
  let source = `<html>
  <head>
  </head>
  <body>
    <p>test class test </p>
  </body>
</html>
`;
  equal(comb(source).result, source, "01.01");
});

test(`02 - false positives - word id in text`, () => {
  let source = `<html>
  <head>
  </head>
  <body>
    <p>test id test </p>
  </body>
</html>
`;
  equal(comb(source).result, source, "02.01");
});

test.run();
