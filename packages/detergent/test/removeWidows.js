import tap from "tap";
import { det, mixer } from "../t-util/util";
// import { det as detergent } from "../dist/detergent.esm";
import {
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
} from "../src/util";

// 00 - minimal cases for MVP
// -----------------------------------------------------------------------------

tap.test(`01 - minimal samples`, (t) => {
  t.equal(
    det(t, 0, `aaa bbb ccc ddd`, {
      removeWidows: true,
      convertEntities: true,
    }).res,
    `aaa bbb ccc&nbsp;ddd`,
    `01 - remove widows - entities, one line string no full stop`
  );
  t.end();
});

tap.test(`02 - ETX processed twice, 2nd time during widow removal`, (t) => {
  t.equal(
    det(t, 0, `aaa bbb ccc\u0003ddd`, {
      removeWidows: true,
      convertEntities: true,
      removeLineBreaks: true,
    }).res,
    `aaa bbb ccc&nbsp;ddd`,
    `02 - remove widows - entities, one line string no full stop`
  );
  t.end();
});

// 01 - full tests on all opts variations (mixer)
// -----------------------------------------------------------------------------

tap.test(
  `03 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - four chunks of text #1 - convertEntities on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `aaa bbb ccc ddd`, opt).res,
        `aaa bbb ccc&nbsp;ddd`,
        `01.01.01 - remove widows - entities, one line string no full stop`
      );
      t.equal(
        det(t, n, `aaa bbb ccc ddd.`, opt).res,
        `aaa bbb ccc&nbsp;ddd.`,
        `01.01.02 - remove widows - entities, one line string with full stop`
      );
    });
    t.end();
  }
);

tap.test(
  `04 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - four chunks of text #1 - convertEntities off`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `aaa bbb ccc ddd`, opt).res,
        `aaa bbb ccc${rawNbsp}ddd`,
        `01.02.01 - remove widows - no entities, one line string no full stop`
      );
      t.equal(
        det(t, n, `aaa bbb ccc ddd.`, opt).res,
        `aaa bbb ccc${rawNbsp}ddd.`,
        `01.02.02 - remove widows - no entities, one line string with full stop`
      );
    });
    t.end();
  }
);

tap.test(
  `05 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - four chunks of text #1 - removeWidows off`,
  (t) => {
    mixer({
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `aaa bbb ccc ddd`, opt).res,
        `aaa bbb ccc ddd`,
        `01.03.01 - don't remove widows - no full stop`
      );
      t.equal(
        det(t, n, `aaa bbb ccc ddd.`, opt).res,
        `aaa bbb ccc ddd.`,
        `01.03.02 - don't remove widows - ending with full stop`
      );
    });
    t.end();
  }
);

tap.test(
  `06 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - useXHTML on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
        `aaa bbb ccc&nbsp;ddd<br/>\n<br/>\neee fff ggg&nbsp;hhh`,
        `01.04 - two line breaks with encoding BR in XHTML`
      );
    });
    t.end();
  }
);

tap.test(
  `07 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - useXHTML off`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
        `aaa bbb ccc&nbsp;ddd<br>\n<br>\neee fff ggg&nbsp;hhh`,
        `01.05 - two BR's, widows with NBSP and HTML BR`
      );
    });
    t.end();
  }
);

tap.test(
  `08 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - replaceLineBreaks off`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      replaceLineBreaks: false,
      removeLineBreaks: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
        `aaa bbb ccc&nbsp;ddd\n\neee fff ggg&nbsp;hhh`,
        `01.06 - two BR's, widows replaced with &nbsp`
      );
    });
    t.end();
  }
);

tap.test(
  `09 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - convertEntities off`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: false,
      replaceLineBreaks: false,
      removeLineBreaks: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `aaa bbb ccc ddd\n\neee fff ggg hhh`, opt).res,
        `aaa bbb ccc${rawNbsp}ddd\n\neee fff ggg${rawNbsp}hhh`,
        `01.07 - two BR's, widows replaced with non-encoded NBSP`
      );
    });
    t.end();
  }
);

