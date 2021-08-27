import tap from "tap";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";
// const BACKSLASH = "\u005C";

// 01. tight, tag name follows a closing bracket
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`one tag`}\u001b[${39}m`} - recognised tag name, 1 attr`,
  (t) => {
    const gathered = [];
    ct(`<a>img src="z"/><a>`, {
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
          type: "tag",
          start: 3,
          end: 16,
          value: `img src="z"/>`,
          tagNameStartsAt: 3,
          tagNameEndsAt: 6,
          tagName: "img",
          recognised: true,
          closing: false,
          void: true,
          pureHTML: true,

          kind: null,
          attribs: [
            {
              attribName: "src",
              attribValueRaw: "z",
              attribValue: [
                {
                  value: "z",
                },
              ],
            },
          ],
        },
        {
          type: "tag",
          start: 16,
          end: 19,
        },
      ],
      "01.01"
    );
    t.is(gathered.length, 3, "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`one tag`}\u001b[${39}m`} - leading whitespace`,
  (t) => {
    const gathered = [];
    ct(`<a>  img src="z"/><a>`, {
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
          type: "text",
          start: 3,
          end: 5,
        },
        {
          type: "tag",
          start: 5,
          end: 18,
        },
        {
          type: "tag",
          start: 18,
          end: 21,
        },
      ],
      "02.01"
    );
    t.is(gathered.length, 4, "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`one tag`}\u001b[${39}m`} - text around`,
  (t) => {
    const gathered = [];
    ct(`<a>bc img src="z"/>de<a>`, {
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
          type: "text",
          start: 3,
          end: 6,
        },
        {
          type: "tag",
          start: 6,
          end: 19,
        },
        {
          type: "text",
          start: 19,
          end: 21,
        },
        {
          type: "tag",
          start: 21,
          end: 24,
        },
      ],
      "03.01"
    );
    t.is(gathered.length, 5, "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`one tag`}\u001b[${39}m`} - hardcore case - two tags`,
  (t) => {
    const gathered = [];
    ct(`<a>bc img src="x"/>de img src="y">fg<a>`, {
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
          type: "text",
          start: 3,
          end: 6,
        },
        {
          type: "tag",
          start: 6,
          end: 19,
        },
        {
          type: "text",
          start: 19,
          end: 22,
        },
        {
          type: "tag",
          start: 22,
          end: 34,
        },
        {
          type: "text",
          start: 34,
          end: 36,
        },
        {
          type: "tag",
          start: 36,
          end: 39,
        },
      ],
      "04.01"
    );
    t.is(gathered.length, 7, "04.02");
    t.end();
  }
);

// 02. two tags
// -----------------------------------------------------------------------------

tap.test(`05 - ${`\u001b[${33}m${`two tags`}\u001b[${39}m`} - tight`, (t) => {
  const gathered = [];
  ct(`<a>img src="z"/>img src="y"><a>`, {
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
        type: "tag",
        start: 3,
        end: 16,
        value: `img src="z"/>`,
        tagNameStartsAt: 3,
        tagNameEndsAt: 6,
        tagName: "img",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,

        kind: null,
        attribs: [
          {
            attribName: "src",
            attribValueRaw: "z",
            attribValue: [
              {
                value: "z",
              },
            ],
          },
        ],
      },
      {
        type: "tag",
        start: 16,
        end: 28,
        value: `img src="y">`,
        tagNameStartsAt: 16,
        tagNameEndsAt: 19,
        tagName: "img",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,

        kind: null,
        attribs: [
          {
            attribName: "src",
            attribValueRaw: "y",
            attribValue: [
              {
                value: "y",
              },
            ],
          },
        ],
      },
      {
        type: "tag",
        start: 28,
        end: 31,
      },
    ],
    "05.01"
  );
  t.is(gathered.length, 4, "05.02");
  t.end();
});
