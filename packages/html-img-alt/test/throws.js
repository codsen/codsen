import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { alts } from "../dist/html-img-alt.esm.js";

// throws
// -----------------------------------------------------------------------------

test("01 - throws if encounters img tag within img tag", () => {
  throws(
    () => {
      alts('zzz<img alt="  <img />zzz');
    },
    /THROW_ID_02/g,
    "01.01",
  );
});

test("02 - throws if input is not string", () => {
  throws(
    () => {
      alts(null);
    },
    /THROW_ID_01/g,
    "02.01",
  );
  throws(
    () => {
      alts();
    },
    /THROW_ID_01/g,
    "02.02",
  );
  throws(
    () => {
      alts(undefined);
    },
    /THROW_ID_01/g,
    "02.03",
  );
  throws(
    () => {
      alts(111);
    },
    /THROW_ID_01/g,
    "02.04",
  );
  throws(
    () => {
      alts(true);
    },
    /THROW_ID_01/g,
    "02.05",
  );
});

test("03 - throws if opts is not a plain object", () => {
  throws(
    () => {
      alts("zzz", ["aaa"]);
    },
    /THROW_ID_02/g,
    "03.01",
  );
  not.throws(() => {
    alts("zzz", null); // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  }, "03.02");
  not.throws(() => {
    alts("zzz", undefined); // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  }, "03.03");
  throws(
    () => {
      alts("zzz", 1);
    },
    /THROW_ID_02/g,
    "03.02",
  );
  not.throws(() => {
    alts("zzz", {});
  }, "03.05");
  throws(
    () => {
      alts("zzz", { zzz: "yyy" }); // rogue keys - throws. WTF?
    },
    /THROW_ID_03/g,
    "03.03",
  );
});

test.run();