tap.test(
  `10 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with line breaks - convertEntities on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      replaceLineBreaks: false,
      removeLineBreaks: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `aaa bbb ccc ddd\neee fff ggg hhh.`, opt).res,
        `aaa bbb ccc&nbsp;ddd\neee fff ggg&nbsp;hhh.`,
        `01.08.01`
      );
      t.equal(
        det(t, n, `aaa bbb ccc ddd.\neee fff ggg hhh.`, opt).res,
        `aaa bbb ccc&nbsp;ddd.\neee fff ggg&nbsp;hhh.`,
        `01.08.02`
      );
    });
    t.end();
  }
);

tap.test(
  `11 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - with trailing whitespace`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      replaceLineBreaks: true,
      removeLineBreaks: false,
      useXHTML: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `aaa bbb ccc ddd. \n\neee fff ggg hhh`, opt).res,
        `aaa bbb ccc&nbsp;ddd.<br>\n<br>\neee fff ggg&nbsp;hhh`,
        `01.09 - remove widows - trailing space`
      );
    });
    t.end();
  }
);

tap.test(
  `12 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - glues UK postcodes - convertEntities on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `Some text SW1A 1AA and some more text.`, opt).res,
        `Some text SW1A&nbsp;1AA and some more&nbsp;text.`,
        `01.10.01 - properly formatted UK postcode, in caps`
      );
      t.equal(
        det(
          t,
          n,
          `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
          opt
        ).res,
        `Some text SW1A&nbsp;1AA and some more text SW1A&nbsp;1AA and some more&nbsp;text.`,
        `01.10.02 - multiple properly formatted postcodes`
      );
      t.equal(
        det(
          t,
          n,
          `This very long line of text ends with a postcode SW1A 1AA.`,
          opt
        ).res,
        `This very long line of text ends with a postcode SW1A&nbsp;1AA.`,
        `01.10.03 - line ends with a postcode (full stop)`
      );
      t.equal(
        det(
          t,
          n,
          `this very long line of text ends with a postcode SW1A 1AA`,
          opt
        ).res,
        `this very long line of text ends with a postcode SW1A&nbsp;1AA`,
        `01.10.04 - line ends with a postcode (no full stop)`
      );
      t.equal(
        det(
          t,
          n,
          `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`,
          opt
        ).res,
        `&#x1F984; some text text text SW1A&nbsp;1AA more text text text &#x1F984;&nbsp;aaa`,
        `01.10.05 - properly formatted UK postcode, some emoji`
      );
      t.equal(
        det(t, n, `Some text SW1A 1Aa and some more text.`, opt).res,
        `Some text SW1A 1Aa and some more&nbsp;text.`,
        `01.10.06 - improperly formatted UK postcode`
      );
    });
    t.end();
  }
);

tap.test(
  `13 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - glues UK postcodes - convertEntities off`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `Some text SW1A 1AA and some more text.`, opt).res,
        `Some text SW1A${rawNbsp}1AA and some more${rawNbsp}text.`,
        `01.11.01 - properly formatted UK postcode, in caps`
      );
      t.equal(
        det(
          t,
          n,
          `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
          opt
        ).res,
        `Some text SW1A${rawNbsp}1AA and some more text SW1A${rawNbsp}1AA and some more${rawNbsp}text.`,
        `01.11.02 - multiple properly formatted postcodes`
      );
      t.equal(
        det(
          t,
          n,
          `This very long line of text ends with a postcode SW1A 1AA.`,
          opt
        ).res,
        `This very long line of text ends with a postcode SW1A${rawNbsp}1AA.`,
        `01.11.03 - line ends with a postcode (full stop)`
      );
      t.equal(
        det(
          t,
          n,
          `this very long line of text ends with a postcode SW1A 1AA`,
          opt
        ).res,
        `this very long line of text ends with a postcode SW1A${rawNbsp}1AA`,
        `01.11.04 - line ends with a postcode (no full stop)`
      );
      t.equal(
        det(
          t,
          n,
          `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`,
          opt
        ).res,
        `🦄 some text text text SW1A${rawNbsp}1AA more text text text 🦄${rawNbsp}aaa`,
        `01.11.05 - properly formatted UK postcode, some emoji`
      );
      t.equal(
        det(t, n, `Some text SW1A 1Aa and some more text.`, opt).res,
        `Some text SW1A 1Aa and some more${rawNbsp}text.`,
        `01.11.06 - improperly formatted UK postcode`
      );
    });
    t.end();
  }
);

tap.test(
  `14 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - glues UK postcodes - removeWidows off`,
  (t) => {
    mixer({
      removeWidows: false,
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `Some text SW1A 1AA and some more text.`, opt).res,
        `Some text SW1A 1AA and some more text.`,
        `01.12.01 - properly formatted UK postcode, in caps`
      );
      t.equal(
        det(
          t,
          n,
          `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
          opt
        ).res,
        `Some text SW1A 1AA and some more text SW1A 1AA and some more text.`,
        `01.12.02 - multiple properly formatted postcodes`
      );
      t.equal(
        det(
          t,
          n,
          `This very long line of text ends with a postcode SW1A 1AA.`,
          opt
        ).res,
        `This very long line of text ends with a postcode SW1A 1AA.`,
        `01.12.03 - line ends with a postcode (full stop)`
      );
      t.equal(
        det(
          t,
          n,
          `this very long line of text ends with a postcode SW1A 1AA`,
          opt
        ).res,
        `this very long line of text ends with a postcode SW1A 1AA`,
        `01.12.04 - line ends with a postcode (no full stop)`
      );
      t.equal(
        det(
          t,
          n,
          `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`,
          opt
        ).res,
        `🦄 some text text text SW1A 1AA more text text text 🦄 aaa`,
        `01.12.05 - properly formatted UK postcode, some emoji`
      );
      t.equal(
        det(t, n, `Some text SW1A 1Aa and some more text.`, opt).res,
        `Some text SW1A 1Aa and some more text.`,
        `01.12.06 - improperly formatted UK postcode`
      );
    });
    t.end();
  }
);

