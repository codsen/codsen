// avanotonly

import test from "ava";
import { det, mixer, allCombinations } from "../t-util/util";
// import { det as det1 } from "../dist/detergent.esm";
import {
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  rawNbsp
  // rawhairspace,
  // rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote
} from "../dist/util.esm";

// 00 - minimal cases for MVP
// -----------------------------------------------------------------------------

test(`00.01 - minimal samples`, t => {
  t.is(
    det(t, 0, `aaa bbb ccc ddd`, {
      removeWidows: 1,
      convertEntities: 1
    }).res,
    `aaa bbb ccc&nbsp;ddd`,
    `00.01 - remove widows - entities, one line string no full stop`
  );
});

test(`00.02 - ETX processed twice, 2nd time during widow removal`, t => {
  t.is(
    det(t, 0, `aaa bbb ccc\u0003ddd`, {
      removeWidows: 1,
      convertEntities: 1,
      removeLineBreaks: 1
    }).res,
    `aaa bbb ccc&nbsp;ddd`,
    `00.02 - remove widows - entities, one line string no full stop`
  );
});

// 01 - full tests on all opts variations (mixer)
// -----------------------------------------------------------------------------

test(`01.01 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - four chunks of text #1 - convertEntities on`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `aaa bbb ccc ddd`, opt).res,
      `aaa bbb ccc&nbsp;ddd`,
      `01.01.01 - remove widows - entities, one line string no full stop`
    );
    t.is(
      det(t, n, `aaa bbb ccc ddd.`, opt).res,
      `aaa bbb ccc&nbsp;ddd.`,
      `01.01.02 - remove widows - entities, one line string with full stop`
    );
  });
});

test(`01.02 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - four chunks of text #1 - convertEntities off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `aaa bbb ccc ddd`, opt).res,
      `aaa bbb ccc${rawNbsp}ddd`,
      `01.02.01 - remove widows - no entities, one line string no full stop`
    );
    t.is(
      det(t, n, `aaa bbb ccc ddd.`, opt).res,
      `aaa bbb ccc${rawNbsp}ddd.`,
      `01.02.02 - remove widows - no entities, one line string with full stop`
    );
  });
});

test(`01.03 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - four chunks of text #1 - removeWidows off`, t => {
  mixer({
    removeWidows: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `aaa bbb ccc ddd`, opt).res,
      `aaa bbb ccc ddd`,
      `01.03.01 - don't remove widows - no full stop`
    );
    t.is(
      det(t, n, `aaa bbb ccc ddd.`, opt).res,
      `aaa bbb ccc ddd.`,
      `01.03.02 - don't remove widows - ending with full stop`
    );
  });
});

test(`01.04 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - useXHTML on`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc&nbsp;ddd<br/>\n<br/>\neee fff ggg&nbsp;hhh`,
      `01.04 - two line breaks with encoding BR in XHTML`
    );
  });
});

test(`01.05 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - useXHTML off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc&nbsp;ddd<br>\n<br>\neee fff ggg&nbsp;hhh`,
      `01.05 - two BR's, widows with NBSP and HTML BR`
    );
  });
});

test(`01.06 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - replaceLineBreaks off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc&nbsp;ddd\n\neee fff ggg&nbsp;hhh`,
      `01.06 - two BR's, widows replaced with &nbsp`
    );
  });
});

test(`01.07 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - convertEntities off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 0,
    replaceLineBreaks: 0,
    removeLineBreaks: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc${rawNbsp}ddd\n\neee fff ggg${rawNbsp}hhh`,
      `01.07 - two BR's, widows replaced with non-encoded NBSP`
    );
  });
});

test(`01.08 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - convertEntities on`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `aaa bbb ccc ddd\neee fff ggg hhh.`, opt).res,
      `aaa bbb ccc&nbsp;ddd\neee fff ggg&nbsp;hhh.`,
      `01.08.01`
    );
    t.is(
      det(t, n, `aaa bbb ccc ddd.\neee fff ggg hhh.`, opt).res,
      `aaa bbb ccc&nbsp;ddd.\neee fff ggg&nbsp;hhh.`,
      `01.08.02`
    );
  });
});

