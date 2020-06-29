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

tap.test(
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

tap.test(
  `03 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment, surrounding whitespace`,
  (t) => {
    const source = `  <!-- remove this -->  `;

    // off
    t.match(
      m(source, {
        removeHTMLComments: 0,
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
        removeHTMLComments: 1,
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
        removeHTMLComments: 2,
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

tap.test(
  `04 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - commented tag`,
  (t) => {
    const source = `<!--<span>-->`;

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
      "04.01"
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
      "04.02"
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
      "04.03"
    );

    t.end();
  }
);

tap.todo(
  `05 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - when line length limit is too tight`,
  (t) => {
    const source = `<a><!-- remove this --></a>`;

    // off
    t.match(
      m(source, {
        removeHTMLComments: 0,
        lineLengthLimit: 2,
      }),
      {
        result: `<a>
<!--
remove
this
--></a>`,
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
        removeHTMLComments: 1,
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
      "05.02"
    );

    // 2 - includes outlook conditional comments
    t.match(
      m(source, {
        removeHTMLComments: 2,
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

tap.test(
  `06 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - outlook "only" type, tight`,
  (t) => {
    const source = `<!--[if mso]><img src="fallback"/><![endif]-->`;

    // 0 - off
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
      "06.01"
    );

    // 1 - only text comments
    t.match(
      m(source, {
        removeHTMLComments: 1,
      }),
      {
        result: source,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "06.02"
    );

    // 2 - includes outlook conditional comments
    t.match(
      m(source, {
        removeHTMLComments: 2,
      }),
      {
        result: `<img src="fallback"/>`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "06.03"
    );

    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - outlook "only" type, spaced`,
  (t) => {
    const source = `  <!--[if mso]>  <img src="fallback"/>  <![endif]-->  `;

    // off
    t.match(
      m(source, {
        removeHTMLComments: 0,
      }),
      {
        result: `<!--[if mso]><img src="fallback"/><![endif]-->`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "07.01"
    );

    // 1 - only text comments
    t.match(
      m(source, {
        removeHTMLComments: 1,
      }),
      {
        result: `<!--[if mso]><img src="fallback"/><![endif]-->`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "07.02"
    );

    // 2 - includes outlook conditional comments
    t.match(
      m(source, {
        removeHTMLComments: 2,
      }),
      {
        result: `<img src="fallback"/>`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "07.03"
    );

    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - stray opening only`,
  (t) => {
    const source = `abc\n<!--[if (gte mso 9)|(IE)]>\ndef`;

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
      "08.01"
    );

    // 1 - only text comments
    t.match(
      m(source, {
        removeHTMLComments: 1,
      }),
      {
        result: source,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "08.02"
    );

    // 2 - includes outlook conditional comments
    t.match(
      m(source, {
        removeHTMLComments: 2,
      }),
      {
        result: `abc\n\ndef`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "08.03"
    );

    t.end();
  }
);

// outlook "not" type comments
// -----------------------------------------------------------------------------
// For your reference:

// <!--[if !mso]><!-->
//     <img src="gif"/>
// <!--<![endif]-->

tap.test(
  `09 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - outlook "not" type, tight`,
  (t) => {
    const source = `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`;

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
      "09.01"
    );

    // 1 - only text comments
    t.match(
      m(source, {
        removeHTMLComments: 1,
      }),
      {
        result: source,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "09.02"
    );

    // 2 - includes outlook conditional comments
    t.match(
      m(source, {
        removeHTMLComments: 2,
      }),
      {
        result: `<img src="gif"/>`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "09.03"
    );

    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - outlook "not" type, spaced`,
  (t) => {
    const source = `  <!--[if !mso]>  <!-->  <img src="gif"/>  <!--<![endif]-->`;

    // off
    t.match(
      m(source, {
        removeHTMLComments: 0,
      }),
      {
        result: `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "10.01"
    );

    // 1 - only text comments
    t.match(
      m(source, {
        removeHTMLComments: 1,
      }),
      {
        result: `<!--[if !mso]><!--><img src="gif"/><!--<![endif]-->`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "10.02"
    );

    // 2 - includes outlook conditional comments
    t.match(
      m(source, {
        removeHTMLComments: 2,
      }),
      {
        result: `<img src="gif"/>`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "10.03"
    );

    t.end();
  }
);
