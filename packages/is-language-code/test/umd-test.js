const t = require("tap");
const isLangCode = require("../dist/is-language-code.umd");

t.test("UMD build works fine", t => {
  t.ok(isLangCode(`de`));
  t.end();
});
