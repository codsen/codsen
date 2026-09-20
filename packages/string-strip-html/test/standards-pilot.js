import { readFileSync } from "node:fs";
import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal } from "uvu/assert";
import { stripHtml } from "../dist/string-strip-html.esm.js";

// The shared catalogue owns inputs and provenance. This package owns its
// text-extraction expectations, including separators and paired-content removal.
const cases = JSON.parse(
  readFileSync(
    new URL("./fixtures/standards/pilot.json", import.meta.url),
    "utf8",
  ),
);

test("001 - html-void-br", () => {
  const actual = stripHtml(cases["html-void-br"]);
  equal(actual.result, "", "001.01");
  equal(rApply(cases["html-void-br"], actual.ranges), "", "001.02");
});

test("002 - html-void-wbr", () => {
  const actual = stripHtml(cases["html-void-wbr"]);
  equal(actual.result, "onetwo", "002.01");
  equal(rApply(cases["html-void-wbr"], actual.ranges), "onetwo", "002.02");
});

test("003 - html-unquoted-solidus", () => {
  const actual = stripHtml(cases["html-unquoted-solidus"]);
  equal(actual.result, "", "003.01");
  equal(rApply(cases["html-unquoted-solidus"], actual.ranges), "", "003.02");
  const tokens = [];
  const forwarded = stripHtml(cases["html-unquoted-solidus"], {
    cb: ({ tag, rangesArr, proposedReturn }) => {
      tokens.push(tag);
      if (proposedReturn) {
        rangesArr.push(proposedReturn);
      }
    },
  });
  equal(
    tokens[0].attributes.find((attribute) => attribute.name === "src").value,
    "x/",
    "003.03",
  );
  equal(Boolean(tokens[0].slashPresent), false, "003.04");
  equal(forwarded.result, "", "003.05");
});

test("004 - html-separated-solidus", () => {
  const actual = stripHtml(cases["html-separated-solidus"]);
  equal(actual.result, "", "004.01");
  equal(rApply(cases["html-separated-solidus"], actual.ranges), "", "004.02");
  const tokens = [];
  const forwarded = stripHtml(cases["html-separated-solidus"], {
    cb: ({ tag, rangesArr, proposedReturn }) => {
      tokens.push(tag);
      if (proposedReturn) {
        rangesArr.push(proposedReturn);
      }
    },
  });
  equal(
    tokens[0].attributes.find((attribute) => attribute.name === "src").value,
    "x",
    "004.03",
  );
  equal(Boolean(tokens[0].slashPresent), true, "004.04");
  equal(forwarded.result, "", "004.05");
});

test("005 - html-double-quoted-greater-than", () => {
  const actual = stripHtml(cases["html-double-quoted-greater-than"]);
  equal(actual.result, "text", "005.01");
  equal(
    rApply(cases["html-double-quoted-greater-than"], actual.ranges),
    "text",
    "005.02",
  );
});

test("006 - html-single-quoted-greater-than", () => {
  const actual = stripHtml(cases["html-single-quoted-greater-than"]);
  equal(actual.result, "text", "006.01");
  equal(
    rApply(cases["html-single-quoted-greater-than"], actual.ranges),
    "text",
    "006.02",
  );
});

test("007 - html-boolean-attribute", () => {
  const actual = stripHtml(cases["html-boolean-attribute"]);
  equal(actual.result, "", "007.01");
  equal(rApply(cases["html-boolean-attribute"], actual.ranges), "", "007.02");
});

test("008 - html-ascii-case", () => {
  const actual = stripHtml(cases["html-ascii-case"]);
  equal(actual.result, "Text", "008.01");
  equal(rApply(cases["html-ascii-case"], actual.ranges), "Text", "008.02");
});

test("009 - html-named-references", () => {
  const actual = stripHtml(cases["html-named-references"]);
  equal(actual.result, "© & ≂̸", "009.01");
  equal(
    rApply(cases["html-named-references"], actual.ranges),
    "© & ≂̸",
    "009.02",
  );
});

test("010 - html-numeric-recovery", () => {
  const actual = stripHtml(cases["html-numeric-recovery"]);
  equal(actual.result, "A 🚀 �", "010.01");
  equal(
    rApply(cases["html-numeric-recovery"], actual.ranges),
    "A 🚀 �",
    "010.02",
  );
});

