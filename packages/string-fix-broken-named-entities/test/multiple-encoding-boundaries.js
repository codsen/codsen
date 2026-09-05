import {
  allNamedEntities,
  allNamedEntitiesSetOnly,
} from "all-named-html-entities";
import { test } from "uvu";
import { equal } from "uvu/assert";

import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

const names = [...allNamedEntitiesSetOnly];

function apply(input, ranges) {
  return ranges.reduceRight(
    (result, [from, to, replacement = ""]) =>
      result.slice(0, from) + replacement + result.slice(to),
    input,
  );
}

function diagnostic(name, from, to) {
  return {
    ruleName: "bad-html-entity-multiple-encoding",
    entityName: name,
    rangeFrom: from,
    rangeTo: to,
    rangeValEncoded: `&${name};`,
    rangeValDecoded: allNamedEntities[name],
  };
}

test("01 - every catalogue name survives double encoding", () => {
  equal(
    names.map((name) => fixEnt(`&amp;${name};`)),
    names.map((name) => [[0, name.length + 6, `&${name};`]]),
    "01.01",
  );
  equal(
    names.map((name) => fixEnt(`&amp;${name};`, { decode: true })),
    names.map((name) => [[0, name.length + 6, allNamedEntities[name]]]),
    "01.02",
  );
});

test("02 - every catalogue name survives triple encoding", () => {
  equal(
    names.map((name) => fixEnt(`&amp;amp;${name};`)),
    names.map((name) => [[0, name.length + 10, `&${name};`]]),
    "02.01",
  );
  equal(
    names.map((name) => fixEnt(`&amp;amp;${name};`, { decode: true })),
    names.map((name) => [[0, name.length + 10, allNamedEntities[name]]]),
    "02.02",
  );
});

test("03 - gaps and shared prefixes use the complete consumed span", () => {
  const fixtures = [
    ["&amp;notin;", "notin"],
    ["&amp;not in;", "notin"],
    ["&amp;n b s p;", "nbsp"],
    ["&amp;nbsp ;", "nbsp"],
    ["&amp;n\tb\ns\rp\t;", "nbsp"],
    ["& a m p ; n b s p ;", "nbsp"],
    ["&amp; a m p ; a m p ;", "amp"],
  ];
  equal(
    fixtures.map(([input]) => fixEnt(input)),
    fixtures.map(([input, name]) => [[0, input.length, `&${name};`]]),
    "03.01",
  );
  equal(
    fixtures.map(([input]) => fixEnt(input, { decode: true })),
    fixtures.map(([input, name]) => [
      [0, input.length, allNamedEntities[name]],
    ]),
    "03.02",
  );
  equal(
    fixtures.map(([input]) => fixEnt(input, { cb: null })),
    fixtures.map(([input, name]) => [diagnostic(name, 0, input.length)]),
    "03.03",
  );
});

test("04 - missing semicolons preserve following markup and prose", () => {
  const suffixes = ["", "<b>x</b>", " text", "\t", "!prose"];
  equal(
    suffixes.map((suffix) => fixEnt(`&amp;nbsp${suffix}`)),
    suffixes.map(() => [[0, 9, "&nbsp;"]]),
    "04.01",
  );
  equal(
    suffixes.map((suffix) => {
      const input = `&amp;nbsp${suffix}`;
      return apply(input, fixEnt(input));
    }),
    suffixes.map((suffix) => `&nbsp;${suffix}`),
    "04.02",
  );
  equal(
    suffixes.map((suffix) => {
      const input = `&amp;nbsp${suffix}`;
      return apply(input, fixEnt(input, { decode: true }));
    }),
    suffixes.map((suffix) => `\xA0${suffix}`),
    "04.03",
  );
});

test("05 - a longer unknown name is not consumed as a known prefix", () => {
  const fixtures = ["&amp;nbspx", "&amp;nbspx;", "&amp;notinX;"];
  equal(
    fixtures.map((input) => fixEnt(input)),
    fixtures.map(() => []),
    "05.01",
  );
  equal(
    fixtures.map((input) => apply(input, fixEnt(input, { decode: true }))),
    ["&nbspx", "&nbspx;", "&notinX;"],
    "05.02",
  );
});

