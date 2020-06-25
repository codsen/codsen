import tap from "tap";
import { crush as m } from "../dist/html-crush.esm";

tap.test(
  `01 - ${`\u001b[${33}m${`css comments`}\u001b[${39}m`} - in head styles`,
  (t) => {
    const source = `<style>/* remove this */</style><body>z</body>`;

    // off
    t.same(
      m(source, {
        removeCSSComments: false,
      }).result,
      source,
      "01.01"
    );

    // on
    t.same(
      m(source, {
        removeCSSComments: true,
      }).result,
      `<style></style><body>z</body>`,
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
    t.same(
      m(source, {
        removeCSSComments: false,
      }).result,
      source,
      "02.01"
    );

    // on
    t.same(
      m(source, {
        removeCSSComments: true,
      }).result,
      `<div style="display:block;width:100px;"></div>`,
      "02.02"
    );

    t.end();
  }
);
