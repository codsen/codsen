import tap from "tap";
import { compare } from "../dist/ast-compare.esm";

const f = () => "zzz";

// (input, objToDelete, strictOrNot)

// various
// -----------------------------------------------------------------------------

tap.test("01 - null vs null", (t) => {
  t.strictSame(compare(null, null), true, "01");
  t.end();
});

tap.test("02 - real-life #1", (t) => {
  t.strictSame(
    compare(
      {
        type: "rule",
        selectors: [".w2"],
      },
      {
        type: "rule",
        selectors: [],
      }
    ),
    false,
    "02.01"
  );
  t.strictSame(
    compare(
      {
        type: "rule",
        selectors: [".w2"],
      },
      {
        type: "rule",
        selectors: [],
      },
      { hungryForWhitespace: true }
    ),
    true,
    "02.02"
  );
  t.strictSame(
    compare(
      {
        type: "rule",
        selectors: [".w2"],
      },
      {
        type: "rule",
        selectors: ["\n\n\n     \t\t\t   \n\n\n"],
      },
      { hungryForWhitespace: true }
    ),
    true,
    "02.03"
  );
  t.end();
});

tap.test("03 - real-life #2", (t) => {
  t.strictSame(
    compare(
      {
        type: "rule",
        selectors: [],
      },
      {
        type: "rule",
        selectors: [],
      }
    ),
    true,
    "03.01"
  );
  t.strictSame(
    compare(
      {
        type: "rule",
        selectors: [],
      },
      {
        type: "rule",
        selectors: [],
      },
      {
        hungryForWhitespace: false,
      }
    ),
    true,
    "03.02"
  );
  t.end();
});

