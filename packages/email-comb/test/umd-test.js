import tap from "tap";
import { comb, defaults, version } from "../dist/email-comb.umd";

tap.test("UMD build works fine", (t) => {
  t.equal(comb("").result, "");
  t.ok(Object.keys(defaults).length);
  t.match(version, /\d+\.\d+\.\d+/);
  t.end();
});
