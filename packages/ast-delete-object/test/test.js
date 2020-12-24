import tap from "tap";
import clone from "lodash.clonedeep";
import { deleteObj } from "../dist/ast-delete-object.esm";

// (input, objToDelete, strictOrNot)

// ==============================
// Object within an array(s), not strict
// ==============================

tap.test("01 - delete one object within an array", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: "val2",
        key3: "val3",
      },
      { matchKeysStrictly: false, hungryForWhitespace: false }
    ),
    ["elem1", "elem4"],
    "01.01 - defaults"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: "val2",
        key3: "val3",
      },
      { matchKeysStrictly: true, hungryForWhitespace: false }
    ),
    [
      "elem1",
      {
        key2: "val2",
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    "01.02 - strict matching"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: "val2",
        key3: "val3",
      },
      { matchKeysStrictly: false, hungryForWhitespace: true }
    ),
    ["elem1", "elem4"],
    "01.03 - hungry for whitespace"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: "val2",
        key3: "val3",
      },
      { matchKeysStrictly: true, hungryForWhitespace: true }
    ),
    [
      "elem1",
      {
        key2: "val2",
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    "01.04 - hungry for whitespace, strict match"
  );
  t.end();
});

tap.test("02 - delete one object, involves white space", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: "val2",
        key3: "   ",
      },
      { matchKeysStrictly: false, hungryForWhitespace: false }
    ),
    [
      "elem1",
      {
        key2: "val2",
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    "02.01 - won't delete because of white space mismatching strictly"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: "val2",
        key3: "val3",
      },
      { matchKeysStrictly: true, hungryForWhitespace: false }
    ),
    [
      "elem1",
      {
        key2: "val2",
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    "02.02 - won't delete because of strict match is on"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: "val2",
        key3: "val3",
      },
      { matchKeysStrictly: false, hungryForWhitespace: true }
    ),
    ["elem1", "elem4"],
    "02.03 - will delete because match is not strict and hungry is on"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: "val2",
        key3: "val3",
      },
      { matchKeysStrictly: true, hungryForWhitespace: true }
    ),
    [
      "elem1",
      {
        key2: "val2",
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    "02.04 - won't delete because of strict match, hungry does not matter"
  );
  t.end();
});

tap.test("03 - multiple findings, object within array", (t) => {
  t.strictSame(
    deleteObj(
      [
        {
          key2: "val2",
          key3: "val3",
          yo: "yo",
          this: "will be deleted too",
        },
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          del: "as well",
          array: [
            "a",
            "b",
            "c",
            {
              obj: "obj1",
            },
          ],
        },
        "elem4",
        {
          key2: "val2",
          key3: "val3",
          and: "this",
          deleted: {
            key2: "val2",
            key3: "val3",
          },
        },
      ],
      {
        key2: "val2",
        key3: "val3",
      }
    ),
    ["elem1", "elem4"],
    "03.01"
  );
  t.strictSame(
    deleteObj(
      [
        {
          key2: "val2",
          key3: "val3",
          yo: "yo",
          this: "will be deleted too",
        },
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          del: "as well",
          array: [
            "a",
            "b",
            "c",
            {
              obj: "obj1",
            },
          ],
        },
        "elem4",
        {
          key2: "val2",
          key3: "val3",
          and: "this",
          deleted: {
            key2: "val2",
            key3: "val3",
          },
        },
      ],
      {
        key2: "val2",
        key3: "val3",
      },
      { matchKeysStrictly: true }
    ),
    [
      {
        key2: "val2",
        key3: "val3",
        yo: "yo",
        this: "will be deleted too",
      },
      "elem1",
      {
        key2: "val2",
        key3: "val3",
        del: "as well",
        array: [
          "a",
          "b",
          "c",
          {
            obj: "obj1",
          },
        ],
      },
      "elem4",
      {
        key2: "val2",
        key3: "val3",
        and: "this",
      },
    ],
    "03.02 - some not deleted because of strict match"
  );
  t.strictSame(
    deleteObj(
      [
        {
          key2: "val2",
          key3: "val3",
          yo: "yo",
          this: "will be deleted too",
        },
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          del: "as well",
          array: [
            "a",
            "b",
            "c",
            {
              obj: "obj1",
            },
          ],
        },
        "elem4",
        {
          key2: "val2",
          key3: "val3",
          and: "this",
          deleted: {
            key2: "val2",
            key3: "val3",
          },
        },
      ],
      {
        key2: "val2",
        key3: "val3",
      },
      { hungryForWhitespace: true }
    ),
    ["elem1", "elem4"],
    "03.03"
  );
  t.strictSame(
    deleteObj(
      [
        {
          key2: "val2",
          key3: "val3",
          yo: "yo",
          this: "will be deleted too",
        },
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          del: "as well",
          array: [
            "a",
            "b",
            "c",
            {
              obj: "obj1",
            },
          ],
        },
        "elem4",
        {
          key2: "val2",
          key3: "val3",
          and: "this",
          deleted: {
            key2: "val2",
            key3: "val3",
          },
        },
      ],
      {
        key2: "val2",
        key3: "val3",
      },
      { matchKeysStrictly: true, hungryForWhitespace: true }
    ),
    [
      {
        key2: "val2",
        key3: "val3",
        yo: "yo",
        this: "will be deleted too",
      },
      "elem1",
      {
        key2: "val2",
        key3: "val3",
        del: "as well",
        array: [
          "a",
          "b",
          "c",
          {
            obj: "obj1",
          },
        ],
      },
      "elem4",
      {
        key2: "val2",
        key3: "val3",
        and: "this",
      },
    ],
    "03.04 - some not deleted because of strict match"
  );
  t.end();
});

