import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// import { det as detergent } from "../dist/detergent.esm.js";
import {
  det,
  mixer,
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  rawNbsp,
  // rawhairspace,
  // rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote
} from "../t-util/util.js";

// 00 - minimal cases for MVP
// -----------------------------------------------------------------------------

test(`01 - minimal samples`, () => {
  equal(
    det(ok, not, 0, `aaa bbb ccc ddd`, {
      removeWidows: true,
      convertEntities: true,
    }).res,
    `aaa bbb ccc&nbsp;ddd`,
    `01.01 - remove widows - entities, one line string no full stop`
  );
});

test(`02 - ETX processed twice, 2nd time during widow removal`, () => {
  equal(
    det(ok, not, 0, `aaa bbb ccc\u0003ddd`, {
      removeWidows: true,
      convertEntities: true,
      removeLineBreaks: true,
    }).res,
    `aaa bbb ccc&nbsp;ddd`,
    `02.01 - remove widows - entities, one line string no full stop`
  );
});

// 01 - full tests on all opts variations (mixer)
// -----------------------------------------------------------------------------

test(`03 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - four chunks of text #1 - convertEntities on`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa bbb ccc ddd`, opt).res,
      `aaa bbb ccc&nbsp;ddd`,
      `01.01.01 - remove widows - entities, one line string no full stop`
    );
    equal(
      det(ok, not, n, `aaa bbb ccc ddd.`, opt).res,
      `aaa bbb ccc&nbsp;ddd.`,
      `01.01.02 - remove widows - entities, one line string with full stop`
    );
  });
});

test(`04 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - four chunks of text #1 - convertEntities off`, () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa bbb ccc ddd`, opt).res,
      `aaa bbb ccc${rawNbsp}ddd`,
      `01.02.01 - remove widows - no entities, one line string no full stop`
    );
    equal(
      det(ok, not, n, `aaa bbb ccc ddd.`, opt).res,
      `aaa bbb ccc${rawNbsp}ddd.`,
      `01.02.02 - remove widows - no entities, one line string with full stop`
    );
  });
});

test(`05 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - four chunks of text #1 - removeWidows off`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa bbb ccc ddd`, opt).res,
      `aaa bbb ccc ddd`,
      `01.03.01 - don't remove widows - no full stop`
    );
    equal(
      det(ok, not, n, `aaa bbb ccc ddd.`, opt).res,
      `aaa bbb ccc ddd.`,
      `01.03.02 - don't remove widows - ending with full stop`
    );
  });
});

test(`06 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - useXHTML on`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc&nbsp;ddd<br/>\n<br/>\neee fff ggg&nbsp;hhh`,
      `01.04 - two line breaks with encoding BR in XHTML`
    );
  });
});

test(`07 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - useXHTML off`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc&nbsp;ddd<br>\n<br>\neee fff ggg&nbsp;hhh`,
      `01.05 - two BR's, widows with NBSP and HTML BR`
    );
  });
});

test(`08 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - replaceLineBreaks off`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc&nbsp;ddd\n\neee fff ggg&nbsp;hhh`,
      `01.06 - two BR's, widows replaced with &nbsp`
    );
  });
});

test(`09 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - convertEntities off`, () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc${rawNbsp}ddd\n\neee fff ggg${rawNbsp}hhh`,
      `01.07 - two BR's, widows replaced with non-encoded NBSP`
    );
  });
});

