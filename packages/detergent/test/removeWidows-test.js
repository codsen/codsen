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

test(`00 - minimal samples`, t => {
  t.is(
    det(t, `aaa bbb ccc ddd`, {
      removeWidows: 1,
      convertEntities: 1
    }).res,
    `aaa bbb ccc&nbsp;ddd`,
    `01.01 - remove widows - entities, one line string no full stop`
  );
});

test(`01 - ETX processed twice, 2nd time during widow removal`, t => {
  t.is(
    det(t, `aaa bbb ccc\u0003ddd`, {
      removeWidows: 1,
      convertEntities: 1,
      removeLineBreaks: 1
    }).res,
    `aaa bbb ccc&nbsp;ddd`,
    `01.01 - remove widows - entities, one line string no full stop`
  );
});

// 01 - full tests on all opts variations (mixer)
// -----------------------------------------------------------------------------

test(`01 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - four chunks of text #1 - convertEntities on`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(t, `aaa bbb ccc ddd`, opt).res,
      `aaa bbb ccc&nbsp;ddd`,
      `01.01 - remove widows - entities, one line string no full stop`
    );
    t.is(
      det(t, `aaa bbb ccc ddd.`, opt).res,
      `aaa bbb ccc&nbsp;ddd.`,
      `01.02 - remove widows - entities, one line string with full stop`
    );
  });
});

test(`02 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - four chunks of text #1 - convertEntities off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(t, `aaa bbb ccc ddd`, opt).res,
      `aaa bbb ccc${rawNbsp}ddd`,
      `02.01 - remove widows - no entities, one line string no full stop`
    );
    t.is(
      det(t, `aaa bbb ccc ddd.`, opt).res,
      `aaa bbb ccc${rawNbsp}ddd.`,
      `02.02 - remove widows - no entities, one line string with full stop`
    );
  });
});

test(`03 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - four chunks of text #1 - removeWidows off`, t => {
  mixer({
    removeWidows: 0
  }).forEach(opt => {
    t.is(
      det(t, `aaa bbb ccc ddd`, opt).res,
      `aaa bbb ccc ddd`,
      `03.01 - don't remove widows - no full stop`
    );
    t.is(
      det(t, `aaa bbb ccc ddd.`, opt).res,
      `aaa bbb ccc ddd.`,
      `03.02 - don't remove widows - ending with full stop`
    );
  });
});

test(`04 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - useXHTML on`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 1
  }).forEach(opt => {
    t.is(
      det(t, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc&nbsp;ddd<br/>\n<br/>\neee fff ggg&nbsp;hhh`,
      `04 - two line breaks with encoding BR in XHTML`
    );
  });
});

test(`05 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - useXHTML off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 0
  }).forEach(opt => {
    t.is(
      det(t, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc&nbsp;ddd<br>\n<br>\neee fff ggg&nbsp;hhh`,
      `05 - two BR's, widows with NBSP and HTML BR`
    );
  });
});

test(`06 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - replaceLineBreaks off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0
  }).forEach(opt => {
    t.is(
      det(t, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc&nbsp;ddd\n\neee fff ggg&nbsp;hhh`,
      `06 - two BR's, widows replaced with &nbsp`
    );
  });
});

test(`07 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - convertEntities off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 0,
    replaceLineBreaks: 0,
    removeLineBreaks: 0
  }).forEach(opt => {
    t.is(
      det(t, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc${rawNbsp}ddd\n\neee fff ggg${rawNbsp}hhh`,
      `07 - two BR's, widows replaced with non-encoded NBSP`
    );
  });
});

test(`08 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - convertEntities on`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    replaceLineBreaks: 0,
    removeLineBreaks: 0
  }).forEach(opt => {
    t.is(
      det(t, `aaa bbb ccc ddd\neee fff ggg hhh.`, opt).res,
      `aaa bbb ccc&nbsp;ddd\neee fff ggg&nbsp;hhh.`,
      `08.01`
    );
    t.is(
      det(t, `aaa bbb ccc ddd.\neee fff ggg hhh.`, opt).res,
      `aaa bbb ccc&nbsp;ddd.\neee fff ggg&nbsp;hhh.`,
      `08.02`
    );
  });
});