tap.test("04 - delete object within an arrays", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        [
          "elem2",
          {
            key3: "val3",
            key4: "val4",
            del: "as well",
            whatnot: "this doesn't matter",
          },
        ],
        "elem5",
      ],
      {
        key3: "val3",
        key4: "val4",
      }
    ),
    ["elem1", ["elem2"], "elem5"],
    "04.01"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        [
          "elem2",
          {
            key3: "val3",
            key4: "val4",
            del: "as well",
            whatnot: "this doesn't matter",
          },
        ],
        "elem5",
      ],
      {
        key3: "val3",
        key4: "val4",
      },
      { matchKeysStrictly: true }
    ),
    [
      "elem1",
      [
        "elem2",
        {
          key3: "val3",
          key4: "val4",
          del: "as well",
          whatnot: "this doesn't matter",
        },
      ],
      "elem5",
    ],
    "04.02"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        [
          "elem2",
          {
            key3: "val3",
            key4: "val4",
            del: "as well",
            whatnot: "this doesn't matter",
          },
        ],
        "elem5",
      ],
      {
        key3: "val3",
        key4: "val4",
      },
      { hungryForWhitespace: true }
    ),
    ["elem1", ["elem2"], "elem5"],
    "04.03"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        [
          "elem2",
          {
            key3: "val3",
            key4: "val4",
            del: "as well",
            whatnot: "this doesn't matter",
          },
        ],
        "elem5",
      ],
      {
        key3: "val3",
        key4: "val4",
      },
      { matchKeysStrictly: true, hungryForWhitespace: true }
    ),
    [
      "elem1",
      [
        "elem2",
        {
          key3: "val3",
          key4: "val4",
          del: "as well",
          whatnot: "this doesn't matter",
        },
      ],
      "elem5",
    ],
    "04.04"
  );
  t.end();
});

tap.test(
  "05 - delete object within an array, wrong order of keys, pt.1",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "val2",
            key4: "val4",
            key3: "val3",
          },
          {
            key3: "val3",
            key4: "val4",
            key2: "val2",
          },
          "elem4",
        ],
        {
          key2: "val2",
          key3: "val3",
        },
        { matchKeysStrictly: false, hungryForWhitespace: false }
      ),
      ["elem1", "elem4"],
      "05.01 - defaults (not strict match, not white space hungry)"
    );
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "val2",
            key4: "val4",
            key3: "val3",
          },
          {
            key3: "val3",
            key4: "val4",
            key2: "val2",
          },
          "elem4",
        ],
        {
          key2: "val2",
          key3: "val3",
        },
        { matchKeysStrictly: true, hungryForWhitespace: false }
      ),
      [
        "elem1",
        {
          key2: "val2",
          key4: "val4",
          key3: "val3",
        },
        {
          key3: "val3",
          key4: "val4",
          key2: "val2",
        },
        "elem4",
      ],
      "05.02 - strict match"
    );
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "val2",
            key4: "val4",
            key3: "val3",
          },
          {
            key3: "val3",
            key4: "val4",
            key2: "val2",
          },
          "elem4",
        ],
        {
          key2: "val2",
          key3: "val3",
        },
        { matchKeysStrictly: false, hungryForWhitespace: true }
      ),
      ["elem1", "elem4"],
      "05.03 - whitespace hungry"
    );
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "val2",
            key4: "val4",
            key3: "val3",
          },
          {
            key3: "val3",
            key4: "val4",
            key2: "val2",
          },
          "elem4",
        ],
        {
          key2: "val2",
          key3: "val3",
        },
        { matchKeysStrictly: true, hungryForWhitespace: true }
      ),
      [
        "elem1",
        {
          key2: "val2",
          key4: "val4",
          key3: "val3",
        },
        {
          key3: "val3",
          key4: "val4",
          key2: "val2",
        },
        "elem4",
      ],
      "05.04 - white space hungry with strict match"
    );
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key3: "val3",
            key2: "val2",
          },
          {
            key3: "val3",
            key4: "val4",
            key2: "val2",
          },
          "elem4",
        ],
        {
          key2: "val2",
          key3: "val3",
        },
        { matchKeysStrictly: true, hungryForWhitespace: true }
      ),
      [
        "elem1",
        {
          key3: "val3",
          key4: "val4",
          key2: "val2",
        },
        "elem4",
      ],
      "05.05 - strict match, different input"
    );
    t.end();
  }
);

tap.test(
  "06 - delete object within an array, wrong order of keys, pt.2",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          {
            tag: "a",
            attrs: {
              class: "animals",
              href: "#",
            },
            content: [
              "\n    ",
              {
                tag: "span",
                attrs: {
                  class: "animals__cat",
                  style: "background: url(cat.png)",
                },
                content: ["Cat"],
              },
              "\n",
            ],
          },
        ],
        {
          class: "animals",
        }
      ),
      [
        {
          tag: "a",
          content: [
            "\n    ",
            {
              tag: "span",
              attrs: {
                class: "animals__cat",
                style: "background: url(cat.png)",
              },
              content: ["Cat"],
            },
            "\n",
          ],
        },
      ],
      "06"
    );
    t.end();
  }
);

tap.test("07 - special case, not strict", (t) => {
  t.strictSame(
    deleteObj(
      {
        key: ["a"],
      },
      {
        key: [],
      }
    ),
    {
      key: ["a"],
    },
    "07"
  );
  t.end();
});

tap.test("08 - special case, strict", (t) => {
  t.strictSame(
    deleteObj(
      {
        key: ["a"],
      },
      {
        key: [],
      },
      { matchKeysStrictly: true }
    ),
    {
      key: ["a"],
    },
    "08"
  );
  t.end();
});

tap.test("09 - real-life situation #1", (t) => {
  t.strictSame(
    deleteObj(
      {
        stylesheet: {
          rules: [
            {
              rules: {
                type: "rule",
                selectors: [],
              },
            },
            {
              rules: {
                type: "rule",
                selectors: [".w2"],
              },
            },
          ],
        },
      },
      {
        type: "rule",
        selectors: [],
      }
    ),
    {
      stylesheet: {
        rules: [
          {},
          {
            rules: {
              type: "rule",
              selectors: [".w2"],
            },
          },
        ],
      },
    },
    "09"
  );
  t.end();
});

