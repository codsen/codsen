// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  arrayFirstOnly,
  del,
  drop,
  find,
  get,
  set,
} from "../dist/ast-monkey.esm.js";

const defaultInput = {
  a: { b: [{ c: { d: "e" } }] },
  c: { d: "e" },
};

// -----------------------------------------------------------------------------

test("01 - find - throws when the input argument is omitted", () => {
  throws(
    () => {
      find();
    },
    /THROW_ID_01/g,
    "01.01",
  );
});

test("02 - get - throws when the input argument is omitted", () => {
  throws(
    () => {
      get();
    },
    /THROW_ID_06/g,
    "02.01",
  );
});

test("03 - set - throws when the input argument is omitted", () => {
  throws(
    () => {
      set();
    },
    /THROW_ID_12/g,
    "03.01",
  );
});

test("04 - drop - throws when the input argument is omitted", () => {
  throws(
    () => {
      drop();
    },
    /THROW_ID_19/g,
    "04.01",
  );
});

test("05 - del - throws when the input argument is omitted", () => {
  throws(
    () => {
      del();
    },
    /THROW_ID_24/g,
    "05.01",
  );
});

test("06 - del - throws when opts is not a plain object", () => {
  throws(
    () => {
      del({ a: "b" });
    },
    /THROW_ID_25/g,
    "06.01",
  );
  throws(
    () => {
      del({ a: "b" }, "c");
    },
    /THROW_ID_25/g,
    "06.02",
  );
});

test("07 - arrayFirstOnly - when there's no input", () => {
  throws(
    () => {
      arrayFirstOnly();
    },
    /THROW_ID_30/g,
    "07.01",
  );
});

test("08 - del - throws when opts.key and opts.val are missing", () => {
  throws(
    () => {
      del({ a: "b" }, {});
    },
    /THROW_ID_26/g,
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
    /THROW_ID_09/g,
    "10.01",
  );
  throws(
    () => {
      get(defaultInput, { index: 1.5 });
    },
    /THROW_ID_09/g,
    "10.02",
  );
  throws(
    () => {
      set(defaultInput, { index: "1.5", val: "zzz" });
    },
    /THROW_ID_16/g,
    "10.03",
  );
  throws(
    () => {
      set(defaultInput, { index: 1.5, val: "zzz" });
    },
    /THROW_ID_16/g,
    "10.04",
  );
  throws(
    () => {
      drop(defaultInput, { index: "1.5" });
    },
    /THROW_ID_22/g,
    "10.05",
  );
  throws(
    () => {
      drop(defaultInput, { index: 1.5 });
    },
    /THROW_ID_22/g,
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
    /THROW_ID_02/g,
    "12.01",
  );
  throws(
    () => {
      find(defaultInput, { index: 3 });
    },
    /THROW_ID_02/g,
    "12.02",
  );
});

test("13 - del - throws when opts.key and opts.val are missing", () => {
  throws(
    () => {
      del(defaultInput, { index: "3" });
    },
    /THROW_ID_26/g,
    "13.01",
  );
  throws(
    () => {
      del(defaultInput, { index: 3 });
    },
    /THROW_ID_26/g,
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

test("15 - delegated validation errors retain caller prefixes", () => {
  throws(
    () => {
      find(defaultInput, { key: 1 });
    },
    /^ast-monkey\/find\(\): \[THROW_ID_03]/,
    "15.01",
  );
  throws(
    () => {
      set(defaultInput, { index: 1, key: 1 });
    },
    /^ast-monkey\/set\(\): \[THROW_ID_17]/,
    "15.02",
  );
  throws(
    () => {
      del(defaultInput, { key: 1 });
    },
    /^ast-monkey\/del\(\): \[THROW_ID_27]/,
    "15.03",
  );
  for (const [thrownValue, label] of [
    [new TypeError("raw validator dependency error"), "15.04"],
    ["raw non-error value", "15.05"],
  ]) {
    const key = {};
    Object.defineProperty(key, Symbol.toStringTag, {
      get() {
        throw thrownValue;
      },
    });
    throws(
      () => {
        find(defaultInput, { key });
      },
      /^ast-monkey\/find\(\): \[THROW_ID_03]/,
      label,
    );
  }
});

test.run();
