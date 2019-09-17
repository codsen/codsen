// avanotonly

import test from "ava";
import { mixer, allCombinations } from "../t-util/util";
import { det } from "../dist/detergent.esm";
import {
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  // rawNbsp,
  // rawhairspace,
  // rawEllipsis,
  leftSingleQuote,
  rightSingleQuote
  // rightDoubleQuote,
  // leftDoubleQuote,
} from "../dist/util.esm";

// -----------------------------------------------------------------------------

// following test is according to the Butterick's practical typography
// http://practicaltypography.com/hyphens-and-dashes.html
test(`01.01 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - converts dashes into N dashes: +dashes+entities-widows`, t => {
  mixer({
    convertDashes: 1,
    convertEntities: 1,
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det("1880-1912, pages 330-39", opt).res,
      "1880&ndash;1912, pages 330&ndash;39",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.02 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - converts dashes into N dashes: +dashes-entities-widows`, t => {
  mixer({
    convertDashes: 1,
    convertEntities: 0,
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det("1880-1912, pages 330-39", opt).res,
      "1880\u20131912, pages 330\u201339",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.03 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - doesn't convert N dashes when is not asked to: -dashes-widows`, t => {
  mixer({
    convertDashes: 0,
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det("1880-1912, pages 330-39", opt).res,
      "1880-1912, pages 330-39",
      JSON.stringify(opt, null, 4)
    );
  });
});

// example from Oxford A-Z Grammar and Punctuation
test(`01.04 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${33}m${`n-dash`}\u001b[${39}m - A-Z`, t => {
  mixer({
    convertDashes: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(det("An A-Z guide", opt).res, "An A&ndash;Z guide");
  });
  mixer({
    convertDashes: 1,
    convertEntities: 0
  }).forEach(opt => {
    t.is(det("An A-Z guide", opt).res, "An A\u2013Z guide");
  });
  mixer({
    convertDashes: 0,
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det("An A-Z guide", opt).res,
      "An A-Z guide",
      JSON.stringify(opt, null, 4)
    );
  });
});

//
//                             m dashes
//

test(`01.05 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - converts with encoding entities: +dashes-widows+entities`, t => {
  mixer({
    convertDashes: 1,
    removeWidows: 0,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det("some text - some more text", opt).res,
      "some text &mdash; some more text",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.06 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - converts without encoding entities: +dashes-widows-entities`, t => {
  mixer({
    convertDashes: 1,
    removeWidows: 0,
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det("some text - some more text", opt).res,
      "some text \u2014 some more text",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.07 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - does not convert: -dashes-widows`, t => {
  mixer({
    convertDashes: 0,
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det("some text - some more text", opt).res,
      "some text - some more text",
      JSON.stringify(opt, null, 4)
    );
  });
});

// example adapted from Oxford A-Z Grammar and Punctuation, p.46
test(`01.08 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - adds between two words`, t => {
  mixer({
    convertDashes: 1,
    removeWidows: 0,
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(
        "In brute material terms, he was an accomplice - in fact, a conspirator - to the clearing of the ice-cream fridge.",
        opt
      ).res,
      "In brute material terms, he was an accomplice \u2014 in fact, a conspirator \u2014 to the clearing of the ice-cream fridge.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.09 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities on`, t => {
  mixer({
    convertDashes: 1,
    removeWidows: 0,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(
        `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
        opt
      ).res,
      `I smiled and she said, &lsquo;You mean you want me to&mdash;&rsquo;`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.10 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - curly - convert entities off`, t => {
  mixer({
    convertDashes: 1,
    removeWidows: 0,
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(
        `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
        opt
      ).res,
      `I smiled and she said, ${leftSingleQuote}You mean you want me to\u2014${rightSingleQuote}`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.11 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities on`, t => {
  mixer({
    removeWidows: 0,
    convertEntities: 1,
    convertDashes: 1,
    convertApostrophes: 1
  }).forEach(opt => {
    t.is(
      det(`I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, &lsquo;You mean you want me to&mdash;&rsquo;`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    removeWidows: 0,
    convertEntities: 1,
    convertDashes: 1,
    convertApostrophes: 0
  }).forEach(opt => {
    t.is(
      det(`I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, 'You mean you want me to&mdash;'`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    removeWidows: 0,
    convertEntities: 1,
    convertDashes: 0,
    convertApostrophes: 1
  }).forEach(opt => {
    t.is(
      det(`I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, &lsquo;You mean you want me to-&rsquo;`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    removeWidows: 0,
    convertEntities: 1,
    convertDashes: 0,
    convertApostrophes: 0
  }).forEach(opt => {
    t.is(
      det(`I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, 'You mean you want me to-'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.12 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${31}m${`m-dash`}\u001b[${39}m - direct speech breaks off - straight - convert entities off`, t => {
  mixer({
    removeWidows: 0,
    convertEntities: 0,
    convertDashes: 1,
    convertApostrophes: 1
  }).forEach(opt => {
    t.is(
      det(`I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, ${leftSingleQuote}You mean you want me to\u2014${rightSingleQuote}`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    removeWidows: 0,
    convertEntities: 0,
    convertDashes: 1,
    convertApostrophes: 0
  }).forEach(opt => {
    t.is(
      det(`I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, 'You mean you want me to\u2014'`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    removeWidows: 0,
    convertEntities: 0,
    convertDashes: 0,
    convertApostrophes: 1
  }).forEach(opt => {
    t.is(
      det(`I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, ${leftSingleQuote}You mean you want me to-${rightSingleQuote}`,
      JSON.stringify(opt, null, 4)
    );
  });
  mixer({
    removeWidows: 0,
    convertEntities: 0,
    convertDashes: 0,
    convertApostrophes: 0
  }).forEach(opt => {
    t.is(
      det(`I smiled and she said, 'You mean you want me to-'`, opt).res,
      `I smiled and she said, 'You mean you want me to-'`,
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.13 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - if statements`, t => {
  allCombinations.forEach(opt => {
    t.is(
      det("zzz{% if something %}yyy", opt).res,
      "zzz{% if something %}yyy",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.14 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - variables`, t => {
  allCombinations.forEach(opt => {
    t.is(
      det("zzz{{ something }}yyy", opt).res,
      "zzz{{ something }}yyy",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.15 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - if statements`, t => {
  allCombinations.forEach(opt => {
    // with Nunjucks whitespace collapse hyphen:
    t.is(
      det("zzz{%- if something -%}yyy", opt).res,
      "zzz{%- if something -%}yyy",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.16 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - Jinja/Nunjucks code - collapsing variables`, t => {
  allCombinations.forEach(opt => {
    t.is(
      det("zzz{{- something -}}yyy", opt).res,
      "zzz{{- something -}}yyy",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.17 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - raw m-dash sanity check`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(det("m\u2014m", opt).res, "m\u2014m", JSON.stringify(opt, null, 4));
  });
});

test(`01.18 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - leaves minuses alone with convert entities option off`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(det("m-m", opt).res, "m-m", JSON.stringify(opt, null, 4));
  });
});

test(`01.19 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - leaves the m-dashes intact`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(det("m\u2014m", opt).res, "m&mdash;m", JSON.stringify(opt, null, 4));
  });
});

test(`01.20 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - leaves minuses alone with convert entities option on`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(det("m-m", opt).res, "m-m", JSON.stringify(opt, null, 4));
  });
});

test(`01.21 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - minus and number, too short to widow removal`, t => {
  mixer({
    convertEntities: 0
  }).forEach(opt => {
    t.is(det("Temperatures of -20°C", opt).res, "Temperatures of -20°C");
    t.is(det("-20°C", opt).res, "-20°C", JSON.stringify(opt, null, 4));
  });
});

test(`01.22 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - deg HTML entity`, t => {
  mixer({
    convertEntities: 1
  }).forEach(opt => {
    t.is(det("Temperatures of -20°C", opt).res, "Temperatures of -20&deg;C");
    t.is(det("-20°C", opt).res, "-20&deg;C", JSON.stringify(opt, null, 4));
  });
});

test(`01.23 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - deg HTML entity in a sentence - widows=on`, t => {
  mixer({
    convertEntities: 1,
    removeWidows: 1
  }).forEach(opt => {
    t.is(
      det("The records show that there were temperatures as low as -20°C", opt)
        .res,
      "The records show that there were temperatures as low as&nbsp;-20&deg;C",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.24 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - deg HTML entity in a sentence - widows=off`, t => {
  mixer({
    convertEntities: 1,
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det("The records show that there were temperatures as low as -20°C", opt)
        .res,
      "The records show that there were temperatures as low as -20&deg;C",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.25 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - minus and number, clashing with widow removal - widows=on, entities=off`, t => {
  mixer({
    convertEntities: 0,
    removeWidows: 1
  }).forEach(opt => {
    t.is(
      det("The records show that there were temperatures as low as -20°C", opt)
        .res,
      "The records show that there were temperatures as low as\u00A0-20°C",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.26 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - minus and number, clashing with widow removal - widows=off, entities=off`, t => {
  mixer({
    convertEntities: 0,
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det("The records show that there were temperatures as low as -20°C", opt)
        .res,
      "The records show that there were temperatures as low as -20°C",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.27 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - dashes between words, no spaces - no full stop`, t => {
  allCombinations.forEach(opt => {
    t.is(
      det("Stratford-upon-Avon", opt).res,
      "Stratford-upon-Avon",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.28 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - dashes between words, no spaces - no full stop, longer sentence`, t => {
  mixer({
    convertEntities: 1,
    removeWidows: 1
  }).forEach(opt => {
    t.is(
      det("One day we should visit Stratford-upon-Avon", opt).res,
      "One day we should visit&nbsp;Stratford-upon-Avon",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.29 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - dashes between words, no spaces - full stop`, t => {
  mixer({
    convertEntities: 1,
    removeWidows: 1
  }).forEach(opt => {
    t.is(
      det("One day we should visit Stratford-upon-Avon.", opt).res,
      "One day we should visit&nbsp;Stratford-upon-Avon.",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.30 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - dashes between words, no spaces - no full stop, widows=off`, t => {
  mixer({
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det("One day we should visit Stratford-upon-Avon", opt).res,
      "One day we should visit Stratford-upon-Avon",
      JSON.stringify(opt, null, 4)
    );
  });
});

test(`01.31 - \u001b[${35}m${`opts.convertDashes`}\u001b[${39}m - \u001b[${36}m${`insurance`}\u001b[${39}m - dashes between words, no spaces - full stop, widows=off`, t => {
  mixer({
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det("One day we should visit Stratford-upon-Avon.", opt).res,
      "One day we should visit Stratford-upon-Avon.",
      JSON.stringify(opt, null, 4)
    );
  });
});
