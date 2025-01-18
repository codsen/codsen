import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { comb } from "./util/util.js";

// false positives
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"false positives"}\u001b[${39}m`} - word class in text`, () => {
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

test(`02 - ${`\u001b[${33}m${"false positives"}\u001b[${39}m`} - word id in text`, () => {
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
