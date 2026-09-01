// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import {
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  rawNbsp,
  // hairspace,
  // ellipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote,
} from "codsen-utils";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
// import { det as detergent } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

// 00 - minimal cases for MVP
// -----------------------------------------------------------------------------

test("001 - minimal samples", () => {
  equal(
    det(ok, not, 0, "aaa bbb ccc ddd", {
      removeWidows: true,
      convertEntities: true,
    }).res,
    "aaa bbb ccc&nbsp;ddd",
    "001.01",
  );
});

test("002 - ETX processed twice, 2nd time during widow removal", () => {
  equal(
    det(ok, not, 0, "aaa bbb ccc\u0003ddd", {
      removeWidows: true,
      convertEntities: true,
      removeLineBreaks: true,
    }).res,
    "aaa bbb ccc&nbsp;ddd",
    "002.01",
  );
});

// 01 - full tests on all opts variations (mixer)
// -----------------------------------------------------------------------------

test("003 - opts.removeWidows - four chunks of text #1 - convertEntities on", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa bbb ccc ddd", opt).res,
      "aaa bbb ccc&nbsp;ddd",
      "003.01",
    );
    equal(
      det(ok, not, n, "aaa bbb ccc ddd.", opt).res,
      "aaa bbb ccc&nbsp;ddd.",
      "003.02",
    );
  });
});

test("004 - opts.removeWidows - four chunks of text #1 - convertEntities off", () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa bbb ccc ddd", opt).res,
      `aaa bbb ccc${rawNbsp}ddd`,
      "004.01",
    );
    equal(
      det(ok, not, n, "aaa bbb ccc ddd.", opt).res,
      `aaa bbb ccc${rawNbsp}ddd.`,
      "004.02",
    );
  });
});

test("005 - opts.removeWidows - four chunks of text #1 - removeWidows off", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa bbb ccc ddd", opt).res,
      "aaa bbb ccc ddd",
      "005.01",
    );
    equal(
      det(ok, not, n, "aaa bbb ccc ddd.", opt).res,
      "aaa bbb ccc ddd.",
      "005.02",
    );
  });
});

test("006 - opts.removeWidows - with line breaks - useXHTML on", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa bbb ccc ddd\n\neee fff ggg hhh", opt).res,
      "aaa bbb ccc&nbsp;ddd<br/>\n<br/>\neee fff ggg&nbsp;hhh",
      "006.01",
    );
  });
});

test("007 - opts.removeWidows - with line breaks - useXHTML off", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa bbb ccc ddd\n\neee fff ggg hhh", opt).res,
      "aaa bbb ccc&nbsp;ddd<br>\n<br>\neee fff ggg&nbsp;hhh",
      "007.01",
    );
  });
});

test("008 - opts.removeWidows - with line breaks - replaceLineBreaks off", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa bbb ccc ddd\n\neee fff ggg hhh", opt).res,
      "aaa bbb ccc&nbsp;ddd\n\neee fff ggg&nbsp;hhh",
      "008.01",
    );
  });
});

test("009 - opts.removeWidows - with line breaks - convertEntities off", () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa bbb ccc ddd\n\neee fff ggg hhh", opt).res,
      `aaa bbb ccc${rawNbsp}ddd\n\neee fff ggg${rawNbsp}hhh`,
      "009.01",
    );
  });
});

test("010 - opts.removeWidows - with line breaks - convertEntities on", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa bbb ccc ddd\neee fff ggg hhh.", opt).res,
      "aaa bbb ccc&nbsp;ddd\neee fff ggg&nbsp;hhh.",
      "010.01",
    );
    equal(
      det(ok, not, n, "aaa bbb ccc ddd.\neee fff ggg hhh.", opt).res,
      "aaa bbb ccc&nbsp;ddd.\neee fff ggg&nbsp;hhh.",
      "010.02",
    );
  });
});

test("011 - opts.removeWidows - with trailing whitespace", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    replaceLineBreaks: true,
    removeLineBreaks: false,
    useXHTML: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "aaa bbb ccc ddd. \n\neee fff ggg hhh", opt).res,
      "aaa bbb ccc&nbsp;ddd.<br>\n<br>\neee fff ggg&nbsp;hhh",
      "011.01",
    );
  });
});