// Product policy: decoding requires semicolons, unlike HTML text-state recovery.
// See codec-contract.js and release-notes.md; this does not claim browser parity.
test("011 - html-reference-context", () => {
  const actual = stripHtml(cases["html-reference-context"]);
  equal(actual.result, "&notit;", "011.01");
  equal(
    rApply(cases["html-reference-context"], actual.ranges),
    "&notit;",
    "011.02",
  );
});

test("012 - html-textarea-rcdata", () => {
  const actual = stripHtml(cases["html-textarea-rcdata"]);
  equal(actual.result, "<b>&</b>", "012.01");
  equal(
    rApply(cases["html-textarea-rcdata"], actual.ranges),
    "<b>&</b>",
    "012.02",
  );
});

test("013 - html-title-rcdata", () => {
  const actual = stripHtml(cases["html-title-rcdata"]);
  equal(actual.result, "one & two", "013.01");
  equal(
    rApply(cases["html-title-rcdata"], actual.ranges),
    "one & two",
    "013.02",
  );
});

// Product policy: removing comments inserts a separator to avoid joining words.
test("014 - html-comments", () => {
  const actual = stripHtml(cases["html-comments"]);
  equal(actual.result, "A B", "014.01");
  equal(rApply(cases["html-comments"], actual.ranges), "A B", "014.02");
});

test("015 - html-doctype", () => {
  const actual = stripHtml(cases["html-doctype"]);
  equal(actual.result, "text", "015.01");
  equal(rApply(cases["html-doctype"], actual.ranges), "text", "015.02");
});

test("016 - html-optional-end-tags", () => {
  const actual = stripHtml(cases["html-optional-end-tags"]);
  equal(actual.result, "one two", "016.01");
  equal(
    rApply(cases["html-optional-end-tags"], actual.ranges),
    "one two",
    "016.02",
  );
});

test("017 - html-foreign-self-close", () => {
  const actual = stripHtml(cases["html-foreign-self-close"]);
  equal(actual.result, "", "017.01");
  equal(rApply(cases["html-foreign-self-close"], actual.ranges), "", "017.02");
});

test("018 - html-unquoted-class-solidus", () => {
  const actual = stripHtml(cases["html-unquoted-class-solidus"]);
  equal(actual.result, "", "018.01");
  equal(
    rApply(cases["html-unquoted-class-solidus"], actual.ranges),
    "",
    "018.02",
  );
});

test("019 - css-comments", () => {
  const actual = stripHtml(cases["css-comments"]);
  equal(actual.result, "text", "019.01");
  equal(rApply(cases["css-comments"], actual.ranges), "text", "019.02");
});

test("020 - css-hex-escape", () => {
  const actual = stripHtml(cases["css-hex-escape"]);
  equal(actual.result, "text", "020.01");
  equal(rApply(cases["css-hex-escape"], actual.ranges), "text", "020.02");
});

test("021 - css-escaped-punctuation", () => {
  const actual = stripHtml(cases["css-escaped-punctuation"]);
  equal(actual.result, "text", "021.01");
  equal(
    rApply(cases["css-escaped-punctuation"], actual.ranges),
    "text",
    "021.02",
  );
});

test("022 - css-string-delimiters", () => {
  const actual = stripHtml(cases["css-string-delimiters"]);
  equal(actual.result, "text", "022.01");
  equal(
    rApply(cases["css-string-delimiters"], actual.ranges),
    "text",
    "022.02",
  );
});

test("023 - css-url-delimiters", () => {
  const actual = stripHtml(cases["css-url-delimiters"]);
  equal(actual.result, "text", "023.01");
  equal(rApply(cases["css-url-delimiters"], actual.ranges), "text", "023.02");
});

test("024 - css-attribute-selector", () => {
  const actual = stripHtml(cases["css-attribute-selector"]);
  equal(actual.result, "text", "024.01");
  equal(
    rApply(cases["css-attribute-selector"], actual.ranges),
    "text",
    "024.02",
  );
});

test("025 - css-is-selector", () => {
  const actual = stripHtml(cases["css-is-selector"]);
  equal(actual.result, "text", "025.01");
  equal(rApply(cases["css-is-selector"], actual.ranges), "text", "025.02");
});

test("026 - css-not-selector", () => {
  const actual = stripHtml(cases["css-not-selector"]);
  equal(actual.result, "text", "026.01");
  equal(rApply(cases["css-not-selector"], actual.ranges), "text", "026.02");
});

test("027 - css-nested-conditional", () => {
  const actual = stripHtml(cases["css-nested-conditional"]);
  equal(actual.result, "text", "027.01");
  equal(
    rApply(cases["css-nested-conditional"], actual.ranges),
    "text",
    "027.02",
  );
});

