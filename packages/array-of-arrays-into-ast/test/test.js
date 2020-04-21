import t from "tap";
import a from "../dist/array-of-arrays-into-ast.esm";

t.test("1.1 - three elements", (t) => {
  t.same(
    a([[1, 2, 3], [1, 2], [5]]),
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
    "1.1.1"
  );
  t.same(
    a([[5], [1, 2, 3], [1, 2]]),
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
    "1.1.2"
  );
  t.same(
    a([[1, 2], [5], [1, 2, 3]]),
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
    "1.1.3"
  );
  t.same(
    a([[1], [5], [1, 2, 3]]),
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
    "1.1.4"
  );
  t.end();
});

t.test("1.2 - opts.dedupe", (t) => {
  t.same(
    a([[1], [1], [1]]),
    {
      1: [null],
    },
    "1.2.1"
  );
  t.same(
    a([[1], [1], [1]], { dedupe: false }),
    {
      1: [null, null, null],
    },
    "1.2.2"
  );
  t.end();
});

t.test("1.3 - throws", (t) => {
  t.throws(() => {
    a(true);
  }, /THROW_ID_01/g);
  t.end();
});

t.test("1.4 - empty input ends the operation quick", (t) => {
  t.same(a([]), {}, "1.4.1");
  t.same(a([], { dedupe: false }), {}, "1.4.2");
  t.end();
});
