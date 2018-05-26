import test from "ava";
import isEqual from "lodash.isequal";
import objectPath from "object-path";
import traverse from "../dist/ast-monkey-traverse.esm";

let input = {
  a: { b: [{ c: { d: "e" } }] },
  c: { d: "e" }
};

// -----------------------------------------------------------------------------
// traverse
// -----------------------------------------------------------------------------

test("01.01 - use traverse to delete one key from an array", t => {
  input = [
    {
      a: "b"
    },
    {
      c: "d"
    },
    {
      e: "f"
    }
  ];

  const actual01 = traverse(input, (key1, val1) => {
    const current = val1 !== undefined ? val1 : key1;
    if (isEqual(current, { a: "b" })) {
      return NaN;
    }
    return current;
  });
  const intended01 = [
    {
      c: "d"
    },
    {
      e: "f"
    }
  ];
  t.deepEqual(actual01, intended01, "01.01.01");

  const actual02 = traverse(input, (key1, val1) => {
    const current = val1 !== undefined ? val1 : key1;
    if (isEqual(current, { c: "d" })) {
      return NaN;
    }
    return current;
  });
  const intended02 = [
    {
      a: "b"
    },
    {
      e: "f"
    }
  ];
  t.deepEqual(actual02, intended02, "01.01.02");

  const actual03 = traverse(input, (key1, val1) => {
    const current = val1 !== undefined ? val1 : key1;
    if (isEqual(current, { e: "f" })) {
      return NaN;
    }
    return current;
  });
  const intended03 = [
    {
      a: "b"
    },
    {
      c: "d"
    }
  ];
  t.deepEqual(actual03, intended03, "01.01.03");
});

test("01.02 - more deletion from arrays", t => {
  input = [
    {
      a: "b"
    },
    {
      a: "b"
    },
    {
      c: "d"
    }
  ];

  const actual01 = traverse(input, (key1, val1) => {
    // console.log('\n\n------\n')
    // console.log('key = ' + JSON.stringify(key, null, 4))
    // console.log('val = ' + JSON.stringify(val, null, 4))
    const current = val1 !== undefined ? val1 : key1;
    if (isEqual(current, { a: "b" })) {
      return NaN;
    }
    return current;
  });
  const intended01 = [
    {
      c: "d"
    }
  ];
  t.deepEqual(actual01, intended01, "01.02");
});

test("01.03 - use traverse, passing null, write over values", t => {
  input = [
    {
      a: "b"
    },
    {
      a: "b"
    },
    {
      c: "d"
    }
  ];

  const actual01 = traverse(input, (key1, val1) => {
    // console.log('\n\n------\n')
    // console.log('key = ' + JSON.stringify(key, null, 4))
    // console.log('val = ' + JSON.stringify(val, null, 4))
    const current = val1 !== undefined ? val1 : key1;
    if (current === "b") {
      return null;
    }
    return current;
  });
  const intended01 = [
    {
      a: null
    },
    {
      a: null
    },
    {
      c: "d"
    }
  ];
  t.deepEqual(actual01, intended01, "01.03");
});

test("01.04 - traverse automatically patches up holes in arrays", t => {
  input = ["a", undefined, "b"];

  const actual01 = traverse(input, (key1, val1) => {
    // console.log('\n\n------\n')
    // console.log('key = ' + JSON.stringify(key, null, 4))
    // console.log('val = ' + JSON.stringify(val, null, 4))
    const current = val1 !== undefined ? val1 : key1;
    // we do nothing here
    return current;
  });
  const intended01 = ["a", "b"];
  t.deepEqual(actual01, intended01, "01.04");
});

test("01.05 - delete key-value pair from plain object in root", t => {
  input = {
    a: "a",
    b: "b",
    c: "c"
  };

  const actual = traverse(input, (key1, val1) => {
    const current = val1 !== undefined ? val1 : key1;
    if (current === "a") {
      return NaN;
    }
    return current;
  });
  const intended = {
    b: "b",
    c: "c"
  };

  t.deepEqual(actual, intended, "01.05");
});

test("01.06 - only traversal, #1", t => {
  input = {
    a: ["1", "2", "3"]
  };
  const actual = traverse(input, (key1, val1, innerObj) => {
    const current = val1 !== undefined ? val1 : key1;
    t.deepEqual(current, objectPath.get(input, innerObj.path), innerObj.path);
    return current;
  });
  t.pass(actual);
});

test("01.07 - only traversal, #2", t => {
  input = {
    a: {
      b: {
        c: "c_val",
        d: "d_val",
        e: "e_val"
      },
      f: {
        g: {
          h: ["1", "2", "3"],
          i: [
            "4",
            "5",
            {
              j: "k"
            }
          ],
          l: ["7", "8", "9"]
        }
      }
    }
  };
  const actual = traverse(input, (key1, val1, innerObj) => {
    const current = val1 !== undefined ? val1 : key1;
    t.deepEqual(current, objectPath.get(input, innerObj.path), innerObj.path);
    return current;
  });
  t.pass(actual);
});

test("01.08 - only traversal, #3", t => {
  input = ["1", "2", { a: "3" }];
  const actual = traverse(input, (key1, val1, innerObj) => {
    const current = val1 !== undefined ? val1 : key1;
    t.deepEqual(current, objectPath.get(input, innerObj.path), innerObj.path);
    return current;
  });
  t.pass(actual);
});
