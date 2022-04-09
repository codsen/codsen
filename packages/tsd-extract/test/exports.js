import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { extract } from "../dist/tsd-extract.esm.js";

test("01 export from, one line", () => {
  let source = `export { x } from "y";`;
  equal(
    extract(source, "export", { extractAll: false }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ x } from "y";',
      contentStartsAt: 7,
      contentEndsAt: 22,
      value: 'export { x } from "y";',
      valueStartsAt: 0,
      valueEndsAt: 22,
      all: [],
      error: null,
    },
    "01.01"
  );
  equal(
    extract(source, "export", { extractAll: true }),
    {
      identifiers: ["export"],
      identifiersStartAt: 0,
      identifiersEndAt: 6,
      content: '{ x } from "y";',
      contentStartsAt: 7,
      contentEndsAt: 22,
      value: 'export { x } from "y";',
      valueStartsAt: 0,
      valueEndsAt: 22,
      all: ["export"],
      error: null,
    },
    "01.02"
  );
});

test.run();
