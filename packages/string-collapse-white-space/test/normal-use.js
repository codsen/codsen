import tap from "tap";
import collapse from "../dist/string-collapse-white-space.esm";
import { mixer, allCombinations } from "./util/util";
import { cbSchema } from "../src/util";

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

tap.test(`01 - simple sequences of spaces within string`, (t) => {
  allCombinations.forEach((opt) => {
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

tap.test(`02 - simple sequences of spaces within string`, (t) => {
  allCombinations.forEach((opt) => {
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

tap.test(`03 - simple sequences of spaces within string`, (t) => {
  t.strictSame(
    allCombinations.forEach((opt) => {
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
    trimStart: 1,
    trimEnd: 1,
    trimLines: 0,
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
    trimStart: 0,
    trimEnd: 1,
    trimLines: 0,
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
    trimStart: 1,
    trimEnd: 0,
    trimLines: 0,
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
    trimStart: 0,
    trimEnd: 0,
    trimLines: 0,
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
    trimStart: 1,
    trimEnd: 1,
    trimLines: 0,
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
    trimStart: 1,
    trimEnd: 0,
    trimLines: 0,
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
    trimStart: 0,
    trimEnd: 1,
    trimLines: 0,
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
    trimStart: 0,
    trimEnd: 0,
    trimLines: 0,
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
    trimStart: 1,
    trimEnd: 1,
    trimLines: 0,
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
    trimStart: 1,
    trimEnd: 0,
    trimLines: 0,
    enforceSpacesOnly: 0,
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
    trimStart: 0,
    trimEnd: 1,
    trimLines: 0,
    enforceSpacesOnly: 0,
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
    trimStart: 0,
    trimEnd: 0,
    trimLines: 0,
    enforceSpacesOnly: 0,
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
    trimStart: 1,
    trimEnd: 0,
    trimLines: 0,
    enforceSpacesOnly: 1,
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
    trimStart: 0,
    trimEnd: 1,
    trimLines: 0,
    enforceSpacesOnly: 1,
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
    trimStart: 0,
    trimEnd: 0,
    trimLines: 0,
    enforceSpacesOnly: 1,
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
  allCombinations.forEach((opt) => {
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
  allCombinations.forEach((opt) => {
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
      trimStart: 0,
      trimEnd: 0,
      trimLines: 0,
      enforceSpacesOnly: 0,
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
      trimStart: 0,
      trimEnd: 0,
      trimLines: 0,
      enforceSpacesOnly: 1,
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
      trimStart: 0,
      trimEnd: 1,
      trimLines: 0,
      enforceSpacesOnly: 0,
    }).forEach((opt) => {
      // ". :a b: ."
      t.strictSame(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        `${eol} \ta b`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: 0,
      trimEnd: 1,
      trimLines: 0,
      enforceSpacesOnly: 1,
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
      trimStart: 1,
      trimEnd: 0,
      trimLines: 0,
      enforceSpacesOnly: 0,
    }).forEach((opt) => {
      // ". :a b: ."
      t.strictSame(
        collapse(`${eol} \ta b\t ${eol}`, opt).result,
        `a b\t ${eol}`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: 1,
      trimEnd: 0,
      trimLines: 0,
      enforceSpacesOnly: 1,
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
      trimStart: 1,
      trimEnd: 1,
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
      removeEmptyLines: 0,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: 1,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: 1,
      limitConsecutiveEmptyLinesTo: 0, // hardcoded default
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: 1,
      limitConsecutiveEmptyLinesTo: 1,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: 1,
      limitConsecutiveEmptyLinesTo: 2,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: 1,
      limitConsecutiveEmptyLinesTo: 3,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: 1,
      limitConsecutiveEmptyLinesTo: 4,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: 1,
      limitConsecutiveEmptyLinesTo: 5,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`, opt).result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: 1,
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
      removeEmptyLines: 0,
      trimLines: 0,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol} ${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: 0,
      trimLines: 1,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}${eol}${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: 1,
      trimLines: 1,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: 1,
      trimLines: 1,
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
      removeEmptyLines: 1,
      trimLines: 1,
      limitConsecutiveEmptyLinesTo: 1,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`a${eol}b${eol}c${eol}   ${eol}${eol}${eol}${eol}d`, opt)
          .result,
        `a${eol}b${eol}c${eol}${eol}d`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      removeEmptyLines: 1,
      trimLines: 1,
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
      removeEmptyLines: 1,
      trimLines: 1,
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
      removeEmptyLines: 1,
      trimLines: 0,
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
      removeEmptyLines: 1,
      trimLines: 1,
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
      removeEmptyLines: 1,
      trimLines: 1,
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
      removeEmptyLines: 1,
      trimLines: 1,
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
    allCombinations.forEach((opt) => {
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
    allCombinations.forEach((opt) => {
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
    allCombinations.forEach((opt) => {
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
