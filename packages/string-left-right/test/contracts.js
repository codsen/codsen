import { execFileSync } from "node:child_process";
import { test } from "uvu";
import { equal, ok, throws } from "uvu/assert";
import * as api from "../dist/string-left-right.esm.js";

test("01 - required terms stay required after hungry matching", () => {
  equal(api.rightSeq("abbbd", 0, "b*", "c", "d"), null, "01.01");
  equal(api.leftSeq("dbbba", 4, "d", "c", "b*"), null, "01.02");
  equal(api.chompRight("abbbd", 0, "b*", "c", "d"), null, "01.03");
  equal(api.chompLeft("dbbba", 4, "d", "c", "b*"), null, "01.04");
  equal(api.rightSeq("abb", 0, "b*", "b"), null, "01.05");
  equal(api.leftSeq("bba", 2, "b", "b*"), null, "01.06");
  equal(
    api.leftSeq("c B B a", 6, { i: true }, "c", "b?*"),
    {
      gaps: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
      leftmostChar: 0,
      rightmostChar: 4,
    },
    "01.07",
  );
});

test("02 - unsupported matchers never create a partial match", () => {
  for (let invalid of [null, undefined, false, 0, /b/, [], {}, Symbol("b")]) {
    equal(
      [
        api.rightSeq("xab", 0, "a", invalid, "b"),
        api.leftSeq("abx", 2, "a", invalid, "b"),
        api.chompRight("xab", 0, "a", invalid, "b"),
        api.chompLeft("abx", 2, "a", invalid, "b"),
      ],
      [null, null, null, null],
      "02.01",
    );
  }
  equal(api.rightSeq("ab", 0, /x/, "b"), null, "02.02");
  equal(api.chompRight("ab", 0, /x/, "b"), null, "02.03");
  equal(api.chompLeft("ba", 1, false, "b"), null, "02.04");
  equal(api.rightSeq("ab", 0, { i: "yes" }, "b"), null, "02.05");
  equal(api.leftSeq("ba", 1, { i: null }, "b"), null, "02.06");
  equal(api.chompRight("ab", 0, "", "b"), 2, "02.07");
  equal(api.chompLeft("ba", 1, "b", ""), 0, "02.08");
  equal(api.chompRight("ab", 0, {}), null, "02.09");
  equal(api.rightSeq("ab", 0, {}), null, "02.10");
});

test("03 - mode validation handles falsy and hostile values", () => {
  for (let mode of [
    false,
    true,
    NaN,
    0n,
    1n,
    Symbol("mode"),
    -1,
    4,
    0.5,
    Infinity,
    -Infinity,
    "01",
    " 1",
    "false",
    {},
    [],
    () => 0,
    {
      toString() {
        throw new Error("must not coerce");
      },
    },
    Object.create(null),
  ]) {
    throws(
      () => api.chompLeft("ba", 1, { mode }, "b"),
      /string-left-right\/chompLeft\(\): \[THROW_ID_03\]/,
    );
    throws(
      () => api.chompRight("ab", 0, { mode }, "b"),
      /string-left-right\/chompRight\(\): \[THROW_ID_04\]/,
    );
  }
  for (let mode of [undefined, null, "", 0, "0", -0]) {
    equal(api.chompRight("ab  x", 0, { mode }, "b"), 3, "03.01");
    equal(api.chompLeft("x  ba", 4, { mode }, "b"), 2, "03.02");
  }
});

test("04 - dangerous indexes complete within an isolated process timeout", () => {
  let moduleUrl = new URL("../dist/string-left-right.esm.js", import.meta.url)
    .href;
  for (let expression of [
    "Infinity",
    "-Infinity",
    "NaN",
    "1.5",
    "Number.MAX_VALUE",
    "2 ** 31",
    "2 ** 32 + 1",
  ]) {
    let output = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `
      import * as api from ${JSON.stringify(moduleUrl)};
      const idx = ${expression};
      const leftNames = ["left", "leftStopAtNewLines", "leftStopAtRawNbsp", "leftSeq", "chompLeft"];
      const rightNames = ["right", "rightStopAtNewLines", "rightStopAtRawNbsp", "rightSeq", "chompRight"];
      console.log(JSON.stringify([...leftNames, ...rightNames].map(name => api[name]("abc", idx, "c"))));
    `,
      ],
      { timeout: 2000, encoding: "utf8" },
    );
    let valid = ["Number.MAX_VALUE", "2 ** 31", "2 ** 32 + 1"].includes(
      expression,
    );
    equal(
      JSON.parse(output),
      valid
        ? [
            2,
            2,
            2,
            { gaps: [], leftmostChar: 2, rightmostChar: 2 },
            2,
            null,
            null,
            null,
            null,
            null,
          ]
        : Array(10).fill(null),
      "04.01",
    );
  }
});

test("05 - all index boundaries follow the same numeric policy", () => {
  for (let [lookup, direction] of [
    [api.left, "left"],
    [api.leftStopAtNewLines, "left"],
    [api.leftStopAtRawNbsp, "left"],
    [api.right, "right"],
    [api.rightStopAtNewLines, "right"],
    [api.rightStopAtRawNbsp, "right"],
  ]) {
    let expected =
      direction === "left"
        ? [null, null, null, null, 0, 2, 2]
        : [1, 1, 1, 0, 2, null, null];
    equal(
      [undefined, null, 0, -1, 1, 3, 4].map((idx) => lookup("abc", idx)),
      expected,
      "05.01",
    );
    equal(
      [false, "1", 0n, {}, NaN, Infinity, -Infinity, 1.5, -1.5, -2].map((idx) =>
        lookup("abc", idx),
      ),
      Array(10).fill(null),
      "05.02",
    );
  }
  equal(
    api.rightSeq("ab", -1, "a", "b"),
    { gaps: [], leftmostChar: 0, rightmostChar: 1 },
    "05.03",
  );
  equal(api.chompRight("ab", -1, "a", "b"), 2, "05.04");
  equal(api.chompLeft("ab", 2, "a", "b"), 0, "05.05");
});

