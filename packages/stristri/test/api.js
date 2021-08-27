import tap from "tap";
import { stri as stri2, defaults } from "../dist/stristri.esm.js";
import {
  // stri,
  mixer,
} from "./util/util.js";

const fn = () => {};

// throws
// -----------------------------------------------------------------------------

tap.test(`01 - the first input arg is wrong`, (t) => {
  t.throws(() => {
    stri2();
  }, /THROW_ID_01/gm);
  t.end();
});

tap.test(`02 - the first input arg is wrong`, (t) => {
  t.throws(() => {
    stri2(true);
  }, /THROW_ID_01/gm);
  t.end();
});

tap.test(`03 - the first input arg is wrong`, (t) => {
  t.throws(() => {
    stri2(fn);
  }, /THROW_ID_01/gm);
  t.end();
});

tap.test(`04 - the second input arg is wrong`, (t) => {
  t.throws(() => {
    stri2("", true);
  }, /THROW_ID_02/gm);
  t.end();
});

tap.test(`05 - the second input arg is wrong`, (t) => {
  t.throws(() => {
    stri2("", fn);
  }, /THROW_ID_02/gm);
  t.end();
});

// edge cases
// -----------------------------------------------------------------------------

tap.test(`06 - testing api directly`, (t) => {
  const res = stri2("");
  t.match(
    res,
    {
      log: {},
      result: "",
      ranges: null,
      applicableOpts: {
        html: false,
        css: false,
        text: false,
        templatingTags: false,
      },
      templatingLang: { name: null },
    },
    "06.01"
  );
  // exact duration is unpredictable, so we check for truthiness only
  t.ok(res.log.timeTakenInMilliseconds, "06.02");
  t.end();
});

tap.test(`07`, (t) => {
  t.equal(stri2(" ").result, "", "07");
  t.end();
});

tap.test(`08`, (t) => {
  t.equal(stri2("\n\n\n").result, "", "08");
  t.end();
});

tap.test(`09 - ensure mixer is generating variations`, (t) => {
  t.equal(
    mixer({}, defaults).length,
    2 **
      Object.keys(defaults).filter((key) => typeof defaults[key] === "boolean")
        .length,
    "09"
  );
  t.end();
});
