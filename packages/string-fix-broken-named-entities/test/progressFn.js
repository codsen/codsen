// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { fixEnt as fix } from "../dist/string-fix-broken-named-entities.esm.js";

test(`01 - opts.progressFn - reports progress - baseline`, () => {
  equal(
    fix(
      "text &ang text&ang text text &ang text&ang text text &ang text&ang text",
    ),
    [
      [5, 9, "&ang;"],
      [14, 18, "&ang;"],
      [29, 33, "&ang;"],
      [38, 42, "&ang;"],
      [53, 57, "&ang;"],
      [62, 66, "&ang;"],
    ],
    "01.01",
  );

  let count = 0;
  equal(
    fix(
      "text &ang text&ang text text &ang text&ang text text &ang text&ang text",
      {
        progressFn: (percentageDone) => {
          // console.log(`percentageDone = ${percentageDone}`);
          ok(typeof percentageDone === "number");
          count += 1;
        },
      },
    ),
    [
      [5, 9, "&ang;"],
      [14, 18, "&ang;"],
      [29, 33, "&ang;"],
      [38, 42, "&ang;"],
      [53, 57, "&ang;"],
      [62, 66, "&ang;"],
    ],
    "01.02",
  );
  ok(typeof count === "number" && count <= 101 && count > 0, "01.03");
});

test("02 - every scanner path reaches completion without changing results", () => {
  for (const input of [
    "",
    "plain text",
    "&nbsp;",
    "&nbsp;".repeat(100),
    "& not;",
    "&zzzzzzzzzz;",
    "&#xzz;",
    "&amp;nbsp;",
    "&amp;n b s p;",
  ]) {
    for (const decode of [false, true]) {
      const progress = [];
      equal(
        fix(input, { decode, progressFn: (value) => progress.push(value) }),
        fix(input, { decode }),
        "02.01",
      );
      equal(progress[0], 0, "02.02");
      equal(progress[progress.length - 1], 100, "02.03");
      ok(
        progress.every(
          (value, i) =>
            Number.isInteger(value) &&
            value >= 0 &&
            value <= 100 &&
            (i === 0 || value > progress[i - 1]),
        ),
        "02.04",
      );
    }
  }
});

test("03 - completion follows range cleanup and result callbacks", () => {
  const events = [];
  const result = fix("&nbsp; &amp;", {
    decode: true,
    cb: (obj) => {
      events.push(obj.entityName);
      return [obj.rangeFrom, obj.rangeTo, obj.rangeValDecoded];
    },
    progressFn: (value) => {
      if (value === 100) {
        events.push("complete");
      }
    },
  });
  equal(
    result,
    [
      [0, 6, "\u00A0"],
      [7, 12, "&"],
    ],
    "03.01",
  );
  equal(events, ["nbsp", "amp", "complete"], "03.02");

  const progress = [];
  const raw = fix("&nbsq;", {
    cb: null,
    progressFn: (value) => progress.push(value),
  });
  equal(raw, fix("&nbsq;", { cb: null }), "03.03");
  equal(progress[progress.length - 1], 100, "03.04");
});

test("04 - accepted falsy progress options remain disabled", () => {
  for (const progressFn of [undefined, null, false, 0, "", NaN]) {
    equal(fix("", { progressFn }), [], "04.01");
    equal(fix("&nbsq;", { progressFn }), [[0, 6, "&nbsp;"]], "04.02");
  }
});

test.run();
