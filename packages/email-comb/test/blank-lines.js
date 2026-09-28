import { test } from "uvu";
import { equal } from "uvu/assert";

import { comb } from "./util/util.js";

test("01 - preserves a separator between visible words", () => {
  equal(
    comb("<body>Hello\n  \nworld</body>").result,
    "<body>Hello\nworld</body>",
    "01.01",
  );
  equal(
    comb("<body>Hello\r\n \r\nworld</body>").result,
    "<body>Hello\nworld</body>",
    "01.02",
  );
  equal(
    comb("<body>Hello\n  \nworld</body>\n").result,
    "<body>Hello\nworld</body>\n",
    "01.03",
  );
  equal(
    comb("<body>Hello\r\n \r\nworld</body>\r\n").result,
    "<body>Hello\nworld</body>\r\n",
    "01.04",
  );
});

test("02 - blank lines close up between attributes but not inside values", () => {
  equal(
    comb('<body><div data-note="one\n  \ntwo">x</div></body>').result,
    '<body><div data-note="one\n  \ntwo">x</div></body>',
    "02.01",
  );
  equal(
    comb("<body><! one\n  \ntwo ></body>", {
      removeHTMLComments: false,
    }).result,
    "<body><! one two ></body>",
    "02.02",
  );
  equal(
    comb("<body><p title='a\n \nb'>x</p></body>").result,
    "<body><p title='a\n \nb'>x</p></body>",
    "02.03",
  );
  // the neighbours never join: "<p" and "title" would read "<ptitle"
  equal(
    comb("<body><p\n \ntitle=x>y</p></body>").result,
    "<body><p title=x>y</p></body>",
    "02.04",
  );
  equal(
    comb("<body><p title=a\n \nb>x</p></body>").result,
    "<body><p title=a b>x</p></body>",
    "02.05",
  );
  equal(comb("<body><br\n \n/></body>").result, "<body><br/></body>", "02.06");
  equal(
    comb('<p title="a\n \nb">x</p>').result,
    '<p title="a\n \nb">x</p>',
    "02.07",
  );
});

test("03 - preserves separators in protected regions", () => {
  equal(
    comb("<body><!-- one\n  \ntwo --></body>", {
      removeHTMLComments: false,
    }).result,
    "<body><!-- one\ntwo --></body>",
    "03.01",
  );
  equal(
    comb("<body><script>const value = `one\n  \ntwo`;</script></body>").result,
    "<body><script>const value = `one\n  \ntwo`;</script></body>",
    "03.02",
  );
  equal(
    comb('<style>.one {\n  \ncolor: red;}</style><body class="one"></body>')
      .result,
    '<style>.one { color: red;}</style><body class="one"></body>',
    "03.03",
  );
  equal(
    comb('<body><div data-value="{{ one\n  \ntwo }}">x</div></body>', {
      backend: [{ heads: "{{", tails: "}}" }],
    }).result,
    '<body><div data-value="{{ one\ntwo }}">x</div></body>',
    "03.04",
  );
});

test("04 - preformatted and raw text keep their blank lines", () => {
  for (const source of [
    "<pre>keep\n \n  this</pre>",
    "<PRE>keep\n \n  this</PRE>",
    "<pre><b>keep</b>\n \n  this</pre>",
    "<textarea>keep\n \n  this</textarea>",
    "<xmp>keep\n \n  this</xmp>",
  ]) {
    equal(comb(source).result, source, "04.01");
  }
  // text after the element closes up again
  equal(
    comb("<pre>a</pre>\n \n<p>b</p>").result,
    "<pre>a</pre>\n<p>b</p>",
    "04.02",
  );
});

test.run();
