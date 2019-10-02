// avanotonly

import test from "ava";
import { det, mixer, allCombinations } from "../t-util/util";
// import { det as det1 } from "../dist/detergent.esm";
import {
  leftSingleQuote,
  rightSingleQuote,
  leftDoubleQuote,
  rightDoubleQuote,
  rawEllipsis
} from "../dist/util.esm";

// 01. reports could opts.fixBrokenEntities be applicable
// -----------------------------------------------------------------------------

test(`01.01 - \u001b[${35}m${`opts.fixBrokenEntities`}\u001b[${39}m - error present`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "abc&nspdef", opt).applicableOpts.fixBrokenEntities,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`01.02 - \u001b[${35}m${`opts.fixBrokenEntities`}\u001b[${39}m - error not present #1`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "&nbsp;", opt).applicableOpts.fixBrokenEntities,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`01.03 - \u001b[${35}m${`opts.fixBrokenEntities`}\u001b[${39}m - error not present #2`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "Some text", opt).applicableOpts.fixBrokenEntities,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`01.04 - \u001b[${35}m${`opts.fixBrokenEntities`}\u001b[${39}m - error not present #3`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "", opt).applicableOpts.fixBrokenEntities,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

// 02. reports could opts.removeWidows be applicable
// -----------------------------------------------------------------------------

test(`02.01 - \u001b[${31}m${`opts.removeWidows`}\u001b[${39}m - widow word case, between words`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "aaa bbb ccc ddd", opt).applicableOpts.removeWidows,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`02.02 - \u001b[${31}m${`opts.removeWidows`}\u001b[${39}m - widow word case, in front of dash`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "Some text And Some Text -&nbsp;9999", opt).applicableOpts
        .removeWidows,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`02.03 - \u001b[${31}m${`opts.removeWidows`}\u001b[${39}m - widow word case, UK postcode`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "abc SW1A 1AA def", opt).applicableOpts.removeWidows,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`02.04 - \u001b[${31}m${`opts.removeWidows`}\u001b[${39}m - not a widow word case #1`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "slfhdjgdhfgdfhkd", opt).applicableOpts.removeWidows,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`02.05 - \u001b[${31}m${`opts.removeWidows`}\u001b[${39}m - not a widow word case #2`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "\n\n\n\t\t\t      \n\n\n", opt).applicableOpts.removeWidows,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`02.06 - \u001b[${31}m${`opts.removeWidows`}\u001b[${39}m - not a widow word case #3`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "", opt).applicableOpts.removeWidows,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`02.07 - \u001b[${31}m${`opts.removeWidows`}\u001b[${39}m - hyphen case 1, considering opts.convertDashes can be on or off`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "a - b", opt).applicableOpts.removeWidows,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`02.08 - \u001b[${31}m${`opts.removeWidows`}\u001b[${39}m - hyphen case 2, considering opts.convertDashes can be on or off`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, "a-b", opt).applicableOpts.removeWidows,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

// 03. reports could opts.convertEntities be applicable
// -----------------------------------------------------------------------------