test(`09 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with trailing whitespace`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1,
    replaceLineBreaks: 1,
    removeLineBreaks: 0,
    useXHTML: 0
  }).forEach(opt => {
    t.is(
      det(t, `aaa bbb ccc ddd. \n\neee fff ggg hhh`, opt).res,
      `aaa bbb ccc&nbsp;ddd.<br>\n<br>\neee fff ggg&nbsp;hhh`,
      `09 - remove widows - trailing space`
    );
  });
});

test(`10 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - glues UK postcodes - convertEntities on`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(t, `Some text SW1A 1AA and some more text.`, opt).res,
      `Some text SW1A&nbsp;1AA and some more&nbsp;text.`,
      `04.01 - properly formatted UK postcode, in caps`
    );
    t.is(
      det(
        t,
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        opt
      ).res,
      `Some text SW1A&nbsp;1AA and some more text SW1A&nbsp;1AA and some more&nbsp;text.`,
      `04.02 - multiple properly formatted postcodes`
    );
    t.is(
      det(t, `This very long line of text ends with a postcode SW1A 1AA.`, opt)
        .res,
      `This very long line of text ends with a postcode SW1A&nbsp;1AA.`,
      `04.03 - line ends with a postcode (full stop)`
    );
    t.is(
      det(t, `this very long line of text ends with a postcode SW1A 1AA`, opt)
        .res,
      `this very long line of text ends with a postcode SW1A&nbsp;1AA`,
      `04.04 - line ends with a postcode (no full stop)`
    );
    t.is(
      det(t, `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`, opt)
        .res,
      `&#x1F984; some text text text SW1A&nbsp;1AA more text text text &#x1F984;&nbsp;aaa`,
      `04.05 - properly formatted UK postcode, some emoji`
    );
    t.is(
      det(t, `Some text SW1A 1Aa and some more text.`, opt).res,
      `Some text SW1A 1Aa and some more&nbsp;text.`,
      `04.06 - improperly formatted UK postcode`
    );
  });
});

test(`11 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - glues UK postcodes - convertEntities off`, t => {
  mixer({
    removeWidows: 1,
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(t, `Some text SW1A 1AA and some more text.`, opt).res,
      `Some text SW1A${rawNbsp}1AA and some more${rawNbsp}text.`,
      `11.01 - properly formatted UK postcode, in caps`
    );
    t.is(
      det(
        t,
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        opt
      ).res,
      `Some text SW1A${rawNbsp}1AA and some more text SW1A${rawNbsp}1AA and some more${rawNbsp}text.`,
      `11.02 - multiple properly formatted postcodes`
    );
    t.is(
      det(t, `This very long line of text ends with a postcode SW1A 1AA.`, opt)
        .res,
      `This very long line of text ends with a postcode SW1A${rawNbsp}1AA.`,
      `11.03 - line ends with a postcode (full stop)`
    );
    t.is(
      det(t, `this very long line of text ends with a postcode SW1A 1AA`, opt)
        .res,
      `this very long line of text ends with a postcode SW1A${rawNbsp}1AA`,
      `11.04 - line ends with a postcode (no full stop)`
    );
    t.is(
      det(t, `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`, opt)
        .res,
      `🦄 some text text text SW1A${rawNbsp}1AA more text text text 🦄${rawNbsp}aaa`,
      `11.05 - properly formatted UK postcode, some emoji`
    );
    t.is(
      det(t, `Some text SW1A 1Aa and some more text.`, opt).res,
      `Some text SW1A 1Aa and some more${rawNbsp}text.`,
      `11.06 - improperly formatted UK postcode`
    );
  });
});

