import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  find,
  get,
  set,
  drop,
  del,
  arrayFirstOnly,
} from "../dist/ast-monkey.esm.js";

const defaultInput = {
  a: { b: [{ c: { d: "e" } }] },
  c: { d: "e" },
};

// -----------------------------------------------------------------------------

test("01 - find - throws when there's no input", () => {
  throws(
    () => {
      find();
    },
    /THROW_ID_02/g,
    "01.01",
  );
  throws(
    () => {
      find(null, {});
    },
    /THROW_ID_02/g,
    "01.02",
  );
});

test("02 - get -  throws when there's no input", () => {
  throws(
    () => {
      get();
    },
    /THROW_ID_06/g,
    "02.01",
  );
  throws(
    () => {
      get(null, {});
    },
    /THROW_ID_06/g,
    "02.02",
  );
});

test("03 - set -  throws when there's no input", () => {
  throws(
    () => {
      set();
    },
    /THROW_ID_12/g,
    "03.01",
  );
  throws(
    () => {
      set(null, {});
    },
    /THROW_ID_12/g,
    "03.02",
  );
});

test("04 - drop - throws when there's no input", () => {
  throws(
    () => {
      drop();
    },
    /THROW_ID_19/g,
    "04.01",
  );
  throws(
    () => {
      drop(null, {});
    },
    /THROW_ID_19/g,
    "04.02",
  );
});

test("05 - del - throws when there's no input", () => {
  throws(
    () => {
      del();
    },
    /THROW_ID_26/g,
    "05.01",
  );
  throws(
    () => {
      del(null, {});
    },
    /THROW_ID_26/g,
    "05.02",
  );
});

test("06 - del - throws when opts is not a plain object", () => {
  throws(
    () => {
      del({ a: "b" });
    },
    /THROW_ID_27/g,
    "06.01",
  );
  throws(
    () => {
      del({ a: "b" }, "c");
    },
    /THROW_ID_27/g,
    "06.02",
  );
});

test("07 - arrayFirstOnly - when there's no input", () => {
  throws(
    () => {
      arrayFirstOnly();
    },
    /THROW_ID_31/g,
    "07.01",
  );
});

test("08 - del - throws when opts.key and opts.val are missing", () => {
  throws(
    () => {
      del({ a: "b" }, {});
    },
    /THROW_ID_28/g,
    "08.01",
  );
});

test("09 - get/set - throws when opts.index is missing", () => {
  throws(
    () => {
      get(defaultInput);
    },
    /THROW_ID_07/g,
    "09.01",
  );
  throws(
    () => {
      get(defaultInput, { a: "a" });
    },
    /THROW_ID_08/g,
    "09.02",
  );
  throws(
    () => {
      set(defaultInput);
    },
    /THROW_ID_13/g,
    "09.03",
  );
  throws(
    () => {
      set(defaultInput, { a: "a" });
    },
    /THROW_ID_14/g,
    "09.04",
  );
});

test("10 - get/set/drop - throws when opts.index is not a natural number (both string or number)", () => {
  throws(
    () => {
      get(defaultInput, { index: "1.5" });
    },
    /THROW_ID_11/g,
    "10.01",
  );
  throws(
    () => {
      get(defaultInput, { index: 1.5 });
    },
    /THROW_ID_11/g,
    "10.02",
  );
  throws(
    () => {
      set(defaultInput, { index: "1.5", val: "zzz" });
    },
    /THROW_ID_17/g,
    "10.03",
  );
  throws(
    () => {
      set(defaultInput, { index: 1.5, val: "zzz" });
    },
    /THROW_ID_17/g,
    "10.04",
  );
  throws(
    () => {
      drop(defaultInput, { index: "1.5" });
    },
    /THROW_ID_23/g,
    "10.05",
  );
  throws(
    () => {
      drop(defaultInput, { index: 1.5 });
    },
    /THROW_ID_23/g,
    "10.06",
  );
});

test("11 - set - throws when opts.key and opts.val are missing", () => {
  throws(
    () => {
      set(defaultInput, { index: "3" });
    },
    /THROW_ID_14/g,
    "11.01",
  );
});

test("12 - find - throws when opts.key and opts.val are missing", () => {
  throws(
    () => {
      find(defaultInput, { index: "3" });
    },
    /THROW_ID_03/g,
    "12.01",
  );
  throws(
    () => {
      find(defaultInput, { index: 3 });
    },
    /THROW_ID_03/g,
    "12.02",
  );
});

test("13 - del - throws when opts.key and opts.val are missing", () => {
  throws(
    () => {
      del(defaultInput, { index: "3" });
    },
    /THROW_ID_28/g,
    "13.01",
  );
  throws(
    () => {
      del(defaultInput, { index: 3 });
    },
    /THROW_ID_28/g,
    "13.02",
  );
});

test("14 - drop - throws when there's no index", () => {
  throws(
    () => {
      drop(["a"], "a");
    },
    /THROW_ID_20/g,
    "14.01",
  );
  throws(
    () => {
      drop({ a: "a" }, { b: "b" });
    },
    /THROW_ID_21/g,
    "14.02",
  );
});

test.run();