test("028 - css-custom-properties", () => {
  const actual = stripHtml(cases["css-custom-properties"]);
  equal(actual.result, "text", "028.01");
  equal(
    rApply(cases["css-custom-properties"], actual.ranges),
    "text",
    "028.02",
  );
});

test("029 - css-nesting", () => {
  const actual = stripHtml(cases["css-nesting"]);
  equal(actual.result, "text", "029.01");
  equal(rApply(cases["css-nesting"], actual.ranges), "text", "029.02");
});

test("030 - css-font-face", () => {
  const actual = stripHtml(cases["css-font-face"]);
  equal(actual.result, "text", "030.01");
  equal(rApply(cases["css-font-face"], actual.ranges), "text", "030.02");
});

test("031 - js-template-lines", () => {
  const actual = stripHtml(cases["js-template-lines"]);
  equal(actual.result, "text", "031.01");
  equal(rApply(cases["js-template-lines"], actual.ranges), "text", "031.02");
  const retained = stripHtml(cases["js-template-lines"], {
    stripTogetherWithTheirContents: [],
  });
  equal(retained.result, "const x = `one\n\n  two`; text", "031.03");
  equal(
    rApply(cases["js-template-lines"], retained.ranges),
    "const x = `one\n\n  two`; text",
    "031.04",
  );
});

test("032 - js-regexp", () => {
  const actual = stripHtml(cases["js-regexp"]);
  equal(actual.result, "text", "032.01");
  equal(rApply(cases["js-regexp"], actual.ranges), "text", "032.02");
  const retained = stripHtml(cases["js-regexp"], {
    stripTogetherWithTheirContents: [],
  });
  equal(retained.result, "const pattern = /<[a-z]+>/gi; text", "032.03");
  equal(
    rApply(cases["js-regexp"], retained.ranges),
    "const pattern = /<[a-z]+>/gi; text",
    "032.04",
  );
});

test("033 - js-line-comment", () => {
  const actual = stripHtml(cases["js-line-comment"]);
  equal(actual.result, "text", "033.01");
  equal(rApply(cases["js-line-comment"], actual.ranges), "text", "033.02");
  const retained = stripHtml(cases["js-line-comment"], {
    stripTogetherWithTheirContents: [],
  });
  equal(retained.result, "// <b>literal</b>\nconst x = 1; text", "033.03");
  equal(
    rApply(cases["js-line-comment"], retained.ranges),
    "// <b>literal</b>\nconst x = 1; text",
    "033.04",
  );
});

test("034 - js-html-like-string", () => {
  const actual = stripHtml(cases["js-html-like-string"]);
  equal(actual.result, "text", "034.01");
  equal(rApply(cases["js-html-like-string"], actual.ranges), "text", "034.02");
  const retained = stripHtml(cases["js-html-like-string"], {
    stripTogetherWithTheirContents: [],
  });
  equal(retained.result, 'const x = "<!-- literal -->"; text', "034.03");
  equal(
    rApply(cases["js-html-like-string"], retained.ranges),
    'const x = "<!-- literal -->"; text',
    "034.04",
  );
});

test("035 - js-modern-operators", () => {
  const actual = stripHtml(cases["js-modern-operators"]);
  equal(actual.result, "text", "035.01");
  equal(rApply(cases["js-modern-operators"], actual.ranges), "text", "035.02");
  const retained = stripHtml(cases["js-modern-operators"], {
    stripTogetherWithTheirContents: [],
  });
  equal(retained.result, 'const x = data?.value ?? "fallback"; text', "035.03");
  equal(
    rApply(cases["js-modern-operators"], retained.ranges),
    'const x = data?.value ?? "fallback"; text',
    "035.04",
  );
});

test("036 - js-end-tag-prefix", () => {
  const actual = stripHtml(cases["js-end-tag-prefix"]);
  equal(actual.result, "text", "036.01");
  equal(rApply(cases["js-end-tag-prefix"], actual.ranges), "text", "036.02");
  const retained = stripHtml(cases["js-end-tag-prefix"], {
    stripTogetherWithTheirContents: [],
  });
  equal(retained.result, 'const x = "</scriptx>"; text', "036.03");
  equal(
    rApply(cases["js-end-tag-prefix"], retained.ranges),
    'const x = "</scriptx>"; text',
    "036.04",
  );
});

test.run();
