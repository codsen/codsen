import tap from "tap";
import { m } from "./util/util.js";

// within head styles
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`css comments`}\u001b[${39}m`} - in head styles`,
  (t) => {
    const source = `<style>/* remove this */</style><body>z</body>`;

    // off
    t.match(
      m(t, source, {
        removeCSSComments: false,
      }),
      {
        result: source,
        applicableOpts: {
          removeCSSComments: true,
          removeHTMLComments: false,
        },
      },
      "01.01"
    );

    // on
    t.match(
      m(t, source, {
        removeCSSComments: true,
      }),
      {
        result: `<style></style><body>z</body>`,
        applicableOpts: {
          removeCSSComments: true,
          removeHTMLComments: false,
        },
      },
      "01.02"
    );

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`css comments`}\u001b[${39}m`} - in head styles`,
  (t) => {
    const source = `<style>
.a { font-size: 1px; }/* remove this */
.b { /* remove this */
  font-size: 1px;/* remove this */
  line-height: 2px; /* remove this */
  margin: 3px; /* remove this */
}/* remove this */
</style>
<body>z</body>`;

    // off
    t.match(
      m(t, source, {
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
      "02.01"
    );

    // on - removeLineBreaks=off
    t.match(
      m(t, source, {
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
      "02.02"
    );

    // on - removeLineBreaks=on
    t.match(
      m(t, source, {
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
      "02.03"
    );

    t.end();
  }
);

// within HTML body, inline
// -----------------------------------------------------------------------------

tap.test(
  `03 - ${`\u001b[${33}m${`css comments`}\u001b[${39}m`} - within body`,
  (t) => {
    const source = `<div style="display:block;/*font-size: 1px;*/width:100px;"></div>`;

    // off
    t.match(
      m(t, source, {
        removeCSSComments: false,
      }),
      {
        result: source,
        applicableOpts: {
          removeCSSComments: true,
          removeHTMLComments: false,
        },
      },
      "03.01"
    );

    // on
    t.match(
      m(t, source, {
        removeCSSComments: true,
      }),
      {
        result: `<div style="display:block;width:100px;"></div>`,
        applicableOpts: {
          removeCSSComments: true,
          removeHTMLComments: false,
        },
      },
      "03.02"
    );

    t.end();
  }
);
