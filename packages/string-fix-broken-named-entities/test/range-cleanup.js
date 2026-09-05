import { test } from "uvu";
import { equal } from "uvu/assert";
import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

test("01 - many disjoint ranges retain their order and metadata", () => {
  const input = "&nbsp;".repeat(1000);
  const expected = Array.from({ length: 1000 }, (_, i) => [
    i * 6,
    i * 6 + 6,
    "\u00A0",
  ]);
  equal(fixEnt(input, { decode: true }), expected, "01.01");
  const events = [];
  const mapped = fixEnt(input, {
    decode: true,
    cb: (obj) => {
      events.push(obj);
      return [obj.rangeFrom, obj.rangeTo, obj.rangeValDecoded];
    },
  });
  equal(mapped, expected, "01.02");
  equal(events.length, 1000, "01.03");
  equal(
    events.map((obj) => obj.entityName),
    Array(1000).fill("nbsp"),
    "01.04",
  );
});

test("02 - adjacent repairs and decoded entities retain scanner order", () => {
  equal(
    fixEnt("&nbsp;nbsp; &nbsq;", { decode: true }),
    [
      [0, 6, "\u00A0"],
      [6, 11, "\u00A0"],
      [12, 18, "\u00A0"],
    ],
    "02.01",
  );
  equal(fixEnt("&&nbsp;", { decode: true }), [[1, 7, "\u00A0"]], "02.02");
});

test.run();
