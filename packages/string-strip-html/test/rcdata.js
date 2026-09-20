import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal } from "uvu/assert";
import { stripHtml } from "../dist/string-strip-html.esm.js";

test("001 - RCDATA preserves literal tag-like text and decodes references", () => {
  for (const name of ["textarea", "title", "TEXTAREA", "TITLE"]) {
    const input = `<${name}><b>&amp;</b><!-- note --></${name}>`;
    const tokens = [];
    const actual = stripHtml(input, {
      cb: ({ tag, rangesArr, proposedReturn }) => {
        tokens.push(tag);
        if (proposedReturn) {
          rangesArr.push(proposedReturn);
        }
      },
    });

    equal(actual.result, "<b>&</b><!-- note -->", "001.01");
    equal(rApply(input, actual.ranges), "<b>&</b><!-- note -->", "001.02");
    equal(
      tokens.map((tag) => [tag.name, input.slice(tag.start, tag.end)]),
      [
        [name, `<${name}>`],
        [name, `</${name}>`],
      ],
      "001.03",
    );
    equal(actual.filteredTagLocations, actual.allTagLocations, "001.04");
    equal(stripHtml(input).result, "<b>&</b><!-- note -->", "001.05");
  }
});

test("002 - decoded end-tag delimiters remain RCDATA text", () => {
  for (const name of ["textarea", "title"]) {
    for (const [encoded, decoded] of [
      [`&lt;/${name}&gt;`, `</${name}>`],
      [`&amp;lt;/${name}&amp;gt;`, `</${name}>`],
      [`</${name}&#32;>`, `</${name} >`],
      [`</${name}&#62;`, `</${name}>`],
      [`&lt;/${name}>`, `</${name}>`],
      [
        `</${name.slice(0, -1)}&#${name.charCodeAt(name.length - 1)};>`,
        `</${name}>`,
      ],
    ]) {
      const input = `<${name}>${encoded}<b>literal</b></${name}>`;
      const actual = stripHtml(input);
      const expected = `${decoded}<b>literal</b>`;
      equal(actual.result, expected, "002.01");
      equal(rApply(input, actual.ranges), expected, "002.02");
      equal(
        actual.allTagLocations.map(([from, to]) => input.slice(from, to)),
        [`<${name}>`, `</${name}>`],
        "002.03",
      );
    }
  }
});

test("003 - longer RCDATA end-tag names and nested starts remain text", () => {
  for (const name of ["textarea", "title"]) {
    const content = `</${name}x><${name}><script>x</script><title>y</title>`;
    // A title's literal closing tag must be avoided in its own RCDATA content.
    const safeContent =
      name === "title" ? content.replace("</title>", "</titlex>") : content;
    const input = `<${name}>${safeContent}</${name}>`;
    const actual = stripHtml(input);
    equal(actual.result, safeContent, "003.01");
    equal(rApply(input, actual.ranges), safeContent, "003.02");
    equal(actual.allTagLocations.length, 2, "003.03");
  }
});

test("004 - RCDATA preserves contents through incomplete input", () => {
  for (const name of ["textarea", "title"]) {
    const input = `<${name}><b>x</b>`;
    const actual = stripHtml(input);
    equal(actual.result, "<b>x</b>", "004.01");
    equal(rApply(input, actual.ranges), "<b>x</b>", "004.02");
    equal(actual.allTagLocations, [[0, name.length + 2]], "004.03");
  }
});

test("005 - decoding bypass retains raw references inside RCDATA", () => {
  const input = "<textarea>&lt;b&gt;&amp;<b>x</b></textarea>";
  const actual = stripHtml(input, { skipHtmlDecoding: true });
  equal(actual.result, "&lt;b&gt;&amp;<b>x</b>", "005.01");
  equal(rApply(input, actual.ranges), "&lt;b&gt;&amp;<b>x</b>", "005.02");
});

test("006 - ignored and removed RCDATA elements retain option policies", () => {
  const input = "<textarea><b>literal</b></textarea>";
  equal(stripHtml(input, { ignoreTags: ["textarea"] }).result, input, "006.01");
  equal(
    stripHtml(input, { ignoreTagsWithTheirContents: ["textarea"] }).result,
    input,
    "006.02",
  );
  equal(stripHtml(input, { onlyStripTags: ["b"] }).result, input, "006.03");
  equal(
    stripHtml(input, { stripTogetherWithTheirContents: ["textarea"] }).result,
    "",
    "006.04",
  );
});

test("007 - encoded RCDATA elements retain recursive decode-and-strip policy", () => {
  const input = "&lt;textarea&gt;&lt;b&gt;x&lt;/b&gt;&lt;/textarea&gt;";
  const actual = stripHtml(input);
  equal(actual.result, "<b>x</b>", "007.01");
  equal(rApply(input, actual.ranges), "<b>x</b>", "007.02");
  equal(
    actual.allTagLocations.map(([from, to]) => input.slice(from, to)),
    ["&lt;textarea&gt;", "&lt;/textarea&gt;"],
    "007.03",
  );
});

test("008 - only HTML ASCII whitespace ends an RCDATA end-tag name", () => {
  for (const name of ["textarea", "title"]) {
    for (const boundary of ["\u00a0", "\v", "\u2028", "\ufeff"]) {
      const content = `a</${name}${boundary}><b>x</b>`;
      const input = `<${name}>${content}</${name}>`;
      const actual = stripHtml(input);
      equal(actual.result, content, "008.01");
      equal(rApply(input, actual.ranges), content, "008.02");
      equal(
        actual.allTagLocations.map(([from, to]) => input.slice(from, to)),
        [`<${name}>`, `</${name}>`],
        "008.03",
      );
    }
    for (const boundary of [" ", "\t", "\n", "\f", "\r"]) {
      const input = `<${name}>a</${name}${boundary}><b>x</b>`;
      equal(
        stripHtml(input).result,
        name === "textarea" ? "ax" : "a x",
        "008.04",
      );
    }
  }
});

test.run();
