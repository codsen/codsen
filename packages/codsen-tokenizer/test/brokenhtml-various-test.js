const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");
const BACKSLASH = "\u005C";

// 01. rule tag-space-after-opening-bracket
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${33}m${`tag-space-after-opening-bracket`}\u001b[${39}m`} - 1`,
  t => {
    const gathered = [];
    ct(`a < b class="">`, obj => {
      gathered.push(obj);
    });
    t.match(
      gathered,
      [
        {
          type: "text",
          start: 0,
          end: 2
        },
        {
          type: "html",
          start: 2,
          end: 15
        }
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
  t => {
    const gathered = [];
    ct(`<br${BACKSLASH}>`, obj => {
      gathered.push(obj);
    });
    t.match(
      gathered,
      [
        {
          type: "html",
          start: 0,
          end: 5
        }
      ],
      "02.01"
    );
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - 1`,
  t => {
    const gathered = [];
    ct(`<${BACKSLASH}br${BACKSLASH}>`, obj => {
      gathered.push(obj);
    });
    t.match(
      gathered,
      [
        {
          type: "html",
          start: 0,
          end: 6
        }
      ],
      "02.02"
    );
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${33}m${`tag-closing-left-slash`}\u001b[${39}m`} - 1`,
  t => {
    const gathered = [];
    ct(`< ${BACKSLASH} br ${BACKSLASH} >`, obj => {
      gathered.push(obj);
    });
    t.same(
      gathered,
      [
        {
          tagNameStartAt: 4,
          tagNameEndAt: 6,
          tagName: "br",
          recognised: true,
          closing: false,
          void: true,
          pureHTML: true,
          esp: [],
          type: "html",
          start: 0,
          end: 10,
          tail: null,
          kind: null,
          attribs: []
        }
      ],
      "02.03"
    );
    t.end();
  }
);