tap.test("10 - real-life situation #2", (t) => {
  t.strictSame(
    deleteObj(
      {
        type: "stylesheet",
        stylesheet: {
          rules: [
            {
              type: "media",
              media: "only screen and (max-width: 660px)",
              rules: [
                {
                  type: "rule",
                  selectors: [],
                  declarations: [
                    {
                      type: "declaration",
                      property: "width",
                      value: "1px !important",
                      position: {
                        start: {
                          line: 3,
                          column: 12,
                        },
                        end: {
                          line: 3,
                          column: 32,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 3,
                      column: 7,
                    },
                    end: {
                      line: 3,
                      column: 34,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 2,
                  column: 5,
                },
                end: {
                  line: 4,
                  column: 6,
                },
              },
            },
            {
              type: "media",
              media: "only screen and (max-width: 660px)",
              rules: [
                {
                  type: "rule",
                  selectors: [".w2"],
                  declarations: [
                    {
                      type: "declaration",
                      property: "width",
                      value: "1px !important",
                      position: {
                        start: {
                          line: 6,
                          column: 12,
                        },
                        end: {
                          line: 6,
                          column: 32,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 6,
                      column: 7,
                    },
                    end: {
                      line: 6,
                      column: 34,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 5,
                  column: 5,
                },
                end: {
                  line: 7,
                  column: 6,
                },
              },
            },
          ],
          parsingErrors: [],
        },
      },
      {
        type: "rule",
        selectors: [],
      }
    ),
    {
      type: "stylesheet",
      stylesheet: {
        rules: [
          {
            type: "media",
            media: "only screen and (max-width: 660px)",
            rules: [],
            position: {
              start: {
                line: 2,
                column: 5,
              },
              end: {
                line: 4,
                column: 6,
              },
            },
          },
          {
            type: "media",
            media: "only screen and (max-width: 660px)",
            rules: [
              {
                type: "rule",
                selectors: [".w2"],
                declarations: [
                  {
                    type: "declaration",
                    property: "width",
                    value: "1px !important",
                    position: {
                      start: {
                        line: 6,
                        column: 12,
                      },
                      end: {
                        line: 6,
                        column: 32,
                      },
                    },
                  },
                ],
                position: {
                  start: {
                    line: 6,
                    column: 7,
                  },
                  end: {
                    line: 6,
                    column: 34,
                  },
                },
              },
            ],
            position: {
              start: {
                line: 5,
                column: 5,
              },
              end: {
                line: 7,
                column: 6,
              },
            },
          },
        ],
        parsingErrors: [],
      },
    },
    "10"
  );
  t.end();
});

tap.test("11 - multiple empty values blank arrays #1", (t) => {
  t.strictSame(
    deleteObj(
      deleteObj(
        {
          rules: [
            {
              type: "rule",
              selectors: [],
              zzz: "zzzzzz",
            },
            {
              type: "rule",
              selectors: "",
              zzz: "zzzzzz",
            },
          ],
        },
        {
          selectors: "",
        }
      ),
      {
        selectors: [],
      }
    ),
    {
      rules: [],
    },
    "11"
  );
  t.end();
});

tap.test("12 - multiple empty values blank arrays #2", (t) => {
  t.strictSame(
    deleteObj(
      deleteObj(
        {
          rules: [
            {
              type: "rule",
              selectors: [],
              zzz: "zzzzzz",
            },
            {
              type: "rule",
              selectors: "",
              zzz: "zzzzzz",
            },
          ],
        },
        {
          selectors: [],
        }
      ),
      {
        selectors: "",
      }
    ),
    {
      rules: [],
    },
    "12"
  );
  t.end();
});

tap.test("13 - object's value is a blank array, looking in an array", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: [],
          key4: "val4",
          key3: "val3",
        },
        "elem4",
      ],
      {
        key2: [],
      }
    ),
    ["elem1", "elem4"],
    "13"
  );
  t.end();
});

tap.test("14 - object's value is a blank array, looking in an object", (t) => {
  t.strictSame(
    deleteObj(
      {
        elem1: {
          key2: [],
          key3: "val3",
        },
        elem4: "zz",
      },
      {
        key2: [],
      }
    ),
    {
      elem4: "zz",
    },
    "14"
  );
  t.end();
});

// ==============================
// Object within object, not strict
// ==============================

tap.test("15 - delete object within object - simple #1", (t) => {
  t.strictSame(
    deleteObj(
      [
        {
          key1: "val1",
          key2: {
            key3: "val3",
            key4: "val4",
            del: "as well",
          },
        },
      ],
      {
        key3: "val3",
        key4: "val4",
      }
    ),
    [
      {
        key1: "val1",
      },
    ],
    "15"
  );
  t.end();
});

tap.test("16 - multiple objects to find - simple #1", (t) => {
  t.strictSame(
    deleteObj(
      [
        {
          key1: {
            key3: "val3",
            key4: "val4",
            del: "as well",
          },
          key2: "val2",
          key3: {
            key3: "val3",
            key4: "val4",
            del: "as well",
          },
        },
      ],
      {
        key3: "val3",
        key4: "val4",
      }
    ),
    [
      {
        key2: "val2",
      },
    ],
    "16"
  );
  t.end();
});

tap.test("17 - multiple objects to find within objects", (t) => {
  t.strictSame(
    deleteObj(
      [
        {
          key1: {
            key2: {
              key3: {
                key4: {
                  del1: "del1",
                  del2: "del2",
                  del: "as well",
                },
              },
            },
          },
        },
      ],
      {
        del1: "del1",
        del2: "del2",
      }
    ),
    [
      {
        key1: {
          key2: {
            key3: {},
          },
        },
      },
    ],
    "17"
  );
  t.end();
});

tap.test("18 - real-life scenario", (t) => {
  t.strictSame(
    deleteObj(
      [
        {
          rules: [
            {
              type: "rule",
              selectors: [".hide"],
              declarations: [
                {
                  type: "declaration",
                  property: "display",
                  value: "none !important",
                  position: {
                    start: {
                      line: 3,
                      column: 13,
                    },
                    end: {
                      line: 3,
                      column: 36,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 3,
                  column: 5,
                },
                end: {
                  line: 3,
                  column: 38,
                },
              },
            },
            {
              type: "rule",
              selectors: [],
              declarations: [
                {
                  type: "declaration",
                  property: "border-bottom",
                  value: "1px solid #cccccc !important",
                  position: {
                    start: {
                      line: 7,
                      column: 23,
                    },
                    end: {
                      line: 7,
                      column: 65,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 7,
                  column: 5,
                },
                end: {
                  line: 7,
                  column: 67,
                },
              },
            },
          ],
        },
      ],
      {
        type: "rule",
        selectors: [],
      }
    ),
    [
      {
        rules: [
          {
            type: "rule",
            selectors: [".hide"],
            declarations: [
              {
                type: "declaration",
                property: "display",
                value: "none !important",
                position: {
                  start: {
                    line: 3,
                    column: 13,
                  },
                  end: {
                    line: 3,
                    column: 36,
                  },
                },
              },
            ],
            position: {
              start: {
                line: 3,
                column: 5,
              },
              end: {
                line: 3,
                column: 38,
              },
            },
          },
        ],
      },
    ],
    "18"
  );
  t.end();
});

tap.test("19 - delete object within object - simple #1", (t) => {
  t.strictSame(
    deleteObj(
      {
        key1: "val1",
        key2: {
          key3: "val3",
          key4: "val4",
          del: "as well",
        },
      },
      {
        key3: "val3",
        key4: "val4",
      }
    ),
    {
      key1: "val1",
    },
    "19"
  );
  t.end();
});

// ==============================
// Edge cases
// ==============================

tap.test("20 - the input is the finding", (t) => {
  t.strictSame(
    deleteObj(
      {
        key3: "val3",
        key4: "val4",
        del: "as well",
      },
      {
        key3: "val3",
        key4: "val4",
      }
    ),
    {},
    "20"
  );
  t.end();
});

tap.test("21 - the input is boolean", (t) => {
  t.strictSame(
    deleteObj(true, {
      key3: "val3",
      key4: "val4",
    }),
    true,
    "21"
  );
  t.end();
});

tap.test("22 - the input is string", (t) => {
  t.strictSame(
    deleteObj("yo", {
      key3: "val3",
      key4: "val4",
    }),
    "yo",
    "22"
  );
  t.end();
});

tap.test("23 - no input - throws", (t) => {
  t.throws(() => {
    deleteObj();
  }, "23.01");
  t.throws(() => {
    deleteObj(undefined, {
      key3: "val3",
      key4: "val4",
    });
  }, "23.02");
  // wrong third argument throws:
  t.throws(() => {
    deleteObj({ a: "z" }, { b: "y" }, 1);
  }, "23.03");
  t.end();
});

tap.test("24 - the input is the finding (right within array)", (t) => {
  t.strictSame(
    deleteObj(
      [
        {
          key3: "val3",
          key4: "val4",
        },
      ],
      {
        key3: "val3",
        key4: "val4",
      }
    ),
    [],
    "24"
  );
  t.end();
});

tap.test("25 - pt1. empty object to find", (t) => {
  t.strictSame(
    deleteObj(
      [
        {
          key3: "val3",
          key4: "val4",
        },
      ],
      {},
      { matchKeysStrictly: false, hungryForWhitespace: false }
    ),
    [
      {
        key3: "val3",
        key4: "val4",
      },
    ],
    "25.01"
  );
  t.strictSame(
    deleteObj(
      [
        {
          key3: "val3",
          key4: "val4",
        },
      ],
      {},
      { matchKeysStrictly: false, hungryForWhitespace: true }
    ),
    [
      {
        key3: "val3",
        key4: "val4",
      },
    ],
    "25.02"
  );
  t.strictSame(
    deleteObj(
      [
        {
          key3: "val3",
          key4: "val4",
        },
      ],
      {},
      { matchKeysStrictly: true, hungryForWhitespace: false }
    ),
    [
      {
        key3: "val3",
        key4: "val4",
      },
    ],
    "25.03"
  );
  t.strictSame(
    deleteObj(
      [
        {
          key3: "val3",
          key4: "val4",
        },
      ],
      {},
      { matchKeysStrictly: true, hungryForWhitespace: true }
    ),
    [
      {
        key3: "val3",
        key4: "val4",
      },
    ],
    "25.04"
  );
  t.end();
});

// searching for an empty plain object, source contains various empty plain objects
// -----------------------------------------------------------------------------

tap.test("26 - pt2. empty object to find", (t) => {
  t.strictSame(
    deleteObj(
      [
        {},
        {
          key3: "val3",
          key4: "val4",
        },
        {},
        {},
      ],
      {},
      { matchKeysStrictly: false, hungryForWhitespace: false }
    ),
    [
      {
        key3: "val3",
        key4: "val4",
      },
    ],
    "26.01"
  );
  t.strictSame(
    deleteObj(
      [
        {},
        {
          key3: "val3",
          key4: "val4",
        },
        {},
        {},
      ],
      {},
      { matchKeysStrictly: false, hungryForWhitespace: true }
    ),
    [
      {
        key3: "val3",
        key4: "val4",
      },
    ],
    "26.02 - rare case - both opts on, matching against blank object - will yield positive against other blank objects, disregarding the STRICTLY flag"
  );
  t.strictSame(
    deleteObj(
      [
        {},
        {
          key3: "val3",
          key4: "val4",
        },
        {},
        {},
      ],
      {},
      { matchKeysStrictly: true, hungryForWhitespace: false }
    ),
    [
      {
        key3: "val3",
        key4: "val4",
      },
    ],
    "26.03"
  );
  t.strictSame(
    deleteObj(
      [
        {},
        {
          key3: "val3",
          key4: "val4",
        },
        {},
        {},
      ],
      {},
      { matchKeysStrictly: true, hungryForWhitespace: true }
    ),
    [
      {
        key3: "val3",
        key4: "val4",
      },
    ],
    "26.04"
  );
  t.end();
});

// searching for an empty array, source includes various empty plain objects
// -----------------------------------------------------------------------------

tap.test("27 - pt3. empty object to find", (t) => {
  t.strictSame(
    deleteObj(
      [
        { a: "\n" },
        {
          key3: "val3",
          key4: "val4",
        },
        { b: "   " },
        { c: "" },
      ],
      {},
      { matchKeysStrictly: false, hungryForWhitespace: false }
    ),
    [
      { a: "\n" },
      {
        key3: "val3",
        key4: "val4",
      },
      { b: "   " },
      { c: "" },
    ],
    "27.01"
  );
  t.strictSame(
    deleteObj(
      [
        { a: "\n" },
        {
          key3: "val3",
          key4: "val4",
        },
        { b: "   " },
        { c: "" },
      ],
      {},
      { matchKeysStrictly: false, hungryForWhitespace: true }
    ),
    [
      {
        key3: "val3",
        key4: "val4",
      },
    ],
    "27.02"
  );
  t.strictSame(
    deleteObj(
      [
        { a: "\n" },
        {
          key3: "val3",
          key4: "val4",
        },
        { b: "   " },
        { c: "" },
      ],
      {},
      { matchKeysStrictly: true, hungryForWhitespace: false }
    ),
    [
      { a: "\n" },
      {
        key3: "val3",
        key4: "val4",
      },
      { b: "   " },
      { c: "" },
    ],
    "27.03"
  );
  t.strictSame(
    deleteObj(
      [
        { a: "\n" },
        {
          key3: "val3",
          key4: "val4",
        },
        { b: "   " },
        { c: "" },
      ],
      {},
      { matchKeysStrictly: true, hungryForWhitespace: true }
    ),
    [
      {
        key3: "val3",
        key4: "val4",
      },
    ],
    "27.04"
  );
  t.end();
});

tap.test("28 - to find is undefined - throws", (t) => {
  t.throws(() => {
    deleteObj(
      [
        {
          key3: "val3",
          key4: "val4",
        },
      ],
      undefined
    );
  }, "28");
  t.end();
});

tap.test("29 - to find is null - throws", (t) => {
  t.throws(() => {
    deleteObj(
      [
        {
          key3: "val3",
          key4: "val4",
        },
      ],
      null
    );
  }, "29");
  t.end();
});

tap.test("30 - to find is string - returns input", (t) => {
  t.strictSame(
    deleteObj(
      [
        {
          key3: "val3",
          key4: "val4",
        },
      ],
      "yo"
    ),
    [
      {
        key3: "val3",
        key4: "val4",
      },
    ],
    "30"
  );
  t.end();
});

// ==============================
// Object within an array(s), strict
// ==============================

tap.test(
  "31 - won't delete object within an array because of strict mode",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "val2",
            key3: "val3",
            key4: "val4",
          },
          "elem4",
        ],
        {
          key2: "val2",
          key3: "val3",
        },
        {
          matchKeysStrictly: true,
        }
      ),
      [
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      "31"
    );
    t.end();
  }
);

tap.test("32 - won't find multiple findings because of strict mode", (t) => {
  t.strictSame(
    deleteObj(
      [
        {
          key2: "val2",
          deleted: {
            key2: "val2",
            key3: "val3",
            key4: "val4",
          },
        },
      ],
      {
        key2: "val2",
        key3: "val3",
      },
      {
        matchKeysStrictly: true,
      }
    ),
    [
      {
        key2: "val2",
        deleted: {
          key2: "val2",
          key3: "val3",
          key4: "val4",
        },
      },
    ],
    "32"
  );
  t.end();
});

tap.test(
  "33 - strict mode: deletes some and skips some because of strict mode",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          {
            key2: "val2",
            key3: "val3",
            yo: "yo",
            this: "will be deleted too",
          },
          "elem1",
          {
            key2: "val2",
            key3: "val3",
            del: "as well",
            array: [
              "a",
              "b",
              "c",
              {
                obj: "obj1",
              },
            ],
          },
          "elem4",
          {
            key2: "val2",
            key3: "val3",
            and: "this",
            deleted: {
              key2: "val2",
              key3: "val3",
            },
          },
        ],
        {
          key2: "val2",
          key3: "val3",
        },
        {
          matchKeysStrictly: true,
        }
      ),
      [
        {
          key2: "val2",
          key3: "val3",
          yo: "yo",
          this: "will be deleted too",
        },
        "elem1",
        {
          key2: "val2",
          key3: "val3",
          del: "as well",
          array: [
            "a",
            "b",
            "c",
            {
              obj: "obj1",
            },
          ],
        },
        "elem4",
        {
          key2: "val2",
          key3: "val3",
          and: "this",
        },
      ],
      "33"
    );
    t.end();
  }
);

