const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");
const doubleQuotes = `\u0022`;
const apostrophe = `\u0027`;

// 01. basic - double quoted attributes
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - single- and double-quoted attr`,
  (t) => {
    const gathered = [];
    ct(`<a b="c" d='e'>`, {
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
          end: 15,
          attribs: [
            {
              attribName: "b",
              attribNameStartsAt: 3,
              attribNameEndsAt: 4,
              attribOpeningQuoteAt: 5,
              attribClosingQuoteAt: 7,
              attribValue: "c",
              attribValueStartsAt: 6,
              attribValueEndsAt: 7,
              attribStart: 3,
              attribEnd: 8,
            },
            {
              attribName: "d",
              attribNameStartsAt: 9,
              attribNameEndsAt: 10,
              attribOpeningQuoteAt: 11,
              attribClosingQuoteAt: 13,
              attribValue: "e",
              attribValueStartsAt: 12,
              attribValueEndsAt: 13,
              attribStart: 9,
              attribEnd: 14,
            },
          ],
        },
      ],
      "01.01"
    );
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - value-less attribute`,
  (t) => {
    const gathered = [];
    ct(`<TD nowrap class="z">`, {
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
          end: 21,
          attribs: [
            {
              attribName: "nowrap",
              attribNameStartsAt: 4,
              attribNameEndsAt: 10,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: null,
              attribValueStartsAt: null,
              attribValueEndsAt: null,
              attribStart: 4,
              attribEnd: 10,
            },
            {
              attribName: "class",
              attribNameStartsAt: 11,
              attribNameEndsAt: 16,
              attribOpeningQuoteAt: 17,
              attribClosingQuoteAt: 19,
              attribValue: "z",
              attribValueStartsAt: 18,
              attribValueEndsAt: 19,
              attribStart: 11,
              attribEnd: 20,
            },
          ],
        },
      ],
      "01.02"
    );
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - a closing tag`,
  (t) => {
    const gathered = [];
    ct(`</Td>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          tagNameStartsAt: 2,
          tagNameEndsAt: 4,
          tagName: "td",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          type: "tag",
          start: 0,
          end: 5,
          tail: null,
          kind: null,
          attribs: [],
        },
      ],
      "01.03"
    );
    t.end();
  }
);

// space inside tag
t.test(
  `01.04 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - a closing tag`,
  (t) => {
    const gathered = [];
    ct(`</tD >`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          tagNameStartsAt: 2,
          tagNameEndsAt: 4,
          tagName: "td",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          type: "tag",
          start: 0,
          end: 6,
          tail: null,
          kind: null,
          attribs: [],
        },
      ],
      "01.04"
    );
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${36}m${`basic`}\u001b[${39}m`} - single- and double-quoted attr`,
  (t) => {
    const gathered = [];
    ct(`<a b="c" d='e'>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
      tagCbLookahead: 3,
    });

    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 15,
          attribs: [
            {
              attribName: "b",
              attribNameStartsAt: 3,
              attribNameEndsAt: 4,
              attribOpeningQuoteAt: 5,
              attribClosingQuoteAt: 7,
              attribValue: "c",
              attribValueStartsAt: 6,
              attribValueEndsAt: 7,
              attribStart: 3,
              attribEnd: 8,
            },
            {
              attribName: "d",
              attribNameStartsAt: 9,
              attribNameEndsAt: 10,
              attribOpeningQuoteAt: 11,
              attribClosingQuoteAt: 13,
              attribValue: "e",
              attribValueStartsAt: 12,
              attribValueEndsAt: 13,
              attribStart: 9,
              attribEnd: 14,
            },
          ],
        },
      ],
      "01.05.01"
    );
    t.same(gathered.length, 1, "01.05.02");
    t.end();
  }
);

// 02. broken
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`broken`}\u001b[${39}m`} - no equals but quotes present`,
  (t) => {
    const gathered = [];
    ct(`<a href"www" class'e'>`, {
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
          end: 22,
          value: `<a href"www" class'e'>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "href",
              attribNameRecognised: true,
              attribNameStartsAt: 3,
              attribNameEndsAt: 7,
              attribOpeningQuoteAt: 7,
              attribClosingQuoteAt: 11,
              attribValue: "www",
              attribValueStartsAt: 8,
              attribValueEndsAt: 11,
              attribStart: 3,
              attribEnd: 12,
            },
            {
              attribName: "class",
              attribNameRecognised: true,
              attribNameStartsAt: 13,
              attribNameEndsAt: 18,
              attribOpeningQuoteAt: 18,
              attribClosingQuoteAt: 20,
              attribValue: "e",
              attribValueStartsAt: 19,
              attribValueEndsAt: 20,
              attribStart: 13,
              attribEnd: 21,
            },
          ],
        },
      ],
      "02.01"
    );
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`broken`}\u001b[${39}m`} - no opening quotes but equals present`,
  (t) => {
    const gathered = [];
    ct(`<a href=www" class=e'>`, {
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
          end: 22,
          value: `<a href=www" class=e'>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "href",
              attribNameRecognised: true,
              attribNameStartsAt: 3,
              attribNameEndsAt: 7,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 11,
              attribValue: "www",
              attribValueStartsAt: 8,
              attribValueEndsAt: 11,
              attribStart: 3,
              attribEnd: 12,
            },
            {
              attribName: "class",
              attribNameRecognised: true,
              attribNameStartsAt: 13,
              attribNameEndsAt: 18,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 20,
              attribValue: "e",
              attribValueStartsAt: 19,
              attribValueEndsAt: 20,
              attribStart: 13,
              attribEnd: 21,
            },
          ],
        },
      ],
      "02.02"
    );
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${36}m${`broken`}\u001b[${39}m`} - two equals`,
  (t) => {
    const gathered = [];
    ct(`<a b=="c" d=='e'>`, {
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
          end: 17,
          attribs: [
            {
              attribName: "b",
              attribNameStartsAt: 3,
              attribNameEndsAt: 4,
              attribOpeningQuoteAt: 6,
              attribClosingQuoteAt: 8,
              attribValue: "c",
              attribValueStartsAt: 7,
              attribValueEndsAt: 8,
              attribStart: 3,
              attribEnd: 9,
            },
            {
              attribName: "d",
              attribNameStartsAt: 10,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 13,
              attribClosingQuoteAt: 15,
              attribValue: "e",
              attribValueStartsAt: 14,
              attribValueEndsAt: 15,
              attribStart: 10,
              attribEnd: 16,
            },
          ],
        },
      ],
      "02.03"
    );
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${36}m${`broken`}\u001b[${39}m`} - empty attr value`,
  (t) => {
    const gathered = [];
    ct(`<body alink="">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "body",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          type: "tag",
          start: 0,
          end: 15,
          tail: null,
          kind: null,
          attribs: [
            {
              attribName: "alink",
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 12,
              attribClosingQuoteAt: 13,
              attribValue: "",
              attribValueStartsAt: 13,
              attribValueEndsAt: 13,
              attribStart: 6,
              attribEnd: 14,
            },
          ],
        },
      ],
      "02.04"
    );
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${36}m${`broken`}\u001b[${39}m`} - false alarm, brackets - rgb()`,
  (t) => {
    const gathered = [];
    ct(`<body alink="rgb()">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "body",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          type: "tag",
          start: 0,
          end: 20,
          tail: null,
          kind: null,
          attribs: [
            {
              attribName: "alink",
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 12,
              attribClosingQuoteAt: 18,
              attribValue: "rgb()",
              attribValueStartsAt: 13,
              attribValueEndsAt: 18,
              attribStart: 6,
              attribEnd: 19,
            },
          ],
        },
      ],
      "02.05"
    );
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${36}m${`broken`}\u001b[${39}m`} - space instead of equal`,
  (t) => {
    const gathered = [];
    ct(`<a class "c" id 'e' href "www">`, {
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
          end: 31,
          value: `<a class "c" id 'e' href "www">`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "class",
              attribNameRecognised: true,
              attribNameStartsAt: 3,
              attribNameEndsAt: 8,
              attribOpeningQuoteAt: 9,
              attribClosingQuoteAt: 11,
              attribValue: "c",
              attribValueStartsAt: 10,
              attribValueEndsAt: 11,
              attribStart: 3,
              attribEnd: 12,
            },
            {
              attribName: "id",
              attribNameRecognised: true,
              attribNameStartsAt: 13,
              attribNameEndsAt: 15,
              attribOpeningQuoteAt: 16,
              attribClosingQuoteAt: 18,
              attribValue: "e",
              attribValueStartsAt: 17,
              attribValueEndsAt: 18,
              attribStart: 13,
              attribEnd: 19,
            },
            {
              attribName: "href",
              attribNameRecognised: true,
              attribNameStartsAt: 20,
              attribNameEndsAt: 24,
              attribOpeningQuoteAt: 25,
              attribClosingQuoteAt: 29,
              attribValue: "www",
              attribValueStartsAt: 26,
              attribValueEndsAt: 29,
              attribStart: 20,
              attribEnd: 30,
            },
          ],
        },
      ],
      "02.06"
    );
    t.end();
  }
);

// 03. bool attributes
// -----------------------------------------------------------------------------

t.test(`03.01`, (t) => {
  const gathered = [];
  ct(`<td nowrap>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
      {
        tagNameStartsAt: 1,
        tagNameEndsAt: 3,
        tagName: "td",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 11,
        tail: null,
        kind: null,
        attribs: [
          {
            attribName: "nowrap",
            attribNameStartsAt: 4,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValue: null,
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStart: 4,
            attribEnd: 10,
          },
        ],
      },
    ],
    "03.01"
  );
  t.end();
});

