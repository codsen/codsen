import tap from "tap";
import { m } from "./util/util.js";

// regular HTML comments (nothing to do with Outlook)
// <!-- zzz -->
// <!-- <div>zzz</div> -->
// and so on

//
//
//
//
// -----------------------------------------------------------------------------
//
//
//
//

tap.test(
  `01 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment only - 0`,
  (t) => {
    const source = `<!-- remove this -->`;

    // off
    t.match(
      m(t, source, {
        removeHTMLComments: 0,
      }),
      {
        result: source,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment only - 1`,
  (t) => {
    const source = `<!-- remove this -->`;
    // 1 - only text comments
    t.match(
      m(t, source, {
        removeHTMLComments: 1,
      }),
      {
        result: "",
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment only - 2`,
  (t) => {
    const source = `<!-- remove this -->`;
    // 2 - includes outlook conditional comments
    t.match(
      m(t, source, {
        removeHTMLComments: 2,
      }),
      {
        result: "",
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "03"
    );

    t.end();
  }
);

//
//
//
//
// -----------------------------------------------------------------------------
//
//
//
//

tap.test(
  `04 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment, surrounding whitespace - 0`,
  (t) => {
    const source = `  <!-- remove this -->  `;
    // off
    t.match(
      m(t, source, {
        removeHTMLComments: 0,
      }),
      {
        result: source.trim(t),
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment, surrounding whitespace - 1`,
  (t) => {
    const source = `  <!-- remove this -->  `;
    // 1 - only text comments
    t.match(
      m(t, source, {
        removeHTMLComments: 1,
      }),
      {
        result: "",
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment, surrounding whitespace - 2`,
  (t) => {
    const source = `  <!-- remove this -->  `;
    // 2 - includes outlook conditional comments
    t.match(
      m(t, source, {
        removeHTMLComments: 2,
      }),
      {
        result: "",
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "06"
    );

    t.end();
  }
);

//
//
//
//
// -----------------------------------------------------------------------------
//
//
//
//

tap.test(
  `07 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - commented tag - 0`,
  (t) => {
    const source = `<!--<span>-->`;
    // 0 - off
    t.match(
      m(t, source, {
        removeHTMLComments: 0,
      }),
      {
        result: source,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - commented tag - 1`,
  (t) => {
    const source = `<!--<span>-->`;
    // 1 - only text comments
    t.match(
      m(t, source, {
        removeHTMLComments: 1,
      }),
      {
        result: "",
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "08"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - commented tag - 2`,
  (t) => {
    const source = `<!--<span>-->`;
    // 2 - includes outlook conditional comments
    t.match(
      m(t, source, {
        removeHTMLComments: 2,
      }),
      {
        result: "",
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "09"
    );

    t.end();
  }
);

//
//
//
//
// -----------------------------------------------------------------------------
//
//
//
//

tap.test(
  `10 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - when line length limit is too tight - 0`,
  (t) => {
    const source = `<div><!-- remove this --></div>`;
    // 0 - off
    t.match(
      m(t, source, {
        removeLineBreaks: true,
        removeHTMLComments: 0,
        lineLengthLimit: 2,
      }),
      {
        result: `<div>
<!--
remove
this
-->
</div>`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - when line length limit is too tight - 1`,
  (t) => {
    const source = `<div><!-- remove this --></div>`;
    // 1 - only text comments
    t.match(
      m(t, source, {
        removeHTMLComments: 1,
        lineLengthLimit: 2,
      }),
      {
        result: `<div>
</div>`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - when line length limit is too tight - 2`,
  (t) => {
    const source = `<div><!-- remove this --></div>`;
    // 2 - includes outlook conditional comments
    t.match(
      m(t, source, {
        removeHTMLComments: 2,
        lineLengthLimit: 2,
      }),
      {
        result: `<div>
</div>`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "12"
    );
    t.end();
  }
);

//
//
//
//
// -----------------------------------------------------------------------------
//
//
//
//
