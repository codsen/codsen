import { test } from "uvu";
import { equal } from "uvu/assert";

import { m } from "./util/util.js";

test("01 - an escaped quote in an identifier does not open a CSS string", () => {
  const sources = [
    String.raw`<style>.foo\"bar::before{content:"/*literal*/"}</style>`,
    String.raw`<style>.foo\'bar::before{content:'/*literal*/'}</style>`,
  ];
  const results = [];
  for (const source of sources) {
    for (const removeCSSComments of [false, true]) {
      const actual = m(equal, source, { removeCSSComments });
      results.push([
        actual.result === source,
        actual.applicableOpts.removeCSSComments,
      ]);
    }
  }

  equal(
    results,
    Array.from({ length: 4 }, () => [true, false]),
    "01.01",
  );
});

test("02 - odd backslash runs keep quotes and apparent comments inside strings", () => {
  const results = [];
  for (const count of [1, 3]) {
    for (const quote of ['"', "'"]) {
      const source = `<style>a{content:${quote}x${"\\".repeat(count)}${quote}/*literal*/y${quote}}</style>`;
      const actual = m(equal, source);
      results.push([
        actual.result === source,
        actual.applicableOpts.removeCSSComments,
      ]);
    }
  }

  equal(
    results,
    Array.from({ length: 4 }, () => [true, false]),
    "02.01",
  );
});

test("03 - even backslash runs allow a string to close before a real comment", () => {
  const results = [];
  for (const count of [2, 4]) {
    for (const quote of ['"', "'"]) {
      const source = `<style>a{content:${quote}x${"\\".repeat(count)}${quote};/*remove*/color:red}</style>`;
      for (const removeCSSComments of [false, true]) {
        const actual = m(equal, source, { removeCSSComments });
        results.push([
          actual.result ===
            (removeCSSComments ? source.replace("/*remove*/", "") : source),
          actual.applicableOpts.removeCSSComments,
        ]);
      }
    }
  }

  equal(
    results,
    Array.from({ length: 8 }, () => [true, true]),
    "03.01",
  );
});

test("04 - preserves apparent comments inside unquoted URL tokens", () => {
  const values = [
    String.raw`url(foo\/*bar*/baz)`,
    "url(foo/*bar*/baz)",
    "URL(foo/*bar*/baz)",
    String.raw`u\72l(foo/*bar*/baz)`,
    String.raw`\75rl(foo/*bar*/baz)`,
    String.raw`url(foo\)/*bar*/baz)`,
  ];
  const results = [];
  for (const value of values) {
    for (const removeCSSComments of [false, true]) {
      const source = `<style>.x{background:${value}}</style>`;
      const actual = m(equal, source, { removeCSSComments });
      results.push([
        actual.result === source,
        actual.applicableOpts.removeCSSComments,
      ]);
    }
  }

  equal(
    results,
    Array.from({ length: 12 }, () => [true, false]),
    "04.01",
  );
});

test("05 - preserves quoted URL data and its CSS string whitespace", () => {
  const values = [
    'url("a  /*literal*/b")',
    "url('a  /*literal*/b')",
    String.raw`url("a\"  /*literal*/b")`,
  ];
  const results = values.map((value) => {
    const source = `<style>.x{background:${value}}</style>`;
    const actual = m(equal, source, {
      removeLineBreaks: true,
      lineLengthLimit: 10,
    });
    return [
      actual.result.includes(value),
      actual.applicableOpts.removeCSSComments,
    ];
  });

  equal(
    results,
    values.map(() => [true, false]),
    "05.01",
  );
});

test("06 - removes real comments around opaque strings and URL values", () => {
  const source = String.raw`<style>/*remove*/.foo\"bar{content:"/*literal*/";background:url(foo/*literal*/bar);/*remove*/color:red}</style>`;
  const results = [false, true].map((removeCSSComments) => {
    const actual = m(equal, source, { removeCSSComments });
    return [
      actual.result ===
        (removeCSSComments ? source.replaceAll("/*remove*/", "") : source),
      actual.applicableOpts.removeCSSComments,
    ];
  });

  equal(
    results,
    [
      [true, true],
      [true, true],
    ],
    "06.01",
  );
});

