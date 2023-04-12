import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { collapse, cbSchema } from "../dist/string-collapse-white-space.esm.js";
import { mixer } from "./util/util.js";

// More tests on trimming, targetting algorithm's weakest spots
// -----------------------------------------------------------------------------

test("01 - trimming mixed lumps of trimmable characters", () => {
  // "ttt   tttaaattt   ttt"

  /// //////////              trimLines = off

  // enforceSpacesOnly=off
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false, // <---
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t   \t\t\taaa\t\t\t   \t\t\t", {
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
      }).result,
      "\t\t\t \t\t\taaa\t\t\t \t\t\t",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
    enforceSpacesOnly: false, // <---
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t   \t\t\taaa\t\t\t   \t\t\t", {
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
      }).result,
      "\t\t\t \t\t\taaa",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false, // <---
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t   \t\t\taaa\t\t\t   \t\t\t", {
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
      }).result,
      "aaa\t\t\t \t\t\t",
      JSON.stringify(opt, null, 0)
    );
  });

  // enforceSpacesOnly=on
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true, // <---
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t   \t\t\taaa\t\t\t   \t\t\t", {
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
      }).result,
      " aaa ",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
    enforceSpacesOnly: true, // <---
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t   \t\t\taaa\t\t\t   \t\t\t", {
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
      }).result,
      " aaa",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true, // <---
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t   \t\t\taaa\t\t\t   \t\t\t", {
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
      }).result,
      "aaa ",
      JSON.stringify(opt, null, 0)
    );
  });

  mixer({
    trimStart: true,
    trimEnd: true,
    trimLines: false,
    // enforceSpacesOnly doesn't matter now
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t   \t\t\taaa\t\t\t   \t\t\t", {
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
      }).result,
      "aaa",
      JSON.stringify(opt, null, 0)
    );
  });

  /// //////////              trimLines = on

  mixer({
    trimLines: true,
    // all other settings are irrelevant
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t   \t\t\taaa\t\t\t   \t\t\t", {
        ...opt,
        cb: ({ ...props }) => {
          equal(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              is(
                typeof props[key],
                "number",
                `props: ${JSON.stringify(
                  props[key],
                  null,
                  4
                )}; opt: ${JSON.stringify(opt, null, 4)}`
              );
            } else if (key === "suggested") {
              ok(Array.isArray(props.suggested) || props.suggested === null);
            } else {
              is(typeof props[key], "string");
            }
          });
          return props.suggested;
        },
      }).result,
      "aaa",
      JSON.stringify(opt, null, 0)
    );
  });
});

test("02", () => {
  equal(
    collapse("\t\t\t   \t\t\taaa\t\t\t   \t\t\t", {
      trimStart: false,
      trimEnd: false,
      trimnbsp: false,
      removeEmptyLines: false,
      enforceSpacesOnly: false,
      trimLines: true,
      limitConsecutiveEmptyLinesTo: 0,
      cb: ({ ...props }) => {
        // console.log(
        //   `${`\u001b[${33}m${`props`}\u001b[${39}m`} = ${JSON.stringify(
        //     props,
        //     null,
        //     4
        //   )}`
        // );
        return props.suggested;
      },
    }).result,
    "aaa",
    "02.01"
  );
});

test("03 - trimming mixed lumps of trimmable characters", () => {
  // "   ttt   aaa   ttt   "

  /// //////////              trimLines = off

  // enforceSpacesOnly=off

  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("   \t\t\t   aaa   \t\t\t   ", {
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
      }).result,
      " \t\t\t aaa \t\t\t ",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("   \t\t\t   aaa   \t\t\t   ", {
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
      }).result,
      " \t\t\t aaa",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("   \t\t\t   aaa   \t\t\t   ", {
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
      }).result,
      "aaa \t\t\t ",
      JSON.stringify(opt, null, 0)
    );
  });

  // enforceSpacesOnly=on

  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("   \t\t\t   aaa   \t\t\t   ", {
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
      }).result,
      " aaa ",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("   \t\t\t   aaa   \t\t\t   ", {
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
      }).result,
      " aaa",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("   \t\t\t   aaa   \t\t\t   ", {
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
      }).result,
      "aaa ",
      JSON.stringify(opt, null, 0)
    );
  });

  mixer({
    trimStart: true,
    trimEnd: true,
  }).forEach((opt) => {
    equal(
      collapse("   \t\t\t   aaa   \t\t\t   ", {
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
      }).result,
      "aaa",
      JSON.stringify(opt, null, 0)
    );
  });

  /// //////////              trimLines = on

  mixer({
    trimLines: true,
  }).forEach((opt) => {
    equal(
      collapse("   \t\t\t   aaa   \t\t\t   ", {
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
      }).result,
      "aaa",
      JSON.stringify(opt, null, 0)
    );
  });
});

