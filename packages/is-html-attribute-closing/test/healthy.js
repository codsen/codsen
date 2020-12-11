import tap from "tap";
import is from "../dist/is-html-attribute-closing.esm";
import { combinations } from "./util/util";
// const BACKSLASH = "\u005C";

// healthy code
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, one attr, double quotes`,
  (t) => {
    combinations(`<a href="zzz">`).forEach((str) => {
      t.true(is(str, 8, 12), "01");
    });
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - one tag, few attrs, double quotes`,
  (t) => {
    combinations(
      `<a href="zzz" target="_blank" style="color: black;">`
    ).forEach((str) => {
      // 1. starting at the opening of "href":
      t.false(is(str, 8, 8), "02.01");
      t.true(is(str, 8, 12), "02.02"); // <--
      t.false(is(str, 8, 21), "02.03");
      t.false(is(str, 8, 28), "02.04");
      t.false(is(str, 8, 36), "02.05");
      t.false(is(str, 8, 50), "02.06");

      // 2. starting at the opening of "target":
      t.false(is(str, 21, 8), "02.07");
      t.false(is(str, 21, 12), "02.08");
      t.false(is(str, 21, 21), "02.09");
      t.true(is(str, 21, 28), "02.10"); // <--
      t.false(is(str, 21, 36), "02.11");
      t.false(is(str, 21, 50), "02.12");

      // 3. starting at the opening of "style":
      t.false(is(str, 36, 8), "02.13");
      t.false(is(str, 36, 12), "02.14");
      t.false(is(str, 36, 21), "02.15");
      t.false(is(str, 36, 28), "02.16");
      t.false(is(str, 36, 36), "02.17");
      t.true(is(str, 36, 50), "02.18"); // <--
    });

    // fin.
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`healthy code`}\u001b[${39}m`} - repeated singles inside doubles`,
  (t) => {
    [
      `<img src="spacer.gif" alt="'''''" width="1" height="1" border="0" style="display:block;"/>`,
      `<img src="spacer.gif" alt='"""""' width="1" height="1" border="0" style="display:block;"/>`,
    ].forEach((str) => {
      // 0. warmup
      t.true(is(str, 9, 20), "03.01");

      // 1. the bizness
      t.false(is(str, 26, 9), "03.02");
      t.false(is(str, 26, 20), "03.03");
      t.false(is(str, 26, 26), "03.04");
      t.false(is(str, 26, 27), "03.05");
      t.false(is(str, 26, 28), "03.06");
      t.false(is(str, 26, 29), "03.07");
      t.false(is(str, 26, 30), "03.08");
      t.false(is(str, 26, 31), "03.09");
      t.true(is(str, 26, 32), "03.10"); // <--
      t.false(is(str, 26, 40), "03.11");
    });

    // fin.
    t.end();
  }
);

tap.test(`04`, (t) => {
  combinations(`<body alink="">`).forEach((str) => {
    t.true(is(str, 12, 13), "06");
  });
  t.end();
});

tap.test(`05 links with redirects hardcoded`, (t) => {
  combinations(`<a
 href="http://a.b.c/d/EDF/HIJ/KLM/NOP/q?r=https://www.codsen.com/st/uv-wx-yz-123.html&b=456" style="color:#000; text-decoration:none;" target="_blank">x</a>
>`).forEach((str) => {
    t.true(is(str, 9, 94), "07.01");
    t.false(is(str, 9, 102), "07.02");
    t.false(is(str, 9, 136), "07.03");
    t.false(is(str, 9, 145), "07.04");
    t.false(is(str, 9, 152), "07.05");

    t.true(is(str, 102, 136), "07.06");
    t.false(is(str, 102, 145), "07.07");
    t.false(is(str, 102, 152), "07.08");

    t.true(is(str, 145, 152), "07.09");
  });
  t.end();
});

tap.test(`06 url attribs within src`, (t) => {
  [
    `<img src="https://z.com/r.png?a=" />`,
    `<img src="https://z.com/r.png?a=b" />`,
    `<img src="https://z.com/r.png?a=b=" />`,
    `<img src="https://z.com/r.png?a===" />`,
    `<img src="https://z.com/r.png?a=1&b=2" />`,
    `<img src="https://z.com/r.png?a=1&b=2&" />`,
    `<img src="https://z.com/r.png?a=1&b=2&=" />`,
  ]
    .reduce((acc, curr) => acc.concat(combinations(curr)), [])
    .forEach((str) => {
      t.true(is(str, 9, str.length - 4), "07");
    });
  t.end();
});

tap.test(`07 no equal char in mailto`, (t) => {
  combinations(
    `<a href="mailto:frank@wwdcdemo.example.com">John Frank</a>`
  ).forEach((str) => {
    t.true(is(str, 8, 42), "09");
  });
  t.end();
});

tap.test(`08 href with mailto and equal`, (t) => {
  combinations(
    `<a href="mailto:foo@example.com?cc=bar@example.com&subject=Greetings%20from%20Cupertino!&body=Wish%20you%20were%20here!">John Frank</a>`
  ).forEach((str) => {
    t.true(is(str, 8, 119), "10");
  });
  t.end();
});

tap.test(`09`, (t) => {
  combinations(`<img src="codsen.com/my-image.png?query=" />`).forEach(
    (str) => {
      t.true(is(str, 9, 40));
    }
  );
  t.end();
});

tap.test(`10`, (t) => {
  combinations(`<a href="codsen.com/my-image.png?query=">`).forEach((str) => {
    t.true(is(str, 8, 39));
  });
  t.end();
});

tap.test(`11`, (t) => {
  combinations(`<a zz="codsen.com/my-image.png?query=">`).forEach((str) => {
    t.true(is(str, 6, 37));
  });
  t.end();
});

tap.test(`12`, (t) => {
  combinations(`<a zz="codsen.com/my-image.png?a=1&b=">`).forEach((str) => {
    t.true(is(str, 6, 37));
  });
  t.end();
});

tap.test(`13`, (t) => {
  combinations(`<a zz="codsen.com/my-image.png?a=1&b=2">`).forEach((str) => {
    t.true(is(str, 6, 38));
  });
  t.end();
});

tap.test(`14 text quotes`, (t) => {
  combinations(`abc "d" efg`).forEach((str) => {
    t.false(is(str, 4, 6), "10");
  });
  t.end();
});
