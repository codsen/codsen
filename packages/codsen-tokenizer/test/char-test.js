import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// 01. character-based tokens
// -----------------------------------------------------------------------------

tap.test(
  `01.01 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - default lookahead`,
  (t) => {
    const gathered = [];
    ct("<a>z1", {
      charCb: (obj) => {
        gathered.push(obj);
      },
    });

    t.same(
      gathered,
      [
        {
          chr: "<",
          i: 0,
          type: "tag",
        },
        {
          chr: "a",
          i: 1,
          type: "tag",
        },
        {
          chr: ">",
          i: 2,
          type: "tag",
        },
        {
          chr: "z",
          i: 3,
          type: "text",
        },
        {
          chr: "1",
          i: 4,
          type: "text",
        },
      ],
      "01.01"
    );
    t.end();
  }
);

tap.test(
  `01.02 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - hardcoded default lookahead`,
  (t) => {
    const gathered = [];
    ct("<a>z1", {
      charCb: (obj, next) => {
        gathered.push({ ...obj, next });
      },
      charCbLookahead: 0,
    });

    t.same(
      gathered,
      [
        {
          chr: "<",
          i: 0,
          type: "tag",
          next: [],
        },
        {
          chr: "a",
          i: 1,
          type: "tag",
          next: [],
        },
        {
          chr: ">",
          i: 2,
          type: "tag",
          next: [],
        },
        {
          chr: "z",
          i: 3,
          type: "text",
          next: [],
        },
        {
          chr: "1",
          i: 4,
          type: "text",
          next: [],
        },
      ],
      "01.02"
    );
    t.end();
  }
);

