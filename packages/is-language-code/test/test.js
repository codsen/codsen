// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

// 01. simple language subtag
// -----------------------------------------------------------------------------

test(`01 - simple - German`, () => {
  equal(
    isLangCode("de"),
    {
      res: true,
      message: null,
    },
    "01.01",
  );
});

test(`02 - simple - French`, () => {
  equal(
    isLangCode("fr"),
    {
      res: true,
      message: null,
    },
    "02.01",
  );
});

test(`03 - simple - Japanese`, () => {
  equal(
    isLangCode("ja"),
    {
      res: true,
      message: null,
    },
    "03.01",
  );
});

// 02. grandfathered tags
// -----------------------------------------------------------------------------

test(`04 - grandfathered - Enochian`, () => {
  equal(
    isLangCode("i-enochian"),
    {
      res: true,
      message: null,
    },
    "04.01",
  );
  // Deprecated in 2015-03-29
});

test(`05 - grandfathered - Klingon`, () => {
  equal(
    isLangCode("i-klingon"),
    {
      res: true,
      message: null,
    },
    "05.01",
  );
});

// 03.
// -----------------------------------------------------------------------------

test(`06 - language + script - Chinese written using the Traditional Chinese script`, () => {
  equal(
    isLangCode("zh-Hant"),
    {
      res: true,
      message: null,
    },
    "06.01",
  );
});

test(`07 - language + script - Chinese written using the Simplified Chinese script`, () => {
  equal(
    isLangCode("zh-Hans"),
    {
      res: true,
      message: null,
    },
    "07.01",
  );
});

test(`08 - language + script - Serbian written using the Cyrillic script`, () => {
  equal(
    isLangCode("sr-Cyrl"),
    {
      res: true,
      message: null,
    },
    "08.01",
  );
});

test(`09 - language + script - Serbian written using the Latin script`, () => {
  equal(
    isLangCode("sr-Latn"),
    {
      res: true,
      message: null,
    },
    "09.01",
  );
});

// 04
// -----------------------------------------------------------------------------

test(`10 - language + primary language - Chinese, Mandarin, Simplified script, as used in China`, () => {
  equal(
    isLangCode("zh-cmn-Hans-CN"),
    {
      res: true,
      message: null,
    },
    "10.01",
  );
});

test(`11 - language + primary language - Mandarin Chinese, Simplified script, as used in China`, () => {
  equal(
    isLangCode("cmn-Hans-CN"),
    {
      res: true,
      message: null,
    },
    "11.01",
  );
});

test(`12 - language + primary language - Chinese, Cantonese, as used in Hong Kong SAR`, () => {
  equal(
    isLangCode("zh-yue-HK"),
    {
      res: true,
      message: null,
    },
    "12.01",
  );
});

test(`13 - language + primary language - Cantonese Chinese, as used in Hong Kong SAR`, () => {
  equal(
    isLangCode("yue-HK"),
    {
      res: true,
      message: null,
    },
    "13.01",
  );
});

// 05
// -----------------------------------------------------------------------------

test(`14 - language + script + region - Chinese written using the Simplified script as used in mainland China`, () => {
  equal(
    isLangCode("zh-Hans-CN"),
    {
      res: true,
      message: null,
    },
    "14.01",
  );
});

test(`15 - language + script + region - Serbian written using the Latin script as used in Serbia`, () => {
  equal(
    isLangCode("sr-Latn-RS"),
    {
      res: true,
      message: null,
    },
    "15.01",
  );
});

// 06
// -----------------------------------------------------------------------------

test(`16 - language + variant - Resian dialect of Slovenian`, () => {
  equal(
    isLangCode("sl-rozaj"),
    {
      res: true,
      message: null,
    },
    "16.01",
  );
});

test(`17 - language + variant - two variants: San Giorgio dialect of Resian dialect of Slovenian`, () => {
  equal(
    isLangCode("sl-rozaj-biske"),
    {
      res: true,
      message: null,
    },
    "17.01",
  );
});

test(`18 - language + variant - Nadiza dialect of Slovenian`, () => {
  equal(
    isLangCode("sl-nedis"),
    {
      res: true,
      message: null,
    },
    "18.01",
  );
});

test(`19 - language + variant - repeated variant is not OK`, () => {
  equal(
    isLangCode("de-DE-1901-1901"),
    {
      res: false,
      message: 'Repeated variant subtag, "1901".',
    },
    "19.01",
  );
});

test(`20 - language + variant - region cannot follow a variant`, () => {
  equal(
    isLangCode("sl-rozaj-SL-biske"),
    {
      res: false,
      message: 'Unrecognised language subtag, "sl".',
    },
    "20.01",
  );
});

