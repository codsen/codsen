const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");
// const deepContains = require("ast-deep-contains");

// 00. api
// -----------------------------------------------------------------------------

t.test("00.01 - 1st arg missing", (t) => {
  t.throws(
    () => {
      ct();
    },
    /THROW_ID_01/g,
    "00.01"
  );
  t.end();
});

t.test("00.02 - 1st arg of a wrong type", (t) => {
  t.throws(
    () => {
      ct(true);
    },
    /THROW_ID_02/g,
    "00.02"
  );
  t.end();
});

t.test("00.03 - 2nd arg (opts) is wrong", (t) => {
  t.throws(
    () => {
      ct("a", "z");
    },
    /THROW_ID_03/g,
    "00.03"
  );
  t.end();
});

t.test("00.04 - opts.tagCb() is wrong", (t) => {
  t.throws(
    () => {
      ct("a", { tagCb: "z" });
    },
    /THROW_ID_04/g,
    "00.04"
  );
  t.end();
});

t.test("00.05 - opts.charCb() is wrong", (t) => {
  t.throws(
    () => {
      ct("a", { charCb: "z" });
    },
    /THROW_ID_05/g,
    "00.05"
  );
  t.end();
});

t.test("00.06 - opts.reportProgressFunc is wrong", (t) => {
  t.throws(
    () => {
      ct("a", { reportProgressFunc: "z" });
    },
    /THROW_ID_06/g,
    "00.06"
  );
  t.end();
});
