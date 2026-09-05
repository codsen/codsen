import { rejects } from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import { test } from "uvu";
import { equal, is } from "uvu/assert";
import { getKeyset } from "../dist/json-comb-core.esm.js";

test("01 - empty iterables resolve to an empty schema", async () => {
  equal(await getKeyset([]), {}, "01.01");
  equal(await getKeyset(new Set(), { placeholder: null }), {}, "01.02");
});

test("02 - mixed iterable values preserve key order and frozen input", async () => {
  const input = Object.freeze({ z: Object.freeze({ b: 1 }) });
  const result = await getKeyset(
    new Set([
      input,
      Promise.resolve({ a: 2 }),
      {
        // biome-ignore lint/suspicious/noThenProperty: exercise the public PromiseLike input contract
        then(resolve) {
          resolve({ m: 3 });
        },
      },
    ]),
    { placeholder: null },
  );
  equal(result, { z: { b: null }, a: null, m: null }, "02.01");
  equal(Object.keys(result), ["z", "a", "m"], "02.02");
  equal(input, { z: { b: 1 } }, "02.03");
});

test("03 - iteration waits for each value before requesting the next", async () => {
  let release;
  const first = new Promise((resolve) => {
    release = resolve;
  });
  const events = [];
  function* input() {
    events.push("first");
    yield first;
    events.push("second");
    yield { b: 2 };
    events.push("done");
  }
  const result = getKeyset(input());
  equal(events, ["first"], "03.01");
  release({ a: 1 });
  equal(await result, { a: false, b: false }, "03.02");
  equal(events, ["first", "second", "done"], "03.03");
});

test("04 - rejected thenables stop iteration and preserve the rejection", async () => {
  const failure = new Error("input failed");
  let reachedTail = false;
  function* input() {
    yield { a: 1 };
    yield {
      // biome-ignore lint/suspicious/noThenProperty: exercise a rejecting PromiseLike input
      then(_resolve, reject) {
        reject(failure);
      },
    };
    reachedTail = true;
    yield { b: 2 };
  }
  await rejects(getKeyset(input()), (error) => error === failure, "04.01");
  is(reachedTail, false, "04.02");
});

test("05 - iterator failures reject both before and after a valid value", async () => {
  for (const failAfter of [0, 1]) {
    const failure = new Error("iteration failed");
    function* input() {
      if (failAfter) {
        yield { a: 1 };
      }
      throw failure;
    }
    await rejects(getKeyset(input()), (error) => error === failure, "05.01");
  }
});

test("06 - invalid elements retain their index and leave the iterator open", async () => {
  let closed = false;
  function* input() {
    try {
      yield { a: 1 };
      yield null;
      yield { b: 2 };
    } finally {
      closed = true;
    }
  }
  const iterator = input();
  await rejects(getKeyset(iterator), /\[THROW_ID_04\].*1th element/, "06.01");
  is(closed, false, "06.02");
  equal(iterator.next(), { value: { b: 2 }, done: false }, "06.03");
  iterator.return();
});

test("07 - failures while reading an object reject the operation", async () => {
  const failure = new Error("property read failed");
  const input = {
    get a() {
      throw failure;
    },
  };
  await rejects(getKeyset([input]), (error) => error === failure, "07.01");
});

test("08 - the browser script preserves async results and iterator rejections", async () => {
  const context = createContext({});
  runInContext(
    readFileSync(
      new URL("../dist/json-comb-core.umd.js", import.meta.url),
      "utf8",
    ),
    context,
  );
  const result = await runInContext(
    "jsonCombCore.getKeyset(new Set([{z: 1}, Promise.resolve({a: 2})]), {placeholder: null})",
    context,
  );
  equal(JSON.parse(JSON.stringify(result)), { z: null, a: null }, "08.01");
  await rejects(
    runInContext(
      'jsonCombCore.getKeyset((function* () { yield {a: 1}; throw new Error("iterator failed"); })())',
      context,
    ),
    /iterator failed/,
    "08.02",
  );
});

test.run();
