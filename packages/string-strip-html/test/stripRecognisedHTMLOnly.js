import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

test("01 - mix of real and imaginary tags", () => {
  equal(
    stripHtml(`<tr><zz>a</zz></tr>`, {
      stripRecognisedHTMLOnly: false,
    }).result,
    "a",
    "01.01"
  );
  equal(
    stripHtml(`<tr><zz>a</zz></tr>`, {
      stripRecognisedHTMLOnly: true,
    }).result,
    "<zz>a</zz>",
    "01.02"
  );
});

test.run();