test("07 - recognizes HTML-encoded quotes before processing inline CSS", () => {
  const value = "content:&quot;a  b /*literal*/&quot;;color:red";
  const source = `<div style="${value}">x</div>`;
  const results = [];
  for (const removeIndentations of [false, true]) {
    for (const removeLineBreaks of [false, true]) {
      for (const removeCSSComments of [false, true]) {
        const actual = m(equal, source, {
          removeIndentations,
          removeLineBreaks,
          removeCSSComments,
          lineLengthLimit: 10,
        });
        results.push([
          actual.result.includes(`style="${value}"`),
          actual.applicableOpts.removeCSSComments,
        ]);
      }
    }
  }

  equal(
    results,
    Array.from({ length: 8 }, () => [true, false]),
    "07.01",
  );
});

test("08 - preserves encoded backslashes and CSS string continuations", () => {
  const values = [
    "font-family:&#92;31  a",
    "font-family:&#x5c;31  a",
    "font-family:&bsol;31  a",
    "content:&quot;a&#92;&quot;  b /*literal*/&quot;",
    "content:&quot;a&#92;&#10;b /*literal*/&quot;",
    "content:&quot;a&#92;&#13;&#10;b /*literal*/&quot;",
    "content:&quot;a&#92;\nb /*literal*/&quot;",
  ];
  const results = values.map((value) => {
    const source = `<div style="${value}">x</div>`;
    const actual = m(equal, source, {
      removeLineBreaks: true,
      lineLengthLimit: 10,
    });
    return [
      actual.result.includes(`style="${value}"`),
      actual.applicableOpts.removeCSSComments,
    ];
  });

  equal(
    results,
    values.map(() => [true, false]),
    "08.01",
  );
});

test("09 - decodes HTML references only once before classifying CSS comments", () => {
  const source = '<div style="content:&amp;quot;;/*remove*/color:red">x</div>';
  const results = [false, true].map((removeCSSComments) => {
    const actual = m(equal, source, { removeCSSComments });
    return [
      actual.result ===
        (removeCSSComments ? source.replace("/*remove*/", "") : source),
      actual.applicableOpts.removeCSSComments,
    ];
  });

  equal(
    results,
    [
      [true, true],
      [true, true],
    ],
    "09.01",
  );
});

test("10 - does not HTML-decode references inside raw style content", () => {
  const source = "<style>.x{content:&quot;;/*remove*/color:red}</style>";
  const results = [false, true].map((removeCSSComments) => {
    const actual = m(equal, source, { removeCSSComments });
    return [
      actual.result ===
        (removeCSSComments ? source.replace("/*remove*/", "") : source),
      actual.applicableOpts.removeCSSComments,
    ];
  });

  equal(
    results,
    [
      [true, true],
      [true, true],
    ],
    "10.01",
  );
});

test("11 - removes decoded inline comments using complete raw reference spans", () => {
  const comments = [
    "&#47;*remove*&#47;",
    "&#x2f;*remove*&#x2f;",
    "&sol;*remove*&sol;",
    "&#47;&#42;remove&#42;&#47;",
  ];
  const results = [];
  for (const comment of comments) {
    const source = `<div style="color:red;${comment}margin:0">x</div>`;
    for (const removeCSSComments of [false, true]) {
      const actual = m(equal, source, { removeCSSComments });
      results.push([
        actual.result ===
          (removeCSSComments
            ? '<div style="color:red;margin:0">x</div>'
            : source),
        actual.applicableOpts.removeCSSComments,
      ]);
    }
  }

  equal(
    results,
    Array.from({ length: 8 }, () => [true, true]),
    "11.01",
  );
});

test("12 - ends an unfinished CSS comment at the actual closing style tag", () => {
  const source =
    "<style>/*unfinished</style><p>/*literal*/ x</p><style>/*remove*/.x{color:red}</style>";
  const actual = m(equal, source);

  equal(
    actual.result,
    "<style></style><p>/*literal*/ x</p><style>.x{color:red}</style>",
    "12.01",
  );
  equal(actual.applicableOpts.removeCSSComments, true, "12.02");
});

