import tap from "tap";
import { crush as m } from "../dist/html-crush.esm";

tap.test(
  `01 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - deletes trailing space`,
  (t) => {
    t.match(
      m(" <a> \n <b> ", {
        removeLineBreaks: true,
      }),
      {
        result: "<a> <b>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "01.01"
    );
    t.match(
      m(" <a>\n<b> ", {
        removeLineBreaks: true,
      }),
      {
        result: "<a>\n<b>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "01.02"
    );
    t.match(
      m(" <section> \n <article> ", {
        removeLineBreaks: true,
      }),
      {
        result: "<section><article>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "01.03"
    );

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - retains trailing linebreak`,
  (t) => {
    t.match(
      m(" <a> \n <b> \n", {
        removeLineBreaks: true,
      }),
      {
        result: "<a> <b>\n",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "02"
    );

    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - trailing line break`,
  (t) => {
    t.match(
      m(" a \n b \n", {
        removeLineBreaks: true,
      }),
      {
        result: "a b\n",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - multiple line breaks`,
  (t) => {
    t.match(
      m(" a \n b\n\n\nc ", {
        removeLineBreaks: true,
      }),
      {
        result: "a b c",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - ends with character`,
  (t) => {
    t.match(
      m(" a \n b\n\n\nc", {
        removeLineBreaks: true,
      }),
      {
        result: "a b c",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - tags, end with character`,
  (t) => {
    t.match(
      m(" <x> \n <y>\n\n\n<z>", {
        removeLineBreaks: true,
      }),
      {
        result: "<x><y><z>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "06.01"
    );
    t.match(
      m(" <a> \n <b>\n\n\n<i>\n\n\n<c>", {
        removeLineBreaks: true,
      }),
      {
        result: "<a> <b> <i><c>",
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: false,
        },
      },
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${`small tests`}\u001b[${39}m`} - comments`,
  (t) => {
    const src = `<!--<![endif]-->`;
    t.match(
      m(src, {
        removeLineBreaks: true,
      }),
      {
        result: src,
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
