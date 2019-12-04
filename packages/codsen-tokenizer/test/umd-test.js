const t = require("tap");
const ct = require("../dist/codsen-tokenizer.umd");

t.test("UMD build works fine", t => {
  const gathered = [];
  ct("<a>", obj => {
    gathered.push(obj);
  });
  t.ok(gathered.length);
  t.end();
});