tap.test("05 - real-life #3", (t) => {
  t.strictSame(
    compare(
      {
        type: "stylesheet",
        stylesheet: {
          rules: [],
          parsingErrors: [],
        },
      },
      {
        type: "stylesheet",
        stylesheet: {
          rules: [
            {
              type: "media",
              media: "(max-width: 600px)",
              rules: [
                {
                  type: "media",
                  media: "(max-width: 200px)",
                  rules: [
                    {
                      type: "rule",
                      selectors: [],
                      declarations: [
                        {
                          type: "declaration",
                          property: "font-size",
                          value: "10px !important",
                          position: {
                            start: {
                              line: 1,
                              column: 80,
                            },
                            end: {
                              line: 1,
                              column: 106,
                            },
                          },
                        },
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 61,
                        },
                        end: {
                          line: 1,
                          column: 108,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 30,
                    },
                    end: {
                      line: 1,
                      column: 111,
                    },
                  },
                },
                {
                  type: "media",
                  media: "(max-width: 100px)",
                  rules: [
                    {
                      type: "rule",
                      selectors: [],
                      declarations: [
                        {
                          type: "declaration",
                          property: "font-size",
                          value: "10px !important",
                          position: {
                            start: {
                              line: 1,
                              column: 163,
                            },
                            end: {
                              line: 1,
                              column: 189,
                            },
                          },
                        },
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 144,
                        },
                        end: {
                          line: 1,
                          column: 191,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 113,
                    },
                    end: {
                      line: 1,
                      column: 194,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 1,
                  column: 1,
                },
                end: {
                  line: 1,
                  column: 195,
                },
              },
            },
          ],
          parsingErrors: [],
        },
      }
    ),
    false,
    "05.01"
  );
  t.strictSame(
    compare(
      {
        type: "stylesheet",
        stylesheet: {
          rules: [
            {
              type: "media",
              media: "(max-width: 600px)",
              rules: [
                {
                  type: "media",
                  media: "(max-width: 200px)",
                  rules: [
                    {
                      type: "rule",
                      selectors: [],
                      declarations: [
                        {
                          type: "declaration",
                          property: "font-size",
                          value: "10px !important",
                          position: {
                            start: {
                              line: 1,
                              column: 80,
                            },
                            end: {
                              line: 1,
                              column: 106,
                            },
                          },
                        },
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 61,
                        },
                        end: {
                          line: 1,
                          column: 108,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 30,
                    },
                    end: {
                      line: 1,
                      column: 111,
                    },
                  },
                },
                {
                  type: "media",
                  media: "(max-width: 100px)",
                  rules: [
                    {
                      type: "rule",
                      selectors: [],
                      declarations: [
                        {
                          type: "declaration",
                          property: "font-size",
                          value: "10px !important",
                          position: {
                            start: {
                              line: 1,
                              column: 163,
                            },
                            end: {
                              line: 1,
                              column: 189,
                            },
                          },
                        },
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 144,
                        },
                        end: {
                          line: 1,
                          column: 191,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 113,
                    },
                    end: {
                      line: 1,
                      column: 194,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 1,
                  column: 1,
                },
                end: {
                  line: 1,
                  column: 195,
                },
              },
            },
          ],
          parsingErrors: [],
        },
      },
      {
        type: "stylesheet",
        stylesheet: {
          rules: [],
          parsingErrors: [],
        },
      },
      { hungryForWhitespace: false }
    ),
    false,
    "05.02"
  );
  t.strictSame(
    compare(
      {
        type: "stylesheet",
        stylesheet: {
          rules: [
            {
              type: "media",
              media: "(max-width: 600px)",
              rules: [
                {
                  type: "media",
                  media: "(max-width: 200px)",
                  rules: [
                    {
                      type: "rule",
                      selectors: [],
                      declarations: [
                        {
                          type: "declaration",
                          property: "font-size",
                          value: "10px !important",
                          position: {
                            start: {
                              line: 1,
                              column: 80,
                            },
                            end: {
                              line: 1,
                              column: 106,
                            },
                          },
                        },
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 61,
                        },
                        end: {
                          line: 1,
                          column: 108,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 30,
                    },
                    end: {
                      line: 1,
                      column: 111,
                    },
                  },
                },
                {
                  type: "media",
                  media: "(max-width: 100px)",
                  rules: [
                    {
                      type: "rule",
                      selectors: [],
                      declarations: [
                        {
                          type: "declaration",
                          property: "font-size",
                          value: "10px !important",
                          position: {
                            start: {
                              line: 1,
                              column: 163,
                            },
                            end: {
                              line: 1,
                              column: 189,
                            },
                          },
                        },
                      ],
                      position: {
                        start: {
                          line: 1,
                          column: 144,
                        },
                        end: {
                          line: 1,
                          column: 191,
                        },
                      },
                    },
                  ],
                  position: {
                    start: {
                      line: 1,
                      column: 113,
                    },
                    end: {
                      line: 1,
                      column: 194,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 1,
                  column: 1,
                },
                end: {
                  line: 1,
                  column: 195,
                },
              },
            },
          ],
          parsingErrors: [],
        },
      },
      {
        type: "stylesheet",
        stylesheet: {
          rules: [],
          parsingErrors: [],
        },
      },
      { hungryForWhitespace: true }
    ),
    true,
    "05.03"
  );
  t.end();
});

tap.test("06 - real-life #3 reduced case", (t) => {
  t.strictSame(
    compare(
      {
        a: "a",
        b: {
          c: [],
          d: [],
        },
      },
      {
        a: "a",
        b: {
          c: [
            {
              e: "e",
            },
          ],
          d: [],
        },
      }
    ),
    false,
    "06.01"
  );
  t.strictSame(
    compare(
      {
        a: "a",
        b: {
          c: [
            {
              e: "e",
            },
          ],
          d: [],
        },
      },
      {
        a: "a",
        b: {
          c: [],
          d: [],
        },
      }
    ),
    false,
    "06.02"
  );
  t.strictSame(
    compare(
      {
        a: "a",
        b: {
          c: [],
          d: [],
        },
      },
      {
        a: "a",
        b: {
          c: [
            {
              e: "e",
            },
          ],
          d: [],
        },
      },
      { hungryForWhitespace: true }
    ),
    false,
    "06.03"
  );
  t.strictSame(
    compare(
      {
        a: "a",
        b: {
          c: [
            {
              e: "e",
            },
          ],
          d: [],
        },
      },
      {
        a: "a",
        b: {
          c: [],
          d: [],
        },
      },
      { hungryForWhitespace: true }
    ),
    true,
    "06.04"
  );
  t.end();
});

tap.test("07 - input args of mismatching type - easy win", (t) => {
  t.strictSame(
    compare(
      {
        a: "a",
      },
      "a"
    ),
    false,
    "07.01"
  );
  t.strictSame(
    compare("a", {
      a: "a",
    }),
    false,
    "07.02"
  );
  t.strictSame(
    compare(
      {
        a: "a",
      },
      ["a"]
    ),
    false,
    "07.03"
  );
  t.strictSame(
    compare(["a"], {
      a: "a",
    }),
    false,
    "07.04"
  );
  t.strictSame(
    compare(
      {
        a: "a",
      },
      "a",
      { hungryForWhitespace: true }
    ),
    false,
    "07.05"
  );
  t.strictSame(
    compare(
      "a",
      {
        a: "a",
      },
      { hungryForWhitespace: true }
    ),
    false,
    "07.06"
  );
  t.strictSame(
    compare(
      {
        a: "a",
      },
      ["a"],
      { hungryForWhitespace: true }
    ),
    false,
    "07.07"
  );
  t.strictSame(
    compare(
      ["a"],
      {
        a: "a",
      },
      { hungryForWhitespace: true }
    ),
    false,
    "07.08"
  );
  t.end();
});
