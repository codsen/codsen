import tap from "tap";
import { comb } from "./util/util";

// inputs were pre-mangled by html-minifier
// -----------------------------------------------------------------------------

tap.test("01 - pair of tags, tight", (t) => {
  const source = `<body><h2 style=padding:0;margin:10px class=test>News</h2></body>`;
  const intended = `<body><h2 style=padding:0;margin:10px>News</h2></body>`;

  t.equal(comb(t, source).result, intended, "01");
  t.end();
});

tap.test("02 - pair of tags, spaced", (t) => {
  const source = `<body><h2 style=padding:0;margin:10px class=test >News</h2></body>`;
  const intended = `<body><h2 style=padding:0;margin:10px>News</h2></body>`;

  t.equal(comb(t, source).result, intended, "02");
  t.end();
});

tap.test("03 - self-closing tag, tight", (t) => {
  const source = `<body><br style=padding:0;margin:10px class=test/>News</body>`;
  const intended = `<body><br style=padding:0;margin:10px/>News</body>`;

  t.equal(comb(t, source).result, intended, "03");
  t.end();
});

tap.test("04 - self-closing tag, spaced", (t) => {
  const source = `<body><br style=padding:0;margin:10px class=test />News</body>`;
  const intended = `<body><br style=padding:0;margin:10px/>News</body>`;

  t.equal(comb(t, source).result, intended, "04");
  t.end();
});
