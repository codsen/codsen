import tap from "tap";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm";

// 01. empty bracket pair
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`empty bracket pair`}\u001b[${39}m`} - empty`,
  (t) => {
    const gathered = [];
    ct(`<>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          type: "tag",
          tagNameStartsAt: null,
          tagNameEndsAt: null,
          tagName: null,
          start: 0,
          end: 2,
        },
      ],
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`empty bracket pair`}\u001b[${39}m`} - empty`,
  (t) => {
    const gathered = [];
    ct(`<>a`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          type: "tag",
          tagNameStartsAt: null,
          tagNameEndsAt: null,
          tagName: null,
          start: 0,
          end: 2,
        },
        {
          type: "text",
          start: 2,
          end: 3,
        },
      ],
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`empty bracket pair`}\u001b[${39}m`} - space`,
  (t) => {
    const gathered = [];
    ct(`< >`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          type: "tag",
          tagNameStartsAt: null,
          tagNameEndsAt: null,
          tagName: null,
          start: 0,
          end: 3,
        },
      ],
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`empty bracket pair`}\u001b[${39}m`} - space`,
  (t) => {
    const gathered = [];
    ct(`< >< >< >`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          type: "tag",
          tagNameStartsAt: null,
          tagNameEndsAt: null,
          tagName: null,
          start: 0,
          end: 3,
        },
        {
          type: "tag",
          tagNameStartsAt: null,
          tagNameEndsAt: null,
          tagName: null,
          start: 3,
          end: 6,
        },
        {
          type: "tag",
          tagNameStartsAt: null,
          tagNameEndsAt: null,
          tagName: null,
          start: 6,
          end: 9,
        },
      ],
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`empty bracket pair`}\u001b[${39}m`} - space`,
  (t) => {
    const gathered = [];
    ct(` < > < > < > `, {
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
          end: 1,
        },
        {
          type: "tag",
          tagNameStartsAt: null,
          tagNameEndsAt: null,
          tagName: null,
          start: 1,
          end: 4,
        },
        {
          type: "text",
          start: 4,
          end: 5,
        },
        {
          type: "tag",
          tagNameStartsAt: null,
          tagNameEndsAt: null,
          tagName: null,
          start: 5,
          end: 8,
        },
        {
          type: "text",
          start: 8,
          end: 9,
        },
        {
          type: "tag",
          tagNameStartsAt: null,
          tagNameEndsAt: null,
          tagName: null,
          start: 9,
          end: 12,
        },
        {
          type: "text",
          start: 12,
          end: 13,
        },
      ],
      "05"
    );
    t.end();
  }
);

// 02. comment and comment-like tags
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${36}m${`comment-like`}\u001b[${39}m`} - one dash`,
  (t) => {
    const gathered = [];
    ct(`<->`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          type: "text",
          tagNameStartsAt: null,
          tagNameEndsAt: null,
          tagName: null,
          start: 0,
          end: 3,
        },
      ],
      "06.01"
    );
    t.is(gathered.length, 1, "06.02");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${36}m${`comment-like`}\u001b[${39}m`} - one dash`,
  (t) => {
    const gathered = [];
    ct(`<-->`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          type: "text",
          tagNameStartsAt: null,
          tagNameEndsAt: null,
          tagName: null,
          start: 0,
          end: 4,
        },
      ],
      "07.01"
    );
    t.is(gathered.length, 1, "07.02");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`comment-like`}\u001b[${39}m`} - one dash`,
  (t) => {
    const gathered = [];
    ct(`<----->`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.match(
      gathered,
      [
        {
          type: "text",
          tagNameStartsAt: null,
          tagNameEndsAt: null,
          tagName: null,
          start: 0,
          end: 7,
        },
      ],
      "08"
    );
    t.end();
  }
);

// issues with attributes
// -----------------------------------------------------------------------------

tap.test(
  `09 - ${`\u001b[${36}m${`comment-like`}\u001b[${39}m`} - one dash`,
  (t) => {
    const gathered = [];
    ct(`<img alt="/>`, {
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
          end: 12,
          value: '<img alt="/>',
          tagNameStartsAt: 1,
          tagNameEndsAt: 4,
          tagName: "img",
          recognised: true,
          closing: false,
          void: true,
          pureHTML: true,
          kind: "inline",
          attribs: [
            {
              attribName: "alt",
              attribNameRecognised: true,
              attribNameStartsAt: 5,
              attribNameEndsAt: 8,
              attribOpeningQuoteAt: 9,
              attribClosingQuoteAt: null,
              attribValueRaw: null,
              attribValue: [],
              attribValueStartsAt: null,
              attribValueEndsAt: null,
              attribStarts: 5,
              attribEnds: 10,
              attribLeft: 3,
            },
          ],
        },
      ],
      "09"
    );
    t.end();
  }
);
