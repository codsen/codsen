// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { cbSchema, collapse } from "../dist/string-collapse-white-space.esm.js";
import { mixer } from "./util/util.js";

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test("01", () => {
  mixer().forEach((opt) => {
    equal(
      collapse("a b", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "01.02");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      { result: "a b", ranges: null },
      `01.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("02", () => {
  mixer().forEach((opt) => {
    equal(
      collapse("a  b", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "02.02");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      { result: "a b", ranges: [[1, 2]] },
      `02.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("03", () => {
  equal(
    mixer().forEach((opt) => {
      equal(
        collapse("aaa     bbb    ccc   dddd", {
          ...opt,
          cb: ({ ...props }) => {
            equal(Object.keys(props), cbSchema, "03.03");
            Object.keys(props).forEach((key) => {
              if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
                is(typeof props[key], "number");
              } else if (key === "suggested") {
                ok(Array.isArray(props.suggested) || props.suggested === null);
              } else {
                is(typeof props[key], "string");
              }
            });
            return props.suggested;
          },
        }),
        {
          result: "aaa bbb ccc dddd",
          ranges: [
            [3, 7],
            [11, 14],
            [18, 20],
          ],
        },
        `03.02 - ${JSON.stringify(opt, null, 0)}`,
      );
    }),
    undefined,
    "03.01",
  );
});

test("04 - sequences of spaces outside of string - defaults", () => {
  mixer({
    trimStart: true,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse("  a b  ", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "04.02");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "a b",
        ranges: [
          [0, 2],
          [5, 7],
        ],
      },
      `04.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse("  a b  ", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "04.04");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: " a b",
        ranges: [
          [0, 1],
          [5, 7],
        ],
      },
      `04.03 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse("  a b  ", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "04.06");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "a b ",
        ranges: [
          [0, 2],
          [5, 6],
        ],
      },
      `04.05 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse("  a b  ", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "04.08");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: " a b ",
        ranges: [
          [0, 1],
          [5, 6],
        ],
      },
      `04.07 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("05 - sequences of spaces outside of string - defaults", () => {
  mixer({
    trimStart: true,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse(" a b ", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "05.02");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "a b",
        ranges: [
          [0, 1],
          [4, 5],
        ],
      },
      `05.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse(" a b ", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "05.04");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "a b ",
        ranges: [[0, 1]],
      },
      `05.03 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse(" a b ", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "05.06");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: " a b",
        ranges: [[4, 5]],
      },
      `05.05 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse(" a b ", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "05.08");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: " a b ",
        ranges: null,
      },
      `05.07 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("06 - sequences of spaces outside of string - defaults", () => {
  //
  // enforceSpacesOnly off
  // =====================

  mixer({
    trimStart: true,
    trimEnd: true,
    trimLines: false,
    // enforceSpacesOnly doesn't matter in this case
  }).forEach((opt) => {
    equal(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "06.02");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "a b",
        ranges: [
          [0, 1],
          [4, 5],
        ],
      },
      `06.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });

  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "06.04");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "a b\t",
        ranges: [[0, 1]],
      },
      `06.03 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "06.06");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "\ta b",
        ranges: [[4, 5]],
      },
      `06.05 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "06.08");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "\ta b\t",
        ranges: null,
      },
      `06.07 - ${JSON.stringify(opt, null, 0)}`,
    );
  });

  //
  // enforceSpacesOnly on
  // ====================

  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "06.10");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "a b ",
        ranges: [
          [0, 1],
          [4, 5, " "],
        ],
      },
      `06.09 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "06.12");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: " a b",
        ranges: [
          [0, 1, " "],
          [4, 5],
        ],
      },
      `06.11 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "06.14");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: " a b ",
        ranges: [
          [0, 1, " "],
          [4, 5, " "],
        ],
      },
      `06.13 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("07 - double inner space", () => {
  mixer().forEach((opt) => {
    equal(
      collapse("a  b", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "07.02");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "a b",
        ranges: [[1, 2]],
      },
      `07.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("08 - sequences of spaces outside of string - defaults", () => {
  mixer().forEach((opt) => {
    equal(
      collapse("aaa     bbb    ccc   dddd", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema, "08.02");
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(typeof props[key], "number");
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "aaa bbb ccc dddd",
        ranges: [
          [3, 7],
          [11, 14],
          [18, 20],
        ],
      },
      `08.01 - ${JSON.stringify(opt, null, 0)}`,
    );
  });
});

test("09 - sequences of spaces outside of string - opts.trimStart", () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    //
    // trims 0-0

    mixer({
      trimStart: false,
      trimEnd: false,
      trimLines: false,
      enforceSpacesOnly: false,
    }).forEach((opt) => {
      // ". :a b: ."
      equal(
        collapse(`${eol} \ta b\t ${eol}`, {
          ...opt,
          cb: ({ ...props }) => {
            equal(Object.keys(props), cbSchema, "09.02");
            Object.keys(props).forEach((key) => {
              if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
                is(typeof props[key], "number");
              } else if (key === "suggested") {
                ok(Array.isArray(props.suggested) || props.suggested === null);
              } else {
                is(typeof props[key], "string");
              }
            });
            return props.suggested;
          },
        }),
        {
          result: `${eol} \ta b\t ${eol}`,
          ranges: null,
        },
        `09.01 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      trimStart: false,
      trimEnd: false,
      trimLines: false,
      enforceSpacesOnly: true,
    }).forEach((opt) => {
      // ". :a b: ."
      equal(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        `${eol} a b ${eol}`,
        `09.03 - ${JSON.stringify(opt, null, 0)}`,
      );
    });

    // trims 0-1

    mixer({
      trimStart: false,
      trimEnd: true,
      trimLines: false,
      enforceSpacesOnly: false,
    }).forEach((opt) => {
      // ". :a b: ."
      equal(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        `${eol} \ta b`,
        `09.04 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      trimStart: false,
      trimEnd: true,
      trimLines: false,
      enforceSpacesOnly: true,
    }).forEach((opt) => {
      // ". :a b: ."
      equal(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        `${eol} a b`,
        `09.05 - ${JSON.stringify(opt, null, 0)}`,
      );
    });

    // trims 1-0

    mixer({
      trimStart: true,
      trimEnd: false,
      trimLines: false,
      enforceSpacesOnly: false,
    }).forEach((opt) => {
      // ". :a b: ."
      equal(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        `a b\t ${eol}`,
        `09.06 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      trimStart: true,
      trimEnd: false,
      trimLines: false,
      enforceSpacesOnly: true,
    }).forEach((opt) => {
      // ". :a b: ."
      equal(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        `a b ${eol}`,
        `09.07 - ${JSON.stringify(opt, null, 0)}`,
      );
    });

    // trims 1-1

    mixer({
      trimStart: true,
      trimEnd: true,
    }).forEach((opt) => {
      // ". :a b: ."
      equal(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        "a b",
        `09.08 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
  });
});

test("10 - sequences of line breaks", () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer({
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        `10.01 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}d`,
        `10.02 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0, // hardcoded default
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}d`,
        `10.03 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: true,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}d`,
        `10.04 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 2,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}d`,
        `10.05 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 3,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}d`,
        `10.06 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 4,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        `10.07 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 5,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        `10.08 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 99,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        `10.09 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
  });
});

test("11 - sequences of line breaks", () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer({
      removeEmptyLines: false,
      trimLines: false,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol} ${eol}${eol}${eol}${eol}d`,
        `11.01 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: false,
      trimLines: true,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        `11.02 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}d`,
        `11.03 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: 0, // hardcoded default
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}d`,
        `11.04 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: true,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}d`,
        `11.05 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: 2,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}${eol}d`,
        `11.06 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: 3,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}d`,
        `11.07 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: false,
      limitConsecutiveEmptyLinesTo: 4,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol} ${eol}${eol}${eol}${eol}d`,
        `11.08 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: 4,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        `11.09 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: 5,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        `11.10 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: 99,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        `11.11 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
  });
});

test("12 - tag and linebreak chain", () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType) => {
    mixer().forEach((opt) => {
      equal(
        collapse(`a<br>${presentEolType}b`, opt).result,
        `a<br>${presentEolType}b`,
        `12.01 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
  });
});

test("13 - tag and linebreak chain", () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType) => {
    mixer().forEach((opt) => {
      equal(
        collapse(`a<br>${presentEolType}b<br>${presentEolType}c`, opt).result,
        `a<br>${presentEolType}b<br>${presentEolType}c`,
        `13.01 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
  });
});

test("14 - tag and linebreak chain", () => {
  ["\r\n", "\r", "\n"].forEach((presentEolType) => {
    mixer().forEach((opt) => {
      equal(
        collapse(
          `a<br>${presentEolType}b<br>${presentEolType}c<br>${presentEolType}d`,
          opt,
        ).result,
        `a<br>${presentEolType}b<br>${presentEolType}c<br>${presentEolType}d`,
        `14.01 - ${JSON.stringify(opt, null, 0)}`,
      );
    });
  });
});

test.run();