tap.test(
  `01.03 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 1`,
  (t) => {
    const gathered = [];
    ct("<a>z1", {
      charCb: (obj, next) => {
        gathered.push({ ...obj, next });
      },
      charCbLookahead: 1,
    });

    t.same(
      gathered,
      [
        {
          chr: "<",
          i: 0,
          type: "tag",
          next: [
            {
              chr: "a",
              i: 1,
              type: "tag",
            },
          ],
        },
        {
          chr: "a",
          i: 1,
          type: "tag",
          next: [
            {
              chr: ">",
              i: 2,
              type: "tag",
            },
          ],
        },
        {
          chr: ">",
          i: 2,
          type: "tag",
          next: [
            {
              chr: "z",
              i: 3,
              type: "text",
            },
          ],
        },
        {
          chr: "z",
          i: 3,
          type: "text",
          next: [
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "1",
          i: 4,
          type: "text",
          next: [],
        },
      ],
      "01.03"
    );
    t.end();
  }
);

tap.test(
  `01.04 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 2`,
  (t) => {
    const gathered = [];
    ct("<a>z1", {
      charCb: (obj, next) => {
        gathered.push({ ...obj, next });
      },
      charCbLookahead: 2,
    });

    t.same(
      gathered,
      [
        {
          chr: "<",
          i: 0,
          type: "tag",
          next: [
            {
              chr: "a",
              i: 1,
              type: "tag",
            },
            {
              chr: ">",
              i: 2,
              type: "tag",
            },
          ],
        },
        {
          chr: "a",
          i: 1,
          type: "tag",
          next: [
            {
              chr: ">",
              i: 2,
              type: "tag",
            },
            {
              chr: "z",
              i: 3,
              type: "text",
            },
          ],
        },
        {
          chr: ">",
          i: 2,
          type: "tag",
          next: [
            {
              chr: "z",
              i: 3,
              type: "text",
            },
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "z",
          i: 3,
          type: "text",
          next: [
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "1",
          i: 4,
          type: "text",
          next: [],
        },
      ],
      "01.04"
    );
    t.end();
  }
);

tap.test(
  `01.05 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 3`,
  (t) => {
    const gathered = [];
    ct("<a>z1", {
      charCb: (obj, next) => {
        gathered.push({ ...obj, next });
      },
      charCbLookahead: 3,
    });

    t.same(
      gathered,
      [
        {
          chr: "<",
          i: 0,
          type: "tag",
          next: [
            {
              chr: "a",
              i: 1,
              type: "tag",
            },
            {
              chr: ">",
              i: 2,
              type: "tag",
            },
            {
              chr: "z",
              i: 3,
              type: "text",
            },
          ],
        },
        {
          chr: "a",
          i: 1,
          type: "tag",
          next: [
            {
              chr: ">",
              i: 2,
              type: "tag",
            },
            {
              chr: "z",
              i: 3,
              type: "text",
            },
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: ">",
          i: 2,
          type: "tag",
          next: [
            {
              chr: "z",
              i: 3,
              type: "text",
            },
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "z",
          i: 3,
          type: "text",
          next: [
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "1",
          i: 4,
          type: "text",
          next: [],
        },
      ],
      "01.05"
    );
    t.end();
  }
);

tap.test(
  `01.06 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 4`,
  (t) => {
    const gathered = [];
    ct("<a>z1", {
      charCb: (obj, next) => {
        gathered.push({ ...obj, next });
      },
      charCbLookahead: 4,
    });

    t.same(
      gathered,
      [
        {
          chr: "<",
          i: 0,
          type: "tag",
          next: [
            {
              chr: "a",
              i: 1,
              type: "tag",
            },
            {
              chr: ">",
              i: 2,
              type: "tag",
            },
            {
              chr: "z",
              i: 3,
              type: "text",
            },
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "a",
          i: 1,
          type: "tag",
          next: [
            {
              chr: ">",
              i: 2,
              type: "tag",
            },
            {
              chr: "z",
              i: 3,
              type: "text",
            },
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: ">",
          i: 2,
          type: "tag",
          next: [
            {
              chr: "z",
              i: 3,
              type: "text",
            },
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "z",
          i: 3,
          type: "text",
          next: [
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "1",
          i: 4,
          type: "text",
          next: [],
        },
      ],
      "01.06"
    );
    t.end();
  }
);

tap.test(
  `01.07 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 5`,
  (t) => {
    const gathered = [];
    ct("<a>z1", {
      charCb: (obj, next) => {
        gathered.push({ ...obj, next });
      },
      charCbLookahead: 5,
    });

    t.same(
      gathered,
      [
        {
          chr: "<",
          i: 0,
          type: "tag",
          next: [
            {
              chr: "a",
              i: 1,
              type: "tag",
            },
            {
              chr: ">",
              i: 2,
              type: "tag",
            },
            {
              chr: "z",
              i: 3,
              type: "text",
            },
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "a",
          i: 1,
          type: "tag",
          next: [
            {
              chr: ">",
              i: 2,
              type: "tag",
            },
            {
              chr: "z",
              i: 3,
              type: "text",
            },
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: ">",
          i: 2,
          type: "tag",
          next: [
            {
              chr: "z",
              i: 3,
              type: "text",
            },
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "z",
          i: 3,
          type: "text",
          next: [
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "1",
          i: 4,
          type: "text",
          next: [],
        },
      ],
      "01.07"
    );
    t.end();
  }
);

tap.test(
  `01.08 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 99`,
  (t) => {
    const gathered = [];
    ct("<a>z1", {
      charCb: (obj, next) => {
        gathered.push({ ...obj, next });
      },
      charCbLookahead: 99,
    });

    t.same(
      gathered,
      [
        {
          chr: "<",
          i: 0,
          type: "tag",
          next: [
            {
              chr: "a",
              i: 1,
              type: "tag",
            },
            {
              chr: ">",
              i: 2,
              type: "tag",
            },
            {
              chr: "z",
              i: 3,
              type: "text",
            },
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "a",
          i: 1,
          type: "tag",
          next: [
            {
              chr: ">",
              i: 2,
              type: "tag",
            },
            {
              chr: "z",
              i: 3,
              type: "text",
            },
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: ">",
          i: 2,
          type: "tag",
          next: [
            {
              chr: "z",
              i: 3,
              type: "text",
            },
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "z",
          i: 3,
          type: "text",
          next: [
            {
              chr: "1",
              i: 4,
              type: "text",
            },
          ],
        },
        {
          chr: "1",
          i: 4,
          type: "text",
          next: [],
        },
      ],
      "01.08"
    );
    t.end();
  }
);

tap.test(
  `01.09 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 99 - doesn't push next`,
  (t) => {
    const gathered = [];
    ct("<a>z1", {
      charCb: (obj) => {
        gathered.push(obj);
      },
      charCbLookahead: 99,
    });
    gathered.forEach((obj) => {
      // eslint-disable-next-line no-prototype-builtins
      t.false(obj.hasOwnProperty("next"));
    });
    t.same(
      gathered,
      [
        {
          chr: "<",
          i: 0,
          type: "tag",
        },
        {
          chr: "a",
          i: 1,
          type: "tag",
        },
        {
          chr: ">",
          i: 2,
          type: "tag",
        },
        {
          chr: "z",
          i: 3,
          type: "text",
        },
        {
          chr: "1",
          i: 4,
          type: "text",
        },
      ],
      "01.09"
    );
    t.end();
  }
);
