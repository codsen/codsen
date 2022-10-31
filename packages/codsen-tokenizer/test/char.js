import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// 01. character-based tokens
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - default lookahead`, () => {
  let gathered = [];
  ct("<a>z1", {
    charCb: (obj) => {
      gathered.push(obj);
    },
  });

  equal(
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
});

test(`02 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - hardcoded default lookahead`, () => {
  let gathered = [];
  ct("<a>z1", {
    charCb: (obj, next) => {
      gathered.push({ ...obj, next });
    },
    charCbLookahead: 0,
  });

  equal(
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
    "02.01"
  );
});

test(`03 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 1`, () => {
  let gathered = [];
  ct("<a>z1", {
    charCb: (obj, next) => {
      gathered.push({ ...obj, next });
    },
    charCbLookahead: 1,
  });

  equal(
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
    "03.01"
  );
});

test(`04 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 2`, () => {
  let gathered = [];
  ct("<a>z1", {
    charCb: (obj, next) => {
      gathered.push({ ...obj, next });
    },
    charCbLookahead: 2,
  });

  equal(
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
    "04.01"
  );
});

test(`05 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 3`, () => {
  let gathered = [];
  ct("<a>z1", {
    charCb: (obj, next) => {
      gathered.push({ ...obj, next });
    },
    charCbLookahead: 3,
  });

  equal(
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
    "05.01"
  );
});

test(`06 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 4`, () => {
  let gathered = [];
  ct("<a>z1", {
    charCb: (obj, next) => {
      gathered.push({ ...obj, next });
    },
    charCbLookahead: 4,
  });

  equal(
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
    "06.01"
  );
});

test(`07 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 5`, () => {
  let gathered = [];
  ct("<a>z1", {
    charCb: (obj, next) => {
      gathered.push({ ...obj, next });
    },
    charCbLookahead: 5,
  });

  equal(
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
    "07.01"
  );
});

test(`08 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 99`, () => {
  let gathered = [];
  ct("<a>z1", {
    charCb: (obj, next) => {
      gathered.push({ ...obj, next });
    },
    charCbLookahead: 99,
  });

  equal(
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
    "08.01"
  );
});

test(`09 - ${`\u001b[${33}m${`charCb`}\u001b[${39}m`} - lookahead = 99 - doesn't push next`, () => {
  let gathered = [];
  ct("<a>z1", {
    charCb: (obj) => {
      gathered.push(obj);
    },
    charCbLookahead: 99,
  });
  gathered.forEach((obj) => {
    // eslint-disable-next-line no-prototype-builtins
    not.ok(obj.hasOwnProperty("next"));
  });
  equal(
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
    "09.01"
  );
});

test.run();