t.test(`03.02 - slash in the end`, (t) => {
  const gathered = [];
  ct(`<td nowrap/>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
      {
        tagNameStartsAt: 1,
        tagNameEndsAt: 3,
        tagName: "td",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 12,
        tail: null,
        kind: null,
        attribs: [
          {
            attribName: "nowrap",
            attribNameStartsAt: 4,
            attribNameEndsAt: 10,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValue: null,
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStart: 4,
            attribEnd: 10,
          },
        ],
      },
    ],
    "03.02"
  );
  t.end();
});

t.test(`03.03 - slash in front`, (t) => {
  const gathered = [];
  ct(`</td nowrap>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
      {
        tagNameStartsAt: 2,
        tagNameEndsAt: 4,
        tagName: "td",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 12,
        tail: null,
        kind: null,
        attribs: [
          {
            attribName: "nowrap",
            attribNameStartsAt: 5,
            attribNameEndsAt: 11,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValue: null,
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStart: 5,
            attribEnd: 11,
          },
        ],
      },
    ],
    "03.03"
  );
  t.end();
});

t.test(`03.04 - now crazier`, (t) => {
  const gathered = [];
  ct(`</td nowrap yo yo/>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
      {
        tagNameStartsAt: 2,
        tagNameEndsAt: 4,
        tagName: "td",
        recognised: true,
        closing: true,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 19,
        tail: null,
        kind: null,
        attribs: [
          {
            attribName: "nowrap",
            attribNameStartsAt: 5,
            attribNameEndsAt: 11,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValue: null,
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStart: 5,
            attribEnd: 11,
          },
          {
            attribName: "yo",
            attribNameStartsAt: 12,
            attribNameEndsAt: 14,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValue: null,
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStart: 12,
            attribEnd: 14,
          },
          {
            attribName: "yo",
            attribNameStartsAt: 15,
            attribNameEndsAt: 17,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValue: null,
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStart: 15,
            attribEnd: 17,
          },
        ],
      },
    ],
    "03.04"
  );
  t.end();
});

t.test(`03.05 - unrecognised tag`, (t) => {
  const gathered = [];
  ct(`<zzz accept-charset="utf-8" yyy>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
      {
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "zzz",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 32,
        kind: null,
        attribs: [
          {
            attribName: "accept-charset",
            attribNameStartsAt: 5,
            attribNameEndsAt: 19,
            attribOpeningQuoteAt: 20,
            attribClosingQuoteAt: 26,
            attribValue: "utf-8",
            attribValueStartsAt: 21,
            attribValueEndsAt: 26,
            attribStart: 5,
            attribEnd: 27,
          },
          {
            attribName: "yyy",
            attribNameStartsAt: 28,
            attribNameEndsAt: 31,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValue: null,
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStart: 28,
            attribEnd: 31,
          },
        ],
      },
    ],
    "03.05"
  );
  t.end();
});

// 04. erroneous code
// -----------------------------------------------------------------------------

t.test(`04.01 - attr value without quotes`, (t) => {
  const gathered = [];
  ct(`<abc de=fg hi="jkl">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
      {
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "abc",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 20,
        tail: null,
        kind: null,
        attribs: [
          {
            attribName: "de",
            attribNameStartsAt: 5,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValue: "fg",
            attribValueStartsAt: 8,
            attribValueEndsAt: 10,
            attribStart: 5,
            attribEnd: 10,
          },
          {
            attribName: "hi",
            attribNameStartsAt: 11,
            attribNameEndsAt: 13,
            attribOpeningQuoteAt: 14,
            attribClosingQuoteAt: 18,
            attribValue: "jkl",
            attribValueStartsAt: 15,
            attribValueEndsAt: 18,
            attribStart: 11,
            attribEnd: 19,
          },
        ],
      },
    ],
    "04.01"
  );
  t.end();
});

t.test(`04.02 - attr value without quotes leads to tag's end`, (t) => {
  const gathered = [];
  ct(`<abc de=fg/>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
      {
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "abc",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 12,
        tail: null,
        kind: null,
        attribs: [
          {
            attribName: "de",
            attribNameStartsAt: 5,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValue: "fg",
            attribValueStartsAt: 8,
            attribValueEndsAt: 10,
            attribStart: 5,
            attribEnd: 10,
          },
        ],
      },
    ],
    "04.02"
  );
  t.end();
});

t.test(`04.03 - attr value without quotes leads to tag's end`, (t) => {
  const gathered = [];
  ct(`<abc de=fg>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
      {
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "abc",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        type: "tag",
        start: 0,
        end: 11,
        kind: null,
        attribs: [
          {
            attribName: "de",
            attribNameStartsAt: 5,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: null,
            attribClosingQuoteAt: null,
            attribValue: "fg",
            attribValueStartsAt: 8,
            attribValueEndsAt: 10,
            attribStart: 5,
            attribEnd: 10,
          },
        ],
      },
    ],
    "04.03"
  );
  t.end();
});

// 05. mismatching quotes
// -----------------------------------------------------------------------------

t.test(
  `05.01 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - no quotes in the value, A-B`,
  (t) => {
    const gathered = [];
    ct(`<div class="c'>.</div>`, {
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
          end: 15,
          value: `<div class="c'>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 4,
          tagName: "div",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "class",
              attribNameRecognised: true,
              attribNameStartsAt: 5,
              attribNameEndsAt: 10,
              attribOpeningQuoteAt: 11,
              attribClosingQuoteAt: 13,
              attribValue: "c",
              attribValueStartsAt: 12,
              attribValueEndsAt: 13,
              attribStart: 5,
              attribEnd: 14,
            },
          ],
        },
        {
          type: "text",
          start: 15,
          end: 16,
          value: ".",
        },
        {
          type: "tag",
          start: 16,
          end: 22,
          value: "</div>",
          tagNameStartsAt: 18,
          tagNameEndsAt: 21,
          tagName: "div",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "05.01"
    );
    t.end();
  }
);

t.test(
  `05.02 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - no quotes in the value, B-A`,
  (t) => {
    const gathered = [];
    ct(`<div class='c">.</div>`, {
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
          end: 15,
          value: `<div class='c">`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 4,
          tagName: "div",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "class",
              attribNameRecognised: true,
              attribNameStartsAt: 5,
              attribNameEndsAt: 10,
              attribOpeningQuoteAt: 11,
              attribClosingQuoteAt: 13,
              attribValue: "c",
              attribValueStartsAt: 12,
              attribValueEndsAt: 13,
              attribStart: 5,
              attribEnd: 14,
            },
          ],
        },
        {
          type: "text",
          start: 15,
          end: 16,
          value: ".",
        },
        {
          type: "tag",
          start: 16,
          end: 22,
          value: "</div>",
          tagNameStartsAt: 18,
          tagNameEndsAt: 21,
          tagName: "div",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "05.02"
    );
    t.end();
  }
);

t.test(
  `05.03 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - matching quotes as control - double quotes in the value, A-B-B-A. end of tag follows`,
  (t) => {
    const gathered = [];
    ct(`<img alt='so-called "artists"!'/>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.same(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 33,
          value: `<img alt='so-called "artists"!'/>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 4,
          tagName: "img",
          recognised: true,
          closing: false,
          void: true,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "alt",
              attribNameRecognised: true,
              attribNameStartsAt: 5,
              attribNameEndsAt: 8,
              attribOpeningQuoteAt: 9,
              attribClosingQuoteAt: 30,
              attribValue: `so-called "artists"!`,
              attribValueStartsAt: 10,
              attribValueEndsAt: 30,
              attribStart: 5,
              attribEnd: 31,
            },
          ],
        },
      ],
      "05.03"
    );
    t.end();
  }
);

