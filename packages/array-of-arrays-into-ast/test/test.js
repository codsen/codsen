import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { generateAst } from "../dist/array-of-arrays-into-ast.esm.js";

test("01 - three elements", () => {
  equal(
    generateAst([[1, 2, 3], [1, 2], [5]]),
    {
      1: [
        {
          2: [
            {
              3: [null],
            },
            null,
          ],
        },
      ],
      5: [null],
    },
    "01.01",
  );
  equal(
    generateAst([[5], [1, 2, 3], [1, 2]]),
    {
      1: [
        {
          2: [
            {
              3: [null],
            },
            null,
          ],
        },
      ],
      5: [null],
    },
    "01.02",
  );
  equal(
    generateAst([[1, 2], [5], [1, 2, 3]]),
    {
      1: [
        {
          2: [
            null,
            {
              3: [null],
            },
          ],
        },
      ],
      5: [null],
    },
    "01.03",
  );
  equal(
    generateAst([[1], [5], [1, 2, 3]]),
    {
      1: [
        null,
        {
          2: [
            {
              3: [null],
            },
          ],
        },
      ],
      5: [null],
    },
    "01.04",
  );
});

test("02 - opts.dedupe", () => {
  equal(
    generateAst([[1], [1], [1]]),
    {
      1: [null],
    },
    "02.01",
  );
  equal(
    generateAst([[1], [1], [1]], { dedupe: false }),
    {
      1: [null, null, null],
    },
    "02.02",
  );
});

test("03 - throws", () => {
  throws(
    () => {
      generateAst(true);
    },
    /THROW_ID_01/g,
    "03.01",
  );
});

test("04 - empty input ends the operation quick", () => {
  equal(generateAst([]), {}, "04.01");
  equal(generateAst([], { dedupe: false }), {}, "04.02");
});

test.run();
