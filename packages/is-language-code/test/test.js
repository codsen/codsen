import tap from "tap";
import isLangCode from "../dist/is-language-code.esm";

// 01. simple language subtag
// -----------------------------------------------------------------------------

tap.test(`01.01 - ${`\u001b[${32}m${`simple`}\u001b[${39}m`} - German`, (t) => {
  t.match(isLangCode(`de`), {
    res: true,
    message: null,
  });
  t.end();
});

tap.test(`01.02 - ${`\u001b[${32}m${`simple`}\u001b[${39}m`} - French`, (t) => {
  t.match(isLangCode(`fr`), {
    res: true,
    message: null,
  });
  t.end();
});

tap.test(
  `01.03 - ${`\u001b[${32}m${`simple`}\u001b[${39}m`} - Japanese`,
  (t) => {
    t.match(isLangCode(`ja`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

// 02. grandfathered tags
// -----------------------------------------------------------------------------

tap.test(
  `02.01 - ${`\u001b[${32}m${`grandfathered`}\u001b[${39}m`} - Enochian`,
  (t) => {
    t.match(isLangCode(`i-enochian`), {
      res: true,
      message: null,
    });
    // Deprecated in 2015-03-29
    t.end();
  }
);

tap.test(
  `02.02 - ${`\u001b[${32}m${`grandfathered`}\u001b[${39}m`} - Klingon`,
  (t) => {
    t.match(isLangCode(`i-klingon`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

// 03.
// -----------------------------------------------------------------------------

tap.test(
  `03.01 - ${`\u001b[${32}m${`language + script`}\u001b[${39}m`} - Chinese written using the Traditional Chinese script`,
  (t) => {
    t.match(isLangCode(`zh-Hant`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `03.02 - ${`\u001b[${32}m${`language + script`}\u001b[${39}m`} - Chinese written using the Simplified Chinese script`,
  (t) => {
    t.match(isLangCode(`zh-Hans`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `03.03 - ${`\u001b[${32}m${`language + script`}\u001b[${39}m`} - Serbian written using the Cyrillic script`,
  (t) => {
    t.match(isLangCode(`sr-Cyrl`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `03.04 - ${`\u001b[${32}m${`language + script`}\u001b[${39}m`} - Serbian written using the Latin script`,
  (t) => {
    t.match(isLangCode(`sr-Latn`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

// 04
// -----------------------------------------------------------------------------

tap.test(
  `04.01 - ${`\u001b[${32}m${`language + primary language`}\u001b[${39}m`} - Chinese, Mandarin, Simplified script, as used in China`,
  (t) => {
    t.match(isLangCode(`zh-cmn-Hans-CN`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `04.02 - ${`\u001b[${32}m${`language + primary language`}\u001b[${39}m`} - Mandarin Chinese, Simplified script, as used in China`,
  (t) => {
    t.match(isLangCode(`cmn-Hans-CN`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `04.03 - ${`\u001b[${32}m${`language + primary language`}\u001b[${39}m`} - Chinese, Cantonese, as used in Hong Kong SAR`,
  (t) => {
    t.match(isLangCode(`zh-yue-HK`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `04.04 - ${`\u001b[${32}m${`language + primary language`}\u001b[${39}m`} - Cantonese Chinese, as used in Hong Kong SAR`,
  (t) => {
    t.match(isLangCode(`yue-HK`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

// 05
// -----------------------------------------------------------------------------

tap.test(
  `05.01 - ${`\u001b[${32}m${`language + script + region`}\u001b[${39}m`} - Chinese written using the Simplified script as used in mainland China`,
  (t) => {
    t.match(isLangCode(`zh-Hans-CN`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `05.02 - ${`\u001b[${32}m${`language + script + region`}\u001b[${39}m`} - Serbian written using the Latin script as used in Serbia`,
  (t) => {
    t.match(isLangCode(`sr-Latn-RS`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

// 06
// -----------------------------------------------------------------------------

tap.test(
  `06.01 - ${`\u001b[${32}m${`language + variant`}\u001b[${39}m`} - Resian dialect of Slovenian`,
  (t) => {
    t.match(isLangCode(`sl-rozaj`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `06.02 - ${`\u001b[${32}m${`language + variant`}\u001b[${39}m`} - two variants: San Giorgio dialect of Resian dialect of Slovenian`,
  (t) => {
    t.match(isLangCode(`sl-rozaj-biske`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `06.03 - ${`\u001b[${32}m${`language + variant`}\u001b[${39}m`} - Nadiza dialect of Slovenian`,
  (t) => {
    t.match(isLangCode(`sl-nedis`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `06.04 - ${`\u001b[${32}m${`language + variant`}\u001b[${39}m`} - repeated variant is not OK`,
  (t) => {
    t.match(isLangCode(`de-DE-1901-1901`), {
      res: false,
      message: `Repeated variant subtag, "1901".`,
    });
    t.end();
  }
);

tap.test(
  `06.05 - ${`\u001b[${32}m${`language + variant`}\u001b[${39}m`} - multiple variant subtags not in a sequence`,
  (t) => {
    t.match(isLangCode(`sl-rozaj-SL-biske`), {
      res: false,
      message: `Unrecognised language subtag, "sl".`,
    });
    t.end();
  }
);

// 07
// -----------------------------------------------------------------------------

tap.test(
  `07.01 - ${`\u001b[${32}m${`language + region + variant`}\u001b[${39}m`} - German as used in Switzerland using the 1901 variant [orthography]`,
  (t) => {
    t.match(isLangCode(`de-CH-1901`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `07.02 - ${`\u001b[${32}m${`language + region + variant`}\u001b[${39}m`} - Slovenian as used in Italy, Nadiza dialect`,
  (t) => {
    t.match(isLangCode(`sl-IT-nedis`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `07.03 - ${`\u001b[${32}m${`language + region + variant`}\u001b[${39}m`} - Catalan, Spain region, variant Valencia`,
  (t) => {
    t.match(isLangCode(`ca-ES-VALENCIA`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

// 08
// -----------------------------------------------------------------------------

tap.test(
  `08.01 - ${`\u001b[${32}m${`language + script + region + variant`}\u001b[${39}m`} - Eastern Armenian written in Latin script, as used in Italy`,
  (t) => {
    t.match(isLangCode(`hy-Latn-IT-arevela`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

// 09
// -----------------------------------------------------------------------------

tap.test(
  `09.01 - ${`\u001b[${32}m${`language - region`}\u001b[${39}m`} - German for Germany`,
  (t) => {
    t.match(isLangCode(`de-DE`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `09.02 - ${`\u001b[${32}m${`language - region`}\u001b[${39}m`} - English as used in the United States`,
  (t) => {
    t.match(isLangCode(`en-US`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `09.03 - ${`\u001b[${32}m${`language - region`}\u001b[${39}m`} - Spanish appropriate for the Latin America and Caribbean region using the UN region code`,
  (t) => {
    t.match(isLangCode(`es-419`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

// 10
// -----------------------------------------------------------------------------

tap.test(
  `10.01 - ${`\u001b[${32}m${`private use subtags`}\u001b[${39}m`} - 1`,
  (t) => {
    t.match(isLangCode(`de-CH-x-phonebk`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `10.02 - ${`\u001b[${32}m${`private use subtags`}\u001b[${39}m`} - 2`,
  (t) => {
    t.match(isLangCode(`az-Arab-x-AZE-derbend`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

// 11
// -----------------------------------------------------------------------------

tap.test(
  `11.01 - ${`\u001b[${32}m${`private use registry values`}\u001b[${39}m`} - private use using the singleton 'x'`,
  (t) => {
    t.match(isLangCode(`x-whatever`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `11.02 - ${`\u001b[${32}m${`private use registry values`}\u001b[${39}m`} - all private tags`,
  (t) => {
    t.match(isLangCode(`qaa-Qaaa-QM-x-southern`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `11.03 - ${`\u001b[${32}m${`private use registry values`}\u001b[${39}m`} - German, with a private script`,
  (t) => {
    t.match(isLangCode(`de-Qaaa`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `11.04 - ${`\u001b[${32}m${`private use registry values`}\u001b[${39}m`} - Serbian, Latin script, private region`,
  (t) => {
    t.match(isLangCode(`sr-Latn-QM`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `11.05 - ${`\u001b[${32}m${`private use registry values`}\u001b[${39}m`} - Serbian, private script, for Serbia`,
  (t) => {
    t.match(isLangCode(`sr-Qaaa-RS`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

// 12
// -----------------------------------------------------------------------------

tap.test(
  `12.01 - ${`\u001b[${32}m${`tags that use extensions`}\u001b[${39}m`} - 1`,
  (t) => {
    t.match(isLangCode(`en-US-u-islamcal`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `12.02 - ${`\u001b[${32}m${`tags that use extensions`}\u001b[${39}m`} - 2`,
  (t) => {
    t.match(isLangCode(`zh-CN-a-myext-x-private`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

tap.test(
  `12.01 - ${`\u001b[${32}m${`tags that use extensions`}\u001b[${39}m`} - 3`,
  (t) => {
    t.match(isLangCode(`en-a-myext-b-another`), {
      res: true,
      message: null,
    });
    t.end();
  }
);

// 13 negative answer
// -----------------------------------------------------------------------------

tap.test(
  `13.01 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - two region tags`,
  (t) => {
    t.match(isLangCode(`de-419-DE`), {
      res: false,
      message: `Two region subtags, "419" and "de".`,
    });
    t.end();
  }
);

tap.test(
  `13.02 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - use of a single-character subtag in primary position`,
  (t) => {
    // "use of a single-character subtag in primary position; note
    // that there are a few grandfathered tags that start with "i-" that
    // are valid"
    // --- https://tools.ietf.org/html/rfc5646
    t.match(isLangCode(`a-DE`), {
      res: false,
      message: `Starts with singleton, "a".`,
    });
    t.end();
  }
);

tap.test(
  `13.03 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - two extensions with same single-letter prefix`,
  (t) => {
    t.match(isLangCode(`ar-a-aaa-b-bbb-a-ccc`), {
      res: false,
      message: `Two extensions with same single-letter prefix "a".`,
    });
    t.end();
  }
);

tap.test(
  `13.04 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - failing initial regex`,
  (t) => {
    t.match(isLangCode(`something like this`), {
      res: false,
      message: `Does not resemble a language tag.`,
    });
    t.end();
  }
);

tap.test(
  `13.05 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - two singletons repeated`,
  (t) => {
    t.match(isLangCode(`tlh-a-b-foo`), {
      res: false,
      message: `Multiple singleton sequence "a", "b".`,
    });
    t.end();
  }
);

tap.test(
  `13.07 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - language tag unrecognised`,
  (t) => {
    t.match(isLangCode(`html`), {
      res: false,
      message: `Unrecognised language subtag, "html".`,
    });
    t.end();
  }
);

tap.test(
  `13.08 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - language tag unrecognised`,
  (t) => {
    t.match(isLangCode(`zzz`), {
      res: false,
      message: `Unrecognised language subtag, "zzz".`,
    });
    t.end();
  }
);

tap.test(`13.09 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`}`, (t) => {
  t.match(isLangCode(``), {
    res: false,
    message: `Empty language tag string given.`,
  });
  t.end();
});

tap.test(`13.10 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`}`, (t) => {
  t.match(isLangCode(`\t\t`), {
    res: false,
    message: `Empty language tag string given.`,
  });
  t.end();
});

tap.test(
  `13.11 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - ends with private use sequence's subtag x`,
  (t) => {
    t.match(isLangCode(`en-Latn-GB-boont-x`), {
      res: false,
      message: `Ends with private use subtag, "x".`,
    });
    t.end();
  }
);

tap.test(
  `13.12 - ${`\u001b[${32}m${`failing`}\u001b[${39}m`} - ends with private use sequence's subtag x`,
  (t) => {
    t.match(isLangCode(`en-Latn-GB-boont-a`), {
      res: false,
      message: `Ends with singleton, "a".`,
    });
    t.end();
  }
);

// 14 adhoc
// -----------------------------------------------------------------------------

tap.test(
  `14.01 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`} - Windows XP is not legal but in private it is fine`,
  (t) => {
    t.match(isLangCode(`en-US-Windows-x-XP`), {
      res: false,
      message: `Unrecognised language subtag, "windows".`,
    });
    t.end();
  }
);

tap.test(
  `14.02 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`} - POSIX is not registered with IANA`,
  (t) => {
    t.match(isLangCode(`en-US-POSIX`), {
      res: false,
      message: `Unrecognised language subtag, "posix".`,
    });
    t.end();
  }
);

tap.test(`14.03 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`}`, (t) => {
  t.match(isLangCode(`de-CH-1996`), {
    res: true,
    message: null,
  });
  t.end();
});

tap.test(`14.04 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`}`, (t) => {
  // the second appearance of the singleton 'a' is in a private use sequence, so it's OK
  t.match(isLangCode(`en-a-bbb-x-a-ccc`), {
    res: true,
    message: null,
  });
  t.end();
});

tap.test(`14.05 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`}`, (t) => {
  // an extension were defined for the singleton 'r' and it defined the subtag
  t.match(isLangCode(`en-Latn-GB-boont-r-extended-sequence-x-private`), {
    res: true,
    message: null,
  });
  t.end();
});

tap.test(`14.06 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`}`, (t) => {
  // an extension were defined for the singleton 'r' and it defined the subtag
  t.match(isLangCode(`a-Latn`), {
    res: false,
    message: `Starts with singleton, "a".`,
  });
  t.end();
});

tap.test(`14.07 - ${`\u001b[${32}m${`adhoc`}\u001b[${39}m`}`, (t) => {
  // an extension were defined for the singleton 'r' and it defined the subtag
  t.match(isLangCode(`en-Latn-GB-boont-r`), {
    res: false,
    message: `Ends with singleton, "r".`,
  });
  t.end();
});
