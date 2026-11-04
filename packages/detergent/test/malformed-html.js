import { test } from "uvu";
import { equal } from "uvu/assert";

import { det } from "../dist/detergent.esm.js";

test("001 - strips tags containing slash-separated and adjoining attributes", () => {
  const inputs = [
    "<p/onclick=alert(1)>visible</p>",
    '<p style="a"/onclick=alert(1)>visible</p>',
    '<p style="a"onclick=alert(1)>visible</p>',
    "<p\n/onclick=alert(1)>visible</p>",
    '<div/onmouseover=alert(1) style="position:fixed;inset:0">visible</div>',
    "<p///onclick=alert(1)>visible</p>",
  ];

  equal(
    inputs.map(
      (input) => det(input, { stripHtml: true, removeWidows: false }).res,
    ),
    inputs.map(() => "visible"),
    "001.01",
  );
});

test("002 - strips unfinished comments and bogus markup through EOF", () => {
  const tails = [
    "<![CDATA[",
    "<![CDATA[ private",
    "<![if private]>",
    "<!--",
    "<!-- private",
    "<?",
    "<!",
    "</3",
  ];

  equal(
    tails.map(
      (tail) =>
        det(`<p>visible</p>${tail}`, {
          stripHtml: true,
          removeWidows: false,
        }).res,
    ),
    tails.map(() => "visible"),
    "002.01",
  );
});

test.run();