t.todo(
  `05.04 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - matching quotes as control - double quotes in the value, A-B-B-A. another attribute follows`,
  (t) => {
    const gathered = [];
    ct(`<img alt='so-called "artists"!' class='yo'/>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.same(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 44,
          value: `<img alt='so-called "artists"!' class='yo'/>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 4,
          tagName: "img",
          recognised: true,
          closing: false,
          void: true,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "alt",
              attribNameRecognised: true,
              attribNameStartsAt: 5,
              attribNameEndsAt: 8,
              attribOpeningQuoteAt: 9,
              attribClosingQuoteAt: 30,
              attribValue: `so-called "artists"!`,
              attribValueStartsAt: 10,
              attribValueEndsAt: 30,
              attribStart: 5,
              attribEnd: 31,
            },
            {
              attribName: "class",
              attribNameRecognised: true,
              attribNameStartsAt: 32,
              attribNameEndsAt: 37,
              attribOpeningQuoteAt: 38,
              attribClosingQuoteAt: 41,
              attribValue: "yo",
              attribValueStartsAt: 39,
              attribValueEndsAt: 41,
              attribStart: 32,
              attribEnd: 42,
            },
          ],
        },
      ],
      "05.04"
    );
    t.end();
  }
);

t.todo(
  `05.05 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - double quotes in the value, A-B. end of tag follows`,
  (t) => {
    const gathered = [];
    ct(`<img alt='so-called "artists"!"/>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.same(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 33,
          value: `<img alt='so-called "artists"!"/>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 4,
          tagName: "img",
          recognised: true,
          closing: false,
          void: true,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "alt",
              attribNameRecognised: true,
              attribNameStartsAt: 5,
              attribNameEndsAt: 8,
              attribOpeningQuoteAt: 9,
              attribClosingQuoteAt: 30,
              attribValue: `so-called "artists"!`,
              attribValueStartsAt: 10,
              attribValueEndsAt: 30,
              attribStart: 5,
              attribEnd: 31,
            },
          ],
        },
      ],
      "05.05"
    );
    t.end();
  }
);

t.todo(
  `05.06 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - double quotes in the value, A-B, attr follows`,
  (t) => {
    const gathered = [];
    ct(`<img alt='so-called "artists"!" style="display:block;"/>`, {
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
          end: 56,
          value: `<img alt='so-called "artists"!" style="display:block;"/>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 4,
          tagName: "img",
          recognised: true,
          closing: false,
          void: true,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "alt",
              attribNameRecognised: true,
              attribNameStartsAt: 5,
              attribNameEndsAt: 8,
              attribOpeningQuoteAt: 9,
              attribClosingQuoteAt: 30,
              attribValue: `so-called "artists"!`,
              attribValueStartsAt: 10,
              attribValueEndsAt: 30,
              attribStart: 5,
              attribEnd: 31,
            },
            {
              attribName: "style",
              attribNameRecognised: true,
              attribNameStartsAt: 32,
              attribNameEndsAt: 37,
              attribOpeningQuoteAt: 38,
              attribClosingQuoteAt: 53,
              attribValue: "display:block;",
              attribValueStartsAt: 39,
              attribValueEndsAt: 53,
              attribStart: 32,
              attribEnd: 54,
            },
          ],
        },
      ],
      "05.06"
    );
    t.end();
  }
);

t.todo(
  `05.07 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - double quotes in the value, B-A`,
  (t) => {
    const gathered = [];
    ct(`<img alt="so-called "artists"!'/>`, {
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
          end: 33,
          value: `<img alt="so-called "artists"!'/>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 4,
          tagName: "img",
          recognised: true,
          closing: false,
          void: true,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "alt",
              attribNameRecognised: true,
              attribNameStartsAt: 5,
              attribNameEndsAt: 8,
              attribOpeningQuoteAt: 9,
              attribClosingQuoteAt: 30,
              attribValue: `so-called "artists"!`,
              attribValueStartsAt: 10,
              attribValueEndsAt: 30,
              attribStart: 5,
              attribEnd: 31,
            },
          ],
        },
      ],
      "05.07"
    );
    t.end();
  }
);

t.todo(
  `05.08 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - single quotes in the value, A-B`,
  (t) => {
    const gathered = [];
    ct(`<img alt="Deal is your's!'/>`, {
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
          end: 28,
          value: `<img alt="Deal is your's!'/>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 4,
          tagName: "img",
          recognised: true,
          closing: false,
          void: true,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "alt",
              attribNameRecognised: true,
              attribNameStartsAt: 5,
              attribNameEndsAt: 8,
              attribOpeningQuoteAt: 9,
              attribClosingQuoteAt: 25,
              attribValue: `Deal is your's!`,
              attribValueStartsAt: 10,
              attribValueEndsAt: 25,
              attribStart: 5,
              attribEnd: 26,
            },
          ],
        },
      ],
      "05.08"
    );
    t.end();
  }
);

t.todo(
  `05.09 - ${`\u001b[${33}m${`mismatching quotes`}\u001b[${39}m`} - single quotes in the value, B-A`,
  (t) => {
    const gathered = [];
    ct(`<img alt='Deal is your's!"/>`, {
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
          end: 28,
          value: `<img alt='Deal is your's!"/>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 4,
          tagName: "img",
          recognised: true,
          closing: false,
          void: true,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "alt",
              attribNameRecognised: true,
              attribNameStartsAt: 5,
              attribNameEndsAt: 8,
              attribOpeningQuoteAt: 9,
              attribClosingQuoteAt: 25,
              attribValue: `Deal is your's!`,
              attribValueStartsAt: 10,
              attribValueEndsAt: 25,
              attribStart: 5,
              attribEnd: 26,
            },
          ],
        },
      ],
      "05.09"
    );
    t.end();
  }
);

// 06. terminating unclosed string value (content within quotes)
// -----------------------------------------------------------------------------

t.test(`06.01 - attr value without quotes leads to tag's end`, (t) => {
  const gathered = [];
  ct(`<abc de =">\ntext<div class="z">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
      {
        type: "tag",
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "abc",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        start: 0,
        end: 11,
        kind: null,
        attribs: [
          {
            attribName: "de",
            attribNameStartsAt: 5,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: null,
            attribValue: null,
            attribValueStartsAt: null,
            attribValueEndsAt: null,
            attribStart: 5,
            attribEnd: 10,
          },
        ],
      },
      {
        type: "text",
        start: 11,
        end: 16,
      },
      {
        type: "tag",
        tagNameStartsAt: 17,
        tagNameEndsAt: 20,
        tagName: "div",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        start: 16,
        end: 31,
        kind: null,
        attribs: [
          {
            attribName: "class",
            attribNameStartsAt: 21,
            attribNameEndsAt: 26,
            attribOpeningQuoteAt: 27,
            attribClosingQuoteAt: 29,
            attribValue: "z",
            attribValueStartsAt: 28,
            attribValueEndsAt: 29,
            attribStart: 21,
            attribEnd: 30,
          },
        ],
      },
    ],
    "06.01"
  );
  t.end();
});

t.test(
  `06.02 - missing closing quote, cheeky raw text bracket follows`,
  (t) => {
    const gathered = [];
    ct(`<abc de="> "a" > "z"`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          type: "tag",
          tagNameStartsAt: 1,
          tagNameEndsAt: 4,
          tagName: "abc",
          recognised: false,
          closing: false,
          void: false,
          pureHTML: true,
          start: 0,
          end: 10,
          kind: null,
          attribs: [
            {
              attribName: "de",
              attribNameStartsAt: 5,
              attribNameEndsAt: 7,
              attribOpeningQuoteAt: 8,
              attribClosingQuoteAt: null,
              attribValue: null,
              attribValueStartsAt: null,
              attribValueEndsAt: null,
              attribStart: 5,
              attribEnd: 9,
            },
          ],
        },
        {
          type: "text",
          start: 10,
          end: 20,
        },
      ],
      "06.02"
    );
    t.end();
  }
);

