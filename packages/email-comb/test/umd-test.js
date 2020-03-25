const t = require("tap");
const { comb, defaults, version } = require("../dist/email-comb.umd");

t.test("UMD build works fine", (t) => {
  t.equal(comb("").result, "");
  t.ok(Object.keys(defaults).length);
  t.match(version, /\d+\.\d+\.\d+/);
  t.end();
});
