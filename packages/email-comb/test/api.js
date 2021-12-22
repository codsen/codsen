import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

// consume plain, real comb, we're just testing the api
import { comb } from "../dist/email-comb.esm.js";

// api bits: throws and such
// -----------------------------------------------------------------------------

test("01 - wrong inputs", () => {
  throws(() => {
    comb();
  }, /THROW_ID_01/);
});

test("02 - wrong inputs", () => {
  throws(() => {
    comb(true);
  }, /THROW_ID_01/);
});

test("03 - wrong inputs", () => {
  throws(() => {
    comb(null);
  }, /THROW_ID_01/);
});

test("04 - wrong inputs", () => {
  throws(() => {
    comb({ a: "b" });
  }, /THROW_ID_01/);
});

test("05 - wrong inputs", () => {
  not.throws(() => {
    comb("");
  }, "05");
});

test("06 - wrong inputs", () => {
  not.throws(() => {
    comb("a");
  }, "06");
});

test("07 - wrong opts", () => {
  throws(() => {
    comb("", 1);
  }, /THROW_ID_02/);
});

test("08 - wrong inputs", () => {
  throws(() => {
    comb("", true);
  }, /THROW_ID_02/);
});

test("09 - wrong inputs", () => {
  throws(() => {
    comb("", { whitelist: 1 });
  }, /THROW_ID_03/);
});

test("10 - wrong inputs", () => {
  not.throws(() => {
    comb("", {});
  }, "10");
});

test("11 - wrong inputs", () => {
  not.throws(() => {
    comb("", null);
  }, "11");
});

test("12 - wrong inputs", () => {
  not.throws(() => {
    comb("", undefined);
  }, "12");
});

test("13 - wrong inputs", () => {
  throws(() => {
    comb("zzz", { whitelist: true });
  }, /THROW_ID_03/);
});

test("14 - wrong inputs", () => {
  not.throws(() => {
    comb("zzz", { whitelist: [] });
  }, "14");
});

test("15 - wrong inputs", () => {
  not.throws(() => {
    comb("zzz", { whitelist: "" });
  }, "15");
});

test("16 - wrong inputs", () => {
  not.throws(() => {
    comb("zzz", { whitelist: "a" });
  }, "16");
});

test("17 - wrong inputs", () => {
  throws(() => {
    comb("zzz", { whitelist: [true] });
  }, /THROW_ID_04/);
});

test("18 - wrong inputs, opts.backend", () => {
  throws(() => {
    comb("zzz", { backend: 1 });
  }, /THROW_ID_05/);
});

test("19 - wrong inputs, opts.backend", () => {
  throws(() => {
    comb("zzz", { backend: "a" });
  }, /THROW_ID_05/);
});

test("20 - wrong inputs, opts.backend", () => {
  throws(() => {
    comb("zzz", { backend: ["a"] }); // sneaky
  }, /THROW_ID_06/);
});

test("21 - wrong inputs, opts.backend", () => {
  throws(() => {
    comb("zzz", { backend: [{}] }); // objects have to have consistent schema: "heads" and "tails" keys
  }, "21");
});

test("22 - wrong inputs, opts.backend", () => {
  throws(() => {
    comb("zzz", { backend: [{ a: "b" }] }); // unrecognised keys
  }, /THROW_ID_07/);
});

test("23 - wrong inputs, opts.uglify", () => {
  not.throws(() => {
    comb("z", { uglify: 0 });
  }, "23");
});

test("24 - wrong inputs, opts.uglify", () => {
  not.throws(() => {
    comb("z", { uglify: 1 });
  }, "24");
});

test("25 - wrong inputs, opts.uglify", () => {
  throws(() => {
    comb("z", { uglify: "z" });
  }, /THROW_ID_08/);
});

test("26 - wrong inputs, opts.reportProgressFunc", () => {
  not.throws(() => {
    comb("z", { reportProgressFunc: 0 });
  }, "26");
});

test("27 - wrong inputs, opts.reportProgressFunc", () => {
  not.throws(() => {
    comb("z", { reportProgressFunc: false });
  }, "27");
});

test("28 - wrong inputs, opts.reportProgressFunc", () => {
  throws(() => {
    comb("z", { reportProgressFunc: "z" });
  }, /THROW_ID_09/);
});

test.run();