t.test(
  `06.03 - two errors: space before equal and closing quotes missing`,
  (t) => {
    const gathered = [];
    ct(`<input type="radio" checked =">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          type: "tag",
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "input",
          recognised: true,
          closing: false,
          void: true,
          pureHTML: true,
          start: 0,
          end: 31,
          kind: null,
          attribs: [
            {
              attribName: "type",
              attribNameStartsAt: 7,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 12,
              attribClosingQuoteAt: 18,
              attribValue: "radio",
              attribValueStartsAt: 13,
              attribValueEndsAt: 18,
              attribStart: 7,
              attribEnd: 19,
            },
            {
              attribName: "checked",
              attribNameStartsAt: 20,
              attribNameEndsAt: 27,
              attribOpeningQuoteAt: 29,
              attribClosingQuoteAt: null,
              attribValue: null,
              attribValueStartsAt: null,
              attribValueEndsAt: null,
              attribStart: 20,
              attribEnd: 30,
            },
          ],
        },
      ],
      "06.03"
    );
    t.end();
  }
);

t.test(
  `06.04 - two errors: space before equal and closing quotes missing, text follows`,
  (t) => {
    const gathered = [];
    ct(`<input type="radio" checked ="> x y z `, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          type: "tag",
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "input",
          recognised: true,
          closing: false,
          void: true,
          pureHTML: true,
          start: 0,
          end: 31,
          kind: null,
          attribs: [
            {
              attribName: "type",
              attribNameStartsAt: 7,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 12,
              attribClosingQuoteAt: 18,
              attribValue: "radio",
              attribValueStartsAt: 13,
              attribValueEndsAt: 18,
              attribStart: 7,
              attribEnd: 19,
            },
            {
              attribName: "checked",
              attribNameStartsAt: 20,
              attribNameEndsAt: 27,
              attribOpeningQuoteAt: 29,
              attribClosingQuoteAt: null,
              attribValue: null,
              attribValueStartsAt: null,
              attribValueEndsAt: null,
              attribStart: 20,
              attribEnd: 30,
            },
          ],
        },
        {
          type: "text",
          start: 31,
          end: 38,
          tail: null,
          kind: null,
        },
      ],
      "06.04"
    );
    t.end();
  }
);

t.test(`06.05 - two asterisks as an attribute's value`, (t) => {
  const gathered = [];
  ct(`<frameset cols="**">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
      {
        type: "tag",
        tagNameStartsAt: 1,
        tagNameEndsAt: 9,
        tagName: "frameset",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        start: 0,
        end: 20,
        kind: null,
        attribs: [
          {
            attribName: "cols",
            attribNameStartsAt: 10,
            attribNameEndsAt: 14,
            attribOpeningQuoteAt: 15,
            attribClosingQuoteAt: 18,
            attribValue: "**",
            attribValueStartsAt: 16,
            attribValueEndsAt: 18,
            attribStart: 10,
            attribEnd: 19,
          },
        ],
      },
    ],
    "06.05"
  );
  t.end();
});

t.test(`06.06 - many asterisks as an attribute's value`, (t) => {
  const gathered = [];
  ct(`<frameset cols="******">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
      {
        type: "tag",
        tagNameStartsAt: 1,
        tagNameEndsAt: 9,
        tagName: "frameset",
        recognised: true,
        closing: false,
        void: false,
        pureHTML: true,
        start: 0,
        end: 24,
        kind: null,
        attribs: [
          {
            attribName: "cols",
            attribNameStartsAt: 10,
            attribNameEndsAt: 14,
            attribOpeningQuoteAt: 15,
            attribClosingQuoteAt: 22,
            attribValue: "******",
            attribValueStartsAt: 16,
            attribValueEndsAt: 22,
            attribStart: 10,
            attribEnd: 23,
          },
        ],
      },
    ],
    "06.06"
  );
  t.end();
});

t.test(`06.07 - unescaped bracket as value, one tag`, (t) => {
  const gathered = [];
  ct(`<abc de=">">`, {
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
        end: 12,
        value: '<abc de=">">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "abc",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "de",
            attribNameRecognised: false,
            attribNameStartsAt: 5,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: 8,
            attribClosingQuoteAt: 10,
            attribValue: ">",
            attribValueStartsAt: 9,
            attribValueEndsAt: 10,
            attribStart: 5,
            attribEnd: 11,
          },
        ],
      },
    ],
    "06.07"
  );
  t.end();
});

t.test(`06.08 - unescaped bracket as value, few tags`, (t) => {
  const gathered = [];
  ct(`<abc de=">" fg="h">`, {
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
        end: 19,
        value: '<abc de=">" fg="h">',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "abc",
        recognised: false,
        closing: false,
        void: false,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "de",
            attribNameRecognised: false,
            attribNameStartsAt: 5,
            attribNameEndsAt: 7,
            attribOpeningQuoteAt: 8,
            attribClosingQuoteAt: 10,
            attribValue: ">",
            attribValueStartsAt: 9,
            attribValueEndsAt: 10,
            attribStart: 5,
            attribEnd: 11,
          },
          {
            attribName: "fg",
            attribNameRecognised: false,
            attribNameStartsAt: 12,
            attribNameEndsAt: 14,
            attribOpeningQuoteAt: 15,
            attribClosingQuoteAt: 17,
            attribValue: "h",
            attribValueStartsAt: 16,
            attribValueEndsAt: 17,
            attribStart: 12,
            attribEnd: 18,
          },
        ],
      },
    ],
    "06.08"
  );
  t.end();
});

t.test(`06.09 - unescaped bracket as value, more tags`, (t) => {
  const gathered = [];
  ct(
    `<img alt="click here >" width="7" height="8" border="9" style="display:block;"/>`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );

  t.match(
    gathered,
    [
      {
        type: "tag",
        start: 0,
        end: 80,
        value:
          '<img alt="click here >" width="7" height="8" border="9" style="display:block;"/>',
        tagNameStartsAt: 1,
        tagNameEndsAt: 4,
        tagName: "img",
        recognised: true,
        closing: false,
        void: true,
        pureHTML: true,
        kind: null,
        attribs: [
          {
            attribName: "alt",
            attribNameRecognised: true,
            attribNameStartsAt: 5,
            attribNameEndsAt: 8,
            attribOpeningQuoteAt: 9,
            attribClosingQuoteAt: 22,
            attribValue: "click here >",
            attribValueStartsAt: 10,
            attribValueEndsAt: 22,
            attribStart: 5,
            attribEnd: 23,
          },
          {
            attribName: "width",
            attribNameRecognised: true,
            attribNameStartsAt: 24,
            attribNameEndsAt: 29,
            attribOpeningQuoteAt: 30,
            attribClosingQuoteAt: 32,
            attribValue: "7",
            attribValueStartsAt: 31,
            attribValueEndsAt: 32,
            attribStart: 24,
            attribEnd: 33,
          },
          {
            attribName: "height",
            attribNameRecognised: true,
            attribNameStartsAt: 34,
            attribNameEndsAt: 40,
            attribOpeningQuoteAt: 41,
            attribClosingQuoteAt: 43,
            attribValue: "8",
            attribValueStartsAt: 42,
            attribValueEndsAt: 43,
            attribStart: 34,
            attribEnd: 44,
          },
          {
            attribName: "border",
            attribNameRecognised: true,
            attribNameStartsAt: 45,
            attribNameEndsAt: 51,
            attribOpeningQuoteAt: 52,
            attribClosingQuoteAt: 54,
            attribValue: "9",
            attribValueStartsAt: 53,
            attribValueEndsAt: 54,
            attribStart: 45,
            attribEnd: 55,
          },
          {
            attribName: "style",
            attribNameRecognised: true,
            attribNameStartsAt: 56,
            attribNameEndsAt: 61,
            attribOpeningQuoteAt: 62,
            attribClosingQuoteAt: 77,
            attribValue: "display:block;",
            attribValueStartsAt: 63,
            attribValueEndsAt: 77,
            attribStart: 56,
            attribEnd: 78,
          },
        ],
      },
    ],
    "06.09"
  );
  t.end();
});

// 07. recognised and not recognised
// -----------------------------------------------------------------------------

t.test(`07.01 - two attrs, one recognised one not`, (t) => {
  const gathered = [];
  ct(`<table class="aa" bbb="cc">`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(gathered, [
    {
      type: "tag",
      tagName: "table",
      recognised: true,
      start: 0,
      end: 27,
      attribs: [
        {
          attribName: "class",
          attribNameRecognised: true,
          attribStart: 7,
          attribEnd: 17,
        },
        {
          attribName: "bbb",
          attribNameRecognised: false,
          attribStart: 18,
          attribEnd: 26,
        },
      ],
    },
  ]);
  t.end();
});

// 08. broken opening
// -----------------------------------------------------------------------------

t.test(
  `08.01 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - missing opening quote`,
  (t) => {
    const gathered = [];
    ct(
      `<span width=100">
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 17,
          value: '<span width=100">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 15,
              attribValue: "100",
              attribValueStartsAt: 12,
              attribValueEndsAt: 15,
              attribStart: 6,
              attribEnd: 16,
            },
          ],
        },
        {
          type: "text",
          start: 17,
          end: 24,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 24,
          end: 31,
          value: "</span>",
          tagNameStartsAt: 26,
          tagNameEndsAt: 30,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.01"
    );
    t.end();
  }
);

