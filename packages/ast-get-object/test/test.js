import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { getObj } from "../dist/ast-get-object.esm.js";

// ==============================
// GET
// ==============================

test("01 - get - one plain object as result", () => {
  equal(
    getObj(
      [
        {
          tag: "meta",
          content: "UTF-8",
          something: "else",
        },
        {
          tag: "title",
          attrs: "Text of the title",
        },
      ],
      {
        tag: "meta",
      }
    ),
    [
      {
        tag: "meta",
        content: "UTF-8",
        something: "else",
      },
    ],
    "01.01"
  );
});

test("02 - get - two plain object as result", () => {
  equal(
    getObj(
      [
        {
          tag: "meta",
          content: "UTF-8",
        },
        {
          tag: "meta",
          content: "whatnot",
          attributes: "as well",
        },
        {
          tag: "style",
          content: "",
        },
      ],
      { tag: "meta" }
    ),
    [
      {
        tag: "meta",
        content: "UTF-8",
      },
      {
        tag: "meta",
        content: "whatnot",
        attributes: "as well",
      },
    ],
    "02.01"
  );
});

test("03 - get - topmost level container is object", () => {
  equal(
    getObj(
      {
        key1: {
          tag: "meta",
          content: "UTF-8",
          something: "else",
        },
        key2: {
          tag: "title",
          attrs: "Text of the title",
        },
        key3: [
          {
            x: "x",
            y: "y",
          },
          {
            tag: "meta",
            content: "ISO-123",
            something: "as well",
          },
        ],
      },
      {
        tag: "meta",
      }
    ),
    [
      {
        tag: "meta",
        content: "UTF-8",
        something: "else",
      },
      {
        tag: "meta",
        content: "ISO-123",
        something: "as well",
      },
    ],
    "03.01"
  );
});

test("04 - get - search value is object", () => {
  equal(
    getObj(
      [
        {
          tag: { key: "meta" },
          content: "UTF-8",
          something: "else",
        },
        {
          tag: "title",
          attrs: "Text of the title",
        },
      ],
      {
        tag: { key: "meta" },
      }
    ),
    [
      {
        tag: { key: "meta" },
        content: "UTF-8",
        something: "else",
      },
    ],
    "04.01"
  );
});

test("05 - get - search value is array", () => {
  equal(
    getObj(
      [
        {
          tag: ["two", "values"],
          content: "UTF-8",
          something: "else",
        },
        {
          tag: "title",
          attrs: "Text of the title",
        },
      ],
      {
        tag: ["two", "values"],
      }
    ),
    [
      {
        tag: ["two", "values"],
        content: "UTF-8",
        something: "else",
      },
    ],
    "05.01"
  );
});

test("06 - get - search value is nested array", () => {
  equal(
    getObj(
      [
        {
          tag: [["two", "values"]],
          content: "UTF-8",
          something: "else",
        },
        {
          tag: [["two"]],
          attrs: "Text of the title",
        },
      ],
      {
        tag: [["two", "values"]],
      }
    ),
    [
      {
        tag: [["two", "values"]],
        content: "UTF-8",
        something: "else",
      },
    ],
    "06.01"
  );
});

test("07 - get - search value is nested object", () => {
  equal(
    getObj(
      [
        {
          tag: [
            {
              nested: "object",
              with: "multiple values",
            },
          ],
          content: "UTF-8",
          something: "else",
        },
        {
          tag: [
            {
              nested: "object",
            },
          ],
          content: "UTF-8",
          something: "else",
        },
      ],
      {
        tag: [
          {
            nested: "object",
            with: "multiple values",
          },
        ],
      }
    ),
    [
      {
        tag: [
          {
            nested: "object",
            with: "multiple values",
          },
        ],
        content: "UTF-8",
        something: "else",
      },
    ],
    "07.01"
  );
});

