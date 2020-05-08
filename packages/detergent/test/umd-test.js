import tap from "tap";
import { det, opts, version } from "../dist/detergent.umd";

tap.test("UMD build works fine", (t) => {
  t.equal(det("").res, "", "01.01");
  t.equal(det("£").res, "&pound;", "01.02");
  t.match(version, /\d+\.\d+\.\d+/, "01.03");
  t.ok(Object.keys(opts).length, "01.04");
  t.end();
});