// 07
// -----------------------------------------------------------------------------

test(`21 - language + region + variant - German as used in Switzerland using the 1901 variant [orthography]`, () => {
  equal(
    isLangCode("de-CH-1901"),
    {
      res: true,
      message: null,
    },
    "21.01",
  );
});

test(`22 - language + region + variant - Slovenian as used in Italy, Nadiza dialect`, () => {
  equal(
    isLangCode("sl-IT-nedis"),
    {
      res: true,
      message: null,
    },
    "22.01",
  );
});

test(`23 - language + region + variant - Catalan, Spain region, variant Valencia`, () => {
  equal(
    isLangCode("ca-ES-VALENCIA"),
    {
      res: true,
      message: null,
    },
    "23.01",
  );
});

// 08
// -----------------------------------------------------------------------------

test(`24 - language + script + region + variant - Eastern Armenian written in Latin script, as used in Italy`, () => {
  equal(
    isLangCode("hy-Latn-IT-arevela"),
    {
      res: true,
      message: null,
    },
    "24.01",
  );
});

// 09
// -----------------------------------------------------------------------------

test(`25 - language - region - German for Germany`, () => {
  equal(
    isLangCode("de-DE"),
    {
      res: true,
      message: null,
    },
    "25.01",
  );
});

test(`26 - language - region - English as used in the United States`, () => {
  equal(
    isLangCode("en-US"),
    {
      res: true,
      message: null,
    },
    "26.01",
  );
});

test(`27 - language - region - Spanish appropriate for the Latin America and Caribbean region using the UN region code`, () => {
  equal(
    isLangCode("es-419"),
    {
      res: true,
      message: null,
    },
    "27.01",
  );
});

// 10
// -----------------------------------------------------------------------------

test(`28 - private use subtags - 1`, () => {
  equal(
    isLangCode("de-CH-x-phonebk"),
    {
      res: true,
      message: null,
    },
    "28.01",
  );
});

test(`29 - private use subtags - 2`, () => {
  equal(
    isLangCode("az-Arab-x-AZE-derbend"),
    {
      res: true,
      message: null,
    },
    "29.01",
  );
});

// 11
// -----------------------------------------------------------------------------

test(`30 - private use registry values - private use using the singleton 'x'`, () => {
  equal(
    isLangCode("x-whatever"),
    {
      res: true,
      message: null,
    },
    "30.01",
  );
});

test(`31 - private use registry values - all private tags`, () => {
  equal(
    isLangCode("qaa-Qaaa-QM-x-southern"),
    {
      res: true,
      message: null,
    },
    "31.01",
  );
});

test(`32 - private use registry values - German, with a private script`, () => {
  equal(
    isLangCode("de-Qaaa"),
    {
      res: true,
      message: null,
    },
    "32.01",
  );
});

test(`33 - private use registry values - Serbian, Latin script, private region`, () => {
  equal(
    isLangCode("sr-Latn-QM"),
    {
      res: true,
      message: null,
    },
    "33.01",
  );
});

test(`34 - private use registry values - Serbian, private script, for Serbia`, () => {
  equal(
    isLangCode("sr-Qaaa-RS"),
    {
      res: true,
      message: null,
    },
    "34.01",
  );
});

// 12
// -----------------------------------------------------------------------------

test(`35 - tags that use extensions - 1`, () => {
  equal(
    isLangCode("en-US-u-islamcal"),
    {
      res: true,
      message: null,
    },
    "35.01",
  );
});

test(`36 - tags that use extensions - 2`, () => {
  equal(
    isLangCode("zh-CN-a-myext-x-private"),
    {
      res: true,
      message: null,
    },
    "36.01",
  );
});

test(`37 - tags that use extensions - 3`, () => {
  equal(
    isLangCode("en-a-myext-b-another"),
    {
      res: true,
      message: null,
    },
    "37.01",
  );
});

// 13 negative answer
// -----------------------------------------------------------------------------

test(`38 - failing - two region tags`, () => {
  equal(
    isLangCode("de-419-DE"),
    {
      res: false,
      message: 'Two region subtags, "419" and "de".',
    },
    "38.01",
  );
});

test(`39 - failing - use of a single-character subtag in primary position`, () => {
  // "use of a single-character subtag in primary position; note
  // that there are a few grandfathered tags that start with "i-" that
  // are valid"
  // --- https://tools.ietf.org/html/rfc5646
  equal(
    isLangCode("a-DE"),
    {
      res: false,
      message: 'Starts with singleton, "a".',
    },
    "39.01",
  );
});

