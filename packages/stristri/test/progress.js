import { test } from "uvu";
import * as assert from "uvu/assert";

import { stri as stri2 } from "../dist/stristri.esm.js";
// import { stri, mixer } from "./util/util.js";

test("01 - large input", () => {
  let gathered = [];
  let source = "<div>{% if something %}text";
  let res = stri2(source, {
    html: true,
    css: true,
    text: true,
    templatingTags: true,
    reportProgressFunc: (val) => {
      gathered.push(val);
    },
  });

  assert.equal(res.result, "", "01.01");
  assert.equal(gathered, [], "01.02");
});

test("02 - large input", () => {
  let gathered = [];
  let source = "<div>{% if something %}text".repeat(1000);
  let res = stri2(source, {
    html: true,
    css: true,
    text: true,
    templatingTags: true,
    reportProgressFunc: (val) => {
      gathered.push(val);
    },
  });

  assert.equal(res.result, "", "02.01");
  assert.ok(gathered.length > 90, "02.02");
});

test.run();