test(`01.09 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with trailing whitespace`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `aaa bbb ccc ddd. \n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc&nbsp;ddd.<br>\n<br>\neee fff ggg&nbsp;hhh`,
      `01.09 - remove widows - trailing space`
    );
  });
});

test(`01.10 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - glues UK postcodes - convertEntities on`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `Some text SW1A 1AA and some more text.`, opt).res,
      `Some text SW1A&nbsp;1AA and some more&nbsp;text.`,
      `01.10.01 - properly formatted UK postcode, in caps`
    );
    t.is(
      det(
        t,
        n,
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        opt
      ).res,
      `Some text SW1A&nbsp;1AA and some more text SW1A&nbsp;1AA and some more&nbsp;text.`,
      `01.10.02 - multiple properly formatted postcodes`
    );
    t.is(
      det(
        t,
        n,
        `This very long line of text ends with a postcode SW1A 1AA.`,
        opt
      ).res,
      `This very long line of text ends with a postcode SW1A&nbsp;1AA.`,
      `01.10.03 - line ends with a postcode (full stop)`
    );
    t.is(
      det(
        t,
        n,
        `this very long line of text ends with a postcode SW1A 1AA`,
        opt
      ).res,
      `this very long line of text ends with a postcode SW1A&nbsp;1AA`,
      `01.10.04 - line ends with a postcode (no full stop)`
    );
    t.is(
      det(
        t,
        n,
        `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`,
        opt
      ).res,
      `&#x1F984; some text text text SW1A&nbsp;1AA more text text text &#x1F984;&nbsp;aaa`,
      `01.10.05 - properly formatted UK postcode, some emoji`
    );
    t.is(
      det(t, n, `Some text SW1A 1Aa and some more text.`, opt).res,
      `Some text SW1A 1Aa and some more&nbsp;text.`,
      `01.10.06 - improperly formatted UK postcode`
    );
  });
});

test(`01.11 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - glues UK postcodes - convertEntities off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `Some text SW1A 1AA and some more text.`, opt).res,
      `Some text SW1A${rawNbsp}1AA and some more${rawNbsp}text.`,
      `01.11.01 - properly formatted UK postcode, in caps`
    );
    t.is(
      det(
        t,
        n,
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        opt
      ).res,
      `Some text SW1A${rawNbsp}1AA and some more text SW1A${rawNbsp}1AA and some more${rawNbsp}text.`,
      `01.11.02 - multiple properly formatted postcodes`
    );
    t.is(
      det(
        t,
        n,
        `This very long line of text ends with a postcode SW1A 1AA.`,
        opt
      ).res,
      `This very long line of text ends with a postcode SW1A${rawNbsp}1AA.`,
      `01.11.03 - line ends with a postcode (full stop)`
    );
    t.is(
      det(
        t,
        n,
        `this very long line of text ends with a postcode SW1A 1AA`,
        opt
      ).res,
      `this very long line of text ends with a postcode SW1A${rawNbsp}1AA`,
      `01.11.04 - line ends with a postcode (no full stop)`
    );
    t.is(
      det(
        t,
        n,
        `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`,
        opt
      ).res,
      `🦄 some text text text SW1A${rawNbsp}1AA more text text text 🦄${rawNbsp}aaa`,
      `01.11.05 - properly formatted UK postcode, some emoji`
    );
    t.is(
      det(t, n, `Some text SW1A 1Aa and some more text.`, opt).res,
      `Some text SW1A 1Aa and some more${rawNbsp}text.`,
      `01.11.06 - improperly formatted UK postcode`
    );
  });
});

test(`01.12 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - glues UK postcodes - removeWidows off`, t => {
  mixer({
    removeWidows: 0,
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `Some text SW1A 1AA and some more text.`, opt).res,
      `Some text SW1A 1AA and some more text.`,
      `01.12.01 - properly formatted UK postcode, in caps`
    );
    t.is(
      det(
        t,
        n,
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        opt
      ).res,
      `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
      `01.12.02 - multiple properly formatted postcodes`
    );
    t.is(
      det(
        t,
        n,
        `This very long line of text ends with a postcode SW1A 1AA.`,
        opt
      ).res,
      `This very long line of text ends with a postcode SW1A 1AA.`,
      `01.12.03 - line ends with a postcode (full stop)`
    );
    t.is(
      det(
        t,
        n,
        `this very long line of text ends with a postcode SW1A 1AA`,
        opt
      ).res,
      `this very long line of text ends with a postcode SW1A 1AA`,
      `01.12.04 - line ends with a postcode (no full stop)`
    );
    t.is(
      det(
        t,
        n,
        `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`,
        opt
      ).res,
      `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`,
      `01.12.05 - properly formatted UK postcode, some emoji`
    );
    t.is(
      det(t, n, `Some text SW1A 1Aa and some more text.`, opt).res,
      `Some text SW1A 1Aa and some more text.`,
      `01.12.06 - improperly formatted UK postcode`
    );
  });
});

