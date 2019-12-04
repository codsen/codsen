const t = require("tap");
const { crush, defaults, version } = require("../dist/html-crush.umd");

t.test("UMD build works fine", t => {
  t.equal(crush("<div>   <div>").result, "<div> <div>");
  t.match(version, /\d+\.\d+\.\d+/);
  t.ok(Object.keys(defaults).length);
  t.end();
});
