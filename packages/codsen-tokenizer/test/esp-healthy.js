import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// ESP stands for Email Service Provider
// in practice, we cover all other templating languages too, for example,
// Moustache, Liquid or Jinja or even PHP - it's the same principle - "special"
// heads and tails surrounding some string, which can be placed anywhere in HTML

// 01. ESP tag + something, no overlap
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`no overlap`}\u001b[${39}m`} - only an ESP tag`,
  (t) => {
    const gathered = [];
    ct(`{% zz %}`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 8,
          value: "{% zz %}",
          head: "{%",
          headStartsAt: 0,
          headEndsAt: 2,
          tail: "%}",
          tailStartsAt: 6,
          tailEndsAt: 8,
        },
      ],
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`no overlap`}\u001b[${39}m`} - text and ESP tag`,
  (t) => {
    const gathered = [];
    ct(`a{% zz %}`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered,
      [
        {
          type: "text",
          start: 0,
          end: 1,
          value: "a",
        },
        {
          type: "esp",
          start: 1,
          end: 9,
          value: "{% zz %}",
          head: "{%",
          headStartsAt: 1,
          headEndsAt: 3,
          tail: "%}",
          tailStartsAt: 7,
          tailEndsAt: 9,
        },
      ],
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`no overlap`}\u001b[${39}m`} - text-ESP-text`,
  (t) => {
    const gathered = [];
    ct(`ab {% if something %} cd`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered,
      [
        {
          type: "text",
          start: 0,
          end: 3,
          value: "ab ",
        },
        {
          type: "esp",
          start: 3,
          end: 21,
          value: "{% if something %}",
          head: "{%",
          headStartsAt: 3,
          headEndsAt: 5,
          tail: "%}",
          tailStartsAt: 19,
          tailEndsAt: 21,
        },
        {
          type: "text",
          start: 21,
          end: 24,
          value: " cd",
        },
      ],
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`no overlap`}\u001b[${39}m`} - tag-ESP-tag`,
  (t) => {
    const gathered = [];
    ct(`<a>{% if something %}<b>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 3,
          value: "<a>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
        {
          type: "esp",
          start: 3,
          end: 21,
          value: "{% if something %}",
          head: "{%",
          headStartsAt: 3,
          headEndsAt: 5,
          tail: "%}",
          tailStartsAt: 19,
          tailEndsAt: 21,
        },
        {
          type: "tag",
          start: 21,
          end: 24,
          value: "<b>",
          tagNameStartsAt: 22,
          tagNameEndsAt: 23,
          tagName: "b",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`no overlap`}\u001b[${39}m`} - dollar + round brackets`,
  (t) => {
    const gathered = [];
    ct(`<a>$(something)<b>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 3,
          value: "<a>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
        {
          type: "esp",
          start: 3,
          end: 15,
          value: "$(something)",
          head: "$(",
          headStartsAt: 3,
          headEndsAt: 5,
          tail: ")",
          tailStartsAt: 14,
          tailEndsAt: 15,
        },
        {
          type: "tag",
          start: 15,
          end: 18,
          value: "<b>",
          tagNameStartsAt: 16,
          tagNameEndsAt: 17,
          tagName: "b",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`no overlap`}\u001b[${39}m`} - just for kicks, completely mirrored version`,
  (t) => {
    const gathered = [];
    ct(`<a>$(something)$<b>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 3,
          value: "<a>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
        {
          type: "esp",
          start: 3,
          end: 16,
          value: "$(something)$",
          head: "$(",
          headStartsAt: 3,
          headEndsAt: 5,
          tail: ")$",
          tailStartsAt: 14,
          tailEndsAt: 16,
        },
        {
          type: "tag",
          start: 16,
          end: 19,
          value: "<b>",
          tagNameStartsAt: 17,
          tagNameEndsAt: 18,
          tagName: "b",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "06"
    );
    t.end();
  }
);

// heuristically detecting tails and again new heads
tap.test(
  `07 - ${`\u001b[${33}m${`no overlap`}\u001b[${39}m`} - two Nunjucks tags, same pattern set of two, tight`,
  (t) => {
    const gathered = [];
    ct(`{%- a -%}{%- b -%}`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 9,
          value: "{%- a -%}",
          head: "{%-",
          headStartsAt: 0,
          headEndsAt: 3,
          tail: "-%}",
          tailStartsAt: 6,
          tailEndsAt: 9,
        },
        {
          type: "esp",
          start: 9,
          end: 18,
          value: "{%- b -%}",
          head: "{%-",
          headStartsAt: 9,
          headEndsAt: 12,
          tail: "-%}",
          tailStartsAt: 15,
          tailEndsAt: 18,
        },
      ],
      "07"
    );
    t.end();
  }
);

// heuristically detecting tails and again new heads, this time slightly different
tap.test(
  `08 - ${`\u001b[${33}m${`no overlap`}\u001b[${39}m`} - two nunjucks tags, different pattern set of two, tight`,
  (t) => {
    const gathered = [];
    ct(`{%- if count > 1 -%}{% if count > 1 %}`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 20,
          value: "{%- if count > 1 -%}",
          head: "{%-",
          headStartsAt: 0,
          headEndsAt: 3,
          tail: "-%}",
          tailStartsAt: 17,
          tailEndsAt: 20,
        },
        {
          type: "esp",
          start: 20,
          end: 38,
          value: "{% if count > 1 %}",
          head: "{%",
          headStartsAt: 20,
          headEndsAt: 22,
          tail: "%}",
          tailStartsAt: 36,
          tailEndsAt: 38,
        },
      ],
      "08"
    );
    t.end();
  }
);

// heuristically detecting tails and again new heads
tap.test(
  `09 - ${`\u001b[${33}m${`no overlap`}\u001b[${39}m`} - different set, *|zzz|*`,
  (t) => {
    const gathered = [];
    ct(`*|zzz|**|yyy|*`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 7,
          value: "*|zzz|*",
          head: "*|",
          headStartsAt: 0,
          headEndsAt: 2,
          tail: "|*",
          tailStartsAt: 5,
          tailEndsAt: 7,
        },
        {
          type: "esp",
          start: 7,
          end: 14,
          value: "*|yyy|*",
          head: "*|",
          headStartsAt: 7,
          headEndsAt: 9,
          tail: "|*",
          tailStartsAt: 12,
          tailEndsAt: 14,
        },
      ],
      "09"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------

// TODO:
// Java:
// <%@ ... %>
// <c:forEach ... > (no slash)
// <jsp:useBean ... />
// <c:set ... />
