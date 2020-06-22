import tap from "tap";
import { crush as m } from "../dist/html-crush.esm";

tap.test(
  `01 - ${`\u001b[${33}m${`css comments`}\u001b[${39}m`} - in head styles`,
  (t) => {
    // off
    t.same(
      m(`<style>/* remove this */</style><body>z</body>`, {
        removeCSSComments: false,
      }).result,
      `<style>/* remove this */</style><body>z</body>`,
      "01.01"
    );

    // on
    t.same(
      m(`<style>/* remove this */</style><body>z</body>`, {
        removeCSSComments: true,
      }).result,
      `<style></style><body>z</body>`,
      "01.02"
    );

    t.end();
  }
);
