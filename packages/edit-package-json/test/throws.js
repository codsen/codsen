import tap from "tap";
import { set, del } from "../dist/edit-package-json.esm";

// various throws
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - wrong/missing 1st arg = throw`,
  (t) => {
    // throw test pinning:
    const error1 = t.throws(() => {
      set();
    });
    t.match(error1.message, /THROW_ID_01/, "01.01");

    const error2 = t.throws(() => {
      set("");
    });
    t.match(error2.message, /THROW_ID_01/, "01.02");

    const error3 = t.throws(() => {
      set(null);
    });
    t.match(error3.message, /THROW_ID_01/, "01.03");

    const error4 = t.throws(() => {
      set(undefined);
    });
    t.match(error4.message, /THROW_ID_01/, "01.04");

    const error5 = t.throws(() => {
      set(true);
    });
    t.match(error5.message, /THROW_ID_01/, "01.05");

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - ${`\u001b[${32}m${`del`}\u001b[${39}m`} - wrong/missing 1st arg = throw`,
  (t) => {
    // throw test pinning:
    const error1 = t.throws(() => {
      del();
    });
    t.match(error1.message, /THROW_ID_02/, "02.01");

    const error2 = t.throws(() => {
      del("");
    });
    t.match(error2.message, /THROW_ID_02/, "02.02");

    const error3 = t.throws(() => {
      del(null);
    });
    t.match(error3.message, /THROW_ID_02/, "02.03");

    const error4 = t.throws(() => {
      del(undefined);
    });
    t.match(error4.message, /THROW_ID_02/, "02.04");

    const error5 = t.throws(() => {
      del(true);
    });
    t.match(error5.message, /THROW_ID_02/, "02.05");

    t.end();
  }
);