test("13 - ends an unfinished CSS string at the actual closing style tag", () => {
  const source =
    '<style>.x{content:"/*literal*/</style><p>/*literal*/ x</p><style>/*remove*/.x{color:red}</style>';
  const actual = m(equal, source);

  equal(actual.result, source.replace("/*remove*/", ""), "13.01");
  equal(actual.applicableOpts.removeCSSComments, true, "13.02");
});

test("14 - respects HTML attribute quotes after unfinished CSS tokens", () => {
  const sources = [
    String.raw`<div style="font-family:a\" title="/*literal*/">x</div><p style="color:red;/*remove*/">y</p>`,
    `<div style='content:"/*literal*/' title="/*literal*/">x</div><p style="color:red;/*remove*/">y</p>`,
    '<div style="color:red;/*unfinished" title="/*literal*/">x</div><p style="color:red;/*remove*/">y</p>',
  ];
  const results = sources.map((source) => {
    const actual = m(equal, source);
    return [
      actual.result ===
        source.replace("/*unfinished", "").replace("/*remove*/", ""),
      actual.applicableOpts.removeCSSComments,
    ];
  });

  equal(
    results,
    sources.map(() => [true, true]),
    "14.01",
  );
});

test("15 - apparent comments in HTML text and unrelated attributes are inapplicable", () => {
  const sources = [
    '<p title="/*literal*/">style="color:red;/*literal*/"</p>',
    '<script>const x="/*literal*/";</script>',
    '<!-- <div style="/*literal*/"></div> -->',
    '<style>.x{content:"/*literal*/</style><p>/*literal*/</p>',
  ];
  const results = [];
  for (const source of sources) {
    for (const removeCSSComments of [false, true]) {
      const actual = m(equal, source, { removeCSSComments });
      results.push([
        actual.result === source,
        actual.applicableOpts.removeCSSComments,
      ]);
    }
  }

  equal(
    results,
    Array.from({ length: 8 }, () => [true, false]),
    "15.01",
  );
});

test("16 - retains the newline that terminates an invalid CSS string", () => {
  const results = [];
  for (const newline of ["\n", "\r", "\r\n", "\f"]) {
    const value = `content:"a${newline} b"`;
    const sources = [
      `<style>a{${value}}</style>`,
      `<div style='${value}'>x</div>`,
    ];
    for (const source of sources) {
      for (const removeLineBreaks of [false, true]) {
        const actual = m(equal, source, {
          removeLineBreaks,
          lineLengthLimit: 0,
          breakToTheLeftOf: [],
        });
        results.push(actual.result.includes(value));
      }
    }
  }

  equal(results, Array(16).fill(true), "16.01");
});

test("17 - preserves conditional CSS while removing requested HTML comments", () => {
  const source = String.raw`<!--[if mso]><style>.\31  a{content:"/*literal*/"}</style><![endif]--><p>x</p>`;

  equal(m(equal, source).result, source, "17.01");
  equal(
    m(equal, source, { removeHTMLComments: 2 }).result,
    String.raw`<style>.\31  a{content:"/*literal*/"}</style><p>x</p>`,
    "17.02",
  );
  equal(
    m(
      equal,
      String.raw`<!-- <style>.\31  a{content:"/*literal*/"}</style> --><p>x</p>`,
      { removeHTMLComments: true },
    ).result,
    "<p>x</p>",
    "17.03",
  );
});

test("18 - removes real comments beside protected escape whitespace", () => {
  const sources = [
    String.raw`<style>.x{font-family:a\ b /*remove*/;color:red}</style>`,
    String.raw`<style>.x{content:"a\"b" /*remove*/;color:red}</style>`,
  ];
  const results = [];
  for (const source of sources) {
    for (const removeCSSComments of [false, true]) {
      const actual = m(equal, source, { removeCSSComments });
      results.push([
        actual.result ===
          (removeCSSComments ? source.replace("/*remove*/", "") : source),
        actual.applicableOpts.removeCSSComments,
      ]);
    }
  }

  equal(
    results,
    Array.from({ length: 4 }, () => [true, true]),
    "18.01",
  );
});

test.run();