test(`03.01 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - within ASCII, never encoded - straight quote`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `'`, opt).applicableOpts.convertEntities,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.02 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - within ASCII, invisible`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `\u0001`, opt).applicableOpts.convertEntities,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.03 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - outside ASCII, pound`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `£`, opt).applicableOpts.convertEntities,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.04 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - outside ASCII, Ą`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `Ą`, opt).applicableOpts.convertEntities,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`03.05 - \u001b[${33}m${`opts.convertEntities`}\u001b[${39}m - encoded non-breaking space`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `&nbsp;`, opt).applicableOpts.convertEntities,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

// 04. reports could opts.convertDashes be applicable
// -----------------------------------------------------------------------------

test(`04.01 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - just text`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `sflj ldjflgk jlkfjghf lfhl`, opt).applicableOpts.convertDashes,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`04.02 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - empty`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, ``, opt).applicableOpts.convertDashes,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`04.03 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - n-dash case`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `Ranges 1-2`, opt).applicableOpts.convertDashes,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`04.04 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - m-dash case`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `Ranges - best solution.`, opt).applicableOpts.convertDashes,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`04.05 - \u001b[${32}m${`opts.convertDashes`}\u001b[${39}m - legit minus`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `1 - 2 = 3`, opt).applicableOpts.convertDashes,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

// 05. reports could opts.convertApostrophes be applicable
// -----------------------------------------------------------------------------

test(`05.01 - \u001b[${36}m${`opts.convertApostrophes`}\u001b[${39}m - just text`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `sflj ldjflgk jlkfjghf lfhl`, opt).applicableOpts
        .convertApostrophes,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05.02 - \u001b[${36}m${`opts.convertApostrophes`}\u001b[${39}m - empty`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, ``, opt).applicableOpts.convertApostrophes,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05.03 - \u001b[${36}m${`opts.convertApostrophes`}\u001b[${39}m - 3rd person`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `she's good`, opt).applicableOpts.convertApostrophes,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05.04 - \u001b[${36}m${`opts.convertApostrophes`}\u001b[${39}m - possessive`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `the particular citizen's debt`, opt).applicableOpts
        .convertApostrophes,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05.05 - \u001b[${36}m${`opts.convertApostrophes`}\u001b[${39}m - 3rd person`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `so-called "ownership"`, opt).applicableOpts.convertApostrophes,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05.06 - \u001b[${36}m${`opts.convertApostrophes`}\u001b[${39}m - 3rd person`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `not very 'legit', how they say`, opt).applicableOpts
        .convertApostrophes,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05.07 - \u001b[${36}m${`opts.convertApostrophes`}\u001b[${39}m - raw lsquo`, t => {
  mixer({
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, leftSingleQuote, opt).res,
      leftSingleQuote,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05.08 - \u001b[${36}m${`opts.convertApostrophes`}\u001b[${39}m - raw rsquo`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, rightSingleQuote, opt).applicableOpts.convertApostrophes,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05.09 - \u001b[${36}m${`opts.convertApostrophes`}\u001b[${39}m - raw ldquo`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, leftDoubleQuote, opt).applicableOpts.convertApostrophes,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`05.10 - \u001b[${36}m${`opts.convertApostrophes`}\u001b[${39}m - raw rdquo`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, rightDoubleQuote, opt).applicableOpts.convertApostrophes,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

// 06. reports could opts.replaceLineBreaks be applicable
// -----------------------------------------------------------------------------

test(`06.01 - \u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m - just text`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `sflj ldjflgk jlkfjghf lfhl`, opt).applicableOpts
        .replaceLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`06.02 - \u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m - empty`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, ``, opt).applicableOpts.replaceLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`06.03 - \u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m - single line break gets trimmed`, t => {
  allCombinations.forEach((opt, n) => {
    // LF
    t.is(
      det(t, n, `\n`, opt).applicableOpts.replaceLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
    // CR
    t.is(
      det(t, n, `\r`, opt).applicableOpts.replaceLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
    // CRLF
    t.is(
      det(t, n, `\r\n`, opt).applicableOpts.replaceLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`06.04 - \u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m - more line breaks`, t => {
  allCombinations.forEach((opt, n) => {
    // LF
    t.is(
      det(t, n, `\n\n\n`, opt).applicableOpts.replaceLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
    // CR
    t.is(
      det(t, n, `\r\r\r`, opt).applicableOpts.replaceLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
    // CRLF
    t.is(
      det(t, n, `\r\n\r\n\r\n`, opt).applicableOpts.replaceLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`06.05 - \u001b[${34}m${`opts.replaceLineBreaks`}\u001b[${39}m - single line break`, t => {
  allCombinations.forEach((opt, n) => {
    // LF
    t.is(
      det(t, n, `a\nb`, opt).applicableOpts.replaceLineBreaks,
      true,
      JSON.stringify(opt, null, 0)
    );
    // CR
    t.is(
      det(t, n, `a\rb`, opt).applicableOpts.replaceLineBreaks,
      true,
      JSON.stringify(opt, null, 0)
    );
    // CRLF
    t.is(
      det(t, n, `a\r\nb`, opt).applicableOpts.replaceLineBreaks,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

// 07. reports could opts.removeLineBreaks be applicable
// -----------------------------------------------------------------------------

test(`07.01 - \u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m - just text`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `sflj ldjflgk jlkfjghf lfhl`, opt).applicableOpts.removeLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.02 - \u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m - empty`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, ``, opt).applicableOpts.removeLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.03 - \u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m - single line break just gets trimmed`, t => {
  allCombinations.forEach((opt, n) => {
    // LF
    t.is(
      det(t, n, `\n`, opt).applicableOpts.removeLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
    // CR
    t.is(
      det(t, n, `\r`, opt).applicableOpts.removeLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
    // CRLF
    t.is(
      det(t, n, `\r\n`, opt).applicableOpts.removeLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.04 - \u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m - more line breaks`, t => {
  allCombinations.forEach((opt, n) => {
    // LF
    t.is(
      det(t, n, `\n\n\n`, opt).applicableOpts.removeLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
    // CR
    t.is(
      det(t, n, `\r\r\r`, opt).applicableOpts.removeLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
    // CRLF
    t.is(
      det(t, n, `\r\n\r\n\r\n`, opt).applicableOpts.removeLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.05 - \u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m - single line break`, t => {
  allCombinations.forEach((opt, n) => {
    // LF
    t.is(
      det(t, n, `a\nb`, opt).applicableOpts.removeLineBreaks,
      true,
      JSON.stringify(opt, null, 0)
    );
    // CR
    t.is(
      det(t, n, `a\rb`, opt).applicableOpts.removeLineBreaks,
      true,
      JSON.stringify(opt, null, 0)
    );
    // CRLF
    t.is(
      det(t, n, `a\r\nb`, opt).applicableOpts.removeLineBreaks,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`07.06 - \u001b[${35}m${`opts.removeLineBreaks`}\u001b[${39}m - br`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `a<br>b`, opt).applicableOpts.removeLineBreaks,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

// 08. reports could opts.useXHTML be applicable
// -----------------------------------------------------------------------------

test(`08.01 - \u001b[${31}m${`opts.useXHTML`}\u001b[${39}m - just text`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `sflj ldjflgk jlkfjghf lfhl`, opt).applicableOpts.useXHTML,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`08.02 - \u001b[${31}m${`opts.useXHTML`}\u001b[${39}m - empty`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, ``, opt).applicableOpts.useXHTML,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`08.03 - \u001b[${31}m${`opts.useXHTML`}\u001b[${39}m - line breaks`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `a\nb`, opt).applicableOpts.useXHTML,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`08.04 - \u001b[${31}m${`opts.useXHTML`}\u001b[${39}m - ignored self-closing tag br`, t => {
  const calculated1 = det(t, n, `a<br>b`, {
    fixBrokenEntities: 0,
    removeWidows: 0,
    convertEntities: 0,
    convertDashes: 0,
    convertApostrophes: 0,
    replaceLineBreaks: 0,
    removeLineBreaks: 1,
    useXHTML: 0, // <--------------- useXHTML
    dontEncodeNonLatin: 0,
    addMissingSpaces: 0,
    convertDotsToEllipsis: 0,
    stripHtml: 0,
    stripHtmlButIgnoreTags: ["b", "strong", "i", "em", "br", "sup"]
  });
  t.deepEqual(calculated1, {
    res: `a<br>b`,
    applicableOpts: {
      addMissingSpaces: false,
      convertApostrophes: false,
      convertDashes: false,
      convertDotsToEllipsis: false,
      convertEntities: false,
      dontEncodeNonLatin: false,
      fixBrokenEntities: false,
      removeLineBreaks: false,
      removeWidows: false,
      replaceLineBreaks: false,
      stripHtml: true,
      useXHTML: true
    }
  });
});

test(`08.05 - \u001b[${31}m${`opts.useXHTML`}\u001b[${39}m - ignored self-closing tag br`, t => {
  const calculated2 = det(t, n, `a<br>b`, {
    fixBrokenEntities: 0,
    removeWidows: 0,
    convertEntities: 0,
    convertDashes: 0,
    convertApostrophes: 0,
    replaceLineBreaks: 0,
    removeLineBreaks: 1,
    useXHTML: 1, // <--------------- useXHTML
    dontEncodeNonLatin: 0,
    addMissingSpaces: 0,
    convertDotsToEllipsis: 0,
    stripHtml: 0,
    stripHtmlButIgnoreTags: ["b", "strong", "i", "em", "br", "sup"]
  });
  t.deepEqual(calculated2, {
    res: `a<br/>b`,
    applicableOpts: {
      addMissingSpaces: false,
      convertApostrophes: false,
      convertDashes: false,
      convertDotsToEllipsis: false,
      convertEntities: false,
      dontEncodeNonLatin: false,
      fixBrokenEntities: false,
      removeLineBreaks: false,
      removeWidows: false,
      replaceLineBreaks: false,
      stripHtml: true,
      useXHTML: true
    }
  });
});

test(`08.06 - \u001b[${31}m${`opts.useXHTML`}\u001b[${39}m - ignored self-closing tag br`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `a<br>b`, opt).applicableOpts.useXHTML,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`08.07 - \u001b[${31}m${`opts.useXHTML`}\u001b[${39}m - not ignored self-closing tag br`, t => {
  mixer({
    stripHtml: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `a<hr>b`, opt).applicableOpts.useXHTML,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

// 09. reports could opts.dontEncodeNonLatin be applicable
// -----------------------------------------------------------------------------

test(`09.01 - \u001b[${33}m${`opts.dontEncodeNonLatin`}\u001b[${39}m - just text`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `sflj ldjflgk jlkfjghf lfhl`, opt).applicableOpts
        .dontEncodeNonLatin,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`09.02 - \u001b[${33}m${`opts.dontEncodeNonLatin`}\u001b[${39}m - empty`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, ``, opt).applicableOpts.dontEncodeNonLatin,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`09.03 - \u001b[${33}m${`opts.dontEncodeNonLatin`}\u001b[${39}m - mixed`, t => {
  allCombinations.forEach((opt, n) => {
    [
      "\u03A1",
      "\u03CC",
      "\u03B9",
      "\u03C3",
      "\u03C4",
      "\u03BF",
      "\u03BD",
      "\u03B5",
      "\u03B4",
      "\u03CE",
      "\u0420",
      "\u043E",
      "\u0438",
      "\u0441",
      "\u0442",
      "\u043E",
      "\u043D",
      "\u30ED",
      "\u30A4",
      "\u30B9",
      "\u30C8",
      "\u30F3",
      "\u7F85",
      "\u4F0A",
      "\u65AF",
      "\u9813",
      "\u05E8",
      "\u05D5",
      "\u05D9",
      "\u05E1",
      "\u05D8",
      "\u05D5",
      "\u05DF",
      "\u0631",
      "\u0648",
      "\u064A",
      "\u0633",
      "\u062A",
      "\u0648",
      "\u0646"
    ].forEach(char => {
      t.is(
        det(t, n, char, opt).applicableOpts.dontEncodeNonLatin,
        true,
        `${char} + ${JSON.stringify(opt, null, 0)}`
      );
    });
  });
});

test(`09.04 - \u001b[${33}m${`opts.dontEncodeNonLatin`}\u001b[${39}m - a`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `a`, opt).applicableOpts.dontEncodeNonLatin,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`09.05 - \u001b[${33}m${`opts.dontEncodeNonLatin`}\u001b[${39}m - č`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `č`, opt).applicableOpts.dontEncodeNonLatin,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`09.06 - \u001b[${33}m${`opts.dontEncodeNonLatin`}\u001b[${39}m - =`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `=`, opt).applicableOpts.dontEncodeNonLatin,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`09.07 - \u001b[${33}m${`opts.dontEncodeNonLatin`}\u001b[${39}m - 2`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `2`, opt).applicableOpts.dontEncodeNonLatin,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

// 10. reports could opts.addMissingSpaces be applicable
// -----------------------------------------------------------------------------

test(`10.01 - \u001b[${32}m${`opts.addMissingSpaces`}\u001b[${39}m - just text`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `sflj ldjflgk jlkfjghf lfhl`, opt).applicableOpts.addMissingSpaces,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10.02 - \u001b[${32}m${`opts.addMissingSpaces`}\u001b[${39}m - empty`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, ``, opt).applicableOpts.addMissingSpaces,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10.03 - \u001b[${32}m${`opts.addMissingSpaces`}\u001b[${39}m - empty`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `1-2 1 - 2`, opt).applicableOpts.addMissingSpaces,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10.04 - \u001b[${32}m${`opts.addMissingSpaces`}\u001b[${39}m - after n-dash`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `10am &ndash;11am`, opt).applicableOpts.addMissingSpaces,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10.05 - \u001b[${32}m${`opts.addMissingSpaces`}\u001b[${39}m - URL`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `This is http://detergent.io.This is cool.`, opt).applicableOpts
        .addMissingSpaces,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`10.06 - \u001b[${32}m${`opts.addMissingSpaces`}\u001b[${39}m - comma in a sentence`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `Text,more text.`, opt).applicableOpts.addMissingSpaces,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

// 11. reports could opts.convertDotsToEllipsis be applicable
// -----------------------------------------------------------------------------

test(`11.01 - \u001b[${36}m${`opts.convertDotsToEllipsis`}\u001b[${39}m - normal text`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `sflj ldjflgk jlkfjghf lfhl`, opt).applicableOpts
        .convertDotsToEllipsis,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`11.02 - \u001b[${36}m${`opts.convertDotsToEllipsis`}\u001b[${39}m - empty`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, ``, opt).applicableOpts.convertDotsToEllipsis,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`11.03 - \u001b[${36}m${`opts.convertDotsToEllipsis`}\u001b[${39}m - hellip`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `text&hellip;`, opt).applicableOpts.convertDotsToEllipsis,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`11.04 - \u001b[${36}m${`opts.convertDotsToEllipsis`}\u001b[${39}m - hellip`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `it must mean something...`, opt).applicableOpts
        .convertDotsToEllipsis,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`11.05 - \u001b[${36}m${`opts.convertDotsToEllipsis`}\u001b[${39}m - hellip`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `it must mean something...\n\nalso...\n\nzzz`, opt).applicableOpts
        .convertDotsToEllipsis,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`11.06 - \u001b[${36}m${`opts.convertDotsToEllipsis`}\u001b[${39}m - raw ellipsis`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, rawEllipsis, opt).applicableOpts.convertDotsToEllipsis,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

// 12. reports could opts.stripHtml be applicable
// -----------------------------------------------------------------------------

test(`12.01 - \u001b[${34}m${`opts.stripHtml`}\u001b[${39}m - normal text`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `sflj ldjflgk jlkfjghf lfhl`, opt).applicableOpts.stripHtml,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`12.02 - \u001b[${34}m${`opts.stripHtml`}\u001b[${39}m - empty`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, ``, opt).applicableOpts.stripHtml,
      false,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`12.03 - \u001b[${34}m${`opts.stripHtml`}\u001b[${39}m - single unrecognised tag`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `<zzz>`, opt).applicableOpts.stripHtml,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`12.04 - \u001b[${34}m${`opts.stripHtml`}\u001b[${39}m - single br`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `<br>`, opt).applicableOpts.stripHtml,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`12.05 - \u001b[${34}m${`opts.stripHtml`}\u001b[${39}m - single sup`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `<sup>`, opt).applicableOpts.stripHtml,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});

test(`12.06 - \u001b[${34}m${`opts.stripHtml`}\u001b[${39}m - single sup`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `<sup>`, opt).applicableOpts.stripHtml,
      true,
      JSON.stringify(opt, null, 0)
    );
  });
});
