const t = require("tap");
const csvSort1 = require("../dist/csv-sort.umd");

t.test("UMD build works fine", t => {
  t.same(csvSort1(""), [[""]]);
  t.end();
});
