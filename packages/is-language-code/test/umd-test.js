import tap from "tap";
import isLangCode from "../dist/is-language-code.umd";

tap.test("UMD build works fine", (t) => {
  t.ok(isLangCode(`de`));
  t.end();
});
