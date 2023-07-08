import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collapse, cbSchema } from "../dist/string-collapse-white-space.esm.js";
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
    );
  });
});

test("02", () => {
  mixer().forEach((opt) => {
    equal(
      collapse("a  b", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
            equal(Object.keys(props), cbSchema);
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
        JSON.stringify(opt, null, 0),
      );
    }),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
    );
  });
});

test("07 - double inner space", () => {
  mixer().forEach((opt) => {
    equal(
      collapse("a  b", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
    );
  });
});

test("08 - sequences of spaces outside of string - defaults", () => {
  mixer().forEach((opt) => {
    equal(
      collapse("aaa     bbb    ccc   dddd", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema);
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
      JSON.stringify(opt, null, 0),
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
            equal(Object.keys(props), cbSchema);
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
      );
    });
    mixer({
      removeEmptyLines: true,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}d`,
        JSON.stringify(opt, null, 0),
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0, // hardcoded default
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}d`,
        JSON.stringify(opt, null, 0),
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: true,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}d`,
        JSON.stringify(opt, null, 0),
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 2,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0),
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 3,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0),
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 4,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0),
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 5,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0),
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 99,
    }).forEach((opt) => {
      equal(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
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
        JSON.stringify(opt, null, 0),
      );
    });
  });
});

test.run();
