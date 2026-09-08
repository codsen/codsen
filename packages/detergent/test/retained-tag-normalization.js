import { test } from "uvu";
import { equal } from "uvu/assert";
import { det } from "../dist/detergent.esm.js";

test("001 - normalizes each retained closing tag only once", () => {
  const sources = [
    "<style></style>",
    "<style>a{color:red}</style>",
    "<script>x</script>",
    "<xml>x</xml>",
    "<pre>x</pre>",
  ];
  for (const source of sources) {
    for (const useXHTML of [false, true]) {
      equal(det(source, { stripHtml: false, useXHTML }).res, source, "001.01");
    }
  }
});

test("002 - default stripping still removes configured raw contents", () => {
  equal(det("<style>a{color:red}</style><b>x</b>").res, "<b>x</b>", "002.01");
  equal(det("<script>x</script><b>y</b>").res, "<b>y</b>", "002.02");
  equal(det("<xml>x</xml><b>y</b>").res, "<b>y</b>", "002.03");
  equal(det("<pre>x</pre>").res, "x", "002.04");
});

test.run();
