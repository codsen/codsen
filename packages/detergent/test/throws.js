import tap from "tap";
import {
  det as det1,
  opts as exportedOptsObj,
  version,
} from "../dist/detergent.esm.js";
import {
  det,
  // mixer,
  // rawReplacementMark,
  // rawNDash,
  // rawMDash,
  // rawNbsp,
  // rawhairspace,
  // rawEllipsis,
  // rightSingleQuote,
  // rightDoubleQuote,
  // leftDoubleQuote,
  // leftSingleQuote
} from "../t-util/util.js";

tap.test(
  `01 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - throws when the first argument is not string`,
  (t) => {
    t.throws(() => {
      det(t, 0, 1, "zzz");
    }, /THROW_ID_01/gm);

    t.throws(() => {
      det(t, 0, true, "zzz");
    }, /THROW_ID_01/gm);

    function fn() {
      return true;
    }
    t.throws(() => {
      det(t, 0, fn, "zzz");
    }, /THROW_ID_01/gm);

    t.throws(() => {
      det(t, 0, { a: "b" }, "zzz");
    }, /THROW_ID_01/gm);

    t.throws(() => {
      det(t, 0, null, "zzz");
    }, /THROW_ID_01/gm);

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - throws when the second argument is truthy yet not a plain object`,
  (t) => {
    t.throws(() => {
      det(t, 0, `zzz`, "zzz");
    }, /THROW_ID_02/gm);
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - default opts object is exported`,
  (t) => {
    t.ok(Object.keys(exportedOptsObj).length > 10, "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - version is exported`,
  (t) => {
    t.match(version, /\d+\.\d+\.\d+/g, "04");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - throws when opts.cb is truthy and not a function`,
  (t) => {
    t.throws(() => {
      det(t, 0, `zzz`, { cb: true });
    }, /THROW_ID_03/gm);
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - not throws when opts.cb is falsey`,
  (t) => {
    // original function det1():
    t.doesNotThrow(() => {
      det1(`zzz`, { cb: null });
    }, "06.01");
    t.doesNotThrow(() => {
      det1(`zzz`, { cb: false });
    }, "06.02");
    t.doesNotThrow(() => {
      det1(`zzz`, { cb: false });
    }, "06.03");

    // mixer det()
    t.doesNotThrow(() => {
      det(t, 0, `zzz`, { cb: null });
    }, "06.04");
    t.doesNotThrow(() => {
      det(t, 0, `zzz`, { cb: false });
    }, "06.05");
    t.doesNotThrow(() => {
      det(t, 0, `zzz`, { cb: false });
    }, "06.06");

    t.end();
  }
);