test(`01.13 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        opt
      ).res,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `01.13 - there's right slash following them`
    );
  });
});

test(`01.14 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        opt
      ).res,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `01.14 - there's a known tag before them`
    );
  });
});

test(`01.15 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        opt
      ).res,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `01.15 - hr tag, xhtml style`
    );
  });
});

test(`01.16 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(
        t,
        n,
        `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        opt
      ).res,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `01.16 - hr tag, html style`
    );
  });
});

test(`01.17 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widow removal detects template code (Jinja/Nunjucks)`, t => {
  allCombinations.forEach((opt, n) => {
    t.is(
      det(t, n, `{% if something %}`, opt).res,
      `{% if something %}`,
      `01.17.01 - four chunks`
    );
    t.is(
      det(t, n, `{%- if something -%}`, opt).res,
      `{%- if something -%}`,
      `01.17.02 - dashes`
    );
    t.is(
      det(t, n, `{{ something }}`, opt).res,
      `{{ something }}`,
      `17.03 - three chunks`
    );
    t.is(
      det(t, n, `{% if something else and also another thing %}`, opt).res,
      `{% if something else and also another thing %}`,
      `17.04 - nine chunks`
    );
  });
});

test(`01.18 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows off`, t => {
  mixer({
    removeWidows: 0,
    convertDashes: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text - 9999`,
      `01.18`
    );
  });
});

test(`01.19 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows on`, t => {
  mixer({
    removeWidows: 1,
    convertDashes: 1,
    convertEntities: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text&nbsp;&mdash;&nbsp;9999`,
      `01.19`
    );
  });
});

test(`01.20 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows on`, t => {
  mixer({
    removeWidows: 1,
    convertDashes: 1,
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text${rawNbsp}\u2014${rawNbsp}9999`,
      `01.20`
    );
  });
});

test(`01.21 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows on`, t => {
  mixer({
    removeWidows: 0,
    convertDashes: 1,
    convertEntities: 1
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text &mdash; 9999`,
      `01.21`
    );
  });
});

test(`01.22 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows off`, t => {
  mixer({
    removeWidows: 0,
    convertDashes: 1,
    convertEntities: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text \u2014 9999`,
      `01.22`
    );
  });
});

// 02. HTML tags
// -----------------------------------------------------------------------------

test(`02.01 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    stripHtml: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `a a<a something="whatever" and="here">`, opt).res,
      `a a<a something="whatever" and="here">`,
      `02.01`
    );
  });
});

test(`02.02 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    stripHtml: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `a a <a something="whatever" and="here">`, opt).res,
      `a a <a something="whatever" and="here">`,
      `02.02`
    );
  });
});

test(`02.03 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    stripHtml: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `a a a<a something="whatever" and="here">`, opt).res,
      `a a a<a something="whatever" and="here">`,
      `02.03`
    );
  });
});

test(`02.04 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    stripHtml: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `a a a <a something="whatever" and="here">`, opt).res,
      `a a a <a something="whatever" and="here">`,
      `02.04`
    );
  });
});

test(`02.05 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    stripHtml: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `a a a a<a something="whatever" and="here">`, opt).res,
      `a a a&nbsp;a<a something="whatever" and="here">`,
      `02.05`
    );
  });
});

test(`02.06 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    stripHtml: 0
  }).forEach((opt, n) => {
    t.is(
      det(t, n, `a a a a <a something="whatever" and="here">`, opt).res,
      `a a a a&nbsp;<a something="whatever" and="here">`,
      `02.06`
    );
  });
});
