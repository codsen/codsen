const t = require("tap");
const getObj = require("../dist/ast-get-object.cjs");

// ==============================
// GET
// ==============================

t.test("01.01 - get - one plain object as result", t => {
  t.same(
    getObj(
      [
        {
          tag: "meta",
          content: "UTF-8",
          something: "else"
        },
        {
          tag: "title",
          attrs: "Text of the title"
        }
      ],
      {
        tag: "meta"
      }
    ),
    [
      {
        tag: "meta",
        content: "UTF-8",
        something: "else"
      }
    ]
  );
  t.end();
});

t.test("01.02 - get - two plain object as result", t => {
  t.same(
    getObj(
      [
        {
          tag: "meta",
          content: "UTF-8"
        },
        {
          tag: "meta",
          content: "whatnot",
          attributes: "as well"
        },
        {
          tag: "style",
          content: ""
        }
      ],
      { tag: "meta" }
    ),
    [
      {
        tag: "meta",
        content: "UTF-8"
      },
      {
        tag: "meta",
        content: "whatnot",
        attributes: "as well"
      }
    ]
  );
  t.end();
});

t.test("01.03 - get - topmost level container is object", t => {
  t.same(
    getObj(
      {
        key1: {
          tag: "meta",
          content: "UTF-8",
          something: "else"
        },
        key2: {
          tag: "title",
          attrs: "Text of the title"
        },
        key3: [
          {
            x: "x",
            y: "y"
          },
          {
            tag: "meta",
            content: "ISO-123",
            something: "as well"
          }
        ]
      },
      {
        tag: "meta"
      }
    ),
    [
      {
        tag: "meta",
        content: "UTF-8",
        something: "else"
      },
      {
        tag: "meta",
        content: "ISO-123",
        something: "as well"
      }
    ]
  );
  t.end();
});

t.test("01.04 - get - search value is object", t => {
  t.same(
    getObj(
      [
        {
          tag: { key: "meta" },
          content: "UTF-8",
          something: "else"
        },
        {
          tag: "title",
          attrs: "Text of the title"
        }
      ],
      {
        tag: { key: "meta" }
      }
    ),
    [
      {
        tag: { key: "meta" },
        content: "UTF-8",
        something: "else"
      }
    ]
  );
  t.end();
});

t.test("01.05 - get - search value is array", t => {
  t.same(
    getObj(
      [
        {
          tag: ["two", "values"],
          content: "UTF-8",
          something: "else"
        },
        {
          tag: "title",
          attrs: "Text of the title"
        }
      ],
      {
        tag: ["two", "values"]
      }
    ),
    [
      {
        tag: ["two", "values"],
        content: "UTF-8",
        something: "else"
      }
    ]
  );
  t.end();
});

t.test("01.06 - get - search value is nested array", t => {
  t.same(
    getObj(
      [
        {
          tag: [["two", "values"]],
          content: "UTF-8",
          something: "else"
        },
        {
          tag: [["two"]],
          attrs: "Text of the title"
        }
      ],
      {
        tag: [["two", "values"]]
      }
    ),
    [
      {
        tag: [["two", "values"]],
        content: "UTF-8",
        something: "else"
      }
    ]
  );
  t.end();
});

t.test("01.07 - get - search value is nested object", t => {
  t.same(
    getObj(
      [
        {
          tag: [
            {
              nested: "object",
              with: "multiple values"
            }
          ],
          content: "UTF-8",
          something: "else"
        },
        {
          tag: [
            {
              nested: "object"
            }
          ],
          content: "UTF-8",
          something: "else"
        }
      ],
      {
        tag: [
          {
            nested: "object",
            with: "multiple values"
          }
        ]
      }
    ),
    [
      {
        tag: [
          {
            nested: "object",
            with: "multiple values"
          }
        ],
        content: "UTF-8",
        something: "else"
      }
    ]
  );
  t.end();
});

