import tap from "tap";
import { stri as stri2 } from "../dist/stristri.esm";
// import { stri, mixer } from "./util/util";

tap.test(`01 - large input`, (t) => {
  const gathered = [];
  const source = "<div>{% if something %}text";
  const res = stri2(source, {
    html: true,
    css: true,
    text: true,
    templatingTags: true,
    reportProgressFunc: (val) => {
      gathered.push(val);
    },
  });

  t.equal(res.result, "", "01.01");
  t.strictSame(gathered, [], "01.02");
  t.end();
});

tap.test(`02 - large input`, (t) => {
  const gathered = [];
  const source = "<div>{% if something %}text".repeat(1000);
  const res = stri2(source, {
    html: true,
    css: true,
    text: true,
    templatingTags: true,
    reportProgressFunc: (val) => {
      gathered.push(val);
    },
  });

  t.equal(res.result, "", "02.01");
  t.ok(gathered.length > 90, "02.02");
  t.end();
});
