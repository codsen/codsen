// avanotonly

import test from "ava";
import { det, mixer, allCombinations } from "../t-util/util";
import {
  // rawReplacementMark,
  rawNDash,
  rawMDash,
  // rawNbsp,
  // rawhairspace,
  // rawEllipsis,
  leftSingleQuote,
  rightSingleQuote
  // rightDoubleQuote,
  // leftDoubleQuote,
} from "../dist/util.esm";
// import { det as det1 } from "../dist/detergent.esm";

// -----------------------------------------------------------------------------

// following test is according to the Butterick's practical typography
// http://practicaltypography.com/hyphens-and-dashes.html
test(`01.01 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - converts dashes into N dashes: +dashes+entities-widows`, t => {
  mixer({
    convertDashes: 1,
    convertEntities: 1,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, "1880-1912, pages 330-39", opt).res,
      "1880&ndash;1912, pages 330&ndash;39",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.02 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - converts dashes into N dashes: +dashes-entities-widows`, t => {
  mixer({
    convertDashes: 1,
    convertEntities: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, "1880-1912, pages 330-39", opt).res,
      "1880\u20131912, pages 330\u201339",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.03 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - doesn't convert N dashes when is not asked to: -dashes-widows`, t => {
  mixer({
    convertDashes: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, "1880-1912, pages 330-39", opt).res,
      "1880-1912, pages 330-39",
      JSON.stringify(opt, null, 4)
    );
  });
});

// example from Oxford A-Z Grammar and Punctuation
test(`01.04 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - A-Z - hyphen`, t => {
  mixer({
    convertDashes: 1,
    convertEntities: 1
  }).forEach((opt, n) => {
    t.is(det(t, n, "An A-Z guide", opt).res, "An A&ndash;Z guide");
  });
  mixer({
    convertDashes: 1,
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(det(t, n, "An A-Z guide", opt).res, "An A\u2013Z guide");
  });
  mixer({
    convertDashes: 0,
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, "An A-Z guide", opt).res,
      "An A-Z guide",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.05 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - A-Z - raw n-dash`, t => {
  mixer({
    convertDashes: 1,
    convertEntities: 1
  }).forEach((opt, n) => {
    t.is(det(t, n, `An A${rawNDash}Z guide`, opt).res, "An A&ndash;Z guide");
  });
  mixer({
    convertDashes: 1,
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `An A${rawNDash}Z guide`, opt).res,
      `An A${rawNDash}Z guide`
    );
  });
  mixer({
    convertDashes: 0,
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `An A${rawNDash}Z guide`, opt).res,
      "An A-Z guide",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.06 - \u001b[${33}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - A-Z - encoded n-dash`, t => {
  mixer({
    convertDashes: 1,
    convertEntities: 1
  }).forEach((opt, n) => {
    t.is(det(t, n, `An A&ndash;Z guide`, opt).res, "An A&ndash;Z guide");
  });
  mixer({
    convertDashes: 1,
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(det(t, n, `An A&ndash;Z guide`, opt).res, `An A${rawNDash}Z guide`);
  });
  mixer({
    convertDashes: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `An A&ndash;Z guide`, opt).res,
      "An A-Z guide",
      JSON.stringify(opt, null, 4)
    );
  });
});

//                                 m dashes
// -----------------------------------------------------------------------------

test(`02.01 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - converts with encoding entities: +dashes-widows+entities`, t => {
  mixer({
    convertDashes: 1,
    removeWidows: 0,
    convertEntities: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, "some text - some more text", opt).res,
      "some text &mdash; some more text",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.02 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - converts without encoding entities: +dashes-widows-entities`, t => {
  mixer({
    convertDashes: 1,
    removeWidows: 0,
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, "some text - some more text", opt).res,
      `some text ${rawMDash} some more text`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.03 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - does not convert: -dashes-widows`, t => {
  mixer({
    convertDashes: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, "some text - some more text", opt).res,
      "some text - some more text",
      JSON.stringify(opt, null, 4)
    );
  });
});