t.test(
  `08.02 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - mismatching quotes`,
  (t) => {
    const gathered = [];
    ct(`<span width='100"><span width='100">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.same(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 18,
          value: `<span width='100">`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 12,
              attribClosingQuoteAt: 16,
              attribValue: "100",
              attribValueStartsAt: 13,
              attribValueEndsAt: 16,
              attribStart: 6,
              attribEnd: 17,
            },
          ],
        },
        {
          type: "tag",
          start: 18,
          end: 36,
          value: `<span width='100">`,
          tagNameStartsAt: 19,
          tagNameEndsAt: 23,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 24,
              attribNameEndsAt: 29,
              attribOpeningQuoteAt: 30,
              attribClosingQuoteAt: 34,
              attribValue: "100",
              attribValueStartsAt: 31,
              attribValueEndsAt: 34,
              attribStart: 24,
              attribEnd: 35,
            },
          ],
        },
      ],
      "08.02"
    );
    t.end();
  }
);

t.test(
  `08.03 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - false positives`,
  (t) => {
    const gathered = [];
    ct(`<span abc="Someone's" xyz="Someone's">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.same(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 38,
          value: `<span abc="Someone's" xyz="Someone's">`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "abc",
              attribNameRecognised: false,
              attribNameStartsAt: 6,
              attribNameEndsAt: 9,
              attribOpeningQuoteAt: 10,
              attribClosingQuoteAt: 20,
              attribValue: "Someone's",
              attribValueStartsAt: 11,
              attribValueEndsAt: 20,
              attribStart: 6,
              attribEnd: 21,
            },
            {
              attribName: "xyz",
              attribNameRecognised: false,
              attribNameStartsAt: 22,
              attribNameEndsAt: 25,
              attribOpeningQuoteAt: 26,
              attribClosingQuoteAt: 36,
              attribValue: "Someone's",
              attribValueStartsAt: 27,
              attribValueEndsAt: 36,
              attribStart: 22,
              attribEnd: 37,
            },
          ],
        },
      ],
      "08.03"
    );
    t.end();
  }
);

t.test(
  `08.04 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - mismatching quotes, the other way`,
  (t) => {
    const gathered = [];
    ct(`<span width="100'><span width="100'>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.same(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 18,
          value: `<span width="100'>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 12,
              attribClosingQuoteAt: 16,
              attribValue: "100",
              attribValueStartsAt: 13,
              attribValueEndsAt: 16,
              attribStart: 6,
              attribEnd: 17,
            },
          ],
        },
        {
          type: "tag",
          start: 18,
          end: 36,
          value: `<span width="100'>`,
          tagNameStartsAt: 19,
          tagNameEndsAt: 23,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 24,
              attribNameEndsAt: 29,
              attribOpeningQuoteAt: 30,
              attribClosingQuoteAt: 34,
              attribValue: "100",
              attribValueStartsAt: 31,
              attribValueEndsAt: 34,
              attribStart: 24,
              attribEnd: 35,
            },
          ],
        },
      ],
      "08.04"
    );
    t.end();
  }
);

t.test(
  `08.05 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quoteless attribute should not affect tag that follows`,
  (t) => {
    const gathered = [];
    ct(`<table width=100 border="0"><tr>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.same(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 28,
          value: '<table width=100 border="0">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "table",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 7,
              attribNameEndsAt: 12,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "100",
              attribValueStartsAt: 13,
              attribValueEndsAt: 16,
              attribStart: 7,
              attribEnd: 16,
            },
            {
              attribName: "border",
              attribNameRecognised: true,
              attribNameStartsAt: 17,
              attribNameEndsAt: 23,
              attribOpeningQuoteAt: 24,
              attribClosingQuoteAt: 26,
              attribValue: "0",
              attribValueStartsAt: 25,
              attribValueEndsAt: 26,
              attribStart: 17,
              attribEnd: 27,
            },
          ],
        },
        {
          type: "tag",
          start: 28,
          end: 32,
          value: "<tr>",
          tagNameStartsAt: 29,
          tagNameEndsAt: 31,
          tagName: "tr",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.05"
    );
    t.end();
  }
);

t.test(
  `08.06 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - mismatching quotes, opposite pairs`,
  (t) => {
    const gathered = [];
    ct(`<span width="100'><span width='100">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.same(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 18,
          value: `<span width="100'>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 12,
              attribClosingQuoteAt: 16,
              attribValue: "100",
              attribValueStartsAt: 13,
              attribValueEndsAt: 16,
              attribStart: 6,
              attribEnd: 17,
            },
          ],
        },
        {
          type: "tag",
          start: 18,
          end: 36,
          value: `<span width='100">`,
          tagNameStartsAt: 19,
          tagNameEndsAt: 23,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 24,
              attribNameEndsAt: 29,
              attribOpeningQuoteAt: 30,
              attribClosingQuoteAt: 34,
              attribValue: "100",
              attribValueStartsAt: 31,
              attribValueEndsAt: 34,
              attribStart: 24,
              attribEnd: 35,
            },
          ],
        },
      ],
      "08.06"
    );
    t.end();
  }
);

t.test(
  `08.07 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - opening quote repeated`,
  (t) => {
    const gathered = [];
    ct(
      `<table width="${doubleQuotes}100">
  zzz
</table>`,
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
          type: "tag",
          start: 0,
          end: 20,
          value: `<table width="${doubleQuotes}100">`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "table",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 7,
              attribNameEndsAt: 12,
              attribOpeningQuoteAt: 14,
              attribClosingQuoteAt: 18,
              attribValue: "100",
              attribValueStartsAt: 15,
              attribValueEndsAt: 18,
              attribStart: 7,
              attribEnd: 19,
            },
          ],
        },
        {
          type: "text",
          start: 20,
          end: 27,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 27,
          end: 35,
          value: "</table>",
          tagNameStartsAt: 29,
          tagNameEndsAt: 34,
          tagName: "table",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.07"
    );
    t.end();
  }
);

t.test(
  `08.08 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - opening repeated, whitespace`,
  (t) => {
    const gathered = [];
    ct(`<span width="${doubleQuotes} 100">`, {
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
          end: 20,
          value: `<span width="${doubleQuotes} 100">`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 13,
              attribClosingQuoteAt: 18,
              attribValue: " 100",
              attribValueStartsAt: 14,
              attribValueEndsAt: 18,
              attribStart: 6,
              attribEnd: 19,
            },
          ],
        },
      ],
      "08.08"
    );
    t.end();
  }
);

t.test(
  `08.09 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - opening repeated, two errors - repeated opening and mismatching closing`,
  (t) => {
    const gathered = [];
    ct(
      `<span width="${doubleQuotes} 100'>
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 20,
          value: '<span width="" 100\'>',
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 13,
              attribClosingQuoteAt: 18,
              attribValue: " 100",
              attribValueStartsAt: 14,
              attribValueEndsAt: 18,
              attribStart: 6,
              attribEnd: 19,
            },
          ],
        },
        {
          type: "text",
          start: 20,
          end: 27,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 27,
          end: 34,
          value: "</span>",
          tagNameStartsAt: 29,
          tagNameEndsAt: 33,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.09"
    );
    t.end();
  }
);

t.test(
  `08.10 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - opening repeated, single quote style`,
  (t) => {
    const gathered = [];
    ct(
      `<span width='${apostrophe} 100'>
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 20,
          value: "<span width='' 100'>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 13,
              attribClosingQuoteAt: 18,
              attribValue: " 100",
              attribValueStartsAt: 14,
              attribValueEndsAt: 18,
              attribStart: 6,
              attribEnd: 19,
            },
          ],
        },
        {
          type: "text",
          start: 20,
          end: 27,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 27,
          end: 34,
          value: "</span>",
          tagNameStartsAt: 29,
          tagNameEndsAt: 33,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.10"
    );
    t.end();
  }
);

t.test(
  `08.11 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - whitespace chunk instead of opening`,
  (t) => {
    const gathered = [];
    ct(
      `<span width=  100'>
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 19,
          value: "<span width=  100'>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 17,
              attribValue: "100",
              attribValueStartsAt: 14,
              attribValueEndsAt: 17,
              attribStart: 6,
              attribEnd: 18,
            },
          ],
        },
        {
          type: "text",
          start: 19,
          end: 26,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 26,
          end: 33,
          value: "</span>",
          tagNameStartsAt: 28,
          tagNameEndsAt: 32,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.11"
    );
    t.end();
  }
);

t.test(
  `08.12 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing completely, digits`,
  (t) => {
    const gathered = [];
    ct(
      `<span width=  100>
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 18,
          value: "<span width=  100>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "100",
              attribValueStartsAt: 14,
              attribValueEndsAt: 17,
              attribStart: 6,
              attribEnd: 17,
            },
          ],
        },
        {
          type: "text",
          start: 18,
          end: 25,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 25,
          end: 32,
          value: "</span>",
          tagNameStartsAt: 27,
          tagNameEndsAt: 31,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.12"
    );
    t.end();
  }
);