test("012 - opts.removeWidows - glues UK postcodes - convertEntities on", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Some text SW1A 1AA and some more text.", opt).res,
      "Some text SW1A&nbsp;1AA and some more&nbsp;text.",
      "012.01",
    );
    equal(
      det(
        ok,
        not,
        n,
        "Some text SW1A 1AA and some more text SW1A 1AA and some more text.",
        opt,
      ).res,
      "Some text SW1A&nbsp;1AA and some more text SW1A&nbsp;1AA and some more&nbsp;text.",
      "012.02",
    );
    equal(
      det(
        ok,
        not,
        n,
        "This very long line of text ends with a postcode SW1A 1AA.",
        opt,
      ).res,
      "This very long line of text ends with a postcode SW1A&nbsp;1AA.",
      "012.03",
    );
    equal(
      det(
        ok,
        not,
        n,
        "this very long line of text ends with a postcode SW1A 1AA",
        opt,
      ).res,
      "this very long line of text ends with a postcode SW1A&nbsp;1AA",
      "012.04",
    );
    equal(
      det(
        ok,
        not,
        n,
        "🦄 some text text text SW1A 1AA more text text text 🦄 aaa",
        opt,
      ).res,
      "&#x1F984; some text text text SW1A&nbsp;1AA more text text text &#x1F984;&nbsp;aaa",
      "012.05",
    );
    equal(
      det(ok, not, n, "Some text SW1A 1Aa and some more text.", opt).res,
      "Some text SW1A 1Aa and some more&nbsp;text.",
      "012.06",
    );
  });
});

test("013 - opts.removeWidows - glues UK postcodes - convertEntities off", () => {
  mixer({
    removeWidows: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Some text SW1A 1AA and some more text.", opt).res,
      `Some text SW1A${rawNbsp}1AA and some more${rawNbsp}text.`,
      "013.01",
    );
    equal(
      det(
        ok,
        not,
        n,
        "Some text SW1A 1AA and some more text SW1A 1AA and some more text.",
        opt,
      ).res,
      `Some text SW1A${rawNbsp}1AA and some more text SW1A${rawNbsp}1AA and some more${rawNbsp}text.`,
      "013.02",
    );
    equal(
      det(
        ok,
        not,
        n,
        "This very long line of text ends with a postcode SW1A 1AA.",
        opt,
      ).res,
      `This very long line of text ends with a postcode SW1A${rawNbsp}1AA.`,
      "013.03",
    );
    equal(
      det(
        ok,
        not,
        n,
        "this very long line of text ends with a postcode SW1A 1AA",
        opt,
      ).res,
      `this very long line of text ends with a postcode SW1A${rawNbsp}1AA`,
      "013.04",
    );
    equal(
      det(
        ok,
        not,
        n,
        "🦄 some text text text SW1A 1AA more text text text 🦄 aaa",
        opt,
      ).res,
      `🦄 some text text text SW1A${rawNbsp}1AA more text text text 🦄${rawNbsp}aaa`,
      "013.05",
    );
    equal(
      det(ok, not, n, "Some text SW1A 1Aa and some more text.", opt).res,
      `Some text SW1A 1Aa and some more${rawNbsp}text.`,
      "013.06",
    );
  });
});

test("014 - opts.removeWidows - glues UK postcodes - removeWidows off", () => {
  mixer({
    removeWidows: false,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "Some text SW1A 1AA and some more text.", opt).res,
      "Some text SW1A 1AA and some more text.",
      "014.01",
    );
    equal(
      det(
        ok,
        not,
        n,
        "Some text SW1A 1AA and some more text SW1A 1AA and some more text.",
        opt,
      ).res,
      "Some text SW1A 1AA and some more text SW1A 1AA and some more text.",
      "014.02",
    );
    equal(
      det(
        ok,
        not,
        n,
        "This very long line of text ends with a postcode SW1A 1AA.",
        opt,
      ).res,
      "This very long line of text ends with a postcode SW1A 1AA.",
      "014.03",
    );
    equal(
      det(
        ok,
        not,
        n,
        "this very long line of text ends with a postcode SW1A 1AA",
        opt,
      ).res,
      "this very long line of text ends with a postcode SW1A 1AA",
      "014.04",
    );
    equal(
      det(
        ok,
        not,
        n,
        "🦄 some text text text SW1A 1AA more text text text 🦄 aaa",
        opt,
      ).res,
      "🦄 some text text text SW1A 1AA more text text text 🦄 aaa",
      "014.05",
    );
    equal(
      det(ok, not, n, "Some text SW1A 1Aa and some more text.", opt).res,
      "Some text SW1A 1Aa and some more text.",
      "014.06",
    );
  });
});

test("015 - opts.removeWidows - nbsp's not added within hidden HTML tags", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        opt,
      ).res,
      "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "015.01",
    );
  });
});

