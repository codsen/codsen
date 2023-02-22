import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  det as det1,
  opts as exportedOptsObj,
  version,
} from "../dist/detergent.esm.js";
import { det } from "../t-util/util.js";

test(`01 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - throws when the first argument is not string`, () => {
  throws(
    () => {
      det(ok, not, 0, 1, "zzz");
    },
    /THROW_ID_01/gm,
    "01.01"
  );

  throws(
    () => {
      det(ok, not, 0, true, "zzz");
    },
    /THROW_ID_01/gm,
    "01.02"
  );

  function fn() {
    return true;
  }
  throws(
    () => {
      det(ok, not, 0, fn, "zzz");
    },
    /THROW_ID_01/gm,
    "01.03"
  );

  throws(
    () => {
      det(ok, not, 0, { a: "b" }, "zzz");
    },
    /THROW_ID_01/gm,
    "01.04"
  );

  throws(
    () => {
      det(ok, not, 0, null, "zzz");
    },
    /THROW_ID_01/gm,
    "01.05"
  );
});

test(`02 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - throws when the second argument is truthy yet not a plain object`, () => {
  throws(
    () => {
      det(ok, not, 0, `zzz`, "zzz");
    },
    /THROW_ID_02/gm,
    "02.01"
  );
});

test(`03 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - default opts object is exported`, () => {
  ok(Object.keys(exportedOptsObj).length > 10, "03.01");
});

test(`04 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - version is exported`, () => {
  match(version, /\d+\.\d+\.\d+/g, "04.01");
});

test(`05 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - throws when opts.cb is truthy and not a function`, () => {
  throws(
    () => {
      det(ok, not, 0, `zzz`, { cb: true });
    },
    /THROW_ID_03/gm,
    "05.01"
  );
});

test(`06 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - not throws when opts.cb is falsey`, () => {
  // original function det1():
  not.throws(() => {
    det1(`zzz`, { cb: null });
  }, "06.01");
  not.throws(() => {
    det1(`zzz`, { cb: false });
  }, "06.02");
  not.throws(() => {
    det1(`zzz`, { cb: false });
  }, "06.03");

  // mixer det()
  not.throws(() => {
    det(ok, not, 0, `zzz`, { cb: null });
  }, "06.04");
  not.throws(() => {
    det(ok, not, 0, `zzz`, { cb: false });
  }, "06.05");
  not.throws(() => {
    det(ok, not, 0, `zzz`, { cb: false });
  }, "06.06");
});

test.run();
