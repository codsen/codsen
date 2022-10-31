import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { cparser } from "../dist/codsen-parser.esm.js";

test("01", () => {
  throws(
    () => {
      cparser();
    },
    /THROW_ID_01/g,
    "01.01"
  );

  throws(
    () => {
      cparser(true);
    },
    /THROW_ID_02/g,
    "01.02"
  );

  throws(
    () => {
      cparser("a", "z");
    },
    /THROW_ID_03/g,
    "01.03"
  );

  throws(
    () => {
      cparser("a", { tagCb: "z" });
    },
    /THROW_ID_04/g,
    "01.04 - opts.tagCb() is wrong"
  );

  throws(
    () => {
      cparser("a", { charCb: "z" });
    },
    /THROW_ID_05/g,
    "01.05 - opts.charCb() is wrong"
  );

  throws(
    () => {
      cparser("a", { reportProgressFunc: "z" });
    },
    /THROW_ID_06/g,
    "01.06"
  );

  throws(
    () => {
      cparser("a", { errCb: "z" });
    },
    /THROW_ID_07/g,
    "01.07"
  );
});

test("02 - opts.tagCb", () => {
  let gathered = [];
  cparser("  <a>z", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(ok, gathered, [
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
  ]);
});

test("03 - opts.charCb", () => {
  let gathered = [];
  cparser("<a>z1", {
    charCb: (obj) => {
      gathered.push(obj);
    },
  });

  compare(
    ok,
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
});

test.run();
