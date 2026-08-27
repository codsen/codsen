import { test } from "uvu";
import { equal } from "uvu/assert";

import { comb } from "./util/util.js";

test("01 - matches mixed-case class, id, and style attributes", () => {
  const source =
    '<style>.used{color:red}#target{display:block}</style><body><div CLASS="used" ID="target" STYLE="color:red;/* remove */">x</div></body>';
  const actual = comb(source);

  equal(
    actual.result,
    '<style>.used{color:red}#target{display:block}</style><body><div CLASS="used" ID="target" STYLE="color:red;">x</div></body>',
    "01.01",
  );
  equal(actual.allInHead, [".used", "#target"], "01.02");
  equal(actual.allInBody, [".used", "#target"], "01.03");
});

test("02 - accepts quoted and unquoted values around HTML whitespace", () => {
  const actual = comb(
    '<style>.used{color:red}#target{display:block}</style><body><div class= used id = target>x</div><p CLASS \t=\n"used" ID\n=\t"target">y</p></body>',
  );

  equal(
    actual.result,
    '<style>.used{color:red}#target{display:block}</style><body><div class=used id=target>x</div><p CLASS="used" ID="target">y</p></body>',
    "02.01",
  );
  equal(actual.deletedFromHead, [], "02.02");
  equal(actual.deletedFromBody, [], "02.03");
});

test("03 - ignores attribute-like text outside opening tags", () => {
  const source =
    '<body><p>Write class="ghost" and id="copy".</p><!-- class="ghost" --><script>const value = `id="copy"`;</script></body>';
  const actual = comb(source, { removeHTMLComments: false });

  equal(actual.result, source, "03.01");
  equal(actual.allInBody, [], "03.02");
});

test("04 - removes CSS comments only from real style attributes", () => {
  equal(
    comb(
      '<body><div STYLE="color:red;/* remove */">x</div><div style = "color:blue;/* remove */">y</div><div style=color:green;/*remove*/>z</div></body>',
    ).result,
    '<body><div STYLE="color:red;">x</div><div style = "color:blue;">y</div><div style=color:green;>z</div></body>',
    "04.01",
  );
  equal(
    comb(
      '<body><p>style="color:red;/* keep */"</p><!-- style="color:blue;/* keep */" --><script>const value = `style="color:green;/* keep */"`;</script></body>',
      { removeHTMLComments: false },
    ).result,
    '<body><p>style="color:red;/* keep */"</p><!-- style="color:blue;/* keep */" --><script>const value = `style="color:green;/* keep */"`;</script></body>',
    "04.02",
  );
});

test("05 - preserves URLs and configured backend markers", () => {
  equal(
    comb(
      '<body><a href="https://example.com/?class=%22ghost%22&id=copy">Write class="ghost".</a></body>',
    ).result,
    '<body><a href="https://example.com/?class=%22ghost%22&id=copy">Write class="ghost".</a></body>',
    "05.01",
  );
  equal(
    comb(
      '<style>.used{color:red}</style><body><div CLASS="{{ dynamic }} used">x</div></body>',
      { backend: [{ heads: "{{", tails: "}}" }] },
    ).result,
    '<style>.used{color:red}</style><body><div CLASS="{{ dynamic }} used">x</div></body>',
    "05.02",
  );
});

test.run();
