// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { m } from "./util/util.js";

// within head styles
// -----------------------------------------------------------------------------

test(`01 - css comments - in head styles`, () => {
  let source = "<style>/* remove this */</style><body>z</body>";

  // off
  compare(
    ok,
    m(equal, source, {
      removeCSSComments: false,
    }),
    {
      result: source,
      applicableOpts: {
        removeCSSComments: true,
        removeHTMLComments: false,
      },
    },
    "01.01",
  );

  // on
  compare(
    ok,
    m(equal, source, {
      removeCSSComments: true,
    }),
    {
      result: "<style></style><body>z</body>",
      applicableOpts: {
        removeCSSComments: true,
        removeHTMLComments: false,
      },
    },
    "01.02",
  );
});

test(`02 - css comments - in head styles`, () => {
  let source = `<style>
.a { font-size: 1px; }/* remove this */
.b { /* remove this */
  font-size: 1px;/* remove this */
  line-height: 2px; /* remove this */
  margin: 3px; /* remove this */
}/* remove this */
</style>
<body>z</body>`;

  // off
  compare(
    ok,
    m(equal, source, {
      removeCSSComments: false,
    }),
    {
      result: `<style>
.a { font-size: 1px; }/* remove this */
.b { /* remove this */
font-size: 1px;/* remove this */
line-height: 2px; /* remove this */
margin: 3px; /* remove this */
}/* remove this */
</style>
<body>z</body>`,
      applicableOpts: {
        removeCSSComments: true,
        removeHTMLComments: false,
      },
    },
    "02.01",
  );

  // on - removeLineBreaks=off
  compare(
    ok,
    m(equal, source, {
      removeLineBreaks: false,
      removeCSSComments: true,
    }),
    {
      result: `<style>
.a { font-size: 1px; }.b {font-size: 1px;line-height: 2px;margin: 3px;}</style>
<body>z</body>`,
      applicableOpts: {
        removeCSSComments: true,
        removeHTMLComments: false,
      },
    },
    "02.02",
  );

  // on - removeLineBreaks=on
  compare(
    ok,
    m(equal, source, {
      removeLineBreaks: true,
      removeCSSComments: true,
    }),
    {
      result: `<style>.a{font-size:1px;}.b{font-size:1px;line-height:2px;margin:3px;}</style>
<body>z
</body>`,
      applicableOpts: {
        removeCSSComments: true,
        removeHTMLComments: false,
      },
    },
    "02.03",
  );
});

// within HTML body, inline
// -----------------------------------------------------------------------------

test(`03 - css comments - within body`, () => {
  let source =
    '<div style="display:block;/*font-size: 1px;*/width:100px;"></div>';

  // off
  compare(
    ok,
    m(equal, source, {
      removeCSSComments: false,
    }),
    {
      result: source,
      applicableOpts: {
        removeCSSComments: true,
        removeHTMLComments: false,
      },
    },
    "03.01",
  );

  // on
  compare(
    ok,
    m(equal, source, {
      removeCSSComments: true,
    }),
    {
      result: '<div style="display:block;width:100px;"></div>',
      applicableOpts: {
        removeCSSComments: true,
        removeHTMLComments: false,
      },
    },
    "03.02",
  );
});

test("04 - css comments - comment-looking text inside strings", () => {
  const inputs = [
    '<style>a::before{content:"/* keep */";}</style>',
    "<style>a::before{content:'/* keep */';}</style>",
    '<style>a::before{content:"{{ /* keep */ }}";}</style>',
  ];

  for (const input of inputs) {
    const { applicableOpts, ranges, result } = m(equal, input, {
      removeCSSComments: true,
    });

    equal(result, input, "04.01");
    equal(ranges, null, "04.02");
    equal(applicableOpts.removeCSSComments, false, "04.03");
  }
});

test("05 - css comments - escaped quotes and adjacent real comments", () => {
  const comment = "/* remove */";
  const input = `<style>a::before{content:"x\\"/* keep */y";}${comment}</style>`;
  const commentStartsAt = input.indexOf(comment);
  const { applicableOpts, ranges, result } = m(equal, input, {
    removeCSSComments: true,
  });

  equal(
    result,
    '<style>a::before{content:"x\\"/* keep */y";}</style>',
    "05.01",
  );
  equal(ranges, [[commentStartsAt, commentStartsAt + comment.length]], "05.02");
  equal(applicableOpts.removeCSSComments, true, "05.03");
});

test("06 - css comments - strings inside inline styles", () => {
  const comment = "/* remove */";
  const input = `<div style="content:'/* keep */';${comment}color:red"></div>`;
  const commentStartsAt = input.indexOf(comment);
  const { applicableOpts, ranges, result } = m(equal, input, {
    removeCSSComments: true,
  });

  equal(
    result,
    '<div style="content:\'/* keep */\';color:red"></div>',
    "06.01",
  );
  equal(ranges, [[commentStartsAt, commentStartsAt + comment.length]], "06.02");
  equal(applicableOpts.removeCSSComments, true, "06.03");
});

test("07 - unterminated CSS comments are removed through EOF", () => {
  for (const source of [
    "<style>/*abc",
    "<style>/*abc   ",
    "<style>/*a",
    '<div style="color:red;/*abc',
    "<style>/*abc\r\n",
  ]) {
    const commentStartsAt = source.indexOf("/*");
    const { applicableOpts, ranges, result } = m(equal, source, {
      removeCSSComments: true,
    });

    equal(result, source.slice(0, commentStartsAt), "07.01");
    equal(ranges, [[commentStartsAt, source.length]], "07.02");
    equal(applicableOpts.removeCSSComments, true, "07.03");
  }
});

test("08 - disabled CSS comment removal preserves unterminated comments", () => {
  for (const source of ["<style>/*abc", '<div style="color:red;/*abc']) {
    const { applicableOpts, ranges, result } = m(equal, source, {
      removeCSSComments: false,
    });

    equal(result, source, "08.01");
    equal(ranges, null, "08.02");
    equal(applicableOpts.removeCSSComments, true, "08.03");
  }
});

test.run();
