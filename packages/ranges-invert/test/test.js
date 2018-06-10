import test from "ava";
import i from "../dist/ranges-invert.esm";

// ==============================
// 0. THROWS
// ==============================

test("00.01 - not array", t => {
  // throw pinning:
  const error1 = t.throws(() => {
    i(null);
  });
  t.truthy(error1.message.includes("THROW_ID_01"));

  const error2 = t.throws(() => {
    i(1);
  });
  t.truthy(error2.message.includes("THROW_ID_01"));

  const error3 = t.throws(() => {
    i(true);
  });
  t.truthy(error3.message.includes("THROW_ID_01"));

  const error4 = t.throws(() => {
    i({ e: true });
  });
  t.truthy(error4.message.includes("THROW_ID_01"));

  const error5 = t.throws(() => {
    i([1, 3], 1); // <----- not array of arrays!
  });
  t.truthy(error5.message.includes("THROW_ID_07"));
});

test("00.02 - not two arguments in one of ranges", t => {
  const error1 = t.throws(() => {
    i([[1, 2, 3]], 4, { strictlyTwoElementsInRangeArrays: true });
  });
  t.truthy(error1.message.includes("THROW_ID_04"));

  const error2 = t.throws(() => {
    i([[1, 2, 3], [4, 5, 6]], 6, { strictlyTwoElementsInRangeArrays: true });
  });
  t.truthy(error2.message.includes("THROW_ID_04"));

  const error3 = t.throws(() => {
    i([[1, 2], [4, 5, 6], [7, 8]], 9, {
      strictlyTwoElementsInRangeArrays: true
    });
  });
  t.truthy(error3.message.includes("THROW_ID_04"));

  // DOES NOT THROW:

  t.notThrows(() => {
    i([[1, 2], [4, 5], [7, 8]], 9);
  });
  // with defaults opts
  t.notThrows(() => {
    i([[1, 2, 3]], 3);
  });
  t.notThrows(() => {
    i([[1, 2, 3], [4, 5, 6]], 6);
  });
  t.notThrows(() => {
    i([[1, 2], [4, 5, 6], [7, 8]], 8);
  });

  t.notThrows(() => {
    i([[1, 2, "zzz"]], 3);
  });
  t.notThrows(() => {
    i([[1, 2, "zzz"], [4, 5, "yyyy"]], 6);
  });
  t.notThrows(() => {
    i([[1, 2, null], [4, 5, "aaa", "bbb"], [7, 8, "ccc"]], 8);
  });
  t.notThrows(() => {
    i([[1, 2, null], [4, 5, "aaa", "bbb"], [7, 8, "ccc"]], 80);
  });
});

test("00.03 - some/all range indexes are not natural numbers", t => {
  t.notThrows(() => {
    i([[0, 3]], 3);
  });
  t.notThrows(() => {
    i([[0, 3]], 4);
  });

  const error1 = t.throws(() => {
    i([[0.2, 3]], 4);
  });
  t.truthy(error1.message.includes("THROW_ID_05"));

  const error2 = t.throws(() => {
    i([[0.2, 3.3]], 4);
  });
  t.truthy(error2.message.includes("THROW_ID_05"));

  const error3 = t.throws(() => {
    i([[2, 3.3]], 4);
  });
  t.truthy(error3.message.includes("THROW_ID_05"));

  const error4 = t.throws(() => {
    i([[0.2, 3.3]], 5);
  });
  t.truthy(error4.message.includes("THROW_ID_05"));

  const error5 = t.throws(() => {
    i([[0.2, 33]], 40);
  });
  t.truthy(error5.message.includes("THROW_ID_05"));

  const error6 = t.throws(() => {
    i([[0.2, 33, 55, 66.7]], 100);
  });
  t.truthy(error6.message.includes("THROW_ID_05"));
});

test("00.04 - second arg, strLen is wrong", t => {
  t.notThrows(() => {
    i([[0, 0]], 0);
  });

  const error1 = t.throws(() => {
    i([[0, 3]], 4.1);
  });
  t.truthy(error1.message.includes("THROW_ID_02"));

  const error2 = t.throws(() => {
    i([[0, 3]], "a");
  });
  t.truthy(error2.message.includes("THROW_ID_02"));
});

test("00.05 - zero-length ranges array", t => {
  t.notThrows(() => {
    i([], 0);
    i([], 1);
    i([], 2);
    i([], 99999);
  });
});