test("08 - get - numerous everything", () => {
  equal(
    getObj(
      [
        [
          [
            [
              {
                b: "b",
                e: "e",
              },
              {
                a: "a",
                b: "b",
                c: "c",
              },
              {
                a: "a",
                b: "b",
                d: "d",
              },
            ],
          ],
        ],
      ],
      {
        a: "a",
        b: "b",
      }
    ),
    [
      {
        a: "a",
        b: "b",
        c: "c",
      },
      {
        a: "a",
        b: "b",
        d: "d",
      },
    ],
    "08.01"
  );
});

test("09 - rogue 4th input arg given", () => {
  equal(
    getObj(
      [
        {
          tag: "meta",
          content: "UTF-8",
          something: "else",
        },
        {
          tag: "title",
          attrs: "Text of the title",
        },
      ],
      {
        tag: "meta",
      },
      null,
      [
        {
          zzz: "yyy",
        },
      ]
    ),
    [
      {
        tag: "meta",
        content: "UTF-8",
        something: "else",
      },
    ],
    "09.01"
  );
});

// ==============================
// SET
// ==============================

test("10 - set - one plain object", () => {
  equal(
    getObj(
      [
        {
          tag: "meta",
          content: "UTF-8",
          something: "else",
        },
        {
          tag: "title",
          attrs: "Text of the title",
        },
      ],
      {
        tag: "meta",
      },
      [
        {
          tag: "meta",
          content_changed: "UTF-8",
          something: "changed",
        },
      ]
    ),
    [
      {
        tag: "meta",
        content_changed: "UTF-8",
        something: "changed",
      },
      {
        tag: "title",
        attrs: "Text of the title",
      },
    ],
    "10.01"
  );
});

test("11 - set - two plain object", () => {
  equal(
    getObj(
      [
        {
          tag: "meta",
          content: "UTF-8",
        },
        {
          tag: "meta",
          content: "whatnot",
          attributes: "as well",
        },
        {
          tag: "style",
          content: "",
        },
      ],
      { tag: "meta" },
      [
        {
          tag: "edited",
          content: "UTF-8",
        },
        {
          tag: "meta",
          content: "edited",
          attributes: "as well",
        },
      ]
    ),
    [
      {
        tag: "edited",
        content: "UTF-8",
      },
      {
        tag: "meta",
        content: "edited",
        attributes: "as well",
      },
      {
        tag: "style",
        content: "",
      },
    ],
    "11.01"
  );
});

test("12 - set - topmost level object, one value deleted, one changed", () => {
  equal(
    getObj(
      {
        key1: {
          tag: "meta",
          content: "UTF-8",
          something: "else",
        },
        key2: {
          tag: "title",
          attrs: "Text of the title",
        },
        key3: [
          {
            x: "x",
            y: "y",
          },
          {
            tag: "meta",
            content: "ISO-123",
            something: "as well",
          },
        ],
      },
      {
        tag: "meta",
      },
      [
        {
          tag: "meta",
          content: "UTF-8",
        },
        {
          tag: "meta",
          content: "edited",
          something: "as well",
        },
      ]
    ),
    {
      key1: {
        tag: "meta",
        content: "UTF-8",
      },
      key2: {
        tag: "title",
        attrs: "Text of the title",
      },
      key3: [
        {
          x: "x",
          y: "y",
        },
        {
          tag: "meta",
          content: "edited",
          something: "as well",
        },
      ],
    },
    "12.01"
  );
});

test("13 - set - search val object, updated val from plain obj to nested arr", () => {
  equal(
    getObj(
      [
        {
          tag: { key: "meta" },
          content: "UTF-8",
          something: "else",
        },
        {
          tag: "title",
          attrs: "Text of the title",
        },
      ],
      {
        tag: { key: "meta" },
      },
      [
        {
          tag: [["edited"]],
          content: "UTF-8",
          something: "else",
        },
      ]
    ),
    [
      {
        tag: [["edited"]],
        content: "UTF-8",
        something: "else",
      },
      {
        tag: "title",
        attrs: "Text of the title",
      },
    ],
    "13.01"
  );
});