test(`12 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - glues UK postcodes - removeWidows off`, t => {
  mixer({
    removeWidows: 0,
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(t, `Some text SW1A 1AA and some more text.`, opt).res,
      `Some text SW1A 1AA and some more text.`,
      `12.01 - properly formatted UK postcode, in caps`
    );
    t.is(
      det(
        t,
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        opt
      ).res,
      `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
      `12.02 - multiple properly formatted postcodes`
    );
    t.is(
      det(t, `This very long line of text ends with a postcode SW1A 1AA.`, opt)
        .res,
      `This very long line of text ends with a postcode SW1A 1AA.`,
      `12.03 - line ends with a postcode (full stop)`
    );
    t.is(
      det(t, `this very long line of text ends with a postcode SW1A 1AA`, opt)
        .res,
      `this very long line of text ends with a postcode SW1A 1AA`,
      `12.04 - line ends with a postcode (no full stop)`
    );
    t.is(
      det(t, `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`, opt)
        .res,
      `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`,
      `12.05 - properly formatted UK postcode, some emoji`
    );
    t.is(
      det(t, `Some text SW1A 1Aa and some more text.`, opt).res,
      `Some text SW1A 1Aa and some more text.`,
      `12.06 - improperly formatted UK postcode`
    );
  });
});

test(`13 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, t => {
  allCombinations.forEach(opt => {
    t.is(
      det(
        t,
        `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        opt
      ).res,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `13 - there's right slash following them`
    );
  });
});

test(`14 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, t => {
  allCombinations.forEach(opt => {
    t.is(
      det(
        t,
        `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        opt
      ).res,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `14 - there's a known tag before them`
    );
  });
});

test(`15 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, t => {
  allCombinations.forEach(opt => {
    t.is(
      det(
        t,
        `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        opt
      ).res,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `15 - hr tag, xhtml style`
    );
  });
});

test(`16 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`, t => {
  allCombinations.forEach(opt => {
    t.is(
      det(
        t,
        `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
        opt
      ).res,
      `aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      `16 - hr tag, html style`
    );
  });
});

test(`17 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widow removal detects template code (Jinja/Nunjucks)`, t => {
  allCombinations.forEach(opt => {
    t.is(
      det(t, `{% if something %}`, opt).res,
      `{% if something %}`,
      `17.01 - four chunks`
    );
    t.is(
      det(t, `{%- if something -%}`, opt).res,
      `{%- if something -%}`,
      `17.02 - dashes`
    );
    t.is(
      det(t, `{{ something }}`, opt).res,
      `{{ something }}`,
      `17.03 - three chunks`
    );
    t.is(
      det(t, `{% if something else and also another thing %}`, opt).res,
      `{% if something else and also another thing %}`,
      `17.04 - nine chunks`
    );
  });
});

test(`18 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows off`, t => {
  mixer({
    removeWidows: 0,
    convertDashes: 0
  }).forEach(opt => {
    t.is(
      det(t, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text - 9999`,
      `18`
    );
  });
});

test(`19 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows on`, t => {
  mixer({
    removeWidows: 1,
    convertDashes: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(t, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text&nbsp;&mdash;&nbsp;9999`,
      `19`
    );
  });
});

test(`20 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows on`, t => {
  mixer({
    removeWidows: 1,
    convertDashes: 1,
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(t, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text${rawNbsp}\u2014${rawNbsp}9999`,
      `20`
    );
  });
});

test(`21 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows on`, t => {
  mixer({
    removeWidows: 0,
    convertDashes: 1,
    convertEntities: 1
  }).forEach(opt => {
    t.is(
      det(t, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text &mdash; 9999`,
      `21`
    );
  });
});

test(`22 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows off`, t => {
  mixer({
    removeWidows: 0,
    convertDashes: 1,
    convertEntities: 0
  }).forEach(opt => {
    t.is(
      det(t, `AA Some text And Some Text - 9999`, opt).res,
      `AA Some text And Some Text \u2014 9999`,
      `22`
    );
  });
});
