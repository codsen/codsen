import tap from "tap";
import { stripHtml as strip1 } from "../dist/string-strip-html.umd";
import { stripHtml as strip2 } from "../dist/string-strip-html.dev.umd";
import { stripHtml as strip3 } from "../dist/string-strip-html.cjs";

const source = "a<custom-tag /></ custom-tag>< /custom-tag>b";
const result = "a b";

tap.test("UMD build works fine", (t) => {
  t.match(strip1(source), { result }, "01");
  t.end();
});

tap.test("Dev UMD build works fine", (t) => {
  t.match(strip2(source), { result }, "02");
  t.end();
});

tap.test("CJS build works fine", (t) => {
  t.match(strip3(source), { result }, "03");
  t.end();
});
