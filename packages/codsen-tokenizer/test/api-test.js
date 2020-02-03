const t = require("tap");
const ct = require("../dist/codsen-tokenizer.cjs");
// const deepContains = require("ast-deep-contains");

// 00. api
// -----------------------------------------------------------------------------

t.throws(
  "00.01 - 1st arg missing",
  () => {
    ct();
  },
  /THROW_ID_01/g,
  "00.01"
);

t.throws(
  "00.02 - 1st arg of a wrong type",
  () => {
    ct(true);
  },
  /THROW_ID_02/g,
  "00.02"
);

t.throws(
  "00.03 - 2nd arg (opts) is wrong",
  () => {
    ct("a", "z");
  },
  /THROW_ID_03/g,
  "00.03"
);

t.throws(
  () => {
    ct("a", { tagCb: "z" });
  },
  /THROW_ID_04/g,
  "00.04 - opts.tagCb() is wrong"
);

t.throws(
  () => {
    ct("a", { charCb: "z" });
  },
  /THROW_ID_05/g,
  "00.05 - opts.charCb() is wrong"
);

t.throws(
  "00.06 - opts.reportProgressFunc is wrong",
  () => {
    ct("a", { reportProgressFunc: "z" });
  },
  /THROW_ID_06/g,
  "00.06"
);
