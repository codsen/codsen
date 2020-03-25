const t = require("tap");
const { det, opts, version } = require("../dist/detergent.umd");

t.test("UMD build works fine", (t) => {
  t.equal(det("").res, "");
  t.equal(det("£").res, "&pound;");
  t.match(version, /\d+\.\d+\.\d+/);
  t.ok(Object.keys(opts).length);
  t.end();
});