tap.test(
  "34 - won't delete object within an arrays because of strict mode",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          "elem1",
          [
            "elem2",
            {
              key3: "val3",
              key4: "val4",
              del: "as well",
              whatnot: "this doesn't matter",
            },
          ],
          "elem5",
        ],
        {
          key3: "val3",
          key4: "val4",
        },
        {
          matchKeysStrictly: true,
        }
      ),
      [
        "elem1",
        [
          "elem2",
          {
            key3: "val3",
            key4: "val4",
            del: "as well",
            whatnot: "this doesn't matter",
          },
        ],
        "elem5",
      ],
      "34"
    );
    t.end();
  }
);

// ==============================
// Non-strict recognising empty space
// ==============================

tap.test("35 - recognises array containing only empty space - default", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n    "],
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: [],
      },
      {
        hungryForWhitespace: true,
      }
    ),
    ["elem1", "elem4"],
    "35.01"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n    "],
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: [],
      },
      {
        hungryForWhitespace: false,
      }
    ),
    [
      "elem1",
      {
        key2: ["\n\n \t \n \n    "],
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    "35.02"
  );
  t.end();
});

tap.test("36 - recognises array containing only empty space - strict", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n    "],
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: [],
      },
      {
        matchKeysStrictly: true,
      }
    ),
    [
      "elem1",
      {
        key2: ["\n\n \t \n \n    "],
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    "36.01"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n    "],
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: [],
      },
      {
        matchKeysStrictly: false,
      }
    ),
    [
      "elem1",
      {
        key2: ["\n\n \t \n \n    "],
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    "36.02"
  );
  t.end();
});

