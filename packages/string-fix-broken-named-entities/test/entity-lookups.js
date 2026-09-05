import { test } from "uvu";
import { equal } from "uvu/assert";
import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

test("01 - casing repair preserves ambiguous names and their decoded values", () => {
  equal(fixEnt("&NBsP;"), [[0, 6, "&nbsp;"]], "01.01");
  equal(fixEnt("&NBsP;", { decode: true }), [[0, 6, "\u00a0"]], "01.02");
  for (const input of ["&aMp;", "&IOta;"]) {
    equal(fixEnt(input), [[0, input.length]], "01.03");
    equal(fixEnt(input, { decode: true }), [[0, input.length]], "01.04");
  }
  equal(
    fixEnt("&gt; &Gt; &GT;", { decode: true }),
    [
      [0, 4, ">"],
      [5, 9, "≫"],
      [10, 14, ">"],
    ],
    "01.05",
  );
});

test("02 - typo matching preserves ties, block omissions, and length boundaries", () => {
  for (const [input, expected] of [
    ["&rsqo;", "&rsquo;"],
    ["&CounterClockwiseContourIntegra;", "&CounterClockwiseContourIntegral;"],
    ["&CounterClockwiseContourIntegr;", "&CounterClockwiseContourIntegral;"],
  ]) {
    equal(fixEnt(input), [[0, input.length, expected]], "02.01");
  }
  for (const input of [
    "&zz;",
    "&constructor;",
    "&CounterClockwiseContourIntegralzz;",
  ]) {
    equal(fixEnt(input), [[0, input.length]], "02.02");
  }
});

test("03 - prose uncertainty policies retain their casing distinctions", () => {
  for (const [input, expected] of [
    ["&Maple", [[0, 4, "&Map;"]]],
    ["&maple", []],
    ["Map;", [[0, 4, "&Map;"]]],
    ["map;", []],
    ["Iota;", [[0, 5, "&Iota;"]]],
    ["iota;", []],
  ]) {
    equal(fixEnt(input), expected, "03.01");
  }
});

test("04 - casing lookup reports both encoded and decoded values to callbacks", () => {
  const events = [];
  fixEnt("&NBsP;", { cb: (event) => events.push(event) });
  equal(
    events,
    [
      {
        ruleName: "bad-html-entity-malformed-nbsp",
        entityName: "nbsp",
        rangeFrom: 0,
        rangeTo: 6,
        rangeValEncoded: "&nbsp;",
        rangeValDecoded: "\u00a0",
      },
    ],
    "04.01",
  );
});

test.run();