t.test("01.08 - get - numerous everything", t => {
  t.same(
    getObj(
      [
        [
          [
            [
              {
                b: "b",
                e: "e"
              },
              {
                a: "a",
                b: "b",
                c: "c"
              },
              {
                a: "a",
                b: "b",
                d: "d"
              }
            ]
          ]
        ]
      ],
      {
        a: "a",
        b: "b"
      }
    ),
    [
      {
        a: "a",
        b: "b",
        c: "c"
      },
      {
        a: "a",
        b: "b",
        d: "d"
      }
    ]
  );
  t.end();
});

t.test("01.09 - rogue 4th input arg given", t => {
  t.same(
    getObj(
      [
        {
          tag: "meta",
          content: "UTF-8",
          something: "else"
        },
        {
          tag: "title",
          attrs: "Text of the title"
        }
      ],
      {
        tag: "meta"
      },
      null,
      [
        {
          zzz: "yyy"
        }
      ]
    ),
    [
      {
        tag: "meta",
        content: "UTF-8",
        something: "else"
      }
    ]
  );
  t.end();
});

// ==============================
// SET
// ==============================

t.test("02.01 - set - one plain object", t => {
  t.same(
    getObj(
      [
        {
          tag: "meta",
          content: "UTF-8",
          something: "else"
        },
        {
          tag: "title",
          attrs: "Text of the title"
        }
      ],
      {
        tag: "meta"
      },
      [
        {
          tag: "meta",
          content_changed: "UTF-8",
          something: "changed"
        }
      ]
    ),
    [
      {
        tag: "meta",
        content_changed: "UTF-8",
        something: "changed"
      },
      {
        tag: "title",
        attrs: "Text of the title"
      }
    ]
  );
  t.end();
});

t.test("02.02 - set - two plain object", t => {
  t.same(
    getObj(
      [
        {
          tag: "meta",
          content: "UTF-8"
        },
        {
          tag: "meta",
          content: "whatnot",
          attributes: "as well"
        },
        {
          tag: "style",
          content: ""
        }
      ],
      { tag: "meta" },
      [
        {
          tag: "edited",
          content: "UTF-8"
        },
        {
          tag: "meta",
          content: "edited",
          attributes: "as well"
        }
      ]
    ),
    [
      {
        tag: "edited",
        content: "UTF-8"
      },
      {
        tag: "meta",
        content: "edited",
        attributes: "as well"
      },
      {
        tag: "style",
        content: ""
      }
    ]
  );
  t.end();
});

t.test(
  "02.03 - set - topmost level object, one value deleted, one changed",
  t => {
    t.same(
      getObj(
        {
          key1: {
            tag: "meta",
            content: "UTF-8",
            something: "else"
          },
          key2: {
            tag: "title",
            attrs: "Text of the title"
          },
          key3: [
            {
              x: "x",
              y: "y"
            },
            {
              tag: "meta",
              content: "ISO-123",
              something: "as well"
            }
          ]
        },
        {
          tag: "meta"
        },
        [
          {
            tag: "meta",
            content: "UTF-8"
          },
          {
            tag: "meta",
            content: "edited",
            something: "as well"
          }
        ]
      ),
      {
        key1: {
          tag: "meta",
          content: "UTF-8"
        },
        key2: {
          tag: "title",
          attrs: "Text of the title"
        },
        key3: [
          {
            x: "x",
            y: "y"
          },
          {
            tag: "meta",
            content: "edited",
            something: "as well"
          }
        ]
      }
    );
    t.end();
  }
);

t.test(
  "02.04 - set - search val object, updated val from plain obj to nested arr",
  t => {
    t.same(
      getObj(
        [
          {
            tag: { key: "meta" },
            content: "UTF-8",
            something: "else"
          },
          {
            tag: "title",
            attrs: "Text of the title"
          }
        ],
        {
          tag: { key: "meta" }
        },
        [
          {
            tag: [["edited"]],
            content: "UTF-8",
            something: "else"
          }
        ]
      ),
      [
        {
          tag: [["edited"]],
          content: "UTF-8",
          something: "else"
        },
        {
          tag: "title",
          attrs: "Text of the title"
        }
      ]
    );
    t.end();
  }
);