test(`40 - failing - two extensions with same single-letter prefix`, () => {
  equal(
    isLangCode("ar-a-aaa-b-bbb-a-ccc"),
    {
      res: false,
      message: 'Two extensions with same single-letter prefix "a".',
    },
    "40.01",
  );
  equal(
    isLangCode("en-a-foo-A-bar"),
    {
      res: false,
      message: 'Two extensions with same single-letter prefix "a".',
    },
    "40.02",
  );
});

test(`41 - failing - failing initial regex`, () => {
  equal(
    isLangCode("something like this"),
    {
      res: false,
      message: "Does not resemble a language tag.",
    },
    "41.01",
  );
});

test(`42 - failing - two singletons repeated`, () => {
  equal(
    isLangCode("tlh-a-b-foo"),
    {
      res: false,
      message: 'Multiple singleton sequence "a", "b".',
    },
    "42.01",
  );
});

test(`43 - failing - language tag unrecognised`, () => {
  equal(
    isLangCode("html"),
    {
      res: false,
      message: 'Unrecognised language subtag, "html".',
    },
    "43.01",
  );
});

test(`44 - failing - language tag unrecognised`, () => {
  equal(
    isLangCode("zzz"),
    {
      res: false,
      message: 'Unrecognised language subtag, "zzz".',
    },
    "44.01",
  );
});

test(`45 - failing`, () => {
  equal(
    isLangCode(""),
    {
      res: false,
      message: "Empty language tag string given.",
    },
    "45.01",
  );
});

test(`46 - failing`, () => {
  equal(
    isLangCode("\t\t"),
    {
      res: false,
      message: "Empty language tag string given.",
    },
    "46.01",
  );
});

test(`47 - failing - ends with private use sequence's subtag x`, () => {
  equal(
    isLangCode("en-Latn-GB-boont-x"),
    {
      res: false,
      message: 'Ends with private use subtag, "x".',
    },
    "47.01",
  );
});

test(`48 - failing - ends with extension singleton a`, () => {
  equal(
    isLangCode("en-Latn-GB-boont-a"),
    {
      res: false,
      message: 'Ends with singleton, "a".',
    },
    "48.01",
  );
});

// 14 adhoc
// -----------------------------------------------------------------------------

test(`49 - adhoc - Windows XP is not legal but in private it is fine`, () => {
  equal(
    isLangCode("en-US-Windows-x-XP"),
    {
      res: false,
      message: 'Unrecognised language subtag, "windows".',
    },
    "49.01",
  );
  equal(
    isLangCode("en-US-x-Windows-XP"),
    {
      res: true,
      message: null,
    },
    "49.02",
  );
});

test(`50 - adhoc - POSIX is not registered with IANA`, () => {
  equal(
    isLangCode("en-US-POSIX"),
    {
      res: false,
      message: 'Unrecognised language subtag, "posix".',
    },
    "50.01",
  );
});

test(`51 - adhoc`, () => {
  equal(
    isLangCode("de-CH-1996"),
    {
      res: true,
      message: null,
    },
    "51.01",
  );
});

test(`52 - adhoc`, () => {
  // the second appearance of the singleton 'a' is in a private use sequence, so it's OK
  equal(
    isLangCode("en-a-bbb-x-a-ccc"),
    {
      res: true,
      message: null,
    },
    "52.01",
  );
});

test(`53 - adhoc`, () => {
  // an extension were defined for the singleton 'r' and it defined the subtag
  equal(
    isLangCode("en-Latn-GB-boont-r-extended-sequence-x-private"),
    {
      res: true,
      message: null,
    },
    "53.01",
  );
});

test(`54 - adhoc`, () => {
  // an extension were defined for the singleton 'r' and it defined the subtag
  equal(
    isLangCode("a-Latn"),
    {
      res: false,
      message: 'Starts with singleton, "a".',
    },
    "54.01",
  );
});

test(`55 - adhoc`, () => {
  // an extension were defined for the singleton 'r' and it defined the subtag
  equal(
    isLangCode("en-Latn-GB-boont-r"),
    {
      res: false,
      message: 'Ends with singleton, "r".',
    },
    "55.01",
  );
});

test(`56 - grandfathered tags are case-insensitive`, () => {
  equal(
    isLangCode("I-AMI"),
    {
      res: true,
      message: null,
    },
    "56.01",
  );
  equal(
    isLangCode("I-KLINGON"),
    {
      res: true,
      message: null,
    },
    "56.02",
  );
});