t.test(
  `08.13 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing completely, word`,
  (t) => {
    const gathered = [];
    ct(
      `<span width=  zzz>
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 18,
          value: "<span width=  zzz>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "zzz",
              attribValueStartsAt: 14,
              attribValueEndsAt: 17,
              attribStart: 6,
              attribEnd: 17,
            },
          ],
        },
        {
          type: "text",
          start: 18,
          end: 25,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 25,
          end: 32,
          value: "</span>",
          tagNameStartsAt: 27,
          tagNameEndsAt: 31,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.13"
    );
    t.end();
  }
);

t.test(
  `08.14 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing completely, word, slash`,
  (t) => {
    const gathered = [];
    ct(
      `<span width=  zzz height=yyy>
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 29,
          value: "<span width=  zzz height=yyy>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "zzz",
              attribValueStartsAt: 14,
              attribValueEndsAt: 17,
              attribStart: 6,
              attribEnd: 17,
            },
            {
              attribName: "height",
              attribNameRecognised: true,
              attribNameStartsAt: 18,
              attribNameEndsAt: 24,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "yyy",
              attribValueStartsAt: 25,
              attribValueEndsAt: 28,
              attribStart: 18,
              attribEnd: 28,
            },
          ],
        },
        {
          type: "text",
          start: 29,
          end: 36,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 36,
          end: 43,
          value: "</span>",
          tagNameStartsAt: 38,
          tagNameEndsAt: 42,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.14"
    );
    t.end();
  }
);

t.test(
  `08.15 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing completely, word, slash`,
  (t) => {
    const gathered = [];
    ct(
      `<span width=1 height=1>
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 23,
          value: "<span width=1 height=1>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "1",
              attribValueStartsAt: 12,
              attribValueEndsAt: 13,
              attribStart: 6,
              attribEnd: 13,
            },
            {
              attribName: "height",
              attribNameRecognised: true,
              attribNameStartsAt: 14,
              attribNameEndsAt: 20,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "1",
              attribValueStartsAt: 21,
              attribValueEndsAt: 22,
              attribStart: 14,
              attribEnd: 22,
            },
          ],
        },
        {
          type: "text",
          start: 23,
          end: 30,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 30,
          end: 37,
          value: "</span>",
          tagNameStartsAt: 32,
          tagNameEndsAt: 36,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.15"
    );
    t.end();
  }
);

t.test(
  `08.16 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing completely, word, slash`,
  (t) => {
    const gathered = [];
    ct(`<span width=zzz height=yyy></span>`, {
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
          end: 27,
          value: "<span width=zzz height=yyy>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "zzz",
              attribValueStartsAt: 12,
              attribValueEndsAt: 15,
              attribStart: 6,
              attribEnd: 15,
            },
            {
              attribName: "height",
              attribNameRecognised: true,
              attribNameStartsAt: 16,
              attribNameEndsAt: 22,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "yyy",
              attribValueStartsAt: 23,
              attribValueEndsAt: 26,
              attribStart: 16,
              attribEnd: 26,
            },
          ],
        },
        {
          type: "tag",
          start: 27,
          end: 34,
          value: "</span>",
          tagNameStartsAt: 29,
          tagNameEndsAt: 33,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.16"
    );
    t.end();
  }
);

t.test(
  `08.17 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - attr equals attr equals`,
  (t) => {
    const gathered = [];
    ct(
      `<span width=height=100">
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 24,
          value: '<span width=height=100">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: null,
              attribValueStartsAt: null,
              attribValueEndsAt: null,
              attribStart: 6,
              attribEnd: 12,
            },
            {
              attribName: "height",
              attribNameRecognised: true,
              attribNameStartsAt: 12,
              attribNameEndsAt: 18,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 22,
              attribValue: `100`,
              attribValueStartsAt: 19,
              attribValueEndsAt: 22,
              attribStart: 12,
              attribEnd: 23,
            },
          ],
        },
        {
          type: "text",
          start: 24,
          end: 31,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 31,
          end: 38,
          value: "</span>",
          tagNameStartsAt: 33,
          tagNameEndsAt: 37,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.17"
    );
    t.end();
  }
);

t.test(
  `08.18 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes present, quoteless attr inside`,
  (t) => {
    const gathered = [];
    ct(
      `<span width="height=100">
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 25,
          value: '<span width="height=100">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 12,
              attribClosingQuoteAt: null,
              attribValue: null,
              attribValueStartsAt: null,
              attribValueEndsAt: null,
              attribStart: 6,
              attribEnd: 13,
            },
            {
              attribName: "height",
              attribNameRecognised: true,
              attribNameStartsAt: 13,
              attribNameEndsAt: 19,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 23,
              attribValue: "100",
              attribValueStartsAt: 20,
              attribValueEndsAt: 23,
              attribStart: 13,
              attribEnd: 24,
            },
          ],
        },
        {
          type: "text",
          start: 25,
          end: 32,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 32,
          end: 39,
          value: "</span>",
        },
      ],
      "08.18"
    );
    t.end();
  }
);

t.test(
  `08.19 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - unrecognised text - equal - value`,
  (t) => {
    const gathered = [];
    ct(
      `<span width="tralala=100">
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 26,
          value: '<span width="tralala=100">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 12,
              attribClosingQuoteAt: 24,
              attribValue: "tralala=100",
              attribValueStartsAt: 13,
              attribValueEndsAt: 24,
              attribStart: 6,
              attribEnd: 25,
            },
          ],
        },
        {
          type: "text",
          start: 26,
          end: 33,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 33,
          end: 40,
          value: "</span>",
        },
      ],
      "08.19"
    );
    t.end();
  }
);

t.test(
  `08.20 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - pattern equal - quotes inside an attribute's value`,
  (t) => {
    const gathered = [];
    ct(
      `<span width="height="100">
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 26,
          value: '<span width="height="100">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 12,
              attribClosingQuoteAt: null,
              attribValue: null,
              attribValueStartsAt: null,
              attribValueEndsAt: null,
              attribStart: 6,
              attribEnd: 13,
            },
            {
              attribName: "height",
              attribNameRecognised: true,
              attribNameStartsAt: 13,
              attribNameEndsAt: 19,
              attribOpeningQuoteAt: 20,
              attribClosingQuoteAt: 24,
              attribValue: "100",
              attribValueStartsAt: 21,
              attribValueEndsAt: 24,
              attribStart: 13,
              attribEnd: 25,
            },
          ],
        },
        {
          type: "text",
          start: 26,
          end: 33,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 33,
          end: 40,
          value: "</span>",
          tagNameStartsAt: 35,
          tagNameEndsAt: 39,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.20"
    );
    t.end();
  }
);

t.test(
  `08.21 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - attr equals attr equals`,
  (t) => {
    const gathered = [];
    ct(
      `<span width=height=100>
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 23,
          value: "<span width=height=100>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: null,
              attribValueStartsAt: null,
              attribValueEndsAt: null,
              attribStart: 6,
              attribEnd: 12,
            },
            {
              attribName: "height",
              attribNameRecognised: true,
              attribNameStartsAt: 12,
              attribNameEndsAt: 18,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "100",
              attribValueStartsAt: 19,
              attribValueEndsAt: 22,
              attribStart: 12,
              attribEnd: 22,
            },
          ],
        },
        {
          type: "text",
          start: 23,
          end: 30,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 30,
          end: 37,
          value: "</span>",
        },
      ],
      "08.21"
    );
    t.end();
  }
);

