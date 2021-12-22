import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { set, del } from "../dist/edit-package-json.esm.js";

// various throws
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - wrong/missing 1st arg = throw`, () => {
  // throw test pinning:
  throws(() => {
    set();
  }, /THROW_ID_01/);

  throws(() => {
    set("");
  }, /THROW_ID_01/);

  throws(() => {
    set(null);
  }, /THROW_ID_01/);

  throws(() => {
    set(undefined);
  }, /THROW_ID_01/);

  throws(() => {
    set(true);
  }, /THROW_ID_01/);
});

test(`02 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - ${`\u001b[${32}m${`del`}\u001b[${39}m`} - wrong/missing 1st arg = throw`, () => {
  // throw test pinning:
  throws(() => {
    del();
  }, /THROW_ID_02/);

  throws(() => {
    del("");
  }, /THROW_ID_02/);

  throws(() => {
    del(null);
  }, /THROW_ID_02/);

  throws(() => {
    del(undefined);
  }, /THROW_ID_02/);

  throws(() => {
    del(true);
  }, /THROW_ID_02/);
});

test.run();