// example adapted from Oxford A-Z Grammar and Punctuation, p.46
test(`02.04 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - adds between two words`, t => {
  mixer({
    convertDashes: 1,
    removeWidows: 0,
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        "In brute material terms, he was an accomplice - in fact, a conspirator - to the clearing of the ice-cream fridge.",
        opt
      ).res,
      `In brute material terms, he was an accomplice ${rawMDash} in fact, a conspirator ${rawMDash} to the clearing of the ice-cream fridge.`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.05 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities on`, t => {
  mixer({
    convertDashes: 1,
    removeWidows: 0,
    convertEntities: 1,
    convertApostrophes: 1
  }).forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
        opt
      ).res,
      `I smiled and she said, &lsquo;You mean you want me to&mdash;&rsquo;`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.06 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities off`, t => {
  mixer({
    convertDashes: 1,
    removeWidows: 0,
    convertEntities: 0,
    convertApostrophes: 1
  }).forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
        opt
      ).res,
      `I smiled and she said, ${leftSingleQuote}You mean you want me to${rawMDash}${rightSingleQuote}`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.07 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities on`, t => {
  mixer({
    convertDashes: 1,
    removeWidows: 0,
    convertEntities: 1,
    convertApostrophes: 0
  }).forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
        opt
      ).res,
      `I smiled and she said, 'You mean you want me to&mdash;'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.08 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities off`, t => {
  mixer({
    convertDashes: 1,
    removeWidows: 0,
    convertEntities: 0,
    convertApostrophes: 0
  }).forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
        opt
      ).res,
      `I smiled and she said, 'You mean you want me to${rawMDash}'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.09 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`, t => {
  mixer({
    removeWidows: 0,
    convertEntities: 1,
    convertDashes: 1,
    convertApostrophes: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, &lsquo;You mean you want me to&mdash;&rsquo;`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.10 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`, t => {
  mixer({
    removeWidows: 0,
    convertEntities: 1,
    convertDashes: 1,
    convertApostrophes: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, 'You mean you want me to&mdash;'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.11 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`, t => {
  mixer({
    removeWidows: 0,
    convertEntities: 1,
    convertDashes: 0,
    convertApostrophes: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, &lsquo;You mean you want me to-&rsquo;`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.12 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`, t => {
  mixer({
    removeWidows: 0,
    convertEntities: 1,
    convertDashes: 0,
    convertApostrophes: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, 'You mean you want me to-'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.13 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`, t => {
  mixer({
    removeWidows: 0,
    convertEntities: 0,
    convertDashes: 1,
    convertApostrophes: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, ${leftSingleQuote}You mean you want me to${rawMDash}${rightSingleQuote}`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.14 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`, t => {
  mixer({
    removeWidows: 0,
    convertEntities: 0,
    convertDashes: 1,
    convertApostrophes: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, 'You mean you want me to${rawMDash}'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.15 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`, t => {
  mixer({
    removeWidows: 0,
    convertEntities: 0,
    convertDashes: 0,
    convertApostrophes: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`02.16 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`, t => {
  mixer({
    removeWidows: 0,
    convertEntities: 0,
    convertDashes: 0,
    convertApostrophes: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, 'You mean you want me to-'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

//                              insurance
// -----------------------------------------------------------------------------

test(`03.01 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - if statements`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "zzz{% if something %}yyy", opt).res,
      "zzz{% if something %}yyy",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`03.02 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - variables`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "zzz{{ something }}yyy", opt).res,
      "zzz{{ something }}yyy",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`03.03 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - if statements`, t => {
  allCombinations.forEach((opt, n) => {
    // with Nunjucks whitespace collapse hyphen:
    t.is(
      det(t, n, "zzz{%- if something -%}yyy", opt).res,
      "zzz{%- if something -%}yyy",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`03.04 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - collapsing variables`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "zzz{{- something -}}yyy", opt).res,
      "zzz{{- something -}}yyy",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`03.05 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - raw m-dash sanity check`, t => {
  mixer({
    convertEntities: 0,
    convertDashes: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `m${rawMDash}m`, opt).res,
      `m${rawMDash}m`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    convertEntities: 0,
    convertDashes: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `m${rawMDash}m`, opt).res,
      `m-m`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`03.06 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - leaves minuses alone with convert entities option off`, t => {
  mixer({
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(det(t, n, "m-m", opt).res, "m-m", JSON.stringify(opt, null, 4));
  });
});

test(`03.07 - \u001b[${36}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`insurance`}\u001b[${39}m - leaves the m-dashes intact`, t => {
  mixer({
    convertEntities: 1,
    convertDashes: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `m${rawMDash}m`, opt).res,
      "m&mdash;m",
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    convertDashes: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `m${rawMDash}m`, opt).res,
      "m-m",
      JSON.stringify(opt, null, 4)
    );
  });
});

//                                 minuses
// -----------------------------------------------------------------------------

test(`04.01 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - leaves minuses alone with convert entities option on`, t => {
  mixer({
    convertEntities: 1
  }).forEach((opt, n) => {
    t.is(det(t, n, "m-m", opt).res, "m-m", JSON.stringify(opt, null, 4));
  });
});

test(`04.02 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - legit minus between two numbers`, t => {
  mixer({
    removeWidows: 0
  }).forEach((opt, n) => {
    t.is(
      // nothing to convert:
      det(t, n, `1 - 2 = 3`, opt).res,
      `1 - 2 = 3`
    );
  });
});

test(`04.03 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - minus and number, too short to widow removal`, t => {
  mixer({
    convertEntities: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.is(det(t, n, "Temperatures of -20°C", opt).res, "Temperatures of -20°C");
    t.is(det(t, n, "-20°C", opt).res, "-20°C", JSON.stringify(opt, null, 4));
  });
});

test(`04.04 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - deg HTML entity`, t => {
  mixer({
    convertEntities: 1,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, "Temperatures of -20°C", opt).res,
      "Temperatures of -20&deg;C"
    );
    t.is(
      det(t, n, "-20°C", opt).res,
      "-20&deg;C",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`04.05 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - deg HTML entity in a sentence - widows=on`, t => {
  mixer({
    convertEntities: 1,
    removeWidows: 1
  }).forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        "The records show that there were temperatures as low as -20°C",
        opt
      ).res,
      "The records show that there were temperatures as low as&nbsp;-20&deg;C",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`04.06 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - deg HTML entity in a sentence - widows=off`, t => {
  mixer({
    convertEntities: 1,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        "The records show that there were temperatures as low as -20°C",
        opt
      ).res,
      "The records show that there were temperatures as low as -20&deg;C",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`04.07 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - minus and number, clashing with widow removal - widows=on, entities=off`, t => {
  mixer({
    convertEntities: 0,
    removeWidows: 1
  }).forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        "The records show that there were temperatures as low as -20°C",
        opt
      ).res,
      "The records show that there were temperatures as low as\u00A0-20°C",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`04.08 - \u001b[${34}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`minuses`}\u001b[${39}m - minus and number, clashing with widow removal - widows=off, entities=off`, t => {
  mixer({
    convertEntities: 0,
    removeWidows: 0
  }).forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        "The records show that there were temperatures as low as -20°C",
        opt
      ).res,
      "The records show that there were temperatures as low as -20°C",
      JSON.stringify(opt, null, 4)
    );
  });
});

//                                 hyphens
// -----------------------------------------------------------------------------

test(`05.01 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - no full stop`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "Stratford-upon-Avon", opt).res,
      "Stratford-upon-Avon",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`05.02 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - no full stop, longer sentence`, t => {
  mixer({
    convertEntities: 1,
    removeWidows: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, "One day we should visit Stratford-upon-Avon", opt).res,
      "One day we should visit&nbsp;Stratford-upon-Avon",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`05.03 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - full stop`, t => {
  mixer({
    convertEntities: 1,
    removeWidows: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, "One day we should visit Stratford-upon-Avon.", opt).res,
      "One day we should visit&nbsp;Stratford-upon-Avon.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`05.04 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - no full stop, widows=off`, t => {
  mixer({
    removeWidows: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, "One day we should visit Stratford-upon-Avon", opt).res,
      "One day we should visit Stratford-upon-Avon",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`05.05 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`hyphens`}\u001b[${39}m - dashes between words, no spaces - full stop, widows=off`, t => {
  mixer({
    removeWidows: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, "One day we should visit Stratford-upon-Avon.", opt).res,
      "One day we should visit Stratford-upon-Avon.",
      JSON.stringify(opt, null, 4)
    );
  });
});