tap.test(
  "37 - recognises array containing only empty space - not found",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: ["\n\n \t \n \n  .  "],
            key3: "val3",
            key4: "val4",
          },
          "elem4",
        ],
        {
          key2: [],
        }
      ),
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n  .  "],
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      "37"
    );
    t.end();
  }
);

tap.test("38 - two keys in objToDelete - default", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n    "],
          key3: [" ", "\n"],
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: [],
        key3: [""],
      },
      {
        hungryForWhitespace: true,
      }
    ),
    ["elem1", "elem4"],
    "38"
  );
  t.end();
});

tap.test("39 - two keys in objToDelete - strict, not found", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n   . "],
          key3: [" ", "\n"],
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: [],
        key3: [""],
      },
      {
        matchKeysStrictly: true,
      }
    ),
    [
      "elem1",
      {
        key2: ["\n\n \t \n \n   . "],
        key3: [" ", "\n"],
        key4: "val4",
      },
      "elem4",
    ],
    "39.01"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n   . "],
          key3: [" ", "\n"],
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: [],
        key3: [""],
      }
    ),
    [
      "elem1",
      {
        key2: ["\n\n \t \n \n   . "],
        key3: [" ", "\n"],
        key4: "val4",
      },
      "elem4",
    ],
    "39.02"
  );
  t.end();
});