test(`10 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - convertEntities on`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa bbb ccc ddd\neee fff ggg hhh.`, opt).res,
      `aaa bbb ccc&nbsp;ddd\neee fff ggg&nbsp;hhh.`,
      `01.08.01`
    );
    equal(
      det(ok, not, n, `aaa bbb ccc ddd.\neee fff ggg hhh.`, opt).res,
      `aaa bbb ccc&nbsp;ddd.\neee fff ggg&nbsp;hhh.`,
      `01.08.02`
    );
  });
});

test(`11 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with trailing whitespace`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `aaa bbb ccc ddd. \n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc&nbsp;ddd.<br>\n<br>\neee fff ggg&nbsp;hhh`,
      `01.09 - remove widows - trailing space`
    );
  });
});

test(`12 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - glues UK postcodes - convertEntities on`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `Some text SW1A 1AA and some more text.`, opt).res,
      `Some text SW1A&nbsp;1AA and some more&nbsp;text.`,
      `01.10.01 - properly formatted UK postcode, in caps`
    );
    equal(
      det(
        ok,
        not,
        n,
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        opt
      ).res,
      `Some text SW1A&nbsp;1AA and some more text SW1A&nbsp;1AA and some more&nbsp;text.`,
      `01.10.02 - multiple properly formatted postcodes`
    );
    equal(
      det(
        ok,
        not,
        n,
        `This very long line of text ends with a postcode SW1A 1AA.`,
        opt
      ).res,
      `This very long line of text ends with a postcode SW1A&nbsp;1AA.`,
      `01.10.03 - line ends with a postcode (full stop)`
    );
    equal(
      det(
        ok,
        not,
        n,
        `this very long line of text ends with a postcode SW1A 1AA`,
        opt
      ).res,
      `this very long line of text ends with a postcode SW1A&nbsp;1AA`,
      `01.10.04 - line ends with a postcode (no full stop)`
    );
    equal(
      det(
        ok,
        not,
        n,
        `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`,
        opt
      ).res,
      `&#x1F984; some text text text SW1A&nbsp;1AA more text text text &#x1F984;&nbsp;aaa`,
      `01.10.05 - properly formatted UK postcode, some emoji`
    );
    equal(
      det(ok, not, n, `Some text SW1A 1Aa and some more text.`, opt).res,
      `Some text SW1A 1Aa and some more&nbsp;text.`,
      `01.10.06 - improperly formatted UK postcode`
    );
  });
});

test(`13 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - glues UK postcodes - convertEntities off`, () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `Some text SW1A 1AA and some more text.`, opt).res,
      `Some text SW1A${rawNbsp}1AA and some more${rawNbsp}text.`,
      `01.11.01 - properly formatted UK postcode, in caps`
    );
    equal(
      det(
        ok,
        not,
        n,
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        opt
      ).res,
      `Some text SW1A${rawNbsp}1AA and some more text SW1A${rawNbsp}1AA and some more${rawNbsp}text.`,
      `01.11.02 - multiple properly formatted postcodes`
    );
    equal(
      det(
        ok,
        not,
        n,
        `This very long line of text ends with a postcode SW1A 1AA.`,
        opt
      ).res,
      `This very long line of text ends with a postcode SW1A${rawNbsp}1AA.`,
      `01.11.03 - line ends with a postcode (full stop)`
    );
    equal(
      det(
        ok,
        not,
        n,
        `this very long line of text ends with a postcode SW1A 1AA`,
        opt
      ).res,
      `this very long line of text ends with a postcode SW1A${rawNbsp}1AA`,
      `01.11.04 - line ends with a postcode (no full stop)`
    );
    equal(
      det(
        ok,
        not,
        n,
        `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`,
        opt
      ).res,
      `🦄 some text text text SW1A${rawNbsp}1AA more text text text 🦄${rawNbsp}aaa`,
      `01.11.05 - properly formatted UK postcode, some emoji`
    );
    equal(
      det(ok, not, n, `Some text SW1A 1Aa and some more text.`, opt).res,
      `Some text SW1A 1Aa and some more${rawNbsp}text.`,
      `01.11.06 - improperly formatted UK postcode`
    );
  });
});

