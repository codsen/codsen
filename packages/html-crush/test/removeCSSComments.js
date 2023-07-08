import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { m } from "./util/util.js";

// within head styles
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"css comments"}\u001b[${39}m`} - in head styles`, () => {
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

test(`02 - ${`\u001b[${33}m${"css comments"}\u001b[${39}m`} - in head styles`, () => {
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

test(`03 - ${`\u001b[${33}m${"css comments"}\u001b[${39}m`} - within body`, () => {
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

test.run();
