import tap from "tap";
import { cleanChangelogs as c } from "../dist/lerna-clean-changelogs.esm.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { version } = require("../package.json");

tap.test(
  `01 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - missing 1st arg`,
  (t) => {
    t.throws(() => {
      c();
    }, /THROW_ID_01/g);

    t.throws(() => {
      c(undefined);
    }, /THROW_ID_01/g);
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - 1st arg of a wrong type`,
  (t) => {
    t.throws(() => {
      c(1);
    }, /THROW_ID_02/g);

    t.throws(() => {
      c(true);
    }, /THROW_ID_02/g);

    t.throws(() => {
      c([]);
    }, /THROW_ID_02/g);

    t.throws(() => {
      c(null);
    }, /THROW_ID_02/g);

    t.throws(() => {
      c({});
    }, /THROW_ID_02/g);

    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`basics`}\u001b[${39}m`} - 1st arg is empty string`,
  (t) => {
    t.strictSame(
      c(""),
      {
        res: "",
        version,
      },
      "03"
    );

    t.end();
  }
);
