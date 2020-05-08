import tap from "tap";
import { pathUp } from "../dist/ast-monkey-util.umd";

// -----------------------------------------------------------------------------
// only incrementStringNumber, for the sake of the point
// -----------------------------------------------------------------------------

tap.test(`UMD build works fine`, (t) => {
  t.same(pathUp("9.children.3"), "9", "01");
  t.end();
});
