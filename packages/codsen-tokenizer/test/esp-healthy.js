import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// ESP stands for Email Service Provider
// in practice, we cover all other templating languages too, for example,
// Moustache, Liquid or Jinja or even PHP - it's the same principle - "special"
// heads and tails surrounding some string, which can be placed anywhere in HTML

// ESP tag + something, no overlap
// -----------------------------------------------------------------------------

test(`01 - only an ESP tag`, () => {
  let gathered = [];
  ct(`{% zz %}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
    "01.01"
  );
});

test(`02 - text and ESP tag`, () => {
  let gathered = [];
  ct(`a{% zz %}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
    "02.01"
  );
});

test(`03 - text-ESP-text`, () => {
  let gathered = [];
  ct(`ab {% if something %} cd`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
    "03.01"
  );
});

test(`04 - tag-ESP-tag`, () => {
  let gathered = [];
  ct(`<a>{% if something %}<b>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
        kind: "inline",
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
        kind: "inline",
        attribs: [],
      },
    ],
    "04.01"
  );
});

// heuristically detecting tails and again new heads
test(`05 - two Nunjucks tags, same pattern set of two, tight`, () => {
  let gathered = [];
  ct(`{%- a -%}{%- b -%}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
    "05.01"
  );
});

// heuristically detecting tails and again new heads, this time slightly different
test(`06 - two nunjucks tags, different pattern set of two, tight`, () => {
  let gathered = [];
  ct(`{%- if count > 1 -%}{% if count > 1 %}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
    "06.01"
  );
});

// heuristically detecting tails and again new heads
test(`07 - different set, *|zzz|*`, () => {
  let gathered = [];
  ct(`*|zzz|**|yyy|*`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
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
    "07.01"
  );
});

test(`08 - two nunjucks tags in vicinity, minimal`, () => {
  let gathered = [];
  ct(`{{ abc }}{% endif %}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 9,
        value: "{{ abc }}",
        head: "{{",
        headStartsAt: 0,
        headEndsAt: 2,
        tail: "}}",
        tailStartsAt: 7,
        tailEndsAt: 9,
      },
      {
        type: "esp",
        start: 9,
        end: 20,
        value: "{% endif %}",
        head: "{%",
        headStartsAt: 9,
        headEndsAt: 11,
        tail: "%}",
        tailStartsAt: 18,
        tailEndsAt: 20,
      },
    ],
    "08.01"
  );
});

test(`09 - two nunjucks tags in vicinity, realistic`, () => {
  let gathered = [];
  ct(`{% if xyz %}Abc&nbsp;{{ def }}{% else %}Abc {{ def }}{% endif %}`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(
    gathered,
    [
      {
        type: "esp",
        start: 0,
        end: 12,
        value: "{% if xyz %}",
        head: "{%",
        headStartsAt: 0,
        headEndsAt: 2,
        tail: "%}",
        tailStartsAt: 10,
        tailEndsAt: 12,
      },
      {
        type: "text",
        start: 12,
        end: 21,
        value: "Abc&nbsp;",
      },
      {
        type: "esp",
        start: 21,
        end: 30,
        value: "{{ def }}",
        head: "{{",
        headStartsAt: 21,
        headEndsAt: 23,
        tail: "}}",
        tailStartsAt: 28,
        tailEndsAt: 30,
      },
      {
        type: "esp",
        start: 30,
        end: 40,
        value: "{% else %}",
        head: "{%",
        headStartsAt: 30,
        headEndsAt: 32,
        tail: "%}",
        tailStartsAt: 38,
        tailEndsAt: 40,
      },
      {
        type: "text",
        start: 40,
        end: 44,
        value: "Abc ",
      },
      {
        type: "esp",
        start: 44,
        end: 53,
        value: "{{ def }}",
        head: "{{",
        headStartsAt: 44,
        headEndsAt: 46,
        tail: "}}",
        tailStartsAt: 51,
        tailEndsAt: 53,
      },
      {
        type: "esp",
        start: 53,
        end: 64,
        value: "{% endif %}",
        head: "{%",
        headStartsAt: 53,
        headEndsAt: 55,
        tail: "%}",
        tailStartsAt: 62,
        tailEndsAt: 64,
      },
    ],
    "09.01"
  );
});

test(`10 - nunjucks, brackets`, () => {
  [
    `{%- if ((a | length) > 0) -%}`,
    `{%- if ((a | length) < 0) -%}`,
    `{%- if (a | length) > 0 and (b | length) > 0 -%}`,
    `{%- if (a | length) < 0 and (b | length) < 0 -%}`,
    `{%- if ((a | length) > 0) and ((b | length) > 0) -%}`,
    `{%- if ((a | length) < 0) and ((b | length) < 0) -%}`,
    `{%- if (((a | length) > 0) and ((b | length) > 0)) -%}`,
    `{%- if (((a | length) < 0) and ((b | length) < 0)) -%}`,
    `{%- if (((abc.klm and ((abc.def| length) < 5)) or ((not abc.klm) and ((abc.def| length) < 5))) and ((abc.def[0] and abc.def[0].pqr and abc.def[0].stuv and (abc.def[0].stuv == 1)) or (abc.def[1] and abc.def[1].pqr and abc.def[1].stuv and (abc.def[1].stuv == 1)))) -%}`,
    `{%- if (((abc.klm and ((abc.def| length) > 5)) or ((not abc.klm) and ((abc.def| length) > 5))) and ((abc.def[0] and abc.def[0].pqr and abc.def[0].stuv and (abc.def[0].stuv == 1)) or (abc.def[1] and abc.def[1].pqr and abc.def[1].stuv and (abc.def[1].stuv == 1)))) -%}`,
  ].forEach((input) => {
    let gathered = [];
    ct(input, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    equal(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: input.length,
          value: input,
          head: "{%-",
          headStartsAt: 0,
          headEndsAt: 3,
          tail: "-%}",
          tailStartsAt: input.length - 3,
          tailEndsAt: input.length,
        },
      ],
      "10"
    );
  });
});

// -----------------------------------------------------------------------------

// TODO:
// Java:
// <%@ ... %>
// <c:forEach ... > (no slash)
// <jsp:useBean ... />
// <c:set ... />

test.run();
