import tap from "tap";
import { generateAst } from "../dist/array-of-arrays-into-ast.esm.js";

tap.test("01 - three elements", (t) => {
  t.strictSame(
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
    "01.01"
  );
  t.strictSame(
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
    "01.02"
  );
  t.strictSame(
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
    "01.03"
  );
  t.strictSame(
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
    "01.04"
  );
  t.end();
});

tap.test("02 - opts.dedupe", (t) => {
  t.strictSame(
    generateAst([[1], [1], [1]]),
    {
      1: [null],
    },
    "02.01"
  );
  t.strictSame(
    generateAst([[1], [1], [1]], { dedupe: false }),
    {
      1: [null, null, null],
    },
    "02.02"
  );
  t.end();
});

tap.test("03 - throws", (t) => {
  t.throws(() => {
    generateAst(true);
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("04 - empty input ends the operation quick", (t) => {
  t.strictSame(generateAst([]), {}, "04.01");
  t.strictSame(generateAst([], { dedupe: false }), {}, "04.02");
  t.end();
});
