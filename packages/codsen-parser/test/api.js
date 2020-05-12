import tap from "tap";
import cparser from "../dist/codsen-parser.esm";

tap.throws(
  "00.01 - 1st arg missing",
  () => {
    cparser();
  },
  /THROW_ID_01/g,
  "00.01"
);

tap.throws(
  "00.02 - 1st arg of a wrong type",
  () => {
    cparser(true);
  },
  /THROW_ID_02/g,
  "00.02"
);

tap.throws(
  "00.03 - 2nd arg (opts) is wrong",
  () => {
    cparser("a", "z");
  },
  /THROW_ID_03/g,
  "00.03"
);

tap.throws(
  () => {
    cparser("a", { tagCb: "z" });
  },
  /THROW_ID_04/g,
  "00.04 - opts.tagCb() is wrong"
);

tap.throws(
  () => {
    cparser("a", { charCb: "z" });
  },
  /THROW_ID_05/g,
  "00.05 - opts.charCb() is wrong"
);

tap.throws(
  "00.06 - opts.reportProgressFunc is wrong",
  () => {
    cparser("a", { reportProgressFunc: "z" });
  },
  /THROW_ID_06/g,
  "00.06"
);

tap.throws(
  "00.07 - opts.errCb is wrong",
  () => {
    cparser("a", { errCb: "z" });
  },
  /THROW_ID_07/g,
  "00.07"
);

tap.test("01 - opts.tagCb", (t) => {
  const gathered = [];
  cparser("  <a>z", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 2,
      },
      {
        type: "tag",
        start: 2,
        end: 5,
      },
      {
        type: "text",
        start: 5,
        end: 6,
      },
    ],
    "01"
  );
  t.end();
});

tap.test("02 - opts.charCb", (t) => {
  const gathered = [];
  cparser("<a>z1", {
    charCb: (obj) => {
      gathered.push(obj);
    },
  });

  t.match(
    gathered,
    [
      {
        chr: "<",
        i: 0,
        type: "tag",
      },
      {
        chr: "a",
        i: 1,
        type: "tag",
      },
      {
        chr: ">",
        i: 2,
        type: "tag",
      },
      {
        chr: "z",
        i: 3,
        type: "text",
      },
      {
        chr: "1",
        i: 4,
        type: "text",
      },
    ],
    "02"
  );
  t.end();
});