t.test(
  `08.22 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - attr equals space attr equals`,
  (t) => {
    const gathered = [];
    ct(
      `<span width= height=100">
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 25,
          value: '<span width= height=100">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: null,
              attribValueStartsAt: null,
              attribValueEndsAt: null,
              attribStart: 6,
              attribEnd: 12,
            },
            {
              attribName: "height",
              attribNameRecognised: true,
              attribNameStartsAt: 13,
              attribNameEndsAt: 19,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 23,
              attribValue: "100",
              attribValueStartsAt: 20,
              attribValueEndsAt: 23,
              attribStart: 13,
              attribEnd: 24,
            },
          ],
        },
        {
          type: "text",
          start: 25,
          end: 32,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 32,
          end: 39,
          value: "</span>",
        },
      ],
      "08.22"
    );
    t.end();
  }
);

t.test(
  `08.23 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing, many attrs`,
  (t) => {
    const gathered = [];
    ct(`<table width=100 border=1 cellpadding=2 cellspacing=3>`, {
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
          end: 54,
          value: "<table width=100 border=1 cellpadding=2 cellspacing=3>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "table",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 7,
              attribNameEndsAt: 12,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "100",
              attribValueStartsAt: 13,
              attribValueEndsAt: 16,
              attribStart: 7,
              attribEnd: 16,
            },
            {
              attribName: "border",
              attribNameRecognised: true,
              attribNameStartsAt: 17,
              attribNameEndsAt: 23,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "1",
              attribValueStartsAt: 24,
              attribValueEndsAt: 25,
              attribStart: 17,
              attribEnd: 25,
            },
            {
              attribName: "cellpadding",
              attribNameRecognised: true,
              attribNameStartsAt: 26,
              attribNameEndsAt: 37,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "2",
              attribValueStartsAt: 38,
              attribValueEndsAt: 39,
              attribStart: 26,
              attribEnd: 39,
            },
            {
              attribName: "cellspacing",
              attribNameRecognised: true,
              attribNameStartsAt: 40,
              attribNameEndsAt: 51,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "3",
              attribValueStartsAt: 52,
              attribValueEndsAt: 53,
              attribStart: 40,
              attribEnd: 53,
            },
          ],
        },
      ],
      "08.23"
    );
    t.end();
  }
);

t.test(
  `08.24 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing, many attrs`,
  (t) => {
    const gathered = [];
    ct(`<table width=100 border=z cellpadding= cellspacing=0>`, {
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
          end: 53,
          value: "<table width=100 border=z cellpadding= cellspacing=0>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "table",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 7,
              attribNameEndsAt: 12,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "100",
              attribValueStartsAt: 13,
              attribValueEndsAt: 16,
              attribStart: 7,
              attribEnd: 16,
            },
            {
              attribName: "border",
              attribNameRecognised: true,
              attribNameStartsAt: 17,
              attribNameEndsAt: 23,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "z",
              attribValueStartsAt: 24,
              attribValueEndsAt: 25,
              attribStart: 17,
              attribEnd: 25,
            },
            {
              attribName: "cellpadding",
              attribNameRecognised: true,
              attribNameStartsAt: 26,
              attribNameEndsAt: 37,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: null,
              attribValueStartsAt: null,
              attribValueEndsAt: null,
              attribStart: 26,
              attribEnd: 38,
            },
            {
              attribName: "cellspacing",
              attribNameRecognised: true,
              attribNameStartsAt: 39,
              attribNameEndsAt: 50,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "0",
              attribValueStartsAt: 51,
              attribValueEndsAt: 52,
              attribStart: 39,
              attribEnd: 52,
            },
          ],
        },
      ],
      "08.24"
    );
    t.end();
  }
);

t.test(
  `08.25 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - only opening quotes present`,
  (t) => {
    const gathered = [];
    ct(`<table width='100 border='1 cellpadding='2 cellspacing='3>`, {
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
          end: 58,
          value: "<table width='100 border='1 cellpadding='2 cellspacing='3>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "table",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 7,
              attribNameEndsAt: 12,
              attribOpeningQuoteAt: 13,
              attribClosingQuoteAt: null,
              attribValue: "100",
              attribValueStartsAt: 14,
              attribValueEndsAt: 17,
              attribStart: 7,
              attribEnd: 17,
            },
            {
              attribName: "border",
              attribNameRecognised: true,
              attribNameStartsAt: 18,
              attribNameEndsAt: 24,
              attribOpeningQuoteAt: 25,
              attribClosingQuoteAt: null,
              attribValue: "1",
              attribValueStartsAt: 26,
              attribValueEndsAt: 27,
              attribStart: 18,
              attribEnd: 27,
            },
            {
              attribName: "cellpadding",
              attribNameRecognised: true,
              attribNameStartsAt: 28,
              attribNameEndsAt: 39,
              attribOpeningQuoteAt: 40,
              attribClosingQuoteAt: null,
              attribValue: "2",
              attribValueStartsAt: 41,
              attribValueEndsAt: 42,
              attribStart: 28,
              attribEnd: 42,
            },
            {
              attribName: "cellspacing",
              attribNameRecognised: true,
              attribNameStartsAt: 43,
              attribNameEndsAt: 54,
              attribOpeningQuoteAt: 55,
              attribClosingQuoteAt: null,
              attribValue: "3",
              attribValueStartsAt: 56,
              attribValueEndsAt: 57,
              attribStart: 43,
              attribEnd: 57,
            },
          ],
        },
      ],
      "08.25"
    );
    t.end();
  }
);

t.test(
  `08.26 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - only closing quotes present`,
  (t) => {
    const gathered = [];
    ct(`<table width=100' border=0' cellpadding=0' cellspacing=0'>`, {
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
          end: 58,
          value: "<table width=100' border=0' cellpadding=0' cellspacing=0'>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "table",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 7,
              attribNameEndsAt: 12,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 16,
              attribValue: "100",
              attribValueStartsAt: 13,
              attribValueEndsAt: 16,
              attribStart: 7,
              attribEnd: 17,
            },
            {
              attribName: "border",
              attribNameRecognised: true,
              attribNameStartsAt: 18,
              attribNameEndsAt: 24,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 26,
              attribValue: "0",
              attribValueStartsAt: 25,
              attribValueEndsAt: 26,
              attribStart: 18,
              attribEnd: 27,
            },
            {
              attribName: "cellpadding",
              attribNameRecognised: true,
              attribNameStartsAt: 28,
              attribNameEndsAt: 39,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 41,
              attribValue: "0",
              attribValueStartsAt: 40,
              attribValueEndsAt: 41,
              attribStart: 28,
              attribEnd: 42,
            },
            {
              attribName: "cellspacing",
              attribNameRecognised: true,
              attribNameStartsAt: 43,
              attribNameEndsAt: 54,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 56,
              attribValue: "0",
              attribValueStartsAt: 55,
              attribValueEndsAt: 56,
              attribStart: 43,
              attribEnd: 57,
            },
          ],
        },
      ],
      "08.26"
    );
    t.end();
  }
);

t.test(
  `08.27 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - sneaky inner/outer combo`,
  (t) => {
    const gathered = [];
    ct(`<table width="100 border='0 cellpadding=0' cellspacing=0">`, {
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
          end: 58,
          value: `<table width="100 border='0 cellpadding=0' cellspacing=0">`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 6,
          tagName: "table",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 7,
              attribNameEndsAt: 12,
              attribOpeningQuoteAt: 13,
              attribClosingQuoteAt: null,
              attribValue: "100",
              attribValueStartsAt: 14,
              attribValueEndsAt: 17,
              attribStart: 7,
              attribEnd: 17,
            },
            {
              attribName: "border",
              attribNameRecognised: true,
              attribNameStartsAt: 18,
              attribNameEndsAt: 24,
              attribOpeningQuoteAt: 25,
              attribClosingQuoteAt: null,
              attribValue: "0",
              attribValueStartsAt: 26,
              attribValueEndsAt: 27,
              attribStart: 18,
              attribEnd: 27,
            },
            {
              attribName: "cellpadding",
              attribNameRecognised: true,
              attribNameStartsAt: 28,
              attribNameEndsAt: 39,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 41,
              attribValue: "0",
              attribValueStartsAt: 40,
              attribValueEndsAt: 41,
              attribStart: 28,
              attribEnd: 42,
            },
            {
              attribName: "cellspacing",
              attribNameRecognised: true,
              attribNameStartsAt: 43,
              attribNameEndsAt: 54,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 56,
              attribValue: "0",
              attribValueStartsAt: 55,
              attribValueEndsAt: 56,
              attribStart: 43,
              attribEnd: 57,
            },
          ],
        },
      ],
      "08.27"
    );
    t.end();
  }
);

t.test(
  `08.28 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - opening consists of two types`,
  (t) => {
    const gathered = [];
    ct(
      `<span width='"100">
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 19,
          value: '<span width=\'"100">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 13,
              attribClosingQuoteAt: 17,
              attribValue: "100",
              attribValueStartsAt: 14,
              attribValueEndsAt: 17,
              attribStart: 6,
              attribEnd: 18,
            },
          ],
        },
        {
          type: "text",
          start: 19,
          end: 26,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 26,
          end: 33,
          value: "</span>",
        },
      ],
      "08.28"
    );
    t.end();
  }
);

