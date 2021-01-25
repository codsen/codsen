import tap from "tap";
import { m } from "./util/util";

// outlook "only" type comments
// -----------------------------------------------------------------------------
// For your reference:

// <!--[if mso]>
//     <img src="fallback"/>
// <![endif]-->

tap.test(
  `01 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - outlook "only" type, tight`,
  (t) => {
    const source = `<!--[if mso]><img src="fallback"/><![endif]-->`;

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
      "01.01"
    );

    // 1 - only text comments
    t.match(
      m(t, source, {
        removeHTMLComments: 1,
      }),
      {
        result: source,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "01.02"
    );

    // 2 - includes outlook conditional comments
    t.match(
      m(t, source, {
        removeHTMLComments: 2,
      }),
      {
        result: `<img src="fallback"/>`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "01.03"
    );

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - outlook "only" type, spaced`,
  (t) => {
    const source = `  <!--[if mso]>  <img src="fallback"/>  <![endif]-->  `;

    // off
    t.match(
      m(t, source, {
        removeHTMLComments: 0,
      }),
      {
        result: `<!--[if mso]><img src="fallback"/><![endif]-->`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "02.01"
    );

    // 1 - only text comments
    t.match(
      m(t, source, {
        removeHTMLComments: 1,
      }),
      {
        result: `<!--[if mso]><img src="fallback"/><![endif]-->`,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "02.02"
    );

    // 2 - includes outlook conditional comments
    t.match(
      m(t, source, {
        removeHTMLComments: 2,
      }),
      {
        result: `<img src="fallback"/>`,
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
  `03 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - stray opening only`,
  (t) => {
    const source = `abc\n<!--[if (gte mso 9)|(IE)]>\ndef`;

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
      "03.01"
    );

    // 1 - only text comments
    t.match(
      m(t, source, {
        removeHTMLComments: 1,
      }),
      {
        result: source,
        applicableOpts: {
          removeHTMLComments: true,
          removeCSSComments: false,
        },
      },
      "03.02"
    );

    // 2 - includes outlook conditional comments
    t.match(
      m(t, source, {
        removeHTMLComments: 2,
      }),
      {
        result: `abc\n\ndef`,
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
