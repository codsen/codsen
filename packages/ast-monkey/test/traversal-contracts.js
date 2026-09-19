import { test } from "uvu";
import { equal, is, throws } from "uvu/assert";

import {
  DELETE,
  traverse,
  traverseWithLookahead,
} from "../dist/ast-monkey.esm.js";

test("01 - transformer callbacks replace while observer returns are ignored", () => {
  const input = { a: { b: 1 }, c: 2 };
  const transformedPaths = [];
  const observedPaths = [];

  const transformed = traverse(input, (_key, _value, metadata) => {
    transformedPaths.push(metadata.path);
  });
  const observed = traverseWithLookahead(input, (_key, _value, metadata) => {
    observedPaths.push(metadata.path);
    return DELETE;
  });

  equal(transformed, { a: undefined, c: undefined }, "01.01");
  equal(transformedPaths, ["a", "c"], "01.02");
  equal(observedPaths, ["a", "a.b", "c"], "01.03");
  equal(observed, undefined, "01.04");
  equal(input, { a: { b: 1 }, c: 2 }, "01.05");
});

test("02 - sparse holes and explicit undefined retain distinct contracts", () => {
  const input = new Array(3);
  input[1] = undefined;
  input[2] = "last";
  const transformedPaths = [];
  const observedPaths = [];

  const transformed = traverse(input, (key, value, metadata) => {
    transformedPaths.push(metadata.path);
    return metadata.parentType === "object" ? value : key;
  });
  traverseWithLookahead(input, (key, value, metadata) => {
    observedPaths.push([metadata.path, key, value]);
  });

  equal(transformedPaths, ["1", "2"], "02.01");
  equal(
    observedPaths,
    [
      ["0", undefined, undefined],
      ["1", undefined, undefined],
      ["2", "last", undefined],
    ],
    "02.02",
  );
  equal(transformed, input, "02.03");
  equal(Object.hasOwn(transformed, 0), false, "02.04");
  equal(Object.hasOwn(transformed, 1), true, "02.05");
  equal(
    traverse({ explicit: undefined }, (key, value, metadata) =>
      metadata.parentType === "object" ? value : key,
    ),
    { explicit: undefined },
    "02.06",
  );
});

test("03 - observer stops after delivering already buffered callbacks", () => {
  const transformedPaths = [];
  const observedPaths = [];
  const input = { a: 1, b: 2, c: 3, d: 4 };

  traverse(input, (_key, value, metadata, stop) => {
    transformedPaths.push(metadata.path);
    stop.now = true;
    return value;
  });
  traverseWithLookahead(
    input,
    (_key, _value, metadata, stop) => {
      observedPaths.push(metadata.path);
      stop.now = true;
    },
    2,
  );

  equal(transformedPaths, ["a"], "03.01");
  equal(observedPaths, ["a", "b", "c"], "03.02");
});

test("04 - observer values can mutate input while transformer values cannot", () => {
  const input = { a: { x: 1 } };
  const transformed = traverse(input, (key, value, metadata) => {
    if (metadata.path === "a") value.x = 2;
    return metadata.parentType === "object" ? value : key;
  });

  equal(transformed, { a: { x: 2 } }, "04.01");
  equal(input, { a: { x: 1 } }, "04.02");

  const visited = [];
  traverseWithLookahead(input, (_key, value, metadata) => {
    if (metadata.path === "a") value.x = 3;
    visited.push([metadata.path, value]);
  });

  equal(input, { a: { x: 3 } }, "04.03");
  equal(
    visited,
    [
      ["a", { x: 3 }],
      ["a.x", 3],
    ],
    "04.04",
  );
});

test("05 - lookahead reports detached depth-first future tuples", () => {
  const input = { a: { b: 1 }, c: 2 };
  let first;

  traverseWithLookahead(
    input,
    (_key, _value, metadata) => {
      if (metadata.path === "a") first = metadata;
    },
    2,
  );

  equal(
    first.next,
    [
      [
        "b",
        1,
        {
          depth: 1,
          path: "a.b",
          topmostKey: "a",
          parent: { b: 1 },
          parentType: "object",
        },
      ],
      [
        "c",
        2,
        {
          depth: 0,
          path: "c",
          topmostKey: "c",
          parent: { a: { b: 1 }, c: 2 },
          parentType: "object",
        },
      ],
    ],
    "05.01",
  );

  first.parent.a.b = 99;
  first.next[0][2].parent.b = 88;
  equal(input, { a: { b: 1 }, c: 2 }, "05.02");
  equal(first.parent.a.b, 99, "05.03");
  equal(first.next[0][2].parent.b, 88, "05.04");
});

test("06 - canonical validation errors identify their owning API", () => {
  throws(
    () => traverse(new Date(), () => undefined),
    /^ast-monkey\/traverse\(\): \[THROW_ID_01\]/,
    "06.01",
  );
  throws(
    () => traverse([]),
    /^ast-monkey\/traverse\(\): \[THROW_ID_02\]/,
    "06.02",
  );
  throws(
    () => traverseWithLookahead([]),
    /^ast-monkey\/traverseWithLookahead\(\): \[THROW_ID_01\]/,
    "06.03",
  );
  const sentinel = new Error("from the caller");
  for (const visit of [traverse, traverseWithLookahead]) {
    try {
      visit([1], () => {
        throw sentinel;
      });
    } catch (error) {
      is(error, sentinel, "06.04");
      continue;
    }
    throw new Error("The callback error must propagate");
  }
});

test("07 - legacy lookahead counts retain their buffering behavior", () => {
  for (const count of [-1, Number.NaN]) {
    const futures = [];
    traverseWithLookahead(
      [1, 2, 3],
      (_key, _value, metadata) => {
        futures.push(metadata.next.length);
      },
      count,
    );
    equal(futures, [0, 0, 0], "07.01");
  }
  for (const count of [1.5, Infinity]) {
    const futures = [];
    traverseWithLookahead(
      [1, 2, 3],
      (_key, _value, metadata) => {
        futures.push(metadata.next.map(([key]) => key));
      },
      count,
    );
    equal(
      futures,
      count === Infinity ? [[2, 3], [3], []] : [[2], [3], []],
      "07.02",
    );
  }
});

test.run();
