// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  allNamedEntities,
  allNamedEntitiesSetOnly,
  allNamedEntitiesSetOnlyCaseInsensitive,
  brokenNamedEntities,
  decode,
  entEndsWith,
  entEndsWithCaseInsensitive,
  entStartsWith,
  entStartsWithCaseInsensitive,
  maxLength,
  minLength,
  uncertain,
} from "../dist/all-named-html-entities.esm.js";

test("01 - entStartsWith is set", () => {
  equal(entStartsWith.A.E[0], "AElig", "01.01");
  equal(entStartsWith.A.E[1], undefined, "01.02");
});

test("02 - entStartsWithCaseInsensitive is set", () => {
  // Case-insensitive indexes store the lowercased spelling.
  equal(entStartsWithCaseInsensitive.a.e[0], "aelig", "02.01");
  equal(entStartsWithCaseInsensitive.a.e[1], undefined, "02.02");
});

test("03 - entEndsWith is set", () => {
  equal(entEndsWith["1"].p[0], "sup1", "03.01");
  equal(entEndsWith["1"].p[1], undefined, "03.02");
});

test("04 - entEndsWithCaseInsensitive is set", () => {
  equal(entEndsWithCaseInsensitive.u.m[0], "mu", "04.01");
  equal(entEndsWithCaseInsensitive.u.m[1], undefined, "04.02");
  equal(entEndsWithCaseInsensitive.U, undefined, "04.03");
});

test("05 - decode throws if a non-entity is given", () => {
  throws(() => decode("zzz"), /THROW_ID_01/, "05.01");
});

test("06 - decode existing", () => {
  equal(decode("&aleph;"), "\u2135", "06.01");
});

test("07 - decode non-existing", () => {
  equal(decode("&lsdjhfkhgjd;"), null, "07.01");
});

test("08 - decode numeric", () => {
  // &#x2135; is &aleph; only numeric version of it
  equal(decode("&#x2135;"), null, "08.01");
});

test("09 - brokenNamedEntities.json is OK", () => {
  type(brokenNamedEntities, "object", "09.01");
  ok(Object.keys(brokenNamedEntities).length, "09.02");
  for (const [broken, replacement] of Object.entries(brokenNamedEntities)) {
    ok(!Object.hasOwn(allNamedEntities, broken), `09.03 - ${broken}`);
    ok(Object.hasOwn(allNamedEntities, replacement), `09.04 - ${replacement}`);
  }
});

test("10 - minLength is numeric", () => {
  ok(Number.isInteger(minLength), "10.01");
  ok(minLength, "10.02");
});

test("11 - maxLength is numeric", () => {
  ok(Number.isInteger(maxLength), "11.01");
  ok(maxLength > 0, "11.02");
});

test("12 - allNamedEntities checks", () => {
  ok(Object.keys(allNamedEntities).length, "12.01");
});

test("13 - uncertain list is set", () => {
  ok(uncertain.Alpha, "13.01");
  ok(uncertain.alpha, "13.02");
  ok(uncertain.amp, "13.03");
  ok(uncertain.And, "13.04");
  ok(uncertain.and, "13.05");
});

test("14 - allNamedEntitiesSetOnly is exported and is a set", () => {
  type(allNamedEntitiesSetOnly, "object", "14.01");
  equal(allNamedEntitiesSetOnly.size, 2125, "14.02");
});

test("15 - allNamedEntitiesSetOnlyCaseInsensitive is exported and is a set", () => {
  type(allNamedEntitiesSetOnlyCaseInsensitive, "object", "15.01");
  equal(allNamedEntitiesSetOnlyCaseInsensitive.size, 1722, "15.02");
});

test("16 - every canonical name and value matches the audited WHATWG data", () => {
  // Audited 2026-09-05 against WHATWG entities.json, SHA-256
  // d741d877ac77c4194c4ad526b5b4a19aef8dfe411ab840a466891cdbb9f362e6.
  // Hash sorted name/value pairs: independent of the source JSON formatting.
  const entries = Object.entries(allNamedEntities).sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0,
  );
  equal(entries.length, 2125, "16.01");
  equal(
    createHash("sha256").update(JSON.stringify(entries)).digest("hex"),
    "083dc02ec806d6d630ad69cdcd3ebf4b3f04509f8ad00ad8772f8905d285beb4",
    "16.02",
  );
  for (const [name, value] of entries) {
    equal(decode(`&${name};`), value, `16.03 - ${name}`);
  }
});

