import tap from "tap";
import collapse from "../dist/string-collapse-white-space.esm";
import { mixer } from "./util/util";
import { cbSchema } from "../src/util";

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

tap.test(`01`, (t) => {
  mixer().forEach((opt) => {
    t.strictSame(
      collapse("a b", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      { result: "a b", ranges: null },
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`02`, (t) => {
  mixer().forEach((opt) => {
    t.strictSame(
      collapse("a  b", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      { result: "a b", ranges: [[1, 2]] },
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`03`, (t) => {
  t.strictSame(
    mixer().forEach((opt) => {
      t.strictSame(
        collapse("aaa     bbb    ccc   dddd", {
          ...opt,
          cb: ({ ...props }) => {
            t.strictSame(Object.keys(props), cbSchema);
            Object.keys(props).forEach((key) => {
              if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
                t.is(typeof props[key], "number");
              } else if (key === "suggested") {
                t.true(
                  Array.isArray(props.suggested) || props.suggested === null
                );
              } else {
                t.is(typeof props[key], "string");
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
        JSON.stringify(opt, null, 0)
      );
    })
  );
  t.end();
});

tap.test(`04 - sequences of spaces outside of string - defaults`, (t) => {
  mixer({
    trimStart: true,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse("  a b  ", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
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
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse("  a b  ", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
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
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse("  a b  ", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
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
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse("  a b  ", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
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
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`05 - sequences of spaces outside of string - defaults`, (t) => {
  mixer({
    trimStart: true,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(" a b ", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
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
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(" a b ", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "a b ",
        ranges: [[0, 1]],
      },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(" a b ", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: " a b",
        ranges: [[4, 5]],
      },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(" a b ", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: " a b ",
        ranges: null,
      },
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`06 - sequences of spaces outside of string - defaults`, (t) => {
  //
  // enforceSpacesOnly off
  // =====================

  mixer({
    trimStart: true,
    trimEnd: true,
    trimLines: false,
    // enforceSpacesOnly doesn't matter in this case
  }).forEach((opt) => {
    t.strictSame(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
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
      JSON.stringify(opt, null, 0)
    );
  });

  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "a b\t",
        ranges: [[0, 1]],
      },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "\ta b",
        ranges: [[4, 5]],
      },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "\ta b\t",
        ranges: null,
      },
      JSON.stringify(opt, null, 0)
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
    t.strictSame(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
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
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
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
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse("\ta b\t", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
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
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`07 - double inner space`, (t) => {
  mixer().forEach((opt) => {
    t.strictSame(
      collapse("a  b", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }),
      {
        result: "a b",
        ranges: [[1, 2]],
      },
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`08 - sequences of spaces outside of string - defaults`, (t) => {
  mixer().forEach((opt) => {
    t.strictSame(
      collapse("aaa     bbb    ccc   dddd", {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(typeof props[key], "number");
            } else if (key === "suggested") {
              t.true(
                Array.isArray(props.suggested) || props.suggested === null
              );
            } else {
              t.is(typeof props[key], "string");
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
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`09 - sequences of spaces outside of string - opts.trimStart`, (t) => {
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
      t.strictSame(
        collapse(`${eol} \ta b\t ${eol}`, {
          ...opt,
          cb: ({ ...props }) => {
            t.strictSame(Object.keys(props), cbSchema);
            Object.keys(props).forEach((key) => {
              if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
                t.is(typeof props[key], "number");
              } else if (key === "suggested") {
                t.true(
                  Array.isArray(props.suggested) || props.suggested === null
                );
              } else {
                t.is(typeof props[key], "string");
              }
            });
            return props.suggested;
          },
        }),
        {
          result: `${eol} \ta b\t ${eol}`,
          ranges: null,
        },
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: false,
      trimEnd: false,
      trimLines: false,
      enforceSpacesOnly: true,
    }).forEach((opt) => {
      // ". :a b: ."
      t.strictSame(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        `${eol} a b ${eol}`,
        JSON.stringify(opt, null, 0)
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
      t.strictSame(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        `${eol} \ta b`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: false,
      trimEnd: true,
      trimLines: false,
      enforceSpacesOnly: true,
    }).forEach((opt) => {
      // ". :a b: ."
      t.strictSame(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        `${eol} a b`,
        JSON.stringify(opt, null, 0)
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
      t.strictSame(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        `a b\t ${eol}`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: true,
      trimEnd: false,
      trimLines: false,
      enforceSpacesOnly: true,
    }).forEach((opt) => {
      // ". :a b: ."
      t.strictSame(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        `a b ${eol}`,
        JSON.stringify(opt, null, 0)
      );
    });

    // trims 1-1

    mixer({
      trimStart: true,
      trimEnd: true,
    }).forEach((opt) => {
      // ". :a b: ."
      t.strictSame(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        `a b`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
  t.end();
});

tap.test(`10 - sequences of line breaks`, (t) => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer({
      removeEmptyLines: false,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0, // hardcoded default
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: true,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 2,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 3,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 4,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 5,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 99,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
  t.end();
});

tap.test(`11 - sequences of line breaks`, (t) => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    mixer({
      removeEmptyLines: false,
      trimLines: false,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol} ${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: false,
      trimLines: true,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: 0, // hardcoded default
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: true,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: 2,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: 3,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: false,
      limitConsecutiveEmptyLinesTo: 4,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol} ${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: 4,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: 5,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: true,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: 99,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
  t.end();
});

tap.test(`12 - tag and linebreak chain`, (t) => {
  ["\r\n", "\r", "\n"].forEach((presentEolType) => {
    mixer().forEach((opt) => {
      t.strictSame(
        collapse(`a<br>${presentEolType}b`, opt).result,
        `a<br>${presentEolType}b`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
  t.end();
});

tap.test(`13 - tag and linebreak chain`, (t) => {
  ["\r\n", "\r", "\n"].forEach((presentEolType) => {
    mixer().forEach((opt) => {
      t.strictSame(
        collapse(`a<br>${presentEolType}b<br>${presentEolType}c`, opt).result,
        `a<br>${presentEolType}b<br>${presentEolType}c`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
  t.end();
});

tap.test(`14 - tag and linebreak chain`, (t) => {
  ["\r\n", "\r", "\n"].forEach((presentEolType) => {
    mixer().forEach((opt) => {
      t.strictSame(
        collapse(
          `a<br>${presentEolType}b<br>${presentEolType}c<br>${presentEolType}d`,
          opt
        ).result,
        `a<br>${presentEolType}b<br>${presentEolType}c<br>${presentEolType}d`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
  t.end();
});
