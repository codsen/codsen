import { test } from "uvu";
import * as assert from "uvu/assert";

import { stri as stri2, defaults } from "../dist/stristri.esm.js";
import {
  // stri,
  mixer,
} from "./util/util.js";

const fn = () => {};

// throws
// -----------------------------------------------------------------------------

test(`01 - the first input arg is wrong`, () => {
  assert.throws(() => {
    stri2();
  }, /THROW_ID_01/gm);
});

test(`02 - the first input arg is wrong`, () => {
  assert.throws(() => {
    stri2(true);
  }, /THROW_ID_01/gm);
});

test(`03 - the first input arg is wrong`, () => {
  assert.throws(() => {
    stri2(fn);
  }, /THROW_ID_01/gm);
});

test(`04 - the second input arg is wrong`, () => {
  assert.throws(() => {
    stri2("", true);
  }, /THROW_ID_02/gm);
});

test(`05 - the second input arg is wrong`, () => {
  assert.throws(() => {
    stri2("", fn);
  }, /THROW_ID_02/gm);
});

// edge cases
// -----------------------------------------------------------------------------

test(`06 - testing api directly`, () => {
  let { result, applicableOpts, templatingLang, log } = stri2("");
  assert.equal(
    { result, applicableOpts, templatingLang },
    {
      result: "",
      applicableOpts: {
        html: false,
        css: false,
        text: false,
        templatingTags: false,
        js: false,
      },
      templatingLang: { name: null },
    },
    "06.01"
  );
  // exact duration is unpredictable, so we check for truthiness only
  assert.ok(log.timeTakenInMilliseconds, "06.02");
});

test(`07`, () => {
  assert.equal(stri2(" ").result, "", "07.01");
});

test(`08`, () => {
  assert.equal(stri2("\n\n\n").result, "", "08.01");
});

test(`09 - ensure mixer is generating variations`, () => {
  assert.equal(
    mixer({}, defaults).length,
    2 **
      Object.keys(defaults).filter((key) => typeof defaults[key] === "boolean")
        .length,
    "09.01"
  );
});

test.run();
