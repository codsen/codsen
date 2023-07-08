import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isAttrClosing as isCl } from "../dist/is-html-attribute-closing.esm.js";
import { combinations } from "./util/util.js";
// const BACKSLASH = "\u005C";

// healthy code
// -----------------------------------------------------------------------------

test("01 - one tag, one attr, double quotes", () => {
  combinations('<a href="zzz">').forEach((str) => {
    ok(isCl(str, 8, 12), "01");
  });
});

test("02 - one tag, few attrs, double quotes", () => {
  combinations('<a href="zzz" target="_blank" style="color: black;">').forEach(
    (str) => {
      // 1. starting at the opening of "href":
      not.ok(isCl(str, 8, 8), "02.01");
      ok(isCl(str, 8, 12), "02.02"); // <--
      not.ok(isCl(str, 8, 21), "02.03");
      not.ok(isCl(str, 8, 28), "02.04");
      not.ok(isCl(str, 8, 36), "02.05");
      not.ok(isCl(str, 8, 50), "02.06");

      // 2. starting at the opening of "target":
      not.ok(isCl(str, 21, 8), "02.07");
      not.ok(isCl(str, 21, 12), "02.08");
      not.ok(isCl(str, 21, 21), "02.09");
      ok(isCl(str, 21, 28), "02.10"); // <--
      not.ok(isCl(str, 21, 36), "02.11");
      not.ok(isCl(str, 21, 50), "02.12");

      // 3. starting at the opening of "style":
      not.ok(isCl(str, 36, 8), "02.13");
      not.ok(isCl(str, 36, 12), "02.14");
      not.ok(isCl(str, 36, 21), "02.15");
      not.ok(isCl(str, 36, 28), "02.16");
      not.ok(isCl(str, 36, 36), "02.17");
      ok(isCl(str, 36, 50), "02.18"); // <--
    },
  );

  // fin.
});

test("03 - repeated singles inside doubles", () => {
  [
    '<img src="spacer.gif" alt="\'\'\'\'\'" width="1" height="1" border="0" style="display:block;"/>',
    '<img src="spacer.gif" alt=\'"""""\' width="1" height="1" border="0" style="display:block;"/>',
  ].forEach((str) => {
    // 0. warmup
    ok(isCl(str, 9, 20), "03.01");

    // 1. the bizness
    not.ok(isCl(str, 26, 9), "03.02");
    not.ok(isCl(str, 26, 20), "03.03");
    not.ok(isCl(str, 26, 26), "03.04");
    not.ok(isCl(str, 26, 27), "03.05");
    not.ok(isCl(str, 26, 28), "03.06");
    not.ok(isCl(str, 26, 29), "03.07");
    not.ok(isCl(str, 26, 30), "03.08");
    not.ok(isCl(str, 26, 31), "03.09");
    ok(isCl(str, 26, 32), "03.10"); // <--
    not.ok(isCl(str, 26, 40), "03.11");
  });

  // fin.
});

test("04", () => {
  combinations('<body alink="">').forEach((str) => {
    ok(isCl(str, 12, 13), "06");
  });
});

test("05 - links with redirects hardcoded", () => {
  combinations(`<a
 href="http://a.b.c/d/EDF/HIJ/KLM/NOP/q?r=https://www.codsen.com/st/uv-wx-yz-123.html&b=456" style="color:#000; text-decoration:none;" target="_blank">x</a>
>`).forEach((str) => {
    ok(isCl(str, 9, 94), "07.01");
    not.ok(isCl(str, 9, 102), "07.02");
    not.ok(isCl(str, 9, 136), "07.03");
    not.ok(isCl(str, 9, 145), "07.04");
    not.ok(isCl(str, 9, 152), "07.05");

    ok(isCl(str, 102, 136), "07.06");
    not.ok(isCl(str, 102, 145), "07.07");
    not.ok(isCl(str, 102, 152), "07.08");

    ok(isCl(str, 145, 152), "07.09");
  });
});

test("06 - url attribs within src", () => {
  [
    '<img src="https://z.com/r.png?a=" />',
    '<img src="https://z.com/r.png?a=b" />',
    '<img src="https://z.com/r.png?a=b=" />',
    '<img src="https://z.com/r.png?a===" />',
    '<img src="https://z.com/r.png?a=1&b=2" />',
    '<img src="https://z.com/r.png?a=1&b=2&" />',
    '<img src="https://z.com/r.png?a=1&b=2&=" />',
  ]
    .reduce((acc, curr) => acc.concat(combinations(curr)), [])
    .forEach((str) => {
      ok(isCl(str, 9, str.length - 4), "07");
    });
});

