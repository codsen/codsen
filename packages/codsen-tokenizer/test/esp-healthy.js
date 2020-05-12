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
    t.same(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 8,
          value: "{% zz %}",
          head: "{%",
          tail: "%}",
          kind: null,
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
    t.same(
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
          tail: "%}",
          kind: null,
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
    t.match(
      gathered,
      [
        {
          type: "text",
          start: 0,
          end: 3,
        },
        {
          type: "esp",
          start: 3,
          end: 21,
          tail: "%}",
        },
        {
          type: "text",
          start: 21,
          end: 24,
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
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 3,
        },
        {
          type: "esp",
          start: 3,
          end: 21,
          tail: "%}",
        },
        {
          type: "tag",
          start: 21,
          end: 24,
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
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 3,
          value: "<a>",
        },
        {
          type: "esp",
          start: 3,
          end: 15,
          head: "$(",
          tail: ")",
          value: "$(something)",
        },
        {
          type: "tag",
          start: 15,
          end: 18,
          value: "<b>",
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
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 3,
        },
        {
          type: "esp",
          start: 3,
          end: 16,
          head: "$(",
          tail: ")$",
        },
        {
          type: "tag",
          start: 16,
          end: 19,
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
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 9,
        },
        {
          type: "esp",
          start: 9,
          end: 18,
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
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 20,
        },
        {
          type: "esp",
          start: 20,
          end: 38,
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
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 7,
        },
        {
          type: "esp",
          start: 7,
          end: 14,
        },
      ],
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`no overlap`}\u001b[${39}m`} - error, two ESP tags joined, first one ends with heads instead of tails`,
  (t) => {
    const gathered = [];
    ct(`*|zzz*|*|yyy|*`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(
      gathered,
      [
        {
          type: "esp",
          start: 0,
          end: 7,
        },
        {
          type: "esp",
          start: 7,
          end: 14,
        },
      ],
      "10"
    );
    t.end();
  }
);