test(`14 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - glues UK postcodes - removeWidows off`, () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `Some text SW1A 1AA and some more text.`, opt).res,
      `Some text SW1A 1AA and some more text.`,
      `01.12.01 - properly formatted UK postcode, in caps`
    );
    equal(
      det(
        ok,
        not,
        n,
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        opt
      ).res,
      `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
      `01.12.02 - multiple properly formatted postcodes`
    );
    equal(
      det(
        ok,
        not,
        n,
        `This very long line of text ends with a postcode SW1A 1AA.`,
        opt
      ).res,
      `This very long line of text ends with a postcode SW1A 1AA.`,
      `01.12.03 - line ends with a postcode (full stop)`
    );
    equal(
      det(
        ok,
        not,
        n,
        `this very long line of text ends with a postcode SW1A 1AA`,
        opt
      ).res,
      `this very long line of text ends with a postcode SW1A 1AA`,
      `01.12.04 - line ends with a postcode (no full stop)`
    );
    equal(
      det(
        ok,
        not,
        n,
        `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`,
        opt
      ).res,
      `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`,
      `01.12.05 - properly formatted UK postcode, some emoji`
    );
    equal(
      det(ok, not, n, `Some text SW1A 1Aa and some more text.`, opt).res,
      `Some text SW1A 1Aa and some more text.`,
      `01.12.06 - improperly formatted UK postcode`
    );
  });
});

test(`15 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        opt
      ).res,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `01.13 - there's right slash following them`
    );
  });
});

test(`16 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        opt
      ).res,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `01.14 - there's a known tag before them`
    );
  });
});

test(`17 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        opt
      ).res,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `01.15 - hr tag, xhtml style`
    );
  });
});

test(`18 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        opt
      ).res,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `01.16 - hr tag, html style`
    );
  });
});

test(`19 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widow removal detects template code (Jinja/Nunjucks)`, () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, `{% if something %}`, opt).res,
      `{% if something %}`,
      `01.17.01 - four chunks`
    );
    equal(
      det(ok, not, n, `{%- if something -%}`, opt).res,
      `{%- if something -%}`,
      `01.17.02 - dashes`
    );
    equal(
      det(ok, not, n, `{{ something }}`, opt).res,
      `{{ something }}`,
      `17.03 - three chunks`
    );
    equal(
      det(ok, not, n, `{% if something else and also another thing %}`, opt)
        .res,
      `{% if something else and also another thing %}`,
      `17.04 - nine chunks`
    );
  });
});

test(`20 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows off`, () => {
  mixer({
    removeWidows: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text - 9999`,
      `01.18`
    );
  });
});

test(`21 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows on`, () => {
  mixer({
    removeWidows: true,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text&nbsp;&mdash;&nbsp;9999`,
      `01.19`
    );
  });
});

test(`22 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows on`, () => {
  mixer({
    removeWidows: true,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text${rawNbsp}\u2014${rawNbsp}9999`,
      `01.20`
    );
  });
});

test(`23 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows on`, () => {
  mixer({
    removeWidows: false,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text &mdash; 9999`,
      `01.21`
    );
  });
});

test(`24 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows off`, () => {
  mixer({
    removeWidows: false,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text \u2014 9999`,
      `01.22`
    );
  });
});

// 02. HTML tags
// -----------------------------------------------------------------------------

test(`25 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a a<a something="whatever" and="here">`, opt).res,
      `a a<a something="whatever" and="here">`,
      `02.01`
    );
  });
});

test(`26 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a a <a something="whatever" and="here">`, opt).res,
      `a a <a something="whatever" and="here">`,
      `02.02`
    );
  });
});

test(`27 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a a a<a something="whatever" and="here">`, opt).res,
      `a a a<a something="whatever" and="here">`,
      `02.03`
    );
  });
});

test(`28 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a a a <a something="whatever" and="here">`, opt).res,
      `a a a <a something="whatever" and="here">`,
      `02.04`
    );
  });
});

test(`29 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a a a a<a something="whatever" and="here">`, opt).res,
      `a a a&nbsp;a<a something="whatever" and="here">`,
      `02.05`
    );
  });
});

test(`30 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`, () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `a a a a <a something="whatever" and="here">`, opt).res,
      `a a a a&nbsp;<a something="whatever" and="here">`,
      `02.06`
    );
  });
});

test(`31`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, `The quick brown&nbsp;fox. What an amazing animal!`, opt)
        .res,
      `The quick brown fox. What an amazing animal!`,
      `02.06`
    );
  });
});

test(`32`, () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        `The quick brown&nbsp;fox. What an amazing&nbsp;animal!`,
        opt
      ).res,
      `The quick brown fox. What an amazing animal!`,
      `02.06`
    );
  });
});

test.run();
