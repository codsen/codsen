import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm";

// whitespace control
// -----------------------------------------------------------------------------

tap.test("01 - whitespace control - line breaks between tags", (t) => {
  t.match(
    stripHtml("something <a> \n\n to <a> put here to test"),
    { result: "something\n\nto put here to test" },
    "01"
  );
  t.end();
});

tap.test("02 - whitespace control - line breaks within tag", (t) => {
  t.match(
    stripHtml("something <a\n\n>  to <a> put here to test"),
    { result: "something to put here to test" },
    "02"
  );
  t.end();
});

tap.test("03 - whitespace control - leading inner tag linebreaks", (t) => {
  t.match(
    stripHtml("something <\n\na>  to <a> put here to test"),
    { result: "something to put here to test" },
    "03"
  );
  t.end();
});

tap.test(
  "04 - whitespace control - multiple tags, inner trailing linebreaks",
  (t) => {
    t.match(
      stripHtml("something <a>  to <a\n\n> put here to test"),
      { result: "something to put here to test" },
      "04"
    );
    t.end();
  }
);

tap.test(
  "05 - whitespace control - multiple tags, inner leading linebreaks",
  (t) => {
    t.match(
      stripHtml("something <a>  to <\n\na> put here to test"),
      { result: "something to put here to test" },
      "05"
    );
    t.end();
  }
);

tap.test(
  "06 - whitespace control - tabs and linebreaks inside, multiple tags",
  (t) => {
    t.match(
      stripHtml("something <\t\na\n>  to <a\n\n> put here to test"),
      { result: "something to put here to test" },
      "06"
    );
    t.end();
  }
);

tap.test("07 - whitespace control - even this", (t) => {
  t.match(
    stripHtml("something <\n\na\t>\t\t\t\t\t  to \t<\n\na\t> put here to test"),
    { result: "something to put here to test" },
    "07"
  );
  t.end();
});

tap.test(
  "08 - whitespace control - adds a space in place of stripped tags, tight",
  (t) => {
    t.match(stripHtml("a<div>b</div>c"), { result: "a b c" }, "08");
    t.end();
  }
);

tap.test(
  "09 - whitespace control - adds a space in place of stripped tags, loose",
  (t) => {
    t.match(
      stripHtml("a <div>   b    </div>    c"),
      { result: "a b c" },
      "09 - stays on one line because it was on one line"
    );
    t.end();
  }
);

tap.test(
  "10 - whitespace control - adds a space in place of stripped tags, tabs and LF's",
  (t) => {
    t.match(
      stripHtml("\t\t\ta <div>   b    </div>    c\n\n\n"),
      { result: "a b c" },
      "10 - like 02 above but with trimming"
    );
    t.end();
  }
);

tap.test(
  "11 - whitespace control - adds a linebreak between each substring piece",
  (t) => {
    t.match(
      stripHtml(`a


  <div>
    b
  </div>
c`),
      { result: "a\n\nb\n\nc" },
      "11"
    );
    t.end();
  }
);

tap.test("12 - whitespace control - multiple tag combo case #1", (t) => {
  t.match(stripHtml("z<a><b>c</b></a>y"), { result: "z c y" }, "12");
  t.end();
});

tap.test("13 - whitespace control - multiple tag combo case #2", (t) => {
  t.match(
    stripHtml(`
      z
        <a>
          <b class="something anything">
            c
          </b>
        </a>
      y`),
    { result: "z\n\nc\n\ny" },
    "13"
  );
  t.end();
});

tap.test("14 - whitespace control - dirty html, trailing space", (t) => {
  t.match(
    stripHtml("something <article>article> here"),
    { result: "something here" },
    "14"
  );
  t.end();
});

tap.test("15 - whitespace control - dirty html, few trailing spaces", (t) => {
  t.match(
    stripHtml("something <article>article>   here"),
    { result: "something here" },
    "15"
  );
  t.end();
});
