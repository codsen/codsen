import { test } from "uvu";
import { equal } from "uvu/assert";
import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

test("01 - contiguous block omissions use the original document offsets", () => {
  const input = "x &CounterClockwiseContIntegral; y";
  const events = [];
  const caught = [];
  fixEnt(input, {
    cb: (event) => events.push(event),
    entityCatcherCb: (from, to) => caught.push([from, to]),
  });
  equal(fixEnt(input), [[2, 32, "&CounterClockwiseContourIntegral;"]], "01.01");
  equal(
    events,
    [
      {
        ruleName: "bad-html-entity-malformed-CounterClockwiseContourIntegral",
        entityName: "CounterClockwiseContourIntegral",
        rangeFrom: 2,
        rangeTo: 32,
        rangeValEncoded: "&CounterClockwiseContourIntegral;",
        rangeValDecoded: "∳",
      },
    ],
    "01.02",
  );
  equal(caught, [], "01.03");
  equal(fixEnt(input, { decode: true }), [[2, 32, "∳"]], "01.04");
});

test("02 - surrounding prose cannot break a typo candidate tie", () => {
  for (const prefix of ["", "b ", "u ", "rsqb rsquo "]) {
    const input = `${prefix}&rsqo;`;
    equal(fixEnt(input), [[prefix.length, input.length, "&rsquo;"]], "02.01");
  }
});

test("03 - ambiguous and absent suggestions retain unrecognised diagnostics", () => {
  for (const input of [
    "&arr;",
    "&azp;",
    "&iint;",
    "&fzr;",
    "&succeqq;",
    "&bus;",
    "&tme;",
    "&uon;",
    "&dma;",
    "&constructor;",
    "&CounterContourIntegral;",
  ]) {
    const events = [];
    fixEnt(input, { cb: (event) => events.push(event) });
    equal(fixEnt(input), [[0, input.length]], "03.01");
    equal(
      events,
      [
        {
          ruleName: "bad-html-entity-unrecognised",
          entityName: null,
          rangeFrom: 0,
          rangeTo: input.length,
          rangeValEncoded: null,
          rangeValDecoded: null,
        },
      ],
      "03.02",
    );
  }
});

test("04 - curated exceptions and exact valid names precede typo inference", () => {
  equal(fixEnt("&nsp;"), [[0, 5, "&nbsp;"]], "04.01");
  equal(fixEnt("&not;"), [], "04.02");
  equal(fixEnt("&not;", { decode: true }), [[0, 5, "¬"]], "04.03");
});

test.run();
