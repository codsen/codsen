import tap from "tap";
import { comb, defaults, version } from "../dist/email-comb.umd";

// UMD build
// -----------------------------------------------------------------------------

tap.test("UMD build works fine", (t) => {
  t.equal(comb("").result, "", "01.01");
  t.ok(Object.keys(defaults).length, "01.02");
  t.match(version, /\d+\.\d+\.\d+/, "01.03");
  t.end();
});
