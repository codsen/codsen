// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { mixer } from "../dist/test-mixer.esm.js";

test("01", () => {
  equal(
    mixer(
      {
        foo: true,
      },
      {
        foo: true,
        bar: false,
      },
    ),
    [
      {
        foo: true,
        bar: false,
      },
      {
        foo: true,
        bar: true,
      },
    ],
    "01.01",
  );
  equal(
    mixer(
      {
        foo: true,
      },
      {
        foo: true,
        bar: false,
      },
      false,
    ),
    [
      {
        foo: true,
        bar: false,
      },
      {
        foo: true,
        bar: true,
      },
    ],
    "01.02",
  );
  equal(
    mixer(
      {
        foo: true,
      },
      {
        foo: true,
        bar: false,
      },
      true,
    ),
    [
      {
        foo: true,
        bar: false,
      },
      {
        foo: true,
        bar: true,
      },
    ],
    "01.03",
  );
});

test("02", () => {
  equal(
    mixer(
      {},
      {
        foo: true,
        bar: "z",
      },
    ),
    [
      {
        foo: false,
        bar: "z",
      },
      {
        foo: true,
        bar: "z",
      },
    ],
    "02.01",
  );
  equal(
    mixer(
      {},
      {
        foo: true,
        bar: "z",
      },
      true, // enforce bool values
    ),
    [
      {
        foo: false,
        bar: "z",
      },
      {
        foo: true,
        bar: "z",
      },
    ],
    "02.02",
  );
});

test("03 - request all variations by passing undefined as 1st arg", () => {
  equal(
    mixer(undefined, {
      foo: true,
      bar: "z",
    }),
    [
      {
        foo: false,
        bar: "z",
      },
      {
        foo: true,
        bar: "z",
      },
    ],
    "03.01",
  );
  equal(
    mixer(
      undefined,
      {
        foo: true,
        bar: "z",
      },
      true, // enforce bool values
    ),
    [
      {
        foo: false,
        bar: "z",
      },
      {
        foo: true,
        bar: "z",
      },
    ],
    "03.02",
  );
});

test("04 - ensure values are cloned, not referenced", () => {
  let obj = {
    foo: true,
    bar: false,
    baz: { x: "y" },
  };
  // first calculate the combinations
  let result = mixer(
    {
      foo: true,
    },
    obj,
  );
  // then, mutate the value within the source - if it was referenced,
  // values will change! If it was cloned, values won't change.
  obj.baz.x = "z";

  equal(
    result,
    [
      {
        foo: true,
        bar: false,
        baz: { x: "y" }, // < still "y", not null
      },
      {
        foo: true,
        bar: true,
        baz: { x: "y" }, // < still "y", not null
      },
    ],
    "04.01",
  );
});

test("05 - ensure values are cloned, not referenced", () => {
  equal(
    mixer(
      {
        stripHtml: true,
        replaceLineBreaks: false,
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"], // <-
      },
      {
        removeWidows: true,
        stripHtml: true,
        replaceLineBreaks: false,
        eol: "lf",
        stripHtmlButIgnoreTags: ["b", "strong", "i", "em", "br", "sup"],
        stripHtmlAddNewLine: ["li", "/ul"],
        cb: null,
      },
    ),
    [
      {
        removeWidows: false,
        stripHtml: true,
        replaceLineBreaks: false,
        eol: "lf",
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"], // <-
        cb: null,
      },
      {
        removeWidows: true,
        stripHtml: true,
        replaceLineBreaks: false,
        eol: "lf",
        stripHtmlButIgnoreTags: [],
        stripHtmlAddNewLine: ["br"], // <-
        cb: null,
      },
    ],
    "05.01",
  );
});

test("06", () => {
  equal(
    mixer(
      {
        foo: true,
        bar: false,
        baz: 1,
        qux: false,
      },
      {
        foo: false,
        bar: false,
        baz: 0,
        qux: true,
      },
    ),
    [
      {
        foo: true,
        bar: false,
        baz: 1,
        qux: false,
      },
    ],
    "06.01",
  );
});

test("07", () => {
  equal(
    mixer(
      {
        foo: true,
        bar: false,
        baz: 1,
      },
      {
        foo: false,
        bar: false,
        baz: 0,
        qux: true,
      },
    ),
    [
      {
        foo: true,
        bar: false,
        baz: 1,
        qux: false,
      },
      {
        foo: true,
        bar: false,
        baz: 1,
        qux: true,
      },
    ],
    "07.01",
  );
});

test("08 - contains non-bool values which don't exist in defaultsObj", () => {
  equal(
    mixer(
      {
        foo: true,
        bar: false,
        x: 1,
      },
      {
        foo: false,
        bar: false,
        qux: true,
      },
    ),
    [
      {
        foo: true, // pinned bool
        bar: false, // pinned bool
        x: 1, // was not present in defaults, but it's not bool so ok
        qux: false,
      },
      {
        foo: true, // pinned bool
        bar: false, // pinned bool
        x: 1, // was not present in defaults, but it's not bool so ok
        qux: true,
      },
    ],
    "08.01",
  );
});

