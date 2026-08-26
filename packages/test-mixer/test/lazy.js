// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { mixer, mixerLazy } from "../dist/test-mixer.esm.js";

function booleanDefaults(count) {
  const result = {};
  for (let index = 0; index < count; index++) {
    result[`flag${index}`] = index % 2 === 0;
  }
  return result;
}

test("01 - yields eager rows in the same order", () => {
  equal([...mixerLazy({}, {})], [], "01.01");
  equal([...mixerLazy({}, { mode: "safe" })], [{ mode: "safe" }], "01.02");

  const ref = { pinned: true, required: "carried" };
  const defaultsObj = {
    pinned: false,
    first: true,
    second: false,
    mode: "safe",
  };
  equal([...mixerLazy(ref, defaultsObj)], mixer(ref, defaultsObj), "01.03");
});

test("02 - snapshots inputs and isolates yielded rows", () => {
  const defaultsObj = {
    enabled: false,
    nested: { value: "safe" },
  };
  const rows = mixerLazy({}, defaultsObj);
  defaultsObj.nested.value = "changed after iterator creation";

  const first = rows.next().value;
  const second = rows.next().value;
  first.nested.value = "changed in the first row";

  equal(second.nested.value, "safe", "02.01");
  is.not(first.nested, second.nested, "02.02");
  equal(rows.next().done, true, "02.03");
});

test("03 - supports bounded prefixes above the eager limit", () => {
  const thirtyTwoKeys = mixerLazy({}, booleanDefaults(32));
  const first = thirtyTwoKeys.next().value;
  const second = thirtyTwoKeys.next().value;
  const third = thirtyTwoKeys.next().value;

  equal(
    [
      [first.flag0, first.flag1],
      [second.flag0, second.flag1],
      [third.flag0, third.flag1],
    ],
    [
      [false, false],
      [true, false],
      [false, true],
    ],
    "03.01",
  );
  equal(thirtyTwoKeys.return().done, true, "03.02");

  const thousandKeys = mixerLazy({}, booleanDefaults(1024));
  equal(thousandKeys.next().value.flag1023, false, "03.03");
  equal(thousandKeys.return().done, true, "03.04");
});

test("04 - validates when the lazy iterator is created", () => {
  throws(
    () => mixerLazy(null, {}),
    /^test-mixer\/mixerLazy\(\): \[THROW_ID_01\]/u,
    "04.01",
  );
  throws(
    () => mixerLazy({}, null),
    /^test-mixer\/mixerLazy\(\): \[THROW_ID_02\]/u,
    "04.02",
  );
  throws(
    () => mixerLazy({ missing: true }, {}),
    /^test-mixer\/mixerLazy\(\): \[THROW_ID_03\]/u,
    "04.03",
  );
});

test.run();