test("04 - trimming mixed lumps of trimmable characters", () => {
  // "   t t t   aaa   t t t   "

  /// //////////              trimLines = off

  // enforceSpacesOnly=off

  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("   \t \t \t   aaa   \t \t \t   ", {
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
      }).result,
      " \t \t \t aaa \t \t \t ",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("   \t \t \t   aaa   \t \t \t   ", {
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
      }).result,
      " \t \t \t aaa",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("   \t \t \t   aaa   \t \t \t   ", {
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
      }).result,
      "aaa \t \t \t ",
      JSON.stringify(opt, null, 0)
    );
  });

  // enforceSpacesOnly=on

  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("   \t \t \t   aaa   \t \t \t   ", {
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
      }).result,
      " aaa ",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("   \t \t \t   aaa   \t \t \t   ", {
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
      }).result,
      " aaa",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("   \t \t \t   aaa   \t \t \t   ", {
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
      }).result,
      "aaa ",
      JSON.stringify(opt, null, 0)
    );
  });

  mixer({
    trimStart: true,
    trimEnd: true,
  }).forEach((opt) => {
    equal(
      collapse("   \t \t \t   aaa   \t \t \t   ", {
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
      }).result,
      "aaa",
      JSON.stringify(opt, null, 0)
    );
  });

  /// //////////              trimLines = on

  mixer({
    trimLines: true,
  }).forEach((opt) => {
    equal(
      collapse("   \t \t \t   aaa   \t \t \t   ", {
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
      }).result,
      "aaa",
      JSON.stringify(opt, null, 0)
    );
  });
});

test("05 - trimming mixed lumps of trimmable characters, removeEmptyLines=false", () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    /// //////////              trimLines = off

    // enforceSpacesOnly=off

    mixer({
      trimStart: false,
      trimEnd: false,
      trimLines: false,
      enforceSpacesOnly: false,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: true,
      trimEnd: false,
      trimLines: false,
      enforceSpacesOnly: false,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        `aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: false,
      trimEnd: true,
      trimLines: false,
      enforceSpacesOnly: false,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        `\t ${eol} \t \r ${eol}aaa`,
        JSON.stringify(opt, null, 0)
      );
    });

    mixer({
      trimStart: true,
      trimEnd: true,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        "aaa",
        JSON.stringify(opt, null, 0)
      );
    });

    // enforceSpacesOnly=on

    mixer({
      trimStart: false,
      trimEnd: false,
      trimLines: false,
      enforceSpacesOnly: true,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        ` ${eol} \r ${eol}aaa \n ${eol} ${eol} \r\n \n`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: true,
      trimEnd: false,
      trimLines: false,
      enforceSpacesOnly: true,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        `aaa \n ${eol} ${eol} \r\n \n`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: false,
      trimEnd: true,
      trimLines: false,
      enforceSpacesOnly: true,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        ` ${eol} \r ${eol}aaa`,
        JSON.stringify(opt, null, 0)
      );
    });

    /// //////////              trimLines = on

    // enforceSpacesOnly=off

    mixer({
      trimStart: false,
      trimEnd: false,
      trimLines: true,
      enforceSpacesOnly: false,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        `${eol}\r${eol}aaa\n${eol}${eol}\r\n\n`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: true,
      trimEnd: false,
      trimLines: true,
      enforceSpacesOnly: false,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        `aaa\n${eol}${eol}\r\n\n`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: false,
      trimEnd: true,
      trimLines: true,
      enforceSpacesOnly: false,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        `${eol}\r${eol}aaa`,
        JSON.stringify(opt, null, 0)
      );
    });

    mixer({
      trimStart: true,
      trimEnd: true,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        "aaa",
        JSON.stringify(opt, null, 0)
      );
    });

    // enforceSpacesOnly=on

    mixer({
      trimStart: false,
      trimEnd: false,
      trimLines: true,
      enforceSpacesOnly: true,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        `${eol}\r${eol}aaa\n${eol}${eol}\r\n\n`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: true,
      trimEnd: false,
      trimLines: true,
      enforceSpacesOnly: true,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        `aaa\n${eol}${eol}\r\n\n`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: false,
      trimEnd: true,
      trimLines: true,
      enforceSpacesOnly: true,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(
          `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
          opt
        ).result,
        `${eol}\r${eol}aaa`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
});

