import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// whitespace control
// -----------------------------------------------------------------------------

test("01 - whitespace control - line breaks between tags", () => {
  equal(
    stripHtml("something <a> \n\n to <a> put here to test").result,
    "something\n\nto put here to test",
    "01.01",
  );
});

test("02 - whitespace control - line breaks within tag", () => {
  equal(
    stripHtml("something <a\n\n>  to <a> put here to test").result,
    "something to put here to test",
    "02.01",
  );
});

test("03 - whitespace control - leading inner tag linebreaks", () => {
  equal(
    stripHtml("something <\n\na>  to <a> put here to test").result,
    "something to put here to test",
    "03.01",
  );
});

test("04 - whitespace control - multiple tags, inner trailing linebreaks", () => {
  equal(
    stripHtml("something <a>  to <a\n\n> put here to test").result,
    "something to put here to test",
    "04.01",
  );
});

test("05 - whitespace control - multiple tags, inner leading linebreaks", () => {
  equal(
    stripHtml("something <a>  to <\n\na> put here to test").result,
    "something to put here to test",
    "05.01",
  );
});

test("06 - whitespace control - tabs and linebreaks inside, multiple tags", () => {
  equal(
    stripHtml("something <\t\na\n>  to <a\n\n> put here to test").result,
    "something to put here to test",
    "06.01",
  );
});

test("07 - whitespace control - even this", () => {
  equal(
    stripHtml("something <\n\na\t>\t\t\t\t\t  to \t<\n\na\t> put here to test")
      .result,
    "something to put here to test",
    "07.01",
  );
});

test("08 - whitespace control - adds a space in place of stripped tags, tight", () => {
  equal(stripHtml("a<div>b</div>c").result, "a b c", "08.01");
});

test("09 - whitespace control - adds a space in place of stripped tags, loose", () => {
  equal(stripHtml("a <div>   b    </div>    c").result, "a b c", "09.01");
});

test("10 - whitespace control - adds a space in place of stripped tags, tabs and LF's", () => {
  equal(
    stripHtml("\t\t\ta <div>   b    </div>    c\n\n\n").result,
    "a b c",
    "10.01",
  );
});

test("11 - whitespace control - adds a linebreak between each substring piece", () => {
  equal(
    stripHtml(`a


  <div>
    b
  </div>
c`).result,
    "a\n\nb\n\nc",
    "11.01",
  );
});

test("12 - whitespace control - multiple tag combo case #1", () => {
  equal(stripHtml("z<div><b>c</b></div>y").result, "z c y", "12.01");
  equal(stripHtml("z<a><div>c</div></a>y").result, "z c y", "12.02");
  equal(stripHtml("z<div><div>c</div></div>y").result, "z c y", "12.03");
  equal(stripHtml("z<a><b>c</b></a>y").result, "zcy", "12.04");
});

test("13 - whitespace control - multiple tag combo case #2", () => {
  equal(
    stripHtml(`
      z
        <a>
          <b class="something anything">
            c
          </b>
        </a>
      y`).result,
    "z\n\nc\n\ny",
    "13.01",
  );
});

test("14 - whitespace control - dirty html, trailing space", () => {
  // first tag is not self-closing
  equal(
    stripHtml("something <article>article> here").result,
    "something article> here",
    "14.01",
  );
  equal(
    stripHtml("something <article>article/> here").result,
    "something here",
    "14.02",
  );
  equal(
    stripHtml('something <article>article class="z"> here').result,
    "something here",
    "14.03",
  );
  equal(
    stripHtml('something <article>article class="z"/> here').result,
    "something here",
    "14.04",
  );

  // first tag is self-closing
  equal(
    stripHtml("something <article/>article> here").result,
    "something article> here",
    "14.05",
  );
  equal(
    stripHtml("something <article/>article/> here").result,
    "something here",
    "14.06",
  );
  equal(
    stripHtml('something <article/>article class="z"> here').result,
    "something here",
    "14.07",
  );
  equal(
    stripHtml('something <article/>article class="z"/> here').result,
    "something here",
    "14.08",
  );
});

test("15 - whitespace control - dirty html, few trailing spaces", () => {
  // first tag is not self-closing
  equal(
    stripHtml("something <article>article>   here").result,
    "something article>   here",
    "15.01",
  );
  equal(
    stripHtml("something <article>article/>   here").result,
    "something here",
    "15.02",
  );
  equal(
    stripHtml('something <article>article class="z">   here').result,
    "something here",
    "15.03",
  );
  equal(
    stripHtml('something <article>article class="z"/>   here').result,
    "something here",
    "15.04",
  );

  // first tag is self-closing
  equal(
    stripHtml("something <article/>article>   here").result,
    "something article>   here",
    "15.05",
  );
  equal(
    stripHtml("something <article/>article/>   here").result,
    "something here",
    "15.06",
  );
  equal(
    stripHtml('something <article/>article class="z">   here').result,
    "something here",
    "15.07",
  );
  equal(
    stripHtml('something <article/>article class="z"/>   here').result,
    "something here",
    "15.08",
  );
});

test("16 - tags on the edge of the string - normal", () => {
  equal(stripHtml("<a>\n<b>\n<c>x</c>\n</b>\n</a>").result, "x", "16.01");
});

test("17 - tags on the edge of the string - cb", () => {
  let gathered = [];
  let cb = (o) => {
    gathered.push(o.proposedReturn);
    o.rangesArr.push(o.proposedReturn);
  };
  equal(
    stripHtml(
      `<a>
<b>
<c>x</c>
</b>
</a>`,
      { cb },
    ).result,
    "x",
    "17.01",
  );
  equal(
    gathered,
    [
      [0, 4, undefined],
      [3, 8, ""],
      [7, 11, ""],
      [12, 17, " "],
      [16, 22, "\n"],
      [21, 26, null],
    ],
    "17.02",
  );
});

test("18 - indentations, mixed", () => {
  equal(
    stripHtml(`<a>
    A.
    B.</a>


  `).result,
    "A.\nB.",
    "18.01",
  );
});

test("19 - indentations, mixed", () => {
  equal(
    stripHtml(`<a>
    A.
    B.</a>


  `).result,
    "A.\nB.",
    "19.01",
  );
});

test("20 - indentations, tags in front", () => {
  equal(
    stripHtml(`  <a>x
  <a>y
  `).result,
    "x\ny",
    "20.01",
  );
});

test("21 - indentations, sneaky pair tags", () => {
  equal(
    stripHtml(`a
    <script>x    </script>  <script> y</script>  b`).result,
    "a\nb",
    "21.01",
  );
});

test.run();
