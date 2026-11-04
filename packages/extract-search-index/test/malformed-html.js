import { test } from "uvu";
import { equal } from "uvu/assert";

import { extract } from "../dist/extract-search-index.esm.js";

test("01 - excludes slash-separated and adjoining attributes from the index", () => {
  const inputs = [
    "<p/onclick=alert(1)>visible</p>",
    '<p style="a"/onclick=alert(1)>visible</p>',
    '<p style="a"onclick=alert(1)>visible</p>',
    "<p\n/onclick=alert(1)>visible</p>",
    '<div/onmouseover=alert(1) style="position:fixed;inset:0">visible</div>',
    "<p///onclick=alert(1)>visible</p>",
  ];

  equal(
    inputs.map(extract),
    inputs.map(() => "visible"),
    "01.01",
  );
});

test("02 - excludes unfinished comments and bogus markup through EOF", () => {
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
    tails.map((tail) => extract(`<p>visible</p>${tail}`)),
    tails.map(() => "visible"),
    "02.01",
  );
});

test.run();
