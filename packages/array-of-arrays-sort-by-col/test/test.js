/* eslint ava/no-only-test:0, no-console:0 */

import test from "ava";
import sortByCol from "../dist/array-of-arrays-sort-by-col.cjs";
import shuffle from "array-shuffle";

function mixer(t, tested, reference, idx) {
  // backwards loop for perf:
  for (let i = tested.length; i--; ) {
    tested.unshift(tested.pop());
    // console.log(
    //   `${`\u001b[${33}m${`specimen #${
    //     String(tested.length - i).length === 1
    //       ? `0${tested.length - i}`
    //       : tested.length - i
    //   }`}\u001b[${39}m`} = ${JSON.stringify(tested, null, 0)}`
    // );
    t.deepEqual(sortByCol(tested, idx), reference);
  }
  for (let i = tested.length * tested.length; i--; ) {
    const specimen = shuffle(tested);

    // const rowNumber = tested.length + (tested.length * tested.length - i);
    // console.log(
    //   `${`\u001b[${35}m${`specimen #${
    //     String(rowNumber).length === 1 ? `0${rowNumber}` : rowNumber
    //   }`}\u001b[${39}m`} = ${JSON.stringify(specimen, null, 0)}`
    // );

    t.deepEqual(sortByCol(specimen, idx), reference);
  }
}

// -----------------------------------------------------------------------------

test("1.1 - multiple elements, #1", t => {
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]] // first el., 1-1-1-1
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // first el., hardcoded, same as above
    0
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // first el., hardcoded, same as above
    "0"
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // second el., 2-4-4-undefined
    1
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // second el., 2-4-4-undefined
    "1"
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // third el., 3-3-4-undefined
    2
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]], // third el., 3-3-4-undefined
    "2"
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]],
    3 // third element doesn't exist on any of the subarrays, so default sorting is done
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]],
    "3" // third element doesn't exist on any of the subarrays, so default sorting is done
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]],
    99 // 99th element doesn't exist on any of the subarrays, so default sorting is done
  );
  mixer(
    t,
    [[1, 4, 3], [1], [1, 2, 3], [1, 4, 4]],
    [[1, 2, 3], [1, 4, 3], [1, 4, 4], [1]],
    "99" // 99th element doesn't exist on any of the subarrays, so default sorting is done
  );
});

test("1.2 - multiple elements, #2", t => {
  mixer(
    t,
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]]
  );
  mixer(
    t,
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]],
    0
  );
  mixer(
    t,
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]],
    1
  );
  mixer(
    t,
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 9, 0], [1, 8, 2], [1, 7, 5], [1]],
    2
  );
  mixer(
    t,
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]],
    3 // fourth element doesn't exist on any of the subarrays, so default sorting is done
  );
  mixer(
    t,
    [[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]],
    [[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]],
    99 // 100th element doesn't exist on any of the subarrays, so default sorting is done
  );
});

test("1.3 - multiple elements, #3 - opposite order", t => {
  mixer(
    t,
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]]
  );
  mixer(
    t,
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]],
    0
  );
  mixer(
    t,
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]],
    1
  );
  mixer(
    t,
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]],
    2
  );
  mixer(
    t,
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]],
    3
  );
  mixer(
    t,
    [[1, 9, 4], [1], [1, 9, 3], [1, 9, 2]],
    [[1, 9, 2], [1, 9, 3], [1, 9, 4], [1]],
    99
  );
});

test("1.4 - multiple elements, #4 - single elements", t => {
  mixer(t, [[0], [0], [3], [2], [1]], [[0], [0], [1], [2], [3]]);
  mixer(t, [[0], [0], [3], [2], [1]], [[0], [0], [1], [2], [3]], 0);
  mixer(t, [[0], [0], [3], [2], [1]], [[0], [0], [1], [2], [3]], 1); // second element doesn't exist
  mixer(t, [[0], [0], [3], [2], [1]], [[0], [0], [1], [2], [3]], 99); // 100-th element doesn't exist
});

test("1.5 - first column indexes contain opposite order values", t => {
  mixer(
    t,
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]]
  ); // defaulting to first elements, that's indexes "0" and they contain values: 1-2-3-undefined
  mixer(
    t,
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    0 // first elements, indexes "0" contain values: 1-2-3-undefined
  );
  mixer(
    t,
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    [[3, 7, 0], [2, 8, 0], [1, 9, 0], [1]],
    1 // second elements, indexes "1" contain values: 7-8-9-undefined
  );

  // zero's were done first, so [1] goes last. Since all second indexes are the same
  // across rows, matching containued by comparing from zero, thus [1,9,0] went first:
  mixer(
    t,
    [[1, 9, 0], [1], [2, 8, 0], [3, 7, 0]],
    [[1, 9, 0], [2, 8, 0], [3, 7, 0], [1]],
    2 // Third elements, indexes "2" contain values: 0-0-0-undefined across rows
  );
});

// -----------------------------------------------------------------------------
// 2. edge cases

test("2.1 - various empty arrays", t => {
  mixer(t, [], []);
  mixer(t, [[]], [[]]);
  mixer(t, [[], []], [[], []]);
  mixer(t, [[], [], []], [[], [], []]);
  mixer(t, [[], [1], []], [[1], [], []]);
  // hardcoded default column
  mixer(t, [], []);
  mixer(t, [[]], [[]]);
  mixer(t, [[], []], [[], []]);
  mixer(t, [[], [], []], [[], [], []]);
  mixer(t, [[], [1], []], [[1], [], []]);
});

test("2.2 - throws", t => {
  // pinning throws by throw ID:
  const error1 = t.throws(() => {
    sortByCol(1);
  });
  t.truthy(error1.message.includes("THROW_ID_01"));

  const error2 = t.throws(() => {
    sortByCol(true);
  });
  t.truthy(error2.message.includes("THROW_ID_01"));

  const error3 = t.throws(() => {
    sortByCol("z");
  });
  t.truthy(error3.message.includes("THROW_ID_01"));

  const error4 = t.throws(() => {
    sortByCol([], "a");
  });
  t.truthy(error4.message.includes("THROW_ID_02"));
});
