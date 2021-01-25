import tap from "tap";
import { set, del } from "../dist/edit-package-json.esm";

// various throws
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - wrong/missing 1st arg = throw`,
  (t) => {
    // throw test pinning:
    t.throws(() => {
      set();
    }, /THROW_ID_01/);

    t.throws(() => {
      set("");
    }, /THROW_ID_01/);

    t.throws(() => {
      set(null);
    }, /THROW_ID_01/);

    t.throws(() => {
      set(undefined);
    }, /THROW_ID_01/);

    t.throws(() => {
      set(true);
    }, /THROW_ID_01/);

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - ${`\u001b[${32}m${`del`}\u001b[${39}m`} - wrong/missing 1st arg = throw`,
  (t) => {
    // throw test pinning:
    t.throws(() => {
      del();
    }, /THROW_ID_02/);

    t.throws(() => {
      del("");
    }, /THROW_ID_02/);

    t.throws(() => {
      del(null);
    }, /THROW_ID_02/);

    t.throws(() => {
      del(undefined);
    }, /THROW_ID_02/);

    t.throws(() => {
      del(true);
    }, /THROW_ID_02/);

    t.end();
  }
);
