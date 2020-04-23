import tap from "tap";
import { det, opts, version } from "../dist/detergent.umd";

tap.test("UMD build works fine", (t) => {
  t.equal(det("").res, "");
  t.equal(det("£").res, "&pound;");
  t.match(version, /\d+\.\d+\.\d+/);
  t.ok(Object.keys(opts).length);
  t.end();
});
