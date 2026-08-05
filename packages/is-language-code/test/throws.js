import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import { parseRegistry } from "../reference/parseRegistry.js";

test("01 - registry records contain exactly one Type field", () => {
  throws(
    () =>
      parseRegistry(`Type: language
Type: region
Subtag: aa`),
    /is-language-code\/parseRegistry\(\): \[THROW_ID_01\]/,
    "01.01",
  );
});

test("02 - registry record types are supported", () => {
  throws(
    () =>
      parseRegistry(`Type: bogus
Subtag: aa`),
    /is-language-code\/parseRegistry\(\): \[THROW_ID_02\]/,
    "02.01",
  );
});

test("03 - registry records contain the correct value field", () => {
  throws(
    () =>
      parseRegistry(`Type: language
Description: missing Subtag`),
    /is-language-code\/parseRegistry\(\): \[THROW_ID_03\]/,
    "03.01",
  );
});

test("04 - ranged registry values have valid syntax", () => {
  throws(
    () =>
      parseRegistry(`Type: language
Subtag: qaa..q1`),
    /is-language-code\/parseRegistry\(\): \[THROW_ID_04\]/,
    "04.01",
  );
  throws(
    () =>
      parseRegistry(`Type: language
Subtag: qaa..qt`),
    /is-language-code\/parseRegistry\(\): \[THROW_ID_04\]/,
    "04.02",
  );
});

test("05 - ranged registry values are ascending", () => {
  throws(
    () =>
      parseRegistry(`Type: language
Subtag: qtz..qaa`),
    /is-language-code\/parseRegistry\(\): \[THROW_ID_05\]/,
    "05.01",
  );
});

test("06 - ranged registry values are unique", () => {
  throws(
    () =>
      parseRegistry(`Type: language
Subtag: qaa..qtz
%%
Type: language
Subtag: qaa..qtz`),
    /is-language-code\/parseRegistry\(\): \[THROW_ID_06\]/,
    "06.01",
  );
});

test("07 - ordinary registry values are unique", () => {
  throws(
    () =>
      parseRegistry(`Type: language
Subtag: aa
%%
Type: language
Subtag: aa`),
    /is-language-code\/parseRegistry\(\): \[THROW_ID_07\]/,
    "07.01",
  );
});

test("08 - extlang values contain exactly one Prefix field", () => {
  throws(
    () =>
      parseRegistry(`Type: extlang
Subtag: aao`),
    /is-language-code\/parseRegistry\(\): \[THROW_ID_08\]/,
    "08.01",
  );
});

test("09 - valid registry records are normalised and sorted", () => {
  equal(
    parseRegistry(`File-Date: 2026-01-01
%%
Type: script
Subtag: qaaa..qabx
%%
Type: language
Subtag: qba..qbz
%%
Type: language
Subtag: qaa..qtz
%%
Type: language
Subtag: zzz
%%
Type: language
Subtag: aaa
%%
Type: extlang
Subtag: cmn
Prefix: zh
%%
Type: extlang
Subtag: aao
Prefix: ar
%%
Type: grandfathered
Tag: I-KLINGON
%%
Type: redundant
Tag: zh-cmn
%%
Type: region
Subtag: gb
%%
Type: script
Subtag: latn
%%
Type: variant
Subtag: 1901
Prefix: de-CH
Prefix: de
%%
Type: variant
Subtag: fonipa`),
    {
      valuesByType: {
        extlang: ["aao", "cmn"],
        grandfathered: ["i-klingon"],
        language: ["aaa", "zzz"],
        redundant: ["zh-cmn"],
        region: ["gb"],
        script: ["latn"],
        variant: ["1901", "fonipa"],
      },
      prefixes: {
        extlang: {
          aao: ["ar"],
          cmn: ["zh"],
        },
        variant: {
          1901: ["de", "de-ch"],
          fonipa: [],
        },
      },
      ranged: [
        { type: "language", value: "qaa..qtz" },
        { type: "language", value: "qba..qbz" },
        { type: "script", value: "qaaa..qabx" },
      ],
      types: [
        "extlang",
        "grandfathered",
        "language",
        "redundant",
        "region",
        "script",
        "variant",
      ],
    },
    "09.01",
  );
});

test.run();