tap.test("40 - two keys in objToDelete - strict", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n    "],
          key3: [" ", "\n"],
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: [],
        key3: [""],
      },
      { matchKeysStrictly: true }
    ),
    [
      "elem1",
      {
        key2: ["\n\n \t \n \n    "],
        key3: [" ", "\n"],
        key4: "val4",
      },
      "elem4",
    ],
    "40"
  );
  t.end();
});

tap.test("41 - array with strings containing emptiness - default", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n    ", "\n", "\t", "   "],
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: [],
      }
    ),
    [
      "elem1",
      {
        key2: ["\n\n \t \n \n    ", "\n", "\t", "   "],
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    "41.01"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n    ", "\n", "\t", "   "],
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: [],
      },
      {
        hungryForWhitespace: true,
      }
    ),
    ["elem1", "elem4"],
    "41.02"
  );
  t.end();
});

tap.test("42 - array with strings containing emptiness - strict", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n    ", "\n", "\t", "   "],
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: [],
      },
      {
        matchKeysStrictly: true,
      }
    ),
    [
      "elem1",
      {
        key2: ["\n\n \t \n \n    ", "\n", "\t", "   "],
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    "42"
  );
  t.end();
});

tap.test("43 - array with strings containing emptiness - strict found", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n    ", "\n", "\t", "   "],
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: ["\n\n \t \n \n    ", "\n", "\t", "   "],
      },
      {
        matchKeysStrictly: true,
      }
    ),
    [
      "elem1",
      {
        key2: ["\n\n \t \n \n    ", "\n", "\t", "   "],
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    "43.01"
  );
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n    ", "\n", "\t", "   "],
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: ["\n\n \t \n \n    ", "\n", "\t", "   "],
      },
      {
        matchKeysStrictly: false,
      }
    ),
    ["elem1", "elem4"],
    "43.02"
  );
  t.end();
});

tap.test(
  "44 - recognises string containing only empty space (queried array)",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "\n\n \t \n \n    ",
            key3: "val3",
            key4: "val4",
          },
          "elem4",
        ],
        {
          key2: [],
        },
        {
          hungryForWhitespace: true,
        }
      ),
      ["elem1", "elem4"],
      "44.01"
    );
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "\n\n \t \n \n    ",
            key3: "val3",
            key4: "val4",
          },
          "elem4",
        ],
        {
          key2: [],
        },
        {
          hungryForWhitespace: false,
        }
      ),
      [
        "elem1",
        {
          key2: "\n\n \t \n \n    ",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      "44.02"
    );
    t.end();
  }
);

tap.test("45 - recognises string containing only empty space - strict", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: "\n\n \t \n \n    ",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: [],
      },
      {
        matchKeysStrictly: true,
      }
    ),
    [
      "elem1",
      {
        key2: "\n\n \t \n \n    ",
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    "45"
  );
  t.end();
});

tap.test(
  "46 - recognises string containing only empty space - won't find",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "\n\n \t \n \n  .  ",
            key3: "val3",
            key4: "val4",
          },
          "elem4",
        ],
        {
          a: [],
        }
      ),
      [
        "elem1",
        {
          key2: "\n\n \t \n \n  .  ",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      "46"
    );
    t.end();
  }
);

tap.test(
  "47 - recognises string containing only empty space - won't find",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "\n\n \t \n \n    ",
            key3: "val3",
            key4: "val4",
          },
          "elem4",
        ],
        {
          key2: [],
          key3: [],
        }
      ),
      [
        "elem1",
        {
          key2: "\n\n \t \n \n    ",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      "47.01"
    );
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "\n\n \t \n \n    ",
            key3: "val3",
            key4: "val4",
          },
          "elem4",
        ],
        {
          key2: [],
          key3: [],
        },
        {
          hungryForWhitespace: true,
        }
      ),
      [
        "elem1",
        {
          key2: "\n\n \t \n \n    ",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      "47.02"
    );
    t.end();
  }
);

tap.test(
  "48 - recognises a string containing only empty space (queried array with empty string)",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "\n\n \t \n \n    ",
            key3: "val3",
            key4: "val4",
          },
          "elem4",
        ],
        {
          key2: [""],
        },
        {
          hungryForWhitespace: true,
        }
      ),
      ["elem1", "elem4"],
      "48"
    );
    t.end();
  }
);

tap.test(
  "49 - a string containing only empty space (queried array) - strict",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "\n\n \t \n \n    ",
            key3: "val3",
            key4: "val4",
          },
          "elem4",
        ],
        {
          key2: [""],
        },
        {
          matchKeysStrictly: true,
        }
      ),
      [
        "elem1",
        {
          key2: "\n\n \t \n \n    ",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      "49"
    );
    t.end();
  }
);

tap.test(
  "50 - a string containing only empty space (queried array) - not found",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "\n\n \t \n \n    ",
            key3: "val3",
            key4: "val4",
          },
          "elem4",
        ],
        {
          key2: [""],
          a: [],
        }
      ),
      [
        "elem1",
        {
          key2: "\n\n \t \n \n    ",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      "50"
    );
    t.end();
  }
);

