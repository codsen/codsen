import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// consume plain, real comb, we're just testing the api
import { comb } from "../dist/email-comb.esm.js";

// api bits: throws and such
// -----------------------------------------------------------------------------

test("01 - wrong inputs", () => {
  throws(
    () => {
      comb();
    },
    /THROW_ID_01/,
    "01.01",
  );
});

test("02 - wrong inputs", () => {
  throws(
    () => {
      comb(true);
    },
    /THROW_ID_01/,
    "02.01",
  );
});

test("03 - wrong inputs", () => {
  throws(
    () => {
      comb(null);
    },
    /THROW_ID_01/,
    "03.01",
  );
});

test("04 - wrong inputs", () => {
  throws(
    () => {
      comb({ a: "b" });
    },
    /THROW_ID_01/,
    "04.01",
  );
});

test("05 - wrong inputs", () => {
  not.throws(() => {
    comb("");
  }, "05.01");
});

test("06 - wrong inputs", () => {
  not.throws(() => {
    comb("a");
  }, "06.01");
});

test("07 - wrong opts", () => {
  throws(
    () => {
      comb("", 1);
    },
    /THROW_ID_02/,
    "07.01",
  );
});

test("08 - wrong inputs", () => {
  throws(
    () => {
      comb("", true);
    },
    /THROW_ID_02/,
    "08.01",
  );
});

test("09 - wrong inputs", () => {
  throws(
    () => {
      comb("", { whitelist: 1 });
    },
    /THROW_ID_03/,
    "09.01",
  );
});

test("10 - wrong inputs", () => {
  not.throws(() => {
    comb("", {});
  }, "10.01");
});

test("11 - wrong inputs", () => {
  not.throws(() => {
    comb("", null);
  }, "11.01");
});

test("12 - wrong inputs", () => {
  not.throws(() => {
    comb("", undefined);
  }, "12.01");
});

test("13 - wrong inputs", () => {
  throws(
    () => {
      comb("zzz", { whitelist: true });
    },
    /THROW_ID_03/,
    "13.01",
  );
});

test("14 - wrong inputs", () => {
  not.throws(() => {
    comb("zzz", { whitelist: [] });
  }, "14.01");
});

test("15 - wrong inputs", () => {
  not.throws(() => {
    comb("zzz", { whitelist: "" });
  }, "15.01");
});

test("16 - wrong inputs", () => {
  not.throws(() => {
    comb("zzz", { whitelist: "a" });
  }, "16.01");
});

test("17 - wrong inputs", () => {
  throws(
    () => {
      comb("zzz", { whitelist: [true] });
    },
    /THROW_ID_04/,
    "17.01",
  );
});

test("18 - wrong inputs, opts.backend", () => {
  throws(
    () => {
      comb("zzz", { backend: 1 });
    },
    /THROW_ID_05/,
    "18.01",
  );
});

test("19 - wrong inputs, opts.backend", () => {
  throws(
    () => {
      comb("zzz", { backend: "a" });
    },
    /THROW_ID_05/,
    "19.01",
  );
});

test("20 - wrong inputs, opts.backend", () => {
  throws(
    () => {
      comb("zzz", { backend: ["a"] }); // sneaky
    },
    /THROW_ID_06/,
    "20.01",
  );
});

test("21 - wrong inputs, opts.backend", () => {
  throws(
    () => {
      comb("zzz", { backend: [{}] }); // objects have to have consistent schema: "heads" and "tails" keys
    },
    "21.01",
    "21.01",
  );
});

test("22 - wrong inputs, opts.backend", () => {
  throws(
    () => {
      comb("zzz", { backend: [{ a: "b" }] }); // unrecognised keys
    },
    /THROW_ID_07/,
    "22.01",
  );
});

test("23 - wrong inputs, opts.uglify", () => {
  not.throws(() => {
    comb("z", { uglify: 0 });
  }, "23.01");
});

test("24 - wrong inputs, opts.uglify", () => {
  not.throws(() => {
    comb("z", { uglify: 1 });
  }, "24.01");
});

test("25 - wrong inputs, opts.uglify", () => {
  throws(
    () => {
      comb("z", { uglify: "z" });
    },
    /THROW_ID_08/,
    "25.01",
  );
});

test("26 - wrong inputs, opts.reportProgressFunc", () => {
  not.throws(() => {
    comb("z", { reportProgressFunc: 0 });
  }, "26.01");
});

test("27 - wrong inputs, opts.reportProgressFunc", () => {
  not.throws(() => {
    comb("z", { reportProgressFunc: false });
  }, "27.01");
});

test("28 - wrong inputs, opts.reportProgressFunc", () => {
  throws(
    () => {
      comb("z", { reportProgressFunc: "z" });
    },
    /THROW_ID_09/,
    "28.01",
  );
});

test.run();