test("14 - set - search value is array - updated value array", () => {
  equal(
    getObj(
      [
        {
          tag: ["two", "values"],
          content: "UTF-8",
          something: "else",
        },
        {
          tag: "title",
          attrs: "Text of the title",
        },
      ],
      {
        tag: ["two", "values"],
      },
      [
        {
          tag: ["three", "values", "here"],
          content: "UTF-8",
          something: "else",
        },
      ]
    ),
    [
      {
        tag: ["three", "values", "here"],
        content: "UTF-8",
        something: "else",
      },
      {
        tag: "title",
        attrs: "Text of the title",
      },
    ],
    "14.01"
  );
});

test("15 - set - search value is nested array - deleted finding", () => {
  equal(
    getObj(
      [
        {
          tag: [["two", "values"]],
          content: "UTF-8",
          something: "else",
        },
        {
          tag: [["two"]],
          attrs: "Text of the title",
        },
      ],
      {
        tag: [["two", "values"]],
      },
      [
        {
          content: "UTF-8",
          something: "else",
        },
      ]
    ),
    [
      {
        content: "UTF-8",
        something: "else",
      },
      {
        tag: [["two"]],
        attrs: "Text of the title",
      },
    ],
    "15.01"
  );
});

test("16 - set - edit skipping similar, false search result", () => {
  equal(
    getObj(
      [
        {
          tag: [
            {
              nested: "object",
              with: "multiple values",
            },
          ],
          content: "UTF-8",
          something: "else",
        },
        {
          tag: [
            {
              nested: "object",
            },
          ],
          content: "UTF-8",
          something: "else",
        },
      ],
      {
        tag: [
          {
            nested: "object",
            with: "multiple values",
          },
        ],
      },
      [
        {
          tag: [
            {
              edited1: "edited1",
              edited2: "edited2",
            },
          ],
          content: "UTF-8",
          something: "else",
        },
      ]
    ),
    [
      {
        tag: [
          {
            edited1: "edited1",
            edited2: "edited2",
          },
        ],
        content: "UTF-8",
        something: "else",
      },
      {
        tag: [
          {
            nested: "object",
          },
        ],
        content: "UTF-8",
        something: "else",
      },
    ],
    "16.01"
  );
});

test("17 - set - numerous everything, wrong order", () => {
  equal(
    getObj(
      [
        [
          [
            [
              {
                e: "e",
                b: "b",
              },
              {
                c: "c",
                b: "b",
                a: "a",
              },
              {
                d: "d",
                b: "b",
                a: "a",
              },
            ],
          ],
        ],
      ],
      {
        b: "b",
        a: "a",
      },
      [
        {
          b: "also edited",
          a: "edited",
          c: "c",
        },
        {
          b: "2",
          a: "1",
          d: "3",
        },
      ]
    ),
    [
      [
        [
          [
            {
              b: "b",
              e: "e",
            },
            {
              a: "edited",
              b: "also edited",
              c: "c",
            },
            {
              a: "1",
              b: "2",
              d: "3",
            },
          ],
        ],
      ],
    ],
    "17.01"
  );
});

test("18 - rogue 4th input arg", () => {
  equal(
    getObj(
      [
        {
          tag: "meta",
          content: "UTF-8",
          something: "else",
        },
        {
          tag: "title",
          attrs: "Text of the title",
        },
      ],
      {
        tag: "meta",
      },
      [
        {
          tag: "meta",
          content_changed: "UTF-8",
          something: "changed",
        },
      ],
      [
        {
          zzz: "yyy",
        },
      ]
    ),
    [
      {
        tag: "meta",
        content_changed: "UTF-8",
        something: "changed",
      },
      {
        tag: "title",
        attrs: "Text of the title",
      },
    ],
    "18.01"
  );
});

// ==============================
// EDGE CASES
// ==============================

test("19 - missing inputs - throws", () => {
  throws(
    () => {
      getObj();
    },
    /THROW_ID_01/g,
    "19.01"
  );
});

test("20 - missing keyValPair", () => {
  throws(
    () => {
      getObj([
        {
          tag: "meta",
          content: "UTF-8",
          something: "else",
        },
      ]);
    },
    /THROW_ID_02/g,
    "20.01"
  );
});

test.run();
