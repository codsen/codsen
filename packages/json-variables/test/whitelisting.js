/* eslint no-template-curly-in-string: 0 */

import tap from "tap";
import { jVar } from "../dist/json-variables.esm";

tap.test("01 - wrap flipswitch works", (t) => {
  t.strictSame(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", wrapGlobalFlipSwitch: true }
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "val",
    },
    "01.01"
  );
  t.strictSame(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", wrapGlobalFlipSwitch: false }
    ),
    {
      a: "val",
      b: "val",
      c: "val",
    },
    "01.02"
  );
  t.end();
});

tap.test("02 - global wrap flipswitch and dontWrapVars combo", (t) => {
  t.strictSame(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        wrapGlobalFlipSwitch: true,
        dontWrapVars: "c*",
      }
    ),
    {
      a: "{val}",
      b: "val",
      c: "val",
    },
    "02.01"
  );
  t.strictSame(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        wrapGlobalFlipSwitch: true,
        dontWrapVars: "b*",
      }
    ),
    {
      a: "{val}", // variable already came pre-wrapped (on "c") by the time it reached a: "%%_b_%%"
      b: "{val}",
      c: "val",
    },
    "02.02"
  );
  t.strictSame(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        wrapGlobalFlipSwitch: true,
        dontWrapVars: "a*",
      }
    ),
    {
      a: "{val}", // there's no such variable "a"
      b: "{val}",
      c: "val",
    },
    "02.03"
  );
  t.strictSame(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        wrapGlobalFlipSwitch: true,
        dontWrapVars: ["b*", "c*"],
      }
    ),
    {
      a: "val",
      b: "val",
      c: "val",
    },
    "02.04"
  );
  t.end();
});

tap.test("03 - opts.dontWrapVars", (t) => {
  t.strictSame(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: ["zzzz*"] }
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "val",
    },
    "03.01"
  );
  t.strictSame(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: "" }
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "val",
    },
    "03.02"
  );
  t.strictSame(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: [] }
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "val",
    },
    "03.03"
  );
  t.strictSame(
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: "zzzz*" }
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "val",
    },
    "03.04"
  );
  t.throws(() => {
    jVar(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: [1, 2, 3] }
    );
  }, "03.05");
  t.end();
});

tap.test("04 - opts.dontWrapVars, real key names", (t) => {
  t.strictSame(
    jVar(
      {
        title_front: "Some text %%_title_sub_%% and more text.",
        title_sub: "%%_subtitle_%%",
        subtitle: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: ["sub*"] }
    ),
    {
      title_front: "Some text {val} and more text.",
      title_sub: "val",
      subtitle: "val",
    },
    "04.01"
  );
  t.strictSame(
    jVar(
      {
        title_front: "Some text %%_title_sub_%% and more text.",
        title_sub: "%%_subtitle_%%",
        subtitle: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: "sub*" }
    ),
    {
      title_front: "Some text {val} and more text.",
      title_sub: "val",
      subtitle: "val",
    },
    "04.02"
  );
  t.strictSame(
    jVar(
      {
        title_front: "Some text %%_title_sub_%% and more text.",
        title_sub: "%%_subtitle_%%",
        subtitle: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: "" }
    ),
    {
      title_front: "Some text {val} and more text.",
      title_sub: "{val}",
      subtitle: "val",
    },
    "04.03"
  );
  t.end();
});

tap.test("05 - multiple dontWrapVars values", (t) => {
  t.strictSame(
    jVar(
      {
        front_title: "%%_lower_title_%%",
        lower_title: "%%_subtitle_%%",
        subtitle: "val",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["zzz*", "title*", "lower*"],
      }
    ),
    {
      front_title: "{val}",
      lower_title: "{val}",
      subtitle: "val",
    },
    '05 - still wraps because child variable call ("subtitle") is not excluded'
  );
  t.end();
});

tap.test("06 - one level var querying and whitelisting", (t) => {
  t.strictSame(
    jVar(
      {
        key: "Some text %%_otherkey_%%",
        otherkey: "variable",
      },
      {
        wrapHeadsWith: "{{",
        wrapTailsWith: "}}",
        wrapGlobalFlipSwitch: true,
        dontWrapVars: "*c",
      }
    ),
    {
      key: "Some text {{variable}}",
      otherkey: "variable",
    },
    "06.01"
  );
  t.strictSame(
    jVar(
      {
        key: "Some text %%_otherkey_%%",
        otherkey: "variable",
      },
      {
        wrapHeadsWith: "{{",
        wrapTailsWith: "}}",
        wrapGlobalFlipSwitch: false,
        dontWrapVars: "*c",
      }
    ),
    {
      key: "Some text variable",
      otherkey: "variable",
    },
    "06.02"
  );
  t.end();
});

tap.test("07 - opts.dontWrapVars, real key names", (t) => {
  t.strictSame(
    jVar(
      {
        title_front: "Some text %%_title_sub_%% and more text.",
        title_sub: "%%_subtitle_%%",
        subtitle: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: ["*le"] }
    ),
    {
      title_front: "Some text {val} and more text.",
      title_sub: "val",
      subtitle: "val",
    },
    "07.01"
  );
  t.strictSame(
    jVar(
      {
        title_front: "Some text %%_title_sub_%% and more text.",
        title_sub: "%%_subtitle_%%",
        subtitle: "val",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*le", "title_s*"],
      }
    ),
    {
      title_front: "Some text val and more text.",
      title_sub: "val",
      subtitle: "val",
    },
    "07.02"
  );
  t.strictSame(
    jVar(
      {
        title_front: "Some text %%_title_sub_%% and more text.",
        title_sub: "%%_subtitle_%%",
        subtitle: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: "" }
    ),
    {
      title_front: "Some text {val} and more text.",
      title_sub: "{val}",
      subtitle: "val",
    },
    "07.03"
  );
  t.end();
});