tap.test(
  `15 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`,
  (t) => {
    mixer().forEach((opt, n) => {
      t.equal(
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
    t.end();
  }
);

tap.test(
  `16 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`,
  (t) => {
    mixer().forEach((opt, n) => {
      t.equal(
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
    t.end();
  }
);

tap.test(
  `17 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`,
  (t) => {
    mixer().forEach((opt, n) => {
      t.equal(
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
    t.end();
  }
);

tap.test(
  `18 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - nbsp's not added within hidden HTML tags`,
  (t) => {
    mixer().forEach((opt, n) => {
      t.equal(
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
    t.end();
  }
);

tap.test(
  `19 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widow removal detects template code (Jinja/Nunjucks)`,
  (t) => {
    mixer().forEach((opt, n) => {
      t.equal(
        det(t, n, `{% if something %}`, opt).res,
        `{% if something %}`,
        `01.17.01 - four chunks`
      );
      t.equal(
        det(t, n, `{%- if something -%}`, opt).res,
        `{%- if something -%}`,
        `01.17.02 - dashes`
      );
      t.equal(
        det(t, n, `{{ something }}`, opt).res,
        `{{ something }}`,
        `17.03 - three chunks`
      );
      t.equal(
        det(t, n, `{% if something else and also another thing %}`, opt).res,
        `{% if something else and also another thing %}`,
        `17.04 - nine chunks`
      );
    });
    t.end();
  }
);

tap.test(
  `20 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows off`,
  (t) => {
    mixer({
      removeWidows: false,
      convertDashes: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `AA Some text And Some Text - 9999`, opt).res,
        `AA Some text And Some Text - 9999`,
        `01.18`
      );
    });
    t.end();
  }
);

tap.test(
  `21 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertDashes: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `AA Some text And Some Text - 9999`, opt).res,
        `AA Some text And Some Text&nbsp;&mdash;&nbsp;9999`,
        `01.19`
      );
    });
    t.end();
  }
);

tap.test(
  `22 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows on`,
  (t) => {
    mixer({
      removeWidows: true,
      convertDashes: true,
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `AA Some text And Some Text - 9999`, opt).res,
        `AA Some text And Some Text${rawNbsp}\u2014${rawNbsp}9999`,
        `01.20`
      );
    });
    t.end();
  }
);

tap.test(
  `23 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows on`,
  (t) => {
    mixer({
      removeWidows: false,
      convertDashes: true,
      convertEntities: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `AA Some text And Some Text - 9999`, opt).res,
        `AA Some text And Some Text &mdash; 9999`,
        `01.21`
      );
    });
    t.end();
  }
);

tap.test(
  `24 - \u001b[${35}m${`opts.removeWidows`}\u001b[${39}m - widows and dashes between letters and numbers - removeWidows off`,
  (t) => {
    mixer({
      removeWidows: false,
      convertDashes: true,
      convertEntities: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `AA Some text And Some Text - 9999`, opt).res,
        `AA Some text And Some Text \u2014 9999`,
        `01.22`
      );
    });
    t.end();
  }
);

// 02. HTML tags
// -----------------------------------------------------------------------------

tap.test(
  `25 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      stripHtml: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a a<a something="whatever" and="here">`, opt).res,
        `a a<a something="whatever" and="here">`,
        `02.01`
      );
    });
    t.end();
  }
);

tap.test(
  `26 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      stripHtml: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a a <a something="whatever" and="here">`, opt).res,
        `a a <a something="whatever" and="here">`,
        `02.02`
      );
    });
    t.end();
  }
);

tap.test(
  `27 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      stripHtml: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a a a<a something="whatever" and="here">`, opt).res,
        `a a a<a something="whatever" and="here">`,
        `02.03`
      );
    });
    t.end();
  }
);

tap.test(
  `28 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      stripHtml: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a a a <a something="whatever" and="here">`, opt).res,
        `a a a <a something="whatever" and="here">`,
        `02.04`
      );
    });
    t.end();
  }
);

tap.test(
  `29 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      stripHtml: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a a a a<a something="whatever" and="here">`, opt).res,
        `a a a&nbsp;a<a something="whatever" and="here">`,
        `02.05`
      );
    });
    t.end();
  }
);

tap.test(
  `30 - \u001b[${35}m${`HTML tags`}\u001b[${39}m - tag in the end`,
  (t) => {
    mixer({
      removeWidows: true,
      convertEntities: true,
      stripHtml: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a a a a <a something="whatever" and="here">`, opt).res,
        `a a a a&nbsp;<a something="whatever" and="here">`,
        `02.06`
      );
    });
    t.end();
  }
);

tap.test(`31`, (t) => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `The quick brown&nbsp;fox. What an amazing animal!`, opt).res,
      `The quick brown fox. What an amazing animal!`,
      `02.06`
    );
  });
  t.end();
});

tap.test(`32`, (t) => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, `The quick brown&nbsp;fox. What an amazing&nbsp;animal!`, opt)
        .res,
      `The quick brown fox. What an amazing animal!`,
      `02.06`
    );
  });
  t.end();
});