test("06 - missing opening ampersands work at every prefix boundary", () => {
  const prefixes = ["", "x", "x ", "xy", "xy ", " ", " \t"];
  equal(
    prefixes.map((prefix) => fixEnt(`${prefix}amp;nbsp; tail`)),
    prefixes.map((prefix) => [[prefix.length, prefix.length + 9, "&nbsp;"]]),
    "06.01",
  );
  equal(
    prefixes.map((prefix) => {
      const input = `${prefix}amp;nbsp; tail`;
      return apply(input, fixEnt(input, { decode: true }));
    }),
    prefixes.map((prefix) => `${prefix}\xA0 tail`),
    "06.02",
  );
  equal(
    prefixes.map((prefix) => fixEnt(`${prefix}amp;nbsp; tail`, { cb: null })),
    prefixes.map((prefix) => [
      diagnostic("nbsp", prefix.length, prefix.length + 9),
    ]),
    "06.03",
  );
});

test("07 - custom and null callbacks expose identical diagnostics", () => {
  const fixtures = [
    ["textamp;nbsp;text", 4, 13],
    ["amp;nbsp;", 0, 9],
    ["xamp;nbsp;", 1, 10],
    ["&amp;nbsp;", 0, 10],
  ];
  const options = [
    { cb: null },
    { cb: null, decode: true },
    { cb: (value) => value },
    { cb: (value) => value, decode: true },
  ];
  equal(
    fixtures.map(([input]) => options.map((opts) => fixEnt(input, opts))),
    fixtures.map(([, from, to]) =>
      options.map(() => [diagnostic("nbsp", from, to)]),
    ),
    "07.01",
  );
});

test("08 - repaired spans leave subsequent entities and text ampersands visible", () => {
  const input = "&amp;notin;&copy; A&B";
  const entities = [];
  const ampersands = [];
  const callbacks = [];
  equal(
    fixEnt(input, {
      cb: (value) => {
        callbacks.push(value);
        return [value.rangeFrom, value.rangeTo, value.rangeValEncoded];
      },
      entityCatcherCb: (...range) => entities.push(range),
      textAmpersandCatcherCb: (index) => ampersands.push(index),
    }),
    [[0, 11, "&notin;"]],
    "08.01",
  );
  equal(callbacks, [diagnostic("notin", 0, 11)], "08.02");
  equal(entities, [[11, 17]], "08.03");
  equal(ampersands, [19], "08.04");
  const rawAmpersands = [];
  equal(
    fixEnt("A&B textamp;nbsp;text", {
      cb: null,
      textAmpersandCatcherCb: (index) => rawAmpersands.push(index),
    }),
    [diagnostic("nbsp", 8, 17)],
    "08.05",
  );
  equal(rawAmpersands, [1], "08.06");
});

test("09 - ampersand-only chains preserve adjacent markup and prose", () => {
  const fixtures = [
    ["&amp;amp;", 9, ""],
    ["&amp;amp;amp;<b>x</b>", 13, "<b>x</b>"],
    ["&amp;amp;random text", 9, "random text"],
    ["amp;amp; tail", 8, " tail"],
  ];
  equal(
    fixtures.map(([input]) => fixEnt(input)),
    fixtures.map(([, to]) => [[0, to, "&amp;"]]),
    "09.01",
  );
  equal(
    fixtures.map(([input]) => apply(input, fixEnt(input, { decode: true }))),
    fixtures.map(([, , suffix]) => `&${suffix}`),
    "09.02",
  );
});

test("10 - consecutive repairs reset scanning at each actual endpoint", () => {
  const input = "&amp;notin;&amp;n b s p;&amp;amp;";
  equal(
    fixEnt(input),
    [
      [0, 11, "&notin;"],
      [11, 24, "&nbsp;"],
      [24, 33, "&amp;"],
    ],
    "10.01",
  );
  equal(apply(input, fixEnt(input, { decode: true })), "∉\xA0&", "10.02");
});

test.run();
