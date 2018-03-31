/* eslint ava/no-only-test:0 */

import test from "ava";
import a from "../dist/array-of-arrays-into-ast.cjs";

test("1.1 - three elements", t => {
  t.deepEqual(
    a([[1, 2, 3], [1, 2], [5]]),
    {
      1: [
        {
          2: [
            {
              3: [null]
            },
            null
          ]
        }
      ],
      5: [null]
    },
    "1.1.1"
  );
  t.deepEqual(
    a([[5], [1, 2, 3], [1, 2]]),
    {
      1: [
        {
          2: [
            {
              3: [null]
            },
            null
          ]
        }
      ],
      5: [null]
    },
    "1.1.2"
  );
  t.deepEqual(
    a([[1, 2], [5], [1, 2, 3]]),
    {
      1: [
        {
          2: [
            null,
            {
              3: [null]
            }
          ]
        }
      ],
      5: [null]
    },
    "1.1.3"
  );
  t.deepEqual(
    a([[1], [5], [1, 2, 3]]),
    {
      1: [
        null,
        {
          2: [
            {
              3: [null]
            }
          ]
        }
      ],
      5: [null]
    },
    "1.1.4"
  );
});

test("1.2 - opts.dedupe", t => {
  t.deepEqual(
    a([[1], [1], [1]]),
    {
      1: [null]
    },
    "1.2.1"
  );
  t.deepEqual(
    a([[1], [1], [1]], { dedupe: false }),
    {
      1: [null, null, null]
    },
    "1.2.2"
  );
});
