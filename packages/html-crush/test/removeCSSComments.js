import tap from "tap";
import { crush as m } from "../dist/html-crush.esm";

tap.test(
  `01 - ${`\u001b[${33}m${`css comments`}\u001b[${39}m`} - in head styles`,
  (t) => {
    const source = `<style>/* remove this */</style><body>z</body>`;

    // off
    t.match(
      m(source, {
        removeCSSComments: false,
      }),
      {
        result: source,
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: true,
        },
      },
      "01.01"
    );

    // on
    t.match(
      m(source, {
        removeCSSComments: true,
      }),
      {
        result: `<style></style><body>z</body>`,
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: true,
        },
      },
      "01.02"
    );

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`css comments`}\u001b[${39}m`} - within body`,
  (t) => {
    const source = `<div style="display:block;/*font-size: 1px;*/width:100px;"></div>`;

    // off
    t.match(
      m(source, {
        removeCSSComments: false,
      }),
      {
        result: source,
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: true,
        },
      },
      "02.01"
    );

    // on
    t.match(
      m(source, {
        removeCSSComments: true,
      }),
      {
        result: `<div style="display:block;width:100px;"></div>`,
        applicableOpts: {
          removeHTMLComments: false,
          removeCSSComments: true,
        },
      },
      "02.02"
    );

    t.end();
  }
);