t.test(
  `08.29 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - two layers of quotes`,
  (t) => {
    const gathered = [];
    ct(
      `<span width="'100'">
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 20,
          value: `<span width="'100'">`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 12,
              attribClosingQuoteAt: 18,
              attribValue: `'100'`,
              attribValueStartsAt: 13,
              attribValueEndsAt: 18,
              attribStart: 6,
              attribEnd: 19,
            },
          ],
        },
        {
          type: "text",
          start: 20,
          end: 27,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 27,
          end: 34,
          value: "</span>",
          tagNameStartsAt: 29,
          tagNameEndsAt: 33,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.29"
    );
    t.end();
  }
);

t.test(
  `08.30 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - rogue character`,
  (t) => {
    const gathered = [];
    ct(
      `<span width=."100">
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 19,
          value: '<span width=."100">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 13,
              attribClosingQuoteAt: 17,
              attribValue: "100",
              attribValueStartsAt: 14,
              attribValueEndsAt: 17,
              attribStart: 6,
              attribEnd: 18,
            },
          ],
        },
        {
          type: "text",
          start: 19,
          end: 26,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 26,
          end: 33,
          value: "</span>",
          tagNameStartsAt: 28,
          tagNameEndsAt: 32,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.30"
    );
    t.end();
  }
);

t.test(
  `08.31 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - many dots`,
  (t) => {
    const gathered = [];
    ct(
      `<span width....=....."100">
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 27,
          value: '<span width....=....."100">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 21,
              attribClosingQuoteAt: 25,
              attribValue: "100",
              attribValueStartsAt: 22,
              attribValueEndsAt: 25,
              attribStart: 6,
              attribEnd: 26,
            },
          ],
        },
        {
          type: "text",
          start: 27,
          end: 34,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 34,
          end: 41,
          value: "</span>",
        },
      ],
      "08.31"
    );
    t.end();
  }
);

t.test(
  `08.32 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - all spaced`,
  (t) => {
    const gathered = [];
    ct(
      `< span width = " 100 " >
  zzz
< / span >`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 24,
          value: '< span width = " 100 " >',
          tagNameStartsAt: 2,
          tagNameEndsAt: 6,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 7,
              attribNameEndsAt: 12,
              attribOpeningQuoteAt: 15,
              attribClosingQuoteAt: 21,
              attribValue: " 100 ",
              attribValueStartsAt: 16,
              attribValueEndsAt: 21,
              attribStart: 7,
              attribEnd: 22,
            },
          ],
        },
        {
          type: "text",
          start: 24,
          end: 31,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 31,
          end: 41,
          value: "< / span >",
          tagNameStartsAt: 35,
          tagNameEndsAt: 39,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.32"
    );
    t.end();
  }
);

t.test(
  `08.33 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing completely, word, slash`,
  (t) => {
    const gathered = [];
    ct(
      `<span width=  zzz/>
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 19,
          value: "<span width=  zzz/>",
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: null,
              attribValue: "zzz",
              attribValueStartsAt: 14,
              attribValueEndsAt: 17,
              attribStart: 6,
              attribEnd: 17,
            },
          ],
        },
        {
          type: "text",
          start: 19,
          end: 26,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 26,
          end: 33,
          value: "</span>",
          tagNameStartsAt: 28,
          tagNameEndsAt: 32,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "08.33"
    );
    t.end();
  }
);

t.test(
  `08.34 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - quotes missing, one attr`,
  (t) => {
    const gathered = [];
    ct(
      `<span width=100">
  zzz
</span>`,
      {
        tagCb: (obj) => {
          gathered.push(obj);
        },
      }
    );
    t.match(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 17,
          value: '<span width=100">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: null,
              attribClosingQuoteAt: 15,
              attribValue: "100",
              attribValueStartsAt: 12,
              attribValueEndsAt: 15,
              attribStart: 6,
              attribEnd: 16,
            },
          ],
        },
        {
          type: "text",
          start: 17,
          end: 24,
          value: "\n  zzz\n",
        },
        {
          type: "tag",
          start: 24,
          end: 31,
          value: "</span>",
        },
      ],
      "08.34"
    );
    t.end();
  }
);

t.test(
  `08.35 - ${`\u001b[${33}m${`broken opening`}\u001b[${39}m`} - mismatching quotes and equal missing`,
  (t) => {
    const gathered = [];
    ct(`<a class"c' id"e'>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.same(
      gathered,
      [
        {
          type: "tag",
          start: 0,
          end: 18,
          value: `<a class"c' id"e'>`,
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "class",
              attribNameRecognised: true,
              attribNameStartsAt: 3,
              attribNameEndsAt: 8,
              attribOpeningQuoteAt: 8,
              attribClosingQuoteAt: 10,
              attribValue: "c",
              attribValueStartsAt: 9,
              attribValueEndsAt: 10,
              attribStart: 3,
              attribEnd: 11,
            },
            {
              attribName: "id",
              attribNameRecognised: true,
              attribNameStartsAt: 12,
              attribNameEndsAt: 14,
              attribOpeningQuoteAt: 14,
              attribClosingQuoteAt: 16,
              attribValue: "e",
              attribValueStartsAt: 15,
              attribValueEndsAt: 16,
              attribStart: 12,
              attribEnd: 17,
            },
          ],
        },
      ],
      "08.35"
    );
    t.end();
  }
);

// 09. broken closing
// -----------------------------------------------------------------------------

t.test(
  `09.01 - ${`\u001b[${33}m${`broken closing`}\u001b[${39}m`} - missing closing quote, one attr`,
  (t) => {
    const gathered = [];
    ct(`<span width="100>zzz</span>`, {
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
          end: 17,
          value: '<span width="100>',
          tagNameStartsAt: 1,
          tagNameEndsAt: 5,
          tagName: "span",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "width",
              attribNameRecognised: true,
              attribNameStartsAt: 6,
              attribNameEndsAt: 11,
              attribOpeningQuoteAt: 12,
              attribClosingQuoteAt: null,
              attribValue: "100",
              attribValueStartsAt: 13,
              attribValueEndsAt: 16,
              attribStart: 6,
              attribEnd: 16,
            },
          ],
        },
        {
          type: "text",
          start: 17,
          end: 20,
          value: "zzz",
        },
        {
          type: "tag",
          start: 20,
          end: 27,
          value: "</span>",
          tagNameStartsAt: 22,
          tagNameEndsAt: 26,
          tagName: "span",
          recognised: true,
          closing: true,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [],
        },
      ],
      "09.01"
    );
    t.end();
  }
);

t.test(
  `09.02 - ${`\u001b[${33}m${`broken closing`}\u001b[${39}m`} - missing closing quote, two attrs`,
  (t) => {
    const gathered = [];
    ct(`<a href="xyz border="0">`, {
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
          end: 24,
          value: '<a href="xyz border="0">',
          tagNameStartsAt: 1,
          tagNameEndsAt: 2,
          tagName: "a",
          recognised: true,
          closing: false,
          void: false,
          pureHTML: true,
          kind: null,
          attribs: [
            {
              attribName: "href",
              attribNameRecognised: true,
              attribNameStartsAt: 3,
              attribNameEndsAt: 7,
              attribOpeningQuoteAt: 8,
              attribClosingQuoteAt: null,
              attribValue: "xyz",
              attribValueStartsAt: 9,
              attribValueEndsAt: 12,
              attribStart: 3,
              attribEnd: 12,
            },
            {
              attribName: "border",
              attribNameRecognised: true,
              attribNameStartsAt: 13,
              attribNameEndsAt: 19,
              attribOpeningQuoteAt: 20,
              attribClosingQuoteAt: 22,
              attribValue: "0",
              attribValueStartsAt: 21,
              attribValueEndsAt: 22,
              attribStart: 13,
              attribEnd: 23,
            },
          ],
        },
      ],
      "09.02"
    );
    t.end();
  }
);

// TODO
// -----------------------------------------------------------------------------

// MINOR ERRORS:

// <abc de =">"> text
// <abc de =">"> text<div class="z">
// <abc de =">'> text
// <abc de =">'> text<div class="z">
// <abc de =">' fg = 'hi"> text
// <abc de =">' fg = 'hi"> text <div class="z">

// INTERVENTION NEEDED:

// <abc de="> "a" > "z"
// <abc de="> a "text" b <div class="z">
// <abc de=" \n<div class="z">
// <abc de=" text<div class="z">
// <abc de="> < fgh>
// <abc de="> <fgh kl = "mn">

// <abc de=> text <def>
// <abc de=> fg="hi" <def>
// <abc de=> fg=hi" <def>

// <abc de=<def>
// <abc de=''<def>
// <abc de=""<def>
// <abc de='<def>
// <abc de="<def>
//
// <abc de= <def>
// <abc de='' <def>
// <abc de="" <def>
// <abc de=' <def>
// <abc de=" <def>
//
// <abc de=' fg="hi'<jkl>

// CRAZY:

// <abc de=">"a"