test(`57 - a variant can immediately follow a script`, () => {
  equal(
    isLangCode("ja-Latn-hepburn"),
    {
      res: true,
      message: null,
    },
    "57.01",
  );
  equal(
    isLangCode("en-Latn-fonipa"),
    {
      res: true,
      message: null,
    },
    "57.02",
  );
});

test(`58 - extended language subtags enforce count and prefix`, () => {
  equal(
    isLangCode("zh-cmn-yue"),
    {
      res: false,
      message: 'More than one extended language subtag, "yue".',
    },
    "58.01",
  );
  equal(
    isLangCode("en-yue"),
    {
      res: false,
      message: 'Extended language subtag "yue" must follow "zh".',
    },
    "58.02",
  );
});

test(`59 - an extension needs content before private use`, () => {
  equal(
    isLangCode("en-a-x"),
    {
      res: false,
      message:
        'Extension "a" must be followed by a two-to-eight character subtag.',
    },
    "59.01",
  );
  equal(
    isLangCode("en-a-x-foo"),
    {
      res: false,
      message:
        'Extension "a" must be followed by a two-to-eight character subtag.',
    },
    "59.02",
  );
});

test(`60 - repeated variant after language, script, and region`, () => {
  equal(
    isLangCode("de-Latn-DE-1901-1901"),
    {
      res: false,
      message: 'Repeated variant subtag, "1901".',
    },
    "60.01",
  );
});

test(`61 - the complete private-use script range is supported`, () => {
  equal(
    isLangCode("en-Qaay"),
    {
      res: true,
      message: null,
    },
    "61.01",
  );
  equal(
    isLangCode("en-Qaaz"),
    {
      res: true,
      message: null,
    },
    "61.02",
  );
  equal(
    isLangCode("en-Qabx"),
    {
      res: true,
      message: null,
    },
    "61.03",
  );
  equal(
    isLangCode("en-Qaby"),
    {
      res: false,
      message: 'Unrecognised language subtag, "qaby".',
    },
    "61.04",
  );
});

test(`62 - current IANA registry entries are recognised`, () => {
  equal(
    isLangCode("isv"),
    {
      res: true,
      message: null,
    },
    "62.01",
  );
  equal(
    isLangCode("zh-hnm"),
    {
      res: true,
      message: null,
    },
    "62.02",
  );
  equal(
    isLangCode("vi-hanoi"),
    {
      res: true,
      message: null,
    },
    "62.03",
  );
  equal(
    isLangCode("nb-moderat"),
    {
      res: true,
      message: null,
    },
    "62.04",
  );
});

test(`63 - non-string input`, () => {
  equal(
    isLangCode(null),
    {
      res: false,
      message: "Not a string given.",
    },
    "63.01",
  );
  equal(
    isLangCode(),
    {
      res: false,
      message: "Not a string given.",
    },
    "63.02",
  );
  equal(
    isLangCode(undefined),
    {
      res: false,
      message: "Not a string given.",
    },
    "63.03",
  );
  equal(
    isLangCode(123),
    {
      res: false,
      message: "Not a string given.",
    },
    "63.04",
  );
});

test(`64 - calls do not append regular expressions to shared arrays`, () => {
  const originalPush = Array.prototype.push;
  let regexpPushes = 0;

  Array.prototype.push = function (...items) {
    regexpPushes += items.filter((item) => item instanceof RegExp).length;
    return originalPush.apply(this, items);
  };

  try {
    isLangCode("de");
    isLangCode("qaa-Qaaa-QM-x-southern");
    isLangCode("not-a-language-tag");
  } finally {
    Array.prototype.push = originalPush;
  }

  equal(regexpPushes, 0, "64.01");
});

test(`65 - script subtags appear at most once and before regions`, () => {
  equal(
    isLangCode("en-Latn-Cyrl"),
    {
      res: false,
      message: 'Unrecognised language subtag, "cyrl".',
    },
    "65.01",
  );
  equal(
    isLangCode("en-US-Latn"),
    {
      res: false,
      message: 'Unrecognised language subtag, "latn".',
    },
    "65.02",
  );
});

test(`66 - repeated variants are detected case-insensitively`, () => {
  equal(
    isLangCode("sl-rozaj-biske-ROZAJ"),
    {
      res: false,
      message: 'Repeated variant subtag, "rozaj".',
    },
    "66.01",
  );
});

test(`67 - a bare private-use singleton is rejected`, () => {
  equal(
    isLangCode("x"),
    {
      res: false,
      message: 'Ends with private use subtag, "x".',
    },
    "67.01",
  );
});

test.run();
