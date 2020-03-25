const t = require("tap");
const { pathUp } = require("../dist/ast-monkey-util.umd");

// -----------------------------------------------------------------------------
// only incrementStringNumber, for the sake of the point
// -----------------------------------------------------------------------------

t.test(`UMD build works fine`, (t) => {
  t.same(pathUp("9.children.3"), "9");
  t.end();
});