tap.test(
  "51 - recognises string containing only empty space string (queried empty string)",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: "\n\n \t \n \n    ",
            key3: "val3",
            key4: "val4",
          },
          "elem4",
        ],
        {
          key2: "",
        },
        {
          hungryForWhitespace: true,
        }
      ),
      ["elem1", "elem4"],
      "51"
    );
    t.end();
  }
);

tap.test("52 - multiple string values in objToDelete", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: "\n\n \t \n \n    ",
          key3: "  ",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: "",
        key3: "",
      },
      {
        hungryForWhitespace: true,
      }
    ),
    ["elem1", "elem4"],
    "52"
  );
  t.end();
});

tap.test("53 - multiple string values in objToDelete - not found", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: "\n\n \t \n \n  .  ",
          key3: "  ",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: "",
        key3: "",
      }
    ),
    [
      "elem1",
      {
        key2: "\n\n \t \n \n  .  ",
        key3: "  ",
        key4: "val4",
      },
      "elem4",
    ],
    "53"
  );
  t.end();
});

tap.test("54 - multiple string values in objToDelete - strict", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: "\n\n \t \n \n    ",
          key3: "  ",
          key4: "val4",
        },
        {
          key2: "\n\n \t \n \n    ",
          key3: "  ",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: "",
        key3: "",
      },
      { matchKeysStrictly: true }
    ),
    [
      "elem1",
      {
        key2: "\n\n \t \n \n    ",
        key3: "  ",
        key4: "val4",
      },
      {
        key2: "\n\n \t \n \n    ",
        key3: "  ",
        key4: "val4",
      },
      "elem4",
    ],
    "54"
  );
  t.end();
});

tap.test("55 - won't find, queried object with empty string value", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: ["\n\n \t \n \n    "],
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        a: "",
      }
    ),
    [
      "elem1",
      {
        key2: ["\n\n \t \n \n    "],
        key3: "val3",
        key4: "val4",
      },
      "elem4",
    ],
    "55"
  );
  t.end();
});

tap.test(
  "56 - recognises array of strings each containing only empty space (queried empty string)",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: ["\n\n \t \n \n    ", "\n\n \n"],
            key3: "val3",
            key4: "val4",
          },
          "elem4",
        ],
        {
          key2: "",
        },
        {
          hungryForWhitespace: true,
        }
      ),
      ["elem1", "elem4"],
      "56"
    );
    t.end();
  }
);

tap.test(
  "57 - recognises array with multiple strings containing emptiness",
  (t) => {
    t.strictSame(
      deleteObj(
        [
          "elem1",
          {
            key2: ["\n\n \t \n \n    ", "\n", "\t", "   "],
            key3: "val3",
            key4: "val4",
          },
          "elem4",
        ],
        {
          key2: [""],
        },
        {
          hungryForWhitespace: true,
        }
      ),
      ["elem1", "elem4"],
      "57"
    );
    t.end();
  }
);

tap.test("58 - empty array finding empty string", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: "",
          key3: "val3",
          key4: "val4",
        },
        {
          key2: "",
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: [],
      },
      {
        hungryForWhitespace: true,
      }
    ),
    ["elem1", "elem4"],
    "58"
  );
  t.end();
});

tap.test("59 - empty string finding empty array", (t) => {
  t.strictSame(
    deleteObj(
      [
        "elem1",
        {
          key2: [],
          key3: "val3",
          key4: "val4",
        },
        "elem4",
      ],
      {
        key2: "",
      },
      {
        hungryForWhitespace: true,
      }
    ),
    ["elem1", "elem4"],
    "59"
  );
  t.end();
});

tap.test("60 - object deleted from an array, strict mode", (t) => {
  t.strictSame(
    deleteObj(
      [{ a: "a" }],
      {
        a: "a",
      },
      { matchKeysStrictly: true }
    ),
    [],
    "60"
  );
  t.end();
});

// ==============================
// Other and random tests
// ==============================

tap.test("61 - real life situation #1", (t) => {
  t.strictSame(
    deleteObj(
      {
        stylesheet: {
          rules: [
            {
              type: "rule",
              selectors: "",
            },
            {
              type: "rule",
              selectors: "",
            },
          ],
        },
      },
      {
        selectors: "",
      }
    ),
    {
      stylesheet: {
        rules: [],
      },
    },
    "61"
  );
  t.end();
});

tap.test("62 - real life situation #2", (t) => {
  t.strictSame(
    deleteObj(
      {
        stylesheet: {
          rules: [
            {
              type: "rule",
              selectors: [],
            },
            {
              type: "rule",
              selectors: [],
            },
          ],
        },
      },
      {
        selectors: [],
      }
    ),
    {
      stylesheet: {
        rules: [],
      },
    },
    "62"
  );
  t.end();
});

