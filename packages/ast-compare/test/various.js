import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../dist/ast-compare.esm.js";

// (input, objToDelete, strictOrNot)

// various
// -----------------------------------------------------------------------------

test("01 - null vs null", () => {
  equal(compare(null, null), true, "01");
});

test("02 - real-life #1", () => {
  equal(
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
  equal(
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
  equal(
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
});

test("03 - real-life #2", () => {
  equal(
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
  equal(
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
});

test("04 - real-life #3", () => {
  equal(
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
    "04.01"
  );
  equal(
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
    "04.02"
  );
  equal(
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
    "04.03"
  );
});

test("05 - real-life #3 reduced case", () => {
  equal(
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
    "05.01"
  );
  equal(
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
    "05.02"
  );
  equal(
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
    "05.03"
  );
  equal(
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
    "05.04"
  );
});

test("06 - input args of mismatching type - easy win", () => {
  equal(
    compare(
      {
        a: "a",
      },
      "a"
    ),
    false,
    "06.01"
  );
  equal(
    compare("a", {
      a: "a",
    }),
    false,
    "06.02"
  );
  equal(
    compare(
      {
        a: "a",
      },
      ["a"]
    ),
    false,
    "06.03"
  );
  equal(
    compare(["a"], {
      a: "a",
    }),
    false,
    "06.04"
  );
  equal(
    compare(
      {
        a: "a",
      },
      "a",
      { hungryForWhitespace: true }
    ),
    false,
    "06.05"
  );
  equal(
    compare(
      "a",
      {
        a: "a",
      },
      { hungryForWhitespace: true }
    ),
    false,
    "06.06"
  );
  equal(
    compare(
      {
        a: "a",
      },
      ["a"],
      { hungryForWhitespace: true }
    ),
    false,
    "06.07"
  );
  equal(
    compare(
      ["a"],
      {
        a: "a",
      },
      { hungryForWhitespace: true }
    ),
    false,
    "06.08"
  );
});

test.run();
