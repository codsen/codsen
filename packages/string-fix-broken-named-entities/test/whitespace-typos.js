import { test } from "uvu";
import { equal } from "uvu/assert";
import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

test("01 - whitespace does not consume the typo budget", () => {
  for (const name of [
    "nbsq",
    " nbsq",
    "nbsq ",
    "nbsq  ",
    "nbsq\t",
    "nbsq\n",
    "n b s q",
    "n\tb\ns q",
  ]) {
    for (const prefix of ["", "b ", "&amp; "]) {
      const input = `${prefix}&${name}; suffix`;
      const from = prefix.length;
      const to = from + name.length + 2;
      equal(fixEnt(input), [[from, to, "&nbsp;"]], "01.01");
      equal(
        fixEnt(input, { decode: true }),
        [...(prefix === "&amp; " ? [[0, 5, "&"]] : []), [from, to, "\u00A0"]],
        "01.02",
      );
      const caught = [];
      equal(
        fixEnt(input, {
          cb: (obj) => obj,
          entityCatcherCb: (start, end) => caught.push([start, end]),
        }),
        [
          {
            ruleName: "bad-html-entity-malformed-nbsp",
            entityName: "nbsp",
            rangeFrom: from,
            rangeTo: to,
            rangeValEncoded: "&nbsp;",
            rangeValDecoded: "\u00A0",
          },
        ],
        "01.03",
      );
      equal(caught, prefix === "&amp; " ? [[0, 5]] : [], "01.04");
    }
  }
});

test("02 - curated repairs and ambiguity survive whitespace normalization", () => {
  equal(fixEnt("&r s q o ;"), [[0, 10, "&rsquo;"]], "02.01");
  for (const input of [
    "&a z p;",
    "&s q r;",
    "&twoheXXrightarrow ;",
    `&${"z".repeat(40)} ;`,
  ]) {
    for (const decode of [false, true]) {
      equal(fixEnt(input, { decode }), [[0, input.length]], "02.02");
      equal(
        fixEnt(input, { decode, cb: (obj) => obj }),
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
        "02.03",
      );
    }
  }
});

test("03 - prose and uncertain exact names keep their existing boundaries", () => {
  for (const input of ["one pound;", "n b s q;", "A & B;", "& not;"]) {
    equal(fixEnt(input), [], "03.01");
    equal(fixEnt(input, { decode: true }), [], "03.02");
  }
});

test.run();
