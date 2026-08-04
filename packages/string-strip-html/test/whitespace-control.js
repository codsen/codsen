// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// whitespace control
// -----------------------------------------------------------------------------

test("001 - whitespace control - line breaks between tags", () => {
  equal(
    stripHtml("something <a> \n\n to <a> put here to test").result,
    "something\n\nto put here to test",
    "001.01",
  );
});

test("002 - whitespace control - line breaks within tag", () => {
  equal(
    stripHtml("something <a\n\n>  to <a> put here to test").result,
    "something to put here to test",
    "002.01",
  );
});

test("003 - whitespace control - leading inner tag linebreaks", () => {
  equal(
    stripHtml("something <\n\na>  to <a> put here to test").result,
    "something to put here to test",
    "003.01",
  );
});

test("004 - whitespace control - multiple tags, inner trailing linebreaks", () => {
  equal(
    stripHtml("something <a>  to <a\n\n> put here to test").result,
    "something to put here to test",
    "004.01",
  );
});

test("005 - whitespace control - multiple tags, inner leading linebreaks", () => {
  equal(
    stripHtml("something <a>  to <\n\na> put here to test").result,
    "something to put here to test",
    "005.01",
  );
});

test("006 - whitespace control - tabs and linebreaks inside, multiple tags", () => {
  equal(
    stripHtml("something <\t\na\n>  to <a\n\n> put here to test").result,
    "something to put here to test",
    "006.01",
  );
});

test("007 - whitespace control - even this", () => {
  equal(
    stripHtml("something <\n\na\t>\t\t\t\t\t  to \t<\n\na\t> put here to test")
      .result,
    "something to put here to test",
    "007.01",
  );
});

test("008 - whitespace control - adds a space in place of stripped tags, tight", () => {
  equal(stripHtml("a<div>b</div>c").result, "a b c", "008.01");
});

test("009 - whitespace control - adds a space in place of stripped tags, loose", () => {
  equal(stripHtml("a <div>   b    </div>    c").result, "a b c", "009.01");
});

test("010 - whitespace control - adds a space in place of stripped tags, tabs and LF's", () => {
  equal(
    stripHtml("\t\t\ta <div>   b    </div>    c\n\n\n").result,
    "a b c",
    "010.01",
  );
});

test("011 - whitespace control - adds a linebreak between each substring piece", () => {
  equal(
    stripHtml(`a


  <div>
    b
  </div>
c`).result,
    "a\n\nb\n\nc",
    "011.01",
  );
});

test("012 - whitespace control - multiple tag combo case #1", () => {
  equal(stripHtml("z<div><b>c</b></div>y").result, "z c y", "012.01");
  equal(stripHtml("z<a><div>c</div></a>y").result, "z c y", "012.02");
  equal(stripHtml("z<div><div>c</div></div>y").result, "z c y", "012.03");
  equal(stripHtml("z<a><b>c</b></a>y").result, "zcy", "012.04");
});

test("013 - whitespace control - multiple tag combo case #2", () => {
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
    "013.01",
  );
});

test("014 - whitespace control - dirty html, trailing space", () => {
  // first tag is not self-closing
  equal(
    stripHtml("something <article>article> here").result,
    "something article> here",
    "014.01",
  );
  equal(
    stripHtml("something <article>article/> here").result,
    "something here",
    "014.02",
  );
  equal(
    stripHtml('something <article>article class="z"> here').result,
    "something here",
    "014.03",
  );
  equal(
    stripHtml('something <article>article class="z"/> here').result,
    "something here",
    "014.04",
  );

  // first tag is self-closing
  equal(
    stripHtml("something <article/>article> here").result,
    "something article> here",
    "014.05",
  );
  equal(
    stripHtml("something <article/>article/> here").result,
    "something here",
    "014.06",
  );
  equal(
    stripHtml('something <article/>article class="z"> here').result,
    "something here",
    "014.07",
  );
  equal(
    stripHtml('something <article/>article class="z"/> here').result,
    "something here",
    "014.08",
  );
});

test("015 - whitespace control - dirty html, few trailing spaces", () => {
  // first tag is not self-closing
  equal(
    stripHtml("something <article>article>   here").result,
    "something article>   here",
    "015.01",
  );
  equal(
    stripHtml("something <article>article/>   here").result,
    "something here",
    "015.02",
  );
  equal(
    stripHtml('something <article>article class="z">   here').result,
    "something here",
    "015.03",
  );
  equal(
    stripHtml('something <article>article class="z"/>   here').result,
    "something here",
    "015.04",
  );

  // first tag is self-closing
  equal(
    stripHtml("something <article/>article>   here").result,
    "something article>   here",
    "015.05",
  );
  equal(
    stripHtml("something <article/>article/>   here").result,
    "something here",
    "015.06",
  );
  equal(
    stripHtml('something <article/>article class="z">   here').result,
    "something here",
    "015.07",
  );
  equal(
    stripHtml('something <article/>article class="z"/>   here').result,
    "something here",
    "015.08",
  );
});

test("016 - tags on the edge of the string - normal", () => {
  equal(stripHtml("<a>\n<b>\n<c>x</c>\n</b>\n</a>").result, "x", "016.01");
});

test("017 - tags on the edge of the string - cb", () => {
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
    "017.01",
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
    "017.02",
  );
});

test("018 - indentations, mixed", () => {
  equal(
    stripHtml(`<a>
    A.
    B.</a>


  `).result,
    "A.\nB.",
    "018.01",
  );
});

test("019 - indentations, mixed", () => {
  equal(
    stripHtml(`<a>
    A.
    B.</a>


  `).result,
    "A.\nB.",
    "019.01",
  );
});

test("020 - indentations, tags in front", () => {
  equal(
    stripHtml(`  <a>x
  <a>y
  `).result,
    "x\ny",
    "020.01",
  );
});

test("021 - indentations, sneaky pair tags", () => {
  equal(
    stripHtml(`a
    <script>x    </script>  <script> y</script>  b`).result,
    "a\nb",
    "021.01",
  );
});

test.run();
