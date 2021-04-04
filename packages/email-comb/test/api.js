import tap from "tap";
// consume plain, real comb, we're just testing the api
import { comb } from "../dist/email-comb.esm";

// api bits: throws and such
// -----------------------------------------------------------------------------

tap.test("01 - wrong inputs", (t) => {
  t.throws(() => {
    comb();
  }, /THROW_ID_01/);
  t.end();
});

tap.test("02 - wrong inputs", (t) => {
  t.throws(() => {
    comb(true);
  }, /THROW_ID_01/);
  t.end();
});

tap.test("03 - wrong inputs", (t) => {
  t.throws(() => {
    comb(null);
  }, /THROW_ID_01/);
  t.end();
});

tap.test("04 - wrong inputs", (t) => {
  t.throws(() => {
    comb({ a: "b" });
  }, /THROW_ID_01/);
  t.end();
});

tap.test("05 - wrong inputs", (t) => {
  t.doesNotThrow(() => {
    comb("");
  }, "05");
  t.end();
});

tap.test("06 - wrong inputs", (t) => {
  t.doesNotThrow(() => {
    comb("a");
  }, "06");
  t.end();
});

tap.test("07 - wrong opts", (t) => {
  t.throws(() => {
    comb("", 1);
  }, /THROW_ID_02/);
  t.end();
});

tap.test("08 - wrong inputs", (t) => {
  t.throws(() => {
    comb("", true);
  }, /THROW_ID_02/);
  t.end();
});

tap.test("09 - wrong inputs", (t) => {
  t.throws(() => {
    comb("", { whitelist: 1 });
  }, /THROW_ID_03/);
  t.end();
});

tap.test("10 - wrong inputs", (t) => {
  t.doesNotThrow(() => {
    comb("", {});
  }, "10");
  t.end();
});

tap.test("11 - wrong inputs", (t) => {
  t.doesNotThrow(() => {
    comb("", null);
  }, "11");
  t.end();
});

tap.test("12 - wrong inputs", (t) => {
  t.doesNotThrow(() => {
    comb("", undefined);
  }, "12");
  t.end();
});

tap.test("13 - wrong inputs", (t) => {
  t.throws(() => {
    comb("zzz", { whitelist: true });
  }, /THROW_ID_03/);
  t.end();
});

tap.test("14 - wrong inputs", (t) => {
  t.doesNotThrow(() => {
    comb("zzz", { whitelist: [] });
  }, "14");
  t.end();
});

tap.test("15 - wrong inputs", (t) => {
  t.doesNotThrow(() => {
    comb("zzz", { whitelist: "" });
  }, "15");
  t.end();
});

tap.test("16 - wrong inputs", (t) => {
  t.doesNotThrow(() => {
    comb("zzz", { whitelist: "a" });
  }, "16");
  t.end();
});

tap.test("17 - wrong inputs", (t) => {
  t.throws(() => {
    comb("zzz", { whitelist: [true] });
  }, /THROW_ID_04/);
  t.end();
});

tap.test("18 - wrong inputs, opts.backend", (t) => {
  t.throws(() => {
    comb("zzz", { backend: 1 });
  }, /THROW_ID_05/);
  t.end();
});

tap.test("19 - wrong inputs, opts.backend", (t) => {
  t.throws(() => {
    comb("zzz", { backend: "a" });
  }, /THROW_ID_05/);
  t.end();
});

tap.test("20 - wrong inputs, opts.backend", (t) => {
  t.throws(() => {
    comb("zzz", { backend: ["a"] }); // sneaky
  }, /THROW_ID_06/);
  t.end();
});

tap.test("21 - wrong inputs, opts.backend", (t) => {
  t.throws(() => {
    comb("zzz", { backend: [{}] }); // objects have to have consistent schema: "heads" and "tails" keys
  }, "21");
  t.end();
});

tap.test("22 - wrong inputs, opts.backend", (t) => {
  t.throws(() => {
    comb("zzz", { backend: [{ a: "b" }] }); // unrecognised keys
  }, /THROW_ID_07/);
  t.end();
});

tap.test("23 - wrong inputs, opts.uglify", (t) => {
  t.doesNotThrow(() => {
    comb("z", { uglify: 0 });
  }, "23");
  t.end();
});

tap.test("24 - wrong inputs, opts.uglify", (t) => {
  t.doesNotThrow(() => {
    comb("z", { uglify: 1 });
  }, "24");
  t.end();
});

tap.test("25 - wrong inputs, opts.uglify", (t) => {
  t.throws(() => {
    comb("z", { uglify: "z" });
  }, /THROW_ID_08/);
  t.end();
});

tap.test("26 - wrong inputs, opts.reportProgressFunc", (t) => {
  t.doesNotThrow(() => {
    comb("z", { reportProgressFunc: 0 });
  }, "26");
  t.end();
});

tap.test("27 - wrong inputs, opts.reportProgressFunc", (t) => {
  t.doesNotThrow(() => {
    comb("z", { reportProgressFunc: false });
  }, "27");
  t.end();
});

tap.test("28 - wrong inputs, opts.reportProgressFunc", (t) => {
  t.throws(() => {
    comb("z", { reportProgressFunc: "z" });
  }, /THROW_ID_09/);
  t.end();
});
