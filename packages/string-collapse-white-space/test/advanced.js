import tap from "tap";
import { collapse, cbSchema } from "../dist/string-collapse-white-space.esm";
import { mixer } from "./util/util";

// More tests on trimming, targetting algorithm's weakest spots
// -----------------------------------------------------------------------------

tap.test(`01 - trimming mixed lumps of trimmable characters`, (t) => {
  // "ttt   tttaaattt   ttt"

  /// //////////              trimLines = off

  // enforceSpacesOnly=off
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false, // <---
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\t\t\t   \t\t\taaa\t\t\t   \t\t\t`, {
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
      }).result,
      `\t\t\t \t\t\taaa\t\t\t \t\t\t`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
    enforceSpacesOnly: false, // <---
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\t\t\t   \t\t\taaa\t\t\t   \t\t\t`, {
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
      }).result,
      `\t\t\t \t\t\taaa`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false, // <---
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\t\t\t   \t\t\taaa\t\t\t   \t\t\t`, {
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
      }).result,
      `aaa\t\t\t \t\t\t`,
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
    t.strictSame(
      collapse(`\t\t\t   \t\t\taaa\t\t\t   \t\t\t`, {
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
      }).result,
      ` aaa `,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: true,
    trimLines: false,
    enforceSpacesOnly: true, // <---
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\t\t\t   \t\t\taaa\t\t\t   \t\t\t`, {
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
      }).result,
      ` aaa`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true, // <---
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\t\t\t   \t\t\taaa\t\t\t   \t\t\t`, {
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
      }).result,
      `aaa `,
      JSON.stringify(opt, null, 0)
    );
  });

  mixer({
    trimStart: true,
    trimEnd: true,
    trimLines: false,
    // enforceSpacesOnly doesn't matter now
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\t\t\t   \t\t\taaa\t\t\t   \t\t\t`, {
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
      }).result,
      `aaa`,
      JSON.stringify(opt, null, 0)
    );
  });

  /// //////////              trimLines = on

  mixer({
    trimLines: true,
    // all other settings are irrelevant
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\t\t\t   \t\t\taaa\t\t\t   \t\t\t`, {
        ...opt,
        cb: ({ ...props }) => {
          t.strictSame(Object.keys(props), cbSchema);
          Object.keys(props).forEach((key) => {
            if (["whiteSpaceStartsAt", "whiteSpaceEndsAt"].includes(key)) {
              t.is(
                typeof props[key],
                "number",
                `props: ${JSON.stringify(
                  props[key],
                  null,
                  4
                )}; opt: ${JSON.stringify(opt, null, 4)}`
              );
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
      }).result,
      `aaa`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test("02", (t) => {
  t.strictSame(
    collapse(`\t\t\t   \t\t\taaa\t\t\t   \t\t\t`, {
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
    `aaa`,
    "02"
  );
  t.end();
});

tap.test(`03 - trimming mixed lumps of trimmable characters`, (t) => {
  // "   ttt   aaa   ttt   "

  /// //////////              trimLines = off

  // enforceSpacesOnly=off

  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`   \t\t\t   aaa   \t\t\t   `, {
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
      }).result,
      ` \t\t\t aaa \t\t\t `,
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
      collapse(`   \t\t\t   aaa   \t\t\t   `, {
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
      }).result,
      ` \t\t\t aaa`,
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
      collapse(`   \t\t\t   aaa   \t\t\t   `, {
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
      }).result,
      `aaa \t\t\t `,
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
    t.strictSame(
      collapse(`   \t\t\t   aaa   \t\t\t   `, {
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
      }).result,
      ` aaa `,
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
      collapse(`   \t\t\t   aaa   \t\t\t   `, {
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
      }).result,
      ` aaa`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`   \t\t\t   aaa   \t\t\t   `, {
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
      }).result,
      `aaa `,
      JSON.stringify(opt, null, 0)
    );
  });

  mixer({
    trimStart: true,
    trimEnd: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`   \t\t\t   aaa   \t\t\t   `, {
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
      }).result,
      `aaa`,
      JSON.stringify(opt, null, 0)
    );
  });

  /// //////////              trimLines = on

  mixer({
    trimLines: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`   \t\t\t   aaa   \t\t\t   `, {
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
      }).result,
      `aaa`,
      JSON.stringify(opt, null, 0)
    );
  });

  t.end();
});

tap.test(`04 - trimming mixed lumps of trimmable characters`, (t) => {
  // "   t t t   aaa   t t t   "

  /// //////////              trimLines = off

  // enforceSpacesOnly=off

  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`   \t \t \t   aaa   \t \t \t   `, {
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
      }).result,
      ` \t \t \t aaa \t \t \t `,
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
      collapse(`   \t \t \t   aaa   \t \t \t   `, {
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
      }).result,
      ` \t \t \t aaa`,
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
      collapse(`   \t \t \t   aaa   \t \t \t   `, {
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
      }).result,
      `aaa \t \t \t `,
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
    t.strictSame(
      collapse(`   \t \t \t   aaa   \t \t \t   `, {
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
      }).result,
      ` aaa `,
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
      collapse(`   \t \t \t   aaa   \t \t \t   `, {
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
      }).result,
      ` aaa`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: true,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`   \t \t \t   aaa   \t \t \t   `, {
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
      }).result,
      `aaa `,
      JSON.stringify(opt, null, 0)
    );
  });

  mixer({
    trimStart: true,
    trimEnd: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`   \t \t \t   aaa   \t \t \t   `, {
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
      }).result,
      `aaa`,
      JSON.stringify(opt, null, 0)
    );
  });

  /// //////////              trimLines = on

  mixer({
    trimLines: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`   \t \t \t   aaa   \t \t \t   `, {
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
      }).result,
      `aaa`,
      JSON.stringify(opt, null, 0)
    );
  });

  t.end();
});

tap.test(
  `05 - trimming mixed lumps of trimmable characters, removeEmptyLines=false`,
  (t) => {
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
        t.strictSame(
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
        t.strictSame(
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
        t.strictSame(
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
        t.strictSame(
          collapse(
            `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
            opt
          ).result,
          `aaa`,
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
        t.strictSame(
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
        t.strictSame(
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
        t.strictSame(
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
        t.strictSame(
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
        t.strictSame(
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
        t.strictSame(
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
        t.strictSame(
          collapse(
            `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
            opt
          ).result,
          `aaa`,
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
        t.strictSame(
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
        t.strictSame(
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
        t.strictSame(
          collapse(
            `\t ${eol} \t \r ${eol}aaa\t \n \t ${eol} \t ${eol} \r\n \t \n`,
            opt
          ).result,
          `${eol}\r${eol}aaa`,
          JSON.stringify(opt, null, 0)
        );
      });
    });
    t.end();
  }
);

tap.test(`06`, (t) => {
  t.strictSame(collapse("      "), { result: "", ranges: [[0, 6]] }, "06");
  mixer({
    trimStart: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`      `, {
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
      }).result,
      ``,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimEnd: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`      `, {
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
      }).result,
      ``,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimLines: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`      `, {
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
      }).result,
      ``,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`      `, {
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
      }).result,
      ` `,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`07`, (t) => {
  // "ttt   ttt"
  mixer({
    trimStart: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\t\t\t   \t\t\t`, {
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
      { result: "", ranges: [[0, 9]] },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimEnd: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\t\t\t   \t\t\t`, {
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
      { result: "", ranges: [[0, 9]] },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimLines: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\t\t\t   \t\t\t`, {
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
    t.strictSame(
      collapse(`\t\t\t   \t\t\t`, {
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
      { result: `\t\t\t \t\t\t`, ranges: [[3, 5]] },
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
      collapse(`\t\t\t   \t\t\t`, {
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
      { result: ` `, ranges: [[0, 9, " "]] },
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`08`, (t) => {
  // "ttt"
  mixer({
    trimStart: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\t\t\t`, {
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
      { result: ``, ranges: [[0, 3]] },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimEnd: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\t\t\t`, {
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
      { result: ``, ranges: [[0, 3]] },
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimLines: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\t\t\t`, {
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
      { result: ``, ranges: [[0, 3]] },
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
      collapse(`\t\t\t`, {
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
      { result: `\t\t\t`, ranges: null },
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
      collapse(`\t\t\t`, {
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
      { result: ` `, ranges: [[0, 3, " "]] },
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`09`, (t) => {
  ["\r\n", "\r", "\n"].forEach((eol) => {
    // removeEmptyLines=off
    mixer({
      trimStart: true,
      removeEmptyLines: false,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`${eol}${eol}${eol}`, {
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
        }).result,
        ``,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimEnd: true,
      removeEmptyLines: false,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`${eol}${eol}${eol}`, {
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
        }).result,
        ``,
        JSON.stringify(opt, null, 0)
      );
    });
    mixer({
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: false,
    }).forEach((opt) => {
      t.strictSame(
        collapse(`${eol}${eol}${eol}`, {
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
      t.strictSame(
        collapse(`${eol}${eol}${eol}`, {
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
      t.strictSame(
        collapse(`${eol}${eol}${eol}`, {
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
      t.strictSame(
        collapse(`${eol}${eol}${eol}`, {
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
      t.strictSame(
        collapse(`${eol}${eol}${eol}`, {
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
      t.strictSame(
        collapse(`${eol}${eol}${eol}`, {
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
        }).result,
        `${eol}${eol}${eol}`,
        JSON.stringify(opt, null, 0)
      );
    });
  });
  t.end();
});

tap.test(`10`, (t) => {
  t.strictSame(
    collapse(`\r\n\r\n\r\n\r\n\r\n\n\n\n\n\n\n`, {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: true,
    }).result,
    `\r\n\r\n`,
    "10.01"
  );
  t.strictSame(
    collapse(`\r\n\r\n\r\n\r\n\r\n\n\n\n\n\n\n`, {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: true,
      limitConsecutiveEmptyLinesTo: 2,
    }).result,
    `\r\n\r\n\r\n`,
    "10.02"
  );
  t.end();
});

tap.test(`11 - trim involving non-breaking spaces`, (t) => {
  // ".   a   ."
  mixer({
    trimStart: true,
    trimEnd: true,
    trimnbsp: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\xa0   a   \xa0`, {
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
      }).result,
      `a`,
      JSON.stringify(opt, null, 0)
    );
  });
  mixer({
    trimLines: true,
    trimnbsp: true,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\xa0   a   \xa0`, {
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
      }).result,
      `a`,
      JSON.stringify(opt, null, 0)
    );
  });

  mixer({
    trimnbsp: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`\xa0   a   \xa0`, {
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
      }).result,
      `\xa0 a \xa0`,
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
    t.strictSame(
      collapse(`\xa0   a   \xa0`, {
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
      }).result,
      ` a `,
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
    t.strictSame(
      collapse(`\xa0   a   \xa0`, {
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
      }).result,
      `a`,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test("12", (t) => {
  t.strictSame(
    collapse(`\xa0   a   \xa0`, {
      trimStart: true,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    `a `,
    "12"
  );
  t.end();
});

tap.test("13", (t) => {
  // ".   a   ."
  t.strictSame(
    collapse(`\xa0   a   \xa0`, {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: true,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    `a`,
    "13"
  );
  t.end();
});

tap.test("14", (t) => {
  // ".   a   ."
  t.strictSame(
    collapse(`\xa0   a   \xa0`, {
      trimStart: true,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    `a `,
    "14"
  );
  t.end();
});

tap.test("15", (t) => {
  // ".   a   ."
  t.strictSame(
    collapse(`\xa0   a   \xa0`, {
      trimStart: false,
      trimEnd: true,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    ` a`,
    "15"
  );
  t.end();
});

tap.test("16", (t) => {
  // ".   a   ."
  t.strictSame(
    collapse(`\xa0a\xa0`, {
      trimStart: true,
      trimEnd: true,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    `a`,
    "16"
  );
  t.end();
});

tap.test("17", (t) => {
  // "   .a.   "
  t.strictSame(
    collapse(`   \xa0a\xa0   `, {
      trimStart: true,
      trimEnd: true,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    `a`,
    "17"
  );
  t.end();
});

tap.test("18", (t) => {
  t.strictSame(
    collapse(`\xa0   a   \xa0`, {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: true,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    `a`,
    "18"
  );
  t.end();
});

tap.test("19", (t) => {
  // "   .a.   "
  t.strictSame(
    collapse(`   \xa0a\xa0   `, {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: true,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    `a`,
    "19"
  );
  t.end();
});

tap.test("20", (t) => {
  t.strictSame(
    collapse(`\xa0\na\n\xa0`, {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    ` \na\n `,
    "20.01"
  );
  t.strictSame(
    collapse(`\t\na\n\t`, {
      trimStart: false,
      trimEnd: false,
      removeEmptyLines: false,
      trimnbsp: false,
      trimLines: false,
      enforceSpacesOnly: true,
      limitConsecutiveEmptyLinesTo: 0,
    }).result,
    ` \na\n `,
    "20.02"
  );
  t.end();
});

tap.test("21", (t) => {
  t.strictSame(
    collapse(`\xa0\t\xa0a\xa0\t\xa0b\xa0\t\xa0`, {
      trimStart: false,
      trimEnd: false,
      trimLines: false,
      trimnbsp: false,
      enforceSpacesOnly: true,
    }).result,
    ` a b `,
    "21"
  );
  t.end();
});

tap.test(`22 - trim involving non-breaking spaces`, (t) => {
  // ".   .   a   .   ."
  t.strictSame(
    collapse(`\xa0   \xa0   a   \xa0   \xa0`),
    {
      result: `\xa0 \xa0 a \xa0 \xa0`,
      ranges: [
        [1, 3],
        [5, 7],
        [9, 11],
        [13, 15],
      ],
    },
    "22"
  );
  t.end();
});

tap.test(`23 - trim involving non-breaking spaces`, (t) => {
  // ".   .   a   .   ."
  t.strictSame(
    collapse(`\xa0   \xa0   a   \xa0   \xa0`, { trimnbsp: true }),
    {
      result: `a`,
      ranges: [
        [0, 8],
        [9, 17],
      ],
    },
    "23"
  );
  t.end();
});

tap.test(`24 - trim involving non-breaking spaces`, (t) => {
  // "    .     a     .      "
  t.strictSame(
    collapse(`    \xa0     a     \xa0      `),
    {
      result: `\xa0 a \xa0`,
      ranges: [
        [0, 4],
        [5, 9],
        [11, 15],
        [17, 23],
      ],
    },
    "24"
  );
  t.end();
});

tap.test(`25 - trim involving non-breaking spaces`, (t) => {
  t.strictSame(
    collapse(` \xa0 `, {
      trimStart: false,
      trimEnd: false,
    }).result,
    ` \xa0 `,
    "25"
  );
  t.end();
});

tap.test(`26 - trim involving non-breaking spaces`, (t) => {
  mixer({
    trimStart: false,
    trimEnd: false,
    trimLines: false,
    enforceSpacesOnly: false,
  }).forEach((opt) => {
    t.strictSame(
      collapse(`  \xa0  `, {
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
      }).result,
      ` \xa0 `,
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
      collapse(`  \xa0  `, {
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
      }).result,
      ` `,
      JSON.stringify(opt, null, 0)
    );
  });
  t.end();
});

tap.test(`27 - bracket`, (t) => {
  mixer().forEach((opt) => {
    t.strictSame(
      collapse(`a > b`, {
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
      }).result,
      `a > b`,
      "26"
    );
  });
  t.end();
});

tap.test(`28 - bracket`, (t) => {
  mixer().forEach((opt) => {
    t.strictSame(
      collapse(`<span>zzz</span> abc def ghij klm`, {
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
      }).result,
      `<span>zzz</span> abc def ghij klm`,
      "27.01"
    );
  });
  t.end();
});
