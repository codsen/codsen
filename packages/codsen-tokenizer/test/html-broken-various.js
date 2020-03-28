const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");
const BACKSLASH = "\u005C";

// 01. rule tag-space-after-opening-bracket
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${33}m${`tag-space-after-opening-bracket`}\u001b[${39}m`} - 1`,
  (t) => {
    const gathered = [];
    ct(`a < b class="">`, {
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
          end: 2,
        },
        {
          type: "tag",
          start: 2,
          end: 15,
        },
      ],
      "01.01"
    );
    t.end();
  }
);

// 02. rule tag-closing-left-slash
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - 1`,
  (t) => {
    const gathered = [];
    ct(`<br${BACKSLASH}>`, {
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
          end: 5,
        },
      ],
      "02.01"
    );
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - 1`,
  (t) => {
    const gathered = [];
    ct(`<${BACKSLASH}br${BACKSLASH}>`, {
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
          end: 6,
        },
      ],
      "02.02"
    );
    t.end();
  }
);

// 03. Various
// -----------------------------------------------------------------------------

t.test(`03.01 - ${`\u001b[${33}m${`various`}\u001b[${39}m`} - xml`, (t) => {
  const gathered = [];
  ct(
    `a<!--[if]><z>
<AAAch>>
</o:Offict`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  t.same(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 1,
        value: "a",
        next: [],
      },
      {
        type: "comment",
        start: 1,
        end: 10,
        value: "<!--[if]>",
        kind: "only",
        closing: false,
        next: [],
      },
      {
        type: "tag",
        start: 10,
        end: 13,
        value: "<z>",
        tagNameStartsAt: 11,
        tagNameEndsAt: 12,
        tagName: "z",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        esp: [],
        kind: null,
        attribs: [],
        next: [],
      },
      {
        type: "text",
        start: 13,
        end: 33,
        value: "\n<AAAch>>\n</o:Offict",
        next: [],
      },
    ],
    "03.01"
  );
  t.end();
});
