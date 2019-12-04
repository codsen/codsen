const t = require("tap");
const { allNamedEntities } = require("../dist/all-named-html-entities.umd");

t.test("UMD build works fine", t => {
  t.ok(Object.keys(allNamedEntities).length);
  t.end();
});