test("17 - Sets preserve the canonical membership and insertion order", () => {
  const names = Object.keys(allNamedEntities);
  equal([...allNamedEntitiesSetOnly], names, "17.01");
  equal(
    [...allNamedEntitiesSetOnlyCaseInsensitive],
    [...new Set(names.map((name) => name.toLowerCase()))],
    "17.02",
  );
  equal(minLength, Math.min(...names.map((name) => name.length)), "17.03");
  equal(maxLength, Math.max(...names.map((name) => name.length)), "17.04");
});

test("18 - all four affix indexes contain exactly the expected ordered buckets", () => {
  const names = Object.keys(allNamedEntities);
  const lower = [...new Set(names.map((name) => name.toLowerCase()))];
  for (const [index, expected, end] of [
    [entStartsWith, names, false],
    [entEndsWith, names, true],
    [entStartsWithCaseInsensitive, lower, false],
    [entEndsWithCaseInsensitive, lower, true],
  ]) {
    const seen = [];
    for (const [first, buckets] of Object.entries(index)) {
      for (const [second, bucket] of Object.entries(buckets)) {
        equal(
          bucket,
          expected.filter((name) =>
            end
              ? name.endsWith(second + first)
              : name.startsWith(first + second),
          ),
          "18.01",
        );
        ok(bucket.length, "18.02");
        seen.push(...bucket);
      }
    }
    equal(seen.sort(), [...expected].sort(), "18.02");
  }
});

test("19 - uncertainty policies refer to canonical names and supported values", () => {
  const values = new Set([true, false, "edge only"]);
  for (const [name, policy] of Object.entries(uncertain)) {
    ok(Object.hasOwn(allNamedEntities, name), `19.01 - ${name}`);
    equal(
      Object.keys(policy).sort(),
      ["addAmpIfSemiPresent", "addSemiIfAmpPresent"],
      "19.01",
    );
    ok(
      Object.values(policy).every((value) => values.has(value)),
      "19.02",
    );
  }
});

test("20 - inherited names never decode", () => {
  for (const name of [
    "__proto__",
    "constructor",
    "toString",
    "hasOwnProperty",
  ]) {
    equal(decode(`&${name};`), null, "20.01");
  }
});

test("21 - malformed wrappers retain the validation error", () => {
  for (const value of ["", "amp", "&amp", "amp;", null, undefined, 1, {}]) {
    throws(
      () => decode(value),
      /all-named-html-entities\/decode\(\): \[THROW_ID_01\]/,
      "21.01",
    );
  }
  equal(decode("&;"), null, "21.01");
});

test("22 - the pinned official snapshot retains every scalar and legacy spelling", () => {
  const snapshot = readFileSync(
    new URL("../upstream/entities.json", import.meta.url),
    "utf8",
  );
  const provenance = JSON.parse(
    readFileSync(
      new URL("../upstream/provenance.json", import.meta.url),
      "utf8",
    ),
  );
  const rows = JSON.parse(snapshot);
  equal(
    createHash("sha256").update(snapshot).digest("hex"),
    provenance.sha256,
    "22.01",
  );
  equal(Object.keys(rows).length, 2231, "22.02");
  equal(
    Object.keys(rows).filter((name) => !name.endsWith(";")).length,
    106,
    "22.03",
  );
  for (const [name, row] of Object.entries(rows)) {
    equal(Object.keys(row).sort(), ["characters", "codepoints"], "22.04");
    equal(
      [...row.characters].map((char) => char.codePointAt(0)),
      row.codepoints,
      "22.05",
    );
    equal(
      allNamedEntities[name.slice(1).replace(/;$/, "")],
      row.characters,
      "22.06",
    );
    if (!name.endsWith(";")) {
      equal(rows[`${name};`], row, "22.07");
      throws(() => decode(name), /THROW_ID_01/, "22.08");
    }
  }
});

test("23 - the pinned source license and original public order are retained", () => {
  const read = (name) =>
    readFileSync(new URL(`../upstream/${name}`, import.meta.url), "utf8");
  const provenance = JSON.parse(read("provenance.json"));
  equal(
    createHash("sha256").update(read("WHATWG-LICENSE")).digest("hex"),
    provenance.licenseSha256,
    "23.01",
  );
  equal(
    Object.keys(allNamedEntities),
    JSON.parse(read("public-name-order.json")),
    "23.02",
  );
  equal(Object.keys(brokenNamedEntities).length, 34, "23.03");
  equal(Object.keys(uncertain).length, 348, "23.04");
});

test.run();
