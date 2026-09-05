// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { readFileSync } from "node:fs";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  notEmailFriendly,
  notEmailFriendlyLowercaseSetOnly,
  notEmailFriendlyMaxLength,
  notEmailFriendlyMinLength,
  notEmailFriendlySetOnly,
} from "../dist/html-entities-not-email-friendly.esm.js";

test("01 - notEmailFriendly is set", () => {
  ok(notEmailFriendly.Abreve === "#x102", "01.01");
});

test("02 - notEmailFriendlySetOnly is set", () => {
  ok(notEmailFriendlySetOnly.size > 0, "02.01");
});

test("03 - notEmailFriendlyLowercaseSetOnly is set", () => {
  ok(notEmailFriendlyLowercaseSetOnly.size > 0, "03.01");
});

test("04 - notEmailFriendlyMinLength is set", () => {
  ok(notEmailFriendlyMinLength > 0, "04.01");
});

test("05 - notEmailFriendlyMaxLength is set", () => {
  ok(notEmailFriendlyMaxLength > 0, "05.01");
});

test("06 - every wrapped replacement has exactly the canonical Unicode value", () => {
  const official = JSON.parse(
    readFileSync(
      new URL(
        "../../all-named-html-entities/upstream/entities.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  equal(Object.keys(notEmailFriendly).length, 1841, "06.01");
  for (const [name, payload] of Object.entries(notEmailFriendly)) {
    const reference = `&${payload};`;
    let decoded = "";
    let consumed = 0;
    // Independent bounded parser for this data product's generated grammar.
    // It does not use the codec or the generator to establish expected values.
    for (const token of reference.matchAll(
      /&(?:#x([0-9A-F]+)|([A-Za-z][A-Za-z0-9]*));/g,
    )) {
      equal(token.index, consumed, "06.02");
      consumed += token[0].length;
      decoded += token[1]
        ? String.fromCodePoint(Number.parseInt(token[1], 16))
        : official[`&${token[2]};`].characters;
    }
    equal(consumed, reference.length, "06.03");
    equal(decoded, official[`&${name};`].characters, "06.04");
  }
});

test("07 - corrected multi-code-point and punctuation payloads retain the wrapping contract", () => {
  equal(notEmailFriendly.bne, "#x3D;&#x20E5", "07.01");
  equal(notEmailFriendly.lbrace, "#x7B", "07.02");
  equal(notEmailFriendly.lbrack, "#x5B", "07.03");
  equal(notEmailFriendly.lcub, "#x7B", "07.04");
});

test("08 - derived collections preserve complete membership, ordering and length bounds", () => {
  const names = JSON.parse(
    readFileSync(new URL("../policy/names.json", import.meta.url), "utf8"),
  );
  equal(Object.keys(notEmailFriendly), names, "08.01");
  equal([...notEmailFriendlySetOnly], names, "08.02");
  equal(
    [...notEmailFriendlyLowercaseSetOnly],
    [...new Set(names.map((name) => name.toLowerCase()))].sort(),
    "08.03",
  );
  equal(notEmailFriendlyLowercaseSetOnly.size, 1534, "08.04");
  equal(
    notEmailFriendlyMinLength,
    Math.min(...names.map((name) => name.length)),
    "08.05",
  );
  equal(
    notEmailFriendlyMaxLength,
    Math.max(...names.map((name) => name.length)),
    "08.06",
  );
});

test("09 - generated JSON is the public mapping and preferred aliases retain their spelling", () => {
  const source = JSON.parse(
    readFileSync(
      new URL("../src/notEmailFriendly.json", import.meta.url),
      "utf8",
    ),
  );
  const aliases = JSON.parse(
    readFileSync(
      new URL("../policy/named-replacements.json", import.meta.url),
      "utf8",
    ),
  );
  equal(notEmailFriendly, source, "09.01");
  for (const [name, payload] of Object.entries(aliases)) {
    equal(notEmailFriendly[name], payload, "09.02");
  }
});

test.run();
