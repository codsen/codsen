import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// 01. empty bracket pair
// -----------------------------------------------------------------------------

tap.test(
  `01.01 - ${`\u001b[${36}m${`empty bracket pair`}\u001b[${39}m`} - empty`,
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
      "01.01"
    );
    t.end();
  }
);

tap.test(
  `01.02 - ${`\u001b[${36}m${`empty bracket pair`}\u001b[${39}m`} - empty`,
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
      "01.02"
    );
    t.end();
  }
);

tap.test(
  `01.03 - ${`\u001b[${36}m${`empty bracket pair`}\u001b[${39}m`} - space`,
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
      "01.03"
    );
    t.end();
  }
);

tap.test(
  `01.04 - ${`\u001b[${36}m${`empty bracket pair`}\u001b[${39}m`} - space`,
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
      "01.04"
    );
    t.end();
  }
);

tap.test(
  `01.05 - ${`\u001b[${36}m${`empty bracket pair`}\u001b[${39}m`} - space`,
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
      "01.05"
    );
    t.end();
  }
);

// 02. comment and comment-like tags
// -----------------------------------------------------------------------------

tap.test(
  `02.01 - ${`\u001b[${36}m${`comment-like`}\u001b[${39}m`} - one dash`,
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
      "02.01.01"
    );
    t.is(gathered.length, 1, "02.01.02");
    t.end();
  }
);

tap.test(
  `02.02 - ${`\u001b[${36}m${`comment-like`}\u001b[${39}m`} - one dash`,
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
      "02.02.01"
    );
    t.is(gathered.length, 1, "02.02.02");
    t.end();
  }
);

tap.test(
  `02.03 - ${`\u001b[${36}m${`comment-like`}\u001b[${39}m`} - one dash`,
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
      "02.03"
    );
    t.end();
  }
);