// ==============================
// 01. BAU - inverting
// ==============================

test(`01.01 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - reference string covers the range`, t => {
  const ref = "abcdefghij";
  const range1 = [1, 3];
  const range2p1 = [0, 1];
  const range2p2 = [3, 10];
  t.is(ref.slice(...range1), "bc", "01.01.01 - we mean what we intended");
  t.is(ref.slice(...range2p1), "a", "01.01.02 - chunk before is correct");
  t.is(ref.slice(...range2p2), "defghij", "01.01.03 - chunk after is correct");
  t.is(
    ref.slice(...range2p1) + ref.slice(...range1) + ref.slice(...range2p2),
    ref,
    "01.01.04 - all pieces add up"
  );
  // now, real deal:
  t.deepEqual(i([range1], ref.length), [range2p1, range2p2], "01.01");
});

test(`01.02 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - is one too short`, t => {
  // good:
  t.deepEqual(i([[1, 3]], 3), [[0, 1]], "01.02");
  // bad - length is 1 digit short:
  const error = t.throws(() => {
    i([[1, 3]], 2);
  });
  t.truthy(error.message.includes("THROW_ID_06"));
});

test(`01.03 - ${`\u001b[${33}m${`one range`}\u001b[${39}m`} - same element range invert`, t => {
  t.deepEqual(i([[0, 0]], 3), [[0, 3]], "01.03.01 - yields everything");
  t.deepEqual(i([[1, 1]], 3), [[0, 3]], "01.03.02");
});

test(`01.04 - ${`\u001b[${35}m${`two ranges`}\u001b[${39}m`} - reference string covers the ranges`, t => {
  const ref = "abcdefghij";
  const range1 = [1, 3];
  const range2 = [5, 6];

  const range2p1 = [0, 1];
  const range2p2 = [3, 5];
  const range2p3 = [6, 10];
  t.is(ref.slice(...range1), "bc", "01.04.01");
  t.is(ref.slice(...range2), "f", "01.04.02");

  t.is(
    ref.slice(...range2p1) +
      ref.slice(...range1) +
      ref.slice(...range2p2) +
      ref.slice(...range2) +
      ref.slice(...range2p3),
    ref,
    "01.04.04 - all pieces add up"
  );
  // // now, real deal:
  t.deepEqual(
    i([range1, range2], ref.length),
    [range2p1, range2p2, range2p3],
    "01.04.05"
  );
});

test(`01.05 - ${`\u001b[${35}m${`two ranges`}\u001b[${39}m`} - ranges touch each other`, t => {
  t.deepEqual(
    i([[3, 5], [5, 7]], 9),
    [[0, 3], [7, 9]],
    "01.05.01 - ranges with deltas of two indexes"
  );
  t.deepEqual(
    i([[3, 4], [4, 7]], 9),
    [[0, 3], [7, 9]],
    "01.05.02 - ranges with deltas of one index"
  );
  t.deepEqual(
    i([[0, 1], [1, 2]], 9),
    [[2, 9]],
    "01.05.03 - ranges with deltas of one index"
  );
  t.deepEqual(
    i([[0, 1], [1, 2], [5, 9]], 9),
    [[2, 5]],
    "01.05.04 - ranges with deltas of one index"
  );
  t.deepEqual(
    i([[0, 1], [1, 9]], 9),
    [],
    "01.05.05 - ranges with deltas of one index"
  );
});

test(`01.06 - ${`\u001b[${35}m${`two ranges`}\u001b[${39}m`} - input was given not merged`, t => {
  t.deepEqual(i([[0, 5], [3, 7]], 9), [[7, 9]], "01.06.01 - starts at zero");
  t.deepEqual(
    i([[2, 5], [3, 7]], 9),
    [[0, 2], [7, 9]],
    "01.06.01 - does not start at zero"
  );
  t.deepEqual(
    i([[3, 5], [2, 7]], 9),
    [[0, 2], [7, 9]],
    "01.06.02 - does not start at zero"
  );
});

test(`01.07 - ${`\u001b[${35}m${`two ranges`}\u001b[${39}m`} - third argument present`, t => {
  t.deepEqual(i([[0, 5, "zzz"], [3, 7, "aaaa"]], 9), [[7, 9]], "01.07");
});