test("016 - opts.removeWidows - nbsp's not added within hidden HTML tags", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        opt,
      ).res,
      "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1br @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "016.01",
    );
  });
});

test("017 - opts.removeWidows - nbsp's not added within hidden HTML tags", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        opt,
      ).res,
      "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr /@@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "017.01",
    );
  });
});

test("018 - opts.removeWidows - nbsp's not added within hidden HTML tags", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        opt,
      ).res,
      "aaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@@@1hr @@@2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "018.01",
    );
  });
});

test("019 - opts.removeWidows - widow removal detects template code (Jinja/Nunjucks)", () => {
  mixer().forEach((opt, n) => {
    equal(
      det(ok, not, n, "{% if something %}", opt).res,
      "{% if something %}",
      "019.01",
    );
    equal(
      det(ok, not, n, "{%- if something -%}", opt).res,
      "{%- if something -%}",
      "019.02",
    );
    equal(
      det(ok, not, n, "{{ something }}", opt).res,
      "{{ something }}",
      "019.03",
    );
    equal(
      det(ok, not, n, "{% if something else and also another thing %}", opt)
        .res,
      "{% if something else and also another thing %}",
      "019.04",
    );
  });
});

test("020 - opts.removeWidows - widows and dashes between letters and numbers - removeWidows off", () => {
  mixer({
    removeWidows: false,
    convertDashes: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "AA Some text And Some Text - 9999", opt).res,
      "AA Some text And Some Text - 9999",
      "020.01",
    );
  });
});

test("021 - opts.removeWidows - widows and dashes between letters and numbers - removeWidows on", () => {
  mixer({
    removeWidows: true,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "AA Some text And Some Text - 9999", opt).res,
      "AA Some text And Some Text&nbsp;&mdash;&nbsp;9999",
      "021.01",
    );
  });
});

test("022 - opts.removeWidows - widows and dashes between letters and numbers - removeWidows on", () => {
  mixer({
    removeWidows: true,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "AA Some text And Some Text - 9999", opt).res,
      `AA Some text And Some Text${rawNbsp}\u2014${rawNbsp}9999`,
      "022.01",
    );
  });
});

test("023 - opts.removeWidows - widows and dashes between letters and numbers - removeWidows on", () => {
  mixer({
    removeWidows: false,
    convertDashes: true,
    convertEntities: true,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "AA Some text And Some Text - 9999", opt).res,
      "AA Some text And Some Text &mdash; 9999",
      "023.01",
    );
  });
});

test("024 - opts.removeWidows - widows and dashes between letters and numbers - removeWidows off", () => {
  mixer({
    removeWidows: false,
    convertDashes: true,
    convertEntities: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "AA Some text And Some Text - 9999", opt).res,
      "AA Some text And Some Text \u2014 9999",
      "024.01",
    );
  });
});

// 02. HTML tags
// -----------------------------------------------------------------------------

test("025 - HTML tags - tag in the end", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a a<a something="whatever" and="here">', opt).res,
      'a a<a something="whatever" and="here">',
      "025.01",
    );
  });
});

test("026 - HTML tags - tag in the end", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a a <a something="whatever" and="here">', opt).res,
      'a a <a something="whatever" and="here">',
      "026.01",
    );
  });
});

test("027 - HTML tags - tag in the end", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a a a<a something="whatever" and="here">', opt).res,
      'a a a<a something="whatever" and="here">',
      "027.01",
    );
  });
});

test("028 - HTML tags - tag in the end", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a a a <a something="whatever" and="here">', opt).res,
      'a a a <a something="whatever" and="here">',
      "028.01",
    );
  });
});

test("029 - HTML tags - tag in the end", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a a a a<a something="whatever" and="here">', opt).res,
      'a a a a<a something="whatever" and="here">',
      "029.01",
    );
  });
});

test("030 - HTML tags - tag in the end", () => {
  mixer({
    removeWidows: true,
    convertEntities: true,
    stripHtml: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, 'a a a a <a something="whatever" and="here">', opt).res,
      'a a a a <a something="whatever" and="here">',
      "030.01",
    );
  });
});

test("031", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(ok, not, n, "The quick brown&nbsp;fox. What an amazing animal!", opt)
        .res,
      "The quick brown fox. What an amazing animal!",
      "031.01",
    );
  });
});

test("032", () => {
  mixer({
    removeWidows: false,
  }).forEach((opt, n) => {
    equal(
      det(
        ok,
        not,
        n,
        "The quick brown&nbsp;fox. What an amazing&nbsp;animal!",
        opt,
      ).res,
      "The quick brown fox. What an amazing animal!",
      "032.01",
    );
  });
});

test.run();