test("09", () => {
  equal(
    mixer(
      {
        x: 1,
      },
      {
        foo: false,
        bar: false,
        qux: true,
      },
    ),
    [
      // 2^3=8 objects:
      {
        foo: false,
        bar: false,
        qux: false,
        x: 1,
      },
      {
        foo: true,
        bar: false,
        qux: false,
        x: 1,
      },
      {
        foo: false,
        bar: true,
        qux: false,
        x: 1,
      },
      {
        foo: true,
        bar: true,
        qux: false,
        x: 1,
      },
      {
        foo: false,
        bar: false,
        qux: true,
        x: 1,
      },
      {
        foo: true,
        bar: false,
        qux: true,
        x: 1,
      },
      {
        foo: false,
        bar: true,
        qux: true,
        x: 1,
      },
      {
        foo: true,
        bar: true,
        qux: true,
        x: 1,
      },
    ],
    "09.01",
  );
});

test("10 - isolates mutable values between generated rows", () => {
  let callbackCalls = 0;
  const callback = () => {
    callbackCalls += 1;
  };
  const shared = { value: "shared" };
  const cycle = { value: "cycle" };
  cycle.self = cycle;
  const mapKey = { id: 1 };
  const mapValue = { value: "map" };
  const setValue = { value: "set" };
  const defaults = {
    enabled: false,
    nested: { value: "nested" },
    list: [{ value: "list" }],
    map: new Map([[mapKey, mapValue]]),
    set: new Set([setValue]),
    cycle,
    aliasFromDefaults: shared,
    callback,
  };
  const ref = {
    required: [{ value: "required" }],
    aliasFromRef: shared,
  };

  const [first, second] = mixer(ref, defaults);
  const [[firstMapKey, firstMapValue]] = first.map;
  const [[secondMapKey, secondMapValue]] = second.map;
  const [firstSetValue] = first.set;
  const [secondSetValue] = second.set;

  is(first.aliasFromDefaults, first.aliasFromRef, "10.01");
  is(second.aliasFromDefaults, second.aliasFromRef, "10.02");
  is.not(first.aliasFromDefaults, second.aliasFromDefaults, "10.03");
  is.not(first.aliasFromDefaults, shared, "10.04");
  is.not(first.nested, second.nested, "10.05");
  is.not(first.nested, defaults.nested, "10.06");
  is.not(first.list, second.list, "10.07");
  is.not(first.list[0], second.list[0], "10.08");
  is.not(first.map, second.map, "10.09");
  is.not(firstMapKey, secondMapKey, "10.10");
  is.not(firstMapValue, secondMapValue, "10.11");
  is.not(first.set, second.set, "10.12");
  is.not(firstSetValue, secondSetValue, "10.13");
  is(first.cycle.self, first.cycle, "10.14");
  is(second.cycle.self, second.cycle, "10.15");
  is.not(first.cycle, second.cycle, "10.16");
  is.not(first.required, second.required, "10.17");
  is(first.callback, callback, "10.18");
  is(second.callback, callback, "10.19");
  equal(callbackCalls, 0, "10.20");

  first.aliasFromDefaults.value = "changed";
  first.nested.value = "changed";
  first.list[0].value = "changed";
  firstMapKey.id = 2;
  firstMapValue.value = "changed";
  firstSetValue.value = "changed";
  first.cycle.value = "changed";
  first.required[0].value = "changed";

  equal(
    {
      alias: second.aliasFromDefaults.value,
      callbackCalls,
      cycle: second.cycle.value,
      list: second.list[0].value,
      mapKey: secondMapKey.id,
      mapValue: secondMapValue.value,
      nested: second.nested.value,
      required: second.required[0].value,
      set: secondSetValue.value,
      sourceAlias: shared.value,
      sourceCycle: cycle.value,
      sourceList: defaults.list[0].value,
      sourceMapKey: mapKey.id,
      sourceMapValue: mapValue.value,
      sourceNested: defaults.nested.value,
      sourceRequired: ref.required[0].value,
      sourceSet: setValue.value,
    },
    {
      alias: "shared",
      callbackCalls: 0,
      cycle: "cycle",
      list: "list",
      mapKey: 1,
      mapValue: "map",
      nested: "nested",
      required: "required",
      set: "set",
      sourceAlias: "shared",
      sourceCycle: "cycle",
      sourceList: "list",
      sourceMapKey: 1,
      sourceMapValue: "map",
      sourceNested: "nested",
      sourceRequired: "required",
      sourceSet: "set",
    },
    "10.21",
  );
});

test.run();
