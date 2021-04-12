/* eslint no-unused-vars:0 */

import tap from "tap";
import {
  find,
  get,
  set,
  drop,
  del,
  arrayFirstOnly,
} from "../dist/ast-monkey.esm";

const defaultInput = {
  a: { b: [{ c: { d: "e" } }] },
  c: { d: "e" },
};

// -----------------------------------------------------------------------------

tap.test("01 - find - throws when there's no input", (t) => {
  t.throws(() => {
    find();
  }, /THROW_ID_02/g);
  t.throws(() => {
    find(null, {});
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("02 - get -  throws when there's no input", (t) => {
  t.throws(() => {
    get();
  }, /THROW_ID_06/g);
  t.throws(() => {
    get(null, {});
  }, /THROW_ID_06/g);
  t.end();
});

tap.test("03 - set -  throws when there's no input", (t) => {
  t.throws(() => {
    set();
  }, /THROW_ID_12/g);
  t.throws(() => {
    set(null, {});
  }, /THROW_ID_12/g);
  t.end();
});

tap.test("04 - drop - throws when there's no input", (t) => {
  t.throws(() => {
    drop();
  }, /THROW_ID_19/g);
  t.throws(() => {
    drop(null, {});
  }, /THROW_ID_19/g);
  t.end();
});

tap.test("05 - del - throws when there's no input", (t) => {
  t.throws(() => {
    del();
  }, /THROW_ID_26/g);
  t.throws(() => {
    del(null, {});
  }, /THROW_ID_26/g);
  t.end();
});

tap.test("06 - del - throws when opts is not a plain object", (t) => {
  t.throws(() => {
    del({ a: "b" });
  }, /THROW_ID_27/g);
  t.throws(() => {
    del({ a: "b" }, "c");
  }, /THROW_ID_27/g);
  t.end();
});

tap.test("07 - arrayFirstOnly - when there's no input", (t) => {
  t.throws(() => {
    arrayFirstOnly();
  }, /THROW_ID_31/g);
  t.end();
});

tap.test("08 - del - throws when opts.key and opts.val are missing", (t) => {
  t.throws(() => {
    del({ a: "b" }, {});
  }, /THROW_ID_28/g);
  t.end();
});

tap.test("09 - get/set - throws when opts.index is missing", (t) => {
  t.throws(() => {
    get(defaultInput);
  }, /THROW_ID_07/g);
  t.throws(() => {
    get(defaultInput, { a: "a" });
  }, /THROW_ID_08/g);
  t.throws(() => {
    set(defaultInput);
  }, /THROW_ID_13/g);
  t.throws(() => {
    set(defaultInput, { a: "a" });
  }, /THROW_ID_14/g);
  t.end();
});

tap.test(
  "10 - get/set/drop - throws when opts.index is not a natural number (both string or number)",
  (t) => {
    t.throws(() => {
      get(defaultInput, { index: "1.5" });
    }, /THROW_ID_11/g);
    t.throws(() => {
      get(defaultInput, { index: 1.5 });
    }, /THROW_ID_11/g);
    t.throws(() => {
      set(defaultInput, { index: "1.5", val: "zzz" });
    }, /THROW_ID_17/g);
    t.throws(() => {
      set(defaultInput, { index: 1.5, val: "zzz" });
    }, /THROW_ID_17/g);
    t.throws(() => {
      drop(defaultInput, { index: "1.5" });
    }, /THROW_ID_23/g);
    t.throws(() => {
      drop(defaultInput, { index: 1.5 });
    }, /THROW_ID_23/g);
    t.end();
  }
);

tap.test("11 - set - throws when opts.key and opts.val are missing", (t) => {
  t.throws(() => {
    set(defaultInput, { index: "3" });
  }, /THROW_ID_14/g);
  t.end();
});

tap.test("12 - find - throws when opts.key and opts.val are missing", (t) => {
  t.throws(() => {
    find(defaultInput, { index: "3" });
  }, /THROW_ID_03/g);
  t.throws(() => {
    find(defaultInput, { index: 3 });
  }, /THROW_ID_03/g);
  t.end();
});

tap.test("13 - del - throws when opts.key and opts.val are missing", (t) => {
  t.throws(() => {
    del(defaultInput, { index: "3" });
  }, /THROW_ID_28/g);
  t.throws(() => {
    del(defaultInput, { index: 3 });
  }, /THROW_ID_28/g);
  t.end();
});

tap.test("14 - drop - throws when there's no index", (t) => {
  t.throws(() => {
    drop(["a"], "a");
  }, /THROW_ID_20/g);
  t.throws(() => {
    drop({ a: "a" }, { b: "b" });
  }, /THROW_ID_21/g);
  t.end();
});