tap.test("63 - real life situation #3", (t) => {
  t.strictSame(
    deleteObj(
      {
        type: "stylesheet",
        stylesheet: {
          rules: [
            {
              type: "rule",
              selectors: [],
              declarations: [
                {
                  type: "declaration",
                  property: "display",
                  value: "block",
                  position: {
                    start: {
                      line: 2,
                      column: 15,
                    },
                    end: {
                      line: 2,
                      column: 29,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 2,
                  column: 3,
                },
                end: {
                  line: 2,
                  column: 30,
                },
              },
            },
            {
              type: "rule",
              selectors: [],
              declarations: [
                {
                  type: "declaration",
                  property: "display",
                  value: "inline",
                  position: {
                    start: {
                      line: 3,
                      column: 21,
                    },
                    end: {
                      line: 3,
                      column: 36,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 3,
                  column: 3,
                },
                end: {
                  line: 3,
                  column: 37,
                },
              },
            },
            {
              type: "rule",
              selectors: [],
              declarations: [
                {
                  type: "declaration",
                  property: "display",
                  value: "inline-block",
                  position: {
                    start: {
                      line: 4,
                      column: 23,
                    },
                    end: {
                      line: 4,
                      column: 44,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 4,
                  column: 3,
                },
                end: {
                  line: 4,
                  column: 45,
                },
              },
            },
            {
              type: "rule",
              selectors: [],
              declarations: [
                {
                  type: "declaration",
                  property: "display",
                  value: "flex",
                  position: {
                    start: {
                      line: 5,
                      column: 15,
                    },
                    end: {
                      line: 5,
                      column: 28,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 5,
                  column: 3,
                },
                end: {
                  line: 5,
                  column: 30,
                },
              },
            },
          ],
          parsingErrors: [],
        },
      },
      {
        selectors: [],
      }
    ),
    {
      type: "stylesheet",
      stylesheet: {
        rules: [],
        parsingErrors: [],
      },
    },
    "63"
  );
  t.end();
});

tap.test("64 - real life situation #4", (t) => {
  t.strictSame(
    deleteObj(
      {
        type: "stylesheet",
        stylesheet: {
          rules: [
            {
              type: "rule",
              selectors: [],
              declarations: [
                {
                  type: "declaration",
                  property: "display",
                  value: "block",
                  position: {
                    start: {
                      line: 2,
                      column: 15,
                    },
                    end: {
                      line: 2,
                      column: 29,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 2,
                  column: 3,
                },
                end: {
                  line: 2,
                  column: 30,
                },
              },
            },
            {
              type: "rule",
              selectors: [],
              declarations: [
                {
                  type: "declaration",
                  property: "display",
                  value: "inline",
                  position: {
                    start: {
                      line: 3,
                      column: 21,
                    },
                    end: {
                      line: 3,
                      column: 36,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 3,
                  column: 3,
                },
                end: {
                  line: 3,
                  column: 37,
                },
              },
            },
            {
              type: "rule",
              selectors: [],
              declarations: [
                {
                  type: "declaration",
                  property: "display",
                  value: "inline-block",
                  position: {
                    start: {
                      line: 4,
                      column: 23,
                    },
                    end: {
                      line: 4,
                      column: 44,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 4,
                  column: 3,
                },
                end: {
                  line: 4,
                  column: 45,
                },
              },
            },
            {
              type: "rule",
              selectors: [],
              declarations: [
                {
                  type: "declaration",
                  property: "display",
                  value: "flex",
                  position: {
                    start: {
                      line: 5,
                      column: 15,
                    },
                    end: {
                      line: 5,
                      column: 28,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 5,
                  column: 3,
                },
                end: {
                  line: 5,
                  column: 30,
                },
              },
            },
          ],
          parsingErrors: [],
        },
      },
      {
        selectors: [],
      }
    ),
    {
      type: "stylesheet",
      stylesheet: {
        rules: [],
        parsingErrors: [],
      },
    },
    "64"
  );
  t.end();
});

tap.test("65 - empty strings within arrays", (t) => {
  t.strictSame(
    deleteObj(
      [
        "",
        {
          key2: ["\n\n \t \n \n    "],
          key3: [" ", "\n"],
          key4: "val4",
        },
        "",
      ],
      {
        key2: [],
        key3: [""],
      }
    ),
    [
      "",
      {
        key2: ["\n\n \t \n \n    "],
        key3: [" ", "\n"],
        key4: "val4",
      },
      "",
    ],
    "65.01 - defaults"
  );
  t.strictSame(
    deleteObj(
      [
        "",
        {
          key2: ["\n\n \t \n \n    "],
          key3: [" ", "\n"],
          key4: "val4",
        },
        "",
      ],
      {
        key2: [],
        key3: [""],
      },
      {
        hungryForWhitespace: true,
      }
    ),
    ["", ""], // <<< result
    "65.02 - hungryForWhitespace"
  );
  t.strictSame(
    deleteObj(
      [
        "",
        {
          key2: ["\n\n \t \n \n    "],
          key3: [" ", "\n"],
          key4: "val4",
        },
        "",
      ],
      {
        key2: [],
        key3: [""],
      },
      {
        matchKeysStrictly: true,
      }
    ),
    [
      "",
      {
        key2: ["\n\n \t \n \n    "],
        key3: [" ", "\n"],
        key4: "val4",
      },
      "",
    ],
    "65.03 - matchKeysStrictly"
  );
  t.strictSame(
    deleteObj(
      [
        "",
        {
          key2: ["\n\n \t \n \n    "],
          key3: [" ", "\n"],
          key4: "val4",
        },
        "",
      ],
      {
        key2: [],
        key3: [""],
      },
      {
        matchKeysStrictly: true,
        hungryForWhitespace: true,
      }
    ),
    [
      "",
      {
        key2: ["\n\n \t \n \n    "],
        key3: [" ", "\n"],
        key4: "val4",
      },
      "",
    ],
    "65.04 - matchKeysStrictly + hungryForWhitespace"
  );
  t.end();
});

tap.test("66 - strict mode, deletes everything", (t) => {
  t.strictSame(
    deleteObj(
      {
        a: "a",
        b: "b",
      },
      {
        a: "a",
        b: "b",
      },
      {
        matchKeysStrictly: true,
      }
    ),
    {},
    "66.01"
  );
  t.strictSame(
    deleteObj(
      {
        a: "a",
        b: "b",
      },
      {
        a: "a",
        b: "b",
      },
      {
        matchKeysStrictly: false,
      }
    ),
    {},
    "66.02"
  );
  t.end();
});

tap.test("67 - treats holes in arrays - ast-monkey will fix them", (t) => {
  t.strictSame(
    deleteObj(["a", undefined, "b"], {
      x: "y",
    }),
    ["a", "b"],
    "67"
  );
  t.end();
});

// ==============================
// Testing for input arg mutation
// ==============================

tap.test("68 - does not mutate input args", (t) => {
  const obj1 = {
    a: "a",
    b: "b",
  };
  const obj2 = clone(obj1);
  const unneededResult = deleteObj(obj1, obj2, { matchKeysStrictly: true });
  t.pass(unneededResult); // dummy to please linter
  t.strictSame(
    obj1,
    {
      a: "a",
      b: "b",
    },
    "68.01"
  ); // real deal
  t.strictSame(
    obj2,
    {
      a: "a",
      b: "b",
    },
    "68.02"
  ); // real deal
  t.end();
});