test("06 - Unicode values and offsets are UTF-16 code units", () => {
  equal(
    api.rightSeq("xéz", 0, "é"),
    { gaps: [], leftmostChar: 1, rightmostChar: 1 },
    "06.01",
  );
  equal(api.rightSeq("x😀z", 0, "😀"), null, "06.02");
  equal(api.leftSeq("x😀z", 3, "😀"), null, "06.03");
  equal([api.right("x😀z", 0), api.left("x😀z", 3)], [1, 2], "06.04");
  equal(
    api.rightSeq("x😀z", 0, "\ud83d", "\ude00"),
    { gaps: [], leftmostChar: 1, rightmostChar: 2 },
    "06.05",
  );
  equal(
    api.leftSeq("x😀z", 3, "\ud83d", "\ude00"),
    { gaps: [], leftmostChar: 1, rightmostChar: 2 },
    "06.06",
  );
  equal(
    api.rightSeq("xe\u0301z", 0, "e", "\u0301"),
    { gaps: [], leftmostChar: 1, rightmostChar: 2 },
    "06.07",
  );
  equal(api.rightSeq("xe\u0301z", 0, "é"), null, "06.08");
  equal(
    api.rightSeq("x\ud800z", 0, "\ud800"),
    { gaps: [], leftmostChar: 1, rightmostChar: 1 },
    "06.09",
  );
  equal(api.chompLeft("x\udc00z", 2, "\udc00"), 1, "06.10");
  equal(
    api.rightSeq("xİz", 0, { i: true }, "İ"),
    { gaps: [], leftmostChar: 1, rightmostChar: 1 },
    "06.11",
  );
});

test("07 - thousands of leftward gaps retain ascending source order", () => {
  let count = 2048;
  let source = "a ".repeat(count);
  let matchers = Array(count).fill("a");
  equal(
    api.leftSeq(source, source.length, ...matchers),
    {
      gaps: Array.from({ length: count }, (_, i) => [i * 2 + 1, i * 2 + 2]),
      leftmostChar: 0,
      rightmostChar: source.length - 2,
    },
    "07.01",
  );
  equal(matchers, Array(count).fill("a"), "07.02");
});

test("08 - optional mismatches share one gap traversal", () => {
  let source = `x${" ".repeat(2048)}a`;
  let count = 0;
  let charCodeAt = String.prototype.charCodeAt;
  let result;
  try {
    String.prototype.charCodeAt = function (idx) {
      count++;
      return charCodeAt.call(this, idx);
    };
    result = api.rightSeq(source, 0, ...Array(100).fill("z?"), "a");
  } finally {
    String.prototype.charCodeAt = charCodeAt;
  }
  equal(
    result,
    { gaps: [[1, 2049]], leftmostChar: 2049, rightmostChar: 2049 },
    "08.01",
  );
  ok(count <= source.length + 2, "one scan across the gap");
});

test("09 - a final ordinary term never scans the unused remainder", () => {
  let visited = [];
  let charCodeAt = String.prototype.charCodeAt;
  try {
    String.prototype.charCodeAt = function (idx) {
      visited.push(idx);
      return charCodeAt.call(this, idx);
    };
    api.rightSeq(`xa${" ".repeat(4096)}`, 0, "a");
  } finally {
    String.prototype.charCodeAt = charCodeAt;
  }
  ok(visited.length <= 2, "no traversal beyond the matched code unit");
});

test("10 - chomp tail modes use the last complete sequence", () => {
  equal(
    [0, 1, 2, 3].map((mode) =>
      api.chompRight("xab  a \n x", 0, { mode }, "a", "b"),
    ),
    [4, 3, 5, 5],
    "10.01",
  );
  equal(
    [0, 1, 2, 3].map((mode) =>
      api.chompLeft("x \n b  abx", 9, { mode }, "a", "b"),
    ),
    [6, 7, 5, 5],
    "10.02",
  );
  equal(
    [0, 1, 2, 3].map((mode) =>
      api.chompRight("xbbb  \r\n z", 0, { mode }, "b*"),
    ),
    [6, 4, 6, 9],
    "10.03",
  );
  equal(
    [0, 1, 2, 3].map((mode) =>
      api.chompLeft("z \r\n  bbbx", 9, { mode }, "b*"),
    ),
    [4, 6, 4, 1],
    "10.04",
  );
});

test("11 - chomp modes reuse the repetition check's tail scan", () => {
  let charCodeAt = String.prototype.charCodeAt;
  for (let mode of [0, 1, 2, 3]) {
    let count = 0;
    let source = `xb${" ".repeat(4096)}z`;
    try {
      String.prototype.charCodeAt = function (idx) {
        count++;
        return charCodeAt.call(this, idx);
      };
      api.chompRight(source, 0, { mode }, "b");
    } finally {
      String.prototype.charCodeAt = charCodeAt;
    }
    ok(count <= source.length + 2, `mode ${mode} scans the tail once`);
  }
});

test.run();
