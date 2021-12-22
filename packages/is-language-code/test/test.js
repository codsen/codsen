import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isLangCode } from "../dist/is-language-code.esm.js";

// 01. simple language subtag
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${32}m${`simple`}\u001b[${39}m`} - German`, () => {
  equal(
    isLangCode(`de`),
    {
      res: true,
      message: null,
    },
    "01"
  );
});

test(`02 - ${`\u001b[${32}m${`simple`}\u001b[${39}m`} - French`, () => {
  equal(
    isLangCode(`fr`),
    {
      res: true,
      message: null,
    },
    "02"
  );
});

test(`03 - ${`\u001b[${32}m${`simple`}\u001b[${39}m`} - Japanese`, () => {
  equal(
    isLangCode(`ja`),
    {
      res: true,
      message: null,
    },
    "03"
  );
});

// 02. grandfathered tags
// -----------------------------------------------------------------------------

test(`04 - ${`\u001b[${32}m${`grandfathered`}\u001b[${39}m`} - Enochian`, () => {
  equal(
    isLangCode(`i-enochian`),
    {
      res: true,
      message: null,
    },
    "04"
  );
  // Deprecated in 2015-03-29
});

test(`05 - ${`\u001b[${32}m${`grandfathered`}\u001b[${39}m`} - Klingon`, () => {
  equal(
    isLangCode(`i-klingon`),
    {
      res: true,
      message: null,
    },
    "05"
  );
});

// 03.
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${32}m${`language + script`}\u001b[${39}m`} - Chinese written using the Traditional Chinese script`, () => {
  equal(
    isLangCode(`zh-Hant`),
    {
      res: true,
      message: null,
    },
    "06"
  );
});

test(`07 - ${`\u001b[${32}m${`language + script`}\u001b[${39}m`} - Chinese written using the Simplified Chinese script`, () => {
  equal(
    isLangCode(`zh-Hans`),
    {
      res: true,
      message: null,
    },
    "07"
  );
});

test(`08 - ${`\u001b[${32}m${`language + script`}\u001b[${39}m`} - Serbian written using the Cyrillic script`, () => {
  equal(
    isLangCode(`sr-Cyrl`),
    {
      res: true,
      message: null,
    },
    "08"
  );
});

test(`09 - ${`\u001b[${32}m${`language + script`}\u001b[${39}m`} - Serbian written using the Latin script`, () => {
  equal(
    isLangCode(`sr-Latn`),
    {
      res: true,
      message: null,
    },
    "09"
  );
});

// 04
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${32}m${`language + primary language`}\u001b[${39}m`} - Chinese, Mandarin, Simplified script, as used in China`, () => {
  equal(
    isLangCode(`zh-cmn-Hans-CN`),
    {
      res: true,
      message: null,
    },
    "10"
  );
});

test(`11 - ${`\u001b[${32}m${`language + primary language`}\u001b[${39}m`} - Mandarin Chinese, Simplified script, as used in China`, () => {
  equal(
    isLangCode(`cmn-Hans-CN`),
    {
      res: true,
      message: null,
    },
    "11"
  );
});

test(`12 - ${`\u001b[${32}m${`language + primary language`}\u001b[${39}m`} - Chinese, Cantonese, as used in Hong Kong SAR`, () => {
  equal(
    isLangCode(`zh-yue-HK`),
    {
      res: true,
      message: null,
    },
    "12"
  );
});

test(`13 - ${`\u001b[${32}m${`language + primary language`}\u001b[${39}m`} - Cantonese Chinese, as used in Hong Kong SAR`, () => {
  equal(
    isLangCode(`yue-HK`),
    {
      res: true,
      message: null,
    },
    "13"
  );
});

// 05
// -----------------------------------------------------------------------------

test(`14 - ${`\u001b[${32}m${`language + script + region`}\u001b[${39}m`} - Chinese written using the Simplified script as used in mainland China`, () => {
  equal(
    isLangCode(`zh-Hans-CN`),
    {
      res: true,
      message: null,
    },
    "14"
  );
});

test(`15 - ${`\u001b[${32}m${`language + script + region`}\u001b[${39}m`} - Serbian written using the Latin script as used in Serbia`, () => {
  equal(
    isLangCode(`sr-Latn-RS`),
    {
      res: true,
      message: null,
    },
    "15"
  );
});

// 06
// -----------------------------------------------------------------------------

test(`16 - ${`\u001b[${32}m${`language + variant`}\u001b[${39}m`} - Resian dialect of Slovenian`, () => {
  equal(
    isLangCode(`sl-rozaj`),
    {
      res: true,
      message: null,
    },
    "16"
  );
});

test(`17 - ${`\u001b[${32}m${`language + variant`}\u001b[${39}m`} - two variants: San Giorgio dialect of Resian dialect of Slovenian`, () => {
  equal(
    isLangCode(`sl-rozaj-biske`),
    {
      res: true,
      message: null,
    },
    "17"
  );
});

test(`18 - ${`\u001b[${32}m${`language + variant`}\u001b[${39}m`} - Nadiza dialect of Slovenian`, () => {
  equal(
    isLangCode(`sl-nedis`),
    {
      res: true,
      message: null,
    },
    "18"
  );
});

test(`19 - ${`\u001b[${32}m${`language + variant`}\u001b[${39}m`} - repeated variant is not OK`, () => {
  equal(
    isLangCode(`de-DE-1901-1901`),
    {
      res: false,
      message: `Repeated variant subtag, "1901".`,
    },
    "19"
  );
});

test(`20 - ${`\u001b[${32}m${`language + variant`}\u001b[${39}m`} - multiple variant subtags not in a sequence`, () => {
  equal(
    isLangCode(`sl-rozaj-SL-biske`),
    {
      res: false,
      message: `Unrecognised language subtag, "sl".`,
    },
    "20"
  );
});

// 07
// -----------------------------------------------------------------------------

test(`21 - ${`\u001b[${32}m${`language + region + variant`}\u001b[${39}m`} - German as used in Switzerland using the 1901 variant [orthography]`, () => {
  equal(
    isLangCode(`de-CH-1901`),
    {
      res: true,
      message: null,
    },
    "21"
  );
});

test(`22 - ${`\u001b[${32}m${`language + region + variant`}\u001b[${39}m`} - Slovenian as used in Italy, Nadiza dialect`, () => {
  equal(
    isLangCode(`sl-IT-nedis`),
    {
      res: true,
      message: null,
    },
    "22"
  );
});

test(`23 - ${`\u001b[${32}m${`language + region + variant`}\u001b[${39}m`} - Catalan, Spain region, variant Valencia`, () => {
  equal(
    isLangCode(`ca-ES-VALENCIA`),
    {
      res: true,
      message: null,
    },
    "23"
  );
});

// 08
// -----------------------------------------------------------------------------

test(`24 - ${`\u001b[${32}m${`language + script + region + variant`}\u001b[${39}m`} - Eastern Armenian written in Latin script, as used in Italy`, () => {
  equal(
    isLangCode(`hy-Latn-IT-arevela`),
    {
      res: true,
      message: null,
    },
    "24"
  );
});

// 09
// -----------------------------------------------------------------------------

test(`25 - ${`\u001b[${32}m${`language - region`}\u001b[${39}m`} - German for Germany`, () => {
  equal(
    isLangCode(`de-DE`),
    {
      res: true,
      message: null,
    },
    "25"
  );
});

test(`26 - ${`\u001b[${32}m${`language - region`}\u001b[${39}m`} - English as used in the United States`, () => {
  equal(
    isLangCode(`en-US`),
    {
      res: true,
      message: null,
    },
    "26"
  );
});

test(`27 - ${`\u001b[${32}m${`language - region`}\u001b[${39}m`} - Spanish appropriate for the Latin America and Caribbean region using the UN region code`, () => {
  equal(
    isLangCode(`es-419`),
    {
      res: true,
      message: null,
    },
    "27"
  );
});

// 10
// -----------------------------------------------------------------------------

test(`28 - ${`\u001b[${32}m${`private use subtags`}\u001b[${39}m`} - 1`, () => {
  equal(
    isLangCode(`de-CH-x-phonebk`),
    {
      res: true,
      message: null,
    },
    "28"
  );
});

test(`29 - ${`\u001b[${32}m${`private use subtags`}\u001b[${39}m`} - 2`, () => {
  equal(
    isLangCode(`az-Arab-x-AZE-derbend`),
    {
      res: true,
      message: null,
    },
    "29"
  );
});

// 11
// -----------------------------------------------------------------------------

test(`30 - ${`\u001b[${32}m${`private use registry values`}\u001b[${39}m`} - private use using the singleton 'x'`, () => {
  equal(
    isLangCode(`x-whatever`),
    {
      res: true,
      message: null,
    },
    "30"
  );
});

test(`31 - ${`\u001b[${32}m${`private use registry values`}\u001b[${39}m`} - all private tags`, () => {
  equal(
    isLangCode(`qaa-Qaaa-QM-x-southern`),
    {
      res: true,
      message: null,
    },
    "31"
  );
});

test(`32 - ${`\u001b[${32}m${`private use registry values`}\u001b[${39}m`} - German, with a private script`, () => {
  equal(
    isLangCode(`de-Qaaa`),
    {
      res: true,
      message: null,
    },
    "32"
  );
});

test(`33 - ${`\u001b[${32}m${`private use registry values`}\u001b[${39}m`} - Serbian, Latin script, private region`, () => {
  equal(
    isLangCode(`sr-Latn-QM`),
    {
      res: true,
      message: null,
    },
    "33"
  );
});

test(`34 - ${`\u001b[${32}m${`private use registry values`}\u001b[${39}m`} - Serbian, private script, for Serbia`, () => {
  equal(
    isLangCode(`sr-Qaaa-RS`),
    {
      res: true,
      message: null,
    },
    "34"
  );
});

// 12
// -----------------------------------------------------------------------------

test(`35 - ${`\u001b[${32}m${`tags that use extensions`}\u001b[${39}m`} - 1`, () => {
  equal(
    isLangCode(`en-US-u-islamcal`),
    {
      res: true,
      message: null,
    },
    "35"
  );
});

test(`36 - ${`\u001b[${32}m${`tags that use extensions`}\u001b[${39}m`} - 2`, () => {
  equal(
    isLangCode(`zh-CN-a-myext-x-private`),
    {
      res: true,
      message: null,
    },
    "36"
  );
});

test(`37 - ${`\u001b[${32}m${`tags that use extensions`}\u001b[${39}m`} - 3`, () => {
  equal(
    isLangCode(`en-a-myext-b-another`),
    {
      res: true,
      message: null,
    },
    "37"
  );
});

// 13 negative answer
// -----------------------------------------------------------------------------

test(`38 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - two region tags`, () => {
  equal(
    isLangCode(`de-419-DE`),
    {
      res: false,
      message: `Two region subtags, "419" and "de".`,
    },
    "38"
  );
});

test(`39 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - use of a single-character subtag in primary position`, () => {
  // "use of a single-character subtag in primary position; note
  // that there are a few grandfathered tags that start with "i-" that
  // are valid"
  // --- https://tools.ietf.org/html/rfc5646
  equal(
    isLangCode(`a-DE`),
    {
      res: false,
      message: `Starts with singleton, "a".`,
    },
    "39"
  );
});

test(`40 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - two extensions with same single-letter prefix`, () => {
  equal(
    isLangCode(`ar-a-aaa-b-bbb-a-ccc`),
    {
      res: false,
      message: `Two extensions with same single-letter prefix "a".`,
    },
    "40"
  );
});

test(`41 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - failing initial regex`, () => {
  equal(
    isLangCode(`something like this`),
    {
      res: false,
      message: `Does not resemble a language tag.`,
    },
    "41"
  );
});

test(`42 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - two singletons repeated`, () => {
  equal(
    isLangCode(`tlh-a-b-foo`),
    {
      res: false,
      message: `Multiple singleton sequence "a", "b".`,
    },
    "42"
  );
});

test(`43 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - language tag unrecognised`, () => {
  equal(
    isLangCode(`html`),
    {
      res: false,
      message: `Unrecognised language subtag, "html".`,
    },
    "43"
  );
});

test(`44 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - language tag unrecognised`, () => {
  equal(
    isLangCode(`zzz`),
    {
      res: false,
      message: `Unrecognised language subtag, "zzz".`,
    },
    "44"
  );
});

test(`45 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`}`, () => {
  equal(
    isLangCode(``),
    {
      res: false,
      message: `Empty language tag string given.`,
    },
    "45"
  );
});

test(`46 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`}`, () => {
  equal(
    isLangCode(`\t\t`),
    {
      res: false,
      message: `Empty language tag string given.`,
    },
    "46"
  );
});

test(`47 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - ends with private use sequence's subtag x`, () => {
  equal(
    isLangCode(`en-Latn-GB-boont-x`),
    {
      res: false,
      message: `Ends with private use subtag, "x".`,
    },
    "47"
  );
});

test(`48 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - ends with private use sequence's subtag x`, () => {
  equal(
    isLangCode(`en-Latn-GB-boont-a`),
    {
      res: false,
      message: `Ends with singleton, "a".`,
    },
    "48"
  );
});

// 14 adhoc
// -----------------------------------------------------------------------------

test(`49 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`} - Windows XP is not legal but in private it is fine`, () => {
  equal(
    isLangCode(`en-US-Windows-x-XP`),
    {
      res: false,
      message: `Unrecognised language subtag, "windows".`,
    },
    "49"
  );
});

test(`50 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`} - POSIX is not registered with IANA`, () => {
  equal(
    isLangCode(`en-US-POSIX`),
    {
      res: false,
      message: `Unrecognised language subtag, "posix".`,
    },
    "50"
  );
});

test(`51 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`}`, () => {
  equal(
    isLangCode(`de-CH-1996`),
    {
      res: true,
      message: null,
    },
    "51"
  );
});

test(`52 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`}`, () => {
  // the second appearance of the singleton 'a' is in a private use sequence, so it's OK
  equal(
    isLangCode(`en-a-bbb-x-a-ccc`),
    {
      res: true,
      message: null,
    },
    "52"
  );
});

test(`53 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`}`, () => {
  // an extension were defined for the singleton 'r' and it defined the subtag
  equal(
    isLangCode(`en-Latn-GB-boont-r-extended-sequence-x-private`),
    {
      res: true,
      message: null,
    },
    "53"
  );
});

test(`54 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`}`, () => {
  // an extension were defined for the singleton 'r' and it defined the subtag
  equal(
    isLangCode(`a-Latn`),
    {
      res: false,
      message: `Starts with singleton, "a".`,
    },
    "54"
  );
});

test(`55 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`}`, () => {
  // an extension were defined for the singleton 'r' and it defined the subtag
  equal(
    isLangCode(`en-Latn-GB-boont-r`),
    {
      res: false,
      message: `Ends with singleton, "r".`,
    },
    "55"
  );
});

test.run();
