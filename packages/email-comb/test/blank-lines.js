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

test("02 - retains the established cleanup inside tag syntax", () => {
  equal(
    comb('<body><div data-note="one\n  \ntwo">x</div></body>').result,
    '<body><div data-note="onetwo">x</div></body>',
    "02.01",
  );
  equal(
    comb("<body><! one\n  \ntwo ></body>", {
      removeHTMLComments: false,
    }).result,
    "<body><! onetwo ></body>",
    "02.02",
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

test.run();
