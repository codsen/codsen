import tap from "tap";
import strip1 from "../dist/string-strip-html.umd";

const source = "a<custom-tag /></ custom-tag>< /custom-tag>b";
const res = "a b";

tap.test("UMD build works fine", (t) => {
  t.same(strip1(source), res, "01");
  t.end();
});