test("07 - no equal char in mailto", () => {
  combinations(
    '<a href="mailto:frank@wwdcdemo.example.com">John Frank</a>',
  ).forEach((str) => {
    ok(isCl(str, 8, 42), "09");
  });
});

test("08 - href with mailto and equal", () => {
  combinations(
    '<a href="mailto:foo@example.com?cc=bar@example.com&subject=Greetings%20from%20Cupertino!&body=Wish%20you%20were%20here!">John Frank</a>',
  ).forEach((str) => {
    ok(isCl(str, 8, 119), "10");
  });
});

test("09", () => {
  combinations('<img src="codsen.com/my-image.png?query=" />').forEach(
    (str) => {
      ok(isCl(str, 9, 40));
    },
  );
});

test("10", () => {
  combinations('<a href="codsen.com/my-image.png?query=">').forEach((str) => {
    ok(isCl(str, 8, 39));
  });
});

test("11", () => {
  combinations('<a zz="codsen.com/my-image.png?query=">').forEach((str) => {
    ok(isCl(str, 6, 37));
  });
});

test("12", () => {
  combinations('<a zz="codsen.com/my-image.png?a=1&b=">').forEach((str) => {
    ok(isCl(str, 6, 37));
  });
});

test("13", () => {
  combinations('<a zz="codsen.com/my-image.png?a=1&b=2">').forEach((str) => {
    ok(isCl(str, 6, 38));
  });
});

test("14 - text quotes", () => {
  combinations('abc "d" efg').forEach((str) => {
    not.ok(isCl(str, 4, 6), "10");
  });
});

test("15 - quote pairs inside font-family", () => {
  combinations(
    "<td style=\"font-family:'AbCd-Ef', 'AbCd', Ab, cd-ef;\">",
  ).forEach((str, idx) => {
    not.ok(isCl(str, 10, 23), `15.01.${`${idx}`.padStart(2, "0")} - "${str}"`);
    not.ok(isCl(str, 10, 31), `15.02.${`${idx}`.padStart(2, "0")} - "${str}"`);
    not.ok(isCl(str, 10, 34), `15.03.${`${idx}`.padStart(2, "0")} - "${str}"`);
    not.ok(isCl(str, 10, 39), `15.04.${`${idx}`.padStart(2, "0")} - "${str}"`);
    ok(isCl(str, 10, 52), `15.05.${`${idx}`.padStart(2, "0")} - "${str}"`);
  });
});

test("16", () => {
  combinations(
    "<td style=\"font-family:'AbCd-Ef', 'AbCd', Ab, cd-ef;\">\nzzz\n</td>",
  ).forEach((str, idx) => {
    not.ok(isCl(str, 10, 23), `16.01.${`${idx}`.padStart(2, "0")} - "${str}"`);
    not.ok(isCl(str, 10, 31), `16.02.${`${idx}`.padStart(2, "0")} - "${str}"`);
    not.ok(isCl(str, 10, 34), `16.03.${`${idx}`.padStart(2, "0")} - "${str}"`);
    not.ok(isCl(str, 10, 39), `16.04.${`${idx}`.padStart(2, "0")} - "${str}"`);
    ok(isCl(str, 10, 52), `16.05.${`${idx}`.padStart(2, "0")} - "${str}"`);
  });
});

test("17", () => {
  combinations(
    "<td style=\"font-family:'AbCd-Ef', 'AbCd', Ab, cd-ef;\" align=\"left\"></td>",
  ).forEach((str, idx) => {
    not.ok(isCl(str, 10, 23), `17.01.${`${idx}`.padStart(2, "0")} - "${str}"`);
    not.ok(isCl(str, 10, 31), `17.02.${`${idx}`.padStart(2, "0")} - "${str}"`);
    not.ok(isCl(str, 10, 34), `17.03.${`${idx}`.padStart(2, "0")} - "${str}"`);
    not.ok(isCl(str, 10, 39), `17.04.${`${idx}`.padStart(2, "0")} - "${str}"`);
    ok(isCl(str, 10, 52), `17.05.${`${idx}`.padStart(2, "0")} - "${str}"`);
    not.ok(isCl(str, 10, 60), `17.06.${`${idx}`.padStart(2, "0")} - "${str}"`);
    not.ok(isCl(str, 10, 65), `17.07.${`${idx}`.padStart(2, "0")} - "${str}"`);
  });
});

test.run();