test("06", () => {
  equal(collapse("      "), { result: "", ranges: [[0, 6]] }, "06.01");
  mixer({
    trimStart: true,
  }).forEach((opt) => {
    equal(
      collapse("      ", {
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
      }).result,
      "",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimEnd: true,
  }).forEach((opt) => {
    equal(
      collapse("      ", {
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
      }).result,
      "",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimLines: true,
  }).forEach((opt) => {
    equal(
      collapse("      ", {
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
      }).result,
      "",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    equal(
      collapse("      ", {
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
      }).result,
      " ",
      JSON.stringify(opt, null, 0)
    );
  });
});

test("07", () => {
  // "ttt   ttt"
  mixer({
    trimStart: true,
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t   \t\t\t", {
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
      { result: "", ranges: [[0, 9]] },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimEnd: true,
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t   \t\t\t", {
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
      { result: "", ranges: [[0, 9]] },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimLines: true,
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t   \t\t\t", {
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
      { result: "", ranges: [[0, 9]] },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t   \t\t\t", {
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
      { result: "\t\t\t \t\t\t", ranges: [[3, 5]] },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t   \t\t\t", {
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
      { result: " ", ranges: [[0, 9, " "]] },
      JSON.stringify(opt, null, 0)
    );
  });
});

test("08", () => {
  // "ttt"
  mixer({
    trimStart: true,
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t", {
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
      { result: "", ranges: [[0, 3]] },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimEnd: true,
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t", {
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
      { result: "", ranges: [[0, 3]] },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimLines: true,
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t", {
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
      { result: "", ranges: [[0, 3]] },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t", {
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
      { result: "\t\t\t", ranges: null },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("\t\t\t", {
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
      { result: " ", ranges: [[0, 3, " "]] },
      JSON.stringify(opt, null, 0)
    );
  });
});

test("09", () => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    // removeEmptyLines=off
    mixer({
      trimStart: true,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(`${eol}${eol}${eol}`, {
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
        }).result,
        "",
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimEnd: true,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(`${eol}${eol}${eol}`, {
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
        }).result,
        "",
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: false,
    }).forEach((opt) => {
      equal(
        collapse(`${eol}${eol}${eol}`, {
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
        }).result,
        `${eol}${eol}${eol}`,
        JSON.stringify(opt, null, 0)
      );
    });

    // removeEmptyLines=on
    mixer({
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 0, // default
    }).forEach((opt) => {
      equal(
        collapse(`${eol}${eol}${eol}`, {
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
        }).result,
        `${eol}`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: true,
    }).forEach((opt) => {
      equal(
        collapse(`${eol}${eol}${eol}`, {
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
        }).result,
        `${eol}${eol}`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 2,
    }).forEach((opt) => {
      equal(
        collapse(`${eol}${eol}${eol}`, {
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
        }).result,
        `${eol}${eol}${eol}`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 3,
    }).forEach((opt) => {
      equal(
        collapse(`${eol}${eol}${eol}`, {
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
        }).result,
        `${eol}${eol}${eol}`,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 99,
    }).forEach((opt) => {
      equal(
        collapse(`${eol}${eol}${eol}`, {
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
        }).result,
        `${eol}${eol}${eol}`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
});

test("10", () => {
  equal(
    collapse("\r\n\r\n\r\n\r\n\r\n\n\n\n\n\n\n", {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: true,
    }).result,
    "\r\n\r\n",
    "10.01"
  );
  equal(
    collapse("\r\n\r\n\r\n\r\n\r\n\n\n\n\n\n\n", {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 2,
    }).result,
    "\r\n\r\n\r\n",
    "10.02"
  );
});

test("11 - trim involving non-breaking spaces", () => {
  // ".   a   ."
  mixer({
    trimStart: true,
    trimEnd: true,
    trimnbsp: true,
  }).forEach((opt) => {
    equal(
      collapse("\xa0   a   \xa0", {
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
      }).result,
      "a",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimLines: true,
    trimnbsp: true,
  }).forEach((opt) => {
    equal(
      collapse("\xa0   a   \xa0", {
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
      }).result,
      "a",
      JSON.stringify(opt, null, 0)
    );
  });

  mixer({
    trimnbsp: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("\xa0   a   \xa0", {
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
      }).result,
      "\xa0 a \xa0",
      JSON.stringify(opt, null, 0)
    );
  });

  mixer({
    trimStart: false,
    trimEnd: false,
    trimnbsp: false,
    trimLines: false, // <---
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("\xa0   a   \xa0", {
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
      }).result,
      " a ",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimnbsp: false,
    trimLines: true, // <---
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("\xa0   a   \xa0", {
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
      }).result,
      "a",
      JSON.stringify(opt, null, 0)
    );
  });
});

test("12", () => {
  equal(
    collapse("\xa0   a   \xa0", {
      trimStart: true,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    "a ",
    "12.01"
  );
});

test("13", () => {
  // ".   a   ."
  equal(
    collapse("\xa0   a   \xa0", {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: true,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    "a",
    "13.01"
  );
});

test("14", () => {
  // ".   a   ."
  equal(
    collapse("\xa0   a   \xa0", {
      trimStart: true,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    "a ",
    "14.01"
  );
});

test("15", () => {
  // ".   a   ."
  equal(
    collapse("\xa0   a   \xa0", {
      trimStart: false,
      trimEnd: true,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    " a",
    "15.01"
  );
});

test("16", () => {
  // ".   a   ."
  equal(
    collapse("\xa0a\xa0", {
      trimStart: true,
      trimEnd: true,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    "a",
    "16.01"
  );
});

test("17", () => {
  // "   .a.   "
  equal(
    collapse("   \xa0a\xa0   ", {
      trimStart: true,
      trimEnd: true,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    "a",
    "17.01"
  );
});

test("18", () => {
  equal(
    collapse("\xa0   a   \xa0", {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: true,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    "a",
    "18.01"
  );
});

test("19", () => {
  // "   .a.   "
  equal(
    collapse("   \xa0a\xa0   ", {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: true,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    "a",
    "19.01"
  );
});

test("20", () => {
  equal(
    collapse("\xa0\na\n\xa0", {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    " \na\n ",
    "20.01"
  );
  equal(
    collapse("\t\na\n\t", {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    " \na\n ",
    "20.02"
  );
});

test("21", () => {
  equal(
    collapse("\xa0\t\xa0a\xa0\t\xa0b\xa0\t\xa0", {
      trimStart: false,
      trimEnd: false,
      trimLines: false,
      trimnbsp: false,
      enforceSpacesOnly: true,
    }).result,
    " a b ",
    "21.01"
  );
});

test("22 - trim involving non-breaking spaces", () => {
  // ".   .   a   .   ."
  equal(
    collapse("\xa0   \xa0   a   \xa0   \xa0"),
    {
      result: "\xa0 \xa0 a \xa0 \xa0",
      ranges: [
        [1, 3],
        [5, 7],
        [9, 11],
        [13, 15],
      ],
    },
    "22.01"
  );
});

test("23 - trim involving non-breaking spaces", () => {
  // ".   .   a   .   ."
  equal(
    collapse("\xa0   \xa0   a   \xa0   \xa0", { trimnbsp: true }),
    {
      result: "a",
      ranges: [
        [0, 8],
        [9, 17],
      ],
    },
    "23.01"
  );
});

test("24 - trim involving non-breaking spaces", () => {
  // "    .     a     .      "
  equal(
    collapse("    \xa0     a     \xa0      "),
    {
      result: "\xa0 a \xa0",
      ranges: [
        [0, 4],
        [5, 9],
        [11, 15],
        [17, 23],
      ],
    },
    "24.01"
  );
});

test("25 - trim involving non-breaking spaces", () => {
  equal(
    collapse(" \xa0 ", {
      trimStart: false,
      trimEnd: false,
    }).result,
    " \xa0 ",
    "25.01"
  );
});

test("26 - trim involving non-breaking spaces", () => {
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    equal(
      collapse("  \xa0  ", {
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
      }).result,
      " \xa0 ",
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    equal(
      collapse("  \xa0  ", {
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
      }).result,
      " ",
      JSON.stringify(opt, null, 0)
    );
  });
});

test("27 - bracket", () => {
  mixer().forEach((opt) => {
    equal(
      collapse("a > b", {
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
      }).result,
      "a > b",
      "27.01"
    );
  });
});

test("28 - bracket", () => {
  mixer().forEach((opt) => {
    equal(
      collapse("<span>zzz</span> abc def ghij klm", {
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
      }).result,
      "<span>zzz</span> abc def ghij klm",
      "28.01"
    );
  });
});

test.run();