t.test("02.05 - set - search value is array - updated value array", t => {
  t.same(
    getObj(
      [
        {
          tag: ["two", "values"],
          content: "UTF-8",
          something: "else"
        },
        {
          tag: "title",
          attrs: "Text of the title"
        }
      ],
      {
        tag: ["two", "values"]
      },
      [
        {
          tag: ["three", "values", "here"],
          content: "UTF-8",
          something: "else"
        }
      ]
    ),
    [
      {
        tag: ["three", "values", "here"],
        content: "UTF-8",
        something: "else"
      },
      {
        tag: "title",
        attrs: "Text of the title"
      }
    ]
  );
  t.end();
});

t.test("02.06 - set - search value is nested array - deleted finding", t => {
  t.same(
    getObj(
      [
        {
          tag: [["two", "values"]],
          content: "UTF-8",
          something: "else"
        },
        {
          tag: [["two"]],
          attrs: "Text of the title"
        }
      ],
      {
        tag: [["two", "values"]]
      },
      [
        {
          content: "UTF-8",
          something: "else"
        }
      ]
    ),
    [
      {
        content: "UTF-8",
        something: "else"
      },
      {
        tag: [["two"]],
        attrs: "Text of the title"
      }
    ]
  );
  t.end();
});

t.test("02.07 - set - edit skipping similar, false search result", t => {
  t.same(
    getObj(
      [
        {
          tag: [
            {
              nested: "object",
              with: "multiple values"
            }
          ],
          content: "UTF-8",
          something: "else"
        },
        {
          tag: [
            {
              nested: "object"
            }
          ],
          content: "UTF-8",
          something: "else"
        }
      ],
      {
        tag: [
          {
            nested: "object",
            with: "multiple values"
          }
        ]
      },
      [
        {
          tag: [
            {
              edited1: "edited1",
              edited2: "edited2"
            }
          ],
          content: "UTF-8",
          something: "else"
        }
      ]
    ),
    [
      {
        tag: [
          {
            edited1: "edited1",
            edited2: "edited2"
          }
        ],
        content: "UTF-8",
        something: "else"
      },
      {
        tag: [
          {
            nested: "object"
          }
        ],
        content: "UTF-8",
        something: "else"
      }
    ]
  );
  t.end();
});

t.test("02.08 - set - numerous everything, wrong order", t => {
  t.same(
    getObj(
      [
        [
          [
            [
              {
                e: "e",
                b: "b"
              },
              {
                c: "c",
                b: "b",
                a: "a"
              },
              {
                d: "d",
                b: "b",
                a: "a"
              }
            ]
          ]
        ]
      ],
      {
        b: "b",
        a: "a"
      },
      [
        {
          b: "also edited",
          a: "edited",
          c: "c"
        },
        {
          b: "2",
          a: "1",
          d: "3"
        }
      ]
    ),
    [
      [
        [
          [
            {
              b: "b",
              e: "e"
            },
            {
              a: "edited",
              b: "also edited",
              c: "c"
            },
            {
              a: "1",
              b: "2",
              d: "3"
            }
          ]
        ]
      ]
    ]
  );
  t.end();
});

t.test("02.09 - rogue 4th input arg", t => {
  t.same(
    getObj(
      [
        {
          tag: "meta",
          content: "UTF-8",
          something: "else"
        },
        {
          tag: "title",
          attrs: "Text of the title"
        }
      ],
      {
        tag: "meta"
      },
      [
        {
          tag: "meta",
          content_changed: "UTF-8",
          something: "changed"
        }
      ],
      [
        {
          zzz: "yyy"
        }
      ]
    ),
    [
      {
        tag: "meta",
        content_changed: "UTF-8",
        something: "changed"
      },
      {
        tag: "title",
        attrs: "Text of the title"
      }
    ]
  );
  t.end();
});

// ==============================
// EDGE CASES
// ==============================

t.test("03.01 - missing inputs - throws", t => {
  t.throws(() => {
    getObj();
  }, /THROW_ID_01/g);
  t.end();
});

t.test("03.02 - missing keyValPair", t => {
  t.throws(() => {
    getObj([
      {
        tag: "meta",
        content: "UTF-8",
        something: "else"
      }
    ]);
  }, /THROW_ID_02/g);
  t.end();
});
