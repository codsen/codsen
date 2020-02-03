const t = require("tap");
const ct = require("../dist/codsen-parser.umd");

t.test("UMD build works fine", t => {
  const gathered = [];
  ct("<a>", {
    tagCb: obj => {
      gathered.push(obj);
    }
  });
  t.ok(gathered.length);
  t.end();
});
