import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

tap.test("01 - mix of real and imaginary tags", (t) => {
  t.hasStrict(
    stripHtml(`<tr><zz>a</zz></tr>`, {
      stripRecognisedHTMLOnly: false,
    }),
    { result: "a" },
    "01.01"
  );
  t.hasStrict(
    stripHtml(`<tr><zz>a</zz></tr>`, {
      stripRecognisedHTMLOnly: true,
    }),
    { result: "<zz>a</zz>" },
    "01.02"
  );
  t.end();
});
