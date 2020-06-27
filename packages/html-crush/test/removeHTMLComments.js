import tap from "tap";
import { crush as m } from "../dist/html-crush.esm";

// grouped tests
tap.test(
  `01 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - does nothing`,
  (t) => {
    [
      `abc def`,
      `!--`,
      `-->`,
      `abd <!-- def`,
      `<!--<span>-->`,
      `<!--a-->`,
      `<!-->`,
      `<!--<!---->`,
      `<!--a b-->`,
      `<!-- tralala -->`,
    ].forEach((source) => {
      t.match(
        m(source, {
          removeHTMLComments: false,
        }),
        {
          result: source,
        },
        "01.01"
      );
    });
    t.end();
  }
);

tap.only(
  `02 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment only`,
  (t) => {
    const source = `<!-- remove this -->`;

    // off
    t.match(
      m(source, {
        removeHTMLComments: 0,
      }),
      {
        result: source,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "02.01"
    );

    // 1 - only text comments
    t.match(
      m(source, {
        removeHTMLComments: 1,
      }),
      {
        result: "",
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "02.02"
    );

    // 2 - includes outlook conditional comments
    t.match(
      m(source, {
        removeHTMLComments: 2,
      }),
      {
        result: "",
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "02.03"
    );

    t.end();
  }
);

tap.todo(
  `03 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment, surrounding whitespace`,
  (t) => {
    const source = `  <!-- remove this -->  `;

    // off
    t.match(
      m(source, {
        removeHTMLComments: false,
      }),
      {
        result: source.trim(),
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "03.01"
    );

    // 1 - only text comments
    t.match(
      m(source, {
        removeHTMLComments: true,
      }),
      {
        result: "",
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "03.02"
    );

    // 2 - includes outlook conditional comments
    t.match(
      m(source, {
        removeHTMLComments: true,
      }),
      {
        result: "",
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "03.03"
    );

    t.end();
  }
);

tap.todo(
  `04 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - when line length limit is too tight`,
  (t) => {
    const source = `<a><!-- remove this --></a>`;

    // off
    t.match(
      m(source, {
        removeHTMLComments: false,
        lineLengthLimit: 2,
      }),
      {
        result: `<a>
<!--
don't
remove
this
--></a>`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "04.01"
    );

    // 1 - only text comments
    t.match(
      m(source, {
        removeHTMLComments: true,
        lineLengthLimit: 2,
      }),
      {
        result: `<a>
</a>`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "04.02"
    );

    // 2 - includes outlook conditional comments
    t.match(
      m(source, {
        removeHTMLComments: true,
        lineLengthLimit: 2,
      }),
      {
        result: `<a>
</a>`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "04.03"
    );

    t.end();
  }
);

tap.todo(
  `05 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - commented tag`,
  (t) => {
    const source = `<!--<span>-->`;

    // off
    t.match(
      m(source, {
        removeHTMLComments: false,
      }),
      {
        result: source,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "05.01"
    );

    // 1 - only text comments
    t.match(
      m(source, {
        removeHTMLComments: true,
      }),
      {
        result: "",
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "05.02"
    );

    // 2 - includes outlook conditional comments
    t.match(
      m(source, {
        removeHTMLComments: true,
      }),
      {
        result: "",
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "05.03"
    );

    t.end();
  }
);

// outlook "only" type comments
// -----------------------------------------------------------------------------
// For your reference:

// <!--[if mso]>
//     <img src="fallback"/>
// <![endif]-->

// outlook "not" type comments
// -----------------------------------------------------------------------------
// For your reference:

// <!--[if !mso]><!-->
//     <img src="gif"/>
// <!--<![endif]-->
