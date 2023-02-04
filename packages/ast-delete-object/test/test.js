import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import clone from "lodash.clonedeep";

import { deleteObj } from "../dist/ast-delete-object.esm.js";

// (input, objToDelete, strictOrNot)

// ==============================
// Object within an array(s), not strict
// ==============================

test("01 - delete one object within an array", () => {
  equal(
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
    "01.01"
  );
  equal(
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
    "01.02"
  );
  equal(
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
    "01.03"
  );
  equal(
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
    "01.04"
  );
});

test("02 - delete one object, involves white space", () => {
  equal(
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
    "02.01"
  );
  equal(
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
    "02.02"
  );
  equal(
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
    "02.03"
  );
  equal(
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
    "02.04"
  );
});

test("03 - multiple findings, object within array", () => {
  equal(
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
  equal(
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
    "03.02"
  );
  equal(
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
  equal(
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
    "03.04"
  );
});

test("04 - delete object within an arrays", () => {
  equal(
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
  equal(
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
  equal(
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
  equal(
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
});

test("05 - delete object within an array, wrong order of keys, pt.1", () => {
  equal(
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
    "05.01"
  );
  equal(
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
    "05.02"
  );
  equal(
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
    "05.03"
  );
  equal(
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
    "05.04"
  );
  equal(
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
    "05.05"
  );
});

test("06 - delete object within an array, wrong order of keys, pt.2", () => {
  equal(
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
    "06.01"
  );
});

test("07 - special case, not strict", () => {
  equal(
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
    "07.01"
  );
});

test("08 - special case, strict", () => {
  equal(
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
    "08.01"
  );
});

test("09 - real-life situation #1", () => {
  equal(
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
    "09.01"
  );
});

test("10 - real-life situation #2", () => {
  equal(
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
    "10.01"
  );
});

test("11 - multiple empty values blank arrays #1", () => {
  equal(
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
    "11.01"
  );
});

test("12 - multiple empty values blank arrays #2", () => {
  equal(
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
    "12.01"
  );
});

test("13 - object's value is a blank array, looking in an array", () => {
  equal(
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
    "13.01"
  );
});

test("14 - object's value is a blank array, looking in an object", () => {
  equal(
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
    "14.01"
  );
});

// ==============================
// Object within object, not strict
// ==============================

test("15 - delete object within object - simple #1", () => {
  equal(
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
    "15.01"
  );
});

test("16 - multiple objects to find - simple #1", () => {
  equal(
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
    "16.01"
  );
});

test("17 - multiple objects to find within objects", () => {
  equal(
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
    "17.01"
  );
});

test("18 - real-life scenario", () => {
  equal(
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
    "18.01"
  );
});

test("19 - delete object within object - simple #1", () => {
  equal(
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
    "19.01"
  );
});

// ==============================
// Edge cases
// ==============================

test("20 - the input is the finding", () => {
  equal(
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
    "20.01"
  );
});

test("21 - the input is boolean", () => {
  equal(
    deleteObj(true, {
      key3: "val3",
      key4: "val4",
    }),
    true,
    "21.01"
  );
});

test("22 - the input is string", () => {
  equal(
    deleteObj("yo", {
      key3: "val3",
      key4: "val4",
    }),
    "yo",
    "22.01"
  );
});

test("23 - no input - throws", () => {
  throws(
    () => {
      deleteObj();
    },
    "23.01",
    "23.01"
  );
  throws(
    () => {
      deleteObj(undefined, {
        key3: "val3",
        key4: "val4",
      });
    },
    "23.02",
    "23.02"
  );
  // wrong third argument throws:
  throws(
    () => {
      deleteObj({ a: "z" }, { b: "y" }, 1);
    },
    "23.03",
    "23.03"
  );
});

test("24 - the input is the finding (right within array)", () => {
  equal(
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
    "24.01"
  );
});

test("25 - pt1. empty object to find", () => {
  equal(
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
  equal(
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
  equal(
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
  equal(
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
});

// searching for an empty plain object, source contains various empty plain objects
// -----------------------------------------------------------------------------

test("26 - pt2. empty object to find", () => {
  equal(
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
  equal(
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
    "26.02"
  );
  equal(
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
  equal(
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
});

// searching for an empty array, source includes various empty plain objects
// -----------------------------------------------------------------------------

test("27 - pt3. empty object to find", () => {
  equal(
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
  equal(
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
  equal(
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
  equal(
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
});

test("28 - to find is undefined - throws", () => {
  throws(
    () => {
      deleteObj(
        [
          {
            key3: "val3",
            key4: "val4",
          },
        ],
        undefined
      );
    },
    "28.01",
    "28.01"
  );
});

test("29 - to find is null - throws", () => {
  throws(
    () => {
      deleteObj(
        [
          {
            key3: "val3",
            key4: "val4",
          },
        ],
        null
      );
    },
    "29.01",
    "29.01"
  );
});

test("30 - to find is string - returns input", () => {
  equal(
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
    "30.01"
  );
});

// ==============================
// Object within an array(s), strict
// ==============================

test("31 - won't delete object within an array because of strict mode", () => {
  equal(
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
    "31.01"
  );
});

test("32 - won't find multiple findings because of strict mode", () => {
  equal(
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
    "32.01"
  );
});

test("33 - strict mode: deletes some and skips some because of strict mode", () => {
  equal(
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
    "33.01"
  );
});

test("34 - won't delete object within an arrays because of strict mode", () => {
  equal(
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
    "34.01"
  );
});

// ==============================
// Non-strict recognising empty space
// ==============================

test("35 - recognises array containing only empty space - default", () => {
  equal(
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
  equal(
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
});

test("36 - recognises array containing only empty space - strict", () => {
  equal(
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
  equal(
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
});

test("37 - recognises array containing only empty space - not found", () => {
  equal(
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
    "37.01"
  );
});

test("38 - two keys in objToDelete - default", () => {
  equal(
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
    "38.01"
  );
});

test("39 - two keys in objToDelete - strict, not found", () => {
  equal(
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
  equal(
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
});

test("40 - two keys in objToDelete - strict", () => {
  equal(
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
    "40.01"
  );
});

test("41 - array with strings containing emptiness - default", () => {
  equal(
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
  equal(
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
});

test("42 - array with strings containing emptiness - strict", () => {
  equal(
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
    "42.01"
  );
});

test("43 - array with strings containing emptiness - strict found", () => {
  equal(
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
  equal(
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
});

test("44 - recognises string containing only empty space (queried array)", () => {
  equal(
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
  equal(
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
});

test("45 - recognises string containing only empty space - strict", () => {
  equal(
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
    "45.01"
  );
});

test("46 - recognises string containing only empty space - won't find", () => {
  equal(
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
    "46.01"
  );
});

test("47 - recognises string containing only empty space - won't find", () => {
  equal(
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
  equal(
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
});

test("48 - recognises a string containing only empty space (queried array with empty string)", () => {
  equal(
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
    "48.01"
  );
});

test("49 - a string containing only empty space (queried array) - strict", () => {
  equal(
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
    "49.01"
  );
});

test("50 - a string containing only empty space (queried array) - not found", () => {
  equal(
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
    "50.01"
  );
});

test("51 - recognises string containing only empty space string (queried empty string)", () => {
  equal(
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
    "51.01"
  );
});

test("52 - multiple string values in objToDelete", () => {
  equal(
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
    "52.01"
  );
});

test("53 - multiple string values in objToDelete - not found", () => {
  equal(
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
    "53.01"
  );
});

test("54 - multiple string values in objToDelete - strict", () => {
  equal(
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
    "54.01"
  );
});

test("55 - won't find, queried object with empty string value", () => {
  equal(
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
    "55.01"
  );
});

test("56 - recognises array of strings each containing only empty space (queried empty string)", () => {
  equal(
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
    "56.01"
  );
});

test("57 - recognises array with multiple strings containing emptiness", () => {
  equal(
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
    "57.01"
  );
});

test("58 - empty array finding empty string", () => {
  equal(
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
    "58.01"
  );
});

test("59 - empty string finding empty array", () => {
  equal(
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
    "59.01"
  );
});

test("60 - object deleted from an array, strict mode", () => {
  equal(
    deleteObj(
      [{ a: "a" }],
      {
        a: "a",
      },
      { matchKeysStrictly: true }
    ),
    [],
    "60.01"
  );
});

// ==============================
// Other and random tests
// ==============================

test("61 - real life situation #1", () => {
  equal(
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
    "61.01"
  );
});

test("62 - real life situation #2", () => {
  equal(
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
    "62.01"
  );
});

test("63 - real life situation #3", () => {
  equal(
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
    "63.01"
  );
});

test("64 - real life situation #4", () => {
  equal(
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
    "64.01"
  );
});

test("65 - empty strings within arrays", () => {
  equal(
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
    "65.01"
  );
  equal(
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
    "65.02"
  );
  equal(
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
    "65.03"
  );
  equal(
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
    "65.04"
  );
});

test("66 - strict mode, deletes everything", () => {
  equal(
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
  equal(
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
});

test("67 - treats holes in arrays - ast-monkey will fix them", () => {
  equal(
    deleteObj(["a", undefined, "b"], {
      x: "y",
    }),
    ["a", "b"],
    "67.01"
  );
});

// ==============================
// Testing for input arg mutation
// ==============================

test("68 - does not mutate input args", () => {
  let obj1 = {
    a: "a",
    b: "b",
  };
  let obj2 = clone(obj1);
  let unneededResult = deleteObj(obj1, obj2, { matchKeysStrictly: true });
  ok(unneededResult, "68.01"); // mock test to please linter
  equal(
    obj1,
    {
      a: "a",
      b: "b",
    },
    "68.02"
  ); // real deal
  equal(
    obj2,
    {
      a: "a",
      b: "b",
    },
    "68.03"
  ); // real deal
});

test.run();
